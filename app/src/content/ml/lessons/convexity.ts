import type { LessonContent } from '../../types';

// Convex set (left) vs non-convex set (right); a dot slides along the chord between two members.
const SETS_SVG = `<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="80" cy="80" rx="62" ry="46" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="1.5"/>
<line x1="38" y1="95" x2="118" y2="58" stroke="var(--fg)" stroke-width="1.4"/>
<circle cx="38" cy="95" r="3.5" fill="var(--fg)"/><circle cx="118" cy="58" r="3.5" fill="var(--fg)"/>
<circle r="4" fill="var(--c2)"><animate attributeName="cx" values="38;118;38" dur="4s" repeatCount="indefinite"/><animate attributeName="cy" values="95;58;95" dur="4s" repeatCount="indefinite"/></circle>
<path d="M190,30 C250,10 300,30 300,60 C300,80 270,85 245,80 C225,77 222,95 245,105 C275,118 295,125 280,140 C255,160 195,150 185,120 C175,90 165,45 190,30 Z" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="1.5"/>
<line x1="280" y1="55" x2="275" y2="132" stroke="var(--fg)" stroke-width="1.4"/>
<circle cx="280" cy="55" r="3.5" fill="var(--fg)"/><circle cx="275" cy="132" r="3.5" fill="var(--fg)"/>
<circle r="4" fill="var(--c5)"><animate attributeName="cx" values="280;275;280" dur="4s" repeatCount="indefinite"/><animate attributeName="cy" values="55;132;55" dur="4s" repeatCount="indefinite"/></circle>
<text x="80" y="150" font-size="11" text-anchor="middle" fill="var(--fg)">convex: chord stays inside</text>
<text x="240" y="165" font-size="11" text-anchor="middle" fill="var(--fg)">non-convex: chord leaves the set</text>
</svg>`;

const f = (v: string) => `(${v}^2 + c*sin(3*${v}))`;

export default {
  cards: [
    {
      kind: 'explain',
      title: 'Bowls versus egg cartons',
      body: String.raw`[Gradient descent](@ml/gradient-descent) only ever sees the *local* slope. On a bowl, walking downhill must end at the bottom. On an egg carton it can get stuck in whichever cup it started above.

The surface below has two valleys; the left one is deeper. Press **Play**: GD from the right lands in the shallower valley and stays there, because the gradient is zero at its bottom. Tap a start point on the left half and it finds the deeper one.

**Convexity** is the property that rules egg cartons out. When the loss is convex, *every* local minimum is a global minimum.`,
      widget: { type: 'GradientDescent2D', props: { optimizers: ['gd'], lr: 0.05, f: '(x^2-4)^2/8 + y^2 + 0.5*x', range: [-3.5, 3.5, -2, 2], start: [2.8, 1.5] } },
    },
    {
      kind: 'widget',
      title: 'Convex sets',
      body: String.raw`A set $S$ is **convex** if, for any two points $\mathbf a,\mathbf b\in S$, the whole straight segment between them lies in $S$:
$$\lambda\mathbf a+(1-\lambda)\mathbf b\in S\quad\text{for all }\lambda\in[0,1].$$
Examples: lines, half-spaces $\{\mathbf x:\mathbf w^\top\mathbf x\le c\}$, balls, boxes, and any intersection of convex sets. A ring (annulus) or a crescent is not convex.`,
      widget: { type: 'SvgDiagram', props: { svg: SETS_SVG }, caption: 'The sliding dot traces $\\lambda\\mathbf a+(1-\\lambda)\\mathbf b$ as $\\lambda$ goes from 0 to 1.' },
    },
    {
      kind: 'explain',
      title: 'Convex functions: the chord lies above',
      body: String.raw`A function $f$ (defined on a convex set) is **convex** if every chord lies on or above the graph:
$$f(\lambda\mathbf a+(1-\lambda)\mathbf b)\le\lambda f(\mathbf a)+(1-\lambda)f(\mathbf b),\qquad\lambda\in[0,1].$$
Equivalently, the region above the graph (the *epigraph*) is a convex set. It is **strictly** convex if the inequality is strict whenever $\mathbf a\ne\mathbf b$ and $0<\lambda<1$.

Below: $f(x)=x^2+c\sin 3x$ with a chord from $a$ to $b$. For $c=0$ every chord sits above the curve. Raise $c$: the wiggles eventually poke above some chord, and $f$ is no longer convex.`,
      widget: {
        type: 'FunctionPlot',
        props: {
          fns: [f('x'), `0*sqrt((x-a)*(b-x)) + ${f('a')} + (${f('b')} - ${f('a')})*(x-a)/(b-a)`],
          x: [-2.5, 2.5], y: [-2, 7],
          params: [{ name: 'c', min: 0, max: 1, value: 0, label: 'wiggle c' }, { name: 'a', min: -2.4, max: 0, value: -1.5, label: 'a' }, { name: 'b', min: 0.2, max: 2.4, value: 1.2, label: 'b' }],
          labels: ['f(x)', 'chord'], xLabel: 'x', yLabel: 'f',
        },
        caption: String.raw`$f''(x)=2-9c\sin 3x$, so $f$ is convex exactly when $c\le 2/9\approx0.22$.`,
      },
    },
    {
      kind: 'multi',
      prompt: String.raw`Which functions are convex on the stated domain? Select all.`,
      choices: ['$x^2$ on $\\mathbb R$', '$|x|$ on $\\mathbb R$', '$e^x$ on $\\mathbb R$', '$\\sin x$ on $\\mathbb R$', '$-\\log x$ on $x>0$', '$x^3$ on $\\mathbb R$'],
      answers: [0, 1, 2, 4],
      why: String.raw`$x^2$, $e^x$ and $-\log x$ have $f''\ge0$ on their domains ($2$, $e^x$, $1/x^2$). $|x|$ is convex although not differentiable at 0 (check the chord definition). $\sin x$ and $x^3$ have $f''<0$ somewhere ($x^3$ is concave for $x<0$), so they fail.`,
    },
    {
      kind: 'explain',
      title: 'Why convexity is so powerful',
      body: String.raw`For a differentiable $f$, convexity is equivalent to the **first-order condition**: every tangent plane lies below the graph,
$$f(\mathbf y)\ge f(\mathbf x)+\nabla f(\mathbf x)^\top(\mathbf y-\mathbf x)\quad\text{for all }\mathbf x,\mathbf y.$$
Put $\nabla f(\mathbf x^*)=\mathbf 0$: then $f(\mathbf y)\ge f(\mathbf x^*)$ for **every** $\mathbf y$. A stationary point of a convex function is a **global** minimum. That is why we can trust GD on convex losses: once the gradient vanishes, we are done.

**Second-order test.** A twice-differentiable $f$ is convex iff its Hessian is positive semidefinite everywhere, $\nabla^2f(\mathbf x)\succeq0$ (all eigenvalues $\ge0$; see [eigenvalues](@math/eigenvalues)).`,
    },
    {
      kind: 'fill',
      prompt: String.raw`For a differentiable convex $f$, every tangent plane lies ___ the graph. So a point with $\nabla f=\mathbf 0$ is a ___ minimum. A twice-differentiable $f$ is convex iff its Hessian is positive ___ everywhere.`,
      bank: ['below', 'above', 'global', 'local-only', 'semidefinite', 'diagonal', 'invertible'],
      answer: ['below', 'global', 'semidefinite'],
      why: String.raw`The tangent is a global under-estimator: $f(\mathbf y)\ge f(\mathbf x)+\nabla f(\mathbf x)^\top(\mathbf y-\mathbf x)$. With zero gradient this says $f(\mathbf y)\ge f(\mathbf x)$ everywhere. "Definite" would be too strong: $f(x)=x^4$ is convex but $f''(0)=0$.`,
    },
    {
      kind: 'explain',
      title: 'Building convex losses',
      body: String.raw`You rarely check convexity from scratch. These operations **preserve** it:
- **Non-negative sums:** $\alpha f+\beta g$ with $\alpha,\beta\ge0$. (Average loss over data + an L2 penalty.)
- **Affine composition:** $f(A\mathbf x+\mathbf b)$ is convex if $f$ is.
- **Pointwise maximum:** $\max(f,g)$. (The hinge loss $\max(0,1-yz)$.)

So least squares $\frac1n\sum(\mathbf w^\top\mathbf x_i-y_i)^2$, [logistic regression](@ml/logistic-regression-ml)'s log-loss, softmax regression and SVMs are all convex in the weights.

**Neural networks are not.** Swap two hidden units (and their weights): the function and loss are unchanged, so minima come in symmetric copies. The midpoint of two such copies is generally a *worse* network, which convexity would forbid.`,
    },
    {
      kind: 'truefalse',
      prompt: String.raw`The product of two convex functions is always convex.`,
      answer: false,
      why: String.raw`Products are not on the list of convexity-preserving operations. Counterexample: $f(x)=x$ and $g(x)=x^2$ are both convex, but $fg=x^3$ is not. Sums with non-negative weights and pointwise maxima *are* safe.`,
    },
    {
      kind: 'mcq',
      prompt: 'Why is the training loss of a neural network with one hidden layer (two or more hidden units) not convex in its weights?',
      choices: [
        'Because it uses a loss function that is non-convex in the predictions',
        'Permuting hidden units gives distinct weight vectors with identical loss, and averaging two such minima generally gives a worse network',
        'Because the gradient is computed by backpropagation',
        'Because the dataset is finite',
      ],
      answer: 1,
      why: String.raw`Even with a convex loss (squared error, cross-entropy) in the *output*, the output depends non-linearly on the weights. Permutation symmetry gives several isolated minima with the same value, and a convex function's set of minimizers must be convex, so the segment between them would also have to be optimal. It isn't.`,
    },
    {
      kind: 'explain',
      title: 'Strong convexity and smoothness',
      body: String.raw`To say *how fast* GD converges we bracket the curvature. For a twice-differentiable $f$:
$$\mu I\preceq\nabla^2f(\mathbf x)\preceq LI\quad\text{for all }\mathbf x,\quad 0<\mu\le L.$$
- $L$-**smooth**: curvature at most $L$ (the gradient is $L$-Lipschitz). This is the $\lambda_{\max}$ that limits the step size.
- $\mu$-**strongly convex**: curvature at least $\mu$, so $f$ grows at least like $\frac\mu2\|\mathbf x-\mathbf x^*\|^2$ and has a unique minimizer.
- **Condition number** $\kappa=L/\mu$.

**Guarantees for GD with $\eta=1/L$** (Boyd & Vandenberghe §9.3; Nesterov 2004, Ch. 2):
$$\text{smooth convex: } f(\mathbf x_k)-f^*\le\frac{L\|\mathbf x_0-\mathbf x^*\|^2}{2k},\qquad\text{strongly convex: } f(\mathbf x_k)-f^*\le\Big(1-\tfrac1\kappa\Big)^k\big(f(\mathbf x_0)-f^*\big).$$
The first is *sublinear* ($O(1/k)$); the second is *linear* (geometric).`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`$f(x,y)=3x^2+12y^2$. What is the condition number $\kappa=L/\mu$?`,
      answer: 4,
      why: String.raw`The Hessian is $\mathrm{diag}(6,24)$, so $\mu=6$, $L=24$ and $\kappa=24/6=4$. (Don't use the coefficients 3 and 12 directly as curvatures: $\partial^2(3x^2)/\partial x^2=6$. The ratio happens to be the same here.)`,
    },
    {
      kind: 'numeric',
      prompt: String.raw`GD with $\eta=1/L$ on a strongly convex function with $\kappa=100$. Using the bound $f(\mathbf x_k)-f^*\le(1-1/\kappa)^k(f(\mathbf x_0)-f^*)$, how many steps $k$ guarantee that the gap has shrunk by a factor of at least $e$ (about 2.718)? Give the smallest whole number.`,
      answer: 100,
      tolerance: 0.5,
      why: String.raw`We need $(0.99)^k\le e^{-1}$, i.e. $k\ge 1/(-\ln0.99)=1/0.01005\approx99.5$, so $k=100$. Rule of thumb: about $\kappa$ steps per factor of $e$. The [momentum lesson](@ml/momentum-methods) shows how to get $\sqrt\kappa$.`,
    },
    {
      kind: 'match',
      prompt: 'Match each loss (as a function of the model weights) to its convexity.',
      pairs: [
        ['Least squares $\\|X\\mathbf w-\\mathbf y\\|^2$', 'Convex; strongly convex iff $X$ has full column rank'],
        ['Least squares + $\\lambda\\|\\mathbf w\\|^2$, $\\lambda>0$', 'Strongly convex'],
        ['Logistic-regression log-loss', 'Convex'],
        ['Cross-entropy of a 2-layer neural net', 'Non-convex'],
      ],
      why: String.raw`The least-squares Hessian is $2X^\top X$, positive definite exactly when the columns of $X$ are independent. Adding $\lambda\|\mathbf w\|^2$ adds $2\lambda I$ to the Hessian, so $\mu\ge2\lambda>0$. Log-loss is convex (its Hessian is $X^\top DX$ with $D$ diagonal, non-negative). Hidden layers break convexity.`,
    },
    {
      kind: 'explain',
      title: 'Key takeaways',
      body: String.raw`- Convex set: contains every segment between its points. Convex function: chords lie above the graph.
- For differentiable convex $f$: tangents are global under-estimators, so $\nabla f=\mathbf 0$ means a **global** minimum. Test: Hessian $\succeq0$.
- Non-negative sums, affine composition and pointwise max preserve convexity. Linear/logistic/softmax regression and SVMs are convex; neural networks are not.
- $L$-smooth and $\mu$-strongly convex: GD with $\eta=1/L$ converges linearly, $\approx\kappa=L/\mu$ steps per factor of $e$. Merely smooth convex: $O(1/k)$.
- Non-convex deep learning still borrows these ideas locally: near a minimum the loss is roughly a convex quadratic.`,
    },
  ],
  references: [
    { authors: 'S. Boyd & L. Vandenberghe', title: 'Convex Optimization', year: 2004, venue: 'Cambridge University Press', detail: 'Ch. 2 (convex sets), Ch. 3 (convex functions), §9.1–9.3 (strong convexity, gradient descent)', url: 'https://web.stanford.edu/~boyd/cvxbook/' },
    { authors: 'Y. Nesterov', title: 'Introductory Lectures on Convex Optimization: A Basic Course', year: 2004, venue: 'Kluwer Academic Publishers', detail: 'Ch. 2 (smooth convex optimization)' },
    { authors: 'J. Nocedal & S. J. Wright', title: 'Numerical Optimization', year: 2006, venue: '2nd ed., Springer', detail: 'Ch. 2 (fundamentals of unconstrained optimization)' },
    { authors: 'I. Goodfellow, Y. Bengio & A. Courville', title: 'Deep Learning', year: 2016, venue: 'MIT Press', detail: '§4.3, §8.2 (non-convexity, local minima, weight-space symmetry)', url: 'https://www.deeplearningbook.org' },
  ],
} satisfies LessonContent;
