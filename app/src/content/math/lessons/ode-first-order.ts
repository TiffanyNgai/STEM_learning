import type { LessonContent } from '../../types';

export default {
  cards: [
    {
      kind: 'explain',
      title: 'A rule for change',
      body: String.raw`Most laws of nature don't tell you *what* something is — they tell you *how fast it changes*, given how it is right now.

A **differential equation** is such a rule. Write $y(t)$ for a quantity at time $t$ (money in an account, bacteria in a dish) and $y'$ (say "y prime", also written $\frac{dy}{dt}$) for its rate of change. Then

$$y' = k\,y$$

says: "the growth rate is proportional to the current amount", with a constant $k$. It is **first-order** (only the first derivative appears) and **ordinary** (one input variable, $t$). Solving it means finding the *function* $y(t)$, not a number.`,
    },
    {
      kind: 'widget',
      title: 'Exponential growth and decay',
      body: String.raw`The solutions of $y' = ky$ are $y(t) = y_0\,e^{kt}$, where $y_0 = y(0)$ is the starting value. Check: the derivative of $y_0 e^{kt}$ is $k\,y_0e^{kt} = k\,y$. ✓

Drag $k$ through zero: positive $k$ gives growth, negative $k$ gives decay, $k=0$ gives "nothing changes".`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: ['y0*exp(k*x)'], x: [0, 4], y: [0, 6], xLabel: 't', yLabel: 'y',
          params: [{ name: 'k', min: -1.5, max: 1, value: 0.4 }, { name: 'y0', min: 0.2, max: 3, value: 1, label: 'y₀' }],
        },
      },
    },
    {
      kind: 'mcq',
      prompt: String.raw`A culture obeys $y' = 0.5\,y$ and starts with $y(0) = 2$ (thousand cells). Which function describes it?`,
      choices: [String.raw`$y(t) = 2e^{0.5t}$`, String.raw`$y(t) = 0.5e^{2t}$`, String.raw`$y(t) = 2 + 0.5t$`, String.raw`$y(t) = e^{0.5t} + 2$`],
      answer: 0,
      why: String.raw`Solutions of $y'=ky$ are $y_0e^{kt}$ with $k=0.5$, $y_0=2$. The linear $2+0.5t$ has constant slope, but here the slope grows with $y$. $e^{0.5t}+2$ starts at 3, not 2, and its derivative is not $0.5y$.`,
    },
    {
      kind: 'widget',
      title: 'Slope fields: seeing an ODE',
      body: String.raw`A first-order ODE $y' = f(t, y)$ assigns a **slope** to every point $(t, y)$. Draw a tiny dash with that slope at many points — a **slope field**. A solution is a curve that is tangent to the dashes everywhere: it "goes with the flow".

Here $f = y(1-y)$, the **logistic equation** (growth that saturates at 1). Tap anywhere to start a new solution, press **Run**, and notice: curves never cross, and every curve starting above $y=0$ heads toward $y=1$ (start below 0 and it runs away downward).`,
      widget: { type: 'SlopeFieldEuler', props: { f: 'y*(1-y)', x: [0, 8], y: [-0.5, 2], x0: 0, y0: 0.1, h: 0.1 } },
    },
    {
      kind: 'truefalse',
      prompt: String.raw`For $y' = y(1-y)$, two different solution curves can cross each other.`,
      answer: false,
      why: String.raw`At a crossing point both curves would share the same starting value, yet behave differently afterwards. The **existence–uniqueness theorem** (Picard–Lindelöf) rules this out whenever $f$ and $\partial f/\partial y$ are continuous — true for $y(1-y)$. So through each point passes exactly one solution.`,
    },
    {
      kind: 'explain',
      title: 'Separable equations',
      body: String.raw`If the right-hand side factors as (something in $t$) × (something in $y$), i.e. $y' = g(t)\,h(y)$, the equation is **separable**. Move all the $y$'s to one side and integrate:

$$\int \frac{dy}{h(y)} = \int g(t)\,dt.$$

(Treating $dy/dt$ like a fraction is shorthand for the chain rule; it is justified wherever $h(y) \ne 0$.) Step through an example below.`,
      widget: {
        type: 'StepReveal',
        props: {
          steps: [
            String.raw`Solve $y' = -2t\,y$ with $y(0) = 1$. Here $g(t) = -2t$ and $h(y) = y$.`,
            String.raw`Separate: $\dfrac{dy}{y} = -2t\,dt$.`,
            String.raw`Integrate both sides: $\ln|y| = -t^2 + C$.`,
            String.raw`Exponentiate: $y = A\,e^{-t^2}$, where $A = \pm e^{C}$ (and $A=0$ covers the solution $y\equiv 0$).`,
            String.raw`Use the initial condition: $y(0) = A = 1$, so $y(t) = e^{-t^2}$ — a bell curve.`,
          ],
          notes: ['', 'Divide by y (assuming y ≠ 0) and multiply by dt.', 'C is one combined constant of integration.', '', String.raw`Always check: $y' = -2t\,e^{-t^2} = -2t\,y$ ✓`],
        },
      },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Using the solution $y(t) = e^{-t^2}$ of $y' = -2ty,\ y(0)=1$, compute $y(1)$ to 3 decimal places.`,
      answer: 0.368,
      tolerance: 0.002,
      why: String.raw`$y(1) = e^{-1} \approx 0.368$. A common slip is computing $e^{-2}$ (≈ 0.135) by plugging the coefficient $-2$ into the exponent instead of $-t^2$.`,
    },
    {
      kind: 'explain',
      title: 'Linear equations & integrating factors',
      body: String.raw`A **linear** first-order ODE has the form $y' + p(t)\,y = q(t)$. Trick: multiply by the **integrating factor** $\mu(t) = e^{\int p\,dt}$. The left side becomes an exact derivative, $(\mu y)' = \mu q$, so just integrate.

Example: $y' + y = 1$. Here $\mu = e^{t}$, so $(e^t y)' = e^t$, giving $e^t y = e^t + C$, i.e.

$$y(t) = 1 + C\,e^{-t}.$$

Every solution relaxes to $y = 1$, whatever $C$ is — like a cup of tea cooling to room temperature (Newton's law of cooling has exactly this form).`,
      widget: { type: 'FunctionPlot', props: { fns: ['1 + C*exp(-x)'], x: [0, 6], y: [-1, 3], xLabel: 't', yLabel: 'y', params: [{ name: 'C', min: -2, max: 2, value: 1.5 }] } },
    },
    {
      kind: 'order',
      prompt: String.raw`Put the integrating-factor method for $y' + p(t)y = q(t)$ in order.`,
      steps: [
        String.raw`Identify $p(t)$ and $q(t)$ (make sure the coefficient of $y'$ is 1).`,
        String.raw`Compute $\mu(t) = e^{\int p(t)\,dt}$.`,
        String.raw`Multiply through so the left side is $(\mu y)'$.`,
        String.raw`Integrate: $\mu y = \int \mu q\,dt + C$.`,
        String.raw`Divide by $\mu$ and fix $C$ from the initial condition.`,
      ],
      why: String.raw`The method works because $\mu' = p\mu$, which makes $\mu y' + \mu p y$ equal to $(\mu y)'$ by the product rule. You must normalise first: if the equation is $2y' + \dots$, divide by 2 before reading off $p$.`,
    },
    {
      kind: 'explain',
      title: 'Equilibria',
      body: String.raw`For an **autonomous** equation $y' = f(y)$ (no explicit $t$), an **equilibrium** is a value $y^*$ with $f(y^*) = 0$: if you start there, you stay there forever.

It is **stable** if nearby solutions move *toward* it, **unstable** if they move away. For the logistic $y' = y(1-y)$: equilibria $y^*=0$ and $y^*=1$. Just above 0, $f>0$ so $y$ grows away → 0 is unstable. Just below or above 1, $f$ pushes back toward 1 → 1 is stable. You saw both in the slope field.`,
    },
    {
      kind: 'fill',
      prompt: String.raw`An equilibrium of $y' = f(y)$ is a value $y^*$ where $f(y^*) =$ ___. It is stable if nearby solutions move ___ it.`,
      bank: ['0', '1', 'toward', 'away from', '∞'],
      answer: ['0', 'toward'],
      why: String.raw`Zero rate of change means the quantity is frozen. "Stable" means small disturbances die out, so solutions return toward $y^*$; if they move away it is unstable (like a pencil balanced on its tip).`,
    },
    {
      kind: 'widget',
      title: 'Euler’s method: how computers solve ODEs',
      body: String.raw`Most ODEs have no formula solution. **Euler's method** follows the slope for a small step $h$:

$$y_{n+1} = y_n + h\,f(t_n, y_n),\qquad t_{n+1} = t_n + h.$$

Below, $y' = y$ with $y(0)=1$ (exact answer $e^t$, green). Press **Step** a few times, then shrink $h$ and **Run** again. Once $h$ is small, halving it roughly halves the error at the end — Euler is a **first-order** method (global error proportional to $h$).`,
      widget: { type: 'SlopeFieldEuler', props: { f: 'y', exact: 'y0*exp(x-x0)', x: [0, 2], y: [0, 8], x0: 0, y0: 1, h: 0.5 } },
    },
    {
      kind: 'numeric',
      prompt: String.raw`Apply Euler's method to $y' = y$, $y(0) = 1$ with step $h = 0.5$. What is the approximation of $y(1)$ after two steps?`,
      answer: 2.25,
      tolerance: 0.001,
      why: String.raw`Step 1: $y_1 = 1 + 0.5\cdot 1 = 1.5$. Step 2: $y_2 = 1.5 + 0.5\cdot 1.5 = 2.25$. The true value is $e \approx 2.718$; Euler undershoots because the slope keeps increasing during each step but the method uses the slope from the start of the step.`,
    },
    {
      kind: 'match',
      prompt: 'Match each ODE to the behaviour of its solutions.',
      pairs: [
        [String.raw`$y' = 0.3y$`, 'Exponential growth'],
        [String.raw`$y' = y(1-y)$, $0<y(0)<1$`, 'S-shaped rise levelling off at 1'],
        [String.raw`$y' + y = 1$`, 'Exponential relaxation to 1'],
        [String.raw`$y' = -2ty$`, 'Gaussian bell curve'],
      ],
      why: String.raw`$y'=ky$ with $k>0$ grows exponentially; the logistic equation saturates at its stable equilibrium 1; $y'+y=1$ gives $1+Ce^{-t}$; and separating $y'=-2ty$ gives $Ae^{-t^2}$.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- An ODE $y' = f(t,y)$ is a rule for change; a solution is a whole function, fixed by an initial condition $y(t_0)=y_0$.
- **Slope fields** show the rule geometrically; for well-behaved $f$, solution curves never cross (uniqueness).
- **Separable** equations: split and integrate. **Linear** equations: multiply by $e^{\int p}$.
- **Equilibria** solve $f(y^*)=0$; they are stable or unstable depending on whether nearby solutions return.
- **Euler's method** $y_{n+1}=y_n+hf$ approximates any ODE; error shrinks in proportion to $h$.

Next: two or more interacting quantities — [linear systems](@math/ode-linear-systems).`,
    },
  ],
  references: [
    { authors: 'S. H. Strogatz', title: 'Nonlinear Dynamics and Chaos', year: 2015, venue: '2nd ed., Westview Press / CRC', detail: 'Ch. 2 (flows on the line)' },
    { authors: 'W. E. Boyce, R. C. DiPrima, D. B. Meade', title: 'Elementary Differential Equations and Boundary Value Problems', year: 2017, venue: '11th ed., Wiley', detail: 'Ch. 1–2, §8.1 (Euler method)' },
    { authors: 'MIT OpenCourseWare', title: '18.03SC Differential Equations', year: 2011, venue: 'Massachusetts Institute of Technology', detail: 'Unit I: First-order differential equations', url: 'https://ocw.mit.edu/courses/18-03sc-differential-equations-fall-2011/' },
  ],
} satisfies LessonContent;
