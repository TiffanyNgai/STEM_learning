import type { LessonContent } from '../../types';

// A = {1 − 1/n}: dots crowd towards s = 1. The ε-test: some point of A lies in (s − ε, s].
const X = (v: number) => 20 + v * 270;
const supSvg = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <line x1="12" y1="80" x2="312" y2="80" stroke="var(--fg)" stroke-width="1"/>
  ${[0, 0.5, 1].map((v) => `<line x1="${X(v)}" y1="76" x2="${X(v)}" y2="84" stroke="var(--fg)"/><text x="${X(v)}" y="98" font-size="10" text-anchor="middle" fill="var(--fg)">${v}</text>`).join('')}
  ${Array.from({ length: 30 }, (_, i) => 1 - 1 / (i + 1)).map((v) => `<circle cx="${X(v).toFixed(1)}" cy="80" r="2.6" fill="var(--c2)"/>`).join('')}
  <rect x="${X(0.85)}" y="62" width="${X(1) - X(0.85)}" height="36" fill="var(--c3)" fill-opacity="0.18">
    <animate attributeName="x" values="${X(0.7)};${X(0.95)};${X(0.7)}" dur="6s" repeatCount="indefinite"/>
    <animate attributeName="width" values="${X(1) - X(0.7)};${X(1) - X(0.95)};${X(1) - X(0.7)}" dur="6s" repeatCount="indefinite"/>
  </rect>
  <text x="${X(1)}" y="56" font-size="11" text-anchor="middle" fill="var(--c5)" font-weight="bold">s = sup A = 1</text>
  <text x="160" y="22" font-size="10.5" text-anchor="middle" fill="var(--fg)">A = { 1 − 1/n : n = 1, 2, 3, … }</text>
  <text x="160" y="122" font-size="10" text-anchor="middle" fill="var(--c3)">orange window (s − ε, s]: however thin,</text>
  <text x="160" y="136" font-size="10" text-anchor="middle" fill="var(--c3)">it always catches points of A</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A number line with holes',
      body: String.raw`Calculus quietly assumes the number line has **no gaps**. The rationals $\mathbb{Q}$ (fractions $p/q$) look gap-free — between any two there is another — yet they are full of holes.

Take $A = \{q \in \mathbb{Q} : q > 0,\ q^2 < 2\}$. It is bounded above (by $2$, say). In $\mathbb{Q}$ there is **no best** upper bound: any rational upper bound $u$ has $u^2 > 2$, and you can always find a smaller rational that still has square above $2$. The would-be best bound is $\sqrt 2$, and it is missing from $\mathbb{Q}$.

The real numbers $\mathbb{R}$ are built precisely to fill such holes. This lesson makes "no holes" exact.`,
    },
    {
      kind: 'recall',
      title: 'Recall: √2 is irrational',
      points: [
        String.raw`Suppose $\sqrt2 = p/q$ in lowest terms. Then $p^2 = 2q^2$, so $p$ is even, say $p = 2r$.`,
        String.raw`Then $4r^2 = 2q^2$, so $q^2 = 2r^2$ and $q$ is even too — contradicting lowest terms.`,
        String.raw`So no rational number squares to $2$: the rationals have a hole where $\sqrt2$ should be.`,
      ],
      link: 'math/contradiction-contrapositive',
    },
    {
      kind: 'explain',
      title: 'Upper bounds and the supremum',
      body: String.raw`Let $A \subseteq \mathbb{R}$ be a set of numbers.

- $u$ is an **upper bound** of $A$ if $a \le u$ for every $a \in A$.
- $s$ is the **supremum** (least upper bound), written $s = \sup A$, if $s$ is an upper bound **and** $s \le u$ for every upper bound $u$.

If $\sup A$ belongs to $A$ it is the **maximum**. Lower bounds and the **infimum** $\inf A$ (greatest lower bound) are defined the same way, flipped.

**Example.** $A = (0, 1)$, the numbers strictly between $0$ and $1$. Every $u \ge 1$ is an upper bound, and nothing smaller is, so $\sup A = 1$. But $1 \notin A$: the open interval has **no maximum**. A supremum need not be attained.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Let $A = \{(-1)^n / n : n = 1, 2, 3, \dots\} = \{-1, \tfrac12, -\tfrac13, \tfrac14, \dots\}$. What is $\sup A$?`,
      choices: [String.raw`$\tfrac12$`, String.raw`$1$`, String.raw`$0$`, String.raw`$-1$`],
      answer: 0,
      why: String.raw`The positive terms are $\tfrac12, \tfrac14, \tfrac16, \dots$, the largest being $\tfrac12$; all negative terms are smaller. So $\tfrac12$ is an upper bound that belongs to $A$ — it is even the maximum. $-1$ is the **infimum** (and minimum); $0$ is what the terms approach, but it is neither bound.`,
    },
    {
      kind: 'explain',
      title: 'The axiom of completeness',
      body: String.raw`**Axiom of completeness (least-upper-bound property).** Every non-empty set $A \subseteq \mathbb{R}$ that is bounded above has a supremum in $\mathbb{R}$.

This is the single property separating $\mathbb{R}$ from $\mathbb{Q}$. Both are *ordered fields* (you can add, multiply, divide and compare as usual), but only $\mathbb{R}$ is complete: in $\mathbb{R}$, the set $\{x : x^2 < 2\}$ has supremum $\sqrt2$.

Textbooks either take completeness as an axiom (Abbott) or **construct** $\mathbb{R}$ from $\mathbb{Q}$ and prove it — via Dedekind cuts (Rudin) or via equivalence classes of Cauchy sequences (Tao). Every big theorem of this unit — limits of monotone sequences, the intermediate value theorem, existence of integrals — ultimately rests on it.`,
    },
    {
      kind: 'widget',
      title: 'Trapping √2 with nested intervals',
      body: String.raw`An equivalent form of completeness is the **nested interval property**: if $I_1 \supseteq I_2 \supseteq I_3 \supseteq \cdots$ are closed bounded intervals $[a_n, b_n]$, then some real number lies in **all** of them. (Proof: $\sup\{a_n\}$ works.)

Below, each **Halve** keeps the half of the interval on which $x^2 - 2$ changes sign. The intervals are nested and their lengths $1/2^k$ shrink to $0$, so exactly one real number is trapped — $\sqrt2$. Run the same game inside $\mathbb{Q}$ and the intersection is **empty**.`,
      widget: { type: 'MathNestedIntervals', props: { fn: 'x^2 - 2', a: 1, b: 2, name: '√2 ≈ 1.41421356…' } },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Every non-empty subset of $\mathbb{Q}$ that is bounded above has a least upper bound **in** $\mathbb{Q}$.`,
      answer: false,
      why: String.raw`The set $\{q \in \mathbb{Q} : q^2 < 2\}$ is non-empty and bounded above, but its least upper bound would be $\sqrt2$, which is not rational. Completeness is exactly what $\mathbb{Q}$ lacks and $\mathbb{R}$ has.`,
    },
    {
      kind: 'explain',
      title: 'The ε-test for a supremum',
      body: String.raw`How do you **prove** $s = \sup A$? Show two things:

1. $s$ is an upper bound: $a \le s$ for all $a \in A$.
2. Nothing smaller is: **for every** $\varepsilon > 0$ **there exists** $a \in A$ with $a > s - \varepsilon$.

Part 2 says "$s - \varepsilon$ is never an upper bound, however small $\varepsilon$ is". This pattern — *for every $\varepsilon$ there exists* — is the heartbeat of analysis. If the quantifiers feel slippery, revisit [statements & quantifiers](@math/logic-statements).`,
      widget: { type: 'SvgDiagram', props: { svg: supSvg } },
    },
    {
      kind: 'fill',
      prompt: String.raw`$s = \sup A$ exactly when $s$ is an ___ bound of $A$, and for every $\varepsilon > 0$ there is some $a \in A$ with $a$ ___ $s - \varepsilon$.`,
      bank: ['upper', 'lower', '>', '<', '='],
      answer: ['upper', '>'],
      why: String.raw`The supremum is an upper bound that cannot be lowered: any smaller number $s - \varepsilon$ is beaten by some element $a > s - \varepsilon$. Writing $<$ would only say $A$ has small elements, which tells us nothing about $s$.`,
    },
    {
      kind: 'widget',
      title: 'Archimedean property',
      body: String.raw`A first consequence: there are no "infinitely large" or "infinitely small" positive reals.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`**Theorem.** $\mathbb{N} = \{1, 2, 3, \dots\}$ is not bounded above in $\mathbb{R}$. Consequently, for every $\varepsilon > 0$ there is $n \in \mathbb{N}$ with $1/n < \varepsilon$.`,
            String.raw`Suppose instead $\mathbb{N}$ were bounded above. By completeness $s = \sup \mathbb{N}$ exists.`,
            String.raw`$s - 1 < s$ is not an upper bound, so some $n \in \mathbb{N}$ has $n > s - 1$.`,
            String.raw`Then $n + 1 > s$ with $n + 1 \in \mathbb{N}$ — contradicting that $s$ is an upper bound. So $\mathbb{N}$ is unbounded.`,
            String.raw`Given $\varepsilon > 0$, the number $1/\varepsilon$ is not an upper bound of $\mathbb{N}$: some $n > 1/\varepsilon$, i.e. $1/n < \varepsilon$. ∎`,
          ],
          notes: ['', 'Proof by contradiction.', 'This is the ε-test with ε = 1.', '', 'We will use this fact constantly when choosing N in limit proofs.'],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`What is the smallest $n \in \mathbb{N}$ with $\dfrac1n < 0.003$?`,
      answer: 334,
      why: String.raw`$1/n < 0.003 \iff n > 1/0.003 = 333.33\ldots$, so the smallest such integer is $334$. ($n = 333$ gives $1/333 \approx 0.003003$, just too big.)`,
    },
    {
      kind: 'explain',
      title: 'Density of the rationals',
      body: String.raw`**Theorem.** Between any two reals $a < b$ there is a rational number.

**Proof idea.** By the Archimedean property pick $n$ with $1/n < b - a$: steps of size $1/n$ are finer than the gap. Let $m$ be the smallest integer with $m > na$. Then $na < m \le na + 1 < nb$, so $a < m/n < b$. ∎

So $\mathbb{Q}$ is **dense** in $\mathbb{R}$: every real is a limit of rationals (think of decimal expansions). Yet $\mathbb{Q}$ is only *countable* while $\mathbb{R}$ is not ([Cantor's diagonal argument](@math/cardinality-infinity)) — the irrationals vastly outnumber the rationals, even though both are everywhere.`,
    },
    {
      kind: 'multi',
      prompt: 'Select every **true** statement.',
      choices: [
        String.raw`$(0, 1)$ has a supremum but no maximum.`,
        String.raw`$\{x \in \mathbb{R} : x^2 < 2\}$ has supremum $\sqrt2$.`,
        String.raw`$\mathbb{N}$ has a supremum in $\mathbb{R}$.`,
        String.raw`The empty set has a supremum in $\mathbb{R}$.`,
        String.raw`$\{1 - 1/n : n \in \mathbb{N}\}$ has maximum $1$.`,
      ],
      answers: [0, 1],
      why: String.raw`$\sup(0,1) = 1 \notin (0,1)$. $\mathbb{N}$ is unbounded (Archimedean), so it has no supremum. For $\varnothing$ every real is an upper bound, so there is no *least* one — completeness needs a **non-empty** set. $\{1 - 1/n\}$ has supremum $1$, but $1 - 1/n < 1$ always, so $1$ is not attained: no maximum.`,
    },
    {
      kind: 'order',
      prompt: String.raw`Order the proof that $\sup\{1 - 1/n : n \in \mathbb{N}\} = 1$.`,
      steps: [
        String.raw`For every $n$, $1 - 1/n < 1$, so $1$ is an upper bound.`,
        String.raw`Let $\varepsilon > 0$ be arbitrary.`,
        String.raw`By the Archimedean property choose $n$ with $1/n < \varepsilon$.`,
        String.raw`Then $1 - 1/n > 1 - \varepsilon$, so $1 - \varepsilon$ is not an upper bound.`,
        String.raw`Both parts of the ε-test hold, so $\sup = 1$. ∎`,
      ],
      why: String.raw`First the upper-bound check, then the ε-test: fix an arbitrary $\varepsilon$, produce an element beyond $1 - \varepsilon$ (the Archimedean property supplies it), and conclude. Choosing $n$ before fixing $\varepsilon$ would be backwards — $n$ is allowed to depend on $\varepsilon$.`,
    },
    {
      kind: 'match',
      prompt: 'Match each term to its meaning for a set $A$.',
      pairs: [
        ['upper bound $u$', String.raw`$a \le u$ for every $a \in A$`],
        ['supremum', 'an upper bound that is ≤ every other upper bound'],
        ['maximum', 'a supremum that belongs to A'],
        ['infimum', 'a lower bound that is ≥ every other lower bound'],
      ],
      why: 'The supremum is the least upper bound; when it lies in A it is also called the maximum. The infimum is the mirror image: the greatest lower bound.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $\mathbb{Q}$ has holes: $\{q : q^2 < 2\}$ has no least upper bound in $\mathbb{Q}$.
- **Completeness:** every non-empty set of reals that is bounded above has a supremum. It is what makes $\mathbb{R}$ different from $\mathbb{Q}$.
- $s = \sup A$ ⇔ $s$ is an upper bound **and** for every $\varepsilon > 0$ some $a \in A$ exceeds $s - \varepsilon$.
- Equivalent forms: nested intervals always share a point; (next lessons) bounded monotone sequences converge; Cauchy sequences converge.
- Consequences: the **Archimedean property** ($1/n < \varepsilon$ for some $n$) and **density** of $\mathbb{Q}$.

Next: [sequences & limits](@math/sequences-limits), where $\varepsilon$ meets $N$.`,
    },
  ],
  references: [
    { authors: 'S. Abbott', title: 'Understanding Analysis', year: 2015, venue: '2nd ed., Springer (Undergraduate Texts in Mathematics)', detail: 'Ch. 1, §1.3 (The Axiom of Completeness), §1.4 (Consequences of Completeness)' },
    { authors: 'W. Rudin', title: 'Principles of Mathematical Analysis', year: 1976, venue: '3rd ed., McGraw-Hill', detail: 'Ch. 1 (ordered sets, least-upper-bound property; appendix: construction of ℝ by Dedekind cuts)' },
    { authors: 'T. Tao', title: 'Analysis I', year: 2016, venue: '3rd ed., Hindustan Book Agency / Springer', detail: 'Ch. 5 (The real numbers: construction from Cauchy sequences, least upper bound property)' },
    { authors: 'R. G. Bartle, D. R. Sherbert', title: 'Introduction to Real Analysis', year: 2011, venue: '4th ed., Wiley', detail: 'Ch. 2, §2.3–2.5 (Completeness property, applications of the supremum property, intervals)' },
  ],
} satisfies LessonContent;
