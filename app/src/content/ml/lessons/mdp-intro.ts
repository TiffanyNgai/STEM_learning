import type { LessonContent } from '../../types';

// Animated agent–environment loop.
const LOOP_SVG = `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="mdp-a" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--fg)"/></marker></defs>
<rect x="110" y="10" width="100" height="40" rx="8" fill="var(--surface)" stroke="var(--c2)" stroke-width="2"/>
<text x="160" y="35" font-size="13" text-anchor="middle" fill="var(--fg)">Agent π(a|s)</text>
<rect x="110" y="115" width="100" height="40" rx="8" fill="var(--surface)" stroke="var(--c1)" stroke-width="2"/>
<text x="160" y="140" font-size="13" text-anchor="middle" fill="var(--fg)">Environment</text>
<path d="M210,30 C285,30 285,135 212,135" fill="none" stroke="var(--fg)" stroke-width="1.4" marker-end="url(#mdp-a)"/>
<text x="290" y="86" font-size="11" fill="var(--c2)" text-anchor="end">action A_t</text>
<path d="M110,128 C40,128 40,38 108,38" fill="none" stroke="var(--fg)" stroke-width="1.4" marker-end="url(#mdp-a)"/>
<path d="M110,145 C15,145 15,22 108,22" fill="none" stroke="var(--fg)" stroke-width="1.4" marker-end="url(#mdp-a)"/>
<text x="62" y="86" font-size="11" fill="var(--c1)" text-anchor="middle">S_t+1</text>
<text x="10" y="86" font-size="11" fill="var(--c3)">R_t+1</text>
<circle r="5" fill="var(--c2)"><animateMotion dur="3s" repeatCount="indefinite" path="M210,30 C285,30 285,135 212,135"/></circle>
<circle r="5" fill="var(--c1)"><animateMotion dur="3s" begin="1.5s" repeatCount="indefinite" path="M110,128 C40,128 40,38 108,38"/></circle>
<circle r="4" fill="var(--c3)"><animateMotion dur="3s" begin="1.5s" repeatCount="indefinite" path="M110,145 C15,145 15,22 108,22"/></circle>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Learning by acting',
      body: String.raw`A child learning to ride a bike gets no labelled examples — only consequences: wobbling, falling, gliding. **Reinforcement learning (RL)** formalizes this: an **agent** repeatedly observes a **state**, picks an **action**, and the **environment** answers with a new state and a numerical **reward**. The goal is to choose actions that maximize total reward over time — even when the payoff comes many steps later.

The mathematical model of this loop is the **Markov decision process (MDP)**.`,
      widget: { type: 'SvgDiagram', props: { svg: LOOP_SVG }, caption: 'At each time step t: observe S_t, choose A_t, receive R_t+1 and S_t+1.' },
    },
    {
      kind: 'recall',
      title: 'Recall: Markov chains',
      points: [
        String.raw`A Markov chain moves between states with transition probabilities $P(s'\mid s)$.`,
        String.raw`**Markov property:** the future depends on the past only through the present state, $P(S_{t+1}\mid S_t,S_{t-1},\dots)=P(S_{t+1}\mid S_t)$.`,
        'An MDP is a Markov chain whose transitions are steered by actions and which pays out rewards.',
      ],
      link: 'stats/markov-chains',
    },
    {
      kind: 'explain',
      title: 'The MDP tuple',
      body: String.raw`An MDP is $(\mathcal S,\mathcal A,P,R,\gamma)$:
- $\mathcal S$ — **states** (e.g. grid cells);
- $\mathcal A$ — **actions** (up, right, down, left);
- $P(s'\mid s,a)$ — **transition probabilities**: chance of landing in $s'$ after doing $a$ in $s$;
- $R(s,a,s')$ — **reward** (a number; possibly random), e.g. $+1$ at a goal, $-1$ in a pit, $-0.04$ per step;
- $\gamma\in[0,1)$ — **discount factor**: how much future reward counts.

The Markov property now reads $P(S_{t+1},R_{t+1}\mid S_t,A_t,\text{history})=P(S_{t+1},R_{t+1}\mid S_t,A_t)$: the state must contain everything relevant for predicting the future.`,
    },
    {
      kind: 'match',
      prompt: 'A robot vacuum is modelled as an MDP. Match each MDP element to its example.',
      pairs: [
        [String.raw`State $s$`, 'Current position and battery level'],
        [String.raw`Action $a$`, 'Move forward, turn, or return to dock'],
        [String.raw`Transition $P(s'\mid s,a)$`, 'Chance the wheels slip when moving forward'],
        [String.raw`Reward $R$`, '+1 per cleaned tile, −10 if the battery dies'],
      ],
      why: 'States describe the situation (including battery, otherwise the Markov property fails); actions are the agent’s choices; P captures uncertainty in their outcomes; rewards encode the designer’s goal.',
    },
    {
      kind: 'explain',
      title: 'Return and discounting',
      body: String.raw`The agent maximizes the **return** — the discounted sum of future rewards:
$$G_t=R_{t+1}+\gamma R_{t+2}+\gamma^2R_{t+3}+\dots=\sum_{k=0}^{\infty}\gamma^kR_{t+k+1}.$$

Why discount? A reward $k$ steps away is worth $\gamma^k$ of one now — like interest on money. With $\gamma<1$ and rewards bounded by $R_{\max}$, the sum is finite: $|G_t|\le R_{\max}/(1-\gamma)$. The **effective horizon** is about $1/(1-\gamma)$ steps ($\gamma=0.99\Rightarrow\sim100$ steps).

**Example.** Reward $1$ forever with $\gamma=0.9$: $G=1+0.9+0.81+\dots=\frac1{1-0.9}=10$. Also note the recursion $G_t=R_{t+1}+\gamma G_{t+1}$ — the seed of the Bellman equation.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`An episode yields rewards $R_1=0,\ R_2=0,\ R_3=1$, then ends. With $\gamma=0.9$, what is the return $G_0$?`,
      answer: 0.81,
      tolerance: 0.001,
      why: String.raw`$G_0=R_1+\gamma R_2+\gamma^2R_3=0+0+0.81\cdot1=0.81$. The reward arrives two steps after the first one, so it is discounted by $\gamma^2$, not $\gamma^3$ (a common off-by-one slip).`,
    },
    {
      kind: 'explain',
      title: 'Policies and value functions',
      body: String.raw`A **policy** $\pi(a\mid s)$ is the agent's behaviour: the probability of each action in each state (deterministic if it always picks one action).

Two functions measure how good a policy is:
$$V^\pi(s)=\mathbb E_\pi[G_t\mid S_t=s],\qquad Q^\pi(s,a)=\mathbb E_\pi[G_t\mid S_t=s,A_t=a].$$
$V^\pi$ ("state value") = expected return from $s$ following $\pi$; $Q^\pi$ ("action value") = expected return after first taking $a$, then following $\pi$. They are linked by $V^\pi(s)=\sum_a\pi(a\mid s)\,Q^\pi(s,a)$.

The **optimal** values are $V^*(s)=\max_\pi V^\pi(s)$ and $Q^*(s,a)=\max_\pi Q^\pi(s,a)$; acting greedily w.r.t. $Q^*$ is optimal.`,
    },
    {
      kind: 'widget',
      title: 'See the optimal values',
      body: String.raw`This runs **value iteration** (a planning algorithm you will meet in [dynamic programming](@ml/dynamic-programming-rl)) on a grid world: goal $+1$, pit $-1$, $-0.04$ per step. Each cell is split into four triangles coloured by $Q(s,a)$ for each action; the arrow is the best action and the number is $V(s)=\max_aQ(s,a)$.

Press Play and watch value spread backwards from the goal, one sweep at a time. Then lower $\gamma$ and Reset: far-away cells care less about the distant goal.`,
      widget: { type: 'GridWorldRL', props: { algorithm: 'value-iteration', gamma: 0.9 } },
    },
    {
      kind: 'truefalse',
      prompt: 'In every finite MDP (finitely many states and actions, γ < 1) there is an optimal policy that is deterministic and stationary (does not depend on time).',
      answer: true,
      why: String.raw`Classical MDP theory (e.g. Puterman 1994): take $\pi^*(s)=\arg\max_aQ^*(s,a)$. Randomness is never needed in a single-agent, fully observed MDP — though stochastic policies are useful for exploration, for policy-gradient learning, and in games or partially observed settings.`,
    },
    {
      kind: 'explain',
      title: 'A first look at the Bellman equation',
      body: String.raw`Plug $G_t=R_{t+1}+\gamma G_{t+1}$ into the definition of $V^\pi$:
$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\big[R(s,a,s')+\gamma V^\pi(s')\big].$$
"Value here = expected immediate reward + discounted value of where I land." It is a system of linear equations, one per state.

**Example.** One state that always loops to itself with reward $2$, $\gamma=0.5$: $V=2+0.5V\Rightarrow V=4$. The full story, including the optimality version with a $\max$, is in [Bellman equations](@ml/bellman-equations).`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A single state loops to itself forever with reward $2$ per step and $\gamma=0.8$. Solve $V=2+\gamma V$ for $V$.`,
      answer: 10,
      tolerance: 0.001,
      why: String.raw`$V(1-\gamma)=2\Rightarrow V=2/0.2=10$, matching the geometric series $2(1+0.8+0.8^2+\dots)$. Forgetting the discount would make the value infinite.`,
    },
    {
      kind: 'widget',
      title: 'Slippery floors change the plan',
      body: String.raw`Now each move **slips** sideways with probability 0.2 (left or right of the intended direction, 0.1 each). Play value iteration and compare the arrows near the pit with the previous grid: the optimal policy sometimes walks *away* from the pit or into a wall, accepting a longer route to avoid a risky slip. The best plan depends on $P$, not just on the map.`,
      widget: { type: 'GridWorldRL', props: { algorithm: 'value-iteration', layout: ['...G', '.#.P', '....'], slip: 0.2, gamma: 0.95 } },
    },
    {
      kind: 'mcq',
      prompt: String.raw`What typically happens to the optimal policy as you raise $\gamma$ from 0.1 toward 0.99 in a task where reaching a distant goal requires several costly steps?`,
      choices: [
        'Nothing — the optimal policy never depends on γ.',
        'The agent becomes more far-sighted and is willing to pay short-term costs to reach the distant reward.',
        'The agent becomes more short-sighted.',
        'The values all become zero.',
      ],
      answer: 1,
      why: String.raw`A reward $k$ steps away is weighted by $\gamma^k$. With small $\gamma$ a goal 10 steps away is worth almost nothing compared with immediate step costs, so the agent may not bother; with $\gamma$ near 1 the distant reward dominates. $\gamma$ is part of the problem specification, not just a numerical knob.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these situations satisfy the Markov property with the stated state? (Select all that apply.)',
      choices: [
        'Chess, with the state being the full board, whose turn it is, castling and en-passant rights',
        'A ball in flight, with the state being only its position (no velocity)',
        'A grid world, with the state being the agent’s cell',
        'Poker, with the state being only your own cards',
      ],
      answers: [0, 2],
      why: 'Chess with full board info and the grid cell both determine future dynamics. Position alone does not predict where a ball goes next (velocity is needed), and your own cards hide the opponents’ hands — those are partially observed (POMDP) settings unless the state is enriched.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- An MDP $(\mathcal S,\mathcal A,P,R,\gamma)$ models sequential decisions where the current state summarizes the past.
- The agent maximizes the return $G_t=\sum_k\gamma^kR_{t+k+1}$; $\gamma<1$ keeps it finite (horizon $\approx1/(1-\gamma)$).
- A policy $\pi(a\mid s)$ has values $V^\pi(s)$ and $Q^\pi(s,a)$; acting greedily on $Q^*$ is optimal, and a deterministic optimal policy exists.
- Values satisfy the recursive Bellman equation $V^\pi(s)=\mathbb E[R+\gamma V^\pi(S')]$.
- Next: solve MDPs with a known model ([dynamic programming](@ml/dynamic-programming-rl)) or learn from experience ([Q-learning](@ml/q-learning)).`,
    },
  ],
  references: [
    { authors: 'R. S. Sutton & A. G. Barto', title: 'Reinforcement Learning: An Introduction', year: 2018, venue: '2nd ed., MIT Press', detail: 'Ch. 3', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
    { authors: 'M. L. Puterman', title: 'Markov Decision Processes: Discrete Stochastic Dynamic Programming', year: 1994, venue: 'Wiley', detail: 'Ch. 4–6' },
    { authors: 'S. Russell & P. Norvig', title: 'Artificial Intelligence: A Modern Approach', year: 2020, venue: '4th ed., Pearson', detail: 'Ch. 17 (the 4×3 grid world)' },
  ],
} satisfies LessonContent;
