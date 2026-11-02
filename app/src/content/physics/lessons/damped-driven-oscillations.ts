import type { LessonContent } from '../../types';

const r = String.raw;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Pushing a swing',
      body: r`Push a child on a swing at random moments and not much happens. Push **once per swing, in time with its motion**, and small pushes build a huge swing.

Two effects are missing from ideal simple harmonic motion:
- **Damping** — friction and air resistance drain energy, so real oscillations die away.
- **Driving** — an outside periodic force feeds energy in.

Their competition leads to **resonance**: a dramatic response when you drive at the system's natural frequency. Resonance tunes radios, makes MRI scanners work, and must be designed out of bridges and buildings.`,
    },
    {
      kind: 'explain',
      title: 'Damping',
      body: r`Many resistive forces are roughly proportional to velocity: $F_\text{damp} = -b v$, where $b$ (kg/s) is the damping coefficient. Newton's law becomes
$$m\ddot x = -kx - b\dot x$$
(a dot means rate of change in time: $\dot x = v$, $\ddot x = a$). For light damping the solution is a cosine inside a shrinking envelope:
$$x(t) = A e^{-\gamma t}\cos(\omega_d t + \phi),\qquad \gamma = \frac{b}{2m},\quad \omega_d = \sqrt{\omega_0^2 - \gamma^2}$$
Here $\omega_0 = \sqrt{k/m}$ is the undamped **natural frequency**. The amplitude decays exponentially, and the oscillation is slightly slower than without damping.`,
    },
    {
      kind: 'widget',
      title: 'Turn up the damping',
      body: r`Start with small $b$: the oscillation decays slowly and the total energy bar E steadily shrinks (the energy becomes heat). Increase $b$ beyond about $2\sqrt{km}$ ≈ 6.3 kg/s and the block no longer oscillates at all — it just creeps back.`,
      widget: { type: 'SpringMass', props: { k: 10, m: 1, b: 0.4, controls: ['b', 'k', 'm'] } },
    },
    {
      kind: 'widget',
      title: 'Three regimes',
      body: r`Released from $x = 1$ at rest, with $\omega_0 = 2$ rad/s:
- **Underdamped** ($\gamma < \omega_0$, green): oscillates with decaying amplitude.
- **Critically damped** ($\gamma = \omega_0$, blue): returns to zero **fastest without overshooting**.
- **Overdamped** ($\gamma > \omega_0$, orange): no oscillation, but sluggish return.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['exp(-0.3*x)*(cos(1.9774*x) + 0.1517*sin(1.9774*x))', '(1 + 2*x)*exp(-2*x)', '1.0774*exp(-0.536*x) - 0.0774*exp(-7.464*x)'],
          x: [0, 10], y: [-1, 1.1],
          labels: ['underdamped γ = 0.3', 'critical γ = 2', 'overdamped γ = 4'],
          xLabel: 't (s)', yLabel: 'x',
        },
      },
    },
    {
      kind: 'match',
      prompt: r`Match each damping regime to its behaviour ($\gamma = b/2m$, $\omega_0 = \sqrt{k/m}$).`,
      pairs: [
        [r`Underdamped, $\gamma < \omega_0$`, 'Oscillates with exponentially shrinking amplitude'],
        [r`Critically damped, $\gamma = \omega_0$`, 'Fastest return to equilibrium without overshoot'],
        [r`Overdamped, $\gamma > \omega_0$`, 'Slow, non-oscillating creep back to equilibrium'],
        [r`Undamped, $\gamma = 0$`, 'Oscillates forever with constant amplitude'],
      ],
      why: r`Compare the decay rate $\gamma$ to the natural frequency $\omega_0$. If damping wins ($\gamma > \omega_0$), $\omega_d = \sqrt{\omega_0^2 - \gamma^2}$ would be imaginary — there is no oscillation.`,
    },
    {
      kind: 'mcq',
      prompt: 'A car\'s shock absorbers should make the car settle quickly after a bump without bouncing. Engineers aim for damping that is…',
      choices: ['zero', 'so weak it barely affects the motion', 'moderate — somewhat below critical', 'very heavily overdamped'],
      answer: 2,
      why: 'Critical damping kills the bounce in the shortest time, and production cars sit somewhat below it (damping ratio roughly 0.2–0.4) to trade a small overshoot for comfort. Very weak damping keeps bouncing (worn shocks); heavily overdamped is harsh and slow to recover.',
    },
    {
      kind: 'explain',
      title: 'Quality factor Q',
      body: r`How "ringy" an oscillator is gets summarised by one number, the **quality factor**
$$Q = \frac{\omega_0}{2\gamma} = \frac{m\,\omega_0}{b}$$
Roughly, an oscillator rings for about $Q/\pi$ cycles before its amplitude falls to $1/e \approx 37\%$. A guitar string has $Q$ in the thousands; a car suspension about 1–2 (critical damping is $Q = 1/2$); a quartz watch crystal around $10^4$–$10^5$ or more — which is why it keeps time so well.`,
    },
    {
      kind: 'numeric',
      prompt: 'A 1.0 kg mass on a spring with k = 16 N/m has damping b = 0.50 kg/s. What is its quality factor Q?',
      answer: 8,
      tolerance: 0.05,
      why: r`$\omega_0 = \sqrt{16/1} = 4$ rad/s, so $Q = m\omega_0/b = 1 \times 4/0.5 = 8$. It rings for roughly $8/\pi \approx 2.5$ cycles before the amplitude drops to 37%.`,
    },
    {
      kind: 'explain',
      title: 'Driving and resonance',
      body: r`Now add a periodic force $F_0\cos(\omega t)$ at **driving frequency** $\omega$. After the start-up wobbles (transients) die away, the system oscillates at the **driver's** frequency $\omega$ — not its own — with amplitude
$$A(\omega) = \frac{F_0/m}{\sqrt{(\omega_0^2 - \omega^2)^2 + (2\gamma\omega)^2}}$$
When $\omega$ is close to $\omega_0$ the first term in the root vanishes and the amplitude peaks: **resonance**. With little damping the peak is tall (height ∝ $Q$) and narrow (width ≈ $\omega_0/Q$).`,
    },
    {
      kind: 'widget',
      title: 'The resonance curve',
      body: r`Steady-state amplitude (relative to the static stretch $F_0/k$) against driving frequency $\omega/\omega_0$. Raise $Q$: the peak at $\omega \approx \omega_0$ gets taller and sharper. Far below resonance the mass simply follows the force; far above, it barely moves.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['1/sqrt((1 - x^2)^2 + (x/Q)^2)'],
          x: [0, 3], y: [0, 10],
          params: [{ name: 'Q', min: 0.5, max: 12, value: 4, label: 'quality factor Q' }],
          xLabel: 'ω / ω₀', yLabel: 'amplitude ÷ (F₀/k)',
        },
      },
    },
    {
      kind: 'widget',
      title: 'Drive it yourself',
      body: r`Here $\omega_0 = \sqrt{10/1} \approx 3.16$ rad/s and the block starts at rest. Set the drive frequency $\omega_d$ to 1, then slowly raise it towards 3.2 and beyond. Near resonance the amplitude grows over many cycles until damping losses balance the energy fed in. Then reduce $b$ and watch the peak response grow.`,
      widget: { type: 'SpringMass', props: { k: 10, m: 1, b: 0.3, F0: 1.5, wd: 1, x0: 0, controls: ['wd', 'b', 'F0'] } },
    },
    {
      kind: 'truefalse',
      prompt: 'The 1940 collapse of the Tacoma Narrows Bridge is best explained as simple resonance: wind gusts happened to push at the bridge\'s natural frequency.',
      answer: false,
      why: 'A steady wind has no matching frequency. The bridge failed by **aeroelastic flutter**: its twisting motion changed the airflow so that the wind fed energy into that very motion (a self-excited oscillation, like negative damping). It is often mis-taught as forced resonance.',
    },
    {
      kind: 'mcq',
      prompt: 'An oscillator is driven at a frequency far **above** its natural frequency. Its steady motion is…',
      choices: ['large and in step with the force', 'small and roughly opposite in phase to the force', 'large and opposite in phase', 'at its own natural frequency'],
      answer: 1,
      why: r`For $\omega \gg \omega_0$ the mass's inertia dominates: $A \approx F_0/(m\omega^2)$ is small, and the displacement lags the force by nearly 180°. At resonance the lag is exactly 90°; well below resonance the mass moves in step with the force.`,
    },
    {
      kind: 'numeric',
      prompt: 'A 0.25 kg mass sits on a spring with k = 100 N/m. At what driving frequency f (in hertz, cycles per second) will it resonate (light damping)?',
      answer: 3.18,
      tolerance: 0.02,
      unit: 'Hz',
      why: r`$\omega_0 = \sqrt{100/0.25} = 20$ rad/s, and $f = \omega_0/2\pi = 20/6.283 \approx 3.18$ Hz. Answering 20 confuses angular frequency (rad/s) with ordinary frequency (Hz).`,
    },
    {
      kind: 'multi',
      prompt: 'Which technologies deliberately exploit resonance?',
      choices: ['Tuning a radio to one station', 'A quartz crystal keeping time in a watch', 'MRI scanners (nuclear magnetic resonance)', 'A car\'s brakes bringing it to a stop'],
      answers: [0, 1, 2],
      why: 'A radio\'s tuned circuit responds strongly only near its resonant frequency; a quartz crystal vibrates at a sharp mechanical resonance; MRI drives nuclear spins at their resonant (Larmor) frequency. Brakes just convert kinetic energy to heat by friction.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: r`- Damping $-b\dot x$ makes oscillations decay as $e^{-\gamma t}$ with $\gamma = b/2m$. Regimes: under-, critically and over-damped.
- $Q = \omega_0/2\gamma$ measures how many cycles an oscillator rings.
- A driven oscillator settles at the **driving** frequency; its amplitude peaks near $\omega_0$ (resonance), with height ∝ $Q$ and width ≈ $\omega_0/Q$.
- The same mathematics describes RLC circuits — see [AC circuits](@physics/ac-circuits).`,
    },
  ],
  references: [
    { authors: 'Ling, S. J., Sanny, J., Moebs, W. et al.', title: 'University Physics, Volume 1', year: 2016, venue: 'OpenStax', detail: 'Ch. 15.5–15.6 (Damped and Forced Oscillations)', url: 'https://openstax.org/details/books/university-physics-volume-1' },
    { authors: 'Taylor, J. R.', title: 'Classical Mechanics', year: 2005, venue: 'University Science Books', detail: 'Ch. 5.4–5.6 (damped and driven oscillations, resonance)' },
    { authors: 'Feynman, R. P., Leighton, R. B., Sands, M.', title: 'The Feynman Lectures on Physics, Vol. I', year: 1963, venue: 'Addison-Wesley; free online edition', detail: 'Ch. 23–24 (Resonance, Transients)', url: 'https://www.feynmanlectures.caltech.edu/I_23.html' },
    { authors: 'Billah, K. Y., Scanlan, R. H.', title: 'Resonance, Tacoma Narrows bridge failure, and undergraduate physics textbooks', year: 1991, venue: 'American Journal of Physics 59, 118–124' },
  ],
} satisfies LessonContent;
