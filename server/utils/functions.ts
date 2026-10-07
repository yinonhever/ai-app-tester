import type { Scan, Tally } from "~~/shared/types";

export const getResultTally = (scan: Scan): Tally => {
  const tally: Tally = { PASS: 0, FAIL: 0, SUSPICIOUS: 0, IMPROVEMENT: 0 };
  scan.scenarios?.forEach(({ evaluation }) => {
    if (evaluation) tally[evaluation.verdict]++;
  });
  return tally;
};

export const convertScanData = (scan: Scan, includeScenarios = true): Scan => {
  const { scenarios, ...dataWithoutScenarios } = scan;

  if (includeScenarios) {
    scenarios?.forEach((scenario, index) => {
      scenario.scenarioNum = index + 1;
    });
  }

  return {
    ...(includeScenarios ? scan : dataWithoutScenarios),
    scenarioCount: scenarios?.length ?? 0,
    tally: getResultTally(scan)
  };
};

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));
