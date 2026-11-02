import type { LessonContent } from '../../types';

const traffickingSvg = String.raw`<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<path d="M300,10 Q318,90 300,170" fill="none" stroke="var(--c2)" stroke-width="4"/>
<circle cx="30" cy="90" r="34" fill="var(--c4)" fill-opacity="0.2" stroke="var(--c4)" stroke-width="2" stroke-dasharray="9 2"/>
<text x="30" y="93" text-anchor="middle" font-size="9" fill="var(--fg)">nucleus</text>
<g fill="none" stroke="var(--c6)" stroke-width="3">
<path d="M72,50 Q100,90 72,130"/><path d="M84,46 Q114,90 84,134"/><path d="M96,42 Q128,90 96,138"/>
</g>
<g fill="var(--fg)"><circle cx="78" cy="62" r="1.6"/><circle cx="85" cy="76" r="1.6"/><circle cx="88" cy="96" r="1.6"/><circle cx="83" cy="116" r="1.6"/><circle cx="98" cy="70" r="1.6"/><circle cx="101" cy="108" r="1.6"/></g>
<g fill="none" stroke="var(--c5)" stroke-width="4" stroke-linecap="round">
<path d="M180,60 Q190,90 180,120"/><path d="M190,64 Q200,90 190,116"/><path d="M200,68 Q210,90 200,112"/><path d="M210,72 Q220,90 210,108"/>
</g>
<path id="route" d="M110,90 C135,70 160,75 178,88 M222,90 C250,92 275,96 300,92" fill="none" stroke="var(--grid)" stroke-dasharray="3 3"/>
<circle r="5" fill="var(--c3)" fill-opacity="0.35" stroke="var(--c3)" stroke-width="1.5">
<animateMotion dur="2.2s" repeatCount="indefinite" path="M110,90 C135,70 160,75 178,88"/>
</circle>
<circle r="5" fill="var(--c3)" fill-opacity="0.35" stroke="var(--c3)" stroke-width="1.5">
<animateMotion dur="2.2s" begin="1.1s" repeatCount="indefinite" path="M222,90 C250,92 275,96 298,92"/>
</circle>
<g font-size="9" fill="var(--fg)" text-anchor="middle">
<text x="96" y="160">rough ER</text><text x="96" y="171" fill="var(--muted)">protein made</text>
<text x="196" y="145">Golgi</text><text x="196" y="156" fill="var(--muted)">modified &amp; sorted</text>
<text x="150" y="60" fill="var(--c3)">vesicle</text>
<text x="275" y="125">membrane</text><text x="275" y="136" fill="var(--muted)">secreted</text>
</g>
<text x="160" y="16" text-anchor="middle" font-size="10" font-weight="700" fill="var(--fg)">The secretory pathway</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A cell is a busy city',
      body: String.raw`Think of a eukaryotic cell as a walled city. The **plasma membrane** is the city wall with guarded gates. The **nucleus** is the city archive holding the master plans (DNA). **Ribosomes** are workshops building products (proteins). The **ER** and **Golgi** are factories and a post office; **vesicles** are delivery trucks; **mitochondria** are power stations; **lysosomes** are recycling centres.

The analogy is rough — a cell has no central planner — but it captures the key idea: **division of labour among compartments**, each called an **organelle** ("little organ").`,
    },
    {
      kind: 'widget',
      title: 'Explore an animal cell',
      body: 'Tap each part. Try to find the organelles that make proteins, process them, and supply energy.',
      widget: { type: 'CellExplorer', props: { kind: 'animal', toggle: false } },
    },
    {
      kind: 'explain',
      title: 'The information centre: nucleus & ribosomes',
      body: String.raw`The **nucleus** (~5–10 µm) stores the DNA, packaged with proteins as **chromatin**. It is enclosed by the **nuclear envelope**, a double membrane pierced by **nuclear pores** that control what enters and leaves — for example, RNA copies of genes exit through the pores. Inside, the **nucleolus** assembles ribosome parts.

**Ribosomes** read those RNA copies and build proteins. They are not membrane-bound. Some float freely in the cytosol (making proteins that stay there); others sit on the **rough ER** (making proteins for membranes, lysosomes or export). The full story is [the central dogma](@bio/central-dogma).`,
    },
    {
      kind: 'explain',
      title: 'The endomembrane system',
      body: String.raw`A connected set of membranes handles making, processing and shipping:

1. **Rough ER** — a maze of membrane sheets covered in ribosomes. Proteins made here are threaded *into* the ER, where they fold and may get sugar tags.
2. **Smooth ER** — no ribosomes; makes lipids, detoxifies drugs (abundant in liver), stores calcium.
3. **Golgi apparatus** — a stack of flat sacs that modifies, sorts and labels proteins, like a post office.
4. **Vesicles** — membrane bubbles that carry cargo between compartments and to the surface.
5. **Lysosomes** — acidic sacs of digestive enzymes that recycle old parts and digest engulfed material.`,
    },
    {
      kind: 'widget',
      title: 'Follow a secreted protein',
      body: 'A hormone like insulin travels ER → Golgi → membrane, carried by vesicles. When the final vesicle fuses with the plasma membrane its contents are released outside: **exocytosis**.',
      widget: { type: 'SvgDiagram', props: { svg: traffickingSvg } },
    },
    {
      kind: 'order',
      prompt: 'Put the journey of insulin (a secreted protein) through a pancreatic cell in order.',
      steps: [
        'A ribosome on the rough ER starts making the protein',
        'The new chain is threaded into the ER and folds',
        'A transport vesicle buds off and carries it to the Golgi',
        'The Golgi modifies, sorts and packages it',
        'A secretory vesicle fuses with the plasma membrane (exocytosis)',
      ],
      why: 'This is the secretory pathway: rough ER (synthesis and folding) → vesicle → Golgi (processing and sorting) → vesicle → plasma membrane. The Golgi comes after the ER, not before — it receives cargo from the ER.',
    },
    {
      kind: 'explain',
      title: 'Power stations: mitochondria & chloroplasts',
      body: String.raw`**Mitochondria** (~1–2 µm long) carry out **aerobic respiration**: they use oxygen to extract energy from food molecules and store it in **ATP**, the cell’s energy currency. The inner membrane is folded into **cristae**, packing in more energy-converting machinery. A busy heart-muscle cell can have thousands.

**Chloroplasts** (plants and algae only) carry out **photosynthesis**, capturing light energy to build sugars from CO₂ and water.

Both have double membranes and their own DNA — evidence of their bacterial origin ([endosymbiosis](@bio/prokaryote-vs-eukaryote)). **Peroxisomes** are small single-membrane organelles that break down fatty acids and destroy toxic hydrogen peroxide.`,
    },
    {
      kind: 'match',
      prompt: 'Match each organelle to its main job.',
      pairs: [
        ['Mitochondrion', 'Makes most of the cell’s ATP'],
        ['Golgi apparatus', 'Modifies, sorts and ships proteins'],
        ['Lysosome', 'Digests and recycles worn-out parts'],
        ['Smooth ER', 'Makes lipids and detoxifies drugs'],
        ['Nucleolus', 'Assembles ribosome subunits'],
      ],
      why: 'Mitochondria = energy; Golgi = post office; lysosomes = recycling; smooth ER = lipid synthesis and detox; nucleolus = ribosome factory inside the nucleus.',
    },
    {
      kind: 'mcq',
      prompt: 'Cells of the pancreas secrete large amounts of digestive enzymes (proteins). Which organelle would you expect them to have in **unusual abundance**?',
      choices: ['Smooth ER', 'Rough ER', 'Chloroplasts', 'Centrioles'],
      answer: 1,
      why: 'Secreted proteins are made by ribosomes on the rough ER, so protein-exporting cells are packed with rough ER (and Golgi). Smooth ER is abundant in cells making lipids or steroid hormones, or detoxifying drugs.',
    },
    {
      kind: 'explain',
      title: 'What makes a plant cell different?',
      body: String.raw`Plant cells have everything an animal cell has (including mitochondria!) **plus**:

- a rigid **cell wall** of cellulose outside the membrane;
- **chloroplasts** for photosynthesis;
- a large **central vacuole**, often 80% of the cell’s volume, storing water and ions — its pressure (**turgor**) keeps plants firm;
- **plasmodesmata**: channels through the wall linking neighbouring cells.

Animal cells, in turn, have **centrioles** and **lysosomes** (plants do most digestion in the vacuole) and no wall. Toggle the widget to compare.`,
    },
    {
      kind: 'widget',
      title: 'Plant vs animal cell',
      body: 'Tap the **central vacuole**, then the **chloroplasts**, then switch to the animal cell and look for what is missing.',
      widget: { type: 'CellExplorer', props: { kind: 'plant', highlight: 'vacuole' } },
    },
    {
      kind: 'multi',
      prompt: 'Which structures are found in a typical plant cell but **not** in an animal cell?',
      choices: ['Cell wall', 'Mitochondria', 'Chloroplasts', 'Large central vacuole', 'Nucleus', 'Ribosomes'],
      answers: [0, 2, 3],
      why: 'Wall, chloroplasts and a large central vacuole are plant extras. Plants also have mitochondria, a nucleus and ribosomes — they need respiration too, especially at night and in non-green tissues like roots.',
    },
    {
      kind: 'truefalse',
      prompt: 'Plant cells do not need mitochondria because their chloroplasts make all the energy they need.',
      answer: false,
      why: 'Chloroplasts make sugar using light, but cells still need mitochondria to turn that sugar into ATP — at night, in roots, and in all non-photosynthetic tissues. Plant cells contain both organelles.',
    },
    {
      kind: 'explain',
      title: 'Holding it all together: the cytoskeleton',
      body: String.raw`Organelles don’t just float around. A network of protein filaments, the **cytoskeleton**, gives the cell its shape and acts as railway tracks:

- **Microfilaments** (actin, ~7 nm) — cell shape, crawling, muscle contraction.
- **Intermediate filaments** (~10 nm) — mechanical strength, like ropes.
- **Microtubules** (~25 nm hollow tubes) — tracks for **motor proteins** that carry vesicles, and the spindle that separates chromosomes during division.

Details in [Cytoskeleton & motor proteins](@bio/cytoskeleton-motors).`,
    },
    {
      kind: 'fill',
      prompt: 'DNA is stored in the ___. Proteins for export are made on the ___ and then processed in the ___. ATP is mainly produced in ___.',
      bank: ['nucleus', 'rough ER', 'Golgi', 'mitochondria', 'lysosome', 'smooth ER', 'vacuole'],
      answer: ['nucleus', 'rough ER', 'Golgi', 'mitochondria'],
      why: 'Nucleus = DNA archive; rough ER = site of synthesis for secreted/membrane proteins; Golgi = processing and sorting; mitochondria = aerobic ATP production.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Nucleus**: holds DNA; **nucleolus** builds ribosomes; **ribosomes** make proteins.
- **Endomembrane system**: rough ER (make & fold) → Golgi (modify & sort) → vesicles → surface or lysosomes. Smooth ER makes lipids.
- **Mitochondria** make ATP; **chloroplasts** capture light (plants/algae).
- Plants add a **cell wall**, **chloroplasts** and a **central vacuole** — but keep mitochondria.
- The **cytoskeleton** gives shape and tracks for transport.`,
    },
  ],
  references: [
    { authors: 'Clark, M. A., Douglas, M., Choi, J.', title: 'Biology 2e', year: 2018, venue: 'OpenStax', detail: 'Ch. 4.3–4.5', url: 'https://openstax.org/details/books/biology-2e' },
    { authors: 'Urry, L. A., et al.', title: 'Campbell Biology', year: 2020, venue: '12th ed., Pearson', detail: 'Ch. 6 “A Tour of the Cell”' },
    { authors: 'Alberts, B., et al.', title: 'Molecular Biology of the Cell', year: 2022, venue: '7th ed., W. W. Norton', detail: 'Ch. 12–13' },
  ],
} satisfies LessonContent;
