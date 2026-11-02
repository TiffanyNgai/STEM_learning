import type { LessonContent } from '../../types';

const SV_SVG = String.raw`<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg" font-size="9" fill="var(--fg)">
<text x="160" y="14" text-anchor="middle" font-weight="bold">Three dials set stroke volume</text>
<g transform="translate(55,80)"><circle r="34" fill="var(--c2)" fill-opacity="0.12" stroke="var(--c2)"/><line x1="0" y1="0" x2="0" y2="-26" stroke="var(--c2)" stroke-width="3" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" values="-50;50;-50" dur="5s" repeatCount="indefinite"/></line><text y="48" text-anchor="middle" font-weight="bold" fill="var(--c2)">Preload</text><text y="60" text-anchor="middle" font-size="8">stretch before contraction</text><text y="70" text-anchor="middle" font-size="8">(≈ EDV) ↑ → SV ↑</text></g>
<g transform="translate(160,80)"><circle r="34" fill="var(--c5)" fill-opacity="0.12" stroke="var(--c5)"/><line x1="0" y1="0" x2="0" y2="-26" stroke="var(--c5)" stroke-width="3" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" values="40;-40;40" dur="6s" repeatCount="indefinite"/></line><text y="48" text-anchor="middle" font-weight="bold" fill="var(--c5)">Afterload</text><text y="60" text-anchor="middle" font-size="8">load to eject against</text><text y="70" text-anchor="middle" font-size="8">(≈ aortic pressure) ↑ → SV ↓</text></g>
<g transform="translate(265,80)"><circle r="34" fill="var(--c1)" fill-opacity="0.12" stroke="var(--c1)"/><line x1="0" y1="0" x2="0" y2="-26" stroke="var(--c1)" stroke-width="3" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" values="-30;60;-30" dur="4s" repeatCount="indefinite"/></line><text y="48" text-anchor="middle" font-weight="bold" fill="var(--c1)">Contractility</text><text y="60" text-anchor="middle" font-size="8">intrinsic strength</text><text y="70" text-anchor="middle" font-size="8">(inotropy) ↑ → SV ↑</text></g>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The heart as a pump',
      body: String.raw`At rest your heart moves about **5 litres of blood per minute** — your whole blood volume, every minute. That flow is the **cardiac output (CO)**:

$$CO = HR \times SV$$

- **HR**: heart rate (beats/min), ~60–100 at rest.
- **SV**: stroke volume (mL per beat) = $EDV - ESV$, the difference between the volume in the left ventricle at the **end of diastole** (filling) and the **end of systole** (ejection).
- **Ejection fraction** $EF = SV/EDV$ — normally ≥ ~55%; ≤ 40% defines heart failure with *reduced* EF.

Example: HR 70 × SV 70 mL = 4.9 L/min.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Echocardiography shows LV end-diastolic volume 150 mL and end-systolic volume 105 mL. What is the ejection fraction (%)?`,
      answer: 30,
      tolerance: 0.5,
      unit: '%',
      why: String.raw`$SV = 150 - 105 = 45$ mL; $EF = 45/150 = 0.30$ = 30% — markedly reduced (normal ≥ 55%). Dividing by ESV instead of EDV (43%) is the classic slip.`,
    },
    {
      kind: 'explain',
      title: 'Preload, afterload, contractility',
      body: String.raw`Stroke volume is set by three factors. Picture a rubber band slingshot:
- **Preload** — how far you pull the band back before release: the ventricular wall stretch at end-diastole, approximated by **EDV** (or LV end-diastolic pressure). ↑ venous return, ↑ blood volume → ↑ preload.
- **Afterload** — the weight you're trying to fling: the load the ventricle must overcome to eject, approximated by **aortic pressure / systemic vascular resistance**. ↑ in hypertension and aortic stenosis.
- **Contractility (inotropy)** — the strength of the band itself, *independent* of stretch. ↑ by sympathetic stimulation (β₁), digoxin; ↓ by β-blockers, non-dihydropyridine calcium-channel blockers, acidosis, hypoxia, ischaemia and heart failure.`,
      widget: { type: 'SvgDiagram', props: { svg: SV_SVG } },
    },
    {
      kind: 'explain',
      title: 'The Frank–Starling law',
      body: String.raw`"The more the heart fills, the harder it contracts." Stretching cardiac sarcomeres toward their optimal length increases actin–myosin overlap and the troponin's Ca²⁺ sensitivity, so force rises with **EDV**.

This automatically matches the output of the **two ventricles**: if the right ventricle briefly pumps more, the left fills more and ejects more on the next beats.

Changing **contractility** moves you to a *different* Starling curve (up = positive inotropy). Heart failure flattens the curve: extra filling raises pressures (congestion) but adds little stroke volume.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['100*(1-exp(-(x-5)/12))', 'c*100*(1-exp(-(x-5)/12))'],
          x: [0, 40], y: [0, 160], params: [{ name: 'c', min: 0.3, max: 1.6, value: 0.5, label: 'contractility (×normal)' }],
          labels: ['normal', 'altered contractility'], xLabel: 'LV end-diastolic pressure (preload)', yLabel: 'stroke volume',
        },
        caption: 'Move along a curve = change in **preload**. Jump between curves = change in **contractility** (try 0.5 for systolic heart failure, 1.5 for a sympathetic surge/inotrope).',
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`**Vignette.** A 25-year-old man loses 1 L of blood after a stab wound. Before any compensation, which change is the main *direct* cause of his fall in stroke volume?`,
      choices: ['Increased afterload', 'Decreased preload', 'Decreased contractility', 'Increased heart rate'],
      answer: 1,
      why: 'Haemorrhage reduces venous return → lower EDV (preload) → by Frank–Starling, lower SV. Contractility and HR actually *increase* as baroreflex compensation; afterload is not the primary problem.',
    },
    {
      kind: 'widget',
      title: 'Stroke volume on the pressure–volume loop',
      body: 'Switch to **P–V loop**. The loop\'s **width** is the stroke volume (EDV − ESV); the bottom-right corner is end-diastole (preload), the top-left is end-systole. You\'ll study every segment in the next lesson.',
      widget: { type: 'HeartCycle', props: { view: 'pv' } },
    },
    {
      kind: 'match',
      prompt: 'Match each intervention (other factors constant) to its main effect on the LV pressure–volume loop.',
      pairs: [
        ['Rapid IV fluid bolus', '↑ EDV (loop widens to the right), ↑ SV'],
        ['Acute rise in aortic pressure (vasoconstrictor)', 'Taller loop, ↑ ESV, ↓ SV'],
        ['Dobutamine (β₁ agonist)', '↓ ESV (loop extends left), ↑ SV'],
        ['Acute MI with loss of contracting muscle', '↑ ESV and ↓ SV; EDV rises over time'],
      ],
      why: 'Preload changes the right edge (EDV). Afterload raises the pressure at which the aortic valve opens and the ventricle stops ejecting at a larger ESV. Contractility shifts the end-systolic pressure–volume line up and left (smaller ESV); loss of contractility does the opposite.',
    },
    {
      kind: 'explain',
      title: 'Afterload and wall stress',
      body: String.raw`The ventricle "feels" afterload as **wall stress**. By the **law of Laplace** (thin-walled sphere):

$$\sigma = \frac{P \times r}{2h}$$

where $P$ is intraventricular pressure, $r$ the chamber radius and $h$ the wall thickness.

- Chronic pressure overload (hypertension, aortic stenosis) → **concentric hypertrophy**: thicker wall ($h$ ↑) normalises stress — at the cost of stiffness.
- A dilated ventricle ($r$ ↑) has higher wall stress at the same pressure → greater **myocardial O₂ demand**.

Myocardial O₂ demand rises with **heart rate, contractility, afterload (wall tension) and preload** — the targets of anti-anginal drugs.`,
    },
    {
      kind: 'explain',
      title: 'Measuring cardiac output: the Fick principle',
      body: String.raw`Mass balance: the oxygen taken up by the body each minute must equal blood flow × the O₂ extracted from each litre of blood.

$$CO = \frac{\dot V_{O_2}}{C_{aO_2} - C_{vO_2}}$$

where $\dot V_{O_2}$ is whole-body O₂ consumption (mL/min), $C_{aO_2}$ arterial and $C_{vO_2}$ mixed-venous (pulmonary artery) O₂ content (mL O₂ per L blood).

Example: $\dot V_{O_2} = 250$ mL/min, arterial 200 mL/L, mixed venous 150 mL/L → CO = 250/50 = **5 L/min**.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A patient consumes 300 mL O₂/min. Arterial O₂ content is 190 mL/L and pulmonary-artery O₂ content is 130 mL/L. Calculate cardiac output (L/min).`,
      answer: 5,
      tolerance: 0.05,
      unit: 'L/min',
      why: String.raw`$CO = 300 / (190 - 130) = 300/60 = 5$ L/min. A *low* mixed-venous O₂ content means tissues are extracting more per litre — a sign of low cardiac output.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Because CO = HR × SV, cardiac output keeps rising linearly however fast the heart beats.',
      answer: false,
      why: 'Diastole shortens far more than systole as HR rises. Above ~150–180/min (lower in diseased hearts) filling time is too short, EDV and SV fall, and CO drops — one reason very fast tachyarrhythmias cause hypotension.',
    },
    {
      kind: 'multi',
      prompt: String.raw`**Vignette.** A 70-year-old with stable angina is started on metoprolol (β₁-selective blocker). Which effects reduce his myocardial O₂ demand? (Select all.)`,
      choices: ['Lower heart rate', 'Lower contractility', 'Longer diastole, improving coronary perfusion time', 'Increased preload from slower HR'],
      answers: [0, 1],
      why: 'β₁ blockade lowers HR and contractility — two major determinants of O₂ demand. Longer diastole improves O₂ *supply* (coronary flow happens mainly in diastole), not demand. Slightly increased EDV actually raises wall tension (a small offsetting effect), which is why β-blockers are often paired with nitrates.',
    },
    {
      kind: 'fill',
      prompt: 'Stroke volume rises when the ventricle is stretched more before contracting (increased ___), and when it squeezes harder at the same stretch (increased ___); it falls when the ventricle must eject against more load (increased ___).',
      bank: ['preload', 'contractility', 'afterload', 'heart rate', 'ESV'],
      answer: ['preload', 'contractility', 'afterload'],
      why: 'Preload (Frank–Starling) and contractility (inotropy) increase SV; afterload opposes ejection, leaving a larger ESV.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $CO = HR \times SV$ (~5 L/min); $SV = EDV - ESV$; $EF = SV/EDV$ (normal ≥ 55%).
- SV is set by **preload** (EDV, Frank–Starling), **afterload** (aortic pressure / wall stress) and **contractility**.
- Frank–Starling: more filling → more force; inotropes shift to a higher curve; heart failure flattens it.
- Laplace: $\sigma = Pr/2h$ — hypertrophy normalises wall stress; dilation raises O₂ demand.
- Fick: $CO = \dot V_{O_2}/(C_a - C_v)$.`,
    },
  ],
  references: [
    { authors: 'Hall JE, Hall ME', title: 'Guyton and Hall Textbook of Medical Physiology', year: 2021, venue: '14th ed., Elsevier', detail: 'Ch. 9: Cardiac Muscle; The Heart as a Pump; Ch. 20: Cardiac Output, Venous Return, and Their Regulation' },
    { authors: 'Costanzo LS', title: 'Physiology', year: 2022, venue: '7th ed., Elsevier', detail: 'Ch. 4: Cardiovascular Physiology' },
    { authors: 'Le T, Bhushan V, et al.', title: 'First Aid for the USMLE Step 1', year: 2024, venue: 'McGraw Hill', detail: 'Cardiovascular: Physiology' },
    { authors: 'Klabunde RE', title: 'Cardiovascular Physiology Concepts', year: 2021, venue: '3rd ed., Wolters Kluwer' },
  ],
} satisfies LessonContent;
