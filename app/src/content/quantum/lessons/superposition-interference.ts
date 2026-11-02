import type { LessonContent } from '../../types';
import { FEYNMAN3, NC, QISKIT_TEXTBOOK } from '../refs';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Superposition is not ignorance',
      body: String.raw`Compare two qubits:

- **A**: the state $|+\rangle = \tfrac{1}{\sqrt2}(|0\rangle + |1\rangle)$.
- **B**: a coin was flipped secretly; the qubit is $|0\rangle$ or $|1\rangle$, 50/50. This is a classical **mixture**.

Measured directly, both give 0 or 1 half the time. Are they the same? No — and one gate tells them apart. Apply a Hadamard gate H, then measure: A gives 0 **every time**, while B stays 50/50. Superposition is a definite quantum state, not missing knowledge.`,
    },
    {
      kind: 'explain',
      title: 'The Hadamard gate',
      body: String.raw`The **Hadamard** gate H acts as
$$H|0\rangle = |+\rangle = \tfrac{1}{\sqrt2}(|0\rangle + |1\rangle),\qquad H|1\rangle = |-\rangle = \tfrac{1}{\sqrt2}(|0\rangle - |1\rangle).$$
As a matrix, $H = \tfrac{1}{\sqrt2}\begin{pmatrix}1 & 1\\ 1 & -1\end{pmatrix}$. Gates are **linear**: they act on each part of a superposition separately and the results add.

Applying H twice gives back the start: $HH = I$. The next card shows why — and it is pure interference.`,
    },
    {
      kind: 'widget',
      title: 'Why H|+⟩ = |0⟩',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Start: $H|+\rangle = H\,\tfrac{1}{\sqrt2}(|0\rangle + |1\rangle)$`,
            String.raw`Linearity: $= \tfrac{1}{\sqrt2}\left(H|0\rangle + H|1\rangle\right)$`,
            String.raw`Substitute: $= \tfrac{1}{\sqrt2}\cdot\tfrac{1}{\sqrt2}\left[(|0\rangle + |1\rangle) + (|0\rangle - |1\rangle)\right]$`,
            String.raw`Collect: $= \tfrac12\left[(1+1)|0\rangle + (1-1)|1\rangle\right] = |0\rangle$`,
          ],
          notes: [
            'A qubit in an equal superposition goes through H.',
            'H acts on each branch independently.',
            String.raw`Both branches contribute to $|0\rangle$ and to $|1\rangle$.`,
            String.raw`$|0\rangle$ amplitudes add (**constructive**); $|1\rangle$ amplitudes cancel (**destructive**).`,
          ],
        },
      },
    },
    {
      kind: 'widget',
      title: 'Watch the cancellation',
      body: String.raw`Step through H, H with ▶. After the first H both bars are ½. After the second, the $|1\rangle$ bar disappears: its two contributions had opposite phases. Press "Sample" to confirm only 0 appears.`,
      widget: { type: 'QuantumCircuitSim', props: { qubits: 1, circuit: ['H0', 'H0'], stepMode: true, palette: ['H', 'X', 'Z', 'S'] } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`What is $HZH|0\rangle$?`,
      choices: [String.raw`$|0\rangle$`, String.raw`$|1\rangle$`, String.raw`$|+\rangle$`, String.raw`$|-\rangle$`],
      answer: 1,
      why: String.raw`$H|0\rangle = |+\rangle$; $Z$ flips the sign of the $|1\rangle$ amplitude giving $|-\rangle$; $H|-\rangle = |1\rangle$ because now the $|0\rangle$ contributions cancel and the $|1\rangle$ ones add. (In fact $HZH = X$.)`,
    },
    {
      kind: 'explain',
      title: 'An interferometer on one qubit',
      body: String.raw`An optical **Mach–Zehnder interferometer** splits a photon into two paths and recombines them. In qubit language: H (split), a phase shift $\varphi$ on one path, H (recombine), then detect.

The result is
$$P(0) = \cos^2\tfrac{\varphi}{2},\qquad P(1) = \sin^2\tfrac{\varphi}{2}.$$
By tuning a *phase you can't see directly*, you steer the probability from 0 to 1. This is the template of every quantum algorithm: encode the answer in phases, then interfere so wrong answers cancel.`,
    },
    {
      kind: 'widget',
      title: 'Fringes from a phase',
      body: String.raw`Detection probabilities versus the phase $\varphi$ (radians) between the two H gates.`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['cos(x/2)^2', 'sin(x/2)^2'], x: [0, 6.283], y: [0, 1.1], labels: ['P(0)', 'P(1)'], xLabel: 'φ (rad)', yLabel: 'P' },
        caption: String.raw`At $\varphi = 0$ the paths interfere constructively into 0; at $\varphi = \pi$ (a Z gate) everything goes to 1.`,
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`In the interferometer, the phase is $\varphi = 120^\circ$. What is $P(0)$?`,
      answer: 0.25, tolerance: 0.005,
      why: String.raw`$P(0) = \cos^2(60^\circ) = 0.25$. Remember the half-angle: using $\cos^2 120^\circ$ also happens to give 0.25 here, but at $\varphi = 90^\circ$ the half-angle version gives 0.5 while the wrong one gives 0.`,
    },
    {
      kind: 'truefalse',
      prompt: 'A 50/50 classical mixture of |0⟩ and |1⟩ gives outcome 0 with certainty after a Hadamard gate.',
      answer: false,
      why: String.raw`Each member of the mixture goes through H alone: $|0\rangle \to |+\rangle$ and $|1\rangle \to |-\rangle$, both 50/50. With no shared superposition there is nothing to interfere, so the result stays 50/50.`,
    },
    {
      kind: 'explain',
      title: 'The precise rule',
      body: String.raw`If an outcome can be reached two **indistinguishable** ways with amplitudes $a_1$ and $a_2$:
$$P = |a_1 + a_2|^2 = |a_1|^2 + |a_2|^2 + 2\,\mathrm{Re}(\overline{a_1}\,a_2).$$
The last piece is the **interference term**; it can be positive (constructive) or negative (destructive). $\overline{a_1}$ is the complex conjugate.

If the paths are **distinguishable** (a record exists, as with the which-path detector), you instead add probabilities: $P = |a_1|^2 + |a_2|^2$, and interference is gone.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Two indistinguishable paths lead to the same outcome with amplitudes $a_1 = 0.5$ and $a_2 = 0.3$. What is the probability of that outcome?`,
      answer: 0.64, tolerance: 0.005,
      why: String.raw`Add amplitudes first: $|0.5 + 0.3|^2 = 0.64$. Adding probabilities ($0.25 + 0.09 = 0.34$) would be the answer only if the paths were distinguishable; the extra $2(0.5)(0.3) = 0.30$ is the interference term.`,
    },
    {
      kind: 'match',
      prompt: 'Match each term to its meaning.',
      pairs: [
        ['Constructive interference', 'Amplitudes with the same phase add up'],
        ['Destructive interference', 'Amplitudes with opposite phases cancel'],
        ['Classical mixture', 'Uncertainty about which state was prepared; no interference'],
        ['Superposition', 'One definite state with an amplitude for each outcome'],
      ],
      why: 'Interference is about how amplitudes combine; a mixture is ignorance about the preparation, which never produces interference effects.',
    },
    {
      kind: 'multi',
      prompt: String.raw`Starting from $|0\rangle$, which gate sequences give outcome 0 with certainty?`,
      choices: ['H, then H', 'H, Z, H', 'X, then X', 'H, S, S, H', 'Z'],
      answers: [0, 2, 4],
      why: String.raw`HH = I and XX = I. Z leaves $|0\rangle$ alone (it only changes the sign of $|1\rangle$). SS = Z, so H S S H = HZH = X, which gives 1 — destructive interference on 0.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Superposition ≠ mixture: H turns $|+\rangle$ into $|0\rangle$ but leaves a 50/50 mixture 50/50.
- Gates are linear; contributions to the same basis state **add as amplitudes**.
- $P = |a_1 + a_2|^2$ includes an interference term $2\mathrm{Re}(\overline{a_1}a_2)$; distinguishable paths lose it.
- Quantum algorithms work by arranging phases so that wrong answers cancel.`,
    },
  ],
  references: [
    { ...NC, detail: 'Sec. 1.3.1, Sec. 2.2' },
    { ...FEYNMAN3, detail: 'Ch. 1 and Ch. 3 "Probability Amplitudes"' },
    { ...QISKIT_TEXTBOOK, detail: 'Ch. 1.4–1.5, Ch. 2.2' },
  ],
} satisfies LessonContent;
