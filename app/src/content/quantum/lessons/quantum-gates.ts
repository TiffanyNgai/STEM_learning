import type { LessonContent } from '../../types';
import { NC, QISKIT_TEXTBOOK, SAKURAI } from '../refs';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'What makes a legal quantum gate?',
      body: String.raw`A gate is an instruction that changes a qubit's state. Quantum gates obey two rules:

1. **Linear**: they act on each part of a superposition separately (so they are matrices).
2. **Probability-preserving and reversible**: total probability stays 1, and you can always undo the gate.

Matrices with both properties are called **unitary**: $U^\dagger U = I$, where $U^\dagger$ ("U dagger") is the **conjugate transpose** — flip the matrix across its diagonal and replace each entry by its complex conjugate. The inverse of a gate is therefore just $U^\dagger$.`,
    },
    {
      kind: 'recall',
      title: 'Matrices acting on vectors',
      points: [
        String.raw`$\begin{pmatrix}a & b\\ c & d\end{pmatrix}\begin{pmatrix}x\\ y\end{pmatrix} = \begin{pmatrix}ax + by\\ cx + dy\end{pmatrix}$`,
        String.raw`The identity $I$ leaves every vector unchanged.`,
        String.raw`Applying $A$ then $B$ is the product $BA$ (rightmost acts first).`,
        String.raw`Transpose swaps rows and columns; conjugate transpose also conjugates every entry.`,
      ],
      link: 'math/vectors-matrices',
    },
    {
      kind: 'explain',
      title: 'The Pauli gates',
      body: String.raw`$$X = \begin{pmatrix}0&1\\1&0\end{pmatrix},\quad Y = \begin{pmatrix}0&-i\\ i&0\end{pmatrix},\quad Z = \begin{pmatrix}1&0\\0&-1\end{pmatrix}.$$
- **X** is the quantum NOT: $X(\alpha|0\rangle + \beta|1\rangle) = \beta|0\rangle + \alpha|1\rangle$.
- **Z** is a **phase flip**: it leaves $|0\rangle$ alone and multiplies $|1\rangle$ by $-1$.
- **Y** does both (up to a factor $i$): $Y = iXZ$.

On the Bloch sphere each is a half-turn about its own axis. Each is its own inverse: $X^2 = Y^2 = Z^2 = I$.`,
    },
    {
      kind: 'widget',
      title: 'Paulis as half-turns',
      body: String.raw`Start at an arbitrary state and press X, Y, Z. Each swings the arrow 180° about its axis; pressing the same gate twice brings it back.`,
      widget: { type: 'BlochSphere', props: { theta: 50, phi: 40, gates: ['X', 'Y', 'Z'] } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`What is $Z\,(0.6|0\rangle + 0.8|1\rangle)$?`,
      choices: [String.raw`$0.8|0\rangle + 0.6|1\rangle$`, String.raw`$0.6|0\rangle - 0.8|1\rangle$`, String.raw`$-0.6|0\rangle + 0.8|1\rangle$`, String.raw`$0.6|0\rangle + 0.8|1\rangle$`],
      answer: 1,
      why: String.raw`Z multiplies the $|1\rangle$ amplitude by $-1$ and leaves $|0\rangle$ untouched. Swapping amplitudes would be X. Option 3 differs from the answer only by a global phase $-1$, so it is physically the same state — but it is not what the matrix multiplication literally gives.`,
    },
    {
      kind: 'explain',
      title: 'Hadamard and the phase gates',
      body: String.raw`$$H = \tfrac{1}{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix},\quad S = \begin{pmatrix}1&0\\0&i\end{pmatrix},\quad T = \begin{pmatrix}1&0\\0&e^{i\pi/4}\end{pmatrix}.$$
- **H** swaps the $z$ and $x$ axes: $|0\rangle \leftrightarrow |+\rangle$, $|1\rangle \leftrightarrow |-\rangle$.
- **S** and **T** add a phase to $|1\rangle$: a quarter-turn and an eighth-turn about $z$.

They nest neatly: $T^2 = S$ and $S^2 = Z$. Unlike the Paulis, S and T are *not* their own inverses: $S^\dagger = \mathrm{diag}(1, -i)$ undoes S.`,
    },
    {
      kind: 'fill',
      prompt: 'Applying T twice gives ___. Applying S twice gives ___.',
      bank: ['S', 'Z', 'X', 'H', 'I'],
      answer: ['S', 'Z'],
      why: String.raw`Phases multiply: $(e^{i\pi/4})^2 = e^{i\pi/2} = i$ (that's S) and $i^2 = -1$ (that's Z). Each doubling doubles the rotation angle about $z$: 45° → 90° → 180°.`,
    },
    {
      kind: 'widget',
      title: 'Gate playground',
      body: String.raw`Build $H$, $Z$, $H$ on q0 and compare with a single X: same bars and same phases. Try also $S, S$ versus $Z$. (Step with ◀ ▶ to see the state after each gate.)`,
      widget: { type: 'QuantumCircuitSim', props: { qubits: 1, palette: ['H', 'X', 'Y', 'Z', 'S', 'T'] } },
    },
    {
      kind: 'truefalse',
      prompt: 'Every quantum gate is its own inverse.',
      answer: false,
      why: String.raw`X, Y, Z and H are self-inverse, but S and T are not: $SS = Z \ne I$. Every gate is *invertible* (its inverse is $U^\dagger$), which is a weaker statement.`,
    },
    {
      kind: 'explain',
      title: 'Worked check: is H unitary?',
      body: String.raw`H has real entries and is symmetric, so $H^\dagger = H$. Then
$$H^\dagger H = \tfrac12\begin{pmatrix}1&1\\1&-1\end{pmatrix}\begin{pmatrix}1&1\\1&-1\end{pmatrix} = \tfrac12\begin{pmatrix}2&0\\0&2\end{pmatrix} = I.\ \checkmark$$
Why unitarity matters: it guarantees the columns of a gate are orthonormal, so lengths (total probability) are preserved.

Note that **measurement is not a gate**: the projection onto $|0\rangle$, $\begin{pmatrix}1&0\\0&0\end{pmatrix}$, is not unitary — it throws information away.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Apply T to $|1\rangle$. By how many degrees does the phase of the $|1\rangle$ amplitude rotate?`,
      answer: 45, tolerance: 0.5, unit: '°',
      why: String.raw`$T|1\rangle = e^{i\pi/4}|1\rangle$, and $\pi/4$ rad $= 45^\circ$. (On $|1\rangle$ alone this is a global phase; it becomes observable when T acts on a superposition.)`,
    },
    {
      kind: 'match',
      prompt: 'Match each gate to its action.',
      pairs: [
        ['X', String.raw`Bit flip: $|0\rangle \leftrightarrow |1\rangle$`],
        ['Z', String.raw`Phase flip: $|1\rangle \to -|1\rangle$`],
        ['H', String.raw`$|0\rangle \to |+\rangle$, $|1\rangle \to |-\rangle$`],
        ['S', 'Quarter-turn about the z axis'],
        ['T', 'Eighth-turn about the z axis'],
      ],
      why: 'X, Z, H are half-turns about x, z and the x–z diagonal; S and T are the 90° and 45° phase gates.',
    },
    {
      kind: 'mcq',
      prompt: 'Which matrix can NOT be a quantum gate?',
      choices: [
        String.raw`$\begin{pmatrix}0&1\\1&0\end{pmatrix}$`,
        String.raw`$\begin{pmatrix}1&0\\0&i\end{pmatrix}$`,
        String.raw`$\begin{pmatrix}1&0\\0&0\end{pmatrix}$`,
        String.raw`$\tfrac{1}{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix}$`,
      ],
      answer: 2,
      why: String.raw`It sends $|1\rangle$ to the zero vector, destroying probability, so $U^\dagger U \ne I$. The others are X, S and H — all unitary.`,
    },
    {
      kind: 'order',
      prompt: String.raw`Compute $HZH|0\rangle$ step by step (rightmost gate acts first).`,
      steps: [
        String.raw`$H|0\rangle = |+\rangle$`,
        String.raw`$Z|+\rangle = |-\rangle$`,
        String.raw`$H|-\rangle = |1\rangle$`,
        String.raw`So $HZH$ acts like $X$ on $|0\rangle$ (in fact $HZH = X$ exactly)`,
      ],
      why: String.raw`In $HZH|0\rangle$ the rightmost H acts first. H converts phase flips into bit flips because it swaps the $x$ and $z$ axes — a useful identity when compiling circuits.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Gates are **unitary** matrices: $U^\dagger U = I$; inverse $= U^\dagger$.
- Paulis X (bit flip), Z (phase flip), Y; Hadamard H swaps $x \leftrightarrow z$.
- Phase gates: $T^2 = S$, $S^2 = Z$.
- Measurement is not unitary. Next: putting gates on several qubits — **circuits**.`,
    },
  ],
  references: [
    { ...NC, detail: 'Sec. 1.3.1, Sec. 4.2 (single-qubit operations)' },
    { ...QISKIT_TEXTBOOK, detail: 'Ch. 1.4 "Single Qubit Gates"' },
    { ...SAKURAI, detail: 'Sec. 3.2 (Pauli matrices)' },
  ],
} satisfies LessonContent;
