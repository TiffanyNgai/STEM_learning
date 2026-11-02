import type { LessonContent } from '../../types';

/** Schematic of the Seok et al. (2013) comparison: human–human responses agree, mouse–human responses scatter. */
const seokSvg = (() => {
  let seed = 7;
  const u = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const g = () => (u() + u() + u() - 1.5) * 1.2;
  const panel = (ox: number, title: string, tight: boolean, color: string) => {
    let pts = '';
    for (let i = 0; i < 45; i++) {
      const a = g() * 1.6;
      const b = tight ? a + g() * 0.5 : g() * 1.6;
      const x = ox + 70 + a * 22, y = 115 - b * 22;
      if (x > ox + 8 && x < ox + 132 && y > 48 && y < 182) pts += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="${color}" fill-opacity="0.7"/>`;
    }
    return `<rect x="${ox + 6}" y="46" width="128" height="138" fill="none" stroke="var(--muted)"/>
<text x="${ox + 70}" y="38" text-anchor="middle" font-weight="700" fill="var(--fg)">${title}</text>
${tight ? `<line x1="${ox + 10}" y1="180" x2="${ox + 130}" y2="50" stroke="${color}" stroke-dasharray="4 3"/>` : ''}${pts}`;
  };
  return `<svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg"><g font-size="9">
<text x="160" y="14" font-size="10" font-weight="700" text-anchor="middle" fill="var(--fg)">Gene-expression changes after injury (schematic)</text>
${panel(10, 'human burns vs human trauma', true, 'var(--c2)')}
${panel(170, 'human vs mouse model', false, 'var(--c5)')}
<text x="80" y="200" text-anchor="middle" fill="var(--muted)">each dot = one gene's fold change</text>
<text x="240" y="200" text-anchor="middle" fill="var(--muted)">same genes, mouse ortholog</text>
</g></svg>`;
})();

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The last step before a human',
      body: String.raw`Before a new drug is given to a person, regulators require evidence from living animals. Pharmacology studies ask whether it works in a disease model. Pharmacokinetics asks where it goes and how long it stays. Toxicology asks what it damages, and at what dose.

No cell culture yet captures absorption from the gut, liver metabolism, distribution into organs, and toxicity in a heart or kidney all at once. Animals do. But a mouse is not a small human: metabolism, immune systems and disease biology differ. Many drugs that cure a mouse model fail in patients, while some human toxicities never appeared in animals. This lesson is about what animal data can and cannot tell you.`,
    },
    {
      kind: 'explain',
      title: 'Which species, and why',
      body: String.raw`- **Mice**: small, cheap, fast-breeding, and genetically tractable: knockouts, transgenics, "humanised" mice carrying human genes or immune cells. They are the workhorse of efficacy models.
- **Rats**: larger (more blood for PK sampling, easier surgery). The standard **rodent** species in toxicology.
- **Dogs, minipigs**: the usual **non-rodent** toxicology species.
- **Non-human primates**: used mainly when the drug only works in primates. Many antibodies, for example, bind the human and monkey target but not the rodent one.

Regulatory guidance (ICH M3(R2)) generally expects general toxicity studies in **one rodent and one non-rodent** species before and during clinical trials. Details in [Toxicology basics](@med/toxicology-basics).`,
    },
    {
      kind: 'explain',
      title: 'Kinds of disease model',
      body: String.raw`- **Induced** models: provoke the disease, e.g. inject bacterial endotoxin (LPS) to mimic sepsis, or induce arthritis with collagen.
- **Genetically engineered** models (GEMMs): introduce a human disease mutation, e.g. mutant *SOD1* mice for ALS.
- **Xenografts**: human tumour cells (CDX) or patient tumour fragments (**PDX**) grown in **immunodeficient** mice so they are not rejected.
- **Humanised** mice: immunodeficient mice reconstituted with human immune cells or carrying human genes.

A model is judged on three kinds of **validity** (Willner 1984): *face* (it looks like the disease), *construct* (it has the same underlying cause) and *predictive* (drugs that work in it work in patients). Predictive validity is the one that matters most, and the one most rarely demonstrated.`,
    },
    {
      kind: 'match',
      prompt: 'Match each model to its best description.',
      pairs: [
        ['PDX model', 'Patient tumour tissue grown in an immunodeficient mouse'],
        ['GEMM', 'Mouse engineered to carry a disease-causing mutation'],
        ['LPS challenge', 'Bacterial endotoxin injected to provoke systemic inflammation'],
        ['Humanised mouse', 'Immunodeficient mouse given human immune cells or genes'],
      ],
      why: 'PDX = patient-derived xenograft; GEMM = genetically engineered mouse model; LPS (lipopolysaccharide) triggers innate immune responses resembling the early phase of sepsis; humanised mice put human biology inside a mouse.',
    },
    {
      kind: 'truefalse',
      prompt: 'Standard PDX mice are a good model for testing immune-checkpoint inhibitors such as anti-PD-1 antibodies.',
      answer: false,
      why: 'PDX mice must be immunodeficient so they do not reject the human tumour. Checkpoint inhibitors work by releasing the patient’s T cells, which these mice do not have. Immuno-oncology uses syngeneic mouse tumours in immunocompetent mice, or humanised mice.',
    },
    {
      kind: 'widget',
      title: 'Do mice respond like humans? A famous dispute',
      body: String.raw`Seok et al. (2013, *PNAS*) compared blood-leukocyte gene expression after trauma, burns and endotoxin. The three **human** conditions changed genes in strikingly similar ways. The corresponding **mouse** models, they reported, matched the human changes close to randomly, with $R^2$ roughly 0–0.1. That cast doubt on decades of mouse sepsis research.

Takao & Miyakawa (2015, *PNAS*) reanalysed the same data, restricting it to genes changed in *both* species, and reached the opposite conclusion: a strong correlation.

The lesson is not "mice are useless". It is that a **similarity metric depends on choices** (which genes, which time points, which tissues). Translation claims need explicit, pre-specified comparisons.`,
      widget: { type: 'SvgDiagram', props: { svg: seokSvg }, caption: 'Illustrative scatter only, not the published data. Left: two human injuries change the same genes in the same direction. Right: the scatter Seok et al. reported for mouse models.' },
    },
    {
      kind: 'explain',
      title: 'When animals were reassuring and wrong: TGN1412',
      body: String.raw`In March 2006, six healthy volunteers in London received TGN1412, an antibody that activates T cells through CD28. Within hours all six developed a life-threatening **cytokine storm** (Suntharalingam et al. 2006). Cynomolgus monkeys had tolerated doses hundreds of times higher.

A later explanation: the human CD4⁺ effector-memory T cells that drove the storm express CD28, whereas the corresponding monkey cells do not (Eastwood et al. 2010). The target sequence was conserved, but the cells carrying it were not.

Consequences: for high-risk agents, first-in-human doses are now often set from the **minimal anticipated biological effect level (MABEL)**, not only from animal toxicity, and volunteers are dosed one at a time.`,
    },
    {
      kind: 'mcq',
      prompt: 'What is the main general lesson of TGN1412 for preclinical safety assessment?',
      choices: [
        'Showing that the drug binds the animal version of its target is not enough; the target’s biology in that species must also match',
        'Monkeys should never be used in toxicology',
        'Antibodies cannot cause toxicity',
        'The starting dose was miscalculated arithmetically',
      ],
      answer: 0,
      why: 'TGN1412 bound monkey CD28, so cynomolgus monkeys looked like a relevant species. But the human cell population that drove the storm lacked CD28 in monkeys. "Relevant species" means similar pharmacology, not merely a conserved binding site. Primates remain essential for many biologics.',
    },
    {
      kind: 'explain',
      title: 'From animal dose to human dose',
      body: String.raw`Doses don't scale with body weight, because metabolic rate scales roughly with **body surface area**. The FDA (2005) guidance converts an animal dose to a **human equivalent dose** (HED) with species factors $K_m$ (body weight ÷ surface area):

$$\text{HED (mg/kg)} = \text{animal dose (mg/kg)} \times \frac{K_{m,\,animal}}{K_{m,\,human}}$$

with $K_m$ = 3 (mouse), 6 (rat), 12 (monkey), 20 (dog), 37 (adult human). A safety factor of (by default) **10** is then applied to the HED of the no-observed-adverse-effect level (NOAEL) to give the **maximum recommended starting dose** (MRSD).`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            'Find the **NOAEL** in each toxicology species. Example: rat NOAEL = 60 mg/kg.',
            String.raw`Convert to HED: $60 \times 6/37 = 9.73$ mg/kg.`,
            'Choose the **most appropriate species**, by default the most sensitive (lowest HED).',
            String.raw`Divide by the safety factor: $9.73/10 = 0.97$ mg/kg.`,
            String.raw`For a 60 kg adult: $0.97 \times 60 \approx 58$ mg as the maximum starting dose. Adjust down if pharmacologically active doses are lower.`,
          ],
        },
        caption: 'The FDA 2005 algorithm. A mouse needs ~12× more drug per kg than a human for similar exposure.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`An efficacy study in mice used 50 mg/kg. Using $K_m$(mouse) = 3 and $K_m$(human) = 37, what is the human equivalent dose in mg/kg?`,
      answer: 4.05,
      tolerance: 0.05,
      unit: 'mg/kg',
      why: String.raw`$\text{HED} = 50 \times 3/37 = 4.05$ mg/kg, about 12-fold lower than the mouse dose per kilogram. Scaling by body weight alone (50 mg/kg) would badly overdose a human; dividing the wrong way ($50\times37/3$) gives 617 mg/kg.`,
    },
    {
      kind: 'order',
      prompt: 'Put the steps of the FDA starting-dose algorithm in order.',
      steps: [
        'Determine the NOAEL in each toxicology species',
        'Convert each NOAEL to a human equivalent dose using body-surface-area factors',
        'Select the most appropriate (by default the most sensitive) species',
        'Divide by a safety factor (default 10) to get the maximum recommended starting dose',
        'Consider lowering the dose further based on the pharmacologically active dose',
      ],
      why: 'You need the NOAELs before you can convert them, and the conversion before you can compare species fairly. The safety factor applies to the chosen HED. The final pharmacology check guards against drugs that act at doses far below their toxic ones, the TGN1412 situation.',
    },
    {
      kind: 'explain',
      title: 'Rigour, reproducibility and the 3Rs',
      body: String.raw`Much translational failure comes from **weak experiments**, not only from species differences. When the ALS Therapy Development Institute re-tested more than 100 drugs in *SOD1* mice, many of them previously reported to extend survival, none showed a benefit. Small, unrandomised groups and uncontrolled factors such as sex, litter and transgene copy number explained much of the earlier "success" (Perrin 2014).

Good practice: randomise, blind the outcome assessors, calculate sample sizes in advance ([Experimental design](@stats/experimental-design)), include both sexes, and report by the **ARRIVE** guidelines (Kilkenny et al. 2010).

Ethically, animal work follows the **3Rs** of Russell & Burch (1959): **Replace** animals where possible, **Reduce** the numbers used, **Refine** procedures to minimise suffering. The US FDA Modernization Act 2.0 (2022) removed the statutory requirement for animal testing before human trials, opening the door to validated cell-based and computational alternatives.`,
    },
    {
      kind: 'fill',
      prompt: 'The 3Rs are: ___ animals with non-animal methods, ___ the number used, and ___ procedures to minimise suffering.',
      bank: ['Replace', 'Reduce', 'Refine', 'Repeat', 'Randomise', 'Report'],
      answer: ['Replace', 'Reduce', 'Refine'],
      why: 'Russell & Burch’s 3Rs: Replacement, Reduction, Refinement. Randomising and reporting belong to experimental rigour (ARRIVE), which also serves Reduction: a well-designed study needs fewer repeats.',
    },
    {
      kind: 'multi',
      prompt: 'Which practices make an animal efficacy study more likely to predict clinical results? (Select all that apply.)',
      choices: [
        'Randomly allocating animals to treatment groups',
        'Blinding the people who score outcomes',
        'Pre-specifying the sample size from a power calculation',
        'Using only one litter of animals to reduce variability',
        'Checking that the drug reaches exposures comparable to those achievable in humans',
      ],
      answers: [0, 1, 2, 4],
      why: 'Randomisation, blinding and power calculations remove bias and false positives. Matching exposure keeps the dose clinically relevant. A single litter confounds the treatment effect with family-specific genetics and rearing, and the result may not generalise; Perrin (2014) singles out litter effects.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Animals provide whole-body PK, efficacy and toxicity data; regulators expect one rodent and one non-rodent tox species.
- Model types (induced, GEMM, xenograft/PDX, humanised) differ in **face, construct and predictive validity**.
- Species differences can mislead in both directions (Seok 2013 and its rebuttal; TGN1412). "Relevant species" means matching biology, not just a conserved binding site.
- Dose conversion uses body surface area: $\text{HED} = \text{dose}\times K_{m,a}/K_{m,h}$, then a 10× safety factor from the NOAEL.
- Poor rigour (no randomisation, blinding or power) explains much translational failure. Follow ARRIVE and the 3Rs.
- Next stop: humans — [Clinical trial phases](@med/clinical-trial-phases).`,
    },
  ],
  references: [
    { authors: 'Seok, J., Warren, H. S., Cuenca, A. G., et al.', title: 'Genomic responses in mouse models poorly mimic human inflammatory diseases', year: 2013, venue: 'Proc. Natl Acad. Sci. USA 110, 3507–3512' },
    { authors: 'Takao, K., Miyakawa, T.', title: 'Genomic responses in mouse models greatly mimic human inflammatory diseases', year: 2015, venue: 'Proc. Natl Acad. Sci. USA 112, 1167–1172' },
    { authors: 'Suntharalingam, G., Perry, M. R., Ward, S., et al.', title: 'Cytokine storm in a phase 1 trial of the anti-CD28 monoclonal antibody TGN1412', year: 2006, venue: 'N. Engl. J. Med. 355, 1018–1028' },
    { authors: 'Eastwood, D., Findlay, L., Poole, S., et al.', title: 'Monoclonal antibody TGN1412 trial failure explained by species differences in CD28 expression on CD4+ effector memory T-cells', year: 2010, venue: 'Br. J. Pharmacol. 161, 512–526' },
    { authors: 'US Food and Drug Administration (CDER)', title: 'Guidance for Industry: Estimating the Maximum Safe Starting Dose in Initial Clinical Trials for Therapeutics in Adult Healthy Volunteers', year: 2005, venue: 'FDA' },
    { authors: 'Perrin, S.', title: 'Preclinical research: Make mouse studies work', year: 2014, venue: 'Nature 507, 423–425' },
  ],
} satisfies LessonContent;
