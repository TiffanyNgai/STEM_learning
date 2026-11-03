import type { LessonContent } from '../../types';

// Activity landscape: smooth rolling region on the left, a cliff on the right.
const landscapeSvg = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
<text x="10" y="14" font-size="10" font-weight="700" fill="var(--fg)">An activity landscape (1D sketch)</text>
<line x1="30" y1="176" x2="310" y2="176" stroke="var(--muted)"/><line x1="30" y1="176" x2="30" y2="24" stroke="var(--muted)"/>
<text x="300" y="190" font-size="9" fill="var(--muted)" text-anchor="end">structure (similar molecules are close together)</text>
<text x="36" y="32" font-size="9" fill="var(--muted)">pIC50</text>
<path d="M30 130 C 60 110, 80 110, 100 120 S 140 140, 160 118 S 200 100, 214 104 L 222 104 L 226 160 C 240 165, 270 160, 310 156" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<text x="90" y="98" font-size="9" fill="var(--c2)" text-anchor="middle">smooth SAR</text>
<text x="90" y="108" font-size="9" fill="var(--c2)" text-anchor="middle">small change → small effect</text>
<circle cx="218" cy="104" r="5" fill="var(--c4)" stroke="var(--fg)"/>
<circle cx="228" cy="160" r="5" fill="var(--c5)" stroke="var(--fg)"/>
<path d="M240 108 L240 156" stroke="var(--fg)" stroke-width="1.2" marker-end="url(#ah)" marker-start="url(#ah)">
<animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite"/></path>
<defs><marker id="ah" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L6 3 L0 6 z" fill="var(--fg)"/></marker></defs>
<text x="246" y="124" font-size="9" fill="var(--fg)">activity cliff</text>
<text x="246" y="135" font-size="9" fill="var(--fg)">Tc ≈ 0.9, but</text>
<text x="246" y="146" font-size="9" fill="var(--fg)">100× in potency</text>
</svg>`;

// MMP: a constant part with one attachment point; the variable fragment cycles.
const frags = ['H', 'F', 'Cl', 'CH₃'];
const mmpSvg = `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg">
<text x="10" y="14" font-size="10" font-weight="700" fill="var(--fg)">One constant part, many variable fragments</text>
<rect x="20" y="50" width="170" height="70" rx="10" fill="var(--c2)" fill-opacity="0.15" stroke="var(--c2)"/>
<text x="105" y="82" font-size="11" font-weight="700" fill="var(--c2)" text-anchor="middle">constant part</text>
<text x="105" y="98" font-size="9" fill="var(--muted)" text-anchor="middle">(the shared "context")</text>
<line x1="190" y1="85" x2="232" y2="85" stroke="var(--fg)" stroke-width="2" stroke-dasharray="4 3"/>
<text x="211" y="78" font-size="9" fill="var(--muted)" text-anchor="middle">cut bond</text>
<circle cx="258" cy="85" r="24" fill="var(--c3)" fill-opacity="0.2" stroke="var(--c3)"/>
${frags.map((f, i) => `<text x="258" y="90" font-size="13" font-weight="700" fill="var(--c3)" text-anchor="middle" opacity="0">${f}<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.05;0.2;0.25" dur="8s" begin="${i * 2}s" repeatCount="indefinite"/></text>`).join('')}
<text x="258" y="126" font-size="9" fill="var(--c3)" text-anchor="middle">variable part</text>
<text x="160" y="152" font-size="9" fill="var(--muted)" text-anchor="middle">Any two compounds sharing the constant part form a matched pair,</text>
<text x="160" y="164" font-size="9" fill="var(--muted)" text-anchor="middle">e.g. H → F. The change in activity is attributed to that swap.</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Change one thing at a time',
      body: String.raw`Medicinal chemists explore a hit like a careful experimenter: keep most of the molecule fixed, change **one** group, and measure again. The resulting table of structures and potencies is the **structure–activity relationship (SAR)**.

Potency is usually reported as $\text{pIC}_{50} = -\log_{10}(\text{IC}_{50}\ \text{in mol/L})$, so IC50 = 10 nM gives pIC50 = 8 and **higher is more potent** ([binding affinity](@drug/binding-affinity)). On a log scale, **one unit = a 10-fold change**.

This lesson treats SAR as data: where it is smooth, where it breaks, and how to mine it automatically.`,
    },
    {
      kind: 'numeric',
      prompt: 'Two analogues have pIC50 = 7.2 and 5.2. By what factor do their IC50 values differ?',
      answer: 100,
      tolerance: 0.5,
      unit: '-fold',
      why: String.raw`A difference of 2.0 log units is $10^{2} = 100$-fold. A common slip is to read the 2-unit difference as "2-fold": on a log scale, differences multiply.`,
    },
    {
      kind: 'explain',
      title: 'Activity landscapes and cliffs',
      body: String.raw`Picture potency as the height of a landscape over "structure space", where similar molecules sit close together.

- In **smooth** regions small structural changes cause small potency changes. The similarity principle holds, and QSAR models work well.
- An **activity cliff** is a pair of **highly similar** compounds with a **large** potency difference.

Stumpfe and Bajorath (2012) note that a cliff definition needs two criteria: a **similarity criterion** (e.g. a fingerprint Tanimoto threshold, or a matched pair) and a **potency-difference criterion**, often at least 100-fold (2 log units).`,
      widget: { type: 'SvgDiagram', props: { svg: landscapeSvg }, caption: 'Cliffs are the steep drops. They carry the most SAR information, because one small change matters a lot, and they are where similarity-based predictions fail.' },
    },
    {
      kind: 'explain',
      title: 'Measuring steepness: SALI',
      body: String.raw`Guha and Van Drie (2008) defined the **structure–activity landscape index** for a pair of compounds $i, j$:

$$\text{SALI}_{ij} = \frac{|A_i - A_j|}{1 - \text{sim}(i,j)}$$

where $A$ is activity (e.g. pIC50) and sim is a similarity such as Tanimoto. It is a "rise over run": a big activity difference divided by a small structural distance gives a large SALI, which marks a cliff.

Example: $A_i = 7.0$, $A_j = 6.5$, sim = 0.5 gives $0.5/0.5 = 1$, a gentle slope.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Two compounds have pIC50 = 8.1 and 6.1, and Tanimoto similarity 0.90. What is their SALI?`,
      answer: 20,
      tolerance: 0.1,
      why: String.raw`$|8.1-6.1|/(1-0.90) = 2.0/0.10 = 20$, twenty times steeper than the gentle example. The 100-fold potency gap between near-identical structures makes this pair a classic activity cliff.`,
    },
    {
      kind: 'explain',
      title: 'Matched molecular pairs',
      body: String.raw`A **matched molecular pair (MMP)** is two compounds that differ only by a **single, well-defined structural change** at one site, for example H → F on an aromatic ring, or an ethyl ester → carboxylic acid.

Each molecule splits into a **constant part** (shared) and a **variable part** (swapped). The swap is called the **transformation**.

A real example from the clinic: **enalapril** is the ethyl ester of **enalaprilat**, an ACE inhibitor. The pair differs only by OEt → OH. Enalaprilat is the active diacid but is poorly absorbed by mouth. Enalapril is absorbed and then hydrolysed to enalaprilat in the body. One small transformation changes a property, oral absorption, rather than potency at the target.`,
      widget: { type: 'SvgDiagram', props: { svg: mmpSvg } },
    },
    {
      kind: 'mcq',
      prompt: 'Which pair is a matched molecular pair?',
      choices: [
        'Two compounds identical except that one has Cl where the other has F at the same ring position',
        'Two compounds with Tanimoto similarity 0.7 that differ at three positions',
        'Two compounds with the same pIC50 but unrelated scaffolds',
        'Two conformers of the same molecule',
      ],
      answer: 0,
      why: 'An MMP differs by exactly one localised change (here Cl ↔ F) with everything else fixed. A pair that is merely similar but differs at several sites is not an MMP. Equal potency says nothing about structure. Conformers are the same molecule.',
    },
    {
      kind: 'widget',
      title: 'Finding all MMPs in a big data set (Hussain & Rea 2010)',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            '**Fragment.** For every molecule, cut each **acyclic single bond** in turn. Each cut gives a (constant part, variable part) split. Double and triple cuts handle changes in the middle of a molecule.',
            '**Index.** Store each split in a dictionary keyed by the **constant part**, written as a canonical SMILES with an attachment point, e.g. `…C(=O)O[*]`.',
            '**Match.** Every key shared by two or more molecules yields MMPs: enalapril (variable `[*]CC`) and enalaprilat (variable `[*][H]`) share the key `…C(=O)O[*]`.',
            '**Record the transformation** (e.g. `[*]CC>>[*][H]`) and the change in each measured property, such as ΔpIC50 or ΔlogD.',
          ],
          notes: [
            'Ring bonds are not cut, so ring systems stay intact.',
            'Dictionary look-up means no pairwise comparison of all molecules, so the method scales to large corporate databases.',
            'To pair a substituent with plain hydrogen, the algorithm also treats H as a variable part.',
            'The same transformation turns up in many different series. That is what makes it statistically useful.',
          ],
        },
      },
    },
    {
      kind: 'explain',
      title: 'Matched molecular pair analysis',
      body: String.raw`One pair is an anecdote. **Matched molecular pair analysis (MMPA)** collects *every* occurrence of a transformation in a database and studies the **distribution** of property changes (Griffen et al. 2011).

For example, gather all aromatic H → F pairs measured in a solubility assay and look at the mean and spread of $\Delta\log S$. A consistent shift becomes a design rule ("this swap usually helps solubility by about X"). A wide spread means the effect depends on **context**: the surrounding structure and how the molecule sits in the binding site.

Rare, large effects show up as outliers. The "**magic methyl**" is the best known: adding a single methyl group occasionally boosts potency by more than 10-fold, usually through conformational or binding-site effects.`,
    },
    {
      kind: 'numeric',
      prompt: 'Across five different series, the same transformation changed pIC50 by +0.3, +0.5, −0.1, +0.4 and +0.2. What is the mean ΔpIC50?',
      answer: 0.26,
      tolerance: 0.005,
      why: String.raw`$(0.3+0.5-0.1+0.4+0.2)/5 = 1.3/5 = 0.26$ log units, about a 1.8-fold average gain ($10^{0.26}$). Note the spread: in one series the swap hurt. With only five pairs, the uncertainty in the mean is large.`,
    },
    {
      kind: 'truefalse',
      prompt: 'A given transformation (say H → Cl) has the same effect on potency in every chemical series.',
      answer: false,
      why: 'Effects depend on context: where the group points in the binding site, intramolecular interactions, conformation. MMPA reports distributions, and wide ones are a warning that the average is a weak guide for any one series.',
    },
    {
      kind: 'multi',
      prompt: 'Why are activity cliffs a problem for QSAR and similarity-based prediction?',
      choices: [
        'Nearest-neighbour methods predict that similar compounds have similar activity, which a cliff contradicts',
        'Smooth regression models tend to average across the cliff, under-predicting one compound and over-predicting the other',
        'Cliffs show that the experimental data must be wrong and should be deleted',
        'Fingerprint similarity may not capture the small change responsible for the potency jump',
      ],
      answers: [0, 1, 3],
      why: 'Cliffs break the similarity principle that nearest-neighbour and smooth models rely on, and a 2D fingerprint may barely register the change that matters. They are usually real SAR, not errors. Before using one, check the assay data, but do not delete a cliff just because it is inconvenient.',
    },
    {
      kind: 'match',
      prompt: 'Match each term to its meaning.',
      pairs: [
        ['SAR', 'How potency changes as structure is varied'],
        ['Activity cliff', 'Highly similar compounds with a large potency difference'],
        ['Matched molecular pair', 'Two compounds that differ by one localised structural change'],
        ['Transformation', 'The specific swap, e.g. H → F, that defines a matched pair'],
        ['SALI', 'Activity difference divided by (1 − similarity)'],
      ],
      why: 'SAR is the overall relationship; cliffs are its steep spots; MMPs and their transformations are the unit of analysis; SALI quantifies steepness for a pair.',
    },
    {
      kind: 'fill',
      prompt: 'Hussain and Rea find matched pairs by cutting acyclic ___ bonds and indexing the fragments by their ___ part. A pair is an activity cliff when similarity is high and the potency difference is at least about ___ -fold.',
      bank: ['single', 'double', 'constant', 'variable', '100', '2'],
      answer: ['single', 'constant', '100'],
      why: 'Only acyclic single bonds are cut, so rings stay intact. Molecules sharing the same constant part form MMPs. A common cliff criterion is a ≥ 100-fold (2 log unit) potency difference; "2-fold" confuses log units with fold changes.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **SAR** relates structural changes to potency; work in log units (pIC50), where 1 unit = 10-fold.
- **Activity cliffs**: highly similar pairs with large potency gaps (often ≥ 100-fold). **SALI** $= |\Delta A|/(1-\text{sim})$ measures steepness.
- A **matched molecular pair** differs by one localised **transformation**. The Hussain–Rea algorithm finds all MMPs by cutting acyclic single bonds and indexing constant parts.
- **MMPA** aggregates a transformation across many series. The spread matters as much as the mean, because context changes the effect.`,
    },
  ],
  references: [
    { authors: 'Hussain, J., Rea, C.', title: 'Computationally efficient algorithm to identify matched molecular pairs (MMPs) in large data sets', year: 2010, venue: 'J. Chem. Inf. Model. 50, 339–348' },
    { authors: 'Stumpfe, D., Bajorath, J.', title: 'Exploring activity cliffs in medicinal chemistry', year: 2012, venue: 'J. Med. Chem. 55, 2932–2942' },
    { authors: 'Guha, R., Van Drie, J. H.', title: 'Structure–activity landscape index: identifying and quantifying activity cliffs', year: 2008, venue: 'J. Chem. Inf. Model. 48, 646–658' },
    { authors: 'Griffen, E., Leach, A. G., Robb, G. R., Warner, D. J.', title: 'Matched molecular pairs as a medicinal chemistry tool', year: 2011, venue: 'J. Med. Chem. 54, 7739–7750' },
  ],
} satisfies LessonContent;
