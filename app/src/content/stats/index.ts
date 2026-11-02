import type { Reference, Subject } from '../types';

// ---- shared references -------------------------------------------------------------
const openstax = (detail: string): Reference => ({
  authors: 'B. Illowsky, S. Dean et al.', title: 'Introductory Statistics', year: 2013, venue: 'OpenStax', detail,
  url: 'https://openstax.org/details/books/introductory-statistics',
});
const blitzstein = (detail: string): Reference => ({
  authors: 'J. K. Blitzstein, J. Hwang', title: 'Introduction to Probability', year: 2019, venue: '2nd ed., CRC Press', detail,
});
const casella = (detail: string): Reference => ({
  authors: 'G. Casella, R. L. Berger', title: 'Statistical Inference', year: 2002, venue: '2nd ed., Duxbury', detail,
});
const wasserman = (detail: string): Reference => ({
  authors: 'L. Wasserman', title: 'All of Statistics: A Concise Course in Statistical Inference', year: 2004, venue: 'Springer', detail,
});
const bda3 = (detail: string): Reference => ({
  authors: 'A. Gelman, J. B. Carlin, H. S. Stern, D. B. Dunson, A. Vehtari, D. B. Rubin', title: 'Bayesian Data Analysis', year: 2013, venue: '3rd ed., CRC Press', detail,
});
const esl = (detail: string): Reference => ({
  authors: 'T. Hastie, R. Tibshirani, J. Friedman', title: 'The Elements of Statistical Learning', year: 2009, venue: '2nd ed., Springer', detail,
});
const islr = (detail: string): Reference => ({
  authors: 'G. James, D. Witten, T. Hastie, R. Tibshirani', title: 'An Introduction to Statistical Learning', year: 2021, venue: '2nd ed., Springer', detail,
  url: 'https://www.statlearning.com',
});

const subject = {
  id: 'stats',
  name: 'Statistics',
  emoji: '📊',
  color: '#ff9600',
  tagline: 'Reason clearly about uncertainty and data.',
  description: String.raw`From "what is an average?" to MCMC and causal inference — the full arc of a university statistics major, built from basic algebra up.

You will learn to **describe** data, **model** randomness with probability, **estimate** unknowns and quantify how sure you are, **test** claims, **fit** regression and Bayesian models, and reason about **cause and effect**. Every idea comes with a simulation you can play with.`,
  units: [
    {
      id: 'data-descriptive',
      title: 'Data & descriptive statistics',
      summary: 'What data are, how they are collected, and how to summarise and picture them honestly.',
      lessons: [
        { id: 'what-is-statistics', title: 'What is statistics?', summary: 'Populations, samples, parameters and statistics — and why we infer from the part to the whole.' },
        { id: 'types-of-data', title: 'Types of data', summary: 'Categorical vs numerical, discrete vs continuous, and scales of measurement.', prereqs: ['stats/what-is-statistics'] },
        { id: 'center-and-spread', title: 'Center and spread', summary: 'Mean, median, mode, variance, standard deviation, IQR — and which to trust when data are skewed.', prereqs: ['stats/types-of-data'] },
        { id: 'visualizing-distributions', title: 'Visualizing distributions', summary: 'Histograms, box plots, density plots and the shapes they reveal (skew, modes, outliers).', prereqs: ['stats/center-and-spread'] },
        { id: 'correlation-scatterplots', title: 'Scatterplots & correlation', summary: 'Reading relationships between two variables; Pearson correlation and its pitfalls.', prereqs: ['stats/center-and-spread'] },
        { id: 'sampling-and-bias', title: 'Sampling and bias', summary: 'Random sampling, observational studies vs experiments, and the biases that sink conclusions.', prereqs: ['stats/what-is-statistics'] },
      ],
      references: [
        openstax('Ch. 1–2, 12.1–12.3'),
        { authors: 'D. Freedman, R. Pisani, R. Purves', title: 'Statistics', year: 2007, venue: '4th ed., W. W. Norton', detail: 'Parts I–III' },
      ],
    },
    {
      id: 'probability-foundations',
      title: 'Probability foundations',
      summary: 'The language of chance: events, conditional probability, Bayes’ rule, random variables, expectation and variance.',
      lessons: [
        { id: 'probability-basics', title: 'Probability basics', summary: 'Sample spaces, events, and the three axioms that every probability obeys.' },
        { id: 'conditional-probability-bayes', title: 'Conditional probability & Bayes', summary: 'Updating on evidence: conditioning, independence, the law of total probability and Bayes’ rule.', prereqs: ['stats/probability-basics'] },
        { id: 'random-variables', title: 'Random variables', summary: 'Turning outcomes into numbers: pmfs, pdfs, CDFs and the Bernoulli/binomial families.', prereqs: ['stats/probability-basics'] },
        { id: 'expectation-variance', title: 'Expectation & variance', summary: 'Long-run average and spread of a random variable, linearity of expectation, and variance rules.', prereqs: ['stats/random-variables'] },
        { id: 'counting-methods', title: 'Counting methods', summary: 'Multiplication rule, permutations, combinations, and probabilities from counting.', prereqs: ['stats/probability-basics'] },
        { id: 'conditional-expectation', title: 'Conditional expectation', summary: 'E[X | Y], the tower property (law of total expectation) and the law of total variance.', prereqs: ['stats/expectation-variance', 'stats/conditional-probability-bayes'] },
      ],
      references: [
        blitzstein('Ch. 1–4, 9'),
        wasserman('Ch. 1–3'),
        openstax('Ch. 3–4'),
      ],
    },
    {
      id: 'distributions-toolkit',
      title: 'Distributions toolkit',
      summary: 'The standard families, joint behaviour of several variables, and the tools to transform and bound them.',
      lessons: [
        { id: 'discrete-distributions', title: 'Discrete distributions', summary: 'Bernoulli, binomial, geometric, negative binomial, hypergeometric and Poisson — what story each tells.', prereqs: ['stats/expectation-variance'] },
        { id: 'continuous-distributions', title: 'Continuous distributions', summary: 'Uniform, exponential, gamma and beta: densities, memorylessness and where each arises.', prereqs: ['stats/expectation-variance'] },
        { id: 'joint-distributions', title: 'Joint distributions', summary: 'Joint, marginal and conditional distributions of two or more random variables.', prereqs: ['stats/random-variables', 'stats/conditional-probability-bayes'] },
        { id: 'covariance-correlation', title: 'Covariance & correlation', summary: 'How two random variables move together, and the variance of a sum.', prereqs: ['stats/joint-distributions'] },
        { id: 'transformations-of-rvs', title: 'Transformations', summary: 'Distribution of g(X): the CDF method, change of variables and convolutions.', prereqs: ['stats/continuous-distributions'] },
        { id: 'moment-generating-functions', title: 'Moment generating functions', summary: 'Packaging all moments into one function, and using it to identify sums of variables.', prereqs: ['stats/transformations-of-rvs'] },
        { id: 'probability-inequalities', title: 'Probability inequalities', summary: 'Markov, Chebyshev, Jensen and Hoeffding: guaranteed bounds with minimal assumptions.', prereqs: ['stats/expectation-variance'] },
      ],
      references: [
        blitzstein('Ch. 3–8, 10.1'),
        casella('Ch. 2–4'),
        wasserman('Ch. 2–4'),
      ],
    },
    {
      id: 'limit-theorems',
      title: 'Normal distribution & limit theorems',
      summary: 'Why averages stabilise, why the bell curve is everywhere, and the sampling distributions built from it.',
      lessons: [
        { id: 'normal-distribution', title: 'The normal distribution', summary: 'The bell curve: parameters, z-scores, the 68–95–99.7 rule and normal probabilities.', prereqs: ['stats/expectation-variance'] },
        { id: 'law-of-large-numbers', title: 'Law of large numbers', summary: 'Why the sample average settles down to the true mean — and what it does not promise.', prereqs: ['stats/expectation-variance'] },
        { id: 'central-limit-theorem', title: 'Central limit theorem', summary: 'Averages of many independent pieces are approximately normal, whatever the pieces look like.', prereqs: ['stats/normal-distribution', 'stats/law-of-large-numbers'] },
        { id: 'sampling-distributions', title: 'Sampling distributions', summary: 'A statistic is random too: standard errors, and the sampling distribution of means and proportions.', prereqs: ['stats/central-limit-theorem'] },
        { id: 'chi-square-t-f', title: 'χ², t and F distributions', summary: 'The distributions born from normal samples that power classical tests and intervals.', prereqs: ['stats/sampling-distributions'] },
        { id: 'delta-method', title: 'Delta method & modes of convergence', summary: 'Convergence in probability vs in distribution, Slutsky, and approximating the distribution of g(X̄).', prereqs: ['stats/central-limit-theorem'] },
      ],
      references: [
        openstax('Ch. 6–7'),
        blitzstein('Ch. 5, 10'),
        casella('Ch. 5'),
        wasserman('Ch. 5'),
      ],
    },
    {
      id: 'point-estimation',
      title: 'Point estimation',
      summary: 'Turning data into best guesses for unknown parameters, and judging how good those guesses are.',
      lessons: [
        { id: 'estimators-bias-variance', title: 'Estimators: bias, variance, MSE', summary: 'What makes an estimator good: bias, variance, mean squared error and consistency.', prereqs: ['stats/sampling-distributions'] },
        { id: 'method-of-moments', title: 'Method of moments', summary: 'Match sample moments to theoretical moments and solve for the parameters.', prereqs: ['stats/estimators-bias-variance'] },
        { id: 'maximum-likelihood', title: 'Maximum likelihood', summary: 'Choose the parameter that makes the observed data most probable; the likelihood and log-likelihood.', prereqs: ['stats/estimators-bias-variance'] },
        { id: 'fisher-information-cramer-rao', title: 'Fisher information & Cramér–Rao', summary: 'How much a sample tells you about a parameter, and the lower bound on any unbiased estimator’s variance.', prereqs: ['stats/maximum-likelihood'] },
        { id: 'mle-asymptotics', title: 'Asymptotics of the MLE', summary: 'Consistency, asymptotic normality and efficiency of maximum likelihood in large samples.', prereqs: ['stats/fisher-information-cramer-rao', 'stats/delta-method'] },
        { id: 'sufficiency', title: 'Sufficiency & exponential families', summary: 'Statistics that capture all the information, factorization, and Rao–Blackwell.', prereqs: ['stats/maximum-likelihood'] },
      ],
      references: [
        casella('Ch. 6–7, 10.1'),
        wasserman('Ch. 6, 9'),
        { authors: 'R. A. Fisher', title: 'On the mathematical foundations of theoretical statistics', year: 1922, venue: 'Philosophical Transactions of the Royal Society A 222, 309–368' },
      ],
    },
    {
      id: 'confidence-intervals-unit',
      title: 'Confidence intervals',
      summary: 'Ranges of plausible values with a guaranteed long-run hit rate — and how to read them correctly.',
      lessons: [
        { id: 'confidence-intervals', title: 'Confidence intervals', summary: 'Building an interval from a sampling distribution, and what "95% confidence" really means.', prereqs: ['stats/sampling-distributions'] },
        { id: 't-intervals', title: 't intervals', summary: 'Intervals for a mean when σ is unknown, using Student’s t distribution.', prereqs: ['stats/confidence-intervals', 'stats/chi-square-t-f'] },
        { id: 'intervals-for-proportions', title: 'Intervals for proportions', summary: 'Wald, Wilson and exact intervals for a success probability, and why Wald can fail.', prereqs: ['stats/confidence-intervals'] },
        { id: 'sample-size-planning', title: 'Sample size planning', summary: 'How large a sample you need for a target margin of error.', prereqs: ['stats/confidence-intervals'] },
        { id: 'likelihood-intervals', title: 'Likelihood-based intervals', summary: 'Wald, score and likelihood-ratio intervals from the MLE and Fisher information.', prereqs: ['stats/confidence-intervals', 'stats/mle-asymptotics'] },
      ],
      references: [
        openstax('Ch. 8'),
        casella('Ch. 9'),
        { authors: 'J. Neyman', title: 'Outline of a theory of statistical estimation based on the classical theory of probability', year: 1937, venue: 'Philosophical Transactions of the Royal Society A 236, 333–380' },
        { authors: 'L. D. Brown, T. T. Cai, A. DasGupta', title: 'Interval estimation for a binomial proportion', year: 2001, venue: 'Statistical Science 16(2), 101–133' },
      ],
    },
    {
      id: 'hypothesis-testing-unit',
      title: 'Hypothesis testing',
      summary: 'Weighing evidence against a default claim: p-values, errors, power, classic tests and the multiple-testing trap.',
      lessons: [
        { id: 'hypothesis-testing', title: 'Hypothesis testing', summary: 'Null and alternative hypotheses, test statistics, rejection regions and the logic of "surprise".', prereqs: ['stats/sampling-distributions'] },
        { id: 'p-values', title: 'p-values done right', summary: 'What a p-value is, what it is not, and the ASA’s guidance on using them.', prereqs: ['stats/hypothesis-testing'] },
        { id: 'errors-and-power', title: 'Type I/II errors & power', summary: 'False alarms vs misses, power curves, and how sample size and effect size drive power.', prereqs: ['stats/hypothesis-testing'] },
        { id: 't-tests', title: 't tests', summary: 'One-sample, paired and two-sample t tests, and the duality between tests and intervals.', prereqs: ['stats/hypothesis-testing', 'stats/t-intervals'] },
        { id: 'chi-square-tests', title: 'Chi-square tests', summary: 'Goodness of fit and independence in contingency tables.', prereqs: ['stats/hypothesis-testing', 'stats/chi-square-t-f'] },
        { id: 'likelihood-ratio-tests', title: 'Likelihood ratio tests', summary: 'Neyman–Pearson lemma, LRTs and Wilks’ theorem.', prereqs: ['stats/hypothesis-testing', 'stats/maximum-likelihood'] },
        { id: 'multiple-testing', title: 'Multiple testing', summary: 'Why many tests produce false discoveries; Bonferroni, FWER and the Benjamini–Hochberg FDR.', prereqs: ['stats/p-values'] },
      ],
      references: [
        openstax('Ch. 9–11'),
        casella('Ch. 8'),
        wasserman('Ch. 10'),
        { authors: 'R. L. Wasserstein, N. A. Lazar', title: 'The ASA statement on p-values: context, process, and purpose', year: 2016, venue: 'The American Statistician 70(2), 129–133' },
        { authors: 'Y. Benjamini, Y. Hochberg', title: 'Controlling the false discovery rate: a practical and powerful approach to multiple testing', year: 1995, venue: 'Journal of the Royal Statistical Society B 57(1), 289–300' },
      ],
    },
    {
      id: 'linear-models',
      title: 'Linear models & regression',
      summary: 'Fitting lines and planes to data, inference for coefficients, diagnostics, and regularisation.',
      lessons: [
        { id: 'linear-regression', title: 'Simple linear regression', summary: 'Least-squares line, slope as "change in y per unit x", R², and regression to the mean.', prereqs: ['stats/correlation-scatterplots', 'stats/expectation-variance'] },
        { id: 'regression-inference', title: 'Inference for regression', summary: 'The Gauss–Markov model, standard errors, t tests and intervals for coefficients and predictions.', prereqs: ['stats/linear-regression', 'stats/t-tests'] },
        { id: 'multiple-regression', title: 'Multiple regression', summary: 'Several predictors, matrix form, "holding other variables fixed" and confounding.', prereqs: ['stats/linear-regression', 'math/vectors-matrices'] },
        { id: 'least-squares-geometry', title: 'Geometry of least squares', summary: 'Fitted values as projection onto the column space; the hat matrix.', prereqs: ['stats/multiple-regression'] },
        { id: 'regression-diagnostics', title: 'Regression diagnostics', summary: 'Residual plots, leverage, influence, heteroscedasticity and transformations.', prereqs: ['stats/multiple-regression'] },
        { id: 'regularization', title: 'Ridge & lasso', summary: 'Shrinking coefficients to trade a little bias for a lot less variance.', prereqs: ['stats/multiple-regression', 'stats/estimators-bias-variance'] },
        { id: 'model-selection', title: 'Model selection', summary: 'Choosing predictors: adjusted R², AIC/BIC, cross-validation and the dangers of data dredging.', prereqs: ['stats/multiple-regression'] },
      ],
      references: [
        openstax('Ch. 12'),
        casella('Ch. 11–12'),
        { authors: 'A. Gelman, J. Hill, A. Vehtari', title: 'Regression and Other Stories', year: 2020, venue: 'Cambridge University Press', detail: 'Ch. 6–12' },
        esl('Ch. 3'),
      ],
    },
    {
      id: 'anova-design',
      title: 'Experimental design & ANOVA',
      summary: 'Designing studies that can answer causal questions, and analysing them by partitioning variance.',
      lessons: [
        { id: 'experimental-design', title: 'Principles of experimental design', summary: 'Control, randomization, replication and blocking — Fisher’s recipe for trustworthy experiments.', prereqs: ['stats/sampling-and-bias'] },
        { id: 'one-way-anova', title: 'One-way ANOVA', summary: 'Comparing several group means by splitting variation into between- and within-group parts; the F test.', prereqs: ['stats/t-tests', 'stats/chi-square-t-f'] },
        { id: 'blocking-and-pairing', title: 'Blocking & pairing', summary: 'Removing nuisance variation with blocks, paired designs and randomized complete block designs.', prereqs: ['stats/experimental-design', 'stats/one-way-anova'] },
        { id: 'factorial-designs', title: 'Factorial designs & interactions', summary: 'Varying several factors at once, two-way ANOVA, main effects and interactions.', prereqs: ['stats/one-way-anova'] },
        { id: 'post-hoc-comparisons', title: 'Contrasts & post-hoc tests', summary: 'Which groups differ? Planned contrasts, Tukey’s HSD and multiplicity.', prereqs: ['stats/one-way-anova', 'stats/multiple-testing'] },
        { id: 'power-analysis-design', title: 'Power analysis for experiments', summary: 'Choosing the number of replicates to detect an effect worth detecting.', prereqs: ['stats/errors-and-power', 'stats/experimental-design'] },
      ],
      references: [
        { authors: 'G. E. P. Box, J. S. Hunter, W. G. Hunter', title: 'Statistics for Experimenters: Design, Innovation, and Discovery', year: 2005, venue: '2nd ed., Wiley', detail: 'Ch. 2–6' },
        { authors: 'D. C. Montgomery', title: 'Design and Analysis of Experiments', year: 2017, venue: '9th ed., Wiley', detail: 'Ch. 1–5' },
        openstax('Ch. 13'),
        { authors: 'R. A. Fisher', title: 'The Design of Experiments', year: 1935, venue: 'Oliver & Boyd' },
      ],
    },
    {
      id: 'glms',
      title: 'Generalized linear models',
      summary: 'Regression for yes/no outcomes, counts and rates via link functions and the exponential family.',
      lessons: [
        { id: 'glm-framework', title: 'The GLM framework', summary: 'Random component, linear predictor and link function — one recipe for many outcome types.', prereqs: ['stats/multiple-regression', 'stats/maximum-likelihood'] },
        { id: 'logistic-regression', title: 'Logistic regression', summary: 'Modelling probabilities with the logit link; odds ratios and interpreting coefficients.', prereqs: ['stats/glm-framework'] },
        { id: 'poisson-regression', title: 'Poisson regression', summary: 'Count outcomes, log link, exposure offsets and overdispersion.', prereqs: ['stats/glm-framework'] },
        { id: 'deviance-model-checking', title: 'Deviance & GLM diagnostics', summary: 'Deviance, likelihood-ratio comparisons and residuals for GLMs.', prereqs: ['stats/glm-framework', 'stats/likelihood-ratio-tests'] },
        { id: 'categorical-data-analysis', title: 'Contingency tables & odds ratios', summary: 'Relative risk, odds ratios, Simpson’s paradox and log-linear models.', prereqs: ['stats/chi-square-tests', 'stats/logistic-regression'] },
        { id: 'mixed-models', title: 'Mixed-effects models', summary: 'Random effects for grouped and repeated-measures data.', prereqs: ['stats/glm-framework'] },
      ],
      references: [
        { authors: 'A. Agresti', title: 'Foundations of Linear and Generalized Linear Models', year: 2015, venue: 'Wiley', detail: 'Ch. 4–7' },
        { authors: 'A. Agresti', title: 'Categorical Data Analysis', year: 2013, venue: '3rd ed., Wiley', detail: 'Ch. 2–5' },
        { authors: 'J. A. Nelder, R. W. M. Wedderburn', title: 'Generalized linear models', year: 1972, venue: 'Journal of the Royal Statistical Society A 135(3), 370–384' },
      ],
    },
    {
      id: 'bayesian',
      title: 'Bayesian inference',
      summary: 'Parameters as uncertain quantities: priors, posteriors, predictions and hierarchical models.',
      lessons: [
        { id: 'bayesian-inference', title: 'Bayesian inference', summary: 'Prior × likelihood ∝ posterior: updating beliefs about a parameter with data.', prereqs: ['stats/conditional-probability-bayes', 'stats/maximum-likelihood'] },
        { id: 'conjugate-priors', title: 'Conjugate priors', summary: 'Beta–binomial, gamma–Poisson and normal–normal: posteriors in closed form.', prereqs: ['stats/bayesian-inference', 'stats/continuous-distributions'] },
        { id: 'posterior-summaries', title: 'Posterior summaries & credible intervals', summary: 'Posterior mean, MAP, credible intervals and how they differ from confidence intervals.', prereqs: ['stats/bayesian-inference', 'stats/confidence-intervals'] },
        { id: 'posterior-predictive', title: 'Prediction & model checking', summary: 'Posterior predictive distributions and checking models against data.', prereqs: ['stats/posterior-summaries'] },
        { id: 'hierarchical-models', title: 'Hierarchical models', summary: 'Partial pooling: sharing strength across groups with multilevel priors.', prereqs: ['stats/conjugate-priors'] },
        { id: 'bayes-factors-model-comparison', title: 'Bayesian model comparison', summary: 'Marginal likelihood, Bayes factors and predictive criteria (WAIC, LOO).', prereqs: ['stats/posterior-predictive'] },
      ],
      references: [
        bda3('Ch. 1–3, 5–7'),
        wasserman('Ch. 11'),
        { authors: 'R. McElreath', title: 'Statistical Rethinking: A Bayesian Course with Examples in R and Stan', year: 2020, venue: '2nd ed., CRC Press' },
      ],
    },
    {
      id: 'nonparametric-resampling',
      title: 'Nonparametrics & resampling',
      summary: 'Inference with few assumptions: ranks, smoothing, and letting the computer resample the data.',
      lessons: [
        { id: 'empirical-cdf', title: 'The empirical CDF', summary: 'Estimating a whole distribution from data, with Glivenko–Cantelli and DKW guarantees.', prereqs: ['stats/law-of-large-numbers'] },
        { id: 'rank-tests', title: 'Rank-based tests', summary: 'Sign test, Wilcoxon signed-rank and Mann–Whitney: tests that survive outliers.', prereqs: ['stats/t-tests'] },
        { id: 'permutation-tests', title: 'Permutation tests', summary: 'Exact tests by shuffling labels under the null hypothesis.', prereqs: ['stats/hypothesis-testing'] },
        { id: 'bootstrap', title: 'The bootstrap', summary: 'Resampling your own data to estimate standard errors and confidence intervals.', prereqs: ['stats/empirical-cdf', 'stats/confidence-intervals'] },
        { id: 'kernel-density-estimation', title: 'Kernel density estimation', summary: 'Smooth histograms, bandwidth choice and the bias–variance trade-off in smoothing.', prereqs: ['stats/visualizing-distributions', 'stats/estimators-bias-variance'] },
        { id: 'nonparametric-regression', title: 'Nonparametric regression', summary: 'Local averaging, splines and LOESS when a straight line is too rigid.', prereqs: ['stats/kernel-density-estimation', 'stats/linear-regression'] },
      ],
      references: [
        wasserman('Ch. 7–8, 20'),
        { authors: 'B. Efron, R. J. Tibshirani', title: 'An Introduction to the Bootstrap', year: 1993, venue: 'Chapman & Hall/CRC' },
        { authors: 'B. Efron', title: 'Bootstrap methods: another look at the jackknife', year: 1979, venue: 'The Annals of Statistics 7(1), 1–26' },
        { authors: 'M. Hollander, D. A. Wolfe, E. Chicken', title: 'Nonparametric Statistical Methods', year: 2014, venue: '3rd ed., Wiley' },
      ],
    },
    {
      id: 'multivariate',
      title: 'Multivariate statistics',
      summary: 'Many variables at once: the multivariate normal, dimension reduction, clustering and classification.',
      lessons: [
        { id: 'multivariate-normal', title: 'The multivariate normal', summary: 'Mean vectors, covariance matrices, elliptical contours and conditional distributions.', prereqs: ['stats/covariance-correlation', 'stats/normal-distribution', 'math/vectors-matrices'] },
        { id: 'pca', title: 'Principal component analysis', summary: 'Finding the directions of greatest variance via eigenvectors of the covariance matrix.', prereqs: ['stats/multivariate-normal', 'math/eigenvalues'] },
        { id: 'factor-analysis', title: 'Factor analysis', summary: 'Explaining correlations among many variables with a few latent factors.', prereqs: ['stats/pca'] },
        { id: 'clustering', title: 'Clustering', summary: 'k-means, hierarchical clustering and Gaussian mixtures for finding groups.', prereqs: ['stats/multivariate-normal'] },
        { id: 'discriminant-analysis', title: 'Discriminant analysis', summary: 'LDA and QDA: classifying with Gaussian class models.', prereqs: ['stats/multivariate-normal', 'stats/conditional-probability-bayes'] },
      ],
      references: [
        { authors: 'R. A. Johnson, D. W. Wichern', title: 'Applied Multivariate Statistical Analysis', year: 2007, venue: '6th ed., Pearson', detail: 'Ch. 4, 8, 9, 11, 12' },
        esl('Ch. 4, 14'),
        { authors: 'K. Pearson', title: 'On lines and planes of closest fit to systems of points in space', year: 1901, venue: 'Philosophical Magazine 2(11), 559–572' },
      ],
    },
    {
      id: 'time-series',
      title: 'Time series',
      summary: 'Data that arrive in order: dependence over time, ARIMA models, forecasting and frequencies.',
      lessons: [
        { id: 'time-series-basics', title: 'Time series basics', summary: 'Trend, seasonality, noise; stationarity and the autocorrelation function.', prereqs: ['stats/covariance-correlation'] },
        { id: 'ar-ma-models', title: 'AR, MA and ARMA models', summary: 'Building dependence from white noise; reading ACF and PACF plots.', prereqs: ['stats/time-series-basics'] },
        { id: 'arima-forecasting', title: 'ARIMA & forecasting', summary: 'Differencing, model fitting and prediction intervals for future values.', prereqs: ['stats/ar-ma-models'] },
        { id: 'spectral-analysis', title: 'Spectral analysis', summary: 'Decomposing a series into frequencies with the periodogram.', prereqs: ['stats/time-series-basics'] },
        { id: 'state-space-models', title: 'State-space models & the Kalman filter', summary: 'Hidden states evolving over time, tracked recursively from noisy observations.', prereqs: ['stats/ar-ma-models', 'stats/multivariate-normal'] },
      ],
      references: [
        { authors: 'R. H. Shumway, D. S. Stoffer', title: 'Time Series Analysis and Its Applications: With R Examples', year: 2017, venue: '4th ed., Springer', detail: 'Ch. 1–4, 6' },
        { authors: 'R. J. Hyndman, G. Athanasopoulos', title: 'Forecasting: Principles and Practice', year: 2021, venue: '3rd ed., OTexts', url: 'https://otexts.com/fpp3/' },
        { authors: 'G. E. P. Box, G. M. Jenkins', title: 'Time Series Analysis: Forecasting and Control', year: 1970, venue: 'Holden-Day' },
      ],
    },
    {
      id: 'survival',
      title: 'Survival analysis',
      summary: 'Time-to-event data with censoring: survival curves, hazards and the Cox model.',
      lessons: [
        { id: 'survival-analysis', title: 'Survival data & censoring', summary: 'Survival and hazard functions, and why censored observations still carry information.', prereqs: ['stats/continuous-distributions'] },
        { id: 'kaplan-meier', title: 'Kaplan–Meier estimator', summary: 'Estimating a survival curve step by step from censored data.', prereqs: ['stats/survival-analysis'] },
        { id: 'log-rank-test', title: 'The log-rank test', summary: 'Comparing survival curves between groups.', prereqs: ['stats/kaplan-meier', 'stats/chi-square-tests'] },
        { id: 'cox-proportional-hazards', title: 'Cox proportional hazards', summary: 'Regression for hazards: hazard ratios, partial likelihood and checking proportionality.', prereqs: ['stats/kaplan-meier', 'stats/glm-framework'] },
        { id: 'parametric-survival', title: 'Parametric survival models', summary: 'Exponential, Weibull and accelerated failure time models fitted by maximum likelihood.', prereqs: ['stats/survival-analysis', 'stats/maximum-likelihood'] },
      ],
      references: [
        { authors: 'J. P. Klein, M. L. Moeschberger', title: 'Survival Analysis: Techniques for Censored and Truncated Data', year: 2003, venue: '2nd ed., Springer', detail: 'Ch. 2–4, 7–8' },
        { authors: 'E. L. Kaplan, P. Meier', title: 'Nonparametric estimation from incomplete observations', year: 1958, venue: 'Journal of the American Statistical Association 53(282), 457–481' },
        { authors: 'D. R. Cox', title: 'Regression models and life-tables', year: 1972, venue: 'Journal of the Royal Statistical Society B 34(2), 187–220' },
      ],
    },
    {
      id: 'causal-inference',
      title: 'Causal inference',
      summary: 'From correlation to causation: potential outcomes, causal graphs and methods for observational data.',
      lessons: [
        { id: 'causal-inference-intro', title: 'Correlation vs causation', summary: 'Potential outcomes, the fundamental problem of causal inference, and why randomization works.', prereqs: ['stats/experimental-design', 'stats/conditional-expectation'] },
        { id: 'causal-graphs-dags', title: 'Causal graphs (DAGs)', summary: 'Confounders, colliders and mediators; d-separation and the backdoor criterion.', prereqs: ['stats/causal-inference-intro'] },
        { id: 'confounding-adjustment', title: 'Adjusting for confounding', summary: 'Stratification, standardization and regression adjustment.', prereqs: ['stats/causal-graphs-dags', 'stats/multiple-regression'] },
        { id: 'propensity-scores', title: 'Propensity scores & weighting', summary: 'Matching and inverse probability weighting to mimic a randomized trial.', prereqs: ['stats/confounding-adjustment', 'stats/logistic-regression'] },
        { id: 'instrumental-variables', title: 'Instrumental variables', summary: 'Using a "natural experiment" to estimate effects despite unmeasured confounding.', prereqs: ['stats/causal-graphs-dags', 'stats/linear-regression'] },
        { id: 'diff-in-diff-rdd', title: 'Difference-in-differences & RDD', summary: 'Quasi-experimental designs that exploit timing and thresholds.', prereqs: ['stats/confounding-adjustment'] },
      ],
      references: [
        { authors: 'M. A. Hernán, J. M. Robins', title: 'Causal Inference: What If', year: 2020, venue: 'Chapman & Hall/CRC', detail: 'Ch. 1–7, 12, 15–16' },
        { authors: 'J. Pearl, M. Glymour, N. P. Jewell', title: 'Causal Inference in Statistics: A Primer', year: 2016, venue: 'Wiley' },
        wasserman('Ch. 16–17'),
        { authors: 'D. B. Rubin', title: 'Estimating causal effects of treatments in randomized and nonrandomized studies', year: 1974, venue: 'Journal of Educational Psychology 66(5), 688–701' },
        { authors: 'P. R. Rosenbaum, D. B. Rubin', title: 'The central role of the propensity score in observational studies for causal effects', year: 1983, venue: 'Biometrika 70(1), 41–55' },
      ],
    },
    {
      id: 'stochastic-processes-mcmc',
      title: 'Stochastic processes & MCMC',
      summary: 'Randomness that evolves in time — Markov chains, Poisson processes, Brownian motion — and simulation-based inference.',
      lessons: [
        { id: 'markov-chains', title: 'Markov chains', summary: 'Memoryless state-to-state jumps, transition matrices and multi-step probabilities.', prereqs: ['stats/conditional-probability-bayes'] },
        { id: 'stationary-distributions', title: 'Stationary distributions & convergence', summary: 'Long-run behaviour, irreducibility, periodicity, detailed balance and mixing.', prereqs: ['stats/markov-chains'] },
        { id: 'poisson-process', title: 'The Poisson process', summary: 'Random arrivals in time: exponential gaps, Poisson counts, thinning and superposition.', prereqs: ['stats/continuous-distributions'] },
        { id: 'random-walks-brownian', title: 'Random walks', summary: 'Gambler’s ruin, recurrence, and the √n spread of a random walk.', prereqs: ['stats/markov-chains', 'stats/central-limit-theorem'] },
        { id: 'brownian-motion', title: 'Brownian motion', summary: 'The continuous-time limit of random walks: independent Gaussian increments and rough paths.', prereqs: ['stats/random-walks-brownian'] },
        { id: 'monte-carlo', title: 'Monte Carlo simulation', summary: 'Estimating integrals and probabilities by simulation; importance sampling.', prereqs: ['stats/law-of-large-numbers'] },
        { id: 'mcmc', title: 'Markov chain Monte Carlo', summary: 'Metropolis–Hastings: building a Markov chain whose stationary distribution is your posterior.', prereqs: ['stats/stationary-distributions', 'stats/bayesian-inference', 'stats/monte-carlo'] },
        { id: 'gibbs-hmc', title: 'Gibbs sampling & HMC', summary: 'Sampling one coordinate at a time, Hamiltonian Monte Carlo, and diagnosing convergence.', prereqs: ['stats/mcmc'] },
      ],
      references: [
        blitzstein('Ch. 11–13'),
        { authors: 'S. M. Ross', title: 'Introduction to Probability Models', year: 2019, venue: '12th ed., Academic Press', detail: 'Ch. 4–5, 10' },
        { authors: 'J. R. Norris', title: 'Markov Chains', year: 1997, venue: 'Cambridge University Press' },
        bda3('Ch. 10–12'),
        { authors: 'N. Metropolis, A. W. Rosenbluth, M. N. Rosenbluth, A. H. Teller, E. Teller', title: 'Equation of state calculations by fast computing machines', year: 1953, venue: 'Journal of Chemical Physics 21, 1087–1092' },
      ],
    },
    {
      id: 'information-learning',
      title: 'Information theory & statistical learning',
      summary: 'Measuring information and surprise, and how classical statistics underpins machine learning.',
      lessons: [
        { id: 'entropy-kl', title: 'Entropy & KL divergence', summary: 'Entropy as average surprise, cross-entropy, and the KL divergence between distributions.', prereqs: ['stats/expectation-variance'] },
        { id: 'mutual-information', title: 'Mutual information', summary: 'How much knowing one variable reduces uncertainty about another.', prereqs: ['stats/entropy-kl', 'stats/joint-distributions'] },
        { id: 'information-criteria', title: 'AIC, BIC & likelihood', summary: 'Why maximizing likelihood minimizes KL, and penalizing complexity with AIC and BIC.', prereqs: ['stats/entropy-kl', 'stats/model-selection'] },
        { id: 'em-algorithm', title: 'The EM algorithm', summary: 'Maximum likelihood with hidden variables, illustrated with Gaussian mixtures.', prereqs: ['stats/maximum-likelihood', 'stats/clustering'] },
        { id: 'statistical-learning-bridge', title: 'From statistics to machine learning', summary: 'Prediction vs inference, bias–variance, cross-validation and classifiers as statistical models.', prereqs: ['stats/regularization', 'stats/logistic-regression', 'ml/generalization-bias-variance'] },
      ],
      references: [
        { authors: 'T. M. Cover, J. A. Thomas', title: 'Elements of Information Theory', year: 2006, venue: '2nd ed., Wiley', detail: 'Ch. 2' },
        { authors: 'D. J. C. MacKay', title: 'Information Theory, Inference, and Learning Algorithms', year: 2003, venue: 'Cambridge University Press', detail: 'Ch. 2, 22' },
        { authors: 'C. E. Shannon', title: 'A mathematical theory of communication', year: 1948, venue: 'Bell System Technical Journal 27, 379–423, 623–656' },
        islr('Ch. 2, 5–6'),
        esl('Ch. 7–8'),
      ],
    },
  ],
} satisfies Subject;

export default subject;
