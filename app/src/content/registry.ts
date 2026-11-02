import type { LessonContent, LessonMeta, LessonRef, Subject, SubjectId, Unit } from './types';

const subjectModules = import.meta.glob<{ default: Subject }>('./*/index.ts', { eager: true });
const lessonLoaders = import.meta.glob<{ default: LessonContent }>('./*/lessons/*.ts');

export const SUBJECT_ORDER: SubjectId[] = ['math', 'stats', 'physics', 'chem', 'bio', 'ml', 'robotics', 'med', 'quantum', 'cs', 'drug'];

export const subjects: Subject[] = SUBJECT_ORDER
  .map((id) => subjectModules[`./${id}/index.ts`]?.default)
  .filter((s): s is Subject => !!s);

export function getSubject(id: string): Subject | undefined {
  return subjects.find((s) => s.id === id);
}

function loaderKey(ref: LessonRef) {
  const [subject, lesson] = ref.split('/');
  return `./${subject}/lessons/${lesson}.ts`;
}

export function isReady(ref: LessonRef): boolean {
  return loaderKey(ref) in lessonLoaders;
}

export async function loadLesson(ref: LessonRef): Promise<LessonContent | undefined> {
  const loader = lessonLoaders[loaderKey(ref)];
  return loader ? (await loader()).default : undefined;
}

export interface LessonLocation { subject: Subject; unit: Unit; unitIndex: number; lesson: LessonMeta; lessonIndex: number }

export function findLesson(ref: LessonRef): LessonLocation | undefined {
  const [sid, lid] = ref.split('/');
  const subject = getSubject(sid);
  if (!subject) return;
  for (const [unitIndex, unit] of subject.units.entries()) {
    const lessonIndex = unit.lessons.findIndex((l) => l.id === lid);
    if (lessonIndex >= 0) return { subject, unit, unitIndex, lesson: unit.lessons[lessonIndex], lessonIndex };
  }
}

export const allLessonRefs = (): LessonRef[] =>
  subjects.flatMap((s) => s.units.flatMap((u) => u.lessons.map((l) => `${s.id}/${l.id}` as LessonRef)));

export const lessonLoaderKeys = () => Object.keys(lessonLoaders);
