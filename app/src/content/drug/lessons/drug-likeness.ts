import type { LessonContent } from '../../types';

// bar chart: each Ro5 property as fraction of its limit, aspirin vs ciclosporin
const props: [string, number, number, number][] = [
  // label, limit, aspirin, ciclosporin
  ['MW ≤ 500', 500, 180, 1203],
  ['logP ≤ 5', 5, 1.2, 2.9],
  ['HBD ≤ 5', 5, 1, 5],
  ['HBA ≤ 10', 10, 4, 23],
];
const ro5Svg = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
<text x="10" y="14" font-size="10" font-weight="700" fill="var(--fg)">Rule-of-5 properties as % of the limit</text>
<line x1="210" y1="22" x2="210" y2="170" stroke="var(--c5)" stroke-dasharray="4 3"/>
<text x="210" y="182" font-size="9" fill="var(--c5)" text-anchor="middle">limit</text>
${props.map(([lab, lim, a, c], i) => {
  const y = 30 + i * 36; const w = (v: number) => Math.min(300, 70 + (v / lim) * 140) - 70;
  return `<text x="66" y="${y + 13}" font-size="9" text-anchor="end" fill="var(--fg)">${lab}</text>
<rect x="70" y="${y}" width="0" height="12" rx="3" fill="var(--c2)"><animate attributeName="width" from="0" to="${w(a).toFixed(0)}" dur="1s" fill="freeze"/></rect>
<rect x="70" y="${y + 14}" width="0" height="12" rx="3" fill="var(--c3)"><animate attributeName="width" from="0" to="${w(c).toFixed(0)}" dur="1s" begin="0.5s" fill="freeze"/></rect>`;
}).join('\n')}
<rect x="230" y="24" width="10" height="8" fill="var(--c2)"/><text x="244" y="31" font-size="9" fill="var(--fg)">aspirin</text>
<rect x="230" y="36" width="10" height="8" fill="var(--c3)"/><text x="244" y="43" font-size="9" fill="var(--fg)">ciclosporin</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Potent is not enough',
      body: String.raw`A molecule can bind its target beautifully and still be useless as a pill: it might not dissolve, not cross the gut wall, or be cleared by the liver within minutes. **Drug-likeness** is the set of simple property rules that capture what oral drugs tend to look like.

Think of it like airline luggage limits: they don't tell you whether your trip will be good, but bags that break the rules usually cause trouble.`,
    },
    {
      kind: 'recall',
      title: 'Intermolecular forces (from Chemistry)',
      points: [
        '**Hydrogen bonds** form between donors (N–H, O–H) and acceptors (N, O lone pairs).',
        'Polar molecules dissolve in water; non-polar ("greasy") ones prefer lipids.',
        '**logP** = log₁₀ of a compound’s partition ratio between octanol and water — a measure of lipophilicity.',
      ],
      link: 'chem/intermolecular-forces',
    },
    {
      kind: 'explain',
      title: 'Lipinski’s rule of five (1997)',
      body: String.raw`Lipinski and colleagues at Pfizer analysed ~2,200 compounds that had reached Phase II and found that **poor absorption or permeability is more likely** when a compound has more than one of:

- molecular weight **> 500** Da
- calculated logP **> 5**
- more than **5** hydrogen-bond **donors** (sum of OH and NH)
- more than **10** hydrogen-bond **acceptors** (sum of N and O)

All cut-offs are multiples of five — hence the name. It concerns **oral absorption by passive diffusion**, nothing else. It says nothing about potency, toxicity, or injectable drugs.`,
    },
    {
      kind: 'mcq',
      prompt: 'Ibuprofen has MW 206, cLogP ≈ 4.0, 1 H-bond donor and 2 acceptors. How many Lipinski rules does it violate?',
      choices: ['0', '1', '2', '4'],
      answer: 0,
      why: 'All four values are inside the limits (206 ≤ 500, 4.0 ≤ 5, 1 ≤ 5, 2 ≤ 10). Note logP 4 is close to the limit — ibuprofen is fairly greasy, but still a classic well-absorbed oral drug.',
      widget: { type: 'MolGraphFingerprint', props: { molecule: 'ibuprofen', view: 'structure' } },
    },
    {
      kind: 'explain',
      title: 'Beyond the rule of five',
      body: String.raw`Lipinski himself noted exceptions: **natural products** and **substrates of transporters** often break the rules and are still orally active. Ciclosporin (MW ≈ 1,203) is the famous example — it can shield its own H-bond donors by folding up, behaving like a "chameleon" in membranes.

Today a growing share of approved oral drugs lie **beyond the rule of 5 (bRo5)** — macrocycles, PROTAC degraders, some kinase inhibitors (Doak et al. 2014). The rule is a **risk flag**, not a law.`,
      widget: { type: 'SvgDiagram', props: { svg: ro5Svg }, caption: 'Aspirin sits comfortably inside every limit; ciclosporin breaks two, yet is an approved oral drug.' },
    },
    {
      kind: 'truefalse',
      prompt: 'A compound that violates two Lipinski rules cannot become an approved oral drug.',
      answer: false,
      why: 'The rule flags *increased risk* of poor absorption. Many bRo5 drugs (ciclosporin, several macrocycles and degraders) are oral. Treating rules of thumb as hard filters can throw away good chemistry.',
    },
    {
      kind: 'explain',
      title: 'Veber’s rules and polarity',
      body: String.raw`Veber et al. (2002) studied oral bioavailability in rats and found two more useful limits:
- **≤ 10 rotatable bonds** (flexibility costs entropy and permeability), and
- **polar surface area (TPSA) ≤ 140 Å²** (or ≤ 12 H-bond donors + acceptors).

**TPSA** is the surface area of N and O atoms and their attached hydrogens — a proxy for how hard it is to strip water off the molecule to enter a membrane. Brain-penetrant drugs usually need much lower TPSA (roughly < 90 Å²).`,
    },
    {
      kind: 'match',
      prompt: 'Match each rule to its threshold.',
      pairs: [
        ['Molecular weight (Lipinski)', '≤ 500 Da'],
        ['H-bond donors (Lipinski)', '≤ 5'],
        ['H-bond acceptors (Lipinski)', '≤ 10'],
        ['Rotatable bonds (Veber)', '≤ 10'],
        ['TPSA (Veber)', '≤ 140 Å²'],
      ],
      why: 'Lipinski: 500 / 5 / 5 / 10 (MW, logP, HBD, HBA). Veber adds flexibility (rotatable bonds ≤ 10) and polarity (TPSA ≤ 140 Å²).',
    },
    {
      kind: 'explain',
      title: 'QED: a continuous score',
      body: String.raw`Rules give pass/fail; **QED** (Quantitative Estimate of Drug-likeness; Bickerton et al. 2012) gives a score in $[0,1]$.

For each of 8 properties (MW, logP, HBA, HBD, TPSA, rotatable bonds, aromatic rings, structural alerts) they fitted a **desirability function** $d_i \in [0,1]$ to the distribution seen in oral drugs — high where drugs are common, low in the tails. QED is the (weighted) **geometric mean**

$$\text{QED} = \exp\!\Big(\tfrac{1}{\sum w_i}\sum_i w_i \ln d_i\Big).$$

A geometric mean punishes any single very bad property — one $d_i$ near 0 drags the whole score down. QED is widely used as an objective in generative design.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['exp(-((x-m)/s)^2/2)'],
          x: [0, 800], y: [0, 1.1],
          params: [{ name: 'm', min: 200, max: 500, value: 300, label: 'peak MW' }, { name: 's', min: 40, max: 200, value: 110, label: 'width' }],
          xLabel: 'MW (Da)', yLabel: 'desirability d',
        },
        caption: 'A simplified desirability curve for MW (QED actually uses asymmetric double-sigmoid fits to approved oral drugs).',
      },
    },
    {
      kind: 'mcq',
      prompt: 'Why does QED use a geometric rather than an arithmetic mean of desirabilities?',
      choices: ['It is faster to compute', 'So that one terrible property cannot be hidden by many good ones', 'So that the score can exceed 1', 'Because desirabilities are negative'],
      answer: 1,
      why: 'If any $d_i \to 0$, the geometric mean $\to 0$. With an arithmetic mean, a molecule with MW 2000 but otherwise ideal properties could still score highly.',
    },
    {
      kind: 'explain',
      title: 'Ligand efficiency: potency per atom',
      body: String.raw`Bigger molecules usually bind more tightly — but then become un-drug-like ("molecular obesity"). **Ligand efficiency** (Hopkins et al. 2004) normalises affinity by size:

$$LE = \frac{-\Delta G}{N_{heavy}} \approx \frac{1.37\times pIC_{50}}{N_{heavy}}\ \text{kcal/mol per heavy atom}$$

(using 1.37 kcal/mol per log unit at ~300 K). A rule of thumb is to aim for **LE ≳ 0.3**. Example: pIC50 = 8 with 30 heavy atoms → $1.37\times8/30 \approx 0.37$. Fragments are judged by LE because their raw potency is weak; the related **rule of three** (MW < 300, cLogP ≤ 3, HBD ≤ 3, HBA ≤ 3; Congreve et al. 2003) defines fragment-like space.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A fragment has pIC50 = 4.0 and 12 heavy atoms. Using $LE \approx 1.37\times pIC_{50}/N_{heavy}$, what is its ligand efficiency (kcal/mol per heavy atom)?`,
      answer: 0.457,
      tolerance: 0.01,
      why: String.raw`$1.37\times4/12 \approx 0.46$ — excellent efficiency despite only 100 µM potency. That is why fragment chemists happily start from weak binders: if LE can be maintained while growing to ~30 heavy atoms, potency reaches the nM range.`,
    },
    {
      kind: 'fill',
      prompt: 'Lipinski’s rule predicts risk of poor ___ ; QED combines desirabilities with a ___ mean; ligand efficiency divides binding free energy by the number of ___ atoms.',
      bank: ['absorption', 'potency', 'geometric', 'arithmetic', 'heavy', 'hydrogen'],
      answer: ['absorption', 'geometric', 'heavy'],
      why: 'Ro5 is about oral absorption/permeability, not potency. QED’s geometric mean penalises any poor property. LE counts **heavy** (non-hydrogen) atoms.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Lipinski Ro5** (MW 500, logP 5, HBD 5, HBA 10; >1 violation flags risk) concerns **oral passive absorption** only.
- **Veber**: ≤ 10 rotatable bonds, TPSA ≤ 140 Å². Many successful drugs lie **beyond Ro5**.
- **QED**: geometric mean of property desirabilities, $\in[0,1]$ — a smooth objective for design.
- **Ligand efficiency** $\approx 1.37\,pIC_{50}/N_{heavy}$ keeps potency gains honest; aim ≳ 0.3.
- These are **guides, not laws** — use them to flag risk, not to forbid chemistry.`,
    },
  ],
  references: [
    { authors: 'Lipinski, C. A., Lombardo, F., Dominy, B. W., Feeney, P. J.', title: 'Experimental and computational approaches to estimate solubility and permeability in drug discovery and development settings', year: 1997, venue: 'Adv. Drug Deliv. Rev. 23, 3–25' },
    { authors: 'Veber, D. F., Johnson, S. R., Cheng, H.-Y., et al.', title: 'Molecular properties that influence the oral bioavailability of drug candidates', year: 2002, venue: 'J. Med. Chem. 45, 2615–2623' },
    { authors: 'Bickerton, G. R., Paolini, G. V., Besnard, J., Muresan, S., Hopkins, A. L.', title: 'Quantifying the chemical beauty of drugs', year: 2012, venue: 'Nat. Chem. 4, 90–98' },
    { authors: 'Hopkins, A. L., Groom, C. R., Alex, A.', title: 'Ligand efficiency: a useful metric for lead selection', year: 2004, venue: 'Drug Discov. Today 9, 430–431' },
    { authors: 'Doak, B. C., Over, B., Giordanetto, F., Kihlberg, J.', title: 'Oral druggable space beyond the rule of 5: insights from drugs and clinical candidates', year: 2014, venue: 'Chem. Biol. 21, 1115–1142' },
  ],
} satisfies LessonContent;
