import type { LessonContent } from '../../types';

const vennSvg = `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
<circle cx="125" cy="80" r="58" fill="var(--c2)" fill-opacity="0.3" stroke="var(--c2)" stroke-width="2"/>
<circle cx="195" cy="80" r="58" fill="var(--c3)" fill-opacity="0.3" stroke="var(--c3)" stroke-width="2">
<animate attributeName="cx" values="235;195;235" dur="5s" repeatCount="indefinite"/></circle>
<text x="95" y="84" font-size="11" font-weight="700" fill="var(--fg)" text-anchor="middle">A only</text>
<text x="230" y="84" font-size="11" font-weight="700" fill="var(--fg)" text-anchor="middle">B only</text>
<text x="160" y="152" font-size="10" fill="var(--muted)" text-anchor="middle">Tanimoto = overlap ÷ union of "on" bits</text>
<text x="160" y="16" font-size="10" fill="var(--muted)" text-anchor="middle">bits set in fingerprint A vs fingerprint B</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A barcode for every molecule',
      body: String.raw`Comparing two molecular graphs atom-by-atom is slow (the general subgraph problem is NP-hard). Comparing two **barcodes** is instant.

A **molecular fingerprint** is a fixed-length vector of bits (0/1), where each bit records whether some structural feature is present. Two molecules with similar fingerprints share many features — and, by the **similarity principle**, tend to have similar properties and activities. Fingerprints power similarity search, clustering, and many machine-learning models.`,
    },
    {
      kind: 'recall',
      title: 'Hashing (from CS)',
      points: [
        'A hash function maps arbitrary data to a fixed-size integer, deterministically.',
        'Different inputs can map to the same value: a **collision**.',
        'Taking the hash **modulo** $m$ maps it into $m$ buckets.',
      ],
      link: 'cs/hashing',
    },
    {
      kind: 'explain',
      title: 'Two families of fingerprint',
      body: String.raw`- **Substructure keys** (e.g. MACCS, 166 bits): a dictionary of predefined patterns — "contains a carboxylic acid?", "contains a ring of six?". Interpretable, but blind to anything not in the dictionary.
- **Circular / extended-connectivity fingerprints** (ECFP, also called **Morgan** fingerprints; Rogers & Hahn 2010): no dictionary. Every atom's local neighbourhood is turned into an integer by hashing, so *any* substructure can be represented. ECFP is the default workhorse of cheminformatics.`,
    },
    {
      kind: 'widget',
      title: 'The Morgan algorithm, step by step',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            '**Radius 0.** Give each heavy atom an integer identifier by hashing its *invariants*: element, number of heavy neighbours, attached hydrogens, charge, ring membership.',
            '**Radius 1.** For each atom, hash together its own identifier plus the (bond type, identifier) of each neighbour — sorted, so atom numbering does not matter. The new integer describes the atom *and its immediate neighbours*.',
            '**Radius 2.** Repeat, using the radius-1 identifiers. Now each integer encodes a circular environment two bonds wide (diameter 4 → "**ECFP4**").',
            '**Collect.** Gather all identifiers from all atoms and all radii (duplicates removed). Each is a substructure "word".',
            '**Fold.** Map each 32-bit identifier into a bit vector of length $m$ (often 1024 or 2048) with `id mod m`, and set that bit to 1.',
          ],
          notes: ['', 'This is the Weisfeiler–Lehman idea from graph theory — the same message passing that graph neural networks learn.', 'Naming: ECFP4 = radius 2 (diameter 4); RDKit’s Morgan "radius 2" ≈ ECFP4.', '', 'Two different substructures can land on the same bit: a **collision**.'],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: 'An ECFP4 fingerprint corresponds to Morgan iterations up to radius…',
      choices: ['1', '2', '4', '8'],
      answer: 1,
      why: 'The number in ECFP*n* is the **diameter** of the largest environment; diameter 4 = radius 2. Confusing the two is a classic mistake when reproducing papers.',
    },
    {
      kind: 'widget',
      title: 'See the bits',
      body: 'Tap any atom: its radius-0, -1 and -2 identifiers light up as orange bits, and its radius-2 environment is highlighted on the structure. Switch molecules to compare their fingerprints.',
      widget: { type: 'MolGraphFingerprint', props: { molecule: 'aspirin', view: 'bits' }, caption: 'A toy Morgan fingerprint (radius 2). Switch between 64, 128 and 256 bits: with fewer bits, more environments collide and Tanimoto values creep up — at 64 bits caffeine even looks closer to ibuprofen than aspirin does! Real fingerprints use 1024–2048 bits.' },
    },
    {
      kind: 'truefalse',
      prompt: 'Because of folding, two molecules can share an "on" bit even though they share no substructure that maps to it.',
      answer: true,
      why: 'Folding a huge identifier space into $m$ bits means unrelated environments can collide on the same bit. Larger $m$ (or unfolded "count" fingerprints) reduces this — try the 64-bit setting in the widget above to watch collisions inflate similarity.',
    },
    {
      kind: 'explain',
      title: 'Tanimoto similarity',
      body: String.raw`To compare fingerprints A and B, count: $a$ = bits on in A, $b$ = bits on in B, $c$ = bits on in **both**. The **Tanimoto** (Jaccard) coefficient is

$$T(A,B) = \frac{c}{a + b - c}$$

— shared features divided by all features present in either. It runs from 0 (nothing shared) to 1 (identical fingerprints, though not necessarily identical molecules).

Example: $a = 40$, $b = 50$, $c = 30$ → $T = 30/(40+50-30) = 0.5$.`,
      widget: { type: 'SvgDiagram', props: { svg: vennSvg }, caption: 'Tanimoto ignores bits that are off in both molecules — sensible, since absent features carry little information.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Fingerprint A has 36 bits set, B has 44, and 20 bits are set in both. What is the Tanimoto similarity?`,
      answer: 0.3333,
      tolerance: 0.005,
      why: String.raw`$T = 20/(36+44-20) = 20/60 \approx 0.33$. A common error is $c/(a+b) = 0.25$, which double-counts the shared bits in the denominator.`,
    },
    {
      kind: 'explain',
      title: 'How similar is "similar"?',
      body: String.raw`There's no universal threshold — values depend on the fingerprint and bit length. As a rough guide for ECFP4 (2048 bits), pairs above **~0.4–0.5** are often considered meaningfully similar, while random drug-like pairs typically score around 0.1–0.2.

The **similarity principle** has exceptions: **activity cliffs** are pairs of near-identical molecules with very different potency (e.g. adding one methyl group changes activity 100-fold). Cliffs are what make structure–activity relationships, and ML models, hard (Maggiora et al. 2014).`,
    },
    {
      kind: 'multi',
      prompt: 'Which are typical uses of fingerprints in drug discovery?',
      choices: ['Finding purchasable analogues of a hit (similarity search)', 'Clustering a screening library', 'Input features for property-prediction models', 'Measuring a compound’s exact 3D binding pose'],
      answers: [0, 1, 2],
      why: 'ECFP-type fingerprints are 2D topological descriptors: great for search, clustering and ML baselines (fingerprints + random forest is still a strong baseline), but they contain no 3D geometry, so they cannot give a binding pose.',
    },
    {
      kind: 'match',
      prompt: 'Match the term to its meaning.',
      pairs: [
        ['MACCS keys', 'Predefined dictionary of substructure patterns'],
        ['ECFP / Morgan', 'Hashed circular atom environments'],
        ['Folding', 'Reducing identifiers to a fixed number of bits with mod m'],
        ['Activity cliff', 'Very similar structures with very different activity'],
      ],
      why: 'Keys are dictionary-based, ECFP is dictionary-free; folding is what causes bit collisions; activity cliffs are where the similarity principle breaks.',
    },
    {
      kind: 'fill',
      prompt: 'The Tanimoto coefficient divides the number of ___ bits by the number of bits in the ___ of the two fingerprints.',
      bank: ['shared', 'union', 'missing', 'difference', 'total'],
      answer: ['shared', 'union'],
      why: 'T = |A ∩ B| / |A ∪ B| = c / (a + b − c). The union counts each shared bit only once.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Fingerprints turn molecules into fixed-length bit vectors for fast comparison and ML.
- **ECFP/Morgan** (Rogers & Hahn 2010): hash each atom's invariants, iteratively combine with neighbours (radius 2 = ECFP4), then **fold** to $m$ bits — collisions possible.
- **Tanimoto** $T = c/(a+b-c)$ is the standard similarity; thresholds depend on fingerprint type.
- Similar structures *usually* have similar activity — except at **activity cliffs**.`,
    },
  ],
  references: [
    { authors: 'Rogers, D., Hahn, M.', title: 'Extended-connectivity fingerprints', year: 2010, venue: 'J. Chem. Inf. Model. 50, 742–754' },
    { authors: 'Bajusz, D., Rácz, A., Héberger, K.', title: 'Why is Tanimoto index an appropriate choice for fingerprint-based similarity calculations?', year: 2015, venue: 'J. Cheminform. 7, 20' },
    { authors: 'Maggiora, G., Vogt, M., Stumpfe, D., Bajorath, J.', title: 'Molecular similarity in medicinal chemistry', year: 2014, venue: 'J. Med. Chem. 57, 3186–3204' },
    { authors: 'Leach, A. R., Gillet, V. J.', title: 'An Introduction to Chemoinformatics', year: 2007, venue: 'Revised ed., Springer', detail: 'Ch. 5' },
  ],
} satisfies LessonContent;
