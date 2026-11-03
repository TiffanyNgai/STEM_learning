import type { LessonContent } from '../../types';

const waterSvg = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
<g font-size="9" text-anchor="middle">
<text x="80" y="14" fill="var(--fg)" font-weight="700">TIP3P (3 sites)</text>
<line x1="80" y1="60" x2="48" y2="98" stroke="var(--muted)" stroke-width="3"/>
<line x1="80" y1="60" x2="112" y2="98" stroke="var(--muted)" stroke-width="3"/>
<circle cx="80" cy="60" r="16" fill="var(--c5)" fill-opacity="0.85"/>
<text x="80" y="63" fill="var(--surface)" font-weight="700">O −0.834</text>
<circle cx="48" cy="98" r="10" fill="var(--c2)" fill-opacity="0.85"/>
<circle cx="112" cy="98" r="10" fill="var(--c2)" fill-opacity="0.85"/>
<text x="48" y="122" fill="var(--fg)">H +0.417</text>
<text x="112" y="122" fill="var(--fg)">H +0.417</text>
<text x="80" y="140" fill="var(--muted)">0.9572 Å, 104.52°, LJ on O only</text>
<text x="240" y="14" fill="var(--fg)" font-weight="700">TIP4P-type (4 sites)</text>
<line x1="240" y1="60" x2="208" y2="98" stroke="var(--muted)" stroke-width="3"/>
<line x1="240" y1="60" x2="272" y2="98" stroke="var(--muted)" stroke-width="3"/>
<circle cx="240" cy="60" r="16" fill="var(--muted)" fill-opacity="0.5"/>
<text x="240" y="50" fill="var(--fg)">O (LJ, no charge)</text>
<circle cx="240" cy="72" r="4" fill="var(--c5)"><animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/></circle>
<text x="240" y="88" fill="var(--c5)" font-weight="700">M (−)</text>
<circle cx="208" cy="98" r="10" fill="var(--c2)" fill-opacity="0.85"/>
<circle cx="272" cy="98" r="10" fill="var(--c2)" fill-opacity="0.85"/>
<text x="240" y="140" fill="var(--muted)">negative charge moved onto a massless site M</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Drugs bind in water',
      body: String.raw`Proteins and drugs live in water, about 55 mol/L of it. Water is not a passive backdrop:

- it **screens** charges: its dielectric constant $\varepsilon\approx78$ weakens electrostatic attraction about 80-fold compared with vacuum;
- it makes **hydrogen bonds** that a ligand must break (**desolvation**) before it can bind;
- it drives the **hydrophobic effect**, which pushes greasy surfaces together.

A simulation must therefore model solvent. There are two strategies: **explicit** water (thousands of real water molecules) or **implicit** solvent (a continuous dielectric medium).`,
    },
    {
      kind: 'recall',
      title: 'Electrostatics (from Physics)',
      points: [
        'Point charges interact by Coulomb\'s law, $F \\propto q_1q_2/r^2$ (energy $\\propto q_1q_2/r$).',
        'Electric fields superpose: the field of many charges is the sum of their fields.',
        'In a medium of relative permittivity $\\varepsilon$, interactions between charges are reduced by a factor $\\varepsilon$.',
      ],
      link: 'physics/electrostatics',
    },
    {
      kind: 'explain',
      title: 'Explicit water: TIP3P and friends',
      body: String.raw`**TIP3P** (Jorgensen et al. 1983) is a rigid, three-site water: O–H = 0.9572 Å, H–O–H = 104.52°, charges $q_O=-0.834\,e$ and $q_H=+0.417\,e$, and a single Lennard-Jones site on oxygen. It is the default partner of the AMBER and CHARMM force fields (CHARMM uses a variant with small LJ terms on H).

**TIP4P**-type models move the negative charge onto a massless site **M** on the H–O–H bisector, which improves the electrostatics. Later refinements include TIP4P-Ew and OPC. Each water model was fitted with particular choices (cut-offs, electrostatics), and protein force fields were fitted with particular water models. So keep the pairing the force field intends.`,
      widget: { type: 'SvgDiagram', props: { svg: waterSvg }, caption: 'Rigid point-charge water models. TIP3P remains the most widely used in biomolecular simulation, despite known flaws.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Estimate the dipole moment of a TIP3P water in debye. The dipole is $\mu = 2\,q_H\,b\cos(\theta/2)$ with $q_H = 0.417\,e$, $b = 0.9572$ Å, $\theta = 104.52°$, and $1\ e\,\text{Å} = 4.803$ D.`,
      answer: 2.35,
      tolerance: 0.03,
      unit: 'D',
      why: String.raw`$\cos 52.26° = 0.612$, so $\mu = 2\times0.417\times0.9572\times0.612 = 0.489\ e$Å $\approx 2.35$ D. That is larger than the gas-phase value of 1.85 D on purpose: a fixed-charge water must mimic, on average, the extra polarisation that water molecules feel in the liquid.`,
    },
    {
      kind: 'explain',
      title: 'Periodic boxes and long-range electrostatics',
      body: String.raw`A finite droplet of water would be mostly surface. Instead we use **periodic boundary conditions**: the simulation box is surrounded by infinite copies of itself. An atom leaving one face re-enters through the opposite one, and each atom interacts with the nearest image of every other (the **minimum-image** convention). Proteins are given at least ~10 Å of water padding so they never "see" their own image.

Coulomb's $1/r$ decays too slowly to simply cut off; truncation causes artefacts. **Ewald summation** splits the sum into a short-range part computed directly plus a smooth long-range part computed in reciprocal (Fourier) space. **Particle-mesh Ewald** (PME; Darden et al. 1993) does the latter with FFTs on a grid in $O(N\log N)$ time, and is now standard.`,
      widget: { type: 'LJMolecularDynamics', props: { temperature: 1.2, showDt: false }, caption: 'A periodic box (dashed): particles leaving one edge reappear on the opposite edge, and forces use the nearest image across the boundary.' },
    },
    {
      kind: 'mcq',
      prompt: 'Why do modern explicit-solvent simulations use particle-mesh Ewald instead of simply ignoring electrostatics beyond 10 Å?',
      choices: [
        'Coulomb interactions decay slowly (as 1/r), so truncating them causes artefacts',
        'Lennard-Jones interactions are long-ranged and need Fourier sums',
        'PME is needed to keep the water molecules rigid',
        'Cut-offs are slower than PME for every system size',
      ],
      answer: 0,
      why: String.raw`The $1/r$ Coulomb energy is far from negligible at 10 Å (two unit charges in vacuum still interact by about 33 kcal/mol), so a sharp cut-off distorts structure, especially of ions and charged groups. LJ falls as $r^{-6}$ and is safely cut off. Water rigidity comes from constraint algorithms such as SETTLE, not PME. PME is not faster than a plain cut-off; it is more accurate at a reasonable cost.`,
    },
    {
      kind: 'explain',
      title: 'Implicit solvent: water as a continuum',
      body: String.raw`Most atoms in an explicit simulation are water. **Implicit solvent** replaces them with a continuous medium of dielectric constant $\varepsilon_{\text{out}}\approx 80$ outside the molecule's cavity (with $\varepsilon_{\text{in}}\approx1$–4 inside). The solvation free energy is split into

$$\Delta G_{\text{solv}} = \Delta G_{\text{polar}} + \Delta G_{\text{nonpolar}}.$$

The polar part is exact for this continuum model if you solve the **Poisson–Boltzmann (PB)** equation, $\nabla\cdot[\varepsilon(\mathbf r)\nabla\phi(\mathbf r)] = -\rho(\mathbf r)/\varepsilon_0$, with mobile ions distributed by a Boltzmann factor. It is solved numerically on a 3D grid (e.g. APBS, DelPhi). The nonpolar part (making a cavity plus dispersion) is often approximated as $\gamma\times$ solvent-accessible surface area (SASA).`,
    },
    {
      kind: 'explain',
      title: 'Born and Generalized Born',
      body: String.raw`The simplest case is the **Born** model: a charge $q$ in a sphere of radius $a$, moved from vacuum into a dielectric $\varepsilon$:

$$\Delta G_{\text{Born}} = -\frac{q^2}{8\pi\varepsilon_0 a}\Big(1-\frac1\varepsilon\Big)\approx -166\,\frac{q^2}{a}\Big(1-\frac1\varepsilon\Big)\ \text{kcal/mol}\quad(q\text{ in }e,\ a\text{ in Å}).$$

**Generalized Born** (GB; Still et al. 1990) extends this to a whole molecule with an analytic formula. Each atom gets an *effective Born radius* (bigger when it is buried), and pairs are combined by a smooth function of distance. GB is much faster than PB and cheap enough to use in MD.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['-166*q^2/x*(1-1/eps)'],
          x: [0.5, 6], y: [-400, 0],
          params: [
            { name: 'q', min: 0, max: 2, value: 1, label: 'charge q (e)' },
            { name: 'eps', min: 1, max: 80, value: 80, label: 'solvent ε' },
          ],
          xLabel: 'ion radius a (Å)', yLabel: 'ΔG_Born (kcal/mol)',
        },
        caption: 'Small, highly charged ions are solvated most strongly; ΔG scales as q². With ε = 1 (vacuum to vacuum) there is no solvation at all.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Using the Born formula $\Delta G \approx -166\,(q^2/a)(1-1/\varepsilon)$ kcal/mol, estimate the solvation free energy of a +1 ion of radius 2 Å in water ($\varepsilon = 80$).`,
      answer: -81.96,
      tolerance: 0.5,
      unit: 'kcal/mol',
      why: String.raw`$-166\times(1/2)\times(1-1/80) = -83\times0.9875 \approx -82$ kcal/mol. Hydration energies of small monovalent ions really are on this scale (around −70 to −100 kcal/mol). That is why burying a charged group in a protein without a good partner costs so much.`,
    },
    {
      kind: 'explain',
      title: 'Choosing a model',
      body: String.raw`**Implicit** (GB/PB): no water atoms to simulate, and the solvent responds instantly with no friction, so conformations change faster. It's used for rescoring docked poses, for [MM-PBSA/GBSA](@drug/end-point-methods), and for quick folding or peptide studies.

**Explicit**: specific hydrogen bonds, **bridging waters** between ligand and protein, water entropy in pockets, ion-specific effects and realistic friction. It is the standard for production MD and alchemical [free-energy calculations](@drug/free-energy-methods).

A useful rule: if a single water molecule matters (a conserved water in a kinase hinge, or a displaced "unhappy" water in a pocket), you need explicit solvent.`,
    },
    {
      kind: 'match',
      prompt: 'Match each term to its description.',
      pairs: [
        ['TIP3P', 'Rigid 3-site explicit water model'],
        ['Particle-mesh Ewald', 'Long-range electrostatics with FFTs in a periodic box'],
        ['Poisson–Boltzmann', 'Grid solution for the electrostatic potential in a dielectric continuum with ions'],
        ['Generalized Born', 'Analytic approximation using effective Born radii'],
        ['SASA term', 'Nonpolar solvation proportional to exposed surface area'],
      ],
      why: 'TIP3P and PME belong to explicit-solvent simulations. PB, GB and the SASA term are the parts of an implicit-solvent model (polar plus nonpolar).',
    },
    {
      kind: 'multi',
      prompt: 'Which effects does a standard implicit-solvent (GB) model **miss or only crudely approximate**?',
      choices: [
        'A structural water bridging a ligand carbonyl and a backbone NH',
        'Specific, directional hydrogen bonds between solute and individual water molecules',
        'The average dielectric screening of two charges far apart in solution',
        'The reaction-field stabilisation of an exposed charged side chain',
      ],
      answers: [0, 1],
      why: 'A continuum has no molecules, so it cannot hold one water in place or form directional H-bonds. Average screening and reaction-field stabilisation are exactly what a dielectric continuum is designed to capture.',
    },
    {
      kind: 'truefalse',
      prompt: 'TIP3P reproduces the experimental properties of liquid water essentially perfectly, which is why it is still so widely used.',
      answer: false,
      why: 'TIP3P has known errors: for example its self-diffusion coefficient is roughly twice the experimental value, and it gives a poor temperature of maximum density. It persists because major protein force fields were parameterised with it, and it is cheap. Newer models (TIP4P-Ew, OPC) are more accurate.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Water screens charges ($\varepsilon\approx78$), forms H-bonds that must be broken on binding, and drives the hydrophobic effect.
- **Explicit**: TIP3P ($q_O=-0.834$, $q_H=+0.417$; dipole ≈ 2.35 D), TIP4P-type and OPC, run in **periodic boxes** with **PME** for long-range electrostatics.
- **Implicit**: $\Delta G_{\text{solv}}=\Delta G_{\text{polar}}$ (PB or GB) $+\ \Delta G_{\text{nonpolar}}$ (≈ γ·SASA). It is fast but has no individual waters.
- The Born model shows the scale: about −82 kcal/mol for a +1 ion of radius 2 Å.`,
    },
  ],
  references: [
    { authors: 'Jorgensen, W. L., Chandrasekhar, J., Madura, J. D., Impey, R. W., Klein, M. L.', title: 'Comparison of simple potential functions for simulating liquid water', year: 1983, venue: 'J. Chem. Phys. 79, 926–935' },
    { authors: 'Darden, T., York, D., Pedersen, L.', title: "Particle mesh Ewald: an N·log(N) method for Ewald sums in large systems", year: 1993, venue: 'J. Chem. Phys. 98, 10089–10092' },
    { authors: 'Still, W. C., Tempczyk, A., Hawley, R. C., Hendrickson, T.', title: 'Semianalytical treatment of solvation for molecular mechanics and dynamics', year: 1990, venue: 'J. Am. Chem. Soc. 112, 6127–6129' },
    { authors: 'Onufriev, A. V., Case, D. A.', title: 'Generalized Born implicit solvent models for biomolecules', year: 2019, venue: 'Annu. Rev. Biophys. 48, 275–296' },
    { authors: 'Leach, A. R.', title: 'Molecular Modelling: Principles and Applications', year: 2001, venue: '2nd ed., Prentice Hall', detail: 'Ch. 6 (periodic boundaries, long-range forces), Ch. 11 (continuum solvation)' },
  ],
} satisfies LessonContent;
