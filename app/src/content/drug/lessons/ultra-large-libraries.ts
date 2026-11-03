import type { LessonContent } from '../../types';

const ladderSvg = `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
<text x="8" y="12" font-size="9" fill="var(--muted)">how many small molecules can you actually screen?</text>
${[
  ['384-well plate', '0.4 thousand', 384],
  ['a big HTS campaign', '1–2 million', 1.5e6],
  ['a purchasable catalogue', '10 million', 1e7],
  ['ZINC-scale docking (2015)', '10 million', 1e7],
  ['Lyu et al. 2019 docking', '100+ million', 1e8],
  ['make-on-demand space today', 'billions', 1e9],
].map(([name, n, v], i) => {
  const y = 24 + i * 25;
  const w = Math.round(14 * (Math.log10(Number(v)) - 2)) + 6;
  return `<rect x="8" y="${y}" width="${w}" height="16" rx="3" fill="var(--c${(i % 6) + 1})" fill-opacity="0.45" stroke="var(--c${(i % 6) + 1})"/>
<text x="${w + 14}" y="${y + 12}" font-size="8.5" fill="var(--fg)">${name} — ${n}</text>`;
}).join('\n')}
<text x="8" y="176" font-size="8" fill="var(--muted)">bar length is log-scaled: equal steps are tenfold jumps</text>
</svg>`;

const loopSvg = `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
<rect x="8" y="12" width="92" height="34" rx="7" fill="var(--c2)" fill-opacity="0.2" stroke="var(--c2)"/>
<text x="54" y="26" font-size="8.5" text-anchor="middle" fill="var(--fg)" font-weight="700">dock a random</text>
<text x="54" y="38" font-size="8.5" text-anchor="middle" fill="var(--fg)" font-weight="700">sample (~0.1%)</text>
<rect x="114" y="12" width="92" height="34" rx="7" fill="var(--c3)" fill-opacity="0.2" stroke="var(--c3)"/>
<text x="160" y="26" font-size="8.5" text-anchor="middle" fill="var(--fg)" font-weight="700">train a surrogate</text>
<text x="160" y="38" font-size="8.5" text-anchor="middle" fill="var(--fg)" font-weight="700">score predictor</text>
<rect x="220" y="12" width="92" height="34" rx="7" fill="var(--c4)" fill-opacity="0.2" stroke="var(--c4)"/>
<text x="266" y="26" font-size="8.5" text-anchor="middle" fill="var(--fg)" font-weight="700">predict scores</text>
<text x="266" y="38" font-size="8.5" text-anchor="middle" fill="var(--fg)" font-weight="700">for all 10⁹</text>
<rect x="114" y="92" width="92" height="34" rx="7" fill="var(--c1)" fill-opacity="0.25" stroke="var(--c1)"/>
<text x="160" y="106" font-size="8.5" text-anchor="middle" fill="var(--fg)" font-weight="700">dock the most</text>
<text x="160" y="118" font-size="8.5" text-anchor="middle" fill="var(--fg)" font-weight="700">promising batch</text>
<path d="M100,29 L112,29" stroke="var(--fg)" stroke-width="1"/>
<path d="M206,29 L218,29" stroke="var(--fg)" stroke-width="1"/>
<path d="M266,46 L266,109 L208,109" stroke="var(--fg)" stroke-width="1" fill="none" stroke-dasharray="4 3"/>
<path d="M114,109 L54,109 L54,48" stroke="var(--fg)" stroke-width="1" fill="none" stroke-dasharray="4 3"/>
<circle r="3.5" fill="var(--c5)"><animateMotion dur="5s" repeatCount="indefinite" path="M54,29 L160,29 L266,29 L266,109 L160,109 L54,109 L54,29"/></circle>
<text x="160" y="146" font-size="8.5" text-anchor="middle" fill="var(--muted)">each loop adds real docking scores and retrains the surrogate</text>
<text x="160" y="157" font-size="8.5" text-anchor="middle" fill="var(--muted)">stop after a few percent of the library has been docked</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Bigger haystacks, better needles',
      body: String.raw`For twenty years, docking libraries were capped by what vendors kept in stock: a few million compounds. Then chemistry suppliers changed the model. Instead of shelves of bottles, they published **make-on-demand** catalogues: every molecule that a set of reliable reactions can build from a set of in-stock building blocks, enumerated in advance and synthesised only if you order it.

That turned a 10-million-compound problem into a 10-billion-compound one. The bet is simple and, so far, correct: a library a thousand times larger contains better-fitting molecules, and docking can find them.`,
      widget: { type: 'SvgDiagram', props: { svg: ladderSvg }, caption: 'One plate to make-on-demand space is more than six orders of magnitude. The gap between what you can *score* and what you can *assay* is now about seven orders of magnitude.' },
    },
    {
      kind: 'explain',
      title: 'Where the billions come from',
      body: String.raw`Make-on-demand space is **combinatorial**, not a list someone curated. Take a validated two-component reaction — an amide coupling, say — plus 20,000 acids and 30,000 amines in stock, and you have already enumerated $20{,}000 \times 30{,}000 = 6 \times 10^8$ products from one reaction.

Enamine's **REAL Space** (Grygorenko et al. 2020) is built this way, from a small set of parallel-synthesis protocols — each validated on hundreds of substrate combinations, and kept only if about 80 % of them worked — applied to tens of thousands of building blocks. Crucially, the reactions are chosen for **reliability**: a requested compound is usually delivered, in a few weeks, at a price comparable with a catalogue compound. A virtual library you cannot buy from is a toy.`,
    },
    {
      kind: 'numeric',
      prompt: 'A three-component reaction is run with 500, 800 and 600 available building blocks at the three positions. How many products does the enumerated library contain, in millions?',
      answer: 240,
      tolerance: 0.5,
      unit: 'million',
      why: '$500 \\times 800 \\times 600 = 2.4 \\times 10^8 = 240$ million from a single reaction. Multiplying choices rather than adding them is why combinatorial catalogues grow so fast — and why most of their content was never designed by anyone.',
    },
    {
      kind: 'explain',
      title: 'The compute bill',
      body: String.raw`Docking is embarrassingly parallel — every molecule is independent — so the question is just arithmetic. Suppose one molecule takes **1 CPU-second** (optimistic; flexible ligands take much longer).

- $10^9$ molecules $= 10^9$ CPU-seconds $= 2.8 \times 10^5$ CPU-hours $\approx 32$ CPU-years.
- On 10,000 cores that is $10^5$ seconds $\approx 28$ hours.
- At roughly USD 0.02 per core-hour on spot cloud instances, a few thousand dollars.

So a billion-compound screen is affordable, but it is not free, and you will want to run it more than once (different protein conformations, different protonation states). Compute is the reason the field cares about the shortcuts later in this lesson.`,
    },
    {
      kind: 'numeric',
      prompt: 'Docking one molecule takes 5 CPU-seconds and you have 50,000 cores. How many hours does a 1.0-billion-compound screen take?',
      answer: 27.8,
      tolerance: 0.3,
      unit: 'hours',
      why: '$10^9 \\times 5 = 5\\times10^9$ CPU-seconds; divided by 50,000 cores gives $10^5$ seconds, and $10^5/3600 = 27.8$ hours. Doubling the per-molecule cost or halving the cores doubles the wall-clock time — nothing clever is happening, just division.',
    },
    {
      kind: 'explain',
      title: 'The experiment that made the case',
      body: String.raw`Lyu et al. (2019) docked make-on-demand libraries of roughly 99 million molecules against **AmpC β-lactamase** (a bacterial enzyme that destroys penicillins) and about 138 million against the **D4 dopamine receptor**, then made and assayed 44 of the top-ranked AmpC compounds and 549 of the top-ranked D4 compounds.

Two results mattered. First, the **hit rates were high** — 5 of the 44 (11 %) inhibited AmpC, and around a quarter of the 549 D4 compounds were genuinely active, against the 0.1–1 % typical of a physical high-throughput screen. Second, the hits were **new chemotypes**: scaffolds unrelated to known ligands, including a potent and highly selective D4 ligand and, for AmpC, a non-covalent inhibitor from a scaffold nobody had tried.

They also showed the mechanism: when they sampled molecules from different score ranks, the hit rate *rose* with the score. Ranking was doing real work, so enlarging the library enlarged the pool of top-ranked molecules worth testing.`,
    },
    {
      kind: 'widget',
      title: 'Why size helps, in one picture',
      body: 'Here is a 10-million-compound library with 1 in 10,000 actives. Switch to **log x** and look at the first 0.1 %: at a fixed model quality, the top 10,000 compounds have a much higher hit rate than the library as a whole — and a library ten times bigger simply gives you ten times as many molecules living in that region.',
      widget: {
        type: 'DrugEnrichmentCurve',
        props: { quality: 2.2, cutoff: 0.001, nTotal: 10000000, nActives: 1000, logX: true },
        caption: 'Enrichment is a *ratio*, so it does not improve when the library grows. The absolute number of actives in the slice you can afford to buy does.',
      },
    },
    {
      kind: 'mcq',
      prompt: 'Why does docking a 1-billion-compound library tend to yield better ligands than docking a 1-million-compound subset of the same chemistry, even with an unchanged scoring function?',
      choices: [
        'The larger library contains more molecules in the extreme tail of good complementarity to the pocket',
        'The scoring function becomes more accurate as the number of molecules scored increases',
        'Enrichment factors grow in proportion to library size',
        'False-positive scores become rarer in large libraries',
      ],
      answer: 0,
      why: 'Nothing about the method improves; the tail of the score distribution simply extends further when you sample a thousand times more molecules. False positives in fact become *more* numerous, which is why the top of a billion-compound list needs filtering and visual inspection.',
    },
    {
      kind: 'explain',
      title: 'Open tooling at billion scale',
      body: String.raw`Gorgulla et al. (2020) built **VirtualFlow**, an open-source platform that distributes docking across tens of thousands of cores on clusters and cloud, and used it to screen over one billion commercially available compounds. Their demonstration target was **KEAP1**, the protein that holds the stress-response transcription factor NRF2 down; the screen produced new inhibitors of the KEAP1–NRF2 interaction.

The contribution was less a new algorithm than the plumbing: preparing, sharding, dispatching and collecting results for $10^9$ molecules without losing any is a genuine engineering problem, and it was in the way of everyone who did not work in a large group.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Because make-on-demand compounds have never been synthesised, a top-ranked virtual hit might simply not be makeable.',
      answer: true,
      why: 'Enumerated products rest on reactions that usually work, not always — a fraction of orders fail, and delivery takes weeks. This is a real cost of the approach and the reason suppliers emphasise validated, high-yielding reactions; it also connects to [synthesizability](@drug/synthesizability) scoring more generally.',
    },
    {
      kind: 'explain',
      title: 'Active learning: do not dock everything',
      body: String.raw`If only the top 0.01 % of the list matters, docking the other 99.99 % is wasted effort. **Active learning** exploits that. Dock a small random sample, train a cheap machine-learning model to predict the docking score from the molecule's structure, use it to pick the next batch of molecules to dock, retrain, repeat.

Graff, Shakhnovich and Coley (2021) made this concrete with **MolPAL**: a molecular pool-based active-learning loop that recovered most of the top-scoring compounds of libraries up to roughly a hundred million while actually docking only a few percent of them. The surrogate never has to be accurate everywhere — only good enough to tell which batch is worth the expensive calculation.`,
      widget: { type: 'SvgDiagram', props: { svg: loopSvg }, caption: 'The loop. It is Bayesian optimisation with docking as the expensive objective; an acquisition function that mixes predicted score with uncertainty decides each batch.' },
    },
    {
      kind: 'order',
      prompt: 'Order one iteration of an active-learning docking campaign.',
      steps: [
        'Dock a small random sample of the library to get initial training labels',
        'Train a surrogate model to predict docking score from molecular structure',
        'Predict a score (and an uncertainty) for every undocked molecule',
        'Select a batch by an acquisition function that balances high predicted score against uncertainty',
        'Dock that batch for real and add the results to the training set',
      ],
      why: 'The expensive step (docking) is deliberately the last one, and its results feed the next loop. Selecting purely on predicted score would be greedy: the uncertainty term keeps the model exploring regions of the library it has barely seen.',
    },
    {
      kind: 'multi',
      prompt: 'Which problems get *worse* rather than better as the docked library grows from $10^6$ to $10^9$?',
      choices: [
        'The number of molecules that score well by accident (scoring-function artefacts)',
        'A bias of the top of the list towards larger, more hydrophobic molecules',
        'The cost of visually inspecting the top-ranked poses',
        'The fraction of actives among the top-ranked compounds',
      ],
      answers: [0, 1, 2],
      why: 'Scoring errors are sampled a thousand times more often, and most scoring functions reward buried surface, so bigger greasier molecules float to the top unless you filter on properties. Inspection does not scale either. Hit rate among the top-ranked is the thing that empirically holds up or improves — that was the point of the Lyu campaigns.',
    },
    {
      kind: 'fill',
      prompt: 'Ultra-large screening relies on ___ libraries that are enumerated combinatorially and synthesised only when ordered, and on ___ learning to avoid docking every molecule.',
      bank: ['make-on-demand', 'active', 'in-stock', 'supervised', 'natural-product'],
      answer: ['make-on-demand', 'active'],
      why: 'Both words are load-bearing: "make-on-demand" is what makes a billion molecules purchasable rather than hypothetical, and "active" learning is what makes the compute bill independent of library size. The surrogate is trained by supervised learning, but the loop around it is active learning.',
    },
    {
      kind: 'explain',
      title: 'What is still hard',
      body: String.raw`- **The scoring function did not improve.** Everything above enlarges the pool; the judge is still crude, and a 25 % hit rate also means 75 % of the top-ranked molecules were wrong.
- **Potency, not just binding.** Ultra-large screens reliably deliver micromolar-to-nanomolar starting points, which still need optimisation.
- **Coverage is uneven.** Combinatorial space is dense where the reactions are reliable and empty elsewhere, so "a billion compounds" is not a billion *ideas*.
- **Reproducibility.** Preparation choices (protonation, tautomers, pocket conformation) change the top of the list more than library size does.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Make-on-demand** catalogues (Enamine REAL Space; Grygorenko et al. 2020) enumerate billions of products from validated reactions and in-stock building blocks.
- Docking is embarrassingly parallel: $10^9$ molecules at 1 CPU-second is about 32 CPU-years, or ~28 hours on 10,000 cores.
- Lyu et al. (2019) docked ~99 million molecules against AmpC and ~138 million against the D4 receptor and got high hit rates and genuinely new chemotypes; **VirtualFlow** (Gorgulla et al. 2020) took the same idea past a billion compounds with open tooling.
- Bigger libraries do not raise the *enrichment factor* — they raise the absolute number of good molecules inside the slice you can afford to buy.
- **Active learning** (MolPAL; Graff et al. 2021) recovers most top scorers after docking only a few percent of the library.
- Scoring-function error, property drift and synthesis failures all scale up too. Next: how to [design](@drug/library-design) a library instead of enumerating one.`,
    },
  ],
  references: [
    { authors: 'Lyu, J., Wang, S., Balius, T. E., et al.', title: 'Ultra-large library docking for discovering new chemotypes', year: 2019, venue: 'Nature 566, 224–229' },
    { authors: 'Gorgulla, C., Boeszoermenyi, A., Wang, Z.-F., et al.', title: 'An open-source drug discovery platform enables ultra-large virtual screens', year: 2020, venue: 'Nature 580, 663–668' },
    { authors: 'Grygorenko, O. O., Radchenko, D. S., Dziuba, I., Chuprina, A., Gubina, K. E., Moroz, Y. S.', title: 'Generating multibillion chemical space of readily accessible screening compounds', year: 2020, venue: 'iScience 23, 101681' },
    { authors: 'Graff, D. E., Shakhnovich, E. I., Coley, C. W.', title: 'Accelerating high-throughput virtual screening through molecular pool-based active learning', year: 2021, venue: 'Chem. Sci. 12, 7866–7881' },
    { authors: 'Irwin, J. J., Shoichet, B. K.', title: 'Docking screens for novel ligands conferring new biology', year: 2016, venue: 'J. Med. Chem. 59, 4103–4120' },
  ],
} satisfies LessonContent;
