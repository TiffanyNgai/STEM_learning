import type { LessonContent } from '../../types';

const msmSvg = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
<g font-size="9" text-anchor="middle">
${[[40, 40], [70, 70], [40, 100], [100, 40], [100, 105]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="var(--c2)" fill-opacity="0.7"/>`).join('')}
${[[220, 40], [250, 75], [280, 45], [230, 105], [285, 105]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="var(--c3)" fill-opacity="0.7"/>`).join('')}
<path d="M40,40 L70,70 L40,100 M70,70 L100,40 M70,70 L100,105 M220,40 L250,75 L280,45 M250,75 L230,105 M250,75 L285,105" stroke="var(--muted)" stroke-width="2.5"/>
<path d="M100,105 Q170,135 230,105" fill="none" stroke="var(--c5)" stroke-width="1" stroke-dasharray="3 3"/>
<circle r="4" fill="var(--fg)"><animateMotion dur="7s" repeatCount="indefinite" path="M40,40 L70,70 L40,100 L70,70 L100,105 Q170,135 230,105 L250,75 L280,45 L250,75 L220,40" keyPoints="0;0.08;0.16;0.24;0.32;0.6;0.7;0.8;0.9;1" keyTimes="0;0.1;0.2;0.3;0.45;0.55;0.65;0.75;0.85;1" calcMode="linear"/></circle>
<text x="70" y="20" fill="var(--c2)" font-weight="700">macrostate A (e.g. bound)</text>
<text x="252" y="20" fill="var(--c3)" font-weight="700">macrostate B (unbound)</text>
<text x="165" y="146" fill="var(--c5)">rare transition (slow process)</text>
<text x="165" y="70" fill="var(--muted)">thick = frequent</text>
<text x="165" y="82" fill="var(--muted)">jumps between</text>
<text x="165" y="94" fill="var(--muted)">microstates</text>
</g></svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Many short movies instead of one long one',
      body: String.raw`One trajectory long enough to watch a ligand unbind repeatedly might take years of computing. But hundreds of independent 100 ns runs can be done in parallel on GPU clusters, cloud machines or volunteer projects such as Folding@home. None of them sees the whole process, but each one sees **some** transitions.

A **Markov state model (MSM)** stitches them together. Chop conformational space into discrete **states**, count how often the trajectories jump from state $i$ to state $j$ in a fixed **lag time** $\tau$, and build a transition matrix. Multiplying that matrix by itself then predicts behaviour on timescales far longer than any single simulation.`,
    },
    {
      kind: 'recall',
      title: 'Markov chains (from Statistics)',
      points: [
        'A **Markov chain** jumps between states with probabilities that depend only on the current state (no memory).',
        'Transition matrix $T_{ij} = P(\\text{state } j \\text{ next} \\mid \\text{state } i \\text{ now})$; rows sum to 1.',
        'Propagate a distribution by $\\mathbf p(t+1) = \\mathbf p(t)\\,T$, and $n$ steps by $T^n$.',
        'The **stationary distribution** $\\boldsymbol\\pi$ satisfies $\\boldsymbol\\pi = \\boldsymbol\\pi T$.',
      ],
      link: 'stats/markov-chains',
    },
    {
      kind: 'explain',
      title: 'Building an MSM',
      body: String.raw`1. **Featurise** each frame: backbone torsions, contact distances, ligand–pocket distances.
2. **Reduce dimensions** to the slowest-changing combinations, typically with **TICA** (time-lagged independent component analysis; Pérez-Hernández et al. 2013).
3. **Cluster** frames (e.g. k-means) into tens to thousands of **microstates**.
4. **Count** transitions $C_{ij}(\tau)$ from state $i$ at time $t$ to state $j$ at $t+\tau$, and estimate $T(\tau)$, usually with detailed balance (reversibility) enforced.
5. **Validate**: implied timescales and a Chapman–Kolmogorov test.
6. **Coarse-grain** into a few metastable **macrostates** (e.g. PCCA+) for interpretation.`,
      widget: { type: 'SvgDiagram', props: { svg: msmSvg }, caption: 'Microstates (circles) interconvert quickly within each metastable macrostate. Jumps between macrostates are rare, and they set the slow timescales an MSM is built to capture.' },
    },
    {
      kind: 'order',
      prompt: 'Put the MSM pipeline in order.',
      steps: [
        'Run many independent MD simulations',
        'Compute features (distances, torsions)',
        'Project onto slow coordinates with TICA',
        'Cluster frames into microstates',
        'Count transitions at lag time τ and estimate T(τ)',
        'Validate with implied timescales and a Chapman–Kolmogorov test',
      ],
      why: 'States must exist before transitions can be counted, and a model must be estimated before it can be validated. TICA comes before clustering so that the clusters separate the *slow* motions rather than fast, irrelevant ones.',
    },
    {
      kind: 'explain',
      title: 'Eigenvalues are timescales',
      body: String.raw`$T(\tau)$ has eigenvalues $1=\lambda_1>\lambda_2\ge\lambda_3\ge\dots$. The eigenvalue 1 belongs to equilibrium ($\boldsymbol\pi$). Every other eigenvalue is a relaxation process that decays as $\lambda_i^{\,n}$ after $n$ steps, i.e. as $e^{-n\tau/t_i}$. Solving gives the **implied timescale**

$$t_i = -\frac{\tau}{\ln\lambda_i(\tau)}.$$

The matching eigenvector shows *which* states exchange in that process; for example, $t_2$ might be the bound ↔ unbound exchange.

The catch is **Markovianity**. Lumping many structures into one state hides memory (where inside the state you are affects where you go next). At short $\tau$ this makes the timescales come out too short. Increase $\tau$ until the $t_i$ stop changing (a **plateau**), but keep $\tau$ shorter than the processes you care about.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`An MSM built with lag time $\tau = 10$ ns has second eigenvalue $\lambda_2 = 0.95$. What is the implied timescale $t_2$ in ns?`,
      answer: 194.96,
      tolerance: 1,
      unit: 'ns',
      why: String.raw`$t_2 = -10/\ln 0.95 = -10/(-0.0513) \approx 195$ ns. A common slip is to compute $10/(1-0.95) = 200$ ns, which is close only because $\ln\lambda\approx\lambda-1$ when $\lambda$ is near 1. Use the logarithm.`,
    },
    {
      kind: 'widget',
      title: 'Implied timescales versus lag time',
      body: 'Press **Compute** to simulate one long double-well trajectory (top strip, 1.5 million steps, which takes a second or two) and discretise it in three ways. Fine states plateau almost immediately near the true relaxation time (dashed). Two states split at the barrier need longer lags. A badly placed boundary (red dashed line in the strip) underestimates t₂ at every lag shown and approaches it only slowly.',
      widget: { type: 'DrugImpliedTimescales', props: {}, caption: 'Implied timescales below the grey diagonal (t₂ < τ) cannot be resolved. Draw a new trajectory to see the statistical noise.' },
    },
    {
      kind: 'mcq',
      prompt: 'In an implied-timescale plot, how should you choose the lag time τ?',
      choices: [
        'The shortest τ at which the slow timescales have levelled off (plateaued)',
        'Always the shortest τ available, to maximise time resolution',
        'Whatever τ gives the largest implied timescales, however long',
        'A τ longer than the slowest process of interest',
      ],
      answer: 0,
      why: 'At the plateau the model is Markovian, so the timescales no longer depend on τ. Very short lags are non-Markovian and underestimate timescales. A τ beyond the process you want hides it entirely, and you cannot resolve timescales shorter than τ.',
    },
    {
      kind: 'explain',
      title: 'A two-state worked example',
      body: String.raw`Take states A and B with, per lag time $\tau = 1$ ns, $P(A\to B)=a=0.01$ and $P(B\to A)=b=0.04$:

$$T=\begin{pmatrix}1-a & a\\ b & 1-b\end{pmatrix}=\begin{pmatrix}0.99&0.01\\0.04&0.96\end{pmatrix}.$$

- Stationary populations: $\pi_A=\dfrac{b}{a+b}=0.8$, $\pi_B=0.2$. That gives a free-energy difference of $k_BT\ln 4\approx0.83$ kcal/mol at 300 K.
- Second eigenvalue: $\lambda_2 = 1-a-b = 0.95$, so $t_2=-1/\ln 0.95\approx19.5$ ns.

The same matrix gives **thermodynamics** (populations, via $\boldsymbol\pi$) and **kinetics** (timescales, via $\lambda_2$). For a ligand, this means affinity *and* on/off rates.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Two-state MSM: $P(A\to B) = 0.02$ and $P(B\to A) = 0.06$ per lag time. What is the equilibrium population of state A?`,
      answer: 0.75,
      tolerance: 0.005,
      why: String.raw`$\pi_A = b/(a+b) = 0.06/0.08 = 0.75$. At equilibrium the flows balance: $\pi_A a = \pi_B b$, i.e. $0.75\times0.02 = 0.25\times0.06 = 0.015$. Mixing up $a$ and $b$ gives 0.25.`,
    },
    {
      kind: 'explain',
      title: 'Validating and choosing a model',
      body: String.raw`- **Chapman–Kolmogorov test**: if the model is Markovian, $T(k\tau)\approx T(\tau)^k$. Compare predicted and directly estimated populations at multiples of $\tau$ (Prinz et al. 2011).
- **Connectivity**: keep only states that are reached *and* left in the data. A state visited once is a statistical ghost.
- **Bias–variance trade-off**: more, finer states reduce discretisation error but need more data per transition count.
- **Variational scoring**: the slowest eigenvalues obey a variational principle, so features, TICA dimension and cluster count can be chosen by cross-validated scores such as VAMP-2 (reviewed by Husic & Pande 2018).

Tools include PyEMMA, MSMBuilder and deeptime. **Adaptive sampling** restarts new simulations from poorly sampled states, putting compute where the model is most uncertain.`,
    },
    {
      kind: 'truefalse',
      prompt: 'If an MSM is Markovian at lag τ, then the transition matrix estimated at lag 2τ should be close to T(τ) multiplied by itself.',
      answer: true,
      why: 'This is the Chapman–Kolmogorov equation, T(2τ) = T(τ)². A large disagreement means memory effects remain: try a longer lag time or better state definitions.',
    },
    {
      kind: 'explain',
      title: 'MSMs in drug discovery',
      body: String.raw`- **Binding pathways and kinetics**: Buch, Giorgino & De Fabritiis (2011) ran hundreds of 100 ns simulations of benzamidine binding to trypsin and built an MSM that recovered the binding free energy and $k_{\text{on}}$ close to experiment.
- **Residence time**: $k_{\text{off}}$ correlates with drug efficacy for some targets, and MSMs (often combined with enhanced sampling) can estimate it.
- **Cryptic pockets and allostery**: MSMs reveal rare states with pockets absent from crystal structures.
- **Conformational selection**: populations of active and inactive states, e.g. for kinases and GPCRs.

The limits are real. Results are only as good as the force field and sampling, and processes slower than the total simulated time remain out of reach.`,
    },
    {
      kind: 'match',
      prompt: 'Match each MSM concept to its meaning.',
      pairs: [
        ['Lag time τ', 'Time interval at which transitions are counted'],
        ['Implied timescale', '−τ / ln λᵢ, the relaxation time of one process'],
        ['Stationary distribution', 'Left eigenvector with eigenvalue 1: equilibrium populations'],
        ['TICA', 'Linear projection onto the slowest-decorrelating coordinates'],
        ['PCCA+', 'Lumps microstates into metastable macrostates'],
      ],
      why: 'Lag time and implied timescales describe kinetics; the stationary distribution describes thermodynamics. TICA acts before clustering, PCCA+ after the model is built.',
    },
    {
      kind: 'multi',
      prompt: 'Which statements about Markov state models are correct?',
      choices: [
        'They can combine many short, independent simulations into one kinetic model',
        'The same transition matrix gives both equilibrium populations and relaxation timescales',
        'They can predict events on timescales longer than any single trajectory used to build them',
        'They remove all dependence on force-field accuracy',
      ],
      answers: [0, 1, 2],
      why: 'Short trajectories each contribute local transition counts, and powers of T extrapolate to long times. But the model inherits every error of the force field and the sampling: an MSM is a statistical lens on the simulations, not a correction to them.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- An **MSM** discretises conformations into states and counts transitions at lag time $\tau$ to estimate a transition matrix $T(\tau)$.
- Pipeline: features → TICA → clustering → counts → reversible $T(\tau)$ → validation → PCCA+ macrostates.
- **Implied timescales** $t_i=-\tau/\ln\lambda_i$. Choose $\tau$ where they plateau, and check $T(k\tau)\approx T(\tau)^k$.
- $\boldsymbol\pi$ gives thermodynamics and the eigenvalues give kinetics, enough to estimate binding rates from many short simulations.`,
    },
  ],
  references: [
    { authors: 'Prinz, J.-H., Wu, H., Sarich, M., Keller, B., Senne, M., Held, M., Chodera, J. D., Schütte, C., Noé, F.', title: 'Markov models of molecular kinetics: generation and validation', year: 2011, venue: 'J. Chem. Phys. 134, 174105' },
    { authors: 'Husic, B. E., Pande, V. S.', title: 'Markov state models: from an art to a science', year: 2018, venue: 'J. Am. Chem. Soc. 140, 2386–2396' },
    { authors: 'Pérez-Hernández, G., Paul, F., Giorgino, T., De Fabritiis, G., Noé, F.', title: 'Identification of slow molecular order parameters for Markov model construction', year: 2013, venue: 'J. Chem. Phys. 139, 015102' },
    { authors: 'Buch, I., Giorgino, T., De Fabritiis, G.', title: 'Complete reconstruction of an enzyme-inhibitor binding process by molecular dynamics simulations', year: 2011, venue: 'Proc. Natl. Acad. Sci. USA 108, 10184–10189' },
  ],
} satisfies LessonContent;
