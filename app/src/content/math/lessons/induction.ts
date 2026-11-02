import type { LessonContent } from '../../types';

// 1 + 3 + 5 + 7 + 9 = 25: each odd number is an L-shaped "gnomon" wrapping the previous square.
const cols = ['var(--c2)', 'var(--c3)', 'var(--c1)', 'var(--c4)', 'var(--c6)'];
const S = 26, X0 = 24, Y0 = 34;
const oddSvg = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  ${Array.from({ length: 5 }, (_, k) => {
    const begin = (k / 6).toFixed(3), on = (k / 6 + 0.03).toFixed(3);
    const cells: string[] = [];
    for (let i = 0; i <= k; i++) for (let j = 0; j <= k; j++) if (Math.max(i, j) === k)
      cells.push(`<rect x="${X0 + j * S + 1}" y="${Y0 + (4 - i) * S + 1}" width="${S - 2}" height="${S - 2}" rx="3" fill="${cols[k]}"/>`);
    const sum = Array.from({ length: k + 1 }, (_, m) => 2 * m + 1).join(' + ');
    return `<g opacity="0"><animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${begin};${on};1" dur="7s" repeatCount="indefinite"/>${cells.join('')}` +
      `<text x="172" y="${Y0 + 14 + k * 26}" font-size="11" fill="${cols[k]}" font-weight="bold">${sum} = ${(k + 1) * (k + 1)}</text></g>`;
  }).join('')}
  <text x="24" y="20" font-size="11" fill="var(--fg)">Odd number 2k+1 = an L around a k×k square</text>
  <text x="172" y="${Y0 + 150}" font-size="10" fill="var(--muted)">k² + (2k+1) = (k+1)²</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Infinitely many dominoes',
      body: String.raw`How can a finite proof cover **every** natural number $1, 2, 3, \dots$? Picture an endless line of dominoes, one for each statement $P(1), P(2), P(3), \dots$ If

1. the **first** domino falls, and
2. **whenever** a domino falls, it knocks over the next one,

then every domino falls. Play with it: switch off the base case, or the inductive step, or open a gap in the chain.`,
      widget: { type: 'MathDominoes', props: { n: 10 } },
    },
    {
      kind: 'explain',
      title: 'The principle of induction',
      body: String.raw`**Principle of mathematical induction.** Let $P(n)$ be a statement about natural numbers $n \ge 1$. If

- **Base case:** $P(1)$ is true, and
- **Inductive step:** for every $k \ge 1$, $P(k) \Rightarrow P(k+1)$,

then $P(n)$ is true for **all** $n \ge 1$.

In the inductive step you *assume* $P(k)$ — the **inductive hypothesis** — and use it to prove $P(k+1)$. That is not circular: you are proving the *implication*, not $P(k)$ itself.

Why is it valid? If some $P(n)$ failed, there would be a **smallest** failing $n$. It isn't $1$ (base case), so $n - 1 \ge 1$ satisfies $P$, and the step gives $P(n)$ — contradiction. (Every non-empty set of natural numbers has a least element: the *well-ordering principle*.)`,
    },
    {
      kind: 'widget',
      title: 'Example: 1 + 2 + ⋯ + n',
      body: String.raw`**Theorem.** For all $n \ge 1$: $\;1 + 2 + \cdots + n = \dfrac{n(n+1)}{2}$.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Let $P(n)$ be the statement $1 + 2 + \cdots + n = \frac{n(n+1)}{2}$.`,
            String.raw`**Base case** $n = 1$: left side $= 1$, right side $= \frac{1\cdot 2}{2} = 1$. ✓`,
            String.raw`**Inductive step.** Let $k \ge 1$ and assume $P(k)$: $1 + \cdots + k = \frac{k(k+1)}{2}$.`,
            String.raw`Then $1 + \cdots + k + (k+1) = \frac{k(k+1)}{2} + (k+1) = \frac{k(k+1) + 2(k+1)}{2} = \frac{(k+1)(k+2)}{2}$.`,
            String.raw`That is exactly $P(k+1)$. By induction, $P(n)$ holds for all $n \ge 1$. ∎`,
          ],
          notes: [
            'Always write P(n) out explicitly first.',
            '',
            'The inductive hypothesis.',
            'Use the hypothesis on the first k terms, then simplify toward the target formula.',
            'Target: the formula with n replaced by k + 1.',
          ],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Use the formula to compute $1 + 2 + 3 + \cdots + 100$.`,
      answer: 5050,
      why: String.raw`$\frac{100 \cdot 101}{2} = 5050$. (A famous, possibly embellished, story has the young Gauss finding this by pairing $1+100$, $2+99$, … — fifty pairs of $101$.)`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Let $P(n)$ be "$n = n + 1$". If $P(k)$ were true, then adding 1 to both sides gives $k + 1 = k + 2$, i.e. $P(k+1)$. Therefore, by induction, $P(n)$ holds for all $n$.`,
      answer: false,
      why: String.raw`The inductive step really is valid — but the **base case** $1 = 2$ is false, so no domino ever falls. Both ingredients are needed; a perfect chain with no first push proves nothing.`,
    },
    {
      kind: 'explain',
      title: 'A picture behind an induction',
      body: String.raw`**Claim:** $1 + 3 + 5 + \cdots + (2n - 1) = n^2$, the sum of the first $n$ odd numbers.

The inductive step is the identity $k^2 + (2k + 1) = (k+1)^2$: adding the next odd number $2(k+1) - 1 = 2k + 1$ to a $k \times k$ square wraps an L-shape around it, giving a $(k+1)\times(k+1)$ square.`,
      widget: { type: 'SvgDiagram', props: { svg: oddSvg } },
    },
    {
      kind: 'order',
      prompt: String.raw`Arrange the induction proof that $1 + 3 + \cdots + (2n-1) = n^2$ for all $n \ge 1$.`,
      steps: [
        String.raw`Base case: for $n = 1$, the left side is $1$ and $1^2 = 1$.`,
        String.raw`Let $k \ge 1$ and assume $1 + 3 + \cdots + (2k-1) = k^2$.`,
        String.raw`Add the next odd number: $1 + \cdots + (2k-1) + (2k+1) = k^2 + 2k + 1$.`,
        String.raw`Factor: $k^2 + 2k + 1 = (k+1)^2$, which is the statement for $k+1$.`,
        String.raw`By induction, the formula holds for every $n \ge 1$. ∎`,
      ],
      why: 'Base case first, then state the inductive hypothesis, use it on the first k terms, and reshape the result into P(k+1). The concluding sentence invokes the principle.',
    },
    {
      kind: 'explain',
      title: 'Starting somewhere else',
      body: String.raw`The base case does not have to be $n = 1$. If $P(n_0)$ holds and $P(k) \Rightarrow P(k+1)$ for all $k \ge n_0$, then $P(n)$ holds for all $n \ge n_0$.

**Example:** $2^n > n^2$ for all $n \ge 5$.
- Base: $2^5 = 32 > 25 = 5^2$.
- Step: assume $2^k > k^2$ with $k \ge 5$. Then $2^{k+1} = 2\cdot 2^k > 2k^2$. And $2k^2 \ge (k+1)^2$ because $k^2 \ge 2k + 1$ when $k \ge 3$. So $2^{k+1} > (k+1)^2$. ∎

Note how the step **used** $k \ge 3$, and the base had to be $5$ because the inequality itself is false at $n = 2, 3, 4$ — choose the base carefully.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`What is the **smallest** $N$ such that $2^n > n^2$ holds for every integer $n \ge N$?`,
      answer: 5,
      why: String.raw`Check: $n=1$: $2 > 1$ ✓, but $n=2$: $4 > 4$ ✗, $n=3$: $8 > 9$ ✗, $n=4$: $16 > 16$ ✗, $n=5$: $32 > 25$ ✓, and induction takes over from there. $N = 1$ is wrong because the inequality fails at $n = 2, 3, 4$.`,
    },
    {
      kind: 'widget',
      title: 'Strong induction',
      body: String.raw`Sometimes $P(k+1)$ needs not just $P(k)$ but some earlier case. **Strong induction**: if $P(n_0)$ holds and, for every $k \ge n_0$, ($P(n_0)$ and … and $P(k)$) $\Rightarrow P(k+1)$, then $P(n)$ holds for all $n \ge n_0$. (It is equivalent to ordinary induction applied to "$P(n_0), \dots, P(n)$ all hold".)`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`**Theorem.** Every integer $n \ge 2$ is a product of primes (a prime itself counts as a product of one prime).`,
            String.raw`**Base:** $2$ is prime. ✓`,
            String.raw`**Step:** let $k \ge 2$ and assume every integer $m$ with $2 \le m \le k$ is a product of primes. Consider $k+1$.`,
            String.raw`If $k+1$ is prime, done. Otherwise $k + 1 = ab$ with $2 \le a, b \le k$.`,
            String.raw`By the (strong) hypothesis, $a$ and $b$ are products of primes; so is $ab = k+1$. ∎`,
          ],
          notes: ['This is the existence half of the Fundamental Theorem of Arithmetic.', '', '', 'a and b can be far below k — ordinary P(k) alone would not help.', ''],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`"**Claim:** all horses have the same colour. Induct on the size $n$ of a group of horses. Base: one horse is one colour. Step: given $k+1$ horses, remove horse A — the other $k$ share a colour; put A back and remove horse B — again $k$ share a colour; the groups overlap, so all $k+1$ match." Where does it break?`,
      choices: [
        'The base case is false.',
        String.raw`The step fails from $k = 1$ to $k + 1 = 2$: the two groups of one horse do not overlap.`,
        'Induction cannot be used for statements about horses.',
        String.raw`The step fails for every $k$, since horses can't be removed.`,
      ],
      answer: 1,
      why: String.raw`For $k + 1 = 2$ horses, removing A leaves $\{B\}$ and removing B leaves $\{A\}$ — no common horse links the colours. The step "$P(k) \Rightarrow P(k+1)$" must hold for **every** $k \ge 1$; one broken link (here between dominoes 1 and 2) ruins the chain.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`An induction proof has a ___ case and an inductive ___. In the latter we assume $P(k)$, called the inductive ___, and prove $P(k+1)$.`,
      bank: ['base', 'step', 'hypothesis', 'conclusion', 'final', 'contradiction'],
      answer: ['base', 'step', 'hypothesis'],
      why: 'The base case starts the chain; the inductive step links every domino to the next; the inductive hypothesis is the temporary assumption P(k) used inside the step.',
    },
    {
      kind: 'recall',
      title: 'Induction’s twin: recursion',
      points: [
        'A recursive function calls itself on a smaller input, with a base case that stops the calls.',
        'Proving a recursive algorithm correct is an induction on the input size: base case ↔ base case, recursive call ↔ inductive hypothesis.',
        'Strong induction matches recursions that jump down by more than one (e.g. halving in merge sort).',
      ],
      link: 'cs/recursion',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Induction** = base case $P(n_0)$ + inductive step $P(k) \Rightarrow P(k+1)$ for all $k \ge n_0$ ⇒ $P(n)$ for all $n \ge n_0$.
- Both parts are essential: a valid step with a false base proves nothing ($n = n+1$), and one broken step ruins it (the horses).
- Write $P(n)$ explicitly; in the step, aim at $P(k+1)$ and *use* the hypothesis.
- **Strong induction** may assume all of $P(n_0), \dots, P(k)$ — e.g. every $n \ge 2$ is a product of primes.
- It works because every non-empty set of naturals has a least element.

Next: the language of collections — [sets & functions](@math/sets-functions).`,
    },
  ],
  references: [
    { authors: 'D. J. Velleman', title: 'How to Prove It: A Structured Approach', year: 2019, venue: '3rd ed., Cambridge University Press', detail: 'Ch. 6 (Mathematical induction)' },
    { authors: 'R. Hammack', title: 'Book of Proof', year: 2018, venue: '3rd ed., self-published (free online)', detail: 'Ch. 10 (Mathematical induction)', url: 'https://richardhammack.github.io/BookOfProof/' },
    { authors: 'G. Pólya', title: 'Induction and Analogy in Mathematics (Mathematics and Plausible Reasoning, Vol. I)', year: 1954, venue: 'Princeton University Press' },
  ],
} satisfies LessonContent;
