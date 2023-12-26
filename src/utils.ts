/**
 * Includes `from` and `to`.
 */
export const range = (from: number, to: number, step: number = 1) => {
  const length = Math.max(0, 1 + Math.floor((to - from) / step));
  return Array.from(Array(length), (_, i) => from + step * i);
};
