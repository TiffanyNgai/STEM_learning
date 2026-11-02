import type { LessonContent } from '../../types';

const r = String.raw;

// First three standing-wave modes of a string fixed at both ends, animated (SMIL path morph).
const modes = (() => {
  const L0 = 40, L1 = 290, amp = 16;
  const path = (n: number, y0: number, s: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const x = L0 + ((L1 - L0) * i) / 60;
      pts.push(`${i ? 'L' : 'M'}${x.toFixed(1)},${(y0 - s * amp * Math.sin((n * Math.PI * i) / 60)).toFixed(1)}`);
    }
    return pts.join('');
  };
  let body = '';
  [1, 2, 3].forEach((n, j) => {
    const y0 = 40 + j * 60;
    const up = path(n, y0, 1), down = path(n, y0, -1);
    body += `<line x1="${L0}" x2="${L1}" y1="${y0}" y2="${y0}" stroke="var(--grid)"/>
    <path d="${up}" fill="none" stroke="var(--c${j + 1})" stroke-width="2.2">
      <animate attributeName="d" values="${up};${down};${up}" dur="${(1.6 / n).toFixed(3)}s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.37 0 0.63 1;0.37 0 0.63 1"/>
    </path>
    <path d="${up}" fill="none" stroke="var(--c${j + 1})" stroke-width="0.6" opacity="0.4"/><path d="${down}" fill="none" stroke="var(--c${j + 1})" stroke-width="0.6" opacity="0.4"/>
    <text x="8" y="${y0 + 4}" fill="var(--fg)">n=${n}</text>
    <text x="312" y="${y0 - 8}" text-anchor="end" fill="var(--muted)">${n === 1 ? 'λ = 2L' : n === 2 ? 'λ = L' : 'λ = 2L/3'}</text>
    <text x="312" y="${y0 + 14}" text-anchor="end" fill="var(--muted)">f = ${n}f₁</text>`;
    for (let m = 0; m <= n; m++) body += `<circle cx="${(L0 + ((L1 - L0) * m) / n).toFixed(1)}" cy="${y0}" r="2.6" fill="var(--fg)"/>`;
  });
  return `<svg viewBox="0 0 320 200" width="100%" xmlns="http://www.w3.org/2000/svg" font-size="10">
  <rect x="${L0 - 4}" y="14" width="4" height="176" fill="var(--grid)"/><rect x="${L1}" y="14" width="4" height="176" fill="var(--grid)"/>
  ${body}
</svg>`;
})();

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Silence from sound',
      body: r`Noise-cancelling headphones listen to the noise around you and play a second sound wave that is its mirror image — a crest wherever the noise has a trough. The two add up to (nearly) nothing.

This works because of the **principle of superposition**: when two waves overlap, the total displacement at each point is simply the **sum** of the individual displacements:
$$y_\text{total}(x,t) = y_1(x,t) + y_2(x,t)$$
Afterwards each wave carries on as if the other had never been there. (This holds whenever the medium responds linearly — true for most waves of modest amplitude.)`,
    },
    {
      kind: 'widget',
      title: 'Constructive and destructive interference',
      body: r`Two waves of equal wavelength moving the **same way**. Slide the phase difference $\phi$:
- $\phi = 0$: crests line up → **constructive** interference, amplitude doubles.
- $\phi = \pi \approx 3.14$: crest meets trough → **destructive** interference, they cancel.

Also try unequal amplitudes: cancellation is then only partial.`,
      widget: { type: 'WaveSuperposition', props: { dir2: 1, controls: ['phase', 'a2'] } },
    },
    {
      kind: 'mcq',
      prompt: 'Two waves of equal amplitude and wavelength overlap, but one is shifted by half a wavelength relative to the other. The result is…',
      choices: ['a wave of double amplitude', 'complete cancellation', 'a wave of half the wavelength', 'a standing wave'],
      answer: 1,
      why: r`A shift of $\lambda/2$ is a phase difference of $\pi$: every crest of one sits on a trough of the other, so the sum is zero everywhere. Their energy hasn't vanished — in 2D or 3D it is redirected to places where the interference is constructive.`,
    },
    {
      kind: 'explain',
      title: 'Path difference',
      body: r`Two speakers driven by the same signal send waves to you along paths of different lengths. The extra distance — the **path difference** $\Delta$ — sets the relative phase $\phi = 2\pi\Delta/\lambda$:
- **Constructive** when $\Delta = 0, \lambda, 2\lambda, \dots$ (whole wavelengths)
- **Destructive** when $\Delta = \tfrac12\lambda, \tfrac32\lambda, \dots$ (half-odd wavelengths)

Walk across a room in front of two speakers playing a pure tone and you hear loud and quiet spots. The same idea, with light, is Young's double-slit experiment — see [interference](@physics/interference).`,
    },
    {
      kind: 'numeric',
      prompt: 'Two in-phase speakers emit a 686 Hz tone; the speed of sound is 343 m/s. What is the smallest non-zero path difference that gives destructive interference?',
      answer: 0.25,
      tolerance: 0.005,
      unit: 'm',
      why: r`$\lambda = v/f = 343/686 = 0.50$ m. Destructive interference first occurs at $\Delta = \lambda/2 = 0.25$ m. Answering 0.50 m gives a whole wavelength — that's constructive.`,
    },
    {
      kind: 'widget',
      title: 'Beats',
      body: r`Add two tones of slightly different frequencies $f_1$ and $f_2$. They drift in and out of step, so the loudness swells and fades at the **beat frequency**
$$f_\text{beat} = |f_1 - f_2|$$
Here the sum $\cos(2\pi f_1 t) + \cos(2\pi f_2 t)$ is plotted over 2 s with $f_1 = 10$ Hz. Move $f_2$ closer to 10 and the beats slow down; at exactly 10 they disappear. Musicians tune by listening for beats to vanish.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['cos(2*PI*10*x) + cos(2*PI*f2*x)'],
          x: [0, 2], y: [-2.3, 2.3],
          params: [{ name: 'f2', min: 8, max: 12, value: 11, label: 'f₂ (Hz)' }],
          xLabel: 't (s)', yLabel: 'sum',
        },
      },
    },
    {
      kind: 'numeric',
      prompt: 'A tuning fork at 440 Hz and a slightly flat guitar string at 436 Hz sound together. How many beats per second do you hear?',
      answer: 4,
      tolerance: 0.01,
      unit: 'Hz',
      why: r`$f_\text{beat} = |440 - 436| = 4$ Hz: the sound gets loud four times a second. Tightening the string raises its frequency and slows the beats until they vanish at 440 Hz.`,
    },
    {
      kind: 'explain',
      title: 'Standing waves',
      body: r`Now send two identical waves in **opposite** directions (for example, a wave and its reflection). Using a trig identity, their sum is
$$A\sin(kx - \omega t) + A\sin(kx + \omega t) = 2A\sin(kx)\cos(\omega t)$$
The $x$- and $t$-dependence have **separated**: every point oscillates in place with amplitude $2A\sin(kx)$. Nothing appears to travel — a **standing wave**.
- **Nodes**: points that never move, where $\sin(kx) = 0$, spaced $\lambda/2$ apart.
- **Antinodes**: points of maximum swing, halfway between nodes.`,
    },
    {
      kind: 'widget',
      title: 'Two waves → standing wave',
      body: r`Top: wave going right. Middle: identical wave going left. Bottom: their sum, with nodes circled. Make the amplitudes or wavelengths unequal and the perfect nodes disappear — the sum starts to travel again.`,
      widget: { type: 'WaveSuperposition', props: { dir2: -1, controls: ['a2', 'lambda2'] } },
    },
    {
      kind: 'widget',
      title: 'Modes of a guitar string',
      body: r`A string clamped at both ends must have **nodes at both ends**. Only standing waves that fit a whole number of half-wavelengths into the length $L$ survive:
$$L = n\frac{\lambda_n}{2}\quad\Longrightarrow\quad f_n = \frac{n\,v}{2L},\qquad n = 1, 2, 3, \dots$$
$n = 1$ is the **fundamental**; the others are **harmonics**, at whole-number multiples of $f_1$. A plucked string vibrates in a mix of these modes, and the mix gives each instrument its *timbre*.`,
      widget: { type: 'SvgDiagram', props: { svg: modes } },
    },
    {
      kind: 'numeric',
      prompt: 'A guitar string is 0.65 m long and waves travel along it at 286 m/s. What is its fundamental frequency?',
      answer: 220,
      tolerance: 0.5,
      unit: 'Hz',
      why: r`$f_1 = \frac{v}{2L} = \frac{286}{2 \times 0.65} = \frac{286}{1.3} = 220$ Hz (the note A3). Forgetting the factor of 2 gives 440 Hz — the fundamental's wavelength is **twice** the string length.`,
    },
    {
      kind: 'truefalse',
      prompt: 'In an ideal standing wave, the points at the nodes never move at all.',
      answer: true,
      why: r`At a node $\sin(kx) = 0$, so the displacement $2A\sin(kx)\cos(\omega t)$ is zero at every time. Touch a vibrating string lightly at its midpoint and you force a node there, killing the odd harmonics — the guitarist's "harmonic" technique.`,
    },
    {
      kind: 'order',
      prompt: r`For a string of length $L$ fixed at both ends, order these modes from **longest** to **shortest** wavelength.`,
      steps: [r`Fundamental: $\lambda = 2L$`, r`Second harmonic: $\lambda = L$`, r`Third harmonic: $\lambda = 2L/3$`, r`Fourth harmonic: $\lambda = L/2$`],
      why: r`$\lambda_n = 2L/n$: each higher mode squeezes in one more half-wavelength, so the wavelength shrinks and the frequency $f_n = n f_1$ rises.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these phenomena are explained by the superposition of waves?',
      choices: ['Noise-cancelling headphones', 'Beats between two nearly equal tones', 'The harmonics of a violin string', 'A single pulse travelling along an otherwise still rope', 'Rainbow colours in a soap film'],
      answers: [0, 1, 2, 4],
      why: 'Cancellation, beats, standing-wave modes and thin-film colours (light reflected from the front and back of the film interfering) all come from adding overlapping waves. A lone pulse involves only one wave — nothing to superpose.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: r`- **Superposition**: overlapping waves add; afterwards they pass through each other unchanged.
- Path difference $\Delta$: constructive at whole $\lambda$, destructive at half-odd $\lambda$.
- Beats: $f_\text{beat} = |f_1 - f_2|$.
- Opposite travelling waves make **standing waves** $2A\sin(kx)\cos(\omega t)$, with nodes every $\lambda/2$.
- A string fixed at both ends: $f_n = n v/2L$. (Pipes work similarly, with pressure nodes or antinodes at open/closed ends.)

Any shape can be built by superposing sine waves — that's [Fourier analysis](@physics/wave-equation).`,
    },
  ],
  references: [
    { authors: 'Ling, S. J., Sanny, J., Moebs, W. et al.', title: 'University Physics, Volume 1', year: 2016, venue: 'OpenStax', detail: 'Ch. 16.5–16.6 (Interference, Standing Waves), Ch. 17.4–17.6 (Normal Modes, Musical Sound, Beats)', url: 'https://openstax.org/details/books/university-physics-volume-1' },
    { authors: 'Halliday, D., Resnick, R., Walker, J.', title: 'Fundamentals of Physics', year: 2013, venue: '10th ed., Wiley', detail: 'Ch. 16.5–16.7, 17.6' },
    { authors: 'Feynman, R. P., Leighton, R. B., Sands, M.', title: 'The Feynman Lectures on Physics, Vol. I', year: 1963, venue: 'Addison-Wesley; free online edition', detail: 'Ch. 48–49 (Beats, Modes)', url: 'https://www.feynmanlectures.caltech.edu/I_49.html' },
  ],
} satisfies LessonContent;
