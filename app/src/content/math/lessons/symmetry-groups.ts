import type { LessonContent } from '../../types';

const steps4 = 'values="0 0 0;0 0 0;90 0 0;90 0 0;180 0 0;180 0 0;270 0 0;270 0 0;360 0 0" keyTimes="0;0.15;0.25;0.4;0.5;0.65;0.75;0.9;1" dur="6s" repeatCount="indefinite"';
const blade = '<path d="M0,0 L0,-52 L28,-26 Z" fill="var(--c3)" fill-opacity="0.75" stroke="var(--fg)" stroke-width="1"/>';
const pinwheelSvg = String.raw`<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-size="11" font-family="inherit">
  <g transform="translate(80 92)">
    <g stroke="var(--c5)" stroke-dasharray="4 3" stroke-width="1">
      <line x1="-62" y1="0" x2="62" y2="0"/><line x1="0" y1="-62" x2="0" y2="62"/>
      <line x1="-55" y1="-55" x2="55" y2="55"/><line x1="-55" y1="55" x2="55" y2="-55"/>
    </g>
    <g><animateTransform attributeName="transform" type="rotate" ${steps4}/>
      <rect x="-42" y="-42" width="84" height="84" fill="var(--c2)" fill-opacity="0.25" stroke="var(--c2)" stroke-width="2"/>
      <circle cx="-42" cy="-42" r="5" fill="var(--c4)"/>
    </g>
  </g>
  <g transform="translate(240 92)">
    <g><animateTransform attributeName="transform" type="rotate" ${steps4}/>
      ${blade}<g transform="rotate(90)">${blade}</g><g transform="rotate(180)">${blade}</g><g transform="rotate(270)">${blade}</g>
      <circle r="4" fill="var(--fg)"/>
    </g>
  </g>
  <text x="80" y="178" text-anchor="middle" fill="var(--fg)">square: D₄ (order 8)</text>
  <text x="80" y="192" text-anchor="middle" fill="var(--muted)" font-size="9">4 rotations + 4 mirror lines</text>
  <text x="240" y="178" text-anchor="middle" fill="var(--fg)">pinwheel: C₄ (order 4)</text>
  <text x="240" y="192" text-anchor="middle" fill="var(--muted)" font-size="9">4 rotations, no mirrors</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Symmetry, precisely',
      body: String.raw`A **symmetry** of an object is a transformation that leaves it looking exactly the same — e.g. turning a square tile by 90° so it still fits its hole. (We only use *rigid* moves: rotations and reflections, which preserve distances.)

The symmetries of any object automatically form a [group](@math/groups-intro):

- doing one symmetry then another is again a symmetry (closure);
- composing functions is associative;
- "do nothing" is a symmetry (identity);
- every symmetry can be undone (inverse).

So "symmetry" and "group" are two sides of one coin: the group is the *set of all moves that preserve the object*.`,
    },
    {
      kind: 'explain',
      title: 'The dihedral group Dₙ',
      body: String.raw`A regular $n$-sided polygon has $2n$ symmetries:

- $n$ **rotations** $e, r, r^2, \dots, r^{n-1}$, where $r$ turns by $360°/n$;
- $n$ **reflections** across mirror lines through the centre.

Together they form the **dihedral group** $D_n$, of order (size) $2n$. Fix one reflection $s$. Then every element can be written as $r^k$ or $r^k s$, and everything follows from three rules:

$$r^n = e,\qquad s^2 = e,\qquad s\,r\,s = r^{-1}.$$

The last one says: flip, rotate, flip back = rotate the *other* way. (Notation warning: some books write $D_{2n}$ for the same group, counting elements instead of sides.)`,
    },
    {
      kind: 'widget',
      title: 'Explore D₄',
      body: String.raw`Combine **r** and **s** presses. The label $g$ shows the current symmetry in the form $r^k$ or $r^ks$, and the highlighted cells of the Cayley table show *every* product (row ∘ column, column done first) that equals it. Challenge: reach $g = s$ using **s** three times. Could a sequence with an *even* number of **s** presses ever equal $s$? (No — each flip reverses the vertex order from anticlockwise to clockwise, so only an odd number of flips gives a reflection.)`,
      widget: { type: 'SymmetryRotator', props: { n: 4, reflect: true, showTable: true } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`How many symmetries does a regular hexagon have? (That is, what is $|D_6|$?)`,
      answer: 12,
      why: String.raw`$|D_n| = 2n$: 6 rotations (0°, 60°, …, 300°) and 6 reflections (3 mirror lines through opposite vertices, 3 through midpoints of opposite edges). Answering 6 forgets the reflections.`,
    },
    {
      kind: 'explain',
      title: 'Calculating with the rules',
      body: String.raw`The relation $srs = r^{-1}$ is equivalent to $sr = r^{-1}s$: "moving $s$ past $r$ flips the rotation direction". That's all you need to simplify any product.

Example in $D_4$ (so $r^4 = e$, $r^{-1} = r^3$):

$$(rs)(rs) = r\,(sr)\,s = r\,(r^{-1}s)\,s = (rr^{-1})(ss) = e.$$

So $rs$ has order 2 — it's a reflection! In fact every element $r^ks$ is a reflection, which accounts for all $n$ mirror lines.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`In $D_4$, simplify $s\,r\,s$.`,
      choices: [String.raw`$r^3$`, String.raw`$r$`, String.raw`$s$`, String.raw`$e$`],
      answer: 0,
      why: String.raw`$srs = r^{-1}$, and in $D_4$, $r^{-1} = r^3$ (turning back 90° = turning forward 270°). Answering $r$ assumes $s$ and $r$ commute, which they don't. Try it in the widget: press **s, r, s**.`,
    },
    {
      kind: 'explain',
      title: 'Reading a Cayley table',
      body: String.raw`The **Cayley table** of a finite group lists $a\,b$ in row $a$, column $b$. Two things to notice:

- Every element appears **exactly once in each row and each column** (a *Latin square*). Reason: cancellation — if $ab = ac$ then $b = c$, so a row can't repeat.
- The group is **abelian** exactly when the table is symmetric across the main diagonal ($ab = ba$ for all pairs).

In the $D_4$ table above, the top-left $4\times4$ block (rotations times rotations) is symmetric, but the full table is not.`,
    },
    {
      kind: 'truefalse',
      prompt: 'In the Cayley table of any finite group, each element appears exactly once in every row and every column.',
      answer: true,
      why: String.raw`Row $a$ lists $ag$ for all $g$. If two entries matched, $ag = ah$, cancelling $a$ gives $g = h$. So the $|G|$ entries are all different, i.e. each element appears exactly once. Same argument for columns with right-cancellation.`,
    },
    {
      kind: 'widget',
      title: 'Different objects, different groups',
      body: String.raw`A square has 8 symmetries. A pinwheel has only the 4 rotations: mirroring it reverses the "spin" of the blades. Its group is the **cyclic group** $C_4$ (generated by one element; same structure as $\mathbb{Z}_4$). A circle has infinitely many symmetries — every rotation angle and every mirror through the centre — the group $O(2)$, a first example of a [Lie group](@math/lie-groups-intro).`,
      widget: { type: 'SvgDiagram', props: { svg: pinwheelSvg } },
    },
    {
      kind: 'match',
      prompt: 'Match each object to its (rigid, 2D) symmetry group.',
      pairs: [
        ['Equilateral triangle', String.raw`$D_3$, order 6`],
        ['Four-bladed pinwheel', String.raw`$C_4$, order 4`],
        ['Non-square rectangle', String.raw`$D_2$, order 4 (two mirrors, half-turn)`],
        ['Circle', String.raw`$O(2)$, infinite`],
      ],
      why: String.raw`Triangle: 3 rotations + 3 mirrors. Pinwheel: rotations only. A rectangle keeps only the 180° turn and the two mirror lines through edge midpoints (its diagonals are *not* mirror lines) — together with $e$ that's 4. A circle survives every rotation and every reflection through its centre.`,
    },
    {
      kind: 'widget',
      title: 'Symmetries are permutations',
      body: String.raw`Every symmetry of the triangle shuffles its three corners — see the "vertex i → slot" readout. All $3! = 6$ shuffles occur, each exactly once, and composing symmetries matches composing shuffles. So $D_3$ and the permutation group $S_3$ are **isomorphic**: there is a one-to-one correspondence between them that turns products into products. Isomorphic groups are "the same group with different labels".`,
      widget: { type: 'SymmetryRotator', props: { n: 3, reflect: true, showTable: true } },
    },
    {
      kind: 'multi',
      prompt: String.raw`Which statements about $D_3$ are true?`,
      choices: ['It is non-abelian.', 'It has order 6.', String.raw`It is isomorphic to $S_3$.`, 'It contains an element of order 3.', 'It contains an element of order 6.'],
      answers: [0, 1, 2, 3],
      why: String.raw`$rs \ne sr$, so non-abelian; $2\cdot 3 = 6$ elements; corner-shuffles give $S_3$; $r$ has order 3. An element of order 6 would generate all 6 elements, making the group cyclic and hence abelian — contradiction.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`The dihedral group $D_n$ has ___ elements: $n$ rotations and $n$ ___. Its defining relations are $r^n = e$, $s^2 = e$ and $srs = $ ___.`,
      bank: ['2n', 'n', 'n²', 'reflections', 'translations', String.raw`$r^{-1}$`, String.raw`$r$`],
      answer: ['2n', 'reflections', String.raw`$r^{-1}$`],
      why: String.raw`Rigid symmetries of a polygon fixing its centre are rotations or reflections, $n$ of each. Translations would move the polygon off itself. $srs = r^{-1}$ captures that a mirror reverses the sense of rotation.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Symmetries of any object form a group under composition.
- $D_n$: $2n$ elements $r^k, r^ks$; relations $r^n = s^2 = e$, $srs = r^{-1}$.
- Cayley tables are Latin squares; symmetric ⇔ abelian.
- Different objects → different groups ($D_n$, $C_n$, $O(2)$); groups with the same table are **isomorphic** (e.g. $D_3 \cong S_3$).

Next: groups inside groups — [subgroups and Lagrange's theorem](@math/subgroups-lagrange).`,
    },
  ],
  references: [
    { authors: 'D. S. Dummit, R. M. Foote', title: 'Abstract Algebra', year: 2004, venue: '3rd ed., Wiley', detail: '§1.2 (dihedral groups), §1.3 (symmetric groups), §1.6 (isomorphisms)' },
    { authors: 'M. Artin', title: 'Algebra', year: 2011, venue: '2nd ed., Pearson', detail: 'Ch. 6 (Symmetry)' },
    { authors: 'N. Carter', title: 'Visual Group Theory', year: 2009, venue: 'Mathematical Association of America' },
  ],
} satisfies LessonContent;
