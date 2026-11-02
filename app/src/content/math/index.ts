import type { Reference, Subject } from '../types';

const strogatz: Reference = { authors: 'S. H. Strogatz', title: 'Nonlinear Dynamics and Chaos', year: 2015, venue: '2nd ed., Westview Press / CRC' };
const hsd: Reference = { authors: 'M. W. Hirsch, S. Smale, R. L. Devaney', title: 'Differential Equations, Dynamical Systems, and an Introduction to Chaos', year: 2013, venue: '3rd ed., Academic Press' };
const dummitFoote: Reference = { authors: 'D. S. Dummit, R. M. Foote', title: 'Abstract Algebra', year: 2004, venue: '3rd ed., Wiley' };
const artin: Reference = { authors: 'M. Artin', title: 'Algebra', year: 2011, venue: '2nd ed., Pearson' };
const hall: Reference = { authors: 'B. C. Hall', title: 'Lie Groups, Lie Algebras, and Representations: An Elementary Introduction', year: 2015, venue: '2nd ed., Springer GTM 222' };
const kreyszig: Reference = { authors: 'E. Kreyszig', title: 'Introductory Functional Analysis with Applications', year: 1978, venue: 'Wiley' };
const evans: Reference = { authors: 'L. C. Evans', title: 'Partial Differential Equations', year: 2010, venue: '2nd ed., AMS Graduate Studies in Mathematics 19' };

export default {
  id: 'math',
  name: 'Mathematics',
  emoji: '∑',
  color: '#1cb0f6',
  tagline: 'From proofs to manifolds to neural operators — the language of science.',
  description: String.raw`A path from "how do I read a proof?" to the mathematics used at the research frontier: linear algebra, analysis, differential equations, symmetry and group theory, topology and geometry, Lie theory, functional analysis and **operator learning** (neural networks that learn whole solution maps of PDEs).

You only need high-school algebra and a little calculus. Every symbol is introduced before it is used, and every idea comes with a picture you can play with. By the end you should be able to read the mathematical parts of physics, chemistry and machine-learning papers — and write simple proofs of your own.`,
  units: [
    {
      id: 'logic-proof',
      title: 'Logic & proof',
      summary: 'How mathematicians state things exactly and convince each other beyond doubt.',
      lessons: [
        { id: 'logic-statements', title: 'Statements, connectives & quantifiers', summary: 'And, or, not, implies, "for all", "there exists" — and how to negate them correctly.' },
        { id: 'proofs-intro', title: 'What is a proof?', summary: 'Direct proof, the structure of an argument, and why examples are not proofs.', prereqs: ['math/logic-statements'] },
        { id: 'contradiction-contrapositive', title: 'Contradiction & contrapositive', summary: 'Proving things indirectly: √2 is irrational and there are infinitely many primes.', prereqs: ['math/proofs-intro'] },
        { id: 'induction', title: 'Mathematical induction', summary: 'Dominoes: proving a statement for every natural number at once.', prereqs: ['math/proofs-intro'] },
        { id: 'sets-functions', title: 'Sets & functions', summary: 'The basic containers of mathematics; injective, surjective and bijective maps.', prereqs: ['math/logic-statements'] },
        { id: 'relations-equivalence', title: 'Relations & equivalence classes', summary: 'Gluing things together that "count as the same" — the idea behind quotients everywhere.', prereqs: ['math/sets-functions'] },
        { id: 'cardinality-infinity', title: 'Countable & uncountable infinity', summary: 'Cantor’s diagonal argument: some infinities are bigger than others.', prereqs: ['math/sets-functions'] },
      ],
      references: [
        { authors: 'D. J. Velleman', title: 'How to Prove It: A Structured Approach', year: 2019, venue: '3rd ed., Cambridge University Press', detail: 'Ch. 1–4, 6–8' },
        { authors: 'R. Hammack', title: 'Book of Proof', year: 2018, venue: '3rd ed., self-published (free online)', url: 'https://richardhammack.github.io/BookOfProof/' },
      ],
    },
    {
      id: 'linear-algebra',
      title: 'Linear algebra',
      summary: 'Vectors, matrices and the geometry of linear maps — the workhorse of all of science.',
      lessons: [
        { id: 'vectors-matrices', title: 'Vectors & matrices', summary: 'Arrows, lists of numbers, and matrices as machines that transform space.' },
        { id: 'linear-maps', title: 'Linear maps & bases', summary: 'Span, linear independence, bases, and a matrix as "where the basis vectors go".', prereqs: ['math/vectors-matrices'] },
        { id: 'determinants', title: 'Determinants', summary: 'The factor by which a matrix scales area/volume — and why det = 0 means "squashed flat".', prereqs: ['math/linear-maps'] },
        { id: 'eigenvalues', title: 'Eigenvalues & eigenvectors', summary: 'The special directions a matrix only stretches — the key to dynamics, vibrations and PCA.', prereqs: ['math/determinants'] },
        { id: 'inner-products-orthogonality', title: 'Inner products & orthogonality', summary: 'Lengths, angles, projections and the Gram–Schmidt process.', prereqs: ['math/linear-maps'] },
        { id: 'diagonalization-svd', title: 'Diagonalisation, spectral theorem & SVD', summary: 'Every matrix is a rotation, a stretch and another rotation.', prereqs: ['math/eigenvalues', 'math/inner-products-orthogonality'] },
        { id: 'abstract-vector-spaces', title: 'Abstract vector spaces', summary: 'Functions and polynomials are vectors too — the bridge to Fourier analysis and functional analysis.', prereqs: ['math/linear-maps'] },
      ],
      references: [
        { authors: 'S. Axler', title: 'Linear Algebra Done Right', year: 2024, venue: '4th ed., Springer (open access)', url: 'https://linear.axler.net/' },
        { authors: 'G. Strang', title: 'Introduction to Linear Algebra', year: 2016, venue: '5th ed., Wellesley-Cambridge Press' },
        { authors: '3Blue1Brown (G. Sanderson)', title: 'Essence of Linear Algebra (video series)', year: 2016, url: 'https://www.3blue1brown.com/topics/linear-algebra' },
      ],
    },
    {
      id: 'real-analysis',
      title: 'Real analysis',
      summary: 'Making calculus rigorous: limits, continuity and convergence with ε and δ.',
      lessons: [
        { id: 'real-numbers-completeness', title: 'The real numbers & completeness', summary: 'Why the reals have no gaps, and the least-upper-bound property.', prereqs: ['math/proofs-intro'] },
        { id: 'sequences-limits', title: 'Sequences & limits', summary: 'The ε–N definition of convergence, made visual.', prereqs: ['math/real-numbers-completeness'] },
        { id: 'series-convergence', title: 'Series & convergence tests', summary: 'When does an infinite sum add up to a finite number?', prereqs: ['math/sequences-limits'] },
        { id: 'continuity-epsilon-delta', title: 'Continuity (ε–δ)', summary: 'A precise version of "no jumps", and the intermediate value theorem.', prereqs: ['math/sequences-limits'] },
        { id: 'derivative-rigorous', title: 'Derivatives & the mean value theorem', summary: 'Differentiability, Taylor’s theorem with remainder.', prereqs: ['math/continuity-epsilon-delta'] },
        { id: 'riemann-integral', title: 'The Riemann integral', summary: 'Area as a limit of rectangles, and the fundamental theorem of calculus.', prereqs: ['math/continuity-epsilon-delta'] },
        { id: 'uniform-convergence', title: 'Uniform convergence', summary: 'When a limit of functions keeps continuity, and when it does not.', prereqs: ['math/series-convergence', 'math/continuity-epsilon-delta'] },
        { id: 'metric-spaces', title: 'Metric spaces', summary: 'Distance in general: the setting for analysis on functions, shapes and data.', prereqs: ['math/sequences-limits'] },
      ],
      references: [
        { authors: 'S. Abbott', title: 'Understanding Analysis', year: 2015, venue: '2nd ed., Springer UTM', detail: 'Ch. 1–7' },
        { authors: 'W. Rudin', title: 'Principles of Mathematical Analysis', year: 1976, venue: '3rd ed., McGraw-Hill', detail: 'Ch. 1–7' },
      ],
    },
    {
      id: 'odes',
      title: 'Ordinary differential equations',
      summary: 'Rules of change: from exponential growth to the geometry of phase portraits.',
      lessons: [
        { id: 'ode-first-order', title: 'First-order ODEs', summary: 'Slope fields, separable and linear equations, equilibria and Euler’s method.' },
        { id: 'ode-linear-systems', title: 'Linear systems & eigenvalues', summary: 'Solving x′ = Ax with eigenvectors: straight-line solutions, saddles and spirals.', prereqs: ['math/ode-first-order', 'math/eigenvalues'] },
        { id: 'phase-portraits', title: 'Phase portraits', summary: 'The map of all futures: fixed points, nullclines and the trace–determinant plane.', prereqs: ['math/ode-linear-systems'] },
        { id: 'stability-linearization', title: 'Stability & linearisation', summary: 'Jacobians, Hartman–Grobman, and Lyapunov functions.', prereqs: ['math/phase-portraits'] },
      ],
      references: [
        { ...strogatz, detail: 'Ch. 2 (flows on the line), Ch. 5–6 (linear systems, phase plane)' },
        { ...hsd, detail: 'Ch. 1–4, 8–9' },
        { authors: 'W. E. Boyce, R. C. DiPrima, D. B. Meade', title: 'Elementary Differential Equations and Boundary Value Problems', year: 2017, venue: '11th ed., Wiley', detail: 'Ch. 2, 7, 9' },
      ],
    },
    {
      id: 'nonlinear-dynamics',
      title: 'Nonlinear dynamics, numerics & noise',
      summary: 'Bifurcations, limit cycles, chaos, numerical solvers and randomness in differential equations.',
      lessons: [
        { id: 'existence-uniqueness', title: 'Existence & uniqueness', summary: 'Picard–Lindelöf: when an ODE has exactly one solution, and what goes wrong otherwise.', prereqs: ['math/ode-first-order', 'math/metric-spaces'] },
        { id: 'bifurcations', title: 'Bifurcations', summary: 'Saddle-node, pitchfork and Hopf: how fixed points are born and die as a parameter changes.', prereqs: ['math/stability-linearization'] },
        { id: 'limit-cycles', title: 'Limit cycles & oscillators', summary: 'Self-sustained oscillations (van der Pol) and the Poincaré–Bendixson theorem.', prereqs: ['math/phase-portraits'] },
        { id: 'chaos-lorenz', title: 'Chaos & the Lorenz system', summary: 'Sensitive dependence, strange attractors and Lyapunov exponents.', prereqs: ['math/limit-cycles'] },
        { id: 'numerical-ode', title: 'Numerical methods for ODEs', summary: 'Euler, Runge–Kutta, error order, stiffness and implicit methods.', prereqs: ['math/ode-first-order'] },
        { id: 'sde-intro', title: 'Stochastic differential equations', summary: 'Adding noise: Brownian motion, dX = μ dt + σ dW, and Euler–Maruyama simulation.', prereqs: ['math/numerical-ode'] },
        { id: 'ito-calculus', title: 'Itô calculus & Fokker–Planck', summary: 'Itô’s lemma and the PDE that evolves probability densities.', prereqs: ['math/sde-intro'] },
      ],
      references: [
        { ...strogatz, detail: 'Ch. 3, 7–9' },
        { authors: 'E. Hairer, S. P. Nørsett, G. Wanner', title: 'Solving Ordinary Differential Equations I: Nonstiff Problems', year: 1993, venue: '2nd ed., Springer' },
        { authors: 'B. Øksendal', title: 'Stochastic Differential Equations: An Introduction with Applications', year: 2003, venue: '6th ed., Springer' },
        { authors: 'D. J. Higham', title: 'An algorithmic introduction to numerical simulation of stochastic differential equations', year: 2001, venue: 'SIAM Review 43(3), 525–546' },
      ],
    },
    {
      id: 'fourier-pde',
      title: 'Fourier analysis & PDEs',
      summary: 'Waves, heat and potentials: equations for fields that vary in space and time.',
      lessons: [
        { id: 'fourier-series', title: 'Fourier series', summary: 'Any reasonable periodic signal is a sum of sines and cosines.', prereqs: ['math/abstract-vector-spaces'] },
        { id: 'fourier-transform', title: 'The Fourier transform', summary: 'Frequencies of non-periodic signals; convolution becomes multiplication.', prereqs: ['math/fourier-series'] },
        { id: 'pde-intro-classification', title: 'What is a PDE?', summary: 'Partial derivatives, boundary/initial conditions, and elliptic/parabolic/hyperbolic types.', prereqs: ['math/ode-first-order'] },
        { id: 'pde-heat-equation', title: 'The heat equation', summary: 'Diffusion smooths everything out: separation of variables and Fourier modes decaying.', prereqs: ['math/pde-intro-classification', 'math/fourier-series'] },
        { id: 'pde-wave-equation', title: 'The wave equation', summary: 'd’Alembert’s travelling waves, standing waves and finite speed of propagation.', prereqs: ['math/pde-intro-classification'] },
        { id: 'laplace-equation', title: 'Laplace & Poisson equations', summary: 'Steady states, harmonic functions and the maximum principle.', prereqs: ['math/pde-heat-equation'] },
        { id: 'greens-functions', title: 'Green’s functions & fundamental solutions', summary: 'Solve once for a point source, then add up — the template for neural operators.', prereqs: ['math/laplace-equation', 'math/fourier-transform'] },
      ],
      references: [
        { ...evans, detail: 'Ch. 2 (four important linear PDE)' },
        { authors: 'W. A. Strauss', title: 'Partial Differential Equations: An Introduction', year: 2008, venue: '2nd ed., Wiley' },
        { authors: 'E. M. Stein, R. Shakarchi', title: 'Fourier Analysis: An Introduction', year: 2003, venue: 'Princeton University Press', detail: 'Ch. 1–5' },
      ],
    },
    {
      id: 'complex-analysis',
      title: 'Complex analysis',
      summary: 'Calculus with complex numbers — rigid, beautiful, and surprisingly useful.',
      lessons: [
        { id: 'complex-numbers', title: 'Complex numbers', summary: 'Rotations and scalings of the plane; Euler’s formula e^{iθ} = cos θ + i sin θ.' },
        { id: 'complex-functions', title: 'Complex functions as maps', summary: 'Visualising f(z) by how it deforms grids and colours the plane.', prereqs: ['math/complex-numbers'] },
        { id: 'holomorphic-functions', title: 'Holomorphic functions', summary: 'Complex differentiability and the Cauchy–Riemann equations.', prereqs: ['math/complex-functions', 'math/derivative-rigorous'] },
        { id: 'contour-integrals', title: 'Contour integrals & Cauchy’s theorem', summary: 'Integrals around loops vanish — and the Cauchy integral formula.', prereqs: ['math/holomorphic-functions'] },
        { id: 'residues', title: 'Residues', summary: 'Computing hard real integrals by walking around poles.', prereqs: ['math/contour-integrals'] },
        { id: 'conformal-maps', title: 'Conformal maps', summary: 'Angle-preserving maps, Möbius transformations and applications to flows.', prereqs: ['math/holomorphic-functions'] },
      ],
      references: [
        { authors: 'T. Needham', title: 'Visual Complex Analysis', year: 1997, venue: 'Oxford University Press' },
        { authors: 'E. M. Stein, R. Shakarchi', title: 'Complex Analysis', year: 2003, venue: 'Princeton University Press', detail: 'Ch. 1–3, 8' },
      ],
    },
    {
      id: 'groups-symmetry',
      title: 'Groups & symmetry',
      summary: 'The algebra of symmetry: what all "undo-able transformations" have in common.',
      lessons: [
        { id: 'groups-intro', title: 'What is a group?', summary: 'Four axioms that capture clocks, rotations, shuffles and invertible matrices.', prereqs: ['math/sets-functions'] },
        { id: 'symmetry-groups', title: 'Symmetry groups', summary: 'The dihedral groups, Cayley tables and why order matters.', prereqs: ['math/groups-intro'] },
        { id: 'subgroups-lagrange', title: 'Subgroups, cosets & Lagrange’s theorem', summary: 'Groups inside groups, and why their sizes must divide.', prereqs: ['math/symmetry-groups'] },
        { id: 'group-actions', title: 'Group actions, orbits & counting', summary: 'Groups moving things around: orbit–stabiliser and Burnside’s counting lemma.', prereqs: ['math/subgroups-lagrange'] },
      ],
      references: [
        { ...dummitFoote, detail: 'Ch. 1–4' },
        { ...artin, detail: 'Ch. 2, 6' },
        { authors: 'N. Carter', title: 'Visual Group Theory', year: 2009, venue: 'Mathematical Association of America' },
      ],
    },
    {
      id: 'abstract-algebra',
      title: 'Abstract algebra & representations',
      summary: 'Homomorphisms, quotients, rings and fields, and groups acting by matrices.',
      lessons: [
        { id: 'homomorphisms-isomorphisms', title: 'Homomorphisms & isomorphisms', summary: 'Structure-preserving maps; when two groups are "the same".', prereqs: ['math/group-actions'] },
        { id: 'normal-subgroups-quotients', title: 'Normal subgroups & quotient groups', summary: 'Dividing a group by a subgroup, and the first isomorphism theorem.', prereqs: ['math/homomorphisms-isomorphisms', 'math/relations-equivalence'] },
        { id: 'permutation-groups', title: 'Permutation groups', summary: 'Cycles, signs, the symmetric and alternating groups.', prereqs: ['math/groups-intro'] },
        { id: 'rings-fields', title: 'Rings & fields', summary: 'Two operations at once: integers, polynomials, modular arithmetic and finite fields.', prereqs: ['math/normal-subgroups-quotients'] },
        { id: 'galois-intro', title: 'A glimpse of Galois theory', summary: 'Why there is no formula for quintic equations.', prereqs: ['math/rings-fields', 'math/permutation-groups'] },
        { id: 'representations-intro', title: 'Representation theory', summary: 'Groups acting by matrices: irreducible representations and Schur’s lemma.', prereqs: ['math/group-actions', 'math/eigenvalues'] },
        { id: 'characters', title: 'Characters', summary: 'The trace trick: character tables and decomposing representations.', prereqs: ['math/representations-intro'] },
      ],
      references: [
        { ...dummitFoote, detail: 'Ch. 3, 7–9, 14, 18–19' },
        { ...artin, detail: 'Ch. 7, 10–11, 16' },
        { authors: 'W. Fulton, J. Harris', title: 'Representation Theory: A First Course', year: 1991, venue: 'Springer GTM 129', detail: 'Ch. 1–3' },
      ],
    },
    {
      id: 'topology',
      title: 'Topology',
      summary: 'Geometry without distances: what survives stretching and bending.',
      lessons: [
        { id: 'topology-intro', title: 'What is topology?', summary: 'Coffee mugs and doughnuts: properties invariant under continuous deformation.', prereqs: ['math/sets-functions'] },
        { id: 'open-sets-continuity', title: 'Open sets & continuity', summary: 'Topological spaces and continuity defined without ε and δ.', prereqs: ['math/topology-intro', 'math/metric-spaces'] },
        { id: 'compactness-connectedness', title: 'Compactness & connectedness', summary: 'The two properties behind the extreme value and intermediate value theorems.', prereqs: ['math/open-sets-continuity'] },
        { id: 'quotient-spaces', title: 'Gluing: quotient spaces', summary: 'Building tori, Möbius strips and Klein bottles from squares.', prereqs: ['math/open-sets-continuity', 'math/relations-equivalence'] },
        { id: 'fundamental-group', title: 'Homotopy & the fundamental group', summary: 'Loops up to deformation — a group that detects holes.', prereqs: ['math/quotient-spaces', 'math/groups-intro'] },
        { id: 'euler-characteristic-homology', title: 'Euler characteristic & homology', summary: 'V − E + F, and counting holes in every dimension.', prereqs: ['math/fundamental-group'] },
      ],
      references: [
        { authors: 'J. R. Munkres', title: 'Topology', year: 2000, venue: '2nd ed., Prentice Hall', detail: 'Ch. 2–3, 9' },
        { authors: 'A. Hatcher', title: 'Algebraic Topology', year: 2002, venue: 'Cambridge University Press (free online)', detail: 'Ch. 0–2', url: 'https://pi.math.cornell.edu/~hatcher/AT/ATpage.html' },
      ],
    },
    {
      id: 'manifolds-geometry',
      title: 'Manifolds & differential geometry',
      summary: 'Curved spaces that look flat up close — the stage for physics and for data.',
      lessons: [
        { id: 'manifolds-intro', title: 'Manifolds', summary: 'Charts and atlases: spheres, tori and spacetime as spaces locally like ℝⁿ.', prereqs: ['math/topology-intro', 'math/derivative-rigorous'] },
        { id: 'tangent-spaces', title: 'Tangent spaces', summary: 'Velocity vectors on a curved space, and the derivative of a smooth map.', prereqs: ['math/manifolds-intro', 'math/linear-maps'] },
        { id: 'vector-fields-flows', title: 'Vector fields & flows', summary: 'ODEs on manifolds, and the Lie bracket of two vector fields.', prereqs: ['math/tangent-spaces', 'math/phase-portraits'] },
        { id: 'differential-forms', title: 'Differential forms & Stokes’ theorem', summary: 'One theorem that unifies the fundamental theorem of calculus, Green, Gauss and Stokes.', prereqs: ['math/tangent-spaces'] },
        { id: 'riemannian-metrics', title: 'Riemannian metrics & geodesics', summary: 'Measuring lengths on curved spaces; straightest possible paths.', prereqs: ['math/tangent-spaces', 'math/inner-products-orthogonality'] },
        { id: 'curvature', title: 'Curvature', summary: 'Gauss’s Theorema Egregium, and why maps of the Earth must distort.', prereqs: ['math/riemannian-metrics'] },
      ],
      references: [
        { authors: 'L. W. Tu', title: 'An Introduction to Manifolds', year: 2011, venue: '2nd ed., Springer Universitext' },
        { authors: 'J. M. Lee', title: 'Introduction to Smooth Manifolds', year: 2013, venue: '2nd ed., Springer GTM 218' },
        { authors: 'M. P. do Carmo', title: 'Differential Geometry of Curves and Surfaces', year: 2016, venue: '2nd ed., Dover' },
      ],
    },
    {
      id: 'lie-theory',
      title: 'Lie groups & Lie algebras',
      summary: 'Continuous symmetry: rotations, the matrix exponential, and infinitesimal generators.',
      lessons: [
        { id: 'lie-groups-intro', title: 'Lie groups', summary: 'Groups that are also smooth manifolds: SO(2), SO(3), SU(2), GL(n).', prereqs: ['math/symmetry-groups', 'math/manifolds-intro'] },
        { id: 'matrix-exponential', title: 'The matrix exponential', summary: 'exp turns an infinitesimal motion into a finite one — and solves x′ = Ax.', prereqs: ['math/ode-linear-systems', 'math/lie-groups-intro'] },
        { id: 'lie-algebras', title: 'Lie algebras', summary: 'The tangent space at the identity, with the commutator bracket [X, Y] = XY − YX.', prereqs: ['math/matrix-exponential', 'math/tangent-spaces'] },
        { id: 'so3-su2', title: 'Rotations: SO(3) and SU(2)', summary: 'Why a 360° turn is not always the identity — the double cover and spin.', prereqs: ['math/lie-algebras'] },
        { id: 'lie-representations', title: 'Representations of Lie groups & algebras', summary: 'Representations of sl(2) and su(2): ladder operators and weights.', prereqs: ['math/so3-su2', 'math/representations-intro'] },
        { id: 'noether-symmetry', title: 'Symmetry & conservation laws', summary: 'Noether’s theorem: continuous symmetries give conserved quantities.', prereqs: ['math/lie-algebras'] },
      ],
      references: [
        { ...hall, detail: 'Ch. 1–4' },
        { authors: 'J. Stillwell', title: 'Naive Lie Theory', year: 2008, venue: 'Springer UTM' },
      ],
    },
    {
      id: 'functional-analysis',
      title: 'Functional analysis',
      summary: 'Linear algebra in infinitely many dimensions: spaces of functions and operators on them.',
      lessons: [
        { id: 'normed-banach-spaces', title: 'Normed & Banach spaces', summary: 'Measuring the size of functions; completeness; Lᵖ spaces.', prereqs: ['math/metric-spaces', 'math/abstract-vector-spaces'] },
        { id: 'hilbert-spaces', title: 'Hilbert spaces', summary: 'Infinite-dimensional spaces with angles: orthonormal bases and Fourier series revisited.', prereqs: ['math/normed-banach-spaces', 'math/inner-products-orthogonality'] },
        { id: 'bounded-operators', title: 'Bounded linear operators', summary: 'Continuity = boundedness; operator norm; integral operators and kernels.', prereqs: ['math/normed-banach-spaces'] },
        { id: 'operators-spectral', title: 'Spectral theory', summary: 'Eigenvalues in infinite dimensions: compact self-adjoint operators and the spectral theorem.', prereqs: ['math/hilbert-spaces', 'math/bounded-operators', 'math/diagonalization-svd'] },
        { id: 'sobolev-spaces', title: 'Sobolev spaces', summary: 'Weak derivatives and the right spaces for PDE solutions.', prereqs: ['math/hilbert-spaces'] },
        { id: 'weak-solutions', title: 'Weak solutions & the Lax–Milgram theorem', summary: 'Solving PDEs by projection — the maths behind finite elements.', prereqs: ['math/sobolev-spaces', 'math/laplace-equation'] },
      ],
      references: [
        { ...kreyszig, detail: 'Ch. 2–4, 8–9' },
        { authors: 'H. Brezis', title: 'Functional Analysis, Sobolev Spaces and Partial Differential Equations', year: 2011, venue: 'Springer Universitext' },
        { ...evans, detail: 'Ch. 5–6 (Sobolev spaces, elliptic PDE)' },
      ],
    },
    {
      id: 'operator-learning',
      title: 'Operator learning',
      summary: 'Neural networks that learn maps between functions — fast surrogates for PDE solvers.',
      lessons: [
        { id: 'operator-learning-intro', title: 'Learning operators, not functions', summary: 'Why learn the map "input field → solution field", and what discretisation-invariance means.', prereqs: ['math/bounded-operators', 'math/pde-heat-equation'] },
        { id: 'operator-universal-approximation', title: 'Universal approximation for operators', summary: 'The Chen & Chen theorem: branch and trunk networks can approximate any continuous operator.', prereqs: ['math/operator-learning-intro'] },
        { id: 'deeponet', title: 'DeepONet', summary: 'Branch net encodes the input function, trunk net the query point; output is their dot product.', prereqs: ['math/operator-universal-approximation'] },
        { id: 'neural-operator-framework', title: 'Neural operators: kernel integral layers', summary: 'Layers that act on functions, inspired by Green’s functions.', prereqs: ['math/operator-learning-intro', 'math/greens-functions'] },
        { id: 'fourier-neural-operator', title: 'Fourier Neural Operator (FNO)', summary: 'Do the kernel integral in Fourier space: fast, resolution-independent layers.', prereqs: ['math/neural-operator-framework', 'math/fourier-transform'] },
        { id: 'operator-learning-practice', title: 'Operator learning in practice', summary: 'Data, losses, physics-informed training, error vs. resolution, and current limits.', prereqs: ['math/deeponet', 'math/fourier-neural-operator'] },
      ],
      references: [
        { authors: 'N. Kovachki, Z. Li, B. Liu, K. Azizzadenesheli, K. Bhattacharya, A. Stuart, A. Anandkumar', title: 'Neural Operator: Learning Maps Between Function Spaces with Applications to PDEs', year: 2023, venue: 'Journal of Machine Learning Research 24(89), 1–97' },
        { authors: 'L. Lu, P. Jin, G. Pang, Z. Zhang, G. E. Karniadakis', title: 'Learning nonlinear operators via DeepONet based on the universal approximation theorem of operators', year: 2021, venue: 'Nature Machine Intelligence 3, 218–229' },
        { authors: 'Z. Li, N. Kovachki, K. Azizzadenesheli, B. Liu, K. Bhattacharya, A. Stuart, A. Anandkumar', title: 'Fourier Neural Operator for Parametric Partial Differential Equations', year: 2021, venue: 'ICLR 2021', url: 'https://arxiv.org/abs/2010.08895' },
        { authors: 'T. Chen, H. Chen', title: 'Universal approximation to nonlinear operators by neural networks with arbitrary activation functions and its application to dynamical systems', year: 1995, venue: 'IEEE Transactions on Neural Networks 6(4), 911–917' },
      ],
    },
  ],
} satisfies Subject;
