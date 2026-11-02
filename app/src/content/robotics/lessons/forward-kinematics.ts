import type { LessonContent } from '../../types';

const ARM_SVG = String.raw`<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <line x1="20" y1="170" x2="305" y2="170" stroke="var(--muted)" stroke-width="1"/>
  <line x1="60" y1="190" x2="60" y2="10" stroke="var(--muted)" stroke-width="1"/>
  <text x="300" y="184" font-size="10" fill="var(--muted)">x</text>
  <text x="66" y="18" font-size="10" fill="var(--muted)">y</text>
  <line x1="144.3" y1="99.3" x2="182.6" y2="67.2" stroke="var(--muted)" stroke-dasharray="3 3"/>
  <line x1="144.3" y1="99.3" x2="144.3" y2="170" stroke="var(--c2)" stroke-dasharray="2 3" opacity="0.7"/>
  <line x1="165" y1="22" x2="165" y2="170" stroke="var(--c3)" stroke-dasharray="2 3" opacity="0.7"/>
  <line x1="60" y1="176" x2="144.3" y2="176" stroke="var(--c2)" stroke-width="2"/>
  <line x1="144.3" y1="176" x2="165" y2="176" stroke="var(--c3)" stroke-width="2"/>
  <text x="92" y="194" font-size="9" fill="var(--c2)">l₁cos θ₁</text>
  <text x="168" y="194" font-size="9" fill="var(--c3)">l₂cos(θ₁+θ₂)</text>
  <path d="M60,170 L144.3,99.3" stroke="var(--c2)" stroke-width="7" stroke-linecap="round"/>
  <path d="M144.3,99.3 L165,22" stroke="var(--c3)" stroke-width="7" stroke-linecap="round"/>
  <path d="M85,170 A25,25 0 0,0 79.2,153.9" fill="none" stroke="var(--c1)" stroke-width="1.5"/>
  <text x="90" y="160" font-size="10" fill="var(--c1)">θ₁</text>
  <path d="M163.5,83.2 A25,25 0 0,0 150.8,75.2" fill="none" stroke="var(--c1)" stroke-width="1.5"/>
  <text x="166" y="74" font-size="10" fill="var(--c1)">θ₂</text>
  <text x="94" y="128" font-size="10" fill="var(--c2)">l₁</text>
  <text x="140" y="60" font-size="10" fill="var(--c3)">l₂</text>
  <circle cx="60" cy="170" r="5" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>
  <circle cx="144.3" cy="99.3" r="4.5" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>
  <circle cx="165" cy="22" r="4" fill="var(--fg)">
    <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/>
  </circle>
  <text x="174" y="26" font-size="10" fill="var(--fg)">hand (x, y)</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Where is the hand?',
      body: String.raw`A robot arm's motors only know **joint angles**: each encoder reports "joint 1 is at 30°, joint 2 is at 60°". But the task lives in the world: "put the gripper at $(x, y)$".

**Forward kinematics (FK)** is the map from joint values to the pose (position + orientation) of the end-effector, the tool at the tip of the arm:
$$\theta=(\theta_1,\dots,\theta_n)\ \longmapsto\ T(\theta).$$

Move the sliders on this planar two-link arm and watch the hand coordinates. Press Play to sweep both joints and trace the hand's path.`,
      widget: { type: 'RobArm2Link', props: { mode: 'fk', l1: 1, l2: 0.7, q1: 30, q2: 60, showWorkspace: false }, caption: 'A planar 2R arm (two revolute joints). θ₂ is measured relative to link 1.' },
    },
    {
      kind: 'recall',
      title: 'Recall: homogeneous transforms',
      points: [
        String.raw`A pose of frame $\{b\}$ in frame $\{a\}$ is a rotation $R$ plus a translation $p$, packed into one matrix $T_{ab}=\begin{bmatrix}R&p\\0&1\end{bmatrix}$ (3×3 in the plane, 4×4 in 3D).`,
        String.raw`Transforms **compose by multiplication**: $T_{ac}=T_{ab}\,T_{bc}$; the order matters.`,
        String.raw`A point known in $\{b\}$ is expressed in $\{a\}$ by $\tilde p_a=T_{ab}\,\tilde p_b$, using homogeneous coordinates $\tilde p=(x,y,1)$.`,
      ],
      link: 'robotics/homogeneous-transforms',
    },
    {
      kind: 'explain',
      title: 'The 2R arm by trigonometry',
      body: String.raw`Let link lengths be $l_1, l_2$. Joint 1 rotates link 1 by $\theta_1$ from the $x$-axis; joint 2 rotates link 2 by $\theta_2$ **relative to link 1**, so link 2 points at the absolute angle $\theta_1+\theta_2$. Add the two link vectors:
$$x=l_1\cos\theta_1+l_2\cos(\theta_1+\theta_2),\qquad y=l_1\sin\theta_1+l_2\sin(\theta_1+\theta_2),$$
and the hand's orientation is $\varphi=\theta_1+\theta_2$.

**Worked example.** $l_1=1$, $l_2=0.7$, $\theta_1=0^\circ$, $\theta_2=90^\circ$: $x=1+0.7\cos 90^\circ=1$, $y=0+0.7\sin90^\circ=0.7$. The hand is at $(1, 0.7)$, pointing straight up.`,
      widget: { type: 'SvgDiagram', props: { svg: ARM_SVG }, caption: 'Each link contributes its own projection; the hand position is the sum.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`With $l_1=1$ m, $l_2=0.7$ m, $\theta_1=30^\circ$ and $\theta_2=60^\circ$, what is the hand's $y$-coordinate (in m)?`,
      answer: 1.2,
      tolerance: 0.01,
      unit: 'm',
      why: String.raw`$y=l_1\sin30^\circ+l_2\sin(30^\circ+60^\circ)=1(0.5)+0.7(1)=1.2$ m. A common slip is to use $\sin\theta_2$ instead of $\sin(\theta_1+\theta_2)$: link 2's angle is relative to link 1, so its absolute direction is the sum. (Here $x=\cos30^\circ+0.7\cos90^\circ\approx0.866$ m.)`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`Same arm ($l_1=1$, $l_2=0.7$). Joint 1 is at $\theta_1=90^\circ$ and joint 2 at $\theta_2=-90^\circ$. Where is the hand?`,
      choices: [String.raw`$(0.7,\ 1)$`, String.raw`$(1,\ 0.7)$`, String.raw`$(0,\ 1.7)$`, String.raw`$(-0.7,\ 1)$`],
      answer: 0,
      why: String.raw`Link 1 points straight up, so the elbow is at $(0,1)$. Link 2's absolute angle is $90^\circ-90^\circ=0^\circ$: it points along $+x$, adding $(0.7,0)$. Hand $=(0.7,1)$. $(0,1.7)$ would need $\theta_2=0$; $(-0.7,1)$ would need $\theta_2=+90^\circ$.`,
    },
    {
      kind: 'explain',
      title: 'FK as a chain of transforms',
      body: String.raw`Trigonometry gets messy beyond two links, so robots use the systematic route: attach a frame to every link and write the transform from each frame to the next. For the 2R arm, going from the base to the hand we **rotate by $\theta_1$, slide $l_1$ along the new $x$, rotate by $\theta_2$, slide $l_2$**:
$$T_{0h}(\theta)=\underbrace{\mathrm{Rot}(\theta_1)\,\mathrm{Trans}(l_1)}_{T_{01}(\theta_1)}\ \underbrace{\mathrm{Rot}(\theta_2)\,\mathrm{Trans}(l_2)}_{T_{1h}(\theta_2)}.$$

Each factor depends on **one** joint variable, and the product is read left to right from base to tip. For an $n$-joint serial arm, $T_{0n}=T_{01}(\theta_1)\,T_{12}(\theta_2)\cdots T_{n-1,n}(\theta_n)$ — just $n$ matrix multiplications, so FK is always cheap and always has exactly one answer.`,
    },
    {
      kind: 'widget',
      title: 'Multiply it out',
      body: 'Step through the product to recover the trigonometric formulas. Write $c_1=\\cos\\theta_1$, $s_{12}=\\sin(\\theta_1+\\theta_2)$, and so on.',
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`First factor: rotate by $\theta_1$, then slide $l_1$ along the rotated $x$-axis: $$T_{01}=\begin{bmatrix}c_1&-s_1&l_1c_1\\ s_1&c_1&l_1s_1\\ 0&0&1\end{bmatrix}.$$`,
            String.raw`Second factor, same shape with joint 2: $$T_{1h}=\begin{bmatrix}c_2&-s_2&l_2c_2\\ s_2&c_2&l_2s_2\\ 0&0&1\end{bmatrix}.$$`,
            String.raw`Rotation block of the product: $R(\theta_1)R(\theta_2)=R(\theta_1+\theta_2)$, because planar rotations add their angles. So the hand orientation is $\varphi=\theta_1+\theta_2$.`,
            String.raw`Translation column: $R(\theta_1)\begin{bmatrix}l_2c_2\\ l_2s_2\end{bmatrix}+\begin{bmatrix}l_1c_1\\ l_1s_1\end{bmatrix}=\begin{bmatrix}l_1c_1+l_2(c_1c_2-s_1s_2)\\ l_1s_1+l_2(s_1c_2+c_1s_2)\end{bmatrix}.$`,
            String.raw`Angle-addition identities give $$T_{0h}=\begin{bmatrix}c_{12}&-s_{12}&l_1c_1+l_2c_{12}\\ s_{12}&c_{12}&l_1s_1+l_2s_{12}\\ 0&0&1\end{bmatrix},$$ exactly the formulas from before, with orientation included for free.`,
          ],
        },
      },
    },
    {
      kind: 'truefalse',
      prompt: 'For a serial arm, every set of joint values gives exactly one end-effector pose, but a given pose may be produced by several different sets of joint values.',
      answer: true,
      why: String.raw`FK is a function: plug in $\theta$, multiply the matrices, get one $T$. The reverse need not be unique. The 2R arm can reach most points "elbow-up" or "elbow-down". Going backwards is the job of [inverse kinematics](@robotics/inverse-kinematics), which can have zero, several or infinitely many solutions.`,
    },
    {
      kind: 'widget',
      title: 'The workspace',
      body: String.raw`The **workspace** is the set of hand positions the arm can reach. For a 2R arm whose joints turn freely, the hand distance from the base is $r=\sqrt{x^2+y^2}$, and the law of cosines gives $r^2=l_1^2+l_2^2+2l_1l_2\cos\theta_2$. As $\theta_2$ sweeps from $180^\circ$ to $0^\circ$, $r$ grows from $|l_1-l_2|$ to $l_1+l_2$, and $\theta_1$ spins that around the base. The result is the shaded **annulus**
$$|l_1-l_2|\le r\le l_1+l_2.$$
Change the link lengths: when $l_1=l_2$ the hole shrinks to a single point, so the hand can touch the base. Real joint limits cut this region down further.`,
      widget: { type: 'RobArm2Link', props: { mode: 'fk', l1: 1, l2: 0.7, q1: 40, q2: 120, showWorkspace: true, lengthSliders: true } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`What is the area of the workspace of a 2R arm with $l_1=1$ m and $l_2=0.7$ m (joints unlimited)? Give m², to two decimals.`,
      answer: 8.80,
      tolerance: 0.02,
      unit: 'm²',
      why: String.raw`Annulus with outer radius $1.7$ and inner radius $0.3$: $\pi(1.7^2-0.3^2)=\pi(2.89-0.09)=2.8\pi\approx8.80$ m². Forgetting the hole gives $\pi\cdot2.89\approx9.08$.`,
    },
    {
      kind: 'fill',
      prompt: 'Forward kinematics maps ___ space to ___ space. For a serial arm it is computed by ___ the link-to-link transforms from base to tip.',
      bank: ['joint', 'task', 'multiplying', 'adding', 'inverting', 'image'],
      answer: ['joint', 'task', 'multiplying'],
      why: 'Joint space holds the joint variables θ; task space holds end-effector poses. FK is the ordered product T₀₁T₁₂⋯ of homogeneous transforms. Inverting is what IK would need, and there is no closed form for that in general.',
    },
    {
      kind: 'explain',
      title: 'In 3D: Denavit–Hartenberg parameters',
      body: String.raw`A spatial joint transform has six numbers in general, but Denavit and Hartenberg (1955) showed that by placing link frames cleverly (each $z_i$ axis along a joint axis, each $x_i$ along the common normal between consecutive axes), **four parameters per link** suffice:
$$T_{i-1,i}=\mathrm{Rot}_z(\theta_i)\,\mathrm{Trans}_z(d_i)\,\mathrm{Trans}_x(a_i)\,\mathrm{Rot}_x(\alpha_i).$$
For a revolute joint $\theta_i$ is the variable; for a prismatic joint $d_i$ is. A whole industrial arm is then just a table of $n$ rows. The 2R arm's table is $(\theta_1,0,l_1,0)$ and $(\theta_2,0,l_2,0)$, which reproduces our product. Beware: "classic" (distal) and "modified" (proximal, Craig's) DH conventions put the frames in different places. Full details are in [DH parameters](@robotics/dh-parameters).`,
    },
    {
      kind: 'match',
      prompt: 'Match each classic DH parameter of link $i$ to its meaning.',
      pairs: [
        [String.raw`$\theta_i$`, String.raw`Joint angle: rotation about $z_{i-1}$ (the variable of a revolute joint)`],
        [String.raw`$d_i$`, String.raw`Link offset: translation along $z_{i-1}$ (the variable of a prismatic joint)`],
        [String.raw`$a_i$`, String.raw`Link length: distance between the $z_{i-1}$ and $z_i$ axes, along $x_i$`],
        [String.raw`$\alpha_i$`, String.raw`Link twist: angle from $z_{i-1}$ to $z_i$, about $x_i$`],
      ],
      why: 'Two parameters (θ, d) act along/about the previous z-axis and two (a, α) act along/about the new x-axis, in the order Rot_z · Trans_z · Trans_x · Rot_x. A planar arm has every twist α = 0 and every offset d = 0.',
    },
    {
      kind: 'explain',
      title: 'Another route: the product of exponentials',
      body: String.raw`DH ties the frames to the links. The **product of exponentials (PoE)** formula (Brockett 1984) needs only two things: the hand pose $M$ when all joints are zero (the "home" configuration), and each joint's **screw axis** $\mathcal S_i$ written in the base frame at home. Then
$$T(\theta)=e^{[\mathcal S_1]\theta_1}\,e^{[\mathcal S_2]\theta_2}\cdots e^{[\mathcal S_n]\theta_n}\,M.$$
Read it right to left: start at home, move the last joint, then the one before it, and so on. Each factor is a rigid motion about one fixed axis. PoE avoids DH's frame-placement rules and is the convention in Lynch & Park's *Modern Robotics*. See [product of exponentials](@robotics/product-of-exponentials).`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps for computing the forward kinematics of a serial arm with the transform-chain method.',
      steps: [
        'Attach a coordinate frame to the base, to each link and to the end-effector',
        String.raw`Write each link-to-link transform $T_{i-1,i}(\theta_i)$ as a function of its single joint variable`,
        String.raw`Plug in the current joint values (from the encoders)`,
        String.raw`Multiply the transforms in order from base to tip: $T_{0n}=T_{01}T_{12}\cdots T_{n-1,n}$`,
        'Read the hand position from the last column and the orientation from the rotation block',
      ],
      why: 'Frames must exist before transforms between them can be written; matrices must be multiplied in base-to-tip order because matrix multiplication does not commute; the answer is then read off the final homogeneous matrix.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Forward kinematics** maps joint values $\theta$ to the end-effector pose $T(\theta)$. It is always unique and cheap to compute.
- Planar 2R arm: $x=l_1c_1+l_2c_{12}$, $y=l_1s_1+l_2s_{12}$, $\varphi=\theta_1+\theta_2$. Relative joint angles **add** along the chain.
- In general, FK is a **product of homogeneous transforms**, one per joint, multiplied from base to tip.
- The 2R workspace is the annulus $|l_1-l_2|\le r\le l_1+l_2$ (smaller once joint limits apply).
- In 3D, links are described by **DH parameters** $(\theta_i,d_i,a_i,\alpha_i)$ or by the **product of exponentials** $e^{[\mathcal S_1]\theta_1}\cdots e^{[\mathcal S_n]\theta_n}M$.

Next: going backwards, from a desired hand pose to joint angles, in [inverse kinematics](@robotics/inverse-kinematics).`,
    },
  ],
  references: [
    { authors: 'K. M. Lynch & F. C. Park', title: 'Modern Robotics: Mechanics, Planning, and Control', year: 2017, venue: 'Cambridge University Press', detail: 'Ch. 4 (Forward kinematics; PoE in 4.1, DH in Appendix C)', url: 'https://hades.mech.northwestern.edu/index.php/Modern_Robotics' },
    { authors: 'M. W. Spong, S. Hutchinson & M. Vidyasagar', title: 'Robot Modeling and Control', year: 2020, venue: '2nd ed., Wiley', detail: 'Ch. 3 (Forward kinematics)' },
    { authors: 'J. J. Craig', title: 'Introduction to Robotics: Mechanics and Control', year: 2017, venue: '4th ed., Pearson', detail: 'Ch. 3 (Manipulator kinematics; modified DH convention)' },
    { authors: 'J. Denavit & R. S. Hartenberg', title: 'A kinematic notation for lower-pair mechanisms based on matrices', year: 1955, venue: 'ASME Journal of Applied Mechanics 22, 215–221' },
    { authors: 'R. W. Brockett', title: 'Robotic manipulators and the product of exponentials formula', year: 1984, venue: 'Mathematical Theory of Networks and Systems, Lecture Notes in Control and Information Sciences 58, Springer' },
  ],
} satisfies LessonContent;
