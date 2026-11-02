import type { Reference, Subject } from '../types';

// ---- Shared references -----------------------------------------------------
const MR: Reference = { authors: 'K. M. Lynch & F. C. Park', title: 'Modern Robotics: Mechanics, Planning, and Control', year: 2017, venue: 'Cambridge University Press', url: 'https://hades.mech.northwestern.edu/index.php/Modern_Robotics' };
const SSVO: Reference = { authors: 'B. Siciliano, L. Sciavicco, L. Villani & G. Oriolo', title: 'Robotics: Modelling, Planning and Control', year: 2009, venue: 'Springer' };
const PR: Reference = { authors: 'S. Thrun, W. Burgard & D. Fox', title: 'Probabilistic Robotics', year: 2005, venue: 'MIT Press' };
const LAVALLE: Reference = { authors: 'S. M. LaValle', title: 'Planning Algorithms', year: 2006, venue: 'Cambridge University Press', url: 'http://lavalle.pl/planning/' };
const CORKE: Reference = { authors: 'P. Corke', title: 'Robotics, Vision and Control: Fundamental Algorithms in Python', year: 2023, venue: '3rd ed., Springer' };
const SPONG: Reference = { authors: 'M. W. Spong, S. Hutchinson & M. Vidyasagar', title: 'Robot Modeling and Control', year: 2020, venue: '2nd ed., Wiley' };
const CRAIG: Reference = { authors: 'J. J. Craig', title: 'Introduction to Robotics: Mechanics and Control', year: 2017, venue: '4th ed., Pearson' };
const MLS: Reference = { authors: 'R. M. Murray, Z. Li & S. S. Sastry', title: 'A Mathematical Introduction to Robotic Manipulation', year: 1994, venue: 'CRC Press' };
const UNDERACT: Reference = { authors: 'R. Tedrake', title: 'Underactuated Robotics', venue: 'Course notes for MIT 6.832', url: 'https://underactuated.csail.mit.edu' };
const MANIP: Reference = { authors: 'R. Tedrake', title: 'Robotic Manipulation: Perception, Planning, and Control', venue: 'Course notes for MIT 6.421', url: 'https://manipulation.csail.mit.edu' };
const HZ: Reference = { authors: 'R. Hartley & A. Zisserman', title: 'Multiple View Geometry in Computer Vision', year: 2004, venue: '2nd ed., Cambridge University Press' };
const AM: Reference = { authors: 'K. J. Åström & R. M. Murray', title: 'Feedback Systems: An Introduction for Scientists and Engineers', year: 2021, venue: '2nd ed., Princeton University Press', url: 'https://fbswiki.org' };
const HANDBOOK: Reference = { authors: 'B. Siciliano & O. Khatib (eds.)', title: 'Springer Handbook of Robotics', year: 2016, venue: '2nd ed., Springer' };
const SIEGWART: Reference = { authors: 'R. Siegwart, I. R. Nourbakhsh & D. Scaramuzza', title: 'Introduction to Autonomous Mobile Robots', year: 2011, venue: '2nd ed., MIT Press' };
const BARFOOT: Reference = { authors: 'T. D. Barfoot', title: 'State Estimation for Robotics', year: 2017, venue: 'Cambridge University Press' };
const SZELISKI: Reference = { authors: 'R. Szeliski', title: 'Computer Vision: Algorithms and Applications', year: 2022, venue: '2nd ed., Springer', url: 'https://szeliski.org/Book/' };

const with_ = (r: Reference, detail: string): Reference => ({ ...r, detail });

export default {
  id: 'robotics',
  name: 'Robotics',
  emoji: '🦾',
  color: '#ff9600',
  tagline: 'From rotating frames to robot foundation models',
  description: String.raw`A zero-to-research path through robotics: how to **describe** a robot (rigid-body transforms, kinematics, dynamics), how to **control** it (PID, LQR, MPC, force and impedance control), how it **knows where it is** (Kalman and particle filters, SLAM, perception), how it **decides where to go** (search, sampling-based and optimization-based planning), and how modern robots **learn** (imitation learning, RL, diffusion policies and vision–language–action models).

The maths it relies on (linear algebra, ODEs, Lie groups, probability, deep learning) is linked to its home lessons in the Maths, Statistics, Physics, CS and ML courses rather than re-taught. By the end you should be able to read a robotics paper at ICRA, RSS or CoRL and know which classical idea it builds on.`,
  units: [
    // 1 -----------------------------------------------------------------------
    {
      id: 'robotics-foundations',
      title: 'What is a robot?',
      summary: 'Sense–think–act, a short history, robot anatomy, degrees of freedom and configuration space.',
      references: [with_(MR, 'Ch. 1–2'), with_(SSVO, 'Ch. 1'), with_(HANDBOOK, 'Ch. 1'), { authors: 'R. A. Brooks', title: 'A robust layered control system for a mobile robot', year: 1986, venue: 'IEEE Journal of Robotics and Automation 2(1), 14–23' }],
      lessons: [
        { id: 'what-is-a-robot', title: 'What is a robot?', summary: 'Sense, think, act: the feedback loop that separates a robot from a machine, and a tour of robot types.' },
        { id: 'history-of-robotics', title: 'A short history of robotics', summary: 'From Unimate and Shakey to Mars rovers, self-driving cars and learned humanoids.', prereqs: ['robotics/what-is-a-robot'] },
        { id: 'robot-anatomy', title: 'Links, joints & actuators', summary: 'Revolute and prismatic joints, serial vs parallel chains, end-effectors.', prereqs: ['robotics/what-is-a-robot'] },
        { id: 'degrees-of-freedom', title: 'Degrees of freedom & configuration space', summary: 'Counting DOF with Grübler’s formula; the C-space and its topology.', prereqs: ['robotics/robot-anatomy'] },
        { id: 'task-space-workspace', title: 'Task space & workspace', summary: 'Where the hand can reach vs how the joints are set; redundancy and dexterity.', prereqs: ['robotics/degrees-of-freedom'] },
      ],
    },
    // 2 -----------------------------------------------------------------------
    {
      id: 'rigid-body-motion',
      title: 'Rigid-body motion',
      summary: 'Rotation matrices, Euler angles, quaternions, homogeneous transforms and twists — the language of every robot.',
      references: [with_(MR, 'Ch. 3'), with_(MLS, 'Ch. 2'), with_(CORKE, 'Ch. 2'), { authors: 'J. Solà, J. Deray & D. Atchuthan', title: 'A micro Lie theory for state estimation in robotics', year: 2018, venue: 'arXiv:1812.01537', url: 'https://arxiv.org/abs/1812.01537' }],
      lessons: [
        { id: 'rotation-matrices', title: 'Rotation matrices', summary: 'Frames, orthonormal matrices, SO(2) and SO(3), composing and inverting rotations.', prereqs: ['math/vectors-matrices', 'robotics/degrees-of-freedom'] },
        { id: 'euler-angles', title: 'Euler angles & gimbal lock', summary: 'Roll–pitch–yaw, conventions that differ between fields, and the singularity at ±90° pitch.', prereqs: ['robotics/rotation-matrices'] },
        { id: 'axis-angle-exponential', title: 'Axis–angle & exponential coordinates', summary: 'Every rotation is one turn about one axis; Rodrigues’ formula and the matrix exponential.', prereqs: ['robotics/rotation-matrices', 'math/matrix-exponential'] },
        { id: 'quaternions', title: 'Unit quaternions', summary: 'Four numbers for a rotation: composition, double cover, slerp and why estimators love them.', prereqs: ['robotics/axis-angle-exponential', 'math/so3-su2'] },
        { id: 'homogeneous-transforms', title: 'Homogeneous transforms', summary: 'Rotation plus translation as one 4×4 matrix in SE(3): composition, inversion, change of frame.', prereqs: ['robotics/rotation-matrices'] },
        { id: 'twists-screws', title: 'Twists, screws & wrenches', summary: 'Spatial velocities as twists, Chasles’ screw theorem, wrenches and the adjoint map.', prereqs: ['robotics/homogeneous-transforms', 'robotics/axis-angle-exponential', 'math/lie-algebras'] },
        { id: 'transform-trees', title: 'Transform trees in practice', summary: 'Frame naming conventions, TF trees, and the bugs that come from multiplying in the wrong order.', prereqs: ['robotics/homogeneous-transforms'] },
      ],
    },
    // 3 -----------------------------------------------------------------------
    {
      id: 'forward-kinematics-unit',
      title: 'Forward kinematics',
      summary: 'From joint angles to hand pose: chaining transforms, Denavit–Hartenberg and the product of exponentials.',
      references: [with_(MR, 'Ch. 4'), with_(SPONG, 'Ch. 3'), with_(CRAIG, 'Ch. 3'), { authors: 'J. Denavit & R. S. Hartenberg', title: 'A kinematic notation for lower-pair mechanisms based on matrices', year: 1955, venue: 'ASME Journal of Applied Mechanics 22, 215–221' }, { authors: 'R. W. Brockett', title: 'Robotic manipulators and the product of exponentials formula', year: 1984, venue: 'Mathematical Theory of Networks and Systems, Lecture Notes in Control and Information Sciences 58, Springer' }],
      lessons: [
        { id: 'forward-kinematics', title: 'Forward kinematics', summary: 'Joint angles in, end-effector pose out: the planar 2-link arm and chained transforms.', prereqs: ['robotics/homogeneous-transforms'] },
        { id: 'dh-parameters', title: 'Denavit–Hartenberg parameters', summary: 'Four numbers per link; classic vs modified DH and their pitfalls.', prereqs: ['robotics/forward-kinematics'] },
        { id: 'product-of-exponentials', title: 'Product of exponentials', summary: 'FK as a product of screw motions — no link frames needed.', prereqs: ['robotics/forward-kinematics', 'robotics/twists-screws'] },
        { id: 'robot-description-formats', title: 'Robot models: URDF & MJCF', summary: 'How real software stores links, joints, inertias and meshes.', prereqs: ['robotics/forward-kinematics', 'robotics/transform-trees'] },
        { id: 'closed-chain-kinematics', title: 'Parallel robots & closed chains', summary: 'Stewart platforms and delta robots: loop-closure constraints and the reversal of FK/IK difficulty.', prereqs: ['robotics/forward-kinematics'] },
      ],
    },
    // 4 -----------------------------------------------------------------------
    {
      id: 'inverse-kinematics-unit',
      title: 'Inverse kinematics',
      summary: 'From a desired hand pose back to joint angles: geometric and analytic solutions, and why there are often several.',
      references: [with_(MR, 'Ch. 6'), with_(SSVO, 'Ch. 2–3'), with_(CRAIG, 'Ch. 4'), { authors: 'C. W. Wampler', title: 'Manipulator inverse kinematic solutions based on vector formulations and damped least-squares methods', year: 1986, venue: 'IEEE Transactions on Systems, Man, and Cybernetics 16(1), 93–101' }],
      lessons: [
        { id: 'inverse-kinematics', title: 'Inverse kinematics', summary: 'Solving the 2-link arm geometrically: zero, one, two or infinitely many solutions.', prereqs: ['robotics/forward-kinematics'] },
        { id: 'analytic-ik-6dof', title: 'Analytic IK for 6-DOF arms', summary: 'Kinematic decoupling with a spherical wrist; why many industrial arms have up to 8 solutions.', prereqs: ['robotics/inverse-kinematics', 'robotics/dh-parameters'] },
      ],
    },
    // 5 -----------------------------------------------------------------------
    {
      id: 'velocity-kinematics',
      title: 'Velocity kinematics & statics',
      summary: 'Jacobians map joint rates to hand velocities and hand forces to joint torques; singularities, manipulability, and Jacobian-based numerical IK.',
      references: [with_(MR, 'Ch. 5'), with_(SSVO, 'Ch. 3'), with_(SPONG, 'Ch. 4'), { authors: 'T. Yoshikawa', title: 'Manipulability of robotic mechanisms', year: 1985, venue: 'International Journal of Robotics Research 4(2), 3–9' }],
      lessons: [
        { id: 'jacobians', title: 'The manipulator Jacobian', summary: 'How joint velocities become end-effector velocities: derivation for the planar arm.', prereqs: ['robotics/forward-kinematics'] },
        { id: 'singularities', title: 'Singularities', summary: 'Where the Jacobian loses rank: boundary, interior and wrist singularities.', prereqs: ['robotics/jacobians', 'math/eigenvalues'] },
        { id: 'manipulability', title: 'Manipulability ellipsoids', summary: 'Velocity and force ellipsoids from the SVD of J; measures of dexterity.', prereqs: ['robotics/singularities', 'math/diagonalization-svd'] },
        { id: 'statics-jacobian-transpose', title: 'Statics: forces through the Jacobian', summary: 'τ = Jᵀ F by virtual work; wrenches, gravity compensation and the force–velocity duality.', prereqs: ['robotics/jacobians', 'physics/torque'] },
        { id: 'redundancy-nullspace', title: 'Redundancy & null-space motion', summary: 'Moving joints without moving the hand; pseudoinverses and secondary objectives.', prereqs: ['robotics/jacobians', 'robotics/numerical-ik'] },
        { id: 'numerical-ik', title: 'Numerical IK: Newton–Raphson', summary: 'Iterating with the Jacobian (pseudo-)inverse; convergence and initial guesses.', prereqs: ['robotics/inverse-kinematics', 'robotics/jacobians'] },
        { id: 'damped-least-squares-ik', title: 'Damped least squares', summary: 'Levenberg–Marquardt-style IK that stays stable near singularities.', prereqs: ['robotics/numerical-ik', 'robotics/singularities'] },
        { id: 'ik-as-optimization', title: 'IK as optimization', summary: 'Joint limits, collision constraints and priorities as a constrained nonlinear program.', prereqs: ['robotics/numerical-ik', 'ml/gradient-descent'] },
      ],
    },
    // 6 -----------------------------------------------------------------------
    {
      id: 'robot-dynamics',
      title: 'Robot dynamics',
      summary: 'Equations of motion of articulated bodies: Lagrangian and Newton–Euler formulations and fast recursive algorithms.',
      references: [with_(MR, 'Ch. 8'), with_(SSVO, 'Ch. 7'), { authors: 'R. Featherstone', title: 'Rigid Body Dynamics Algorithms', year: 2008, venue: 'Springer' }, { authors: 'J. Y. S. Luh, M. W. Walker & R. P. C. Paul', title: 'On-line computational scheme for mechanical manipulators', year: 1980, venue: 'ASME Journal of Dynamic Systems, Measurement, and Control 102(2), 69–76' }],
      lessons: [
        { id: 'single-joint-dynamics', title: 'Dynamics of a single joint', summary: 'Inertia, gravity torque, friction and the pendulum as the simplest robot.', prereqs: ['physics/newtons-laws', 'physics/torque'] },
        { id: 'lagrangian-robot-dynamics', title: 'Lagrangian dynamics of manipulators', summary: 'M(q)q̈ + C(q,q̇)q̇ + g(q) = τ derived from kinetic and potential energy.', prereqs: ['robotics/single-joint-dynamics', 'physics/lagrangian-mechanics', 'robotics/jacobians'] },
        { id: 'dynamics-properties', title: 'Structure of the dynamics', summary: 'Positive-definite mass matrix, skew-symmetry of Ṁ − 2C, linearity in the parameters.', prereqs: ['robotics/lagrangian-robot-dynamics'] },
        { id: 'newton-euler-dynamics', title: 'Recursive Newton–Euler', summary: 'O(n) inverse dynamics by sweeping velocities out and forces back.', prereqs: ['robotics/lagrangian-robot-dynamics', 'robotics/twists-screws'] },
        { id: 'forward-dynamics-simulation', title: 'Forward dynamics & simulation', summary: 'Articulated-body algorithm, integrators and how physics engines step a robot.', prereqs: ['robotics/newton-euler-dynamics', 'math/numerical-ode'] },
        { id: 'system-identification', title: 'System identification', summary: 'Estimating masses, inertias and friction from data with least squares.', prereqs: ['robotics/dynamics-properties', 'stats/linear-regression'] },
      ],
    },
    // 7 -----------------------------------------------------------------------
    {
      id: 'robot-hardware',
      title: 'Actuators, sensors & embedded systems',
      summary: 'Motors, gearboxes, encoders, IMUs, cameras and lidar, and the real-time computers that close the loop.',
      references: [with_(SSVO, 'Ch. 5'), with_(SIEGWART, 'Ch. 4'), { authors: 'P. M. Wensing, A. Wang, S. Seok, D. Otten, J. Lang & S. Kim', title: 'Proprioceptive actuator design in the MIT Cheetah: impact mitigation and high-bandwidth physical interaction for dynamic legged robots', year: 2017, venue: 'IEEE Transactions on Robotics 33(3), 509–522' }, { authors: 'G. A. Pratt & M. M. Williamson', title: 'Series elastic actuators', year: 1995, venue: 'IEEE/RSJ IROS' }],
      lessons: [
        { id: 'dc-motors-gearing', title: 'Electric motors & gearing', summary: 'Torque constant, back-EMF, gear ratios, reflected inertia and backdrivability.', prereqs: ['robotics/single-joint-dynamics', 'physics/inductance'] },
        { id: 'compliant-actuators', title: 'Compliant & hydraulic actuation', summary: 'Series-elastic, quasi-direct-drive and hydraulic actuators; why legged robots changed actuator design.', prereqs: ['robotics/dc-motors-gearing'] },
        { id: 'proprioceptive-sensors', title: 'Encoders, IMUs & force sensors', summary: 'Measuring the robot itself: resolution, bias, drift and noise models.', prereqs: ['robotics/what-is-a-robot', 'stats/normal-distribution'] },
        { id: 'exteroceptive-sensors', title: 'Cameras, depth & lidar', summary: 'Measuring the world: time-of-flight, structured light, stereo and their failure modes.', prereqs: ['robotics/proprioceptive-sensors'] },
        { id: 'embedded-real-time', title: 'Embedded & real-time control', summary: 'Microcontrollers, sampling rates, latency, quantization and buses (CAN, EtherCAT).', prereqs: ['robotics/proprioceptive-sensors'] },
      ],
    },
    // 8 -----------------------------------------------------------------------
    {
      id: 'feedback-control',
      title: 'Feedback control',
      summary: 'Closing the loop: PID, transfer functions, stability and digital implementation.',
      references: [with_(AM, 'Ch. 1; chapters on transfer functions, frequency response and PID control'), { authors: 'G. F. Franklin, J. D. Powell & A. Emami-Naeini', title: 'Feedback Control of Dynamic Systems', year: 2019, venue: '8th ed., Pearson' }, { authors: 'K. J. Åström & T. Hägglund', title: 'Advanced PID Control', year: 2006, venue: 'ISA' }, { authors: 'J. G. Ziegler & N. B. Nichols', title: 'Optimum settings for automatic controllers', year: 1942, venue: 'Transactions of the ASME 64, 759–768' }],
      lessons: [
        { id: 'feedback-intro', title: 'Why feedback?', summary: 'Open vs closed loop, disturbances, error signals and the cost of feedback.', prereqs: ['robotics/what-is-a-robot'] },
        { id: 'pid-control', title: 'PID control', summary: 'Proportional, integral and derivative action; overshoot, settling and steady-state error.', prereqs: ['robotics/feedback-intro', 'math/ode-first-order', 'physics/damped-driven-oscillations'] },
        { id: 'transfer-functions-poles', title: 'Transfer functions & poles', summary: 'Laplace transforms, poles and zeros, and what the second-order step response tells you.', prereqs: ['robotics/pid-control', 'math/ode-linear-systems', 'math/complex-numbers'] },
        { id: 'frequency-response', title: 'Frequency response & robustness', summary: 'Bode plots, bandwidth, gain and phase margins, and the waterbed effect.', prereqs: ['robotics/transfer-functions-poles'] },
        { id: 'pid-in-practice', title: 'PID in practice', summary: 'Integrator windup, derivative filtering, feedforward, cascade loops and tuning rules.', prereqs: ['robotics/pid-control', 'robotics/embedded-real-time'] },
      ],
    },
    // 9 -----------------------------------------------------------------------
    {
      id: 'state-space-control',
      title: 'State-space & optimal control',
      summary: 'Linear systems in matrix form, Lyapunov stability, LQR and model predictive control.',
      references: [with_(AM, 'chapters on linear systems, state feedback and output feedback'), with_(UNDERACT, 'chapters on LQR and trajectory optimization'), { authors: 'J. B. Rawlings, D. Q. Mayne & M. M. Diehl', title: 'Model Predictive Control: Theory, Computation, and Design', year: 2017, venue: '2nd ed., Nob Hill Publishing' }, { authors: 'H. K. Khalil', title: 'Nonlinear Systems', year: 2002, venue: '3rd ed., Prentice Hall' }],
      lessons: [
        { id: 'state-space-models-control', title: 'State-space models', summary: 'ẋ = Ax + Bu, linearization about an equilibrium, and discretization.', prereqs: ['robotics/transfer-functions-poles', 'math/ode-linear-systems', 'math/stability-linearization'] },
        { id: 'controllability-observability', title: 'Controllability & observability', summary: 'Can inputs steer every state? Can outputs reveal every state? Rank tests and duality.', prereqs: ['robotics/state-space-models-control'] },
        { id: 'pole-placement-observers', title: 'Pole placement & observers', summary: 'State feedback u = −Kx, Luenberger observers and the separation principle.', prereqs: ['robotics/controllability-observability'] },
        { id: 'lyapunov-stability', title: 'Lyapunov stability', summary: 'Energy-like functions prove stability without solving the ODE.', prereqs: ['robotics/state-space-models-control', 'math/phase-portraits'] },
        { id: 'lqr', title: 'Linear–quadratic regulator', summary: 'Optimal state feedback from the Riccati equation; trading state error against effort.', prereqs: ['robotics/pole-placement-observers', 'ml/dynamic-programming-rl'] },
        { id: 'mpc', title: 'Model predictive control', summary: 'Re-solve a finite-horizon optimization every step; constraints, horizons and real-time QP.', prereqs: ['robotics/lqr'] },
        { id: 'feedback-linearization', title: 'Feedback linearization & nonlinear control', summary: 'Cancelling nonlinearities, sliding mode and robustness to model error.', prereqs: ['robotics/lyapunov-stability'] },
      ],
    },
    // 10 ----------------------------------------------------------------------
    {
      id: 'manipulator-control',
      title: 'Manipulator control',
      summary: 'Controlling arms in joint space and task space, and controlling forces and interaction.',
      references: [with_(MR, 'Ch. 11'), with_(SSVO, 'Ch. 8–9'), { authors: 'N. Hogan', title: 'Impedance control: an approach to manipulation', year: 1985, venue: 'ASME Journal of Dynamic Systems, Measurement, and Control 107(1), 1–24' }, { authors: 'O. Khatib', title: 'A unified approach for motion and force control of robot manipulators: the operational space formulation', year: 1987, venue: 'IEEE Journal of Robotics and Automation 3(1), 43–53' }],
      lessons: [
        { id: 'independent-joint-control', title: 'Independent joint control', summary: 'One PID per joint with gravity compensation, and where it breaks down.', prereqs: ['robotics/pid-control', 'robotics/lagrangian-robot-dynamics'] },
        { id: 'computed-torque-control', title: 'Computed-torque control', summary: 'Inverse dynamics feedforward turns the arm into a set of double integrators.', prereqs: ['robotics/independent-joint-control', 'robotics/feedback-linearization'] },
        { id: 'operational-space-control', title: 'Operational-space control', summary: 'Controlling the hand directly with the task-space inertia matrix.', prereqs: ['robotics/computed-torque-control', 'robotics/jacobians'] },
        { id: 'impedance-control', title: 'Impedance & admittance control', summary: 'Making the robot behave like a programmable spring–damper.', prereqs: ['robotics/computed-torque-control', 'physics/damped-driven-oscillations'] },
        { id: 'force-control', title: 'Force & hybrid control', summary: 'Regulating contact force; hybrid position/force control along constrained directions.', prereqs: ['robotics/impedance-control', 'robotics/statics-jacobian-transpose'] },
        { id: 'whole-body-control', title: 'Whole-body control', summary: 'Stacks of prioritized tasks solved as a QP for humanoids and mobile manipulators.', prereqs: ['robotics/operational-space-control', 'robotics/redundancy-nullspace'] },
      ],
    },
    // 11 ----------------------------------------------------------------------
    {
      id: 'state-estimation',
      title: 'State estimation',
      summary: 'Fusing noisy models and sensors: Bayes filters, Kalman filters and particle filters.',
      references: [with_(PR, 'Ch. 2–4'), with_(BARFOOT, 'Ch. 3–4'), { authors: 'R. E. Kalman', title: 'A new approach to linear filtering and prediction problems', year: 1960, venue: 'Journal of Basic Engineering 82(1), 35–45' }, { authors: 'N. J. Gordon, D. J. Salmond & A. F. M. Smith', title: 'Novel approach to nonlinear/non-Gaussian Bayesian state estimation', year: 1993, venue: 'IEE Proceedings F 140(2), 107–113' }, { authors: 'S. J. Julier & J. K. Uhlmann', title: 'Unscented filtering and nonlinear estimation', year: 2004, venue: 'Proceedings of the IEEE 92(3), 401–422' }],
      lessons: [
        { id: 'bayes-filter', title: 'The Bayes filter', summary: 'Predict with the motion model, correct with the sensor model: recursive belief updates.', prereqs: ['stats/conditional-probability-bayes', 'stats/markov-chains'] },
        { id: 'kalman-filter', title: 'The Kalman filter', summary: 'The Kalman filter in practice (derivation lives in statistics): discretising motion models, choosing Q and R from sensor specs, multi-rate fusion, outlier gating and consistency checks.', prereqs: ['robotics/bayes-filter', 'stats/normal-distribution', 'stats/state-space-models'] },
        { id: 'extended-kalman-filter', title: 'Extended Kalman filter', summary: 'Linearize the motion and sensor models with Jacobians; consistency and its failure modes.', prereqs: ['robotics/kalman-filter', 'robotics/jacobians'] },
        { id: 'unscented-kalman-filter', title: 'Unscented Kalman filter', summary: 'Propagate sigma points instead of linearizing.', prereqs: ['robotics/extended-kalman-filter'] },
        { id: 'particle-filter', title: 'Particle filters', summary: 'Represent belief with weighted samples; resampling and degeneracy.', prereqs: ['robotics/bayes-filter', 'stats/monte-carlo'] },
        { id: 'imu-sensor-fusion', title: 'Orientation estimation & IMU fusion', summary: 'Complementary filters and error-state Kalman filters on SO(3).', prereqs: ['robotics/extended-kalman-filter', 'robotics/quaternions', 'robotics/proprioceptive-sensors'] },
      ],
    },
    // 12 ----------------------------------------------------------------------
    {
      id: 'localization-mapping',
      title: 'Localization & SLAM',
      summary: 'Where am I, what does the world look like, and how to answer both at once.',
      references: [with_(PR, 'Ch. 5–13'), { authors: 'H. Durrant-Whyte & T. Bailey', title: 'Simultaneous localization and mapping: part I', year: 2006, venue: 'IEEE Robotics & Automation Magazine 13(2), 99–110' }, { authors: 'C. Cadena, L. Carlone, H. Carrillo, Y. Latif, D. Scaramuzza, J. Neira, I. Reid & J. J. Leonard', title: 'Past, present, and future of simultaneous localization and mapping: toward the robust-perception age', year: 2016, venue: 'IEEE Transactions on Robotics 32(6), 1309–1332' }, { authors: 'G. Grisetti, R. Kümmerle, C. Stachniss & W. Burgard', title: 'A tutorial on graph-based SLAM', year: 2010, venue: 'IEEE Intelligent Transportation Systems Magazine 2(4), 31–43' }],
      lessons: [
        { id: 'motion-models-odometry', title: 'Motion models & odometry', summary: 'Dead reckoning from wheels and IMUs, and why its error grows without bound.', prereqs: ['robotics/bayes-filter', 'robotics/homogeneous-transforms'] },
        { id: 'sensor-models', title: 'Sensor models', summary: 'Beam and likelihood-field models for range sensors; landmark measurement models.', prereqs: ['robotics/bayes-filter', 'robotics/exteroceptive-sensors'] },
        { id: 'monte-carlo-localization', title: 'Monte Carlo localization', summary: 'Particle filters on a known map; global localization and the kidnapped robot.', prereqs: ['robotics/particle-filter', 'robotics/sensor-models', 'robotics/motion-models-odometry'] },
        { id: 'occupancy-grid-mapping', title: 'Occupancy grid mapping', summary: 'Log-odds updates build a map when the poses are known.', prereqs: ['robotics/sensor-models'] },
        { id: 'slam', title: 'The SLAM problem', summary: 'Localization and mapping at once: correlations, data association and loop closure.', prereqs: ['robotics/monte-carlo-localization', 'robotics/occupancy-grid-mapping', 'robotics/extended-kalman-filter'] },
        { id: 'pose-graph-slam', title: 'Pose-graph optimization', summary: 'SLAM as sparse nonlinear least squares on a factor graph; robust back-ends.', prereqs: ['robotics/slam', 'robotics/twists-screws'] },
        { id: 'visual-slam-vio', title: 'Visual SLAM & visual–inertial odometry', summary: 'Feature-based and direct SLAM, IMU preintegration, ORB-SLAM and VINS.', prereqs: ['robotics/pose-graph-slam', 'robotics/multi-view-geometry', 'robotics/imu-sensor-fusion'] },
      ],
    },
    // 13 ----------------------------------------------------------------------
    {
      id: 'robot-perception',
      title: 'Perception',
      summary: 'From pixels and points to geometry and objects: camera models, multi-view geometry, point clouds and deep perception.',
      references: [with_(HZ, 'Ch. 6–11'), with_(CORKE, 'Ch. 13–14'), with_(SZELISKI, 'Ch. 2, 7, 11–13'), { authors: 'P. J. Besl & N. D. McKay', title: 'A method for registration of 3-D shapes', year: 1992, venue: 'IEEE Transactions on Pattern Analysis and Machine Intelligence 14(2), 239–256' }, { authors: 'Z. Zhang', title: 'A flexible new technique for camera calibration', year: 2000, venue: 'IEEE Transactions on Pattern Analysis and Machine Intelligence 22(11), 1330–1334' }],
      lessons: [
        { id: 'pinhole-camera-model', title: 'The pinhole camera', summary: 'Projection with intrinsics K and extrinsics [R|t]; lens distortion.', prereqs: ['robotics/homogeneous-transforms'] },
        { id: 'camera-calibration', title: 'Camera & hand–eye calibration', summary: 'Zhang’s checkerboard method and solving AX = XB.', prereqs: ['robotics/pinhole-camera-model'] },
        { id: 'multi-view-geometry', title: 'Stereo & epipolar geometry', summary: 'Essential and fundamental matrices, triangulation and depth from disparity.', prereqs: ['robotics/pinhole-camera-model', 'math/diagonalization-svd'] },
        { id: 'point-clouds-icp', title: 'Point clouds & ICP', summary: 'Registering scans with iterative closest point; normals, voxels and RANSAC.', prereqs: ['robotics/homogeneous-transforms', 'math/diagonalization-svd'] },
        { id: 'visual-servoing', title: 'Visual servoing', summary: 'Closing the control loop directly on image features.', prereqs: ['robotics/pinhole-camera-model', 'robotics/jacobians'] },
        { id: 'deep-perception-robotics', title: 'Deep perception for robots', summary: 'Detection, segmentation and 6-DoF pose estimation with CNNs and transformers.', prereqs: ['ml/cnns', 'robotics/pinhole-camera-model'] },
        { id: 'neural-scene-representations', title: 'Neural scene representations', summary: 'NeRF, 3D Gaussian splatting and feature fields as maps for robots.', prereqs: ['robotics/multi-view-geometry', 'ml/neural-networks-intro'] },
      ],
    },
    // 14 ----------------------------------------------------------------------
    {
      id: 'motion-planning',
      title: 'Motion planning',
      summary: 'Finding collision-free paths and dynamically feasible trajectories: search, sampling and optimization.',
      references: [with_(LAVALLE, 'Ch. 2, 4–6, 14'), with_(MR, 'Ch. 9–10'), { authors: 'S. M. LaValle & J. J. Kuffner', title: 'Randomized kinodynamic planning', year: 2001, venue: 'International Journal of Robotics Research 20(5), 378–400' }, { authors: 'S. Karaman & E. Frazzoli', title: 'Sampling-based algorithms for optimal motion planning', year: 2011, venue: 'International Journal of Robotics Research 30(7), 846–894' }, { authors: 'L. E. Kavraki, P. Švestka, J.-C. Latombe & M. H. Overmars', title: 'Probabilistic roadmaps for path planning in high-dimensional configuration spaces', year: 1996, venue: 'IEEE Transactions on Robotics and Automation 12(4), 566–580' }],
      lessons: [
        { id: 'planning-problem', title: 'The motion planning problem', summary: 'C-space obstacles, completeness, and why planning is hard in high dimensions.', prereqs: ['robotics/degrees-of-freedom'] },
        { id: 'grid-search-planning', title: 'Search-based planning', summary: 'Dijkstra and A* on grids and lattices; admissible heuristics; replanning.', prereqs: ['robotics/planning-problem', 'cs/shortest-paths', 'cs/a-star-search'] },
        { id: 'potential-fields', title: 'Potential fields & reactive navigation', summary: 'Attractive and repulsive fields, local minima, and the dynamic window approach.', prereqs: ['robotics/planning-problem', 'ml/gradient-descent'] },
        { id: 'prm', title: 'Probabilistic roadmaps', summary: 'Sample, connect, query: multi-query planning and probabilistic completeness.', prereqs: ['robotics/planning-problem', 'cs/graphs-intro'] },
        { id: 'motion-planning-rrt', title: 'Rapidly-exploring random trees', summary: 'Growing a tree toward random samples; Voronoi bias, RRT-Connect and kinodynamic RRT.', prereqs: ['robotics/prm'] },
        { id: 'rrt-star-optimal-planning', title: 'Optimal sampling-based planning: RRT*', summary: 'Rewiring for asymptotic optimality; PRM*, informed and batch planners.', prereqs: ['robotics/motion-planning-rrt'] },
        { id: 'trajectory-generation', title: 'Trajectory generation', summary: 'Time scaling, cubic/quintic polynomials, splines and minimum-jerk/snap trajectories.', prereqs: ['robotics/planning-problem'] },
        { id: 'trajectory-optimization', title: 'Trajectory optimization', summary: 'Direct transcription and collocation, CHOMP, TrajOpt and iLQR/DDP.', prereqs: ['robotics/trajectory-generation', 'robotics/lqr', 'ml/second-order-methods'] },
      ],
    },
    // 15 ----------------------------------------------------------------------
    {
      id: 'mobile-legged-aerial',
      title: 'Mobile, legged & aerial robots',
      summary: 'Wheeled vehicles and nonholonomic constraints, walking and running, and flying robots.',
      references: [with_(MR, 'Ch. 13'), with_(SIEGWART, 'Ch. 3'), with_(UNDERACT, 'chapters on walking and running'), { authors: 'M. H. Raibert', title: 'Legged Robots That Balance', year: 1986, venue: 'MIT Press' }, { authors: 'S. Kajita, F. Kanehiro, K. Kaneko, K. Fujiwara, K. Harada, K. Yokoi & H. Hirukawa', title: 'Biped walking pattern generation by using preview control of zero-moment point', year: 2003, venue: 'IEEE ICRA' }, { authors: 'D. Mellinger & V. Kumar', title: 'Minimum snap trajectory generation and control for quadrotors', year: 2011, venue: 'IEEE ICRA' }],
      lessons: [
        { id: 'wheeled-robot-kinematics', title: 'Wheeled robot kinematics', summary: 'Differential drive, car-like and omnidirectional robots; nonholonomic constraints.', prereqs: ['robotics/homogeneous-transforms', 'robotics/degrees-of-freedom'] },
        { id: 'path-tracking', title: 'Path tracking', summary: 'Pure pursuit, Stanley and MPC controllers for vehicles.', prereqs: ['robotics/wheeled-robot-kinematics', 'robotics/pid-control'] },
        { id: 'autonomous-driving-stack', title: 'The autonomous driving stack', summary: 'Perception, prediction, planning and control in self-driving cars; end-to-end alternatives.', prereqs: ['robotics/path-tracking', 'robotics/slam'] },
        { id: 'legged-locomotion-basics', title: 'Legged locomotion basics', summary: 'Static vs dynamic stability, gaits, support polygons and hybrid dynamics.', prereqs: ['robotics/lagrangian-robot-dynamics'] },
        { id: 'zmp-bipedal-walking', title: 'ZMP & bipedal walking', summary: 'Zero-moment point, the linear inverted pendulum and preview control.', prereqs: ['robotics/legged-locomotion-basics', 'robotics/lqr'] },
        { id: 'legged-mpc-learning', title: 'Modern legged control', summary: 'Convex centroidal MPC and RL-trained locomotion policies for quadrupeds and humanoids.', prereqs: ['robotics/zmp-bipedal-walking', 'robotics/mpc'] },
        { id: 'aerial-robots', title: 'Aerial robots', summary: 'Quadrotor dynamics, differential flatness and minimum-snap trajectories.', prereqs: ['robotics/lagrangian-robot-dynamics', 'robotics/trajectory-generation'] },
      ],
    },
    // 16 ----------------------------------------------------------------------
    {
      id: 'manipulation-grasping',
      title: 'Manipulation & grasping',
      summary: 'Contact, friction and grasps; from analytic grasp quality to learned pick-and-place and dexterous hands.',
      references: [with_(MR, 'Ch. 12'), with_(MLS, 'Ch. 5'), with_(MANIP, 'chapters on bin picking and manipulator control'), { authors: 'M. T. Mason', title: 'Mechanics of Robotic Manipulation', year: 2001, venue: 'MIT Press' }, { authors: 'C. Ferrari & J. Canny', title: 'Planning optimal grasps', year: 1992, venue: 'IEEE ICRA' }, { authors: 'J. Mahler, J. Liang, S. Niyaz, M. Laskey, R. Doan, X. Liu, J. A. Ojea & K. Goldberg', title: 'Dex-Net 2.0: Deep learning to plan robust grasps with synthetic point clouds and analytic grasp metrics', year: 2017, venue: 'Robotics: Science and Systems (RSS)' }],
      lessons: [
        { id: 'contact-friction', title: 'Contact & friction', summary: 'Contact types, Coulomb friction cones and complementarity.', prereqs: ['robotics/statics-jacobian-transpose', 'physics/friction-drag'] },
        { id: 'grasping-closure', title: 'Grasps: form & force closure', summary: 'When fingers can resist any wrench; grasp matrices and quality metrics.', prereqs: ['robotics/contact-friction'] },
        { id: 'grasp-planning-learning', title: 'Grasp planning: analytic to learned', summary: 'Sampling grasps on point clouds, Dex-Net, and large-scale self-supervised grasping.', prereqs: ['robotics/grasping-closure', 'robotics/deep-perception-robotics'] },
        { id: 'pick-and-place', title: 'The pick-and-place pipeline', summary: 'Perception, grasp selection, motion planning and execution as one system.', prereqs: ['robotics/grasp-planning-learning', 'robotics/motion-planning-rrt'] },
        { id: 'nonprehensile-manipulation', title: 'Nonprehensile manipulation', summary: 'Pushing, sliding and toppling: quasi-static mechanics and contact-rich planning.', prereqs: ['robotics/contact-friction'] },
        { id: 'dexterous-manipulation', title: 'Dexterous in-hand manipulation', summary: 'Multi-fingered hands, tactile sensing and learned reorientation.', prereqs: ['robotics/grasping-closure'] },
        { id: 'deformable-manipulation', title: 'Deformable objects', summary: 'Cloth, cables and food: high-dimensional state and learned dynamics.', prereqs: ['robotics/pick-and-place'] },
      ],
    },
    // 17 ----------------------------------------------------------------------
    {
      id: 'robot-learning',
      title: 'Learning for robotics',
      summary: 'Imitation learning, reinforcement learning, sim-to-real, diffusion policies and vision–language–action foundation models.',
      references: [
        { authors: 'S. Levine, C. Finn, T. Darrell & P. Abbeel', title: 'End-to-end training of deep visuomotor policies', year: 2016, venue: 'Journal of Machine Learning Research 17(39), 1–40' },
        { authors: 'C. Chi, S. Feng, Y. Du, Z. Xu, E. Cousineau, B. Burchfiel & S. Song', title: 'Diffusion Policy: Visuomotor policy learning via action diffusion', year: 2023, venue: 'Robotics: Science and Systems (RSS)', url: 'https://arxiv.org/abs/2303.04137' },
        { authors: 'A. Brohan et al.', title: 'RT-2: Vision-language-action models transfer web knowledge to robotic control', year: 2023, venue: 'Conference on Robot Learning (CoRL)', url: 'https://arxiv.org/abs/2307.15818' },
        { authors: 'K. Black et al.', title: 'π0: A vision-language-action flow model for general robot control', year: 2024, venue: 'arXiv:2410.24164', url: 'https://arxiv.org/abs/2410.24164' },
        { authors: 'J. Kober, J. A. Bagnell & J. Peters', title: 'Reinforcement learning in robotics: a survey', year: 2013, venue: 'International Journal of Robotics Research 32(11), 1238–1274' },
      ],
      lessons: [
        { id: 'robot-learning-landscape', title: 'Why learning for robots?', summary: 'Where models fail, what data costs, and the spectrum from model-based to end-to-end.', prereqs: ['ml/ml-framing', 'robotics/what-is-a-robot'] },
        { id: 'behavior-cloning', title: 'Behavior cloning & DAgger', summary: 'Supervised learning from teleoperated demonstrations; compounding errors and their fixes.', prereqs: ['robotics/robot-learning-landscape', 'ml/imitation-learning'] },
        { id: 'rl-for-robot-control', title: 'RL for robot control', summary: 'Reward design, PPO and SAC in massively parallel simulation; locomotion success stories.', prereqs: ['robotics/robot-learning-landscape', 'ml/ppo', 'ml/sac-max-entropy'] },
        { id: 'sim-to-real', title: 'Sim-to-real transfer', summary: 'Reality gaps, domain and dynamics randomization, system ID and teacher–student distillation.', prereqs: ['robotics/rl-for-robot-control', 'robotics/forward-dynamics-simulation'] },
        { id: 'diffusion-policy', title: 'Diffusion & flow policies', summary: 'Generating action chunks with denoising diffusion and flow matching; multimodal demonstrations.', prereqs: ['robotics/behavior-cloning', 'ml/diffusion-models', 'ml/flow-matching'] },
        { id: 'vision-language-action-models', title: 'Vision–language–action models', summary: 'RT-2, OpenVLA and π0: robot policies built on pretrained vision–language models.', prereqs: ['robotics/diffusion-policy', 'ml/attention-transformers'] },
        { id: 'robot-data-scaling', title: 'Robot data & scaling', summary: 'Teleoperation rigs, Open X-Embodiment, cross-embodiment transfer and what scaling has (not) shown.', prereqs: ['robotics/vision-language-action-models'] },
        { id: 'world-models-robotics', title: 'World models & model-based learning', summary: 'Learned dynamics and video models for planning and policy evaluation.', prereqs: ['robotics/rl-for-robot-control', 'ml/model-based-rl'] },
      ],
    },
    // 18 ----------------------------------------------------------------------
    {
      id: 'multi-robot-hri-safety',
      title: 'Multi-robot systems, HRI & safety',
      summary: 'Teams and swarms of robots, robots working alongside people, and guaranteeing they do no harm.',
      references: [
        with_(HANDBOOK, 'Parts on multi-robot systems and human-centered robotics'),
        { authors: 'M. Brambilla, E. Ferrante, M. Birattari & M. Dorigo', title: 'Swarm robotics: a review from the swarm engineering perspective', year: 2013, venue: 'Swarm Intelligence 7(1), 1–41' },
        { authors: 'M. A. Goodrich & A. C. Schultz', title: 'Human–robot interaction: a survey', year: 2007, venue: 'Foundations and Trends in Human–Computer Interaction 1(3), 203–275' },
        { authors: 'A. D. Ames, S. Coogan, M. Egerstedt, G. Notomista, K. Sreenath & P. Tabuada', title: 'Control barrier functions: theory and applications', year: 2019, venue: 'European Control Conference (ECC)' },
        { authors: 'ISO', title: 'ISO/TS 15066: Robots and robotic devices — Collaborative robots', year: 2016, venue: 'International Organization for Standardization' },
      ],
      lessons: [
        { id: 'multi-robot-coordination', title: 'Multi-robot coordination', summary: 'Task allocation, multi-agent path finding and formation control.', prereqs: ['robotics/grid-search-planning'] },
        { id: 'swarm-robotics', title: 'Swarm robotics', summary: 'Consensus, flocking and emergent behaviour from simple local rules.', prereqs: ['robotics/multi-robot-coordination', 'math/eigenvalues'] },
        { id: 'human-robot-interaction', title: 'Human–robot interaction', summary: 'Shared autonomy, legibility, intent prediction and user studies.', prereqs: ['robotics/what-is-a-robot'] },
        { id: 'physical-hri-safety', title: 'Physical HRI & collaborative robots', summary: 'Collision detection, power and force limiting, and safety standards for cobots.', prereqs: ['robotics/impedance-control', 'robotics/human-robot-interaction'] },
        { id: 'safe-control-cbf', title: 'Safety filters & control barrier functions', summary: 'Certifying that a controller (or a learned policy) never leaves a safe set.', prereqs: ['robotics/lyapunov-stability', 'robotics/mpc'] },
        { id: 'robot-ethics-society', title: 'Robots & society', summary: 'Autonomy and responsibility, labour, privacy and dual use.', prereqs: ['robotics/human-robot-interaction'] },
      ],
    },
    // 19 ----------------------------------------------------------------------
    {
      id: 'robotics-research',
      title: 'Doing robotics research',
      summary: 'Middleware, simulators, benchmarks and evaluation, reading papers and the field’s open problems.',
      references: [
        { authors: 'S. Macenski, T. Foote, B. Gerkey, C. Lalancette & W. Woodall', title: 'Robot Operating System 2: Design, architecture, and uses in the wild', year: 2022, venue: 'Science Robotics 7(66), eabm6074' },
        { authors: 'E. Todorov, T. Erez & Y. Tassa', title: 'MuJoCo: A physics engine for model-based control', year: 2012, venue: 'IEEE/RSJ IROS' },
        { authors: 'B. Calli, A. Walsman, A. Singh, S. Srinivasa, P. Abbeel & A. M. Dollar', title: 'Benchmarking in manipulation research: using the Yale-CMU-Berkeley object and model set', year: 2015, venue: 'IEEE Robotics & Automation Magazine 22(3), 36–52' },
        { authors: 'N. Sünderhauf, O. Brock, W. Scheirer, R. Hadsell, D. Fox, J. Leitner, B. Upcroft, P. Abbeel, W. Burgard, M. Milford & P. Corke', title: 'The limits and potentials of deep learning for robotics', year: 2018, venue: 'International Journal of Robotics Research 37(4–5), 405–420' },
      ],
      lessons: [
        { id: 'ros-middleware', title: 'ROS & robot middleware', summary: 'Nodes, topics, services, actions, TF and the ROS 2 / DDS architecture.', prereqs: ['robotics/transform-trees'] },
        { id: 'robot-simulation', title: 'Simulators', summary: 'MuJoCo, Isaac, Drake, Gazebo: contact models, speed vs fidelity, and differentiable simulation.', prereqs: ['robotics/forward-dynamics-simulation'] },
        { id: 'benchmarks-evaluation', title: 'Benchmarks & evaluation', summary: 'Success rates with confidence intervals, real-world vs simulated benchmarks, and reproducibility.', prereqs: ['stats/confidence-intervals'] },
        { id: 'reading-robotics-papers', title: 'Reading robotics papers', summary: 'Venues (ICRA, IROS, RSS, CoRL, T-RO, IJRR), how to read a results section and spot cherry-picked videos.', prereqs: ['robotics/benchmarks-evaluation'] },
        { id: 'open-problems-robotics', title: 'Open problems', summary: 'Generalization, contact-rich dexterity, long-horizon tasks, safety of learned policies and data scarcity.', prereqs: ['robotics/vision-language-action-models', 'robotics/reading-robotics-papers'] },
      ],
    },
  ],
} satisfies Subject;
