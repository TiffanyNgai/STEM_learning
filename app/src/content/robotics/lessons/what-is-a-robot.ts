import type { LessonContent } from '../../types';

const LOOP_SVG = String.raw`<svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <path id="loop" d="M160,30 C250,30 290,80 270,120 C250,165 200,180 160,180 C120,180 70,165 50,120 C30,80 70,30 160,30Z" fill="none" stroke="var(--grid)" stroke-width="2"/>
  <rect x="102" y="12" width="116" height="34" rx="10" fill="var(--surface)" stroke="var(--c2)" stroke-width="2"/>
  <text x="160" y="27" font-size="11" text-anchor="middle" fill="var(--c2)" font-weight="bold">THINK</text>
  <text x="160" y="40" font-size="8.5" text-anchor="middle" fill="var(--muted)">estimate · plan · decide</text>
  <rect x="214" y="104" width="100" height="34" rx="10" fill="var(--surface)" stroke="var(--c3)" stroke-width="2"/>
  <text x="264" y="119" font-size="11" text-anchor="middle" fill="var(--c3)" font-weight="bold">ACT</text>
  <text x="264" y="132" font-size="8.5" text-anchor="middle" fill="var(--muted)">motors · grippers</text>
  <rect x="6" y="104" width="100" height="34" rx="10" fill="var(--surface)" stroke="var(--c1)" stroke-width="2"/>
  <text x="56" y="119" font-size="11" text-anchor="middle" fill="var(--c1)" font-weight="bold">SENSE</text>
  <text x="56" y="132" font-size="8.5" text-anchor="middle" fill="var(--muted)">cameras · encoders</text>
  <ellipse cx="160" cy="180" rx="62" ry="17" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>
  <text x="160" y="178" font-size="11" text-anchor="middle" fill="var(--fg)" font-weight="bold">WORLD</text>
  <text x="160" y="190" font-size="8.5" text-anchor="middle" fill="var(--muted)">physics · people · noise</text>
  <text x="250" y="62" font-size="9" fill="var(--muted)">commands</text>
  <text x="225" y="168" font-size="9" fill="var(--muted)">forces</text>
  <text x="48" y="168" font-size="9" fill="var(--muted)">light, contact</text>
  <text x="28" y="62" font-size="9" fill="var(--muted)">measurements</text>
  <circle r="5" fill="var(--c5)"><animateMotion dur="4s" repeatCount="indefinite"><mpath href="#loop"/></animateMotion></circle>
  <circle r="3" fill="var(--c5)" opacity="0.5"><animateMotion dur="4s" begin="-2s" repeatCount="indefinite"><mpath href="#loop"/></animateMotion></circle>
</svg>`;

const STACK_SVG = String.raw`<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
  <g font-size="10">
    <rect x="10" y="10" width="210" height="32" rx="8" fill="var(--c4)" opacity="0.18"/><text x="20" y="30" fill="var(--fg)">Task / mission: "tidy the kitchen"</text>
    <rect x="10" y="48" width="210" height="32" rx="8" fill="var(--c2)" opacity="0.18"/><text x="20" y="68" fill="var(--fg)">Planning: which path, which grasp</text>
    <rect x="10" y="86" width="210" height="32" rx="8" fill="var(--c6)" opacity="0.18"/><text x="20" y="106" fill="var(--fg)">Estimation: where am I, where is it</text>
    <rect x="10" y="124" width="210" height="32" rx="8" fill="var(--c3)" opacity="0.18"/><text x="20" y="144" fill="var(--fg)">Control: track the plan, fix errors</text>
    <rect x="10" y="162" width="210" height="32" rx="8" fill="var(--c1)" opacity="0.18"/><text x="20" y="182" fill="var(--fg)">Hardware: motors, sensors, drivers</text>
  </g>
  <g font-size="9" fill="var(--muted)">
    <text x="232" y="30">~0.1 Hz – minutes</text>
    <text x="232" y="68">~1–10 Hz</text>
    <text x="232" y="106">~10–200 Hz</text>
    <text x="232" y="144">~100 Hz – 1 kHz</text>
    <text x="232" y="182">~1–40 kHz</text>
  </g>
  <line x1="300" y1="190" x2="300" y2="14" stroke="var(--muted)" stroke-width="1"/>
  <path d="M300,10 l-4,8 l8,0Z" fill="var(--muted)"/>
  <rect x="223" y="122" width="4" height="36" fill="var(--c3)">
    <animate attributeName="opacity" values="1;0.2;1" dur="0.4s" repeatCount="indefinite"/>
  </rect>
  <rect x="223" y="46" width="4" height="36" fill="var(--c2)">
    <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite"/>
  </rect>
</svg>`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Not just a machine',
      body: String.raw`A dishwasher runs the same timed program whether the plates are clean or not. A robot vacuum notices a chair leg, turns, and carries on. The difference is **feedback**: the robot *measures* the world, *decides* what to do based on what it measured, and *acts*, which changes what it will measure next.

Roboticists call this the **sense–think–act loop**. Watch the red dot circle it: a fast robot goes round many times per second.

There is no single agreed definition of "robot", but most (including the ISO 8373 vocabulary standard) share this core: a programmable, actuated machine with some **autonomy** that moves itself or things in the physical world.`,
      widget: { type: 'SvgDiagram', props: { svg: LOOP_SVG }, caption: 'Sense → think → act → the world changes → sense again.' },
    },
    {
      kind: 'mcq',
      prompt: 'Which feature most clearly separates a robot from an ordinary automated machine such as a music box or a timed sprinkler?',
      choices: [
        'It is driven by electric motors',
        'It uses measurements of the world to change what it does',
        'It is shaped like a human or an animal',
        'It runs a computer program',
      ],
      answer: 1,
      why: 'A sprinkler on a timer runs a program and may use motors, yet it never checks whether the lawn is already wet. Closing the loop (sensing and reacting) is the defining ingredient. Shape is irrelevant: most robots look nothing like people.',
    },
    {
      kind: 'explain',
      title: 'Sense',
      body: String.raw`Robots measure two kinds of things.

- **Proprioceptive** sensors measure the robot itself: **encoders** report joint angles, an **IMU** (inertial measurement unit) reports acceleration and rotation rate, current sensors estimate motor torque.
- **Exteroceptive** sensors measure the world: **cameras**, **depth cameras**, **lidar** (laser range scanners), touch and force sensors, microphones.

Every measurement is **noisy and incomplete**. A camera sees only the front of a cup; an encoder has finite resolution; an IMU's bias drifts. Turning these partial clues into a usable belief about the world is the job of [state estimation](@robotics/kalman-filter).`,
    },
    {
      kind: 'multi',
      prompt: 'Which of these are **exteroceptive** sensors? (Select all that apply.)',
      choices: ['A lidar scanner on a self-driving car', 'A joint encoder on a robot arm', 'A wrist-mounted camera', 'A fingertip tactile sensor', 'A current sensor in a motor driver'],
      answers: [0, 2, 3],
      why: 'Lidar, cameras and touch sensors measure the environment (touch measures contact with external objects). Encoders and motor-current sensors measure the robot’s own state, so they are proprioceptive.',
    },
    {
      kind: 'explain',
      title: 'Think: a stack of loops',
      body: String.raw`"Think" is not one program but layers running at different speeds. At the bottom, a **controller** corrects motor errors hundreds or thousands of times per second. Above it, **estimation** fuses sensors into a best guess of the state. Above that, **planning** chooses a path or grasp a few times per second, and a **task** layer decides what to do next.

The rule of thumb: the closer to the hardware, the faster and simpler the loop. Fast loops keep the robot stable; slow loops make it smart. (The rates on the right are typical orders of magnitude, not fixed rules.)`,
      widget: { type: 'SvgDiagram', props: { svg: STACK_SVG }, caption: 'A typical autonomy stack. The blinking bars contrast a fast control loop with a slower planner.' },
    },
    {
      kind: 'numeric',
      prompt: 'A delivery robot drives at 2 m/s. Its camera-to-decision pipeline has a total latency of 150 ms. How far (in metres) does it travel before it can react to something that just appeared?',
      answer: 0.3,
      tolerance: 0.001,
      unit: 'm',
      why: 'Distance = speed × latency = 2 m/s × 0.150 s = 0.3 m. This is why safety-critical reactions (emergency stops, balance) are placed in the fast, low-latency layers rather than behind slow perception.',
    },
    {
      kind: 'explain',
      title: 'Act',
      body: String.raw`**Actuators** turn commands into motion: electric motors (by far the most common), hydraulic cylinders for very high forces, pneumatic muscles, even shape-memory alloys. They move **joints**: a **revolute** joint rotates (like an elbow), a **prismatic** joint slides (like a drawer).

Below is the simplest interesting robot arm: two revolute joints. Each slider is one actuator command; the hand position follows. How joint angles determine the hand is called [forward kinematics](@robotics/forward-kinematics); going the other way is [inverse kinematics](@robotics/inverse-kinematics). Press Play to sweep the joints.`,
      widget: { type: 'RobArm2Link', props: { mode: 'fk', q1: 40, q2: 70, showWorkspace: true }, caption: 'Shaded ring: every point the hand can reach (its workspace).' },
    },
    {
      kind: 'widget',
      title: 'Closing the loop',
      body: String.raw`Here a motor pushes a cart toward the green flag. The controller looks at the **error** (flag position minus cart position) and pushes harder the bigger the error. That is feedback in its simplest form: no one told the cart how hard to push at each instant; it worked it out from what it measured.

Raise the gain $K_p$: the cart arrives faster but overshoots and rings. Taming this trade-off is the subject of [PID control](@robotics/pid-control).`,
      widget: { type: 'RobPID', props: { kp: 3, ki: 0, kd: 0, controls: ['kp'] }, caption: 'Proportional feedback only: push ∝ error.' },
    },
    {
      kind: 'explain',
      title: 'A zoo of robots',
      body: String.raw`- **Industrial arms** weld, paint and assemble cars; millions are installed worldwide, mostly behind safety fences.
- **Mobile robots**: warehouse carts, vacuum cleaners, planetary rovers, self-driving cars.
- **Legged robots**: quadrupeds that climb stairs; humanoids.
- **Aerial and underwater robots**: drones, ocean gliders.
- **Medical robots**: surgical systems in which a surgeon teleoperates tiny instruments.
- **Collaborative robots ("cobots")** designed to work next to people.

Despite their variety, they share the same building blocks: rigid-body geometry, kinematics, dynamics, control, estimation, planning and, increasingly, learning. That is the order of this course.`,
    },
    {
      kind: 'match',
      prompt: 'Match each robot component to its role in the loop.',
      pairs: [
        ['Joint encoder', 'Sense (proprioceptive)'],
        ['Depth camera', 'Sense (exteroceptive)'],
        ['Kalman filter', 'Think (estimate the state)'],
        ['Path planner', 'Think (decide where to go)'],
        ['Brushless DC motor', 'Act'],
      ],
      why: 'Encoders measure the robot, cameras the world; a Kalman filter fuses measurements into a state estimate; a planner chooses motions; motors produce the forces that change the world.',
    },
    {
      kind: 'explain',
      title: 'Why is robotics hard?',
      body: String.raw`Computers beat grandmasters at chess decades before a robot could reliably fold laundry. Hans Moravec noted this **paradox**: what is hard for humans (abstract reasoning) is often easy for machines, while what is effortless for a toddler (perceiving, grasping, walking) is very hard.

Reasons include: the world is **uncertain** (noisy sensors, unknown objects), robots must act in **real time** under physics they cannot pause, **contact** (pushing, grasping) is discontinuous and hard to model, and real-world **data is expensive**: you cannot run a physical robot a billion times. Every unit of this course attacks one of these difficulties.`,
    },
    {
      kind: 'truefalse',
      prompt: 'Moravec’s paradox says that sensorimotor skills such as grasping and walking, which humans find effortless, have proved comparatively hard to reproduce in machines.',
      answer: true,
      why: 'That is the paradox: high-level reasoning (chess, algebra) turned out comparatively easy to compute, while low-level perception and motor control, refined by evolution over hundreds of millions of years, remain hard.',
    },
    {
      kind: 'order',
      prompt: 'A robot vacuum bumps into a chair leg. Put one pass of its sense–think–act loop in order.',
      steps: [
        'The bumper switch closes and the wheel encoders report the robot stopped moving',
        'The software updates its estimate: an obstacle is just ahead',
        'The planner chooses a new heading around the obstacle',
        'The motor controller commands the wheels to back up and turn',
        'The robot’s motion changes what its sensors will measure next',
      ],
      why: 'Measurement comes first, then estimation (what is true?), then decision (what should I do?), then actuation; the action changes the world, which closes the loop back to sensing.',
    },
    {
      kind: 'fill',
      prompt: 'Sensors that measure the robot itself are called ___; sensors that measure the environment are called ___. Devices that convert commands into motion are called ___.',
      bank: ['proprioceptive', 'exteroceptive', 'actuators', 'encoders', 'planners', 'kinematic'],
      answer: ['proprioceptive', 'exteroceptive', 'actuators'],
      why: '“Proprio-” means “one’s own”, “extero-” means “outside”. Encoders are one example of a proprioceptive sensor, not the category name; planners decide rather than move.',
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- A robot is a programmable, actuated machine that **senses, thinks and acts** in a closed loop with the physical world.
- **Proprioceptive** sensors measure the robot; **exteroceptive** sensors measure the world; all measurements are noisy.
- "Think" is a **stack** of loops: fast control at the bottom, slower estimation, planning and task reasoning above.
- **Actuators** drive revolute (rotating) and prismatic (sliding) joints.
- Robotics is hard because of uncertainty, real-time physics, contact and costly data (**Moravec's paradox**).

Next: how many numbers does it take to describe where a robot is? See [degrees of freedom](@robotics/degrees-of-freedom).`,
    },
  ],
  references: [
    { authors: 'K. M. Lynch & F. C. Park', title: 'Modern Robotics: Mechanics, Planning, and Control', year: 2017, venue: 'Cambridge University Press', detail: 'Ch. 1 (Preview)', url: 'https://hades.mech.northwestern.edu/index.php/Modern_Robotics' },
    { authors: 'B. Siciliano, L. Sciavicco, L. Villani & G. Oriolo', title: 'Robotics: Modelling, Planning and Control', year: 2009, venue: 'Springer', detail: 'Ch. 1 (Introduction)' },
    { authors: 'B. Siciliano & O. Khatib (eds.)', title: 'Springer Handbook of Robotics', year: 2016, venue: '2nd ed., Springer', detail: 'Introduction' },
    { authors: 'R. A. Brooks', title: 'A robust layered control system for a mobile robot', year: 1986, venue: 'IEEE Journal of Robotics and Automation 2(1), 14–23' },
    { authors: 'H. Moravec', title: 'Mind Children: The Future of Robot and Human Intelligence', year: 1988, venue: 'Harvard University Press' },
  ],
} satisfies LessonContent;
