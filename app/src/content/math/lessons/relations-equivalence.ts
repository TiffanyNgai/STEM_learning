import type { LessonContent } from '../../types';

// --- Relation digraphs: "same parity" on {1,2,3,4} (symmetric) vs "≤" on {1,2,3} (not symmetric).
const nodeR = (x: number, y: number, t: string, c: string) =>
  `<circle cx="${x}" cy="${y}" r="11" fill="${c}"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" font-weight="bold" fill="var(--surface)">${t}</text>`;
const loop = (x: number, y: number) => `<path d="M${x - 6},${y - 10} C${x - 20},${y - 38} ${x + 20},${y - 38} ${x + 6},${y - 10}" fill="none" stroke="var(--muted)" stroke-width="1.3" marker-end="url(#re-arr)"/>`;
const relSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <defs><marker id="re-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--muted)"/></marker></defs>
  <text x="80" y="14" text-anchor="middle" font-size="11" fill="var(--fg)">a ~ b: same parity</text>
  <text x="240" y="14" text-anchor="middle" font-size="11" fill="var(--fg)">a ≤ b</text>
  <line x1="152" y1="20" x2="152" y2="170" stroke="var(--grid)"/>
  ${loop(40, 70)}${loop(120, 70)}${loop(40, 140)}${loop(120, 140)}
  <line x1="53" y1="70" x2="107" y2="70" stroke="var(--c2)" stroke-width="1.5" marker-start="url(#re-arr)" marker-end="url(#re-arr)"/>
  <line x1="53" y1="140" x2="107" y2="140" stroke="var(--c3)" stroke-width="1.5" marker-start="url(#re-arr)" marker-end="url(#re-arr)"/>
  ${nodeR(40, 70, '1', 'var(--c2)')}${nodeR(120, 70, '3', 'var(--c2)')}${nodeR(40, 140, '2', 'var(--c3)')}${nodeR(120, 140, '4', 'var(--c3)')}
  ${loop(185, 150)}${loop(240, 90)}${loop(295, 150)}
  <line x1="193" y1="141" x2="231" y2="99" stroke="var(--c4)" stroke-width="1.5" marker-end="url(#re-arr)"/>
  <line x1="249" y1="99" x2="287" y2="141" stroke="var(--c4)" stroke-width="1.5" marker-end="url(#re-arr)"/>
  <line x1="197" y1="155" x2="283" y2="155" stroke="var(--c4)" stroke-width="1.5" marker-end="url(#re-arr)"/>
  ${nodeR(185, 150, '1', 'var(--c4)')}${nodeR(240, 90, '2', 'var(--c4)')}${nodeR(295, 150, '3', 'var(--c4)')}
  <g font-size="9.5" fill="var(--muted)" text-anchor="middle">
    <text x="80" y="178">loops: reflexive. 2-way arrows:</text><text x="80" y="190">symmetric. Two clusters.</text>
    <text x="240" y="178">reflexive, transitive, but 1 → 2</text><text x="240" y="190">has no arrow back: not symmetric</text>
  </g>
</svg>`;

// --- Gluing: the interval [0,1] with 0 ~ 1 becomes a circle.
const N = 48, R = 240 / (2 * Math.PI);
const linePts = Array.from({ length: N + 1 }, (_, i) => [40 + (240 * i) / N, 140]);
// both ends go to the top of the circle; the midpoint of the segment goes to the bottom
const circPts = Array.from({ length: N + 1 }, (_, i) => { const a = -Math.PI / 2 - (2 * Math.PI * i) / N; return [160 + R * Math.cos(a), 92 + R * Math.sin(a)]; });
const dOf = (p: number[][]) => p.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
const kt = '0;0.15;0.55;0.85;1';
const glueSvg = `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <path d="${dOf(linePts)}" fill="none" stroke="var(--c2)" stroke-width="3" stroke-linecap="round">
    <animate attributeName="d" values="${dOf(linePts)};${dOf(linePts)};${dOf(circPts)};${dOf(circPts)};${dOf(linePts)}" keyTimes="${kt}" dur="7s" repeatCount="indefinite"/>
  </path>
  <circle r="6" fill="var(--c3)" cx="${linePts[0][0]}" cy="140">
    <animate attributeName="cx" values="40;40;${circPts[0][0].toFixed(1)};${circPts[0][0].toFixed(1)};40" keyTimes="${kt}" dur="7s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="140;140;${circPts[0][1].toFixed(1)};${circPts[0][1].toFixed(1)};140" keyTimes="${kt}" dur="7s" repeatCount="indefinite"/>
  </circle>
  <circle r="6" fill="var(--c5)" fill-opacity="0.8" cx="280" cy="140">
    <animate attributeName="cx" values="280;280;${circPts[N][0].toFixed(1)};${circPts[N][0].toFixed(1)};280" keyTimes="${kt}" dur="7s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="140;140;${circPts[N][1].toFixed(1)};${circPts[N][1].toFixed(1)};140" keyTimes="${kt}" dur="7s" repeatCount="indefinite"/>
  </circle>
  <text x="40" y="162" text-anchor="middle" font-size="11" fill="var(--c3)">0</text>
  <text x="280" y="162" text-anchor="middle" font-size="11" fill="var(--c5)">1</text>
  <text x="160" y="174" text-anchor="middle" font-size="11" fill="var(--fg)">[0, 1] with 0 ~ 1 (glued)  →  a circle</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: '"Counts as the same"',
      body: String.raw`$\tfrac12$ and $\tfrac24$ are different pairs of integers but the *same* number. 2 o'clock and 14:00 are the same position of the clock hand. Two people born on 3 March have "the same birthday". Mathematics constantly declares different things equal *for some purpose* — and the precise tool for that is an **equivalence relation**.

First, a **relation** $R$ on a set $A$ is any subset $R \subseteq A \times A$. We write $a \mathrel{R} b$ (or $a \sim b$) for $(a, b) \in R$. Examples on $\mathbb{Z}$: $=$, $<$, $\le$, "$a$ divides $b$", "$a - b$ is even". A relation can be drawn as a directed graph: an arrow $a \to b$ whenever $a \sim b$.`,
    },
    {
      kind: 'widget',
      title: 'Three key properties',
      body: String.raw`A relation $\sim$ on $A$ is

- **reflexive** if $a \sim a$ for all $a$ (a loop at every dot),
- **symmetric** if $a \sim b \Rightarrow b \sim a$ (every arrow has a return arrow),
- **transitive** if $a \sim b$ and $b \sim c$ $\Rightarrow a \sim c$ (two-step paths have a shortcut).

(Also: **antisymmetric** if $a \sim b$ and $b \sim a$ imply $a = b$ — typical of orderings like $\le$.)`,
      widget: { type: 'SvgDiagram', props: { svg: relSvg } },
    },
    {
      kind: 'multi',
      prompt: String.raw`Which properties does $\le$ on $\mathbb{R}$ have?`,
      choices: ['reflexive', 'symmetric', 'transitive', 'antisymmetric'],
      answers: [0, 2, 3],
      why: String.raw`$a \le a$ ✓; $a \le b \le c \Rightarrow a \le c$ ✓; $a \le b$ and $b \le a$ force $a = b$ ✓. Not symmetric: $1 \le 2$ but $2 \not\le 1$. Reflexive + antisymmetric + transitive makes $\le$ a *partial order* — a different kind of relation from "sameness".`,
    },
    {
      kind: 'explain',
      title: 'Equivalence relations',
      body: String.raw`A relation that is **reflexive, symmetric and transitive** is an **equivalence relation**. It behaves like a weakened "$=$".

The star example: fix an integer $n \ge 2$. Say $a \equiv b \pmod n$ ("$a$ is **congruent** to $b$ mod $n$") if $n \mid (a - b)$. So $17 \equiv 2 \pmod 5$ because $5 \mid 15$.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`**Reflexive:** $a - a = 0 = n \cdot 0$, so $n \mid (a - a)$ and $a \equiv a$.`,
            String.raw`**Symmetric:** if $a - b = nk$, then $b - a = n(-k)$, so $b \equiv a$.`,
            String.raw`**Transitive:** if $a - b = nk$ and $b - c = nl$, then $a - c = (a-b) + (b-c) = n(k + l)$, so $a \equiv c$.`,
            String.raw`Hence congruence mod $n$ is an equivalence relation. ∎`,
          ],
          notes: ['', 'k an integer ⇒ −k an integer.', 'Fresh letters k and l for the two hypotheses (lesson 2!).', ''],
        },
      },
    },
    {
      kind: 'widget',
      title: 'Equivalence classes',
      body: String.raw`The **equivalence class** of $a$ is everything equivalent to it: $[a] = \{x \in A : x \sim a\}$. For congruence mod $n$ the classes are the **remainder classes** $[0], [1], \dots, [n-1]$. Move the slider and tap numbers: each integer lands in exactly one class, and $[a] = [b]$ exactly when $a \equiv b$.`,
      widget: { type: 'MathResidueClasses', props: { n: 3 } },
    },
    {
      kind: 'explain',
      title: 'Classes form a partition',
      body: String.raw`A **partition** of $A$ is a collection of non-empty subsets ("blocks") such that every element of $A$ is in **exactly one** block.

**Theorem.** If $\sim$ is an equivalence relation on $A$, its equivalence classes form a partition of $A$. Conversely, every partition of $A$ comes from an equivalence relation: $a \sim b$ iff $a$ and $b$ lie in the same block.

So "equivalence relation" and "partition" are two views of the same thing: a rule for sameness, or a way of sorting into bins. Every $a$ is in some class (namely $[a]$, by reflexivity); the key step is that two classes are either **identical or disjoint**.`,
    },
    {
      kind: 'order',
      prompt: String.raw`Prove: if $[a] \cap [b] \ne \varnothing$ then $[a] = [b]$.`,
      steps: [
        String.raw`Pick $c \in [a] \cap [b]$, so $c \sim a$ and $c \sim b$.`,
        String.raw`By symmetry $a \sim c$; with $c \sim b$, transitivity gives $a \sim b$.`,
        String.raw`Let $x \in [a]$: $x \sim a$ and $a \sim b$, so $x \sim b$ by transitivity, i.e. $x \in [b]$. Thus $[a] \subseteq [b]$.`,
        String.raw`The same argument with $a$ and $b$ swapped gives $[b] \subseteq [a]$; hence $[a] = [b]$. ∎`,
      ],
      why: String.raw`Use the shared element to link $a$ and $b$ (needs symmetry and transitivity), then prove set equality by double inclusion. All three axioms get used somewhere: reflexivity guarantees $a \in [a]$, so no class is empty.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`On $\mathbb{R}$, the relation "$x \sim y$ iff $|x - y| \le 1$" is an equivalence relation.`,
      answer: false,
      why: String.raw`It is reflexive and symmetric but **not transitive**: $0 \sim 0.8$ and $0.8 \sim 1.6$, yet $|0 - 1.6| = 1.6 > 1$. "Close to" is not "the same as" — small differences accumulate. This is why measured values can't just be declared equal when they're close.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`On $\mathbb{Z}$ define $a \sim b$ iff $a^2 = b^2$. How many elements are in the class $[-3]$?`,
      answer: 2,
      why: String.raw`$[-3] = \{x : x^2 = 9\} = \{-3, 3\}$. (This is an equivalence relation because it is "equality after applying $f(x) = x^2$" — any relation $f(a) = f(b)$ is automatically reflexive, symmetric and transitive.) The class $[0] = \{0\}$ has just one element.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`$\{1,2,3,4\}$ is partitioned into blocks $\{1,2\}$, $\{3\}$, $\{4\}$. Which pair is related by the corresponding equivalence relation?`,
      choices: [String.raw`$(2, 1)$`, String.raw`$(1, 3)$`, String.raw`$(3, 4)$`, String.raw`$(2, 4)$`],
      answer: 0,
      why: String.raw`$a \sim b$ iff $a$ and $b$ share a block. Only $1$ and $2$ share one, so $2 \sim 1$ (and $1 \sim 2$, plus every $a \sim a$). The relation is $\{(1,1),(2,2),(3,3),(4,4),(1,2),(2,1)\}$.`,
    },
    {
      kind: 'widget',
      title: 'Quotients: one point per class',
      body: String.raw`The set of all classes is the **quotient** $A/{\sim}$. We then treat each class as a single new object:

- $\mathbb{Z}/{\equiv_n}$ is the clock $\mathbb{Z}_n$ from [groups](@math/groups-intro); cosets in [Lagrange's theorem](@math/subgroups-lagrange) are classes too.
- $\mathbb{Q}$ itself is pairs $(a, b)$, $b \ne 0$, with $(a,b) \sim (c,d)$ iff $ad = bc$ — so $\tfrac12 = \tfrac24$.
- In topology, quotients **glue** spaces: declaring $0 \sim 1$ in $[0,1]$ turns the segment into a circle ([quotient spaces](@math/quotient-spaces)).

Any operation on classes must be **well defined**: the answer may not depend on which representative you picked.`,
      widget: { type: 'SvgDiagram', props: { svg: glueSvg } },
    },
    {
      kind: 'match',
      prompt: 'Each relation fails to be an equivalence relation, except one. Match each to its verdict.',
      pairs: [
        [String.raw`$<$ on $\mathbb{R}$`, 'not reflexive'],
        [String.raw`$\le$ on $\mathbb{R}$`, 'reflexive and transitive, but not symmetric'],
        [String.raw`$|x - y| \le 1$ on $\mathbb{R}$`, 'reflexive and symmetric, but not transitive'],
        ['"has the same birthday as" on people', 'an equivalence relation'],
      ],
      why: String.raw`$a < a$ is never true. $\le$ lacks symmetry ($1 \le 2$, $2 \not\le 1$). Closeness is not transitive. Same birthday is "equal values of the function person ↦ birthday", which is always an equivalence relation.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`An equivalence relation is reflexive, ___ (every arrow can be reversed) and ___ (two-step paths have a shortcut). Its equivalence classes form a ___ of the set.`,
      bank: ['symmetric', 'transitive', 'antisymmetric', 'partition', 'subgroup', 'bijection'],
      answer: ['symmetric', 'transitive', 'partition'],
      why: 'R-S-T is the definition. Antisymmetry belongs to orderings like ≤ and, together with symmetry, would force the relation to be plain equality. The classes sort the set into disjoint, non-empty blocks: a partition.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **relation** on $A$ is a subset of $A \times A$; draw it as arrows.
- **Equivalence relation** = reflexive + symmetric + transitive. Example: $a \equiv b \pmod n$ iff $n \mid a - b$.
- **Classes** $[a]$ are identical or disjoint, so they **partition** $A$ — and every partition defines an equivalence relation.
- "$f(a) = f(b)$" is always an equivalence relation.
- The **quotient** $A/{\sim}$ turns classes into points: $\mathbb{Z}_n$, $\mathbb{Q}$, cosets, glued spaces.

Next: comparing the sizes of infinite sets — [countable & uncountable](@math/cardinality-infinity).`,
    },
  ],
  references: [
    { authors: 'D. J. Velleman', title: 'How to Prove It: A Structured Approach', year: 2019, venue: '3rd ed., Cambridge University Press', detail: 'Ch. 4 (Relations)' },
    { authors: 'R. Hammack', title: 'Book of Proof', year: 2018, venue: '3rd ed., self-published (free online)', detail: 'Ch. 11 (Relations)', url: 'https://richardhammack.github.io/BookOfProof/' },
    { authors: 'D. S. Dummit, R. M. Foote', title: 'Abstract Algebra', year: 2004, venue: '3rd ed., Wiley', detail: '§0.1 (Basics: equivalence relations and partitions)' },
  ],
} satisfies LessonContent;
