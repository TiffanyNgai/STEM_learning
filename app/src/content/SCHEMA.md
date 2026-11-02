# Authoring guide — Lumen lessons

Everything a content author needs. Types live in `src/content/types.ts`.

## Files
- `src/content/<subject>/index.ts` — `export default { ... } satisfies Subject` — the FULL curriculum
  map (every unit and lesson to degree level), each unit with `references`.
- `src/content/<subject>/lessons/<lessonId>.ts` — `export default { cards, references } satisfies LessonContent`.
  A lesson is "ready" iff this file exists; otherwise it shows as a locked "coming soon" node.
- `src/widgets/<WidgetName>.tsx` — a default-exported React component; auto-registered by file name.
- Subject ids: math, stats, physics, chem, bio, ml, med, quantum, cs, drug.
- Lesson ids: kebab-case, unique within the subject. Global ref = `"<subject>/<lessonId>"`.

## Audience & style (most important)
- Any undergraduate (incl. arts/business) should follow it by reading only the cards.
  Introduce every symbol before using it. Define jargon in plain words on first use.
- Precise: no hand-wavy statements that are false. If simplifying, say "roughly" and give the precise version.
- Bite-sized: each `explain` card ≈ 40–120 words. One idea per card. Lead with intuition/analogy,
  then the precise statement/formula, then a concrete worked example.
- Visual: every lesson has ≥2 widget-bearing cards, ideally interactive/animated.
- Lesson shape (10–16 cards): hook → teach (explain/widget) → quick check (exercise) → teach → check …
  → 2–4 consolidation exercises → final `explain` titled "Key takeaways". Roughly 40–50% exercises.
- Every exercise's `why` explains the reasoning (and the common wrong answer), 1–3 sentences.
- Exercise variety: use at least 4 kinds per lesson (mcq, multi, truefalse, fill, order, match, numeric).
- Cite: `references` on every lesson (2–5 items: textbook w/ chapter, and primary papers for research topics,
  with year/venue/url when known). Only cite real works you are confident exist; never invent DOIs/URLs —
  omit `url` if unsure. Prefer free resources (OpenStax, MIT OCW, arXiv) when appropriate.

## No duplication across subjects
If a concept has a "home" lesson in another subject (e.g. NMR lives in chem, probability in stats,
group theory in math, gradient descent in ml), do NOT re-teach it. Instead:
- add it to `prereqs` in the lesson meta, and
- insert a `recall` card: 3–5 key-point bullets + `link: 'chem/nmr-basics'`.
Inline links in Rich text: `[NMR](@chem/nmr-basics)`.
Cross-subject refs may point to lessons that exist only as metadata in another subject's index —
coordinate by using the lesson ids from the shared ID list given to you.

## Rich text dialect
Paragraphs separated by a blank line. `- ` bullets, `1. ` numbered, `### ` heading, `> ` callout,
`**bold**`, `*italic*`, `` `code` ``, `$x^2$` inline TeX, `$$\int f$$` display TeX (KaTeX).
In TS string literals, escape backslashes: write `'$\\frac{a}{b}$'` or use String.raw`...`.
Preferred: template literals with String.raw for TeX-heavy text, e.g. ``body: String.raw`$$\nabla\cdot E = \rho/\varepsilon_0$$` ``.

## Card kinds (see types.ts)
explain {title?, body, widget?} · widget {title?, body?, widget} · recall {points[], link}
mcq {prompt, choices, answer(index), why} · multi {choices, answers[]} · truefalse {answer}
fill {prompt with ___ per blank, bank (include distractors), answer[] in order}
order {steps in CORRECT order} · match {pairs [left,right][], 3–5 pairs} · numeric {answer, tolerance?, unit?}
Any exercise may also carry `widget`.

## Widgets
Use `{ type: 'Name', props: {...}, caption?: 'Rich' }`. Generic widgets available to everyone:
- `FunctionPlot` {fns: string[], x?, y?, params?: {name,min,max,value,label?}[], animate?, labels?, xLabel?, yLabel?}
  expressions use JS Math names (sin, exp, PI, sqrt, …) and `^` for power; variables x, params, t (time).
- `PhasePortrait` {dx, dy, range?, params?} — 2D vector field with flowing particles.
- `StepReveal` {steps: Rich[], notes?: Rich[]} — step-by-step derivation/proof/algorithm.
- `SvgDiagram` {svg: string} — hand-authored inline SVG; may use SMIL `<animate>`/`<animateTransform>`
  for animation; use CSS vars for colour; include a viewBox; keep text ≥ 9px in a ~320-wide viewBox.

Writing a new widget: copy the style of `FunctionPlot.tsx` / `PhasePortrait.tsx`. Use helpers from `./_kit`
(Stage, Axes, Slider, Btn, PlayPause, Controls, useFrame, useClock, scale, pathOf, compileExpr, rng, C colours).
Rules: SVG in a 320×200-ish viewBox (taller OK), CSS-variable colours only (works in dark mode),
touch-friendly (no hover-only), no external network/data, no new npm deps, ≤ ~200 lines, all props optional
with sensible defaults, a top-of-file doc comment listing props. Prefix nothing with "_" (that hides it).
Name widgets distinctively (e.g. `BlochSphere`, `SortingVisualizer`) — never overwrite a file you didn't create.

## Checks
`npx vitest run` validates every content file (answers in range, references present, widgets exist,
links/prereqs resolve). `npx tsc --noEmit` must show no errors in your files.
