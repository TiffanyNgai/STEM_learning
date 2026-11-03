import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Shuffles form a group',
      body: String.raw`A **permutation** of $\{1, \dots, n\}$ is a bijection $\sigma: \{1,\dots,n\} \to \{1,\dots,n\}$, i.e. a shuffle. All of them together, with composition as the operation, form the **symmetric group** $S_n$. It has $n!$ elements: $n$ choices for $\sigma(1)$, then $n-1$ for $\sigma(2)$, and so on.

**Two-line notation** lists each input above its image:
$$\sigma = \begin{pmatrix} 1 & 2 & 3 & 4 & 5 & 6 \\ 3 & 4 & 5 & 2 & 1 & 6 \end{pmatrix}.$$
We compose like functions, right to left: $\sigma\tau$ means "first $\tau$, then $\sigma$". By [Cayley's theorem](@math/homomorphisms-isomorphisms), every finite group sits inside some $S_n$, so permutation groups are, in a sense, all groups.`,
    },
    {
      kind: 'explain',
      title: 'Cycle notation',
      body: String.raw`Follow where $1$ goes in the $\sigma$ above: $1 \to 3 \to 5 \to 1$. Then $2 \to 4 \to 2$, and $6$ stays put. We write
$$\sigma = (1\,3\,5)(2\,4).$$
A **$k$-cycle** $(a_1\,a_2\,\dots\,a_k)$ sends $a_1 \to a_2 \to \dots \to a_k \to a_1$ and fixes everything else. Fixed points are usually left out.

**Fact:** every permutation is a product of **disjoint** cycles (no shared entries), uniquely up to their order. Disjoint cycles commute. The list of cycle lengths is the **cycle type**. The **order** of $\sigma$ is the lcm (least common multiple) of the cycle lengths: here $\mathrm{lcm}(3, 2) = 6$.`,
    },
    {
      kind: 'widget',
      title: 'See the cycles',
      body: String.raw`Each arrow goes $i \to \sigma(i)$. Disjoint cycles have different colours, and a fixed point has a small loop. Press **Play** to watch the tokens move along their cycles. After 6 steps every token is back home, because the order is 6. The panel also shows the **sign**, which is explained next.`,
      widget: { type: 'MathPermutationCycles', props: { n: 6, perm: [3, 4, 5, 2, 1, 6] } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`What is the order of the permutation of $\{1,\dots,9\}$ with one-line images $\sigma(1),\dots,\sigma(9) = 2, 3, 4, 1, 6, 5, 8, 9, 7$?`,
      answer: 12,
      why: String.raw`Follow the arrows: $1\to2\to3\to4\to1$ (a 4-cycle), $5 \to 6 \to 5$ (a 2-cycle), $7\to8\to9\to7$ (a 3-cycle). So $\sigma = (1\,2\,3\,4)(5\,6)(7\,8\,9)$, with order $\mathrm{lcm}(4,2,3) = 12$. Multiplying the lengths ($24$) is the common mistake.`,
    },
    {
      kind: 'explain',
      title: 'Transpositions and the sign',
      body: String.raw`A **transposition** is a 2-cycle $(a\,b)$: swap two things. Every permutation is a product of transpositions, for example
$$(a_1\,a_2\,\dots\,a_k) = (a_1\,a_k)(a_1\,a_{k-1})\cdots(a_1\,a_2),$$
which uses $k-1$ transpositions (check: $(1\,2\,3) = (1\,3)(1\,2)$, applying $(1\,2)$ first).

The number of transpositions you use is not unique, but its **parity** (even or odd) is. So the **sign** is well defined:
$$\operatorname{sgn}\sigma = (-1)^{\#\text{transpositions}} = (-1)^{\,n - c(\sigma)},$$
where $c(\sigma)$ counts the cycles, *including* fixed points. Even permutations have sign $+1$ and odd ones $-1$. Moreover, $\operatorname{sgn}(\sigma\tau) = \operatorname{sgn}\sigma\,\operatorname{sgn}\tau$: the sign is a homomorphism $S_n \to \{\pm1\}$.`,
    },
    {
      kind: 'widget',
      title: 'Every swap flips the parity',
      body: String.raw`Start from the identity (6 cycles of length 1, even). Tap two points to swap them. Each swap either **merges** two cycles into one or **splits** one cycle into two. Either way $c$ changes by exactly 1, so the parity flips. This is the whole proof that the sign is well defined: after $m$ swaps, $(-1)^{n-c} = (-1)^m$.`,
      widget: { type: 'MathPermutationCycles', props: { n: 6, animate: false } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`What is the sign of the 5-cycle $(1\,2\,3\,4\,5)$?`,
      choices: [String.raw`$+1$ (even)`, String.raw`$-1$ (odd)`, String.raw`It depends on the ambient $n$`, 'It is not defined for cycles'],
      answer: 0,
      why: String.raw`A $k$-cycle is a product of $k - 1$ transpositions, here $4$, so it is even. The guess "5 is odd so it is odd" mixes up the length with the number of swaps. Adding extra fixed points (bigger $n$) adds a cycle for each new point too, so $n - c$ stays the same.`,
    },
    {
      kind: 'explain',
      title: 'Parity in the wild',
      body: String.raw`- **Sam Loyd's 15 puzzle.** Take the solved $4\times4$ sliding puzzle and swap only the tiles 14 and 15. That position cannot be solved. Each slide is a transposition with the blank square. To bring the blank back to its corner it must move equally often left and right, and equally often up and down, so the total number of moves is even. But a single swap of 14 and 15 is odd.
- **Determinants.** $\det A = \sum_{\sigma \in S_n} \operatorname{sgn}(\sigma)\, a_{1\sigma(1)}\cdots a_{n\sigma(n)}$. Swapping two rows flips the sign of the [determinant](@math/determinants) for exactly this reason.
- **Fermions.** A wavefunction of identical fermions picks up $\operatorname{sgn}\sigma$ when particles are permuted ([identical particles](@quantum/identical-particles)). This gives the Pauli principle.`,
    },
    {
      kind: 'explain',
      title: 'The alternating group',
      body: String.raw`The even permutations form the **alternating group** $A_n = \ker(\operatorname{sgn})$. As a kernel it is a [normal subgroup](@math/normal-subgroups-quotients), of index 2, so $|A_n| = n!/2$ and $S_n/A_n \cong \{\pm1\}$.

- $A_3 \cong \mathbb{Z}_3$: the 3-cycles and $e$.
- $A_4$ (12 elements) is the rotation group of a regular tetrahedron.
- $A_5$ (60 elements) is the rotation group of the icosahedron. It is **simple**: its only normal subgroups are $\{e\}$ and $A_5$. In fact $A_n$ is simple for every $n \ge 5$.

That simplicity is the group-theoretic reason why there is [no formula for the quintic](@math/galois-intro).`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Which permutations are **even** (lie in $A_n$)?`,
      choices: [String.raw`$(1\,2\,3)$`, String.raw`$(1\,2)$`, String.raw`$(1\,2)(3\,4)$`, String.raw`$(1\,2\,3\,4)$`, 'the identity'],
      answers: [0, 2, 4],
      why: String.raw`Count transpositions: $(1\,2\,3)$ needs 2 and $(1\,2)(3\,4)$ needs 2, both even. The identity needs 0. A transposition is odd, and the 4-cycle needs 3, so it is odd too. In general, cycles of **even** length are **odd** permutations.`,
    },
    {
      kind: 'explain',
      title: 'Conjugation relabels',
      body: String.raw`In $S_n$, conjugating by $\tau$ just renames the entries of the cycles:
$$\tau\,(a_1\,a_2\,\dots\,a_k)\,\tau^{-1} = (\tau(a_1)\,\tau(a_2)\,\dots\,\tau(a_k)).$$
So two permutations are **conjugate** (that is, $\rho = \tau\sigma\tau^{-1}$ for some $\tau$) exactly when they have the **same cycle type**. The conjugacy classes of $S_n$ therefore correspond to the ways of writing $n$ as a sum of positive integers. For $S_4$ these are $1{+}1{+}1{+}1$, $2{+}1{+}1$, $2{+}2$, $3{+}1$ and $4$, giving 5 classes.

Conjugacy classes will be the columns of [character tables](@math/characters).`,
    },
    {
      kind: 'match',
      prompt: String.raw`Match each conjugacy class of $S_4$ to its number of elements.`,
      pairs: [
        ['The identity', '1'],
        [String.raw`Transpositions like $(1\,2)$`, '6'],
        [String.raw`Double transpositions like $(1\,2)(3\,4)$`, '3'],
        [String.raw`3-cycles like $(1\,2\,3)$`, '8'],
      ],
      why: String.raw`Transpositions: choose 2 of 4, $\binom42 = 6$. Double transpositions: split 4 points into two pairs, $3$ ways. 3-cycles: choose the 3 points (4 ways), then 2 cyclic orders, so 8. Together with the six 4-cycles: $1+6+3+8+6 = 24 = 4!$.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`$A_n$ is a normal subgroup of $S_n$.`,
      answer: true,
      why: String.raw`$A_n$ is the kernel of the sign homomorphism, and kernels are always normal. Also it has index 2. Concretely, $\operatorname{sgn}(\tau\sigma\tau^{-1}) = \operatorname{sgn}\sigma$, so conjugation keeps even permutations even.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`A $k$-cycle is a product of ___ transpositions, so it is an even permutation exactly when $k$ is ___.`,
      bank: [String.raw`$k-1$`, String.raw`$k$`, String.raw`$k+1$`, 'odd', 'even'],
      answer: [String.raw`$k-1$`, 'odd'],
      why: String.raw`$(a_1\,\dots\,a_k) = (a_1\,a_k)\cdots(a_1\,a_2)$ uses $k-1$ swaps. That number is even when $k$ is odd. So 3-cycles are even and 4-cycles are odd.`,
    },
    {
      kind: 'order',
      prompt: 'Put the steps for computing the sign of a permutation in order.',
      steps: [
        'Write the permutation in two-line (or one-line) notation.',
        'Follow arrows to split it into disjoint cycles.',
        'Count the cycles c, including fixed points.',
        String.raw`Compute $\operatorname{sgn} = (-1)^{n - c}$.`,
      ],
      why: String.raw`The cycle decomposition is the key step. Each cycle of length $\ell$ contributes $\ell - 1$ transpositions, and summing gives $n - c$. Forgetting fixed points when counting $c$ (while still using $n$) is the classic slip.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $S_n$ = all permutations of $n$ objects, $|S_n| = n!$. Every finite group embeds in some $S_n$.
- Every permutation is a product of **disjoint cycles**. Its order is the lcm of the cycle lengths.
- **Sign:** $\operatorname{sgn}\sigma = (-1)^{n-c}$ is a homomorphism to $\{\pm1\}$. A $k$-cycle has sign $(-1)^{k-1}$.
- $A_n = \ker\operatorname{sgn}$ has order $n!/2$ and is normal. $A_n$ is simple for $n \ge 5$.
- Conjugate $\iff$ same cycle type. Classes of $S_n$ correspond to partitions of $n$.`,
    },
  ],
  references: [
    { authors: 'D. S. Dummit, R. M. Foote', title: 'Abstract Algebra', year: 2004, venue: '3rd ed., Wiley', detail: '§1.3 (symmetric groups), §3.5 (transpositions and the alternating group), §4.3 (conjugacy in Sₙ), §4.6 (simplicity of Aₙ)' },
    { authors: 'M. Artin', title: 'Algebra', year: 2011, venue: '2nd ed., Pearson', detail: 'Ch. 1 (permutations and the sign), Ch. 7 (conjugation in the symmetric group)' },
    { authors: 'J. B. Fraleigh', title: 'A First Course in Abstract Algebra', year: 2003, venue: '7th ed., Addison-Wesley', detail: 'Groups of permutations; orbits, cycles and the alternating groups' },
  ],
} satisfies LessonContent;
