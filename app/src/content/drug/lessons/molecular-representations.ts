import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A molecule inside a computer',
      body: String.raw`A chemist sketches aspirin on paper in seconds. A computer cannot "see" a sketch — it needs the molecule as **data**.

Two families of representation dominate drug discovery:

- **Line notations** — the molecule written as a short text string (SMILES, SELFIES, InChI). Easy to store, search and feed to language models.
- **Molecular graphs** — atoms as *nodes*, bonds as *edges*. The natural input for graph algorithms and graph neural networks.

> Every database search, similarity calculation and ML model you will meet starts from one of these.`,
    },
    {
      kind: 'recall',
      title: 'Graphs in one minute',
      points: [
        'A **graph** $G = (V, E)$ is a set of nodes $V$ joined by edges $E$.',
        'Nodes and edges can carry **features** (labels), e.g. a colour or a weight.',
        'The **adjacency matrix** $A$ has $A_{ij} = 1$ if nodes $i$ and $j$ are joined, else $0$.',
        'The node numbering is arbitrary: re-labelling nodes gives the *same* graph (a permutation).',
      ],
      link: 'cs/graphs-intro',
    },
    {
      kind: 'explain',
      title: 'SMILES: atoms and bonds',
      body: String.raw`**SMILES** (Simplified Molecular-Input Line-Entry System, Weininger 1988) writes a molecule by walking along its bonds.

- **Atoms** are element symbols. The common "organic subset" (B, C, N, O, P, S, F, Cl, Br, I) is written bare; anything else — charges, unusual elements, explicit H — goes in brackets: \`[Na+]\`, \`[NH4+]\`.
- **Hydrogens are implicit**: each bare atom is topped up with H to its normal valence (C → 4, N → 3, O → 2).
- **Bonds**: single is implied by adjacency, \`=\` is double, \`#\` is triple.

Example: \`CCO\` = C–C–O. Adding hydrogens: CH₃–CH₂–OH, i.e. **ethanol**. \`C=O\` is formaldehyde; \`C#N\` is hydrogen cyanide.`,
    },
    {
      kind: 'mcq',
      prompt: 'What is the molecular formula of the molecule written as `CCO`?',
      choices: ['C₂O', 'C₂H₅O', 'C₂H₆O', 'C₂H₄O'],
      answer: 2,
      why: 'Implicit hydrogens fill each atom to its normal valence: the first C has 1 bond → 3 H, the middle C has 2 bonds → 2 H, O has 1 bond → 1 H. Total C₂H₆O (ethanol). Forgetting the H on oxygen gives the tempting C₂H₅O.',
    },
    {
      kind: 'explain',
      title: 'Branches, rings and aromaticity',
      body: String.raw`A walk along bonds cannot cover a branched or cyclic molecule on its own, so SMILES adds three tricks:

- **Branches** go in parentheses: \`CC(=O)O\` is a C bonded to a C that carries both =O and –OH → **acetic acid**.
- **Rings** are closed with matching **digits**: \`C1CCCCC1\` opens a ring at the first C and closes it at the last → **cyclohexane**.
- **Aromatic atoms** are written in **lowercase**: \`c1ccccc1\` is **benzene**; \`c1ccncc1\` is pyridine. The same benzene can also be written in Kekulé form, \`C1=CC=CC=C1\`.

Put together, aspirin is \`CC(=O)OC1=CC=CC=C1C(=O)O\`.`,
    },
    {
      kind: 'widget',
      title: 'Read a SMILES string',
      body: 'Tap any atom of aspirin: the matching character in the SMILES string lights up. Follow the ring-closure digit `1` and the two branches in parentheses.',
      widget: { type: 'MolGraphFingerprint', props: { molecule: 'aspirin', view: 'structure' }, caption: 'Skeletal drawing: carbons are the unlabelled corners, hydrogens are implicit. Try caffeine and ibuprofen too.' },
    },
    {
      kind: 'numeric',
      prompt: 'How many **heavy (non-hydrogen) atoms** are in aspirin, `CC(=O)OC1=CC=CC=C1C(=O)O`?',
      answer: 13,
      tolerance: 0,
      unit: 'atoms',
      why: 'Count the element letters and ignore parentheses, `=` and digits: 9 C and 4 O = 13 (aspirin is C₉H₈O₄). A common slip is counting the ring-closure digits as atoms.',
    },
    {
      kind: 'match',
      prompt: 'Match each SMILES string to its molecule.',
      pairs: [
        ['`CCO`', 'Ethanol'],
        ['`c1ccccc1`', 'Benzene'],
        ['`CC(=O)O`', 'Acetic acid'],
        ['`C1CCCCC1`', 'Cyclohexane'],
      ],
      why: 'Lowercase c means aromatic carbons (benzene); uppercase C with a ring digit and no double bonds is saturated (cyclohexane). `CC(=O)O` has the carboxylic acid branch; `CCO` is two carbons and an OH.',
    },
    {
      kind: 'recall',
      title: 'Stereochemistry refresher',
      points: [
        'A **stereocentre** (often a carbon with four different substituents) can exist as two mirror-image forms, labelled **R** or **S**.',
        'A C=C double bond with two different groups on each end can be **E** (opposite sides) or **Z** (same side).',
        'Stereoisomers have the same connectivity — so a plain graph cannot tell them apart.',
        'Stereoisomers of a drug can differ hugely in activity and safety.',
      ],
      link: 'chem/stereochemistry',
    },
    {
      kind: 'explain',
      title: 'Stereo in SMILES, and canonical SMILES',
      body: String.raw`**Tetrahedral centres** use \`@\` or \`@@\` inside brackets. Look from the atom written *before* the centre: the remaining neighbours, in the order written, run anticlockwise for \`@\` and clockwise for \`@@\`. \`N[C@@H](C)C(=O)O\` is L-alanine.

**Double-bond geometry** uses \`/\` and \`\\\`: \`F/C=C/F\` is *E* (trans), \`F/C=C\\F\` is *Z* (cis).

One molecule has **many valid SMILES** (start anywhere, walk in any order: \`OCC\` = \`CCO\`). A **canonicalisation** algorithm ranks atoms by graph invariants and always starts and walks the same way, giving one **canonical SMILES** per molecule — but only *within one toolkit and version*.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Two different SMILES strings must describe two different molecules.',
      answer: false,
      why: 'SMILES is not unique: `CCO`, `OCC` and `C(O)C` are all ethanol. That is why databases store a canonical SMILES (or an InChI) before comparing molecules — comparing raw strings would miss duplicates.',
    },
    {
      kind: 'explain',
      title: 'InChI, InChIKey and SELFIES',
      body: String.raw`**InChI** (IUPAC International Chemical Identifier; Heller et al. 2015) is an open, *standard* identifier built in layers — formula, connectivity, hydrogens, charge, stereo — so the same molecule gives the same InChI in any software. The **InChIKey** is a fixed-length 27-character hash of it (aspirin: \`BSYNRYMUTXBXSQ-UHFFFAOYSA-N\`), ideal for web and database lookup. Hashes can in principle collide, but this is extremely rare.

**SELFIES** (Krenn et al. 2020) is built for machine learning. Its tokens, e.g. \`[C][C][O]\` for ethanol, are decoded by a grammar that always respects valence, so **every** SELFIES string is a valid molecule. A generative model writing random SMILES often produces unclosed rings or 5-valent carbons; one writing SELFIES cannot.`,
    },
    {
      kind: 'widget',
      title: 'The molecular graph',
      body: String.raw`In the graph view each atom is a **node** labelled with its element and index; each bond is an **edge** (bond order 2 is marked). Hydrogens are usually left implicit, stored as a node feature (the "hydrogen-suppressed graph").

The adjacency matrix of caffeine is $14\times14$ with $A_{ij}=1$ for each of its 15 bonds. Re-numbering the atoms permutes the rows and columns of $A$ but gives the same molecule — so models on graphs must be **permutation invariant**.`,
      widget: { type: 'MolGraphFingerprint', props: { molecule: 'caffeine', view: 'graph' }, caption: 'Tap a node to see which SMILES character created it.' },
    },
    {
      kind: 'multi',
      prompt: 'Which statements about molecular representations are **true**? (Select all.)',
      choices: [
        'Every syntactically valid SELFIES string decodes to a chemically valid molecule.',
        'A hydrogen-suppressed 2D graph fully specifies the 3D shape a molecule adopts.',
        'The InChIKey is a hashed, fixed-length form of the InChI.',
        'Canonical SMILES produced by two different toolkits are guaranteed to be identical.',
        'Lowercase atoms in SMILES denote aromatic atoms.',
      ],
      answers: [0, 2, 4],
      why: 'SELFIES is valid by construction, the InChIKey hashes the InChI, and lowercase means aromatic. A 2D graph says nothing about conformation (3D shape needs coordinates), and canonical SMILES are only canonical within one toolkit — use InChI for cross-software identity.',
    },
    {
      kind: 'fill',
      prompt: 'In SMILES, ___ mark branches, matching ___ close rings, and ___ letters mark aromatic atoms.',
      bank: ['parentheses', 'digits', 'lowercase', 'brackets', 'uppercase', 'colons'],
      answer: ['parentheses', 'digits', 'lowercase'],
      why: 'Branches are written in parentheses, e.g. `CC(=O)O`; ring bonds are closed by matching digits, e.g. `C1CCCCC1`; aromatic atoms are lowercase, e.g. `c1ccccc1`. Square brackets are for atoms outside the organic subset or with charges/explicit H.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **SMILES** writes a molecule as a walk over its bonds: atoms, \`=\`/\`#\` bonds, (branches), ring digits, lowercase aromatics, implicit hydrogens, \`@\`/\`@@\` and \`/\`\`\\\` for stereo.
- A molecule has many SMILES; **canonical SMILES** (toolkit-specific) or **InChI/InChIKey** (a standard) give a unique identifier.
- **SELFIES** guarantees validity — handy for generative models.
- The **molecular graph** (atoms = nodes, bonds = edges, features on both) is what fingerprints and graph neural networks are built on. It is 2D only: shape needs 3D conformers.`,
    },
  ],
  references: [
    { authors: 'Weininger, D.', title: 'SMILES, a chemical language and information system. 1. Introduction to methodology and encoding rules', year: 1988, venue: 'J. Chem. Inf. Comput. Sci. 28, 31–36' },
    { authors: 'Krenn, M., Häse, F., Nigam, A., Friederich, P., Aspuru-Guzik, A.', title: 'Self-referencing embedded strings (SELFIES): A 100% robust molecular string representation', year: 2020, venue: 'Mach. Learn.: Sci. Technol. 1, 045024' },
    { authors: 'Heller, S. R., McNaught, A., Pletnev, I., Stein, S., Tchekhovskoi, D.', title: 'InChI, the IUPAC International Chemical Identifier', year: 2015, venue: 'J. Cheminform. 7, 23' },
    { authors: 'Leach, A. R.', title: 'Molecular Modelling: Principles and Applications', year: 2001, venue: '2nd ed., Prentice Hall / Pearson', detail: 'Ch. 12' },
  ],
} satisfies LessonContent;
