import type { LessonContent } from '../../types';

// Two Cayley tables, cell colours matched by the isomorphism k ↦ iᵏ.
const z4 = ['0', '1', '2', '3'];
const powI = ['1', 'i', '−1', '−i'];
const cols = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)'];
const table = (x0: number, labels: string[], op: string) => {
  const c = 26;
  let s = `<text x="${x0 + c / 2}" y="${30 + c * 0.66}" text-anchor="middle" fill="var(--fg)" font-weight="bold">${op}</text>`;
  labels.forEach((l, i) => {
    s += `<text x="${x0 + (i + 1.5) * c}" y="${30 + c * 0.66}" text-anchor="middle" fill="var(--muted)">${l}</text>`;
    s += `<text x="${x0 + c / 2}" y="${30 + (i + 1) * c + c * 0.66}" text-anchor="middle" fill="var(--muted)">${l}</text>`;
  });
  for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) {
    const v = (a + b) % 4;
    s += `<rect x="${x0 + (b + 1) * c}" y="${30 + (a + 1) * c}" width="${c}" height="${c}" fill="${cols[v]}" fill-opacity="0.45" stroke="var(--grid)"><animate attributeName="fill-opacity" values="0.45;0.45;0.9;0.45" keyTimes="0;${(v * 0.2).toFixed(1)};${(v * 0.2 + 0.1).toFixed(1)};1" dur="4s" repeatCount="indefinite"/></rect>`;
    s += `<text x="${x0 + (b + 1.5) * c}" y="${30 + (a + 1) * c + c * 0.66}" text-anchor="middle" fill="var(--fg)">${labels[v]}</text>`;
  }
  return s;
};
const isoSvg = `<svg viewBox="0 0 320 175" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="10">
  <text x="70" y="18" text-anchor="middle" fill="var(--fg)">(ℤ₄, +)</text>
  <text x="250" y="18" text-anchor="middle" fill="var(--fg)">({1, i, −1, −i}, ×)</text>
  ${table(5, z4, '+')}
  ${table(185, powI, '×')}
  <text x="160" y="95" text-anchor="middle" fill="var(--c4)" font-size="11">k ↦ iᵏ</text>
  <path d="M140 102 L176 102" stroke="var(--c4)" stroke-width="1.5" marker-end="url(#h-arr)"/>
  <defs><marker id="h-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--c4)"/></marker></defs>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Maps that respect the rules',
      body: String.raw`An hour hand forgets how many days have passed: it sends an integer number of hours $n$ to $n \bmod 12$. Crucially, it does not matter whether you add first and then read the clock, or read the clock and then add. That is the idea of a structure-preserving map.

A **homomorphism** from a group $G$ to a group $H$ is a function $\varphi: G \to H$ with
$$\varphi(ab) = \varphi(a)\,\varphi(b) \quad\text{for all } a, b \in G.$$
(The product on the left is in $G$, on the right in $H$.) Examples:

- reduction $\mathbb{Z} \to \mathbb{Z}_{12}$, $n \mapsto n \bmod 12$;
- $\exp: (\mathbb{R}, +) \to (\mathbb{R}_{>0}, \times)$, since $e^{a+b} = e^a e^b$;
- $\det: GL_n(\mathbb{R}) \to (\mathbb{R}^{\times}, \times)$, since $\det(AB) = \det A \det B$. Here $GL_n(\mathbb{R})$ is the group of invertible $n\times n$ matrices and $\mathbb{R}^\times$ the non-zero reals.`,
    },
    {
      kind: 'widget',
      title: 'A homomorphism you can see',
      body: String.raw`Send each symmetry of the square to $+1$ if it is a rotation (blue cells) and $-1$ if it is a reflection (red cells). This is the determinant of its $2\times 2$ matrix. Look at the table: rotation·rotation and reflection·reflection are blue, mixed products are red. That is exactly the rule $(\pm1)(\pm1)$, so $D_4 \to \{\pm 1\}$ is a homomorphism. It forgets almost everything but keeps "does it flip the square over?".`,
      widget: { type: 'SymmetryRotator', props: { n: 4, reflect: true, showTable: true } },
    },
    {
      kind: 'explain',
      title: 'What you get for free',
      body: String.raw`From $\varphi(ab) = \varphi(a)\varphi(b)$ alone:

- $\varphi(e_G) = e_H$. Proof: $\varphi(e) = \varphi(ee) = \varphi(e)\varphi(e)$; cancel one $\varphi(e)$.
- $\varphi(g^{-1}) = \varphi(g)^{-1}$, because $\varphi(g)\varphi(g^{-1}) = \varphi(e) = e$.
- If $g^m = e$ then $\varphi(g)^m = e$. So **the order of $\varphi(g)$ divides the order of $g$**.

The last fact is a quick way to rule maps out. A homomorphism $\mathbb{Z}_6 \to \mathbb{Z}_4$ can only send $1$ to an element whose order divides both 6 and 4, i.e. order 1 or 2: that is $0$ or $2$.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Which map $(\mathbb{R}, +) \to (\mathbb{R}, +)$ is a homomorphism?`,
      choices: [String.raw`$x \mapsto 3x$`, String.raw`$x \mapsto x + 1$`, String.raw`$x \mapsto x^2$`, String.raw`$x \mapsto |x|$`],
      answer: 0,
      why: String.raw`$3(a+b) = 3a + 3b$. The shift fails because $(a+b)+1 \ne (a+1)+(b+1)$ (and it does not send $0$ to $0$). Squaring adds a cross term $2ab$. Absolute value fails for $a = 1, b = -1$: $|0| = 0 \ne 2$.`,
    },
    {
      kind: 'explain',
      title: 'Kernel and image',
      body: String.raw`Two subgroups come with every homomorphism $\varphi: G \to H$:

- the **kernel** $\ker\varphi = \{g \in G : \varphi(g) = e_H\}$, everything that gets "forgotten";
- the **image** $\operatorname{im}\varphi = \{\varphi(g) : g \in G\}$, everything that is reached.

**Fact:** $\varphi$ is injective (one-to-one) iff $\ker\varphi = \{e\}$. Why: $\varphi(a) = \varphi(b) \iff \varphi(a^{-1}b) = e \iff a^{-1}b \in \ker\varphi$.

Examples: $\ker(\det) = SL_n(\mathbb{R})$, the matrices of determinant 1. The kernel of rotation/reflection $\mapsto \pm1$ is the rotation subgroup $C_4$. The kernel of $\mathbb{Z} \to \mathbb{Z}_{12}$ is $12\mathbb{Z}$.`,
    },
    {
      kind: 'widget',
      title: 'Fibres are cosets of the kernel',
      body: String.raw`Reduction mod $n$, $\mathbb{Z} \to \mathbb{Z}_n$, has kernel $n\mathbb{Z}$ = the class $[0]$. The integers that land on any *other* value $r$ form the class $[r] = r + n\mathbb{Z}$: a shifted copy (a [coset](@math/subgroups-lagrange)) of the kernel. This is true for every homomorphism: $\varphi(a) = \varphi(b)$ exactly when $a$ and $b$ lie in the same coset of $\ker\varphi$. Tap an integer to see its fibre.`,
      widget: { type: 'MathResidueClasses', props: { n: 4, from: -8, count: 24 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`$\varphi: \mathbb{Z}_{12} \to \mathbb{Z}_{12}$ is $\varphi(x) = 3x \bmod 12$. How many elements are in $\ker\varphi$?`,
      answer: 3,
      why: String.raw`$3x \equiv 0 \pmod{12}$ means $4 \mid x$, so $\ker\varphi = \{0, 4, 8\}$. Check: the image is $\{0,3,6,9\}$ with 4 elements, and $3 \times 4 = 12$. Each value is hit by exactly one coset of the kernel.`,
    },
    {
      kind: 'explain',
      title: 'Isomorphisms: the same group, relabelled',
      body: String.raw`An **isomorphism** is a bijective homomorphism. Its inverse is automatically a homomorphism too. If one exists we write $G \cong H$: the two Cayley tables are identical after renaming elements.

- $(\mathbb{Z}_4, +) \cong (\{1, i, -1, -i\}, \times)$ via $k \mapsto i^k$ (picture below).
- $(\mathbb{R}, +) \cong (\mathbb{R}_{>0}, \times)$ via $\exp$, with inverse $\ln$. This is why logarithm tables turned multiplication into addition.
- $D_3 \cong S_3$ ([symmetries are permutations](@math/symmetry-groups)).

To show two groups are **not** isomorphic, find a property that isomorphisms preserve but the groups don't share: the order, being abelian, or how many elements have each order.`,
      widget: { type: 'SvgDiagram', props: { svg: isoSvg }, caption: 'Same colour pattern, different names: an isomorphism is a relabelling of the table.' },
    },
    {
      kind: 'multi',
      prompt: 'Which pairs of groups are isomorphic?',
      choices: [
        String.raw`$(\mathbb{Z}_4, +)$ and $(\{1, i, -1, -i\}, \times)$`,
        String.raw`$(\mathbb{R}, +)$ and $(\mathbb{R}_{>0}, \times)$`,
        String.raw`$(\mathbb{Z}, +)$ and $(2\mathbb{Z}, +)$`,
        String.raw`$D_3$ and $\mathbb{Z}_6$`,
        String.raw`$\mathbb{Z}_4$ and the symmetry group $D_2$ of a non-square rectangle`,
      ],
      answers: [0, 1, 2],
      why: String.raw`$k \mapsto i^k$, $\exp$ and $n \mapsto 2n$ are bijective homomorphisms. $D_3$ is non-abelian but $\mathbb{Z}_6$ is abelian. $\mathbb{Z}_4$ has an element of order 4, while every non-identity symmetry of a rectangle has order 2. Note that a group can be isomorphic to a proper subgroup of itself when it is infinite.`,
    },
    {
      kind: 'explain',
      title: 'Actions are homomorphisms',
      body: String.raw`A [group action](@math/group-actions) of $G$ on a set $X$ is the same thing as a homomorphism $G \to \mathrm{Sym}(X)$, where $\mathrm{Sym}(X)$ is the group of all bijections $X \to X$. Each $g$ becomes the shuffle $x \mapsto g\cdot x$, and the rule $g\cdot(h\cdot x) = (gh)\cdot x$ says that this assignment respects products.

**Cayley's theorem.** Let $G$ act on itself by left multiplication, $x \mapsto gx$. The kernel is trivial ($gx = x$ forces $g = e$), so $G$ is isomorphic to a subgroup of a [permutation group](@math/permutation-groups). Every finite group is "a group of shuffles".

If you replace $\mathrm{Sym}(X)$ by the invertible matrices $GL(V)$, you get a [representation](@math/representations-intro).`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`There is a homomorphism $\varphi: \mathbb{Z}_6 \to \mathbb{Z}_4$ with $\varphi(1) = 1$.`,
      answer: false,
      why: String.raw`In $\mathbb{Z}_6$, $6\cdot 1 = 0$, so we would need $6\cdot\varphi(1) = 6 \equiv 2 \pmod 4$ to be $0$. In other words, the order of $\varphi(1)$ must divide 6, but $1 \in \mathbb{Z}_4$ has order 4. Only $\varphi(1) = 0$ or $2$ work.`,
    },
    {
      kind: 'match',
      prompt: 'Match each homomorphism to its kernel.',
      pairs: [
        [String.raw`$\det: GL_2(\mathbb{R}) \to \mathbb{R}^\times$`, String.raw`$SL_2(\mathbb{R})$, the matrices with determinant 1`],
        [String.raw`$D_4 \to \{\pm1\}$, rotation $\mapsto 1$, reflection $\mapsto -1$`, String.raw`The rotations $C_4$`],
        [String.raw`$\mathbb{Z} \to \mathbb{Z}_{12}$, $n \mapsto n \bmod 12$`, String.raw`$12\mathbb{Z}$`],
        [String.raw`$\exp: (\mathbb{R}, +) \to (\mathbb{R}_{>0}, \times)$`, String.raw`$\{0\}$ only`],
      ],
      why: String.raw`The kernel is everything sent to the identity of the target: determinant 1, sign $+1$, remainder 0, or $e^x = 1$. Because $\exp$ has trivial kernel it is injective, and in fact an isomorphism.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`A homomorphism is injective exactly when its ___ is $\{e\}$. A bijective homomorphism is called an ___.`,
      bank: ['kernel', 'image', 'isomorphism', 'identity', 'subgroup'],
      answer: ['kernel', 'isomorphism'],
      why: String.raw`$\varphi(a) = \varphi(b) \iff a^{-1}b \in \ker\varphi$, so a trivial kernel forces $a = b$. The image tells you about surjectivity, not injectivity.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **homomorphism** satisfies $\varphi(ab) = \varphi(a)\varphi(b)$. It sends $e \mapsto e$ and inverses to inverses, and the order of $\varphi(g)$ divides the order of $g$.
- **Kernel** = what is sent to $e$. **Image** = what is reached. $\varphi$ is injective $\iff \ker\varphi = \{e\}$.
- The fibres of $\varphi$ are the cosets of its kernel.
- An **isomorphism** is a bijective homomorphism ("same table, new names"). To rule one out, find an invariant the groups don't share.
- Actions are homomorphisms to $\mathrm{Sym}(X)$; representations are homomorphisms to $GL(V)$.

Next: kernels are special subgroups, and dividing by them gives [quotient groups](@math/normal-subgroups-quotients).`,
    },
  ],
  references: [
    { authors: 'D. S. Dummit, R. M. Foote', title: 'Abstract Algebra', year: 2004, venue: '3rd ed., Wiley', detail: '§1.6 (homomorphisms and isomorphisms), §3.1 (kernels), §4.2 (Cayley’s theorem)' },
    { authors: 'M. Artin', title: 'Algebra', year: 2011, venue: '2nd ed., Pearson', detail: 'Ch. 2 (homomorphisms, isomorphisms)' },
    { authors: 'J. B. Fraleigh', title: 'A First Course in Abstract Algebra', year: 2003, venue: '7th ed., Addison-Wesley', detail: 'Homomorphisms; Cayley’s theorem' },
  ],
} satisfies LessonContent;
