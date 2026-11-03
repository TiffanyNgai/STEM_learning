import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { findLesson, loadLesson } from '../content/registry';
import { EXERCISE_KINDS, type LessonContent, type LessonRef } from '../content/types';
import { reportActivity } from '../lib/push';
import { sfx } from '../lib/sfx';
import { liveStreak, useProgress } from '../store/progress';
import { CHECKPOINT_XP, LessonPlayer, type LessonResult } from '../components/LessonPlayer';
import { TeachCard } from '../components/TeachCards';
import { RefList } from '../components/References';
import { Confetti } from '../components/Confetti';

export function Results({ r, xp, onDone, title }: { r: LessonResult; xp: number; onDone: () => void; title: string }) {
  const streak = useProgress(liveStreak);
  useEffect(() => { if (useProgress.getState().settings.sound) sfx.finish(); }, []);
  const mm = Math.floor(r.seconds / 60); const ss = String(r.seconds % 60).padStart(2, '0');
  return (
    <div className="results">
      <Confetti />
      <div className="big">{r.accuracy >= 0.999 ? '🏆' : r.accuracy >= 0.7 ? '🎉' : '💪'}</div>
      <h2>{title}</h2>
      <div className="result-stats">
        <div className="result-stat" style={{ borderColor: 'var(--gold)' }}><div className="h" style={{ background: 'var(--gold)' }}>Total XP</div><div className="v" style={{ color: 'var(--gold-d)' }}>⚡ {xp}</div></div>
        <div className="result-stat" style={{ borderColor: 'var(--green)' }}><div className="h" style={{ background: 'var(--green)' }}>Accuracy</div><div className="v" style={{ color: 'var(--green-d)' }}>🎯 {Math.round(r.accuracy * 100)}%</div></div>
        <div className="result-stat" style={{ borderColor: 'var(--blue)' }}><div className="h" style={{ background: 'var(--blue)' }}>Time</div><div className="v" style={{ color: 'var(--blue-d)' }}>⏱ {mm}:{ss}</div></div>
      </div>
      <div className="muted">🔥 {streak}-day streak</div>
      <button className="btn" onClick={onDone}>Continue</button>
    </div>
  );
}

export default function LessonPage() {
  const params = useParams();
  const ref = `${params.subject}/${params.lesson}` as LessonRef;
  const [search] = useSearchParams();
  const peek = search.get('peek') === '1';
  const nav = useNavigate();
  const loc = findLesson(ref);
  const [content, setContent] = useState<LessonContent | null | undefined>(undefined);
  const [result, setResult] = useState<{ r: LessonResult; xp: number } | null>(null);
  const [mode, setMode] = useState<'read' | 'play'>(peek ? 'read' : 'play');
  const completeLesson = useProgress((s) => s.completeLesson);
  // Read once on mount: the player owns the position after that, so later saves must not remount it.
  const [start] = useState(() => useProgress.getState().resume[ref]);
  const [restarted, setRestarted] = useState(false);
  useEffect(() => { useProgress.getState().refillHearts(); loadLesson(ref).then((c) => setContent(c ?? null)); }, [ref]);

  const back = () => (window.history.length > 1 ? nav(-1) : nav(`/subject/${params.subject}`));

  if (!loc) return <div className="results"><h2>Lesson not found</h2><button className="btn" onClick={() => nav('/')}>Home</button></div>;
  if (content === undefined) return <div className="results"><div className="big">⏳</div></div>;
  if (content === null) {
    return (
      <div className="results">
        <div className="big">🔒</div><h2>{loc.lesson.title}</h2><p>{loc.lesson.summary}</p>
        <p className="muted">This lesson is on the map but not written yet. Unit sources:</p>
        <div style={{ textAlign: 'left', width: '100%' }}><RefList refs={loc.unit.references} /></div>
        <button className="btn" onClick={back}>Back</button>
      </div>
    );
  }

  if (result) {
    return <Results r={result.r} xp={result.xp} title="Lesson complete!" onDone={() => nav(`/subject/${loc.subject.id}`, { replace: true })} />;
  }

  if (mode === 'read') {
    const teach = content.cards.filter((c) => !EXERCISE_KINDS.includes(c.kind));
    return (
      <div className="lesson" style={{ ['--accent' as any]: loc.subject.color }}>
        <div className="peek-head">
          <button className="icon-btn" onClick={back} aria-label="Back">←</button>
          <div className="grow"><div className="muted" style={{ fontSize: 12, fontWeight: 700 }}>{loc.subject.name} · {loc.unit.title}</div><strong>{loc.lesson.title}</strong></div>
        </div>
        <div className="lesson-body">
          {teach.map((c, i) => <div key={i} className="peek-card"><TeachCard card={c as any} /></div>)}
          <h4>Sources</h4>
          <RefList refs={content.references} />
          <button className="btn" onClick={() => setMode('play')}>Take the full lesson</button>
        </div>
      </div>
    );
  }

  const items = content.cards.map((card, i) => ({ card, key: EXERCISE_KINDS.includes(card.kind) ? `${ref}#${i}` : undefined }));
  items.push({
    card: { kind: 'explain', title: '📚 Sources & further reading', body: refsToRich(content.references) },
    key: undefined,
  });
  const resumeAt = restarted ? 0 : Math.min(start?.idx ?? 0, items.length - 1);
  const { saveResume, clearResume, addPracticeXp } = useProgress.getState();
  return (
    <div style={{ ['--accent' as any]: loc.subject.color }}>
      {resumeAt > 0 && (
        <div className="resume-note">
          Picking up where you left off, card {resumeAt + 1}.
          <button onClick={() => { clearResume(ref); setRestarted(true); }}>Start over</button>
        </div>
      )}
      <LessonPlayer
        key={restarted ? 'restart' : 'resume'}
        items={items}
        startIdx={resumeAt}
        startAwarded={restarted ? 0 : start?.awarded ?? 0}
        onProgress={(i, total, awarded) => saveResume(ref, i, total, awarded)}
        onCheckpoint={(xp) => addPracticeXp(xp)}
        onExit={back}
        onFinish={(r, awarded) => {
          const total = 10 + Math.round(r.accuracy * 5) + (r.accuracy >= 0.999 ? 5 : 0);
          // Checkpoints already paid out part of the lesson's XP.
          const xp = Math.max(0, total - awarded * CHECKPOINT_XP);
          completeLesson(ref, r.accuracy, xp);
          reportActivity(liveStreak(useProgress.getState()));
          setResult({ r, xp: total });
        }}
      />
    </div>
  );
}

/** Render references as a Rich numbered list so they can sit inside the lesson flow. */
export function refsToRich(refs: LessonContent['references']) {
  const esc = (t: string) => t.replace(/[*`$[\]]/g, '');
  const lines = refs.map((r, i) => {
    const title = r.url ? `[${esc(r.title)}](${r.url})` : `**${esc(r.title)}**`;
    return `${i + 1}. ${title} — ${esc(r.authors)}${r.venue ? `, ${esc(r.venue)}` : ''}${r.year ? ` (${r.year})` : ''}${r.detail ? `. ${esc(r.detail)}` : ''}`;
  });
  return `This lesson draws on the resources below — great next reads.\n\n${lines.join('\n')}`;
}
