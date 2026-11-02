import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Where the heat equation comes from',
      body: String.raw`Let $u(x, t)$ be the temperature along a thin rod. Two physical facts:

1. **Fourier's law**: heat flows from hot to cold at a rate proportional to the temperature slope, flux $= -K\,u_x$ ($K$ is the conductivity).
2. **Energy conservation**: the temperature of a small piece rises at a rate set by how much more heat flows in than out.

Putting them together gives the **heat (diffusion) equation**

$$u_t = k\,u_{xx},\qquad k = \frac{K}{\rho c} > 0,$$

where $\rho$ is density, $c$ the specific heat and $k$ the **diffusivity**. The same equation governs ink spreading in water, dopants in silicon and [the density of Brownian particles](@physics/brownian-diffusion).`,
    },
    {
      kind: 'explain',
      title: 'The second derivative compares neighbours',
      body: String.raw`On a grid of spacing $h$,

$$u_{xx}(x) \approx \frac{u(x + h) - 2u(x) + u(x - h)}{h^2} = \frac{2}{h^2}\Big(\underbrace{\tfrac{u(x+h) + u(x-h)}{2}}_{\text{neighbour average}} - u(x)\Big).$$

So the heat equation says: **each point moves toward the average of its neighbours**, at a rate proportional to the difference. A point colder than its surroundings (a valley, $u_{xx} > 0$) warms up; a hot spot (a peak, $u_{xx} < 0$) cools down. Bumps flatten and corners round off. Sharp, wiggly features differ most from their neighbours, so they disappear fastest.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`At a point where the temperature profile has a strict local maximum in $x$ (so $u_{xx} < 0$), the heat equation makes $u$ decrease there.`,
      answer: true,
      why: String.raw`$u_t = k u_{xx}$ with $k > 0$, so $u_{xx} < 0$ gives $u_t < 0$. A hot spot is hotter than the average of its neighbours, so it loses heat. Valleys ($u_{xx} > 0$) warm up instead.`,
    },
    {
      kind: 'widget',
      title: 'Separation of variables',
      body: String.raw`Rod $0 \le x \le L$ with both ends held at $0$: $u(0, t) = u(L, t) = 0$. Look for solutions that are a shape times a time factor.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Guess $u(x, t) = X(x)\,T(t)$. Then $u_t = k u_{xx}$ becomes $X T' = k X'' T$.`,
            String.raw`Divide by $kXT$: $\dfrac{T'(t)}{k\,T(t)} = \dfrac{X''(x)}{X(x)}$. The left side depends only on $t$ and the right only on $x$, so both equal a constant, $-\lambda$.`,
            String.raw`Space: $X'' = -\lambda X$ with $X(0) = X(L) = 0$. Nonzero solutions exist only for $\lambda_n = (n\pi/L)^2$, $n = 1, 2, \dots$, with $X_n = \sin(n\pi x/L)$.`,
            String.raw`Time: $T' = -k\lambda_n T$, so $T_n = e^{-k(n\pi/L)^2 t}$.`,
            String.raw`Each **mode** $u_n = e^{-k(n\pi/L)^2t}\sin(n\pi x/L)$ keeps its shape and decays exponentially.`,
          ],
          notes: [
            'This only finds special solutions; superposition will build the general one.',
            'A function of t equal to a function of x for all x, t must be constant.',
            String.raw`This is an eigenvalue problem for $d^2/dx^2$: the $X_n$ are its eigenfunctions, like [eigenvectors](@math/eigenvalues).`,
            'An ordinary first-order ODE.',
            String.raw`Higher $n$ means a faster decay rate $k(n\pi/L)^2$.`,
          ],
        },
      },
    },
    {
      kind: 'explain',
      title: 'Superpose the modes',
      body: String.raw`The equation and boundary conditions are linear and homogeneous, so sums of modes are solutions too:

$$u(x, t) = \sum_{n=1}^{\infty} b_n\,e^{-k(n\pi/L)^2 t}\,\sin\frac{n\pi x}{L}.$$

At $t = 0$ this must equal the initial temperature $f(x)$, so the $b_n$ are the coefficients of the **Fourier sine series** of $f$ ([Fourier series](@math/fourier-series), here on $[0, L]$):

$$b_n = \frac{2}{L}\int_0^L f(x)\sin\frac{n\pi x}{L}\,dx.$$

This is exactly the problem that led Fourier to his series. The decay rate grows like $n^2$: mode 3 dies $9$ times faster than mode 1, and mode 10 dies $100$ times faster.`,
    },
    {
      kind: 'widget',
      title: 'Watch the modes die',
      body: String.raw`Here $L = \pi$ and $k = 1$, so mode $n$ decays like $e^{-n^2 t}$. The bars show each mode's current size against its starting size (outline). The box loses its corners almost instantly because its high modes vanish, and by $t \approx 1$ only a $\sin x$ hump is left. Try "noisy": the $\sin 15x$ ripple disappears long before the $\sin 7x$ one, which goes long before $\sin x$.`,
      widget: { type: 'MathHeatModes', props: { initial: 'box' } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`With $L = \pi$, $k = 1$ and zero ends, solve the heat equation with $u(x, 0) = \sin x + 0.5\sin 3x$.`,
      choices: [
        String.raw`$e^{-t}\sin x + 0.5\,e^{-9t}\sin 3x$`,
        String.raw`$e^{-t}\sin x + 0.5\,e^{-3t}\sin 3x$`,
        String.raw`$e^{-t}\big(\sin x + 0.5\sin 3x\big)$`,
        String.raw`$\cos t\,\sin x + 0.5\cos 3t\,\sin 3x$`,
      ],
      answer: 0,
      why: String.raw`Each mode $\sin nx$ decays independently as $e^{-n^2 t}$, so $\sin 3x$ gets $e^{-9t}$. Using $e^{-3t}$ forgets the square; a single common factor would mean every mode decays at the same rate; and the cosines in time describe the *wave* equation, which oscillates rather than decays.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`On the same rod ($L = \pi$, $k = 1$), how long does mode 1 ($e^{-t}\sin x$) take to fall to half its initial amplitude? (3 decimal places.)`,
      answer: 0.693,
      tolerance: 0.002,
      why: String.raw`Solve $e^{-t} = \tfrac12$: $t = \ln 2 \approx 0.693$. Mode 3 needs only $\ln 2/9 \approx 0.077$. Dividing by $n^2$ gives the half-life of every other mode.`,
    },
    {
      kind: 'explain',
      title: 'Smoothing, arrow of time, maximum principle',
      body: String.raw`Three consequences of the factors $e^{-kn^2\pi^2t/L^2}$:

- **Instant smoothing.** For any $t > 0$ the coefficients shrink faster than any power of $n$, so $u(\cdot, t)$ is infinitely differentiable, even if $f$ had jumps.
- **No going back.** Running time backwards multiplies mode $n$ by $e^{+kn^2\pi^2t/L^2}$, which blows up tiny high-frequency errors enormously. The backward heat equation is **ill-posed**: you cannot "un-blur" reliably.
- **Maximum principle.** On the rectangle $0 \le x \le L$, $0 \le t \le T$, the maximum of $u$ occurs at $t = 0$ or at an end of the rod, never at an interior point at a later time. Heat never creates a new hot spot.

As $t \to \infty$ with zero ends, $u \to 0$, dominated by the slowest mode $b_1e^{-k\pi^2t/L^2}\sin(\pi x/L)$ (if $b_1 \ne 0$).`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Which statements about $u_t = ku_{xx}$ on $[0, L]$ with zero boundary values are true?`,
      choices: [
        String.raw`For $t > 0$, $u$ is smooth even if $u(x, 0)$ has jumps.`,
        String.raw`The interior temperature can, at some later time, exceed both the initial maximum and the boundary values.`,
        String.raw`For large $t$, $u$ looks like a multiple of $\sin(\pi x/L)$ (if $b_1 \ne 0$).`,
        String.raw`Recovering $u(x, 0)$ from a slightly noisy measurement of $u(x, 1)$ is a stable computation.`,
        String.raw`Doubling $k$ makes every mode decay twice as fast.`,
      ],
      answers: [0, 2, 4],
      why: String.raw`Smoothing, the dominance of the slowest mode, and decay rates $k(n\pi/L)^2$ that are proportional to $k$ are all read straight from the series. A new interior hot spot would violate the maximum principle. Going backwards multiplies noise in mode $n$ by $e^{+k(n\pi/L)^2}$, so it is wildly unstable.`,
    },
    {
      kind: 'explain',
      title: 'On the whole line: the heat kernel',
      body: String.raw`For an infinite rod, the [Fourier transform](@math/fourier-transform) turns $u_t = ku_{xx}$ into $\hat u_t = -4\pi^2k\xi^2\,\hat u$, so $\hat u(\xi, t) = e^{-4\pi^2k\xi^2t}\hat f(\xi)$. Inverting this Gaussian factor gives

$$u(x, t) = \int_{-\infty}^{\infty}\Phi(x - y, t)\,f(y)\,dy,\qquad \Phi(x, t) = \frac{1}{\sqrt{4\pi kt}}\,e^{-x^2/(4kt)}.$$

The **heat kernel** $\Phi$ is a normal distribution with mean 0 and variance $2kt$: it is the probability density of [Brownian motion](@stats/brownian-motion). Its width grows like $\sqrt t$, which is why diffusion is slow over long distances. It is positive everywhere for every $t > 0$, so heat equation signals travel at **infinite speed** (with exponentially tiny amplitude far away).`,
    },
    {
      kind: 'widget',
      title: 'A point of heat spreading',
      body: String.raw`The heat kernel $\Phi(x, \tau)$ with $k = 1$. Slide the time $\tau$: the area under the curve stays $1$ (total heat is conserved on the whole line), the peak drops like $1/\sqrt{\tau}$, and the width grows like $\sqrt{\tau}$.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['exp(-x^2/(4*s))/sqrt(4*PI*s)'],
          x: [-6, 6], y: [-0.1, 1.6],
          params: [{ name: 's', min: 0.03, max: 4, value: 0.1, label: 'time τ' }],
          labels: ['Φ(x, τ)'], xLabel: 'x', yLabel: 'u',
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`With $k = 1$, what is the standard deviation (width) of the heat kernel $\Phi(x, t)$ at $t = 2$?`,
      answer: 2,
      why: String.raw`The variance is $2kt = 2\cdot1\cdot2 = 4$, so the standard deviation is $\sqrt4 = 2$. Using $kt$ for the variance (a common slip) gives $\sqrt2 \approx 1.41$. Compare the exponent with the normal density $e^{-x^2/(2\sigma^2)}$: $2\sigma^2 = 4kt$.`,
    },
    {
      kind: 'match',
      prompt: 'Match each ingredient of a heat problem with its physical meaning.',
      pairs: [
        [String.raw`$u(0, t) = 0$ (Dirichlet)`, 'the end is held at a fixed temperature'],
        [String.raw`$u_x(0, t) = 0$ (Neumann)`, 'the end is insulated: no heat flows through it'],
        [String.raw`$u(x, 0) = f(x)$`, 'the starting temperature profile'],
        [String.raw`$k$`, 'how quickly the material conducts heat relative to how much it stores'],
      ],
      why: String.raw`Flux is $-Ku_x$, so $u_x = 0$ means zero flux (insulation). Dirichlet data fixes the value itself. $k = K/(\rho c)$ is conductivity divided by heat capacity per volume.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`In the heat equation, mode $n$ decays like $e^{-k(n\pi/L)^2t}$, so high-frequency modes decay ___. With insulated (Neumann) ends no heat escapes, and as $t \to \infty$ the temperature tends to the ___ of the initial profile. Running the equation backwards in time is ___.`,
      bank: ['fastest', 'slowest', 'average', 'maximum', 'ill-posed', 'well-posed'],
      answer: ['fastest', 'average', 'ill-posed'],
      why: String.raw`The rate grows with $n^2$. With Neumann ends the modes are cosines including the constant mode $n = 0$, which does not decay, and its coefficient is the average of $f$ (total heat is conserved). Backward evolution amplifies noise by $e^{+kn^2\pi^2t/L^2}$.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $u_t = ku_{xx}$: each point relaxes toward the average of its neighbours.
- Separation of variables gives modes $\sin(n\pi x/L)\,e^{-k(n\pi/L)^2t}$; Fourier sine coefficients of $f$ glue them together.
- High modes die first, so solutions are smooth for $t > 0$; backwards in time is ill-posed; the maximum principle forbids new hot spots.
- On $\mathbb{R}$: $u = \Phi * f$ with the Gaussian heat kernel of variance $2kt$, the Brownian-motion density. Signals spread infinitely fast but only diffusively ($\sim\sqrt t$).

Next: the opposite character, the [wave equation](@math/pde-wave-equation), and the steady state $u_t = 0$, [Laplace's equation](@math/laplace-equation).`,
    },
  ],
  references: [
    { authors: 'W. A. Strauss', title: 'Partial Differential Equations: An Introduction', year: 2008, venue: '2nd ed., Wiley', detail: '§2.3–2.4 (diffusion, maximum principle, whole line), §4.1 (separation of variables)' },
    { authors: 'L. C. Evans', title: 'Partial Differential Equations', year: 2010, venue: '2nd ed., AMS Graduate Studies in Mathematics 19', detail: '§2.3 (heat equation)' },
    { authors: 'R. Haberman', title: 'Applied Partial Differential Equations with Fourier Series and Boundary Value Problems', year: 2013, venue: '5th ed., Pearson', detail: 'Ch. 1–2' },
    { authors: 'E. M. Stein, R. Shakarchi', title: 'Fourier Analysis: An Introduction', year: 2003, venue: 'Princeton University Press', detail: 'Ch. 1, 4, 5 (heat equation on the circle and on ℝ)' },
    { authors: 'J. Fourier', title: 'Théorie analytique de la chaleur', year: 1822, venue: 'Firmin Didot, Paris' },
  ],
} satisfies LessonContent;
