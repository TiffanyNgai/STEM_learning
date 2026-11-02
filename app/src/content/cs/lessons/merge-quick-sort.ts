import type { LessonContent } from '../../types';
import { R, code } from '../code';

const MERGE = `def merge(left, right):
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if right[j] < left[i]:
            out.append(right[j]); j += 1
        else:
            out.append(left[i]); i += 1
    return out + left[i:] + right[j:]

def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    return merge(merge_sort(a[:mid]), merge_sort(a[mid:]))`;

const PART = `def partition(a, lo, hi):
    pivot = a[hi]
    i = lo
    for j in range(lo, hi):
        if a[j] < pivot:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]
    return i

def quicksort(a, lo, hi):
    if lo < hi:
        p = partition(a, lo, hi)
        quicksort(a, lo, p - 1)
        quicksort(a, p + 1, hi)`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Breaking the n² barrier',
      body: R`Sorting a million items with an $n^2$ algorithm takes about $10^{12}$ steps — about 17 minutes at $10^9$ steps/s. An $n \log_2 n$ algorithm needs about $2 \times 10^7$ — **0.02 seconds**.

The trick is **divide and conquer**: split the problem into smaller copies of itself, solve them recursively, and combine the answers. Two famous ways to do this for sorting:

- **Merge sort**: split trivially, work hard to *combine*.
- **Quicksort**: work hard to *split*, combine trivially.`,
    },
    {
      kind: 'explain',
      title: 'Merging two sorted piles',
      body: R`Two face-up piles of cards, each sorted with the smallest on top. To combine them into one sorted pile, repeatedly take the **smaller of the two top cards**. Each comparison places one card, so merging $n$ cards in total takes at most $n - 1$ comparisons: $\Theta(n)$.

${code(MERGE)}

§merge_sort§ splits the list in half, sorts each half recursively, and merges. A list of length ≤ 1 is already sorted (the **base case**).`,
    },
    {
      kind: 'widget',
      title: 'Merge sort in action',
      body: 'The shaded band is the subarray currently being merged. Notice the small sorted runs that grow and combine. Compare the comparison count with insertion sort on the same data.',
      widget: { type: 'SortingVisualizer', props: { algorithm: 'merge', algorithms: ['merge', 'insertion'], n: 16, seed: 11, speed: 8 } },
    },
    {
      kind: 'explain',
      title: 'Why merge sort is n log n',
      body: R`Splitting is free and merging costs $\Theta(n)$, so
$$T(n) = 2\,T(n/2) + \Theta(n) = \Theta(n \log n)$$
by the [master theorem](@cs/recurrences-master-theorem): there are $\log_2 n$ levels of halving, and each level merges all $n$ items once.

Properties: $\Theta(n\log n)$ in **every** case, **stable** (on ties §merge§ takes from the left), but **not in place** — it needs $\Theta(n)$ extra memory for the merged output.`,
    },
    {
      kind: 'order',
      prompt: R`Order the steps merge sort performs on §[38, 27, 43, 3]§ (left half first).`,
      steps: [
        R`Split into §[38, 27]§ and §[43, 3]§`,
        R`Split §[38, 27]§ into §[38]§ and §[27]§`,
        R`Merge into §[27, 38]§`,
        R`Split §[43, 3]§ into §[43]§ and §[3]§`,
        R`Merge into §[3, 43]§`,
        R`Merge §[27, 38]§ and §[3, 43]§ into §[3, 27, 38, 43]§`,
      ],
      why: R`Recursion fully finishes the left half (split, then merge) before starting the right half; the final merge happens last, when both halves have returned.`,
    },
    {
      kind: 'numeric',
      prompt: 'What is the maximum number of comparisons needed to merge a sorted list of 4 items with a sorted list of 5 items?',
      answer: 8,
      why: R`Each comparison outputs one item, and once one list is exhausted the rest is copied with no comparisons. In the worst case the lists interleave until the very last item: $4 + 5 - 1 = 8$.`,
    },
    {
      kind: 'explain',
      title: 'Quicksort: partition around a pivot',
      body: R`To sort a class by height: pick one student (the **pivot**). Everyone shorter moves to their left, everyone taller to their right. The pivot is now in its **final position**! Recursively sort the left group and the right group — no combining needed.

${code(PART)}

The common Lomuto partition uses the last element as pivot; §a[lo..i-1]§ holds items smaller than the pivot.`,
    },
    {
      kind: 'widget',
      title: 'Quicksort in action',
      body: 'Purple is the pivot of the current subarray (shaded). After each partition, the pivot turns green: it never moves again.',
      widget: { type: 'SortingVisualizer', props: { algorithm: 'quick', algorithms: ['quick', 'merge'], n: 16, seed: 11, speed: 8 } },
    },
    {
      kind: 'mcq',
      prompt: R`Apply §partition§ to §a = [3, 8, 2, 5, 1, 4]§ (pivot = 4, the last element). What is §a§ afterwards?`,
      choices: [R`§[3, 2, 1, 4, 8, 5]§`, R`§[1, 2, 3, 4, 5, 8]§`, R`§[3, 2, 1, 4, 5, 8]§`, R`§[2, 3, 1, 4, 8, 5]§`],
      answer: 0,
      why: R`j=0: 3<4, swap a[0],a[0], i=1. j=1: 8 no. j=2: 2<4, swap a[1],a[2] → [3,2,8,5,1,4], i=2. j=3: 5 no. j=4: 1<4, swap a[2],a[4] → [3,2,1,5,8,4], i=3. Finally swap a[3],a[5] → [3,2,1,4,8,5]. Partition only *separates* the sides; it doesn't sort them.`,
    },
    {
      kind: 'explain',
      title: 'Quicksort: great on average, bad worst case',
      body: R`- **Good pivots** (near the median) split in half: $T(n) = 2T(n/2) + \Theta(n) = \Theta(n\log n)$.
- **Bad pivots** (always the min or max — e.g. already-sorted input with last-element pivot): $T(n) = T(n-1) + \Theta(n) = \Theta(n^2)$.
- **Random pivot**: for *every* input, the expected time is $\Theta(n\log n)$ (about $1.39\, n\log_2 n$ comparisons); $\Theta(n^2)$ is possible but astronomically unlikely.

Quicksort is in place (apart from the recursion stack) and very cache-friendly, so it is often the fastest in practice — but it is **not stable**.`,
    },
    {
      kind: 'match',
      prompt: 'Match each term with its role.',
      pairs: [
        ['merge', 'combine two sorted lists in linear time'],
        ['partition', 'split items around a pivot so smaller ones are on its left'],
        ['pivot', 'the element that lands in its final position after partitioning'],
        ['base case', 'a list of length 0 or 1, already sorted'],
      ],
      why: 'Merge sort does its real work in merge; quicksort does it in partition. Both stop recursing at the trivial base case.',
    },
    {
      kind: 'fill',
      prompt: R`Merge sort does its main work in the ___ step, while quicksort does its main work in the ___ step. Only ___ guarantees $\Theta(n\log n)$ in the worst case.`,
      bank: ['combine', 'divide', 'merge sort', 'quicksort', 'base case'],
      answer: ['combine', 'divide', 'merge sort'],
      why: R`Merge sort divides trivially (cut in half) and combines by merging; quicksort divides by partitioning and combines trivially. Quicksort's worst case is $\Theta(n^2)$.`,
    },
    {
      kind: 'truefalse',
      prompt: R`Quicksort with a uniformly random pivot can still take $\Theta(n^2)$ time on some runs.`,
      answer: true,
      why: R`Randomness makes the *expected* time $\Theta(n\log n)$ for every input, but an unlucky run that always picks extreme pivots is possible (with vanishingly small probability). Introsort guards against this by switching to heapsort if recursion gets too deep.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about real-world sorting libraries are true?',
      choices: [
        R`Python's §sorted§ uses Timsort, a stable hybrid of merge sort and insertion sort`,
        R`C++'s §std::sort§ typically uses introsort: quicksort + heapsort + insertion sort`,
        'Production libraries use plain bubble sort for small arrays because it is stable',
        'Hybrid sorts switch to insertion sort for small subarrays',
      ],
      answers: [0, 1, 3],
      why: R`Timsort exploits existing sorted runs and is stable; introsort combines quicksort's speed with heapsort's worst-case guarantee. Both use insertion sort on small pieces, where its low overhead beats the asymptotically faster methods.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: R`- **Merge sort**: split in half, sort recursively, merge in $\Theta(n)$. $\Theta(n\log n)$ always, stable, $\Theta(n)$ extra space.
- **Quicksort**: partition around a pivot, recurse on both sides. $\Theta(n\log n)$ expected with random pivots, $\Theta(n^2)$ worst case, in place, not stable.
- Both come from the **divide and conquer** pattern: $T(n) = 2T(n/2) + \Theta(n)$.
- Can any comparison sort beat $n\log n$? No — see [the sorting lower bound](@cs/sorting-lower-bound).`,
    },
  ],
  references: [
    { authors: 'T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein', title: 'Introduction to Algorithms', year: 2022, venue: '4th ed., MIT Press', detail: '§2.3 Merge sort; Ch. 7 Quicksort' },
    { authors: 'R. Sedgewick, K. Wayne', title: 'Algorithms', year: 2011, venue: '4th ed., Addison-Wesley', detail: '§2.2 Mergesort, §2.3 Quicksort', url: 'https://algs4.cs.princeton.edu/23quicksort/' },
    { authors: 'C. A. R. Hoare', title: 'Quicksort', year: 1962, venue: 'The Computer Journal 5(1), 10–16' },
    { authors: 'D. R. Musser', title: 'Introspective Sorting and Selection Algorithms', year: 1997, venue: 'Software: Practice and Experience 27(8), 983–993' },
  ],
} satisfies LessonContent;
