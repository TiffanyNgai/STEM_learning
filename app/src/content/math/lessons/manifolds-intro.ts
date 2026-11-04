import type { LessonContent } from '../../types';

const figureEightSvg = String.raw`<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" font-size="10" font-family="inherit">
  <text x="80" y="16" text-anchor="middle" fill="var(--fg)" font-weight="bold">circle: a 1-manifold</text>
  <circle cx="80" cy="80" r="40" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
  <circle cx="110" cy="54" r="15" fill="var(--c1)" opacity="0.18"/>
  <text x="80" y="140" text-anchor="middle" fill="var(--muted)">every point has an arc around it</text>
  <text x="240" y="16" text-anchor="middle" fill="var(--fg)" font-weight="bold">figure eight: not a manifold</text>
  <path d="M240,80 C240,52 282,52 282,80 C282,108 240,108 240,80 C240,52 198,52 198,80 C198,108 240,108 240,80Z" fill="none" stroke="var(--c5)" stroke-width="2.5"/>
  <circle cx="240" cy="80" r="16" fill="var(--c5)" opacity="0.18"/>
  <circle cx="240" cy="80" r="3.5" fill="var(--c5)"/>
  <text x="240" y="128" text-anchor="middle" fill="var(--muted)">the crossing point has</text>
  <text x="240" y="140" text-anchor="middle" fill="var(--muted)">an X, not an arc, around it</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Flat enough, close enough',
      body: String.raw`For most of history people lived on a sphere and drew flat maps of it. That works because a small patch of the Earth's surface is *almost* a piece of a plane — and the price is that no single flat map covers the whole globe. You need an **atlas**: several overlapping maps, plus rules for how they fit together where they overlap.

A **manifold** is any space that works this way: curved, knotted or glued however you like, but **locally like $\mathbb{R}^n$**. The sphere, the torus (a doughnut surface), the set of all rotations of a rigid body, the four-dimensional spacetime of relativity — all manifolds. Differential geometry is the art of doing calculus on them using the atlas.`,
    },
    {
      kind: 'explain',
      title: 'Charts: one map at a time',
      body: String.raw`Fix a set $M$ with a [topology](@math/topology-intro) (so we know which subsets are open and what "continuous" means). A **chart** of dimension $n$ is a pair $(U, \varphi)$:

- $U \subseteq M$ is an open set — a region of $M$;
- $\varphi : U \to \widehat U \subseteq \mathbb{R}^n$ is a **homeomorphism** onto an open subset of $\mathbb{R}^n$: a continuous bijection with a continuous inverse.

So $\varphi$ hands every point of $U$ a list of $n$ numbers — its **coordinates** — and nothing is torn or glued in the process. $M$ is a **topological $n$-manifold** if every point lies in some chart (plus two mild technical conditions: $M$ is Hausdorff, and has a countable basis of open sets, which rule out pathological examples).`,
    },
    {
      kind: 'widget',
      title: 'An atlas for the circle',
      body: String.raw`The unit circle $S^1 = \{x^2 + y^2 = 1\}$ with two charts, both by **stereographic projection**. From the north pole $N=(0,1)$, draw the line through $P$ and read off where it crosses the horizontal axis: $u = x/(1-y)$. From the south pole $S=(0,-1)$: $v = x/(1+y)$. Drag $P$ right round. Each chart covers everything except its own pole, and together they cover $S^1$.`,
      widget: { type: 'MathStereoAtlas', props: { theta: 50 } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Why does the circle need **two** charts rather than one?`,
      choices: [
        String.raw`Because $S^1$ is not connected`,
        String.raw`Because $S^1$ is not homeomorphic to any open subset of $\mathbb{R}$, so no single chart can cover it`,
        String.raw`Because $S^1$ lives in $\mathbb{R}^2$, and a chart may not lower dimension`,
        String.raw`Because stereographic projection is not continuous`,
      ],
      answer: 1,
      why: String.raw`A chart is a homeomorphism onto an *open* subset of $\mathbb{R}^n$. The circle is compact and an open subset of $\mathbb{R}$ is not (except the empty set), so no chart can cover all of $S^1$ — you always lose at least one point. The circle is perfectly connected, and stereographic projection is continuous on its domain; and plenty of 1-manifolds, like the circle, sit happily inside $\mathbb{R}^2$.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Take $P = (3/5,\ 4/5)$ on the unit circle. Its coordinate in the north-pole chart is $u = x/(1-y)$. What is $u$?`,
      answer: 3,
      why: String.raw`$u = (3/5)/(1 - 4/5) = (3/5)/(1/5) = 3$. In the other chart $v = (3/5)/(1 + 4/5) = (3/5)/(9/5) = 1/3$ — and notice $uv = 1$, which is the transition rule we meet next.`,
    },
    {
      kind: 'explain',
      title: 'Transition maps make it smooth',
      body: String.raw`Where two charts overlap, a point gets two sets of coordinates, and the dictionary between them is the **transition map** $\varphi_\beta \circ \varphi_\alpha^{-1}$. This is a map between open subsets of $\mathbb{R}^n$ — ordinary multivariable calculus territory.

For the circle: on the overlap (everything but the two poles), $v = 1/u$, which is smooth there because $u \neq 0$.

A **smooth ($C^\infty$) manifold** is a topological manifold with an atlas all of whose transition maps are infinitely differentiable. That one condition is what lets us say a function $f: M \to \mathbb{R}$ is smooth — compute $f \circ \varphi^{-1}$ in any chart; if transitions are smooth, the answer does not depend on which chart you picked.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`If a point lies in two charts, the two coordinate descriptions must agree.`,
      answer: false,
      why: String.raw`They almost never agree — on the circle the same point has $u = 3$ and $v = 1/3$. What is required is only that the *translation* between them, here $v = 1/u$, be smooth. Coordinates are labels we choose; the manifold does not know about them.`,
    },
    {
      kind: 'recall',
      title: 'From topology',
      points: [
        'A topology tells you which subsets are open; continuity is "preimages of open sets are open".',
        'A homeomorphism is a continuous bijection with a continuous inverse — a reversible deformation.',
        'Compact spaces (like the sphere and the circle) cannot be homeomorphic to an open subset of ℝⁿ.',
        'Gluing a square along its edges builds the torus, the Möbius strip and the Klein bottle.',
      ],
      link: 'math/topology-intro',
    },
    {
      kind: 'widget',
      title: 'The torus, built by gluing',
      body: String.raw`A square with opposite edges identified *is* the torus $T^2$. It is a 2-manifold: a point in the interior obviously has a flat disc around it, and so does a point on an edge or at a corner once you remember what is glued to what. (Charts near the edges simply use patches that straddle the gluing.) Walk the bug off one side and it reappears on the other.`,
      widget: { type: 'MathGluingSquare', props: { surface: 'torus', choices: ['torus', 'cylinder', 'klein'] } },
    },
    {
      kind: 'explain',
      title: 'A zoo of manifolds',
      body: String.raw`- $\mathbb{R}^n$ itself, and any open subset of it — one chart, the identity.
- The $n$-sphere $S^n = \{x \in \mathbb{R}^{n+1} : |x| = 1\}$, dimension $n$; two stereographic charts always suffice.
- The torus $T^2 = S^1 \times S^1$, dimension 2. Products of manifolds are manifolds, with dimensions adding.
- $\mathrm{GL}(n,\mathbb{R})$, the invertible $n\times n$ matrices: an open subset of $\mathbb{R}^{n^2}$ (where $\det \neq 0$), dimension $n^2$. The rotation group $\mathrm{SO}(3)$ is a 3-dimensional manifold inside it — see [Lie groups](@math/lie-groups-intro).
- The configuration space of a robot arm with $k$ revolute joints: a $k$-torus.
- Spacetime in general relativity: a 4-manifold with extra geometric structure.

Not manifolds: a figure eight (the crossing point has four directions leaving it), a cone's tip in the smooth sense, or a square's corner if you demand smooth charts.`,
      widget: { type: 'SvgDiagram', props: { svg: figureEightSvg } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Which of these is **not** a 2-dimensional manifold?`,
      choices: [
        'The surface of a doughnut (torus)',
        'The open Möbius strip (its boundary edge removed)',
        'Two planes in ℝ³ crossing along a line, taken together',
        'The sphere S²',
      ],
      answer: 2,
      why: String.raw`Near a point on the crossing line of two planes, the space looks like two sheets meeting — no neighbourhood is homeomorphic to a disc, so it fails the local condition. The torus, the sphere and the open Möbius strip are all genuine surfaces; every point of the open Möbius strip has a disc around it, even though the strip is non-orientable. (The *closed* Möbius strip, with its edge, is a manifold *with boundary* — a slightly larger category.)`,
    },
    {
      kind: 'explain',
      title: 'Smooth maps and diffeomorphisms',
      body: String.raw`A map $F : M \to N$ between smooth manifolds is **smooth** if, read in charts on both sides, it is a smooth map between open subsets of Euclidean spaces: $\psi \circ F \circ \varphi^{-1}$ is $C^\infty$ for charts $\varphi$ on $M$ and $\psi$ on $N$.

$F$ is a **diffeomorphism** if it is a smooth bijection with a smooth inverse; then $M$ and $N$ are "the same" manifold wearing different clothes. Diffeomorphism is to smooth manifolds what [isomorphism](@math/homomorphisms-isomorphisms) is to groups.

Every smooth $n$-manifold can in fact be embedded as a subset of some $\mathbb{R}^N$ (Whitney, 1936 — $N = 2n+1$ suffices; Whitney sharpened this to $N = 2n$ in 1944). So you may always picture a manifold as a curved shape in a big Euclidean space. But almost everything we do will be **intrinsic**: computed inside $M$, with no reference to a surrounding space.`,
    },
    {
      kind: 'order',
      prompt: String.raw`Put the steps in order for checking that a set $M$ is a smooth $n$-manifold.`,
      steps: [
        String.raw`Give $M$ a topology (and check it is Hausdorff and second countable).`,
        String.raw`Cover $M$ by open sets $U_\alpha$.`,
        String.raw`On each $U_\alpha$, build a homeomorphism $\varphi_\alpha$ onto an open subset of $\mathbb{R}^n$.`,
        String.raw`On every overlap $U_\alpha \cap U_\beta$, check that $\varphi_\beta \circ \varphi_\alpha^{-1}$ is $C^\infty$.`,
      ],
      why: String.raw`You cannot talk about *open* sets or *homeomorphisms* before there is a topology, and you cannot check transition maps before the charts exist. The last step is the only one that uses differentiability — it is what upgrades a topological manifold to a smooth one.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`A ___ is a homeomorphism from an open piece of $M$ onto an open piece of $\mathbb{R}^n$. A collection of them covering $M$ is an ___. The manifold is smooth when every ___ map is $C^\infty$.`,
      bank: ['chart', 'atlas', 'transition', 'metric', 'geodesic', 'quotient'],
      answer: ['chart', 'atlas', 'transition'],
      why: String.raw`Chart → atlas → transition maps is the whole construction. A metric and geodesics are extra structure added much later; a quotient is one way of *building* manifolds (as with the torus from a square), not part of the definition.`,
    },
    {
      kind: 'match',
      prompt: 'Match each manifold to its dimension.',
      pairs: [
        [String.raw`$S^1$ (the circle)`, '1'],
        [String.raw`$T^2 = S^1\times S^1$`, '2'],
        [String.raw`$S^1 \times \mathbb{R}^2$ (a solid-torus-like space)`, '3'],
        [String.raw`$S^4$ (the 4-sphere)`, '4'],
        [String.raw`$\mathrm{GL}(3,\mathbb{R})$`, '9'],
      ],
      why: String.raw`$S^n$ has dimension $n$, so the circle is 1 and $S^4$ is 4; products add dimensions ($1+1 = 2$ and $1+2 = 3$); $\mathrm{GL}(3,\mathbb{R})$ is an open subset of the $3\times 3$ matrices, so $3^2 = 9$. Dimension is the number of coordinates a chart hands you, never the dimension of any space the manifold happens to sit inside.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **chart** gives coordinates to a patch of a space; an **atlas** of charts covers it. A topological $n$-manifold is a (Hausdorff, second countable) space with an atlas of $\mathbb{R}^n$-valued charts.
- **Transition maps** translate between overlapping charts. If all of them are $C^\infty$, the manifold is **smooth**, and "smooth function" makes sense independent of chart.
- The circle needs two charts; stereographic projection gives them, with transition $v = 1/u$.
- Spheres, tori, matrix groups, robot configuration spaces and spacetime are all manifolds; a figure eight is not.
- Everything we build next must be **chart-independent** — that is the discipline of the subject.

Next: what a velocity vector means when there is no surrounding space to point into → [tangent spaces](@math/tangent-spaces).`,
    },
  ],
  references: [
    { authors: 'L. W. Tu', title: 'An Introduction to Manifolds', year: 2011, venue: '2nd ed., Springer Universitext', detail: '§5 (manifolds, charts, atlases), §6 (smooth maps on a manifold)' },
    { authors: 'J. M. Lee', title: 'Introduction to Smooth Manifolds', year: 2013, venue: '2nd ed., Springer GTM 218', detail: 'Ch. 1 (smooth manifolds: topological manifolds, smooth structures, examples), Ch. 2 (smooth maps, diffeomorphisms)' },
    { authors: 'T. Needham', title: 'Visual Differential Geometry and Forms: A Mathematical Drama in Five Acts', year: 2021, venue: 'Princeton University Press', detail: 'Act I (the nature of space)' },
    { authors: 'H. Whitney', title: 'Differentiable manifolds', year: 1936, venue: 'Annals of Mathematics 37(3), 645–680', detail: 'The embedding theorem: every smooth n-manifold embeds in ℝ^(2n+1)' },
  ],
} satisfies LessonContent;
