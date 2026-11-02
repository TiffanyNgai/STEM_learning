import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A coffee break that changed science',
      body: String.raw`Around 1961 the meteorologist Edward Lorenz reran a computer weather simulation from the middle, typing in numbers from a printout that had been rounded to three decimals. The new run tracked the old one briefly, then drifted off into completely different "weather".

The rounding error was tiny, yet it ruined the forecast. In 1963 he distilled the effect into three ODEs for a convecting fluid layer heated from below:
$$x' = \sigma(y - x),\qquad y' = x(\rho - z) - y,\qquad z' = xy - \beta z.$$
Here $x$ measures the strength of the convection roll, $y$ and $z$ measure temperature variations. Lorenz's classic choice: $\sigma = 10$, $\beta = 8/3$, $\rho = 28$. (He wrote $r$ and $b$ for $\rho$ and $\beta$.)`,
    },
    {
      kind: 'widget',
      title: 'Two almost identical starts',
      body: String.raw`Two trajectories start $\varepsilon = 10^{-6}$ apart (blue, orange). For a while they overlap perfectly, then they separate and wander independently over the butterfly-shaped **attractor**. The lower strip shows $\log_{10}$ of their distance: a nearly **straight rising line**, i.e. exponential growth, until it saturates at the size of the attractor. Try other $\varepsilon$, and try $\rho = 20$ (no chaos: both settle down).`,
      widget: { type: 'MathLorenz', props: { logEps: -6 } },
    },
    {
      kind: 'explain',
      title: 'What "chaos" means',
      body: String.raw`**Chaos** is aperiodic long-term behaviour in a **deterministic** system that shows **sensitive dependence on initial conditions** (Strogatz's working definition).

Sensitivity is measured by the **Lyapunov exponent** $\lambda$: a small separation $\delta_0$ typically grows like
$$|\delta(t)| \approx |\delta_0|\,e^{\lambda t}.$$
$\lambda > 0$ means chaos. For the Lorenz system with the classic parameters, $\lambda \approx 0.906$ per time unit.

This does not contradict [uniqueness](@math/existence-uniqueness): each start has exactly one future, and Grönwall's bound $e^{Lt}$ explicitly *allows* exponential separation. Determinism does not imply predictability.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Take $\lambda = 0.9$. If the initial state is known to within $\delta_0 = 10^{-6}$ and the forecast is useless once the error reaches $1$, how long is the **prediction horizon** $t = \frac{1}{\lambda}\ln\frac{1}{\delta_0}$?`,
      answer: 15.35,
      tolerance: 0.3,
      unit: 'time units',
      why: String.raw`$\ln(10^6) = 6\ln 10 \approx 13.82$, divided by $0.9$ gives $\approx 15.4$. The horizon grows only **logarithmically** with measurement accuracy.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Continuing ($\lambda = 0.9$): you measure the initial state **1000 times** more accurately ($\delta_0 = 10^{-9}$). How does the horizon change?`,
      choices: [
        'It increases by about 7.7 time units',
        'It becomes 1000 times longer',
        'It roughly doubles',
        'It becomes infinite',
      ],
      answer: 0,
      why: String.raw`The horizon is $\frac{1}{\lambda}\ln\frac{1}{\delta_0}$, so it grows by $\ln(1000)/0.9 \approx 6.91/0.9 \approx 7.7$: from about 15.4 to about 23.0. Huge gains in accuracy buy only modest gains in forecast length — the essential reason weather is unpredictable beyond a couple of weeks.`,
    },
    {
      kind: 'explain',
      title: 'Strange attractors: stretch and fold',
      body: String.raw`Trajectories stay bounded yet never repeat. How? Two effects compete.

- **Volume shrinks.** The divergence of the Lorenz field is $\frac{\partial x'}{\partial x} + \frac{\partial y'}{\partial y} + \frac{\partial z'}{\partial z} = -\sigma - 1 - \beta \approx -13.67$, so any blob of initial conditions shrinks in volume like $e^{-13.67\,t}$. The attractor therefore has **zero volume**.
- **Distances stretch** in one direction ($\lambda > 0$).

Stretching in one direction while squeezing overall and folding back (to stay bounded) produces a **strange attractor**: an infinitely layered set of fractal dimension about $2.06$ — "a little more than a surface".`,
    },
    {
      kind: 'explain',
      title: 'How the Lorenz system becomes chaotic',
      body: String.raw`Follow $\rho$ upward (with $\sigma = 10$, $\beta = 8/3$):

- $\rho < 1$: the origin (no convection) attracts everything.
- $\rho = 1$: a pitchfork. Two new fixed points $C^\pm = \big(\pm\sqrt{\beta(\rho-1)},\ \pm\sqrt{\beta(\rho-1)},\ \rho-1\big)$ appear — steady convection rolls turning either way.
- $\rho_H = \dfrac{\sigma(\sigma + \beta + 3)}{\sigma - \beta - 1} \approx 24.74$: $C^\pm$ lose stability in a **subcritical Hopf** bifurcation.
- Above $\rho_H$ (e.g. 28) no stable fixed point or cycle is left nearby: trajectories wander chaotically between the two lobes around $C^\pm$.

(For $24.06 < \rho < 24.74$ the chaotic attractor actually coexists with the stable $C^\pm$.)`,
    },
    {
      kind: 'fill',
      prompt: String.raw`In the Lorenz system the fixed points $C^\pm$ exist for $\rho >$ ___ and lose stability at $\rho \approx$ ___.`,
      bank: ['1', '0', '24.74', '28', '13.67'],
      answer: ['1', '24.74'],
      why: String.raw`$C^\pm$ need $\beta(\rho - 1) > 0$, i.e. $\rho > 1$ (born in a pitchfork from the origin). The Hopf value $\sigma(\sigma+\beta+3)/(\sigma-\beta-1) = 10\cdot15.67/6.33 \approx 24.74$. 28 is just Lorenz's chosen chaotic value; 13.67 is the volume contraction rate.`,
    },
    {
      kind: 'widget',
      title: 'Chaos in one line: the logistic map',
      body: String.raw`Chaos doesn't need three ODEs: a single **map** iterated in discrete time suffices. The logistic map $x_{n+1} = r\,x_n(1 - x_n)$ (popularised by Robert May, 1976) settles to a fixed point for $r<3$, then to period 2, 4, 8, … at values crowding together, and is chaotic past $r_\infty \approx 3.5699$. The ratios of successive gaps converge to **Feigenbaum's constant** $\delta \approx 4.669$, the same for a whole class of maps.

Top: the orbit diagram. Bottom: iterates from $x_0 = 0.2$ (blue) and $0.2001$ (red). Set $r = 3.9$ and watch them separate; set $r = 3.83$ for a periodic window inside chaos.`,
      widget: { type: 'MathLogisticMap', props: { r: 3.2 } },
    },
    {
      kind: 'truefalse',
      prompt: 'Chaotic behaviour requires random noise or some other source of randomness in the equations.',
      answer: false,
      why: 'The Lorenz equations and the logistic map are completely deterministic: the same input always gives the same output. The apparent randomness comes from exponential amplification of tiny differences in the initial state, not from any random term.',
    },
    {
      kind: 'multi',
      prompt: 'Which kinds of system can be chaotic?',
      choices: [
        'A 3D autonomous ODE system (e.g. Lorenz)',
        'A 1D map such as the logistic map',
        'A periodically forced pendulum (2D ODE with time-periodic forcing)',
        'A 2D autonomous ODE system',
        String.raw`A 1D autonomous ODE $x' = f(x)$`,
      ],
      answers: [0, 1, 2],
      why: String.raw`Autonomous ODEs need at least 3 dimensions: in 1D trajectories are monotone, and in 2D [Poincaré–Bendixson](@math/limit-cycles) rules chaos out. Periodic forcing adds time as a third (circular) dimension. Maps escape these limits because points jump rather than flow, so even 1D maps can be chaotic.`,
    },
    {
      kind: 'match',
      prompt: 'Match each concept to its description.',
      pairs: [
        ['Lyapunov exponent', 'Exponential rate at which nearby trajectories separate'],
        ['Strange attractor', 'Zero-volume fractal set that trajectories approach and wander on'],
        ['Prediction horizon', 'Time until a small initial error grows to the size of the signal'],
        ['Feigenbaum constant', 'Universal ratio ≈ 4.669 in period-doubling cascades'],
      ],
      why: String.raw`$\lambda$ sets the separation rate; dissipation makes the attractor zero-volume while stretching makes it fractal; the horizon is $\frac{1}{\lambda}\ln(\text{tolerance}/\delta_0)$; Feigenbaum's $\delta$ governs how fast period doublings accumulate.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps of the standard numerical estimate of the largest Lyapunov exponent.',
      steps: [
        String.raw`Run a reference trajectory until it is on the attractor, and place a second point a tiny distance $\delta_0$ away.`,
        String.raw`Integrate both for a short time $\Delta t$.`,
        String.raw`Record $\ln(\delta/\delta_0)$, where $\delta$ is the new separation.`,
        String.raw`Rescale the separation back to $\delta_0$, keeping its direction, and repeat.`,
        String.raw`Average: $\lambda \approx \frac{1}{N\Delta t}\sum \ln(\delta_k/\delta_0)$.`,
      ],
      why: String.raw`Rescaling keeps the separation small, so it measures the *linearised* growth rate rather than saturating at the attractor size (as the widget's curve eventually does). Averaging over many intervals samples the whole attractor.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Chaos**: deterministic, aperiodic, sensitive to initial conditions; measured by a positive **Lyapunov exponent** ($\lambda \approx 0.906$ for Lorenz at $\rho=28$).
- Errors grow like $e^{\lambda t}$, so the **prediction horizon** grows only like $\ln(1/\delta_0)$.
- Lorenz attractor: volumes shrink (divergence $-\sigma-1-\beta$) while distances stretch → **strange attractor**, dimension ≈ 2.06.
- Route in Lorenz: pitchfork at $\rho=1$, subcritical Hopf at $\rho\approx24.74$. Logistic map: **period doubling** to chaos at $r\approx3.5699$.
- Autonomous ODEs need ≥ 3 dimensions for chaos; maps don't.

Since formulas fail here, we need computers: [numerical methods](@math/numerical-ode).`,
    },
  ],
  references: [
    { authors: 'E. N. Lorenz', title: 'Deterministic nonperiodic flow', year: 1963, venue: 'Journal of the Atmospheric Sciences 20(2), 130–141' },
    { authors: 'S. H. Strogatz', title: 'Nonlinear Dynamics and Chaos', year: 2015, venue: '2nd ed., Westview Press / CRC', detail: 'Ch. 9 (Lorenz equations), Ch. 10 (one-dimensional maps)' },
    { authors: 'R. M. May', title: 'Simple mathematical models with very complicated dynamics', year: 1976, venue: 'Nature 261, 459–467' },
    { authors: 'M. J. Feigenbaum', title: 'Quantitative universality for a class of nonlinear transformations', year: 1978, venue: 'Journal of Statistical Physics 19(1), 25–52' },
  ],
} satisfies LessonContent;
