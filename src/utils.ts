/**
 * Binomial coefficient or "n choose k".
 */
export const choose = (n: number, k: number) => {
  var result = 1;
  for (let i = 1; i <= k; i++) {
    result *= (n + 1 - i) / i;
  }
  return result;
};

/**
 * Includes `from` and `to`.
 */
export const range = (from: number, to: number, step: number = 1) => {
  const length = Math.max(0, 1 + Math.floor((to - from) / step));
  return Array.from(Array(length), (_, i) => from + step * i);
};

/**
 * Two digits after decimal point and adds percent sign, e.g. "12.34%".
 */
export const formatPercent = (x: number) => (100 * x).toFixed(2) + "%";

type Func = (x: number) => number;

/**
 * Primitive way to numerically derivate `f` at `x`
 * by computing the slope through `f(x-h)` and `f(x+h)`.
 */
const derivative =
  (f: Func, h = 0.001) =>
  (x: number) =>
    (f(x + h) - f(x - h)) / (2 * h);

/**
 * Applies [Newton's method](https://en.wikipedia.org/wiki/Newton%27s_method) to find a root of `f` starting at `x`.
 * The procedure returns when the last step moved `x` less than `precision`.
 */
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

/**
 * Applies the [bisection method](https://en.wikipedia.org/wiki/Bisection_method) to find a root of `f` between `a` and `b`.
 * `f` has to be continuous and `f(a)` and `f(b)` have to have different signs.
 */
export const bisection = (
  f: Func,
  [a, b]: [number, number],
  { precision = 0.001, maxIter: maxIteration = 1000 } = {}
) => {
  if (a >= b) {
    throw new Error(`Invalid interval [${a}, ${b}]`);
  }
  if (Math.sign(f(a)) === Math.sign(f(b))) {
    throw new Error(`f(a) and f(b) have the same sign.`);
  }

  let iteration = 1;
  while (iteration <= maxIteration) {
    const c = (a + b) / 2;

    if (f(c) === 0 || (b - a) / 2 < precision) {
      return c;
    }

    if (Math.sign(f(a)) === Math.sign(f(c))) {
      a = c;
    } else {
      b = c;
    }

    iteration += 1;
  }

  throw new Error("Bisection method exceeded iterations.");
};
