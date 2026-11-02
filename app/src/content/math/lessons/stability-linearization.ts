import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Ball in a bowl, pencil on its tip',
      body: String.raw`Both a ball resting in a bowl and a pencil balanced on its tip are **equilibria** — nothing moves. The difference is what a tiny nudge does: the ball rolls back, the pencil falls over.

Precisely, an equilibrium $\mathbf{x}^*$ is

- **stable** (Lyapunov stable) if every solution that starts close enough *stays* close for all future time;
- **asymptotically stable** if, in addition, nearby solutions *converge* to $\mathbf{x}^*$;
- **unstable** if it is not stable.

A frictionless spring (a centre) is stable but **not** asymptotically stable: it never settles, but it never wanders off.`,
    },
    {
      kind: 'explain',
      title: 'The one-dimensional test',
      body: String.raw`For $x' = f(x)$ with $f(x^*) = 0$, zoom in: by Taylor's theorem $f(x) \approx f'(x^*)\,(x - x^*)$. So the small deviation $u = x - x^*$ obeys

$$u' \approx f'(x^*)\,u \quad\Rightarrow\quad u(t) \approx u_0\,e^{f'(x^*)\,t}.$$

$f'(x^*) < 0$ → asymptotically stable; $f'(x^*) > 0$ → unstable; $f'(x^*) = 0$ → the test says nothing.

Example $f(x) = x - x^3$ (plotted): zeros at $0, \pm1$. $f'(x) = 1 - 3x^2$, so $f'(0) = 1$ (unstable) and $f'(\pm1) = -2$ (stable). Read it off the graph: where $f$ crosses zero going *down*, the fixed point is stable.`,
      widget: { type: 'FunctionPlot', props: { fns: ['r*x - x^3'], x: [-2, 2], y: [-2, 2], xLabel: 'x', yLabel: "x' = f(x)", params: [{ name: 'r', min: -1, max: 2, value: 1 }] }, caption: String.raw`Slide $r$ below 0: the three fixed points merge into one stable one — a *pitchfork bifurcation*.` },
    },
    {
      kind: 'numeric',
      prompt: String.raw`For $x' = x(2 - x)$, the fixed point $x^* = 2$ has linearisation rate $f'(2)$. Compute it.`,
      answer: -2,
      why: String.raw`$f(x) = 2x - x^2$, so $f'(x) = 2 - 2x$ and $f'(2) = -2 < 0$: deviations shrink like $e^{-2t}$, so $x^*=2$ is asymptotically stable (the carrying capacity). At $x^*=0$, $f'(0)=2>0$: unstable.`,
    },
    {
      kind: 'explain',
      title: 'Linearisation in 2D: the Jacobian',
      body: String.raw`For $x' = f(x,y),\ y' = g(x,y)$ the role of $f'$ is played by the **Jacobian matrix** of partial derivatives (a *partial derivative* $\partial f/\partial x$ is the ordinary derivative in $x$ with $y$ held fixed):

$$J = \begin{pmatrix} \partial f/\partial x & \partial f/\partial y \\ \partial g/\partial x & \partial g/\partial y \end{pmatrix}.$$

Evaluate $J$ at a fixed point $\mathbf{x}^*$. The deviation $\mathbf{u} = \mathbf{x} - \mathbf{x}^*$ then obeys, approximately, the **linear** system $\mathbf{u}' = J\mathbf{u}$ — which you already know how to classify with $\tau$ and $\Delta$.`,
    },
    {
      kind: 'widget',
      title: 'Worked example: the pendulum',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Damped pendulum: $f = y$, $g = -\sin x - b y$ with friction $0 < b < 2$.`,
            String.raw`Partial derivatives: $J(x,y) = \begin{pmatrix} 0 & 1 \\ -\cos x & -b \end{pmatrix}$.`,
            String.raw`Hanging down, $(0,0)$: $J = \begin{pmatrix}0&1\\-1&-b\end{pmatrix}$, $\tau = -b < 0$, $\Delta = 1$, $\tau^2 - 4\Delta = b^2 - 4 < 0$.`,
            String.raw`So $(0,0)$ is a **stable spiral**: the pendulum swings with shrinking amplitude.`,
            String.raw`Upside down, $(\pi, 0)$: $\cos\pi = -1$, so $J = \begin{pmatrix}0&1\\1&-b\end{pmatrix}$ and $\Delta = -1 < 0$.`,
            String.raw`So $(\pi,0)$ is a **saddle**: unstable, except along one special direction (a perfect push that just makes it to the top).`,
          ],
          notes: ['', String.raw`$\partial(-\sin x - by)/\partial x = -\cos x$, $\partial(-\sin x - by)/\partial y = -b$.`, '', '', '', ''],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Without friction ($b = 0$), what does linearisation say about the **upside-down** pendulum $(\pi, 0)$?`,
      choices: ['Saddle — unstable', 'Centre — stable', 'Stable spiral', 'Inconclusive'],
      answer: 0,
      why: String.raw`$J = \begin{pmatrix}0&1\\1&0\end{pmatrix}$ has $\Delta = -1 < 0$, eigenvalues $\pm1$: a saddle regardless of friction. (At the *bottom* with $b=0$ we'd get a centre, which is the inconclusive case.)`,
    },
    {
      kind: 'explain',
      title: 'When can we trust the linear picture?',
      body: String.raw`A fixed point is **hyperbolic** if no eigenvalue of $J$ has real part exactly $0$.

**Hartman–Grobman theorem:** near a hyperbolic fixed point, the nonlinear phase portrait is a continuous deformation of the linear one — same type of picture (saddle, node or spiral), same stability.

So saddles, nodes and spirals are **robust**. But a **centre** ($\tau=0$, $\Delta>0$; eigenvalues $\pm i\beta$) is fragile: the tiniest nonlinear term can turn it into a slow spiral either way. Then linearisation is *inconclusive*.`,
    },
    {
      kind: 'widget',
      title: 'A centre that isn’t',
      body: String.raw`System: $x' = -y + a\,x(x^2+y^2),\ y' = x + a\,y(x^2+y^2)$. At the origin $J = \begin{pmatrix}0&-1\\1&0\end{pmatrix}$ — a centre, for **every** $a$. But in polar coordinates the radius obeys $r' = a\,r^3$: for $a<0$ trajectories creep inward, for $a>0$ outward. Slide $a$ and watch.`,
      widget: { type: 'PhasePortrait', props: { dx: '-y + a*x*(x^2+y^2)', dy: 'x + a*y*(x^2+y^2)', range: 1.5, params: [{ name: 'a', min: -1, max: 1, value: -0.6 }] } },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`If the linearisation at a fixed point is a centre, then the nonlinear system also has closed orbits around that point.`,
      answer: false,
      why: String.raw`Centres are non-hyperbolic, so Hartman–Grobman does not apply. The example above has a linear centre for every $a$, but for $a \neq 0$ it is really a (slow) spiral. Sometimes the nonlinear system *is* a centre (e.g. the frictionless pendulum, by energy conservation) — you need extra arguments.`,
    },
    {
      kind: 'explain',
      title: 'Lyapunov functions: proof by energy',
      body: String.raw`When linearisation fails, find an "energy" that can only go down. A **Lyapunov function** $V$ for a fixed point $\mathbf{x}^*$ satisfies $V(\mathbf{x}^*) = 0$, $V > 0$ elsewhere nearby, and along trajectories

- $\dot V \le 0$ ⇒ $\mathbf{x}^*$ is stable; $\quad\dot V < 0$ (for $\mathbf{x}\ne\mathbf{x}^*$) ⇒ asymptotically stable.

Here $\dot V$ is the rate of change of $V$ along a solution (chain rule: $\dot V = \frac{\partial V}{\partial x}x' + \frac{\partial V}{\partial y}y'$). The ball-in-bowl intuition: height only decreases, so it must settle at the bottom.

Example: $x' = -x^3$. Here $f'(0) = 0$, so the 1D test is silent. Take $V = x^2$: $\dot V = 2x\cdot(-x^3) = -2x^4 < 0$ for $x \ne 0$. Asymptotically stable!`,
    },
    {
      kind: 'widget',
      title: 'Stable, but slowly',
      body: String.raw`Starting from $x(0) = 1$: $x' = -x$ decays exponentially, $x = e^{-t}$ (green), while $x' = -x^3$ gives $x = 1/\sqrt{1+2t}$ (blue) — it still tends to 0, but only like $1/\sqrt{t}$. Non-hyperbolic stability is typically much weaker.`,
      widget: { type: 'FunctionPlot', props: { fns: ['exp(-x)', '1/sqrt(1+2*x)'], x: [0, 8], y: [0, 1.1], xLabel: 't', yLabel: 'x', labels: ["x' = −x", "x' = −x³"] } },
    },
    {
      kind: 'fill',
      prompt: String.raw`For the damped pendulum, the energy $E = \tfrac12 y^2 + (1 - \cos x)$ satisfies $\dot E = $ ___, so the energy can never ___.`,
      bank: [String.raw`$-b\,y^2$`, String.raw`$b\,y^2$`, '0', 'increase', 'decrease'],
      answer: [String.raw`$-b\,y^2$`, 'increase'],
      why: String.raw`$\dot E = y\,y' + \sin x\, x' = y(-\sin x - by) + y\sin x = -by^2 \le 0$. Friction only removes energy, which proves the bottom is stable. (It's only $\le 0$, zero whenever $y = 0$; a refinement called LaSalle's principle then shows asymptotic stability.)`,
    },
    {
      kind: 'match',
      prompt: String.raw`Eigenvalues of the Jacobian at a fixed point → what you can conclude.`,
      pairs: [
        [String.raw`$-1,\ -2$`, 'Asymptotically stable node'],
        [String.raw`$1,\ -3$`, 'Saddle (unstable)'],
        [String.raw`$-1 \pm i$`, 'Asymptotically stable spiral'],
        [String.raw`$\pm 2i$`, 'Inconclusive — need more work'],
      ],
      why: String.raw`The first three are hyperbolic, so Hartman–Grobman transfers the linear picture to the nonlinear system. Purely imaginary eigenvalues have zero real part: non-hyperbolic, so the linearisation alone cannot decide.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps for analysing a fixed point of a nonlinear 2D system.',
      steps: [
        String.raw`Solve $f(x,y) = 0$ and $g(x,y)=0$ for the fixed point.`,
        String.raw`Compute the Jacobian $J$ and evaluate it there.`,
        String.raw`Compute $\tau$, $\Delta$ (or eigenvalues) of $J$.`,
        'If hyperbolic, read off the type and stability; otherwise try a Lyapunov function.',
      ],
      why: 'You need the location before you can evaluate the Jacobian, and the eigenvalues decide whether the linear verdict is trustworthy (hyperbolic) or whether a different tool is needed.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Stable**: nearby stays nearby; **asymptotically stable**: nearby converges.
- 1D: sign of $f'(x^*)$. 2D: classify the **Jacobian** $J$ at the fixed point.
- **Hartman–Grobman**: if no eigenvalue has zero real part, the nonlinear picture matches the linear one near the fixed point.
- Centres and zero eigenvalues are fragile — use a **Lyapunov function** (an energy that never increases).

This unit's ideas continue in [bifurcations](@math/bifurcations) and [limit cycles](@math/limit-cycles).`,
    },
  ],
  references: [
    { authors: 'S. H. Strogatz', title: 'Nonlinear Dynamics and Chaos', year: 2015, venue: '2nd ed., Westview Press / CRC', detail: '§2.4, §6.3–6.4, §7.2' },
    { authors: 'M. W. Hirsch, S. Smale, R. L. Devaney', title: 'Differential Equations, Dynamical Systems, and an Introduction to Chaos', year: 2013, venue: '3rd ed., Academic Press', detail: 'Ch. 8–9 (equilibria, Lyapunov functions)' },
    { authors: 'H. K. Khalil', title: 'Nonlinear Systems', year: 2002, venue: '3rd ed., Prentice Hall', detail: 'Ch. 4 (Lyapunov stability)' },
  ],
} satisfies LessonContent;
