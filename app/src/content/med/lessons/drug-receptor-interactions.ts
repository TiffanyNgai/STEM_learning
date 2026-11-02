import type { LessonContent } from '../../types';

const RECEPTOR_SVG = String.raw`<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-size="9" fill="var(--fg)">
<rect x="0" y="52" width="320" height="16" fill="var(--c3)" fill-opacity="0.18"/>
<text x="316" y="63" text-anchor="end" font-size="7" fill="var(--muted)">membrane</text>
<text x="4" y="12" font-weight="bold">1 Ion channel</text><text x="4" y="22" font-size="8" fill="var(--muted)">ms · nicotinic, GABA-A</text>
<rect x="22" y="40" width="9" height="40" fill="var(--c2)"/><rect x="41" y="40" width="9" height="40" fill="var(--c2)"/>
<circle cx="36" cy="30" r="3" fill="var(--c5)"><animate attributeName="cy" values="30;105;105" keyTimes="0;0.7;1" dur="2s" repeatCount="indefinite"/></circle>
<text x="18" y="118" font-size="8">ions flow</text>
<text x="84" y="12" font-weight="bold">2 GPCR</text><text x="84" y="22" font-size="8" fill="var(--muted)">seconds · β, M, opioid</text>
<path d="M92,48 v24 M98,48 v24 M104,48 v24 M110,48 v24 M116,48 v24 M122,48 v24 M128,48 v24" stroke="var(--c4)" stroke-width="3"/>
<circle cx="110" cy="40" r="5" fill="var(--c5)"/>
<ellipse cx="134" cy="84" rx="12" ry="7" fill="var(--c1)" fill-opacity="0.6"><animate attributeName="cx" values="134;150;134" dur="2s" repeatCount="indefinite"/></ellipse>
<text x="128" y="87" font-size="7">G</text><text x="98" y="108" font-size="8">→ 2nd messengers</text><text x="98" y="118" font-size="8">(cAMP, IP₃, Ca²⁺)</text>
<text x="172" y="12" font-weight="bold">3 Enzyme-linked</text><text x="172" y="22" font-size="8" fill="var(--muted)">min–h · insulin, cytokines</text>
<rect x="186" y="34" width="7" height="58" fill="var(--c6)"/><rect x="200" y="34" width="7" height="58" fill="var(--c6)"/>
<circle cx="196" cy="30" r="5" fill="var(--c5)"/>
<text x="180" y="104" font-size="8" fill="var(--c5)">P</text><text x="208" y="104" font-size="8" fill="var(--c5)">P</text><text x="172" y="118" font-size="8">kinase cascade</text>
<text x="252" y="12" font-weight="bold">4 Nuclear</text><text x="252" y="22" font-size="8" fill="var(--muted)">h–days · steroids, T₃</text>
<circle cx="270" cy="34" r="4" fill="var(--c5)"><animate attributeName="cy" values="34;100;100" keyTimes="0;0.6;1" dur="2.5s" repeatCount="indefinite"/></circle>
<ellipse cx="275" cy="150" rx="38" ry="24" fill="var(--c2)" fill-opacity="0.15" stroke="var(--c2)"/>
<text x="275" y="148" text-anchor="middle" font-size="8">nucleus:</text><text x="275" y="158" text-anchor="middle" font-size="8">gene transcription</text>
<text x="4" y="150" font-size="8" fill="var(--muted)">Lipophilic hormones cross the</text><text x="4" y="160" font-size="8" fill="var(--muted)">membrane; most others need a</text><text x="4" y="170" font-size="8" fill="var(--muted)">surface receptor. Speed of response:</text>
<text x="4" y="186" font-size="9" font-weight="bold">ion channel &lt; GPCR &lt; enzyme-linked &lt; nuclear</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Lock, key — and turning the key',
      body: String.raw`Most drugs act by binding a **receptor**: a macromolecule (usually a protein) whose function changes when a ligand binds. Two separate questions:

1. **Affinity** — how tightly does the key fit the lock? (binding)
2. **Efficacy / intrinsic activity** — does the key *turn* once inside? (activation)

An antagonist is a key that fits snugly but never turns: high affinity, zero efficacy. This lesson is about binding, the four receptor families, signalling and what happens with chronic exposure.`,
    },
    {
      kind: 'recall',
      title: 'Cell signalling (from biology)',
      points: [
        'Signals (hormones, transmitters) bind receptors → transduction → cellular response.',
        'Second messengers (cAMP, IP₃, DAG, Ca²⁺) amplify signals inside the cell.',
        'Kinases add phosphate groups to switch proteins on/off; phosphatases reverse this.',
        'Signals are terminated by ligand removal, receptor desensitisation and second-messenger breakdown.',
      ],
      link: 'bio/cell-signaling',
    },
    {
      kind: 'explain',
      title: 'Occupancy and Kd',
      body: String.raw`Reversible binding obeys the law of mass action. The fraction of receptors occupied by a drug at free concentration $[D]$ is

$$\text{occupancy} = \frac{[D]}{[D] + K_d}$$

$K_d$ (dissociation constant) is the concentration that occupies **50%** of receptors. Smaller $K_d$ = higher **affinity** (see [binding affinity](@drug/binding-affinity)).

Quick numbers: $[D] = K_d$ → 50%; $3K_d$ → 75%; $9K_d$ → 90%; $99K_d$ → 99%. Each extra "9" of occupancy costs roughly ten times more drug.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['100*10^x/(10^x+10^k)'], x: [-3, 3], y: [0, 105],
          params: [{ name: 'k', min: -2, max: 2, value: 0, label: 'log10 Kd' }],
          labels: ['% receptors occupied'], xLabel: 'log [D]', yLabel: 'occupancy %',
        },
        caption: 'Lowering Kd (higher affinity) slides the binding curve left — less drug needed for the same occupancy.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A competitive antagonist has $K_d$ = 2 nM. At a free plasma concentration of 18 nM, what percentage of receptors does it occupy (no agonist present)?`,
      answer: 90,
      tolerance: 0.5,
      unit: '%',
      why: String.raw`Occupancy $= 18/(18 + 2) = 0.90 = 90\%$. Concentration is $9K_d$, the "90% point". Note occupancy is hyperbolic, not linear: doubling to 36 nM only gives ≈95%.`,
    },
    {
      kind: 'explain',
      title: 'Spare receptors',
      body: String.raw`In many tissues a full agonist produces its **maximal response while occupying only a small fraction** of receptors — the rest are "spare" (receptor reserve). Analogy: a theatre needs only 10 of its 100 ushers to seat everyone; the other 90 are reserve.

Consequences:
- For a full agonist with spare receptors, $EC_{50}$ (response) **< $K_d$** (binding): the response curve sits to the left of the binding curve.
- An irreversible antagonist may first only shift the curve rightward (using up the reserve) before it depresses Emax.
- Tissues with a large reserve respond more strongly to partial agonists.

Example: cardiac and smooth-muscle responses to catecholamines and acetylcholine show receptor reserve.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['100*10^x/(10^x+1)', '100*(10^x/(10^x+1))/((10^x/(10^x+1)) + 1/s)*(1+1/s)'],
          x: [-4, 2], y: [0, 105], params: [{ name: 's', min: 1, max: 100, value: 20, label: 'amplification' }],
          labels: ['binding (occupancy)', 'response'], xLabel: 'log [agonist]', yLabel: '%',
        },
        caption: 'Signal amplification downstream makes the response saturate at low occupancy: the response EC50 moves left of Kd as amplification grows.',
      },
    },
    {
      kind: 'widget',
      title: 'The four receptor superfamilies',
      body: 'Speed of response follows the number of steps between binding and effect.',
      widget: { type: 'SvgDiagram', props: { svg: RECEPTOR_SVG } },
    },
    {
      kind: 'match',
      prompt: 'Match each drug/ligand to its receptor superfamily.',
      pairs: [
        ['Benzodiazepines (GABA-A)', 'Ligand-gated ion channel'],
        ['Metoprolol (β₁-adrenoceptor)', 'G protein–coupled receptor'],
        ['Insulin', 'Receptor tyrosine kinase (enzyme-linked)'],
        ['Prednisolone', 'Intracellular (nuclear) receptor'],
      ],
      why: 'GABA-A is a Cl⁻ channel (benzodiazepines bind an allosteric site); β-adrenoceptors are Gs-coupled GPCRs; the insulin receptor autophosphorylates on tyrosines; glucocorticoids diffuse in and alter gene transcription — explaining why steroid effects take hours.',
    },
    {
      kind: 'explain',
      title: 'G protein families: Gs, Gi, Gq',
      body: String.raw`GPCRs are the largest drug-target family. Each couples mainly to one G protein:

- **Gs** → stimulates adenylyl cyclase → **↑cAMP** → protein kinase A. Receptors: $\beta_1, \beta_2$, $D_1$, $H_2$, $V_2$.
- **Gi** → inhibits adenylyl cyclase → **↓cAMP**. Receptors: $\alpha_2$, $M_2$, $D_2$ (also opioid μ).
- **Gq** → phospholipase C → $IP_3$ (releases Ca²⁺) + DAG (activates PKC). Receptors: $\alpha_1$, $M_1$, $M_3$, $H_1$, $V_1$.

Mnemonic (First Aid): for α₁ α₂ β₁ β₂ M₁ M₂ M₃ D₁ D₂ H₁ H₂ V₁ V₂, "**qiss and qiq till you're siq of sqs**" → q i s s q i q s i q s q s.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            'Norepinephrine binds the **β₁ receptor** on a cardiac myocyte.',
            'The receptor changes shape and makes **Gαs** swap GDP for GTP; Gαs separates from Gβγ.',
            'Gαs-GTP activates **adenylyl cyclase**: ATP → **cAMP** (one enzyme makes many cAMP — amplification).',
            'cAMP activates **protein kinase A (PKA)**.',
            'PKA phosphorylates **L-type Ca²⁺ channels** and phospholamban → more Ca²⁺ entry and faster reuptake → ↑contractility and faster relaxation. (In SA-node cells the same Gs–cAMP pathway ↑heart rate.)',
            'Termination: Gα hydrolyses GTP → GDP; **phosphodiesterase** breaks cAMP down (PDE inhibitors like milrinone prolong the signal).',
          ],
        },
      },
    },
    {
      kind: 'order',
      prompt: 'Order the steps of α₁-adrenoceptor–mediated vascular smooth-muscle contraction.',
      steps: [
        'Phenylephrine binds the α₁ receptor',
        'Gq activates phospholipase C',
        'PIP₂ is cleaved into IP₃ and DAG',
        'IP₃ releases Ca²⁺ from the sarcoplasmic reticulum',
        'Ca²⁺–calmodulin activates myosin light-chain kinase → contraction',
      ],
      why: 'α₁ is Gq-coupled: PLC → IP₃ → intracellular Ca²⁺. This is why α₁ agonists such as phenylephrine raise blood pressure by vasoconstriction.',
    },
    {
      kind: 'mcq',
      prompt: 'Which receptor would be expected to **decrease** intracellular cAMP when activated?',
      choices: ['β₂-adrenergic', 'H₂ histamine', 'M₂ muscarinic', 'V₂ vasopressin'],
      answer: 2,
      why: 'M₂ (in the heart) is Gi-coupled: it inhibits adenylyl cyclase and opens K⁺ channels, slowing the SA node. β₂, H₂ and V₂ are all Gs-coupled (↑cAMP).',
    },
    {
      kind: 'explain',
      title: 'Desensitisation, tolerance and up-regulation',
      body: String.raw`Receptors adapt to their environment:

- **Desensitisation / tachyphylaxis** (minutes): agonist-bound receptors are phosphorylated by G protein–coupled receptor kinases (**GRKs**); **β-arrestin** binds and uncouples them. Example: repeated nebulised β₂ agonist gives diminishing bronchodilation.
- **Down-regulation / tolerance** (days): chronic agonist exposure → receptor internalisation and degradation → higher doses needed (e.g. opioids).
- **Up-regulation** (days): chronic *antagonist* exposure → more receptors. Stop the antagonist abruptly and the extra receptors meet normal agonist levels → **rebound**.

Clinical rule: taper β-blockers, clonidine and benzodiazepines rather than stopping abruptly.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`**Vignette.** A 61-year-old man with stable angina has taken propranolol for 3 years. He ran out of tablets 2 days ago and now presents with palpitations, HR 118/min and chest pain at rest. What is the most likely mechanism?`,
      choices: [
        'Propranolol caused permanent loss of β receptors',
        'Up-regulated β receptors are now fully exposed to endogenous catecholamines',
        'Propranolol withdrawal causes hypokalaemia',
        'Accumulation of a toxic propranolol metabolite',
      ],
      answer: 1,
      why: 'Chronic β-blockade increases β-receptor number; abrupt withdrawal exposes this enlarged receptor pool to normal catecholamines → **rebound** tachycardia, hypertension and angina (or MI). β-blockers should be tapered over 1–2 weeks.',
    },
    {
      kind: 'truefalse',
      prompt: 'A drug that binds its receptor with very high affinity must also have high efficacy.',
      answer: false,
      why: 'Affinity (binding, Kd) and efficacy (activation) are independent. Naloxone and many antagonists have very high affinity with zero efficacy; buprenorphine has very high affinity but only partial efficacy.',
    },
    {
      kind: 'multi',
      prompt: 'Which statements about receptor reserve (spare receptors) are correct? (Select all.)',
      choices: [
        'The agonist EC50 for response is lower than its Kd for binding',
        'Maximal response requires 100% receptor occupancy',
        'A low dose of an irreversible antagonist may shift the curve right without reducing Emax',
        'It results from amplification in downstream signalling',
      ],
      answers: [0, 2, 3],
      why: 'With reserve, maximal response occurs at partial occupancy, so the response curve lies left of the binding curve. Inactivating some receptors simply uses up the reserve (right shift) before Emax falls.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Affinity** (binding, $K_d$) ≠ **efficacy** (activation). Occupancy $= [D]/([D]+K_d)$.
- **Spare receptors**: full response at partial occupancy; $EC_{50} < K_d$.
- Four superfamilies, fastest to slowest: ion channels → GPCRs → enzyme-linked → nuclear receptors.
- **Gs** ↑cAMP (β₁, β₂, D₁, H₂, V₂); **Gi** ↓cAMP (α₂, M₂, D₂); **Gq** IP₃/Ca²⁺ (α₁, M₁, M₃, H₁, V₁).
- Desensitisation and tolerance with chronic agonists; **up-regulation** and rebound with chronic antagonists — taper β-blockers.`,
    },
  ],
  references: [
    { authors: 'Katzung BG, Vanderah TW (eds.)', title: 'Basic & Clinical Pharmacology', year: 2021, venue: '15th ed., McGraw Hill', detail: 'Ch. 2: Drug Receptors & Pharmacodynamics' },
    { authors: 'Ritter JM, Flower RJ, Henderson G, et al.', title: "Rang & Dale's Pharmacology", year: 2019, venue: '9th ed., Elsevier', detail: 'Ch. 2–3: How drugs act' },
    { authors: 'Le T, Bhushan V, et al.', title: 'First Aid for the USMLE Step 1', year: 2024, venue: 'McGraw Hill', detail: 'Pharmacology: Autonomic receptors / G-protein-linked second messengers' },
    { authors: 'Hall JE, Hall ME', title: 'Guyton and Hall Textbook of Medical Physiology', year: 2021, venue: '14th ed., Elsevier', detail: 'Ch. 75: Introduction to Endocrinology (hormone receptors and their activation)' },
  ],
} satisfies LessonContent;
