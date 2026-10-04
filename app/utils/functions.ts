import type { Scenario } from "./types";

export const convertScenarios = (scenarios: Scenario[]): Scenario[] =>
  scenarios.map<Scenario>((scenario, index) => ({
    ...scenario,
    scenarioNum: index + 1
  }));
