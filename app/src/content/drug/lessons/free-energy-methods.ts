import type { LessonContent } from '../../types';

const cycleSvg = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="fa" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="var(--fg)"/></marker></defs>
<g font-size="9.5" text-anchor="middle">
<rect x="14" y="20" width="96" height="40" rx="8" fill="var(--c2)" fill-opacity="0.15" stroke="var(--c2)"/>
<text x="62" y="37" fill="var(--fg)" font-weight="700">P + A</text><text x="62" y="51" fill="var(--muted)">(in water)</text>
<rect x="210" y="20" width="96" height="40" rx="8" fill="var(--c2)" fill-opacity="0.15" stroke="var(--c2)"/>
<text x="258" y="37" fill="var(--fg)" font-weight="700">P·A</text><text x="258" y="51" fill="var(--muted)">(complex)</text>
<rect x="14" y="128" width="96" height="40" rx="8" fill="var(--c3)" fill-opacity="0.15" stroke="var(--c3)"/>
<text x="62" y="145" fill="var(--fg)" font-weight="700">P + B</text><text x="62" y="159" fill="var(--muted)">(in water)</text>
<rect x="210" y="128" width="96" height="40" rx="8" fill="var(--c3)" fill-opacity="0.15" stroke="var(--c3)"/>
<text x="258" y="145" fill="var(--fg)" font-weight="700">P·B</text><text x="258" y="159" fill="var(--muted)">(complex)</text>
<line x1="112" y1="40" x2="206" y2="40" stroke="var(--fg)" stroke-width="1.5" marker-end="url(#fa)"/>
<text x="160" y="33" fill="var(--fg)">ΔG_bind(A)</text><text x="160" y="54" fill="var(--muted)">real, slow</text>
<line x1="112" y1="148" x2="206" y2="148" stroke="var(--fg)" stroke-width="1.5" marker-end="url(#fa)"/>
<text x="160" y="141" fill="var(--fg)">ΔG_bind(B)</text><text x="160" y="162" fill="var(--muted)">real, slow</text>
<line x1="62" y1="62" x2="62" y2="124" stroke="var(--c5)" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#fa)"><animate attributeName="stroke-dashoffset" values="20;0" dur="1s" repeatCount="indefinite"/></line>
<text x="98" y="90" fill="var(--c5)" font-weight="700">ΔG_solv</text><text x="98" y="102" fill="var(--c5)">A→B</text>
<line x1="258" y1="62" x2="258" y2="124" stroke="var(--c5)" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#fa)"><animate attributeName="stroke-dashoffset" values="20;0" dur="1s" repeatCount="indefinite"/></line>
<text x="222" y="90" fill="var(--c5)" font-weight="700">ΔG_cplx</text><text x="222" y="102" fill="var(--c5)">A→B</text>
<text x="160" y="186" fill="var(--fg)" font-weight="700">ΔΔG_bind = ΔG_bind(B) − ΔG_bind(A) = ΔG_cplx − ΔG_solv</text>
<text x="160" y="12" fill="var(--muted)">red dashed = alchemical (unphysical) mutations we actually simulate</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'From "probably binds" to "binds 5× better"',
      body: String.raw`In lead optimisation the question is not "does it bind?" but "will this methyl-to-chlorine swap improve potency?". The differences that matter are 0.5–2 kcal/mol, far below the error of [docking scores](@drug/scoring-functions).

**Alchemical free-energy methods** answer such questions with statistical mechanics. They run [molecular dynamics](@drug/molecular-dynamics) with an accurate force field and compute free-energy differences that are exact apart from force-field error and incomplete sampling. The price is roughly GPU-hours per compound, instead of seconds.`,
    },
    {
      kind: 'recall',
      title: 'Free energy and partition functions (from Physics)',
      points: [
        String.raw`The partition function $Z = \int e^{-U(\mathbf x)/k_BT}\,d\mathbf x$ sums Boltzmann weights over all configurations.`,
        String.raw`Free energy $F = -k_BT\ln Z$, so $\Delta F_{A\to B} = -k_BT\ln(Z_B/Z_A)$.`,
        'Free energy is a **state function**: its change does not depend on the path taken.',
        String.raw`$F = U - TS$ includes entropy, so it captures flexibility and solvent effects.`,
      ],
      link: 'physics/statistical-entropy',
    },
    {
      kind: 'explain',
      title: 'The thermodynamic cycle trick',
      body: String.raw`Simulating a ligand actually binding and unbinding takes microseconds to hours of simulated time, which is usually too slow. But free energy is a state function, so we can go the other way round the cycle.

Instead of binding A and B, we **mutate A into B** twice: once inside the protein ($\Delta G_{cplx}$) and once in water ($\Delta G_{solv}$). The atoms that differ are gradually switched off and on, which is physically impossible ("alchemical") but perfectly valid mathematically. Going around the closed cycle gives

$$\Delta\Delta G_{bind} = \Delta G_{bind}(B) - \Delta G_{bind}(A) = \Delta G_{cplx} - \Delta G_{solv}.$$`,
      widget: { type: 'SvgDiagram', props: { svg: cycleSvg }, caption: 'The four corners form a closed loop, so the sum of free-energy changes around it is zero.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Mutating ligand A into B gives $\Delta G_{cplx} = -3.2$ kcal/mol in the protein and $\Delta G_{solv} = -1.5$ kcal/mol in water. What is $\Delta\Delta G_{bind}$ (B relative to A)?`,
      answer: -1.7,
      tolerance: 0.05,
      unit: 'kcal/mol',
      why: String.raw`$\Delta\Delta G = -3.2 - (-1.5) = -1.7$ kcal/mol, so B binds more tightly by a factor of $e^{1.7/0.593}\approx 18$. Adding the two legs instead of subtracting them is the most common error.`,
    },
    {
      kind: 'explain',
      title: 'The Zwanzig equation',
      body: String.raw`How do we compute one leg? Zwanzig (1954) showed that the free-energy difference between states A and B can be computed from samples of A alone:

$$\Delta F_{A\to B} = -k_BT\ln\left\langle e^{-(U_B - U_A)/k_BT}\right\rangle_A$$

Run MD in state A. For each snapshot, evaluate the energy difference $\Delta U = U_B - U_A$ (the energy the same coordinates would have in B), and take the exponential average. This is **free-energy perturbation (FEP)**. The formula is *exact*, but the next widget shows its practical problem.`,
    },
    {
      kind: 'widget',
      title: 'Derive it in four lines',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Start from $\Delta F = -k_BT\ln\dfrac{Z_B}{Z_A}$ with $Z_X = \int e^{-\beta U_X}d\mathbf x$, $\beta = 1/k_BT$.`,
            String.raw`Multiply inside the integral by $1 = e^{-\beta U_A}e^{+\beta U_A}$: $\;Z_B = \int e^{-\beta(U_B-U_A)}\,e^{-\beta U_A}\,d\mathbf x$.`,
            String.raw`Divide by $Z_A$: $\;\dfrac{Z_B}{Z_A} = \int e^{-\beta\Delta U}\,\underbrace{\frac{e^{-\beta U_A}}{Z_A}}_{p_A(\mathbf x)}\,d\mathbf x = \langle e^{-\beta\Delta U}\rangle_A$.`,
            String.raw`So $\Delta F = -k_BT\ln\langle e^{-\beta\Delta U}\rangle_A$. No approximation was made.`,
          ],
          notes: ['', 'A trick: multiply by one.', String.raw`$p_A$ is the Boltzmann probability in state A, which MD samples.`, 'Exact, but only useful if A samples the configurations that matter for B.'],
        },
      },
    },
    {
      kind: 'widget',
      title: 'Why exponential averages converge slowly',
      body: String.raw`The average of $e^{-\Delta U}$ is dominated by **rare samples with low $\Delta U$** (orange curve), not by typical ones (blue). If the two distributions barely overlap, the estimate stays too high until a lucky tail sample appears. Raise σ and watch convergence collapse.`,
      widget: { type: 'DrugZwanzigAverage', props: { mu: 3, sigma: 1.5 }, caption: String.raw`Energies in $k_BT$. For Gaussian $\Delta U$ the exact answer is $\mu - \sigma^2/2$. With σ ≲ 1 a few samples suffice; with σ ≈ 3 even thousands are not enough.` },
    },
    {
      kind: 'mcq',
      prompt: 'Why do FEP calculations split a big mutation into many small λ-windows instead of jumping straight from A to B?',
      choices: [
        'So that neighbouring states overlap and each exponential average converges',
        'Because the Zwanzig equation is only an approximation for large changes',
        'To make the simulation run faster per step',
        'Because state B cannot be simulated directly',
      ],
      answer: 0,
      why: String.raw`The Zwanzig equation is exact for any change, but for a large change the important configurations of B are almost never seen in A, so the average converges extremely slowly. Small steps keep $\Delta U$ narrow ($\sigma$ small) between neighbours, and the step free energies simply add up.`,
    },
    {
      kind: 'explain',
      title: 'λ, TI, BAR and MBAR',
      body: String.raw`Define a hybrid energy $U(\lambda) = (1-\lambda)U_A + \lambda U_B$ (in practice with **soft-core** potentials, so atoms that appear or vanish don't blow up), and simulate at, say, 12 values of $\lambda$ from 0 to 1.
- **FEP**: apply Zwanzig between neighbouring windows and sum.
- **Thermodynamic integration (TI)**: $\Delta F = \int_0^1 \langle \partial U/\partial\lambda\rangle_\lambda\,d\lambda$, integrated numerically.
- **BAR** (Bennett 1976): uses forward *and* reverse samples between two states; it is the minimum-variance estimator for that pair.
- **MBAR** (Shirts & Chodera 2008): uses all samples from all windows at once. It is today's standard analysis.`,
    },
    {
      kind: 'match',
      prompt: 'Match each estimator to its description.',
      pairs: [
        ['Zwanzig / FEP', 'Exponential average of ΔU from one state'],
        ['Thermodynamic integration', 'Integrate ⟨∂U/∂λ⟩ over λ'],
        ['BAR', 'Optimal combination of forward and reverse samples for two states'],
        ['MBAR', 'Jointly reweights samples from all λ-states'],
      ],
      why: 'All four estimate the same free-energy difference. They differ in how efficiently they use the data. BAR and MBAR are usually the most statistically efficient, which is why modern pipelines use MBAR.',
    },
    {
      kind: 'explain',
      title: 'Relative vs absolute, and FEP+ in practice',
      body: String.raw`**Relative** binding free energies (RBFE) mutate one ligand into a close analogue. Errors partly cancel, so this is the workhorse for lead optimisation. **Absolute** binding free energies (ABFE) decouple the whole ligand from protein and from water, using restraints. ABFE allows unrelated ligands to be compared but is costlier and noisier.

Wang et al. (2015) combined the OPLS2.1 force field, REST2 enhanced sampling, GPU MD and cycle-closure checks into **FEP+**. On a benchmark of 8 targets and about 200 ligands, errors were about 1 kcal/mol, and the method held up in prospective projects. An accuracy of about **1 kcal/mol RMSE** on benchmark sets is still the usual level for good RBFE workflows.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`An RBFE method has an error of 1.0 kcal/mol. At 298 K ($RT = 0.593$ kcal/mol), what fold-error in $K_d$ does that correspond to?`,
      answer: 5.4,
      tolerance: 0.2,
      unit: '×',
      why: String.raw`Fold-change $= e^{\Delta\Delta G/RT} = e^{1.0/0.593} = e^{1.69}\approx 5.4$. That sounds large, but it is good enough to rank ideas that differ 10–100-fold, and much better than docking scores.`,
    },
    {
      kind: 'multi',
      prompt: 'Which are real sources of error in FEP binding predictions?',
      choices: [
        'Force-field inaccuracies (torsions, charges)',
        'Slow protein or water rearrangements not sampled within the simulation',
        'Wrong protonation or tautomer state of the ligand or residues',
        'The Zwanzig equation being only a first-order approximation',
        'Perturbations that change the net charge or the core scaffold',
      ],
      answers: [0, 1, 2, 4],
      why: 'The estimators are exact in the limit of infinite sampling. Errors come from the model (force field, protonation states) and from finite sampling, which is worst for slow conformational changes and for large or charge-changing perturbations.',
    },
    {
      kind: 'order',
      prompt: 'Order the steps of a relative binding free-energy study.',
      steps: [
        'Choose a reference structure and build a perturbation map linking the ligands',
        'Set up λ-windows for each A→B edge, in complex and in solvent',
        'Run MD at every λ-window',
        'Estimate each leg with MBAR and form ΔΔG = ΔG_cplx − ΔG_solv',
        'Check cycle closure and compare with known experimental values',
      ],
      why: 'Preparation and the perturbation map come first. Simulation and MBAR analysis give each edge, and closed cycles in the map (which should sum to zero) plus known reference compounds catch problems before the predictions are used.',
    },
    {
      kind: 'truefalse',
      prompt: 'The intermediate λ-states in an alchemical calculation need not correspond to any physically real molecule.',
      answer: true,
      why: 'Free energy is a state function, so only the end states have to be physical. Half-vanished atoms at λ = 0.5 are mathematical devices, and that freedom is what makes alchemical methods so efficient.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Thermodynamic cycle: $\Delta\Delta G_{bind} = \Delta G_{cplx} - \Delta G_{solv}$ via unphysical **alchemical** mutations.
- **Zwanzig**: $\Delta F = -k_BT\ln\langle e^{-\Delta U/k_BT}\rangle_A$. It is exact but needs **overlap**, hence λ-windows.
- Estimators: FEP, TI, **BAR** (two states, optimal) and **MBAR** (all states).
- **RBFE** for close analogues; **ABFE** for unrelated ligands.
- **FEP+** (Wang 2015) and similar workflows reach about **1 kcal/mol** error, roughly 5× in $K_d$.
- Remaining errors come from the force field, protonation states and sampling. Cheaper approximations follow in [end-point methods](@drug/end-point-methods).`,
    },
  ],
  references: [
    { authors: 'Zwanzig, R. W.', title: 'High-temperature equation of state by a perturbation method. I. Nonpolar gases', year: 1954, venue: 'J. Chem. Phys. 22, 1420–1426' },
    { authors: 'Bennett, C. H.', title: 'Efficient estimation of free energy differences from Monte Carlo data', year: 1976, venue: 'J. Comput. Phys. 22, 245–268' },
    { authors: 'Shirts, M. R., Chodera, J. D.', title: 'Statistically optimal analysis of samples from multiple equilibrium states', year: 2008, venue: 'J. Chem. Phys. 129, 124105' },
    { authors: 'Wang, L., Wu, Y., Deng, Y., et al.', title: 'Accurate and reliable prediction of relative ligand binding potency in prospective drug discovery by way of a modern free-energy calculation protocol and force field', year: 2015, venue: 'J. Am. Chem. Soc. 137, 2695–2703' },
    { authors: 'Chodera, J. D., Mobley, D. L., Shirts, M. R., et al.', title: 'Alchemical free energy methods for drug discovery: progress and challenges', year: 2011, venue: 'Curr. Opin. Struct. Biol. 21, 150–160' },
  ],
} satisfies LessonContent;
