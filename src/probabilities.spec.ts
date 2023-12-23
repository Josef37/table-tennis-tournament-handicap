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
import { EPSILON, isClose, larger } from "./testUtils";

const checkBounds = (t: Test) => async (f: (p: number) => number) => {
  isClose(t)(f(0), 0);
  isClose(t)(f(0.5), 0.5);
  isClose(t)(f(1), 1);
};

/**
 * Checks if the computed probability is "symmetrical".
 * In particular `f(p) + f(1-p) = 1`.
 */
const checkSymmetry =
  (t: Test, delta = EPSILON) =>
  async (f: (p: number) => number) => {
    isClose(t, delta)(f(0.1) + f(0.9), 1);
    isClose(t, delta)(f(0.2) + f(0.8), 1);
    isClose(t, delta)(f(0.3) + f(0.7), 1);
    isClose(t, delta)(f(0.4) + f(0.6), 1);
  };

tap.test("setFromPoint", async (t) => {
  checkBounds(t)(setFromPoint);
  checkSymmetry(t)(setFromPoint);
  // No way to check if the formula is actually correct...
});

tap.test("setFromPointWithAdvantage", async (t) => {
  // Do those results make sense?
  larger(t)(setFromPointWithAdvantage(0.5, 10), 0.99);
  larger(t)(setFromPointWithAdvantage(0.5, 1), 0.5);
});

tap.test("gameFromSet", async (t) => {
  checkBounds(t)(gameFromSet);
  checkSymmetry(t)(gameFromSet);
  // No way to check if the formula is actually correct...
});

tap.test("gameFromPoint", async (t) => {
  checkBounds(t)(gameFromPoint);
  checkSymmetry(t)(gameFromPoint);
  // No way to check if the formula is actually correct...

  // Do those results make sense?
  isClose(t, 0.01)(gameFromPoint(0.6), 0.97);
  isClose(t, 0.01)(gameFromPoint(0.55), 0.82);
});

tap.test("pointFromGame", async (t) => {
  // At the bounds of the interval `[0,1]` the function `gameFromPoint`
  // flattens out drastically. The results for `p > 0.97` are so close to zero
  // floating point errors in the calculation show.
  // That's why we don't check the bounds here.
  checkSymmetry(t, 0.0001)(pointFromGame);

  // Do those results make sense?
  isClose(t, 0.01)(pointFromGame(0.97), 0.6);
  isClose(t, 0.01)(pointFromGame(0.82), 0.55);
});

tap.test("advantageForChance", async (t) => {
  // Do those results make sense?
  isClose(t, 0.1)(advantageForChance(0.5, 0.5), 0);
  isClose(t, 0.1)(advantageForChance(0.45, 0.5), 2);
  isClose(t, 0.1)(advantageForChance(0.4, 0.5), 3.7);
  isClose(t, 0.1)(advantageForChance(0.1, 0.5), 9.6);
  t.throws(() => advantageForChance(0.5, 0.25)); // No way to make this happen.
  isClose(t, 0.1)(advantageForChance(0.45, 0.25), 0.6);
  isClose(t, 0.1)(advantageForChance(0.4, 0.25), 2.4);
  isClose(t, 0.1)(advantageForChance(0.1, 0.25), 9.2);
});

tap.test("gameFromTTR", async (t) => {
  t.equal(gameFromTTR(0), 0.5);
  t.equal(gameFromTTR(-150), 1 / 11);
  t.equal(gameFromTTR(-300), 1 / 101);
  t.equal(gameFromTTR(300), 100 / 101);
});
