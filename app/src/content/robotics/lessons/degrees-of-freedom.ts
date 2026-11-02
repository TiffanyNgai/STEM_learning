import type { LessonContent } from '../../types';

// Crank–rocker four-bar: ground A(0,0)–D(3,0), crank AB = 1, coupler BC = 3, rocker DC = 2.5 (keyframes precomputed).
const BX = '131.0;130.5;128.8;126.2;122.6;118.1;113.0;107.3;101.3;95.0;88.7;82.7;77.0;71.9;67.4;63.8;61.2;59.5;59.0;59.5;61.2;63.8;67.4;71.9;77.0;82.7;88.7;95.0;101.3;107.3;113.0;118.1;122.6;126.2;128.8;130.5;131.0';
const BY = '150.0;143.7;137.7;132.0;126.9;122.4;118.8;116.2;114.5;114.0;114.5;116.2;118.8;122.4;126.9;132.0;137.7;143.7;150.0;156.3;162.3;168.0;173.1;177.6;181.2;183.8;185.5;186.0;185.5;183.8;181.2;177.6;173.1;168.0;162.3;156.3;150.0';
const CX = '191.8;198.8;203.9;206.7;207.5;206.3;203.6;199.6;194.7;189.1;183.2;177.1;171.1;165.3;159.9;154.9;150.5;146.6;143.4;140.7;138.7;137.1;136.1;135.6;135.5;136.0;137.0;138.6;140.8;143.8;147.8;152.8;159.0;166.4;174.7;183.5;191.8';
const CY = '60.7;60.1;60.0;60.1;60.1;60.1;60.0;60.1;60.4;61.1;62.2;63.8;65.8;68.3;71.0;73.9;76.9;79.9;82.6;85.0;87.1;88.7;89.8;90.4;90.4;89.9;88.8;87.2;85.0;82.2;78.9;75.3;71.5;67.8;64.6;62.1;60.7';
const an = (attr: string, values: string) => `<animate attributeName="${attr}" values="${values}" dur="6s" repeatCount="indefinite"/>`;

const FOURBAR_SVG = String.raw`<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <line x1="70" y1="150" x2="230" y2="150" stroke="var(--muted)" stroke-width="3"/>
  <g stroke="var(--muted)" stroke-width="1">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => `<line x1="${72 + i * 10}" y1="152" x2="${66 + i * 10}" y2="160"/>`).join('')}</g>
  <circle cx="95" cy="150" r="36" fill="none" stroke="var(--grid)" stroke-dasharray="3 3"/>
  <line x1="95" y1="150" x2="131" y2="150" stroke="var(--c2)" stroke-width="6" stroke-linecap="round">${an('x2', BX)}${an('y2', BY)}</line>
  <line x1="131" y1="150" x2="191.8" y2="60.7" stroke="var(--c3)" stroke-width="6" stroke-linecap="round">${an('x1', BX)}${an('y1', BY)}${an('x2', CX)}${an('y2', CY)}</line>
  <line x1="203" y1="150" x2="191.8" y2="60.7" stroke="var(--c1)" stroke-width="6" stroke-linecap="round">${an('x2', CX)}${an('y2', CY)}</line>
  <circle cx="95" cy="150" r="5" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>
  <circle cx="203" cy="150" r="5" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>
  <circle cx="131" cy="150" r="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5">${an('cx', BX)}${an('cy', BY)}</circle>
  <circle cx="191.8" cy="60.7" r="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5">${an('cx', CX)}${an('cy', CY)}</circle>
  <text x="92" y="176" font-size="10" fill="var(--c2)">crank</text>
  <text x="212" y="110" font-size="10" fill="var(--c1)">rocker</text>
  <text x="150" y="28" font-size="10" fill="var(--c3)">coupler</text>
  <text x="140" y="172" font-size="10" fill="var(--muted)">ground (link 1)</text>
  <text x="10" y="18" font-size="10" fill="var(--fg)">N = 4 links, J = 4 revolute joints</text>
  <text x="10" y="32" font-size="10" fill="var(--fg)">dof = 3(4 − 1 − 4) + 4 = 1</text>
</svg>`;

const TORUS_SVG = String.raw`<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <rect x="20" y="30" width="120" height="120" fill="var(--c2)" opacity="0.12" stroke="var(--fg)"/>
  <path d="M20,30 l0,120" stroke="var(--c5)" stroke-width="3"/><path d="M140,30 l0,120" stroke="var(--c5)" stroke-width="3"/>
  <path d="M20,30 l120,0" stroke="var(--c1)" stroke-width="3"/><path d="M20,150 l120,0" stroke="var(--c1)" stroke-width="3"/>
  <path d="M14,95 l6,-8 l6,8" fill="none" stroke="var(--c5)" stroke-width="2"/><path d="M134,95 l6,-8 l6,8" fill="none" stroke="var(--c5)" stroke-width="2"/>
  <path d="M75,24 l8,6 l-8,6" fill="none" stroke="var(--c1)" stroke-width="2"/><path d="M75,144 l8,6 l-8,6" fill="none" stroke="var(--c1)" stroke-width="2"/>
  <text x="80" y="168" font-size="10" text-anchor="middle" fill="var(--fg)">θ₁ from −180° to 180°</text>
  <text x="10" y="20" font-size="10" fill="var(--fg)">θ₂ ↑</text>
  <circle r="4" fill="var(--c3)">
    <animate attributeName="cx" values="60;140;20;60" keyTimes="0;0.5;0.5;1" dur="4s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="110;70;70;50" keyTimes="0;0.5;0.5;1" dur="4s" repeatCount="indefinite"/>
  </circle>
  <text x="160" y="94" font-size="18" fill="var(--muted)">⟶</text>
  <ellipse cx="245" cy="95" rx="65" ry="38" fill="var(--c2)" opacity="0.12" stroke="var(--fg)"/>
  <path d="M215,92 Q245,112 275,92" fill="none" stroke="var(--fg)"/>
  <path d="M222,98 Q245,82 268,98" fill="none" stroke="var(--fg)"/>
  <ellipse cx="245" cy="95" rx="48" ry="22" fill="none" stroke="var(--c1)" stroke-width="2"/>
  <ellipse cx="190" cy="95" rx="10" ry="16" fill="none" stroke="var(--c5)" stroke-width="2"/>
  <text x="245" y="152" font-size="10" text-anchor="middle" fill="var(--fg)">glue matching edges: a torus T²</text>
  <text x="160" y="185" font-size="9" text-anchor="middle" fill="var(--muted)">the dot leaves the right edge and re-enters on the left</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'How many numbers describe a robot?',
      body: String.raw`Slide a coin around on a table. To say exactly where it is you need **three** numbers: its position $(x, y)$ and the angle $\theta$ it has been turned through. Fewer won't do; more would be redundant.

The **configuration** of a robot is a complete specification of where every point of it is. The smallest number of real numbers needed to specify the configuration is its number of **degrees of freedom (DOF)**. The set of all configurations is the **configuration space**, or **C-space**, and DOF is its dimension.

A rigid body moving in the plane has 3 DOF. A rigid body in 3D space, such as a drone, has **6**: three for position and three for orientation.`,
    },
    {
      kind: 'numeric',
      prompt: 'Two separate rigid bodies (say, two drones) fly freely in 3D space. How many degrees of freedom does the pair have?',
      answer: 12,
      tolerance: 0,
      why: 'Each free rigid body in space has 6 DOF (3 position + 3 orientation), and with no joint between them nothing is constrained: 6 + 6 = 12.',
    },
    {
      kind: 'explain',
      title: 'Joints remove freedoms',
      body: String.raw`Connecting bodies with **joints** removes freedom. A **revolute** joint (hinge) lets two bodies only rotate about one axis relative to each other: it allows 1 freedom, so in space it imposes $6-1=5$ constraints. A **prismatic** (sliding) joint also allows 1. A **universal** joint (two perpendicular hinges) allows 2; a **spherical** (ball) joint allows 3, like your shoulder.

The counting rule is simple in spirit:
$$\text{DOF}=(\text{freedoms of the bodies})-(\text{independent constraints}).$$`,
    },
    {
      kind: 'match',
      prompt: 'Match each joint to the number of degrees of freedom it allows between the two bodies it connects.',
      pairs: [
        ['Revolute (hinge)', '1, a rotation about one axis'],
        ['Cylindrical', '2, a rotation and a slide along the same axis'],
        ['Spherical (ball-and-socket)', '3, any rotation about a point'],
        ['Rigid weld', '0, the bodies move as one'],
      ],
      why: 'Revolute and prismatic joints allow 1 freedom each; cylindrical and universal joints allow 2; spherical joints allow 3. A weld allows none.',
    },
    {
      kind: 'explain',
      title: 'Grübler’s formula',
      body: String.raw`For a mechanism with $N$ links (**counting the fixed ground as a link**), $J$ joints, and joint $i$ allowing $f_i$ freedoms,
$$\text{dof}=m\,(N-1-J)+\sum_{i=1}^{J}f_i,$$
where $m=3$ for planar mechanisms and $m=6$ for spatial ones. Reason: the $N-1$ moving links would have $m(N-1)$ freedoms; each joint removes $m-f_i$ of them.

**Worked example: planar 2R arm.** Ground plus two links: $N=3$; two revolute joints: $J=2$, $f_1=f_2=1$. So dof $=3(3-1-2)+2=2$, one per joint, as expected for an open chain.

The formula assumes the joint constraints are **independent**. For special geometries (e.g. some parallelogram linkages) they are not, and the true DOF can be higher: Grübler then gives only a lower bound.`,
    },
    {
      kind: 'widget',
      title: 'A closed chain: the four-bar linkage',
      body: String.raw`Close the loop and things change. In a **four-bar linkage** the links form a ring: ground, crank, coupler, rocker, joined by 4 revolute joints. Grübler gives $3(4-1-4)+4=1$: turning the crank alone fixes the position of everything else, as the animation shows. Four-bars are everywhere: windscreen wipers, bicycle suspensions, excavator buckets.`,
      widget: { type: 'SvgDiagram', props: { svg: FOURBAR_SVG }, caption: 'One motor on the crank drives the whole mechanism: 1 DOF.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A planar **five-bar** linkage has 5 links (including ground) joined in a single loop by 5 revolute joints. Using Grübler's formula, how many DOF does it have?`,
      answer: 2,
      tolerance: 0,
      why: String.raw`$m=3$, $N=5$, $J=5$, $\sum f_i=5$: dof $=3(5-1-5)+5=-3+5=2$. So a five-bar needs two motors; many "parallel" pick-and-place robots and drawing machines use exactly this mechanism.`,
    },
    {
      kind: 'order',
      prompt: 'Put the steps of applying Grübler’s formula in order.',
      steps: [
        'Decide whether the mechanism is planar (m = 3) or spatial (m = 6)',
        'Count the links N, including the fixed ground',
        'Count the joints J and add up the freedoms f_i each allows',
        'Compute m(N − 1 − J) + Σ f_i',
        'Sanity-check for dependent constraints (special geometry) that would make the true DOF larger',
      ],
      why: 'm sets how much freedom each body has; N and J (with the f_i) are then plugged into the formula. The last step matters because Grübler assumes independent constraints and can undercount for special geometries.',
    },
    {
      kind: 'explain',
      title: 'The shape of C-space',
      body: String.raw`DOF is the dimension of C-space, but C-space also has a **shape** (topology). For the 2R arm with joints that spin freely, each angle lives on a circle: $\theta_1=180^\circ$ and $\theta_1=-180^\circ$ are the same configuration. A square of angle pairs whose opposite edges are glued together is a **torus** (doughnut surface), $T^2=S^1\times S^1$, not a flat plane.

Other examples: a car-like robot on the floor has C-space $\mathbb R^2\times S^1$ (position and heading); a free rigid body in space has $\mathbb R^3\times SO(3)$, where $SO(3)$ is the space of 3D rotations from [rotation matrices](@robotics/rotation-matrices). Topology matters for planning: the shortest route between two arm configurations may go "through the edge".`,
      widget: { type: 'SvgDiagram', props: { svg: TORUS_SVG } },
    },
    {
      kind: 'widget',
      title: 'Explore the 2R arm’s C-space',
      body: String.raw`Each pair of slider values $(\theta_1,\theta_2)$ is one point of the torus. Push $\theta_1$ to $180^\circ$ and then to $-180^\circ$: the arm looks identical, confirming the edge identification. Press Play to wander through C-space while the orange curve shows the corresponding path of the hand in **task space**.`,
      widget: { type: 'RobArm2Link', props: { mode: 'fk', q1: 170, q2: 40, showWorkspace: false } },
    },
    {
      kind: 'mcq',
      prompt: 'A planar arm has one revolute joint (unlimited rotation) followed by one prismatic joint (sliding between limits). What is the topology of its C-space?',
      choices: [
        String.raw`A torus $S^1\times S^1$`,
        String.raw`A cylinder $S^1\times[a,b]$`,
        String.raw`A plane $\mathbb R^2$`,
        String.raw`A sphere $S^2$`,
      ],
      answer: 1,
      why: String.raw`The revolute angle wraps around (a circle $S^1$); the prismatic extension is a bounded interval $[a,b]$ that does not wrap. Their product is a finite cylinder. A torus would need both coordinates to wrap.`,
    },
    {
      kind: 'explain',
      title: 'Task space, redundancy and constraints',
      body: String.raw`The task often needs fewer numbers than the robot has. Placing a gripper anywhere with any orientation in 3D needs 6 numbers, so general-purpose arms have **6 joints**. Many research arms (and your own arm, roughly: 3 at the shoulder, 1 at the elbow, 1 for forearm twist, 2 at the wrist) have **7**: one more than the task needs. Such robots are **redundant**: they can move their elbow while the hand stays still, which helps avoid obstacles. See [task space & workspace](@robotics/task-space-workspace).

Conversely, some constraints limit **velocities** without reducing the C-space dimension. A car has a 3-dimensional C-space $(x,y,\theta)$, yet it cannot slide sideways. Such **nonholonomic** constraints are why parallel parking takes several manoeuvres.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Because a car cannot slide sideways, its configuration space has only 2 dimensions.',
      answer: false,
      why: String.raw`The no-sideways-slip constraint restricts the car’s *velocity*, not which configurations it can reach: by manoeuvring it can reach any $(x,y,\theta)$, so its C-space is still 3-dimensional. Constraints of this kind are called nonholonomic.`,
    },
    {
      kind: 'fill',
      prompt: 'A free rigid body in the plane has ___ DOF and in space has ___ DOF. A robot with more joints than its task requires is called ___.',
      bank: ['3', '6', '2', '7', 'redundant', 'singular', 'underactuated'],
      answer: ['3', '6', 'redundant'],
      why: 'Planar: x, y and one angle. Spatial: three positions and three orientation angles. Extra joints beyond the task’s needs make a robot redundant; “underactuated” means the opposite situation (fewer actuators than DOF).',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A robot’s **configuration** says where all of it is; **DOF** is the minimum number of numbers needed, i.e. the dimension of the **C-space**.
- Free rigid body: **3 DOF** in the plane, **6 DOF** in space.
- **Grübler:** dof $=m(N-1-J)+\sum f_i$ with $m=3$ (planar) or $6$ (spatial) and ground counted as a link; valid when constraints are independent.
- Open chains have one DOF per 1-DOF joint; closed chains (four-bar: 1 DOF) have fewer.
- C-space has **topology**: the 2R arm’s is a torus, a mobile robot’s is $\mathbb R^2\times S^1$.
- Extra joints give **redundancy**; velocity-only (nonholonomic) constraints do not reduce DOF.`,
    },
  ],
  references: [
    { authors: 'K. M. Lynch & F. C. Park', title: 'Modern Robotics: Mechanics, Planning, and Control', year: 2017, venue: 'Cambridge University Press', detail: 'Ch. 2 (Configuration space: DOF, Grübler’s formula, C-space topology)', url: 'https://hades.mech.northwestern.edu/index.php/Modern_Robotics' },
    { authors: 'S. M. LaValle', title: 'Planning Algorithms', year: 2006, venue: 'Cambridge University Press', detail: 'Ch. 4 (The configuration space)', url: 'http://lavalle.pl/planning/' },
    { authors: 'T. Lozano-Pérez', title: 'Spatial planning: a configuration space approach', year: 1983, venue: 'IEEE Transactions on Computers C-32(2), 108–120' },
    { authors: 'J. J. Craig', title: 'Introduction to Robotics: Mechanics and Control', year: 2017, venue: '4th ed., Pearson', detail: 'Ch. 1 and 3' },
  ],
} satisfies LessonContent;
