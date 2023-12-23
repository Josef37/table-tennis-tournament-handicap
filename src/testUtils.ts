import { Test } from "tap";

export const EPSILON = 10e-8;

export const isWithin =
  (t: Test) =>
  (x: number, [lower, upper]: [number, number]) =>
    t.ok(lower <= x && x <= upper, `${x} in [${lower}, ${upper}]`);

export const isClose =
  (t: Test, delta = EPSILON) =>
  (x: number, wanted: number) =>
    isWithin(t)(x, [wanted - delta, wanted + delta]);

export const larger = (t: Test) => (upper: number, lower: number) =>
  t.ok(upper > lower, `${upper} > ${lower}`);
