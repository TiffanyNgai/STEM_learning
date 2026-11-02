import type { Reference, Subject } from '../types';

// ---------- Textbooks ----------
const leach: Reference = {
  authors: 'Leach, A. R.',
  title: 'Molecular Modelling: Principles and Applications',
  year: 2001,
  venue: '2nd ed., Prentice Hall / Pearson',
};
const patrick: Reference = {
  authors: 'Patrick, G. L.',
  title: 'An Introduction to Medicinal Chemistry',
  year: 2017,
  venue: '6th ed., Oxford University Press',
};
const schneiderBook: Reference = {
  authors: 'Schneider, G., Baringhaus, K.-H.',
  title: 'Molecular Design: Concepts and Applications',
  year: 2008,
  venue: 'Wiley-VCH',
};
const frenkel: Reference = {
  authors: 'Frenkel, D., Smit, B.',
  title: 'Understanding Molecular Simulation: From Algorithms to Applications',
  year: 2002,
  venue: '2nd ed., Academic Press',
};
const copeland: Reference = {
  authors: 'Copeland, R. A.',
  title: 'Evaluation of Enzyme Inhibitors in Drug Discovery',
  year: 2013,
  venue: '2nd ed., Wiley',
};
const diKerns: Reference = {
  authors: 'Di, L., Kerns, E. H.',
  title: 'Drug-Like Properties: Concepts, Structure Design and Methods',
  year: 2016,
  venue: '2nd ed., Academic Press',
};
const s = (r: Reference, detail: string): Reference => ({ ...r, detail });

// ---------- Frequently cited papers ----------
const dimasi: Reference = { authors: 'DiMasi, J. A., Grabowski, H. G., Hansen, R. W.', title: 'Innovation in the pharmaceutical industry: New estimates of R&D costs', year: 2016, venue: 'J. Health Econ. 47, 20–33' };
const scannell: Reference = { authors: 'Scannell, J. W., Blanckley, A., Boldon, H., Warrington, B.', title: 'Diagnosing the decline in pharmaceutical R&D efficiency', year: 2012, venue: 'Nat. Rev. Drug Discov. 11, 191–200' };
const paul: Reference = { authors: 'Paul, S. M., Mytelka, D. S., Dunwiddie, C. T., et al.', title: "How to improve R&D productivity: the pharmaceutical industry's grand challenge", year: 2010, venue: 'Nat. Rev. Drug Discov. 9, 203–214' };
const hughes: Reference = { authors: 'Hughes, J. P., Rees, S., Kalindjian, S. B., Philpott, K. L.', title: 'Principles of early drug discovery', year: 2011, venue: 'Br. J. Pharmacol. 162, 1239–1249' };
const hopkinsGroom: Reference = { authors: 'Hopkins, A. L., Groom, C. R.', title: 'The druggable genome', year: 2002, venue: 'Nat. Rev. Drug Discov. 1, 727–730' };
const santos: Reference = { authors: 'Santos, R., Ursu, O., Gaulton, A., et al.', title: 'A comprehensive map of molecular drug targets', year: 2017, venue: 'Nat. Rev. Drug Discov. 16, 19–34' };
const swinney: Reference = { authors: 'Swinney, D. C., Anthony, J.', title: 'How were new medicines discovered?', year: 2011, venue: 'Nat. Rev. Drug Discov. 10, 507–519' };
const drews: Reference = { authors: 'Drews, J.', title: 'Drug discovery: a historical perspective', year: 2000, venue: 'Science 287, 1960–1964' };
const erlanson: Reference = { authors: 'Erlanson, D. A., Fesik, S. W., Hubbard, R. E., Jahnke, W., Jhoti, H.', title: 'Twenty years on: the impact of fragments on drug discovery', year: 2016, venue: 'Nat. Rev. Drug Discov. 15, 605–619' };
const zprime: Reference = { authors: 'Zhang, J.-H., Chung, T. D. Y., Oldenburg, K. R.', title: 'A simple statistical parameter for use in evaluation and validation of high throughput screening assays', year: 1999, venue: 'J. Biomol. Screen. 4, 67–73' };
const chengPrusoff: Reference = { authors: 'Cheng, Y., Prusoff, W. H.', title: 'Relationship between the inhibition constant (KI) and the concentration of inhibitor which causes 50 per cent inhibition (I50) of an enzymatic reaction', year: 1973, venue: 'Biochem. Pharmacol. 22, 3099–3108' };
const pains: Reference = { authors: 'Baell, J. B., Holloway, G. A.', title: 'New substructure filters for removal of pan assay interference compounds (PAINS) from screening libraries and for their exclusion in bioassays', year: 2010, venue: 'J. Med. Chem. 53, 2719–2740' };
const mcgovern: Reference = { authors: 'McGovern, S. L., Caselli, E., Grigorieff, N., Shoichet, B. K.', title: 'A common mechanism underlying promiscuous inhibitors from virtual and high-throughput screening', year: 2002, venue: 'J. Med. Chem. 45, 1712–1722' };
const weininger: Reference = { authors: 'Weininger, D.', title: 'SMILES, a chemical language and information system. 1. Introduction to methodology and encoding rules', year: 1988, venue: 'J. Chem. Inf. Comput. Sci. 28, 31–36' };
const selfies: Reference = { authors: 'Krenn, M., Häse, F., Nigam, A., Friederich, P., Aspuru-Guzik, A.', title: 'Self-referencing embedded strings (SELFIES): A 100% robust molecular string representation', year: 2020, venue: 'Mach. Learn.: Sci. Technol. 1, 045024' };
const inchi: Reference = { authors: 'Heller, S. R., McNaught, A., Pletnev, I., Stein, S., Tchekhovskoi, D.', title: 'InChI, the IUPAC International Chemical Identifier', year: 2015, venue: 'J. Cheminform. 7, 23' };
const ecfp: Reference = { authors: 'Rogers, D., Hahn, M.', title: 'Extended-connectivity fingerprints', year: 2010, venue: 'J. Chem. Inf. Model. 50, 742–754' };
const lipinski: Reference = { authors: 'Lipinski, C. A., Lombardo, F., Dominy, B. W., Feeney, P. J.', title: 'Experimental and computational approaches to estimate solubility and permeability in drug discovery and development settings', year: 1997, venue: 'Adv. Drug Deliv. Rev. 23, 3–25' };
const qed: Reference = { authors: 'Bickerton, G. R., Paolini, G. V., Besnard, J., Muresan, S., Hopkins, A. L.', title: 'Quantifying the chemical beauty of drugs', year: 2012, venue: 'Nat. Chem. 4, 90–98' };
const veber: Reference = { authors: 'Veber, D. F., Johnson, S. R., Cheng, H.-Y., et al.', title: 'Molecular properties that influence the oral bioavailability of drug candidates', year: 2002, venue: 'J. Med. Chem. 45, 2615–2623' };
const lyu2019: Reference = { authors: 'Lyu, J., Wang, S., Balius, T. E., et al.', title: 'Ultra-large library docking for discovering new chemotypes', year: 2019, venue: 'Nature 566, 224–229' };
const vina: Reference = { authors: 'Trott, O., Olson, A. J.', title: 'AutoDock Vina: improving the speed and accuracy of docking with a new scoring function, efficient optimization, and multithreading', year: 2010, venue: 'J. Comput. Chem. 31, 455–461' };
const glide: Reference = { authors: 'Friesner, R. A., Banks, J. L., Murphy, R. B., et al.', title: 'Glide: a new approach for rapid, accurate docking and scoring. 1. Method and assessment of docking accuracy', year: 2004, venue: 'J. Med. Chem. 47, 1739–1749' };
const fepplus: Reference = { authors: 'Wang, L., Wu, Y., Deng, Y., et al.', title: 'Accurate and reliable prediction of relative ligand binding potency in prospective drug discovery by way of a modern free-energy calculation protocol and force field', year: 2015, venue: 'J. Am. Chem. Soc. 137, 2695–2703' };
const af2: Reference = { authors: 'Jumper, J., Evans, R., Pritzel, A., et al.', title: 'Highly accurate protein structure prediction with AlphaFold', year: 2021, venue: 'Nature 596, 583–589' };
const rf: Reference = { authors: 'Baek, M., DiMaio, F., Anishchenko, I., et al.', title: 'Accurate prediction of protein structures and interactions using a three-track neural network', year: 2021, venue: 'Science 373, 871–876' };
const af3: Reference = { authors: 'Abramson, J., Adler, J., Dunger, J., et al.', title: 'Accurate structure prediction of biomolecular interactions with AlphaFold 3', year: 2024, venue: 'Nature 630, 493–500' };
const esm2: Reference = { authors: 'Lin, Z., Akin, H., Rao, R., et al.', title: 'Evolutionary-scale prediction of atomic-level protein structure with a language model', year: 2023, venue: 'Science 379, 1123–1130' };
const posebusters: Reference = { authors: 'Buttenschoen, M., Morris, G. M., Deane, C. M.', title: 'PoseBusters: AI-based docking methods fail to generate physically valid poses or generalise to novel sequences', year: 2024, venue: 'Chem. Sci. 15, 3130–3139' };
const gilmer: Reference = { authors: 'Gilmer, J., Schoenholz, S. S., Riley, P. F., Vinyals, O., Dahl, G. E.', title: 'Neural message passing for quantum chemistry', year: 2017, venue: 'Proc. ICML (PMLR 70)' };
const chemprop: Reference = { authors: 'Yang, K., Swanson, K., Jin, W., et al.', title: 'Analyzing learned molecular representations for property prediction', year: 2019, venue: 'J. Chem. Inf. Model. 59, 3370–3388' };
const moleculenet: Reference = { authors: 'Wu, Z., Ramsundar, B., Feinberg, E. N., et al.', title: 'MoleculeNet: a benchmark for molecular machine learning', year: 2018, venue: 'Chem. Sci. 9, 513–530' };
const tdc: Reference = { authors: 'Huang, K., Fu, T., Gao, W., et al.', title: 'Therapeutics Data Commons: Machine learning datasets and tasks for drug discovery and development', year: 2021, venue: 'NeurIPS Datasets and Benchmarks Track' };
const halicin: Reference = { authors: 'Stokes, J. M., Yang, K., Swanson, K., et al.', title: 'A deep learning approach to antibiotic discovery', year: 2020, venue: 'Cell 180, 688–702' };
const gomezb: Reference = { authors: 'Gómez-Bombarelli, R., Wei, J. N., Duvenaud, D., et al.', title: 'Automatic chemical design using a data-driven continuous representation of molecules', year: 2018, venue: 'ACS Cent. Sci. 4, 268–276' };
const reinvent: Reference = { authors: 'Olivecrona, M., Blaschke, T., Engkvist, O., Chen, H.', title: 'Molecular de-novo design through deep reinforcement learning', year: 2017, venue: 'J. Cheminform. 9, 48' };
const diffdock: Reference = { authors: 'Corso, G., Stärk, H., Jing, B., Barzilay, R., Jaakkola, T.', title: 'DiffDock: Diffusion steps, twists, and turns for molecular docking', year: 2023, venue: 'ICLR 2023' };
const rfdiffusion: Reference = { authors: 'Watson, J. L., Juergens, D., Bennett, N. R., et al.', title: 'De novo design of protein structure and function with RFdiffusion', year: 2023, venue: 'Nature 620, 1089–1100' };
const proteinmpnn: Reference = { authors: 'Dauparas, J., Anishchenko, I., Bennett, N., et al.', title: 'Robust deep learning–based protein sequence design using ProteinMPNN', year: 2022, venue: 'Science 378, 49–56' };
const segler: Reference = { authors: 'Segler, M. H. S., Preuss, M., Waller, M. P.', title: 'Planning chemical syntheses with deep neural networks and symbolic AI', year: 2018, venue: 'Nature 555, 604–610' };
const aizynth: Reference = { authors: 'Genheden, S., Thakkar, A., Chadimová, V., et al.', title: 'AiZynthFinder: a fast, robust and flexible open-source software for retrosynthetic planning', year: 2020, venue: 'J. Cheminform. 12, 70' };
const caoQC: Reference = { authors: 'Cao, Y., Romero, J., Aspuru-Guzik, A.', title: 'Potential of quantum computing for drug discovery', year: 2018, venue: 'IBM J. Res. Dev. 62(6), 6:1–6:20' };
const santagati: Reference = { authors: 'Santagati, R., Aspuru-Guzik, A., Babbush, R., et al.', title: 'Drug design on quantum computers', year: 2024, venue: 'Nat. Phys. 20, 549–557' };
const chembl: Reference = { authors: 'Gaulton, A., Bellis, L. J., Bento, A. P., et al.', title: 'ChEMBL: a large-scale bioactivity database for drug discovery', year: 2012, venue: 'Nucleic Acids Res. 40, D1100–D1107' };
const pdb: Reference = { authors: 'Berman, H. M., Westbrook, J., Feng, Z., et al.', title: 'The Protein Data Bank', year: 2000, venue: 'Nucleic Acids Res. 28, 235–242' };

export default {
  id: 'drug',
  name: 'Computational Drug Discovery',
  emoji: '💊',
  color: '#ffc800',
  tagline: 'From “what is a drug?” to docking, free energies, AlphaFold and generative design.',
  description: String.raw`Assumes **no pharmacy or chemistry background** — the biology, chemistry, ML, statistics and quantum
foundations live in their home subjects and are linked as quick recall cards. You will learn what drugs are and how the
pipeline from target to approval works (and why it is so slow and expensive), what happens in the wet lab, how molecules
are represented in a computer, and the full computational toolbox: cheminformatics, virtual screening, docking, molecular
dynamics, free-energy methods, protein structure prediction, machine learning for molecular properties, generative design,
retrosynthesis and the realistic role of quantum computing. The final units cover translational science, databases,
reproducibility and landmark case studies, so that you can read and contribute to current research.`,
  units: [
    {
      id: 'foundations',
      title: 'Foundations: drugs, targets & the pipeline',
      summary: 'What a drug is, the kinds of molecules that can be drugs, what they act on, and the long, costly road from idea to approved medicine.',
      references: [s(patrick, 'Ch. 1–2, 8'), hughes, dimasi, scannell, paul, santos],
      lessons: [
        { id: 'what-is-a-drug', title: 'What is a drug?', summary: 'Small molecules, biologics, peptides, oligonucleotides, ADCs, cell & gene therapies, degraders — and what they all have in common.', prereqs: ['bio/protein-structure', 'bio/central-dogma'] },
        { id: 'drug-targets-mechanisms', title: 'Targets & mechanisms of action', summary: 'Enzymes, receptors, ion channels, transporters and protein–protein interactions; agonists, antagonists, inhibitors, allosteric modulators.', prereqs: ['drug/what-is-a-drug', 'bio/enzymes', 'bio/cell-signaling', 'med/drug-receptor-interactions'] },
        { id: 'druggability', title: 'Druggability & target validation', summary: 'Which proteins can bind a drug-like molecule, the “undruggable” frontier, and how genetics and CRISPR raise confidence in a target.', prereqs: ['drug/drug-targets-mechanisms'] },
        { id: 'new-modalities', title: 'New modalities: degraders, glues & beyond', summary: 'PROTACs, molecular glues, covalent drugs, antibody–drug conjugates and RNA drugs — expanding what can be drugged.', prereqs: ['drug/what-is-a-drug'] },
        { id: 'drug-discovery-pipeline', title: 'The drug discovery pipeline', summary: 'Target ID → validation → hit ID → hit-to-lead → lead optimisation → preclinical → clinical → approval, with timings and attrition.', prereqs: ['drug/what-is-a-drug'] },
        { id: 'cost-attrition-productivity', title: 'Cost, attrition & Eroom’s law', summary: 'Why one approved drug costs billions, where candidates fail, and the long decline in R&D efficiency.', prereqs: ['drug/drug-discovery-pipeline'] },
      ],
    },
    {
      id: 'history',
      title: 'History & technology eras',
      summary: 'From willow bark and penicillin to rational design, high-throughput screening, fragments, DNA-encoded libraries and AI.',
      references: [drews, swinney, s(patrick, 'Ch. 12'), erlanson,
        { authors: 'Capdeville, R., Buchdunger, E., Zimmermann, J., Matter, A.', title: 'Glivec (STI571, imatinib), a rationally developed, targeted anticancer drug', year: 2002, venue: 'Nat. Rev. Drug Discov. 1, 493–502' }],
      lessons: [
        { id: 'history-of-drug-discovery', title: 'A short history of drug discovery', summary: 'The eras at a glance — natural products, receptor theory, rational design, HTS, genomics, fragments, phenotypic revival, AI.', prereqs: ['drug/drug-discovery-pipeline'] },
        { id: 'natural-products-serendipity', title: 'Natural products & serendipity', summary: 'Aspirin, penicillin, artemisinin, statins and taxol: what nature and luck have given medicine.', prereqs: ['drug/history-of-drug-discovery'] },
        { id: 'receptor-theory', title: 'Receptor theory & classical pharmacology', summary: 'Ehrlich, Langley, Clark and Black: the idea of a receptor and quantitative drug action.', prereqs: ['drug/history-of-drug-discovery', 'med/pharmacodynamics'] },
        { id: 'structure-based-design-era', title: 'The rational & structure-based design era', summary: 'Captopril, HIV protease inhibitors and imatinib — designing drugs from knowledge of the target.', prereqs: ['drug/history-of-drug-discovery', 'chem/xray-crystallography'] },
        { id: 'combichem-hts-genomics', title: 'Combinatorial chemistry, HTS & genomics', summary: 'The 1990s–2000s industrialisation of discovery and why more compounds did not mean more drugs.', prereqs: ['drug/history-of-drug-discovery'] },
        { id: 'fragments-del-phenotypic', title: 'Fragments, DNA-encoded libraries & phenotypic screening', summary: 'Starting small (SAR by NMR, vemurafenib), screening billions in a tube, and the revival of phenotypic discovery.', prereqs: ['drug/combichem-hts-genomics'] },
        { id: 'ai-era', title: 'The AI & AlphaFold era', summary: 'Deep learning, AlphaFold, generative design and the first AI-derived clinical candidates — and the hype to filter out.', prereqs: ['drug/fragments-del-phenotypic'] },
      ],
    },
    {
      id: 'wetlab',
      title: 'Wet-lab essentials',
      summary: 'The experiments that generate the data computational methods learn from — and their noise and artefacts.',
      references: [s(copeland, 'Ch. 1–5'), zprime, chengPrusoff, pains, mcgovern, hughes],
      lessons: [
        { id: 'wet-lab-assays', title: 'Assays: how we measure drug activity', summary: 'Biochemical vs cell-based, binding vs functional, reporter assays, readouts, and the high-throughput screen with its Z′-factor.', prereqs: ['drug/drug-discovery-pipeline'] },
        { id: 'binding-affinity', title: 'Binding affinity: Kd, Ki, IC50, EC50', summary: 'Equilibrium binding, the Hill equation, pIC50 and the Cheng–Prusoff correction — what the numbers actually mean.', prereqs: ['drug/wet-lab-assays', 'physics/boltzmann-distribution'] },
        { id: 'enzyme-inhibition-modes', title: 'Enzyme inhibition modes & residence time', summary: 'Competitive, non-competitive, uncompetitive, tight-binding and covalent inhibitors; kinetics and drug–target residence time.', prereqs: ['drug/binding-affinity', 'bio/enzymes'] },
        { id: 'biophysical-methods', title: 'Biophysics for hit validation', summary: 'SPR, ITC, thermal shift, ligand-observed NMR and crystallography — orthogonal confirmation that a hit really binds.', prereqs: ['drug/binding-affinity', 'chem/spr', 'chem/calorimetry-itc', 'chem/nmr-basics', 'chem/xray-crystallography'] },
        { id: 'cell-models-crispr-screens', title: 'Cell models, CRISPR screens & organoids', summary: 'Cell lines, primary cells, iPSCs, organoids and pooled CRISPR knockout screens for target discovery.', prereqs: ['drug/wet-lab-assays', 'bio/crispr'] },
        { id: 'animal-models-translation', title: 'Animal models & translation', summary: 'What mice, rats and non-human primates can and cannot tell us, and the 3Rs.', prereqs: ['drug/cell-models-crispr-screens'] },
        { id: 'assay-artefacts', title: 'Assay artefacts: PAINS, aggregators & noise', summary: 'False positives from colloidal aggregation, reactive and fluorescent compounds; replicate variability and inter-lab noise.', prereqs: ['drug/wet-lab-assays', 'stats/hypothesis-testing'] },
      ],
    },
    {
      id: 'admet',
      title: 'ADME & toxicity',
      summary: 'Potency is not enough: absorption, distribution, metabolism, excretion and toxicity decide whether a molecule can become a medicine.',
      references: [s(diKerns, 'Ch. 1–20'), s(patrick, 'Ch. 11'),
        { authors: 'Waring, M. J., Arrowsmith, J., Leach, A. R., et al.', title: 'An analysis of the attrition of drug candidates from four major pharmaceutical companies', year: 2015, venue: 'Nat. Rev. Drug Discov. 14, 475–486' },
        { authors: 'Sanguinetti, M. C., Tristani-Firouzi, M.', title: 'hERG potassium channels and cardiac arrhythmia', year: 2006, venue: 'Nature 440, 463–469' }],
      lessons: [
        { id: 'adme-tox', title: 'ADME/Tox overview', summary: 'The journey of a pill through the body and the standard in-vitro ADMET panel used in discovery.', prereqs: ['drug/wet-lab-assays', 'med/pharmacokinetics'] },
        { id: 'solubility-permeability', title: 'Solubility, permeability & absorption', summary: 'Kinetic vs thermodynamic solubility, PAMPA and Caco-2, efflux transporters and the BCS classes.', prereqs: ['drug/adme-tox'] },
        { id: 'metabolic-stability', title: 'Metabolic stability & CYP inhibition', summary: 'Microsomes and hepatocytes, intrinsic clearance, soft spots, CYP inhibition and drug–drug interactions.', prereqs: ['drug/adme-tox', 'med/drug-metabolism-cyp'] },
        { id: 'distribution-ppb', title: 'Distribution & plasma protein binding', summary: 'Free-drug hypothesis, fraction unbound, volume of distribution and the blood–brain barrier.', prereqs: ['drug/adme-tox'] },
        { id: 'safety-pharmacology', title: 'Safety: hERG, Ames & off-targets', summary: 'Cardiac liability, genotoxicity, reactive metabolites, safety panels and therapeutic index.', prereqs: ['drug/adme-tox', 'med/toxicology-basics'] },
      ],
    },
    {
      id: 'representations',
      title: 'Representing molecules',
      summary: 'How a computer “sees” a molecule: strings, graphs, fingerprints, descriptors, 3D conformers and protein formats.',
      references: [s(leach, 'Ch. 12'), s(schneiderBook, 'Ch. 1–3'), weininger, ecfp, selfies, inchi],
      lessons: [
        { id: 'molecular-representations', title: 'Molecules as strings & graphs', summary: 'SMILES, canonicalisation, SELFIES, InChI/InChIKey and the molecular graph.', prereqs: ['cs/graphs-intro', 'chem/stereochemistry'] },
        { id: 'fingerprints-similarity', title: 'Fingerprints & similarity', summary: 'Substructure keys and Morgan/ECFP fingerprints, bit collisions, Tanimoto similarity and the similarity principle.', prereqs: ['drug/molecular-representations', 'cs/hashing'] },
        { id: 'molecular-descriptors', title: 'Molecular descriptors', summary: 'MW, logP, TPSA, HBD/HBA, rotatable bonds, charges and topological indices — numbers that summarise a molecule.', prereqs: ['drug/molecular-representations', 'chem/intermolecular-forces'] },
        { id: 'conformers-3d', title: '3D structure & conformers', summary: 'Stereochemistry, tautomers, protonation states, conformer generation (ETKDG) and why 3D matters.', prereqs: ['drug/molecular-representations', 'chem/stereochemistry'] },
        { id: 'chemical-space', title: 'The size of chemical space', summary: 'From ~10^60 drug-like molecules to GDB-17 and make-on-demand libraries of tens of billions.', prereqs: ['drug/fingerprints-similarity'] },
        { id: 'protein-representations', title: 'Representing proteins', summary: 'Sequences, FASTA, UniProt, PDB/mmCIF files, residues, chains, B-factors and binding sites.', prereqs: ['bio/protein-structure', 'drug/molecular-representations'] },
        { id: 'rdkit-toolkit', title: 'Working with RDKit', summary: 'The core concepts of the open-source cheminformatics toolkit: Mol objects, sanitisation, substructure search and standardisation.', prereqs: ['drug/fingerprints-similarity'] },
      ],
    },
    {
      id: 'cheminformatics',
      title: 'Cheminformatics & virtual screening',
      summary: 'Using molecular data to decide what to make and test: drug-likeness, QSAR, scaffolds, pharmacophores and screening billions of molecules in silico.',
      references: [s(schneiderBook, 'Ch. 4–7'), s(leach, 'Ch. 12'), lipinski, qed, lyu2019,
        { authors: 'Cherkasov, A., Muratov, E. N., Fourches, D., et al.', title: 'QSAR modeling: where have you been? Where are you going to?', year: 2014, venue: 'J. Med. Chem. 57, 4977–5010' }],
      lessons: [
        { id: 'drug-likeness', title: 'Drug-likeness & the rule of five', summary: 'Lipinski, Veber, QED, ligand efficiency and why rules of thumb are guides not laws.', prereqs: ['drug/fingerprints-similarity'] },
        { id: 'qsar', title: 'QSAR: structure–activity models', summary: 'From Hansch analysis to modern regression on descriptors; validation and applicability domain.', prereqs: ['drug/molecular-descriptors', 'stats/linear-regression'] },
        { id: 'matched-molecular-pairs', title: 'SAR, activity cliffs & matched pairs', summary: 'Structure–activity relationships, activity cliffs and learning transformation effects from matched molecular pairs.', prereqs: ['drug/qsar'] },
        { id: 'scaffolds-chemotypes', title: 'Scaffolds & scaffold hopping', summary: 'Bemis–Murcko frameworks, chemotypes, bioisosteres and hopping to new IP space.', prereqs: ['drug/fingerprints-similarity'] },
        { id: 'pharmacophores', title: 'Pharmacophores', summary: 'The abstract arrangement of features a ligand needs, and pharmacophore-based screening.', prereqs: ['drug/conformers-3d'] },
        { id: 'virtual-screening', title: 'Virtual screening', summary: 'Ligand- vs structure-based screening, enrichment, ROC/BEDROC metrics and decoy sets.', prereqs: ['drug/drug-likeness', 'drug/pharmacophores'] },
        { id: 'ultra-large-libraries', title: 'Ultra-large library screening', summary: 'Docking hundreds of millions to billions of make-on-demand molecules (Lyu 2019) and ML-accelerated screening.', prereqs: ['drug/virtual-screening', 'drug/docking'] },
        { id: 'library-design', title: 'Library design & diversity', summary: 'Diversity vs focus, clustering, combinatorial and DNA-encoded library design.', prereqs: ['drug/chemical-space', 'drug/scaffolds-chemotypes'] },
      ],
    },
    {
      id: 'simulation',
      title: 'Molecular mechanics & simulation',
      summary: 'Physics-based models of molecules: force fields, energy minimisation, molecular dynamics and enhanced sampling.',
      references: [s(leach, 'Ch. 4–7'), s(frenkel, 'Ch. 4–7'),
        { authors: 'Hollingsworth, S. A., Dror, R. O.', title: 'Molecular dynamics simulation for all', year: 2018, venue: 'Neuron 99, 1129–1143' },
        { authors: 'Cornell, W. D., Cieplak, P., Bayly, C. I., et al.', title: 'A second generation force field for the simulation of proteins, nucleic acids, and organic molecules', year: 1995, venue: 'J. Am. Chem. Soc. 117, 5179–5197' }],
      lessons: [
        { id: 'force-fields', title: 'Force fields', summary: 'Bonds as springs, torsions, Lennard-Jones and Coulomb terms; AMBER, CHARMM, OPLS, GAFF and parameterisation.', prereqs: ['chem/intermolecular-forces', 'drug/conformers-3d'] },
        { id: 'energy-minimization', title: 'Energy minimisation & conformational search', summary: 'Steepest descent, conjugate gradients and searching for low-energy conformers.', prereqs: ['drug/force-fields'] },
        { id: 'molecular-dynamics', title: 'Molecular dynamics', summary: "Newton's laws on a computer: velocity Verlet, time steps, ensembles, thermostats and what MD can tell drug designers.", prereqs: ['drug/force-fields', 'physics/boltzmann-distribution'] },
        { id: 'solvation-models', title: 'Water & solvation models', summary: 'Explicit water (TIP3P), implicit solvent (GB/PB), periodic boundaries and Ewald electrostatics.', prereqs: ['drug/molecular-dynamics'] },
        { id: 'enhanced-sampling', title: 'Enhanced sampling', summary: 'Rare events and how umbrella sampling, metadynamics and replica exchange overcome barriers.', prereqs: ['drug/molecular-dynamics', 'physics/statistical-entropy'] },
        { id: 'markov-state-models', title: 'Markov state models', summary: 'Stitching many short simulations into kinetics: states, transition matrices and implied timescales.', prereqs: ['drug/enhanced-sampling', 'stats/markov-chains'] },
      ],
    },
    {
      id: 'docking-free-energy',
      title: 'Docking, scoring & free energy',
      summary: 'Predicting how and how strongly a ligand binds: docking, scoring functions, alchemical free energies and quantum methods.',
      references: [s(leach, 'Ch. 11–12'), vina, glide, fepplus,
        { authors: 'Chodera, J. D., Mobley, D. L., Shirts, M. R., et al.', title: 'Alchemical free energy methods for drug discovery: progress and challenges', year: 2011, venue: 'Curr. Opin. Struct. Biol. 21, 150–160' },
        { authors: 'Senn, H. M., Thiel, W.', title: 'QM/MM methods for biomolecular systems', year: 2009, venue: 'Angew. Chem. Int. Ed. 48, 1198–1229' }],
      lessons: [
        { id: 'docking', title: 'Molecular docking', summary: 'Pose search plus scoring: how Vina-like programs place a ligand in a pocket, and what docking can and cannot do.', prereqs: ['drug/force-fields', 'drug/protein-representations'] },
        { id: 'scoring-functions', title: 'Scoring functions', summary: 'Force-field, empirical, knowledge-based and ML scoring; why ranking affinities is so hard.', prereqs: ['drug/docking'] },
        { id: 'docking-validation', title: 'Validating docking & benchmarks', summary: 'Redocking RMSD, enrichment on DUD-E, CASF, and prospective validation.', prereqs: ['drug/scoring-functions', 'drug/virtual-screening'] },
        { id: 'free-energy-methods', title: 'Alchemical free-energy methods', summary: 'Thermodynamic cycles, FEP and TI, relative vs absolute binding free energies and FEP+ in practice.', prereqs: ['drug/molecular-dynamics', 'physics/statistical-entropy'] },
        { id: 'end-point-methods', title: 'MM-PBSA/GBSA & end-point methods', summary: 'Cheaper approximate binding free energies and their pitfalls.', prereqs: ['drug/free-energy-methods', 'drug/solvation-models'] },
        { id: 'qm-mm', title: 'QM/MM & covalent drugs', summary: 'Treating a reactive region quantum mechanically inside a classical protein; covalent inhibitor design.', prereqs: ['drug/force-fields', 'chem/dft-intro'] },
        { id: 'quantum-chemistry-drug-design', title: 'Quantum chemistry in drug design', summary: 'DFT and semi-empirical methods for conformer energies, torsion fitting, charges and ML potentials.', prereqs: ['drug/qm-mm', 'chem/hartree-fock'] },
      ],
    },
    {
      id: 'structure-prediction',
      title: 'Protein structure prediction & protein AI',
      summary: 'From homology modelling to AlphaFold, protein language models and co-folding of protein–ligand complexes.',
      references: [af2, rf, af3, esm2, posebusters,
        { authors: 'Šali, A., Blundell, T. L.', title: 'Comparative protein modelling by satisfaction of spatial restraints', year: 1993, venue: 'J. Mol. Biol. 234, 779–815' }],
      lessons: [
        { id: 'protein-structure-prediction', title: 'The protein structure prediction problem', summary: 'Sequence → structure, CASP, homology modelling, threading and fragment assembly (Rosetta).', prereqs: ['bio/protein-structure', 'drug/protein-representations'] },
        { id: 'alphafold', title: 'AlphaFold2', summary: 'MSAs, the Evoformer, the structure module, pLDDT/PAE confidence and what changed in 2020.', prereqs: ['drug/protein-structure-prediction', 'ml/attention-transformers'] },
        { id: 'rosettafold-af3', title: 'RoseTTAFold, AlphaFold3 & co-folding', summary: 'Three-track networks, diffusion-based all-atom prediction, Boltz-1 and Chai-1 for protein–ligand complexes.', prereqs: ['drug/alphafold', 'ml/diffusion-models'] },
        { id: 'protein-language-models', title: 'Protein language models', summary: 'ESM-2 and ESMFold: masked language modelling on evolution-scale sequence data.', prereqs: ['ml/attention-transformers', 'drug/protein-representations'] },
        { id: 'structure-prediction-limits', title: 'Limits of predicted structures', summary: 'PoseBusters, memorisation, conformational change, apo vs holo pockets and using predictions responsibly.', prereqs: ['drug/rosettafold-af3', 'drug/docking'] },
      ],
    },
    {
      id: 'ml-molecules',
      title: 'Machine learning for molecules',
      summary: 'Predicting molecular properties and activities from data — models, benchmarks, splits, uncertainty and active learning.',
      references: [gilmer, chemprop, moleculenet, tdc,
        { authors: 'Sheridan, R. P.', title: 'Time-split cross-validation as a method for estimating the goodness of prospective prediction', year: 2013, venue: 'J. Chem. Inf. Model. 53, 783–790' },
        { authors: 'Vamathevan, J., Clark, D., Czodrowski, P., et al.', title: 'Applications of machine learning in drug discovery and development', year: 2019, venue: 'Nat. Rev. Drug Discov. 18, 463–477' }],
      lessons: [
        { id: 'molecular-property-prediction', title: 'Molecular property prediction', summary: 'Framing activity and ADMET prediction as supervised learning; fingerprints + random forests as the baseline to beat.', prereqs: ['drug/fingerprints-similarity', 'drug/qsar'] },
        { id: 'message-passing-networks', title: 'Message-passing networks & Chemprop', summary: 'MPNNs (Gilmer 2017), directed message passing (Chemprop) and learned molecular representations.', prereqs: ['drug/molecular-property-prediction', 'ml/gnns'] },
        { id: 'equivariant-3d-models', title: '3D & equivariant models', summary: 'SchNet, EGNN and equivariant networks for conformers, complexes and ML interatomic potentials.', prereqs: ['drug/message-passing-networks', 'ml/equivariant-networks'] },
        { id: 'molecular-foundation-models', title: 'Chemical language & foundation models', summary: 'Pretraining on SMILES and graphs, transfer learning and what scale has (and has not) bought.', prereqs: ['drug/message-passing-networks', 'ml/attention-transformers'] },
        { id: 'benchmarks-splits-leakage', title: 'Benchmarks, splits & leakage', summary: 'MoleculeNet, TDC, random vs scaffold vs time splits, data leakage and applicability domain.', prereqs: ['drug/molecular-property-prediction', 'drug/scaffolds-chemotypes'] },
        { id: 'uncertainty-active-learning', title: 'Uncertainty & active learning', summary: 'Ensembles, conformal prediction, Bayesian optimisation and choosing the next compounds to test.', prereqs: ['drug/benchmarks-splits-leakage', 'stats/bayesian-inference'] },
      ],
    },
    {
      id: 'generative-design',
      title: 'Generative molecular design',
      summary: 'Inventing new molecules with machine learning: latent spaces, reinforcement learning, graph and 3D diffusion models, and ML docking.',
      references: [gomezb, reinvent, diffdock,
        { authors: 'Brown, N., Fiscato, M., Segler, M. H. S., Vaucher, A. C.', title: 'GuacaMol: benchmarking models for de novo molecular design', year: 2019, venue: 'J. Chem. Inf. Model. 59, 1096–1108' },
        { authors: 'Peng, X., Luo, S., Guan, J., Xie, Q., Peng, J., Ma, J.', title: 'Pocket2Mol: Efficient molecular sampling based on 3D protein pockets', year: 2022, venue: 'Proc. ICML 2022' },
        { authors: 'Schneuing, A., Harris, C., Du, Y., et al.', title: 'Structure-based drug design with equivariant diffusion models', year: 2024, venue: 'Nat. Comput. Sci. 4, 899–909 (arXiv:2210.13695, 2022)' }],
      lessons: [
        { id: 'generative-molecular-design', title: 'Generative design: the big picture', summary: 'Inverse design, the generate–score–select loop, and how to evaluate generated molecules.', prereqs: ['drug/molecular-property-prediction', 'drug/chemical-space'] },
        { id: 'latent-space-design', title: 'VAEs & latent-space optimisation', summary: 'Gómez-Bombarelli 2018, junction-tree VAEs and optimising in a continuous latent space.', prereqs: ['drug/generative-molecular-design', 'ml/vaes'] },
        { id: 'rl-molecular-design', title: 'Reinforcement learning for design (REINVENT)', summary: 'SMILES language models steered by reward: policy gradients, prior regularisation and mode collapse.', prereqs: ['drug/generative-molecular-design', 'ml/policy-gradients'] },
        { id: 'graph-generative-models', title: 'Graph-based generation', summary: 'Atom-by-atom and fragment-based graph generation, validity by construction and benchmarks (GuacaMol, MOSES).', prereqs: ['drug/generative-molecular-design', 'ml/gnns'] },
        { id: 'structure-based-generation', title: 'Pocket-conditioned 3D generation', summary: 'Pocket2Mol, DiffSBDD and equivariant diffusion for molecules built inside a binding site.', prereqs: ['drug/graph-generative-models', 'ml/diffusion-models', 'drug/docking'] },
        { id: 'diffdock-ml-docking', title: 'DiffDock & ML docking', summary: 'Diffusion over translations, rotations and torsions; blind docking and its evaluation controversies.', prereqs: ['drug/structure-based-generation', 'drug/structure-prediction-limits'] },
        { id: 'multi-objective-optimization', title: 'Multi-parameter optimisation', summary: 'Balancing potency, selectivity, ADMET and synthesizability with desirability functions and Pareto fronts.', prereqs: ['drug/generative-molecular-design', 'drug/adme-tox'] },
      ],
    },
    {
      id: 'biologics-design',
      title: 'Protein, peptide & antibody design',
      summary: 'Designing biologic drugs computationally: de novo proteins, inverse folding, binders, antibodies and peptides.',
      references: [rfdiffusion, proteinmpnn,
        { authors: 'Huang, P.-S., Boyken, S. E., Baker, D.', title: 'The coming of age of de novo protein design', year: 2016, venue: 'Nature 537, 320–327' },
        { authors: 'Muttenthaler, M., King, G. F., Adams, D. J., Alewood, P. F.', title: 'Trends in peptide drug discovery', year: 2021, venue: 'Nat. Rev. Drug Discov. 20, 309–325' }],
      lessons: [
        { id: 'protein-design', title: 'Computational protein design', summary: 'From Rosetta energy-based design to deep-learning pipelines: backbone → sequence → fold check.', prereqs: ['drug/alphafold', 'drug/protein-language-models'] },
        { id: 'rfdiffusion-backbones', title: 'RFdiffusion: generating backbones', summary: 'Denoising diffusion over protein frames, motif scaffolding and binder design.', prereqs: ['drug/protein-design', 'ml/diffusion-models'] },
        { id: 'inverse-folding', title: 'Inverse folding with ProteinMPNN', summary: 'Designing sequences that fold to a given backbone; recovery, diversity and experimental success rates.', prereqs: ['drug/protein-design', 'ml/gnns'] },
        { id: 'antibody-design', title: 'Antibody engineering & design', summary: 'Antibody structure, CDRs, affinity maturation, humanisation, developability and ML-guided design.', prereqs: ['drug/protein-design', 'bio/immune-system-overview'] },
        { id: 'peptide-design', title: 'Peptide & macrocycle design', summary: 'Stapled and cyclic peptides, GLP-1 analogues and designing for stability and permeability.', prereqs: ['drug/protein-design'] },
      ],
    },
    {
      id: 'synthesis-automation',
      title: 'Synthesis planning & automation',
      summary: 'Can we make it? Retrosynthesis, reaction prediction, synthesizability and self-driving labs that close the design–make–test loop.',
      references: [segler, aizynth,
        { authors: 'Corey, E. J., Cheng, X.-M.', title: 'The Logic of Chemical Synthesis', year: 1989, venue: 'Wiley' },
        { authors: 'Ertl, P., Schuffenhauer, A.', title: 'Estimation of synthetic accessibility score of drug-like molecules based on molecular complexity and fragment contributions', year: 2009, venue: 'J. Cheminform. 1, 8' },
        { authors: 'Coley, C. W., Thomas, D. A., Lummiss, J. A. M., et al.', title: 'A robotic platform for flow synthesis of organic compounds informed by AI planning', year: 2019, venue: 'Science 365, eaax1566' }],
      lessons: [
        { id: 'retrosynthesis', title: 'Retrosynthesis', summary: 'Working backwards from a target to purchasable building blocks; template-based and template-free models and tree search (Segler 2018, AiZynthFinder).', prereqs: ['chem/reaction-mechanisms'] },
        { id: 'reaction-prediction', title: 'Forward reaction prediction', summary: 'Predicting products and conditions: Molecular Transformer and reaction yields.', prereqs: ['drug/retrosynthesis', 'ml/attention-transformers'] },
        { id: 'synthesizability', title: 'Synthesizability scoring', summary: 'SA score, SCScore, retrosynthesis-based scores and why generative models produce unmakeable molecules.', prereqs: ['drug/retrosynthesis', 'drug/generative-molecular-design'] },
        { id: 'self-driving-labs', title: 'Closed-loop & self-driving labs', summary: 'Automated design–make–test–analyse cycles combining robotics, active learning and planning.', prereqs: ['drug/synthesizability', 'drug/uncertainty-active-learning'] },
      ],
    },
    {
      id: 'quantum-drug',
      title: 'Quantum computing for drug discovery',
      summary: 'Where quantum computers might genuinely help — and the resource estimates that keep the hype in check.',
      references: [caoQC, santagati,
        { authors: 'Reiher, M., Wiebe, N., Svore, K. M., Wecker, D., Troyer, M.', title: 'Elucidating reaction mechanisms on quantum computers', year: 2017, venue: 'PNAS 114, 7555–7560' },
        { authors: 'Lee, S., Lee, J., Zhai, H., et al.', title: 'Evaluating the evidence for exponential quantum advantage in ground-state quantum chemistry', year: 2023, venue: 'Nat. Commun. 14, 1952' },
        { authors: 'Blunt, N. S., Camps, J., Crawford, O., et al.', title: 'Perspective on the current state-of-the-art of quantum computing for drug discovery applications', year: 2022, venue: 'J. Chem. Theory Comput. 18, 7001–7023' }],
      lessons: [
        { id: 'quantum-computing-drug-discovery', title: 'Quantum computing & drug discovery: an honest map', summary: 'Which drug-discovery problems are quantum-chemical, where classical methods already suffice and where qubits could help.', prereqs: ['quantum/quantum-chemistry-on-qc', 'drug/quantum-chemistry-drug-design'] },
        { id: 'quantum-resource-estimates', title: 'Resource estimates: FeMoco to P450', summary: 'Logical qubits, T-gates and runtimes for strongly correlated active spaces; why fault tolerance is needed.', prereqs: ['drug/quantum-computing-drug-discovery', 'quantum/phase-estimation'] },
        { id: 'hybrid-quantum-workflows', title: 'Hybrid quantum–classical workflows', summary: 'Embedding a quantum active-space calculation in a classical QM/MM / free-energy pipeline (Santagati 2024); VQE on today’s hardware.', prereqs: ['drug/quantum-computing-drug-discovery', 'quantum/vqe', 'drug/qm-mm'] },
        { id: 'quantum-ml-hype', title: 'Quantum ML & the hype filter', summary: 'Quantum machine learning and optimisation claims, dequantisation, and questions to ask of any quantum-advantage paper.', prereqs: ['drug/quantum-computing-drug-discovery'] },
      ],
    },
    {
      id: 'translational',
      title: 'Translational & clinical science',
      summary: 'Bridging the lab and the clinic: biomarkers, PK/PD and QSP modelling, trial design and drug repurposing.',
      references: [
        { authors: 'Morgan, P., Van Der Graaf, P. H., Arrowsmith, J., et al.', title: 'Can the flow of medicines be improved? Fundamental pharmacokinetic and pharmacological principles toward improving Phase II survival', year: 2012, venue: 'Drug Discov. Today 17, 419–424' },
        { authors: 'Pushpakom, S., Iorio, F., Eyers, P. A., et al.', title: 'Drug repurposing: progress, challenges and recommendations', year: 2019, venue: 'Nat. Rev. Drug Discov. 18, 41–58' },
        { authors: 'Nelson, M. R., Tipney, H., Painter, J. L., et al.', title: 'The support of human genetic evidence for approved drug indications', year: 2015, venue: 'Nat. Genet. 47, 856–860' },
        { authors: 'Woodcock, J., LaVange, L. M.', title: 'Master protocols to study multiple therapies, multiple diseases, or both', year: 2017, venue: 'N. Engl. J. Med. 377, 62–70' }],
      lessons: [
        { id: 'biomarkers-target-engagement', title: 'Biomarkers & target engagement', summary: 'Proof of mechanism, the three pillars of survival, companion diagnostics and patient stratification.', prereqs: ['drug/druggability', 'med/pharmacodynamics'] },
        { id: 'pkpd-qsp-modeling', title: 'PK/PD & QSP modelling', summary: 'Linking dose to exposure to effect; population PK, human dose prediction and quantitative systems pharmacology.', prereqs: ['med/pharmacokinetics', 'med/pharmacodynamics', 'drug/adme-tox'] },
        { id: 'trial-design-for-discovery', title: 'Clinical trials for discovery scientists', summary: 'Phases, endpoints, adaptive and platform trials, and what clinical failure teaches discovery.', prereqs: ['med/clinical-trial-phases', 'med/drug-regulation-approval', 'stats/hypothesis-testing'] },
        { id: 'drug-repurposing', title: 'Drug repurposing', summary: 'New uses for old drugs: signature matching, network and knowledge-graph methods, and COVID-19 lessons.', prereqs: ['drug/trial-design-for-discovery', 'bio/omics-bioinformatics'] },
        { id: 'precision-medicine-omics', title: 'Omics-driven target discovery', summary: 'GWAS, Mendelian randomisation, single-cell and perturbation atlases as sources of targets.', prereqs: ['bio/omics-bioinformatics', 'drug/druggability'] },
      ],
    },
    {
      id: 'research-practice',
      title: 'Research practice & case studies',
      summary: 'Databases, reproducibility, reading papers, landmark case studies and the open problems of the field.',
      references: [chembl, pdb, halicin,
        { authors: 'Owen, D. R., Allerton, C. M. N., Anderson, A. S., et al.', title: 'An oral SARS-CoV-2 Mpro inhibitor clinical candidate for the treatment of COVID-19', year: 2021, venue: 'Science 374, 1586–1593' },
        { authors: 'Richardson, P., Griffin, I., Tucker, C., et al.', title: 'Baricitinib as potential treatment for 2019-nCoV acute respiratory disease', year: 2020, venue: 'Lancet 395, e30–e31' },
        { authors: 'Ren, F., Aliper, A., Chen, J., et al.', title: 'A small-molecule TNIK inhibitor targets fibrosis in preclinical and clinical models', year: 2025, venue: 'Nat. Biotechnol. 43, 63–75' }],
      lessons: [
        { id: 'drug-databases', title: 'Databases: ChEMBL, PDB, PubChem & co.', summary: 'Where the data live — ChEMBL, PubChem, BindingDB, PDB, UniProt, ZINC/Enamine — and how to query them responsibly.', prereqs: ['drug/molecular-representations', 'drug/protein-representations'] },
        { id: 'reproducibility-data-quality', title: 'Reproducibility & data quality', summary: 'Mixed IC50s, irreproducible targets, benchmark hygiene, FAIR data and sharing code.', prereqs: ['drug/assay-artefacts', 'drug/benchmarks-splits-leakage'] },
        { id: 'reading-papers', title: 'Reading a computational drug-discovery paper', summary: 'A checklist: baselines, splits, prospective validation, statistics and claims vs evidence.', prereqs: ['drug/reproducibility-data-quality'] },
        { id: 'case-imatinib-hiv-pi', title: 'Case studies: imatinib & HIV protease inhibitors', summary: 'Two triumphs of target-based and structure-based design, told end to end.', prereqs: ['drug/structure-based-design-era'] },
        { id: 'case-nirmatrelvir', title: 'Case study: nirmatrelvir (Paxlovid)', summary: 'From a SARS-CoV-1 protease inhibitor to an oral COVID-19 drug in under two years; covalent design and ritonavir boosting.', prereqs: ['drug/case-imatinib-hiv-pi', 'drug/qm-mm'] },
        { id: 'case-halicin-baricitinib', title: 'Case studies: halicin & baricitinib', summary: 'Deep-learning antibiotic discovery (Stokes 2020) and knowledge-graph repurposing of baricitinib for COVID-19.', prereqs: ['drug/message-passing-networks', 'drug/drug-repurposing'] },
        { id: 'case-rentosertib', title: 'Case study: rentosertib & AI-discovered candidates', summary: 'An AI-nominated target and generatively designed TNIK inhibitor reaching phase 2 — what is really new.', prereqs: ['drug/generative-molecular-design', 'drug/ai-era'] },
        { id: 'open-problems', title: 'Open problems & research frontiers', summary: 'Affinity prediction, dynamics, data scarcity, translation and evaluation — where you can contribute.', prereqs: ['drug/reading-papers'] },
      ],
    },
  ],
} satisfies Subject;
