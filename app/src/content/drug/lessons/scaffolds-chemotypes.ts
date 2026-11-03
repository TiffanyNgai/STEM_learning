import type { LessonContent } from '../../types';

// Generic molecule: two six-membered rings joined by a 2-atom linker, with side chains that fade away.
const hex = (cx: number, cy: number, r = 24) =>
  Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 180) * (60 * k);
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
const fade = (begin: string) => `<animate attributeName="opacity" values="1;1;0.08;0.08;1" keyTimes="0;0.25;0.4;0.9;1" dur="8s" begin="${begin}" repeatCount="indefinite"/>`;
const murckoSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
<text x="10" y="14" font-size="10" font-weight="700" fill="var(--fg)">Molecule → Bemis–Murcko framework</text>
<g stroke="var(--c2)" stroke-width="2.5" fill="var(--c2)" fill-opacity="0.12">
<polygon points="${hex(90, 105)}"/><polygon points="${hex(230, 105)}"/></g>
<g stroke="var(--c4)" stroke-width="2.5" fill="none"><polyline points="114,105 137,92 160,105 183,92 206,105"/></g>
<g stroke="var(--c5)" stroke-width="2" fill="none">
<g>${fade('0s')}<line x1="78" y1="84.2" x2="70" y2="62"/><text x="68" y="56" font-size="10" fill="var(--c5)" stroke="none" text-anchor="middle">CH₃</text></g>
<g>${fade('0s')}<line x1="66" y1="105" x2="44" y2="105"/><text x="34" y="109" font-size="10" fill="var(--c5)" stroke="none" text-anchor="middle">Cl</text></g>
<g>${fade('0s')}<line x1="242" y1="125.8" x2="252" y2="146"/><text x="258" y="160" font-size="10" fill="var(--c5)" stroke="none" text-anchor="middle">OCH₃</text></g>
<g>${fade('0s')}<line x1="160" y1="105" x2="160" y2="128"/><text x="160" y="140" font-size="10" fill="var(--c5)" stroke="none" text-anchor="middle">=O</text></g>
<g>${fade('0s')}<line x1="254" y1="105" x2="276" y2="92"/><line x1="276" y1="92" x2="298" y2="105"/></g>
</g>
<rect x="10" y="176" width="10" height="8" fill="var(--c2)"/><text x="24" y="183" font-size="9" fill="var(--fg)">ring systems</text>
<rect x="100" y="176" width="10" height="8" fill="var(--c4)"/><text x="114" y="183" font-size="9" fill="var(--fg)">linker</text>
<rect x="160" y="176" width="10" height="8" fill="var(--c5)"/><text x="174" y="183" font-size="9" fill="var(--fg)">side chains (removed)</text>
<text x="310" y="196" font-size="8" fill="var(--muted)" text-anchor="end">whether exocyclic =O is kept differs between implementations</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Families of molecules',
      body: String.raw`Chemists rarely think about one molecule at a time. They talk about **series** or **chemotypes**: families that share a core and differ in their decorations. The benzodiazepines diazepam, oxazepam and lorazepam, or the kinase inhibitors built on an anilinopyrimidine core, are examples.

The shared core is the **scaffold**. Defining it precisely lets a computer group thousands of compounds into series, count how many different chemotypes a library holds, and check whether a model has really learned something new.`,
    },
    {
      kind: 'recall',
      title: 'Fingerprints & similarity',
      points: [
        'Fingerprints encode substructures as bits; **Tanimoto** $= c/(a+b-c)$ compares them.',
        'The **similarity principle**: similar structures tend to have similar activity.',
        'Fingerprint similarity depends on *all* atoms, side chains included, so it can miss a shared core or overstate one.',
      ],
      link: 'drug/fingerprints-similarity',
    },
    {
      kind: 'explain',
      title: 'Bemis–Murcko frameworks (1996)',
      body: String.raw`Bemis and Murcko split every molecule into three kinds of atoms:

- **Ring systems**: rings, with fused rings counted as one system.
- **Linkers**: the atoms on the paths that connect ring systems.
- **Side chains**: all other (acyclic, terminal) atoms.

The **framework** (or **Murcko scaffold**) is ring systems + linkers, with side chains deleted. The **graph framework** goes further: every atom is treated as the same and every bond as the same, leaving only the shape.

Analysing about 5,000 known drugs, they found that the 32 most common graph frameworks described half of them. Drug structures concentrate on a small set of shapes.`,
      widget: { type: 'SvgDiagram', props: { svg: murckoSvg }, caption: 'The side chains fade away. The ring systems and the linker joining them remain: that is the framework.' },
    },
    {
      kind: 'widget',
      title: 'The framework of imatinib',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            '**Imatinib** (Gleevec), a kinase inhibitor for chronic myeloid leukaemia, contains a pyridine, a pyrimidine, two benzene rings and an N-methylpiperazine.',
            '**Find the ring systems.** No rings are fused, so there are five separate ring systems: pyridine, pyrimidine, benzene, benzene, piperazine.',
            '**Find the linkers.** pyridine–pyrimidine: a direct bond (zero linker atoms). pyrimidine–**NH**–benzene. benzene–**NH–C(=O)**–benzene (the amide). benzene–**CH₂**–piperazine.',
            '**Delete side chains.** The methyl on the central benzene and the N-methyl on piperazine go.',
            '**Framework:** pyridine–pyrimidine–NH–benzene–NHC(O)–benzene–CH₂–piperazine. **Graph framework:** the same skeleton with all atoms and bonds made generic.',
          ],
          notes: [
            '',
            'Fused systems such as naphthalene or indole would count as one ring system each.',
            'Linker atoms lie on a path between two ring systems, so they are kept even though they are acyclic.',
            'That methyl (the "flag methyl") is reported to be important for imatinib’s kinase selectivity, which shows the framework deliberately throws away SAR detail.',
            'Many implementations, RDKit’s MurckoScaffold included, keep atoms double-bonded to the framework, such as the amide =O.',
          ],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: 'How many rings does the Bemis–Murcko framework of imatinib contain?',
      answer: 5,
      tolerance: 0,
      why: 'Pyridine, pyrimidine, two benzenes and the piperazine: five rings, none fused. Removing side chains never removes rings. The piperazine stays even though its N-methyl goes.',
    },
    {
      kind: 'mcq',
      prompt: 'Starting from the Bemis–Murcko framework, what does the *graph* framework discard in addition?',
      choices: [
        'Element types and bond orders',
        'All linker atoms',
        'All ring systems except the largest',
        'Stereochemistry only',
      ],
      answer: 0,
      why: 'The graph framework keeps the topology (which atoms connect to which) but treats every atom and bond alike, so a pyridine and a benzene become the same hexagon. Linkers and all ring systems are kept in both versions.',
    },
    {
      kind: 'explain',
      title: 'Series, chemotypes and scaffold splits',
      body: String.raw`Grouping compounds by framework gives a quick map of a data set's **chemotypes**. Hierarchical schemes such as the **scaffold tree** (Schuffenhauer et al. 2007) peel off one ring at a time to relate scaffolds to one another.

Scaffolds also matter for **machine-learning evaluation**. In a random split, test molecules usually have close relatives with the same scaffold in the training set, so scores look good. A **scaffold split** puts whole frameworks into either training or test. It is a harder test, closer to the real task of predicting a *new* series (compare [cross-validation](@ml/cross-validation)).`,
      widget: { type: 'DrugChemSpaceMap', props: { method: 'tsne', seed: 3 }, caption: 'Four synthetic compound series projected to 2D. Each colour is like one chemotype. A scaffold split would hold out whole colours, not random dots.' },
    },
    {
      kind: 'truefalse',
      prompt: 'A random train/test split usually gives a more optimistic estimate of performance on new chemical series than a scaffold split does.',
      answer: true,
      why: 'With a random split, most test compounds have near-twins sharing their scaffold in the training set, so the task is mostly interpolation. Scaffold splits force generalisation to unseen frameworks, which is what a project starting a new series needs.',
    },
    {
      kind: 'explain',
      title: 'Scaffold hopping',
      body: String.raw`**Scaffold hopping** means finding a compound with a **different core** that keeps the same biological activity. Reasons include escaping a competitor's patent, fixing poor solubility, metabolism or toxicity tied to the old core, or finding a series that is easier to make.

The **statins** show it well. Lovastatin, a fungal natural product, has a bicyclic hexahydronaphthalene core. Fully synthetic successors kept the **3,5-dihydroxy acid** side chain that mimics the HMG-CoA intermediate, but placed it on new cores: a pyrrole in atorvastatin, a pyrimidine in rosuvastatin, an indole in fluvastatin.

Sun, Tawa and Wallqvist (2012) classify hops by how much the core changes: heterocycle swaps, ring opening or closure, peptide → non-peptide mimics, and complete topology changes.`,
    },
    {
      kind: 'explain',
      title: 'Bioisosteres',
      body: String.raw`Many hops are built from **bioisosteres**: groups that differ in structure but have similar physical or biological effects, so swapping them keeps activity while changing other properties (Meanwell 2011).

- **Carboxylic acid → tetrazole.** It has similar acidity and charge, but is more lipophilic and resists some metabolism. The angiotensin II blocker **losartan** carries a tetrazole in place of an acid.
- **Benzene → pyridine or thiophene.** Similar shape; pyridine adds polarity and an H-bond acceptor.
- **H → F.** Nearly the same size; blocks a metabolic soft spot and changes electronics.
- **Amide → heterocycle** (e.g. oxadiazole). Keeps geometry and removes a hydrolysable bond.`,
    },
    {
      kind: 'match',
      prompt: 'Match each idea to its example.',
      pairs: [
        ['Acid bioisostere', 'Tetrazole in losartan'],
        ['Scaffold hop on a conserved side chain', 'Lovastatin → atorvastatin'],
        ['Side chain removed by Murcko', 'The N-methyl group on imatinib’s piperazine'],
        ['Linker atom', 'The CH₂ joining imatinib’s benzene and piperazine'],
      ],
      why: 'Tetrazole mimics a carboxylate. Atorvastatin keeps the statin dihydroxy acid on a new pyrrole core. Terminal acyclic groups are side chains, while acyclic atoms between rings are linkers and stay in the framework.',
    },
    {
      kind: 'multi',
      prompt: 'Which are legitimate reasons to scaffold hop?',
      choices: [
        'Move into chemical space not covered by a competitor’s patents',
        'Escape a toxicity or metabolic liability tied to the original core',
        'Guarantee that potency stays exactly the same',
        'Improve properties such as solubility or synthetic accessibility',
      ],
      answers: [0, 1, 3],
      why: 'Hops target new IP, fewer liabilities and better properties. Nothing guarantees retained potency: a new core repositions every substituent, so hops are hypotheses that must be tested, and many fail.',
    },
    {
      kind: 'fill',
      prompt: 'A Bemis–Murcko framework keeps ring systems and ___ atoms and deletes ___ chains. Swapping a carboxylic acid for a tetrazole is a classic ___ replacement.',
      bank: ['linker', 'ring', 'side', 'main', 'bioisosteric', 'stereochemical'],
      answer: ['linker', 'side', 'bioisosteric'],
      why: 'Framework = ring systems + linkers; side chains are removed. Tetrazole and carboxylic acid have similar acidity and charge, which is the definition of a bioisosteric swap.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Bemis–Murcko framework** = ring systems + linkers (side chains removed). The **graph framework** also makes atoms and bonds generic.
- Frameworks group compounds into **chemotypes/series**. A few frameworks cover many drugs.
- **Scaffold splits** give a more honest estimate of performance on new series than random splits.
- **Scaffold hopping** keeps activity on a new core (e.g. lovastatin → atorvastatin) for IP, safety or property reasons, often using **bioisosteres** (acid → tetrazole).`,
    },
  ],
  references: [
    { authors: 'Bemis, G. W., Murcko, M. A.', title: 'The properties of known drugs. 1. Molecular frameworks', year: 1996, venue: 'J. Med. Chem. 39, 2887–2893' },
    { authors: 'Schuffenhauer, A., Ertl, P., Roggo, S., Wetzel, S., Koch, M. A., Waldmann, H.', title: 'The Scaffold Tree — visualization of the scaffold universe by hierarchical scaffold classification', year: 2007, venue: 'J. Chem. Inf. Model. 47, 47–58' },
    { authors: 'Sun, H., Tawa, G., Wallqvist, A.', title: 'Classification of scaffold-hopping approaches', year: 2012, venue: 'Drug Discov. Today 17, 310–324' },
    { authors: 'Meanwell, N. A.', title: 'Synopsis of some recent tactical application of bioisosteres in drug design', year: 2011, venue: 'J. Med. Chem. 54, 2529–2591' },
  ],
} satisfies LessonContent;
