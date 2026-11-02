import type { LessonContent } from '../../types';

// HTS funnel: plate formats and the triage from primary hits to leads.
const plates: [string, number, number][] = [['96', 8, 12], ['384', 16, 24], ['1536', 32, 48]];
const plateSvg = `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg">
${plates.map(([name, rows, cols], i) => {
  const x0 = 12 + i * 102, w = 92, h = 62, y0 = 26;
  const dx = w / cols, dy = h / rows, r = Math.min(dx, dy) * 0.36;
  let wells = '';
  for (let a = 0; a < rows; a++) for (let b = 0; b < cols; b++) {
    const hit = (a * 7 + b * 13 + i) % 97 === 0;
    wells += `<circle cx="${(x0 + (b + 0.5) * dx).toFixed(1)}" cy="${(y0 + (a + 0.5) * dy).toFixed(1)}" r="${r.toFixed(2)}" fill="${hit ? 'var(--c1)' : 'var(--muted)'}" fill-opacity="${hit ? 1 : 0.35}"/>`;
  }
  return `<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${i * 0.7}s" dur="0.5s" fill="freeze"/>
<rect x="${x0 - 3}" y="${y0 - 3}" width="${w + 6}" height="${h + 6}" rx="4" fill="none" stroke="var(--fg)"/>${wells}
<text x="${x0 + w / 2}" y="16" text-anchor="middle" font-size="10" font-weight="700" fill="var(--fg)">${name}-well</text></g>`;
}).join('\n')}
<text x="160" y="112" text-anchor="middle" font-size="9" fill="var(--muted)">same footprint, smaller volumes (µL → nL), more tests per day</text>
<g font-size="9.5" font-weight="700" text-anchor="middle">
<rect x="12" y="124" width="92" height="30" rx="6" fill="var(--c2)" fill-opacity="0.25"/><text x="58" y="137" fill="var(--fg)">10⁵–10⁶ tested</text><text x="58" y="149" fill="var(--muted)" font-weight="400">primary screen</text>
<rect x="114" y="124" width="92" height="30" rx="6" fill="var(--c3)" fill-opacity="0.25"/><text x="160" y="137" fill="var(--fg)">~0.1–1 % "hits"</text><text x="160" y="149" fill="var(--muted)" font-weight="400">many are artefacts</text>
<rect x="216" y="124" width="92" height="30" rx="6" fill="var(--c1)" fill-opacity="0.25"/><text x="262" y="137" fill="var(--fg)">a few series</text><text x="262" y="149" fill="var(--muted)" font-weight="400">confirmed, tractable</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The 1990s bet: industrialise discovery',
      body: String.raw`If drugs are found by testing molecules, then testing *more* molecules against *more* targets should find more drugs. In the 1990s three technologies made that bet possible:
1. **Combinatorial chemistry** — make thousands to millions of compounds at once.
2. **High-throughput screening (HTS)** — robots test them in miniaturised assays.
3. **Genomics** — the Human Genome Project would supply thousands of new targets.

All three worked as technologies. The puzzle this lesson explains is why the number of new drugs per dollar kept *falling* anyway.`,
    },
    {
      kind: 'explain',
      title: 'Roots of combinatorial chemistry',
      body: String.raw`Combinatorial chemistry grew out of **peptide synthesis**:
- **Merrifield** (1963): solid-phase synthesis — build a peptide on a resin bead, washing away excess reagents after each step (Nobel 1984).
- **Geysen** (1984) made peptides on arrays of plastic pins; **Houghten** (1985) in porous "tea bags".
- **Furka** devised **split-and-pool** synthesis (described 1988, published 1991), and **Lam** et al. (1991) screened such libraries as *one-bead-one-compound*: each bead carries one sequence, and active beads are picked and decoded.
- **Bunin and Ellman** (1992) extended the idea from peptides to drug-like **benzodiazepines**.

The key trick is combinatorial: a few reactions create a huge number of products.`,
    },
    {
      kind: 'widget',
      title: 'Split and pool',
      body: String.raw`Each cycle **splits** the beads into $b$ portions, couples a different building block in each, then **pools** and mixes them. After $n$ cycles there are $b^n$ different compounds — each bead carrying just one — for only $b \times n$ coupling reactions.`,
      widget: { type: 'DrugSplitPool', props: { blocks: 3, cycles: 3 }, caption: 'Each coloured square is one building block; each row of squares is one compound on one bead.' },
    },
    {
      kind: 'numeric',
      prompt: 'A split-and-pool library uses 30 building blocks in each of 3 cycles. How many different compounds does it contain?',
      answer: 27000,
      tolerance: 0,
      why: String.raw`$30^3 = 27{,}000$ compounds, from only $3 \times 30 = 90$ couplings. Adding a fourth cycle of 30 would give 810,000 — exponential growth is the whole appeal (and, as we'll see, part of the trap).`,
    },
    {
      kind: 'widget',
      title: 'High-throughput screening',
      body: String.raw`HTS automated the assay. Plates went from 96 to 384 to 1536 wells, volumes fell to nanolitres, and by the late 1990s *ultra*-HTS could test over 100,000 compounds a day. Corporate collections grew to $10^5$–$10^6$ compounds and beyond.

A typical campaign yields a fraction of a percent of primary "hits", many of which are false positives (aggregators, reactive or fluorescent compounds; see [assay artefacts](@drug/assay-artefacts)), so confirmation and triage are essential. Assay quality is tracked with the Z′-factor ([assays](@drug/wet-lab-assays)).`,
      widget: { type: 'SvgDiagram', props: { svg: plateSvg }, caption: 'Plate formats share one footprint; green wells represent the rare primary hits. Numbers are typical orders of magnitude, not fixed rules.' },
    },
    {
      kind: 'explain',
      title: 'A cautionary tale: antibacterials at GSK',
      body: String.raw`Genomics and HTS seemed ideal for antibiotics: sequence a bacterium, find **essential genes** absent in humans, screen each protein. GlaxoSmithKline did exactly that from 1995 to 2001 and reported the outcome candidly (Payne et al. 2007): **67 HTS campaigns** against essential bacterial targets produced **16 hits and 5 leads — and no development candidates**.

Why? Compounds that inhibit a purified enzyme often cannot get *into* bacteria (especially Gram-negative ones, with their outer membrane and efflux pumps), and corporate libraries — built for human targets — were poor in antibacterial-like chemistry. Throughput could not compensate for the wrong *kind* of molecule.`,
    },
    {
      kind: 'truefalse',
      prompt: 'In GSK’s 1995–2001 genomics-driven antibacterial programme, dozens of HTS campaigns against essential bacterial enzymes yielded several development candidates.',
      answer: false,
      why: 'They yielded 16 hits, 5 leads and zero development candidates. Biochemical potency on an isolated enzyme did not translate into whole-cell antibacterial activity — a lesson about target validation and compound properties, not throughput.',
    },
    {
      kind: 'explain',
      title: 'Quantity versus quality',
      body: String.raw`Early combinatorial libraries were built from reactions that worked reliably on beads, which favoured **flat, aromatic, large and greasy** molecules. HTS hits from them tended to be big and lipophilic, and optimisation made them bigger still. Responses followed:
- Lipinski's **rule of five** (1997) flagged poor absorption risk ([drug-likeness](@drug/drug-likeness)).
- **Lead-likeness** (Teague et al. 1999): start smaller and less lipophilic, leaving room to grow.
- "**Escape from flatland**" (Lovering et al. 2009): the fraction of sp³ carbons,
$$F_{\mathrm{sp^3}} = \frac{\text{number of sp}^3\text{ carbons}}{\text{total carbons}},$$
rose on average from about 0.36 for discovery compounds to about 0.47 for approved drugs.

Newman and Cragg's surveys could credit only about one approved drug (sorafenib, 2005) to a *de novo* combinatorial library.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Imatinib, $\mathrm{C_{29}H_{31}N_7O}$, has 29 carbons. Its sp³ carbons are the 4 CH₂ groups of the piperazine ring, the N-methyl, the benzylic CH₂ linker and one aryl methyl. What is its $F_{\mathrm{sp^3}}$? (two decimals)`,
      answer: 0.24,
      tolerance: 0.01,
      why: String.raw`$7/29 = 0.24$. All its other 22 carbons are in aromatic rings or the amide C=O (sp²). Low $F_{\mathrm{sp^3}}$ is typical of kinase inhibitors, which bind a flat adenine pocket — a reminder that metrics are tendencies, not laws.`,
    },
    {
      kind: 'explain',
      title: 'Genomics: from 500 targets to … how many?',
      body: String.raw`The human genome draft (2001; essentially complete 2003) revealed roughly 20,000 protein-coding genes. Drews (2000) noted that all existing drug therapy hit fewer than 500 molecular targets and estimated thousands more could be exploited. Hopkins and Groom (2002) estimated that only about 3,000 genes encode proteins likely to bind drug-like molecules — the **druggable genome** — and fewer still are linked to disease. Overington et al. (2006) counted **324** targets for all approved drugs.

"Target-first" discovery became the norm: pick a gene, make the protein, run HTS. But a gene's link to a disease is not proof that drugging it helps patients. Many genomics-era targets were weakly validated, and projects failed for **lack of efficacy** in Phase II.`,
    },
    {
      kind: 'widget',
      title: 'Eroom’s law',
      body: String.raw`Scannell et al. (2012) found that the number of new drugs approved per billion (inflation-adjusted) US dollars of R&D has **halved roughly every 9 years since 1950** — Moore's law spelled backwards. The genomics/HTS era did not bend the line. Adjust the halving time to see how sensitive the long-run decline is.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['-(x-1950)/h*0.30103'],
          x: [1950, 2010], y: [-3, 0.3],
          params: [{ name: 'h', min: 5, max: 15, value: 9, label: 'halving time (years)' }],
          labels: ['log₁₀ efficiency vs 1950'],
          xLabel: 'year', yLabel: 'log₁₀(drugs per USD bn), 1950 = 0',
        },
        caption: 'A straight line on a log scale means exponential decline: at h = 9 years, efficiency in 2010 is about 1/100 of 1950. Scannell et al. blamed the "better than the Beatles" problem, a cautious regulator, "throw money at it", and a basic-research–brute-force bias.',
      },
    },
    {
      kind: 'mcq',
      prompt: 'If R&D efficiency halves every 9 years, by roughly what factor does it fall over 45 years?',
      choices: ['5-fold', '10-fold', '32-fold', '45-fold'],
      answer: 2,
      why: String.raw`45 years is 5 halving times, so the factor is $2^5 = 32$. Thinking linearly ("halves five times ≈ 5×" or "about 10×") badly underestimates exponential decline.`,
    },
    {
      kind: 'multi',
      prompt: 'Which are recognised reasons why more compounds and more targets did not yield more drugs?',
      choices: [
        'Many genomics-derived targets were poorly validated for disease',
        'Early combinatorial libraries were biased toward flat, large, lipophilic molecules',
        'Activity on an isolated protein often failed to translate to cells, animals or patients',
        'HTS robots were too slow to test the libraries',
        'Clinical failure for lack of efficacy, the costliest kind, was not reduced',
      ],
      answers: [0, 1, 2, 4],
      why: 'Throughput was never the bottleneck — HTS robots were fast enough. The bottlenecks were target validity, molecule quality and translation to patients, which brute-force screening does not address (the "brute-force bias" of Scannell et al.).',
    },
    {
      kind: 'explain',
      title: 'What the era left behind',
      body: String.raw`The industrialisation was not a failure so much as an over-promise:
- **HTS** remains a major source of hits, now with better-curated, more lead-like libraries.
- **Parallel synthesis** is standard for making focused analogue sets during optimisation.
- **Genomics** matured into *genetic* target validation: drug mechanisms supported by human genetic evidence are roughly twice as likely to succeed in development (Nelson et al. 2015).
- The quality backlash led directly to [fragments, DNA-encoded libraries and the phenotypic revival](@drug/fragments-del-phenotypic) — and to the cheminformatics of [library design](@drug/library-design).`,
    },
    {
      kind: 'match',
      prompt: 'Match each name to the contribution.',
      pairs: [
        ['Merrifield', 'Solid-phase synthesis on resin beads (1963)'],
        ['Lam et al.', 'One-bead-one-compound library screening (1991)'],
        ['Bunin & Ellman', 'An early small-molecule (benzodiazepine) combinatorial library (1992)'],
        ['Payne et al.', 'Candid report of target-based antibacterial HTS failures (2007)'],
        ['Scannell et al.', 'Eroom’s law of declining R&D efficiency (2012)'],
      ],
      why: 'Merrifield’s beads enabled split-and-pool and one-bead-one-compound libraries; Bunin & Ellman moved combinatorial chemistry from peptides toward drug-like molecules; Payne and Scannell documented why scale alone disappointed.',
    },
    {
      kind: 'fill',
      prompt: 'With b building blocks per cycle, n split-and-pool cycles give ___ compounds but need only ___ coupling reactions.',
      bank: ['bⁿ', 'b × n', 'nᵇ', 'b + n'],
      answer: ['bⁿ', 'b × n'],
      why: 'Library size grows exponentially (bⁿ) while effort grows linearly (b × n). That asymmetry made combinatorial chemistry seductive; it says nothing about whether the products are good drugs.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- 1990s logic: **make more** (combinatorial chemistry), **test more** (HTS), **more targets** (genomics).
- Split-and-pool gives $b^n$ compounds from $b \times n$ reactions; HTS tests $10^5$–$10^6$ compounds per campaign.
- Outcomes disappointed: flat, greasy libraries; weakly validated targets; e.g. GSK's 67 antibacterial HTS campaigns gave no candidates.
- **Eroom's law**: drugs per R&D dollar halved about every 9 years since 1950, unchanged by this era.
- Legacies: HTS and parallel synthesis remain standard; quality metrics ($F_{\mathrm{sp^3}}$, rule of five) and genetic target validation came from the lessons learned.`,
    },
  ],
  references: [
    { authors: 'Lam, K. S., Salmon, S. E., Hersh, E. M., et al.', title: 'A new type of synthetic peptide library for identifying ligand-binding activity', year: 1991, venue: 'Nature 354, 82–84' },
    { authors: 'Payne, D. J., Gwynn, M. N., Holmes, D. J., Pompliano, D. L.', title: 'Drugs for bad bugs: confronting the challenges of antibacterial discovery', year: 2007, venue: 'Nat. Rev. Drug Discov. 6, 29–40' },
    { authors: 'Lovering, F., Bikker, J., Humblet, C.', title: 'Escape from flatland: increasing saturation as an approach to improving clinical success', year: 2009, venue: 'J. Med. Chem. 52, 6752–6756' },
    { authors: 'Scannell, J. W., Blanckley, A., Boldon, H., Warrington, B.', title: 'Diagnosing the decline in pharmaceutical R&D efficiency', year: 2012, venue: 'Nat. Rev. Drug Discov. 11, 191–200' },
    { authors: 'Overington, J. P., Al-Lazikani, B., Hopkins, A. L.', title: 'How many drug targets are there?', year: 2006, venue: 'Nat. Rev. Drug Discov. 5, 993–996' },
  ],
} satisfies LessonContent;
