import type { LessonContent } from '../../types';

const eras: [string, string, string][] = [
  ['1800s–1940s', 'Natural products & serendipity', 'var(--c1)'],
  ['1900s–1970s', 'Receptor theory & pharmacology', 'var(--c6)'],
  ['1970s–1990s', 'Rational / structure-based design', 'var(--c2)'],
  ['1990s–2000s', 'Combichem, HTS, genomics', 'var(--c3)'],
  ['2000s–2010s', 'Fragments, DELs, phenotypic revival', 'var(--c4)'],
  ['2010s–now', 'Deep learning, AlphaFold, generative AI', 'var(--c5)'],
];
const timelineSvg = `<svg viewBox="0 0 320 230" xmlns="http://www.w3.org/2000/svg">
<line x1="22" y1="12" x2="22" y2="220" stroke="var(--muted)" stroke-width="2"/>
${eras.map(([when, what, col], i) => {
  const y = 20 + i * 35;
  return `<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${(i * 0.5).toFixed(1)}s" dur="0.5s" fill="freeze"/>
<circle cx="22" cy="${y + 6}" r="7" fill="${col}"/>
<text x="38" y="${y + 3}" font-size="9" fill="var(--muted)">${when}</text>
<text x="38" y="${y + 16}" font-size="11" font-weight="700" fill="var(--fg)">${what}</text></g>`;
}).join('\n')}
</svg>`;

const lockKeySvg = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
<path d="M40,40 h90 v30 h-20 v-14 h-20 v30 h-20 v-16 h-30 z" fill="var(--c2)" fill-opacity="0.3" stroke="var(--c2)" stroke-width="2"/>
<text x="85" y="30" text-anchor="middle" font-size="10" fill="var(--fg)" font-weight="700">target pocket (from X-ray)</text>
<g>
<animateTransform attributeName="transform" type="translate" values="0,60; 0,0; 0,0" keyTimes="0;0.6;1" dur="3s" repeatCount="indefinite"/>
<path d="M90,56 h20 v14 h-20 z M70,56 h20 v30 h-20 z" fill="var(--c3)" fill-opacity="0.7" stroke="var(--c3)"/>
</g>
<text x="230" y="60" text-anchor="middle" font-size="10" fill="var(--fg)">design the ligand to</text>
<text x="230" y="74" text-anchor="middle" font-size="10" fill="var(--fg)">fit the measured shape</text>
<text x="230" y="98" text-anchor="middle" font-size="9" fill="var(--muted)">(Fischer’s lock-and-key, 1894,</text>
<text x="230" y="110" text-anchor="middle" font-size="9" fill="var(--muted)">made quantitative)</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Every era added a tool',
      body: String.raw`Drug discovery history is not a story of old methods being replaced — it's a story of **tools being added to the toolbox**. Natural products are still screened; receptor pharmacology still underpins every assay; structure-based design and HTS are routine; AI is the newest layer.

Knowing *why* each era began (and what it over-promised) is the best defence against today's hype.`,
      widget: { type: 'SvgDiagram', props: { svg: timelineSvg }, caption: 'Rough eras — they overlap heavily and all are still in use.' },
    },
    {
      kind: 'explain',
      title: 'Nature and luck',
      body: String.raw`For most of history, medicines came from plants, fungi and accident:
- **Willow bark** → salicylic acid → **aspirin** (Bayer, 1899), a chemically tamed natural product.
- **Penicillin**: Fleming (1928; published 1929) noticed a *Penicillium* mould killing bacteria on a contaminated plate; Florey, Chain and Heatley turned it into a drug in the 1940s.
- **Artemisinin** (antimalarial, from sweet wormwood) and **taxol** (anticancer, from yew bark) followed later.

Natural products have been shaped by evolution to bind proteins, which is why a large share of approved small molecules are natural products or derived from them.`,
    },
    {
      kind: 'explain',
      title: 'The receptor idea',
      body: String.raw`Around 1900, Paul **Ehrlich** ("*corpora non agunt nisi fixata*" — substances don't act unless bound) and John **Langley** (1905, the "receptive substance") proposed that drugs act by binding specific cellular molecules: **receptors**.

A. J. Clark then made it quantitative: drug effect follows occupancy of receptors, which follows the law of mass action. James **Black** used this framework to design **propranolol** (β-blocker) and **cimetidine** (H₂ antagonist) by systematically modifying the natural ligand — pharmacology-driven "rational" design before protein structures were available.`,
    },
    {
      kind: 'recall',
      title: 'Pharmacodynamics (from Medicine)',
      points: [
        'Drugs bind targets reversibly; occupancy rises with concentration and saturates.',
        '**Agonists** activate a receptor; **antagonists** bind without activating and block agonists.',
        '**Potency** (EC50) and **efficacy** (maximal effect) are different properties.',
        'Concentration–response curves are sigmoidal on a log-concentration axis.',
      ],
      link: 'med/pharmacodynamics',
    },
    {
      kind: 'mcq',
      prompt: 'Fleming’s discovery of penicillin (1928) is the classic example of…',
      choices: ['Structure-based design', 'Serendipity with a natural product', 'High-throughput screening', 'Combinatorial chemistry'],
      answer: 1,
      why: 'Fleming noticed by chance that a contaminating mould killed bacteria — a natural product found by luck. No target structure, screen or library was involved; those came decades later.',
    },
    {
      kind: 'explain',
      title: 'Designing from the target’s structure',
      body: String.raw`Once X-ray crystallography could reveal a protein's 3D shape, chemists could design molecules to **fit the pocket**.
- **Captopril** (1977, Cushman & Ondetti): the first orally active ACE inhibitor for blood pressure, designed using a model of the active site inferred from a related enzyme, carboxypeptidase A.
- **HIV protease inhibitors** (saquinavir 1995, ritonavir, indinavir…): designed from crystal structures of the viral protease as transition-state mimics — a central success of structure-based design that helped turn AIDS into a manageable disease.
- **Imatinib** (Gleevec, 2001): a kinase inhibitor targeting BCR-ABL in chronic myeloid leukaemia — the poster child of *targeted* therapy. Its lead came from a kinase screen and was then optimised by medicinal chemistry, not designed from a crystal structure: *target-based* is broader than *structure-based*.`,
      widget: { type: 'SvgDiagram', props: { svg: lockKeySvg }, caption: 'Structure-based design: shape and chemistry of the ligand are tailored to a measured pocket.' },
    },
    {
      kind: 'match',
      prompt: 'Match each drug to its discovery story.',
      pairs: [
        ['Penicillin', 'Chance observation of a mould on a culture plate'],
        ['Captopril', 'Active-site model of ACE, guided by a related enzyme'],
        ['Saquinavir / ritonavir', 'Crystal structures of HIV protease'],
        ['Imatinib', 'Targeted inhibitor of the BCR-ABL kinase'],
        ['Propranolol', 'Systematic analogues of a natural receptor ligand'],
      ],
      why: 'These are the canonical milestones: serendipity (penicillin), receptor pharmacology (propranolol), and the rise of target- and structure-based design (captopril, HIV protease inhibitors, imatinib).',
    },
    {
      kind: 'explain',
      title: 'Industrialisation: combichem, HTS and genomics',
      body: String.raw`In the 1990s, **combinatorial chemistry** made huge libraries by mixing building blocks, and **high-throughput screening** robots tested $10^5$–$10^6$ compounds per campaign. The **Human Genome Project** (2001) promised thousands of new targets.

The result was sobering: more compounds and more targets did *not* produce more drugs. Many combichem libraries were flat, greasy and un-drug-like, and many genomic targets were poorly validated. Eroom's law (Scannell et al. 2012) continued.`,
    },
    {
      kind: 'truefalse',
      prompt: 'The arrival of HTS and combinatorial chemistry in the 1990s led to a sharp rise in the number of new drugs approved per dollar spent.',
      answer: false,
      why: 'R&D efficiency kept *falling* through this era (Scannell et al. 2012). Volume of compounds was not the bottleneck — quality of targets and molecules, and clinical efficacy, were.',
    },
    {
      kind: 'explain',
      title: 'Smarter starting points',
      body: String.raw`Three responses to the HTS hangover:
- **Fragment-based discovery**: screen small molecules (< ~300 Da) that bind weakly but efficiently, detected by NMR or X-ray, then grow them. Started with "SAR by NMR" (Shuker et al. 1996); vemurafenib (2011) was the first approved fragment-derived drug (Erlanson et al. 2016).
- **DNA-encoded libraries (DELs)**: each molecule carries a DNA barcode, so billions can be screened together and read out by sequencing (Clark et al. 2009).
- **Phenotypic screening revival**: Swinney & Anthony (2011) found that, of first-in-class drugs approved 1999–2008, more came from **phenotypic** screens (measure a cell or organism effect without presupposing the target) than from target-based ones.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about these "smarter starting points" are correct?',
      choices: [
        'Fragments bind weakly but can be grown into potent leads',
        'DNA-encoded libraries identify binders by sequencing their barcodes',
        'Phenotypic screens require knowing the target in advance',
        'Vemurafenib was the first approved drug derived from fragment screening',
      ],
      answers: [0, 1, 3],
      why: 'Phenotypic screens are defined by **not** requiring a known target — that is their strength (finding unexpected mechanisms) and their weakness (you must later work out the mechanism).',
    },
    {
      kind: 'explain',
      title: 'The AI era',
      body: String.raw`Since ~2015, deep learning has entered every stage:
- **Property prediction**: graph neural networks found the antibiotic **halicin** in a repurposing library (Stokes et al. 2020).
- **Structure prediction**: **AlphaFold2** (Jumper et al. 2021) made often-accurate protein models available for most known sequences (flexible and disordered regions remain weak spots); AlphaFold3 (2024) extends this to protein–ligand complexes.
- **Generative design**: models propose new molecules; the TNIK inhibitor **rentosertib** (INS018_055), with both target and molecule nominated using AI, reached Phase 2 trials.
- **Quantum computing** is being explored for hard quantum-chemistry sub-problems — still pre-practical.

Whether AI bends Eroom's law depends on improving *clinical* success, not just speed — the jury is still out.`,
    },
    {
      kind: 'order',
      prompt: 'Order these milestones from earliest to latest.',
      steps: ['Fleming observes penicillin', 'Captopril designed as an ACE inhibitor', 'Imatinib approved for CML', 'AlphaFold2 published', 'AI-designed rentosertib reports Phase 2 results'],
      why: 'Penicillin 1928 → captopril 1977 → imatinib 2001 → AlphaFold2 2021 → rentosertib Phase 2a results ~2025. Each built on the tools of the previous era.',
    },
    {
      kind: 'fill',
      prompt: 'Screening that measures a cell effect without a pre-chosen target is ___ screening; screening a purified protein is ___ screening.',
      bank: ['phenotypic', 'target-based', 'virtual', 'fragment'],
      answer: ['phenotypic', 'target-based'],
      why: 'The two philosophies complement each other: phenotypic screens capture complex biology and can find new mechanisms; target-based screens are easier to optimise and interpret.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Eras: **natural products & serendipity → receptor theory → structure-based design → HTS/combichem/genomics → fragments, DELs, phenotypic revival → AI & AlphaFold**.
- Landmarks: penicillin, propranolol/cimetidine, captopril, HIV protease inhibitors, imatinib, vemurafenib, halicin.
- More compounds and more targets did **not** automatically mean more drugs — target quality and clinical efficacy are the bottleneck.
- Judge new technologies (including AI and quantum) by whether they improve that bottleneck.`,
    },
  ],
  references: [
    { authors: 'Drews, J.', title: 'Drug discovery: a historical perspective', year: 2000, venue: 'Science 287, 1960–1964' },
    { authors: 'Swinney, D. C., Anthony, J.', title: 'How were new medicines discovered?', year: 2011, venue: 'Nat. Rev. Drug Discov. 10, 507–519' },
    { authors: 'Fleming, A.', title: 'On the antibacterial action of cultures of a penicillium, with special reference to their use in the isolation of B. influenzae', year: 1929, venue: 'Br. J. Exp. Pathol. 10, 226–236' },
    { authors: 'Cushman, D. W., Cheung, H. S., Sabo, E. F., Ondetti, M. A.', title: 'Design of potent competitive inhibitors of angiotensin-converting enzyme. Carboxyalkanoyl and mercaptoalkanoyl amino acids', year: 1977, venue: 'Biochemistry 16, 5484–5491' },
    { authors: 'Erlanson, D. A., Fesik, S. W., Hubbard, R. E., Jahnke, W., Jhoti, H.', title: 'Twenty years on: the impact of fragments on drug discovery', year: 2016, venue: 'Nat. Rev. Drug Discov. 15, 605–619' },
  ],
} satisfies LessonContent;
