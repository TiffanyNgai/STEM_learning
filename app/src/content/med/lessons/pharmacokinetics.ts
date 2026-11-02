import type { LessonContent } from '../../types';

const KATZUNG = { authors: 'Katzung BG, Vanderah TW (eds.)', title: 'Basic & Clinical Pharmacology', year: 2021, venue: '15th ed., McGraw Hill', detail: 'Ch. 3: Pharmacokinetics & Pharmacodynamics: Rational Dosing & the Time Course of Drug Action' };
const ROWLAND = { authors: 'Rowland M, Tozer TN', title: 'Clinical Pharmacokinetics and Pharmacodynamics: Concepts and Applications', year: 2010, venue: '4th ed., Lippincott Williams & Wilkins', detail: 'Ch. 2–5, 11' };
const GG = { authors: 'Brunton LL, Knollmann BC (eds.)', title: "Goodman & Gilman's The Pharmacological Basis of Therapeutics", year: 2023, venue: '14th ed., McGraw Hill', detail: 'Ch. 2: Pharmacokinetics' };
const FA = { authors: 'Le T, Bhushan V, et al.', title: 'First Aid for the USMLE Step 1', year: 2024, venue: 'McGraw Hill', detail: 'Pharmacology: Pharmacokinetics' };

const ADME_SVG = String.raw`<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" font-size="9" fill="var(--fg)">
<rect x="6" y="70" width="58" height="44" rx="8" fill="var(--c3)" fill-opacity="0.18" stroke="var(--c3)"/>
<text x="35" y="88" text-anchor="middle" font-weight="bold">Gut</text><text x="35" y="100" text-anchor="middle" font-size="8">tablet dissolves</text>
<rect x="88" y="70" width="58" height="44" rx="8" fill="var(--c4)" fill-opacity="0.18" stroke="var(--c4)"/>
<text x="117" y="88" text-anchor="middle" font-weight="bold">Liver</text><text x="117" y="100" text-anchor="middle" font-size="8">first pass</text>
<rect x="170" y="62" width="70" height="60" rx="10" fill="var(--c5)" fill-opacity="0.15" stroke="var(--c5)"/>
<text x="205" y="86" text-anchor="middle" font-weight="bold">Plasma</text><text x="205" y="99" text-anchor="middle" font-size="8">(what we measure)</text>
<rect x="258" y="20" width="58" height="40" rx="8" fill="var(--c1)" fill-opacity="0.18" stroke="var(--c1)"/>
<text x="287" y="38" text-anchor="middle" font-weight="bold">Tissues</text><text x="287" y="50" text-anchor="middle" font-size="8">site of action</text>
<rect x="258" y="128" width="58" height="40" rx="8" fill="var(--c2)" fill-opacity="0.18" stroke="var(--c2)"/>
<text x="287" y="146" text-anchor="middle" font-weight="bold">Kidney</text><text x="287" y="158" text-anchor="middle" font-size="8">urine</text>
<g stroke="var(--fg)" stroke-width="1.3" fill="none"><path d="M64,92 H86"/><path d="M146,92 H168"/><path d="M240,80 L256,52"/><path d="M256,44 L240,72" stroke-dasharray="3 2"/><path d="M240,108 L256,140"/><path d="M146,104 Q160,130 175,118"/></g>
<text x="75" y="64" text-anchor="middle" fill="var(--c3)" font-weight="bold">A</text><text x="248" y="28" fill="var(--c1)" font-weight="bold">D</text>
<text x="117" y="130" text-anchor="middle" fill="var(--c4)" font-weight="bold">M</text><text x="236" y="140" fill="var(--c2)" font-weight="bold">E</text>
<circle r="3.5" fill="var(--c5)"><animateMotion dur="4s" repeatCount="indefinite" path="M30,92 H117 H205 L287,40"/></circle>
<circle r="3.5" fill="var(--c2)"><animateMotion dur="4s" begin="2s" repeatCount="indefinite" path="M30,92 H117 H205 L287,148"/></circle>
<text x="160" y="182" text-anchor="middle" font-size="8" fill="var(--muted)">Oral route: Absorption → (first-pass Metabolism) → Distribution ⇄ → Elimination</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'What the body does to a drug',
      body: String.raw`A patient swallows a tablet at 8 a.m. Will it work? When? For how long? Will the next dose pile up and become toxic?

**Pharmacokinetics (PK)** answers these questions: it is the study of *what the body does to a drug* over time — the mirror image of pharmacodynamics (*what the drug does to the body*).

PK is summarised by four processes, **ADME**:
- **A**bsorption — getting from the site of administration into the blood
- **D**istribution — spreading from blood into tissues
- **M**etabolism — chemical modification, mostly in the liver
- **E**xcretion — removal from the body, mostly via kidney (urine) or bile`,
      widget: { type: 'SvgDiagram', props: { svg: ADME_SVG }, caption: 'Follow a drug molecule after an oral dose. Metabolism + excretion together = **elimination**.' },
    },
    {
      kind: 'recall',
      title: 'Already met in drug discovery',
      points: [
        'ADME properties are optimised early in drug discovery alongside potency.',
        'Lipophilic, small, un-ionised molecules cross membranes best.',
        'Poor solubility or extensive first-pass metabolism → low oral bioavailability.',
        'Here we turn those ideas into numbers a clinician can dose with.',
      ],
      link: 'drug/adme-tox',
    },
    {
      kind: 'explain',
      title: 'Bioavailability (F)',
      body: String.raw`Think of a delivery van: some parcels fall out on the way (not absorbed) and the liver's customs office confiscates others (**first-pass metabolism** — oral drugs travel via the portal vein through the liver *before* reaching the systemic circulation).

**Bioavailability, F**, is the fraction of an administered dose that reaches the systemic circulation unchanged. By definition $F = 1$ (100%) for an IV dose. It is measured by comparing areas under the concentration–time curve (AUC):

$$F = \frac{AUC_{oral}}{AUC_{IV}}\quad(\text{same dose})$$

Example: morphine has substantial first-pass metabolism (oral F roughly 0.2–0.4), which is why oral doses are several times larger than IV doses.`,
    },
    {
      kind: 'explain',
      title: 'Volume of distribution (Vd)',
      body: String.raw`Imagine dropping 100 mg of dye into a bucket and measuring 2 mg/L — you'd conclude the bucket holds 50 L. **Vd** does the same for the body:

$$V_d = \frac{\text{amount of drug in body}}{\text{plasma concentration}}$$

It is an *apparent* volume, not a real place. For a 70-kg adult: plasma ≈ 3 L, extracellular fluid ≈ 14 L, total body water ≈ 42 L.
- **Low Vd (≈3–8 L)**: large or highly plasma-protein-bound drugs stay mostly in blood (e.g. heparin ≈ 4–5 L; warfarin ≈ 8–10 L, just above this band).
- **Medium (≈14–42 L)**: small hydrophilic drugs in ECF or body water (e.g. aminoglycosides ~ ECF).
- **High (hundreds of L)**: lipophilic or tissue-bound drugs leave the plasma (e.g. amiodarone, chloroquine, digoxin).`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`A new drug given as a 500-mg IV bolus produces an initial plasma concentration of 1 mg/L. Which statement is most accurate?`,
      choices: [
        'The drug is confined to the plasma',
        'Vd ≈ 500 L, so the drug is extensively taken up into tissues',
        'Vd ≈ 0.5 L, so the drug is highly protein bound',
        'The drug must have low bioavailability',
      ],
      answer: 1,
      why: String.raw`$V_d = 500\text{ mg} / 1\text{ mg/L} = 500$ L — far larger than total body water (~42 L), so most drug sits in tissues (lipid, binding sites). Bioavailability is irrelevant for an IV dose (F = 1).`,
    },
    {
      kind: 'explain',
      title: 'Clearance and half-life',
      body: String.raw`**Clearance (CL)** is the *volume of plasma completely cleared of drug per unit time* (L/h). For most drugs elimination is **first-order**: the rate is proportional to concentration, $\text{rate} = CL \times C$.

Because a constant *fraction* is removed per unit time, concentration falls exponentially with a constant **half-life**:

$$t_{1/2} = \frac{0.693 \times V_d}{CL}$$

Analogy: the same pump (CL) empties a bigger tank (Vd) more slowly. So $t_{1/2}$ *depends on* both Vd and CL — it is not a primary parameter.

Example: Vd 50 L, CL 5 L/h → $t_{1/2} = 0.693 \times 50/5 \approx 6.9$ h. After 1, 2, 3, 4 half-lives, 50%, 75%, 87.5%, 93.75% has been eliminated.`,
    },
    {
      kind: 'widget',
      title: 'Single dose: IV vs oral',
      body: 'Switch between **IV bolus** and **Oral**. Increase **Vd**: the starting concentration falls and the curve flattens (longer t½). Increase **t½**: the decay slows. Oral dosing adds an absorption phase, a peak (Cmax) and lower area (F < 1).',
      widget: { type: 'PKCurve', props: { mode: 'iv', modes: ['iv', 'oral'], window: null, tMax: 48, yMax: 20 } },
    },
    {
      kind: 'fill',
      prompt: String.raw`Half-life rises when Vd ___ or when clearance ___. In liver cirrhosis with reduced metabolism, half-life of a hepatically cleared drug is expected to ___.`,
      bank: ['increases', 'decreases', 'stays the same', 'increase', 'decrease'],
      answer: ['increases', 'decreases', 'increase'],
      why: String.raw`From $t_{1/2} = 0.693\,V_d/CL$: half-life goes up with a bigger Vd and down with a bigger CL. Cirrhosis lowers hepatic clearance (and often raises Vd via ascites), so half-life increases.`,
    },
    {
      kind: 'explain',
      title: 'Repeated dosing and steady state',
      body: String.raw`Give a dose every interval $\tau$ (tau) and each new dose lands on the remains of the last: the drug **accumulates** until the amount eliminated per interval equals the amount given — **steady state**.

- Time to steady state depends **only on half-life**: ≈ 50% after 1 t½, 90% after ~3.3, **≈ 94–97% after 4–5 half-lives**.
- The *level* at steady state depends on dose rate and clearance:
$$C_{ss,avg} = \frac{F \times \text{Dose}}{CL \times \tau}$$
- Doubling the dose doubles $C_{ss}$ but does **not** shorten the time to get there.
- Dosing more often with smaller doses (same total) narrows peak–trough swings.`,
    },
    {
      kind: 'widget',
      title: 'Accumulation to steady state',
      body: 'Watch the peaks and troughs climb toward the dashed **Css,avg** line. Try: double the dose (level doubles, timing unchanged); halve τ; then toggle **Loading dose** to reach the window immediately.',
      widget: { type: 'PKCurve', props: { mode: 'multiple', modes: ['multiple'], dose: 400, tau: 12, halfLife: 12, vd: 40, window: [8, 20], tMax: 96, yMax: 32 }, caption: 'Green band = therapeutic window (illustrative). Orange triangles mark each dose.' },
    },
    {
      kind: 'truefalse',
      prompt: 'A drug with a 24-hour half-life is started at a fixed daily dose. Doubling the daily dose will bring the patient to steady state in about half the time.',
      answer: false,
      why: 'Time to steady state (~4–5 half-lives ≈ 4–5 days here) depends only on half-life. A bigger dose raises the steady-state *level*, not the speed. To get there faster you need a **loading dose**.',
    },
    {
      kind: 'explain',
      title: 'Loading and maintenance doses',
      body: String.raw`Two dosing equations cover most clinical PK:

$$\text{Loading dose} = \frac{C_{target} \times V_d}{F}\qquad \text{Maintenance dose rate} = \frac{C_{target} \times CL}{F}$$

Intuition: the **loading dose fills the tank** (depends on volume); the **maintenance dose replaces what drains** (depends on clearance).

Clinical corollaries:
- In **renal or hepatic impairment**, CL falls → reduce the *maintenance* dose; the loading dose is usually unchanged (Vd unchanged).
- Loading doses are used when waiting 4–5 half-lives is unacceptable (e.g. amiodarone, digoxin, vancomycin in serious infection).`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`**Problem.** IV drug, target plasma concentration 10 mg/L, $V_d = 50$ L, $CL = 5$ L/h. Find the loading dose and an 8-hourly maintenance dose.`,
            String.raw`Loading dose $= C \times V_d / F = 10 \times 50 / 1 = 500$ mg.`,
            String.raw`Maintenance rate $= C \times CL / F = 10 \times 5 = 50$ mg/h.`,
            String.raw`Every 8 h: $50 \times 8 = 400$ mg q8h. Check: $t_{1/2} = 0.693 \times 50/5 \approx 7$ h, so without the load steady state would take ~28–35 h.`,
          ],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`**Vignette.** A 70-kg man needs rapid control of a tachyarrhythmia with a hypothetical oral drug: $V_d = 3.5$ L/kg, oral bioavailability $F = 0.7$, target plasma concentration 1.5 mg/L. What oral loading dose (mg) is needed?`,
      answer: 525,
      tolerance: 5,
      unit: 'mg',
      why: String.raw`$V_d = 3.5 \times 70 = 245$ L. Loading dose $= C \times V_d / F = 1.5 \times 245 / 0.7 = 525$ mg. Forgetting to divide by F (≈368 mg) is the common error — only 70% of an oral dose reaches the circulation.`,
    },
    {
      kind: 'explain',
      title: 'Zero-order elimination',
      body: String.raw`When elimination enzymes are **saturated**, the body removes a constant *amount* per hour, not a constant fraction — like a cashier who can serve only one customer a minute no matter how long the queue.

- Concentration falls **linearly**, and half-life is not constant (it lengthens as dose increases).
- Small dose increases can cause disproportionately large rises in level → toxicity.
- Classic examples: **ethanol**, **phenytoin** and **aspirin (salicylate)** at high doses. (Mnemonic in First Aid: PEA — "a pea is round, like the zero in zero-order".)`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['20*exp(-0.693*x/4)', 'max(20 - 2*x, 0)'],
          x: [0, 14], y: [0, 22], labels: ['first-order (t½ 4 h)', 'zero-order (2 mg/L per h)'], xLabel: 'time (h)', yLabel: 'C (mg/L)',
        },
        caption: 'First-order: constant fraction per hour (exponential). Zero-order: constant amount per hour (straight line).',
      },
    },
    {
      kind: 'match',
      prompt: 'Match each scenario to the PK concept it best illustrates.',
      pairs: [
        ['Oral nitroglycerin is ineffective; it is given sublingually', 'First-pass metabolism'],
        ['A drug reaches the same plateau whatever the start date, after ~5 half-lives', 'Steady state'],
        ['Phenytoin level jumps from 12 to 28 mg/L after a small dose increase', 'Zero-order (saturable) elimination'],
        ['Vancomycin dose interval is extended in a patient with kidney failure', 'Reduced clearance'],
      ],
      why: 'Sublingual veins drain to the systemic circulation, bypassing the liver. Saturation makes phenytoin kinetics nonlinear. Lower renal clearance means a lower maintenance dose rate (smaller dose or longer interval).',
    },
    {
      kind: 'order',
      prompt: 'Order the journey of an oral tablet from swallowing to urine.',
      steps: [
        'Tablet disintegrates and dissolves in the GI lumen',
        'Drug crosses the intestinal epithelium',
        'Portal vein carries drug through the liver (first pass)',
        'Drug enters the systemic circulation',
        'Drug distributes into tissues',
        'Drug (or metabolite) is filtered/secreted by the kidney',
      ],
      why: 'Only dissolved drug can be absorbed; absorbed drug meets the liver before the systemic circulation, which is why oral F can be well below 1. Elimination happens from the circulating pool.',
    },
    {
      kind: 'multi',
      prompt: String.raw`**Vignette.** A 78-year-old woman with eGFR 25 mL/min/1.73 m² is started on a drug that is 90% renally excreted unchanged. Which adjustments are appropriate? (Select all.)`,
      choices: [
        'Reduce the maintenance dose or lengthen the dosing interval',
        'Reduce the loading dose by the same proportion',
        'Expect steady state to take longer to reach',
        'Monitor plasma levels if the drug has a narrow therapeutic index',
      ],
      answers: [0, 2, 3],
      why: String.raw`Lower CL → lower maintenance requirement and a longer $t_{1/2}$ (so steady state takes longer). The loading dose depends on Vd, which renal failure does not usually change much. Narrow-therapeutic-index drugs (e.g. aminoglycosides, digoxin, lithium) warrant level monitoring.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **ADME**: absorption, distribution, metabolism, excretion. **F** = fraction reaching the systemic circulation (IV = 1).
- $V_d$ = amount / concentration — big Vd means tissue uptake.
- **CL** = volume cleared per time; $t_{1/2} = 0.693\,V_d/CL$.
- Steady state takes **4–5 half-lives**, regardless of dose; $C_{ss} = F\cdot\text{Dose}/(CL\cdot\tau)$.
- **Loading dose** $= C\,V_d/F$ (fills the tank); **maintenance** $= C\,CL/F$ (replaces losses) — adjust maintenance in organ failure.
- Saturable (zero-order) kinetics: phenytoin, ethanol, high-dose aspirin.`,
    },
  ],
  references: [KATZUNG, ROWLAND, GG, FA],
} satisfies LessonContent;
