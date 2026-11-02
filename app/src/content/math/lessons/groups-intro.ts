import type { LessonContent } from '../../types';

const clockSvg = String.raw`<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-size="11" font-family="inherit">
  <circle cx="90" cy="100" r="72" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>
  <g fill="var(--fg)"><text x="119.0" y="53.8" text-anchor="middle">1</text><text x="140.2" y="75.0" text-anchor="middle" fill="var(--c1)" font-weight="bold">2</text><text x="148.0" y="104.0" text-anchor="middle">3</text><text x="140.2" y="133.0" text-anchor="middle">4</text><text x="119.0" y="154.2" text-anchor="middle">5</text><text x="90.0" y="162.0" text-anchor="middle">6</text><text x="61.0" y="154.2" text-anchor="middle">7</text><text x="39.8" y="133.0" text-anchor="middle">8</text><text x="32.0" y="104.0" text-anchor="middle" fill="var(--c2)" font-weight="bold">9</text><text x="39.8" y="75.0" text-anchor="middle">10</text><text x="61.0" y="53.8" text-anchor="middle">11</text><text x="90.0" y="46.0" text-anchor="middle">0</text></g>
  <path d="M 43.5 100 A 46.5 46.5 0 0 1 130.3 76.8" fill="none" stroke="var(--c3)" stroke-width="3" stroke-dasharray="4 3" opacity="0.7"/>
  <line x1="90" y1="100" x2="90" y2="56" stroke="var(--c3)" stroke-width="3" stroke-linecap="round">
    <animateTransform attributeName="transform" type="rotate" values="270 90 100;420 90 100;420 90 100" keyTimes="0;0.6;1" dur="4s" repeatCount="indefinite"/>
  </line>
  <circle cx="90" cy="100" r="4" fill="var(--fg)"/>
  <g fill="var(--fg)" font-size="12">
    <text x="180" y="70">9 + 5 = 14</text>
    <text x="180" y="92">14 − 12 = 2</text>
    <text x="180" y="122" fill="var(--c1)" font-weight="bold">9 + 5 ≡ 2 (mod 12)</text>
    <text x="180" y="150" font-size="10" fill="var(--muted)">identity: 0</text>
    <text x="180" y="164" font-size="10" fill="var(--muted)">inverse of 9: 3</text>
  </g>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'What do these have in common?',
      body: String.raw`- Adding hours on a clock.
- Rotating a square tile so it still fits its hole.
- Shuffling a deck of cards.
- Multiplying invertible matrices.

In each case you can **combine** two actions into one, there is a **do-nothing** action, and every action can be **undone**. Mathematicians noticed that a huge amount follows from just these features, so they gave the pattern a name: a **group**. Groups are the mathematics of **symmetry** — and they organise crystal structures, particle physics, cryptography and equivariant neural networks.`,
    },
    {
      kind: 'explain',
      title: 'The definition',
      body: String.raw`A **group** is a set $G$ with an operation $*$ that combines any two elements $a, b$ into an element $a * b$, such that:

1. **Closure**: $a * b$ is again in $G$.
2. **Associativity**: $(a*b)*c = a*(b*c)$ — brackets don't matter.
3. **Identity**: there is an $e \in G$ with $e*a = a*e = a$ for all $a$.
4. **Inverses**: every $a$ has an $a^{-1}$ with $a*a^{-1} = a^{-1}*a = e$.

Note what is *not* required: $a*b = b*a$. Groups where this does hold for all pairs are called **abelian** (after Niels Abel). We often drop the $*$ and write $ab$.`,
    },
    {
      kind: 'widget',
      title: 'Clock arithmetic: the group ℤₙ',
      body: String.raw`On a 12-hour clock (with 12 relabelled 0), 5 hours after 9 o'clock is 2 o'clock. The set $\mathbb{Z}_{12} = \{0, 1, \dots, 11\}$ with **addition mod 12** (add, then subtract 12 if needed) is a group: identity $0$, and the inverse of $a$ is $12 - a$ (the inverse of $0$ is $0$). Same for any $n$: $\mathbb{Z}_n$. It is abelian.`,
      widget: { type: 'SvgDiagram', props: { svg: clockSvg } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`In $\mathbb{Z}_{12}$, what is the inverse of $5$? (The element you add to $5$ to get the identity $0$.)`,
      answer: 7,
      why: String.raw`$5 + 7 = 12 \equiv 0 \pmod{12}$. A common wrong answer is $-5$: that's correct in the integers, but in $\mathbb{Z}_{12}$ the elements are $0,\dots,11$ and $-5 \equiv 7$.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these are groups?',
      choices: [
        String.raw`The integers $\mathbb{Z}$ under addition`,
        String.raw`The integers $\mathbb{Z}$ under multiplication`,
        String.raw`The natural numbers $\{0, 1, 2, \dots\}$ under addition`,
        String.raw`The positive real numbers under multiplication`,
        String.raw`All real numbers under multiplication`,
      ],
      answers: [0, 3],
      why: String.raw`$(\mathbb{Z},+)$: identity $0$, inverse $-a$. Positive reals under $\times$: identity $1$, inverse $1/a$. Under multiplication, $2 \in \mathbb{Z}$ has no integer inverse ($1/2 \notin \mathbb{Z}$); naturals lack negatives; and $0$ has no multiplicative inverse in $\mathbb{R}$.`,
    },
    {
      kind: 'widget',
      title: 'Rotations of a square',
      body: String.raw`The four rotations of a square (by 0°, 90°, 180°, 270°) form a group called $C_4$. Press **r** repeatedly: $r^4 = e$. The table on the right is the group's **Cayley table** — the "multiplication table" listing every product. Compare it with addition in $\mathbb{Z}_4$: $r^a r^b = r^{a+b \bmod 4}$. Same pattern, different costume.`,
      widget: { type: 'SymmetryRotator', props: { n: 4, reflect: false, showTable: true } },
    },
    {
      kind: 'explain',
      title: 'First proofs: things you get for free',
      body: String.raw`From four short axioms you can already *prove* facts that hold in every group at once — that's the power of abstraction. Step through two classics.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`**Claim 1:** the identity is unique. Suppose $e$ and $e'$ both behave as identities.`,
            String.raw`Then $e = e\,e'$ (because $e'$ is an identity) and $e\,e' = e'$ (because $e$ is an identity). So $e = e'$. ∎`,
            String.raw`**Claim 2 ("socks and shoes"):** $(ab)^{-1} = b^{-1}a^{-1}$.`,
            String.raw`Check: $(ab)(b^{-1}a^{-1}) = a(bb^{-1})a^{-1} = a\,e\,a^{-1} = aa^{-1} = e$ (and similarly in the other order). ∎`,
            String.raw`Intuition: you put on socks then shoes; to undo, take off shoes *first*, then socks.`,
          ],
          notes: ['', 'Only the identity axiom was used.', '', 'Associativity lets us move the brackets.', ''],
        },
      },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`In every group, $(ab)^{-1} = a^{-1}b^{-1}$.`,
      answer: false,
      why: String.raw`The correct rule reverses the order: $(ab)^{-1} = b^{-1}a^{-1}$. The two agree only when $a^{-1}$ and $b^{-1}$ commute — fine in abelian groups, false in general (try two different reflections of a triangle).`,
    },
    {
      kind: 'widget',
      title: 'Order matters',
      body: String.raw`Now add flips. Press **r** then **s**; reset; then press **s** then **r**. The triangle ends in different positions: $sr \ne rs$. (We write products right-to-left like functions: $rs$ means "do $s$, then $r$".) This group of 6 symmetries, $D_3$, is the smallest **non-abelian** group.`,
      widget: { type: 'SymmetryRotator', props: { n: 3, reflect: true, showTable: false } },
    },
    {
      kind: 'order',
      prompt: String.raw`Arrange the proof of the **cancellation law**: if $ga = gb$ then $a = b$.`,
      steps: [
        String.raw`Start from $ga = gb$.`,
        String.raw`Multiply both sides on the left by $g^{-1}$: $g^{-1}(ga) = g^{-1}(gb)$.`,
        String.raw`Regroup by associativity: $(g^{-1}g)a = (g^{-1}g)b$.`,
        String.raw`Use the inverse axiom: $ea = eb$.`,
        String.raw`Use the identity axiom: $a = b$. ∎`,
      ],
      why: 'Each step uses exactly one axiom (inverse exists, associativity, inverse property, identity). Cancellation is why every row of a Cayley table contains each element exactly once.',
    },
    {
      kind: 'explain',
      title: 'The order of an element',
      body: String.raw`Repeat an element: $g, g^2 = gg, g^3, \dots$ The **order** of $g$ is the smallest $k \ge 1$ with $g^k = e$ (if none exists, the order is infinite).

In $\mathbb{Z}_{12}$ the operation is $+$, so "powers" are repeated sums. Order of $3$: $3, 6, 9, 12\equiv 0$ — order $4$. Order of $5$: you need $5k$ to be a multiple of 12, first at $k=12$ — order $12$, so $5$ alone generates the whole clock. A rotation of a square by 90° has order 4; any reflection has order 2.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`What is the order of $8$ in $\mathbb{Z}_{12}$?`,
      answer: 3,
      why: String.raw`$8 \to 16 \equiv 4 \to 12 \equiv 0$: three steps. In general the order of $a$ in $\mathbb{Z}_n$ is $n / \gcd(a, n) = 12/4 = 3$.`,
    },
    {
      kind: 'match',
      prompt: 'Match each group to its operation.',
      pairs: [
        [String.raw`$\mathbb{Z}_n$ (clock numbers)`, 'Addition mod n'],
        [String.raw`$S_n$ (all rearrangements of $n$ objects)`, 'Composition: do one shuffle, then another'],
        [String.raw`$GL_n(\mathbb{R})$ (invertible $n\times n$ matrices)`, 'Matrix multiplication'],
        [String.raw`$\mathbb{R}^{\times}$ (non-zero reals)`, 'Ordinary multiplication'],
      ],
      why: String.raw`Each set needs the operation that keeps it closed and invertible: invertible matrices multiply to invertible matrices, and a shuffle followed by a shuffle is a shuffle. Of these, $S_n$ ($n\ge3$) and $GL_n$ ($n\ge2$) are non-abelian.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`A group in which $ab = ba$ for all $a, b$ is called ___. The inverse of a product is $(ab)^{-1} = $ ___.`,
      bank: ['abelian', 'cyclic', 'trivial', String.raw`$b^{-1}a^{-1}$`, String.raw`$a^{-1}b^{-1}$`],
      answer: ['abelian', String.raw`$b^{-1}a^{-1}$`],
      why: String.raw`"Abelian" means commutative. "Cyclic" is different: generated by a single element (like $\mathbb{Z}_{12}$ by $1$). Inverses reverse order — socks and shoes.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **group** = set + operation with closure, associativity, identity and inverses.
- Examples: $\mathbb{Z}_n$, $(\mathbb{Z},+)$, rotations $C_n$, permutations $S_n$, invertible matrices $GL_n$.
- **Abelian** = commutative; many important groups are not ($D_3$, $S_3$, $GL_2$).
- Facts proved from the axioms hold in *every* group: unique identity, $(ab)^{-1}=b^{-1}a^{-1}$, cancellation.
- The **order** of $g$ is the least $k$ with $g^k=e$.

Next: [symmetry groups](@math/symmetry-groups) of polygons in detail.`,
    },
  ],
  references: [
    { authors: 'D. S. Dummit, R. M. Foote', title: 'Abstract Algebra', year: 2004, venue: '3rd ed., Wiley', detail: '§1.1–1.3' },
    { authors: 'M. Artin', title: 'Algebra', year: 2011, venue: '2nd ed., Pearson', detail: 'Ch. 2 (Groups)' },
    { authors: 'N. Carter', title: 'Visual Group Theory', year: 2009, venue: 'Mathematical Association of America' },
  ],
} satisfies LessonContent;
