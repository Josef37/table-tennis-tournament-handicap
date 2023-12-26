import { bisection, choose } from "./maths";

export interface GameConfig {
  sets: number;
  points: number;
}

export class Calculations {
  sets: number;
  points: number;

  constructor(config: GameConfig) {
    this.sets = config.sets;
    this.points = config.points;
  }

  /**
   * Calculates the probability of winning a game - i.e. three sets,
   * when `r` is the probability of winning a set.
   */
  gameFromSet = (r: number) => {
    let q = 0;
    for (let i = 0; i < this.sets; i++) {
      // Opponents wins `i` sets.
      q += choose(this.sets - 1 + i, i) * r ** this.sets * (1 - r) ** i;
    }
    return q;
  };

  /**
   * Calculates the probability of winning a set
   * when `p` is the probability of winning a point.
   */
  setFromPoint = (p: number) => {
    return this.setFromPointWithAdvantage(p, 0);
  };

  /**
   * Calculates the probability of winning a set
   * when `p` is the probability of winning a point
   * and given `s` points advantage - i.e. starting with a score of s:0.
   */
  setFromPointWithAdvantage = (p: number, s: number) => {
    const deuce = this.points - 1;

    // Set ends before deuce.
    let x1 = 0;
    for (let i = 0; i < deuce; i++) {
      x1 += choose(deuce - s + i, i) * (1 - p) ** i;
    }
    // Set ends after deuce.
    const x2 =
      choose(2 * deuce - s, deuce) *
      p *
      (1 - p) ** deuce *
      (1 / (1 - 2 * p + 2 * p ** 2));

    return p ** (this.points - s) * (x1 + x2);
  };

  /**
   * Calculates the probability of winning a game
   * when `p` is the probability of winning a point.
   */
  gameFromPoint = (p: number) => this.gameFromPointWithAdvantage(p, 0);

  /**
   * Calculates the probability of winning a game
   * when `p` is the probability of winning a point
   * and given `s` points advantage each set - i.e. starting with a score of s:0.
   */
  gameFromPointWithAdvantage = (p: number, s: number) =>
    this.gameFromSet(this.setFromPointWithAdvantage(p, s));

  /**
   * Numerically solves the equation `q = gameFromPoint(p)` for `p`.
   * I.e. given the probability `q` of winning a game,
   * what is the corresponding probability `p` of winning a point?
   */
  pointFromGame = (q: number) =>
    bisection((p) => this.gameFromPoint(p) - q, [0, 1], { precision: 0.00001 });

  /**
   * With `p` being the probability of winning a point,
   * what advantage `s` do we have to give the player,
   * so he wins the game with a probability of `q`?
   */
  advantageForChance = (p: number, q: number) =>
    bisection(
      (s) => this.gameFromPointWithAdvantage(p, s) - q,
      [0, this.points - 1],
      { precision: 0.01 }
    );
}

/**
 * Calculates the expected probability of winning a game,
 * when you have `ttrDiff` more TTR points than your opponent.
 */
export const gameFromTTR = (ttrDiff: number) =>
  1 / (1 + 10 ** (-ttrDiff / 150));

const defaultCalc = new Calculations({ points: 11, sets: 3 });

/**
 * Calculates the expected probability of winning a single point,
 * when you have `ttrDiff` more TTR points than your opponent.
 */
export const pointFromTTR = (ttrDiff: number) =>
  defaultCalc.pointFromGame(gameFromTTR(ttrDiff));
