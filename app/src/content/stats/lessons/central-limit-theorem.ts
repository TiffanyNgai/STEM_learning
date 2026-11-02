import type { LessonContent } from '../../types';
import { galtonBoard } from '../svg';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Order from chaos',
      body: String.raw`Drop balls through a board of pegs. At each peg a ball bounces left or right, 50/50. Where it lands is the **sum of many small random steps** — and the pile that builds up is a bell curve.

This is no coincidence. The **central limit theorem** (CLT) says that sums and averages of many independent random pieces are approximately **normal**, almost regardless of what the individual pieces look like. It is why the bell curve is everywhere — and why so much of statistics works.`,
      widget: { type: 'SvgDiagram', props: { svg: galtonBoard() }, caption: 'A Galton board: 8 left/right bounces per ball. The slot heights are binomial(8, ½) — already bell-shaped.' },
    },
    {
      kind: 'explain',
      title: 'The statement',
      body: String.raw`Let $X_1,\dots,X_n$ be i.i.d. with mean $\mu$ and **finite** variance $\sigma^2$. Then the standardised sample mean
$$Z_n = \frac{\bar X_n - \mu}{\sigma/\sqrt n}$$
has a distribution that approaches $N(0,1)$ as $n\to\infty$: $P(Z_n\le z)\to\Phi(z)$ for every $z$.

In practice we read it as an approximation for large $n$:
$$\bar X_n \;\approx\; N\!\Big(\mu,\;\frac{\sigma^2}{n}\Big),\qquad X_1+\dots+X_n\;\approx\;N(n\mu,\;n\sigma^2).$$
The mean and variance come from the last lessons; the CLT's new claim is the **shape**: normal.`,
    },
    {
      kind: 'widget',
      title: 'See it happen',
      body: String.raw`The top panel is a very **skewed** population (exponential). Each tick, the widget draws a sample of size $n$ (orange dots), computes its mean (red marker), and adds it to the histogram below. Try $n=1$, then $n=5$, then $n=30$. Switch to other populations too — even the two-humped one.`,
      widget: { type: 'CLTSampler', props: { population: 'exponential', n: 5 } },
    },
    {
      kind: 'mcq',
      prompt: 'In the sampler, as you increase $n$ for the skewed population, the histogram of sample means…',
      choices: [
        'keeps the skewed shape of the population, just narrower',
        'becomes narrower and more symmetric and bell-shaped',
        'becomes wider, because there is more data',
        'stays the same — n only affects individual samples',
      ],
      answer: 1,
      why: 'Two effects at once: the spread shrinks like σ/√n (the LLN at work) and the shape becomes normal (the CLT). With n = 1 the "means" are just single draws, so the histogram copies the population.',
    },
    {
      kind: 'explain',
      title: 'What the CLT does NOT say',
      body: String.raw`- It is about the **distribution of the average** (or sum), not of the data. Collect a million skewed incomes and their histogram is still skewed.
- "Large $n$" depends on the population: symmetric populations converge by $n\approx5$; strongly skewed ones may need $n$ in the hundreds. The classroom rule "$n\ge30$" is only a rough guide.
- It needs **finite variance**. For heavy-tailed distributions like the Cauchy, averages never become normal.
- It needs (enough) **independence**. Strongly dependent data — e.g. a stock's daily prices — can break it.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Because of the CLT, if you collect $n = 1000$ observations from a skewed population, a histogram of those 1000 observations will look approximately normal.',
      answer: false,
      why: 'The data still follow the skewed population — more data just reveal its shape more clearly. The CLT concerns the sample mean: if you repeated the whole 1000-observation study many times, the 1000-point averages would be nearly normal.',
    },
    {
      kind: 'widget',
      title: 'Worked example: 100 dice',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Roll 100 fair dice and let $S$ be the total. One die has $\mu=3.5$ and $\sigma^2=35/12\approx2.917$.`,
            String.raw`Sum of 100 i.i.d. dice: $E[S]=100\times3.5=350$, $\operatorname{Var}(S)=100\times2.917=291.7$, so $\operatorname{SD}(S)\approx17.1$.`,
            String.raw`CLT: $S\approx N(350,\,17.1^2)$. Question: how likely is $S\ge 380$?`,
            String.raw`Standardise: $z=(380-350)/17.1\approx1.75$.`,
            String.raw`$P(S\ge380)\approx1-\Phi(1.75)\approx 1-0.960=0.04$. About a 4% chance.`,
          ],
          notes: ['', 'Means add; for independent dice, variances add.', 'No need to enumerate 6¹⁰⁰ outcomes!', '380 is 1.75 SDs above the expected total.', 'A continuity correction (using 379.5) gives nearly the same answer.'],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: 'A lab instrument has measurement SD $\\sigma = 12$ units. You average $n=36$ independent measurements. What is the standard deviation of the average?',
      answer: 2,
      tolerance: 0.001,
      why: 'SD of the mean = σ/√n = 12/√36 = 12/6 = 2. By the CLT this average is also approximately normal, so it is within ±4 of the true value about 95% of the time.',
    },
    {
      kind: 'widget',
      title: 'Even a die',
      body: String.raw`A single die is flat — every face equally likely. Average two dice and you get a triangle; average five and it is already close to a bell. Slide $n$ upward from 1.`,
      widget: { type: 'CLTSampler', props: { population: 'dice', n: 2, choosePopulation: false, maxN: 30 } },
    },
    {
      kind: 'mcq',
      prompt: 'You quadruple your sample size from $n$ to $4n$. The standard deviation of the sample mean…',
      choices: ['is divided by 4', 'is divided by 2', 'stays the same', 'is divided by 16'],
      answer: 1,
      why: 'σ/√(4n) = (σ/√n)/2. Precision improves with the square root of the sample size — the "√n law" — which is why halving the error costs four times the data.',
    },
    {
      kind: 'explain',
      title: 'Normal approximation to the binomial',
      body: String.raw`A $\text{Bin}(n,p)$ count is a sum of $n$ independent 0/1 variables, so the CLT applies:
$$\text{Bin}(n,p)\;\approx\;N\big(np,\;np(1-p)\big),$$
a good approximation when $np$ and $n(1-p)$ are both at least about 10.

**Example:** 400 fair flips: mean $200$, SD $\sqrt{400\cdot\tfrac14}=10$. Getting 220 or more heads is a $2\sigma$ event — about 2.3%. Push $n$ and $p$ around in the explorer: when $p$ is near 0 or 1 with small $n$, the bars are visibly skewed and the approximation is poor.`,
      widget: { type: 'DistributionExplorer', props: { dist: 'binomial', params: { n: 40, p: 0.5 } }, caption: 'Bin(40, 0.5): already a near-perfect bell.' },
    },
    {
      kind: 'numeric',
      prompt: 'Flip a fair coin 400 times. Using the normal approximation, what is $P(\\text{at least 220 heads})$? (decimal)',
      answer: 0.024,
      tolerance: 0.004,
      why: 'Mean 200, SD 10, so z = (220 − 200)/10 = 2 and P ≈ 1 − Φ(2) ≈ 0.023. With a continuity correction, z = (219.5 − 200)/10 = 1.95, giving ≈ 0.026. Either is accepted.',
    },
    {
      kind: 'match',
      prompt: 'For i.i.d. $X_i$ with mean $\\mu$ and variance $\\sigma^2$, and large $n$, match each quantity to its approximate distribution.',
      pairs: [
        ['$X_1+\\dots+X_n$', '$N(n\\mu,\\ n\\sigma^2)$'],
        ['$\\bar X_n$', '$N(\\mu,\\ \\sigma^2/n)$'],
        ['$(\\bar X_n-\\mu)/(\\sigma/\\sqrt n)$', '$N(0,\\ 1)$'],
        ['$\\text{Bin}(n,p)$', '$N(np,\\ np(1-p))$'],
      ],
      why: 'All four are the same theorem in different clothing: sums have variance nσ², dividing by n gives the mean with variance σ²/n, standardising gives N(0,1), and a binomial is a sum of Bernoullis with σ² = p(1 − p).',
    },
    {
      kind: 'multi',
      prompt: 'Which conditions matter for the CLT approximation of a sample mean to be good?',
      choices: [
        'Observations are (at least roughly) independent',
        'The population has finite variance',
        'The population itself is normal',
        'n is large enough given how skewed the population is',
        'n is at least 30, which always suffices',
      ],
      answers: [0, 1, 3],
      why: 'Independence and finite variance are the key assumptions, and the needed n depends on skewness. A normal population is not required (that is the point!), and n ≥ 30 is a rule of thumb that fails for very skewed populations.',
    },
    {
      kind: 'fill',
      prompt: 'The standard error of the mean is $\\sigma$ divided by ___, so to halve it you need ___ times as many observations.',
      bank: ['√n', 'n', 'n²', '2', '4', '8'],
      answer: ['√n', '4'],
      why: 'SE = σ/√n. Halving requires √n to double, i.e. n to quadruple.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **CLT:** for i.i.d. data with finite variance, $\bar X_n\approx N(\mu,\sigma^2/n)$ for large $n$ — whatever the population's shape.
- Equivalently, sums are $\approx N(n\mu, n\sigma^2)$ and binomials are $\approx N(np, np(1-p))$.
- It describes the **average**, not the data; skewed populations need larger $n$.
- Requires finite variance and (near-)independence.
- Precision grows like $\sqrt n$.

Next: using this to understand how statistics vary from sample to sample — [sampling distributions](@stats/sampling-distributions).`,
    },
  ],
  references: [
    { authors: 'B. Illowsky, S. Dean et al.', title: 'Introductory Statistics', year: 2013, venue: 'OpenStax', detail: 'Ch. 7 (The central limit theorem)', url: 'https://openstax.org/details/books/introductory-statistics' },
    { authors: 'J. K. Blitzstein, J. Hwang', title: 'Introduction to Probability', year: 2019, venue: '2nd ed., CRC Press', detail: 'Ch. 10.3' },
    { authors: 'L. Wasserman', title: 'All of Statistics', year: 2004, venue: 'Springer', detail: 'Ch. 5.4' },
    { authors: 'G. Casella, R. L. Berger', title: 'Statistical Inference', year: 2002, venue: '2nd ed., Duxbury', detail: 'Ch. 5.5' },
  ],
} satisfies LessonContent;
