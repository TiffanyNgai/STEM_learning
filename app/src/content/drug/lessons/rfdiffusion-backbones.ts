import type { LessonContent } from '../../types';

const frameSvg = `<svg viewBox="0 0 320 178" xmlns="http://www.w3.org/2000/svg">
<g font-size="8" text-anchor="middle">
<text x="80" y="13" fill="var(--fg)" font-weight="700">a residue is a frame</text>
<text x="240" y="13" fill="var(--fg)" font-weight="700">noise the frame, not the atoms</text>

<g transform="translate(80,74)">
<line x1="-30" y1="22" x2="30" y2="-22" stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="3 2"/>
<circle cx="0" cy="0" r="4.5" fill="var(--c2)"/>
<text x="0" y="-32" fill="var(--c2)">Cα</text>
<line x1="0" y1="0" x2="26" y2="-8" stroke="var(--c3)" stroke-width="2"/>
<line x1="0" y1="0" x2="-8" y2="-24" stroke="var(--c4)" stroke-width="2"/>
<line x1="0" y1="0" x2="-14" y2="18" stroke="var(--c5)" stroke-width="2"/>
<text x="34" y="-8" fill="var(--c3)">C</text>
<text x="-10" y="-30" fill="var(--c4)">N</text>
<text x="-22" y="24" fill="var(--c5)">Cβ</text>
<text x="0" y="46" fill="var(--muted)">position in R³ + rotation in SO(3)</text>
</g>

<g transform="translate(240,74)">
<circle cx="0" cy="0" r="30" fill="none" stroke="var(--muted)" stroke-dasharray="3 3"/>
<g><animateTransform attributeName="transform" type="rotate" values="0;140;-60;0" dur="7s" repeatCount="indefinite"/>
<line x1="0" y1="0" x2="24" y2="0" stroke="var(--c3)" stroke-width="2"/>
<line x1="0" y1="0" x2="0" y2="-20" stroke="var(--c4)" stroke-width="2"/>
<circle cx="0" cy="0" r="4.5" fill="var(--c2)"/>
</g>
<circle cx="0" cy="0" r="3" fill="none" stroke="var(--c1)" stroke-width="1.5">
<animate attributeName="cx" values="0;16;-12;0" dur="7s" repeatCount="indefinite"/>
<animate attributeName="cy" values="0;-14;10;0" dur="7s" repeatCount="indefinite"/></circle>
<text x="0" y="46" fill="var(--muted)">translation diffuses; rotation diffuses on SO(3)</text>
</g>
<text x="160" y="150" fill="var(--fg)" font-weight="700">bond lengths and bond angles inside a residue are never touched</text>
<text x="160" y="164" fill="var(--muted)">so a half-denoised structure is a scrambled chain, not broken chemistry</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A shape out of nothing',
      body: String.raw`[Computational protein design](@drug/protein-design) splits into generating a backbone and then writing a sequence for it. For twenty years the backbone was the hard half: you borrowed one from the PDB, or stitched fragments together, or hallucinated one by beating on a structure predictor for hours per design.

**RFdiffusion** (Watson et al. 2023, *Nature*) made backbone generation a sampling problem. Start from random noise in the shape of a protein chain, run a denoising diffusion model, and a plausible backbone condenses out in a couple of minutes. Condition that denoising on a functional motif, a target surface or a symmetry, and it builds a backbone that does a job.

What makes the paper matter is not the architecture. It is that the designs were made and tested, and worked often enough to change how protein engineering is done.`,
    },
    {
      kind: 'recall',
      title: 'Diffusion models in one minute',
      points: [
        'A **forward** process adds Gaussian noise to data in small steps until nothing of the data is left.',
        'A network is trained to undo one step — equivalently, to predict the noise, or the score $\\nabla_x \\log p_t(x)$.',
        'Sampling runs **backwards**: start from pure noise and denoise repeatedly.',
        'Conditioning is easy: hand the denoiser extra context, or hold part of the object fixed at every step.',
      ],
      link: 'ml/diffusion-models',
    },
    {
      kind: 'explain',
      title: 'What exactly gets noised',
      body: String.raw`The modelling decision that makes this work is choosing the object to diffuse.

Adding Gaussian noise directly to every backbone atom would destroy bond lengths and bond angles, and the denoiser would spend its capacity relearning chemistry it already knows. Instead, each residue is treated as a **rigid frame**: the N, Cα and C atoms of one residue define a position in $\mathbb{R}^3$ and an orientation in $\mathrm{SO}(3)$, the group of 3D rotations.

Diffusion then runs over those frames — a translation per residue and a rotation per residue, with a noise process defined properly on each factor (rotations need a diffusion on $\mathrm{SO}(3)$, not a Gaussian on three numbers). Internal residue geometry is never perturbed.

So a half-noised protein is a correct chain of residues in scrambled positions and orientations, which is precisely the kind of error a structure network is good at fixing. The same idea underlies the related SE(3) framework of Yim et al. (2023).`,
      widget: { type: 'SvgDiagram', props: { svg: frameSvg }, caption: 'A residue frame carries a translation and a rotation. Diffusing frames keeps every bond length and bond angle intact by construction.' },
    },
    {
      kind: 'widget',
      title: 'Watch a backbone condense',
      body: String.raw`Drag $t$ from 1 (pure noise) back toward 0, or let it run. At high noise there is no protein, only a cloud; secondary structure appears first, then the packing between elements, then the fine geometry.`,
      widget: {
        type: 'DrugBackboneDenoise',
        props: { mode: 'unconditional', animate: true },
        caption: 'A 2D cartoon of unconditional generation. The real model denoises residue frames in 3D with a fine-tuned RoseTTAFold; the schedule used here is $\\bar{\\alpha}_t = \\cos^2(\\pi t/2)$.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`With the schedule $\bar{\alpha}_t = \cos^2(\pi t / 2)$ used by the widget, the noisy state is $x_t = \sqrt{\bar{\alpha}_t}\,x_0 + \sqrt{1-\bar{\alpha}_t}\,\varepsilon$. What is $\bar{\alpha}_t$ at $t = 0.5$?`,
      answer: 0.5,
      tolerance: 0.01,
      why: String.raw`$\cos^2(\pi \times 0.5/2) = \cos^2(\pi/4) = (1/\sqrt{2})^2 = 0.5$. Half-way through the schedule the signal and the noise carry equal variance — and note that the *amplitude* of the clean structure is $\sqrt{0.5} \approx 0.71$, not 0.5, because the mixing is in the square root.`,
    },
    {
      kind: 'mcq',
      prompt: 'Why does RFdiffusion diffuse residue frames rather than raw atomic coordinates?',
      choices: [
        'Frames have fewer degrees of freedom, so sampling is faster to converge',
        'Noising frames leaves bond lengths and angles within each residue intact, so the model never has to repair broken chemistry',
        'Rotations cannot be represented by Cartesian coordinates',
        'Atomic coordinates are not available in the Protein Data Bank',
      ],
      answer: 1,
      why: 'Keeping intra-residue geometry rigid means every intermediate state is a chemically valid chain in the wrong arrangement — exactly the error a structure network was pretrained to correct. Speed is a side benefit, not the reason; rotations are perfectly representable in Cartesian terms, they simply need their own noise process on SO(3).',
    },
    {
      kind: 'explain',
      title: 'The denoiser is a structure predictor',
      body: String.raw`RFdiffusion's denoising network is not trained from scratch. It is **RoseTTAFold** — the three-track structure prediction network — fine-tuned on the denoising task. That choice does much of the work: the pretrained network already encodes how backbones pack, what secondary structure looks like and which arrangements are physically reasonable, and the paper reports that fine-tuning it clearly beats training the same architecture from random initialisation.

Two further details matter in practice:

- **Self-conditioning.** At each reverse step the network also sees its own previous prediction of the clean structure. This stabilises the trajectory considerably; it was adopted from image diffusion work and is one of the larger single contributions to design quality.
- **The noise scale is a knob at inference time.** Sampling with *less* noise than training used gives more idealised, more designable backbones at the cost of diversity. This is an honest trade, not a bug — and it means "RFdiffusion's success rate" is not a single number, it depends on how conservatively you sampled.`,
    },
    {
      kind: 'widget',
      title: 'Motif scaffolding',
      body: String.raw`The most useful conditioning mode. You know a piece of structure that does something — a viral epitope, an enzyme active site, a binding helix — and you need a protein to hold it in exactly that geometry.

Hold the motif's coordinates fixed at **every** step of the reverse process and denoise the rest of the chain around it. No retraining, no separate model: the constraint is applied during sampling. On a 25-problem motif-scaffolding benchmark assembled from six earlier papers, RFdiffusion solved **23 of 25** in silico, against 19 for RFjoint inpainting and 15 for constrained hallucination — and on 19 of those 23 it also had the higher fraction of successful designs.`,
      widget: {
        type: 'DrugBackboneDenoise',
        props: { mode: 'motif', animate: true },
        caption: 'The orange motif never moves. Everything else is generated to support it — and a good scaffold also has to be foldable and expressible, which the geometry alone does not guarantee.',
      },
    },
    {
      kind: 'order',
      prompt: 'Order a motif-scaffolding campaign from specification to a confirmed design.',
      steps: [
        'Extract the functional motif and decide which residues must keep their exact geometry',
        'Run RFdiffusion many times, holding the motif fixed, to produce diverse scaffolds',
        'Design several sequences per scaffold with an inverse-folding model',
        'Fold each sequence with AlphaFold2 and keep those that reproduce the scaffold and the motif',
        'Order synthetic genes for the survivors and express the proteins',
        'Measure function, then solve a structure for the best designs',
      ],
      why: 'Backbone first, sequence second, in-silico self-consistency third — and only then does anything cost money. The AlphaFold filter is what decides how many of the scarce wet-lab slots are wasted, which is why it is run on every design rather than a sample.',
    },
    {
      kind: 'explain',
      title: 'Binder design, and the hotspot trick',
      body: String.raw`The application that drew the most attention is **de novo binder design**: given a target protein, invent a small protein that sticks to a chosen patch of its surface.

The target is held fixed throughout the reverse diffusion, exactly like a motif, and you additionally specify **hotspot residues** — the handful of target residues the binder should contact. Those two constraints turn a wildly underdetermined problem into a tractable one.

Two further tools from the same work:

- **Partial diffusion.** Take a design you like, noise it only part-way to some intermediate $t$, and denoise again. You get a family of relatives rather than unrelated strangers — a cheap way to diversify around a hit.
- **Symmetry.** Symmetrising the noise and averaging the network's predictions across the symmetry group yields cyclic, dihedral or icosahedral oligomers directly, which matters for vaccine-style nanoparticle scaffolds.

For context on how hard this used to be: the previous generation of Rosetta-based binder design (Cao et al. 2022) built and screened **15,000 to 100,000 designs per target site** by yeast display, and for two of their twelve targets fewer than ten binders came out of a library of 100,000. RFdiffusion campaigns, with AlphaFold2 filtering, test tens to hundreds.`,
      widget: {
        type: 'DrugBackboneDenoise',
        props: { mode: 'binder', animate: true },
        caption: 'Grey is the fixed target, red are the hotspot residues, and the chain is denoised against that surface. Nothing here says the designed interface is real — that is what the experiment is for.',
      },
    },
    {
      kind: 'truefalse',
      prompt: 'RFdiffusion outputs a designed protein sequence ready for gene synthesis.',
      answer: false,
      why: 'It outputs backbone coordinates only — frames, with no side chains and no amino-acid identities. A separate inverse-folding model such as ProteinMPNN writes the sequence, and a structure predictor then checks that the sequence folds back to the generated backbone. The modularity of those three steps is the reason the field moved so quickly.',
    },
    {
      kind: 'explain',
      title: 'In silico success and wet-lab success are different numbers',
      body: String.raw`Be careful with the word "success rate", because the literature uses it for two very different quantities.

**In-silico success** usually means *self-consistency*: design sequences for the generated backbone, fold them with AlphaFold2, and ask whether the prediction reproduces the backbone to under about 2 Å with high confidence. For unconditional monomers this rate is high — the great majority of samples pass. But two models agreeing is not evidence about the world. They share training data and they share blind spots.

**Experimental success** means a gene was ordered, the protein expressed, and it did the thing. These rates are lower, often by orders of magnitude, and they vary enormously with the task:

- *Unconditional monomers* and simple scaffolds express and fold well, and several RFdiffusion designs have been confirmed by crystallography and cryo-EM at close agreement with the design model.
- *Binders* are much harder, but the numbers are concrete. In the paper's own campaign — five targets (influenza H1 haemagglutinin, IL-7Rα, PD-L1, the insulin receptor and TrkA), 95 designs tested each — the overall experimental success rate was **19 %**, with the best haemagglutinin and IL-7Rα binders around 30 nM with no experimental optimisation. The authors call that roughly two orders of magnitude better than their own Rosetta-based method on the same targets. Nineteen per cent is the figure for five targets chosen by the authors, though: hit rates vary a great deal with the target and the epitope, and some targets simply fail.

The honest summary: the in-silico filter has gone from useless to genuinely predictive, and the wet-lab hit rate has gone from "industrial screening campaign" to "one plate". It has not gone to one.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these would count as real experimental evidence that a designed binder works? (Select all.)',
      choices: [
        'A measured dissociation constant from surface plasmon resonance or biolayer interferometry',
        'A self-consistency RMSD below 1 Å between the design and its AlphaFold2 re-prediction',
        'A crystal or cryo-EM structure of the designed complex matching the design model',
        'A mean pLDDT above 90 for the designed chain',
        'Loss of binding when the designed interface residues are mutated',
      ],
      answers: [0, 2, 4],
      why: 'A measured affinity, a solved structure of the complex, and a mutational control that abolishes binding are measurements of the physical world. Self-consistency RMSD and pLDDT are two neural networks agreeing with each other — necessary filters before spending money, but not evidence that anything binds.',
    },
    {
      kind: 'match',
      prompt: 'Match each RFdiffusion feature to the problem it solves.',
      pairs: [
        ['Diffusing residue frames', 'Keeps bond lengths and angles valid at every noise level'],
        ['Fine-tuning RoseTTAFold as the denoiser', 'Starts from a network that already knows what proteins look like'],
        ['Holding coordinates fixed during sampling', 'Scaffolds a functional motif or builds against a target surface'],
        ['Hotspot residues', 'Tells the model which patch of the target to bind'],
        ['Partial diffusion', 'Generates relatives of a design you already like'],
      ],
      why: 'Three of these are about making a valid structure at all; hotspots and partial diffusion are about steering an otherwise underdetermined problem. Notice that none of the five is a scoring function — RFdiffusion has no notion of binding affinity anywhere in it.',
    },
    {
      kind: 'fill',
      prompt: 'RFdiffusion runs denoising diffusion over residue ___ , each carrying a translation and a rotation; its denoiser is a fine-tuned ___ ; a motif is scaffolded by holding its coordinates ___ at every reverse step; and the output is a ___ with no sequence attached.',
      bank: ['frames', 'RoseTTAFold', 'fixed', 'backbone', 'torsions', 'ProteinMPNN'],
      answer: ['frames', 'RoseTTAFold', 'fixed', 'backbone'],
      why: 'Frames are the diffused object, a pretrained structure predictor is the denoiser, conditioning is done by fixing coordinates during sampling rather than retraining, and the result is shape only. Torsions are what DiffDock diffuses for a small-molecule pose; ProteinMPNN is the next model in the pipeline, not this one.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **RFdiffusion** (Watson et al. 2023) generates protein backbones by denoising diffusion over **residue frames** — a translation in $\mathbb{R}^3$ and a rotation in $\mathrm{SO}(3)$ per residue — so intra-residue geometry is never broken.
- Its denoiser is **RoseTTAFold fine-tuned** on the denoising task, with **self-conditioning**; starting from a pretrained structure predictor is a large part of why it works.
- Conditioning costs nothing extra at training time: hold coordinates fixed during sampling to get **motif scaffolding**, **binder design** against a target with **hotspot** residues, or symmetric oligomers.
- **Partial diffusion** re-noises an existing design part-way to produce close relatives; the **inference noise scale** trades diversity against designability.
- The output is a **backbone only**. Sequence comes from [inverse folding](@drug/inverse-folding), and an [AlphaFold2](@drug/alphafold) re-prediction is the standard in-silico filter.
- **In-silico self-consistency rates are high; experimental success rates are much lower and task-dependent.** The real achievement is that binder campaigns now test tens to hundreds of designs instead of $10^4$–$10^5$ — not that the problem is solved.`,
    },
  ],
  references: [
    { authors: 'Watson, J. L., Juergens, D., Bennett, N. R., et al.', title: 'De novo design of protein structure and function with RFdiffusion', year: 2023, venue: 'Nature 620, 1089–1100' },
    { authors: 'Baek, M., DiMaio, F., Anishchenko, I., et al.', title: 'Accurate prediction of protein structures and interactions using a three-track neural network', year: 2021, venue: 'Science 373, 871–876' },
    { authors: 'Cao, L., Coventry, B., Goreshnik, I., et al.', title: 'Design of protein-binding proteins from the target structure alone', year: 2022, venue: 'Nature 605, 551–560' },
    { authors: 'Bennett, N. R., Coventry, B., Goreshnik, I., et al.', title: 'Improving de novo protein binder design with deep learning', year: 2023, venue: 'Nat. Commun. 14, 2625' },
    { authors: 'Yim, J., Trippe, B. L., De Bortoli, V., et al.', title: 'SE(3) diffusion model with application to protein backbone generation', year: 2023, venue: 'Proc. ICML 2023, PMLR 202' },
  ],
} satisfies LessonContent;
