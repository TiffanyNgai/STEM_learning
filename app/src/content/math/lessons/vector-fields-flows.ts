import type { LessonContent } from '../../types';

const bracketSvg = String.raw`<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" font-size="10" font-family="inherit">
  <text x="160" y="14" text-anchor="middle" fill="var(--fg)" font-weight="bold">flow X, then Y — or Y, then X?</text>
  <circle cx="60" cy="140" r="3.5" fill="var(--fg)"/>
  <text x="46" y="156" fill="var(--fg)">p</text>
  <path d="M60,140 L160,140" stroke="var(--c3)" stroke-width="2.5" fill="none" marker-end="url(#ah3)"/>
  <path d="M160,140 L160,62" stroke="var(--c4)" stroke-width="2.5" fill="none" marker-end="url(#ah4)"/>
  <path d="M60,140 L60,62" stroke="var(--c4)" stroke-width="2.5" stroke-dasharray="5 3" fill="none" marker-end="url(#ah4)"/>
  <path d="M60,62 L148,44" stroke="var(--c3)" stroke-width="2.5" stroke-dasharray="5 3" fill="none" marker-end="url(#ah3)"/>
  <circle cx="160" cy="62" r="4" fill="var(--c3)"/>
  <circle cx="152" cy="43" r="4" fill="var(--c4)"/>
  <path d="M152,43 L160,62" stroke="var(--c5)" stroke-width="2.5" fill="none" marker-end="url(#ah5)"/>
  <text x="168" y="66" fill="var(--c3)">X then Y</text>
  <text x="120" y="34" fill="var(--c4)">Y then X</text>
  <text x="188" y="44" fill="var(--c5)" font-weight="bold">gap ≈ t²[X,Y]</text>
  <text x="100" y="156" fill="var(--c3)">flow X for time t</text>
  <text x="8" y="100" fill="var(--c4)">flow Y</text>
  <circle r="3" fill="var(--c1)">
    <animateMotion dur="4s" repeatCount="indefinite" path="M60,140 L160,140 L160,62"/>
  </circle>
  <circle r="3" fill="var(--c6)">
    <animateMotion dur="4s" repeatCount="indefinite" path="M60,140 L60,62 L148,44"/>
  </circle>
  <defs>
    <marker id="ah3" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--c3)"/></marker>
    <marker id="ah4" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--c4)"/></marker>
    <marker id="ah5" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--c5)"/></marker>
  </defs>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A wind map of the world',
      body: String.raw`A weather map draws, at every point of the Earth's surface, the wind there: an arrow tangent to the surface. That is a **vector field** on the sphere. Drop a balloon anywhere and it is carried along a definite path — the **flow** of the field.

Formally, a smooth vector field $X$ on a manifold $M$ picks a tangent vector $X_p \in T_pM$ for every $p$, smoothly in $p$ (a smooth section of the tangent bundle). In a chart,
$$X = \sum_{i=1}^n a^i(x)\,\frac{\partial}{\partial x^i},$$
with smooth coefficient functions $a^i$. Because tangent vectors are derivations, $X$ also acts on functions: $(Xf)(p) = X_p(f)$, the rate of change of $f$ along the field.`,
    },
    {
      kind: 'recall',
      title: 'From ODEs',
      points: [
        'A first-order system x′ = f(x) assigns a velocity to each point of the state space.',
        'A trajectory is a curve whose velocity matches the field at every instant.',
        'Picard–Lindelöf: if f is C¹, exactly one trajectory passes through each point.',
        'Trajectories of an autonomous system never cross; equilibria are the points where f = 0.',
      ],
      link: 'math/phase-portraits',
    },
    {
      kind: 'explain',
      title: 'Integral curves and the flow',
      body: String.raw`An **integral curve** of $X$ through $p$ is a curve $\gamma$ with
$$\gamma(0) = p,\qquad \gamma'(t) = X_{\gamma(t)}\ \text{ for all } t.$$
Read in a chart this is exactly the ODE system $\dot x^i = a^i(x)$, so the existence-and-uniqueness theorem applies: through each point there is exactly one maximal integral curve.

Write $\theta_t(p) = \gamma(t)$. Then $\theta$ is the **flow** of $X$, and it satisfies the group law
$$\theta_0 = \mathrm{id},\qquad \theta_t \circ \theta_s = \theta_{t+s}.$$
If $M$ is **compact**, every smooth vector field is *complete*: the flow is defined for all $t \in \mathbb{R}$, and each $\theta_t$ is a diffeomorphism of $M$. So a vector field on a compact manifold is an infinitesimal symmetry, and its flow is a one-parameter group of symmetries. Escaping to infinity in finite time, as $\dot x = x^2$ does on $\mathbb{R}$, simply has nowhere to happen.`,
    },
    {
      kind: 'widget',
      title: 'Flows on a sphere and a torus',
      body: String.raw`Five fields. **S²: spin** rotates about the vertical axis: two zeros, at the poles. **S²: uphill** flows along the gradient of the height: a source at the south pole, a sink at the north. **S²: one zero** has a single zero at the north pole, of index $+2$. **T²: winding** has *no* zeros — with an irrational slope a single orbit is dense in the whole torus. **T²: uphill** has four zeros: a max, a min and two saddles.`,
      widget: { type: 'MathSurfaceFlow', props: { field: 'sphere-rotation' } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`The flow $\theta$ of a complete vector field satisfies $\theta_t\circ\theta_s = \theta_{t+s}$. What does that say in words?`,
      choices: [
        'Flowing for time t then time s is the same as flowing for time t + s, so the maps form a group under composition',
        'The field has no zeros',
        'Every integral curve is closed',
        'The flow preserves distances',
      ],
      answer: 0,
      why: String.raw`The group law is just "time adds up": the field does not depend on $t$, so where you get to depends only on the total time. In particular $\theta_{-t}$ undoes $\theta_t$, making each $\theta_t$ a diffeomorphism. Zeros are allowed (they are fixed points of every $\theta_t$), orbits need not close, and nothing yet measures distance.`,
    },
    {
      kind: 'explain',
      title: 'The hairy ball theorem',
      body: String.raw`> **Hairy ball theorem.** Every continuous tangent vector field on the even-dimensional sphere $S^{2k}$ vanishes somewhere. (Brouwer, 1912.)

You cannot comb a coconut flat: there is always a crown or a parting. Meteorologically, there is at all times a point on Earth where the horizontal wind is exactly zero.

It is a special case of the **Poincaré–Hopf theorem**: if $X$ is a smooth field on a compact manifold $M$ with only isolated zeros, then
$$\sum_{\text{zeros}} \mathrm{index}(X, p) = \chi(M),$$
the [Euler characteristic](@math/euler-characteristic-homology). A zero's index counts how many times the field winds around as you encircle it. Since $\chi(S^2) = 2 \neq 0$, zeros are compulsory on the sphere. Since $\chi(T^2) = 0$, they are not on the torus — and indeed the winding field has none. Odd spheres also escape: $S^1$ and $S^3$ have $\chi = 0$ and carry nowhere-zero fields.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`There is a smooth, nowhere-vanishing vector field on the torus $T^2$.`,
      answer: true,
      why: String.raw`Yes: flow at constant speed in the longitude direction, $\partial/\partial\phi$, which never vanishes. This is consistent with Poincaré–Hopf because $\chi(T^2) = 0$. The same construction is impossible on the sphere, where $\chi = 2$.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A vector field on the genus-2 surface (a two-holed doughnut, $\chi = 2 - 2g = -2$) has isolated zeros. What must the sum of their indices be?`,
      answer: -2,
      why: String.raw`Poincaré–Hopf forces the index sum to equal $\chi = 2 - 2\cdot 2 = -2$, whatever the field. Note the sum can be negative even though the *number* of zeros cannot: saddles carry index $-1$.`,
    },
    {
      kind: 'explain',
      title: 'Do two flows commute?',
      body: String.raw`Take two vector fields $X, Y$. Flow along $X$ for a short time $t$, then along $Y$ for time $t$. Now do it the other way round. Do you land in the same place?

Usually not. Drive 100 m east then 100 m north, versus north then east: on a sphere these differ. The **Lie bracket** $[X,Y]$ measures the gap: the displacement *from* the "$Y$ then $X$" endpoint *to* the "$X$ then $Y$" endpoint is $t^2[X,Y]_p$ to leading order.

Defined algebraically, the bracket is the commutator of the two derivations:
$$[X,Y]f = X(Yf) - Y(Xf),$$
and remarkably the second derivatives cancel, so $[X,Y]$ is again a vector field. In coordinates,
$$[X,Y]^k = \sum_i \left( X^i \frac{\partial Y^k}{\partial x^i} - Y^i \frac{\partial X^k}{\partial x^i}\right).$$`,
      widget: { type: 'SvgDiagram', props: { svg: bracketSvg } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`In $\mathbb{R}^2$, let $X = \partial/\partial x$ and $Y = x\,\partial/\partial y$. What is $[X,Y]$?`,
      choices: [
        String.raw`$\partial/\partial y$`,
        String.raw`$0$`,
        String.raw`$x\,\partial/\partial y$`,
        String.raw`$-\partial/\partial x$`,
      ],
      answer: 0,
      why: String.raw`Using $[X,Y]^k = \sum_i (X^i\partial_i Y^k - Y^i \partial_i X^k)$: the components of $X$ are $(1,0)$ and of $Y$ are $(0,x)$. The $y$-component is $1\cdot\partial_x(x) - 0 = 1$, the $x$-component is $0$, so $[X,Y] = \partial/\partial y$. It is non-zero, so these two flows do not commute: sliding in $x$ changes how fast $Y$ pushes you in $y$.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Coordinate fields always commute: $[\partial/\partial x^i, \partial/\partial x^j] = 0$.`,
      answer: true,
      why: String.raw`Their components are constants, so every derivative in the bracket formula vanishes — equivalently, mixed partial derivatives of a smooth function commute. The converse is a real theorem: a set of pointwise-independent fields that pairwise commute can be straightened into coordinate fields of some chart.`,
    },
    {
      kind: 'explain',
      title: 'What the bracket is good for',
      body: String.raw`- **Lie derivative.** $\mathcal{L}_XY = [X,Y]$ is the rate of change of $Y$ as you drag it along the flow of $X$. $[X,Y] = 0$ exactly when the two flows commute, and then $Y$ is carried to itself by $X$'s flow.
- **Lie algebras.** On a [Lie group](@math/lie-groups-intro) the bracket of left-invariant fields turns the tangent space at the identity into a [Lie algebra](@math/lie-algebras); for matrix groups it is the commutator $XY - YX$. The rotation fields of $\mathbb{R}^3$ satisfy $[L_x, L_y] = L_z$ — the structure behind angular momentum.
- **Control.** A car cannot drive sideways, but "forward, steer, reverse, steer back" is the bracket of the drive and steer fields, and it moves you sideways. Parallel parking *is* a Lie bracket.
- **Frobenius' theorem.** A family of tangent planes is the tangent plane field of a family of surfaces exactly when it is closed under brackets.

The bracket is antisymmetric, $[X,Y] = -[Y,X]$, and satisfies the Jacobi identity $[X,[Y,Z]] + [Y,[Z,X]] + [Z,[X,Y]] = 0$.`,
    },
    {
      kind: 'match',
      prompt: 'Match each object to what it is.',
      pairs: [
        ['Vector field X', 'A smooth choice of one tangent vector at every point'],
        ['Integral curve', 'A curve whose velocity equals the field at each of its points'],
        ['Flow θₜ', 'A one-parameter family of diffeomorphisms with θₜ∘θₛ = θₜ₊ₛ'],
        ['Zero of X', 'A point where the field vanishes; a fixed point of every θₜ'],
        ['[X, Y]', 'The field measuring the failure of two flows to commute'],
      ],
      why: String.raw`A field is the infinitesimal datum; the flow is the finite motion it generates; the zeros are where nothing moves; and the bracket compares two such motions. Together they turn ODE theory into geometry.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`A curve whose velocity equals the field everywhere is an ___ curve. On a ___ manifold every smooth field is complete. The hairy ball theorem says every continuous field on $S^2$ has a ___.`,
      bank: ['integral', 'compact', 'zero', 'bracket', 'closed', 'connected'],
      answer: ['integral', 'compact', 'zero'],
      why: String.raw`Compactness is what stops solutions escaping in finite time, so flows exist for all time. And $\chi(S^2) = 2 \neq 0$ forces a zero. "Closed" and "connected" are true of $S^2$ but neither is the property that gives completeness.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements are true?',
      choices: [
        String.raw`If $[X,Y] = 0$ then the flows of $X$ and $Y$ commute wherever both are defined.`,
        String.raw`Every smooth vector field on a compact manifold has a zero.`,
        String.raw`The sum of indices of the zeros of a field depends only on the manifold, not on the field.`,
        String.raw`An integral curve of a smooth field can pass through the same point twice at different times without being periodic.`,
      ],
      answers: [0, 2],
      why: String.raw`Vanishing bracket is precisely the condition for commuting flows, and Poincaré–Hopf makes the index sum equal to $\chi(M)$ for every field. Zeros are not always forced: on the torus $\chi = 0$ and the winding field never vanishes. And by uniqueness of solutions, if an integral curve revisits a point it must repeat its whole past, so it is periodic (or constant).`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **vector field** is a smooth tangent vector at each point, $X = \sum a^i\,\partial/\partial x^i$; it is both an arrow field and an operator on functions.
- Its **integral curves** solve the ODE $\dot x = a(x)$; the **flow** $\theta_t$ obeys $\theta_t\circ\theta_s = \theta_{t+s}$, and on a compact manifold is defined for all time.
- **Poincaré–Hopf:** the indices of the zeros sum to $\chi(M)$. Hence the **hairy ball theorem** on $S^{2k}$, and nowhere-zero fields on the torus.
- The **Lie bracket** $[X,Y]f = X(Yf) - Y(Xf)$ measures the failure of two flows to commute; it is antisymmetric and satisfies the Jacobi identity.

Next: the objects that are *integrated* along curves and over surfaces, and the single theorem that governs them → [differential forms](@math/differential-forms).`,
    },
  ],
  references: [
    { authors: 'L. W. Tu', title: 'An Introduction to Manifolds', year: 2011, venue: '2nd ed., Springer Universitext', detail: '§14 (vector fields), §16 (Lie brackets and Lie algebras)' },
    { authors: 'J. M. Lee', title: 'Introduction to Smooth Manifolds', year: 2013, venue: '2nd ed., Springer GTM 218', detail: 'Ch. 8 (vector fields, Lie brackets), Ch. 9 (integral curves, flows, the Lie derivative)' },
    { authors: 'L. E. J. Brouwer', title: 'Über Abbildung von Mannigfaltigkeiten', year: 1912, venue: 'Mathematische Annalen 71(1), 97–115', detail: 'Contains the hairy ball theorem for even-dimensional spheres' },
    { authors: 'T. Needham', title: 'Visual Differential Geometry and Forms: A Mathematical Drama in Five Acts', year: 2021, venue: 'Princeton University Press', detail: 'Act III (curvature) and Act IV (parallel transport), where flows and the index of a vector field are drawn' },
  ],
} satisfies LessonContent;
