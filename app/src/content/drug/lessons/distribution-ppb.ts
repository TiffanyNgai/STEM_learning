import type { LessonContent } from '../../types';

// Equilibrium dialysis: plasma chamber (proteins + drug) | semipermeable membrane | buffer chamber (free drug only).
const prot = [[50, 60], [95, 95], [60, 130], [110, 150], [40, 165], [120, 55]]
  .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="var(--c4)" fill-opacity="0.3" stroke="var(--c4)"/><circle cx="${x + 7}" cy="${y - 7}" r="3" fill="var(--c2)"/>`).join('');
const dialysisSvg = String.raw`<svg viewBox="0 0 320 215" xmlns="http://www.w3.org/2000/svg" font-size="9" fill="var(--fg)">
<text x="160" y="13" text-anchor="middle" font-size="10" font-weight="700">Equilibrium dialysis (4–6 h, 37 °C)</text>
<rect x="20" y="28" width="130" height="160" rx="8" fill="var(--c4)" fill-opacity="0.06" stroke="var(--grid)"/>
<rect x="170" y="28" width="130" height="160" rx="8" fill="var(--c2)" fill-opacity="0.04" stroke="var(--grid)"/>
<line x1="160" y1="28" x2="160" y2="188" stroke="var(--fg)" stroke-width="1.5" stroke-dasharray="3 3"/>
<text x="85" y="40" text-anchor="middle" font-weight="700">plasma</text>
<text x="235" y="40" text-anchor="middle" font-weight="700">buffer</text>
${prot}
<g fill="var(--c2)">
<circle r="3"><animateMotion dur="5s" repeatCount="indefinite" path="M135,80 L200,70 L250,120 L200,160 L135,140 Z"/></circle>
<circle r="3"><animateMotion dur="6s" begin="1s" repeatCount="indefinite" path="M140,110 L230,90 L270,150 L190,120 L140,110 Z"/></circle>
<circle cx="80" cy="110" r="3"/><circle cx="205" cy="60" r="3"/><circle cx="260" cy="170" r="3"/>
</g>
<text x="160" y="200" text-anchor="middle" font-size="8">membrane passes small drug (blue) but not proteins (purple)</text>
<text x="160" y="211" text-anchor="middle" font-size="8" fill="var(--c2)">at equilibrium: fu = C(buffer) / C(plasma)</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: '99 % bound: should we panic?',
      body: String.raw`Most drugs travel in blood partly stuck to plasma proteins. A typical report reads: "PPB 99.5 %". It sounds alarming, as if only a crumb of drug is left to work.

This lesson separates what really matters, the **free (unbound) concentration** at the target, from what only *looks* important. It also covers where drugs go after they leave the blood (**volume of distribution**) and the hardest destination of all, the **brain**.`,
    },
    {
      kind: 'recall',
      title: 'Volume of distribution & half-life (from Medicine)',
      points: [
        '$V_d = \\text{amount in body}/C_{\\text{plasma}}$: an *apparent* volume, which can far exceed body volume.',
        'Clearance $CL$ sets the steady-state level: $C_{ss} = \\text{dosing rate}/CL$.',
        'Half-life depends on both: $t_{1/2} = 0.693\\,V_d/CL$.',
        'Only unbound drug is filtered by the kidney or crosses most membranes.',
      ],
      link: 'med/pharmacokinetics',
    },
    {
      kind: 'explain',
      title: 'Who binds what in plasma',
      body: String.raw`- **Albumin** (~35–50 g/L, about 0.6 mM): the main binder of **acids** and many neutral drugs (warfarin, NSAIDs).
- **α1-acid glycoprotein (AAG)** (~0.5–1 g/L): binds **basic** drugs; its level rises during inflammation and after surgery.
- **Lipoproteins**: carry very lipophilic compounds.

Binding is fast and reversible. The **fraction unbound** is

$$f_u = \frac{C_{\text{unbound}}}{C_{\text{total}}}, \qquad \%\text{PPB} = 100\,(1 - f_u).$$

Note the hidden factor: 99 % bound means $f_u = 0.01$; 99.9 % means $f_u = 0.001$, a **10-fold** difference in free drug that "99 % vs 99.9 %" hides. Measuring very high binding precisely is also hard.`,
    },
    {
      kind: 'widget',
      title: 'Measuring fu: equilibrium dialysis',
      body: String.raw`Spiked plasma and buffer sit either side of a membrane that small molecules cross but proteins cannot. After equilibrium, the **free** concentration is equal on both sides, so the buffer side reports $C_{\text{unbound}}$ directly. **Ultrafiltration** (spin plasma through a filter) is faster but suffers from drug sticking to the device.`,
      widget: { type: 'SvgDiagram', props: { svg: dialysisSvg }, caption: 'Rapid equilibrium dialysis (RED) plates run this in 96-well format.' },
    },
    {
      kind: 'numeric',
      prompt: 'After equilibrium dialysis the plasma chamber contains 5.0 µM drug and the buffer chamber 0.15 µM. What is the % plasma protein binding?',
      answer: 97,
      tolerance: 0.2,
      unit: '%',
      why: String.raw`$f_u = 0.15/5.0 = 0.03$, so PPB $= 100(1 - 0.03) = 97\ \%$. A common slip is to report 3 % (that is $f_u$ as a percentage) or to divide by the sum of both chambers.`,
    },
    {
      kind: 'explain',
      title: 'The free drug hypothesis',
      body: String.raw`**Free drug hypothesis:** at steady state, for a drug that crosses membranes passively, the unbound concentration at the target equals the unbound concentration in plasma, and only unbound drug acts.

Smith, Di & Kerns (2010) argued that this makes **"reduce PPB to boost efficacy" a misconception**. Lowering binding raises $f_u$, but it also exposes more drug to the liver. For a low-extraction drug, $CL_h \approx f_u\,CL_{\text{int}}$, so at a constant dosing rate $R$:

$$C_{ss,\text{total}} = \frac{R}{f_u\,CL_{\text{int}}}, \qquad C_{ss,u} = f_u\,C_{ss,\text{total}} = \frac{R}{CL_{\text{int}}}$$

The **unbound** level does not depend on $f_u$ at all. Optimise **unbound intrinsic clearance** and **unbound potency**, not % binding.`,
    },
    {
      kind: 'widget',
      title: 'Total vs free at steady state',
      body: String.raw`Read along the $f_u$ axis: the total concentration (green) soars as binding increases, but the **free** concentration (blue) is flat. Raise $CL_{\text{int}}$ and only then does free drug fall.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['1/(x*c)', '1/c'],
          labels: ['total Css', 'unbound Css'],
          x: [0.02, 1], y: [0, 4],
          params: [{ name: 'c', min: 0.5, max: 5, value: 2, label: 'CLint (rel.)' }],
          xLabel: 'fu', yLabel: 'Css (rel. units)',
        },
        caption: 'Low-extraction drug at a fixed dosing rate (same picture for IV or oral). Total plasma levels mislead; free levels drive the effect.',
      },
    },
    {
      kind: 'truefalse',
      prompt: 'For an orally dosed, low-extraction, hepatically cleared drug, redesigning it so that PPB drops from 99.5 % to 95 % will raise its unbound steady-state concentration about 10-fold.',
      answer: false,
      why: String.raw`$f_u$ rises 10-fold (0.005 → 0.05), but hepatic clearance $\approx f_u CL_{\text{int}}$ rises 10-fold too, so $C_{ss,u} = R/CL_{\text{int}}$ is unchanged (assuming $CL_{\text{int}}$ and potency stay the same). This is the central point of Smith, Di & Kerns (2010).`,
    },
    {
      kind: 'explain',
      title: 'Volume of distribution: where does it go?',
      body: String.raw`$V_d$ reflects the balance between binding in plasma and binding in tissues. A simple physiological form (Øie & Tozer 1979) is

$$V_{ss} \approx V_p + V_t\,\frac{f_u}{f_{u,t}}$$

with plasma volume $V_p$ (~0.04 L/kg), tissue water $V_t$ and tissue fraction unbound $f_{u,t}$.
- **Acids** bind albumin tightly and stay in plasma: small $V_d$ (warfarin ~0.14 L/kg).
- **Neutral** compounds spread through body water: ~0.7 L/kg.
- **Lipophilic bases** bind acidic phospholipids in membranes and get trapped in acidic lysosomes: large $V_d$ (chloroquine, well over 100 L/kg).

Since $t_{1/2} = 0.693\,V_d/CL$, raising $V_d$ is one way to lengthen half-life without slowing clearance.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A compound has $V_{ss} = 2$ L/kg and $CL = 10$ mL/min/kg. What is its half-life in hours?`,
      answer: 2.31,
      tolerance: 0.05,
      unit: 'h',
      why: String.raw`Convert units first: $10$ mL/min/kg $= 0.6$ L/h/kg. Then $t_{1/2} = 0.693 \times 2/0.6 = 2.31$ h. Skipping the unit conversion gives 0.139 (mixing L and mL/min), which is a frequent error.`,
    },
    {
      kind: 'mcq',
      prompt: 'Which compound is most likely to have the largest volume of distribution?',
      choices: [
        'A lipophilic amine with pKa 9.5 and logP 4',
        'A carboxylic acid with pKa 4 that is 99.5 % bound to albumin',
        'A small neutral, polar molecule that is 10 % bound',
        'A large antibody (150 kDa)',
      ],
      answer: 0,
      why: 'Lipophilic bases are positively charged at pH 7.4 and partition into membranes rich in acidic phospholipids and into acidic lysosomes, giving large $V_d$. Albumin-bound acids stay in plasma (small $V_d$). Polar neutrals spread through body water (about 0.6–0.7 L/kg). Antibodies are mostly confined to plasma and interstitial fluid.',
    },
    {
      kind: 'explain',
      title: 'The blood–brain barrier and Kp,uu',
      body: String.raw`Brain capillaries are sealed by tight junctions and lined with **P-gp** and **BCRP** efflux pumps. The total brain-to-plasma ratio $K_p$ is misleading, because lipophilic drugs bind brain lipids heavily. The meaningful number is the **unbound** ratio (Hammarlund-Udenaes et al. 2008):

$$K_{p,uu} = \frac{C_{u,\text{brain}}}{C_{u,\text{plasma}}} = K_p \cdot \frac{f_{u,\text{brain}}}{f_{u,\text{plasma}}}$$

where $f_{u,\text{brain}}$ comes from dialysis of brain homogenate. $K_{p,uu} \approx 1$ means free passive equilibration, $\ll 1$ means efflux, and $> 1$ (rare) means active uptake.

To design CNS drugs, Pfizer's **CNS MPO** score (Wager et al. 2010) combines six properties (cLogP, cLogD, MW, TPSA, HBD count, pKa) into a 0–6 desirability score; a score of 4 or more is favoured.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`In rats, a compound has total brain/plasma ratio $K_p = 2$, $f_{u,\text{brain}} = 0.02$ and $f_{u,\text{plasma}} = 0.1$. What is $K_{p,uu}$?`,
      answer: 0.4,
      tolerance: 0.01,
      why: String.raw`$K_{p,uu} = 2 \times 0.02/0.1 = 0.4$. Despite twice as much *total* drug in brain as in plasma, free brain levels are only 40 % of free plasma levels, suggesting some efflux. The high $K_p$ was just brain-lipid binding.`,
    },
    {
      kind: 'match',
      prompt: 'Match each quantity or protein to its description.',
      pairs: [
        ['fu', 'Fraction of drug in plasma not bound to protein'],
        ['Albumin', 'Most abundant plasma protein; binds acidic drugs'],
        ['α1-acid glycoprotein', 'Binds basic drugs; rises in inflammation'],
        ['Kp,uu', 'Ratio of unbound brain to unbound plasma concentration'],
        ['Vss', 'Apparent volume relating amount in body to plasma concentration at steady state'],
      ],
      why: 'fu and Kp,uu are the "free" quantities that link to effect. Albumin and AAG explain why acids and bases bind differently. Vss summarises tissue versus plasma binding.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **fu** is measured by equilibrium dialysis; 99 % vs 99.9 % bound is a 10-fold difference in free drug.
- **Free drug hypothesis**: unbound plasma concentration ≈ unbound target concentration at steady state (passive permeation).
- For low-extraction drugs, $C_{ss,u} = R/CL_{\text{int}}$, independent of $f_u$, so optimise unbound clearance and potency, not % PPB (Smith, Di & Kerns 2010).
- $V_d$: acids small, neutrals ~0.7 L/kg, lipophilic bases large; $t_{1/2} = 0.693\,V_d/CL$.
- Brain exposure is judged by **Kp,uu**, not total Kp; efflux by P-gp/BCRP drives Kp,uu below 1.`,
    },
  ],
  references: [
    { authors: 'Smith, D. A., Di, L., Kerns, E. H.', title: 'The effect of plasma protein binding on in vivo efficacy: misconceptions in drug discovery', year: 2010, venue: 'Nat. Rev. Drug Discov. 9, 929–939' },
    { authors: 'Di, L., Kerns, E. H.', title: 'Drug-Like Properties: Concepts, Structure Design and Methods', year: 2016, venue: '2nd ed., Academic Press', detail: 'Chapters on plasma protein binding and the blood–brain barrier' },
    { authors: 'Øie, S., Tozer, T. N.', title: 'Effect of altered plasma protein binding on apparent volume of distribution', year: 1979, venue: 'J. Pharm. Sci. 68, 1203–1205' },
    { authors: 'Hammarlund-Udenaes, M., Fridén, M., Syvänen, S., Gupta, A.', title: 'On the rate and extent of drug delivery to the brain', year: 2008, venue: 'Pharm. Res. 25, 1737–1750' },
    { authors: 'Wager, T. T., Hou, X., Verhoest, P. R., Villalobos, A.', title: 'Moving beyond rules: the development of a central nervous system multiparameter optimization (CNS MPO) approach to enable alignment of druglike properties', year: 2010, venue: 'ACS Chem. Neurosci. 1, 435–449' },
  ],
} satisfies LessonContent;
