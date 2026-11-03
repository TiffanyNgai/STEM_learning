import type { LessonContent } from '../../types';

// Deterministic toy scatter: experimental pKd vs a docking-like score with a modest correlation.
function scatterSvg() {
  let a = 12345;
  const u = () => { a = (a * 1103515245 + 12345) % 2147483648; return a / 2147483648; };
  const g = () => Math.sqrt(-2 * Math.log(u() + 1e-9)) * Math.cos(2 * Math.PI * u());
  const pts: string[] = [];
  for (let i = 0; i < 70; i++) {
    const pkd = 3 + 8 * u(); // 3 … 11
    const score = -(2.5 + 0.55 * pkd + 1.3 * g()); // "kcal/mol"
    const x = 40 + ((pkd - 3) / 8) * 260;
    const y = 20 + ((score + 2) / -10) * 130;
    const inSeries = pkd > 6.2 && pkd < 7.8;
    pts.push(`<circle cx="${x.toFixed(1)}" cy="${Math.min(150, Math.max(20, y)).toFixed(1)}" r="3" fill="${inSeries ? 'var(--c3)' : 'var(--c2)'}" fill-opacity="0.75"/>`);
  }
  return `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
<rect x="${40 + (3.2 / 8) * 260}" y="16" width="${(1.6 / 8) * 260}" height="138" fill="var(--c3)" fill-opacity="0.12"/>
<line x1="40" y1="150" x2="305" y2="150" stroke="var(--fg)"/><line x1="40" y1="150" x2="40" y2="14" stroke="var(--fg)"/>
${pts.join('')}
<line x1="40" y1="${20 + (2.5 + 0.55 * 3 - 2) / 10 * 130}" x2="300" y2="${20 + (2.5 + 0.55 * 11 - 2) / 10 * 130}" stroke="var(--c5)" stroke-dasharray="4 3"/>
<text x="172" y="168" font-size="9" fill="var(--muted)" text-anchor="middle">experimental pKd (3 → 11)</text>
<text x="12" y="84" font-size="9" fill="var(--muted)" text-anchor="middle" transform="rotate(-90 12 84)">score (more negative ↓)</text>
<text x="${40 + (4 / 8) * 260}" y="12" font-size="8.5" fill="var(--c3)" text-anchor="middle" font-weight="700">one lead series</text>
</svg>`;
}

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The judge has three jobs',
      body: String.raw`In docking, the **scoring function** is the judge that turns a pose into a number. It is asked to do three different jobs, and good performance on one does not guarantee the others:

1. **Pose identification**: give the correct (crystal-like) pose a better score than wrong poses of the same ligand.
2. **Screening**: rank true binders above non-binders in a large library.
3. **Affinity ranking**: order compounds by how tightly they actually bind.

The third job is by far the hardest. This lesson explains how the four families of scoring functions work, and why none of them predicts affinity well.`,
    },
    {
      kind: 'recall',
      title: 'Docking and affinity (earlier lessons)',
      points: [
        'Docking = a **search** over position, orientation and torsions plus a **score** for each pose.',
        'The score is evaluated millions of times per ligand, so it must be very cheap.',
        String.raw`The target quantity is $\Delta G_{bind} = RT\ln K_d$; at 298 K a 10-fold change in $K_d$ is about 1.36 kcal/mol.`,
        'Families: force-field, empirical, knowledge-based, machine-learned.',
      ],
      link: 'drug/docking',
    },
    {
      kind: 'explain',
      title: 'What a perfect score would include',
      body: String.raw`Binding free energy is a sum of competing effects:

$$\Delta G_{bind} = \underbrace{\Delta G_{contacts}}_{\text{H-bonds, vdW, ions}} + \underbrace{\Delta G_{desolv}}_{\text{stripping water}} + \underbrace{(-T\Delta S_{conf})}_{\text{freezing torsions}} + \underbrace{\Delta G_{reorg}}_{\text{protein strain}}$$

Contacts favour binding; desolvation and lost flexibility oppose it. The terms are each tens of kcal/mol and largely cancel, while the net $\Delta G$ of a drug is only about −8 to −13 kcal/mol (see [binding affinity](@drug/binding-affinity)). A fast score has to approximate this small difference of big numbers from **one static pose**.`,
    },
    {
      kind: 'explain',
      title: 'Force-field scoring',
      body: String.raw`The most physical family takes the non-bonded terms of a molecular-mechanics [force field](@drug/force-fields) and sums them over protein–ligand atom pairs:

$$E = \sum_{i \in L}\sum_{j \in P}\left[\frac{A_{ij}}{r_{ij}^{12}} - \frac{B_{ij}}{r_{ij}^{6}} + \frac{q_i q_j}{4\pi\varepsilon_0\,\varepsilon(r)\,r_{ij}}\right]$$

The first two terms are Lennard-Jones repulsion and dispersion, the last is Coulomb electrostatics between partial charges $q$. DOCK's classic grid score works this way. Water is missing, so a **distance-dependent dielectric** such as $\varepsilon(r) = 4r$ is often used to damp electrostatics crudely. Without a desolvation term, such scores over-reward charged and highly polar ligands.`,
    },
    {
      kind: 'explain',
      title: 'Empirical scoring',
      body: String.raw`**Empirical** functions write $\Delta G$ as a weighted sum of simple counts, and fit the weights to measured affinities. Böhm's LUDI function (1994) is the prototype:

$$\Delta G = \Delta G_0 + \Delta G_{hb}\!\sum_{\text{H-bonds}}\! f(\Delta r,\Delta\alpha) + \Delta G_{ionic}\!\sum f + \Delta G_{lipo}\,A_{lipo} + \Delta G_{rot}\,N_{rot}$$

$f$ down-weights H-bonds with poor distance or angle, $A_{lipo}$ is the buried lipophilic contact area, and $N_{rot}$ counts rotatable bonds frozen on binding (an entropy penalty). ChemScore and Glide's GlideScore (Friesner et al. 2004) are in this family. AutoDock Vina (Trott & Olson 2010) uses distance-based terms tuned on PDBbind data and is usually classed as empirical.`,
    },
    {
      kind: 'widget',
      title: 'Inside the Vina score',
      body: String.raw`Vina scores each protein–ligand atom pair by its **surface distance** $d = r_{ij} - R_i - R_j$ (distance minus the two van der Waals radii), using five weighted terms. Each curve below is one term's contribution for a single pair.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: [
            '-0.0356*exp(-(x/0.5)^2) - 0.00516*exp(-((x-3)/2)^2)',
            '0.84*min(x,0)^2',
            '-0.0351*min(1,max(0,1.5-x))',
            '-0.587*min(1,max(0,-x/0.7))',
          ],
          labels: ['steric gauss1 + gauss2', 'repulsion', 'hydrophobic (apolar atom pairs)', 'H-bond (donor–acceptor pairs)'],
          x: [-1, 4], y: [-0.65, 0.35], xLabel: 'surface distance d (Å)', yLabel: 'term (per pair)',
        },
        caption: String.raw`Weights from Trott & Olson (2010). A single good H-bond is worth about −0.59, but hydrophobic and steric terms add up over dozens of pairs. The sum is then divided by $1 + 0.0585\,N_{rot}$ to penalise flexible ligands.`,
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A docked pose has a summed Vina inter-molecular term of −9.0 "kcal/mol". The ligand has $N_{rot} = 5$ rotatable bonds. Using $s = \dfrac{E_{inter}}{1 + 0.0585\,N_{rot}}$, what is the final score?`,
      answer: -6.96,
      tolerance: 0.05,
      unit: 'kcal/mol',
      why: String.raw`$1 + 0.0585\times5 = 1.2925$, and $-9.0/1.2925 = -6.96$. The division is Vina's crude stand-in for the conformational entropy lost on binding; forgetting it leaves the score at −9.0.`,
    },
    {
      kind: 'explain',
      title: 'Knowledge-based potentials',
      body: String.raw`**Knowledge-based** (statistical) potentials learn from structures, not affinities. Count how often atom type $i$ (say a carbonyl O) sits at distance $r$ from type $j$ (say an amide N) across many PDB complexes, compare with a **reference state** expecting random contacts, and invert Boltzmann's law:

$$w_{ij}(r) = -k_BT\ln\frac{g_{ij}(r)}{g_{ref}(r)}$$

Over-represented contacts get negative (favourable) energies. PMF (Muegge & Martin 1999) and DrugScore (Gohlke, Hendlich & Klebe 2000) are examples. Two caveats: the PDB is not a Boltzmann ensemble, and the answer depends heavily on the choice of reference state.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Contacts between two atom types at 3.0 Å occur **3 times** more often in the PDB than the reference state predicts. Using $k_BT = 0.593$ kcal/mol, what is $w(3.0\text{ Å})$?`,
      answer: -0.65,
      tolerance: 0.02,
      unit: 'kcal/mol',
      why: String.raw`$w = -0.593\ln 3 = -0.593\times1.099 = -0.65$ kcal/mol. The sign is negative because the contact is over-represented. A common slip is to use $\log_{10}$, which gives −0.28.`,
    },
    {
      kind: 'explain',
      title: 'Machine-learned scoring',
      body: String.raw`**Machine-learned** functions drop the fixed functional form and learn the mapping from complex to affinity. RF-Score (Ballester & Mitchell 2010) counts element-pair contacts within 12 Å and feeds them to a **random forest**. Later models use 3D convolutional or graph neural networks on the whole complex.

ML scores often reach higher correlations on PDBbind-style benchmarks. Some of that gain is real, but some comes from **memorisation**: test complexes resemble training ones, and some models score the ligand alone almost as well as the complex. Testing on new targets and new chemotypes is the honest check (see [benchmarks & leakage](@drug/benchmarks-splits-leakage)).`,
    },
    {
      kind: 'match',
      prompt: 'Match each scoring function to its family.',
      pairs: [
        ['DOCK grid score (LJ + Coulomb)', 'Force-field'],
        ['LUDI, ChemScore, GlideScore', 'Empirical'],
        ['PMF, DrugScore', 'Knowledge-based'],
        ['RF-Score, 3D-CNN scoring', 'Machine-learned'],
      ],
      why: 'The families differ in where the numbers come from: force-field parameters, weights fitted to affinities, contact statistics in the PDB, or a flexible model trained on data. All four have to be fast enough to call millions of times.',
    },
    {
      kind: 'widget',
      title: 'Why scores track affinity so poorly',
      body: String.raw`Across many unrelated targets, good classical functions reach a Pearson correlation of only about 0.5–0.65 with experiment. On the CASF-2016 benchmark (285 complexes), Vina's correlation is about 0.6 (Su et al. 2019). Within **one lead series** (orange band), where affinities span only 1–2 log units, the same noise wipes out almost all of the correlation. That is exactly the setting where medicinal chemists need a ranking.`,
      widget: { type: 'SvgDiagram', props: { svg: scatterSvg() }, caption: 'Illustrative data. A score error of ±1.4 kcal/mol is a 10-fold error in Kd, which is about as wide as a whole optimisation series.' },
    },
    {
      kind: 'multi',
      prompt: 'Which of these are genuine reasons why docking scores correlate weakly with measured affinity?',
      choices: [
        'Desolvation and conformational entropy are approximated crudely or ignored',
        'A single static pose stands in for a dynamic ensemble of bound and unbound states',
        'Experimental affinities mix assay types (IC50, Ki, Kd) and carry their own noise',
        'Scoring functions are not deterministic, so the same pose gets random scores',
        'Protein flexibility and bridging water molecules are usually not modelled',
      ],
      answers: [0, 1, 2, 4],
      why: 'Scores are deterministic: the same pose always gets the same number. The real problems are missing physics (solvation, entropy, flexibility, waters), the single-pose approximation, and noisy experimental labels, which put a ceiling on any correlation.',
    },
    {
      kind: 'truefalse',
      prompt: 'An ML scoring function that reaches high correlation on a random split of PDBbind will reliably rank compounds for a new target it has never seen.',
      answer: false,
      why: 'Random splits leave near-duplicate proteins and ligands in both training and test sets, so they reward memorisation. Performance usually drops on new targets or chemotypes; time-based or protein-similarity splits give a more honest estimate.',
    },
    {
      kind: 'fill',
      prompt: 'Knowledge-based potentials turn contact frequencies into energies with the inverse ___ relation; their weakest point is the choice of ___ state.',
      bank: ['Boltzmann', 'reference', 'Arrhenius', 'transition', 'ground'],
      answer: ['Boltzmann', 'reference'],
      why: String.raw`$w = -k_BT\ln(g/g_{ref})$ is Boltzmann's law run backwards. The reference state sets what "random" contact would look like, and changing it can change the potential substantially.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A scoring function has three jobs: **pose identification**, **screening**, **affinity ranking**. The last is much the hardest.
- **Force-field**: LJ + Coulomb, physical but missing solvation. **Empirical**: weighted counts fitted to affinities (LUDI, ChemScore, GlideScore, Vina). **Knowledge-based**: inverse Boltzmann on PDB contacts. **ML**: learned from data, but watch for memorisation.
- Vina sums five pairwise terms and divides by $1 + 0.0585\,N_{rot}$.
- Correlation with affinity is modest (r ≈ 0.5–0.65 across targets), and close to zero within a narrow lead series.
- For ranking close analogues, use [free-energy methods](@drug/free-energy-methods).`,
    },
  ],
  references: [
    { authors: 'Trott, O., Olson, A. J.', title: 'AutoDock Vina: improving the speed and accuracy of docking with a new scoring function, efficient optimization, and multithreading', year: 2010, venue: 'J. Comput. Chem. 31, 455–461' },
    { authors: 'Friesner, R. A., Banks, J. L., Murphy, R. B., et al.', title: 'Glide: a new approach for rapid, accurate docking and scoring. 1. Method and assessment of docking accuracy', year: 2004, venue: 'J. Med. Chem. 47, 1739–1749' },
    { authors: 'Böhm, H.-J.', title: 'The development of a simple empirical scoring function to estimate the binding constant for a protein–ligand complex of known three-dimensional structure', year: 1994, venue: 'J. Comput.-Aided Mol. Des. 8, 243–256' },
    { authors: 'Ballester, P. J., Mitchell, J. B. O.', title: 'A machine learning approach to predicting protein–ligand binding affinity with applications to molecular docking', year: 2010, venue: 'Bioinformatics 26, 1169–1175' },
    { authors: 'Su, M., Yang, Q., Du, Y., Feng, G., Liu, Z., Li, Y., Wang, R.', title: 'Comparative assessment of scoring functions: the CASF-2016 update', year: 2019, venue: 'J. Chem. Inf. Model. 59, 895–913' },
  ],
} satisfies LessonContent;
