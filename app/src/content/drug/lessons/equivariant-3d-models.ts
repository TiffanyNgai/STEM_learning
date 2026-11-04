import type { LessonContent } from '../../types';

const rotSvg = `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
<text x="160" y="13" font-size="9" fill="var(--muted)" text-anchor="middle">turn the molecule: the energy must not move, the force must</text>
<g transform="translate(90,95)">
<g>
<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="9s" repeatCount="indefinite"/>
<line x1="0" y1="0" x2="-34" y2="20" stroke="var(--muted)" stroke-width="1.6"/>
<line x1="0" y1="0" x2="34" y2="20" stroke="var(--muted)" stroke-width="1.6"/>
<line x1="0" y1="0" x2="0" y2="-38" stroke="var(--c3)" stroke-width="2"/>
<path d="M0,-38 L-3.4,-30 L3.4,-30 z" fill="var(--c3)"/>
<circle cx="0" cy="0" r="10" fill="var(--surface)" stroke="var(--c5)" stroke-width="1.4"/>
<circle cx="-34" cy="20" r="8" fill="var(--surface)" stroke="var(--fg)" stroke-width="1"/>
<circle cx="34" cy="20" r="8" fill="var(--surface)" stroke="var(--fg)" stroke-width="1"/>
<text x="0" y="3" font-size="9" fill="var(--c5)" text-anchor="middle">O</text>
<text x="-34" y="23" font-size="8" fill="var(--fg)" text-anchor="middle">H</text>
<text x="34" y="23" font-size="8" fill="var(--fg)" text-anchor="middle">H</text>
</g>
</g>
<g font-size="9.5" fill="var(--fg)">
<rect x="178" y="42" width="136" height="38" rx="5" fill="var(--c1)" fill-opacity="0.18" stroke="var(--c1)"/>
<text x="186" y="58">energy E = −76.42</text>
<text x="186" y="72" font-size="8" fill="var(--muted)">invariant: same number always</text>
<rect x="178" y="94" width="136" height="38" rx="5" fill="var(--c3)" fill-opacity="0.18" stroke="var(--c3)"/>
<text x="186" y="110">force on O (arrow)</text>
<text x="186" y="124" font-size="8" fill="var(--muted)">equivariant: turns with the molecule</text>
</g>
<text x="160" y="166" font-size="8.5" fill="var(--muted)" text-anchor="middle">A model that gets this wrong can give two answers for one molecule.</text>
</svg>`;

const angleSvg = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
<text x="160" y="13" font-size="9" fill="var(--muted)" text-anchor="middle">same two bond lengths, different angle → different energy</text>
<g stroke="var(--muted)" stroke-width="1.6" fill="none">
<path d="M29,94 L80,58 L131,94"/>
<path d="M180,74 L240,58 L300,74"/>
</g>
<path d="M58.8,73.1 A26,26 0 0 0 101.2,73.1" fill="none" stroke="var(--c3)" stroke-width="1.3"/>
<path d="M215,64.7 A26,26 0 0 0 265,64.7" fill="none" stroke="var(--c3)" stroke-width="1.3"/>
<text x="80" y="98" font-size="9" fill="var(--c3)" text-anchor="middle">109°</text>
<text x="240" y="98" font-size="9" fill="var(--c3)" text-anchor="middle">150°</text>
<g fill="var(--surface)" stroke="var(--fg)" stroke-width="1">
<circle cx="29" cy="94" r="8"/><circle cx="80" cy="58" r="8"/><circle cx="131" cy="94" r="8"/>
<circle cx="180" cy="74" r="8"/><circle cx="240" cy="58" r="8"/><circle cx="300" cy="74" r="8"/>
</g>
<text x="160" y="134" font-size="8.5" fill="var(--muted)" text-anchor="middle">Distances alone (1.1 Å and 1.1 Å) cannot tell these apart — angles can.</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'When the graph is not enough',
      body: String.raw`A molecular graph says which atoms are bonded. It does not say where they are.

For some questions that is fatal:
- **Energies and forces.** A twisted amide and a planar one are the same graph with very different energies.
- **Protein–ligand complexes.** Scoring a pose is entirely a question of geometry.
- **Conformer-dependent properties** — internal hydrogen bonds, shape-driven permeability, quantum observables.

So we feed the model 3D coordinates. Immediately a new problem appears: coordinates are written in *some* arbitrary frame, and the chemistry is not.`,
    },
    {
      kind: 'recall',
      title: 'Conformers (earlier in this subject)',
      points: [
        'A **conformer** is one 3D arrangement reachable by rotating single bonds.',
        'A drug-like molecule has many conformers within a few kcal/mol of each other.',
        'The **bioactive conformer** — the one bound to the protein — need not be the lowest-energy one in solution.',
        'Conformer generation (e.g. ETKDG + minimisation) is a separate, imperfect step before any 3D model.',
      ],
      link: 'drug/conformers-3d',
    },
    {
      kind: 'explain',
      title: 'Invariant or equivariant?',
      body: String.raw`Translate the molecule a metre to the left and rotate it: nothing chemical has changed. A model must respect that, and there are two different ways a quantity can respect it.

A prediction $f$ is **invariant** if $f(R\mathbf{x} + \mathbf{t}) = f(\mathbf{x})$ — rotating the input leaves the output untouched. Energy, logP, pIC50: all invariant scalars.

It is **equivariant** if $f(R\mathbf{x} + \mathbf{t}) = R\,f(\mathbf{x})$ — the output transforms the same way the input did. Forces, dipole moments and predicted coordinates are vectors: rotate the molecule and they must rotate with it.

The symmetry group here is **E(3)**: rotations, reflections and translations of 3D space. (Drop reflections and you have SE(3) — which you want when chirality matters, since a mirror image is a different drug.)`,
      widget: { type: 'SvgDiagram', props: { svg: rotSvg }, caption: 'Invariance and equivariance are not alternatives — one model usually needs both at once: an invariant energy whose gradient gives equivariant forces.' },
    },
    {
      kind: 'recall',
      title: 'Equivariant networks (from ML)',
      points: [
        'Building the symmetry into the architecture beats hoping the model learns it from data.',
        'The alternative, **data augmentation** with random rotations, costs data and only ever gives approximate symmetry.',
        'Equivariant layers compose: a stack of equivariant layers is equivariant.',
        'An invariant output is obtained by ending an equivariant stack with an invariant readout.',
      ],
      link: 'ml/equivariant-networks',
    },
    {
      kind: 'mcq',
      prompt: 'A network predicts the dipole moment vector of a molecule. What should happen when the input coordinates are rotated by $R$?',
      choices: [
        'The predicted vector is unchanged (invariance)',
        'The predicted vector is multiplied by $R$ (equivariance)',
        'The predicted vector is multiplied by $R^{-1}$',
        'Nothing is required — rotation is handled by normalising the coordinates',
      ],
      answer: 1,
      why: 'A dipole is a physical vector living in the same space as the coordinates, so it must rotate with them: $\\mu(R\\mathbf{x}) = R\\,\\mu(\\mathbf{x})$. Leaving it unchanged would mean the molecule\'s dipole points in a different direction relative to its own atoms after you turn it around.',
    },
    {
      kind: 'explain',
      title: 'Route 1: build from invariant quantities',
      body: String.raw`The simplest way to guarantee invariance is to never let raw coordinates into the network — only quantities that are already invariant.

**Interatomic distances** $r_{ij} = \lVert \mathbf{x}_i - \mathbf{x}_j \rVert$ are the obvious choice. **SchNet** (Schütt et al. 2017, 2018) does exactly this: it is message passing on a graph built from spatial neighbours within a cutoff, where the "filter" applied to each neighbour is produced by a small network taking $r_{ij}$ — expanded first in a basis of Gaussians — as its only geometric input. Because distance is continuous, so is the filter ("continuous-filter convolution"), and the energy is a smooth function of geometry, which is essential if you want to differentiate it.

Forces then come free and exactly: $\mathbf{F}_i = -\partial E/\partial \mathbf{x}_i$, computed by backpropagating through the network. An invariant energy differentiated with respect to coordinates automatically yields equivariant forces.`,
    },
    {
      kind: 'numeric',
      prompt: 'A model predicts the energy of a 25-atom conformer and its forces. How many numbers are in the force output?',
      answer: 75,
      why: 'One force vector per atom, three Cartesian components each: $25 \\times 3 = 75$. The energy itself is a single invariant number; answering 25 forgets that a force is a vector.',
    },
    {
      kind: 'explain',
      title: 'Distances are not quite enough',
      body: String.raw`A model that sees only the distances to each neighbour, one at a time, is blind to how those neighbours are arranged *around* the central atom. Two geometries with the same bond lengths but different bond angles can look identical to it.

**DimeNet** (Klicpera et al., ICLR 2020) fixes this with **directional message passing**: messages live on directed atom pairs, and when messages are combined at an atom the network is given the **angle** between the incoming and outgoing directions, expanded in spherical Bessel functions and spherical harmonics. Angles are still invariant under rotation, so invariance survives — the model just sees more of the geometry.`,
      widget: { type: 'SvgDiagram', props: { svg: angleSvg }, caption: 'The gap that angles close. Adding angular information was worth a large accuracy gain on QM9 and on force prediction.' },
    },
    {
      kind: 'truefalse',
      prompt: 'Because bond angles change when a molecule is rotated, a model that uses angles cannot be rotation-invariant.',
      answer: false,
      why: 'Angles between bonds are *internal* geometry: rotating the whole molecule leaves every interatomic distance and every angle unchanged. That is precisely why distances and angles are safe inputs for an invariant model.',
    },
    {
      kind: 'explain',
      title: 'Route 2: carry vectors through the network',
      body: String.raw`Invariant features throw information away: a scalar cannot remember *which direction* a neighbour lay in. The alternative is to let hidden features themselves be geometric objects that rotate.

- **EGNN** (Satorras, Hoogeboom & Welling, ICML 2021) is the minimal version. Messages are computed from invariant quantities (features plus $\lVert\mathbf{x}_i - \mathbf{x}_j\rVert^2$), and coordinates are updated by a weighted sum of relative position vectors, $\mathbf{x}_i \leftarrow \mathbf{x}_i + \sum_j (\mathbf{x}_i - \mathbf{x}_j)\,\phi(m_{ij})$. Since each term is a vector that rotates with the molecule and the weights are invariant, the update is equivariant — with no spherical harmonics anywhere.
- **PaiNN** (Schütt, Unke & Gastegger, ICML 2021) gives every atom both scalar and **vector** features and mixes them with operations that preserve equivariance, which makes tensorial properties and spectra predictable.
- **NequIP** (Batzner et al., Nat. Commun. 2022) goes further: features are decomposed into rotational orders ($l = 0$ scalars, $l = 1$ vectors, $l = 2$ and higher), combined with tensor products and Clebsch–Gordan coefficients. Expensive per layer, extraordinarily data-efficient — the paper reports accuracy from as few as hundreds of reference structures, where earlier models needed orders of magnitude more.`,
    },
    {
      kind: 'match',
      prompt: 'Match each model to its defining idea.',
      pairs: [
        ['SchNet', 'Continuous filters generated from interatomic distances'],
        ['DimeNet', 'Messages on directed pairs that also see bond angles'],
        ['EGNN', 'Coordinate updates from weighted relative position vectors'],
        ['NequIP', 'Features of higher rotational order combined with tensor products'],
      ],
      why: 'The four sit on a ladder of geometric expressiveness — distances, then angles, then vectors, then general tensors — trading cost and complexity for accuracy and data efficiency.',
    },
    {
      kind: 'explain',
      title: 'What this is actually used for: ML potentials',
      body: String.raw`The biggest payoff is not property prediction — it is replacing quantum chemistry inside a simulation.

A **machine-learned interatomic potential** (MLIP) is trained on energies and forces from [DFT](@chem/dft-intro) calculations, then used as the energy function for [molecular dynamics](@drug/molecular-dynamics). You get something close to DFT accuracy at a cost that scales roughly linearly with the number of atoms, and is orders of magnitude faster, so trajectories of nanoseconds instead of picoseconds become possible.

For drug discovery that means: better conformer energies and torsion profiles than a classical [force field](@drug/force-fields), QM-quality strain estimates for bound ligands, and more reliable relative energies in [free-energy calculations](@drug/free-energy-methods).

The catch is the old one: an MLIP is only trustworthy on chemistry resembling its training set. Push it into an unseen bonding environment and the simulation can fail quietly, or spectacularly.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about 3D models in drug discovery are true?',
      choices: [
        'They need a conformer as input, so conformer generation becomes part of the pipeline',
        'They typically beat 2D graph models on bioactivity datasets where the bound conformation is unknown',
        'An invariant energy differentiated with respect to atomic coordinates gives equivariant forces',
        'Dropping reflections from the symmetry group (SE(3) rather than E(3)) matters when enantiomers differ in activity',
      ],
      answers: [0, 2, 3],
      why: 'Conformer dependence, the energy–force relationship and chirality are all real. The claimed superiority on bioactivity data is not: when the bioactive conformation is unknown, the 3D input is a guess, and 2D models often match or beat 3D ones on such benchmarks.',
    },
    {
      kind: 'order',
      prompt: 'Order the steps of running an ML interatomic potential.',
      steps: [
        'Generate reference structures spanning the chemistry of interest',
        'Compute energies and forces for them with DFT',
        'Train an equivariant network to reproduce those energies and forces',
        'Run molecular dynamics using the network as the energy function',
        'Check for structures the model is uncertain about and add them to the training set',
      ],
      why: 'The final step is active learning: an MLIP extrapolating outside its training distribution is the main failure mode, so new configurations found during simulation are fed back as fresh reference calculations.',
    },
    {
      kind: 'fill',
      prompt: 'A quantity unchanged by rotation is ___; one that rotates with the molecule is ___. SchNet achieves the first by using only interatomic ___ as geometric input.',
      bank: ['invariant', 'equivariant', 'distances', 'angles', 'degenerate'],
      answer: ['invariant', 'equivariant', 'distances'],
      why: 'Energy is invariant, forces are equivariant, and distances are the simplest invariant function of coordinates — which is exactly why SchNet is built on them.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- 3D coordinates are written in an arbitrary frame; models must respect **E(3)** (or **SE(3)** when chirality matters).
- **Invariant** = output unchanged by rotation (energy); **equivariant** = output rotates with the input (forces, dipoles, coordinates).
- **Route 1** uses invariant inputs: distances (**SchNet**), then also angles (**DimeNet**). Forces come from $-\partial E/\partial\mathbf{x}$.
- **Route 2** carries geometric features: relative-vector updates (**EGNN**), scalar+vector features (**PaiNN**), higher-order tensors (**NequIP**, very data-efficient).
- The killer application is **ML interatomic potentials**: near-DFT energies and forces fast enough for MD — reliable only inside their training distribution.
- For ligand activity, a 3D model is only as good as the conformer you feed it.`,
    },
  ],
  references: [
    { authors: 'Schütt, K. T., Sauceda, H. E., Kindermans, P.-J., Tkatchenko, A., Müller, K.-R.', title: 'SchNet – a deep learning architecture for molecules and materials', year: 2018, venue: 'J. Chem. Phys. 148, 241722' },
    { authors: 'Klicpera, J., Groß, J., Günnemann, S.', title: 'Directional message passing for molecular graphs (DimeNet)', year: 2020, venue: 'Proc. ICLR 2020' },
    { authors: 'Satorras, V. G., Hoogeboom, E., Welling, M.', title: 'E(n) equivariant graph neural networks', year: 2021, venue: 'Proc. ICML (PMLR 139)' },
    { authors: 'Schütt, K. T., Unke, O. T., Gastegger, M.', title: 'Equivariant message passing for the prediction of tensorial properties and molecular spectra (PaiNN)', year: 2021, venue: 'Proc. ICML (PMLR 139)' },
    { authors: 'Batzner, S., Musaelian, A., Sun, L., et al.', title: 'E(3)-equivariant graph neural networks for data-efficient and accurate interatomic potentials', year: 2022, venue: 'Nat. Commun. 13, 2453' },
  ],
} satisfies LessonContent;
