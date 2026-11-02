import type { LessonContent } from '../../types';

const workflowSvg = `<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg">
<g font-size="9" text-anchor="middle" font-weight="700">
${['Prepare protein', 'Define pocket', 'Prepare ligands', 'Search poses', 'Score & rank'].map((t, i) => {
  const x = 8 + i * 62;
  return `<rect x="${x}" y="40" width="56" height="34" rx="8" fill="var(--c${(i % 5) + 1})" fill-opacity="0.25" stroke="var(--c${(i % 5) + 1})"/>
<text x="${x + 28}" y="54" fill="var(--fg)">${t.split(' ')[0]}</text>${t.includes(' ') ? `<text x="${x + 28}" y="66" fill="var(--fg)">${t.split(' ').slice(1).join(' ')}</text>` : ''}
${i < 4 ? `<path d="M${x + 57},57 l4,0" stroke="var(--fg)"/>` : ''}`;
}).join('\n')}
<text x="160" y="22" fill="var(--muted)" font-weight="400">H atoms, protonation, waters → box around site → 3D conformers, charges</text>
<text x="160" y="100" fill="var(--muted)" font-weight="400">output: top poses + a score per ligand (not a true ΔG)</text>
</g></svg>`;

const landscapeSvg = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
<path d="M10,40 C30,40 40,90 60,90 C80,90 85,55 105,55 C125,55 135,120 160,125 C185,130 195,60 215,60 C235,60 245,95 265,95 C285,95 295,45 310,45" fill="none" stroke="var(--fg)" stroke-width="2"/>
<circle r="5" fill="var(--c3)">
<animateMotion dur="6s" repeatCount="indefinite" path="M10,40 C30,40 40,90 60,90 C80,90 85,55 105,55 C125,55 135,120 160,125" keyPoints="0;0.35;0.35;1" keyTimes="0;0.3;0.5;1" calcMode="linear"/>
</circle>
<text x="60" y="106" font-size="9" fill="var(--muted)" text-anchor="middle">local minimum</text>
<text x="160" y="142" font-size="9" fill="var(--c1)" text-anchor="middle" font-weight="700">global minimum (best pose?)</text>
<text x="10" y="14" font-size="9" fill="var(--muted)">score ↑ worse</text>
<text x="310" y="14" font-size="9" fill="var(--muted)" text-anchor="end">pose (x, y, z, rotation, torsions) →</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A 3D jigsaw with a judge',
      body: String.raw`**Molecular docking** predicts *how* a small molecule sits in a protein's binding pocket (its **pose**) and gives a rough estimate of *how well* it binds (a **score**).

Think of it as a jigsaw: one piece (the ligand) has to be rotated, moved and flexed to fit a hole (the pocket), and a judge (the scoring function) awards points for good contacts and penalises clashes. Every docking program is two parts: a **search algorithm** and a **scoring function**. Docking dates back to Kuntz et al. (1982) and is now one of the most used tools in structure-based design.`,
    },
    {
      kind: 'recall',
      title: 'Protein structure (from Biology)',
      points: [
        'Proteins fold into specific 3D shapes determined by their amino-acid sequence.',
        'Binding sites are pockets lined with side chains that can donate/accept H-bonds, carry charge or be hydrophobic.',
        'Experimental structures come from X-ray crystallography, cryo-EM or NMR, stored in the PDB.',
      ],
      link: 'bio/protein-structure',
    },
    {
      kind: 'explain',
      title: 'The search problem',
      body: String.raw`A pose is described by the ligand's **position** (3 numbers), **orientation** (3 rotation angles) and each rotatable bond's **torsion** angle. A ligand with 6 rotatable bonds therefore has $3+3+6 = 12$ degrees of freedom.

Exhaustively trying every combination is impossible, so programs use clever search: **Monte Carlo** moves with local optimisation (AutoDock Vina; Trott & Olson 2010), **genetic algorithms** (AutoDock 4), **incremental construction** (growing the ligand fragment by fragment in the site) or **systematic hierarchical filters** (Glide; Friesner et al. 2004). The protein is usually held rigid.`,
    },
    {
      kind: 'numeric',
      prompt: 'Treating the protein as rigid, how many degrees of freedom does the pose of a ligand with 4 rotatable bonds have?',
      answer: 10,
      tolerance: 0,
      why: '3 translations + 3 rotations + 4 torsions = 10. Each extra rotatable bond adds a dimension to the search space — one reason flexible ligands are harder to dock correctly.',
    },
    {
      kind: 'widget',
      title: 'Watch a pose search',
      body: 'This toy 2D docking run uses Monte Carlo simulated annealing with random restarts. Faded = the current trial pose; solid = the best pose found. Press play, then pause and move the ligand yourself to see how each score term responds.',
      widget: {
        type: 'DockingPoseSearch',
        props: {},
        caption: 'Colours: orange = hydrophobic, blue = H-bond donor, red = acceptor. The best pose pairs donor↔acceptor (green dashes) and buries the hydrophobic atom. Lower score = better.',
      },
    },
    {
      kind: 'explain',
      title: 'Rugged landscapes',
      body: String.raw`The score as a function of pose is a **rugged landscape** with many local minima. A pure downhill search gets stuck in the nearest valley. That's why docking programs add randomness: Metropolis Monte Carlo sometimes accepts *uphill* moves (with probability $e^{-\Delta s/T}$), simulated annealing lowers $T$ over time, and multiple **random restarts** explore different valleys.

In the widget, the "flipped" pose (donor and acceptor swapped) is exactly such a local trap.`,
      widget: { type: 'SvgDiagram', props: { svg: landscapeSvg }, caption: 'A downhill-only search stops at the first valley; random moves and restarts help find deeper ones.' },
    },
    {
      kind: 'mcq',
      prompt: 'Why does a Monte Carlo docking search occasionally accept a pose with a *worse* score?',
      choices: ['To save time', 'To escape local minima in the score landscape', 'Because the scoring function is random', 'To make the ligand more flexible'],
      answer: 1,
      why: 'Accepting some uphill moves (Metropolis criterion) lets the search climb out of local minima and find better poses elsewhere. The score itself is deterministic; the randomness is in the search.',
    },
    {
      kind: 'explain',
      title: 'Scoring functions',
      body: String.raw`The judge must be **fast** — it is called millions of times per ligand. Families:
- **Force-field based**: van der Waals + electrostatics from a molecular-mechanics force field (DOCK, AutoDock 4).
- **Empirical**: a weighted sum of terms (steric contact, H-bonds, hydrophobic contact, rotatable-bond penalty) with weights fitted to experimental affinities. Vina's score is of this kind and is reported in "kcal/mol".
- **Knowledge-based**: statistical potentials from contact frequencies in the PDB.
- **Machine-learned**: trained on structures with measured affinities (e.g. random forests, neural nets).

Our toy widget uses an empirical-style sum of five terms.`,
    },
    {
      kind: 'match',
      prompt: 'Match each scoring approach to its basis.',
      pairs: [
        ['Force-field', 'Physics: van der Waals and Coulomb terms'],
        ['Empirical', 'Weighted interaction terms fitted to measured affinities'],
        ['Knowledge-based', 'Statistics of atom contacts in known structures'],
        ['Machine-learned', 'A model trained on complexes with affinities'],
      ],
      why: 'All four approximate the binding free energy with very different ingredients; none captures everything (e.g. full solvation and entropy), which is why docking scores correlate only weakly with affinity.',
    },
    {
      kind: 'explain',
      title: 'What docking is good — and bad — at',
      body: String.raw`**Good at:** pose prediction when the pocket is well defined and the protein doesn't move much (re-docking often reproduces crystal poses within ~2 Å RMSD), and **enrichment** — ranking a huge library so actives are over-represented at the top. Lyu et al. (2019) docked ~170 million make-on-demand molecules against two targets and found potent new chemotypes, showing that bigger libraries yield better hits.

**Bad at:** predicting exact affinities. Scores correlate weakly with measured $K_d$ — they ignore much of solvation, entropy and protein flexibility. Use docking to **prioritise**, then test experimentally or refine with [free-energy methods](@drug/free-energy-methods).`,
      widget: { type: 'SvgDiagram', props: { svg: workflowSvg }, caption: 'A typical docking workflow. Preparation choices (protonation states, waters, tautomers) often matter more than the program used.' },
    },
    {
      kind: 'truefalse',
      prompt: 'If compound A docks with a Vina score of −10.2 and compound B with −9.8, we can confidently conclude that A binds more tightly.',
      answer: false,
      why: 'A 0.4 "kcal/mol" difference is far below the typical error of docking scores (often several kcal/mol vs experiment). Docking is useful for enriching large libraries statistically, not for ranking close pairs.',
    },
    {
      kind: 'multi',
      prompt: 'Which factors are commonly neglected or approximated in standard docking?',
      choices: ['Protein flexibility', 'Explicit water molecules and desolvation', 'Conformational entropy of the ligand', 'The ligand’s position in the pocket'],
      answers: [0, 1, 2],
      why: 'Position is exactly what docking searches over. Protein motion, solvation and entropy are the classic approximations — addressed partially by ensemble docking, MD and free-energy methods.',
    },
    {
      kind: 'order',
      prompt: 'Order the steps of a structure-based virtual screen.',
      steps: ['Choose and prepare a protein structure', 'Define the binding site box', 'Prepare 3D ligand library', 'Dock and score every ligand', 'Inspect top-ranked poses', 'Buy or synthesise and test top compounds'],
      why: 'Preparation comes first; docking produces a ranked list; human inspection catches nonsense poses; and only experiments decide which hits are real. Hit rates of 10–30 % are considered good in large docking campaigns.',
    },
    {
      kind: 'fill',
      prompt: 'Every docking program combines a ___ algorithm, which generates poses, with a ___ function, which ranks them.',
      bank: ['search', 'scoring', 'learning', 'hashing', 'sorting'],
      answer: ['search', 'scoring'],
      why: 'Failures can come from either: the search may never generate the correct pose (sampling error), or the score may rank a wrong pose above it (scoring error).',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Docking = **pose search** (position, orientation, torsions) + **scoring**.
- Search uses Monte Carlo, genetic algorithms, incremental construction or systematic filters to navigate a rugged landscape.
- Scoring functions are force-field, empirical, knowledge-based or ML — fast but **crude**.
- Docking is good at **poses and enrichment** of huge libraries (Lyu 2019), poor at **exact affinity**.
- Next steps: [molecular dynamics](@drug/molecular-dynamics) for flexibility, free-energy methods for accurate ranking, and ML docking (DiffDock) — with caveats (PoseBusters).`,
    },
  ],
  references: [
    { authors: 'Trott, O., Olson, A. J.', title: 'AutoDock Vina: improving the speed and accuracy of docking with a new scoring function, efficient optimization, and multithreading', year: 2010, venue: 'J. Comput. Chem. 31, 455–461' },
    { authors: 'Friesner, R. A., Banks, J. L., Murphy, R. B., et al.', title: 'Glide: a new approach for rapid, accurate docking and scoring. 1. Method and assessment of docking accuracy', year: 2004, venue: 'J. Med. Chem. 47, 1739–1749' },
    { authors: 'Kuntz, I. D., Blaney, J. M., Oatley, S. J., Langridge, R., Ferrin, T. E.', title: 'A geometric approach to macromolecule-ligand interactions', year: 1982, venue: 'J. Mol. Biol. 161, 269–288' },
    { authors: 'Lyu, J., Wang, S., Balius, T. E., et al.', title: 'Ultra-large library docking for discovering new chemotypes', year: 2019, venue: 'Nature 566, 224–229' },
    { authors: 'Leach, A. R.', title: 'Molecular Modelling: Principles and Applications', year: 2001, venue: '2nd ed., Prentice Hall', detail: 'Ch. 12' },
  ],
} satisfies LessonContent;
