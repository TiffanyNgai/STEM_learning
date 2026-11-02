import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Where does USD 2.6 billion come from?',
      body: String.raw`No single drug costs USD 2.6 billion to *make*. That headline number (DiMasi et al. 2016) is the **average R&D spend per approved drug**, and it has three ingredients:

1. **Direct costs** of the experiments and trials for the winning molecule.
2. **The cost of failures**: every approval must pay for the many projects that died along the way.
3. **The cost of time**: money is tied up for 10+ years before any revenue arrives.

This lesson builds the number from these parts. That lets you judge claims that a new technology, such as AI, will make drugs "10× cheaper".`,
    },
    {
      kind: 'recall',
      title: 'The pipeline (from the previous lesson)',
      points: [
        'Target ID → validation → hit ID → hit-to-lead → lead optimisation → preclinical → Phase I → II → III → approval, typically 10–15 years.',
        'Roughly 1 in 10 molecules entering Phase I is approved. Phase II (efficacy) is the biggest filter.',
        'DiMasi et al. (2016): ~USD 1.4 billion out-of-pocket, ~USD 2.6 billion capitalised per approval.',
        'Eroom’s law: drugs approved per inflation-adjusted billion dollars halved about every 9 years from 1950 (Scannell et al. 2012).',
      ],
      link: 'drug/drug-discovery-pipeline',
    },
    {
      kind: 'explain',
      title: 'Paying for the losers',
      body: String.raw`Let $p_i$ be the probability that a project passes stage $i$. To get **one** approval, the number of projects you must start in stage $i$ is

$$n_i = \frac{1}{p_i\,p_{i+1}\cdots p_{\text{last}}}.$$

The out-of-pocket cost per approval is $\sum_i n_i c_i$, where $c_i$ is the cost of one project in stage $i$.

**Worked example.** Suppose Phase I, II and III pass with $p = 0.5,\ 0.4,\ 0.625$, and approval is certain after Phase III. Then
- $n_{III} = 1/0.625 = 1.6$,
- $n_{II} = 1/(0.4\times0.625) = 4$,
- $n_I = 1/(0.5\times0.4\times0.625) = 8$.

You start 8 Phase I programmes to finish with one drug.`,
    },
    {
      kind: 'numeric',
      prompt: 'Using the worked example ($n_I = 8$, $n_{II} = 4$, $n_{III} = 1.6$), and costs per project of USD 25 M (Phase I), USD 50 M (Phase II) and USD 200 M (Phase III), what is the clinical out-of-pocket cost per approval? (USD millions)',
      answer: 720,
      tolerance: 1,
      unit: 'USD M',
      why: String.raw`$8\times25 + 4\times50 + 1.6\times200 = 200+200+320 = 720$. The winning drug's own trials cost only $25+50+200 = 275$, so about **62%** of the spend goes on projects that failed.`,
    },
    {
      kind: 'widget',
      title: 'Paul et al.’s productivity model',
      body: String.raw`Paul et al. (2010, Eli Lilly) built exactly this model across eight stages. With their baseline probabilities and costs it gives **~USD 873 M out-of-pocket** and **~USD 1.8 B capitalised** per new drug. The widget reproduces both.

Tap a stage and move its sliders. Try raising **Phase II** success from 34% to 50%, then try halving the cost of **hit → lead**. Which matters more?`,
      widget: { type: 'DrugRDCostModel', props: {}, caption: 'Baseline values from Paul et al. (2010). "Projects" = number of projects that must enter that stage per approved drug.' },
    },
    {
      kind: 'mcq',
      prompt: 'In the Paul et al. baseline model, which single change lowers the out-of-pocket cost per approval the most?',
      choices: [
        'Halving the cost of each hit-to-lead project (USD 2.5 M → 1.25 M)',
        'Raising Phase II success from 34% to 50%',
        'Cutting preclinical cost per project by 20%',
        'Halving target-to-hit cost (USD 1 M → 0.5 M)',
      ],
      answer: 1,
      why: String.raw`Better Phase II success shrinks the number of projects needed in *every earlier stage* by the factor $0.34/0.50 = 0.68$. That saves ~USD 190 M of the ~USD 594 M spent up to and including Phase II. The other options save only about USD 12–24 M. Paul et al. drew the same lesson: improve the quality of Phase II decisions.`,
    },
    {
      kind: 'explain',
      title: 'The cost of time',
      body: String.raw`Money spent today could have earned a return elsewhere. Investors therefore treat USD 1 spent $t$ years before launch as worth $(1+r)^t$ at launch, where $r$ is the **cost of capital** (DiMasi et al. used 10.5% per year in real terms):

$$\text{value at launch} = C\,(1+r)^t.$$

Example: USD 100 M spent on discovery 10 years before approval counts as $100\times1.105^{10} \approx$ USD 271 M. Because so much spending happens early, capitalisation roughly **doubles** the bill (USD 1.4 B → 2.6 B).

Estimates also vary with data and method. Using public filings, Wouters et al. (2020) found a **median** of ~USD 1.0 B per new drug, with large differences between therapeutic areas.`,
    },
    {
      kind: 'numeric',
      prompt: 'A company spends USD 50 M on a project 8 years before the drug is approved. At a cost of capital of 10% per year, what is that spend worth at approval? (USD millions, nearest whole number)',
      answer: 107,
      tolerance: 1,
      unit: 'USD M',
      why: String.raw`$50\times1.10^8 = 50\times2.1436 \approx 107$. Early money is the most expensive money, so ideas that kill doomed projects *early* save both direct and capital costs.`,
    },
    {
      kind: 'explain',
      title: 'How often do drugs succeed, and why do they fail?',
      body: String.raw`**Success rates depend on how you count.** Following individual drug–indication paths through trials from 2000–2015, Wong, Siah & Lo (2019) estimated that **13.8%** of programmes entering Phase I were approved overall, but only **3.4% in oncology**. Earlier phase-by-phase estimates of about 10% count differently. Always check the method behind a quoted number.

**Why they fail.** Among Phase II and III failures in 2013–2015, roughly half were due to lack of **efficacy** and about a quarter to **safety**. Most of the rest were strategic or commercial (Harrison 2016).

After reviewing its own pipeline, AstraZeneca adopted the **"5R" framework** (Cook et al. 2014): right target, right tissue, right safety, right patient, right commercial potential. The company later reported that the success rate from candidate nomination to Phase III completion rose from 4% to 19% (Morgan et al. 2018).`,
    },
    {
      kind: 'match',
      prompt: 'Match each of AstraZeneca’s “5 Rs” with the question it asks.',
      pairs: [
        ['Right target', 'Is there strong evidence linking the target to the disease?'],
        ['Right tissue', 'Does the drug reach the site of action at sufficient exposure?'],
        ['Right safety', 'Is there a clear safety margin and understanding of on- and off-target risks?'],
        ['Right patient', 'Can we identify the patients most likely to respond (e.g. with a biomarker)?'],
        ['Right commercial potential', 'Will the medicine be differentiated and valuable to patients and payers?'],
      ],
      why: 'Each "R" maps onto a classic cause of failure: wrong biology (efficacy), poor exposure (PK), toxicity, unselected patient populations, and no medical or commercial need. Computational methods can help most with the first four.',
    },
    {
      kind: 'widget',
      title: 'Eroom’s law as an exponential',
      body: String.raw`Scannell et al. (2012) found that R&D efficiency, measured as new drugs per inflation-adjusted USD 1 billion, halved roughly every **9 years** from 1950 to 2010. If $T$ is the halving time, then

$$E(t) = E_{1950}\cdot 2^{-(t-1950)/T}.$$

On a log scale this is a straight line. The fixed curve uses $T = 9$; drag $T$ to see how sensitive the long-run decline is to the halving time. Over 60 years with $T = 9$, efficiency falls by $2^{60/9}\approx 100\times$. Scannell et al. reported roughly 80-fold in their data.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['-x/9*log10(2)', '-x/T*log10(2)'],
          x: [0, 60], y: [-3, 0.4],
          params: [{ name: 'T', min: 4, max: 30, value: 15, label: 'halving time T (years)' }],
          labels: ['T = 9 years', 'your T'],
          xLabel: 'years after 1950', yLabel: 'log₁₀ E / E₁₉₅₀',
        },
        caption: 'Each unit down on the y-axis is a 10-fold fall in drugs per inflation-adjusted dollar.',
      },
    },
    {
      kind: 'numeric',
      prompt: 'If R&D efficiency halves every 9 years, by what factor does it fall over 36 years?',
      answer: 16,
      tolerance: 0.01,
      unit: '×',
      why: String.raw`36 years is $36/9 = 4$ halvings, and $2^4 = 16$. Exponential decline compounds quietly: a few percent per year (here about 7.4% per year) becomes an order of magnitude within a working lifetime.`,
    },
    {
      kind: 'multi',
      prompt: 'Which were among Scannell et al.’s (2012) proposed causes of Eroom’s law? (Select all that apply.)',
      choices: [
        '“Better than the Beatles”: new drugs must beat an ever-growing back-catalogue of cheap, effective generics',
        '“Cautious regulator”: rising safety and evidence requirements',
        '“Throw money at it”: a tendency to add resources rather than improve decision quality',
        '“Basic research–brute force bias”: overconfidence in target-based screening of huge libraries',
        'Chemists running out of new molecules to make',
      ],
      answers: [0, 1, 2, 3],
      why: 'Those are the four causes Scannell et al. named. Chemical space is astronomically large (see [chemical space](@drug/chemical-space)). The bottleneck is choosing *which* molecules and targets will work in patients, not having enough molecules.',
    },
    {
      kind: 'explain',
      title: 'Quality beats quantity',
      body: String.raw`Scannell & Bosley (2016) used decision theory to compare two ways to improve discovery. One is screening **more** candidates. The other is using models (assays, animals, computational predictors) with better **predictive validity**, meaning a closer correlation with what happens in patients. A modest gain in validity can be worth more than a 10- or 100-fold increase in throughput.

There are hopeful signs. FDA approvals of novel drugs rose from about 20–30 a year in the 2000s to about 50 a year around 2018–2023, and Ringel et al. ("Breaking Eroom's Law", *Nat. Rev. Drug Discov.* 2020) argued that the efficiency decline flattened, and may have reversed, in the 2010s. Genetics-backed targets (see [druggability](@drug/druggability)), biomarkers and new modalities may all have contributed.

For computational drug discovery the test is clear. Making early chemistry faster helps a little. **Better prediction of clinical efficacy and safety** helps a lot.`,
    },
    {
      kind: 'truefalse',
      prompt: 'According to Scannell & Bosley’s analysis, screening ten times more compounds through the same assay is generally a better investment than a modest improvement in how well that assay predicts clinical outcome.',
      answer: false,
      why: 'It is the other way round. More throughput through a poorly predictive filter mostly yields more false positives that fail later and expensively. Improving predictive validity changes *which* candidates go forward, and that drives the late-stage success rates that dominate cost.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Cost per approval $= \sum_i n_i c_i$ with $n_i = 1/(p_i p_{i+1}\cdots)$. **Failures** dominate the bill.
- Capitalising at ~10.5%/year roughly **doubles** the cost (USD 1.4 B → 2.6 B, DiMasi et al. 2016). Estimates range from ~USD 1 B (median, Wouters et al. 2020) upward depending on data and method.
- Phase I → approval success is ~10–14% overall and only a few percent in oncology (Wong et al. 2019). Efficacy, then safety, are the main causes of failure.
- In Paul et al.'s model, raising **Phase II success** cuts cost far more than speeding up cheap early steps.
- **Eroom's law**: efficiency halved ~every 9 years from 1950 to 2010. The fix is **predictive validity**, not brute-force throughput.`,
    },
  ],
  references: [
    { authors: 'DiMasi, J. A., Grabowski, H. G., Hansen, R. W.', title: 'Innovation in the pharmaceutical industry: New estimates of R&D costs', year: 2016, venue: 'J. Health Econ. 47, 20–33' },
    { authors: 'Paul, S. M., Mytelka, D. S., Dunwiddie, C. T., et al.', title: "How to improve R&D productivity: the pharmaceutical industry's grand challenge", year: 2010, venue: 'Nat. Rev. Drug Discov. 9, 203–214' },
    { authors: 'Wong, C. H., Siah, K. W., Lo, A. W.', title: 'Estimation of clinical trial success rates and related parameters', year: 2019, venue: 'Biostatistics 20, 273–286' },
    { authors: 'Scannell, J. W., Blanckley, A., Boldon, H., Warrington, B.', title: 'Diagnosing the decline in pharmaceutical R&D efficiency', year: 2012, venue: 'Nat. Rev. Drug Discov. 11, 191–200' },
    { authors: 'Scannell, J. W., Bosley, J.', title: 'When quality beats quantity: decision theory, drug discovery, and the reproducibility crisis', year: 2016, venue: 'PLoS ONE 11, e0147215' },
  ],
} satisfies LessonContent;
