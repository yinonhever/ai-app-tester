import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument
} from "mongoose";
import type {
  Evaluation,
  Scan as ScanType,
  Scenario,
  ScenarioStep
} from "~~/shared/types";
import { SCAN_STATUSES, STEP_TYPES, VERDICTS } from "~~/shared/constants";

const scenarioStepSchema = new Schema<ScenarioStep>({
  type: { type: String, required: true, enum: STEP_TYPES },
  description: { type: String, required: false },
  value: { type: String, required: false }
});

const evaluationSchema = new Schema<Evaluation>({
  verdict: { type: String, required: true, enum: VERDICTS },
  explanation: { type: String, required: true }
});

const scenarioSchema = new Schema<Scenario>({
  id: { type: String, required: true },
  description: { type: String, required: true },
  steps: { type: [scenarioStepSchema], required: true },
  evaluation: { type: evaluationSchema, required: false }
});

const scanSchema = new Schema<ScanType>(
  {
    targetUrl: { type: String, required: true },
    maxScenarios: { type: Number, required: true },
    status: { type: String, enum: SCAN_STATUSES, default: "in_progress" },
    currentStage: { type: String, required: false },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: false },
    scenarios: { type: [scenarioSchema], default: () => [] },
    errorMsg: { type: String, required: false }
  },
  { timestamps: true }
);

export type ScanDocument = HydratedDocument<InferSchemaType<typeof scanSchema>>;

export const Scan = model<ScanType>("Scan", scanSchema);
