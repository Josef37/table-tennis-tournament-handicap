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
