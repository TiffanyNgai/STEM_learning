import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'From scores to probabilities',
      body: String.raw`Is this email spam? We want a **probability** $p=P(y=1\mid\mathbf x)$, not just a yes/no. A linear model gives a **score** (also called a **logit**) $z=\mathbf w^\top\mathbf x+b$, which can be any real number. We squash it into $(0,1)$ with the **sigmoid** (logistic) function
$$\sigma(z)=\frac1{1+e^{-z}},\qquad p=\sigma(\mathbf w^\top\mathbf x+b).$$

Below, one input $x$: slide the weight $w$ (steepness and direction) and bias $b$ (shift). The curve crosses $0.5$ exactly where $z=0$, i.e. at $x=-b/w$.`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['1/(1+exp(-(w*x+b)))', '0.5'], x: [-6, 6], y: [-0.1, 1.1], params: [{ name: 'w', min: -4, max: 4, value: 1, label: 'w' }, { name: 'b', min: -5, max: 5, value: 0, label: 'b' }], xLabel: 'x', yLabel: 'p' },
        caption: String.raw`$p=\sigma(wx+b)$. A large $|w|$ gives a near step; a negative $w$ flips the direction.`,
      },
    },
    {
      kind: 'recall',
      title: 'From statistics: logistic regression',
      points: [
        String.raw`Models a yes/no outcome: $P(y=1\mid\mathbf x)=\sigma(\mathbf w^\top\mathbf x+b)$.`,
        String.raw`Equivalently the **log-odds** are linear: $\log\frac{p}{1-p}=\mathbf w^\top\mathbf x+b$.`,
        String.raw`$e^{w_j}$ is the odds ratio for a one-unit increase in $x_j$, other inputs held fixed.`,
        'Coefficients are fitted by maximum likelihood; there is no closed form.',
      ],
      link: 'stats/logistic-regression',
    },
    {
      kind: 'explain',
      title: 'Sigmoid facts and the decision boundary',
      body: String.raw`Three identities we will use:
- $\sigma(0)=\tfrac12$, and symmetry: $\sigma(-z)=1-\sigma(z)$.
- Derivative: $\sigma'(z)=\sigma(z)\,(1-\sigma(z))$, largest ($\tfrac14$) at $z=0$.
- Inverse: $\sigma^{-1}(p)=\log\frac p{1-p}$, the **logit**.

**Decision boundary.** Predicting class 1 when $p>\tfrac12$ means $z>0$, so the boundary $\{\mathbf x:\mathbf w^\top\mathbf x+b=0\}$ is a **hyperplane** (a line in 2D) with normal vector $\mathbf w$. The signed distance from the boundary is $z/\lVert\mathbf w\rVert$. Scaling $(\mathbf w,b)$ up keeps the boundary but makes probabilities more extreme.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A classifier has $\mathbf w=(2,-1)$ and $b=-1$. What is $p=\sigma(\mathbf w^\top\mathbf x+b)$ for $\mathbf x=(2,1)$? (3 decimals)`,
      answer: 0.881,
      tolerance: 0.002,
      why: String.raw`$z=2\cdot2+(-1)\cdot1-1=2$, so $p=1/(1+e^{-2})\approx0.881$. Reporting $z=2$ itself, or $\sigma(4)=0.982$ (forgetting the bias and the second weight), are the usual slips.`,
    },
    {
      kind: 'explain',
      title: 'The loss: cross-entropy',
      body: String.raw`Treat each label as a coin flip with success probability $p_i$: $P(y_i\mid\mathbf x_i)=p_i^{\,y_i}(1-p_i)^{1-y_i}$. Maximizing the likelihood of all labels equals minimizing the **negative log-likelihood**, the **binary cross-entropy** or **log-loss**:
$$\ell(y,p)=-\big[y\log p+(1-y)\log(1-p)\big].$$
(Natural log throughout.) If $y=1$ the loss is $-\log p$ (curve 1); if $y=0$ it is $-\log(1-p)$ (curve 2). Confident and right costs almost nothing; confident and **wrong** costs without bound. See [loss functions](@ml/loss-functions).`,
      widget: {
        type: 'FunctionPlot',
        props: { fns: ['-log(x)', '-log(1-x)'], x: [0, 1], y: [0, 5], labels: ['y = 1: −log p', 'y = 0: −log(1−p)'], xLabel: 'p', yLabel: 'loss' },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`An email is spam ($y=1$) but the model says $p=0.1$. What is its log-loss $\ell$ (natural log)? (2 decimals)`,
      answer: 2.30,
      tolerance: 0.01,
      why: String.raw`$\ell=-\log(0.1)=\log 10\approx2.30$. Compare $p=0.9$, which costs only $0.105$: a confident mistake is penalized about 22 times more.`,
    },
    {
      kind: 'widget',
      title: 'A beautifully simple gradient',
      body: String.raw`Differentiate the log-loss with respect to the weights, for one example.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`$\ell=-y\log\sigma(z)-(1-y)\log(1-\sigma(z))$ with $z=\mathbf w^\top\mathbf x+b$.`,
            String.raw`Using $\sigma'=\sigma(1-\sigma)$: $\;\dfrac{d}{dz}\log\sigma(z)=1-\sigma(z)$ and $\dfrac{d}{dz}\log(1-\sigma(z))=-\sigma(z)$.`,
            String.raw`So $\dfrac{\partial\ell}{\partial z}=-y(1-\sigma)+(1-y)\sigma=\sigma(z)-y=p-y$.`,
            String.raw`Chain rule through $z=\mathbf w^\top\mathbf x+b$: $\;\nabla_{\mathbf w}\ell=(p-y)\,\mathbf x,\qquad\dfrac{\partial\ell}{\partial b}=p-y$.`,
            String.raw`Average over the data and step downhill: $\mathbf w\leftarrow\mathbf w-\eta\,\frac1n\sum_i(p_i-y_i)\,\mathbf x_i$. Same form as linear regression: **(prediction − target) × input**.`,
          ],
          notes: ['', '', 'the σ′ factors cancel: the payoff of pairing sigmoid with log-loss', '', 'no closed form, so iterate (gradient descent or Newton’s method)'],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`For one example with label $y\in\{0,1\}$ and prediction $p=\sigma(\mathbf w^\top\mathbf x+b)$, what is $\nabla_{\mathbf w}$ of the log-loss?`,
      choices: [
        String.raw`$(p-y)\,\mathbf x$`,
        String.raw`$(y-p)\,\mathbf x$`,
        String.raw`$(p-y)\,p(1-p)\,\mathbf x$`,
        String.raw`$\dfrac{p-y}{p(1-p)}\,\mathbf x$`,
      ],
      answer: 0,
      why: String.raw`The $\sigma'=p(1-p)$ factor from the chain rule cancels against the $1/p$ and $1/(1-p)$ from the logs. $(p-y)\,p(1-p)\,\mathbf x$ is the gradient of **squared error** $\tfrac12(p-y)^2$ through a sigmoid; $(y-p)\,\mathbf x$ has the sign flipped (that is the ascent direction).`,
    },
    {
      kind: 'explain',
      title: 'Why not squared error?',
      body: String.raw`We could fit $p=\sigma(z)$ by minimizing $(p-y)^2$, but:
- Its gradient $(p-y)\,p(1-p)\,\mathbf x$ **vanishes** when the model is confidently wrong ($p\approx0$ while $y=1$), so learning stalls exactly when it should be fastest.
- As a function of $\mathbf w$ it is **not convex**, so it can have flat regions and poor local minima.

The log-loss, as a function of $(\mathbf w,b)$, **is convex**: its Hessian $\frac1n\sum_i p_i(1-p_i)\,\mathbf x_i\mathbf x_i^\top$ is positive semidefinite. So any minimum gradient descent finds is a global one. The same sigmoid + log-loss pairing is the standard output layer of binary [neural-network](@ml/neural-networks-intro) classifiers (though the whole network is no longer convex in its weights).`,
    },
    {
      kind: 'widget',
      title: 'Watch it learn',
      body: String.raw`Logistic regression trained live by gradient descent (with momentum) on 2D points. Colour shows $p(y=1\mid\mathbf x)$. With **hidden width 0**, this network *is* logistic regression, so its boundary is always a straight line.

Press **Play** on the "linear" data, then switch to "circle" or "xor" and keep width 0: no line can separate them. Feature maps ([basis functions](@ml/basis-functions)) or hidden layers are needed.`,
      widget: { type: 'NeuralNetPlayground', props: { dataset: 'linear', hidden: 0, lr: 0.5, showNetwork: true } },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`If the training data are perfectly linearly separable, unregularized logistic regression has a finite maximum-likelihood solution.`,
      answer: false,
      why: String.raw`If some $(\mathbf w,b)$ separates the classes, scaling it by $c\to\infty$ pushes every $p_i$ toward the correct 0 or 1, so the log-loss keeps falling toward 0 but never reaches it. The weights diverge; L2 regularization or early stopping keeps them finite.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about logistic regression are true? Select all that apply.',
      choices: [
        String.raw`The set of inputs where $p=0.5$ is the hyperplane $\mathbf w^\top\mathbf x+b=0$`,
        String.raw`Doubling both $\mathbf w$ and $b$ leaves the decision boundary unchanged but makes predictions more confident`,
        String.raw`Using features $\boldsymbol\phi(\mathbf x)$ instead of $\mathbf x$ lets the boundary be curved in the original inputs`,
        String.raw`For extreme inputs the predicted $p$ can exceed 1`,
      ],
      answers: [0, 1, 2],
      why: String.raw`$p=\tfrac12\iff z=0$, a hyperplane; scaling $(\mathbf w,b)$ by 2 keeps $z=0$ in place but doubles $|z|$ elsewhere; a hyperplane in $\boldsymbol\phi$-space can be a curve in $\mathbf x$-space. But $\sigma$ maps into $(0,1)$, so $p$ never exceeds 1 (unlike a linear-regression "probability").`,
    },
    {
      kind: 'match',
      prompt: 'Match each quantity to its meaning.',
      pairs: [
        [String.raw`$z=\mathbf w^\top\mathbf x+b$`, 'Logit: the log-odds of class 1'],
        [String.raw`$\sigma(z)$`, 'Predicted probability of class 1'],
        [String.raw`$-\log p$ when $y=1$`, 'Log-loss of one positive example'],
        [String.raw`$p-y$`, 'Derivative of the log-loss with respect to z'],
      ],
      why: String.raw`The linear score is the log-odds; the sigmoid turns it into a probability; the negative log-probability of the true label is the loss; and its derivative with respect to the score is simply the error $p-y$.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`Logistic regression passes a linear score through the ___ function and is trained by minimizing the ___ loss, which is ___ in the weights, so gradient descent cannot get stuck in a bad local minimum.`,
      bank: ['sigmoid', 'cross-entropy', 'convex', 'softmax', 'squared', 'concave', 'ReLU'],
      answer: ['sigmoid', 'cross-entropy', 'convex'],
      why: String.raw`Sigmoid + cross-entropy (log-loss) is the matched pair: the loss is convex in $(\mathbf w,b)$, and its gradient is $(p-y)\mathbf x$. Squared error through a sigmoid is non-convex; softmax is the multiclass generalization.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Logistic regression: $p=\sigma(\mathbf w^\top\mathbf x+b)$; the logit $z$ is the log-odds.
- Decision boundary $\mathbf w^\top\mathbf x+b=0$ is a hyperplane; $\lVert\mathbf w\rVert$ sets how sharply $p$ changes across it.
- Loss = binary cross-entropy = Bernoulli negative log-likelihood; it is convex in the weights.
- Gradient $(p-y)\mathbf x$: prediction minus target times input, the same form as linear regression.
- Separable data make the weights diverge without regularization.
- Next: more than two classes with [softmax](@ml/softmax-classification).`,
    },
  ],
  references: [
    { authors: 'C. M. Bishop', title: 'Pattern Recognition and Machine Learning', year: 2006, venue: 'Springer', detail: 'Ch. 4.3.2 (logistic regression), 4.3.3 (IRLS)' },
    { authors: 'K. P. Murphy', title: 'Probabilistic Machine Learning: An Introduction', year: 2022, venue: 'MIT Press', detail: 'Ch. 10', url: 'https://probml.github.io/pml-book/book1.html' },
    { authors: 'T. Hastie, R. Tibshirani & J. Friedman', title: 'The Elements of Statistical Learning', year: 2009, venue: '2nd ed., Springer', detail: 'Ch. 4.4', url: 'https://hastie.su.domains/ElemStatLearn/' },
    { authors: 'D. R. Cox', title: 'The regression analysis of binary sequences', year: 1958, venue: 'Journal of the Royal Statistical Society, Series B 20(2), 215–242' },
  ],
} satisfies LessonContent;
