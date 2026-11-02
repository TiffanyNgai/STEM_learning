import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Turn a knob, and the world changes',
      body: String.raw`Press down on a ruler standing on a table. For a while nothing happens; then, past a critical force, it suddenly bows left or right. Nothing about the physics jumped, but the *set of possible behaviours* did.

Models have parameters too: $x' = f(x, r)$ with a knob $r$. A **bifurcation** is a value $r_c$ where the phase portrait changes **qualitatively** as $r$ passes through it: fixed points or cycles appear, disappear, or change stability.

In [stability & linearisation](@math/stability-linearization) we learnt that hyperbolic fixed points are robust to small changes. So in 1D a bifurcation can only happen where a fixed point is **non-hyperbolic**: $f(x^*, r_c) = 0$ **and** $\partial f/\partial x\,(x^*, r_c) = 0$.`,
    },
    {
      kind: 'widget',
      title: 'Saddle-node: two fixed points collide and vanish',
      body: String.raw`Normal form $x' = r + x^2$. For $r < 0$ there are two fixed points $x^* = \pm\sqrt{-r}$: the lower one is stable, the upper one unstable. As $r \uparrow 0$ they approach, merge at $r = 0$, and for $r > 0$ there are **none** — everything flows to $+\infty$.

The diagram plots fixed points against $r$ (solid = stable, dashed = unstable). The blue vertical line is the phase line at the current $r$; drag the slider and watch the dots.`,
      widget: { type: 'MathBifurcation', props: { kind: 'saddle-node', r: -1 } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`For $x' = r + x^2$ with $r = -4$, which fixed point is stable?`,
      choices: [String.raw`$x^* = -2$`, String.raw`$x^* = 2$`, 'Both', 'Neither'],
      answer: 0,
      why: String.raw`Fixed points solve $x^2 = 4$, so $x^* = \pm 2$. The slope $f'(x) = 2x$ is $-4 < 0$ at $x^*=-2$ (stable) and $+4 > 0$ at $x^*=2$ (unstable). That is the general picture of a saddle-node: one stable, one unstable partner.`,
    },
    {
      kind: 'explain',
      title: 'Ghosts and bottlenecks',
      body: String.raw`Just past a saddle-node ($r$ slightly positive), the fixed points are gone, but the flow is still very slow near $x = 0$ — their **ghost** remains. The time to pass through is
$$T = \int_{-\infty}^{\infty}\frac{dx}{r + x^2} = \frac{\pi}{\sqrt r},$$
which grows without bound as $r \to 0^+$. Systems near a saddle-node linger for a long time and then move off quickly: a common signature of "tipping points" in ecology and climate models.

Example: $r = 0.01$ gives $T = \pi/0.1 \approx 31$ time units, whereas $r = 1$ gives $T \approx 3.1$.`,
    },
    {
      kind: 'explain',
      title: 'Transcritical and pitchfork',
      body: String.raw`**Transcritical** — $x' = rx - x^2$. There is always a fixed point at $x = 0$ and another at $x = r$. They pass through each other at $r = 0$ and **exchange stability**. Typical when a state (like "zero population" or "laser off") must exist for every $r$.

**Pitchfork (supercritical)** — $x' = rx - x^3$. Symmetric under $x \to -x$. For $r<0$ the only fixed point $0$ is stable. At $r=0$ it loses stability and two new stable fixed points $\pm\sqrt r$ branch off — the buckling ruler choosing left or right.

Both are shown next; use the buttons to switch normal forms.`,
    },
    {
      kind: 'widget',
      title: 'All four 1D bifurcations',
      body: String.raw`Start on **pitchfork** and drag $r$ from $-1$ up to $1$: the dots that used to settle at 0 now pick $+\sqrt r$ or $-\sqrt r$ depending on which side they started. Then try **transcritical** and **subcritical**.`,
      widget: { type: 'MathBifurcation', props: { kind: 'pitchfork', r: -0.8, switchable: true } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`For the supercritical pitchfork $x' = rx - x^3$ at $r = 0.25$, what is the positive stable fixed point?`,
      answer: 0.5,
      tolerance: 0.001,
      why: String.raw`Fixed points: $x(r - x^2) = 0$, so $x = 0$ or $x = \pm\sqrt{r} = \pm 0.5$. At $\pm0.5$, $f'(x) = r - 3x^2 = 0.25 - 0.75 = -0.5 < 0$: stable. At 0, $f'(0) = r > 0$: unstable. The new branches grow like $\sqrt r$ — a hallmark of pitchforks.`,
    },
    {
      kind: 'explain',
      title: 'Subcritical: jumps and hysteresis',
      body: String.raw`Flip the sign of the cubic: $x' = rx + x^3 - x^5$ (the $-x^5$ keeps things bounded). Now the branches near 0 for $r < 0$ are **unstable** and bend backward. At $r = 0$ the origin loses stability with **no** nearby stable state to catch it: the system **jumps** to a distant large-amplitude branch.

Turn $r$ back down below 0 and it does not jump back. It stays on the large branch until $r = -1/4$, where that branch dies in a saddle-node. This **hysteresis** (the state depends on history) is why subcritical bifurcations are considered dangerous in engineering: the change is sudden, large and hard to undo.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`In $x' = rx + x^3 - x^5$, after the jump at $r=0$, lowering $r$ to $-0.1$ brings the system straight back to $x = 0$.`,
      answer: false,
      why: String.raw`At $r = -0.1$ the large branches $x^2 = \tfrac{1+\sqrt{1+4r}}{2} \approx 0.89$ still exist and are stable, so the system stays there. It only drops back to 0 when $r < -1/4$, where the large stable branch meets the unstable one in a saddle-node. Different paths, different states: hysteresis.`,
    },
    {
      kind: 'explain',
      title: 'Hopf: a fixed point gives birth to an oscillation',
      body: String.raw`In 2D a fixed point can also lose stability when a complex-conjugate pair of Jacobian eigenvalues $\alpha(\mu) \pm i\omega$ crosses the imaginary axis: $\alpha$ changes sign at $\mu = 0$. A stable spiral becomes an unstable one, and (in the **supercritical** case) a small stable **limit cycle** appears around it.

Normal form, in polar coordinates $(r, \theta)$:
$$\dot r = \mu r - r^3,\qquad \dot\theta = \omega.$$
For $\mu > 0$ the circle $r = \sqrt\mu$ attracts everything: amplitude grows like $\sqrt\mu$ while the period stays near $2\pi/\omega$. A **subcritical** Hopf, like the subcritical pitchfork, gives a sudden jump to a large oscillation.`,
    },
    {
      kind: 'widget',
      title: 'Supercritical Hopf in action',
      body: String.raw`System $x' = \mu x - y - x(x^2+y^2)$, $y' = x + \mu y - y(x^2+y^2)$ — the normal form above in Cartesian coordinates (with $\omega = 1$). Jacobian at the origin: eigenvalues $\mu \pm i$. Slide $\mu$ from negative to positive: the spiral sink turns into a spiral source surrounded by a cycle of radius $\sqrt\mu$.`,
      widget: { type: 'PhasePortrait', props: { dx: 'mu*x - y - x*(x^2+y^2)', dy: 'x + mu*y - y*(x^2+y^2)', range: 1.5, params: [{ name: 'mu', min: -0.5, max: 1, value: 0.5, label: 'μ' }] } },
    },
    {
      kind: 'match',
      prompt: 'Match each normal form to its bifurcation at the parameter value 0.',
      pairs: [
        [String.raw`$x' = r + x^2$`, 'Saddle-node: fixed points collide and annihilate'],
        [String.raw`$x' = rx - x^2$`, 'Transcritical: fixed points exchange stability'],
        [String.raw`$x' = rx - x^3$`, 'Supercritical pitchfork: one stable state splits into two'],
        [String.raw`$\dot r = \mu r - r^3,\ \dot\theta = 1$`, 'Supercritical Hopf: a stable limit cycle is born'],
      ],
      why: String.raw`Count fixed points on each side of 0: $r + x^2$ goes 2 → 0; $rx - x^2$ always has 2 that cross; $rx - x^3$ goes 1 → 3 with symmetric branches; the polar Hopf form keeps one fixed point but gains the cycle $r = \sqrt\mu$.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`At a Hopf bifurcation, the Jacobian at the fixed point has a pair of ___ eigenvalues, and a ___ is born.`,
      bank: ['purely imaginary', 'zero', 'real positive', 'limit cycle', 'saddle', 'new fixed point'],
      answer: ['purely imaginary', 'limit cycle'],
      why: String.raw`The real part $\alpha$ crosses zero while the imaginary part $\omega \neq 0$ keeps things rotating, so the fixed point is non-hyperbolic with eigenvalues $\pm i\omega$. A single real eigenvalue crossing zero gives the 1D-type bifurcations (saddle-node, transcritical, pitchfork) instead, which create or destroy fixed points.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`At a bifurcation point $(x^*, r_c)$ of a 1D system $x' = f(x,r)$, which statements must hold?`,
      choices: [
        String.raw`$f(x^*, r_c) = 0$`,
        String.raw`$\partial f/\partial x\,(x^*, r_c) = 0$`,
        String.raw`The fixed point is non-hyperbolic there`,
        String.raw`$\partial f/\partial r\,(x^*, r_c) = 0$`,
        String.raw`$f$ is symmetric under $x \to -x$`,
      ],
      answers: [0, 1, 2],
      why: String.raw`Bifurcations happen at fixed points ($f = 0$) where linearisation fails ($f_x = 0$, i.e. non-hyperbolic). $f_r$ need not vanish: for $r + x^2$, $f_r = 1$. Symmetry is typical of pitchforks but not required for bifurcations in general.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **bifurcation** is a qualitative change in dynamics as a parameter crosses $r_c$; it needs a **non-hyperbolic** fixed point (1D: $f = f_x = 0$).
- **Saddle-node** $r + x^2$: birth/death of a pair; leaves a slow "ghost" with passage time $\pi/\sqrt r$.
- **Transcritical** $rx - x^2$: exchange of stability. **Pitchfork** $rx \mp x^3$: symmetric splitting; the subcritical version jumps and shows hysteresis.
- **Hopf**: complex eigenvalues cross the imaginary axis; a limit cycle of amplitude $\sim\sqrt\mu$ is born.

Next: oscillations in their own right — [limit cycles](@math/limit-cycles).`,
    },
  ],
  references: [
    { authors: 'S. H. Strogatz', title: 'Nonlinear Dynamics and Chaos', year: 2015, venue: '2nd ed., Westview Press / CRC', detail: 'Ch. 3 (saddle-node, transcritical, pitchfork), §4.3 (ghosts and bottlenecks), §8.2 (Hopf bifurcations)' },
    { authors: 'Y. A. Kuznetsov', title: 'Elements of Applied Bifurcation Theory', year: 2004, venue: '3rd ed., Springer', detail: 'Ch. 3 (one-parameter bifurcations of equilibria)' },
    { authors: 'J. Guckenheimer, P. Holmes', title: 'Nonlinear Oscillations, Dynamical Systems, and Bifurcations of Vector Fields', year: 1983, venue: 'Springer', detail: 'Ch. 3' },
  ],
} satisfies LessonContent;
