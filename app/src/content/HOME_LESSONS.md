# Canonical "home" lesson ids (shared contract between subjects)

Each subject's curriculum (index.ts) MUST contain every id listed under it (exact spelling), placed in a
sensible unit. Other subjects may link to these via `prereqs`, `recall.link` or `[text](@subject/id)`.
You may add as many further lessons as you like; only these are guaranteed to exist for cross-links.
Do not link to ids of other subjects that are not on this list.

## math
proofs-intro, sets-functions, complex-numbers, vectors-matrices, eigenvalues, ode-first-order,
ode-linear-systems, phase-portraits, fourier-series, pde-heat-equation, pde-wave-equation, sde-intro,
groups-intro, symmetry-groups, group-actions, representations-intro, topology-intro, manifolds-intro,
tangent-spaces, lie-groups-intro, lie-algebras, hilbert-spaces, operators-spectral, operator-learning-intro

## stats
probability-basics, conditional-probability-bayes, random-variables, expectation-variance,
normal-distribution, central-limit-theorem, maximum-likelihood, confidence-intervals, hypothesis-testing,
linear-regression, logistic-regression, bayesian-inference, entropy-kl, markov-chains, mcmc,
brownian-motion, bootstrap, experimental-design, causal-inference-intro, survival-analysis

## physics
vectors-units, newtons-laws, energy-conservation, momentum, simple-harmonic-motion, waves-intro,
thermodynamics-laws, statistical-entropy, boltzmann-distribution, electrostatics, electromagnetic-waves,
lagrangian-mechanics, hamiltonian-mechanics, special-relativity-intro

## chem
atomic-structure, atomic-orbitals, electron-configuration, periodic-trends, covalent-bonding,
molecular-orbitals, intermolecular-forces, thermochemistry, chemical-equilibrium, acids-bases,
reaction-kinetics, organic-functional-groups, stereochemistry, reaction-mechanisms,
schrodinger-for-molecules, hartree-fock, basis-sets, post-hartree-fock, dft-intro,
spectroscopy-uv-ir, nmr-basics, mass-spectrometry, xray-crystallography, cryo-em, chromatography,
calorimetry-itc, spr

## bio
cell-structure, macromolecules, membranes-transport, enzymes, metabolism-overview, dna-structure,
central-dogma, transcription, translation, protein-structure, gene-regulation, cell-signaling,
cell-cycle, mendelian-genetics, evolution-natural-selection, immune-system-overview, pcr-sequencing,
crispr, omics-bioinformatics

## ml
ml-framing, gradient-descent, generalization-bias-variance, neural-networks-intro, backpropagation,
cnns, attention-transformers, gnns, equivariant-networks, latent-variable-models, vaes, gans,
normalizing-flows, autoregressive-models, energy-based-models, score-matching, diffusion-models,
flow-matching, mdp-intro, dynamic-programming-rl, td-learning, q-learning, policy-gradients, ppo,
rlhf-dpo, offline-rl

## med
pharmacokinetics, pharmacodynamics, drug-metabolism-cyp, drug-receptor-interactions, toxicology-basics,
cardiac-physiology, clinical-trial-phases, drug-regulation-approval, pharmacovigilance,
evidence-based-medicine

## quantum
why-quantum, qubits, bloch-sphere, measurement, superposition-interference, entanglement,
quantum-gates, quantum-circuits, schrodinger-equation, particle-in-a-box, harmonic-oscillator-qm,
hydrogen-atom, spin, many-electron-systems, second-quantization, jordan-wigner, vqe, phase-estimation,
nisq-noise, quantum-chemistry-on-qc

## cs
how-computers-work, programming-basics, recursion, big-o, arrays-linked-lists, stacks-queues,
hashing, trees-bst, balanced-trees, heaps, graphs-intro, bfs-dfs, sorting-basics, merge-quick-sort,
binary-search, divide-and-conquer, greedy-algorithms, dynamic-programming, shortest-paths,
minimum-spanning-trees, union-find, p-vs-np, databases-intro

## drug
what-is-a-drug, drug-discovery-pipeline, history-of-drug-discovery, wet-lab-assays, binding-affinity,
adme-tox, molecular-representations, fingerprints-similarity, drug-likeness, qsar, virtual-screening,
force-fields, molecular-dynamics, docking, free-energy-methods, qm-mm, protein-structure-prediction,
alphafold, protein-language-models, molecular-property-prediction, generative-molecular-design,
protein-design, retrosynthesis, quantum-computing-drug-discovery

## robotics
what-is-a-robot, degrees-of-freedom, rotation-matrices, quaternions, homogeneous-transforms, twists-screws,
forward-kinematics, dh-parameters, inverse-kinematics, jacobians, singularities, lagrangian-robot-dynamics,
feedback-intro, pid-control, lqr, mpc, lyapunov-stability, bayes-filter, kalman-filter, extended-kalman-filter,
particle-filter, slam, pose-graph-slam, pinhole-camera-model, multi-view-geometry, point-clouds-icp,
planning-problem, prm, motion-planning-rrt, trajectory-optimization, grasping-closure, behavior-cloning,
sim-to-real, diffusion-policy, vision-language-action-models, safe-control-cbf
