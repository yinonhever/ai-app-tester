import type { Scan as ScanData } from "~~/shared/types";

type WithDatabaseMeta<T> = T & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type Scan = WithDatabaseMeta<ScanData>;
