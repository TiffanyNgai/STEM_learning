import type { LessonContent } from '../../types';

const levelsSvg = String.raw`<svg viewBox="0 0 320 250" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="4" y="75" width="312" height="26" rx="6" fill="var(--c1)" opacity="0.18"><animate attributeName="opacity" values="0.1;0.35;0.1" dur="2.4s" repeatCount="indefinite"/></rect>
<g font-size="10" fill="var(--fg)">
<g transform="translate(0,12)"><circle cx="28" cy="0" r="3" fill="var(--c2)"/><ellipse cx="28" cy="0" rx="10" ry="4" fill="none" stroke="var(--c2)"/><text x="52" y="4" font-weight="700">Atom</text><text x="140" y="4" fill="var(--muted)">carbon, oxygen, nitrogen…</text></g>
<g transform="translate(0,38)"><circle cx="22" cy="0" r="4" fill="var(--c3)"/><circle cx="30" cy="-4" r="3" fill="var(--c2)"/><circle cx="33" cy="4" r="3" fill="var(--c2)"/><text x="52" y="4" font-weight="700">Molecule</text><text x="140" y="4" fill="var(--muted)">water, glucose, DNA, proteins</text></g>
<g transform="translate(0,63)"><ellipse cx="28" cy="0" rx="12" ry="6" fill="var(--c3)" fill-opacity="0.4" stroke="var(--c3)"/><path d="M19,0 l3,-3 l3,6 l3,-6 l3,6 l3,-3" fill="none" stroke="var(--c3)"/><text x="52" y="4" font-weight="700">Organelle</text><text x="140" y="4" fill="var(--muted)">nucleus, mitochondrion</text></g>
<g transform="translate(0,88)"><circle cx="28" cy="0" r="11" fill="var(--c1)" fill-opacity="0.3" stroke="var(--c1)" stroke-width="1.5"/><circle cx="30" cy="1" r="4" fill="var(--c4)"/><text x="52" y="4" font-weight="700">Cell</text><text x="140" y="4" fill="var(--c1)" font-weight="700">smallest unit that is alive</text></g>
<g transform="translate(0,113)"><g fill="var(--c1)" fill-opacity="0.35" stroke="var(--c1)"><rect x="16" y="-8" width="8" height="8"/><rect x="24" y="-8" width="8" height="8"/><rect x="32" y="-8" width="8" height="8"/><rect x="16" y="0" width="8" height="8"/><rect x="24" y="0" width="8" height="8"/><rect x="32" y="0" width="8" height="8"/></g><text x="52" y="4" font-weight="700">Tissue</text><text x="140" y="4" fill="var(--muted)">muscle, epithelium</text></g>
<g transform="translate(0,138)"><path d="M28,9 C10,-2 18,-12 28,-4 C38,-12 46,-2 28,9 Z" fill="var(--c5)" fill-opacity="0.6"/><text x="52" y="4" font-weight="700">Organ</text><text x="140" y="4" fill="var(--muted)">heart, leaf, brain</text></g>
<g transform="translate(0,163)" stroke="var(--fg)" fill="none"><circle cx="28" cy="-7" r="3"/><path d="M28,-4 v8 M22,0 h12 M28,4 l-4,6 M28,4 l4,6"/></g>
<g transform="translate(0,163)"><text x="52" y="4" font-weight="700">Organism</text><text x="140" y="4" fill="var(--muted)">one bacterium, one oak, you</text></g>
<g transform="translate(0,188)" stroke="var(--fg)" fill="none"><g transform="translate(-8,0) scale(0.8) translate(7,0)"><circle cx="28" cy="-7" r="3"/><path d="M28,-4 v8 M22,0 h12 M28,4 l-4,6 M28,4 l4,6"/></g><g transform="translate(8,0) scale(0.8) translate(7,0)"><circle cx="28" cy="-7" r="3"/><path d="M28,-4 v8 M22,0 h12 M28,4 l-4,6 M28,4 l4,6"/></g></g>
<g transform="translate(0,188)"><text x="52" y="4" font-weight="700">Population</text><text x="140" y="4" fill="var(--muted)">all the oaks in a forest</text></g>
<g transform="translate(0,213)"><path d="M28,-10 l-8,14 h16 z" fill="var(--c1)"/><rect x="26" y="4" width="4" height="5" fill="var(--c3)"/><circle cx="40" cy="-8" r="4" fill="var(--c3)"/><text x="52" y="4" font-weight="700">Ecosystem</text><text x="140" y="4" fill="var(--muted)">forest + soil + climate</text></g>
<g transform="translate(0,238)"><circle cx="28" cy="0" r="8" fill="var(--c2)" fill-opacity="0.5" stroke="var(--c2)"/><text x="52" y="4" font-weight="700">Biosphere</text><text x="140" y="4" fill="var(--muted)">all life on Earth</text></g>
</g></svg>`;

const scaleSvg = String.raw`<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<line x1="20" y1="90" x2="300" y2="90" stroke="var(--fg)" stroke-width="1.2"/>
<g font-size="9" fill="var(--muted)" text-anchor="middle">
<line x1="20" y1="86" x2="20" y2="94" stroke="var(--fg)"/><text x="20" y="104">0.1 nm</text>
<line x1="60" y1="86" x2="60" y2="94" stroke="var(--fg)"/><text x="60" y="104">1 nm</text>
<line x1="100" y1="86" x2="100" y2="94" stroke="var(--fg)"/><text x="100" y="104">10 nm</text>
<line x1="140" y1="86" x2="140" y2="94" stroke="var(--fg)"/><text x="140" y="104">100 nm</text>
<line x1="180" y1="86" x2="180" y2="94" stroke="var(--fg)"/><text x="180" y="104">1 µm</text>
<line x1="220" y1="86" x2="220" y2="94" stroke="var(--fg)"/><text x="220" y="104">10 µm</text>
<line x1="260" y1="86" x2="260" y2="94" stroke="var(--fg)"/><text x="260" y="104">100 µm</text>
<line x1="300" y1="86" x2="300" y2="94" stroke="var(--fg)"/><text x="300" y="104">1 mm</text>
</g>
<g font-size="9" fill="var(--fg)" text-anchor="middle">
<circle cx="20" cy="76" r="2" fill="var(--c2)"/><text x="20" y="66">atom</text>
<circle cx="88" cy="76" r="3" fill="var(--c4)"/><text x="80" y="54">protein</text><line x1="84" y1="57" x2="88" y2="72" stroke="var(--grid)"/>
<circle cx="116" cy="76" r="3.5" fill="var(--c4)"/><text x="116" y="66">ribosome</text>
<circle cx="146" cy="76" r="4" fill="var(--c5)"/><text x="150" y="44">virus</text><line x1="149" y1="47" x2="146" y2="71" stroke="var(--grid)"/>
<ellipse cx="192" cy="76" rx="7" ry="4" fill="var(--c3)"/><text x="192" y="62">bacterium</text>
<circle cx="232" cy="74" r="8" fill="var(--c1)" fill-opacity="0.5" stroke="var(--c1)"/><text x="228" y="40">your cells</text><line x1="230" y1="43" x2="232" y2="65" stroke="var(--grid)"/>
<circle cx="263" cy="72" r="10" fill="var(--c6)" fill-opacity="0.4" stroke="var(--c6)"/><text x="280" y="56">human egg</text>
</g>
<g font-size="9">
<rect x="20" y="118" width="250" height="10" rx="3" fill="var(--c2)" fill-opacity="0.3"/><text x="24" y="126" fill="var(--fg)">electron microscope (~0.1 nm and up)</text>
<rect x="170" y="134" width="130" height="10" rx="3" fill="var(--c1)" fill-opacity="0.3"/><text x="174" y="142" fill="var(--fg)">light microscope (≳0.2 µm)</text>
<rect x="260" y="150" width="40" height="10" rx="3" fill="var(--c3)" fill-opacity="0.3"/><text x="256" y="158" fill="var(--fg)" text-anchor="end">naked eye (≳0.1 mm)</text>
</g>
<text x="160" y="16" text-anchor="middle" font-size="10" fill="var(--fg)" font-weight="700">Each tick = 10× bigger (log scale)</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Is fire alive?',
      body: String.raw`Fire *grows*, *consumes fuel*, *gives off heat* and can *spread* (sort of reproduce). A crystal grows too. A virus can make copies of itself. Yet biologists say none of these is alive in the full sense.

So what exactly is the difference? Biology needs a clear answer, because "life" is the thing the whole subject studies. In this lesson you will learn the short list of properties that **every** living thing shares — and why the **cell** is the smallest thing that has them all.`,
    },
    {
      kind: 'explain',
      title: 'The properties of life',
      body: String.raw`There is no one-line definition everyone agrees on, but every known living thing shows **all** of these together:

1. **Organisation** — built from one or more **cells** (tiny membrane-wrapped compartments).
2. **Metabolism** — takes in energy and matter and uses chemical reactions to build and maintain itself.
3. **Homeostasis** — keeps its internal conditions (water, temperature, acidity) within a narrow range.
4. **Growth & development** — gets bigger and changes in a controlled, inherited way.
5. **Reproduction** — makes new individuals.
6. **Response to stimuli** — senses and reacts to its environment.
7. **Heredity & evolution** — passes on genetic information (DNA), so populations adapt over generations.

> Non-living things can show *some* of these. Life shows **all** of them at once.`,
    },
    {
      kind: 'mcq',
      prompt: 'Fire grows, uses fuel and spreads. Which property of life does fire clearly **lack**?',
      choices: [
        'Using energy',
        'Growth',
        'Heredity: it has no genetic information that is copied and passed on',
        'Changing over time',
      ],
      answer: 2,
      why: 'Fire does consume fuel and release energy, and it can grow. What it lacks is inherited information: a new fire is not built from instructions copied from the old one, so fires cannot evolve by natural selection. (It also lacks cells and homeostasis.)',
    },
    {
      kind: 'widget',
      title: 'Levels of organisation',
      body: 'Biology spans an enormous range of scales. Life "switches on" at the **cell** level: a single molecule or organelle is not alive on its own, but a single cell can be (think of a bacterium).',
      widget: { type: 'SvgDiagram', props: { svg: levelsSvg } },
    },
    {
      kind: 'explain',
      title: 'Cell theory',
      body: String.raw`In the 1830s Matthias Schleiden and Theodor Schwann proposed — and in 1855 Rudolf Virchow completed — **cell theory**, one of the foundations of biology:

1. All living things are made of one or more cells.
2. The cell is the basic unit of structure and function in living things.
3. All cells come from pre-existing cells (*omnis cellula e cellula*).

**Example.** A bacterium is a whole organism made of *one* cell. You are made of roughly $3\times10^{13}$ (30 trillion) human cells, all descended by division from one fertilised egg.`,
    },
    {
      kind: 'widget',
      title: 'How small is a cell?',
      body: 'Most cells are far below what the eye can see. Note the **log scale**: each tick is ten times larger than the previous one. Your cells are about 10 µm (a hundredth of a millimetre) across; a typical bacterium is about 1–2 µm.',
      widget: { type: 'SvgDiagram', props: { svg: scaleSvg }, caption: '1 µm (micrometre) = $10^{-6}$ m; 1 nm (nanometre) = $10^{-9}$ m.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`An animal cell is about 20 µm across; a bacterium about 2 µm. Treating both as spheres, how many times larger is the animal cell's **volume**? (Volume scales as diameter cubed.)`,
      answer: 1000,
      tolerance: 1,
      why: String.raw`The diameter ratio is $20/2 = 10$, and volume $\propto d^3$, so the volume ratio is $10^3 = 1000$. A common slip is answering 10 (the diameter ratio) or 100 (the area ratio).`,
    },
    {
      kind: 'explain',
      title: 'Unity: all life runs on the same machinery',
      body: String.raw`Across bacteria, mushrooms, oak trees and humans, cells share a remarkable common toolkit:

- **DNA** stores hereditary information, written in the same four "letters" (A, T, G, C).
- **Nearly the same genetic code** translates that information into proteins, using **ribosomes**.
- **ATP** is the universal short-term energy currency.
- A **membrane** of lipids surrounds every cell.

The simplest explanation is shared ancestry: all known life descends from a **last universal common ancestor** (LUCA) that lived more than 3.5 billion years ago. That is why a human gene can often work when put into yeast — you will see this again in [the structure of DNA](@bio/dna-structure).`,
    },
    {
      kind: 'match',
      prompt: 'Match each observation to the property of life it shows.',
      pairs: [
        ['You sweat on a hot day, keeping body temperature near 37 °C', 'Homeostasis'],
        ['A plant bends towards a window', 'Response to stimuli'],
        ['Yeast converts sugar into energy it can use', 'Metabolism'],
        ['Bacteria become resistant to an antibiotic over many generations', 'Evolution'],
        ['An acorn becomes an oak tree', 'Growth & development'],
      ],
      why: 'Homeostasis means holding internal conditions steady; bending toward light is a response; converting food to usable energy is metabolism; heritable change in a population over generations is evolution; the inherited programme turning an acorn into a tree is development.',
    },
    {
      kind: 'widget',
      title: 'The hard case: are viruses alive?',
      body: 'Step through the checklist for a virus such as influenza.',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            '**Cells?** No. A virus particle is genetic material (DNA *or* RNA) in a protein shell, sometimes with a membrane envelope — about 100 nm, far smaller than a cell.',
            '**Metabolism?** No. Outside a host, a virus particle does no chemistry of its own; it is inert.',
            '**Reproduction?** Only by hijacking a host cell’s ribosomes, enzymes and energy to build new virus particles.',
            '**Heredity & evolution?** Yes! Viral genomes are copied, mutate, and evolve rapidly — that is why flu vaccines are updated yearly.',
            '**Verdict:** most biologists say viruses are *not alive* on their own but sit at the boundary: they are biological replicators that depend completely on living cells. You will meet them properly in [Viruses](@bio/viruses).',
          ],
        },
      },
    },
    {
      kind: 'truefalse',
      prompt: 'A virus is a very small type of cell.',
      answer: false,
      why: 'A virus has no cell membrane of its own enclosing a metabolism, no ribosomes and no cytoplasm — it is a package of genes in a protein coat. It can only reproduce inside a host cell, which is why it is not counted as a cell.',
    },
    {
      kind: 'multi',
      prompt: 'Which of these are shared by **all** living organisms?',
      choices: ['Made of at least one cell', 'Use DNA as hereditary material', 'Have a nucleus', 'Carry out metabolism', 'Can move from place to place'],
      answers: [0, 1, 3],
      why: 'All organisms are cellular, store genes in DNA and run a metabolism. Bacteria have no nucleus, and plants and many fungi do not move around — so those are not universal.',
    },
    {
      kind: 'order',
      prompt: 'Put these levels of biological organisation in order from **smallest** to **largest**.',
      steps: ['Molecule', 'Organelle', 'Cell', 'Tissue', 'Organ', 'Organism', 'Population'],
      why: 'Molecules build organelles, organelles work together inside cells, similar cells form tissues, tissues form organs, organs make an organism, and organisms of one species living together form a population.',
    },
    {
      kind: 'fill',
      prompt: 'The ___ is the smallest unit that shows all the properties of life. New cells arise only by ___ of existing cells, and hereditary information in every cell is stored in ___.',
      bank: ['cell', 'division', 'DNA', 'atom', 'fusion', 'protein'],
      answer: ['cell', 'division', 'DNA'],
      why: 'This is cell theory: cells are the basic units of life and come only from other cells (Virchow). All cellular life stores its genes in DNA (some viruses use RNA, but viruses are not cells).',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Life = a **package** of properties: cells, metabolism, homeostasis, growth, reproduction, response, heredity/evolution.
- **Cell theory:** all organisms are made of cells; the cell is life’s basic unit; cells come from cells.
- Cells are tiny: ~1–2 µm for bacteria, ~10–30 µm for animal cells.
- All life shares DNA, (nearly) one genetic code, ribosomes, ATP and membranes — evidence for a common ancestor.
- Viruses are at the boundary: they evolve but cannot metabolise or reproduce without a host cell.

Next: the two basic designs of cell, [prokaryotes and eukaryotes](@bio/prokaryote-vs-eukaryote).`,
    },
  ],
  references: [
    { authors: 'Clark, M. A., Douglas, M., Choi, J.', title: 'Biology 2e', year: 2018, venue: 'OpenStax', detail: 'Ch. 1.2 “Themes and Concepts of Biology”; Ch. 4.1 “Studying Cells”', url: 'https://openstax.org/details/books/biology-2e' },
    { authors: 'Urry, L. A., et al.', title: 'Campbell Biology', year: 2020, venue: '12th ed., Pearson', detail: 'Ch. 1' },
    { authors: 'Alberts, B., et al.', title: 'Molecular Biology of the Cell', year: 2022, venue: '7th ed., W. W. Norton', detail: 'Ch. 1 “Cells, Genomes, and the Diversity of Life”' },
    { authors: 'Sender, R., Fuchs, S., Milo, R.', title: 'Revised estimates for the number of human and bacteria cells in the body', year: 2016, venue: 'PLoS Biology 14, e1002533' },
  ],
} satisfies LessonContent;
