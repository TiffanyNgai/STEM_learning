import type { LessonContent } from '../../types';

// --- Open cover of (0,1] by (1/n, 2): intervals keep appearing, each covers a bit more, none reaches 0.
const X = (v: number) => 30 + v * 250;
const bars = Array.from({ length: 9 }, (_, i) => {
  const n = i + 1, a = 1 / (n + 1), y = 40 + i * 11, t0 = (i * 0.7).toFixed(1);
  return `<rect x="${X(a).toFixed(1)}" y="${y}" width="${(X(1.08) - X(a)).toFixed(1)}" height="7" rx="3.5" fill="var(--c2)" fill-opacity="0.35" stroke="var(--c2)" opacity="0">
    <animate attributeName="opacity" values="0;1" begin="${t0}s" dur="0.4s" fill="freeze"/>
  </rect><text x="${(X(a) - 4).toFixed(1)}" y="${y + 7}" font-size="8" text-anchor="end" fill="var(--muted)" opacity="0">(1/${n + 1}, …)<animate attributeName="opacity" values="0;1" begin="${t0}s" dur="0.4s" fill="freeze"/></text>`;
}).join('');
const coverSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <line x1="${X(0)}" y1="160" x2="${X(1)}" y2="160" stroke="var(--fg)" stroke-width="3"/>
  <circle cx="${X(0)}" cy="160" r="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>
  <circle cx="${X(1)}" cy="160" r="4" fill="var(--fg)"/>
  <text x="${X(0)}" y="176" font-size="10" text-anchor="middle" fill="var(--fg)">0 (missing)</text>
  <text x="${X(1)}" y="176" font-size="10" text-anchor="middle" fill="var(--fg)">1</text>
  ${bars}
  <text x="160" y="20" text-anchor="middle" font-size="10" fill="var(--fg)">Cover (0, 1] by the open sets (1/n, 2), n = 2, 3, 4, …</text>
  <text x="160" y="194" text-anchor="middle" font-size="10" fill="var(--c5)">Any finitely many of them miss (0, 1/N]. No finite subcover.</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'What makes the big theorems work?',
      body: String.raw`Two theorems from [real analysis](@math/continuity-epsilon-delta) hold for a continuous $f$ on a closed interval $[a, b]$:

- **Extreme value theorem (EVT):** $f$ attains a maximum and a minimum.
- **Intermediate value theorem (IVT):** $f$ takes every value between $f(a)$ and $f(b)$.

Change the domain and they fail. $f(x) = 1/x$ on $(0, 1]$ has no maximum. $f = 0$ on $[0,1]$ and $f = 1$ on $[2,3]$ is continuous, yet it never takes the value $\tfrac12$.

Each theorem rests on one topological property of $[a, b]$. EVT needs **compactness**. IVT needs **connectedness**.`,
    },
    {
      kind: 'explain',
      title: 'Compactness via open covers',
      body: String.raw`An **open cover** of a space $X$ is a family of open sets whose union is all of $X$. A **subcover** is a subfamily that still covers.

**Definition.** $X$ is **compact** if *every* open cover has a **finite** subcover.

Roughly: however you cover $X$ with "patches", finitely many patches already do the job. So a compact space behaves like a finite set in many arguments. For example, if each patch carries a bound on $f$, take the largest of finitely many bounds.

For metric spaces, this is equivalent to the "every sequence has a convergent subsequence" definition from [metric spaces](@math/metric-spaces).`,
    },
    {
      kind: 'widget',
      title: 'A cover with no finite subcover',
      body: String.raw`The open sets $(\tfrac1n, 2)$ for $n = 2, 3, \dots$ cover $(0, 1]$, because every $x > 0$ satisfies $x > \tfrac1n$ for some $n$. Any finite subfamily has a largest $N$ and misses $(0, \tfrac1N]$. So $(0,1]$ is **not compact**.

For $[0, 1]$ the same trick fails. To cover $[0,1]$ this family needs one more set, an open $U \ni 0$, and $U$ contains some $[0, \varepsilon)$; a single $(\tfrac1n, 2)$ with $\tfrac1n < \varepsilon$ then finishes the job. ($[0,1]$ really is compact, but that needs a proper proof: the Heine–Borel theorem.)`,
      widget: { type: 'SvgDiagram', props: { svg: coverSvg } },
    },
    {
      kind: 'explain',
      title: 'Facts about compact spaces',
      body: String.raw`- **Heine–Borel:** a subset of $\mathbb{R}^n$ is compact **iff** it is closed and bounded. (This fails in general metric spaces such as function spaces.)
- A closed subset of a compact space is compact.
- A compact subset of a Hausdorff space is closed.
- **The continuous image of a compact space is compact.**

The last fact gives the EVT. If $X$ is compact and $f : X \to \mathbb{R}$ is continuous, then $f(X)$ is a compact subset of $\mathbb{R}$. So it is closed and bounded, and therefore contains its supremum and infimum.`,
    },
    {
      kind: 'order',
      prompt: String.raw`Arrange the proof that if $X$ is compact and $f : X \to Y$ is continuous, then $f(X)$ is compact.`,
      steps: [
        String.raw`Let $\{V_i\}$ be any cover of $f(X)$ by open sets of $Y$.`,
        String.raw`Each preimage $f^{-1}(V_i)$ is open, by continuity, and together they cover $X$.`,
        String.raw`By compactness of $X$, finitely many $f^{-1}(V_{i_1}), \dots, f^{-1}(V_{i_k})$ already cover $X$.`,
        String.raw`Then $V_{i_1}, \dots, V_{i_k}$ cover $f(X)$: a finite subcover. ∎`,
      ],
      why: String.raw`Pull the cover back with preimages, which are open because $f$ is continuous. Use compactness upstairs, then push forward. This is the open-set definition of continuity at work: one line instead of an ε–δ argument.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Which subsets of $\mathbb{R}$ (standard topology) are compact?`,
      choices: [
        String.raw`$[0, 1]$`,
        String.raw`$(0, 1]$`,
        String.raw`$\mathbb{Z}$`,
        String.raw`$\{0\} \cup \{1/n : n \ge 1\}$`,
        String.raw`$[0, \infty)$`,
      ],
      answers: [0, 3],
      why: String.raw`By Heine–Borel we need closed **and** bounded. $(0,1]$ is not closed (it misses the limit $0$). $\mathbb{Z}$ and $[0,\infty)$ are unbounded. $\{0\} \cup \{1/n\}$ is bounded and closed, because it contains its only limit point $0$. Any open set around $0$ swallows all but finitely many of the $1/n$.`,
    },
    {
      kind: 'explain',
      title: 'Connectedness',
      body: String.raw`**Definition.** $X$ is **connected** if it cannot be written as $U \cup V$ with $U, V$ disjoint, non-empty and open. Equivalently, the only subsets that are both open and closed are $\varnothing$ and $X$.

- The connected subsets of $\mathbb{R}$ are exactly the **intervals**. This uses the completeness of $\mathbb{R}$.
- **The continuous image of a connected space is connected.**

The second fact gives the IVT. $f([a,b])$ is a connected subset of $\mathbb{R}$, so it is an interval. An interval containing $f(a)$ and $f(b)$ contains everything between them.

A stronger notion: $X$ is **path-connected** if any two points can be joined by a continuous path $\gamma : [0,1] \to X$. Path-connected implies connected, but not conversely.`,
    },
    {
      kind: 'widget',
      title: 'Connected but not path-connected',
      body: String.raw`The **topologist's sine curve** is the graph of $\sin(1/x)$ for $0 < x \le 1$, together with the vertical segment $\{0\} \times [-1, 1]$ that the graph oscillates towards. It is connected: the graph is connected, and adding limit points keeps it connected. But no continuous path can get from the segment to the graph, because the path would have to oscillate infinitely fast.`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['sin(1/x)'], x: [0.005, 0.6], y: [-1.3, 1.3], xLabel: 'x', yLabel: 'sin(1/x)' },
        caption: String.raw`Zoom in near $x = 0$: the oscillations never settle, so the graph piles up on the whole segment $[-1, 1]$ above $x = 0$.`,
      },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`The rational numbers $\mathbb{Q}$ (subspace topology from $\mathbb{R}$) are connected.`,
      answer: false,
      why: String.raw`Split at an irrational number: $U = \{q < \sqrt2\}$ and $V = \{q > \sqrt2\}$ are disjoint, non-empty, open in $\mathbb{Q}$, and their union is all of $\mathbb{Q}$ because $\sqrt2 \notin \mathbb{Q}$. In fact $\mathbb{Q}$ is *totally disconnected*: its only connected subsets are single points.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Which argument proves that $\mathbb{R}$ is **not** homeomorphic to $\mathbb{R}^2$?`,
      choices: [
        String.raw`Removing a point disconnects $\mathbb{R}$ but leaves $\mathbb{R}^2$ connected.`,
        String.raw`$\mathbb{R}$ is compact but $\mathbb{R}^2$ is not.`,
        String.raw`$\mathbb{R}^2$ has more points than $\mathbb{R}$.`,
        String.raw`$\mathbb{R}^2$ needs two coordinates, so no bijection exists.`,
      ],
      answer: 0,
      why: String.raw`A homeomorphism $\mathbb{R} \to \mathbb{R}^2$ would restrict to a homeomorphism $\mathbb{R} \setminus \{p\} \to \mathbb{R}^2 \setminus \{f(p)\}$. The first is disconnected and the second is path-connected (go around the hole), which is a contradiction. Neither space is compact. Both have the same cardinality, and bijections between them exist (but none is continuous both ways).`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`How many connected components does $\mathbb{R} \setminus \{0, 1, 2\}$ have?`,
      answer: 4,
      why: String.raw`The pieces are $(-\infty, 0)$, $(0, 1)$, $(1, 2)$ and $(2, \infty)$, each an interval and so connected. Removing $k$ points from $\mathbb{R}$ leaves $k + 1$ components. Removing $k$ points from $\mathbb{R}^2$ always leaves one.`,
    },
    {
      kind: 'match',
      prompt: 'Match each result to the topological property behind it.',
      pairs: [
        ['extreme value theorem', 'compactness'],
        ['intermediate value theorem', 'connectedness'],
        [String.raw`Heine–Borel in $\mathbb{R}^n$`, 'compact ⇔ closed and bounded'],
        [String.raw`$\mathbb{R} \not\cong \mathbb{R}^2$`, 'connectedness after removing a point'],
      ],
      why: String.raw`EVT: the continuous image of a compact set is compact, hence closed and bounded in $\mathbb{R}$. IVT: the continuous image of a connected set is an interval. Removing points and counting components distinguishes $\mathbb{R}$ from $\mathbb{R}^2$.`,
    },
    {
      kind: 'fill',
      prompt: 'X is compact if every open ___ has a ___ subcover. X is connected if it is not a union of two disjoint non-empty ___ sets.',
      bank: ['cover', 'finite', 'open', 'countable', 'continuous', 'bounded'],
      answer: ['cover', 'finite', 'open'],
      why: String.raw`"Every open cover has a finite subcover" is the definition of compactness. "Countable" gives a different, weaker notion (Lindelöf), and "bounded" is not enough even in $\mathbb{R}$ (think of $(0,1)$). Connectedness forbids a split into two disjoint non-empty **open** sets.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Compact:** every open cover has a finite subcover. In $\mathbb{R}^n$ this means closed and bounded (Heine–Borel).
- **Connected:** not split into two disjoint non-empty open sets. In $\mathbb{R}$ the connected sets are the intervals. Path-connected ⇒ connected, but not conversely (topologist's sine curve).
- Both properties pass to **continuous images**. That one fact gives the EVT and the IVT.
- Both are topological invariants: $(0,1] \not\cong [0,1]$ by compactness, and $\mathbb{R} \not\cong \mathbb{R}^2$ by connectedness.
- Useful later: a continuous bijection from a compact space to a Hausdorff space is automatically a homeomorphism.`,
    },
  ],
  references: [
    { authors: 'J. R. Munkres', title: 'Topology', year: 2000, venue: '2nd ed., Prentice Hall', detail: 'Ch. 3, §23–28 (connected spaces, connected subspaces of ℝ, components and path components, compact spaces, compact subspaces of ℝ, limit point compactness)' },
    { authors: 'M. A. Armstrong', title: 'Basic Topology', year: 1983, venue: 'Springer (Undergraduate Texts in Mathematics)', detail: 'Ch. 3 (Compactness and connectedness)' },
    { authors: 'S. Abbott', title: 'Understanding Analysis', year: 2015, venue: '2nd ed., Springer (Undergraduate Texts in Mathematics)', detail: 'Ch. 3 (Basic topology of ℝ), Ch. 4 (EVT and IVT)' },
  ],
} satisfies LessonContent;
