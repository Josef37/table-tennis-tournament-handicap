import { writeFileSync } from "fs";
import { range, zip } from "lodash";
import { resolve } from "path";
import { inspect } from "util";

export const gameFromSet = (r: number) => {
  return r ** 3 * (10 - 15 * r + 6 * r ** 2);
};

export const setFromPoint = (p: number) => {
  return setFromPointWithAdvantage(p, 0);
};

export const setFromPointWithAdvantage = (p: number, s: number) => {
  let x1 = 0;
  for (let i = 0; i <= 9; i++) {
    x1 += choose(10 - s + i, i) * (1 - p) ** i;
  }
  const x2 =
    choose(20 - s, 10) * p * (1 - p) ** 10 * (1 / (1 - 2 * p + 2 * p ** 2));
  return p ** (11 - s) * (x1 + x2);
};

export const gameFromPoint = (p: number) => gameFromPointWithAdvantage(p, 0);

export const gameFromPointWithAdvantage = (p: number, s: number) =>
  gameFromSet(setFromPointWithAdvantage(p, s));

export const gameFromTTR = (ttrDiff: number) => {
  return 1 / (1 + 10 ** (ttrDiff / 150));
};

export const pointFromGame = (q: number) => {
  return newtonsMethod((p) => gameFromPoint(p) - q, 0.5);
};

export const advantageForChance = (p: number, chance: number) => {
  return newtonsMethod((s) => gameFromPointWithAdvantage(p, s) - chance, 0);
};

export const choose = (n: number, k: number) => {
  var result = 1;
  for (let i = 1; i <= k; i++) {
    result *= (n + 1 - i) / i;
  }
  return result;
};

type Func = (x: number) => number;

const derivative =
  (f: Func, h = 0.001) =>
  (x: number) =>
    (f(x + h) - f(x - h)) / (2 * h);

export const newtonsMethod = (f: Func, x = 0, { precision = 0.001 } = {}) => {
  const approx = x - f(x) / derivative(f)(x);

  if (Number.isNaN(approx)) {
    throw new Error("Newton method failed.");
  }

  if (Math.abs(approx - x) < precision) {
    return approx;
  }

  return newtonsMethod(f, approx, { precision });
};

const formatPercent = (x: number) => (100 * x).toFixed(2) + "%";

const advantages = range(0, 11, 1);
const deltaTTRs = range(0, 801, 10);
const expectations = deltaTTRs.map((_) => gameFromTTR(_));
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
