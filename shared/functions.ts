import type { Scan, Tally } from "./types";

export const getResultTally = (scan: Scan): Tally => {
  const tally: Tally = { PASS: 0, FAIL: 0, SUSPICIOUS: 0, IMPROVEMENT: 0 };
  for (const { evaluation } of scan.scenarios ?? []) {
    if (evaluation) tally[evaluation.verdict]++;
  }
  return tally;
};
