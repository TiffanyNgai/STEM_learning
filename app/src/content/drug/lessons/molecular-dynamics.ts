import type { LessonContent } from '../../types';

const timescaleSvg = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
<g font-size="9">
<line x1="10" y1="40" x2="310" y2="40" stroke="var(--fg)" stroke-width="1.5"/>
${['fs', 'ps', 'ns', 'µs', 'ms', 's'].map((u, i) => `<line x1="${20 + i * 56}" y1="36" x2="${20 + i * 56}" y2="44" stroke="var(--fg)"/><text x="${20 + i * 56}" y="30" text-anchor="middle" fill="var(--fg)" font-weight="700">${u}</text>`).join('')}
<text x="20" y="58" text-anchor="middle" fill="var(--muted)">bond vibration</text>
<text x="76" y="72" text-anchor="middle" fill="var(--muted)">side-chain flips</text>
<text x="132" y="58" text-anchor="middle" fill="var(--muted)">loop motions</text>
<text x="188" y="72" text-anchor="middle" fill="var(--muted)">ligand unbinding,</text>
<text x="188" y="82" text-anchor="middle" fill="var(--muted)">small-protein folding</text>
<text x="244" y="58" text-anchor="middle" fill="var(--muted)">large conformational</text>
<text x="244" y="68" text-anchor="middle" fill="var(--muted)">changes</text>
<rect x="20" y="100" width="0" height="14" rx="4" fill="var(--c2)"><animate attributeName="width" from="0" to="172" dur="2s" fill="freeze"/></rect>
<text x="24" y="111" fill="var(--fg)" font-weight="700">routine MD (GPU, days)</text>
<rect x="20" y="120" width="0" height="14" rx="4" fill="var(--c4)"><animate attributeName="width" from="0" to="228" dur="2.5s" fill="freeze"/></rect>
<text x="24" y="131" fill="var(--fg)" font-weight="700">special-purpose hardware (Anton)</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A movie, not a photograph',
      body: String.raw`A crystal structure is a **photograph**: one frozen, averaged snapshot. Real proteins breathe, loops flap, pockets open and close, and ligands wiggle. **Molecular dynamics (MD)** makes the **movie**: it computes the forces on every atom and moves the atoms according to Newton's laws, femtosecond by femtosecond.

From the movie we can see flexibility, hidden ("cryptic") pockets, water networks and how a ligand pose holds up — and, with statistical mechanics, compute thermodynamic quantities like binding free energies.`,
    },
    {
      kind: 'recall',
      title: 'Force fields (previous lesson)',
      points: [
        'A **force field** gives the potential energy $U(\\mathbf r)$ of all atomic positions as a sum of simple terms.',
        'Bonded terms: bond stretching and angle bending (springs) and torsions (periodic).',
        'Non-bonded: Lennard-Jones (repulsion + dispersion) and Coulomb electrostatics.',
        'Force on atom $i$: $\\mathbf F_i = -\\nabla_i U$.',
      ],
      link: 'drug/force-fields',
    },
    {
      kind: 'explain',
      title: 'Newton on a computer',
      body: String.raw`For each atom $i$ with mass $m_i$: $m_i\,\ddot{\mathbf r}_i = \mathbf F_i = -\nabla_i U$. We can't solve this exactly for thousands of interacting atoms, so we step forward in small time increments $\Delta t$.

The standard integrator is **velocity Verlet** (Verlet 1967; Swope et al. 1982):

$$\mathbf v \leftarrow \mathbf v + \tfrac{\Delta t}{2m}\mathbf F,\quad \mathbf r \leftarrow \mathbf r + \Delta t\,\mathbf v,\quad \text{recompute }\mathbf F,\quad \mathbf v \leftarrow \mathbf v + \tfrac{\Delta t}{2m}\mathbf F.$$

It is time-reversible and **symplectic**, so total energy doesn't drift systematically over long runs — unlike the naive Euler method.`,
    },
    {
      kind: 'widget',
      title: 'Run a simulation',
      body: 'Thirty Lennard-Jones atoms in a periodic box (atoms leaving one side re-enter on the other). With the thermostat OFF, watch kinetic and potential energy trade off while the total stays flat. Then push Δt up and watch the total start to drift.',
      widget: { type: 'LJMolecularDynamics', props: { temperature: 0.8 }, caption: 'Reduced units (σ = ε = m = 1). Colour = speed. ΔE_total in red means energy is not being conserved: the time step is too large.' },
    },
    {
      kind: 'mcq',
      prompt: 'In an NVE simulation with a good integrator and small Δt, which quantity should stay (nearly) constant?',
      choices: ['Kinetic energy', 'Potential energy', 'Total energy', 'Temperature'],
      answer: 2,
      why: 'In the microcanonical (NVE) ensemble the total energy is conserved; kinetic and potential energy constantly exchange, so temperature (∝ kinetic energy) fluctuates. A drifting total signals too large a time step or a bug.',
    },
    {
      kind: 'explain',
      title: 'Choosing the time step',
      body: String.raw`$\Delta t$ must be much shorter than the fastest motion in the system. Bonds to hydrogen vibrate with periods of ~10 fs, so atomistic MD typically uses **$\Delta t = 1$–2 fs** (2 fs when bonds to H are constrained, e.g. with SHAKE; up to ~4 fs with hydrogen mass repartitioning).

That's a brutal constraint: **1 µs of simulation = 500 million steps**, each requiring force evaluation for every atom (tens of thousands of atoms, with water). This is why sampling is the central problem of MD.`,
    },
    {
      kind: 'numeric',
      prompt: 'With a 2 fs time step, how many integration steps are needed to simulate 100 ns? (1 ns = 10⁶ fs)',
      answer: 50000000,
      tolerance: 1,
      why: '100 ns = 10⁸ fs; divided by 2 fs per step = 5 × 10⁷ = 50 million steps. On a modern GPU a ~50,000-atom system reaches roughly hundreds of ns per day, so this is a day-ish of compute.',
    },
    {
      kind: 'recall',
      title: 'The Boltzmann distribution (from Physics)',
      points: [
        'At equilibrium at temperature $T$, the probability of a configuration with energy $E$ is $\\propto e^{-E/k_BT}$.',
        'Temperature sets the average kinetic energy: $\\tfrac12 k_BT$ per degree of freedom.',
        'Free energies come from **populations**, so we need good sampling of all relevant states.',
      ],
      link: 'physics/boltzmann-distribution',
    },
    {
      kind: 'explain',
      title: 'Ensembles and thermostats',
      body: String.raw`Plain Newtonian dynamics conserves energy: the **NVE** (microcanonical) ensemble. Experiments, however, happen at constant temperature (and pressure). A **thermostat** gently adds or removes kinetic energy so the system samples the **NVT** (canonical, Boltzmann) ensemble; a **barostat** adjusts the box volume for **NPT**.

- **Berendsen** (1984): rescales velocities toward the target $T$ — fast to equilibrate, but does *not* produce the exact canonical distribution.
- **Bussi–Donadio–Parrinello** velocity rescaling (2007), **Nosé–Hoover** and **Langevin** dynamics do sample it correctly.

Try the thermostat toggle in the widget: with it ON, temperature relaxes to the target and total energy is no longer conserved.`,
    },
    {
      kind: 'match',
      prompt: 'Match the ensemble with what is held fixed.',
      pairs: [
        ['NVE', 'Number of particles, volume, total energy'],
        ['NVT', 'Number of particles, volume, temperature'],
        ['NPT', 'Number of particles, pressure, temperature'],
      ],
      why: 'Production MD for drug discovery is usually NPT (like a test tube at room pressure), after equilibration; NVE is useful to check integrator quality.',
    },
    {
      kind: 'truefalse',
      prompt: 'The Berendsen thermostat is a good way to equilibrate quickly, but it does not generate a correct canonical (NVT) distribution of kinetic energies.',
      answer: true,
      why: 'Berendsen suppresses kinetic-energy fluctuations. Use it for equilibration, then switch to a thermostat that samples the canonical ensemble (Bussi velocity rescaling, Nosé–Hoover or Langevin) for production.',
    },
    {
      kind: 'explain',
      title: 'What MD does for drug discovery',
      body: String.raw`- **Pose stability**: does a docked pose stay put over 100 ns, or drift away?
- **Flexibility & cryptic pockets**: find pocket shapes absent from the crystal structure.
- **Ensemble docking**: dock into several MD snapshots to account for protein motion.
- **Free energies**: FEP/TI run MD along alchemical paths to compute relative binding affinities (FEP+; Wang et al. 2015).
- **Kinetics & mechanism**: long simulations on special hardware (Anton; Shaw et al. 2010) have watched ligands bind and proteins fold.

The catch is **timescales**: many biologically important events take µs–ms or longer — hence [enhanced sampling](@drug/enhanced-sampling) and Markov state models.`,
      widget: { type: 'SvgDiagram', props: { svg: timescaleSvg }, caption: 'Biological motions span 15 orders of magnitude in time; routine MD reaches about microseconds.' },
    },
    {
      kind: 'multi',
      prompt: 'Which are legitimate uses of MD in a drug-discovery project?',
      choices: ['Checking whether a docked pose is stable', 'Revealing cryptic pockets', 'Computing relative binding free energies via FEP', 'Routinely simulating a full drug–target binding/unbinding cycle of seconds for every compound'],
      answers: [0, 1, 2],
      why: 'Residence times of seconds to hours are far beyond routine MD (microseconds). Such events need enhanced sampling or Markov state models — and even then remain challenging.',
    },
    {
      kind: 'order',
      prompt: 'Order a typical protein–ligand MD setup.',
      steps: ['Prepare complex (protonate, assign force field)', 'Solvate in a water box and add ions', 'Energy-minimise to remove clashes', 'Equilibrate (NVT, then NPT) with restraints', 'Production run', 'Analyse trajectory (RMSD, contacts, free energies)'],
      why: 'Skipping minimisation or equilibration lets bad contacts produce huge forces that make the simulation explode — the same blow-up you can trigger in the widget with a too-large Δt.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- MD integrates Newton's equations with forces from a force field; **velocity Verlet** is the standard, energy-conserving integrator.
- $\Delta t \approx$ 1–2 fs is limited by the fastest vibrations; 1 µs needs ~5 × 10⁸ steps at 2 fs.
- Thermostats/barostats give **NVT/NPT** ensembles; Berendsen equilibrates but doesn't sample correctly.
- MD reveals flexibility, pose stability and cryptic pockets and underlies **FEP**; timescale limits motivate enhanced sampling.`,
    },
  ],
  references: [
    { authors: 'Frenkel, D., Smit, B.', title: 'Understanding Molecular Simulation: From Algorithms to Applications', year: 2002, venue: '2nd ed., Academic Press', detail: 'Ch. 4, 6' },
    { authors: 'Hollingsworth, S. A., Dror, R. O.', title: 'Molecular dynamics simulation for all', year: 2018, venue: 'Neuron 99, 1129–1143' },
    { authors: 'Verlet, L.', title: 'Computer "experiments" on classical fluids. I. Thermodynamical properties of Lennard-Jones molecules', year: 1967, venue: 'Phys. Rev. 159, 98–103' },
    { authors: 'Bussi, G., Donadio, D., Parrinello, M.', title: 'Canonical sampling through velocity rescaling', year: 2007, venue: 'J. Chem. Phys. 126, 014101' },
    { authors: 'Shaw, D. E., Maragakis, P., Lindorff-Larsen, K., et al.', title: 'Atomic-level characterization of the structural dynamics of proteins', year: 2010, venue: 'Science 330, 341–346' },
  ],
} satisfies LessonContent;
