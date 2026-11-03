import type { LessonContent } from '../../types';

const termsSvg = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
<g font-size="9" text-anchor="middle">
<text x="40" y="14" fill="var(--fg)" font-weight="700">bond stretch</text>
<line x1="18" y1="60" x2="62" y2="60" stroke="var(--muted)" stroke-width="2" stroke-dasharray="3 2"><animate attributeName="x2" values="56;68;56" dur="1.2s" repeatCount="indefinite"/></line>
<circle cx="18" cy="60" r="8" fill="var(--c2)"/>
<circle cx="62" cy="60" r="8" fill="var(--c2)"><animate attributeName="cx" values="56;68;56" dur="1.2s" repeatCount="indefinite"/></circle>
<text x="40" y="96" fill="var(--muted)">k_b(b − b₀)²</text>
<text x="120" y="14" fill="var(--fg)" font-weight="700">angle bend</text>
<g><line x1="120" y1="70" x2="96" y2="40" stroke="var(--muted)" stroke-width="2"/>
<line x1="120" y1="70" x2="146" y2="44" stroke="var(--muted)" stroke-width="2"><animateTransform attributeName="transform" type="rotate" values="-10 120 70;12 120 70;-10 120 70" dur="1.6s" repeatCount="indefinite"/></line>
<circle cx="146" cy="44" r="7" fill="var(--c1)"><animateTransform attributeName="transform" type="rotate" values="-10 120 70;12 120 70;-10 120 70" dur="1.6s" repeatCount="indefinite"/></circle>
<circle cx="96" cy="40" r="7" fill="var(--c1)"/><circle cx="120" cy="70" r="8" fill="var(--c2)"/></g>
<text x="120" y="96" fill="var(--muted)">θ around θ₀</text>
<text x="200" y="14" fill="var(--fg)" font-weight="700">torsion</text>
<circle cx="200" cy="56" r="20" fill="none" stroke="var(--muted)"/>
<line x1="200" y1="56" x2="200" y2="30" stroke="var(--c3)" stroke-width="2.5"/>
<g><animateTransform attributeName="transform" type="rotate" values="0 200 56;120 200 56;120 200 56;240 200 56;240 200 56;360 200 56" keyTimes="0;0.25;0.33;0.58;0.66;1" dur="5s" repeatCount="indefinite"/>
<line x1="200" y1="56" x2="200" y2="84" stroke="var(--c4)" stroke-width="2.5"/><circle cx="200" cy="84" r="5" fill="var(--c4)"/></g>
<circle cx="200" cy="30" r="5" fill="var(--c3)"/>
<text x="200" y="96" fill="var(--muted)">rotation about a bond, φ</text>
<text x="280" y="14" fill="var(--fg)" font-weight="700">non-bonded</text>
<circle cx="262" cy="56" r="9" fill="var(--c5)" fill-opacity="0.8"/><text x="262" y="59" fill="var(--surface)" font-weight="700">δ+</text>
<circle cx="298" cy="56" r="9" fill="var(--c2)" fill-opacity="0.8"><animate attributeName="cx" values="292;304;292" dur="2s" repeatCount="indefinite"/></circle>
<text x="280" y="96" fill="var(--muted)">LJ + Coulomb</text>
<text x="160" y="124" fill="var(--fg)">bonded terms (connected atoms)</text>
<line x1="12" y1="110" x2="236" y2="110" stroke="var(--c2)" stroke-width="1"/>
<line x1="248" y1="110" x2="312" y2="110" stroke="var(--c5)" stroke-width="1"/>
<text x="280" y="124" fill="var(--fg)">all other pairs</text>
<text x="160" y="142" fill="var(--muted)">U = Σ bonds + Σ angles + Σ torsions + Σ non-bonded pairs</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Balls, springs and charges',
      body: String.raw`To simulate a protein–drug complex in water we need the energy of ~50,000 atoms, evaluated hundreds of millions of times. Solving the Schrödinger equation that often is hopeless.

**Molecular mechanics** cheats cleverly: it ignores electrons and writes the potential energy $U(\mathbf r)$ as a sum of simple classical terms in the atom positions $\mathbf r$. Bonds act like springs, rotations about bonds have periodic preferences, and non-bonded atoms attract, repel and carry fixed partial charges. That recipe plus its numbers (the **parameters**) is a **force field**. The force on every atom is then just $\mathbf F_i = -\nabla_i U$.`,
    },
    {
      kind: 'recall',
      title: 'Intermolecular forces (from Chemistry)',
      points: [
        'Atoms that come too close repel strongly (overlapping electron clouds, Pauli exclusion).',
        '**Dispersion** (London) forces are weak, universal attractions from correlated electron fluctuations; they fall off as $1/r^6$.',
        'Partial charges and dipoles interact electrostatically (Coulomb), which is long-ranged.',
        '**Hydrogen bonds** are strong, directional, mostly electrostatic contacts such as N–H···O=C.',
      ],
      link: 'chem/intermolecular-forces',
    },
    {
      kind: 'explain',
      title: 'The functional form',
      body: String.raw`A typical class I force field (AMBER style; Cornell et al. 1995) is

$$U=\sum_{\text{bonds}}k_b(b-b_0)^2+\sum_{\text{angles}}k_\theta(\theta-\theta_0)^2+\sum_{\text{torsions}}\tfrac{V_n}{2}\big[1+\cos(n\varphi-\gamma)\big]+\sum_{i<j}\Big[\tfrac{A_{ij}}{r_{ij}^{12}}-\tfrac{B_{ij}}{r_{ij}^{6}}+\tfrac{q_iq_j}{4\pi\varepsilon_0 r_{ij}}\Big]$$

- $b, \theta, \varphi$: bond lengths, bond angles and torsion (dihedral) angles; subscript 0 = reference value.
- $k_b, k_\theta, V_n$: stiffness and barrier parameters.
- The last sum runs over **non-bonded** pairs: Lennard-Jones ($A/r^{12} - B/r^6$) plus Coulomb between fixed partial charges $q$.`,
      widget: { type: 'SvgDiagram', props: { svg: termsSvg }, caption: 'Each term in the energy has a picture: springs for bonds and angles, a periodic term for rotation about bonds, and pairwise LJ + Coulomb for everything else.' },
    },
    {
      kind: 'widget',
      title: 'A bond is a spring (near its minimum)',
      body: String.raw`The harmonic bond term (green) versus a **Morse** curve (blue), a better model of a real C–C bond that flattens out as the bond breaks (dissociation energy about 88 kcal/mol). Change the force constant $k_b$. AMBER uses $k_b \approx 310$ kcal mol⁻¹ Å⁻² and $b_0 = 1.526$ Å for an sp³ C–C bond.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['k*(x-1.526)^2', '88*(1-exp(-1.88*(x-1.526)))^2'],
          x: [1.0, 3.2], y: [0, 120],
          params: [{ name: 'k', min: 100, max: 700, value: 310, label: 'k_b (kcal/mol/Å²)' }],
          labels: ['harmonic force-field term', 'Morse (bond can break)'],
          xLabel: 'bond length b (Å)', yLabel: 'U (kcal/mol)',
        },
        caption: 'At thermal energies (k_BT ≈ 0.6 kcal/mol at 300 K) bonds stretch only a few hundredths of an ångström, where the two curves agree. Far out, the harmonic spring never lets go: a force field cannot break bonds.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Using $U = k_b(b-b_0)^2$ with $k_b = 310$ kcal mol⁻¹ Å⁻², what is the energy (kcal/mol) of stretching a C–C bond by 0.05 Å?`,
      answer: 0.775,
      tolerance: 0.01,
      unit: 'kcal/mol',
      why: String.raw`$310 \times 0.05^2 = 310 \times 0.0025 = 0.775$ kcal/mol, comparable to $k_BT \approx 0.6$ kcal/mol, so 0.05 Å is a typical thermal stretch. Note AMBER writes $k_b(b-b_0)^2$ with no ½; some force fields write $\tfrac12 k(b-b_0)^2$, so always check the convention before comparing constants.`,
    },
    {
      kind: 'explain',
      title: 'Torsions: the soft degrees of freedom',
      body: String.raw`Bonds and angles are stiff; the shape of a drug is mostly set by **torsions** (rotations about single bonds). Each torsion is a short Fourier series $\sum_n \tfrac{V_n}{2}[1+\cos(n\varphi-\gamma_n)]$: the **periodicity** $n$ is the number of maxima per turn, $V_n$ the barrier height and $\gamma_n$ the phase.

For ethane, $n=3$ gives three eclipsed maxima and three staggered minima (the experimental barrier is about 2.9 kcal/mol). Adding $n=1$ and $n=2$ terms makes anti and gauche different, as in butane. **Improper** torsions keep planar groups (aromatic rings, amides) flat. Atoms separated by three bonds (1–4 pairs) also get scaled non-bonded interactions, so torsion and non-bonded terms are fitted together.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['(V1/2)*(1+cos(x*PI/180)) + (V2/2)*(1-cos(2*x*PI/180)) + (V3/2)*(1+cos(3*x*PI/180))'],
          x: [-180, 180], y: [0, 6],
          params: [
            { name: 'V1', min: 0, max: 4, value: 0, label: 'V₁ (n = 1)' },
            { name: 'V2', min: 0, max: 4, value: 0, label: 'V₂ (n = 2, γ = 180°)' },
            { name: 'V3', min: 0, max: 4, value: 2.9, label: 'V₃ (n = 3)' },
          ],
          xLabel: 'torsion φ (degrees)', yLabel: 'U (kcal/mol)',
        },
        caption: 'With only V₃ you get the ethane-like threefold profile. Raise V₁ to make φ = 180° (anti) the lowest minimum.',
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`A torsion term $\tfrac{V_3}{2}[1+\cos 3\varphi]$ ($n=3$, $\gamma=0$, $V_3>0$) has its minima at which angles?`,
      choices: ['$\\varphi = 0°, \\pm 120°$', '$\\varphi = \\pm 60°, 180°$', '$\\varphi = \\pm 90°$', '$\\varphi = 0°$ and $180°$ only'],
      answer: 1,
      why: String.raw`The energy is lowest where $\cos 3\varphi = -1$, i.e. $3\varphi = 180°, 540°, \dots$, so $\varphi = 60°, 180°, 300° (= -60°)$: the staggered conformations. Angles of 0° and ±120° are where $\cos 3\varphi = +1$: the eclipsed maxima.`,
    },
    {
      kind: 'explain',
      title: 'Non-bonded terms',
      body: String.raw`**Lennard-Jones** (LJ) is usually written $U_{LJ}=4\varepsilon\big[(\sigma/r)^{12}-(\sigma/r)^6\big]$: steep $r^{-12}$ repulsion plus $r^{-6}$ dispersion. Its minimum, of depth $-\varepsilon$, sits at $r_{\min}=2^{1/6}\sigma\approx1.122\,\sigma$. Parameters for unlike atoms come from **combining rules** (AMBER and CHARMM: $\sigma_{ij}=\tfrac12(\sigma_i+\sigma_j)$, $\varepsilon_{ij}=\sqrt{\varepsilon_i\varepsilon_j}$).

**Coulomb**: $U = 332.06\,q_iq_j/r$ kcal/mol with $q$ in units of $e$ and $r$ in Å. For example, charges +0.5 and −0.5 at 3 Å in vacuum give $332.06\times(-0.25)/3\approx-27.7$ kcal/mol, which is why electrostatics dominates and why the screening by water matters so much (see [solvation models](@drug/solvation-models)).

Pairs 1–2 and 1–3 (bonded neighbours) are excluded; 1–4 pairs are scaled (AMBER: ½ for LJ and 1/1.2 for Coulomb).`,
    },
    {
      kind: 'widget',
      title: 'Explore Lennard-Jones',
      body: 'Change σ (atom size) and ε (well depth). Watch the minimum move to 1.122σ and the wall get steeper as atoms overlap.',
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['4*eps*((sig/x)^12 - (sig/x)^6)'],
          x: [2.5, 9], y: [-0.5, 0.6],
          params: [
            { name: 'sig', min: 2.5, max: 4.5, value: 3.4, label: 'σ (Å)' },
            { name: 'eps', min: 0.05, max: 0.4, value: 0.24, label: 'ε (kcal/mol)' },
          ],
          xLabel: 'r (Å)', yLabel: 'U_LJ (kcal/mol)',
        },
        caption: 'σ = 3.4 Å, ε ≈ 0.24 kcal/mol are classic values for argon. Each LJ contact is weak, but a ligand makes dozens of them.',
      },
    },
    {
      kind: 'numeric',
      prompt: 'For a Lennard-Jones pair with σ = 3.4 Å, at what separation r (Å) is the energy lowest?',
      answer: 3.816,
      tolerance: 0.01,
      unit: 'Å',
      why: String.raw`$r_{\min}=2^{1/6}\sigma = 1.1225\times3.4 \approx 3.82$ Å. A common slip is to answer σ itself, but at $r=\sigma$ the LJ energy is exactly zero, on the repulsive wall.`,
    },
    {
      kind: 'explain',
      title: 'The big families',
      body: String.raw`- **AMBER**: Cornell et al. (1995) "ff94" for proteins and nucleic acids; descendants include ff14SB and ff19SB.
- **CHARMM**: CHARMM22 all-atom protein force field (MacKerell et al. 1998); later a 2D backbone correction map (CMAP) and CHARMM36. Adds Urey–Bradley 1–3 terms.
- **OPLS-AA** (Jorgensen et al. 1996): LJ and charges tuned to reproduce liquid properties; commercial successors OPLS3/OPLS4 (Schrödinger).
- **Drug-like ligands** need broad coverage: **GAFF** (Wang et al. 2004) with AMBER, **CGenFF** with CHARMM, and the Open Force Field (OpenFF) initiative's SMIRNOFF force fields.

Each uses **atom types**: an aromatic carbon, a carbonyl carbon and an sp³ carbon get different parameters. Don't mix families: their terms were fitted together.`,
    },
    {
      kind: 'match',
      prompt: 'Match each force field to what it is best known for.',
      pairs: [
        ['AMBER ff94 (Cornell et al. 1995)', 'Protein/nucleic-acid force field with RESP charges'],
        ['CHARMM22 / CHARMM36', 'Protein force field later given a CMAP backbone correction'],
        ['OPLS-AA', 'Parameters tuned to liquid densities and heats of vaporisation'],
        ['GAFF', 'General AMBER-compatible parameters for drug-like organic molecules'],
      ],
      why: 'Biomolecular force fields (AMBER, CHARMM) cover the 20 amino acids and nucleotides in great detail; ligands need general force fields such as GAFF, CGenFF or OpenFF, chosen to match the protein force field.',
    },
    {
      kind: 'explain',
      title: 'Where the numbers come from',
      body: String.raw`**Parameterisation** fits each term to reference data:

- $b_0, \theta_0$: crystal structures and quantum-mechanical (QM) geometries; $k_b, k_\theta$: vibrational spectra or QM Hessians.
- **Partial charges**: AMBER uses **RESP** (Bayly et al. 1993), a restrained fit to the QM electrostatic potential (HF/6-31G*) around the molecule; for many ligands the faster semi-empirical **AM1-BCC** scheme approximates it. CHARMM fits charges to QM interaction energies with water.
- **Torsions**: fitted so that MM reproduces QM energy scans of rotating each bond, *after* everything else is in place.
- **LJ**: tuned to condensed-phase data such as liquid densities and heats of vaporisation.

A new chemotype with an unusual torsion often needs a custom torsion fit; a poor torsion can ruin a docking or free-energy result.`,
    },
    {
      kind: 'fill',
      prompt: 'Partial charges in AMBER are fitted to the quantum-mechanical ___ around the molecule (the ___ method), while torsion parameters are usually fitted to QM ___.',
      bank: ['electrostatic potential', 'RESP', 'energy scans', 'bond lengths', 'Morse', 'NMR spectra'],
      answer: ['electrostatic potential', 'RESP', 'energy scans'],
      why: 'RESP fits point charges to reproduce the QM electrostatic potential on points around the molecule, with restraints to avoid wild values on buried atoms. Torsions are fitted last, to the energy difference between QM and MM rotational scans.',
    },
    {
      kind: 'explain',
      title: 'What a fixed-charge force field cannot do',
      body: String.raw`- **No polarisation**: each charge is fixed, so a molecule's charge distribution cannot respond to a nearby ion or a change from water to a greasy pocket. Polarisable force fields (AMOEBA with induced dipoles; CHARMM Drude oscillators) fix this at a higher cost. RESP's HF/6-31G* charges are deliberately "over-polarised" to mimic water on average.
- **No chemistry**: harmonic bonds never break, so reactions and covalent drug warheads need [QM/MM](@drug/qm-mm).
- **No electronic effects** such as charge transfer or σ-holes (halogen bonds need extra sites).
- **Errors add up**: small parameter errors over thousands of interactions give binding free energies uncertain to about 1 kcal/mol at best.

Machine-learned interatomic potentials are a growing alternative, trading interpretability for QM-like accuracy.`,
    },
    {
      kind: 'multi',
      prompt: 'Which can a standard fixed-charge force field (e.g. GAFF with AM1-BCC charges) **not** describe properly?',
      choices: [
        'A covalent inhibitor forming a bond to a cysteine',
        'A ligand\'s charge distribution changing as it moves from water into the pocket',
        'Steric clashes between overlapping atoms',
        'The preference for staggered over eclipsed conformations',
      ],
      answers: [0, 1],
      why: 'Bond formation needs a quantum description (QM/MM), and fixed charges cannot polarise. Steric clashes are exactly what the $r^{-12}$ LJ wall captures, and staggered preferences are built into the torsion terms.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A force field is a classical energy function: harmonic **bonds** and **angles**, periodic **torsions**, plus **Lennard-Jones** and **Coulomb** between non-bonded pairs; $\mathbf F=-\nabla U$.
- LJ minimum at $2^{1/6}\sigma$; Coulomb $=332\,q_iq_j/r$ kcal/mol, strong and long-ranged.
- Families: **AMBER**, **CHARMM**, **OPLS**; ligands via **GAFF**, CGenFF, OpenFF. Never mix and match.
- Parameters come from QM and experiment (RESP/AM1-BCC charges, torsion scans, liquid properties).
- Fixed charges mean no polarisation and no bond breaking.`,
    },
  ],
  references: [
    { authors: 'Cornell, W. D., Cieplak, P., Bayly, C. I., et al.', title: 'A second generation force field for the simulation of proteins, nucleic acids, and organic molecules', year: 1995, venue: 'J. Am. Chem. Soc. 117, 5179–5197' },
    { authors: 'MacKerell, A. D., Jr., Bashford, D., Bellott, M., et al.', title: 'All-atom empirical potential for molecular modeling and dynamics studies of proteins', year: 1998, venue: 'J. Phys. Chem. B 102, 3586–3616' },
    { authors: 'Wang, J., Wolf, R. M., Caldwell, J. W., Kollman, P. A., Case, D. A.', title: 'Development and testing of a general amber force field', year: 2004, venue: 'J. Comput. Chem. 25, 1157–1174' },
    { authors: 'Bayly, C. I., Cieplak, P., Cornell, W. D., Kollman, P. A.', title: 'A well-behaved electrostatic potential based method using charge restraints for deriving atomic charges: the RESP model', year: 1993, venue: 'J. Phys. Chem. 97, 10269–10280' },
    { authors: 'Leach, A. R.', title: 'Molecular Modelling: Principles and Applications', year: 2001, venue: '2nd ed., Prentice Hall', detail: 'Ch. 4' },
  ],
} satisfies LessonContent;
