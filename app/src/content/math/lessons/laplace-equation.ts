import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'When nothing changes any more',
      body: String.raw`Leave a metal plate with fixed edge temperatures long enough and the [heat equation](@math/pde-heat-equation) stops changing anything: $u_t = 0$. What is left is **Laplace's equation**

$$\Delta u = u_{xx} + u_{yy} = 0,$$

where $\Delta$ (the **Laplacian**) is the sum of the unmixed second derivatives (add $u_{zz}$ in 3D). With a source term it becomes **Poisson's equation** $\Delta u = f$. Solutions of $\Delta u = 0$ are called **harmonic functions**.

The same equations describe the [electric potential](@physics/electric-potential) in a charge-free region ($\Delta V = 0$, or $\Delta V = -\rho/\varepsilon_0$ with charges), gravitational potentials, steady incompressible irrotational flow, and the shape of a soap film over a slightly bent wire.`,
    },
    {
      kind: 'explain',
      title: 'Meet some harmonic functions',
      body: String.raw`Check by computing $u_{xx} + u_{yy}$:

- $u = x^2 - y^2$: $2 + (-2) = 0$ ✓. A saddle.
- $u = xy$: $0 + 0 = 0$ ✓.
- $u = e^x\sin y$: $e^x\sin y - e^x\sin y = 0$ ✓.
- $u = \ln\sqrt{x^2 + y^2}$: harmonic everywhere except the origin, where it blows up (the potential of a line charge).
- $u = x^2 + y^2$: $2 + 2 = 4 \ne 0$ ✗. A bowl is not harmonic.

Notice that harmonic surfaces are saddle-like. Any curvature up in one direction is balanced by curvature down in another. The real and imaginary parts of a [holomorphic function](@math/holomorphic-functions) are always harmonic: $x^2 - y^2$ and $2xy$ come from $z^2$.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Which functions are harmonic in the whole plane?`,
      choices: [String.raw`$x^2 - y^2$`, String.raw`$x^2 + y^2$`, String.raw`$e^x\cos y$`, String.raw`$3xy + 2x - 5$`, String.raw`$x^3 - 3xy^2$`],
      answers: [0, 2, 3, 4],
      why: String.raw`$x^3 - 3xy^2$: $u_{xx} = 6x$ and $u_{yy} = -6x$, which sum to 0 (it is the real part of $z^3$). $e^x\cos y$ gives $e^x\cos y - e^x\cos y = 0$. Linear terms and $xy$ have zero second derivatives. Only $x^2 + y^2$ fails, with $\Delta u = 4$.`,
    },
    {
      kind: 'explain',
      title: 'The mean-value property',
      body: String.raw`The defining feature of harmonic functions: **the value at the centre of any circle (inside the domain) equals the average of the values on the circle.**

$$u(\mathbf{x}_0) = \frac{1}{2\pi r}\oint_{|\mathbf{x} - \mathbf{x}_0| = r} u\,ds.$$

On a square grid of spacing $h$, the five-point approximation of $\Delta u = 0$ says the same thing in miniature:

$$u_{i,j} = \tfrac14\big(u_{i+1,j} + u_{i-1,j} + u_{i,j+1} + u_{i,j-1}\big).$$

This suggests an algorithm, **relaxation** (Jacobi iteration): start with any guess inside, then repeatedly replace every interior value by the average of its four neighbours, keeping the boundary fixed. It converges to the discrete harmonic function. It is the heat equation run until it settles.`,
    },
    {
      kind: 'widget',
      title: 'Relaxing to equilibrium',
      body: String.raw`The top edge is held at $u = 1$ (hot) and the other three at $0$; the interior starts cold. Each sweep averages every cell with its neighbours. Watch heat seep in from the top, and the centre value creep toward $0.25$. Notice how slowly plain Jacobi converges (thousands of sweeps on a $25\times25$ grid), and try Gauss–Seidel, which uses new values as soon as they are computed and takes about half as many sweeps.`,
      widget: { type: 'MathLaplaceRelax', props: { boundary: 'top', n: 25 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`On a square, $u = 1$ on the top edge and $u = 0$ on the other three edges, with $\Delta u = 0$ inside. What is $u$ at the centre? (Hint: rotate the problem four ways and add.)`,
      answer: 0.25,
      tolerance: 0.001,
      why: String.raw`Let $u_T, u_R, u_B, u_L$ be the solutions with the hot edge on top, right, bottom and left. By symmetry they all have the same centre value. Their sum is harmonic and equals $1$ on the whole boundary, so it is the constant $1$ (by uniqueness). Hence each centre value is $1/4$. Guessing $0.5$ treats the problem as if only the top and bottom edges mattered.`,
    },
    {
      kind: 'explain',
      title: 'The maximum principle',
      body: String.raw`From the mean-value property: a harmonic function on a bounded region attains its maximum and minimum **on the boundary**. If it had an interior maximum, it would equal the average of a circle of smaller-or-equal values, forcing it to be constant nearby.

Consequences:

- **No hot spot without a source.** In a steady state, the interior is never hotter than the hottest edge.
- **Uniqueness for the Dirichlet problem** ($\Delta u = f$ inside, $u = g$ on the boundary). If $u_1, u_2$ both solve it, $w = u_1 - u_2$ is harmonic with $w = 0$ on the boundary, so $\max w = \min w = 0$.
- **Earnshaw's theorem** (1842): a charge cannot be held in *stable* equilibrium by electrostatic forces alone, since the potential has no local minimum in empty space.`,
    },
    {
      kind: 'truefalse',
      prompt: 'A function that is harmonic on a disk can have a strict local maximum at the centre of the disk.',
      answer: false,
      why: String.raw`By the mean-value property the centre value is the average over every small circle around it. A strict maximum would make it larger than all those values, and hence larger than their average, which is a contradiction. Harmonic functions look like saddles, never peaks or bowls, inside their domain.`,
    },
    {
      kind: 'explain',
      title: 'Separation of variables on a square',
      body: String.raw`Unit square, $u = f(x)$ on the top edge $y = 1$, and $0$ on the other edges. Try $u = X(x)Y(y)$: $X''/X = -Y''/Y = -\lambda$. The side conditions $X(0) = X(1) = 0$ give $X_n = \sin n\pi x$ with $\lambda = (n\pi)^2$. Then $Y'' = (n\pi)^2 Y$ with $Y(0) = 0$ gives $Y_n = \sinh n\pi y$. Superposing,

$$u(x, y) = \sum_{n\ge1} b_n\,\frac{\sinh n\pi y}{\sinh n\pi}\,\sin n\pi x,$$

where $b_n$ are the [Fourier sine coefficients](@math/fourier-series) of $f$. The factor $\sinh(n\pi y)/\sinh(n\pi)$ is about $e^{-n\pi(1 - y)}$ for large $n$: **fine wiggles on the boundary die off exponentially fast with distance**. The interior only "sees" the smooth, large-scale part of the boundary data.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`On the unit square, $u(x, 1) = \sin\pi x$ and $u = 0$ on the other three edges. Which is the solution?`,
      choices: [
        String.raw`$\sin(\pi x)\,\dfrac{\sinh \pi y}{\sinh\pi}$`,
        String.raw`$y\,\sin\pi x$`,
        String.raw`$\sin(\pi x)\,\dfrac{\cosh\pi y}{\cosh\pi}$`,
        String.raw`$\sin(\pi x)\,e^{-\pi(1 - y)}$`,
      ],
      answer: 0,
      why: String.raw`$\Delta[\sin\pi x\sinh\pi y] = -\pi^2(\cdot) + \pi^2(\cdot) = 0$, it vanishes at $x = 0, 1$ and $y = 0$, and equals $\sin\pi x$ at $y = 1$. $y\sin\pi x$ meets the boundary conditions but has $\Delta = -\pi^2y\sin\pi x \ne 0$. The cosh and exponential versions are harmonic but do not vanish on the bottom edge $y = 0$.`,
    },
    {
      kind: 'widget',
      title: 'Check against the exact answer',
      body: String.raw`Now the top edge carries $\sin\pi x$. The exact centre value is $\sin(\pi/2)\,\sinh(\pi/2)/\sinh\pi \approx 0.1993$; the grid answer converges to a value within a few ten-thousandths of it (the leftover gap is the discretisation error of the $25\times25$ grid). Try "opposite" (top and bottom hot): by the same symmetry trick the centre is $1/2$.`,
      widget: { type: 'MathLaplaceRelax', props: { boundary: 'sine', n: 25, method: 'gauss-seidel' } },
    },
    {
      kind: 'match',
      prompt: 'Match each term with its meaning.',
      pairs: [
        ['harmonic function', String.raw`a solution of $\Delta u = 0$`],
        ['Poisson equation', String.raw`$\Delta u = f$, a steady state with sources`],
        ['Dirichlet problem', 'prescribe the values of $u$ on the boundary'],
        ['Neumann problem', 'prescribe the outward normal derivative (the flux) on the boundary'],
      ],
      why: String.raw`Dirichlet fixes values (temperatures, voltages); Neumann fixes fluxes. A pure Neumann problem has a solution only if the total flux balances the sources, and then it is unique only up to an added constant.`,
    },
    {
      kind: 'order',
      prompt: String.raw`Order the steps of the relaxation (Jacobi) method for $\Delta u = 0$ on a grid.`,
      steps: [
        'Fix the boundary values from the boundary condition.',
        'Fill the interior with any initial guess (for example zeros).',
        'Replace every interior value by the average of its four neighbours (from the previous sweep).',
        'Repeat sweeps until the largest change falls below a tolerance.',
      ],
      why: 'Boundary data must be in place before averaging, because it is what drives the interior. The sweep is repeated until it stops changing anything: a fixed point of averaging is exactly a discrete harmonic function. Faster methods (multigrid, FFT-based solvers) reach the same answer in far fewer operations.',
    },
    {
      kind: 'fill',
      prompt: String.raw`A harmonic function equals its ___ over any circle in its domain, so its maximum is attained on the ___. Boundary wiggles of frequency $n$ decay into the interior roughly like ___.`,
      bank: ['average', 'maximum', 'boundary', 'centre', String.raw`$e^{-n\pi d}$`, String.raw`$1/n$`],
      answer: ['average', 'boundary', String.raw`$e^{-n\pi d}$`],
      why: String.raw`The mean-value property implies the maximum principle. On the square, mode $n$ carries the factor $\sinh(n\pi y)/\sinh(n\pi) \approx e^{-n\pi d}$, where $d = 1 - y$ is the distance from the edge. That is exponential, not algebraic, decay.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $\Delta u = 0$ (Laplace) and $\Delta u = f$ (Poisson) describe steady states: heat at equilibrium, electrostatics, potential flow.
- **Mean-value property**: $u$ at a point equals its average on surrounding circles. Discretely, each value is the average of 4 neighbours, which gives relaxation.
- **Maximum principle** ⇒ no interior extrema, uniqueness for Dirichlet problems, Earnshaw's theorem.
- Separation on a square: $\sin n\pi x\,\sinh n\pi y$ modes; fine boundary detail fades exponentially inside.

Next: solve Poisson's equation for *every* source at once with [Green's functions](@math/greens-functions). Physics uses these ideas in [conductors and Laplace's equation](@physics/conductors-boundary-problems).`,
    },
  ],
  references: [
    { authors: 'L. C. Evans', title: 'Partial Differential Equations', year: 2010, venue: '2nd ed., AMS Graduate Studies in Mathematics 19', detail: '§2.2 (Laplace’s equation: mean-value formulas, maximum principle)' },
    { authors: 'W. A. Strauss', title: 'Partial Differential Equations: An Introduction', year: 2008, venue: '2nd ed., Wiley', detail: 'Ch. 6 (harmonic functions; rectangles)' },
    { authors: 'R. Haberman', title: 'Applied Partial Differential Equations with Fourier Series and Boundary Value Problems', year: 2013, venue: '5th ed., Pearson', detail: 'Ch. 2 (Laplace’s equation by separation of variables)' },
    { authors: 'G. B. Folland', title: 'Fourier Analysis and Its Applications', year: 1992, venue: 'Wadsworth & Brooks/Cole (reprinted AMS, 2009)', detail: 'Ch. 4' },
  ],
} satisfies LessonContent;
