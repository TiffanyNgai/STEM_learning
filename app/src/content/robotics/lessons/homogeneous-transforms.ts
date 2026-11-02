import type { LessonContent } from '../../types';

const chainSvg = `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="robHtArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10z" fill="var(--fg)"/></marker></defs>
<g font-size="11" text-anchor="middle">
<circle cx="35" cy="55" r="19" fill="none" stroke="var(--fg)" stroke-width="1.5"/><text x="35" y="59" fill="var(--fg)">{s}</text>
<circle cx="118" cy="55" r="19" fill="none" stroke="var(--c2)" stroke-width="1.5"/><text x="118" y="59" fill="var(--c2)">{b}</text>
<circle cx="201" cy="55" r="19" fill="none" stroke="var(--c4)" stroke-width="1.5"/><text x="201" y="59" fill="var(--c4)">{c}</text>
<circle cx="284" cy="55" r="19" fill="none" stroke="var(--c3)" stroke-width="1.5"/><text x="284" y="59" fill="var(--c3)">{o}</text>
<text x="35" y="22" font-size="9" fill="var(--muted)">world</text>
<text x="118" y="22" font-size="9" fill="var(--muted)">robot base</text>
<text x="201" y="22" font-size="9" fill="var(--muted)">camera</text>
<text x="284" y="22" font-size="9" fill="var(--muted)">object</text>
</g>
<g stroke="var(--fg)" stroke-width="1.5" fill="none" marker-end="url(#robHtArrow)">
<line x1="55" y1="55" x2="97" y2="55"/><line x1="138" y1="55" x2="180" y2="55"/><line x1="221" y1="55" x2="263" y2="55"/>
</g>
<g font-size="10" text-anchor="middle" fill="var(--fg)"><text x="76" y="47">T_sb</text><text x="159" y="47">T_bc</text><text x="242" y="47">T_co</text></g>
<path d="M35,76 C70,140 250,140 284,76" fill="none" stroke="var(--c1)" stroke-width="2.5" stroke-dasharray="6 5" marker-end="url(#robHtArrow)">
<animate attributeName="stroke-dashoffset" values="44;0" dur="1.6s" repeatCount="indefinite"/></path>
<text x="160" y="140" font-size="11" text-anchor="middle" fill="var(--c1)">T_so = T_sb · T_bc · T_co</text>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Position and orientation together',
      body: String.raw`A rotation matrix tells you which way a body faces, but a robot also needs to know **where** it is. A gripper, a camera or a wheel has a full **pose**: an orientation $R$ *and* a position $p$.

In the widget, frame $\{b\}$ is rotated by $\theta$ **and** shifted by $(t_x,t_y)$. The orange point is painted on the body, so its $\{b\}$-coordinates never change. Press **Animate**: the frame first turns, then slides. The $3\times3$ matrix $T$ in the corner packs both pieces of information into one object, and this lesson is about why that packing is so useful.`,
      widget: { type: 'RobFrameTransform', props: { mode: 'transform', theta: 30, tx: 1.5, ty: 0.8, point: [1, 0.5] }, caption: 'Top-left: the homogeneous transform T. Top-right: the point in both frames.' },
    },
    {
      kind: 'recall',
      title: 'Recall: rotation matrices',
      points: [
        String.raw`$R_{sb}$ has the axes of $\{b\}$, written in $\{s\}$, as its columns.`,
        String.raw`$p_s=R_{sb}\,p_b$ when the two frames share an origin.`,
        String.raw`$R^\top R=I$, $\det R=+1$, and $R^{-1}=R^\top$.`,
        String.raw`Adjacent equal subscripts cancel: $R_{sa}R_{ab}=R_{sb}$.`,
      ],
      link: 'robotics/rotation-matrices',
    },
    {
      kind: 'explain',
      title: 'Rotate, then add the offset',
      body: String.raw`Let $p_{sb}$ be the position of $\{b\}$'s origin, written in $\{s\}$. To find a body point in world coordinates, first express its arrow from the body origin in world axes (rotate), then add where the body origin is (translate):
$$p_s = R_{sb}\,p_b + p_{sb}.$$
**Worked example (2D).** $\theta=90^\circ$, $p_{sb}=(2,1)$, $p_b=(1,0)$.
- Rotate: $R_{sb}p_b=(\cos90^\circ,\sin90^\circ)=(0,1)$.
- Translate: $(0,1)+(2,1)=(2,2)$.

The order is not arbitrary: the offset $p_{sb}$ is already in $\{s\}$-coordinates, so it must not be rotated.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Using the widget's default pose — $\theta=30^\circ$, $p_{sb}=(1.5,\,0.8)$ — and the body point $p_b=(1,\,0.5)$, what is the **x-coordinate of $p_s$**? Compute it, then check against the widget's readout.`,
      answer: 2.116,
      tolerance: 0.01,
      why: String.raw`Rotate: $x = 1\cdot\cos30^\circ - 0.5\sin30^\circ = 0.866-0.25 = 0.616$ (and $y = \sin30^\circ+0.5\cos30^\circ = 0.933$). Translate: $0.616+1.5 = 2.116$ (and $0.933+0.8=1.733$). Forgetting the translation gives $0.616$; rotating the offset as well is the other common slip.`,
    },
    {
      kind: 'explain',
      title: 'The homogeneous trick',
      body: String.raw`"Rotate then add" is an *affine* map, not a matrix product, which makes chains of frames messy. The fix: append a $1$ to every point and build one bigger matrix,
$$T_{sb}=\begin{bmatrix}R_{sb}&p_{sb}\\ 0&1\end{bmatrix},\qquad
\begin{bmatrix}p_s\\1\end{bmatrix}=T_{sb}\begin{bmatrix}p_b\\1\end{bmatrix}=\begin{bmatrix}R_{sb}p_b+p_{sb}\\1\end{bmatrix}.$$
In 3D, $T$ is $4\times4$ ($3\times3$ rotation, $3\times1$ position, bottom row $[0\;0\;0\;1]$); in 2D it is $3\times3$. The set of all such matrices is the **special Euclidean group** $SE(3)$ (or $SE(2)$): every rigid-body pose is one element.

**Free vectors** such as velocities or directions get a $0$ appended instead of a $1$. The translation column then multiplies $0$ and drops out: a direction rotates but does not get "moved".`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`A lidar reports a **direction** $d_b$ (a unit vector, not a point) in the body frame. Using $T_{sb}$, how do you express this direction in the world frame?`,
      choices: [
        String.raw`Multiply $T_{sb}$ by $[d_b;\,1]$`,
        String.raw`Multiply $T_{sb}$ by $[d_b;\,0]$, which gives $R_{sb}d_b$`,
        String.raw`Add $p_{sb}$ to $d_b$`,
        String.raw`Multiply $T_{sb}^{-1}$ by $[d_b;\,1]$`,
      ],
      answer: 1,
      why: String.raw`Directions are free vectors: they have no location, so translating the frame must not change them. Appending $0$ makes the translation column drop out, leaving $R_{sb}d_b$. Appending $1$ would wrongly add $p_{sb}$, and $T^{-1}$ converts in the opposite direction (from world to body).`,
    },
    {
      kind: 'explain',
      title: 'Chains of frames',
      body: String.raw`The payoff of homogeneous coordinates: **composing poses is matrix multiplication**, with the same subscript-cancellation rule as rotations:
$$T_{sc}=T_{sb}\,T_{bc}=\begin{bmatrix}R_{sb}R_{bc} & R_{sb}p_{bc}+p_{sb}\\ 0&1\end{bmatrix}.$$
Read the position block: to locate $\{c\}$ in $\{s\}$, rotate the offset $p_{bc}$ into world axes, then add where $\{b\}$ is.

A typical robot cell chains several frames. If the base is at $T_{sb}$ in the world, a camera is bolted to the base at $T_{bc}$, and the camera sees an object at $T_{co}$, the object's world pose is the product along the chain:`,
      widget: { type: 'SvgDiagram', props: { svg: chainSvg }, caption: 'Each arrow is a known transform; multiplying along the path gives the end-to-end pose.' },
    },
    {
      kind: 'order',
      prompt: String.raw`You want the object's pose in the **world** frame, $T_{so}$. Arrange the factors of the product from **left to right**.`,
      steps: [
        String.raw`$T_{sb}$ (robot base in world)`,
        String.raw`$T_{bc}$ (camera in base)`,
        String.raw`$T_{co}$ (object in camera)`,
      ],
      why: String.raw`Subscripts must cancel pairwise: $T_{sb}T_{bc}T_{co}=T_{so}$. Any other order leaves mismatched inner subscripts (e.g. $T_{co}T_{sb}$ has $o\neq s$), which is a frame bug, not just a different answer.`,
    },
    {
      kind: 'widget',
      title: 'Order matters',
      body: String.raw`Here $\{a\}$ sits at $T_{sa}$, and $\{b\}$ is defined relative to $\{a\}$ by $T_{ab}$. The solid frame $\{b\}$ is $T_{sa}T_{ab}$. Tap **Show wrong order** to see $T_{ab}T_{sa}$ as a dashed frame: a genuinely different pose. Press **Animate** to watch the correct product build up: first $T_{sa}$ (turn, slide), then $T_{ab}$ applied **in the moved frame** $\{a\}$.`,
      widget: { type: 'RobFrameTransform', props: { mode: 'compose', theta: 30, tx: 1.5, ty: 0.8, theta2: 60, tx2: 1.2, ty2: 0, point: [1, 0.5] }, caption: 'Post-multiplying by T_ab moves along {a}’s own axes; pre-multiplying would move along {s}’s axes.' },
    },
    {
      kind: 'explain',
      title: 'Inverting a transform',
      body: String.raw`If $T_{sb}$ is the body's pose in the world, then $T_{bs}=T_{sb}^{-1}$ is the world's pose seen from the body. Thanks to $R^{-1}=R^\top$, the inverse has a closed form:
$$T^{-1}=\begin{bmatrix}R&p\\0&1\end{bmatrix}^{-1}=\begin{bmatrix}R^\top & -R^\top p\\ 0&1\end{bmatrix}.$$
**Check** by applying $T^{-1}$ to the body origin $p$: $R^\top p - R^\top p = 0$. ✓

**Worked example.** $\theta=90^\circ$, $p=(2,1)$. Then $R^\top$ is a rotation by $-90^\circ$, which sends $(x,y)\mapsto(y,-x)$, so $R^\top p=(1,-2)$ and the new translation is $-R^\top p=(-1,2)$.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A 2D transform has $\theta=90^\circ$ and $p=(0,\,3)$. What is the **x-component of the translation part** of $T^{-1}$?`,
      answer: -3,
      tolerance: 0.001,
      why: String.raw`$R^\top$ rotates by $-90^\circ$: $(x,y)\mapsto(y,-x)$, so $R^\top p=(3,0)$ and $-R^\top p=(-3,0)$. Check: $T^{-1}$ maps the point $(0,3)$ to $R^\top(0,3)+(-3,0)=(3,0)+(-3,0)=(0,0)$, the body origin. Just negating $p$ would give $(0,-3)$, which is wrong because it ignores the rotation.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`For a homogeneous transform $T$, the inverse equals its transpose: $T^{-1}=T^\top$.`,
      answer: false,
      why: String.raw`Only the rotation block is orthogonal. $T^\top$ moves $p$ into the bottom row, so it is not even a valid transform unless $p=0$. The correct inverse is $\begin{bmatrix}R^\top & -R^\top p\\0&1\end{bmatrix}$.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`To transform a point with a homogeneous transform, append a ___ to its coordinates; to transform a free vector, append a ___. A 3D homogeneous transform is a ___ matrix, and the set of all of them is the group ___.`,
      bank: ['1', '0', '4×4', '3×3', 'SE(3)', 'SO(3)', 'GL(3)'],
      answer: ['1', '0', '4×4', 'SE(3)'],
      why: String.raw`The $1$ switches the translation on for points; the $0$ switches it off for directions. In 3D the transform is $4\times4$ (a $3\times3$ block would be just the rotation, an element of $SO(3)$). Rigid poses form the special Euclidean group $SE(3)$.`,
    },
    {
      kind: 'multi',
      prompt: String.raw`Which statements about $SE(3)$ are true? Select all that apply.`,
      choices: [
        String.raw`Composing two transforms gives another transform in $SE(3)$`,
        String.raw`$T_1T_2=T_2T_1$ for all $T_1,T_2$`,
        'A rigid-body pose in 3D has 6 degrees of freedom',
        String.raw`Transforming a point by $T$ preserves distances between points`,
      ],
      answers: [0, 2, 3],
      why: String.raw`$SE(3)$ is closed under multiplication (it is a group), but it is **not** commutative: pure translations commute with each other, but rotations combined with translations generally do not. A pose has 3 rotational plus 3 translational DOF $=6$. Rotating and translating never stretches anything, so distances are preserved: that is what "rigid" means.`,
    },
    {
      kind: 'recall',
      title: 'Looking ahead: SE(3) as a Lie group',
      points: [
        String.raw`$SE(3)$, like $SO(3)$, is a **Lie group**: a group that is also a smooth (6-dimensional) manifold.`,
        String.raw`Its tangent space at the identity, $\mathfrak{se}(3)$, holds **twists**: combined angular and linear velocities.`,
        String.raw`The matrix exponential turns a twist into a rigid motion, the basis of the [product-of-exponentials](@robotics/product-of-exponentials) formula for forward kinematics.`,
        String.raw`See [twists, screws & wrenches](@robotics/twists-screws) for the robotics side.`,
      ],
      link: 'math/lie-groups-intro',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A pose = orientation + position. Coordinates change by $p_s=R_{sb}p_b+p_{sb}$: rotate first, then add the offset.
- Homogeneous coordinates pack this into $T=\begin{bmatrix}R&p\\0&1\end{bmatrix}$ ($4\times4$ in 3D); points get a $1$, free vectors a $0$.
- Composition is multiplication with **subscript cancellation**: $T_{sc}=T_{sb}T_{bc}$. The order matters.
- Inverse in closed form: $T^{-1}=\begin{bmatrix}R^\top&-R^\top p\\0&1\end{bmatrix}$, **not** $T^\top$.
- Rigid poses form $SE(3)$ with 6 DOF. Chaining one $T$ per joint is exactly [forward kinematics](@robotics/forward-kinematics).`,
    },
  ],
  references: [
    { authors: 'K. M. Lynch & F. C. Park', title: 'Modern Robotics: Mechanics, Planning, and Control', year: 2017, venue: 'Cambridge University Press', detail: 'Ch. 3.3 (rigid-body motions and homogeneous transformation matrices)', url: 'https://hades.mech.northwestern.edu/index.php/Modern_Robotics' },
    { authors: 'J. J. Craig', title: 'Introduction to Robotics: Mechanics and Control', year: 2017, venue: '4th ed., Pearson', detail: 'Ch. 2 (spatial descriptions and transformations)' },
    { authors: 'M. W. Spong, S. Hutchinson & M. Vidyasagar', title: 'Robot Modeling and Control', year: 2020, venue: '2nd ed., Wiley', detail: 'Ch. 2 (rigid motions and homogeneous transformations)' },
    { authors: 'P. Corke', title: 'Robotics, Vision and Control: Fundamental Algorithms in Python', year: 2023, venue: '3rd ed., Springer', detail: 'Ch. 2 (representing position and orientation)' },
    { authors: 'R. M. Murray, Z. Li & S. S. Sastry', title: 'A Mathematical Introduction to Robotic Manipulation', year: 1994, venue: 'CRC Press', detail: 'Ch. 2 (rigid body motion)' },
  ],
} satisfies LessonContent;
