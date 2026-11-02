import type { LessonContent } from '../../types';
import { seesaw } from '../svg';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The long-run average',
      body: String.raw`A casino doesn't know who will win tonight, yet it knows almost exactly what it will earn over a year. The key number is the **expected value** (expectation, mean):
$$E[X] = \sum_x x\,p(x),$$
each value weighted by its probability. It is the **long-run average** of $X$ over many independent repetitions.

Physically, it is the **balance point**: put weight $p(x)$ at position $x$ on a beam, and $E[X]$ is where it balances.

**Fair die:** $E[X] = (1+2+3+4+5+6)\cdot\tfrac16 = 3.5$ — a value the die can never show. The mean need not be a possible outcome.`,
      widget: { type: 'SvgDiagram', props: { svg: seesaw() }, caption: 'E[X] = 0(0.1) + 1(0.4) + 2(0.3) + 3(0.1) + 4(0.1) = 1.7.' },
    },
    {
      kind: 'numeric',
      prompt: 'A game costs nothing to play: you **win 10 dollars** with probability 0.1, otherwise you **lose 2 dollars**. What are your expected winnings per game, in dollars?',
      answer: -0.8,
      tolerance: 0.001,
      unit: 'dollars',
      why: 'E = 10(0.1) + (−2)(0.9) = 1 − 1.8 = −0.8. On average you lose 80 cents per game, even though a 10-dollar win sounds tempting.',
    },
    {
      kind: 'explain',
      title: 'Expectation for continuous variables',
      body: String.raw`For a continuous $X$ with density $f$, the sum becomes an integral (a continuous weighted sum):
$$E[X] = \int_{-\infty}^{\infty} x\,f(x)\,dx.$$
Still the balance point of the density's shape.

**Example:** an exponential waiting time with rate $\lambda$ (events per unit time) has density $f(x)=\lambda e^{-\lambda x}$ for $x\ge0$ and mean $E[X] = 1/\lambda$. If buses arrive at rate 2 per hour, the mean wait is half an hour. In the explorer, the ▲ marks the mean; notice it sits right of the peak because the long tail pulls the balance point.`,
      widget: { type: 'DistributionExplorer', props: { dist: 'exponential', a: 0, b: 1 }, caption: 'The ▲ is E[X] = 1/λ; the bar under the axis spans mean ± 1 standard deviation.' },
    },
    {
      kind: 'explain',
      title: 'Linearity: the superpower',
      body: String.raw`For any constants $a,b$ and any random variables $X,Y$:
$$E[aX+b] = aE[X]+b,\qquad E[X+Y] = E[X]+E[Y].$$
The second holds **even if $X$ and $Y$ are dependent**.

**Trick — indicators:** to count things, write the count as a sum of 0/1 variables. Heads in 10 flips $= I_1+\dots+I_{10}$, where $I_j=1$ if flip $j$ is heads. Each $E[I_j] = P(\text{heads}) = 0.5$, so $E[\text{heads}] = 10\times0.5 = 5$. In general $\text{Bin}(n,p)$ has mean $np$ — no messy sums required.`,
    },
    {
      kind: 'mcq',
      prompt: '$n$ people throw their hats in a pile and each grabs one at random. What is the **expected number** of people who get their own hat back?',
      choices: ['0', '1', '$n/2$', 'It grows with $n$'],
      answer: 1,
      why: 'Let I_j = 1 if person j gets their own hat. P(I_j = 1) = 1/n, so by linearity E[total] = n × (1/n) = 1, for every n. The I_j are dependent, but linearity does not care.',
    },
    {
      kind: 'explain',
      title: 'Variance: how spread out?',
      body: String.raw`Two investments can have the same mean but very different risk. **Variance** measures typical squared distance from the mean $\mu = E[X]$:
$$\operatorname{Var}(X) = E\big[(X-\mu)^2\big] = E[X^2] - (E[X])^2.$$
The **standard deviation** $\operatorname{SD}(X)=\sqrt{\operatorname{Var}(X)}$ (often written $\sigma$) is back in the original units.

**Fair die:** $E[X^2] = \tfrac{1+4+9+16+25+36}{6} = \tfrac{91}{6}$, so $\operatorname{Var}(X) = \tfrac{91}{6} - 3.5^2 = \tfrac{35}{12}\approx 2.92$ and $\sigma\approx1.71$.`,
    },
    {
      kind: 'widget',
      title: 'Same mean, different spread',
      body: String.raw`Both curves are centred at 0. Slide $\sigma$ to change the spread of the coloured curve: larger $\sigma$ means a flatter, wider curve — the total area stays 1.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['exp(-x^2/(2*s^2))/(s*sqrt(2*PI))', 'exp(-x^2/2)/sqrt(2*PI)'],
          x: [-6, 6], y: [0, 0.9], params: [{ name: 's', min: 0.5, max: 3, value: 2, label: 'σ' }],
          labels: ['SD = σ', 'SD = 1'], xLabel: 'x', yLabel: 'density',
        },
      },
    },
    {
      kind: 'numeric',
      prompt: 'A Bernoulli($p$) variable with $p = 0.3$ (1 with probability 0.3, else 0). What is its variance?',
      answer: 0.21,
      tolerance: 0.001,
      why: 'X² = X for a 0/1 variable, so E[X²] = p = 0.3 and Var = p − p² = p(1 − p) = 0.3 × 0.7 = 0.21.',
    },
    {
      kind: 'explain',
      title: 'Rules for variance',
      body: String.raw`- **Shifting** doesn't change spread; **scaling** multiplies it: $\operatorname{Var}(aX+b) = a^2\operatorname{Var}(X)$, so $\operatorname{SD}(aX+b)=|a|\,\operatorname{SD}(X)$.
- For **independent** $X$ and $Y$: $\operatorname{Var}(X+Y) = \operatorname{Var}(X)+\operatorname{Var}(Y)$ — and also $\operatorname{Var}(X-Y) = \operatorname{Var}(X)+\operatorname{Var}(Y)$!
- Standard deviations do **not** add; variances do (for independent pieces).

So a $\text{Bin}(n,p)$, a sum of $n$ independent Bernoullis, has variance $np(1-p)$. The step-by-step below shows the most important consequence.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Let $X_1,\dots,X_n$ be independent, each with mean $\mu$ and variance $\sigma^2$. Their average is $\bar X = \tfrac1n(X_1+\dots+X_n)$.`,
            String.raw`Mean: $E[\bar X] = \tfrac1n(\mu+\dots+\mu) = \mu$.`,
            String.raw`Variance: $\operatorname{Var}(\bar X) = \tfrac{1}{n^2}\operatorname{Var}(X_1+\dots+X_n) = \tfrac{1}{n^2}\cdot n\sigma^2 = \dfrac{\sigma^2}{n}$.`,
            String.raw`So $\operatorname{SD}(\bar X) = \sigma/\sqrt n$: averaging $n$ independent measurements shrinks the noise by a factor $\sqrt n$.`,
          ],
          notes: ['', 'Linearity of expectation.', 'Scaling by 1/n squares to 1/n²; independence lets the n variances add.', 'This drives the law of large numbers and the central limit theorem.'],
        },
      },
    },
    {
      kind: 'truefalse',
      prompt: 'For independent $X$ and $Y$: $\\operatorname{Var}(X - Y) = \\operatorname{Var}(X) - \\operatorname{Var}(Y)$.',
      answer: false,
      why: 'Var(X − Y) = Var(X) + (−1)² Var(Y) = Var(X) + Var(Y). Subtracting an independent noisy quantity adds uncertainty — it can never cancel it. (Otherwise Var(X) − Var(Y) could even be negative.)',
    },
    {
      kind: 'mcq',
      prompt: '$X$ has standard deviation 3. What is the standard deviation of $2X + 5$?',
      choices: ['3', '6', '11', '12'],
      answer: 1,
      why: 'Adding 5 shifts without changing spread; multiplying by 2 doubles the SD: 2 × 3 = 6. (The variance goes from 9 to 36 — answer 12 might come from doubling the variance instead of quadrupling it.)',
    },
    {
      kind: 'match',
      prompt: 'Match each expression to its equal.',
      pairs: [
        ['$E[aX+b]$', '$aE[X]+b$'],
        ['$\\operatorname{Var}(aX+b)$', '$a^2\\operatorname{Var}(X)$'],
        ['$\\operatorname{Var}(X)$', '$E[X^2]-(E[X])^2$'],
        ['$E[X+Y]$', '$E[X]+E[Y]$'],
      ],
      why: 'Expectation is linear; variance ignores shifts and scales with the square of the multiplier; and the shortcut formula for variance avoids computing every deviation.',
    },
    {
      kind: 'fill',
      prompt: 'The standard deviation is the ___ of the variance, and it has the same ___ as $X$ itself.',
      bank: ['square root', 'square', 'units', 'sign'],
      answer: ['square root', 'units'],
      why: 'Variance is in squared units (e.g. cm²), which is hard to interpret; taking the square root returns to cm.',
    },
    {
      kind: 'numeric',
      prompt: 'A basketball player makes each free throw independently with probability 0.25 and takes 20 shots. What is the **variance** of the number made?',
      answer: 3.75,
      tolerance: 0.001,
      why: 'Made shots ~ Bin(20, 0.25), a sum of 20 independent Bernoullis each with variance 0.25 × 0.75 = 0.1875. Variances add: 20 × 0.1875 = 3.75 (SD ≈ 1.94). The mean is np = 5.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $E[X]$ = probability-weighted average = long-run average = balance point.
- **Linearity:** $E[aX+b]=aE[X]+b$ and $E[X+Y]=E[X]+E[Y]$ always — use indicators to count.
- $\operatorname{Var}(X)=E[(X-\mu)^2]=E[X^2]-\mu^2$; SD is its square root.
- $\operatorname{Var}(aX+b)=a^2\operatorname{Var}(X)$; for **independent** variables, variances add.
- Mean of $n$ independent copies: $E[\bar X]=\mu$, $\operatorname{SD}(\bar X)=\sigma/\sqrt n$.

This last fact powers the [law of large numbers](@stats/law-of-large-numbers).`,
    },
  ],
  references: [
    { authors: 'J. K. Blitzstein, J. Hwang', title: 'Introduction to Probability', year: 2019, venue: '2nd ed., CRC Press', detail: 'Ch. 4 (Expectation), Ch. 6 (Moments)' },
    { authors: 'L. Wasserman', title: 'All of Statistics', year: 2004, venue: 'Springer', detail: 'Ch. 3' },
    { authors: 'B. Illowsky, S. Dean et al.', title: 'Introductory Statistics', year: 2013, venue: 'OpenStax', detail: 'Ch. 4.2', url: 'https://openstax.org/details/books/introductory-statistics' },
  ],
} satisfies LessonContent;
