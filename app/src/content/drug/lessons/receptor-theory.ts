import type { LessonContent } from '../../types';

// Langley's experiment, schematically: nicotine (agonist) and curare (blocker) compete for the same "receptive substance".
const sites = [50, 110, 170, 230, 290];
const langleySvg = `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
<rect x="10" y="120" width="300" height="34" rx="6" fill="var(--c2)" fill-opacity="0.15" stroke="var(--c2)"/>
<text x="160" y="172" text-anchor="middle" font-size="9" fill="var(--muted)">muscle cell surface with "receptive substance" (grey cups)</text>
${sites.map((x) => `<path d="M${x - 12},120 v-10 h6 v6 h12 v-6 h6 v10 z" fill="var(--muted)"/>`).join('\n')}
${sites.map((x, i) => {
  const blocker = i % 2 === 1;
  const col = blocker ? 'var(--c5)' : 'var(--c1)';
  const delay = (i * 0.35).toFixed(2);
  return `<g><animateTransform attributeName="transform" type="translate" values="0,-80; 0,0; 0,0; 0,-80" keyTimes="0;0.35;0.8;1" dur="4s" begin="${delay}s" repeatCount="indefinite"/>
<rect x="${x - 6}" y="104" width="12" height="10" rx="2" fill="${col}"/></g>`;
}).join('\n')}
<rect x="10" y="120" width="300" height="34" rx="6" fill="var(--c1)" fill-opacity="0">
<animate attributeName="fill-opacity" values="0;0;0.25;0" keyTimes="0;0.35;0.55;1" dur="4s" repeatCount="indefinite"/></rect>
<rect x="20" y="10" width="12" height="10" rx="2" fill="var(--c1)"/><text x="38" y="19" font-size="10" fill="var(--fg)">nicotine: binds and stimulates contraction</text>
<rect x="20" y="28" width="12" height="10" rx="2" fill="var(--c5)"/><text x="38" y="37" font-size="10" fill="var(--fg)">curare: binds the same site, no effect, blocks</text>
<text x="160" y="62" text-anchor="middle" font-size="9" fill="var(--muted)">Langley (1905): effects persist after the nerve degenerates,</text>
<text x="160" y="74" text-anchor="middle" font-size="9" fill="var(--muted)">so the site must be on the muscle itself</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'The puzzle of selectivity',
      body: String.raw`By the late 1800s, tiny doses of alkaloids such as atropine, nicotine or curare were known to produce **specific, reversible and mutually opposing** effects on particular tissues. Were drugs acting through bulk physical properties, or through **specific chemical sites** in cells?

John Newport **Langley** (Cambridge) saw in 1878 that pilocarpine and atropine antagonise each other on salivary secretion. In 1905, on chicken muscle, he found that **nicotine** caused contraction and **curare** blocked it even after the motor nerve had degenerated. Both, he concluded, act on a **"receptive substance"** in the muscle cell itself — the idea of the **receptor**.`,
      widget: { type: 'SvgDiagram', props: { svg: langleySvg }, caption: 'Schematic of Langley’s inference. Today we know the receptive substance as the nicotinic acetylcholine receptor.' },
    },
    {
      kind: 'explain',
      title: 'Ehrlich: receptors and magic bullets',
      body: String.raw`Paul **Ehrlich** reached the same idea from immunology and dyes. His side-chain theory (1897–1900) pictured cells carrying chemical "side chains" — later called *receptors* — that toxins and antibodies combine with. Dyes that stained only certain tissues suggested chemicals could be **selective**, and he summed this up as *corpora non agunt nisi fixata*: "substances do not act unless they are bound."

Ehrlich's goal was a **magic bullet** that binds the microbe, not the host. With Sahachiro Hata he tested hundreds of synthetic arsenic compounds against the syphilis spirochaete; compound **606**, arsphenamine (**Salvarsan**, 1910), became the first modern synthetic chemotherapeutic.`,
    },
    {
      kind: 'mcq',
      prompt: 'Besides the receptor concept, what lasting *method* did Ehrlich’s Salvarsan programme pioneer?',
      choices: [
        'Designing a drug from the crystal structure of its target',
        'Systematically synthesising and testing a series of analogues in a disease model',
        'Isolating the active ingredient from a medicinal plant',
        'Measuring receptor affinity with radioactive ligands',
      ],
      answer: 1,
      why: 'Ehrlich and Hata made and tested hundreds of arsenicals against infection in animals — a forerunner of screening and of analogue-based medicinal chemistry. Crystal structures and radioligand binding came over half a century later; isolating plant actives was the 19th-century approach.',
    },
    {
      kind: 'recall',
      title: 'Pharmacodynamics (from Medicine)',
      points: [
        'Drug effect rises with concentration and saturates; plotted on a log-concentration axis the curve is sigmoidal.',
        '**EC50** (potency) is the concentration giving half the maximal effect; **Emax** (efficacy) is the ceiling.',
        '**Agonists** activate receptors; **antagonists** occupy them without activating.',
        'Receptor families, spare receptors and signalling are covered in [drug–receptor interactions](@med/drug-receptor-interactions).',
      ],
      link: 'med/pharmacodynamics',
    },
    {
      kind: 'explain',
      title: 'Clark makes it quantitative',
      body: String.raw`In 1926 A. J. **Clark** measured how acetylcholine contracted frog heart and muscle and showed the curves fit the **law of mass action**, the same hyperbola A. V. Hill had written down in 1909. If agonist $A$ binds receptor $R$ reversibly with dissociation constant $K_A$, the fraction of receptors occupied is

$$p_A = \frac{[A]}{[A] + K_A}.$$

Clark's **occupancy theory** added the assumption that the response is proportional to $p_A$. So half-maximal response occurs at $[A] = K_A$, and on a log axis the curve is a symmetric S-shape: going from 10 % to 90 % occupancy takes an 81-fold rise in concentration (from $K_A/9$ to $9K_A$).`,
    },
    {
      kind: 'widget',
      title: 'Occupancy and a competitive antagonist',
      body: String.raw`The green curve is agonist occupancy alone. A competitive antagonist $B$ (dissociation constant $K_B$) competes for the same site, giving $p_A = [A]/([A] + K_A(1 + [B]/K_B))$ (orange). Slide the antagonist concentration: the curve shifts **right in parallel**, with the same maximum — enough agonist always wins.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['1/(1+10^(-x))', '1/(1+(1+10^b)*10^(-x))'],
          x: [-3, 5], y: [0, 1.05],
          params: [{ name: 'b', min: -1, max: 3, value: 1, label: 'log₁₀([B]/K_B)' }],
          labels: ['agonist alone', 'with antagonist'],
          xLabel: 'log₁₀([A]/K_A)', yLabel: 'occupancy',
        },
        caption: 'At log₁₀([B]/K_B) = 1, i.e. [B] = 10·K_B, the curve shifts by log₁₀(11) ≈ 1.04 units: 11 times more agonist is needed.',
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Using Clark's equation, what percentage of receptors is occupied when the agonist concentration is three times its dissociation constant, $[A] = 3K_A$?`,
      answer: 75,
      tolerance: 0.5,
      unit: '%',
      why: String.raw`$p = 3K_A/(3K_A + K_A) = 3/4 = 75\%$. A common slip is to think occupancy is linear in concentration (e.g. "3 × 50 %"); the hyperbola saturates.`,
    },
    {
      kind: 'explain',
      title: 'Occupancy is not the whole story',
      body: String.raw`Clark's simple proportionality broke down in the 1950s–60s:
- **Ariëns** (1954) introduced *intrinsic activity*: some agonists give a lower maximum even at full occupancy (**partial agonists**).
- **Stephenson** (1956) separated *affinity* (how well a drug binds) from *efficacy* (how well the bound drug activates) and argued response is a non-linear function of occupancy.
- **Furchgott** (1966) used irreversible antagonists to show many tissues have **spare receptors**: maximal response needs only a fraction of them occupied.

Black and Leff's *operational model* (1983) later unified these ideas. Explore the efficacy–potency distinction below.`,
      widget: { type: 'DoseResponseMed', props: { mode: 'partial', modes: ['agonists', 'partial'] }, caption: 'A partial agonist raises the response on its own yet blocks a full agonist at high occupancy — the profile Black’s first β-blocker lead had.' },
    },
    {
      kind: 'widget',
      title: 'Schild: measuring an antagonist’s affinity',
      body: String.raw`Heinz **Schild** turned the parallel shift into a ruler for antagonist affinity (Arunlakshana & Schild, 1959). Step through the logic.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Agonist alone: occupancy $p = \dfrac{[A]}{[A]+K_A}$.`,
            String.raw`With competitive antagonist: $p = \dfrac{[A']}{[A'] + K_A\left(1+[B]/K_B\right)}$.`,
            String.raw`Same response ⇒ same occupancy, so the **dose ratio** is $r = \dfrac{[A']}{[A]} = 1 + \dfrac{[B]}{K_B}$.`,
            String.raw`Take logs: $\log(r-1) = \log[B] - \log K_B$. A **Schild plot** of $\log(r-1)$ against $\log[B]$ is a line of slope 1.`,
            String.raw`Where it crosses zero ($r = 2$), $[B] = K_B$. The **pA₂** $= -\log K_B$ measures antagonist affinity *without needing to know anything about the agonist*.`,
          ],
          notes: ['', '', 'Independent of the agonist used — a fingerprint of the receptor.', 'Slope ≠ 1 warns the antagonism is not simple competition.', ''],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A competitive antagonist has $K_B = 10$ nM. In the presence of 1 µM antagonist, by what factor (the dose ratio $r$) must the agonist concentration be increased to restore the same response?`,
      answer: 101,
      tolerance: 0.5,
      why: String.raw`$r = 1 + [B]/K_B = 1 + 1000\,\text{nM}/10\,\text{nM} = 101$. Forgetting the "1 +" gives 100 — close here, but badly wrong when $[B] \approx K_B$ (where $r = 2$, not 1).`,
    },
    {
      kind: 'explain',
      title: 'James Black: designing from the receptor idea',
      body: String.raw`Raymond Ahlquist (1948) had proposed two adrenaline receptor types, **α** and **β**. James **Black** reasoned that angina could be treated by *reducing the heart's oxygen demand* — blocking cardiac β-receptors — rather than increasing supply. At ICI, starting from dichloroisoproterenol (a β-blocking partial agonist), his team made pronethalol (1962) and then **propranolol** (1964), the first widely used β-blocker.

At Smith Kline & French he applied the same logic to stomach acid. Classical antihistamines did not block histamine-stimulated acid secretion, implying a second receptor. Modifying histamine itself, the team defined the **H₂ receptor** with burimamide (1972) and arrived at **cimetidine** (marketed 1976). Black shared the 1988 Nobel Prize with Gertrude Elion and George Hitchings.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps of the H₂-antagonist programme that led to cimetidine.',
      steps: [
        'Start from the natural agonist, histamine',
        'Nα-guanylhistamine: a weak partial agonist that slightly blocks',
        'Burimamide: first pure H₂ antagonist, defines the receptor (1972) but poorly absorbed orally',
        'Metiamide: orally active, but a thiourea linked to blood disorders',
        'Cimetidine: thiourea replaced by a cyanoguanidine',
      ],
      why: 'This is the classical pharmacology route to rational design: begin with the endogenous ligand, find partial agonists, lose efficacy while keeping affinity, then fix pharmacokinetics and toxicity — all without any protein structure.',
    },
    {
      kind: 'truefalse',
      prompt: 'Black’s team designed propranolol using an X-ray crystal structure of the β-adrenergic receptor.',
      answer: false,
      why: 'The β₂-adrenergic receptor was only cloned in 1986 and crystallised in 2007. Propranolol (1964) was designed purely from pharmacological measurements on tissues — receptors were still defined operationally, by what drugs did.',
    },
    {
      kind: 'explain',
      title: 'From concept to molecule',
      body: String.raw`For most of the 20th century a receptor was an *inference* from dose–response curves. That changed when:
- snake toxins such as α-bungarotoxin, which bind the nicotinic receptor almost irreversibly, let it be **purified** (around 1970);
- **radioligand binding** (1970s) measured receptors directly in membrane preparations;
- the **β₂-adrenergic receptor gene was cloned** (1986), revealing the seven-transmembrane G-protein-coupled receptor (GPCR) family; its crystal structure followed in 2007 (Nobel Prize 2012, Lefkowitz and Kobilka).

From Langley's "receptive substance" to an atomic structure took about a century — and opened the door to the [structure-based era](@drug/structure-based-design-era).`,
    },
    {
      kind: 'match',
      prompt: 'Match each pioneer to the contribution.',
      pairs: [
        ['Langley', 'A "receptive substance" on the muscle cell (1905)'],
        ['Ehrlich', '"Magic bullets" and the first synthetic chemotherapeutic'],
        ['Clark', 'Occupancy theory based on the law of mass action'],
        ['Schild', 'Dose ratios and pA₂ to measure antagonist affinity'],
        ['Black', 'Propranolol and cimetidine from receptor pharmacology'],
      ],
      why: 'Together these turned "drugs bind something" into quantitative pharmacology: qualitative receptor (Langley, Ehrlich) → quantitative occupancy (Clark) → measured affinities (Schild) → deliberate design (Black).',
    },
    {
      kind: 'fill',
      prompt: 'Stephenson separated a drug’s ___ (how tightly it binds) from its ___ (how strongly the bound drug activates the receptor).',
      bank: ['affinity', 'efficacy', 'potency', 'selectivity', 'solubility'],
      answer: ['affinity', 'efficacy'],
      why: 'Antagonists have affinity but zero efficacy; partial agonists have affinity and intermediate efficacy. Potency (EC50) depends on *both*, which is why it is not the same as affinity.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Langley** (1878, 1905) and **Ehrlich** (~1900, "substances do not act unless bound") founded the receptor concept; Ehrlich's Salvarsan (1910) pioneered analogue screening.
- **Clark** (1926): occupancy $p = [A]/([A]+K_A)$ via mass action; Ariëns, Stephenson and Furchgott added intrinsic activity, efficacy and spare receptors.
- **Schild**: a competitive antagonist gives dose ratio $r = 1 + [B]/K_B$, so pA₂ measures its affinity.
- **Black** used receptor pharmacology alone to design propranolol and cimetidine — rational design before protein structures.
- Receptors became molecules only with purification, radioligands and cloning (1970s–80s).`,
    },
  ],
  references: [
    { authors: 'Langley, J. N.', title: 'On the reaction of cells and of nerve-endings to certain poisons, chiefly as regards the reaction of striated muscle to nicotine and to curari', year: 1905, venue: 'J. Physiol. 33, 374–413' },
    { authors: 'Clark, A. J.', title: 'The reaction between acetyl choline and muscle cells', year: 1926, venue: 'J. Physiol. 61, 530–546' },
    { authors: 'Arunlakshana, O., Schild, H. O.', title: 'Some quantitative uses of drug antagonists', year: 1959, venue: 'Br. J. Pharmacol. Chemother. 14, 48–58' },
    { authors: 'Black, J. W., Duncan, W. A. M., Durant, C. J., Ganellin, C. R., Parsons, E. M.', title: 'Definition and antagonism of histamine H2-receptors', year: 1972, venue: 'Nature 236, 385–390' },
    { authors: 'Maehle, A.-H., Prüll, C.-R., Halliwell, R. F.', title: 'The emergence of the drug receptor theory', year: 2002, venue: 'Nat. Rev. Drug Discov. 1, 637–641' },
  ],
} satisfies LessonContent;
