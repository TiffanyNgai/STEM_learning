import type { LessonContent } from '../../types';

/** Colloidal aggregate sequestering enzyme molecules; detergent breaks it up and releases them. */
const colloidSvg = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg"><g font-size="9" text-anchor="middle">
<text x="160" y="14" font-size="10" font-weight="700" fill="var(--fg)">Colloidal aggregation (schematic)</text>
<text x="80" y="32" fill="var(--fg)" font-weight="700">no detergent</text>
<text x="240" y="32" fill="var(--fg)" font-weight="700">+ 0.01% Triton X-100</text>
<line x1="160" y1="24" x2="160" y2="176" stroke="var(--muted)" stroke-dasharray="3 3"/>
<circle cx="80" cy="100" r="38" fill="var(--c4)" fill-opacity="0.35" stroke="var(--c4)">
<animate attributeName="r" values="36;39;36" dur="3s" repeatCount="indefinite"/></circle>
<text x="80" y="103" fill="var(--fg)">colloid</text>
<text x="80" y="114" fill="var(--muted)">(50–1000 nm)</text>
${[0, 60, 120, 180, 240, 300].map((a) => {
  const r = (a * Math.PI) / 180;
  return `<circle cx="${(80 + 44 * Math.cos(r)).toFixed(1)}" cy="${(100 + 44 * Math.sin(r)).toFixed(1)}" r="6" fill="var(--c2)" stroke="var(--c5)" stroke-width="1.5"/>`;
}).join('')}
<text x="80" y="166" fill="var(--c5)">enzyme adsorbed, partly unfolded → "inhibited"</text>
${[[205, 70], [250, 60], [285, 95], [215, 120], [262, 135], [235, 95]].map(([x, y], i) =>
  `<circle cx="${x}" cy="${y}" r="6" fill="var(--c2)"><animate attributeName="cy" values="${y};${y - 6};${y}" dur="${2 + i * 0.3}s" repeatCount="indefinite"/></circle>`).join('')}
${[[230, 150], [270, 155], [195, 145]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="var(--c4)"/>`).join('')}
<text x="240" y="176" fill="var(--c3)">free enzyme, activity restored</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Most screening "hits" are not real',
      body: String.raw`A primary screen asks one question: *did the signal change?* Many molecules change the signal without touching the target the way a drug would. They clump into particles, absorb or emit light, react with cysteines, generate hydrogen peroxide or inhibit the reporter enzyme.

These **artefacts** are not rare. In a screen of a ~70,000-compound library against β-lactamase, Feng et al. (2007) found that about 95% of the inhibitors (1,204 of 1,274) were detergent-sensitive aggregators. Artefacts also end up in public databases, where they become labelled "actives" for machine-learning models. Learning to spot them protects your experiments and your training data.`,
    },
    {
      kind: 'recall',
      title: 'Recall: the screening cascade',
      points: [
        'A primary HTS tests each compound once, at one concentration, and calls hits above a threshold.',
        'Hits are re-tested in concentration–response, then counter-screened against the readout itself.',
        'Orthogonal assays (e.g. biophysics) use a different physical principle to confirm binding.',
        String.raw`Assay quality is summarised by $Z' = 1 - 3(\sigma_p+\sigma_n)/|\mu_p-\mu_n|$.`,
      ],
      link: 'drug/wet-lab-assays',
    },
    {
      kind: 'widget',
      title: 'Colloidal aggregators',
      body: String.raw`Many hydrophobic, flat, conjugated molecules form **colloids** in aqueous buffer once they exceed a **critical aggregation concentration** (often low micromolar). Shoichet and colleagues showed that these particles adsorb enzyme molecules and partly unfold them, inhibiting almost any enzyme non-specifically (McGovern et al. 2002). The same mechanism explains many "promiscuous" hits from both HTS and virtual screening.

A small amount of non-ionic detergent breaks up the colloids. The standard test (Feng & Shoichet 2006) is to repeat the assay with and without ~0.01 % Triton X-100.`,
      widget: { type: 'SvgDiagram', props: { svg: colloidSvg }, caption: 'Left: enzyme molecules (blue) stuck to a colloid. Right: detergent disperses the colloid; the enzyme is free and active again.' },
    },
    {
      kind: 'widget',
      title: 'Fingerprints of an aggregator',
      body: String.raw`Compare a genuine 1 µM inhibitor (blue) with an aggregator (purple). The aggregator's curve is **very steep**: nothing happens until the critical aggregation concentration, then activity collapses. It also **shifts right when you add more enzyme**, because each colloid can only soak up a limited number of enzyme molecules. Slide the enzyme concentration and watch which curve moves. With detergent (green) the aggregator's "activity" mostly disappears.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['100/(1+10^(x))', '100/(1+10^(4*(x-log10(2*n))))', '100-8/(1+10^(-2*(x-1.5)))'],
          x: [-2, 2], y: [0, 105],
          params: [{ name: 'n', min: 1, max: 10, value: 1, label: 'enzyme conc. (×)' }],
          labels: ['true inhibitor', 'aggregator', 'aggregator + detergent'],
          xLabel: 'log10 [compound] (µM)', yLabel: '% activity',
        },
        caption: 'True 1:1 inhibitor: Hill slope ≈ 1 and IC50 independent of enzyme concentration (when not tight-binding). Aggregator: Hill slope ≈ 4 here, IC50 proportional to enzyme, detergent-sensitive.',
      },
    },
    {
      kind: 'multi',
      prompt: 'Which observations point towards colloidal aggregation? (Select all that apply.)',
      choices: [
        'Inhibition is largely abolished by 0.01 % Triton X-100',
        'The IC50 increases roughly in proportion when enzyme concentration is raised 10-fold',
        'Hill slope of about 3–5',
        'Particles of a few hundred nanometres detected by dynamic light scattering at the assay concentration',
        'A co-crystal structure shows the compound in the active site with clear density',
      ],
      answers: [0, 1, 2, 3],
      why: 'Detergent sensitivity, enzyme-concentration dependence, steep curves and visible particles are the classic signs (Feng & Shoichet 2006). A well-defined co-crystal structure shows a specific binding mode. That is evidence against a purely aggregate-based mechanism, although crystals are grown at very high concentrations, so it is not proof of potency.',
    },
    {
      kind: 'explain',
      title: 'PAINS: substructures that cheat',
      body: String.raw`Baell & Holloway (2010) analysed six AlphaScreen HTS campaigns and found chemical classes that came up as hits again and again, across unrelated targets. They encoded 480 of them as substructure filters: **pan-assay interference compounds** (PAINS). Familiar offenders include ene-rhodanines, quinones, catechols, phenolic Mannich bases, hydroxyphenylhydrazones and 2-aminothiophenes.

Their tricks:
- **Covalent reactivity**: electrophiles modify cysteines on any protein.
- **Redox cycling**: in buffers containing DTT, some compounds generate H₂O₂, which oxidises catalytic cysteines.
- **Metal chelation**: they strip metal cofactors or chelate the assay's metal-based reagents.
- **Optical interference**: they absorb or fluoresce at the assay wavelengths.`,
    },
    {
      kind: 'match',
      prompt: 'Match each interference mechanism to how it fools an assay.',
      pairs: [
        ['Autofluorescent compound', 'Adds its own light in a fluorescence-intensity readout'],
        ['Coloured compound (inner-filter effect)', 'Absorbs excitation or emission light, mimicking a drop in signal'],
        ['Redox cycler', 'Generates H₂O₂ with DTT and oxidises active-site cysteines'],
        ['Firefly luciferase inhibitor', 'Lowers the signal in any luciferase reporter assay, whatever the pathway'],
        ['Singlet-oxygen quencher', 'Gives false hits in AlphaScreen bead-proximity assays'],
      ],
      why: 'Each readout has its own weak points. Counter-screens test the readout directly: a luciferase counter-screen with the purified enzyme, or an AlphaScreen assay without the target. Orthogonal biophysics avoids optical detection altogether.',
    },
    {
      kind: 'truefalse',
      prompt: 'Any compound flagged by a PAINS substructure filter is an artefact and should be removed from consideration.',
      answer: false,
      why: 'PAINS filters are **alerts**, not verdicts. They were derived from one technology (AlphaScreen), and some approved drugs contain PAINS motifs. Capuzzi et al. (2017) showed many flagged compounds behave well elsewhere. A flag means "run the experiments that would expose interference", not automatic rejection. Conversely, passing the filters does not prove a hit is clean: aggregators are mostly not PAINS.',
    },
    {
      kind: 'explain',
      title: 'Noise: the numbers themselves wobble',
      body: String.raw`Even for genuine compounds, potency values are noisy. Repeating an IC50 in the same lab typically spreads the result by a few tenths of a log unit. Comparing labs is worse. Kramer et al. (2012) compared independently measured $K_i$ values for the same compound–target pairs in ChEMBL and estimated a standard deviation of about **0.5 pKi units**, roughly a factor of 3 per measurement. Mixed IC50s from different assays are noisier still ([Binding affinity](@drug/binding-affinity)).

Plates add systematic errors: evaporation in edge wells, gradients across rows and columns, and drift through a run. Robust per-plate normalisation (median/MAD z-scores, or the **B-score** of Brideau et al. 2003) removes these patterns before hits are called.`,
    },
    {
      kind: 'numeric',
      prompt: 'Replicate pIC50 measurements of a compound have a standard deviation of 0.3 log units. How many independent replicates do you need for the standard error of the mean to be 0.1?',
      answer: 9,
      tolerance: 0,
      why: String.raw`$SE = \sigma/\sqrt{n}$, so $0.1 = 0.3/\sqrt{n}$, $\sqrt{n} = 3$, $n = 9$. Halving the noise costs four times the replicates, which is why most screens settle for duplicates and accept the noise. See [hypothesis testing](@stats/hypothesis-testing).`,
    },
    {
      kind: 'widget',
      title: 'Noise caps model accuracy',
      body: String.raw`If measured activity = true activity + random error with SD $\sigma_{noise}$, then even a *perfect* model cannot explain the noise. The best achievable $R^2$ on a test set is roughly

$$R^2_{max} \approx 1 - \frac{\sigma^2_{noise}}{\sigma^2_{total}}$$

where $\sigma_{total}$ is the spread of measured activities in the dataset (Brown, Muchmore & Hajduk 2009 make this point about realistic model performance). Slide the data spread: a narrow congeneric series spanning ~1 log unit with 0.5 log units of noise leaves little room for any model.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['1-(x/s)^2'],
          x: [0, 1], y: [0, 1.05],
          params: [{ name: 's', min: 0.5, max: 2, value: 1, label: 'SD of data (log units)' }],
          labels: ['max achievable R²'],
          xLabel: 'experimental noise SD (log units)', yLabel: 'R² ceiling',
        },
        caption: 'A model reporting R² above this ceiling on noisy data is more likely leaking information than outperforming physics. See [Benchmarks, splits & leakage](@drug/benchmarks-splits-leakage).',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A dataset's pIC50 values have SD 1.0, and the experimental noise SD is 0.5. Using $R^2_{max} \approx 1 - \sigma^2_{noise}/\sigma^2_{total}$, what is the ceiling on $R^2$?`,
      answer: 0.75,
      tolerance: 0.01,
      why: String.raw`$1 - 0.5^2/1.0^2 = 1 - 0.25 = 0.75$. A common slip is to use the SDs instead of variances, giving 0.5. Variances, not standard deviations, add.`,
    },
    {
      kind: 'mcq',
      prompt: 'A screening hit inhibits your protease with IC50 = 3 µM and Hill slope 3.5. Which next experiment most efficiently tests the most likely artefact?',
      choices: [
        'Repeat the concentration–response with 0.01 % Triton X-100 in the buffer',
        'Order 50 close analogues to build SAR',
        'Dock the compound into the active site',
        'Measure its activity in a mouse model',
      ],
      answer: 0,
      why: 'A steep Hill slope at micromolar concentrations is the signature of aggregation, and the detergent counter-screen is quick and cheap. Buying analogues or docking would just build on a possible artefact (aggregators often show flat or nonsensical SAR), and animal studies are far too early.',
    },
    {
      kind: 'fill',
      prompt: 'Non-specific inhibition by particles is called colloidal ___; recurring interference substructures are called ___; a counter-screen with purified luciferase detects ___ inhibitors of the readout.',
      bank: ['aggregation', 'PAINS', 'reporter', 'precipitation', 'scaffolds', 'allosteric'],
      answer: ['aggregation', 'PAINS', 'reporter'],
      why: 'Colloidal aggregation (Shoichet lab) and PAINS (Baell & Holloway) are the two big families of false positives. Luciferase inhibitors are a readout artefact: they affect the reporter enzyme, not the biology. Precipitation is related but different: insoluble solid simply lowers the effective concentration.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Many primary hits are **artefacts**: colloidal aggregators, PAINS (reactive, redox-active, chelating, optically interfering) and reporter inhibitors.
- **Aggregators**: steep curves, detergent-sensitive, IC50 scales with enzyme concentration, particles visible by DLS.
- **PAINS filters** are alerts to investigate, not automatic verdicts.
- Real data are noisy: about 0.5 log units between labs for public $K_i$s; replicates reduce SE as $1/\sqrt{n}$; plate effects need robust normalisation.
- Noise sets a ceiling: $R^2_{max} \approx 1 - \sigma^2_{noise}/\sigma^2_{total}$. Clean and annotate data before modelling: [Reproducibility & data quality](@drug/reproducibility-data-quality).`,
    },
  ],
  references: [
    { authors: 'McGovern, S. L., Caselli, E., Grigorieff, N., Shoichet, B. K.', title: 'A common mechanism underlying promiscuous inhibitors from virtual and high-throughput screening', year: 2002, venue: 'J. Med. Chem. 45, 1712–1722' },
    { authors: 'Feng, B. Y., Shoichet, B. K.', title: 'A detergent-based assay for the detection of promiscuous inhibitors', year: 2006, venue: 'Nat. Protoc. 1, 550–553' },
    { authors: 'Baell, J. B., Holloway, G. A.', title: 'New substructure filters for removal of pan assay interference compounds (PAINS) from screening libraries and for their exclusion in bioassays', year: 2010, venue: 'J. Med. Chem. 53, 2719–2740' },
    { authors: 'Kramer, C., Kalliokoski, T., Gedeck, P., Vulpetti, A.', title: 'The experimental uncertainty of heterogeneous public Ki data', year: 2012, venue: 'J. Med. Chem. 55, 5165–5173' },
    { authors: 'Capuzzi, S. J., Muratov, E. N., Tropsha, A.', title: 'Phantom PAINS: problems with the utility of alerts for pan-assay interference compounds', year: 2017, venue: 'J. Chem. Inf. Model. 57, 417–427' },
  ],
} satisfies LessonContent;
