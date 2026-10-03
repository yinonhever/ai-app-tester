import type { SCAN_STATUSES, STEP_TYPES, VERDICTS } from "./constants";

export type StepType = (typeof STEP_TYPES)[number];

export interface ScenarioStep {
  type: StepType;
  /** Plain-language description of the element (e.g. "the Add to cart button"). null for "back" steps. */
  description: string | null;
  /** Value to type/press, for "fill"/"press" steps. */
  value?: string | null;
}

export interface StepResult {
  step: ScenarioStep;
  success: boolean;
  error?: string;
}

export interface Scenario {
  id: string;
  description: string;
  steps: ScenarioStep[];
  evaluation?: Evaluation;
}

export type Verdict = (typeof VERDICTS)[number];

export interface Evaluation {
  verdict: Verdict;
  explanation: string;
}

export type ScanStatus = (typeof SCAN_STATUSES)[number];

export interface Scan {
  targetUrl: string;
  maxScenarios: number;
  status: ScanStatus;
  currentStage?: string;
  startDate: Date;
  endDate?: Date;
  scenarios?: Scenario[];
  scenarioCount?: number;
  tally?: Tally;
}

export type Tally = Record<Verdict, number>;
