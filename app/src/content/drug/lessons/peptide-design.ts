import type { LessonContent } from '../../types';

const spaceSvg = `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
<g font-size="8">
<text x="160" y="12" text-anchor="middle" fill="var(--fg)" font-weight="700">peptides live in the gap</text>
<rect x="10" y="26" width="86" height="56" rx="7" fill="var(--c2)" fill-opacity="0.12" stroke="var(--c2)"/>
<text x="53" y="42" text-anchor="middle" fill="var(--c2)" font-weight="700">small molecules</text>
<text x="53" y="56" text-anchor="middle" fill="var(--muted)">&lt; 500 Da</text>
<text x="53" y="68" text-anchor="middle" fill="var(--muted)">oral, cell-permeable</text>
<rect x="104" y="26" width="112" height="56" rx="7" fill="var(--c1)" fill-opacity="0.18" stroke="var(--c1)" stroke-width="1.6"/>
<text x="160" y="42" text-anchor="middle" fill="var(--c1)" font-weight="700">peptides &amp; macrocycles</text>
<text x="160" y="56" text-anchor="middle" fill="var(--muted)">~500–5000 Da</text>
<text x="160" y="68" text-anchor="middle" fill="var(--muted)">big enough for flat interfaces</text>
<rect x="224" y="26" width="86" height="56" rx="7" fill="var(--c4)" fill-opacity="0.12" stroke="var(--c4)"/>
<text x="267" y="42" text-anchor="middle" fill="var(--c4)" font-weight="700">biologics</text>
<text x="267" y="56" text-anchor="middle" fill="var(--muted)">&gt; 10 kDa</text>
<text x="267" y="68" text-anchor="middle" fill="var(--muted)">injected, extracellular</text>

<text x="10" y="106" fill="var(--fg)" font-weight="700">what you gain going right:</text>
<text x="10" y="118" fill="var(--muted)">more contact area, so flat protein–protein interfaces become bindable</text>
<text x="10" y="138" fill="var(--fg)" font-weight="700">what you lose going right:</text>
<text x="10" y="150" fill="var(--muted)">passive membrane permeability, oral dosing, protease resistance</text>
<path d="M18,164 L300,164" stroke="var(--muted)" stroke-dasharray="3 3"/>
<text x="160" y="176" text-anchor="middle" fill="var(--fg)" font-weight="700">peptide design is the work of keeping some of both</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The awkward middle',
      body: String.raw`A small molecule crosses membranes and survives a stomach, but it is too small to cover a flat protein–protein interface. An antibody covers the interface beautifully, but it is injected, it cannot enter a cell, and it costs a fortune to manufacture.

Between them sit **peptides and macrocycles**, roughly 500 to 5000 daltons. There are over eighty approved peptide drugs — insulin, oxytocin, cyclosporin, octreotide, the GLP-1 agonists — and the class has been growing steadily for two decades (Muttenthaler et al. 2021).

The appeal is obvious: enough surface to engage a flat target with real specificity, while still being chemically synthesisable. The catch is equally obvious, and it is the subject of this lesson. A linear peptide made of natural amino acids is, from the body's point of view, lunch.`,
      widget: { type: 'SvgDiagram', props: { svg: spaceSvg }, caption: 'Every property that makes a peptide good at binding a flat interface is a property that makes it bad at being a drug.' },
    },
    {
      kind: 'explain',
      title: 'Three clocks running against you',
      body: String.raw`A natural peptide injected into blood faces three independent problems.

**1. Proteases.** Blood, gut and liver are full of enzymes evolved to cut exactly this bond. Exopeptidases chew inward from the free N- and C-termini; endopeptidases cut in the middle at recognised motifs. Serum half-lives of minutes are normal.

**2. Renal clearance.** The glomerulus filters more or less anything below about 5 kDa. Even a protease-proof peptide is simply urinated away unless something keeps it in circulation.

**3. No passive permeability.** The peptide backbone is a regular array of hydrogen-bond donors (N–H) and acceptors (C=O). Crossing a lipid membrane means stripping the water off all of them, which is expensive. So peptides generally do not cross membranes, do not reach intracellular targets, and are not orally absorbed.

Peptide design is almost entirely the business of defeating these three while keeping the binding you started with. Every trick below is aimed at one of them.`,
    },
    {
      kind: 'recall',
      title: 'Permeability, from ADME',
      points: [
        'Passive transcellular absorption needs a molecule to shed its water shell and enter a lipid bilayer.',
        '**Hydrogen-bond donor count** is the property that correlates best with passive permeability — each donor costs desolvation energy.',
        'Polar surface area (TPSA) and lipophilicity (logP / logD) are the usual companion descriptors.',
        'Beyond the rule of five, oral drugs exist, but they are the exception and they share specific structural features.',
      ],
      link: 'drug/solubility-permeability',
    },
    {
      kind: 'mcq',
      prompt: 'Native GLP-1 binds its receptor with high affinity and produces the desired effect when infused. Why is it not itself a drug?',
      choices: [
        'It does not bind tightly enough to be efficacious',
        'It is cleaved by DPP-4 and cleared so fast that its circulating half-life is only a couple of minutes',
        'It is too large to be manufactured synthetically',
        'It cannot be given by injection',
      ],
      answer: 1,
      why: 'Affinity was never the problem. Dipeptidyl peptidase-4 clips the first two residues from the N-terminus almost immediately, and renal clearance removes the rest, leaving a half-life of roughly two minutes — hopeless for a chronic medicine. A 31-residue peptide is routine to synthesise, and injection is the normal route for this class.',
    },
    {
      kind: 'explain',
      title: 'Constrain the shape: cyclisation and stapling',
      body: String.raw`A linear peptide in water is a floppy ensemble. Only a small fraction of the time does it hold the conformation that binds — so you pay a large entropic price on binding, and all those free termini and exposed bonds are protease bait.

**Cyclisation** fixes both. A head-to-tail macrocycle has no free termini for exopeptidases and a far smaller conformational ensemble. Disulfide and side-chain-to-side-chain bridges do the same job locally; nature uses this constantly, in conotoxins, defensins and cyclotides.

**Stapling** is the version for α-helices. Schafmeister, Po and Verdine (2000) installed two α-methyl, α-alkenyl amino acids at positions $i$ and $i+4$ — one turn of a helix — and joined them by ring-closing metathesis into an all-hydrocarbon cross-link. The helix is pre-organised before it ever meets the target. Walensky et al. (2004) stapled the BH3 helix of BID and showed the result was helical, protease-resistant, cell-permeable and active in a mouse leukaemia model, which is what launched the field.

Honesty check: stapled peptides have had a hard clinical road. ALRN-6924, a stapled peptide targeting the p53–MDM2/MDMX interaction, went furthest — through phase I and into phase Ib — and was never approved: its developer missed the endpoints of two phase Ib chemoprotection trials and discontinued the programme in 2023. Pre-organisation is a real and reproducible biophysical effect; turning it into a medicine is a separate problem.`,
    },
    {
      kind: 'widget',
      title: 'Three ways to rescue a peptide',
      body: String.raw`Switch between the linear, stapled and cyclic forms of the same twelve residues and watch helicity, protease half-life and permeability move. Then turn up the N-methylation and watch the hydrogen-bond donor count — and the permeability score — respond.`,
      widget: {
        type: 'DrugPeptideStaple',
        props: { form: 'stapled', nMethyl: 0 },
        caption: 'The numbers are illustrative trends for teaching, not measurements of a particular peptide. The directions are the real content.',
      },
    },
    {
      kind: 'truefalse',
      prompt: 'Stapling a peptide reliably makes it cell-permeable.',
      answer: false,
      why: 'Stapling reliably raises helicity and protease resistance; cell uptake is much less reliable and depends strongly on the staple position, net charge and overall hydrophobicity. Several published stapled peptides enter cells poorly or enter by endocytosis and never escape the endosome, and uptake claims based on fluorescent microscopy of fixed cells have been a recurring source of over-interpretation.',
    },
    {
      kind: 'explain',
      title: 'Hide the hydrogen bonds: N-methylation and chameleons',
      body: String.raw`If backbone N–H donors are what blocks membrane crossing, there are two ways to deal with them: remove them or hide them.

**N-methylation** removes them. Replacing a backbone N–H with N–CH₃ deletes one donor permanently, and also restricts the backbone conformations available, which further rigidifies the ring.

**Intramolecular hydrogen bonding** hides them. A macrocycle can fold so that its donors pair with its own acceptors. The elegant part is that this is **environment-dependent**: in water the molecule opens up and presents polar groups to the solvent, keeping it soluble; in a membrane it closes, buries its own polarity, and crosses. Molecules that do this are called **chameleonic**.

The canonical example is **cyclosporin A**: an 11-residue cyclic peptide of 1202 Da with seven N-methylated amides, orally bioavailable, and in clinical use since the 1980s. It violates every rule of five by a wide margin. It is the standing proof that "beyond rule of five" oral space is real — and, because so few molecules manage it, also proof that reaching it is extremely hard.`,
    },
    {
      kind: 'widget',
      title: 'Donors versus permeability',
      body: String.raw`Take the cyclic form and raise the N-methyl count. Each methylation removes one backbone donor; the permeability score climbs. This is the single most reliable structure–permeability relationship in macrocycle design, and the reason N-methyl scans are a standard medicinal-chemistry campaign.`,
      widget: {
        type: 'DrugPeptideStaple',
        props: { form: 'cyclic', nMethyl: 3 },
        caption: 'Donor count is not the whole story — ring size, side-chain polarity and the ability to form intramolecular hydrogen bonds all matter — but it is the strongest single correlate.',
      },
    },
    {
      kind: 'explain',
      title: 'The GLP-1 case study: engineering a two-minute peptide into a weekly drug',
      body: String.raw`GLP-1 analogues are the clearest worked example of peptide engineering in the clinic, and every modification has a reason.

**Native GLP-1**: 31 residues, half-life about **2 minutes**. DPP-4 cleaves after the alanine at position 8; renal clearance removes the rest.

**Liraglutide** (once daily): a C16 palmitic acid attached through a glutamate spacer to Lys26, plus Lys34→Arg. The fatty acid binds **serum albumin** reversibly, so the peptide travels as a large complex — too big to filter, and shielded from peptidases. Half-life rises to about **13 hours**.

**Semaglutide** (once weekly, Lau et al. 2015): three changes stacked.
1. Ala8 → **Aib** (α-aminoisobutyric acid), a non-natural, doubly methylated residue that DPP-4 cannot process. The protease problem is solved at the chemistry level, not by hiding.
2. Lys34 → Arg, so acylation goes to a single defined site.
3. A **C18 fatty diacid** on Lys26 through a γ-glutamate plus two short polyethylene-glycol-like spacers, giving much stronger albumin binding than liraglutide's C16 chain.

Half-life: about **165 hours**, roughly one week.

**Oral semaglutide** goes one step further, co-formulated with **SNAC**, an absorption enhancer that transiently raises gastric pH and promotes local absorption. It works — and absolute bioavailability is only about **0.4–1 %**, so the oral tablet (up to 14 mg daily) contains far more peptide than the weekly injection (up to about 2 mg). That number is the honest measure of how hard oral peptide delivery remains.`,
    },
    {
      kind: 'numeric',
      prompt: 'Semaglutide has a terminal half-life of about 165 hours. What fraction of a dose remains 168 hours (one week) later, assuming first-order elimination? Give two decimal places.',
      answer: 0.49,
      tolerance: 0.03,
      why: 'The remaining fraction is 0.5^(168/165) = 0.5^1.018 = 0.49. Just under half the previous dose is still present when the next is given, which is exactly what produces the smooth steady-state plasma concentration that weekly dosing needs. A 13-hour half-life would leave 0.5^(168/13), about one part in 7000 — hence daily dosing for liraglutide.',
    },
    {
      kind: 'order',
      prompt: 'Order the engineering problems solved on the way from native GLP-1 to a once-weekly drug.',
      steps: [
        'Identify the DPP-4 cleavage site at the N-terminus',
        'Replace the cleaved residue with a non-natural amino acid the protease cannot process',
        'Remove the second lysine so that acylation occurs at one defined position',
        'Attach a fatty diacid through a spacer so the peptide binds serum albumin',
        'Confirm that albumin binding slows renal clearance enough for weekly dosing',
        'Co-formulate with an absorption enhancer if an oral form is wanted',
      ],
      why: 'Proteolysis and renal clearance are separate clocks and need separate fixes: a non-natural residue blocks the enzyme, while albumin binding defeats filtration by making the effective species too large. Oral absorption is a third problem entirely, which is why it required a formulation answer rather than a chemical one.',
    },
    {
      kind: 'explain',
      title: 'Why computation struggles here',
      body: String.raw`Peptides and macrocycles are, computationally, the hardest of the three modality classes — harder than small molecules and harder than folded proteins.

- **The conformational ensemble is the molecule.** A macrocycle populates many low-energy conformers in solution, the bioactive one may be a minor population, and the ensemble *shifts with the environment*. Docking a single conformer into a pocket is close to meaningless. Permeability prediction in particular requires knowing the water-exposed and membrane-exposed ensembles, which is two expensive simulations, not one.
- **Force fields are weakest exactly here.** N-methylated amides, D-amino acids, Aib, hydrocarbon staples and macrocyclic ring strain are all poorly covered by parameter sets fitted to natural proteins or to drug-like organics.
- **Structure predictors were not trained for this.** AlphaFold2 expects a folded chain with evolutionary context; a 12-residue cyclic peptide has neither. Specialised adaptations exist — Rettie et al. (2023) showed AlphaFold2 can be modified to predict and design cyclic peptide structures — but this is a young area.
- **The discovery methods outrun the models.** mRNA display, notably the RaPID system, generates and selects libraries of $10^{12}$–$10^{13}$ cyclic peptides containing non-natural residues in a test tube. When an experiment can search $10^{13}$ molecules, computational screening has to offer something other than throughput.`,
    },
    {
      kind: 'multi',
      prompt: 'Which factors make macrocyclic peptides genuinely hard to model? (Select all.)',
      choices: [
        'They populate many low-energy conformers, and the ensemble changes with the solvent environment',
        'Common force fields poorly cover N-methylated backbones, Aib, D-amino acids and ring strain',
        'They have no defined three-dimensional structure of any kind',
        'Permeability depends on conformational behaviour in two different environments, not on a single descriptor',
        'Structure predictors trained on folded proteins have little relevant signal for a short cyclic peptide',
      ],
      answers: [0, 1, 3, 4],
      why: 'Shifting ensembles, missing force-field parameters, environment-dependent permeability and the mismatch with protein structure predictors are all real obstacles. Saying they have no 3D structure overstates it: a macrocycle is quite constrained compared with a linear peptide, and some adopt one dominant conformation — the difficulty is that you cannot assume which.',
    },
    {
      kind: 'match',
      prompt: 'Match each modification to the problem it is designed to solve.',
      pairs: [
        ['Head-to-tail cyclisation', 'Removes the free termini that exopeptidases attack'],
        ['Hydrocarbon staple at i and i+4', 'Pre-organises an α-helix so less entropy is lost on binding'],
        ['Backbone N-methylation', 'Removes hydrogen-bond donors that block membrane crossing'],
        ['Non-natural residue at a cleavage site', 'Blocks one specific protease that the native sequence invites'],
        ['Fatty-acid chain with a spacer', 'Binds serum albumin so the peptide escapes renal filtration'],
      ],
      why: 'Each trick attacks exactly one of the three clocks — proteolysis, renal clearance, impermeability — and a real drug usually stacks several, as semaglutide does. Knowing which problem a modification solves tells you immediately which one it does not.',
    },
    {
      kind: 'fill',
      prompt: 'Peptides are destroyed by ___ , filtered by the kidney below about 5 kDa, and blocked from membranes by their backbone hydrogen-bond ___ . Stapling and cyclisation fix the shape; ___ removes donors, as in cyclosporin A; and attaching a fatty acid lets the peptide bind serum ___ so that it is no longer filtered.',
      bank: ['proteases', 'donors', 'N-methylation', 'albumin', 'acceptors', 'glycosylation'],
      answer: ['proteases', 'donors', 'N-methylation', 'albumin'],
      why: 'The three clocks and their standard counter-measures. Acceptors (the backbone carbonyls) also cost desolvation energy, but it is the donor count that correlates best with passive permeability and that N-methylation actually removes.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Peptides occupy the space between small molecules and biologics: enough surface for flat protein–protein interfaces, still chemically synthesisable, with **over eighty approved drugs**.
- Three independent problems: **proteolysis**, **renal clearance** below about 5 kDa, and **no passive permeability** because the backbone is an array of hydrogen-bond donors.
- **Cyclisation** removes termini and shrinks the conformational ensemble; **stapling** (Schafmeister et al. 2000) pre-organises a helix at $i$, $i+4$. Both are reproducible biophysics; neither guarantees cell entry or a clinical success.
- **N-methylation** deletes donors and **chameleonic** intramolecular hydrogen bonding hides them. **Cyclosporin A** — 1202 Da, seven N-methyls, orally bioavailable — proves the beyond-rule-of-five oral space is real and rare.
- **Semaglutide** stacks three fixes on a 2-minute peptide: **Aib** to block DPP-4, a single acylation site, and a **C18 diacid** for albumin binding, giving a ~165 h half-life. Oral dosing needed an absorption enhancer and still achieves only about **0.4–1 %** bioavailability.
- Computationally this is the hardest modality: **environment-dependent conformational ensembles**, weak force-field coverage of non-natural backbones, structure predictors out of their domain, and experimental selection methods that already search $10^{13}$ macrocycles.`,
    },
  ],
  references: [
    { authors: 'Muttenthaler, M., King, G. F., Adams, D. J., Alewood, P. F.', title: 'Trends in peptide drug discovery', year: 2021, venue: 'Nat. Rev. Drug Discov. 20, 309–325' },
    { authors: 'Schafmeister, C. E., Po, J., Verdine, G. L.', title: 'An all-hydrocarbon cross-linking system for enhancing the helicity and metabolic resistance of peptides', year: 2000, venue: 'J. Am. Chem. Soc. 122, 5891–5892' },
    { authors: 'Walensky, L. D., Kung, A. L., Escher, I., et al.', title: 'Activation of apoptosis in vivo by a hydrocarbon-stapled BH3 helix', year: 2004, venue: 'Science 305, 1466–1470' },
    { authors: 'Lau, J., Bloch, P., Schäffer, L., et al.', title: 'Discovery of the once-weekly glucagon-like peptide-1 (GLP-1) analogue semaglutide', year: 2015, venue: 'J. Med. Chem. 58, 7370–7380' },
    { authors: 'Doak, B. C., Over, B., Giordanetto, F., Kihlberg, J.', title: 'Oral druggable space beyond the rule of 5: insights from drugs and clinical candidates', year: 2014, venue: 'Chem. Biol. 21, 1115–1142' },
  ],
} satisfies LessonContent;
