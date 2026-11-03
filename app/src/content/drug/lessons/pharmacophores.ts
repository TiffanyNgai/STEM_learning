import type { LessonContent } from '../../types';

// Three-point pharmacophore with tolerance spheres; a ligand's matching features rotate into alignment.
const P: [number, number, string, string][] = [
  [80, 66, 'var(--c2)', 'H-bond donor'],
  [240, 66, 'var(--c5)', 'H-bond acceptor'],
  [160, 156, 'var(--c3)', 'aromatic ring'],
];
const pharmSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
<text x="10" y="14" font-size="10" font-weight="700" fill="var(--fg)">A 3-point pharmacophore (distances with tolerances)</text>
<g stroke="var(--muted)" stroke-dasharray="4 3" stroke-width="1.2">
<line x1="80" y1="66" x2="240" y2="66"/><line x1="80" y1="66" x2="160" y2="156"/><line x1="240" y1="66" x2="160" y2="156"/></g>
<text x="160" y="58" font-size="9" fill="var(--fg)" text-anchor="middle">6.0 ± 1.0 Å</text>
<text x="104" y="120" font-size="9" fill="var(--fg)" text-anchor="end">4.5 ± 1.0 Å</text>
<text x="216" y="120" font-size="9" fill="var(--fg)">4.5 ± 1.0 Å</text>
${P.map(([x, y, c, l]) => `<circle cx="${x}" cy="${y}" r="17" fill="${c}" fill-opacity="0.18" stroke="${c}" stroke-width="1.5"/>
<text x="${x}" y="${y > 100 ? y + 32 : y - 24}" font-size="9" fill="${c}" text-anchor="middle" font-weight="700">${l}</text>`).join('')}
<g>
<animateTransform attributeName="transform" type="rotate" values="40 160 96;0 160 96;0 160 96;40 160 96" keyTimes="0;0.35;0.85;1" dur="6s" repeatCount="indefinite"/>
<polyline points="84,70 120,98 156,96 160,150 196,98 236,70" fill="none" stroke="var(--fg)" stroke-width="2" stroke-linejoin="round"/>
${P.map(([x, y, c]) => `<circle cx="${x + (x < 160 ? 4 : x > 160 ? -4 : 0)}" cy="${y + (y < 100 ? 4 : -6)}" r="5" fill="${c}" stroke="var(--fg)"/>`).join('')}
</g>
<text x="310" y="196" font-size="8" fill="var(--muted)" text-anchor="end">a ligand conformer "fits" when each feature lands in its sphere</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'What the receptor actually "sees"',
      body: String.raw`Morphine, fentanyl and methadone look very different on paper, yet all activate the μ-opioid receptor. The receptor does not read a structural formula. It responds to a few **interactions in the right places in 3D**: a positively charged amine, an aromatic ring, hydrophobic contacts.

A **pharmacophore** is that abstract pattern: *which* interaction features a ligand needs and *where* they must sit relative to one another. It explains why different scaffolds can share an activity, and it gives a fast way to search for new ones.`,
    },
    {
      kind: 'explain',
      title: 'The IUPAC definition',
      body: String.raw`The IUPAC medicinal-chemistry glossary (Wermuth et al. 1998) defines a pharmacophore as an "ensemble of steric and electronic features" needed for optimal interactions with a specific biological target, so as to trigger or block its response.

Two points in that definition matter:

- A pharmacophore is **not a molecule** and **not a functional group**. "Contains a sulfonamide" is not a pharmacophore. "An H-bond acceptor 5 Å from a hydrophobic centre" is.
- It is the **largest common denominator** of the interactions that a set of active molecules makes with the target.`,
    },
    {
      kind: 'recall',
      title: '3D structure & conformers',
      points: [
        'Rotation about single bonds gives a molecule many **conformers**, different 3D shapes of the same compound.',
        'Conformer generators such as **ETKDG** sample a set of low-energy shapes.',
        'The **bioactive conformation** (the shape when bound) is often *not* the lowest-energy one.',
        'Protonation state and tautomer decide whether a group is a donor, an acceptor or charged.',
      ],
      link: 'drug/conformers-3d',
    },
    {
      kind: 'explain',
      title: 'Features, distances, tolerances',
      body: String.raw`Standard pharmacophore **feature types**:

- **H-bond donor** (N–H, O–H) and **H-bond acceptor** (lone pairs on N, O)
- **Positive ionisable** (e.g. a protonated amine) and **negative ionisable** (carboxylate, tetrazole)
- **Hydrophobic** centre and **aromatic ring** (often with a ring-plane direction)

A model is a set of features plus the **distances** (and sometimes angles) between them. Each feature is a sphere with a **tolerance radius**, typically 1–2 Å, because real binding allows some slack. **Exclusion volumes** can mark space occupied by the protein, where no ligand atom may go.`,
      widget: { type: 'SvgDiagram', props: { svg: pharmSvg }, caption: 'The ligand (black skeleton with coloured feature points) is rotated until each of its features falls inside the matching tolerance sphere.' },
    },
    {
      kind: 'match',
      prompt: 'Match each chemical group (at physiological pH) to the pharmacophore feature it most typically provides.',
      pairs: [
        ['Protonated tertiary amine (R₃NH⁺)', 'Positive ionisable'],
        ['Carboxylate (–COO⁻)', 'Negative ionisable'],
        ['Phenyl ring', 'Aromatic ring'],
        ['Ketone C=O', 'H-bond acceptor'],
        ['Amide N–H', 'H-bond donor'],
      ],
      why: 'Charged groups map to ionisable features. Phenyl gives an aromatic (also hydrophobic) feature. A carbonyl oxygen accepts H-bonds but has no H to donate, while an amide N–H donates. Some groups (e.g. O–H) can be both donor and acceptor.',
    },
    {
      kind: 'explain',
      title: 'Two ways to build a pharmacophore',
      body: String.raw`- **Ligand-based**: you know several active molecules but not the target structure. Generate conformers of each, **align** them in 3D, and keep the features they all share at matching positions. Known inactives help reject models that are too permissive.
- **Structure-based**: you have a protein–ligand complex (e.g. a crystal structure). Read the interactions directly: this N–H donates to that backbone carbonyl, this ring stacks on that phenylalanine. Turn them into features and add exclusion volumes from the protein atoms (as in LigandScout; Wolber & Langer 2005).

Kinase inhibitors are a familiar structure-based case: most make one to three H-bonds to the kinase **hinge** backbone. That donor/acceptor pattern is the core of many kinase pharmacophores.`,
    },
    {
      kind: 'widget',
      title: 'Ligand-based pharmacophore elucidation',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            '**Collect actives** (ideally diverse scaffolds) with reliable potency data, plus some confirmed inactives.',
            '**Prepare 3D**: assign protonation states and tautomers, then generate a conformer ensemble for each molecule.',
            '**Annotate features** on every conformer: donors, acceptors, charges, hydrophobes, rings.',
            '**Align and find common patterns**: search for a feature arrangement that at least one conformer of every active can match.',
            '**Score and validate**: does the model pick out actives from inactives and decoys? Check enrichment before trusting it.',
          ],
          notes: [
            'Diverse actives are more informative: features shared by very different scaffolds are more likely to be real requirements.',
            'Errors here (wrong charge state) create or remove features and can break the model.',
            '',
            'This is a combinatorial search over conformer choices and feature subsets, which is why tools score many candidate hypotheses.',
            'See [virtual screening](@drug/virtual-screening) for enrichment metrics.',
          ],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: 'Why must pharmacophore methods generate many conformers for each molecule, not just one?',
      choices: [
        'The bioactive shape is often not the lowest-energy conformer, so a single structure may fail to match even for a true active',
        'Conformers have different molecular weights',
        'Each conformer is a different compound that must be registered separately',
        'Fingerprints require 3D coordinates',
      ],
      answer: 0,
      why: 'Feature distances change as bonds rotate. If you test only one (e.g. lowest-energy) conformer, true actives whose bound shape differs will be missed. Conformers are the same compound with the same molecular weight, and 2D fingerprints need no coordinates at all.',
    },
    {
      kind: 'explain',
      title: 'Pharmacophore screening',
      body: String.raw`To screen a library, each molecule's conformers are checked against the query:

1. Can the molecule supply **every required feature type**?
2. Does any conformer place those features at the right **inter-feature distances**, within tolerance?
3. If so, superimpose and compute a **fit score** (how close features are to sphere centres; no clash with exclusion volumes).

Checks 1 and 2 are cheap filters, so millions of compounds can be screened quickly. Because the query is made of features rather than atoms, hits often have **new scaffolds**, which makes this a natural tool for [scaffold hopping](@drug/scaffolds-chemotypes).

Example: a donor at $(1, 2, 2)$ Å and an acceptor at $(4, 6, 2)$ Å are $\sqrt{3^2+4^2+0^2} = 5$ Å apart.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A query requires a donor–acceptor distance of $6.0 \pm 1.0$ Å. In one conformer, the donor is at $(0, 0, 0)$ Å and the acceptor at $(2, 4, 4)$ Å. What is the donor–acceptor distance in Å?`,
      answer: 6,
      tolerance: 0.01,
      unit: 'Å',
      why: String.raw`$\sqrt{2^2+4^2+4^2} = \sqrt{36} = 6.0$ Å, inside the 5.0–7.0 Å window, so this conformer passes the distance check. A frequent slip is to forget the $z$ difference and get $\sqrt{20}\approx 4.5$ Å.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps of screening one library compound against a pharmacophore query.',
      steps: [
        'Assign protonation state and generate conformers',
        'Annotate pharmacophore features on each conformer',
        'Check feature types and inter-feature distances against the query',
        'Superimpose matching conformers and compute a fit score',
        'Rank hits and send the best for purchase or testing',
      ],
      why: 'Features depend on the charge state and on 3D shape, so preparation comes first. Cheap type and distance checks filter before the costlier 3D superposition and scoring. Ranking and experimental testing come last.',
    },
    {
      kind: 'explain',
      title: 'A classic: designing captopril',
      body: String.raw`In the 1970s, before any crystal structure of angiotensin-converting enzyme (ACE) was available, Ondetti, Cushman and colleagues at Squibb built a **model of the ACE active site** by analogy with the zinc protease carboxypeptidase A. Their design hypothesis had three key interactions:

- a group to **bind the catalytic zinc** ion,
- a **terminal carboxylate** to pair with a positively charged site,
- a **carbonyl** to accept a hydrogen bond.

Proline-based molecules that supplied these features led to **captopril** (zinc-binding thiol), the first ACE inhibitor drug. Merck's **enalaprilat** later satisfied the same features with a carboxylate as the zinc binder. Same pharmacophore, different chemistry.`,
    },
    {
      kind: 'truefalse',
      prompt: 'A pharmacophore is a specific functional group, such as a sulfonamide, that all active compounds must contain.',
      answer: false,
      why: 'By the IUPAC definition a pharmacophore is an abstract arrangement of features. A thiol and a carboxylate can both satisfy a "zinc binder" feature, as captopril and enalaprilat show. Naming a functional group describes a substructure, not a pharmacophore.',
    },
    {
      kind: 'multi',
      prompt: 'Which statements about pharmacophore models are correct?',
      choices: [
        'They can retrieve actives with scaffolds different from the training molecules',
        'They can be derived from known actives alone, without a protein structure',
        'A good fit score is a reliable prediction of binding affinity',
        'Their results depend on the quality of conformer generation and protonation states',
      ],
      answers: [0, 1, 3],
      why: 'Feature-based queries support scaffold hopping and need only ligands, but they are sensitive to conformer coverage and charge assignment. Fit scores rank geometric agreement. They do not estimate binding free energy, so hits still need experimental testing or more rigorous methods.',
    },
    {
      kind: 'fill',
      prompt: 'A pharmacophore model specifies feature types, the ___ between them, and a ___ radius for each feature. Regions the ligand must avoid because the protein is there are encoded as ___ volumes.',
      bank: ['distances', 'bonds', 'tolerance', 'van der Waals', 'exclusion', 'solvent'],
      answer: ['distances', 'tolerance', 'exclusion'],
      why: 'Geometry is given as inter-feature distances with tolerance spheres. Exclusion volumes, usually taken from protein atoms in structure-based models, reject ligands that would clash.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **pharmacophore** (IUPAC: an ensemble of steric and electronic features) is an **abstract 3D arrangement** of interaction features, not a molecule or functional group.
- Features: H-bond donor/acceptor, positive/negative ionisable, hydrophobic, aromatic, with **distances, tolerance spheres** and **exclusion volumes**.
- Build it **ligand-based** (align conformers of actives) or **structure-based** (from a protein–ligand complex).
- Screening checks whether **any conformer** places the right features at the right distances. It is fast and good for **scaffold hopping**, but it does not predict affinity.`,
    },
  ],
  references: [
    { authors: 'Wermuth, C. G., Ganellin, C. R., Lindberg, P., Mitscher, L. A.', title: 'Glossary of terms used in medicinal chemistry (IUPAC Recommendations 1998)', year: 1998, venue: 'Pure Appl. Chem. 70, 1129–1143' },
    { authors: 'Leach, A. R., Gillet, V. J., Lewis, R. A., Taylor, R.', title: 'Three-dimensional pharmacophore methods in drug discovery', year: 2010, venue: 'J. Med. Chem. 53, 539–558' },
    { authors: 'Wolber, G., Langer, T.', title: 'LigandScout: 3-D pharmacophores derived from protein-bound ligands and their use as virtual screening filters', year: 2005, venue: 'J. Chem. Inf. Model. 45, 160–169' },
    { authors: 'Ondetti, M. A., Rubin, B., Cushman, D. W.', title: 'Design of specific inhibitors of angiotensin-converting enzyme: new class of orally active antihypertensive agents', year: 1977, venue: 'Science 196, 441–444' },
  ],
} satisfies LessonContent;
