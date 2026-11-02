import type { LessonContent } from '../../types';

// GD (η = 0.18) zig-zags on L = 0.5x² + 5y²; Newton jumps to the minimum in one step.
const px = (x: number) => 160 + 40 * x;
const py = (y: number) => 95 - 40 * y;
const gdPts = Array.from({ length: 16 }, (_, k) => `${px(-3.5 * 0.82 ** k).toFixed(1)},${py(1.8 * (-0.8) ** k).toFixed(1)}`).join(' ');
const ellipses = [1, 2, 3, 4].map((a) => `<ellipse cx="160" cy="95" rx="${40 * a}" ry="${(40 * a / Math.sqrt(10)).toFixed(1)}" fill="none" stroke="var(--c2)" stroke-width="1" opacity="0.5"/>`).join('');
const draw = (begin: string) => `<animate attributeName="stroke-dashoffset" values="1;0;0" keyTimes="0;0.6;1" dur="6s" begin="${begin}" repeatCount="indefinite"/>`;
const NEWTON_SVG = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
${ellipses}
<polyline points="${gdPts}" fill="none" stroke="var(--c5)" stroke-width="1.6" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1">${draw('0s')}</polyline>
<line x1="${px(-3.5)}" y1="${py(1.8)}" x2="160" y2="95" stroke="var(--c1)" stroke-width="2.2" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1">${draw('0s')}</line>
<circle cx="${px(-3.5)}" cy="${py(1.8)}" r="4" fill="var(--fg)"/>
<text x="160" y="99" font-size="12" text-anchor="middle" fill="var(--fg)">★</text>
<text x="8" y="182" font-size="10" fill="var(--c5)">GD, 15 steps (η = 0.18)</text>
<text x="312" y="182" font-size="10" text-anchor="end" fill="var(--c1)">Newton: 1 step</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'widget',
      title: 'Using the curvature',
      body: String.raw`[Gradient descent](@ml/gradient-descent) only uses the slope, so on a stretched bowl it zig-zags: it has no idea that one direction is 10× steeper than the other. **Second-order methods** also use the **curvature**, the Hessian $H=\nabla^2L$, to rescale the step.

On $L=\tfrac12x^2+5y^2$ below, GD (red) bounces across the valley. **Newton's method** (green) lands on the minimum in a single step.`,
      widget: { type: 'SvgDiagram', props: { svg: NEWTON_SVG } },
    },
    {
      kind: 'explain',
      title: "Newton's method",
      body: String.raw`Approximate $L$ near the current point $\boldsymbol\theta_k$ by its second-order Taylor expansion, with $\mathbf g=\nabla L(\boldsymbol\theta_k)$ and $H=\nabla^2L(\boldsymbol\theta_k)$:
$$L(\boldsymbol\theta_k+\mathbf d)\approx L(\boldsymbol\theta_k)+\mathbf g^\top\mathbf d+\tfrac12\mathbf d^\top H\mathbf d.$$
If $H$ is positive definite, this model is a bowl. Setting its gradient $\mathbf g+H\mathbf d$ to zero gives its minimizer, the **Newton step**:
$$\mathbf d=-H^{-1}\mathbf g,\qquad\boldsymbol\theta_{k+1}=\boldsymbol\theta_k-H^{-1}\nabla L(\boldsymbol\theta_k).$$
Compare GD's $-\eta\,\mathbf g$: Newton replaces the scalar $\eta$ by the matrix $H^{-1}$. That means big steps along flat directions and small ones along steep directions, which undoes ill-conditioning. On an exact quadratic the model *is* the function, so **one step** reaches the minimum.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`$L(x,y)=\tfrac12x^2+5y^2$. Starting from $(2,1)$, where does one Newton step land?`,
      choices: ['$(0,0)$', '$(1.8,0)$', '$(0,0.5)$', '$(-2,-1)$'],
      answer: 0,
      why: String.raw`$\mathbf g=(2,10)$, $H=\mathrm{diag}(1,10)$, so $H^{-1}\mathbf g=(2,1)$ and $(2,1)-(2,1)=(0,0)$: exactly the minimum. GD with $\eta=0.1$ would give $(1.8,0)$; it fixes the steep $y$-direction but barely moves in $x$.`,
    },
    {
      kind: 'widget',
      title: 'Newton in 1-D: jump to the bottom of the parabola',
      body: String.raw`In one dimension the step is $\theta_{k+1}=\theta_k-L'(\theta_k)/L''(\theta_k)$. Here $L(\theta)=\tfrac14\theta^4-\theta$ (minimum at $\theta=1$). The blue curve is the local quadratic model at the current point $a$; Newton jumps to its lowest point. Drag $a$ toward 1 and see how well the model fits there. Near $a=0$ the curvature $L''=3a^2$ is tiny and the model's vertex flies off to the right: a huge, unreliable step.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['0.25*x^4 - x', '0.25*a^4 - a + (a^3 - 1)*(x - a) + 1.5*a^2*(x - a)^2'],
          x: [-1, 2.5], y: [-1.5, 4],
          params: [{ name: 'a', min: 0.2, max: 2.5, value: 2, label: 'current point a' }],
          labels: ['L(θ)', 'quadratic model at a'], xLabel: 'θ', yLabel: 'L',
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Minimize $L(\theta)=\tfrac14\theta^4-\theta$ with Newton's method from $\theta_0=2$. What is $\theta_1$? (3 decimal places)`,
      answer: 1.417,
      tolerance: 0.002,
      why: String.raw`$L'(\theta)=\theta^3-1=7$ and $L''(\theta)=3\theta^2=12$ at $\theta_0=2$, so $\theta_1=2-7/12\approx1.417$. The following iterates are $1.111$, then $1.011$: the error is roughly squared each step.`,
    },
    {
      kind: 'explain',
      title: 'Fast near the answer, fragile far away',
      body: String.raw`**Local quadratic convergence** (Nocedal & Wright, Thm 3.5): if $H$ is positive definite at the minimizer $\boldsymbol\theta^*$ and Lipschitz nearby, then from a close enough start
$$\|\boldsymbol\theta_{k+1}-\boldsymbol\theta^*\|\le C\,\|\boldsymbol\theta_k-\boldsymbol\theta^*\|^2.$$
The number of correct digits roughly **doubles** every step, whereas GD gains a fixed number of digits per step.

Far from the minimum there is no such promise. The pure step can overshoot or increase $L$. Practical Newton methods add **globalization**:
- a **line search** $\boldsymbol\theta_{k+1}=\boldsymbol\theta_k+t\mathbf d$ with $t\le1$ chosen to decrease $L$ (*damped Newton*; Boyd & Vandenberghe §9.5);
- or a **trust region**: only trust the quadratic model within a radius.`,
    },
    {
      kind: 'explain',
      title: 'Why deep learning rarely uses pure Newton',
      body: String.raw`1. **Size.** With $p$ parameters, $H$ has $p^2$ entries and solving $H\mathbf d=-\mathbf g$ costs $O(p^3)$ by direct methods. For $p=10^9$ that is $10^{18}$ entries.
2. **Non-convexity.** If $H$ has negative eigenvalues, $-H^{-1}\mathbf g$ need not be a descent direction. Newton moves toward *any* stationary point, so saddle points attract it. Dauphin et al. (2014) argued saddles are common in high dimensions and proposed rescaling by $|H|$ (absolute eigenvalues) instead.
3. **Noise.** Curvature estimated from mini-batches is noisy, and solving with a noisy $H$ amplifies that error.

A common fix is **damping**: use $(H+\lambda I)^{-1}$, which interpolates between Newton ($\lambda\to0$) and GD with step $1/\lambda$ ($\lambda\to\infty$).`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`On a non-convex loss, the pure Newton step $-H^{-1}\nabla L$ is always a descent direction.`,
      answer: false,
      why: String.raw`The directional derivative along $\mathbf d$ is $\mathbf g^\top\mathbf d=-\mathbf g^\top H^{-1}\mathbf g$. It is negative for every $\mathbf g\ne\mathbf 0$ only if $H$ is positive definite. With negative curvature directions the step can go uphill, e.g. toward a saddle or maximum.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A modest network has $p=10^6$ parameters. Storing its full Hessian in 32-bit floats (4 bytes each), how many **terabytes** ($10^{12}$ bytes) would you need?`,
      answer: 4,
      tolerance: 0.01,
      unit: 'TB',
      why: String.raw`$p^2=10^{12}$ entries $\times$ 4 bytes $=4\times10^{12}$ bytes $=4$ TB, even ignoring symmetry. Hessian-vector products $H\mathbf v$ cost about one extra backward pass and need no stored $H$. That is how practical second-order methods (e.g. Hessian-free / conjugate-gradient solvers) avoid this.`,
    },
    {
      kind: 'explain',
      title: 'Quasi-Newton: learn the curvature from gradients',
      body: String.raw`**Quasi-Newton** methods never form $H$. After each step they record $\mathbf s_k=\boldsymbol\theta_{k+1}-\boldsymbol\theta_k$ and $\mathbf y_k=\nabla L_{k+1}-\nabla L_k$. They then update an approximation $B_{k+1}$ to satisfy the **secant equation** $B_{k+1}\mathbf s_k=\mathbf y_k$, which says the change in gradient should match curvature × step.

- **BFGS** updates an inverse-Hessian approximation with a rank-two correction each step: $O(p^2)$ memory, superlinear local convergence (Nocedal & Wright Ch. 6).
- **L-BFGS** (Liu & Nocedal 1989) keeps only the last $m$ pairs (typically 3–20): $O(mp)$ memory and time.

L-BFGS is the workhorse for smooth, full-batch, medium-scale problems; for example, it is the default solver for logistic regression in scikit-learn. With noisy mini-batch gradients, $\mathbf y_k$ mixes curvature with noise, and standard L-BFGS degrades.`,
    },
    {
      kind: 'explain',
      title: 'Gauss–Newton and the natural gradient',
      body: String.raw`**Gauss–Newton.** For least squares $L=\frac12\sum_i r_i(\boldsymbol\theta)^2$ with residual Jacobian $J$:
$$\nabla^2L=J^\top J+\textstyle\sum_i r_i\nabla^2r_i.$$
Gauss–Newton drops the second term, keeping $J^\top J\succeq0$, which is always positive semidefinite. Levenberg–Marquardt damps it: $(J^\top J+\lambda I)\mathbf d=-J^\top\mathbf r$ (Nocedal & Wright Ch. 10).

**Natural gradient** (Amari 1998). If the model defines a distribution $p_{\boldsymbol\theta}(y\mid x)$, precondition with the **Fisher information**
$$F=\mathbb E_{x,\;y\sim p_{\boldsymbol\theta}}\big[\nabla\log p_{\boldsymbol\theta}(y|x)\,\nabla\log p_{\boldsymbol\theta}(y|x)^\top\big],\qquad\boldsymbol\theta\leftarrow\boldsymbol\theta-\eta F^{-1}\nabla L.$$
This is steepest descent when distance is measured by KL divergence between predictive distributions, so it is invariant to how the model is parameterized. For [maximum-likelihood](@stats/maximum-likelihood) losses with canonical exponential-family outputs, $F$ equals the generalized Gauss–Newton matrix (Martens 2020). Scalable approximations include **K-FAC** (Kronecker-factored blocks; Martens & Grosse 2015). It reappears in RL as [TRPO](@ml/trpo-natural-gradient).`,
    },
    {
      kind: 'match',
      prompt: 'Match each method to the matrix it uses to precondition the gradient.',
      pairs: [
        ['Newton', 'The exact Hessian ∇²L'],
        ['Gauss–Newton', 'JᵀJ (Hessian with residual-curvature terms dropped)'],
        ['Natural gradient', 'The Fisher information matrix F'],
        ['L-BFGS', 'A low-rank approximation built from recent (s, y) pairs'],
        ['Adam / RMSProp', 'A diagonal running RMS of gradients'],
      ],
      why: String.raw`All of these are "precondition the gradient with some curvature-like matrix". They differ in which matrix they use and how much they pay for it, from $O(p^3)$ for exact Newton to $O(p)$ for diagonal adaptive methods. Adam's diagonal is only loosely related to curvature (it uses a square root of squared gradients).`,
    },
    {
      kind: 'fill',
      prompt: String.raw`The Newton step is $\mathbf d=-H^{-1}\mathbf g$. Near a minimum with positive-definite Hessian it converges ___, roughly doubling the correct digits each step. On a non-convex loss it can be attracted to ___ points. Adding $\lambda I$ to $H$ is called ___.`,
      bank: ['quadratically', 'linearly', 'saddle', 'global', 'damping', 'momentum', 'warmup'],
      answer: ['quadratically', 'saddle', 'damping'],
      why: String.raw`Quadratic convergence: $e_{k+1}\le Ce_k^2$. Newton seeks stationary points of the quadratic model, including saddles when $H$ is indefinite. $(H+\lambda I)$ damping (Levenberg–Marquardt style) blends Newton with gradient descent and keeps the system positive definite for large enough $\lambda$.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Newton: $\boldsymbol\theta\leftarrow\boldsymbol\theta-H^{-1}\nabla L$, the minimizer of the local quadratic model. It is exact in one step on quadratics, immune to ill-conditioning, and locally quadratically convergent.
- Far from the optimum, or with indefinite $H$, it needs line search, trust regions or damping $(H+\lambda I)$.
- Cost ($p^2$ memory, $O(p^3)$ solves), non-convexity and noise keep pure Newton out of deep learning.
- Quasi-Newton (BFGS, L-BFGS) learns curvature from gradient differences via the secant equation.
- Gauss–Newton ($J^\top J$), the natural gradient (Fisher $F$) and K-FAC are positive-semidefinite curvature surrogates. Adaptive optimizers are their cheapest, diagonal cousins.`,
    },
  ],
  references: [
    { authors: 'J. Nocedal & S. J. Wright', title: 'Numerical Optimization', year: 2006, venue: '2nd ed., Springer', detail: 'Ch. 3 (Newton, Thm 3.5), Ch. 6–7 (BFGS, L-BFGS), Ch. 10 (Gauss–Newton, Levenberg–Marquardt)' },
    { authors: 'S. Boyd & L. Vandenberghe', title: 'Convex Optimization', year: 2004, venue: 'Cambridge University Press', detail: '§9.5 (Newton’s method)', url: 'https://web.stanford.edu/~boyd/cvxbook/' },
    { authors: 'S. Amari', title: 'Natural Gradient Works Efficiently in Learning', year: 1998, venue: 'Neural Computation 10(2), 251–276' },
    { authors: 'J. Martens', title: 'New Insights and Perspectives on the Natural Gradient Method', year: 2020, venue: 'JMLR 21(146)', url: 'https://arxiv.org/abs/1412.1193' },
    { authors: 'L. Bottou, F. E. Curtis & J. Nocedal', title: 'Optimization Methods for Large-Scale Machine Learning', year: 2018, venue: 'SIAM Review 60(2), 223–311', detail: '§6 (second-order methods)', url: 'https://arxiv.org/abs/1606.04838' },
  ],
} satisfies LessonContent;
