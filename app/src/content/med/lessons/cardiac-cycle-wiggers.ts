import type { LessonContent } from '../../types';

const PV_SVG = String.raw`<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" font-size="9" fill="var(--fg)">
<line x1="40" y1="170" x2="310" y2="170" stroke="var(--fg)"/><line x1="40" y1="170" x2="40" y2="10" stroke="var(--fg)"/>
<text x="308" y="183" text-anchor="end" font-size="8">LV volume →</text><text x="44" y="16" font-size="8">LV pressure</text>
<path d="M110,160 Q180,166 250,156 L250,80 Q230,30 180,28 Q130,30 110,62 Z" fill="var(--c2)" fill-opacity="0.08" stroke="var(--c2)" stroke-width="2"/>
<circle cx="110" cy="160" r="3.5" fill="var(--c3)"/><text x="96" y="176" font-size="8" fill="var(--c3)">A mitral opens</text>
<circle cx="250" cy="156" r="3.5" fill="var(--c5)"/><text x="254" y="166" font-size="8" fill="var(--c5)">B mitral closes (EDV)</text>
<circle cx="250" cy="80" r="3.5" fill="var(--c1)"/><text x="254" y="80" font-size="8" fill="var(--c1)">C aortic opens</text>
<circle cx="110" cy="62" r="3.5" fill="var(--c4)"/><text x="50" y="56" font-size="8" fill="var(--c4)">D aortic</text><text x="50" y="66" font-size="8" fill="var(--c4)">closes (ESV)</text>
<text x="180" y="152" text-anchor="middle" font-size="8">1 filling</text>
<text x="244" y="120" text-anchor="end" font-size="8">2 isovol.</text><text x="244" y="130" text-anchor="end" font-size="8">contraction</text>
<text x="180" y="44" text-anchor="middle" font-size="8">3 ejection</text>
<text x="116" y="110" font-size="8">4 isovol.</text><text x="116" y="120" font-size="8">relaxation</text>
<circle r="4" fill="var(--c5)"><animateMotion dur="4s" repeatCount="indefinite" path="M110,160 Q180,166 250,156 L250,80 Q230,30 180,28 Q130,30 110,62 Z"/></circle>
<line x1="110" y1="182" x2="250" y2="182" stroke="var(--muted)"/><text x="180" y="189" text-anchor="middle" font-size="7" fill="var(--muted)">width = stroke volume</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: '"Lub-dub": one heartbeat in slow motion',
      body: String.raw`Put a stethoscope on a chest and you hear **lub-dub**. Those sounds are **valves snapping shut** — and they bracket the two halves of the cardiac cycle:
- **Systole** (contraction): from S1 ("lub") to S2 ("dub").
- **Diastole** (relaxation and filling): from S2 to the next S1.

The rule that governs every valve: **blood (and valve leaflets) move from higher to lower pressure.** A valve opens when the pressure behind it exceeds the pressure ahead, and closes when that reverses. Keep that rule in mind and the whole Wiggers diagram becomes logic, not memorisation.`,
    },
    {
      kind: 'explain',
      title: 'Seven phases, four valve events',
      body: String.raw`For the left heart (the right is the same at lower pressures):
1. **Atrial systole** — atrium contracts, topping up the ventricle (~10–20% of filling at rest).
2. **Isovolumetric contraction** — LV pressure rises above LA → **mitral closes (S1)**; both valves shut, volume constant.
3. **Rapid ejection** — LV pressure exceeds aortic → **aortic valve opens**.
4. **Reduced ejection** — flow tapers as the ventricle starts to relax.
5. **Isovolumetric relaxation** — LV pressure drops below aortic → **aortic closes (S2)**; dicrotic notch on the aortic trace.
6. **Rapid filling** — LV pressure falls below LA → **mitral opens**; blood rushes in.
7. **Diastasis** — slow filling until the next atrial contraction.`,
    },
    {
      kind: 'widget',
      title: 'The Wiggers diagram, live',
      body: 'Watch the cursor sweep across the traces while the valves open (green) and close (red). Shaded bands are the **isovolumetric** phases — volume (teal) is flat there because both valves are shut. Pause and check: each valve event is exactly where two pressure traces cross.',
      widget: { type: 'HeartCycle', props: { view: 'wiggers', speed: 0.3 } },
    },
    {
      kind: 'order',
      prompt: 'Starting at the end of diastole, put the left-heart events in order.',
      steps: [
        'Mitral valve closes (S1)',
        'Isovolumetric contraction',
        'Aortic valve opens',
        'Ventricular ejection',
        'Aortic valve closes (S2)',
        'Isovolumetric relaxation',
        'Mitral valve opens and rapid filling begins',
      ],
      why: 'Valves close and open at the moments pressures cross. The two isovolumetric phases sit between a closing and an opening event, when all valves are shut.',
    },
    {
      kind: 'mcq',
      prompt: 'During isovolumetric contraction, which statement is true?',
      choices: [
        'LV pressure is below left atrial pressure',
        'The aortic valve is open but the mitral valve is closed',
        'LV pressure is rising while LV volume is constant',
        'Coronary flow to the LV is at its maximum',
      ],
      answer: 2,
      why: 'Both mitral and aortic valves are closed, so volume cannot change while pressure climbs from ~8 to ~80 mmHg. LV coronary flow is actually at its *lowest* during systole because contracting muscle compresses intramyocardial vessels.',
    },
    {
      kind: 'explain',
      title: 'The pressure–volume loop',
      body: String.raw`Plot LV pressure against LV volume for one beat and you get a loop that runs **anticlockwise**:
- **A → B, filling** (mitral open): volume rises at low pressure up to **EDV**.
- **B → C, isovolumetric contraction**: vertical line up.
- **C → D, ejection** (aortic open): volume falls to **ESV**.
- **D → A, isovolumetric relaxation**: vertical line down.

Width = **stroke volume**; area ≈ **stroke work**. The loop is a compact way to show changes in preload (right edge), afterload (height of C–D) and contractility (where D lands).`,
      widget: { type: 'SvgDiagram', props: { svg: PV_SVG } },
    },
    {
      kind: 'match',
      prompt: 'Match each corner of the LV pressure–volume loop to its valve event.',
      pairs: [
        ['Bottom-left corner (minimum volume, low pressure)', 'Mitral valve opens'],
        ['Bottom-right corner (EDV)', 'Mitral valve closes'],
        ['Top-right corner (start of volume fall)', 'Aortic valve opens'],
        ['Top-left corner (ESV)', 'Aortic valve closes'],
      ],
      why: 'Filling runs left → right along the bottom (mitral open), ejection right → left along the top (aortic open). Each corner is where one valve shuts and the other later opens.',
    },
    {
      kind: 'explain',
      title: 'Atrial and jugular venous waves',
      body: String.raw`Atrial (and jugular venous) pressure shows three positive waves:
- **a wave** — atrial contraction. Absent in **atrial fibrillation**; giant "cannon" a waves when the atrium contracts against a closed tricuspid valve (complete heart block).
- **c wave** — tricuspid valve bulges into the atrium during isovolumetric contraction.
- **x descent** — atrial relaxation and descent of the valve ring during ejection.
- **v wave** — venous filling of the atrium while the tricuspid is closed. Large in **tricuspid regurgitation**.
- **y descent** — atrium empties when the tricuspid opens. Steep in constrictive pericarditis; blunted in tamponade.`,
    },
    {
      kind: 'match',
      prompt: 'Match each jugular venous pulse finding to its cause.',
      pairs: [
        ['No a waves', 'Atrial fibrillation'],
        ['Cannon a waves', 'Complete (third-degree) heart block'],
        ['Giant v waves', 'Tricuspid regurgitation'],
        ['Absent y descent', 'Cardiac tamponade'],
      ],
      why: 'No coordinated atrial contraction in AF → no a wave. AV dissociation makes the atrium sometimes contract against a closed valve. Regurgitant flow fills the atrium during systole. In tamponade, pericardial fluid prevents early diastolic filling, so the atrium cannot empty quickly.',
    },
    {
      kind: 'explain',
      title: 'Heart sounds S1–S4',
      body: String.raw`- **S1**: mitral (+ tricuspid) closure; loudest at the apex.
- **S2**: aortic (A2) + pulmonic (P2) closure; loudest at the base. **Physiological splitting**: on inspiration, more venous return to the right heart delays P2 → audible A2–P2 split.
- **S3** (early diastole, "Ken-*tuck*-y"): sudden deceleration of blood in a dilated, volume-overloaded ventricle — heart failure, mitral regurgitation; can be normal in children, athletes and pregnancy.
- **S4** (late diastole, "*Ten*-nessee"): atrial kick into a **stiff** ventricle — LV hypertrophy (hypertension, aortic stenosis), acute ischaemia. Usually pathological (though it may be heard in healthy older adults) and absent in AF (no atrial kick).`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['sin(120*x)*(exp(-((x-0.05)/0.02)^2) + 0.8*exp(-((x-0.38)/0.015)^2) + s3*0.45*exp(-((x-0.55)/0.02)^2) + s4*0.45*exp(-((x-0.9)/0.02)^2))'],
          x: [0, 1], y: [-1.2, 1.2],
          params: [{ name: 's3', min: 0, max: 1, value: 0, label: 'S3 (volume overload)' }, { name: 's4', min: 0, max: 1, value: 0, label: 'S4 (stiff LV)' }],
          xLabel: 'fraction of cardiac cycle', yLabel: 'sound',
        },
        caption: 'Phonocardiogram sketch: S1 at the start of systole, S2 at ~0.38. Add an S3 (early filling) or S4 (atrial systole, just before S1).',
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`**Vignette.** A 66-year-old man with 20 years of poorly controlled hypertension has a sustained apical impulse. A low-pitched sound is heard at the apex immediately **before S1**. ECG shows sinus rhythm with voltage criteria for LV hypertrophy. What is this sound?`,
      choices: ['S3 from rapid ventricular filling', 'S4 from atrial contraction into a stiff ventricle', 'Opening snap of mitral stenosis', 'Wide split of S2'],
      answer: 1,
      why: 'Late-diastolic (presystolic) sound + concentric LVH from chronic pressure overload = **S4**. It requires a functioning atrial kick, so it disappears if he develops AF. An S3 is early diastolic and suggests a dilated, volume-overloaded ventricle.',
    },
    {
      kind: 'numeric',
      prompt: 'At a heart rate of 120 beats/min, how long (in seconds) is one complete cardiac cycle?',
      answer: 0.5,
      tolerance: 0.01,
      unit: 's',
      why: 'Cycle length = 60 s / 120 = 0.5 s (vs 0.8 s at 75/min). Systole shortens only slightly, so most of the lost time comes out of **diastole** — the period of ventricular filling and LV coronary perfusion.',
    },
    {
      kind: 'multi',
      prompt: 'Which statements about the cardiac cycle are correct? (Select all.)',
      choices: [
        'The dicrotic notch on the aortic trace coincides with aortic valve closure',
        'LV volume is constant during both isovolumetric phases',
        'The a wave occurs just after S1',
        'Most ventricular filling at rest happens passively in early diastole',
      ],
      answers: [0, 1, 3],
      why: 'Aortic closure causes a brief backflow and the notch; isovolumetric = constant volume; most filling is passive (rapid filling) — atrial systole adds only ~10–20% at rest (more with exercise or a stiff ventricle). The a wave occurs at the end of diastole, just *before* S1.',
    },
    {
      kind: 'truefalse',
      prompt: 'In severe mitral regurgitation, the pressure–volume loop has no true isovolumetric contraction phase.',
      answer: true,
      why: 'With a leaky mitral valve, blood flows back into the left atrium as soon as LV pressure exceeds LA pressure — so volume falls even before the aortic valve opens. The loop becomes rounded and wider (larger EDV), and forward stroke volume is less than total stroke volume.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Valves move with pressure gradients: open when upstream > downstream pressure, close when reversed.
- **S1** = mitral/tricuspid closure (start of systole); **S2** = aortic/pulmonic closure (start of diastole).
- Isovolumetric contraction and relaxation: all valves closed, volume constant.
- P–V loop runs anticlockwise: filling → isovolumetric contraction → ejection → isovolumetric relaxation; width = SV.
- JVP: a (atrial contraction), c, x, v (filling), y — absent a in AF, cannon a in complete heart block, giant v in TR.
- **S3** = volume overload/dilated ventricle; **S4** = stiff ventricle (needs atrial kick).`,
    },
  ],
  references: [
    { authors: 'Hall JE, Hall ME', title: 'Guyton and Hall Textbook of Medical Physiology', year: 2021, venue: '14th ed., Elsevier', detail: 'Ch. 9: Cardiac Muscle; The Heart as a Pump and Function of the Heart Valves' },
    { authors: 'Costanzo LS', title: 'Physiology', year: 2022, venue: '7th ed., Elsevier', detail: 'Ch. 4: Cardiovascular Physiology (cardiac cycle)' },
    { authors: 'Le T, Bhushan V, et al.', title: 'First Aid for the USMLE Step 1', year: 2024, venue: 'McGraw Hill', detail: 'Cardiovascular: Cardiac cycle; Heart sounds; Jugular venous pulse' },
    { authors: 'Bickley LS, Szilagyi PG, Hoffman RM, Soriano RP', title: "Bates' Guide to Physical Examination and History Taking", year: 2021, venue: '13th ed., Wolters Kluwer', detail: 'Ch. 9: The Cardiovascular System' },
  ],
} satisfies LessonContent;
