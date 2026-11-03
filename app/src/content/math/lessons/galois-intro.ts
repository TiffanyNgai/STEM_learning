import type { LessonContent } from '../../types';

// Galois correspondence for x³ − 2: each node = intermediate field | subgroup fixing it.
const nd = (x: number, y: number, field: string, grp: string, col: string, pulse = false) =>
  `<g><rect x="${x - 36}" y="${y - 16}" width="72" height="32" rx="7" fill="${col}" fill-opacity="0.14" stroke="${col}">` +
  (pulse ? `<animate attributeName="fill-opacity" values="0.14;0.5;0.14" dur="2.5s" repeatCount="indefinite"/>` : '') +
  `</rect><text x="${x}" y="${y - 3}" text-anchor="middle" fill="var(--fg)" font-size="9">${field}</text>` +
  `<text x="${x}" y="${y + 10}" text-anchor="middle" fill="var(--c4)" font-size="9">${grp}</text></g>`;
const deg = (x: number, y: number, t: string) => `<text x="${x}" y="${y}" fill="var(--muted)" font-size="8">${t}</text>`;
const latticeSvg = `<svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <g stroke="var(--muted)" stroke-width="1.1">
    <line x1="160" y1="40" x2="42" y2="94"/><line x1="160" y1="40" x2="122" y2="94"/><line x1="160" y1="40" x2="202" y2="94"/><line x1="160" y1="40" x2="280" y2="94"/>
    <line x1="42" y1="126" x2="160" y2="178"/><line x1="122" y1="126" x2="160" y2="178"/><line x1="202" y1="126" x2="160" y2="178"/><line x1="280" y1="126" x2="160" y2="178"/>
  </g>
  ${deg(80, 62, '2')}${deg(228, 62, '3')}${deg(88, 160, '3')}${deg(226, 160, '2')}
  ${nd(160, 24, 'ℚ(∛2, ω)', '{e}', 'var(--c2)')}
  ${nd(42, 110, 'ℚ(∛2)', '⟨τ₁⟩, order 2', 'var(--c2)')}
  ${nd(122, 110, 'ℚ(ω∛2)', '⟨τ₂⟩, order 2', 'var(--c2)')}
  ${nd(202, 110, 'ℚ(ω²∛2)', '⟨τ₃⟩, order 2', 'var(--c2)')}
  ${nd(280, 110, 'ℚ(ω)', 'A₃, normal', 'var(--c1)', true)}
  ${nd(160, 194, 'ℚ', 'S₃', 'var(--c2)')}
  <text x="4" y="214" fill="var(--muted)" font-size="8">top line: field · bottom line: subgroup of S₃ fixing it · edge labels: degrees</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The quest for a formula',
      body: String.raw`Quadratics have had a formula since antiquity: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$. In the 1500s, del Ferro, Tartaglia and Cardano found formulas for cubics, and Ferrari for quartics. All of them use only $+, -, \times, \div$ and $n$-th roots, which together are called **radicals**.

Then everyone got stuck on degree 5. Ruffini (1799, with a gap) and Abel (1824) proved that **no** radical formula can solve the general quintic. Galois (who died in 1832 at age 20) explained *which* equations are solvable by radicals. His answer is a property of a group: the group of symmetries of the roots.

Note: some quintics *are* solvable, e.g. $x^5 = 2$ gives $x = \sqrt[5]{2}$. The claim is that no single formula works for all of them, and some specific ones, like $x^5 - 6x + 3$, have roots that cannot be written with radicals at all.`,
    },
    {
      kind: 'recall',
      title: 'Ingredients',
      points: [
        String.raw`A **field** is a ring where you can divide by anything non-zero: $\mathbb{Q}, \mathbb{R}, \mathbb{C}, \mathbb{F}_p$ ([rings & fields](@math/rings-fields)).`,
        String.raw`$S_n$ permutes $n$ objects. $A_n$ is its normal subgroup of even permutations, and it is **simple** for $n \ge 5$ ([permutation groups](@math/permutation-groups)).`,
        String.raw`A quotient $G/N$ exists when $N$ is normal ([quotients](@math/normal-subgroups-quotients)).`,
      ],
      link: 'math/rings-fields',
    },
    {
      kind: 'explain',
      title: 'Field extensions',
      body: String.raw`$\mathbb{Q}(\sqrt2) = \{a + b\sqrt 2 : a, b \in \mathbb{Q}\}$ is a field containing $\mathbb{Q}$: it is closed under $+,-,\times$, and $\frac{1}{a + b\sqrt2} = \frac{a - b\sqrt2}{a^2 - 2b^2}$. We call it an **extension** of $\mathbb{Q}$. Viewed as a vector space over $\mathbb{Q}$ it has basis $\{1, \sqrt 2\}$, so its **degree** is $[\mathbb{Q}(\sqrt2):\mathbb{Q}] = 2$.

The **splitting field** of a polynomial $f$ is the smallest field containing all of its roots. For $x^3 - 2$ the roots are $\sqrt[3]{2}$, $\omega\sqrt[3]{2}$ and $\omega^2\sqrt[3]{2}$, where $\omega = e^{2\pi i/3}$. The splitting field is $K = \mathbb{Q}(\sqrt[3]{2}, \omega)$, of degree $6$. Degrees multiply in towers: $[K:\mathbb{Q}] = [K:\mathbb{Q}(\sqrt[3]2)]\cdot[\mathbb{Q}(\sqrt[3]2):\mathbb{Q}] = 2 \cdot 3$.`,
    },
    {
      kind: 'explain',
      title: 'The Galois group',
      body: String.raw`An **automorphism** of a field $K$ is a bijection $K \to K$ that respects $+$ and $\times$. The **Galois group** $\mathrm{Gal}(K/\mathbb{Q})$ consists of the automorphisms of $K$ that fix every rational number.

If $f$ has rational coefficients and $f(r) = 0$, then for any such $\sigma$, $f(\sigma(r)) = \sigma(f(r)) = 0$. So **$\sigma$ sends roots to roots**, and the Galois group of $f$ is a group of permutations of its roots, a subgroup of $S_n$.

- $x^2 - 2$: the swap $\sqrt2 \leftrightarrow -\sqrt2$, so $\mathrm{Gal} \cong \mathbb{Z}_2$.
- $x^3 - 2$: all $3! = 6$ permutations of the three roots occur, so $\mathrm{Gal} \cong S_3$.

For a splitting field (over $\mathbb{Q}$), $|\mathrm{Gal}(K/\mathbb{Q})| = [K:\mathbb{Q}]$.`,
    },
    {
      kind: 'widget',
      title: 'The roots of x³ − 2 form a triangle',
      body: String.raw`In the complex plane the three roots of $x^3 - 2$ are the corners of an equilateral triangle. **Complex conjugation** fixes the real root $\sqrt[3]2$ and swaps the other two: that is a reflection ($s$). The automorphism $\sqrt[3]2 \mapsto \omega\sqrt[3]2$, $\omega \mapsto \omega$ multiplies every root by $\omega$: that is a rotation by $120°$ ($r$). Together they generate $\mathrm{Gal} \cong D_3 \cong S_3$. Explore the 6 elements below.`,
      widget: { type: 'SymmetryRotator', props: { n: 3, reflect: true, showTable: true } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`The splitting field of $x^2 - 3$ over $\mathbb{Q}$ is $\mathbb{Q}(\sqrt 3)$. How many elements does its Galois group have?`,
      answer: 2,
      why: String.raw`An automorphism fixing $\mathbb{Q}$ must send $\sqrt3$ to a root of $x^2 - 3$, i.e. to $\pm\sqrt3$. Both choices work (the identity, and $a + b\sqrt 3 \mapsto a - b\sqrt3$). This matches the degree $[\mathbb{Q}(\sqrt3):\mathbb{Q}] = 2$.`,
    },
    {
      kind: 'widget',
      title: 'The fundamental theorem of Galois theory',
      body: String.raw`For a Galois extension $K/F$ (for example the splitting field of a polynomial over $\mathbb{Q}$) with group $G$:

- intermediate fields $E$ ($F \subseteq E \subseteq K$) correspond one-to-one to subgroups $H \le G$, via $E \mapsto \mathrm{Gal}(K/E)$, the elements fixing $E$;
- the correspondence **reverses inclusion**, and $[K:E] = |H|$;
- $E/F$ is itself Galois $\iff H$ is a **normal** subgroup, and then $\mathrm{Gal}(E/F) \cong G/H$.

Here it is for $x^3 - 2$. $\mathbb{Q}(\omega)$, the only intermediate field that contains all its conjugates, matches the only proper non-trivial normal subgroup, $A_3$.`,
      widget: { type: 'SvgDiagram', props: { svg: latticeSvg } },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`$\mathbb{Q}(\sqrt[3]{2})/\mathbb{Q}$ is a Galois extension.`,
      answer: false,
      why: String.raw`$\mathbb{Q}(\sqrt[3]2) \subset \mathbb{R}$ contains only the real root of $x^3 - 2$. The other two roots are non-real, so the extension is not normal. On the group side, its subgroup $\langle \tau_1\rangle$ (order 2) is not normal in $S_3$. Its only automorphism is the identity, and $1 \ne 3 = $ the degree.`,
    },
    {
      kind: 'explain',
      title: 'Radicals ↔ solvable groups',
      body: String.raw`Adjoining an $n$-th root ($\sqrt[n]{a}$, with roots of unity available) gives an extension with an **abelian** Galois group. A formula built from nested radicals is therefore a tower of such steps. On the group side this is a chain
$$\{e\} = G_0 \trianglelefteq G_1 \trianglelefteq \cdots \trianglelefteq G_k = G, \quad G_{i}/G_{i-1} \text{ abelian}.$$
A group with such a chain is called **solvable**.

**Galois's theorem.** A polynomial over $\mathbb{Q}$ is solvable by radicals $\iff$ its Galois group is solvable.

- $S_3$: $\{e\} \trianglelefteq A_3 \trianglelefteq S_3$, with quotients $\mathbb{Z}_3$ and $\mathbb{Z}_2$. Solvable, hence Cardano's formula.
- $S_4$: $\{e\} \trianglelefteq V_4 \trianglelefteq A_4 \trianglelefteq S_4$. Solvable, hence Ferrari's formula. ($V_4$ is the identity together with the three double transpositions.)
- $S_5$: its only normal subgroups are $\{e\}, A_5, S_5$, and $A_5$ is simple and non-abelian. **Not solvable.**`,
    },
    {
      kind: 'widget',
      title: 'A quintic with Galois group S₅',
      body: String.raw`$f(x) = x^5 - 6x + 3$ crosses the axis exactly three times, so it has 3 real roots and 2 non-real (complex-conjugate) roots. That alone pins down its Galois group.`,
      widget: { type: 'FunctionPlot', props: { fns: ['x^5 - 6*x + 3'], x: [-2, 2], y: [-12, 12], labels: ['f(x) = x⁵ − 6x + 3'] } },
    },
    {
      kind: 'widget',
      title: 'Why there is no quintic formula',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`$f = x^5 - 6x + 3$ is irreducible over $\mathbb{Q}$ (Eisenstein's criterion with $p = 3$: $3$ divides $-6$ and $3$, the leading coefficient is not divisible by 3, and $9 \nmid 3$).`,
            String.raw`So $\mathbb{Q}(\text{one root})$ has degree 5, and 5 divides $|G|$. By Cauchy's theorem $G \le S_5$ contains an element of order 5, which must be a 5-cycle.`,
            String.raw`Complex conjugation maps roots to roots: it fixes the 3 real ones and swaps the 2 non-real ones. So $G$ contains a **transposition**.`,
            String.raw`In $S_p$ with $p$ prime, a $p$-cycle and any transposition generate all of $S_p$. Hence $G = S_5$.`,
            String.raw`$S_5$ is not solvable, so the roots of $f$ cannot be expressed by radicals. In particular, no radical formula solves all quintics. ∎`,
          ],
        },
      },
    },
    {
      kind: 'order',
      prompt: String.raw`Order the argument that $x^5 - 6x + 3$ is not solvable by radicals.`,
      steps: [
        'Show f is irreducible (Eisenstein, p = 3).',
        'Deduce the Galois group contains a 5-cycle.',
        'Use the 2 non-real roots: complex conjugation is a transposition.',
        String.raw`Conclude the group is all of $S_5$.`,
        String.raw`$S_5$ is not solvable, so f is not solvable by radicals.`,
      ],
      why: String.raw`Irreducibility gives the factor 5 in $|G|$, hence a 5-cycle. Counting real roots gives a transposition. Together these generate $S_5$, and Galois's theorem turns non-solvability of the group into non-solvability of the equation.`,
    },
    {
      kind: 'match',
      prompt: String.raw`Match each polynomial to its Galois group over $\mathbb{Q}$.`,
      pairs: [
        [String.raw`$x^2 - 2$`, String.raw`$\mathbb{Z}_2$`],
        [String.raw`$x^3 - 2$`, String.raw`$S_3$`],
        [String.raw`$x^4 + x^3 + x^2 + x + 1$ (roots: the primitive 5th roots of unity)`, String.raw`$\mathbb{Z}_4$`],
        [String.raw`$x^5 - 6x + 3$`, String.raw`$S_5$`],
      ],
      why: String.raw`For the 5th roots of unity, an automorphism is determined by $\zeta \mapsto \zeta^k$ with $k \in \{1,2,3,4\}$. These compose like multiplication mod 5, giving $(\mathbb{Z}/5)^\times \cong \mathbb{Z}_4$, generated by $k = 2$. Note that the first three groups are solvable, and indeed those roots have radical expressions.`,
    },
    {
      kind: 'multi',
      prompt: 'Which groups are solvable?',
      choices: [String.raw`$\mathbb{Z}_n$ (any abelian group)`, String.raw`$S_3$`, String.raw`$S_4$`, String.raw`$A_5$`, String.raw`$S_5$`, String.raw`$D_n$`],
      answers: [0, 1, 2, 5],
      why: String.raw`Abelian groups are solvable with the chain $\{e\} \trianglelefteq G$. $S_3$ and $S_4$ have the chains shown earlier. $D_n$ has $\{e\} \trianglelefteq \langle r\rangle \trianglelefteq D_n$ with quotients $\mathbb{Z}_n$ and $\mathbb{Z}_2$. $A_5$ is simple and non-abelian, so no chain can start. $S_5$ contains it, so $S_5$ is not solvable either.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`Over $\mathbb{Q}$, a polynomial is solvable by radicals exactly when its Galois group is ___. For $n \ge 5$ the alternating group $A_n$ is ___ and non-abelian, so $S_n$ is not.`,
      bank: ['solvable', 'simple', 'cyclic', 'trivial', 'abelian'],
      answer: ['solvable', 'simple'],
      why: String.raw`Radicals give a tower of abelian steps, which is a solvable chain in the group. A simple non-abelian group has no proper non-trivial normal subgroup, so the chain cannot even begin. "Abelian" is too strong: $S_3$ is non-abelian, yet cubics are solvable.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- The **Galois group** of $f$ = field automorphisms of its splitting field fixing $\mathbb{Q}$. It permutes the roots, so it is a subgroup of $S_n$.
- **Fundamental theorem:** intermediate fields ↔ subgroups, with inclusions reversed. Normal subgroups ↔ Galois sub-extensions.
- Solvable by radicals $\iff$ Galois group **solvable** (a chain with abelian quotients).
- $S_2, S_3, S_4$ are solvable, which is why there are formulas up to degree 4. $S_5$ is not, because $A_5$ is simple.
- $x^5 - 6x + 3$: irreducible with exactly 3 real roots gives Galois group $S_5$, so no radical expression exists.`,
    },
  ],
  references: [
    { authors: 'I. Stewart', title: 'Galois Theory', year: 2015, venue: '4th ed., CRC Press', detail: 'Ch. 1 (history), Ch. 8 (the idea behind Galois theory), Ch. 12–15 (Galois correspondence, worked example, solubility, radicals)' },
    { authors: 'D. S. Dummit, R. M. Foote', title: 'Abstract Algebra', year: 2004, venue: '3rd ed., Wiley', detail: 'Ch. 13 (field extensions), §14.1–14.2 (fundamental theorem), §14.7 (insolvability of the quintic)' },
    { authors: 'M. Artin', title: 'Algebra', year: 2011, venue: '2nd ed., Pearson', detail: 'Ch. 16 (Galois theory)' },
    { authors: 'J. B. Fraleigh', title: 'A First Course in Abstract Algebra', year: 2003, venue: '7th ed., Addison-Wesley', detail: 'Galois theory; insolvability of the quintic' },
  ],
} satisfies LessonContent;
