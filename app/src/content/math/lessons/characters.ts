import type { LessonContent } from '../../types';

// Character table of S₃ ≅ C₃ᵥ, with Mulliken labels; rows pulse in turn.
const rows: [string, string, string[], string][] = [
  ['trivial', 'A₁', ['1', '1', '1'], 'z'],
  ['sign', 'A₂', ['1', '1', '−1'], 'R_z'],
  ['standard', 'E', ['2', '−1', '0'], '(x, y)'],
];
const tableSvg = `<svg viewBox="0 0 320 175" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="10">
  <text x="8" y="18" fill="var(--muted)">S₃ class</text>
  <text x="8" y="32" fill="var(--muted)">C₃ᵥ (NH₃)</text>
  ${['e', '3-cycles', 'transpositions'].map((t, j) => `<text x="${135 + j * 55}" y="18" text-anchor="middle" fill="var(--muted)" font-size="9">${t}</text>`).join('')}
  ${['E', '2C₃', '3σᵥ'].map((t, j) => `<text x="${135 + j * 55}" y="32" text-anchor="middle" fill="var(--fg)" font-weight="bold">${t}</text>`).join('')}
  <text x="296" y="32" text-anchor="middle" fill="var(--muted)" font-size="9">basis</text>
  <line x1="6" y1="40" x2="314" y2="40" stroke="var(--fg)"/>
  <line x1="104" y1="6" x2="104" y2="138" stroke="var(--fg)"/>
  ${rows.map(([nm, mul, vals, basis], i) => {
    const y = 62 + i * 28;
    return `<g><rect x="6" y="${y - 16}" width="308" height="24" rx="5" fill="var(--c${i + 1})" fill-opacity="0.08"><animate attributeName="fill-opacity" values="0.08;0.08;0.35;0.08;0.08" keyTimes="0;${(i / 3).toFixed(2)};${(i / 3 + 0.15).toFixed(2)};${(i / 3 + 0.3).toFixed(2)};1" dur="6s" repeatCount="indefinite"/></rect>
      <text x="12" y="${y}" fill="var(--fg)">${nm}</text><text x="80" y="${y}" fill="var(--c4)" font-weight="bold">${mul}</text>
      ${vals.map((v, j) => `<text x="${135 + j * 55}" y="${y}" text-anchor="middle" fill="var(--fg)" font-size="12">${v}</text>`).join('')}
      <text x="296" y="${y}" text-anchor="middle" fill="var(--muted)" font-size="9">${basis}</text></g>`;
  }).join('')}
  <text x="8" y="158" fill="var(--muted)" font-size="9">class sizes 1, 2, 3 · first column = dimensions: 1² + 1² + 2² = 6</text>
  <text x="8" y="171" fill="var(--muted)" font-size="9">rows are orthonormal: e.g. ⟨A₁, E⟩ = (1·2 + 2·(−1) + 3·0)/6 = 0</text>
</svg>`;

// Characters of ℤ₄ as points on the unit circle: χ_k(m) = i^{km}.
const z4Svg = `<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="9">
  ${[0, 1, 2, 3].map((k) => {
    const cx = 42 + k * 78, cy = 52, R = 28;
    const pts = [0, 1, 2, 3].map((m) => { const a = (Math.PI / 2) * ((k * m) % 4); return [cx + R * Math.cos(a), cy - R * Math.sin(a)]; });
    return `<g><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--grid)"/>
      <circle r="6" cx="${pts[0][0].toFixed(1)}" cy="${pts[0][1].toFixed(1)}" fill="var(--c${k + 1})"><animate attributeName="cx" dur="4s" repeatCount="indefinite" calcMode="discrete" values="${pts.map((p) => p[0].toFixed(1)).join(';')}"/><animate attributeName="cy" dur="4s" repeatCount="indefinite" calcMode="discrete" values="${pts.map((p) => p[1].toFixed(1)).join(';')}"/></circle>
      <text x="${cx}" y="${cy + 46}" text-anchor="middle" fill="var(--fg)">χ${'₀₁₂₃'[k]}(m) = i^${k}m</text>
      <text x="${cx}" y="${cy + 3}" text-anchor="middle" fill="var(--muted)">k=${k}</text></g>`;
  }).join('')}
  <text x="160" y="114" text-anchor="middle" fill="var(--muted)">m = 0,1,2,3 in turn: χ_k spins k quarter-turns per step</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The trace trick',
      body: String.raw`A representation is a whole family of matrices, and those matrices change if you change basis ($\rho(g) \mapsto P\rho(g)P^{-1}$). One number survives every change of basis: the **trace** (sum of the diagonal, equivalently the sum of the eigenvalues).

The **character** of a representation $\rho$ is the function
$$\chi_\rho(g) = \operatorname{tr}\rho(g).$$
Remarkably, for finite groups over $\mathbb{C}$ this list of numbers determines the representation completely, up to isomorphism.`,
    },
    {
      kind: 'recall',
      title: 'Representations so far',
      points: [
        String.raw`A representation is a homomorphism $\rho: G \to GL(V)$.`,
        String.raw`Maschke: every representation of a finite group over $\mathbb{C}$ is a direct sum of irreducibles.`,
        String.raw`Schur: intertwiners between irreps are $0$ or isomorphisms, and scalars from an irrep to itself.`,
        String.raw`$S_3$ has irreps trivial, sign and standard (dimensions 1, 1, 2), and $\mathbb{C}^3 = \text{trivial} \oplus \text{standard}$.`,
      ],
      link: 'math/representations-intro',
    },
    {
      kind: 'explain',
      title: 'Basic properties',
      body: String.raw`- $\chi(e) = \operatorname{tr} I = \dim V$.
- $\chi(hgh^{-1}) = \chi(g)$, because $\operatorname{tr}(ABA^{-1}) = \operatorname{tr}B$. So characters are constant on **conjugacy classes**, and one number per class is enough.
- $\chi_{V \oplus W} = \chi_V + \chi_W$ (block-diagonal matrices) and $\chi_{V \otimes W} = \chi_V\,\chi_W$.
- $\chi(g^{-1}) = \overline{\chi(g)}$, the complex conjugate, because the eigenvalues of $\rho(g)$ are roots of unity.

**Example ($S_3$).** For the standard representation, a 3-cycle is a $120°$ rotation with trace $2\cos 120° = -1$. A transposition is a reflection with eigenvalues $1, -1$, so trace $0$. Hence $\chi_{\text{std}} = (2, -1, 0)$ on (identity, 3-cycles, transpositions). For a permutation representation, $\chi(g)$ = **number of fixed points** of $g$ (the number of 1s on the diagonal).`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`$S_4$ acts on $\mathbb{C}^4$ by permuting the basis vectors. What is the character of this representation at the transposition $(1\,2)$?`,
      answer: 2,
      why: String.raw`For a permutation representation the trace counts the 1s on the diagonal, i.e. the basis vectors left in place. $(1\,2)$ fixes $e_3$ and $e_4$, so $\chi = 2$. Not $4$: that is the value at the identity.`,
    },
    {
      kind: 'widget',
      title: 'A character table',
      body: String.raw`Rows = irreps, columns = conjugacy classes, entries = characters. This is the table of $S_3$. Chemists know the same table as the point group $C_{3v}$ of ammonia ($\mathrm{NH_3}$), with **Mulliken labels** $A_1, A_2, E$ ($E$ for "two-dimensional"). The last column says which coordinate functions transform like each irrep. For example $z$ (along the 3-fold axis) is $A_1$, and the pair $(x, y)$ is $E$.`,
      widget: { type: 'SvgDiagram', props: { svg: tableSvg } },
    },
    {
      kind: 'explain',
      title: 'Orthogonality',
      body: String.raw`Define an inner product on functions $G \to \mathbb{C}$:
$$\langle \chi, \psi\rangle = \frac{1}{|G|}\sum_{g \in G} \chi(g)\,\overline{\psi(g)} = \frac{1}{|G|}\sum_{\text{classes } C} |C|\,\chi(C)\,\overline{\psi(C)}.$$

**Theorem.** The irreducible characters are **orthonormal**: $\langle \chi_i, \chi_j\rangle = 1$ if $i = j$, and $0$ otherwise. (The proof applies Schur's lemma to an averaged map.)

Consequences, for $V = \bigoplus_i m_i V_i$:
- **multiplicity:** $m_i = \langle \chi_V, \chi_i \rangle$;
- **irreducibility test:** $\langle\chi_V, \chi_V\rangle = \sum m_i^2$, which equals $1$ exactly when $V$ is irreducible;
- the number of irreps equals the number of classes, so the table is **square**.`,
    },
    {
      kind: 'widget',
      title: 'Decomposing with a few multiplications',
      body: String.raw`Decompose the permutation representation $\mathbb{C}^3$ of $S_3$ using only its character. Class sizes are $1, 2, 3$ for (identity, 3-cycles, transpositions).`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Fixed points: $\chi = (3, 0, 1)$. The identity fixes 3 points, a 3-cycle fixes none, and a transposition fixes 1.`,
            String.raw`$m_{A_1} = \tfrac16\,(1\cdot3\cdot1 + 2\cdot0\cdot1 + 3\cdot1\cdot1) = \tfrac{6}{6} = 1$.`,
            String.raw`$m_{A_2} = \tfrac16\,(1\cdot3\cdot1 + 2\cdot0\cdot1 + 3\cdot1\cdot(-1)) = 0$.`,
            String.raw`$m_{E} = \tfrac16\,(1\cdot3\cdot2 + 2\cdot0\cdot(-1) + 3\cdot1\cdot0) = 1$.`,
            String.raw`So $\mathbb{C}^3 \cong A_1 \oplus E$: trivial $\oplus$ standard, as found geometrically. Check dimensions: $1 + 2 = 3$.`,
          ],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A representation of $S_3$ has character $(5, -1, 1)$ on (identity, 3-cycles, transpositions), with class sizes $1, 2, 3$. How many copies of the 2-dimensional irrep $E$, with character $(2, -1, 0)$, does it contain?`,
      answer: 2,
      why: String.raw`$m_E = \tfrac16(1\cdot5\cdot2 + 2\cdot(-1)\cdot(-1) + 3\cdot1\cdot0) = \tfrac{12}{6} = 2$. Similarly $m_{A_1} = \tfrac16(5 - 2 + 3) = 1$ and $m_{A_2} = \tfrac16(5 - 2 - 3) = 0$. Check: $1 + 2\cdot2 = 5$. Forgetting the class sizes is the usual slip.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Which function on the classes (identity, 3-cycles, transpositions) of $S_3$, with sizes $1, 2, 3$, is the character of an **irreducible** representation?`,
      choices: [String.raw`$(2, -1, 0)$`, String.raw`$(2, 2, 0)$`, String.raw`$(3, 0, 1)$`, String.raw`$(2, 2, 2)$`],
      answer: 0,
      why: String.raw`Compute $\langle\chi,\chi\rangle$. For $(2,-1,0)$: $(4 + 2 + 0)/6 = 1$, irreducible. For $(2,2,0)$: $(4+8)/6 = 2$, so it is $A_1 \oplus A_2$. For $(3,0,1)$: $(9 + 3)/6 = 2$. For $(2,2,2)$: $(4 + 8 + 12)/6 = 4$, which is two copies of the trivial representation.`,
    },
    {
      kind: 'explain',
      title: 'Chemistry: counting vibrations',
      body: String.raw`To classify the vibrations of $\mathrm{NH_3}$ ($C_{3v}$), take all $3\times 4 = 12$ atomic displacement coordinates. Their character is $(12, 0, 2)$ on $(E, 2C_3, 3\sigma_v)$:
- under $E$, all 4 atoms stay put, $4\times 3 = 12$;
- under $C_3$, only N stays, contributing $1 + 2\cos 120° = 0$;
- under $\sigma_v$, N and one H stay, each contributing $+1$.

The orthogonality formula gives $3A_1 + A_2 + 4E$. Removing translations ($A_1 + E$) and rotations ($A_2 + E$) leaves the vibrations: $\Gamma_{\text{vib}} = 2A_1 + 2E$, which is $2 + 2\cdot 2 = 6 = 3N - 6$ modes. Since $z$ is $A_1$ and $(x,y)$ is $E$, all of them can be IR-active ([IR spectroscopy](@chem/spectroscopy-uv-ir)).`,
    },
    {
      kind: 'truefalse',
      prompt: 'For a finite group over ℂ, two representations with the same character are isomorphic.',
      answer: true,
      why: String.raw`By orthogonality, the multiplicity of each irrep is $m_i = \langle\chi_V, \chi_i\rangle$, computed from the character alone. Equal characters give equal multiplicities, and Maschke gives isomorphic direct sums. (This fails for infinite groups or in characteristic $p$.)`,
    },
    {
      kind: 'widget',
      title: 'Abelian groups: characters = Fourier analysis',
      body: String.raw`For an abelian group every irrep is 1-dimensional, so characters are just homomorphisms $G \to \mathbb{C}^\times$. For $\mathbb{Z}_n$ there are exactly $n$ of them, $\chi_k(m) = e^{2\pi i k m/n}$, and the character table is the **discrete Fourier transform** matrix. Decomposing a function on $\mathbb{Z}_n$ into irreps *is* taking its DFT. That is why [Fourier series](@math/fourier-series) work: they decompose functions on the circle group into its characters $e^{ik\theta}$. Group-equivariant CNNs ([equivariant networks](@ml/equivariant-networks)) use the non-abelian version of this idea.`,
      widget: { type: 'SvgDiagram', props: { svg: z4Svg } },
    },
    {
      kind: 'match',
      prompt: 'Match each quantity to what it equals (finite group, over ℂ).',
      pairs: [
        [String.raw`$\chi_V(e)$`, String.raw`$\dim V$`],
        [String.raw`$\chi_{V \oplus W}$`, String.raw`$\chi_V + \chi_W$`],
        ['Number of irreducible characters', 'Number of conjugacy classes'],
        [String.raw`$\sum_i (\dim V_i)^2$ over all irreps`, String.raw`$|G|$`],
        [String.raw`$\langle \chi_V, \chi_V \rangle$ for irreducible $V$`, String.raw`$1$`],
      ],
      why: String.raw`The trace of the identity matrix is the dimension. Traces add over block-diagonal sums. The character table is square. $\sum d_i^2 = |G|$ comes from decomposing the regular representation, where each irrep occurs $d_i$ times. Irreducible characters have norm 1.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`Characters are constant on ___ classes. The multiplicity of an irrep $W$ inside $V$ is the ___ $\langle \chi_V, \chi_W\rangle$.`,
      bank: ['conjugacy', 'equivalence', 'inner product', 'determinant', 'trace'],
      answer: ['conjugacy', 'inner product'],
      why: String.raw`$\operatorname{tr}(\rho(h)\rho(g)\rho(h)^{-1}) = \operatorname{tr}\rho(g)$, so conjugate elements share a character value. Orthonormality of irreducible characters turns "how many copies?" into an inner product.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Character** $\chi_\rho(g) = \operatorname{tr}\rho(g)$. It is basis-independent, constant on conjugacy classes, and $\chi(e) = \dim$.
- Irreducible characters are **orthonormal**. Multiplicities are inner products, and $\langle\chi,\chi\rangle = 1 \iff$ irreducible.
- The **character table** is square (irreps × classes), and its first column satisfies $\sum d_i^2 = |G|$.
- Permutation representations: $\chi$ = number of fixed points.
- Chemistry: point-group tables ($C_{3v}$: $A_1, A_2, E$) classify orbitals and vibrations. Abelian groups: characters are Fourier modes. Machine learning: equivariant networks build on the same decompositions.

Continuous symmetry groups have representations too: see [Lie group representations](@math/lie-representations).`,
    },
  ],
  references: [
    { authors: 'J.-P. Serre', title: 'Linear Representations of Finite Groups', year: 1977, venue: 'Springer GTM 42', detail: 'Ch. 2 (character theory: orthogonality relations, decomposition of the regular representation, number of irreducible representations)' },
    { authors: 'W. Fulton, J. Harris', title: 'Representation Theory: A First Course', year: 1991, venue: 'Springer GTM 129', detail: 'Lecture 2 (characters and the character table; projection formulas)' },
    { authors: 'D. S. Dummit, R. M. Foote', title: 'Abstract Algebra', year: 2004, venue: '3rd ed., Wiley', detail: '§18.3 (character theory and the orthogonality relations), Ch. 19 (examples and applications)' },
    { authors: 'F. A. Cotton', title: 'Chemical Applications of Group Theory', year: 1990, venue: '3rd ed., Wiley', detail: 'Character tables; molecular vibrations' },
  ],
} satisfies LessonContent;
