import { writeFileSync } from "fs";
import { range } from "lodash";
import { resolve } from "path";
import { formatPercent } from "./utils";
import {
  gameFromTTR,
  pointFromGame,
  gameFromPointWithAdvantage,
} from "./probabilities";

const advantages = range(0, 11, 1);
const deltaTTRs = range(0, 801, 10);
const expectations = deltaTTRs.map((ttr) => gameFromTTR(-ttr));
const points = expectations.map((_) => pointFromGame(_));
const withAdvantages = points.map((p) =>
  advantages.map((s) => ({
    pointAdvantage: s,
    winProbability: formatPercent(gameFromPointWithAdvantage(p, s)),
  }))
);

const result = [] as any[];
for (let i = 0; i < deltaTTRs.length; i++) {
  result.push({
    deltaTTR: deltaTTRs[i],
    // expectedWinProbability: formatPercent(expectations[i]),
    // expectedPoint: formatPercent(points[i]),
    advantages: withAdvantages[i],
  });
}
writeFileSync(
  resolve(__dirname, "..", "output", "output.json"),
  JSON.stringify(result, null, 2),
  "utf8"
);

const table = [
  ["", ...advantages].join(";"),
  ...withAdvantages.map((list, i) =>
    [
      deltaTTRs[i],
      ...list.map((element) => element.winProbability.replace(".", ",")),
    ].join(";")
  ),
].join("\n");
writeFileSync(resolve(__dirname, "..", "output", "output.csv"), table, "utf8");
