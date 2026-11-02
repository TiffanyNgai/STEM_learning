import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'How tightly does it hold on?',
      body: String.raw`A drug works only while it is bound to its target. Picture a crowded dance floor: drug molecules (L) and target proteins (P) keep pairing up and splitting apart. **Affinity** measures how strongly they prefer being paired.

Every potency number in a database — $K_d$, $K_i$, IC50, EC50 — is a different way of putting a value on that preference. They are *not* interchangeable, and mixing them up is one of the most common errors in computational drug discovery.`,
    },
    {
      kind: 'explain',
      title: 'The dissociation constant Kd',
      body: String.raw`For reversible binding $P + L \rightleftharpoons PL$, molecules associate with rate constant $k_{on}$ and dissociate with $k_{off}$. At equilibrium the two rates balance, giving the **dissociation constant**

$$K_d = \frac{[P][L]}{[PL]} = \frac{k_{off}}{k_{on}}$$

$K_d$ has units of concentration. **Smaller $K_d$ = tighter binding.** Its meaning is concrete: $K_d$ is the free-ligand concentration at which **half the target is occupied**. Fractional occupancy is

$$\theta = \frac{[L]}{[L]+K_d}.$$

Example: $K_d = 10$ nM and $[L] = 90$ nM gives $\theta = 90/100 = 90\%$.`,
    },
    {
      kind: 'widget',
      title: 'Occupancy vs concentration',
      body: 'Slide the Kd and watch the saturation curve shift. On a linear axis it is a hyperbola; on a log axis (next card) it becomes a sigmoid.',
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['x/(x+K)'], x: [0, 100], y: [0, 1.05], params: [{ name: 'K', min: 1, max: 50, value: 10, label: 'Kd (nM)' }], xLabel: '[L] (nM)', yLabel: 'occupancy θ' },
        caption: 'θ = [L]/([L]+Kd). At [L] = Kd, θ = 0.5; at [L] = 9·Kd, θ = 0.9.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A drug has $K_d = 5$ nM. What free concentration (in nM) is needed for **80 %** target occupancy?`,
      answer: 20,
      tolerance: 0.5,
      unit: 'nM',
      why: String.raw`Solve $0.8 = L/(L+5)$: $0.8L + 4 = L$ so $L = 20$ nM, i.e. $4\times K_d$. A common slip is to answer $0.8\times K_d$ — but occupancy is not linear in concentration.`,
    },
    {
      kind: 'recall',
      title: 'Boltzmann factors (from Physics)',
      points: [
        'At temperature $T$, the population ratio of two states with free-energy difference $\\Delta G$ is $e^{-\\Delta G/RT}$.',
        '$RT \\approx 0.593$ kcal/mol at 298 K.',
        'A factor of 10 in population corresponds to $RT\\ln 10 \\approx 1.36$ kcal/mol.',
      ],
      link: 'physics/boltzmann-distribution',
    },
    {
      kind: 'explain',
      title: 'Affinity as free energy',
      body: String.raw`Binding is a two-state equilibrium (bound vs unbound), so the standard binding free energy is

$$\Delta G^\circ_{bind} = RT \ln\!\frac{K_d}{c^\circ}, \quad c^\circ = 1\text{ M}.$$

At 298 K, **each 10-fold improvement in $K_d$ is worth about 1.36 kcal/mol**. A 1 nM binder has $\Delta G \approx 0.593 \times \ln(10^{-9}) \approx -12.3$ kcal/mol. This is the number that physics-based methods (docking scores, free-energy perturbation) try to predict — and an error of 1.4 kcal/mol already means a 10× error in $K_d$.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Using $\Delta G = RT\ln K_d$ with $RT = 0.593$ kcal/mol, what is $\Delta G$ (kcal/mol) for $K_d = 1\ \mu$M ($10^{-6}$ M)?`,
      answer: -8.19,
      tolerance: 0.1,
      unit: 'kcal/mol',
      why: String.raw`$\ln(10^{-6}) = -13.8$, and $0.593\times(-13.8)\approx -8.2$ kcal/mol. Compared with the 1 nM binder (−12.3), 1000× weaker binding costs about $3\times1.36 \approx 4.1$ kcal/mol.`,
    },
    {
      kind: 'explain',
      title: 'IC50 and EC50: functional potencies',
      body: String.raw`Often we don't measure binding directly but an **effect**: % enzyme activity, a cell signal. Plotting effect vs log concentration gives a sigmoidal **concentration–response** curve, usually fitted by the **Hill equation** (four-parameter logistic):

$$y = \text{bottom} + \frac{\text{top}-\text{bottom}}{1 + ([I]/IC_{50})^{h}}$$

- **IC50**: concentration giving 50 % inhibition; **EC50**: 50 % of maximal activation.
- **Hill slope $h$**: steepness. $h \approx 1$ for simple 1:1 binding; very steep curves ($h \gg 1$) can flag artefacts like aggregation.
- Potencies are usually reported as **pIC50** $= -\log_{10}(IC_{50}/\text{M})$: 1 µM → 6, 10 nM → 8.`,
    },
    {
      kind: 'widget',
      title: 'Explore the Hill equation',
      body: 'Change pIC50 and the Hill slope. The dashed purple curve is a 1 µM reference compound — which one is more potent?',
      widget: { type: 'DrugDoseResponse', props: { compare: true, pIC50: 7.5, hill: 1 }, caption: 'Each unit of pIC50 is a 10-fold shift left. With h = 1, going from 10 % to 90 % effect spans ~1.9 log units (81-fold).' },
    },
    {
      kind: 'mcq',
      prompt: 'Compound A has pIC50 = 8.0, compound B has IC50 = 50 nM. Which is more potent?',
      choices: ['A (IC50 = 10 nM)', 'B', 'They are equal', 'Cannot compare IC50 with pIC50'],
      answer: 0,
      why: 'pIC50 = 8 means IC50 = 10⁻⁸ M = 10 nM, which is lower than 50 nM — so A is 5× more potent. Remember: **higher pIC50 = more potent**, but **lower IC50 = more potent**.',
    },
    {
      kind: 'explain',
      title: 'IC50 is not Ki: Cheng–Prusoff',
      body: String.raw`An IC50 depends on the **assay conditions**. For a *competitive* enzyme inhibitor, substrate $S$ competes for the same site, so more substrate means you need more inhibitor. Cheng & Prusoff (1973) derived

$$K_i = \frac{IC_{50}}{1 + [S]/K_m}$$

where $K_m$ is the Michaelis constant of the substrate and $K_i$ is the inhibitor's true dissociation constant. Example: IC50 = 100 nM measured at $[S] = 3K_m$ gives $K_i = 100/4 = 25$ nM.

Caveats: it assumes competitive, rapidly reversible inhibition and that the inhibitor isn't depleted by binding (**tight binding**: if $K_i$ is near the enzyme concentration, the IC50 can't go below ~half the enzyme concentration).`,
      widget: { type: 'DrugDoseResponse', props: { showKi: true, pIC50: 7 }, caption: 'Raise [S]/Km: the measured IC50 stays fixed while the inferred Ki (green) moves further below it.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A competitive inhibitor has IC50 = 600 nM, measured at $[S] = 5K_m$. What is its $K_i$ in nM?`,
      answer: 100,
      tolerance: 1,
      unit: 'nM',
      why: String.raw`$K_i = 600/(1+5) = 100$ nM. Forgetting the correction would overstate the $K_i$ six-fold — a real problem when models are trained on IC50s from assays run at different substrate levels.`,
    },
    {
      kind: 'recall',
      title: 'Enzymes & Michaelis–Menten (from Biology)',
      points: [
        'Enzymes bind substrate at an active site and lower the activation barrier.',
        'Rate $v = V_{max}[S]/(K_m + [S])$; $K_m$ is the substrate concentration giving half-maximal rate.',
        'Competitive inhibitors bind the active site and raise the apparent $K_m$.',
      ],
      link: 'bio/enzymes',
    },
    {
      kind: 'explain',
      title: 'Kinetics matter too: residence time',
      body: String.raw`Two drugs with the same $K_d$ can behave differently: $K_d = k_{off}/k_{on}$, so one may bind fast and leave fast, the other bind slowly and stay for hours. The **residence time** $\tau = 1/k_{off}$ can determine how long the effect lasts in the body, where drug concentrations rise and fall (Copeland, Pompliano & Meek 2006). Covalent and slow-off-rate inhibitors exploit this.

Measured by surface plasmon resonance (SPR), which tracks binding in real time — see [SPR](@chem/spr).`,
    },
    {
      kind: 'match',
      prompt: 'Match the quantity to its definition.',
      pairs: [
        ['$K_d$', 'Free ligand concentration giving 50 % occupancy at equilibrium'],
        ['$K_i$', 'Dissociation constant of an inhibitor, independent of substrate level'],
        ['IC50', 'Concentration giving 50 % inhibition under specific assay conditions'],
        ['EC50', 'Concentration giving 50 % of the maximal activating effect'],
        ['Residence time', '$1/k_{off}$ — mean lifetime of the bound complex'],
      ],
      why: '$K_d$ and $K_i$ are thermodynamic constants of the molecule–target pair; IC50 and EC50 are assay-dependent functional readouts. Residence time is kinetic, not thermodynamic.',
    },
    {
      kind: 'truefalse',
      prompt: 'IC50 values for the same compound and target measured in different labs can be averaged as if they were the same quantity.',
      answer: false,
      why: 'IC50 depends on substrate concentration, enzyme concentration, incubation time and readout. Mixing IC50s from different assays adds substantial noise (Kalliokoski et al. 2013) — a key data-curation issue for ML on ChEMBL.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $K_d = k_{off}/k_{on}$: the concentration for 50 % occupancy; occupancy $\theta = [L]/([L]+K_d)$.
- $\Delta G = RT\ln K_d$; **10× in affinity ≈ 1.36 kcal/mol** at room temperature; 1 nM ≈ −12.3 kcal/mol.
- IC50/EC50 come from Hill-equation fits; report as **pIC50**; $h \approx 1$ expected for simple binding.
- **Cheng–Prusoff**: $K_i = IC_{50}/(1+[S]/K_m)$ for competitive inhibitors — IC50s are assay-dependent.
- Kinetics (**residence time**) can matter as much as affinity.`,
    },
  ],
  references: [
    { authors: 'Copeland, R. A.', title: 'Evaluation of Enzyme Inhibitors in Drug Discovery', year: 2013, venue: '2nd ed., Wiley', detail: 'Ch. 2–5' },
    { authors: 'Cheng, Y., Prusoff, W. H.', title: 'Relationship between the inhibition constant (KI) and the concentration of inhibitor which causes 50 per cent inhibition (I50) of an enzymatic reaction', year: 1973, venue: 'Biochem. Pharmacol. 22, 3099–3108' },
    { authors: 'Copeland, R. A., Pompliano, D. L., Meek, T. D.', title: 'Drug–target residence time and its implications for lead optimization', year: 2006, venue: 'Nat. Rev. Drug Discov. 5, 730–739' },
    { authors: 'Kalliokoski, T., Kramer, C., Vulpetti, A., Gedeck, P.', title: 'Comparability of mixed IC50 data – a statistical analysis', year: 2013, venue: 'PLoS ONE 8, e61007' },
  ],
} satisfies LessonContent;
