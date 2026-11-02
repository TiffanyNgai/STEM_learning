import type { LessonContent } from '../../types';
import { MERMIN, NC, QISKIT_TEXTBOOK } from '../refs';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Reading a circuit diagram',
      body: String.raw`A **quantum circuit** is a score for qubits, read left to right:

- each horizontal **wire** is one qubit (q0 on top), starting in $|0\rangle$;
- **boxes** on a wire are single-qubit gates, applied in time order;
- a vertical line joining wires is a **multi-qubit gate**;
- a meter symbol at the end means **measure**, producing classical bits.

Running the circuit many times ("shots") gives a histogram of bit strings. Two numbers describe a circuit's size: **width** (number of qubits) and **depth** (number of time steps).`,
    },
    {
      kind: 'explain',
      title: 'Two qubits, four amplitudes',
      body: String.raw`Two qubits have four basis states, written $|00\rangle, |01\rangle, |10\rangle, |11\rangle$ (in this course q0 is the **left** digit). A general state has four amplitudes:
$$|\psi\rangle = a|00\rangle + b|01\rangle + c|10\rangle + d|11\rangle,\quad |a|^2 + |b|^2 + |c|^2 + |d|^2 = 1.$$
If the qubits are prepared separately, the joint state is the **tensor product** $\otimes$ — multiply out like algebra:
$$(\alpha_0|0\rangle + \alpha_1|1\rangle)\otimes(\beta_0|0\rangle + \beta_1|1\rangle) = \alpha_0\beta_0|00\rangle + \alpha_0\beta_1|01\rangle + \alpha_1\beta_0|10\rangle + \alpha_1\beta_1|11\rangle.$$
$n$ qubits: $2^n$ basis states.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`What is the amplitude of $|10\rangle$ in $|+\rangle\otimes|0\rangle$? (Give a decimal.)`,
      answer: 0.7071, tolerance: 0.005,
      why: String.raw`$|+\rangle\otimes|0\rangle = \tfrac{1}{\sqrt2}(|0\rangle + |1\rangle)\otimes|0\rangle = \tfrac{1}{\sqrt2}|00\rangle + \tfrac{1}{\sqrt2}|10\rangle$. The $|10\rangle$ amplitude is $1/\sqrt2 \approx 0.707$; its probability would be 0.5.`,
    },
    {
      kind: 'explain',
      title: 'One-qubit gates inside a bigger circuit',
      body: String.raw`A gate on one wire acts only on that qubit's digit, leaving the other alone. Mathematically, H on q0 of a two-qubit register is $H\otimes I$.

Worked example: start in $|00\rangle$ and apply H to q0:
$$|00\rangle \to \tfrac{1}{\sqrt2}(|00\rangle + |10\rangle).$$
Now apply H to q1 as well: every basis state appears with amplitude $\tfrac12$. In general, an H on each of $n$ qubits makes an **equal superposition of all $2^n$ bit strings** — the opening move of many algorithms.`,
    },
    {
      kind: 'widget',
      title: 'Uniform superposition',
      body: 'Step through H on q0 and H on q1 with ▶: after the first H two strings share the probability, after the second all four sit at 1/4. The phase dials all point the same way.',
      widget: { type: 'QuantumCircuitSim', props: { qubits: 2, circuit: ['H0', 'H1'], stepMode: true } },
    },
    {
      kind: 'explain',
      title: 'The CNOT gate',
      body: String.raw`The **controlled-NOT** (CNOT, or CX) has a **control** qubit (dot) and a **target** (⊕). If the control is 1 it flips the target; otherwise it does nothing. With control q0 and target q1:
$$|00\rangle\to|00\rangle,\quad |01\rangle\to|01\rangle,\quad |10\rangle\to|11\rangle,\quad |11\rangle\to|10\rangle.$$
Compactly: $|a, b\rangle \to |a, a\oplus b\rangle$, where $\oplus$ is XOR (addition mod 2). It is a $4\times4$ unitary that permutes basis states.

Because gates are linear, CNOT acting on a superposition acts on every branch at once — this is how qubits get correlated.`,
    },
    {
      kind: 'match',
      prompt: 'CNOT with control q0 and target q1. Match inputs to outputs.',
      pairs: [
        [String.raw`$|00\rangle$`, String.raw`$|00\rangle$`],
        [String.raw`$|01\rangle$`, String.raw`$|01\rangle$`],
        [String.raw`$|10\rangle$`, String.raw`$|11\rangle$`],
        [String.raw`$|11\rangle$`, String.raw`$|10\rangle$`],
      ],
      why: 'Only when the control (left digit) is 1 does the target (right digit) flip. A common slip is to flip whenever the target is 1.',
    },
    {
      kind: 'widget',
      title: 'Build your own',
      body: String.raw`Pick a gate, then the qubit (for CX choose control→target). Try X on q0 then CX q0→q1: you get $|11\rangle$. Then try H on q0 followed by CX q0→q1 and press **Sample** — only 00 and 11 ever appear. That is our next lesson.`,
      widget: { type: 'QuantumCircuitSim', props: { qubits: 2, palette: ['H', 'X', 'Z', 'CX', 'CZ', 'SWAP'] } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Start in $|00\rangle$. Apply X to q1, then CNOT with control q0, target q1. What is the final state?`,
      choices: [String.raw`$|00\rangle$`, String.raw`$|01\rangle$`, String.raw`$|10\rangle$`, String.raw`$|11\rangle$`],
      answer: 1,
      why: String.raw`X on q1 gives $|01\rangle$. The control q0 is 0, so CNOT does nothing: $|01\rangle$. Flipping it to $|00\rangle$ would require the control to be 1.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Measuring all qubits at the end of an n-qubit circuit returns exactly n classical bits per shot.',
      answer: true,
      why: String.raw`Each qubit's measurement gives one bit, so each shot yields an $n$-bit string. The $2^n$ amplitudes are only revealed statistically, through the histogram over many shots.`,
    },
    {
      kind: 'explain',
      title: 'A note on software conventions',
      body: String.raw`Different tools write bit strings in different orders. This course (and most textbooks, e.g. Nielsen & Chuang) puts q0 on the **left**. **Qiskit** puts q0 on the **right**: its string "01" means q0 = 1, q1 = 0. Many bugs in research code come from this.

Also, matrices compose right-to-left: the circuit "A then B" is the matrix product $BA$.`,
    },
    {
      kind: 'fill',
      prompt: 'A circuit on 3 qubits has ___ basis states. The CNOT gate flips the ___ when the ___ is 1.',
      bank: ['8', '6', '9', 'target', 'control'],
      answer: ['8', 'target', 'control'],
      why: String.raw`$2^3 = 8$ (not $2\times3$). CNOT's control decides; the target is the qubit that gets flipped.`,
    },
    {
      kind: 'order',
      prompt: 'Trace the circuit H(q0), CNOT(q0→q1), measure, starting from |00⟩.',
      steps: [
        String.raw`Start in $|00\rangle$`,
        String.raw`H on q0: $\tfrac{1}{\sqrt2}(|00\rangle + |10\rangle)$`,
        String.raw`CNOT flips q1 in the $|10\rangle$ branch: $\tfrac{1}{\sqrt2}(|00\rangle + |11\rangle)$`,
        'Measure: 00 or 11, each with probability ½ — never 01 or 10',
      ],
      why: 'CNOT acts branch by branch: the |00⟩ branch is untouched and the |10⟩ branch becomes |11⟩. The two qubits now always agree — a Bell state.',
    },
    {
      kind: 'multi',
      prompt: 'Which statements are true?',
      choices: [
        String.raw`$|0\rangle\otimes|1\rangle = |01\rangle$`,
        'A two-qubit gate is a 4×4 unitary matrix',
        String.raw`$H\otimes H$ applied to $|00\rangle$ makes all four outcomes equally likely`,
        'CNOT is not unitary because it depends on the control',
      ],
      answers: [0, 1, 2],
      why: 'CNOT is a permutation of the four basis states, and every permutation matrix is unitary. The other three statements follow directly from the tensor-product rules.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Circuits: wires = qubits (start $|0\rangle$), boxes = gates in time order, meters = measurement.
- $n$ qubits → $2^n$ amplitudes; separate qubits combine by the **tensor product**.
- H on every qubit gives a uniform superposition over all bit strings.
- **CNOT**: $|a,b\rangle \to |a, a\oplus b\rangle$; on superpositions it correlates qubits.
- Watch bit-ordering conventions (Qiskit reverses them).`,
    },
  ],
  references: [
    { ...NC, detail: 'Sec. 1.3.2–1.3.4, Sec. 4.3 (controlled operations)' },
    { ...QISKIT_TEXTBOOK, detail: 'Ch. 2 "Multiple Qubits and Entanglement"' },
    { ...MERMIN, detail: 'Ch. 1.4–1.7' },
  ],
} satisfies LessonContent;
