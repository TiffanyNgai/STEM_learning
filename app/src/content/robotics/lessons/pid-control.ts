import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Push harder the further you are',
      body: String.raw`A robot joint, a drone's altitude, a cart on a rail: each must be driven to a target value, the **set-point** $r$, despite friction, loads and model errors. The most widely used answer in industry is the **PID controller** — by most surveys the large majority of industrial control loops use some form of it.

Start with the simplest idea, **proportional control**: measure the **error** $e=r-x$ and push with a force proportional to it, $u=K_pe$. Below, a 1 kg cart must move from $x=0$ to the flag at $r=1$ m. Try a few values of $K_p$.`,
      widget: { type: 'RobPID', props: { kp: 4, ki: 0, kd: 0, controls: ['kp'] }, caption: 'Top: the cart and the set-point flag. Bottom: position x(t), the set-point (dashed) and a ±2 % band. Readouts above the plot.' },
    },
    {
      kind: 'recall',
      title: 'Recall: the damped oscillator',
      points: [
        String.raw`A mass on a spring with a damper obeys $m\ddot x+b\dot x+kx=0$.`,
        String.raw`Natural frequency $\omega_n=\sqrt{k/m}$; damping ratio $\zeta=\dfrac{b}{2\sqrt{km}}$.`,
        String.raw`$\zeta<1$: underdamped (oscillates); $\zeta=1$: critically damped (fastest return without overshoot); $\zeta>1$: overdamped (sluggish).`,
      ],
      link: 'physics/damped-driven-oscillations',
    },
    {
      kind: 'explain',
      title: 'P control is a virtual spring',
      body: String.raw`Our cart has mass $m=1$ kg and viscous friction $b=0.5$ N·s/m, so with control force $u$ and an external load $d$:
$$m\ddot x=u-b\dot x+d.$$
With $u=K_p(r-x)$ and no load this becomes
$$m\ddot x+b\dot x+K_px=K_pr:$$
a mass on a **spring of stiffness $K_p$** anchored at the set-point. So $\omega_n=\sqrt{K_p/m}$ and $\zeta=b/(2\sqrt{K_pm})$.

**Worked example.** $K_p=4$: $\omega_n=2$ rad/s, $\zeta=0.5/4=0.125$. A step response with that damping overshoots by $e^{-\pi\zeta/\sqrt{1-\zeta^2}}\approx67\%$ — exactly what the widget showed.`,
    },
    {
      kind: 'mcq',
      prompt: String.raw`With P control only, you raise $K_p$ from 4 to 16. What happens to the response of this cart?`,
      choices: [
        'Faster, and less oscillatory',
        'Faster, but more oscillatory (lower damping ratio)',
        'Slower, but with less overshoot',
        'No change: the gain only scales the control effort',
      ],
      answer: 1,
      why: String.raw`$\omega_n=\sqrt{K_p/m}$ doubles (from 2 to 4 rad/s), so the response is faster, but $\zeta=b/(2\sqrt{K_pm})$ halves (0.125 → 0.0625), so it rings more. A stiffer spring with the same damper oscillates more — P control alone cannot fix that.`,
    },
    {
      kind: 'explain',
      title: 'D: add a virtual damper',
      body: String.raw`To damp the oscillation, also push **against the velocity**: $u=K_pe-K_d\dot x$. (For a constant set-point $\dot e=-\dot x$, so this is the classic derivative term $K_d\dot e$, but applied to the measurement it avoids a huge "kick" when $r$ jumps.) The closed loop becomes
$$m\ddot x+(b+K_d)\dot x+K_px=K_pr,\qquad \zeta=\frac{b+K_d}{2\sqrt{K_pm}}.$$
$K_p$ sets the stiffness, $K_d$ the damping — independently. **Critical damping** needs $b+K_d=2\sqrt{K_pm}$.

**Worked example.** $K_p=4$, $K_d=1$: $\zeta=1.5/4=0.375$, overshoot $\approx28\%$. For no overshoot, $K_d=2\sqrt{4}-0.5=3.5$.`,
      widget: { type: 'FunctionPlot', props: { fns: ['100*exp(-PI*x/sqrt(1-x^2))'], x: [0, 1], y: [0, 100], labels: ['overshoot %'], xLabel: 'ζ', yLabel: '%' }, caption: String.raw`Percent overshoot of a second-order step response, $100\,e^{-\pi\zeta/\sqrt{1-\zeta^2}}$, versus damping ratio $\zeta$.` },
    },
    {
      kind: 'widget',
      title: 'Tune a PD controller',
      body: String.raw`Now you have two knobs. Try:
- $K_p=4$, $K_d=1$: the predicted 28 % overshoot.
- $K_p=4$, $K_d=3.5$: critically damped — no overshoot.
- $K_p=4$, $K_d=8$: overdamped — no overshoot but a slow creep.
- $K_p=16$, $K_d=7.5$: stiffer *and* critically damped, so faster. What limits how far you can go? Real motors saturate and sensors are noisy; $K_d$ amplifies that noise.`,
      widget: { type: 'RobPID', props: { kp: 4, ki: 0, kd: 1, controls: ['kp', 'kd'], showEffort: true }, caption: 'Orange curve: the control force u(t), rescaled to fit. Notice the large initial push when Kp is big.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`For the same cart ($m=1$ kg, $b=0.5$ N·s/m) with $K_p=9$ N/m, what derivative gain $K_d$ (N·s/m) makes the closed loop **critically damped**?`,
      answer: 5.5,
      tolerance: 0.01,
      unit: 'N·s/m',
      why: String.raw`Critical damping: $b+K_d=2\sqrt{K_pm}=2\sqrt9=6$, so $K_d=6-0.5=5.5$. Forgetting the plant's own friction $b$ gives 6, a slightly overdamped loop.`,
    },
    {
      kind: 'explain',
      title: 'The steady load problem',
      body: String.raw`Now add a constant **load** $d$ — gravity on a vertical joint, a cable dragging, a slope. Once the cart stops ($\ddot x=\dot x=0$), the dynamics say $0=K_p(r-x)+d$, so
$$x_\infty=r+\frac{d}{K_p},\qquad e_\infty=r-x_\infty=-\frac{d}{K_p}.$$
A spring only pushes back if it is *stretched*, so a PD controller must sit off-target to generate a force cancelling the load. $K_d$ does nothing at rest. A bigger $K_p$ shrinks the error but never removes it.

In the widget, a load $d=-2$ N (pushing the cart back toward 0) switches on at $t=5$ s. With $K_p=4$ the cart settles $0.5$ m short.`,
      widget: { type: 'RobPID', props: { kp: 4, ki: 0, kd: 3.5, disturbance: -2, disturbanceTime: 5, controls: ['kp', 'kd', 'd'] }, caption: 'Red dashed line: the load switches on. Readouts for overshoot, rise and settling describe the response before the load; “final error” is measured at the end.' },
    },
    {
      kind: 'numeric',
      prompt: String.raw`PD control with $K_p=8$ N/m holds the cart at $r=1$ m. A constant load $d=-2$ N pushes the cart backward. What is the steady-state error $e_\infty=r-x_\infty$ in metres?`,
      answer: 0.25,
      tolerance: 0.001,
      unit: 'm',
      why: String.raw`$e_\infty=-d/K_p=-(-2)/8=0.25$ m: the cart settles at 0.75 m, short of the flag, where the "spring" force $K_pe=2$ N exactly cancels the load. $K_d$ plays no role because the velocity is zero at rest.`,
    },
    {
      kind: 'explain',
      title: 'I: remember the error',
      body: String.raw`The fix is to accumulate the error over time and push with that too:
$$u(t)=K_pe(t)+K_i\int_0^te(s)\,ds-K_d\dot x(t).$$
While any error remains, the integral keeps growing and so does the push. The loop can only come to rest when $\dot{(\textstyle\int e)}=e=0$. At that point the integral term alone supplies the force cancelling the load: $K_i\int e=-d$. **Integral action removes steady-state error to constant loads**, without knowing the load.

Repeat the experiment with $K_i=2$. The cart dips when the load hits, then the integral term winds up and drives it back to the flag.`,
      widget: { type: 'RobPID', props: { kp: 4, ki: 2, kd: 3.5, disturbance: -2, disturbanceTime: 5, controls: ['kp', 'ki', 'kd', 'd'] }, caption: 'Compare the final error with the previous widget. Notice the integral also adds a little overshoot on the initial step.' },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`With a constant load acting on this cart, a PD controller with a large enough $K_p$ reaches **exactly zero** steady-state error.`,
      answer: false,
      why: String.raw`$e_\infty=-d/K_p$ shrinks as $K_p$ grows but is never zero for finite gain (and huge gains cause saturation and noise problems). Only an integrator (or a feedforward term that exactly cancels a known load) gives zero error.`,
    },
    {
      kind: 'explain',
      title: 'Too much integral',
      body: String.raw`The integral adds a third state, so the closed loop is third order. Differentiating the loop equation once gives the characteristic polynomial
$$ms^3+(b+K_d)s^2+K_ps+K_i.$$
A cubic with positive coefficients $a_3s^3+a_2s^2+a_1s+a_0$ is stable exactly when $a_2a_1>a_3a_0$ (the Routh–Hurwitz test, see [transfer functions & poles](@robotics/transfer-functions-poles)). Here that means
$$(b+K_d)K_p>mK_i.$$
Integral action is powerful but laggy: crank $K_i$ too high and the loop oscillates and then diverges. A second hazard is **windup**: if the motor saturates, the integral keeps growing and later causes a large overshoot ([PID in practice](@robotics/pid-in-practice)).`,
      widget: { type: 'RobPID', props: { kp: 4, ki: 2, kd: 1, controls: ['ki', 'kd'] }, caption: 'With Kp = 4 and Kd = 1, stability needs Ki < 1.5 × 4 = 6. Slide Ki past 6 and watch the oscillation grow.' },
    },
    {
      kind: 'mcq',
      prompt: String.raw`Cart with $m=1$, $b=0.5$, controller $K_p=4$, $K_d=1$. Which integral gain makes the closed loop **unstable**?`,
      choices: [String.raw`$K_i=1$`, String.raw`$K_i=3$`, String.raw`$K_i=5$`, String.raw`$K_i=8$`],
      answer: 3,
      why: String.raw`Stability requires $(b+K_d)K_p>mK_i$, i.e. $1.5\times4=6>K_i$. Only $K_i=8$ violates it. $K_i=5$ is stable but close to the boundary, so it rings for a long time.`,
    },
    {
      kind: 'match',
      prompt: 'Match each term of the PID controller to its main effect.',
      pairs: [
        [String.raw`$K_p\,e$`, 'A virtual spring: sets stiffness and speed of response'],
        [String.raw`$K_i\int e\,dt$`, 'Removes steady-state error to constant loads'],
        [String.raw`$-K_d\,\dot x$`, 'A virtual damper: reduces overshoot and oscillation'],
        ['Too much integral gain', 'Slow oscillation and eventual instability'],
      ],
      why: 'P reacts to the present error, I to the accumulated past error, D to the current rate of change (a prediction of the near future). Each fixes one problem and introduces another: P alone rings, D amplifies noise, I adds lag that can destabilize the loop.',
    },
    {
      kind: 'order',
      prompt: 'Order a simple manual tuning procedure for a PID position loop.',
      steps: [
        String.raw`Set $K_i=K_d=0$`,
        String.raw`Raise $K_p$ until the response is fast but starts to oscillate noticeably`,
        String.raw`Add $K_d$ until the overshoot is acceptable`,
        String.raw`Add a small $K_i$ to remove steady-state error, staying well inside the stability limit`,
        'Re-test with realistic set-point steps, loads, saturation and sensor noise',
      ],
      why: 'Tune the stiffness first, then damp it, then remove the residual offset: each step fixes the main defect left by the previous one. Rules such as Ziegler–Nichols (1942) systematize the first step by finding the gain at which sustained oscillation begins; modern practice usually prefers model-based tuning.',
    },
    {
      kind: 'fill',
      prompt: String.raw`For the cart $m\ddot x=u-b\dot x+d$ under PD control, the damping ratio is $\zeta=(b+K_d)/(2\sqrt{K_p m})$. Increasing ___ makes the response faster, increasing ___ reduces overshoot, and a constant load leaves an error of size $|d|/$___ unless we add ___ action.`,
      bank: ['Kp', 'Kp', 'Kd', 'Ki', 'integral', 'derivative', 'm', 'b'],
      answer: ['Kp', 'Kd', 'Kp', 'integral'],
      why: String.raw`$\omega_n=\sqrt{K_p/m}$ sets speed; $K_d$ raises $\zeta$; the PD steady-state error is $-d/K_p$, and only integral action (or exact feedforward) drives it to zero.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Feedback acts on the error $e=r-x$. PID: $u=K_pe+K_i\int e\,dt+K_d\dot e$ (often with the D term on the measurement).
- On a mass, P is a virtual spring ($\omega_n=\sqrt{K_p/m}$) and D a virtual damper ($\zeta=(b+K_d)/2\sqrt{K_pm}$). Critical damping: $b+K_d=2\sqrt{K_pm}$.
- PD leaves a steady error $-d/K_p$ under a constant load; integral action removes it.
- Integral gain adds lag: for this cart the loop is stable only if $(b+K_d)K_p>mK_i$. Saturation causes integrator windup.
- Real limits on gains come from actuator saturation, sensor noise, sampling delay and unmodelled flexibility.

Next: [transfer functions & poles](@robotics/transfer-functions-poles) and [PID in practice](@robotics/pid-in-practice).`,
    },
  ],
  references: [
    { authors: 'K. J. Åström & R. M. Murray', title: 'Feedback Systems: An Introduction for Scientists and Engineers', year: 2021, venue: '2nd ed., Princeton University Press', detail: 'Chapter “PID Control”', url: 'https://fbswiki.org' },
    { authors: 'K. J. Åström & T. Hägglund', title: 'Advanced PID Control', year: 2006, venue: 'ISA' },
    { authors: 'G. F. Franklin, J. D. Powell & A. Emami-Naeini', title: 'Feedback Control of Dynamic Systems', year: 2019, venue: '8th ed., Pearson', detail: 'Ch. 3 (dynamic response) and Ch. 4 (basic feedback, PID)' },
    { authors: 'J. G. Ziegler & N. B. Nichols', title: 'Optimum settings for automatic controllers', year: 1942, venue: 'Transactions of the ASME 64, 759–768' },
    { authors: 'K. M. Lynch & F. C. Park', title: 'Modern Robotics: Mechanics, Planning, and Control', year: 2017, venue: 'Cambridge University Press', detail: 'Ch. 11 (Robot Control)', url: 'https://hades.mech.northwestern.edu/index.php/Modern_Robotics' },
  ],
} satisfies LessonContent;
