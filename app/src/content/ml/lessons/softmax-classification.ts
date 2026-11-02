import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'One score per class',
      body: String.raw`Is the photo a cat, a dog or a bird? With $K$ classes, give each class $k$ its own linear score, its **logit**:
$$z_k=\mathbf w_k^\top\mathbf x+b_k,\qquad k=1,\dots,K,$$
or in one go $\mathbf z=W\mathbf x+\mathbf b$ with one row of $W$ per class. Logits can be any real numbers. We need to turn them into a **probability vector**: entries positive and summing to 1, with bigger logits getting more probability.

Drag the logit sliders and watch the probabilities (bottom) respond. Tap a class to mark it as the true label.`,
      widget: { type: 'MlSoftmaxBars', props: { logits: [2, 1, 0.1], showTemperature: false } },
    },
    {
      kind: 'explain',
      title: 'The softmax function',
      body: String.raw`$$p_k=\operatorname{softmax}(\mathbf z)_k=\frac{e^{z_k}}{\sum_{j=1}^K e^{z_j}}.$$
Exponentiate (makes everything positive), then normalize (makes it sum to 1). Properties:
- order is preserved: the largest logit gets the largest probability;
- **shift invariance**: adding the same constant $c$ to every logit changes nothing, since $e^{z_k+c}/\sum_je^{z_j+c}=e^{z_k}/\sum_je^{z_j}$. Only **differences** of logits matter.

**Example.** $\mathbf z=(2,1,0)$: $e^2\approx7.389$, $e^1\approx2.718$, $e^0=1$, sum $\approx11.107$, so $\mathbf p\approx(0.665,\,0.245,\,0.090)$. It is a "soft" version of picking the maximum.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Logits $\mathbf z=(1,0,0)$. What is the softmax probability $p_1$ of the first class? (3 decimals)`,
      answer: 0.576,
      tolerance: 0.002,
      why: String.raw`$p_1=e^1/(e^1+e^0+e^0)=2.718/4.718\approx0.576$. Normalizing the raw logits instead ($1/1$) or forgetting to exponentiate the zeros (treating $e^0$ as 0) are the common slips.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Adding 10 to every logit changes the softmax probabilities.`,
      answer: false,
      why: String.raw`The factor $e^{10}$ appears in the numerator and in every term of the denominator and cancels. That is why implementations subtract $\max_k z_k$ before exponentiating: same answer, no overflow.`,
    },
    {
      kind: 'explain',
      title: 'Two classes: softmax is the sigmoid',
      body: String.raw`With $K=2$:
$$p_1=\frac{e^{z_1}}{e^{z_1}+e^{z_0}}=\frac1{1+e^{-(z_1-z_0)}}=\sigma(z_1-z_0).$$
So two-class softmax is exactly [logistic regression](@ml/logistic-regression-ml) with logit $z=z_1-z_0$. This also shows that the $K$ weight vectors are **redundant**: only differences $\mathbf w_k-\mathbf w_K$ are identifiable, so you may fix one class's logit at 0 without losing anything. (Statisticians call this the multinomial logit model; it has $(K-1)(d+1)$ free parameters.)`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`A two-class softmax has logits $z_1=3$ and $z_0=1$. What is $p_1$?`,
      choices: ['0.750', '0.881', '0.953', '0.731'],
      answer: 1,
      why: String.raw`$p_1=\sigma(z_1-z_0)=\sigma(2)=1/(1+e^{-2})\approx0.881$. $0.953=\sigma(3)$ ignores $z_0$; $0.75=3/(3+1)$ normalizes the logits without exponentiating; $0.731=\sigma(1)$.`,
    },
    {
      kind: 'widget',
      title: 'Temperature',
      body: String.raw`Divide the logits by a **temperature** $T>0$ before the softmax: $\mathbf p=\operatorname{softmax}(\mathbf z/T)$.
- $T\to0^+$: the largest logit takes all the probability (a hard **argmax**, one-hot).
- $T=1$: the ordinary softmax.
- $T\to\infty$: probabilities flatten toward uniform $1/K$.

Temperature never changes which class ranks first. Uses: sampling text from language models (low $T$ = conservative, high $T$ = diverse), **knowledge distillation** (Hinton et al., 2015), and **temperature scaling** to calibrate confidences (Guo et al., 2017; see [calibration](@ml/calibration-uncertainty)).`,
      widget: { type: 'MlSoftmaxBars', props: { logits: [3, 1.5, 0.5, -1], labels: ['cat', 'dog', 'bird', 'fish'], editable: false, temperature: 1 } },
    },
    {
      kind: 'multi',
      prompt: String.raw`The logits are all different. As the temperature $T\to0^+$, which happen? Select all that apply.`,
      choices: [
        'The probability vector approaches one-hot on the largest logit',
        'The predicted class (argmax) can change',
        'The entropy of the predicted distribution falls toward 0',
        String.raw`All probabilities approach $1/K$`,
      ],
      answers: [0, 2],
      why: String.raw`Dividing by small $T$ magnifies logit gaps, so $\mathbf p$ concentrates on the top class and its entropy goes to 0. Since $\mathbf z/T$ keeps the order of $\mathbf z$, the argmax never changes. Uniform $1/K$ is the $T\to\infty$ limit.`,
    },
    {
      kind: 'widget',
      title: 'Categorical cross-entropy and its gradient',
      body: String.raw`Encode the true class $c$ as a **one-hot** vector $\mathbf y$ ($y_c=1$, others 0). The loss is the negative log-likelihood of the true class:`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`$\ell(\mathbf y,\mathbf p)=-\sum_k y_k\log p_k=-\log p_c$.`,
            String.raw`Plug in softmax: $\;\ell=-z_c+\log\sum_j e^{z_j}$. The second term is the **log-sum-exp**, a smooth maximum of the logits.`,
            String.raw`Differentiate: $\;\dfrac{\partial}{\partial z_k}\log\sum_je^{z_j}=\dfrac{e^{z_k}}{\sum_je^{z_j}}=p_k$, and $\dfrac{\partial(-z_c)}{\partial z_k}=-y_k$.`,
            String.raw`So $\;\nabla_{\mathbf z}\ell=\mathbf p-\mathbf y$: again **prediction − target**.`,
            String.raw`Through $\mathbf z=W\mathbf x+\mathbf b$: $\;\nabla_W\ell=(\mathbf p-\mathbf y)\,\mathbf x^\top$, $\;\nabla_{\mathbf b}\ell=\mathbf p-\mathbf y$. The loss is convex in $(W,\mathbf b)$.`,
          ],
          notes: ['only the true class’s probability matters', 'compute it this way for numerical stability', '', 'with K = 2 this reduces to p − y of logistic regression', 'one outer product per example'],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Logits $\mathbf z=(2,1,0)$ and the true class is the first one. What is the cross-entropy loss $-\log p_1$ (natural log)? (3 decimals)`,
      answer: 0.408,
      tolerance: 0.003,
      why: String.raw`$\ell=-z_1+\log(e^2+e^1+e^0)=-2+\log(11.107)\approx-2+2.408=0.408$, equivalently $-\log(0.665)$. Using $\log_{10}$ would give $0.177$.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Same logits $\mathbf z=(2,1,0)$, so $\mathbf p\approx(0.665,0.245,0.090)$, but now the true class is the **third**. What is $\nabla_{\mathbf z}\ell$?`,
      choices: [
        String.raw`$(0.665,\ 0.245,\ -0.910)$`,
        String.raw`$(-0.665,\ -0.245,\ 0.910)$`,
        String.raw`$(0,\ 0,\ -0.910)$`,
        String.raw`$(0.665,\ 0.245,\ 0.090)$`,
      ],
      answer: 0,
      why: String.raw`$\mathbf p-\mathbf y=(0.665-0,\ 0.245-0,\ 0.090-1)$. A gradient step subtracts this, so it **raises** the true logit and **lowers** the wrong ones in proportion to the probability they stole. $(-0.665,\ -0.245,\ 0.910)$ is the ascent direction; $(0,\ 0,\ -0.910)$ forgets that wrong classes are pushed down too.`,
    },
    {
      kind: 'explain',
      title: 'Decision regions',
      body: String.raw`Predict the class with the largest probability, which is the largest logit. The boundary between classes $j$ and $k$ is where $z_j=z_k$, i.e. $(\mathbf w_j-\mathbf w_k)^\top\mathbf x+(b_j-b_k)=0$: a **hyperplane**. Each class's region is an intersection of half-spaces, hence a **convex** region. So softmax regression is a linear classifier; curved regions need [feature maps](@ml/basis-functions) or a neural network.

In deep learning, the last layer of almost every classifier is exactly this: a linear layer producing logits, then softmax + cross-entropy. Frameworks fuse the two into one function that takes **logits** (not probabilities) for numerical stability.`,
    },
    {
      kind: 'match',
      prompt: 'Match each term to its meaning.',
      pairs: [
        ['Logits', 'Unnormalized real-valued class scores z'],
        ['Softmax', 'Exponentiate and normalize into a probability vector'],
        ['One-hot vector', 'Target with a 1 for the true class and 0 elsewhere'],
        [String.raw`$\log\sum_je^{z_j}$`, 'Log-sum-exp: a smooth maximum of the logits'],
      ],
      why: String.raw`Logits feed softmax, softmax gives $\mathbf p$, the one-hot $\mathbf y$ is what $\mathbf p$ is compared with, and log-sum-exp appears in the loss $\ell=-z_c+\log\sum_je^{z_j}$. Note $\max_j z_j\le\log\sum_je^{z_j}\le\max_jz_j+\log K$.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps of a numerically stable softmax cross-entropy computation for one example with true class c.',
      steps: [
        String.raw`Compute the logits $\mathbf z=W\mathbf x+\mathbf b$`,
        String.raw`Find the largest logit $m=\max_k z_k$`,
        String.raw`Compute $\mathrm{LSE}=m+\log\sum_k e^{z_k-m}$`,
        String.raw`Return the loss $\mathrm{LSE}-z_c$`,
      ],
      why: String.raw`Subtracting $m$ makes every exponent $\le0$, so nothing overflows (shift invariance makes it exact); adding $m$ back restores $\log\sum_ke^{z_k}$. The loss $-\log p_c$ equals $\mathrm{LSE}-z_c$, so we never need to form tiny probabilities and take their log.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Softmax $p_k=e^{z_k}/\sum_je^{z_j}$ turns $K$ logits into probabilities; only logit differences matter.
- $K=2$ softmax = sigmoid of the logit difference, so softmax regression generalizes logistic regression.
- Temperature $T$ sharpens ($T<1$) or flattens ($T>1$) the distribution without changing the ranking.
- Loss: categorical cross-entropy $-\log p_c=\mathrm{LSE}(\mathbf z)-z_c$; gradient $\mathbf p-\mathbf y$.
- Decision regions are convex (intersections of half-spaces). Logistic, softmax and least squares are all special cases of [generalized linear models](@ml/generalized-linear-models).`,
    },
  ],
  references: [
    { authors: 'C. M. Bishop', title: 'Pattern Recognition and Machine Learning', year: 2006, venue: 'Springer', detail: 'Ch. 4.3.4 (multiclass logistic regression)' },
    { authors: 'I. Goodfellow, Y. Bengio & A. Courville', title: 'Deep Learning', year: 2016, venue: 'MIT Press', detail: 'Ch. 6.2.2 (sigmoid and softmax output units)', url: 'https://www.deeplearningbook.org' },
    { authors: 'G. Hinton, O. Vinyals & J. Dean', title: 'Distilling the Knowledge in a Neural Network', year: 2015, venue: 'NIPS 2014 Deep Learning and Representation Learning Workshop; arXiv:1503.02531', url: 'https://arxiv.org/abs/1503.02531' },
    { authors: 'C. Guo, G. Pleiss, Y. Sun & K. Q. Weinberger', title: 'On Calibration of Modern Neural Networks', year: 2017, venue: 'ICML', url: 'https://arxiv.org/abs/1706.04599' },
  ],
} satisfies LessonContent;
