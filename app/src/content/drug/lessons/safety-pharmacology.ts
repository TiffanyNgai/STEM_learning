import type { LessonContent } from '../../types';

// Ames plate: background revertant colonies vs many colonies with a mutagen.
const colonies = (n: number, cx: number, seed: number) => {
  let s = seed; const u = () => (s = (s * 16807) % 2147483647) / 2147483647;
  let out = '';
  for (let i = 0; i < n; i++) {
    const r = 48 * Math.sqrt(u()); const a = 2 * Math.PI * u();
    out += `<circle cx="${(cx + r * Math.cos(a)).toFixed(1)}" cy="${(95 + r * Math.sin(a)).toFixed(1)}" r="2.2" fill="var(--c3)" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${(0.3 + 2 * u()).toFixed(2)}s" dur="0.4s" fill="freeze"/></circle>`;
  }
  return out;
};
const amesSvg = String.raw`<svg viewBox="0 0 320 185" xmlns="http://www.w3.org/2000/svg" font-size="9" fill="var(--fg)">
<text x="160" y="13" text-anchor="middle" font-size="10" font-weight="700">Ames test: his⁻ Salmonella on histidine-free agar</text>
<circle cx="85" cy="95" r="55" fill="var(--c6)" fill-opacity="0.08" stroke="var(--muted)"/>
<circle cx="235" cy="95" r="55" fill="var(--c6)" fill-opacity="0.08" stroke="var(--muted)"/>
${colonies(8, 85, 11)}${colonies(70, 235, 29)}
<text x="85" y="165" text-anchor="middle">solvent control</text><text x="85" y="177" text-anchor="middle" font-size="8" fill="var(--muted)">few spontaneous revertants</text>
<text x="235" y="165" text-anchor="middle">test compound + S9</text><text x="235" y="177" text-anchor="middle" font-size="8" fill="var(--c5)">dose-related rise = mutagenic</text>
</svg>`;

// Safety margin bar chart: unbound Cmax vs assay IC50 for three example liabilities.
const marginSvg = (() => {
  const rows: [string, number, number][] = [
    // label, log10(IC50 / Cmax,u) i.e. margin in log units, bar colour index
    ['hERG patch clamp', 2.5, 1],
    ['off-target panel hit', 1.2, 3],
    ['cytotoxicity (HepG2)', 3.0, 0],
  ];
  const x0 = 110, w = 180, per = w / 4; // 0..4 log units
  return `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg" font-size="9" fill="var(--fg)">
<text x="10" y="14" font-size="10" font-weight="700">Safety margins = IC50 ÷ unbound Cmax</text>
<line x1="${x0 + per * 1.5}" y1="26" x2="${x0 + per * 1.5}" y2="134" stroke="var(--c5)" stroke-dasharray="4 3"/>
<text x="${x0 + per * 1.5}" y="146" font-size="8" fill="var(--c5)" text-anchor="middle">~30×</text>
<text x="${x0 + per * 1.5}" y="156" font-size="8" fill="var(--muted)" text-anchor="middle">a common target margin</text>
${rows.map(([lab, m, c], i) => {
    const y = 34 + i * 32;
    return `<text x="${x0 - 6}" y="${y + 11}" font-size="9" text-anchor="end">${lab}</text>
<rect x="${x0}" y="${y}" width="0" height="14" rx="3" fill="var(--c${c + 1})" fill-opacity="0.75"><animate attributeName="width" from="0" to="${(m * per).toFixed(0)}" dur="1s" begin="${i * 0.3}s" fill="freeze"/></rect>
<text x="${x0 + m * per + 4}" y="${y + 11}" font-size="8" fill="var(--muted)">${Math.round(Math.pow(10, m))}×</text>`;
  }).join('\n')}
<line x1="${x0}" y1="134" x2="${x0 + w}" y2="134" stroke="var(--fg)" stroke-width="0.8"/>
${[0, 1, 2, 3, 4].map((l) => `<text x="${x0 + l * per}" y="144" font-size="8" fill="var(--muted)" text-anchor="middle">${Math.pow(10, l)}×</text>`).join('')}
</svg>`;
})();

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The third question',
      body: String.raw`Early discovery asks three questions of every molecule. Does it hit the target? Will the body let it reach the target? And: **what else does it do?**

Safety-related problems are a leading reason candidates are dropped, both before and during clinical trials (Waring et al. 2015). So discovery teams screen for the best-understood liabilities as soon as they have compounds: cardiac ion channels, genetic damage, liver-cell toxicity and a broad panel of unrelated receptors and enzymes.

The organising idea in all of them is the **margin**: how far apart are the concentration that produces the wanted effect and the concentration that produces the unwanted one.`,
    },
    {
      kind: 'recall',
      title: 'Toxicology basics (from Medicine)',
      points: [
        '"The dose makes the poison": toxicity depends on exposure, not on the molecule alone.',
        '**Therapeutic index** compares a toxic dose with an effective dose; a wide gap is safer.',
        'Toxicity can be **on-target** (exaggerated pharmacology) or **off-target** (an unintended protein).',
        'Some toxicity comes from **reactive metabolites** rather than the parent drug.',
      ],
      link: 'med/toxicology-basics',
    },
    {
      kind: 'explain',
      title: 'Cardiac ion channels: hERG',
      body: String.raw`The **hERG** channel (gene *KCNH2*, protein Kv11.1) carries **IKr**, the rapid delayed-rectifier potassium current that helps heart muscle cells repolarise after each beat. Compounds that block it lengthen the cardiac action potential, which appears on the [ECG](@med/ecg-basics) as a longer **QT interval** — an accepted warning sign for rhythm problems.

hERG has a roomy inner cavity lined with aromatic residues (Tyr652, Phe656) that accommodates many unrelated molecules, which is why so many chemical series hit it. Typical blockers combine a **basic amine** with **lipophilic aromatic groups**.

Because of this, regulators expect ion-channel testing before first-in-human studies (ICH S7B, 2005).`,
    },
    {
      kind: 'explain',
      title: 'Measuring it, and designing it out',
      body: String.raw`The reference assay is **manual whole-cell patch clamp** on a cell line expressing hERG: it measures the current directly and gives an IC50. **Automated patch clamp** platforms made this a routine screen; cheaper displacement-binding assays are used for early triage but can mis-rank compounds.

Chemists usually reduce hERG potency by **lowering the pKa** of the basic amine, **lowering logD**, or adding an acidic group to make a **zwitterion**. The textbook example is terfenadine: its carboxylic-acid metabolite **fexofenadine**, marketed as its replacement, has far weaker hERG activity.

hERG is also one of the most modelled ADMET endpoints: classifiers trained on thousands of patch-clamp results (a hERG task is in the Therapeutics Data Commons) triage virtual compounds before synthesis.`,
      widget: { type: 'DrugDoseResponse', props: { pIC50: 5.3, hill: 1, showData: true }, caption: 'A hERG concentration–response curve. pIC50 5.3 means IC50 ≈ 5 µM — comfortable only if the unbound plasma Cmax stays far below it.' },
    },
    {
      kind: 'explain',
      title: 'Margins, not labels',
      body: String.raw`"hERG positive" is not a verdict. What matters is the **safety margin**

$$\text{margin} = \frac{IC_{50}}{C_{\max,u}}$$

where $C_{\max,u}$ is the **unbound** peak plasma concentration at the efficacious dose — the free-drug idea from [distribution](@drug/distribution-ppb).

Redfern et al. (2003) compared hERG IC50 values with clinical free plasma levels across drug classes and found that drugs associated with arrhythmia clustered at low ratios, while safer drugs had much larger ones; they proposed aiming for a margin of **at least 30-fold** over free therapeutic exposure. The same margin logic applies to every other liability assay.`,
      widget: { type: 'SvgDiagram', props: { svg: marginSvg }, caption: 'Each bar is one liability. Here the off-target hit, at about 16-fold, is the limiting risk, even though hERG looks fine at about 300-fold.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A candidate has hERG IC50 = 9 µM. At the efficacious dose, total $C_{\max}$ is 1.5 µM and $f_u = 0.02$. What is the hERG safety margin (fold over unbound $C_{\max}$)?`,
      answer: 300,
      tolerance: 1,
      why: String.raw`$C_{\max,u} = 0.02 \times 1.5 = 0.03\ \mu$M, so the margin is $9/0.03 = 300$-fold, well above the 30-fold guide of Redfern et al. (2003). Using **total** $C_{\max}$ would give only 6-fold and wrongly condemn the compound — plasma protein binding must be taken into account.`,
    },
    {
      kind: 'explain',
      title: 'Beyond a single channel: CiPA',
      body: String.raw`A single hERG IC50 is a crude proxy, because some drugs block hERG *and* other currents in ways that partly cancel out. Verapamil is the standard example: it blocks hERG yet also blocks calcium current, and is not associated with the arrhythmia hERG block alone would predict.

The **CiPA initiative** (Comprehensive in vitro Proarrhythmia Assay), organised from 2013 by the FDA with HESI, the Cardiac Safety Research Consortium and others, replaces the single-channel view with three components:
1. patch-clamp data on **several** cardiac ion currents,
2. an **in silico** model of the human ventricular myocyte that integrates them into a predicted proarrhythmia metric, and
3. confirmation in **human stem-cell-derived cardiomyocytes** (hiPSC-CMs).

CiPA is a good illustration of mechanistic simulation entering regulatory science.`,
    },
    {
      kind: 'mcq',
      prompt: 'What is the main scientific argument for CiPA over a single hERG IC50?',
      choices: [
        'Integrating several ion currents in a myocyte model predicts the net electrophysiological effect better than one channel alone',
        'Patch clamp on hERG is too expensive to run in discovery',
        'hERG block has turned out to be irrelevant to cardiac safety',
        'Stem-cell cardiomyocytes are cheaper than computational models',
      ],
      answer: 0,
      why: 'Multi-channel blockers such as verapamil show that hERG block alone over-predicts risk: effects on calcium and late sodium currents can offset it. CiPA combines several currents in a myocyte simulation, then checks the prediction in human stem-cell cardiomyocytes. hERG remains highly relevant, and the in-silico step is the cheap part.',
    },
    {
      kind: 'explain',
      title: 'Genotoxicity: the Ames test',
      body: String.raw`The **Ames test** (Ames et al. 1973) asks whether a compound causes mutations. Strains of *Salmonella typhimurium* carry a defective histidine-synthesis gene, so they cannot grow without histidine. On histidine-free agar, only bacteria whose gene has **reverted** by mutation form colonies. A compound that raises the revertant count in a dose-dependent way is mutagenic.

Two details matter:
- the plates are run **with and without rat liver S9 fraction**, because many compounds are mutagenic only after metabolic activation;
- several strains are used, each sensitive to a different kind of mutation (base substitution or frameshift).

Structural alerts for genotoxicity (nitroaromatics, aromatic amines, epoxides, Michael acceptors, alkyl halides) are encoded in rule-based systems used under **ICH M7**, which accepts a combination of expert-rule and statistical (Q)SAR predictions for impurities.`,
      widget: { type: 'SvgDiagram', props: { svg: amesSvg }, caption: 'Colonies appear only where a mutation restored histidine synthesis. A positive result is a dose-related increase over the control.' },
    },
    {
      kind: 'truefalse',
      prompt: 'A compound that is negative in the Ames test without S9 fraction can still be positive when S9 is added.',
      answer: true,
      why: 'S9 supplies liver enzymes that convert some compounds into reactive, DNA-damaging metabolites — benzo[a]pyrene is the classic example. That is exactly why the assay is run both with and without S9.',
    },
    {
      kind: 'explain',
      title: 'Liver and general cell toxicity',
      body: String.raw`**Drug-induced liver injury (DILI)** is a leading reason for withdrawal after approval, and it is hard to predict because the severe idiosyncratic form is rare and depends on the patient as well as the drug. Discovery uses imperfect proxies:
- **cytotoxicity** in HepG2 cells or primary hepatocytes (ATP or membrane-integrity readouts);
- **mitochondrial toxicity**, often by the glucose/galactose assay, which forces cells to rely on oxidative phosphorylation;
- **reactive metabolite trapping**: incubate with microsomes plus **glutathione** and look for adducts by LC-MS;
- **bile salt export pump (BSEP) inhibition**, which is associated with cholestatic injury.

Two risk factors recur in retrospective analyses: a **daily dose of 100 mg or more** and **high lipophilicity** (logP ≥ 3); the combination is sometimes called the "rule of two" (Chen et al. 2013). ML models for DILI, trained on curated labels such as the FDA's DILIrank set, reach useful but far from decisive accuracy.`,
    },
    {
      kind: 'fill',
      prompt: 'The ___ test detects mutagenicity using bacteria that cannot make histidine; liver ___ fraction is added so that metabolically activated mutagens are caught; trapping reactive metabolites uses ___ as the nucleophile.',
      bank: ['Ames', 'Caco-2', 'S9', 'microsomal protein', 'glutathione', 'albumin'],
      answer: ['Ames', 'S9', 'glutathione'],
      why: 'S9 is the post-mitochondrial supernatant of liver homogenate (microsomes plus cytosol). Glutathione is the cell’s own soft nucleophile, so its adducts reveal electrophilic metabolites. Caco-2 is a permeability assay and albumin is a binding protein.',
    },
    {
      kind: 'explain',
      title: 'Off-target panels and selectivity',
      body: String.raw`Finally, compounds are screened against a **safety panel** of 40–100 unrelated targets: GPCRs (such as adrenergic, muscarinic, serotonin and dopamine receptors), ion channels, transporters, kinases and nuclear receptors. Bowes et al. (2012) published an industry-consensus list of about 44 such targets together with the adverse effects each is linked to.

The output is again a **margin**: hits are ranked by their IC50 relative to unbound $C_{\max}$. Promiscuity rises with **lipophilicity** and with **basicity**, which is yet another reason the logD sweet spot from the [ADMET overview](@drug/adme-tox) keeps reappearing.

Computationally, promiscuity can be anticipated by **target prediction**: similarity or ML models over bioactivity databases such as ChEMBL, and structure-based cross-docking against known off-targets.`,
    },
    {
      kind: 'match',
      prompt: 'Match each safety assay to what it detects.',
      pairs: [
        ['hERG patch clamp', 'Block of the IKr potassium current'],
        ['Ames test (± S9)', 'Mutations in bacteria, with and without metabolic activation'],
        ['Glutathione trapping', 'Formation of reactive electrophilic metabolites'],
        ['Glucose/galactose assay', 'Mitochondrial toxicity'],
        ['Bowes-style off-target panel', 'Activity at unrelated receptors, channels and enzymes'],
      ],
      why: 'Each assay probes a different mechanism: electrophysiology, DNA damage, chemical reactivity, bioenergetics and off-target pharmacology. Every one of them is interpreted against unbound exposure rather than as a yes/no label.',
    },
    {
      kind: 'order',
      prompt: 'Order these safety activities as a discovery project typically meets them, earliest first.',
      steps: [
        'Structural alerts and ML predictions (hERG, Ames, DILI) on virtual compounds',
        'Early hERG screen and cytotoxicity on synthesised compounds',
        'Ames test and off-target panel on a short list of leads',
        'Patch-clamp hERG plus reactive-metabolite work on the candidate',
        'Regulatory (GLP) toxicology and ICH S7B/E14 package before first-in-human studies',
      ],
      why: 'Computation costs nothing per molecule and comes first; plate assays triage the series; the slower, richer assays are reserved for leads; GLP studies run only on the candidate going to the clinic.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Safety is screened in discovery, not left to toxicology: ion channels, genotoxicity, liver and off-target panels.
- **hERG** block lengthens repolarisation and the **QT interval**; blockers are typically lipophilic bases. Fixes: lower pKa, lower logD, add an acid.
- Interpret every assay as a **margin over unbound $C_{\max}$**; Redfern et al. (2003) proposed a 30-fold guide for hERG.
- **CiPA** replaces the single-channel view with multi-channel data, a myocyte simulation and hiPSC-cardiomyocytes.
- **Ames ± S9** detects mutagenicity; **DILI** is approximated by cytotoxicity, mitochondrial and reactive-metabolite assays, with dose and lipophilicity as risk factors.
- Off-target promiscuity rises with lipophilicity and basicity, and can be anticipated by target-prediction models.`,
    },
  ],
  references: [
    { authors: 'Redfern, W. S., Carlsson, L., Davis, A. S., et al.', title: 'Relationships between preclinical cardiac electrophysiology, clinical QT interval prolongation and torsade de pointes for a broad range of drugs: evidence for a provisional safety margin in drug development', year: 2003, venue: 'Cardiovasc. Res. 58, 32–45' },
    { authors: 'Ames, B. N., Lee, F. D., Durston, W. E.', title: 'An improved bacterial test system for the detection and classification of mutagens and carcinogens', year: 1973, venue: 'Proc. Natl. Acad. Sci. USA 70, 782–786' },
    { authors: 'Bowes, J., Brown, A. J., Hamon, J., et al.', title: 'Reducing safety-related drug attrition: the use of in vitro pharmacological profiling', year: 2012, venue: 'Nat. Rev. Drug Discov. 11, 909–922' },
    { authors: 'Colatsky, T., Fermini, B., Gintant, G., et al.', title: 'The Comprehensive in Vitro Proarrhythmia Assay (CiPA) initiative — update on progress', year: 2016, venue: 'J. Pharmacol. Toxicol. Methods 81, 15–20' },
    { authors: 'Chen, M., Borlak, J., Tong, W.', title: 'High lipophilicity and high daily dose of oral medications are associated with significant risk for drug-induced liver injury', year: 2013, venue: 'Hepatology 58, 388–396' },
  ],
} satisfies LessonContent;
