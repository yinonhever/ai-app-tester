// Stage 1: AI looks at the app and generates candidate test scenarios
// Stage 2: AI prioritizes them (built into the same call as Stage 1 here)
// Stage 3: Playwright executes each scenario's steps in order
// Stage 4: AI evaluates the outcome and labels it PASS / FAIL / SUSPICIOUS / IMPROVEMENT

import { launchSession, snapshot, runScenario } from "./browser";
import { askClaudeJSON } from "./claudeClient";
import type {
  PageState,
  PlanningResponse,
  ResolveTargetResponse,
  ScenarioResult
} from "../types";
import type { Evaluation, Scenario, StepResult } from "~~/shared/types";
import type { ScanDocument } from "~~/server/models/scan";
import { getResultTally } from "../functions";

// ---- Stage 1 + 2: plan and prioritize ----
const buildPlanningPrompt = (state: PageState): string => {
  return `
You are an AI test planner looking at a web app for the first time.

Interactive elements visible on the page:
${state.domSummary || "(none found)"}

Generate a list of test scenarios worth running against this app —
core flows (sign up, log in, search, add to cart, checkout, etc.) as
well as edge cases. Scenarios CAN have multiple steps across page
navigations (e.g. click a product, then click Add to cart on the page
that opens) — you don't need to know what later pages look like yet.

This test runs in a fixed desktop-width browser window. Do NOT generate
scenarios involving mobile-specific UI (hamburger menus, mobile nav
drawers, responsive breakpoints) — these elements will not exist or be
visible at this viewport size, and testing them here is meaningless.

For each step, write a short plain-language "description" of the
element to interact with (e.g. "the Add to cart button", "the search
input field") — NOT an index, NOT a selector, NOT locator syntax. Each
step's actual element will be located on whatever page is on screen
when that step runs.

Order the list with the MOST IMPORTANT scenarios first.

Respond ONLY with JSON in this exact shape, no other text:
{
  "scenarios": [
    {
      "id": "short-id",
      "description": "what this scenario checks",
      "steps": [
        { "type": "click|fill|press|back", "description": "plain description of the element, or null for back", "value": "value for fill/press, or null" }
      ]
    }
  ]
}
`.trim();
};

const resolveTarget = async (
  description: string | null,
  domSummary: string
): Promise<string | null> => {
  const prompt = `
Find the element matching this description on the CURRENT page: "${description}"

Elements currently on this page, each line starting with its index number.
Some lines include "(near: ...)" showing nearby heading text — use this to
tell apart elements that share the same label but belong to different
sections (e.g. two "SEE PRODUCT" buttons for two different products):
${domSummary || "(none found)"}

Respond ONLY with JSON: { "index": "<number as string>" }
If nothing matches, respond: { "index": null }
`.trim();

  const { index } = await askClaudeJSON<ResolveTargetResponse>(prompt);
  return index;
};

// ---- Stage 4: evaluate ----
const buildEvaluationPrompt = (
  scenario: Scenario,
  stepResults: StepResult[],
  afterState: PageState
): string => {
  return `
You are an AI QA evaluator. A test scenario was just executed by an
automated browser. Judge the outcome.

Scenario: ${scenario.description}

Step-by-step execution result:
${stepResults
  .map(
    (r, i) =>
      `${i + 1}. ${r.step.type} ${r.step.description ?? ""} -> ${
        r.success ? "ok" : `FAILED: ${r.error}`
      }`
  )
  .join("\n")}

Current page state after execution:
URL: ${afterState.url}
Visible elements: ${afterState.domSummary || "(none found)"}
New console errors: ${afterState.consoleErrors.length ? afterState.consoleErrors.join("\n") : "(none)"}
New failed requests: ${afterState.failedRequests.length ? afterState.failedRequests.join("\n") : "(none)"}

Note: Next.js apps commonly show an aborted HEAD request to a .json data file during
client-side navigation — this is normal route-prefetch behavior, not a bug, unless the
page's actual content visibly fails to load as a result.

Look at the attached screenshot of the resulting page. Decide a verdict:
- PASS: the scenario worked as expected, nothing wrong
- FAIL: something is clearly broken (a step failed, or the result contradicts what should have happened)
- SUSPICIOUS: unclear / looks possibly wrong but not certain — flag for human review instead of calling it a confirmed bug
- IMPROVEMENT: it technically works, but something could be clearer, more accessible, or better designed

If a step failed to interact with an element (timeout, not clickable), this could mean
EITHER the test automation targeted the wrong element, OR the app genuinely has a broken/
unresponsive control. Look at the screenshot carefully: does the element appear visibly
present, enabled, and in a normal state (suggesting automation's fault — use SUSPICIOUS),
or does something look visibly wrong, missing, or broken (suggesting a real bug — use FAIL)?
If you truly cannot tell from the screenshot, use SUSPICIOUS rather than guessing FAIL.

If the scenario involves viewing a cart, list, or search results, an "empty" state
(e.g. "Your cart is empty") is the CORRECT and EXPECTED result when nothing was added
or no matching items exist — it is NOT a bug. Only mark FAIL if the empty state appears
despite items that should be present, or if the interface itself is broken (not displaying,
not responding, showing an error).

Do not choose FAIL if your own explanation expresses uncertainty (words like "unclear",
"may have", "without clear confirmation", "questionable"). If you are not fully certain
something is broken, use SUSPICIOUS instead. FAIL is reserved for cases you can confidently
point to as clearly, visibly wrong.

Respond ONLY with JSON in this exact shape, no other text:
{ "verdict": "PASS|FAIL|SUSPICIOUS|IMPROVEMENT", "explanation": "why" }
`.trim();
};

/**
 * Deterministic evaluation for any scenario where a step failed mechanically
 * (element not found, timeout, etc). Never sent to the AI as a FAIL
 * candidate — see the project README for why.
 */
const buildAutomationFailureEvaluation = (
  stepResults: StepResult[]
): Evaluation => {
  const failedStep = stepResults.find(r => !r.success)!;
  const stepNum = stepResults.indexOf(failedStep) + 1;
  const action = failedStep.step.description || "this action";
  const error = failedStep.error ?? "";

  let explanation: string;
  if (error.startsWith("No element matching")) {
    explanation = `Step ${stepNum} ("${action}") — the test couldn't locate this element on the page. This may mean the element is worded or positioned differently than expected, not necessarily a bug.`;
  } else if (error.toLowerCase().includes("timeout")) {
    explanation = `Step ${stepNum} ("${action}") — automated browser testing can occasionally mistime an interaction with animated or dynamically-loaded content. Recommend a quick manual check to confirm.`;
  } else {
    explanation = `Step ${stepNum} ("${action}") — the test was unable to complete this step automatically (${error}). Recommend a quick manual check.`;
  }

  return { verdict: "SUSPICIOUS", explanation };
};

export const runScan = async (scan: ScanDocument) => {
  const { _id: scanId, targetUrl, maxScenarios } = scan;

  try {
    const start = new Date();
    console.log(`Starting scan ${scanId} on ${targetUrl}`, start);

    scan.currentStage = "Generating test scenarios...";
    await scan.save();

    const { browser, page, consoleErrors, failedRequests } =
      await launchSession(targetUrl);

    // Stage 1 + 2
    const initialState = await snapshot(page, consoleErrors, failedRequests);
    console.log("Asking Claude to generate and prioritize test scenarios...");
    const { scenarios } = await askClaudeJSON<PlanningResponse>(
      buildPlanningPrompt(initialState),
      initialState.screenshot
    );

    const chosen = scenarios.slice(0, maxScenarios);
    console.log(
      `\nPlanned ${scenarios.length} scenarios, running top ${chosen.length}:`
    );
    chosen.forEach((s, i) =>
      console.log(`  ${i + 1}. [${s.id}] ${s.description}`)
    );

    scan.scenarios = chosen;
    await scan.save();

    const results: ScenarioResult[] = [];

    for (const [scenarioIndex, scenario] of chosen.entries()) {
      console.log(`\n--- Running: ${scenario.description} ---`);

      scan.currentStage = `Running scenario ${scenarioIndex + 1} of ${chosen.length}...`;
      await scan.save();

      // Stage 3
      const stepResults = await runScenario(
        page,
        scenario,
        (description, domSummary) => resolveTarget(description, domSummary)
      );

      // Stage 4
      scan.currentStage = `Evaluating scenario ${scenarioIndex + 1} of ${chosen.length}...`;
      await scan.save();

      const afterState = await snapshot(page, consoleErrors, failedRequests);
      const allStepsSucceeded = stepResults.every(r => r.success);

      const evaluation: Evaluation = allStepsSucceeded
        ? await askClaudeJSON<Evaluation>(
            buildEvaluationPrompt(scenario, stepResults, afterState),
            afterState.screenshot
          )
        : buildAutomationFailureEvaluation(stepResults);

      console.log(`  -> ${evaluation.verdict}: ${evaluation.explanation}`);
      results.push({ scenario, evaluation });

      const scenarioInDocument = scan.scenarios.find(
        item => item.id === scenario.id
      );
      if (scenarioInDocument) scenarioInDocument.evaluation = evaluation;
      await scan.save();

      // Reset to the target URL between scenarios so each one starts clean.
      await page.goto(targetUrl, { waitUntil: "networkidle" });
    }

    await browser.close();

    console.log("\n=== AI App Tester Report ===\n");
    results.forEach(({ scenario, evaluation }) => {
      console.log(
        `[${evaluation.verdict}] ${scenario.description}\n  ${evaluation.explanation}\n`
      );
    });
    const tally = getResultTally(scan);
    console.log("Summary:", tally);

    const end = new Date();

    scan.status = "completed";
    scan.currentStage = "Completed";
    scan.endDate = end;
    await scan.save();

    console.log(`Scan ${scanId} ended`, end);
    console.log(
      "Run duration in ms",
      Math.abs(end.getTime() - start.getTime())
    );
  } catch (err: any) {
    console.log(`Error in running scan ${scanId} on ${targetUrl}`, err);
  }
};
