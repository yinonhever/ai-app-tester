import { populateScanData } from "~~/server/utils/functions";

export default defineEventHandler(async event => {
  const scanId = getRouterParam(event, "scanId");

  const scan = await Scan.findById(scanId).lean();

  if (!scan) {
    throw createError({
      statusCode: 404,
      statusMessage: "Scan not found",
      data: { msg: `No scan found with ID ${scanId}` }
    });
  }

  return populateScanData(scan);
});
