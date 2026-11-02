import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The vibrating string',
      body: String.raw`Let $u(x, t)$ be the small sideways displacement of a stretched string with tension $T$ and mass per length $\rho$. Newton's second law on a tiny piece says mass × acceleration = net vertical pull of the tension, and the net pull is proportional to the **curvature** $u_{xx}$. The result is the **wave equation**

$$u_{tt} = c^2\,u_{xx},\qquad c = \sqrt{T/\rho}.$$

Compare with heat, $u_t = ku_{xx}$: the only change is a *second* time derivative, an acceleration instead of a velocity. That one change turns smoothing and decay into travelling and oscillation. The same equation (in more dimensions) describes sound, light and seismic waves.`,
    },
    {
      kind: 'recall',
      title: 'Travelling waves (physics)',
      points: [
        String.raw`A travelling wave carries a disturbance and energy, not matter: $y = f(x - vt)$ moves right at speed $v$.`,
        String.raw`For a sinusoid, $v = f\lambda$ (frequency × wavelength).`,
        String.raw`On a string the speed is $v = \sqrt{T/\mu}$ (tension over mass per length).`,
        'Waves pass through each other and add: superposition.',
      ],
      link: 'physics/waves-intro',
    },
    {
      kind: 'explain',
      title: 'd’Alembert’s solution (1747)',
      body: String.raw`Factor the operator like a difference of squares:
$$u_{tt} - c^2u_{xx} = \Big(\partial_t - c\,\partial_x\Big)\Big(\partial_t + c\,\partial_x\Big)u = 0.$$
Each factor is a [transport operator](@math/pde-intro-classification), and the general solution is
$$u(x, t) = F(x - ct) + G(x + ct):$$
one shape moving right and one moving left, both at speed $c$. Fitting the initial shape $u(x,0) = \varphi(x)$ and velocity $u_t(x,0) = \psi(x)$ gives **d'Alembert's formula**:
$$u(x, t) = \tfrac12\big[\varphi(x - ct) + \varphi(x + ct)\big] + \frac{1}{2c}\int_{x - ct}^{x + ct}\psi(s)\,ds.$$`,
    },
    {
      kind: 'widget',
      title: 'One bump becomes two',
      body: String.raw`A long string is released from rest ($\psi = 0$) with a bump $\varphi$. d'Alembert says $u = \tfrac12\varphi(x - ct) + \tfrac12\varphi(x + ct)$: the bump splits into two half-height copies (dashed) moving apart at speed $c$. The dotted orange lines are the furthest points the disturbance can have reached, at $\pm(a + ct)$. Try "pluck": the corners survive and travel. Nothing smooths them out.`,
      widget: { type: 'MathStringDalembert', props: { mode: 'line', shape: 'bump' } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`An infinite string at rest has a bump of height 2 centred at $x = 0$, and is released with zero velocity. Long afterwards, what do you see?`,
      choices: [
        'two bumps of height 1 moving apart at speed $c$',
        'one bump of height 2 moving right at speed $c$',
        'a single bump that spreads out and flattens in place',
        'two bumps of height 2 moving apart at speed $c$',
      ],
      answer: 0,
      why: String.raw`With $\psi = 0$, $u = \tfrac12[\varphi(x - ct) + \varphi(x + ct)]$: each copy carries half the height. A single right-moving bump would need a carefully chosen initial velocity ($\psi = -c\varphi'$). Spreading and flattening in place is how the *heat* equation behaves.`,
    },
    {
      kind: 'explain',
      title: 'Finite speed of propagation',
      body: String.raw`d'Alembert's formula shows that $u(x, t)$ depends only on the initial data in the interval $[x - ct,\ x + ct]$, the **domain of dependence**. In the $(x, t)$ plane this is a triangle bounded by the **characteristic lines** $x \pm ct = \text{const}$, a "light cone".

So if the initial disturbance is confined to $[-a, a]$, a listener at position $x > a$ hears nothing until time $t = (x - a)/c$. That is **causality**: information travels at most at speed $c$.

Contrast with heat, where the kernel is positive everywhere at every $t > 0$, so a disturbance is felt (faintly) everywhere instantly.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`For $u_{tt} = 9u_{xx}$, the initial data $\varphi, \psi$ vanish outside $[-1, 1]$. What is the earliest time at which $u(10, t)$ can be nonzero?`,
      answer: 3,
      why: String.raw`Here $c = \sqrt9 = 3$. The nearest disturbed point is $x = 1$, a distance $9$ from $x = 10$, so the earliest time is $9/3 = 3$. Using the distance from the centre ($10/3 \approx 3.33$) ignores the width of the disturbance, and using $c = 9$ forgets the square root.`,
    },
    {
      kind: 'explain',
      title: 'Fixed ends: reflections and standing waves',
      body: String.raw`For a string of length $L$ with $u(0, t) = u(L, t) = 0$, extend $\varphi$ as an **odd** function of period $2L$ and apply d'Alembert. A pulse that hits a fixed end comes back **upside down**, and after time $2L/c$ everything repeats.

Separating variables (as for heat) gives the modes instead:
$$u(x, t) = \sum_{n\ge1}\Big(A_n\cos\frac{n\pi ct}{L} + B_n\sin\frac{n\pi ct}{L}\Big)\sin\frac{n\pi x}{L}.$$
Each mode is a [standing wave](@physics/superposition-standing-waves) oscillating at frequency $f_n = \dfrac{nc}{2L}$. The $A_n$ come from the [Fourier sine series](@math/fourier-series) of $\varphi$ and the $B_n$ from that of $\psi$. Unlike heat, the time factors **oscillate** rather than decay. These frequencies $f_1, 2f_1, 3f_1, \dots$ are the musical harmonics.`,
    },
    {
      kind: 'widget',
      title: 'Reflection at fixed ends',
      body: String.raw`The same d'Alembert solution, now on $0 \le x \le L$ with clamped ends. Watch a half-pulse run into the wall and come back inverted. With "pluck" (a guitar-style triangle) the string's shape stays made of straight segments whose corners travel back and forth, a famous and exact consequence of d'Alembert's formula. The motion repeats with period $2L/c$.`,
      widget: { type: 'MathStringDalembert', props: { mode: 'fixed', shape: 'bump' } },
    },
    {
      kind: 'truefalse',
      prompt: 'Like the heat equation, the wave equation instantly smooths out a corner in the initial shape.',
      answer: false,
      why: String.raw`d'Alembert's formula just translates copies of $\varphi$, so a corner in $\varphi$ stays a corner and travels along a characteristic at speed $c$. Singularities *propagate* rather than disappear. Heat smooths because every mode decays; wave modes keep their amplitudes.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A guitar string has length $L = 0.65$ m and wave speed $c = 286$ m/s. What is its fundamental frequency $f_1 = c/(2L)$, in Hz?`,
      answer: 220,
      tolerance: 0.5,
      unit: 'Hz',
      why: String.raw`$f_1 = 286/(2\times0.65) = 286/1.3 = 220$ Hz (the note A3). The fundamental wavelength is $2L$ because the slowest mode $\sin(\pi x/L)$ fits half a wavelength between the fixed ends. Using $c/L$ gives 440 Hz, the second harmonic.`,
    },
    {
      kind: 'explain',
      title: 'Energy is conserved',
      body: String.raw`For the string (taking $\rho = 1$ for simplicity), define
$$E(t) = \frac12\int\big(u_t^2 + c^2u_x^2\big)\,dx,$$
the kinetic energy plus the stretching (potential) energy. Differentiating and integrating by parts with fixed ends gives $E'(t) = 0$. The heat equation instead has $\frac{d}{dt}\int u^2\,dx = -2k\int u_x^2\,dx \le 0$, a quantity that always decreases.

A neat consequence is **uniqueness**. If two solutions have the same data, their difference has $E = 0$ at $t = 0$, hence for all time, so it is constant, and therefore zero.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`A string of length $L$ is fixed at both ends and vibrates according to $u_{tt} = c^2u_{xx}$. Which statements are true?`,
      choices: [
        String.raw`The motion is periodic in time with period $2L/c$.`,
        String.raw`The allowed frequencies are $nc/(2L)$, $n = 1, 2, 3, \dots$`,
        'Each mode’s amplitude decays exponentially in time.',
        'The total energy (kinetic + potential) stays constant.',
        'Doubling the tension doubles every frequency.',
      ],
      answers: [0, 1, 3],
      why: String.raw`Every mode has period $2L/(nc)$, which divides $2L/c$, so the whole motion is $2L/c$-periodic. Energy is conserved, so nothing decays (that is the heat equation). Frequencies scale like $c = \sqrt{T/\rho}$, so doubling $T$ multiplies them by $\sqrt2 \approx 1.41$, not by 2.`,
    },
    {
      kind: 'match',
      prompt: 'Match each equation with its signature behaviour.',
      pairs: [
        [String.raw`Wave $u_{tt} = c^2u_{xx}$`, 'finite speed, conserved energy, corners persist'],
        [String.raw`Heat $u_t = ku_{xx}$`, 'infinite speed, smoothing, decay toward equilibrium'],
        [String.raw`Transport $u_t + cu_x = 0$`, 'one shape sliding one way unchanged'],
        [String.raw`Laplace $u_{xx} + u_{yy} = 0$`, 'no time at all: a steady state set by the boundary'],
      ],
      why: String.raw`The hyperbolic wave equation is two transport equations in opposite directions, so it inherits the finite speed and lossless travel. Parabolic heat smooths and decays. Elliptic Laplace has no time variable; it describes the end state of heat flow.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`d'Alembert: for a string released from rest, $u(x,t) = $ ___ $\big[\varphi(x - ct) + \varphi(x + ct)\big]$. The value $u(x, t)$ depends only on initial data in the interval ___. At a fixed end a pulse reflects ___.`,
      bank: [String.raw`$\tfrac12$`, String.raw`$2$`, String.raw`$[x - ct,\ x + ct]$`, String.raw`$[0,\ x]$`, 'upside down', 'unchanged'],
      answer: [String.raw`$\tfrac12$`, String.raw`$[x - ct,\ x + ct]$`, 'upside down'],
      why: String.raw`At $t = 0$ the bracket is $2\varphi(x)$, so the factor $\tfrac12$ is needed to recover $\varphi$. Characteristics through $(x, t)$ hit $t = 0$ at $x \pm ct$. The odd reflection that keeps $u = 0$ at the wall flips the pulse.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $u_{tt} = c^2u_{xx}$ with $c = \sqrt{T/\rho}$: acceleration ∝ curvature.
- d'Alembert: $u = F(x - ct) + G(x + ct)$; from data, $u = \tfrac12[\varphi(x-ct) + \varphi(x+ct)] + \frac{1}{2c}\int_{x-ct}^{x+ct}\psi$.
- **Finite speed**: $u(x,t)$ sees only $[x - ct, x + ct]$. Corners persist and travel.
- Fixed ends: inverted reflections, period $2L/c$, standing-wave modes at $f_n = nc/(2L)$ with Fourier-series amplitudes.
- Energy $\frac12\int(u_t^2 + c^2u_x^2)$ is conserved, which gives uniqueness.

Physics picks this up in [the wave equation & Fourier analysis](@physics/wave-equation).`,
    },
  ],
  references: [
    { authors: 'W. A. Strauss', title: 'Partial Differential Equations: An Introduction', year: 2008, venue: '2nd ed., Wiley', detail: '§2.1–2.2 (d’Alembert, causality and energy), §4.1' },
    { authors: 'L. C. Evans', title: 'Partial Differential Equations', year: 2010, venue: '2nd ed., AMS Graduate Studies in Mathematics 19', detail: '§2.4 (wave equation)' },
    { authors: 'E. M. Stein, R. Shakarchi', title: 'Fourier Analysis: An Introduction', year: 2003, venue: 'Princeton University Press', detail: 'Ch. 1 (the vibrating string)' },
    { authors: 'R. Haberman', title: 'Applied Partial Differential Equations with Fourier Series and Boundary Value Problems', year: 2013, venue: '5th ed., Pearson', detail: 'Ch. 4 (vibrating strings and membranes)' },
  ],
} satisfies LessonContent;
