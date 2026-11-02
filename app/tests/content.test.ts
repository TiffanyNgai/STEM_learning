import { describe, expect, it } from 'vitest';
import { allLessonRefs, findLesson, lessonLoaderKeys, loadLesson, subjects } from '../src/content/registry';
import { EXERCISE_KINDS, type Card, type LessonRef } from '../src/content/types';
import { widgetNames } from '../src/widgets/registry';
import { exprToJs } from '../src/widgets/_kit';

/** Widget props that hold math expressions compiled at runtime by compileExpr. */
const EXPR_PROPS: Record<string, string[]> = {
  FunctionPlot: ['fns'], GradientDescent2D: ['f'], MotionGraphs: ['expr'], SlopeFieldEuler: ['f', 'exact'], PhasePortrait: ['dx', 'dy'],
};

const widgets = new Set(widgetNames());
const refs = new Set(allLessonRefs());

function linksIn(text: string): string[] {
  return [...text.matchAll(/\]\(@([^)]+)\)/g)].map((m) => m[1]);
}
function richOf(card: Card): string[] {
  const c = card as any;
  return [c.body, c.prompt, c.why, ...(c.points ?? []), ...(c.choices ?? []), ...(c.steps ?? []), ...(c.pairs?.flat() ?? [])].filter(Boolean);
}

describe('curricula', () => {
  for (const s of subjects) {
    it(`${s.id} curriculum is well-formed`, () => {
      expect(s.units.length).toBeGreaterThan(5);
      const ids = new Set<string>();
      for (const u of s.units) {
        expect(u.references.length, `unit ${u.id} references`).toBeGreaterThan(0);
        for (const l of u.lessons) {
          expect(ids.has(l.id), `duplicate lesson id ${l.id}`).toBe(false);
          ids.add(l.id);
          for (const p of l.prereqs ?? []) expect(refs.has(p), `${s.id}/${l.id} prereq ${p} unknown`).toBe(true);
        }
      }
    });
  }
  it('every lesson file belongs to a curriculum lesson', () => {
    for (const key of lessonLoaderKeys()) {
      const [, subj, , file] = key.split('/');
      const ref = `${subj}/${file.replace(/\.ts$/, '')}` as LessonRef;
      expect(findLesson(ref), `orphan lesson file ${key}`).toBeTruthy();
    }
  });
});

describe('lessons', () => {
  for (const key of lessonLoaderKeys()) {
    const [, subj, , file] = key.split('/');
    const ref = `${subj}/${file.replace(/\.ts$/, '')}` as LessonRef;
    it(ref, async () => {
      const lesson = (await loadLesson(ref))!;
      expect(lesson.references.length, 'references').toBeGreaterThan(0);
      expect(lesson.cards.length).toBeGreaterThanOrEqual(6);
      expect(lesson.cards.some((c) => EXERCISE_KINDS.includes(c.kind)), 'has exercises').toBe(true);
      for (const [i, c] of lesson.cards.entries()) {
        const where = `${ref} card ${i} (${c.kind})`;
        const w = (c as any).widget;
        if (w) expect(widgets.has(w.type), `${where}: unknown widget ${w.type}`).toBe(true);
        for (const k of (w && EXPR_PROPS[w.type]) || []) {
          for (const e of [w.props?.[k]].flat().filter((e) => typeof e === 'string')) {
            // eslint-disable-next-line no-new-func
            expect(() => new Function('x', 'y', 't', `with (Math) { return (${exprToJs(e)}); }`), `${where}: bad expression ${e}`).not.toThrow();
          }
        }
        for (const t of richOf(c)) for (const l of linksIn(t)) expect(refs.has(l as LessonRef), `${where}: bad link ${l}`).toBe(true);
        if ('why' in c) expect(c.why.length, where).toBeGreaterThan(10);
        // MCQ/multi choices are shuffled on screen, so explanations must name a choice by its content.
        if (c.kind === 'mcq' || c.kind === 'multi') {
          expect(c.why, `${where}: why refers to a choice by position`).not.toMatch(
            /\b(choices?|options?)\s+\(?[1-8A-H]\)?(?![\w'])|\b(first|second|third|fourth|last) (option|choice)\b|\(([A-D])\)\s+(is|was)\b|\b[A-D] (is|are) (wrong|correct|right|false|true)\b/i);
        }
        switch (c.kind) {
          case 'mcq': expect(c.answer, where).toBeGreaterThanOrEqual(0); expect(c.answer, where).toBeLessThan(c.choices.length); break;
          case 'multi': expect(c.answers.length, where).toBeGreaterThan(0); c.answers.forEach((a) => expect(a < c.choices.length, where).toBe(true)); break;
          case 'fill': {
            const blanks = c.prompt.split('___').length - 1;
            expect(blanks, `${where}: blanks vs answers`).toBe(c.answer.length);
            c.answer.forEach((a) => expect(c.bank.includes(a), `${where}: answer ${a} not in bank`).toBe(true));
            break;
          }
          case 'order': expect(c.steps.length, where).toBeGreaterThanOrEqual(3); break;
          case 'match': expect(c.pairs.length, where).toBeGreaterThanOrEqual(3); break;
          case 'numeric': expect(Number.isFinite(c.answer), where).toBe(true); break;
          case 'recall': expect(refs.has(c.link), `${where}: recall link ${c.link}`).toBe(true); break;
        }
      }
    });
  }
});
