import { writeCsv, formatPercent } from "./csv";
import { range } from "./utils";
import { Calculations, GameConfig } from "./probabilities";
import { outputConfig } from "./config";

const writeTTRDiffLookup = (
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

  return writeCsv("result.csv", {
    columnHeaders: pointAdvantages,
    rowHeaders: deltaTTRs,
    data: gameWinWithAdvantages,
  });
};

writeTTRDiffLookup();
