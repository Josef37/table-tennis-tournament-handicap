import { choose, newtonsMethod } from "./utils";

/**
 * Calculates the probability of winning a game - i.e. three sets,
 * when `r` is the probability of winning a set.
 */

export const gameFromSet = (r: number) => {
  return r ** 3 * (10 - 15 * r + 6 * r ** 2);
};

/**
 * Calculates the probability of winning a set - i.e. eleven points,
 * when `p` is the probability of winning a point.
 */
export const setFromPoint = (p: number) => {
  return setFromPointWithAdvantage(p, 0);
};

/**
 * Calculates the probability of winning a set - i.e. eleven points,
 * when `p` is the probability of winning a point
 * and given `s` points advantage - i.e. starting with a score of s:0.
 */
export const setFromPointWithAdvantage = (p: number, s: number) => {
  let x1 = 0;
  for (let i = 0; i <= 9; i++) {
    x1 += choose(10 - s + i, i) * (1 - p) ** i;
  }
  const x2 =
    choose(20 - s, 10) * p * (1 - p) ** 10 * (1 / (1 - 2 * p + 2 * p ** 2));
  return p ** (11 - s) * (x1 + x2);
};

/**
 * Calculates the probability of winning a game - i.e. three sets,
 * when `p` is the probability of winning a point.
 */
export const gameFromPoint = (p: number) => gameFromPointWithAdvantage(p, 0);

/**
 * Calculates the probability of winning a game - i.e. three sets,
 * when `p` is the probability of winning a point
 * and given `s` points advantage each set - i.e. starting with a score of s:0.
 */
export const gameFromPointWithAdvantage = (p: number, s: number) =>
  gameFromSet(setFromPointWithAdvantage(p, s));

/**
 * Calculates the expected probability of winning a game,
 * when you have `ttrDiff` more TTR points than your opponent.
 */
export const gameFromTTR = (ttrDiff: number) => {
  return 1 / (1 + 10 ** (-ttrDiff / 150));
};

/**
 * Numerically solves the equation `q = gameFromPoint(p)` for `p`.
 * I.e. given the probability `q` of winning a game,
 * what is the corresponding probability `p` of winning a point?
 */
export const pointFromGame = (q: number) => {
  return newtonsMethod((p) => gameFromPoint(p) - q, 0.5);
};

/**
 * With `p` being the probability of winning a point,
 * what advantage `s` do we have to give the player,
 * so he wins the game with a probability of `q`?
 *
 * CAUTION: This method tends to overshoot and fail.
 */
export const advantageForChance = (p: number, q: number) => {
  return newtonsMethod((s) => gameFromPointWithAdvantage(p, s) - q, 0);
};
