import type { LessonContent } from '../../types';
import { R } from '../code';

const q = (x: number, y: number, t: string) =>
  `<rect x="${x - 24}" y="${y - 9}" width="48" height="17" rx="8" fill="var(--surface)" stroke="var(--c2)"/><text x="${x}" y="${y + 3}" font-size="9" text-anchor="middle" fill="var(--fg)">${t}</text>`;
const leaf = (x: number, y: number, t: string) =>
  `<rect x="${x - 19}" y="${y - 9}" width="38" height="17" rx="3" fill="var(--c1)"/><text x="${x}" y="${y + 3}" font-size="9" font-weight="700" text-anchor="middle" fill="var(--surface)">${t}</text>`;
const e = (x1: number, y1: number, x2: number, y2: number, lab: string) =>
  `<line x1="${x1}" y1="${y1 + 8}" x2="${x2}" y2="${y2 - 9}" stroke="var(--muted)"/><text x="${(x1 + x2) / 2 + (x2 < x1 ? -8 : 8)}" y="${(y1 + y2) / 2 + 2}" font-size="8" text-anchor="middle" fill="var(--c3)">${lab}</text>`;
const DT = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
${e(160, 18, 80, 62, 'yes')}${e(160, 18, 240, 62, 'no')}
${e(80, 62, 40, 110, 'yes')}${e(80, 62, 120, 110, 'no')}${e(240, 62, 200, 110, 'yes')}${e(240, 62, 280, 110, 'no')}
${e(120, 110, 95, 158, 'yes')}${e(120, 110, 148, 158, 'no')}${e(280, 110, 255, 158, 'yes')}${e(280, 110, 300, 158, 'no')}
${q(160, 18, 'a ≤ b ?')}${q(80, 62, 'b ≤ c ?')}${q(240, 62, 'a ≤ c ?')}${q(120, 110, 'a ≤ c ?')}${q(280, 110, 'b ≤ c ?')}
${leaf(40, 110, 'a b c')}${leaf(200, 110, 'b a c')}${leaf(95, 158, 'a c b')}${leaf(148, 158, 'c a b')}${leaf(255, 158, 'b c a')}${leaf(300, 158, 'c b a')}
<text x="160" y="192" font-size="10" text-anchor="middle" fill="var(--fg)">3! = 6 leaves ⇒ some path needs ≥ ⌈log₂ 6⌉ = 3 comparisons</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Can we sort faster than n log n?',
      body: R`Merge sort and heapsort sort $n$ items in $\Theta(n\log n)$. Decades of clever people have tried to do better using comparisons alone, and failed — because it is **impossible**.

This lesson proves a **lower bound**: a statement about *every possible algorithm*, including ones nobody has invented yet. That is a very different (and more powerful) kind of claim than analysing one algorithm.`,
    },
    {
      kind: 'explain',
      title: 'The comparison model',
      body: R`A **comparison sort** learns about the input *only* by asking questions of the form "is $a_i \le a_j$?". Insertion, merge, quick, heap and selection sort are all comparison sorts: they never look inside the keys, so they work for any data with an ordering (numbers, strings, dates…).

Think of a game of "20 questions": the input is one of the $n!$ possible orderings of $n$ distinct items, and each yes/no comparison is a question. The algorithm must ask enough questions to know which ordering it is facing — otherwise it can't output the right permutation.`,
    },
    {
      kind: 'widget',
      title: 'Decision trees',
      body: R`Any comparison sort on a fixed $n$ can be drawn as a **decision tree**: each internal node is a comparison, each branch an answer, each leaf an output order. Running the algorithm = walking one root-to-leaf path. Here is insertion sort on three items $a, b, c$.`,
      widget: { type: 'SvgDiagram', props: { svg: DT }, caption: R`The worst-case number of comparisons is the **height** of the tree (the longest root-to-leaf path).` },
    },
    {
      kind: 'mcq',
      prompt: 'A correct decision tree for sorting 4 distinct items must have at least how many leaves?',
      choices: ['4', '8', '16', '24'],
      answer: 3,
      why: R`Each of the $4! = 24$ possible input orders needs a different output permutation, so each must reach a different leaf. Having only 16 leaves ($2^4$) would force two orders to share a leaf, and one of them would be sorted wrongly.`,
    },
    {
      kind: 'explain',
      title: 'The proof in three lines',
      body: R`1. The tree needs at least $n!$ leaves (one per input ordering).
2. A binary tree of height $h$ has at most $2^h$ leaves.
3. So $2^h \ge n!$, i.e. $h \ge \log_2(n!)$.

And $\log_2(n!) = \Theta(n\log n)$. Quick check: at least half of the factors $1, 2, \dots, n$ are $\ge n/2$, so $n! \ge (n/2)^{n/2}$, giving
$$\log_2(n!) \ge \tfrac{n}{2}\log_2\tfrac{n}{2} = \Omega(n\log n).$$

**Theorem.** Every comparison sort makes $\Omega(n\log n)$ comparisons in the worst case.`,
    },
    {
      kind: 'widget',
      title: 'log₂(n!) really is about n log₂ n',
      body: R`Using Stirling's approximation $\log_2 n! \approx n\log_2 n - n\log_2 e + \tfrac12\log_2(2\pi n)$. The curves stay within a constant *factor* of each other — the definition of $\Theta$.`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['x*log2(x)', 'x*log2(x) - 1.4427*x + 0.5*log2(2*PI*x)'], x: [1, 64], y: [0, 400], labels: ['n log₂ n', 'log₂ n!'], xLabel: 'n', yLabel: 'comparisons' },
      },
    },
    {
      kind: 'numeric',
      prompt: 'What is the minimum possible **worst-case** number of comparisons for any comparison sort on 5 distinct items?',
      answer: 7,
      why: R`$5! = 120$ and $2^6 = 64 < 120 \le 128 = 2^7$, so the height must be at least $\lceil\log_2 120\rceil = 7$. (A clever algorithm actually achieves 7 for $n = 5$; merge sort needs 8.)`,
    },
    {
      kind: 'truefalse',
      prompt: 'The lower bound shows that merge sort and heapsort are asymptotically optimal comparison sorts.',
      answer: true,
      why: R`They achieve $O(n\log n)$ in the worst case, matching the $\Omega(n\log n)$ bound, so no comparison sort can be asymptotically faster in the worst case. Constant factors can still differ.`,
    },
    {
      kind: 'mcq',
      prompt: 'Which statement does the lower bound **not** imply?',
      choices: [
        R`No comparison sort has worst case $o(n\log n)$`,
        R`Every comparison sort needs $\Omega(n\log n)$ comparisons on **every** input`,
        R`Merge sort's worst case cannot be improved by more than a constant factor using comparisons`,
        R`To beat $n\log n$ you must use information beyond comparisons`,
      ],
      answer: 1,
      why: R`The bound is about the **worst case** (the deepest leaf). Some inputs can be sorted faster: insertion sort uses only $n-1$ comparisons on already-sorted input. (Little-$o$ means "grows strictly slower than".)`,
    },
    {
      kind: 'explain',
      title: 'Escaping the bound: stop comparing',
      body: R`If keys are small integers in $\{0, 1, \dots, k-1\}$, we can use them as **array indices** — something a comparison sort never does.

**Counting sort**: count how many times each key occurs, turn counts into starting positions (prefix sums), then place each item. Time $\Theta(n + k)$, stable.

**Radix sort**: sort $d$-digit numbers one digit at a time (least significant first) with a stable counting sort: $\Theta(d(n + k))$.

Details in [counting & radix sort](@cs/linear-time-sorting).`,
    },
    {
      kind: 'widget',
      title: 'Counting sort, step by step',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            R`Input $[2, 0, 2, 1, 0]$, keys in $\{0, 1, 2\}$ ($k = 3$).`,
            R`Count occurrences: §count = [2, 1, 2]§ (two 0s, one 1, two 2s).`,
            R`Prefix sums give where each key's block *ends*: §[2, 3, 5]§.`,
            R`Place items scanning from the right (to keep it stable): output $[0, 0, 1, 2, 2]$.`,
            R`Work: one pass over the input ($n$) + one over the counts ($k$) = $\Theta(n + k)$. Zero comparisons between items!`,
          ],
        },
      },
    },
    {
      kind: 'multi',
      prompt: R`Which of these sorting algorithms are subject to the $\Omega(n\log n)$ worst-case lower bound?`,
      choices: ['Merge sort', 'Insertion sort', 'Quicksort', 'Counting sort', 'Radix sort'],
      answers: [0, 1, 2],
      why: R`The bound applies to all comparison sorts — including insertion sort, whose worst case $\Theta(n^2)$ is consistent with it. Counting and radix sort index arrays by key value, so the comparison model (and its bound) doesn't apply; they pay instead with assumptions about the keys.`,
    },
    {
      kind: 'fill',
      prompt: R`A decision tree for sorting $n$ items must have at least ___ leaves; a binary tree of height $h$ has at most ___ leaves; hence the height is at least ___.`,
      bank: ['n!', '2^h', 'log₂(n!)', 'n²', 'h²', 'n'],
      answer: ['n!', '2^h', 'log₂(n!)'],
      why: R`One leaf per possible ordering ($n!$), at most doubling per level ($2^h$), so $2^h \ge n!$ ⇒ $h \ge \log_2(n!) = \Theta(n\log n)$.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: R`- A **comparison sort** only learns about keys through "$a_i \le a_j$?" questions.
- Every such algorithm is a **decision tree** with $\ge n!$ leaves, so its height (worst-case comparisons) is $\ge \log_2 n! = \Omega(n\log n)$.
- Merge sort and heapsort are therefore **asymptotically optimal** comparison sorts.
- The bound is about the worst case, and only in the comparison model: counting/radix sort beat it by exploiting integer keys.`,
    },
  ],
  references: [
    { authors: 'T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein', title: 'Introduction to Algorithms', year: 2022, venue: '4th ed., MIT Press', detail: 'Ch. 8 Sorting in Linear Time (§8.1 lower bounds, §8.2–8.3 counting and radix sort)' },
    { authors: 'D. E. Knuth', title: 'The Art of Computer Programming, Vol. 3: Sorting and Searching', year: 1998, venue: '2nd ed., Addison-Wesley', detail: '§5.3.1 Minimum-comparison sorting' },
    { authors: 'R. Sedgewick, K. Wayne', title: 'Algorithms', year: 2011, venue: '4th ed., Addison-Wesley', detail: '§2.2 (complexity of sorting), §5.1 (string sorts)' },
  ],
} satisfies LessonContent;
