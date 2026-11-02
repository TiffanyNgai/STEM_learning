import type { LessonContent } from '../../types';
import { R } from '../code';

const node = (x: number, y: number, t: string, w = 30) =>
  `<rect x="${x - w / 2}" y="${y - 9}" width="${w}" height="16" rx="4" fill="var(--surface)" stroke="var(--c2)"/><text x="${x}" y="${y + 3}" font-size="9" text-anchor="middle" fill="var(--fg)">${t}</text>`;
const edge = (x1: number, y1: number, x2: number, y2: number) =>
  `<line x1="${x1}" y1="${y1 + 7}" x2="${x2}" y2="${y2 - 9}" stroke="var(--muted)"/>`;
const leaves = Array.from({ length: 16 }, (_, i) => `<circle cx="${14 + i * 14.5}" cy="150" r="4" fill="var(--c1)"/>`).join('');
const fade = (d: number) => `<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${d};${d + 0.1};1" dur="6s" repeatCount="indefinite"/>`;
const TREE = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
<g>${node(125, 20, 'cn')}<text x="316" y="24" font-size="9" text-anchor="end" fill="var(--c3)">level 0: cn</text></g>
<g>${fade(0.15)}${edge(125, 20, 67, 62)}${edge(125, 20, 183, 62)}${node(67, 62, 'cn/2')}${node(183, 62, 'cn/2')}<text x="316" y="66" font-size="9" text-anchor="end" fill="var(--c3)">2·cn/2 = cn</text></g>
<g>${fade(0.3)}${[38, 96, 154, 212].map((x, i) => edge(i < 2 ? 67 : 183, 62, x, 104) + node(x, 104, 'cn/4')).join('')}<text x="316" y="108" font-size="9" text-anchor="end" fill="var(--c3)">4·cn/4 = cn</text></g>
<g>${fade(0.45)}<text x="125" y="130" font-size="10" text-anchor="middle" fill="var(--muted)">⋮</text>${leaves}<text x="316" y="153" font-size="9" text-anchor="end" fill="var(--c3)">n leaves: Θ(n)</text></g>
<g>${fade(0.6)}<text x="160" y="182" font-size="10" text-anchor="middle" fill="var(--fg)">log₂ n + 1 levels × cn per level</text><text x="160" y="196" font-size="10" font-weight="700" text-anchor="middle" fill="var(--c1)">T(n) = Θ(n log n)</text></g>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'When a function calls itself',
      body: R`Loops are easy to count. But how long does a **recursive** algorithm take? Its cost is defined in terms of the cost of smaller calls — a **recurrence**.

Merge sort splits a list of $n$ items into two halves, sorts each half recursively, then merges them in about $cn$ steps:
$$T(n) = 2\,T(n/2) + cn, \qquad T(1) = c.$$

Binary search does one comparison and recurses on half:
$$T(n) = T(n/2) + 1.$$

Our job: turn these into closed forms like $\Theta(n \log n)$.`,
    },
    {
      kind: 'explain',
      title: 'Unrolling',
      body: R`The simplest method: substitute the recurrence into itself until a pattern appears. For binary search, with $T(1) = 1$:
$$\begin{aligned}T(n) &= T(n/2) + 1 \\ &= T(n/4) + 2 \\ &= T(n/8) + 3 \\ &\;\;\vdots \\ &= T(n/2^k) + k.\end{aligned}$$
We hit $T(1)$ when $n/2^k = 1$, i.e. $k = \log_2 n$. So $T(n) = \log_2 n + 1 = \Theta(\log n)$.

(Assume $n$ is a power of 2 for clean arithmetic; floors and ceilings don't change the $\Theta$.)`,
    },
    {
      kind: 'numeric',
      prompt: R`With $T(n) = T(n/2) + 1$ and $T(1) = 1$, what is $T(1024)$?`,
      answer: 11,
      why: R`$1024 = 2^{10}$, so we halve 10 times to reach 1, adding 1 each time, plus $T(1) = 1$: $10 + 1 = 11$. Answering 10 forgets the base case.`,
    },
    {
      kind: 'widget',
      title: 'The recursion tree',
      body: R`Draw each call as a node labelled with the work it does *outside* its recursive calls. For $T(n) = 2T(n/2) + cn$, every level does $cn$ total work, and there are $\log_2 n + 1$ levels.`,
      widget: { type: 'SvgDiagram', props: { svg: TREE }, caption: R`Level $k$ has $2^k$ nodes, each costing $cn/2^k$ — the halving size exactly cancels the doubling count.` },
    },
    {
      kind: 'widget',
      title: 'Same idea, step by step',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            R`$T(n) = 2T(n/2) + cn$`,
            R`$= 2\big[2T(n/4) + cn/2\big] + cn = 4T(n/4) + 2cn$`,
            R`$= 8T(n/8) + 3cn$`,
            R`$= 2^k\,T(n/2^k) + k\,cn$`,
            R`Stop at $k = \log_2 n$: $\; T(n) = n\,T(1) + cn\log_2 n$`,
            R`$= cn + cn\log_2 n = \Theta(n\log n)$`,
          ],
          notes: ['', 'Substitute the recurrence for T(n/2).', 'Once more…', 'The pattern after k rounds.', 'n/2^k = 1 when k = log₂ n.', 'The n log n term dominates.'],
        },
      },
    },
    {
      kind: 'explain',
      title: 'The general shape',
      body: R`Most divide-and-conquer algorithms fit
$$T(n) = a\,T(n/b) + f(n)$$
- $a \ge 1$: number of subproblems,
- $b > 1$: factor by which the size shrinks,
- $f(n)$: work to split and combine at the top level.

The recursion tree has depth $\log_b n$ and $a^{\log_b n} = n^{\log_b a}$ **leaves**. Everything hinges on comparing the top-level work $f(n)$ with the leaf count $n^{\log_b a}$ — the "watershed" function.`,
    },
    {
      kind: 'explain',
      title: 'The master theorem',
      body: R`For $f(n) = \Theta(n^d)$ (a common special case), let $r = a / b^d$ be the ratio of work at level $k+1$ to level $k$:

1. **Leaves dominate** ($d < \log_b a$, i.e. $r > 1$): $T(n) = \Theta(n^{\log_b a})$.
2. **Balanced** ($d = \log_b a$, $r = 1$): $T(n) = \Theta(n^d \log n)$.
3. **Root dominates** ($d > \log_b a$, $r < 1$): $T(n) = \Theta(n^d)$.

Merge sort: $a = 2, b = 2, d = 1$; $\log_2 2 = 1 = d$ → case 2 → $\Theta(n\log n)$. ✓

(The full theorem in CLRS handles general $f(n)$ and needs a "regularity" condition in case 3.)`,
    },
    {
      kind: 'widget',
      title: 'A geometric series in disguise',
      body: R`Level $k$ costs $n^d \cdot r^k$. Slide $r$: below 1 the series shrinks (root level dominates), at 1 every level costs the same (multiply by the $\log n$ levels), above 1 it explodes toward the leaves.`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['r^x'], x: [0, 10], y: [0, 4], params: [{ name: 'r', min: 0.5, max: 1.5, value: 1, label: 'r = a/b^d' }], xLabel: 'level k', yLabel: 'cost / nᵈ' },
      },
    },
    {
      kind: 'match',
      prompt: 'Match each recurrence with its solution.',
      pairs: [
        [R`$T(n) = 2T(n/2) + n$`, R`$\Theta(n\log n)$`],
        [R`$T(n) = T(n/2) + 1$`, R`$\Theta(\log n)$`],
        [R`$T(n) = 2T(n/2) + 1$`, R`$\Theta(n)$`],
        [R`$T(n) = 3T(n/2) + n$`, R`$\Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})$`],
        [R`$T(n) = 2T(n/2) + n^2$`, R`$\Theta(n^2)$`],
      ],
      why: R`Compare $d$ with $\log_b a$: $(1,1)$ balanced; $(0,0)$ balanced → $\log n$; $(0,1)$ leaves → $n$; $(1, 1.585)$ leaves → $n^{1.585}$ (Karatsuba multiplication); $(2,1)$ root → $n^2$.`,
    },
    {
      kind: 'mcq',
      prompt: R`Strassen's matrix multiplication satisfies $T(n) = 7T(n/2) + \Theta(n^2)$. Its running time is:`,
      choices: [R`$\Theta(n^2)$`, R`$\Theta(n^2 \log n)$`, R`$\Theta(n^{\log_2 7}) \approx \Theta(n^{2.81})$`, R`$\Theta(n^3)$`],
      answer: 2,
      why: R`$\log_2 7 \approx 2.81 > d = 2$, so leaves dominate (case 1). This beats the schoolbook $\Theta(n^3)$, which corresponds to $8T(n/2) + n^2$.`,
    },
    {
      kind: 'fill',
      prompt: R`For $T(n) = 8T(n/2) + n^2$: $\log_b a = $ ___, which is bigger than $d$, so case ___ gives $T(n) = \Theta($___$)$.`,
      bank: ['3', '2', '1', 'n³', 'n² log n', 'n²'],
      answer: ['3', '1', 'n³'],
      why: R`$\log_2 8 = 3 > 2$, so the $n^3$ leaves dominate the $n^2$ top-level work (case 1: leaves). This is the recursive version of schoolbook matrix multiplication.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps for applying the master theorem.',
      steps: [
        R`Write the recurrence as $T(n) = aT(n/b) + f(n)$ and read off $a$, $b$, $f$.`,
        R`Compute the watershed exponent $\log_b a$.`,
        R`Compare $f(n)$ with $n^{\log_b a}$.`,
        'Pick the case: leaves dominate, balanced, or root dominates.',
        R`State $T(n)$ in $\Theta$ form.`,
      ],
      why: R`You need $a, b$ before you can compute $\log_b a$, and the comparison decides the case. Skipping the first step is the usual cause of mistakes — e.g. misreading $T(n-1)$ as $T(n/2)$.`,
    },
    {
      kind: 'truefalse',
      prompt: R`The master theorem directly solves $T(n) = T(n-1) + n$.`,
      answer: false,
      why: R`The subproblem is $n-1$, not $n/b$, so the theorem does not apply. Unrolling gives $n + (n-1) + \dots + 1 = n(n+1)/2 = \Theta(n^2)$ — quicksort's worst case.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: R`- Recursive costs are **recurrences**; solve by unrolling, recursion trees, or the master theorem.
- $T(n) = aT(n/b) + \Theta(n^d)$: compare $d$ with $\log_b a$ → leaves dominate $\Theta(n^{\log_b a})$, balanced $\Theta(n^d\log n)$, root dominates $\Theta(n^d)$.
- Merge sort $\Theta(n\log n)$, binary search $\Theta(\log n)$, Strassen $\Theta(n^{2.81})$.
- "Subtract-one" recurrences like $T(n-1)+n$ need unrolling: $\Theta(n^2)$.
- Put it to work in [divide & conquer](@cs/divide-and-conquer) and [merge sort & quicksort](@cs/merge-quick-sort).`,
    },
  ],
  references: [
    { authors: 'T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein', title: 'Introduction to Algorithms', year: 2022, venue: '4th ed., MIT Press', detail: 'Ch. 4 Divide-and-Conquer (§4.4 recursion trees, §4.5 master method)' },
    { authors: 'J. Kleinberg, É. Tardos', title: 'Algorithm Design', year: 2005, venue: 'Pearson', detail: '§5.1–5.2' },
    { authors: 'J. L. Bentley, D. Haken, J. B. Saxe', title: 'A general method for solving divide-and-conquer recurrences', year: 1980, venue: 'ACM SIGACT News 12(3), 36–44' },
  ],
} satisfies LessonContent;
