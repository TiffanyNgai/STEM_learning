import type { LessonContent } from '../../types';

const partitionSvg = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
<g font-size="9">
<ellipse cx="160" cy="95" rx="150" ry="84" fill="var(--muted)" fill-opacity="0.10" stroke="var(--muted)"/>
${Array.from({ length: 34 }, (_, i) => {
    const a = (i / 34) * Math.PI * 2; const r = 0.62 + 0.3 * ((i * 37) % 10) / 10;
    const x = 160 + 140 * r * Math.cos(a), y = 95 + 76 * r * Math.sin(a);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="var(--muted)"/><text x="${(x + 4).toFixed(1)}" y="${(y - 3).toFixed(1)}" font-size="7" fill="var(--muted)">${i % 2 ? '+' : '−'}</text>`;
  }).join('')}
<circle cx="170" cy="92" r="46" fill="var(--c4)" fill-opacity="0.15" stroke="var(--c4)" stroke-width="1.5">
<animate attributeName="r" values="44;48;44" dur="3s" repeatCount="indefinite"/></circle>
<text x="170" y="40" text-anchor="middle" fill="var(--c4)" font-weight="700">QM region</text>
<line x1="70" y1="120" x2="104" y2="108" stroke="var(--fg)" stroke-width="2"/>
<circle cx="70" cy="120" r="5" fill="var(--muted)"/><text x="58" y="138" fill="var(--fg)">Cα (MM)</text>
<circle cx="104" cy="108" r="3.5" fill="var(--c2)"/><text x="88" y="100" fill="var(--c2)" font-weight="700">H link</text>
<line x1="88" y1="114" x2="136" y2="98" stroke="var(--fg)" stroke-width="2" stroke-dasharray="3 2"/>
<circle cx="136" cy="98" r="5.5" fill="var(--fg)"/><text x="128" y="118" fill="var(--fg)">Cβ</text>
<line x1="136" y1="98" x2="166" y2="88" stroke="var(--fg)" stroke-width="2"/>
<circle cx="166" cy="88" r="6.5" fill="var(--c3)"/><text x="160" y="77" fill="var(--c3)" font-weight="700">S⁻</text>
<line x1="171" y1="90" x2="194" y2="98" stroke="var(--c5)" stroke-width="2" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" values="12;0" dur="0.8s" repeatCount="indefinite"/></line>
<circle cx="198" cy="100" r="5.5" fill="var(--fg)"/><line x1="198" y1="100" x2="222" y2="92" stroke="var(--fg)" stroke-width="2"/><line x1="200" y1="104" x2="224" y2="96" stroke="var(--fg)" stroke-width="2"/>
<circle cx="224" cy="94" r="5.5" fill="var(--fg)"/><text x="218" y="118" fill="var(--fg)">acrylamide C=C</text>
<line x1="40" y1="172" x2="70" y2="124" stroke="var(--muted)" stroke-dasharray="2 2"/>
<text x="8" y="182" fill="var(--muted)">MM boundary cut: Cα–Cβ, capped by link H</text>
<text x="230" y="168" fill="var(--muted)">MM point charges ±</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'When bonds break, force fields fail',
      body: String.raw`A [force field](@drug/force-fields) treats bonds as fixed springs between atoms whose partial charges never change. It cannot describe a bond forming or breaking. Yet many drugs work this way: **covalent inhibitors** such as ibrutinib (bonds to Cys481 of BTK), osimertinib (Cys797 of EGFR) and sotorasib (Cys12 of KRAS G12C) carry an electrophilic **warhead** that reacts with a nucleophilic residue.

Quantum mechanics (QM) describes electrons, and so it describes reactions. But a full-protein QM calculation on tens of thousands of atoms is far too expensive. **QM/MM** combines the two: QM where the chemistry happens, MM everywhere else.`,
    },
    {
      kind: 'recall',
      title: 'Density functional theory (from Chemistry)',
      points: [
        'DFT computes the energy from the electron density, using the Kohn–Sham equations solved self-consistently.',
        'Accuracy depends on the exchange–correlation functional (e.g. B3LYP, ωB97X-D); dispersion corrections (e.g. -D3) are needed for non-covalent contacts.',
        String.raw`Cost grows roughly as $N^3$ to $N^4$ with system size, so routine DFT handles roughly tens to a few hundred atoms.`,
        'DFT can describe bond breaking and transition states, which force fields cannot.',
      ],
      link: 'chem/dft-intro',
    },
    {
      kind: 'explain',
      title: 'The QM/MM idea',
      body: String.raw`Warshel & Levitt (1976) studied the lysozyme reaction by treating a small reactive region quantum mechanically and the rest of the enzyme classically. That idea was part of the 2013 Nobel Prize in Chemistry (Karplus, Levitt, Warshel).

In the common **additive** scheme the energy is

$$E = E_{QM}(\text{inner}) + E_{MM}(\text{outer}) + E_{QM/MM}(\text{coupling})$$

The coupling term includes van der Waals and electrostatic interactions across the boundary, plus bonded terms for any cut bonds. In the **subtractive** scheme (ONIOM), you compute MM for everything, then replace the inner region's MM energy with QM:

$$E = E_{MM}(\text{all}) + E_{QM}(\text{inner}) - E_{MM}(\text{inner})$$`,
    },
    {
      kind: 'widget',
      title: 'Partitioning a covalent complex',
      body: 'The QM region holds the cysteine side chain and the acrylamide warhead (in practice, often 50–200 atoms). The rest of the protein and solvent stays MM. Where the boundary cuts the Cα–Cβ bond, a hydrogen **link atom** caps the QM fragment.',
      widget: { type: 'SvgDiagram', props: { svg: partitionSvg }, caption: 'The animated red bond is the S–C bond being formed. MM atoms enter the QM calculation as point charges (electrostatic embedding).' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A subtractive (ONIOM-style) QM/MM calculation of a reaction energy gives $\Delta E_{MM}(\text{all}) = -3.0$, $\Delta E_{QM}(\text{inner}) = -12.5$ and $\Delta E_{MM}(\text{inner}) = +4.0$ kcal/mol. What is the QM/MM reaction energy?`,
      answer: -19.5,
      tolerance: 0.05,
      unit: 'kcal/mol',
      why: String.raw`$\Delta E = -3.0 + (-12.5) - (+4.0) = -19.5$ kcal/mol. The MM description of the inner region is *subtracted* so that it is not counted twice. Adding it instead gives −11.5.`,
    },
    {
      kind: 'explain',
      title: 'How the QM region feels the protein',
      body: String.raw`Senn & Thiel (2009) distinguish three levels of **embedding**:
- **Mechanical**: QM–MM interactions are computed with MM terms only. The QM electrons never feel the protein's charges.
- **Electrostatic** (the standard): MM point charges enter the QM Hamiltonian, so the wavefunction is **polarised** by the protein environment. This matters a lot for reactions, because enzymes stabilise charged transition states electrostatically.
- **Polarisable**: the MM region can also respond (induced dipoles or fluctuating charges). This is more realistic but costlier and less standardised.`,
    },
    {
      kind: 'match',
      prompt: 'Match each embedding scheme to its description.',
      pairs: [
        ['Mechanical embedding', 'QM–MM interactions treated purely classically; no polarisation of the QM density'],
        ['Electrostatic embedding', 'MM point charges included in the QM Hamiltonian'],
        ['Polarisable embedding', 'QM and MM regions polarise each other'],
      ],
      why: 'Each level adds a layer of mutual response. Electrostatic embedding is the usual compromise for enzyme and covalent-inhibitor studies.',
    },
    {
      kind: 'explain',
      title: 'Cutting covalent bonds: link atoms',
      body: String.raw`If the QM/MM boundary passes through a covalent bond, the QM fragment has a dangling valence (an unpaired electron). The common fix is a **link atom**: a hydrogen placed along the cut bond (at a fixed fraction of its length) to cap the QM side.

Good practice:
- cut **non-polar single C–C bonds**, e.g. the Cα–Cβ bond of a residue, never a polar, conjugated or reacting bond;
- keep the boundary a few bonds from the reacting atoms;
- adjust MM charges right next to the link atom (delete, shift or redistribute them), otherwise they over-polarise the nearby QM density.

Alternatives include frozen localised orbitals and specially parameterised boundary atoms.`,
    },
    {
      kind: 'mcq',
      prompt: 'You model a cysteine attacking an acrylamide. Where is the best place to cut the QM/MM boundary on the cysteine?',
      choices: [
        'The Cα–Cβ single bond',
        'The S–H bond of the thiol',
        'The C=C double bond of the warhead',
        'The peptide C=O bond of the backbone',
      ],
      answer: 0,
      why: 'Cα–Cβ is a non-polar single bond, one bond away from the reactive sulfur, so a link-atom cap barely disturbs the chemistry. Cutting the S–H bond or the warhead C=C would split the reacting group itself. The peptide C=O is a polar, conjugated bond.',
    },
    {
      kind: 'explain',
      title: 'Covalent drugs: binding, then reaction',
      body: String.raw`An irreversible covalent inhibitor acts in two steps: first reversible binding ($K_I$), then bond formation (rate $k_{inact}$):

$$E + I \overset{K_I}{\rightleftharpoons} E{\cdot}I \xrightarrow{k_{inact}} E{-}I$$

Its potency is reported as $k_{inact}/K_I$, not as an IC50 (which changes with incubation time). Typical warheads: **acrylamides** (Michael acceptors for cysteine), **cyanoacrylamides** (reversible covalent), and **boronic acids** (bortezomib binds the catalytic Thr1 of the proteasome).

QM/MM can estimate the reaction barrier inside the real pocket. Because free-energy sampling needs many energy evaluations, it is often run with fast semi-empirical QM, then refined with DFT.`,
    },
    {
      kind: 'widget',
      title: 'Barriers set rates exponentially',
      body: String.raw`Eyring's equation $k = \frac{k_BT}{h}e^{-\Delta G^\ddagger/RT}$ links a computed barrier to a rate ($k_BT/h \approx 6.2\times10^{12}$ s⁻¹ at 298 K). Each 1.36 kcal/mol of barrier is a factor of 10 in rate, so QM methods need about 1–2 kcal/mol accuracy to be useful for comparing warheads.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['log10(6.2e12*exp(-x/0.593))', 'log10(6.2e12*exp(-(x-d)/0.593))'],
          params: [{ name: 'd', min: 0, max: 4, value: 1.4, label: 'barrier lowered by (kcal/mol)' }],
          labels: ['original', 'lowered barrier'],
          x: [10, 25], y: [-6, 6], xLabel: 'ΔG‡ (kcal/mol)', yLabel: 'log10 k (s⁻¹)',
        },
        caption: 'At ΔG‡ = 20 kcal/mol, k ≈ 0.014 s⁻¹ (half-life ≈ 50 s). Every 1.36 kcal/mol shifts the curve by one decade.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`At 298 K ($RT = 0.593$ kcal/mol), by what factor does a reaction rate increase if a warhead modification lowers $\Delta G^\ddagger$ by 2.0 kcal/mol?`,
      answer: 29,
      tolerance: 1,
      unit: '×',
      why: String.raw`$k_2/k_1 = e^{2.0/0.593} = e^{3.37} \approx 29$. The prefactor $k_BT/h$ cancels in the ratio. A 2 kcal/mol error in a computed barrier therefore means a ~30-fold error in predicted reactivity.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps of a typical QM/MM study of a covalent inhibitor.',
      steps: [
        'Build and equilibrate the noncovalent complex with classical MD',
        'Choose the QM region and boundary bonds (link atoms)',
        'Choose the QM method and embedding scheme',
        'Optimise reactant and product and scan the reaction coordinate to find the barrier',
        'Refine with free-energy sampling or higher-level QM single points',
      ],
      why: 'The classical model provides realistic starting structures. The partitioning and method choices define the model, the scan locates the transition state, and sampling or higher-level QM turns a single energy path into a reliable barrier.',
    },
    {
      kind: 'truefalse',
      prompt: 'In electrostatic embedding, the QM electron density is polarised by the point charges of the MM protein atoms.',
      answer: true,
      why: 'That is the defining feature of electrostatic embedding. In mechanical embedding the QM density would be computed as if in vacuum, which misses how the enzyme electrostatically stabilises charged intermediates.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Force fields cannot form or break bonds. **QM/MM** puts the reactive region in QM and the rest in MM (Warshel & Levitt 1976).
- Additive: $E = E_{QM} + E_{MM} + E_{coupling}$. Subtractive (ONIOM): $E_{MM}(\text{all}) + E_{QM}(\text{in}) - E_{MM}(\text{in})$.
- **Electrostatic embedding** is standard: MM charges polarise the QM density.
- Cut non-polar C–C bonds far from the reaction, cap them with **link H atoms**, and treat nearby charges with care.
- Covalent drugs: two-step $K_I$, $k_{inact}$; QM/MM gives barriers, where 1.36 kcal/mol is a factor of 10 in rate.
- Next: [quantum chemistry for ligands](@drug/quantum-chemistry-drug-design).`,
    },
  ],
  references: [
    { authors: 'Warshel, A., Levitt, M.', title: 'Theoretical studies of enzymic reactions: dielectric, electrostatic and steric stabilization of the carbonium ion in the reaction of lysozyme', year: 1976, venue: 'J. Mol. Biol. 103, 227–249' },
    { authors: 'Senn, H. M., Thiel, W.', title: 'QM/MM methods for biomolecular systems', year: 2009, venue: 'Angew. Chem. Int. Ed. 48, 1198–1229' },
    { authors: 'Singh, J., Petter, R. C., Baillie, T. A., Whitty, A.', title: 'The resurgence of covalent drugs', year: 2011, venue: 'Nat. Rev. Drug Discov. 10, 307–317' },
    { authors: 'Svensson, M., Humbel, S., Froese, R. D. J., Matsubara, T., Sieber, S., Morokuma, K.', title: 'ONIOM: a multilayered integrated MO + MM method for geometry optimizations and single point energy calculations', year: 1996, venue: 'J. Phys. Chem. 100, 19357–19363' },
  ],
} satisfies LessonContent;
