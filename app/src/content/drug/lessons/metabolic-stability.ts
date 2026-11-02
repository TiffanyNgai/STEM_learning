import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The liver as a filter',
      body: String.raw`Every drop of blood leaving the gut passes through the liver before reaching the rest of the body. For most small-molecule drugs the liver's enzymes, above all the **cytochrome P450s (CYPs)**, are the main route of elimination.

Discovery chemists cannot wait for human trials to learn how fast their compound is destroyed. Instead they incubate it with liver preparations for an hour, measure how fast it disappears, and **scale** that rate up to a whole human liver. This lesson walks through that calculation, which is called **in-vitro-to-in-vivo extrapolation (IVIVE)**.`,
    },
    {
      kind: 'recall',
      title: 'Drug metabolism & CYPs (from Medicine)',
      points: [
        '**Phase I** reactions (oxidation, mostly by CYPs) add or unmask a polar handle; **Phase II** conjugates it (glucuronide, sulfate, glutathione).',
        'A handful of isoforms, especially **CYP3A4**, 2D6, 2C9, 2C19 and 1A2, metabolise most CYP-cleared drugs.',
        'CYP **inhibitors** raise the levels of co-administered drugs; **inducers** lower them.',
        'Oral drugs undergo **first-pass metabolism** in gut wall and liver before reaching the circulation.',
      ],
      link: 'med/drug-metabolism-cyp',
    },
    {
      kind: 'explain',
      title: 'Microsomes vs hepatocytes',
      body: String.raw`- **Liver microsomes**: vesicles of endoplasmic reticulum obtained by homogenising liver and centrifuging. They contain the CYPs and UGTs but no cytosol, so you must add the cofactor **NADPH** (plus UDPGA and a pore-former for glucuronidation). They are cheap, stable when frozen and ideal for tier-1 screening.
- **Hepatocytes**: intact (usually cryopreserved) liver cells. They have the full set of phase I and II enzymes and cofactors, plus uptake and efflux transporters. They are more expensive but more complete.

A compound stable in microsomes but unstable in hepatocytes is a hint of non-CYP metabolism (e.g. direct glucuronidation or aldehyde oxidase in the cytosol).`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about in-vitro metabolism systems are correct? Select all that apply.',
      choices: [
        'Microsomal CYP reactions need added NADPH',
        'Hepatocytes contain both phase I and phase II enzymes with their cofactors',
        'Microsomes contain cytosolic enzymes such as aldehyde oxidase',
        'Hepatocytes can reveal transporter-limited uptake into the liver',
      ],
      answers: [0, 1, 3],
      why: 'Microsomes are ER membranes: they lack cytosol, so cytosolic enzymes like aldehyde oxidase are missing (you need S9 fraction or hepatocytes), and NADPH must be supplied. Intact hepatocytes bring their own cofactors, phase II enzymes and uptake transporters.',
    },
    {
      kind: 'explain',
      title: 'From disappearance to intrinsic clearance',
      body: String.raw`In a **substrate-depletion** assay the drug is incubated at about 1 µM (well below the enzyme's $K_m$, so kinetics are first-order) with, say, 0.5 mg/mL microsomal protein. Samples at 0, 5, 15, 30 and 45 min are analysed by LC-MS/MS. Plot $\ln(\%\ \text{remaining})$ vs time: the slope is $-k$.

$$t_{1/2} = \frac{\ln 2}{k}, \qquad CL_{\text{int, in vitro}} = \frac{k}{[\text{protein}]}$$

**Intrinsic clearance** $CL_{\text{int}}$ is the liver's inherent capacity to metabolise *unbound* drug, unlimited by blood flow. Example: $t_{1/2} = 20$ min gives $k = 0.0347$ min⁻¹, so $CL_{\text{int}} = 0.0347/0.5$ mL/min/mg $= 69.3\ \mu$L/min/mg protein.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['100*exp(-0.693*x/h)'],
          x: [0, 60], y: [0, 105],
          params: [{ name: 'h', min: 3, max: 120, value: 20, label: 't½ (min)' }],
          xLabel: 'incubation time (min)', yLabel: '% parent remaining',
        },
        caption: 'First-order depletion. Compounds with $t_{1/2}$ beyond the incubation time are reported as "> 60 min": stable, but with an uncertain CLint.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A compound incubated with human hepatocytes at $1\times10^{6}$ cells/mL has $t_{1/2} = 30$ min. What is $CL_{\text{int, in vitro}}$ in µL/min per $10^{6}$ cells?`,
      answer: 23.1,
      tolerance: 0.3,
      unit: 'µL/min/10⁶ cells',
      why: String.raw`$k = 0.693/30 = 0.0231$ min⁻¹. Dividing by the cell density (1 × 10⁶ cells per mL) gives 0.0231 mL/min/10⁶ cells $= 23.1\ \mu$L/min/10⁶ cells. Leaving the answer in mL forgets the factor 1000.`,
    },
    {
      kind: 'explain',
      title: 'Scaling up: the well-stirred liver',
      body: String.raw`**Step 1: scale to the whole liver.** Multiply by physiological scaling factors, typically about **45 mg microsomal protein per g liver** (or about 120 × 10⁶ hepatocytes per g) and about **20 g liver per kg body weight** in humans. For the example: $69.3 \times 45 \times 20 / 1000 = 62.4$ mL/min/kg.

**Step 2: let blood flow and binding limit it.** The **well-stirred model** treats the liver as one well-mixed compartment with blood flow $Q_h \approx 20$ mL/min/kg. Only unbound drug ($f_u$) is available to the enzymes:

$$CL_h = \frac{Q_h\, f_u\, CL_{\text{int}}}{Q_h + f_u\, CL_{\text{int}}}, \qquad E = \frac{CL_h}{Q_h}$$

With $f_u = 0.1$: $f_u CL_{\text{int}} = 6.24$, so $CL_h = 20 \times 6.24 / 26.24 = 4.76$ mL/min/kg and extraction ratio $E = 0.24$. Obach (1999) used this kind of scaling of microsomal half-lives to predict human clearance for 29 drugs, and showed that nonspecific binding of drug to the microsomes ($f_{u,\text{inc}}$) must be accounted for.`,
    },
    {
      kind: 'widget',
      title: 'Try the IVIVE chain',
      body: String.raw`Shorten the in-vitro half-life and watch $CL_h$ climb, then **flatten** against the blood-flow ceiling. Now lower $f_u$: a highly bound compound is protected from the enzymes, but only while it is a low-extraction drug.`,
      widget: { type: 'DrugClearanceScaler', props: { halfLife: 20, fu: 0.1 }, caption: 'Scaling factors: 45 mg protein/g or 120 × 10⁶ cells/g liver, 20 g liver/kg, $Q_h$ = 20 mL/min/kg, blood:plasma ratio 1.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Human liver microsomes (0.5 mg/mL) give $t_{1/2} = 10$ min; $f_u = 0.5$, $f_{u,\text{inc}} = 1$. Using 45 mg/g, 20 g/kg and $Q_h = 20$ mL/min/kg, predict $CL_h$ in mL/min/kg.`,
      answer: 15.1,
      tolerance: 0.3,
      unit: 'mL/min/kg',
      why: String.raw`$k = 0.0693$ min⁻¹ → $CL_{\text{int}} = 0.0693/0.5 \times 1000 = 138.6\ \mu$L/min/mg → $\times 900$ mg/kg $= 124.8$ mL/min/kg. Then $f_u CL_{\text{int}} = 62.4$ and $CL_h = 20 \times 62.4/82.4 = 15.1$ mL/min/kg ($E \approx 0.76$, a high-extraction drug). Adding $Q_h$ and $f_u CL_{\text{int}}$ without the ratio, or forgetting $f_u$, are the usual mistakes.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`For a high-extraction drug ($E \approx 0.9$), halving its intrinsic clearance roughly halves its hepatic clearance.`,
      answer: false,
      why: String.raw`High-extraction drugs are **flow-limited**: $CL_h \approx Q_h$ whatever the exact $CL_{\text{int}}$. Halving $CL_{\text{int}}$ moves $E$ from 0.9 to about 0.82, so $CL_h$ falls only about 9 %. What does change a lot is oral bioavailability: hepatic availability $F_h = 1 - E$ almost doubles, from 0.10 to 0.18.`,
    },
    {
      kind: 'order',
      prompt: 'Put the steps of predicting human hepatic clearance from a microsomal assay in order.',
      steps: [
        'Incubate the compound with microsomes and NADPH; measure % remaining over time',
        'Fit the slope of ln(% remaining) vs time to get k and t½',
        'Divide k by protein concentration to get in-vitro CLint',
        'Multiply by mg protein per g liver and g liver per kg body weight',
        'Correct for binding (fu, fu,inc) and apply the well-stirred model with hepatic blood flow',
      ],
      why: 'The chain runs from raw data (depletion), to a rate constant, to an in-vitro clearance normalised by enzyme amount, to a whole-body intrinsic clearance, and finally to a physiological clearance limited by blood flow and protein binding.',
    },
    {
      kind: 'explain',
      title: 'Soft spots and how to fix them',
      body: String.raw`When clearance is too high, **metabolite identification** (LC-MS) finds the **soft spot**, the atom the CYPs attack. Typical fixes:
- **block** the site: replace an oxidisable C–H with C–F or C–Cl, or add steric bulk;
- **deuterate** it: a C–D bond is broken more slowly (kinetic isotope effect). Deutetrabenazine (approved 2017) is the first deuterated drug;
- **lower logD**: CYP active sites are lipophilic, so less greasy compounds usually have lower $CL_{\text{int}}$;
- swap an electron-rich phenyl for a pyridine, or remove a labile methoxy (O-demethylation).

**Site-of-metabolism predictors**, from reactivity-based models such as SMARTCyp to graph neural networks, flag soft spots before synthesis.`,
    },
    {
      kind: 'explain',
      title: 'CYP inhibition and drug–drug interactions',
      body: String.raw`The second metabolic question is the reverse: does *our* compound block CYPs and raise the levels of *other* drugs? Each major isoform is assayed with a selective **probe substrate** (e.g. midazolam for CYP3A4, dextromethorphan for CYP2D6) to get an IC50. A **time-dependent** (mechanism-based) inhibitor gets more potent after pre-incubation with NADPH, which is a red flag.

A basic static model predicts the exposure (AUC) ratio of a victim drug whose fraction metabolised by that enzyme is $f_m$:

$$\frac{AUC_{\text{with}}}{AUC_{\text{without}}} = \frac{1}{\dfrac{f_m}{1 + [I]/K_i} + (1 - f_m)}$$

where $[I]$ is the unbound inhibitor concentration. Large public datasets, such as the ~17,000-compound CYP screen of Veith et al. (2009), are used to train ML classifiers for CYP inhibition.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A victim drug is cleared 80 % by CYP3A4 ($f_m = 0.8$). A new compound reaches an unbound concentration of $4\times K_i$ for CYP3A4. Predict the AUC ratio of the victim drug.`,
      answer: 2.78,
      tolerance: 0.05,
      why: String.raw`$1/(0.8/5 + 0.2) = 1/0.36 = 2.78$, nearly a 3-fold rise in exposure. The $(1-f_m)$ term caps the effect: even total inhibition can raise AUC at most $1/(1-f_m) = 5$-fold here.`,
    },
    {
      kind: 'match',
      prompt: 'Match each term to its meaning.',
      pairs: [
        ['Intrinsic clearance', 'Enzyme capacity to metabolise unbound drug, without blood-flow limits'],
        ['Extraction ratio E', 'Fraction of drug removed in one pass through the liver'],
        ['fu,inc', 'Fraction unbound in the in-vitro incubation'],
        ['Time-dependent inhibition', 'CYP inhibition that grows after pre-incubation with NADPH'],
        ['Soft spot', 'The site on a molecule most readily metabolised'],
      ],
      why: '$CL_{\\text{int}}$ is the enzyme capacity; $E = CL_h/Q_h$ is what actually happens in the flowing liver. $f_{u,\\text{inc}}$ corrects for drug stuck to microsomal membranes. Time-dependent inhibition usually means a reactive metabolite inactivating the CYP.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Microsomes** (CYPs, add NADPH, cheap) and **hepatocytes** (complete cells) measure metabolic stability by substrate depletion.
- $k = \ln 2/t_{1/2}$; $CL_{\text{int}} = k/[\text{protein or cells}]$; scale with about 45 mg/g (or 120 × 10⁶ cells/g) and about 20 g liver/kg.
- **Well-stirred model**: $CL_h = Q_h f_u CL_{\text{int}}/(Q_h + f_u CL_{\text{int}})$. High-extraction drugs are flow-limited; $F_h = 1 - E$.
- Fix high clearance by finding **soft spots** and blocking, deuterating or lowering logD.
- **CYP inhibition** IC50 / $K_i$ plus $f_m$ predicts drug–drug interaction risk; time-dependent inhibition is a red flag.`,
    },
  ],
  references: [
    { authors: 'Obach, R. S.', title: 'Prediction of human clearance of twenty-nine drugs from hepatic microsomal intrinsic clearance data: an examination of in vitro half-life approach and nonspecific binding to microsomes', year: 1999, venue: 'Drug Metab. Dispos. 27, 1350–1359' },
    { authors: 'Houston, J. B.', title: 'Utility of in vitro drug metabolism data in predicting in vivo metabolic clearance', year: 1994, venue: 'Biochem. Pharmacol. 47, 1469–1479' },
    { authors: 'Di, L., Kerns, E. H.', title: 'Drug-Like Properties: Concepts, Structure Design and Methods', year: 2016, venue: '2nd ed., Academic Press', detail: 'Chapters on metabolic stability and CYP inhibition' },
    { authors: 'U.S. Food and Drug Administration', title: 'In Vitro Drug Interaction Studies — Cytochrome P450 Enzyme- and Transporter-Mediated Drug Interactions: Guidance for Industry', year: 2020 },
    { authors: 'Veith, H., Southall, N., Huang, R., et al.', title: 'Comprehensive characterization of cytochrome P450 isozyme selectivity across chemical libraries', year: 2009, venue: 'Nat. Biotechnol. 27, 1050–1055' },
  ],
} satisfies LessonContent;
