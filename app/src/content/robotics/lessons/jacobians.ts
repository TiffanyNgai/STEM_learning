import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'From “where” to “how fast”',
      body: String.raw`[Forward kinematics](@robotics/forward-kinematics) tells you *where* the hand is for given joint angles. But a robot drawing a line, pouring a cup or catching a ball needs to know *how fast* the hand moves — and in which direction — when the joints turn.

The question of this lesson: if the joints spin at rates $\dot\theta_1,\dot\theta_2$ (radians per second), what is the hand's velocity $(\dot x,\dot y)$? The answer is a matrix, the **Jacobian** $J(\theta)$, and it is probably the single most used object in robotics.

Press Play and watch the hand: equal joint speeds produce very different hand speeds depending on the arm's pose.`,
      widget: { type: 'RobArm2Link', props: { mode: 'fk', l1: 1, l2: 0.7, q1: 20, q2: 70 }, caption: 'Play sweeps both joints smoothly; the orange trace is the hand path. Notice where the hand races and where it crawls.' },
    },
    {
      kind: 'recall',
      title: 'Recall: matrices act on vectors',
      points: [
        String.raw`A matrix–vector product is a **weighted sum of the columns**: $\begin{bmatrix}a&b\\c&d\end{bmatrix}\begin{bmatrix}u\\w\end{bmatrix}=u\begin{bmatrix}a\\c\end{bmatrix}+w\begin{bmatrix}b\\d\end{bmatrix}$.`,
        String.raw`The $2\times2$ determinant is $ad-bc$; it is the factor by which the matrix scales areas.`,
        String.raw`$\det=0$ exactly when the columns are parallel: the matrix squashes the plane onto a line and has no inverse.`,
      ],
      link: 'math/vectors-matrices',
    },
    {
      kind: 'explain',
      title: 'Differentiate the forward kinematics',
      body: String.raw`For the planar two-link arm with link lengths $l_1,l_2$, write $c_1=\cos\theta_1$, $s_{12}=\sin(\theta_1+\theta_2)$ and so on. Forward kinematics is
$$x=l_1c_1+l_2c_{12},\qquad y=l_1s_1+l_2s_{12}.$$
The joint angles change in time, so differentiate with the chain rule ($\tfrac{d}{dt}\cos\theta=-\sin\theta\,\dot\theta$):
$$\dot x=-l_1s_1\dot\theta_1-l_2s_{12}(\dot\theta_1+\dot\theta_2),\qquad \dot y=l_1c_1\dot\theta_1+l_2c_{12}(\dot\theta_1+\dot\theta_2).$$
Both are **linear in the joint rates**. Collect the coefficients into a matrix:
$$\begin{bmatrix}\dot x\\ \dot y\end{bmatrix}=\underbrace{\begin{bmatrix}-l_1s_1-l_2s_{12} & -l_2s_{12}\\ l_1c_1+l_2c_{12} & l_2c_{12}\end{bmatrix}}_{J(\theta)}\begin{bmatrix}\dot\theta_1\\ \dot\theta_2\end{bmatrix}.$$`,
    },
    {
      kind: 'explain',
      title: 'The Jacobian, in general',
      body: String.raw`For any robot whose forward kinematics is $p=f(\theta)$ with $n$ joints and $m$ task coordinates,
$$\dot p=J(\theta)\,\dot\theta,\qquad J_{ij}=\frac{\partial f_i}{\partial\theta_j},$$
an $m\times n$ matrix of partial derivatives. Two points to hold on to:

- **Velocities are linear, positions are not.** FK is a nonlinear function of $\theta$, but at any fixed pose the map from joint rates to hand velocity is just a matrix.
- **$J$ depends on the pose.** Move the arm and the matrix changes.

For a spatial arm the hand velocity has 6 components (3 angular, 3 linear) — a *twist* — so $J$ is $6\times n$. Lynch & Park build it column by column from screw axes (the *space* and *body* Jacobians); the planar case already shows every idea.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`A 2-link arm has $l_1=l_2=1$ m and sits at $\theta_1=0$, $\theta_2=90^\circ$. Joint 1 turns at $\dot\theta_1=1$ rad/s and joint 2 is still. What is the hand's **speed** $\sqrt{\dot x^2+\dot y^2}$ in m/s? (3 d.p.)`,
      answer: 1.414,
      tolerance: 0.002,
      unit: 'm/s',
      why: String.raw`First column of $J$: $(-l_1s_1-l_2s_{12},\ l_1c_1+l_2c_{12})=(-0-1,\ 1+0)=(-1,1)$, so $v=(-1,1)$ m/s and the speed is $\sqrt2\approx1.414$. Geometrically: the hand is at $(1,1)$, a distance $\sqrt2$ from joint 1, and a point at radius $r$ on a body spinning at $\omega$ moves at $r\omega$.`,
    },
    {
      kind: 'widget',
      title: 'Each column is one joint’s contribution',
      body: String.raw`Because $J\dot\theta=\dot\theta_1\,J_1+\dot\theta_2\,J_2$, column $J_i$ is **the hand velocity you get by spinning joint $i$ alone at 1 rad/s**.

For a revolute joint that is easy to picture: the hand swings in a circle about that joint, so $J_i$ is **perpendicular to the line from joint $i$ to the hand**, with length equal to that distance. Below, the green arrow is $J_1$ (base joint) and the orange arrow is $J_2$ (elbow). Move the sliders and check both facts.`,
      widget: { type: 'RobArm2Link', props: { mode: 'jacobian', l1: 1, l2: 0.7, q1: 30, q2: 60, showEllipse: false }, caption: 'Arrows are drawn at 0.55 m per (rad/s). The matrix J and its determinant are read out below the arm.' },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Joint 1 is locked and joint 2 (the elbow) turns at 1 rad/s. Whatever the pose, the hand's speed equals…`,
      choices: [
        String.raw`$l_1$`,
        String.raw`$l_2$`,
        String.raw`$l_1+l_2$`,
        'the distance from the base to the hand',
      ],
      answer: 1,
      why: String.raw`Column 2 is $(-l_2s_{12},\ l_2c_{12})$, whose length is $l_2\sqrt{s_{12}^2+c_{12}^2}=l_2$. Only the second link swings, about the elbow, at radius $l_2$. "Distance from the base" is the answer for joint 1, not joint 2.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`The arm ($l_1=1$ m, $l_2=0.7$ m) is fully stretched out ($\theta_2=0$). Joint 1 turns at $2$ rad/s, joint 2 is still. How fast does the hand move (m/s)?`,
      answer: 3.4,
      tolerance: 0.01,
      unit: 'm/s',
      why: String.raw`With $\theta_2=0$ the hand is $l_1+l_2=1.7$ m from the base, and it rotates rigidly about joint 1: speed $=1.7\times2=3.4$ m/s. From the formula: $|J_1|=\sqrt{(l_1s_1+l_2s_1)^2+(l_1c_1+l_2c_1)^2}=l_1+l_2$.`,
    },
    {
      kind: 'explain',
      title: 'When the Jacobian loses rank',
      body: String.raw`Compute the determinant (expand, and the $l_2^2$ terms cancel):
$$\det J=l_1l_2\,(s_{12}c_1-s_1c_{12})=l_1l_2\sin\theta_2.$$
It vanishes when $\theta_2=0$ (arm **fully stretched**) or $\theta_2=\pm180^\circ$ (arm **folded back**). There both columns are perpendicular to the same line, so they are parallel: whatever the joints do, the hand can only move *sideways* — it cannot move along the arm. Such a pose is a **singularity**.

Why it matters: to command a hand velocity $v$ we solve $\dot\theta=J^{-1}v$. Near a singularity $J^{-1}$ has huge entries, so a modest hand velocity demands enormous joint speeds. The [singularities lesson](@robotics/singularities) classifies them for real 6-axis arms.`,
    },
    {
      kind: 'widget',
      title: 'The velocity ellipse',
      body: String.raw`Feed in every joint-rate vector of unit size, $\|\dot\theta\|=1$. The resulting hand velocities $J\dot\theta$ fill an **ellipse** (purple). Its semi-axes are the **singular values** of $J$: long axis = direction the hand moves easily, short axis = direction it barely moves.

Drag $\theta_2$ toward $0$ (or press *Stretch out*). The ellipse flattens into a line segment and the arm turns red: one direction of motion has been lost. Yoshikawa's **manipulability** $\sqrt{\det(JJ^\top)}=|\det J|$ (for square $J$) measures the ellipse's area; see [manipulability ellipsoids](@robotics/manipulability).`,
      widget: { type: 'RobArm2Link', props: { mode: 'jacobian', l1: 1, l2: 0.7, q1: 20, q2: 80, showEllipse: true }, caption: 'For this arm the ellipse is fattest near θ₂ = ±90°, where |det J| = l₁l₂ is largest.' },
    },
    {
      kind: 'multi',
      prompt: String.raw`An arm has $l_1=1$ m and $l_2=0.7$ m. Which poses are singular? (Select all that apply.)`,
      choices: [
        String.raw`$\theta_1=45^\circ,\ \theta_2=0^\circ$`,
        String.raw`$\theta_1=0^\circ,\ \theta_2=180^\circ$`,
        String.raw`$\theta_1=90^\circ,\ \theta_2=90^\circ$`,
        'Any pose with the hand exactly 1.7 m from the base',
        String.raw`$\theta_1=0^\circ,\ \theta_2=30^\circ$`,
      ],
      answers: [0, 1, 3],
      why: String.raw`$\det J=l_1l_2\sin\theta_2$ depends only on $\theta_2$, so $\theta_1$ is irrelevant. $\theta_2=0^\circ$ and $180^\circ$ give $\sin\theta_2=0$. A hand distance of $1.7=l_1+l_2$ is only possible fully stretched ($\theta_2=0$), i.e. on the outer workspace boundary. $\theta_2=90^\circ$ is the *best* pose and $30^\circ$ is non-singular ($\det=0.35$).`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`For $l_1=1$ m, $l_2=0.7$ m and $\theta_2=30^\circ$, what is $\det J$ (in m²)?`,
      answer: 0.35,
      tolerance: 0.005,
      why: String.raw`$\det J=l_1l_2\sin\theta_2=1\times0.7\times0.5=0.35$. It is half the maximum value $l_1l_2=0.7$ reached at $\theta_2=\pm90^\circ$.`,
    },
    {
      kind: 'explain',
      title: 'Preview: forces travel through the transpose',
      body: String.raw`The same matrix links **forces**. If the hand pushes on the world with force $F$, what joint torques $\tau$ are needed? Power must balance: the power the motors deliver, $\tau^\top\dot\theta$, equals the power at the hand, $F^\top v=F^\top J\dot\theta$, for every $\dot\theta$. Hence
$$\tau=J(\theta)^\top F.$$
**Worked example.** $l_1=l_2=1$, $\theta_1=0$, $\theta_2=90^\circ$, so $J=\begin{bmatrix}-1&-1\\1&0\end{bmatrix}$. Push straight up with $F=(0,10)$ N: $\tau=J^\top F=(10,\ 0)$ N·m. The elbow needs no torque because the force points along link 2, straight through the elbow; the base feels $10\ \text{N}\times1\ \text{m}$ of lever arm.

The full story — gravity compensation, wrenches, the force ellipse — is in [statics](@robotics/statics-jacobian-transpose).`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`With the 2-link arm fully stretched along the $x$-axis ($\theta_1=\theta_2=0$), a force at the hand pointing straight back toward the base requires **zero** joint torque to resist.`,
      answer: true,
      why: String.raw`Here $J=\begin{bmatrix}0&0\\l_1+l_2&l_2\end{bmatrix}$, and $F=(-10,0)$ gives $J^\top F=(0,0)$. The force passes through both joint axes, so the structure carries it with no motor torque. This is the force-side face of a singularity: directions the hand cannot *move* in are exactly the directions it can *resist* for free — why you lock your arm straight to push a heavy door.`,
    },
    {
      kind: 'match',
      prompt: 'Match each object to what it tells you.',
      pairs: [
        [String.raw`Column $J_i$`, 'Hand velocity from joint i alone at 1 rad/s'],
        [String.raw`$\det J=0$`, 'A singular pose: some hand direction is unreachable instantaneously'],
        [String.raw`$J^{-1}v$`, 'Joint rates that produce a desired hand velocity'],
        [String.raw`$J^\top F$`, 'Joint torques that produce a hand force'],
        [String.raw`Singular values of $J$`, 'Semi-axes of the velocity ellipse'],
      ],
      why: String.raw`$J$ maps rates forward; its inverse maps them back (when it exists); its transpose maps forces to torques by the power balance $\tau^\top\dot\theta=F^\top v$; and the SVD of $J$ gives the shape of everything it can produce from unit joint rates.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`The Jacobian maps joint ___ to hand velocities. Its ___ maps hand ___ to joint ___.`,
      bank: ['rates', 'transpose', 'inverse', 'forces', 'torques', 'positions', 'accelerations'],
      answer: ['rates', 'transpose', 'forces', 'torques'],
      why: String.raw`$v=J\dot\theta$ and $\tau=J^\top F$. A common slip is to use the inverse for forces: $J^{-1}$ maps hand velocities back to joint rates, which is a different (and sometimes non-existent) map.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- The Jacobian $J(\theta)=\partial f/\partial\theta$ linearizes forward kinematics: $\dot p=J(\theta)\dot\theta$. It is $m\times n$ and changes with the pose.
- Column $i$ is the hand velocity from joint $i$ alone; for a revolute joint it is perpendicular to the joint-to-hand line, with length equal to that distance.
- For the planar 2R arm, $\det J=l_1l_2\sin\theta_2$: singular when fully stretched or folded. Near singularities, $J^{-1}$ demands huge joint speeds.
- Unit joint rates map to a velocity ellipse whose semi-axes are the singular values of $J$.
- By power balance, forces go the other way through the transpose: $\tau=J^\top F$.

Next: [singularities](@robotics/singularities), and using $J$ to solve [IK numerically](@robotics/numerical-ik).`,
    },
  ],
  references: [
    { authors: 'K. M. Lynch & F. C. Park', title: 'Modern Robotics: Mechanics, Planning, and Control', year: 2017, venue: 'Cambridge University Press', detail: 'Ch. 5 (Velocity Kinematics and Statics)', url: 'https://hades.mech.northwestern.edu/index.php/Modern_Robotics' },
    { authors: 'B. Siciliano, L. Sciavicco, L. Villani & G. Oriolo', title: 'Robotics: Modelling, Planning and Control', year: 2009, venue: 'Springer', detail: 'Ch. 3 (Differential Kinematics and Statics)' },
    { authors: 'M. W. Spong, S. Hutchinson & M. Vidyasagar', title: 'Robot Modeling and Control', year: 2020, venue: '2nd ed., Wiley', detail: 'Ch. 4 (Velocity Kinematics)' },
    { authors: 'T. Yoshikawa', title: 'Manipulability of robotic mechanisms', year: 1985, venue: 'International Journal of Robotics Research 4(2), 3–9' },
    { authors: 'D. E. Whitney', title: 'Resolved motion rate control of manipulators and human prostheses', year: 1969, venue: 'IEEE Transactions on Man-Machine Systems 10(2), 47–53' },
  ],
} satisfies LessonContent;
