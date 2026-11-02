import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Can you trust "90% sure"?',
      body: String.raw`A classifier outputs a probability, say $\hat p=0.9$ that an X-ray shows pneumonia. Accuracy tells you how often the top guess is right. It says nothing about whether that **0.9 means anything**. A model is **calibrated** if, among all cases where it says $0.9$, about 90% really are positive:
$$\Pr\big(Y=\hat Y\mid\hat P=p\big)=p\quad\text{for all }p,$$
where $\hat Y$ is the predicted class and $\hat P$ its confidence.

Calibration matters whenever probabilities feed decisions: medical triage, deferring hard cases to a human, combining models, or computing expected costs.`,
    },
    {
      kind: 'widget',
      title: 'Reliability diagrams',
      body: String.raw`Group predictions into confidence bins and plot each bin's **accuracy** (blue bars) against its average **confidence**. A calibrated model sits on the dashed diagonal; the red bands show the gap.

This simulated model outputs logits $c=2.5$ times too large, so it is **over-confident**: bars sit **below** the diagonal (its "95%" predictions are right less often than 95% of the time). Drag the temperature $T$ and watch ECE and NLL. Then press **Fit T**. Notice that **accuracy never changes**.`,
      widget: { type: 'MlReliabilityDiagram', props: { overconfidence: 2.5, temperature: 1 } },
    },
    {
      kind: 'explain',
      title: 'Measuring miscalibration',
      body: String.raw`**Expected calibration error** (ECE): with $n$ predictions split into bins $B_1,\dots,B_M$ by confidence,
$$\mathrm{ECE}=\sum_{m=1}^M\frac{|B_m|}{n}\,\big|\operatorname{acc}(B_m)-\operatorname{conf}(B_m)\big|.$$
It is intuitive but depends on the binning, and a useless model that always predicts the base rate has ECE $\approx0$.

**Proper scoring rules** reward calibration *and* sharpness together, and are minimized in expectation by the true probabilities:
- negative log-likelihood (NLL, cross-entropy): $-\log\hat p_y$;
- Brier score: $\sum_k(\hat p_k-\mathbb 1[y=k])^2$. (For two classes many tools, including the widget below, report the binary form $(p-y)^2$, which is half of this.)

Guo et al. (2017) found that modern deep nets (e.g. ResNets) are markedly **over-confident**, much more than older, smaller nets like LeNet. Greater depth and width, batch normalization and less weight decay were associated with worse calibration. They observed networks overfitting the NLL: test NLL rises late in training as confidence keeps growing, even while test error does not get worse.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`100 predictions fall into two bins. Bin A: 60 predictions, mean confidence 0.90, accuracy 0.80. Bin B: 40 predictions, mean confidence 0.60, accuracy 0.65. What is the ECE?`,
      answer: 0.08,
      tolerance: 0.001,
      why: String.raw`$\tfrac{60}{100}|0.80-0.90|+\tfrac{40}{100}|0.65-0.60|=0.06+0.02=0.08$. Gaps are taken in absolute value, so the under-confident bin B does **not** cancel the over-confident bin A (signed gaps would give 0.04).`,
    },
    {
      kind: 'explain',
      title: 'Temperature scaling',
      body: String.raw`The simplest fix (Guo et al., 2017) learns **one** number after training. Divide the logits $\mathbf z$ by a temperature $T>0$ inside the [softmax](@ml/softmax-classification):
$$\hat{\mathbf p}=\operatorname{softmax}(\mathbf z/T).$$
$T>1$ softens over-confident predictions; $T<1$ sharpens. Choose $T$ by minimizing NLL on a held-out **validation** set (never the training set, where the model is over-confident by construction).

Dividing all logits by the same positive $T$ preserves their order, so the arg-max and hence **accuracy are unchanged**. Only the confidence is recalibrated. Richer variants: **Platt scaling** ($\sigma(az+b)$ for binary), vector/matrix scaling, and non-parametric **isotonic regression**. Guo et al. found plain temperature scaling surprisingly hard to beat.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A binary classifier outputs logits $(2,0)$. With temperature $T=2$, what probability does the softmax assign to class 1 (the logit-2 class)? (3 decimals)`,
      answer: 0.731,
      tolerance: 0.002,
      why: String.raw`Logits become $(1,0)$, so $p=e^1/(e^1+e^0)=1/(1+e^{-1})\approx0.731$. At $T=1$ it was $1/(1+e^{-2})\approx0.881$: the prediction is softened, and the predicted class is the same.`,
    },
    {
      kind: 'mcq',
      prompt: 'Why can temperature scaling never change a classifier’s accuracy?',
      choices: [
        'Because it is fitted on a validation set rather than the training set',
        String.raw`Because dividing every logit by the same $T>0$ preserves which logit is largest`,
        'Because the softmax output always sums to 1',
        'Because it only changes the bias term of the last layer',
      ],
      answer: 1,
      why: String.raw`$z_i>z_j\iff z_i/T>z_j/T$ for $T>0$, so the arg-max class is untouched. Normalization to 1 is true of any softmax and does not explain it. Platt scaling with a bias term $b$ **can** move the 0.5 decision threshold.`,
    },
    {
      kind: 'explain',
      title: 'Two kinds of uncertainty',
      body: String.raw`- **Aleatoric** uncertainty is noise in the data itself: an ambiguous image, a coin flip. More data does not remove it. A model can represent it by predicting a distribution (e.g. a variance head).
- **Epistemic** uncertainty is the model's ignorance from limited data: it is large far from the training data and shrinks with more data.

**Deep ensembles** (Lakshminarayanan, Pritzel & Blundell, 2017) train $M$ networks from different random initializations and average their predictions. Where the members **disagree**, epistemic uncertainty is high. Ensembles are a strong, simple baseline. MC dropout and Bayesian neural networks are alternatives.

Caveat: calibration measured on the validation distribution typically **degrades under distribution shift** (Ovadia et al., 2019). Ensembles degrade more gracefully than most methods.`,
    },
    {
      kind: 'match',
      prompt: 'Match each method or quantity to what it provides.',
      pairs: [
        ['Temperature scaling', 'Recalibrates confidences with one parameter; accuracy unchanged'],
        ['Deep ensemble', 'Disagreement between members signals epistemic uncertainty'],
        ['Brier score / NLL', 'Proper scoring rules for evaluating probabilistic predictions'],
        ['Split conformal prediction', 'Prediction sets with a finite-sample coverage guarantee'],
      ],
      why: String.raw`Each tool targets a different need: post-hoc calibration (temperature), model uncertainty (ensembles), evaluation (proper scores) and guaranteed coverage (conformal).`,
    },
    {
      kind: 'widget',
      title: 'Split conformal prediction',
      body: String.raw`Calibration is an *average* property. **Conformal prediction** (Vovk, Gammerman & Shafer, 2005) instead wraps **any** trained model so it outputs a **set** or **interval** that contains the truth with a chosen probability. It needs no assumption on the model or distribution, only that calibration and test points are **exchangeable** (e.g. i.i.d.).`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Train any model on the training set. Keep a separate **calibration set** of $n$ labelled points.`,
            String.raw`Define a **nonconformity score** $s(x,y)$ (large = model fits badly). Regression: $s=|y-\hat f(x)|$. Classification: $s=1-\hat p_y(x)$.`,
            String.raw`Compute $s_1,\dots,s_n$ on the calibration set. Let $\hat q$ be the $\lceil(n+1)(1-\alpha)\rceil$-th smallest score.`,
            String.raw`For a new $x$, output $C(x)=\{y:s(x,y)\le\hat q\}$. In regression this is $\hat f(x)\pm\hat q$; in classification, every class with $\hat p_y\ge1-\hat q$.`,
            String.raw`**Guarantee:** $\Pr\big(Y_{\text{new}}\in C(X_{\text{new}})\big)\ge1-\alpha$, valid in finite samples (not just asymptotically), for any model.`,
          ],
          notes: ['', 'Any score works; better models give smaller sets.', 'The +1 accounts for the test point itself.', 'Hard inputs automatically get larger sets in classification.', 'Marginal coverage: averaged over test points, not for each x.'],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Split conformal with $n=99$ calibration points and target coverage $1-\alpha=0.9$. Which order statistic is $\hat q$? (Give $k$ for the $k$-th smallest score.)`,
      answer: 90,
      why: String.raw`$\lceil(99+1)(0.9)\rceil=\lceil90\rceil=90$. Using $\lceil n(1-\alpha)\rceil=\lceil89.1\rceil=90$ happens to agree here, but in general omitting the $+1$ can under-cover slightly.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Split conformal prediction at level $1-\alpha=0.9$ guarantees 90% coverage for **each individual** input $x$, e.g. for every patient subgroup separately.`,
      answer: false,
      why: String.raw`The guarantee is **marginal**: averaged over the random calibration set and test point. Coverage can be lower on some subgroups and higher on others. Exact conditional coverage for every $x$ is impossible in general without further assumptions; group-conditional variants calibrate per group.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements are true?',
      choices: [
        'A model that always predicts the overall base rate can have near-zero ECE',
        'Temperature should be fitted on held-out data, not on the training set',
        'Higher accuracy implies better calibration',
        'Calibration measured on in-distribution validation data may not hold under distribution shift',
        'Ensembling several independently trained networks often improves both accuracy and calibration',
      ],
      answers: [0, 1, 3, 4],
      why: String.raw`ECE rewards being right *on average*, and the constant base-rate predictor is, which is why proper scores are also reported. Training-set confidence is inflated by overfitting. Guo et al. showed accuracy and calibration can move in **opposite** directions. Shift degrades calibration (Ovadia et al., 2019); ensembles are a strong remedy (Lakshminarayanan et al., 2017).`,
    },
    {
      kind: 'order',
      prompt: 'Order a sound post-hoc calibration workflow for a trained classifier.',
      steps: [
        'Train the network on the training set',
        'Compute logits on a held-out validation set',
        'Fit the temperature T by minimizing validation NLL',
        'Apply softmax(z / T) to test-set logits',
        'Report accuracy, NLL and ECE (with a reliability diagram) on the test set',
      ],
      why: String.raw`The validation set is used only to fit $T$; the test set is touched last, so the reported calibration is honest. Fitting $T$ on test data would leak, just as tuning any hyperparameter on test data does.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Calibrated: among predictions with confidence $p$, a fraction $p$ is correct. Check it with reliability diagrams and ECE, alongside proper scores (NLL, Brier).
- Modern deep nets tend to be over-confident (Guo et al., 2017). Temperature scaling $\operatorname{softmax}(\mathbf z/T)$, fitted on validation NLL, fixes much of it without changing accuracy.
- Aleatoric (data noise) vs epistemic (model ignorance) uncertainty; deep ensembles capture the latter.
- Split conformal prediction gives sets with $\ge1-\alpha$ **marginal** coverage for any model, using the $\lceil(n+1)(1-\alpha)\rceil$-th calibration score.
- All of these guarantees assume test data look like calibration data. Shift breaks them.`,
    },
  ],
  references: [
    { authors: 'C. Guo, G. Pleiss, Y. Sun & K. Q. Weinberger', title: 'On Calibration of Modern Neural Networks', year: 2017, venue: 'ICML (PMLR 70)' },
    { authors: 'B. Lakshminarayanan, A. Pritzel & C. Blundell', title: 'Simple and Scalable Predictive Uncertainty Estimation using Deep Ensembles', year: 2017, venue: 'NeurIPS' },
    { authors: 'Y. Ovadia, E. Fertig, J. Ren, Z. Nado, D. Sculley, S. Nowozin, J. V. Dillon, B. Lakshminarayanan & J. Snoek', title: 'Can You Trust Your Model’s Uncertainty? Evaluating Predictive Uncertainty Under Dataset Shift', year: 2019, venue: 'NeurIPS' },
    { authors: 'A. N. Angelopoulos & S. Bates', title: 'A Gentle Introduction to Conformal Prediction and Distribution-Free Uncertainty Quantification', year: 2021, venue: 'arXiv:2107.07511', url: 'https://arxiv.org/abs/2107.07511' },
    { authors: 'V. Vovk, A. Gammerman & G. Shafer', title: 'Algorithmic Learning in a Random World', year: 2005, venue: 'Springer' },
  ],
} satisfies LessonContent;
