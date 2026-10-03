import { convertScanData } from "../../utils/functions";

export default defineEventHandler(async () => {
  const scans = await Scan.find().sort({ startDate: -1 }).lean();
  return scans.map(scan => convertScanData(scan, false));
});
