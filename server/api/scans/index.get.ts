import { getResultTally } from "~~/shared/functions";

export default defineEventHandler(async () => {
  const scans = await Scan.find().sort({ startDate: -1 }).lean();

  return scans.map(scan => {
    const { scenarios, ...data } = scan;
    return {
      ...data,
      scenarioCount: scenarios?.length ?? 0,
      tally: getResultTally(scan)
    };
  });
});
