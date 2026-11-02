import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Learning without a map',
      body: String.raw`Value iteration needs the transition probabilities $P(s'\mid s,a)$ — a full map of the world. Usually we don't have one: a robot doesn't know its motor physics, a game-playing agent doesn't know the game's code.

**Q-learning** learns optimal behaviour purely from **trial and error**: act, observe what happened, nudge a table of estimates $Q(s,a)$, repeat. Press Play: the blue agent starts knowing nothing. Over hundreds of episodes, value seeps back from the goal and the arrows organize into a route.`,
      widget: { type: 'GridWorldRL', props: { algorithm: 'q-learning', epsilon: 0.2, gamma: 0.9 }, caption: 'Triangles: Q(s,a) per action (green > 0, red < 0). Arrow: greedy action. Raise “speed” to fast-forward.' },
    },
    {
      kind: 'recall',
      title: 'Recall: temporal-difference learning',
      points: [
        String.raw`TD learning updates a value estimate toward a **bootstrapped target** that uses the next estimate: $V(s)\leftarrow V(s)+\alpha\,[r+\gamma V(s')-V(s)]$.`,
        String.raw`The bracket $\delta=r+\gamma V(s')-V(s)$ is the **TD error**: the surprise between prediction and one-step reality.`,
        String.raw`$\alpha\in(0,1]$ is the step size (learning rate).`,
      ],
      link: 'ml/td-learning',
    },
    {
      kind: 'explain',
      title: 'The target: Bellman optimality for Q',
      body: String.raw`The optimal action values satisfy the **Bellman optimality equation** (see [Bellman equations](@ml/bellman-equations)):
$$Q^*(s,a)=\mathbb E\Big[R_{t+1}+\gamma\max_{a'}Q^*(S_{t+1},a')\ \Big|\ S_t=s,A_t=a\Big].$$
"Take $a$ now, then behave optimally forever." Once you know $Q^*$, acting optimally needs no model at all: $\pi^*(s)=\arg\max_aQ^*(s,a)$.

That is why we learn $Q$ rather than $V$: choosing an action from $V$ alone would require a model to look one step ahead.`,
    },
    {
      kind: 'explain',
      title: 'The Q-learning update',
      body: String.raw`After each transition $(s,a,r,s')$ (Watkins 1989):
$$Q(s,a)\leftarrow Q(s,a)+\alpha\Big[\underbrace{r+\gamma\max_{a'}Q(s',a')}_{\text{TD target}}-Q(s,a)\Big],$$
with the target equal to just $r$ if $s'$ is terminal. Each update is a noisy, sampled step of the Bellman optimality backup — **stochastic approximation**.

**Worked example.** $Q(s,a)=0.2$, reward $r=0$, $\gamma=0.9$, best next value $\max_{a'}Q(s',a')=0.8$, $\alpha=0.5$. Target $=0+0.9\cdot0.8=0.72$; TD error $=0.52$; new $Q(s,a)=0.2+0.5\cdot0.52=0.46$.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`$Q(s,a)=1.0$, you receive $r=-1$, land in $s'$ with $\max_{a'}Q(s',a')=2.0$, and $\gamma=0.5$, $\alpha=0.1$. What is the updated $Q(s,a)$?`,
      answer: 0.9,
      tolerance: 0.0001,
      why: String.raw`Target $=-1+0.5\cdot2=0$; TD error $=0-1=-1$; new value $=1+0.1\cdot(-1)=0.9$. The estimate moves only a fraction $\alpha$ of the way toward the target, averaging over noisy outcomes.`,
    },
    {
      kind: 'explain',
      title: 'Off-policy, and when it converges',
      body: String.raw`The agent must **explore** to learn, typically with **ε-greedy** behaviour: with probability $\varepsilon$ take a random action, otherwise $\arg\max_aQ(s,a)$. But the target uses $\max_{a'}$ — the value of the *greedy* policy. So Q-learning is **off-policy**: it learns about the greedy (target) policy while following a different (behaviour) policy.

**Theorem** (Watkins & Dayan 1992). In a finite MDP, tabular Q-learning converges to $Q^*$ with probability 1 if every state–action pair is updated infinitely often and the step sizes satisfy the Robbins–Monro conditions $\sum_t\alpha_t=\infty$, $\sum_t\alpha_t^2<\infty$ (e.g. $\alpha_t=1/n(s,a)$).`,
    },
    {
      kind: 'multi',
      prompt: 'Which conditions are part of the standard convergence guarantee for tabular Q-learning? (Select all that apply.)',
      choices: [
        'Every state–action pair is visited infinitely often',
        String.raw`Step sizes with $\sum\alpha_t=\infty$ and $\sum\alpha_t^2<\infty$`,
        'The behaviour policy is the greedy policy',
        'The transition probabilities are known to the agent',
      ],
      answers: [0, 1],
      why: 'Q-learning is off-policy, so the behaviour policy may be anything that keeps visiting all pairs (purely greedy behaviour can stop doing so). It is model-free: P is never needed — only sampled transitions.',
    },
    {
      kind: 'fill',
      prompt: String.raw`With ε-greedy exploration, the agent takes a ___ action with probability ε and the ___ action otherwise. Q-learning is ___ because its target uses a max over next actions rather than the action actually taken.`,
      bank: ['random', 'greedy', 'off-policy', 'on-policy', 'worst', 'model-based'],
      answer: ['random', 'greedy', 'off-policy'],
      why: 'ε trades exploration (random) against exploitation (greedy). Because the update evaluates the greedy policy regardless of what the agent actually does next, Q-learning is off-policy; SARSA, which uses the action actually taken, is on-policy.',
    },
    {
      kind: 'widget',
      title: 'Play with exploration',
      body: String.raw`Reset and experiment:
- $\varepsilon=1$: a pure random walk. It still learns good Q-values (off-policy!) but its returns are poor.
- $\varepsilon=0.2$: a balance of learning and earning.
- $\varepsilon=0$: purely greedy. Surprisingly it still finds the goal here — see the next question.
Also try $\gamma=0.5$: values near the start shrink toward zero.`,
      widget: { type: 'GridWorldRL', props: { algorithm: 'q-learning', epsilon: 0, gamma: 0.9 } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`With $\varepsilon=0$, $Q$ initialized to $0$, and a step reward of $-0.04$, the greedy agent still keeps trying new actions until it finds the goal. Why?`,
      choices: [
        'Because the discount factor forces exploration.',
        'Because every action tried so far has only collected step costs and dropped below 0, so untried actions (still 0) look best and get tried next.',
        'Because Q-learning adds noise to its updates.',
        'Because the goal reward is positive.',
      ],
      answer: 1,
      why: String.raw`Before the goal is found, each tried action gets a negative estimate (the step cost), so the argmax keeps switching to untried actions. Zero acts as an *optimistic* start relative to what the agent has seen so far — the idea behind **optimism in the face of uncertainty** — even though it is below the true $Q^*$ near the goal (e.g. $0.9^5\approx0.59$). Once the goal's positive reward propagates back, greedy behaviour can lock onto the first route it found, which may be mediocre.`,
    },
    {
      kind: 'widget',
      title: 'SARSA vs Q-learning on a cliff',
      body: String.raw`**SARSA** is the on-policy cousin: its target is $r+\gamma Q(s',a')$, where $a'$ is the action the ε-greedy agent *actually* takes next. On this cliff (the bottom row is a pit), with $\varepsilon=0.2$:
- **Q-learning** learns the optimal path hugging the cliff edge — but while exploring it occasionally stumbles in.
- **SARSA** accounts for its own random moves and learns the safer route along the top.

Run each for a few hundred episodes (raise the speed) and compare the arrows near the cliff (the classic example from Sutton & Barto, Ex. 6.6).`,
      widget: { type: 'GridWorldRL', props: { algorithm: 'sarsa', layout: ['......', '......', 'SPPPPG'], epsilon: 0.2, gamma: 0.95 } },
    },
    {
      kind: 'order',
      prompt: 'Order one step of tabular Q-learning.',
      steps: [
        String.raw`Observe the current state $s$`,
        String.raw`Choose $a$ ε-greedily from $Q(s,\cdot)$`,
        String.raw`Execute $a$; observe reward $r$ and next state $s'$`,
        String.raw`Compute target $r+\gamma\max_{a'}Q(s',a')$ (just $r$ if $s'$ is terminal)`,
        String.raw`Update $Q(s,a)$ toward the target by step size $\alpha$; set $s\leftarrow s'$`,
      ],
      why: 'The target needs the observed reward and next state, which exist only after acting. Terminal states have no future, so their bootstrap term is dropped.',
    },
    {
      kind: 'explain',
      title: 'From tables to deep Q-networks',
      body: String.raw`Tables fail when states are images. **DQN** (Mnih et al. 2015) uses a network $Q_\theta(s,a)$ and minimizes
$$\big(r+\gamma\max_{a'}Q_{\theta^-}(s',a')-Q_\theta(s,a)\big)^2,$$
with two stabilizers: a **replay buffer** (train on random past transitions, breaking correlations) and a **target network** $\theta^-$ (a frozen copy, re-synced only every $C$ steps, so the target doesn't chase itself). It reached human-level play on many Atari games from pixels.

Caveats: combining function approximation, bootstrapping and off-policy data — the **deadly triad** — can diverge; and $\max$ over noisy estimates is biased upward (**maximization bias**), reduced by Double Q-learning. See [DQN](@ml/dqn).`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Even if each $Q(s',a')$ estimate is unbiased, $\max_{a'}Q(s',a')$ tends to *overestimate* $\max_{a'}Q^*(s',a')$.`,
      answer: true,
      why: String.raw`By Jensen's inequality, $\mathbb E[\max_a\hat Q_a]\ge\max_a\mathbb E[\hat Q_a]$: the max preferentially picks estimates whose noise happens to be positive. Double Q-learning decouples choosing the argmax from evaluating it, using two estimators to remove this bias.`,
    },
    {
      kind: 'match',
      prompt: 'Match each term to its meaning.',
      pairs: [
        ['Off-policy', 'Learns about a policy different from the one generating the data'],
        ['On-policy (SARSA)', 'Target uses the action the behaviour policy actually takes next'],
        ['Bootstrapping', 'Target includes the current estimate of the next state’s value'],
        ['Replay buffer', 'Stores past transitions to train on random mini-batches'],
      ],
      why: 'Q-learning (off-policy) vs SARSA (on-policy) differ only in the target’s next-action term; both bootstrap. Replay is a DQN ingredient that only works because Q-learning is off-policy — old data came from older policies.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Q-learning: $Q(s,a)\leftarrow Q(s,a)+\alpha[r+\gamma\max_{a'}Q(s',a')-Q(s,a)]$ — a sampled Bellman optimality backup; model-free.
- It is off-policy: behave ε-greedily, learn the greedy policy's values.
- Tabular convergence to $Q^*$ needs infinite visits to every $(s,a)$ and Robbins–Monro step sizes.
- SARSA (on-policy) learns the value of the exploring policy and is safer while exploring.
- DQN scales Q-learning with neural nets, replay and target networks; watch out for the deadly triad and maximization bias.`,
    },
  ],
  references: [
    { authors: 'R. S. Sutton & A. G. Barto', title: 'Reinforcement Learning: An Introduction', year: 2018, venue: '2nd ed., MIT Press', detail: 'Ch. 6 (§6.4–6.7)', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
    { authors: 'C. J. C. H. Watkins & P. Dayan', title: 'Q-learning', year: 1992, venue: 'Machine Learning 8, 279–292' },
    { authors: 'V. Mnih et al.', title: 'Human-level control through deep reinforcement learning', year: 2015, venue: 'Nature 518, 529–533' },
    { authors: 'H. van Hasselt, A. Guez & D. Silver', title: 'Deep Reinforcement Learning with Double Q-learning', year: 2016, venue: 'AAAI' },
  ],
} satisfies LessonContent;
