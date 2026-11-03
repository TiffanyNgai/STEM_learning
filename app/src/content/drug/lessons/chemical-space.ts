import type { LessonContent } from '../../types';

// log10 scale: x = 118 + 3.15 * log10(N)
const bar = (y: number, label: string, sub: string, lg: number, col: string, delay: number) => {
  const w = (3.15 * lg).toFixed(1);
  return `<text x="4" y="${y + 8}" font-size="9.5" font-weight="700" fill="var(--fg)">${label}</text>
<text x="4" y="${y + 18}" font-size="8" fill="var(--muted)">${sub}</text>
<rect x="118" y="${y + 2}" width="${w}" height="12" rx="2" fill="${col}"><animate attributeName="width" values="0;${w}" dur="1.2s" begin="${delay}s" fill="freeze"/></rect>`;
};
const sizeSvg = `<svg viewBox="0 0 320 214" xmlns="http://www.w3.org/2000/svg">
<text x="160" y="12" text-anchor="middle" font-size="10" fill="var(--muted)">number of molecules (log scale, 10^0 … 10^60)</text>
${bar(20, 'Approved drugs', 'a few thousand', 3.4, 'var(--c1)', 0)}
${bar(48, 'PubChem', '> 100 million', 8.1, 'var(--c2)', 0.2)}
${bar(76, 'GDB-13', '977 million', 8.99, 'var(--c6)', 0.4)}
${bar(104, 'Make-on-demand', 'tens of billions', 10.5, 'var(--c4)', 0.6)}
${bar(132, 'GDB-17', '166.4 billion', 11.22, 'var(--c3)', 0.8)}
${bar(160, 'Drug-like estimate', '~10^60 (Bohacek 1996)', 60, 'var(--c5)', 1.0)}
${[0, 20, 40, 60].map((v) => `<line x1="${118 + 3.15 * v}" x2="${118 + 3.15 * v}" y1="18" y2="186" stroke="var(--grid)" stroke-width="0.6"/><text x="${118 + 3.15 * v}" y="198" text-anchor="middle" font-size="8.5" fill="var(--muted)">10^${v}</text>`).join('')}
<text x="160" y="211" text-anchor="middle" font-size="8.5" fill="var(--muted)">everything ever made is a speck at the left edge</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A space of molecules',
      body: String.raw`**Chemical space** is the set of all possible molecules, imagined as a space in which every molecule is a point. To make it a real space we need coordinates, and those come from the representations you already know: [fingerprints](@drug/fingerprints-similarity) or [descriptors](@drug/molecular-descriptors). Nearby points are similar molecules.

Two questions organise this lesson:

1. **How big is it?** Far bigger than anything we can make or even list.
2. **How can we look at it?** By projecting hundreds of dimensions down to a 2D map.`,
    },
    {
      kind: 'recall',
      title: 'Fingerprints and similarity',
      points: [
        'A fingerprint is a fixed-length bit vector of structural features (e.g. ECFP4, 2048 bits).',
        '**Tanimoto** similarity $T = c/(a+b-c)$ compares two fingerprints.',
        'The **similarity principle**: similar structures tend to have similar properties, apart from activity cliffs.',
      ],
      link: 'drug/fingerprints-similarity',
    },
    {
      kind: 'explain',
      title: 'How many drug-like molecules could exist?',
      body: String.raw`The often-quoted figure is **about $10^{60}$** small organic molecules. It comes from Bohacek, McMartin & Guida (1996), who estimated how many stable structures with up to 30 C, N, O and S atoms could be built. It is a **back-of-the-envelope order of magnitude**, not a count.

Other estimates, using different size limits and chemistry rules, range from about $10^{23}$ to $10^{180}$ (Polishchuk et al. 2013). The robust conclusion is not the exact exponent but that the space is **astronomically larger** than everything ever synthesised. Chemistry databases such as PubChem hold around $10^8$ compounds.`,
    },
    {
      kind: 'mcq',
      prompt: 'What is the best description of the "$10^{60}$ drug-like molecules" figure?',
      choices: [
        'An exact count obtained by enumerating every molecule',
        'A rough order-of-magnitude estimate that depends on assumptions',
        'The number of compounds in PubChem',
        'The number of molecules that can be made with known reactions',
      ],
      answer: 1,
      why: 'Nobody has enumerated $10^{60}$ molecules; the number came from a combinatorial estimate (Bohacek et al. 1996), and other assumptions give anywhere from about $10^{23}$ to $10^{180}$. PubChem holds roughly $10^8$, and the full enumeration GDB-17 reaches only about $10^{11}$.',
    },
    {
      kind: 'explain',
      title: 'Enumerating chemical space: GDB',
      body: String.raw`Jean-Louis Reymond's group did enumerate small corners of chemical space (Reymond 2015). The **Generated DataBases (GDB)** list *all* molecules up to a given size that pass rules for stability and synthetic plausibility:

1. Enumerate all graphs with up to $n$ nodes.
2. Keep those that can be molecular skeletons, then assign atoms and bond orders.
3. Filter out strained rings, reactive or unstable groups, and so on.

**GDB-13**: 977 million molecules with up to 13 atoms of C, N, O, S and Cl (Blum & Reymond 2009). **GDB-17**: **166.4 billion** molecules with up to 17 atoms of C, N, O, S and halogens (Ruddigkeit et al. 2012). Each added atom multiplies the count, so the growth is roughly exponential.`,
    },
    {
      kind: 'widget',
      title: 'The scale of chemical space',
      widget: { type: 'SvgDiagram', props: { svg: sizeSvg }, caption: 'Log scale: each grid step is a factor of $10^{20}$. Make-on-demand catalogues (e.g. Enamine REAL) have grown from about a billion to tens of billions of molecules and keep growing, so treat that bar as a moving target.' },
    },
    {
      kind: 'numeric',
      prompt: 'A very fast filter scores $10^6$ molecules per second. How many **days** would it take to score all 166.4 billion molecules in GDB-17?',
      answer: 1.93,
      tolerance: 0.03,
      unit: 'days',
      why: String.raw`$1.664 \times 10^{11} / 10^6 = 1.664 \times 10^5$ s, and $1.664 \times 10^5 / 86\,400 \approx 1.93$ days. At the same speed, $10^{60}$ molecules would take $10^{54}$ s, about $10^{36}$ times the age of the universe ($\approx 4 \times 10^{17}$ s).`,
    },
    {
      kind: 'explain',
      title: 'Make-on-demand: the space we can buy',
      body: String.raw`Between "everything possible" and "everything in a freezer" lies the **make-on-demand** space. Suppliers such as Enamine combine stocked building blocks with a set of reliable reactions, and they make a listed compound only when someone orders it.

The numbers are combinatorial: 10,000 carboxylic acids × 10,000 amines with one amide-coupling reaction already gives $10^8$ amides. With hundreds of reactions and three-component products, catalogues now list **tens of billions** of molecules.

These libraries made [ultra-large virtual screening](@drug/ultra-large-libraries) possible: Lyu et al. (2019) docked about 170 million make-on-demand molecules and found new potent ligands among those they then synthesised and tested.`,
    },
    {
      kind: 'fill',
      prompt: 'A three-component reaction combines one of 1,000 aldehydes, one of 1,000 amines and one of 1,000 isocyanides. The number of possible products is 10^___. Libraries built this way are called ___ libraries.',
      bank: ['9', '6', '3000', 'make-on-demand', 'natural-product', 'fragment'],
      answer: ['9', 'make-on-demand'],
      why: '$1000^3 = 10^9$: the counts multiply, they do not add (adding would give only 3,000). Such virtual products are listed by suppliers and synthesised only when ordered, hence "make-on-demand".',
    },
    {
      kind: 'explain',
      title: 'Maps of chemical space',
      body: String.raw`A 2048-bit fingerprint puts each molecule in a 2048-dimensional space. To *look* at it we project to 2D:

- **PCA** ([principal component analysis](@ml/pca)) finds the linear directions of greatest variance. Axes are interpretable combinations of descriptors, and global distances are roughly kept, but non-linear structure can be squashed.
- **t-SNE** (van der Maaten & Hinton 2008) and **UMAP** (McInnes et al. 2018) are **non-linear** methods that try to keep each point's *nearest neighbours* nearby. They show clusters well, but cluster sizes and the distances *between* clusters are not reliable, and the picture depends on settings and random seed.

Reymond's group maps GDB using simple count descriptors (molecular quantum numbers) and PCA.`,
    },
    {
      kind: 'widget',
      title: 'PCA versus t-SNE',
      body: 'Four compound series, each 18 molecules described by 16 numbers. Two descriptors vary a lot within every series (think size and flexibility) but say nothing about which series a molecule belongs to. Compare the PCA map with t-SNE, then try a new random start.',
      widget: { type: 'DrugChemSpaceMap', props: { method: 'pca' }, caption: 'PCA spends its two axes on the high-variance directions, so the series overlap. t-SNE recovers the series as groups, but their positions and spacing change from run to run. Both are computed live on synthetic data.' },
    },
    {
      kind: 'multi',
      prompt: 'You see two well-separated clusters on a t-SNE map of your screening library. Which conclusions are justified? (Select all.)',
      choices: [
        'Molecules within each cluster tend to be near neighbours in the original fingerprint space.',
        'The gap between the clusters measures how dissimilar the two groups are.',
        'A bigger-looking cluster contains more diverse molecules.',
        'The overall layout may change with a different random seed or perplexity.',
      ],
      answers: [0, 3],
      why: 't-SNE is built to keep local neighbourhoods, so points that cluster together were close in the original space, and the layout depends on seed and perplexity. It does not keep global distances or densities, so neither the gap between clusters nor how large a cluster looks can be read quantitatively.',
    },
    {
      kind: 'truefalse',
      prompt: 'Each PCA axis is a linear combination of the original descriptors, so it can be interpreted by looking at the descriptor weights.',
      answer: true,
      why: 'A principal component is a weighted sum of the input variables (an eigenvector of the covariance matrix). Inspecting the weights tells you, e.g., that PC1 is mostly "size". t-SNE and UMAP axes have no such meaning.',
    },
    {
      kind: 'match',
      prompt: 'Match each collection to its approximate size.',
      pairs: [
        ['GDB-17', '166.4 billion'],
        ['GDB-13', 'about 1 billion'],
        ['PubChem', 'about $10^8$'],
        ['Drug-like estimate (Bohacek et al.)', 'about $10^{60}$'],
      ],
      why: 'The enumerated GDBs reach $10^9$–$10^{11}$, public databases of real compounds around $10^8$, and the theoretical estimate $10^{60}$ is about 49 orders of magnitude beyond GDB-17.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Chemical space** = all possible molecules, with coordinates from fingerprints or descriptors.
- Size: about $10^{60}$ drug-like molecules is a rough **heuristic** (Bohacek et al. 1996); published estimates span roughly $10^{23}$–$10^{180}$.
- Enumerated: **GDB-17** has 166.4 billion molecules of up to 17 heavy atoms (Ruddigkeit et al. 2012). Purchasable make-on-demand catalogues hold tens of billions. Known compounds number about $10^8$.
- Maps: **PCA** is linear, interpretable and keeps global structure; **t-SNE/UMAP** are non-linear and keep neighbourhoods, but their distances between clusters are not meaningful.`,
    },
  ],
  references: [
    { authors: 'Reymond, J.-L.', title: 'The chemical space project', year: 2015, venue: 'Acc. Chem. Res. 48, 722–730' },
    { authors: 'Ruddigkeit, L., van Deursen, R., Blum, L. C., Reymond, J.-L.', title: 'Enumeration of 166 billion organic small molecules in the chemical universe database GDB-17', year: 2012, venue: 'J. Chem. Inf. Model. 52, 2864–2875' },
    { authors: 'Bohacek, R. S., McMartin, C., Guida, W. C.', title: 'The art and practice of structure-based drug design: a molecular modeling perspective', year: 1996, venue: 'Med. Res. Rev. 16, 3–50' },
    { authors: 'Polishchuk, P. G., Madzhidov, T. I., Varnek, A.', title: 'Estimation of the size of drug-like chemical space based on GDB-17 data', year: 2013, venue: 'J. Comput.-Aided Mol. Des. 27, 675–679' },
    { authors: 'van der Maaten, L., Hinton, G.', title: 'Visualizing data using t-SNE', year: 2008, venue: 'J. Mach. Learn. Res. 9, 2579–2605' },
  ],
} satisfies LessonContent;
