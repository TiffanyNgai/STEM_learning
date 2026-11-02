import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Why casinos always win',
      body: String.raw`A roulette bet loses on average about 5 cents per dollar (American wheel), yet any single gambler can walk away rich. The casino, facing *millions* of bets, earns almost exactly 5 cents per dollar. Insurers rely on the same effect.

The **law of large numbers** (LLN) explains this: the average of many independent repetitions settles down to the expected value. Each line below is an independent run of coin flips; watch each running proportion of heads home in on $p$.`,
      widget: { type: 'CoinFlipLLN', props: { paths: 4, showBand: false }, caption: 'Log-scaled x axis: each tick is 10× more flips. Every run converges to p — at its own pace.' },
    },
    {
      kind: 'explain',
      title: 'The precise statement',
      body: String.raw`Let $X_1, X_2, \dots$ be **i.i.d.** — *independent and identically distributed* (same distribution, no influence on each other) — with finite mean $\mu$. Define the **sample mean** $\bar X_n = \frac1n(X_1+\dots+X_n)$.

**Weak LLN:** for any tolerance $\varepsilon>0$, however small,
$$P\big(|\bar X_n-\mu| > \varepsilon\big)\;\to\;0\quad\text{as } n\to\infty.$$
In words: with enough data, the sample mean is *very probably* *very close* to $\mu$. (The **strong LLN** says more: with probability 1 the sequence $\bar X_n$ actually converges to $\mu$.)

For coin flips, $X_i\in\{0,1\}$ and $\bar X_n$ is the proportion of heads, so it converges to $p$.`,
    },
    {
      kind: 'widget',
      title: 'Proof in four lines (finite variance)',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`**Chebyshev's inequality:** for any $Y$ with mean $m$ and variance $v$, $\;P(|Y-m|\ge \varepsilon)\le v/\varepsilon^2$.`,
            String.raw`From the last lesson, $E[\bar X_n]=\mu$ and $\operatorname{Var}(\bar X_n)=\sigma^2/n$.`,
            String.raw`Apply Chebyshev to $Y=\bar X_n$: $\;P(|\bar X_n-\mu|\ge\varepsilon)\le \dfrac{\sigma^2}{n\varepsilon^2}$.`,
            String.raw`The right side $\to 0$ as $n\to\infty$ for any fixed $\varepsilon$. $\blacksquare$`,
          ],
          notes: [
            'Large deviations are rare when the variance is small. (Assumes finite variance σ²; the LLN itself only needs a finite mean.)',
            'Averaging independent copies shrinks variance by 1/n.',
            '',
            'Bonus: this also gives a (conservative) bound on how many samples you need.',
          ],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: 'After 10 fair-coin flips you have 7 heads (proportion 0.7). You keep flipping to 10 000 total. What do you expect the overall proportion to be, roughly?',
      choices: ['About 0.3, to compensate', 'About 0.5', 'About 0.7, the trend continues', 'Exactly 0.5'],
      answer: 1,
      why: 'Future flips are still 50/50, so you expect about 7 + 0.5 × 9990 = 5002 heads: proportion ≈ 0.5002. The early surplus is not cancelled — it is diluted. "Exactly 0.5" is wrong because randomness remains (SD ≈ 0.005).',
    },
    {
      kind: 'explain',
      title: 'Swamping, not compensating',
      body: String.raw`The **gambler's fallacy** says that after many reds, black is "due". Wrong: independent spins have no memory. The LLN works by **dilution**: the early luck stays, but becomes a negligible fraction.

In fact the *count* of excess heads, $\#\text{heads} - n/2$, typically grows like $\sqrt n$, while the *proportion*'s error shrinks like $1/\sqrt n$. The standard deviation of the proportion is
$$\operatorname{SD}(\bar X_n) = \sqrt{p(1-p)/n}.$$
To halve the error you need **four times** as much data. The curve shows $\pm2$ of these SDs — compare with the green **±2 SE band** in the coin-flip widgets.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['p+2*sqrt(p*(1-p)/x)', 'p-2*sqrt(p*(1-p)/x)', 'p'], x: [1, 1000], y: [0, 1],
          params: [{ name: 'p', min: 0.05, max: 0.95, value: 0.5 }], xLabel: 'n', yLabel: 'proportion',
          labels: ['p + 2 SD', 'p − 2 SD', 'p'],
        },
        caption: 'A funnel narrowing like 1/√n: most runs of the proportion stay inside it.',
      },
    },
    {
      kind: 'truefalse',
      prompt: 'A fair roulette wheel has landed on red 8 times in a row, so black is now more likely than red on the next spin.',
      answer: false,
      why: 'Spins are independent: P(black) is unchanged (and slightly under 1/2 on real wheels because of the green zero). The LLN does not "correct" past results — it dilutes them.',
    },
    {
      kind: 'numeric',
      prompt: 'For a fair coin, how many flips $n$ make the standard deviation of the proportion of heads equal to 0.01?',
      answer: 2500,
      tolerance: 1,
      why: 'Solve √(0.25/n) = 0.01 → 0.25/n = 0.0001 → n = 2500. Then the proportion is usually within about ±0.02 (2 SDs) of 0.5.',
    },
    {
      kind: 'widget',
      title: 'Try a biased coin',
      body: String.raw`Set $p=0.2$ (say, the chance a component fails a stress test). Press **New flips** a few times. Every path ends up near 0.2, mostly inside the green $\pm2$ SD band — but early on, any path can stray far.`,
      widget: { type: 'CoinFlipLLN', props: { p: 0.2, paths: 6, showBand: true, maxFlips: 5000 } },
    },
    {
      kind: 'explain',
      title: 'Monte Carlo: LLN as a tool',
      body: String.raw`The LLN lets computers estimate quantities by simulation, a method called **Monte Carlo**. To estimate a probability $P(A)$: simulate the experiment $n$ times, record $I_i=1$ if $A$ happened, and average:
$$\hat P = \frac1n\sum I_i\;\to\;P(A).$$
Its error is about $\sqrt{P(1-P)/n}$, so a million simulations give roughly three correct decimal places, no matter how complicated the experiment. This is the engine behind [Monte Carlo simulation](@stats/monte-carlo) and [MCMC](@stats/mcmc).`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about the law of large numbers are correct?',
      choices: [
        'It requires the population mean to exist (be finite)',
        'It concerns averages of independent, identically distributed draws',
        'It guarantees exactly 500 heads in 1000 fair flips',
        'For the Cauchy distribution (no finite mean), sample averages do not settle down',
        'It says past results make future outcomes compensate',
      ],
      answers: [0, 1, 3],
      why: 'The LLN needs i.i.d. draws with a finite mean; the Cauchy distribution famously violates this and its running averages keep jumping. It makes no exact guarantees for finite n, and it works through dilution, not compensation.',
    },
    {
      kind: 'fill',
      prompt: 'LLN: as $n$ grows, the sample ___ converges to the population ___.',
      bank: ['average', 'mean', 'variance', 'maximum'],
      answer: ['average', 'mean'],
      why: 'The sample average X̄ₙ (a statistic you compute) converges to the population mean μ = E[X] (a fixed, usually unknown, parameter).',
    },
    {
      kind: 'match',
      prompt: 'Match each idea to its statement.',
      pairs: [
        ['Weak LLN', '$P(|\\bar X_n-\\mu|>\\varepsilon)\\to 0$'],
        ['Strong LLN', '$\\bar X_n\\to\\mu$ with probability 1'],
        ['Chebyshev', '$P(|Y-m|\\ge\\varepsilon)\\le \\operatorname{Var}(Y)/\\varepsilon^2$'],
        ['SD of the sample mean', '$\\sigma/\\sqrt n$'],
      ],
      why: 'The weak law is about convergence in probability, the strong law about almost-sure convergence of the whole sequence; Chebyshev plus the σ/√n formula proves the weak law.',
    },
    {
      kind: 'order',
      prompt: 'Order the steps of a Monte Carlo estimate of a probability.',
      steps: [
        'Write a simulation of one run of the experiment',
        'Run it many times, recording 1 if the event happens and 0 otherwise',
        'Average the 0/1 results',
        'Report the average together with its error ≈ √(p̂(1−p̂)/n)',
      ],
      why: 'Simulation produces i.i.d. indicator variables; their average estimates the probability (LLN), and the SD formula quantifies how far off it may be.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **LLN:** for i.i.d. draws with finite mean, $\bar X_n\to\mu$ as $n\to\infty$.
- Proof sketch: $\operatorname{Var}(\bar X_n)=\sigma^2/n$ plus Chebyshev.
- Error shrinks like $1/\sqrt n$: 4× the data for half the error.
- It works by **dilution**, not compensation — the gambler's fallacy is a fallacy.
- Monte Carlo uses the LLN to estimate anything you can simulate.

The LLN says *where* $\bar X_n$ goes; the [central limit theorem](@stats/central-limit-theorem) says what its fluctuations *look like*.`,
    },
  ],
  references: [
    { authors: 'J. K. Blitzstein, J. Hwang', title: 'Introduction to Probability', year: 2019, venue: '2nd ed., CRC Press', detail: 'Ch. 10.1–10.2 (Inequalities, LLN)' },
    { authors: 'L. Wasserman', title: 'All of Statistics', year: 2004, venue: 'Springer', detail: 'Ch. 4.1, 5.3' },
    { authors: 'B. Illowsky, S. Dean et al.', title: 'Introductory Statistics', year: 2013, venue: 'OpenStax', detail: 'Ch. 7', url: 'https://openstax.org/details/books/introductory-statistics' },
  ],
} satisfies LessonContent;
