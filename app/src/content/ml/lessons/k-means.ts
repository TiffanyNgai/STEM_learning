import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Structure without labels',
      body: String.raw`A shop has a million customers and no labels: nobody has told it which customers are "bargain hunters" or "big spenders". Can it still find groups of customers who behave alike?

This is **unsupervised learning**: the data are just inputs $x_1,\dots,x_n$, with no targets $y$. The simplest task is **clustering**: split the points into groups so that points in the same group are close together.

**k-means** is the most widely used clustering method. You choose the number of clusters $k$ in advance. Each cluster is summarized by one point, its **centroid** (centre).`,
    },
    {
      kind: 'explain',
      title: 'The objective: within-cluster sum of squares',
      body: String.raw`Give each point $x_i\in\mathbb R^d$ a cluster label $c(i)\in\{1,\dots,k\}$ and give each cluster a centroid $\mu_j$. k-means looks for labels and centroids that minimize
$$J=\sum_{i=1}^n \big\|x_i-\mu_{c(i)}\big\|^2 ,$$
the **within-cluster sum of squares** (WCSS): the total squared distance from each point to its own centroid.

Example in 1D: points $1,2,3$ in one cluster (centroid 2) and $10,11,12$ in another (centroid 11). Then $J=(1+0+1)+(1+0+1)=4$.

Small $J$ means tight clusters. Note that $J$ always drops as $k$ grows, and reaches 0 when every point is its own cluster, so $J$ alone cannot choose $k$.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`1D points $1, 3$ form cluster A and $8, 10, 12$ form cluster B. Each centroid is its cluster's mean. What is $J$?`,
      answer: 10,
      tolerance: 0.001,
      why: String.raw`Centroids are $2$ and $10$. Cluster A contributes $1^2+1^2=2$, cluster B contributes $2^2+0^2+2^2=8$, so $J=10$. A common slip is to sum distances rather than **squared** distances, which gives 6.`,
    },
    {
      kind: 'explain',
      title: "Lloyd's algorithm: two easy half-problems",
      body: String.raw`Minimizing $J$ over labels and centroids together is hard. Fixing one and solving for the other is easy:

1. **Assign** (centroids fixed): put each point in the cluster of its **nearest** centroid. No other choice of labels can give a smaller $J$.
2. **Update** (labels fixed): move each centroid to the **mean** of its points. The mean is the point that minimizes the sum of squared distances to a set of points.

Repeat until the assignments stop changing. This is **Lloyd's algorithm** (Lloyd's 1957 Bell Labs note, published 1982). It is **coordinate descent**: each half-step minimizes $J$ over one block of variables, so $J$ never increases.`,
    },
    {
      kind: 'widget',
      title: 'Step through Lloyd’s algorithm',
      body: String.raw`Press **Step** to alternate the two half-steps. Shading shows which centroid is nearest to each spot (the **Voronoi** cells). Watch $J$: it never goes up.

When a run converges, its final $J$ is listed. Now press **New seed** a few times and run again. With random initialization, some runs end with two centroids sharing one blob and one centroid stuck between two blobs. That is a **local optimum** with a clearly higher $J$. Then switch to **k-means++** and compare over several seeds: it gets stuck much less often, though not never.`,
      widget: { type: 'MlKMeans', props: { k: 4, dataset: 'blobs', init: 'random', seed: 3 } },
    },
    {
      kind: 'order',
      prompt: "Put one run of Lloyd's algorithm in order.",
      steps: [
        String.raw`Choose $k$ and initialize $k$ centroids (e.g. $k$ random data points)`,
        'Assign every point to its nearest centroid',
        'Move every centroid to the mean of the points assigned to it',
        'Repeat assign and update until no point changes cluster',
        String.raw`Report the clusters and the final $J$ (and compare across restarts)`,
      ],
      why: 'Initialization comes first. The two half-steps alternate, assign then update, and the loop stops when an assignment step changes nothing. Because the result depends on the start, practitioners rerun from several seeds and keep the lowest J.',
    },
    {
      kind: 'mcq',
      prompt: String.raw`Centroids sit at $\mu_1=(0,0)$ and $\mu_2=(4,0)$. Points $(1,0)$, $(3,1)$ and $(5,0)$ are assigned and then the centroids are updated. Where does $\mu_2$ move?`,
      choices: [String.raw`$(4,\,0.5)$`, String.raw`$(3,\,1/3)$`, String.raw`$(4,\,0)$, it stays put`, String.raw`$(5,\,0)$`],
      answer: 0,
      why: String.raw`Squared distances: $(1,0)$ is 1 from $\mu_1$ and 9 from $\mu_2$, so it joins cluster 1. $(3,1)$ is 10 from $\mu_1$ and 2 from $\mu_2$, and $(5,0)$ is 25 vs 1, so both join cluster 2. The new $\mu_2$ is their mean, $((3+5)/2,(1+0)/2)=(4,0.5)$. The answer $(3,1/3)$ wrongly averages all three points.`,
    },
    {
      kind: 'explain',
      title: 'Convergence, but only to a local optimum',
      body: String.raw`There are finitely many ways to assign $n$ points to $k$ clusters, and $J$ strictly decreases whenever the labels change. So Lloyd's algorithm **always stops** after finitely many steps. In practice it usually takes few iterations.

But it stops at a **local** optimum: no single half-step can improve $J$, yet a quite different clustering may have much lower $J$. Finding the global minimum of $J$ is NP-hard in general.

Standard fixes:
- **Restarts**: run from many seeds and keep the lowest $J$.
- **Better seeding**, such as k-means++ (next card).`,
    },
    {
      kind: 'explain',
      title: 'k-means++ seeding',
      body: String.raw`Random seeds often land two centroids in the same cluster. **k-means++** (Arthur & Vassilvitskii, 2007) spreads them out:

1. Pick the first centroid uniformly at random from the data.
2. For every point compute $D(x)$, the distance to the **nearest centroid chosen so far**.
3. Pick the next centroid with probability proportional to $D(x)^2$.
4. Repeat until there are $k$ centroids, then run Lloyd's algorithm as usual.

Far-away points are much more likely to be picked. Arthur and Vassilvitskii proved that the seeding alone gives an expected $J$ within a factor $O(\log k)$ of the optimum. It is the default in libraries such as scikit-learn.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`k-means++ on 1D points $0, 1, 4, 10$. The first centroid is $0$. What is the probability that the second centroid is the point $10$? (3 decimals)`,
      answer: 0.855,
      tolerance: 0.002,
      why: String.raw`Squared distances to the nearest chosen centroid are $0, 1, 16, 100$, summing to 117. So $P(10)=100/117\approx0.855$. With plain distances (not squared) it would be $10/15\approx0.667$; squaring is what makes far points so likely.`,
    },
    {
      kind: 'explain',
      title: 'What k-means assumes',
      body: String.raw`Because each point goes to its nearest centroid, the clusters are always **convex** regions separated by straight boundaries (the Voronoi cells). k-means works best when clusters are roughly round, of similar size and similar spread.

It struggles with:
- **elongated or curved** clusters (two interleaved moons get cut straight across);
- clusters of very **different sizes or spreads**, where the boundary sits halfway between centroids and slices off part of the big cluster;
- features on **different scales**: Euclidean distance is dominated by the largest-scale feature, so standardize first.

[Gaussian mixtures](@ml/gmm-em) relax several of these assumptions.`,
    },
    {
      kind: 'widget',
      title: 'Where k-means fails',
      body: String.raw`Two crescent "moons" with $k=2$. Run Lloyd's algorithm to convergence. Whatever the seed, the boundary is a straight line, so each cluster mixes a large part of one moon with a chunk of the other. Here a low $J$ does not mean the clusters are the "real" groups.`,
      widget: { type: 'MlKMeans', props: { k: 2, dataset: 'moons', init: 'kmeans++', seed: 1, controls: false } },
    },
    {
      kind: 'multi',
      prompt: "Which statements about Lloyd's algorithm are true?",
      choices: [
        String.raw`The objective $J$ never increases from one half-step to the next.`,
        'It always finds the clustering with the globally smallest J.',
        'It terminates after a finite number of iterations.',
        'Different initial centroids can lead to different final clusterings.',
        String.raw`Increasing $k$ can never lower the best achievable $J$.`,
      ],
      answers: [0, 2, 3],
      why: String.raw`Each half-step exactly minimizes $J$ over one block of variables, so $J$ is non-increasing, and since there are finitely many labelings it must stop. It only reaches a local optimum, which is why different seeds give different answers. Larger $k$ can always lower (never raise) the best $J$, down to 0 at $k=n$.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`If one feature is measured in metres and another in millimetres, k-means will mostly ignore the feature in metres unless the data are rescaled.`,
      answer: true,
      why: String.raw`The same physical spread is 1000 times larger in millimetres, and squared distances are dominated by the coordinate with the largest numerical spread. Standardizing each feature (zero mean, unit variance) puts them on an equal footing.`,
    },
    {
      kind: 'match',
      prompt: 'Match each term to its meaning.',
      pairs: [
        ['Centroid', 'Mean of the points in a cluster'],
        ['Assignment step', 'Each point joins its nearest centroid'],
        ['WCSS / J', 'Sum of squared distances to own centroid'],
        ['k-means++', 'Seeding by sampling ∝ squared distance'],
        ['Local optimum', 'No half-step improves J, but better clusterings exist'],
      ],
      why: 'These are the moving parts of k-means: an objective (J), two alternating steps (assignment and centroid update), a seeding rule (k-means++) and the reason restarts are needed (local optima).',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- k-means minimizes the within-cluster sum of squares $J=\sum_i\|x_i-\mu_{c(i)}\|^2$ for a fixed $k$.
- **Lloyd's algorithm** alternates *assign to nearest centroid* and *move centroid to the mean*. It is coordinate descent, so $J$ never increases and it always terminates.
- It finds a **local** optimum. Use several restarts and **k-means++** seeding ($D^2$ sampling).
- Clusters are convex Voronoi cells: k-means suits round, similar-sized clusters, and needs standardized features.
- $J$ always decreases with $k$, so choose $k$ with other tools (elbow plots, silhouette, or a probabilistic model with a penalty).`,
    },
  ],
  references: [
    { authors: 'S. P. Lloyd', title: 'Least squares quantization in PCM', year: 1982, venue: 'IEEE Transactions on Information Theory 28(2), 129–137' },
    { authors: 'D. Arthur & S. Vassilvitskii', title: 'k-means++: The Advantages of Careful Seeding', year: 2007, venue: 'Proceedings of the 18th Annual ACM-SIAM Symposium on Discrete Algorithms (SODA), 1027–1035' },
    { authors: 'C. M. Bishop', title: 'Pattern Recognition and Machine Learning', year: 2006, venue: 'Springer', detail: 'Sec. 9.1' },
    { authors: 'T. Hastie, R. Tibshirani & J. Friedman', title: 'The Elements of Statistical Learning', year: 2009, venue: '2nd ed., Springer', detail: 'Sec. 14.3.6', url: 'https://hastie.su.domains/ElemStatLearn/' },
  ],
} satisfies LessonContent;
