import { z } from "zod";
import { populateScanData } from "~~/server/utils/functions";

const ScanInsertSchema = z.object({
  targetUrl: z.string(),
  maxScenarios: z.number()
});

export default defineEventHandler(async event => {
  const result = await readValidatedBody(event, body =>
    ScanInsertSchema.safeParse(body)
  );

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid scan data",
      data: z.treeifyError(result.error)
    });
  }

  const { targetUrl, maxScenarios } = result.data;

  const scan = await Scan.create({ targetUrl, maxScenarios });

  runScan(scan);

  return populateScanData(scan.toObject());
});
