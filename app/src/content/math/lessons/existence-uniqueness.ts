import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Does the future exist — and is it unique?',
      body: String.raw`In [first-order ODEs](@math/ode-first-order) we treated an initial value problem
$$y' = f(t, y),\qquad y(t_0) = y_0$$
as a machine that predicts the future. But three things can go wrong:

1. **no solution** at all;
2. **several** solutions through the same starting point (the future is not determined);
3. a solution that exists only for a while and then **blows up** to infinity in finite time.

This lesson gives the precise conditions that rule out the first two, and shows that the third is a genuine possibility even for innocent-looking $f$.`,
    },
    {
      kind: 'widget',
      title: 'A starting point with many futures',
      body: String.raw`Take $y' = 2\sqrt{|y|}$ with $y(0) = 0$. Clearly $y \equiv 0$ works. But so does
$$y(t) = \begin{cases} 0 & t \le c \\ (t-c)^2 & t > c\end{cases}$$
for **every** $c \ge 0$: for $t>c$, $y' = 2(t-c) = 2\sqrt{(t-c)^2}$. Slide $c$: each curve sits at 0 for an arbitrary time, then takes off. Think of a leaky bucket in reverse — knowing it is empty now tells you nothing about *when* it emptied.`,
      widget: { type: 'FunctionPlot', props: { fns: ['0*x', '(x>c)*(x-c)^2'], x: [0, 4], y: [-0.5, 6], xLabel: 't', yLabel: 'y', params: [{ name: 'c', min: 0, max: 3.5, value: 1 }], labels: ['y ≡ 0', 'y = (t − c)² after c'] } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Why can $y' = 2\sqrt{|y|}$ have many solutions through $y(0)=0$ when $y' = 2y$ has only one?`,
      choices: [
        String.raw`Near $y = 0$, $\sqrt{|y|}$ has an infinitely steep slope in $y$, so it is not Lipschitz there`,
        String.raw`$\sqrt{|y|}$ is not continuous at $y = 0$`,
        String.raw`The equation is nonlinear, and nonlinear equations never have unique solutions`,
        String.raw`The initial value $y_0 = 0$ is always special`,
      ],
      answer: 0,
      why: String.raw`$\sqrt{|y|}$ *is* continuous, so existence is fine; what fails is the Lipschitz bound $|f(y_1)-f(y_2)| \le L|y_1-y_2|$, since $\sqrt{|y|}/|y| = 1/\sqrt{|y|} \to \infty$ as $y\to0$. Many nonlinear equations (e.g. $y'=y^2$) have unique solutions, and $y_0=0$ is harmless for $y'=2y$.`,
    },
    {
      kind: 'explain',
      title: 'The Lipschitz condition',
      body: String.raw`$f$ is **Lipschitz in $y$** on a region if there is a constant $L$ with
$$|f(t, y_1) - f(t, y_2)| \le L\,|y_1 - y_2|$$
for all points $(t,y_1),(t,y_2)$ in the region. In words: the slope field cannot change faster than linearly as you move vertically. (Named after Rudolf Lipschitz.)

Handy test: if $\partial f/\partial y$ is continuous on a closed, bounded rectangle, then $f$ is Lipschitz there with $L = \max|\partial f/\partial y|$, by the mean value theorem. So $y^2$, $\sin y$, $e^{y}$ are all Lipschitz on any bounded rectangle; $\sqrt{|y|}$ is not on any rectangle containing $y = 0$.`,
    },
    {
      kind: 'explain',
      title: 'The Picard–Lindelöf theorem',
      body: String.raw`Let $R = \{|t - t_0| \le a,\ |y - y_0| \le b\}$ be a rectangle around the starting point. Suppose

- $f$ is continuous on $R$, with $M = \max_R |f|$, and
- $f$ is Lipschitz in $y$ on $R$.

**Then** the initial value problem has **exactly one** solution on the interval $|t - t_0| \le h$, where $h = \min(a,\ b/M)$.

Why $b/M$? The solution moves vertically at speed at most $M$, so it cannot leave the rectangle's height $b$ before time $b/M$. Note the theorem is **local**: it promises a solution for a short time, not forever. (It also works for systems: replace $|\cdot|$ by a vector norm.)`,
    },
    {
      kind: 'widget',
      title: 'Proof idea: a fixed point of an integral map',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Integrate both sides: $y$ solves the IVP exactly when $y(t) = y_0 + \int_{t_0}^{t} f(s, y(s))\,ds$.`,
            String.raw`Define the **Picard map** $P$, sending a function $\varphi$ to the function $(P\varphi)(t) = y_0 + \int_{t_0}^{t} f(s, \varphi(s))\,ds$. Solutions are exactly the **fixed points** $P\varphi = \varphi$.`,
            String.raw`Measure the distance between functions by $d(\varphi,\psi) = \max_t |\varphi(t) - \psi(t)|$. The Lipschitz bound gives $d(P\varphi, P\psi) \le L h\, d(\varphi, \psi)$.`,
            String.raw`If $Lh < 1$, $P$ is a **contraction**: it shrinks distances by a fixed factor. The Banach fixed-point theorem then gives exactly one fixed point, and the iterates $\varphi_{k+1} = P\varphi_k$ converge to it from any start.`,
            String.raw`The extra restriction $Lh<1$ can be removed (use a weighted distance or iterate $P$ several times), giving the full interval $h = \min(a, b/M)$.`,
          ],
          notes: [
            'The fundamental theorem of calculus turns the differential equation into an integral equation.',
            '',
            String.raw`$|(P\varphi - P\psi)(t)| \le \int |f(s,\varphi) - f(s,\psi)|\,ds \le L\,|t-t_0|\,\max|\varphi - \psi|$.`,
            String.raw`Completeness of the space of continuous functions with this distance is what makes the limit exist — see [metric spaces](@math/metric-spaces).`,
            'See Teschl Ch. 2 for the full argument.',
          ],
        },
      },
    },
    {
      kind: 'widget',
      title: 'Picard iterates converging',
      body: String.raw`For $y' = y$, $y(0) = 1$: start with $\varphi_0 = 1$. Then $\varphi_1 = 1 + \int_0^t 1\,ds = 1 + t$, $\varphi_2 = 1 + \int_0^t (1+s)\,ds = 1 + t + \tfrac{t^2}{2}$, and in general $\varphi_k$ is the degree-$k$ Taylor polynomial of $e^t$. Each iterate hugs the exact solution (green) over a longer stretch.`,
      widget: { type: 'FunctionPlot', props: { fns: ['exp(x)', '1+0*x', '1+x', '1+x+x^2/2', '1+x+x^2/2+x^3/6'], x: [0, 2.5], y: [0, 12], xLabel: 't', yLabel: 'y', labels: ['eᵗ (exact)', 'φ₀', 'φ₁', 'φ₂', 'φ₃'] } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`For $y' = t + y$, $y(0) = 0$, start from $\varphi_0 \equiv 0$. Compute the second Picard iterate at $t = 1$, i.e. $\varphi_2(1)$.`,
      answer: 0.6667,
      tolerance: 0.005,
      why: String.raw`$\varphi_1(t) = \int_0^t (s + 0)\,ds = t^2/2$. $\varphi_2(t) = \int_0^t (s + s^2/2)\,ds = t^2/2 + t^3/6$, so $\varphi_2(1) = 1/2 + 1/6 = 2/3$. The exact solution $e^t - t - 1$ gives $0.718$ at $t=1$; more iterates close the gap.`,
    },
    {
      kind: 'explain',
      title: 'Blow-up: why the theorem is only local',
      body: String.raw`Take $y' = y^2$, $y(0) = 1$. Here $f = y^2$ is as smooth as can be, and Lipschitz on every bounded rectangle, so the solution is unique. Separating variables gives
$$y(t) = \frac{1}{1 - t},$$
which shoots to $+\infty$ as $t \to 1$. The solution simply **ceases to exist** at $t = 1$: the faster $y$ grows, the faster it grows.

General fact (the *extension theorem*): a solution can be continued until it leaves every closed bounded set — so "it stops existing" always means "it blew up". If $f$ is Lipschitz on the **whole** space with one constant $L$ (e.g. linear systems $\mathbf{y}' = A\mathbf{y}$, or $y' = \sin y$), solutions exist for all time.`,
    },
    {
      kind: 'widget',
      title: 'Watch it escape',
      body: String.raw`Slope field of $y' = y^2$, starting at $y(0)=1$; the exact solution $1/(1-t)$ is green. Press **Run**: Euler's method (orange) cannot see the vertical asymptote at $t = 1$ and happily marches past it — a reminder that a numerical answer is only meaningful where a solution exists.`,
      widget: { type: 'SlopeFieldEuler', props: { f: 'y^2', exact: 'y0/(1-y0*(x-x0))', x: [0, 1.5], y: [0, 10], x0: 0, y0: 1, h: 0.1 } },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`If $f(t,y)$ is continuous and has continuous partial derivatives everywhere, then every solution of $y' = f(t,y)$ exists for all $t \ge t_0$.`,
      answer: false,
      why: String.raw`Smoothness gives local existence and uniqueness, not global existence. $y' = y^2$, $y(0)=1$ is smooth but its solution $1/(1-t)$ blows up at $t = 1$. Global existence needs extra control, e.g. a global Lipschitz constant or an energy bound.`,
    },
    {
      kind: 'explain',
      title: 'Continuity alone, and continuous dependence',
      body: String.raw`**Peano's theorem:** if $f$ is merely continuous, a solution still *exists* locally — but it may not be unique (as with $2\sqrt{|y|}$).

**Continuous dependence:** when $f$ is Lipschitz with constant $L$, two solutions starting at $y_0$ and $z_0$ satisfy, by **Grönwall's inequality**,
$$|y(t) - z(t)| \le |y_0 - z_0|\,e^{L|t - t_0|}.$$

So small errors in the starting value give small errors over any *fixed* time interval — but the bound allows **exponential** growth. In [chaotic systems](@math/chaos-lorenz) that growth really happens, and long-term prediction becomes impossible even though the solution is unique.`,
    },
    {
      kind: 'match',
      prompt: 'Match each initial value problem to what Picard–Lindelöf and its relatives say.',
      pairs: [
        [String.raw`$y' = y^2,\ y(0) = 1$`, 'Unique, but blows up in finite time'],
        [String.raw`$y' = 2\sqrt{|y|},\ y(0)=0$`, 'Exists, but not unique'],
        [String.raw`$y' = \sin y,\ y(0) = 1$`, 'Nonlinear, yet globally Lipschitz: unique for all time'],
        [String.raw`$y' = 3y,\ y(0)=1$`, String.raw`Picard iterates are the Taylor polynomials of $e^{3t}$`],
      ],
      why: String.raw`$y^2$ is locally but not globally Lipschitz → blow-up. $\sqrt{|y|}$ is not Lipschitz at $y=0$, which is exactly where we start. $\sin y$ is nonlinear but $|\cos y|\le1$ makes it globally Lipschitz ($L=1$), so solutions exist forever. For $y'=3y$, iterating $\varphi_{k+1} = 1+\int_0^t 3\varphi_k$ builds $1 + 3t + (3t)^2/2 + \dots$`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Which functions $f(y)$ are Lipschitz on the **whole** real line (one constant $L$ for all $y$)?`,
      choices: [String.raw`$f(y) = 3y + 2$`, String.raw`$f(y) = \sin y$`, String.raw`$f(y) = |y|$`, String.raw`$f(y) = y^2$`, String.raw`$f(y) = \sqrt{|y|}$`],
      answers: [0, 1, 2],
      why: String.raw`$3y+2$: $L=3$. $\sin y$: $|\cos| \le 1$ so $L = 1$. $|y|$: $\big||y_1|-|y_2|\big| \le |y_1-y_2|$, so $L=1$ even though it has a corner. $y^2$ has slope $2y$, unbounded on the line (only *locally* Lipschitz). $\sqrt{|y|}$ fails at 0.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`If $f$ is Lipschitz with constant $L$, two solutions starting $\delta$ apart are at most ___ apart after time $t$. For $L = 2$, $\delta = 10^{-3}$, $t = 1$ this bound is about ___.`,
      bank: [String.raw`$\delta e^{Lt}$`, String.raw`$\delta + Lt$`, String.raw`$\delta L t$`, String.raw`$7.4\times10^{-3}$`, String.raw`$2\times10^{-3}$`, String.raw`$3\times10^{-3}$`],
      answer: [String.raw`$\delta e^{Lt}$`, String.raw`$7.4\times10^{-3}$`],
      why: String.raw`Grönwall's inequality gives the exponential bound $\delta e^{Lt}$; here $10^{-3}\cdot e^2 \approx 10^{-3}\cdot 7.39$. Linear-in-$t$ bounds are wrong in general: $y'=Ly$ itself separates solutions exactly like $e^{Lt}$.`,
    },
    {
      kind: 'order',
      prompt: 'Put the steps of the Picard–Lindelöf proof in order.',
      steps: [
        'Rewrite the IVP as an integral equation.',
        'Define the Picard map on continuous functions near the initial value.',
        'Use the Lipschitz bound to show the map is a contraction (for short enough time).',
        'Apply the Banach fixed-point theorem: exactly one fixed point exists.',
        'Conclude that this fixed point is the unique solution, and the Picard iterates converge to it.',
      ],
      why: 'The integral form is what the Picard map is built from; the Lipschitz constant controls how much the map shrinks distances; completeness (Banach) then delivers existence and uniqueness in one stroke.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Picard–Lindelöf:** $f$ continuous and Lipschitz in $y$ near $(t_0,y_0)$ ⇒ exactly one solution on $|t-t_0|\le\min(a,b/M)$. Continuous $\partial f/\partial y$ suffices.
- Proof: solutions are fixed points of the Picard integral map, which is a contraction.
- **Peano:** continuity alone gives existence, not uniqueness ($y' = 2\sqrt{|y|}$).
- Existence is **local**: $y'=y^2$ blows up at $t=1$. A global Lipschitz constant gives solutions for all time.
- **Grönwall:** nearby solutions separate at most like $e^{L t}$ — the seed of chaos.

Uniqueness is why trajectories in a [phase portrait](@math/phase-portraits) never cross.`,
    },
  ],
  references: [
    { authors: 'G. Teschl', title: 'Ordinary Differential Equations and Dynamical Systems', year: 2012, venue: 'Graduate Studies in Mathematics 140, American Mathematical Society', detail: 'Ch. 2 (initial value problems: Picard–Lindelöf, Peano, extension, dependence on initial conditions)' },
    { authors: 'M. W. Hirsch, S. Smale, R. L. Devaney', title: 'Differential Equations, Dynamical Systems, and an Introduction to Chaos', year: 2013, venue: '3rd ed., Academic Press', detail: 'Ch. 7 (nonlinear systems) and Ch. 17 (existence and uniqueness revisited)' },
    { authors: 'S. H. Strogatz', title: 'Nonlinear Dynamics and Chaos', year: 2015, venue: '2nd ed., Westview Press / CRC', detail: '§2.5 (existence and uniqueness)' },
  ],
} satisfies LessonContent;
