import type { LessonContent } from '../../types';
import { NC, QISKIT_TEXTBOOK, SAKURAI } from '../refs';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A globe for qubits',
      body: String.raw`Last lesson: every qubit state (up to an invisible global phase) can be written with two angles,
$$|\psi\rangle = \cos\tfrac{\theta}{2}\,|0\rangle + e^{i\varphi}\sin\tfrac{\theta}{2}\,|1\rangle,\qquad 0\le\theta\le\pi,\ 0\le\varphi<2\pi.$$
Two angles are exactly what you need to name a point on a globe: $\theta$ is the angle down from the North Pole, $\varphi$ the longitude.

That globe is the **Bloch sphere**. $|0\rangle$ sits at the North Pole ($\theta = 0$), $|1\rangle$ at the South Pole ($\theta = \pi$). Every other point is a superposition.`,
    },
    {
      kind: 'widget',
      title: 'Explore the sphere',
      body: String.raw`Drag $\theta$ and $\varphi$. Watch the amplitudes and the probabilities $P(0) = \cos^2(\theta/2)$, $P(1) = \sin^2(\theta/2)$. Notice that $\varphi$ never changes the probabilities — it is the relative phase.`,
      widget: { type: 'BlochSphere', props: { theta: 60, phi: 70, sliders: true, gates: [] } },
    },
    {
      kind: 'explain',
      title: 'Landmarks on the equator',
      body: String.raw`On the equator ($\theta = 90^\circ$) both outcomes have probability ½. The relative phase picks *where* on the equator:

- $|+\rangle = \tfrac{1}{\sqrt2}(|0\rangle + |1\rangle)$ at $+x$ ($\varphi = 0$)
- $|{+i}\rangle = \tfrac{1}{\sqrt2}(|0\rangle + i|1\rangle)$ at $+y$ ($\varphi = 90^\circ$)
- $|-\rangle$ at $-x$ ($\varphi = 180^\circ$), $|{-i}\rangle$ at $-y$ ($\varphi = 270^\circ$)

Why the half-angle $\theta/2$? Orthogonal states (perfectly distinguishable, like $|0\rangle$ and $|1\rangle$) must sit at **opposite points**, 180° apart on the sphere, even though as vectors they are "90° apart".`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Where on the Bloch sphere is $\tfrac{1}{\sqrt2}(|0\rangle + i|1\rangle)$?`,
      choices: ['North pole', String.raw`$+x$ axis`, String.raw`$+y$ axis`, String.raw`$-y$ axis`],
      answer: 2,
      why: String.raw`Equal sizes put it on the equator; the relative phase is $i = e^{i\pi/2}$, so $\varphi = 90^\circ$, which is the $+y$ direction. $-i$ would give $-y$.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A state sits at $\theta = 60^\circ$ (any $\varphi$). What is the probability of measuring 0?`,
      answer: 0.75, tolerance: 0.005,
      why: String.raw`$P(0) = \cos^2(\theta/2) = \cos^2 30^\circ = (\sqrt3/2)^2 = 0.75$. Forgetting the half-angle gives $\cos^2 60^\circ = 0.25$ — the classic mistake.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`$|0\rangle$ and $|1\rangle$ are orthogonal, so on the Bloch sphere they are 90° apart.`,
      answer: false,
      why: 'Orthogonal states are antipodal on the Bloch sphere — 180° apart (North and South poles). The half-angle in the parametrisation doubles angles when going from state space to the sphere.',
    },
    {
      kind: 'explain',
      title: 'The Bloch vector',
      body: String.raw`The arrow from the centre to the state's point is the **Bloch vector**
$$\vec r = (\sin\theta\cos\varphi,\ \sin\theta\sin\varphi,\ \cos\theta) = (r_x, r_y, r_z).$$
Its height directly gives the measurement odds:
$$P(0) = \frac{1 + r_z}{2},\qquad P(1) = \frac{1 - r_z}{2}.$$
Example: $|+\rangle$ has $\vec r = (1, 0, 0)$, so $r_z = 0$ and $P(0) = \tfrac12$. Later we will see $r_x, r_y, r_z$ are the average values of measuring along $x$, $y$, $z$.`,
    },
    {
      kind: 'explain',
      title: 'Gates are rotations',
      body: String.raw`Every single-qubit gate turns the Bloch sphere rigidly — it is a **rotation**. Press the buttons and watch the arrow travel:

- **X**: 180° about the $x$ axis (swaps poles: $|0\rangle \leftrightarrow |1\rangle$)
- **Z**: 180° about $z$ (flips the phase: $|+\rangle \leftrightarrow |-\rangle$)
- **H** (Hadamard): 180° about the diagonal between $x$ and $z$ ($|0\rangle \leftrightarrow |+\rangle$)
- **S**: 90° about $z$; **T**: 45° about $z$`,
      widget: { type: 'BlochSphere', props: { theta: 0, phi: 0 } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Start at $|0\rangle$. Apply H, then Z. Where does the arrow end up?`,
      choices: [String.raw`$|0\rangle$ (North pole)`, String.raw`$|1\rangle$ (South pole)`, String.raw`$|+\rangle$ ($+x$)`, String.raw`$|-\rangle$ ($-x$)`],
      answer: 3,
      why: String.raw`H takes the North pole to $+x$ ($|+\rangle$). Z is a half-turn about the vertical axis, carrying $+x$ to $-x$, i.e. $|-\rangle$. Try it on the sphere above.`,
    },
    {
      kind: 'order',
      prompt: String.raw`Put the steps in order to go from $|0\rangle$ to $|{+i}\rangle$.`,
      steps: [
        String.raw`Start at $|0\rangle$ (North pole)`,
        String.raw`Apply H: arrow moves to $+x$, the state $|+\rangle$`,
        String.raw`Apply S: a 90° turn about $z$ carries $+x$ to $+y$, the state $|{+i}\rangle$`,
      ],
      why: String.raw`S only rotates about the vertical axis, so applied first it would leave $|0\rangle$ unchanged. H first moves the arrow onto the equator, then S swings it a quarter turn: $S|+\rangle = \tfrac{1}{\sqrt2}(|0\rangle + i|1\rangle)$.`,
    },
    {
      kind: 'widget',
      title: 'Rotations by any angle',
      body: String.raw`Rotation gates $R_x(\alpha), R_y(\alpha), R_z(\alpha)$ turn the sphere by any angle $\alpha$. Set the angle to 90° and press $R_y$ from $|0\rangle$: you land on $|+\rangle$. Chemistry algorithms such as VQE are built from exactly these tunable rotations.`,
      widget: { type: 'BlochSphere', props: { theta: 0, rotations: true, gates: ['H'] } },
    },
    {
      kind: 'match',
      prompt: 'Match each point on the Bloch sphere with its state.',
      pairs: [
        ['North pole', String.raw`$|0\rangle$`],
        ['South pole', String.raw`$|1\rangle$`],
        [String.raw`$+x$ on the equator`, String.raw`$\tfrac{1}{\sqrt2}(|0\rangle + |1\rangle)$`],
        [String.raw`$-y$ on the equator`, String.raw`$\tfrac{1}{\sqrt2}(|0\rangle - i|1\rangle)$`],
      ],
      why: String.raw`Poles are the basis states. On the equator the relative phase $e^{i\varphi}$ sets the longitude: $+1$ at $\varphi=0$ ($+x$), $-i$ at $\varphi = 270^\circ$ ($-y$).`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about the Bloch sphere are true?',
      choices: [
        'Every pure single-qubit state is a point on its surface',
        'Points strictly inside the ball describe mixed states (classical uncertainty about the state)',
        'A global phase does not move the point',
        'Two qubits can be drawn as two arrows on one Bloch sphere, with no information lost',
      ],
      answers: [0, 1, 2],
      why: 'The surface holds all pure states; the interior describes mixtures (covered with density matrices later). Global phase is invisible. Entangled two-qubit states cannot be described by two separate arrows — that is exactly what entanglement means.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A qubit state $\cos\tfrac{\theta}{2}|0\rangle + e^{i\varphi}\sin\tfrac{\theta}{2}|1\rangle$ is a point on the Bloch sphere.
- Poles are $|0\rangle, |1\rangle$; the equator holds equal superpositions ($|\pm\rangle$, $|{\pm i}\rangle$).
- $P(0) = (1 + r_z)/2$: height gives the odds, longitude is the relative phase.
- Single-qubit gates are **rotations** of the sphere (X, Z, H: half-turns; S, T: quarter and eighth turns about $z$).`,
    },
  ],
  references: [
    { ...NC, detail: 'Sec. 1.2, Sec. 4.2 (rotation operators), Exercise 4.6' },
    { ...QISKIT_TEXTBOOK, detail: 'Ch. 1.4 "Representing Qubit States" and Ch. 2 single-qubit gates' },
    { ...SAKURAI, detail: 'Sec. 3.2 (spin-½ rotations)' },
  ],
} satisfies LessonContent;
