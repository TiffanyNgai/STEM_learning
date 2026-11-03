import type { LessonContent } from '../../types';

// A rolled-up sheet: straight-line (Euclidean) vs along-the-sheet (geodesic) distance, then unrolled.
const ROLL_SVG = `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
<text x="80" y="14" font-size="10" text-anchor="middle" fill="var(--fg)">data on a rolled sheet</text>
<text x="240" y="14" font-size="10" text-anchor="middle" fill="var(--fg)">what we want: unrolled</text>
<path d="M80,80 m0,0 a8,8 0 1,1 8,8 a16,16 0 1,1 -16,-16 a28,28 0 1,1 28,28 a40,40 0 1,1 -40,-40 a52,52 0 0,1 52,52" fill="none" stroke="var(--c2)" stroke-width="5" opacity="0.55"/>
<circle cx="88" cy="88" r="4" fill="var(--c3)"/>
<circle cx="100" cy="100" r="4" fill="var(--c5)"/>
<line x1="88" y1="88" x2="100" y2="100" stroke="var(--fg)" stroke-width="1.2" stroke-dasharray="3 2"/>
<text x="6" y="30" font-size="8.5" fill="var(--fg)">dashed: close in 3D…</text>
<path d="M88,88 a16,16 0 1,1 -16,-16 a28,28 0 1,1 28,28" fill="none" stroke="var(--c4)" stroke-width="2" stroke-dasharray="200" stroke-dashoffset="200"><animate attributeName="stroke-dashoffset" values="200;0;0;200" keyTimes="0;0.4;0.8;1" dur="5s" repeatCount="indefinite"/></path>
<text x="80" y="150" font-size="8.5" text-anchor="middle" fill="var(--c4)">…far along the sheet (geodesic)</text>
<path d="M170,80 L300,80" stroke="var(--c2)" stroke-width="5" opacity="0.55"/>
<circle cx="214" cy="80" r="4" fill="var(--c3)"/>
<circle cx="268" cy="80" r="4" fill="var(--c5)"/>
<path d="M214,92 L268,92" stroke="var(--c4)" stroke-width="2"/>
<text x="241" y="106" font-size="8.5" text-anchor="middle" fill="var(--c4)">far apart, as they should be</text>
<text x="240" y="130" font-size="8.5" text-anchor="middle" fill="var(--muted)">PCA would squash the roll flat,</text>
<text x="240" y="142" font-size="8.5" text-anchor="middle" fill="var(--muted)">overlapping its layers</text>
</svg>`;

// Schematic: true geometry vs a typical t-SNE/UMAP picture of it.
const MISREAD_SVG = `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg">
<text x="78" y="14" font-size="10" text-anchor="middle" fill="var(--fg)">true data (schematic)</text>
<text x="242" y="14" font-size="10" text-anchor="middle" fill="var(--fg)">typical embedding</text>
<circle cx="40" cy="70" r="26" fill="var(--c2)" opacity="0.3" stroke="var(--c2)"/>
<circle cx="80" cy="70" r="6" fill="var(--c3)" opacity="0.5" stroke="var(--c3)"/>
<circle cx="130" cy="135" r="10" fill="var(--c4)" opacity="0.35" stroke="var(--c4)"/>
<text x="40" y="108" font-size="8.5" text-anchor="middle" fill="var(--muted)">wide</text>
<text x="80" y="90" font-size="8.5" text-anchor="middle" fill="var(--muted)">tight, close</text>
<text x="118" y="160" font-size="8.5" text-anchor="middle" fill="var(--muted)">very far</text>
<line x1="160" y1="22" x2="160" y2="160" stroke="var(--grid)"/>
<circle cx="205" cy="60" r="16" fill="var(--c2)" opacity="0.3" stroke="var(--c2)"><animate attributeName="r" values="26;16;16;26" keyTimes="0;0.3;0.8;1" dur="6s" repeatCount="indefinite"/></circle>
<circle cx="280" cy="60" r="16" fill="var(--c3)" opacity="0.5" stroke="var(--c3)"><animate attributeName="r" values="6;16;16;6" keyTimes="0;0.3;0.8;1" dur="6s" repeatCount="indefinite"/></circle>
<circle cx="242" cy="128" r="16" fill="var(--c4)" opacity="0.35" stroke="var(--c4)"><animate attributeName="r" values="10;16;16;10" keyTimes="0;0.3;0.8;1" dur="6s" repeatCount="indefinite"/></circle>
<text x="242" y="100" font-size="8.5" text-anchor="middle" fill="var(--c5)">similar sizes, similar gaps</text>
<text x="242" y="160" font-size="8.5" text-anchor="middle" fill="var(--muted)">neighbours kept; sizes and gaps not</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'When flat projections fail',
      body: String.raw`Single-cell biologists measure about 20,000 genes per cell and want a 2D map where similar cells sit together. [PCA](@ml/pca) projects onto the best **flat** plane, but data often lie on a **curved** low-dimensional surface, a **manifold**, inside the high-dimensional space.

Think of a rolled-up sheet of paper (a "Swiss roll"). Two points on neighbouring layers are close in 3D but far apart if you walk along the paper. A flat projection squashes the layers together. **Manifold learning** methods instead try to preserve **neighbourhoods** measured along the surface.`,
      widget: { type: 'SvgDiagram', props: { svg: ROLL_SVG } },
    },
    {
      kind: 'explain',
      title: 'The shared recipe: trust only local distances',
      body: String.raw`In high dimensions, small Euclidean distances are trustworthy (nearby points really are similar), but large ones may cut across the manifold. So most methods:
1. Build a **neighbourhood graph**: connect each point to its $k$ nearest neighbours.
2. Turn it into similarities or distances on the graph.
3. Find low-dimensional points $y_i\in\mathbb R^2$ whose layout matches those relationships.

Early examples: **Isomap** (Tenenbaum et al., 2000) uses shortest-path distances along the graph as stand-ins for geodesic distances; **LLE** (Roweis & Saul, 2000) preserves how each point is reconstructed from its neighbours. Today the most used are **t-SNE** and **UMAP**, which focus on local neighbourhoods.`,
    },
    {
      kind: 'mcq',
      prompt: 'Why do manifold learning methods start from a k-nearest-neighbour graph rather than from all pairwise Euclidean distances?',
      choices: [
        'Short Euclidean distances follow the manifold; long ones can cut across it.',
        'Long distances are too expensive to compute.',
        'Euclidean distance is undefined in high dimensions.',
        'The graph makes the method linear, like PCA.',
      ],
      answer: 0,
      why: 'On a curved surface, a short straight line stays close to the surface, but a long one can jump between layers (like the Swiss roll). Cost is a practical bonus, not the reason. Euclidean distance is always defined, and the resulting methods are nonlinear.',
    },
    {
      kind: 'explain',
      title: 't-SNE, part 1: neighbour probabilities',
      body: String.raw`**t-SNE** (van der Maaten & Hinton, 2008) turns distances into probabilities. In the original space, point $i$ picks $j$ as its neighbour with probability
$$p_{j\mid i}=\frac{\exp(-\|x_i-x_j\|^2/2\sigma_i^2)}{\sum_{k\neq i}\exp(-\|x_i-x_k\|^2/2\sigma_i^2)} .$$
Each $\sigma_i$ is tuned so that the **perplexity** $2^{H(P_i)}$ (where $H$ is the entropy in bits) equals a user-chosen value, typically 5–50. Perplexity is roughly the "effective number of neighbours", so dense regions get small $\sigma_i$ and sparse ones get large $\sigma_i$.

These are symmetrized into joint probabilities $p_{ij}=(p_{j\mid i}+p_{i\mid j})/2n$.`,
    },
    {
      kind: 'explain',
      title: 't-SNE, part 2: heavy tails in the map',
      body: String.raw`In the 2D map, similarities use a **Student-t** kernel with one degree of freedom:
$$q_{ij}=\frac{(1+\|y_i-y_j\|^2)^{-1}}{\sum_{k\neq l}(1+\|y_k-y_l\|^2)^{-1}} .$$
The map points $y_i$ are moved by gradient descent to minimize $\mathrm{KL}(P\,\|\,Q)=\sum_{i\neq j}p_{ij}\log\frac{p_{ij}}{q_{ij}}$ (see [KL divergence](@stats/entropy-kl)).

Why heavy tails? A 2D map has too little room for all the moderately distant neighbours of a high-dimensional point: the **crowding problem**. The t-kernel decays slowly, so moderately dissimilar points can be placed far apart while still getting a reasonable $q_{ij}$. This separates clusters clearly.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['exp(-x^2)', '1/(1+x^2)'],
          x: [0, 4], y: [0, 1.05],
          labels: ['Gaussian exp(−d²)', 'Student-t 1/(1+d²)'],
          xLabel: 'map distance d', yLabel: 'similarity',
        },
        caption: 'At d = 3 the Gaussian similarity is about 0.0001; the t similarity is still 0.1.',
      },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Because t-SNE minimizes $\mathrm{KL}(P\|Q)$, placing two **close** high-dimensional neighbours far apart in the map is penalized much more heavily than placing two **distant** points close together.`,
      answer: true,
      why: String.raw`A pair with large $p_{ij}$ but small $q_{ij}$ contributes $p_{ij}\log(p_{ij}/q_{ij})$, which is large. A pair with tiny $p_{ij}$ contributes almost nothing whatever $q_{ij}$ is. So t-SNE prioritizes keeping neighbours together, i.e. **local** structure, and says little about large-scale layout.`,
    },
    {
      kind: 'explain',
      title: 'UMAP',
      body: String.raw`**UMAP** (McInnes, Healy & Melville, 2018) follows the same recipe with different machinery:
- build a weighted $k$-nearest-neighbour graph (parameter **n_neighbors**), with each point's edge weights scaled by its own local distance scale;
- optimize a 2D layout with a similar graph using a **cross-entropy** objective, which includes a term that pushes non-neighbours apart;
- **min_dist** controls how tightly points may pack in the map.

The authors derive it from Riemannian geometry and fuzzy topology. In practice it is usually faster than exact t-SNE, scales to millions of points, and can embed new points. Its pictures look similar: tight, well-separated clusters.`,
    },
    {
      kind: 'match',
      prompt: 'Match each hyperparameter or ingredient to what it does.',
      pairs: [
        ['t-SNE perplexity', 'Effective number of neighbours per point'],
        ['Student-t kernel in the map', 'Eases crowding by allowing large gaps'],
        ['UMAP n_neighbors', 'Size of the local neighbourhood graph'],
        ['UMAP min_dist', 'How tightly points pack in the embedding'],
      ],
      why: 'Perplexity and n_neighbors both set the local scale: small values emphasize very fine structure, large values broader structure. The heavy-tailed kernel is t-SNE’s answer to crowding; min_dist is a purely visual packing control in UMAP.',
    },
    {
      kind: 'widget',
      title: 'How to misread a t-SNE or UMAP plot',
      body: String.raw`The objectives reward keeping **neighbours together**, not preserving sizes or gaps. As a result (Wattenberg, Viégas & Johnson, 2016):
- **Cluster sizes mean little.** t-SNE adapts $\sigma_i$ to local density, so tight and wide clusters often come out similar in size.
- **Distances between clusters are not meaningful.** Two clusters drawn close may not be more similar than two drawn far apart.
- **Apparent clusters can be artefacts**: at low perplexity, pure random noise can show clumps.
- **Layouts vary** with perplexity, seed and initialization; check several runs.`,
      widget: { type: 'SvgDiagram', props: { svg: MISREAD_SVG } },
    },
    {
      kind: 'multi',
      prompt: 'A UMAP plot of single-cell data shows clusters A, B, C. A and B touch; C is far away; A is twice as wide as C. Which conclusions are justified by the plot alone?',
      choices: [
        'Cells within each cluster tend to be similar to their neighbours in the original space.',
        'A and B are more similar to each other than either is to C.',
        'Cell type A is more heterogeneous than C.',
        'The clusters are worth testing with other methods, e.g. marker genes or clustering in the original space.',
      ],
      answers: [0, 3],
      why: 'Local neighbourhoods are what the embedding tries to preserve, so within-cluster similarity is supported. Gaps between clusters and cluster widths are not reliably preserved, so the A–B closeness and A’s spread are not evidence. Clusters seen in a 2D map are hypotheses to verify in the original space.',
    },
    {
      kind: 'explain',
      title: 'Using these tools responsibly',
      body: String.raw`- Use t-SNE/UMAP for **visual exploration**, not as evidence of distances or density. For quantitative work (clustering, distances) use the original space or a PCA reduction.
- A common pipeline reduces to about 50 dimensions with PCA first (removing noise and speeding up the neighbour search), then embeds in 2D.
- Try several perplexities / n_neighbors values and seeds; trust structure that is **stable**.
- Initialization matters for global layout: starting from PCA coordinates tends to keep more of the coarse arrangement than random starts.
- Neither method gives a reusable "axis": the 2D coordinates have no meaning in themselves, unlike principal components.`,
    },
    {
      kind: 'fill',
      prompt: 'Manifold methods start from a ___ graph. t-SNE minimizes the ___ divergence between neighbour distributions and uses a heavy-tailed ___ kernel in the map. Its plots preserve ___ structure, so distances between clusters should not be interpreted.',
      bank: ['nearest-neighbour', 'KL', 'Student-t', 'local', 'global', 'Gaussian', 'complete', 'Euclidean'],
      answer: ['nearest-neighbour', 'KL', 'Student-t', 'local'],
      why: String.raw`The kNN graph captures trustworthy short distances. t-SNE minimizes $\mathrm{KL}(P\|Q)$ with a Student-t kernel in low dimension to fight crowding. Because the KL heavily punishes separating neighbours but barely punishes other errors, mainly **local** structure survives.`,
    },
    {
      kind: 'order',
      prompt: 'Order a typical t-SNE visualization pipeline.',
      steps: [
        'Standardize features and reduce to ~50 dimensions with PCA',
        String.raw`For each point, set $\sigma_i$ so its neighbour distribution has the chosen perplexity`,
        String.raw`Compute symmetric affinities $p_{ij}$`,
        String.raw`Initialize 2D points and minimize $\mathrm{KL}(P\|Q)$ by gradient descent`,
        'Repeat with other perplexities and seeds and keep only stable conclusions',
      ],
      why: String.raw`Preprocessing comes first; the bandwidths $\sigma_i$ must be fixed before the $p_{ij}$ can be computed; only then is the map optimized. Checking robustness across settings is the last step, since a single run can mislead.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Data often lie near a curved low-dimensional **manifold**; PCA's flat projection can overlap its folds.
- Manifold methods trust only **local** distances, via a nearest-neighbour graph (Isomap, LLE, t-SNE, UMAP).
- **t-SNE**: Gaussian neighbour probabilities set by **perplexity**, Student-t similarities in the map, minimize $\mathrm{KL}(P\|Q)$.
- **UMAP**: weighted kNN graph and a cross-entropy layout objective; fast and scalable, with similar-looking output.
- In both, **cluster sizes and between-cluster distances are not meaningful**, and clusters can be artefacts. Use them for exploration and verify elsewhere.`,
    },
  ],
  references: [
    { authors: 'L. van der Maaten & G. Hinton', title: 'Visualizing Data using t-SNE', year: 2008, venue: 'Journal of Machine Learning Research 9, 2579–2605' },
    { authors: 'L. McInnes, J. Healy & J. Melville', title: 'UMAP: Uniform Manifold Approximation and Projection for Dimension Reduction', year: 2018, venue: 'arXiv:1802.03426', url: 'https://arxiv.org/abs/1802.03426' },
    { authors: 'M. Wattenberg, F. Viégas & I. Johnson', title: 'How to Use t-SNE Effectively', year: 2016, venue: 'Distill', url: 'https://distill.pub/2016/misread-tsne/' },
    { authors: 'J. B. Tenenbaum, V. de Silva & J. C. Langford', title: 'A Global Geometric Framework for Nonlinear Dimensionality Reduction', year: 2000, venue: 'Science 290(5500), 2319–2323' },
    { authors: 'K. P. Murphy', title: 'Probabilistic Machine Learning: An Introduction', year: 2022, venue: 'MIT Press', detail: 'Ch. 20 (Sec. 20.4)', url: 'https://probml.github.io/pml-book/book1.html' },
  ],
} satisfies LessonContent;
