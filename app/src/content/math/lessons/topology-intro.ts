import type { LessonContent } from '../../types';

// --- Rubber-sheet morph: square -> circle -> three-lobed blob -> square (same number of points so SMIL can morph).
const M = 72;
const shape = (r: (th: number) => number) =>
  Array.from({ length: M }, (_, i) => { const th = (2 * Math.PI * i) / M; const rr = r(th); return `${i ? 'L' : 'M'}${(110 + 62 * rr * Math.cos(th)).toFixed(1)},${(95 - 62 * rr * Math.sin(th)).toFixed(1)}`; }).join(' ') + ' Z';
const sq = shape((th) => 0.85 / Math.max(Math.abs(Math.cos(th)), Math.abs(Math.sin(th))));
const ci = shape(() => 1);
const blob = shape((th) => 0.8 + 0.28 * Math.cos(3 * th) + 0.08 * Math.sin(2 * th));
const morphSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <path d="${sq}" fill="var(--c2)" fill-opacity="0.15" stroke="var(--c2)" stroke-width="2.5" stroke-linejoin="round">
    <animate attributeName="d" values="${sq};${ci};${blob};${sq}" keyTimes="0;0.33;0.66;1" dur="9s" repeatCount="indefinite"/>
  </path>
  <circle cx="110" cy="95" r="4" fill="var(--c5)"/>
  <text x="110" y="190" text-anchor="middle" font-size="10" fill="var(--muted)">same shape to a topologist: no tearing, no gluing</text>
  <g font-size="10" fill="var(--fg)">
    <text x="200" y="40">Changes freely:</text>
    <text x="206" y="56" fill="var(--muted)">• lengths, angles</text>
    <text x="206" y="70" fill="var(--muted)">• area, corners</text>
    <text x="206" y="84" fill="var(--muted)">• straightness</text>
    <text x="200" y="112">Never changes:</text>
    <text x="206" y="128" fill="var(--c1)">• one piece</text>
    <text x="206" y="142" fill="var(--c1)">• one hole (inside</text>
    <text x="214" y="155" fill="var(--c1)">vs outside the curve)</text>
  </g>
</svg>`;

// --- Letters as thin curves, grouped by homeomorphism type. Degree-3/4 junctions marked.
const L = (d: string, x: number, y: number) => `<path d="${d}" transform="translate(${x},${y})" fill="none" stroke="var(--c2)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
const dot = (x: number, y: number, c = 'var(--c5)') => `<circle cx="${x}" cy="${y}" r="3.2" fill="${c}"/>`;
const letters = {
  C: 'M22,4 C4,0 0,14 0,20 C0,28 6,38 22,36',
  L: 'M2,0 V36 H22',
  S: 'M22,6 C14,-2 0,2 2,11 C4,19 20,17 21,26 C22,35 6,40 0,32',
  O: 'M12,0 C-4,0 -4,36 12,36 C28,36 28,0 12,0 Z',
  D: 'M2,0 V36 C30,36 30,0 2,0 Z',
  T: 'M0,0 H24 M12,0 V36',
  Y: 'M0,0 L12,16 L24,0 M12,16 V36',
  E: 'M22,0 H2 V36 H22 M2,18 H18',
  X: 'M0,0 L24,36 M24,0 L0,36',
};
const lettersSvg = `<svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <g font-size="10" fill="var(--muted)">
    <text x="10" y="16">no junctions, two ends</text>
    <text x="180" y="16">one loop, no ends</text>
    <text x="10" y="102">one junction where 3 strands meet</text>
    <text x="230" y="102">4 strands</text>
  </g>
  ${L(letters.C, 14, 30)}${L(letters.L, 54, 30)}${L(letters.S, 92, 30)}
  ${L(letters.O, 188, 30)}${L(letters.D, 236, 30)}
  ${L(letters.T, 14, 116)}${dot(26, 116)}
  ${L(letters.Y, 64, 116)}${dot(76, 132)}
  ${L(letters.E, 112, 116)}${dot(114, 134)}
  ${L(letters.X, 240, 116)}${dot(252, 134)}
  <rect x="6" y="22" width="130" height="54" rx="8" fill="none" stroke="var(--grid)"/>
  <rect x="176" y="22" width="100" height="54" rx="8" fill="none" stroke="var(--grid)"/>
  <rect x="6" y="108" width="150" height="54" rx="8" fill="none" stroke="var(--grid)"/>
  <rect x="226" y="108" width="54" height="54" rx="8" fill="none" stroke="var(--grid)"/>
  <text x="160" y="186" text-anchor="middle" font-size="10" fill="var(--fg)">Same box ⇔ homeomorphic (as thin curves).</text>
  <text x="160" y="200" text-anchor="middle" font-size="10" fill="var(--c5)">A junction point maps to a junction point with as many strands.</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A coffee mug is a doughnut',
      body: String.raw`Make a coffee mug out of soft clay. Without tearing it or sticking new parts together, you can squash the cup part into the handle until you have a doughnut. A topologist calls the two **the same shape**.

**Topology** studies the properties of a shape that survive any continuous deformation: stretching, bending, squashing. Tearing and gluing are not allowed. Lengths, angles, areas and straight lines all get lost. What remains is coarser but very robust: *how many pieces*, *how many holes*, *whether there are loose ends*.

People sometimes call it "rubber-sheet geometry". That phrase is roughly right. The precise version comes on the next cards.`,
    },
    {
      kind: 'widget',
      title: 'Rubber-sheet geometry',
      body: String.raw`A square outline turns into a circle and then into a three-lobed blob. Corners, side lengths and enclosed area all change. Two things never change: the curve stays in one piece, and it always separates the plane into an inside (where the red point sits) and an outside.`,
      widget: { type: 'SvgDiagram', props: { svg: morphSvg } },
    },
    {
      kind: 'explain',
      title: 'Homeomorphisms',
      body: String.raw`Recall from [sets & functions](@math/sets-functions) that a **bijection** pairs off the points of two sets exactly. A **homeomorphism** $f : X \to Y$ is a bijection such that

- $f$ is **continuous** (nearby points go to nearby points: no tearing), and
- its inverse $f^{-1}$ is **continuous** too (no gluing).

If one exists, $X$ and $Y$ are **homeomorphic**, written $X \cong Y$.

**Example.** The open interval $(-1, 1)$ is homeomorphic to the whole line $\mathbb{R}$, via $f(x) = \tan(\pi x / 2)$. Its inverse $y \mapsto \tfrac{2}{\pi}\arctan y$ is continuous too. So being "short" or "bounded" is **not** a topological property.`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['tan(PI*x/2)'], x: [-1, 1], y: [-8, 8], xLabel: 'x in (−1, 1)', yLabel: 'tan(πx/2)' },
        caption: String.raw`As $x \to \pm 1$ the image runs off to $\pm\infty$: the short open interval is stretched over all of $\mathbb{R}$.`,
      },
    },
    {
      kind: 'explain',
      title: 'Why the inverse must be continuous',
      body: String.raw`Wrap the half-open interval $[0, 2\pi)$ around the circle by $f(t) = (\cos t, \sin t)$. This is a continuous bijection onto the circle $S^1$. But it is **not** a homeomorphism.

Its inverse takes points just *below* $(1, 0)$ on the circle to numbers near $2\pi$. It takes $(1,0)$ itself to $0$. Points that are close on the circle get sent far apart, so $f^{-1}$ tears the circle open at $(1, 0)$.

Both conditions matter. "Continuous" alone allows gluing: here the two ends of the interval are glued together.`,
    },
    {
      kind: 'mcq',
      prompt: 'Which property of a shape is preserved by every homeomorphism?',
      choices: [
        'Being in one piece (connected)',
        'The total length of its boundary',
        'Having a right angle somewhere',
        'Being bounded (fitting inside some disc)',
      ],
      answer: 0,
      why: String.raw`A continuous map cannot tear one piece into two, so connectedness survives. Lengths and angles are destroyed by stretching (the square-to-circle morph). Boundedness is not topological either: $(-1, 1) \cong \mathbb{R}$, and only the interval is bounded.`,
    },
    {
      kind: 'widget',
      title: 'Letters as topological spaces',
      body: String.raw`Think of capital letters (in a plain sans-serif font) as curves of zero thickness. Junction points give a simple invariant. A homeomorphism must send a point where 3 strands meet to a point where 3 strands meet: remove such a point and the curve falls into 3 pieces, and a homeomorphism must match pieces with pieces.

So **T ≅ Y ≅ E**, each with one 3-way junction. **C ≅ L ≅ S**, which are bent intervals. **O ≅ D**, which are loops. **X**, with a 4-way junction, is homeomorphic to none of the others shown.`,
      widget: { type: 'SvgDiagram', props: { svg: lettersSvg } },
    },
    {
      kind: 'numeric',
      prompt: 'Remove the crossing point from the letter X (a thin curve). Into how many separate pieces does it fall?',
      answer: 4,
      why: 'The four arms become disconnected from one another. For T or Y the answer would be 3, so X is not homeomorphic to them. Counting pieces left after removing a point is a topological invariant.',
    },
    {
      kind: 'explain',
      title: 'The cut-point trick',
      body: String.raw`Invariants prove that two shapes are **not** the same. Is the circle $S^1$ homeomorphic to the open interval $(0, 1)$?

Remove any point from $(0, 1)$: it falls into **two** pieces. Remove any point from $S^1$: it stays in **one** piece (an arc). Suppose $f : S^1 \to (0,1)$ were a homeomorphism. Remove a point $p$ from the circle and the matching point $f(p)$ from the interval. Then $f$ would restrict to a homeomorphism of the one-piece space $S^1 \setminus \{p\}$ with the two-piece space $(0,1) \setminus \{f(p)\}$, which is impossible. So $S^1 \not\cong (0, 1)$.

The same idea shows $\mathbb{R} \not\cong \mathbb{R}^2$. Removing a point disconnects the line but not the plane. You will prove this properly in [compactness & connectedness](@math/compactness-connectedness).`,
    },
    {
      kind: 'match',
      prompt: 'Match each letter (as a thin curve) to a letter it is homeomorphic to.',
      pairs: [
        ['T', 'Y'],
        ['O', 'D'],
        ['L', 'S'],
        ['X', '+ (a plus sign)'],
      ],
      why: 'Count junctions and how many strands meet at each. T and Y each have one 3-way junction and three ends. O and D are single loops. L and S are bent intervals. X and + each have one 4-way junction.',
    },
    {
      kind: 'truefalse',
      prompt: 'The outline of a square and a circle are homeomorphic.',
      answer: true,
      why: String.raw`Radial projection from the centre, $p \mapsto p / |p|$, is a continuous bijection from the square outline to the unit circle. Its inverse is continuous too. Corners are a geometric feature, not a topological one.`,
    },
    {
      kind: 'explain',
      title: 'Where topology came from',
      body: String.raw`- **1736:** Euler solves the Königsberg bridge problem. Only *which land masses connect to which* matters; distances are irrelevant.
- **1758:** Euler publishes $V - E + F = 2$ for polyhedra (see [Euler characteristic](@math/euler-characteristic-homology)).
- **1847:** J. B. Listing coins the word *Topologie*.
- **1895:** Poincaré's *Analysis Situs* ("analysis of position") founds **algebraic topology**. It attaches algebraic objects, such as the [fundamental group](@math/fundamental-group), to spaces, so that different algebra proves different shapes.

Today topology is used well beyond pure mathematics: configuration spaces of robots, topological phases of matter, knotted DNA, and the "shape" of data sets.`,
    },
    {
      kind: 'multi',
      prompt: 'Which pairs are homeomorphic?',
      choices: [
        String.raw`The open interval $(0, 1)$ and the line $\mathbb{R}$`,
        String.raw`The surface of a cube and the round sphere`,
        String.raw`A filled-in square and a filled-in disc`,
        String.raw`The circle and the closed interval $[0, 1]$`,
        'The surface of a doughnut (torus) and the sphere',
      ],
      answers: [0, 1, 2],
      why: String.raw`Rescale and use tan for the interval and the line. Radial projection works for the cube and the sphere, and for the square and the disc. The circle and $[0,1]$ differ: removing an interior point disconnects $[0,1]$ but never the circle. The torus has a loop that cannot shrink to a point, and the sphere does not (see the [fundamental group](@math/fundamental-group)), so they are not homeomorphic.`,
    },
    {
      kind: 'fill',
      prompt: 'A homeomorphism is a ___ that is ___ and has a continuous ___.',
      bank: ['bijection', 'continuous', 'inverse', 'derivative', 'isometry', 'linear'],
      answer: ['bijection', 'continuous', 'inverse'],
      why: 'Continuity forbids tearing and continuity of the inverse forbids gluing. An isometry (which preserves distance) is far stronger than needed. Derivatives and linearity belong to differential geometry and linear algebra, not to topology.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Topology studies properties unchanged by continuous deformation. Lengths, angles and area are lost. Pieces, holes and junctions survive.
- A **homeomorphism** is a continuous bijection with continuous inverse. Both directions matter: $[0, 2\pi) \to S^1$ is a continuous bijection but not a homeomorphism.
- $(-1,1) \cong \mathbb{R}$, so size and boundedness are not topological.
- **Invariants** prove that spaces differ. Removing a point and counting pieces shows $S^1 \not\cong (0,1)$ and separates the letters.
- Next: the precise language of [open sets](@math/open-sets-continuity) makes "continuous" meaningful for any space.`,
    },
  ],
  references: [
    { authors: 'M. A. Armstrong', title: 'Basic Topology', year: 1983, venue: 'Springer (Undergraduate Texts in Mathematics)', detail: 'Ch. 1 (Introduction: Euler’s theorem, topological equivalence)' },
    { authors: 'J. R. Munkres', title: 'Topology', year: 2000, venue: '2nd ed., Prentice Hall', detail: 'Ch. 2, §12 and §18 (topological spaces; continuous functions and homeomorphisms)' },
    { authors: 'A. Hatcher', title: 'Algebraic Topology', year: 2002, venue: 'Cambridge University Press (free online)', detail: 'Ch. 0 (Some underlying geometric notions)', url: 'https://pi.math.cornell.edu/~hatcher/AT/ATpage.html' },
    { authors: 'D. S. Richeson', title: 'Euler’s Gem: The Polyhedron Formula and the Birth of Topology', year: 2008, venue: 'Princeton University Press' },
  ],
} satisfies LessonContent;
