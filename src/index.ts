import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { formatPercent, range } from "./utils";
import {
  gameFromTTR,
  pointFromGame,
  gameFromPointWithAdvantage,
} from "./probabilities";

const config = {
  deltaTTR: {
    max: 800,
    step: 10,
  },
  separator: ";",
  language: "de-DE",
  precision: 0,
  outputPath: resolve(__dirname, "..", "output"),
};

const deltaTTRs = range(0, config.deltaTTR.max, config.deltaTTR.step);
const pointAdvantages = range(0, 10);
const gameWinExpectations = deltaTTRs.map((ttr) => gameFromTTR(-ttr));
const pointWinProbabilities = gameWinExpectations.map(pointFromGame);
const gameWinWithAdvantages = pointWinProbabilities.map((p) =>
  pointAdvantages
    .map((s) => gameFromPointWithAdvantage(p, s))
    .map(formatPercent(config.language, config.precision))
);

const columnHeaders = pointAdvantages;
const rowHeaders = deltaTTRs;

const lines = [
  ["", ...columnHeaders],
  ...gameWinWithAdvantages.map((list, i) => [rowHeaders[i], ...list]),
];
const csv = lines.map((line) => line.join(config.separator)).join("\n");
mkdirSync(config.outputPath, { recursive: true });
writeFileSync(resolve(config.outputPath, "result.csv"), csv, "utf8");
