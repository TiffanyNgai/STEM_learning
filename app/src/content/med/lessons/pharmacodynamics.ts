import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'What a drug does to the body',
      body: String.raw`Two pain relievers: 1 mg of drug A or 50 mg of drug B gives the same relief — but only B can control severe pain at any dose. Which is "stronger"? The answer depends on which of two different ideas you mean: **potency** or **efficacy**.

**Pharmacodynamics (PD)** studies *what the drug does to the body*: how drug concentration at the target maps to effect. Together with pharmacokinetics (concentration over time), PD tells us the effect over time.`,
    },
    {
      kind: 'explain',
      title: 'The graded dose–response curve',
      body: String.raw`As concentration $C$ rises, effect $E$ rises and then saturates — like adding workers to a fixed number of desks: past a point, more workers add nothing. The usual model (Emax / Hill equation):

$$E = \frac{E_{max}\, C^n}{EC_{50}^{\,n} + C^n}$$

- $E_{max}$: the **maximal effect** the drug can produce — its **efficacy**.
- $EC_{50}$: the concentration giving **half** of the drug's own maximum — a measure of **potency** (lower $EC_{50}$ = more potent).
- $n$: Hill slope (steepness); often ≈ 1.

Plotted against **log dose**, the hyperbola becomes the classic **S-shaped (sigmoid)** curve, with a roughly linear middle from ~20–80% effect.`,
    },
    {
      kind: 'widget',
      title: 'Potency vs efficacy',
      body: 'Drug A is fixed. Move drug B\'s **log EC50** — the curve slides sideways (potency changes). Move its **Emax** — the plateau rises or falls (efficacy changes). The two properties are independent.',
      widget: { type: 'DoseResponseMed', props: { mode: 'agonists', modes: ['agonists'] } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Drug X has $EC_{50}$ = 2 nM and $E_{max}$ = 60% of the system maximum. Drug Y has $EC_{50}$ = 200 nM and $E_{max}$ = 100%. Which statement is correct?`,
      choices: [
        'X is more potent and more efficacious',
        'X is more potent; Y is more efficacious',
        'Y is more potent; X is more efficacious',
        'They cannot be compared without a Hill slope',
      ],
      answer: 1,
      why: 'Potency is about *where* the curve sits on the dose axis (X needs 100× less drug for its half-maximal effect). Efficacy is the *height* of the plateau (Y reaches 100%). A common error is treating "more potent" as "better" — clinically, efficacy usually matters more, since potency can be overcome by giving more drug.',
    },
    {
      kind: 'explain',
      title: 'Agonists',
      body: String.raw`A **receptor** is a target protein whose activation changes cell function (detailed in [drug–receptor interactions](@med/drug-receptor-interactions)). Drugs that bind it are classified by what they do once bound — their **intrinsic activity** (0 to 1):

- **Full agonist** (intrinsic activity 1): can produce the system's maximal response, e.g. morphine at μ-opioid receptors.
- **Partial agonist** (0 < IA < 1): even at 100% receptor occupancy produces a submaximal response, e.g. buprenorphine (μ-opioid), aripiprazole (D₂).
- **Inverse agonist**: reduces *constitutive* (baseline) receptor activity below resting levels.
- **Antagonist** (IA = 0): binds but does not activate; it blocks agonists.`,
    },
    {
      kind: 'explain',
      title: 'Antagonists shift the curve',
      body: String.raw`**Competitive (reversible) antagonists** bind the same site as the agonist. More agonist can out-compete them, so the curve shifts **right in parallel** (potency ↓) with **unchanged Emax** — *surmountable*. The dose ratio needed is $1 + [B]/K_B$ (Schild).
Example: naloxone vs opioids; atropine vs acetylcholine.

**Noncompetitive antagonists** bind irreversibly (covalently) or to an *allosteric* site. Extra agonist cannot overcome the block → **Emax falls** — *insurmountable*.
Example: phenoxybenzamine (irreversible α-blocker) in pheochromocytoma.

Other kinds: **physiological** antagonism (opposing effects through different receptors, e.g. epinephrine reversing histamine bronchoconstriction) and **chemical** antagonism (drugs bind each other, e.g. protamine neutralising heparin).`,
    },
    {
      kind: 'widget',
      title: 'Competitive vs noncompetitive',
      body: 'Raise the antagonist concentration in each mode. Competitive: the curve walks right but still reaches 100%. Noncompetitive: the ceiling collapses.',
      widget: { type: 'DoseResponseMed', props: { mode: 'competitive', modes: ['competitive', 'noncompetitive'] } },
    },
    {
      kind: 'fill',
      prompt: 'A competitive antagonist shifts the agonist log dose–response curve to the ___ and ___ the maximal effect; it ___ the agonist\'s potency.',
      bank: ['right', 'left', 'does not change', 'reduces', 'decreases', 'increases'],
      answer: ['right', 'does not change', 'decreases'],
      why: 'Because binding is reversible and at the same site, enough agonist always wins: same Emax, but a higher concentration is needed (higher apparent EC50 = lower potency). Reduced Emax is the signature of noncompetitive antagonism.',
    },
    {
      kind: 'widget',
      title: 'Partial agonists can act as antagonists',
      body: 'A partial agonist occupies receptors but activates them only weakly. Alone, it gives a modest response; in the presence of a full agonist it *competes* and lowers the response. Slide the intrinsic activity.',
      widget: { type: 'DoseResponseMed', props: { mode: 'partial', modes: ['partial'] }, caption: 'Green = full agonist alone; blue = full agonist plus a fixed amount of partial agonist (baseline raised, curve shifted right); dashed orange = the partial agonist\'s own ceiling.' },
    },
    {
      kind: 'mcq',
      prompt: String.raw`**Vignette.** A 32-year-old man on high-dose methadone maintenance (a full μ-opioid agonist) is given his first dose of sublingual buprenorphine 2 hours after his last methadone dose. Within 30 minutes he develops sweating, yawning, piloerection, abdominal cramps and dilated pupils. What is the best explanation?`,
      choices: [
        'Buprenorphine overdose causing serotonin syndrome',
        'Buprenorphine is a high-affinity partial agonist that displaces methadone, reducing net μ-receptor activation',
        'Buprenorphine induces CYP3A4, rapidly clearing methadone',
        'Buprenorphine is a competitive antagonist with zero intrinsic activity',
      ],
      answer: 1,
      why: '**Precipitated withdrawal**: buprenorphine binds μ receptors with very high affinity but low intrinsic activity, so it displaces the full agonist and net receptor stimulation falls. That is why buprenorphine is started only once mild withdrawal has begun. It is a partial agonist, not a pure antagonist (that would be naloxone).',
    },
    {
      kind: 'explain',
      title: 'Quantal dose–response and therapeutic index',
      body: String.raw`A **quantal** curve plots the *percentage of a population* showing an all-or-none response (e.g. sleep, toxicity, death) at each dose:
- $ED_{50}$: dose effective in 50% of subjects; $TD_{50}$: toxic in 50%; $LD_{50}$: lethal in 50% (animals).

$$\text{Therapeutic index (TI)} = \frac{TD_{50}}{ED_{50}}\quad(\text{or } LD_{50}/ED_{50} \text{ in animal studies})$$

A high TI means a wide safety margin. The **therapeutic window** is the clinical analogue: the range of plasma concentrations between minimal efficacy and unacceptable toxicity.

**Narrow-TI drugs** (often need level monitoring): warfarin, digoxin, lithium, theophylline, phenytoin, aminoglycosides, and many anticancer drugs.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['100/(1+10^(-3*(x-1)))', '100/(1+10^(-3*(x-1-r)))'],
          x: [-0.5, 4], y: [0, 105], params: [{ name: 'r', min: 0.2, max: 2.5, value: 1.6, label: 'log10 TI' }],
          labels: ['% responding (therapeutic)', '% with toxicity'], xLabel: 'log dose', yLabel: '% of population',
        },
        caption: 'Slide **log10 TI** toward 0.3 (TI ≈ 2): the curves overlap and some patients become toxic at doses others need to respond.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`In animal studies, a drug has $ED_{50}$ = 5 mg/kg for the desired effect and $LD_{50}$ = 400 mg/kg. What is its therapeutic index?`,
      answer: 80,
      tolerance: 0.5,
      why: String.raw`$TI = LD_{50}/ED_{50} = 400/5 = 80$. Be careful to put the toxic/lethal dose on top; inverting gives 0.0125, which would imply the drug is lethal before it works.`,
    },
    {
      kind: 'match',
      prompt: 'Match each drug pair to the type of interaction.',
      pairs: [
        ['Naloxone reversing morphine', 'Competitive (reversible) antagonism'],
        ['Phenoxybenzamine blocking norepinephrine at α₁', 'Irreversible (noncompetitive) antagonism'],
        ['Protamine neutralising heparin', 'Chemical antagonism'],
        ['Epinephrine reversing histamine-induced bronchospasm', 'Physiological antagonism'],
        ['Buprenorphine at μ-opioid receptors', 'Partial agonism'],
      ],
      why: 'Same receptor + reversible = competitive; covalent binding = irreversible; drug–drug binding = chemical; opposing effects via different receptors (β₂ vs H₁) = physiological.',
    },
    {
      kind: 'truefalse',
      prompt: 'Because drug A is 10 times more potent than drug B, drug A will always be the better clinical choice.',
      answer: false,
      why: 'Potency only determines the dose needed. Clinical choice depends on efficacy, therapeutic index, PK and adverse effects. Higher potency matters only if dose size itself is a problem (e.g. transdermal patches need very potent drugs like fentanyl).',
    },
    {
      kind: 'multi',
      prompt: 'Which findings indicate the antagonist in an experiment is **noncompetitive**? (Select all.)',
      choices: [
        'Maximal response is reduced and cannot be restored by more agonist',
        'Parallel rightward shift of the log dose–response curve',
        'Effect persists long after the antagonist is washed out of the bath',
        'Dose ratio increases linearly with antagonist concentration, Emax unchanged',
      ],
      answers: [0, 2],
      why: 'Insurmountable Emax depression and wash-resistant block suggest irreversible/allosteric binding. A parallel shift with a linear Schild relationship is the fingerprint of competitive antagonism.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- $E = E_{max}C/(EC_{50}+C)$; on a log-dose axis it is sigmoid.
- **Potency** = position ($EC_{50}$); **efficacy** = height ($E_{max}$). Efficacy usually matters more clinically.
- Full vs **partial** agonists (submaximal even at full occupancy; can antagonise full agonists — precipitated withdrawal) vs inverse agonists.
- **Competitive** antagonist: right shift, same Emax (surmountable). **Noncompetitive/irreversible**: Emax ↓.
- $TI = TD_{50}/ED_{50}$; narrow-TI drugs (warfarin, digoxin, lithium, theophylline, phenytoin, aminoglycosides) need careful monitoring.`,
    },
  ],
  references: [
    { authors: 'Katzung BG, Vanderah TW (eds.)', title: 'Basic & Clinical Pharmacology', year: 2021, venue: '15th ed., McGraw Hill', detail: 'Ch. 2: Drug Receptors & Pharmacodynamics' },
    { authors: 'Ritter JM, Flower RJ, Henderson G, et al.', title: "Rang & Dale's Pharmacology", year: 2019, venue: '9th ed., Elsevier', detail: 'Ch. 2: How drugs act: general principles' },
    { authors: 'Brunton LL, Knollmann BC (eds.)', title: "Goodman & Gilman's The Pharmacological Basis of Therapeutics", year: 2023, venue: '14th ed., McGraw Hill', detail: 'Ch. 3: Pharmacodynamics' },
    { authors: 'Le T, Bhushan V, et al.', title: 'First Aid for the USMLE Step 1', year: 2024, venue: 'McGraw Hill', detail: 'Pharmacology: Pharmacodynamics' },
  ],
} satisfies LessonContent;
