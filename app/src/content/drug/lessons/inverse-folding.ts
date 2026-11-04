import type { LessonContent } from '../../types';

const graphSvg = `<svg viewBox="0 0 320 186" xmlns="http://www.w3.org/2000/svg">
<g font-size="8" text-anchor="middle">
<text x="160" y="12" fill="var(--fg)" font-weight="700">the backbone as a graph: residues are nodes, neighbours are edges</text>
<g stroke="var(--muted)" stroke-width="0.8" opacity="0.65">
<line x1="60" y1="60" x2="128" y2="42"/><line x1="60" y1="60" x2="104" y2="96"/><line x1="60" y1="60" x2="92" y2="130"/>
<line x1="128" y1="42" x2="196" y2="54"/><line x1="128" y1="42" x2="104" y2="96"/>
<line x1="104" y1="96" x2="196" y2="54"/><line x1="104" y1="96" x2="168" y2="122"/><line x1="104" y1="96" x2="92" y2="130"/>
<line x1="196" y1="54" x2="252" y2="86"/><line x1="196" y1="54" x2="168" y2="122"/>
<line x1="168" y1="122" x2="252" y2="86"/><line x1="168" y1="122" x2="92" y2="130"/>
</g>
<g>
<circle cx="60" cy="60" r="8" fill="var(--c2)" fill-opacity="0.35" stroke="var(--c2)"/>
<circle cx="128" cy="42" r="8" fill="var(--c2)" fill-opacity="0.35" stroke="var(--c2)"/>
<circle cx="104" cy="96" r="9.5" fill="var(--c1)" fill-opacity="0.5" stroke="var(--c1)" stroke-width="1.6"/>
<circle cx="196" cy="54" r="8" fill="var(--c2)" fill-opacity="0.35" stroke="var(--c2)"/>
<circle cx="252" cy="86" r="8" fill="var(--c2)" fill-opacity="0.35" stroke="var(--c2)"/>
<circle cx="168" cy="122" r="8" fill="var(--c2)" fill-opacity="0.35" stroke="var(--c2)"/>
<circle cx="92" cy="130" r="8" fill="var(--c2)" fill-opacity="0.35" stroke="var(--c2)"/>
</g>
<text x="104" y="99" fill="var(--fg)" font-size="7.5" font-weight="700">i</text>
<text x="104" y="118" fill="var(--c1)" font-size="7.5">node i, its 48 nearest</text>
<text x="104" y="128" fill="var(--c1)" font-size="7.5">neighbours in space</text>
<g font-size="7.5" text-anchor="start">
<text x="200" y="146" fill="var(--muted)">edge features: distances between</text>
<text x="200" y="156" fill="var(--muted)">N, Cα, C, O and virtual Cβ</text>
<text x="200" y="166" fill="var(--muted)">of the two residues</text>
</g>
<text x="160" y="182" fill="var(--fg)" font-weight="700">no amino-acid identities anywhere in the input</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Writing the sequence for a shape',
      body: String.raw`You have a backbone: the N, Cα and C atoms of every residue, in 3D, with no side chains and no amino-acid identities. It might come from [RFdiffusion](@drug/rfdiffusion-backbones), from a crystal structure you want to redesign, or from a hand-built model.

**Inverse folding** is the job of writing a sequence that folds into it. The name is the right way round: forward folding is sequence → structure, so this is the inverse.

The problem is far more forgiving than it first looks, because the map from sequence to structure is **many-to-one**. Two natural proteins with the same fold often share less than 20 % of their sequence. There is not *a* correct answer; there is a large set of sequences that would all work, and you need one of them. That degeneracy is what makes the problem tractable — and it also means that scoring a method by how often it reproduces the natural sequence is a slightly odd thing to do, as we will see.`,
    },
    {
      kind: 'recall',
      title: 'Graph neural networks',
      points: [
        'A graph has **nodes** with features and **edges** with features; here, residues and the geometric relationships between them.',
        'A **message-passing** layer updates each node from its neighbours, so after $L$ layers a node sees $L$ hops of context.',
        'The output is **permutation-equivariant**: renumber the nodes and the outputs are renumbered the same way.',
        'Using distances as edge features makes the network invariant to rotating and translating the whole structure.',
      ],
      link: 'ml/gnns',
    },
    {
      kind: 'explain',
      title: 'ProteinMPNN: the architecture',
      body: String.raw`**ProteinMPNN** (Dauparas et al. 2022, *Science*) is a small message-passing network — around 1.7 million parameters, three encoder and three decoder layers — and almost all of its design is in the input featurisation.

- Each residue is a **node**. Its edges go to the **48 nearest residues in space**, not in sequence, so two parts of the chain that pack against each other are neighbours in the graph even if they are 80 residues apart.
- Each edge carries the **distances between backbone atoms** of the two residues: N, Cα, C, O and a *virtual* Cβ computed from the backbone geometry, encoded through radial basis functions. The virtual Cβ gives the network a cheap handle on which direction a side chain would point.
- Only distances are used, so the representation is unchanged by rotating or translating the protein. No equivariant machinery is needed.

Crucially, the encoder sees **no amino-acid identities at all** — only geometry. That is what makes it an inverse-folding model rather than a sequence model.`,
      widget: { type: 'SvgDiagram', props: { svg: graphSvg }, caption: 'Spatial neighbours, not sequence neighbours. Everything the network knows about a position is the geometry of the backbone around it.' },
    },
    {
      kind: 'widget',
      title: 'One position, twenty probabilities',
      body: String.raw`The output at each position is a **distribution over the 20 amino acids**, not a single letter. Tap residues along the chain and watch the distribution change with burial and secondary structure: buried positions concentrate on hydrophobics, exposed positions spread over polars and charges, loops favour glycine and proline.`,
      widget: {
        type: 'DrugMpnnDesign',
        props: { position: 9, temperature: 0.1 },
        caption: 'A toy model, not ProteinMPNN itself — but the shape of the behaviour is right. Confidence is a readable signal: a sharp distribution means the geometry strongly constrains that position.',
      },
    },
    {
      kind: 'mcq',
      prompt: 'What does an inverse-folding model output at each backbone position?',
      choices: [
        'A single amino acid, chosen deterministically from the local geometry',
        'A probability distribution over the 20 amino acids, from which sequences are sampled',
        'A set of 3D coordinates for the side-chain atoms',
        'A predicted folding free energy in kcal/mol',
      ],
      answer: 1,
      why: 'A distribution is the right output because many sequences fold to the same backbone — a deterministic letter would throw that degeneracy away and give you exactly one design per backbone. Side-chain coordinates are what a Rosetta rotamer packer produces, and no free energy is predicted anywhere in the model.',
    },
    {
      kind: 'explain',
      title: 'Decoding in a random order',
      body: String.raw`Sequences are generated **autoregressively**: decode one position, feed the chosen residue back in, decode the next. The choice that distinguishes ProteinMPNN is that the decoding order is **random**, resampled for every design, rather than N-terminus to C-terminus.

Two payoffs:

- **Order-agnostic training makes the model usable with any subset fixed.** Want to keep a binding motif, a disulfide or an entire chain of a complex as it is? Decode those positions "first" by putting them at the front of the order, and every remaining position is then conditioned on them. No retraining, no masking hacks — one model handles fixed residues, symmetric designs (tie positions together) and multi-chain complexes.
- **Diversity.** Different orders explore different parts of the sequence space compatible with the backbone.

A **sampling temperature** $T$ rescales the logits before the softmax, $p_i \propto \exp(z_i/T)$. Low $T$ (0.1 is typical) gives near-greedy, confident, low-diversity sequences; higher $T$ gives more varied designs that pass downstream filters less often. Generating 8 sequences at $T = 0.1$ and filtering is a common recipe.`,
    },
    {
      kind: 'widget',
      title: 'Temperature and decode order',
      body: String.raw`Raise the temperature and watch a sharp distribution flatten into a spread one. Then switch on the decode order: the numbers show one random order, the kind resampled for every design. Any position you choose to fix simply goes first.`,
      widget: {
        type: 'DrugMpnnDesign',
        props: { position: 9, temperature: 0.6, showOrder: true },
        caption: 'Temperature is a diversity dial, not an accuracy dial. Designs sampled hot are more varied and fail the AlphaFold2 self-consistency filter more often.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`At one position only two amino acids have appreciable logits: $z_A = 3.0$ and $z_B = 1.0$. With sampling temperature $T = 0.5$, what probability does the softmax $p_i \propto \exp(z_i/T)$ assign to A? Give it to three decimal places.`,
      answer: 0.982,
      tolerance: 0.006,
      why: String.raw`Dividing by $T$ doubles the gap: $z_A/T = 6$, $z_B/T = 2$, so $p_A = e^{6}/(e^{6}+e^{2}) = e^{4}/(e^{4}+1) = 54.6/55.6 = 0.982$. At $T = 1$ the same logits give $e^2/(e^2+1) = 0.881$. Lowering the temperature sharpens an existing preference; it never changes which residue is preferred.`,
    },
    {
      kind: 'explain',
      title: 'Sequence recovery, and why it is a strange metric',
      body: String.raw`The headline number in the ProteinMPNN paper is **sequence recovery**: take a native backbone from the PDB, redesign it, and count how often the model picks the residue nature picked. ProteinMPNN reached **52.4 %** on their test set, against **32.9 %** for Rosetta fixed-backbone design on the same backbones. Roughly a one-second run per design on a GPU, versus minutes for the Rosetta packer.

That is a real and large gap. But think about what 52 % means. Nearly half the positions differ from the natural sequence — and that is *not* half-wrong, because many sequences fold to the same backbone. A model that recovered 100 % would be reproducing one arbitrary member of a large set, including whatever evolutionary baggage, binding partners and regulation that particular protein carries.

Recovery is a **proxy**: cheap, computable without any structure prediction, and correlated with design quality across methods. It is not the objective. The objective is whether the sequence folds, which is assessed by folding it, and ultimately whether the protein works, which is assessed in a lab.`,
    },
    {
      kind: 'truefalse',
      prompt: 'A sequence-recovery rate of 52 % means the model gets roughly half of its amino-acid choices wrong.',
      answer: false,
      why: 'It means half the positions differ from one particular natural sequence. Since many sequences fold to the same backbone, a different choice is often an equally good or better one — the model routinely proposes a residue that improves stability over the native. Recovery is a convenient proxy, not a measure of correctness.',
    },
    {
      kind: 'explain',
      title: 'The trick that made it transfer: training on noisy backbones',
      body: String.raw`ProteinMPNN was trained on experimentally determined structures from the PDB. The backbones it is used on are usually *not* experimentally determined — they are generated by RFdiffusion or predicted by AlphaFold2, and they carry small, systematic geometric imperfections. A model trained only on crystal-quality coordinates can latch onto exactly those details and break.

The fix in the paper is deliberately simple: add **Gaussian noise to the backbone coordinates during training**, at levels around 0.02 to 0.3 Å. The network learns to read the shape rather than the sub-ångström detail. Noised training costs a little sequence recovery and buys a large amount of robustness on designed and predicted backbones.

This is a general lesson worth keeping. If a model will be used downstream of another model's output, train it on inputs that look like that output — not on the clean data you happen to have.`,
    },
    {
      kind: 'explain',
      title: 'What was actually demonstrated in the lab',
      body: String.raw`The Dauparas et al. paper is unusual among machine-learning papers in how much wet-lab work it reports, and the most convincing result is a **rescue** experiment. Protein backbones for which Rosetta-designed sequences had previously **failed** — not expressing, or expressing as insoluble aggregates — were redesigned with ProteinMPNN. Many of the redesigned sequences expressed as soluble, monomeric, folded protein, and structures were solved for designs across several categories including monomers, cyclic oligomers and self-assembling nanoparticles.

That is the right kind of evidence: same backbones, same experimental pipeline, only the sequence-design step changed.

Related models worth knowing:

- **ESM-IF1** (Hsu et al. 2022) attacks the data shortage differently, training on around 12 million **AlphaFold2-predicted** structures for UniRef50 sequences, and reaches comparable native-sequence recovery.
- **LigandMPNN** (Dauparas et al. 2025) extends the graph to non-protein atoms — small molecules, nucleotides, metals — so that positions lining a ligand site are designed in the presence of the ligand, which plain ProteinMPNN cannot see.

Even so, the honest framing is unchanged: inverse folding reliably produces sequences a structure predictor agrees with. Whether the protein does its job is still decided downstream.`,
    },
    {
      kind: 'multi',
      prompt: 'Which claims about ProteinMPNN are accurate? (Select all.)',
      choices: [
        'Its encoder sees backbone geometry only, with no amino-acid identities as input',
        'Decoding in a random order lets arbitrary subsets of residues be fixed without retraining',
        'Training with small Gaussian noise on backbone coordinates improves robustness to designed and predicted backbones',
        'It predicts the folding free energy of each candidate sequence',
        'It redesigned backbones whose Rosetta-designed sequences had failed to express, and many of the redesigns expressed as soluble protein',
      ],
      answers: [0, 1, 2, 4],
      why: 'Geometry-only input, order-agnostic decoding, noised training and the rescue experiment are all core to the paper. No free energy is computed anywhere — the model emits per-position probabilities, and any energetic interpretation has to come from a separate method.',
    },
    {
      kind: 'order',
      prompt: 'Order the steps of designing and validating sequences for one generated backbone.',
      steps: [
        'Decide which positions, if any, must be held fixed',
        'Sample several sequences from the inverse-folding model at low temperature',
        'Fold each sequence with AlphaFold2 or ESMFold',
        'Keep sequences whose prediction matches the input backbone within about 2 Å',
        'Order synthetic genes for the survivors and express them',
        'Measure folding, stability or binding on the purified protein',
      ],
      why: 'Fixing residues is part of specifying the design problem, so it comes first; sampling several sequences per backbone is standard because the filter is cheap and the pass rate is well below one. Everything after the self-consistency filter costs weeks and real money, which is why the filter exists.',
    },
    {
      kind: 'match',
      prompt: 'Match each method to what distinguishes it.',
      pairs: [
        ['Rosetta fixed-backbone design', 'Simulated annealing over a rotamer library under a physical energy'],
        ['ProteinMPNN', 'Message passing on backbone distances, random-order autoregressive decoding'],
        ['ESM-IF1', 'Trained on millions of AlphaFold2-predicted structures to escape the PDB data limit'],
        ['LigandMPNN', 'Adds small molecules, nucleotides and metals to the graph'],
        ['AlphaFold2 in this pipeline', 'The check, not the designer: folds the sequence back to test it'],
      ],
      why: 'The first is physics-based and slow, the next three are learned and fast, and the last is not a design method at all — mixing it up with one is how people end up believing a self-consistency score is an experiment.',
    },
    {
      kind: 'fill',
      prompt: 'ProteinMPNN encodes a backbone as a graph of ___ between backbone atoms of spatially neighbouring residues, decodes amino acids in a ___ order so any subset can be held fixed, and reported about 52 % sequence ___ against about 33 % for Rosetta. Training with added coordinate ___ is what makes it work on generated backbones.',
      bank: ['distances', 'random', 'recovery', 'noise', 'torsions', 'sequential'],
      answer: ['distances', 'random', 'recovery', 'noise'],
      why: 'Distances give rotation and translation invariance for free; random decoding order gives conditional design for free; recovery is the headline proxy metric; and noised training is the small detail that lets a PDB-trained model read imperfect, model-generated backbones.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Inverse folding** writes a sequence for a given backbone. The sequence-to-structure map is **many-to-one**, so there are many right answers.
- **ProteinMPNN** (Dauparas et al. 2022) is a small message-passing network over a graph of each residue's 48 nearest neighbours, with **backbone interatomic distances** as edge features and **no amino-acid identities** in the encoder.
- Decoding is **autoregressive in a random order**, which is what lets arbitrary residues, chains or symmetric copies be fixed with one model. **Temperature** controls diversity.
- It recovers about **52 %** of native residues versus about **33 %** for Rosetta fixed-backbone design, in roughly a second per design. Recovery is a **proxy** — half the positions differing is expected, not an error rate.
- **Training with small Gaussian noise on backbone coordinates** is the detail that makes it robust on designed and predicted backbones.
- The strongest experimental evidence is the **rescue** of backbones whose Rosetta sequences had failed to express. Related models: **ESM-IF1** (trained on predicted structures) and **LigandMPNN** (ligand-aware).`,
    },
  ],
  references: [
    { authors: 'Dauparas, J., Anishchenko, I., Bennett, N., et al.', title: 'Robust deep learning–based protein sequence design using ProteinMPNN', year: 2022, venue: 'Science 378, 49–56' },
    { authors: 'Hsu, C., Verkuil, R., Liu, J., et al.', title: 'Learning inverse folding from millions of predicted structures', year: 2022, venue: 'Proc. ICML 2022, PMLR 162, 8946–8970' },
    { authors: 'Dauparas, J., Lee, G. R., Pecoraro, R., et al.', title: 'Atomic context-conditioned protein sequence design using LigandMPNN', year: 2025, venue: 'Nat. Methods 22, 717–723' },
    { authors: 'Ingraham, J., Garg, V. K., Barzilay, R., Jaakkola, T.', title: 'Generative models for graph-based protein design', year: 2019, venue: 'Proc. NeurIPS 32' },
    { authors: 'Watson, J. L., Juergens, D., Bennett, N. R., et al.', title: 'De novo design of protein structure and function with RFdiffusion', year: 2023, venue: 'Nature 620, 1089–1100' },
  ],
} satisfies LessonContent;
