import type { LessonContent } from '../../types';

const r = String.raw;

const ease = 'calcMode="spline" keyTimes="0;0.5;1" keySplines="0.37 0 0.63 1;0.37 0 0.63 1"';
const circleProjection = `<svg viewBox="0 0 320 200" width="100%" xmlns="http://www.w3.org/2000/svg" font-size="10" fill="var(--fg)">
  <circle cx="160" cy="85" r="60" fill="none" stroke="var(--grid)" stroke-width="1.5"/>
  <line x1="80" x2="240" y1="85" y2="85" stroke="var(--grid)"/>
  <line x1="80" x2="240" y1="170" y2="170" stroke="var(--fg)"/>
  <line x1="160" x2="160" y1="164" y2="176" stroke="var(--fg)"/>
  <text x="160" y="190" text-anchor="middle" fill="var(--muted)">x = 0</text>
  <text x="100" y="190" text-anchor="middle" fill="var(--muted)">−A</text>
  <text x="220" y="190" text-anchor="middle" fill="var(--muted)">+A</text>
  <g>
    <animateTransform attributeName="transform" type="rotate" values="0 160 85;-360 160 85" dur="4s" repeatCount="indefinite"/>
    <line x1="160" y1="85" x2="220" y2="85" stroke="var(--c2)" stroke-width="1.5"/>
    <circle cx="220" cy="85" r="6" fill="var(--c2)"/>
  </g>
  <line x1="220" x2="220" y1="85" y2="170" stroke="var(--muted)" stroke-dasharray="3 3">
    <animate attributeName="x1" values="220;100;220" ${ease} dur="4s" repeatCount="indefinite"/>
    <animate attributeName="x2" values="220;100;220" ${ease} dur="4s" repeatCount="indefinite"/>
  </line>
  <rect x="210" y="160" width="20" height="20" rx="3" fill="var(--c1)">
    <animate attributeName="x" values="210;90;210" ${ease} dur="4s" repeatCount="indefinite"/>
  </rect>
  <text x="10" y="20" fill="var(--c2)">point on a circle, steady speed</text>
  <text x="10" y="34" fill="var(--c1)">its shadow on the line: SHM</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The universal wobble',
      body: r`A guitar string, a child on a swing, a quartz crystal in a watch, the atoms in a molecule, a skyscraper in the wind: all **oscillate** — move back and forth about a resting position.

There is a deep reason they all behave alike. Nudge *anything* slightly away from a stable equilibrium and the force pushing it back is, to a good approximation, **proportional to how far you moved it**. That single fact produces the same smooth, sinusoidal motion everywhere: **simple harmonic motion** (SHM).`,
    },
    {
      kind: 'explain',
      title: "Hooke's law",
      body: r`Stretch or compress a spring by a distance $x$ from its natural length, and it pulls back with force
$$F = -k x$$
- $k$ is the **spring constant** (units N/m): how stiff the spring is.
- The minus sign means the force points **opposite** to the displacement — back towards $x = 0$. This is a **restoring force**.

**Example:** a spring with $k = 200$ N/m stretched by 5.0 cm = 0.050 m pulls back with $200 \times 0.050 = 10$ N.`,
    },
    {
      kind: 'numeric',
      prompt: 'A spring with k = 50 N/m is compressed by 0.20 m. What is the magnitude of the force it exerts?',
      answer: 10,
      tolerance: 0.01,
      unit: 'N',
      why: r`$|F| = k|x| = 50 \times 0.20 = 10$ N, pushing outward (opposite to the compression). Remember to convert to metres if a length is given in cm.`,
    },
    {
      kind: 'widget',
      title: 'Mass on a spring',
      body: r`A block on a frictionless surface, pulled to $x = 1$ m and released. Watch the energy bars: **kinetic energy** KE ($\tfrac12 m v^2$, energy of motion) is largest at the centre; **potential energy** PE ($\tfrac12 k x^2$, stored in the spring) is largest at the ends. Their sum E stays constant.

Change $k$ and $m$: stiffer spring → faster; heavier mass → slower.`,
      widget: { type: 'SpringMass', props: { k: 10, m: 1, b: 0, controls: ['k', 'm'] } },
    },
    {
      kind: 'explain',
      title: 'Solving the motion',
      body: r`Newton's second law ($F = ma$) with Hooke's force gives
$$m a = -k x \quad\Longrightarrow\quad a = -\frac{k}{m}\,x$$
Acceleration is proportional to displacement and opposite to it — the defining property of SHM. The solution is a cosine wave in time:
$$x(t) = A\cos(\omega t + \phi),\qquad \omega = \sqrt{\frac{k}{m}}$$
- $A$ = **amplitude** (largest displacement)
- $\omega$ = **angular frequency** (rad/s)
- $\phi$ = **phase** (where in the cycle it starts)

The **period** (time per cycle) is $T = 2\pi/\omega = 2\pi\sqrt{m/k}$ and the **frequency** is $f = 1/T$ (cycles per second, hertz, Hz).`,
    },
    {
      kind: 'widget',
      title: 'Amplitude, frequency, phase',
      body: r`Green: position $x(t) = A\cos(\omega t + \phi)$. Blue: velocity $v(t) = -A\omega\sin(\omega t + \phi)$. Velocity is greatest where $x = 0$ and zero at the turning points. Raising $\omega$ squeezes the waves together and makes the velocity larger.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['A*cos(w*x + p)', '-A*w*sin(w*x + p)'],
          x: [0, 10], y: [-4, 4],
          params: [
            { name: 'A', min: 0.2, max: 2, value: 1, label: 'amplitude A (m)' },
            { name: 'w', min: 0.3, max: 3, value: 1.5, label: 'ω (rad/s)' },
            { name: 'p', min: 0, max: 6.28, value: 0, label: 'phase φ (rad)' },
          ],
          labels: ['x(t)', 'v(t)'],
          xLabel: 't (s)', yLabel: '',
        },
      },
    },
    {
      kind: 'mcq',
      prompt: 'You replace the mass on a spring with one four times heavier. The period of oscillation…',
      choices: ['quarters', 'halves', 'doubles', 'quadruples'],
      answer: 2,
      why: r`$T = 2\pi\sqrt{m/k}$, so $T \propto \sqrt{m}$. Four times the mass gives $\sqrt4 = 2$ times the period. The heavier mass responds more sluggishly to the same spring force.`,
    },
    {
      kind: 'numeric',
      prompt: 'A 0.50 kg mass hangs on a spring with k = 200 N/m. What is its period of oscillation?',
      answer: 0.314,
      tolerance: 0.005,
      unit: 's',
      why: r`$\omega = \sqrt{k/m} = \sqrt{200/0.5} = \sqrt{400} = 20$ rad/s, so $T = 2\pi/\omega = 2\pi/20 \approx 0.314$ s. (Gravity only shifts the equilibrium point of a vertical spring; it does not change the period.)`,
    },
    {
      kind: 'explain',
      title: 'Energy in SHM',
      body: r`With no friction, total mechanical energy is conserved:
$$E = \tfrac12 m v^2 + \tfrac12 k x^2 = \tfrac12 k A^2$$
At the turning points ($x = \pm A$) everything is potential energy; at the centre everything is kinetic, so the **maximum speed** is
$$v_\text{max} = A\sqrt{k/m} = A\omega$$
**Example:** amplitude 0.10 m and $\omega = 20$ rad/s give $v_\text{max} = 0.10 \times 20 = 2.0$ m/s.`,
    },
    {
      kind: 'widget',
      title: 'SHM is circular motion seen edge-on',
      body: r`A point going round a circle at steady speed has $x$-coordinate $A\cos(\omega t)$. Its shadow on a line therefore performs **exactly** simple harmonic motion. This is why $\omega$ is called an *angular* frequency: it is the angular speed of the circling point, in radians per second. One full trip round ($2\pi$ radians) is one period.`,
      widget: { type: 'SvgDiagram', props: { svg: circleProjection } },
    },
    {
      kind: 'explain',
      title: 'The pendulum',
      body: r`A mass on a string of length $L$ swinging through a small angle is pulled back by a component of gravity roughly proportional to its displacement — so it, too, undergoes SHM, with
$$T = 2\pi\sqrt{\frac{L}{g}}$$
The period doesn't depend on the mass or (for small swings) the amplitude. A 1 m pendulum has $T \approx 2.0$ s, which is why grandfather clocks are about that tall. For large swings (beyond ~20°) the period grows noticeably and the motion is no longer exactly SHM.`,
    },
    {
      kind: 'mcq',
      prompt: r`A pendulum clock is taken to the Moon, where $g$ is about 1/6 of Earth's. Its period becomes about…`,
      choices: ['6 times shorter', r`$\sqrt6 \approx 2.4$ times shorter`, r`$\sqrt6 \approx 2.4$ times longer`, '6 times longer'],
      answer: 2,
      why: r`$T \propto 1/\sqrt{g}$. Dividing $g$ by 6 multiplies $T$ by $\sqrt6 \approx 2.45$: weaker gravity means a weaker restoring force and slower swings. The clock would run slow.`,
    },
    {
      kind: 'match',
      prompt: 'Match each SHM quantity to its formula.',
      pairs: [
        [r`Angular frequency $\omega$`, r`$\sqrt{k/m}$`],
        [r`Period $T$`, r`$2\pi/\omega$`],
        [r`Frequency $f$`, r`$1/T$`],
        ['Total energy', r`$\tfrac12 k A^2$`],
        ['Maximum speed', r`$A\omega$`],
      ],
      why: r`Everything follows from $\omega = \sqrt{k/m}$ and $x = A\cos(\omega t + \phi)$. Note $\omega = 2\pi f$: angular frequency counts radians per second, frequency counts cycles per second.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Doubling the amplitude of a mass on an ideal spring doubles its period.',
      answer: false,
      why: r`The period $2\pi\sqrt{m/k}$ has no $A$ in it. A bigger swing has farther to go but feels proportionally bigger forces and moves faster — the effects cancel exactly. This amplitude-independence ("isochronism") is what makes oscillators good clocks.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these are (to a good approximation) simple harmonic motion?',
      choices: ['A mass bouncing on a light spring', 'A pendulum swinging through 5°', 'A ball bouncing on a hard floor', 'Atoms vibrating in a chemical bond (small amplitude)', 'A pendulum swinging through 90°'],
      answers: [0, 1, 3],
      why: 'SHM needs a restoring force proportional to displacement. A bouncing ball feels constant gravity plus a sudden impact — not proportional. A 90° pendulum is too far from equilibrium for the linear approximation; its period is noticeably longer.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: r`- A restoring force $F = -kx$ gives **simple harmonic motion**: $x(t) = A\cos(\omega t + \phi)$.
- $\omega = \sqrt{k/m}$, $T = 2\pi\sqrt{m/k}$; pendulum $T = 2\pi\sqrt{L/g}$. The period doesn't depend on amplitude.
- Energy sloshes between kinetic and potential; $E = \tfrac12 kA^2$, $v_\text{max} = A\omega$.
- SHM is the shadow of uniform circular motion.

Real oscillators lose energy and get pushed — see [damping and resonance](@physics/damped-driven-oscillations). The quantum version is the [quantum harmonic oscillator](@quantum/harmonic-oscillator-qm).`,
    },
  ],
  references: [
    { authors: 'Ling, S. J., Sanny, J., Moebs, W. et al.', title: 'University Physics, Volume 1', year: 2016, venue: 'OpenStax', detail: 'Ch. 15.1–15.4 (Oscillations)', url: 'https://openstax.org/details/books/university-physics-volume-1' },
    { authors: 'Feynman, R. P., Leighton, R. B., Sands, M.', title: 'The Feynman Lectures on Physics, Vol. I', year: 1963, venue: 'Addison-Wesley; free online edition', detail: 'Ch. 21 (The Harmonic Oscillator)', url: 'https://www.feynmanlectures.caltech.edu/I_21.html' },
    { authors: 'Taylor, J. R.', title: 'Classical Mechanics', year: 2005, venue: 'University Science Books', detail: 'Ch. 5.1–5.3' },
  ],
} satisfies LessonContent;
