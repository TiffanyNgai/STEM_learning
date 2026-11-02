import type { LessonContent } from '../../types';

// --- phospholipid bilayer (fluid mosaic) diagram, generated ---
const lipid = (x: number, top: boolean) => {
  const y = top ? 62 : 128; const d = top ? 1 : -1;
  return `<circle cx="${x}" cy="${y}" r="5" fill="var(--c2)"/>` +
    `<path d="M${x - 2},${y + 5 * d} q-2,${8 * d} 0,${16 * d} t0,${10 * d} M${x + 2},${y + 5 * d} q2,${8 * d} 0,${16 * d} t0,${10 * d}" fill="none" stroke="var(--c3)" stroke-width="1.4"/>`;
};
const xs = Array.from({ length: 27 }, (_, i) => 18 + i * 11).filter((x) => (x < 120 || x > 152) && (x < 222 || x > 262));
const bilayerSvg = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<text x="8" y="22" font-size="9" fill="var(--muted)">outside the cell (watery)</text>
<text x="8" y="178" font-size="9" fill="var(--muted)">cytosol (watery)</text>
${xs.map((x) => lipid(x, true) + lipid(x, false)).join('')}
<g><rect x="122" y="50" width="12" height="90" rx="5" fill="var(--c4)" fill-opacity="0.75"/><rect x="140" y="50" width="12" height="90" rx="5" fill="var(--c4)" fill-opacity="0.75"/>
<circle cx="137" cy="40" r="3.5" fill="var(--c5)"><animate attributeName="cy" values="40;95;150" dur="2.5s" repeatCount="indefinite"/></circle></g>
<g><ellipse cx="242" cy="95" rx="20" ry="46" fill="var(--c6)" fill-opacity="0.7"/>
<path d="M232,49 l-6,-12 M242,49 l0,-14 M252,49 l6,-12" stroke="var(--c1)" stroke-width="2"/>
<animateTransform attributeName="transform" type="translate" values="0,0;-8,0;0,0;8,0;0,0" dur="5s" repeatCount="indefinite"/></g>
<g font-size="9" fill="var(--fg)">
<text x="186" y="22">sugar chain (ID tag)</text><line x1="210" y1="26" x2="236" y2="38" stroke="var(--grid)"/>
<text x="106" y="186">channel protein</text>
<text x="226" y="160">transmembrane</text><text x="226" y="170">protein (drifts)</text>
<text x="252" y="64" fill="var(--c2)">head: likes water</text>
<text x="252" y="98" fill="var(--c3)">tails: avoid</text><text x="252" y="108" fill="var(--c3)">water</text>
</g>
<text x="12" y="98" font-size="8.5" fill="var(--muted)">~5 nm</text>
</svg>`;

// --- four transport modes ---
const panel = (x0: number, label: string, kind: 'simple' | 'channel' | 'carrier' | 'pump') => {
  const cx = x0 + 38; const up = kind === 'pump';
  const lo = up ? 40 : 150;
  const dotsHi = [[-22, 0], [-10, 8], [6, -6], [18, 6], [-16, 14], [24, -8], [0, 14]].map(([dx, dy]) => `<circle cx="${cx + dx}" cy="${(up ? 140 : 40) + dy}" r="3" fill="var(--c5)"/>`).join('');
  const dotLo = `<circle cx="${cx + 20}" cy="${up ? 40 : 145}" r="3" fill="var(--c5)"/>`;
  const prot = kind === 'channel' ? `<rect x="${cx - 12}" y="72" width="9" height="46" rx="3" fill="var(--c4)"/><rect x="${cx + 3}" y="72" width="9" height="46" rx="3" fill="var(--c4)"/>`
    : kind === 'carrier' ? `<rect x="${cx - 13}" y="72" width="26" height="46" rx="9" fill="var(--c6)"><animate attributeName="rx" values="9;3;9" dur="2.4s" repeatCount="indefinite"/></rect>`
    : kind === 'pump' ? `<rect x="${cx - 13}" y="72" width="26" height="46" rx="6" fill="var(--c3)"/><text x="${cx + 16}" y="132" font-size="9" font-weight="700" fill="var(--c3)">ATP</text>` : '';
  const mover = `<circle cx="${cx}" r="3" fill="var(--c5)" stroke="var(--fg)" stroke-width="0.8"><animate attributeName="cy" values="${up ? lo + 110 : lo - 110};${up ? lo : lo}" dur="2.4s" repeatCount="indefinite"/></circle>`;
  return `<g>${dotsHi}${dotLo}${prot}${mover}<text x="${cx}" y="178" font-size="9" text-anchor="middle" fill="var(--fg)">${label}</text></g>`;
};
const transportSvg = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<rect x="0" y="78" width="320" height="34" fill="var(--c3)" fill-opacity="0.15"/>
<line x1="0" y1="78" x2="320" y2="78" stroke="var(--c2)" stroke-width="3"/><line x1="0" y1="112" x2="320" y2="112" stroke="var(--c2)" stroke-width="3"/>
${panel(0, 'simple diffusion', 'simple')}${panel(80, 'channel', 'channel')}${panel(160, 'carrier', 'carrier')}${panel(240, 'pump', 'pump')}
<path d="M6,8 h228" stroke="var(--c1)" stroke-width="2"/><text x="120" y="20" font-size="9" text-anchor="middle" fill="var(--c1)">passive: down the gradient, no energy</text>
<path d="M248,8 h66" stroke="var(--c3)" stroke-width="2"/><text x="281" y="20" font-size="9" text-anchor="middle" fill="var(--c3)">active: uphill</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'recall',
      title: 'Chemistry you need: water and "oily" molecules',
      points: [
        'Water molecules are **polar** and stick to each other by **hydrogen bonds**.',
        'Charged or polar molecules (ions, sugars) dissolve well in water: they are **hydrophilic**.',
        'Nonpolar molecules (oils, fat tails) cannot hydrogen-bond with water and cluster together — the **hydrophobic effect**.',
      ],
      link: 'chem/intermolecular-forces',
    },
    {
      kind: 'explain',
      title: 'Phospholipids build a bilayer by themselves',
      body: String.raw`Every cell is wrapped in a **plasma membrane** only ~5 nm thick that must be both wall and door. Its secret is its building block. A **phospholipid** has a charged, water-loving (**hydrophilic**) *head* and two water-avoiding (**hydrophobic**) fatty-acid *tails*. Molecules with both personalities are called **amphipathic**.

Put them in water and they spontaneously form a **bilayer**: two sheets, tails tucked inside away from water, heads facing the water on both sides. No energy or instructions are needed — the hydrophobic effect does it.

The **fluid mosaic model** (Singer & Nicolson, 1972): the bilayer is a 2-D fluid in which lipids and proteins drift sideways, with a "mosaic" of proteins embedded in it. Cholesterol (in animals) tunes how fluid it is.`,
    },
    {
      kind: 'widget',
      title: 'The fluid mosaic',
      body: 'Blue heads face water on both sides; orange tails form an oily core. A channel lets an ion through; the large protein drifts sideways in the fluid bilayer.',
      widget: { type: 'SvgDiagram', props: { svg: bilayerSvg } },
    },
    {
      kind: 'explain',
      title: 'Who can cross on their own?',
      body: String.raw`The oily core is the barrier. Rule of thumb: **small and nonpolar → crosses easily; charged or large and polar → needs help.**

- **Easily:** O₂, CO₂, N₂, small lipid-soluble molecules (e.g. steroid hormones, many drugs).
- **Slowly:** water, ethanol, urea (small but polar). Many cells speed water up with **aquaporin** channels.
- **Barely at all:** ions (Na⁺, K⁺, Ca²⁺, Cl⁻), glucose, amino acids, proteins.

A membrane that lets some things through but not others is **selectively permeable**.`,
    },
    {
      kind: 'mcq',
      prompt: 'Without any help from proteins, which of these crosses a pure lipid bilayer **fastest**?',
      choices: ['Na⁺ ion', 'Glucose', 'O₂', 'A protein'],
      answer: 2,
      why: 'O₂ is small and nonpolar, so it dissolves in the oily core and slips straight through. Ions are blocked by their charge (and the water shell around them); glucose is large and polar; proteins are huge.',
    },
    {
      kind: 'explain',
      title: 'Diffusion: random motion, directed result',
      body: String.raw`Molecules jiggle constantly because of heat. Each one moves randomly — but if there are more on the left than the right, more of them will *happen* to wander left→right than right→left. The result is a **net flow from high to low concentration**: **diffusion**.

- It needs no energy input: it runs "downhill", increasing entropy.
- It stops being *net* when concentrations are equal (**equilibrium**) — molecules still cross, but equally in both directions.
- Speed depends on the **concentration gradient** (difference ÷ distance), temperature and molecule size. Roughly, flux $J \propto -\dfrac{\Delta c}{\Delta x}$ (Fick’s law).`,
    },
    {
      kind: 'widget',
      title: 'Watch diffusion happen',
      body: 'Orange solute particles start mostly on the left. Watch the counts. Try equal numbers on both sides — does motion stop?',
      widget: { type: 'DiffusionOsmosis', props: { mode: 'diffusion', left: 45, right: 5, toggle: false } },
    },
    {
      kind: 'truefalse',
      prompt: 'Once concentrations on both sides of a membrane are equal, molecules stop crossing it.',
      answer: false,
      why: 'Equilibrium is **dynamic**: molecules keep crossing in both directions, but at equal rates, so there is no *net* change. The particles in the simulation never stop moving.',
    },
    {
      kind: 'explain',
      title: 'Osmosis: when only water can move',
      body: String.raw`Now suppose the solute (say, sugar) **can’t** cross but water can. Water then moves **toward the side with more dissolved solute** — **osmosis**. (Precisely: water moves from higher to lower *water potential*; dissolved solute lowers water potential.)

Compare the solution outside a cell with the inside:
- **Hypotonic** outside (less solute): water rushes **in** → animal cells swell and may burst; plant cells become firm (turgid).
- **Hypertonic** outside (more solute): water leaves → cells shrivel; plants wilt.
- **Isotonic**: no net water flow. IV drips use 0.9% saline because it is isotonic with blood.`,
    },
    {
      kind: 'widget',
      title: 'Osmosis in action',
      body: 'Big orange solute particles can’t fit through the pores; tiny blue water molecules can. Watch which side’s water level rises. (A cartoon: the real mechanism involves pressure and water’s chemical potential, but the direction is right.)',
      widget: { type: 'DiffusionOsmosis', props: { mode: 'osmosis', left: 40, right: 4, toggle: true } },
    },
    {
      kind: 'mcq',
      prompt: 'A red blood cell is placed in pure (distilled) water. What happens?',
      choices: [
        'It shrinks, because water leaves the cell',
        'Nothing — water is harmless',
        'It swells and may burst, because water enters by osmosis',
        'Salt leaves the cell until concentrations match',
      ],
      answer: 2,
      why: 'Pure water is hypotonic to the cell’s interior, so water flows in toward the higher solute concentration. Animal cells have no wall to resist, so they swell and can burst (haemolysis). The ions mostly can’t leave quickly because the membrane blocks them.',
    },
    {
      kind: 'explain',
      title: 'Helpers and pumps',
      body: String.raw`**Passive transport** (no energy, always downhill):
- **Simple diffusion** through the bilayer.
- **Facilitated diffusion** through **channels** (pores, e.g. K⁺ channels, aquaporins) or **carriers** that change shape (e.g. GLUT glucose transporters).

**Active transport** (uphill, against a gradient, costs energy):
- **Primary**: a **pump** uses ATP directly. The **Na⁺/K⁺ pump** pushes **3 Na⁺ out and 2 K⁺ in per ATP**, and can use up a large share of a resting cell’s energy (much of the brain’s).
- **Secondary**: uses a gradient made by a pump, e.g. SGLT1 lets Na⁺ flow in and drags glucose in with it.

**Bulk transport**: **endocytosis** (engulfing material in vesicles) and **exocytosis** (secreting).`,
      widget: { type: 'SvgDiagram', props: { svg: transportSvg }, caption: 'Red dots: the transported molecule. Only the pump moves cargo **uphill** (low → high), paid for with ATP.' },
    },
    {
      kind: 'match',
      prompt: 'Match each process to an example.',
      pairs: [
        ['Simple diffusion', 'O₂ entering a lung cell'],
        ['Facilitated diffusion', 'Glucose entering a red blood cell via GLUT1'],
        ['Primary active transport', 'Na⁺/K⁺ pump using ATP'],
        ['Osmosis', 'A wilted plant recovering after watering'],
        ['Endocytosis', 'A white blood cell engulfing a bacterium'],
      ],
      why: 'O₂ crosses the bilayer unaided; GLUT1 is a carrier that lets glucose flow down its gradient; the Na⁺/K⁺ pump burns ATP; water moving into vacuoles restores turgor; engulfing a bacterium is phagocytosis, a form of endocytosis.',
    },
    {
      kind: 'multi',
      prompt: 'Which of these require an energy input (ATP directly, or a gradient that ATP built)?',
      choices: ['Na⁺/K⁺ pump', 'Osmosis', 'Glucose uptake by SGLT1 together with Na⁺', 'O₂ diffusing into a cell', 'Endocytosis of a bacterium', 'K⁺ flowing out through an open K⁺ channel'],
      answers: [0, 2, 4],
      why: 'The pump burns ATP; SGLT1 is secondary active transport powered by the Na⁺ gradient the pump made; endocytosis needs ATP to reshape membranes. Osmosis, simple diffusion and flow through an open channel are all passive — they run downhill on their own.',
    },
    {
      kind: 'numeric',
      prompt: 'A cell’s Na⁺/K⁺ pumps hydrolyse 1,000 ATP molecules. How many Na⁺ ions are pumped **out** in total?',
      answer: 3000,
      tolerance: 0,
      unit: 'ions',
      why: 'Each pump cycle uses 1 ATP to move 3 Na⁺ out and 2 K⁺ in, so 1,000 ATP export 3,000 Na⁺ (and import 2,000 K⁺). This unequal exchange also makes the inside slightly negative.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Membrane = **phospholipid bilayer** (hydrophilic heads out, hydrophobic tails in) + proteins: the **fluid mosaic**.
- Small nonpolar molecules diffuse through; ions and large polar molecules need **channels**, **carriers** or **pumps**.
- **Diffusion**: net movement from high to low concentration, no energy; equilibrium is dynamic.
- **Osmosis**: water moves toward higher solute concentration across a selectively permeable membrane (hypo-/hyper-/isotonic).
- **Active transport** uses energy to move things uphill (Na⁺/K⁺ pump: 3 Na⁺ out, 2 K⁺ in per ATP).`,
    },
  ],
  references: [
    { authors: 'Clark, M. A., Douglas, M., Choi, J.', title: 'Biology 2e', year: 2018, venue: 'OpenStax', detail: 'Ch. 5 “Structure and Function of Plasma Membranes”', url: 'https://openstax.org/details/books/biology-2e' },
    { authors: 'Alberts, B., et al.', title: 'Molecular Biology of the Cell', year: 2022, venue: '7th ed., W. W. Norton', detail: 'Ch. 10–11' },
    { authors: 'Singer, S. J., Nicolson, G. L.', title: 'The fluid mosaic model of the structure of cell membranes', year: 1972, venue: 'Science 175, 720–731' },
    { authors: 'Skou, J. C.', title: 'The influence of some cations on an adenosine triphosphatase from peripheral nerves', year: 1957, venue: 'Biochimica et Biophysica Acta 23, 394–401' },
  ],
} satisfies LessonContent;
