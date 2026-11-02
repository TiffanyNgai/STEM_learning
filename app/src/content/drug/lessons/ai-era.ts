import type { LessonContent } from '../../types';

const milestones: [string, string, string][] = [
  ['2012', 'Deep nets win Merck’s Kaggle activity challenge', 'var(--c2)'],
  ['2017', 'Message-passing GNNs; RL generative design (REINVENT)', 'var(--c2)'],
  ['2019', 'DDR1 inhibitors from a generative model in weeks', 'var(--c3)'],
  ['2020', 'Halicin found by a GNN; first AI-designed Phase 1 drug', 'var(--c3)'],
  ['2020–21', 'AlphaFold2: CASP14, then paper & database', 'var(--c1)'],
  ['2024', 'AlphaFold3; Nobel Prize for structure prediction & design', 'var(--c1)'],
  ['2025', 'AI-discovered TNIK inhibitor reports Phase 2a data', 'var(--c4)'],
];
const timelineSvg = `<svg viewBox="0 0 320 245" xmlns="http://www.w3.org/2000/svg">
<line x1="22" y1="12" x2="22" y2="236" stroke="var(--muted)" stroke-width="2"/>
${milestones.map(([when, what, col], i) => {
  const y = 14 + i * 32;
  return `<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${(i * 0.55).toFixed(2)}s" dur="0.5s" fill="freeze"/>
<circle cx="22" cy="${y + 7}" r="6" fill="${col}"/>
<text x="36" y="${y + 4}" font-size="9" fill="var(--muted)">${when}</text>
<text x="36" y="${y + 17}" font-size="9.5" font-weight="700" fill="var(--fg)">${what}</text></g>`;
}).join('\n')}
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Machine learning is not new here — deep learning is',
      body: String.raw`Drug discovery has used statistical learning since Hansch's [QSAR](@drug/qsar) equations in the 1960s, and small neural networks since the early 1990s. What changed after ~2012 was the combination of **deep learning**, **GPUs** and **large public datasets** (ChEMBL bioactivities, the Protein Data Bank).

A symbolic moment: in 2012 a team from Geoffrey Hinton's group won Merck's Kaggle molecular-activity challenge with multitask deep neural networks, and Merck scientists then published a systematic comparison showing deep nets usually beat random forests on QSAR tasks (Ma et al. 2015). The timeline below shows what followed.`,
      widget: { type: 'SvgDiagram', props: { svg: timelineSvg }, caption: 'Selected milestones. Prediction came first, then structure, then generation — and clinical proof is still arriving.' },
    },
    {
      kind: 'explain',
      title: 'Prediction: halicin',
      body: String.raw`Graph neural networks read a molecule as atoms (nodes) and bonds (edges) and learn their own features ([message passing](@drug/message-passing-networks); Gilmer et al. 2017; Chemprop, Yang et al. 2019).

Stokes et al. (Cell, 2020) trained such a model on about 2,300 molecules tested for growth inhibition of *E. coli*, then scored a drug-repurposing collection of ~6,000 compounds and over 100 million molecules from the ZINC15 database. A top prediction, structurally unlike known antibiotics, was **halicin** — previously investigated as a diabetes drug candidate — which killed many resistant bacteria in culture and in mouse infection models, apparently by disrupting the proton gradient across the bacterial membrane. Full story: [case study](@drug/case-halicin-baricitinib).`,
    },
    {
      kind: 'mcq',
      prompt: 'What made halicin a notable result for AI in drug discovery?',
      choices: [
        'It was generated de novo atom by atom by a generative model',
        'A model trained on a few thousand measured molecules picked out an active compound structurally unlike known antibiotics',
        'It was the first AI-discovered drug to receive full regulatory approval',
        'Its structure was predicted by AlphaFold2',
      ],
      answer: 1,
      why: 'Halicin was an existing molecule found by *virtual screening* with a learned property model; the point was that the model generalised beyond known antibiotic chemotypes. It was not generated, not approved, and AlphaFold predicts protein, not small-molecule, structures.',
    },
    {
      kind: 'explain',
      title: 'Structure: AlphaFold2',
      body: String.raw`At the CASP14 blind assessment (2020), DeepMind's **AlphaFold2** predicted protein structures from sequence with accuracy often comparable to experiment; the method was published by Jumper et al. (Nature, 2021). The AlphaFold Protein Structure Database (with EMBL-EBI) then released predictions for essentially the whole human proteome and, by 2022, over 200 million proteins. Demis Hassabis and John Jumper shared the 2024 Chemistry Nobel with David Baker (protein design).

For drug discovery this means a model for almost any target. Caveats: AF2 predicts one static state, without ligands; pocket side chains and flexible regions can be wrong; and its confidence scores (pLDDT, PAE) must be read. AlphaFold3 (2024) and RoseTTAFold All-Atom extend prediction to protein–ligand complexes. Details: [AlphaFold2](@drug/alphafold).`,
    },
    {
      kind: 'truefalse',
      prompt: 'AlphaFold2 directly predicts how tightly a drug binds its target protein.',
      answer: false,
      why: 'AlphaFold2 predicts the 3D structure of proteins (no ligands, no affinities). A predicted structure can feed docking or free-energy methods, but binding affinity is a separate, still hard, problem.',
    },
    {
      kind: 'explain',
      title: 'Generation: from VAEs to "designed in 21 days"',
      body: String.raw`Generative models propose *new* molecules optimised for desired properties: variational autoencoders with a continuous latent chemical space (Gómez-Bombarelli et al. 2018), and reinforcement learning on SMILES generators (REINVENT; Olivecrona et al. 2017). See [generative design](@drug/generative-molecular-design).

Zhavoronkov et al. (2019) reported DDR1 kinase inhibitors designed by a generative model in **21 days**, with a lead tested in mice within 46 days. Walters and Murcko (2020) pointed out that the best compound closely resembled a known, marketed kinase inhibitor and that the target had abundant prior data — speed on a well-trodden target says little about novelty or clinical value.`,
    },
    {
      kind: 'multi',
      prompt: 'Which are fair questions to ask of a claim like "AI designed a drug candidate in 21 days"?',
      choices: [
        'How similar are the molecules to known actives in the training data?',
        'How much prior data and chemistry already existed for this target?',
        'Was the target itself new, or already validated?',
        'How many GPUs were used?',
        'Has anything been shown about efficacy and safety in patients?',
      ],
      answers: [0, 1, 2, 4],
      why: 'Novelty, prior knowledge, target validity and clinical evidence determine value; hardware is irrelevant. Most of the cost and failure of drug discovery lies downstream of the design step.',
    },
    {
      kind: 'explain',
      title: 'Into the clinic',
      body: String.raw`- **DSP-1181** (Exscientia with Sumitomo Dainippon Pharma) was announced in 2020 as the first AI-designed molecule to enter Phase 1; it was later discontinued.
- **Baricitinib**, an approved JAK inhibitor, was proposed for COVID-19 by BenevolentAI using a knowledge graph (Richardson et al., Lancet, Feb 2020); trials confirmed benefit and it was approved for hospitalised COVID-19 patients — AI-assisted **repurposing**.
- **Rentosertib** (INS018_055, Insilico Medicine), a TNIK inhibitor for idiopathic pulmonary fibrosis, where AI was used to nominate both target and molecule, reported Phase 2a results in 2025 (Xu et al., *Nat. Med.*): a small 12-week trial whose primary endpoint was safety, with an encouraging but preliminary lung-function signal — see the [case study](@drug/case-rentosertib).

By the mid-2020s dozens of AI-derived molecules had entered trials, most still in early phases.`,
    },
    {
      kind: 'match',
      prompt: 'Match each AI-era example to what it demonstrated.',
      pairs: [
        ['Halicin', 'A learned property model can find new antibacterial chemotypes by virtual screening'],
        ['AlphaFold2', 'Accurate protein structures from sequence for almost any target'],
        ['DDR1 inhibitors (2019)', 'Fast generative design — but on a target with abundant prior data'],
        ['Baricitinib for COVID-19', 'Knowledge-graph–assisted repurposing of an approved drug'],
        ['Rentosertib', 'AI-nominated target and molecule reaching Phase 2 trials'],
      ],
      why: 'Each demonstrates a different stage — property prediction, structure, generation, repurposing, end-to-end discovery. None by itself shows that AI raises the probability of clinical success.',
    },
    {
      kind: 'widget',
      title: 'The hype filter: where success is decided',
      body: String.raw`The probability that a drug entering Phase 1 is approved is the **product** of the stage success rates: $P = p_1 \times p_2 \times p_3 \times p_{\text{reg}}$. An analysis of AI-derived molecules (Jayatunga et al. 2024) found high Phase 1 success (about 80–90 %) but Phase 2 success (about 40 %) similar to historical averages — on small numbers. Phase 2, where efficacy is first tested, is where most drugs fail. Here $p_{\text{reg}} = 0.9$; the x-axis is Phase 2 success.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['p1*x*p3*0.9', '0.6*x*0.6*0.9'],
          x: [0.1, 0.8], y: [0, 0.7],
          params: [
            { name: 'p1', min: 0.4, max: 0.95, value: 0.85, label: 'Phase 1 success' },
            { name: 'p3', min: 0.4, max: 0.9, value: 0.6, label: 'Phase 3 success' },
          ],
          labels: ['your pipeline', 'illustrative historical (p1 = p3 = 0.6)'],
          xLabel: 'Phase 2 success rate', yLabel: 'P(approval from Phase 1)',
        },
        caption: 'Illustrative numbers, not a forecast. Moving along the x-axis (better efficacy prediction) matters more than nudging Phase 1 — that is the improvement Eroom’s law needs.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Illustrative stage success rates: Phase 1 = 0.6, Phase 2 = 0.3, Phase 3 = 0.6, regulatory review = 0.9. What percentage of drugs entering Phase 1 are approved?`,
      answer: 9.72,
      tolerance: 0.1,
      unit: '%',
      why: String.raw`$0.6 \times 0.3 \times 0.6 \times 0.9 = 0.0972 \approx 9.7\%$. Raising Phase 1 success to 0.85 only lifts this to ~13.8 %; doubling Phase 2 success to 0.6 doubles it to ~19.4 %.`,
    },
    {
      kind: 'explain',
      title: 'Reading AI claims like a scientist',
      body: String.raw`A checklist inherited from every previous era's hype:
- **Prospective or retrospective?** Did anyone make and test new compounds?
- **Baseline?** Does the model beat fingerprints + random forest, or plain docking?
- **Split and leakage?** Random splits flatter models; scaffold or time splits are honest ([benchmarks](@drug/benchmarks-splits-leakage)).
- **Physical sanity?** PoseBusters (Buttenschoen et al. 2024) found many deep-learning docking poses physically implausible.
- **Endpoint?** Speed and hit rate are useful; clinical efficacy is what counts.

As with combinatorial chemistry and genomics, the technology is real; the question is whether it moves the bottleneck.`,
    },
    {
      kind: 'order',
      prompt: 'Order these AI-era events from earliest to latest.',
      steps: [
        'Deep nets win Merck’s molecular-activity Kaggle challenge',
        'Message-passing neural networks for molecules published (Gilmer et al.)',
        'Halicin reported in Cell',
        'AlphaFold2 paper published in Nature',
        'AlphaFold3 published',
      ],
      why: '2012 → 2017 → February 2020 → July 2021 → May 2024. Note AlphaFold2 first appeared at CASP14 in late 2020, after halicin; its paper came in 2021.',
    },
    {
      kind: 'fill',
      prompt: 'AI has clearly made discovery steps ___; whether it bends Eroom’s law depends on raising the success rate in Phase ___, where efficacy is first tested.',
      bank: ['faster', 'cheaper to approve', '2', '1', '4'],
      answer: ['faster', '2'],
      why: 'Phase 1 mainly tests safety and pharmacokinetics; Phase 2 is the first real efficacy test and the largest single source of attrition. Speed in discovery saves years but does not by itself change the odds.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- ML in drug discovery is old (QSAR); **deep learning + data + GPUs** since ~2012 is new.
- Landmarks: Merck Kaggle (2012), GNNs (2017), halicin (Stokes 2020), **AlphaFold2** (Jumper et al. 2021; Nobel 2024), AlphaFold3 (2024), generative design and AI-derived clinical candidates (DSP-1181, rentosertib).
- Critiques matter: novelty vs training data (Walters & Murcko), physically invalid poses (PoseBusters), leakage.
- Overall success is a product of stage rates; AI must improve **Phase 2 efficacy** to beat Eroom's law — the evidence is still coming in.`,
    },
  ],
  references: [
    { authors: 'Jumper, J., Evans, R., Pritzel, A., et al.', title: 'Highly accurate protein structure prediction with AlphaFold', year: 2021, venue: 'Nature 596, 583–589' },
    { authors: 'Stokes, J. M., Yang, K., Swanson, K., et al.', title: 'A deep learning approach to antibiotic discovery', year: 2020, venue: 'Cell 180, 688–702' },
    { authors: 'Zhavoronkov, A., Ivanenkov, Y. A., Aliper, A., et al.', title: 'Deep learning enables rapid identification of potent DDR1 kinase inhibitors', year: 2019, venue: 'Nat. Biotechnol. 37, 1038–1040' },
    { authors: 'Walters, W. P., Murcko, M.', title: 'Assessing the impact of generative AI on medicinal chemistry', year: 2020, venue: 'Nat. Biotechnol. 38, 143–145' },
    { authors: 'Jayatunga, M. K. P., Ayers, M., Bruens, L., Jayanth, D., Meier, C.', title: 'How successful are AI-discovered drugs in clinical trials? A first analysis and emerging lessons', year: 2024, venue: 'Drug Discov. Today 29, 104009' },
  ],
} satisfies LessonContent;
