import type { LessonContent } from '../../types';

const trapSvg = String.raw`<svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg" font-size="10" font-family="inherit">
  <circle cx="160" cy="105" r="90" fill="var(--c2)" opacity="0.10"/>
  <circle cx="160" cy="105" r="35" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.2" stroke-dasharray="4 3"/>
  <circle cx="160" cy="105" r="90" fill="none" stroke="var(--fg)" stroke-width="1.2" stroke-dasharray="4 3"/>
  <circle cx="160" cy="105" r="60" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
  <circle cx="160" cy="105" r="3" fill="var(--c5)"/>
  <g stroke="var(--c3)" stroke-width="1.6" fill="none">
    <path d="M160,8 L160,22"/><path d="M160,202 L160,188"/><path d="M63,105 L77,105"/><path d="M257,105 L243,105"/>
    <path d="M160,72 L160,58"/><path d="M160,138 L160,152"/><path d="M127,105 L113,105"/><path d="M193,105 L207,105"/>
  </g>
  <g fill="var(--c3)">
    <path d="M156,18 L160,24 L164,18 Z"/><path d="M156,192 L160,186 L164,192 Z"/><path d="M73,101 L79,105 L73,109 Z"/><path d="M247,101 L241,105 L247,109 Z"/>
    <path d="M156,62 L160,56 L164,62 Z"/><path d="M156,148 L160,154 L164,148 Z"/><path d="M117,101 L111,105 L117,109 Z"/><path d="M203,101 L209,105 L203,109 Z"/>
  </g>
  <circle r="4" fill="var(--c4)">
    <animateMotion dur="6s" repeatCount="indefinite" path="M240,105 A80,80 0 0 0 160,25 A75,75 0 0 0 87,105 A70,70 0 0 0 160,172 A64,64 0 0 0 222,105 A62,62 0 0 0 160,44 A60,60 0 0 0 100,105 A60,60 0 0 0 160,165 A60,60 0 0 0 220,105"/>
  </circle>
  <text x="160" y="100" text-anchor="middle" fill="var(--c5)" font-size="9">fixed pt</text>
  <text x="252" y="30" fill="var(--fg)" font-size="9">outer edge:</text>
  <text x="252" y="41" fill="var(--fg)" font-size="9">flow points in</text>
  <text x="6" y="30" fill="var(--fg)" font-size="9">inner edge:</text>
  <text x="6" y="41" fill="var(--fg)" font-size="9">flow points out</text>
  <text x="160" y="206" text-anchor="middle" fill="var(--c1)" font-size="9">trapped ⇒ a closed orbit inside the ring</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Oscillations with a will of their own',
      body: String.raw`A heartbeat, a cricket's chirp, a bowed violin string: each oscillates with a **preferred amplitude and period**. Disturb it and it returns to the *same* rhythm.

Linear systems cannot do this. A linear centre, such as $x' = y,\ y' = -x$, has a whole nested family of closed orbits: kick it and it simply moves to a neighbouring orbit with a different amplitude, forever.

A **limit cycle** is an **isolated** closed orbit: nearby trajectories are not closed, they spiral toward it (stable) or away from it (unstable). It can only occur in **nonlinear** systems. (Phase-plane basics: [phase portraits](@math/phase-portraits).)`,
    },
    {
      kind: 'widget',
      title: 'The simplest limit cycle',
      body: String.raw`In polar coordinates take $\dot r = r(1 - r^2)$, $\dot\theta = 1$. The radius has fixed points $r = 0$ (unstable, since $\dot r > 0$ just above 0) and $r = 1$ (stable). So every trajectory except the origin winds onto the unit circle: from inside **and** outside.

In Cartesian form this is $x' = x(1-x^2-y^2) - y$, $y' = y(1 - x^2 - y^2) + x$. Tap anywhere to drop a particle.`,
      widget: { type: 'PhasePortrait', props: { dx: 'x*(1-x^2-y^2) - y', dy: 'y*(1-x^2-y^2) + x', range: 2 } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`A system has $\dot r = r(1 - r)(r - 2)$, $\dot\theta = 1$. Which describes its closed orbits?`,
      choices: [
        String.raw`$r = 1$ is an unstable limit cycle and $r = 2$ is a stable one`,
        String.raw`$r = 1$ is stable and $r = 2$ is unstable`,
        String.raw`Both are stable`,
        'There are no limit cycles because the origin is stable',
      ],
      answer: 0,
      why: String.raw`Check signs of $\dot r$: for $0<r<1$, $r>0$, $1-r>0$, $r-2<0$ ⇒ $\dot r<0$ (shrink to 0). For $1<r<2$: $(+)(-)(-) > 0$ (grow toward 2). For $r>2$: $(+)(-)(+) < 0$ (shrink toward 2). So orbits leave $r=1$ and approach $r=2$. A stable origin can coexist with limit cycles.`,
    },
    {
      kind: 'explain',
      title: 'The van der Pol oscillator',
      body: String.raw`In the 1920s Balthasar van der Pol studied valve (vacuum-tube) circuits and arrived at
$$x'' + \mu\,(x^2 - 1)\,x' + x = 0,\qquad \mu > 0.$$
It is a spring ($x'' + x = 0$) with **nonlinear damping** $\mu(x^2-1)x'$: when $|x| < 1$ the damping is *negative* and pumps energy in; when $|x| > 1$ it is positive and drains energy. Small oscillations grow, large ones shrink, and the system settles on a unique stable limit cycle (for every $\mu > 0$, by Liénard's theorem).

- Small $\mu$: nearly a circle, amplitude $\approx 2$, period $\approx 2\pi$.
- Large $\mu$: **relaxation oscillations** — slow creeping, then fast jumps — with period $T \approx (3 - 2\ln 2)\,\mu$.

As a first-order system: $x' = y,\ y' = \mu(1 - x^2)y - x$.`,
    },
    {
      kind: 'widget',
      title: 'Van der Pol in the phase plane',
      body: String.raw`Slide $\mu$. Near $\mu = 0.2$ the cycle is a rounded loop; by $\mu = 2$ it is a lopsided shape with fast vertical segments (the jumps). Particles from inside and outside all end up on the same loop.`,
      widget: { type: 'PhasePortrait', props: { dx: 'y', dy: 'mu*(1-x^2)*y - x', range: 4, params: [{ name: 'mu', min: 0.1, max: 2.5, value: 1, label: 'μ' }] } },
    },
    {
      kind: 'widget',
      title: 'Same rhythm from any start',
      body: String.raw`Now with the clock: $x(t)$ for two starts, one tiny ($x = 0.1$) and one large ($x = 3$). After a transient both settle to the same amplitude ($\approx 2$) and period — only the phase differs. Push $\mu$ up to see relaxation oscillations: flat stretches punctuated by rapid flips.`,
      widget: { type: 'MathOdeTrace', props: { dx: 'y', dy: 'mu*(1-x^2)*y - x', starts: [[0.1, 0], [3, 0]], tMax: 40, yRange: [-3.5, 3.5], params: [{ name: 'mu', min: 0.1, max: 6, value: 1, label: 'μ' }] } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Using $T \approx (3 - 2\ln 2)\,\mu$, estimate the period of the van der Pol relaxation oscillation for $\mu = 10$.`,
      answer: 16.1,
      tolerance: 0.2,
      why: String.raw`$2\ln 2 \approx 1.386$, so $3 - 1.386 = 1.614$ and $T \approx 16.1$. This is only the leading term: a simulation gives $T \approx 19.1$ at $\mu = 10$, because the next correction ($\approx 7.01\,\mu^{-1/3}$) is still sizeable, so periods measured in the widget at moderate $\mu$ come out longer. Compare $2\pi \approx 6.28$ for small $\mu$: strong nonlinearity slows the cycle down because most time is spent creeping along the slow branches. (The formula is the leading term for large $\mu$.)`,
    },
    {
      kind: 'explain',
      title: 'Poincaré–Bendixson: proving a cycle exists',
      body: String.raw`How do we know a limit cycle exists without solving anything? In the **plane** there is a powerful theorem.

**Poincaré–Bendixson.** Suppose $R$ is a closed, bounded region of the plane, the vector field is continuously differentiable on an open set containing $R$, and $R$ contains **no fixed points**. If some trajectory starts in $R$ and stays in $R$ for all future time, then it is either a closed orbit or it spirals toward one.

Recipe: build a **trapping region** — typically a ring (annulus) around an unstable fixed point, with the flow pointing *inward* on the outer edge and *outward* (away from the fixed point) on the inner edge. Then a closed orbit must live inside the ring.`,
    },
    {
      kind: 'widget',
      title: 'A trapping ring',
      widget: { type: 'SvgDiagram', props: { svg: trapSvg }, caption: String.raw`For $\dot r = r(1-r^2)$: on the circle $r = 1/2$, $\dot r = 3/8 > 0$ (outward); on $r = 3/2$, $\dot r = -15/8 < 0$ (inward). The ring between contains no fixed point, so Poincaré–Bendixson guarantees a closed orbit — here $r = 1$.` },
    },
    {
      kind: 'truefalse',
      prompt: 'A consequence of Poincaré–Bendixson is that a smooth autonomous system of two first-order ODEs cannot be chaotic.',
      answer: true,
      why: String.raw`In the plane, a bounded trajectory must ultimately approach a fixed point, a closed orbit, or a cycle of fixed points joined by trajectories — nothing wilder. Chaos needs at least **three** dimensions for autonomous ODEs, as in the [Lorenz system](@math/chaos-lorenz). (A periodically *forced* 2D system is effectively 3D and can be chaotic.)`,
    },
    {
      kind: 'explain',
      title: 'Ruling cycles out',
      body: String.raw`Sometimes we want the opposite: proof that **no** closed orbit exists. Three standard tools:

- **Gradient systems** $\mathbf{x}' = -\nabla V$: $V$ strictly decreases along non-constant trajectories, so they can never return to where they began.
- **Lyapunov functions**: likewise, any $V$ that strictly decreases along non-constant trajectories forbids closed orbits.
- **Bendixson's criterion**: if the divergence $\partial f/\partial x + \partial g/\partial y$ has one strict sign throughout a simply connected region (no holes), no closed orbit lies entirely in it. (Dulac's refinement: first multiply the field by a positive function.)

Also, in the plane every closed orbit must **enclose at least one fixed point** (index theory).`,
    },
    {
      kind: 'multi',
      prompt: 'Which facts would rule out closed orbits (in the relevant region)?',
      choices: [
        String.raw`The system is a gradient system $\mathbf{x}' = -\nabla V$`,
        String.raw`The divergence $\partial f/\partial x + \partial g/\partial y < 0$ everywhere in a simply connected region`,
        'A function decreases strictly along every non-constant trajectory',
        'The Jacobian at the origin has purely imaginary eigenvalues',
        'The system has exactly one fixed point',
      ],
      answers: [0, 1, 2],
      why: String.raw`The first three are the standard no-cycle arguments. Purely imaginary eigenvalues are *inconclusive* (they often accompany cycles). One fixed point is exactly what the cycle $r=1$ above encloses, so it rules nothing out. Note van der Pol's divergence $\mu(1 - x^2)$ changes sign — consistent with it having a cycle.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`To apply Poincaré–Bendixson you need a closed, bounded region containing no ___ which some trajectory never ___.`,
      bank: ['fixed points', 'closed orbits', 'leaves', 'enters', 'saddles only'],
      answer: ['fixed points', 'leaves'],
      why: String.raw`If $R$ contained a fixed point, the trapped trajectory might just converge to it (which is why we cut a hole around the unstable fixed point). The trajectory must stay in $R$ for all future time, which a trapping region guarantees.`,
    },
    {
      kind: 'match',
      prompt: 'Match each system to its long-term behaviour.',
      pairs: [
        [String.raw`$x' = y,\ y' = -x$`, 'Nested family of closed orbits (a centre, no limit cycle)'],
        [String.raw`$\dot r = r(1-r^2),\ \dot\theta = 1$`, 'Stable limit cycle of radius 1'],
        [String.raw`van der Pol with $\mu = 8$`, 'Relaxation oscillations: slow drifts and fast jumps'],
        [String.raw`$\mathbf{x}' = -\nabla V$`, 'No closed orbits at all'],
      ],
      why: 'The linear centre has non-isolated orbits whose amplitude depends on the start. The polar system attracts everything (except the origin) to r = 1. Large-μ van der Pol is the classic relaxation oscillator. Gradient flows always go downhill, so they cannot loop.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **limit cycle** is an isolated closed orbit; stable ones give self-sustained oscillations with a fixed amplitude and period. Only nonlinear systems have them.
- **Van der Pol**: negative damping at small amplitude, positive at large; unique stable cycle, amplitude $\approx 2$; relaxation oscillations for large $\mu$, $T\approx(3-2\ln2)\mu$.
- **Poincaré–Bendixson**: a trapping region with no fixed points contains a closed orbit. In the plane there is no chaos.
- Rule cycles out with gradient structure, Lyapunov functions or **Bendixson's** divergence test.

Cycles are often born in [Hopf bifurcations](@math/bifurcations).`,
    },
  ],
  references: [
    { authors: 'S. H. Strogatz', title: 'Nonlinear Dynamics and Chaos', year: 2015, venue: '2nd ed., Westview Press / CRC', detail: 'Ch. 7 (limit cycles: §7.2 ruling out closed orbits, §7.3 Poincaré–Bendixson, §7.5 relaxation oscillations)' },
    { authors: 'B. van der Pol', title: 'On “relaxation-oscillations”', year: 1926, venue: 'The London, Edinburgh, and Dublin Philosophical Magazine and Journal of Science, Ser. 7, 2(11), 978–992' },
    { authors: 'M. W. Hirsch, S. Smale, R. L. Devaney', title: 'Differential Equations, Dynamical Systems, and an Introduction to Chaos', year: 2013, venue: '3rd ed., Academic Press', detail: 'Ch. 10 (closed orbits and limit sets)' },
  ],
} satisfies LessonContent;
