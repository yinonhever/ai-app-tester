import type { TableHeader, Scan, FormattedScan, Scenario } from "./types";
import _ from "lodash";
import dayjs from "dayjs";

export const adjustHeaders = <T>(
  headers: TableHeader<T>[],
  sortable = true
): TableHeader<T>[] =>
  headers
    .filter(header => header.include !== false)
    .map<TableHeader<T>>(header => ({
      ...header,
      sortable: sortable && header.sortable !== false
    }));

export const removeScriptTags = (htmlString: string) =>
  htmlString.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

export const convertHTML = (htmlString: string) => {
  try {
    return removeScriptTags(htmlString.replaceAll("\n", "<br>"));
  } catch {
    return htmlString;
  }
};

export const formatStatus = (status: string): string =>
  _.upperFirst(_.lowerCase(status));

export const formatDate = (date: string | Date) =>
  dayjs(date).format("D MMMM YYYY, HH:mm");

export const formatScanData = (scan: Scan): FormattedScan => ({
  ...scan,
  formattedStartDate: formatDate(scan.startDate),
  formattedEndDate: scan.endDate && formatDate(scan.endDate),
  formattedStatus: formatStatus(scan.status)
});
