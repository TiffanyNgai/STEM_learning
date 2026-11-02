import type { LessonContent } from '../../types';

// The journey of a pill, annotated with the discovery assay that probes each step.
const journeySvg = String.raw`<svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg" font-size="9" fill="var(--fg)">
<text x="160" y="12" text-anchor="middle" font-size="10" font-weight="700">Each ADMET letter has its own discovery assay</text>
<rect x="6" y="40" width="62" height="44" rx="8" fill="var(--c3)" fill-opacity="0.18" stroke="var(--c3)"/>
<text x="37" y="57" text-anchor="middle" font-weight="700">A · gut</text><text x="37" y="70" text-anchor="middle" font-size="8">dissolve, cross</text>
<rect x="88" y="40" width="62" height="44" rx="8" fill="var(--c4)" fill-opacity="0.18" stroke="var(--c4)"/>
<text x="119" y="57" text-anchor="middle" font-weight="700">M · liver</text><text x="119" y="70" text-anchor="middle" font-size="8">first pass</text>
<rect x="170" y="40" width="62" height="44" rx="8" fill="var(--c5)" fill-opacity="0.15" stroke="var(--c5)"/>
<text x="201" y="57" text-anchor="middle" font-weight="700">D · blood</text><text x="201" y="70" text-anchor="middle" font-size="8">bound / free</text>
<rect x="252" y="20" width="62" height="34" rx="8" fill="var(--c1)" fill-opacity="0.18" stroke="var(--c1)"/>
<text x="283" y="41" text-anchor="middle" font-weight="700">target</text>
<rect x="252" y="70" width="62" height="34" rx="8" fill="var(--c2)" fill-opacity="0.18" stroke="var(--c2)"/>
<text x="283" y="91" text-anchor="middle" font-weight="700">E · kidney</text>
<g stroke="var(--fg)" stroke-width="1.2" fill="none"><path d="M68,62 H86"/><path d="M150,62 H168"/><path d="M232,56 L250,40"/><path d="M232,70 L250,86"/></g>
<circle r="4" fill="var(--c5)"><animateMotion dur="4s" repeatCount="indefinite" path="M20,62 H119 H201 L283,37"/></circle>
<circle r="4" fill="var(--c4)" opacity="0.8"><animateMotion dur="4s" begin="1.3s" repeatCount="indefinite" path="M20,62 H119 V95"/><animate attributeName="opacity" values="0.8;0.8;0" dur="4s" begin="1.3s" repeatCount="indefinite"/></circle>
<g font-size="8">
<rect x="6" y="114" width="308" height="88" rx="6" fill="var(--surface)" stroke="var(--grid)"/>
<text x="14" y="128" fill="var(--c3)" font-weight="700">A</text><text x="26" y="128">kinetic / thermodynamic solubility · PAMPA · Caco-2 / MDCK</text>
<text x="14" y="143" fill="var(--c1)" font-weight="700">D</text><text x="26" y="143">plasma protein binding (dialysis) · logD · brain Kp,uu</text>
<text x="14" y="158" fill="var(--c4)" font-weight="700">M</text><text x="26" y="158">microsome / hepatocyte stability · CYP inhibition</text>
<text x="14" y="173" fill="var(--c2)" font-weight="700">E</text><text x="26" y="173">transporter assays · in vivo rat PK (urine, bile)</text>
<text x="14" y="188" fill="var(--c5)" font-weight="700">T</text><text x="26" y="188">hERG · Ames · cytotoxicity · off-target safety panel</text>
</g>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Potent, and still a failure',
      body: String.raw`Imagine a molecule that inhibits its target at 1 nM, then vanishes from the blood within minutes of being swallowed. It is a superb **ligand** and a useless **drug**.

In 1991 roughly **40 %** of drugs that failed in clinical trials failed for pharmacokinetic or bioavailability reasons. By 2000 this had dropped to about **10 %** (Kola & Landis 2004), largely because companies began measuring ADME properties *early*, in discovery, alongside potency. Today most failures are about efficacy and **safety** (Waring et al. 2015).

This unit is about those early measurements and the computational models trained on them.`,
    },
    {
      kind: 'recall',
      title: 'Pharmacokinetics (from Medicine)',
      points: [
        '**ADME** = Absorption, Distribution, Metabolism, Excretion: what the body does to a drug.',
        '**Bioavailability $F$**: fraction of an oral dose reaching the systemic circulation unchanged.',
        '**Clearance $CL$**: volume of plasma cleared of drug per unit time; **volume of distribution $V_d$**: apparent volume the drug spreads into.',
        'Half-life $t_{1/2} = 0.693\\,V_d/CL$; steady state is reached after about 4–5 half-lives.',
      ],
      link: 'med/pharmacokinetics',
    },
    {
      kind: 'explain',
      title: 'ADMET, letter by letter',
      body: String.raw`Add **T for toxicity** and you get **ADMET**: the properties, besides potency, that decide whether a molecule can become a medicine.

Each letter becomes a question you can answer in a test tube:
- **A**: does it dissolve, and can it cross the gut wall?
- **D**: how much is stuck to plasma proteins? Does it reach the brain?
- **M**: how fast do liver enzymes destroy it? Does it block those enzymes for *other* drugs?
- **E**: is it pumped out by transporters into urine or bile?
- **T**: does it block the cardiac hERG channel, damage DNA or kill liver cells?`,
      widget: { type: 'SvgDiagram', props: { svg: journeySvg }, caption: 'A swallowed dose (red) must survive the gut and the liver before it reaches its target. Some is lost on the way (purple).' },
    },
    {
      kind: 'widget',
      title: 'What ADME numbers do to a plasma curve',
      body: String.raw`This is the one-compartment model from the PK lesson. It opens in **Oral** mode: shorten $t_{1/2}$ (fast metabolism) or raise $V_d$ (extensive tissue distribution) and watch the peak and the exposure collapse. With $F = 0.3$, less than a third of each dose ever reaches the blood.`,
      widget: { type: 'PKCurve', props: { mode: 'oral', modes: ['oral', 'multiple'], F: 0.3, dose: 500, halfLife: 6, vd: 60, tau: 12, window: [2, 8], yMax: 12, tMax: 48 }, caption: 'Discovery teams cannot dose patients yet, so they predict $F$, $CL$ and $V_d$ from in-vitro assays and rat PK.' },
    },
    {
      kind: 'mcq',
      prompt: 'A lead is potent in cells and has high Caco-2 permeability, but after an oral dose to rats almost nothing reaches the plasma. Its half-life in liver microsomes is 3 minutes. What is the most likely culprit?',
      choices: ['Poor permeability across the gut wall', 'Extensive first-pass metabolism in the liver', 'Excessive binding to plasma proteins', 'Rapid excretion of unchanged drug in urine'],
      answer: 1,
      why: 'Good Caco-2 permeability argues against an absorption problem, while a 3-minute microsomal half-life means the liver destroys the compound almost as fast as blood delivers it. Oral drugs pass through the liver (via the portal vein) before reaching the systemic circulation, so high hepatic clearance slashes $F$. Plasma protein binding does not by itself stop a drug reaching the plasma.',
    },
    {
      kind: 'explain',
      title: 'The screening cascade',
      body: String.raw`ADMET assays are run in **tiers**, cheapest and fastest first, as in a funnel:

1. **In silico** predictions for every idea, before synthesis.
2. **Tier 1** (96/384-well plates, every compound made): kinetic solubility, logD, PAMPA, microsomal stability, CYP inhibition, a hERG screen.
3. **Tier 2** (promising leads): Caco-2, hepatocyte stability, plasma protein binding, thermodynamic solubility, hERG patch clamp, Ames.
4. **Tier 3**: rodent pharmacokinetics, then in-vivo safety studies on a few candidates.

Each tier costs more per compound and answers a question closer to the human outcome.`,
    },
    {
      kind: 'order',
      prompt: 'Put these ADMET activities in the order a typical discovery project meets them, from cheapest/highest-throughput to most expensive.',
      steps: [
        'ML prediction of solubility and hERG for a virtual library',
        'Microsomal stability and kinetic solubility in 96-well plates',
        'Caco-2 permeability and hepatocyte stability on selected leads',
        'Oral pharmacokinetics in rats',
        'Regulatory (GLP) toxicology studies on the chosen candidate',
      ],
      why: 'The cascade filters cheaply first. In silico costs nothing per molecule, plate assays cost little, cell-based tier-2 assays more, animal PK much more, and GLP toxicology is reserved for the one or two candidates heading to the clinic.',
    },
    {
      kind: 'explain',
      title: 'Lipophilicity: the master variable',
      body: String.raw`**logD₇.₄** is the octanol/buffer distribution coefficient at blood pH, counting all ionised and neutral forms (for a fully neutral compound, logD = logP).

Waring (2010) showed how many ADMET properties track it. Raising logD usually **increases** membrane permeability, but also metabolic clearance, plasma protein binding, hERG block and off-target promiscuity, while **decreasing** aqueous solubility. Waring suggested an optimal window of roughly **logD 1–3**.

That is why "add a greasy group to gain potency" so often creates ADMET problems later.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['1/(1+exp(-1.8*(x-1)))', '1/(1+exp(1.5*(x-2.5)))', '1/(1+exp(-1.5*(x-3.5)))'],
          labels: ['permeability', 'solubility', 'metabolic CL / hERG risk'],
          x: [-2, 6], y: [0, 1.1],
          xLabel: 'logD7.4', yLabel: 'relative',
        },
        caption: 'Schematic trends only (not fitted to data): permeability rises with logD, solubility falls, clearance and hERG liability rise. The sweet spot is where all are acceptable.',
      },
    },
    {
      kind: 'multi',
      prompt: 'Within a chemical series, which of these typically **increase** as logD₇.₄ goes up? Select all that apply.',
      choices: ['Passive membrane permeability', 'Aqueous solubility', 'Metabolic (CYP-mediated) clearance', 'Plasma protein binding', 'Risk of hERG block'],
      answers: [0, 2, 3, 4],
      why: 'Greasier molecules partition more easily into membranes, into the hydrophobic active sites of CYPs and hERG, and onto albumin. Solubility goes the other way: water does not like greasy molecules.',
    },
    {
      kind: 'explain',
      title: 'logP vs logD',
      body: String.raw`**logP** describes only the neutral species. Ionised molecules hardly enter octanol, so at a given pH the measured **logD** is lower. For a monoprotic acid (ignoring ion partitioning):

$$\log D = \log P - \log_{10}\!\left(1 + 10^{\,\mathrm{pH}-\mathrm{p}K_a}\right)$$

and for a base, the exponent is $\mathrm{p}K_a - \mathrm{pH}$.

Example: a base with logP 4 and pKa 9.4 at pH 7.4 gives $\log D = 4 - \log_{10}(1 + 10^{2}) \approx 4 - 2.0 = 2.0$. Once a molecule is mostly ionised, each further pH unit away from the pKa removes about one more log unit of lipophilicity.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A carboxylic acid has logP = 3.5 and pKa = 4.4. Estimate its logD at pH 7.4.`,
      answer: 0.5,
      tolerance: 0.05,
      why: String.raw`$\mathrm{pH} - \mathrm{p}K_a = 3$, so $\log D = 3.5 - \log_{10}(1 + 1000) \approx 3.5 - 3.0 = 0.5$. At blood pH the acid is 99.9 % ionised. A common slip is to subtract only $\log_{10}(3)$, using the pH difference directly instead of $10^{3}$.`,
    },
    {
      kind: 'explain',
      title: 'Predicting ADMET with machine learning',
      body: String.raw`Because ADMET assays are standardised and run on thousands of compounds, they are among the best datasets for [QSAR](@drug/qsar) and [property-prediction models](@drug/molecular-property-prediction).

The **Therapeutics Data Commons** (Huang et al. 2021) collects public ADMET data into a benchmark group of 22 datasets, among them Caco-2 permeability, aqueous solubility, plasma protein binding, CYP inhibition, half-life, hERG, Ames and DILI. It evaluates models on **scaffold splits**: test molecules have core ring systems the model never saw.

Caveats: assay noise between labs is large, public sets are small, and a model is only trustworthy inside its **applicability domain**. In industry, models are retrained weekly on in-house data and used to choose what to make, not to replace measurement.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Randomly splitting an ADMET dataset into train and test sets gives a realistic estimate of how well a model will predict a brand-new chemical series.',
      answer: false,
      why: 'With a random split, close analogues of each test molecule sit in the training set, so performance looks inflated. Scaffold (or time) splits hold out whole chemotypes and better mimic prospective use on new series.',
    },
    {
      kind: 'match',
      prompt: 'Match each discovery assay to the question it answers.',
      pairs: [
        ['Caco-2 monolayer', 'Can it cross the intestinal wall?'],
        ['Liver microsome stability', 'How fast is it metabolised?'],
        ['Equilibrium dialysis', 'What fraction is unbound in plasma?'],
        ['hERG patch clamp', 'Could it prolong the QT interval?'],
        ['Ames test', 'Is it mutagenic?'],
      ],
      why: 'These five assays cover A, M, D and T. Each gets its own lesson in this unit: solubility & permeability, metabolic stability, distribution & PPB, and safety pharmacology.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Potency is necessary but not sufficient: **ADMET** decides whether a ligand can become a medicine.
- Moving ADME measurement into discovery cut PK-related clinical failures from about 40 % (1991) to about 10 % (2000). Safety remains a leading cause of attrition.
- Assays run in a **tiered cascade**: in silico, then plate assays, then cell assays, then animals.
- **Lipophilicity (logD)** drives many ADMET properties at once. A logD of roughly 1–3 is a common sweet spot.
- ML ADMET models (e.g. the TDC benchmarks) help prioritise, but need scaffold-split validation and an applicability domain.`,
    },
  ],
  references: [
    { authors: 'Di, L., Kerns, E. H.', title: 'Drug-Like Properties: Concepts, Structure Design and Methods', year: 2016, venue: '2nd ed., Academic Press', detail: 'Introductory chapters on property-based design and the screening cascade' },
    { authors: 'Kola, I., Landis, J.', title: 'Can the pharmaceutical industry reduce attrition rates?', year: 2004, venue: 'Nat. Rev. Drug Discov. 3, 711–715' },
    { authors: 'Waring, M. J., Arrowsmith, J., Leach, A. R., et al.', title: 'An analysis of the attrition of drug candidates from four major pharmaceutical companies', year: 2015, venue: 'Nat. Rev. Drug Discov. 14, 475–486' },
    { authors: 'Waring, M. J.', title: 'Lipophilicity in drug discovery', year: 2010, venue: 'Expert Opin. Drug Discov. 5, 235–248' },
    { authors: 'Huang, K., Fu, T., Gao, W., et al.', title: 'Therapeutics Data Commons: Machine learning datasets and tasks for drug discovery and development', year: 2021, venue: 'NeurIPS Datasets and Benchmarks Track' },
  ],
} satisfies LessonContent;
