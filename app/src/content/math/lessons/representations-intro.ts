import type { LessonContent } from '../../types';

// Permutation representation of S₃ on ℝ³ = (line through (1,1,1)) ⊕ (plane x+y+z = 0).
// The plane is drawn in perspective (a squashed circle); the projected basis vectors form a triangle
// that the 3-cycle rotates by 120° — the 2-dimensional "standard" representation.
const tri = [0, 120, 240].map((a, i) => {
  const t = ((a - 90) * Math.PI) / 180;
  return `<circle cx="${(80 * Math.cos(t)).toFixed(1)}" cy="${(80 * Math.sin(t)).toFixed(1)}" r="9" fill="${['var(--c1)', 'var(--c2)', 'var(--c3)'][i]}"/>`;
}).join('');
const repSvg = `<svg viewBox="0 0 320 215" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="10">
  <g transform="translate(160,140) scale(1,0.38)">
    <circle r="105" fill="var(--c2)" fill-opacity="0.08" stroke="var(--c2)" stroke-dasharray="4 3"/>
    <g>
      <animateTransform attributeName="transform" type="rotate" values="0;0;120;120;240;240;360" keyTimes="0;0.22;0.33;0.55;0.66;0.88;1" dur="7.5s" repeatCount="indefinite"/>
      <polygon points="${[0, 120, 240].map((a) => { const t = ((a - 90) * Math.PI) / 180; return `${(80 * Math.cos(t)).toFixed(1)},${(80 * Math.sin(t)).toFixed(1)}`; }).join(' ')}" fill="var(--c4)" fill-opacity="0.15" stroke="var(--c4)" stroke-width="2.5"/>
      ${tri}
    </g>
  </g>
  <line x1="160" y1="140" x2="160" y2="30" stroke="var(--c5)" stroke-width="2.5"/>
  <polygon points="160,22 155,33 165,33" fill="var(--c5)"/>
  <text x="168" y="34" fill="var(--c5)">span(1,1,1): every σ fixes it</text>
  <text x="168" y="47" fill="var(--c5)">→ trivial representation (dim 1)</text>
  <text x="8" y="196" fill="var(--c2)">plane x + y + z = 0: σ acts as triangle symmetries</text>
  <text x="8" y="209" fill="var(--c2)">→ standard representation (dim 2)</text>
  <g font-size="9"><circle cx="16" cy="16" r="5" fill="var(--c1)"/><text x="25" y="19" fill="var(--fg)">e₁ projected</text>
  <circle cx="16" cy="30" r="5" fill="var(--c2)"/><text x="25" y="33" fill="var(--fg)">e₂ projected</text>
  <circle cx="16" cy="44" r="5" fill="var(--c3)"/><text x="25" y="47" fill="var(--fg)">e₃ projected</text></g>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Groups acting by matrices',
      body: String.raw`Rotating an ammonia molecule shuffles its hydrogen atoms. It also transforms its orbitals, its vibrations and its dipole moment, and all of these live in **vector spaces** and transform **linearly**. Representation theory studies a group through such linear actions.

A **representation** of a group $G$ on a vector space $V$ (over $\mathbb{C}$, unless said otherwise) is a [homomorphism](@math/homomorphisms-isomorphisms)
$$\rho: G \to GL(V), \qquad \rho(gh) = \rho(g)\rho(h),$$
where $GL(V)$ is the group of invertible linear maps $V \to V$. Choosing a basis turns each $\rho(g)$ into an invertible matrix. The **dimension** (or degree) of $\rho$ is $\dim V$.`,
    },
    {
      kind: 'recall',
      title: 'From actions to representations',
      points: [
        String.raw`An action of $G$ on a set $X$ satisfies $e\cdot x = x$ and $g\cdot(h\cdot x) = (gh)\cdot x$.`,
        'Orbits partition X. The orbit–stabiliser theorem says |G| = |Orb(x)|·|Stab(x)|.',
        String.raw`A representation is an action on a vector space in which every $g$ acts by a *linear* map.`,
        String.raw`Any action on a finite set $X$ gives a **permutation representation** on $\mathbb{C}^X$: $g$ permutes the basis vectors $e_x$.`,
      ],
      link: 'math/group-actions',
    },
    {
      kind: 'explain',
      title: 'Three representations of S₃',
      body: String.raw`Take $S_3 \cong D_3$, the symmetries of a triangle.

1. **Trivial:** $\rho(g) = 1$ for all $g$ (dimension 1).
2. **Sign:** $\rho(g) = \operatorname{sgn} g = \pm 1$ (dimension 1). Rotations give $+1$ and reflections $-1$.
3. **Standard:** each symmetry acts on the plane as a $2\times 2$ matrix: rotation by $120°$ is $\begin{pmatrix} -\tfrac12 & -\tfrac{\sqrt3}2 \\ \tfrac{\sqrt3}2 & -\tfrac12\end{pmatrix}$, and the mirror in the vertical axis is $\begin{pmatrix} -1 & 0 \\ 0 & 1 \end{pmatrix}$ (dimension 2).

There is also the **permutation representation** on $\mathbb{C}^3$, where $\sigma$ sends $e_i \mapsto e_{\sigma(i)}$. Its matrices are $3\times3$ permutation matrices.`,
    },
    {
      kind: 'widget',
      title: 'The standard representation, live',
      body: String.raw`Every press of **r** or **s** applies one of these $2\times 2$ matrices to the plane, moving the triangle. Composing presses multiplies matrices, and the Cayley table on the right is also the table of the six matrices. Because each symmetry is a *different* matrix, this representation is **faithful** (the homomorphism has trivial kernel). The sign representation is not faithful: it sends all three rotations to $+1$.`,
      widget: { type: 'SymmetryRotator', props: { n: 3, reflect: true, showTable: true } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`$D_4$ is generated by $r$ (quarter turn) and $s$ (a reflection) with $r^4 = s^2 = e$ and $srs = r^{-1}$. Which rule defines a 1-dimensional representation?`,
      choices: [
        String.raw`rotations $\mapsto 1$, reflections $\mapsto -1$`,
        String.raw`$r \mapsto i$, $s \mapsto 1$`,
        String.raw`every element $\mapsto 0$`,
        String.raw`$r \mapsto 2$, $s \mapsto 1$`,
      ],
      answer: 0,
      why: String.raw`The images must satisfy the same relations. Rotations $\mapsto 1$, reflections $\mapsto -1$ is the determinant, a homomorphism. With $r \mapsto i$, $s \mapsto 1$ we get $srs \mapsto i$ but $r^{-1} \mapsto -i$. $0$ is not invertible. $r \mapsto 2$ fails $r^4 = e$, since $2^4 = 16 \ne 1$.`,
    },
    {
      kind: 'explain',
      title: 'Invariant subspaces',
      body: String.raw`A subspace $W \subseteq V$ is **invariant** if $\rho(g)W \subseteq W$ for every $g$. Then $\rho$ restricts to a smaller representation on $W$, a **subrepresentation**. A representation $V \ne 0$ is **irreducible** (an "irrep") if its only invariant subspaces are $0$ and $V$.

Example: the permutation representation of $S_3$ on $\mathbb{C}^3$ is **reducible**.
- The line spanned by $(1,1,1)$ is invariant, since shuffling coordinates doesn't change it. This is a copy of the trivial representation.
- The plane $x + y + z = 0$ is invariant too, since shuffling keeps the sum 0. On it, $S_3$ acts as the symmetries of a triangle: the standard representation.

So $\mathbb{C}^3 = \text{trivial} \oplus \text{standard}$.`,
    },
    {
      kind: 'widget',
      title: 'Splitting ℂ³ (here drawn in ℝ³)',
      body: String.raw`The red axis is the invariant line through $(1,1,1)$. The tilted disc is the invariant plane $x+y+z = 0$. The three basis vectors, projected into the plane, form a triangle, and the 3-cycle $(1\,2\,3)$ rotates it by $120°$ (animated). No vector leaks between the two pieces.`,
      widget: { type: 'SvgDiagram', props: { svg: repSvg } },
    },
    {
      kind: 'explain',
      title: 'Maschke’s theorem: irreps are atoms',
      body: String.raw`**Theorem (Maschke).** For a finite group over $\mathbb{C}$, every finite-dimensional representation is a **direct sum of irreducible ones**.

Proof idea: *average over the group*. Start with any inner product $\langle\cdot,\cdot\rangle$ on $V$ and define
$$\langle u, v\rangle_G = \frac{1}{|G|}\sum_{g \in G} \langle \rho(g)u,\ \rho(g)v\rangle.$$
Every $\rho(g)$ preserves this new inner product. So if $W$ is invariant, its orthogonal complement $W^\perp$ is invariant too, and $V = W \oplus W^\perp$. Repeat until every piece is irreducible.

So to understand all representations of $G$, it is enough to find its irreps. This is what chemists do when they label orbitals by symmetry ([molecular orbitals](@chem/molecular-orbitals)).`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`The 2-dimensional representation of $\mathbb{Z}_n$ ($n \ge 3$) by rotation matrices $\begin{pmatrix}\cos\theta & -\sin\theta\\ \sin\theta & \cos\theta\end{pmatrix}$, $\theta = 2\pi k/n$, is irreducible over $\mathbb{C}$.`,
      answer: false,
      why: String.raw`Over $\mathbb{C}$ every rotation matrix has the eigenvectors $(1, -i)$ and $(1, i)$, with eigenvalues $e^{\pm i\theta}$. Each of these lines is invariant under all the rotations at once, so the representation splits into two 1-dimensional ones. Over $\mathbb{R}$ there are no invariant lines (for $n \ge 3$), so it *is* irreducible over $\mathbb{R}$. The field matters.`,
    },
    {
      kind: 'widget',
      title: 'Schur’s lemma',
      body: String.raw`An **intertwiner** (or $G$-map) between representations $V$ and $W$ is a linear map $T: V \to W$ with $T\rho_V(g) = \rho_W(g)T$ for all $g$: it "commutes with the symmetry". **Schur's lemma:** if $V$ and $W$ are irreducible, then $T$ is either $0$ or an isomorphism. If $V = W$ (over $\mathbb{C}$), then $T = \lambda I$ is a scalar.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`$\ker T$ is invariant: if $Tv = 0$ then $T\rho_V(g)v = \rho_W(g)Tv = 0$.`,
            String.raw`$V$ is irreducible, so $\ker T = 0$ or $V$. Likewise $\operatorname{im}T$ is invariant, so it is $0$ or $W$.`,
            String.raw`Hence either $T = 0$, or $\ker T = 0$ and $\operatorname{im} T = W$, i.e. $T$ is an isomorphism.`,
            String.raw`Now let $V = W$. Over $\mathbb{C}$, $T$ has some [eigenvalue](@math/eigenvalues) $\lambda$.`,
            String.raw`$T - \lambda I$ is also an intertwiner, and it is not invertible. So by the first part it is $0$: $T = \lambda I$. ∎`,
          ],
          notes: ['', '', '', 'This is where the complex numbers are needed.', String.raw`Consequence: irreps of an abelian group are 1-dimensional, because every $\rho(h)$ commutes with every $\rho(g)$ and so is a scalar.`],
        },
      },
    },
    {
      kind: 'multi',
      prompt: String.raw`$T: V \to W$ is an intertwiner between two irreducible complex representations. Which statements must hold?`,
      choices: [
        String.raw`$T = 0$ or $T$ is invertible`,
        String.raw`If $V = W$, then $T = \lambda I$ for some $\lambda \in \mathbb{C}$`,
        String.raw`$\ker T$ is an invariant subspace of $V$`,
        String.raw`$T$ is the identity map`,
        String.raw`$T$ is always $0$`,
      ],
      answers: [0, 1, 2],
      why: String.raw`These are exactly Schur's lemma and the first step of its proof. $T$ need not be the identity: $2I$ is an intertwiner too. It need not be zero either, since any isomorphism of representations is a non-zero intertwiner.`,
    },
    {
      kind: 'explain',
      title: 'How many irreps?',
      body: String.raw`For a finite group $G$ over $\mathbb{C}$ (proofs in [characters](@math/characters)):

- the number of irreps equals the number of **conjugacy classes** of $G$;
- if their dimensions are $d_1, \dots, d_k$, then $d_1^2 + d_2^2 + \dots + d_k^2 = |G|$.

$S_3$ has 3 classes (identity, transpositions, 3-cycles) and three irreps of dimensions $1, 1, 2$: $1 + 1 + 4 = 6$. ✓

**Why scientists care.** If a Hamiltonian commutes with a symmetry group, Schur's lemma forces energy levels to come in multiplets whose sizes are irrep dimensions. That is the origin of degeneracies in atoms and molecules. In machine learning, the layers of [equivariant networks](@ml/equivariant-networks) are intertwiners, and Schur's lemma constrains what they can be.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`$D_4$ (order 8) has five conjugacy classes and four 1-dimensional irreps. What is the dimension of its remaining irrep?`,
      answer: 2,
      why: String.raw`Five classes means five irreps. Sum of squares: $1+1+1+1+d^2 = 8$, so $d^2 = 4$ and $d = 2$. It is the 2D action of $D_4$ on the plane containing the square.`,
    },
    {
      kind: 'match',
      prompt: String.raw`Match each representation of $S_3$ to its description.`,
      pairs: [
        ['Trivial', String.raw`every $g \mapsto 1$; dimension 1`],
        ['Sign', String.raw`$\sigma \mapsto \operatorname{sgn}\sigma$; dimension 1`],
        ['Standard', 'triangle symmetries on the plane x + y + z = 0; dimension 2'],
        ['Permutation', String.raw`$e_i \mapsto e_{\sigma(i)}$ on $\mathbb{C}^3$; equals trivial ⊕ standard`],
        ['Regular', String.raw`$G$ permuting a basis $\{e_g\}$ indexed by $G$ itself; dimension 6`],
      ],
      why: String.raw`The first three are the irreps ($1^2 + 1^2 + 2^2 = 6$). The other two are reducible. The **regular** representation contains every irrep $V$ exactly $\dim V$ times: $6 = 1\cdot1 + 1\cdot1 + 2\cdot2$.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`A subspace $W$ with $\rho(g)W \subseteq W$ for all $g$ is called ___. A representation whose only such subspaces are $0$ and $V$ is ___.`,
      bank: ['invariant', 'irreducible', 'orthogonal', 'reducible', 'faithful'],
      answer: ['invariant', 'irreducible'],
      why: String.raw`Invariant subspaces are the subrepresentations. "Faithful" means something else: distinct group elements act by distinct matrices.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **representation** is a homomorphism $\rho: G \to GL(V)$: the group acting by matrices.
- **Irreducible** = no invariant subspaces except $0$ and $V$. **Maschke:** for finite groups over $\mathbb{C}$, everything is a direct sum of irreps (proved by averaging).
- **Schur's lemma:** maps that commute with the group are $0$ or isomorphisms between irreps, and scalars from an irrep to itself. So irreps of abelian groups are 1-dimensional.
- #irreps = #conjugacy classes and $\sum d_i^2 = |G|$. $S_3$: dimensions $1, 1, 2$.
- Uses: degeneracies in quantum mechanics, symmetry labels in chemistry, equivariant neural networks. Next: compute all of this with traces, the [characters](@math/characters).`,
    },
  ],
  references: [
    { authors: 'J.-P. Serre', title: 'Linear Representations of Finite Groups', year: 1977, venue: 'Springer GTM 42', detail: 'Ch. 1 (generalities, Maschke), §2.2 (Schur’s lemma)' },
    { authors: 'W. Fulton, J. Harris', title: 'Representation Theory: A First Course', year: 1991, venue: 'Springer GTM 129', detail: 'Lecture 1 (representations of finite groups; complete reducibility; Schur’s lemma; S₃)' },
    { authors: 'M. Artin', title: 'Algebra', year: 2011, venue: '2nd ed., Pearson', detail: 'Ch. 10 (group representations)' },
    { authors: 'D. S. Dummit, R. M. Foote', title: 'Abstract Algebra', year: 2004, venue: '3rd ed., Wiley', detail: '§18.1 (linear actions, Maschke’s theorem)' },
  ],
} satisfies LessonContent;
