import type { LessonContent } from '../../types';

const sto3g = '0.444635*(2*0.109818/PI)^0.75*exp(-0.109818*x^2) + 0.535328*(2*0.405771/PI)^0.75*exp(-0.405771*x^2) + 0.154329*(2*2.22766/PI)^0.75*exp(-2.22766*x^2)';

export default {
  cards: [
    {
      kind: 'explain', title: 'Building orbitals from bricks',
      body: String.raw`In [Hartree–Fock](@chem/hartree-fock) we wrote each molecular orbital as a sum of known functions: $\psi_i = \sum_\mu C_{\mu i}\phi_\mu$. The set $\{\phi_\mu\}$ is the **basis set**.

Think of LEGO: with a few big bricks you get a blocky model; with many bricks of different sizes and shapes you can match any curve. With an infinite, complete basis you would reach the **HF limit** — the best possible HF answer. In practice, the basis is the biggest single choice you make in a calculation.`,
    },
    {
      kind: 'explain', title: 'Slater vs Gaussian functions',
      body: String.raw`Hydrogen’s exact orbitals decay as $e^{-\zeta r}$: **Slater-type orbitals** (STOs). They have the right sharp **cusp** at the nucleus and the right long tail — but the integrals between STOs on different atoms are very hard to compute.

**Gaussian-type orbitals** (GTOs), $e^{-\alpha r^2}$, have no cusp and decay too fast. Their superpower (Boys, 1950): the **product of two Gaussians on different centres is another Gaussian**, so every integral has a fast closed form. The compromise: fix a combination of several Gaussians (a **contraction**) that mimics one STO. STO-3G uses 3 Gaussians per STO.`,
    },
    {
      kind: 'widget', title: 'Faking a Slater function with Gaussians',
      body: 'Green: the true 1s Slater function. Blue: STO-3G (3 fixed Gaussians). Orange: one Gaussian — tune its exponent α.',
      widget: { type: 'FunctionPlot', props: {
        fns: ['exp(-x)/sqrt(PI)', sto3g, '(2*al/PI)^0.75*exp(-al*x^2)'], x: [0, 4], y: [0, 0.7],
        params: [{ name: 'al', min: 0.05, max: 2, value: 0.27, label: 'α (one Gaussian)' }],
        labels: ['STO (exact 1s shape)', 'STO-3G', '1 Gaussian'], xLabel: 'r / a₀', yLabel: 'φ(r)' },
      caption: 'No single Gaussian matches both the peak and the tail. Three do much better, but still miss the cusp at r = 0 — a small energy error that matters little for chemistry, since bonding happens in the valence region.' },
    },
    {
      kind: 'mcq', prompt: 'Why do almost all molecular codes use Gaussian functions even though Slater functions have the correct shape?',
      choices: ['Gaussians have the correct nuclear cusp', 'The product of two Gaussians is a Gaussian, making integrals fast', 'Gaussians decay more slowly, describing anions better', 'Slater functions cannot describe p orbitals'],
      answer: 1,
      why: 'The Gaussian product theorem turns the millions of 2-, 3- and 4-centre integrals into closed formulas. Gaussians have *no* cusp and decay *too fast* — those are their weaknesses, fixed by using more of them.',
    },
    {
      kind: 'explain', title: 'The basis-set hierarchy',
      body: String.raw`- **Minimal** (STO-3G): one function per occupied atomic orbital. Carbon: 1s, 2s, 2p$_{x,y,z}$ = 5 functions. Too rigid.
- **Split-valence / double-zeta** (6-31G, cc-pVDZ): two functions of different size per valence orbital, so orbitals can expand or contract as bonding requires. In **6-31G**: each core orbital is 1 contraction of 6 Gaussians; each valence orbital is split into an inner part (3 Gaussians) and an outer part (1 Gaussian).
- **Triple-, quadruple-zeta** (cc-pVTZ, cc-pVQZ): three, four sizes per valence orbital.

The Dunning **correlation-consistent** sets (cc-pV$X$Z, $X$ = D, T, Q, 5…) are built to converge systematically.`,
    },
    {
      kind: 'explain', title: 'Polarization and diffuse functions',
      body: String.raw`**Polarization functions** have higher angular momentum than the occupied orbitals: d on carbon, p on hydrogen. Mixing a little $p$ into an $s$ shifts the electron cloud off-centre — needed whenever a neighbouring atom pulls the density. Notation: 6-31G(d) = 6-31G*, 6-31G(d,p) = 6-31G**; the "p" in cc-**p**VDZ.

**Diffuse functions** are very wide, small-exponent Gaussians (+ in 6-31+G, **aug-** in aug-cc-pVDZ). They describe loosely held electrons: **anions**, hydrogen bonds, excited states, and weak intermolecular interactions.`,
      widget: { type: 'FunctionPlot', props: {
        fns: ['exp(-(x^2))', 'exp(-(x^2))*(1+lam*x)'], x: [-3, 3], y: [-0.3, 1.4],
        params: [{ name: 'lam', min: -1.5, max: 1.5, value: 0.8, label: 'p mixing' }],
        labels: ['s alone', 's + λ·p'], xLabel: 'x', yLabel: 'φ' },
        caption: 'A 1D slice: adding a p-type function ($x e^{-x^2}$) to an s function shifts the density toward one side — the cloud is **polarized**.' },
    },
    {
      kind: 'widget', title: 'More functions, lower energy',
      body: 'Helium again, now with 1, 2, 3, 4 or 6 Gaussian s functions. Tap each basis and note the converged energy.',
      widget: { type: 'SCFLoop', props: { nBasis: 1, mixing: 1, showMixing: false },
        caption: 'Converged energies: 1G −2.301, 2G −2.747, 3G −2.831, 4G −2.853, 6G −2.861 Eₕ, approaching the HF limit −2.862 from above. The improvements shrink: that is **basis-set convergence**. No basis, however large, reaches the exact −2.904 — that needs correlation.' },
    },
    {
      kind: 'numeric', prompt: String.raw`With 4 Gaussians, He gives $E = -2.8525\,E_h$; the HF limit is $-2.8617\,E_h$. How large is the basis-set error in **kcal/mol**? ($1\,E_h = 627.5$ kcal/mol.)`,
      answer: 5.8, tolerance: 0.3, unit: 'kcal/mol',
      why: '−2.8525 − (−2.8617) = 0.0092 Eₕ × 627.5 ≈ 5.8 kcal/mol — far above "chemical accuracy" (~1 kcal/mol). Much of such error cancels when comparing similar structures, but absolute energies need big bases.',
    },
    {
      kind: 'truefalse', prompt: 'Adding extra functions to a basis set (keeping all the old ones) can raise the Hartree–Fock energy.',
      answer: false,
      why: 'By the variational principle, a bigger basis containing the old one can only lower the energy or leave it unchanged: the old solution is still available. That is why the SCFLoop energies decrease monotonically.',
    },
    {
      kind: 'match', prompt: 'Match each basis set to its description.',
      pairs: [
        ['STO-3G', 'Minimal: one contracted function per occupied AO'],
        ['6-31G(d)', 'Split valence + d polarization on heavy atoms'],
        ['cc-pVTZ', 'Correlation-consistent triple zeta'],
        ['aug-cc-pVDZ', 'Double zeta with added diffuse functions'],
      ],
      why: 'Read the names: number of zetas (D/T/Q) or the split pattern (6-31), "(d)"/"*" or "p" for polarization, "+" or "aug-" for diffuse.',
    },
    {
      kind: 'fill', prompt: 'To model the hydroxide anion OH⁻ you should add ___ functions; to let the H atoms in water polarize, add ___ functions.',
      bank: ['diffuse', 'polarization', 'core', 'minimal'], answer: ['diffuse', 'polarization'],
      why: 'The extra electron of an anion is loosely bound and spread out — diffuse functions capture this. p functions on H (the second "*" or "p" in 6-31G** or cc-pVDZ) let its density shift toward O.',
    },
    {
      kind: 'explain', title: 'Cost and extrapolation',
      body: String.raw`With $K$ basis functions there are ~$K^4/8$ unique two-electron integrals, so formal HF cost grows like $K^4$ (modern codes do better). Correlated methods grow faster: MP2 ~$K^5$, CCSD(T) ~$K^7$. Doubling the basis can make CCSD(T) ~100× slower.

Because cc-pV$X$Z sets converge smoothly, you can **extrapolate** to the complete-basis-set (CBS) limit, e.g. for correlation energy $E_X \approx E_\text{CBS} + A\,X^{-3}$, using two values of $X$. Watch out for **basis-set superposition error** (BSSE) in binding energies: each partner "borrows" the other’s functions, overstating binding.`,
    },
    {
      kind: 'order', prompt: 'Order from smallest (cheapest) to largest basis set.',
      steps: ['STO-3G', '6-31G', '6-31G(d)', 'cc-pVTZ', 'aug-cc-pVQZ'],
      why: 'Minimal → split valence → split valence with polarization → triple zeta with polarization → quadruple zeta with polarization and diffuse functions.',
    },
    {
      kind: 'explain', title: 'Key takeaways',
      body: String.raw`- The **basis set** is the set of functions orbitals are built from; complete basis ⇒ HF (or CBS) limit.
- Gaussians (fast integrals) contracted to mimic Slater functions.
- Hierarchy: minimal → double-/triple-zeta; add **polarization** (shape flexibility) and **diffuse** (anions, weak interactions).
- Bigger basis ⇒ lower energy (variational) but steeply higher cost; extrapolate with cc-pV$X$Z.
- Next: recovering correlation — [post-HF methods](@chem/post-hartree-fock) and [DFT](@chem/dft-intro).`,
    },
  ],
  references: [
    { authors: 'F. Jensen', title: 'Introduction to Computational Chemistry', year: 2017, venue: '3rd ed., Wiley', detail: 'Ch. 5 (basis sets)' },
    { authors: 'S. F. Boys', title: 'Electronic wave functions I. A general method of calculation for the stationary states of any molecular system', year: 1950, venue: 'Proc. R. Soc. Lond. A 200, 542–554' },
    { authors: 'W. J. Hehre, R. F. Stewart, J. A. Pople', title: 'Self-consistent molecular-orbital methods. I. Use of Gaussian expansions of Slater-type atomic orbitals', year: 1969, venue: 'J. Chem. Phys. 51, 2657–2664' },
    { authors: 'T. H. Dunning Jr.', title: 'Gaussian basis sets for use in correlated molecular calculations. I. The atoms boron through neon and hydrogen', year: 1989, venue: 'J. Chem. Phys. 90, 1007–1023' },
    { authors: 'A. Szabo, N. S. Ostlund', title: 'Modern Quantum Chemistry', year: 1996, venue: 'Dover', detail: 'Ch. 3.6' },
  ],
} satisfies LessonContent;
