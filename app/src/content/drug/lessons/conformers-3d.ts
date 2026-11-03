import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'One graph, many shapes',
      body: String.raw`A SMILES string or a [molecular graph](@drug/molecular-representations) says which atoms are bonded, but not **where they are in space**. Yet a protein recognises a ligand by its 3D shape and by where its charges and H-bond groups point.

Docking, pharmacophores, 3D descriptors and physics-based simulation all need **coordinates**. Getting from 2D to a sensible set of 3D structures takes several decisions:

1. Which **stereoisomer**?
2. Which **tautomer** and **protonation state**?
3. Which **conformers** (shapes reached by rotating single bonds)?`,
    },
    {
      kind: 'recall',
      title: 'Stereochemistry refresher',
      points: [
        'Stereoisomers have the same connectivity but differ in 3D arrangement.',
        'A stereocentre gives **R/S** isomers; a substituted C=C gives **E/Z** isomers.',
        'Enantiomers of a drug can differ greatly in potency and toxicity.',
        'With $n$ independent stereocentres there are up to $2^n$ stereoisomers.',
      ],
      link: 'chem/stereochemistry',
    },
    {
      kind: 'explain',
      title: 'Before 3D: stereo, tautomers, charges',
      body: String.raw`- **Unspecified stereo**: if the input does not say R or S, a 3D tool must either pick one or **enumerate** all of them, up to $2^n$ for $n$ centres.
- **Tautomers** are isomers that differ by where a hydrogen sits, e.g. 2-hydroxypyridine ⇌ 2-pyridone. They have different H-bond donor/acceptor patterns, so the choice changes how a ligand can bind.
- **Protonation state** at physiological pH 7.4: by [acid–base equilibrium](@chem/acids-bases), a group with $pK_a$ well below 7.4 is mostly deprotonated (carboxylic acids, $pK_a \approx 4$–5, become carboxylates), and one with $pK_a$ well above 7.4 stays protonated (aliphatic amines, $pK_a \approx 9$–11, become ammonium ions).

$$\frac{[\text{A}^-]}{[\text{HA}]} = 10^{\,\text{pH} - pK_a}$$`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A carboxylic acid has $pK_a = 4.4$. At pH 7.4, what is the ratio $[\text{A}^-]/[\text{HA}]$ of carboxylate to neutral acid?`,
      answer: 1000,
      tolerance: 1,
      why: String.raw`$10^{\,7.4 - 4.4} = 10^3 = 1000$, so only about 0.1% of the molecules are neutral. A model that keeps the acid neutral at pH 7.4 gets its charge, and its salt bridges, wrong. Inverting the formula gives $10^{-3}$, the most common slip.`,
    },
    {
      kind: 'explain',
      title: 'Conformers and torsion angles',
      body: String.raw`Rotating around a single bond changes the **torsion (dihedral) angle** $\varphi$, the angle between the two bonds at either end, seen down the central bond. Shapes that differ only by such rotations are **conformers** of the same molecule. They interconvert in picoseconds to nanoseconds at room temperature.

**Butane**, looking down the central C–C bond:

- **anti** ($\varphi = 180°$): the two CH₃ groups are as far apart as possible, which is the lowest energy.
- **gauche** ($\varphi \approx \pm 60°$): a few kJ/mol higher.
- **eclipsed** ($0°$, $\pm120°$): energy maxima, with $\varphi = 0°$ (CH₃ eclipsing CH₃) the highest.`,
    },
    {
      kind: 'widget',
      title: 'Butane torsion profile',
      body: String.raw`An illustrative energy profile $E(\varphi)$ in kJ/mol, built from three cosine terms of the kind force fields use: $E = V_1(1+\cos\varphi) + V_2(1-\cos 2\varphi) + V_3(1+\cos 3\varphi)$. Minima are the stable conformers.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['4.12*(1+cos(x*PI/180)) - 1.4*(1-cos(2*x*PI/180)) + 7.07*(1+cos(3*x*PI/180))'],
          x: [0, 360], y: [-1, 24],
          xLabel: 'torsion φ (degrees)', yLabel: 'E (kJ/mol)',
          labels: ['butane (illustrative)'],
        },
        caption: 'Gauche minima near 60° and 300° sit about 3.8 kJ/mol above the anti minimum at 180°. The values are chosen to match typical literature magnitudes, not taken from a specific force field.',
      },
    },
    {
      kind: 'mcq',
      prompt: 'Which conformer of butane is the global energy minimum?',
      choices: ['Syn (φ = 0°, CH₃ eclipsing CH₃)', 'Gauche (φ ≈ 60°)', 'Anti (φ = 180°)', 'Eclipsed (φ = 120°)'],
      answer: 2,
      why: 'In the anti conformer the two methyl groups are as far apart as possible and every bond is staggered. Gauche is also a minimum but a few kJ/mol higher because the methyls are close together. Syn and the other eclipsed forms are maxima, i.e. transition states between conformers.',
    },
    {
      kind: 'numeric',
      prompt: String.raw`At 298 K, $RT \approx 2.48$ kJ/mol. If each of the two gauche conformers lies 3.8 kJ/mol above anti, what fraction of butane molecules is anti? Use Boltzmann weights $e^{-\Delta E/RT}$. Answer as a decimal.`,
      answer: 0.70,
      tolerance: 0.02,
      why: String.raw`Each gauche weight is $e^{-3.8/2.48} \approx 0.216$, so the anti fraction is $1/(1 + 2 \times 0.216) \approx 0.70$. Forgetting that there are **two** gauche conformers gives about 0.82. See the [Boltzmann distribution](@physics/boltzmann-distribution).`,
    },
    {
      kind: 'explain',
      title: 'Generating conformers',
      body: String.raw`A drug with $n$ rotatable bonds, each with about 3 preferred angles, has roughly $3^n$ combinations, so a **systematic** search explodes quickly. Practical generators instead sample:

- **Stochastic / rule-based** methods build shapes from fragment libraries and torsion rules.
- **Distance geometry (DG)** samples random inter-atomic distances within allowed bounds and turns them into 3D coordinates.

**ETKDG** (Riniker & Landrum 2015) is DG plus **E**xperimental **T**orsion preferences, mined as patterns from small-molecule crystal structures, plus **K**nowledge terms such as "aromatic rings are flat" and "triple bonds are linear". It is the default embedding method in RDKit. Its conformers can then be relaxed with a force field by [energy minimisation](@drug/energy-minimization).`,
    },
    {
      kind: 'widget',
      title: 'ETKDG step by step',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            '**Bounds matrix.** For every atom pair, set a lower and upper distance limit: fixed by bond lengths (1–2 pairs) and angles (1–3 pairs), and otherwise bounded below by van der Waals contact.',
            '**Smooth the bounds** with the triangle inequality ($d_{ik} \\le d_{ij} + d_{jk}$), so that the limits are mutually consistent.',
            '**Sample distances** at random between the lower and upper bounds.',
            '**Embed.** Convert the distance matrix to coordinates with an eigen-decomposition of the metric matrix (as in classical multidimensional scaling).',
            '**Refine** the coordinates by minimising an error function that penalises violated bounds and wrong chirality, then **add the ET and K terms** to pull torsions towards crystal-structure preferences and keep rings flat.',
            '**Repeat** with new random distances to get an ensemble, and remove near-duplicates by RMSD.',
          ],
          notes: ['', '', 'The randomness is what produces diverse conformers.', 'Plain DG stops here (after a basic refinement); its torsions are often unrealistic.', 'This is the "ETK" part of ETKDG (Riniker & Landrum 2015).', 'Optional: force-field minimisation (MMFF, UFF) afterwards.'],
        },
      },
    },
    {
      kind: 'order',
      prompt: 'Put the steps of a typical ETKDG conformer-generation run in order.',
      steps: [
        'Build lower/upper distance bounds from the molecular graph',
        'Smooth the bounds with the triangle inequality',
        'Pick random distances within the bounds',
        'Embed the distances into 3D coordinates',
        'Refine with chirality, experimental-torsion and knowledge terms',
        'Optionally minimise with a force field and prune duplicates',
      ],
      why: 'Distance geometry goes from constraints to sampled distances to coordinates. The ETKDG-specific torsion and knowledge terms act during refinement, and force-field minimisation is an optional polish at the end.',
    },
    {
      kind: 'explain',
      title: 'Ensembles and the bioactive conformation',
      body: String.raw`The shape a ligand adopts **when bound** to its target, the **bioactive conformation**, is often *not* its lowest-energy conformer in isolation. The protein pays back some strain with favourable contacts, and strain energies of a few kcal/mol are commonly reported (Perola & Charifson 2004).

So 3D methods work with an **ensemble** of conformers, not one. A generator is judged by whether its ensemble contains a conformer close to the crystal-structure pose, measured by the heavy-atom **RMSD** after optimal superposition:

$$\text{RMSD} = \sqrt{\frac{1}{N}\sum_{i=1}^{N} \lVert \mathbf{x}_i - \mathbf{y}_i \rVert^2}$$

RMSD below about 1 Å usually counts as reproducing the bound shape.`,
    },
    {
      kind: 'truefalse',
      prompt: 'A ligand always binds its protein in its lowest-energy (global minimum) conformation.',
      answer: false,
      why: 'Binding is a trade-off: a ligand can adopt a somewhat strained conformation if the extra interactions with the protein pay for it. That is why conformer ensembles, not single minimum-energy structures, are used for docking and pharmacophore searches.',
    },
    {
      kind: 'multi',
      prompt: 'Starting from a SMILES string, which choices must be made, explicitly or by a tool’s defaults, before docking a ligand in 3D? (Select all.)',
      choices: [
        'Configuration of any unspecified stereocentres',
        'Tautomer',
        'Protonation state at the assay pH',
        'Which conformers to sample',
        'The InChIKey hash function',
      ],
      answers: [0, 1, 2, 3],
      why: 'Stereo, tautomer, charge state and conformation all change the 3D object that meets the protein. The InChIKey is just an identifier for looking molecules up; it has no effect on 3D structure.',
    },
    {
      kind: 'match',
      prompt: 'Match each term to its meaning.',
      pairs: [
        ['Conformer', 'Shape reached by rotating single bonds'],
        ['Tautomer', 'Isomer differing in hydrogen position'],
        ['Bioactive conformation', 'Shape adopted when bound to the target'],
        ['RMSD', 'Average atomic deviation between two superimposed structures'],
        ['ETKDG', 'Distance geometry plus experimental torsion preferences'],
      ],
      why: 'Conformers interconvert by bond rotation without breaking bonds, while tautomers involve moving a hydrogen, i.e. a different bonding pattern. RMSD measures how close a generated conformer is to the bioactive one, and ETKDG is the generator that produces such conformers.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A 2D graph does not fix a 3D structure: first choose **stereoisomer, tautomer and protonation state** (via $pK_a$ at pH 7.4), then sample **conformers**.
- Torsion profiles have minima (anti, gauche) and maxima (eclipsed). Conformer populations follow Boltzmann weights.
- With about $3^n$ torsion combinations, systematic search fails for flexible molecules. **ETKDG** (Riniker & Landrum 2015) is distance geometry plus experimental torsion and knowledge terms, and is RDKit's default.
- The **bioactive conformation** is often not the global minimum, so use **ensembles** and judge them by RMSD to crystal poses.`,
    },
  ],
  references: [
    { authors: 'Riniker, S., Landrum, G. A.', title: 'Better informed distance geometry: using what we know to improve conformation generation', year: 2015, venue: 'J. Chem. Inf. Model. 55, 2562–2574' },
    { authors: 'Hawkins, P. C. D.', title: 'Conformation generation: the state of the art', year: 2017, venue: 'J. Chem. Inf. Model. 57, 1747–1756' },
    { authors: 'Perola, E., Charifson, P. S.', title: 'Conformational analysis of drug-like molecules bound to proteins: an extensive study of ligand reorganization upon binding', year: 2004, venue: 'J. Med. Chem. 47, 2499–2510' },
    { authors: 'Leach, A. R.', title: 'Molecular Modelling: Principles and Applications', year: 2001, venue: '2nd ed., Prentice Hall / Pearson', detail: 'Ch. 9 (conformational analysis)' },
  ],
} satisfies LessonContent;
