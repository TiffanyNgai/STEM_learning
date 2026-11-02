import type { LessonContent } from '../../types';

const ladder = `<svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg">
  <line x1="110" y1="20" x2="110" y2="190" stroke="var(--fg)" stroke-width="2"/>
  <line x1="170" y1="20" x2="170" y2="190" stroke="var(--fg)" stroke-width="2"/>
  <g stroke="var(--fg)" stroke-width="2">
    <line x1="110" y1="165" x2="170" y2="165"/><line x1="110" y1="135" x2="170" y2="135"/>
    <line x1="110" y1="105" x2="170" y2="105"/><line x1="110" y1="75" x2="170" y2="75"/><line x1="110" y1="45" x2="170" y2="45"/>
  </g>
  <g font-size="9.5" fill="var(--fg)">
    <text x="176" y="168">1. LDA — uses ρ</text>
    <text x="176" y="138">2. GGA — adds ∇ρ (PBE, BLYP)</text>
    <text x="176" y="108">3. meta-GGA — adds τ (SCAN)</text>
    <text x="176" y="78">4. hybrid — adds exact</text>
    <text x="186" y="89">exchange (B3LYP, PBE0)</text>
    <text x="176" y="48">5. double hybrid — adds</text>
    <text x="186" y="59">virtual orbitals (B2PLYP)</text>
  </g>
  <text x="140" y="203" font-size="9" text-anchor="middle" fill="var(--muted)">Hartree world (no exchange–correlation)</text>
  <text x="140" y="13" font-size="9" text-anchor="middle" fill="var(--c1)">heaven of chemical accuracy</text>
  <text x="6" y="100" font-size="9" fill="var(--muted)">more accurate</text>
  <text x="6" y="112" font-size="9" fill="var(--muted)">(usually) and</text>
  <text x="6" y="124" font-size="9" fill="var(--muted)">more expensive ↑</text>
  <circle cx="140" r="5" fill="var(--c3)"><animate attributeName="cy" values="180;160;130;100;70;40;40;180" keyTimes="0;0.15;0.3;0.45;0.6;0.75;0.9;1" dur="6s" repeatCount="indefinite"/></circle>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain', title: 'A simpler variable than the wavefunction',
      body: String.raw`An $N$-electron wavefunction depends on $3N$ coordinates — for benzene, 126. Yet the **electron density** $\rho(\mathbf r)$, the number of electrons per unit volume at point $\mathbf r$, depends on just **3**, however many electrons there are.

Think of a crowd: the full wavefunction is every person’s coordinates; the density is just a map of how crowded each spot is. **Density functional theory** (DFT) asks: is the crowd map enough to get the energy? Remarkably, yes — in principle.`,
    },
    {
      kind: 'explain', title: 'The electron density',
      body: String.raw`$$\rho(\mathbf r) = N\int |\Psi(\mathbf r, \mathbf r_2, \dots, \mathbf r_N)|^2\, d\mathbf r_2\cdots d\mathbf r_N, \qquad \int\rho(\mathbf r)\,d\mathbf r = N$$

(spins are summed over too). Unlike $\Psi$, $\rho$ is a physical observable — X-ray diffraction measures it (see [X-ray crystallography](@chem/xray-crystallography)). Its sharp peaks (cusps) sit at the nuclei, and their steepness reveals each nuclear charge: the density "knows" the molecule.`,
    },
    {
      kind: 'widget', title: 'Shells in the density of neon',
      body: String.raw`Radial density $4\pi r^2\rho(r)$ of Ne from a simple Slater-type model: 2 electrons in 1s (exponent ζ₁) and 8 in 2s/2p (ζ₂).`,
      widget: { type: 'FunctionPlot', props: {
        fns: ['8*z1^3*x^2*exp(-2*z1*x) + 8*(2*z2)^5/24*x^4*exp(-2*z2*x)'], x: [0, 2.5], y: [0, 14],
        params: [
          { name: 'z1', min: 6, max: 12, value: 9.64, label: 'ζ₁ (1s)' },
          { name: 'z2', min: 1.5, max: 4, value: 2.88, label: 'ζ₂ (2s, 2p)' },
        ], xLabel: 'r / a₀', yLabel: '4πr²ρ' },
      caption: 'Two humps: the tight K shell and the broader L shell. The area under the curve is always 10 electrons, whatever the exponents — the density is just 3D, yet carries the atom’s structure.' },
    },
    {
      kind: 'explain', title: 'Hohenberg–Kohn theorems (1964)',
      body: String.raw`1. **Density determines everything.** The ground-state density $\rho_0$ fixes the external potential (where the nuclei are and their charges), hence the Hamiltonian, hence *all* ground-state properties. So the energy is a **functional** of the density, $E[\rho]$ — a function of a whole function.
2. **Variational principle.** $E[\rho] \ge E_0$ for any reasonable trial density, with equality for the true $\rho_0$. Minimize over densities and you find the ground state.

The catch: the exact universal functional (kinetic + electron–electron parts) is **unknown**. All practical DFT is about approximating it.`,
    },
    {
      kind: 'mcq', prompt: 'What does the first Hohenberg–Kohn theorem state?',
      choices: ['The density can be computed exactly from Hartree–Fock', 'The ground-state density uniquely determines the external potential, and hence all ground-state properties', 'Every functional gives an energy above the exact one', 'Electrons do not interact in DFT'],
      answer: 1,
      why: 'HK1 is an existence proof: ρ₀ ↔ potential ↔ everything. It does not say what the functional is, and it says nothing about approximate functionals being upper bounds (they are not).',
    },
    {
      kind: 'explain', title: 'Kohn–Sham: borrow orbitals back (1965)',
      body: String.raw`Writing the kinetic energy directly from $\rho$ works badly. Kohn and Sham’s trick: imagine **fictitious non-interacting electrons** in orbitals $\phi_i$ chosen so their density $\rho = \sum_i|\phi_i|^2$ equals the real one. Then

$$E[\rho] = T_s[\rho] + \int v_\text{ext}\,\rho + J[\rho] + E_\text{xc}[\rho]$$

and the orbitals obey HF-like equations, solved by the same [SCF loop](@chem/hartree-fock):

$$\left[-\tfrac12\nabla^2 + v_\text{ext} + v_J + v_\text{xc}\right]\phi_i = \varepsilon_i\phi_i$$

Everything we don’t know exactly is swept into $E_\text{xc}$, the **exchange–correlation** functional — a small part of the total energy, so modest approximations work well.`,
    },
    {
      kind: 'match', prompt: 'Match each Kohn–Sham energy term to its meaning.',
      pairs: [
        [String.raw`$T_s[\rho]$`, 'Kinetic energy of the non-interacting electrons'],
        [String.raw`$\int v_\text{ext}\rho$`, 'Attraction of electrons to the nuclei'],
        [String.raw`$J[\rho]$`, 'Classical repulsion of the density with itself'],
        [String.raw`$E_\text{xc}[\rho]$`, 'Exchange, correlation and the kinetic-energy correction'],
      ],
      why: 'The first three are known exactly given the orbitals or density. E_xc collects everything else — including the difference between the true and non-interacting kinetic energies — and is the only part that must be approximated.',
    },
    {
      kind: 'explain', title: 'Approximating E_xc: Jacob’s ladder',
      body: String.raw`The simplest choice, the **local density approximation** (LDA), treats each point as if it were a uniform electron gas of that density. Its exchange part is exact for the uniform gas:

$$E_x^\text{LDA} = -\tfrac34\left(\tfrac{3}{\pi}\right)^{1/3}\int\rho(\mathbf r)^{4/3}\,d\mathbf r$$

Better functionals add more ingredients: the density gradient (**GGA**, e.g. PBE), the kinetic-energy density (**meta-GGA**), a fraction of exact HF exchange (**hybrids**, e.g. B3LYP, PBE0), and finally virtual-orbital correlation (**double hybrids**). Perdew calls this **Jacob’s ladder**.`,
    },
    {
      kind: 'widget', title: 'Climbing Jacob’s ladder',
      widget: { type: 'SvgDiagram', props: { svg: ladder },
        caption: 'Each rung adds a more informative ingredient. Higher is *usually* more accurate and costlier, but not always — choosing a functional is the topic of [choosing a functional](@chem/dft-functionals).' },
    },
    {
      kind: 'order', prompt: 'Order the rungs of Jacob’s ladder from bottom to top.',
      steps: ['LDA', 'GGA', 'meta-GGA', 'Hybrid', 'Double hybrid'],
      why: 'Ingredients accumulate: ρ → +∇ρ → +kinetic-energy density τ → +exact exchange (occupied orbitals) → +virtual orbitals (MP2-like correlation).',
    },
    {
      kind: 'truefalse', prompt: 'Because of the Hohenberg–Kohn variational principle, an approximate DFT functional always gives energies above the exact energy.',
      answer: false,
      why: 'The variational bound holds only for the exact functional. Approximate functionals can over- or under-shoot; DFT total energies are often below the exact value. HF, by contrast, is a true upper bound.',
    },
    {
      kind: 'multi', prompt: 'Which are known weaknesses of common approximate functionals (e.g. plain GGAs)?',
      choices: ['Self-interaction error: an electron partly repels itself', 'Missing long-range dispersion unless a correction (e.g. -D3) is added', 'Cost grows exponentially with system size', 'Band gaps / HOMO–LUMO gaps are typically underestimated', 'Cannot be used to optimize geometries'],
      answers: [0, 1, 3],
      why: 'Self-interaction, missing dispersion and too-small gaps are classic DFT failures. Cost is polynomial (≈ N³–N⁴), and geometry optimization with DFT is routine — it is the workhorse for molecular structures.',
    },
    {
      kind: 'numeric', prompt: 'A pure-GGA DFT calculation scales roughly as N³ in the number of basis functions N. If 100 functions take 1 minute, about how many minutes will 400 functions take?',
      answer: 64, tolerance: 2, unit: 'min',
      why: '(400/100)³ = 4³ = 64, so ~64 minutes. With CCSD(T) (∝ N⁷) the same 4× increase would cost 4⁷ ≈ 16 000× — this favourable scaling is why DFT dominates for molecules of drug size.',
    },
    {
      kind: 'mcq', prompt: 'You need the optimized 3D geometry of a 50-atom drug-like molecule. What is the usual first choice?',
      choices: ['Full configuration interaction', 'CCSD(T) with a quadruple-zeta basis', 'A dispersion-corrected hybrid or GGA DFT functional with a double/triple-zeta basis', 'Hartree–Fock with STO-3G'],
      answer: 2,
      why: 'DFT (e.g. B3LYP-D3 or ωB97X-D with def2-TZVP) balances accuracy and cost for ~50 atoms. Full CI and big-basis CCSD(T) are far too expensive; HF/STO-3G is cheap but poor (no correlation, no dispersion, minimal basis).',
    },
    {
      kind: 'explain', title: 'Key takeaways',
      body: String.raw`- DFT uses the 3D electron density $\rho(\mathbf r)$ instead of the $3N$-dimensional wavefunction.
- **Hohenberg–Kohn:** $\rho_0$ determines everything; the exact functional is variational but unknown.
- **Kohn–Sham:** non-interacting orbitals reproduce $\rho$; all unknowns go into $E_\text{xc}$; solved by SCF.
- Functionals climb **Jacob’s ladder** (LDA → GGA → meta-GGA → hybrid → double hybrid).
- Fast (~N³–N⁴) and usually accurate, but watch self-interaction, dispersion and gaps.`,
    },
  ],
  references: [
    { authors: 'P. Hohenberg, W. Kohn', title: 'Inhomogeneous electron gas', year: 1964, venue: 'Physical Review 136, B864–B871' },
    { authors: 'W. Kohn, L. J. Sham', title: 'Self-consistent equations including exchange and correlation effects', year: 1965, venue: 'Physical Review 140, A1133–A1138' },
    { authors: 'W. Koch, M. C. Holthausen', title: "A Chemist's Guide to Density Functional Theory", year: 2001, venue: '2nd ed., Wiley-VCH', detail: 'Ch. 3–5' },
    { authors: 'J. P. Perdew, K. Schmidt', title: 'Jacob’s ladder of density functional approximations for the exchange-correlation energy', year: 2001, venue: 'AIP Conference Proceedings 577, 1–20' },
    { authors: 'F. Jensen', title: 'Introduction to Computational Chemistry', year: 2017, venue: '3rd ed., Wiley', detail: 'Ch. 6' },
  ],
} satisfies LessonContent;
