import type { LessonContent } from '../../types';

// --- Collapsing the boundary of a disc to one point gives a sphere: boundary circle shrinks to the north pole.
const collapseSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <ellipse cx="160" cy="110" rx="90" ry="26" fill="var(--c2)" fill-opacity="0.15" stroke="var(--c3)" stroke-width="2.5">
    <animate attributeName="rx" values="90;90;4;4;90" keyTimes="0;0.15;0.6;0.85;1" dur="8s" repeatCount="indefinite"/>
    <animate attributeName="ry" values="26;26;1.5;1.5;26" keyTimes="0;0.15;0.6;0.85;1" dur="8s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="110;110;30;30;110" keyTimes="0;0.15;0.6;0.85;1" dur="8s" repeatCount="indefinite"/>
  </ellipse>
  <path d="M70,110 C100,132 130,136 160,136 C190,136 220,132 250,110" fill="none" stroke="var(--c2)" stroke-width="2">
    <animate attributeName="d" values="M70,110 C100,132 130,136 160,136 C190,136 220,132 250,110;M70,110 C100,132 130,136 160,136 C190,136 220,132 250,110;M156,30 C40,40 60,190 160,190 C260,190 280,40 164,30;M156,30 C40,40 60,190 160,190 C260,190 280,40 164,30;M70,110 C100,132 130,136 160,136 C190,136 220,132 250,110" keyTimes="0;0.15;0.6;0.85;1" dur="8s" repeatCount="indefinite"/>
  </path>
  <circle cx="160" cy="110" r="3" fill="var(--c5)">
    <animate attributeName="cy" values="110;110;180;180;110" keyTimes="0;0.15;0.6;0.85;1" dur="8s" repeatCount="indefinite"/>
  </circle>
  <text x="10" y="18" font-size="10" fill="var(--fg)">disc D², boundary circle in orange</text>
  <text x="10" y="196" font-size="10" fill="var(--muted)">D² / ∂D² ≅ S²: the whole rim becomes one point</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'recall',
      title: 'Equivalence relations and quotients',
      points: [
        String.raw`An **equivalence relation** $\sim$ is reflexive, symmetric and transitive.`,
        String.raw`Its classes $[x]$ partition the set. The **quotient** $X/{\sim}$ is the set of classes.`,
        String.raw`The map $q : X \to X/{\sim}$, $q(x) = [x]$, sends each point to its class.`,
        String.raw`Gluing example: $[0, 1]$ with $0 \sim 1$ becomes a circle.`,
      ],
      link: 'math/relations-equivalence',
    },
    {
      kind: 'explain',
      title: 'The quotient topology',
      body: String.raw`The [relations lesson](@math/relations-equivalence) glued points as **sets**. To get a *space*, the quotient also needs open sets.

**Definition.** Let $X$ be a topological space and $\sim$ an equivalence relation. Give $X/{\sim}$ the **quotient topology**: a set $U \subseteq X/{\sim}$ is open **iff** $q^{-1}(U)$ is open in $X$.

In words, a set of glued points is open exactly when the points of $X$ it came from form an open set. This is the largest topology that makes $q$ continuous.

**Key property.** A function $g : X/{\sim} \to Y$ is continuous iff $g \circ q : X \to Y$ is continuous. So continuous maps out of a quotient are just continuous maps out of $X$ that take the same value on glued points.`,
    },
    {
      kind: 'explain',
      title: 'Proving the glued interval is a circle',
      body: String.raw`Let $X = [0,1]$ with $0 \sim 1$. The map $h(t) = (\cos 2\pi t, \sin 2\pi t)$ is continuous and has $h(0) = h(1)$. By the key property it induces a continuous map $\bar h : X/{\sim} \to S^1$, and $\bar h$ is a bijection.

Is the inverse continuous? Use a theorem from [compactness](@math/compactness-connectedness): a continuous bijection from a **compact** space to a **Hausdorff** space is a homeomorphism. $X/{\sim}$ is compact as the continuous image $q([0,1])$ of a compact set, and $S^1$ is Hausdorff. So $[0,1]/(0 \sim 1) \cong S^1$.

Compare with the [intro lesson](@math/topology-intro): $[0, 2\pi) \to S^1$ was **not** a homeomorphism. The difference is that $[0, 2\pi)$ is not compact.`,
    },
    {
      kind: 'widget',
      title: 'Gluing a square',
      body: String.raw`Take a square and glue its edges in pairs. Edges with the **same colour and arrow type** are identified so that the **arrows match**.

- Glue left to right (double arrows) and you get a **cylinder**. Then glue bottom to top (single arrows) and you get a **torus**. The 3D panel performs the folding (the square is stretched, which topology allows).
- The red bug walks in a straight line. When it exits through an edge it re-enters through the partner edge, like in the arcade game *Asteroids*. On the torus it never gets mirror-reversed.`,
      widget: { type: 'MathGluingSquare', props: { surface: 'torus', choices: ['cylinder', 'torus', 'mobius', 'klein'] } },
    },
    {
      kind: 'explain',
      title: 'Edge words',
      body: String.raw`Label the edge pairs $a, b, \dots$. Walk around the square anticlockwise, starting at the bottom-left corner. Write $a$ when you travel along the arrow of edge $a$, and $a^{-1}$ when you travel against it. The resulting **word** describes the surface completely:

- **Torus:** $a\,b\,a^{-1}b^{-1}$
- **Klein bottle:** $a\,b\,a\,b^{-1}$. One pair is glued with a flip.
- **Sphere:** $a\,b\,b^{-1}a^{-1}$. Adjacent edges are folded together like an envelope.
- **Real projective plane** $\mathbb{RP}^2$: $a\,b\,a\,b$. Both pairs are flipped, which identifies opposite boundary points.

The only change from the torus to the Klein bottle is the direction of one arrow.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`In the torus square, the top edge (arrow pointing right) is glued to the bottom edge (arrow pointing right). If we instead reverse the arrow on the top edge only, which surface do we get?`,
      choices: ['The Klein bottle', 'The sphere', 'The torus again', 'A cylinder'],
      answer: 0,
      why: String.raw`Now bottom and top are glued with a flip, $(x, 0) \sim (1 - x, 1)$, while left and right are still glued straight. The word becomes $a\,b\,a\,b^{-1}$: the Klein bottle. A cylinder would need one pair of edges left unglued. The sphere needs adjacent edges folded together.`,
    },
    {
      kind: 'widget',
      title: 'Möbius strip and Klein bottle: the bug gets mirrored',
      body: String.raw`Glue only the left and right edges, with a flip: that is the **Möbius strip**. Watch the green dot that marks the bug's left side. After the bug crosses a flipped gluing, the dot is on its right. A surface containing such a path is **non-orientable**: there is no consistent choice of clockwise.

The **Klein bottle** contains a Möbius strip, so it is non-orientable too. It is a closed surface that cannot sit in 3D space without passing through itself. It needs four dimensions.`,
      widget: { type: 'MathGluingSquare', props: { surface: 'mobius', angle: 15, choices: ['mobius', 'klein', 'rp2', 'sphere'] } },
    },
    {
      kind: 'truefalse',
      prompt: 'The boundary of a Möbius strip consists of two separate circles, like the boundary of a cylinder.',
      answer: false,
      why: String.raw`In the square, the top and bottom edges are the free boundary. The flipped gluing joins the right end of the top edge to the left end of the bottom edge and vice versa, so the two segments join into **one** circle twice as long. A cylinder has two boundary circles. Try it with a strip of paper.`,
    },
    {
      kind: 'match',
      prompt: 'Match each edge word to its surface.',
      pairs: [
        [String.raw`$a\,b\,a^{-1}b^{-1}$`, 'torus'],
        [String.raw`$a\,b\,a\,b^{-1}$`, 'Klein bottle'],
        [String.raw`$a\,b\,b^{-1}a^{-1}$`, 'sphere'],
        [String.raw`$a\,b\,a\,b$`, String.raw`real projective plane $\mathbb{RP}^2$`],
      ],
      why: String.raw`A letter appearing once with each exponent ($a \dots a^{-1}$) is a straight gluing. A letter appearing twice with the same exponent ($a \dots a$) is a flipped gluing, which makes the surface non-orientable. In the sphere the pairs are adjacent and cancel ($b\,b^{-1}$), so the square folds up like an envelope.`,
    },
    {
      kind: 'explain',
      title: 'Collapsing a subset',
      body: String.raw`A special quotient is $X/A$: **collapse** a subset $A$ to a single point (all of $A$ is one class, every other point is its own class).

- $[0,1]/\{0, 1\} \cong S^1$, the glued interval again.
- $D^2 / \partial D^2 \cong S^2$. Pull the rim of a disc together like a drawstring bag and the disc closes up into a sphere.
- $S^1 \times [0,1] \,/\, (S^1 \times \{1\})$ is a **cone** on the circle, which is a disc.`,
      widget: { type: 'SvgDiagram', props: { svg: collapseSvg } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`In the torus square (word $a\,b\,a^{-1}b^{-1}$), the four corners of the square become how many distinct points of the torus?`,
      answer: 1,
      why: String.raw`Gluing left to right identifies the bottom-left corner with the bottom-right, and the top-left with the top-right. Gluing bottom to top identifies those two pairs with each other. All four corners become a single point, where the loops $a$ and $b$ cross.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these surfaces are non-orientable?',
      choices: ['Möbius strip', 'Klein bottle', String.raw`$\mathbb{RP}^2$`, 'torus', 'sphere', 'cylinder'],
      answers: [0, 1, 2],
      why: String.raw`Each of the Möbius strip, the Klein bottle and $\mathbb{RP}^2$ has a flipped gluing ($a \dots a$ in its word) and contains a Möbius strip. Along it the bug comes back mirror-reversed. The torus, sphere and cylinder only use straight gluings, so a consistent clockwise exists.`,
    },
    {
      kind: 'explain',
      title: 'All closed surfaces',
      body: String.raw`A **closed surface** is a compact, connected space with no boundary that looks like a piece of the plane near every point. The **classification theorem** (proved in the early 20th century) says that every closed surface is homeomorphic to exactly one of:

- the sphere $S^2$;
- a connected sum of $g \ge 1$ tori (a "doughnut with $g$ holes");
- a connected sum of $k \ge 1$ projective planes. ($k = 2$ is the Klein bottle.)

Each one comes from a polygon with edges glued according to a word. The next two lessons supply the invariants that tell them apart: the [fundamental group](@math/fundamental-group) and the [Euler characteristic](@math/euler-characteristic-homology).`,
    },
    {
      kind: 'fill',
      prompt: String.raw`In the quotient topology, $U \subseteq X/{\sim}$ is open iff its ___ under $q$ is open in $X$. A surface on which a bug can return mirror-reversed is called ___.`,
      bank: ['preimage', 'non-orientable', 'image', 'orientable', 'compact', 'boundary'],
      answer: ['preimage', 'non-orientable'],
      why: String.raw`The quotient topology is defined by pulling back along $q$, exactly like the preimage definition of continuity. That is why $q$ is automatically continuous. Mirror-reversing loops are the defining feature of non-orientable surfaces such as the Möbius strip.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- The **quotient topology** on $X/{\sim}$: $U$ is open iff $q^{-1}(U)$ is open. Continuous maps out of $X/{\sim}$ are the continuous maps out of $X$ that agree on glued points.
- Compact-to-Hausdorff continuous bijections are homeomorphisms. This proves $[0,1]/(0\sim1) \cong S^1$.
- Gluing a square's edges by a **word** gives the torus ($aba^{-1}b^{-1}$), Klein bottle ($abab^{-1}$), sphere ($abb^{-1}a^{-1}$) and $\mathbb{RP}^2$ ($abab$).
- A flipped gluing creates a Möbius strip, which makes the surface **non-orientable**.
- Every closed surface is a sphere, a connected sum of tori, or a connected sum of projective planes.`,
    },
  ],
  references: [
    { authors: 'J. R. Munkres', title: 'Topology', year: 2000, venue: '2nd ed., Prentice Hall', detail: 'Ch. 2, §22 (The quotient topology); Ch. 12, §74 and §77 (polygonal presentations of surfaces, the classification theorem)' },
    { authors: 'M. A. Armstrong', title: 'Basic Topology', year: 1983, venue: 'Springer (Undergraduate Texts in Mathematics)', detail: 'Ch. 4 (Identification spaces), Ch. 7 (Surfaces)' },
    { authors: 'A. Hatcher', title: 'Algebraic Topology', year: 2002, venue: 'Cambridge University Press (free online)', detail: 'Ch. 0 (cell complexes, quotient spaces; surfaces from polygons)', url: 'https://pi.math.cornell.edu/~hatcher/AT/ATpage.html' },
  ],
} satisfies LessonContent;
