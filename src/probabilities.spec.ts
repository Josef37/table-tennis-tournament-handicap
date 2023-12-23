import tap, { Test } from "tap";
import {
  advantageForChance,
  gameFromPoint,
  gameFromSet,
  gameFromTTR,
  pointFromGame,
  setFromPoint,
  setFromPointWithAdvantage,
} from "./probabilities";
import { isClose, larger } from "./testUtils";

/**
 * Checks if the computed probability is "symmetrical".
 * In particular `f(p) + f(1-p) = 1`.
 * Also checks the edge-cases `p=0` and `p=1`.
 */
const checkSymmetry = (t: Test) => (f: (p: number) => number) => {
  // Obvious cases.
  t.equal(f(0), 0);
  t.equal(f(0.5), 0.5);
  t.equal(f(1), 1);

  // Sum with opponents probability is always 1.
  isClose(t)(f(0.1) + f(0.9), 1);
  isClose(t)(f(0.2) + f(0.8), 1);
  isClose(t)(f(0.3) + f(0.7), 1);
  isClose(t)(f(0.4) + f(0.6), 1);

  // No way to check if the formula is actually correct...
};

tap.test("setFromPoint", async (t) => {
  checkSymmetry(t)(setFromPoint);
});

tap.test("setFromPointWithAdvantage", async (t) => {
  // Do those results make sense?
  larger(t)(setFromPointWithAdvantage(0.5, 10), 0.99);
  larger(t)(setFromPointWithAdvantage(0.5, 1), 0.5);
});

tap.test("gameFromSet", async (t) => {
  checkSymmetry(t)(gameFromSet);
});

tap.test("gameFromPoint", async (t) => {
  checkSymmetry(t)(gameFromPoint);

  // Do those results make sense?
  isClose(t)(gameFromPoint(0.6), 0.97, 0.01);
  isClose(t)(gameFromPoint(0.55), 0.82, 0.01);
});

tap.test("pointFromGame", async (t) => {
  // At the bounds of the interval `[0,1]` the function `gameFromPoint`
  // flattens out drastically. This function only makes small steps
  // there and thus terminates too early.
  // checkFromSubProbability(t)(pointFromGame);

  // Do those results make sense?
  isClose(t)(pointFromGame(0.97), 0.6, 0.01);
  isClose(t)(pointFromGame(0.82), 0.55, 0.01);
});

tap.test("advantageForChance", async (t) => {
  t.equal(advantageForChance(0.5, 0.5), 0);
  isClose(t)(advantageForChance(0.45, 0.5), 2, 0.1);
  // This function fails by overshooting for probabilities beyond `0.4`.
});

tap.test("gameFromTTR", async (t) => {
  t.equal(gameFromTTR(0), 0.5);
  t.equal(gameFromTTR(-150), 1 / 11);
  t.equal(gameFromTTR(-300), 1 / 101);
  t.equal(gameFromTTR(300), 100 / 101);
});
