import type { LessonContent } from '../../types';
import { GRIFFITHS, NC, QISKIT_TEXTBOOK } from '../refs';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'You can’t peek at amplitudes',
      body: String.raw`A qubit's amplitudes $\alpha, \beta$ are never directly visible. The only thing you can do is **measure**, and a standard measurement (in the **computational basis** $\{|0\rangle, |1\rangle\}$) returns a single classical bit: 0 or 1.

Analogy: a weighted coin you may toss only once. One toss tells you almost nothing about the weighting; many coins prepared the same way reveal it.`,
    },
    {
      kind: 'explain',
      title: 'The Born rule and collapse',
      body: String.raw`For $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$, measuring gives
$$P(0) = |\alpha|^2,\qquad P(1) = |\beta|^2.$$
This is the **Born rule**. Right after the measurement the state *is* the outcome: if you read 1, the qubit is now $|1\rangle$. This jump is called **collapse** (a projective measurement). Measure again immediately and you get 1 again, with certainty.

Worked example: $|\psi\rangle = \tfrac{1}{\sqrt3}|0\rangle + \sqrt{\tfrac{2}{3}}\,|1\rangle$ gives 0 with probability $\tfrac13$ and 1 with probability $\tfrac23$.`,
    },
    {
      kind: 'widget',
      title: 'Many copies, one histogram',
      body: String.raw`The state is $\cos(\theta/2)|0\rangle + \sin(\theta/2)|1\rangle$. Measure ×1 a few times: results look random. Then ×100 and ×1000: frequencies settle onto the Born probabilities (dashed). Change $\theta$ to reshape the odds.`,
      widget: { type: 'MeasurementSampler', props: { theta: 60, seed: 21 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`$|\psi\rangle = \tfrac12|0\rangle + \tfrac{\sqrt3}{2}\,i\,|1\rangle$. What is the probability of measuring 1?`,
      answer: 0.75, tolerance: 0.005,
      why: String.raw`$P(1) = |\tfrac{\sqrt3}{2} i|^2 = \tfrac34 \cdot |i|^2 = 0.75$. The factor $i$ is a phase and does not change the size.`,
    },
    {
      kind: 'truefalse',
      prompt: 'If you measure a qubit once and get 0, the qubit must have been in state |0⟩ before the measurement.',
      answer: false,
      why: String.raw`Any state with $\alpha \ne 0$ can give 0. After the measurement the state is $|0\rangle$, but beforehand it could have been, e.g., $|+\rangle$. One shot cannot reveal the prior state.`,
    },
    {
      kind: 'widget',
      title: 'Collapse on the Bloch sphere',
      body: String.raw`The arrow starts on the equator ($|+\rangle$). Press **Measure**: it jumps to a pole. Press Measure again — it stays put. Reset to start over, or use H to move it back onto the equator before measuring.`,
      widget: { type: 'BlochSphere', props: { theta: 90, phi: 0, measure: true, gates: ['H', 'X'] } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`You measure $\tfrac{1}{\sqrt2}(|0\rangle + |1\rangle)$ and get 1. You measure the same qubit again immediately. What is the probability of getting 1 again?`,
      choices: ['0', '0.5', '1', 'It depends on the relative phase'],
      answer: 2,
      why: String.raw`The first measurement collapsed the state to $|1\rangle$, so the second gives 1 with certainty. 0.5 would be right only for a *fresh* copy of the original state.`,
    },
    {
      kind: 'explain',
      title: 'Estimating probabilities from shots',
      body: String.raw`On real hardware you run a circuit $N$ times ("shots") and count. If the true probability is $p$ and you observe $k$ ones, your estimate $\hat p = k/N$ has a standard error
$$\sigma = \sqrt{\frac{p(1-p)}{N}}$$
(this is ordinary binomial statistics — see [random variables](@stats/random-variables)). Halving the error needs **four times** as many shots. This $1/\sqrt N$ cost is a central bottleneck for near-term chemistry algorithms like VQE.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`True $p = 0.5$ and you take $N = 10{,}000$ shots. What is the standard error of $\hat p$?`,
      answer: 0.005, tolerance: 0.0005,
      why: String.raw`$\sigma = \sqrt{0.5 \times 0.5 / 10000} = \sqrt{0.000025} = 0.005$. So you would quote roughly $0.50 \pm 0.005$.`,
    },
    {
      kind: 'explain',
      title: 'Averages: the expectation value',
      body: String.raw`Assign the value $+1$ to outcome 0 and $-1$ to outcome 1. The average over many shots is the **expectation value** of $Z$:
$$\langle Z\rangle = (+1)P(0) + (-1)P(1) = |\alpha|^2 - |\beta|^2.$$
On the Bloch sphere this is exactly the height $r_z$. On a quantum computer, molecular energies are estimated the same way: as averages of many ±1 measurement results.

To measure along another axis (say $x$), first rotate that axis onto $z$ with a gate (H swaps $x$ and $z$), then measure as usual.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A state has $\theta = 60^\circ$ on the Bloch sphere. What is $\langle Z\rangle$?`,
      answer: 0.5, tolerance: 0.005,
      why: String.raw`$P(0) = \cos^2 30^\circ = 0.75$, $P(1) = 0.25$, so $\langle Z\rangle = 0.75 - 0.25 = 0.5 = \cos 60^\circ = r_z$.`,
    },
    {
      kind: 'order',
      prompt: 'Put the steps of a probability-estimation experiment in order.',
      steps: [
        'Prepare a fresh qubit in the state of interest',
        'Measure it in the computational basis',
        'Record the classical bit (0 or 1)',
        'Repeat the prepare–measure cycle N times',
        'Divide the number of 1s by N to estimate P(1)',
      ],
      why: 'Because measurement collapses the state, each shot needs a freshly prepared copy. The fraction of 1s converges to the Born probability with error shrinking like 1/√N.',
    },
    {
      kind: 'fill',
      prompt: 'The probability of an outcome is the squared ___ of its amplitude. After measuring, the state ___.',
      bank: ['magnitude', 'phase', 'real part', 'collapses to the observed basis state', 'is unchanged'],
      answer: ['magnitude', 'collapses to the observed basis state'],
      why: String.raw`Born rule: $P = |\text{amplitude}|^2$ (squared magnitude, not real part). A projective measurement leaves the system in the basis state corresponding to the result.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about measurement are true?',
      choices: [
        'It is irreversible: the pre-measurement state cannot be recovered from one result',
        String.raw`A single shot cannot reveal $\alpha$ and $\beta$`,
        'It can return values between 0 and 1, such as 0.3',
        'Measuring in the computational basis erases the relative phase information',
      ],
      answers: [0, 1, 3],
      why: 'A measurement outputs one of the basis labels (0 or 1), never a fraction. It collapses the state, so the amplitudes — including their relative phase — are lost; recovering them needs many fresh copies and several bases (tomography).',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Born rule**: $P(0) = |\alpha|^2$, $P(1) = |\beta|^2$.
- Measurement **collapses** the state to the observed outcome; repeat measurements agree.
- Probabilities are estimated from $N$ shots with error $\sim 1/\sqrt N$.
- $\langle Z\rangle = P(0) - P(1)$; measure other axes by rotating first.`,
    },
  ],
  references: [
    { ...NC, detail: 'Sec. 1.2, Sec. 2.2.3 (quantum measurement), Sec. 2.2.5 (projective measurements)' },
    { ...GRIFFITHS, detail: 'Sec. 1.2–1.3 (statistical interpretation), Sec. 3.4' },
    { ...QISKIT_TEXTBOOK, detail: 'Ch. 1.4 "The Rules of Measurement"' },
  ],
} satisfies LessonContent;
