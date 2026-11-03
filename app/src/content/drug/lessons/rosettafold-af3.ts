import type { LessonContent } from '../../types';

const threeTrackSvg = `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
<g font-size="9.5" text-anchor="middle">
<rect x="10" y="14" width="300" height="30" rx="7" fill="var(--c6)" fill-opacity="0.2" stroke="var(--c6)"/>
<text x="160" y="33" fill="var(--fg)"><tspan font-weight="700">1D track</tspan> · sequence / MSA features per residue</text>
<rect x="10" y="64" width="300" height="30" rx="7" fill="var(--c3)" fill-opacity="0.2" stroke="var(--c3)"/>
<text x="160" y="83" fill="var(--fg)"><tspan font-weight="700">2D track</tspan> · residue-pair features (distances, orientations)</text>
<rect x="10" y="114" width="300" height="30" rx="7" fill="var(--c1)" fill-opacity="0.2" stroke="var(--c1)"/>
<text x="160" y="133" fill="var(--fg)"><tspan font-weight="700">3D track</tspan> · backbone coordinates (SE(3)-equivariant)</text>
${[60, 160, 260].map((x, k) => `<path d="M${x},44 L${x},64 M${x + 12},64 L${x + 12},44 M${x},94 L${x},114 M${x + 12},114 L${x + 12},94" stroke="var(--fg)" stroke-width="1"/>
<circle r="3" fill="var(--c5)"><animateMotion dur="2.4s" begin="${k * 0.8}s" repeatCount="indefinite" path="M${x},44 L${x},64 L${x},94 L${x},114"/></circle>
<circle r="3" fill="var(--c2)"><animateMotion dur="2.4s" begin="${k * 0.8 + 1.2}s" repeatCount="indefinite" path="M${x + 12},114 L${x + 12},94 L${x + 12},64 L${x + 12},44"/></circle>`).join('\n')}
<text x="160" y="156" fill="var(--muted)" font-size="8.5">information flows up and down between tracks in every block</text>
</g></svg>`;

// Ligand atoms denoise from random positions into a ring in a pocket.
const ring = Array.from({ length: 6 }, (_, k) => [160 + 22 * Math.cos((k * Math.PI) / 3), 92 + 22 * Math.sin((k * Math.PI) / 3)]);
const starts = [[40, 30], [290, 40], [70, 150], [250, 150], [160, 20], [30, 100]];
const diffusionSvg = `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg">
<path d="M70,30 C70,110 90,140 160,140 C230,140 250,110 250,30" fill="none" stroke="var(--c2)" stroke-width="10" stroke-linecap="round" opacity="0.35"/>
<text x="160" y="160" font-size="9" fill="var(--c2)" text-anchor="middle">protein pocket (also generated, not given)</text>
${ring.map(([x, y], k) => {
  const [sx, sy] = starts[k];
  const n = ring[(k + 1) % 6];
  return `<line x1="${x}" y1="${y}" x2="${n[0]}" y2="${n[1]}" stroke="var(--fg)" stroke-width="1.5" opacity="0"><animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.6;0.8;1" dur="5s" repeatCount="indefinite"/></line>
<circle r="5" fill="var(--c3)"><animate attributeName="cx" values="${sx};${(sx + x) / 2 + 18};${x};${x}" keyTimes="0;0.35;0.7;1" dur="5s" repeatCount="indefinite"/>
<animate attributeName="cy" values="${sy};${(sy + y) / 2 - 14};${y};${y}" keyTimes="0;0.35;0.7;1" dur="5s" repeatCount="indefinite"/></circle>`;
}).join('\n')}
<text x="160" y="12" font-size="9" fill="var(--muted)" text-anchor="middle">noise → denoise step by step → all-atom pose</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'After AlphaFold2: more tracks, more molecules',
      body: String.raw`AlphaFold2 predicts single protein chains. Drug discovery needs more: a protein **with its ligand**, its partner proteins, DNA or RNA, metal ions and modified residues.

Two lines of work extended the idea. **RoseTTAFold** (Baek et al. 2021, from David Baker's lab) appeared in the same month as the AlphaFold2 paper, with an architecture of its own and openly available code. In 2024 **AlphaFold3** (Abramson et al. 2024) and RoseTTAFold All-Atom moved to *all-atom* prediction of whole complexes, so-called **co-folding**: the protein and its ligand are predicted together rather than docked one into the other.`,
    },
    {
      kind: 'explain',
      title: 'RoseTTAFold: three tracks',
      body: String.raw`AlphaFold2 has two internal streams (MSA and pair). RoseTTAFold adds a third and lets all three exchange information in every block:
- a **1D track** for sequence/MSA features,
- a **2D track** for residue-pair features (distance and orientation),
- a **3D track** for backbone coordinates, processed by an SE(3)-equivariant network (rotating the input rotates the output in the same way; see [equivariant networks](@ml/equivariant-networks)).

Because 3D coordinates are refined *inside* the trunk, structural reasoning feeds back into the sequence and pair features. RoseTTAFold was slightly less accurate than AlphaFold2 on CASP14 targets but much better than earlier methods, and it could also model protein–protein complexes.`,
      widget: { type: 'SvgDiagram', props: { svg: threeTrackSvg }, caption: 'The three tracks of RoseTTAFold, with information flowing between them.' },
    },
    {
      kind: 'mcq',
      prompt: 'What does RoseTTAFold’s third track add compared with AlphaFold2’s two-representation trunk?',
      choices: [
        'Explicit 3D coordinates refined together with the sequence and pair features',
        'A database search for homologous sequences',
        'A diffusion model for ligand atoms',
        'A language model trained without MSAs',
      ],
      answer: 0,
      why: 'The 3D track keeps and updates coordinates inside the network, so geometry can inform the 1D and 2D tracks in every block. Diffusion over atoms arrived later with AlphaFold3, and the MSA search happens outside the network for both models.',
    },
    {
      kind: 'recall',
      title: 'Diffusion models (from ML)',
      points: [
        '**Forward process**: gradually add Gaussian noise to data until it is pure noise.',
        '**Reverse process**: a network learns to remove noise step by step; sampling starts from noise and denoises.',
        'Conditioning (on text, or here on protein features) steers what is generated.',
        'Sampling again from different noise gives different, plausible outputs.',
      ],
      link: 'ml/diffusion-models',
    },
    {
      kind: 'explain',
      title: 'AlphaFold3: one network for (almost) everything',
      body: String.raw`AlphaFold3 accepts proteins, DNA, RNA, small-molecule ligands, ions and modified residues. Its main changes:
- **Tokens**: one per amino acid or nucleotide, but one per **heavy atom** for ligands and modified residues.
- A much smaller MSA module, then the **Pairformer** (48 blocks) replaces the Evoformer. It works on single and pair representations; triangle updates remain.
- A **diffusion module** replaces the structure module. It denoises raw **atom coordinates** directly, with no residue frames or torsion angles, so any chemistry can be handled the same way.
- A confidence head (pLDDT, PAE, interface scores such as ipTM) rates each sample.`,
    },
    {
      kind: 'widget',
      title: 'Generating a complex by denoising',
      body: 'A cartoon of the diffusion module: atoms start as random noise and are moved, step by step, into a pose. In AlphaFold3 the protein atoms are denoised too, conditioned on the trunk’s pair representation.',
      widget: { type: 'SvgDiagram', props: { svg: diffusionSvg }, caption: 'Because generation is stochastic, AlphaFold3 draws several samples from different noise and ranks them by predicted confidence.' },
    },
    {
      kind: 'match',
      prompt: 'How does AlphaFold3 tokenise each kind of input?',
      pairs: [
        ['Standard amino acid in a protein', 'One token per residue'],
        ['Nucleotide in DNA or RNA', 'One token per nucleotide'],
        ['Small-molecule ligand', 'One token per heavy atom'],
        ['Chemically modified residue', 'Per-atom tokens, like a ligand'],
      ],
      why: 'Polymers made of standard units get one token per unit to keep sequences short; anything non-standard is broken into atoms, which lets one network handle arbitrary chemistry without a hand-written template per molecule.',
    },
    {
      kind: 'explain',
      title: 'What co-folding achieved',
      body: String.raw`On the PoseBusters benchmark of protein–ligand complexes released after its training cutoff, AlphaFold3 placed about three-quarters of ligands within 2 Å RMSD of the crystal pose. That was well above classical docking programs such as AutoDock Vina, even though the docking programs were *given* the experimental protein structure and AlphaFold3 was given only the protein sequence and the ligand's chemical identity (Abramson et al. 2024). It also improved protein–nucleic-acid and antibody–antigen predictions.

The paper also lists failure modes: stereochemistry errors (wrong chirality), atom clashes, and **hallucinated** compact structure in disordered regions. Treat a co-folded pose as a strong hypothesis, not a measurement.`,
    },
    {
      kind: 'truefalse',
      prompt: 'To predict a protein–ligand complex, AlphaFold3 must be given an experimental holo structure of the protein.',
      answer: false,
      why: 'AlphaFold3 takes the protein sequence (plus MSA and optional templates) and the ligand as SMILES or a chemical component, and generates both partners together. Classical docking is the approach that needs a prepared protein structure as input.',
    },
    {
      kind: 'explain',
      title: 'Open reproductions',
      body: String.raw`AlphaFold3 was first offered only through a web server with restrictions (for example, a fixed list of ligands). The code was released in November 2024, with the trained weights available to academics on request for non-commercial use. Open alternatives quickly appeared:
- **Boltz-1** (MIT, 2024): an open-source AlphaFold3-style model with code, weights and training pipeline under the MIT licence. **Boltz-2** (2025) adds a head that predicts binding affinity.
- **Chai-1** (Chai Discovery, 2024): can also run in single-sequence mode using protein language-model embeddings instead of an MSA, and accepts experimental restraints.
- **RoseTTAFold All-Atom** (Krishna et al. 2024), **Protenix** and **HelixFold3** are further all-atom models.

On standard benchmarks these models perform broadly similarly to AlphaFold3.`,
    },
    {
      kind: 'multi',
      prompt: 'Which models can predict a protein together with a bound small-molecule ligand?',
      choices: ['AlphaFold3', 'Boltz-1', 'Chai-1', 'RoseTTAFold All-Atom', 'The original AlphaFold2', 'ESMFold'],
      answers: [0, 1, 2, 3],
      why: 'AlphaFold2 and ESMFold predict protein chains only; a ligand has to be docked into their models afterwards. The all-atom co-folding models generate protein and ligand atoms together.',
    },
    {
      kind: 'fill',
      prompt: 'In AlphaFold3 the ___ replaces the Evoformer, and a ___ module, which denoises raw atom coordinates, replaces the frame-based structure module.',
      bank: ['Pairformer', 'diffusion', 'docking', 'recycling', 'Transformer-XL', 'threading'],
      answer: ['Pairformer', 'diffusion'],
      why: 'The Pairformer keeps the pair representation and triangle updates but drops the large MSA stack from the trunk. The diffusion module generates atom positions directly, which is how ligands and nucleic acids fit in without residue frames.',
    },
    {
      kind: 'order',
      prompt: 'Put these milestones in chronological order.',
      steps: [
        'AlphaFold (v1) tops CASP13 using predicted distance maps',
        'AlphaFold2 reaches near-experimental accuracy at CASP14',
        'RoseTTAFold and the AlphaFold2 paper and code are published',
        'The AlphaFold Database expands to over 200 million structures',
        'AlphaFold3 brings diffusion-based all-atom co-folding',
      ],
      why: 'CASP13 was in 2018, CASP14 in 2020, the RoseTTAFold and AlphaFold2 papers in July 2021, the AFDB expansion in 2022 and AlphaFold3 in May 2024.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **RoseTTAFold**: three tracks (1D sequence, 2D pairs, 3D coordinates) that exchange information in every block.
- **AlphaFold3**: per-atom tokens for ligands, a **Pairformer** trunk and a **diffusion** module over raw atom coordinates. It predicts proteins, nucleic acids, ligands and ions together.
- Co-folding beat classical docking on PoseBusters without being given the holo structure, but can produce chirality errors, clashes and hallucinated order.
- Open models (**Boltz-1/2**, **Chai-1**, RoseTTAFold All-Atom) make co-folding widely usable.
- Next: [where predicted structures fail](@drug/structure-prediction-limits).`,
    },
  ],
  references: [
    { authors: 'Baek, M., DiMaio, F., Anishchenko, I., et al.', title: 'Accurate prediction of protein structures and interactions using a three-track neural network', year: 2021, venue: 'Science 373, 871–876' },
    { authors: 'Abramson, J., Adler, J., Dunger, J., et al.', title: 'Accurate structure prediction of biomolecular interactions with AlphaFold 3', year: 2024, venue: 'Nature 630, 493–500' },
    { authors: 'Krishna, R., Wang, J., Ahern, W., et al.', title: 'Generalized biomolecular modeling and design with RoseTTAFold All-Atom', year: 2024, venue: 'Science 384, eadl2528' },
    { authors: 'Wohlwend, J., Corso, G., Passaro, S., et al.', title: 'Boltz-1: Democratizing biomolecular interaction modeling', year: 2024, venue: 'bioRxiv preprint' },
    { authors: 'Chai Discovery team', title: 'Chai-1: Decoding the molecular interactions of life', year: 2024, venue: 'bioRxiv preprint' },
  ],
} satisfies LessonContent;
