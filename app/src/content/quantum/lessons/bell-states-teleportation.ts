import type { LessonContent } from '../../types';
import { BENNETT_TELEPORT, NC, QISKIT_TEXTBOOK } from '../refs';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The four Bell states',
      body: String.raw`Feed each of the four basis states into the "H on q0, then CNOT q0→q1" circuit and you get the four **Bell states**:
$$|\Phi^\pm\rangle = \tfrac{1}{\sqrt2}(|00\rangle \pm |11\rangle),\qquad |\Psi^\pm\rangle = \tfrac{1}{\sqrt2}(|01\rangle \pm |10\rangle).$$
$\Phi$ states have *equal* bits, $\Psi$ states *opposite* bits; the $\pm$ sign is a relative phase. They are mutually orthogonal, so they form a complete **basis** for two qubits — the **Bell basis**. Every one is maximally entangled.`,
    },
    {
      kind: 'widget',
      title: 'Bell-state factory',
      body: String.raw`This circuit starts with X on q0, so the input to H+CNOT is $|10\rangle$. Step through: the result is $\tfrac{1}{\sqrt2}(|00\rangle - |11\rangle) = |\Phi^-\rangle$ — note the phase dial under $|11\rangle$ points the opposite way. Undo/add X gates to make the other three.`,
      widget: { type: 'QuantumCircuitSim', props: { qubits: 2, circuit: ['X0', 'H0', 'CX01'], stepMode: true, palette: ['X', 'H', 'CX', 'Z'] } },
    },
    {
      kind: 'match',
      prompt: 'Input to "H on q0, then CNOT q0→q1" → output Bell state.',
      pairs: [
        [String.raw`$|00\rangle$`, String.raw`$|\Phi^+\rangle$`],
        [String.raw`$|10\rangle$`, String.raw`$|\Phi^-\rangle$`],
        [String.raw`$|01\rangle$`, String.raw`$|\Psi^+\rangle$`],
        [String.raw`$|11\rangle$`, String.raw`$|\Psi^-\rangle$`],
      ],
      why: String.raw`q0 = 1 makes H produce a minus sign (giving the $-$ states); q1 = 1 makes the bits opposite after CNOT (giving $\Psi$). E.g. $|11\rangle \to \tfrac{1}{\sqrt2}(|01\rangle - |11\rangle) \to \tfrac{1}{\sqrt2}(|01\rangle - |10\rangle)$.`,
    },
    {
      kind: 'explain',
      title: 'Bell measurement: run it backwards',
      body: String.raw`Because the circuit is unitary, running it in reverse — CNOT q0→q1, then H on q0 — maps each Bell state back to a unique basis state. Measuring then tells you *which* Bell state you had:

- $|\Phi^+\rangle \to 00$, $|\Psi^+\rangle \to 01$, $|\Phi^-\rangle \to 10$, $|\Psi^-\rangle \to 11$

This **Bell measurement** is the key ingredient of teleportation.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`You perform a Bell measurement (CNOT, then H on q0, then measure) on $|\Psi^+\rangle$. Which bits (q0 q1) do you get?`,
      choices: ['00', '01', '10', '11'],
      answer: 1,
      why: String.raw`The reverse circuit undoes the creation circuit, and $|\Psi^+\rangle$ was created from $|01\rangle$. So you read 01 with certainty — no randomness, because Bell states are a basis.`,
    },
    {
      kind: 'explain',
      title: 'Teleportation: the setup',
      body: String.raw`Alice holds an **unknown** qubit $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$ (q0). She can't measure it (that would collapse it) and can't copy it. She and Bob share a Bell pair $|\Phi^+\rangle$: Alice has q1, Bob has q2.

**Protocol** (Bennett et al., 1993):
1. Alice does a Bell measurement on q0 and q1 (CNOT q0→q1, H on q0, measure), getting two bits $m_0 m_1$.
2. She phones Bob the two bits.
3. Bob applies $X$ if $m_1 = 1$, then $Z$ if $m_0 = 1$.

Bob's qubit is now exactly $|\psi\rangle$.`,
    },
    {
      kind: 'widget',
      title: 'Why it works',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Start: $|\psi\rangle|\Phi^+\rangle = \tfrac{1}{\sqrt2}\left[\alpha|0\rangle(|00\rangle + |11\rangle) + \beta|1\rangle(|00\rangle + |11\rangle)\right]$`,
            String.raw`CNOT q0→q1: $\tfrac{1}{\sqrt2}\left[\alpha|0\rangle(|00\rangle + |11\rangle) + \beta|1\rangle(|10\rangle + |01\rangle)\right]$`,
            String.raw`H on q0: $\tfrac12\left[\alpha(|0\rangle + |1\rangle)(|00\rangle + |11\rangle) + \beta(|0\rangle - |1\rangle)(|10\rangle + |01\rangle)\right]$`,
            String.raw`Regroup by Alice's bits $m_0m_1$: $\tfrac12\big[|00\rangle(\alpha|0\rangle + \beta|1\rangle) + |01\rangle(\alpha|1\rangle + \beta|0\rangle) + |10\rangle(\alpha|0\rangle - \beta|1\rangle) + |11\rangle(\alpha|1\rangle - \beta|0\rangle)\big]$`,
            String.raw`Corrections: 00 → nothing; 01 → $X$; 10 → $Z$; 11 → $X$ then $Z$. Each gives $\alpha|0\rangle + \beta|1\rangle$ on Bob's qubit.`,
          ],
          notes: [
            'Three qubits: Alice’s unknown state, then the shared pair (q1 Alice, q2 Bob).',
            'Flip q1 wherever q0 is 1.',
            'Expand; the last digit in each ket is Bob’s.',
            'Each of the four outcomes is equally likely (probability ¼) and leaves Bob with a known “scrambled” version of ψ.',
            String.raw`E.g. for 11: $X(\alpha|1\rangle - \beta|0\rangle) = \alpha|0\rangle - \beta|1\rangle$, then $Z$ gives $\alpha|0\rangle + \beta|1\rangle$.`,
          ],
        },
      },
    },
    {
      kind: 'widget',
      title: 'Teleportation in the simulator',
      body: String.raw`Here q0 is prepared in a lopsided state with H, T, H (so $P(1) \approx 0.15$). Then the Bell pair, Alice's Bell-measurement gates, and Bob's corrections — implemented as controlled gates (CX q1→q2, CZ q0→q2), which is equivalent to measuring and phoning the bits. Press **Sample**: count how often the **last** digit (Bob's q2) is 1. It matches ψ's 15%.`,
      widget: { type: 'QuantumCircuitSim', props: { qubits: 3, circuit: ['H0', 'T0', 'H0', 'H1', 'CX12', 'CX01', 'H0', 'CX12', 'CZ02'], palette: [], shots: 400 } },
    },
    {
      kind: 'order',
      prompt: 'Put the teleportation protocol in order.',
      steps: [
        'Alice and Bob share a Bell pair',
        'Alice applies CNOT from her unknown qubit to her half of the pair',
        'Alice applies H to the unknown qubit',
        'Alice measures her two qubits, getting two bits',
        'Alice sends the two bits to Bob over a classical channel',
        'Bob applies X and/or Z depending on the bits',
      ],
      why: 'The entanglement must exist first; Alice’s Bell measurement then “transfers” the state up to a known Pauli correction, which Bob can only fix once the classical bits arrive.',
    },
    {
      kind: 'truefalse',
      prompt: 'Teleportation transmits a quantum state faster than light.',
      answer: false,
      why: 'Until Bob receives Alice’s two classical bits, his qubit is in a completely random state (each of the four corrections is equally likely). The classical message travels at most at light speed.',
    },
    {
      kind: 'multi',
      prompt: 'What does teleportation of one qubit require?',
      choices: [
        'A shared entangled pair',
        'Two classical bits sent from Alice to Bob',
        String.raw`Alice knowing $\alpha$ and $\beta$`,
        'Alice keeping an intact copy of the original state',
      ],
      answers: [0, 1],
      why: String.raw`The state is never learned — Alice's measurement results are uniformly random and say nothing about $\alpha, \beta$. Her original qubit is destroyed in the process, consistent with the no-cloning theorem.`,
    },
    {
      kind: 'numeric',
      prompt: 'Each teleported qubit consumes one Bell pair and how many classical bits?',
      answer: 2,
      why: 'Alice’s Bell measurement has four possible outcomes, which takes 2 bits to communicate. Bob needs both to choose the right correction.',
    },
    {
      kind: 'fill',
      prompt: 'If Alice measures m0m1 = 01, Bob applies ___. If she measures 10, he applies ___.',
      bank: ['X', 'Z', 'H', 'nothing', 'S'],
      answer: ['X', 'Z'],
      why: String.raw`From the regrouped state: outcome 01 leaves $\alpha|1\rangle + \beta|0\rangle$ (fix with $X$); outcome 10 leaves $\alpha|0\rangle - \beta|1\rangle$ (fix with $Z$).`,
    },
    {
      kind: 'explain',
      title: 'Why teleportation matters',
      body: String.raw`Teleportation is not sci-fi transport of matter; it moves a *quantum state* using entanglement plus classical communication. It underpins:

- **Quantum networks and repeaters**, which link distant quantum processors.
- **Gate teleportation**: fault-tolerant computers apply hard gates (such as T) by teleporting through specially prepared "magic states".
- **Modular architectures**, where qubits on different chips interact via shared Bell pairs.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- The four Bell states $|\Phi^\pm\rangle, |\Psi^\pm\rangle$ form an orthonormal, maximally entangled basis.
- Bell measurement = creation circuit in reverse, then measure.
- Teleportation: 1 Bell pair + 2 classical bits → move an unknown qubit; the original is destroyed.
- No faster-than-light signalling, no cloning — but a key primitive for networks and fault tolerance.`,
    },
  ],
  references: [
    { ...NC, detail: 'Sec. 1.3.7 (quantum teleportation), Sec. 4.4 (deferred measurement)' },
    { ...QISKIT_TEXTBOOK, detail: 'Ch. 3.5 "Quantum Teleportation"' },
    BENNETT_TELEPORT,
  ],
} satisfies LessonContent;
