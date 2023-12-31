# Table Tennis Tournament Handicap

Making club tournaments fair again!

## About

When playing club tournaments in table tennis, we often find players of wildly different skill competing against another.

This results in the better player not trying and the worse player not seeing any chance of winning - making the game boring for both.

We can fix this by giving the worse player a few points advantage. But how much?

From the difference in ranking points we get an expected win probability for each game.
From that value we can deduce a win probability for each point.
Now we can try different different point advantages and calculate the win probability for these modified games.

## How to use

There are a few things worth considering:

1. Make it simple for the players! Don't make them calculate the ranking difference and look up an advantage from the results below.
   Either you tell them the correct advantage with each game or you print a player-to-player matrix where the advantages for each possible match are noted.
2. Not all ranking points are up to date. Some players might have higher/lower rankings than their skill, because they didn't compete in a while.
   You could adjust ranking points for these players before calculating advantages.
3. If you aim for a perfect 50% win probability, you might be out of luck... You can only choose full points advantage.
   We chose to pick the closest number to 50%, but at most 55% win chance for the worse player.
4. You might not want to make it totally equal, just a little fairer.
   You could choose a rule like this: For every 100 ranking points, the better player gets a 2% higher win chance. This way a player with 500 points more will still have a calculated win chance of 60%. This might be better than perfect 50% or unaltered 100%.

## Program Execution

```bash
npm install --global yarn
yarn install
yarn start
# Look for files in ./output/
```

There are some configuration options in `src/index.ts::config`.

## Mathematics

There are a few underlying assumptions:

1. The win expectation from ranking points is correct - also for larger differences in ranking points.
2. We can deduce the win probability of a single point from the win probability of the whole game.
   In reality some players improve during the game (and often lose the first set).
   In our model we have a constant probability $p$ for winning each point. The probability of winning the whole game is merely a function $q=f(p)$.

Let $p$ be the probability of winning a point,
$r$ be the probability of winning a set and
$q$ be the probability of winning a game/match.

$$
\begin{align*}
q(r) &= P(3:0) + P(3:1) + P(3:2) \\
&= r^3 + \binom{3}{1} r^3 (1-r) + \binom{4}{2} r^3 (1-r)^2 \\
&= r^3(10 - 15r - 6r^2) \\
\end{align*}
$$

$$
\begin{align*}
r(p) &= \sum_{i=0}^9 P(11:i) + \sum_{i=0}^{\infty} P(i+12:i+10) \\
&= \sum_{i=0}^9 \binom{10+i}{i} p^{11} (1-p)^i + \binom{20}{10} p^{12} (1-p)^{10} \sum_{i=0}^{\infty} (2p(1-p))^i \\
&= p^{11} \left( \sum_{i=0}^9 \binom{10+i}{i} (1-p)^i + \binom{20}{10} p (1-p)^{10} \frac{1}{1-2p+2p^2} \right) \\
\end{align*}
$$

When providing an advantage $s$ the formula changes like following.

$$
r(p,s) = p^{11-s} \left( \sum_{i=0}^9 \binom{10-s+i}{i} (1-p)^i + \binom{20-s}{10} p (1-p)^{10} \frac{1}{1-2p+2p^2} \right)
$$

With that we can write $q$ as a function of $p$.

The win expectation from the ranking points $t$ is defined like this:

$$
q(t) = \frac{1}{1+10^{\frac{t}{150}}}
$$

We set $q(t) = q(p)$ and solve for $p$ numerically.
_Note: Since we're using a non-scientific programming language, we have to program the solver ourselves, so we chose to use the [bisection method](https://en.wikipedia.org/wiki/Bisection_method)._

## Results

The following table shows the win probability as a function of ranking and advantage.

- Rows: Difference in ranking (TTR).
- Columns: Point advantage for each set..
- Cells: Probability of winning the game.

You can find [a printable PDF here](./dist/result.pdf), where red cells are closest to 50% and green cells are at most 50%.

|         | **0** | **1** | **2** | **3** | **4** | **5** | **6** | **7** | **8** | **9** | **10** |
| ------: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | -----: |
|   **0** |   50% |   66% |   80% |   91% |   96% |   99% |  100% |  100% |  100% |  100% |   100% |
|  **10** |   46% |   63% |   78% |   89% |   96% |   99% |  100% |  100% |  100% |  100% |   100% |
|  **20** |   42% |   59% |   75% |   87% |   95% |   98% |  100% |  100% |  100% |  100% |   100% |
|  **30** |   39% |   55% |   72% |   85% |   94% |   98% |  100% |  100% |  100% |  100% |   100% |
|  **40** |   35% |   52% |   69% |   83% |   93% |   98% |  100% |  100% |  100% |  100% |   100% |
|  **50** |   32% |   48% |   66% |   81% |   92% |   97% |   99% |  100% |  100% |  100% |   100% |
|  **60** |   28% |   44% |   62% |   79% |   90% |   97% |   99% |  100% |  100% |  100% |   100% |
|  **70** |   25% |   41% |   59% |   76% |   89% |   96% |   99% |  100% |  100% |  100% |   100% |
|  **80** |   23% |   38% |   56% |   73% |   87% |   95% |   99% |  100% |  100% |  100% |   100% |
|  **90** |   20% |   34% |   52% |   71% |   85% |   95% |   99% |  100% |  100% |  100% |   100% |
| **100** |   18% |   31% |   49% |   68% |   84% |   94% |   98% |  100% |  100% |  100% |   100% |
| **110** |   16% |   28% |   46% |   65% |   82% |   93% |   98% |  100% |  100% |  100% |   100% |
| **120** |   14% |   26% |   42% |   62% |   80% |   92% |   98% |  100% |  100% |  100% |   100% |
| **130** |   12% |   23% |   39% |   59% |   77% |   91% |   97% |  100% |  100% |  100% |   100% |
| **140** |   10% |   21% |   36% |   56% |   75% |   89% |   97% |   99% |  100% |  100% |   100% |
| **150** |    9% |   19% |   34% |   53% |   73% |   88% |   96% |   99% |  100% |  100% |   100% |
| **160** |    8% |   17% |   31% |   50% |   70% |   87% |   96% |   99% |  100% |  100% |   100% |
| **170** |    7% |   15% |   29% |   47% |   68% |   85% |   95% |   99% |  100% |  100% |   100% |
| **180** |    6% |   13% |   26% |   45% |   66% |   84% |   94% |   99% |  100% |  100% |   100% |
| **190** |    5% |   12% |   24% |   42% |   63% |   82% |   94% |   99% |  100% |  100% |   100% |
| **200** |    4% |   11% |   22% |   40% |   61% |   80% |   93% |   98% |  100% |  100% |   100% |
| **210** |    4% |    9% |   20% |   37% |   58% |   79% |   92% |   98% |  100% |  100% |   100% |
| **220** |    3% |    8% |   18% |   35% |   56% |   77% |   91% |   98% |  100% |  100% |   100% |
| **230** |    3% |    7% |   17% |   32% |   54% |   75% |   90% |   98% |  100% |  100% |   100% |
| **240** |    2% |    7% |   15% |   30% |   51% |   73% |   90% |   97% |  100% |  100% |   100% |
| **250** |    2% |    6% |   14% |   28% |   49% |   71% |   89% |   97% |  100% |  100% |   100% |
| **260** |    2% |    5% |   13% |   26% |   47% |   69% |   87% |   97% |  100% |  100% |   100% |
| **270** |    2% |    5% |   11% |   25% |   45% |   68% |   86% |   96% |  100% |  100% |   100% |
| **280** |    1% |    4% |   10% |   23% |   42% |   66% |   85% |   96% |   99% |  100% |   100% |
| **290** |    1% |    4% |    9% |   21% |   40% |   64% |   84% |   96% |   99% |  100% |   100% |
| **300** |    1% |    3% |    8% |   20% |   38% |   62% |   83% |   95% |   99% |  100% |   100% |
| **310** |    1% |    3% |    8% |   18% |   36% |   60% |   82% |   95% |   99% |  100% |   100% |
| **320** |    1% |    2% |    7% |   17% |   34% |   58% |   80% |   94% |   99% |  100% |   100% |
| **330** |    1% |    2% |    6% |   16% |   33% |   56% |   79% |   94% |   99% |  100% |   100% |
| **340** |    1% |    2% |    6% |   14% |   31% |   54% |   78% |   93% |   99% |  100% |   100% |
| **350** |    0% |    2% |    5% |   13% |   29% |   52% |   76% |   92% |   99% |  100% |   100% |
| **360** |    0% |    1% |    5% |   12% |   28% |   51% |   75% |   92% |   99% |  100% |   100% |
| **370** |    0% |    1% |    4% |   11% |   26% |   49% |   74% |   91% |   98% |  100% |   100% |
| **380** |    0% |    1% |    4% |   10% |   25% |   47% |   72% |   91% |   98% |  100% |   100% |
| **390** |    0% |    1% |    3% |   10% |   23% |   45% |   71% |   90% |   98% |  100% |   100% |
| **400** |    0% |    1% |    3% |    9% |   22% |   44% |   69% |   89% |   98% |  100% |   100% |
| **410** |    0% |    1% |    3% |    8% |   21% |   42% |   68% |   88% |   98% |  100% |   100% |
| **420** |    0% |    1% |    2% |    7% |   19% |   40% |   66% |   88% |   98% |  100% |   100% |
| **430** |    0% |    1% |    2% |    7% |   18% |   39% |   65% |   87% |   97% |  100% |   100% |
| **440** |    0% |    1% |    2% |    6% |   17% |   37% |   63% |   86% |   97% |  100% |   100% |
| **450** |    0% |    0% |    2% |    6% |   16% |   35% |   62% |   85% |   97% |  100% |   100% |
| **460** |    0% |    0% |    2% |    5% |   15% |   34% |   60% |   84% |   97% |  100% |   100% |
| **470** |    0% |    0% |    1% |    5% |   14% |   33% |   59% |   83% |   96% |  100% |   100% |
| **480** |    0% |    0% |    1% |    4% |   13% |   31% |   57% |   83% |   96% |  100% |   100% |
| **490** |    0% |    0% |    1% |    4% |   12% |   30% |   56% |   82% |   96% |  100% |   100% |
| **500** |    0% |    0% |    1% |    4% |   12% |   28% |   55% |   81% |   96% |  100% |   100% |
| **510** |    0% |    0% |    1% |    3% |   11% |   27% |   53% |   80% |   95% |  100% |   100% |
| **520** |    0% |    0% |    1% |    3% |   10% |   26% |   52% |   79% |   95% |  100% |   100% |
| **530** |    0% |    0% |    1% |    3% |    9% |   25% |   50% |   78% |   95% |  100% |   100% |
| **540** |    0% |    0% |    1% |    3% |    9% |   24% |   49% |   77% |   94% |   99% |   100% |
| **550** |    0% |    0% |    1% |    2% |    8% |   23% |   47% |   76% |   94% |   99% |   100% |
| **560** |    0% |    0% |    1% |    2% |    8% |   21% |   46% |   75% |   94% |   99% |   100% |
| **570** |    0% |    0% |    0% |    2% |    7% |   20% |   45% |   74% |   93% |   99% |   100% |
| **580** |    0% |    0% |    0% |    2% |    7% |   19% |   43% |   73% |   93% |   99% |   100% |
| **590** |    0% |    0% |    0% |    2% |    6% |   19% |   42% |   71% |   92% |   99% |   100% |
| **600** |    0% |    0% |    0% |    2% |    6% |   18% |   41% |   70% |   92% |   99% |   100% |
| **610** |    0% |    0% |    0% |    1% |    5% |   17% |   39% |   69% |   91% |   99% |   100% |
| **620** |    0% |    0% |    0% |    1% |    5% |   16% |   38% |   68% |   91% |   99% |   100% |
| **630** |    0% |    0% |    0% |    1% |    5% |   15% |   37% |   67% |   90% |   99% |   100% |
| **640** |    0% |    0% |    0% |    1% |    4% |   14% |   36% |   66% |   90% |   99% |   100% |
| **650** |    0% |    0% |    0% |    1% |    4% |   14% |   35% |   65% |   89% |   99% |   100% |
| **660** |    0% |    0% |    0% |    1% |    4% |   13% |   33% |   64% |   89% |   99% |   100% |
| **670** |    0% |    0% |    0% |    1% |    3% |   12% |   32% |   63% |   88% |   99% |   100% |
| **680** |    0% |    0% |    0% |    1% |    3% |   12% |   31% |   61% |   88% |   99% |   100% |
| **690** |    0% |    0% |    0% |    1% |    3% |   11% |   30% |   60% |   87% |   98% |   100% |
| **700** |    0% |    0% |    0% |    1% |    3% |   10% |   29% |   59% |   87% |   98% |   100% |
| **710** |    0% |    0% |    0% |    1% |    3% |   10% |   28% |   58% |   86% |   98% |   100% |
| **720** |    0% |    0% |    0% |    0% |    2% |    9% |   27% |   57% |   86% |   98% |   100% |
| **730** |    0% |    0% |    0% |    0% |    2% |    9% |   26% |   56% |   85% |   98% |   100% |
| **740** |    0% |    0% |    0% |    0% |    2% |    8% |   25% |   55% |   84% |   98% |   100% |
| **750** |    0% |    0% |    0% |    0% |    2% |    8% |   24% |   54% |   84% |   98% |   100% |
| **760** |    0% |    0% |    0% |    0% |    2% |    7% |   23% |   52% |   83% |   98% |   100% |
| **770** |    0% |    0% |    0% |    0% |    2% |    7% |   22% |   51% |   82% |   98% |   100% |
| **780** |    0% |    0% |    0% |    0% |    2% |    7% |   22% |   50% |   82% |   97% |   100% |
| **790** |    0% |    0% |    0% |    0% |    1% |    6% |   21% |   49% |   81% |   97% |   100% |
| **800** |    0% |    0% |    0% |    0% |    1% |    6% |   20% |   48% |   80% |   97% |   100% |
