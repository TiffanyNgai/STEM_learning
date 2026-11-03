import type { LessonContent } from '../../types';

// A depth-2 tree (left) and the axis-aligned partition it induces (right). A query point drops down the tree.
const TREE_SVG = `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
<g font-size="9" fill="var(--fg)" text-anchor="middle">
<line x1="80" y1="34" x2="40" y2="84" stroke="var(--fg)"/><line x1="80" y1="34" x2="120" y2="84" stroke="var(--fg)"/>
<line x1="120" y1="98" x2="90" y2="148" stroke="var(--fg)"/><line x1="120" y1="98" x2="150" y2="148" stroke="var(--fg)"/>
<rect x="44" y="18" width="72" height="20" rx="4" fill="var(--surface)" stroke="var(--fg)"/><text x="80" y="31">x₁ ≤ 0.4 ?</text>
<text x="52" y="58" fill="var(--muted)">yes</text><text x="110" y="58" fill="var(--muted)">no</text>
<rect x="16" y="84" width="48" height="20" rx="4" fill="var(--c3)" opacity="0.35"/><text x="40" y="97">■ orange</text>
<rect x="84" y="84" width="72" height="20" rx="4" fill="var(--surface)" stroke="var(--fg)"/><text x="120" y="97">x₂ ≤ 0.6 ?</text>
<text x="98" y="124" fill="var(--muted)">yes</text><text x="144" y="124" fill="var(--muted)">no</text>
<rect x="66" y="148" width="48" height="20" rx="4" fill="var(--c2)" opacity="0.35"/><text x="90" y="161">● blue</text>
<rect x="126" y="148" width="48" height="20" rx="4" fill="var(--c3)" opacity="0.35"/><text x="150" y="161">■ orange</text>
</g>
<circle r="5" fill="var(--c4)" stroke="var(--fg)" stroke-width="0.8"><animateMotion dur="5s" repeatCount="indefinite" path="M80,28 L120,92 L90,158 L90,158" keyPoints="0;0.45;1;1" keyTimes="0;0.35;0.7;1" calcMode="linear"/></circle>
<rect x="190" y="20" width="120" height="150" fill="none" stroke="var(--fg)"/>
<rect x="190" y="20" width="48" height="150" fill="var(--c3)" opacity="0.25"/>
<rect x="238" y="80" width="72" height="90" fill="var(--c2)" opacity="0.25"/>
<rect x="238" y="20" width="72" height="60" fill="var(--c3)" opacity="0.25"/>
<line x1="238" y1="20" x2="238" y2="170" stroke="var(--fg)" stroke-width="1.5"/>
<line x1="238" y1="80" x2="310" y2="80" stroke="var(--fg)" stroke-width="1.5"/>
<circle cx="268" cy="125" r="5" fill="var(--c4)" stroke="var(--fg)" stroke-width="0.8"/>
<g font-size="8" fill="var(--muted)"><text x="238" y="181" text-anchor="middle">0.4</text><text x="186" y="83" text-anchor="end">0.6</text><text x="310" y="181" text-anchor="end">x₁ →</text><text x="194" y="16">x₂ ↑</text></g>
<text x="12" y="192" font-size="9" fill="var(--muted)">purple query: x₁ &gt; 0.4, x₂ ≤ 0.6 → predicted blue</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Twenty questions for data',
      body: String.raw`A **decision tree** predicts by asking a short sequence of yes/no questions about the input, each of the form "is feature $x_j\le t$?". A doctor's triage flowchart and the game of twenty questions work the same way.

Each **internal node** holds one question; each **leaf** holds a prediction. To classify a point, start at the root and follow the answers down. Geometrically, every question cuts the current region with an axis-parallel line, so a tree splits input space into **rectangles** (boxes in higher dimensions), each with a constant prediction.`,
      widget: { type: 'SvgDiagram', props: { svg: TREE_SVG }, caption: 'A depth-2 tree and the three rectangles it defines.' },
    },
    {
      kind: 'explain',
      title: 'Trees as piecewise-constant models',
      body: String.raw`A tree with leaves $R_1,\dots,R_M$ (disjoint regions covering the input space) predicts
$$f(\mathbf x)=\sum_{m=1}^Mc_m\,\mathbf 1[\mathbf x\in R_m].$$
- **Classification**: $c_m$ is the majority class among training points in $R_m$ (class proportions give probabilities).
- **Regression**: $c_m$ is the mean of the training targets in $R_m$, which minimizes squared error in that box.

Trees handle mixed numeric and categorical inputs, need no feature scaling (only the order of values matters), and the path to a leaf is a human-readable rule.`,
    },
    {
      kind: 'mcq',
      prompt: 'A binary decision tree has every leaf at depth exactly 3 (three questions from root to leaf). How many rectangular regions does it partition the input space into?',
      choices: ['8', '3', '6', '9'],
      answer: 0,
      why: String.raw`Each question doubles the number of paths: $2^3=8$ leaves, one region per leaf. Counting questions on one path (3) or internal nodes ($1+2+4=7$) are the usual slips.`,
    },
    {
      kind: 'explain',
      title: 'Measuring impurity',
      body: String.raw`To choose questions we need a score for how mixed a node is. With class proportions $p_1,\dots,p_K$ in the node:
- **Gini impurity**: $G=\sum_kp_k(1-p_k)=1-\sum_kp_k^2$, the chance that two random draws (with replacement) from the node disagree.
- **Entropy**: $H=-\sum_kp_k\log_2p_k$ bits, the [information](@stats/entropy-kl) needed to name the class.
- **Misclassification**: $1-\max_kp_k$.

All are $0$ for a pure node and largest for an even mix. For two classes with $p=$ share of class 1: $G=2p(1-p)$ (max $0.5$), $H$ has max $1$ bit. **Example:** 6 blue, 2 orange gives $p=0.75$, $G=2(0.75)(0.25)=0.375$.`,
    },
    {
      kind: 'numeric',
      prompt: 'A node holds 9 blue and 3 orange points. What is its Gini impurity? (3 decimals)',
      answer: 0.375,
      tolerance: 0.001,
      why: String.raw`$p=9/12=0.75$, so $G=1-(0.75^2+0.25^2)=1-0.625=0.375$, the same as 6 vs 2: impurity depends only on proportions. Forgetting the factor 2 in $2p(1-p)$ gives $0.1875$.`,
    },
    {
      kind: 'explain',
      title: 'Choosing a split',
      body: String.raw`A split sends $n_L$ of a node's $n$ points left and $n_R$ right. Its quality is the **impurity decrease**
$$\Delta=I(\text{parent})-\frac{n_L}{n}I(L)-\frac{n_R}{n}I(R).$$
With entropy, $\Delta$ is the **information gain**: the mutual information between the split and the label. The algorithm tries **every feature and every threshold** (midpoints between consecutive sorted values) and keeps the largest $\Delta$.

**Worked example.** Parent: 5 blue, 5 orange, $G=0.5$. A split sends 4 blue left (pure, $G=0$) and 1 blue + 5 orange right ($G=2\cdot\tfrac16\cdot\tfrac56\approx0.278$). Weighted children: $0.4\cdot0+0.6\cdot0.278=0.167$, so $\Delta\approx0.333$.`,
    },
    {
      kind: 'widget',
      title: 'Find the best split yourself',
      body: String.raw`Choose a feature and slide the threshold (purple line). The right panel plots the weighted child impurity for every threshold; the dashed line is the parent's impurity, and the green dot marks the best threshold for this feature. Your aim: the lowest point of the curve.

Switch between Gini and entropy: the curves differ in scale but usually agree on the best split. Try the **xor** data: the curve barely dips below the dashed line on either feature. No single cut helps, although two levels of cuts would separate the classes almost perfectly.`,
      widget: { type: 'MlTreeSplitter', props: { mode: 'manual', dataset: 'blobs' } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Parent node: 4 blue, 4 orange (entropy 1 bit). A split gives left = 3 blue, 1 orange and right = 1 blue, 3 orange. What is the information gain, in bits? (3 decimals)`,
      answer: 0.189,
      tolerance: 0.002,
      why: String.raw`Each child has $H=-(0.75\log_20.75+0.25\log_20.25)\approx0.811$ bits, and both have weight $0.5$, so the weighted child entropy is $0.811$ and the gain is $1-0.811=0.189$ bits. Reporting $0.811$ (the child entropy) is the common slip.`,
    },
    {
      kind: 'explain',
      title: 'Growing a tree greedily',
      body: String.raw`**CART** (Breiman, Friedman, Olshen & Stone, 1984) grows a tree top-down: find the best split of the root, then recursively split each child, until a stopping rule fires (maximum depth, too few points, or a pure node). Quinlan's ID3 and C4.5 do the same with information gain (C4.5 normalizes it as the gain ratio).

The search is **greedy**: each split is the best one *now*, without looking ahead. Finding a truly optimal tree is NP-complete (Hyafil & Rivest 1976), so greedy growth is the practical choice. It can be myopic, as the xor data showed: the first cut looks useless on its own but enables perfect second-level cuts.

For regression, impurity is the within-node squared error, and the best split minimizes $\text{SSE}_L+\text{SSE}_R$.`,
    },
    {
      kind: 'widget',
      title: 'Depth, partitions and overfitting',
      body: String.raw`Greedy CART grown to a chosen maximum depth. Every black segment is one split; shading shows each leaf's majority class.

- **blobs**: depth 1–2 already captures the trend; deeper trees carve tiny boxes around stray points.
- **diagonal**: the true boundary $x_2=x_1$ is not axis-aligned, so the tree builds a **staircase**, needing many leaves for a simple line.
- **circle**: boxes approximate the disc.

Training accuracy climbs toward 100% with depth; that is memorization, not learning.`,
      widget: { type: 'MlTreeSplitter', props: { mode: 'grow', dataset: 'diagonal', depth: 2 } },
    },
    {
      kind: 'truefalse',
      prompt: 'If no two training points share the same input but have different labels, a tree grown without any stopping rule reaches 100% training accuracy.',
      answer: true,
      why: String.raw`Any impure node contains two points with different inputs, so some feature has a threshold that separates at least one point from the rest; splitting continues until every leaf is pure. That perfect training fit is exactly why unrestricted trees overfit.`,
    },
    {
      kind: 'explain',
      title: 'Pruning and the price of trees',
      body: String.raw`Rather than stopping early (a weak split can hide a strong one below it), CART grows a large tree and then **prunes** it. **Cost-complexity pruning** minimizes
$$R_\alpha(T)=R(T)+\alpha\,|T|,$$
where $R(T)$ is the training error, $|T|$ the number of leaves and $\alpha\ge0$ a price per leaf. Increasing $\alpha$ gives a nested sequence of smaller trees; [cross-validation](@ml/cross-validation) picks $\alpha$.

Strengths: interpretable, fast, scale-free, handles mixed data. Weaknesses: axis-aligned staircases and **high variance**: a small change in the data can change the root split and hence the whole tree. Averaging many trees fixes the variance: [random forests](@ml/random-forests) and [boosting](@ml/gradient-boosting).`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about single decision trees are true? Select all that apply.',
      choices: [
        String.raw`Applying a strictly increasing transformation (e.g. $\log$) to one feature does not change which training points each split separates`,
        'Features must be standardized before training a tree',
        'Small changes in the training data can produce a very different tree',
        'A diagonal class boundary is approximated by a staircase of axis-aligned cuts',
      ],
      answers: [0, 2, 3],
      why: String.raw`Splits depend only on the ordering of each feature's values, so monotone transformations and scaling leave the partition of training points unchanged (only threshold values relabel). High variance and staircase boundaries are the classic weaknesses.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps of growing and pruning a CART classification tree.',
      steps: [
        'Put all training points in the root node',
        'For every feature and every candidate threshold, compute the impurity decrease',
        'Apply the best split and recurse on both children until a stopping rule holds',
        'Label each leaf with its majority class',
        String.raw`Prune with cost-complexity $R(T)+\alpha|T|$, choosing $\alpha$ by cross-validation`,
      ],
      why: String.raw`Growing is a recursive greedy search over (feature, threshold) pairs; leaves get their constant predictions; pruning then trades training error against size, with $\alpha$ chosen on held-out data.`,
    },
    {
      kind: 'match',
      prompt: 'Match each two-class node to its impurity.',
      pairs: [
        ['Gini, 50/50 mix', '0.5'],
        ['Entropy, 50/50 mix', '1 bit'],
        ['Gini, 75/25 mix', '0.375'],
        ['Entropy, 75/25 mix', 'about 0.811 bits'],
        ['Any measure, pure node', '0'],
      ],
      why: String.raw`Gini is $2p(1-p)$: $0.5$ at $p=\tfrac12$ and $0.375$ at $p=\tfrac34$. Entropy is $-p\log_2p-(1-p)\log_2(1-p)$: $1$ bit at $p=\tfrac12$ and $\approx0.811$ at $p=\tfrac34$. Both vanish on a pure node.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A decision tree is a sequence of axis-aligned questions; it partitions the input space into boxes with constant predictions.
- Splits maximize impurity decrease: Gini $1-\sum p_k^2$ or entropy $-\sum p_k\log_2p_k$ for classification, squared error for regression.
- CART grows greedily (optimal trees are NP-hard) and prunes with $R(T)+\alpha|T|$.
- Trees are interpretable and scale-free but have staircase boundaries and high variance.
- Ensembles of trees, [random forests](@ml/random-forests) and [gradient boosting](@ml/gradient-boosting), keep the strengths and fix the variance.`,
    },
  ],
  references: [
    { authors: 'L. Breiman, J. H. Friedman, R. A. Olshen & C. J. Stone', title: 'Classification and Regression Trees', year: 1984, venue: 'Wadsworth' },
    { authors: 'J. R. Quinlan', title: 'Induction of decision trees', year: 1986, venue: 'Machine Learning 1(1), 81–106' },
    { authors: 'L. Hyafil & R. L. Rivest', title: 'Constructing optimal binary decision trees is NP-complete', year: 1976, venue: 'Information Processing Letters 5(1), 15–17' },
    { authors: 'T. Hastie, R. Tibshirani & J. Friedman', title: 'The Elements of Statistical Learning', year: 2009, venue: '2nd ed., Springer', detail: 'Ch. 9.2 (tree-based methods)', url: 'https://hastie.su.domains/ElemStatLearn/' },
  ],
} satisfies LessonContent;
