import type { LessonContent } from '../../types';

/** Madelung (n + l) diagonal diagram, generated. */
const madelung = (() => {
  const L = 'spdf';
  const X = (l: number) => 40 + l * 48;
  const Y = (n: number) => 18 + (n - 1) * 22;
  let s = '<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg"><defs><marker id="md-a" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--c3)"/></marker></defs>';
  for (let n = 1; n <= 7; n++) for (let l = 0; l < Math.min(n, 4); l++)
    s += `<text x="${X(l)}" y="${Y(n) + 4}" font-size="11" text-anchor="middle" fill="var(--fg)">${n}${L[l]}</text>`;
  let k = 0;
  for (let sum = 1; sum <= 8; sum++) {
    const cells: [number, number][] = [];
    for (let l = Math.min(3, sum - 1); l >= 0; l--) { const n = sum - l; if (n > l && n <= 7) cells.push([n, l]); }
    if (!cells.length) continue;
    const [n0, l0] = cells[0]; const [n1, l1] = cells[cells.length - 1];
    s += `<line x1="${X(l0) + 12}" y1="${Y(n0) - 8}" x2="${X(l1) - 12}" y2="${Y(n1) + 10}" stroke="var(--c3)" stroke-width="1.4" marker-end="url(#md-a)" opacity="0"><animate attributeName="opacity" from="0" to="0.9" begin="${(k * 0.5).toFixed(1)}s" dur="0.4s" fill="freeze"/></line>`;
    k++;
  }
  s += '<text x="236" y="22" font-size="10" fill="var(--fg)">Fill along each</text><text x="236" y="34" font-size="10" fill="var(--fg)">arrow, top arrow</text><text x="236" y="46" font-size="10" fill="var(--fg)">first (low n + ℓ).</text>';
  s += '<text x="236" y="70" font-size="9" fill="var(--muted)">Ties in n + ℓ:</text><text x="236" y="82" font-size="9" fill="var(--muted)">lower n first.</text>';
  s += '<text x="8" y="186" font-size="9.5" fill="var(--c2)">1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p 7s …</text></svg>';
  return s;
})();

/** Periodic table coloured by block, generated. */
const blocks = (() => {
  const w = 16, h = 16, x0 = 14, y0 = 20;
  const col: Record<string, string> = { s: 'var(--c2)', p: 'var(--c1)', d: 'var(--c3)', f: 'var(--c4)' };
  let s = '<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">';
  const cell = (x: number, y: number, b: string) => { s += `<rect x="${x}" y="${y}" width="${w - 1.5}" height="${h - 1.5}" rx="2" fill="${col[b]}" opacity="0.75"/>`; };
  for (let p = 1; p <= 7; p++) for (let g = 1; g <= 18; g++) {
    if (p === 1 && g > 1 && g < 18) continue;
    if (p <= 3 && g > 2 && g < 13) continue;
    const b = p === 1 && g === 18 ? 's' : g <= 2 ? 's' : g <= 12 ? 'd' : 'p';
    cell(x0 + (g - 1) * w, y0 + (p - 1) * h, b);
  }
  for (let r = 0; r < 2; r++) for (let i = 0; i < 14; i++) cell(x0 + (i + 3) * w, y0 + 7.6 * h + r * h, 'f');
  s += `<text x="${x0 + 8}" y="14" font-size="10" text-anchor="middle" fill="var(--c2)">s</text>`;
  s += `<text x="${x0 + 7.5 * w}" y="${y0 + 2.8 * h}" font-size="10" text-anchor="middle" fill="var(--c3)">d block ↓</text>`;
  s += `<text x="${x0 + 15 * w}" y="${y0 + 0.7 * h}" font-size="10" text-anchor="middle" fill="var(--c1)">p block</text>`;
  s += `<text x="${x0 + 10 * w}" y="${y0 + 10.6 * h}" font-size="10" text-anchor="middle" fill="var(--c4)">f block (lanthanides, actinides)</text>`;
  s += `<text x="${x0 + 5 * w}" y="${y0 + 1.2 * h}" font-size="9" fill="var(--muted)">last electron enters:</text>`;
  s += `<text x="${x0 + 5 * w}" y="${y0 + 2 * h}" font-size="9" fill="var(--muted)">s → ns, p → np, d → (n−1)d</text>`;
  return s + '</svg>';
})();

export default {
  cards: [
    {
      kind: 'explain', title: 'Why the periodic table repeats',
      body: `Lithium, sodium and potassium all fizz in water; fluorine, chlorine and bromine all grab electrons. Chemistry repeats because the *arrangement of electrons* repeats.

Think of an atom as a hotel. Floors are **shells** ($n$), each floor has room types (**subshells** s, p, d, f), each room is an **orbital**. Guests (electrons) take the cheapest room first, at most two share a room, and they spread out before doubling up. This arrangement is the **electron configuration**.`,
    },
    {
      kind: 'explain', title: 'Three filling rules',
      body: String.raw`1. **Aufbau** ("building up"): fill the lowest-energy orbitals first. In many-electron atoms, energy depends on both $n$ and $\ell$: within a shell, $s < p < d < f$, because $s$ electrons penetrate closer to the nucleus and are less shielded by inner electrons.
2. **Pauli exclusion**: no two electrons share all four quantum numbers ⇒ at most **2 electrons per orbital**, with opposite spins (↑↓).
3. **Hund’s rule**: in orbitals of equal energy, put electrons in separate orbitals with parallel spins before pairing — they repel less and gain *exchange* stabilization.`,
    },
    {
      kind: 'widget', title: 'Fill an atom yourself',
      body: 'Add electrons one by one (or press Play). Each new electron is highlighted and the rule that placed it is shown.',
      widget: { type: 'AufbauFiller', props: { z: 1, maxZ: 36 },
        caption: 'Watch 2p fill at carbon → nitrogen → oxygen: three single arrows first (Hund), then pairing begins (Pauli). Note that 4s fills before 3d.' },
    },
    {
      kind: 'mcq', prompt: 'Which 2p box diagram is correct for ground-state nitrogen (1s² 2s² 2p³)?',
      choices: ['[↑↓] [↑ ] [  ]', '[↑ ] [↑ ] [↑ ]', '[↑ ] [↓ ] [↑ ]', '[↑↓] [↑↓] [↑ ]'],
      answer: 1,
      why: 'Hund’s rule: three equal-energy 2p orbitals each get one electron, all with parallel spin. Pairing early or mixing spin directions gives a higher-energy (excited) arrangement; [↑↓] [↑↓] [↑ ] has 5 electrons, not 3.',
    },
    {
      kind: 'explain', title: 'The filling order',
      body: String.raw`The **Madelung rule**: fill in order of increasing $n + \ell$; for ties, lower $n$ first. That gives

1s 2s 2p 3s 3p **4s 3d** 4p 5s 4d 5p 6s 4f 5d 6p…

**Worked example — iron, Z = 26.** Fill 26 electrons: $1s^2\,2s^2\,2p^6\,3s^2\,3p^6\,4s^2\,3d^6$ (2+2+6+2+6+2+6 = 26).

**Shorthand:** replace the noble-gas core with its symbol: Fe = $[\text{Ar}]\,4s^2\,3d^6$.`,
    },
    {
      kind: 'widget', title: 'The diagonal mnemonic',
      widget: { type: 'SvgDiagram', props: { svg: madelung },
        caption: String.raw`Write the subshells in rows by $n$ and read along the diagonals. 4s ($n+\ell = 4$) comes before 3d ($n+\ell = 5$).` },
    },
    {
      kind: 'order', prompt: 'Put these subshells in the order they fill.',
      steps: ['3p', '4s', '3d', '4p', '5s'],
      why: 'n + ℓ values: 3p = 4, 4s = 4 (tie → lower n first, so 3p then 4s), 3d = 5, 4p = 5 (3d first), 5s = 5 (after 4p since higher n).',
    },
    {
      kind: 'fill', prompt: String.raw`Sulfur ($Z = 16$) is $[\text{Ne}]\,3s^2\,3p^{x}$ with $x$ = ___, and it has ___ unpaired electrons.`,
      bank: ['0', '1', '2', '3', '4', '6'], answer: ['4', '2'],
      why: 'Ne core holds 10, 3s holds 2, leaving 4 for 3p. Hund: three boxes get ↑ ↑ ↑, the 4th electron pairs → ↑↓ ↑ ↑ = 2 unpaired. Answering 4 unpaired forgets that only three p boxes exist.',
    },
    {
      kind: 'explain', title: 'Core vs valence electrons',
      body: String.raw`**Core** electrons fill the inner, noble-gas-like shells; they are tightly held and chemically inert. **Valence** electrons are in the outermost shell (plus unfilled $d$/$f$ for transition metals) — they do the bonding.

Elements in the same **group** (column) share the same valence configuration: Li $[\text{He}]2s^1$, Na $[\text{Ne}]3s^1$, K $[\text{Ar}]4s^1$. That is why they react alike. The table’s blocks show which subshell is being filled.`,
    },
    {
      kind: 'widget', title: 'Blocks of the periodic table',
      widget: { type: 'SvgDiagram', props: { svg: blocks },
        caption: String.raw`The table’s shape *is* the filling order: s block is 2 wide (2 electrons), p block 6, d block 10, f block 14 — exactly $2(2\ell+1)$.` },
    },
    {
      kind: 'numeric', prompt: String.raw`How many unpaired electrons does a ground-state manganese atom have? (Mn: $[\text{Ar}]\,4s^2\,3d^5$.)`,
      answer: 5, unit: 'unpaired e⁻',
      why: 'Five d orbitals, five electrons: Hund puts one in each, all parallel. The 4s² pair is paired. This half-filled d⁵ shell makes Mn²⁺ strongly magnetic.',
    },
    {
      kind: 'explain', title: 'Ions and two famous exceptions',
      body: String.raw`**Transition-metal cations lose their $4s$ electrons first**, even though 4s filled first: once the d shell is occupied, 4s lies higher in energy. So $\text{Fe}^{2+} = [\text{Ar}]\,3d^6$, not $[\text{Ar}]\,4s^2 3d^4$.

**Exceptions:** Cr is $[\text{Ar}]\,4s^1 3d^5$ and Cu is $[\text{Ar}]\,4s^1 3d^{10}$ — often explained as "a half-filled or filled d set is especially stable". That slogan is only a mnemonic (Schwarz 2010 shows the real reason is the subtle balance of 4s/3d orbital energies and electron repulsion, which are very close here). Rules of thumb, not laws: the true configuration is whatever has the lowest energy.`,
    },
    {
      kind: 'mcq', prompt: String.raw`What is the electron configuration of $\text{Fe}^{3+}$?`,
      choices: [String.raw`$[\text{Ar}]\,4s^2\,3d^3$`, String.raw`$[\text{Ar}]\,3d^5$`, String.raw`$[\text{Ar}]\,4s^1\,3d^4$`, String.raw`$[\text{Ar}]\,3d^6$`],
      answer: 1,
      why: 'Fe is [Ar] 4s² 3d⁶. Remove the two 4s electrons first, then one 3d: [Ar] 3d⁵. Taking all three from 3d, leaving [Ar] 4s² 3d³, is the common mistake.',
    },
    {
      kind: 'match', prompt: 'Match each element to its valence configuration.',
      pairs: [
        ['Na', String.raw`$3s^1$`],
        ['Cl', String.raw`$3s^2\,3p^5$`],
        ['Ca', String.raw`$4s^2$`],
        ['Ne', String.raw`$2s^2\,2p^6$`],
      ],
      why: 'Count electrons beyond the previous noble gas: Na is one past Ne, Cl is seven past Ne, Ca is two past Ar, and Ne completes the n = 2 shell.',
    },
    {
      kind: 'truefalse', prompt: 'When iron forms Fe²⁺, the two electrons removed come from the 3d subshell.',
      answer: false,
      why: 'They come from 4s. In the ion, 3d is lower in energy than 4s, so Fe²⁺ is [Ar] 3d⁶. "Last in, first out" does not apply.',
    },
    {
      kind: 'explain', title: 'Key takeaways',
      body: String.raw`- Fill orbitals by **Aufbau** (Madelung $n+\ell$ order), **Pauli** (≤ 2 per orbital, opposite spins) and **Hund** (spread out, parallel spins).
- Order: 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p…; use noble-gas shorthand.
- Valence configuration ⇒ group ⇒ chemical behaviour; blocks = subshell being filled.
- Transition-metal ions lose $ns$ before $(n-1)d$; Cr and Cu are exceptions.
- Next: how configuration explains size and reactivity → [periodic trends](@chem/periodic-trends).`,
    },
  ],
  references: [
    { authors: 'P. Flowers, K. Theopold, R. Langley, W. R. Robinson', title: 'Chemistry 2e', year: 2019, venue: 'OpenStax', detail: 'Ch. 6.4', url: 'https://openstax.org/details/books/chemistry-2e' },
    { authors: 'C. E. Housecroft, A. G. Sharpe', title: 'Inorganic Chemistry', year: 2018, venue: '5th ed., Pearson', detail: 'Ch. 1.9 (the aufbau principle)' },
    { authors: 'W. H. E. Schwarz', title: 'The full story of the electron configurations of the transition elements', year: 2010, venue: 'J. Chem. Educ. 87, 444–448' },
  ],
} satisfies LessonContent;
