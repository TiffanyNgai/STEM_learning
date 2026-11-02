import type { LessonContent } from '../../types';

const CONDUCTION_SVG = String.raw`<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-size="9" fill="var(--fg)">
<path d="M70,40 Q40,40 40,80 Q40,120 100,170 Q150,195 200,170 Q270,120 270,80 Q270,40 230,40 Q190,40 160,60 Q130,40 70,40 Z" fill="var(--c5)" fill-opacity="0.08" stroke="var(--c5)"/>
<line x1="150" y1="64" x2="150" y2="110" stroke="var(--muted)" stroke-dasharray="2 2"/>
<circle cx="78" cy="58" r="6" fill="var(--c3)"/><text x="88" y="54" font-weight="bold" fill="var(--c3)">SA node</text><text x="88" y="64" font-size="8" fill="var(--muted)">60–100/min</text>
<circle cx="140" cy="108" r="6" fill="var(--c4)"/><text x="64" y="112" font-weight="bold" fill="var(--c4)">AV node</text><text x="64" y="122" font-size="8" fill="var(--muted)">delay ~0.1 s</text>
<path d="M140,108 L152,122 M152,122 Q118,150 104,166 M152,122 Q190,148 214,160" stroke="var(--c2)" stroke-width="3" fill="none"/>
<text x="158" y="122" font-size="8" fill="var(--c2)">His bundle</text><text x="196" y="146" font-size="8" fill="var(--c2)">bundle branches</text>
<path d="M104,166 q10,10 24,8 M214,160 q-6,12 -24,16" stroke="var(--c1)" stroke-width="1.5" fill="none"/><text x="128" y="190" font-size="8" fill="var(--c1)">Purkinje fibres (fastest)</text>
<circle r="5" fill="var(--c5)"><animateMotion dur="2s" repeatCount="indefinite" keyPoints="0;0.25;0.55;1" keyTimes="0;0.15;0.6;1" calcMode="linear" path="M78,58 L140,108 L152,122 Q190,148 214,160"/></circle>
<text x="250" y="30" font-size="8" fill="var(--muted)">P wave: atria</text><text x="250" y="40" font-size="8" fill="var(--muted)">PR: AV delay</text><text x="250" y="50" font-size="8" fill="var(--muted)">QRS: ventricles</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The heart\'s electrical shadow',
      body: String.raw`Each heartbeat starts as an electrical wave. Because the body is a salty conductor, tiny voltages from millions of cardiac cells reach the skin, where electrodes record them: the **electrocardiogram (ECG/EKG)**.

The ECG doesn't show pumping; it shows **depolarisation** (cells becoming electrically activated, which triggers contraction) and **repolarisation** (cells resetting). When a depolarisation wave travels *toward* an electrode the trace deflects **up**; away, it deflects **down**.

It is cheap, fast and essential: arrhythmias, heart attacks, electrolyte disturbances and drug toxicity all leave fingerprints.`,
    },
    {
      kind: 'explain',
      title: 'The conduction system',
      body: String.raw`1. **SA node** (right atrium): the natural pacemaker, firing spontaneously ~60–100/min.
2. Atrial muscle conducts the impulse → **P wave**.
3. **AV node**: the only normal electrical bridge to the ventricles, with deliberately **slow** conduction (~0.1 s delay) so the atria finish emptying before the ventricles contract. It also protects the ventricles from very fast atrial rates.
4. **Bundle of His → right and left bundle branches → Purkinje fibres** (the fastest-conducting tissue) spread excitation almost simultaneously through the ventricles → narrow **QRS**.

Backup pacemakers: AV junction ~40–60/min, ventricles ~20–40/min.`,
      widget: { type: 'SvgDiagram', props: { svg: CONDUCTION_SVG } },
    },
    {
      kind: 'order',
      prompt: 'Order the normal path of cardiac excitation.',
      steps: ['SA node', 'Atrial myocardium', 'AV node', 'Bundle of His', 'Right and left bundle branches', 'Purkinje fibres → ventricular myocardium'],
      why: 'The impulse starts at the SA node, is delayed at the AV node, then races down the His–Purkinje system. Conduction speed: Purkinje > atria > ventricles > AV node ("Park At Venture Avenue").',
    },
    {
      kind: 'explain',
      title: 'Waves and intervals',
      body: String.raw`- **P wave** — atrial depolarisation.
- **PR interval** (start of P → start of QRS) — mostly AV-nodal delay. Normal **120–200 ms**.
- **QRS complex** — ventricular depolarisation. Normal **< 120 ms**. (Atrial repolarisation is hidden inside it.)
- **ST segment** — ventricles fully depolarised (plateau phase); normally flat (isoelectric).
- **T wave** — ventricular repolarisation.
- **QT interval** (start of QRS → end of T) — total ventricular depolarisation + repolarisation; shortens at fast rates, so it is corrected for rate (**QTc**; roughly > 450 ms in men, > 470 ms in women is prolonged).

**ECG paper** (25 mm/s): small box = **0.04 s**, large box (5 small) = **0.2 s**; vertically 1 small box = 0.1 mV.`,
    },
    {
      kind: 'widget',
      title: 'A live rhythm strip',
      body: 'Normal sinus rhythm: every P followed by a QRS, constant PR, regular R–R. Change the heart rate and watch the R–R distance (and the QT) shrink.',
      widget: { type: 'ECGTrace', props: { rate: 72, rhythm: 'sinus' } },
    },
    {
      kind: 'match',
      prompt: 'Match each ECG component to the electrical event.',
      pairs: [
        ['P wave', 'Atrial depolarisation'],
        ['PR interval', 'Conduction through the AV node (delay)'],
        ['QRS complex', 'Ventricular depolarisation'],
        ['T wave', 'Ventricular repolarisation'],
        ['ST segment', 'Plateau: ventricles uniformly depolarised'],
      ],
      why: 'Atrial repolarisation is not seen separately (buried in QRS). Because the ST segment represents a time when all ventricular cells are at the same potential, it is normally isoelectric — injury currents during infarction shift it.',
    },
    {
      kind: 'explain',
      title: 'Calculating heart rate',
      body: String.raw`For a **regular** rhythm count the large boxes between two consecutive R waves:

$$HR = \frac{300}{\text{large boxes}} = \frac{1500}{\text{small boxes}}$$

(because 300 large boxes = 60 s). Sequence to memorise: 1 → 300, 2 → 150, 3 → 100, 4 → 75, 5 → 60, 6 → 50.

For an **irregular** rhythm (e.g. atrial fibrillation) count the QRS complexes in a 10-s strip and multiply by 6.`,
    },
    {
      kind: 'numeric',
      prompt: 'On a regular rhythm strip the R–R interval is 20 small boxes. What is the heart rate (beats/min)?',
      answer: 75,
      tolerance: 0.5,
      unit: 'bpm',
      why: '20 small boxes × 0.04 s = 0.8 s per beat → 60/0.8 = 75/min (equivalently 1500/20, or 300/4 large boxes).',
    },
    {
      kind: 'widget',
      title: 'Five classic patterns',
      body: String.raw`Toggle the rhythms:
- **AF**: no P waves, wavy baseline, *irregularly irregular* R–R.
- **1° AV block**: PR > 200 ms, but every P conducts.
- **ST elevation**: injury current from transmural ischaemia (STEMI).
- **Hyperkalaemia**: tall peaked T, flattened P, widening QRS → can progress to sine-wave pattern and arrest.`,
      widget: { type: 'ECGTrace', props: { rate: 80, rhythm: 'afib', rhythms: ['sinus', 'afib', 'avb1', 'stemi', 'hyperk'] } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`**Vignette.** A 74-year-old woman with hypertension has 3 days of palpitations. Pulse is 128/min and irregularly irregular. ECG shows narrow QRS complexes, no discernible P waves and a fine undulating baseline. Besides rate control, which consideration is most important for preventing serious complications?`,
      choices: ['Immediate pacemaker insertion', 'Stroke prevention with anticoagulation based on CHA₂DS₂-VASc score', 'High-dose IV potassium', 'Thrombolysis'],
      answer: 1,
      why: 'This is **atrial fibrillation**. Stasis in the fibrillating left atrial appendage causes thrombi that embolise to the brain. Risk is estimated with CHA₂DS₂-VASc: she scores 3 (age 65–74, hypertension, female sex), a level at which oral anticoagulation (usually a DOAC) is recommended. Thrombolysis is for STEMI/stroke, not AF.',
    },
    {
      kind: 'explain',
      title: 'Leads and coronary territories',
      body: String.raw`A standard ECG has **12 leads** — 12 viewpoints of the same electrical event (6 limb leads in the frontal plane, 6 chest leads in the horizontal plane). ST elevation in a group of **contiguous leads** localises an infarct:

- **Inferior** (II, III, aVF) → usually **right coronary artery** (RCA). Watch for bradycardia/AV block (RCA supplies the AV node in most people) and RV infarction (avoid nitrates — preload-dependent).
- **Anterior / septal** (V1–V4) → **left anterior descending (LAD)**.
- **Lateral** (I, aVL, V5–V6) → **left circumflex** (or diagonal branches).`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`**Vignette.** A 58-year-old man has 40 minutes of crushing chest pain. BP 88/56 mmHg, HR 46/min. ECG: ST elevation in leads II, III and aVF; ST depression in I and aVL. Which artery is most likely occluded?`,
      choices: ['Left anterior descending', 'Left circumflex', 'Right coronary artery', 'Left main'],
      answer: 2,
      why: 'Inferior STEMI (II, III, aVF) with reciprocal changes in I/aVL is most often an **RCA** occlusion. Bradycardia fits ischaemia of the SA/AV nodes (RCA-supplied in most people); hypotension raises concern for RV infarction — give fluids and avoid nitrates.',
    },
    {
      kind: 'fill',
      prompt: 'A normal PR interval is ___ and a normal QRS duration is ___. A QRS of 160 ms suggests a ___.',
      bank: ['120–200 ms', '< 120 ms', '> 300 ms', 'bundle branch block', 'first-degree AV block', 'sinus tachycardia'],
      answer: ['120–200 ms', '< 120 ms', 'bundle branch block'],
      why: 'A wide QRS (≥ 120 ms) means the ventricles are depolarised slowly — via a blocked bundle branch, a ventricular origin of the beat, hyperkalaemia or sodium-channel-blocking drugs. First-degree AV block prolongs the PR, not the QRS.',
    },
    {
      kind: 'truefalse',
      prompt: 'Drugs that prolong the QT interval (e.g. sotalol, haloperidol, macrolides, methadone, ondansetron) are more likely to cause torsades de pointes when the patient also has hypokalaemia or hypomagnesaemia.',
      answer: true,
      why: 'Low K⁺ and Mg²⁺ further delay repolarisation and promote early afterdepolarisations, which trigger torsades. Check and correct electrolytes, avoid combining QT-prolonging drugs, and treat torsades with IV magnesium sulfate.',
    },
    {
      kind: 'mcq',
      prompt: String.raw`**Vignette.** A 67-year-old man with stage 5 chronic kidney disease missed two dialysis sessions. He feels weak. ECG shows tall, narrow, peaked T waves and a QRS of 140 ms. Serum K⁺ is 7.4 mmol/L. What is the **first** drug to give?`,
      choices: ['IV calcium gluconate', 'Oral sodium polystyrene sulfonate', 'IV furosemide', 'IV amiodarone'],
      answer: 0,
      why: 'With ECG changes, first **stabilise the myocardial membrane** with IV calcium (works in minutes, does not lower K⁺). Then **shift K⁺ into cells** (IV insulin + glucose, nebulised salbutamol/albuterol) and **remove K⁺** (dialysis here; binders, diuretics in others).',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Conduction: SA node → atria → **AV node (delay)** → His → bundle branches → Purkinje.
- P = atrial depolarisation; PR 120–200 ms; QRS < 120 ms; T = ventricular repolarisation; QTc prolongation → torsades risk.
- Small box 0.04 s, large box 0.2 s; HR = 300 / large boxes (regular) or QRS in 10 s × 6.
- AF: no P waves, irregularly irregular → assess stroke risk (CHA₂DS₂-VASc).
- STEMI localisation: II/III/aVF = RCA; V1–V4 = LAD; I/aVL/V5–V6 = circumflex.
- Hyperkalaemia: peaked T → wide QRS → give IV calcium first.`,
    },
  ],
  references: [
    { authors: 'Hall JE, Hall ME', title: 'Guyton and Hall Textbook of Medical Physiology', year: 2021, venue: '14th ed., Elsevier', detail: 'Ch. 10–13: Rhythmical excitation of the heart; The normal electrocardiogram; ECG interpretation' },
    { authors: 'Le T, Bhushan V, et al.', title: 'First Aid for the USMLE Step 1', year: 2024, venue: 'McGraw Hill', detail: 'Cardiovascular: Electrocardiogram; Arrhythmias' },
    { authors: 'Loscalzo J, Fauci AS, Kasper DL, et al. (eds.)', title: "Harrison's Principles of Internal Medicine", year: 2022, venue: '21st ed., McGraw Hill', detail: 'Chapter on Electrocardiography' },
    { authors: 'Joglar JA, Chung MK, Armbruster AL, et al.', title: '2023 ACC/AHA/ACCP/HRS Guideline for the Diagnosis and Management of Atrial Fibrillation', year: 2024, venue: 'Circulation 149(1):e1–e156' },
  ],
} satisfies LessonContent;
