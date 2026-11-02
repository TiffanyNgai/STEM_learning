import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findLesson, loadLesson } from '../content/registry';
import type { LessonRef } from '../content/types';
import { useProgress } from '../store/progress';
import { LessonPlayer, type LessonResult, type QueueItem } from '../components/LessonPlayer';
import { TopBar } from '../components/Chrome';
import { Results } from './LessonPage';

const SESSION = 10;

export default function Practice() {
  const s = useProgress();
  const nav = useNavigate();
  const [items, setItems] = useState<QueueItem[] | null>(null);
  const [result, setResult] = useState<{ r: LessonResult; xp: number } | null>(null);
  const now = Date.now();
  const due = Object.entries(s.srs).filter(([, v]) => v.due <= now).sort((a, b) => a[1].due - b[1].due);
  const weak = Object.entries(s.srs).sort((a, b) => a[1].ease - b[1].ease);

  const start = async (keys: string[]) => {
    const out: QueueItem[] = [];
    for (const key of keys.slice(0, SESSION)) {
      const [ref, idx] = key.split('#');
      const lesson = await loadLesson(ref as LessonRef);
      const card = lesson?.cards[+idx];
      if (card) out.push({ card, key });
    }
    if (out.length) setItems(out);
  };

  if (result) return <Results r={result.r} xp={result.xp} title="Practice complete!" onDone={() => { setResult(null); setItems(null); }} />;
  if (items) {
    return <LessonPlayer items={items} onExit={() => setItems(null)} onFinish={(r) => {
      const xp = 5 + Math.round(r.accuracy * 5); s.addPracticeXp(xp); s.gainHeart(); setResult({ r, xp });
    }} />;
  }
  const lessonsWithItems = new Set(Object.keys(s.srs).map((k) => k.split('#')[0]));
  return (
    <>
      <TopBar title="Practice" />
      <main className="page">
        <div className="card">
          <h3>🧠 Spaced review</h3>
          <p className="muted">Questions come back just before you'd forget them. Practising also earns back a heart.</p>
          <p><b>{due.length}</b> question{due.length === 1 ? '' : 's'} due now · {Object.keys(s.srs).length} tracked</p>
          <button className="btn" disabled={!due.length} onClick={() => start(due.map(([k]) => k))}>Review due ({Math.min(SESSION, due.length)})</button>
          <div className="spacer" />
          <button className="btn secondary" disabled={!weak.length} onClick={() => start(weak.map(([k]) => k))}>Drill weakest questions</button>
        </div>
        <h3 style={{ marginTop: 20 }}>Lessons in your review deck</h3>
        {lessonsWithItems.size === 0 && <p className="muted">Finish a lesson to start building your review deck.</p>}
        {[...lessonsWithItems].map((ref) => {
          const loc = findLesson(ref as LessonRef);
          if (!loc) return null;
          return (
            <div key={ref} className="list-item" onClick={() => nav(`/lesson/${ref}`)} style={{ cursor: 'pointer' }}>
              <span style={{ fontSize: 22 }}>{loc.subject.emoji}</span>
              <div className="grow"><b>{loc.lesson.title}</b><div className="muted" style={{ fontSize: 13 }}>{loc.subject.name} · {loc.unit.title}</div></div>
              <span>{'👑'.repeat(Math.min(3, s.lessons[ref]?.crowns ?? 0))}</span>
            </div>
          );
        })}
      </main>
    </>
  );
}
