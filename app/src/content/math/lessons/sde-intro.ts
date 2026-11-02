import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A rule for change, plus random kicks',
      body: String.raw`A pollen grain jiggling in water, a share price, the voltage of a neuron: each follows a trend but is constantly nudged at random. A **stochastic differential equation** (SDE) models this:
$$dX_t = \mu(X_t, t)\,dt + \sigma(X_t, t)\,dW_t.$$

- $X_t$ is the random state at time $t$.
- $\mu$ is the **drift**: the deterministic part, exactly like the right-hand side of an ODE.
- $\sigma$ is the **diffusion** coefficient: how strongly the noise acts.
- $W_t$ is **Brownian motion**, the standard model of accumulated random kicks; $dW_t$ is its increment over a tiny time step.

With $\sigma = 0$ we are back to an ODE.`,
    },
    {
      kind: 'recall',
      title: 'Brownian motion',
      points: [
        String.raw`$W_0 = 0$, and increments over non-overlapping time intervals are independent.`,
        String.raw`$W_t - W_s \sim \mathcal N(0,\ t - s)$: normal with mean 0 and **variance equal to the elapsed time**.`,
        String.raw`So the typical size of $W_t$ is $\sqrt t$, not $t$: random kicks partly cancel.`,
        'Paths are continuous but nowhere differentiable — infinitely jagged at every scale.',
      ],
      link: 'stats/brownian-motion',
    },
    {
      kind: 'explain',
      title: 'What the notation really means',
      body: String.raw`Since $W$ has no derivative, "$dW_t/dt$" (white noise) is not an ordinary function, so we can't treat the SDE as an ODE with a noisy right-hand side. Instead it is shorthand for an **integral equation**:
$$X_t = X_0 + \int_0^t \mu(X_s, s)\,ds + \int_0^t \sigma(X_s, s)\,dW_s.$$
The first integral is ordinary. The second, a **stochastic integral**, is defined as a limit of sums $\sum \sigma(X_{t_i}, t_i)\,(W_{t_{i+1}} - W_{t_i})$ with $\sigma$ evaluated at the **left** endpoint of each interval. This is the **Itô** convention; the reasons for it, and its surprising calculus, are the subject of [Itô calculus](@math/ito-calculus).`,
    },
    {
      kind: 'explain',
      title: 'Euler–Maruyama: Euler’s method with noise',
      body: String.raw`To simulate, chop $[0, T]$ into steps of size $\Delta t$ and copy [Euler's method](@math/numerical-ode), adding a random increment:
$$X_{n+1} = X_n + \mu(X_n, t_n)\,\Delta t + \sigma(X_n, t_n)\,\Delta W_n,\qquad \Delta W_n = \sqrt{\Delta t}\;Z_n,$$
with $Z_0, Z_1, \dots$ independent standard normal numbers.

The crucial detail is $\sqrt{\Delta t}$: the increment $W_{t+\Delta t} - W_t$ has variance $\Delta t$, hence standard deviation $\sqrt{\Delta t}$. Each run gives one random **path**; statistics come from running many.

Worked example: $dX = 2\,dt + dW$, $X_0 = 0$, $\Delta t = 0.01$, and the computer draws $Z_0 = -0.5$. Then $X_1 = 0 + 2(0.01) + 0.1(-0.5) = -0.03$.`,
    },
    {
      kind: 'widget',
      title: 'Brownian paths and their spread',
      body: String.raw`$dX = \sigma\,dW$, $X_0 = 0$, simulated on $[0,1]$. Coloured: a dozen paths. Right: histogram of $X_1$ over 600 paths, with the exact density $\mathcal N(0, \sigma^2)$ in red. Change $\sigma$ and notice the spread at $t=1$ scales with $\sigma$, its variance with $\sigma^2$.`,
      widget: { type: 'MathSdePaths', props: { mode: 'bm' } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`In Euler–Maruyama with $\Delta t = 0.04$, what is the standard deviation of each Brownian increment $\Delta W_n$?`,
      answer: 0.2,
      tolerance: 0.001,
      why: String.raw`$\Delta W_n \sim \mathcal N(0, \Delta t)$, so its standard deviation is $\sqrt{0.04} = 0.2$ — five times larger than $\Delta t$ itself. Over short times, noise dominates drift.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Someone writes $X_{n+1} = X_n + \mu\Delta t + \sigma\,\Delta t\,Z_n$ (with $\Delta t$ instead of $\sqrt{\Delta t}$). What happens as $\Delta t \to 0$?`,
      choices: [
        String.raw`The noise disappears: the paths converge to the ODE $x' = \mu$`,
        'Nothing changes — it is the same scheme with a rescaled σ',
        'The paths explode',
        'It becomes the Stratonovich version',
      ],
      answer: 0,
      why: String.raw`Over $[0,T]$ there are $T/\Delta t$ independent noise terms each of variance $\sigma^2\Delta t^2$, so the total noise variance is $\sigma^2 T\,\Delta t \to 0$. With $\sqrt{\Delta t}$, the total variance is $\sigma^2 T$, independent of the step size — the right continuum limit.`,
    },
    {
      kind: 'explain',
      title: 'Ornstein–Uhlenbeck: noise with a restoring force',
      body: String.raw`$$dX_t = -\theta X_t\,dt + \sigma\,dW_t,\qquad \theta > 0.$$
The drift pulls $X$ back toward 0 (like a spring in honey); the noise keeps kicking it. Introduced by Uhlenbeck and Ornstein (1930) for the velocity of a Brownian particle. Starting from $x_0$:
$$\mathbb E[X_t] = x_0 e^{-\theta t},\qquad \operatorname{Var}[X_t] = \frac{\sigma^2}{2\theta}\big(1 - e^{-2\theta t}\big),$$
and $X_t$ is exactly normal. As $t\to\infty$ it forgets $x_0$ and settles into the **stationary distribution** $\mathcal N\!\big(0, \sigma^2/(2\theta)\big)$: a balance of pull and noise.

The "variance-preserving" SDE that adds noise to data in [score-based diffusion models](@ml/score-sde), $dX = -\tfrac12\beta(t)X\,dt + \sqrt{\beta(t)}\,dW$, is an OU process with time-varying rate.`,
    },
    {
      kind: 'widget',
      title: 'Mean reversion',
      body: String.raw`OU paths from $X_0 = 2$. Increase $\theta$: paths are yanked toward 0 faster and fluctuate in a narrower band. The histogram of $X_1$ matches the exact normal density.`,
      widget: { type: 'MathSdePaths', props: { mode: 'ou', theta: 3 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`What is the stationary variance of the OU process $dX = -2X\,dt + dW$?`,
      answer: 0.25,
      tolerance: 0.001,
      why: String.raw`Here $\theta = 2$ and $\sigma = 1$, so $\sigma^2/(2\theta) = 1/4$. Doubling the pull $\theta$ halves the variance; doubling $\sigma$ quadruples it.`,
    },
    {
      kind: 'explain',
      title: 'Geometric Brownian motion',
      body: String.raw`When noise is **proportional** to the state — percentage returns of a stock, say — we get
$$dS_t = \mu S_t\,dt + \sigma S_t\,dW_t.$$
Its exact solution (derived in the next lesson) is
$$S_t = S_0 \exp\!\Big(\big(\mu - \tfrac12\sigma^2\big)t + \sigma W_t\Big).$$
Note the surprising $-\tfrac12\sigma^2$: it comes from Itô calculus, not ordinary calculus. $S_t$ stays positive and is **log-normal**, with mean $\mathbb E[S_t] = S_0e^{\mu t}$. This is the stock model behind the Black–Scholes option-pricing formula.`,
      widget: { type: 'MathSdePaths', props: { mode: 'gbm', mu: 0.5, sigma: 0.4 }, caption: 'GBM paths from S₀ = 1 and the log-normal law of S₁. Raise σ: the histogram becomes more skewed.' },
    },
    {
      kind: 'explain',
      title: 'How accurate is Euler–Maruyama?',
      body: String.raw`Two notions of error, both at the final time $T$:

- **Strong** (pathwise): $\mathbb E\,|X_T - X^{\Delta t}_T|$, comparing simulated and true paths driven by the same noise. EM has **strong order ½**: error $\le C\,\Delta t^{1/2}$.
- **Weak** (statistics): $|\mathbb E\,g(X_T) - \mathbb E\,g(X^{\Delta t}_T)|$ for smooth test functions $g$. EM has **weak order 1**.

(These hold under standard Lipschitz/smoothness conditions; with constant $\sigma$, EM's strong order improves to 1.) If you only need averages — means, densities — weak order is what matters, and EM is often enough. The Milstein scheme adds a correction term and reaches strong order 1. See Higham (2001) for short codes demonstrating both rates.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`For an SDE with state-dependent noise, halving $\Delta t$ in Euler–Maruyama roughly halves the strong (pathwise) error.`,
      answer: false,
      why: String.raw`Strong order ½ means error $\propto \Delta t^{1/2}$, so halving $\Delta t$ multiplies it by $1/\sqrt2 \approx 0.71$. You need 4× the steps to halve pathwise error. The *weak* error (of averages) does roughly halve.`,
    },
    {
      kind: 'match',
      prompt: 'Match each SDE to its behaviour.',
      pairs: [
        [String.raw`$dX = \sigma\,dW$`, String.raw`Spread grows without bound: $\operatorname{Var} = \sigma^2 t$`],
        [String.raw`$dX = -\theta X\,dt + \sigma\,dW$`, String.raw`Settles to a normal distribution with variance $\sigma^2/2\theta$`],
        [String.raw`$dS = \mu S\,dt + \sigma S\,dW$`, 'Stays positive; log-normally distributed'],
        [String.raw`$dX = \mu\,dt$`, 'No randomness: an ordinary differential equation'],
      ],
      why: 'Pure Brownian motion has no restoring force, so variance grows linearly. OU balances pull and noise. GBM is the exponential of a Brownian motion with drift. With σ = 0 the SDE is just an ODE.',
    },
    {
      kind: 'fill',
      prompt: String.raw`Euler–Maruyama step: $X_{n+1} = X_n + \mu\,$___$ + \sigma\,$___$\,Z_n$, with $Z_n$ standard normal.`,
      bank: [String.raw`$\Delta t$`, String.raw`$\sqrt{\Delta t}$`, String.raw`$\Delta t^2$`, String.raw`$1/\Delta t$`],
      answer: [String.raw`$\Delta t$`, String.raw`$\sqrt{\Delta t}$`],
      why: String.raw`Drift accumulates linearly in time ($\mu\Delta t$), as in Euler's method. The noise increment $\Delta W$ has variance $\Delta t$, so it is $\sqrt{\Delta t}\,Z$.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- An SDE $dX = \mu\,dt + \sigma\,dW$ is drift plus Brownian noise; it means an integral equation with an Itô (left-point) stochastic integral.
- **Euler–Maruyama**: $X_{n+1} = X_n + \mu\Delta t + \sigma\sqrt{\Delta t}\,Z_n$. Strong order ½, weak order 1.
- **Ornstein–Uhlenbeck**: mean-reverting, Gaussian, stationary law $\mathcal N(0, \sigma^2/2\theta)$ — the forward process of VP diffusion models.
- **Geometric BM**: $S_0e^{(\mu - \sigma^2/2)t + \sigma W_t}$, log-normal.

Next: the calculus that explains that $-\sigma^2/2$, and the PDE for the density — [Itô calculus & Fokker–Planck](@math/ito-calculus).`,
    },
  ],
  references: [
    { authors: 'D. J. Higham', title: 'An algorithmic introduction to numerical simulation of stochastic differential equations', year: 2001, venue: 'SIAM Review 43(3), 525–546' },
    { authors: 'B. Øksendal', title: 'Stochastic Differential Equations: An Introduction with Applications', year: 2003, venue: '6th ed., Springer', detail: 'Ch. 2–3 (Brownian motion, Itô integrals), Ch. 5 (SDEs)' },
    { authors: 'P. E. Kloeden, E. Platen', title: 'Numerical Solution of Stochastic Differential Equations', year: 1992, venue: 'Springer' },
    { authors: 'G. E. Uhlenbeck, L. S. Ornstein', title: 'On the theory of the Brownian motion', year: 1930, venue: 'Physical Review 36, 823–841' },
    { authors: 'Y. Song, J. Sohl-Dickstein, D. P. Kingma, A. Kumar, S. Ermon, B. Poole', title: 'Score-based generative modeling through stochastic differential equations', year: 2021, venue: 'ICLR 2021' },
  ],
} satisfies LessonContent;
