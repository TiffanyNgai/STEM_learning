import type { LessonContent } from '../../types';

// --- A square triangulated two ways: both give V − E + F = 1 for the filled square (a disc).
const grid = (x0: number, label: string, extra: string, counts: string) => `
  <text x="${x0 + 55}" y="18" text-anchor="middle" font-size="10" fill="var(--fg)">${label}</text>
  <rect x="${x0}" y="30" width="110" height="110" fill="var(--c2)" fill-opacity="0.1" stroke="var(--c2)" stroke-width="2"/>
  ${extra}
  <text x="${x0 + 55}" y="162" text-anchor="middle" font-size="10" fill="var(--muted)">${counts}</text>
  <text x="${x0 + 55}" y="178" text-anchor="middle" font-size="11" fill="var(--c1)">V − E + F = 1</text>`;
const dots = (pts: [number, number][]) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="var(--c3)"/>`).join('');
const triSvg = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  ${grid(20, 'one diagonal',
    `<line x1="20" y1="140" x2="130" y2="30" stroke="var(--c2)" stroke-width="2"/>${dots([[20, 30], [130, 30], [20, 140], [130, 140]])}`,
    'V = 4, E = 5, F = 2')}
  ${grid(190, 'centre point added',
    `<line x1="190" y1="30" x2="300" y2="140" stroke="var(--c2)" stroke-width="2"/><line x1="300" y1="30" x2="190" y2="140" stroke="var(--c2)" stroke-width="2"/>${dots([[190, 30], [300, 30], [190, 140], [300, 140], [245, 85]])}`,
    'V = 5, E = 8, F = 4')}
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Count the pieces of a shape',
      body: String.raw`Cut a shape into vertices (corners), edges and faces, then compute
$$\chi = V - E + F .$$
For the surface of a cube: $V = 8$, $E = 12$, $F = 6$, so $\chi = 8 - 12 + 6 = 2$. For a tetrahedron: $4 - 6 + 4 = 2$. For a dodecahedron: $20 - 30 + 12 = 2$.

Always $2$. **Euler** announced this in a 1750 letter to Goldbach and published it, with an attempted proof, in the *Novi Commentarii* of the St Petersburg Academy in 1758. The remarkable part is that the answer does not depend on how you cut the surface up, only on the surface itself. $\chi$ is called the **Euler characteristic**.`,
    },
    {
      kind: 'widget',
      title: 'V − E + F never moves',
      body: String.raw`Rotate a solid and watch the counters. Then change the subdivision:

- **split an edge**: $V$ and $E$ each go up by 1, and $V - E$ is unchanged;
- **cut a face** with a diagonal: $E$ and $F$ each go up by 1;
- **cone a face**: an $n$-gon becomes $n$ triangles around a new centre point, so $V{+}1$, $E{+}n$, $F{+}(n-1)$, and the alternating sum again cancels.

Every sphere-like solid gives $\chi = 2$. Switch to the torus and you get $\chi = 0$, whatever you do to it.`,
      widget: { type: 'MathEulerCounter', props: { shape: 'cube' } },
    },
    {
      kind: 'numeric',
      prompt: 'An icosahedron has 20 triangular faces, and every edge is shared by exactly 2 faces. How many edges does it have?',
      answer: 30,
      why: String.raw`Each of the 20 triangles has 3 edges, giving $20 \times 3 = 60$ edge-slots, but each edge is counted twice: $E = 60/2 = 30$. Euler's formula then gives $V = 2 - F + E = 2 - 20 + 30 = 12$, which is right.`,
    },
    {
      kind: 'explain',
      title: 'Why it is the same for every subdivision',
      body: String.raw`The modifications above are **elementary moves**, and each leaves $V - E + F$ alone. Any two subdivisions of the same surface have a common refinement reachable by such moves, so they give the same $\chi$. A cleaner way to say it: $\chi$ is determined by homology, which is defined without reference to any subdivision.

Here is the classical proof for the sphere, with a subdivision into polygons:`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Remove one face. The remaining surface can be flattened into the plane: a connected planar graph whose complement has $F - 1$ bounded regions. We must show $V - E + F' = 1$ where $F' = F - 1$.`,
            String.raw`Triangulate every region by adding diagonals. Each diagonal adds 1 to $E$ and 1 to $F'$, so $V - E + F'$ is unchanged.`,
            String.raw`Now strip the figure from the outside, repeatedly. Removing a boundary triangle that touches the outside along **one** edge removes 1 edge and 1 face: no change.`,
            String.raw`Removing one that touches along **two** edges removes 2 edges, 1 vertex and 1 face: again no change ($-1 + 2 - 1 = 0$ in $V - E + F'$).`,
            String.raw`Continue until a single triangle is left: $V = 3$, $E = 3$, $F' = 1$, giving $3 - 3 + 1 = 1$. Restoring the removed face gives $V - E + F = 2$. ∎`,
          ],
          notes: ['This is Cauchy’s 1813 argument.', '', '', '', 'Legendre (1794) gave a different proof using spherical angle sums.'],
        },
      },
    },
    {
      kind: 'widget',
      title: 'χ of a disc',
      body: String.raw`Not every shape has $\chi = 2$. A filled square is a **disc**, and both subdivisions below give $\chi = 1$. (A disc is the sphere minus one face, so its $\chi$ is one less.) For a single point $\chi = 1$; for a circle, $V = E$ and $F = 0$, so $\chi = 0$.`,
      widget: { type: 'SvgDiagram', props: { svg: triSvg } },
    },
    {
      kind: 'explain',
      title: 'χ of the glued surfaces',
      body: String.raw`Count using the [square with glued edges](@math/quotient-spaces). The square alone has 4 vertices, 4 edges, 1 face, but gluing merges them.

- **Torus** ($aba^{-1}b^{-1}$): all 4 corners become one point and the 4 edges become 2. So $V = 1$, $E = 2$, $F = 1$ and $\chi = 1 - 2 + 1 = 0$.
- **Klein bottle** ($abab^{-1}$): again $V = 1$, $E = 2$, $F = 1$, so $\chi = 0$.
- **$\mathbb{RP}^2$** ($abab$): the corners fall into 2 classes, the edges into 2, so $\chi = 2 - 2 + 1 = 1$.
- **Sphere** ($abb^{-1}a^{-1}$): the corners fall into 3 classes, so $V = 3$, $E = 2$, $F = 1$ and $\chi = 3 - 2 + 1 = 2$. ✓

In general a closed **orientable** surface of genus $g$ (a doughnut with $g$ holes) has $\chi = 2 - 2g$, and a non-orientable one built from $k$ projective planes has $\chi = 2 - k$.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`A closed orientable surface has $\chi = -4$. How many holes (genus $g$) does it have?`,
      choices: ['3', '2', '4', '6'],
      answer: 0,
      why: String.raw`Solve $2 - 2g = -4$: $2g = 6$, so $g = 3$. A triple doughnut. Dropping the constant gives $-2g = -4$ and the wrong answer $2$; dropping the factor 2 gives $2 - g = -4$ and the wrong answer $6$; and $4$ is just $|\chi|$. $\chi$ falls by 2 for each extra handle.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`The torus and the Klein bottle have the same Euler characteristic, so they are homeomorphic.`,
      answer: false,
      why: String.raw`Both have $\chi = 0$, but the torus is orientable and the Klein bottle is not, so they differ. Their fundamental groups differ too: $\mathbb{Z}\times\mathbb{Z}$ is abelian, the Klein bottle's group is not. An invariant can only prove spaces **different**; equal invariants never prove they are the same.`,
    },
    {
      kind: 'explain',
      title: 'From counting to homology',
      body: String.raw`Why does the alternating sum work? Because it is the shadow of a much finer invariant.

Build the space from **cells**: points (0-cells), edges (1-cells), faces (2-cells), solid blocks (3-cells). The **boundary** of an edge is its two endpoints; the boundary of a face is its edge loop. Formal sums of $n$-cells are called **$n$-chains**, and the boundary map $\partial$ extends to them linearly.

The crucial identity is $\partial \circ \partial = 0$: the boundary of a boundary is empty. The boundary of a disc is a circle, and the circle has no endpoints.

- A **cycle** is a chain with $\partial c = 0$: a closed loop or closed surface.
- A **boundary** is a chain of the form $\partial(\text{something})$: a loop that bounds a filled-in region.
- The $n$-th **homology group** is $H_n = \{\text{cycles}\} / \{\text{boundaries}\}$: the cycles that do **not** bound anything, counted up to those that do.`,
    },
    {
      kind: 'explain',
      title: 'Betti numbers count holes by dimension',
      body: String.raw`For nice spaces $H_n$ is a sum of copies of $\mathbb{Z}$ plus possibly finite "torsion" parts. The number of copies of $\mathbb{Z}$ is the **Betti number** $b_n$, named after Enrico Betti, whose 1871 work Poincaré built on.

- $b_0$ = number of connected pieces;
- $b_1$ = number of independent loops that do not bound (tunnels);
- $b_2$ = number of enclosed cavities.

Examples. Circle: $b_0 = 1$, $b_1 = 1$. Sphere $S^2$: $b_0 = 1$, $b_1 = 0$, $b_2 = 1$ (no tunnels, one cavity). Torus: $b_0 = 1$, $b_1 = 2$ (through the hole and round the tube), $b_2 = 1$.

Homology is **abelian** and computable by linear algebra over the integers, which is why it scales to high dimensions where the [fundamental group](@math/fundamental-group) is intractable. The price: $H_1$ is exactly $\pi_1$ made abelian, so it cannot see non-commuting loops.`,
    },
    {
      kind: 'match',
      prompt: 'Match each space to its Betti numbers (b₀, b₁, b₂).',
      pairs: [
        ['point', '(1, 0, 0)'],
        ['circle', '(1, 1, 0)'],
        [String.raw`sphere $S^2$`, '(1, 0, 1)'],
        ['torus', '(1, 2, 1)'],
      ],
      why: String.raw`$b_0$ counts pieces, so every connected space here starts with 1. The circle has one non-bounding loop and no cavity. The sphere has no loop that fails to bound (every loop shrinks) but does enclose a cavity. The torus has two independent loops and one cavity.`,
    },
    {
      kind: 'explain',
      title: 'The Euler–Poincaré formula',
      body: String.raw`Poincaré proved in *Analysis Situs* (1895) that
$$\chi = \sum_n (-1)^n b_n = b_0 - b_1 + b_2 - \cdots$$
and also that the alternating sum of the **cell counts** equals the alternating sum of the **Betti numbers**:
$$\chi = \sum_n (-1)^n (\text{number of } n\text{-cells}) .$$

Check the torus: cells give $1 - 2 + 1 = 0$, Betti numbers give $1 - 2 + 1 = 0$. ✓ And the sphere: $1 - 0 + 1 = 2$. ✓

That explains why $V - E + F$ is subdivision-independent. Adding cells always adds a cycle and a boundary together, so they cancel in the alternating sum. The Betti numbers on the right depend only on the space.`,
    },
    {
      kind: 'order',
      prompt: String.raw`Arrange the steps that compute $\chi$ for a closed orientable surface of genus 2 from a glued octagon ($a b a^{-1} b^{-1} c d c^{-1} d^{-1}$).`,
      steps: [
        String.raw`Start with an octagon: 8 corners, 8 edges, 1 face.`,
        String.raw`The gluing identifies the edges in 4 pairs, so $E = 4$.`,
        String.raw`All 8 corners are identified to a single point, so $V = 1$.`,
        String.raw`Hence $\chi = 1 - 4 + 1 = -2$.`,
        String.raw`And $2 - 2g = -2$ gives $g = 2$: the two-holed doughnut. ✓`,
      ],
      why: String.raw`Count the cells of the glued object, not of the polygon. Each pair of edges becomes one edge, and in this word the corner identifications chain together until all 8 are the same point. The answer matches the genus formula $\chi = 2 - 2g$.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements are correct?',
      choices: [
        String.raw`$\chi$ is independent of how the space is cut into cells.`,
        String.raw`$\partial \circ \partial = 0$: the boundary of a boundary is zero.`,
        String.raw`$H_1$ is the abelianisation of $\pi_1$ for a path-connected space.`,
        String.raw`Two spaces with the same $\chi$ must be homeomorphic.`,
        String.raw`$b_0$ counts the connected components.`,
      ],
      answers: [0, 1, 2, 4],
      why: String.raw`Subdivision-independence follows from the Euler–Poincaré formula. $\partial\partial = 0$ is what makes homology well defined. The Hurewicz theorem in degree 1 says $H_1 \cong \pi_1^{\mathrm{ab}}$, and $b_0$ counts pieces. Equal invariants prove nothing: the torus and the Klein bottle both have $\chi = 0$ and are not homeomorphic.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A connected graph (vertices and edges only, no faces) has 10 vertices and 15 edges. What is $\chi = V - E$?`,
      answer: -5,
      why: String.raw`$\chi = 10 - 15 = -5$. Since $\chi = b_0 - b_1 = 1 - b_1$ for a connected graph, $b_1 = 6$: there are 6 independent cycles. This is the cycle rank $E - V + 1$, used in circuit analysis and in [graph algorithms](@cs/graphs-intro).`,
    },
    {
      kind: 'fill',
      prompt: String.raw`For every convex polyhedron, $V - E + F = $ ___. A surface of genus $g$ has $\chi = $ ___. The number of independent loops that do not bound anything is the Betti number ___.`,
      bank: ['2', '2 − 2g', 'b₁', '0', 'b₀', '2 + 2g'],
      answer: ['2', '2 − 2g', 'b₁'],
      why: String.raw`A convex polyhedron's surface is a sphere, so $\chi = 2$. Each handle costs 2, giving $\chi = 2 - 2g$ (which is $0$ for the torus, $g = 1$). $b_0$ counts components, while $b_1$ counts the independent non-bounding loops.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $\chi = V - E + F$ is the same for every subdivision of a surface. Euler published $V - E + F = 2$ for polyhedra in 1758; Cauchy (1813) and Legendre (1794) gave proofs.
- $\chi = 2$ for the sphere, $0$ for the torus and Klein bottle, $1$ for the disc and $\mathbb{RP}^2$. Orientable genus $g$: $\chi = 2 - 2g$.
- **Homology** replaces counting with algebra: chains, the boundary map with $\partial\partial = 0$, and $H_n = \text{cycles}/\text{boundaries}$.
- **Betti numbers** $b_n$ count holes dimension by dimension: pieces, tunnels, cavities. $H_1$ is $\pi_1$ made abelian.
- **Euler–Poincaré:** $\chi = \sum_n (-1)^n b_n$, which is why the naive count is a genuine invariant.
- Modern use: *persistent homology* in topological data analysis tracks which Betti numbers survive as a scale parameter grows, finding loops and voids in point clouds.`,
    },
  ],
  references: [
    { authors: 'L. Euler', title: 'Elementa doctrinae solidorum / Demonstratio nonnullarum insignium proprietatum quibus solida hedris planis inclusa sunt praedita', year: 1758, venue: 'Novi Commentarii academiae scientiarum Petropolitanae 4, 109–140 and 140–160' },
    { authors: 'H. Poincaré', title: 'Analysis Situs', year: 1895, venue: 'Journal de l’École Polytechnique, 2nd series, vol. 1, pp. 1–121' },
    { authors: 'A. Hatcher', title: 'Algebraic Topology', year: 2002, venue: 'Cambridge University Press (free online)', detail: 'Ch. 2, §2.1–2.2 (simplicial and singular homology, Euler characteristic); §2.A (H₁ and the fundamental group)', url: 'https://pi.math.cornell.edu/~hatcher/AT/ATpage.html' },
    { authors: 'M. A. Armstrong', title: 'Basic Topology', year: 1983, venue: 'Springer (Undergraduate Texts in Mathematics)', detail: 'Ch. 1, §1.1 (Euler’s theorem); Ch. 8 (Simplicial homology)' },
    { authors: 'D. S. Richeson', title: 'Euler’s Gem: The Polyhedron Formula and the Birth of Topology', year: 2008, venue: 'Princeton University Press', detail: 'History of V − E + F, including Euler’s, Legendre’s and Cauchy’s proofs' },
  ],
} satisfies LessonContent;
