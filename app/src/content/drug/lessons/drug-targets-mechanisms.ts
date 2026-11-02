import type { LessonContent } from '../../types';

const targetMapSvg = `<svg viewBox="0 0 320 230" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <text x="160" y="13" text-anchor="middle" font-size="11" font-weight="700" fill="var(--fg)">Where the main target classes sit in a cell</text>
  <text x="6" y="30" font-size="9" fill="var(--muted)">outside the cell</text>
  <rect x="0" y="62" width="320" height="16" fill="var(--c3)" fill-opacity="0.18"/>
  <line x1="0" y1="62" x2="320" y2="62" stroke="var(--c3)" stroke-width="1.5"/>
  <line x1="0" y1="78" x2="320" y2="78" stroke="var(--c3)" stroke-width="1.5"/>
  <text x="314" y="73" text-anchor="end" font-size="8" fill="var(--muted)">membrane</text>
  <text x="6" y="94" font-size="9" fill="var(--muted)">inside the cell</text>
  <!-- GPCR: seven helices -->
  <g stroke="var(--c2)" stroke-width="3" fill="none" stroke-linecap="round">
    <path d="M22,56 L22,84 M30,56 L30,84 M38,56 L38,84 M46,56 L46,84 M54,56 L54,84 M62,56 L62,84 M70,56 L70,84"/>
  </g>
  <circle cx="46" cy="30" r="5" fill="var(--c1)">
    <animate attributeName="cy" values="26;50;50;26" keyTimes="0;0.4;0.8;1" dur="4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="46" cy="100" r="6" fill="var(--c2)" fill-opacity="0.6">
    <animate attributeName="fill-opacity" values="0.15;0.15;0.8;0.15" keyTimes="0;0.4;0.6;1" dur="4s" repeatCount="indefinite"/>
  </circle>
  <text x="46" y="122" text-anchor="middle" font-size="9" font-weight="700" fill="var(--fg)">GPCR</text>
  <text x="46" y="133" text-anchor="middle" font-size="8" fill="var(--muted)">receptor → G protein</text>
  <!-- Ion channel -->
  <rect x="104" y="52" width="12" height="36" rx="4" fill="var(--c4)" fill-opacity="0.7"/>
  <rect x="128" y="52" width="12" height="36" rx="4" fill="var(--c4)" fill-opacity="0.7"/>
  <circle cx="122" cy="40" r="3" fill="var(--c3)"><animate attributeName="cy" values="36;104" dur="1.6s" repeatCount="indefinite"/></circle>
  <circle cx="122" cy="40" r="3" fill="var(--c3)"><animate attributeName="cy" values="36;104" dur="1.6s" begin="0.8s" repeatCount="indefinite"/></circle>
  <text x="122" y="122" text-anchor="middle" font-size="9" font-weight="700" fill="var(--fg)">ion channel</text>
  <text x="122" y="133" text-anchor="middle" font-size="8" fill="var(--muted)">pore for Na⁺, K⁺, Ca²⁺, Cl⁻</text>
  <!-- Transporter -->
  <path d="M182,50 L210,50 L204,90 L188,90 Z" fill="var(--c6)" fill-opacity="0.6"/>
  <rect x="192" y="40" width="8" height="8" fill="var(--c5)"><animate attributeName="y" values="36;60;100;100" keyTimes="0;0.4;0.8;1" dur="3s" repeatCount="indefinite"/></rect>
  <text x="196" y="122" text-anchor="middle" font-size="9" font-weight="700" fill="var(--fg)">transporter</text>
  <text x="196" y="133" text-anchor="middle" font-size="8" fill="var(--muted)">moves solutes across</text>
  <!-- RTK / kinase -->
  <rect x="262" y="38" width="8" height="54" rx="3" fill="var(--c5)" fill-opacity="0.6"/>
  <ellipse cx="266" cy="100" rx="14" ry="9" fill="var(--c5)" fill-opacity="0.35" stroke="var(--c5)"/>
  <text x="266" y="122" text-anchor="middle" font-size="9" font-weight="700" fill="var(--fg)">kinase</text>
  <text x="266" y="133" text-anchor="middle" font-size="8" fill="var(--muted)">enzyme adding phosphate</text>
  <!-- Enzyme -->
  <path d="M60,175 m-18,0 a18,18 0 1,0 36,-8 l-18,8 l18,8 a18,18 0 0,0 -36,-8 z" fill="var(--c1)" fill-opacity="0.35" stroke="var(--c1)"/>
  <circle cx="100" cy="172" r="5" fill="var(--c3)"><animate attributeName="cx" values="104;80;80;104" keyTimes="0;0.4;0.8;1" dur="3s" repeatCount="indefinite"/></circle>
  <text x="62" y="210" text-anchor="middle" font-size="9" font-weight="700" fill="var(--fg)">enzyme</text>
  <text x="62" y="221" text-anchor="middle" font-size="8" fill="var(--muted)">active site turns substrate over</text>
  <!-- Nucleus with nuclear receptor -->
  <ellipse cx="236" cy="184" rx="72" ry="34" fill="none" stroke="var(--muted)" stroke-dasharray="4 3"/>
  <text x="236" y="160" text-anchor="middle" font-size="8" fill="var(--muted)">nucleus</text>
  <path d="M180,195 q8,-8 16,0 t16,0 t16,0 t16,0 t16,0 t16,0" stroke="var(--fg)" fill="none" stroke-width="1.2"/>
  <rect x="226" y="176" width="22" height="14" rx="5" fill="var(--c4)" fill-opacity="0.6"><animate attributeName="y" values="166;180;180;166" keyTimes="0;0.4;0.8;1" dur="4s" repeatCount="indefinite"/></rect>
  <text x="236" y="212" text-anchor="middle" font-size="9" font-weight="700" fill="var(--fg)">nuclear receptor on DNA</text>
</svg>`;

const sitesSvg = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <text x="160" y="14" text-anchor="middle" font-size="11" font-weight="700" fill="var(--fg)">Orthosteric vs allosteric sites</text>
  <path d="M90,70 L140,70 L150,95 L170,95 L180,70 L230,70 L230,170 L90,170 Z" fill="var(--c2)" fill-opacity="0.25" stroke="var(--c2)" stroke-width="1.5"/>
  <path d="M230,115 L215,115 L215,140 L230,140" fill="none" stroke="var(--c2)" stroke-width="1.5"/>
  <circle cx="160" cy="40" r="9" fill="var(--c1)">
    <animate attributeName="cy" values="34;84;84;34" keyTimes="0;0.35;0.85;1" dur="5s" repeatCount="indefinite"/>
  </circle>
  <text x="112" y="42" text-anchor="end" font-size="9" fill="var(--fg)">natural ligand /</text>
  <text x="112" y="53" text-anchor="end" font-size="9" fill="var(--fg)">orthosteric drug</text>
  <polygon points="280,120 292,128 280,136" fill="var(--c4)">
    <animateTransform attributeName="transform" type="translate" values="0,0;-62,0;-62,0;0,0" keyTimes="0;0.35;0.85;1" dur="5s" repeatCount="indefinite"/>
  </polygon>
  <text x="300" y="110" text-anchor="end" font-size="9" fill="var(--fg)">allosteric</text>
  <text x="300" y="150" text-anchor="end" font-size="9" fill="var(--fg)">modulator</text>
  <text x="160" y="186" text-anchor="middle" font-size="9" fill="var(--muted)">The modulator binds elsewhere and reshapes the orthosteric site.</text>
  <path d="M150,95 L170,95" stroke="var(--c4)" stroke-width="3">
    <animate attributeName="stroke-opacity" values="0;0;1;1;0" keyTimes="0;0.3;0.4;0.85;1" dur="5s" repeatCount="indefinite"/>
  </path>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'One disease, four different levers',
      body: String.raw`High blood pressure can be treated by drugs that act on four *completely different kinds* of protein:

- **lisinopril** inhibits an **enzyme** (angiotensin-converting enzyme, ACE) so less of the vessel-tightening hormone angiotensin II is made;
- **losartan** blocks a **receptor** (the AT₁ receptor) that angiotensin II acts on;
- **amlodipine** blocks an **ion channel** (L-type calcium channels in vessel muscle);
- **hydrochlorothiazide** blocks a **transporter** (a sodium–chloride co-transporter in the kidney).

The protein a drug acts on is its **target**; *what the drug does to it* is its **mechanism of action**. This lesson maps both.`,
    },
    {
      kind: 'recall',
      title: 'Receptors and drug action (from Medicine)',
      points: [
        'Receptors bind a signal (hormone, neurotransmitter) and convert it into a cellular response.',
        'Four receptor superfamilies: ligand-gated ion channels, G-protein-coupled receptors, enzyme-linked receptors (e.g. kinases), nuclear receptors.',
        '**Agonists** bind and activate; **antagonists** bind and block activation; **partial agonists** give a sub-maximal response.',
        'Occupancy follows $[DR]/[R]_{tot} = [D]/([D]+K_d)$.',
      ],
      link: 'med/drug-receptor-interactions',
    },
    {
      kind: 'explain',
      title: 'How many targets are there?',
      body: String.raw`Surprisingly few. Overington, Al-Lazikani & Hopkins (2006) counted **324** molecular targets for all approved drugs. A larger curation by Santos et al. (2017) found about **667 human proteins** that are efficacy targets of approved drugs (plus a couple of hundred proteins from bacteria, viruses and parasites).

Humans have roughly **20,000** protein-coding genes, so medicine currently works through only a few percent of them.

A handful of families dominate: **G-protein-coupled receptors** (GPCRs, targets of about a third of approved drugs; Hauser et al. 2017), **ion channels**, **protein kinases** (a fast-growing class since imatinib in 2001) and **nuclear receptors**.`,
      widget: { type: 'SvgDiagram', props: { svg: targetMapSvg }, caption: 'Major target classes. Membrane proteins (GPCRs, channels, transporters) can be reached from outside the cell, and that is one reason they are so heavily drugged.' },
    },
    {
      kind: 'mcq',
      prompt: 'Roughly what fraction of human protein-coding genes are efficacy targets of approved drugs?',
      choices: ['About 0.01%', 'About 3–4%', 'About 30%', 'About 90%'],
      answer: 1,
      why: String.raw`About 667 out of ~20,000 genes is $\approx 3.3\%$. Most of the proteome has never been drugged. The next lesson asks whether that is because those proteins are irrelevant to disease or simply hard to bind.`,
    },
    {
      kind: 'explain',
      title: 'Enzymes: stop the chemistry',
      body: String.raw`An **enzyme** speeds up one chemical reaction at its **active site** (see [enzymes](@bio/enzymes)). Most enzyme drugs are **inhibitors**:

- **Reversible, competitive**: the drug occupies the active site, competing with the substrate. *Statins* block HMG-CoA reductase in cholesterol synthesis.
- **Covalent, irreversible**: the drug forms a chemical bond with the enzyme. *Aspirin* transfers an acetyl group onto a serine of cyclo-oxygenase; *penicillin* acylates bacterial cell-wall enzymes.
- **Transition-state mimics** imitate the short-lived high-energy shape of the reaction, which the enzyme binds extremely tightly. Many *HIV protease inhibitors* are designed this way.
- **Kinase inhibitors** such as imatinib usually compete with ATP, the phosphate donor.

The kinetics of each mode is covered in [inhibition modes](@drug/enzyme-inhibition-modes).`,
    },
    {
      kind: 'explain',
      title: 'Receptors, channels, transporters, nuclear receptors',
      body: String.raw`- **Receptors** (mostly GPCRs): *agonists* switch them on (salbutamol opens airways via β₂-adrenergic receptors). *Antagonists* block them (losartan). **Inverse agonists** go further and reduce the receptor's *spontaneous* activity below baseline. Many H₁ "antihistamines" behave this way.
- **Ion channels**: *blockers* plug or close the pore (lidocaine blocks voltage-gated Na⁺ channels to numb nerves). *Openers* do the reverse.
- **Transporters**: *inhibitors* stop solute movement. SSRIs such as fluoxetine block the serotonin transporter, and SGLT2 inhibitors make the kidney excrete glucose.
- **Nuclear receptors** are transcription factors switched by ligands: dexamethasone activates the glucocorticoid receptor, and tamoxifen modulates the oestrogen receptor.`,
    },
    {
      kind: 'match',
      prompt: 'Match each drug to its target class and mechanism.',
      pairs: [
        ['Lisinopril', 'Enzyme inhibitor (ACE)'],
        ['Losartan', 'GPCR antagonist (AT₁ receptor)'],
        ['Lidocaine', 'Ion-channel blocker (voltage-gated Na⁺)'],
        ['Fluoxetine', 'Transporter inhibitor (serotonin transporter)'],
        ['Dexamethasone', 'Nuclear-receptor agonist (glucocorticoid receptor)'],
      ],
      why: 'Each class has a typical mechanism: enzymes are inhibited, receptors are agonised or antagonised, channels are blocked or opened, transporters are inhibited, and nuclear receptors are activated or modulated to change gene expression.',
    },
    {
      kind: 'explain',
      title: 'Orthosteric vs allosteric',
      body: String.raw`The **orthosteric site** is where the protein's natural ligand or substrate binds. Most classic drugs bind there and compete with it.

An **allosteric site** is somewhere else on the protein. A drug binding there changes the protein's shape, and that changes how the orthosteric site behaves:

- **PAM** (positive allosteric modulator): boosts the natural ligand's effect. Benzodiazepines make the GABA-A receptor respond more strongly to GABA.
- **NAM** (negative allosteric modulator): dampens it.
- **Allosteric inhibitors** of enzymes, e.g. trametinib (MEK) and asciminib (BCR-ABL, which binds the myristoyl pocket rather than the ATP site).

Why bother? Allosteric pockets are usually **less conserved** across protein families than active sites, so selectivity is easier. Their effect also has a **ceiling**, as the next card shows.`,
      widget: { type: 'SvgDiagram', props: { svg: sitesSvg }, caption: 'Two different binding sites on one protein. They are coupled through the protein\'s shape.' },
    },
    {
      kind: 'widget',
      title: 'Playing with an allosteric modulator',
      body: String.raw`In the simplest allosteric model, a modulator B at concentration $[B]$ (dissociation constant $K_B$) changes the agonist's affinity by a **cooperativity factor** $\alpha$ ($\alpha>1$ PAM, $\alpha<1$ NAM). The agonist's apparent EC₅₀ becomes

$$\mathrm{EC_{50}^{app}} = \mathrm{EC_{50}}\,\frac{1+[B]/K_B}{1+\alpha[B]/K_B}.$$

Set $b=[B]/K_B$ and drag it up. Notice that the curve **stops moving**: at saturating modulator the shift is capped at a factor of $\alpha$. A competitive antagonist ($\alpha=0$) has no such cap.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['100*10^x/(10^x+1)', '100*10^x/(10^x+(1+b)/(1+a*b))'],
          x: [-3, 3], y: [0, 125],
          params: [
            { name: 'a', min: 0.05, max: 20, value: 10, label: 'α (cooperativity)' },
            { name: 'b', min: 0, max: 100, value: 1, label: '[B]/K_B' },
          ],
          labels: ['agonist alone', 'agonist + modulator'],
          xLabel: 'log₁₀([A]/EC₅₀)', yLabel: '% response',
        },
        caption: 'Affinity-only allosteric ternary complex model (agonist efficacy unchanged).',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A PAM has cooperativity $\alpha = 10$ and is present at $[B]/K_B = 9$. By what factor does the agonist's EC₅₀ **decrease**? (one decimal place)`,
      answer: 9.1,
      tolerance: 0.1,
      unit: '×',
      why: String.raw`$\mathrm{EC_{50}^{app}}/\mathrm{EC_{50}} = (1+9)/(1+10\cdot 9) = 10/91$, so EC₅₀ falls by $91/10 = 9.1$-fold. Even at infinite $[B]$ it could only fall 10-fold ($=\alpha$). That is the allosteric ceiling.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`A competitive antagonist and a negative allosteric modulator with $\alpha = 0.1$ can both shift the agonist curve to the right **without limit** if you add enough of them.`,
      answer: false,
      why: String.raw`For a competitive antagonist the shift factor is $1+[B]/K_B$, which grows without bound. For the NAM it is $(1+b)/(1+0.1b)$, which levels off at $1/\alpha = 10$. This saturable effect can make allosteric drugs safer in overdose.`,
    },
    {
      kind: 'explain',
      title: 'Beyond the classic classes',
      body: String.raw`- **Protein–protein interactions (PPIs)**: venetoclax binds BCL-2 in the groove where pro-death partner proteins normally bind, which releases apoptosis in leukaemia cells. PPIs were long thought too flat to drug. See [druggability](@drug/druggability).
- **Nucleic acids**: oligonucleotides target mRNA, and some small molecules bind RNA (risdiplam modifies SMN2 splicing). See [new modalities](@drug/new-modalities).
- **Polypharmacology**: most drugs hit more than one protein. Imatinib inhibits ABL, KIT and PDGFR, and its KIT activity is why it also treats gastrointestinal stromal tumours. Off-targets cause side effects and occasionally new uses.

Knowing the target class tells a computational chemist which structures, assays and tools are relevant: kinase hinge binders, GPCR cryo-EM structures, channel electrophysiology, and so on.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about allosteric modulators are correct? (Select all that apply.)',
      choices: [
        'They bind at a site distinct from the natural ligand’s site',
        'A pure PAM can amplify the natural signal, often with little effect when no natural ligand is present',
        'Allosteric sites are usually *more* conserved across a protein family than active sites',
        'Their maximal effect on agonist potency is limited by the cooperativity factor',
      ],
      answers: [0, 1, 3],
      why: 'Allosteric sites are generally *less* conserved than orthosteric ones, and that is the selectivity advantage. A pure PAM only changes how the receptor responds to its own ligand, so it preserves the timing and location of natural signalling. Its effect saturates at the cooperativity limit.',
    },
    {
      kind: 'fill',
      prompt: 'A drug that switches a receptor on is an ___ ; one that blocks activation without effect on its own is an ___ ; one that suppresses the receptor’s spontaneous basal activity is an ___ .',
      bank: ['agonist', 'antagonist', 'inverse agonist', 'allosteric site', 'substrate'],
      answer: ['agonist', 'antagonist', 'inverse agonist'],
      why: 'Agonists produce a response, neutral antagonists only prevent other ligands from producing one, and inverse agonists push constitutively active receptors *below* baseline. "Allosteric site" is a location, not a mechanism.',
    },
    {
      kind: 'mcq',
      prompt: 'You want to strengthen a natural neurotransmitter’s signal **only where and when it is released**, avoiding constant stimulation. Which mechanism fits best?',
      choices: ['A full orthosteric agonist', 'A positive allosteric modulator', 'An irreversible covalent antagonist', 'An inverse agonist'],
      answer: 1,
      why: 'A PAM amplifies the receptor’s response to its endogenous ligand, so its effect follows the natural release pattern. A full agonist would stimulate every receptor it reaches all the time. The antagonist and inverse agonist would reduce signalling instead.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A **target** is the molecule a drug acts on. The **mechanism of action** is what it does there.
- Approved drugs act on only ~700 human proteins (Santos et al. 2017), dominated by GPCRs, ion channels, kinases and nuclear receptors.
- Enzymes are inhibited (reversibly, covalently or with transition-state mimics). Receptors are agonised, antagonised or inverse-agonised. Channels are blocked or opened. Transporters are inhibited.
- **Allosteric** drugs bind away from the natural site. They can be more selective, and their effect is capped by the cooperativity $\alpha$.
- Most drugs hit several proteins (**polypharmacology**). Off-targets matter for both safety and repurposing.`,
    },
  ],
  references: [
    { authors: 'Overington, J. P., Al-Lazikani, B., Hopkins, A. L.', title: 'How many drug targets are there?', year: 2006, venue: 'Nat. Rev. Drug Discov. 5, 993–996' },
    { authors: 'Santos, R., Ursu, O., Gaulton, A., et al.', title: 'A comprehensive map of molecular drug targets', year: 2017, venue: 'Nat. Rev. Drug Discov. 16, 19–34' },
    { authors: 'Hauser, A. S., Attwood, M. M., Rask-Andersen, M., Schiöth, H. B., Gloriam, D. E.', title: 'Trends in GPCR drug discovery: new agents, targets and indications', year: 2017, venue: 'Nat. Rev. Drug Discov. 16, 829–842' },
    { authors: 'Christopoulos, A., Kenakin, T.', title: 'G protein-coupled receptor allosterism and complexing', year: 2002, venue: 'Pharmacol. Rev. 54, 323–374' },
    { authors: 'Patrick, G. L.', title: 'An Introduction to Medicinal Chemistry', year: 2017, venue: '6th ed., Oxford University Press' },
  ],
} satisfies LessonContent;
