import type { LessonContent } from '../../types';

const funnelSvg = `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg">
<path d="M20,20 C60,24 70,40 90,60 C100,70 96,78 110,86 C125,95 135,120 150,140 C155,146 165,146 170,140 C185,120 192,104 205,96 C222,86 215,72 232,60 C252,42 262,24 300,20" fill="none" stroke="var(--fg)" stroke-width="2"/>
<path d="M150,140 C155,146 165,146 170,140" fill="none" stroke="var(--c1)" stroke-width="4"/>
<g fill="var(--c2)">
<circle r="4"><animateMotion dur="5s" repeatCount="indefinite" path="M24,20 C60,24 70,40 90,60 C100,70 96,78 110,86 C125,95 135,120 150,140 L160,143"/></circle>
<circle r="4"><animateMotion dur="5.6s" repeatCount="indefinite" path="M296,20 C262,24 252,42 232,60 C215,72 222,86 205,96 C192,104 185,120 170,140 L160,143"/></circle>
<circle r="4"><animateMotion dur="6.4s" repeatCount="indefinite" path="M60,24 C70,40 80,48 90,60 C100,70 96,78 110,86 C125,95 135,120 150,140 L160,143"/></circle>
</g>
<text x="160" y="12" font-size="9" fill="var(--muted)" text-anchor="middle">many unfolded conformations (high energy, high entropy)</text>
<text x="160" y="162" font-size="9" fill="var(--c1)" text-anchor="middle" font-weight="700">native state (free-energy minimum)</text>
<text x="8" y="100" font-size="9" fill="var(--muted)">free</text><text x="8" y="111" font-size="9" fill="var(--muted)">energy ↓</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'From a string of letters to a 3D shape',
      body: String.raw`A protein is made as a chain of amino acids, but it does its job, and binds drugs, as a folded 3D object. Experiments that reveal that shape (X-ray crystallography, cryo-EM, NMR) take months and sometimes fail.

Meanwhile sequencing is cheap. UniProt holds hundreds of millions of protein sequences, while the Protein Data Bank (PDB) holds roughly 250,000 experimental structures. **Protein structure prediction** tries to close that gap by computing the 3D structure from the sequence alone. For a drug hunter, a good model can be the starting point for [docking](@drug/docking) and structure-based design when no experimental structure exists.`,
    },
    {
      kind: 'recall',
      title: 'Protein structure (from Biology)',
      points: [
        '**Primary** structure is the amino-acid sequence. **Secondary** structure is local α-helices and β-sheets held by backbone H-bonds.',
        '**Tertiary** structure is the 3D fold of one chain. **Quaternary** structure is how several chains assemble.',
        'The fold is stabilised by the hydrophobic effect, H-bonds, salt bridges and (sometimes) disulfide bonds.',
        'Structures are stored as atom coordinates in PDB/mmCIF files.',
      ],
      link: 'bio/protein-structure',
    },
    {
      kind: 'explain',
      title: "Anfinsen: the sequence contains the answer",
      body: String.raw`In the 1950s–60s Christian Anfinsen unfolded the enzyme ribonuclease A with urea (which disrupts non-covalent interactions) and a reducing agent (which breaks its four disulfide bonds). When he slowly removed both, the enzyme refolded and regained its activity.

His **thermodynamic hypothesis** (Nobel Prize 1972; reviewed in Anfinsen 1973): under physiological conditions, the native structure is the one with the lowest free energy, and it is determined by the amino-acid sequence alone. That makes prediction possible in principle. Caveats: chaperones help many proteins fold in cells (they speed folding and prevent aggregation but do not encode the shape; see [folding & chaperones](@bio/protein-folding-chaperones)), and a few proteins switch between folds.`,
    },
    {
      kind: 'explain',
      title: "Levinthal's paradox",
      body: String.raw`In 1969 Cyrus Levinthal pointed out that a protein cannot find its fold by random search. Suppose each residue can take just $k = 3$ backbone conformations. A chain of $N$ residues then has $k^N$ conformations. For $N = 100$ that is $3^{100} \approx 5 \times 10^{47}$. Even sampling $10^{13}$ conformations per second, an exhaustive search would take about $10^{27}$ years. Real proteins fold in microseconds to seconds.

Drag $k$ to see how fast the count explodes (note the log scale on the y-axis).`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['x*log10(k)'], x: [0, 150], y: [0, 160], params: [{ name: 'k', min: 2, max: 10, value: 3, label: 'states per residue k' }], xLabel: 'residues N', yLabel: 'log₁₀(conformations)' },
        caption: 'The number of conformations is $k^N$, so $\\log_{10}$ of it is $N \\log_{10} k$, a straight line. Every residue multiplies the search space by $k$.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`With 3 conformations per residue, a 100-residue chain has $3^{100}$ conformations. What is $\log_{10}(3^{100})$? (Give one decimal place.)`,
      answer: 47.7,
      tolerance: 0.1,
      why: String.raw`$\log_{10}(3^{100}) = 100 \log_{10} 3 = 100 \times 0.4771 = 47.7$, so about $5 \times 10^{47}$ conformations. A common slip is to compute $3 \times 100$ or $100^3$; the count grows exponentially with chain length, not polynomially.`,
    },
    {
      kind: 'explain',
      title: 'The way out: a funnelled landscape',
      body: String.raw`The paradox dissolves because folding is not a random search. The free-energy landscape of a natural protein is shaped like a rough **funnel**: from almost any unfolded conformation, local downhill steps (forming a helix, burying a hydrophobic side chain) lead toward the native state.

Physics-based simulation can follow this process for small, fast-folding proteins (for example on the special-purpose Anton supercomputer), but it is far too expensive for routine use on typical drug targets. Most practical methods therefore use **knowledge from known structures** instead of folding from first principles.`,
      widget: { type: 'SvgDiagram', props: { svg: funnelSvg }, caption: 'A folding funnel: many starting points, one downhill route to the native minimum. Real funnels are rugged, with traps that chaperones help proteins escape.' },
    },
    {
      kind: 'explain',
      title: 'CASP: a blind exam every two years',
      body: String.raw`Since 1994 the **Critical Assessment of protein Structure Prediction (CASP)**, started by John Moult and colleagues, has run a blind test. Organisers collect sequences of proteins whose structures have been solved but not yet released, predictors submit models, and assessors compare them with the experiments.

The headline metric is **GDT_TS** (Global Distance Test, total score). After superposing model and experiment, it takes the percentage of Cα atoms within 1, 2, 4 and 8 Å of their true positions and averages the four:
$$\text{GDT\_TS} = \tfrac{1}{4}\left(P_{1} + P_{2} + P_{4} + P_{8}\right)$$
100 is perfect. Scores around 90 are roughly competitive with experimental accuracy.`,
    },
    {
      kind: 'numeric',
      prompt: 'After superposition, a model has 50 % of its Cα atoms within 1 Å, 70 % within 2 Å, 85 % within 4 Å and 95 % within 8 Å of the experimental positions. What is its GDT_TS?',
      answer: 75,
      tolerance: 0.1,
      why: String.raw`GDT_TS $= (50 + 70 + 85 + 95)/4 = 300/4 = 75$. Averaging over four cut-offs rewards both getting the overall fold right (8 Å) and getting fine detail right (1 Å).`,
    },
    {
      kind: 'explain',
      title: 'Homology (comparative) modelling',
      body: String.raw`Evolution conserves structure far more than sequence: two proteins with clearly related sequences almost always share the same fold. **Homology modelling** exploits this:

1. Search the PDB for a **template**, a solved protein with a similar sequence (via [sequence alignment](@bio/sequence-alignment), e.g. BLAST or HHpred).
2. Align the target sequence to the template.
3. Copy the aligned backbone, then build loops and side chains (MODELLER does this by satisfying spatial restraints; Šali & Blundell 1993).
4. Refine and assess the model.

Accuracy depends mainly on sequence identity. Above roughly 50 % identity models are often close to experimental quality; below about 30 % (the "twilight zone") alignment errors dominate.`,
    },
    {
      kind: 'order',
      prompt: 'Put the steps of homology modelling in order.',
      steps: ['Search the PDB for a related template structure', 'Align the target sequence to the template', 'Copy the aligned backbone coordinates', 'Model loops and side chains', 'Refine and assess the model'],
      why: 'You cannot copy coordinates before you know which residues correspond, and you cannot correspond residues before you have a template. Loops and side chains come last because they are the parts the template does not determine.',
    },
    {
      kind: 'explain',
      title: 'When there is no clear template',
      body: String.raw`- **Threading (fold recognition)**: nature uses a limited repertoire of folds. Threading slides the target sequence onto each fold in a library and scores how well the residues fit their environments (buried vs exposed, helix vs strand). It can detect a matching fold even when sequence similarity is undetectable (Jones, Taylor & Thornton 1992).
- **Fragment assembly (Rosetta)**: cut the target into overlapping 3- and 9-residue windows, collect fragments with similar local sequence from the PDB, and assemble them by Monte Carlo moves guided by a knowledge-based energy (Simons et al. 1997). This *ab initio* approach worked for many small proteins, but struggled beyond about 100–150 residues.`,
    },
    {
      kind: 'match',
      prompt: 'Match each method to its core idea.',
      pairs: [
        ['Homology modelling', 'Copy the backbone of a solved protein with a related sequence'],
        ['Threading', 'Score how well the sequence fits each fold in a library'],
        ['Fragment assembly', 'Stitch together short pieces of known structures by Monte Carlo'],
        ['Physics-based folding simulation', 'Integrate the equations of motion until the chain folds'],
      ],
      why: 'The first three all borrow from the PDB to different degrees (whole template, whole fold, short fragments). Only physics-based simulation tries to fold from first principles, which is why it is limited to small proteins.',
    },
    {
      kind: 'explain',
      title: 'Coevolution: contacts hidden in sequence families',
      body: String.raw`Take a **multiple sequence alignment (MSA)**: many homologous sequences lined up column by column. If residues $i$ and $j$ touch in 3D, a mutation at $i$ (say K→E) often has to be compensated at $j$ (E→K) to keep the salt bridge. So contacting columns **co-vary**.

The catch: if $i$ touches $k$ and $k$ touches $j$, then $i$ and $j$ also correlate, even though they never touch. **Direct coupling analysis (DCA)** fits one global statistical model (a Potts model) to the whole MSA, which separates direct couplings from such indirect ones. Morcos et al. (2011) showed that the top DCA pairs are mostly true native contacts across many protein families, given enough sequences (typically hundreds to thousands). Predicted contacts can then guide folding.`,
    },
    {
      kind: 'widget',
      title: 'Find the contacts in an alignment',
      body: 'Each column of this toy MSA has two possible residues. Some column pairs were made to co-vary because they are in contact. Compare raw correlation with the direct (DCA-like) score, then drag the number of sequences down.',
      widget: {
        type: 'DrugCoevolutionMSA',
        props: { nSeq: 300, mode: 'corr' },
        caption: 'Contacts 8–9 and 9–10 make columns 8 and 10 correlate indirectly. Correlation ranks 8–10 in its top four. The direct score, built from the inverse covariance matrix, removes it and recovers 3–6. With few sequences both scores become noisy.',
      },
    },
    {
      kind: 'mcq',
      prompt: 'Why does direct coupling analysis outperform simply ranking column pairs by their correlation (or mutual information)?',
      choices: [
        'It separates direct couplings from correlations passed along chains of contacts',
        'It needs far fewer sequences than correlation does',
        'It uses the 3D structure of a template to filter pairs',
        'It ignores columns that are fully conserved',
      ],
      answer: 0,
      why: 'If i contacts k and k contacts j, i and j correlate without touching. A global model explains that correlation through k, so only real contacts keep a large coupling. DCA still needs many sequences and uses no template structure.',
    },
    {
      kind: 'multi',
      prompt: 'Which statements are correct?',
      choices: [
        "Anfinsen's refolding experiment suggested that the native structure is encoded in the sequence",
        'CASP targets are structures already published in the PDB',
        'Homology models become unreliable when target–template identity drops below about 30 %',
        'Chaperones store the information that specifies a protein’s final fold',
      ],
      answers: [0, 2],
      why: 'CASP is blind: targets are solved but unreleased, so predictors cannot copy the answer. Chaperones assist folding (preventing aggregation, giving misfolded chains another chance) but do not encode the fold; that information is in the sequence.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Anfinsen: the sequence determines the native fold, so prediction is possible in principle.
- Levinthal: random search is hopeless ($k^N$ conformations); real folding follows a funnelled landscape.
- **CASP** (since 1994) measures progress blindly; **GDT_TS** averages the % of Cα within 1, 2, 4 and 8 Å.
- Classical methods borrow from the PDB: **homology modelling** (good above ~30–50 % identity), **threading**, and **Rosetta fragment assembly**.
- **Coevolution** in large MSAs reveals contacts; **DCA** removes indirect correlations. This idea feeds directly into [AlphaFold2](@drug/alphafold).`,
    },
  ],
  references: [
    { authors: 'Anfinsen, C. B.', title: 'Principles that govern the folding of protein chains', year: 1973, venue: 'Science 181, 223–230' },
    { authors: 'Moult, J., Pedersen, J. T., Judson, R., Fidelis, K.', title: 'A large-scale experiment to assess protein structure prediction methods', year: 1995, venue: 'Proteins 23, ii–v' },
    { authors: 'Šali, A., Blundell, T. L.', title: 'Comparative protein modelling by satisfaction of spatial restraints', year: 1993, venue: 'J. Mol. Biol. 234, 779–815' },
    { authors: 'Simons, K. T., Kooperberg, C., Huang, E., Baker, D.', title: 'Assembly of protein tertiary structures from fragments with similar local sequences using simulated annealing and Bayesian scoring functions', year: 1997, venue: 'J. Mol. Biol. 268, 209–225' },
    { authors: 'Morcos, F., Pagnani, A., Lunt, B., et al.', title: 'Direct-coupling analysis of residue coevolution captures native contacts across many protein families', year: 2011, venue: 'Proc. Natl. Acad. Sci. USA 108, E1293–E1301' },
  ],
} satisfies LessonContent;
