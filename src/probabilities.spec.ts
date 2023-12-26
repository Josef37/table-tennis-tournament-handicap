import tap, { Test } from "tap";
import { Calculations } from "./probabilities";
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

tap.test("3 sets, 11 points", async (suite) => {
  const c = new Calculations({ sets: 3, points: 11 });

  suite.test("setFromPoint", async (t) => {
    checkBounds(t)(c.setFromPoint);
    checkSymmetry(t)(c.setFromPoint);
    // No way to check if the formula is actually correct...
  });

  suite.test("setFromPointWithAdvantage", async (t) => {
    // Do those results make sense?
    larger(t)(c.setFromPointWithAdvantage(0.5, 10), 0.99);
    larger(t)(c.setFromPointWithAdvantage(0.5, 1), 0.5);
  });

  suite.test("gameFromSet", async (t) => {
    checkBounds(t)(c.gameFromSet);
    checkSymmetry(t)(c.gameFromSet);
    // No way to check if the formula is actually correct...
  });

  suite.test("gameFromPoint", async (t) => {
    checkBounds(t)(c.gameFromPoint);
    checkSymmetry(t)(c.gameFromPoint);
    // No way to check if the formula is actually correct...

    // Do those results make sense?
    isClose(t, 0.01)(c.gameFromPoint(0.6), 0.97);
    isClose(t, 0.01)(c.gameFromPoint(0.55), 0.82);
  });

  suite.test("pointFromGame", async (t) => {
    // At the bounds of the interval `[0,1]` the function `gameFromPoint` flattens out drastically.
    // The results for `p > 0.97` are so close to zero floating point errors in the calculation show.
    checkBounds(t)(c.gameFromPoint);
    checkSymmetry(t, 0.0001)(c.pointFromGame);

    // Do those results make sense?
    isClose(t, 0.01)(c.pointFromGame(0.97), 0.6);
    isClose(t, 0.01)(c.pointFromGame(0.82), 0.55);
  });

  suite.test("advantageForChance", async (t) => {
    // Do those results make sense?
    isClose(t, 0.1)(c.advantageForChance(0.5, 0.5), 0);
    isClose(t, 0.1)(c.advantageForChance(0.45, 0.5), 2);
    isClose(t, 0.1)(c.advantageForChance(0.4, 0.5), 3.7);
    isClose(t, 0.1)(c.advantageForChance(0.1, 0.5), 9.6);
    t.throws(() => c.advantageForChance(0.5, 0.25)); // No way to make this happen.
    isClose(t, 0.1)(c.advantageForChance(0.45, 0.25), 0.6);
    isClose(t, 0.1)(c.advantageForChance(0.4, 0.25), 2.4);
    isClose(t, 0.1)(c.advantageForChance(0.1, 0.25), 9.2);
  });

  suite.test("gameFromTTR", async (t) => {
    t.equal(c.gameFromTTR(0), 0.5);
    t.equal(c.gameFromTTR(-150), 1 / 11);
    t.equal(c.gameFromTTR(-300), 1 / 101);
    t.equal(c.gameFromTTR(300), 100 / 101);
  });
});

tap.test("2 sets, 7 points", async (suite) => {
  const c = new Calculations({ sets: 2, points: 7 });

  suite.test("setFromPoint", async (t) => {
    checkBounds(t)(c.setFromPoint);
    checkSymmetry(t)(c.setFromPoint);
    // No way to check if the formula is actually correct...
  });

  suite.test("setFromPointWithAdvantage", async (t) => {
    // Do those results make sense?
    larger(t)(c.setFromPointWithAdvantage(0.5, 6), 0.99);
    larger(t)(c.setFromPointWithAdvantage(0.5, 1), 0.5);
  });

  suite.test("gameFromSet", async (t) => {
    checkBounds(t)(c.gameFromSet);
    checkSymmetry(t)(c.gameFromSet);
    // No way to check if the formula is actually correct...
  });

  suite.test("gameFromPoint", async (t) => {
    checkBounds(t)(c.gameFromPoint);
    checkSymmetry(t)(c.gameFromPoint);
    // No way to check if the formula is actually correct...

    // Do those results make sense?
    isClose(t, 0.01)(c.gameFromPoint(0.6), 0.88);
    isClose(t, 0.01)(c.gameFromPoint(0.55), 0.72);
  });

  suite.test("pointFromGame", async (t) => {
    // At the bounds of the interval `[0,1]` the function `gameFromPoint` flattens out drastically.
    // The results for `p > 0.97` are so close to zero floating point errors in the calculation show.
    checkBounds(t)(c.gameFromPoint);
    checkSymmetry(t, 0.0001)(c.pointFromGame);

    // Do those results make sense?
    isClose(t, 0.01)(c.pointFromGame(0.88), 0.6);
    isClose(t, 0.01)(c.pointFromGame(0.72), 0.55);
  });

  suite.test("advantageForChance", async (t) => {
    // Do those results make sense?
    isClose(t, 0.1)(c.advantageForChance(0.5, 0.5), 0);
    isClose(t, 0.1)(c.advantageForChance(0.45, 0.5), 1.3);
    isClose(t, 0.1)(c.advantageForChance(0.4, 0.5), 2.4);
    isClose(t, 0.1)(c.advantageForChance(0.1, 0.4), 5.9);
    t.throws(() => c.advantageForChance(0.5, 0.25)); // No way to make this happen.
    isClose(t, 0.1)(c.advantageForChance(0.45, 0.3), 0.2);
    isClose(t, 0.1)(c.advantageForChance(0.4, 0.25), 1.1);
    isClose(t, 0.1)(c.advantageForChance(0.1, 0.25), 5.6);
  });

  suite.test("gameFromTTR", async (t) => {
    t.equal(c.gameFromTTR(0), 0.5);
    t.equal(c.gameFromTTR(-150), 1 / 11);
    t.equal(c.gameFromTTR(-300), 1 / 101);
    t.equal(c.gameFromTTR(300), 100 / 101);
  });
});
