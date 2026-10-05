import type {
  Scan as ScanData,
  Scenario as ScenarioData,
  ScenarioStep as ScenarioStepData,
  Verdict
} from "~~/shared/types";
import type { FetchError } from "ofetch";

type WithDatabaseMeta<T> = T & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Scan = WithDatabaseMeta<ScanData>;

export type FormattedScan = Scan & {
  formattedStartDate?: string;
  formattedEndDate?: string;
  formattedStatus?: string;
  scenarios?: Scenario[];
};

export type Scenario = WithDatabaseMeta<ScenarioData> & {
  steps: ScenarioStep[];
};

export type ScenarioStep = WithDatabaseMeta<ScenarioStepData>;

export interface NavItem {
  link: string;
  text: string;
}

export type BaseError = Error | FetchError | string | null | undefined;

export interface TableHeader<T = string> {
  title: string;
  key?: T | "actions";
  value?: T | "actions";
  include?: boolean;
  sortable?: boolean;
  sort?: (a: any, b: any) => any;
  fixed?: boolean;
  width?: string;
  maxWidth?: string;
  minWidth?: string;
  cellProps?: { class?: string };
  headerProps?: { class?: string };
}

export interface Notification {
  id: string;
  content: string;
  icon: string;
}

export type AddNotification = (content: string, icon: string) => void;

export type RemoveNotification = (id: string) => void;

export type ResultSummaryType = "grid" | "row";

export interface ScenarioFilters {
  result: Verdict[];
}
