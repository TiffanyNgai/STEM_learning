import type { Reference, Subject } from '../types';

const openstax = (detail: string): Reference => ({
  authors: 'P. Flowers, K. Theopold, R. Langley, W. R. Robinson', title: 'Chemistry 2e', year: 2019, venue: 'OpenStax',
  detail, url: 'https://openstax.org/details/books/chemistry-2e',
});
const atkins = (detail: string): Reference => ({
  authors: 'P. Atkins, J. de Paula, J. Keeler', title: "Atkins' Physical Chemistry", year: 2018, venue: '11th ed., Oxford University Press', detail,
});
const clayden = (detail: string): Reference => ({
  authors: 'J. Clayden, N. Greeves, S. Warren', title: 'Organic Chemistry', year: 2012, venue: '2nd ed., Oxford University Press', detail,
});
const housecroft = (detail: string): Reference => ({
  authors: 'C. E. Housecroft, A. G. Sharpe', title: 'Inorganic Chemistry', year: 2018, venue: '5th ed., Pearson', detail,
});
const szabo = (detail: string): Reference => ({
  authors: 'A. Szabo, N. S. Ostlund', title: 'Modern Quantum Chemistry: Introduction to Advanced Electronic Structure Theory', year: 1996, venue: 'Dover', detail,
});
const jensen = (detail: string): Reference => ({
  authors: 'F. Jensen', title: 'Introduction to Computational Chemistry', year: 2017, venue: '3rd ed., Wiley', detail,
});
const pavia = (detail: string): Reference => ({
  authors: 'D. L. Pavia, G. M. Lampman, G. S. Kriz, J. R. Vyvyan', title: 'Introduction to Spectroscopy', year: 2015, venue: '5th ed., Cengage', detail,
});
const skoog = (detail: string): Reference => ({
  authors: 'D. A. Skoog, F. J. Holler, S. R. Crouch', title: 'Principles of Instrumental Analysis', year: 2017, venue: '7th ed., Cengage', detail,
});

export default {
  id: 'chem',
  name: 'Chemistry',
  emoji: '⚗️',
  color: '#2b70c9',
  tagline: 'From atoms to drug targets: the science of what things are made of and how they change.',
  description: String.raw`A complete chemistry major, starting from zero. You will learn why atoms bond, how reactions go and how far,
how organic molecules are built, and how quantum mechanics lets a computer predict chemistry.

The final units cover the **structural and analytical techniques** used in modern drug discovery — X-ray crystallography,
NMR, cryo-EM, mass spectrometry, chromatography, calorimetry and SPR — so you can read a methods section with confidence.`,
  units: [
    {
      id: 'foundations', title: 'Foundations: matter, measurement & the mole',
      summary: 'What chemists count, how they count it, and how to balance the books of a reaction.',
      references: [openstax('Ch. 1, 3, 4')],
      lessons: [
        { id: 'matter-and-measurement', title: 'Matter & measurement', summary: 'Elements, compounds and mixtures; SI units, significant figures and dimensional analysis.', prereqs: ['physics/vectors-units'] },
        { id: 'the-mole', title: 'The mole', summary: 'Avogadro’s number as a counting unit, and molar mass as the bridge between grams and particles.', prereqs: ['chem/matter-and-measurement'] },
        { id: 'chemical-formulas', title: 'Formulas & composition', summary: 'Empirical vs molecular formulas and how to get them from percent composition.', prereqs: ['chem/the-mole'] },
        { id: 'chemical-equations', title: 'Balancing equations', summary: 'Conservation of atoms turns a reaction into a balanced equation.', prereqs: ['chem/chemical-formulas'] },
        { id: 'stoichiometry', title: 'Stoichiometry', summary: 'Mole ratios, limiting reagents and percent yield.', prereqs: ['chem/chemical-equations'] },
        { id: 'reactions-in-solution', title: 'Reactions in solution', summary: 'Molarity, dilution, precipitation and titration calculations.', prereqs: ['chem/stoichiometry'] },
      ],
    },
    {
      id: 'atoms', title: 'Atoms & the periodic table',
      summary: 'What is inside an atom, where its electrons live, and why the periodic table has the shape it does.',
      references: [openstax('Ch. 2, 6'), atkins('Topics 8A–8C (atomic structure and spectra)'), housecroft('Ch. 1')],
      lessons: [
        { id: 'atomic-structure', title: 'Inside the atom', summary: 'Protons, neutrons and electrons; atomic number, mass number and isotopes.' },
        { id: 'light-and-spectra', title: 'Light, photons & atomic spectra', summary: 'Why atoms emit sharp colours: quantized energy levels and E = hν.', prereqs: ['chem/atomic-structure', 'physics/electromagnetic-waves'] },
        { id: 'atomic-orbitals', title: 'Atomic orbitals', summary: 'Electrons as standing waves: quantum numbers, orbital shapes, nodes and probability clouds.', prereqs: ['chem/light-and-spectra', 'quantum/hydrogen-atom'] },
        { id: 'electron-configuration', title: 'Electron configuration', summary: 'Filling orbitals with the Aufbau, Pauli and Hund rules; core vs valence electrons.', prereqs: ['chem/atomic-orbitals'] },
        { id: 'periodic-trends', title: 'Periodic trends', summary: 'Effective nuclear charge explains atomic radius, ionization energy and electronegativity.', prereqs: ['chem/electron-configuration'] },
        { id: 'nuclear-chemistry', title: 'Nuclear chemistry', summary: 'Radioactive decay, half-lives and isotopes in medicine (PET, radiolabels).', prereqs: ['chem/atomic-structure'] },
      ],
    },
    {
      id: 'bonding', title: 'Chemical bonding & molecular shape',
      summary: 'Why atoms stick together, how to draw molecules, and how quantum mechanics explains bonds.',
      references: [openstax('Ch. 7–8'), atkins('Topics 9A–9E (molecular structure)'), housecroft('Ch. 2, 5')],
      lessons: [
        { id: 'ionic-bonding', title: 'Ionic bonding', summary: 'Electron transfer, lattice energy and the Born–Haber cycle.', prereqs: ['chem/periodic-trends'] },
        { id: 'covalent-bonding', title: 'Covalent bonding', summary: 'Shared electron pairs, bond polarity, bond order, length and energy.', prereqs: ['chem/periodic-trends'] },
        { id: 'lewis-structures', title: 'Lewis structures & resonance', summary: 'Drawing valence electrons, formal charge, and resonance hybrids.', prereqs: ['chem/covalent-bonding'] },
        { id: 'vsepr', title: 'VSEPR & molecular shape', summary: 'Electron-pair repulsion predicts 3D geometry and molecular polarity.', prereqs: ['chem/lewis-structures'] },
        { id: 'hybridization', title: 'Valence bond theory & hybridization', summary: 'sp, sp², sp³ orbitals, sigma and pi bonds.', prereqs: ['chem/vsepr', 'chem/atomic-orbitals'] },
        { id: 'molecular-orbitals', title: 'Molecular orbital theory', summary: 'LCAO, bonding/antibonding orbitals, MO diagrams, and why O₂ is magnetic.', prereqs: ['chem/hybridization'] },
        { id: 'metallic-bonding', title: 'Metals & band theory', summary: 'From MOs to bands: conductors, semiconductors and insulators.', prereqs: ['chem/molecular-orbitals'] },
      ],
    },
    {
      id: 'states', title: 'Gases, liquids & solids',
      summary: 'How molecular motion and attraction decide the state of matter.',
      references: [openstax('Ch. 9–10'), atkins('Topics 1A–1C, 4A–4B')],
      lessons: [
        { id: 'gas-laws', title: 'The gas laws', summary: 'Boyle, Charles, Avogadro and the ideal gas law PV = nRT.', prereqs: ['chem/the-mole'] },
        { id: 'kinetic-molecular-theory', title: 'Kinetic molecular theory', summary: 'Pressure from collisions; the Maxwell–Boltzmann speed distribution.', prereqs: ['chem/gas-laws', 'physics/boltzmann-distribution'] },
        { id: 'real-gases', title: 'Real gases', summary: 'The van der Waals equation and when the ideal gas law fails.', prereqs: ['chem/kinetic-molecular-theory'] },
        { id: 'intermolecular-forces', title: 'Intermolecular forces', summary: 'Dispersion, dipole–dipole, hydrogen bonding — the forces that hold drugs in binding pockets.', prereqs: ['chem/vsepr'] },
        { id: 'liquids-phase-diagrams', title: 'Liquids & phase diagrams', summary: 'Vapour pressure, boiling, and reading a phase diagram.', prereqs: ['chem/intermolecular-forces'] },
        { id: 'crystalline-solids', title: 'Crystalline solids', summary: 'Unit cells, packing and the types of solids.', prereqs: ['chem/intermolecular-forces'] },
      ],
    },
    {
      id: 'solutions', title: 'Solutions',
      summary: 'Why things dissolve, how to express concentration, and what solutes do to a solvent.',
      references: [openstax('Ch. 11'), atkins('Topics 5A–5B')],
      lessons: [
        { id: 'solubility-dissolution', title: 'Solubility & “like dissolves like”', summary: 'Energetics and entropy of dissolving; hydrophobic effect; logP.', prereqs: ['chem/intermolecular-forces'] },
        { id: 'concentration-units', title: 'Concentration units', summary: 'Molarity, molality, mole fraction, ppm and conversions.', prereqs: ['chem/reactions-in-solution'] },
        { id: 'colligative-properties', title: 'Colligative properties', summary: 'Boiling-point elevation, freezing-point depression and osmotic pressure.', prereqs: ['chem/concentration-units'] },
        { id: 'colloids', title: 'Colloids & aggregation', summary: 'Micelles, emulsions and why aggregating compounds give false positives in screens.', prereqs: ['chem/solubility-dissolution'] },
      ],
    },
    {
      id: 'thermo', title: 'Thermochemistry & thermodynamics',
      summary: 'Energy, entropy and free energy decide which way a reaction can go.',
      references: [openstax('Ch. 5, 16'), atkins('Topics 2A–3D')],
      lessons: [
        { id: 'energy-heat-work', title: 'Energy, heat & work', summary: 'System vs surroundings, the first law, internal energy and enthalpy.', prereqs: ['physics/energy-conservation', 'physics/thermodynamics-laws'] },
        { id: 'thermochemistry', title: 'Thermochemistry', summary: 'Reaction enthalpies, calorimetry, Hess’s law and enthalpies of formation.', prereqs: ['chem/energy-heat-work'] },
        { id: 'entropy-second-law', title: 'Entropy & the second law', summary: 'Counting microstates; why disorder of the universe increases.', prereqs: ['chem/thermochemistry', 'physics/statistical-entropy'] },
        { id: 'gibbs-free-energy', title: 'Gibbs free energy', summary: 'ΔG = ΔH − TΔS decides spontaneity; enthalpy–entropy compensation in binding.', prereqs: ['chem/entropy-second-law'] },
        { id: 'bond-energies', title: 'Bond energies & reaction energetics', summary: 'Estimating ΔH from bonds broken and formed.', prereqs: ['chem/thermochemistry', 'chem/covalent-bonding'] },
      ],
    },
    {
      id: 'kinetics', title: 'Chemical kinetics',
      summary: 'How fast reactions go, and what that tells us about how they happen.',
      references: [openstax('Ch. 12'), atkins('Topics 17A–18C'), { authors: 'H. Eyring', title: 'The activated complex in chemical reactions', year: 1935, venue: 'J. Chem. Phys. 3, 107–115' }],
      lessons: [
        { id: 'reaction-kinetics', title: 'Reaction rates & rate laws', summary: 'Rate, order, rate constants and the method of initial rates.', prereqs: ['chem/stoichiometry'] },
        { id: 'integrated-rate-laws', title: 'Integrated rate laws', summary: 'Concentration vs time and half-lives for zero-, first- and second-order reactions.', prereqs: ['chem/reaction-kinetics', 'math/ode-first-order'] },
        { id: 'arrhenius-activation', title: 'Activation energy & Arrhenius', summary: 'Energy barriers and why rates climb steeply with temperature.', prereqs: ['chem/integrated-rate-laws', 'physics/boltzmann-distribution'] },
        { id: 'rate-mechanisms', title: 'Mechanisms & rate-determining steps', summary: 'Elementary steps, intermediates, steady-state and pre-equilibrium approximations.', prereqs: ['chem/arrhenius-activation'] },
        { id: 'catalysis', title: 'Catalysis', summary: 'Lowering barriers: homogeneous, heterogeneous and enzyme catalysis.', prereqs: ['chem/rate-mechanisms'] },
      ],
    },
    {
      id: 'equilibrium', title: 'Chemical equilibrium',
      summary: 'Reactions that run both ways settle at a balance point you can predict and push.',
      references: [openstax('Ch. 13, 15'), atkins('Topics 6A–6B')],
      lessons: [
        { id: 'chemical-equilibrium', title: 'Dynamic equilibrium & K', summary: 'Equal forward and reverse rates; the equilibrium constant and reaction quotient.', prereqs: ['chem/reaction-kinetics'] },
        { id: 'le-chatelier', title: 'Le Chatelier’s principle', summary: 'How equilibria respond to concentration, pressure and temperature.', prereqs: ['chem/chemical-equilibrium'] },
        { id: 'equilibrium-calculations', title: 'Equilibrium calculations', summary: 'ICE tables and solving for equilibrium concentrations; binding equilibria (Kd).', prereqs: ['chem/chemical-equilibrium'] },
        { id: 'free-energy-and-k', title: 'Free energy & K', summary: 'ΔG° = −RT ln K links thermodynamics to equilibrium; van ’t Hoff.', prereqs: ['chem/gibbs-free-energy', 'chem/chemical-equilibrium'] },
        { id: 'solubility-equilibria', title: 'Solubility equilibria', summary: 'Ksp, common-ion effect and precipitation.', prereqs: ['chem/equilibrium-calculations'] },
      ],
    },
    {
      id: 'acids-bases', title: 'Acids & bases',
      summary: 'Proton transfer — the most common reaction in chemistry and biology.',
      references: [openstax('Ch. 14'), clayden('Ch. 8')],
      lessons: [
        { id: 'acids-bases', title: 'Acids & bases', summary: 'Brønsted–Lowry and Lewis definitions, conjugate pairs, strong vs weak.', prereqs: ['chem/chemical-equilibrium'] },
        { id: 'ph-calculations', title: 'pH & pKa', summary: 'The pH scale, Ka and pKa, and calculating pH of weak acids.', prereqs: ['chem/acids-bases'] },
        { id: 'buffers', title: 'Buffers & Henderson–Hasselbalch', summary: 'How buffers resist pH change; ionization state of drugs at pH 7.4.', prereqs: ['chem/ph-calculations'] },
        { id: 'titrations', title: 'Titrations', summary: 'Titration curves, equivalence points and indicators.', prereqs: ['chem/buffers'] },
        { id: 'structure-acidity', title: 'Structure & acidity', summary: 'Why pKa depends on electronegativity, resonance, induction and hybridization.', prereqs: ['chem/ph-calculations', 'chem/lewis-structures'] },
      ],
    },
    {
      id: 'electrochem', title: 'Electrochemistry',
      summary: 'Moving electrons between molecules to make — or use — electricity.',
      references: [openstax('Ch. 17'), atkins('Topics 6C–6D'), { authors: 'A. J. Bard, L. R. Faulkner', title: 'Electrochemical Methods: Fundamentals and Applications', year: 2001, venue: '2nd ed., Wiley' }],
      lessons: [
        { id: 'redox-reactions', title: 'Redox reactions', summary: 'Oxidation states and balancing redox reactions.', prereqs: ['chem/chemical-equations'] },
        { id: 'galvanic-cells', title: 'Galvanic cells & potentials', summary: 'Half-cells, standard reduction potentials and cell voltage.', prereqs: ['chem/redox-reactions'] },
        { id: 'nernst-equation', title: 'The Nernst equation', summary: 'Potential vs concentration and the link ΔG = −nFE.', prereqs: ['chem/galvanic-cells', 'chem/free-energy-and-k'] },
        { id: 'electrolysis-batteries', title: 'Electrolysis & batteries', summary: 'Driving reactions with current; how lithium-ion cells work.', prereqs: ['chem/nernst-equation'] },
      ],
    },
    {
      id: 'organic-structure', title: 'Organic chemistry I: structure',
      summary: 'Reading and naming carbon compounds, and their 3D shape.',
      references: [clayden('Ch. 2–4, 14–16'), { authors: 'E. V. Anslyn, D. A. Dougherty', title: 'Modern Physical Organic Chemistry', year: 2006, venue: 'University Science Books' }],
      lessons: [
        { id: 'skeletal-structures', title: 'Drawing organic molecules', summary: 'Skeletal (line-angle) structures and what the lines hide.', prereqs: ['chem/hybridization'] },
        { id: 'organic-nomenclature', title: 'Naming organic compounds', summary: 'IUPAC rules for chains, rings and substituents.', prereqs: ['chem/skeletal-structures'] },
        { id: 'organic-functional-groups', title: 'Functional groups', summary: 'Alcohols, amines, carbonyls, acids, amides… the reactive “handles” of molecules.', prereqs: ['chem/skeletal-structures'] },
        { id: 'conformations', title: 'Conformations', summary: 'Rotation about bonds: Newman projections and cyclohexane chairs.', prereqs: ['chem/skeletal-structures'] },
        { id: 'stereochemistry', title: 'Stereochemistry', summary: 'Chirality, R/S, enantiomers and diastereomers — and why thalidomide matters.', prereqs: ['chem/conformations'] },
        { id: 'resonance-aromaticity', title: 'Delocalization & aromaticity', summary: 'Conjugation, Hückel’s 4n+2 rule and aromatic heterocycles in drugs.', prereqs: ['chem/molecular-orbitals', 'chem/organic-functional-groups'] },
      ],
    },
    {
      id: 'organic-reactions', title: 'Organic chemistry II: reactions & synthesis',
      summary: 'Curly arrows, the main reaction families, and planning a synthesis.',
      references: [clayden('Ch. 5, 10–12, 15–17, 21–28'), { authors: 'E. J. Corey, X.-M. Cheng', title: 'The Logic of Chemical Synthesis', year: 1989, venue: 'Wiley' }],
      lessons: [
        { id: 'reaction-mechanisms', title: 'Reaction mechanisms & curly arrows', summary: 'Nucleophiles, electrophiles and electron-pushing arrows.', prereqs: ['chem/organic-functional-groups', 'chem/rate-mechanisms'] },
        { id: 'nucleophilic-substitution', title: 'Substitution: SN1 & SN2', summary: 'Backside attack vs carbocations; stereochemical outcomes.', prereqs: ['chem/reaction-mechanisms', 'chem/stereochemistry'] },
        { id: 'elimination', title: 'Elimination: E1 & E2', summary: 'Making alkenes and competing with substitution.', prereqs: ['chem/nucleophilic-substitution'] },
        { id: 'alkene-addition', title: 'Additions to alkenes', summary: 'Electrophilic addition, Markovnikov selectivity and hydrogenation.', prereqs: ['chem/reaction-mechanisms'] },
        { id: 'carbonyl-chemistry', title: 'Carbonyl chemistry', summary: 'Nucleophilic addition, acyl substitution, enolates and aldol reactions.', prereqs: ['chem/reaction-mechanisms'] },
        { id: 'aromatic-substitution', title: 'Aromatic substitution', summary: 'Electrophilic aromatic substitution and directing effects.', prereqs: ['chem/resonance-aromaticity', 'chem/reaction-mechanisms'] },
        { id: 'cross-coupling', title: 'Cross-coupling & modern methods', summary: 'Pd-catalysed Suzuki and Buchwald–Hartwig reactions, workhorses of medicinal chemistry.', prereqs: ['chem/carbonyl-chemistry', 'chem/organometallics'] },
        { id: 'organic-synthesis', title: 'Planning a synthesis', summary: 'Retrosynthetic analysis, protecting groups and multistep routes.', prereqs: ['chem/carbonyl-chemistry', 'chem/aromatic-substitution'] },
      ],
    },
    {
      id: 'inorganic', title: 'Inorganic & coordination chemistry',
      summary: 'Metals, ligands and the colourful chemistry of the d block.',
      references: [housecroft('Ch. 19–24'), { authors: 'J. F. Hartwig', title: 'Organotransition Metal Chemistry: From Bonding to Catalysis', year: 2010, venue: 'University Science Books' }],
      lessons: [
        { id: 'main-group-chemistry', title: 'Main-group chemistry', summary: 'Patterns in the s- and p-block elements and their compounds.', prereqs: ['chem/periodic-trends'] },
        { id: 'coordination-complexes', title: 'Coordination complexes', summary: 'Ligands, coordination number, geometry and isomers; cisplatin.', prereqs: ['chem/vsepr', 'chem/electron-configuration'] },
        { id: 'crystal-field-theory', title: 'Crystal field theory', summary: 'd-orbital splitting explains colour and magnetism of complexes.', prereqs: ['chem/coordination-complexes'] },
        { id: 'ligand-field-theory', title: 'Ligand field & MO view of complexes', summary: 'σ- and π-donor/acceptor ligands and the spectrochemical series.', prereqs: ['chem/crystal-field-theory', 'chem/molecular-orbitals'] },
        { id: 'organometallics', title: 'Organometallics & catalytic cycles', summary: '18-electron rule, oxidative addition and reductive elimination.', prereqs: ['chem/ligand-field-theory'] },
        { id: 'bioinorganic', title: 'Bioinorganic chemistry', summary: 'Metals in proteins: heme iron, zinc fingers and metalloenzyme drug targets.', prereqs: ['chem/coordination-complexes', 'bio/protein-structure'] },
      ],
    },
    {
      id: 'physical', title: 'Physical chemistry',
      summary: 'Molecular quantum levels and statistical mechanics connect microscopic to macroscopic.',
      references: [atkins('Topics 7A–7F, 13A–13F, 5A'), { authors: 'D. A. McQuarrie, J. D. Simon', title: 'Physical Chemistry: A Molecular Approach', year: 1997, venue: 'University Science Books' }],
      lessons: [
        { id: 'chemical-potential', title: 'Chemical potential & mixtures', summary: 'Partial molar quantities and the condition for phase and chemical equilibrium.', prereqs: ['chem/gibbs-free-energy'] },
        { id: 'molecular-energy-levels', title: 'Quantized molecular motion', summary: 'Translation, rotation and vibration as box, rotor and oscillator levels.', prereqs: ['quantum/particle-in-a-box', 'quantum/harmonic-oscillator-qm'] },
        { id: 'partition-functions', title: 'Partition functions', summary: 'The Boltzmann distribution over molecular levels and the molecular partition function.', prereqs: ['chem/molecular-energy-levels', 'physics/boltzmann-distribution'] },
        { id: 'stat-thermo', title: 'From partition functions to thermodynamics', summary: 'Getting U, S, G and K from molecular properties.', prereqs: ['chem/partition-functions', 'chem/free-energy-and-k'] },
        { id: 'transition-state-theory', title: 'Transition-state theory', summary: 'The Eyring equation and activation free energy.', prereqs: ['chem/stat-thermo', 'chem/arrhenius-activation'] },
      ],
    },
    {
      id: 'quantum-chem', title: 'Quantum chemistry',
      summary: 'Solving the Schrödinger equation for molecules — approximately, on a computer.',
      references: [
        szabo('Ch. 1–4, 6'), jensen('Ch. 3–6'),
        { authors: 'W. Koch, M. C. Holthausen', title: "A Chemist's Guide to Density Functional Theory", year: 2001, venue: '2nd ed., Wiley-VCH' },
        { authors: 'T. Helgaker, P. Jørgensen, J. Olsen', title: 'Molecular Electronic-Structure Theory', year: 2000, venue: 'Wiley' },
      ],
      lessons: [
        { id: 'schrodinger-for-molecules', title: 'The Schrödinger equation for molecules', summary: 'The molecular Hamiltonian, the Born–Oppenheimer approximation and potential energy surfaces.', prereqs: ['quantum/schrodinger-equation', 'chem/molecular-orbitals'] },
        { id: 'hartree-fock', title: 'Hartree–Fock & the SCF method', summary: 'Slater determinants, the mean-field Fock operator and self-consistency.', prereqs: ['chem/schrodinger-for-molecules', 'quantum/many-electron-systems', 'math/eigenvalues'] },
        { id: 'basis-sets', title: 'Basis sets', summary: 'Gaussian functions, minimal to triple-zeta, polarization and diffuse functions.', prereqs: ['chem/hartree-fock'] },
        { id: 'post-hartree-fock', title: 'Electron correlation: MP2, CI & CC', summary: 'What HF misses and the wavefunction methods that recover it; CCSD(T) as the gold standard.', prereqs: ['chem/basis-sets'] },
        { id: 'dft-intro', title: 'Density functional theory', summary: 'Hohenberg–Kohn, Kohn–Sham, and the exchange–correlation functional.', prereqs: ['chem/hartree-fock'] },
        { id: 'dft-functionals', title: 'Choosing a functional', summary: 'Jacob’s ladder: LDA, GGA, hybrids, range-separated and dispersion corrections.', prereqs: ['chem/dft-intro', 'chem/basis-sets'] },
        { id: 'potential-energy-surfaces', title: 'Geometry optimization & frequencies', summary: 'Minima, transition states, vibrational analysis and thermochemistry from calculations.', prereqs: ['chem/schrodinger-for-molecules', 'chem/stat-thermo'] },
        { id: 'computational-chemistry-practice', title: 'Computational chemistry in practice', summary: 'Choosing method and basis, solvation models, cost scaling and common pitfalls.', prereqs: ['chem/dft-functionals', 'chem/post-hartree-fock'] },
      ],
    },
    {
      id: 'spectroscopy', title: 'Spectroscopy & structure determination',
      summary: 'Shining light (or radio waves) on molecules to read their structure.',
      references: [pavia('Ch. 1–8'), atkins('Topics 11A–12D'), { authors: 'J. Keeler', title: 'Understanding NMR Spectroscopy', year: 2010, venue: '2nd ed., Wiley' }],
      lessons: [
        { id: 'light-matter', title: 'How light interacts with molecules', summary: 'Absorption, emission, selection rules and the Beer–Lambert law.', prereqs: ['chem/molecular-energy-levels'] },
        { id: 'spectroscopy-uv-ir', title: 'UV-Vis & IR spectroscopy', summary: 'Electronic transitions and chromophores; vibrational bands as functional-group fingerprints.', prereqs: ['chem/light-matter', 'chem/organic-functional-groups'] },
        { id: 'fluorescence', title: 'Fluorescence', summary: 'Jablonski diagrams, quantum yield, FRET and fluorescence assays.', prereqs: ['chem/spectroscopy-uv-ir'] },
        { id: 'nmr-basics', title: 'NMR basics', summary: 'Nuclear spin in a magnetic field, chemical shift, coupling and integration.', prereqs: ['chem/light-matter', 'quantum/spin'] },
        { id: 'nmr-2d', title: 'Pulses, FT & 2D NMR', summary: 'Free-induction decay, Fourier transform, COSY, HSQC, NOESY.', prereqs: ['chem/nmr-basics', 'math/fourier-series'] },
        { id: 'mass-spectrometry', title: 'Mass spectrometry', summary: 'Ionization (ESI, MALDI), mass analysers, isotope patterns and fragmentation.', prereqs: ['chem/atomic-structure'] },
        { id: 'structure-elucidation', title: 'Putting spectra together', summary: 'Solving an unknown structure from MS, IR and NMR data.', prereqs: ['chem/nmr-2d', 'chem/mass-spectrometry', 'chem/spectroscopy-uv-ir'] },
      ],
    },
    {
      id: 'structural-analytical', title: 'Structural & analytical techniques for drug discovery',
      summary: 'How we see protein targets in atomic detail and measure how tightly drugs bind.',
      references: [
        { authors: 'B. Rupp', title: 'Biomolecular Crystallography: Principles, Practice, and Application to Structural Biology', year: 2010, venue: 'Garland Science' },
        { authors: 'Y. Cheng', title: 'Single-particle cryo-EM at crystallographic resolution', year: 2015, venue: 'Cell 161, 450–457' },
        { authors: 'R. Aebersold, M. Mann', title: 'Mass spectrometry-based proteomics', year: 2003, venue: 'Nature 422, 198–207' },
        skoog('Ch. 26–28, 33'),
      ],
      lessons: [
        { id: 'xray-crystallography', title: 'X-ray crystallography', summary: 'Crystals, diffraction, Bragg’s law, the phase problem and electron-density maps.', prereqs: ['chem/crystalline-solids', 'bio/protein-structure', 'math/fourier-series'] },
        { id: 'crystallography-in-drug-design', title: 'Reading a protein–ligand structure', summary: 'Resolution, R-factors, B-factors and judging ligand density in the PDB.', prereqs: ['chem/xray-crystallography'] },
        { id: 'protein-nmr', title: 'Protein NMR & NMR screening', summary: 'HSQC fingerprints, chemical-shift perturbation, STD and fragment screening.', prereqs: ['chem/nmr-2d', 'bio/protein-structure'] },
        { id: 'cryo-em', title: 'Cryo-electron microscopy', summary: 'Vitrification, single-particle averaging, 2D/3D classification and resolution (FSC).', prereqs: ['bio/protein-structure', 'math/fourier-series'] },
        { id: 'proteomics-hdx-ms', title: 'Protein mass spec: proteomics & HDX-MS', summary: 'Bottom-up proteomics, native MS, and hydrogen–deuterium exchange for mapping binding.', prereqs: ['chem/mass-spectrometry', 'bio/protein-structure'] },
        { id: 'chromatography', title: 'Chromatography & HPLC', summary: 'Partitioning between phases, retention, resolution and reversed-phase HPLC.', prereqs: ['chem/intermolecular-forces', 'chem/solubility-dissolution'] },
        { id: 'lc-ms', title: 'LC-MS in practice', summary: 'Coupling separation to mass detection for purity, metabolite ID and bioanalysis.', prereqs: ['chem/chromatography', 'chem/mass-spectrometry'] },
        { id: 'calorimetry-itc', title: 'Calorimetry: ITC & DSC', summary: 'Measuring ΔH, Kd and stoichiometry by titration calorimetry; thermal stability by DSC.', prereqs: ['chem/thermochemistry', 'chem/equilibrium-calculations'] },
        { id: 'spr', title: 'Surface plasmon resonance', summary: 'Label-free binding kinetics: kon, koff and Kd from sensorgrams.', prereqs: ['chem/equilibrium-calculations', 'chem/integrated-rate-laws'] },
      ],
    },
    {
      id: 'biochem-link', title: 'The chemistry of life',
      summary: 'The chemical principles behind biomolecules and how drugs recognise them.',
      references: [
        { authors: 'J. M. Berg, J. L. Tymoczko, G. J. Gatto, L. Stryer', title: 'Biochemistry', year: 2019, venue: '9th ed., W. H. Freeman' },
        { authors: 'C. Walsh', title: 'Enzymatic Reaction Mechanisms', year: 1979, venue: 'W. H. Freeman' },
      ],
      lessons: [
        { id: 'amino-acid-chemistry', title: 'Amino acids & the peptide bond', summary: 'Side-chain chemistry, ionization states and peptide bond planarity.', prereqs: ['chem/buffers', 'bio/macromolecules'] },
        { id: 'nucleic-acid-chemistry', title: 'Nucleic acid chemistry', summary: 'Bases, base pairing, phosphodiester backbone and why DNA uses deoxyribose.', prereqs: ['chem/intermolecular-forces', 'bio/dna-structure'] },
        { id: 'enzyme-mechanisms', title: 'Enzyme mechanisms', summary: 'Acid–base and covalent catalysis, transition-state stabilisation, serine proteases.', prereqs: ['chem/catalysis', 'chem/reaction-mechanisms', 'bio/enzymes'] },
        { id: 'molecular-recognition', title: 'Molecular recognition', summary: 'Hydrogen bonds, hydrophobic effect and electrostatics in protein–ligand binding.', prereqs: ['chem/intermolecular-forces', 'chem/gibbs-free-energy'] },
        { id: 'covalent-drugs', title: 'Covalent drugs & warheads', summary: 'Electrophiles that react with cysteine and serine: aspirin, penicillin, kinase inhibitors.', prereqs: ['chem/carbonyl-chemistry', 'chem/enzyme-mechanisms'] },
      ],
    },
  ],
} satisfies Subject;
