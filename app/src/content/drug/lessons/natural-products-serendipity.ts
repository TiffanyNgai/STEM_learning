import type { LessonContent } from '../../types';

const willowSteps: [string, string, string][] = [
  ['antiquity', 'Willow bark brewed for pain and fever', 'var(--c1)'],
  ['1763', 'Stone reports willow bark against "agues"', 'var(--c1)'],
  ['1829', 'Leroux purifies salicin from willow', 'var(--c6)'],
  ['1838', 'Piria converts salicin → salicylic acid', 'var(--c6)'],
  ['1859', 'Kolbe synthesises salicylic acid from phenol', 'var(--c2)'],
  ['1897', 'Hoffmann (Bayer) acetylates it → aspirin', 'var(--c3)'],
  ['1971', 'Vane: it blocks prostaglandin synthesis', 'var(--c4)'],
];
const willowSvg = `<svg viewBox="0 0 320 250" xmlns="http://www.w3.org/2000/svg">
<line x1="22" y1="14" x2="22" y2="238" stroke="var(--muted)" stroke-width="2"/>
${willowSteps.map(([when, what, col], i) => {
  const y = 16 + i * 32;
  return `<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${(i * 0.6).toFixed(1)}s" dur="0.5s" fill="freeze"/>
<circle cx="22" cy="${y + 7}" r="6" fill="${col}"/>
<text x="36" y="${y + 4}" font-size="9" fill="var(--muted)">${when}</text>
<text x="36" y="${y + 17}" font-size="10.5" font-weight="700" fill="var(--fg)">${what}</text></g>`;
}).join('\n')}
</svg>`;

// Fleming's plate: staphylococcal colonies near the mould become transparent and vanish.
const colonies: [number, number][] = [
  [70, 60], [95, 45], [120, 70], [80, 95], [110, 110], [60, 130], [140, 135], [95, 150], [130, 165],
  [210, 50], [235, 75], [250, 115], [225, 150], [200, 165], [255, 160], [180, 40],
];
const plateSvg = `<svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg">
<circle cx="160" cy="105" r="98" fill="var(--c3)" fill-opacity="0.08" stroke="var(--muted)" stroke-width="2"/>
<circle cx="160" cy="105" r="22" fill="var(--c1)" fill-opacity="0.55"/>
<circle cx="160" cy="105" r="22" fill="none" stroke="var(--c1)" stroke-width="2">
<animate attributeName="r" values="22;60;60" keyTimes="0;0.6;1" dur="5s" repeatCount="indefinite"/>
<animate attributeName="stroke-opacity" values="0.8;0;0" keyTimes="0;0.6;1" dur="5s" repeatCount="indefinite"/>
</circle>
<text x="160" y="108" text-anchor="middle" font-size="9" font-weight="700" fill="var(--fg)">mould</text>
${colonies.map(([x, y]) => {
  const d = Math.hypot(x - 160, y - 105);
  const near = d < 62;
  return `<circle cx="${x}" cy="${y}" r="6" fill="var(--c3)">${near
    ? `<animate attributeName="fill-opacity" values="1;1;0.15;0.15" keyTimes="0;${(d / 100).toFixed(2)};${(d / 100 + 0.15).toFixed(2)};1" dur="5s" repeatCount="indefinite"/>`
    : ''}</circle>`;
}).join('\n')}
<text x="160" y="206" text-anchor="middle" font-size="9" fill="var(--muted)">near the mould colonies lyse; far away they grow</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Nature was the first medicinal chemist',
      body: String.raw`Until about 1900 almost every medicine was a plant, animal or mineral preparation. The decisive scientific step was not finding these remedies (folk medicine had done that) but **isolating the active compound**, so that a dose could be weighed and repeated:
- **Digitalis** from foxglove for "dropsy" (heart failure): William Withering, 1785.
- **Morphine** from opium: Friedrich Sertürner, early 1800s — the first *alkaloid* (nitrogen-containing plant base) isolated.
- **Quinine** from cinchona bark against malaria: Pelletier and Caventou, 1820.

A pure compound can be standardised, studied and — crucially — chemically modified.`,
    },
    {
      kind: 'widget',
      title: 'From willow bark to aspirin',
      body: 'Aspirin is the textbook case of a natural product made better by chemistry. Watch each step add a new kind of knowledge: observation, isolation, conversion, total synthesis, modification, and finally mechanism.',
      widget: { type: 'SvgDiagram', props: { svg: willowSvg }, caption: 'Over two centuries from a clinical report (Stone, 1763) to a molecular mechanism (Vane, 1971).' },
    },
    {
      kind: 'explain',
      title: 'Why acetylate?',
      body: String.raw`Salicylic acid relieved pain and fever but irritated the stomach badly. At Bayer in 1897, Felix Hoffmann made a pure, stable **acetylsalicylic acid** by capping its phenol –OH as an acetyl ester; it was sold as *Aspirin* from 1899.

Nobody knew how it worked for 70 more years. In 1971 John Vane showed that aspirin-like drugs **block prostaglandin synthesis**; aspirin does so by *transferring its acetyl group* onto the cyclooxygenase (COX) enzyme, permanently inactivating it.

> Lesson that recurs throughout this unit: a drug can be useful — and sold for decades — long before anyone knows its target.`,
    },
    {
      kind: 'order',
      prompt: 'Put the aspirin story in chronological order.',
      steps: [
        'A clinical report that willow bark treats fevers (Stone)',
        'Salicin purified from willow bark',
        'Salicin converted to salicylic acid',
        'Acetylsalicylic acid made at Bayer',
        'Mechanism shown: inhibition of prostaglandin synthesis',
      ],
      why: '1763 → 1829 → 1838 → 1897 → 1971. Note that the mechanism came last: aspirin was a best-selling drug for ~70 years before its target was understood.',
    },
    {
      kind: 'numeric',
      prompt: String.raw`Salicylic acid is $\mathrm{C_7H_6O_3}$ (molar mass 138.1 g/mol). Acetylation replaces the phenol H with an acetyl group $\mathrm{COCH_3}$, a net gain of $\mathrm{C_2H_2O}$ (42.0 g/mol). What is the molar mass of aspirin, $\mathrm{C_9H_8O_4}$?`,
      answer: 180.2,
      tolerance: 0.5,
      unit: 'g/mol',
      why: '138.1 + 42.0 = 180.1–180.2 g/mol (exact value 180.16). Small chemical edits like this are the oldest form of lead optimisation: keep the natural scaffold, fix its flaws.',
    },
    {
      kind: 'explain',
      title: 'Penicillin: the observation',
      body: String.raw`In September 1928 at St Mary's Hospital, London, Alexander **Fleming** noticed that on a culture plate of *Staphylococcus* contaminated by a *Penicillium* mould, the bacterial colonies near the mould had dissolved. He named the active filtrate "penicillin" and published in 1929.

Fleming showed it killed many Gram-positive bacteria and was non-toxic to white blood cells, but it was unstable and he could not purify it; he used it mainly as a laboratory tool for isolating other bacteria.`,
      widget: { type: 'SvgDiagram', props: { svg: plateSvg }, caption: 'A diffusing antibacterial substance makes a clear zone around its source — the same "zone of inhibition" read-out still used to test antibiotics.' },
    },
    {
      kind: 'explain',
      title: 'Penicillin: the drug',
      body: String.raw`Turning the observation into a medicine took a different team a decade later. At Oxford, Howard **Florey**, Ernst **Chain** and Norman **Heatley** purified penicillin and, in May 1940, showed that it protected mice from lethal streptococcal infection (Chain et al., *Lancet* 1940). The first patient was treated in 1941; supply ran out and he relapsed.

Mass production came from US deep-tank fermentation, higher-yielding *Penicillium* strains and process engineering during the Second World War. Fleming, Florey and Chain shared the 1945 Nobel Prize. Dorothy Hodgkin's X-ray structure (1945) revealed the strained **β-lactam** ring that acylates bacterial cell-wall enzymes.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Fleming purified penicillin and demonstrated its curative effect in infected animals in 1929.',
      answer: false,
      why: 'Fleming made the observation (1928) and published it (1929) but could not purify the unstable compound. The purification and the decisive mouse-protection experiment were done by Florey, Chain, Heatley and colleagues at Oxford in 1940.',
    },
    {
      kind: 'explain',
      title: 'From luck to systematic natural-product screening',
      body: String.raw`After penicillin, companies and universities *searched* nature deliberately:
- **Streptomycin** (1944), the first drug active against tuberculosis, came from Selman Waksman's lab systematically screening soil bacteria (*Streptomyces*).
- **Statins**: Akira Endo at Sankyo screened thousands of fungal cultures for inhibitors of HMG-CoA reductase (the rate-limiting enzyme of cholesterol synthesis) and reported **compactin** from *Penicillium citrinum* in 1976. Merck's related **lovastatin** became the first approved statin (1987).
- **Paclitaxel (Taxol)**: the US National Cancer Institute's plant-screening programme collected Pacific yew bark in 1962; Wall and Wani published the structure in 1971; Horwitz found its unusual mechanism (stabilising microtubules) in 1979; approval came in 1992.`,
    },
    {
      kind: 'explain',
      title: 'Artemisinin: ancient text, modern chemistry',
      body: String.raw`In 1967 China launched **Project 523** to find antimalarials. Tu Youyou's team screened traditional remedies; extracts of sweet wormwood (*Artemisia annua*, qinghao) were promising but inconsistent.

A 4th-century text by Ge Hong told readers to soak the herb in cold water and drink the juice — not to boil it. Reasoning that heat destroyed the active ingredient, Tu switched to **low-temperature ether extraction** (1971), obtaining a fully active extract; pure **artemisinin** followed in 1972. Its key feature is a fragile **endoperoxide bridge** (O–O), activated by iron-containing haem in the parasite.

Tu shared the 2015 Nobel Prize (with Campbell and Ōmura, for avermectins from a soil *Streptomyces*).`,
    },
    {
      kind: 'match',
      prompt: 'Match each natural-product drug to its original source.',
      pairs: [
        ['Penicillin', 'A mould (*Penicillium*) contaminating a bacterial plate'],
        ['Streptomycin', 'A soil bacterium (*Streptomyces griseus*)'],
        ['Artemisinin', 'Sweet wormwood (*Artemisia annua*)'],
        ['Paclitaxel', 'Bark of the Pacific yew'],
        ['Compactin (first statin)', 'A *Penicillium citrinum* fungal culture'],
      ],
      why: 'Fungi, soil bacteria and plants have been the richest sources. Note two different Penicillium species: P. notatum/rubens gave penicillin, P. citrinum gave compactin.',
    },
    {
      kind: 'explain',
      title: 'Why natural products bind proteins so well',
      body: String.raw`Natural products are made *by* proteins (biosynthetic enzymes) and have evolved to act *on* proteins — often as chemical weapons or signals. Compared with typical synthetic screening compounds they tend to have (Feher & Schmidt 2003):
- more **stereocentres** and more **sp³ (non-flat) carbons** — more 3D shape;
- more **oxygen**, fewer nitrogen and halogen atoms;
- fewer aromatic rings and more ring fusion, so they are more rigid.

Newman and Cragg's long-running survey of drug approvals since 1981 finds that a large fraction of small-molecule drugs are natural products, derivatives of them, or synthetics built around a natural-product pharmacophore — roughly a third to a half, depending on how strictly "derived" is counted.`,
    },
    {
      kind: 'multi',
      prompt: 'Compared with typical synthetic screening compounds, natural products tend to have…',
      choices: [
        'more stereocentres',
        'a higher fraction of sp³ carbons',
        'more aromatic rings',
        'more oxygen atoms',
        'fewer ring systems and less rigidity',
      ],
      answers: [0, 1, 3],
      why: 'Natural products are 3D-rich (stereocentres, sp³ carbons) and oxygen-rich. They usually have *fewer* aromatic rings and are often *more* rigid (fused ring systems) — flat, aromatic-heavy molecules are the hallmark of synthetic combinatorial libraries.',
    },
    {
      kind: 'explain',
      title: 'Serendipity needs a prepared mind',
      body: String.raw`"Chance favours only the prepared mind" (Louis Pasteur). Other famous accidents:
- **Cisplatin**: in 1965 Barnett Rosenberg passed current through platinum electrodes into an *E. coli* culture to study electric fields; the bacteria stopped dividing. The cause was a platinum complex formed from the electrode — later one of the most important anticancer drugs.
- **Sildenafil** was tested for angina; the side effect noticed in trials led to its approval for erectile dysfunction (1998).
- **Minoxidil**, an antihypertensive, caused hair growth and became a baldness treatment.

In each case someone *noticed* an anomaly and then did the systematic work to explain and exploit it.`,
    },
    {
      kind: 'mcq',
      prompt: 'What was the unexpected observation that led to cisplatin?',
      choices: [
        'A platinum catalyst killed tumour cells during a chemical synthesis',
        'Bacteria stopped dividing when current flowed through platinum electrodes in their culture',
        'Patients taking a platinum-containing antacid had fewer cancers',
        'A soil fungus produced a platinum-binding antibiotic',
      ],
      answer: 1,
      why: 'Rosenberg was studying electric fields and bacterial division (Nature, 1965). The real cause turned out to be platinum complexes dissolved from the electrodes — the field itself was irrelevant, which is exactly why careful follow-up mattered.',
    },
    {
      kind: 'fill',
      prompt: 'Natural products are attractive starting points because evolution has selected them to ___ proteins, but they are often hard to ___ in quantity — paclitaxel was first obtained from the ___ of a slow-growing tree.',
      bank: ['bind', 'supply', 'bark', 'sequence', 'leaves', 'dock'],
      answer: ['bind', 'supply', 'bark'],
      why: 'Supply is the classic natural-product problem: Pacific yew bark was scarce, so paclitaxel was later made semi-synthetically from a precursor (10-deacetylbaccatin III) in needles of the European yew, and then by plant-cell fermentation. Re-isolating already-known compounds ("dereplication") and complex synthesis are the other big hurdles.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- The scientific leap was **isolating** the active compound (morphine, quinine, salicin), making medicines weighable, testable and modifiable.
- **Aspirin**: natural lead → chemical fix (acetylation, 1897) → mechanism only in 1971.
- **Penicillin**: Fleming's 1928 observation (1929 paper) became a drug only through Florey, Chain and Heatley's 1940 work and wartime fermentation.
- Luck turned into **systematic screening of nature**: streptomycin, statins (Endo), paclitaxel (NCI), artemisinin (Tu Youyou, guided by an ancient text).
- Natural products are 3D-rich and evolved to bind proteins; their weaknesses are supply, complexity and rediscovery.`,
    },
  ],
  references: [
    { authors: 'Fleming, A.', title: 'On the antibacterial action of cultures of a penicillium, with special reference to their use in the isolation of B. influenzae', year: 1929, venue: 'Br. J. Exp. Pathol. 10, 226–236' },
    { authors: 'Chain, E., Florey, H. W., Gardner, A. D., Heatley, N. G., Jennings, M. A., Orr-Ewing, J., Sanders, A. G.', title: 'Penicillin as a chemotherapeutic agent', year: 1940, venue: 'Lancet 236, 226–228' },
    { authors: 'Vane, J. R.', title: 'Inhibition of prostaglandin synthesis as a mechanism of action for aspirin-like drugs', year: 1971, venue: 'Nature New Biol. 231, 232–235' },
    { authors: 'Tu, Y.', title: 'The discovery of artemisinin (qinghaosu) and gifts from Chinese medicine', year: 2011, venue: 'Nat. Med. 17, 1217–1220' },
    { authors: 'Newman, D. J., Cragg, G. M.', title: 'Natural products as sources of new drugs over the nearly four decades from 01/1981 to 09/2019', year: 2020, venue: 'J. Nat. Prod. 83, 770–803' },
  ],
} satisfies LessonContent;
