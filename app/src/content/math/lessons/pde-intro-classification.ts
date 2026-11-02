import type { LessonContent } from '../../types';

const typesSvg = `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg" font-size="10" fill="var(--fg)">
  <g>
    <text x="53" y="14" text-anchor="middle" font-weight="bold">Elliptic</text>
    <rect x="13" y="24" width="80" height="80" fill="var(--c2)" fill-opacity="0.15" stroke="var(--c2)" stroke-width="2"/>
    <circle cx="53" cy="64" r="4" fill="var(--c5)"/>
    <g stroke="var(--c5)" stroke-width="1" opacity="0.7">
      <line x1="53" y1="64" x2="13" y2="40"/><line x1="53" y1="64" x2="93" y2="40"/><line x1="53" y1="64" x2="13" y2="96"/><line x1="53" y1="64" x2="93" y2="96"/><line x1="53" y1="64" x2="53" y2="24"/><line x1="53" y1="64" x2="53" y2="104"/>
      <animate attributeName="opacity" values="0.2;0.9;0.2" dur="2.5s" repeatCount="indefinite"/>
    </g>
    <text x="53" y="122" text-anchor="middle" font-size="9">steady state:</text>
    <text x="53" y="134" text-anchor="middle" font-size="9">every boundary point</text>
    <text x="53" y="146" text-anchor="middle" font-size="9">affects every interior one</text>
    <text x="53" y="162" text-anchor="middle" font-size="9" fill="var(--muted)">Laplace</text>
  </g>
  <g>
    <text x="160" y="14" text-anchor="middle" font-weight="bold">Parabolic</text>
    <line x1="118" y1="104" x2="202" y2="104" stroke="var(--fg)"/>
    <line x1="122" y1="108" x2="122" y2="22" stroke="var(--fg)"/><text x="126" y="28" font-size="9">t</text>
    <path d="M125,104 L150,104 L150,60 L170,60 L170,104 L198,104" fill="none" stroke="var(--muted)" stroke-dasharray="3 2"/>
    <path fill="none" stroke="var(--c5)" stroke-width="2">
      <animate attributeName="d" dur="3s" repeatCount="indefinite" values="M125,104 C150,104 150,60 160,60 C170,60 170,104 198,104;M125,103 C140,103 145,80 160,80 C175,80 180,103 198,103;M125,101 C135,101 140,92 160,92 C180,92 185,101 198,101;M125,104 C150,104 150,60 160,60 C170,60 170,104 198,104"/>
    </path>
    <text x="160" y="122" text-anchor="middle" font-size="9">evolves forward in t,</text>
    <text x="160" y="134" text-anchor="middle" font-size="9">smooths and spreads</text>
    <text x="160" y="146" text-anchor="middle" font-size="9">(infinitely fast)</text>
    <text x="160" y="162" text-anchor="middle" font-size="9" fill="var(--muted)">heat</text>
  </g>
  <g>
    <text x="267" y="14" text-anchor="middle" font-weight="bold">Hyperbolic</text>
    <line x1="225" y1="104" x2="309" y2="104" stroke="var(--fg)"/>
    <line x1="229" y1="108" x2="229" y2="22" stroke="var(--fg)"/><text x="233" y="28" font-size="9">t</text>
    <path d="M267,104 L227,28 L307,28 Z" fill="var(--c3)" fill-opacity="0.18"/>
    <line x1="267" y1="104" x2="227" y2="28" stroke="var(--c3)" stroke-width="2"/>
    <line x1="267" y1="104" x2="307" y2="28" stroke="var(--c3)" stroke-width="2"/>
    <circle r="3.5" fill="var(--c3)"><animateMotion dur="2.5s" repeatCount="indefinite" path="M267,104 L227,28"/></circle>
    <circle r="3.5" fill="var(--c3)"><animateMotion dur="2.5s" repeatCount="indefinite" path="M267,104 L307,28"/></circle>
    <text x="267" y="122" text-anchor="middle" font-size="9">signals travel along</text>
    <text x="267" y="134" text-anchor="middle" font-size="9">characteristics at</text>
    <text x="267" y="146" text-anchor="middle" font-size="9">finite speed</text>
    <text x="267" y="162" text-anchor="middle" font-size="9" fill="var(--muted)">wave</text>
  </g>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Equations for fields',
      body: String.raw`An [ODE](@math/ode-first-order) tracks a quantity that depends on **one** variable, such as position over time. Temperature in a rod, the height of a string, or the electric potential in a room depend on **several** variables: position *and* time, or $x$ *and* $y$.

A **partial differential equation (PDE)** relates an unknown function $u(x, t)$ to its **partial derivatives**. $u_t = \partial u/\partial t$ is the rate of change in $t$ with $x$ held fixed, and $u_{xx} = \partial^2 u/\partial x^2$, and so on. The four classics:

- transport: $u_t + c\,u_x = 0$
- heat (diffusion): $u_t = k\,u_{xx}$
- wave: $u_{tt} = c^2 u_{xx}$
- Laplace: $u_{xx} + u_{yy} = 0$

The **order** is the highest derivative that appears: 1 for transport, 2 for the other three.`,
    },
    {
      kind: 'recall',
      title: 'What an ODE needs',
      points: [
        String.raw`An ODE like $y' = ky$ has a whole family of solutions $y = Ce^{kt}$.`,
        String.raw`One **initial condition** $y(0) = y_0$ picks out a single solution.`,
        'For nice right-hand sides, solutions exist and are unique (Picard–Lindelöf).',
        String.raw`For PDEs the "free constants" become **free functions**, so we need whole functions of data.`,
      ],
      link: 'math/ode-first-order',
    },
    {
      kind: 'explain',
      title: 'The simplest PDE: transport',
      body: String.raw`Take $u_t + c\,u_x = 0$, with $c$ a constant speed. Claim: **every** function of the form

$$u(x, t) = f(x - ct)$$

solves it. Check with the chain rule: $u_t = -c f'(x - ct)$ and $u_x = f'(x - ct)$, so $u_t + c u_x = 0$. ✓

So the solution is the initial profile $f(x) = u(x, 0)$ sliding right at speed $c$ without changing shape. Along each line $x - ct = \text{const}$ (a **characteristic**) $u$ is constant. Where an ODE had an arbitrary constant, this PDE has an arbitrary *function* $f$.`,
    },
    {
      kind: 'widget',
      title: 'A profile riding a characteristic',
      body: String.raw`$u(x, t) = f(x - ct)$ with a bump-shaped $f$ (the view wraps around so it keeps coming back). Change $c$: a bigger $c$ means a faster slide, a negative $c$ means it moves left, and the shape never changes.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['exp(-4*(((x - c*t + 6) % 12 + 12) % 12 - 6)^2)'],
          x: [-6, 6], y: [-0.3, 1.3], animate: true,
          params: [{ name: 'c', min: -3, max: 3, value: 1.5, label: 'speed c' }],
          labels: ['u(x,t) = f(x − ct)'], xLabel: 'x', yLabel: 'u',
        },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Which function solves $u_t + 2u_x = 0$ with $u(x, 0) = \sin x$?`,
      choices: [String.raw`$\sin(x - 2t)$`, String.raw`$\sin(x + 2t)$`, String.raw`$e^{-2t}\sin x$`, String.raw`$\sin(2x - t)$`],
      answer: 0,
      why: String.raw`With $c = 2$ the solution is $f(x - 2t)$ with $f = \sin$. Check: $u_t = -2\cos(x - 2t)$ and $2u_x = 2\cos(x - 2t)$, which sum to 0. $\sin(x + 2t)$ moves the wrong way (it solves $u_t - 2u_x = 0$), $e^{-2t}\sin x$ decays instead of moving, and $\sin(2x - t)$ does not start at $\sin x$.`,
    },
    {
      kind: 'explain',
      title: 'Linear, homogeneous, superposition',
      body: String.raw`A PDE is **linear** if $u$ and its derivatives appear only to the first power, multiplied by known functions of $(x, t)$. Heat, wave, Laplace and transport are linear. **Burgers' equation** $u_t + u\,u_x = 0$ is *nonlinear*: the speed is $u$ itself, so tall parts move faster and waves can steepen into shocks.

A linear equation is **homogeneous** if every term contains $u$ (no source term on its own). Homogeneous linear equations obey **superposition**: if $u_1$ and $u_2$ are solutions, so is $a u_1 + b u_2$. This is why we can build solutions from simple pieces such as [Fourier modes](@math/fourier-series). It is the same principle as for [waves on a string](@physics/superposition-standing-waves).`,
    },
    {
      kind: 'match',
      prompt: 'Match each equation with its description.',
      pairs: [
        [String.raw`$u_t + u\,u_x = 0$`, 'first order, nonlinear (Burgers)'],
        [String.raw`$u_t = u_{xx} + \sin x$`, 'second order, linear, inhomogeneous'],
        [String.raw`$u_{tt} = 4u_{xx}$`, 'second order, linear, homogeneous'],
        [String.raw`$u_t + 3u_x = 0$`, 'first order, linear, homogeneous'],
      ],
      why: String.raw`The product $u\,u_x$ makes Burgers nonlinear. The term $\sin x$ contains no $u$, so it is a source, which makes the heat equation inhomogeneous. The wave and transport equations here have every term containing $u$ to the first power.`,
    },
    {
      kind: 'explain',
      title: 'Initial and boundary conditions',
      body: String.raw`A PDE alone has far too many solutions. We pin one down with extra data:

- **Initial conditions** (at $t = 0$): heat needs $u(x, 0)$; the wave equation, being second order in $t$, needs **both** $u(x, 0)$ and $u_t(x, 0)$ (shape and velocity), just as Newton's law needs position and velocity.
- **Boundary conditions** (at the edges of space): **Dirichlet** fixes $u$ (an end held at 0 °C); **Neumann** fixes $u_x$ (an insulated end, no heat flux).

Hadamard called a problem **well-posed** if a solution **exists**, is **unique**, and **depends continuously on the data**: small changes in the data give small changes in the solution. Physical models should be well-posed; we will see that running the heat equation *backwards* in time is not.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`A guitar string of length $L$, fixed at both ends, obeys $u_{tt} = c^2u_{xx}$. Which data are needed to determine its motion?`,
      choices: [String.raw`$u(x, 0)$, the initial shape`, String.raw`$u_t(x, 0)$, the initial velocity`, String.raw`$u(0, t) = 0$ and $u(L, t) = 0$`, String.raw`$u_{tt}(x, 0)$, the initial acceleration`, String.raw`$u(x, T)$ at a later time $T$`],
      answers: [0, 1, 2],
      why: String.raw`Second order in time means two initial conditions (shape and velocity), plus a condition at each end. The initial acceleration is not extra data: the PDE itself gives $u_{tt}(x, 0) = c^2u_{xx}(x, 0)$ from the shape. Prescribing $u$ at a later time instead of $u_t$ at $t = 0$ is a different (and generally badly behaved) problem.`,
    },
    {
      kind: 'explain',
      title: 'Three types of second-order PDE',
      body: String.raw`For a linear second-order equation in two variables,
$$A\,u_{xx} + 2B\,u_{xy} + C\,u_{yy} + (\text{lower-order terms}) = 0,$$
the sign of the **discriminant** $B^2 - AC$ decides the character, just like the conic $Ax^2 + 2Bxy + Cy^2 = 1$:

- $B^2 - AC < 0$: **elliptic** (like an ellipse). Laplace, with $A = C = 1$ and $B = 0$: $-1$.
- $B^2 - AC = 0$: **parabolic**. Heat $k u_{xx} - u_t = 0$ in variables $(x, t)$: $A = k$, $B = C = 0$, giving $0$.
- $B^2 - AC > 0$: **hyperbolic**. Wave $c^2u_{xx} - u_{tt} = 0$: $A = c^2$, $C = -1$, giving $c^2 > 0$.

Lower-order terms do not change the type. If $A, B, C$ depend on position, the type can differ from region to region.`,
    },
    {
      kind: 'widget',
      title: 'What the types feel like',
      body: 'Elliptic problems describe equilibria: information from the whole boundary arrives everywhere at once. Parabolic problems march forward in time and smooth things out. Hyperbolic problems carry signals along characteristic lines at a finite speed.',
      widget: { type: 'SvgDiagram', props: { svg: typesSvg } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Compute the discriminant $B^2 - AC$ for $u_{xx} + 2u_{xy} + 5u_{yy} = 0$. (Remember the middle coefficient is $2B$.)`,
      answer: -4,
      why: String.raw`$A = 1$, $2B = 2$ so $B = 1$, $C = 5$. Then $B^2 - AC = 1 - 5 = -4 < 0$: elliptic. A common slip is to take $B = 2$, which gives $4 - 5 = -1$. The type is still elliptic, but the number is wrong.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`The **Tricomi equation** $y\,u_{xx} + u_{yy} = 0$ (used for flow near the speed of sound) is, in the region $y > 0$,`,
      choices: ['elliptic', 'hyperbolic', 'parabolic', 'of no definite type, since it is nonlinear'],
      answer: 0,
      why: String.raw`$A = y$, $B = 0$, $C = 1$, so $B^2 - AC = -y$, which is negative for $y > 0$ (elliptic), positive for $y < 0$ (hyperbolic) and zero on the line $y = 0$ (parabolic). The equation is linear: the coefficient $y$ depends on position, not on $u$.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Adding a lower-order term, e.g. turning $u_{xx} + u_{yy} = 0$ into $u_{xx} + u_{yy} + 7u_x = 0$, can change the equation from elliptic to hyperbolic.`,
      answer: false,
      why: String.raw`The type depends only on the second-order coefficients $A, B, C$ (the "principal part"). First-order terms like $7u_x$ change the solutions but not the type, because $B^2 - AC = -1$ is unchanged.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps for classifying a linear second-order PDE in two variables.',
      steps: [
        String.raw`Write it as $Au_{xx} + 2Bu_{xy} + Cu_{yy} + \dots = 0$, with the time variable (if any) treated as one of the two variables.`,
        String.raw`Read off $A$, $B$ (half the mixed coefficient) and $C$.`,
        String.raw`Compute $B^2 - AC$ at the point or region of interest.`,
        'Negative: elliptic. Zero: parabolic. Positive: hyperbolic.',
      ],
      why: String.raw`Classification is local and only uses the principal part, so you first put the equation in standard form, then take care to halve the mixed coefficient, and only then compare the sign.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A PDE links an unknown field $u(x, t, \dots)$ to its partial derivatives; its solutions contain free **functions**, so extra data is needed.
- Transport $u_t + cu_x = 0$ is solved by $u = f(x - ct)$: profiles slide along characteristics.
- Linear homogeneous equations obey **superposition**.
- Well-posed means existence, uniqueness and continuous dependence on the data. Heat needs $u(x,0)$; waves need $u$ and $u_t$ at $t=0$; both need boundary conditions on bounded domains.
- $B^2 - AC$: negative is elliptic (Laplace), zero is parabolic (heat), positive is hyperbolic (wave).

Next: the [heat equation](@math/pde-heat-equation), [wave equation](@math/pde-wave-equation) and [Laplace's equation](@math/laplace-equation) one at a time.`,
    },
  ],
  references: [
    { authors: 'W. A. Strauss', title: 'Partial Differential Equations: An Introduction', year: 2008, venue: '2nd ed., Wiley', detail: 'Ch. 1 (§1.1–1.6: what is a PDE, first-order equations, conditions, well-posedness, types)' },
    { authors: 'L. C. Evans', title: 'Partial Differential Equations', year: 2010, venue: '2nd ed., AMS Graduate Studies in Mathematics 19', detail: 'Ch. 1; §2.1 (transport equation)' },
    { authors: 'R. Haberman', title: 'Applied Partial Differential Equations with Fourier Series and Boundary Value Problems', year: 2013, venue: '5th ed., Pearson', detail: 'Ch. 1' },
  ],
} satisfies LessonContent;
