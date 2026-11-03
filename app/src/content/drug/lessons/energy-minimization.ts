import type { LessonContent } from '../../types';

const pesSvg = `<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg">
<path d="M10,30 C30,30 40,95 70,95 C95,95 100,55 125,55 C150,55 160,120 190,120 C220,120 228,40 250,40 C272,40 285,80 300,80 L312,70" fill="none" stroke="var(--fg)" stroke-width="2"/>
<circle r="5" fill="var(--c5)"><animateMotion dur="3s" repeatCount="indefinite" path="M240,42 C230,52 222,120 190,120" keyPoints="0;1;1" keyTimes="0;0.6;1" calcMode="linear"/></circle>
<circle r="5" fill="var(--c2)"><animateMotion dur="3s" repeatCount="indefinite" path="M112,58 C100,62 95,95 70,95" keyPoints="0;1;1" keyTimes="0;0.6;1" calcMode="linear"/></circle>
<g font-size="9" text-anchor="middle">
<text x="70" y="110" fill="var(--c2)">local minimum</text>
<text x="190" y="134" fill="var(--c5)" font-weight="700">global minimum</text>
<text x="125" y="48" fill="var(--muted)">saddle / barrier</text>
<text x="250" y="32" fill="var(--muted)">barrier</text>
<text x="160" y="14" fill="var(--muted)">a minimiser only goes downhill: where you start decides where you end</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Rolling downhill',
      body: String.raw`A structure straight from a crystal, a homology model or a docking program usually has small flaws: atoms a bit too close, a bond slightly too long. Fed into molecular dynamics, one bad clash produces an enormous force and the simulation "explodes".

**Energy minimisation** fixes this by moving the atoms downhill on the force-field energy $U(\mathbf r)$ until the forces are (nearly) zero. It is also how we refine docked poses and find low-energy **conformers** of a drug. The result is a structure at a minimum, roughly a picture at 0 K: no thermal motion and no entropy.`,
    },
    {
      kind: 'recall',
      title: 'Gradient descent (from Machine Learning)',
      points: [
        'The gradient $\\nabla f$ points uphill; stepping along $-\\nabla f$ decreases $f$.',
        'Update rule: $x \\leftarrow x - \\eta\\,\\nabla f(x)$ with a step size (learning rate) $\\eta$.',
        'In long, narrow valleys plain gradient descent zig-zags and converges slowly.',
        'It finds a **local** minimum, which depends on the starting point.',
      ],
      link: 'ml/gradient-descent',
    },
    {
      kind: 'explain',
      title: 'The potential-energy surface',
      body: String.raw`For $N$ atoms, $U$ is a function of $3N$ coordinates: a landscape in $3N$ dimensions. The gradient $\mathbf g=\nabla U$ is minus the force. **Stationary points** have $\mathbf g=0$. They are classified by the **Hessian** $H_{ij}=\partial^2U/\partial x_i\partial x_j$ (the matrix of curvatures):

- **minimum**: all curvatures positive (ignoring the six zero modes of overall translation and rotation);
- **saddle point** (transition state): exactly one negative curvature;
- higher-order saddles and maxima otherwise.

Every minimiser below only goes downhill, so it stops at the minimum of whichever basin it starts in.`,
      widget: { type: 'SvgDiagram', props: { svg: pesSvg }, caption: 'Two starting points, two different answers. Minimisation does not cross barriers.' },
    },
    {
      kind: 'explain',
      title: 'Steepest descent',
      body: String.raw`The simplest method: move along the force, $\mathbf d_k=-\mathbf g_k$. Either take a fixed step that is enlarged after successes and shrunk after failures (as in GROMACS), or do a **line search**: find the lowest point along $\mathbf d_k$ before turning.

With an exact line search, you stop exactly where the new gradient is perpendicular to the direction you came from. So successive steps are **at right angles**, and in a narrow, tilted valley the path zig-zags. Steepest descent is robust far from a minimum (great for relieving clashes), but painfully slow near one.`,
      widget: { type: 'DrugMinimizer', props: { surface: 'valley', methods: ['sd'] }, caption: 'Steepest descent with a line search in a narrow valley (energy = 0.1(x+y)² + 2(x−y)²). Press Step a few times and note the right-angle turns.' },
    },
    {
      kind: 'mcq',
      prompt: 'Steepest descent with an exact line search: how is each new search direction related to the previous one?',
      choices: ['Perpendicular to it', 'Parallel to it', 'At 45° to it', 'Exactly opposite to it'],
      answer: 0,
      why: String.raw`At the line minimum the energy no longer changes along the old direction, so $\mathbf g_{k+1}\cdot\mathbf d_k=0$. The new direction $-\mathbf g_{k+1}$ is therefore perpendicular to the old one, which causes the zig-zag. A parallel or opposite step would just undo or repeat the line search.`,
    },
    {
      kind: 'explain',
      title: 'Conjugate gradients',
      body: String.raw`**Conjugate gradient** (CG) adds memory: each new direction mixes the new downhill direction with the previous direction,

$$\mathbf d_k=-\mathbf g_k+\beta_k\,\mathbf d_{k-1},\qquad \beta_k=\frac{|\mathbf g_k|^2}{|\mathbf g_{k-1}|^2}\ \ \text{(Fletcher–Reeves 1964)}.$$

The directions are chosen so that later steps do not undo earlier progress. On an exactly quadratic surface in $M$ dimensions, CG with exact line searches reaches the minimum in at most $M$ steps. It needs only a few vectors of memory, so it scales to whole proteins. Real force-field surfaces are only roughly quadratic near a minimum, which is still where CG shines.`,
    },
    {
      kind: 'widget',
      title: 'Race the minimisers',
      body: 'All three methods start from the same point on the same valley. Run them, then tap elsewhere to restart from a new point. Count the steps each needs.',
      widget: { type: 'DrugMinimizer', props: { surface: 'valley', methods: ['sd', 'cg', 'lbfgs'] }, caption: 'Each step is one line search. On this 2D quadratic, CG and L-BFGS finish in 2 steps; steepest descent needs several times more (9 from the default start, up to ~30 from other points; capped at 60).' },
    },
    {
      kind: 'truefalse',
      prompt: 'On a perfectly quadratic two-dimensional energy surface, conjugate gradient with exact line searches reaches the minimum in at most two steps.',
      answer: true,
      why: String.raw`CG finishes in at most $M$ line searches on an $M$-dimensional quadratic; here $M = 2$. You can check it in the widget. On a real molecule $M = 3N$ is huge and the surface is not quadratic, so CG is run until the forces fall below a threshold.`,
    },
    {
      kind: 'explain',
      title: 'Newton and L-BFGS',
      body: String.raw`**Newton–Raphson** uses the curvature too: the step $\Delta\mathbf r=-H^{-1}\mathbf g$ jumps straight to the minimum of a quadratic. But $H$ is $3N\times3N$. For 30,000 atoms that is $(9\times10^4)^2\approx8\times10^9$ numbers, and inverting it costs $\sim(3N)^3$ operations. That's fine for a small ligand, impossible for a solvated protein.

**L-BFGS** (limited-memory BFGS; Liu & Nocedal 1989) builds an approximation to $H^{-1}$ from only the last $m$ (typically 5–20) pairs of position and gradient changes. That gives near-Newton convergence with memory proportional to $mN$. It is the default minimiser in packages such as OpenMM and an option in GROMACS and AMBER.

Typical recipe: a few hundred steepest-descent steps to remove clashes, then CG or L-BFGS until the maximum force is below a tolerance.`,
    },
    {
      kind: 'numeric',
      prompt: 'How many entries does the full Hessian matrix have for a 1,000-atom system? (Each atom has 3 coordinates.)',
      answer: 9000000,
      tolerance: 1,
      why: String.raw`$3N = 3000$ coordinates, so $H$ is $3000\times3000 = 9\times10^6$ entries (72 MB in double precision). It grows as $N^2$ and inversion as $N^3$, which is why large systems use CG or L-BFGS, which never form $H$.`,
    },
    {
      kind: 'explain',
      title: 'Local minima and conformational search',
      body: String.raw`A flexible drug has many minima: roughly three staggered choices per rotatable bond, so $3^n$ candidates for $n$ bonds. A minimiser only finds the one nearest the start. Try the widget: start near the top right and you stop in the higher (local) basin.

**Conformational search** therefore pairs a *generator* with a minimiser:
- **systematic**: rotate every bond through a grid of angles;
- **stochastic**: random torsion changes or Monte Carlo moves, each followed by minimisation;
- **simulated annealing**: heat with MD, then cool slowly;
- **distance geometry**, e.g. RDKit's ETKDG (see [3D conformers](@drug/conformers-3d)).

Then remove duplicates and keep conformers within an energy window. Bound ligands are often *not* in their global-minimum conformation (Perola & Charifson 2004), so a diverse low-energy ensemble matters more than one "best" structure.`,
      widget: { type: 'DrugMinimizer', props: { surface: 'twoMinima', methods: ['sd', 'lbfgs'] }, caption: 'Two basins: the left one is lower. Tap different start points and see which basin each run ends in.' },
    },
    {
      kind: 'numeric',
      prompt: 'A systematic search tries 3 angles for each of 6 rotatable bonds. How many starting conformers does it generate?',
      answer: 729,
      tolerance: 0,
      why: String.raw`$3^6 = 729$. With 10 bonds it would be $3^{10} = 59{,}049$. This exponential growth is why systematic search gives way to stochastic and knowledge-based generators for flexible molecules.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about energy minimisation are correct?',
      choices: [
        'It is routinely run before MD to remove steric clashes',
        'It finds the nearest local minimum, not necessarily the global one',
        'The minimised structure includes the effect of entropy and temperature',
        'Steepest descent is robust far from a minimum but converges slowly near one',
      ],
      answers: [0, 1, 3],
      why: 'A minimum is a 0 K structure on the potential-energy surface: it has no thermal motion and no entropy. Free energies need sampling (MD or Monte Carlo), not just minimisation.',
    },
    {
      kind: 'match',
      prompt: 'Match each method to its defining feature.',
      pairs: [
        ['Steepest descent', 'Moves along the force; zig-zags in narrow valleys'],
        ['Conjugate gradient', 'Mixes the new gradient with the previous direction'],
        ['Newton–Raphson', 'Uses the full Hessian; costly for big systems'],
        ['L-BFGS', 'Approximates the inverse Hessian from recent steps'],
      ],
      why: 'These trade memory against curvature information. Steepest descent uses none, CG a little implicitly, L-BFGS a compact approximation, and Newton–Raphson all of it.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Minimisation moves atoms downhill on $U(\mathbf r)$ until forces vanish. It removes clashes before MD and refines poses and conformers.
- **Steepest descent**: robust, but zig-zags. **CG**: conjugate directions, $\le M$ steps on an $M$-dimensional quadratic. **L-BFGS**: near-Newton speed with little memory. **Newton**: needs the Hessian ($\propto N^2$ memory).
- Minimisers stop at the nearest **local** minimum. Finding many low-energy conformers needs a **conformational search**.
- A minimum is a 0 K, entropy-free snapshot; thermodynamics needs sampling.`,
    },
  ],
  references: [
    { authors: 'Leach, A. R.', title: 'Molecular Modelling: Principles and Applications', year: 2001, venue: '2nd ed., Prentice Hall', detail: 'Ch. 5 (energy minimisation), Ch. 9 (conformational analysis)' },
    { authors: 'Nocedal, J., Wright, S. J.', title: 'Numerical Optimization', year: 2006, venue: '2nd ed., Springer', detail: 'Ch. 5 (conjugate gradient), Ch. 7 (L-BFGS)' },
    { authors: 'Fletcher, R., Reeves, C. M.', title: 'Function minimization by conjugate gradients', year: 1964, venue: 'Comput. J. 7, 149–154' },
    { authors: 'Liu, D. C., Nocedal, J.', title: 'On the limited memory BFGS method for large scale optimization', year: 1989, venue: 'Math. Program. 45, 503–528' },
    { authors: 'Perola, E., Charifson, P. S.', title: 'Conformational analysis of drug-like molecules bound to proteins: an extensive study of ligand reorganization upon binding', year: 2004, venue: 'J. Med. Chem. 47, 2499–2510' },
  ],
} satisfies LessonContent;
