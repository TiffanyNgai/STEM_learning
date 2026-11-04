import type { LessonContent } from '../../types';

// --- An open disc: a point slides towards the (excluded, dashed) boundary; its little ball shrinks but always fits.
const openSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <circle cx="110" cy="100" r="80" fill="var(--c2)" fill-opacity="0.12" stroke="var(--c2)" stroke-width="2" stroke-dasharray="5 4"/>
  <circle r="30" cx="110" cy="100" fill="var(--c3)" fill-opacity="0.25" stroke="var(--c3)" stroke-width="1.5">
    <animate attributeName="cx" values="110;180;188;110" keyTimes="0;0.45;0.6;1" dur="8s" repeatCount="indefinite"/>
    <animate attributeName="r" values="78;9;1.8;78" keyTimes="0;0.45;0.6;1" dur="8s" repeatCount="indefinite"/>
  </circle>
  <circle r="3" cx="110" cy="100" fill="var(--c5)">
    <animate attributeName="cx" values="110;180;188;110" keyTimes="0;0.45;0.6;1" dur="8s" repeatCount="indefinite"/>
  </circle>
  <text x="110" y="196" text-anchor="middle" font-size="10" fill="var(--muted)">boundary circle NOT included (dashed)</text>
  <g font-size="10" fill="var(--fg)">
    <text x="210" y="40">Open disc</text>
    <text x="210" y="56" fill="var(--muted)">|p| &lt; 1</text>
    <text x="210" y="84" fill="var(--c5)">every point …</text>
    <text x="210" y="100" fill="var(--c3)">… has a small ball</text>
    <text x="210" y="114" fill="var(--c3)">around it that still</text>
    <text x="210" y="128" fill="var(--c3)">fits inside.</text>
    <text x="210" y="156" fill="var(--muted)">The ball shrinks near</text>
    <text x="210" y="170" fill="var(--muted)">the edge but never</text>
    <text x="210" y="184" fill="var(--muted)">vanishes.</text>
  </g>
</svg>`;

export default {
  cards: [
    {
      kind: 'recall',
      title: 'From metric spaces',
      points: [
        String.raw`A metric space $(X, d)$ has open balls $B(x, r) = \{y : d(x, y) < r\}$.`,
        String.raw`$U \subseteq X$ is **open** if every point of $U$ has some ball $B(x, r) \subseteq U$ around it.`,
        String.raw`$f$ is continuous if $\forall \varepsilon\, \exists \delta$: $d(x, a) < \delta \Rightarrow e(f(x), f(a)) < \varepsilon$.`,
        String.raw`Equivalently: preimages of open sets are open.`,
      ],
      link: 'math/metric-spaces',
    },
    {
      kind: 'widget',
      title: 'Open means "room to wiggle"',
      body: String.raw`An open set contains none of its edge. Every point in it can wiggle a little in every direction and stay inside. Near the boundary the room shrinks, but some ball always fits.`,
      widget: { type: 'SvgDiagram', props: { svg: openSvg } },
    },
    {
      kind: 'explain',
      title: 'Throw away the distance',
      body: String.raw`In a metric space, the open sets satisfy three rules:

1. $\varnothing$ and $X$ are open.
2. Any union of open sets, even infinitely many, is open.
3. The intersection of **finitely many** open sets is open.

Rule 3 needs "finitely". The sets $(-\tfrac1n, \tfrac1n)$ are all open in $\mathbb{R}$, but their intersection over all $n$ is $\{0\}$, which is not open.

It turns out that continuity, convergence and connectedness can all be expressed using **only** open sets. So we keep the three rules and drop the metric.`,
    },
    {
      kind: 'explain',
      title: 'Topological spaces',
      body: String.raw`**Definition.** A **topology** on a set $X$ is a collection $\tau$ of subsets of $X$, called the **open sets**, that satisfies rules 1–3. The pair $(X, \tau)$ is a **topological space**.

Examples:
- **Metric topology:** the open sets of a metric. On $\mathbb{R}^n$ this is the *standard* topology.
- **Discrete topology:** *every* subset is open.
- **Indiscrete topology:** only $\varnothing$ and $X$ are open.
- On $X = \{a, b, c\}$: $\tau = \{\varnothing, \{a\}, \{a, b\}, X\}$. Check that unions and intersections of these sets stay in the list.

The same set can carry many topologies, just as it can carry many metrics.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Which collections are topologies on $X = \{a, b, c\}$?`,
      choices: [
        String.raw`$\{\varnothing, X\}$`,
        String.raw`$\{\varnothing, \{a\}, \{b\}, X\}$`,
        String.raw`$\{\varnothing, \{a\}, \{a, b\}, X\}$`,
        String.raw`$\{\varnothing, \{a\}, \{b\}, \{a, b\}, X\}$`,
        String.raw`$\{\{a\}, X\}$`,
      ],
      answers: [0, 2, 3],
      why: String.raw`The indiscrete topology $\{\varnothing, X\}$ is always a topology. The collection with $\{a\}$ and $\{b\}$ but not $\{a,b\}$ fails rule 2, because $\{a\} \cup \{b\} = \{a, b\}$ is missing. Adding $\{a, b\}$ fixes it: every union and intersection is then in the list. $\{\{a\}, X\}$ fails rule 1 because it lacks $\varnothing$.`,
    },
    {
      kind: 'explain',
      title: 'Closed sets',
      body: String.raw`A set $C$ is **closed** if its complement $X \setminus C$ is open. By De Morgan's laws, closed sets satisfy the mirror-image rules: $\varnothing, X$ are closed; **any** intersection of closed sets is closed; **finite** unions of closed sets are closed.

A set is not a door. It can be **both** open and closed: $\varnothing$ and $X$ always are, and in the discrete topology every set is. It can also be **neither**: $[0, 1)$ in $\mathbb{R}$ is not open (no ball around $0$ fits inside) and not closed (the points $1 - \tfrac1n$ approach $1$, which is missing).`,
    },
    {
      kind: 'truefalse',
      prompt: 'In every topological space, the intersection of infinitely many open sets is open.',
      answer: false,
      why: String.raw`Only *finite* intersections are guaranteed. In $\mathbb{R}$, $\bigcap_n (-\tfrac1n, \tfrac1n) = \{0\}$ is not open. Arbitrary *unions* of open sets are always open. Do not mix up the two rules.`,
    },
    {
      kind: 'explain',
      title: 'Continuity without ε and δ',
      body: String.raw`**Definition.** A function $f : X \to Y$ between topological spaces is **continuous** if for every open $V \subseteq Y$, the **preimage** $f^{-1}(V) = \{x : f(x) \in V\}$ is open in $X$.

The definition uses preimages, not images. Continuous maps can send open sets to non-open sets. $f(x) = x^2$ sends the open interval $(-1, 1)$ to $[0, 1)$, which is not open, yet $f$ is continuous.

For metric spaces this agrees with the [ε–δ definition](@math/continuity-epsilon-delta):`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`**(ε–δ ⇒ open preimages.)** Let $V$ be open in $Y$ and $a \in f^{-1}(V)$. Then $f(a) \in V$, so some ball $B(f(a), \varepsilon) \subseteq V$.`,
            String.raw`By ε–δ continuity there is $\delta > 0$ with $f(B(a, \delta)) \subseteq B(f(a), \varepsilon) \subseteq V$. So $B(a, \delta) \subseteq f^{-1}(V)$: every point of the preimage has a ball inside it, and the preimage is open.`,
            String.raw`**(Open preimages ⇒ ε–δ.)** Given $a$ and $\varepsilon$, the ball $V = B(f(a), \varepsilon)$ is open, so $f^{-1}(V)$ is open and contains $a$.`,
            String.raw`So some $B(a, \delta) \subseteq f^{-1}(V)$, which says exactly: $d(x, a) < \delta \Rightarrow e(f(x), f(a)) < \varepsilon$. ∎`,
          ],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`For $f(x) = x^2$ on $\mathbb{R}$, what is the preimage $f^{-1}\big((1, 4)\big)$?`,
      choices: [
        String.raw`$(-2, -1) \cup (1, 2)$`,
        String.raw`$(1, 2)$`,
        String.raw`$(1, 16)$`,
        String.raw`$(-2, 2)$`,
      ],
      answer: 0,
      why: String.raw`We need all $x$ with $1 < x^2 < 4$, i.e. $1 < |x| < 2$. Negative $x$ count too, which rules out $(1,2)$ alone. $(1, 16)$ is the *image* of $(1,4)$, not the preimage. As continuity predicts, the preimage is open: a union of two open intervals.`,
    },
    {
      kind: 'explain',
      title: 'Topology decides what is continuous',
      body: String.raw`Changing the topologies changes which maps are continuous:

- If $X$ is **discrete**, *every* $f : X \to Y$ is continuous, because every preimage is open.
- If $Y$ is **indiscrete**, every $f : X \to Y$ is continuous, because the only preimages to check are $\varnothing$ and $X$.

A **homeomorphism** is a bijection $f$ for which $U$ is open exactly when $f(U)$ is open. It is a relabelling of points that matches the open sets exactly, so homeomorphic spaces are "the same space" with renamed points.

Two more tools. A subset $A \subseteq X$ gets the **subspace topology**: its open sets are $U \cap A$ with $U$ open in $X$. A space is **Hausdorff** if any two distinct points have disjoint open neighbourhoods. All metric spaces are Hausdorff, and in a Hausdorff space a sequence has at most one limit.`,
    },
    {
      kind: 'match',
      prompt: 'Match each topology to its open sets.',
      pairs: [
        ['discrete topology on X', 'every subset of X'],
        ['indiscrete topology on X', 'only ∅ and X'],
        [String.raw`standard topology on $\mathbb{R}$`, 'unions of open intervals'],
        [String.raw`subspace topology on $A \subseteq X$`, String.raw`sets $U \cap A$ with $U$ open in $X$`],
      ],
      why: String.raw`Discrete and indiscrete are the two extremes: the most and the fewest open sets possible. Every open set of $\mathbb{R}$ is a union of open intervals (balls). In the subspace topology, $[0, \tfrac12)$ is open in $A = [0, 1]$ because it equals $(-1, \tfrac12) \cap A$, even though it is not open in $\mathbb{R}$.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`How many different topologies are there on the two-point set $\{a, b\}$?`,
      answer: 4,
      why: String.raw`$\varnothing$ and $\{a,b\}$ must be open. The only choice is which of $\{a\}$, $\{b\}$ to add: neither (indiscrete), only $\{a\}$, only $\{b\}$, or both (discrete). All four satisfy the rules. (The one with only $\{a\}$ is called the Sierpiński space.)`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`In the indiscrete topology on $\mathbb{R}$, the constant sequence $x_n = 0$ converges to $5$.`,
      answer: true,
      why: String.raw`$x_n \to x$ means every open set containing $x$ eventually contains all $x_n$. The only open set containing $5$ is $\mathbb{R}$ itself, which contains everything. So the sequence converges to every point. Limits are unique only in Hausdorff spaces, and indiscrete $\mathbb{R}$ is not Hausdorff.`,
    },
    {
      kind: 'fill',
      prompt: 'A map f is continuous when the ___ of every open set is ___. A set is closed when its ___ is open.',
      bank: ['preimage', 'open', 'complement', 'image', 'closed', 'boundary'],
      answer: ['preimage', 'open', 'complement'],
      why: String.raw`Continuity is tested on preimages, not images: $x^2$ maps $(-1,1)$ to the non-open set $[0,1)$ and is still continuous. "Closed" does not mean "not open". It means the complement is open.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **topology** on $X$ is a family of "open" subsets containing $\varnothing$ and $X$, closed under arbitrary unions and finite intersections.
- **Closed** = complement of open. Sets can be both, or neither.
- $f$ is **continuous** iff preimages of open sets are open. In metric spaces this is the ε–δ definition.
- Discrete, indiscrete, metric and subspace topologies. Hausdorff spaces have unique limits.
- Next: the two properties that make the big theorems of calculus work, [compactness and connectedness](@math/compactness-connectedness).`,
    },
  ],
  references: [
    { authors: 'J. R. Munkres', title: 'Topology', year: 2000, venue: '2nd ed., Prentice Hall', detail: 'Ch. 2, §12–13 (topologies, bases), §16–18 (subspaces, closed sets, Hausdorff spaces, continuous functions), §20 (metric topology)' },
    { authors: 'M. A. Armstrong', title: 'Basic Topology', year: 1983, venue: 'Springer (Undergraduate Texts in Mathematics)', detail: 'Ch. 2 (Continuity)' },
    { authors: 'W. A. Sutherland', title: 'Introduction to Metric and Topological Spaces', year: 2009, venue: '2nd ed., Oxford University Press' },
  ],
} satisfies LessonContent;
