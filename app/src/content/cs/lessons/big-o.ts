import type { LessonContent } from '../../types';
import { R } from '../code';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The long race',
      body: R`Algorithm A takes $100n$ steps; algorithm B takes $n^2$. Which is faster?

For $n = 10$: A needs 1000, B needs 100 — B wins. For $n = 1000$: A needs $10^5$, B needs $10^6$ — A wins, and A stays ahead **forever** after $n = 100$.

Computer scientists care about the long race: inputs keep getting bigger (more users, more data). **Asymptotic analysis** asks how cost *grows* as $n \to \infty$, ignoring constant factors like the 100 that depend on hardware and implementation details.`,
    },
    {
      kind: 'widget',
      title: 'Constants only move the crossover',
      body: R`The first curve is $c\cdot n$, the second $n^2$. Make $c$ huge: the crossover point (at $n = c$) moves right, but the quadratic still wins the long race.`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['c*x', 'x^2'], x: [0, 200], y: [0, 20000], params: [{ name: 'c', min: 1, max: 150, value: 100, label: 'constant c' }], labels: ['c·n', 'n²'], xLabel: 'n', yLabel: 'steps' },
      },
    },
    {
      kind: 'recall',
      title: 'Running times are functions',
      points: [
        R`A function $f: A \to B$ assigns every input in $A$ exactly one output in $B$.`,
        R`A running time is a function $T: \mathbb{N} \to \mathbb{R}_{\ge 0}$ from input size $n$ to a step count.`,
        R`"$\exists$" means "there exists", "$\forall$" means "for all".`,
      ],
      link: 'math/sets-functions',
    },
    {
      kind: 'explain',
      title: 'Big-O: an upper bound',
      body: R`Think of $O$ as "$\le$, up to a constant factor, for large enough $n$".

**Definition.** $f(n) = O(g(n))$ if there are constants $c > 0$ and $n_0$ such that
$$0 \le f(n) \le c\, g(n) \quad \text{for all } n \ge n_0.$$

**Example.** $f(n) = 3n^2 + 10n + 5$. For $n \ge 1$ we have $10n \le 10n^2$ and $5 \le 5n^2$, so
$$f(n) \le 3n^2 + 10n^2 + 5n^2 = 18n^2.$$
With $c = 18$, $n_0 = 1$: $f(n) = O(n^2)$.

(The "$=$" is traditional shorthand for "belongs to the set of functions $O(g)$".)`,
    },
    {
      kind: 'mcq',
      prompt: 'Which statement is **true**?',
      choices: [R`$n^3 = O(n^2)$`, R`$n^2 = O(n^3)$`, R`$2^n = O(n^{100})$`, R`$n \log n = O(n)$`],
      answer: 1,
      why: R`$O$ is only an *upper* bound, so a slower-growing function is $O$ of a faster one: $n^2 \le 1\cdot n^3$ for $n \ge 1$. The others fail: no constant $c$ makes $n^3 \le c n^2$ for all large $n$, and exponentials beat every polynomial eventually.`,
    },
    {
      kind: 'explain',
      title: 'Ω and Θ: lower and tight bounds',
      body: R`- $f = O(g)$: $f$ grows **at most** like $g$ (like $\le$).
- $f = \Omega(g)$: $f$ grows **at least** like $g$ (like $\ge$): $f(n) \ge c\,g(n)$ for some $c > 0$ and all $n \ge n_0$.
- $f = \Theta(g)$: both — $f$ grows **exactly** like $g$ up to constants (like $=$):
$$c_1 g(n) \le f(n) \le c_2 g(n) \quad \text{for } n \ge n_0.$$

Example: $3n^2 + 10n + 5 = \Theta(n^2)$ (it is $\ge 3n^2$ and $\le 18n^2$). It is also $O(n^3)$, but that is a loose, less informative statement. People often *say* "Big-O" when they mean $\Theta$.`,
    },
    {
      kind: 'match',
      prompt: 'Match each notation with its analogy.',
      pairs: [
        [R`$f = O(g)$`, R`$f \lesssim g$ (upper bound)`],
        [R`$f = \Omega(g)$`, R`$f \gtrsim g$ (lower bound)`],
        [R`$f = \Theta(g)$`, R`$f \asymp g$ (same growth rate)`],
      ],
      why: R`All three ignore constant factors and small $n$. $\Theta$ is the conjunction of $O$ and $\Omega$.`,
    },
    {
      kind: 'explain',
      title: 'Rules of thumb (and the ladder)',
      body: R`1. **Drop constant factors**: $5n^2 = \Theta(n^2)$.
2. **Keep only the dominant term**: $n^2 + 1000n\log n = \Theta(n^2)$.
3. **Sequential steps add** → the bigger one wins; **nested steps multiply**.
4. **Log bases don't matter**: $\log_a n = \log_b n / \log_b a$, a constant factor. We just write $\log n$.

The complexity ladder, slowest growth first:
$$1 \ll \log n \ll \sqrt n \ll n \ll n\log n \ll n^2 \ll n^3 \ll 2^n \ll n!$$`,
    },
    {
      kind: 'widget',
      title: 'Feel the ladder',
      body: R`Slide $n$ toward a million (the slider is logarithmic) and read the table: time assumes $10^9$ simple steps per second. Toggle **log y** to see all curves at once.`,
      widget: { type: 'BigOChart', props: { n: 1000, nMax: 40 } },
    },
    {
      kind: 'order',
      prompt: 'Order these growth rates from slowest to fastest.',
      steps: [R`$1$`, R`$\log n$`, R`$\sqrt n$`, R`$n$`, R`$n \log n$`, R`$n^2$`, R`$2^n$`, R`$n!$`],
      why: R`Logs beat any power ($\log n \ll n^{0.01}$), polynomials beat exponentials, and $n! \approx (n/e)^n$ eventually beats $2^n$ because its factors keep growing.`,
    },
    {
      kind: 'truefalse',
      prompt: R`$\log_2 n$ and $\log_{10} n$ are both $\Theta(\log n)$.`,
      answer: true,
      why: R`$\log_2 n = \log_{10} n / \log_{10} 2 \approx 3.32\,\log_{10} n$ — they differ by a constant factor, which $\Theta$ ignores.`,
    },
    {
      kind: 'numeric',
      prompt: R`An algorithm performs exactly $n^2$ steps on a machine doing $10^9$ steps per second. How many **seconds** does it take for $n = 10^5$?`,
      answer: 10,
      unit: 's',
      why: R`$(10^5)^2 = 10^{10}$ steps $\div 10^9$ steps/s $= 10$ s. An $n\log_2 n$ algorithm would need about $1.7 \times 10^6$ steps — under 2 milliseconds.`,
    },
    {
      kind: 'multi',
      prompt: R`Which functions are $O(n \log n)$?`,
      choices: [R`$5n + 3$`, R`$n\log n + 100n$`, R`$n^{1.5}$`, R`$\log(n!)$`, R`$n^2 / \log n$`],
      answers: [0, 1, 3],
      why: R`$5n+3 \le n\log n$ eventually; $100n$ is dominated by $n\log n$; and $\log(n!) = \sum_{k\le n}\log k \le n\log n$. But $n^{1.5}/(n\log n) = \sqrt n/\log n \to \infty$, so $n^{1.5}$ is not $O(n\log n)$; neither is $n^2/\log n$.`,
    },
    {
      kind: 'truefalse',
      prompt: R`"Big-O" means "worst case", and "Big-Ω" means "best case".`,
      answer: false,
      why: R`A common confusion. $O$/$\Omega$/$\Theta$ bound *functions*; best/worst case pick *which* function. E.g. insertion sort's best case is $\Theta(n)$ and its worst case is $\Theta(n^2)$ — and you can give $O$, $\Omega$ or $\Theta$ bounds for either.`,
    },
    {
      kind: 'fill',
      prompt: R`Statement $f = O(g)$ gives an ___ bound, $f = \Omega(g)$ gives a ___ bound, and $f = \Theta(g)$ gives a ___ bound.`,
      bank: ['upper', 'lower', 'tight', 'average', 'amortized'],
      answer: ['upper', 'lower', 'tight'],
      why: R`$O$ caps growth from above, $\Omega$ from below, and $\Theta$ does both, pinning down the growth rate exactly (up to constants).`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: R`- Asymptotics compare **growth rates** for large $n$, ignoring constant factors.
- $O$ = upper bound ($\le$), $\Omega$ = lower bound ($\ge$), $\Theta$ = tight ($=$), all "up to constants, for $n \ge n_0$".
- Drop constants and lower-order terms; log bases don't matter.
- Ladder: $1 \ll \log n \ll \sqrt n \ll n \ll n\log n \ll n^2 \ll 2^n \ll n!$.
- Bounds and cases (best/worst) are independent ideas.
- Next: analysing recursive algorithms with [recurrences](@cs/recurrences-master-theorem).`,
    },
  ],
  references: [
    { authors: 'T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein', title: 'Introduction to Algorithms', year: 2022, venue: '4th ed., MIT Press', detail: 'Ch. 3 Characterizing Running Times' },
    { authors: 'J. Kleinberg, É. Tardos', title: 'Algorithm Design', year: 2005, venue: 'Pearson', detail: '§2.1–2.2' },
    { authors: 'D. E. Knuth', title: 'Big Omicron and big Omega and big Theta', year: 1976, venue: 'ACM SIGACT News 8(2), 18–24' },
  ],
} satisfies LessonContent;
