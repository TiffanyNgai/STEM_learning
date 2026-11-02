import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Where is it pointing?',
      body: String.raw`A robot constantly asks two questions about every part of itself and the world: *where is it?* and *which way is it facing?* The second question is about **orientation**, and robotics answers it with a **coordinate frame**: an origin plus a set of perpendicular unit-length axes glued to a body.

Below, $\{s\}$ is the fixed "space" (world) frame and $\{b\}$ is a frame glued to a rotating body. The orange point $p$ is painted on the body. Drag $\theta$ and watch: the point's coordinates **in $\{b\}$ never change**, but its coordinates **in $\{s\}$ do**. A rotation matrix is the machine that converts one into the other.`,
      widget: { type: 'RobFrameTransform', props: { mode: 'rotate', theta: 40, point: [1, 0.5] }, caption: 'x-axes red, y-axes green. Press Animate to replay the rotation from 0°.' },
    },
    {
      kind: 'recall',
      title: 'Recall: vectors & matrices',
      points: [
        String.raw`A matrix times a vector is a weighted sum of the matrix's **columns**: $A\mathbf v = v_1\mathbf a_1 + v_2\mathbf a_2+\dots$`,
        String.raw`The transpose $A^\top$ swaps rows and columns; $(AB)^\top = B^\top A^\top$.`,
        String.raw`Matrix products compose linear maps, applied **right to left**, and in general $AB\neq BA$.`,
        String.raw`The dot product $\mathbf u\cdot\mathbf v=\mathbf u^\top\mathbf v$ is $0$ for perpendicular vectors and $1$ for a unit vector with itself.`,
      ],
      link: 'math/vectors-matrices',
    },
    {
      kind: 'explain',
      title: 'Columns are the body axes',
      body: String.raw`Write the unit axes of $\{b\}$ in $\{s\}$-coordinates as $\hat x_b$ and $\hat y_b$. Stack them as columns:
$$R_{sb}=\begin{bmatrix}\hat x_b & \hat y_b\end{bmatrix}=\begin{bmatrix}\cos\theta & -\sin\theta\\ \sin\theta & \cos\theta\end{bmatrix}.$$
The subscript $sb$ reads "orientation of $\{b\}$ **relative to** $\{s\}$".

A point with body coordinates $p_b=(p_x,p_y)$ sits at $p_x$ steps along $\hat x_b$ plus $p_y$ steps along $\hat y_b$. That is exactly the column picture of matrix–vector multiplication:
$$p_s = R_{sb}\,p_b.$$
**Example.** $\theta=90^\circ$, $p_b=(1,0)$: $p_s=(\cos 90^\circ,\sin 90^\circ)=(0,1)$ — the body's x-axis now points along the world's y-axis.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`Frame $\{b\}$ is rotated by $\theta=30^\circ$ relative to $\{s\}$ (same origin). A point has body coordinates $p_b=(2,\,1)$. What is its **x-coordinate in $\{s\}$**? (Use $\cos 30^\circ\approx0.866$.)`,
      answer: 1.232,
      tolerance: 0.01,
      why: String.raw`$p_s = R_{sb}p_b$, so $x_s = 2\cos30^\circ - 1\cdot\sin30^\circ = 1.732-0.5 = 1.232$ (and $y_s = 2\sin30^\circ+\cos30^\circ = 1.866$). A common slip is to use $+\sin\theta$ in the top row; that would rotate by $-30^\circ$ instead.`,
    },
    {
      kind: 'explain',
      title: 'What makes a matrix a rotation',
      body: String.raw`Because the columns are **unit length** and **mutually perpendicular**, every rotation matrix satisfies
$$R^\top R = I \qquad\text{and}\qquad \det R=+1.$$
The first condition (orthonormality) means $R$ preserves lengths and angles; the second rules out mirror images (a reflection also has $R^\top R=I$ but $\det R=-1$).

The set of all such $n\times n$ matrices is the **special orthogonal group** $SO(n)$: $SO(2)$ for the plane, $SO(3)$ for space.

A huge practical bonus: the inverse is free. Since $R^\top R=I$,
$$R^{-1}=R^\top,\qquad R_{bs}=R_{sb}^\top .$$
No Gaussian elimination needed — just transpose.`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these matrices are rotation matrices (members of SO(2) or SO(3))? Select all that apply.',
      choices: [
        String.raw`$\begin{bmatrix}0&-1\\1&0\end{bmatrix}$`,
        String.raw`$\begin{bmatrix}1&0\\0&-1\end{bmatrix}$`,
        String.raw`$\begin{bmatrix}2&0\\0&0.5\end{bmatrix}$`,
        String.raw`$\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}$`,
      ],
      answers: [0, 3],
      why: String.raw`The first is a $90^\circ$ rotation (orthonormal columns, $\det=+1$). The second is a mirror flip: orthonormal but $\det=-1$. The third has $\det=1$ but stretches lengths, so $R^\top R\neq I$. The fourth permutes the axes cyclically; its columns are orthonormal and $\det=+1$, so it is a rotation (by $120^\circ$ about the axis $(1,1,1)/\sqrt3$).`,
    },
    {
      kind: 'explain',
      title: 'Rotations in 3D',
      body: String.raw`In space, $R_{sb}=[\hat x_b\ \hat y_b\ \hat z_b]$ is $3\times3$, again with the body axes as columns. The three **elementary rotations** about the coordinate axes are
$$R_z(\theta)=\begin{bmatrix}c&-s&0\\ s&c&0\\ 0&0&1\end{bmatrix},\;
R_x(\theta)=\begin{bmatrix}1&0&0\\ 0&c&-s\\ 0&s&c\end{bmatrix},\;
R_y(\theta)=\begin{bmatrix}c&0&s\\ 0&1&0\\ -s&0&c\end{bmatrix},$$
with $c=\cos\theta$, $s=\sin\theta$. $R_z$ is just the 2D rotation acting on $(x,y)$ while leaving $z$ alone. Watch the sign pattern in $R_y$: the $-s$ moves to the bottom row because the cyclic order is $z\to x$ when rotating about $y$.

A $3\times3$ matrix has 9 numbers, but $R^\top R=I$ imposes 6 independent constraints, leaving **3 degrees of freedom** — matching the three ways a rigid body can turn.`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`The condition $R^\top R=I$ for a $3\times3$ matrix gives 9 scalar equations, but some are duplicates because $R^\top R$ is symmetric. How many **independent** equations are there?`,
      answer: 6,
      tolerance: 0,
      why: String.raw`$R^\top R$ is symmetric, so only its upper triangle matters: 3 diagonal entries (each column has unit length) plus 3 off-diagonal entries (each pair of columns is perpendicular) $=6$. Hence $9-6=3$ free parameters, which is why roll–pitch–yaw or axis–angle use three numbers.`,
    },
    {
      kind: 'widget',
      title: 'See the columns',
      body: String.raw`Here the painted point is $p_b=(0,1)$, the tip of the body's y-axis. Its world coordinates are exactly the **second column** of $R$ shown top-left. Try $\theta=90^\circ$, $180^\circ$ and $-90^\circ$ and predict the readout before you look.`,
      widget: { type: 'RobFrameTransform', props: { mode: 'rotate', theta: 60, point: [0, 1] }, caption: 'p in {s} = R · (0, 1) = second column of R.' },
    },
    {
      kind: 'explain',
      title: 'Three jobs, one matrix',
      body: String.raw`A rotation matrix does three different jobs (Lynch & Park, Ch. 3.2):
1. **Describe an orientation**: $R_{sb}$ says how $\{b\}$ is turned relative to $\{s\}$.
2. **Change coordinates**: $p_s=R_{sb}\,p_b$ re-expresses the *same* point in another frame.
3. **Rotate a vector or frame**: $R\,v$ produces a *new*, rotated vector.

For job 2, use the **subscript-cancellation rule**: adjacent matching subscripts cancel,
$$R_{sa}\,R_{ab}=R_{sb},\qquad R_{sb}\,p_b=p_s .$$
If the inner subscripts don't match (e.g. $R_{sa}\,p_b$), you have a bug. This bookkeeping prevents most frame errors in real robot code.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`A camera's orientation in the world is $R_{wc}$ and a gripper's orientation relative to the camera is $R_{cg}$. In $R_{wg}=R_{wx}\,R_{xg}$ the shared inner subscript $x$ must be ___. The camera's orientation relative to the gripper, $R_{gc}$, is the ___ of $R_{cg}$, and its determinant is ___.`,
      bank: ['c', 'g', 'w', 'transpose', 'negation', '+1', '−1'],
      answer: ['c', 'transpose', '+1'],
      why: String.raw`Inner subscripts must match and cancel: $R_{wc}R_{cg}=R_{wg}$. Swapping the subscripts inverts the rotation, and the inverse of a rotation is its transpose, so $R_{gc}=R_{cg}^\top$. Like every rotation, it has $\det=+1$. Negating the entries is not an inverse: $-R$ has $\det=-1$ in 3D, so it is not even a rotation.`,
    },
    {
      kind: 'explain',
      title: 'Order matters in 3D',
      body: String.raw`In the plane, rotations commute: turning $30^\circ$ then $40^\circ$ equals $40^\circ$ then $30^\circ$. In space they **do not**. Step through the computation of $R_z(90^\circ)R_x(90^\circ)$ and $R_x(90^\circ)R_z(90^\circ)$:`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`$R_z(90^\circ)=\begin{bmatrix}0&-1&0\\1&0&0\\0&0&1\end{bmatrix},\quad R_x(90^\circ)=\begin{bmatrix}1&0&0\\0&0&-1\\0&1&0\end{bmatrix}$`,
            String.raw`$R_z R_x=\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}$`,
            String.raw`$R_x R_z=\begin{bmatrix}0&-1&0\\0&0&-1\\1&0&0\end{bmatrix}$`,
            String.raw`Different matrices, so different final orientations. Try it with a book: turn it $90^\circ$ about a vertical axis then $90^\circ$ about a horizontal one, then reset and swap the order.`,
          ],
          notes: [
            'The two elementary rotations by 90°.',
            'Read the columns: the new x-axis points along world y, new y along world z, new z along world x.',
            'Here the new x-axis points along world z instead.',
            '',
          ],
        },
      },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`For any two 3D rotation matrices, $R_1R_2=R_2R_1$.`,
      answer: false,
      why: String.raw`The example above gives two different products. $SO(3)$ is a **non-commutative** group. (Rotations about the *same* axis do commute, and all of $SO(2)$ is commutative, which is why the 2D intuition misleads.)`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`A drone's orientation is $R_{sb}$. It now yaws $10^\circ$ about **its own** body $z$-axis. Which expression is its new orientation?`,
      choices: [
        String.raw`$R_z(10^\circ)\,R_{sb}$`,
        String.raw`$R_{sb}\,R_z(10^\circ)$`,
        String.raw`$R_{sb}^\top R_z(10^\circ)$`,
        String.raw`$R_{sb}+R_z(10^\circ)$`,
      ],
      answer: 1,
      why: String.raw`Rotating about a **body**-frame axis **post-multiplies** (on the right): $R_{sb'}=R_{sb}R_{bb'}$, consistent with subscript cancellation. **Pre-multiplying**, $R_z(10^\circ)R_{sb}$, would rotate about the fixed world $z$-axis instead; the two agree only if the body and world $z$-axes coincide. Adding rotation matrices does not even give a rotation.`,
    },
    {
      kind: 'match',
      prompt: 'Match each property of a rotation matrix with what it means.',
      pairs: [
        [String.raw`Columns of $R_{sb}$`, String.raw`The axes of $\{b\}$ written in $\{s\}$-coordinates`],
        [String.raw`$R^\top R=I$`, 'Lengths and angles are preserved'],
        [String.raw`$\det R=+1$`, 'No mirror reflection (right-handed frames stay right-handed)'],
        [String.raw`$R^\top$`, String.raw`The inverse rotation, $R_{bs}$`],
      ],
      why: String.raw`Orthonormal columns give $R^\top R=I$ (and hence $R^{-1}=R^\top$); $\det=+1$ separates proper rotations from reflections; and the columns are literally the rotated frame's unit axes.`,
    },
    {
      kind: 'recall',
      title: 'Looking ahead: SO(3) is a Lie group',
      points: [
        String.raw`$SO(3)$ is a **group** (closed under products and inverses) that is also a smooth 3-dimensional **manifold**: a Lie group.`,
        String.raw`It is curved: you cannot average or interpolate rotation matrices entry by entry and stay in $SO(3)$.`,
        String.raw`Its tangent space at $I$ is the space of $3\times3$ skew-symmetric matrices, $\mathfrak{so}(3)$; the matrix exponential maps it onto $SO(3)$.`,
        String.raw`Robotics uses this for [axis–angle coordinates](@robotics/axis-angle-exponential) and [quaternions](@robotics/quaternions).`,
      ],
      link: 'math/so3-su2',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A frame's orientation is a rotation matrix $R_{sb}$ whose **columns are the body axes** expressed in $\{s\}$.
- $p_s=R_{sb}\,p_b$ changes coordinates; subscripts **cancel** when they are adjacent and equal.
- Rotation matrices satisfy $R^\top R=I$, $\det R=+1$; they form $SO(3)$, with 9 entries but only **3 degrees of freedom**.
- The inverse is the transpose: $R_{bs}=R_{sb}^\top$.
- 3D rotations **don't commute**. Pre-multiply to rotate about **fixed** (world) axes; post-multiply to rotate about **body** axes.
- Next: three-number parameterizations ([Euler angles](@robotics/euler-angles)) and adding translation ([homogeneous transforms](@robotics/homogeneous-transforms)).`,
    },
  ],
  references: [
    { authors: 'K. M. Lynch & F. C. Park', title: 'Modern Robotics: Mechanics, Planning, and Control', year: 2017, venue: 'Cambridge University Press', detail: 'Ch. 3.1–3.2 (rotations and angular velocities)', url: 'https://hades.mech.northwestern.edu/index.php/Modern_Robotics' },
    { authors: 'J. J. Craig', title: 'Introduction to Robotics: Mechanics and Control', year: 2017, venue: '4th ed., Pearson', detail: 'Ch. 2 (spatial descriptions and transformations)' },
    { authors: 'M. W. Spong, S. Hutchinson & M. Vidyasagar', title: 'Robot Modeling and Control', year: 2020, venue: '2nd ed., Wiley', detail: 'Ch. 2 (rigid motions)' },
    { authors: 'P. Corke', title: 'Robotics, Vision and Control: Fundamental Algorithms in Python', year: 2023, venue: '3rd ed., Springer', detail: 'Ch. 2 (representing position and orientation)' },
    { authors: 'R. M. Murray, Z. Li & S. S. Sastry', title: 'A Mathematical Introduction to Robotic Manipulation', year: 1994, venue: 'CRC Press', detail: 'Ch. 2 (rigid body motion)' },
  ],
} satisfies LessonContent;
