import type { LessonContent } from '../../types';

// Six distinct 4-bead necklaces (up to rotation), with orbit sizes.
const reps: [string, number][] = [['0000', 1], ['1000', 4], ['1100', 4], ['1010', 2], ['1110', 4], ['1111', 1]];
const beadPos = [[0, -17], [17, 0], [0, 17], [-17, 0]];
const necklaceSvg = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="10">
  ${reps.map(([code, size], i) => {
    const cx = 55 + (i % 3) * 105, cy = 48 + Math.floor(i / 3) * 88;
    const beads = code.split('').map((b, j) => `<circle cx="${cx + beadPos[j][0]}" cy="${cy + beadPos[j][1]}" r="7.5" fill="${b === '1' ? 'var(--c4)' : 'var(--surface)'}" stroke="var(--fg)" stroke-width="1.2"/>`).join('');
    return `<g><circle cx="${cx}" cy="${cy}" r="17" fill="none" stroke="var(--muted)" stroke-width="1.5"/>
      <g><animateTransform attributeName="transform" type="rotate" values="0 ${cx} ${cy};0 ${cx} ${cy};90 ${cx} ${cy};90 ${cx} ${cy}" keyTimes="0;0.7;0.85;1" dur="${3 + i * 0.4}s" repeatCount="indefinite"/>${beads}</g>
      <text x="${cx}" y="${cy + 38}" text-anchor="middle" fill="var(--muted)">orbit size ${size}</text></g>`;
  }).join('')}
  <text x="160" y="186" text-anchor="middle" fill="var(--fg)">1 + 4 + 4 + 2 + 4 + 1 = 16 colourings, 6 necklaces</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Groups that do things',
      body: String.raw`So far a group was a self-contained table. But groups earn their keep by **moving things around**: symmetries of a square move its corners, rotations move points of the plane, shuffles move cards.

A **group action** of $G$ on a set $X$ assigns to each $g \in G$ and $x \in X$ a point $g\cdot x \in X$, such that

1. $e \cdot x = x$ (doing nothing moves nothing), and
2. $g \cdot (h \cdot x) = (gh)\cdot x$ (acting by $h$ then $g$ = acting by the product $gh$).

Examples: $D_4$ on the 4 corners of a square; $S_n$ on $\{1,\dots,n\}$; rotations of the plane on points of the plane; $D_4$ on colourings of the square.`,
    },
    {
      kind: 'widget',
      title: 'Follow one corner',
      body: String.raw`Watch the **slot** where corner **1** sits as you press **r** and **s**. It can reach every slot — and exactly two symmetries keep it at the top: $e$ and the flip $s$ across the vertical axis (which passes through corner 1's starting slot).`,
      widget: { type: 'SymmetryRotator', props: { n: 4, reflect: true, showTable: false } },
    },
    {
      kind: 'explain',
      title: 'Orbits and stabilisers',
      body: String.raw`For a point $x \in X$:

- its **orbit** $\mathrm{Orb}(x) = \{g\cdot x : g \in G\}$ is everywhere $x$ can be moved to;
- its **stabiliser** $\mathrm{Stab}(x) = \{g \in G : g\cdot x = x\}$ is the set of group elements that leave $x$ where it is. It is always a subgroup of $G$.

Square, corner 1: $\mathrm{Orb}(1) = $ all 4 corners, $\mathrm{Stab}(1) = \{e, s\}$. Notice $8 = 4 \times 2$. Coincidence? No…`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`$D_4$ also acts on the square's two **diagonals**. How many symmetries map a given diagonal to itself (its stabiliser)?`,
      choices: ['1', '2', '4', '8'],
      answer: 2,
      why: String.raw`$e$, the half-turn $r^2$, the reflection across that diagonal, and the reflection across the *other* diagonal (which swaps the ends of the first one, but keeps the line in place): 4 elements. Check: the orbit is both diagonals (size 2), and $2 \times 4 = 8$.`,
    },
    {
      kind: 'widget',
      title: 'The orbit–stabiliser theorem',
      body: String.raw`**Theorem.** If a finite group $G$ acts on $X$, then for every $x \in X$:

$$|G| = |\mathrm{Orb}(x)| \cdot |\mathrm{Stab}(x)|.$$`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Let $H = \mathrm{Stab}(x)$, a subgroup of $G$.`,
            String.raw`If $g\cdot x = g'\cdot x$, then $g^{-1}g' \cdot x = x$, so $g^{-1}g' \in H$, i.e. $g' \in gH$.`,
            String.raw`Conversely, every element of the coset $gH$ sends $x$ to $g\cdot x$.`,
            String.raw`So "points of the orbit" ↔ "cosets of $H$" one-to-one: $|\mathrm{Orb}(x)| = [G : H]$.`,
            String.raw`By Lagrange, $[G:H] = |G|/|H|$. Rearranging: $|G| = |\mathrm{Orb}(x)|\cdot|\mathrm{Stab}(x)|$. ∎`,
          ],
          notes: ['', 'Act by g⁻¹ on both sides and use the action rules.', String.raw`$(gh)\cdot x = g\cdot(h\cdot x) = g\cdot x$.`, String.raw`The map $gH \mapsto g\cdot x$ is a bijection.`, ''],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`The rotation group of a cube has 24 elements and can move any face to any of the 6 face positions. How many rotations keep a given face in place?`,
      answer: 4,
      why: String.raw`Orbit–stabiliser: $|\mathrm{Stab}| = 24/6 = 4$ — the rotations by 0°, 90°, 180°, 270° about the axis through that face's centre. (Turning it the other way round, this is how one *proves* the cube has 24 rotations: $6 \times 4$.)`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`For any group action, the orbits partition $X$: every point lies in exactly one orbit.`,
      answer: true,
      why: String.raw`$x \in \mathrm{Orb}(x)$ since $e\cdot x = x$. If two orbits share a point, invertibility lets you travel from anything in one to anything in the other, so they coincide. ("Being in the same orbit" is an equivalence relation.)`,
    },
    {
      kind: 'widget',
      title: 'An infinite group acting: rotations of the plane',
      body: String.raw`The group $SO(2)$ of all rotations about the origin acts on the plane. The animation flows each point along $x' = -y,\ y' = x$, which rotates it — so each particle traces out its **orbit**: a circle centred at the origin. The origin is a one-point orbit; its stabiliser is the whole group. Every other point has stabiliser $\{e\}$.`,
      widget: { type: 'PhasePortrait', props: { dx: '-y', dy: 'x', range: 3 } },
    },
    {
      kind: 'fill',
      prompt: String.raw`Under the rotation group $SO(2)$ acting on the plane, the orbits are ___ centred at the origin (plus the origin itself), and the stabiliser of the origin is ___.`,
      bank: ['circles', 'straight lines', 'the whole group', String.raw`$\{e\}$`],
      answer: ['circles', 'the whole group'],
      why: String.raw`Rotating a point keeps its distance to the origin and reaches every angle, so orbits are circles. Every rotation fixes the origin, so its stabiliser is all of $SO(2)$. (Orbit–stabiliser in this infinite setting reads: one-point orbit ↔ everything stabilises.)`,
    },
    {
      kind: 'explain',
      title: 'Counting up to symmetry: Burnside’s lemma',
      body: String.raw`How many different necklaces can you make from 4 beads, each black or white? There are $2^4 = 16$ colourings, but rotating a necklace doesn't make a new one. We want the number of **orbits** of the rotation group $C_4$ acting on colourings.

**Burnside's lemma:** for a finite group $G$ acting on a finite set $X$,

$$\#\text{orbits} = \frac{1}{|G|}\sum_{g \in G} |\mathrm{Fix}(g)|,$$

where $\mathrm{Fix}(g) = \{x : g\cdot x = x\}$ is the set of points that $g$ leaves unchanged. In words: *the number of orbits is the average number of fixed points.*`,
    },
    {
      kind: 'widget',
      title: 'Burnside in action',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`$G = C_4 = \{e, r, r^2, r^3\}$ acting on the 16 colourings of 4 beads on a ring.`,
            String.raw`$e$ fixes every colouring: $|\mathrm{Fix}(e)| = 16$.`,
            String.raw`$r$ (quarter turn) fixes a colouring only if all beads match: $|\mathrm{Fix}(r)| = 2$. Same for $r^3$.`,
            String.raw`$r^2$ (half turn) needs opposite beads equal: choose 2 colours freely, $|\mathrm{Fix}(r^2)| = 2^2 = 4$.`,
            String.raw`Average: $\dfrac{16 + 2 + 4 + 2}{4} = \dfrac{24}{4} = 6$ necklaces.`,
          ],
        },
      },
    },
    {
      kind: 'widget',
      title: 'The six necklaces',
      body: String.raw`Here they are, each with its orbit size (how many of the 16 colourings it represents). Orbit sizes all divide $|C_4| = 4$, as orbit–stabiliser predicts.`,
      widget: { type: 'SvgDiagram', props: { svg: necklaceSvg } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`How many different 3-bead necklaces with beads black or white are there, counting rotations ($C_3$) as the same?`,
      answer: 4,
      why: String.raw`$|\mathrm{Fix}(e)| = 2^3 = 8$; each of the two non-trivial rotations fixes only the 2 single-colour necklaces. Burnside: $(8 + 2 + 2)/3 = 4$ — namely 0, 1, 2 or 3 black beads. Dividing $8/3$ naively fails because orbits have different sizes.`,
    },
    {
      kind: 'match',
      prompt: 'Match each action to its orbits.',
      pairs: [
        [String.raw`$D_4$ on the corners of a square`, 'One orbit of size 4'],
        [String.raw`$SO(2)$ on the plane`, 'Circles about the origin, plus the origin'],
        [String.raw`$C_4$ on 4-bead two-colour necklaces`, '6 orbits of sizes 1, 4, 4, 2, 4, 1'],
        [String.raw`$\{e\}$ (trivial group) on any set $X$`, 'Every point is its own orbit'],
      ],
      why: String.raw`An action with a single orbit is called **transitive** (the square's corners). The trivial group moves nothing, so every orbit is a single point. The necklace orbits sum to $16$, as orbits must partition $X$.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **group action**: each $g$ moves points of $X$, with $e\cdot x = x$ and $g\cdot(h\cdot x) = (gh)\cdot x$.
- **Orbit** = where $x$ can go; **stabiliser** = what keeps $x$ fixed (a subgroup). Orbits partition $X$.
- **Orbit–stabiliser**: $|G| = |\mathrm{Orb}(x)|\,|\mathrm{Stab}(x)|$.
- **Burnside**: number of orbits = average number of fixed points — the tool for counting "up to symmetry".

Actions on *vector spaces* by linear maps are called [representations](@math/representations-intro); they underlie quantum mechanics, spectroscopy and symmetry-aware (equivariant) neural networks.`,
    },
  ],
  references: [
    { authors: 'D. S. Dummit, R. M. Foote', title: 'Abstract Algebra', year: 2004, venue: '3rd ed., Wiley', detail: '§1.7, Ch. 4 (group actions)' },
    { authors: 'M. Artin', title: 'Algebra', year: 2011, venue: '2nd ed., Pearson', detail: 'Ch. 6 (operations of groups, counting formula)' },
    { authors: 'N. Carter', title: 'Visual Group Theory', year: 2009, venue: 'Mathematical Association of America' },
  ],
} satisfies LessonContent;
