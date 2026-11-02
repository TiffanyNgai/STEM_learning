import type { LessonContent } from '../../types';

const PHASES_SVG = String.raw`<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg" font-size="9" fill="var(--fg)">
<rect x="4" y="50" width="70" height="52" rx="8" fill="var(--c3)" fill-opacity="0.18" stroke="var(--c3)"/>
<text x="39" y="70" text-anchor="middle" font-weight="bold">Drug</text><text x="39" y="82" text-anchor="middle" font-size="8">lipophilic</text><text x="39" y="93" text-anchor="middle" font-size="8">(reabsorbed)</text>
<rect x="100" y="50" width="80" height="52" rx="8" fill="var(--c4)" fill-opacity="0.18" stroke="var(--c4)"/>
<text x="140" y="66" text-anchor="middle" font-weight="bold">Phase I</text><text x="140" y="78" text-anchor="middle" font-size="8">oxidation, reduction,</text><text x="140" y="88" text-anchor="middle" font-size="8">hydrolysis (CYP450)</text><text x="140" y="98" text-anchor="middle" font-size="7" fill="var(--c5)">adds/unmasks –OH, –NH₂</text>
<rect x="206" y="50" width="80" height="52" rx="8" fill="var(--c1)" fill-opacity="0.18" stroke="var(--c1)"/>
<text x="246" y="66" text-anchor="middle" font-weight="bold">Phase II</text><text x="246" y="78" text-anchor="middle" font-size="8">conjugation: glucuronide,</text><text x="246" y="88" text-anchor="middle" font-size="8">sulfate, acetyl, GSH</text><text x="246" y="98" text-anchor="middle" font-size="7" fill="var(--c2)">polar, usually inactive</text>
<g stroke="var(--fg)" stroke-width="1.3" fill="none"><path d="M74,76 H98"/><path d="M180,76 H204"/><path d="M286,76 Q306,76 306,110 V130"/><path d="M74,60 Q160,10 246,48" stroke-dasharray="3 2"/></g>
<text x="160" y="24" text-anchor="middle" font-size="8" fill="var(--muted)">some drugs go straight to phase II</text>
<text x="300" y="146" text-anchor="end" font-weight="bold" fill="var(--c2)">urine / bile</text>
<circle r="4" fill="var(--c3)"><animateMotion dur="4s" repeatCount="indefinite" path="M39,120 H140 H246 H306 V140"/><animate attributeName="fill" values="var(--c3);var(--c4);var(--c1);var(--c1)" keyTimes="0;0.3;0.6;1" dur="4s" repeatCount="indefinite"/></circle>
<text x="4" y="164" font-size="8" fill="var(--muted)">Goal: turn fat-soluble drug into water-soluble product the kidney can excrete.</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A glass of grapefruit juice',
      body: String.raw`A 58-year-old man on simvastatin starts drinking a large glass of grapefruit juice every morning. Three weeks later he has aching muscles and dark urine — **rhabdomyolysis**. Nothing about his dose changed. What happened?

Grapefruit juice inhibits **CYP3A4** in the gut wall, the enzyme that normally destroys much of each simvastatin dose before it reaches the blood. Less destruction → far more drug absorbed → muscle toxicity.

This lesson explains how the body chemically transforms drugs, and why the enzymes doing it are the source of many dangerous **drug interactions**.`,
    },
    {
      kind: 'explain',
      title: 'Why metabolise drugs?',
      body: String.raw`Many drugs are lipophilic (fat-loving) so they can cross membranes — but that also means the kidney tubule simply **reabsorbs** them. Metabolism, mainly in the **liver** (also gut wall, lung, kidney), makes molecules more **polar** (water-soluble) so they can be excreted in urine or bile.

- **Phase I (functionalisation)**: oxidation, reduction, hydrolysis — mostly by **cytochrome P450 (CYP)** enzymes in the smooth endoplasmic reticulum. Products may be inactive, *active*, or *toxic*.
- **Phase II (conjugation)**: attach a large polar group — glucuronidation (UGT), sulfation, acetylation (NAT), glutathione, methylation. Products are usually inactive and readily excreted.

Phase I capacity declines more with **age** and liver disease than phase II does.`,
      widget: { type: 'SvgDiagram', props: { svg: PHASES_SVG } },
    },
    {
      kind: 'fill',
      prompt: 'Cytochrome P450 enzymes mainly perform phase ___ reactions such as ___. Glucuronidation is a phase ___ reaction.',
      bank: ['I', 'II', 'oxidation', 'conjugation', 'acetylation', 'III'],
      answer: ['I', 'oxidation', 'II'],
      why: 'CYPs are mono-oxygenases: they insert one oxygen atom (oxidation/hydroxylation, dealkylation) — phase I. Glucuronidation attaches glucuronic acid, a conjugation — phase II.',
    },
    {
      kind: 'mcq',
      prompt: String.raw`**Vignette.** An 84-year-old woman with mild hepatic impairment needs a benzodiazepine for alcohol withdrawal. Which is the safest choice?`,
      choices: ['Diazepam', 'Chlordiazepoxide', 'Lorazepam', 'Flurazepam'],
      answer: 2,
      why: 'Lorazepam (like oxazepam and temazepam — "LOT") undergoes only phase II glucuronidation, which is relatively preserved in older age and liver disease, and has no active metabolites. Diazepam, chlordiazepoxide and flurazepam need phase I oxidation and form long-acting active metabolites that accumulate.',
    },
    {
      kind: 'explain',
      title: 'The CYP450 family',
      body: String.raw`CYPs are named by family–subfamily–gene, e.g. **CYP3A4**. A handful handle most drugs:
- **CYP3A4/5**: the largest share of clinically used drugs (statins, calcineurin inhibitors, many benzodiazepines, macrolides, HIV protease inhibitors, calcium-channel blockers).
- **CYP2D6**: codeine, tramadol, tamoxifen, many antidepressants and β-blockers (metoprolol). Highly polymorphic.
- **CYP2C9**: warfarin (S-isomer), phenytoin, NSAIDs, sulfonylureas.
- **CYP2C19**: clopidogrel (activation), PPIs, citalopram.
- **CYP1A2**: theophylline, caffeine, clozapine; induced by tobacco smoke.
- **CYP2E1**: ethanol, acetaminophen (to NAPQI).

A drug can be a **substrate** (metabolised by), an **inhibitor** or an **inducer** of a CYP — sometimes all three.`,
    },
    {
      kind: 'explain',
      title: 'Inducers vs inhibitors',
      body: String.raw`**Inducers** increase CYP *synthesis* (via nuclear receptors such as PXR) → substrate levels **fall** → loss of effect (e.g. contraceptive failure, transplant rejection). Onset and offset are **slow** (days to ~2 weeks, the time to make or degrade enzyme).
Classic inducers: **rifampin**, carbamazepine, phenytoin, phenobarbital, **St John's wort**, chronic alcohol, griseofulvin; smoking (CYP1A2).

**Inhibitors** block existing enzyme → substrate levels **rise** → toxicity. Onset is **fast** (hours to days).
Classic inhibitors: **clarithromycin/erythromycin**, azole antifungals (ketoconazole, itraconazole), **ritonavir**, **grapefruit juice**, amiodarone, cimetidine, diltiazem/verapamil, isoniazid; fluoxetine/paroxetine (CYP2D6).`,
      widget: {
        type: 'PKCurve',
        props: { mode: 'multiple', modes: ['multiple'], dose: 300, tau: 12, halfLife: 6, vd: 60, window: [1.5, 9], tMax: 120, yMax: 20, showLoading: false },
        caption: 'Simulate an **inhibitor**: drag t½ from 6 h to 12–18 h (clearance falls) — the steady-state level climbs out of the window. Simulate an **inducer**: drop t½ to 3 h — levels sink below it.',
      },
    },
    {
      kind: 'match',
      prompt: 'Classify each drug by its main effect on CYP enzymes.',
      pairs: [
        ['Rifampin', 'Strong inducer (CYP3A4 and others)'],
        ['Clarithromycin', 'Strong CYP3A4 inhibitor'],
        ['St John\'s wort', 'Inducer (herbal)'],
        ['Fluoxetine', 'CYP2D6 inhibitor'],
        ['Simvastatin', 'CYP3A4 substrate (narrow-margin myotoxicity)'],
      ],
      why: 'Rifampin and St John\'s wort induce; clarithromycin and fluoxetine inhibit; simvastatin is a victim drug whose levels rise with 3A4 inhibitors (rhabdomyolysis risk).',
    },
    {
      kind: 'mcq',
      prompt: String.raw`**Vignette.** A 45-year-old woman with a mechanical heart valve has had a stable INR of 2.8 on warfarin. She is diagnosed with tuberculosis and starts rifampin, isoniazid, pyrazinamide and ethambutol. Two weeks later, what change in her INR and warfarin requirement is most likely?`,
      choices: [
        'INR rises; warfarin dose should be reduced',
        'INR falls; warfarin dose will need to be increased',
        'No change; antituberculous drugs do not interact with warfarin',
        'INR rises only transiently for 24 hours',
      ],
      answer: 1,
      why: 'Rifampin is a potent inducer of CYP2C9 and 3A4, increasing warfarin clearance → lower levels → INR falls (thrombosis risk for a mechanical valve). Warfarin requirements may rise several-fold; the effect builds over ~1–2 weeks and reverses slowly after rifampin is stopped.',
    },
    {
      kind: 'explain',
      title: 'How big is an interaction?',
      body: String.raw`If a fraction $f_m$ of a drug's clearance goes through the inhibited enzyme, and the inhibitor blocks that pathway completely, exposure (AUC) rises by

$$\frac{AUC_{+inhibitor}}{AUC_{alone}} = \frac{1}{1 - f_m}$$

(roughly, for an orally given drug whose clearance is mostly hepatic). A drug cleared 50% by CYP3A4 can at most double; one cleared 95% by CYP3A4 can rise **20-fold**. That is why "sensitive substrates" (simvastatin, midazolam, lovastatin) are the dangerous victims.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['1/(1 - f*x)'], x: [0, 1], y: [0, 20], params: [{ name: 'f', min: 0.1, max: 0.97, value: 0.9, label: 'f_m (fraction via enzyme)' }],
          labels: ['AUC ratio'], xLabel: 'fraction of enzyme inhibited', yLabel: 'fold ↑ exposure',
        },
        caption: 'Exposure explodes only when both the inhibition **and** the fraction of clearance through that enzyme are high.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A drug is cleared 80% by CYP3A4 and 20% by the kidney. A strong inhibitor completely blocks CYP3A4. By roughly what factor does the drug's AUC increase?`,
      answer: 5,
      tolerance: 0.1,
      unit: '×',
      why: String.raw`Remaining clearance = 20% of the original, so AUC $= 1/(1 - 0.8) = 5$-fold. A common mistake is answering 1.8 (adding 80%) — interactions scale with the *remaining* clearance, not linearly.`,
    },
    {
      kind: 'explain',
      title: 'Prodrugs, toxic metabolites and genetics',
      body: String.raw`- **Prodrugs** need metabolism to become active: codeine → morphine (CYP2D6), clopidogrel → active thiol (CYP2C19), enalapril → enalaprilat (esterases), levodopa → dopamine, tamoxifen → endoxifen (CYP2D6). Inhibiting their CYP *reduces* effect.
- **Toxic metabolites**: acetaminophen → **NAPQI** (CYP2E1/3A4), normally neutralised by glutathione. In overdose glutathione runs out → hepatic necrosis. Antidote: **N-acetylcysteine** (replenishes glutathione).
- **Pharmacogenetics**: CYP2D6 *ultrarapid* metabolisers turn codeine into toxic morphine levels (deaths in children → FDA contraindication under 12 y); CYP2C19 poor metabolisers get little benefit from clopidogrel; **slow acetylators** (NAT2) are prone to isoniazid neuropathy and hydralazine/procainamide-induced lupus. More in [pharmacogenomics](@med/pharmacogenomics).`,
    },
    {
      kind: 'multi',
      prompt: 'Which drugs are **prodrugs** whose clinical effect depends on hepatic metabolic activation? (Select all.)',
      choices: ['Clopidogrel', 'Codeine', 'Morphine', 'Enalapril', 'Lisinopril'],
      answers: [0, 1, 3],
      why: 'Clopidogrel (CYP2C19), codeine (CYP2D6 → morphine) and enalapril (esterase → enalaprilat) are prodrugs. Morphine and lisinopril are active as given — lisinopril is useful precisely because it needs no hepatic activation.',
    },
    {
      kind: 'order',
      prompt: 'Order the events in severe acetaminophen (paracetamol) overdose.',
      steps: [
        'Glucuronidation and sulfation pathways saturate',
        'More drug is shunted to CYP2E1 → NAPQI',
        'Hepatic glutathione stores are depleted',
        'NAPQI binds hepatocyte proteins → centrilobular (zone 3) necrosis',
        'Transaminases peak and liver failure may develop at ~72–96 h',
      ],
      why: 'Toxicity follows saturation of the safe phase II pathways and glutathione depletion. Zone 3 hepatocytes have the most CYP2E1, hence centrilobular necrosis. N-acetylcysteine works best within 8–10 h of ingestion.',
    },
    {
      kind: 'truefalse',
      prompt: 'Starting a CYP inducer produces its maximal effect on substrate levels within a few hours, just like an inhibitor.',
      answer: false,
      why: 'Induction requires new enzyme synthesis via gene transcription, so it develops over days to ~2 weeks and wears off slowly after stopping. Inhibition of existing enzyme is rapid.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Metabolism makes lipophilic drugs polar for excretion. **Phase I** (CYP oxidation etc.) → **phase II** (conjugation); elderly/liver disease: phase I declines first (LOT benzodiazepines are phase II only).
- Key enzymes: **3A4** (most drugs), 2D6, 2C9, 2C19, 1A2, 2E1.
- **Inducers** (rifampin, carbamazepine, phenytoin, St John's wort) ↓ levels, slowly. **Inhibitors** (macrolides, azoles, ritonavir, grapefruit, amiodarone) ↑ levels, fast.
- Interaction size ≈ $1/(1-f_m)$ — worst for sensitive substrates.
- Prodrugs (codeine, clopidogrel) and toxic metabolites (NAPQI) make genetics and interactions cut both ways.`,
    },
  ],
  references: [
    { authors: 'Katzung BG, Vanderah TW (eds.)', title: 'Basic & Clinical Pharmacology', year: 2021, venue: '15th ed., McGraw Hill', detail: 'Ch. 4: Drug Biotransformation' },
    { authors: 'Brunton LL, Knollmann BC (eds.)', title: "Goodman & Gilman's The Pharmacological Basis of Therapeutics", year: 2023, venue: '14th ed., McGraw Hill', detail: 'Ch. 5: Drug Metabolism' },
    { authors: 'Rowland M, Tozer TN', title: 'Clinical Pharmacokinetics and Pharmacodynamics: Concepts and Applications', year: 2010, venue: '4th ed., Lippincott Williams & Wilkins', detail: 'Ch. 17: Drug Interactions' },
    { authors: 'U.S. Food and Drug Administration', title: 'Drug Development and Drug Interactions: Table of Substrates, Inhibitors and Inducers', url: 'https://www.fda.gov/drugs/drug-interactions-labeling/drug-development-and-drug-interactions-table-substrates-inhibitors-and-inducers' },
    { authors: 'Le T, Bhushan V, et al.', title: 'First Aid for the USMLE Step 1', year: 2024, venue: 'McGraw Hill', detail: 'Pharmacology: Drug metabolism; Cytochrome P-450 interactions' },
  ],
} satisfies LessonContent;
