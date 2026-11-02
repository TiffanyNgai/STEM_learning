import type { LessonContent } from '../../types';

const r = String.raw;

// Transverse (top) vs longitudinal (bottom) waves: each dot oscillates in place with a phase lag that grows to the right.
const twoKinds = (() => {
  const N = 22; const dur = 2; const lag = 0.09;
  let dots = '';
  for (let i = 0; i < N; i++) {
    const x = 20 + i * 13.3;
    const begin = `-${((N - i) * lag).toFixed(2)}s`;
    const hl = i === 8;
    const fillT = hl ? 'var(--c5)' : 'var(--c2)';
    const fillL = hl ? 'var(--c5)' : 'var(--c3)';
    dots += `<circle cx="${x.toFixed(1)}" cy="60" r="${hl ? 4.5 : 3.5}" fill="${fillT}"><animate attributeName="cy" values="60;42;60;78;60" dur="${dur}s" begin="${begin}" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"/></circle>`;
    dots += `<circle cx="${x.toFixed(1)}" cy="150" r="${hl ? 4.5 : 3.5}" fill="${fillL}"><animate attributeName="cx" values="${x.toFixed(1)};${(x + 7).toFixed(1)};${x.toFixed(1)};${(x - 7).toFixed(1)};${x.toFixed(1)}" dur="${dur}s" begin="${begin}" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"/></circle>`;
  }
  return `<svg viewBox="0 0 320 190" width="100%" xmlns="http://www.w3.org/2000/svg" font-size="10" fill="var(--fg)">
  <text x="10" y="16">Transverse: particles move ⟂ to the wave</text>
  <text x="10" y="112">Longitudinal: particles move ∥ to the wave</text>
  <line x1="10" x2="310" y1="60" y2="60" stroke="var(--grid)"/>
  <line x1="10" x2="310" y1="150" y2="150" stroke="var(--grid)"/>
  ${dots}
  <text x="310" y="100" text-anchor="end" fill="var(--muted)">wave travels →</text>
  <text x="310" y="184" text-anchor="end" fill="var(--muted)">red dot: one particle, staying put</text>
</svg>`;
})();

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The stadium wave',
      body: r`In a stadium "Mexican wave", each spectator just stands up and sits down — nobody runs around the stadium — yet a bump races around the stands.

That is the essence of a **wave**: a **disturbance** that travels through a medium while each piece of the medium only moves a little about its own resting place. Waves carry **energy and information** from one place to another *without carrying the matter along*. Sound, ripples on a pond, earthquake tremors, light and radio are all waves.`,
    },
    {
      kind: 'widget',
      title: 'A travelling sine wave',
      body: r`A snapshot of a rope with a wave moving right. Each point of the rope only moves up and down, in simple harmonic motion; the **pattern** moves sideways. Change the wavelength $\lambda$ and the frequency $f$ and see how the speed of the crests changes.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['A*sin(2*PI*(x/L - f*t))'],
          x: [0, 12], y: [-2, 2], animate: true,
          params: [
            { name: 'A', min: 0.2, max: 1.5, value: 1, label: 'amplitude A (m)' },
            { name: 'L', min: 1, max: 8, value: 4, label: 'wavelength λ (m)' },
            { name: 'f', min: 0.1, max: 1, value: 0.25, label: 'frequency f (Hz)' },
          ],
          xLabel: 'x (m)', yLabel: 'y (m)',
        },
        caption: r`Crests move at speed $v = f\lambda$: e.g. 0.25 Hz × 4 m = 1 m/s.`,
      },
    },
    {
      kind: 'widget',
      title: 'Transverse and longitudinal',
      body: r`- **Transverse** waves: the medium moves **perpendicular** to the direction of travel (waves on a string, light).
- **Longitudinal** waves: the medium moves **back and forth along** the direction of travel, making compressions and stretches (sound in air, a pushed Slinky).

Follow the red dot in each row: it never travels with the wave.`,
      widget: { type: 'SvgDiagram', props: { svg: twoKinds } },
    },
    {
      kind: 'mcq',
      prompt: 'Sound travelling through air is…',
      choices: ['a transverse wave', 'a longitudinal wave', 'not a wave, but a stream of moving air', 'an electromagnetic wave'],
      answer: 1,
      why: 'Air molecules jiggle back and forth along the direction the sound travels, creating regions of higher and lower pressure. Air can\'t support the sideways shear needed for transverse waves. There is no net flow of air — a loudspeaker doesn\'t create a wind.',
    },
    {
      kind: 'explain',
      title: 'Wave vocabulary',
      body: r`For a repeating (periodic) wave:
- **Wavelength** $\lambda$ (lambda): distance between neighbouring crests (m).
- **Period** $T$: time for one full oscillation at a fixed point (s).
- **Frequency** $f = 1/T$: oscillations per second (Hz).
- **Amplitude** $A$: maximum displacement from rest.

In one period, the wave advances one wavelength, so its speed is
$$v = \frac{\lambda}{T} = f\lambda$$
**Example:** a 10 Hz water wave with $\lambda = 0.3$ m moves at $10 \times 0.3 = 3$ m/s.`,
    },
    {
      kind: 'numeric',
      prompt: 'Sound travels at about 343 m/s in room-temperature air. What is the wavelength of the note A4 (440 Hz)?',
      answer: 0.78,
      tolerance: 0.01,
      unit: 'm',
      why: r`$\lambda = v/f = 343/440 \approx 0.78$ m. Audible sound (about 20 Hz–20 kHz) spans wavelengths from ~17 m down to ~1.7 cm — similar to everyday objects, which is why sound bends around doorways.`,
    },
    {
      kind: 'explain',
      title: 'The mathematical form',
      body: r`A sine wave travelling in the $+x$ direction is
$$y(x,t) = A\sin(kx - \omega t)$$
with **wave number** $k = 2\pi/\lambda$ (radians per metre) and **angular frequency** $\omega = 2\pi f$. The speed is $v = \omega/k$ — the same as $f\lambda$.

More generally *any* shape $y = F(x - vt)$ is that shape sliding right at speed $v$ (and $F(x + vt)$ slides left). Why? Increase $t$ by 1 s and $x$ must increase by $v$ metres to give the same value of $x - vt$.`,
    },
    {
      kind: 'widget',
      title: 'Any shape can travel',
      body: r`A Gaussian pulse $y = e^{-(x - vt)^2}$ moving right, wrapping round when it leaves the screen. Change $v$. The shape doesn't change — only its position. (Real media can also spread pulses out, an effect called *dispersion*.)`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['exp(-((x - ((v*t) % 16) + 2)^2))'],
          x: [0, 12], y: [-0.3, 1.3], animate: true,
          params: [{ name: 'v', min: 0.5, max: 4, value: 2, label: 'speed v (m/s)' }],
          xLabel: 'x (m)', yLabel: 'y',
        },
      },
    },
    {
      kind: 'truefalse',
      prompt: 'When a transverse wave travels along a rope, small pieces of the rope are carried along with the wave to the far end.',
      answer: false,
      why: 'Each piece of rope oscillates up and down about its own position. What travels is the pattern — and energy. If the rope moved along with the wave, it would pile up at the end.',
    },
    {
      kind: 'explain',
      title: 'What sets the speed?',
      body: r`The wave speed is fixed by the **medium**, not by the source. On a stretched string with tension $F_T$ (N) and mass per unit length $\mu$ (kg/m):
$$v = \sqrt{\frac{F_T}{\mu}}$$
Tighter → faster; heavier → slower (the restoring force fights the inertia, just as in $\omega = \sqrt{k/m}$).

The **frequency** is set by the source. So when a wave crosses into a new medium, its frequency stays the same while its speed — and hence its wavelength $\lambda = v/f$ — changes.`,
    },
    {
      kind: 'numeric',
      prompt: 'A string with mass per unit length 0.010 kg/m is under 100 N of tension. How fast do waves travel on it?',
      answer: 100,
      tolerance: 0.1,
      unit: 'm/s',
      why: r`$v = \sqrt{F_T/\mu} = \sqrt{100/0.010} = \sqrt{10\,000} = 100$ m/s.`,
    },
    {
      kind: 'mcq',
      prompt: 'You tighten a guitar string to 4 times its original tension. The wave speed on it…',
      choices: ['stays the same', 'doubles', 'quadruples', 'halves'],
      answer: 1,
      why: r`$v \propto \sqrt{F_T}$, so 4× tension gives $\sqrt4 = 2$× speed. This is how tuning pegs raise a string's pitch.`,
    },
    {
      kind: 'match',
      prompt: 'Match each symbol to its meaning.',
      pairs: [
        [r`$\lambda$`, 'Wavelength: distance between crests'],
        [r`$f$`, 'Frequency: oscillations per second'],
        [r`$k$`, r`Wave number $2\pi/\lambda$`],
        [r`$\omega$`, r`Angular frequency $2\pi f$`],
        [r`$A$`, 'Amplitude: maximum displacement'],
      ],
      why: r`$\lambda$ and $k$ describe the wave in **space**; $T$, $f$ and $\omega$ describe it in **time**. The speed links them: $v = f\lambda = \omega/k$.`,
    },
    {
      kind: 'fill',
      prompt: 'When light passes from air into water, it keeps the same ___ but its ___ and wavelength decrease.',
      bank: ['frequency', 'speed', 'colour charge', 'mass'],
      answer: ['frequency', 'speed'],
      why: 'The frequency is set by the source: every crest arriving at the boundary must leave it, so crests per second can\'t change. Light is slower in water, so with the same frequency its wavelength λ = v/f is shorter.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: r`- A wave is a travelling disturbance carrying energy, not matter.
- Transverse (⟂) vs longitudinal (∥) motion of the medium.
- $v = f\lambda$; $y = A\sin(kx - \omega t)$ with $k = 2\pi/\lambda$, $\omega = 2\pi f$; any $F(x - vt)$ moves right at speed $v$.
- The medium sets the speed (string: $v = \sqrt{F_T/\mu}$); the source sets the frequency.
- The energy a wave carries grows with the **square** of its amplitude.

Next: what happens when two waves meet — [superposition](@physics/superposition-standing-waves). Light is an [electromagnetic wave](@physics/electromagnetic-waves).`,
    },
  ],
  references: [
    { authors: 'Ling, S. J., Sanny, J., Moebs, W. et al.', title: 'University Physics, Volume 1', year: 2016, venue: 'OpenStax', detail: 'Ch. 16.1–16.4 (Waves)', url: 'https://openstax.org/details/books/university-physics-volume-1' },
    { authors: 'Halliday, D., Resnick, R., Walker, J.', title: 'Fundamentals of Physics', year: 2013, venue: '10th ed., Wiley', detail: 'Ch. 16' },
    { authors: 'French, A. P.', title: 'Vibrations and Waves', year: 1971, venue: 'MIT Introductory Physics Series, Norton', detail: 'Ch. 7' },
  ],
} satisfies LessonContent;
