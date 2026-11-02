import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Solve once, reuse forever',
      body: String.raw`Many problems have the form $Lu = f$, where $L$ is a *linear* differential operator (like $-\frac{d^2}{dx^2}$ or $-\Delta$) together with boundary conditions, and $f$ is a source: a load on a beam, a charge density, a heat source.

Linear algebra suggests a shortcut. For a matrix equation $A\mathbf{u} = \mathbf{f}$, the $j$-th column of $A^{-1}$ is the response to the unit source $\mathbf{e}_j$, and $\mathbf{u} = A^{-1}\mathbf{f} = \sum_j f_j\,(\text{column } j)$.

For PDEs, the "unit source at the point $y$" is a **point source** $\delta(x - y)$, and its response $G(x, y)$ is the **Green's function** (George Green, 1828). Then by superposition

$$u(x) = \int G(x, y)\,f(y)\,dy.$$`,
    },
    {
      kind: 'explain',
      title: 'The Dirac delta',
      body: String.raw`$\delta(x)$ is an idealised spike: zero away from $0$, with total area $1$. No ordinary function does that. Its precise meaning is through integrals:

$$\int \delta(x - y)\,\varphi(x)\,dx = \varphi(y)\quad\text{for every smooth }\varphi.$$

Think of it as the limit of ever narrower bumps of area 1, such as normal densities with width $w \to 0$. Laurent Schwartz made this rigorous as a **distribution** (a generalised function) around 1950.

"$LG = \delta$" then means: $G$ solves the equation everywhere except at the source point, and has exactly the right kink or singularity there to produce a unit source.`,
    },
    {
      kind: 'widget',
      title: 'Approaching a delta',
      body: String.raw`The normal density of width $w$ always has area $1$. As $w \to 0$ it becomes taller and thinner, and integrating it against any smooth $\varphi$ gives values closer and closer to $\varphi(0)$. In the limit you get $\delta$.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['exp(-x^2/(2*w^2))/(w*sqrt(2*PI))'],
          x: [-3, 3], y: [-0.2, 4.2],
          params: [{ name: 'w', min: 0.1, max: 1.5, value: 0.8, label: 'width w' }],
          labels: ['area-1 bump'], xLabel: 'x', yLabel: '',
        },
      },
    },
    {
      kind: 'explain',
      title: 'Example: a string under a point load',
      body: String.raw`Take $-u'' = f$ on $[0, 1]$ with $u(0) = u(1) = 0$: the sag of a taut string under a load $f$. Push down at a single point $y$. Away from $y$ the equation is $u'' = 0$, so $u$ is straight there, and it must vanish at both ends. That gives a **tent**:

$$G(x, y) = \begin{cases} x\,(1 - y), & 0 \le x \le y,\\ y\,(1 - x), & y \le x \le 1.\end{cases}$$

Check the kink: the slope jumps from $1 - y$ to $-y$, a drop of exactly $1$. So $-G''$ is a unit spike at $x = y$ ✓. Notice also $G(x, y) = G(y, x)$: pushing at $y$ and measuring at $x$ gives the same answer as the reverse (**reciprocity**).`,
    },
    {
      kind: 'widget',
      title: 'Move the load',
      body: String.raw`$G(x, y)$ as a function of $x$ for a load at $y$. The tent's peak sits at the load and has height $y(1 - y)$, largest when you push in the middle. Any load $f$ is a superposition of such tents weighted by $f(y)$.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['x < y ? x*(1 - y) : y*(1 - x)'],
          x: [0, 1], y: [-0.05, 0.3],
          params: [{ name: 'y', min: 0.05, max: 0.95, value: 0.5, label: 'load position y' }],
          labels: ['G(x, y)'], xLabel: 'x', yLabel: 'G',
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Use $u(x) = \int_0^1 G(x, y)\,f(y)\,dy$ with the tent above to solve $-u'' = 1$, $u(0) = u(1) = 0$. What is $u(1/2)$?`,
      answer: 0.125,
      tolerance: 0.001,
      why: String.raw`$u(\tfrac12) = \int_0^{1/2} y\cdot\tfrac12\,dy + \int_{1/2}^1 \tfrac12(1 - y)\,dy = \tfrac12\cdot\tfrac18 + \tfrac12\cdot\tfrac18 = \tfrac18$. Check directly: $u = x(1 - x)/2$ satisfies $-u'' = 1$ and the boundary conditions, and $u(\tfrac12) = \tfrac18$.`,
    },
    {
      kind: 'explain',
      title: 'Fundamental solutions',
      body: String.raw`On all of space (no boundary) the Green's function depends only on $x - y$ and is called the **fundamental solution** $\Phi$. Then $u = \Phi * f$ is a [convolution](@math/fourier-transform).

For the Laplacian, $-\Delta\Phi = \delta$ gives
$$\Phi(\mathbf{x}) = \frac{1}{4\pi|\mathbf{x}|}\ \ (\text{3D}),\qquad \Phi(\mathbf{x}) = -\frac{1}{2\pi}\ln|\mathbf{x}|\ \ (\text{2D}).$$
The 3D one is Coulomb's law: the [potential of a point charge](@physics/electrostatics) is $\frac{q}{4\pi\varepsilon_0 r}$, and the potential of any charge distribution is the superposition $\int\frac{\rho(\mathbf{y})}{4\pi\varepsilon_0|\mathbf{x} - \mathbf{y}|}d\mathbf{y}$, which solves Poisson's equation $-\Delta V = \rho/\varepsilon_0$.

For the [heat equation](@math/pde-heat-equation), the fundamental solution is the Gaussian heat kernel, the spreading of a single point of heat.`,
    },
    {
      kind: 'match',
      prompt: 'Match each operator with its fundamental solution (response to a unit point source).',
      pairs: [
        [String.raw`$-\Delta$ in 3D`, String.raw`$\dfrac{1}{4\pi|\mathbf{x}|}$`],
        [String.raw`$-\Delta$ in 2D`, String.raw`$-\dfrac{1}{2\pi}\ln|\mathbf{x}|$`],
        [String.raw`$\partial_t - \partial_x^2$ (heat, $k = 1$)`, String.raw`$\dfrac{1}{\sqrt{4\pi t}}e^{-x^2/4t}$ for $t > 0$`],
        [String.raw`$-\frac{d^2}{dx^2} + 1$ on $\mathbb{R}$`, String.raw`$\tfrac12 e^{-|x|}$`],
      ],
      why: String.raw`Coulomb potential in 3D, logarithmic potential in 2D, Gaussian kernel for diffusion. The last one came from the Fourier transform: $\frac{1}{1 + 4\pi^2\xi^2}$ is the transform of $\tfrac12e^{-|x|}$.`,
    },
    {
      kind: 'explain',
      title: 'Translation invariance ⇒ Fourier',
      body: String.raw`When $L$ has constant coefficients on all of $\mathbb{R}^n$, the [Fourier transform](@math/fourier-transform) turns $L$ into multiplication by a **symbol** $p(\xi)$. Then $LG = \delta$ becomes $p(\xi)\hat G(\xi) = 1$, since $\hat\delta = 1$. So

$$\hat G(\xi) = \frac{1}{p(\xi)}.$$

Example: $L = -\frac{d^2}{dx^2} + m^2$ ($m > 0$) has symbol $4\pi^2\xi^2 + m^2$, and $\frac{1}{4\pi^2\xi^2 + m^2}$ is the transform of $\frac{1}{2m}e^{-m|x|}$. In physics this is a **screened** (Yukawa-type) potential: the parameter $m$ sets a decay length $1/m$.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`What is the fundamental solution of $-u'' + 4u = \delta$ on $\mathbb{R}$ (decaying at $\pm\infty$)?`,
      choices: [String.raw`$\tfrac14e^{-2|x|}$`, String.raw`$\tfrac12e^{-|x|}$`, String.raw`$\tfrac12e^{-2|x|}$`, String.raw`$\tfrac14e^{-4|x|}$`],
      answer: 0,
      why: String.raw`Here $m^2 = 4$, so $m = 2$ and $G = \frac{1}{2m}e^{-m|x|} = \tfrac14e^{-2|x|}$. Check the kink: $G'$ jumps from $+\tfrac12$ to $-\tfrac12$, a drop of 1 ✓. $\tfrac14e^{-4|x|}$ uses $m = 4$ (forgetting the square root), and $\tfrac12e^{-2|x|}$ has a jump of 2.`,
    },
    {
      kind: 'explain',
      title: 'Boundaries: the method of images',
      body: String.raw`With a boundary, $G$ must also satisfy the boundary condition. For $-\Delta$ in the half-space $z > 0$ with $u = 0$ on the plane $z = 0$, place a **negative image source** at the mirror point $\mathbf{y}^* = (y_1, y_2, -y_3)$:

$$G(\mathbf{x}, \mathbf{y}) = \frac{1}{4\pi|\mathbf{x} - \mathbf{y}|} - \frac{1}{4\pi|\mathbf{x} - \mathbf{y}^*|}.$$

The image lies outside the region, so $-\Delta G = \delta$ still holds inside, and on the plane the two terms cancel. In physics these are the [image charges for conductors](@physics/conductors-boundary-problems). For self-adjoint problems like this one, $G(\mathbf{x}, \mathbf{y}) = G(\mathbf{y}, \mathbf{x})$, the reciprocity we saw for the string.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`If you know the Green's function $G$ of $-\Delta$ for a region with zero Dirichlet boundary values, you can solve $-\Delta u = f$ in that region (with $u = 0$ on the boundary) for every source $f$ by a single integral.`,
      answer: true,
      why: String.raw`That is the whole point: $u(\mathbf{x}) = \int G(\mathbf{x}, \mathbf{y})f(\mathbf{y})\,d\mathbf{y}$. The hard work (finding $G$) is done once per region and boundary condition, not once per source. Nonzero boundary data can be handled too, through a boundary integral of the normal derivative of $G$.`,
    },
    {
      kind: 'explain',
      title: 'The bridge to operator learning',
      body: String.raw`The map "source $f$ ↦ solution $u$" is a linear **operator** whose kernel is $G$: $u(x) = \int G(x, y)f(y)\,dy$. Finding $G$ by hand is only possible for simple shapes and constant coefficients.

**Neural operators** (Kovachki, Li et al., JMLR 2023) generalise exactly this template. Each layer applies a learned integral operator $\int\kappa_\theta(x, y)\,v(y)\,dy$ followed by a pointwise nonlinearity, trained on many pairs of inputs and solutions. When the kernel is assumed translation-invariant, the integral is a convolution, which is cheap in Fourier space. That is the [Fourier neural operator](@math/fourier-neural-operator). See [operator learning](@math/operator-learning-intro).`,
    },
    {
      kind: 'order',
      prompt: String.raw`Order the steps for solving $Lu = f$ (with homogeneous boundary conditions) using a Green's function.`,
      steps: [
        String.raw`Solve $LG(\cdot, y) = \delta(\cdot - y)$ away from $y$, using the homogeneous equation.`,
        String.raw`Impose the boundary conditions on $G$, plus the jump or singularity condition at $x = y$.`,
        String.raw`Superpose: $u(x) = \int G(x, y)f(y)\,dy$.`,
        String.raw`Check that $u$ satisfies the equation and boundary conditions (e.g. on a simple $f$).`,
      ],
      why: String.raw`$G$ is built piecewise from solutions of $LG = 0$, glued at the source with the jump that produces a unit delta. Only once $G$ is fully determined can you integrate it against $f$. A sanity check on an easy $f$, like $f = 1$ for the string, catches sign and factor errors.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about Green’s functions are true?',
      choices: [
        'They give solutions by superposition because the operator is linear.',
        String.raw`The Green's function of $-\Delta$ in 3D is the Coulomb potential $1/(4\pi r)$ of a unit point charge.`,
        String.raw`For a constant-coefficient operator on $\mathbb{R}^n$, $\hat G = 1/p(\xi)$ where $p$ is the symbol.`,
        'The same Green’s function works for every domain shape.',
        'They can be used directly for nonlinear equations such as Burgers’ equation.',
      ],
      answers: [0, 1, 2],
      why: String.raw`Superposition is what makes $u = \int Gf$ valid, so a Green's function solution needs linearity; for nonlinear equations you would at best linearise or iterate. $G$ depends on the domain and boundary conditions (compare the free-space and half-space formulas). The Coulomb potential and the $1/p(\xi)$ rule are both correct.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A Green's function is the response to a unit point source: $LG(\cdot, y) = \delta(\cdot - y)$ plus boundary conditions.
- Superposition: $u(x) = \int G(x, y)f(y)\,dy$, the continuous analogue of the columns of $A^{-1}$.
- 1D example: a tent for $-u''$ on $[0, 1]$. Free space: $\frac{1}{4\pi|\mathbf{x}|}$ (3D Laplace), $-\frac{1}{2\pi}\ln|\mathbf{x}|$ (2D), and the Gaussian heat kernel.
- Constant coefficients on $\mathbb{R}^n$ give $\hat G = 1/p(\xi)$. Boundaries can sometimes be handled with images.
- Learned integral kernels generalise this into **neural operators**.`,
    },
  ],
  references: [
    { authors: 'L. C. Evans', title: 'Partial Differential Equations', year: 2010, venue: '2nd ed., AMS Graduate Studies in Mathematics 19', detail: '§2.2.1 (fundamental solution), §2.2.4 (Green’s function, half-space and ball)' },
    { authors: 'W. A. Strauss', title: 'Partial Differential Equations: An Introduction', year: 2008, venue: '2nd ed., Wiley', detail: 'Ch. 7 (Green’s identities and Green’s functions), Ch. 12 (distributions and transforms)' },
    { authors: 'G. B. Folland', title: 'Fourier Analysis and Its Applications', year: 1992, venue: 'Wadsworth & Brooks/Cole (reprinted AMS, 2009)', detail: 'Ch. 9–10 (generalized functions, Green’s functions)' },
    { authors: 'R. Haberman', title: 'Applied Partial Differential Equations with Fourier Series and Boundary Value Problems', year: 2013, venue: '5th ed., Pearson', detail: 'Ch. 9 (Green’s functions for time-independent problems)' },
    { authors: 'N. Kovachki, Z. Li, B. Liu, K. Azizzadenesheli, K. Bhattacharya, A. Stuart, A. Anandkumar', title: 'Neural Operator: Learning Maps Between Function Spaces with Applications to PDEs', year: 2023, venue: 'Journal of Machine Learning Research 24' },
  ],
} satisfies LessonContent;
