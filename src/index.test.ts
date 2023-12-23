import tap from "tap";
import {
  advantageForChance,
  choose,
  gameFromPoint,
  gameFromSet,
  gameFromTTR,
  newtonsMethod,
  pointFromGame,
  setFromPoint,
  setFromPointWithAdvantage,
} from ".";

tap.test("setFromPoint", async (t) => {
  t.equal(setFromPoint(0), 0);
  t.equal(setFromPoint(0.5), 0.5);
  t.equal(setFromPoint(1), 1);
});

tap.test("setFromPointWithAdvantage", async (t) => {
  t.ok(setFromPointWithAdvantage(0.5, 10) > 0.99);
  t.ok(setFromPointWithAdvantage(0.5, 1) > 0.5);
});

tap.test("gameFromSet", async (t) => {
  t.equal(gameFromSet(0), 0);
  t.equal(gameFromSet(0.5), 0.5);
  t.equal(gameFromSet(1), 1);
});

tap.test("gameFromPoint", async (t) => {
  t.equal(gameFromPoint(0), 0);
  t.equal(gameFromPoint(0.5), 0.5);
  t.equal(gameFromPoint(1), 1);

  t.ok(Math.abs(gameFromPoint(0.6) - 0.97) < 0.01);
  t.ok(Math.abs(gameFromPoint(0.55) - 0.82) < 0.01);
});

tap.test("pointFromGame", async (t) => {
  t.equal(pointFromGame(0.5), 0.5);

  t.ok(Math.abs(pointFromGame(0.97) - 0.6) < 0.01);
  t.ok(Math.abs(pointFromGame(0.82) - 0.55) < 0.01);
});

tap.test("advantageForChance", async (t) => {
  t.equal(advantageForChance(0.5, 0.5), 0);
  t.ok(Math.abs(advantageForChance(0.45, 0.5) - 2) < 0.1);
});

tap.test("gameFromTTR", async (t) => {
  t.equal(gameFromTTR(0), 0.5);
  t.equal(gameFromTTR(150), 1 / 11);
  t.equal(gameFromTTR(300), 1 / 101);
  t.equal(gameFromTTR(-300), 100 / 101);
});

tap.test("choose", async (t) => {
  t.equal(choose(0, 0), 1);
  t.equal(choose(3, 1), 3);
  t.equal(choose(5, 2), 10);
});

tap.test("newtonsMethod", async (t) => {
  const precision = 0.001;
  t.ok(
    Math.abs(newtonsMethod((x) => x ** 2, 1, { precision }) - 0) < precision
  );
  t.ok(
    Math.abs(newtonsMethod((x) => (x - 1) ** 2, 0, { precision }) - 1) <
      precision
  );
});
