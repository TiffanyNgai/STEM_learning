import type { LessonContent } from '../../types';

// Hilbert's hotel: every guest moves from room n to room n + 1, freeing room 1.
const W = 37, kt = '0;0.2;0.45;0.9;1';
const hotelSvg = `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <text x="160" y="16" text-anchor="middle" font-size="11" fill="var(--fg)">Every room is full. A new guest arrives…</text>
  ${Array.from({ length: 8 }, (_, i) => `<rect x="${8 + i * W}" y="60" width="${W - 4}" height="44" rx="4" fill="var(--surface-2)" stroke="var(--muted)"/>` +
    `<text x="${8 + i * W + (W - 4) / 2}" y="120" text-anchor="middle" font-size="9" fill="var(--muted)">room ${i + 1}</text>`).join('')}
  <text x="308" y="86" font-size="14" fill="var(--muted)">…</text>
  ${Array.from({ length: 8 }, (_, i) => {
    const cx = 8 + i * W + (W - 4) / 2;
    return `<g><animateTransform attributeName="transform" type="translate" values="0 0;0 0;${W} 0;${W} 0;0 0" keyTimes="${kt}" dur="7s" repeatCount="indefinite"/>` +
      `<circle cx="${cx}" cy="82" r="12" fill="var(--c2)"/><text x="${cx}" y="86" text-anchor="middle" font-size="10" font-weight="bold" fill="var(--surface)">g${i + 1}</text></g>`;
  }).join('')}
  <g><animateTransform attributeName="transform" type="translate" values="0 -50;0 -50;0 -50;0 0;0 -50" keyTimes="0;0.2;0.45;0.6;1" dur="7s" repeatCount="indefinite"/>
    <circle cx="${8 + (W - 4) / 2}" cy="82" r="12" fill="var(--c3)"/><text x="${8 + (W - 4) / 2}" y="86" text-anchor="middle" font-size="10" font-weight="bold" fill="var(--surface)">new</text>
  </g>
  <text x="160" y="142" text-anchor="middle" font-size="11" fill="var(--fg)">Guest in room n moves to room n + 1. Room 1 is free.</text>
  <text x="160" y="158" text-anchor="middle" font-size="10" fill="var(--muted)">n ↦ n + 1 is a bijection ℕ≥1 → ℕ≥2</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A hotel that is full but has room',
      body: String.raw`Imagine a hotel with infinitely many rooms $1, 2, 3, \dots$, every one occupied (a thought experiment going back to David Hilbert in the 1920s). A new guest arrives. No problem: everyone moves from room $n$ to room $n + 1$, and room 1 is free. Nobody was evicted; nobody shares.

With finite sets, "a part is smaller than the whole" is obvious. With infinite sets it **fails**. To compare infinite sizes we need a precise definition — and Georg Cantor (1870s–1890s) supplied it, with startling consequences.`,
      widget: { type: 'SvgDiagram', props: { svg: hotelSvg } },
    },
    {
      kind: 'explain',
      title: 'Same size = bijection',
      body: String.raw`Two sets $A, B$ have the **same cardinality**, written $|A| = |B|$, if there is a **bijection** $f: A \to B$ (see [sets & functions](@math/sets-functions)). For finite sets this is just counting: counting 5 apples *is* a bijection $\{1,\dots,5\} \to$ apples.

- A set is **countably infinite** if it has the same cardinality as $\mathbb{N} = \{0, 1, 2, \dots\}$: its elements can be **listed** $a_0, a_1, a_2, \dots$ with every element appearing exactly once.
- **Countable** = finite or countably infinite. **Uncountable** = not countable.

Galileo (1638) already noticed the paradox: $n \mapsto n^2$ pairs the naturals with the perfect squares, a "small" part of them. Same for evens: $n \mapsto 2n$. Their cardinality is called $\aleph_0$ ("aleph-null").`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Which map is a bijection from $\mathbb{N} = \{0, 1, 2, \dots\}$ to $\mathbb{Z}$?`,
      choices: [
        String.raw`$f(n) = n - 5$`,
        String.raw`$f(n) = -n$`,
        String.raw`$f(n) = n/2$ if $n$ is even, $-(n+1)/2$ if $n$ is odd`,
        String.raw`$f(n) = n^2$`,
      ],
      answer: 2,
      why: String.raw`It lists $\mathbb{Z}$ as $0, -1, 1, -2, 2, -3, \dots$: evens go to $0, 1, 2, \dots$ and odds to $-1, -2, \dots$, hitting each integer exactly once. $n - 5$ misses $-6, -7, \dots$; $-n$ misses the positives; $n^2$ misses most integers. So $|\mathbb{Z}| = |\mathbb{N}|$.`,
    },
    {
      kind: 'widget',
      title: 'Even a grid is countable',
      body: String.raw`$\mathbb{N}\times\mathbb{N}$ looks "infinitely bigger" than $\mathbb{N}$. But walk it **diagonal by diagonal** ($m + n = 2$, then $3$, then $4$, …): each diagonal is finite, so every pair $(m, n)$ is reached after finitely many steps and gets a position number. That is a bijection with the positive integers. (Here we index from $1$.)`,
      widget: { type: 'MathZigzag', props: { size: 6, mode: 'pairs' } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`In the diagonal walk above (diagonals $m + n = 2, 3, 4, \dots$; within a diagonal, $m$ increases), what position number does the pair $(2, 3)$ get?`,
      answer: 8,
      why: String.raw`Diagonals before $m + n = 5$ contain $1 + 2 + 3 = 6$ pairs. On diagonal $5$ the order is $(1,4)$ #7, $(2,3)$ #8. General formula: position $= \frac{(s-2)(s-1)}{2} + m$ with $s = m + n$.`,
    },
    {
      kind: 'widget',
      title: 'The rationals are countable',
      body: String.raw`Put $p/q$ in row $p$, column $q$. Every positive rational appears (many times: $1/2 = 2/4$). Walk the diagonals and **skip** fractions not in lowest terms: every positive rational gets exactly one number. Interleave $0$ and the negatives as we did for $\mathbb{Z}$, and $|\mathbb{Q}| = \aleph_0$ — even though between any two rationals there are infinitely many more.`,
      widget: { type: 'MathZigzag', props: { size: 6, mode: 'rationals' } },
    },
    {
      kind: 'widget',
      title: 'Cantor’s diagonal argument',
      body: String.raw`Now the shock (Cantor, 1891). Let $S$ be the set of all infinite sequences of 0s and 1s. **Claim:** $S$ is uncountable.

Suppose some list $s_1, s_2, s_3, \dots$ contained them all. Build a new sequence $d$ by **flipping the diagonal**: the $k$-th digit of $d$ is the opposite of the $k$-th digit of $s_k$. Then $d \ne s_k$ for every $k$ — they differ in position $k$. So $d$ is missing from the list. Every list misses something: no list is complete.`,
      widget: { type: 'MathDiagonal', props: { rows: 6 } },
    },
    {
      kind: 'order',
      prompt: 'Put the diagonal argument in order.',
      steps: [
        String.raw`Suppose, for contradiction, that $s_1, s_2, s_3, \dots$ lists every 0/1 sequence.`,
        String.raw`Define $d$ by: digit $k$ of $d$ = $1 -$ (digit $k$ of $s_k$).`,
        String.raw`For each $k$, $d$ and $s_k$ differ in digit $k$, so $d \ne s_k$.`,
        String.raw`So $d$ is a 0/1 sequence not on the list — contradiction.`,
        'Hence the set of 0/1 sequences is uncountable. ∎',
      ],
      why: 'Proof by contradiction with a constructed witness: assume a complete list, use the list itself to build an object it cannot contain.',
    },
    {
      kind: 'truefalse',
      prompt: String.raw`The fix is easy: just add $d$ to the front of the list. Then the new list contains every 0/1 sequence.`,
      answer: false,
      why: String.raw`The argument applies to **any** list, including the new one: flipping its diagonal produces a fresh $d'$ that is missing. The theorem is not "this list is incomplete" but "every list is incomplete".`,
    },
    {
      kind: 'explain',
      title: 'So the real numbers are uncountable',
      body: String.raw`The same trick works for decimals. Suppose $x_1, x_2, \dots$ listed all reals in $(0, 1)$. Build $y = 0.y_1y_2y_3\ldots$ where $y_k = 5$ if the $k$-th digit of $x_k$ is not $5$, and $y_k = 4$ if it is. Then $y \ne x_k$ for all $k$.

One subtlety: some reals have two decimal expansions ($0.0999\ldots = 0.1000\ldots$). Using only the digits 4 and 5 makes $y$'s expansion unique (no tail of 0s or 9s), so differing in a digit really means being a different number.

Hence $|\mathbb{R}| > |\mathbb{N}|$: there are **different sizes of infinity**. $|\mathbb{R}|$ is called the **continuum**, $\mathfrak{c}$, and in fact $\mathfrak{c} = 2^{\aleph_0}$, the cardinality of the 0/1 sequences. (Cantor first proved $\mathbb{R}$ uncountable in 1874, by a different argument.)`,
    },
    {
      kind: 'widget',
      title: 'Cantor’s theorem: no largest infinity',
      body: String.raw`The diagonal idea, distilled: **for every set $A$, there is no surjection $A \to \mathcal{P}(A)$**, so $|A| < |\mathcal{P}(A)|$. Applying this repeatedly gives $|\mathbb{N}| < |\mathcal{P}(\mathbb{N})| < |\mathcal{P}(\mathcal{P}(\mathbb{N}))| < \cdots$ — an endless tower of infinities.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Let $f: A \to \mathcal{P}(A)$ be any function. So each $a$ is assigned a subset $f(a) \subseteq A$.`,
            String.raw`Define the "diagonal" set $D = \{a \in A : a \notin f(a)\}$.`,
            String.raw`Suppose $D = f(d)$ for some $d \in A$. Ask: is $d \in D$?`,
            String.raw`If $d \in D$, then by definition $d \notin f(d) = D$. If $d \notin D = f(d)$, then by definition $d \in D$. Either way, a contradiction.`,
            String.raw`So $D$ is not in the image: $f$ is not surjective. Since $a \mapsto \{a\}$ is injective, $|A| < |\mathcal{P}(A)|$. ∎`,
          ],
          notes: ['', 'D differs from f(a) "at a" — exactly like flipping the k-th digit of s_k.', '', 'The same self-reference powers Russell’s paradox and Turing’s halting problem.', ''],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Let $A = \{1, 2, 3\}$ and $f(1) = \{1, 2\}$, $f(2) = \{3\}$, $f(3) = \varnothing$. What is $D = \{a \in A : a \notin f(a)\}$?`,
      choices: [String.raw`$\{1\}$`, String.raw`$\{2, 3\}$`, String.raw`$\{1, 2, 3\}$`, String.raw`$\varnothing$`],
      answer: 1,
      why: String.raw`$1 \in f(1)$, so $1 \notin D$. $2 \notin \{3\}$, so $2 \in D$. $3 \notin \varnothing$, so $3 \in D$. And indeed $D = \{2,3\}$ is none of $f(1), f(2), f(3)$, as the theorem guarantees.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these sets are countable?',
      choices: [
        String.raw`$\mathbb{Z}$`,
        String.raw`$\mathbb{Q}$`,
        String.raw`$\mathbb{R}$`,
        'The set of all finite strings of 0s and 1s',
        'The set of all infinite sequences of 0s and 1s',
        String.raw`$\mathcal{P}(\mathbb{N})$`,
      ],
      answers: [0, 1, 3],
      why: String.raw`Finite strings can be listed by length (length 0, then the 2 of length 1, then the 4 of length 2, …). Infinite sequences are uncountable by the diagonal argument; $\mathcal{P}(\mathbb{N})$ is too (a subset of $\mathbb{N}$ ↔ its 0/1 indicator sequence), and so is $\mathbb{R}$.`,
    },
    {
      kind: 'match',
      prompt: 'Match each set with its cardinality.',
      pairs: [
        [String.raw`$\{1, 2, \dots, 10\}$`, String.raw`$10$`],
        [String.raw`$\mathbb{Q}$`, String.raw`$\aleph_0$`],
        [String.raw`$\mathbb{R}$`, String.raw`$\mathfrak{c} = 2^{\aleph_0}$`],
        [String.raw`$\mathcal{P}(\mathbb{R})$`, String.raw`$2^{\mathfrak{c}}$, strictly bigger than $\mathfrak{c}$`],
      ],
      why: String.raw`$\mathbb{Q}$ is countable (zig-zag). $\mathbb{R}$ has the cardinality of 0/1 sequences, $2^{\aleph_0}$. Cantor's theorem applied to $\mathbb{R}$ gives $|\mathcal{P}(\mathbb{R})| = 2^{\mathfrak{c}} > \mathfrak{c}$.`,
    },
    {
      kind: 'explain',
      title: 'An unanswerable question',
      body: String.raw`Is there a set strictly bigger than $\mathbb{N}$ but strictly smaller than $\mathbb{R}$? Cantor conjectured **no** — the **continuum hypothesis** (CH) — and could not prove it. It was the first problem on Hilbert's famous 1900 list.

The answer is astonishing: **neither CH nor its negation can be proved** from the standard axioms of set theory (ZFC), assuming those axioms are consistent. Kurt Gödel (1940) showed CH cannot be disproved; Paul Cohen (1963) showed it cannot be proved, inventing the method of *forcing* (Fields Medal, 1966).`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $|A| = |B|$ means a **bijection** exists. Infinite sets can match proper subsets of themselves (Hilbert's hotel, Galileo).
- **Countable**: listable. $\mathbb{N}$, $\mathbb{Z}$, $\mathbb{N}\times\mathbb{N}$, $\mathbb{Q}$ all have cardinality $\aleph_0$ (zig-zag walks).
- **Cantor's diagonal argument**: 0/1 sequences, and hence $\mathbb{R}$, are **uncountable**.
- **Cantor's theorem**: $|A| < |\mathcal{P}(A)|$ for every set — no largest infinity.
- The continuum hypothesis is independent of ZFC (Gödel, Cohen).

These tools reappear in [real analysis](@math/real-numbers-completeness), measure theory and computability.`,
    },
  ],
  references: [
    { authors: 'G. Cantor', title: 'Über eine elementare Frage der Mannigfaltigkeitslehre', year: 1891, venue: 'Jahresbericht der Deutschen Mathematiker-Vereinigung 1, 75–78' },
    { authors: 'G. Cantor', title: 'Über eine Eigenschaft des Inbegriffes aller reellen algebraischen Zahlen', year: 1874, venue: 'Journal für die reine und angewandte Mathematik 77, 258–262' },
    { authors: 'R. Hammack', title: 'Book of Proof', year: 2018, venue: '3rd ed., self-published (free online)', detail: 'Ch. 14 (Cardinality of sets)', url: 'https://richardhammack.github.io/BookOfProof/' },
    { authors: 'D. J. Velleman', title: 'How to Prove It: A Structured Approach', year: 2019, venue: '3rd ed., Cambridge University Press', detail: 'Ch. 8 (Infinite sets)' },
    { authors: 'P. J. Cohen', title: 'The independence of the continuum hypothesis', year: 1963, venue: 'Proceedings of the National Academy of Sciences 50(6), 1143–1148' },
  ],
} satisfies LessonContent;
