import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { findLesson, getSubject, isReady } from '../content/registry';
import type { LessonMeta, LessonRef, Unit } from '../content/types';
import { Rich } from '../lib/Rich';
import { useProgress } from '../store/progress';
import { Sheet, TopBar } from '../components/Chrome';
import { RefList } from '../components/References';
import { subjectStats } from './Home';

const OFFSETS = [0, 44, 66, 44, 0, -44, -66, -44];

export default function SubjectPage() {
  const { id = '' } = useParams();
  const subject = getSubject(id);
  const lessons = useProgress((s) => s.lessons);
  const nav = useNavigate();
  const [sheet, setSheet] = useState<{ unit?: Unit; lesson?: LessonMeta; about?: boolean } | null>(null);
  if (!subject) return <><TopBar title="Not found" /><main className="page">Unknown subject. <Link to="/">Home</Link></main></>;
  const { next } = subjectStats(subject, lessons);
  let n = 0;
  return (
    <>
      <TopBar left={<button className="icon-btn" onClick={() => nav('/')} aria-label="Back">←</button>} title={<>{subject.emoji} {subject.name}</>} />
      <main className="page" style={{ ['--accent' as any]: subject.color }}>
        <button className="btn small secondary" onClick={() => setSheet({ about: true })}>ℹ️ About this course</button>
        {subject.units.map((u, ui) => (
          <section key={u.id}>
            <div className="unit-banner" style={{ background: subject.color }}>
              <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.85 }}>UNIT {ui + 1}</div>
              <h3>{u.title}</h3>
              <p>{u.summary}</p>
              <button className="refs-btn" onClick={() => setSheet({ unit: u })}>📚 Sources & lessons</button>
            </div>
            <div className="path">
              {u.lessons.map((l) => {
                const ref = `${subject.id}/${l.id}` as LessonRef;
                const ready = isReady(ref);
                const done = !!lessons[ref];
                const isNext = ref === next;
                const off = OFFSETS[n++ % OFFSETS.length];
                const cls = ['node', ready ? (done ? 'done' : '') : 'planned', isNext ? 'next' : ''].join(' ');
                return (
                  <div key={l.id} className="node-wrap" style={{ transform: `translateX(${off}px)` }}>
                    {isNext && <div className="start-bubble">START</div>}
                    <button className={cls} onClick={() => (ready ? nav(`/lesson/${ref}`) : setSheet({ lesson: l, unit: u }))} aria-label={l.title}>
                      {ready ? (done ? '👑' : '★') : '🔒'}
                    </button>
                    <div className={'node-label' + (ready ? ' ready' : '')}>{l.title}{done && lessons[ref].crowns > 1 ? ` ×${lessons[ref].crowns}` : ''}</div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>
      {sheet && (
        <Sheet onClose={() => setSheet(null)}>
          {sheet.about && <><h3>{subject.emoji} {subject.name}</h3><Rich text={subject.description} /></>}
          {sheet.lesson && (
            <>
              <div className="card-kind">Coming soon</div>
              <h3>{sheet.lesson.title}</h3>
              <p>{sheet.lesson.summary}</p>
              {!!sheet.lesson.prereqs?.length && (
                <p className="muted" style={{ fontSize: 14 }}>Builds on: {sheet.lesson.prereqs.map((p) => findLesson(p)?.lesson.title ?? p).join(', ')}</p>
              )}
              <p className="muted" style={{ fontSize: 14 }}>This lesson is mapped but not yet written. Its unit's sources are below if you want to read ahead.</p>
            </>
          )}
          {sheet.unit && (
            <>
              {!sheet.lesson && <><h3>{sheet.unit.title}</h3><ol style={{ paddingLeft: 20 }}>{sheet.unit.lessons.map((l) => <li key={l.id}><b>{l.title}</b> — <span className="muted">{l.summary}</span></li>)}</ol></>}
              <h4>Sources & further reading</h4>
              <RefList refs={sheet.unit.references} />
            </>
          )}
          <button className="btn secondary" onClick={() => setSheet(null)}>Close</button>
        </Sheet>
      )}
    </>
  );
}
