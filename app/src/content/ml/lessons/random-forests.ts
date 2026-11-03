import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'One tree is twitchy; many trees are calm',
      body: String.raw`A deep [decision tree](@ml/decision-trees) has low bias but **high variance**: refit it on a slightly different sample and you get a noticeably different tree. Below, each faint orange curve is a depth-6 regression tree fitted to a different resample of the same data. Each one is jagged and chases noise.

The bold blue curve is their **average**. Slide the number of trees $B$ up: the jitter cancels out and the average settles close to the true curve (dashed). Watch the test MSE fall; the noise variance here is $0.09$, the best any model can do.`,
      widget: { type: 'MlTreeEnsemble1D', props: { mode: 'bagging', rounds: 1 } },
    },
    {
      kind: 'recall',
      title: 'From statistics: the bootstrap',
      points: [
        String.raw`A bootstrap sample draws $n$ points **with replacement** from the $n$ training points.`,
        'Some points appear several times, others not at all.',
        String.raw`The chance a given point is never drawn is $(1-1/n)^n\to e^{-1}\approx0.368$, so each sample contains about 63.2% of the distinct points.`,
        'Repeating a computation over many bootstrap samples imitates drawing fresh datasets from the population.',
      ],
      link: 'stats/bootstrap',
    },
    {
      kind: 'explain',
      title: 'Bagging',
      body: String.raw`**Bagging** (bootstrap aggregating; Breiman 1996): draw $B$ bootstrap samples, fit one model $\hat f_b$ to each, and combine
$$\hat f_{\text{bag}}(\mathbf x)=\frac1B\sum_{b=1}^B\hat f_b(\mathbf x)$$
for regression, or take a **majority vote** of the $B$ classifiers.

Bagging helps unstable, low-bias learners such as deep trees. Each $\hat f_b$ has roughly the same expected value as a single tree, so the bias barely changes, but averaging removes much of the variance. For a stable learner such as linear regression the $\hat f_b$ are nearly identical and bagging gains almost nothing.`,
    },
    {
      kind: 'explain',
      title: 'How much variance does averaging remove?',
      body: String.raw`Suppose each tree's prediction at $\mathbf x$ has variance $\sigma^2$ and any two trees have correlation $\rho$ (they saw overlapping data). The average of $B$ trees has variance
$$\operatorname{Var}\Big(\frac1B\sum_b\hat f_b\Big)=\rho\,\sigma^2+\frac{1-\rho}{B}\,\sigma^2.$$
The second term vanishes as $B$ grows; the first does not. **Correlation sets a floor.** Independent trees ($\rho=0$) would cut variance by $B$; perfectly correlated trees ($\rho=1$) would not help at all.

**Example.** $\sigma^2=1$, $\rho=0.5$, $B=100$: $0.5+0.5/100=0.505$. Doubling to $B=200$ barely helps ($0.5025$). To improve, lower $\rho$.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Each tree has prediction variance $\sigma^2=1$ and pairwise correlation $\rho=0.3$. What is the variance of the average of $B=50$ trees? (3 decimals)`,
      answer: 0.314,
      tolerance: 0.001,
      why: String.raw`$\rho\sigma^2+(1-\rho)\sigma^2/B=0.3+0.7/50=0.3+0.014=0.314$. Treating the trees as independent gives $1/50=0.02$, far too optimistic.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`A bagged ensemble already has $B=500$ trees and the test error has stopped improving. Which change most directly lowers the remaining variance floor $\rho\sigma^2$?`,
      choices: [
        'Make the trees less correlated, e.g. by restricting each split to a random subset of features',
        'Add another 500 trees',
        'Use larger bootstrap samples (more than n points each)',
        'Prune every tree to depth 1',
      ],
      answer: 0,
      why: String.raw`With $B$ already large, only the $\rho\sigma^2$ term remains, so the lever is $\rho$. More trees only shrink the already negligible $(1-\rho)\sigma^2/B$. Bigger resamples make trees more alike (higher $\rho$). Depth-1 stumps lower variance but add a lot of bias.`,
    },
    {
      kind: 'explain',
      title: 'Random forests: decorrelate the trees',
      body: String.raw`If one feature is very strong, every bagged tree splits on it at the root and the trees look alike. **Random forests** (Breiman 2001) add a second source of randomness: at **each split**, only $m$ features chosen at random are candidates.

Common defaults (ESL §15.3): $m=\lfloor\sqrt p\rfloor$ for classification, $m=\lfloor p/3\rfloor$ for regression, with $p$ the number of features. Trees are grown deep and left unpruned, so each is low-bias; the averaging handles variance.

Smaller $m$ lowers the correlation $\rho$ but makes each tree individually weaker (larger $\sigma^2$ and bias). $m$ is the main tuning knob; $m=p$ recovers plain bagging.`,
    },
    {
      kind: 'widget',
      title: 'A forest on 2D data',
      body: String.raw`Each tree uses its own bootstrap sample and picks one of the two features at random for every split ($m=1$). Shading strength shows the **vote margin**: deep colour where nearly all trees agree, pale where they split.

Start with $B=1$: one jagged, axis-aligned tree. Increase $B$: the boundary smooths into a much better approximation of the circle, though every individual tree is still made of boxes. Try **diagonal**: averaging staircases with different step positions gives a near-diagonal boundary.`,
      widget: { type: 'MlTreeSplitter', props: { mode: 'forest', dataset: 'circle', trees: 1, depth: 8 } },
    },
    {
      kind: 'explain',
      title: 'Free validation and feature importance',
      body: String.raw`**Out-of-bag (OOB) error.** About 36.8% of training points are missing from any given bootstrap sample. Predict each point using only the trees that did not see it, and average the errors: an estimate of test error with no separate validation set.

**Feature importance** comes in two kinds:
- **Impurity importance**: total impurity decrease from splits on a feature, summed over all trees. Cheap, but biased toward features with many possible split points (Strobl et al. 2007).
- **Permutation importance**: shuffle one feature's values in the OOB data and measure how much the error rises (Breiman 2001). More reliable, though correlated features can share and hide importance.

Forests need little tuning, handle thousands of features and train in parallel, which is why they remain a strong default for tabular data.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A training set has $n=10$ points. What is the probability that a particular point is left out of one bootstrap sample (so it is out-of-bag for that tree)? (3 decimals)`,
      answer: 0.349,
      tolerance: 0.001,
      why: String.raw`Each of the 10 draws misses the point with probability $0.9$, so $0.9^{10}\approx0.349$. For large $n$ this tends to $e^{-1}\approx0.368$. Answering $0.1$ confuses one draw with the whole sample.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Adding more trees to a random forest eventually makes it overfit, so the number of trees must be tuned like a learning rate.',
      answer: false,
      why: String.raw`More trees only reduce the Monte-Carlo variance of the average; Breiman (2001) showed the generalization error converges as $B\to\infty$. Pick $B$ large enough for the error to stabilize (limited by compute). Overfitting in a forest is controlled by tree depth and $m$, not by $B$. Boosting is different, as the next lesson shows.`,
    },
    {
      kind: 'multi',
      prompt: 'Which statements about random forests are true? Select all that apply.',
      choices: [
        'Each tree is trained on its own bootstrap sample',
        'Each split considers only a random subset of the features',
        'Trees are usually pruned heavily before averaging',
        'Out-of-bag predictions estimate test error without a separate validation set',
        'A forest of 500 trees is as easy to read as a single tree',
      ],
      answers: [0, 1, 3],
      why: String.raw`Bootstrap samples and random feature subsets are the two sources of randomness, and OOB error comes for free. Forest trees are grown deep and unpruned (low bias), and an average of hundreds of trees loses the single tree's readable rules; importance scores are the usual substitute.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps of training a random-forest classifier.',
      steps: [
        String.raw`Choose the number of trees $B$ and the features-per-split $m$`,
        String.raw`For each tree, draw a bootstrap sample of size $n$`,
        String.raw`Grow a deep tree, at each node picking the best split among $m$ randomly chosen features`,
        'Predict a new point by majority vote over all trees',
        'Estimate test error from the out-of-bag votes',
      ],
      why: String.raw`Hyperparameters first; each tree then gets its own resample and its own random feature choices at every node. Prediction aggregates votes; the OOB estimate uses the points each tree never saw.`,
    },
    {
      kind: 'match',
      prompt: 'Match each term to its meaning.',
      pairs: [
        ['Bagging', 'Averaging models fitted to bootstrap resamples'],
        [String.raw`$m$ (mtry)`, 'Number of features considered at each split'],
        ['Out-of-bag error', 'Error on points a tree did not see in training'],
        ['Permutation importance', 'Rise in error when one feature’s values are shuffled'],
      ],
      why: String.raw`Bagging is the averaging; $m$ is the decorrelation knob; OOB points act as a built-in validation set; permutation importance asks how much the model relies on a feature by breaking its link to the target.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Deep trees have low bias and high variance; averaging $B$ of them keeps the bias and cuts the variance.
- Variance of an average: $\rho\sigma^2+(1-\rho)\sigma^2/B$. Correlation $\rho$ is the floor.
- Random forests = bagging + random feature subsets at each split ($m\approx\sqrt p$ for classification), which lowers $\rho$.
- OOB error gives a free test estimate; permutation importance explains which features matter.
- More trees never hurts generalization; depth and $m$ control fit.`,
    },
  ],
  references: [
    { authors: 'L. Breiman', title: 'Random Forests', year: 2001, venue: 'Machine Learning 45(1), 5–32' },
    { authors: 'L. Breiman', title: 'Bagging predictors', year: 1996, venue: 'Machine Learning 24(2), 123–140' },
    { authors: 'T. Hastie, R. Tibshirani & J. Friedman', title: 'The Elements of Statistical Learning', year: 2009, venue: '2nd ed., Springer', detail: 'Ch. 8.7 (bagging), Ch. 15 (random forests)', url: 'https://hastie.su.domains/ElemStatLearn/' },
    { authors: 'C. Strobl, A.-L. Boulesteix, A. Zeileis & T. Hothorn', title: 'Bias in random forest variable importance measures: Illustrations, sources and a solution', year: 2007, venue: 'BMC Bioinformatics 8, 25' },
  ],
} satisfies LessonContent;
