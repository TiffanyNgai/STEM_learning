import type { LessonContent } from '../../types';
import { R, code } from '../code';

const BS = `def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == target:
            return mid
        elif a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`;
const A = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Guess my number',
      body: R`I'm thinking of a number from 1 to 100. Each guess, I say "higher" or "lower". The smart strategy is to guess the **middle** of what's left: 50, then 25 or 75, … Each answer throws away half the possibilities, so you never need more than **7** guesses ($2^7 = 128 \ge 100$).

**Binary search** is that strategy applied to a **sorted** list: compare the target with the middle element and discard the half that can't contain it. You already do this when looking up a word in a paper dictionary.`,
    },
    {
      kind: 'widget',
      title: 'Try it',
      body: 'Press **Next** to probe. Grey cells have been ruled out. Move the target slider (including values not in the list) and compare probes with a linear scan.',
      widget: { type: 'BinarySearchViz', props: { n: 15, seed: 3 } },
    },
    {
      kind: 'explain',
      title: 'The algorithm',
      body: R`Keep two indices §lo§ and §hi§ bracketing the part of sorted array §a§ still in play.

${code(BS)}

**Invariant** (a fact true at the start of every loop iteration): *if §target§ is anywhere in §a§, it is in §a[lo..hi]§.* Each branch preserves it because the array is sorted — e.g. if §a[mid] < target§, everything at or left of §mid§ is also too small.`,
    },
    {
      kind: 'order',
      prompt: 'Put one iteration of binary search in order.',
      steps: [
        R`Check that §lo <= hi§ (otherwise the target is absent).`,
        R`Compute §mid = (lo + hi) // 2§.`,
        R`Compare §a[mid]§ with the target.`,
        R`If equal, return §mid§; if smaller, set §lo = mid + 1§; if larger, set §hi = mid - 1§.`,
      ],
      why: R`The loop guard comes first, then probe the middle, compare, and shrink the range. Note §mid + 1§ / §mid - 1§: §mid§ itself has been checked, so excluding it guarantees progress.`,
    },
    {
      kind: 'widget',
      title: 'Trace it line by line',
      body: R`Searching for 23 in §${JSON.stringify(A)}§.`,
      widget: {
        type: 'CodeTracer',
        props: {
          code: BS,
          trace: [
            { line: 2, vars: { target: 23, lo: 0, hi: 9 }, note: 'The whole array is in play.' },
            { line: 4, vars: { target: 23, lo: 0, hi: 9, mid: 4 }, note: 'a[4] = 16' },
            { line: 8, vars: { target: 23, lo: 5, hi: 9, mid: 4 }, note: '16 < 23, so discard indices 0–4.' },
            { line: 4, vars: { target: 23, lo: 5, hi: 9, mid: 7 }, note: 'a[7] = 56' },
            { line: 10, vars: { target: 23, lo: 5, hi: 6, mid: 7 }, note: '56 > 23, so discard indices 7–9.' },
            { line: 4, vars: { target: 23, lo: 5, hi: 6, mid: 5 }, note: 'a[5] = 23' },
            { line: 6, vars: { target: 23, lo: 5, hi: 6, mid: 5 }, out: '5', note: 'Found at index 5 after 3 probes (linear search: 6).' },
          ],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: R`Run §binary_search§ on §a = [1, 3, 5, 7, 9, 11, 13]§ with §target = 4§. Which indices are probed (as §mid§), in order?`,
      choices: [R`3, 1, 2`, R`3, 1, 0`, R`3, 2`, R`0, 1, 2`],
      answer: 0,
      why: R`lo=0, hi=6 → mid=3 (7 > 4) → hi=2. mid=1 (3 < 4) → lo=2. mid=2 (5 > 4) → hi=1. Now lo > hi: not found, after probing 3, 1, 2. (4 would be inserted at index lo = 2.)`,
    },
    {
      kind: 'explain',
      title: 'Why it is logarithmic',
      body: R`After each probe the candidate range at most halves: $n \to n/2 \to n/4 \to \dots$. After $k$ probes at most $n/2^k$ candidates remain, and the search must stop once that falls below 1. So the number of probes is at most
$$\lfloor \log_2 n \rfloor + 1 = \lceil \log_2 (n+1) \rceil.$$
In recurrence form, $T(n) = T(n/2) + O(1) = O(\log n)$.

For a billion sorted items: about **30** probes, versus up to a billion for a linear scan.`,
    },
    {
      kind: 'numeric',
      prompt: 'What is the maximum number of probes binary search makes on a sorted array of 1,000,000 elements?',
      answer: 20,
      why: R`$2^{19} = 524{,}288 < 10^6 + 1 \le 2^{20} = 1{,}048{,}576$, so $\lceil\log_2(10^6+1)\rceil = 20$.`,
    },
    {
      kind: 'explain',
      title: 'Famous pitfalls',
      body: R`Binary search is short but notoriously easy to get wrong:

- **Off-by-one**: writing §lo = mid§ instead of §mid + 1§ can loop forever when §lo == mid§.
- **Overflow**: in languages with fixed-width integers (C, Java), §(lo + hi) / 2§ overflows for huge arrays. Write §lo + (hi - lo) / 2§. This bug sat in Java's standard library for about nine years (reported by Joshua Bloch, 2006).
- **Preconditions**: the array must be **sorted**, and you need **random access** (jump to §a[mid]§ in one step).`,
    },
    {
      kind: 'truefalse',
      prompt: R`Binary search on a sorted **linked list** runs in $O(\log n)$ time.`,
      answer: false,
      why: R`It still makes only $O(\log n)$ *comparisons*, but reaching the middle of a linked list means walking node by node, costing $O(n)$ in total. Binary search needs constant-time indexing — arrays, not linked lists.`,
    },
    {
      kind: 'explain',
      title: 'Binary search on any yes/no question',
      body: R`The real power: binary search works whenever a yes/no **predicate** is *monotone* — false, false, …, false, true, true, … — and you want the first "true".

- First index with §a[i] >= x§ (Python's §bisect_left§).
- First bad commit in a history where everything after a bug is broken (§git bisect§).
- Smallest ship capacity that delivers all packages within $D$ days: "can capacity $C$ do it?" is monotone in $C$.
- $\sqrt{x}$ to 10 decimal places: is $m^2 \ge x$?`,
    },
    {
      kind: 'multi',
      prompt: 'Which problems can binary search solve efficiently?',
      choices: [
        'Find the first broken version among 1,000 builds, given that once broken, every later build is broken',
        'Find a given value in an unsorted array',
        R`Compute $\lfloor\sqrt{N}\rfloor$ for a huge integer $N$`,
        'Find the minimum truck capacity that ships all parcels (in order) within 5 days',
        'Find the maximum element of an unsorted array',
      ],
      answers: [0, 2, 3],
      why: R`Each correct option has a monotone yes/no test ("broken?", "$m^2 > N$?", "capacity enough?"). Unsorted data has no such structure: one probe tells you nothing about the other elements, so you need $\Theta(n)$.`,
    },
    {
      kind: 'mcq',
      prompt: R`You have an unsorted array of $n = 10^6$ numbers and must answer **one** membership query. What is fastest?`,
      choices: ['Sort it, then binary search', 'Just scan it linearly', 'Both are the same', 'Binary search directly on the unsorted array'],
      answer: 1,
      why: R`Sorting costs $\Theta(n\log n) \approx 2\times10^7$ steps — more than the $10^6$ of a single scan. Sorting pays off only when you'll answer many queries (roughly more than $\log n$ of them). Binary search on unsorted data gives wrong answers.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: R`- Binary search finds a target in a **sorted, random-access** array with $\lceil\log_2(n+1)\rceil$ probes: $O(\log n)$.
- Correctness rests on the invariant "if present, the target is in §a[lo..hi]§".
- Watch for off-by-one errors and §(lo+hi)§ overflow.
- Generalises to finding the first "yes" of any monotone predicate.
- Binary *search trees* bring the same idea to data that changes: [BSTs](@cs/trees-bst).`,
    },
  ],
  references: [
    { authors: 'D. E. Knuth', title: 'The Art of Computer Programming, Vol. 3: Sorting and Searching', year: 1998, venue: '2nd ed., Addison-Wesley', detail: '§6.2.1' },
    { authors: 'R. Sedgewick, K. Wayne', title: 'Algorithms', year: 2011, venue: '4th ed., Addison-Wesley', detail: '§1.1, §3.1 (binary search)', url: 'https://algs4.cs.princeton.edu/31elementary/' },
    { authors: 'J. Bentley', title: 'Programming Pearls', year: 1999, venue: '2nd ed., Addison-Wesley', detail: 'Column 4: Writing Correct Programs' },
    { authors: 'J. Bloch', title: 'Extra, Extra — Read All About It: Nearly All Binary Searches and Mergesorts are Broken', year: 2006, venue: 'Google Research Blog' },
  ],
} satisfies LessonContent;
