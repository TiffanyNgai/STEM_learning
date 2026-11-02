import type { LessonContent } from '../../types';

const dmtaSvg = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
<g font-size="10" font-weight="700" text-anchor="middle">
<circle cx="160" cy="95" r="62" fill="none" stroke="var(--grid)" stroke-width="10"/>
<circle cx="160" cy="95" r="62" fill="none" stroke="var(--c2)" stroke-width="10" stroke-dasharray="40 350" stroke-linecap="round">
<animateTransform attributeName="transform" type="rotate" from="0 160 95" to="360 160 95" dur="5s" repeatCount="indefinite"/></circle>
<rect x="122" y="10" width="76" height="24" rx="8" fill="var(--c1)" fill-opacity="0.25" stroke="var(--c1)"/><text x="160" y="26" fill="var(--fg)">Design</text>
<rect x="232" y="83" width="76" height="24" rx="8" fill="var(--c3)" fill-opacity="0.25" stroke="var(--c3)"/><text x="270" y="99" fill="var(--fg)">Make</text>
<rect x="122" y="156" width="76" height="24" rx="8" fill="var(--c4)" fill-opacity="0.25" stroke="var(--c4)"/><text x="160" y="172" fill="var(--fg)">Test</text>
<rect x="12" y="83" width="76" height="24" rx="8" fill="var(--c6)" fill-opacity="0.25" stroke="var(--c6)"/><text x="50" y="99" fill="var(--fg)">Analyse</text>
<text x="160" y="92" fill="var(--fg)" font-size="9">one cycle ≈</text><text x="160" y="105" fill="var(--fg)" font-size="9">weeks</text>
</g></svg>`;

const eroomSvg = `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
<g font-size="9" fill="var(--muted)">
<line x1="40" y1="20" x2="40" y2="150" stroke="var(--fg)"/><line x1="40" y1="150" x2="305" y2="150" stroke="var(--fg)"/>
<text x="44" y="16" fill="var(--fg)">new drugs per $1B R&amp;D (log scale, inflation-adjusted)</text>
<text x="34" y="34" text-anchor="end">100</text><text x="34" y="74" text-anchor="end">10</text><text x="34" y="114" text-anchor="end">1</text><text x="34" y="150" text-anchor="end">0.1</text>
<text x="50" y="163">1950</text><text x="115" y="163">1970</text><text x="180" y="163">1990</text><text x="245" y="163">2010</text>
<path d="M50,36 L115,63 L180,90 L245,116" stroke="var(--c5)" stroke-width="3" fill="none" stroke-dasharray="300" stroke-dashoffset="300">
<animate attributeName="stroke-dashoffset" values="300;0" dur="2.5s" fill="freeze"/></path>
<text x="200" y="60" fill="var(--c5)" font-weight="700" font-size="10">≈ halves every 9 years</text>
<text x="200" y="74" fill="var(--muted)">(schematic of Scannell et al. 2012)</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'From idea to medicine',
      body: String.raw`Making a new medicine is less like inventing a gadget and more like running a **tournament with thousands of entrants and one winner**. Each round eliminates candidates for a different reason: they don't hit the target, they can't be absorbed, they're toxic, or they simply don't help patients.

The whole tournament typically takes **10–15 years** and, averaged over the failures, on the order of **USD 2.6 billion** per approved drug (DiMasi et al. 2016, including the cost of capital). This lesson walks the rounds in order.`,
    },
    {
      kind: 'widget',
      title: 'The attrition funnel',
      body: 'Press play and watch roughly ten thousand compounds shrink to one approved drug. Tap a stage for its typical size, duration and cost.',
      widget: { type: 'DrugPipelineFunnel', props: {}, caption: 'Rough, commonly quoted industry figures; real programmes vary enormously by disease area and modality.' },
    },
    {
      kind: 'explain',
      title: '1 · Target identification & validation',
      body: String.raw`A **target** is the molecule (usually a protein) whose activity you want to change — e.g. an enzyme that is overactive in a cancer.

- **Identification**: find candidate targets from genetics (e.g. people with a loss-of-function variant are protected from heart disease), omics data, CRISPR screens or the literature.
- **Validation**: build confidence that changing the target will actually change the disease — knockouts, tool compounds, animal models, human genetics.

Targets with human genetic support are roughly **twice as likely** to succeed clinically (Nelson et al. 2015). A wrong target can't be rescued by a brilliant molecule.`,
    },
    {
      kind: 'explain',
      title: '2 · Hit identification',
      body: String.raw`A **hit** is any compound that reproducibly does something to the target in an assay, usually weakly (micromolar potency).

Ways to find hits:
- **High-throughput screening (HTS)**: robotically test $10^5$–$10^6$ compounds.
- **Virtual screening**: dock or score millions to billions of molecules *in silico* and test the top few hundred.
- **Fragment screening**: find tiny, weak binders by biophysics, then grow them.
- **DNA-encoded libraries**: screen billions of barcoded molecules in one tube.
- **Knowledge-based**: start from a natural ligand, a known drug or a competitor's patent.`,
    },
    {
      kind: 'mcq',
      prompt: 'A team docks 1 billion virtual molecules and buys the top 500 to test. Which pipeline stage is this?',
      choices: ['Target validation', 'Hit identification', 'Lead optimisation', 'Phase I'],
      answer: 1,
      why: 'Virtual screening is a way to **find hits** — starting points that do something to an already chosen target. Target validation happens before (is this the right protein?) and lead optimisation after (polishing a chosen series).',
    },
    {
      kind: 'explain',
      title: '3–4 · Hit-to-lead and lead optimisation',
      body: String.raw`**Hit-to-lead** turns a messy list of hits into a few **chemical series** worth investing in: confirm activity, rule out artefacts, check that small structural changes give sensible changes in activity (a *structure–activity relationship*, SAR).

**Lead optimisation** then improves *everything at once*: potency, selectivity against related proteins, solubility, metabolic stability, permeability, safety. It runs as repeated **design–make–test–analyse (DMTA)** cycles, each taking weeks, and ends with a **preclinical candidate** — a single molecule nominated for development.`,
      widget: { type: 'SvgDiagram', props: { svg: dmtaSvg }, caption: 'The DMTA cycle. Computation speeds up *Design* and *Analyse*; automation attacks *Make* and *Test*.' },
    },
    {
      kind: 'order',
      prompt: 'Put the discovery stages in order.',
      steps: ['Target identification', 'Target validation', 'Hit identification', 'Hit-to-lead', 'Lead optimisation', 'Preclinical candidate nominated'],
      why: 'You first choose and validate *what* to hit, then find *anything* that hits it, then turn hits into series (hit-to-lead), then polish one series into a candidate (lead optimisation).',
    },
    {
      kind: 'explain',
      title: '5 · Preclinical development',
      body: String.raw`Before a molecule enters a human it needs:
- **GLP toxicology** in two species (usually a rodent and a non-rodent) to find a safe starting dose and the organs at risk;
- **safety pharmacology** (heart, lungs, nervous system);
- **CMC** — chemistry, manufacturing and controls: making kilograms of pure drug and a stable formulation.

The package is filed as an **IND** (Investigational New Drug application, US) or **CTA** (Clinical Trial Application, EU).`,
    },
    {
      kind: 'recall',
      title: 'Clinical phases (from Medicine)',
      points: [
        '**Phase I**: small numbers (often healthy volunteers) — safety, tolerability, pharmacokinetics.',
        '**Phase II**: patients — does it work, at what dose? The biggest graveyard of candidates.',
        '**Phase III**: large randomised controlled trials confirming benefit vs standard care.',
        '**Approval** by a regulator (FDA, EMA), then **Phase IV** post-marketing surveillance.',
      ],
      link: 'med/clinical-trial-phases',
    },
    {
      kind: 'match',
      prompt: 'Match each stage with its main question.',
      pairs: [
        ['Target validation', 'Will modulating this protein change the disease?'],
        ['Lead optimisation', 'Can we make a potent, safe, drug-like molecule?'],
        ['Phase I', 'Is it safe in humans, and how is it absorbed and cleared?'],
        ['Phase II', 'Does it help patients, and at what dose?'],
        ['Phase III', 'Is the benefit confirmed in a large randomised trial?'],
      ],
      why: 'Each stage answers a different question, which is why a molecule that sailed through one stage can still fail the next — e.g. a perfectly safe Phase I drug may simply not work in Phase II.',
    },
    {
      kind: 'numeric',
      prompt: String.raw`Suppose a candidate's chance of passing each stage is: Phase I → II **0.63**, Phase II → III **0.31**, Phase III → submission **0.58**, approval **0.85**. What is the probability that a molecule entering Phase I is approved? (give a decimal, e.g. 0.12)`,
      answer: 0.0963,
      tolerance: 0.006,
      why: String.raw`Stages are sequential, so multiply: $0.63\times0.31\times0.58\times0.85\approx0.096$ — **about 1 in 10**. These are close to industry-wide estimates (e.g. BIO/Informa 2016). Phase II, at 31 %, is the biggest single filter, usually because the drug doesn't work well enough.`,
    },
    {
      kind: 'explain',
      title: 'Why so expensive? Eroom’s law',
      body: String.raw`Most of the cost is **failure**: you pay for the nine molecules that died in the clinic as well as the one that succeeded, and late failures are the most expensive. DiMasi et al. (2016) estimated ~USD 1.4 billion out-of-pocket per approval, ~USD 2.6 billion once you count the years of tied-up capital.

Worse, Scannell et al. (2012) showed that the number of drugs approved per billion dollars (inflation-adjusted) has **halved roughly every nine years since 1950** — "Eroom's law", Moore's law backwards — despite enormous technical progress. Causes they proposed include the "better than the Beatles" problem (new drugs must beat excellent cheap generics) and over-reliance on reductionist, target-based screening.`,
      widget: { type: 'SvgDiagram', props: { svg: eroomSvg }, caption: 'Schematic only: the exponential decline in R&D efficiency described by Scannell et al. (2012).' },
    },
    {
      kind: 'truefalse',
      prompt: 'Since most of a drug’s cost comes from failures, the most valuable improvement is usually to kill doomed projects **earlier** (or improve Phase II success), not to make early chemistry slightly faster.',
      answer: true,
      why: 'Paul et al. (2010) modelled R&D productivity and found that raising Phase II/III success rates or failing cheaply and early ("quick win, fast fail") has far more impact on cost per drug than speeding up already-cheap discovery steps. This is a key test for any claim that AI will "transform" drug discovery.',
    },
    {
      kind: 'multi',
      prompt: 'Which are major reasons candidates fail in the clinic? (select all that apply)',
      choices: ['Lack of efficacy in patients', 'Safety / toxicity', 'Commercial or strategic decisions', 'Too many hydrogen atoms in the SMILES string'],
      answers: [0, 1, 2],
      why: 'Analyses of industry pipelines (e.g. Waring et al. 2015; Cook et al. 2014) find that lack of efficacy and safety dominate, with commercial/strategic reasons a substantial remainder. Hydrogens in SMILES are usually implicit and are not a failure mode!',
    },
    {
      kind: 'fill',
      prompt: 'A weak but genuine active from a screen is a ___ ; a series being polished in DMTA cycles is a ___ ; the single molecule nominated for development is the ___ .',
      bank: ['hit', 'lead', 'candidate', 'target', 'biomarker'],
      answer: ['hit', 'lead', 'candidate'],
      why: 'Hit → lead → candidate is the vocabulary of rising confidence. The **target** is the protein being acted on, not a molecule you make.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- The pipeline: **target ID → validation → hit ID → hit-to-lead → lead optimisation → preclinical → Phase I–III → approval**, typically 10–15 years.
- Roughly **1 in 10** molecules entering Phase I is approved; Phase II (efficacy) is the biggest filter.
- Cost per approval (~USD 2.6 billion capitalised, DiMasi 2016) is dominated by **failures**; R&D efficiency has declined for decades (**Eroom's law**).
- Computational methods mostly act early (design, screening, prediction) — their real value is measured by whether they improve **clinical success**, not just speed.`,
    },
  ],
  references: [
    { authors: 'DiMasi, J. A., Grabowski, H. G., Hansen, R. W.', title: 'Innovation in the pharmaceutical industry: New estimates of R&D costs', year: 2016, venue: 'J. Health Econ. 47, 20–33' },
    { authors: 'Scannell, J. W., Blanckley, A., Boldon, H., Warrington, B.', title: 'Diagnosing the decline in pharmaceutical R&D efficiency', year: 2012, venue: 'Nat. Rev. Drug Discov. 11, 191–200' },
    { authors: 'Paul, S. M., Mytelka, D. S., Dunwiddie, C. T., et al.', title: "How to improve R&D productivity: the pharmaceutical industry's grand challenge", year: 2010, venue: 'Nat. Rev. Drug Discov. 9, 203–214' },
    { authors: 'Hughes, J. P., Rees, S., Kalindjian, S. B., Philpott, K. L.', title: 'Principles of early drug discovery', year: 2011, venue: 'Br. J. Pharmacol. 162, 1239–1249' },
    { authors: 'Nelson, M. R., Tipney, H., Painter, J. L., et al.', title: 'The support of human genetic evidence for approved drug indications', year: 2015, venue: 'Nat. Genet. 47, 856–860' },
  ],
} satisfies LessonContent;
