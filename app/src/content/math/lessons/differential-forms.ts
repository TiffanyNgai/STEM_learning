import type { LessonContent } from '../../types';

const stackSvg = String.raw`<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg" font-size="10" font-family="inherit">
  <text x="160" y="13" text-anchor="middle" fill="var(--fg)" font-weight="bold">a 1-form is a stack of level lines; it counts crossings</text>
  <g stroke="var(--c2)" stroke-width="1.6">
    <line x1="30" y1="150" x2="90" y2="30"/><line x1="70" y1="150" x2="130" y2="30"/>
    <line x1="110" y1="150" x2="170" y2="30"/><line x1="150" y1="150" x2="210" y2="30"/>
    <line x1="190" y1="150" x2="250" y2="30"/><line x1="230" y1="150" x2="290" y2="30"/>
  </g>
  <text x="26" y="163" fill="var(--c2)">ω = 0</text>
  <text x="188" y="163" fill="var(--c2)">ω = 4</text>
  <line x1="60" y1="110" x2="180" y2="110" stroke="var(--c5)" stroke-width="3" marker-end="url(#fa)"/>
  <text x="112" y="104" fill="var(--c5)" font-weight="bold">v</text>
  <text x="196" y="114" fill="var(--c5)">ω(v) = 3 crossings</text>
  <line x1="60" y1="60" x2="100" y2="60" stroke="var(--c3)" stroke-width="3" marker-end="url(#fa3)"/>
  <text x="104" y="64" fill="var(--c3)">ω(w) = 1</text>
  <circle r="3.5" fill="var(--c1)">
    <animateMotion dur="3.5s" repeatCount="indefinite" path="M60,110 L180,110"/>
  </circle>
  <defs>
    <marker id="fa" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--c5)"/></marker>
    <marker id="fa3" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--c3)"/></marker>
  </defs>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The things you integrate',
      body: String.raw`Look at an integral you already know:
$$\int_a^b f(x)\,dx,\qquad \int_C \mathbf{F}\cdot d\mathbf{r},\qquad \iint_S \mathbf{F}\cdot d\mathbf{S}.$$
In each case the integrand is not a number, and not quite a function: it is a gadget that eats a small *piece of the domain* — a bit of curve, a bit of surface — and returns a number, linearly, and with a sign that flips if you reverse the piece.

That gadget is a **differential form**. Getting the definition right does two things at once: it makes "$dx$" a real object rather than notation, and it collapses the fundamental theorem of calculus, Green's theorem, the divergence theorem and Stokes' theorem into a single line.`,
    },
    {
      kind: 'explain',
      title: '1-forms: machines that eat vectors',
      body: String.raw`At a point $p$, a **covector** is a linear map $T_pM \to \mathbb{R}$. A **differential 1-form** $\omega$ assigns one smoothly to each point.

The basic example: a smooth function $f$ has a differential $df$ with
$$df_p(v) = v(f),$$
the rate of change of $f$ in the direction $v$. For a chart $(x^1,\dots,x^n)$ the coordinate functions give 1-forms $dx^1,\dots,dx^n$, and they are the **dual basis** to the coordinate vectors:
$$dx^i\!\left(\frac{\partial}{\partial x^j}\right) = \delta^i_j = \begin{cases}1 & i = j\\ 0 & i\neq j.\end{cases}$$
So every 1-form is $\omega = \sum_i \omega_i(x)\,dx^i$, and in particular $df = \sum_i \frac{\partial f}{\partial x^i}dx^i$ — the familiar total differential, now a genuine object. A good picture: $\omega$ is a stack of parallel level surfaces, and $\omega(v)$ counts how many the arrow $v$ pierces.`,
      widget: { type: 'SvgDiagram', props: { svg: stackSvg } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Let $f(x,y) = x^2y$ and $v = 2\,\partial/\partial x - \partial/\partial y$ at the point $(1,2)$. Compute $df(v)$.`,
      answer: 7,
      why: String.raw`$df = 2xy\,dx + x^2\,dy$, which at $(1,2)$ is $4\,dx + 1\,dy$. Then $df(v) = 4(2) + 1(-1) = 7$. Note that $dx$ picks out the $\partial/\partial x$-component and kills the other one.`,
    },
    {
      kind: 'explain',
      title: 'Wedge: oriented area',
      body: String.raw`To integrate over surfaces we need something that eats *two* vectors and returns the signed area they span. That requires **antisymmetry**: swapping the two vectors must flip the sign, because a parallelogram traversed the other way is the same patch with opposite orientation.

The **wedge product** builds exactly this:
$$dx\wedge dy = -\,dy\wedge dx,\qquad\text{hence}\qquad dx\wedge dx = 0.$$
$(dx\wedge dy)(u,v) = u^1v^2 - u^2v^1$ — the determinant, the signed area. A **$k$-form** eats $k$ vectors, is linear in each and antisymmetric; at each point they form a vector space of dimension $\binom{n}{k}$. On an $n$-manifold there are no non-zero $k$-forms with $k > n$: you run out of independent directions.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`What is the dimension of the space of 2-forms at a point of a 4-dimensional manifold?`,
      answer: 6,
      why: String.raw`A basis is $dx^i\wedge dx^j$ with $i<j$, so the count is $\binom{4}{2} = 6$. Taking all ordered pairs (16) double-counts and includes the zero terms $dx^i\wedge dx^i$; antisymmetry is what cuts it to 6. In electromagnetism this 6 is the electromagnetic field tensor: 3 electric plus 3 magnetic components.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`For 1-forms $\alpha$ and $\beta$, $\alpha\wedge\beta = \beta\wedge\alpha$.`,
      answer: false,
      why: String.raw`For 1-forms the wedge anticommutes: $\alpha\wedge\beta = -\beta\wedge\alpha$. In general $\alpha\wedge\beta = (-1)^{k\ell}\beta\wedge\alpha$ for a $k$-form and an $\ell$-form, so two 2-forms *do* commute — the sign is $(-1)^{4} = +1$.`,
    },
    {
      kind: 'explain',
      title: 'The exterior derivative d',
      body: String.raw`There is exactly one operator $d$ taking $k$-forms to $(k+1)$-forms such that: on functions it is the differential $df$; it is linear; it obeys the graded Leibniz rule $d(\alpha\wedge\beta) = d\alpha\wedge\beta + (-1)^k\alpha\wedge d\beta$; and
$$d\circ d = 0.$$
In coordinates, you differentiate every coefficient and wedge on the new $dx^i$:
$$d\!\left(\textstyle\sum_I \omega_I\,dx^I\right) = \sum_I d\omega_I \wedge dx^I .$$
Example in $\mathbb{R}^2$: for $\omega = P\,dx + Q\,dy$,
$$d\omega = \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right) dx\wedge dy,$$
which is the curl. In $\mathbb{R}^3$, $d$ on 0-, 1- and 2-forms is precisely **grad**, **curl** and **div** — and $d\circ d = 0$ is precisely $\mathrm{curl}\,\mathrm{grad} = 0$ and $\mathrm{div}\,\mathrm{curl} = 0$.`,
    },
    {
      kind: 'widget',
      title: 'Computing d, step by step',
      body: String.raw`Work through $d$ on a 1-form in the plane and watch Green's theorem appear.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Take $\omega = -y\,dx + x\,dy$ on $\mathbb{R}^2$, so $P = -y$ and $Q = x$.`,
            String.raw`Differentiate the coefficients: $dP = -dy$ and $dQ = dx$.`,
            String.raw`Wedge each onto its own $dx^i$: $d\omega = (-dy)\wedge dx + dx\wedge dy$.`,
            String.raw`Antisymmetry gives $(-dy)\wedge dx = +dx\wedge dy$, so $d\omega = 2\,dx\wedge dy$.`,
            String.raw`Integrate over the unit disc $D$: $\int_D d\omega = 2\,\mathrm{area}(D) = 2\pi$.`,
            String.raw`Stokes says this equals $\oint_{\partial D}\omega$. Parameterise the circle by $(\cos t,\sin t)$: $\omega = \sin^2 t\,dt + \cos^2 t\,dt = dt$, and $\int_0^{2\pi} dt = 2\pi$ ✓.`,
          ],
          notes: [
            'This is the rotation field written as a form.',
            String.raw`$d$ of a coefficient function is its total differential.`,
            'Each term keeps the dx that was already there.',
            String.raw`In the $P\,dx + Q\,dy$ formula: $Q_x - P_y = 1 - (-1) = 2$.`,
            'Area of the unit disc is π.',
            'Both sides agree — as they must.',
          ],
        },
      },
    },
    {
      kind: 'match',
      prompt: String.raw`In $\mathbb{R}^3$, match each use of $d$ to its vector-calculus name.`,
      pairs: [
        [String.raw`$d$ on a function (0-form)`, 'gradient'],
        [String.raw`$d$ on a 1-form`, 'curl'],
        [String.raw`$d$ on a 2-form`, 'divergence'],
        [String.raw`$d\circ d = 0$ on functions`, 'curl grad f = 0'],
        [String.raw`$d\circ d = 0$ on 1-forms`, 'div curl F = 0'],
      ],
      why: String.raw`Identifying vector fields with 1-forms and with 2-forms (using the metric and orientation of $\mathbb{R}^3$) turns the single operator $d$ into the three classical operators, and the single identity $d^2 = 0$ into the two classical vanishing identities.`,
    },
    {
      kind: 'explain',
      title: 'Integration, and why forms are the right integrand',
      body: String.raw`A $k$-form can be integrated over an **oriented** $k$-dimensional piece of $M$: chop the piece into small parallelepipeds, feed each one's edge vectors to the form, and add up. The reason this is well defined is the **pullback**. A smooth map $F$ turns a form $\omega$ on the target into a form $F^*\omega$ on the source, by $(F^*\omega)(v_1,\dots,v_k) = \omega(dF(v_1),\dots,dF(v_k))$, and
$$\int_{F(S)}\omega = \int_S F^*\omega .$$
In coordinates, pullback of a top form produces exactly the Jacobian determinant — forms have the change-of-variables rule built in, which functions do not. Pullback also commutes with $d$: $F^*(d\omega) = d(F^*\omega)$.`,
    },
    {
      kind: 'explain',
      title: 'Stokes’ theorem',
      body: String.raw`> **Stokes' theorem.** Let $M$ be an oriented smooth $n$-manifold with boundary, and $\omega$ a smooth $(n-1)$-form on $M$ with compact support. Give $\partial M$ the induced orientation. Then
> $$\int_M d\omega = \int_{\partial M}\omega .$$

Differentiate inside, or restrict to the edge: same answer. The classical theorems are the cases:

- $n = 1$, $M = [a,b]$, $\omega = f$: $\int_a^b f'\,dx = f(b) - f(a)$ — the **fundamental theorem of calculus**.
- $n = 2$ in the plane: **Green's theorem**.
- $n = 2$, a surface in $\mathbb{R}^3$: **Kelvin–Stokes**, $\iint_S \mathrm{curl}\,\mathbf{F}\cdot d\mathbf{S} = \oint_{\partial S}\mathbf{F}\cdot d\mathbf{r}$.
- $n = 3$ in $\mathbb{R}^3$: the **divergence theorem**.

One statement, four classical theorems, any dimension, any manifold.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Let $\omega = x\,dy$ on $\mathbb{R}^2$ and let $D$ be the unit disc. Using Stokes, compute $\oint_{\partial D}\omega$.`,
      answer: 3.14159265,
      tolerance: 0.001,
      why: String.raw`$d\omega = dx\wedge dy$, so $\oint_{\partial D} x\,dy = \int_D dx\wedge dy = \mathrm{area}(D) = \pi \approx 3.1416$. This is the planimeter trick: a boundary line integral returns the enclosed area.`,
    },
    {
      kind: 'explain',
      title: 'Closed, exact, and holes',
      body: String.raw`Call $\omega$ **closed** if $d\omega = 0$, and **exact** if $\omega = d\eta$ for some $\eta$. Since $d\circ d = 0$, every exact form is closed. Is every closed form exact?

Only if the space has no holes. On $\mathbb{R}^n$ (or any contractible set) yes — that is the **Poincaré lemma**. But on the punctured plane $\mathbb{R}^2\setminus\{0\}$ the angle form
$$\omega = \frac{-y\,dx + x\,dy}{x^2+y^2}$$
is closed, yet $\oint_{S^1}\omega = 2\pi \neq 0$; an exact form would integrate to $0$ around any loop, so $\omega$ is not exact. The failure is measured by **de Rham cohomology**, $H^k_{dR}(M) = \ker d / \operatorname{im} d$, and de Rham's theorem says it computes the same holes as [homology](@math/euler-characteristic-homology) does. Calculus detects topology.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Every closed form on a manifold is exact.`,
      answer: false,
      why: String.raw`Exact always implies closed (because $d^2 = 0$), but the converse needs the region to have no holes. The angle form on the punctured plane is closed with loop integral $2\pi$, so it cannot be $d$ of anything globally — even though locally it *is* $d(\text{angle})$.`,
    },
    {
      kind: 'order',
      prompt: String.raw`Order these statements from the most general to the most special case.`,
      steps: [
        String.raw`$\int_M d\omega = \int_{\partial M}\omega$ for an oriented $n$-manifold with boundary.`,
        String.raw`$\iint_S \mathrm{curl}\,\mathbf{F}\cdot d\mathbf{S} = \oint_{\partial S} \mathbf{F}\cdot d\mathbf{r}$ for a surface in $\mathbb{R}^3$.`,
        String.raw`$\iint_D (Q_x - P_y)\,dA = \oint_{\partial D}(P\,dx + Q\,dy)$ for a region of the plane.`,
        String.raw`$\int_a^b f'(x)\,dx = f(b) - f(a)$.`,
      ],
      why: String.raw`Each line is the one above it in a lower dimension or a flatter setting: the general Stokes theorem specialises to surfaces in space, then to flat regions of the plane (Green), then to an interval, where the "boundary integral" is just evaluation at the two endpoints with signs.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`A $k$-form eats $k$ vectors and is ___ in them. The operator $d$ raises degree by one and satisfies $d\circ d =$ ___. A form with $d\omega = 0$ is called ___.`,
      bank: ['antisymmetric', '0', 'closed', 'symmetric', '1', 'exact'],
      answer: ['antisymmetric', '0', 'closed'],
      why: String.raw`Antisymmetry is what encodes orientation and signed volume. $d^2 = 0$ is the identity behind curl grad $= 0$; a form killed by $d$ is *closed*, while *exact* is the stronger property of being $d$ of something.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **$k$-form** eats $k$ tangent vectors, linearly and antisymmetrically, and returns a number: signed $k$-dimensional volume. The space of them at a point has dimension $\binom{n}{k}$.
- $dx^i$ is the dual basis to $\partial/\partial x^i$; the **wedge** $\wedge$ is antisymmetric, so $dx\wedge dx = 0$.
- The **exterior derivative** $d$ raises degree by one, obeys a graded Leibniz rule, and satisfies $d\circ d = 0$. In $\mathbb{R}^3$ it is grad, curl and div.
- **Stokes:** $\int_M d\omega = \int_{\partial M}\omega$ — the fundamental theorem of calculus, Green, Kelvin–Stokes and the divergence theorem in one line.
- Closed $\neq$ exact when the manifold has holes; the gap is **de Rham cohomology**.

Next: add the one piece of structure forms deliberately avoid — a way to measure length → [Riemannian metrics](@math/riemannian-metrics).`,
    },
  ],
  references: [
    { authors: 'L. W. Tu', title: 'An Introduction to Manifolds', year: 2011, venue: '2nd ed., Springer Universitext', detail: '§3–4 (multicovectors, forms on ℝⁿ), §17–19 (1-forms, k-forms, the exterior derivative), §21–22 (orientations, manifolds with boundary), §23 (integration on a manifold and Stokes’ theorem)' },
    { authors: 'J. M. Lee', title: 'Introduction to Smooth Manifolds', year: 2013, venue: '2nd ed., Springer GTM 218', detail: 'Ch. 11 (the cotangent bundle), Ch. 14 (differential forms), Ch. 16 (integration on manifolds, Stokes’ theorem), Ch. 17 (de Rham cohomology)' },
    { authors: 'T. Needham', title: 'Visual Differential Geometry and Forms: A Mathematical Drama in Five Acts', year: 2021, venue: 'Princeton University Press', detail: 'Act V (forms: the stack picture of a 1-form, the exterior derivative, Stokes’ theorem)' },
    { authors: 'M. Spivak', title: 'Calculus on Manifolds', year: 1965, venue: 'Benjamin/Addison-Wesley', detail: 'Ch. 4 (integration on chains), Ch. 5 (Stokes’ theorem on manifolds)' },
  ],
} satisfies LessonContent;
