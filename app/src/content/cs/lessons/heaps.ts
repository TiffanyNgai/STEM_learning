import type { LessonContent } from '../../types';
import { R, code } from '../code';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Who goes next?',
      body: R`In a hospital emergency room, patients aren't treated first-come-first-served: the **most urgent** goes next, and new patients arrive all the time. A **priority queue** is a data structure for exactly this. It stores items with priorities and supports:

- §insert(x)§ — add an item,
- §peek()§ — look at the minimum (most urgent) item,
- §extract_min()§ — remove and return it.

Uses: scheduling jobs, simulations, [Dijkstra's shortest paths](@cs/shortest-paths), Huffman coding, merging sorted files…`,
    },
    {
      kind: 'explain',
      title: 'Naive versions are lopsided',
      body: R`- **Unsorted list**: insert is $O(1)$ (append), but extract-min must scan everything: $O(n)$.
- **Sorted list**: extract-min is $O(1)$, but insert must find the right spot and shift: $O(n)$.

With $n$ inserts and $n$ extracts, both cost $\Theta(n^2)$ overall. A **binary heap** balances the two: both operations in $O(\log n)$.`,
    },
    {
      kind: 'explain',
      title: 'The binary heap',
      body: R`A (min-)heap is a binary tree with two rules:

1. **Shape**: it is *complete* — every level is full except possibly the last, which fills from the left. So its height is $\lfloor\log_2 n\rfloor$.
2. **Heap order**: every parent is $\le$ its children. Hence the minimum is always at the root.

Because the shape is so regular, we store it in a plain array, level by level — no pointers! For the node at index $i$ (0-based):
$$\text{children: } 2i+1,\ 2i+2 \qquad \text{parent: } \lfloor (i-1)/2 \rfloor$$`,
    },
    {
      kind: 'widget',
      title: 'Tree and array, two views of one heap',
      body: 'Insert some random keys and extract the minimum a few times. Watch each element move in both the tree and the array simultaneously.',
      widget: { type: 'HeapViz', props: { initial: [3, 8, 5, 12, 9, 7, 10], kind: 'min', seed: 5 } },
    },
    {
      kind: 'numeric',
      prompt: 'In a 0-indexed array heap, what is the index of the parent of the node at index 9?',
      answer: 4,
      why: R`$\lfloor (9-1)/2 \rfloor = 4$. Check: node 4's children are $2\cdot4+1 = 9$ and $10$. ✓`,
    },
    {
      kind: 'explain',
      title: 'Insert: sift up',
      body: R`To keep the shape rule, a new item goes into the **next free slot** (the end of the array). That may break heap order, so we **sift up**: while the item is smaller than its parent, swap them.

${code(`def insert(h, x):
    h.append(x)
    i = len(h) - 1
    while i > 0 and h[i] < h[(i - 1) // 2]:
        p = (i - 1) // 2
        h[i], h[p] = h[p], h[i]
        i = p`)}

Each swap moves up one level, so at most $\lfloor\log_2 n\rfloor$ swaps: $O(\log n)$.`,
    },
    {
      kind: 'order',
      prompt: R`Insert 2 into the min-heap §[3, 8, 5, 12, 9, 7, 10]§. Order what happens.`,
      steps: [
        'Place 2 at index 7, as the left child of 12',
        '2 < 12: swap, 2 moves to index 3',
        '2 < 8: swap, 2 moves to index 1',
        '2 < 3: swap, 2 becomes the root',
      ],
      why: R`The parent chain of index 7 is $7 \to 3 \to 1 \to 0$, holding 12, 8, 3. Since 2 is smaller than all of them it rises to the root: final heap §[2, 3, 5, 8, 9, 7, 10, 12]§.`,
    },
    {
      kind: 'explain',
      title: 'Extract-min: sift down',
      body: R`The minimum is the root. Removing it leaves a hole, so:

1. Save the root (the answer).
2. Move the **last** element into the root (keeps the shape complete).
3. **Sift down**: while it is larger than one of its children, swap it with the **smaller** child.

Why the *smaller* child? It becomes the parent of the other child, so it must be the smaller one to keep heap order. Again at most one swap per level: $O(\log n)$.`,
    },
    {
      kind: 'mcq',
      prompt: R`Perform §extract_min§ on the min-heap §[1, 3, 2, 7, 4, 5]§. What is the resulting array?`,
      choices: [R`§[2, 3, 5, 7, 4]§`, R`§[3, 5, 2, 7, 4]§`, R`§[2, 3, 4, 5, 7]§`, R`§[5, 3, 2, 7, 4]§`],
      answer: 0,
      why: R`Remove 1; move the last item, 5, to the root: §[5, 3, 2, 7, 4]§. Its children are 3 and 2; the smaller is 2, so swap: §[2, 3, 5, 7, 4]§. Now 5 is at index 2 with no children — done. The heap isn't sorted, and that's fine.`,
    },
    {
      kind: 'truefalse',
      prompt: 'The array of a valid min-heap is always sorted in increasing order.',
      answer: false,
      why: R`Heap order only relates parents and children, not siblings or cousins. §[1, 3, 2]§ is a valid heap but not sorted. This weaker rule is exactly why heap operations are cheaper than maintaining a sorted list.`,
    },
    {
      kind: 'explain',
      title: 'Building a heap in linear time',
      body: R`Inserting $n$ items one at a time costs $O(n\log n)$. But we can heapify an arbitrary array **bottom-up**: sift down every non-leaf node, from the last one back to the root.

Why is this $O(n)$? Half the nodes are leaves (no work), a quarter sift at most 1 level, an eighth at most 2, …
$$\sum_{h \ge 0} \frac{n}{2^{h+1}}\cdot h = n \sum_{h\ge 0}\frac{h}{2^{h+1}} = n.$$
Most nodes are near the bottom, where sifting down is cheap.

**Heapsort** = build a *max*-heap, then repeatedly swap the root to the end and sift down: $O(n\log n)$, in place. See [heapsort](@cs/heapsort).`,
    },
    {
      kind: 'widget',
      title: 'Heapsort uses a max-heap',
      body: 'The same machinery with the order flipped: the maximum sits at the root. Extract repeatedly and you get items largest-first.',
      widget: { type: 'HeapViz', props: { initial: [4, 10, 3, 5, 1, 8, 6], kind: 'max', seed: 9 } },
    },
    {
      kind: 'match',
      prompt: R`Match each binary-heap operation with its cost (heap of $n$ items).`,
      pairs: [
        ['peek at the minimum', R`$O(1)$`],
        ['insert', R`$O(\log n)$ — sift up`],
        ['build a heap from an unsorted array', R`$O(n)$`],
        ['search for an arbitrary key', R`$O(n)$ — heap order doesn't help`],
      ],
      why: R`The root is the minimum; insert/extract walk one root-to-leaf path; bottom-up heapify is linear; and searching for an arbitrary key may require checking every node because siblings are unordered.`,
    },
    {
      kind: 'fill',
      prompt: R`In a 0-indexed array heap, the children of node $i$ are at indices ___ and ___, and its parent is at ___.`,
      bank: ['2i+1', '2i+2', '(i−1)//2', 'i//2', '2i', 'i+1'],
      answer: ['2i+1', '2i+2', '(i−1)//2'],
      why: R`Level-by-level storage puts the root at 0, its children at 1 and 2, theirs at 3–6, … (With 1-based indexing the formulas become $2i$, $2i+1$ and $\lfloor i/2\rfloor$ — a common source of confusion.)`,
    },
    {
      kind: 'multi',
      prompt: 'Which tasks are a natural fit for a heap / priority queue?',
      choices: [
        R`Keep the 10 largest values seen in a stream of $10^9$ numbers`,
        'Always process the closest unvisited city next (Dijkstra)',
        'Breadth-first search of a graph',
        'Merge 100 sorted files into one sorted file',
        'Look up a phone number by name',
      ],
      answers: [0, 1, 3],
      why: R`Top-$k$ (a size-$k$ min-heap), Dijkstra and $k$-way merging all repeatedly need "the smallest/largest remaining item". BFS uses a plain FIFO queue, and lookup by key is a job for a [hash table](@cs/hashing).`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: R`- A **priority queue** supports insert and extract-min; a **binary heap** does both in $O(\log n)$.
- Heap = **complete** binary tree + **heap order** (parent ≤ children), stored in an array with children at $2i+1, 2i+2$.
- Insert → append + **sift up**; extract → move last to root + **sift down** (swap with the smaller child).
- Bottom-up heapify is $O(n)$; heapsort is $O(n\log n)$ in place.`,
    },
  ],
  references: [
    { authors: 'T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein', title: 'Introduction to Algorithms', year: 2022, venue: '4th ed., MIT Press', detail: 'Ch. 6 Heapsort (§6.5 priority queues)' },
    { authors: 'R. Sedgewick, K. Wayne', title: 'Algorithms', year: 2011, venue: '4th ed., Addison-Wesley', detail: '§2.4 Priority Queues', url: 'https://algs4.cs.princeton.edu/24pq/' },
    { authors: 'J. W. J. Williams', title: 'Algorithm 232: Heapsort', year: 1964, venue: 'Communications of the ACM 7(6), 347–348' },
    { authors: 'R. W. Floyd', title: 'Algorithm 245: Treesort 3', year: 1964, venue: 'Communications of the ACM 7(12), 701' },
  ],
} satisfies LessonContent;
