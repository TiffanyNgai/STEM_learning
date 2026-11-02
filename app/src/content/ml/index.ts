import type { Reference, Subject } from '../types';

// ---- Shared references -----------------------------------------------------
const PRML: Reference = { authors: 'C. M. Bishop', title: 'Pattern Recognition and Machine Learning', year: 2006, venue: 'Springer' };
const BB: Reference = { authors: 'C. M. Bishop & H. Bishop', title: 'Deep Learning: Foundations and Concepts', year: 2024, venue: 'Springer', url: 'https://www.bishopbook.com' };
const PML1: Reference = { authors: 'K. P. Murphy', title: 'Probabilistic Machine Learning: An Introduction', year: 2022, venue: 'MIT Press', url: 'https://probml.github.io/pml-book/book1.html' };
const PML2: Reference = { authors: 'K. P. Murphy', title: 'Probabilistic Machine Learning: Advanced Topics', year: 2023, venue: 'MIT Press', url: 'https://probml.github.io/pml-book/book2.html' };
const GBC: Reference = { authors: 'I. Goodfellow, Y. Bengio & A. Courville', title: 'Deep Learning', year: 2016, venue: 'MIT Press', url: 'https://www.deeplearningbook.org' };
const UDL: Reference = { authors: 'S. J. D. Prince', title: 'Understanding Deep Learning', year: 2023, venue: 'MIT Press', url: 'https://udlbook.github.io/udlbook/' };
const SB: Reference = { authors: 'R. S. Sutton & A. G. Barto', title: 'Reinforcement Learning: An Introduction', year: 2018, venue: '2nd ed., MIT Press', url: 'http://incompleteideas.net/book/the-book-2nd.html' };
const ESL: Reference = { authors: 'T. Hastie, R. Tibshirani & J. Friedman', title: 'The Elements of Statistical Learning', year: 2009, venue: '2nd ed., Springer', url: 'https://hastie.su.domains/ElemStatLearn/' };
const BOYD: Reference = { authors: 'S. Boyd & L. Vandenberghe', title: 'Convex Optimization', year: 2004, venue: 'Cambridge University Press', url: 'https://web.stanford.edu/~boyd/cvxbook/' };
const SSBD: Reference = { authors: 'S. Shalev-Shwartz & S. Ben-David', title: 'Understanding Machine Learning: From Theory to Algorithms', year: 2014, venue: 'Cambridge University Press' };

const with_ = (r: Reference, detail: string): Reference => ({ ...r, detail });

export default {
  id: 'ml',
  name: 'Machine Learning',
  emoji: '🤖',
  color: '#ff4b4b',
  tagline: 'From linear models to diffusion, transformers and reinforcement learning',
  description: String.raw`A research-level tour of machine learning built on top of probability, statistics and linear algebra. You will learn **how models learn** (optimization, generalization), **what they compute** (neural nets, transformers, graph and equivariant networks), and two research frontiers in depth: **generative modeling** (VAEs, GANs, flows, diffusion, flow matching) and **reinforcement learning** (MDPs, Q-learning, policy gradients, PPO, RLHF).

By the end you should be able to read a modern NeurIPS/ICLR paper, reproduce its key equations, and know which classical idea it builds on.`,
  units: [
    // 1 -----------------------------------------------------------------------
    {
      id: 'ml-foundations',
      title: 'What is machine learning?',
      summary: 'Learning from data as optimization over a hypothesis class; losses, risk and evaluation.',
      references: [with_(PML1, 'Ch. 1, 4–5'), with_(PRML, 'Ch. 1'), with_(SSBD, 'Ch. 2')],
      lessons: [
        { id: 'ml-framing', title: 'The ML framing', summary: 'Data, model, loss, optimizer: supervised, unsupervised and reinforcement learning.', prereqs: ['stats/probability-basics'] },
        { id: 'empirical-risk-minimization', title: 'Empirical risk minimization', summary: 'True risk vs training risk, hypothesis classes and why minimizing training error is not enough.', prereqs: ['stats/expectation-variance'] },
        { id: 'loss-functions', title: 'Loss functions', summary: 'Squared, absolute, cross-entropy, hinge losses and the probabilistic models they imply.', prereqs: ['stats/maximum-likelihood'] },
        { id: 'evaluation-data-splits', title: 'Evaluation & data splits', summary: 'Train/validation/test, leakage, metrics (accuracy, precision/recall, ROC-AUC).' },
        { id: 'probabilistic-view', title: 'The probabilistic view', summary: 'Learning as MLE/MAP; the likelihood as the loss; priors as regularizers.', prereqs: ['stats/maximum-likelihood', 'stats/bayesian-inference'] },
      ],
    },
    // 2 -----------------------------------------------------------------------
    {
      id: 'linear-models',
      title: 'Linear models',
      summary: 'Least squares, logistic and softmax regression, basis functions — the building blocks of every neural net.',
      references: [with_(PRML, 'Ch. 3–4'), with_(PML1, 'Ch. 10–11'), with_(ESL, 'Ch. 3–4')],
      lessons: [
        { id: 'linear-regression-ml', title: 'Linear regression as learning', summary: 'Normal equations, geometry of projections, gradient view.', prereqs: ['stats/linear-regression', 'math/vectors-matrices'] },
        { id: 'basis-functions', title: 'Basis functions & feature maps', summary: 'Polynomial and RBF features: linear in parameters, nonlinear in inputs.' },
        { id: 'logistic-regression-ml', title: 'Logistic regression & cross-entropy', summary: 'Sigmoid, log-loss, convexity and decision boundaries.', prereqs: ['stats/logistic-regression'] },
        { id: 'softmax-classification', title: 'Softmax & multiclass classification', summary: 'Softmax, logits, temperature and the categorical cross-entropy.' },
        { id: 'generalized-linear-models', title: 'Generalized linear models', summary: 'Exponential families and canonical links unify regression and classification.' },
      ],
    },
    // 3 -----------------------------------------------------------------------
    {
      id: 'optimization',
      title: 'Optimization for ML',
      summary: 'Gradient descent and its stochastic, momentum and adaptive variants; convexity and conditioning.',
      references: [with_(BOYD, 'Ch. 3, 9'), with_(GBC, 'Ch. 4, 8'), with_(UDL, 'Ch. 6'), { authors: 'D. P. Kingma & J. Ba', title: 'Adam: A Method for Stochastic Optimization', year: 2015, venue: 'ICLR', url: 'https://arxiv.org/abs/1412.6980' }],
      lessons: [
        { id: 'gradient-descent', title: 'Gradient descent', summary: 'Follow the negative gradient; learning rate, conditioning, divergence.', prereqs: ['math/vectors-matrices'] },
        { id: 'convexity', title: 'Convexity', summary: 'Convex sets and functions, global optima, strong convexity and smoothness.', prereqs: ['ml/gradient-descent'] },
        { id: 'sgd-minibatch', title: 'Stochastic gradient descent', summary: 'Mini-batches, gradient noise, unbiasedness and step-size decay.', prereqs: ['ml/gradient-descent'] },
        { id: 'momentum-methods', title: 'Momentum & Nesterov', summary: 'Heavy-ball dynamics damp oscillations in ill-conditioned valleys.', prereqs: ['ml/gradient-descent'] },
        { id: 'adaptive-optimizers', title: 'Adaptive optimizers: AdaGrad, RMSProp, Adam', summary: 'Per-coordinate step sizes, bias correction, AdamW and decoupled weight decay.', prereqs: ['ml/momentum-methods'] },
        { id: 'learning-rate-schedules', title: 'Learning-rate schedules', summary: 'Warmup, cosine decay, and why schedules matter at scale.', prereqs: ['ml/sgd-minibatch'] },
        { id: 'second-order-methods', title: 'Second-order & natural gradient', summary: 'Newton, quasi-Newton, Gauss–Newton and Fisher-information preconditioning.', prereqs: ['ml/convexity', 'math/eigenvalues'] },
      ],
    },
    // 4 -----------------------------------------------------------------------
    {
      id: 'generalization',
      title: 'Generalization & regularization',
      summary: 'Why models that fit training data can fail on new data, and what we do about it.',
      references: [with_(ESL, 'Ch. 7'), with_(SSBD, 'Ch. 4–6'), with_(UDL, 'Ch. 8–9'), { authors: 'M. Belkin, D. Hsu, S. Ma & S. Mandal', title: 'Reconciling modern machine-learning practice and the classical bias–variance trade-off', year: 2019, venue: 'PNAS 116(32)' }],
      lessons: [
        { id: 'generalization-bias-variance', title: 'Bias–variance trade-off', summary: 'Decomposing test error; under- and over-fitting.', prereqs: ['ml/empirical-risk-minimization', 'stats/expectation-variance'] },
        { id: 'regularization', title: 'Regularization: L2, L1, early stopping', summary: 'Ridge, lasso, weight decay and their Bayesian (MAP) interpretations.', prereqs: ['ml/generalization-bias-variance'] },
        { id: 'cross-validation', title: 'Cross-validation & model selection', summary: 'k-fold CV, hyperparameter search, nested CV.', prereqs: ['ml/evaluation-data-splits'] },
        { id: 'pac-learning-vc', title: 'PAC learning & VC dimension', summary: 'Uniform convergence bounds and capacity.', prereqs: ['ml/empirical-risk-minimization'] },
        { id: 'double-descent', title: 'Double descent & implicit regularization', summary: 'Why huge over-parameterized nets still generalize.', prereqs: ['ml/generalization-bias-variance'] },
        { id: 'calibration-uncertainty', title: 'Calibration & uncertainty', summary: 'Reliability diagrams, temperature scaling, ensembles and conformal prediction.', prereqs: ['ml/evaluation-data-splits'] },
      ],
    },
    // 5 -----------------------------------------------------------------------
    {
      id: 'kernels-trees',
      title: 'Kernels, SVMs, trees & ensembles',
      summary: 'Classical nonparametric workhorses that still win on tabular data.',
      references: [with_(PRML, 'Ch. 6–7, 14'), with_(ESL, 'Ch. 9–10, 12, 15'), { authors: 'C. E. Rasmussen & C. K. I. Williams', title: 'Gaussian Processes for Machine Learning', year: 2006, venue: 'MIT Press', url: 'http://gaussianprocess.org/gpml/' }, { authors: 'T. Chen & C. Guestrin', title: 'XGBoost: A Scalable Tree Boosting System', year: 2016, venue: 'KDD' }],
      lessons: [
        { id: 'kernel-trick', title: 'The kernel trick', summary: 'Inner products in feature space without computing features; Mercer kernels.', prereqs: ['ml/basis-functions'] },
        { id: 'svms', title: 'Support vector machines', summary: 'Max-margin classification, hinge loss and duality.', prereqs: ['ml/kernel-trick', 'ml/convexity'] },
        { id: 'gaussian-processes', title: 'Gaussian processes', summary: 'Distributions over functions; posterior mean and uncertainty.', prereqs: ['ml/kernel-trick', 'stats/normal-distribution'] },
        { id: 'rkhs', title: 'Reproducing kernel Hilbert spaces', summary: 'The representer theorem and kernel ridge regression.', prereqs: ['ml/kernel-trick', 'math/hilbert-spaces'] },
        { id: 'decision-trees', title: 'Decision trees', summary: 'Greedy splitting by impurity (Gini, entropy) and pruning.', prereqs: ['stats/entropy-kl'] },
        { id: 'random-forests', title: 'Bagging & random forests', summary: 'Averaging decorrelated trees reduces variance.', prereqs: ['ml/decision-trees', 'stats/bootstrap'] },
        { id: 'gradient-boosting', title: 'Boosting & gradient boosting', summary: 'AdaBoost and gradient boosting as functional gradient descent.', prereqs: ['ml/decision-trees', 'ml/gradient-descent'] },
      ],
    },
    // 6 -----------------------------------------------------------------------
    {
      id: 'unsupervised',
      title: 'Unsupervised learning',
      summary: 'Finding structure without labels: clustering, dimensionality reduction, mixtures and EM.',
      references: [with_(PRML, 'Ch. 9, 12'), with_(PML1, 'Ch. 20–21'), { authors: 'L. van der Maaten & G. Hinton', title: 'Visualizing Data using t-SNE', year: 2008, venue: 'JMLR 9' }],
      lessons: [
        { id: 'k-means', title: 'k-means clustering', summary: 'Lloyd’s algorithm as coordinate descent on within-cluster variance.' },
        { id: 'pca', title: 'Principal component analysis', summary: 'Max-variance projections via eigenvectors / SVD.', prereqs: ['math/eigenvalues'] },
        { id: 'gmm-em', title: 'Gaussian mixtures & EM', summary: 'Soft clustering; the EM algorithm as coordinate ascent on a lower bound.', prereqs: ['ml/k-means', 'stats/maximum-likelihood'] },
        { id: 'kernel-density-estimation', title: 'Density estimation', summary: 'Histograms, kernel density estimation and the curse of dimensionality.' },
        { id: 'manifold-learning', title: 'Manifold learning: t-SNE & UMAP', summary: 'Nonlinear embeddings for visualization — and how to misread them.', prereqs: ['ml/pca'] },
        { id: 'self-supervised-learning', title: 'Self-supervised & contrastive learning', summary: 'Pretext tasks, InfoNCE, SimCLR and representation learning.', prereqs: ['ml/neural-networks-intro'] },
      ],
    },
    // 7 -----------------------------------------------------------------------
    {
      id: 'neural-networks',
      title: 'Neural networks & backprop',
      summary: 'Multilayer perceptrons, the chain rule at scale, and the tricks that make deep nets trainable.',
      references: [with_(UDL, 'Ch. 3–7, 11'), with_(BB, 'Ch. 6–8'), with_(GBC, 'Ch. 6–8'), { authors: 'D. E. Rumelhart, G. E. Hinton & R. J. Williams', title: 'Learning representations by back-propagating errors', year: 1986, venue: 'Nature 323, 533–536' }],
      lessons: [
        { id: 'neural-networks-intro', title: 'Neural networks', summary: 'Neurons, layers, activations and the universal approximation theorem.', prereqs: ['ml/logistic-regression-ml'] },
        { id: 'backpropagation', title: 'Backpropagation', summary: 'Reverse-mode automatic differentiation on a computational graph.', prereqs: ['ml/neural-networks-intro', 'ml/gradient-descent'] },
        { id: 'initialization-activations', title: 'Initialization & activations', summary: 'Vanishing/exploding gradients, Xavier/He init, ReLU, GELU.', prereqs: ['ml/backpropagation'] },
        { id: 'normalization-layers', title: 'Normalization layers', summary: 'BatchNorm, LayerNorm, RMSNorm and why they help.', prereqs: ['ml/initialization-activations'] },
        { id: 'residual-connections', title: 'Residual connections', summary: 'Skip connections as identity paths for gradients; ResNets as discretized ODEs.', prereqs: ['ml/backpropagation', 'math/ode-first-order'] },
        { id: 'deep-learning-practice', title: 'Training deep nets in practice', summary: 'Dropout, data augmentation, mixed precision, debugging loss curves.', prereqs: ['ml/regularization'] },
      ],
    },
    // 8 -----------------------------------------------------------------------
    {
      id: 'cnns-vision',
      title: 'Convolutional networks & vision',
      summary: 'Weight sharing and translation equivariance for images.',
      references: [with_(UDL, 'Ch. 10'), with_(GBC, 'Ch. 9'), { authors: 'K. He, X. Zhang, S. Ren & J. Sun', title: 'Deep Residual Learning for Image Recognition', year: 2016, venue: 'CVPR' }, { authors: 'A. Dosovitskiy et al.', title: 'An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale', year: 2021, venue: 'ICLR' }],
      lessons: [
        { id: 'cnns', title: 'Convolutional neural networks', summary: 'Convolution, channels, stride, pooling and receptive fields.', prereqs: ['ml/neural-networks-intro'] },
        { id: 'cnn-architectures', title: 'CNN architectures', summary: 'LeNet → AlexNet → VGG → ResNet → ConvNeXt.', prereqs: ['ml/cnns', 'ml/residual-connections'] },
        { id: 'unet-dense-prediction', title: 'U-Nets & dense prediction', summary: 'Encoder–decoder with skips for segmentation — and diffusion denoisers.', prereqs: ['ml/cnns'] },
        { id: 'vision-transformers', title: 'Vision transformers', summary: 'Patches as tokens; inductive bias vs scale.', prereqs: ['ml/attention-transformers', 'ml/cnns'] },
      ],
    },
    // 9 -----------------------------------------------------------------------
    {
      id: 'sequences-transformers',
      title: 'Sequence models & transformers',
      summary: 'From recurrent nets to attention — the architecture behind modern AI.',
      references: [with_(UDL, 'Ch. 12'), with_(BB, 'Ch. 12'), { authors: 'A. Vaswani et al.', title: 'Attention Is All You Need', year: 2017, venue: 'NeurIPS', url: 'https://arxiv.org/abs/1706.03762' }, { authors: 'S. Hochreiter & J. Schmidhuber', title: 'Long Short-Term Memory', year: 1997, venue: 'Neural Computation 9(8)' }],
      lessons: [
        { id: 'rnns', title: 'Recurrent neural networks', summary: 'Hidden state, backprop through time, vanishing gradients.', prereqs: ['ml/backpropagation'] },
        { id: 'lstm-gru', title: 'LSTMs & GRUs', summary: 'Gating as learned, additive memory.', prereqs: ['ml/rnns'] },
        { id: 'attention-transformers', title: 'Attention & transformers', summary: 'Queries, keys, values; multi-head self-attention; the transformer block.', prereqs: ['ml/neural-networks-intro', 'ml/softmax-classification'] },
        { id: 'positional-encodings', title: 'Positional encodings', summary: 'Sinusoidal, learned and rotary (RoPE) position information.', prereqs: ['ml/attention-transformers'] },
        { id: 'efficient-attention', title: 'Efficient attention & state-space models', summary: 'O(n²) cost, FlashAttention, linear attention, Mamba-style SSMs.', prereqs: ['ml/attention-transformers', 'cs/big-o'] },
        { id: 'mixture-of-experts', title: 'Mixture of experts', summary: 'Sparse routing for more parameters at constant compute.', prereqs: ['ml/attention-transformers'] },
      ],
    },
    // 10 ----------------------------------------------------------------------
    {
      id: 'geometric-dl',
      title: 'Graph & geometric deep learning',
      summary: 'Building symmetry into networks: graphs, sets, groups, manifolds and operators.',
      references: [{ authors: 'M. M. Bronstein, J. Bruna, T. Cohen & P. Veličković', title: 'Geometric Deep Learning: Grids, Groups, Graphs, Geodesics, and Gauges', year: 2021, venue: 'arXiv:2104.13478', url: 'https://arxiv.org/abs/2104.13478' }, { authors: 'T. N. Kipf & M. Welling', title: 'Semi-Supervised Classification with Graph Convolutional Networks', year: 2017, venue: 'ICLR' }, { authors: 'T. Cohen & M. Welling', title: 'Group Equivariant Convolutional Networks', year: 2016, venue: 'ICML' }, { authors: 'Z. Li et al.', title: 'Fourier Neural Operator for Parametric Partial Differential Equations', year: 2021, venue: 'ICLR' }],
      lessons: [
        { id: 'gnns', title: 'Graph neural networks', summary: 'Message passing, permutation invariance and GCN/GAT.', prereqs: ['cs/graphs-intro', 'ml/neural-networks-intro'] },
        { id: 'gnn-expressivity', title: 'GNN expressivity & the WL test', summary: 'What message passing cannot distinguish; oversmoothing.', prereqs: ['ml/gnns'] },
        { id: 'deep-sets-invariance', title: 'Invariance, equivariance & Deep Sets', summary: 'Symmetry as a design principle; sum-decomposition for sets.', prereqs: ['math/groups-intro'] },
        { id: 'equivariant-networks', title: 'Group-equivariant networks', summary: 'G-CNNs, steerable filters and the convolution theorem for groups.', prereqs: ['ml/deep-sets-invariance', 'math/group-actions', 'math/representations-intro'] },
        { id: 'e3-equivariant-networks', title: 'E(3)-equivariant networks for molecules', summary: 'EGNN, tensor products and spherical harmonics (NequIP, MACE).', prereqs: ['ml/equivariant-networks', 'math/lie-groups-intro'] },
        { id: 'neural-operators', title: 'Neural operators', summary: 'Learning maps between function spaces: DeepONet, FNO.', prereqs: ['math/operator-learning-intro', 'math/fourier-series'] },
      ],
    },
    // 11 ----------------------------------------------------------------------
    {
      id: 'probabilistic-ml',
      title: 'Probabilistic ML & variational inference',
      summary: 'Graphical models, approximate posteriors and the ELBO — the language of generative models.',
      references: [with_(PRML, 'Ch. 8, 10–11'), with_(PML2, 'Ch. 4, 10'), { authors: 'D. M. Blei, A. Kucukelbir & J. D. McAuliffe', title: 'Variational Inference: A Review for Statisticians', year: 2017, venue: 'JASA 112(518)', url: 'https://arxiv.org/abs/1601.00670' }],
      lessons: [
        { id: 'graphical-models', title: 'Probabilistic graphical models', summary: 'Bayes nets, factor graphs and conditional independence.', prereqs: ['stats/conditional-probability-bayes'] },
        { id: 'variational-inference', title: 'Variational inference & the ELBO', summary: 'Turning inference into optimization; KL(q‖p) and mean-field.', prereqs: ['stats/entropy-kl', 'stats/bayesian-inference'] },
        { id: 'reparameterization-trick', title: 'Gradient estimators', summary: 'Score-function (REINFORCE) vs reparameterization gradients.', prereqs: ['ml/variational-inference'] },
        { id: 'sampling-for-ml', title: 'Sampling: MCMC & Langevin dynamics', summary: 'Langevin, HMC and their role in Bayesian deep learning and generative models.', prereqs: ['stats/mcmc', 'math/sde-intro'] },
        { id: 'bayesian-deep-learning', title: 'Bayesian deep learning', summary: 'Laplace, MC dropout, deep ensembles, SWAG.', prereqs: ['ml/variational-inference', 'ml/neural-networks-intro'] },
      ],
    },
    // 12 ----------------------------------------------------------------------
    {
      id: 'generative-foundations',
      title: 'Generative models I: the classics',
      summary: 'Latent variables, VAEs, GANs, normalizing flows, autoregressive and energy-based models.',
      references: [with_(BB, 'Ch. 16–19'), with_(PML2, 'Ch. 20–24'), { authors: 'D. P. Kingma & M. Welling', title: 'Auto-Encoding Variational Bayes', year: 2014, venue: 'ICLR', url: 'https://arxiv.org/abs/1312.6114' }, { authors: 'I. Goodfellow et al.', title: 'Generative Adversarial Nets', year: 2014, venue: 'NeurIPS' }, { authors: 'D. J. Rezende & S. Mohamed', title: 'Variational Inference with Normalizing Flows', year: 2015, venue: 'ICML' }, { authors: 'G. Papamakarios, E. Nalisnick, D. J. Rezende, S. Mohamed & B. Lakshminarayanan', title: 'Normalizing Flows for Probabilistic Modeling and Inference', year: 2021, venue: 'JMLR 22(57)' }],
      lessons: [
        { id: 'generative-modeling-intro', title: 'What is generative modeling?', summary: 'Density estimation vs sampling; the zoo of model families and their trade-offs.', prereqs: ['ml/probabilistic-view'] },
        { id: 'latent-variable-models', title: 'Latent variable models', summary: 'p(x)=∫p(x|z)p(z)dz, intractable posteriors and the ELBO.', prereqs: ['ml/gmm-em', 'ml/variational-inference'] },
        { id: 'vaes', title: 'Variational autoencoders', summary: 'Amortized inference, the reparameterization trick, posterior collapse.', prereqs: ['ml/latent-variable-models', 'ml/reparameterization-trick'] },
        { id: 'gans', title: 'Generative adversarial networks', summary: 'The minimax game, JS divergence, mode collapse, Wasserstein GAN.', prereqs: ['ml/generative-modeling-intro', 'stats/entropy-kl'] },
        { id: 'normalizing-flows', title: 'Normalizing flows', summary: 'Change of variables, coupling layers, continuous flows (Neural ODEs).', prereqs: ['ml/generative-modeling-intro', 'math/ode-first-order'] },
        { id: 'autoregressive-models', title: 'Autoregressive models', summary: 'Chain-rule factorization, PixelCNN, next-token prediction.', prereqs: ['ml/generative-modeling-intro', 'ml/attention-transformers'] },
        { id: 'energy-based-models', title: 'Energy-based models', summary: 'p(x)∝e^{−E(x)}, partition functions, contrastive divergence.', prereqs: ['physics/boltzmann-distribution', 'ml/sampling-for-ml'] },
      ],
    },
    // 13 ----------------------------------------------------------------------
    {
      id: 'diffusion',
      title: 'Generative models II: diffusion',
      summary: 'Score matching, denoising diffusion, the SDE view, fast samplers and guidance.',
      references: [{ authors: 'J. Ho, A. Jain & P. Abbeel', title: 'Denoising Diffusion Probabilistic Models', year: 2020, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2006.11239' }, { authors: 'Y. Song, J. Sohl-Dickstein, D. P. Kingma, A. Kumar, S. Ermon & B. Poole', title: 'Score-Based Generative Modeling through Stochastic Differential Equations', year: 2021, venue: 'ICLR', url: 'https://arxiv.org/abs/2011.13456' }, { authors: 'J. Song, C. Meng & S. Ermon', title: 'Denoising Diffusion Implicit Models', year: 2021, venue: 'ICLR' }, { authors: 'T. Karras, M. Aittala, T. Aila & S. Laine', title: 'Elucidating the Design Space of Diffusion-Based Generative Models', year: 2022, venue: 'NeurIPS' }, with_(BB, 'Ch. 20')],
      lessons: [
        { id: 'score-matching', title: 'Score matching', summary: 'Learning ∇log p without the partition function; denoising score matching; Langevin sampling.', prereqs: ['ml/energy-based-models', 'ml/sampling-for-ml'] },
        { id: 'diffusion-models', title: 'Denoising diffusion (DDPM)', summary: 'Forward noising, reverse denoising, the ε-prediction loss and its ELBO.', prereqs: ['ml/score-matching', 'ml/vaes'] },
        { id: 'score-sde', title: 'The score SDE view', summary: 'VP/VE SDEs, reverse-time SDE (Anderson), probability-flow ODE.', prereqs: ['ml/diffusion-models', 'math/sde-intro', 'math/pde-heat-equation'] },
        { id: 'ddim-sampling', title: 'Fast samplers: DDIM & ODE solvers', summary: 'Deterministic sampling, few-step solvers (DPM-Solver, Heun/EDM).', prereqs: ['ml/score-sde'] },
        { id: 'diffusion-guidance', title: 'Conditioning & guidance', summary: 'Classifier guidance, classifier-free guidance and the quality–diversity dial.', prereqs: ['ml/diffusion-models'] },
        { id: 'latent-diffusion', title: 'Latent diffusion & architectures', summary: 'Autoencoder latents, U-Net vs DiT backbones, text conditioning.', prereqs: ['ml/diffusion-guidance', 'ml/unet-dense-prediction'] },
      ],
    },
    // 14 ----------------------------------------------------------------------
    {
      id: 'flows-interpolants',
      title: 'Generative models III: flows, interpolants & beyond',
      summary: 'Flow matching, rectified flow, stochastic interpolants, consistency models, discrete diffusion and evaluation.',
      references: [{ authors: 'Y. Lipman, R. T. Q. Chen, H. Ben-Hamu, M. Nickel & M. Le', title: 'Flow Matching for Generative Modeling', year: 2023, venue: 'ICLR', url: 'https://arxiv.org/abs/2210.02747' }, { authors: 'X. Liu, C. Gong & Q. Liu', title: 'Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow', year: 2023, venue: 'ICLR', url: 'https://arxiv.org/abs/2209.03003' }, { authors: 'M. S. Albergo, N. M. Boffi & E. Vanden-Eijnden', title: 'Stochastic Interpolants: A Unifying Framework for Flows and Diffusions', year: 2023, venue: 'arXiv:2303.08797', url: 'https://arxiv.org/abs/2303.08797' }, { authors: 'Y. Song, P. Dhariwal, M. Chen & I. Sutskever', title: 'Consistency Models', year: 2023, venue: 'ICML', url: 'https://arxiv.org/abs/2303.01469' }, { authors: 'M. Heusel, H. Ramsauer, T. Unterthiner, B. Nessler & S. Hochreiter', title: 'GANs Trained by a Two Time-Scale Update Rule Converge to a Local Nash Equilibrium', year: 2017, venue: 'NeurIPS (introduces FID)' }],
      lessons: [
        { id: 'flow-matching', title: 'Flow matching', summary: 'Regress a velocity field on conditional straight paths; the CFM objective.', prereqs: ['ml/normalizing-flows', 'ml/score-sde'] },
        { id: 'rectified-flow', title: 'Rectified flow & reflow', summary: 'Straightening trajectories for few-step generation; optimal-transport couplings.', prereqs: ['ml/flow-matching'] },
        { id: 'stochastic-interpolants', title: 'Stochastic interpolants', summary: 'One framework for flows and diffusions; arbitrary base distributions.', prereqs: ['ml/flow-matching'] },
        { id: 'consistency-models', title: 'Consistency models & distillation', summary: 'Map any point on a trajectory to its endpoint: one-step generation.', prereqs: ['ml/ddim-sampling'] },
        { id: 'discrete-diffusion', title: 'Discrete diffusion', summary: 'Diffusion on tokens: D3PM, masked diffusion language models.', prereqs: ['ml/diffusion-models', 'stats/markov-chains'] },
        { id: 'generative-evaluation', title: 'Evaluating generative models', summary: 'Likelihood/bits-per-dim, FID, precision/recall, and their pitfalls.', prereqs: ['ml/generative-modeling-intro'] },
      ],
    },
    // 15 ----------------------------------------------------------------------
    {
      id: 'llms',
      title: 'Large language models & scaling',
      summary: 'Pretraining, scaling laws, fine-tuning, alignment and inference.',
      references: [{ authors: 'J. Kaplan et al.', title: 'Scaling Laws for Neural Language Models', year: 2020, venue: 'arXiv:2001.08361', url: 'https://arxiv.org/abs/2001.08361' }, { authors: 'J. Hoffmann et al.', title: 'Training Compute-Optimal Large Language Models', year: 2022, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2203.15556' }, { authors: 'L. Ouyang et al.', title: 'Training language models to follow instructions with human feedback', year: 2022, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2203.02155' }, { authors: 'R. Rafailov, A. Sharma, E. Mitchell, S. Ermon, C. D. Manning & C. Finn', title: 'Direct Preference Optimization: Your Language Model is Secretly a Reward Model', year: 2023, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2305.18290' }],
      lessons: [
        { id: 'tokenization-pretraining', title: 'Tokenization & pretraining', summary: 'BPE, next-token loss, perplexity and data curation.', prereqs: ['ml/autoregressive-models'] },
        { id: 'scaling-laws', title: 'Scaling laws', summary: 'Power laws in N, D, C; Chinchilla compute-optimal training.', prereqs: ['ml/tokenization-pretraining'] },
        { id: 'in-context-learning', title: 'In-context learning & prompting', summary: 'Few-shot learning without weight updates; chain of thought.', prereqs: ['ml/tokenization-pretraining'] },
        { id: 'fine-tuning-peft', title: 'Fine-tuning & PEFT', summary: 'Supervised fine-tuning, LoRA and adapters.', prereqs: ['ml/tokenization-pretraining'] },
        { id: 'rlhf-dpo', title: 'RLHF & DPO', summary: 'Reward models from preferences, KL-regularized RL, direct preference optimization.', prereqs: ['ml/ppo', 'ml/fine-tuning-peft'] },
        { id: 'rl-for-reasoning', title: 'RL for reasoning: verifiable rewards', summary: 'GRPO, outcome vs process rewards, test-time compute.', prereqs: ['ml/rlhf-dpo'] },
        { id: 'llm-inference', title: 'Decoding & efficient inference', summary: 'Sampling temperature, beam search, KV cache, speculative decoding.', prereqs: ['ml/tokenization-pretraining'] },
      ],
    },
    // 16 ----------------------------------------------------------------------
    {
      id: 'rl-foundations',
      title: 'Reinforcement learning I: foundations',
      summary: 'Markov decision processes, Bellman equations, dynamic programming and bandits.',
      references: [with_(SB, 'Ch. 2–4'), { authors: 'T. Lattimore & C. Szepesvári', title: 'Bandit Algorithms', year: 2020, venue: 'Cambridge University Press', url: 'https://tor-lattimore.com/downloads/book/book.pdf' }, { authors: 'M. L. Puterman', title: 'Markov Decision Processes: Discrete Stochastic Dynamic Programming', year: 1994, venue: 'Wiley' }],
      lessons: [
        { id: 'mdp-intro', title: 'Markov decision processes', summary: 'States, actions, rewards, discounting, policies and value functions.', prereqs: ['stats/markov-chains'] },
        { id: 'bellman-equations', title: 'Bellman equations', summary: 'Expectation and optimality equations; contraction mappings.', prereqs: ['ml/mdp-intro'] },
        { id: 'dynamic-programming-rl', title: 'Dynamic programming: value & policy iteration', summary: 'Planning with a known model.', prereqs: ['ml/bellman-equations', 'cs/dynamic-programming'] },
        { id: 'bandits-exploration', title: 'Bandits & exploration', summary: 'Regret, ε-greedy, UCB, Thompson sampling.', prereqs: ['ml/mdp-intro', 'stats/bayesian-inference'] },
      ],
    },
    // 17 ----------------------------------------------------------------------
    {
      id: 'value-based-rl',
      title: 'Reinforcement learning II: value-based methods',
      summary: 'Learning values from experience: Monte Carlo, TD, Q-learning and deep Q-networks.',
      references: [with_(SB, 'Ch. 5–7, 9–11'), { authors: 'V. Mnih et al.', title: 'Human-level control through deep reinforcement learning', year: 2015, venue: 'Nature 518, 529–533' }, { authors: 'C. J. C. H. Watkins & P. Dayan', title: 'Q-learning', year: 1992, venue: 'Machine Learning 8, 279–292' }],
      lessons: [
        { id: 'monte-carlo-rl', title: 'Monte Carlo methods', summary: 'Estimating values by averaging returns.', prereqs: ['ml/bellman-equations'] },
        { id: 'td-learning', title: 'Temporal-difference learning', summary: 'Bootstrapping: TD(0), n-step returns, TD(λ).', prereqs: ['ml/monte-carlo-rl'] },
        { id: 'q-learning', title: 'Q-learning & SARSA', summary: 'Off-policy control from the Bellman optimality equation.', prereqs: ['ml/td-learning'] },
        { id: 'function-approximation-rl', title: 'Function approximation & the deadly triad', summary: 'Linear and neural value functions; why off-policy bootstrapping can diverge.', prereqs: ['ml/q-learning'] },
        { id: 'dqn', title: 'Deep Q-networks', summary: 'Replay buffers, target networks, Double/Dueling DQN, Rainbow.', prereqs: ['ml/function-approximation-rl'] },
      ],
    },
    // 18 ----------------------------------------------------------------------
    {
      id: 'policy-optimization',
      title: 'Reinforcement learning III: policy optimization',
      summary: 'Directly optimizing policies: REINFORCE, actor–critic, trust regions, PPO and soft actor–critic.',
      references: [with_(SB, 'Ch. 13'), { authors: 'J. Schulman, F. Wolski, P. Dhariwal, A. Radford & O. Klimov', title: 'Proximal Policy Optimization Algorithms', year: 2017, venue: 'arXiv:1707.06347', url: 'https://arxiv.org/abs/1707.06347' }, { authors: 'J. Schulman, S. Levine, P. Moritz, M. Jordan & P. Abbeel', title: 'Trust Region Policy Optimization', year: 2015, venue: 'ICML' }, { authors: 'T. Haarnoja, A. Zhou, P. Abbeel & S. Levine', title: 'Soft Actor-Critic: Off-Policy Maximum Entropy Deep Reinforcement Learning with a Stochastic Actor', year: 2018, venue: 'ICML' }],
      lessons: [
        { id: 'policy-gradients', title: 'Policy gradients & REINFORCE', summary: 'The log-derivative trick, baselines and variance reduction.', prereqs: ['ml/mdp-intro', 'ml/reparameterization-trick'] },
        { id: 'actor-critic', title: 'Actor–critic & advantage estimation', summary: 'Critics as baselines; GAE.', prereqs: ['ml/policy-gradients', 'ml/td-learning'] },
        { id: 'trpo-natural-gradient', title: 'Natural gradients & TRPO', summary: 'KL trust regions and the Fisher metric.', prereqs: ['ml/actor-critic', 'ml/second-order-methods'] },
        { id: 'ppo', title: 'Proximal policy optimization', summary: 'The clipped surrogate objective and why it became the default.', prereqs: ['ml/trpo-natural-gradient'] },
        { id: 'deterministic-policy-gradients', title: 'DDPG & TD3', summary: 'Deterministic actors for continuous control.', prereqs: ['ml/actor-critic', 'ml/dqn'] },
        { id: 'sac-max-entropy', title: 'Soft actor–critic & max-entropy RL', summary: 'Entropy bonuses, soft Bellman equations, automatic temperature.', prereqs: ['ml/deterministic-policy-gradients', 'stats/entropy-kl'] },
      ],
    },
    // 19 ----------------------------------------------------------------------
    {
      id: 'advanced-rl',
      title: 'Reinforcement learning IV: frontiers',
      summary: 'Model-based RL, deep exploration, offline RL, imitation, multi-agent RL and theory.',
      references: [with_(SB, 'Ch. 8'), { authors: 'S. Levine, A. Kumar, G. Tucker & J. Fu', title: 'Offline Reinforcement Learning: Tutorial, Review, and Perspectives on Open Problems', year: 2020, venue: 'arXiv:2005.01643', url: 'https://arxiv.org/abs/2005.01643' }, { authors: 'J. Schrittwieser et al.', title: 'Mastering Atari, Go, chess and shogi by planning with a learned model', year: 2020, venue: 'Nature 588, 604–609' }, { authors: 'A. Agarwal, N. Jiang, S. M. Kakade & W. Sun', title: 'Reinforcement Learning: Theory and Algorithms', year: 2022, venue: 'monograph', url: 'https://rltheorybook.github.io' }],
      lessons: [
        { id: 'model-based-rl', title: 'Model-based RL: Dyna to MuZero', summary: 'Learning dynamics models, planning with MCTS, world models.', prereqs: ['ml/q-learning', 'ml/dynamic-programming-rl'] },
        { id: 'exploration-deep-rl', title: 'Exploration in deep RL', summary: 'Count-based bonuses, curiosity, posterior sampling.', prereqs: ['ml/bandits-exploration', 'ml/dqn'] },
        { id: 'offline-rl', title: 'Offline RL', summary: 'Learning from fixed datasets; distribution shift; CQL, IQL.', prereqs: ['ml/dqn', 'ml/actor-critic'] },
        { id: 'imitation-learning', title: 'Imitation learning', summary: 'Behavior cloning, DAgger, inverse RL, diffusion policies.', prereqs: ['ml/mdp-intro', 'ml/diffusion-models'] },
        { id: 'multi-agent-rl', title: 'Multi-agent RL', summary: 'Markov games, Nash equilibria, self-play and CTDE.', prereqs: ['ml/policy-gradients'] },
        { id: 'rl-theory', title: 'RL theory', summary: 'Sample complexity, regret bounds and the role of function approximation.', prereqs: ['ml/bandits-exploration', 'ml/pac-learning-vc'] },
      ],
    },
    // 20 ----------------------------------------------------------------------
    {
      id: 'research-practice',
      title: 'Doing ML research',
      summary: 'Experimental hygiene, reproducibility, compute, reading papers, and responsible ML.',
      references: [{ authors: 'Z. C. Lipton & J. Steinhardt', title: 'Troubling Trends in Machine Learning Scholarship', year: 2018, venue: 'arXiv:1807.03341', url: 'https://arxiv.org/abs/1807.03341' }, { authors: 'P. Henderson et al.', title: 'Deep Reinforcement Learning that Matters', year: 2018, venue: 'AAAI' }, { authors: 'A. Karpathy', title: 'A Recipe for Training Neural Networks', year: 2019, venue: 'blog post', url: 'https://karpathy.github.io/2019/04/25/recipe/' }],
      lessons: [
        { id: 'experimental-methodology', title: 'Experimental methodology', summary: 'Baselines, ablations, seeds, error bars and statistical tests.', prereqs: ['stats/hypothesis-testing', 'ml/cross-validation'] },
        { id: 'reading-papers', title: 'Reading & writing ML papers', summary: 'Extracting the core idea, checking claims, writing clearly.' },
        { id: 'compute-and-systems', title: 'Compute & systems', summary: 'FLOPs, memory, data/tensor/pipeline parallelism, profiling.', prereqs: ['ml/scaling-laws', 'cs/big-o'] },
        { id: 'distribution-shift-causality', title: 'Distribution shift & causality', summary: 'Covariate shift, spurious correlations, causal thinking in ML.', prereqs: ['stats/causal-inference-intro'] },
        { id: 'responsible-ml', title: 'Fairness, safety & responsible ML', summary: 'Fairness criteria, interpretability, robustness and alignment.' },
      ],
    },
  ],
} satisfies Subject;
