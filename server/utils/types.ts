import type { Browser, Page } from "playwright";
import type { Scenario, Evaluation } from "~~/shared/types";

export interface PlanningResponse {
  scenarios: Scenario[];
}

export interface SessionHandle {
  browser: Browser;
  page: Page;
  /** Mutated in place by Playwright event listeners; drained by snapshot(). */
  consoleErrors: string[];
  failedRequests: string[];
}

export interface PageState {
  screenshot: Buffer;
  /** Numbered, human-readable list of visible interactive elements. */
  domSummary: string;
  consoleErrors: string[];
  failedRequests: string[];
  url: string;
}

export type ResolveTarget = (
  description: string | null,
  domSummary: string
) => Promise<string | null>;

export interface ScenarioResult {
  scenario: Scenario;
  evaluation: Evaluation;
}

export interface ResolveTargetResponse {
  index: string | null;
}

export interface ClaudeContentBlock {
  type: "text";
  text: string;
}

export interface ClaudeMessagesResponse {
  content: ClaudeContentBlock[];
}
