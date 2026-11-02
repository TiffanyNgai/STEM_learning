import { Link } from 'react-router-dom';
import { isReady, subjects } from '../content/registry';
import type { LessonRef, Subject } from '../content/types';
import { isIOS, isStandalone } from '../lib/push';
import { todayXp, useProgress } from '../store/progress';
import { TopBar } from '../components/Chrome';

export function subjectStats(s: Subject, lessons: Record<string, unknown>) {
  const all = s.units.flatMap((u) => u.lessons.map((l) => `${s.id}/${l.id}` as LessonRef));
  const ready = all.filter(isReady);
  const done = all.filter((r) => lessons[r]);
  return { total: all.length, ready: ready.length, done: done.length, next: ready.find((r) => !lessons[r]) };
}

export default function Home() {
  const s = useProgress();
  const xpToday = todayXp(s);
  const pct = Math.min(100, Math.round((xpToday / s.settings.dailyGoal) * 100));
  const showInstall = !isStandalone() && !s.seenInstallTip;
  return (
    <>
      <TopBar title="aha" />
      <main className="page">
        <div className="card goal-card">
          <div className="ring" style={{ ['--p' as any]: pct }}><span>{pct}%</span></div>
          <div className="grow">
            <div style={{ fontWeight: 800 }}>{pct >= 100 ? 'Daily goal complete! 🎉' : 'Daily goal'}</div>
            <div className="muted" style={{ fontSize: 14 }}>{xpToday} / {s.settings.dailyGoal} XP today</div>
          </div>
        </div>
        {showInstall && (
          <div className="banner" style={{ marginTop: 12 }}>
            <strong>📲 Install aha</strong><br />
            {isIOS()
              ? <>In Safari tap <b>Share</b> → <b>Add to Home Screen</b>. Open it from your home screen to enable streak reminders.</>
              : <>Use your browser menu → <b>Install app</b> / <b>Add to Home screen</b> for offline lessons and reminders.</>}
            <div style={{ marginTop: 8 }}><button className="btn small secondary" onClick={s.setSeenInstallTip}>Got it</button></div>
          </div>
        )}
        <h2 style={{ marginTop: 20 }}>Subjects</h2>
        <div className="subject-grid">
          {subjects.map((sub) => {
            const st = subjectStats(sub, s.lessons);
            return (
              <Link key={sub.id} to={`/subject/${sub.id}`} className="subject-tile">
                <div className="emoji" style={{ background: sub.color }}>{sub.emoji}</div>
                <div className="name">{sub.name}</div>
                <div className="meta">{sub.tagline}</div>
                <div className="grow" />
                <div className="bar" style={{ ['--accent' as any]: sub.color }}><i style={{ width: `${st.total ? (st.done / st.total) * 100 : 0}%` }} /></div>
                <div className="meta">{st.done}/{st.total} lessons · {st.ready} ready</div>
              </Link>
            );
          })}
        </div>
        {subjects.length === 0 && <p className="muted">No subjects loaded yet.</p>}
      </main>
    </>
  );
}
