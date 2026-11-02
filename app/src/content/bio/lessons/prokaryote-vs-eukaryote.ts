import type { LessonContent } from '../../types';

const bacteriumSvg = String.raw`<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<g stroke="var(--fg)" stroke-width="1.2">
<line x1="95" y1="54" x2="90" y2="40"/><line x1="125" y1="52" x2="125" y2="38"/><line x1="185" y1="52" x2="188" y2="38"/><line x1="210" y1="56" x2="218" y2="42"/>
</g>
<rect x="50" y="52" width="196" height="96" rx="48" fill="none" stroke="var(--muted)" stroke-dasharray="4 3"/>
<rect x="58" y="60" width="180" height="80" rx="40" fill="var(--c1)" fill-opacity="0.12" stroke="var(--c3)" stroke-width="4"/>
<rect x="64" y="66" width="168" height="68" rx="34" fill="none" stroke="var(--c2)" stroke-width="1.5"/>
<path d="M120,95 q10,-22 25,-5 t25,5 t20,-10 q5,25 -20,20 t-25,5 t-25,-15 z" fill="none" stroke="var(--c4)" stroke-width="2"/>
<circle cx="206" cy="84" r="6" fill="none" stroke="var(--c5)" stroke-width="2"/>
<g fill="var(--fg)"><circle cx="90" cy="85" r="2"/><circle cx="100" cy="112" r="2"/><circle cx="84" cy="102" r="2"/><circle cx="200" cy="112" r="2"/><circle cx="214" cy="104" r="2"/><circle cx="170" cy="122" r="2"/><circle cx="130" cy="120" r="2"/></g>
<path d="M238,100 q10,-10 20,0 t20,0 t20,0 t18,0" fill="none" stroke="var(--c6)" stroke-width="2">
<animate attributeName="d" dur="0.8s" repeatCount="indefinite" values="M238,100 q10,-10 20,0 t20,0 t20,0 t18,0;M238,100 q10,10 20,0 t20,0 t20,0 t18,0;M238,100 q10,-10 20,0 t20,0 t20,0 t18,0"/></path>
<g font-size="9" fill="var(--fg)">
<text x="6" y="32">pili (attachment)</text><line x1="60" y1="35" x2="90" y2="40" stroke="var(--grid)"/>
<text x="150" y="26">capsule (sticky outer layer)</text><line x1="190" y1="29" x2="230" y2="58" stroke="var(--grid)"/>
<text x="4" y="170">cell wall</text><line x1="30" y1="162" x2="64" y2="128" stroke="var(--grid)"/>
<text x="4" y="186">plasma membrane</text><line x1="50" y1="179" x2="74" y2="124" stroke="var(--grid)"/>
<text x="110" y="178" fill="var(--c4)">nucleoid: circular chromosome</text><line x1="150" y1="170" x2="150" y2="113" stroke="var(--grid)"/>
<text x="210" y="168" fill="var(--c5)">plasmid</text><line x1="220" y1="160" x2="207" y2="91" stroke="var(--grid)"/>
<text x="10" y="80">ribosomes</text><line x1="52" y1="82" x2="86" y2="85" stroke="var(--grid)"/>
<text x="262" y="125" fill="var(--c6)">flagellum</text>
</g>
<text x="160" y="196" text-anchor="middle" font-size="8.5" fill="var(--muted)">typical rod-shaped bacterium, ~2 µm long</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Two ways to build a cell',
      body: String.raw`Look down a microscope at bacteria from your mouth and then at cells scraped from your cheek, and you see two very different designs.

Every cell belongs to one of two plans:

- **Prokaryotic** cells (*pro* = before, *karyon* = kernel/nucleus): small and simple inside, with **no nucleus**.
- **Eukaryotic** cells (*eu* = true): larger, with a **nucleus** and many internal membrane-bound compartments called **organelles**.

Bacteria and archaea are prokaryotes. Animals, plants, fungi and protists (like amoebae) are eukaryotes.`,
    },
    {
      kind: 'explain',
      title: 'The prokaryotic cell',
      body: String.raw`A prokaryote is like a **studio apartment**: one room where everything happens.

- Its DNA is usually a single **circular chromosome**, sitting in a region called the **nucleoid** — not wrapped in a membrane.
- Extra small DNA circles, **plasmids**, often carry handy genes such as antibiotic resistance.
- **Ribosomes** build proteins right in the cytoplasm.
- A **cell wall** (made of peptidoglycan in bacteria) outside the membrane resists bursting.
- Many have a whip-like **flagellum** for swimming and **pili** for sticking to surfaces.

Typical size: **1–5 µm**.`,
    },
    {
      kind: 'widget',
      title: 'Anatomy of a bacterium',
      widget: { type: 'SvgDiagram', props: { svg: bacteriumSvg }, caption: 'The flagellum is actually a rigid helix spun by a rotary motor in the membrane — a true biological propeller.' },
    },
    {
      kind: 'mcq',
      prompt: 'What does a prokaryotic cell **lack** that a eukaryotic cell has?',
      choices: ['DNA', 'Ribosomes', 'A membrane-bound nucleus', 'A plasma membrane'],
      answer: 2,
      why: 'All cells have DNA, ribosomes and a plasma membrane. Prokaryotes keep their DNA in a nucleoid that is not enclosed by a membrane — “no nucleus” is the defining difference.',
    },
    {
      kind: 'explain',
      title: 'The eukaryotic cell',
      body: String.raw`A eukaryote is like a **house with many rooms**, each specialised.

- The **nucleus**, enclosed by a double membrane, holds several **linear chromosomes**.
- **Organelles** — mitochondria, endoplasmic reticulum, Golgi apparatus, lysosomes, and (in plants) chloroplasts — each have their own membrane and job.
- A **cytoskeleton** of protein filaments gives shape and moves things around.

Typical size: **10–100 µm** — so roughly 10× wider and ~1000× larger in volume than a typical bacterium. Tap around the cell below; you will meet each part properly in [Inside a cell](@bio/cell-structure).`,
    },
    {
      kind: 'widget',
      title: 'A eukaryotic (animal) cell',
      body: 'Tap the **nucleus** first, then a **mitochondrion**. Compare with the bacterium: note how much of this cell is divided into membrane-wrapped compartments.',
      widget: { type: 'CellExplorer', props: { kind: 'animal', toggle: false, highlight: 'nucleus' } },
    },
    {
      kind: 'explain',
      title: 'Why can’t a bacterium just grow huge?',
      body: String.raw`Everything a cell needs (food, oxygen) and must get rid of (waste) crosses its **surface**, but the demand comes from its **volume**. For a sphere of radius $r$:

$$\frac{\text{surface area}}{\text{volume}} = \frac{4\pi r^2}{\tfrac{4}{3}\pi r^3} = \frac{3}{r}$$

So as a cell grows, its surface-to-volume ratio **falls**. Double the radius → half as much membrane per unit of cytoplasm.

**Worked example.** $r = 1$ µm gives $3$ µm⁻¹; $r = 10$ µm gives $0.3$ µm⁻¹ — ten times less surface per volume. Eukaryotes cope by having internal membranes (organelles), a cytoskeleton that actively transports cargo, and, in many cells, elongated or folded shapes.`,
    },
    {
      kind: 'widget',
      title: 'Surface-to-volume shrinks with size',
      body: String.raw`Plot of $SA/V = 3/r$. Notice how quickly it drops at small radii — this is why most cells are microscopic.`,
      widget: { type: 'FunctionPlot', props: { fns: ['3/x'], x: [0, 20], y: [0, 4], xLabel: 'radius r (µm)', yLabel: 'SA/V (per µm)', labels: ['SA/V = 3/r'] } },
    },
    {
      kind: 'numeric',
      prompt: 'What is the surface-area-to-volume ratio of a spherical cell with radius 5 µm? (Answer in µm⁻¹.)',
      answer: 0.6,
      tolerance: 0.01,
      unit: 'µm⁻¹',
      why: String.raw`$SA/V = 3/r = 3/5 = 0.6$ µm⁻¹. If you got 1.67, you computed $r/3$ — the ratio gets *smaller* as cells get bigger.`,
    },
    {
      kind: 'explain',
      title: 'Endosymbiosis: organelles that were once bacteria',
      body: String.raw`Where did eukaryotes come from? Strong evidence says **mitochondria** descend from bacteria (related to today’s α-proteobacteria) that were engulfed by an ancestral host cell (related to today’s Asgard archaea) roughly 2 billion years ago and never left. **Chloroplasts** came later from an engulfed cyanobacterium. This is the **endosymbiotic theory** (championed by Lynn Margulis in 1967).

Evidence: mitochondria and chloroplasts
- have **two membranes** (the inner one from the bacterium);
- carry their own small **circular DNA**;
- have **bacteria-like ribosomes**;
- divide by **fission**, like bacteria.`,
    },
    {
      kind: 'mcq',
      prompt: 'Which observation is the **strongest** evidence that mitochondria descended from free-living bacteria?',
      choices: [
        'Mitochondria make ATP',
        'Mitochondria have their own circular DNA whose genes resemble bacterial genes',
        'Mitochondria are found in nearly all eukaryotic cells',
        'Mitochondria can move around the cell',
      ],
      answer: 1,
      why: 'Making ATP or being widespread doesn’t say where mitochondria came from. Their own circular genome — with gene sequences that place them on the bacterial family tree — is direct evidence of bacterial ancestry.',
    },
    {
      kind: 'multi',
      prompt: 'Which structures are found in **both** prokaryotic and eukaryotic cells?',
      choices: ['Plasma membrane', 'Ribosomes', 'Nucleus', 'DNA', 'Mitochondria', 'Cytoplasm'],
      answers: [0, 1, 3, 5],
      why: 'Every cell has a membrane, cytoplasm, DNA and ribosomes — the bare minimum to be alive. Nuclei and mitochondria are eukaryote-only. (Prokaryotes make ATP using their plasma membrane instead.)',
    },
    {
      kind: 'match',
      prompt: 'Match each bacterial structure to its job.',
      pairs: [
        ['Nucleoid', 'Region holding the main circular chromosome'],
        ['Plasmid', 'Small extra DNA circle, e.g. carrying antibiotic resistance'],
        ['Flagellum', 'Rotating propeller for swimming'],
        ['Cell wall', 'Rigid layer that stops the cell bursting'],
        ['Pili', 'Hair-like fibres for attaching to surfaces'],
      ],
      why: 'These are the standard parts of a bacterium: the nucleoid holds the chromosome, plasmids carry optional genes, the flagellum swims, the wall resists water pressure, and pili help bacteria stick (and exchange DNA).',
    },
    {
      kind: 'truefalse',
      prompt: 'Archaea are a type of bacteria.',
      answer: false,
      why: 'Archaea look like bacteria (small, no nucleus) but are a separate domain of life with distinct membranes and gene-expression machinery that in many ways resembles eukaryotes. “Prokaryote” describes the cell plan, not a single evolutionary group.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Prokaryotes** (bacteria, archaea): no nucleus, DNA in a nucleoid, usually 1–5 µm.
- **Eukaryotes** (animals, plants, fungi, protists): nucleus + membrane-bound organelles, usually 10–100 µm.
- All cells share a plasma membrane, cytoplasm, DNA and ribosomes.
- Surface-to-volume ratio $=3/r$ falls as cells grow — a key reason cells are small and eukaryotes are compartmentalised.
- Mitochondria and chloroplasts are descendants of engulfed bacteria (**endosymbiosis**).`,
    },
  ],
  references: [
    { authors: 'Clark, M. A., Douglas, M., Choi, J.', title: 'Biology 2e', year: 2018, venue: 'OpenStax', detail: 'Ch. 4.2 “Prokaryotic Cells”, 4.3 “Eukaryotic Cells”', url: 'https://openstax.org/details/books/biology-2e' },
    { authors: 'Alberts, B., et al.', title: 'Molecular Biology of the Cell', year: 2022, venue: '7th ed., W. W. Norton', detail: 'Ch. 1' },
    { authors: 'Sagan (Margulis), L.', title: 'On the origin of mitosing cells', year: 1967, venue: 'Journal of Theoretical Biology 14, 225–274' },
    { authors: 'Imachi, H., et al.', title: 'Isolation of an archaeon at the prokaryote–eukaryote interface', year: 2020, venue: 'Nature 577, 519–525' },
  ],
} satisfies LessonContent;
