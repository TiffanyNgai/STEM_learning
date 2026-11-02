import type { LessonContent } from '../../types';
import { R, code } from '../code';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Same answer, wildly different wait',
      body: R`Two programs can compute exactly the same answer while one finishes in a blink and the other runs for years. To compare them we need a way to measure **efficiency** that does not depend on which laptop you own.

Stopwatch timing is unreliable: a faster CPU, another app running, or a different language all change the seconds. Instead we **count basic steps** as a function of the **input size** $n$ (e.g. how many items are in a list). The result, such as "$3n + 2$ steps", describes the *algorithm*, not the machine.`,
    },
    {
      kind: 'explain',
      title: 'What counts as one step?',
      body: R`We use an idealised machine (the **RAM model**, "random-access machine") in which each of these costs one step:

- arithmetic on a number: §a + b§, §a * b§
- a comparison: §a < b§
- assigning a variable: §s = 0§
- reading or writing one list element by position: §xs[i]§

Anything that hides a loop is *not* one step. §sum(xs)§ or §x in xs§ (for a list) secretly walk through all $n$ items, so they cost about $n$ steps.

> Roughly: one step ≈ one simple machine instruction-ish operation. Exact constants do not matter much — the next lesson explains why.`,
    },
    {
      kind: 'widget',
      title: 'Watch the steps pile up',
      body: R`Step through §total§ on a 3-item list. Line 4 runs once **per item**, so for a list of length $n$ the cost is about $1 + 2n + 1 = 2n + 2$ steps (one to initialise, a loop step and an addition per item, one to return).`,
      widget: {
        type: 'CodeTracer',
        props: {
          code: 'def total(xs):\n    s = 0\n    for x in xs:\n        s = s + x\n    return s',
          trace: [
            { line: 2, vars: { xs: [4, 7, 1], s: 0 }, note: 'Initialise the running sum: 1 step.' },
            { line: 3, vars: { xs: [4, 7, 1], s: 0, x: 4 }, note: 'The loop picks the first item.' },
            { line: 4, vars: { xs: [4, 7, 1], s: 4, x: 4 }, note: 'Add it to s: one addition step.' },
            { line: 3, vars: { xs: [4, 7, 1], s: 4, x: 7 }, note: 'Next item.' },
            { line: 4, vars: { xs: [4, 7, 1], s: 11, x: 7 } },
            { line: 3, vars: { xs: [4, 7, 1], s: 11, x: 1 } },
            { line: 4, vars: { xs: [4, 7, 1], s: 12, x: 1 } },
            { line: 5, vars: { xs: [4, 7, 1], s: 12, x: 1 }, out: '12', note: 'Done. The loop body ran 3 times = n times.' },
          ],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: R`In §total(xs)§ above, how many times does line 4 (§s = s + x§) run when §xs§ has $n$ items?`,
      choices: [R`$1$`, R`$n$`, R`$n^2$`, R`$\log_2 n$`],
      answer: 1,
      why: R`A §for§ loop over a list visits each element exactly once, so its body runs $n$ times. It is not $n^2$: there is no second loop inside the first.`,
    },
    {
      kind: 'explain',
      title: 'Nested loops multiply',
      body: R`A loop inside a loop runs its inner body once for **every pair** of outer and inner values.

${code(`for i in range(n):
    for j in range(n):
        do_something(i, j)`)}

The inner body runs $n \times n = n^2$ times. If the inner loop only goes up to $i$ (§for j in range(i)§), it runs $0 + 1 + \dots + (n-1)$ times:

$$\sum_{i=0}^{n-1} i = \frac{n(n-1)}{2}$$

That is about half of $n^2$ — still "quadratic". Comparing every pair of students in a class of $n$ is this kind of loop.`,
    },
    {
      kind: 'widget',
      title: 'Linear vs quadratic',
      body: R`A linear algorithm costing $3n+2$ steps against a quadratic one costing $n^2/2$. For tiny $n$ the quadratic one is cheaper — but drag $c$ and notice the quadratic curve *always* overtakes eventually.`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['c*x+2', 'x^2/2'], x: [0, 40], y: [0, 400], params: [{ name: 'c', min: 1, max: 15, value: 3, label: 'linear cost c' }], labels: ['c·n + 2', 'n²/2'], xLabel: 'n', yLabel: 'steps' },
      },
    },
    {
      kind: 'numeric',
      prompt: R`How many times does §count += 1§ execute when $n = 10$?

${code(`count = 0
for i in range(n):
    for j in range(i + 1, n):
        count += 1`)}`,
      answer: 45,
      why: R`For each $i$, $j$ runs over the $n-1-i$ values after it, so the total is $9+8+\dots+0 = \frac{10\cdot 9}{2} = 45$ — the number of unordered pairs. Answering 100 forgets that $j$ starts after $i$.`,
    },
    {
      kind: 'explain',
      title: 'Loops that halve: logarithms',
      body: R`Some loops shrink the problem by a constant *factor* rather than a constant amount:

${code(`while n > 1:
    n = n // 2   # integer division`)}

How many iterations? Starting from $n$, after $k$ halvings we have about $n/2^k$. We stop when that reaches 1, i.e. $2^k = n$, so $k = \log_2 n$.

**$\log_2 n$ is "how many times can I halve $n$ before reaching 1".** It grows incredibly slowly: $\log_2 1024 = 10$, $\log_2 10^9 \approx 30$.`,
    },
    {
      kind: 'widget',
      title: 'Three loop shapes',
      body: R`Halving loop ($\log n$), single loop ($n$), nested loop ($n^2$), and their product shape $n \log n$. Slide $n$ up to a million and read the step counts.`,
      widget: { type: 'BigOChart', props: { curves: ['logn', 'n', 'nlogn', 'n2'], nMax: 40, n: 1000 } },
    },
    {
      kind: 'match',
      prompt: 'Match each loop shape with its approximate number of inner-body executions.',
      pairs: [
        [R`one loop §for i in range(n)§`, R`$n$`],
        [R`two nested loops, both to $n$`, R`$n^2$`],
        [R`§while n > 1: n = n // 2§`, R`$\log_2 n$`],
        [R`a halving loop *inside* a loop to $n$`, R`$n \log_2 n$`],
      ],
      why: R`Sequential pieces add, nested pieces multiply. A halving loop runs $\log_2 n$ times, so nesting it inside an $n$-loop gives $n\log_2 n$.`,
    },
    {
      kind: 'truefalse',
      prompt: R`If an algorithm's cost is about $n^2$ steps, doubling the input size roughly doubles its running time.`,
      answer: false,
      why: R`$(2n)^2 = 4n^2$, so it roughly **quadruples**. Only linear-cost algorithms double when $n$ doubles.`,
    },
    {
      kind: 'explain',
      title: 'Best, worst and average case',
      body: R`The step count can depend on *which* input of size $n$ you get, not just on $n$. **Linear search** checks items one by one until it finds the target:

- **Best case**: target is first → 1 comparison.
- **Worst case**: target is absent → $n$ comparisons.
- **Average case**: if the target is present at a uniformly random position, about $(n+1)/2$.

We usually quote the **worst case**: it is a *guarantee* ("never slower than this"), and it is often what bites in practice.`,
    },
    {
      kind: 'fill',
      prompt: R`For linear search, the ___ case is when the target sits at position 0 (1 comparison), while the ___ case is when it is absent ($n$ comparisons).`,
      bank: ['best', 'worst', 'amortized', 'average'],
      answer: ['best', 'worst'],
      why: R`Best/worst case are the minimum/maximum cost over all inputs of size $n$. "Amortized" is something different: an average over a *sequence* of operations.`,
    },
    {
      kind: 'multi',
      prompt: R`Which of these take a **constant** number of steps (independent of $n$) for a Python list §xs§ of length $n$?`,
      choices: [R`§xs[i]§`, R`§a + b§ for two numbers`, R`§max(xs)§`, R`§len(xs)§`, R`§7 in xs§`],
      answers: [0, 1, 3],
      why: R`Indexing and arithmetic are single RAM steps, and Python lists store their length, so §len§ is constant. §max§ and §in§ must scan the list — up to $n$ steps — even though each looks like one line of code.`,
    },
    {
      kind: 'order',
      prompt: 'Put the recipe for analysing a loop-based algorithm in order.',
      steps: [
        R`Decide what the input size $n$ is.`,
        'Pick the basic operation(s) to count.',
        R`For each loop, count how many times it runs as a function of $n$.`,
        'Multiply counts for nested loops; add counts for loops in sequence.',
        R`Keep the dominant (fastest-growing) term.`,
      ],
      why: R`You cannot count before knowing what $n$ measures; nesting multiplies and sequencing adds; and finally the biggest term dominates for large $n$ — the bridge to Big-O.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: R`- Measure algorithms by **counting basic steps as a function of input size $n$**, not by seconds.
- One loop to $n$ → $\approx n$; nested loops → $\approx n^2$; halving → $\approx \log_2 n$.
- Hidden loops (§sum§, §in§, §max§) are not single steps.
- Cost can depend on the input: we usually report the **worst case** as a guarantee.
- Next: [Big-O notation](@cs/big-o) makes "about $n^2$" precise.`,
    },
  ],
  references: [
    { authors: 'T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein', title: 'Introduction to Algorithms', year: 2022, venue: '4th ed., MIT Press', detail: '§2.2 Analyzing algorithms' },
    { authors: 'R. Sedgewick, K. Wayne', title: 'Algorithms', year: 2011, venue: '4th ed., Addison-Wesley', detail: '§1.4 Analysis of Algorithms', url: 'https://algs4.cs.princeton.edu/14analysis/' },
    { authors: 'S. S. Skiena', title: 'The Algorithm Design Manual', year: 2020, venue: '3rd ed., Springer', detail: 'Ch. 2' },
  ],
} satisfies LessonContent;
