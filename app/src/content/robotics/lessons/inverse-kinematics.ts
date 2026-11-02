import type { LessonContent } from '../../types';

const TRIANGLE_SVG = String.raw`<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <line x1="20" y1="170" x2="310" y2="170" stroke="var(--grid)"/>
  <line x1="50" y1="170" x2="250" y2="150" stroke="var(--muted)" stroke-dasharray="4 3"/>
  <text x="196" y="170" font-size="10" fill="var(--muted)">r</text>
  <path d="M50,170 L163.8,228.6 L250,150" fill="none" stroke="var(--c4)" stroke-width="3" stroke-dasharray="5 4" stroke-linejoin="round">
    <animate attributeName="opacity" values="0.15;0.6;0.15" dur="3s" repeatCount="indefinite"/>
  </path>
  <text x="170" y="236" font-size="9" fill="var(--c4)">other solution</text>
  <path d="M50,170 L150,90" stroke="var(--c2)" stroke-width="7" stroke-linecap="round"/>
  <path d="M150,90 L250,150" stroke="var(--c3)" stroke-width="7" stroke-linecap="round"/>
  <text x="86" y="118" font-size="10" fill="var(--c2)">l₁</text>
  <text x="204" y="110" font-size="10" fill="var(--c3)">l₂</text>
  <path d="M134.4,102.5 A20,20 0 0,0 167.1,100.3" fill="none" stroke="var(--c1)" stroke-width="1.5"/>
  <text x="128" y="128" font-size="10" fill="var(--c1)">π − θ₂</text>
  <path d="M90,170 A40,40 0 0,0 89.8,166" fill="none" stroke="var(--c5)" stroke-width="1.5"/>
  <path d="M85,166.5 A35,35 0 0,0 77.3,148.1" fill="none" stroke="var(--c6)" stroke-width="1.5"/>
  <text x="94" y="164" font-size="9" fill="var(--c5)">β</text>
  <text x="84" y="146" font-size="9" fill="var(--c6)">ψ</text>
  <circle cx="50" cy="170" r="5" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>
  <circle cx="150" cy="90" r="4.5" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>
  <circle cx="250" cy="150" r="9" fill="none" stroke="var(--c1)" stroke-width="2"/>
  <text x="262" y="146" font-size="10" fill="var(--fg)">target (x, y)</text>
  <text x="30" y="188" font-size="9" fill="var(--fg)">base</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Running the arm backwards',
      body: String.raw`Tasks are specified in the world: "grasp the cup at $(1.1, 0.7)$". Motors need joint angles. **Inverse kinematics (IK)** asks: which joint values $\theta$ make the forward kinematics hit a desired pose,
$$\text{find }\theta\ \text{ such that }\ T(\theta)=T_{\text{desired}}?$$

Unlike FK, this is solving nonlinear equations, so there may be **no** solution, **several**, or **infinitely many**. Drag the target ⊕ around the two-link arm. Most targets have two solutions: the solid arm and its dashed mirror image.`,
      widget: { type: 'RobArm2Link', props: { mode: 'ik', l1: 1, l2: 0.7, target: [1.1, 0.7], showWorkspace: true }, caption: 'Solid: the chosen solution. Dashed: the other one. Shaded: the reachable workspace.' },
    },
    {
      kind: 'recall',
      title: 'Recall: forward kinematics of the 2R arm',
      points: [
        String.raw`$x=l_1\cos\theta_1+l_2\cos(\theta_1+\theta_2)$ and $y=l_1\sin\theta_1+l_2\sin(\theta_1+\theta_2)$.`,
        String.raw`$\theta_2$ is measured relative to link 1, so link 2 points at the absolute angle $\theta_1+\theta_2$.`,
        String.raw`The reachable workspace is the annulus $|l_1-l_2|\le r\le l_1+l_2$, where $r=\sqrt{x^2+y^2}$.`,
      ],
      link: 'robotics/forward-kinematics',
    },
    {
      kind: 'explain',
      title: 'Step 1: the elbow angle from the law of cosines',
      body: String.raw`Look at the triangle base–elbow–target. Its sides are $l_1$, $l_2$ and $r=\sqrt{x^2+y^2}$, and the interior angle at the elbow is $\pi-\theta_2$. The **law of cosines** gives
$$r^2=l_1^2+l_2^2-2l_1l_2\cos(\pi-\theta_2)=l_1^2+l_2^2+2l_1l_2\cos\theta_2,$$
so
$$\cos\theta_2=\frac{x^2+y^2-l_1^2-l_2^2}{2\,l_1l_2}\equiv c_2.$$
If $|c_2|\le1$ there are two candidates, $\theta_2=\pm\arccos c_2$. They correspond to the elbow on either side of the base–target line. Numerically it is better to write $\theta_2=\operatorname{atan2}\!\big(\pm\sqrt{1-c_2^2},\,c_2\big)$, which stays accurate when $c_2\approx\pm1$.`,
      widget: { type: 'SvgDiagram', props: { svg: TRIANGLE_SVG }, caption: 'The base–elbow–target triangle. Mirroring the elbow across the dashed line r gives the second solution.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`A 2R arm has $l_1=l_2=1$ m. The target is $(x,y)=(1,1)$. What is $|\theta_2|$ in degrees?`,
      answer: 90,
      tolerance: 0.5,
      unit: '°',
      why: String.raw`$c_2=\dfrac{1^2+1^2-1-1}{2\cdot1\cdot1}=0$, so $\theta_2=\pm90^\circ$. Check: the triangle has sides $1, 1, \sqrt2$, which is a right isosceles triangle with the right angle at the elbow.`,
    },
    {
      kind: 'explain',
      title: 'Step 2: the shoulder angle with atan2',
      body: String.raw`With $\theta_2$ chosen, the shoulder angle is the direction to the target, minus the angle that link 2 bends the arm away from that line:
$$\theta_1=\underbrace{\operatorname{atan2}(y,\,x)}_{\beta}\;-\;\underbrace{\operatorname{atan2}\!\big(l_2\sin\theta_2,\ l_1+l_2\cos\theta_2\big)}_{\psi}.$$
Here $\psi$ is signed: it flips sign along with $\theta_2$, which is how each $\theta_2$ gets its own matching $\theta_1$. Step through the worked example.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`$l_1=l_2=1$, target $(1,1)$. From the previous question, $\theta_2=+90^\circ$ or $-90^\circ$.`,
            String.raw`Direction to the target: $\beta=\operatorname{atan2}(1,1)=45^\circ$.`,
            String.raw`Solution A, $\theta_2=+90^\circ$: $\psi=\operatorname{atan2}(1\cdot1,\ 1+0)=45^\circ$, so $\theta_1=45^\circ-45^\circ=0^\circ$.`,
            String.raw`Check with FK: $x=\cos0+\cos90^\circ=1$ and $y=\sin0+\sin90^\circ=1$. ✓`,
            String.raw`Solution B, $\theta_2=-90^\circ$: $\psi=\operatorname{atan2}(-1,\ 1)=-45^\circ$, so $\theta_1=45^\circ+45^\circ=90^\circ$. FK gives $x=\cos90^\circ+\cos0=1$ and $y=\sin90^\circ+\sin0=1$. ✓`,
          ],
          notes: ['', '', 'Elbow at (1, 0): below the base–target line.', 'Always verify an IK answer by running FK.', 'Elbow at (0, 1): above the line. Same hand position, different arm shape.'],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`$l_1=1$, $l_2=0.7$, target $(1.7,\ 0)$. What does IK return?`,
      choices: [
        String.raw`Exactly one solution: $\theta_1=0^\circ,\ \theta_2=0^\circ$`,
        String.raw`Two solutions: $\theta_2=\pm90^\circ$`,
        'No solution: the target is outside the workspace',
        String.raw`Infinitely many solutions, since $\theta_1$ is free`,
      ],
      answer: 0,
      why: String.raw`$r=1.7=l_1+l_2$, so $c_2=\dfrac{2.89-1-0.49}{2(0.7)}=\dfrac{1.4}{1.4}=1$ and $\theta_2=0$. The arm is fully stretched toward the target, so $\theta_1=\operatorname{atan2}(0,1.7)-0=0$. On the outer boundary the two elbow solutions merge into one. Being "on the boundary" still counts as reachable.`,
    },
    {
      kind: 'explain',
      title: 'Why atan2 and not arctan?',
      body: String.raw`$\arctan(y/x)$ only returns angles in $(-90^\circ, 90^\circ)$. It cannot tell $(1,1)$ from $(-1,-1)$, because both give $y/x=1$. It also divides by zero when $x=0$. The two-argument $\operatorname{atan2}(y,x)$ looks at the **signs of both** arguments and returns the true angle of the vector $(x,y)$ in $(-180^\circ,180^\circ]$:
- $\operatorname{atan2}(1,1)=45^\circ$
- $\operatorname{atan2}(-1,-1)=-135^\circ$
- $\operatorname{atan2}(1,0)=90^\circ$, with no division by zero.

Every IK routine, and most rotation code, uses atan2 for this reason. A target behind the robot handled with plain arctan comes out pointing the wrong way.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`Computing the target direction as $\beta=\arctan(y/x)$ gives the same angle for the target $(-1,-1)$ as for $(1,1)$.`,
      answer: true,
      why: String.raw`$y/x=1$ in both cases, so $\arctan$ returns $45^\circ$ for both. The correct direction to $(-1,-1)$ is $\operatorname{atan2}(-1,-1)=-135^\circ$. Using arctan would send the arm $180^\circ$ away from the target.`,
    },
    {
      kind: 'widget',
      title: 'How many solutions?',
      body: String.raw`Explore with the target and the length sliders:
- **Inside** the annulus: two solutions (mirror-image elbows).
- **On the outer circle** ($r=l_1+l_2$): the elbows merge into one solution, the stretched arm. On the inner circle ($r=|l_1-l_2|$, $l_1\neq l_2$) they merge into one folded arm.
- **Outside**: $|c_2|>1$, so there is no real solution. The readout turns red.
- Set $l_1=l_2$ and put the target **on the base**: $\theta_2=180^\circ$ folds the arm back on itself, and then *any* $\theta_1$ works. There are infinitely many solutions.`,
      widget: { type: 'RobArm2Link', props: { mode: 'ik', l1: 1, l2: 0.7, target: [0.2, 1.45], showWorkspace: true, lengthSliders: true } },
    },
    {
      kind: 'match',
      prompt: 'Match each situation for a planar 2R arm with the number of IK solutions.',
      pairs: [
        [String.raw`Target strictly inside the annulus $|l_1-l_2|<r<l_1+l_2$`, 'Two (elbow on either side)'],
        [String.raw`Target on the outer boundary $r=l_1+l_2$`, String.raw`Exactly one (arm stretched, $\theta_2=0$)`],
        [String.raw`Target with $r>l_1+l_2$`, 'None'],
        [String.raw`$l_1=l_2$ and target at the base`, String.raw`Infinitely many ($\theta_2=180^\circ$, any $\theta_1$)`],
      ],
      why: String.raw`The count follows $c_2$. With $|c_2|<1$, $\arccos$ gives two values $\pm\theta_2$. With $|c_2|=1$ they coincide. With $|c_2|>1$ there is no real angle. At $r=0$ the direction $\operatorname{atan2}(0,0)$ is undefined, which is exactly the freedom left in $\theta_1$.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`An arm has $l_1=1$ and $l_2=0.7$, and its joints turn freely. Which targets have at least one IK solution? (Select all that apply.)`,
      choices: [String.raw`$(1.0,\ 1.0)$`, String.raw`$(0.2,\ 0.1)$`, String.raw`$(0,\ -1.5)$`, String.raw`$(1.5,\ 1.0)$`, String.raw`$(1.7,\ 0)$`],
      answers: [0, 2, 4],
      why: String.raw`Reachable means $0.3\le r\le1.7$. $(1,1)$: $r\approx1.41$ ✓. $(0.2,0.1)$: $r\approx0.22<0.3$, inside the hole ✗. $(0,-1.5)$: $r=1.5$ ✓ (below the base is fine without joint limits). $(1.5,1)$: $r=\sqrt{3.25}\approx1.80>1.7$ ✗. $(1.7,0)$: $r=1.7$, on the boundary ✓, with one solution.`,
    },
    {
      kind: 'explain',
      title: 'Beyond two links',
      body: String.raw`- **6-DOF arms.** Six joints can match a full 3D pose (3 position + 3 orientation). Many industrial arms have a **spherical wrist**, where the last three axes meet at one point. That lets IK split into a position problem for the first three joints and an orientation problem for the wrist, with up to **8** closed-form solutions. A general 6R arm can have up to 16. See [analytic IK](@robotics/analytic-ik-6dof).
- **Numerical IK.** With no closed form, iterate Newton–Raphson: $\theta_{k+1}=\theta_k+J^{\dagger}(\theta_k)\,\big(x_d-f(\theta_k)\big)$, using the [Jacobian](@robotics/jacobians). It is fast and general, but it finds only one solution (usually one near the initial guess), may fail to converge from a poor guess, and can stall near singularities ([numerical IK](@robotics/numerical-ik)).
- **Redundancy.** With more joints than task coordinates (a 7-DOF arm placing a 6-DOF pose, or a planar 3R arm placing a point), solutions form a continuous family. The spare freedom can avoid obstacles or joint limits ([redundancy](@robotics/redundancy-nullspace)).
- **Too few joints.** Asking the 2R arm for position **and** orientation gives 3 equations in 2 unknowns, which generally has no solution.`,
    },
    {
      kind: 'order',
      prompt: 'Order the steps of analytic IK for a planar 2R arm.',
      steps: [
        String.raw`Compute $r^2=x^2+y^2$ and check that $|l_1-l_2|\le r\le l_1+l_2$`,
        String.raw`Compute $c_2=(r^2-l_1^2-l_2^2)/(2l_1l_2)$`,
        String.raw`Choose an elbow branch: $\theta_2=\operatorname{atan2}(\pm\sqrt{1-c_2^2},\,c_2)$`,
        String.raw`Compute $\theta_1=\operatorname{atan2}(y,x)-\operatorname{atan2}(l_2\sin\theta_2,\ l_1+l_2\cos\theta_2)$`,
        'Verify with forward kinematics and check joint limits',
      ],
      why: String.raw`Reachability must be checked first, because otherwise $\sqrt{1-c_2^2}$ is imaginary. $\theta_1$ depends on $\theta_2$, so the elbow is solved first. FK verification catches sign and convention mistakes, and joint limits can rule out one of the two branches.`,
    },
    {
      kind: 'fill',
      prompt: 'Inside its workspace a planar 2R arm generically has ___ IK solutions for a hand position. A 6-DOF arm with a spherical wrist has up to ___ for a full pose. An arm with more joints than task coordinates is called ___ and has infinitely many.',
      bank: ['two', 'eight', 'redundant', 'one', 'sixteen', 'singular', 'four'],
      answer: ['two', 'eight', 'redundant'],
      why: 'Elbow-up and elbow-down give two. For a spherical-wrist arm, shoulder left/right × elbow up/down × wrist flip/no-flip = 2 × 2 × 2 = 8. Sixteen is the bound for a general 6R arm. "Singular" describes configurations where the Jacobian loses rank, not extra joints.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- **Inverse kinematics** finds joint values for a desired end-effector pose. It is nonlinear, so there may be 0, finitely many or infinitely many solutions.
- 2R arm: $\cos\theta_2=\dfrac{x^2+y^2-l_1^2-l_2^2}{2l_1l_2}$ (law of cosines), then $\theta_1=\operatorname{atan2}(y,x)-\operatorname{atan2}(l_2s_2,\ l_1+l_2c_2)$.
- Inside the workspace there are **two** mirror-image solutions. On the boundary they merge into one. Outside there are none. With $l_1=l_2$ the base point has infinitely many.
- Use **atan2**, never $\arctan(y/x)$: it keeps the quadrant and never divides by zero.
- Always check an IK answer with FK. Real arms use closed forms (spherical wrists, up to 8 solutions) or **numerical IK** with the Jacobian. Redundant arms have whole families of solutions.`,
    },
  ],
  references: [
    { authors: 'K. M. Lynch & F. C. Park', title: 'Modern Robotics: Mechanics, Planning, and Control', year: 2017, venue: 'Cambridge University Press', detail: 'Ch. 6 (Inverse kinematics: 6.1 analytic, 6.2 numerical)', url: 'https://hades.mech.northwestern.edu/index.php/Modern_Robotics' },
    { authors: 'M. W. Spong, S. Hutchinson & M. Vidyasagar', title: 'Robot Modeling and Control', year: 2020, venue: '2nd ed., Wiley', detail: 'Ch. 5 (Inverse kinematics)' },
    { authors: 'J. J. Craig', title: 'Introduction to Robotics: Mechanics and Control', year: 2017, venue: '4th ed., Pearson', detail: 'Ch. 4 (Inverse manipulator kinematics)' },
    { authors: 'B. Siciliano, L. Sciavicco, L. Villani & G. Oriolo', title: 'Robotics: Modelling, Planning and Control', year: 2009, venue: 'Springer', detail: 'Ch. 2 (Kinematics: inverse kinematics problem)' },
  ],
} satisfies LessonContent;
