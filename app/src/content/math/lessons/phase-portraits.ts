import type { LessonContent } from '../../types';

const traceDetSvg = String.raw`<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-size="10" font-family="inherit">
  <rect x="0" y="150" width="320" height="50" fill="var(--c5)" opacity="0.10"/>
  <path d="M20,22 Q160,278 300,22 L300,8 L20,8 Z" fill="var(--c2)" opacity="0.10"/>
  <line x1="10" y1="150" x2="312" y2="150" stroke="var(--fg)" stroke-width="1"/>
  <line x1="160" y1="196" x2="160" y2="8" stroke="var(--fg)" stroke-width="1"/>
  <path d="M20,22 Q160,278 300,22" fill="none" stroke="var(--c4)" stroke-width="2"/>
  <line x1="160" y1="150" x2="160" y2="8" stroke="var(--c3)" stroke-width="3"/>
  <text x="306" y="146" fill="var(--fg)" text-anchor="end">τ (trace)</text>
  <text x="165" y="18" fill="var(--fg)">Δ (det)</text>
  <text x="256" y="16" fill="var(--c4)" font-size="9">τ² = 4Δ</text>
  <text x="110" y="70" fill="var(--c2)" text-anchor="middle">stable</text>
  <text x="110" y="82" fill="var(--c2)" text-anchor="middle">spirals</text>
  <text x="210" y="70" fill="var(--c2)" text-anchor="middle">unstable</text>
  <text x="210" y="82" fill="var(--c2)" text-anchor="middle">spirals</text>
  <text x="166" y="112" fill="var(--c3)" font-size="9">centres</text>
  <text x="40" y="132" fill="var(--fg)" text-anchor="middle">stable</text>
  <text x="40" y="143" fill="var(--fg)" text-anchor="middle">nodes</text>
  <text x="280" y="132" fill="var(--fg)" text-anchor="middle">unstable</text>
  <text x="280" y="143" fill="var(--fg)" text-anchor="middle">nodes</text>
  <text x="160" y="180" fill="var(--c5)" text-anchor="middle">saddles (Δ &lt; 0)</text>
  <circle r="4" fill="var(--c4)">
    <animateMotion dur="9s" repeatCount="indefinite" path="M60,60 L120,100 L200,100 L270,120 L230,180 L90,180 L60,60"/>
  </circle>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A map of every possible future',
      body: String.raw`Take a pendulum. Its **state** at any instant is two numbers: the angle $x$ and the angular velocity $y$. Plot the state as a point in the $(x,y)$ plane — the **phase plane**. As time runs, the point moves, tracing a **trajectory**.

The ODE $x' = f(x,y),\ y' = g(x,y)$ attaches an arrow $(f,g)$ to every point, so the whole plane becomes a flowing river. A **phase portrait** draws that river and some typical trajectories. You lose the clock (you can't read off *when*), but you see *every* possible behaviour at once.`,
    },
    {
      kind: 'widget',
      title: 'The pendulum’s phase portrait',
      body: String.raw`Damped pendulum: $x' = y,\ y' = -\sin x - b\,y$ (with $b$ the friction). With $b=0$, small swings are closed loops; big energy gives wavy lines across the top/bottom — the pendulum whirls over the top. Raise $b$ and loops become spirals into rest at $(0,0)$. The points $(\pm\pi, 0)$ are the pendulum balanced upside down.`,
      widget: { type: 'PhasePortrait', props: { dx: 'y', dy: '-sin(x) - b*y', range: 4, params: [{ name: 'b', min: 0, max: 1, value: 0.15, label: 'friction b' }] } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Where are the **fixed points** (equilibria) of $x' = y,\ y' = -\sin x$?`,
      choices: [String.raw`$(n\pi,\ 0)$ for every integer $n$`, String.raw`Only $(0,0)$`, String.raw`$(0,\ n\pi)$ for every integer $n$`, String.raw`$(n\pi/2,\ 0)$`],
      answer: 0,
      why: String.raw`A fixed point needs both rates zero: $y = 0$ and $\sin x = 0$, so $x = n\pi$. Even $n$ = hanging straight down (stable), odd $n$ = balanced upside-down (unstable). It's easy to forget the upside-down ones.`,
    },
    {
      kind: 'explain',
      title: 'Classifying linear fixed points',
      body: String.raw`For a linear system $\mathbf{x}' = A\mathbf{x}$ you only need two numbers: the **trace** $\tau = a + d$ and **determinant** $\Delta = ad - bc$ of $A = \begin{pmatrix}a&b\\c&d\end{pmatrix}$. The eigenvalues are

$$\lambda = \frac{\tau \pm \sqrt{\tau^2 - 4\Delta}}{2}.$$

- $\Delta < 0$: real eigenvalues of opposite sign → **saddle**.
- $\Delta > 0$, $\tau^2 > 4\Delta$: real, same sign → **node**.
- $\Delta > 0$, $\tau^2 < 4\Delta$: complex → **spiral** (**centre** if $\tau=0$).
- When $\Delta > 0$: $\tau < 0$ → stable (trajectories approach), $\tau > 0$ → unstable. Saddles are always unstable.

(Borderline cases like $\Delta = 0$ or $\tau^2=4\Delta$ are "degenerate" and need extra care.)`,
    },
    {
      kind: 'widget',
      title: 'The trace–determinant plane',
      body: String.raw`Every $2\times2$ matrix is a point $(\tau, \Delta)$ on this map. The parabola $\tau^2 = 4\Delta$ separates nodes from spirals, the $\Delta=0$ axis cuts off saddles, and the positive $\Delta$-axis holds centres. The orange dot wanders through the regions.`,
      widget: { type: 'SvgDiagram', props: { svg: traceDetSvg } },
    },
    {
      kind: 'widget',
      title: 'Build your own fixed point',
      body: String.raw`Here $x' = a x + b y,\ y' = c x + d y$. Use the sliders to land in every region of the map: e.g. $a=d=-1, b=0, c=0$ (stable node); $b=1, c=1$ with $a=d=0$ (saddle); $a=d=0.2, b=1, c=-1$ (unstable spiral).`,
      widget: {
        type: 'PhasePortrait',
        props: {
          dx: 'a*x + b*y', dy: 'c*x + d*y', range: 3,
          params: [
            { name: 'a', min: -2, max: 2, value: -0.3 }, { name: 'b', min: -2, max: 2, value: 1 },
            { name: 'c', min: -2, max: 2, value: -1 }, { name: 'd', min: -2, max: 2, value: -0.3 },
          ],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Let $A = \begin{pmatrix}-1 & 2\\ -2 & -1\end{pmatrix}$. Compute its determinant $\Delta$.`,
      answer: 5,
      why: String.raw`$\Delta = ad - bc = (-1)(-1) - (2)(-2) = 1 + 4 = 5$. A frequent slip is $1 - 4 = -3$, forgetting that $bc = (2)(-2) = -4$ is being *subtracted*.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`For that same $A$ (with $\tau = -2$, $\Delta = 5$), what kind of fixed point is the origin?`,
      choices: ['Stable spiral', 'Unstable spiral', 'Saddle', 'Stable node'],
      answer: 0,
      why: String.raw`$\Delta>0$ and $\tau^2 - 4\Delta = 4 - 20 = -16 < 0$, so the eigenvalues are complex, $-1 \pm 2i$: a spiral. $\tau<0$ (real part $-1$) makes it spiral inward — stable.`,
    },
    {
      kind: 'match',
      prompt: 'Match each matrix to the type of fixed point at the origin.',
      pairs: [
        [String.raw`$\begin{pmatrix}-1&0\\0&-3\end{pmatrix}$`, 'Stable node'],
        [String.raw`$\begin{pmatrix}2&0\\0&-1\end{pmatrix}$`, 'Saddle'],
        [String.raw`$\begin{pmatrix}0&2\\-2&0\end{pmatrix}$`, 'Centre'],
        [String.raw`$\begin{pmatrix}1&-1\\1&1\end{pmatrix}$`, 'Unstable spiral'],
      ],
      why: String.raw`Diagonal entries are the eigenvalues of a diagonal matrix: $(-1,-3)$ both negative → stable node; $(2,-1)$ opposite signs → saddle. $\begin{pmatrix}0&2\\-2&0\end{pmatrix}$ has $\tau=0,\Delta=4$ → centre. The last has $\tau=2,\Delta=2$, $\tau^2-4\Delta=-4$ → complex with positive real part → unstable spiral.`,
    },
    {
      kind: 'explain',
      title: 'Nullclines: a sketching shortcut',
      body: String.raw`For nonlinear systems, start with **nullclines**: the curve where $x' = 0$ (arrows there point straight up or down) and the curve where $y' = 0$ (arrows point straight left or right). Fixed points sit exactly where an $x$-nullcline meets a $y$-nullcline.

**Predator–prey** (Lotka–Volterra): prey $X' = X(1 - Y)$, predators $Y' = Y(X - 1)$. Nullclines: $X=0$ or $Y=1$; and $Y=0$ or $X=1$. They cross at $(0,0)$ and $(1,1)$. Around $(1,1)$ the populations cycle forever: prey boom → predators boom → prey crash → predators crash.`,
      widget: {
        type: 'PhasePortrait',
        props: { dx: '-(x+1)*y', dy: '(y+1)*x', range: 1 },
        caption: String.raw`Axes show deviations from the coexistence point: $x = X - 1$, $y = Y - 1$. So the centre is $(X,Y)=(1,1)$ and the left/bottom edges are zero prey/predators.`,
      },
    },
    {
      kind: 'fill',
      prompt: String.raw`On the curve where $x' = $ ___, the flow arrows are ___. Fixed points are where the two kinds of nullcline ___.`,
      bank: ['0', '1', 'vertical', 'horizontal', 'intersect', 'are parallel'],
      answer: ['0', 'vertical', 'intersect'],
      why: String.raw`If $x'=0$ the arrow $(x', y') = (0, y')$ has no horizontal part, so it points vertically. A fixed point needs $x'=0$ **and** $y'=0$, i.e. a point lying on both nullclines.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`In the phase portrait of a smooth autonomous system $x' = f(x,y),\ y'=g(x,y)$, two different trajectories can cross.`,
      answer: false,
      why: String.raw`At a crossing point the state would have two different futures, which uniqueness of solutions forbids (when $f, g$ have continuous derivatives). Trajectories can *approach* the same fixed point, but they only reach it in the limit $t\to\infty$, never actually crossing.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about smooth autonomous systems are true?',
      choices: [
        'In the plane, a bounded trajectory whose limit set contains no fixed points approaches a closed orbit.',
        'Chaos is impossible for such systems in the plane.',
        'Chaos is possible with three variables (e.g. the Lorenz system).',
        'In the plane, every trajectory eventually reaches a fixed point.',
      ],
      answers: [0, 1, 2],
      why: String.raw`The first is the **Poincaré–Bendixson theorem**; it leaves too little room for chaos in 2D because trajectories can't cross. In 3D they can weave around each other, and Lorenz found chaos with 3 variables. The last is false: the spring's circles never reach a fixed point.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- The **phase plane** plots state, not time; trajectories never cross.
- **Fixed points** are where all rates vanish; find them by intersecting **nullclines**.
- Linear fixed points are classified by $\tau$ and $\Delta$: saddle ($\Delta<0$), node, spiral, centre; trajectories are attracted to the fixed point iff $\tau<0$ and $\Delta>0$.
- In 2D, a bounded trajectory settles onto a fixed point, a closed orbit, or a loop of fixed points joined by trajectories (Poincaré–Bendixson) — no chaos.

Next: how far can we trust the linear picture for nonlinear systems? → [stability & linearisation](@math/stability-linearization).`,
    },
  ],
  references: [
    { authors: 'S. H. Strogatz', title: 'Nonlinear Dynamics and Chaos', year: 2015, venue: '2nd ed., Westview Press / CRC', detail: 'Ch. 5.2, 6.1–6.5, 7.3' },
    { authors: 'M. W. Hirsch, S. Smale, R. L. Devaney', title: 'Differential Equations, Dynamical Systems, and an Introduction to Chaos', year: 2013, venue: '3rd ed., Academic Press', detail: 'Ch. 4 (trace–determinant plane), Ch. 10–11' },
  ],
} satisfies LessonContent;
