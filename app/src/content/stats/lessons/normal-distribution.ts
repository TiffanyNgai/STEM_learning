import type { LessonContent } from '../../types';
import { empiricalRule } from '../svg';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The bell curve',
      body: String.raw`Adult heights, measurement errors, exam scores, the average of many dice: plot any of them and a symmetric **bell shape** appears. This is the **normal** (Gaussian) distribution — the most important distribution in statistics.

Why so common? Roughly: whenever a quantity is the **sum of many small, independent effects** (many genes, many tiny errors), it comes out approximately normal. That is the [central limit theorem](@stats/central-limit-theorem), coming soon.

Play with the two parameters, $\mu$ and $\sigma$, and watch the shaded probability.`,
      widget: { type: 'DistributionExplorer', props: { dist: 'normal' }, caption: 'Shaded: P(μ − σ ≤ X ≤ μ + σ) ≈ 0.683, whatever μ and σ are.' },
    },
    {
      kind: 'explain',
      title: 'Two numbers define it',
      body: String.raw`We write $X\sim N(\mu,\sigma^2)$. Its density is
$$f(x) = \frac{1}{\sigma\sqrt{2\pi}}\;\exp\!\Big(-\frac{(x-\mu)^2}{2\sigma^2}\Big).$$
Don't memorise it — read it:

- $(x-\mu)^2$: the curve depends only on distance from $\mu$, so it is **symmetric about the mean** $\mu$.
- $\exp(-\text{distance}^2)$: probability falls off *very* fast in the tails.
- $\sigma$ (the SD) sets the **width**; the factor $1/(\sigma\sqrt{2\pi})$ makes the total area 1.

So $\mu$ slides the curve; $\sigma$ stretches it.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['exp(-(x-m)^2/(2*s^2))/(s*sqrt(2*PI))'], x: [-6, 6], y: [0, 0.85],
          params: [{ name: 'm', min: -3, max: 3, value: 0, label: 'μ' }, { name: 's', min: 0.5, max: 3, value: 1, label: 'σ' }],
          xLabel: 'x', yLabel: 'f(x)',
        },
      },
    },
    {
      kind: 'mcq',
      prompt: 'If you **increase $\\sigma$** while keeping $\\mu$ fixed, the normal curve…',
      choices: ['moves to the right', 'gets wider and flatter, still with total area 1', 'gets taller and narrower', 'becomes skewed'],
      answer: 1,
      why: 'σ is the spread. Spreading the same total area (1) over a wider range forces the peak down — the height at μ is 1/(σ√(2π)). μ, not σ, controls location; the normal is never skewed.',
    },
    {
      kind: 'explain',
      title: 'The 68–95–99.7 rule',
      body: String.raw`For **every** normal distribution:

- about **68%** of values lie within $1\sigma$ of $\mu$,
- about **95%** within $2\sigma$ (more precisely $1.96\sigma$),
- about **99.7%** within $3\sigma$.

**Example:** IQ scores are scaled to $\mu=100$, $\sigma=15$. So ~95% of people score between 70 and 130, and a score above 145 ($3\sigma$ up) is about a 1-in-700 event (0.15%, half of the 0.3% outside $\pm3\sigma$).`,
      widget: { type: 'SvgDiagram', props: { svg: empiricalRule() }, caption: 'Bands at ±1σ, ±2σ, ±3σ fill in from the centre.' },
    },
    {
      kind: 'numeric',
      prompt: 'Heights in a population are roughly $N(170, 10^2)$ cm. Using the 68–95–99.7 rule, about what **percentage** are taller than 190 cm?',
      answer: 2.5,
      tolerance: 0.4,
      unit: '%',
      why: '190 is 2σ above the mean. 95% lie within ±2σ, leaving 5% outside, split equally between the two tails by symmetry: 2.5% above 190. (The exact value is 2.28%.)',
    },
    {
      kind: 'explain',
      title: 'Standardising: z-scores',
      body: String.raw`Any normal can be converted to the **standard normal** $Z\sim N(0,1)$ by
$$Z = \frac{X-\mu}{\sigma}.$$
The **z-score** says *how many standard deviations above (or below) the mean* a value is. It lets us compare apples and oranges: a 185 cm height ($z=1.5$) is "more unusual" than an IQ of 115 ($z=1$).

Probabilities for $Z$ come from its CDF, written $\Phi(z) = P(Z\le z)$ (capital phi), found in tables or software. Landmarks: $\Phi(0)=0.5$, $\Phi(1)\approx0.841$, $\Phi(1.645)\approx0.95$, $\Phi(1.96)\approx0.975$, $\Phi(2)\approx 0.977$.`,
    },
    {
      kind: 'numeric',
      prompt: 'IQ ~ $N(100, 15^2)$. What is the z-score of an IQ of 130?',
      answer: 2,
      tolerance: 0.001,
      why: 'z = (130 − 100) / 15 = 30/15 = 2: two standard deviations above the mean, roughly the top 2.3%.',
    },
    {
      kind: 'explain',
      title: 'Computing normal probabilities',
      body: String.raw`To find $P(a\le X\le b)$ for $X\sim N(\mu,\sigma^2)$: standardise both ends, then subtract CDF values:
$$P(a\le X\le b) = \Phi\!\Big(\tfrac{b-\mu}{\sigma}\Big) - \Phi\!\Big(\tfrac{a-\mu}{\sigma}\Big).$$
**Example:** $X\sim N(170,10^2)$, $P(160\le X\le 185) = \Phi(1.5)-\Phi(-1) \approx 0.933 - 0.159 = 0.775$.

Use symmetry: $\Phi(-z) = 1-\Phi(z)$. Switch the explorer to **cdf** view: the red bar is exactly $F(b)-F(a)$.`,
      widget: { type: 'DistributionExplorer', props: { dist: 'normal', mode: 'cdf', a: -1, b: 1.5 }, caption: 'In cdf view, the vertical bar at b has length F(b) − F(a): the probability of landing between a and b.' },
    },
    {
      kind: 'mcq',
      prompt: 'For $Z\\sim N(0,1)$, what is $P(Z > 1.96)$?',
      choices: ['0.05', '0.025', '0.975', '0.95'],
      answer: 1,
      why: 'P(Z > 1.96) = 1 − Φ(1.96) = 1 − 0.975 = 0.025. Together with the lower tail that makes 5% outside ±1.96 — the source of "95% confidence" you will meet later.',
    },
    {
      kind: 'truefalse',
      prompt: 'For $X\\sim N(\\mu,\\sigma^2)$, the single value $X=\\mu$ has the highest probability of any value, about 0.4 when $\\sigma=1$.',
      answer: false,
      why: 'X is continuous, so P(X = μ) = 0 like any single point. The density is highest at μ (0.399 for σ = 1), meaning values *near* μ are most likely — but a density height is not a probability.',
    },
    {
      kind: 'explain',
      title: 'Normals stay normal',
      body: String.raw`Two facts make normals easy to compute with:

1. **Linear transformations:** if $X\sim N(\mu,\sigma^2)$ then $aX+b\sim N(a\mu+b,\;a^2\sigma^2)$.
2. **Independent sums:** if $X\sim N(\mu_1,\sigma_1^2)$ and $Y\sim N(\mu_2,\sigma_2^2)$ are independent, then
$$X+Y\sim N(\mu_1+\mu_2,\;\sigma_1^2+\sigma_2^2).$$
Means add, **variances** add (not SDs). Very few distributions have this "closed under addition" property in such a clean form.

**Example:** two independent bags weighing $N(10,3^2)$ and $N(5,4^2)$ kg have total weight $N(15, 25)$, i.e. SD 5 kg.`,
    },
    {
      kind: 'numeric',
      prompt: '$X\\sim N(20, 6^2)$ and $Y\\sim N(4, 8^2)$ are independent. What is the **standard deviation** of $X - Y$?',
      answer: 10,
      tolerance: 0.001,
      why: 'Var(X − Y) = Var X + Var Y = 36 + 64 = 100, so SD = 10. Subtracting does not subtract variances, and SDs do not add (6 + 8 = 14 and 8 − 6 = 2 are both wrong).',
    },
    {
      kind: 'match',
      prompt: 'Match each standard normal CDF value.',
      pairs: [
        ['$\\Phi(0)$', '0.5'],
        ['$\\Phi(1)$', '0.841'],
        ['$\\Phi(1.96)$', '0.975'],
        ['$\\Phi(-1)$', '0.159'],
      ],
      why: 'Φ(0) = 0.5 by symmetry; ±1σ holds 68%, so Φ(1) ≈ 0.5 + 0.34; ±1.96σ holds 95%, so Φ(1.96) = 0.975; and Φ(−1) = 1 − Φ(1).',
    },
    {
      kind: 'multi',
      prompt: '$X$ and $Y$ are independent normal random variables. Which of these are also normally distributed?',
      choices: ['$3X - 7$', '$X + Y$', '$X^2$', '$(X - \\mu)/\\sigma$', '$|X|$'],
      answers: [0, 1, 3],
      why: 'Linear transformations and independent sums of normals are normal. X² (a chi-square shape when X is standard normal) and |X| are never negative, so they cannot be normal.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $N(\mu,\sigma^2)$: symmetric bell centred at $\mu$ with spread $\sigma$.
- **68–95–99.7:** share of values within 1, 2, 3 SDs of the mean.
- **z-score** $z=(x-\mu)/\sigma$ converts to the standard normal; use $\Phi$ for probabilities.
- $P(a\le X\le b)=\Phi\big(\frac{b-\mu}\sigma\big)-\Phi\big(\frac{a-\mu}\sigma\big)$; $\Phi(-z)=1-\Phi(z)$.
- Linear functions and independent sums of normals are normal; variances add.`,
    },
  ],
  references: [
    { authors: 'B. Illowsky, S. Dean et al.', title: 'Introductory Statistics', year: 2013, venue: 'OpenStax', detail: 'Ch. 6 (The normal distribution)', url: 'https://openstax.org/details/books/introductory-statistics' },
    { authors: 'J. K. Blitzstein, J. Hwang', title: 'Introduction to Probability', year: 2019, venue: '2nd ed., CRC Press', detail: 'Ch. 5.4' },
    { authors: 'G. Casella, R. L. Berger', title: 'Statistical Inference', year: 2002, venue: '2nd ed., Duxbury', detail: 'Ch. 3.3' },
  ],
} satisfies LessonContent;
