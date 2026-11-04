import type { LessonContent } from '../../types';

// --- Concatenating loops: γ runs the red loop in the first half of the time, then the blue loop.
const lobe = (cx: number, r: number, sgn: number) =>
  Array.from({ length: 49 }, (_, i) => { const th = Math.PI * 2 * i / 48; const x = cx + sgn * r * (1 - Math.cos(th)) * 0.9; const y = 105 - r * Math.sin(th) * 0.8; return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ');
const concatSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <path d="${lobe(160, 62, -1)}" fill="none" stroke="var(--c5)" stroke-width="2.5"/>
  <path d="${lobe(160, 62, 1)}" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
  <circle cx="160" cy="105" r="5" fill="var(--c3)"/>
  <text x="160" y="126" text-anchor="middle" font-size="10" fill="var(--c3)">basepoint x₀</text>
  <text x="54" y="48" font-size="11" fill="var(--c5)">α (first half)</text>
  <text x="210" y="48" font-size="11" fill="var(--c2)">β (second half)</text>
  <circle r="5" fill="var(--c1)">
    <animateMotion dur="5s" repeatCount="indefinite" path="${lobe(160, 62, -1)} ${lobe(160, 62, 1)}"/>
  </circle>
  <text x="160" y="22" text-anchor="middle" font-size="11" fill="var(--fg)">the product loop α · β</text>
  <text x="160" y="176" text-anchor="middle" font-size="10" fill="var(--muted)">run α at double speed, then β at double speed</text>
  <text x="160" y="192" text-anchor="middle" font-size="10" fill="var(--muted)">both start and end at x₀, so the result is again a loop</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A hole you can feel with a loop',
      body: String.raw`How do you tell a disc from an annulus (a disc with a hole punched out) without measuring anything? Lay a loop of string on each one and pull it tight. On the disc the string always shrinks to a point. On the annulus a string that goes round the hole catches and will not shrink.

That is the whole idea of the **fundamental group**. Collect all loops based at a chosen point, regard two loops as the same when one can be deformed into the other, and the result is a group whose size and structure detects holes.

The construction is due to Henri Poincaré, in *Analysis Situs* (1895), the paper that launched algebraic topology.`,
    },
    {
      kind: 'explain',
      title: 'Paths, loops and homotopy',
      body: String.raw`Fix a space $X$ and a **basepoint** $x_0 \in X$.

- A **path** is a continuous map $\gamma : [0,1] \to X$. A **loop at $x_0$** is a path with $\gamma(0) = \gamma(1) = x_0$.
- Two loops $\alpha, \beta$ at $x_0$ are **homotopic** (written $\alpha \simeq \beta$) if there is a continuous $H : [0,1] \times [0,1] \to X$ with
$$H(s, 0) = \alpha(s),\quad H(s, 1) = \beta(s),\quad H(0, t) = H(1, t) = x_0 .$$

Read $H(\cdot, t)$ as the loop at time $t$. The homotopy is a film in which $\alpha$ morphs continuously into $\beta$, with the basepoint nailed down throughout.

Homotopy is an [equivalence relation](@math/relations-equivalence) on loops. The class of $\alpha$ is written $[\alpha]$.`,
    },
    {
      kind: 'widget',
      title: 'Loops on a disc and on an annulus',
      body: String.raw`Choose the space and a winding number $n$, then press play. The first half of the animation deforms the loop into the standard loop that winds $n$ times. The second half tries to contract it to the basepoint.

On the **disc** every loop contracts. On the **annulus** only $n = 0$ contracts. Any other loop is caught on the hole, and the counter stays put throughout: on the annulus the winding number is a homotopy invariant. (In the disc the loop may sweep across the centre, so counting turns about the centre proves nothing there.)`,
      widget: { type: 'MathLoopHomotopy', props: { space: 'annulus', n: 1 } },
    },
    {
      kind: 'explain',
      title: 'The group operation',
      body: String.raw`Define the **product** $\alpha \cdot \beta$ by running $\alpha$ at double speed, then $\beta$ at double speed:
$$(\alpha \cdot \beta)(s) = \begin{cases}\alpha(2s), & 0 \le s \le \tfrac12,\\ \beta(2s - 1), & \tfrac12 \le s \le 1.\end{cases}$$
This is continuous because both pieces give $x_0$ at $s = \tfrac12$.

On homotopy classes, $[\alpha][\beta] = [\alpha \cdot \beta]$ is well defined, and the group axioms hold:

- **Identity:** the constant loop $e$ at $x_0$.
- **Inverse:** $\alpha^{-1}(s) = \alpha(1 - s)$, the same path run backwards. Then $[\alpha][\alpha^{-1}] = [e]$: retrace your steps and reel the loop in.
- **Associativity** holds up to homotopy, which is all that is needed.

The resulting group is the **fundamental group** $\pi_1(X, x_0)$.`,
      widget: { type: 'SvgDiagram', props: { svg: concatSvg } },
    },
    {
      kind: 'recall',
      title: 'Group axioms',
      points: [
        'A group is a set with an associative operation, an identity element, and an inverse for each element.',
        String.raw`$\mathbb{Z}$ under addition is a group: identity $0$, inverse $-n$.`,
        'A group is **abelian** if the operation commutes.',
        String.raw`An **isomorphism** is a bijection preserving the operation; $G \cong H$ means "the same group".`,
      ],
      link: 'math/groups-intro',
    },
    {
      kind: 'mcq',
      prompt: String.raw`What is the inverse of the class $[\alpha]$ in $\pi_1(X, x_0)$?`,
      choices: [
        String.raw`The class of $\alpha$ traversed backwards, $s \mapsto \alpha(1 - s)$`,
        String.raw`The class of the constant loop at $x_0$`,
        String.raw`The class of $\alpha$ traversed twice`,
        String.raw`The class of $s \mapsto -\alpha(s)$`,
      ],
      answer: 0,
      why: String.raw`Going out and coming straight back can be reeled in to the constant loop, so $[\alpha][\alpha^{-1}] = [e]$. The constant loop is the **identity**, not the inverse. Traversing twice gives $[\alpha]^2$. Negating values makes no sense: $X$ need not have a minus sign.`,
    },
    {
      kind: 'explain',
      title: 'Computing the first examples',
      body: String.raw`- **Disc, plane, any convex set.** The straight-line homotopy $H(s,t) = (1-t)\gamma(s) + t x_0$ shrinks every loop to the basepoint. So $\pi_1 = \{e\}$, the trivial group. Such a space is called **simply connected**.
- **Circle.** $\pi_1(S^1) \cong \mathbb{Z}$. The class of a loop is determined by its **winding number**, the net number of anticlockwise turns, and winding numbers add when loops are concatenated. The annulus deformation-retracts onto its core circle, so it has the same $\pi_1 \cong \mathbb{Z}$.
- **Sphere $S^2$.** Every loop can be slid off a point it misses and then contracted, so $\pi_1(S^2) = \{e\}$. The sphere is simply connected even though it is not flat. A hole that a *loop* can detect is not the same as a cavity.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`In $\pi_1(S^1) \cong \mathbb{Z}$, a loop $\alpha$ winds 3 times anticlockwise and $\beta$ winds 5 times clockwise. What is the winding number of $\alpha \cdot \beta$?`,
      answer: -2,
      why: String.raw`Clockwise counts as negative, so $\beta$ has winding $-5$. Concatenation corresponds to addition in $\mathbb{Z}$: $3 + (-5) = -2$. The combined loop winds twice clockwise, and no deformation can change that.`,
    },
    {
      kind: 'explain',
      title: 'Why the proof of π₁(S¹) ≅ ℤ works',
      body: String.raw`The key tool is the **covering map** $p : \mathbb{R} \to S^1$, $p(t) = (\cos 2\pi t, \sin 2\pi t)$. Think of $\mathbb{R}$ as an infinite helix lying above the circle.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`**Path lifting.** Every loop $\gamma$ in $S^1$ starting at $(1,0)$ lifts to a unique path $\tilde\gamma$ in $\mathbb{R}$ with $\tilde\gamma(0) = 0$: walk up the helix, following $\gamma$ below.`,
            String.raw`Since $\gamma$ ends where it started, $\tilde\gamma(1)$ is an **integer** $n$: the winding number. Define $\deg(\gamma) = n$.`,
            String.raw`**Homotopy lifting.** A homotopy of loops lifts too. Its endpoint $\tilde\gamma_t(1)$ moves continuously in the integers, so it is constant. Homotopic loops have the same degree.`,
            String.raw`**Surjective:** the loop $\gamma_n(s) = p(ns)$ has degree $n$. **Injective:** if $\deg \gamma = 0$ then $\tilde\gamma$ is a loop in $\mathbb{R}$, which is contractible, and pushing that homotopy down contracts $\gamma$.`,
            String.raw`**Homomorphism:** lifting $\alpha \cdot \beta$ gives $\tilde\alpha$ followed by a shifted copy of $\tilde\beta$, ending at $\deg\alpha + \deg\beta$. Hence $\pi_1(S^1) \cong \mathbb{Z}$. ∎`,
          ],
        },
      },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`The sphere $S^2$ and the torus $T^2$ are homeomorphic.`,
      answer: false,
      why: String.raw`$\pi_1(S^2)$ is trivial but $\pi_1(T^2) \cong \mathbb{Z} \times \mathbb{Z}$, generated by the two circles $a$ and $b$ of the [glued square](@math/quotient-spaces). Homeomorphic spaces have isomorphic fundamental groups, so they cannot be homeomorphic. The loop around the doughnut hole never shrinks.`,
    },
    {
      kind: 'explain',
      title: 'A table of fundamental groups',
      body: String.raw`$\pi_1$ is a **topological invariant**: a homeomorphism $X \to Y$ induces an isomorphism $\pi_1(X) \to \pi_1(Y)$. More generally, homotopy equivalent spaces have isomorphic $\pi_1$.

- disc, $\mathbb{R}^n$, any convex set, and $S^n$ for $n \ge 2$: **trivial**
- circle, annulus, Möbius strip: $\mathbb{Z}$
- torus $T^2$: $\mathbb{Z} \times \mathbb{Z}$ (abelian)
- figure eight: the free group on 2 generators (non-abelian)
- $\mathbb{RP}^2$: $\mathbb{Z}/2$
- Klein bottle: $\langle a, b \mid abab^{-1}\rangle$ (non-abelian)

Each glued-square surface's group is generated by its edges, with the edge word as the relation. The torus word $aba^{-1}b^{-1} = e$ says exactly that $ab = ba$.

In $\mathbb{RP}^2$ the loop running from a point to its antipode is not contractible, but going round **twice** is: $a^2 = e$. The same $\mathbb{Z}/2$ turns up in $\mathbb{RP}^3$, which is the space of all 3D rotations: the loop of rotations through $360°$ cannot be deformed to a standstill, while the $720°$ loop can. That is the "belt trick" behind [spin](@quantum/spin).`,
    },
    {
      kind: 'match',
      prompt: 'Match each space to its fundamental group.',
      pairs: [
        ['circle', String.raw`$\mathbb{Z}$`],
        ['torus', String.raw`$\mathbb{Z} \times \mathbb{Z}$`],
        [String.raw`sphere $S^2$`, 'the trivial group'],
        [String.raw`$\mathbb{RP}^2$`, String.raw`$\mathbb{Z}/2$`],
      ],
      why: String.raw`The circle's invariant is the winding number, which lives in $\mathbb{Z}$. The torus has two independent loops that commute. On $S^2$ every loop slides off and shrinks. In $\mathbb{RP}^2$ the antipodal path is a loop that is non-trivial, but twice round is trivial, giving a group with two elements.`,
    },
    {
      kind: 'explain',
      title: 'What it is good for',
      body: String.raw`- **Brouwer fixed-point theorem (dimension 2).** Every continuous $f : D^2 \to D^2$ has a fixed point. If not, one builds a retraction of the disc onto its boundary circle, which would force the non-trivial group $\mathbb{Z} = \pi_1(S^1)$ to sit inside the trivial group $\pi_1(D^2)$.
- **The fundamental theorem of algebra** has a proof by winding numbers: as the radius grows, the image of a circle under a degree-$n$ polynomial winds $n$ times round $0$, which cannot happen if $0$ is never attained.
- **The Poincaré conjecture.** Poincaré asked in 1904 whether a closed, simply connected 3-manifold must be a 3-sphere. **Grigori Perelman proved it in three preprints posted to arXiv in 2002–2003**, using Richard Hamilton's Ricci flow with surgery. He was awarded the Fields Medal (2006) and the Clay Millennium Prize (2010), and declined both.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about the fundamental group are true?',
      choices: [
        'Homeomorphic spaces have isomorphic fundamental groups.',
        'A space with trivial fundamental group is called simply connected.',
        'The fundamental group is always abelian.',
        String.raw`For a path-connected space, the choice of basepoint does not change $\pi_1$ up to isomorphism.`,
        'A trivial fundamental group means the space has no holes of any kind.',
      ],
      answers: [0, 1, 3],
      why: String.raw`Invariance under homeomorphism is the point of the construction, and "simply connected" is the standard name for a trivial $\pi_1$ (with path-connectedness). Changing basepoint conjugates by a connecting path, so the group is unchanged up to isomorphism. The figure eight has a non-abelian group. And $S^2$ has trivial $\pi_1$ yet encloses a cavity, which higher homotopy or [homology](@math/euler-characteristic-homology) detects.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`Two loops are ___ if one can be continuously deformed into the other keeping the basepoint fixed. For the circle, the class of a loop is its ___ number, so $\pi_1(S^1) \cong \mathbb{Z}$. A space with trivial $\pi_1$ is ___ connected.`,
      bank: ['homotopic', 'winding', 'simply', 'homeomorphic', 'Betti', 'path'],
      answer: ['homotopic', 'winding', 'simply'],
      why: String.raw`Homotopy is the deformation relation on maps; homeomorphism is a relation between whole spaces. The winding number counts net anticlockwise turns. "Simply connected" means path-connected with trivial $\pi_1$; Betti numbers come from homology.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **homotopy** of loops is a continuous deformation that keeps the basepoint fixed. Homotopy classes of loops at $x_0$ form the **fundamental group** $\pi_1(X, x_0)$, with concatenation as the product and the reversed loop as the inverse.
- $\pi_1(\text{disc}) = \{e\}$, $\pi_1(S^1) \cong \mathbb{Z}$ by the winding number (proved by lifting paths to the helix $\mathbb{R} \to S^1$), $\pi_1(T^2) \cong \mathbb{Z}\times\mathbb{Z}$, $\pi_1(S^2) = \{e\}$.
- $\pi_1$ is a topological invariant, so different groups prove that spaces differ. It can be non-abelian, unlike homology.
- Poincaré introduced it in *Analysis Situs* (1895). His 1904 conjecture about simply connected 3-manifolds was proved by **Perelman (2002–2003)**.
- Next: a cruder but computable invariant, [$V - E + F$ and homology](@math/euler-characteristic-homology).`,
    },
  ],
  references: [
    { authors: 'A. Hatcher', title: 'Algebraic Topology', year: 2002, venue: 'Cambridge University Press (free online)', detail: 'Ch. 1, §1.1 (basic constructions; π₁(S¹) ≅ ℤ), §1.2 (van Kampen), §1.3 (covering spaces)', url: 'https://pi.math.cornell.edu/~hatcher/AT/ATpage.html' },
    { authors: 'J. R. Munkres', title: 'Topology', year: 2000, venue: '2nd ed., Prentice Hall', detail: 'Ch. 9, §51–55 (homotopy of paths, the fundamental group, covering spaces, π₁(S¹), retractions and the Brouwer fixed-point theorem)' },
    { authors: 'M. A. Armstrong', title: 'Basic Topology', year: 1983, venue: 'Springer (Undergraduate Texts in Mathematics)', detail: 'Ch. 5 (The fundamental group)' },
    { authors: 'H. Poincaré', title: 'Analysis Situs', year: 1895, venue: 'Journal de l’École Polytechnique, 2nd series, vol. 1, pp. 1–121' },
    { authors: 'G. Perelman', title: 'The entropy formula for the Ricci flow and its geometric applications', year: 2002, venue: 'arXiv:math/0211159', url: 'https://arxiv.org/abs/math/0211159' },
  ],
} satisfies LessonContent;
