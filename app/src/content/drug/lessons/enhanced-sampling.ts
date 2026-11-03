import type { LessonContent } from '../../types';

const remdSvg = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
<g font-size="9">
${[0, 1, 2, 3].map((i) => `<line x1="54" x2="310" y1="${24 + i * 32}" y2="${24 + i * 32}" stroke="var(--grid)"/><text x="48" y="${27 + i * 32}" text-anchor="end" fill="var(--fg)" font-weight="700">${[300, 330, 363, 400][i]} K</text>`).join('')}
<path d="M54,24 L120,24 L130,56 L200,56 L210,88 L310,88" fill="none" stroke="var(--c2)" stroke-width="2.5" stroke-dasharray="400" stroke-dashoffset="400"><animate attributeName="stroke-dashoffset" from="400" to="0" dur="4s" repeatCount="indefinite"/></path>
<path d="M54,56 L120,56 L130,24 L250,24 L260,56 L310,56" fill="none" stroke="var(--c5)" stroke-width="2.5" stroke-dasharray="400" stroke-dashoffset="400"><animate attributeName="stroke-dashoffset" from="400" to="0" dur="4s" repeatCount="indefinite"/></path>
<path d="M54,88 L200,88 L210,56 L250,56 L260,24 L310,24" fill="none" stroke="var(--c1)" stroke-width="2.5" stroke-dasharray="400" stroke-dashoffset="400"><animate attributeName="stroke-dashoffset" from="400" to="0" dur="4s" repeatCount="indefinite"/></path>
<path d="M54,120 L310,120" fill="none" stroke="var(--c4)" stroke-width="2.5" stroke-dasharray="400" stroke-dashoffset="400"><animate attributeName="stroke-dashoffset" from="400" to="0" dur="4s" repeatCount="indefinite"/></path>
<text x="125" y="44" text-anchor="middle" fill="var(--muted)">swap</text>
<text x="205" y="76" text-anchor="middle" fill="var(--muted)">swap</text>
<text x="255" y="44" text-anchor="middle" fill="var(--muted)">swap</text>
<text x="182" y="144" text-anchor="middle" fill="var(--muted)">simulation time →  (each colour = one configuration)</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Waiting for something to happen',
      body: String.raw`Plain MD reaches microseconds, yet a ligand may stay bound for minutes and a kinase may take milliseconds to flip its activation loop. These are **rare events**: the system spends almost all its time rattling in a free-energy basin and only rarely gathers enough thermal energy to cross a barrier.

The waiting time grows **exponentially** with barrier height, roughly as $e^{\Delta F^\ddagger/k_BT}$. At 300 K, $k_BT = 0.596$ kcal/mol, so every extra 1.37 kcal/mol of barrier makes the event 10 times rarer. **Enhanced sampling** methods change the simulation so that barriers are crossed often, in ways that can still be corrected exactly afterwards.`,
    },
    {
      kind: 'recall',
      title: 'The Boltzmann distribution (from Physics)',
      points: [
        'At temperature $T$, a state of energy $E$ has probability $\\propto e^{-E/k_BT}$.',
        'Population ratio of two states: $p_A/p_B = e^{-(E_A-E_B)/k_BT}$.',
        '$k_BT \\approx 0.596$ kcal/mol $\\approx 2.49$ kJ/mol at 300 K.',
        'Free energies include entropy: they come from *how often* states are visited.',
      ],
      link: 'physics/boltzmann-distribution',
    },
    {
      kind: 'explain',
      title: 'Collective variables and free-energy surfaces',
      body: String.raw`We cannot picture a landscape in 100,000 dimensions, so we choose a few **collective variables (CVs)** $s(\mathbf r)$ that describe the process: a ligand–pocket distance, a torsion angle, a distance between two helices.

The **free-energy surface** (or potential of mean force) along $s$ comes from how often each value is visited:

$$F(s) = -k_BT\ln P(s) + \text{const}.$$

A barrier in $F(s)$ means the top is almost never visited, so a straightforward simulation cannot measure it. Most enhanced-sampling methods add a **bias** $V(s)$ to flatten $F(s)$ and then remove its effect in the analysis. They only work as well as the chosen CVs: if a slow motion is missing from $s$, the bias cannot help it.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A barrier rises by 2.74 kcal/mol. At 300 K ($k_BT = 0.596$ kcal/mol), by roughly what factor does the crossing rate fall? (rate $\propto e^{-\Delta F^\ddagger/k_BT}$)`,
      answer: 99.4,
      tolerance: 6,
      why: String.raw`$2.74/0.596 = 4.60$ and $e^{4.60}\approx 99$, so about 100-fold slower. Equivalently, 2.74 kcal/mol is $2\times1.37$ kcal/mol, i.e. two factors of 10. This exponential sensitivity is why a few kcal/mol separates nanosecond from millisecond events.`,
    },
    {
      kind: 'widget',
      title: 'Plain MD gets stuck',
      body: String.raw`A walker on a double-well free-energy surface with an 8 $k_BT$ barrier. In **Plain MD** mode, watch the $s(t)$ trace: it stays in one well for a very long time. Keep this picture in mind, then come back and press **Metadynamics**.`,
      widget: { type: 'DrugMetadynamics', props: { mode: 'plain' }, caption: 'Overdamped Langevin dynamics in reduced units. The expected waiting time to cross an 8 k_BT barrier is hundreds of time units, far longer than this window.' },
    },
    {
      kind: 'explain',
      title: 'Umbrella sampling and WHAM',
      body: String.raw`**Umbrella sampling** (Torrie & Valleau 1977) splits the CV range into **windows**. Window $i$ adds a harmonic restraint $w_i(s)=\tfrac12k(s-s_i)^2$ that holds the system near $s_i$, even on top of a barrier. Each window samples a biased distribution $P_i^{b}(s)$, from which

$$F(s) = -k_BT\ln P_i^b(s) - w_i(s) + C_i.$$

The constants $C_i$ are unknown, but windows that **overlap** must agree on $F$ where they overlap, which pins down the $C_i$. The **weighted histogram analysis method** (WHAM; Kumar et al. 1992) solves for all $C_i$ and $F(s)$ together, self-consistently, weighting each window by how well it samples each $s$. MBAR is a widely used bin-free successor.`,
    },
    {
      kind: 'widget',
      title: 'Windows, overlap and WHAM',
      body: 'Each coloured curve is one window\'s histogram; red dots are the WHAM free energy. Reduce the number of windows or make the springs very stiff until the histograms stop overlapping, and watch the reconstruction break.',
      widget: { type: 'DrugUmbrellaWindows', props: { windows: 8, k: 40 }, caption: 'Samples are drawn exactly from each biased Boltzmann distribution, standing in for short restrained MD runs. Where no window samples a region, WHAM has nothing to say.' },
    },
    {
      kind: 'mcq',
      prompt: 'Why must histograms from neighbouring umbrella windows overlap?',
      choices: [
        'Overlap is what fixes the unknown free-energy offset between windows',
        'Overlapping windows make each simulation run faster',
        'The harmonic restraints only work when windows overlap',
        'Overlap removes the need to choose a collective variable',
      ],
      answer: 0,
      why: String.raw`Each window gives $F(s)$ only up to its own constant $C_i$. Only where two windows sample the same $s$ can their offsets be compared and stitched together. Overlap does not speed up individual runs, the restraint works either way, and you still need a good CV.`,
    },
    {
      kind: 'explain',
      title: 'Metadynamics: filling the wells',
      body: String.raw`**Metadynamics** (Laio & Parrinello 2002) builds the bias on the fly. Every few steps it drops a small Gaussian "hill" at the current CV value:

$$V(s,t)=\sum_{t'<t} w\,\exp\!\Big(-\frac{(s-s(t'))^2}{2\sigma^2}\Big).$$

Hills pile up where the system lingers, filling the well it sits in until it spills over the barrier into the next well, and then filling that one. Once the landscape is flat, $V(s)\approx -F(s)+\text{const}$: the bias **is** the free-energy estimate.

In plain metadynamics the estimate keeps fluctuating. **Well-tempered** metadynamics (Barducci, Bussi & Parrinello 2008) shrinks new hills where the bias is already high, so it converges smoothly, and $F$ is recovered from a known multiple of $V$.`,
    },
    {
      kind: 'widget',
      title: 'Watch the hills pile up',
      body: 'The orange curve is F + bias; the dashed green curve is the free-energy estimate from the bias. Compare with plain MD, then try well-tempered mode and a larger hill height.',
      widget: { type: 'DrugMetadynamics', props: { mode: 'metad' }, caption: 'Hills of height w and width σ = 0.2 are added every 100 steps. Large hills fill faster but give a rougher estimate: a classic speed–accuracy trade-off.' },
    },
    {
      kind: 'truefalse',
      prompt: 'In standard metadynamics, once the wells are filled, the accumulated bias V(s) is approximately the negative of the free energy F(s), up to a constant.',
      answer: true,
      why: 'Hills are added until the biased landscape F + V is roughly flat, so V ≈ −F + const. With well-tempered metadynamics the bias converges to a known fraction of −F instead, which is rescaled to recover F.',
    },
    {
      kind: 'explain',
      title: 'Replica exchange: borrow heat',
      body: String.raw`**Replica-exchange MD** (REMD, or parallel tempering; Sugita & Okamoto 1999) runs $M$ copies of the system at a ladder of temperatures. Hot replicas cross barriers easily. Periodically, neighbours try to **swap** configurations, accepted with the Metropolis probability

$$p_{\text{acc}}=\min\Big(1,\ e^{(\beta_i-\beta_j)(E_i-E_j)}\Big),\qquad\beta=1/k_BT,$$

where $E_i$ is the potential energy of the configuration currently at temperature $T_i$. This keeps every temperature correctly Boltzmann-distributed, while configurations random-walk up and down the ladder. No CV is needed.

The cost: the number of replicas needed grows with the square root of the number of degrees of freedom, so solvated proteins need many. **REST2** heats only a chosen region (e.g. the ligand and pocket).`,
      widget: { type: 'SvgDiagram', props: { svg: remdSvg }, caption: 'Configurations wander between temperatures. A conformation unlocked at a high temperature can travel down to 300 K, where its statistics count.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Neighbouring replicas run at 300 K ($\beta_i = 1.677$ mol/kcal) and 310 K ($\beta_j = 1.623$ mol/kcal). The configuration at 300 K has $E_i = -50{,}000$ kcal/mol; the one at 310 K has $E_j = -49{,}990$ kcal/mol. What is the swap acceptance probability?`,
      answer: 0.58,
      tolerance: 0.02,
      why: String.raw`$(\beta_i-\beta_j)(E_i-E_j) = (0.054)(-10) = -0.54$, and $e^{-0.54}\approx0.58$. The swap would send the higher-energy configuration down to the colder replica, so it is penalised but often accepted. Large energy gaps (big systems, distant temperatures) make swaps rare.`,
    },
    {
      kind: 'explain',
      title: 'Accelerated MD: raise the floor',
      body: String.raw`**Accelerated MD** (aMD; Hamelberg, Mongan & McCammon 2004) needs no CV. Whenever the potential $V$ is below a threshold $E$, it adds a boost

$$\Delta V = \frac{(E-V)^2}{\alpha + E - V},$$

which raises the basins while leaving barriers above $E$ unchanged, so barriers effectively shrink. Each frame is reweighted by $e^{\beta\Delta V}$ to recover the true ensemble. In large systems these weights become very noisy; Gaussian aMD (GaMD) uses a gentler boost to make reweighting more stable.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['8*(x^2-1)^2', '8*(x^2-1)^2 + max(0, E-8*(x^2-1)^2)^2/(alpha + max(0, E-8*(x^2-1)^2))'],
          x: [-1.8, 1.8], y: [0, 12],
          params: [
            { name: 'E', min: 0, max: 10, value: 6, label: 'threshold E' },
            { name: 'alpha', min: 0.2, max: 10, value: 2, label: 'α (smoothing)' },
          ],
          labels: ['true potential V', 'boosted V + ΔV'],
          xLabel: 's', yLabel: 'energy (k_BT)',
        },
        caption: 'Small α flattens the basins almost to E (strong acceleration, noisy reweighting); large α gives a gentler boost.',
      },
    },
    {
      kind: 'match',
      prompt: 'Match each method to its key idea.',
      pairs: [
        ['Umbrella sampling', 'Harmonic restraints in overlapping windows along a CV'],
        ['WHAM', 'Self-consistently combines biased histograms into one free-energy profile'],
        ['Metadynamics', 'History-dependent Gaussian hills fill free-energy wells'],
        ['Replica exchange', 'Swaps configurations between copies at different temperatures'],
        ['Accelerated MD', 'Raises low-energy basins with a boost potential, then reweights'],
      ],
      why: 'Umbrella sampling and metadynamics bias chosen collective variables; replica exchange and aMD avoid CVs by heating or boosting the whole system (or a region), paying instead in replicas or in reweighting noise.',
    },
    {
      kind: 'order',
      prompt: 'Order an umbrella-sampling calculation of a ligand unbinding free-energy profile.',
      steps: [
        'Choose a collective variable (e.g. ligand–pocket distance)',
        'Generate starting structures along it (e.g. by steered MD)',
        'Run a restrained simulation in each window',
        'Check that neighbouring histograms overlap',
        'Combine the windows with WHAM (or MBAR) to get F(s)',
      ],
      why: 'Overlap must be checked before WHAM: gaps cannot be fixed by analysis, only by adding windows or softening restraints. The quality of the CV, chosen at the very start, limits everything after it.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Rates fall as $e^{-\Delta F^\ddagger/k_BT}$: +1.37 kcal/mol of barrier means 10× slower at 300 K.
- $F(s)=-k_BT\ln P(s)$ along **collective variables**; biasing methods only work as well as the CVs.
- **Umbrella sampling + WHAM**: restrained windows that must overlap. **Metadynamics**: Gaussian hills, $V\to-F$; well-tempered converges.
- **Replica exchange**: temperature ladder with Metropolis swaps, no CV. **aMD**: boost the basins and reweight by $e^{\beta\Delta V}$.`,
    },
  ],
  references: [
    { authors: 'Torrie, G. M., Valleau, J. P.', title: 'Nonphysical sampling distributions in Monte Carlo free-energy estimation: umbrella sampling', year: 1977, venue: 'J. Comput. Phys. 23, 187–199' },
    { authors: 'Kumar, S., Rosenberg, J. M., Bouzida, D., Swendsen, R. H., Kollman, P. A.', title: 'The weighted histogram analysis method for free-energy calculations on biomolecules. I. The method', year: 1992, venue: 'J. Comput. Chem. 13, 1011–1021' },
    { authors: 'Laio, A., Parrinello, M.', title: 'Escaping free-energy minima', year: 2002, venue: 'Proc. Natl. Acad. Sci. USA 99, 12562–12566' },
    { authors: 'Sugita, Y., Okamoto, Y.', title: 'Replica-exchange molecular dynamics method for protein folding', year: 1999, venue: 'Chem. Phys. Lett. 314, 141–151' },
    { authors: 'Hamelberg, D., Mongan, J., McCammon, J. A.', title: 'Accelerated molecular dynamics: a promising and efficient simulation method for biomolecules', year: 2004, venue: 'J. Chem. Phys. 120, 11919–11929' },
  ],
} satisfies LessonContent;
