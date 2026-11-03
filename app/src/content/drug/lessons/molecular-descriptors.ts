import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Numbers that summarise a molecule',
      body: String.raw`A fingerprint asks hundreds of yes/no questions about substructures. A **molecular descriptor** asks one question and answers with **a number**: How heavy is it? How greasy? How much polar surface does it show to water?

Todeschini & Consonni define a descriptor, roughly, as the number that comes out of a fixed procedure applied to a representation of the molecule. Descriptors are usually grouped by what they need as input:

- **0D/1D**: atom and fragment counts, molecular weight, H-bond donors and acceptors.
- **2D (topological)**: computed from the [molecular graph](@drug/molecular-representations), e.g. TPSA, Crippen logP, the Wiener index.
- **3D**: need atomic coordinates, e.g. volume, shape, 3D polar surface area.`,
    },
    {
      kind: 'recall',
      title: 'Why polarity matters',
      points: [
        'Electronegative atoms (O, N) pull electron density towards themselves, making **polar** bonds.',
        'O–H and N–H groups are **hydrogen-bond donors**; lone pairs on O and N are **acceptors**.',
        'Water rewards polar, H-bonding groups; non-polar (greasy) groups are pushed together by the **hydrophobic effect**.',
        'A drug must be polar enough to dissolve in blood but non-polar enough to cross lipid membranes.',
      ],
      link: 'chem/intermolecular-forces',
    },
    {
      kind: 'explain',
      title: 'Counting descriptors',
      body: String.raw`The simplest descriptors are counts read straight off the graph:

- **Molecular weight (MW)**: add atomic masses, implicit hydrogens included. Aspirin, C₉H₈O₄: $9(12.011) + 8(1.008) + 4(15.999) = 180.16$ Da.
- **H-bond donors (HBD)**: Lipinski's simple version counts OH and NH groups. Aspirin: 1 (the acid OH).
- **H-bond acceptors (HBA)**: Lipinski's version counts all N and O atoms. Aspirin: 4.
- **Rotatable bonds**: single, non-ring bonds between two non-terminal heavy atoms (amide C–N bonds are usually excluded). A measure of flexibility.

Different toolkits use slightly different rules for HBD, HBA and rotatable bonds, so always say which definition you used.`,
    },
    {
      kind: 'numeric',
      prompt: 'Paracetamol has the formula C₈H₉NO₂. Using C = 12.011, H = 1.008, N = 14.007 and O = 15.999, what is its molecular weight?',
      answer: 151.165,
      tolerance: 0.05,
      unit: 'Da',
      why: '$8(12.011) + 9(1.008) + 14.007 + 2(15.999) = 96.088 + 9.072 + 14.007 + 31.998 = 151.165$ Da. A common slip is forgetting the hydrogens, which are implicit in SMILES and skeletal drawings but still count.',
    },
    {
      kind: 'explain',
      title: 'logP: how greasy is it?',
      body: String.raw`The **partition coefficient** $P$ is the ratio of concentrations when a neutral compound shares itself between octanol (a stand-in for membranes) and water:

$$\log P = \log_{10}\frac{[X]_{\text{octanol}}}{[X]_{\text{water}}}$$

Each unit of logP is a **factor of 10**. logP = 3 means 1000 times more in octanol.

**Crippen logP** (Wildman & Crippen 1999) predicts it by **adding up atom contributions**: every atom, hydrogens included, is assigned one of a few dozen atom types, and each type carries a fitted value $a_i$, so $\log P \approx \sum_i n_i a_i$. It is fast and transparent, but only approximate. RDKit gives ibuprofen 3.07, while its measured logP is about 4.

For ionisable drugs, **logD** (at a stated pH, usually 7.4) counts all charge states, which is what matters in the body.`,
    },
    {
      kind: 'widget',
      title: 'Descriptors from a graph',
      body: 'Switch molecules and compare the bars. The blue discs show each polar atom’s TPSA contribution (area ∝ contribution). Tap an atom to see its contribution and its bond-count distance to every other atom.',
      widget: { type: 'DrugDescriptorPanel', props: { molecule: 'aspirin' }, caption: 'MW, HBD, HBA, TPSA and the Wiener index are computed live from the graph; logP values are RDKit Crippen predictions. Note how far paracetamol’s predicted logP (1.35) sits from its measured value (≈ 0.5).' },
    },
    {
      kind: 'mcq',
      prompt: 'Crippen logP predicts ibuprofen at 3.07 and aspirin at 1.31. Taking these at face value, roughly how many times larger is ibuprofen’s octanol/water ratio $P$?',
      choices: ['About 1.8 times', 'About 6 times', 'About 60 times', 'About 600 times'],
      answer: 2,
      why: 'logP is a base-10 logarithm, so a difference of $3.07 - 1.31 = 1.76$ units means a factor of $10^{1.76} \\approx 58$, i.e. about 60. Reading the difference of 1.76 as a ratio ("about 1.8 times") forgets the logarithm.',
    },
    {
      kind: 'explain',
      title: 'TPSA: polar surface without 3D',
      body: String.raw`The **polar surface area (PSA)** is the part of a molecule's surface that belongs to N and O atoms (and their H). Computing it properly needs a 3D structure. **Topological PSA** (Ertl, Rohde & Selzer 2000) skips the 3D step: each polar fragment type gets a tabulated contribution, fitted to reproduce 3D PSA, and TPSA is their sum.

Some contributions (Å²): carbonyl O= 17.07, hydroxyl OH 20.23, ether/ester –O– 9.23, amide-type NH 12.03.

Aspirin: $2(17.07) + 20.23 + 9.23 = 63.60$ Å².

As rough guides, TPSA above ~140 Å² predicts poor oral absorption (Veber et al. 2002), and drugs meant to enter the brain usually have much lower TPSA (below ~90 Å² is a common rule of thumb).`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Paracetamol (\`CC(=O)Nc1ccc(O)cc1\`) has one carbonyl O (17.07 Å²), one amide NH (12.03 Å²) and one phenolic OH (20.23 Å²). What is its TPSA?`,
      answer: 49.33,
      tolerance: 0.02,
      unit: 'Å²',
      why: 'TPSA is simply the sum of the fragment contributions: $17.07 + 12.03 + 20.23 = 49.33$ Å². Carbons and carbon-bound hydrogens contribute nothing, which is why the calculation is so fast.',
    },
    {
      kind: 'explain',
      title: 'Topological indices',
      body: String.raw`**Topological indices** turn the shape of the graph itself into a number. The oldest is the **Wiener index** (Wiener 1947): the sum of shortest-path distances, counted in bonds, over all pairs of heavy atoms.

$$W = \sum_{i<j} d_{ij}$$

**n-Butane** (C–C–C–C): three pairs at distance 1, two at distance 2, one at distance 3, so $W = 3 + 4 + 3 = 10$. **Isobutane** (three CH₃ on one C): three pairs at distance 1 and three at distance 2, so $W = 9$.

More branching makes a molecule more compact and gives a smaller $W$. Wiener showed this tracks alkane boiling points: n-butane boils at −0.5 °C, isobutane at −12 °C. Later indices (Randić connectivity, Balaban J, Kier–Hall shape indices) refine the same idea.`,
    },
    {
      kind: 'numeric',
      prompt: 'What is the Wiener index of n-pentane (C–C–C–C–C, heavy atoms only)?',
      answer: 20,
      tolerance: 0,
      why: 'In a chain of 5 atoms there are 4 pairs at distance 1, 3 at distance 2, 2 at distance 3 and 1 at distance 4: $4 + 6 + 6 + 4 = 20$. Its branched isomer neopentane is more compact, with $W = 4(1) + 6(2) = 16$.',
    },
    {
      kind: 'explain',
      title: '3D descriptors and practical caveats',
      body: String.raw`**3D descriptors** (molecular volume, principal moments of inertia, 3D PSA, shape and pharmacophore descriptors) depend on the **conformer** you computed them from, so they inherit all the uncertainty of [3D structure generation](@drug/conformers-3d).

Before using descriptors in a model:

- **Many are correlated** (MW, heavy-atom count and volume rise together). Remove near-duplicates or use regularised models.
- **Scale them**: MW runs in the hundreds, HBD in single digits.
- **Record the software and version**, because definitions differ between toolkits.

Descriptor vectors are the classic input for [QSAR](@drug/qsar) and for the rules of thumb in [drug-likeness](@drug/drug-likeness).`,
    },
    {
      kind: 'match',
      prompt: 'Match each descriptor to what it mainly captures.',
      pairs: [
        ['Crippen logP', 'Lipophilicity, as a sum of atom-type contributions'],
        ['TPSA', 'Polar surface, as a sum of N/O fragment contributions'],
        ['Wiener index', 'Graph compactness and branching'],
        ['Rotatable bond count', 'Flexibility'],
        ['Principal moments of inertia', '3D shape of one conformer'],
      ],
      why: 'logP and TPSA are both additive 2D schemes, but one sums lipophilic contributions over all atoms and the other sums polar contributions over N and O fragments. The Wiener index uses graph distances only, and moments of inertia need 3D coordinates.',
    },
    {
      kind: 'multi',
      prompt: 'Which statements about descriptors are **true**? (Select all.)',
      choices: [
        'TPSA can be computed without generating any 3D coordinates.',
        'Crippen logP is measured experimentally for every molecule in a database.',
        'A 3D descriptor can change when a different conformer of the same molecule is used.',
        'HBD and HBA counts can differ slightly between software packages.',
        'A branched alkane has a larger Wiener index than its straight-chain isomer.',
      ],
      answers: [0, 2, 3],
      why: 'TPSA is a fragment sum on the graph, 3D descriptors depend on the conformer, and donor/acceptor definitions vary between toolkits. Crippen logP is a *prediction* from atom contributions, not a measurement, and branching *lowers* the Wiener index (isobutane 9 versus n-butane 10).',
    },
    {
      kind: 'truefalse',
      prompt: 'Two molecules with identical MW, logP, TPSA, HBD and HBA must be the same molecule.',
      answer: false,
      why: 'A handful of numbers cannot identify a molecule: isomers often share MW, HBD and HBA exactly, and many different structures have similar logP and TPSA. Descriptors *summarise* a molecule; identity needs a canonical SMILES or InChI.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **descriptor** is a number computed by a fixed procedure from a molecular representation: counts (0D/1D), graph-based (2D) or coordinate-based (3D).
- **MW, HBD, HBA, rotatable bonds**: simple counts, but state the definition used.
- **Crippen logP** (Wildman & Crippen 1999) sums atom-type contributions to predict lipophilicity. One log unit is a factor of 10, and the predictions can be off by about a unit.
- **TPSA** (Ertl et al. 2000) sums polar fragment contributions, e.g. aspirin $63.6$ Å², with no 3D structure needed.
- **Topological indices** such as the Wiener index encode branching and size.
- Scale and de-correlate descriptors before modelling, and remember that 3D descriptors depend on the conformer.`,
    },
  ],
  references: [
    { authors: 'Todeschini, R., Consonni, V.', title: 'Molecular Descriptors for Chemoinformatics', year: 2009, venue: '2nd ed., Wiley-VCH (Methods and Principles in Medicinal Chemistry)' },
    { authors: 'Wildman, S. A., Crippen, G. M.', title: 'Prediction of physicochemical parameters by atomic contributions', year: 1999, venue: 'J. Chem. Inf. Comput. Sci. 39, 868–873' },
    { authors: 'Ertl, P., Rohde, B., Selzer, P.', title: 'Fast calculation of molecular polar surface area as a sum of fragment-based contributions and its application to the prediction of drug transport properties', year: 2000, venue: 'J. Med. Chem. 43, 3714–3717' },
    { authors: 'Wiener, H.', title: 'Structural determination of paraffin boiling points', year: 1947, venue: 'J. Am. Chem. Soc. 69, 17–20' },
    { authors: 'Veber, D. F., Johnson, S. R., Cheng, H.-Y., et al.', title: 'Molecular properties that influence the oral bioavailability of drug candidates', year: 2002, venue: 'J. Med. Chem. 45, 2615–2623' },
  ],
} satisfies LessonContent;
