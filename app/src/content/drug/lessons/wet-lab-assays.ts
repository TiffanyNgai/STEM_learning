import type { LessonContent } from '../../types';

/** A 384-well plate (16 rows × 24 columns) as a heat map: cols 1–2 neutral controls, 23–24 inhibitor controls, a few hits. */
const plateSvg = (() => {
  let seed = 12345;
  const u = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const cell = 11, L = 24, T = 26;
  const hits = new Set(['3,7', '9,15', '12,4', '5,19']);
  let cells = '';
  for (let r = 0; r < 16; r++) {
    for (let c = 0; c < 24; c++) {
      let v: number;
      if (c < 2) v = 0.88 + 0.08 * (u() - 0.5);
      else if (c > 21) v = 0.12 + 0.08 * (u() - 0.5);
      else if (hits.has(`${r},${c}`)) v = 0.22 + 0.1 * u();
      else v = 0.86 + 0.16 * (u() - 0.5);
      const x = L + c * cell, y = T + r * cell;
      cells += `<rect x="${x}" y="${y}" width="${cell - 1.5}" height="${cell - 1.5}" rx="2" fill="var(--c2)" fill-opacity="${v.toFixed(2)}"/>`;
      if (hits.has(`${r},${c}`)) {
        cells += `<rect x="${x - 1}" y="${y - 1}" width="${cell + 0.5}" height="${cell + 0.5}" rx="3" fill="none" stroke="var(--c5)" stroke-width="1.6"><animate attributeName="stroke-opacity" values="1;0.2;1" dur="1.6s" repeatCount="indefinite"/></rect>`;
      }
    }
  }
  const rows = 'ABCDEFGHIJKLMNOP'.split('').map((ch, r) => r % 3 === 0 ? `<text x="${L - 4}" y="${T + r * cell + 8}" font-size="9" text-anchor="end" fill="var(--muted)">${ch}</text>` : '').join('');
  const cols = [1, 12, 24].map((c) => `<text x="${L + (c - 1) * cell + 5}" y="${T - 4}" font-size="9" text-anchor="middle" fill="var(--muted)">${c}</text>`).join('');
  return `<svg viewBox="0 0 320 230" xmlns="http://www.w3.org/2000/svg">
<text x="${L}" y="12" font-size="10" font-weight="700" fill="var(--fg)">384-well plate · darker = more enzyme activity</text>
${rows}${cols}${cells}
<text x="${L + cell}" y="${T + 16 * cell + 12}" font-size="9" text-anchor="middle" fill="var(--fg)">neutral</text>
<text x="${L + cell}" y="${T + 16 * cell + 22}" font-size="9" text-anchor="middle" fill="var(--muted)">(DMSO)</text>
<text x="${L + 12 * cell}" y="${T + 16 * cell + 12}" font-size="9" text-anchor="middle" fill="var(--fg)">320 test compounds, one per well</text>
<text x="${L + 12 * cell}" y="${T + 16 * cell + 22}" font-size="9" text-anchor="middle" fill="var(--c5)">red outline = hit (activity dropped)</text>
<text x="${L + 23 * cell}" y="${T + 16 * cell + 12}" font-size="9" text-anchor="middle" fill="var(--fg)">inhibitor</text>
<text x="${L + 23 * cell}" y="${T + 16 * cell + 22}" font-size="9" text-anchor="middle" fill="var(--muted)">control</text>
</svg>`;
})();

const cascadeSvg = `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg">
<g font-size="9" text-anchor="middle">
<rect x="10" y="10" width="300" height="26" rx="8" fill="var(--c2)" fill-opacity="0.25" stroke="var(--c2)"/>
<text x="160" y="27" fill="var(--fg)" font-weight="700">Primary HTS · 1 concentration · ~10⁶ compounds</text>
<rect x="35" y="44" width="250" height="26" rx="8" fill="var(--c6)" fill-opacity="0.25" stroke="var(--c6)"/>
<text x="160" y="61" fill="var(--fg)" font-weight="700">Confirm + concentration–response (IC50)</text>
<rect x="60" y="78" width="200" height="26" rx="8" fill="var(--c3)" fill-opacity="0.25" stroke="var(--c3)"/>
<text x="160" y="95" fill="var(--fg)" font-weight="700">Counter-screens & artefact checks</text>
<rect x="85" y="112" width="150" height="26" rx="8" fill="var(--c4)" fill-opacity="0.25" stroke="var(--c4)"/>
<text x="160" y="129" fill="var(--fg)" font-weight="700">Orthogonal biophysics</text>
<rect x="110" y="146" width="100" height="20" rx="8" fill="var(--c1)" fill-opacity="0.3" stroke="var(--c1)"/>
<text x="160" y="160" fill="var(--fg)" font-weight="700">Cell assay</text>
<circle cx="160" cy="0" r="3" fill="var(--c5)"><animate attributeName="cy" values="0;160" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0" dur="3s" repeatCount="indefinite"/></circle>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Every number starts at a bench',
      body: String.raw`Every activity value a computational model learns from — every "IC50 = 40 nM" in a database — came out of an **assay**: a carefully designed experiment that turns "does this molecule affect my target?" into a number.

Think of an assay as a *sensor* bolted onto the biology. A good sensor is sensitive, reproducible and measures what you think it measures. A bad one gives confident-looking numbers that are wrong.

If you will ever train a model on bioactivity data, you need to know how those numbers are made — and how they lie.`,
    },
    {
      kind: 'explain',
      title: 'Biochemical vs cell-based assays',
      body: String.raw`**Biochemical** (cell-free) assays use purified components — e.g. an enzyme, its substrate and the test compound in a buffer. They are clean and mechanistic: a drop in product means the compound hit the enzyme (or interfered with the readout).

**Cell-based** assays put the compound on living cells and measure an outcome — a phosphorylated protein, a reporter signal, cell death. They are messier but more realistic: the compound must cross the membrane, survive metabolism and compete with cellular ATP or substrate.

*Example:* a kinase inhibitor may have IC50 = 5 nM on the purified kinase but 500 nM in cells, partly because cells contain millimolar ATP that competes with it.`,
    },
    {
      kind: 'mcq',
      prompt: 'A compound is potent on the purified enzyme but shows no effect in a cell-based assay of the same pathway. Which explanation is **least** likely?',
      choices: [
        'It cannot cross the cell membrane',
        'It is pumped out of the cell by efflux transporters',
        'It competes with a high cellular concentration of the natural substrate',
        'Cell-based assays cannot detect enzyme inhibitors',
      ],
      answer: 3,
      why: 'Cell-based assays detect enzyme inhibition routinely (via downstream signals). The real gap usually comes from permeability, efflux, metabolism or competition with abundant substrates like ATP — the realism that makes cell assays valuable.',
    },
    {
      kind: 'explain',
      title: 'Binding vs functional; reporters',
      body: String.raw`A **binding assay** asks "does it stick?" — e.g. displacement of a labelled tracer from a receptor. A **functional assay** asks "does it change what the target *does*?" — enzyme turnover, ion flux, second-messenger levels (e.g. cAMP).

The distinction matters: an antagonist and an agonist can bind equally tightly yet do opposite things. Binding alone cannot tell them apart.

A **reporter assay** is a functional cell assay with an engineered readout: the promoter of a pathway's target gene drives a gene that is easy to measure, like **luciferase** (emits light) or GFP. Pathway on → more reporter → more signal.`,
    },
    {
      kind: 'match',
      prompt: 'Match each common assay readout to how it generates signal.',
      pairs: [
        ['Fluorescence polarisation (FP)', 'A small fluorescent tracer tumbles slowly (light stays polarised) when bound to a big protein'],
        ['TR-FRET', 'Long-lived lanthanide donor transfers energy to a nearby acceptor; time-gating removes background'],
        ['Luminescence (luciferase)', 'An enzyme reaction emits light — no excitation lamp needed'],
        ['AlphaScreen', 'Singlet oxygen diffuses from a donor bead to an acceptor bead only if they are within ~200 nm'],
      ],
      why: 'Each technology converts a molecular event (binding, proximity, enzyme activity) into light. Knowing the mechanism tells you which compounds can fool it — fluorescent compounds disturb FP and FRET, singlet-oxygen quenchers fool AlphaScreen, luciferase inhibitors fool reporter assays.',
    },
    {
      kind: 'widget',
      title: 'From single wells to a concentration–response curve',
      body: String.raw`A single concentration only says "active or not". To quantify potency we test a **dilution series** (here half-log steps, in duplicate) and fit a sigmoidal curve. The concentration giving half the maximal effect is the **IC50** (inhibition) or **EC50** (activation). Tap **New replicate** to see how much the points scatter from run to run; drag the sliders to see how pIC50 shifts the curve and the Hill slope changes its steepness.`,
      widget: { type: 'DrugDoseResponse', props: { showData: true, pIC50: 7, hill: 1 }, caption: 'Grey dots: simulated duplicate measurements with ~6% noise. Blue: the four-parameter logistic (Hill) model. Details in [Binding affinity](@drug/binding-affinity).' },
    },
    {
      kind: 'truefalse',
      prompt: 'Compound A has IC50 = 10 nM and compound B has IC50 = 1 µM. A is 100-fold more potent, i.e. its pIC50 is 2 units higher.',
      answer: true,
      why: '1 µM = 1000 nM, so B needs 100× more compound for the same effect. pIC50 = −log10(IC50 in M): A gives 8.0, B gives 6.0 — a difference of 2. Remember: *lower* IC50 = *more* potent, *higher* pIC50 = more potent.',
    },
    {
      kind: 'widget',
      title: 'High-throughput screening (HTS)',
      body: String.raw`HTS tests hundreds of thousands to millions of compounds, usually at one concentration (~10 µM), in **384- or 1536-well plates** handled by robots. Each plate carries its own controls: **neutral** wells (solvent only, DMSO: full activity) and **positive** wells (a known inhibitor: zero activity). Every test well is normalised between the two to give "% inhibition". Wells falling below a threshold are called **hits**.`,
      widget: { type: 'SvgDiagram', props: { svg: plateSvg }, caption: 'A simulated plate: four wells stand out as hits. Real plates also show edge effects, drift and dispensing errors that must be corrected.' },
    },
    {
      kind: 'recall',
      title: 'Recall: statistics behind hit-calling',
      points: [
        'Every measurement has noise; a "hit" is a claim that an observation is unlikely under the null (no effect).',
        'Thresholds trade false positives against false negatives.',
        'Testing a million compounds means even a 0.1% false-positive rate yields ~1,000 false hits — multiple testing matters.',
        'Replicates reduce noise roughly as $1/\\sqrt{n}$.',
      ],
      link: 'stats/hypothesis-testing',
    },
    {
      kind: 'explain',
      title: "Is the assay good enough? The Z′-factor",
      body: String.raw`An assay is useful only if positive and negative controls are **clearly separated** relative to their scatter. Zhang, Chung & Oldenburg (1999) summarised this as

$$Z' = 1 - \frac{3(\sigma_p + \sigma_n)}{|\mu_p - \mu_n|}$$

where $\mu_p, \mu_n$ are the mean signals of the positive and negative controls and $\sigma_p, \sigma_n$ their standard deviations. Picture two bell curves: $Z'$ asks whether their "±3σ" bands overlap.

- $Z' = 1$: perfect (no noise).
- $Z' \ge 0.5$: excellent, standard for HTS.
- $0 < Z' < 0.5$: marginal.
- $Z' \le 0$: bands overlap — unusable for single-point screening.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Neutral controls give mean signal 100 (SD 5); inhibitor controls give mean 10 (SD 4). Compute $Z'$.`,
      answer: 0.7,
      tolerance: 0.01,
      why: String.raw`$Z' = 1 - 3(5+4)/|100-10| = 1 - 27/90 = 0.70$. That is an excellent screening window. A common slip is forgetting the factor of 3, which would give 0.9.`,
    },
    {
      kind: 'widget',
      title: 'The screening cascade and orthogonal assays',
      body: String.raw`A primary screen is a cheap, noisy filter. Hits then flow through a **cascade**: re-test, measure full concentration–response curves, run **counter-screens** (e.g. against the readout itself — is it just a luciferase inhibitor?), then **orthogonal** assays that use a different physical principle, such as [SPR](@chem/spr) or [ITC](@chem/calorimetry-itc), to confirm genuine binding. Only then are hits tested in cells.

Many false hits are **artefacts**: colloidal **aggregators** that sequester enzymes non-specifically (McGovern et al. 2002), and **PAINS** — pan-assay interference compounds with reactive, redox-active or coloured substructures (Baell & Holloway 2010).`,
      widget: { type: 'SvgDiagram', props: { svg: cascadeSvg }, caption: 'Each tier is slower and more expensive but more trustworthy; most primary hits do not survive.' },
    },
    {
      kind: 'order',
      prompt: 'Put a typical hit-finding cascade in order.',
      steps: [
        'Develop the assay and check Z′ ≥ 0.5 on control plates',
        'Primary single-concentration HTS of the library',
        'Re-test hits and measure concentration–response (IC50)',
        'Counter-screens and artefact checks (aggregation, readout interference)',
        'Orthogonal biophysical confirmation of binding',
        'Cell-based assay of the confirmed series',
      ],
      why: 'You validate the sensor before using it, screen broadly and cheaply first, then spend progressively more effort on fewer compounds. Confirming binding with an orthogonal method before cell work prevents chasing artefacts.',
    },
    {
      kind: 'multi',
      prompt: 'Which observations should make you suspect a screening hit is an **artefact**? (Select all that apply.)',
      choices: [
        'Activity disappears when 0.01% non-ionic detergent (e.g. Triton X-100) is added',
        'The compound is strongly coloured or fluorescent at the assay wavelengths',
        'It is "active" in many unrelated assays in PubChem',
        'Activity is confirmed by SPR showing 1:1 binding',
        'An unusually steep concentration–response curve (Hill slope ≫ 1)',
      ],
      answers: [0, 1, 2, 4],
      why: 'Detergent-sensitive activity and steep curves are hallmarks of colloidal aggregation; coloured/fluorescent compounds interfere with optical readouts; frequent hitters are typical PAINS. Clean 1:1 binding in an orthogonal biophysical assay is evidence *for* a genuine hit.',
    },
    {
      kind: 'fill',
      prompt: 'An assay with purified enzyme is ___; one measuring a luciferase signal driven by a pathway promoter is a ___ assay; confirming a hit with a different physical principle is an ___ assay.',
      bank: ['biochemical', 'reporter', 'orthogonal', 'phenotypic', 'counter', 'binding'],
      answer: ['biochemical', 'reporter', 'orthogonal'],
      why: 'Cell-free purified systems are biochemical; engineered light/fluorescence readouts of pathway activity are reporters; orthogonal assays change the detection principle so the same artefact cannot fool both. A counter-screen instead tests the readout or an anti-target.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Assays turn biology into numbers: **biochemical** (clean, mechanistic) vs **cell-based** (realistic, messier); **binding** vs **functional**.
- Readouts (FP, TR-FRET, luminescence, AlphaScreen) each have characteristic ways to be fooled.
- Potency comes from **concentration–response** fits: IC50/EC50, reported as pIC50.
- HTS quality is judged by $Z' = 1 - 3(\sigma_p+\sigma_n)/|\mu_p-\mu_n|$; aim for ≥ 0.5.
- Hits pass a **cascade** of confirmation, counter-screens and **orthogonal** assays; aggregators and PAINS are common false positives.
- Next: what IC50, Ki and Kd really mean — [Binding affinity](@drug/binding-affinity).`,
    },
  ],
  references: [
    { authors: 'Hughes, J. P., Rees, S., Kalindjian, S. B., Philpott, K. L.', title: 'Principles of early drug discovery', year: 2011, venue: 'Br. J. Pharmacol. 162, 1239–1249' },
    { authors: 'Zhang, J.-H., Chung, T. D. Y., Oldenburg, K. R.', title: 'A simple statistical parameter for use in evaluation and validation of high throughput screening assays', year: 1999, venue: 'J. Biomol. Screen. 4, 67–73' },
    { authors: 'Macarron, R., Banks, M. N., Bojanic, D., et al.', title: 'Impact of high-throughput screening in biomedical research', year: 2011, venue: 'Nat. Rev. Drug Discov. 10, 188–195' },
    { authors: 'Baell, J. B., Holloway, G. A.', title: 'New substructure filters for removal of pan assay interference compounds (PAINS) from screening libraries and for their exclusion in bioassays', year: 2010, venue: 'J. Med. Chem. 53, 2719–2740' },
    { authors: 'McGovern, S. L., Caselli, E., Grigorieff, N., Shoichet, B. K.', title: 'A common mechanism underlying promiscuous inhibitors from virtual and high-throughput screening', year: 2002, venue: 'J. Med. Chem. 45, 1712–1722' },
  ],
} satisfies LessonContent;
