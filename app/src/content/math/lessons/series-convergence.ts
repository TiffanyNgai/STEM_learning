import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Adding infinitely many numbers',
      body: String.raw`Walk half-way to a wall, then half the remaining distance, then half again… The steps $\tfrac12 + \tfrac14 + \tfrac18 + \cdots$ add up to exactly $1$. But $1 + \tfrac12 + \tfrac13 + \tfrac14 + \cdots$, whose terms also shrink to $0$, adds up to **infinity**. Intuition alone cannot tell them apart.

**Definition.** For a sequence $(a_n)$, the **partial sums** are $S_N = a_1 + a_2 + \cdots + a_N$. The **series** $\sum_{n=1}^\infty a_n$ **converges** to $S$ if the sequence $S_N \to S$ ([in the ε–N sense](@math/sequences-limits)); otherwise it **diverges**.

So an infinite sum is not a sum at all — it is the limit of a sequence of finite sums.`,
    },
    {
      kind: 'widget',
      title: 'Watch the partial sums',
      body: String.raw`Bars are the terms $a_n$; dots are the partial sums $S_N$. Compare the **harmonic series** $\sum 1/n$ (dots keep climbing, like $\ln N$) with $\sum 1/n^2$ (dots level off at $\pi^2/6$, a famous result of Euler). The alternating series zig-zags in on $\ln 2$.`,
      widget: { type: 'MathPartialSums', props: { nMax: 60 } },
    },
    {
      kind: 'explain',
      title: 'Geometric series',
      body: String.raw`The one series you can always sum by hand. For a ratio $r$,

$$S_N = 1 + r + r^2 + \cdots + r^{N} = \frac{1 - r^{N+1}}{1 - r} \quad (r \ne 1).$$

(Multiply by $1 - r$: everything cancels except $1 - r^{N+1}$.) If $|r| < 1$ then $r^{N+1} \to 0$, so

$$\sum_{n=0}^{\infty} r^n = \frac{1}{1 - r}, \qquad |r| < 1.$$

If $|r| \ge 1$ the terms do not shrink to $0$ and the series diverges. Example: $\sum_{n=1}^\infty (1/2)^n = \frac{1}{1 - 1/2} - 1 = 1$ — Zeno's walk.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Compute $\displaystyle\sum_{n=1}^{\infty} 3\left(\tfrac14\right)^n$.`,
      answer: 1,
      why: String.raw`Factor out the first term: $3 \cdot \tfrac14 \cdot \sum_{k=0}^\infty (\tfrac14)^k = \tfrac34 \cdot \frac{1}{1 - 1/4} = \tfrac34 \cdot \tfrac43 = 1$. A common slip is using $\frac{1}{1-r}$ directly, which counts the $n = 0$ term $3$ that is not in the sum, giving $4$.`,
    },
    {
      kind: 'explain',
      title: 'The n-th term test',
      body: String.raw`**If $\sum a_n$ converges, then $a_n \to 0$.** Reason: $a_n = S_n - S_{n-1}$, and both $S_n$ and $S_{n-1}$ tend to the same $S$.

Use it in the contrapositive: if the terms do **not** tend to $0$, the series diverges. So $\sum (-1)^n$ and $\sum \frac{n}{n+1}$ diverge instantly.

But the converse is **false**: terms tending to $0$ do not guarantee convergence. The harmonic series is the classic counterexample — see the proof next.`,
    },
    {
      kind: 'widget',
      title: 'Why the harmonic series diverges',
      body: String.raw`A 14th-century argument due to Nicole Oresme: group the terms in blocks of doubling length.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`$\displaystyle 1 + \tfrac12 + \left(\tfrac13 + \tfrac14\right) + \left(\tfrac15 + \tfrac16 + \tfrac17 + \tfrac18\right) + \cdots$`,
            String.raw`In each bracket, replace every term by the smallest one: $\tfrac13 + \tfrac14 \ge \tfrac14 + \tfrac14 = \tfrac12$, and $\tfrac15 + \cdots + \tfrac18 \ge 4 \cdot \tfrac18 = \tfrac12$.`,
            String.raw`In general the block $\tfrac{1}{2^{k-1}+1} + \cdots + \tfrac{1}{2^k}$ has $2^{k-1}$ terms, each $\ge \tfrac1{2^k}$, so it is $\ge \tfrac12$.`,
            String.raw`Hence $S_{2^k} \ge 1 + \tfrac{k}{2}$, which is unbounded as $k \to \infty$.`,
            String.raw`An increasing, unbounded sequence of partial sums diverges to $\infty$. ∎`,
          ],
          notes: ['', 'Making terms smaller can only make the sum smaller.', '', String.raw`E.g. $S_{1024} \ge 6$. (Actually $S_N \approx \ln N + 0.577$.)`, ''],
        },
      },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`If $a_n \to 0$, then $\sum a_n$ converges.`,
      answer: false,
      why: String.raw`$1/n \to 0$, yet $\sum 1/n$ diverges. "$a_n \to 0$" is **necessary** for convergence but not **sufficient** — the terms must shrink *fast enough*.`,
    },
    {
      kind: 'explain',
      title: 'Comparison and p-series',
      body: String.raw`For series of **non-negative** terms, partial sums only go up, so (by [monotone convergence](@math/sequences-limits)) the series converges ⇔ its partial sums are bounded. That gives:

**Comparison test.** If $0 \le a_n \le b_n$ for all $n$: $\sum b_n$ converges ⇒ $\sum a_n$ converges; and $\sum a_n$ diverges ⇒ $\sum b_n$ diverges.

**p-series.** $\displaystyle\sum_{n=1}^\infty \frac{1}{n^p}$ converges **if and only if** $p > 1$. (Proof via Cauchy's condensation test or the integral test.) So $\sum 1/n^2$ and $\sum 1/n^{1.01}$ converge; $\sum 1/n$ and $\sum 1/\sqrt n$ diverge.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`What can you say about $\displaystyle\sum_{n=1}^\infty \frac{1}{n^2 + 1}$?`,
      choices: [
        String.raw`Converges, by comparison with $\sum 1/n^2$.`,
        String.raw`Diverges, by comparison with $\sum 1/n$.`,
        String.raw`Diverges, because the terms tend to $0$ too slowly.`,
        String.raw`Converges, because the ratio test gives limit $1$.`,
      ],
      answer: 0,
      why: String.raw`$0 < \frac{1}{n^2+1} < \frac{1}{n^2}$ and $\sum 1/n^2$ converges. Comparing with $\sum 1/n$ is valid but useless: being **smaller** than a divergent series proves nothing. The ratio test gives $1$ here, which is **inconclusive**.`,
    },
    {
      kind: 'explain',
      title: 'Ratio and root tests',
      body: String.raw`Compare with a geometric series automatically. Suppose $\displaystyle \lim_{n\to\infty} \left|\frac{a_{n+1}}{a_n}\right| = \rho$.

- $\rho < 1$: $\sum a_n$ converges (even $\sum |a_n|$ does).
- $\rho > 1$: $\sum a_n$ diverges (terms do not tend to $0$).
- $\rho = 1$: **no information** — both $\sum 1/n$ and $\sum 1/n^2$ have $\rho = 1$.

The **root test** uses $\lim |a_n|^{1/n}$ with the same three verdicts. The ratio test shines on factorials and powers: for $\sum 2^n/n!$, $\rho = \lim \frac{2}{n+1} = 0$, so it converges (to $e^2 - 1$).`,
    },
    {
      kind: 'order',
      prompt: String.raw`Arrange the ratio-test argument that $\sum_{n=1}^\infty \frac{n}{2^n}$ converges.`,
      steps: [
        String.raw`Let $a_n = n/2^n > 0$.`,
        String.raw`Compute $\dfrac{a_{n+1}}{a_n} = \dfrac{n+1}{2^{n+1}} \cdot \dfrac{2^n}{n} = \dfrac{n+1}{2n}$.`,
        String.raw`Take the limit: $\dfrac{n+1}{2n} \to \tfrac12$.`,
        String.raw`Since $\tfrac12 < 1$, the ratio test gives convergence.`,
      ],
      why: String.raw`Form the ratio, simplify, take the limit, compare with $1$. (The sum is in fact $2$.) Note the test is about the **limit** of the ratio; individual ratios like $\frac{2}{2} = 1$ at $n = 1$ do not matter.`,
    },
    {
      kind: 'multi',
      prompt: 'Which series converge?',
      choices: [String.raw`$\sum 1/n^2$`, String.raw`$\sum 1/\sqrt n$`, String.raw`$\sum 2^n/n!$`, String.raw`$\sum (-1)^n$`, String.raw`$\sum 1/n^{1.01}$`],
      answers: [0, 2, 4],
      why: String.raw`p-series converge iff $p > 1$: yes for $p = 2$ and $p = 1.01$, no for $p = \tfrac12$. $2^n/n!$ has ratio $\to 0$. $(-1)^n$ fails the n-th term test.`,
    },
    {
      kind: 'explain',
      title: 'Absolute vs conditional convergence',
      body: String.raw`$\sum a_n$ converges **absolutely** if $\sum |a_n|$ converges. Absolute convergence implies convergence (by the Cauchy criterion).

**Alternating series test** (Leibniz). If $a_n$ decreases to $0$, then $\sum (-1)^{n+1} a_n$ converges, and the error after $N$ terms is at most $a_{N+1}$. So $1 - \tfrac12 + \tfrac13 - \cdots$ converges (to $\ln 2$) even though $\sum 1/n$ diverges: it converges **conditionally**.

Conditional convergence is fragile. **Riemann's rearrangement theorem:** the terms of a conditionally convergent series can be **reordered** to sum to any real number you like, or to diverge. Absolutely convergent series give the same sum in every order.`,
    },
    {
      kind: 'match',
      prompt: 'Match each series to its behaviour.',
      pairs: [
        [String.raw`$\sum 1/n$`, 'diverges, although its terms tend to 0'],
        [String.raw`$\sum 1/n^2$`, 'converges: p-series with p = 2'],
        [String.raw`$\sum (-1)^{n+1}/n$`, 'converges, but not absolutely'],
        [String.raw`$\sum (-1)^n$`, 'diverges: terms do not tend to 0'],
        [String.raw`$\sum 1/2^n$`, 'converges: geometric with ratio ½'],
      ],
      why: 'Harmonic: Oresme’s grouping. 1/n²: p > 1. Alternating harmonic: Leibniz test, but the absolute values form the harmonic series. (−1)ⁿ: n-th term test. 1/2ⁿ: geometric with |r| < 1.',
    },
    {
      kind: 'numeric',
      prompt: String.raw`Use $\frac{1}{n(n+1)} = \frac1n - \frac1{n+1}$ to compute $\displaystyle\sum_{n=1}^{\infty} \frac{1}{n(n+1)}$.`,
      answer: 1,
      why: String.raw`The partial sums **telescope**: $S_N = (1 - \tfrac12) + (\tfrac12 - \tfrac13) + \cdots + (\tfrac1N - \tfrac1{N+1}) = 1 - \tfrac{1}{N+1} \to 1$.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $\sum a_n = S$ means the partial sums $S_N \to S$.
- Geometric: $\sum_{n\ge0} r^n = \frac1{1-r}$ for $|r| < 1$. Telescoping sums collapse.
- n-th term test: convergence ⇒ $a_n \to 0$; the converse fails (harmonic series).
- Non-negative terms: comparison; $\sum 1/n^p$ converges iff $p > 1$.
- Ratio/root test: limit $< 1$ converges, $> 1$ diverges, $= 1$ tells nothing.
- Absolute convergence is robust; conditional convergence (alternating harmonic) depends on the order of the terms.

Next: [continuity](@math/continuity-epsilon-delta), the ε–δ cousin of ε–N.`,
    },
  ],
  references: [
    { authors: 'S. Abbott', title: 'Understanding Analysis', year: 2015, venue: '2nd ed., Springer (Undergraduate Texts in Mathematics)', detail: 'Ch. 2, §2.4 and §2.7 (infinite series, Cauchy condensation, properties of series, rearrangements)' },
    { authors: 'W. Rudin', title: 'Principles of Mathematical Analysis', year: 1976, venue: '3rd ed., McGraw-Hill', detail: 'Ch. 3 (series, comparison, root and ratio tests, absolute convergence, rearrangements)' },
    { authors: 'R. G. Bartle, D. R. Sherbert', title: 'Introduction to Real Analysis', year: 2011, venue: '4th ed., Wiley', detail: 'Ch. 3, §3.7 (introduction to infinite series); Ch. 9 (infinite series)' },
    { authors: 'M. Spivak', title: 'Calculus', year: 2008, venue: '4th ed., Publish or Perish', detail: 'Ch. 23 (Infinite series)' },
  ],
} satisfies LessonContent;
