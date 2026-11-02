import type { LessonContent } from '../../types';

/** Two SPR sensorgrams: a clean 1:1 binder that saturates at Rmax, and a superstoichiometric "sticky" compound. */
const sensorgramSvg = (() => {
  const x0 = 34, x1 = 170, x2 = 306, yB = 160, yTop = 30;
  const sy = (r: number) => yB - (r / 100) * (yB - yTop); // r in % of plot height (Rmax = 50)
  let good = '', bad = '';
  for (let i = 0; i <= 68; i++) {
    const x = x0 + ((x1 - x0) * i) / 68;
    const t = i / 68;
    const rg = 50 * (1 - Math.exp(-5 * t));
    const rb = 50 * (1 - Math.exp(-5 * t)) + 70 * t;
    good += `${i ? 'L' : 'M'}${x.toFixed(1)} ${sy(rg).toFixed(1)}`;
    bad += `${i ? 'L' : 'M'}${x.toFixed(1)} ${sy(Math.min(rb, 100)).toFixed(1)}`;
  }
  const g1 = 50 * (1 - Math.exp(-5)), b1 = Math.min(50 * (1 - Math.exp(-5)) + 70, 100);
  for (let i = 1; i <= 68; i++) {
    const x = x1 + ((x2 - x1) * i) / 68;
    const t = i / 68;
    good += `L${x.toFixed(1)} ${sy(g1 * Math.exp(-4 * t)).toFixed(1)}`;
    bad += `L${x.toFixed(1)} ${sy(b1 * (0.55 + 0.45 * Math.exp(-3 * t))).toFixed(1)}`;
  }
  const anim = `stroke-dasharray="600" stroke-dashoffset="600"><animate attributeName="stroke-dashoffset" values="600;0;0" keyTimes="0;0.6;1" dur="5s" repeatCount="indefinite"/>`;
  return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
<g font-size="9" fill="var(--fg)">
<text x="160" y="14" font-size="10" font-weight="700" text-anchor="middle">SPR sensorgrams (response vs time)</text>
<line x1="${x0}" y1="${yB}" x2="${x2}" y2="${yB}" stroke="var(--muted)"/>
<line x1="${x0}" y1="${yB}" x2="${x0}" y2="${yTop - 6}" stroke="var(--muted)"/>
<line x1="${x1}" y1="${yTop - 4}" x2="${x1}" y2="${yB}" stroke="var(--muted)" stroke-dasharray="3 3"/>
<line x1="${x0}" y1="${sy(50)}" x2="${x2}" y2="${sy(50)}" stroke="var(--c3)" stroke-dasharray="5 3"/>
<text x="${x2}" y="${sy(50) - 3}" text-anchor="end" fill="var(--c3)">theoretical Rmax (1:1)</text>
<text x="${(x0 + x1) / 2}" y="${yB + 12}" text-anchor="middle" fill="var(--muted)">inject compound</text>
<text x="${(x1 + x2) / 2}" y="${yB + 12}" text-anchor="middle" fill="var(--muted)">buffer only (dissociation)</text>
<text x="${x0 - 4}" y="${yTop}" text-anchor="end" fill="var(--muted)" transform="rotate(-90 ${x0 - 8} ${yTop + 40})">RU</text>
<path d="${good}" fill="none" stroke="var(--c2)" stroke-width="2.2" ${anim}</path>
<path d="${bad}" fill="none" stroke="var(--c5)" stroke-width="2.2" ${anim}</path>
<text x="60" y="190" fill="var(--c2)">● clean 1:1 binder</text>
<text x="180" y="190" fill="var(--c5)">● sticky / aggregating</text>
</g></svg>`;
})();

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Activity is not binding',
      body: String.raw`A hit from a biochemical screen tells you only that *a signal went down* when the compound was present. It could be a genuine inhibitor, or a compound that quenches fluorescence, forms aggregates or reacts with the protein (see [Assay artefacts](@drug/assay-artefacts)).

**Biophysical methods** ask the question directly: *does this molecule bind my protein, how tightly, with what stoichiometry, and where?* Because they rely on physical principles unrelated to the activity readout, they are **orthogonal**: an artefact that fools one rarely fools the other. They are also sensitive enough to detect the weak (µM–mM) binding typical of **fragments**.`,
    },
    {
      kind: 'recall',
      title: 'Recall: surface plasmon resonance (SPR)',
      points: [
        'The target is immobilised on a gold sensor chip; analyte flows over it in buffer.',
        'Binding changes the refractive index at the surface; the response (RU) is proportional to bound **mass**.',
        'The sensorgram shows association, then dissociation in buffer, giving $k_{on}$, $k_{off}$ and $K_D = k_{off}/k_{on}$.',
        'Label-free, uses little protein, medium throughput.',
      ],
      link: 'chem/spr',
    },
    {
      kind: 'widget',
      title: 'Reading a sensorgram for hit validation',
      body: String.raw`For triage, the *shape* of the sensorgram matters as much as the $K_D$. Because SPR measures mass, you can predict the maximum response for **1:1 binding**:

$$R_{max} = \frac{MW_{analyte}}{MW_{target}} \times R_{immobilised} \times n$$

where $n$ is the number of binding sites. A clean binder rises quickly to a plateau at or below $R_{max}$ and returns to baseline in buffer. A compound whose signal keeps climbing far beyond $R_{max}$ and never comes off is sticking non-specifically or aggregating on the surface.`,
      widget: { type: 'SvgDiagram', props: { svg: sensorgramSvg }, caption: 'Blue: saturable, reversible, at the predicted stoichiometry. Red: superstoichiometric and slow to wash off, a warning sign rather than "high affinity".' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A 30 kDa protein is immobilised at 3000 RU. A 300 Da fragment binds at one site. What is the theoretical $R_{max}$ in RU?`,
      answer: 30,
      tolerance: 0.5,
      unit: 'RU',
      why: String.raw`$R_{max} = (300/30\,000) \times 3000 \times 1 = 30$ RU. If this fragment gave 150 RU, it would be binding about 5 molecules per protein, which points to non-specific binding or aggregation. Small fragments give small signals, which is why high immobilisation levels are used for them.`,
    },
    {
      kind: 'recall',
      title: 'Recall: isothermal titration calorimetry (ITC)',
      points: [
        'Ligand is injected stepwise into protein in solution; the instrument measures the heat released or absorbed at each injection.',
        'Fitting the titration gives $K_D$, the binding enthalpy $\\Delta H$ and the stoichiometry $n$ in one experiment.',
        '$\\Delta G = RT\\ln K_D$ and $-T\\Delta S = \\Delta G - \\Delta H$ follow.',
        'Label-free and immobilisation-free, but slow and protein-hungry.',
      ],
      link: 'chem/calorimetry-itc',
    },
    {
      kind: 'explain',
      title: 'ITC in a discovery project',
      body: String.raw`ITC is the one technique that measures binding **in solution, with nothing attached**, and returns the stoichiometry directly. A fitted $n \approx 1$ is strong evidence of a specific 1:1 interaction. $n = 0.5$ may mean half the protein is inactive; $n = 5$ suggests non-specific binding.

The titration curve is only informative inside a window set by the **c-value**, $c = n[P]K_A$ (with $K_A = 1/K_D$). Wiseman et al. (1989) showed that a reliable fit needs roughly $1 < c < 1000$. For weak fragments that means very high protein concentrations.

The split of $\Delta G$ into $\Delta H$ and $-T\Delta S$ is tempting to over-read. Enthalpy and entropy often compensate, so "enthalpy-driven" alone is not a reliable guide to which compound to optimise.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`An ITC titration of a hit gives a clean sigmoidal curve with fitted $K_D = 2$ µM and stoichiometry $n = 0.98$. What does this most directly add beyond the biochemical IC50?`,
      choices: [
        'Proof that the compound binds the protein directly, about one molecule per protein, in solution',
        'The compound’s binding pose in the active site',
        'Proof that the compound will be active in cells',
        'The compound’s residence time',
      ],
      answer: 0,
      why: String.raw`ITC measures heat from direct binding in solution and returns $n$: here a specific 1:1 interaction. It gives no atomic pose (that needs crystallography or NMR), says nothing about cell permeability, and a standard ITC fit does not give $k_{off}$ (SPR does).`,
    },
    {
      kind: 'explain',
      title: 'Thermal shift (DSF): the cheap first look',
      body: String.raw`Heat a protein and it unfolds at a characteristic **melting temperature** $T_m$. In **differential scanning fluorimetry** (DSF; Niesen, Berglund & Vedadi 2007) a dye such as SYPRO Orange fluoresces when it binds the hydrophobic interior exposed on unfolding. A qPCR machine ramps the temperature in a 96- or 384-well plate and records the fluorescence.

A ligand that binds the **folded** state stabilises it, raising $T_m$ by $\Delta T_m$. It is cheap, fast and needs only micrograms of protein, so it suits triage.

Caveats: $\Delta T_m$ is *not* a simple measure of affinity (it also depends on binding enthalpy and ligand concentration). Some genuine binders give no shift. Fluorescent or dye-binding compounds interfere. The cell-based version, **CETSA** (Martinez Molina et al. 2013), measures target stabilisation in cells. That makes it a test of [target engagement](@drug/biomarkers-target-engagement).`,
    },
    {
      kind: 'widget',
      title: 'Melting curves with and without ligand',
      body: 'Grey/blue: the apo protein melts at 50 °C. Drag ΔTm to see how a stabilising ligand shifts the curve to the right.',
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['1/(1+exp((50-x)/1.8))', '1/(1+exp((50+d-x)/1.8))'],
          x: [35, 75], y: [0, 1.05],
          params: [{ name: 'd', min: -3, max: 12, value: 5, label: 'ΔTm (°C)' }],
          labels: ['apo protein', '+ ligand'],
          xLabel: 'temperature (°C)', yLabel: 'fraction unfolded',
        },
        caption: 'Tm is the midpoint of the transition. A negative ΔTm (destabilisation) can still mean binding, e.g. to the unfolded or a less stable state.',
      },
    },
    {
      kind: 'truefalse',
      prompt: 'Among compounds binding the same protein, a larger thermal shift ΔTm always means a tighter binder (lower KD).',
      answer: false,
      why: String.raw`$\Delta T_m$ depends on affinity *and* on the binding enthalpy, the ligand concentration relative to $K_D$ and the protein's unfolding thermodynamics. Rankings by $\Delta T_m$ only roughly follow $K_D$ within a series. DSF is for yes/no triage. Measure $K_D$ by SPR or ITC.`,
    },
    {
      kind: 'explain',
      title: 'NMR and crystallography: where does it bind?',
      body: String.raw`**Ligand-observed NMR** watches the small molecule's signals ([NMR basics](@chem/nmr-basics)). In **STD-NMR** (Mayer & Meyer 1999) the protein is selectively saturated; only ligands that visit it pick up the saturation, so their peaks appear in a difference spectrum. **WaterLOGSY** works similarly via water. These methods detect mM binders in mixtures without labelled protein, which suits fragments.

**Protein-observed NMR** (¹H–¹⁵N HSQC) needs isotope-labelled protein. Peaks that shift on adding ligand map *which residues* it touches. This was the basis of "SAR by NMR".

**X-ray crystallography** ([home lesson](@chem/xray-crystallography)) gives the atomic binding pose, the starting point for structure-based design. Fragments are often soaked into pre-grown crystals. Always check that the electron density really supports the modelled ligand. For large complexes and membrane proteins, [cryo-EM](@chem/cryo-em) is increasingly used.`,
    },
    {
      kind: 'match',
      prompt: 'Match each method to the question it answers best during hit validation.',
      pairs: [
        ['SPR', 'How fast does it bind and leave (kon, koff)?'],
        ['ITC', 'What are the stoichiometry and enthalpy, in solution with nothing labelled or immobilised?'],
        ['DSF / thermal shift', 'Cheaply: does it stabilise the folded protein at all?'],
        ['STD-NMR', 'Does a weak fragment bind, detected without labelled protein?'],
        ['X-ray crystallography', 'What is the atomic binding pose?'],
      ],
      why: 'Each technique has a sweet spot. SPR gives kinetics, ITC thermodynamics and n, DSF fast triage, ligand-observed NMR sensitive detection of weak binders, and crystallography structure. Projects usually combine two or more so that no single artefact survives.',
    },
    {
      kind: 'multi',
      prompt: 'Which results support a hit being a genuine, specific binder? (Select all that apply.)',
      choices: [
        String.raw`SPR response saturates near the theoretical $R_{max}$ and returns to baseline in buffer`,
        String.raw`ITC gives a fitted stoichiometry $n \approx 1$`,
        'A crystal structure shows clear electron density for the compound in the pocket',
        String.raw`SPR response is 8× the theoretical $R_{max}$ and still rising`,
        'Binding disappears when a known active-site ligand is added first (competition)',
      ],
      answers: [0, 1, 2, 4],
      why: String.raw`Saturable 1:1 binding, sensible stoichiometry, unambiguous density and displacement by a known ligand all point to a specific site. A superstoichiometric, non-saturating SPR signal is the classic sign of non-specific binding or aggregation.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Biophysics confirms **direct binding** with physics unrelated to the activity readout. These assays are orthogonal.
- **SPR**: kinetics and $K_D$; check that responses saturate near $R_{max} = (MW_a/MW_t)\,R_{imm}\,n$.
- **ITC**: $K_D$, $\Delta H$ and stoichiometry $n$ in solution; needs $1 < c < 1000$.
- **DSF**: cheap $\Delta T_m$ triage; not a ranking of affinity. **CETSA** extends it to cells.
- **NMR** detects weak fragment binding and maps the site; **crystallography** gives the pose for design.
- Combine methods: the hit worth optimising is one that every orthogonal assay agrees on.`,
    },
  ],
  references: [
    { authors: 'Renaud, J.-P., Chung, C.-W., Danielson, U. H., et al.', title: 'Biophysics in drug discovery: impact, challenges and opportunities', year: 2016, venue: 'Nat. Rev. Drug Discov. 15, 679–698' },
    { authors: 'Niesen, F. H., Berglund, H., Vedadi, M.', title: 'The use of differential scanning fluorimetry to detect ligand interactions that promote protein stability', year: 2007, venue: 'Nat. Protoc. 2, 2212–2221' },
    { authors: 'Wiseman, T., Williston, S., Brandts, J. F., Lin, L.-N.', title: 'Rapid measurement of binding constants and heats of binding using a new titration calorimeter', year: 1989, venue: 'Anal. Biochem. 179, 131–137' },
    { authors: 'Mayer, M., Meyer, B.', title: 'Characterization of ligand binding by saturation transfer difference NMR spectroscopy', year: 1999, venue: 'Angew. Chem. Int. Ed. 38, 1784–1788' },
    { authors: 'Martinez Molina, D., Jafari, R., Ignatushchenko, M., et al.', title: 'Monitoring drug target engagement in cells and tissues using the cellular thermal shift assay', year: 2013, venue: 'Science 341, 84–87' },
  ],
} satisfies LessonContent;
