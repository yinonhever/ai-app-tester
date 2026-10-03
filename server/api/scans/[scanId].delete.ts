export default defineEventHandler(async event => {
  const scanId = getRouterParam(event, "scanId");

  const deletedScan = await Scan.findByIdAndDelete(scanId);

  if (!deletedScan) {
    throw createError({
      statusCode: 404,
      statusMessage: "Scan not found",
      data: { msg: `No scan found with ID ${scanId}` }
    });
  }

  return { msg: "Successfully deleted scan", scanId };
});
