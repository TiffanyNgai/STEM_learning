import type { LessonContent } from '../../types';

/** Two-step covalent inhibition: reversible encounter complex, then bond formation. */
const covalentSvg = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
<g font-size="10" text-anchor="middle" fill="var(--fg)">
<text x="160" y="14" font-weight="700">Two-step covalent inhibition</text>
<rect x="12" y="44" width="62" height="34" rx="8" fill="var(--c2)" fill-opacity="0.2" stroke="var(--c2)"/>
<text x="43" y="65">E + I</text>
<rect x="128" y="44" width="62" height="34" rx="8" fill="var(--c6)" fill-opacity="0.2" stroke="var(--c6)"/>
<text x="159" y="65">E·I</text>
<rect x="244" y="44" width="66" height="34" rx="8" fill="var(--c5)" fill-opacity="0.2" stroke="var(--c5)"/>
<text x="277" y="65">E–I</text>
<path d="M78 56 H124" stroke="var(--fg)" stroke-width="1.4"/><path d="M124 56 l-6 -3 v6 z" fill="var(--fg)"/>
<path d="M124 68 H78" stroke="var(--fg)" stroke-width="1.4"/><path d="M78 68 l6 -3 v6 z" fill="var(--fg)"/>
<text x="101" y="40" font-size="9" fill="var(--muted)">reversible, K_I</text>
<path d="M194 61 H240" stroke="var(--c5)" stroke-width="2"/><path d="M240 61 l-7 -3.5 v7 z" fill="var(--c5)"/>
<text x="217" y="40" font-size="9" fill="var(--c5)">k_inact</text>
<text x="43" y="98" font-size="9" fill="var(--muted)">encounter</text>
<text x="159" y="98" font-size="9" fill="var(--muted)">non-covalent complex</text>
<text x="277" y="98" font-size="9" fill="var(--muted)">covalent bond</text>
<circle cx="78" cy="62" r="4" fill="var(--c5)"><animate attributeName="cx" values="78;124;159;240;277" keyTimes="0;0.25;0.45;0.7;1" dur="4s" repeatCount="indefinite"/></circle>
<text x="160" y="130" font-size="9" fill="var(--fg)">Efficiency metric: k_inact / K_I (M⁻¹ s⁻¹), not a single IC50</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Same IC50, different drug',
      body: String.raw`Two enzyme inhibitors can share an IC50 of 50 nM in the screening assay and yet behave completely differently in a cell — one loses 100-fold potency, the other gains it. The difference is **how** they inhibit: *where* they bind on the enzyme's catalytic cycle, and *how long* they stay.

This lesson is the kinetic sequel to [Binding affinity](@drug/binding-affinity). There you met $K_i$, IC50 and the Cheng–Prusoff correction for **competitive** inhibitors. Here we meet the other modes, how to tell them apart, and why tight-binding, covalent and slowly dissociating inhibitors break the simple equations.`,
    },
    {
      kind: 'recall',
      title: 'Recall: Michaelis–Menten kinetics',
      points: [
        'Mechanism: $E + S \\rightleftharpoons ES \\rightarrow E + P$.',
        'Initial rate $v = V_{max}[S]/(K_m + [S])$.',
        '$K_m$ is the substrate concentration giving $v = V_{max}/2$; $V_{max} = k_{cat}[E]_T$.',
        'At $[S] \\gg K_m$ the enzyme is saturated and $v \\to V_{max}$.',
      ],
      link: 'bio/enzymes',
    },
    {
      kind: 'explain',
      title: 'Where can an inhibitor bind?',
      body: String.raw`A reversible inhibitor $I$ can bind the **free enzyme** $E$ (dissociation constant $K_i$), the **enzyme–substrate complex** $ES$ (constant $\alpha K_i$), or both. The general (**mixed**) rate law is

$$v = \frac{V_{max}[S]}{K_m\left(1+\frac{[I]}{K_i}\right) + [S]\left(1+\frac{[I]}{\alpha K_i}\right)}$$

- **Competitive** ($\alpha \to \infty$): binds only $E$, usually the active site. Apparent $K_m$ rises; $V_{max}$ unchanged — enough substrate outcompetes it.
- **Uncompetitive** ($\alpha K_i$ finite, no binding to $E$): binds only $ES$. Both apparent $V_{max}$ and $K_m$ fall by the same factor.
- **Noncompetitive** ($\alpha = 1$): binds $E$ and $ES$ equally. $V_{max}$ falls; $K_m$ unchanged.`,
    },
    {
      kind: 'widget',
      title: 'Rate vs substrate for each mode',
      body: String.raw`Here $V_{max} = 1$, $K_m = 1$ and the slider sets $[I]/K_i$ (with $\alpha K_i = K_i$ wherever the inhibitor binds). Drag it up. Watch which curves still reach the top at high $[S]$, and which are squashed at every substrate level.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['x/(1+x)', 'x/(1+i+x)', 'x/(1+x*(1+i))', 'x/((1+i)*(1+x))'],
          x: [0, 20], y: [0, 1.05],
          params: [{ name: 'i', min: 0, max: 5, value: 2, label: '[I]/Ki' }],
          labels: ['no inhibitor', 'competitive', 'uncompetitive', 'noncompetitive'],
          xLabel: '[S] / Km', yLabel: 'v / Vmax',
        },
        caption: 'Competitive: the curve creeps back towards 1 as [S] grows. Noncompetitive: the plateau drops to 1/(1+[I]/Ki). Uncompetitive: the plateau drops too, but at low [S] the curve still tracks the uninhibited one (Vmax/Km unchanged), so it reaches its lower plateau sooner (smaller apparent Km).',
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Adding a fixed inhibitor concentration raises the apparent $K_m$ three-fold but leaves $V_{max}$ unchanged. Which mode is this?`,
      choices: ['Competitive', 'Uncompetitive', 'Noncompetitive', 'Irreversible covalent'],
      answer: 0,
      why: String.raw`Only a competitive inhibitor can be fully overcome by saturating substrate, so $V_{max}$ is preserved while more substrate is needed to reach half-rate. Uncompetitive lowers both; noncompetitive lowers $V_{max}$ only; an irreversible inactivator removes active enzyme and so lowers $V_{max}$.`,
    },
    {
      kind: 'explain',
      title: 'The Lineweaver–Burk plot',
      body: String.raw`Lineweaver & Burk (1934) took reciprocals of the Michaelis–Menten equation to get a straight line:

$$\frac{1}{v} = \frac{K_m^{app}}{V_{max}^{app}}\cdot\frac{1}{[S]} + \frac{1}{V_{max}^{app}}$$

Slope $= K_m/V_{max}$, $y$-intercept $= 1/V_{max}$, $x$-intercept $= -1/K_m$. Measuring at several inhibitor concentrations gives a family of lines whose **intersection pattern** reveals the mode.

> The double-reciprocal plot is a *diagnostic picture*, not a fitting method: taking $1/v$ hugely magnifies the error of the slowest (low-$[S]$) points. Fit the untransformed rates by non-linear regression, as Copeland recommends.`,
    },
    {
      kind: 'widget',
      title: 'Fingerprints in double-reciprocal space',
      body: 'Same enzyme ($K_m = V_{max} = 1$). Slide $[I]/K_i$ and watch where each inhibited line meets the uninhibited one.',
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['1+x', '(1+i)*x+1', 'x+1+i', '(1+i)*(x+1)'],
          x: [-1.5, 3], y: [-1, 8],
          params: [{ name: 'i', min: 0, max: 3, value: 1, label: '[I]/Ki' }],
          labels: ['no inhibitor', 'competitive', 'uncompetitive', 'noncompetitive'],
          xLabel: '1/[S]', yLabel: '1/v',
        },
        caption: 'Competitive lines cross on the y-axis (same Vmax). Uncompetitive lines are parallel (same slope Km/Vmax). Noncompetitive lines cross on the x-axis at −1/Km (same Km). Mixed inhibitors cross to the left of the y-axis, off the x-axis.',
      },
    },
    {
      kind: 'match',
      prompt: 'Match the inhibition mode to its Lineweaver–Burk signature.',
      pairs: [
        ['Competitive', 'Lines intersect on the 1/v axis'],
        ['Uncompetitive', 'Parallel lines'],
        ['Noncompetitive (α = 1)', 'Lines intersect on the 1/[S] axis'],
        ['Mixed (α ≠ 1)', 'Lines intersect left of the 1/v axis, above or below the 1/[S] axis'],
      ],
      why: String.raw`The intersection shows what the inhibitor leaves unchanged: a shared $y$-intercept means unchanged $V_{max}$ (competitive), a shared $x$-intercept means unchanged $K_m$ (noncompetitive), equal slopes mean unchanged $K_m/V_{max}$ (uncompetitive). Mixed inhibitors change everything, so the crossing point floats.`,
    },
    {
      kind: 'explain',
      title: 'IC50 depends on the mode — and on [S]',
      body: String.raw`Setting $v$ to half its uninhibited value in the rate law gives the IC50 for each mode:

- Competitive: $IC_{50} = K_i\,(1 + [S]/K_m)$ — Cheng–Prusoff; rises with substrate.
- Noncompetitive: $IC_{50} = K_i$ — independent of $[S]$.
- Uncompetitive: $IC_{50} = \alpha K_i\,(1 + K_m/[S])$ — **falls** as substrate rises.

This matters when moving into cells. Most kinase inhibitors are **ATP-competitive**, and biochemical kinase assays are often run near the ATP $K_m$ (tens of µM), while cells contain millimolar ATP. A competitive inhibitor therefore looks weaker in cells; an uncompetitive one would look stronger.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`An ATP-competitive kinase inhibitor has $K_i = 2$ nM. In a cell, $[\mathrm{ATP}] = 100\,K_m$. Ignoring permeability and everything else, what IC50 (nM) do you expect in the cell?`,
      answer: 202,
      tolerance: 2,
      unit: 'nM',
      why: String.raw`$IC_{50} = K_i(1+[S]/K_m) = 2 \times (1 + 100) = 202$ nM. In a biochemical assay run at $[S] = K_m$ the same compound shows IC50 = 4 nM, so this alone produces a ~50-fold drop between enzyme and cell. Answering 200 means you dropped the "1 +".`,
    },
    {
      kind: 'explain',
      title: 'Tight binding: when the inhibitor runs out',
      body: String.raw`All the equations above assume the **free** inhibitor concentration equals what you added. That fails when $K_i$ is not much larger than the enzyme concentration $[E]_T$: a significant fraction of the inhibitor is stuck on enzyme. The curve must then be fitted with the quadratic **Morrison equation** (Morrison 1969):

$$\frac{v}{v_0} = 1 - \frac{([E]_T + [I] + K_i^{app}) - \sqrt{([E]_T + [I] + K_i^{app})^2 - 4[E]_T[I]}}{2[E]_T}$$

A useful consequence: $IC_{50} = K_i^{app} + [E]_T/2$. An IC50 can never fall below half the enzyme concentration. If every compound in a series bottoms out near the same IC50, you may be **titrating the enzyme**, not measuring affinity.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['1-(et+x+1-sqrt((et+x+1)^2-4*et*x))/(2*et)', '1/(1+x)'],
          x: [0, 40], y: [0, 1.05],
          params: [{ name: 'et', min: 0.1, max: 40, value: 10, label: '[E]T (nM)' }],
          labels: ['Morrison, Ki,app = 1 nM', 'naive 1/(1+[I]/Ki)'],
          xLabel: '[I] added (nM)', yLabel: 'v / v0',
        },
        caption: 'At [E]T = 0.1 nM the two curves coincide. Raise [E]T and the true curve becomes a near-linear titration: the IC50 tracks [E]T/2, not Ki.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A picomolar inhibitor ($K_i^{app} = 0.1$ nM) is tested in an assay containing 20 nM enzyme. What IC50 (nM) will you measure?`,
      answer: 10.1,
      tolerance: 0.2,
      unit: 'nM',
      why: String.raw`$IC_{50} = K_i^{app} + [E]_T/2 = 0.1 + 10 = 10.1$ nM. The assay reports a value 100-fold weaker than the true affinity. That is why tight binders are characterised at the lowest enzyme concentration the readout allows.`,
    },
    {
      kind: 'widget',
      title: 'Covalent and slow-binding inhibitors',
      body: String.raw`Many inhibitors bind in **two steps**: a fast reversible complex $E\cdot I$ (constant $K_I$), then a slower step — a conformational change (*slow-binding*) or formation of a **covalent bond** (rate constant $k_{inact}$). Inhibition then grows with incubation time, so the IC50 depends on when you read the plate.

For irreversible covalent drugs, the meaningful potency is $k_{inact}/K_I$. Examples: aspirin acetylates a serine in cyclo-oxygenase; ibrutinib (BTK) and osimertinib (EGFR) bond to a cysteine near the ATP pocket. Modelling the chemistry: [QM/MM & covalent drugs](@drug/qm-mm).`,
      widget: { type: 'SvgDiagram', props: { svg: covalentSvg }, caption: 'Weak initial recognition (large K_I) can be offset by fast bond formation; selectivity comes from both steps.' },
    },
    {
      kind: 'truefalse',
      prompt: 'For an irreversible covalent inhibitor, a single IC50 measured after a 30-minute pre-incubation is a sufficient, assay-independent measure of potency.',
      answer: false,
      why: String.raw`For an irreversible inhibitor, inhibition keeps increasing with time, so the IC50 keeps falling the longer you pre-incubate. A 30-minute and a 3-hour IC50 differ for the same molecule. The time-independent parameters are $K_I$ and $k_{inact}$, usually reported as $k_{inact}/K_I$.`,
    },
    {
      kind: 'explain',
      title: 'Residence time in an open system',
      body: String.raw`In a test tube, drug and target sit at equilibrium. In the body the system is **open**: drug concentration rises after a dose and is then cleared. If the drug leaves its target more slowly than it leaves the plasma, the target stays inhibited after free drug has largely gone (Copeland, Pompliano & Meek 2006).

Residence time $\tau = 1/k_{off}$; the bound complex's half-life is $t_{1/2} = \ln 2/k_{off}$. Example: $k_{off} = 10^{-4}\,\mathrm{s^{-1}}$ gives $\tau = 10^4$ s ≈ 2.8 h.

Slow dissociation can also create **kinetic selectivity**. The bronchodilator tiotropium has similar affinity for M2 and M3 muscarinic receptors but leaves M3 much more slowly — and M3 is the receptor it is meant to block.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`An inhibitor has $k_{off} = 2\times10^{-4}\ \mathrm{s^{-1}}$. What is its residence time $\tau$ in **minutes**?`,
      answer: 83.3,
      tolerance: 0.5,
      unit: 'min',
      why: String.raw`$\tau = 1/k_{off} = 5000$ s $= 83.3$ min. The half-life of the complex is shorter, $\ln 2 \times 5000 \approx 3466$ s ≈ 58 min. Don't confuse the mean lifetime with the half-life.`,
    },
    {
      kind: 'fill',
      prompt: 'An inhibitor whose IC50 rises with substrate concentration is ___; one whose IC50 is unaffected by substrate is ___; if the IC50 equals half the enzyme concentration, suspect ___ binding.',
      bank: ['competitive', 'noncompetitive', 'uncompetitive', 'tight', 'weak', 'allosteric'],
      answer: ['competitive', 'noncompetitive', 'tight'],
      why: String.raw`Competitive: $IC_{50} = K_i(1+[S]/K_m)$ grows with $[S]$. Noncompetitive ($\alpha = 1$): $IC_{50} = K_i$ whatever the substrate. An IC50 stuck at $[E]_T/2$ is the tight-binding floor. "Allosteric" describes the site, not the kinetics: allosteric inhibitors can show any of the modes.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Reversible inhibitors bind $E$ ($K_i$), $ES$ ($\alpha K_i$) or both: **competitive**, **uncompetitive**, **noncompetitive**, **mixed**.
- Lineweaver–Burk intersection patterns diagnose the mode; fit untransformed data by non-linear regression.
- IC50 depends on mode and $[S]$: competitive inhibitors weaken at high substrate (ATP in cells), uncompetitive ones strengthen.
- **Tight binding**: $IC_{50} = K_i^{app} + [E]_T/2$; use the Morrison equation.
- **Covalent/slow-binding**: potency is time-dependent; report $k_{inact}/K_I$.
- **Residence time** $1/k_{off}$ can outlast plasma exposure. When training models, check which kind of number a database entry actually is.`,
    },
  ],
  references: [
    { authors: 'Copeland, R. A.', title: 'Evaluation of Enzyme Inhibitors in Drug Discovery: A Guide for Medicinal Chemists and Pharmacologists', year: 2013, venue: '2nd ed., Wiley', detail: 'Ch. 3 (reversible modes of inhibition); later chapters on slow-binding, tight-binding and irreversible inhibitors' },
    { authors: 'Lineweaver, H., Burk, D.', title: 'The determination of enzyme dissociation constants', year: 1934, venue: 'J. Am. Chem. Soc. 56, 658–666' },
    { authors: 'Morrison, J. F.', title: 'Kinetics of the reversible inhibition of enzyme-catalysed reactions by tight-binding inhibitors', year: 1969, venue: 'Biochim. Biophys. Acta 185, 269–286' },
    { authors: 'Copeland, R. A., Pompliano, D. L., Meek, T. D.', title: 'Drug–target residence time and its implications for lead optimization', year: 2006, venue: 'Nat. Rev. Drug Discov. 5, 730–739' },
    { authors: 'Singh, J., Petter, R. C., Baillie, T. A., Whitty, A.', title: 'The resurgence of covalent drugs', year: 2011, venue: 'Nat. Rev. Drug Discov. 10, 307–317' },
  ],
} satisfies LessonContent;
