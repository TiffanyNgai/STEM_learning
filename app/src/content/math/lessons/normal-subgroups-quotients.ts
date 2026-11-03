import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Dividing a group',
      body: String.raw`Clock arithmetic $\mathbb{Z}_{12}$ is what you get from the integers when you declare that multiples of 12 "count as zero". Each element of $\mathbb{Z}_{12}$ is really a whole coset $r + 12\mathbb{Z}$, and we add cosets by adding representatives: $(r + 12\mathbb{Z}) + (s + 12\mathbb{Z}) = (r+s) + 12\mathbb{Z}$.

Can we do this for **any** group $G$ and subgroup $H$, and multiply cosets by $(aH)(bH) = abH$? The danger is that the answer could depend on which representatives $a$, $b$ we picked. When it doesn't, the cosets form a new group: the **quotient** $G/H$.`,
    },
    {
      kind: 'recall',
      title: 'Cosets, briefly',
      points: [
        String.raw`For a subgroup $H \le G$ and $a \in G$, the left coset is $aH = \{ah : h \in H\}$; the right coset is $Ha$.`,
        String.raw`Left cosets partition $G$ into pieces of equal size $|H|$; there are $[G:H] = |G|/|H|$ of them.`,
        String.raw`$aH = bH \iff a^{-1}b \in H$, so "same coset" is an [equivalence relation](@math/relations-equivalence).`,
        String.raw`Fibres of a homomorphism are the cosets of its kernel ([homomorphisms](@math/homomorphisms-isomorphisms)).`,
      ],
      link: 'math/subgroups-lagrange',
    },
    {
      kind: 'explain',
      title: 'Normal subgroups',
      body: String.raw`A subgroup $N \le G$ is **normal**, written $N \trianglelefteq G$, if
$$gNg^{-1} = N \quad \text{for every } g \in G,$$
or equivalently $gN = Ng$: left and right cosets agree. Here $gNg^{-1} = \{gng^{-1} : n \in N\}$ is $N$ "seen from the point of view of $g$" (conjugated by $g$).

**Theorem.** The coset product $(aN)(bN) = abN$ is well defined exactly when $N$ is normal.

Examples: every subgroup of an abelian group is normal; every kernel is normal, since $\varphi(gng^{-1}) = \varphi(g)\,e\,\varphi(g)^{-1} = e$. Non-example: in $D_3$, $H = \{e, s\}$ is not normal, because $r s r^{-1} = r^2 s \notin H$.`,
    },
    {
      kind: 'widget',
      title: 'Normal: the table falls into blocks',
      body: String.raw`Here is the Cayley table of $D_3$, with rows and columns grouped into the cosets of the rotations $H = \langle r \rangle$. Each cell is coloured by the coset its product lies in. Every block is **one colour**: "rotation-coset times reflection-coset" always lands in the same coset. Shrink each block to a single cell and you get the $2\times 2$ table of $G/H \cong \mathbb{Z}_2$, shown underneath. Now press **{e, s}**.`,
      widget: { type: 'MathCosetCayley', props: { group: 'D', n: 3, sub: 0 } },
    },
    {
      kind: 'widget',
      title: 'Not normal: the blocks are mixed',
      body: String.raw`In $D_3$ with $H = \{e, s\}$ the cosets are $H$, $rH = \{r, rs\}$ and $r^2H = \{r^2, r^2 s\}$. Now the blocks contain several colours. For example $r \in rH$ and $rs \in rH$, but $r\cdot r = r^2$ and $rs \cdot r = s$ lie in different cosets. So "$rH \cdot rH$" has no single answer, and there is no quotient group. Try $D_4$ below and its subgroups: which ones are normal?`,
      widget: { type: 'MathCosetCayley', props: { group: 'D', n: 4, sub: 2 } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Which subgroup of $D_4$ is **not** normal?`,
      choices: [String.raw`$\{e, s\}$, a single reflection`, String.raw`$\{e, r^2\}$, the half-turn`, String.raw`$\langle r\rangle$, the four rotations`, String.raw`$D_4$ itself`],
      answer: 0,
      why: String.raw`$r s r^{-1} = r^2 s \ne s$, so conjugating moves the reflection out of $\{e, s\}$. The half-turn $r^2$ commutes with everything, so $\{e, r^2\}$ is normal. $\langle r \rangle$ has index 2 (always normal), and $G$ is always normal in itself.`,
    },
    {
      kind: 'explain',
      title: 'The quotient group G/N',
      body: String.raw`If $N \trianglelefteq G$, the set of cosets $G/N$ is a group with
$$(aN)(bN) = abN, \qquad \text{identity } N, \qquad (aN)^{-1} = a^{-1}N,$$
and $|G/N| = [G:N] = |G|/|N|$. You can think of it as $G$ "viewed at low resolution", where everything in $N$ is blurred to the identity.

- $\mathbb{Z}/n\mathbb{Z} \cong \mathbb{Z}_n$.
- $D_n / \langle r \rangle \cong \mathbb{Z}_2$: only "flipped or not" survives.
- $\mathbb{R}/\mathbb{Z}$ = real numbers where only the fractional part counts. It is a circle: angles measured in full turns.`,
    },
    {
      kind: 'widget',
      title: 'A cyclic quotient',
      body: String.raw`$\mathbb{Z}_{12}$ is abelian, so every subgroup is normal and every choice gives clean blocks. With $H = \langle 4 \rangle = \{0, 4, 8\}$ there are $12/3 = 4$ cosets, and the quotient table is the table of $\mathbb{Z}_4$. Try $\langle 2\rangle$, $\langle 3\rangle$ and $\langle 6\rangle$, and predict the quotient's size before you press.`,
      widget: { type: 'MathCosetCayley', props: { group: 'Z', n: 12, sub: 2 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`In $\mathbb{Z}_{12}/\langle 4\rangle$, what is the order of the coset $2 + \langle 4 \rangle$?`,
      answer: 2,
      why: String.raw`Add $2$ to itself until you land in $\langle 4\rangle = \{0,4,8\}$: $2 \notin$, but $2+2 = 4 \in \langle 4\rangle$. So the order is 2. The coset $1 + \langle 4\rangle$ would have order 4 and generates the whole quotient $\cong \mathbb{Z}_4$.`,
    },
    {
      kind: 'widget',
      title: 'The first isomorphism theorem',
      body: String.raw`**Theorem.** If $\varphi: G \to H$ is a homomorphism, then $\ker\varphi \trianglelefteq G$ and
$$G/\ker\varphi \;\cong\; \operatorname{im}\varphi, \qquad g\ker\varphi \mapsto \varphi(g).$$
In words: a homomorphism is "divide by the kernel, then relabel". Write $K = \ker\varphi$.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Define $\bar\varphi(gK) = \varphi(g)$.`,
            String.raw`**Well defined:** if $gK = g'K$ then $g' = gk$ with $k \in K$, so $\varphi(g') = \varphi(g)\varphi(k) = \varphi(g)$.`,
            String.raw`**Homomorphism:** $\bar\varphi(gK\cdot g'K) = \bar\varphi(gg'K) = \varphi(gg') = \varphi(g)\varphi(g')$.`,
            String.raw`**Injective:** $\bar\varphi(gK) = e \Rightarrow g \in K \Rightarrow gK = K$, the identity of $G/K$.`,
            String.raw`**Surjective onto $\operatorname{im}\varphi$:** by definition every $\varphi(g)$ is hit. So $\bar\varphi$ is an isomorphism $G/K \to \operatorname{im}\varphi$. ∎`,
          ],
          notes: ['', 'This is exactly where normality (via the kernel) is used.', '', 'Trivial kernel ⇔ injective, applied to the quotient.', String.raw`Corollary: $|G| = |\ker\varphi|\cdot|\operatorname{im}\varphi|$ for finite $G$.`],
        },
      },
    },
    {
      kind: 'truefalse',
      prompt: 'Every subgroup of index 2 is normal.',
      answer: true,
      why: String.raw`With only two cosets, the left cosets are $N$ and "everything else", and so are the right cosets. So $gN = Ng$ for every $g$. This is why the rotations are normal in $D_n$, and why $A_n$ is normal in $S_n$ ([permutation groups](@math/permutation-groups)).`,
    },
    {
      kind: 'match',
      prompt: 'Use the first isomorphism theorem: match each quotient to a group it is isomorphic to.',
      pairs: [
        [String.raw`$\mathbb{Z}/n\mathbb{Z}$`, String.raw`$\mathbb{Z}_n$ (reduction mod $n$)`],
        [String.raw`$GL_n(\mathbb{R})/SL_n(\mathbb{R})$`, String.raw`$\mathbb{R}^\times$ (via $\det$)`],
        [String.raw`$D_n/\langle r\rangle$`, String.raw`$\{\pm 1\} \cong \mathbb{Z}_2$ (rotation or reflection)`],
        [String.raw`$\mathbb{R}/\mathbb{Z}$`, String.raw`the unit circle $\{z \in \mathbb{C} : |z| = 1\}$ (via $x \mapsto e^{2\pi i x}$)`],
      ],
      why: String.raw`In each case find a surjective homomorphism whose kernel is the subgroup you divide by. For example $x \mapsto e^{2\pi i x}$ maps $\mathbb{R}$ onto the circle with kernel exactly $\mathbb{Z}$.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Which subgroups are **always** normal in $G$?`,
      choices: [
        'The kernel of any homomorphism out of G',
        'Any subgroup, when G is abelian',
        String.raw`The trivial subgroup $\{e\}$`,
        'Any subgroup of order 2',
        String.raw`Any subgroup of index 2`,
      ],
      answers: [0, 1, 2, 4],
      why: String.raw`Kernels are closed under conjugation. In an abelian group $gng^{-1} = n$. $\{e\}$ is trivially normal, and index-2 subgroups are normal by the left/right-coset argument. But a subgroup of *order* 2 need not be normal: $\{e, s\}$ in $D_3$.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`$N$ is normal when $gN = $ ___ for all $g$. Then cosets multiply by $(aN)(bN) = $ ___, and $|G/N| = $ ___.`,
      bank: [String.raw`$Ng$`, String.raw`$N$`, String.raw`$abN$`, String.raw`$baN$`, String.raw`$|G|/|N|$`, String.raw`$|G|\cdot|N|$`],
      answer: [String.raw`$Ng$`, String.raw`$abN$`, String.raw`$|G|/|N|$`],
      why: String.raw`Left cosets equal right cosets is the defining property. Multiply representatives in their given order ($baN$ would differ for non-abelian $G$). The number of cosets is the index, $|G|/|N|$ by Lagrange.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $N \trianglelefteq G$ (normal) means $gNg^{-1} = N$, i.e. left cosets = right cosets.
- Normality is exactly what makes $(aN)(bN) = abN$ well defined. Then $G/N$ is a group of order $|G|/|N|$.
- In the Cayley table, normal subgroups show up as **single-coloured blocks**: the block pattern *is* the quotient table.
- Kernels, subgroups of abelian groups and index-2 subgroups are normal.
- **First isomorphism theorem:** $G/\ker\varphi \cong \operatorname{im}\varphi$.
- A non-trivial group with no normal subgroups except $\{e\}$ and itself is **simple**. Simple groups are the "atoms" behind [Galois theory](@math/galois-intro).

The same construction with two operations gives quotient rings like $\mathbb{Z}/n\mathbb{Z}$: [rings and fields](@math/rings-fields).`,
    },
  ],
  references: [
    { authors: 'D. S. Dummit, R. M. Foote', title: 'Abstract Algebra', year: 2004, venue: '3rd ed., Wiley', detail: '§3.1 (quotient groups and homomorphisms), §3.3 (isomorphism theorems)' },
    { authors: 'M. Artin', title: 'Algebra', year: 2011, venue: '2nd ed., Pearson', detail: 'Ch. 2 (normal subgroups, quotient groups, first isomorphism theorem)' },
    { authors: 'J. B. Fraleigh', title: 'A First Course in Abstract Algebra', year: 2003, venue: '7th ed., Addison-Wesley', detail: 'Factor groups; the fundamental homomorphism theorem' },
    { authors: 'N. Carter', title: 'Visual Group Theory', year: 2009, venue: 'Mathematical Association of America' },
  ],
} satisfies LessonContent;
