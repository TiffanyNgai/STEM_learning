import type { LessonContent } from '../../types';

const spectrumSvg = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="dlg" x1="0" x2="1"><stop offset="0" stop-color="var(--c2)"/><stop offset="1" stop-color="var(--c5)"/></linearGradient></defs>
<rect x="12" y="30" width="296" height="12" rx="6" fill="url(#dlg)" fill-opacity="0.55"/>
<text x="12" y="24" font-size="9.5" fill="var(--c2)" font-weight="700">diverse</text>
<text x="308" y="24" font-size="9.5" fill="var(--c5)" font-weight="700" text-anchor="end">focused</text>
<circle cx="40" cy="36" r="5" fill="var(--c2)"><animate attributeName="cx" values="40;280;40" dur="9s" repeatCount="indefinite"/></circle>
<text x="12" y="62" font-size="8.5" fill="var(--muted)">no target in mind</text>
<text x="12" y="74" font-size="8.5" fill="var(--muted)">spread over chemical space</text>
<text x="12" y="86" font-size="8.5" fill="var(--muted)">few analogues of anything</text>
<text x="12" y="98" font-size="8.5" fill="var(--muted)">low hit rate, broad coverage</text>
<text x="308" y="62" font-size="8.5" fill="var(--muted)" text-anchor="end">one target or family</text>
<text x="308" y="74" font-size="8.5" fill="var(--muted)" text-anchor="end">built around a motif</text>
<text x="308" y="86" font-size="8.5" fill="var(--muted)" text-anchor="end">dense analogue series</text>
<text x="308" y="98" font-size="8.5" fill="var(--muted)" text-anchor="end">high hit rate, narrow</text>
<text x="160" y="130" font-size="9" fill="var(--fg)" text-anchor="middle" font-weight="700">the design question: where on this line, and why?</text>
<text x="160" y="143" font-size="8.5" fill="var(--muted)" text-anchor="middle">a kinase-focused set is useless against a protein–protein interface</text>
</svg>`;

const delSvg = `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
<text x="8" y="12" font-size="9" fill="var(--muted)">DNA-encoded library: every molecule carries its own synthesis record</text>
<g font-size="8.5">
<rect x="8" y="22" width="68" height="30" rx="6" fill="var(--c1)" fill-opacity="0.2" stroke="var(--c1)"/>
<text x="42" y="34" text-anchor="middle" fill="var(--fg)" font-weight="700">couple</text>
<text x="42" y="46" text-anchor="middle" fill="var(--fg)" font-weight="700">block A</text>
<rect x="84" y="22" width="68" height="30" rx="6" fill="var(--c2)" fill-opacity="0.2" stroke="var(--c2)"/>
<text x="118" y="34" text-anchor="middle" fill="var(--fg)" font-weight="700">ligate</text>
<text x="118" y="46" text-anchor="middle" fill="var(--fg)" font-weight="700">tag A</text>
<rect x="160" y="22" width="68" height="30" rx="6" fill="var(--c3)" fill-opacity="0.2" stroke="var(--c3)"/>
<text x="194" y="34" text-anchor="middle" fill="var(--fg)" font-weight="700">split, repeat</text>
<text x="194" y="46" text-anchor="middle" fill="var(--fg)" font-weight="700">cycles B, C</text>
<rect x="236" y="22" width="76" height="30" rx="6" fill="var(--c4)" fill-opacity="0.2" stroke="var(--c4)"/>
<text x="274" y="34" text-anchor="middle" fill="var(--fg)" font-weight="700">pool: 10⁹</text>
<text x="274" y="46" text-anchor="middle" fill="var(--fg)" font-weight="700">in one tube</text>
</g>
<path d="M76,37 L83,37 M152,37 L159,37 M228,37 L235,37" stroke="var(--fg)" stroke-width="1"/>
<path d="M274,54 L274,74 L160,74" stroke="var(--fg)" stroke-width="1" fill="none"/>
<g font-size="8.5">
<rect x="84" y="80" width="80" height="30" rx="6" fill="var(--c5)" fill-opacity="0.2" stroke="var(--c5)"/>
<text x="124" y="92" text-anchor="middle" fill="var(--fg)" font-weight="700">incubate with</text>
<text x="124" y="104" text-anchor="middle" fill="var(--fg)" font-weight="700">immobilised target</text>
<rect x="8" y="80" width="68" height="30" rx="6" fill="var(--c6)" fill-opacity="0.2" stroke="var(--c6)"/>
<text x="42" y="92" text-anchor="middle" fill="var(--fg)" font-weight="700">wash away</text>
<text x="42" y="104" text-anchor="middle" fill="var(--fg)" font-weight="700">non-binders</text>
<rect x="8" y="124" width="156" height="30" rx="6" fill="var(--c1)" fill-opacity="0.2" stroke="var(--c1)"/>
<text x="86" y="136" text-anchor="middle" fill="var(--fg)" font-weight="700">sequence the surviving tags</text>
<text x="86" y="148" text-anchor="middle" fill="var(--fg)" font-weight="700">→ enriched building-block combinations</text>
</g>
<path d="M84,95 L78,95 M42,110 L42,122" stroke="var(--fg)" stroke-width="1"/>
<text x="240" y="100" font-size="8.5" fill="var(--muted)">one experiment,</text>
<text x="240" y="112" font-size="8.5" fill="var(--muted)">one tube, no</text>
<text x="240" y="124" font-size="8.5" fill="var(--muted)">compound ever</text>
<text x="240" y="136" font-size="8.5" fill="var(--muted)">purified</text>
<text x="240" y="152" font-size="8" fill="var(--c5)">then resynthesise</text>
<text x="240" y="162" font-size="8" fill="var(--c5)">hits without DNA</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Which molecules should exist?',
      body: String.raw`[Virtual screening](@drug/virtual-screening) ranks a library someone else chose. **Library design** is the earlier and more consequential decision: which molecules go into the collection at all.

It is a budget problem. A screening deck of 300,000 compounds costs real money to buy, store, dissolve and quality-control; a combinatorial synthesis has a fixed number of wells; a project has a fixed number of compounds it can make. Whatever you leave out, no screen can ever find. Design is about spending that budget so the collection covers the chemistry you might need, without wasting slots on near-duplicates.`,
    },
    {
      kind: 'explain',
      title: 'Diverse or focused?',
      body: String.raw`Two opposite strategies, both correct in their place.

- A **diverse** library spreads compounds as widely as possible over chemical space. You use it when you have no target information — a new protein, a phenotypic screen — and you want some chance of hitting anything.
- A **focused** library concentrates on one target or target family: a kinase set built around hinge-binding motifs, a GPCR set rich in basic amines, or an analogue series around a known hit.

The trade is coverage against hit rate. Focused sets reliably produce hits for the family they were designed for and nothing else. Most real decks are a mixture: a diverse core plus focused modules.`,
      widget: { type: 'SvgDiagram', props: { svg: spectrumSvg }, caption: 'Diversity is not a virtue in itself. It is insurance against ignorance, and you buy less of it when you know more about the target.' },
    },
    {
      kind: 'recall',
      title: 'Chemical space (earlier lesson)',
      points: [
        'The space of plausible drug-like molecules is unimaginably large — commonly quoted as around $10^{60}$ — and almost entirely unexplored.',
        'Descriptors or fingerprints give each molecule coordinates, so a library becomes a cloud of points.',
        'Projections (PCA, t-SNE, UMAP) are for looking at that cloud, not for measuring it.',
        'Any statement about "coverage" is relative to the chosen descriptors.',
      ],
      link: 'drug/chemical-space',
    },
    {
      kind: 'widget',
      title: 'Looking at a library',
      body: 'Four compound series in a 16-dimensional descriptor space, projected to 2D. PCA is dominated by two high-variance nuisance directions (size and flexibility) and the series overlap; t-SNE separates them. Press "New random start" a few times.',
      widget: {
        type: 'DrugChemSpaceMap',
        props: { method: 'pca' },
        caption: 'A warning for diversity picking: a map that looks well spread can be hiding four tight clusters, and a map that looks clustered can be an artefact of the projection. Select on the descriptors, inspect on the map.',
      },
    },
    {
      kind: 'explain',
      title: 'Measuring and picking diversity',
      body: String.raw`Give every molecule a fingerprint, define distance as $1 - T$ where $T$ is Tanimoto similarity, and diversity becomes a geometry problem with standard answers:

- **Cluster, then pick.** Group the library (a sphere-exclusion method such as the Taylor–Butina algorithm of Butina 1999, which needs a distance threshold but no preset number of clusters) and take one or two representatives per cluster. Clusters also tell you where your collection is already crowded.
- **MaxMin selection.** Start from one compound; repeatedly add the molecule whose distance to the *nearest* already-selected compound is largest. Greedy, cheap, and it goes for the edges of the space first.
- **Cell-based partitioning.** Chop a low-dimensional descriptor space into bins and demand at least one compound per occupied bin.

All three answer "diverse with respect to what?" differently, and all three are hostage to the descriptor you chose.`,
    },
    {
      kind: 'recall',
      title: 'Clustering (from Statistics)',
      points: [
        'Clustering groups points so that members of a group are more similar to each other than to outsiders.',
        'k-means needs the number of clusters in advance and assumes roughly spherical groups.',
        'Hierarchical and density-based methods instead need a distance or density threshold.',
        'There is no single correct clustering — the answer depends on the distance measure.',
      ],
      link: 'stats/clustering',
    },
    {
      kind: 'mcq',
      prompt: 'You run MaxMin selection on a screening deck and inspect the first 50 compounds it picks. What should you expect?',
      choices: [
        'Unusual, extreme molecules — the outliers at the edges of the space',
        'Representatives of the largest, most populated clusters',
        'The most drug-like molecules in the deck',
        'Compounds closely resembling the known actives',
      ],
      answer: 0,
      why: 'MaxMin maximises the distance to everything already chosen, so it is drawn to whatever is most unlike the rest: singletons, oddities and often junk. That is why diversity selection is almost always applied *after* property and quality filters, not before.',
    },
    {
      kind: 'explain',
      title: 'Filters come first',
      body: String.raw`Before any diversity calculation, libraries are filtered. Typical passes:

1. **Property windows** — molecular weight, logP, rotatable bonds, polar surface area, charge, in ranges suited to the intended modality (see [drug-likeness](@drug/drug-likeness); fragment libraries use far tighter windows).
2. **Structural alerts** — reactive or unstable groups (acyl halides, Michael acceptors where not wanted), and frequent-hitter patterns that produce [assay artefacts](@drug/assay-artefacts).
3. **Quality control** — is the compound real, pure and stable in DMSO? A deck silently full of degraded samples produces irreproducible screens.

Filtering first also makes diversity selection cheaper, because the hardest part of these algorithms scales with the number of pairwise comparisons.`,
    },
    {
      kind: 'multi',
      prompt: 'Which are sensible reasons to filter a library before selecting a diverse subset?',
      choices: [
        'Diversity algorithms preferentially pick unusual molecules, which are often reactive or unstable',
        'Compounds outside the property window will be hard to optimise into drugs even if they hit',
        'Removing frequent hitters avoids filling the deck with compounds that are active in every assay',
        'Filtering increases the Tanimoto similarity between the remaining compounds, which is the goal',
      ],
      answers: [0, 1, 2],
      why: 'The first three are standard practice. Raising average similarity is not a goal — it is a side effect to be tolerated; the point of the filters is to make the remaining diversity *useful* rather than merely large.',
    },
    {
      kind: 'explain',
      title: 'Combinatorial libraries: choose reagents, get products',
      body: String.raw`In a combinatorial library you do not choose molecules one at a time — you choose **building blocks**, and the chemistry multiplies them out. Picking 100 acids and 100 amines for an amide coupling gives 10,000 products from 200 purchases.

That constraint creates a classic design question. **Reagent-based** selection picks a diverse set of acids and a diverse set of amines separately; it is fast, but diverse reagents do not guarantee diverse products. **Product-based** selection evaluates the enumerated products themselves and chooses the sub-array that is best as a set; it gives better libraries but means scoring every cell of the matrix, and the matrix is the whole point of the problem.

You can also abandon the full array and **cherry-pick** a sparse subset of cells — more informative per compound, more expensive per compound to make.`,
    },
    {
      kind: 'widget',
      title: 'Split-and-pool synthesis',
      body: 'The trick that makes huge combinatorial libraries physically possible: split the beads, couple one building block per vessel, pool and mix, repeat. Every bead ends up carrying one compound — "one bead, one compound".',
      widget: {
        type: 'DrugSplitPool',
        props: { blocks: 3, cycles: 3 },
        caption: 'With $b$ building blocks per cycle and $n$ cycles you get $b^n$ compounds from only $b \\times n$ coupling reactions. The exponent is what buys you the library; the product is what you pay.',
      },
    },
    {
      kind: 'numeric',
      prompt: 'A split-and-pool synthesis uses 20 building blocks in each of 3 cycles. How many distinct compounds does the library contain?',
      answer: 8000,
      tolerance: 0,
      why: '$20^3 = 8000$ compounds — built with only $20 \\times 3 = 60$ coupling reactions, because each reaction is performed on a whole vessel of beads at once. The catch is that the product is a mixture: you need a way to tell which bead carries which compound.',
    },
    {
      kind: 'explain',
      title: 'DNA-encoded libraries',
      body: String.raw`That catch has an elegant answer. Build each molecule on a short **DNA tag**, and after every coupling step ligate a unique DNA codeword recording which building block was just added. The tag is a written history of the synthesis, readable by sequencing.

Brenner and Lerner proposed encoded combinatorial chemistry in 1992; Clark et al. (2009) turned it into a practical platform for libraries of $10^8$–$10^9$ compounds. A **DEL** screen runs in a single tube: incubate the whole library with immobilised target protein, wash away non-binders, elute, amplify the surviving tags by PCR and sequence them. Building-block combinations that appear far more often than chance are the enrichment signal. Hits are then **resynthesised without DNA** and tested conventionally — the molecule that bound may have been helped by its tag.

DELs have produced clinical candidates; the best-documented example is GSK2982772, a RIP1 kinase inhibitor developed from a benzoxazepinone series that a DEL selection against RIP1 turned up (Harris et al. 2017).`,
      widget: { type: 'SvgDiagram', props: { svg: delSvg }, caption: 'Selection, not screening: no plate, no assay per compound, and the readout is sequencing counts rather than activity.' },
    },
    {
      kind: 'numeric',
      prompt: 'A three-cycle DNA-encoded library uses 1,000 building blocks in each cycle. How many compounds does it encode, in billions?',
      answer: 1,
      tolerance: 0.001,
      unit: 'billion',
      why: '$1000^3 = 10^9$ = 1 billion encoded compounds, from 3,000 building blocks and three rounds of chemistry in one pot. The library is only as good as the chemistry, though: every cycle must tolerate DNA, in water, which rules out most of the organic-chemistry toolbox.',
    },
    {
      kind: 'match',
      prompt: 'Match each library format to the way its hits are identified.',
      pairs: [
        ['Plated screening deck', 'One compound per well; activity read directly from the plate'],
        ['One-bead-one-compound library', 'Pick the bead that binds, then decode what is on it'],
        ['DNA-encoded library', 'Sequence the DNA tags that survive affinity selection'],
        ['Make-on-demand virtual library', 'Nothing is made until docking picks the compounds to order'],
      ],
      why: 'The formats differ mainly in when a molecule becomes physical and how its identity is recovered. Plates are expensive but unambiguous; DELs and bead libraries are cheap per compound but need a decoding step and a resynthesis confirmation; virtual libraries defer synthesis entirely.',
    },
    {
      kind: 'truefalse',
      prompt: 'A compound that is strongly enriched in a DEL selection is confirmed as a genuine binder of the target.',
      answer: false,
      why: 'Enrichment is a count in a sequencing experiment and has many non-binding causes: DNA-mediated binding, sticking to the beads or the immobilisation matrix, PCR bias, and truncated by-products from incomplete couplings. Enrichment is a hypothesis; resynthesis without the tag and a direct binding measurement are the test.',
    },
    {
      kind: 'order',
      prompt: 'Order the design steps for a new focused screening library.',
      steps: [
        'Define the purpose: which target or target family, and which modality',
        'Apply property windows and structural-alert filters to the candidate pool',
        'Select or enumerate building blocks compatible with the chosen chemistry',
        'Enumerate the products and score them against the design objective',
        'Choose the final set, balancing predicted quality against diversity within it',
        'Synthesise, quality-control, and record what was actually made',
      ],
      why: 'Purpose comes first because it sets every later threshold — a fragment library and a macrocycle library share none of their windows. The final selection is deliberately a balance: picking only the top-scoring products gives a set of near-duplicates that tests one idea many times.',
    },
    {
      kind: 'fill',
      prompt: 'Choosing building blocks separately is ___-based selection, while scoring the enumerated matrix is ___-based selection; in a DNA-encoded library the building-block history is recorded by a ___.',
      bank: ['reagent', 'product', 'tag', 'bead', 'pharmacophore'],
      answer: ['reagent', 'product', 'tag'],
      why: 'Reagent-based selection is cheap but optimises the wrong objects; product-based selection optimises what you will actually screen, at a much higher computational cost. The DNA tag is what makes a single-tube library of a billion compounds decodable at all.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Library design decides what a screen *can possibly* find; it is a budget allocation, not an optimisation with one right answer.
- **Diverse** libraries insure against ignorance; **focused** libraries exploit knowledge of a target family. Most decks mix both.
- Diversity is measured in a fingerprint or descriptor space — always ask "diverse with respect to what?". Cluster-and-pick, MaxMin and cell-based partitioning are the standard methods.
- **Filter first**: diversity algorithms love outliers, and outliers are often reactive junk.
- Combinatorial libraries are chosen through building blocks: **reagent-based** selection is cheap, **product-based** selection is better.
- **Split-and-pool** gives $b^n$ compounds from $b \times n$ reactions; **DNA-encoded libraries** (Brenner & Lerner 1992; Clark et al. 2009) add a readable tag, enabling $10^9$-compound single-tube affinity selections — with enrichment artefacts that must be confirmed by resynthesis.`,
    },
  ],
  references: [
    { authors: 'Leach, A. R., Gillet, V. J.', title: 'An Introduction to Chemoinformatics', year: 2007, venue: 'Revised ed., Springer', detail: 'Ch. 6–8' },
    { authors: 'Butina, D.', title: 'Unsupervised data base clustering based on Daylight’s fingerprint and Tanimoto similarity: a fast and automated way to cluster small and large data sets', year: 1999, venue: 'J. Chem. Inf. Comput. Sci. 39, 747–750' },
    { authors: 'Brenner, S., Lerner, R. A.', title: 'Encoded combinatorial chemistry', year: 1992, venue: 'Proc. Natl Acad. Sci. USA 89, 5381–5383' },
    { authors: 'Clark, M. A., Acharya, R. A., Arico-Muendel, C. C., et al.', title: 'Design, synthesis and selection of DNA-encoded small-molecule libraries', year: 2009, venue: 'Nat. Chem. Biol. 5, 647–654' },
    { authors: 'Harris, P. A., Berger, S. B., Jeong, J. U., et al.', title: 'Discovery of a first-in-class receptor interacting protein 1 (RIP1) kinase specific clinical candidate (GSK2982772) for the treatment of inflammatory diseases', year: 2017, venue: 'J. Med. Chem. 60, 1247–1261' },
  ],
} satisfies LessonContent;
