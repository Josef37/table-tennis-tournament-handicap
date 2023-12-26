import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { outputConfig } from "./config";

/**
 * Two digits after decimal point and adds percent sign, e.g. "12.34%".
 */
export const formatPercent =
  (locales: string, precision = 2) =>
  (x: number) =>
    x
      .toLocaleString(locales, {
        style: "percent",
        maximumFractionDigits: precision,
        minimumFractionDigits: precision,
      })
      .replace(/\s/, "");

export const writeCsv = (
  fileName: string,
  {
    columnHeaders,
    rowHeaders,
    data,
  }: {
    columnHeaders: { toString: () => string }[];
    rowHeaders: { toString: () => string }[];
    data: { toString: () => string }[][];
  }
) => {
  const csv = [
    ["", ...columnHeaders],
    ...data.map((row, i) => [rowHeaders[i], ...row]),
  ]
    .map((row) => row.join(outputConfig.separator))
    .join("\n");

  mkdirSync(outputConfig.path, { recursive: true });
  writeFileSync(resolve(outputConfig.path, fileName), csv, "utf8");
};
