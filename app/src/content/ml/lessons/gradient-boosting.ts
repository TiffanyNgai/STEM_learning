import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Learning from mistakes, one small tree at a time',
      body: String.raw`[Random forests](@ml/random-forests) average many strong trees built **independently**. **Boosting** builds weak learners **in sequence**, each one trained to fix what the ensemble so far still gets wrong.

Below, each round fits a **stump** (a depth-1 tree: one split, two constant values) to the current errors and adds a small multiple of it to the model. Press **+1** a few times and watch the lower panel: the red dots are the residuals the new stump is fitted to, and the purple step is that stump. Then press Play. Dozens of crude stumps add up to a smooth curve.`,
      widget: { type: 'MlTreeEnsemble1D', props: { mode: 'boosting', rounds: 1, depth: 1, lr: 0.3 } },
    },
    {
      kind: 'explain',
      title: 'AdaBoost',
      body: String.raw`The first practical boosting algorithm, **AdaBoost** (Freund & Schapire 1997), works for labels $y_i\in\{-1,+1\}$. Start with equal weights $w_i=1/n$. For $m=1,\dots,M$:
1. Fit a weak classifier $G_m$ to the **weighted** training data.
2. Weighted error: $\text{err}_m=\sum_iw_i\mathbf 1[y_i\ne G_m(\mathbf x_i)]/\sum_iw_i$.
3. Vote weight: $\alpha_m=\ln\frac{1-\text{err}_m}{\text{err}_m}$.
4. Up-weight mistakes: $w_i\leftarrow w_i\,e^{\alpha_m\mathbf 1[y_i\ne G_m(\mathbf x_i)]}$.

Predict with $\operatorname{sign}\sum_m\alpha_mG_m(\mathbf x)$. Hard examples get louder each round. Friedman, Hastie & Tibshirani (2000) showed AdaBoost is stagewise minimization of the **exponential loss** $e^{-yF(\mathbf x)}$, which opened the door to boosting any loss. (Some texts use $\tfrac12\ln$, which only rescales $F$.)`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`In AdaBoost (with $\alpha_m=\ln\frac{1-\text{err}_m}{\text{err}_m}$), a stump has weighted error $\text{err}_m=0.2$. What is its vote weight $\alpha_m$? (3 decimals)`,
      answer: 1.386,
      tolerance: 0.002,
      why: String.raw`$\alpha_m=\ln(0.8/0.2)=\ln4\approx1.386$. Misclassified points' weights are multiplied by $e^{\alpha_m}=4$. A classifier at chance ($\text{err}=0.5$) gets $\alpha=0$; using $\tfrac12\ln$ would give $0.693$.`,
    },
    {
      kind: 'recall',
      title: 'Gradient descent',
      points: [
        String.raw`To minimize $L(\boldsymbol\theta)$, repeat $\boldsymbol\theta\leftarrow\boldsymbol\theta-\eta\nabla L(\boldsymbol\theta)$.`,
        String.raw`The negative gradient is the direction of steepest local decrease.`,
        String.raw`The learning rate $\eta$ trades speed against stability.`,
      ],
      link: 'ml/gradient-descent',
    },
    {
      kind: 'explain',
      title: 'Gradient boosting: descent in function space',
      body: String.raw`Friedman (2001) treated the model's training predictions $F(\mathbf x_1),\dots,F(\mathbf x_n)$ as the parameters. For a loss $\sum_iL(y_i,F(\mathbf x_i))$ the gradient has entries $g_i=\partial L/\partial F(\mathbf x_i)$. A gradient step would set $F(\mathbf x_i)\leftarrow F(\mathbf x_i)-\nu g_i$, but that only moves training points.

So **fit a regression tree $h_m$ to the pseudo-residuals $r_i=-g_i$**: it approximates the negative gradient while generalizing to new inputs. Then (optionally re-optimizing each leaf's value for the loss) update
$$F_m(\mathbf x)=F_{m-1}(\mathbf x)+\nu\,h_m(\mathbf x).$$
For squared loss $\tfrac12(y-F)^2$, $r_i=y_i-F(\mathbf x_i)$: literally fitting the residuals, as in the widget. Mason et al. (2000) independently described boosting as gradient descent.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`For the absolute loss $L(y,F)=|y-F|$, what are the pseudo-residuals $r_i=-\partial L/\partial F(\mathbf x_i)$ that each new tree is fitted to?`,
      choices: [String.raw`$\operatorname{sign}(y_i-F(\mathbf x_i))$`, String.raw`$y_i-F(\mathbf x_i)$`, String.raw`$F(\mathbf x_i)-y_i$`, String.raw`$|y_i-F(\mathbf x_i)|$`],
      answer: 0,
      why: String.raw`$\partial|y-F|/\partial F=-\operatorname{sign}(y-F)$, so the negative gradient is $\operatorname{sign}(y-F)$: each tree only learns the direction of the error, which makes the fit robust to outliers. $y-F$ is the pseudo-residual for squared loss; $F-y$ is the gradient itself, the uphill direction.`,
    },
    {
      kind: 'match',
      prompt: String.raw`Match each loss to its pseudo-residual (negative gradient with respect to $F$).`,
      pairs: [
        [String.raw`Squared: $\tfrac12(y-F)^2$`, String.raw`$y-F$`],
        [String.raw`Absolute: $|y-F|$`, String.raw`$\operatorname{sign}(y-F)$`],
        [String.raw`Log-loss, $y\in\{0,1\}$, $F$ = logit`, String.raw`$y-\sigma(F)$`],
        [String.raw`Exponential: $e^{-yF}$, $y\in\{\pm1\}$`, String.raw`$y\,e^{-yF}$`],
      ],
      why: String.raw`Differentiate each loss in $F$ and flip the sign. The log-loss case is the [logistic regression](@ml/logistic-regression-ml) gradient $p-y$ with the sign flipped; the exponential case recovers AdaBoost's weights $e^{-yF}$.`,
    },
    {
      kind: 'widget',
      title: 'Shrinkage, depth and the number of rounds',
      body: String.raw`Explore the three main knobs:
- **Learning rate $\nu$**: small steps (0.05–0.1) need more rounds but usually generalize better (Friedman 2001). Try $\nu=1$: fast, but the test MSE gets worse sooner.
- **Rounds $M$**: unlike a forest, boosting keeps reducing **training** error and can overfit. Watch test MSE bottom out and rise; choose $M$ by early stopping on validation data.
- **Tree depth**: depth sets how many features can interact (depth $d$ allows $d$-way interactions). ESL suggests trees with roughly 4–8 leaves; stumps give an additive model.

Friedman (2002) also found that fitting each tree on a random half of the data (**stochastic gradient boosting**) helps.`,
      widget: { type: 'MlTreeEnsemble1D', props: { mode: 'boosting', rounds: 40, depth: 3, lr: 0.5 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Squared-loss boosting with stumps and $\nu=0.5$. Data: $(x,y)=(1,1),(2,3),(3,8)$. Start with $F_0=\bar y=4$. The best stump on the residuals splits between $x=2$ and $x=3$. What is $F_1(3)$?`,
      answer: 6,
      tolerance: 0.001,
      why: String.raw`Residuals: $(-3,-1,4)$. The stump's leaves are the means: left $(-3-1)/2=-2$, right $4$. So $F_1(3)=4+0.5\times4=6$ (and $F_1(1)=F_1(2)=4-1=3$). Using $\nu=1$ would give $8$, reproducing that point exactly.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Unlike adding trees to a random forest, running gradient boosting for many more rounds can overfit.',
      answer: true,
      why: String.raw`Each round fits the current training residuals, so training loss keeps falling toward zero and eventually the trees fit noise. That is why $M$ is chosen by early stopping and $\nu$ is kept small. Forest trees are independent draws, so adding them only stabilizes the average.`,
    },
    {
      kind: 'explain',
      title: 'XGBoost and modern libraries',
      body: String.raw`**XGBoost** (Chen & Guestrin 2016) uses a second-order Taylor expansion of the loss: gradients $g_i$ and Hessians $h_i$. It adds a penalty $\gamma T+\tfrac12\lambda\sum_jw_j^2$ on the number of leaves $T$ and the leaf values $w_j$. For a leaf with $G=\sum g_i$ and $H=\sum h_i$ over its points, the best value is
$$w^*=-\frac{G}{H+\lambda},$$
and a split's gain is $\tfrac12\Big[\frac{G_L^2}{H_L+\lambda}+\frac{G_R^2}{H_R+\lambda}-\frac{(G_L+G_R)^2}{H_L+H_R+\lambda}\Big]-\gamma$.

It also handles missing values with learned default directions and uses approximate quantile-based split finding plus cache-aware, parallel code. LightGBM (Ke et al. 2017) and CatBoost (Prokhorenkova et al. 2018) followed. On medium-sized tabular data, tuned gradient-boosted trees still often beat deep networks (Grinsztajn, Oyallon & Varoquaux 2022).`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`In XGBoost, a leaf's points have gradient sum $G=-6$ and Hessian sum $H=4$, with $\lambda=1$. What is the optimal leaf value $w^*=-G/(H+\lambda)$?`,
      answer: 1.2,
      tolerance: 0.001,
      why: String.raw`$w^*=6/(4+1)=1.2$. Without the L2 penalty ($\lambda=0$) it would be the Newton step $1.5$; $\lambda$ shrinks leaf values toward zero, most strongly in leaves with little curvature (few points).`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements correctly contrast random forests with gradient boosting? Select all that apply.',
      choices: [
        'Forest trees can be trained in parallel; boosting trees are built one after another',
        'Forests mainly reduce variance; boosting mainly reduces bias',
        'Boosting typically uses shallow trees; forests use deep ones',
        'Boosting fits every tree to the original targets y',
      ],
      answers: [0, 1, 2],
      why: String.raw`Forests average independent low-bias, high-variance deep trees; boosting adds high-bias shallow trees sequentially, each depending on the previous ones. Only the first tree in gradient boosting sees something close to $y$; later trees fit pseudo-residuals.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps of gradient boosting.',
      steps: [
        String.raw`Initialize with a constant, e.g. $F_0=\arg\min_c\sum_iL(y_i,c)$ (the mean for squared loss)`,
        String.raw`Compute pseudo-residuals $r_i=-\partial L(y_i,F_{m-1}(\mathbf x_i))/\partial F$`,
        String.raw`Fit a small regression tree $h_m$ to the pairs $(\mathbf x_i,r_i)$`,
        String.raw`Update $F_m=F_{m-1}+\nu h_m$`,
        'Repeat until validation loss stops improving (early stopping)',
      ],
      why: String.raw`Each round is one gradient-descent step in function space: compute the negative gradient, approximate it with a tree so it generalizes, take a shrunken step. Early stopping chooses the number of rounds.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Boosting adds weak learners sequentially, each correcting the current ensemble.
- AdaBoost reweights misclassified points; it minimizes the exponential loss stagewise.
- Gradient boosting fits each tree to pseudo-residuals $-\partial L/\partial F$: gradient descent in function space, for any differentiable loss.
- Knobs: learning rate $\nu$ (small), rounds $M$ (early stopping), tree depth (interaction order), subsampling.
- XGBoost adds second-order steps and regularized leaves, $w^*=-G/(H+\lambda)$. Boosted trees remain a top choice for tabular data.`,
    },
  ],
  references: [
    { authors: 'J. H. Friedman', title: 'Greedy function approximation: A gradient boosting machine', year: 2001, venue: 'Annals of Statistics 29(5), 1189–1232' },
    { authors: 'Y. Freund & R. E. Schapire', title: 'A decision-theoretic generalization of on-line learning and an application to boosting', year: 1997, venue: 'Journal of Computer and System Sciences 55(1), 119–139' },
    { authors: 'J. Friedman, T. Hastie & R. Tibshirani', title: 'Additive logistic regression: a statistical view of boosting', year: 2000, venue: 'Annals of Statistics 28(2), 337–407' },
    { authors: 'T. Chen & C. Guestrin', title: 'XGBoost: A Scalable Tree Boosting System', year: 2016, venue: 'Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining, 785–794' },
    { authors: 'T. Hastie, R. Tibshirani & J. Friedman', title: 'The Elements of Statistical Learning', year: 2009, venue: '2nd ed., Springer', detail: 'Ch. 10 (boosting and additive trees; Algorithm 10.1 AdaBoost.M1)', url: 'https://hastie.su.domains/ElemStatLearn/' },
  ],
} satisfies LessonContent;
