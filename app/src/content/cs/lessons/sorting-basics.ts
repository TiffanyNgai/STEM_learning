import type { LessonContent } from '../../types';
import { R, code } from '../code';

const INS = `def insertion_sort(a):
    for i in range(1, len(a)):
        j = i
        while j > 0 and a[j] < a[j-1]:
            a[j], a[j-1] = a[j-1], a[j]
            j -= 1
    return a`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Why sorting matters',
      body: R`Sorting is the most studied problem in computer science, because sorted data makes everything else easy: [binary search](@cs/binary-search), finding duplicates (they become neighbours), medians, rankings, merging records.

**The problem.** Input: a sequence $a_0, a_1, \dots, a_{n-1}$ of items that can be compared. Output: the same items rearranged so that $a_0 \le a_1 \le \dots \le a_{n-1}$.

We start with three simple $\Theta(n^2)$ algorithms. They are slow for big inputs but teach every idea used by the fast ones.`,
    },
    {
      kind: 'widget',
      title: 'Three ways to sort',
      body: 'Orange bars are being compared, red ones just moved, green ones are in their final place. Pick an algorithm and press play; watch the comparison and swap counters.',
      widget: { type: 'SortingVisualizer', props: { algorithm: 'bubble', algorithms: ['bubble', 'selection', 'insertion'], n: 10, seed: 4 } },
    },
    {
      kind: 'explain',
      title: 'Bubble sort',
      body: R`Walk left to right, swapping any **adjacent** pair that is out of order. After one pass, the largest item has "bubbled" to the end. Repeat on the remaining $n-1$ items, then $n-2$, …

${code(`for i in range(n - 1):
    for j in range(n - 1 - i):
        if a[j+1] < a[j]:
            swap a[j], a[j+1]`)}

Comparisons: $(n-1) + (n-2) + \dots + 1 = \frac{n(n-1)}{2} = \Theta(n^2)$. If a pass makes no swaps, the list is sorted and we can stop early.`,
    },
    {
      kind: 'explain',
      title: 'Selection sort',
      body: R`Find the **minimum** of the unsorted part and swap it into the next position. Like picking the shortest person from a crowd to stand first in line, then the shortest of the rest, …

- Always $\frac{n(n-1)}{2}$ comparisons, even if the input is already sorted.
- But at most $n-1$ **swaps** — useful when writing to memory is expensive (e.g. flash storage).`,
    },
    {
      kind: 'numeric',
      prompt: 'How many comparisons does selection sort make on an array of 10 elements?',
      answer: 45,
      why: R`Finding the minimum of $k$ items takes $k-1$ comparisons, for $k = 10, 9, \dots, 2$: $9 + 8 + \dots + 1 = 45 = \frac{10\cdot 9}{2}$. This doesn't depend on the input order.`,
    },
    {
      kind: 'explain',
      title: 'Insertion sort',
      body: R`How most people sort a hand of cards: take the next card and slide it **left** past every larger card until it fits. The left part is always sorted.

${code(INS)}

- **Worst case** (reverse-sorted): item $i$ slides past all $i$ items before it → $\Theta(n^2)$.
- **Best case** (already sorted): each item is checked once and stays → $\Theta(n)$.
- In general, the number of swaps equals the number of **inversions**: pairs $(i, j)$ with $i < j$ but $a_i > a_j$.`,
    },
    {
      kind: 'widget',
      title: 'Trace insertion sort',
      body: R`Sorting §[3, 1, 2]§. Watch §j§ walk left and §a§ change.`,
      widget: {
        type: 'CodeTracer',
        props: {
          code: INS,
          trace: [
            { line: 2, vars: { a: [3, 1, 2], i: 1 }, note: 'Insert a[1] = 1 into the sorted prefix [3].' },
            { line: 3, vars: { a: [3, 1, 2], i: 1, j: 1 } },
            { line: 4, vars: { a: [3, 1, 2], i: 1, j: 1 }, note: 'a[1] = 1 < a[0] = 3 → keep sliding.' },
            { line: 5, vars: { a: [1, 3, 2], i: 1, j: 1 }, note: 'Swap.' },
            { line: 6, vars: { a: [1, 3, 2], i: 1, j: 0 } },
            { line: 4, vars: { a: [1, 3, 2], i: 1, j: 0 }, note: 'j = 0: reached the left end, stop.' },
            { line: 2, vars: { a: [1, 3, 2], i: 2, j: 0 }, note: 'Insert a[2] = 2 into the sorted prefix [1, 3].' },
            { line: 3, vars: { a: [1, 3, 2], i: 2, j: 2 } },
            { line: 4, vars: { a: [1, 3, 2], i: 2, j: 2 }, note: '2 < 3 → slide.' },
            { line: 5, vars: { a: [1, 2, 3], i: 2, j: 2 } },
            { line: 6, vars: { a: [1, 2, 3], i: 2, j: 1 } },
            { line: 4, vars: { a: [1, 2, 3], i: 2, j: 1 }, note: '2 < 1 is false → 2 has found its place.' },
            { line: 7, vars: { a: [1, 2, 3], i: 2, j: 1 }, out: '[1, 2, 3]', note: '2 swaps = the 2 inversions (3,1) and (3,2).' },
          ],
        },
      },
    },
    {
      kind: 'order',
      prompt: R`Insertion sort on §[4, 3, 1, 2]§: order the array states, from the input to the state after each pass of the outer loop.`,
      steps: [R`§[4, 3, 1, 2]§`, R`§[3, 4, 1, 2]§`, R`§[1, 3, 4, 2]§`, R`§[1, 2, 3, 4]§`],
      why: R`Pass $i$ inserts §a[i]§ into the sorted prefix: 3 goes before 4; 1 slides to the front; 2 slides past 4 and 3 but stops after 1. After pass $i$ the first $i+1$ items are sorted (but not necessarily in their final positions).`,
    },
    {
      kind: 'explain',
      title: 'Vocabulary: stable, in place, adaptive',
      body: R`- **Stable**: equal items keep their original relative order. Sort a class list by first name, then *stably* by surname, and people with the same surname stay alphabetical by first name.
- **In place**: uses only $O(1)$ extra memory beyond the array.
- **Adaptive**: runs faster on inputs that are already nearly sorted.

All three simple sorts are in place. Bubble and insertion sort are stable (they only swap *adjacent* out-of-order items); selection sort is not (its long-distance swap can jump an item past an equal one). Insertion sort is the most adaptive.`,
    },
    {
      kind: 'match',
      prompt: 'Match each algorithm with its distinctive fact.',
      pairs: [
        ['Bubble sort', R`after pass $k$, the $k$ largest items are in their final places`],
        ['Selection sort', R`at most $n-1$ swaps, but always $\frac{n(n-1)}{2}$ comparisons`],
        ['Insertion sort', R`$\Theta(n)$ time on already-sorted input`],
      ],
      why: R`Bubble sort pushes maxima to the right, selection sort pulls minima to the left with one swap each, and insertion sort does work proportional to $n$ + the number of inversions.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these sorts are **stable** in their standard implementations?',
      choices: ['Bubble sort', 'Selection sort', 'Insertion sort'],
      answers: [0, 2],
      why: R`Bubble and insertion only swap neighbours that are strictly out of order, so equal items never pass each other. Selection sort's swap can move an item far away: sorting §[2a, 2b, 1]§ swaps 2a with 1, giving §[1, 2b, 2a]§.`,
    },
    {
      kind: 'truefalse',
      prompt: 'The number of swaps insertion sort performs equals the number of inversions in the input.',
      answer: true,
      why: R`Each adjacent swap of an out-of-order pair removes exactly one inversion, and the algorithm stops when none remain. That is why it is $\Theta(n)$ on sorted input (0 inversions) and $\Theta(n^2)$ on reversed input ($\frac{n(n-1)}{2}$ inversions).`,
    },
    {
      kind: 'mcq',
      prompt: 'Your data is **nearly sorted** — only a handful of items are out of place. Try both in the widget. Which simple sort is the best choice?',
      choices: ['Selection sort', 'Insertion sort', 'Bubble sort without early exit', 'They are all equally fast'],
      answer: 1,
      widget: { type: 'SortingVisualizer', props: { algorithm: 'insertion', algorithms: ['insertion', 'selection'], n: 16, input: 'nearly', speed: 10 } },
      why: R`Insertion sort costs about $n$ + (number of inversions), so few inversions means near-linear time. Selection sort always does $\Theta(n^2)$ comparisons. That's why fast library sorts (Timsort, introsort) switch to insertion sort on small or nearly sorted pieces.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: R`- Bubble, selection and insertion sort are all $\Theta(n^2)$ in the worst case and sort **in place**.
- Insertion sort is **adaptive** ($\Theta(n + \text{inversions})$) and **stable** — the best simple sort in practice.
- Selection sort minimises swaps but is not stable.
- To beat $n^2$ we need a new idea: divide and conquer — [merge sort & quicksort](@cs/merge-quick-sort).`,
    },
  ],
  references: [
    { authors: 'T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein', title: 'Introduction to Algorithms', year: 2022, venue: '4th ed., MIT Press', detail: '§2.1 Insertion sort, Problem 2-2 (bubble sort)' },
    { authors: 'R. Sedgewick, K. Wayne', title: 'Algorithms', year: 2011, venue: '4th ed., Addison-Wesley', detail: '§2.1 Elementary Sorts', url: 'https://algs4.cs.princeton.edu/21elementary/' },
    { authors: 'D. E. Knuth', title: 'The Art of Computer Programming, Vol. 3: Sorting and Searching', year: 1998, venue: '2nd ed., Addison-Wesley', detail: '§5.2' },
  ],
} satisfies LessonContent;
