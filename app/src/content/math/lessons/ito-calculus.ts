import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The chain rule breaks',
      body: String.raw`Ordinary calculus says $d(w^2) = 2w\,dw$. Try it on Brownian motion $W_t$ (see [SDEs](@math/sde-intro)): if $d(W^2) = 2W\,dW$, then $W_t^2 = 2\int_0^t W\,dW$, and since stochastic integrals have mean zero, $\mathbb E[W_t^2]$ would be $0$. But $\mathbb E[W_t^2] = \operatorname{Var}(W_t) = t$.

Something is missing, and it is this:
$$d(W_t^2) = 2W_t\,dW_t + dt.$$
The extra $dt$ comes from the jaggedness of Brownian paths. This lesson builds the calculus — **Itô calculus** — that accounts for it.`,
    },
    {
      kind: 'explain',
      title: 'Quadratic variation: (dW)² = dt',
      body: String.raw`Split $[0,t]$ into $N$ steps of length $\Delta t = t/N$ and add up squared increments: $Q_N = \sum (\Delta W_i)^2$.

Each $\Delta W_i \sim \mathcal N(0, \Delta t)$, so $\mathbb E[(\Delta W_i)^2] = \Delta t$ and $\operatorname{Var}[(\Delta W_i)^2] = 2\Delta t^2$. By independence,
$$\mathbb E[Q_N] = t,\qquad \operatorname{Var}[Q_N] = 2t\,\Delta t \to 0.$$
So $Q_N \to t$: the **quadratic variation** of $W$ on $[0,t]$ is $t$, deterministically. For a smooth function the same sum tends to 0. Shorthand: $(dW)^2 = dt$. Meanwhile $\sum|\Delta W_i|$ diverges: Brownian paths have infinite length.`,
    },
    {
      kind: 'widget',
      title: 'Watch the sums converge',
      body: String.raw`One Brownian path, sampled on finer and finer grids ($N = 2^k$). Blue: running $\sum(\Delta W)^2$, which hugs the dashed line $y = t$ more tightly as $N$ grows. Orange: $\sum|\Delta W|$, which keeps growing (like $\sqrt{2N/\pi}$) and runs off the chart.`,
      widget: { type: 'MathQuadraticVariation', props: { mode: 'qv', logN: 4 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`On $[0,1]$ with $N = 100$ equal steps, what is the variance of $Q_N = \sum_i (\Delta W_i)^2$?`,
      answer: 0.02,
      tolerance: 0.0001,
      why: String.raw`$\operatorname{Var}[Q_N] = N\cdot 2\Delta t^2 = 2t\,\Delta t = 2\cdot1\cdot0.01 = 0.02$, a standard deviation of about $0.14$ around the mean 1. Ten times finer gives variance $0.002$.`,
    },
    {
      kind: 'explain',
      title: 'The Itô integral and its two key properties',
      body: String.raw`For a process $H_t$ that is **non-anticipating** (its value at time $t$ uses only information up to $t$), define
$$\int_0^T H_t\,dW_t = \lim_{N\to\infty} \sum_i H_{t_i}\,\big(W_{t_{i+1}} - W_{t_i}\big),$$
always evaluating $H$ at the **left** endpoint (the limit is in mean square). Because $H_{t_i}$ is independent of the *next* increment:

- **Zero mean:** $\mathbb E\Big[\int_0^T H\,dW\Big] = 0$ (the integral is a *martingale* — a fair game).
- **Itô isometry:** $\mathbb E\Big[\Big(\int_0^T H_t\,dW_t\Big)^2\Big] = \mathbb E\Big[\int_0^T H_t^2\,dt\Big]$.

The isometry turns a hard stochastic quantity into an ordinary integral.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Use the Itô isometry to compute $\operatorname{Var}\Big(\int_0^1 t\,dW_t\Big)$.`,
      answer: 0.3333,
      tolerance: 0.002,
      why: String.raw`The mean is 0, so the variance equals $\mathbb E[(\int t\,dW)^2] = \int_0^1 t^2\,dt = 1/3$. (In fact the integral is exactly $\mathcal N(0, 1/3)$, since it is a limit of sums of independent normals.)`,
    },
    {
      kind: 'explain',
      title: 'Itô’s lemma',
      body: String.raw`Let $dX_t = \mu\,dt + \sigma\,dW_t$ and let $f(t, x)$ be once differentiable in $t$ and twice in $x$. Expand $f$ by Taylor to second order and apply the rules
$$dt\cdot dt = 0,\qquad dt\cdot dW = 0,\qquad dW\cdot dW = dt.$$
Then $(dX)^2 = \sigma^2\,dt$, and
$$df(t, X_t) = \Big(\frac{\partial f}{\partial t} + \mu\frac{\partial f}{\partial x} + \frac12\sigma^2\frac{\partial^2 f}{\partial x^2}\Big)dt + \sigma\frac{\partial f}{\partial x}\,dW_t.$$
The $\tfrac12\sigma^2 f''$ term is the **Itô correction**: the second-order term that ordinary calculus drops, but which survives because $(dW)^2$ is as big as $dt$.`,
    },
    {
      kind: 'widget',
      title: 'Two classic applications',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`**(a)** $f(x) = x^2$, $X = W$ (so $\mu = 0$, $\sigma = 1$). $f' = 2x$, $f'' = 2$.`,
            String.raw`Itô: $d(W^2) = \big(0 + 0 + \tfrac12\cdot1\cdot2\big)dt + 2W\,dW = dt + 2W\,dW$.`,
            String.raw`Integrate and rearrange: $\displaystyle\int_0^t W\,dW = \tfrac12\big(W_t^2 - t\big)$. Mean: $\tfrac12(t - t) = 0$ ✓.`,
            String.raw`**(b)** Geometric BM $dS = \mu S\,dt + \sigma S\,dW$, with $f(s) = \ln s$: $f' = 1/s$, $f'' = -1/s^2$.`,
            String.raw`Itô: $d\ln S = \big(\mu S\cdot\tfrac1S + \tfrac12\sigma^2S^2\cdot(-\tfrac1{S^2})\big)dt + \sigma S\cdot\tfrac1S\,dW = (\mu - \tfrac12\sigma^2)\,dt + \sigma\,dW$.`,
            String.raw`The right side has constant coefficients, so $\ln S_t = \ln S_0 + (\mu - \tfrac12\sigma^2)t + \sigma W_t$, i.e. $S_t = S_0e^{(\mu-\sigma^2/2)t + \sigma W_t}$.`,
          ],
          notes: [
            '',
            String.raw`The $dt$ is pure Itô correction: $\tfrac12\sigma^2 f''$.`,
            String.raw`Ordinary calculus would wrongly give $\tfrac12 W_t^2$.`,
            '',
            String.raw`Here $\sigma(S) = \sigma S$, so the correction is $\tfrac12(\sigma S)^2 f''(S)$.`,
            'This is the solution quoted in the SDE lesson; the −σ²/2 is the Itô correction.',
          ],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`For $dX = \mu X\,dt + \sigma X\,dW$, what is $d(\ln X)$?`,
      choices: [
        String.raw`$(\mu - \tfrac12\sigma^2)\,dt + \sigma\,dW$`,
        String.raw`$\mu\,dt + \sigma\,dW$`,
        String.raw`$(\mu + \tfrac12\sigma^2)\,dt + \sigma\,dW$`,
        String.raw`$(\mu - \sigma^2)\,dt + \sigma X\,dW$`,
      ],
      answer: 0,
      why: String.raw`With $f = \ln x$: $f' = 1/x$ and $f'' = -1/x^2$, so the correction $\tfrac12(\sigma X)^2\cdot(-1/X^2) = -\tfrac12\sigma^2$. The choice $\mu\,dt + \sigma\,dW$ is the naive chain rule, which forgets the correction. The concave $\ln$ makes the correction negative.`,
    },
    {
      kind: 'explain',
      title: 'Itô vs Stratonovich',
      body: String.raw`Evaluate the integrand at the **midpoint** (or average of endpoints) instead of the left point and you get the **Stratonovich** integral, written $\int H\circ dW$. For $\int W\circ dW$ the sum telescopes exactly:
$$\sum \tfrac12(W_{t_i} + W_{t_{i+1}})(W_{t_{i+1}} - W_{t_i}) = \tfrac12 W_t^2.$$
So Stratonovich obeys the **ordinary chain rule** — but loses the zero-mean property ($\mathbb E[\tfrac12W_t^2] = t/2$).

Conversion: the Itô SDE $dX = \mu\,dt + \sigma(X)\,dW$ is the same process as the Stratonovich SDE $dX = \big(\mu - \tfrac12\sigma\sigma'\big)dt + \sigma\circ dW$, where $\sigma' = d\sigma/dx$. If $\sigma$ is constant, they coincide.

Which to use? **Itô**: non-anticipating, martingales, finance, and Euler–Maruyama converges to it. **Stratonovich**: the limit of physical noise with a tiny correlation time (Wong–Zakai), and natural on manifolds.`,
    },
    {
      kind: 'widget',
      title: 'Left point vs average point',
      body: String.raw`Same Brownian path; blue = left-point (Itô) sums for $\int_0^t W\,dW$, converging to $\tfrac12(W_t^2 - t)$ (dashed). Orange = endpoint-average (Stratonovich) sums, equal to $\tfrac12W_t^2$ (dotted) on *every* grid. The gap between them is $\tfrac12\sum(\Delta W)^2 \to t/2$: quadratic variation again.`,
      widget: { type: 'MathQuadraticVariation', props: { mode: 'integral', logN: 6 } },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`$\mathbb E\Big[\int_0^T W_t\circ dW_t\Big] = 0$ (Stratonovich integral).`,
      answer: false,
      why: String.raw`The Stratonovich integral equals $\tfrac12W_T^2$, whose mean is $T/2$. It is the **Itô** integral $\int W\,dW = \tfrac12(W_T^2 - T)$ that has mean zero: left-point evaluation makes each term independent of its increment.`,
    },
    {
      kind: 'explain',
      title: 'Fokker–Planck: how probability flows',
      body: String.raw`Instead of following single paths, follow the **probability density** $p(x, t)$ of $X_t$. For $dX = \mu(x)\,dt + \sigma(x)\,dW$ it obeys the **Fokker–Planck** (Kolmogorov forward) equation
$$\frac{\partial p}{\partial t} = -\frac{\partial}{\partial x}\big(\mu\,p\big) + \frac12\frac{\partial^2}{\partial x^2}\big(\sigma^2 p\big).$$
Drift transports probability; diffusion spreads it. (Derivation: apply Itô's lemma to a test function $f(X_t)$, take expectations, integrate by parts.)

- Brownian motion ($\mu = 0$, $\sigma = 1$): $\partial_t p = \tfrac12\partial_{xx}p$ — the [heat equation](@math/pde-heat-equation).
- OU ($\mu = -\theta x$): $\partial_t p = \partial_x(\theta x\,p) + \tfrac12\sigma^2\partial_{xx}p$, whose stationary solution is the Gaussian $\mathcal N(0, \sigma^2/2\theta)$.

This density view is how [score-based diffusion models](@ml/score-sde) reason about noising and denoising.`,
    },
    {
      kind: 'widget',
      title: 'Densities evolving',
      body: String.raw`Both processes start at $X_0 = 0$ with $\sigma = 1$. Green: Brownian motion, density $\mathcal N(0, s)$ — keeps flattening forever. Blue: OU with $\theta = 1$, density $\mathcal N\big(0, \tfrac12(1 - e^{-2s})\big)$ — spreads at first, then freezes at the stationary $\mathcal N(0, \tfrac12)$. Drag the time $s$.`,
      widget: { type: 'FunctionPlot', props: { fns: ['exp(-x^2/(2*s))/sqrt(2*PI*s)', 'exp(-x^2/(1-exp(-2*s)))/sqrt(PI*(1-exp(-2*s)))'], x: [-4, 4], y: [0, 1.5], xLabel: 'x', yLabel: 'p(x, s)', params: [{ name: 's', min: 0.05, max: 5, value: 0.2, label: 'time s' }], labels: ['Brownian motion', 'Ornstein–Uhlenbeck'] } },
    },
    {
      kind: 'fill',
      prompt: String.raw`Itô's lemma for $dX = \mu\,dt + \sigma\,dW$: $df = \big(f_t + \mu f_x + $ ___ $f_{xx}\big)dt\ +$ ___ $dW$.`,
      bank: [String.raw`$\tfrac12\sigma^2$`, String.raw`$\sigma^2$`, String.raw`$\tfrac12\sigma$`, String.raw`$\sigma f_x$`, String.raw`$\mu f_x$`, String.raw`$\sigma f_{xx}$`],
      answer: [String.raw`$\tfrac12\sigma^2$`, String.raw`$\sigma f_x$`],
      why: String.raw`The second-order Taylor term is $\tfrac12 f_{xx}(dX)^2 = \tfrac12 f_{xx}\sigma^2\,dt$, since $(dW)^2 = dt$ and the other products vanish. The noise term is the ordinary chain-rule term $f_x\cdot\sigma\,dW$.`,
    },
    {
      kind: 'match',
      prompt: 'Itô multiplication table: match each product of differentials to its value.',
      pairs: [
        [String.raw`$dt\cdot dt$`, '0'],
        [String.raw`$dW\cdot dW$`, String.raw`$dt$`],
        [String.raw`$dt\cdot dW$`, String.raw`0 (it is of size $dt^{3/2}$)`],
        [String.raw`$dW\cdot dB$ ($B$ an independent Brownian motion)`, String.raw`0 (independent kicks average out)`],
      ],
      why: String.raw`Only $(dW)^2$ survives at order $dt$, because $\Delta W \sim \sqrt{\Delta t}$. Products with $dt$ are higher order. For independent Brownian motions $\sum \Delta W\,\Delta B$ has mean 0 and vanishing variance (correlated ones would give $\rho\,dt$).`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Quadratic variation**: $\sum(\Delta W)^2 \to t$, i.e. $(dW)^2 = dt$; Brownian paths have infinite length.
- **Itô integral**: left-point sums; mean zero and the **isometry** $\mathbb E[(\int H\,dW)^2] = \mathbb E\int H^2\,dt$.
- **Itô's lemma**: $df = (f_t + \mu f_x + \tfrac12\sigma^2 f_{xx})dt + \sigma f_x\,dW$. Examples: $\int W\,dW = \tfrac12(W_t^2 - t)$; GBM $= S_0e^{(\mu - \sigma^2/2)t + \sigma W_t}$.
- **Stratonovich** (midpoint) keeps the ordinary chain rule; convert with drift shift $-\tfrac12\sigma\sigma'$.
- **Fokker–Planck**: $\partial_t p = -\partial_x(\mu p) + \tfrac12\partial_{xx}(\sigma^2p)$; Brownian motion gives the heat equation.`,
    },
  ],
  references: [
    { authors: 'B. Øksendal', title: 'Stochastic Differential Equations: An Introduction with Applications', year: 2003, venue: '6th ed., Springer', detail: 'Ch. 3 (Itô integral, Itô isometry, Stratonovich), Ch. 4 (Itô formula), Ch. 7 (generator of an Itô diffusion), Ch. 8 (Kolmogorov’s backward equation)' },
    { authors: 'K. Itô', title: 'Stochastic integral', year: 1944, venue: 'Proceedings of the Imperial Academy (Tokyo) 20, 519–524' },
    { authors: 'D. J. Higham', title: 'An algorithmic introduction to numerical simulation of stochastic differential equations', year: 2001, venue: 'SIAM Review 43(3), 525–546', detail: 'Itô vs Stratonovich integrals computed numerically' },
    { authors: 'H. Risken', title: 'The Fokker–Planck Equation: Methods of Solution and Applications', year: 1989, venue: '2nd ed., Springer' },
  ],
} satisfies LessonContent;
