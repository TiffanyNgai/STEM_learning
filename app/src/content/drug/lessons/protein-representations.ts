import type { LessonContent } from '../../types';

const pdbExcerpt = `ATOM      1  N   PRO A   1      -3.211   1.024  10.534  1.00 30.12           N
ATOM      2  CA  PRO A   1      -2.180   1.910  11.050  1.00 28.47           C
ATOM      3  C   PRO A   1      -0.812   1.320  10.720  1.00 27.90           C
ATOM      4  O   PRO A   1      -0.560   0.140  10.950  1.00 29.33           O
HETATM 1601  C1  LIG A 401       4.512  -2.330  14.210  1.00 21.75           C
HETATM 1702  O   HOH A 501       7.880   5.120  12.300  1.00 55.10           O`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Four ways to describe a protein',
      body: String.raw`A drug target is usually a protein, and a computer can describe it at several levels:

1. **Sequence**: a string over a 20-letter alphabet, one letter per amino acid.
2. **Structure file**: 3D coordinates of every atom (PDB or mmCIF format).
3. **Derived representations**: residue graphs, contact maps, surfaces and binding-site definitions computed from the coordinates.
4. **Learned embeddings**: vectors produced by neural networks such as [protein language models](@drug/protein-language-models).

Docking needs level 2. Many ML models use levels 1, 3 and 4.`,
    },
    {
      kind: 'recall',
      title: 'Protein structure in one minute',
      points: [
        '**Primary** structure: the amino-acid sequence, linked by peptide bonds, N-terminus to C-terminus.',
        '**Secondary** structure: local α-helices and β-strands/sheets held by backbone H-bonds.',
        '**Tertiary** structure: the 3D fold of one chain; **quaternary**: how several chains assemble.',
        'Each residue has backbone atoms N, Cα, C, O plus a side chain attached to Cα.',
      ],
      link: 'bio/protein-structure',
    },
    {
      kind: 'explain',
      title: 'Sequences: FASTA and UniProt',
      body: String.raw`A protein sequence is written with **one-letter codes** (A = alanine, G = glycine, W = tryptophan, …) from N- to C-terminus.

The **FASTA** format stores it as a header line beginning with \`>\`, followed by the sequence on one or more lines:

\`>sp|P00533|EGFR_HUMAN Epidermal growth factor receptor\`
\`MRPSGTAGAALLALLAALCPASRALEEKKV…\`

**UniProt** is the reference sequence database. Every entry has a stable **accession** (here P00533, human EGFR, a cancer drug target) and is annotated with function, domains, variants and links to known structures. Sequences are compared by [sequence alignment](@bio/sequence-alignment).`,
    },
    {
      kind: 'mcq',
      prompt: 'In a FASTA file, how does the parser know where a new sequence record starts?',
      choices: ['A line beginning with `>`', 'A blank line', 'A line beginning with `ATOM`', 'The letter M (methionine)'],
      answer: 0,
      why: 'Every FASTA record starts with a `>` header line; all following lines up to the next `>` are sequence. Most sequences do begin with M (the start codon), but that is biology, not file syntax. `ATOM` records belong to PDB files.',
    },
    {
      kind: 'explain',
      title: 'The Protein Data Bank',
      body: String.raw`The **Protein Data Bank (PDB)**, founded in 1971 and run today by the worldwide wwPDB partnership (Berman et al. 2000), is the archive of experimentally determined 3D structures from X-ray crystallography, NMR and cryo-EM. It now holds more than 200,000 entries, each with a 4-character ID such as \`1HSG\` (HIV-1 protease with a bound inhibitor).

Two file formats exist:

- **Legacy PDB format**: fixed-width 80-column text lines. Simple, but limited, e.g. to 99,999 atoms and one-character chain IDs.
- **PDBx/mmCIF**: a flexible key–value and table format. It has been the wwPDB's standard archive format since 2014 and is required for large structures such as ribosomes.`,
    },
    {
      kind: 'widget',
      title: 'Anatomy of a PDB file',
      body: 'Step through the lines: each ATOM or HETATM line is one atom, and its meaning comes from fixed column positions.',
      widget: {
        type: 'CodeTracer',
        props: {
          lang: 'pdb',
          code: pdbExcerpt,
          trace: [
            { line: 1, vars: { record: 'ATOM', serial: 1, atom: 'N', residue: 'PRO', chain: 'A', resSeq: 1 }, note: 'ATOM = an atom of a standard residue (amino acid or nucleotide). This is the backbone N of proline 1 in chain A.' },
            { line: 2, vars: { atom: 'CA', x: -2.18, y: 1.91, z: 11.05, occupancy: 1.0, B: 28.47 }, note: 'Coordinates are in ångströms. Occupancy is the fraction of molecules in the crystal with the atom here; B is the temperature (displacement) factor, larger = more mobile or less certain.' },
            { line: 3, vars: { atom: 'C' }, note: 'The CA→C distance is about 1.53 Å: a single C–C bond. Bonds are not stored; programs infer them from distances and residue templates.' },
            { line: 4, vars: { atom: 'O' }, note: 'The backbone carbonyl O. Note there are no hydrogens: X-ray structures rarely resolve them, so they must be added before docking or simulation.' },
            { line: 5, vars: { record: 'HETATM', residue: 'LIG', resSeq: 401 }, note: 'HETATM = "hetero" atom: ligands, ions, cofactors and waters. Ligands get a 3-character chemical component code (LIG is a placeholder here).' },
            { line: 6, vars: { residue: 'HOH', B: 55.1 }, note: 'A crystallographic water. Its high B-factor suggests it is loosely held; waters are often removed or kept selectively before docking.' },
          ],
        },
      },
    },
    {
      kind: 'fill',
      prompt: 'In a PDB file, ligands and waters are written on ___ lines, coordinates are given in ___, and the column that reports how mobile or uncertain an atom is holds the ___.',
      bank: ['HETATM', 'ATOM', 'ångströms', 'nanometres', 'B-factor', 'occupancy'],
      answer: ['HETATM', 'ångströms', 'B-factor'],
      why: 'Standard residues use ATOM, while everything else (ligands, ions, waters) uses HETATM. Coordinates are in Å (nanometres are the unit of GROMACS files, not PDB). Occupancy is the fraction of copies with the atom in that position, which is a different thing from the B-factor.',
    },
    {
      kind: 'explain',
      title: 'A structure is a model, not a photograph',
      body: String.raw`Before using a PDB entry, check its limits:

- **Resolution** (X-ray, cryo-EM): about 1.5 Å resolves individual side chains well; at 3.5 Å side-chain positions are uncertain.
- **Missing atoms and loops**: flexible regions often have no density and are simply absent.
- **Alternate conformations**: some atoms appear twice (altLoc A/B) with occupancies that add up to 1.
- **No hydrogens** and no assigned protonation states (histidine is a classic ambiguity).
- **Asymmetric unit vs biological assembly**: the file may contain more chains (or fewer) than the functional protein.

**Structure preparation** (add H, choose protonation, fill gaps, pick altLocs, decide on waters) is a standard first step before [docking](@drug/docking).`,
    },
    {
      kind: 'multi',
      prompt: 'Which issues typically need fixing before a crystal structure is used for docking? (Select all.)',
      choices: [
        'Hydrogen atoms are missing',
        'Some flexible loops have no coordinates',
        'Some residues have two alternate conformations',
        'Histidine protonation states are not assigned',
        'The amino-acid sequence is unknown',
      ],
      answers: [0, 1, 2, 3],
      why: 'Missing hydrogens, unresolved loops, alternate locations and ambiguous protonation are all routine preparation tasks. The sequence, however, is known: it is recorded in the entry (and linked to UniProt) even where some residues lack coordinates.',
    },
    {
      kind: 'explain',
      title: 'Residues, graphs and contact maps',
      body: String.raw`For many tasks atom-level detail is too much. A common coarse view keeps **one point per residue** (its Cα atom):

- **Contact map**: an $N \times N$ matrix with entry 1 if residues $i$ and $j$ have Cα atoms within a cut-off (often 8 Å). It does not change if you rotate or move the protein.
- **Residue graph**: residues are nodes, contacts are edges, and nodes carry features such as amino-acid type. This is the input to [graph neural networks](@ml/gnns) and, with coordinates attached, to [equivariant networks](@ml/equivariant-networks).
- **Binding site**: often defined as the residues with any atom within about 5 Å of a bound ligand.`,
    },
    {
      kind: 'widget',
      title: 'Read a contact map',
      body: 'A toy 42-residue protein: two packed helices and a β-hairpin. Tap cells to see residue pairs. Raise the cut-off and watch the bands thicken.',
      widget: { type: 'DrugContactMap', props: { cutoff: 8 }, caption: 'Helices give thick bands hugging the diagonal (contacts $i$ to $i+4$). Antiparallel packing (helix–helix, strand–strand) gives stripes running perpendicular to the diagonal. The coloured strip above the map marks secondary structure.' },
    },
    {
      kind: 'mcq',
      prompt: 'In a Cα contact map (8 Å cut-off), which pattern is the signature of an α-helix?',
      choices: [
        'A thick band along the diagonal, covering roughly $i$ to $i+4$',
        'A single isolated dot far from the diagonal',
        'A stripe perpendicular to the diagonal',
        'An empty region around the diagonal',
      ],
      answer: 0,
      why: 'In a helix, residue $i$ is within about 5–6 Å of residues $i+3$ and $i+4$ (3.6 residues per turn), so contacts pile up next to the diagonal. Stripes perpendicular to the diagonal come from antiparallel pairs, such as a β-hairpin or two antiparallel helices.',
    },
    {
      kind: 'explain',
      title: 'Predicted structures and learned embeddings',
      body: String.raw`Since [AlphaFold](@drug/alphafold), predicted models are available for most known protein sequences in the AlphaFold Database (Varadi et al. 2022). They use the same PDB/mmCIF formats, with one twist: the **B-factor column holds the per-residue confidence (pLDDT, 0–100)** rather than an experimental displacement factor.

**Protein language models** such as ESM-2 (Lin et al. 2023) turn a sequence into a vector for every residue, learned from millions of sequences. These embeddings encode structural and evolutionary information and are a common input for property, binding-site and interaction predictors. See [protein structure prediction](@drug/protein-structure-prediction).`,
    },
    {
      kind: 'truefalse',
      prompt: 'In an AlphaFold Database model file, the B-factor column contains pLDDT confidence scores rather than experimental temperature factors.',
      answer: true,
      why: 'AlphaFold DB re-uses the B-factor field to store per-residue pLDDT (0–100, higher = more confident). Reading it as a mobility measure would be wrong: a high value here means *high confidence*, while a high experimental B-factor means *high mobility or uncertainty*.',
    },
    {
      kind: 'match',
      prompt: 'Match each representation to its description.',
      pairs: [
        ['FASTA', 'Header line plus one-letter amino-acid sequence'],
        ['PDBx/mmCIF', 'Flexible table format for 3D coordinates, the current archive standard'],
        ['Contact map', 'Matrix of residue pairs closer than a cut-off'],
        ['UniProt accession', 'Stable identifier of a sequence entry, e.g. P00533'],
        ['Per-residue embedding', 'Vector for each residue, learned by a language model'],
      ],
      why: 'FASTA and UniProt deal with sequences, mmCIF with 3D coordinates, contact maps are derived from coordinates, and embeddings are learned from sequences by neural networks.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Sequence**: one-letter codes, stored in **FASTA** (\`>\` header) and catalogued by **UniProt** accessions.
- **Structure**: the **PDB** (Berman et al. 2000) archives experimental models as legacy PDB or **PDBx/mmCIF** files: ATOM/HETATM records, coordinates in Å, occupancy and B-factor.
- Structures are **models**: check resolution, missing loops, altLocs, missing hydrogens and protonation, and **prepare** them before docking.
- **Derived views**: residue graphs, contact maps and binding sites. **Learned views**: language-model embeddings. AlphaFold models store pLDDT in the B-factor column.`,
    },
  ],
  references: [
    { authors: 'Berman, H. M., Westbrook, J., Feng, Z., et al.', title: 'The Protein Data Bank', year: 2000, venue: 'Nucleic Acids Res. 28, 235–242' },
    { authors: 'The UniProt Consortium', title: 'UniProt: the Universal Protein Knowledgebase in 2023', year: 2023, venue: 'Nucleic Acids Res. 51, D523–D531' },
    { authors: 'Varadi, M., Anyango, S., Deshpande, M., et al.', title: 'AlphaFold Protein Structure Database: massively expanding the structural coverage of protein-sequence space with high-accuracy models', year: 2022, venue: 'Nucleic Acids Res. 50, D439–D444' },
    { authors: 'Lin, Z., Akin, H., Rao, R., et al.', title: 'Evolutionary-scale prediction of atomic-level protein structure with a language model', year: 2023, venue: 'Science 379, 1123–1130' },
  ],
} satisfies LessonContent;
