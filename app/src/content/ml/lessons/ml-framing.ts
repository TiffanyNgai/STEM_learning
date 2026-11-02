import type { LessonContent } from '../../types';

// Classical programming vs machine learning: what goes in, what comes out.
const PARADIGM_SVG = `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="mlf-a" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--fg)"/></marker></defs>
<text x="8" y="14" font-size="11" fill="var(--muted)">Classical programming</text>
<rect x="8" y="22" width="70" height="22" rx="5" fill="var(--surface)" stroke="var(--c3)" stroke-width="1.5"/><text x="43" y="37" font-size="10" text-anchor="middle" fill="var(--fg)">rules (code)</text>
<rect x="8" y="50" width="70" height="22" rx="5" fill="var(--surface)" stroke="var(--c2)" stroke-width="1.5"/><text x="43" y="65" font-size="10" text-anchor="middle" fill="var(--fg)">data</text>
<rect x="120" y="32" width="80" height="30" rx="8" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/><text x="160" y="51" font-size="11" text-anchor="middle" fill="var(--fg)">computer</text>
<rect x="240" y="36" width="72" height="22" rx="5" fill="var(--surface)" stroke="var(--c1)" stroke-width="1.5"/><text x="276" y="51" font-size="10" text-anchor="middle" fill="var(--fg)">answers</text>
<path d="M78,33 L118,42" stroke="var(--fg)" stroke-width="1.2" marker-end="url(#mlf-a)"/><path d="M78,61 L118,52" stroke="var(--fg)" stroke-width="1.2" marker-end="url(#mlf-a)"/><path d="M200,47 L238,47" stroke="var(--fg)" stroke-width="1.2" marker-end="url(#mlf-a)"/>
<circle r="3.5" fill="var(--c1)"><animateMotion dur="2.4s" repeatCount="indefinite" path="M200,47 L238,47"/></circle>
<text x="8" y="100" font-size="11" fill="var(--muted)">Machine learning</text>
<rect x="8" y="108" width="70" height="22" rx="5" fill="var(--surface)" stroke="var(--c2)" stroke-width="1.5"/><text x="43" y="123" font-size="10" text-anchor="middle" fill="var(--fg)">data</text>
<rect x="8" y="136" width="70" height="22" rx="5" fill="var(--surface)" stroke="var(--c1)" stroke-width="1.5"/><text x="43" y="151" font-size="10" text-anchor="middle" fill="var(--fg)">answers</text>
<rect x="120" y="118" width="80" height="30" rx="8" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/><text x="160" y="137" font-size="11" text-anchor="middle" fill="var(--fg)">learning</text>
<rect x="240" y="122" width="72" height="22" rx="5" fill="var(--surface)" stroke="var(--c3)" stroke-width="2"/><text x="276" y="137" font-size="10" text-anchor="middle" fill="var(--fg)">rules (model)</text>
<path d="M78,119 L118,128" stroke="var(--fg)" stroke-width="1.2" marker-end="url(#mlf-a)"/><path d="M78,147 L118,138" stroke="var(--fg)" stroke-width="1.2" marker-end="url(#mlf-a)"/><path d="M200,133 L238,133" stroke="var(--fg)" stroke-width="1.2" marker-end="url(#mlf-a)"/>
<circle r="3.5" fill="var(--c3)"><animateMotion dur="2.4s" repeatCount="indefinite" path="M200,133 L238,133"/></circle>
</svg>`;

// The four ingredients as a training loop.
const LOOP_SVG = `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="mlf-b" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--fg)"/></marker></defs>
<rect x="10" y="20" width="92" height="40" rx="8" fill="var(--surface)" stroke="var(--c2)" stroke-width="2"/>
<text x="56" y="37" font-size="11" text-anchor="middle" fill="var(--fg)">1 · Data</text><text x="56" y="51" font-size="9" text-anchor="middle" fill="var(--muted)">pairs (x, y)</text>
<rect x="218" y="20" width="92" height="40" rx="8" fill="var(--surface)" stroke="var(--c1)" stroke-width="2"/>
<text x="264" y="37" font-size="11" text-anchor="middle" fill="var(--fg)">2 · Model f_θ</text><text x="264" y="51" font-size="9" text-anchor="middle" fill="var(--muted)">predicts ŷ = f_θ(x)</text>
<rect x="218" y="122" width="92" height="40" rx="8" fill="var(--surface)" stroke="var(--c5)" stroke-width="2"/>
<text x="264" y="139" font-size="11" text-anchor="middle" fill="var(--fg)">3 · Loss</text><text x="264" y="153" font-size="9" text-anchor="middle" fill="var(--muted)">how wrong: ℓ(ŷ, y)</text>
<rect x="10" y="122" width="92" height="40" rx="8" fill="var(--surface)" stroke="var(--c4)" stroke-width="2"/>
<text x="56" y="139" font-size="11" text-anchor="middle" fill="var(--fg)">4 · Optimizer</text><text x="56" y="153" font-size="9" text-anchor="middle" fill="var(--muted)">nudges θ downhill</text>
<path d="M102,40 L216,40" stroke="var(--fg)" stroke-width="1.3" marker-end="url(#mlf-b)"/><text x="159" y="34" font-size="9" text-anchor="middle" fill="var(--muted)">x</text>
<path d="M264,60 L264,120" stroke="var(--fg)" stroke-width="1.3" marker-end="url(#mlf-b)"/><text x="270" y="94" font-size="9" fill="var(--muted)">ŷ (and y)</text>
<path d="M218,142 L104,142" stroke="var(--fg)" stroke-width="1.3" marker-end="url(#mlf-b)"/><text x="160" y="136" font-size="9" text-anchor="middle" fill="var(--muted)">gradient of loss</text>
<path d="M102,128 C170,100 190,90 222,62" fill="none" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#mlf-b)"/><text x="150" y="98" font-size="9" text-anchor="middle" fill="var(--c4)">update θ</text>
<circle r="4" fill="var(--c2)"><animateMotion dur="4s" repeatCount="indefinite" path="M102,40 L216,40"/></circle>
<circle r="4" fill="var(--c1)"><animateMotion dur="4s" begin="1s" repeatCount="indefinite" path="M264,60 L264,120"/></circle>
<circle r="4" fill="var(--c5)"><animateMotion dur="4s" begin="2s" repeatCount="indefinite" path="M218,142 L104,142"/></circle>
<circle r="4" fill="var(--c4)"><animateMotion dur="4s" begin="3s" repeatCount="indefinite" path="M102,128 C170,100 190,90 222,62"/></circle>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Programs that learn from examples',
      body: String.raw`Try writing rules that decide whether a photo shows a cat. Pointy ears? So do foxes. Whiskers? Not when the cat faces away. Hand-written rules break down fast.

**Machine learning (ML)** turns this around. Instead of writing the rules, we give the computer many **examples** (photos labelled "cat" or "not cat") and an algorithm that *finds* rules that fit them.

Tom Mitchell's classic definition puts it this way: a program **learns** if its performance at some task, as measured by some score, improves with experience (data).`,
      widget: { type: 'SvgDiagram', props: { svg: PARADIGM_SVG }, caption: 'Classical code maps rules + data to answers. Learning maps data + answers to rules.' },
    },
    {
      kind: 'explain',
      title: 'The four ingredients',
      body: String.raw`Almost every ML method has four parts:
1. **Data**: examples $(x_i,y_i)$ for $i=1,\dots,n$. Here $x_i$ is an input (a **feature** vector) and $y_i$ is the desired output (its **label**).
2. **Model**: a family of functions $f_\theta$ with adjustable numbers $\theta$ called **parameters**. The prediction is $\hat y=f_\theta(x)$.
3. **Loss** $\ell(\hat y,y)$: one number saying how bad a prediction is.
4. **Optimizer**: a procedure that changes $\theta$ to make the average loss small.

Learning is then one optimization problem:
$$\hat\theta=\arg\min_\theta\ \frac1n\sum_{i=1}^n \ell\big(f_\theta(x_i),\,y_i\big).$$`,
      widget: { type: 'SvgDiagram', props: { svg: LOOP_SVG }, caption: 'Training repeats this loop thousands to millions of times.' },
    },
    {
      kind: 'explain',
      title: 'A worked example',
      body: String.raw`**Task:** predict a flat's rent $y$ (in hundreds of dollars) from its floor area $x$ (in tens of square metres).

- **Data:** 500 past listings $(x_i,y_i)$.
- **Model:** a straight line $f_\theta(x)=\theta_0+\theta_1x$, so $\theta=(\theta_0,\theta_1)$.
- **Loss:** squared error $\ell(\hat y,y)=(\hat y-y)^2$.
- **Optimizer:** [gradient descent](@ml/gradient-descent), or here the exact least-squares formula.

Each ingredient is a choice. Swap the line for a neural network, or squared error for absolute error, and you get a different learner. This unit looks at each choice in turn.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Model $f(x)=2x+1$. Data: $(0,1)$, $(1,4)$, $(2,4)$. What is the **mean squared error** $\frac1n\sum_i (f(x_i)-y_i)^2$? (2 decimals)`,
      answer: 0.667,
      tolerance: 0.01,
      why: String.raw`Predictions are $1,3,5$. Errors are $0,-1,+1$. Squared errors are $0,1,1$, and their mean is $2/3\approx0.67$. Remember to divide by $n=3$; the sum alone is 2.`,
    },
    {
      kind: 'match',
      prompt: 'A spam filter is trained on 10,000 emails that people have marked "spam" or "not spam". Match each ingredient to its role here.',
      pairs: [
        ['Data', 'The 10,000 emails and their spam / not-spam marks'],
        ['Model', 'A function that maps an email’s word counts to a spam probability'],
        ['Loss', 'A penalty that grows when a spam email gets a low spam probability'],
        ['Optimizer', 'Repeatedly adjusts the weights to lower the average penalty'],
      ],
      why: 'Data are the examples, the model is the adjustable function, the loss scores a single prediction, and the optimizer searches over the parameters. Mixing up the loss (what we measure) and the optimizer (how we improve it) is the most common slip.',
    },
    {
      kind: 'widget',
      title: 'Watch a model learn',
      body: String.raw`This is the smallest classifier there is: **logistic regression**, a straight-line boundary with a probability attached. Press **Play**. The optimizer (gradient descent) moves the parameters, the loss falls, and the shaded boundary swings into place.

Then switch the dataset to **circle**. A straight line cannot separate it however long you train. The model family limits what can be learned.`,
      widget: { type: 'NeuralNetPlayground', props: { dataset: 'linear', hidden: 0, showNetwork: false, lr: 0.5 } },
    },
    {
      kind: 'explain',
      title: 'Supervised learning',
      body: String.raw`In **supervised learning** every training input comes with the correct answer (its label). The goal is a function that predicts the label for *new* inputs.

- **Regression**: the label is a number. Examples: house price, tomorrow's temperature, a drug's binding affinity.
- **Classification**: the label is a category. Examples: spam or not, which of 1000 objects is in a photo, benign or malignant.

Labels often cost money. A radiologist must read each scan, and someone has to run each assay. That cost is a big reason the other two paradigms exist.`,
    },
    {
      kind: 'mcq',
      prompt: 'Which of these is a **regression** task?',
      choices: [
        'Deciding whether a transaction is fraudulent',
        'Recognising which digit (0–9) is handwritten in an image',
        'Predicting how many minutes a delivery will take',
        'Grouping customers into segments without any labels',
      ],
      answer: 2,
      why: 'Delivery time is a number on a continuous scale, so this is regression. Fraud yes/no and digit 0–9 are categories (classification). Even though digits are written with numbers, "7" is not "more" than "3" in any useful sense. Grouping without labels is unsupervised clustering.',
    },
    {
      kind: 'explain',
      title: 'Unsupervised and reinforcement learning',
      body: String.raw`**Unsupervised learning** has only inputs $x_i$, with no labels. The goal is to find structure:
- **clustering**: groups of similar points ([k-means](@ml/k-means));
- **dimensionality reduction**: a few directions that explain most of the variation ([PCA](@ml/pca));
- **density estimation / generative modelling**: learn $p(x)$ well enough to sample new data ([diffusion models](@ml/diffusion-models)).

**Self-supervised** learning makes labels from the data itself (e.g. hide a word and predict it). That is how large language models are pretrained.

**Reinforcement learning (RL)**: an **agent** takes **actions** in an environment and receives **rewards**, often delayed. Nobody says which action was right; the agent must find out by trial and error. See [MDPs](@ml/mdp-intro).`,
    },
    {
      kind: 'match',
      prompt: 'Match each problem to the learning paradigm that fits it best.',
      pairs: [
        ['Predict a patient’s blood pressure from 20 lab values, using 5,000 past patients with known blood pressure', 'Supervised (regression)'],
        ['Find natural groupings in a million unlabelled shopping baskets', 'Unsupervised (clustering)'],
        ['Teach a robot arm to stack blocks, rewarding it only when the tower stands', 'Reinforcement learning'],
        ['Flag emails as phishing, given 50,000 emails marked phishing / safe', 'Supervised (classification)'],
      ],
      why: 'Labelled numeric targets mean regression, and labelled categories mean classification. No labels at all means unsupervised. A reward that arrives only after a sequence of actions is the defining feature of reinforcement learning.',
    },
    {
      kind: 'recall',
      title: 'Probability you will need',
      points: [
        String.raw`A **random variable** is a numerical outcome of a random process; a **joint distribution** $p(x,y)$ gives probabilities for pairs of outcomes.`,
        String.raw`Events $A,B$ are **independent** if $P(A\cap B)=P(A)\,P(B)$.`,
        String.raw`Probabilities obey the axioms: $P(\text{anything})\ge0$, $P(\text{sure event})=1$, and they add over disjoint events.`,
        'A sample is **i.i.d.** if its draws are independent and identically distributed (all from the same distribution).',
      ],
      link: 'stats/probability-basics',
    },
    {
      kind: 'explain',
      title: 'The real goal: new data',
      body: String.raw`The standard assumption is that training pairs $(x_i,y_i)$ are drawn **i.i.d.** from some unknown distribution $p(x,y)$, and future pairs come from the **same** distribution.

We fit on the training data, but what we care about is the expected loss on a *fresh* draw from $p$. A model that memorises the training set can score perfectly there and still fail on new examples. This is called **overfitting**.

So "learning" is not the same as "fitting". The gap between the two is the topic of the next lesson, [empirical risk minimization](@ml/empirical-risk-minimization). If deployment data differ from training data (**distribution shift**), even a well-fitted model can fail.`,
    },
    {
      kind: 'truefalse',
      prompt: 'If a model achieves zero error on its training data, it is guaranteed to perform well on new data from the same distribution.',
      answer: false,
      why: 'A flexible enough model can memorise every training example, noise included, and still predict new points badly (overfitting). Training error is an optimistic estimate. Only held-out data tell you how well the model generalizes.',
    },
    {
      kind: 'order',
      prompt: 'Put the stages of a basic supervised-learning project in order.',
      steps: [
        'Define the task and collect labelled examples',
        'Set aside a test set that will not be touched during development',
        'Choose a model family and a loss function',
        'Train: run the optimizer on the training data',
        'Evaluate once on the held-out test set',
      ],
      why: 'You must decide what to predict before collecting data. The test set is split off before any modelling so it cannot influence choices. Training needs a model and a loss, and the final evaluation comes last so it stays an honest estimate. See [evaluation & data splits](@ml/evaluation-data-splits).',
    },
    {
      kind: 'fill',
      prompt: 'In supervised learning each input comes with a ___. In unsupervised learning there are only inputs, and we look for ___. In reinforcement learning an agent learns from a ___ signal.',
      bank: ['label', 'structure', 'reward', 'gradient', 'parameter', 'test set'],
      answer: ['label', 'structure', 'reward'],
      why: 'Labels define supervised learning, and finding structure (clusters, low-dimensional directions, densities) defines unsupervised learning. Reward defines RL. Gradients and parameters belong to the optimization machinery that all three may use.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- ML learns rules from examples instead of having them programmed.
- Four ingredients: **data**, a **model** $f_\theta$, a **loss** $\ell$ and an **optimizer**. Training solves $\min_\theta\frac1n\sum_i\ell(f_\theta(x_i),y_i)$.
- **Supervised** (labels: regression or classification), **unsupervised** (no labels: structure), **reinforcement** (rewards from acting).
- Data are assumed to be i.i.d. draws from an unknown $p(x,y)$. The goal is low loss on *new* draws, not just on the training set.`,
    },
  ],
  references: [
    { authors: 'T. M. Mitchell', title: 'Machine Learning', year: 1997, venue: 'McGraw-Hill', detail: 'Ch. 1' },
    { authors: 'K. P. Murphy', title: 'Probabilistic Machine Learning: An Introduction', year: 2022, venue: 'MIT Press', detail: 'Ch. 1', url: 'https://probml.github.io/pml-book/book1.html' },
    { authors: 'C. M. Bishop', title: 'Pattern Recognition and Machine Learning', year: 2006, venue: 'Springer', detail: 'Ch. 1' },
    { authors: 'R. S. Sutton & A. G. Barto', title: 'Reinforcement Learning: An Introduction', year: 2018, venue: '2nd ed., MIT Press', detail: 'Ch. 1', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
  ],
} satisfies LessonContent;
