import type { LessonContent } from '../../types';

const RAAS_SVG = String.raw`<svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg" font-size="9" fill="var(--fg)">
<text x="6" y="14" font-weight="bold">↓ renal perfusion · ↓ NaCl at macula densa · β₁ stimulation</text>
<g font-size="9">
<rect x="6" y="24" width="96" height="22" rx="5" fill="var(--c3)" fill-opacity="0.18" stroke="var(--c3)"/><text x="54" y="39" text-anchor="middle">Angiotensinogen</text>
<rect x="124" y="24" width="80" height="22" rx="5" fill="var(--c3)" fill-opacity="0.18" stroke="var(--c3)"/><text x="164" y="39" text-anchor="middle">Angiotensin I</text>
<rect x="226" y="24" width="88" height="22" rx="5" fill="var(--c5)" fill-opacity="0.2" stroke="var(--c5)"/><text x="270" y="39" text-anchor="middle" font-weight="bold">Angiotensin II</text>
</g>
<g stroke="var(--fg)" fill="none" stroke-width="1.2"><path d="M102,35 H122"/><path d="M204,35 H224"/><path d="M270,46 V62"/></g>
<text x="112" y="58" text-anchor="middle" font-size="8">renin</text><text x="112" y="68" text-anchor="middle" font-size="8" fill="var(--c5)">✕ aliskiren</text>
<text x="214" y="58" text-anchor="middle" font-size="8">ACE (lung)</text><text x="214" y="68" text-anchor="middle" font-size="8" fill="var(--c5)">✕ ACE inhibitors</text>
<text x="270" y="74" text-anchor="middle" font-size="8">AT₁ receptor</text><text x="270" y="84" text-anchor="middle" font-size="8" fill="var(--c5)">✕ ARBs (-sartans)</text>
<g font-size="8">
<rect x="6" y="96" width="150" height="104" rx="6" fill="var(--c2)" fill-opacity="0.08" stroke="var(--c2)"/>
<text x="12" y="110" font-weight="bold" fill="var(--c2)">Angiotensin II effects</text>
<text x="12" y="124">• arteriolar vasoconstriction (↑ TPR)</text>
<text x="12" y="136">• adrenal: ↑ aldosterone</text>
<text x="12" y="148">• posterior pituitary: ↑ ADH, thirst</text>
<text x="12" y="160">• efferent arteriole constriction</text><text x="20" y="170">(maintains GFR)</text>
<text x="12" y="182">• ↑ PCT Na⁺ reabsorption</text>
<text x="12" y="194">• ↑ sympathetic activity</text>
<rect x="166" y="104" width="148" height="56" rx="6" fill="var(--c1)" fill-opacity="0.08" stroke="var(--c1)"/>
<text x="172" y="118" font-weight="bold" fill="var(--c1)">Aldosterone (collecting duct)</text>
<text x="172" y="132">↑ Na⁺ (and water) retention,</text><text x="172" y="144">↑ K⁺ and H⁺ secretion</text>
<text x="172" y="156" fill="var(--c5)">✕ spironolactone, eplerenone</text>
<text x="172" y="182" font-weight="bold">Net: ↑ blood volume + ↑ TPR</text><text x="172" y="194">→ ↑ blood pressure</text>
</g>
<path d="M270,86 V100" stroke="var(--fg)"/>
<circle r="3.5" fill="var(--c5)"><animateMotion dur="3s" repeatCount="indefinite" path="M20,35 H270 V100"/></circle>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Why you don\'t faint when you stand up',
      body: String.raw`Stand up quickly and ~500 mL of blood pools in your legs. Venous return, stroke volume and blood pressure dip — yet within seconds you feel fine. A fast **neural reflex** fixed it.

Over days, however, blood pressure is set by something slower: how much **salt and water the kidneys keep**.

This lesson covers both timescales — and the drug classes that exploit them.`,
    },
    {
      kind: 'explain',
      title: 'The master equation',
      body: String.raw`Blood flow obeys a version of Ohm's law ($\Delta P = Q \times R$). For the whole systemic circulation:

$$MAP = CO \times TPR \quad (\text{right-atrial pressure} \approx 0)$$

- **MAP**: mean arterial pressure — the average driving pressure. At normal heart rates $MAP \approx DBP + \tfrac{1}{3}(SBP - DBP)$, because the heart spends ~2/3 of each cycle in diastole.
- **CO**: cardiac output ($HR \times SV$).
- **TPR**: total peripheral resistance, set mainly by **arterioles** — the "resistance vessels".

Every antihypertensive lowers CO, TPR, or both.`,
    },
    {
      kind: 'numeric',
      prompt: 'A patient\'s blood pressure is 150/90 mmHg. Estimate the mean arterial pressure (mmHg).',
      answer: 110,
      tolerance: 0.5,
      unit: 'mmHg',
      why: 'Pulse pressure = 150 − 90 = 60. MAP ≈ 90 + 60/3 = 110 mmHg. Simply averaging (120) overestimates because more time is spent in diastole.',
    },
    {
      kind: 'explain',
      title: 'Radius rules resistance',
      body: String.raw`For laminar flow in a tube, **Poiseuille's law** gives

$$R = \frac{8 \eta L}{\pi r^4}$$

($\eta$ = blood viscosity, $L$ = vessel length, $r$ = radius). Because of the **fourth power**, small changes in arteriolar radius cause huge changes in resistance: halving the radius raises resistance **16-fold**.

That is why sympathetic α₁ tone, angiotensin II and local metabolites — all of which change arteriolar diameter — dominate pressure and flow control. Viscosity matters too: polycythaemia raises resistance; anaemia lowers it.`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['1/x^4'], x: [0.4, 1.2], y: [0, 20], xLabel: 'radius (× normal)', yLabel: 'resistance (× normal)', labels: ['R ∝ 1/r⁴'] },
        caption: 'At r = 0.5 the curve reads 16; at r = 0.8 already ≈ 2.4 — a 20% narrowing more than doubles resistance.',
      },
    },
    {
      kind: 'numeric',
      prompt: 'An arteriole constricts so that its radius falls to 80% of baseline. By what factor does its resistance increase? (2 decimal places)',
      answer: 2.44,
      tolerance: 0.02,
      unit: '×',
      why: String.raw`$R \propto 1/r^4$: $1/0.8^4 = 1/0.4096 \approx 2.44$. Answering 1.25 assumes resistance ∝ 1/r — the fourth power is the whole point.`,
    },
    {
      kind: 'explain',
      title: 'Seconds: the baroreceptor reflex',
      body: String.raw`Stretch receptors in the **carotid sinus** (afferents via CN IX, glossopharyngeal) and **aortic arch** (CN X, vagus) fire faster as arterial pressure rises. Their signals go to the **nucleus tractus solitarius** in the medulla, which adjusts autonomic output:

- **BP falls** → less baroreceptor firing → ↑ sympathetic (↑HR, ↑contractility, ↑venous tone, arteriolar constriction via α₁) and ↓ vagal tone → BP restored.
- **BP rises** → more firing → ↑ vagal, ↓ sympathetic.

The reflex is a **negative-feedback** loop. It buffers moment-to-moment changes but **resets** to a new level within days in sustained hypertension — so it doesn't set long-term pressure.`,
    },
    {
      kind: 'widget',
      title: 'Standing up: reflex gain',
      body: 'MAP after a sudden 25-mmHg drop on standing. Turn the **reflex gain** down to 0 to model **autonomic failure** (e.g. diabetic or Parkinsonian autonomic neuropathy, or high-dose α₁-blockers): the pressure stays low → **orthostatic hypotension**.',
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['93 - 25/(1+G) - (25 - 25/(1+G))*exp(-x/3)', '93 + 0*x'],
          x: [0, 20], y: [60, 100], params: [{ name: 'G', min: 0, max: 10, value: 6, label: 'baroreflex gain' }],
          labels: ['MAP after standing', 'baseline'], xLabel: 'seconds after standing', yLabel: 'MAP (mmHg)',
        },
        caption: 'Negative feedback with gain G leaves a residual error of drop/(1+G): high gain → near-complete correction.',
      },
    },
    {
      kind: 'order',
      prompt: 'Order the baroreflex response when a person stands up quickly.',
      steps: [
        'Blood pools in leg veins; venous return falls',
        'Stroke volume and arterial pressure fall',
        'Carotid sinus stretch and CN IX firing decrease',
        'Medulla increases sympathetic and reduces vagal outflow',
        'Heart rate, contractility and arteriolar tone rise; BP recovers',
      ],
      why: 'Lower preload → lower SV (Frank–Starling) → lower MAP → less stretch → reflex sympathetic activation. Orthostatic hypotension is defined as a fall of ≥ 20 mmHg systolic or ≥ 10 mmHg diastolic within 3 minutes of standing.',
    },
    {
      kind: 'explain',
      title: 'Days to weeks: the kidney and RAAS',
      body: String.raw`Long-term blood pressure is set by **blood volume**, which the kidney controls through sodium balance (**pressure natriuresis**: higher pressure → more Na⁺ and water excreted).

When the kidney senses low perfusion (or low NaCl at the macula densa, or β₁ stimulation), juxtaglomerular cells release **renin** → the **renin–angiotensin–aldosterone system (RAAS)** retains salt and water and constricts vessels.

Counter-regulators: **natriuretic peptides** (ANP from atria, BNP from ventricles, released by stretch) cause natriuresis and vasodilation. **ADH** (vasopressin) retains water (V₂) and, at high levels, constricts vessels (V₁).`,
      widget: { type: 'SvgDiagram', props: { svg: RAAS_SVG } },
    },
    {
      kind: 'multi',
      prompt: 'Which are actions of **angiotensin II**? (Select all.)',
      choices: [
        'Constriction of the glomerular efferent arteriole',
        'Stimulation of aldosterone release from the zona glomerulosa',
        'Inhibition of ADH release',
        'Systemic arteriolar vasoconstriction',
        'Increased Na⁺ reabsorption in the proximal tubule',
      ],
      answers: [0, 1, 3, 4],
      why: 'Angiotensin II raises pressure through vasoconstriction, aldosterone, proximal Na⁺ reabsorption, thirst and **increased** (not decreased) ADH. Efferent constriction keeps GFR up when renal perfusion is low.',
    },
    {
      kind: 'match',
      prompt: 'Match each drug to its site of action in the RAAS.',
      pairs: [
        ['Lisinopril', 'Angiotensin-converting enzyme'],
        ['Losartan', 'AT₁ receptor'],
        ['Aliskiren', 'Renin'],
        ['Spironolactone', 'Mineralocorticoid (aldosterone) receptor'],
      ],
      why: '-prils inhibit ACE; -sartans block AT₁; aliskiren is a direct renin inhibitor; spironolactone and eplerenone antagonise aldosterone (K⁺-sparing diuretics).',
    },
    {
      kind: 'mcq',
      prompt: String.raw`**Vignette.** A 56-year-old woman started on lisinopril for hypertension returns 6 weeks later with a persistent dry, non-productive cough. Chest exam and X-ray are normal. Which mechanism explains the cough, and what is the best switch?`,
      choices: [
        'Angiotensin II accumulation in the lung; switch to aliskiren',
        'Bradykinin accumulation from inhibited ACE (kininase II); switch to an ARB such as losartan',
        'β₂ blockade causing bronchospasm; switch to a thiazide',
        'Hyperkalaemia; switch to spironolactone',
      ],
      answer: 1,
      why: 'ACE also degrades **bradykinin**; inhibiting it lets bradykinin accumulate → cough (and rarely **angioedema**). ARBs block AT₁ without affecting bradykinin breakdown, so cough is rare.',
    },
    {
      kind: 'mcq',
      prompt: String.raw`**Vignette.** A 72-year-old smoker with peripheral arterial disease and an abdominal bruit starts ramipril. One week later serum creatinine has risen from 1.1 to 2.3 mg/dL. What is the most likely explanation?`,
      choices: [
        'ACE-inhibitor–induced allergic interstitial nephritis',
        'Bilateral renal artery stenosis: GFR depended on angiotensin II–mediated efferent arteriolar constriction',
        'Rhabdomyolysis',
        'Hyperaldosteronism',
      ],
      answer: 1,
      why: 'With fixed narrowing of both renal arteries, glomerular pressure is maintained by Ang II constricting the **efferent** arteriole. Blocking Ang II dilates it → GFR falls sharply. A rise in creatinine > 30% after starting an ACEi/ARB warrants evaluation for renovascular disease.',
    },
    {
      kind: 'truefalse',
      prompt: 'The baroreceptor reflex is the main determinant of a person\'s blood pressure level over weeks to months.',
      answer: false,
      why: 'Baroreceptors reset to a sustained pressure within days. Long-term pressure is governed by renal sodium and water handling (pressure natriuresis, RAAS) — which is why diuretics and RAAS blockers are cornerstones of hypertension treatment.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $MAP = CO \times TPR$; $MAP \approx DBP + \tfrac13$ pulse pressure.
- Poiseuille: $R \propto 1/r^4$ — arterioles control resistance.
- **Short term**: baroreflex (carotid sinus CN IX, aortic arch CN X → medulla → autonomic outflow). Failure → orthostatic hypotension.
- **Long term**: kidney sets volume via pressure natriuresis and **RAAS**; ANP/BNP oppose it.
- Drugs: ACE inhibitors (bradykinin cough/angioedema), ARBs, aliskiren, aldosterone antagonists. Beware ACEi/ARB in bilateral renal artery stenosis.`,
    },
  ],
  references: [
    { authors: 'Hall JE, Hall ME', title: 'Guyton and Hall Textbook of Medical Physiology', year: 2021, venue: '14th ed., Elsevier', detail: 'Ch. 14, 18–19: Overview of the circulation; Nervous regulation of the circulation; Role of the kidneys in long-term control of arterial pressure' },
    { authors: 'Costanzo LS', title: 'Physiology', year: 2022, venue: '7th ed., Elsevier', detail: 'Ch. 4: Cardiovascular Physiology (regulation of arterial pressure)' },
    { authors: 'Katzung BG, Vanderah TW (eds.)', title: 'Basic & Clinical Pharmacology', year: 2021, venue: '15th ed., McGraw Hill', detail: 'Ch. 11: Antihypertensive Agents' },
    { authors: 'Le T, Bhushan V, et al.', title: 'First Aid for the USMLE Step 1', year: 2024, venue: 'McGraw Hill', detail: 'Cardiovascular: Physiology; Renal: Renin–angiotensin–aldosterone system' },
  ],
} satisfies LessonContent;
