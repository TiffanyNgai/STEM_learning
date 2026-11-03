import type { LessonContent } from '../../types';

const parseCode = `from rdkit import Chem

mol = Chem.MolFromSmiles('CC(=O)OC1=CC=CC=C1C(=O)O')
print(mol.GetNumAtoms())
print(Chem.MolToSmiles(mol))
print(Chem.MolToInchiKey(mol))
bad = Chem.MolFromSmiles('C1CC')
print(bad)`;

const propsCode = `from rdkit.Chem import Descriptors, Crippen, rdMolDescriptors

print(round(Descriptors.MolWt(mol), 2))
print(round(Crippen.MolLogP(mol), 2))
print(round(rdMolDescriptors.CalcTPSA(mol), 2))
acid = Chem.MolFromSmarts('C(=O)[OH]')
print(mol.HasSubstructMatch(acid))
print(mol.GetSubstructMatches(acid))`;

const stdCode = `from rdkit.Chem.MolStandardize import rdMolStandardize

salt = Chem.MolFromSmiles('CC(=O)Oc1ccccc1C(=O)[O-].[Na+]')
parent = rdMolStandardize.FragmentParent(salt)
neutral = rdMolStandardize.Uncharger().uncharge(parent)
print(Chem.MolToSmiles(neutral))`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The cheminformatics workbench',
      body: String.raw`**RDKit** is the most widely used open-source cheminformatics toolkit. It has a C++ core with Python bindings and a permissive BSD licence, and was started by Greg Landrum and released as open source in 2006. It reads and writes molecules, computes [descriptors](@drug/molecular-descriptors) and [fingerprints](@drug/fingerprints-similarity), searches substructures, standardises structures and generates [3D conformers](@drug/conformers-3d).

This lesson shows the core ideas with short Python snippets. You do not need to run them; each line is explained. If Python is new to you, see [programming basics](@cs/programming-basics).`,
    },
    {
      kind: 'recall',
      title: 'SMILES in brief',
      points: [
        'SMILES writes a molecule as a walk over its bonds: `=` double, `#` triple, `( )` branches, digits close rings.',
        'Lowercase atoms are aromatic; hydrogens are implicit and filled in by valence.',
        'One molecule has many valid SMILES; a **canonical** SMILES is unique within one toolkit.',
        'The **InChIKey** is a standard hashed identifier for database lookup.',
      ],
      link: 'drug/molecular-representations',
    },
    {
      kind: 'explain',
      title: 'The Mol object and sanitisation',
      body: String.raw`Everything in RDKit starts with a **Mol** object: atoms, bonds and their properties, in memory. \`Chem.MolFromSmiles(s)\` parses a SMILES string and then **sanitises** the result:

- checks every atom's **valence** (a 5-bonded carbon is rejected),
- finds **rings** and perceives **aromaticity** (a Kekulé benzene \`C1=CC=CC=C1\` becomes aromatic),
- sets hybridisation and other derived properties, and counts **implicit hydrogens**.

If parsing or sanitisation fails, the function **returns \`None\`** and logs an error instead of raising an exception. Always check for \`None\` before using the result, or a later line will crash.`,
    },
    {
      kind: 'widget',
      title: 'Parse, inspect, write',
      body: 'Step through a first script. Aspirin goes in as a Kekulé SMILES and comes out canonical and aromatic.',
      widget: {
        type: 'CodeTracer',
        props: {
          lang: 'python',
          code: parseCode,
          trace: [
            { line: 1, note: 'Chem is RDKit’s core module: reading, writing and manipulating molecules.' },
            { line: 3, vars: { mol: '<Mol: 13 atoms>' }, note: 'Parse + sanitise. The Kekulé ring is perceived as aromatic.' },
            { line: 4, out: '13', note: 'Only heavy atoms are counted: the 8 hydrogens are implicit (stored as a count on each atom).' },
            { line: 5, out: 'CC(=O)Oc1ccccc1C(=O)O', note: 'Canonical SMILES: unique for this RDKit version, with lowercase aromatic atoms.' },
            { line: 6, out: 'BSYNRYMUTXBXSQ-UHFFFAOYSA-N', note: 'Standard InChIKey: the same in any InChI-compliant software. Use it to match against other databases.' },
            { line: 7, vars: { bad: null }, note: 'Ring bond 1 is never closed. RDKit logs a parse error and returns None, without raising an exception.' },
            { line: 8, out: 'None', note: 'In a real pipeline: `if mol is None: skip and record the failure`.' },
          ],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: 'You call `Chem.MolFromSmiles` on a SMILES string with a pentavalent carbon. What happens by default?',
      choices: [
        'RDKit silently fixes the valence',
        'It returns `None` and logs an error',
        'It raises an exception that stops the script',
        'It returns a Mol object with a warning flag',
      ],
      answer: 1,
      why: 'Sanitisation rejects impossible valences, and `MolFromSmiles` then returns `None` with a logged message rather than raising. That is convenient for large files but dangerous: forget the `None` check and the error surfaces later, e.g. as an AttributeError on `None.GetNumAtoms()`.',
    },
    {
      kind: 'explain',
      title: 'Atoms, bonds and hydrogens',
      body: String.raw`A Mol is a graph you can walk:

- \`for atom in mol.GetAtoms():\` loops over atoms. Each one has \`atom.GetIdx()\` (index from 0, in SMILES order), \`atom.GetSymbol()\`, \`atom.GetDegree()\` (heavy-atom neighbours), \`atom.GetTotalNumHs()\` and \`atom.GetIsAromatic()\`.
- \`mol.GetBondBetweenAtoms(i, j).GetBondType()\` gives SINGLE, DOUBLE, TRIPLE or AROMATIC.

Hydrogens are **implicit** by default, so \`Chem.MolFromSmiles('CCO').GetNumAtoms()\` is 3. \`Chem.AddHs(mol)\` makes them explicit atoms, which is needed before generating 3D coordinates, because hydrogens take up space.`,
    },
    {
      kind: 'truefalse',
      prompt: '`Chem.MolFromSmiles(\'CCO\').GetNumAtoms()` returns 9, because ethanol is C₂H₆O.',
      answer: false,
      why: 'Hydrogens are implicit by default, so only the 3 heavy atoms are atoms of the Mol. After `Chem.AddHs(mol)` the count becomes 9. Mixing up the two is a classic source of off-by-hydrogens bugs.',
    },
    {
      kind: 'explain',
      title: 'Substructure search with SMARTS',
      body: String.raw`**SMARTS** is a query language that extends SMILES with wildcards and conditions: \`[OH]\` means "an O with exactly one H", \`[#6]\` is "any carbon, aromatic or not", \`[CX3]\` is "an aliphatic carbon with 3 connections", and lowercase \`c\` is "an aromatic carbon".

- \`q = Chem.MolFromSmarts('C(=O)[OH]')\` builds a query (here: a carboxylic acid).
- \`mol.HasSubstructMatch(q)\` returns True or False.
- \`mol.GetSubstructMatches(q)\` returns a tuple of matches, each a tuple of **atom indices** in the order of the query atoms.

This is how functional-group filters, PAINS alerts and reaction templates are applied to millions of molecules.`,
    },
    {
      kind: 'widget',
      title: 'Try some queries',
      body: 'Pick a query and a molecule. Each match is highlighted and the result is printed as RDKit would print it.',
      widget: { type: 'DrugSubstructureMatch', props: { molecule: 'aspirin', query: 0 }, caption: 'Small grey numbers are atom indices. Note that `c1ccccc1` matches all three, although the SMILES are written in Kekulé form: sanitisation has made the rings aromatic. For symmetric queries like the ring, RDKit may list the matched atoms in a different order.' },
    },
    {
      kind: 'mcq',
      prompt: 'Aspirin’s ring carries an oxygen. Why does the phenol query `c[OH]` find **no** match in aspirin but does match paracetamol?',
      choices: [
        'Aspirin’s ring oxygen is an ester oxygen with no hydrogen',
        'Aspirin’s ring is not aromatic after sanitisation',
        'SMARTS cannot match oxygen atoms',
        'Aspirin has no oxygen attached to its ring',
      ],
      answer: 0,
      why: '`[OH]` requires exactly one attached hydrogen. In aspirin the ring oxygen is acylated (Ar–O–C(=O)CH₃), so it has none, whereas paracetamol has a free phenolic OH. The ring is aromatic in both after sanitisation.',
    },
    {
      kind: 'widget',
      title: 'Descriptors and matches',
      body: 'Continuing with the aspirin `mol` from before: three descriptors from the previous lessons, and a substructure query.',
      widget: {
        type: 'CodeTracer',
        props: {
          lang: 'python',
          code: propsCode,
          trace: [
            { line: 1, note: 'Descriptor functions live in several modules.' },
            { line: 3, out: '180.16', note: 'Average molecular weight, implicit H included.' },
            { line: 4, out: '1.31', note: 'Wildman–Crippen logP: a sum of atom-type contributions (a prediction, not a measurement).' },
            { line: 5, out: '63.6', note: 'Ertl TPSA: 2 × 17.07 (C=O) + 20.23 (OH) + 9.23 (ester O).' },
            { line: 6, vars: { acid: '<Mol query>' }, note: 'SMARTS for a carboxylic acid.' },
            { line: 7, out: 'True' },
            { line: 8, out: '((10, 11, 12),)', note: 'One match: atoms 10 (C), 11 (=O), 12 (OH), in query order.' },
          ],
        },
      },
    },
    {
      kind: 'explain',
      title: 'Fingerprints and 3D in a few lines',
      body: String.raw`**Morgan/ECFP fingerprints** come from a *generator* object:

- \`gen = rdFingerprintGenerator.GetMorganGenerator(radius=2, fpSize=2048)\` sets up ECFP4-like bits (radius 2 = diameter 4).
- \`fp = gen.GetFingerprint(mol)\` returns a 2048-bit vector.
- \`DataStructs.TanimotoSimilarity(fp1, fp2)\` compares two fingerprints.

**Conformers** come from ETKDG:

- \`molH = Chem.AddHs(mol)\` adds explicit hydrogens first.
- \`AllChem.EmbedMultipleConfs(molH, numConfs=20, params=AllChem.ETKDGv3())\` generates 20 conformers.
- \`AllChem.MMFFOptimizeMoleculeConfs(molH)\` relaxes them with the MMFF force field.

Set \`params.randomSeed\` to make the embedding reproducible.`,
      widget: { type: 'MolGraphFingerprint', props: { molecule: 'aspirin', view: 'bits' }, caption: 'A toy version of what the Morgan generator computes: tap an atom to see the bits its circular environments set.' },
    },
    {
      kind: 'widget',
      title: 'Standardise before you compare',
      body: String.raw`The same drug can arrive as a salt, a charged form or a different tautomer. Unless you **standardise**, it will look like two different molecules and get different descriptors. RDKit's \`rdMolStandardize\` module provides the usual steps (see also the ChEMBL structure pipeline, Bento et al. 2020).`,
      widget: {
        type: 'CodeTracer',
        props: {
          lang: 'python',
          code: stdCode,
          trace: [
            { line: 3, vars: { salt: 'aspirin anion + Na⁺ (2 fragments)' }, note: 'Sodium acetylsalicylate, as a supplier might list it.' },
            { line: 4, vars: { parent: 'carboxylate anion' }, note: 'FragmentParent cleans the structure and keeps the parent (largest organic) fragment, dropping the counter-ion.' },
            { line: 5, vars: { neutral: 'neutral aspirin' }, note: 'Uncharger adds H⁺ to neutralise charges where possible.' },
            { line: 6, out: 'CC(=O)Oc1ccccc1C(=O)O', note: 'Now identical to the canonical SMILES of aspirin, so duplicates can be detected. TautomerEnumerator().Canonicalize(mol) would also pick a canonical tautomer.' },
          ],
        },
      },
    },
    {
      kind: 'order',
      prompt: 'Order the steps of a sensible pipeline that turns a vendor SMILES file into a deduplicated, fingerprinted library.',
      steps: [
        'Parse each SMILES with `Chem.MolFromSmiles`',
        'Drop or log entries that returned `None`',
        'Standardise: keep the parent fragment, neutralise, canonicalise tautomers',
        'Compute canonical SMILES or InChIKey and remove duplicates',
        'Compute fingerprints and descriptors for the unique molecules',
      ],
      why: 'You can only standardise valid Mol objects, and you must standardise *before* deduplicating, otherwise a salt and its free form count as two compounds. Fingerprinting last avoids wasted work on duplicates.',
    },
    {
      kind: 'match',
      prompt: 'Match each RDKit call to what it does.',
      pairs: [
        ['`Chem.MolFromSmiles`', 'Parse and sanitise a SMILES string'],
        ['`Chem.MolFromSmarts`', 'Build a substructure query'],
        ['`Chem.AddHs`', 'Make hydrogens explicit atoms'],
        ['`AllChem.EmbedMultipleConfs`', 'Generate 3D conformers'],
        ['`DataStructs.TanimotoSimilarity`', 'Compare two fingerprints'],
      ],
      why: 'Reading (SMILES → Mol), querying (SMARTS), preparing for 3D (AddHs), embedding conformers (ETKDG) and similarity (Tanimoto) are the five calls you will use most.',
    },
    {
      kind: 'fill',
      prompt: '`GetSubstructMatches` returns tuples of atom ___. Hydrogens are ___ by default. RDKit’s default 3D embedding method is ___.',
      bank: ['indices', 'symbols', 'implicit', 'explicit', 'ETKDG', 'MMFF'],
      answer: ['indices', 'implicit', 'ETKDG'],
      why: 'Matches are reported as atom indices, in the order of the query atoms. Hydrogens are stored as counts on heavy atoms unless you call `AddHs`. ETKDG embeds the conformers; MMFF is a force field used afterwards to *optimise* them.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- \`Chem.MolFromSmiles\` → a **Mol**, after **sanitisation** (valence, rings, aromaticity, implicit H). Failure returns **None**, so always check.
- Mols are graphs: iterate atoms and bonds; atom indices follow SMILES order; \`AddHs\` makes hydrogens explicit.
- **SMARTS** queries + \`GetSubstructMatches\` give tuples of matched atom indices.
- Descriptors (\`MolWt\`, \`MolLogP\`, \`CalcTPSA\`), Morgan fingerprints via a generator, Tanimoto via \`DataStructs\`, and 3D via ETKDG + optional MMFF.
- **Standardise** (parent fragment, neutralise, canonical tautomer) before deduplicating or modelling.`,
    },
  ],
  references: [
    { authors: 'Landrum, G., et al.', title: 'RDKit: Open-source cheminformatics', venue: 'Software and documentation', url: 'https://www.rdkit.org' },
    { authors: 'Landrum, G.', title: 'Getting Started with the RDKit in Python', venue: 'RDKit documentation', url: 'https://www.rdkit.org/docs/GettingStartedInPython.html' },
    { authors: 'Riniker, S., Landrum, G. A.', title: 'Better informed distance geometry: using what we know to improve conformation generation', year: 2015, venue: 'J. Chem. Inf. Model. 55, 2562–2574' },
    { authors: 'Bento, A. P., Hersey, A., Félix, E., et al.', title: 'An open source chemical structure curation pipeline using RDKit', year: 2020, venue: 'J. Cheminform. 12, 51' },
  ],
} satisfies LessonContent;
