import type { LessonContent } from '../../types';

// Cushman & Ondetti's hypothetical ACE active site, with captopril docking in.
const site = [
  { x: 60, prot: 'Zn²⁺', lig: 'zinc binder', col: 'var(--c4)' },
  { x: 130, prot: 'S1′ pocket', lig: 'CH₃', col: 'var(--c3)' },
  { x: 200, prot: 'H-bond donor', lig: 'C=O', col: 'var(--c2)' },
  { x: 265, prot: 'Arg⁺', lig: 'Pro–COO⁻', col: 'var(--c5)' },
];
const aceSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
<path d="M20,20 H300 V75 H280 V60 H20 Z" fill="var(--muted)" fill-opacity="0.18" stroke="var(--muted)"/>
<text x="160" y="14" text-anchor="middle" font-size="9" fill="var(--muted)">ACE active site (modelled on carboxypeptidase A)</text>
${site.map((s) => `<circle cx="${s.x}" cy="62" r="11" fill="${s.col}" fill-opacity="0.35" stroke="${s.col}"/>
<text x="${s.x}" y="44" text-anchor="middle" font-size="9" font-weight="700" fill="var(--fg)">${s.prot}</text>`).join('\n')}
<g>
<animateTransform attributeName="transform" type="translate" values="0,70; 0,0; 0,0; 0,70" keyTimes="0;0.25;0.85;1" dur="8s" repeatCount="indefinite"/>
<path d="M${site[0].x},110 H${site[3].x}" stroke="var(--fg)" stroke-width="2"/>
${site.map((s) => `<circle cx="${s.x}" cy="110" r="12" fill="var(--surface, #fff)" stroke="${s.col}" stroke-width="2"/>
<line x1="${s.x}" y1="98" x2="${s.x}" y2="74" stroke="${s.col}" stroke-dasharray="3 2"/>`).join('\n')}
<text x="${site[1].x}" y="113" text-anchor="middle" font-size="8.5" fill="var(--fg)">CH₃</text>
<text x="${site[2].x}" y="113" text-anchor="middle" font-size="8.5" fill="var(--fg)">C=O</text>
<text x="${site[3].x}" y="113" text-anchor="middle" font-size="7.5" fill="var(--fg)">COO⁻</text>
<text x="${site[0].x}" y="113" text-anchor="middle" font-size="8.5" font-weight="700" fill="var(--c5)">COO⁻
<animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.5;0.55;1" dur="8s" repeatCount="indefinite"/></text>
<text x="${site[0].x}" y="113" text-anchor="middle" font-size="8.5" font-weight="700" fill="var(--c1)" opacity="0">SH
<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.5;0.55;1" dur="8s" repeatCount="indefinite"/></text>
</g>
<text x="160" y="160" text-anchor="middle" font-size="10" font-weight="700" fill="var(--c5)">carboxylate → zinc: IC50 ~ 22 µM
<animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.5;0.55;1" dur="8s" repeatCount="indefinite"/></text>
<text x="160" y="160" text-anchor="middle" font-size="10" font-weight="700" fill="var(--c1)" opacity="0">thiol → zinc (captopril): IC50 ~ 23 nM
<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.5;0.55;1" dur="8s" repeatCount="indefinite"/></text>
<text x="160" y="182" text-anchor="middle" font-size="9" fill="var(--muted)">same skeleton, better zinc ligand → ~1000-fold more potent</text>
</svg>`;

// HIV protease: two identical halves, flaps close over a transition-state mimic that sits on the catalytic aspartates.
const hivSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
<path d="M40,170 C30,110 60,70 150,80 L150,170 Z" fill="var(--c2)" fill-opacity="0.25" stroke="var(--c2)"/>
<path d="M280,170 C290,110 260,70 170,80 L170,170 Z" fill="var(--c6)" fill-opacity="0.25" stroke="var(--c6)"/>
<text x="80" y="160" font-size="9" fill="var(--fg)">monomer A</text>
<text x="240" y="160" text-anchor="end" font-size="9" fill="var(--fg)">monomer B</text>
<circle cx="145" cy="132" r="6" fill="var(--c5)"/><circle cx="175" cy="132" r="6" fill="var(--c5)"/>
<text x="160" y="152" text-anchor="middle" font-size="8.5" fill="var(--fg)">Asp25 · Asp25′</text>
<g><rect x="105" y="104" width="110" height="12" rx="6" fill="var(--c3)" fill-opacity="0.7"/>
<circle cx="160" cy="118" r="4" fill="var(--c1)"/>
<text x="160" y="100" text-anchor="middle" font-size="8.5" fill="var(--fg)">inhibitor; its OH (green) mimics the</text>
<text x="160" y="90" text-anchor="middle" font-size="8.5" fill="var(--fg)">tetrahedral transition state</text>
<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.9;1" dur="6s" repeatCount="indefinite"/></g>
<path d="M60,80 Q100,30 158,60" fill="none" stroke="var(--c2)" stroke-width="4" stroke-linecap="round">
<animateTransform attributeName="transform" type="rotate" values="-25 60 80; 0 60 80; 0 60 80; -25 60 80" keyTimes="0;0.3;0.85;1" dur="6s" repeatCount="indefinite"/></path>
<path d="M260,80 Q220,30 162,60" fill="none" stroke="var(--c6)" stroke-width="4" stroke-linecap="round">
<animateTransform attributeName="transform" type="rotate" values="25 260 80; 0 260 80; 0 260 80; 25 260 80" keyTimes="0;0.3;0.85;1" dur="6s" repeatCount="indefinite"/></path>
<text x="160" y="22" text-anchor="middle" font-size="9" fill="var(--muted)">flexible "flaps" close over the bound inhibitor</text>
<text x="160" y="190" text-anchor="middle" font-size="9" fill="var(--muted)">C₂-symmetric homodimer, 99 residues per chain</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'From the key to the lock',
      body: String.raw`Receptor pharmacologists like James Black designed drugs by modifying the *ligand* — the key — while the *lock* stayed invisible. Emil Fischer's lock-and-key picture of enzymes dated from 1894, but the first protein structure (myoglobin, Kendrew) only appeared in 1958, and the Protein Data Bank started in 1971 with a handful of entries.

By the late 1970s–80s, enzyme mechanisms, crystal structures and interactive computer graphics made a new ambition plausible: **design the molecule to fit the target**. A 1981 *Fortune* cover story already hailed "designing drugs by computer". This lesson follows the landmark cases — and how much (or little) structure each really used.`,
    },
    {
      kind: 'recall',
      title: 'X-ray crystallography (from Chemistry)',
      points: [
        'A protein crystal diffracts X-rays; the pattern encodes the electron density of the molecule.',
        'Solving the phase problem turns intensities into a 3D electron-density map, into which atoms are built.',
        'Resolution (e.g. 2 Å) sets how much detail is reliable; hydrogens and mobile loops are usually not seen.',
        'Soaking or co-crystallising a ligand reveals its binding pose — the raw material of structure-based design.',
      ],
      link: 'chem/xray-crystallography',
    },
    {
      kind: 'explain',
      title: 'Captopril: a model of a lock never seen',
      body: String.raw`Angiotensin-converting enzyme (**ACE**) clips two amino acids off angiotensin I to make the blood-pressure-raising angiotensin II. Peptides from the venom of the Brazilian pit viper *Bothrops jararaca* inhibited ACE; one, **teprotide**, lowered blood pressure in patients but only by injection.

At Squibb, David **Cushman** and Miguel **Ondetti** reasoned that ACE, a zinc enzyme that removes a C-terminal dipeptide, should resemble **carboxypeptidase A**, whose active site *was* known and which is inhibited by benzylsuccinic acid. They built a hypothetical ACE site — zinc, a cationic group holding the C-terminal carboxylate, a hydrogen-bond donor, a small side pocket — and designed small molecules to fill it. ACE's own crystal structure was only solved in 2003.`,
      widget: { type: 'SvgDiagram', props: { svg: aceSvg }, caption: 'The four-point site model (schematic). Swapping the zinc-binding carboxylate for a thiol was the decisive step.' },
    },
    {
      kind: 'widget',
      title: 'Captopril, step by step',
      body: 'Approximate IC50 values against ACE as reported by Cushman, Ondetti and colleagues (1977); later retrospectives quote somewhat different round-number fold-changes. Each change tested one hypothesis about the site model.',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            '**Succinyl-L-proline**: proline mimics the C-terminal residue of the venom peptides, a carboxylate binds zinc. IC50 ≈ 330 µM — weak, but specific.',
            '**D-2-Methylsuccinyl-L-proline**: a methyl fills the small side pocket. IC50 ≈ 22 µM.',
            '**3-Mercaptopropanoyl-L-proline**: replace the zinc-binding carboxylate with a **thiol (–SH)**, a much stronger zinc ligand. IC50 ≈ 0.2 µM.',
            '**Captopril** (D-3-mercapto-2-methylpropanoyl-L-proline): combine both improvements. IC50 ≈ 23 nM. Orally active; approved in 1981.',
            'Merck’s **enalapril** (1980s) later replaced the thiol (blamed for rash and taste loss) with a carboxylate plus extra pocket-filling groups, given as an ester prodrug.',
          ],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Captopril (IC50 ≈ 23 nM) versus the starting compound succinyl-L-proline (IC50 ≈ 330 µM): by how many units did the pIC50 ($= -\log_{10}$ IC50 in molar) increase? Give one decimal place.`,
      answer: 4.2,
      tolerance: 0.1,
      why: String.raw`pIC50 rises from $-\log_{10}(3.3\times10^{-4}) = 3.48$ to $-\log_{10}(2.3\times10^{-8}) = 7.64$: an increase of about 4.2 log units, i.e. a roughly 14,000-fold gain in potency from a few atoms' worth of design.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Captopril was designed by fitting molecules into an X-ray crystal structure of ACE.',
      answer: false,
      why: 'No ACE structure existed until 2003. Captopril (1977) was designed against a *hypothetical* active site inferred from carboxypeptidase A and from what ACE did to its substrates — knowledge-based design, not crystal-structure-based design.',
    },
    {
      kind: 'explain',
      title: 'HIV protease: structure-based design proper',
      body: String.raw`HIV needs its **protease** to cut viral polyproteins into working parts. In 1989 Merck and NCI groups solved its crystal structure: a symmetric dimer of two identical 99-residue chains, with two catalytic aspartates at the interface and flexible "flaps" that close over the substrate.

Inhibitors were built as **transition-state mimics**: the cleavable peptide bond is replaced by a non-cleavable unit (e.g. hydroxyethylamine) whose hydroxyl sits between the two aspartates like the tetrahedral intermediate. Iterative rounds of crystallography of protease–inhibitor complexes guided optimisation. **Saquinavir** was approved in December 1995, **ritonavir** and **indinavir** in March 1996; combined with reverse-transcriptase inhibitors, they made HIV a manageable chronic disease.`,
      widget: { type: 'SvgDiagram', props: { svg: hivSvg }, caption: 'Schematic of the HIV-1 protease dimer. Abbott even exploited its two-fold symmetry to design symmetric (C₂) inhibitors.' },
    },
    {
      kind: 'explain',
      title: 'Zanamivir: adding one group into a seen pocket',
      body: String.raw`Influenza **neuraminidase** cuts sialic acid so new virus particles can escape the cell; its structure was solved in 1983 (Varghese, Laver and Colman). A known transition-state-like inhibitor, DANA, bound only weakly.

Looking at the crystal structure, Mark von Itzstein's team saw two acidic glutamates near DANA's 4-hydroxyl and replaced that –OH with a positively charged **guanidino** group. The result, **zanamivir** (1993 paper; approved 1999), was several orders of magnitude more potent. Gilead's oral **oseltamivir** followed the same structural logic. This is the cleanest example of a single, structure-inspired modification paying off.`,
    },
    {
      kind: 'match',
      prompt: 'Match each drug to the main source of its design.',
      pairs: [
        ['Captopril', 'An active-site model inferred from carboxypeptidase A'],
        ['Saquinavir', 'Transition-state mimicry refined with protease crystal structures'],
        ['Zanamivir', 'A charged group placed into a pocket seen in a viral enzyme structure'],
        ['Imatinib', 'A kinase screening hit optimised by medicinal chemistry'],
      ],
      why: 'These span the spectrum from "rational without a structure" (captopril) to "structure-guided" (HIV protease, neuraminidase) to "target-based but screen-derived" (imatinib).',
    },
    {
      kind: 'explain',
      title: 'Imatinib: targeted, but not designed from a structure',
      body: String.raw`Chronic myeloid leukaemia is driven by **BCR-ABL**, a permanently active tyrosine kinase created by the Philadelphia-chromosome translocation. At Ciba-Geigy (later Novartis), Jürg Zimmermann, Elisabeth Buchdunger and colleagues started from a **2-phenylaminopyrimidine hit from a screen for protein kinase C inhibitors**, and medicinal chemistry did the rest:
- a pyridyl group boosted cellular activity; an amide-linked benzamide gave tyrosine-kinase (ABL) activity;
- a single **"flag methyl"** abolished PKC activity, improving selectivity;
- an **N-methylpiperazine** improved solubility and oral bioavailability.

Brian Druker showed it selectively killed BCR-ABL cells (1996); approval came in May 2001. Crystal structures (2000) *then* explained its selectivity: it binds an **inactive conformation** of ABL. See the full [case study](@drug/case-imatinib-hiv-pi).`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about imatinib’s discovery are correct?',
      choices: [
        'Its lead came from a screen for protein kinase C inhibitors',
        'A single added methyl group reduced PKC activity and improved selectivity',
        'It was designed de novo by docking into a crystal structure of BCR-ABL',
        'A later crystal structure showed it binds an inactive conformation of the ABL kinase',
        'The N-methylpiperazine was added mainly to improve solubility and oral absorption',
      ],
      answers: [0, 1, 3, 4],
      why: 'Imatinib is *target-based* (BCR-ABL chosen first) and *rational* in its optimisation, but its starting point was a screening hit and the structure came afterwards to explain, not create, the drug.',
    },
    {
      kind: 'explain',
      title: 'What the structure era promised — and delivered',
      body: String.raw`Structure-based design became **routine**: today most target-based projects try to get co-crystal structures, and computational tools such as [docking](@drug/docking) grew directly out of this era. Its real strengths are explaining binding modes, suggesting where to add or remove atoms, and designing selectivity.

Its limits were learned the hard way:
- a structure shows a **pose, not an affinity** — water, entropy and protein flexibility decide $\Delta G$;
- proteins move (**induced fit**), and the crystal shows one snapshot;
- resistance mutations (HIV protease; BCR-ABL T315I) change the lock;
- potency is only one property — oral absorption, metabolism and safety still sink most compounds.`,
    },
    {
      kind: 'order',
      prompt: 'Put these milestones in chronological order.',
      steps: [
        'Fischer proposes the lock-and-key model',
        'First protein crystal structure (myoglobin)',
        'Captopril designed from an ACE site model',
        'HIV protease crystal structure solved',
        'First HIV protease inhibitor (saquinavir) approved',
        'Imatinib approved for CML',
      ],
      why: '1894 → 1958 → 1977 → 1989 → 1995 → 2001. Note that captopril came 12 years before the HIV protease structure, and that it took only ~6 years from that structure to an approved protease inhibitor.',
    },
    {
      kind: 'fill',
      prompt: 'Imatinib is a ___ drug — its target was chosen first — but not a ___ drug, because its lead came from screening rather than from a protein structure.',
      bank: ['target-based', 'structure-based', 'phenotypic', 'natural-product'],
      answer: ['target-based', 'structure-based'],
      why: 'Structure-based design is a *subset* of target-based discovery. Confusing them overstates what crystallography did for many "rational" drugs.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Captopril** (Cushman & Ondetti, 1977): the first orally active ACE inhibitor, designed from a *hypothetical* site modelled on carboxypeptidase A — thiol for zinc, proline for the C-terminus.
- **HIV protease inhibitors** (saquinavir 1995; ritonavir, indinavir 1996): transition-state mimics optimised with crystal structures — the flagship of structure-based design.
- **Zanamivir**: one guanidino group placed into a pocket seen by crystallography.
- **Imatinib** (2001): target-based, screen-derived, optimised by medicinal chemistry; structure explained it later.
- Structures give poses, not affinities; flexibility, water, resistance and ADMET remain.`,
    },
  ],
  references: [
    { authors: 'Ondetti, M. A., Rubin, B., Cushman, D. W.', title: 'Design of specific inhibitors of angiotensin-converting enzyme: new class of orally active antihypertensive agents', year: 1977, venue: 'Science 196, 441–444' },
    { authors: 'Wlodawer, A., Vondrasek, J.', title: 'Inhibitors of HIV-1 protease: a major success of structure-assisted drug design', year: 1998, venue: 'Annu. Rev. Biophys. Biomol. Struct. 27, 249–284' },
    { authors: 'von Itzstein, M., Wu, W.-Y., Kok, G. B., et al.', title: 'Rational design of potent sialidase-based inhibitors of influenza virus replication', year: 1993, venue: 'Nature 363, 418–423' },
    { authors: 'Capdeville, R., Buchdunger, E., Zimmermann, J., Matter, A.', title: 'Glivec (STI571, imatinib), a rationally developed, targeted anticancer drug', year: 2002, venue: 'Nat. Rev. Drug Discov. 1, 493–502' },
    { authors: 'Druker, B. J., Tamura, S., Buchdunger, E., et al.', title: 'Effects of a selective inhibitor of the Abl tyrosine kinase on the growth of Bcr–Abl positive cells', year: 1996, venue: 'Nat. Med. 2, 561–566' },
  ],
} satisfies LessonContent;
