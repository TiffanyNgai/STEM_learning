import type { LessonContent } from '../../types';
import { samplingPipeline } from '../svg';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Two polls, two answers',
      body: String.raw`Poll A asks 1000 random voters and finds 52% support. Poll B, same week, same method, finds 49%. Is someone lying?

No — each poll saw a *different random sample*, so it got a different number. A number computed from a sample (a **statistic**) is itself a **random variable**. Its distribution over all the samples you *could* have drawn is its **sampling distribution**. Understanding it is the foundation of every confidence interval and hypothesis test.`,
      widget: { type: 'SvgDiagram', props: { svg: samplingPipeline() }, caption: 'Imagine repeating the study over and over: each repetition yields one value of the statistic.' },
    },
    {
      kind: 'explain',
      title: 'Parameters vs statistics',
      body: String.raw`- A **parameter** is a fixed (usually unknown) number describing the **population**: the mean $\mu$, the SD $\sigma$, the proportion $p$.
- A **statistic** is computed from the **sample**: the sample mean $\bar x$, the sample SD $s$, the sample proportion $\hat p$ ("p-hat").

Statistics are used to **estimate** parameters. A hat ($\hat{\ }$) usually signals "estimate of". The central question of inference: *how far is the statistic likely to be from the parameter?* The sampling distribution answers it.`,
    },
    {
      kind: 'match',
      prompt: 'Match each population parameter with the sample statistic that estimates it.',
      pairs: [
        ['population mean $\\mu$', 'sample mean $\\bar x$'],
        ['population proportion $p$', 'sample proportion $\\hat p$'],
        ['population SD $\\sigma$', 'sample SD $s$'],
        ['population correlation $\\rho$', 'sample correlation $r$'],
      ],
      why: 'Convention: Greek letters for population parameters, Latin letters (or hats) for statistics computed from data.',
    },
    {
      kind: 'explain',
      title: 'Sampling distribution of the mean',
      body: String.raw`For a random sample of size $n$ from a population with mean $\mu$ and SD $\sigma$:

- **Centre:** $E[\bar X]=\mu$. On average the sample mean is right — it is **unbiased**.
- **Spread:** $\operatorname{SD}(\bar X)=\sigma/\sqrt n$. This SD of a statistic has a special name: the **standard error** (SE).
- **Shape:** normal if the population is normal; approximately normal for large $n$ by the [CLT](@stats/central-limit-theorem).

Below, the population is flat (uniform on 0–10, $\sigma\approx2.89$). With $n=25$ the SE is $2.89/5\approx0.58$: nearly all sample means fall within about $5\pm1.2$.`,
      widget: { type: 'CLTSampler', props: { population: 'uniform', n: 25, choosePopulation: false } },
    },
    {
      kind: 'numeric',
      prompt: 'A population has SD $\\sigma = 20$. What is the standard error of the mean for a random sample of $n = 100$?',
      answer: 2,
      tolerance: 0.001,
      why: 'SE = σ/√n = 20/10 = 2. Individual values vary by about ±20, but averages of 100 vary by only about ±2.',
    },
    {
      kind: 'explain',
      title: 'Sampling distribution of a proportion',
      body: String.raw`A proportion is a mean of 0/1 values, so the same results apply with $\mu=p$ and $\sigma=\sqrt{p(1-p)}$:
$$E[\hat p]=p,\qquad \operatorname{SE}(\hat p)=\sqrt{\frac{p(1-p)}{n}},$$
and $\hat p$ is approximately normal when $np$ and $n(1-p)$ are both $\gtrsim10$.

**Polls:** with $n=1000$ and $p\approx0.5$, $\operatorname{SE}\approx\sqrt{0.25/1000}\approx0.016$. About 95% of polls land within $\pm2\,\text{SE}\approx\pm3$ points of the truth — the "margin of error" quoted in the news.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['sqrt(p*(1-p)/x)'], x: [10, 2000], y: [0, 0.16],
          params: [{ name: 'p', min: 0.02, max: 0.98, value: 0.5 }], xLabel: 'sample size n', yLabel: 'SE(p̂)',
        },
        caption: 'Standard error of a proportion: steep gains for small n, slow gains later. Largest at p = 0.5.',
      },
    },
    {
      kind: 'numeric',
      prompt: 'A poll of $n = 400$ voters on a question where the true support is $p = 0.5$. What is the standard error of $\\hat p$? (decimal)',
      answer: 0.025,
      tolerance: 0.0005,
      why: 'SE = √(0.5 × 0.5 / 400) = √0.000625 = 0.025, i.e. 2.5 percentage points. The 95% margin of error is about ±5 points.',
    },
    {
      kind: 'mcq',
      prompt: 'Back to the two polls: 52% and 49%, each with $n=1000$ ($\\text{SE}\\approx1.6$ points each). What is the most reasonable conclusion?',
      choices: [
        'One poll must be biased, since they disagree',
        'Opinion must have shifted between the polls',
        'The gap is consistent with ordinary sampling variability',
        'The true support is exactly 50.5%',
      ],
      answer: 2,
      why: 'The difference of two independent estimates has SE ≈ √(1.6² + 1.6²) ≈ 2.2 points; a 3-point gap is only about 1.3 SEs — very common by chance alone. Averaging the polls (50.5%) is sensible, but it is still an estimate, not exact.',
    },
    {
      kind: 'explain',
      title: 'Estimating σ: the sample SD',
      body: String.raw`We rarely know $\sigma$, so we estimate it with the **sample standard deviation**
$$s=\sqrt{\frac{1}{n-1}\sum_{i=1}^n (x_i-\bar x)^2}.$$
Why $n-1$, not $n$? The deviations are measured from $\bar x$, which is computed from the same data and sits *closer* to the data than the true $\mu$ does. Dividing by $n-1$ exactly corrects this on average: $E[s^2]=\sigma^2$ (**Bessel's correction**). Intuitively, once $\bar x$ is fixed only $n-1$ deviations are free — the last is determined.

The **estimated** standard error is then $s/\sqrt n$. Replacing $\sigma$ by $s$ adds a little extra uncertainty, handled by the $t$ distribution.`,
    },
    {
      kind: 'truefalse',
      prompt: 'A national poll of 1000 people in a country of 300 million has a much larger standard error than a poll of 1000 people in a city of 300 000.',
      answer: false,
      why: 'For random samples that are a small fraction of the population, SE = √(p(1 − p)/n) depends on the sample size n, not the population size. Tasting a spoonful tells you about the soup whether the pot is small or huge — as long as it is well stirred (random).',
    },
    {
      kind: 'multi',
      prompt: 'Which changes **reduce** the standard error of a sample mean?',
      choices: [
        'Increasing the sample size $n$',
        'Measuring with a more precise instrument (smaller $\\sigma$)',
        'Sampling from a larger population',
        'Reporting $\\bar x$ with more decimal places',
      ],
      answers: [0, 1],
      why: 'SE = σ/√n, so only n and σ matter. Population size is irrelevant (when it is much larger than n), and extra decimal places add apparent, not real, precision.',
    },
    {
      kind: 'fill',
      prompt: 'The standard error of a sample proportion is √( ___ / n ), and it is largest when p = ___.',
      bank: ['p(1−p)', 'p', 'σ', '0.5', '1', '0'],
      answer: ['p(1−p)', '0.5'],
      why: 'Each 0/1 response has variance p(1 − p), which peaks at p = 0.5 (value 0.25). That is why pollsters plan sample sizes using p = 0.5: it is the worst case.',
    },
    {
      kind: 'order',
      prompt: 'Put the steps of **simulating** a sampling distribution in order.',
      steps: [
        'Specify the population (or a model of it)',
        'Draw a random sample of size n',
        'Compute the statistic for that sample',
        'Repeat the draw-and-compute steps many times',
        'Plot a histogram of the statistic values',
      ],
      why: 'The sampling distribution is literally the distribution of the statistic across repeated samples. Simulation makes this concrete — and the bootstrap later imitates it using only the data you have.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **statistic** varies from sample to sample; its distribution is the **sampling distribution**.
- Sample mean: centre $\mu$, **standard error** $\sigma/\sqrt n$, approximately normal for large $n$.
- Sample proportion: centre $p$, SE $\sqrt{p(1-p)/n}$; ±2 SE is the usual "margin of error".
- SE depends on $n$, not population size (for small sampling fractions).
- Estimate $\sigma$ by $s$ (divide by $n-1$); estimated SE is $s/\sqrt n$.

Next: turning a standard error into a range of plausible values — [confidence intervals](@stats/confidence-intervals) — and imitating repeated sampling from a single dataset with the [bootstrap](@stats/bootstrap).`,
    },
  ],
  references: [
    { authors: 'B. Illowsky, S. Dean et al.', title: 'Introductory Statistics', year: 2013, venue: 'OpenStax', detail: 'Ch. 7–8', url: 'https://openstax.org/details/books/introductory-statistics' },
    { authors: 'G. Casella, R. L. Berger', title: 'Statistical Inference', year: 2002, venue: '2nd ed., Duxbury', detail: 'Ch. 5.1–5.3 (Properties of a random sample)' },
    { authors: 'D. Freedman, R. Pisani, R. Purves', title: 'Statistics', year: 2007, venue: '4th ed., W. W. Norton', detail: 'Ch. 20–23' },
  ],
} satisfies LessonContent;
