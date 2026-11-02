import type { LessonContent } from '../../types';

// Venn diagram cycling through A ∪ B, A ∩ B and A \ B (3 s each).
const layer = (i: number, inner: string, label: string) => {
  const vals = [0, 1, 2].map((j) => (j === i ? 1 : 0)).join(';');
  return `<g opacity="${i === 0 ? 1 : 0}"><animate attributeName="opacity" values="${vals}" calcMode="discrete" dur="9s" repeatCount="indefinite"/>${inner}` +
    `<text x="160" y="186" text-anchor="middle" font-size="13" font-weight="bold" fill="var(--c4)">${label}</text></g>`;
};
const vennSvg = `<svg viewBox="0 0 320 196" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <defs>
    <clipPath id="sf-clipB"><circle cx="195" cy="92" r="62"/></clipPath>
    <mask id="sf-maskB"><rect x="0" y="0" width="320" height="196" fill="white"/><circle cx="195" cy="92" r="62" fill="black"/></mask>
  </defs>
  ${layer(0, '<circle cx="125" cy="92" r="62" fill="var(--c2)" fill-opacity="0.45"/><circle cx="195" cy="92" r="62" fill="var(--c2)" fill-opacity="0.45"/>', 'A ∪ B  (in A or B or both)')}
  ${layer(1, '<circle cx="125" cy="92" r="62" fill="var(--c2)" fill-opacity="0.6" clip-path="url(#sf-clipB)"/>', 'A ∩ B  (in both)')}
  ${layer(2, '<circle cx="125" cy="92" r="62" fill="var(--c2)" fill-opacity="0.6" mask="url(#sf-maskB)"/>', 'A \\ B  (in A but not in B)')}
  <circle cx="125" cy="92" r="62" fill="none" stroke="var(--fg)" stroke-width="1.5"/>
  <circle cx="195" cy="92" r="62" fill="none" stroke="var(--fg)" stroke-width="1.5"/>
  <text x="70" y="36" font-size="14" font-weight="bold" fill="var(--fg)">A</text>
  <text x="244" y="36" font-size="14" font-weight="bold" fill="var(--fg)">B</text>
  <g font-size="12" fill="var(--fg)" text-anchor="middle">
    <text x="95" y="88">1</text><text x="105" y="112">2</text><text x="160" y="88">3</text><text x="160" y="112">4</text><text x="222" y="100">5</text>
  </g>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Sets: the containers of mathematics',
      body: String.raw`A **set** is a collection of distinct objects, its **elements**. Order and repetition don't matter: $\{1, 2, 3\} = \{3, 1, 2\} = \{1, 1, 2, 3\}$. We write $x \in A$ ("$x$ is in $A$") and $x \notin A$.

Ways to describe a set:
- **Listing**: $\{2, 3, 5, 7\}$.
- **Set-builder**: $\{x \in \mathbb{Z} : x^2 < 10\} = \{-3, \dots, 3\}$ ("all integers $x$ such that $x^2 < 10$").

Standard sets: $\mathbb{N} = \{0, 1, 2, \dots\}$ (some books start at 1 — check!), integers $\mathbb{Z}$, rationals $\mathbb{Q}$, reals $\mathbb{R}$, and the **empty set** $\varnothing = \{\}$.`,
    },
    {
      kind: 'explain',
      title: 'Subsets and operations',
      body: String.raw`$A \subseteq B$ ($A$ is a **subset** of $B$) means every element of $A$ is in $B$: $\forall x\,(x \in A \Rightarrow x \in B)$. Two sets are **equal** iff $A \subseteq B$ and $B \subseteq A$ — the standard way to prove set equality ("double inclusion").

- **Union** $A \cup B = \{x : x \in A \vee x \in B\}$
- **Intersection** $A \cap B = \{x : x \in A \wedge x \in B\}$
- **Difference** $A \setminus B = \{x : x \in A \wedge x \notin B\}$

Notice the logic: $\cup$ is "or", $\cap$ is "and". Below, $A = \{1,2,3,4\}$ and $B = \{3,4,5\}$.`,
      widget: { type: 'SvgDiagram', props: { svg: vennSvg }, caption: 'The shading cycles through union, intersection and difference.' },
    },
    {
      kind: 'fill',
      prompt: String.raw`With $A = \{1,2,3,4\}$ and $B = \{3,4,5\}$: $A \cap B =$ ___, $A \setminus B =$ ___, $B \setminus A =$ ___.`,
      bank: [String.raw`$\{3,4\}$`, String.raw`$\{1,2\}$`, String.raw`$\{5\}$`, String.raw`$\{1,2,3,4,5\}$`, String.raw`$\varnothing$`],
      answer: [String.raw`$\{3,4\}$`, String.raw`$\{1,2\}$`, String.raw`$\{5\}$`],
      why: String.raw`Intersection keeps the common elements $3, 4$. $A \setminus B$ removes from $A$ everything in $B$, leaving $1, 2$; $B \setminus A = \{5\}$. Difference is not symmetric. $\{1,\dots,5\}$ would be the union.`,
    },
    {
      kind: 'explain',
      title: 'Products and power sets',
      body: String.raw`- The **Cartesian product** $A \times B = \{(a, b) : a \in A,\ b \in B\}$ is the set of ordered pairs. $\mathbb{R} \times \mathbb{R} = \mathbb{R}^2$ is the plane. If $|A| = m$ and $|B| = n$ (where $|A|$ is the number of elements), then $|A \times B| = mn$.
- The **power set** $\mathcal{P}(A)$ is the set of *all subsets* of $A$. For $A = \{a, b\}$: $\mathcal{P}(A) = \{\varnothing, \{a\}, \{b\}, \{a, b\}\}$.

Each subset is a yes/no decision for every element, so a set with $n$ elements has $|\mathcal{P}(A)| = 2^n$ subsets. Careful: $\varnothing$ (empty, 0 elements) and $\{\varnothing\}$ (a box containing an empty box, 1 element) are different.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`How many elements does $\mathcal{P}(\{a, b, c, d\})$ have?`,
      answer: 16,
      why: String.raw`Four independent in/out choices: $2^4 = 16$, counting both $\varnothing$ and the whole set. A common slip is $4^2$ or forgetting $\varnothing$ (giving 15).`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`The empty set is a subset of every set: $\varnothing \subseteq A$ for all sets $A$.`,
      answer: true,
      why: String.raw`$\varnothing \subseteq A$ means "for all $x$, if $x \in \varnothing$ then $x \in A$". The hypothesis $x \in \varnothing$ is always false, so the implication is vacuously true — logic from the first lesson at work.`,
    },
    {
      kind: 'explain',
      title: 'Functions',
      body: String.raw`A **function** $f: A \to B$ assigns to **each** element $a$ of the **domain** $A$ **exactly one** element $f(a)$ of the **codomain** $B$. Formally it is a subset of $A \times B$ containing exactly one pair $(a, b)$ for each $a \in A$.

The **image** (or range) is $f(A) = \{f(a) : a \in A\} \subseteq B$ — the elements actually hit. The codomain is part of the data: $x \mapsto x^2$ as a map $\mathbb{R} \to \mathbb{R}$ and as a map $\mathbb{R} \to [0, \infty)$ are different functions with different properties.

"Each" and "exactly one" are both essential: $f(x) = 1/x$ is **not** a function $\mathbb{R} \to \mathbb{R}$ (no value at $0$), and "$f(x) = \pm\sqrt{x}$" is not a function at all (two values).`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these define functions (with the stated domain and codomain)?',
      choices: [
        String.raw`$f: \mathbb{R} \to \mathbb{R}$, $f(x) = |x|$`,
        String.raw`$f: \mathbb{R} \to \mathbb{R}$, $f(x) = 1/x$`,
        String.raw`$f: \mathbb{Z} \to \mathbb{Z}$, $f(n) = n/2$`,
        String.raw`$f: \mathbb{N} \to \mathbb{N}$, $f(n) = n^2$`,
        String.raw`$f: \mathbb{R} \to \mathbb{R}$, $f(x) = $ "a number whose square is $x$"`,
      ],
      answers: [0, 3],
      why: String.raw`$|x|$ and $n^2$ give one valid output for every input. $1/x$ fails at $0$; $n/2 \notin \mathbb{Z}$ for odd $n$ (the codomain is violated); "a number whose square is $x$" gives two choices for $x > 0$ and none for $x < 0$.`,
    },
    {
      kind: 'widget',
      title: 'One-to-one, onto, bijective',
      body: String.raw`- **Injective** (one-to-one): different inputs give different outputs — $f(a_1) = f(a_2) \Rightarrow a_1 = a_2$. No two arrows land on the same dot.
- **Surjective** (onto): every $b \in B$ is hit — $\forall b\ \exists a:\ f(a) = b$.
- **Bijective**: both. A perfect pairing of $A$ with $B$.

Tap the dots in $A$ to re-aim arrows and watch the badges.`,
      widget: { type: 'MathFunctionMap', props: { domain: ['1', '2', '3'], codomain: ['a', 'b', 'c'], map: [0, 0, 1] } },
    },
    {
      kind: 'match',
      prompt: 'Match each function to its properties.',
      pairs: [
        [String.raw`$\mathbb{R} \to \mathbb{R}$, $x \mapsto 2x + 1$`, 'bijective'],
        [String.raw`$\mathbb{N} \to \mathbb{N}$, $n \mapsto n + 1$`, 'injective, not surjective'],
        [String.raw`$\mathbb{R} \to [0, \infty)$, $x \mapsto x^2$`, 'surjective, not injective'],
        [String.raw`$\mathbb{R} \to \mathbb{R}$, $x \mapsto x^2$`, 'neither'],
      ],
      why: String.raw`$2x+1$ has inverse $(y-1)/2$. $n+1$ never hits $0$ but distinct inputs stay distinct. $x^2$ sends $2$ and $-2$ to $4$ (not injective); with codomain $[0,\infty)$ every value is hit, with codomain $\mathbb{R}$ negatives are missed. The codomain matters!`,
    },
    {
      kind: 'widget',
      title: 'Too many pigeons',
      body: String.raw`Here $A$ has 4 elements and $B$ only 3. Try to make $f$ injective — you can't: some two arrows must share a target. This is the **pigeonhole principle**: if $|A| > |B|$ (finite), no function $A \to B$ is injective. Symmetrically, if $|A| < |B|$ no function is surjective. So a bijection between finite sets forces $|A| = |B|$ — the idea we will stretch to *infinite* sets in [the cardinality lesson](@math/cardinality-infinity).`,
      widget: { type: 'MathFunctionMap', props: { domain: ['1', '2', '3', '4'], codomain: ['a', 'b', 'c'], map: [0, 1, 2, 2] } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`A function $f: \{1,2,3,4,5\} \to \{a, b, c\}$…`,
      choices: [
        'can be injective but cannot be surjective.',
        'can be surjective but cannot be injective.',
        'can be bijective.',
        'can be neither injective nor surjective, but never just one of them.',
      ],
      answer: 1,
      why: String.raw`5 inputs into 3 outputs: by pigeonhole two inputs collide, so never injective (hence never bijective). Surjective is easy: $1, 2 \mapsto a$; $3, 4 \mapsto b$; $5 \mapsto c$.`,
    },
    {
      kind: 'explain',
      title: 'Composition and inverses',
      body: String.raw`If $f: A \to B$ and $g: B \to C$, the **composition** $g \circ f: A \to C$ is $(g\circ f)(a) = g(f(a))$ — "first $f$, then $g$".

$f$ has an **inverse** $f^{-1}: B \to A$ (with $f^{-1}(f(a)) = a$ and $f(f^{-1}(b)) = b$) **if and only if** $f$ is bijective. To prove a specific $f$ is a bijection, either check injective + surjective, or write down an inverse.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`**Claim:** $f: \mathbb{R} \to \mathbb{R}$, $f(x) = 2x + 1$ is bijective.`,
            String.raw`**Injective:** suppose $f(x_1) = f(x_2)$. Then $2x_1 + 1 = 2x_2 + 1$, so $x_1 = x_2$.`,
            String.raw`**Surjective:** let $y \in \mathbb{R}$. Take $x = (y-1)/2 \in \mathbb{R}$; then $f(x) = (y - 1) + 1 = y$.`,
            String.raw`So $f$ is a bijection, with inverse $f^{-1}(y) = (y-1)/2$. ∎`,
          ],
          notes: ['', 'Template: assume equal outputs, deduce equal inputs.', 'Template: given an arbitrary target, solve for an input (scrap-work: solve y = 2x + 1).', ''],
        },
      },
    },
    {
      kind: 'order',
      prompt: String.raw`Prove: if $f: A \to B$ and $g: B \to C$ are injective, then $g \circ f$ is injective.`,
      steps: [
        String.raw`Let $a_1, a_2 \in A$ with $(g\circ f)(a_1) = (g \circ f)(a_2)$.`,
        String.raw`That is, $g(f(a_1)) = g(f(a_2))$.`,
        String.raw`Since $g$ is injective, $f(a_1) = f(a_2)$.`,
        String.raw`Since $f$ is injective, $a_1 = a_2$. So $g \circ f$ is injective. ∎`,
      ],
      why: String.raw`Start from the definition of injectivity for $g\circ f$ (equal outputs), then peel off the outer function $g$ first, then $f$ — the reverse of the order in which they were applied.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Sets: $\in$, $\subseteq$, $\cup$ ("or"), $\cap$ ("and"), $\setminus$, $\times$, $\mathcal{P}(A)$ with $|\mathcal{P}(A)| = 2^n$.
- Prove $A = B$ by **double inclusion**.
- A function assigns **exactly one** output to **each** input; domain and codomain are part of it.
- **Injective**: no collisions. **Surjective**: everything hit. **Bijective**: both ⇔ invertible.
- Pigeonhole: no injection from a bigger finite set into a smaller one.

Next: [relations & equivalence classes](@math/relations-equivalence).`,
    },
  ],
  references: [
    { authors: 'R. Hammack', title: 'Book of Proof', year: 2018, venue: '3rd ed., self-published (free online)', detail: 'Ch. 1 (Sets), Ch. 8 (Proofs involving sets), Ch. 12 (Functions)', url: 'https://richardhammack.github.io/BookOfProof/' },
    { authors: 'D. J. Velleman', title: 'How to Prove It: A Structured Approach', year: 2019, venue: '3rd ed., Cambridge University Press', detail: 'Ch. 1 (set operations), Ch. 5 (Functions)' },
    { authors: 'P. R. Halmos', title: 'Naive Set Theory', year: 1960, venue: 'Van Nostrand (reprinted by Springer UTM, 1974)' },
  ],
} satisfies LessonContent;
