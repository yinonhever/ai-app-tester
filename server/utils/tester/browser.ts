/// <reference lib="dom" />

import { chromium, type Locator, type Page } from "playwright";
import type {
  PageState,
  ResolveTarget,
  Scenario,
  SessionHandle,
  StepResult
} from "../types";

const SELECTOR = "button, a, input, select, textarea";
const VISIBLE_SELECTOR = `${SELECTOR}:visible`; // Playwright's own visibility check, applied consistently everywhere below

export const launchSession = async (url: string): Promise<SessionHandle> => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];
  page.on(
    "console",
    msg => msg.type() === "error" && consoleErrors.push(msg.text())
  );
  page.on("requestfailed", r =>
    failedRequests.push(`${r.method()} ${r.url()} — ${r.failure()?.errorText}`)
  );
  page.on(
    "response",
    r => r.status() >= 400 && failedRequests.push(`${r.status()} ${r.url()}`)
  );

  await page.goto(url, { waitUntil: "networkidle" });
  return { browser, page, consoleErrors, failedRequests };
};

export const autoScroll = async (page: Page): Promise<void> => {
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const steps = Math.ceil(pageHeight / viewportHeight);

  for (let i = 1; i <= steps; i++) {
    await page.evaluate(y => window.scrollTo(0, y), i * viewportHeight);
    await page.waitForTimeout(50);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
};

interface ElementInfo {
  label: string;
  tag: string;
  context: string;
}

/**
 * Builds the numbered list from page.locator (Playwright's own engine),
 * using the SAME ":visible"-filtered selector that elementByIndex uses below —
 * this is what keeps the numbering and the actual click target in sync.
 */
export const getElementList = async (page: Page): Promise<string> => {
  const locator = page.locator(VISIBLE_SELECTOR);
  const count = await locator.count();
  const lines: string[] = [];

  for (let i = 0; i < count && i < 50; i++) {
    const el = locator.nth(i);
    const info = await el.evaluate((node): ElementInfo => {
      const label =
        node.getAttribute("aria-label") ||
        node.getAttribute("placeholder") ||
        (node as HTMLElement).innerText?.trim() ||
        node.getAttribute("name") ||
        "(unlabeled)";
      const tag = node.tagName.toLowerCase();

      // Walk up the DOM looking for the nearest ancestor containing a
      // heading — this is what distinguishes two identical "SEE PRODUCT"
      // buttons that belong to two different product sections.
      let context = "";
      let ancestor = node.parentElement;
      for (let depth = 0; ancestor && depth < 6 && !context; depth++) {
        const heading = ancestor.querySelector("h1, h2, h3, h4, h5, h6");
        if ((heading as HTMLElement | null)?.innerText?.trim()) {
          context = (heading as HTMLElement).innerText.trim();
        }
        ancestor = ancestor.parentElement;
      }

      return { label, tag, context };
    });

    const suffix =
      info.context && info.context !== info.label
        ? ` (near: "${info.context}")`
        : "";
    lines.push(`${i}: ${info.tag}: ${info.label}${suffix}`);
  }

  return lines.join("\n");
};

const elementByIndex = (page: Page, index: string): Locator => {
  return page.locator(VISIBLE_SELECTOR).nth(Number(index));
};

export const snapshot = async (
  page: Page,
  consoleErrors: string[],
  failedRequests: string[]
): Promise<PageState> => {
  await autoScroll(page);
  const screenshot = await page.screenshot({ fullPage: true });
  const domSummary = await getElementList(page);
  const newConsoleErrors = consoleErrors.splice(0, consoleErrors.length);
  const newFailedRequests = failedRequests.splice(0, failedRequests.length);
  return {
    screenshot,
    domSummary,
    consoleErrors: newConsoleErrors,
    failedRequests: newFailedRequests,
    url: page.url()
  };
}

export const runScenario = async (
  page: Page,
  scenario: Scenario,
  resolveTarget: ResolveTarget
): Promise<StepResult[]> => {
  await autoScroll(page);
  const stepResults: StepResult[] = [];

  for (const step of scenario.steps) {
    try {
      if (step.type === "back") {
        await page.goBack({ waitUntil: "networkidle" });
        await page.waitForTimeout(400);
        await autoScroll(page);
        stepResults.push({ step, success: true });
        continue;
      }

      const domSummary = await getElementList(page);
      const index = await resolveTarget(step.description, domSummary);
      if (index === null || index === undefined) {
        throw new Error(
          `No element matching "${step.description}" found on the current page`
        );
      }

      const el = elementByIndex(page, index);
      await el.scrollIntoViewIfNeeded({ timeout: 10000 }); // now matches the other steps' timeout instead of silently defaulting to 30s

      switch (step.type) {
        case "click":
          await el.click({ timeout: 10000 });
          break;
        case "fill":
          await el.fill(step.value ?? "", { timeout: 10000 });
          break;
        case "press":
          await el.press(step.value as string, { timeout: 10000 });
          break;
        default:
          throw new Error(`Unknown step type: ${step.type}`);
      }

      // Let any navigation/lazy-loading triggered by that action actually
      // finish before we trust the next snapshot's element list.
      await page.waitForLoadState("networkidle").catch(() => {});
      await page.waitForTimeout(600);

      await autoScroll(page);
      stepResults.push({ step, success: true });
    } catch (err) {
      stepResults.push({
        step,
        success: false,
        error: (err as Error).message
      });
      break;
    }
  }
  return stepResults;
}
