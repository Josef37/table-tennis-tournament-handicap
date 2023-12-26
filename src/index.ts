import { writeCsv, formatPercent } from "./csv";
import { range } from "./utils";
import { Calculations, GameConfig, pointFromTTR } from "./probabilities";
import { outputConfig } from "./config";

const writeTTRDiffLookup = (
  deltaTTRs: number[],
  gameConfig: GameConfig = { points: 11, sets: 3 }
) => {
  const calc = new Calculations(gameConfig);
  const pointAdvantages = range(0, gameConfig.points - 1);
  const pointWin = deltaTTRs.map((ttr) => pointFromTTR(-ttr));
  const gameWinWithAdvantages = pointWin.map((p) =>
    pointAdvantages
      .map((s) => calc.gameFromPointWithAdvantage(p, s))
      .map(formatPercent(outputConfig.language, outputConfig.precision))
  );

  return writeCsv("ttrDiffLookup.csv", {
    columnHeaders: pointAdvantages,
    rowHeaders: deltaTTRs,
    data: gameWinWithAdvantages,
  });
};

interface Player {
  name: string;
  ttr: number;
}
const writePlayerAdvantages = (
  players: Player[],
  gameConfig: GameConfig = { points: 11, sets: 3 }
) => {
  const calc = new Calculations(gameConfig);
  const desiredChance = 0.5;
  const data: string[][] = [];

  const getAdvantage = (player: Player, opponent: Player) => {
    if (player.ttr === opponent.ttr) return 0;

    const [worse, better] = [player, opponent].sort((a, b) => a.ttr - b.ttr);
    const pointWin = pointFromTTR(worse.ttr - better.ttr);
    const advantage = Math.ceil(
      calc.advantageForChance(pointWin, desiredChance)
    );
    const gameWin = calc.gameFromPointWithAdvantage(pointWin, advantage);

    // Always pick the advantage in favor of the better player - unless it's only 5 %.
    if (gameWin > desiredChance + 0.05) {
      return advantage - 1;
    } else {
      return advantage;
    }
  };

  for (const player of players) {
    const row: string[] = [];
    for (const opponent of players) {
      const adv = getAdvantage(player, opponent);
      if (player.ttr > opponent.ttr) row.push(`0:${adv}`);
      else row.push(`${adv}:0`);
    }
    data.push(row);
  }

  return writeCsv("playerMatrix.csv", {
    columnHeaders: players.map((_) => _.name),
    rowHeaders: players.map((_) => _.name),
    data: data,
  });
};

writeTTRDiffLookup(range(0, 800, 10));

writePlayerAdvantages([
  { name: "Skipper", ttr: 1800 },
  { name: "Kowalski", ttr: 1600 },
  { name: "Rico", ttr: 1500 },
  { name: "Private", ttr: 1100 },
  { name: "Alex", ttr: 1200 },
  { name: "Marty", ttr: 1300 },
  { name: "Gloria", ttr: 900 },
  { name: "Melman", ttr: 800 },
]);
