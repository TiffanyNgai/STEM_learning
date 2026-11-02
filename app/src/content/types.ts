/**
 * Content schema. See SCHEMA.md in this folder for authoring rules.
 *
 * "Rich" strings are a small markdown dialect rendered by src/lib/Rich.tsx:
 *   paragraphs (blank line), "- " bullet lists, "1. " numbered lists, "### " headings,
 *   "> " callout, **bold**, *italic*, `code`, $inline TeX$, $$display TeX$$,
 *   and lesson links [text](@subject/lessonId).
 */
export type Rich = string;

export type SubjectId =
  | 'math' | 'stats' | 'physics' | 'chem' | 'bio'
  | 'ml' | 'med' | 'quantum' | 'cs' | 'drug';

/** Global lesson reference: "subject/lessonId", e.g. "chem/nmr-basics". */
export type LessonRef = `${SubjectId}/${string}`;

export interface Reference {
  authors: string;
  title: string;
  year?: number;
  /** Journal / publisher / edition, e.g. "Nature 596, 583–589" or "4th ed., MIT Press". */
  venue?: string;
  /** Chapter / section pointer, e.g. "Ch. 3–4". */
  detail?: string;
  url?: string;
}

/** A widget is a React component in src/widgets/<type>.tsx (default export). */
export interface WidgetSpec {
  type: string;
  props?: Record<string, unknown>;
  caption?: Rich;
}

interface ExerciseBase {
  prompt: Rich;
  /** Shown after answering (right or wrong). Explain the reasoning, not just the answer. */
  why: Rich;
  widget?: WidgetSpec;
}

export type Card =
  | { kind: 'explain'; title?: string; body: Rich; widget?: WidgetSpec }
  | { kind: 'widget'; title?: string; body?: Rich; widget: WidgetSpec }
  /** Short reminder of a concept taught elsewhere, linking to its home lesson. */
  | { kind: 'recall'; title?: string; points: Rich[]; link: LessonRef }
  | (ExerciseBase & { kind: 'mcq'; choices: Rich[]; answer: number })
  | (ExerciseBase & { kind: 'multi'; choices: Rich[]; answers: number[] })
  | (ExerciseBase & { kind: 'truefalse'; answer: boolean })
  /** prompt contains one "___" per blank; answer lists the correct word-bank entries in order. */
  | (ExerciseBase & { kind: 'fill'; bank: string[]; answer: string[] })
  /** steps are given in the CORRECT order; the app shuffles them. */
  | (ExerciseBase & { kind: 'order'; steps: Rich[] })
  /** pairs are [left, right] in correct correspondence; the app shuffles the right column. */
  | (ExerciseBase & { kind: 'match'; pairs: [Rich, Rich][] })
  /** tolerance is absolute; default 1e-6 * max(1,|answer|). */
  | (ExerciseBase & { kind: 'numeric'; answer: number; tolerance?: number; unit?: string });

export type CardKind = Card['kind'];
export const EXERCISE_KINDS: CardKind[] = ['mcq', 'multi', 'truefalse', 'fill', 'order', 'match', 'numeric'];

/** Contents of src/content/<subject>/lessons/<lessonId>.ts (default export). */
export interface LessonContent {
  cards: Card[];
  references: Reference[];
}

export interface LessonMeta {
  id: string;
  title: string;
  summary: string;
  /** Cross- or same-subject prerequisites. */
  prereqs?: LessonRef[];
}

export interface Unit {
  id: string;
  title: string;
  summary: string;
  lessons: LessonMeta[];
  /** Key references for the whole unit (required even for planned units). */
  references: Reference[];
}

export interface Subject {
  id: SubjectId;
  name: string;
  emoji: string;
  /** Hex accent colour. */
  color: string;
  tagline: string;
  /** Who this is for / what you can do after finishing. */
  description: Rich;
  units: Unit[];
}
