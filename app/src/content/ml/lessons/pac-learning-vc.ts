import type { LessonContent } from '../../types';

// Shattering: three points in general position can be given all 2^3 = 8 labelings by a line; the XOR pattern of 4 points cannot.
const PTS: [number, number][] = [[24, 52], [76, 52], [50, 18]];
const PW = 100, PH = 66;
function sepLine(lab: number[]): string {
  const pos = lab.reduce((s, v) => s + v, 0);
  if (pos === 0 || pos === 3) return `<line x1="6" y1="62" x2="94" y2="62" stroke="var(--c1)" stroke-width="1.8"/>`;
  // the odd point out is cut off by a line perpendicular to (odd - mean(others)), through their midpoint
  const odd = pos === 1 ? lab.indexOf(1) : lab.indexOf(0);
  const others = PTS.filter((_, i) => i !== odd);
  const mx = (others[0][0] + others[1][0]) / 2, my = (others[0][1] + others[1][1]) / 2;
  const [ox, oy] = PTS[odd]; const cx = (ox + mx) / 2, cy = (oy + my) / 2;
  const dx = ox - mx, dy = oy - my; const L = Math.hypot(dx, dy);
  const ux = -dy / L, uy = dx / L;
  return `<line x1="${(cx - 40 * ux).toFixed(1)}" y1="${(cy - 40 * uy).toFixed(1)}" x2="${(cx + 40 * ux).toFixed(1)}" y2="${(cy + 40 * uy).toFixed(1)}" stroke="var(--c1)" stroke-width="1.8"/>`;
}
const LABELINGS = Array.from({ length: 8 }, (_, m) => [m & 1, (m >> 1) & 1, (m >> 2) & 1]);
const panelAt = (k: number) => [8 + (k % 3) * (PW + 4), 20 + Math.floor(k / 3) * (PH + 6)];
const PANELS = LABELINGS.map((lab, k) => {
  const [x, y] = panelAt(k);
  return `<g transform="translate(${x},${y})" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${(0.03 + 0.08 * k).toFixed(2)};${(0.06 + 0.08 * k).toFixed(2)};0.95;1" dur="10s" repeatCount="indefinite"/>
<rect width="${PW}" height="${PH}" rx="4" fill="var(--surface)" stroke="var(--grid)"/>${sepLine(lab)}
${PTS.map(([px, py], i) => `<circle cx="${px}" cy="${py}" r="5" fill="${lab[i] ? 'var(--c3)' : 'var(--surface)'}" stroke="${lab[i] ? 'var(--c3)' : 'var(--c2)'}" stroke-width="2"/>`).join('')}</g>`;
}).join('\n');
const [XX, XY] = panelAt(8);
const XOR = `<g transform="translate(${XX},${XY})" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.7;0.75;0.95;1" dur="10s" repeatCount="indefinite"/>
<rect width="${PW}" height="${PH}" rx="4" fill="var(--surface)" stroke="var(--c5)"/>
${[[28, 16, 1], [72, 16, 0], [28, 50, 0], [72, 50, 1]].map(([px, py, l]) => `<circle cx="${px}" cy="${py}" r="5" fill="${l ? 'var(--c3)' : 'var(--surface)'}" stroke="${l ? 'var(--c3)' : 'var(--c2)'}" stroke-width="2"/>`).join('')}
<text x="50" y="37" font-size="9" text-anchor="middle" fill="var(--c5)">no line works</text></g>`;
const SHATTER_SVG = `<svg viewBox="0 0 320 236" xmlns="http://www.w3.org/2000/svg">
<text x="8" y="13" font-size="10" fill="var(--fg)">3 points: all 8 labelings separable by a line (shattered)</text>
${PANELS}
${XOR}
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Why should training error mean anything?',
      body: String.raw`[Empirical risk minimization](@ml/empirical-risk-minimization) picks the hypothesis $h$ with the smallest training error $L_S(h)$, hoping its true error $L_{\mathcal D}(h)$ on the data distribution $\mathcal D$ is small too.

For **one fixed** $h$ chosen before seeing the data, $L_S(h)$ is an average of $m$ independent 0/1 losses, so Hoeffding's inequality gives
$$\Pr\big(|L_S(h)-L_{\mathcal D}(h)|>\varepsilon\big)\le2e^{-2m\varepsilon^2}.$$
But ERM picks $h$ *after* looking at the data, out of a whole class $\mathcal H$, and it may pick precisely the $h$ that got lucky. We need a guarantee that holds **simultaneously for every** $h\in\mathcal H$. How much data that takes depends on how rich $\mathcal H$ is: its **capacity**.`,
    },
    {
      kind: 'explain',
      title: 'Probably approximately correct',
      body: String.raw`Valiant (1984) formalized learnability in the noise-free (realizable) setting; the general **agnostic** version below, which compares against the best $h'\in\mathcal H$, is due to Haussler (1992) and Kearns, Schapire & Sellie (1994). A class $\mathcal H$ is **PAC-learnable** if there is an algorithm and a **sample complexity** $m(\varepsilon,\delta)$ such that for **every** distribution $\mathcal D$, given $m\ge m(\varepsilon,\delta)$ i.i.d. examples, the output $h$ satisfies
$$\Pr\big(L_{\mathcal D}(h)\le\min_{h'\in\mathcal H}L_{\mathcal D}(h')+\varepsilon\big)\ge1-\delta.$$
- $\varepsilon$ = **approximately** correct (accuracy);
- $\delta$ = with high **probability** (confidence: an unlucky sample can always fool us).

**Realizable** case: some $h\in\mathcal H$ has zero error. **Agnostic** case: no assumption, and we compete with the best $h$ in the class. Note "for every $\mathcal D$": PAC guarantees are **worst-case** over distributions.`,
    },
    {
      kind: 'widget',
      title: 'Finite classes: a union bound',
      body: String.raw`Realizable case, finite $\mathcal H$: how many examples make ERM $\varepsilon$-accurate?`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Call $h$ **bad** if $L_{\mathcal D}(h)>\varepsilon$. ERM can only fail by returning a bad $h$ that is nevertheless consistent with all $m$ examples.`,
            String.raw`For one bad $h$, each example is classified correctly with probability $<1-\varepsilon$, so $\Pr(h\text{ consistent with all }m)\le(1-\varepsilon)^m\le e^{-\varepsilon m}$.`,
            String.raw`Union bound over at most $|\mathcal H|$ bad hypotheses: $\Pr(\text{some bad }h\text{ is consistent})\le|\mathcal H|\,e^{-\varepsilon m}$.`,
            String.raw`Make this $\le\delta$: $\quad m\ \ge\ \dfrac{\ln|\mathcal H|+\ln(1/\delta)}{\varepsilon}.$`,
          ],
          notes: ['', 'Uses $1-\\varepsilon\\le e^{-\\varepsilon}$.', 'Capacity enters only as $\\ln|\\mathcal H|$.', 'Sample complexity grows like $1/\\varepsilon$ in the realizable case.'],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Realizable setting, $|\mathcal H|=1000$, $\varepsilon=0.01$, $\delta=0.05$. Using $m\ge(\ln|\mathcal H|+\ln(1/\delta))/\varepsilon$, what is the smallest integer $m$?`,
      answer: 991,
      tolerance: 0.5,
      why: String.raw`$\ln1000+\ln20=\ln20000\approx9.903$; dividing by $0.01$ gives $990.3$, so $m=991$. Using $\log_{10}$ by mistake gives about $430$.`,
    },
    {
      kind: 'widget',
      title: 'Agnostic: uniform convergence',
      body: String.raw`Without realizability, combine Hoeffding with the union bound: with probability $\ge1-\delta$, **every** $h\in\mathcal H$ satisfies
$$|L_S(h)-L_{\mathcal D}(h)|\le\sqrt{\frac{\ln|\mathcal H|+\ln(2/\delta)}{2m}}.$$
The curve plots this gap against $m$. Slide $\ln|\mathcal H|$ (capacity) and $\delta$. The gap shrinks only like $1/\sqrt m$: a much slower rate than the realizable $1/m$. Capacity enters only logarithmically.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['sqrt((h + log(2/d))/(2*x))'],
          x: [10, 5000], y: [0, 0.6],
          params: [{ name: 'h', min: 0, max: 60, value: 10, label: 'ln|H|' }, { name: 'd', min: 0.01, max: 0.3, value: 0.05, label: 'δ' }],
          xLabel: 'm (training examples)', yLabel: 'gap bound',
        },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Keeping $\mathcal H$ and $\delta$ fixed, how must $m$ change to **halve** the uniform-convergence gap $\sqrt{(\ln|\mathcal H|+\ln(2/\delta))/(2m)}$?`,
      choices: ['Double it', 'Multiply it by 4', String.raw`Multiply it by $\sqrt2$`, 'Square it'],
      answer: 1,
      why: String.raw`The gap scales as $1/\sqrt m$, so halving it needs $4\times$ the data. Doubling $m$ only shrinks the gap by a factor $\sqrt2\approx1.41$.`,
    },
    {
      kind: 'explain',
      title: 'Infinite classes: shattering & VC dimension',
      body: String.raw`A line classifier has infinitely many settings, so $\ln|\mathcal H|=\infty$. Yet on any **finite** sample it can only produce finitely many labelings. That number is what matters.

- $\mathcal H$ **shatters** a set of points if it can realize **all** $2^m$ labelings of them.
- The **VC dimension** $d_{VC}(\mathcal H)$ is the size of the **largest** set that $\mathcal H$ can shatter (Vapnik & Chervonenkis, 1971).

To show $d_{VC}=d$, exhibit *one* set of $d$ points that is shattered, and prove that *no* set of $d+1$ points is. **Sauer–Shelah lemma:** if $d_{VC}=d$, the number of labelings on $m\ge d$ points is at most $\sum_{i=0}^d\binom mi\le(em/d)^d$. That is polynomial in $m$, not $2^m$, and it replaces $|\mathcal H|$ in the union bound.`,
    },
    {
      kind: 'widget',
      title: 'Lines in the plane shatter 3 points, not 4',
      body: String.raw`Orange = positive, hollow = negative; a green line separates each labeling. Three points in general position admit all $2^3=8$ labelings. For four points, the XOR pattern (diagonal pairs sharing a label) defeats every line, and any 4 points have *some* labeling no line achieves. So halfplanes in $\mathbb R^2$ have $d_{VC}=3$. In general, halfspaces $\{\mathbf x:\mathbf w^\top\mathbf x+b\ge0\}$ in $\mathbb R^d$ have $d_{VC}=d+1$.`,
      widget: { type: 'SvgDiagram', props: { svg: SHATTER_SVG } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`What is the VC dimension of linear classifiers with a bias, $\operatorname{sign}(\mathbf w^\top\mathbf x+b)$, on inputs $\mathbf x\in\mathbb R^{10}$?`,
      choices: ['10', '11', '20', 'Infinite'],
      answer: 1,
      why: String.raw`Halfspaces in $\mathbb R^d$ have $d_{VC}=d+1$, here 11, matching the number of parameters $(\mathbf w,b)$. That match is a coincidence of linear models, not a general rule.`,
    },
    {
      kind: 'explain',
      title: 'The fundamental theorem',
      body: String.raw`For binary classification with 0–1 loss, the following are **equivalent** (Shalev-Shwartz & Ben-David, Ch. 6; building on Vapnik–Chervonenkis and Blumer et al., 1989):
1. $\mathcal H$ has finite VC dimension $d$;
2. $\mathcal H$ has the uniform convergence property;
3. $\mathcal H$ is agnostic PAC-learnable, and ERM is a successful learner.

Quantitatively, up to constants, the agnostic sample complexity is $\Theta\big((d+\ln(1/\delta))/\varepsilon^2\big)$. Equivalently, with probability $\ge1-\delta$, every $h\in\mathcal H$ satisfies
$$L_{\mathcal D}(h)\le L_S(h)+O\!\left(\sqrt{\frac{d\ln(m/d)+\ln(1/\delta)}{m}}\right).$$
VC dimension replaces $\ln|\mathcal H|$, and **infinite** VC dimension means the class is **not** PAC-learnable at all.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A finite class has $\ln|\mathcal H|=20$. With $m=10{,}000$ examples and $\delta=0.05$, what is the uniform-convergence gap $\sqrt{(\ln|\mathcal H|+\ln(2/\delta))/(2m)}$? (3 decimals)`,
      answer: 0.034,
      tolerance: 0.001,
      why: String.raw`$\ln(2/0.05)=\ln40\approx3.689$, so the numerator is $23.689$. Then $23.689/20000=0.001184$, whose square root is $\approx0.0344$. Forgetting the factor 2 in the denominator gives $0.049$.`,
    },
    {
      kind: 'truefalse',
      prompt: 'The VC dimension of a class always equals its number of real-valued parameters.',
      answer: false,
      why: String.raw`The one-parameter class $h_\theta(x)=\operatorname{sign}(\sin(\theta x))$ on $\mathbb R$ has **infinite** VC dimension: a high enough frequency $\theta$ can fit any labeling of suitably chosen points. Conversely, parameters can be redundant. Capacity is about the labelings a class can realize, not about counting knobs.`,
    },
    {
      kind: 'explain',
      title: 'Where the theory meets deep learning',
      body: String.raw`For ReLU networks with $W$ weights and $L$ layers, the VC dimension is roughly of order $WL\log W$ (nearly tight bounds: Bartlett et al., 2019), far more than the number of training examples for modern nets. Plug that in and the bound exceeds 1: it is **vacuous**.

Zhang et al. (2017) made the point vivid. Standard image networks reach **zero training error on CIFAR-10 with completely random labels**, so the same architecture that generalizes on real labels can also memorize noise. Any bound that depends only on the class $\mathcal H$ (VC dimension, uniform convergence over $\mathcal H$) cannot tell those two situations apart.

VC/PAC bounds remain correct, but they are **worst-case over distributions and over all of $\mathcal H$**, so they are loose here. Current work uses data- and algorithm-dependent quantities instead: margins and weight norms, PAC-Bayes (Dziugaite & Roy, 2017, obtained non-vacuous bounds for stochastic networks on a binary MNIST task), compression, and the implicit bias of SGD (see [double descent](@ml/double-descent)).`,
    },
    {
      kind: 'match',
      prompt: 'Match each term to its meaning.',
      pairs: [
        ['Shattering', String.raw`$\mathcal H$ realizes every one of the $2^m$ labelings of a point set`],
        ['VC dimension', 'Size of the largest point set the class can shatter'],
        ['Sample complexity', String.raw`Examples needed to be $\varepsilon$-accurate with probability $\ge1-\delta$`],
        ['Realizable case', 'Some hypothesis in the class has zero true error'],
        ['Uniform convergence', 'Training error is close to true error for all hypotheses at once'],
      ],
      why: String.raw`These are the building blocks of the fundamental theorem: finite VC dimension ⇔ uniform convergence ⇔ PAC learnability, with sample complexity controlled by $d$, $\varepsilon$ and $\delta$.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`To prove $d_{VC}=d$ you must show that ___ set of $d$ points is shattered and that ___ set of $d+1$ points is shattered. For halfspaces in $\mathbb R^d$, $d_{VC}=$ ___.`,
      bank: ['some', 'no', 'every', 'each', 'd+1', 'd', '2d'],
      answer: ['some', 'no', 'd+1'],
      why: String.raw`The definition is existential for the lower bound (find **one** shattered set; not every set needs to be, e.g. three collinear points are not) and universal for the upper bound (**no** set of size $d+1$). Halfspaces with bias in $\mathbb R^d$ give $d+1$.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- PAC: with probability $\ge1-\delta$, error within $\varepsilon$ of the best in $\mathcal H$, for **every** distribution (Valiant, 1984).
- Finite classes: realizable $m\ge(\ln|\mathcal H|+\ln\frac1\delta)/\varepsilon$; agnostic gap $\sqrt{(\ln|\mathcal H|+\ln\frac2\delta)/(2m)}$.
- VC dimension = largest shattered set; halfspaces in $\mathbb R^d$ have $d+1$. Finite VC ⇔ PAC-learnable, with $m=\Theta((d+\ln\frac1\delta)/\varepsilon^2)$.
- The bounds are distribution-free and worst-case, hence vacuous for over-parameterized nets that can fit random labels (Zhang et al., 2017).`,
    },
  ],
  references: [
    { authors: 'S. Shalev-Shwartz & S. Ben-David', title: 'Understanding Machine Learning: From Theory to Algorithms', year: 2014, venue: 'Cambridge University Press', detail: 'Ch. 2–4 (PAC, uniform convergence), Ch. 6 (VC dimension, fundamental theorem)', url: 'https://www.cs.huji.ac.il/~shais/UnderstandingMachineLearning/' },
    { authors: 'L. G. Valiant', title: 'A Theory of the Learnable', year: 1984, venue: 'Communications of the ACM 27(11), 1134–1142' },
    { authors: 'V. N. Vapnik & A. Ya. Chervonenkis', title: 'On the Uniform Convergence of Relative Frequencies of Events to Their Probabilities', year: 1971, venue: 'Theory of Probability and Its Applications 16(2), 264–280' },
    { authors: 'V. N. Vapnik', title: 'Statistical Learning Theory', year: 1998, venue: 'Wiley' },
    { authors: 'C. Zhang, S. Bengio, M. Hardt, B. Recht & O. Vinyals', title: 'Understanding Deep Learning Requires Rethinking Generalization', year: 2017, venue: 'ICLR' },
  ],
} satisfies LessonContent;
