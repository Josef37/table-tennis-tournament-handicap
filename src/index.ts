import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { buildCsv, formatPercent, range } from "./utils";
import { Calculations, GameConfig } from "./probabilities";
import { outputConfig } from "./config";

const buildTTRDiffLookup = (
  gameConfig: GameConfig = { points: 11, sets: 3 },
  deltaTTRs = range(0, 800, 10)
) => {
  const calc = new Calculations(gameConfig);
  const pointAdvantages = range(0, 10);
  const gameWinExpectations = deltaTTRs.map((ttr) => calc.gameFromTTR(-ttr));
  const pointWinProbabilities = gameWinExpectations.map(calc.pointFromGame);
  const gameWinWithAdvantages = pointWinProbabilities.map((p) =>
    pointAdvantages
      .map((s) => calc.gameFromPointWithAdvantage(p, s))
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
