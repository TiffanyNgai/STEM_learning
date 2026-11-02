import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain', title: 'Electrons are not tiny planets',
      body: String.raw`The old "solar system" picture of the atom fails: an orbiting charge should radiate energy and spiral into the nucleus in about $10^{-11}$ s. Yet atoms are stable.

The fix is that electrons behave as **waves**. Think of a guitar string: pinned at both ends, it can only vibrate in certain patterns (fundamental, overtones). An electron bound to a nucleus is similarly confined, so only certain standing-wave patterns — and therefore only certain energies — are allowed. That is where **quantization** comes from.`,
    },
    {
      kind: 'recall', title: 'From quantum mechanics',
      points: [
        String.raw`The state of an electron is a **wavefunction** $\psi(\mathbf r)$ obtained from the Schrödinger equation $\hat H\psi = E\psi$.`,
        String.raw`$|\psi(\mathbf r)|^2$ is a **probability density**: $|\psi|^2\,dV$ is the probability of finding the electron in the small volume $dV$.`,
        String.raw`For hydrogen the equation is solved exactly; energies are $E_n = -13.6\,\text{eV}/n^2$.`,
        String.raw`Solutions are labelled by quantum numbers $n, \ell, m_\ell$.`,
      ],
      link: 'quantum/hydrogen-atom',
    },
    {
      kind: 'explain', title: 'What an orbital is',
      body: String.raw`An **atomic orbital** is a one-electron wavefunction $\psi(\mathbf r)$ — a standing-wave pattern around the nucleus. It is *not* a path. It tells you where the electron is likely to be found if you look.

Picture it as a cloud: denser where $|\psi|^2$ is large. The value of $\psi$ itself can be positive or negative (its **phase**, or sign); that sign does not change the probability, but it matters enormously when orbitals overlap to make bonds.`,
    },
    {
      kind: 'widget', title: 'Building a cloud, one measurement at a time',
      body: 'Each dot is one simulated measurement of the electron’s position in a slice through the nucleus of hydrogen. Watch the 1s cloud build up.',
      widget: { type: 'OrbitalViewer', props: { orbital: '1s', options: ['1s', '2s', '2p'] },
        caption: 'No single measurement tells you much; the *pattern* of many is the orbital. The 1s cloud is spherical and densest at the nucleus.' },
    },
    {
      kind: 'explain', title: 'Four quantum numbers',
      body: String.raw`- **Principal** $n = 1, 2, 3, \dots$ — shell; sets size and (mostly) energy.
- **Angular momentum** $\ell = 0, 1, \dots, n-1$ — subshell shape, named $s, p, d, f$ for $\ell = 0,1,2,3$.
- **Magnetic** $m_\ell = -\ell, \dots, +\ell$ — orientation; so a subshell has $2\ell+1$ orbitals.
- **Spin** $m_s = +\tfrac12$ or $-\tfrac12$ ("up" ↑ / "down" ↓) — a property of the electron, not the orbital.

**Example.** $n=2$: $\ell=0$ (one 2s orbital) and $\ell=1$ (three 2p orbitals, $m_\ell=-1,0,+1$). Shell $n$ holds $n^2$ orbitals.`,
    },
    {
      kind: 'mcq', prompt: String.raw`Which set of quantum numbers $(n, \ell, m_\ell)$ is **not** allowed?`,
      choices: ['(1, 0, 0)', '(2, 1, −1)', '(2, 2, 0)', '(3, 2, 2)'],
      answer: 2,
      why: 'ℓ must be less than n, so n = 2 allows only ℓ = 0 or 1 — there is no "2d" orbital. (3, 2, 2) is fine: a 3d orbital with m = +2, which satisfies |m| ≤ ℓ.',
    },
    {
      kind: 'numeric', prompt: 'How many orbitals are in the n = 3 shell (3s + 3p + 3d together)?',
      answer: 9, unit: 'orbitals',
      why: '1 (3s) + 3 (3p) + 5 (3d) = 9 = n². Each orbital can hold 2 electrons, so the shell holds 18.',
    },
    {
      kind: 'explain', title: 'Nodes: where the wave is zero',
      body: String.raw`Like the still points on a vibrating string, orbitals have **nodes** where $\psi = 0$ (zero chance of finding the electron).

- **Angular nodes** (planes or cones through the nucleus): $\ell$ of them.
- **Radial nodes** (spheres): $n - \ell - 1$ of them.
- Total: $n - 1$. More nodes ⇒ more "wiggles" ⇒ higher kinetic energy.

**Worked example.** 3p: $n=3, \ell=1$ → 1 angular node (a plane) and $3-1-1 = 1$ radial node (a sphere). Crossing a node flips the sign of $\psi$.`,
    },
    {
      kind: 'widget', title: 'Explore shapes and nodes',
      body: 'Switch orbitals and turn the node overlay on. Blue and red show the two signs of ψ.',
      widget: { type: 'OrbitalViewer', props: { orbital: '2p', options: ['2s', '2p', '3s', '3p', '3dz2', '3dxz'], showNodes: true },
        caption: 'In a plain slice the outer shells of 2s and 3s look faint, because density per volume there is small. Tap **×r²** to weight by distance — the "how far away" view — and the rings separated by spherical nodes pop out.' },
    },
    {
      kind: 'fill', prompt: 'A 4d orbital has ___ angular nodes and ___ radial nodes.',
      bank: ['0', '1', '2', '3', '4'], answer: ['2', '1'],
      why: 'Angular nodes = ℓ = 2 for any d orbital. Radial nodes = n − ℓ − 1 = 4 − 2 − 1 = 1. Total = n − 1 = 3, a useful check.',
    },
    {
      kind: 'explain', title: 'How far from the nucleus?',
      body: String.raw`The probability of finding the electron at *distance* $r$ (in a thin shell of thickness $dr$) is the **radial distribution function**

$$P(r)\,dr = r^2 R(r)^2\,dr$$

where $R(r)$ is the radial part of $\psi$. The factor $r^2$ is the growing area of a shell. For 1s, $|\psi|^2$ is largest *at* the nucleus, but there is very little volume there; $P(r)$ peaks at $r = a_0 = 52.9$ pm, the **Bohr radius**.`,
    },
    {
      kind: 'widget', title: 'Radial distributions of 1s, 2s and 3s',
      widget: { type: 'FunctionPlot', props: {
        fns: ['4*x^2*exp(-2*x)', 'x^2*(2-x)^2*exp(-x)/8', '4*x^2*(27-18*x+2*x^2)^2*exp(-2*x/3)/19683'],
        x: [0, 22], y: [0, 0.6], labels: ['1s', '2s', '3s'], xLabel: 'r / a₀', yLabel: 'P(r)' },
        caption: 'Each extra radial node adds a hump, and the outermost hump moves further out: bigger $n$ means a bigger orbital. The zeros between humps are the spherical nodes (2s at $r = 2a_0$).' },
    },
    {
      kind: 'truefalse', prompt: 'For a hydrogen 1s electron, the most probable distance from the nucleus is zero.',
      answer: false,
      why: 'The probability *density* is highest at the nucleus, but the most probable *distance* is a₀ ≈ 53 pm, because the number of places at distance r grows as r². Confusing density with radial probability is the trap here.',
    },
    {
      kind: 'match', prompt: 'Match each orbital to its description.',
      pairs: [
        ['1s', 'Sphere, no nodes'],
        ['2s', 'Sphere with one spherical node'],
        ['2p', 'Two lobes, one nodal plane'],
        ['3dxz', 'Four lobes, two nodal planes'],
      ],
      why: 'Use the counting rules: angular nodes = ℓ, radial nodes = n − ℓ − 1. s orbitals are spherical; p have one plane; d have two angular nodes.',
    },
    {
      kind: 'order', prompt: 'Order these orbitals from fewest to most total nodes.',
      steps: ['1s', '2p', '3d', '4f'],
      why: 'Total nodes = n − 1: 1s → 0, 2p → 1, 3d → 2, 4f → 3. The shape letter alone does not decide it; n does.',
    },
    {
      kind: 'explain', title: 'Key takeaways',
      body: String.raw`- An orbital is a standing-wave **wavefunction**; $|\psi|^2$ is the probability density.
- Labels: $n$ (size/energy), $\ell$ (shape: s p d f), $m_\ell$ (orientation, $2\ell+1$ of them), plus electron spin $m_s$.
- Nodes: $\ell$ angular + $(n-\ell-1)$ radial = $n-1$ total; $\psi$ changes sign across a node.
- Radial distribution $r^2R^2$ tells you *how far* the electron typically is.
- Next: how many-electron atoms fill these orbitals → [electron configuration](@chem/electron-configuration).`,
    },
  ],
  references: [
    { authors: 'P. Flowers, K. Theopold, R. Langley, W. R. Robinson', title: 'Chemistry 2e', year: 2019, venue: 'OpenStax', detail: 'Ch. 6.2–6.3', url: 'https://openstax.org/details/books/chemistry-2e' },
    { authors: 'P. Atkins, J. de Paula, J. Keeler', title: "Atkins' Physical Chemistry", year: 2018, venue: '11th ed., Oxford University Press', detail: 'Topic 8A: Hydrogenic atoms' },
    { authors: 'D. A. McQuarrie, J. D. Simon', title: 'Physical Chemistry: A Molecular Approach', year: 1997, venue: 'University Science Books', detail: 'Ch. 6' },
  ],
} satisfies LessonContent;
