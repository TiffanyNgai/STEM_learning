import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'When there is no formula',
      body: String.raw`Lorenz, van der Pol, planetary orbits, reaction networks: almost no interesting ODE has a closed-form solution. We compute instead.

You met **Euler's method** in [first-order ODEs](@math/ode-first-order): with step size $h$,
$$y_{n+1} = y_n + h\,f(t_n, y_n).$$
Two questions organise this lesson: **how accurate** is a method as $h \to 0$, and **does it stay stable** for the $h$ we can afford?`,
    },
    {
      kind: 'explain',
      title: 'Local error, global error, order',
      body: String.raw`Taylor's theorem: the exact solution satisfies $y(t+h) = y(t) + h\,y'(t) + \tfrac{h^2}{2}y''(\xi)$. Euler keeps only the first two terms, so each step makes a **local error** of size $O(h^2)$ (meaning: at most a constant times $h^2$).

To reach a fixed time $T$ takes $N = T/h$ steps, so the local errors add up to a **global error** of size $N \cdot O(h^2) = O(h)$.

A method has **order $p$** if its global error is $O(h^p)$. Euler has order 1: halve $h$ and the error roughly halves. A method of order 4 cuts the error by $2^4 = 16$ when you halve $h$.`,
    },
    {
      kind: 'explain',
      title: 'Runge–Kutta: sample the slope more cleverly',
      body: String.raw`Euler uses only the slope at the start of the step. **Runge–Kutta** methods sample the slope at a few trial points inside the step and average.

**Heun (RK2):** $k_1 = f(t_n, y_n)$, $k_2 = f(t_n + h, y_n + h k_1)$, then $y_{n+1} = y_n + \tfrac h2(k_1 + k_2)$. Order 2.

**Classical RK4:**
$$k_1 = f(t_n, y_n),\quad k_2 = f\big(t_n + \tfrac h2, y_n + \tfrac h2 k_1\big),\quad k_3 = f\big(t_n + \tfrac h2, y_n + \tfrac h2 k_2\big),\quad k_4 = f(t_n + h, y_n + h k_3),$$
$$y_{n+1} = y_n + \tfrac h6\,(k_1 + 2k_2 + 2k_3 + k_4).$$
Order 4 for four evaluations of $f$ per step — the long-time workhorse.`,
    },
    {
      kind: 'widget',
      title: 'Error against step size',
      body: String.raw`Problem: $y' = y$, $y(0) = 1$ on $[0,1]$ (exact $e^t$). Left: the three solutions for $N$ steps. Right: final error vs $h$ on log–log axes. Straight lines with slopes **1, 2, 4** reveal the orders. RK4 reaches about $10^{-14}$ at the smallest $h$ shown; shrink $h$ much further and **round-off** (finite computer precision, about $10^{-16}$ per operation) would stop the line falling.`,
      widget: { type: 'MathOdeSolvers', props: { mode: 'order', f: 'y', exact: 'exp(x)', logN: 2 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Apply **Heun's method** to $y' = y$, $y(0) = 1$ with $h = 0.5$. What is the approximation of $y(1)$ after two steps?`,
      answer: 2.6406,
      tolerance: 0.001,
      why: String.raw`Step 1: $k_1 = 1$, $k_2 = f(1 + 0.5\cdot1) = 1.5$, $y_1 = 1 + 0.25(1 + 1.5) = 1.625$. For $y'=y$ each step multiplies by $1 + h + h^2/2 = 1.625$, so $y_2 = 1.625^2 = 2.6406$. Compare Euler's $2.25$ and the true $e \approx 2.7183$.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`With RK4 (in the range where round-off doesn't matter), halving $h$ reduces the global error by roughly what factor?`,
      choices: ['16', '4', '2', '32'],
      answer: 0,
      why: String.raw`Order 4 means error $\approx C h^4$; replacing $h$ by $h/2$ multiplies it by $(1/2)^4 = 1/16$. Factor 2 is Euler (order 1), 4 is Heun (order 2). The *local* error of RK4 is $O(h^5)$, which is where 32 would come from — but steps also double.`,
    },
    {
      kind: 'explain',
      title: 'Adaptive step size',
      body: String.raw`Real solvers do not use a fixed $h$. **Embedded Runge–Kutta pairs** compute two answers of different orders from (mostly) the same slope evaluations; their difference estimates the local error. If it exceeds a user tolerance, the step is rejected and $h$ shrunk; if it's tiny, $h$ grows.

The Dormand–Prince 5(4) pair (1980) is the default *ode45* in MATLAB and *RK45* in SciPy. Adaptivity spends small steps only where the solution changes quickly — e.g. the fast jumps of a van der Pol relaxation oscillation.`,
    },
    {
      kind: 'explain',
      title: 'Stiffness: when stability, not accuracy, limits h',
      body: String.raw`Test equation $y' = -\lambda y$ with $\lambda > 0$ (exact $e^{-\lambda t}$, decaying). Euler gives $y_{n+1} = (1 - h\lambda)\,y_n$. If $h\lambda > 2$ then $|1 - h\lambda| > 1$ and the numbers **explode**, even though the true solution decays.

So explicit Euler needs $h < 2/\lambda$. A problem is **stiff** when it contains very fast decaying components (large $\lambda$) alongside the slow behaviour you care about: the fast part is gone almost instantly, yet it still forces tiny steps. Chemical kinetics and circuit models are typical.

**Implicit (backward) Euler** evaluates the slope at the *new* point: $y_{n+1} = y_n + h f(t_{n+1}, y_{n+1})$. For the test equation $y_{n+1} = y_n/(1 + h\lambda)$, which decays for **every** $h > 0$ (the method is *A-stable*). The price: an equation (often solved by Newton's method) at each step.`,
    },
    {
      kind: 'widget',
      title: 'Explicit vs implicit on a stiff problem',
      body: String.raw`$y' = -\lambda y$, $y(0)=1$. Increase the step $h$ until $h\lambda > 2$: explicit Euler (red) oscillates with growing amplitude, while implicit Euler (blue) stays calm. Between $h\lambda = 1$ and $2$ explicit Euler oscillates in sign but still decays — stable but qualitatively wrong.`,
      widget: { type: 'MathOdeSolvers', props: { mode: 'stiff', lambda: 30 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`For $y' = -1000\,y$, what is the largest step size $h$ for which explicit Euler does not blow up?`,
      answer: 0.002,
      tolerance: 0.00001,
      why: String.raw`Stability needs $|1 - 1000h| \le 1$, i.e. $h \le 2/1000 = 0.002$. To integrate to $t = 10$ that's at least 5000 steps, even though $e^{-1000t}$ is essentially 0 after $t = 0.01$. Implicit Euler could take a handful of large steps.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Implicit Euler is preferred for stiff problems because it is a higher-order (more accurate) method than explicit Euler.',
      answer: false,
      why: String.raw`Both Euler methods have order 1. The advantage of implicit Euler is **stability**: its amplification factor $1/(1+h\lambda)$ has size below 1 for every $h>0$, so the step size is limited only by the accuracy you want, not by the fastest decay rate.`,
    },
    {
      kind: 'order',
      prompt: 'Order the stages of one classical RK4 step.',
      steps: [
        String.raw`$k_1$: slope at the start, $(t_n, y_n)$.`,
        String.raw`$k_2$: slope at the midpoint, reached using $k_1$.`,
        String.raw`$k_3$: slope at the midpoint again, reached using $k_2$.`,
        String.raw`$k_4$: slope at the end, reached using $k_3$.`,
        String.raw`Combine: $y_{n+1} = y_n + \tfrac h6(k_1 + 2k_2 + 2k_3 + k_4)$.`,
      ],
      why: String.raw`Each stage uses the previous one to locate its trial point, so the order is forced. The weights $1, 2, 2, 1$ (over 6) mirror Simpson's rule: when $f$ depends only on $t$, RK4 *is* Simpson's rule.`,
    },
    {
      kind: 'match',
      prompt: 'Match each method to its key property.',
      pairs: [
        ['Explicit Euler', 'Order 1; unstable on stiff problems unless h is tiny'],
        ['Heun (RK2)', 'Order 2; averages slopes at both ends of the step'],
        ['Classical RK4', 'Order 4 with four slope evaluations per step'],
        ['Implicit Euler', 'Order 1 but A-stable: needs an equation solve each step'],
        ['Dormand–Prince 5(4)', 'Embedded pair for adaptive step-size control'],
      ],
      why: 'Order measures accuracy as h → 0; stability measures behaviour at the h you actually use. Production solvers combine high order, error estimation and — for stiff problems — implicit stages.',
    },
    {
      kind: 'multi',
      prompt: 'Which observations suggest an ODE is stiff?',
      choices: [
        'An explicit adaptive solver takes tiny steps even where the solution looks smooth and slowly varying',
        'The Jacobian has eigenvalues with very different (large negative) real parts',
        'An implicit solver finishes in far fewer steps than an explicit one at the same tolerance',
        'The solution blows up in finite time',
        'The solution is chaotic',
      ],
      answers: [0, 1, 2],
      why: String.raw`Stiffness is about widely separated time scales: fast-decaying modes (large negative eigenvalues) cap the explicit step size through stability. Blow-up is an [existence](@math/existence-uniqueness) issue, and chaos is sensitivity — neither is stiffness (Lorenz is chaotic but not stiff at the usual parameters).`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Local error $O(h^{p+1})$ per step adds up to global error $O(h^p)$: the **order** $p$. Euler 1, Heun 2, RK4 4.
- Log–log error plots show order as slope; round-off sets a floor.
- Adaptive embedded pairs (Dormand–Prince, *ode45*) control error automatically.
- **Stiffness**: fast decaying modes force explicit methods to take $h < 2/\lambda$; **implicit** methods stay stable for large $h$.

The same ideas drive the samplers of diffusion models: see [fast samplers](@ml/ddim-sampling). Next we add randomness: [stochastic differential equations](@math/sde-intro).`,
    },
  ],
  references: [
    { authors: 'E. Hairer, S. P. Nørsett, G. Wanner', title: 'Solving Ordinary Differential Equations I: Nonstiff Problems', year: 1993, venue: '2nd ed., Springer', detail: 'Ch. II (Runge–Kutta methods, order, step-size control)' },
    { authors: 'E. Hairer, G. Wanner', title: 'Solving Ordinary Differential Equations II: Stiff and Differential-Algebraic Problems', year: 1996, venue: '2nd ed., Springer', detail: 'Ch. IV (stiff problems, A-stability)' },
    { authors: 'J. R. Dormand, P. J. Prince', title: 'A family of embedded Runge–Kutta formulae', year: 1980, venue: 'Journal of Computational and Applied Mathematics 6(1), 19–26' },
    { authors: 'S. H. Strogatz', title: 'Nonlinear Dynamics and Chaos', year: 2015, venue: '2nd ed., Westview Press / CRC', detail: '§2.8 (solving equations on the computer)' },
  ],
} satisfies LessonContent;
