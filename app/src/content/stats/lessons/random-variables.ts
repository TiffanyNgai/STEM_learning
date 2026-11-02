import type { LessonContent } from '../../types';
import { coinsToX } from '../svg';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Turning outcomes into numbers',
      body: String.raw`Outcomes like "HTH" are awkward to do arithmetic with. A **random variable** attaches a *number* to every outcome.

Flip three coins and let $X$ = number of heads. Then $X(\text{HTH}) = 2$, $X(\text{TTT})=0$.

Despite the name, a random variable is not a variable and not random — it is a **function** from $\Omega$ to the real numbers. The randomness lives in *which* outcome occurs; $X$ just reads off a number. Capital letters ($X$) name the random variable; lower case ($x$) names a particular value it can take.`,
      widget: { type: 'SvgDiagram', props: { svg: coinsToX() }, caption: 'Each of the 8 equally likely outcomes is sent to a number of heads.' },
    },
    {
      kind: 'mcq',
      prompt: 'With $X$ = number of heads in three fair coin flips, how many of the 8 outcomes have $X = 2$?',
      choices: ['1', '2', '3', '4'],
      answer: 2,
      why: 'HHT, HTH and THH — choose which one of the three flips is the tail: 3 ways. So P(X = 2) = 3/8.',
    },
    {
      kind: 'explain',
      title: 'The probability mass function',
      body: String.raw`A **discrete** random variable takes a list of separate values (0, 1, 2, …). Its **probability mass function** (pmf) gives the probability of each value:
$$p(x) = P(X = x).$$
Every pmf satisfies $p(x)\ge 0$ and $\sum_x p(x) = 1$.

For three coins: $p(0)=\tfrac18,\; p(1)=\tfrac38,\; p(2)=\tfrac38,\; p(3)=\tfrac18$. The **distribution** of $X$ is this whole table — it says how the total probability of 1 is spread over the possible values.`,
      widget: { type: 'DistributionExplorer', props: { dist: 'binomial', params: { n: 3, p: 0.5 }, a: 2, b: 3 }, caption: 'Bar heights are P(X = k). The shaded bars add up to P(a ≤ X ≤ b).' },
    },
    {
      kind: 'explain',
      title: 'The cumulative distribution function',
      body: String.raw`The **CDF** (cumulative distribution function) accumulates probability from the left:
$$F(x) = P(X \le x).$$
It works for *every* random variable, discrete or not. Properties: it never decreases, starts at 0 (far left), ends at 1 (far right). For a discrete $X$ it is a staircase that jumps by $p(x)$ at each value $x$.

Interval probabilities come from differences: $P(a < X \le b) = F(b) - F(a)$.

Three coins: $F(1) = P(X\le 1) = \tfrac18+\tfrac38 = \tfrac12$.`,
      widget: { type: 'DistributionExplorer', props: { dist: 'binomial', mode: 'cdf', params: { n: 3, p: 0.5 }, a: 0, b: 1 }, caption: 'The CDF of the number of heads: a staircase climbing from 0 to 1.' },
    },
    {
      kind: 'numeric',
      prompt: 'For $X$ = number of heads in three fair flips, what is $F(2) = P(X \\le 2)$? (decimal)',
      answer: 0.875,
      tolerance: 0.001,
      why: 'F(2) = p(0) + p(1) + p(2) = 1/8 + 3/8 + 3/8 = 7/8 = 0.875. Faster: it is 1 − P(X = 3) = 1 − 1/8.',
    },
    {
      kind: 'explain',
      title: 'Bernoulli and binomial',
      body: String.raw`A **Bernoulli($p$)** variable is 1 ("success") with probability $p$ and 0 otherwise — one coin flip, one patient cured or not.

Add up $n$ **independent** Bernoulli($p$) trials and you get a **binomial** variable $X\sim\text{Bin}(n,p)$ ("$\sim$" means "has the distribution"):
$$P(X=k) = \binom{n}{k}p^k(1-p)^{n-k},\quad k=0,1,\dots,n.$$
$p^k(1-p)^{n-k}$ is the chance of one particular sequence with $k$ successes; $\binom{n}{k} = \frac{n!}{k!(n-k)!}$ ("n choose k") counts how many such sequences there are.

**Example:** $n=5$, $p=0.3$: $P(X=2) = 10\times 0.3^2\times 0.7^3 \approx 0.309$.`,
    },
    {
      kind: 'numeric',
      prompt: 'A fair coin is flipped 4 times. What is $P(\\text{exactly 2 heads})$? (decimal)',
      answer: 0.375,
      tolerance: 0.001,
      why: 'C(4,2) = 6 sequences (HHTT, HTHT, HTTH, THHT, THTH, TTHH), each with probability (1/2)^4 = 1/16. So 6/16 = 0.375 — less than half, even though 2 is the most likely count.',
    },
    {
      kind: 'explain',
      title: 'Continuous random variables',
      body: String.raw`Some quantities vary continuously — a waiting time, a height. Then any *single exact* value has probability 0, and probability is **area under a density curve** $f(x)$ (the **pdf**, probability density function):
$$P(a\le X\le b) = \int_a^b f(x)\,dx,$$
where $\int_a^b$ just means "area under $f$ between $a$ and $b$". A density satisfies $f(x)\ge 0$ and total area 1.

A density is *not* a probability: it is probability **per unit of $x$**, so it can exceed 1 when the distribution is concentrated. Try the uniform with a small width.`,
      widget: { type: 'DistributionExplorer', props: { dist: 'uniform', dists: ['uniform', 'exponential', 'normal'], a: 0.5, b: 1.5 }, caption: 'Shaded area = probability. Narrow the uniform to width 0.5: its height becomes 2.' },
    },
    {
      kind: 'truefalse',
      prompt: 'A probability density function $f(x)$ can take values greater than 1.',
      answer: true,
      why: 'Only the total area must equal 1. Uniform on [0, 0.5] has height 2 everywhere on that interval. (A pmf value, being an actual probability, can never exceed 1.)',
    },
    {
      kind: 'mcq',
      prompt: '$X$ is uniform on $[0, 4]$ (equally likely to land anywhere in that interval). What is $P(1 \\le X \\le 2)$?',
      choices: ['$1/2$', '$1/4$', '$1/8$', '$0$, since $X$ is continuous'],
      answer: 1,
      why: 'The density is 1/4 on [0, 4]. The area over [1, 2] is width 1 × height 1/4 = 1/4. Probability 0 applies only to single points, not intervals.',
    },
    {
      kind: 'match',
      prompt: 'Match each term to its description.',
      pairs: [
        ['pmf $p(x)$', '$P(X = x)$ for a discrete variable'],
        ['pdf $f(x)$', 'curve whose area gives probability'],
        ['CDF $F(x)$', '$P(X \\le x)$'],
        ['support', 'the set of values $X$ can take'],
      ],
      why: 'The pmf and pdf describe discrete and continuous variables respectively; the CDF works for both; the support is where the probability lives.',
    },
    {
      kind: 'multi',
      prompt: 'Which are properties of **every** CDF $F$?',
      choices: [
        'It never decreases as $x$ increases',
        '$F(x) \\to 0$ as $x\\to -\\infty$ and $F(x) \\to 1$ as $x \\to \\infty$',
        'It is continuous (no jumps)',
        '$P(a < X \\le b) = F(b) - F(a)$',
      ],
      answers: [0, 1, 3],
      why: 'Accumulated probability can only grow, from 0 to 1, and differences give interval probabilities. CDFs of discrete variables jump at each possible value, so continuity is not guaranteed.',
    },
    {
      kind: 'fill',
      prompt: 'For a continuous $X$ with CDF $F$:  $P(a \\le X \\le b) = F($___$) - F($___$)$.',
      bank: ['b', 'a', '0', '1'],
      answer: ['b', 'a'],
      why: 'Probability up to b minus probability up to a leaves the probability between them. For continuous X it does not matter whether endpoints are included, since single points have probability 0.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **random variable** is a function from outcomes to numbers.
- Discrete: described by a **pmf** $p(x) = P(X=x)$, values summing to 1.
- Continuous: described by a **pdf** $f(x)$; probability is **area**, and $P(X=x)=0$ for any single $x$.
- The **CDF** $F(x)=P(X\le x)$ works for both, and $P(a<X\le b)=F(b)-F(a)$.
- **Binomial** $\text{Bin}(n,p)$: number of successes in $n$ independent trials, $P(X=k)=\binom nk p^k(1-p)^{n-k}$.

Next: summarising a distribution by its centre and spread — [expectation & variance](@stats/expectation-variance).`,
    },
  ],
  references: [
    { authors: 'J. K. Blitzstein, J. Hwang', title: 'Introduction to Probability', year: 2019, venue: '2nd ed., CRC Press', detail: 'Ch. 3 (Random variables), Ch. 5 (Continuous r.v.s)' },
    { authors: 'B. Illowsky, S. Dean et al.', title: 'Introductory Statistics', year: 2013, venue: 'OpenStax', detail: 'Ch. 4–5', url: 'https://openstax.org/details/books/introductory-statistics' },
    { authors: 'L. Wasserman', title: 'All of Statistics', year: 2004, venue: 'Springer', detail: 'Ch. 2' },
  ],
} satisfies LessonContent;
