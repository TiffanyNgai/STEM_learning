import type { LessonMeta, LessonRef, Reference, Subject } from '../types';

const L = (id: string, title: string, summary: string, prereqs?: LessonRef[]): LessonMeta =>
  prereqs ? { id, title, summary, prereqs } : { id, title, summary };

// ---- shared references -------------------------------------------------------------
const FA: Reference = { authors: 'Le T, Bhushan V, et al.', title: 'First Aid for the USMLE Step 1', venue: 'McGraw Hill (annual editions)', year: 2024 };
const OUTLINE: Reference = { authors: 'Federation of State Medical Boards & National Board of Medical Examiners', title: 'USMLE Content Outline', url: 'https://www.usmle.org/prepare-your-exam' };
const GUYTON: Reference = { authors: 'Hall JE, Hall ME', title: 'Guyton and Hall Textbook of Medical Physiology', year: 2021, venue: '14th ed., Elsevier' };
const COSTANZO: Reference = { authors: 'Costanzo LS', title: 'Physiology', year: 2022, venue: '7th ed., Elsevier' };
const ROBBINS: Reference = { authors: 'Kumar V, Abbas AK, Aster JC', title: 'Robbins & Cotran Pathologic Basis of Disease', year: 2021, venue: '10th ed., Elsevier' };
const KATZUNG: Reference = { authors: 'Katzung BG, Vanderah TW (eds.)', title: 'Basic & Clinical Pharmacology', year: 2021, venue: '15th ed., McGraw Hill' };
const GG: Reference = { authors: 'Brunton LL, Knollmann BC (eds.)', title: "Goodman & Gilman's The Pharmacological Basis of Therapeutics", year: 2023, venue: '14th ed., McGraw Hill' };
const RANG: Reference = { authors: 'Ritter JM, Flower RJ, Henderson G, et al.', title: "Rang & Dale's Pharmacology", year: 2019, venue: '9th ed., Elsevier' };
const ROWLAND: Reference = { authors: 'Rowland M, Tozer TN', title: 'Clinical Pharmacokinetics and Pharmacodynamics: Concepts and Applications', year: 2010, venue: '4th ed., Lippincott Williams & Wilkins' };
const MOORE: Reference = { authors: 'Moore KL, Dalley AF, Agur AMR', title: 'Clinically Oriented Anatomy', year: 2018, venue: '8th ed., Wolters Kluwer' };
const HARRISON: Reference = { authors: 'Loscalzo J, Fauci AS, Kasper DL, et al. (eds.)', title: "Harrison's Principles of Internal Medicine", year: 2022, venue: '21st ed., McGraw Hill' };
const SHERRIS: Reference = { authors: 'Ryan KJ (ed.)', title: 'Sherris & Ryan\'s Medical Microbiology', year: 2022, venue: '8th ed., McGraw Hill' };
const JANEWAY: Reference = { authors: 'Murphy K, Weaver C, Berg LJ', title: "Janeway's Immunobiology", year: 2022, venue: '10th ed., W. W. Norton' };
const ROSS: Reference = { authors: 'Pawlina W', title: 'Histology: A Text and Atlas (Ross & Pawlina)', year: 2018, venue: '8th ed., Wolters Kluwer' };
const LIPPINCOTT_BIOCHEM: Reference = { authors: 'Abali EE, Cline SD, Franklin DS, Viselli SM', title: "Lippincott Illustrated Reviews: Biochemistry", year: 2021, venue: '8th ed., Wolters Kluwer' };
const THOMPSON: Reference = { authors: 'Nussbaum RL, McInnes RR, Willard HF', title: 'Thompson & Thompson Genetics in Medicine', year: 2016, venue: '8th ed., Elsevier' };
const LANGMAN: Reference = { authors: 'Sadler TW', title: "Langman's Medical Embryology", year: 2023, venue: '15th ed., Wolters Kluwer' };
const KANDEL: Reference = { authors: 'Kandel ER, Koester JD, Mack SH, Siegelbaum SA', title: 'Principles of Neural Science', year: 2021, venue: '6th ed., McGraw Hill' };
const BATES: Reference = { authors: 'Bickley LS, Szilagyi PG, Hoffman RM, Soriano RP', title: "Bates' Guide to Physical Examination and History Taking", year: 2021, venue: '13th ed., Wolters Kluwer' };
const GORDIS: Reference = { authors: 'Celentano DD, Szklo M', title: 'Gordis Epidemiology', year: 2019, venue: '6th ed., Elsevier' };
const BEAUCHAMP: Reference = { authors: 'Beauchamp TL, Childress JF', title: 'Principles of Biomedical Ethics', year: 2019, venue: '8th ed., Oxford University Press' };
const FDA_PROCESS: Reference = { authors: 'U.S. Food and Drug Administration', title: 'The Drug Development Process', url: 'https://www.fda.gov/patients/learn-about-drug-and-device-approvals/drug-development-process' };
const NAPLEX: Reference = { authors: 'National Association of Boards of Pharmacy', title: 'NAPLEX Competency Statements', url: 'https://nabp.pharmacy/programs/examinations/naplex/' };
const DIPIRO: Reference = { authors: 'DiPiro JT, Yee GC, Haines ST, et al.', title: 'DiPiro\'s Pharmacotherapy: A Pathophysiologic Approach', year: 2023, venue: '12th ed., McGraw Hill' };
const WEST: Reference = { authors: 'West JB, Luks AM', title: "West's Respiratory Physiology: The Essentials", year: 2020, venue: '11th ed., Wolters Kluwer' };
const ICH_E6: Reference = { authors: 'International Council for Harmonisation', title: 'ICH E6(R2) Guideline for Good Clinical Practice', year: 2016, url: 'https://www.ich.org/page/efficacy-guidelines' };

export default {
  id: 'med',
  name: 'Pharmacy & Medicine',
  emoji: '🩺',
  color: '#ff86d0',
  tagline: 'From cells to clinic: how the body works, fails and is treated.',
  description: String.raw`A ground-up path through the medical sciences for complete beginners, organised like the **USMLE Step 1 and Step 2 CK** content outlines (foundational sciences → organ systems → clinical reasoning, biostatistics and ethics), with pharmacy depth aligned to **NAPLEX** competency areas (pharmacokinetics, drug classes, dosing, safety, regulation). Each organ system unit runs anatomy → physiology → pathology → pharmacology, with exam-style clinical vignettes throughout.

Biology, chemistry, statistics and drug-discovery fundamentals are linked to their home lessons rather than re-taught.

> **Study material, not medical advice.** Doses, values and guidelines here are simplified for learning and change over time. Never use this course to diagnose or treat yourself or anyone else — consult a licensed clinician or pharmacist and current official prescribing information.`,
  units: [
    {
      id: 'foundations',
      title: 'Foundations: thinking like a clinician',
      summary: 'How medicine is organised and examined, the vocabulary of the body, and how to read a clinical vignette.',
      references: [OUTLINE, FA, NAPLEX],
      lessons: [
        L('how-to-study-medicine', 'How to study medicine', 'The organ-system map, spaced repetition, and how the USMLE/NAPLEX are structured.'),
        L('medical-terminology', 'Medical terminology', 'Roots, prefixes and suffixes: decode words like "cholecystectomy" and "hepatosplenomegaly".'),
        L('body-organization', 'Levels of organisation', 'Cells → tissues → organs → systems, and the idea of homeostasis.', ['bio/cell-structure']),
        L('clinical-vignette-reading', 'Reading a clinical vignette', 'Age, sex, presentation, vitals, labs: extract the clues and name the next best step.'),
        L('lab-values-units', 'Vital signs and lab values', 'Normal ranges, SI vs conventional units, and why reference intervals matter.'),
      ],
    },
    {
      id: 'anatomy',
      title: 'Gross anatomy & embryology',
      summary: 'Anatomical language and the clinically important structures of every region, plus how they develop.',
      references: [MOORE, LANGMAN, FA],
      lessons: [
        L('anatomical-terms-planes', 'Anatomical position, planes and directions', 'Sagittal, coronal, axial; proximal/distal; the language of imaging.'),
        L('thorax-anatomy', 'Thorax', 'Chest wall, mediastinum, heart surface anatomy, lungs and pleura.'),
        L('abdomen-pelvis-anatomy', 'Abdomen & pelvis', 'Peritoneum, GI blood supply (celiac, SMA, IMA), retroperitoneum, inguinal canal.'),
        L('upper-limb-anatomy', 'Upper limb & brachial plexus', 'Nerve injuries and the classic palsies (wrist drop, claw hand).'),
        L('lower-limb-anatomy', 'Lower limb', 'Lumbosacral plexus, knee injuries, compartments and gait.'),
        L('head-neck-anatomy', 'Head & neck', 'Cranial nerves, neck triangles, pharyngeal arch derivatives.'),
        L('embryology-basics', 'Embryology essentials', 'Gastrulation, germ layers, organogenesis and teratogens.'),
      ],
    },
    {
      id: 'histology',
      title: 'Histology & cell biology',
      summary: 'Tissues under the microscope and the cell machinery behind disease.',
      references: [ROSS, FA, ROBBINS],
      lessons: [
        L('epithelium-connective-tissue', 'Epithelium & connective tissue', 'Classifying epithelia; collagen types and their diseases.'),
        L('cell-junctions-cytoskeleton', 'Junctions, cytoskeleton & organelles', 'Tight/adherens/desmosomes, microtubules and the drugs that target them.', ['bio/cell-structure']),
        L('muscle-tissue', 'Muscle tissue', 'Skeletal, cardiac and smooth muscle compared.'),
        L('nervous-tissue', 'Nervous tissue', 'Neurons, glia, myelin and the blood–brain barrier.'),
        L('blood-cells-histology', 'Blood cells & bone marrow', 'Identifying cells on a smear; haematopoietic lineages.'),
        L('cell-cycle-clinical', 'Cell cycle in medicine', 'Checkpoints, tumour suppressors, and cell-cycle-specific chemotherapy.', ['bio/cell-cycle']),
      ],
    },
    {
      id: 'general-physiology',
      title: 'General physiology',
      summary: 'Homeostasis, body fluids, excitable membranes, muscle and the autonomic nervous system.',
      references: [GUYTON, COSTANZO, FA],
      lessons: [
        L('homeostasis-feedback', 'Homeostasis & feedback', 'Set points, negative and positive feedback loops.'),
        L('body-fluid-compartments', 'Body fluid compartments', 'The 60-40-20 rule, osmolarity and fluid shifts.'),
        L('membrane-potentials', 'Resting membrane potential', 'Nernst and Goldman equations; why K⁺ sets the resting potential.', ['bio/membranes-transport']),
        L('action-potentials-synapses', 'Action potentials & synapses', 'Voltage-gated channels, conduction, neurotransmission.'),
        L('muscle-contraction', 'Muscle contraction', 'Excitation–contraction coupling, length–tension, smooth muscle regulation.'),
        L('autonomic-nervous-system', 'Autonomic nervous system', 'Sympathetic vs parasympathetic wiring, transmitters and receptors.'),
      ],
    },
    {
      id: 'biochemistry-nutrition',
      title: 'Biochemistry & nutrition',
      summary: 'Clinical metabolism: what happens when pathways break, and the vitamins that keep them running.',
      references: [LIPPINCOTT_BIOCHEM, FA],
      lessons: [
        L('enzyme-kinetics-clinical', 'Enzyme kinetics in medicine', 'Km, Vmax and inhibitor types as the basis of drug action.', ['bio/enzymes']),
        L('carbohydrate-metabolism', 'Carbohydrate metabolism', 'Glycolysis, gluconeogenesis, glycogen and fed vs fasting states.', ['bio/metabolism-overview']),
        L('lipid-metabolism', 'Lipid metabolism & lipoproteins', 'Fatty-acid oxidation, ketones, cholesterol and the familial dyslipidaemias.'),
        L('amino-acid-urea-cycle', 'Amino acids & the urea cycle', 'Hyperammonaemia, PKU and other inborn errors.'),
        L('vitamins-minerals', 'Vitamins & minerals', 'Water- and fat-soluble vitamin deficiencies and toxicities.'),
        L('storage-diseases', 'Lysosomal & glycogen storage diseases', 'Enzyme defects, inheritance and classic presentations.'),
        L('nutrition-malnutrition', 'Nutrition & malnutrition', 'Energy balance, kwashiorkor vs marasmus, refeeding syndrome.'),
      ],
    },
    {
      id: 'genetics',
      title: 'Medical genetics',
      summary: 'Inheritance in the clinic, chromosomal disease, genetic testing and pharmacogenomics.',
      references: [THOMPSON, FA],
      lessons: [
        L('inheritance-patterns-clinical', 'Inheritance patterns & pedigrees', 'AD, AR, X-linked, mitochondrial; penetrance and anticipation.', ['bio/mendelian-genetics']),
        L('hardy-weinberg', 'Population genetics', 'Hardy–Weinberg and carrier-frequency calculations.'),
        L('chromosomal-disorders', 'Chromosomal disorders', 'Trisomies, sex-chromosome aneuploidies, microdeletions.'),
        L('imprinting-repeat-disorders', 'Imprinting & trinucleotide repeats', 'Prader–Willi/Angelman, fragile X, Huntington disease.'),
        L('genetic-testing', 'Genetic testing', 'Karyotype, FISH, microarray, sequencing — choosing the right test.', ['bio/pcr-sequencing']),
        L('pharmacogenomics', 'Pharmacogenomics', 'CYP2D6, CYP2C19, TPMT, HLA-B*57:01 — genotype-guided prescribing.'),
      ],
    },
    {
      id: 'microbiology',
      title: 'Microbiology',
      summary: 'Bacteria, viruses, fungi and parasites: how they cause disease and how we identify them.',
      references: [SHERRIS, FA],
      lessons: [
        L('bacterial-structure-gram-stain', 'Bacterial structure & Gram stain', 'Cell wall, capsule, spores, toxins; the lab identification flowchart.'),
        L('bacterial-genetics-virulence', 'Bacterial genetics & virulence', 'Transformation, transduction, conjugation; exotoxins vs endotoxin.'),
        L('gram-positive-pathogens', 'Gram-positive pathogens', 'Staph, strep, enterococci, clostridia, Listeria.'),
        L('gram-negative-pathogens', 'Gram-negative pathogens', 'Neisseria, enterics, Pseudomonas, Haemophilus, spirochetes.'),
        L('viruses-replication', 'Virus structure & replication', 'DNA vs RNA viruses, envelopes, and key families.', ['bio/central-dogma']),
        L('fungi-parasites', 'Fungi & parasites', 'Dimorphic fungi, opportunists, protozoa and helminths.'),
        L('sterilization-lab-diagnosis', 'Lab diagnosis & infection control', 'Cultures, PCR, serology, sterilisation vs disinfection.'),
      ],
    },
    {
      id: 'immunology',
      title: 'Immunology',
      summary: 'Innate and adaptive immunity, hypersensitivity, immunodeficiency, transplants and vaccines.',
      references: [JANEWAY, FA],
      lessons: [
        L('innate-immunity', 'Innate immunity', 'Barriers, phagocytes, complement and pattern recognition.', ['bio/immune-system-overview']),
        L('adaptive-immunity', 'Adaptive immunity', 'MHC, T- and B-cell activation, antibody classes.'),
        L('hypersensitivity-reactions', 'Hypersensitivity reactions', 'Types I–IV with clinical examples.'),
        L('immunodeficiencies', 'Immunodeficiencies', 'B, T, combined, phagocyte and complement defects.'),
        L('transplant-immunology', 'Transplant immunology', 'Rejection types and graft-versus-host disease.'),
        L('vaccines', 'Vaccines', 'Live, inactivated, subunit, conjugate and mRNA vaccines.'),
        L('immunosuppressants-biologics', 'Immunosuppressants & biologics', 'Calcineurin inhibitors, mTOR inhibitors, monoclonal antibodies.', ['bio/cell-signaling']),
      ],
    },
    {
      id: 'general-pathology',
      title: 'General pathology',
      summary: 'How cells and tissues respond to injury: adaptation, death, inflammation, repair, haemodynamics and neoplasia.',
      references: [ROBBINS, FA],
      lessons: [
        L('cell-injury-adaptation', 'Cellular adaptation & injury', 'Hypertrophy, hyperplasia, atrophy, metaplasia; reversible vs irreversible injury.'),
        L('cell-death', 'Necrosis & apoptosis', 'Patterns of necrosis and the apoptotic pathways.'),
        L('acute-inflammation', 'Acute inflammation', 'Vascular changes, leukocyte recruitment, mediators.'),
        L('chronic-inflammation-repair', 'Chronic inflammation & repair', 'Granulomas, wound healing, scar formation.'),
        L('hemodynamics-thrombosis', 'Oedema, thrombosis & embolism', 'Starling forces, Virchow triad, infarction.'),
        L('shock', 'Shock', 'Hypovolaemic, cardiogenic, distributive and obstructive shock.'),
        L('neoplasia', 'Neoplasia', 'Hallmarks of cancer, oncogenes, tumour suppressors, grading vs staging.', ['bio/gene-regulation']),
        L('carcinogens-tumor-markers', 'Carcinogens & tumour markers', 'Chemical, viral and radiation carcinogens; markers and their limits.'),
      ],
    },
    {
      id: 'pharm-principles',
      title: 'Pharmacology principles',
      summary: 'What the body does to a drug (PK), what a drug does to the body (PD), receptors, metabolism, interactions, autonomic drugs and toxicology.',
      references: [KATZUNG, GG, RANG, ROWLAND, FA],
      lessons: [
        L('pharmacokinetics', 'Pharmacokinetics', 'ADME, volume of distribution, clearance, half-life, steady state and loading doses.', ['drug/adme-tox']),
        L('pharmacodynamics', 'Pharmacodynamics', 'Dose–response, EC50, efficacy vs potency, agonists/antagonists, therapeutic index.'),
        L('drug-receptor-interactions', 'Drug–receptor interactions', 'Receptor families, occupancy, spare receptors, signalling and tolerance.', ['bio/cell-signaling', 'drug/binding-affinity']),
        L('drug-metabolism-cyp', 'Drug metabolism & CYP450', 'Phase I/II reactions, CYP inducers/inhibitors, prodrugs, first-pass effect.'),
        L('drug-interactions-special-populations', 'Interactions & special populations', 'PK/PD interactions; dosing in renal/hepatic impairment, pregnancy, children, older adults.'),
        L('cholinergic-pharmacology', 'Cholinergic drugs', 'Muscarinic/nicotinic agonists, cholinesterase inhibitors, antimuscarinics.'),
        L('adrenergic-pharmacology', 'Adrenergic drugs', 'α and β agonists and blockers; pressors.'),
        L('toxicology-basics', 'Toxicology & antidotes', 'Dose makes the poison, toxidromes, overdose management and antidotes.'),
      ],
    },
    {
      id: 'cardiovascular-physiology',
      title: 'Cardiovascular physiology',
      summary: 'How the heart pumps, how its electrical signal is recorded, and how blood pressure is controlled.',
      references: [GUYTON, COSTANZO, FA, MOORE],
      lessons: [
        L('cardiac-physiology', 'Cardiac output & its determinants', 'Heart rate, stroke volume, preload, afterload, contractility and the Frank–Starling law.'),
        L('cardiac-cycle-wiggers', 'The cardiac cycle', 'Wiggers diagram, valves, heart sounds and pressure–volume loops.'),
        L('ecg-basics', 'ECG basics', 'The conduction system, waves and intervals, rate and rhythm.'),
        L('blood-pressure-regulation', 'Blood pressure regulation', 'MAP = CO × TPR, baroreflex, RAAS and long-term control.'),
        L('microcirculation-starling', 'Microcirculation & lymph', 'Capillary exchange, Starling forces, autoregulation.'),
      ],
    },
    {
      id: 'cardiovascular-disease',
      title: 'Cardiovascular disease & drugs',
      summary: 'Hypertension, atherosclerosis, ischaemic heart disease, heart failure, arrhythmias and valve disease.',
      references: [HARRISON, ROBBINS, KATZUNG, DIPIRO],
      lessons: [
        L('hypertension-antihypertensives', 'Hypertension & antihypertensives', 'Diagnosis, first-line drug classes, compelling indications.'),
        L('atherosclerosis-lipid-drugs', 'Atherosclerosis & lipid-lowering drugs', 'Plaque biology, statins, ezetimibe, PCSK9 inhibitors.'),
        L('ischemic-heart-disease', 'Ischaemic heart disease', 'Stable angina, acute coronary syndromes, MI complications and timing.'),
        L('heart-failure', 'Heart failure', 'HFrEF vs HFpEF and the drugs that reduce mortality.'),
        L('arrhythmias-antiarrhythmics', 'Arrhythmias & antiarrhythmics', 'AF, blocks, VT; Vaughan Williams classes.'),
        L('valvular-congenital-heart', 'Valvular & congenital heart disease', 'Murmurs, stenosis vs regurgitation, shunts.'),
        L('cardiomyopathy-pericardial', 'Cardiomyopathies, endocarditis & pericardium', 'Dilated/hypertrophic/restrictive, endocarditis, tamponade.'),
      ],
    },
    {
      id: 'respiratory',
      title: 'Respiratory system',
      summary: 'Lung mechanics, gas exchange, obstructive and restrictive disease, and respiratory drugs.',
      references: [WEST, GUYTON, ROBBINS, KATZUNG],
      lessons: [
        L('lung-mechanics', 'Lung volumes & mechanics', 'Spirometry, compliance, surfactant and airway resistance.'),
        L('gas-exchange-transport', 'Gas exchange & O₂ transport', 'Alveolar gas equation, A–a gradient, the oxygen–haemoglobin curve.'),
        L('ventilation-perfusion', 'Ventilation–perfusion matching', 'V/Q mismatch, shunt and dead space; causes of hypoxaemia.'),
        L('obstructive-lung-disease', 'Obstructive lung disease', 'Asthma, COPD, bronchiectasis.'),
        L('restrictive-lung-disease', 'Restrictive & interstitial lung disease', 'Fibrosis, pneumoconioses, sarcoidosis.'),
        L('pulmonary-vascular-pe', 'Pulmonary embolism & hypertension', 'Diagnosis and management of PE; pulmonary hypertension groups.'),
        L('respiratory-pharmacology', 'Respiratory pharmacology', 'β₂ agonists, antimuscarinics, inhaled steroids, leukotriene modifiers.'),
        L('lung-infection-cancer', 'Pneumonia & lung cancer', 'Typical/atypical pneumonia; lung cancer types and paraneoplastic syndromes.'),
      ],
    },
    {
      id: 'renal-acid-base',
      title: 'Renal, urinary & acid–base',
      summary: 'Filtration, tubular transport, fluid–electrolyte balance, acid–base disorders, kidney disease and diuretics.',
      references: [COSTANZO, GUYTON, ROBBINS, KATZUNG],
      lessons: [
        L('renal-anatomy-gfr', 'Glomerular filtration & clearance', 'GFR, renal blood flow, filtration fraction, creatinine clearance.'),
        L('tubular-transport', 'Tubular transport', 'What each nephron segment reabsorbs and secretes.', ['bio/membranes-transport']),
        L('water-sodium-balance', 'Water & sodium balance', 'ADH, aldosterone, hyponatraemia and hypernatraemia.'),
        L('acid-base-disorders', 'Acid–base disorders', 'Henderson–Hasselbalch, anion gap, compensation and the stepwise approach.', ['chem/acids-bases']),
        L('electrolyte-disorders', 'Potassium, calcium & other electrolytes', 'Causes and ECG signs of hyper-/hypokalaemia and more.'),
        L('diuretics', 'Diuretics', 'Loop, thiazide, K⁺-sparing, osmotic and carbonic anhydrase inhibitors.'),
        L('kidney-disease', 'Acute & chronic kidney disease', 'Prerenal vs intrinsic vs postrenal AKI, CKD staging, glomerular disease.'),
        L('urinary-tract-disease', 'Urinary tract disease', 'Stones, UTIs, renal and bladder tumours.'),
      ],
    },
    {
      id: 'gastrointestinal',
      title: 'Gastrointestinal & hepatobiliary',
      summary: 'Digestion and absorption, GI hormones, disease from oesophagus to colon, the liver and pancreas, and GI drugs.',
      references: [GUYTON, ROBBINS, HARRISON, KATZUNG],
      lessons: [
        L('gi-physiology', 'GI physiology & hormones', 'Gastrin, CCK, secretin; acid secretion; digestion and absorption.'),
        L('esophagus-stomach-disease', 'Oesophagus & stomach disease', 'GERD, Barrett, peptic ulcer, H. pylori, gastric cancer.'),
        L('intestinal-disease', 'Small & large bowel disease', 'Malabsorption, IBD, diverticular disease, colorectal cancer.'),
        L('liver-disease', 'Liver disease', 'Liver function tests, hepatitis, cirrhosis and its complications.'),
        L('biliary-pancreas-disease', 'Biliary tree & pancreas', 'Gallstones, cholangitis, pancreatitis, pancreatic cancer.'),
        L('gi-pharmacology', 'GI pharmacology', 'PPIs, H₂ blockers, antiemetics, laxatives, IBD drugs.'),
      ],
    },
    {
      id: 'endocrine',
      title: 'Endocrine system',
      summary: 'Hormonal axes, thyroid, adrenal, diabetes, calcium and bone, and their drugs.',
      references: [GUYTON, ROBBINS, HARRISON, KATZUNG],
      lessons: [
        L('hypothalamic-pituitary-axis', 'Hypothalamic–pituitary axes', 'Feedback loops and pituitary disorders.', ['bio/cell-signaling']),
        L('thyroid', 'Thyroid', 'Hyper- and hypothyroidism, nodules, thyroid drugs.'),
        L('adrenal', 'Adrenal gland', 'Cushing, Addison, hyperaldosteronism, pheochromocytoma; corticosteroids.'),
        L('diabetes-mellitus', 'Diabetes mellitus', 'Type 1 vs type 2, diagnosis, acute and chronic complications.'),
        L('diabetes-drugs', 'Diabetes pharmacology', 'Insulins, metformin, SGLT2 inhibitors, GLP-1 agonists and more.'),
        L('calcium-bone-metabolism', 'Calcium, PTH & vitamin D', 'Parathyroid disorders and osteoporosis drugs.'),
        L('endocrine-neoplasia', 'Endocrine tumours & MEN syndromes', 'MEN 1/2A/2B, carcinoid, insulinoma.'),
      ],
    },
    {
      id: 'reproductive',
      title: 'Reproductive system',
      summary: 'Reproductive hormones, pregnancy, contraception, and gynaecological, breast and male pathology.',
      references: [GUYTON, ROBBINS, LANGMAN, KATZUNG],
      lessons: [
        L('reproductive-hormones-cycle', 'Reproductive hormones & the menstrual cycle', 'HPG axis, follicular and luteal phases, spermatogenesis.'),
        L('pregnancy-physiology', 'Pregnancy & lactation', 'hCG, placental physiology, maternal adaptations, complications.'),
        L('contraception-hormone-therapy', 'Contraception & hormone therapy', 'Combined pills, progestins, IUDs, SERMs, androgens.'),
        L('gynecologic-pathology', 'Gynaecological pathology', 'PCOS, endometriosis, cervical, endometrial and ovarian tumours.'),
        L('breast-pathology', 'Breast pathology', 'Benign lesions and breast cancer subtypes.'),
        L('male-reproductive-pathology', 'Male reproductive pathology', 'BPH, prostate and testicular cancer, erectile dysfunction drugs.'),
      ],
    },
    {
      id: 'neuro-psych',
      title: 'Nervous system & psychiatry',
      summary: 'Neuroanatomy and lesions, stroke, seizures, neurodegeneration, pain, and psychiatric disorders with their drugs.',
      references: [KANDEL, ROBBINS, KATZUNG, HARRISON],
      lessons: [
        L('neuroanatomy-lesions', 'Neuroanatomy & lesion localisation', 'Spinal tracts, brainstem, cortex; where is the lesion?'),
        L('stroke-cerebrovascular', 'Stroke & cerebrovascular disease', 'Ischaemic vs haemorrhagic stroke, vascular territories, thrombolysis.'),
        L('seizures-antiepileptics', 'Seizures & antiepileptic drugs', 'Seizure types and drug choice; key toxicities.'),
        L('neurodegeneration-movement', 'Neurodegeneration & movement disorders', 'Alzheimer, Parkinson, MS; their drugs.'),
        L('pain-opioids-anesthetics', 'Pain, opioids & anaesthetics', 'Opioid pharmacology, local and general anaesthetics.'),
        L('mood-anxiety-drugs', 'Mood & anxiety disorders', 'Depression, bipolar disorder, anxiety; SSRIs, lithium, benzodiazepines.'),
        L('psychosis-antipsychotics', 'Psychosis & antipsychotics', 'Schizophrenia, typical vs atypical antipsychotics, adverse effects.'),
        L('substance-use-disorders', 'Substance use disorders', 'Intoxication and withdrawal syndromes; treatment.'),
      ],
    },
    {
      id: 'msk-skin',
      title: 'Musculoskeletal, skin & connective tissue',
      summary: 'Bone and joint disease, autoimmune connective-tissue disorders, dermatology and their drugs.',
      references: [ROBBINS, HARRISON, KATZUNG, MOORE],
      lessons: [
        L('bone-joint-physiology', 'Bone & joint biology', 'Remodelling, cartilage and metabolic bone disease.'),
        L('arthritis', 'Arthritis', 'Osteoarthritis vs rheumatoid arthritis; gout and pseudogout.'),
        L('autoimmune-connective-tissue', 'Autoimmune connective-tissue disease', 'SLE, Sjögren, scleroderma, vasculitides; autoantibodies.'),
        L('anti-inflammatory-drugs', 'NSAIDs, DMARDs & gout drugs', 'COX inhibition, methotrexate, biologics, allopurinol, colchicine.'),
        L('bone-tumors-msk-injury', 'Bone tumours & MSK injuries', 'Classic tumours and sports injuries.'),
        L('skin-lesions-dermatology', 'Skin lesions & dermatology', 'Describing lesions; eczema, psoriasis, blistering diseases.'),
        L('skin-cancer', 'Skin cancer', 'Basal cell, squamous cell carcinoma and melanoma.'),
      ],
    },
    {
      id: 'heme-onc',
      title: 'Haematology & oncology',
      summary: 'Anaemias, haemostasis and anticoagulants, haematological malignancies, and cancer pharmacology.',
      references: [ROBBINS, HARRISON, KATZUNG, GG],
      lessons: [
        L('hematopoiesis-blood-counts', 'Haematopoiesis & the blood count', 'Reading a CBC, indices and the smear.'),
        L('anemias', 'Anaemias', 'Microcytic, normocytic and macrocytic; haemolysis.'),
        L('hemostasis-coagulation', 'Haemostasis & coagulation', 'Platelets, the coagulation cascade, PT/aPTT.'),
        L('bleeding-thrombotic-disorders', 'Bleeding & thrombotic disorders', 'Haemophilia, von Willebrand disease, DIC, thrombophilias.'),
        L('anticoagulants-antiplatelets', 'Anticoagulants, antiplatelets & thrombolytics', 'Heparins, warfarin, DOACs, aspirin, P2Y12 inhibitors, reversal agents.'),
        L('leukemia-lymphoma', 'Leukaemias, lymphomas & myeloma', 'Classification and classic presentations.'),
        L('cancer-chemotherapy', 'Cancer chemotherapy', 'Cytotoxic drug classes, mechanisms and toxicities.', ['bio/cell-cycle']),
        L('targeted-immunotherapy', 'Targeted therapy & immunotherapy', 'Kinase inhibitors, monoclonal antibodies, checkpoint inhibitors, CAR-T.'),
      ],
    },
    {
      id: 'infectious-disease',
      title: 'Infectious disease & antimicrobials',
      summary: 'Antibiotic mechanisms and resistance, antivirals, antifungals, and clinical infectious syndromes.',
      references: [SHERRIS, HARRISON, KATZUNG, GG],
      lessons: [
        L('antimicrobial-principles', 'Antimicrobial principles & resistance', 'Spectrum, MIC, bactericidal vs static, stewardship.'),
        L('cell-wall-antibiotics', 'Cell-wall antibiotics', 'Penicillins, cephalosporins, carbapenems, vancomycin.'),
        L('protein-synthesis-inhibitors', 'Protein-synthesis inhibitors', 'Aminoglycosides, tetracyclines, macrolides, linezolid.', ['bio/translation']),
        L('other-antibacterials-tb', 'Other antibacterials & TB drugs', 'Fluoroquinolones, sulfonamides, metronidazole; RIPE therapy.'),
        L('antivirals-hiv', 'Antivirals & HIV', 'HIV life cycle and antiretroviral classes; herpes and influenza drugs.'),
        L('antifungals-antiparasitics', 'Antifungals & antiparasitics', 'Azoles, echinocandins, amphotericin; antimalarials.'),
        L('clinical-infectious-syndromes', 'Clinical infectious syndromes', 'Sepsis, pneumonia, meningitis, UTI, STIs — empirical therapy.'),
      ],
    },
    {
      id: 'clinical-skills',
      title: 'Clinical skills & reasoning',
      summary: 'History and examination, diagnostic reasoning, emergencies, prevention and medication safety (Step 2 CK style).',
      references: [BATES, HARRISON, OUTLINE],
      lessons: [
        L('history-physical-exam', 'History & physical examination', 'Structure of the history; key examination findings.'),
        L('clinical-reasoning', 'Diagnostic reasoning', 'Differential diagnosis, pre-test probability, likelihood ratios.', ['stats/conditional-probability-bayes']),
        L('lab-imaging-interpretation', 'Interpreting labs & imaging', 'Choosing and reading the right test.'),
        L('emergency-medicine', 'Emergencies & resuscitation', 'ABCDE approach, ACLS rhythms, anaphylaxis, trauma.'),
        L('preventive-medicine', 'Preventive medicine & screening', 'Screening programmes and immunisation schedules.'),
        L('medication-safety', 'Prescribing & medication safety', 'Prescription writing, medication reconciliation, error prevention, pharmacy calculations.'),
      ],
    },
    {
      id: 'biostats-epi',
      title: 'Biostatistics & epidemiology',
      summary: 'Study designs, measures of risk, diagnostic test metrics, bias and evidence-based medicine.',
      references: [GORDIS, FA, OUTLINE],
      lessons: [
        L('study-designs', 'Study designs', 'Case–control, cohort, cross-sectional, RCT, meta-analysis.', ['stats/experimental-design']),
        L('measures-of-risk', 'Measures of risk', 'Incidence, prevalence, RR, OR, ARR, NNT and NNH.'),
        L('diagnostic-test-metrics', 'Diagnostic test metrics', 'Sensitivity, specificity, PPV/NPV, ROC curves.', ['stats/conditional-probability-bayes']),
        L('clinical-statistics', 'Statistics for clinicians', 'p-values, confidence intervals, error types, power.', ['stats/hypothesis-testing', 'stats/confidence-intervals']),
        L('bias-confounding', 'Bias & confounding', 'Selection, information, lead-time and length-time bias; confounding.', ['stats/causal-inference-intro']),
        L('evidence-based-medicine', 'Evidence-based medicine', 'Asking answerable questions (PICO), levels of evidence, critical appraisal.'),
      ],
    },
    {
      id: 'ethics-law-communication',
      title: 'Ethics, law & communication',
      summary: 'Core ethical principles, consent and capacity, confidentiality, end-of-life care, communication and pharmacy law.',
      references: [BEAUCHAMP, OUTLINE, NAPLEX],
      lessons: [
        L('ethical-principles', 'Ethical principles', 'Autonomy, beneficence, non-maleficence, justice.'),
        L('informed-consent-capacity', 'Informed consent & capacity', 'Elements of consent, minors, surrogates and exceptions.'),
        L('confidentiality-reporting', 'Confidentiality & mandatory reporting', 'HIPAA-style privacy, duty to warn, reportable conditions.'),
        L('end-of-life-care', 'End-of-life care', 'Advance directives, withdrawal of care, palliation.'),
        L('patient-communication', 'Communicating with patients', 'Breaking bad news, interpreters, motivational interviewing.'),
        L('patient-safety-quality', 'Patient safety & quality improvement', 'Error types, root-cause analysis, PDSA cycles.'),
        L('pharmacy-law', 'Pharmacy law & controlled substances', 'Drug schedules, prescription requirements, dispensing rules.'),
      ],
    },
    {
      id: 'drug-development-regulation',
      title: 'Drug development & regulation',
      summary: 'From candidate to market and beyond: clinical trials, regulators (FDA, EMA, Health Canada), pharmacovigilance and pharmaceutics.',
      references: [FDA_PROCESS, ICH_E6, KATZUNG, NAPLEX],
      lessons: [
        L('clinical-trial-phases', 'Clinical trial phases', 'Preclinical → phase 0–IV: aims, size, design and endpoints.', ['drug/drug-discovery-pipeline']),
        L('drug-regulation-approval', 'Drug regulation & approval', 'IND/NDA/BLA, EMA and Health Canada pathways, accelerated approval, labelling.'),
        L('pharmacovigilance', 'Pharmacovigilance & adverse drug reactions', 'ADR classification, signal detection, REMS and boxed warnings.'),
        L('generics-biosimilars', 'Generics & biosimilars', 'Bioequivalence, interchangeability, patents and exclusivity.'),
        L('pharmaceutics-dosage-forms', 'Pharmaceutics & dosage forms', 'Formulations, release mechanisms, compounding, stability.', ['drug/drug-likeness']),
      ],
    },
  ],
} satisfies Subject;
