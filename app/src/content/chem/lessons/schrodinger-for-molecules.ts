import type { LessonContent } from '../../types';

const pes = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" stroke-width="1">
    <ellipse cx="85" cy="70" rx="60" ry="46" stroke="var(--c2)" opacity="0.35"/>
    <ellipse cx="85" cy="70" rx="40" ry="30" stroke="var(--c2)" opacity="0.6"/>
    <ellipse cx="85" cy="70" rx="18" ry="13" stroke="var(--c2)"/>
    <ellipse cx="238" cy="66" rx="66" ry="50" stroke="var(--c1)" opacity="0.35"/>
    <ellipse cx="238" cy="66" rx="44" ry="33" stroke="var(--c1)" opacity="0.6"/>
    <ellipse cx="238" cy="66" rx="22" ry="15" stroke="var(--c1)"/>
  </g>
  <path id="pes-path" d="M85,70 Q160,30 238,66" fill="none" stroke="var(--c3)" stroke-width="1.5" stroke-dasharray="4 3"/>
  <circle cx="160" cy="49" r="4" fill="none" stroke="var(--c5)" stroke-width="1.5"/>
  <text x="160" y="40" font-size="9" text-anchor="middle" fill="var(--c5)">saddle = transition state</text>
  <text x="85" y="134" font-size="9" text-anchor="middle" fill="var(--c2)">reactant minimum</text>
  <text x="238" y="132" font-size="9" text-anchor="middle" fill="var(--c1)">product minimum</text>
  <text x="6" y="12" font-size="9" fill="var(--muted)">contour map of E(R₁, R₂) — like a hiking map</text>
  <circle r="4" fill="var(--c3)"><animateMotion dur="4s" repeatCount="indefinite" keyPoints="0;1;1;0;0" keyTimes="0;0.4;0.5;0.9;1" calcMode="linear" path="M85,70 Q160,30 238,66"/></circle>
  <line x1="20" y1="192" x2="300" y2="192" stroke="var(--fg)"/>
  <text x="300" y="188" font-size="9" text-anchor="end" fill="var(--fg)">reaction coordinate</text>
  <path d="M30,178 C60,178 70,178 90,176 C130,170 140,146 160,146 C180,146 195,180 235,184 C260,186 280,186 300,186" fill="none" stroke="var(--fg)" stroke-width="1.5"/>
  <text x="166" y="152" font-size="9" fill="var(--c5)">barrier</text>
  <text x="24" y="170" font-size="9" fill="var(--muted)">E</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain', title: 'All of chemistry in one equation?',
      body: String.raw`Soon after quantum mechanics was born, Paul Dirac (1929) remarked that the laws needed for all of chemistry were now fully known — the only problem was that the equations were far too complicated to solve exactly.

That is still the situation. Every bond length, reaction barrier and colour is, in principle, a solution of one equation: the **Schrödinger equation for the molecule**. Quantum chemistry is the art of solving it *approximately but well*. This lesson sets up the problem.`,
    },
    {
      kind: 'recall', title: 'The Schrödinger equation',
      points: [
        String.raw`Time-independent form: $\hat H\Psi = E\Psi$ — an **eigenvalue** problem.`,
        String.raw`$\hat H$ (the Hamiltonian) = kinetic energy operator + potential energy.`,
        String.raw`Allowed energies $E$ are the eigenvalues; the lowest is the **ground state**.`,
        String.raw`$|\Psi|^2$ gives the probability density of the particles’ positions.`,
      ],
      link: 'quantum/schrodinger-equation',
    },
    {
      kind: 'explain', title: 'The molecular Hamiltonian',
      body: String.raw`For electrons $i, j$ and nuclei $A, B$ (charges $Z_A$, masses $M_A$), in **atomic units**:

$$\hat H = -\sum_A \frac{\nabla_A^2}{2M_A} - \sum_i \frac{\nabla_i^2}{2} - \sum_{i,A}\frac{Z_A}{r_{iA}} + \sum_{i<j}\frac{1}{r_{ij}} + \sum_{A<B}\frac{Z_AZ_B}{R_{AB}}$$

In order: nuclear kinetic energy, electron kinetic energy, electron–nucleus attraction, electron–electron repulsion, nucleus–nucleus repulsion. $r$ and $R$ are distances; $\nabla^2$ measures how sharply the wavefunction curves (kinetic energy).`,
    },
    {
      kind: 'widget', title: 'Write it out for H₂',
      widget: { type: 'StepReveal', props: {
        steps: [
          String.raw`H₂: two protons A, B ($Z = 1$) and two electrons 1, 2.`,
          String.raw`Nuclear kinetic: $-\frac{\nabla_A^2}{2M} - \frac{\nabla_B^2}{2M}$ (2 terms; $M \approx 1836$ in atomic units).`,
          String.raw`Electron kinetic: $-\frac12\nabla_1^2 - \frac12\nabla_2^2$ (2 terms).`,
          String.raw`Attraction: $-\frac{1}{r_{1A}} - \frac{1}{r_{1B}} - \frac{1}{r_{2A}} - \frac{1}{r_{2B}}$ (4 terms).`,
          String.raw`Repulsion: $+\frac{1}{r_{12}}$ (electrons) and $+\frac{1}{R_{AB}}$ (nuclei).`,
          String.raw`Total: 10 terms, 12 coordinates. The $1/r_{12}$ term couples the two electrons — each one’s motion depends on where the other is. That single term is what makes the problem unsolvable exactly.`,
        ],
      } },
    },
    {
      kind: 'mcq', prompt: 'Which term in the molecular Hamiltonian prevents us from solving for each electron separately?',
      choices: ['Electron kinetic energy', 'Electron–nucleus attraction', 'Electron–electron repulsion', 'Nucleus–nucleus repulsion'],
      answer: 2,
      why: 'Every other electronic term involves one electron at a time, so the equation would split into independent one-electron problems. 1/r_ij depends on two electrons’ positions at once — electron correlation, the central difficulty of quantum chemistry.',
    },
    {
      kind: 'fill', prompt: String.raw`In atomic units, $\hbar$, the electron mass $m_e$, the charge $e$ and $4\pi\varepsilon_0$ are all set to ___, and energies come out in ___.`,
      bank: ['1', '0', 'hartrees', 'joules', 'kelvin'], answer: ['1', 'hartrees'],
      why: 'Atomic units remove the constants so equations look clean. 1 hartree (Eₕ) = 27.211 eV = 627.5 kcal/mol; lengths are in bohr (a₀ = 0.529 Å).',
    },
    {
      kind: 'explain', title: 'Born–Oppenheimer: freeze the nuclei',
      body: String.raw`A proton is ~1836 times heavier than an electron, so nuclei move far more slowly. Picture flies buzzing around a slowly walking elephant: the flies instantly re-adjust to wherever the elephant is.

The **Born–Oppenheimer approximation** (1927) fixes the nuclei at positions $\mathbf R$ and solves only for the electrons:

$$\hat H_\text{el}\,\psi_\text{el}(\mathbf r;\mathbf R) = E_\text{el}(\mathbf R)\,\psi_\text{el}(\mathbf r;\mathbf R)$$

$\hat H_\text{el}$ drops the nuclear kinetic term and the (now constant) nuclear repulsion $V_{nn}$; $\mathbf R$ is just a parameter. Then the nuclei move on the energy $E_\text{el}(\mathbf R) + V_{nn}(\mathbf R)$.`,
    },
    {
      kind: 'truefalse', prompt: 'In the Born–Oppenheimer approximation, the nuclear kinetic energy term is left out of the electronic Hamiltonian.',
      answer: true,
      why: 'Nuclei are treated as fixed while solving for the electrons; their kinetic energy re-enters later, when we study how nuclei vibrate or react on the resulting energy surface.',
    },
    {
      kind: 'explain', title: 'Potential energy surfaces',
      body: String.raw`Repeating the electronic calculation at many geometries gives a **potential energy surface** (PES), $E(\mathbf R)$. For a diatomic it is a curve with:

- a **minimum** at the equilibrium bond length $r_e$,
- a well depth $D_e$ (energy to pull the atoms apart),
- curvature at the bottom that sets the vibrational frequency.

A handy model is the **Morse potential**: $V(r) = D_e\left(1 - e^{-a(r-r_e)}\right)^2 - D_e$. For H₂: $D_e = 4.75$ eV, $r_e = 0.741$ Å, $a \approx 1.94$ Å⁻¹.`,
    },
    {
      kind: 'widget', title: 'A bond as a potential energy curve',
      body: 'Drag the sliders: deeper well = stronger bond; larger a = stiffer bond (higher vibrational frequency).',
      widget: { type: 'FunctionPlot', props: {
        fns: ['De*(1-exp(-a*(x-re)))^2 - De'], x: [0.2, 4], y: [-5.5, 3],
        params: [
          { name: 'De', min: 1, max: 6, value: 4.75, label: 'Dₑ (eV)' },
          { name: 'a', min: 0.8, max: 3, value: 1.94, label: 'a (1/Å)' },
          { name: 're', min: 0.5, max: 2, value: 0.741, label: 'rₑ (Å)' },
        ], xLabel: 'r (Å)', yLabel: 'E (eV)' },
        caption: 'Left: steep wall (nuclei repel, electrons squeezed). Right: flat plateau (separate atoms). The Morse form is a model; quantum chemistry computes the true curve point by point.' },
    },
    {
      kind: 'explain', title: 'Why it is hard: the curse of dimensionality',
      body: String.raw`An $N$-electron wavefunction depends on $3N$ coordinates (plus spins). Store it on a modest grid of 10 points per coordinate and you need $10^{3N}$ numbers. Benzene has 42 electrons: $10^{126}$ numbers — more than the atoms in the observable universe (~$10^{80}$).

So we approximate. The next lessons build the standard toolkit:
[Hartree–Fock](@chem/hartree-fock) (mean field), [basis sets](@chem/basis-sets), [correlated methods](@chem/post-hartree-fock) and [density functional theory](@chem/dft-intro).`,
    },
    {
      kind: 'numeric', prompt: String.raw`How many electron–electron repulsion terms $1/r_{ij}$ (with $i<j$) appear in the Hamiltonian of benzene, C₆H₆, which has 42 electrons?`,
      answer: 861, unit: 'terms',
      why: 'Each distinct pair counts once: N(N−1)/2 = 42 × 41 / 2 = 861. Pair counts grow as N², which hints at why accurate methods get expensive quickly.',
    },
    {
      kind: 'widget', title: 'Reading a PES',
      widget: { type: 'SvgDiagram', props: { svg: pes },
        caption: 'A reaction is a path from one valley to another over the lowest mountain pass. The pass (a **first-order saddle point**: a maximum along the path, a minimum in every other direction) is the transition state.' },
    },
    {
      kind: 'match', prompt: 'Match each PES feature to its chemical meaning.',
      pairs: [
        ['Minimum', 'Stable structure (reactant, product, conformer)'],
        ['First-order saddle point', 'Transition state'],
        ['Curvature at a minimum', 'Vibrational frequency'],
        ['Height of saddle above reactant', 'Activation barrier'],
      ],
      why: 'Geometry optimization finds minima, transition-state searches find saddles, and second derivatives (the Hessian) give vibrational frequencies; barrier heights feed into reaction rates via [transition-state theory](@chem/transition-state-theory).',
    },
    {
      kind: 'mcq', prompt: 'When does the Born–Oppenheimer approximation tend to break down?',
      choices: ['For very heavy nuclei like uranium', 'When two electronic states come close in energy, e.g. at conical intersections in photochemistry', 'Whenever a molecule has more than 10 atoms', 'At very low temperature'],
      answer: 1,
      why: 'BO assumes the electrons stay in one state as nuclei move. If another electronic state is nearly degenerate, small nuclear motions can switch states — the basis of ultrafast photochemistry, such as the retinal isomerization behind vision. Heavier nuclei make BO *better*, not worse.',
    },
    {
      kind: 'explain', title: 'Key takeaways',
      body: String.raw`- The molecular Hamiltonian = kinetic + attraction + repulsion terms; $1/r_{ij}$ couples electrons.
- **Born–Oppenheimer:** solve for electrons with nuclei frozen → energy $E(\mathbf R)$.
- $E(\mathbf R)$ is the **potential energy surface**: minima = structures, saddles = transition states, curvature = vibrations.
- Exact solutions scale exponentially → we need approximations, starting with [Hartree–Fock](@chem/hartree-fock).`,
    },
  ],
  references: [
    { authors: 'A. Szabo, N. S. Ostlund', title: 'Modern Quantum Chemistry: Introduction to Advanced Electronic Structure Theory', year: 1996, venue: 'Dover', detail: 'Ch. 2.1' },
    { authors: 'F. Jensen', title: 'Introduction to Computational Chemistry', year: 2017, venue: '3rd ed., Wiley', detail: 'Ch. 3.1–3.2' },
    { authors: 'M. Born, R. Oppenheimer', title: 'Zur Quantentheorie der Molekeln', year: 1927, venue: 'Annalen der Physik 389, 457–484' },
    { authors: 'P. A. M. Dirac', title: 'Quantum mechanics of many-electron systems', year: 1929, venue: 'Proc. R. Soc. Lond. A 123, 714–733' },
  ],
} satisfies LessonContent;
