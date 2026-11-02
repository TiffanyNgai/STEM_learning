import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain', title: 'The mean-field idea',
      body: String.raw`Walking through a busy train station, you do not track every person’s exact path. You respond to the *average* crowd: dense here, empty there.

**Hartree–Fock** (HF) does the same for electrons: each electron moves in the **average** electric field of all the others, instead of reacting to their instantaneous positions. That turns one impossible $N$-electron problem into $N$ coupled one-electron problems. It is the foundation of almost all quantum chemistry.`,
    },
    {
      kind: 'recall', title: 'Many-electron wavefunctions',
      points: [
        'Electrons are identical: swapping two must leave |Ψ|² unchanged.',
        String.raw`For fermions, $\Psi$ must be **antisymmetric**: swapping two electrons flips its sign.`,
        'Antisymmetry implies the Pauli principle: no two electrons in the same spin-orbital.',
        'A Slater determinant is the simplest antisymmetric N-electron wavefunction.',
      ],
      link: 'quantum/many-electron-systems',
    },
    {
      kind: 'explain', title: 'The Slater determinant',
      body: String.raw`Give each electron a **spin-orbital** $\chi_k(\mathbf x)$ (a spatial orbital times ↑ or ↓). For two electrons:

$$\Psi(\mathbf x_1,\mathbf x_2) = \frac{1}{\sqrt 2}\begin{vmatrix}\chi_a(\mathbf x_1) & \chi_b(\mathbf x_1)\\ \chi_a(\mathbf x_2) & \chi_b(\mathbf x_2)\end{vmatrix} = \tfrac{1}{\sqrt2}\left[\chi_a(1)\chi_b(2) - \chi_b(1)\chi_a(2)\right]$$

Swap electrons 1 and 2 → two rows swap → sign flips ✓. Put both in the same spin-orbital ($a = b$) → two equal columns → $\Psi = 0$: Pauli exclusion comes for free.`,
    },
    {
      kind: 'explain', title: 'Best single determinant → Fock equations',
      body: String.raw`The **variational principle**: for any trial wavefunction, $E_\text{trial} = \langle\Psi|\hat H|\Psi\rangle \ge E_\text{exact}$. So the best guess is the one with the lowest energy.

HF finds the single determinant with the lowest energy. Minimizing gives the **Hartree–Fock equations**:

$$\hat f\,\chi_i = \varepsilon_i\,\chi_i,\qquad \hat f = \hat h + \sum_j\left(\hat J_j - \hat K_j\right)$$

$\hat h$: kinetic energy + nuclear attraction. $\hat J_j$: classical repulsion from electron $j$’s average charge cloud. $\hat K_j$: **exchange**, a purely quantum term from antisymmetry that lowers the energy of same-spin electron pairs.`,
    },
    {
      kind: 'mcq', prompt: 'Why must the Hartree–Fock equations be solved iteratively?',
      choices: ['Computers cannot solve eigenvalue problems directly', 'The Fock operator depends on the orbitals, which are what we are solving for', 'Because the variational principle requires random sampling', 'To include electron correlation exactly'],
      answer: 1,
      why: 'f̂ contains J and K, built from the occupied orbitals. Guess orbitals → build f̂ → solve for new orbitals → rebuild f̂ … until input and output agree: a self-consistent field (SCF). Iteration does not add correlation.',
    },
    {
      kind: 'explain', title: 'Roothaan–Hall: turning it into matrices',
      body: String.raw`Expand each molecular orbital in $K$ known **basis functions** $\phi_\mu$ (usually atom-centred Gaussians — see [basis sets](@chem/basis-sets)): $\psi_i = \sum_\mu C_{\mu i}\,\phi_\mu$. The HF equations become a matrix problem:

$$\mathbf F\mathbf C = \mathbf S\mathbf C\boldsymbol\varepsilon$$

- $\mathbf S$: overlap matrix $S_{\mu\nu} = \int\phi_\mu\phi_\nu$.
- $\mathbf C$: orbital coefficients; $\boldsymbol\varepsilon$: orbital energies.
- $\mathbf F$: Fock matrix, which depends on the **density matrix** $P_{\mu\nu} = 2\sum_{i}^{\text{occ}} C_{\mu i}C_{\nu i}$.

A generalized eigenvalue problem — linear algebra computers do superbly.`,
    },
    {
      kind: 'widget', title: 'The SCF algorithm',
      widget: { type: 'StepReveal', props: {
        steps: [
          String.raw`**Set up.** Choose nuclear positions and a basis. Compute $\mathbf S$, the one-electron matrix $\mathbf H$ and the two-electron integrals $(\mu\nu|\lambda\sigma)$.`,
          String.raw`**Guess** a density matrix $\mathbf P$ (e.g. from $\mathbf H$ alone, ignoring repulsion).`,
          String.raw`**Build** $F_{\mu\nu} = H_{\mu\nu} + \sum_{\lambda\sigma}P_{\lambda\sigma}\left[(\mu\nu|\lambda\sigma) - \tfrac12(\mu\lambda|\nu\sigma)\right]$.`,
          String.raw`**Solve** $\mathbf F\mathbf C = \mathbf S\mathbf C\boldsymbol\varepsilon$; fill the lowest orbitals with electron pairs.`,
          String.raw`**Update** $\mathbf P$ from the occupied columns of $\mathbf C$; compute $E = \tfrac12\sum P_{\mu\nu}(H_{\mu\nu}+F_{\mu\nu}) + V_{nn}$.`,
          String.raw`**Converged?** If $E$ and $\mathbf P$ stopped changing (e.g. $|\Delta E| < 10^{-8}\,E_h$), stop. Otherwise (often mixing old and new $\mathbf P$ to avoid oscillation) go back to *Build*.`,
        ],
      } },
    },
    {
      kind: 'widget', title: 'Watch a real SCF converge',
      body: 'This runs a genuine Hartree–Fock calculation on the helium atom in the browser. Lower the mixing λ to see slower, steadier convergence.',
      widget: { type: 'SCFLoop', props: { nBasis: 3, mixing: 0.5, showBasisPicker: false },
        caption: 'The energy falls toward a self-consistent value. Even when converged it stays above the purple **HF limit** (basis too small — next lesson) and well above the red **exact** energy: the gap is **correlation energy**.' },
    },
    {
      kind: 'order', prompt: 'Put the SCF steps in order.',
      steps: ['Compute integrals S, H, (μν|λσ)', 'Guess a density matrix P', 'Build the Fock matrix F(P)', 'Solve FC = SCε', 'Form a new P and test convergence'],
      why: 'Integrals depend only on geometry and basis, so they come first. Then the loop: guess → build F → diagonalize → new density → check. Building F before having any P is impossible, which is why a guess is required.',
    },
    {
      kind: 'numeric', prompt: String.raw`For helium, the HF-limit energy is $-2.8617\,E_h$ and the exact non-relativistic energy is $-2.9037\,E_h$. What is the **correlation energy** $E_\text{exact} - E_\text{HF}$, in $E_h$?`,
      answer: -0.042, tolerance: 0.001, unit: 'Eₕ',
      why: '−2.9037 − (−2.8617) = −0.0420 Eₕ (about −26 kcal/mol). It is negative because letting electrons avoid each other instantaneously lowers the energy. Answering +0.042 flips the convention: correlation energy is defined as exact minus HF.',
    },
    {
      kind: 'explain', title: 'What HF gets right — and wrong',
      body: String.raw`HF typically captures ~99% of the total energy and gives good geometries for many ordinary molecules. But the missing ~1% — the **correlation energy** — is about as large as chemical energy differences (1 kcal/mol ≈ 0.0016 $E_h$).

Known failures:
- **No dispersion**: London forces between nonpolar groups are pure correlation, so HF misses π-stacking and much of drug–protein contact.
- **Bond breaking**: restricted HF dissociates H₂ into a wrong 50% ionic mixture.
- Barrier heights are typically too high.

Bonus: **Koopmans’ theorem** — $-\varepsilon_\text{HOMO}$ approximates the ionization energy.`,
    },
    {
      kind: 'numeric', prompt: String.raw`The HF 1s orbital energy of helium is $\varepsilon = -0.918\,E_h$. Using Koopmans’ theorem, estimate the ionization energy in eV ($1\,E_h = 27.211$ eV).`,
      answer: 24.98, tolerance: 0.1, unit: 'eV',
      why: 'IE ≈ −ε = 0.918 × 27.211 ≈ 24.98 eV. The measured value is 24.59 eV — close, because two neglected effects (orbital relaxation and correlation) partly cancel.',
    },
    {
      kind: 'truefalse', prompt: 'The Hartree–Fock energy is a lower bound to the exact ground-state energy.',
      answer: false,
      why: 'HF is variational: any single determinant gives an energy at or *above* the exact one. HF is an upper bound; correlation always lowers the energy further.',
    },
    {
      kind: 'multi', prompt: 'Which effects are included in Hartree–Fock theory?',
      choices: ['Average Coulomb repulsion between electrons', 'Exchange (from antisymmetry)', 'Instantaneous dodging of electrons (correlation)', 'London dispersion forces', 'Pauli exclusion'],
      answers: [0, 1, 4],
      why: 'J (average repulsion), K (exchange) and Pauli exclusion are built into the determinant. Instantaneous correlation and its long-range consequence, dispersion, are what HF leaves out — recovered by [post-HF methods](@chem/post-hartree-fock) or DFT with corrections.',
    },
    {
      kind: 'match', prompt: 'Match each matrix to its meaning.',
      pairs: [
        [String.raw`$\mathbf F$`, 'Fock matrix: effective one-electron energy'],
        [String.raw`$\mathbf S$`, 'Overlap between basis functions'],
        [String.raw`$\mathbf C$`, 'Orbital coefficients in the basis'],
        [String.raw`$\mathbf P$`, 'Density matrix (where the electrons are)'],
      ],
      why: 'FC = SCε uses all four: F depends on P, P is built from the occupied columns of C, and S appears because atom-centred basis functions are not orthogonal.',
    },
    {
      kind: 'explain', title: 'Key takeaways',
      body: String.raw`- HF = best **single Slater determinant**; each electron feels the others’ average field.
- Fock operator $\hat f = \hat h + \sum(\hat J - \hat K)$ depends on its own solutions ⇒ **SCF** iterations.
- In a basis: $\mathbf F\mathbf C = \mathbf S\mathbf C\boldsymbol\varepsilon$ (Roothaan–Hall).
- HF is variational (upper bound) and misses **correlation**: dispersion, bond breaking, accurate barriers.`,
    },
  ],
  references: [
    { authors: 'A. Szabo, N. S. Ostlund', title: 'Modern Quantum Chemistry: Introduction to Advanced Electronic Structure Theory', year: 1996, venue: 'Dover', detail: 'Ch. 2–3' },
    { authors: 'C. C. J. Roothaan', title: 'New developments in molecular orbital theory', year: 1951, venue: 'Reviews of Modern Physics 23, 69–89' },
    { authors: 'F. Jensen', title: 'Introduction to Computational Chemistry', year: 2017, venue: '3rd ed., Wiley', detail: 'Ch. 3' },
    { authors: 'T. Koopmans', title: 'Über die Zuordnung von Wellenfunktionen und Eigenwerten zu den einzelnen Elektronen eines Atoms', year: 1934, venue: 'Physica 1, 104–113' },
  ],
} satisfies LessonContent;
