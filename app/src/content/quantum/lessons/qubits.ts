import type { LessonContent } from '../../types';
import { MERMIN, NC, QISKIT_TEXTBOOK } from '../refs';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'From bits to qubits',
      body: String.raw`A classical **bit** is like a light switch: it is either 0 or 1.

A **qubit** (quantum bit) is the simplest quantum system — for example the spin of an electron or two energy levels of an atom. Measuring it always gives 0 or 1, but *before* measurement it can be in a **superposition**: a state that carries an amplitude for 0 *and* an amplitude for 1.

Careful with the popular phrase "both 0 and 1 at once". A better picture: a qubit's state is like an **arrow** that can point in any direction; 0 and 1 are just two special directions.`,
    },
    {
      kind: 'recall',
      title: 'Complex numbers you will need',
      points: [
        String.raw`A complex number is $z = a + bi$ with $i^2 = -1$; picture it as an arrow in the plane.`,
        String.raw`Its size squared is $|z|^2 = a^2 + b^2$ (always real and $\ge 0$).`,
        String.raw`Polar form: $z = r e^{i\varphi}$ with length $r$ and angle (phase) $\varphi$; $|e^{i\varphi}| = 1$.`,
        String.raw`Multiplying complex numbers multiplies lengths and **adds angles**.`,
      ],
      link: 'math/complex-numbers',
    },
    {
      kind: 'explain',
      title: 'Writing a qubit state',
      body: String.raw`We name the two special states $|0\rangle$ and $|1\rangle$ (read "ket zero", "ket one"). As column vectors:
$$|0\rangle = \begin{pmatrix}1\\0\end{pmatrix},\quad |1\rangle = \begin{pmatrix}0\\1\end{pmatrix}.$$
A general qubit state is
$$|\psi\rangle = \alpha|0\rangle + \beta|1\rangle = \begin{pmatrix}\alpha\\ \beta\end{pmatrix},$$
where $\alpha, \beta$ are complex **amplitudes**. They must satisfy the **normalization** condition $|\alpha|^2 + |\beta|^2 = 1$, because (next lessons) $|\alpha|^2$ and $|\beta|^2$ are the probabilities of reading 0 and 1.`,
    },
    {
      kind: 'widget',
      title: 'Amplitudes become odds',
      body: String.raw`Here $\alpha = \cos(\theta/2)$ and $\beta = \sin(\theta/2)$. Each press prepares a fresh qubit and measures it. Every result is a plain 0 or 1 — never "0.3" — but the *frequencies* follow $|\alpha|^2$ and $|\beta|^2$ (dashed lines).`,
      widget: { type: 'MeasurementSampler', props: { theta: 70 } },
    },
    {
      kind: 'multi',
      prompt: 'Which of these are valid (normalized) qubit states?',
      choices: [
        String.raw`$0.6|0\rangle + 0.8|1\rangle$`,
        String.raw`$0.5|0\rangle + 0.5|1\rangle$`,
        String.raw`$|0\rangle + |1\rangle$`,
        String.raw`$\tfrac{1}{\sqrt2}|0\rangle - \tfrac{i}{\sqrt2}|1\rangle$`,
      ],
      answers: [0, 3],
      why: String.raw`Check $|\alpha|^2 + |\beta|^2$: $0.36 + 0.64 = 1$ ✓; $0.25 + 0.25 = 0.5$ ✗; $1 + 1 = 2$ ✗; $\tfrac12 + |{-i}|^2\tfrac12 = 1$ ✓. A common slip is to add the amplitudes themselves instead of their squared sizes.`,
    },
    {
      kind: 'explain',
      title: 'Worked example: normalizing',
      body: String.raw`Suppose a calculation gives the unnormalized vector $|0\rangle + 2i|1\rangle$.

1. Total "length squared": $|1|^2 + |2i|^2 = 1 + 4 = 5$.
2. Divide every amplitude by $\sqrt5$:
$$|\psi\rangle = \tfrac{1}{\sqrt5}|0\rangle + \tfrac{2i}{\sqrt5}|1\rangle.$$
3. Check: $\tfrac15 + \tfrac45 = 1$ ✓. So $P(0) = 0.2$ and $P(1) = 0.8$.

Note $|2i|^2 = 4$, not $-4$: the size of a complex number ignores its direction (phase).`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Normalize $3|0\rangle + 4i|1\rangle$. What is $|\beta|^2$, the probability of reading 1?`,
      answer: 0.64, tolerance: 0.005,
      why: String.raw`Length squared $= 9 + 16 = 25$, so divide by 5: $\beta = 4i/5$ and $|\beta|^2 = 16/25 = 0.64$. The factor $i$ does not change the size.`,
    },
    {
      kind: 'explain',
      title: 'Global vs relative phase',
      body: String.raw`Multiplying the *whole* state by a phase $e^{i\gamma}$ changes nothing you can ever measure: $e^{i\gamma}|\psi\rangle$ is the same physical state. This is a **global phase**.

But the phase *between* the two amplitudes — the **relative phase** — is physical. Compare
$$|+\rangle = \tfrac{1}{\sqrt2}(|0\rangle + |1\rangle),\qquad |-\rangle = \tfrac{1}{\sqrt2}(|0\rangle - |1\rangle).$$
Both give 0 or 1 with 50% each, yet they are different states (a Hadamard gate turns one into $|0\rangle$ and the other into $|1\rangle$).

So any qubit state can be written with two real angles:
$$|\psi\rangle = \cos\tfrac{\theta}{2}|0\rangle + e^{i\varphi}\sin\tfrac{\theta}{2}|1\rangle.$$`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`$|\psi\rangle$ and $-|\psi\rangle$ describe physically different qubit states.`,
      answer: false,
      why: String.raw`$-1 = e^{i\pi}$ is a global phase: every probability $|\text{amplitude}|^2$ is unchanged under any measurement. Only the *relative* phase between amplitudes is observable.`,
    },
    {
      kind: 'widget',
      title: 'See the relative phase',
      body: String.raw`A one-qubit simulator. Bars show probabilities; the small dial under each bar is the **phase** of that amplitude. Tap **H** then **q0** to make $|+\rangle$. Then add **Z** on q0: the bars stay 50/50 but the dial under $|1\rangle$ flips — that is $|-\rangle$.`,
      widget: { type: 'QuantumCircuitSim', props: { qubits: 1, palette: ['H', 'X', 'Z', 'S'] } },
    },
    {
      kind: 'explain',
      title: 'How much does a qubit hold?',
      body: String.raw`A qubit has a continuum of possible states, yet one measurement yields just **one bit**. (Holevo's theorem makes this precise: you can never extract more than one classical bit per qubit.)

The real power shows up with many qubits. $n$ qubits need $2^n$ complex amplitudes to describe. For 50 qubits that is $2^{50} \approx 1.1\times10^{15}$ numbers — about 18 petabytes at 16 bytes each.

Electrons in a molecule have the same exponential appetite, which is why exact chemistry is so expensive on classical computers — and why Feynman proposed simulating nature with quantum hardware.`,
    },
    {
      kind: 'numeric',
      prompt: 'How many complex amplitudes are needed to write down a general state of 10 qubits?',
      answer: 1024,
      why: String.raw`Each qubit doubles the number of basis states: $2^{10} = 1024$. Adding qubits adds bits to the label, but doubles the amplitude count.`,
    },
    {
      kind: 'fill',
      prompt: 'Amplitudes must satisfy the ___ condition. Multiplying the whole state by a phase changes only the ___ phase, which is unobservable.',
      bank: ['normalization', 'unitarity', 'global', 'relative', 'orthogonality'],
      answer: ['normalization', 'global'],
      why: String.raw`Normalization ($|\alpha|^2 + |\beta|^2 = 1$) makes the probabilities sum to one. An overall phase is global and invisible; the relative phase between $\alpha$ and $\beta$ is what matters.`,
    },
    {
      kind: 'match',
      prompt: 'Match each state to its column vector.',
      pairs: [
        [String.raw`$|0\rangle$`, String.raw`$(1, 0)^T$`],
        [String.raw`$|1\rangle$`, String.raw`$(0, 1)^T$`],
        [String.raw`$|+\rangle$`, String.raw`$\tfrac{1}{\sqrt2}(1, 1)^T$`],
        [String.raw`$|-\rangle$`, String.raw`$\tfrac{1}{\sqrt2}(1, -1)^T$`],
      ],
      why: String.raw`The top entry is the amplitude of $|0\rangle$ and the bottom the amplitude of $|1\rangle$. $|\pm\rangle$ have equal sizes and differ only in the relative sign.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A qubit state is $\alpha|0\rangle + \beta|1\rangle$ with complex amplitudes and $|\alpha|^2 + |\beta|^2 = 1$.
- Measurement gives only 0 or 1, with probabilities $|\alpha|^2, |\beta|^2$.
- Global phase is invisible; **relative phase** is physical ($|+\rangle \ne |-\rangle$).
- $n$ qubits need $2^n$ amplitudes — the source of both the difficulty of simulating chemistry and the promise of quantum computers.`,
    },
  ],
  references: [
    { ...NC, detail: 'Sec. 1.2 (quantum bits)' },
    { ...QISKIT_TEXTBOOK, detail: 'Ch. 1 "Quantum States and Qubits"' },
    { ...MERMIN, detail: 'Ch. 1' },
  ],
} satisfies LessonContent;
