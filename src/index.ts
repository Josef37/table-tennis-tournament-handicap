import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { buildCsv, formatPercent, range } from "./utils";
import {
  gameFromTTR,
  pointFromGame,
  gameFromPointWithAdvantage,
} from "./probabilities";
import { outputConfig } from "./config";

const buildTTRDiffLookup = (deltaTTRs = range(0, 800, 10)) => {
  const pointAdvantages = range(0, 10);
  const gameWinExpectations = deltaTTRs.map((ttr) => gameFromTTR(-ttr));
  const pointWinProbabilities = gameWinExpectations.map(pointFromGame);
  const gameWinWithAdvantages = pointWinProbabilities.map((p) =>
    pointAdvantages
      .map((s) => gameFromPointWithAdvantage(p, s))
      .map(formatPercent(outputConfig.language, outputConfig.precision))
  );

  return buildCsv({
    columnHeaders: pointAdvantages,
    rowHeaders: deltaTTRs,
    data: gameWinWithAdvantages,
  });
};

const ttrDiffCsv = buildTTRDiffLookup();
mkdirSync(outputConfig.path, { recursive: true });
writeFileSync(resolve(outputConfig.path, "result.csv"), ttrDiffCsv, "utf8");
