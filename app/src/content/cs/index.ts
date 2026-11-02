import type { Reference, Subject } from '../types';

const CLRS = (detail: string): Reference => ({
  authors: 'T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein',
  title: 'Introduction to Algorithms', year: 2022, venue: '4th ed., MIT Press', detail,
});
const SW = (detail: string): Reference => ({
  authors: 'R. Sedgewick, K. Wayne', title: 'Algorithms', year: 2011, venue: '4th ed., Addison-Wesley', detail,
  url: 'https://algs4.cs.princeton.edu/',
});
const KT = (detail: string): Reference => ({
  authors: 'J. Kleinberg, É. Tardos', title: 'Algorithm Design', year: 2005, venue: 'Pearson / Addison-Wesley', detail,
});
const SKIENA = (detail: string): Reference => ({
  authors: 'S. S. Skiena', title: 'The Algorithm Design Manual', year: 2020, venue: '3rd ed., Springer', detail,
});
const SIPSER = (detail: string): Reference => ({
  authors: 'M. Sipser', title: 'Introduction to the Theory of Computation', year: 2012, venue: '3rd ed., Cengage', detail,
});
const SICP = (detail: string): Reference => ({
  authors: 'H. Abelson, G. J. Sussman', title: 'Structure and Interpretation of Computer Programs', year: 1996, venue: '2nd ed., MIT Press', detail,
  url: 'https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/index.html',
});
const PH = (detail: string): Reference => ({
  authors: 'D. A. Patterson, J. L. Hennessy', title: 'Computer Organization and Design: The Hardware/Software Interface',
  year: 2020, venue: 'RISC-V ed., 2nd ed., Morgan Kaufmann', detail,
});
const OSTEP = (detail: string): Reference => ({
  authors: 'R. H. Arpaci-Dusseau, A. C. Arpaci-Dusseau', title: 'Operating Systems: Three Easy Pieces', year: 2018,
  venue: 'Arpaci-Dusseau Books (free online)', detail, url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
});
const N2T: Reference = {
  authors: 'N. Nisan, S. Schocken', title: 'The Elements of Computing Systems: Building a Modern Computer from First Principles',
  year: 2021, venue: '2nd ed., MIT Press', url: 'https://www.nand2tetris.org/',
};

export default {
  id: 'cs',
  name: 'Computer Science',
  emoji: '💻',
  color: '#00cd9c',
  tagline: 'From bits and logic gates to algorithms, theory and systems.',
  description: String.raw`A complete computer-science degree path for people who have **never programmed**. You start with how a machine represents information as bits and executes instructions, learn to write and reason about programs (in pseudocode and Python), and then spend most of your time on the heart of the subject: **algorithms and data structures** — how to measure efficiency, organise data, sort, search, and solve problems on graphs and strings with divide-and-conquer, greedy and dynamic-programming ideas.

Later units cover the theory of computation (what can be computed at all, and what can be computed *efficiently* — P vs NP) and the systems that run the world: architecture, operating systems, networks, databases, compilers, distributed systems, security and parallel computing. By the end you can analyse an algorithm's running time, choose the right data structure, and read a CLRS-level textbook comfortably.`,
  units: [
    {
      id: 'machine',
      title: 'How computers work',
      summary: 'Bits, binary numbers, logic gates, and the CPU–memory machine that runs every program.',
      lessons: [
        { id: 'how-computers-work', title: 'What is a computer?', summary: 'Inputs, outputs, memory and a processor following instructions — the stored-program idea.' },
        { id: 'binary-numbers', title: 'Bits & binary', summary: 'Counting in base 2, hexadecimal, and why everything is 0s and 1s.', prereqs: ['cs/how-computers-work'] },
        { id: 'data-representation', title: 'Representing data', summary: "Two's-complement integers, floating point, characters/Unicode, images as numbers.", prereqs: ['cs/binary-numbers'] },
        { id: 'logic-gates', title: 'Logic gates & Boolean algebra', summary: 'AND, OR, NOT, NAND; truth tables; building an adder from gates.', prereqs: ['cs/binary-numbers'] },
        { id: 'sequential-circuits', title: 'Memory from feedback', summary: 'Latches, flip-flops, registers and the clock.', prereqs: ['cs/logic-gates'] },
        { id: 'cpu-memory-basics', title: 'The CPU & the fetch–execute cycle', summary: 'Registers, ALU, RAM, instructions and the von Neumann architecture.', prereqs: ['cs/sequential-circuits'] },
      ],
      references: [N2T, PH('Ch. 1–2, App. A'), { authors: 'C. Petzold', title: 'Code: The Hidden Language of Computer Hardware and Software', year: 2022, venue: '2nd ed., Microsoft Press' }],
    },
    {
      id: 'programming',
      title: 'Programming fundamentals',
      summary: 'Variables, control flow, functions and collections — in pseudocode and Python.',
      lessons: [
        { id: 'programming-basics', title: 'Variables, values & expressions', summary: 'What a program is, assignment, types, and evaluating expressions step by step.', prereqs: ['cs/how-computers-work'] },
        { id: 'control-flow', title: 'Conditionals & loops', summary: 'if/else, while and for loops; tracing code by hand.', prereqs: ['cs/programming-basics'] },
        { id: 'functions', title: 'Functions & scope', summary: 'Parameters, return values, local variables and the call stack.', prereqs: ['cs/control-flow'] },
        { id: 'collections', title: 'Lists, strings & dictionaries', summary: 'Indexing, slicing, iteration, mutability and references.', prereqs: ['cs/functions'] },
        { id: 'objects-types', title: 'Types, objects & abstraction', summary: 'Classes, interfaces and abstract data types — separating "what" from "how".', prereqs: ['cs/collections'] },
        { id: 'testing-debugging', title: 'Testing, debugging & version control', summary: 'Unit tests, assertions, reading error messages, git basics.', prereqs: ['cs/functions'] },
      ],
      references: [
        SICP('Ch. 1–2'),
        { authors: 'A. B. Downey', title: 'Think Python', year: 2024, venue: '3rd ed., O’Reilly (free online)', url: 'https://allendowney.github.io/ThinkPython/' },
        { authors: 'MIT OpenCourseWare', title: '6.100L Introduction to CS and Programming Using Python', year: 2022, url: 'https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/' },
      ],
    },
    {
      id: 'recursion-unit',
      title: 'Recursion & correctness',
      summary: 'Functions that call themselves, the call stack, and proving programs correct.',
      lessons: [
        { id: 'recursion', title: 'Recursion', summary: 'Base case + recursive case; factorial, Fibonacci, and trusting the recursion.', prereqs: ['cs/functions'] },
        { id: 'call-stack-recursion', title: 'The call stack, unrolled', summary: 'How recursive calls are stored, stack overflow, and tail calls.', prereqs: ['cs/recursion'] },
        { id: 'recursive-structures', title: 'Recursive data', summary: 'Lists and trees defined recursively; recursion that mirrors the data.', prereqs: ['cs/recursion'] },
        { id: 'loop-invariants', title: 'Loop invariants & induction', summary: 'Proving an algorithm correct with invariants and mathematical induction.', prereqs: ['cs/recursion', 'math/proofs-intro'] },
      ],
      references: [SICP('§1.2'), CLRS('Ch. 2.1 (loop invariants)'), { authors: 'E. Lehman, F. T. Leighton, A. R. Meyer', title: 'Mathematics for Computer Science', year: 2017, venue: 'MIT (free online)', detail: 'Ch. 5 (Induction)', url: 'https://courses.csail.mit.edu/6.042/spring18/mcs.pdf' }],
    },
    {
      id: 'complexity',
      title: 'Measuring efficiency',
      summary: 'Counting steps, Big-O/Θ/Ω, recurrences, the master theorem and amortized cost.',
      lessons: [
        { id: 'counting-steps', title: 'Counting steps', summary: 'Why we count operations instead of seconds; cost of loops and nested loops.', prereqs: ['cs/control-flow'] },
        { id: 'big-o', title: 'Big-O, Θ and Ω', summary: 'Asymptotic notation: ignoring constants, comparing growth rates, the complexity ladder.', prereqs: ['cs/counting-steps', 'math/sets-functions'] },
        { id: 'recurrences-master-theorem', title: 'Recurrences & the master theorem', summary: 'Running times of recursive algorithms via recursion trees and the master theorem.', prereqs: ['cs/big-o', 'cs/recursion'] },
        { id: 'amortized-analysis', title: 'Amortized analysis', summary: 'Aggregate, accounting and potential methods; why appending to a dynamic array is O(1) on average.', prereqs: ['cs/big-o'] },
        { id: 'average-case-analysis', title: 'Average-case & expected running time', summary: 'Expected cost over random inputs or random choices; indicator random variables.', prereqs: ['cs/big-o', 'stats/probability-basics'] },
      ],
      references: [CLRS('Ch. 2–4, 16'), SW('§1.4'), SKIENA('Ch. 2'), KT('Ch. 2')],
    },
    {
      id: 'linear-structures',
      title: 'Arrays, lists, stacks & queues',
      summary: 'The fundamental sequential containers and their costs.',
      lessons: [
        { id: 'arrays-linked-lists', title: 'Arrays vs linked lists', summary: 'Contiguous memory vs pointers: O(1) indexing vs O(1) splicing.', prereqs: ['cs/big-o'] },
        { id: 'dynamic-arrays', title: 'Dynamic arrays', summary: 'Python lists / C++ vectors: doubling, capacity and amortized O(1) append.', prereqs: ['cs/arrays-linked-lists', 'cs/amortized-analysis'] },
        { id: 'stacks-queues', title: 'Stacks & queues', summary: 'LIFO and FIFO; implementations; bracket matching and undo.', prereqs: ['cs/arrays-linked-lists'] },
        { id: 'deques-circular-buffers', title: 'Deques & circular buffers', summary: 'Double-ended queues, ring buffers and the sliding-window maximum.', prereqs: ['cs/stacks-queues'] },
      ],
      references: [CLRS('Ch. 10'), SW('§1.3'), SKIENA('Ch. 3')],
    },
    {
      id: 'sorting-searching',
      title: 'Sorting & searching',
      summary: 'From insertion sort to quicksort, the n log n barrier, and binary search.',
      lessons: [
        { id: 'binary-search', title: 'Binary search', summary: 'Halving the search space: O(log n) lookup and the invariant that makes it correct.', prereqs: ['cs/big-o'] },
        { id: 'sorting-basics', title: 'Simple sorts', summary: 'Bubble, selection and insertion sort; stability, in-place, best/worst case.', prereqs: ['cs/big-o'] },
        { id: 'merge-quick-sort', title: 'Merge sort & quicksort', summary: 'Divide-and-conquer sorting in O(n log n); partitioning and pivots.', prereqs: ['cs/sorting-basics', 'cs/recursion'] },
        { id: 'sorting-lower-bound', title: 'The Ω(n log n) lower bound', summary: 'Decision trees: why no comparison sort beats n log n.', prereqs: ['cs/merge-quick-sort'] },
        { id: 'linear-time-sorting', title: 'Counting & radix sort', summary: 'Beating n log n by not comparing.', prereqs: ['cs/sorting-lower-bound'] },
        { id: 'selection-quickselect', title: 'Selection & quickselect', summary: 'Finding the median in linear expected (and worst-case) time.', prereqs: ['cs/merge-quick-sort'] },
      ],
      references: [CLRS('Ch. 2, 7–9'), SW('Ch. 2'), SKIENA('Ch. 4'), { authors: 'D. E. Knuth', title: 'The Art of Computer Programming, Vol. 3: Sorting and Searching', year: 1998, venue: '2nd ed., Addison-Wesley', detail: 'Ch. 5' }],
    },
    {
      id: 'hashing-unit',
      title: 'Hashing',
      summary: 'Near-instant lookup by computing where things live.',
      lessons: [
        { id: 'hashing', title: 'Hash functions & hash tables', summary: 'Turning keys into array indices; dictionaries and sets in O(1) expected time.', prereqs: ['cs/arrays-linked-lists'] },
        { id: 'collision-resolution', title: 'Collisions: chaining & open addressing', summary: 'Separate chaining, linear probing, load factor and resizing.', prereqs: ['cs/hashing'] },
        { id: 'universal-hashing', title: 'Universal & perfect hashing', summary: 'Random hash families with provable guarantees.', prereqs: ['cs/collision-resolution', 'stats/probability-basics'] },
        { id: 'bloom-filters-sketches', title: 'Bloom filters & sketches', summary: 'Approximate membership and counting in tiny memory.', prereqs: ['cs/universal-hashing'] },
      ],
      references: [CLRS('Ch. 11'), SW('§3.4'), { authors: 'M. Mitzenmacher, E. Upfal', title: 'Probability and Computing', year: 2017, venue: '2nd ed., Cambridge University Press', detail: 'Ch. 5, 15' }],
    },
    {
      id: 'trees',
      title: 'Trees & search trees',
      summary: 'Hierarchical data, binary search trees, and keeping them balanced.',
      lessons: [
        { id: 'tree-basics', title: 'Trees & traversals', summary: 'Roots, children, height; pre-, in-, post- and level-order traversal.', prereqs: ['cs/recursive-structures'] },
        { id: 'trees-bst', title: 'Binary search trees', summary: 'Search, insert, delete in O(height); in-order traversal gives sorted order.', prereqs: ['cs/tree-basics', 'cs/binary-search'] },
        { id: 'balanced-trees', title: 'Balanced trees: AVL', summary: 'Why height matters; rotations keep height O(log n).', prereqs: ['cs/trees-bst'] },
        { id: 'red-black-trees', title: 'Red-black trees', summary: 'Colour rules, insert fix-up, and the link to 2-3-4 trees.', prereqs: ['cs/balanced-trees'] },
        { id: 'b-trees', title: 'B-trees', summary: 'Wide, shallow trees for disks and databases.', prereqs: ['cs/balanced-trees'] },
        { id: 'augmented-trees', title: 'Augmented trees', summary: 'Order statistics and interval trees by storing extra data at nodes.', prereqs: ['cs/red-black-trees'] },
      ],
      references: [CLRS('Ch. 12–14, 17–18'), SW('§3.2–3.3'), { authors: 'D. E. Knuth', title: 'The Art of Computer Programming, Vol. 3: Sorting and Searching', year: 1998, venue: '2nd ed., Addison-Wesley', detail: '§6.2' }],
    },
    {
      id: 'special-structures',
      title: 'Heaps, tries & union-find',
      summary: 'Specialised structures that make classic algorithms fast.',
      lessons: [
        { id: 'heaps', title: 'Heaps & priority queues', summary: 'A tree stored in an array that always knows its minimum.', prereqs: ['cs/tree-basics', 'cs/big-o'] },
        { id: 'heapsort', title: 'Heapsort', summary: 'Sorting in place in O(n log n) worst case with a heap.', prereqs: ['cs/heaps', 'cs/sorting-basics'] },
        { id: 'priority-queue-applications', title: 'Priority queues in action', summary: 'Top-k, merging sorted streams, event simulation; decrease-key.', prereqs: ['cs/heaps'] },
        { id: 'tries', title: 'Tries', summary: 'Prefix trees for autocomplete and dictionaries of strings.', prereqs: ['cs/tree-basics'] },
        { id: 'union-find', title: 'Union-find (disjoint sets)', summary: 'Union by rank + path compression: near-constant-time connectivity.', prereqs: ['cs/tree-basics', 'cs/amortized-analysis'] },
        { id: 'segment-fenwick-trees', title: 'Segment & Fenwick trees', summary: 'Range queries and point updates in O(log n).', prereqs: ['cs/tree-basics'] },
      ],
      references: [CLRS('Ch. 6, 19'), SW('§2.4, §1.5, §5.2'), SKIENA('Ch. 3, 4.3')],
    },
    {
      id: 'dc-greedy',
      title: 'Divide & conquer and greedy',
      summary: 'Two fundamental design paradigms and how to prove them right.',
      lessons: [
        { id: 'divide-and-conquer', title: 'Divide & conquer', summary: 'Split, solve recursively, combine — counting inversions and maximum subarray.', prereqs: ['cs/merge-quick-sort', 'cs/recurrences-master-theorem'] },
        { id: 'fast-multiplication', title: 'Karatsuba & Strassen', summary: 'Multiplying numbers and matrices faster than the schoolbook way.', prereqs: ['cs/divide-and-conquer'] },
        { id: 'closest-pair', title: 'Closest pair of points', summary: 'A geometric divide-and-conquer in O(n log n).', prereqs: ['cs/divide-and-conquer'] },
        { id: 'greedy-algorithms', title: 'Greedy algorithms', summary: 'Making the locally best choice; interval scheduling and exchange arguments.', prereqs: ['cs/sorting-basics'] },
        { id: 'huffman-coding', title: 'Huffman coding', summary: 'Optimal prefix codes built greedily with a priority queue.', prereqs: ['cs/greedy-algorithms', 'cs/heaps'] },
      ],
      references: [CLRS('Ch. 4, 15'), KT('Ch. 4–5'), SKIENA('Ch. 5')],
    },
    {
      id: 'dp',
      title: 'Dynamic programming',
      summary: 'Solving problems by remembering answers to overlapping subproblems.',
      lessons: [
        { id: 'dynamic-programming', title: 'Dynamic programming', summary: 'Memoization vs tabulation; Fibonacci, coin change, and the DP recipe.', prereqs: ['cs/recursion', 'cs/big-o'] },
        { id: 'sequence-dp', title: 'DP on sequences', summary: 'Longest increasing subsequence, LCS and edit distance.', prereqs: ['cs/dynamic-programming'] },
        { id: 'knapsack-dp', title: 'Knapsack & pseudo-polynomial time', summary: '0/1 knapsack, subset sum, and why O(nW) is not polynomial.', prereqs: ['cs/dynamic-programming'] },
        { id: 'interval-tree-dp', title: 'DP on intervals & trees', summary: 'Matrix-chain, optimal BSTs, independent sets on trees.', prereqs: ['cs/sequence-dp', 'cs/tree-basics'] },
        { id: 'dp-on-graphs', title: 'DP on DAGs & bitmasks', summary: 'Longest paths in DAGs, travelling salesman in O(2ⁿn²).', prereqs: ['cs/dynamic-programming', 'cs/topological-sort'] },
      ],
      references: [CLRS('Ch. 14'), KT('Ch. 6'), SKIENA('Ch. 10'), { authors: 'J. Erickson', title: 'Algorithms', year: 2019, venue: 'self-published (free online)', detail: 'Ch. 3', url: 'https://jeffe.cs.illinois.edu/teaching/algorithms/' }],
    },
    {
      id: 'search-random',
      title: 'Backtracking & randomized algorithms',
      summary: 'Searching huge spaces cleverly, and using coin flips to be fast.',
      lessons: [
        { id: 'backtracking', title: 'Backtracking', summary: 'N-queens, subsets, Sudoku: build a solution piece by piece, undo when stuck.', prereqs: ['cs/recursion'] },
        { id: 'branch-and-bound', title: 'Branch & bound and pruning', summary: 'Bounding to skip hopeless branches.', prereqs: ['cs/backtracking'] },
        { id: 'randomized-algorithms', title: 'Randomized algorithms', summary: 'Las Vegas vs Monte Carlo; randomized quicksort, primality testing.', prereqs: ['cs/merge-quick-sort', 'stats/probability-basics'] },
        { id: 'skip-lists-treaps', title: 'Skip lists & treaps', summary: 'Balanced-tree performance from randomness.', prereqs: ['cs/randomized-algorithms', 'cs/trees-bst'] },
        { id: 'streaming-algorithms', title: 'Streaming & sampling', summary: 'Reservoir sampling and counting distinct elements in one pass.', prereqs: ['cs/randomized-algorithms'] },
      ],
      references: [SKIENA('Ch. 9'), { authors: 'R. Motwani, P. Raghavan', title: 'Randomized Algorithms', year: 1995, venue: 'Cambridge University Press' }, CLRS('Ch. 5, 7.3')],
    },
    {
      id: 'graphs-1',
      title: 'Graphs & traversal',
      summary: 'Modelling networks as graphs and exploring them systematically.',
      lessons: [
        { id: 'graphs-intro', title: 'Graphs', summary: 'Vertices and edges; directed, weighted; adjacency lists vs matrices.', prereqs: ['cs/arrays-linked-lists', 'math/sets-functions'] },
        { id: 'bfs-dfs', title: 'BFS & DFS', summary: 'Breadth-first and depth-first search, O(V + E), and what each is good for.', prereqs: ['cs/graphs-intro', 'cs/stacks-queues'] },
        { id: 'topological-sort', title: 'Topological sort', summary: 'Ordering tasks with dependencies in a DAG.', prereqs: ['cs/bfs-dfs'] },
        { id: 'connectivity-scc', title: 'Strongly connected components', summary: "Kosaraju's and Tarjan's algorithms; condensation DAG.", prereqs: ['cs/topological-sort'] },
        { id: 'bipartite-cycles', title: 'Bipartiteness, cycles & bridges', summary: 'Two-colouring, cycle detection, articulation points.', prereqs: ['cs/bfs-dfs'] },
      ],
      references: [CLRS('Ch. 20'), SW('Ch. 4.1–4.2'), KT('Ch. 3'), SKIENA('Ch. 7')],
    },
    {
      id: 'graphs-2',
      title: 'Shortest paths, spanning trees & flows',
      summary: 'The workhorse graph optimisation algorithms.',
      lessons: [
        { id: 'shortest-paths', title: "Shortest paths: Dijkstra", summary: 'Single-source shortest paths with non-negative weights.', prereqs: ['cs/bfs-dfs', 'cs/heaps'] },
        { id: 'bellman-ford', title: 'Negative weights: Bellman-Ford', summary: 'Relaxing all edges V−1 times; detecting negative cycles.', prereqs: ['cs/shortest-paths'] },
        { id: 'all-pairs-shortest-paths', title: 'All-pairs: Floyd-Warshall', summary: 'A dynamic program over intermediate vertices; Johnson’s algorithm.', prereqs: ['cs/bellman-ford', 'cs/dynamic-programming'] },
        { id: 'a-star-search', title: 'A* search', summary: 'Shortest paths guided by a heuristic, as used in games and maps.', prereqs: ['cs/shortest-paths'] },
        { id: 'minimum-spanning-trees', title: 'Minimum spanning trees', summary: 'Kruskal and Prim; the cut property.', prereqs: ['cs/greedy-algorithms', 'cs/union-find', 'cs/bfs-dfs'] },
        { id: 'network-flow', title: 'Maximum flow', summary: 'Ford–Fulkerson, Edmonds–Karp and the max-flow min-cut theorem.', prereqs: ['cs/bfs-dfs'] },
        { id: 'bipartite-matching', title: 'Matching', summary: 'Bipartite matching via flow; Hall’s theorem; stable matching.', prereqs: ['cs/network-flow'] },
      ],
      references: [CLRS('Ch. 21–25'), SW('Ch. 4.3–4.4, 6'), KT('Ch. 1, 4, 7'), { authors: 'E. W. Dijkstra', title: 'A note on two problems in connexion with graphs', year: 1959, venue: 'Numerische Mathematik 1, 269–271' }],
    },
    {
      id: 'strings-geometry',
      title: 'Strings & geometry',
      summary: 'Algorithms on text and on points in the plane.',
      lessons: [
        { id: 'string-matching', title: 'String matching: KMP', summary: 'Finding a pattern in text in linear time using a failure function.', prereqs: ['cs/big-o'] },
        { id: 'rabin-karp', title: 'Rabin–Karp & rolling hashes', summary: 'Hashing windows of text.', prereqs: ['cs/string-matching', 'cs/hashing'] },
        { id: 'suffix-arrays', title: 'Suffix arrays & trees', summary: 'Indexing all suffixes for fast substring queries.', prereqs: ['cs/string-matching', 'cs/merge-quick-sort'] },
        { id: 'geometry-primitives', title: 'Geometric primitives', summary: 'Orientation tests, segment intersection, robustness.', prereqs: ['cs/big-o'] },
        { id: 'convex-hull', title: 'Convex hulls', summary: 'Graham scan and Andrew’s monotone chain in O(n log n).', prereqs: ['cs/geometry-primitives', 'cs/merge-quick-sort'] },
        { id: 'sweep-line', title: 'Sweep-line algorithms', summary: 'Processing events in order: segment intersections and closest pairs.', prereqs: ['cs/geometry-primitives', 'cs/balanced-trees'] },
      ],
      references: [CLRS('Ch. 32–33'), SW('Ch. 5'), { authors: 'M. de Berg, O. Cheong, M. van Kreveld, M. Overmars', title: 'Computational Geometry: Algorithms and Applications', year: 2008, venue: '3rd ed., Springer', detail: 'Ch. 1–2' }, { authors: 'D. Gusfield', title: 'Algorithms on Strings, Trees, and Sequences', year: 1997, venue: 'Cambridge University Press' }],
    },
    {
      id: 'theory',
      title: 'Theory of computation',
      summary: 'What machines can compute at all — and what they can compute efficiently.',
      lessons: [
        { id: 'finite-automata', title: 'Finite automata', summary: 'DFAs and NFAs: machines with finite memory.', prereqs: ['math/sets-functions'] },
        { id: 'regular-languages', title: 'Regular languages & expressions', summary: 'Regex = NFA = DFA; the pumping lemma.', prereqs: ['cs/finite-automata', 'math/proofs-intro'] },
        { id: 'context-free-grammars', title: 'Context-free grammars', summary: 'Grammars, parse trees, pushdown automata.', prereqs: ['cs/regular-languages'] },
        { id: 'turing-machines', title: 'Turing machines', summary: 'A minimal model of all computation; the Church–Turing thesis.', prereqs: ['cs/finite-automata'] },
        { id: 'decidability', title: 'Decidability & the halting problem', summary: 'Diagonalisation and problems no program can solve.', prereqs: ['cs/turing-machines', 'math/proofs-intro'] },
        { id: 'p-vs-np', title: 'P, NP and P vs NP', summary: 'Efficient solving vs efficient checking; the biggest open question in CS.', prereqs: ['cs/big-o', 'cs/turing-machines'] },
        { id: 'np-completeness', title: 'Reductions & NP-completeness', summary: 'SAT, Cook–Levin, and proving problems hard by reduction.', prereqs: ['cs/p-vs-np'] },
        { id: 'approximation-algorithms', title: 'Approximation algorithms', summary: 'Provably near-optimal answers to NP-hard problems: vertex cover, TSP, set cover.', prereqs: ['cs/np-completeness', 'cs/greedy-algorithms'] },
      ],
      references: [SIPSER('Ch. 1–5, 7'), KT('Ch. 8, 11'), CLRS('Ch. 34–35'), { authors: 'S. Arora, B. Barak', title: 'Computational Complexity: A Modern Approach', year: 2009, venue: 'Cambridge University Press' }],
    },
    {
      id: 'architecture',
      title: 'Computer architecture & parallel hardware',
      summary: 'Instruction sets, pipelines, caches, multicore and GPUs.',
      lessons: [
        { id: 'isa-assembly', title: 'Instruction sets & assembly', summary: 'RISC-V style instructions, registers and how C/Python becomes machine code.', prereqs: ['cs/cpu-memory-basics'] },
        { id: 'pipelining', title: 'Pipelining & hazards', summary: 'Overlapping instructions; data and control hazards; branch prediction.', prereqs: ['cs/isa-assembly'] },
        { id: 'memory-hierarchy', title: 'Caches & the memory hierarchy', summary: 'Locality, cache lines, hit rates — why access patterns matter.', prereqs: ['cs/cpu-memory-basics'] },
        { id: 'parallelism-basics', title: 'Parallelism & Amdahl’s law', summary: 'Multicore, speedup limits, work and span.', prereqs: ['cs/big-o'] },
        { id: 'gpus-simd', title: 'GPUs & SIMD', summary: 'Thousands of simple cores; data-parallel kernels for graphics and ML.', prereqs: ['cs/parallelism-basics', 'cs/memory-hierarchy'] },
        { id: 'parallel-algorithms', title: 'Parallel algorithms', summary: 'Prefix sums, parallel merge sort, and the work–span model.', prereqs: ['cs/parallelism-basics', 'cs/merge-quick-sort'] },
      ],
      references: [PH('Ch. 2, 4–6'), { authors: 'J. L. Hennessy, D. A. Patterson', title: 'Computer Architecture: A Quantitative Approach', year: 2017, venue: '6th ed., Morgan Kaufmann' }, CLRS('Ch. 26 (parallel algorithms)'), { authors: 'D. B. Kirk, W. W. Hwu', title: 'Programming Massively Parallel Processors', year: 2022, venue: '4th ed., Morgan Kaufmann' }],
    },
    {
      id: 'os',
      title: 'Operating systems',
      summary: 'Virtualising the CPU and memory, concurrency, and persistent storage.',
      lessons: [
        { id: 'processes-threads', title: 'Processes & threads', summary: 'The process abstraction, system calls and context switches.', prereqs: ['cs/cpu-memory-basics'] },
        { id: 'cpu-scheduling', title: 'CPU scheduling', summary: 'FIFO, round robin, MLFQ — sharing one CPU fairly.', prereqs: ['cs/processes-threads', 'cs/stacks-queues'] },
        { id: 'virtual-memory', title: 'Virtual memory & paging', summary: 'Address translation, page tables, TLBs and swapping.', prereqs: ['cs/processes-threads', 'cs/memory-hierarchy'] },
        { id: 'concurrency-locks', title: 'Concurrency: locks & races', summary: 'Race conditions, mutexes, condition variables and deadlock.', prereqs: ['cs/processes-threads'] },
        { id: 'file-systems', title: 'File systems & storage', summary: 'Inodes, directories, journaling, SSDs.', prereqs: ['cs/processes-threads', 'cs/b-trees'] },
      ],
      references: [OSTEP('Parts I–III'), { authors: 'A. Silberschatz, P. B. Galvin, G. Gagne', title: 'Operating System Concepts', year: 2018, venue: '10th ed., Wiley' }],
    },
    {
      id: 'networks-security',
      title: 'Networks & security',
      summary: 'How the Internet moves data — and how to keep it secret and authentic.',
      lessons: [
        { id: 'network-layers', title: 'The layered Internet', summary: 'Packets, protocols and the TCP/IP stack.', prereqs: ['cs/how-computers-work'] },
        { id: 'ip-routing', title: 'IP addressing & routing', summary: 'Addresses, subnets, and routing as a shortest-path problem.', prereqs: ['cs/network-layers', 'cs/shortest-paths'] },
        { id: 'tcp-transport', title: 'TCP: reliable transport', summary: 'Handshakes, acknowledgements, retransmission and congestion control.', prereqs: ['cs/network-layers'] },
        { id: 'web-http-dns', title: 'The web: DNS, HTTP & TLS', summary: 'What happens when you type a URL.', prereqs: ['cs/tcp-transport'] },
        { id: 'security-principles', title: 'Security principles', summary: 'Threat models, CIA triad, least privilege; common attacks (injection, XSS, buffer overflow).', prereqs: ['cs/programming-basics'] },
        { id: 'symmetric-crypto', title: 'Symmetric crypto & hashing', summary: 'Block ciphers, AES, cryptographic hash functions, MACs.', prereqs: ['cs/security-principles', 'cs/binary-numbers'] },
        { id: 'public-key-crypto', title: 'Public-key cryptography', summary: 'Diffie–Hellman, RSA, digital signatures and certificates.', prereqs: ['cs/symmetric-crypto'] },
      ],
      references: [
        { authors: 'J. F. Kurose, K. W. Ross', title: 'Computer Networking: A Top-Down Approach', year: 2021, venue: '8th ed., Pearson' },
        { authors: 'D. Boneh, V. Shoup', title: 'A Graduate Course in Applied Cryptography', year: 2023, venue: 'v0.6 (free online)', url: 'https://toc.cryptobook.us/' },
        { authors: 'R. Anderson', title: 'Security Engineering', year: 2020, venue: '3rd ed., Wiley' },
      ],
    },
    {
      id: 'databases',
      title: 'Databases',
      summary: 'Storing, querying and safely updating large amounts of data.',
      lessons: [
        { id: 'databases-intro', title: 'Databases & the relational model', summary: 'Tables, keys and relations — why not just use files?', prereqs: ['cs/collections'] },
        { id: 'sql-queries', title: 'SQL queries', summary: 'SELECT, WHERE, JOIN, GROUP BY — asking questions of data.', prereqs: ['cs/databases-intro'] },
        { id: 'schema-design', title: 'Schema design & normalisation', summary: 'ER modelling, functional dependencies, normal forms.', prereqs: ['cs/sql-queries'] },
        { id: 'indexing-query-processing', title: 'Indexes & query processing', summary: 'B-tree and hash indexes; join algorithms; query plans.', prereqs: ['cs/sql-queries', 'cs/b-trees', 'cs/hashing'] },
        { id: 'transactions-acid', title: 'Transactions & ACID', summary: 'Atomicity, isolation levels, locking and logging.', prereqs: ['cs/sql-queries', 'cs/concurrency-locks'] },
      ],
      references: [{ authors: 'A. Silberschatz, H. F. Korth, S. Sudarshan', title: 'Database System Concepts', year: 2019, venue: '7th ed., McGraw-Hill' }, { authors: 'R. Ramakrishnan, J. Gehrke', title: 'Database Management Systems', year: 2002, venue: '3rd ed., McGraw-Hill' }],
    },
    {
      id: 'compilers-pl',
      title: 'Compilers & programming languages',
      summary: 'How source code becomes running programs, and the ideas behind languages.',
      lessons: [
        { id: 'lexing-parsing', title: 'Lexing & parsing', summary: 'Tokens, grammars, recursive descent and abstract syntax trees.', prereqs: ['cs/context-free-grammars', 'cs/tree-basics'] },
        { id: 'interpreters', title: 'Interpreters & evaluation', summary: 'Environments, closures, and writing an evaluator.', prereqs: ['cs/lexing-parsing', 'cs/functions'] },
        { id: 'type-systems', title: 'Type systems', summary: 'Static vs dynamic typing, type checking and inference.', prereqs: ['cs/interpreters'] },
        { id: 'functional-programming', title: 'Functional programming', summary: 'Pure functions, higher-order functions, immutability.', prereqs: ['cs/recursion'] },
        { id: 'code-generation-optimization', title: 'Code generation & optimisation', summary: 'IR, register allocation (graph colouring), and classic optimisations.', prereqs: ['cs/lexing-parsing', 'cs/isa-assembly'] },
        { id: 'memory-management-gc', title: 'Memory management & garbage collection', summary: 'Stack vs heap, reference counting, mark-and-sweep.', prereqs: ['cs/interpreters', 'cs/bfs-dfs'] },
      ],
      references: [{ authors: 'A. V. Aho, M. S. Lam, R. Sethi, J. D. Ullman', title: 'Compilers: Principles, Techniques, and Tools', year: 2006, venue: '2nd ed., Pearson' }, { authors: 'R. Nystrom', title: 'Crafting Interpreters', year: 2021, venue: 'Genever Benning (free online)', url: 'https://craftinginterpreters.com/' }, SICP('Ch. 4'), { authors: 'B. C. Pierce', title: 'Types and Programming Languages', year: 2002, venue: 'MIT Press' }],
    },
    {
      id: 'distributed',
      title: 'Distributed systems & software engineering',
      summary: 'Many machines acting as one, and building large software that lasts.',
      lessons: [
        { id: 'distributed-basics', title: 'Why distributed is hard', summary: 'Partial failure, unreliable networks, and clocks that disagree.', prereqs: ['cs/tcp-transport'] },
        { id: 'replication-consistency', title: 'Replication & consistency', summary: 'Leaders and followers, eventual vs strong consistency, CAP.', prereqs: ['cs/distributed-basics'] },
        { id: 'consensus', title: 'Consensus: Paxos & Raft', summary: 'Getting machines to agree despite failures.', prereqs: ['cs/replication-consistency'] },
        { id: 'mapreduce-dataflow', title: 'Batch & stream processing', summary: 'MapReduce, dataflow engines and partitioning big data.', prereqs: ['cs/distributed-basics', 'cs/hashing'] },
        { id: 'software-design', title: 'Software design & engineering', summary: 'Modularity, interfaces, testing pyramids, code review and design patterns.', prereqs: ['cs/objects-types', 'cs/testing-debugging'] },
      ],
      references: [{ authors: 'M. Kleppmann', title: 'Designing Data-Intensive Applications', year: 2017, venue: "O'Reilly" }, { authors: 'M. van Steen, A. S. Tanenbaum', title: 'Distributed Systems', year: 2023, venue: '4th ed. (free online)', url: 'https://www.distributed-systems.net/' }, { authors: 'D. Ongaro, J. Ousterhout', title: 'In Search of an Understandable Consensus Algorithm', year: 2014, venue: 'USENIX ATC' }, { authors: 'J. Ousterhout', title: 'A Philosophy of Software Design', year: 2021, venue: '2nd ed., Yaknyam Press' }],
    },
  ],
} satisfies Subject;
