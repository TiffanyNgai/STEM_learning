import type { LessonContent } from '../../types';
import { ASPECT, NC, PRESKILL_NOTES, QISKIT_TEXTBOOK } from '../refs';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Two qubits that always agree',
      body: String.raw`Last lesson, H on q0 followed by CNOT produced
$$|\Phi^+\rangle = \tfrac{1}{\sqrt2}\left(|00\rangle + |11\rangle\right).$$
Measure both qubits: you get 00 or 11, each half the time — never 01 or 10. Each qubit alone looks like a fair coin, yet the two always agree.

A classical analogy: put one glove of a pair in each of two boxes. Opening one box tells you what is in the other. Hold that analogy loosely — we will see where it fails.`,
    },
    {
      kind: 'explain',
      title: 'Product vs entangled',
      body: String.raw`A two-qubit state is a **product state** if it can be written as one qubit's state times the other's: $|\psi\rangle = |a\rangle\otimes|b\rangle$. Then each qubit has its own Bloch arrow.

If no such factorisation exists the state is **entangled**: the pair has a definite joint state, but neither qubit has a state of its own.

**Test** (two qubits only): for $a|00\rangle + b|01\rangle + c|10\rangle + d|11\rangle$,
$$\text{product} \iff ad - bc = 0.$$
(Product states have $a = \alpha_0\beta_0$, $d = \alpha_1\beta_1$, $b = \alpha_0\beta_1$, $c = \alpha_1\beta_0$, so $ad = bc$ automatically.)`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Compute $ad - bc$ for $|\Phi^+\rangle = \tfrac{1}{\sqrt2}(|00\rangle + |11\rangle)$.`,
      answer: 0.5, tolerance: 0.005,
      why: String.raw`$a = d = 1/\sqrt2$ and $b = c = 0$, so $ad - bc = \tfrac12 \ne 0$: entangled. (For any normalized state, $|ad - bc|$ is at most ½, so the Bell state is maximally entangled.)`,
    },
    {
      kind: 'mcq',
      prompt: 'Which state is entangled?',
      choices: [
        String.raw`$\tfrac{1}{\sqrt2}(|00\rangle + |01\rangle)$`,
        String.raw`$\tfrac12(|00\rangle + |01\rangle + |10\rangle + |11\rangle)$`,
        String.raw`$\tfrac{1}{\sqrt2}(|01\rangle - |10\rangle)$`,
        String.raw`$|11\rangle$`,
      ],
      answer: 2,
      why: String.raw`For option 3, $a = d = 0$ and $bc = -\tfrac12$, so $ad - bc = \tfrac12 \ne 0$. The others factorise: $|0\rangle|+\rangle$, $|+\rangle|+\rangle$ and $|1\rangle|1\rangle$. A superposition of several terms is not automatically entangled.`,
    },
    {
      kind: 'widget',
      title: 'Make a Bell pair',
      body: 'Step through H and CNOT, then press Sample several times. Only 00 and 11 appear, in roughly equal numbers.',
      widget: { type: 'QuantumCircuitSim', props: { qubits: 2, circuit: ['H0', 'CX01'], stepMode: true, palette: [] } },
    },
    {
      kind: 'explain',
      title: 'Measuring half of an entangled pair',
      body: String.raw`Measure only q0 of $|\Phi^+\rangle$. If you get 0, the joint state collapses to $|00\rangle$; if 1, to $|11\rangle$. Either way q1's result is now fixed — even if q1 is in another lab, light-years away.

Does this let Alice signal to Bob? **No.** Bob's own results are 50/50 whatever Alice does; the correlation only shows up when they compare notes over an ordinary (light-speed-limited) channel. This is the **no-signalling** property.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Using a shared Bell pair, Alice can send Bob a message instantly by choosing whether or not to measure her qubit.',
      answer: false,
      why: 'Bob’s measurement statistics on his own qubit are identical (50/50) whether or not Alice measured. Without a classical message he cannot tell anything happened, so no information travels faster than light.',
    },
    {
      kind: 'explain',
      title: 'Where the gloves analogy breaks',
      body: String.raw`Gloves have one property (left/right) fixed in advance. $|\Phi^+\rangle$ is perfectly correlated along **every** axis in the $x$–$z$ plane, not just one fixed property. Rotate both qubits with H (that is, measure along $x$ instead of $z$) and you still get perfect agreement, because
$$(H\otimes H)\,|\Phi^+\rangle = |\Phi^+\rangle.$$
Measuring at *intermediate* angles gives correlations that no pre-assigned "glove" values can reproduce. Bell's theorem makes this precise, and experiments (Aspect 1982; loophole-free tests in 2015) confirm the quantum prediction.`,
      widget: { type: 'QuantumCircuitSim', props: { qubits: 2, circuit: ['H0', 'CX01', 'H0', 'H1'], palette: [] }, caption: 'Bell pair, then H on both qubits (measuring in the x basis): still only 00 and 11.' },
    },
    {
      kind: 'multi',
      prompt: String.raw`Starting from $|00\rangle$, which circuits produce an entangled state?`,
      choices: [
        'H on q0, then CNOT q0→q1',
        'H on q0, then H on q1',
        'X on q0, then CNOT q0→q1',
        'H on q0, then CNOT q0→q1 twice',
        'H on q1, then CNOT q1→q0',
      ],
      answers: [0, 4],
      why: String.raw`Entanglement needs a superposed control *and* a two-qubit gate. H,H gives $|{+}{+}\rangle$ (product). X then CNOT gives $|11\rangle$ (no superposition). Two CNOTs cancel, leaving $|{+}0\rangle$. Option 5 is option 1 with the roles of the qubits swapped.`,
    },
    {
      kind: 'explain',
      title: 'Why chemists should care',
      body: String.raw`To describe $n$ entangled qubits you need all $2^n$ amplitudes; product states need only $2n$ numbers. Entanglement is what makes quantum states expensive to store.

Electrons in molecules behave the same way. A **mean-field** picture (like Hartree–Fock) treats each electron as moving independently — roughly, a product state of orbitals. The missing piece, **electron correlation** (see [post-Hartree–Fock methods](@chem/post-hartree-fock)), is entanglement between orbitals. Strongly correlated systems, such as the iron–sulfur clusters in metalloenzymes, are exactly where quantum computers might help.`,
    },
    {
      kind: 'fill',
      prompt: 'A two-qubit state a|00⟩+b|01⟩+c|10⟩+d|11⟩ is a product state exactly when ad − bc equals ___. Otherwise it is ___.',
      bank: ['0', '1', 'entangled', 'mixed', 'normalized'],
      answer: ['0', 'entangled'],
      why: 'Product states satisfy ad = bc identically. "Mixed" means classical uncertainty about the state, which is a different concept from entanglement.',
    },
    {
      kind: 'match',
      prompt: 'Match each state with its measurement behaviour (both qubits measured in the 0/1 basis).',
      pairs: [
        [String.raw`$\tfrac{1}{\sqrt2}(|00\rangle + |11\rangle)$`, 'Always the same results'],
        [String.raw`$\tfrac{1}{\sqrt2}(|01\rangle + |10\rangle)$`, 'Always opposite results'],
        [String.raw`$|+\rangle\otimes|-\rangle$`, 'Independent: all four outcomes equally likely'],
        [String.raw`$|11\rangle$`, 'Always 11'],
      ],
      why: 'The first two are entangled Bell states with perfect (anti-)correlation. The last two are product states: their outcomes are independent (the |11⟩ case is trivially deterministic).',
    },
    {
      kind: 'numeric',
      prompt: String.raw`In $|\Phi^+\rangle$ you measure q0 and get 1. What is the probability that q1 then gives 1?`,
      answer: 1,
      why: String.raw`The outcome 1 on q0 collapses the pair to $|11\rangle$, so q1 gives 1 with certainty. Before any measurement, q1 alone would have been 50/50.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Entangled** = cannot be written as $|a\rangle\otimes|b\rangle$; two-qubit test: $ad - bc \ne 0$.
- H + CNOT makes the Bell state $|\Phi^+\rangle$: perfectly correlated outcomes, each individually random.
- Perfect correlations in more than one basis ($z$ and $x$), and correlations at intermediate angles stronger than any classical "gloves" model (Bell).
- No signalling: entanglement alone cannot transmit messages.
- In the orbital-occupation (qubit) picture, electron correlation shows up as entanglement; it is why exact chemistry is hard.`,
    },
  ],
  references: [
    { ...NC, detail: 'Sec. 1.3.6 (Bell states), Sec. 2.6 (EPR and Bell inequality)' },
    { ...QISKIT_TEXTBOOK, detail: 'Ch. 2.2 "Multiple Qubits and Entangled States"' },
    { ...PRESKILL_NOTES, detail: 'Ch. 4 "Quantum Entanglement"' },
    ASPECT,
  ],
} satisfies LessonContent;
