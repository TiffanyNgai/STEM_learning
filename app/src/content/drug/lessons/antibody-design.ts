import type { LessonContent } from '../../types';

const iggSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
<g font-size="8" text-anchor="middle">
<text x="160" y="12" fill="var(--fg)" font-weight="700">IgG: two heavy chains, two light chains</text>
<g stroke-width="9" stroke-linecap="round" fill="none">
<path d="M96,44 L124,86" stroke="var(--c2)"/>
<path d="M224,44 L196,86" stroke="var(--c2)"/>
<path d="M68,38 L96,44" stroke="var(--c3)"/>
<path d="M252,38 L224,44" stroke="var(--c3)"/>
<path d="M124,86 L160,112" stroke="var(--c4)"/>
<path d="M196,86 L160,112" stroke="var(--c4)"/>
<path d="M160,112 L160,164" stroke="var(--c5)"/>
</g>
<text x="160" y="178" fill="var(--c5)">Fc — effector function, long half-life</text>
<text x="124" y="104" fill="var(--c4)" font-size="7.5">Fab</text>
<text x="46" y="30" fill="var(--c3)" font-size="7.5">VL</text>
<text x="274" y="30" fill="var(--c3)" font-size="7.5">VL</text>
<text x="86" y="60" fill="var(--c2)" font-size="7.5">VH</text>
<text x="234" y="60" fill="var(--c2)" font-size="7.5">VH</text>
<g>
<circle cx="78" cy="34" r="4" fill="var(--c1)"><animate attributeName="r" values="4;5.6;4" dur="3s" repeatCount="indefinite"/></circle>
<circle cx="242" cy="34" r="4" fill="var(--c1)"><animate attributeName="r" values="4;5.6;4" dur="3s" repeatCount="indefinite"/></circle>
</g>
<text x="160" y="196" fill="var(--muted)">the six CDR loops sit at the two tips (orange) — that is the whole binding site</text>
<text x="160" y="36" fill="var(--muted)" font-size="7.5">VH + VL together = the Fv, the minimal binding unit</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The best-selling molecules in medicine',
      body: String.raw`Monoclonal antibodies are the commercial centre of modern pharmaceuticals. More than a hundred are approved, they dominate the list of highest-revenue medicines, and they reach targets small molecules cannot: flat protein–protein interfaces, cell-surface receptors, circulating cytokines.

They are also a design problem with an unusual shape. The scaffold is **fixed** — an immunoglobulin fold that nature has already optimised for stability, expression and a long serum half-life — and essentially all the variation lives in six loops at one end. You are not designing a protein from scratch. You are designing six loops on a chassis.

That should make it easier than [de novo protein design](@drug/protein-design). In several important respects it is harder, and this lesson is about why.`,
    },
    {
      kind: 'recall',
      title: 'Where antibodies come from',
      points: [
        'B cells each express one antibody; the repertoire is built by **V(D)J recombination** shuffling gene segments.',
        'On encountering antigen, B cells undergo **somatic hypermutation** and are selected for binding — affinity maturation.',
        'An **antigen** is what is bound; the **epitope** is the specific patch of it the antibody touches.',
        'The constant region (**Fc**) is what recruits other immune machinery and gives IgG its weeks-long half-life.',
      ],
      link: 'bio/immune-system-overview',
    },
    {
      kind: 'explain',
      title: 'Anatomy, and the six loops that matter',
      body: String.raw`An IgG is two identical **heavy** chains and two identical **light** chains. Cut it in two and you get the **Fab** arms, which bind, and the **Fc** stem, which does everything else.

The business end of a Fab is the **Fv**: one heavy-chain variable domain (VH) packed against one light-chain variable domain (VL). Each variable domain is a β-sandwich whose strands are conserved **framework** regions, with three hypervariable loops at the top. Six loops in total — **CDR-H1, H2, H3** and **CDR-L1, L2, L3** — form a single contiguous surface, and that surface is the binding site.

Residue numbering is a recurring nuisance: **Kabat**, **Chothia** and **IMGT** schemes all number antibodies, all define CDR boundaries slightly differently, and papers do not always say which they used. Checking the scheme before comparing two sets of CDR definitions is a basic hygiene step.`,
      widget: { type: 'SvgDiagram', props: { svg: iggSvg }, caption: 'Roughly 150 kDa of protein, of which the parts you design are six loops totalling perhaps 50 residues.' },
    },
    {
      kind: 'widget',
      title: 'The problem child: CDR-H3',
      body: String.raw`Five of the six loops are well behaved. Chothia and Lesk (1987) showed that H1, H2, L1, L2 and L3 fall into a small number of **canonical conformations**, each determined by the loop's length and a few key residues — so predicting them is close to a lookup.

**CDR-H3** is the exception, and it is the loop that usually contributes most of the binding energy. It sits at the centre of the site, it is formed at the V–D–J junction with random nucleotide addition and trimming, and so it varies in length from about 3 to over 25 residues with no canonical classes to fall back on. Change its length and it protrudes differently; keep the length and several quite different backbone paths remain plausible.`,
      widget: {
        type: 'DrugCdrLoop',
        props: { h3Length: 12, view: 'fv', showAntigen: true },
        caption: 'Slide the H3 length, then cycle the conformation at fixed length — the ambiguity a loop predictor has to resolve. The other five loops barely move.',
      },
    },
    {
      kind: 'mcq',
      prompt: 'Why is CDR-H3 much harder to model than the other five CDR loops?',
      choices: [
        'It is the only loop on the heavy chain',
        'It is generated at the V–D–J junction with random insertions and deletions, so it varies widely in length and has no canonical conformational classes',
        'It is buried inside the β-sandwich where no structural data exists',
        'It is the only loop that contacts the antigen',
      ],
      answer: 1,
      why: 'Junctional diversity gives H3 a length range and backbone freedom that the length-plus-key-residue canonical rules cannot cover. H1 and H2 are also on the heavy chain and usually also touch the antigen; and far from being buried, H3 sits at the centre of the exposed binding surface, which is exactly why its conformation matters so much.',
    },
    {
      kind: 'widget',
      title: 'What prediction accuracy looks like',
      body: String.raw`Modern antibody structure predictors — AlphaFold2, and specialised fast models such as **IgFold** (Ruffolo et al. 2023) — place the framework and the five canonical loops very accurately, typically well under 1 Å backbone RMSD. CDR-H3 is reliably the worst loop, and it degrades with length.

The harder problem is one step beyond: predicting the **antibody–antigen complex**. In CASP15 and in independent benchmarks, antibody–antigen targets were among the worst-performing category for AlphaFold-Multimer, with acceptable-quality predictions in only a modest fraction of cases. So you can usually trust the shape of the antibody, and usually not trust a predicted pose of it on its target.`,
      widget: {
        type: 'DrugCdrLoop',
        props: { view: 'error' },
        caption: 'An illustrative sketch of the trend, not measured data — but the ordering, H3 far worse than the rest and worsening with length, is what benchmarks consistently report.',
      },
    },
    {
      kind: 'explain',
      title: 'How therapeutic antibodies are actually made',
      body: String.raw`Design is a late arrival here. The dominant routes are all forms of **selection**:

- **Hybridoma** (Köhler and Milstein 1975): immunise a mouse, fuse its B cells with myeloma cells, screen the clones. The original method, and still in use.
- **Phage display** (McCafferty et al. 1990): a library of $10^9$–$10^{11}$ antibody fragments displayed on bacteriophage, panned against immobilised antigen. Fully in vitro, so it works for toxic and non-immunogenic targets.
- **Transgenic mice** carrying human immunoglobulin loci, which immunise to give human sequences directly.
- **Single-B-cell sequencing** from immunised animals or convalescent human donors.

A mouse-derived antibody provokes an immune response in patients, so it must be **humanised**: graft the six CDRs onto a human framework, then back-mutate the handful of framework residues that support the loops, because a naive graft usually loses a large chunk of affinity (Jones et al. 1986; Riechmann et al. 1988). This is a structure-guided procedure and one of the oldest genuine successes of computational antibody work.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps of humanising a mouse monoclonal antibody.',
      steps: [
        'Determine the mouse antibody sequence and identify its six CDRs under a stated numbering scheme',
        'Choose the closest human germline framework as the acceptor',
        'Graft the mouse CDRs onto the human framework',
        'Model the grafted Fv and identify framework residues that support the CDR conformations',
        'Back-mutate those residues to the mouse identity and make a small panel of variants',
        'Measure affinity and expression for the panel, and pick the best compromise',
      ],
      why: 'The graft comes first and almost always costs affinity, because framework residues underneath the loops hold them in shape. Back-mutation is the repair step, and because each back-mutation re-introduces mouse sequence, you make a panel and measure the affinity-versus-humanness trade-off rather than guessing it.',
    },
    {
      kind: 'explain',
      title: 'Affinity maturation, in vitro and in silico',
      body: String.raw`Once you have a binder, you usually want it tighter. The classical route is a library: error-prone PCR or site-saturation mutagenesis across the CDRs, then display selection under increasingly stringent conditions. **Deep mutational scanning** does the same thing exhaustively, measuring the effect of every single substitution at every position, and produces data a model can learn from.

The machine-learning contribution here is genuinely impressive and worth stating precisely. Hie et al. (2024, *Nat. Biotechnol.*) used **general protein language models** — trained on all protein sequences, with no antibody-specific training, no structure and no information about the target — to propose a small number of substitutions per antibody. Testing twenty or fewer variants each, over two rounds, for seven antibodies, they improved binding affinity **up to 7-fold for four mature, clinically relevant antibodies and up to 160-fold for three unmatured ones**. The split matters: the large multiples came from antibodies evolution had not already optimised, and a mature therapeutic has much less headroom.

Read that carefully, because it is easy to over-claim. The model was not designing a binder; it was suggesting which mutations look evolutionarily plausible in a protein-like sequence. That turns out to be a surprisingly strong prior for "will not break the protein, might help" — which is exactly what you need to shrink a library from $10^6$ variants to twenty.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A 160-fold improvement in affinity corresponds to what change in binding free energy, in kcal/mol, at 298 K? Use $\Delta\Delta G = RT\ln(160)$ with $R = 1.987\times10^{-3}$ kcal mol⁻¹ K⁻¹. Give the magnitude.`,
      answer: 3.0,
      tolerance: 0.12,
      unit: 'kcal/mol',
      why: String.raw`$RT = 1.987\times10^{-3} \times 298 = 0.592$ kcal/mol, and $\ln 160 = 5.08$, so $\Delta\Delta G = 3.0$ kcal/mol. That is worth internalising: a 160-fold affinity gain — spectacular in a paper abstract — is about 3 kcal/mol, roughly two good hydrogen bonds. It is also about the size of the error bar on most computed binding free energies, which is why predicting affinity changes remains hard.`,
    },
    {
      kind: 'truefalse',
      prompt: 'For a therapeutic antibody, tighter binding to the target is always better.',
      answer: false,
      why: 'Affinity saturates: once the off-rate is slow compared with the antibody’s residence in the tissue, further tightening changes nothing about efficacy. Worse, very high affinity for a cell-surface target can cause "binding-site barrier" effects in solid tumours, where antibody is trapped at the first cells it meets and never penetrates. Dose, half-life and tissue distribution often matter more than the last ten-fold of affinity.',
    },
    {
      kind: 'explain',
      title: 'Developability: the objective nobody models well',
      body: String.raw`An antibody that binds beautifully can still be undevelopable. The constraints come from manufacturing and formulation, and they are unforgiving:

- **Expression titre and aggregation.** The molecule must be produced in CHO cells at grams per litre and stay monomeric.
- **Viscosity at high concentration.** A subcutaneous injection is at most about 1–2 mL, so a 150 mg dose means formulating above 100 mg/mL. Some antibodies become unmanageably viscous there, usually through charge-patch self-association.
- **Chemical liabilities in the CDRs.** An N-glycosylation sequon (N-X-S/T), an Asn-Gly prone to deamidation, an Asp-Gly prone to isomerisation, an exposed Met or Trp prone to oxidation, an unpaired cysteine. Each is a degradation pathway that will appear in a stability study two years later.
- **Polyreactivity and immunogenicity.** Non-specific binding shortens half-life; anti-drug antibodies can neutralise the therapy outright.

Jain et al. (2017) measured twelve biophysical assays across 137 clinical-stage antibodies and found that a substantial minority were flagged as outliers on at least one — and that approved antibodies were noticeably better behaved than those that stalled. Developability is not a formality; it is a selection filter operating the whole way through the clinic.

Computationally this is the weakest link. Aggregation and viscosity predictors exist and are modest; sequence-liability scanning is reliable but only finds the motifs we already know to look for.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these are genuine developability liabilities to screen for in CDR sequences? (Select all.)',
      choices: [
        'An N-X-S/T sequon, which can pick up unintended N-linked glycosylation',
        'An Asn-Gly motif, a hotspot for deamidation on storage',
        'An unpaired cysteine, which can form incorrect disulfides or dimers',
        'A high proportion of glycine, which always destabilises a loop',
        'A large exposed hydrophobic or charged patch, associated with self-association and high viscosity',
      ],
      answers: [0, 1, 2, 4],
      why: 'Glycosylation sequons, deamidation and isomerisation motifs, free cysteines and self-association patches are the standard liability checklist, each a known chemical or colloidal degradation route. Glycine is simply a flexible residue and is extremely common in CDR loops — H3 in particular — so its presence is not a liability by itself.',
    },
    {
      kind: 'explain',
      title: 'De novo antibody design: where it honestly stands',
      body: String.raw`Given how well [RFdiffusion](@drug/rfdiffusion-backbones) designs binders, the obvious question is whether the same machinery can design antibodies. It has been tried: a fine-tuned RFdiffusion that generates CDR loops against a specified epitope on a target, applied to single-domain antibodies (VHHs) and scFvs, with designs filtered computationally and then screened by yeast display (Bennett et al. 2025, *Nature*; first posted as a bioRxiv preprint in 2024).

The result is real and modest. Binders were obtained against several epitopes, and a cryo-EM structure of a designed VHH against influenza haemagglutinin matched the designed CDR loops closely — the first time a designed antibody's binding mode has been confirmed at that accuracy. But the hit rates were low, well below those for general de novo mini-binders, and the initial designs bound only in the tens-to-hundreds of nanomolar range; reaching single-digit nanomolar needed a further round of laboratory affinity maturation. The authors are explicit that these are proofs of concept, not drug candidates.

Why antibodies are harder than general binders, despite the fixed scaffold:

- **A de novo binder can use an idealised helical bundle**, the easiest thing in the world to design and predict. An antibody must bind using **irregular loops** on a prescribed framework, which is the part of protein structure that models handle worst.
- **The interface is loop-mediated and often shallow**, with fewer of the deep hydrophobic contacts that make binding energy predictable.
- **Training data is scarce.** There are far fewer antibody–antigen complexes in the PDB than protein–protein complexes, and they are biased toward a few well-studied antigens.

So: structure prediction of an antibody alone is largely solved; prediction of its complex is not; and de novo design of a high-affinity antibody against an arbitrary epitope is a live research problem, not a service you can order.`,
    },
    {
      kind: 'match',
      prompt: 'Match each antibody-engineering task to the method or evidence that addresses it.',
      pairs: [
        ['Removing mouse sequence while keeping affinity', 'CDR grafting onto a human framework, then framework back-mutation'],
        ['Improving the affinity of an existing antibody', 'Display selection, deep mutational scanning or language-model-guided variants'],
        ['Predicting the Fv structure of a known sequence', 'AlphaFold2 or IgFold — accurate except for CDR-H3'],
        ['Predicting the pose on the antigen', 'Still unreliable: among the worst categories for AlphaFold-Multimer'],
        ['Avoiding viscosity and aggregation at 150 mg/mL', 'Biophysical developability panels, with only modest predictive models'],
      ],
      why: 'The five tasks sit at very different maturity levels: humanisation is a solved structure-guided procedure, affinity maturation is reliable experimental engineering now helped by models, monomer structure prediction works, and complex prediction and developability prediction are both open problems.',
    },
    {
      kind: 'fill',
      prompt: 'The minimal binding unit of an antibody is the ___ , formed by VH packed against VL. Five of its six loops adopt a small number of ___ conformations, but CDR-___ is formed at the V–D–J junction and resists prediction. Beyond affinity, a candidate must also pass ___ assessment for aggregation, viscosity and chemical liabilities.',
      bank: ['Fv', 'canonical', 'H3', 'developability', 'Fc', 'germline'],
      answer: ['Fv', 'canonical', 'H3', 'developability'],
      why: 'The Fv is VH plus VL; canonical classes make five loops close to a lookup; H3 is the junctional loop with no such classes; and developability is the set of manufacturing and formulation constraints that kills candidates with perfectly good affinity. The Fc is the constant stem, not the binding unit.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- An antibody's binding site is **six CDR loops** at the tip of the **Fv** (VH + VL) on a conserved framework. Numbering schemes (Kabat, Chothia, IMGT) disagree on CDR boundaries — always state which you used.
- Five loops have **canonical conformations** set by length and key residues (Chothia and Lesk 1987). **CDR-H3**, built at the V–D–J junction, does not, and it usually contributes the most binding energy.
- Therapeutic antibodies come overwhelmingly from **selection** — hybridoma, phage display, transgenic mice, single-B-cell sequencing — followed by **humanisation** by CDR grafting plus framework back-mutation.
- **Affinity maturation** is now assisted by models: general protein language models proposed sets of twenty or fewer variants that gained up to 7-fold on mature antibodies and up to 160-fold on unmatured ones (Hie et al. 2024) — and even 160-fold is only about **3 kcal/mol**.
- **Developability** — titre, aggregation, viscosity above 100 mg/mL, CDR chemical liabilities, immunogenicity — is a real selection filter (Jain et al. 2017) and the objective our models predict worst.
- Antibody **structure** prediction is good except for H3; antibody–antigen **complex** prediction is not; and **de novo** antibody design against a chosen epitope (Bennett et al. 2025) currently gives low hit rates and initial affinities in the tens to hundreds of nanomolar. The fixed scaffold does not make it easier — irregular loops and scarce complex data make it harder.`,
    },
  ],
  references: [
    { authors: 'Chothia, C., Lesk, A. M.', title: 'Canonical structures for the hypervariable regions of immunoglobulins', year: 1987, venue: 'J. Mol. Biol. 196, 901–917' },
    { authors: 'Jain, T., Sun, T., Durand, S., et al.', title: 'Biophysical properties of the clinical-stage antibody landscape', year: 2017, venue: 'PNAS 114, 944–949' },
    { authors: 'Ruffolo, J. A., Chu, L.-S., Mahajan, S. P., Gray, J. J.', title: 'Fast, accurate antibody structure prediction from deep learning on massive set of natural antibodies', year: 2023, venue: 'Nat. Commun. 14, 2389' },
    { authors: 'Hie, B. L., Shanker, V. R., Xu, D., et al.', title: 'Efficient evolution of human antibodies from general protein language models', year: 2024, venue: 'Nat. Biotechnol. 42, 275–283' },
    { authors: 'Riechmann, L., Clark, M., Waldmann, H., Winter, G.', title: 'Reshaping human antibodies for therapy', year: 1988, venue: 'Nature 332, 323–327' },
    { authors: 'Bennett, N. R., Watson, J. L., Ragotte, R. J., et al.', title: 'Atomically accurate de novo design of antibodies with RFdiffusion', year: 2025, venue: 'Nature 649, 183–193' },
  ],
} satisfies LessonContent;
