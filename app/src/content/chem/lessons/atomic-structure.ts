import type { LessonContent } from '../../types';

const rutherford = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="70" width="34" height="50" rx="4" fill="var(--surface)" stroke="var(--fg)"/>
  <text x="23" y="134" font-size="9" text-anchor="middle" fill="var(--fg)">α source</text>
  <rect x="196" y="20" width="5" height="150" fill="var(--c3)" opacity="0.8"/>
  <text x="198" y="14" font-size="9" text-anchor="middle" fill="var(--c3)">thin gold foil</text>
  <circle r="2.8" fill="var(--c2)"><animateMotion dur="2.4s" repeatCount="indefinite" path="M40,80 L310,80"/></circle>
  <circle r="2.8" fill="var(--c2)"><animateMotion dur="2.4s" begin="0.4s" repeatCount="indefinite" path="M40,90 L310,90"/></circle>
  <circle r="2.8" fill="var(--c2)"><animateMotion dur="2.4s" begin="0.8s" repeatCount="indefinite" path="M40,110 L310,110"/></circle>
  <circle r="2.8" fill="var(--c2)"><animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" path="M40,120 L310,120"/></circle>
  <circle r="2.8" fill="var(--c4)"><animateMotion dur="2.4s" begin="0.6s" repeatCount="indefinite" path="M40,97 L198,97 L310,60"/></circle>
  <circle r="2.8" fill="var(--c5)"><animateMotion dur="2.4s" begin="1.6s" repeatCount="indefinite" path="M40,100 L194,100 L60,40"/></circle>
  <text x="250" y="96" font-size="9" fill="var(--c2)">most pass straight</text>
  <text x="250" y="56" font-size="9" fill="var(--c4)">a few deflect</text>
  <text x="70" y="34" font-size="9" fill="var(--c5)">~1 in 8000 bounces back!</text>
  <circle cx="160" cy="160" r="22" fill="none" stroke="var(--muted)" stroke-dasharray="2 2"/>
  <circle cx="160" cy="160" r="1.5" fill="var(--c5)"/>
  <text x="188" y="178" font-size="9" fill="var(--muted)">atom: almost empty, tiny dense nucleus</text>
</svg>`;

const chlorineSpectrum = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
  <line x1="40" y1="160" x2="300" y2="160" stroke="var(--fg)"/>
  <line x1="40" y1="20" x2="40" y2="160" stroke="var(--fg)"/>
  <text x="300" y="176" font-size="9" text-anchor="end" fill="var(--fg)">mass (u)</text>
  <text x="44" y="18" font-size="9" fill="var(--fg)">abundance</text>
  <rect x="90" y="160" width="14" height="0" fill="var(--c2)"><animate attributeName="height" from="0" to="121" dur="1.2s" fill="freeze"/><animate attributeName="y" from="160" to="39" dur="1.2s" fill="freeze"/></rect>
  <rect x="226" y="160" width="14" height="0" fill="var(--c1)"><animate attributeName="height" from="0" to="39" dur="1.2s" fill="freeze"/><animate attributeName="y" from="160" to="121" dur="1.2s" fill="freeze"/></rect>
  <text x="97" y="174" font-size="9" text-anchor="middle" fill="var(--fg)">34.97</text>
  <text x="233" y="174" font-size="9" text-anchor="middle" fill="var(--fg)">36.97</text>
  <text x="97" y="34" font-size="10" text-anchor="middle" fill="var(--c2)">³⁵Cl 75.8%</text>
  <text x="233" y="116" font-size="10" text-anchor="middle" fill="var(--c1)">³⁷Cl 24.2%</text>
  <line x1="127" y1="30" x2="127" y2="160" stroke="var(--c3)" stroke-dasharray="4 3" stroke-width="1.5"/>
  <text x="131" y="64" font-size="10" fill="var(--c3)">average = 35.45 u</text>
  <text x="131" y="76" font-size="9" fill="var(--c3)">(the periodic-table value)</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain', title: 'Everything is made of atoms',
      body: `Your phone, your coffee and you are built from just ~90 naturally occurring kinds of **atom** (118 known in total). An atom is about $10^{-10}$ m across — a million of them side by side would span the width of a hair.

Chemistry is the science of how atoms combine and rearrange. To understand *why* they combine, we first need to look inside one.`,
    },
    {
      kind: 'widget', title: 'Rutherford’s surprise (1911)',
      body: 'Positively charged α particles were fired at gold foil. Watch where they go.',
      widget: { type: 'SvgDiagram', props: { svg: rutherford },
        caption: 'Rutherford concluded that nearly all of an atom’s mass and all its positive charge sit in a **nucleus** ~100 000 times smaller than the atom. The rest is mostly empty space occupied by light electrons.' },
    },
    {
      kind: 'mcq', prompt: 'Why did a few α particles bounce almost straight back off the gold foil?',
      choices: ['They hit electrons, which are heavy', 'They came very close to a tiny, dense, positive nucleus and were repelled', 'The foil was too thick', 'Gold atoms are packed with no gaps between them'],
      answer: 1,
      why: 'Only a concentrated positive charge with most of the atom’s mass can repel an α particle that hard. Electrons are ~7000× lighter than an α particle, so they cannot turn it around; and if atoms were "solid", most particles would not pass straight through.',
    },
    {
      kind: 'explain', title: 'Three particles',
      body: String.raw`- **Proton** ($p^+$): charge $+1$, mass $\approx 1.007\,\text{u}$, in the nucleus.
- **Neutron** ($n$): charge $0$, mass $\approx 1.009\,\text{u}$, in the nucleus.
- **Electron** ($e^-$): charge $-1$, mass $\approx 0.00055\,\text{u}$ ($\tfrac{1}{1836}$ of a proton), spread around the nucleus.

Charges are in units of $e = 1.602\times10^{-19}$ C. The **atomic mass unit** u is defined as $\tfrac{1}{12}$ the mass of a carbon-12 atom ($1\,\text{u} = 1.661\times10^{-27}$ kg).

> Electrons are almost massless but take up almost all the volume — and they do all the chemistry.`,
    },
    {
      kind: 'explain', title: 'Atomic number and mass number',
      body: String.raw`The **atomic number** $Z$ = number of protons. It *defines* the element: every atom with $Z = 6$ is carbon.

The **mass number** $A$ = protons + neutrons, so neutrons $N = A - Z$. We write $^{A}_{Z}\text{X}$.

**Worked example.** $^{37}_{17}\text{Cl}$: $Z = 17$ protons, $N = 37 - 17 = 20$ neutrons, and — being neutral — 17 electrons.`,
    },
    {
      kind: 'fill', prompt: String.raw`Carbon-14 ($^{14}_{6}\text{C}$), used in radiocarbon dating, has ___ protons and ___ neutrons.`,
      bank: ['6', '8', '14', '20', '7'], answer: ['6', '8'],
      why: 'Z = 6 gives 6 protons; neutrons = A − Z = 14 − 6 = 8. A common slip is to give 14 neutrons — but 14 counts protons and neutrons together.',
    },
    {
      kind: 'explain', title: 'Ions: gaining or losing electrons',
      body: String.raw`Atoms can gain or lose **electrons** (never protons in chemistry — that would change the element). The result is an **ion**:

$$\text{charge} = (\#\text{protons}) - (\#\text{electrons})$$

- **Cation** (positive): lost electrons. $\text{Fe}^{3+}$ has 26 protons and $26 - 3 = 23$ electrons.
- **Anion** (negative): gained electrons. $\text{O}^{2-}$ has 8 protons and 10 electrons.`,
    },
    {
      kind: 'numeric', prompt: String.raw`How many electrons does the sulfide ion $\text{S}^{2-}$ have? (Sulfur: $Z = 16$.)`,
      answer: 18, unit: 'electrons',
      why: 'A 2− charge means two more electrons than protons: 16 + 2 = 18. Subtracting (giving 14) is the classic sign error — negative ions have *extra* electrons.',
    },
    {
      kind: 'explain', title: 'Isotopes and average atomic mass',
      body: String.raw`**Isotopes** are atoms of the same element (same $Z$) with different numbers of neutrons. They behave almost identically in chemistry, because chemistry is set by electrons.

The atomic mass on the periodic table is an **abundance-weighted average**:

$$\bar m = \sum_i f_i\, m_i$$

where $f_i$ is the fractional abundance of isotope $i$. Chlorine: $0.758(34.969) + 0.242(36.966) = 35.45\,\text{u}$ — no single Cl atom weighs 35.45 u!`,
    },
    {
      kind: 'widget', title: 'Seeing isotopes',
      body: 'A mass spectrometer sorts atoms by mass. Chlorine shows two peaks in a 3 : 1 ratio.',
      widget: { type: 'SvgDiagram', props: { svg: chlorineSpectrum },
        caption: 'This 3 : 1 pattern is how chemists spot a chlorine atom in a drug molecule’s spectrum — see [mass spectrometry](@chem/mass-spectrometry).' },
    },
    {
      kind: 'numeric', prompt: String.raw`Boron is 19.9% $^{10}\text{B}$ (10.013 u) and 80.1% $^{11}\text{B}$ (11.009 u). What is boron’s average atomic mass?`,
      answer: 10.81, tolerance: 0.02, unit: 'u',
      why: '0.199 × 10.013 + 0.801 × 11.009 = 1.993 + 8.818 = 10.81 u. It lies closer to 11 because ¹¹B is far more abundant. Averaging the two masses equally (10.51) ignores abundance.',
    },
    {
      kind: 'match', prompt: 'Match each quantity to what it tells you.',
      pairs: [
        ['Atomic number Z', 'Which element it is'],
        ['Mass number A', 'Protons + neutrons'],
        ['Charge of an ion', 'Protons − electrons'],
        ['Isotope', 'Same Z, different neutron count'],
      ],
      why: 'Z is the identity card of an element; A only counts nucleons; ion charge compares protons with electrons; isotopes vary only in neutrons.',
    },
    {
      kind: 'truefalse', prompt: 'Two atoms with the same mass number must be the same element.',
      answer: false,
      why: 'Only the atomic number fixes the element. ¹⁴C (6 p, 8 n) and ¹⁴N (7 p, 7 n) share A = 14 but are different elements.',
    },
    {
      kind: 'multi', prompt: 'Which statements are true?',
      choices: ['Nearly all of an atom’s mass is in its nucleus', 'Isotopes of an element have different chemistry because their masses differ greatly', 'A neutral atom has equal numbers of protons and electrons', 'Electrons are about 1836× lighter than protons'],
      answers: [0, 2, 3],
      why: 'Isotopes have nearly identical chemistry: reactions are driven by electrons, which are the same. (Small "isotope effects" on rates exist — especially for H vs D — but the chemistry is the same.)',
    },
    {
      kind: 'explain', title: 'Key takeaways',
      body: String.raw`- An atom = tiny dense nucleus (protons + neutrons) surrounded by a much larger cloud of electrons.
- $Z$ (protons) defines the element; $A = Z + N$; isotopes differ in $N$.
- Ions form by gaining/losing **electrons**: charge = protons − electrons.
- Periodic-table masses are abundance-weighted averages of isotopes.
- Next: *where* exactly are the electrons? → [atomic orbitals](@chem/atomic-orbitals).`,
    },
  ],
  references: [
    { authors: 'P. Flowers, K. Theopold, R. Langley, W. R. Robinson', title: 'Chemistry 2e', year: 2019, venue: 'OpenStax', detail: 'Ch. 2.2–2.3', url: 'https://openstax.org/details/books/chemistry-2e' },
    { authors: 'E. Rutherford', title: 'The scattering of α and β particles by matter and the structure of the atom', year: 1911, venue: 'Philosophical Magazine 21, 669–688' },
    { authors: 'C. E. Housecroft, A. G. Sharpe', title: 'Inorganic Chemistry', year: 2018, venue: '5th ed., Pearson', detail: 'Ch. 1.2–1.3' },
  ],
} satisfies LessonContent;
