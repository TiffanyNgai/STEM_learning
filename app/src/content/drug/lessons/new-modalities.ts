import type { LessonContent } from '../../types';

const adcSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-family="inherit">
  <text x="160" y="14" text-anchor="middle" font-size="11" font-weight="700" fill="var(--fg)">An antibody–drug conjugate at work</text>
  <g>
    <animateTransform attributeName="transform" type="translate" values="0,0;120,40;120,40;0,0" keyTimes="0;0.35;0.9;1" dur="7s" repeatCount="indefinite"/>
    <path d="M40,70 L40,50 M40,50 L26,32 M40,50 L54,32" stroke="var(--c2)" stroke-width="6" stroke-linecap="round" fill="none"/>
    <line x1="40" y1="62" x2="56" y2="66" stroke="var(--muted)" stroke-width="1.5"/>
    <circle cx="59" cy="67" r="4" fill="var(--c5)"/>
    <line x1="40" y1="62" x2="24" y2="66" stroke="var(--muted)" stroke-width="1.5"/>
    <circle cx="21" cy="67" r="4" fill="var(--c5)"/>
  </g>
  <rect x="100" y="100" width="200" height="90" rx="30" fill="var(--c3)" fill-opacity="0.15" stroke="var(--c3)"/>
  <rect x="152" y="94" width="16" height="10" rx="3" fill="var(--c4)"/>
  <text x="160" y="125" text-anchor="middle" font-size="8.5" fill="var(--fg)">target antigen on tumour cell</text>
  <circle cx="240" cy="160" r="16" fill="none" stroke="var(--muted)" stroke-dasharray="3 2"/>
  <text x="240" y="186" text-anchor="middle" font-size="8" fill="var(--muted)">lysosome</text>
  <circle cx="240" cy="160" r="4" fill="var(--c5)" opacity="0">
    <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.5;0.6;0.9;1" dur="7s" repeatCount="indefinite"/>
    <animate attributeName="cx" values="240;240;240;280;240" keyTimes="0;0.5;0.65;0.9;1" dur="7s" repeatCount="indefinite"/>
  </circle>
  <text x="14" y="110" font-size="8.5" fill="var(--fg)">antibody = address</text>
  <text x="14" y="122" font-size="8.5" fill="var(--muted)">linker = fuse</text>
  <text x="14" y="134" font-size="8.5" fill="var(--c5)">payload = warhead</text>
  <text x="14" y="160" font-size="8" fill="var(--muted)">binds → internalised →</text>
  <text x="14" y="171" font-size="8" fill="var(--muted)">linker cut → payload</text>
  <text x="14" y="182" font-size="8" fill="var(--muted)">released (may diffuse out)</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Changing the rules of the game',
      body: String.raw`A classic inhibitor works by **occupancy**: it must sit in a functional pocket, at high enough concentration, for as long as you want the effect. That sets three limits. The target needs a functional pocket, potency must be high, and exposure must be sustained.

The newer modalities each break one of those limits:

- **Degraders** (PROTACs, molecular glues) need only to *bind*, and they remove the protein.
- **Covalent drugs** form a bond, so the effect outlasts the free drug.
- **Antibody–drug conjugates** steer a poison to chosen cells.
- **RNA drugs** stop the protein being made at all.

This is called **event-driven** pharmacology, as opposed to occupancy-driven.`,
    },
    {
      kind: 'recall',
      title: 'The modality zoo (from “What is a drug?”)',
      points: [
        'Small molecules: oral, cell-permeable, need a pocket.',
        'Antibodies: large, selective, extracellular targets, injected.',
        'PROTACs link a target binder to an E3 ubiquitin-ligase binder. Molecular glues are single small molecules that stick an E3 to a new target.',
        'ADCs = antibody + linker + cytotoxic payload. siRNAs/ASOs silence an mRNA by base-pairing.',
      ],
      link: 'drug/what-is-a-drug',
    },
    {
      kind: 'explain',
      title: 'Degraders: the ternary complex',
      body: String.raw`A PROTAC works only when it forms a **ternary complex** (three partners: target · PROTAC · E3 ligase). In that complex the E3 can tag a lysine on the target with ubiquitin, and the proteasome then destroys the tagged protein. The PROTAC is released and can repeat the cycle, so it acts **sub-stoichiometrically** (one PROTAC molecule clears many target molecules).

Two practical consequences:

- **Cooperativity** $\alpha$ measures how much the two proteins help (α > 1) or hinder (α < 1) each other once bridged. The crystal structure of the PROTAC MZ1 bridging BRD4 and the E3 ligase VHL showed new protein–protein contacts that explain its positive cooperativity and selectivity (Gadd et al. 2017).
- Degraders are reported as **DC₅₀** (the concentration giving half-maximal degradation) and **$D_{\max}$** (the deepest degradation reached), not IC₅₀.

The first PROTAC was a peptide-based chimera (Sakamoto et al. 2001). Most current degraders recruit the E3 ligases **cereblon** or **VHL**.`,
    },
    {
      kind: 'widget',
      title: 'The hook effect',
      body: String.raw`Adding *more* PROTAC can make degradation *worse*. At high concentration, most targets and most E3s are each bound to their *own* PROTAC molecule. These **binary** complexes cannot pair up, so the ternary complex falls away.

In a simple model with dilute proteins and equal binary affinities $K$, the amount of ternary complex scales as $\alpha\,u/(1+u)^2$ with $u=[\text{PROTAC}]/K$. This gives a bell-shaped curve that peaks at $u = 1$. Change $\alpha$ and compare with the reference ($\alpha=1$).`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['4*10^x/(1+10^x)^2', 'a*4*10^x/(1+10^x)^2'],
          x: [-4, 4], y: [0, 3.4],
          params: [{ name: 'a', min: 0.2, max: 3, value: 2, label: 'cooperativity α' }],
          labels: ['α = 1 (reference)', 'your α'],
          xLabel: 'log₁₀([PROTAC]/K)', yLabel: 'ternary complex (rel.)',
        },
        caption: 'Bell-shaped ternary-complex formation. Positive cooperativity raises the peak, and with non-dilute proteins it also widens the useful window.',
      },
    },
    {
      kind: 'mcq',
      prompt: 'In a cell assay, a PROTAC degrades 90% of its target at 100 nM but only 30% at 10 µM. What is the most likely explanation?',
      choices: [
        'The PROTAC is toxic at 10 µM and the cells die',
        'Binary complexes (PROTAC·target and PROTAC·E3) out-compete the ternary complex at high concentration',
        'The target is re-synthesised faster at high concentration',
        'The E3 ligase becomes covalently modified',
      ],
      answer: 1,
      why: 'This is the classic **hook effect**. Excess PROTAC saturates each protein separately, so fewer bridges form. It is a predicted feature of three-body binding, not an artefact. Toxicity should always be checked, but it would not explain a reproducible bell-shaped curve with viable cells.',
    },
    {
      kind: 'explain',
      title: 'Molecular glues',
      body: String.raw`A **molecular glue** is a single, small molecule that creates or strengthens a protein–protein contact.

- **Thalidomide** and its analogues lenalidomide and pomalidomide bind the E3 ligase **cereblon** (identified by Ito et al. 2010). The drug-bound surface then grabs new "neo-substrates" such as the transcription factors IKZF1 and IKZF3, which are degraded. That is how lenalidomide kills myeloma cells (Krönke et al. 2014).
- The immunosuppressants **ciclosporin** and **tacrolimus** are older natural-product glues. Each binds a small protein (cyclophilin or FKBP12), and the drug–protein complex then inhibits calcineurin. This is glue *without* degradation.

Glues are small and drug-like, often under 500 Da, unlike bulky PROTACs. However, most were found by chance, and designing glues *rationally* is an open research problem.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Molecular glues are typically larger than PROTACs because they must contact two proteins at once.',
      answer: false,
      why: 'Glues are usually *smaller* (often < 500 Da). They do not need two separate binding heads and a linker. Instead they reshape one protein\'s surface so it complements another. PROTACs, with two ligands plus a linker, are typically 700–1,000+ Da.',
    },
    {
      kind: 'explain',
      title: 'Covalent drugs, deliberately',
      body: String.raw`A **targeted covalent inhibitor** first binds reversibly (affinity $K_I$). A mildly reactive **warhead** (often an acrylamide) then forms a bond with a nearby nucleophile, usually a non-catalytic cysteine, at rate $k_{\text{inact}}$:

$$E + I \underset{}{\overset{K_I}{\rightleftharpoons}} E{\cdot}I \xrightarrow{k_{\text{inact}}} E\!-\!I$$

The observed inactivation rate is $k_{\text{obs}} = k_{\text{inact}}[I]/(K_I+[I])$, and potency is reported as $k_{\text{inact}}/K_I$, not IC₅₀ (which drifts with incubation time).

Examples: **ibrutinib** (BTK Cys481), **osimertinib** (EGFR Cys797) and **sotorasib** (KRAS G12C). The effect lasts until the cell makes *new* protein. Risks are off-target reactivity (Singh et al. 2011), and resistance mutations that remove the cysteine (BTK C481S, EGFR C797S).`,
    },
    {
      kind: 'widget',
      title: 'Covalent vs reversible over time',
      body: String.raw`Fraction of target covalently inactivated after time $t$: $1-e^{-k_{\text{obs}}t}$. Compare it with the equilibrium occupancy of a reversible inhibitor with the same affinity, $[I]/(K_I+[I])$. Given enough time, the covalent drug approaches 100% even at modest $[I]/K_I$.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['1-exp(-k*c/(1+c)*x)', 'c/(1+c)+0*x'],
          x: [0, 60], y: [0, 1.15],
          params: [
            { name: 'k', min: 0.01, max: 0.5, value: 0.1, label: 'k_inact (per min)' },
            { name: 'c', min: 0.1, max: 10, value: 1, label: '[I]/K_I' },
          ],
          labels: ['covalent: fraction inactivated', 'reversible: occupancy'],
          xLabel: 'time (min)', yLabel: 'fraction of target',
        },
        caption: 'Two-step covalent inhibition with constant inhibitor concentration and no new protein synthesis.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A covalent inhibitor has $k_{\text{inact}} = 0.005\ \text{s}^{-1}$ and $K_I = 1\ \mu\text{M}$. At $[I] = 1\ \mu\text{M}$, how long does it take to inactivate **half** of the target? (seconds, nearest whole number)`,
      answer: 277,
      tolerance: 3,
      unit: 's',
      why: String.raw`$k_{\text{obs}} = 0.005\times 1/(1+1) = 0.0025\ \text{s}^{-1}$, and $t_{1/2} = \ln 2/k_{\text{obs}} = 0.693/0.0025 \approx 277\ \text{s}$ (about 4.6 min). A common slip is to forget the $[I]/(K_I+[I])$ factor and get 139 s.`,
    },
    {
      kind: 'explain',
      title: 'Antibody–drug conjugates',
      body: String.raw`An ADC has three engineered parts:

- **Antibody**: the address. It binds an antigen that is more abundant on tumour cells (e.g. HER2).
- **Linker**: the fuse. *Cleavable* linkers are cut inside the cell, e.g. a valine–citrulline peptide cut by lysosomal cathepsins (brentuximab vedotin). *Non-cleavable* ones release the payload only when the antibody is digested (trastuzumab emtansine, T-DM1).
- **Payload**: a toxin far too potent to give systemically (an auristatin, a maytansinoid or a topoisomerase-I inhibitor).

The **drug-to-antibody ratio (DAR)** counts payloads per antibody: about 3.5 on average for T-DM1 and about 8 for trastuzumab deruxtecan. A membrane-permeable payload can escape and kill neighbouring cells. This **bystander effect** helps against tumours where the antigen is present on some cells and not others.`,
      widget: { type: 'SvgDiagram', props: { svg: adcSvg }, caption: 'Bind → internalise → cleave → release. Gemtuzumab ozogamicin (2000) was the first approved ADC.' },
    },
    {
      kind: 'match',
      prompt: 'Match each ADC design choice with its consequence.',
      pairs: [
        ['High DAR (~8)', 'More payload delivered per antibody, but potentially faster clearance and more toxicity'],
        ['Cleavable linker + membrane-permeable payload', 'Bystander killing of nearby antigen-negative cells'],
        ['Non-cleavable linker', 'Payload released only after the antibody is degraded in the lysosome'],
        ['Antigen also present on healthy tissue', 'On-target, off-tumour toxicity'],
      ],
      why: 'Each component trades efficacy against safety. The DAR, linker chemistry and payload permeability are tuned together, and the choice of antigen sets the selectivity ceiling.',
    },
    {
      kind: 'explain',
      title: 'RNA drugs: programmable, delivery-limited',
      body: String.raw`**Antisense oligonucleotides** (ASOs, single-stranded) and **siRNAs** (double-stranded, loaded into the RISC complex) find their mRNA by base-pairing. The *sequence* is designed from the gene, so no pocket is needed.

Unmodified RNA is destroyed in minutes, so these drugs are chemically armoured with **phosphorothioate** backbones and 2′-sugar modifications (2′-O-methyl, 2′-fluoro, 2′-MOE).

The real bottleneck is **delivery**:

- **GalNAc** sugar conjugates bind the asialoglycoprotein receptor on liver cells. Inclisiran (siRNA against PCSK9) is given twice a year after its first two doses.
- **Lipid nanoparticles** carried patisiran (2018), the first approved siRNA.
- **Local injection**: nusinersen is injected into the spinal fluid to change SMN2 splicing.

Tissues beyond the liver, CNS and eye remain hard to reach.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about siRNA/ASO drugs are correct? (Select all that apply.)',
      choices: [
        'They are designed from the target gene’s sequence rather than from a protein pocket',
        'Chemical modifications protect them from nucleases',
        'They readily reach every tissue after an oral dose',
        'GalNAc conjugation targets them to hepatocytes',
      ],
      answers: [0, 1, 3],
      why: 'Sequence-based design and chemical stabilisation are their strengths. Delivery is the weakness: they are injected, not taken orally, and efficient uptake is achieved mainly in the liver (GalNAc), the CNS (intrathecal) and the eye.',
    },
    {
      kind: 'mcq',
      prompt: 'Your target is an **intracellular scaffolding protein**. It has no enzymatic activity, and your best small-molecule binder (Kd = 50 nM) has no effect on function. Which approach is most promising?',
      choices: [
        'Optimise the binder for higher affinity until it inhibits',
        'Convert the binder into a PROTAC by linking it to an E3-ligase ligand',
        'Make a monoclonal antibody against the protein',
        'Develop an ADC targeting the protein',
      ],
      answer: 1,
      why: 'A non-functional but potent binder is the ideal PROTAC starting point: degradation removes *all* functions, including scaffolding. Tighter binding alone will not create inhibition if the pocket is not functional. Antibodies and ADCs cannot reach intracellular proteins.',
    },
    {
      kind: 'fill',
      prompt: 'Degraders are characterised by ___ and Dmax; covalent inhibitors by ___ ; ADCs by their ___ .',
      bank: ['DC50', 'kinact/KI', 'DAR', 'IC50 at 5 min', 'logP'],
      answer: ['DC50', 'kinact/KI', 'DAR'],
      why: 'Each modality needs its own metric. A single IC₅₀ would mislead: for a degrader it misses the hook effect and depth of degradation, and for a covalent drug it changes with incubation time. For ADCs, the drug-to-antibody ratio sets payload delivery.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- New modalities move from **occupancy-driven** to **event-driven** pharmacology: remove, permanently modify, deliver, or silence.
- **PROTACs** depend on a ternary complex. Cooperativity matters, and too much drug causes the **hook effect**. **Molecular glues** are small and mostly found by chance so far.
- **Covalent inhibitors** are described by $K_I$ and $k_{\text{inact}}$. Their effect outlasts exposure, and they carry reactivity and resistance risks.
- **ADCs** = antibody (address) + linker (fuse) + payload (warhead), tuned via DAR and the bystander effect.
- **RNA drugs** are programmable from the sequence but limited by delivery (GalNAc → liver).
- Each brings new computational problems: ternary-complex modelling, covalent docking, linker design, oligo sequence and off-target design.`,
    },
  ],
  references: [
    { authors: 'Sakamoto, K. M., Kim, K. B., Kumagai, A., Mercurio, F., Crews, C. M., Deshaies, R. J.', title: 'Protacs: chimeric molecules that target proteins to the Skp1–Cullin–F box complex for ubiquitination and degradation', year: 2001, venue: 'Proc. Natl Acad. Sci. USA 98, 8554–8559' },
    { authors: 'Gadd, M. S., Testa, A., Lucas, X., et al.', title: 'Structural basis of PROTAC cooperative recognition for selective protein degradation', year: 2017, venue: 'Nat. Chem. Biol. 13, 514–521' },
    { authors: 'Krönke, J., Udeshi, N. D., Narla, A., et al.', title: 'Lenalidomide causes selective degradation of IKZF1 and IKZF3 in multiple myeloma cells', year: 2014, venue: 'Science 343, 301–305' },
    { authors: 'Singh, J., Petter, R. C., Baillie, T. A., Whitty, A.', title: 'The resurgence of covalent drugs', year: 2011, venue: 'Nat. Rev. Drug Discov. 10, 307–317' },
    { authors: 'Roberts, T. C., Langer, R., Wood, M. J. A.', title: 'Advances in oligonucleotide drug delivery', year: 2020, venue: 'Nat. Rev. Drug Discov. 19, 673–694' },
  ],
} satisfies LessonContent;
