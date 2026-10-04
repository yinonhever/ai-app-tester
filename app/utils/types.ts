import type {
  Scan as ScanData,
  Scenario as ScenarioData,
  ScenarioStep as ScenarioStepData
} from "~~/shared/types";

type WithDatabaseMeta<T> = T & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Scan = WithDatabaseMeta<ScanData>;

export type Scenario = WithDatabaseMeta<ScenarioData> & {
  scenarioNum?: number;
};

export type ScenarioStep = WithDatabaseMeta<ScenarioStepData>;
