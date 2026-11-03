import type { LessonContent } from '../../types';

const archSvg = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
<g font-size="9" text-anchor="middle">
<rect x="6" y="20" width="62" height="30" rx="6" fill="var(--c6)" fill-opacity="0.2" stroke="var(--c6)"/>
<text x="37" y="33" fill="var(--fg)" font-weight="700">sequence</text><text x="37" y="44" fill="var(--muted)">1 chain</text>
<rect x="6" y="66" width="62" height="30" rx="6" fill="var(--c6)" fill-opacity="0.2" stroke="var(--c6)"/>
<text x="37" y="79" fill="var(--fg)" font-weight="700">MSA</text><text x="37" y="90" fill="var(--muted)">homologues</text>
<rect x="6" y="112" width="62" height="30" rx="6" fill="var(--c6)" fill-opacity="0.2" stroke="var(--c6)"/>
<text x="37" y="125" fill="var(--fg)" font-weight="700">templates</text><text x="37" y="136" fill="var(--muted)">(optional)</text>
<path d="M68,35 L84,70 M68,81 L84,81 M68,127 L84,96" stroke="var(--fg)" fill="none"/>
<rect x="86" y="40" width="88" height="92" rx="8" fill="var(--c2)" fill-opacity="0.18" stroke="var(--c2)"/>
<text x="130" y="56" fill="var(--fg)" font-weight="700">Evoformer</text><text x="130" y="68" fill="var(--muted)">48 blocks</text>
<rect x="96" y="76" width="68" height="20" rx="3" fill="var(--c4)" fill-opacity="0.25" stroke="var(--c4)"/><text x="130" y="89" fill="var(--fg)">MSA repr.</text>
<rect x="96" y="104" width="68" height="20" rx="3" fill="var(--c3)" fill-opacity="0.25" stroke="var(--c3)"/><text x="130" y="117" fill="var(--fg)">pair repr.</text>
<path d="M124,96 L124,104 M136,104 L136,96" stroke="var(--fg)"/>
<path d="M174,86 L190,86" stroke="var(--fg)"/>
<rect x="192" y="56" width="62" height="60" rx="8" fill="var(--c1)" fill-opacity="0.18" stroke="var(--c1)"/>
<text x="223" y="76" fill="var(--fg)" font-weight="700">structure</text><text x="223" y="87" fill="var(--fg)" font-weight="700">module</text><text x="223" y="100" fill="var(--muted)">IPA, 8 blocks</text>
<path d="M254,86 L266,86" stroke="var(--fg)"/>
<text x="292" y="80" fill="var(--fg)" font-weight="700">3D</text><text x="292" y="92" fill="var(--fg)">+ pLDDT</text><text x="292" y="104" fill="var(--fg)">+ PAE</text>
<path id="rec" d="M223,116 L223,165 L130,165 L130,132" fill="none" stroke="var(--c5)" stroke-dasharray="4 3"/>
<circle r="3.5" fill="var(--c5)"><animateMotion dur="3s" repeatCount="indefinite" path="M223,116 L223,165 L130,165 L130,132"/></circle>
<text x="176" y="180" fill="var(--c5)">recycling (×3)</text>
<text x="160" y="12" fill="var(--muted)">AlphaFold2 at a glance</text>
</g></svg>`;

const triangleSvg = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
<g font-size="10" text-anchor="middle">
<line x1="60" y1="120" x2="260" y2="120" stroke="var(--c5)" stroke-width="3"><animate attributeName="stroke-width" values="3;6;3" dur="2s" repeatCount="indefinite"/></line>
<line x1="60" y1="120" x2="160" y2="30" stroke="var(--c2)" stroke-width="3"/>
<line x1="160" y1="30" x2="260" y2="120" stroke="var(--c2)" stroke-width="3"/>
<circle cx="60" cy="120" r="12" fill="var(--surface)" stroke="var(--fg)"/><text x="60" y="124" fill="var(--fg)" font-weight="700">i</text>
<circle cx="260" cy="120" r="12" fill="var(--surface)" stroke="var(--fg)"/><text x="260" y="124" fill="var(--fg)" font-weight="700">j</text>
<circle cx="160" cy="30" r="12" fill="var(--surface)" stroke="var(--fg)"/><text x="160" y="34" fill="var(--fg)" font-weight="700">k</text>
<text x="160" y="140" fill="var(--c5)">edge ij updated…</text>
<text x="80" y="66" fill="var(--c2)">ik</text><text x="240" y="66" fill="var(--c2)">jk</text>
<text x="160" y="80" fill="var(--muted)">…from edges ik and jk,</text><text x="160" y="92" fill="var(--muted)">summed over every k</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'CASP14: the problem cracks',
      body: String.raw`At CASP14 in 2020, DeepMind's **AlphaFold2** produced models with a median GDT_TS of 92.4 across all targets, close to experimental accuracy for most of them. Its median backbone error was about 1 Å, against roughly 3 Å for the next best method (Jumper et al. 2021; Kryshtafovych et al. 2021). CASP's organisers called the single-chain problem largely solved in a practical sense, and the work shared the 2024 Nobel Prize in Chemistry (Hassabis and Jumper, with David Baker for protein design).

This lesson opens the box at a conceptual level: what goes in, what the network does with it, and how to read its confidence.`,
    },
    {
      kind: 'recall',
      title: 'Attention (from ML)',
      points: [
        'Each token emits a **query**, **key** and **value** vector; attention weights are softmax(query · key / √d).',
        'Each output is a weighted average of the values, so every token can draw on every other token.',
        'Several heads run in parallel; a **bias** added to the logits can steer who attends to whom.',
        'A transformer block = attention + a small feed-forward network, with residual connections and normalisation.',
      ],
      link: 'ml/attention-transformers',
    },
    {
      kind: 'explain',
      title: 'Inputs and two representations',
      body: String.raw`AlphaFold2 first searches large sequence databases for homologues of the target and builds an **MSA**, plus optional **templates** (related known structures).

Inside the network everything lives in two arrays:
- the **MSA representation**: one feature vector per (sequence, residue), size $N_\text{seq} \times N_\text{res} \times 256$;
- the **pair representation**: one feature vector per residue pair $(i, j)$, size $N_\text{res} \times N_\text{res} \times 128$.

Think of the pair representation as a learned, soft version of a [contact map](@drug/protein-representations): it gradually comes to encode how far apart, and in what orientation, each pair of residues is.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A 400-residue protein: how many entries $(i, j)$, counting both orders and $i = j$, does the pair representation have (each holding a 128-number vector)?`,
      answer: 160000,
      tolerance: 0,
      why: String.raw`$N_\text{res}^2 = 400^2 = 160{,}000$ pairs. Memory and compute therefore grow quadratically with length (and triangle operations even cubically), which is why very long proteins and big complexes are expensive to predict.`,
    },
    {
      kind: 'widget',
      title: 'The pipeline',
      body: 'Sequence, MSA and templates are embedded, refined by 48 Evoformer blocks, and turned into 3D coordinates by the structure module. The whole output is fed back in ("recycled") several times.',
      widget: { type: 'SvgDiagram', props: { svg: archSvg }, caption: 'At inference AlphaFold2 recycles 3 times by default, so the network runs 4 times in total, each pass refining the previous prediction.' },
    },
    {
      kind: 'explain',
      title: 'The Evoformer: two streams that talk',
      body: String.raw`Each Evoformer block updates both representations:
- **Row-wise attention** (along one sequence of the MSA, across residues). Its attention logits get a **bias from the pair representation**, so geometry steers which residues share information.
- **Column-wise attention** (one residue position, across all homologues), which pools evolutionary information.
- **Outer product mean**: for each residue pair, combine the two MSA columns and average over sequences. This sends coevolution-like signals from the MSA into the pair representation, a learned successor of [DCA](@drug/protein-structure-prediction).
- **Triangle updates** on the pair representation (next card).`,
    },
    {
      kind: 'explain',
      title: 'Triangle updates: making distances consistent',
      body: String.raw`Distances between three points must obey the triangle inequality, $d_{ij} \le d_{ik} + d_{kj}$. If $i$ is close to $k$ and $k$ is close to $j$, then $i$ cannot be far from $j$.

AlphaFold2 builds this kind of reasoning in. A **triangle multiplicative update** recomputes edge $ij$ of the pair representation from edges $ik$ and $jk$ for every third residue $k$. **Triangle self-attention** does the same with attention, letting edge $ij$ attend over all edges that share residue $i$ (or $j$). The network is not given the inequality as a rule; it is given an architecture where such consistency is easy to learn.`,
      widget: { type: 'SvgDiagram', props: { svg: triangleSvg }, caption: 'Every pair (i, j) looks at all triangles (i, j, k) it belongs to.' },
    },
    {
      kind: 'mcq',
      prompt: 'What is the main purpose of the triangle updates in the Evoformer?',
      choices: [
        'To make the pairwise (distance-like) information geometrically consistent',
        'To search the sequence databases for more homologues',
        'To place side-chain atoms in their final positions',
        'To remove redundant sequences from the MSA',
      ],
      answer: 0,
      why: 'Triangle updates let each residue pair use information from every third residue, which favours pair features that could come from a real 3D object. Database search happens before the network runs, and atoms are placed later by the structure module.',
    },
    {
      kind: 'explain',
      title: 'The structure module: a gas of rigid residues',
      body: String.raw`The structure module treats every residue as a rigid triangle of backbone atoms (N, Cα, C) with its own **frame**, a rotation plus a translation. All frames start at the origin (a "residue gas"), and 8 blocks move them into place.

The key layer is **Invariant Point Attention (IPA)**. It uses 3D points expressed in each residue's local frame, so its result does not change if the whole protein is rotated or shifted. This is a form of [equivariance](@ml/equivariant-networks): the network does not have to learn that a rotated protein is the same protein. Side chains are added by predicting torsion angles. Training uses the **FAPE** loss (frame-aligned point error), which compares atom positions as seen from each residue's frame.`,
    },
    {
      kind: 'match',
      prompt: 'Match each AlphaFold2 component to what it does.',
      pairs: [
        ['Column-wise MSA attention', 'Pools information across homologues at one position'],
        ['Outer product mean', 'Passes MSA information into the pair representation'],
        ['Triangle multiplicative update', 'Updates pair (i, j) using pairs (i, k) and (j, k)'],
        ['Invariant Point Attention', 'Moves residue frames in 3D, unaffected by global rotation'],
        ['Recycling', 'Feeds the outputs back in as inputs for another pass'],
      ],
      why: 'The first three live in the Evoformer and shape the two representations; IPA is the core of the structure module; recycling wraps the whole network so later passes can fix earlier mistakes.',
    },
    {
      kind: 'explain',
      title: 'How confident is the model? pLDDT and PAE',
      body: String.raw`AlphaFold2 also predicts its own errors:
- **pLDDT** (0–100, per residue): the predicted lDDT-Cα score, i.e. how well the local environment of that residue is expected to match the true structure. Bands: ≥ 90 very high, 70–90 confident (backbone usually right), 50–70 low, < 50 very low (often disordered).
- **PAE** (predicted aligned error, in Å, per residue pair): the expected position error of residue $j$ when the model and the truth are superposed on residue $i$. Low PAE between two domains means their **relative placement** is reliable.

pLDDT judges local quality; PAE judges how parts fit together.`,
    },
    {
      kind: 'widget',
      title: 'Read the confidence',
      body: 'Switch between pLDDT colouring and the PAE matrix. Try the "rigid domains" toggle: the domains look the same in pLDDT, but the PAE tells you whether their arrangement can be trusted.',
      widget: {
        type: 'DrugPlddtPae',
        props: { view: 'plddt' },
        caption: 'Illustrative values. Both domains have very high pLDDT. Without a confident interface, the off-diagonal PAE blocks are ~20 Å: each domain is right, but their relative orientation is a guess.',
      },
    },
    {
      kind: 'truefalse',
      prompt: 'If both domains of a two-domain protein have pLDDT above 90, their relative orientation in the model is reliable.',
      answer: false,
      why: 'pLDDT is a local score: each domain can be perfect on its own while the hinge between them is uncertain. The inter-domain blocks of the PAE matrix are what tell you whether the arrangement can be trusted.',
    },
    {
      kind: 'explain',
      title: 'The AlphaFold Protein Structure Database',
      body: String.raw`In July 2021 DeepMind released the AlphaFold2 code, and with EMBL-EBI launched the **AlphaFold Protein Structure Database (AFDB)**: more than 350,000 predictions covering the human proteome and 20 model organisms (Varadi et al. 2022). In 2022 it grew to over 200 million predictions, covering nearly all of UniProt (Varadi et al. 2024). Entries are free to use (CC-BY 4.0), with pLDDT stored in the B-factor column and PAE downloadable.

For drug discovery this means almost every target now has a model to look at, from day one. The next lessons cover what such models do and do not tell you.`,
    },
    {
      kind: 'order',
      prompt: 'Order what happens when AlphaFold2 predicts a structure.',
      steps: [
        'Search sequence databases to build an MSA (and find templates)',
        'Embed the MSA and pair representations',
        'Refine both through the Evoformer blocks',
        'Build 3D residue frames with the structure module',
        'Recycle the outputs and repeat the passes',
        'Report the final model with pLDDT and PAE',
      ],
      why: 'The MSA search runs outside the network and is often the slowest step. Evoformer refines the representations before the structure module turns them into coordinates, and recycling repeats this a few times before the final model and confidence scores are output.',
    },
    {
      kind: 'fill',
      prompt: 'AlphaFold2 keeps an MSA representation and a ___ representation. The ___ module turns them into coordinates, and ___ estimates per-residue confidence.',
      bank: ['pair', 'structure', 'pLDDT', 'PAE', 'docking', 'sequence'],
      answer: ['pair', 'structure', 'pLDDT'],
      why: 'PAE is also a confidence output, but it scores residue pairs (relative positions), not individual residues. "Sequence" is an input, not one of the two internal representations.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- CASP14 (2020): AlphaFold2 reached a median GDT_TS of 92.4, often near experimental accuracy.
- Inputs: an **MSA** (plus templates). Internal state: **MSA** and **pair** representations.
- **Evoformer** (48 blocks): row/column attention, outer product mean, **triangle updates**.
- **Structure module**: residue frames moved by **IPA**, rotation-invariant by design; outputs recycled 3×.
- **pLDDT** = local confidence; **PAE** = confidence in relative positions.
- AFDB: >200 million free predictions. Next: [RoseTTAFold, AlphaFold3 & co-folding](@drug/rosettafold-af3).`,
    },
  ],
  references: [
    { authors: 'Jumper, J., Evans, R., Pritzel, A., et al.', title: 'Highly accurate protein structure prediction with AlphaFold', year: 2021, venue: 'Nature 596, 583–589' },
    { authors: 'Kryshtafovych, A., Schwede, T., Topf, M., Fidelis, K., Moult, J.', title: 'Critical assessment of methods of protein structure prediction (CASP)—Round XIV', year: 2021, venue: 'Proteins 89, 1607–1617' },
    { authors: 'Varadi, M., Anyango, S., Deshpande, M., et al.', title: 'AlphaFold Protein Structure Database: massively expanding the structural coverage of protein-sequence space with high-accuracy models', year: 2022, venue: 'Nucleic Acids Res. 50, D439–D444' },
    { authors: 'Varadi, M., Bertoni, D., Magana, P., et al.', title: 'AlphaFold Protein Structure Database in 2024: providing structure coverage for over 214 million protein sequences', year: 2024, venue: 'Nucleic Acids Res. 52, D368–D375' },
    { authors: 'Tunyasuvunakool, K., Adler, J., Wu, Z., et al.', title: 'Highly accurate protein structure prediction for the human proteome', year: 2021, venue: 'Nature 596, 590–596' },
  ],
} satisfies LessonContent;
