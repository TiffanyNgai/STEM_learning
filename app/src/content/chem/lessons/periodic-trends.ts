import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain', title: 'One table, predictable patterns',
      body: String.raw`Sodium is a soft metal that explodes in water; chlorine is a choking green gas. Together they make table salt. Why does Na give up an electron so easily while Cl grabs one?

In 1869 Mendeleev arranged elements so properties repeat, and left gaps. He predicted an unknown "eka-silicon" with density ≈ 5.5 g/cm³; germanium, found in 1886, has 5.32 g/cm³. The patterns are that reliable — and one idea explains most of them: **effective nuclear charge**.`,
    },
    {
      kind: 'explain', title: 'Effective nuclear charge',
      body: String.raw`An outer electron is pulled in by the nucleus (charge $+Z$) but pushed away by the other electrons. Inner electrons sit between it and the nucleus and **shield** it — like a crowd standing between you and a stage.

$$Z_\text{eff} = Z - S$$

where $S$ is the shielding. Inner-shell electrons shield well ($S$ contribution near 1 each); electrons in the *same* shell shield poorly (~0.35 each). So going **across a period**, $Z$ rises by 1 each step but $S$ rises by only ~0.35: $Z_\text{eff}$ climbs.`,
    },
    {
      kind: 'widget', title: 'Slater’s rules: Na vs Cl',
      widget: { type: 'StepReveal', props: {
        steps: [
          String.raw`Rough rules (Slater, 1930), for an $ns$/$np$ electron: each other electron in the same shell adds $0.35$ to $S$; each in shell $n-1$ adds $0.85$; each deeper adds $1.00$.`,
          String.raw`**Na** ($1s^2\,2s^2 2p^6\,3s^1$), the 3s electron: same shell: 0. Shell 2: $8 \times 0.85 = 6.8$. Shell 1: $2 \times 1.00 = 2.0$. $S = 8.8$.`,
          String.raw`$Z_\text{eff}(\text{Na}) = 11 - 8.8 = 2.2$ — a weak hold, so Na loses this electron easily.`,
          String.raw`**Cl** ($\dots 3s^2 3p^5$), a 3p electron: 6 others in shell 3: $6 \times 0.35 = 2.1$. Shell 2: $6.8$. Shell 1: $2.0$. $S = 10.9$.`,
          String.raw`$Z_\text{eff}(\text{Cl}) = 17 - 10.9 = 6.1$ — almost three times stronger. Same shell, much stronger pull: Cl is small and electron-hungry.`,
        ],
        notes: ['', '', 'Accurate Hartree–Fock-based values differ a little, but the trend is the same.', '', ''],
      } },
    },
    {
      kind: 'mcq', prompt: String.raw`Going from left to right across period 3 (Na → Ar), what happens to $Z_\text{eff}$ felt by the valence electrons?`,
      choices: ['It increases', 'It decreases', 'It stays exactly constant', 'It increases then drops to zero at Ar'],
      answer: 0,
      why: 'Each step adds one proton (+1) but only one same-shell electron, which shields just ~0.35. Net Z_eff grows by ~0.65 per step. That rising pull drives almost every across-the-period trend.',
    },
    {
      kind: 'explain', title: 'Atomic radius',
      body: String.raw`- **Across a period → smaller.** Same outermost shell, larger $Z_\text{eff}$, so the cloud is pulled in. C (76 pm) → F (57 pm).
- **Down a group → larger.** Each period adds a new shell further out; this beats the higher $Z$. Li (128 pm) → K (203 pm).

Radii here are **covalent radii** (half the distance between two bonded atoms). **Ions:** cations are smaller than their atoms (an outer shell is often emptied, less repulsion); anions are larger.`,
    },
    {
      kind: 'widget', title: 'Heat map: atomic radius',
      body: 'Darker = larger. Tap elements to compare values; switch properties with the buttons.',
      widget: { type: 'PeriodicTrends', props: { property: 'radius', highlight: ['Li', 'Na', 'K', 'F'] },
        caption: 'Biggest at the bottom-left (K), smallest at the top-right. The d block (Sc–Zn) shrinks only gently: added d electrons shield the 4s electrons fairly well.' },
    },
    {
      kind: 'order', prompt: 'Arrange from smallest to largest atomic radius.',
      steps: ['F', 'O', 'C', 'Si', 'Na'],
      why: 'F, O, C are in period 2 and shrink to the right (F smallest). Si is one shell lower so bigger than C; Na is at the far left of period 3, the largest.',
    },
    {
      kind: 'explain', title: 'Ionization energy',
      body: String.raw`The **first ionization energy** (IE₁) is the energy to remove one electron from a gas-phase atom: $\text{X(g)} \to \text{X}^+\text{(g)} + e^-$. It follows the opposite trend to radius: **up across a period, down a group**.

Two famous dips in period 2:
- **B < Be**: B’s electron is in 2p, higher in energy and better shielded than 2s.
- **O < N**: O’s fourth 2p electron must pair, and pair repulsion makes it easier to remove.

**Successive IEs** jump hugely once you break into a core shell: Mg 738 → 1451 → **7733** kJ/mol.`,
    },
    {
      kind: 'widget', title: 'Heat map: ionization energy',
      widget: { type: 'PeriodicTrends', props: { property: 'ie', highlight: ['Be', 'B', 'N', 'O'] },
        caption: 'Noble gases (He, Ne, Ar, Kr) top each period; alkali metals sit at the bottom. Tap Be/B and N/O to see the dips.' },
    },
    {
      kind: 'mcq', prompt: 'Why is the first ionization energy of oxygen (1314 kJ/mol) lower than that of nitrogen (1402 kJ/mol)?',
      choices: ['O has a smaller nuclear charge', 'O’s 2p⁴ has one paired electron, and the pair’s repulsion makes it easier to remove', 'O’s outer electron is in a 3s orbital', 'N is a noble gas'],
      answer: 1,
      why: 'N (2p³) has three unpaired electrons — a stable half-filled set. O must put its 4th 2p electron into an occupied orbital, where electron–electron repulsion raises its energy. O actually has the larger Z (8 vs 7).',
    },
    {
      kind: 'numeric', prompt: 'An element in period 3 has successive ionization energies 578, 1817, 2745, 11 577 kJ/mol. How many valence electrons does it have?',
      answer: 3, unit: 'electrons',
      why: 'The huge jump comes after the third electron (2745 → 11 577): the fourth must come from the core n = 2 shell. Three valence electrons in period 3 = aluminium.',
    },
    {
      kind: 'explain', title: 'Electronegativity',
      body: String.raw`**Electronegativity** ($\chi$) measures how strongly an atom in a bond pulls shared electrons toward itself. On Pauling’s scale fluorine is highest (3.98), oxygen 3.44, nitrogen 3.04, carbon 2.55, hydrogen 2.20, caesium ~0.79. Trend: **up and to the right** (noble gases usually not assigned).

The difference $\Delta\chi$ sets bond polarity: roughly, $\Delta\chi < 0.5$ nonpolar covalent, $0.5$–$1.8$ polar covalent, larger mostly ionic. This is why O–H and N–H groups in drugs form strong hydrogen bonds (see [intermolecular forces](@chem/intermolecular-forces)).`,
      widget: { type: 'PeriodicTrends', props: { property: 'en', properties: ['en'], showArrows: true } },
    },
    {
      kind: 'multi', prompt: String.raw`Which bonds are polar ($\Delta\chi \ge 0.5$)? (χ: H 2.20, C 2.55, N 3.04, O 3.44, F 3.98)`,
      choices: ['C–H', 'O–H', 'C–F', 'C–C', 'N–H'],
      answers: [1, 2, 4],
      why: 'Δχ: C–H 0.35 (essentially nonpolar), O–H 1.24, C–F 1.43, C–C 0, N–H 0.84. That C–H bonds are nearly nonpolar is why hydrocarbons are "greasy" and do not mix with water.',
    },
    {
      kind: 'match', prompt: 'Match each observation to its main cause.',
      pairs: [
        ['Radius shrinks across a period', 'Z_eff rises, same outer shell'],
        ['Radius grows down a group', 'A new, more distant shell is added'],
        ['Big jump in successive IE', 'Removing a core electron'],
        ['F is the most electronegative', 'Small atom with high Z_eff'],
      ],
      why: 'Nearly every trend follows from two things: how strongly the nucleus pulls (Z_eff) and how far away the outer electrons are (shell n).',
    },
    {
      kind: 'truefalse', prompt: 'A Na⁺ ion is smaller than a neutral Na atom.',
      answer: true,
      why: 'Na⁺ has lost its only n = 3 electron, so its outermost shell is n = 2 — dramatically smaller (ionic radius ≈ 102 pm vs covalent ≈ 166 pm).',
    },
    {
      kind: 'explain', title: 'Key takeaways',
      body: String.raw`- $Z_\text{eff} = Z - S$ rises across a period; a new shell is added down a group.
- Radius: smaller → right, bigger ↓. Ionization energy and electronegativity: the opposite.
- Dips (B < Be, O < N) come from subshell energies and electron pairing.
- Electronegativity differences decide bond polarity — next: [covalent bonding](@chem/covalent-bonding).`,
    },
  ],
  references: [
    { authors: 'P. Flowers, K. Theopold, R. Langley, W. R. Robinson', title: 'Chemistry 2e', year: 2019, venue: 'OpenStax', detail: 'Ch. 6.5', url: 'https://openstax.org/details/books/chemistry-2e' },
    { authors: 'J. C. Slater', title: 'Atomic shielding constants', year: 1930, venue: 'Physical Review 36, 57–64' },
    { authors: 'B. Cordero, V. Gómez, A. E. Platero-Prats, M. Revés, J. Echeverría, E. Cremades, F. Barragán, S. Alvarez', title: 'Covalent radii revisited', year: 2008, venue: 'Dalton Transactions, 2832–2838' },
    { authors: 'C. E. Housecroft, A. G. Sharpe', title: 'Inorganic Chemistry', year: 2018, venue: '5th ed., Pearson', detail: 'Ch. 1.10, 2.5' },
  ],
} satisfies LessonContent;
