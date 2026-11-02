import type { LessonContent } from '../../types';

// Transwell (Caco-2) assay: apical donor, monolayer on a filter, basolateral receiver; P-gp pumps some molecules back.
const cells = Array.from({ length: 9 }, (_, i) => `<rect x="${42 + i * 26}" y="96" width="24" height="22" rx="5" fill="var(--c1)" fill-opacity="0.25" stroke="var(--c1)"/><circle cx="${54 + i * 26}" cy="107" r="3" fill="var(--c1)" fill-opacity="0.6"/>`).join('');
const transwellSvg = String.raw`<svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg" font-size="9" fill="var(--fg)">
<text x="160" y="12" text-anchor="middle" font-size="10" font-weight="700">Caco-2 Transwell: apical (A) → basolateral (B)</text>
<rect x="38" y="22" width="244" height="72" fill="var(--c2)" fill-opacity="0.08" stroke="var(--grid)"/>
<text x="44" y="36" fill="var(--c2)" font-weight="700">apical donor (gut lumen side)</text>
<text x="44" y="48" font-size="8" fill="var(--muted)">compound added here, e.g. 10 µM</text>
${cells}
<rect x="38" y="119" width="244" height="4" fill="var(--muted)" fill-opacity="0.5"/>
<text x="286" y="123" font-size="8" fill="var(--muted)">filter</text>
<rect x="22" y="124" width="276" height="56" fill="var(--c3)" fill-opacity="0.08" stroke="var(--grid)"/>
<text x="28" y="172" fill="var(--c3)" font-weight="700">basolateral receiver (blood side): sampled over time</text>
<g fill="var(--c2)">
<circle r="3.5"><animateMotion dur="3s" repeatCount="indefinite" path="M80,60 V150"/></circle>
<circle r="3.5"><animateMotion dur="3s" begin="1s" repeatCount="indefinite" path="M160,55 V150"/></circle>
<circle r="3.5"><animateMotion dur="3s" begin="2s" repeatCount="indefinite" path="M120,65 V150"/></circle>
</g>
<g fill="var(--c5)">
<circle r="3.5"><animateMotion dur="3s" repeatCount="indefinite" path="M236,60 V104 V60"/></circle>
</g>
<rect x="228" y="88" width="18" height="10" rx="3" fill="var(--c5)" fill-opacity="0.35" stroke="var(--c5)"/>
<text x="250" y="80" font-size="8" fill="var(--c5)">P-gp pumps</text><text x="250" y="90" font-size="8" fill="var(--c5)">it back out</text>
<text x="160" y="200" text-anchor="middle" font-size="8" fill="var(--muted)">Papp = (dQ/dt) / (A · C₀)  ·  run B→A too: efflux ratio = Papp(B→A) / Papp(A→B)</text>
</svg>`;

const bcsSvg = String.raw`<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-size="9" fill="var(--fg)">
<text x="175" y="14" text-anchor="middle" font-weight="700">Biopharmaceutics Classification System</text>
<text x="175" y="194" text-anchor="middle">solubility →</text>
<text x="14" y="105" text-anchor="middle" transform="rotate(-90 14 105)">permeability →</text>
<text x="105" y="182" text-anchor="middle" font-size="8" fill="var(--muted)">low</text><text x="245" y="182" text-anchor="middle" font-size="8" fill="var(--muted)">high</text>
<rect x="36" y="22" width="138" height="76" rx="6" fill="var(--c3)" fill-opacity="0.2" stroke="var(--c3)"><animate attributeName="fill-opacity" values="0.2;0.4;0.2" dur="3s" begin="1s" repeatCount="indefinite"/></rect>
<text x="105" y="48" text-anchor="middle" font-weight="700">Class II</text><text x="105" y="62" text-anchor="middle" font-size="8">dissolution-limited</text><text x="105" y="76" text-anchor="middle" font-size="8">e.g. carbamazepine</text>
<rect x="178" y="22" width="138" height="76" rx="6" fill="var(--c1)" fill-opacity="0.2" stroke="var(--c1)"><animate attributeName="fill-opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite"/></rect>
<text x="247" y="48" text-anchor="middle" font-weight="700">Class I</text><text x="247" y="62" text-anchor="middle" font-size="8">well absorbed</text><text x="247" y="76" text-anchor="middle" font-size="8">e.g. metoprolol</text>
<rect x="36" y="102" width="138" height="68" rx="6" fill="var(--c5)" fill-opacity="0.2" stroke="var(--c5)"><animate attributeName="fill-opacity" values="0.2;0.4;0.2" dur="3s" begin="2s" repeatCount="indefinite"/></rect>
<text x="105" y="126" text-anchor="middle" font-weight="700">Class IV</text><text x="105" y="140" text-anchor="middle" font-size="8">both limit absorption</text><text x="105" y="154" text-anchor="middle" font-size="8">often cited: furosemide</text>
<rect x="178" y="102" width="138" height="68" rx="6" fill="var(--c2)" fill-opacity="0.2" stroke="var(--c2)"><animate attributeName="fill-opacity" values="0.2;0.4;0.2" dur="3s" begin="1.5s" repeatCount="indefinite"/></rect>
<text x="247" y="126" text-anchor="middle" font-weight="700">Class III</text><text x="247" y="140" text-anchor="middle" font-size="8">permeability-limited</text><text x="247" y="154" text-anchor="middle" font-size="8">e.g. atenolol</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Dissolve, then cross',
      body: String.raw`A tablet in the stomach is a solid. Only molecules **dissolved** in gut fluid can be absorbed, and they must then **cross** the layer of cells lining the intestine to reach the blood.

So oral absorption is roughly a product of two things:

$$\text{absorption rate} \approx P_{\text{eff}} \times A \times C_{\text{dissolved}}$$

where $P_{\text{eff}}$ is the permeability of the gut wall, $A$ its surface area and $C_{\text{dissolved}}$ the dissolved concentration, which can never exceed the **solubility**. A drug that is perfectly permeable but barely dissolves is absorbed as poorly as one that dissolves but cannot cross.`,
    },
    {
      kind: 'recall',
      title: 'Membranes & transport (from Biology)',
      points: [
        'Cell membranes are lipid bilayers: small, uncharged, lipophilic molecules cross by **passive diffusion**.',
        'Ions and polar molecules need **channels** or **carrier proteins**.',
        '**Active transport** uses energy (e.g. ATP) to move molecules against a gradient.',
        'Epithelial cells are sealed by **tight junctions**, so most material must pass *through* the cells.',
      ],
      link: 'bio/membranes-transport',
    },
    {
      kind: 'explain',
      title: 'Kinetic vs thermodynamic solubility',
      body: String.raw`**Kinetic solubility** (tier 1): a 10 mM DMSO stock is spiked into pH 7.4 buffer and, after a short incubation (minutes to about 2 h), precipitate is detected by light scattering (nephelometry) or the filtrate is measured by UV. It is fast and needs no solid compound. However, the precipitate is often amorphous and the solution can stay **supersaturated**, so values are often higher than the true solubility.

**Thermodynamic (equilibrium) solubility** (tier 2): excess **solid** is shaken in buffer for about 24 h (the shake-flask method), filtered and quantified by HPLC or LC-MS. It reflects the most stable crystal form, so it can drop sharply when a less soluble **polymorph** appears.`,
    },
    {
      kind: 'mcq',
      prompt: 'A team measures a kinetic solubility of 150 µM, but the thermodynamic solubility of the crystalline powder is only 8 µM. What is the most likely explanation?',
      choices: [
        'The kinetic assay started from DMSO solution and stayed supersaturated or formed amorphous precipitate',
        'The thermodynamic assay used a higher pH, which always lowers solubility',
        'Kinetic solubility is measured in octanol, not water',
        'Thermodynamic solubility includes compound bound to plasma proteins',
      ],
      answer: 0,
      why: 'Starting from a DMSO solution bypasses the crystal lattice, so the compound can stay supersaturated or crash out as more soluble amorphous material. The equilibrium shake-flask experiment starts from the stable crystal and gives the lower, true value. Both assays use aqueous buffer, and plasma proteins play no part in either.',
    },
    {
      kind: 'explain',
      title: 'Solubility depends on pH',
      body: String.raw`Only the **neutral** form has a limited intrinsic solubility, $S_0$. Ionised molecules are far more water-friendly. For a weak acid and a weak base respectively (roughly, until the salt's own solubility limit is reached):

$$S_{\text{acid}} = S_0\left(1 + 10^{\,\mathrm{pH}-\mathrm{p}K_a}\right), \qquad S_{\text{base}} = S_0\left(1 + 10^{\,\mathrm{p}K_a-\mathrm{pH}}\right)$$

Basic drugs therefore dissolve well in the acidic stomach (pH 1–2) and less well in the intestine (pH 6–7.5). Slide the pKa and compare the acid and the base curves.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['s + log10(1 + 10^(x - p))', 's + log10(1 + 10^(p - x))'],
          labels: ['weak acid', 'weak base'],
          x: [1, 10], y: [-6, 0],
          params: [{ name: 'p', min: 2, max: 10, value: 6, label: 'pKa' }, { name: 's', min: -6, max: -3, value: -5, label: 'log S0 (M)' }],
          xLabel: 'pH', yLabel: 'log S (M)',
        },
        caption: 'Each pH unit beyond the pKa adds a factor of 10 to the solubility (+1 in log S). Real profiles flatten when the salt precipitates.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A basic drug has pKa = 8.4 and intrinsic solubility $S_0 = 5\ \mu$g/mL. Estimate its solubility (µg/mL) at pH 6.4.`,
      answer: 505,
      tolerance: 5,
      unit: 'µg/mL',
      why: String.raw`$S = S_0(1 + 10^{8.4-6.4}) = 5 \times (1 + 100) = 505\ \mu$g/mL. Two pH units below the pKa the base is about 99 % protonated. Forgetting the "1 +" gives 500, which is close here, but the term matters near the pKa.`,
    },
    {
      kind: 'explain',
      title: 'Brick dust and grease balls',
      body: String.raw`Dissolving means breaking the molecule out of its crystal **and** surrounding it with water. The **General Solubility Equation** (Jain & Yalkowsky 2001) captures both costs for non-electrolytes:

$$\log S = 0.5 - 0.01\,(\mathrm{MP} - 25) - \log P$$

with $S$ in mol/L and melting point MP in °C. A high MP signals a strong crystal lattice (**"brick dust"**); a high logP signals poor hydration (**"grease ball"**). Example: MP 225 °C and logP 3 gives $\log S = 0.5 - 2 - 3 = -4.5$, about 32 µM.

ML models (e.g. trained on the AqSolDB set used in the Therapeutics Data Commons) now predict log S with errors of roughly 0.5–1 log unit, comparable to the scatter between experimental labs.`,
    },
    {
      kind: 'fill',
      prompt: 'In the General Solubility Equation, a high melting point signals a strong crystal ___ ("brick dust"), while a high logP signals poor ___ ("grease ball"). Raising either one ___ the predicted solubility.',
      bank: ['lattice', 'hydration', 'lowers', 'raises', 'permeability', 'ionisation'],
      answer: ['lattice', 'hydration', 'lowers'],
      why: 'Both terms enter with a minus sign: every 100 °C of melting point costs 1 log unit, and every unit of logP costs another. Flattening planar stacks (to lower MP) and lowering logP are therefore the two classic solubility fixes.',
    },
    {
      kind: 'explain',
      title: 'Measuring permeability: PAMPA, Caco-2, MDCK',
      body: String.raw`- **PAMPA** (Kansy et al. 1998): an artificial lipid layer soaked into a filter. It measures **passive diffusion only**, is cheap and runs in 96-well plates.
- **Caco-2**: a human colon carcinoma cell line grown for about 21 days on a Transwell filter until it forms a polarised monolayer with tight junctions and transporters such as **P-gp** and BCRP. It is the standard model of the human gut wall.
- **MDCK** (dog kidney) cells form monolayers in a few days. **MDR1-MDCK** cells overexpress human P-gp and are used to flag efflux, especially at the blood–brain barrier.

The result is an **apparent permeability**:

$$P_{\text{app}} = \frac{dQ/dt}{A\,C_0}$$

where $dQ/dt$ is the rate of appearance in the receiver, $A$ the filter area and $C_0$ the donor concentration.`,
      widget: { type: 'SvgDiagram', props: { svg: transwellSvg }, caption: 'Blue molecules diffuse through the cells to the receiver; a P-gp substrate (red) is pumped back into the apical chamber.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`In a Caco-2 experiment ($A = 1$ cm², donor $C_0 = 10\ \mu$M $= 1\times10^{-8}$ mol/cm³), compound appears in the receiver at $dQ/dt = 1\times10^{-13}$ mol/s. What is $P_{\text{app}}$ in units of $10^{-6}$ cm/s?`,
      answer: 10,
      tolerance: 0.1,
      unit: '×10⁻⁶ cm/s',
      why: String.raw`$P_{\text{app}} = 10^{-13}/(1\times10^{-8}) = 10^{-5}$ cm/s $= 10\times10^{-6}$ cm/s. As a rough guide, Caco-2 $P_{\text{app}}$ above about $10\times10^{-6}$ cm/s suggests high absorption and below about $1\times10^{-6}$ cm/s suggests poor absorption, though cut-offs vary between labs. Converting µM to mol/cm³ is the usual trap: 1 µM = $10^{-9}$ mol/cm³.`,
    },
    {
      kind: 'explain',
      title: 'Efflux and P-glycoprotein',
      body: String.raw`**P-glycoprotein** (P-gp, gene *ABCB1*) is an ATP-driven pump in the apical membrane of gut cells, the blood–brain barrier, liver and kidney. It grabs many lipophilic substrates from inside the membrane and pushes them back out.

To detect it, run the Caco-2 or MDR1-MDCK assay in **both directions** and compute the **efflux ratio**

$$ER = \frac{P_{\text{app}}(B\to A)}{P_{\text{app}}(A\to B)}.$$

An $ER \gtrsim 2$ that collapses towards 1 when a P-gp inhibitor is added flags a substrate. In the gut, P-gp is often saturated at high drug concentrations. At the blood–brain barrier it is not: the opioid **loperamide** is kept out of the brain by P-gp, which is why it treats diarrhoea without central opioid effects at normal doses.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`In MDR1-MDCK cells a compound gives $P_{\text{app}}(A\to B) = 2\times10^{-6}$ cm/s and $P_{\text{app}}(B\to A) = 18\times10^{-6}$ cm/s. With a P-gp inhibitor both become about $9\times10^{-6}$ cm/s. What is the best interpretation?`,
      choices: [
        'Efflux ratio 9: a P-gp substrate, which is a concern for brain penetration',
        'Efflux ratio 0.11: the compound is actively taken up',
        'The compound is poorly permeable by passive diffusion, so efflux is irrelevant',
        'The monolayer is leaky, because the two directions differ',
      ],
      answer: 0,
      why: String.raw`$ER = 18/2 = 9$, far above 2, and the inhibitor removes the asymmetry, the classic signature of P-gp efflux. Its intrinsic passive permeability (about $9\times10^{-6}$ cm/s with the pump blocked) is good, so efflux is exactly the problem. Inverting the ratio gives 0.11, which would wrongly suggest uptake. A leaky monolayer raises both directions equally and does not create asymmetry.`,
    },
    {
      kind: 'explain',
      title: 'The BCS: solubility × permeability',
      body: String.raw`Amidon et al. (1995) combined the two axes into the **Biopharmaceutics Classification System**. A drug is **highly soluble** if its highest dose dissolves in 250 mL of aqueous buffer across the gut pH range, and **highly permeable** if absorption is nearly complete (≥ 85 % in current ICH M9 guidance; the original FDA cut-off was 90 %).

Regulators use the BCS to waive some bioequivalence studies. Discovery teams use it to decide early whether a problem needs **chemistry** (permeability) or **formulation** (solubility: salts, amorphous dispersions, nanomilling).`,
      widget: { type: 'SvgDiagram', props: { svg: bcsSvg }, caption: 'Example drugs as commonly classified. Classifications can depend on dose and on the regulatory definition used.' },
    },
    {
      kind: 'match',
      prompt: 'Match each BCS class to its typical absorption limitation.',
      pairs: [
        ['Class I', 'Usually well absorbed; few biopharmaceutical issues'],
        ['Class II', 'Limited by dissolution; formulation can help a lot'],
        ['Class III', 'Limited by permeability across the gut wall'],
        ['Class IV', 'Limited by both solubility and permeability'],
      ],
      why: 'Class I = high solubility and high permeability. Class II = low solubility and high permeability: dissolution is the bottleneck, so salts, amorphous forms or particle-size reduction help. Class III = the reverse. Class IV has both problems and is the hardest to develop orally.',
    },
    {
      kind: 'truefalse',
      prompt: 'Because PAMPA uses a lipid membrane, it can flag compounds that are substrates of P-glycoprotein.',
      answer: false,
      why: 'PAMPA contains no cells and no proteins, so it measures passive diffusion only. Efflux needs a cell assay such as Caco-2 or MDR1-MDCK run in both directions. Comparing PAMPA with Caco-2 is in fact a common way to spot transporter effects.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Oral absorption needs both **solubility** (only dissolved drug crosses) and **permeability**.
- **Kinetic** solubility (from DMSO, fast) often overestimates **thermodynamic** solubility (from solid, about 24 h, polymorph-dependent).
- Ionisation raises solubility, by about 10-fold per pH unit beyond the pKa; the GSE links log S to **melting point** and **logP**.
- **PAMPA** = passive only; **Caco-2** = human gut model with transporters; **MDR1-MDCK** = P-gp flag. $P_{\text{app}} = (dQ/dt)/(A C_0)$.
- **Efflux ratio** above about 2 that an inhibitor abolishes indicates P-gp efflux, which is critical for the brain.
- The **BCS** sorts drugs by solubility and permeability, guiding chemistry vs formulation.`,
    },
  ],
  references: [
    { authors: 'Di, L., Kerns, E. H.', title: 'Drug-Like Properties: Concepts, Structure Design and Methods', year: 2016, venue: '2nd ed., Academic Press', detail: 'Chapters on solubility, permeability and transporters' },
    { authors: 'Amidon, G. L., Lennernäs, H., Shah, V. P., Crison, J. R.', title: 'A theoretical basis for a biopharmaceutic drug classification: the correlation of in vitro drug product dissolution and in vivo bioavailability', year: 1995, venue: 'Pharm. Res. 12, 413–420' },
    { authors: 'Kansy, M., Senner, F., Gubernator, K.', title: 'Physicochemical high throughput screening: parallel artificial membrane permeation assay in the description of passive absorption processes', year: 1998, venue: 'J. Med. Chem. 41, 1007–1010' },
    { authors: 'Hubatsch, I., Ragnarsson, E. G. E., Artursson, P.', title: 'Determination of drug permeability and prediction of drug absorption in Caco-2 monolayers', year: 2007, venue: 'Nat. Protoc. 2, 2111–2119' },
    { authors: 'Jain, N., Yalkowsky, S. H.', title: 'Estimation of the aqueous solubility I: application to organic nonelectrolytes', year: 2001, venue: 'J. Pharm. Sci. 90, 234–252' },
  ],
} satisfies LessonContent;
