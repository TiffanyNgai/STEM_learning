import { useRef, useState } from 'react';
import { subjects } from '../content/registry';
import { disablePush, enablePush, isStandalone, pushConfigured } from '../lib/push';
import { dayKey, liveStreak, useProgress } from '../store/progress';
import { TopBar } from '../components/Chrome';

function Week() {
  const xpByDay = useProgress((s) => s.xpByDay);
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d; });
  const max = Math.max(10, ...days.map((d) => xpByDay[dayKey(d)] ?? 0));
  return (
    <svg viewBox="0 0 320 110" style={{ width: '100%' }} role="img" aria-label="XP over the last 7 days">
      {days.map((d, i) => {
        const v = xpByDay[dayKey(d)] ?? 0; const h = (v / max) * 70; const x = 14 + i * 44;
        return (
          <g key={i}>
            <rect x={x} y={84 - h} width={28} height={Math.max(2, h)} rx={6} fill={i === 6 ? 'var(--gold)' : 'var(--blue)'} />
            <text x={x + 14} y={98} textAnchor="middle" fontSize="10" fill="var(--muted)">{d.toLocaleDateString(undefined, { weekday: 'narrow' })}</text>
            {v > 0 && <text x={x + 14} y={80 - h} textAnchor="middle" fontSize="9" fill="var(--fg)">{v}</text>}
          </g>
        );
      })}
    </svg>
  );
}

export default function Profile() {
  const s = useProgress();
  const [msg, setMsg] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const done = Object.keys(s.lessons).length;
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ state: useProgress.getState(), exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `aha-progress-${dayKey()}.json`; a.click();
  };
  const togglePush = async (on: boolean) => {
    if (!on) { await disablePush(); s.updateSettings({ pushEnabled: false }); setMsg('Reminders turned off.'); return; }
    const r = await enablePush(s.settings.reminderHour);
    s.updateSettings({ pushEnabled: r.ok });
    setMsg(r.ok ? `Daily reminder set for ${s.settings.reminderHour}:00.` : r.reason ?? 'Could not enable.');
  };
  return (
    <>
      <TopBar title="Profile" />
      <main className="page">
        <div className="subject-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
          {[['🔥', liveStreak(s), 'Day streak'], ['⚡', s.xp, 'Total XP'], ['👑', done, 'Lessons done'], ['🏅', s.bestStreak, 'Best streak']].map(([ic, v, l]) => (
            <div key={l as string} className="card"><div style={{ fontSize: 22, fontWeight: 800 }}>{ic} {v}</div><div className="muted" style={{ fontSize: 13 }}>{l}</div></div>
          ))}
        </div>
        <div className="card" style={{ marginTop: 12 }}><b>This week</b><Week /><div className="muted" style={{ fontSize: 13 }}>🧊 Streak freezes: {s.freezes} (earn one every 7-day streak)</div></div>

        <h3 style={{ marginTop: 20 }}>Settings</h3>
        <div className="list-item"><div className="grow">Daily goal</div>
          <select value={s.settings.dailyGoal} onChange={(e) => s.updateSettings({ dailyGoal: +e.target.value })}>
            {[[15, 'Casual'], [30, 'Regular'], [50, 'Serious'], [80, 'Intense']].map(([v, l]) => <option key={v} value={v}>{l} · {v} XP</option>)}
          </select></div>
        <div className="list-item"><div className="grow">Hearts (lose one per mistake)</div><input type="checkbox" className="toggle" checked={s.settings.heartsEnabled} onChange={(e) => s.updateSettings({ heartsEnabled: e.target.checked })} /></div>
        <div className="list-item"><div className="grow">Sound effects</div><input type="checkbox" className="toggle" checked={s.settings.sound} onChange={(e) => s.updateSettings({ sound: e.target.checked })} /></div>
        <div className="list-item"><div className="grow">Theme</div>
          <select value={s.settings.theme} onChange={(e) => s.updateSettings({ theme: e.target.value as any })}>
            <option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option>
          </select></div>
        <div className="list-item"><div className="grow">Reminder time</div>
          <select value={s.settings.reminderHour} onChange={(e) => { s.updateSettings({ reminderHour: +e.target.value }); if (s.settings.pushEnabled) enablePush(+e.target.value); }}>
            {Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>)}
          </select></div>
        <div className="list-item"><div className="grow">Streak reminders (push)<div className="muted" style={{ fontSize: 12 }}>{pushConfigured() ? (isStandalone() ? 'Sent once a day if you haven’t practised.' : 'Install to Home Screen first on iPhone.') : 'Push server not configured in this build.'}</div></div>
          <input type="checkbox" className="toggle" checked={s.settings.pushEnabled} onChange={(e) => togglePush(e.target.checked)} /></div>
        {msg && <div className="banner" style={{ marginTop: 10 }}>{msg}</div>}

        <h3 style={{ marginTop: 20 }}>Your data</h3>
        <p className="muted" style={{ fontSize: 14 }}>Progress is stored only on this device. Export a backup to move it to another phone.</p>
        <div className="row"><button className="btn small blue" onClick={exportData}>⬇ Export</button>
          <button className="btn small secondary" onClick={() => file.current?.click()}>⬆ Import</button>
          <button className="btn small danger" onClick={() => { if (confirm('Reset all progress on this device?')) s.reset(); }}>Reset</button></div>
        <input ref={file} type="file" accept="application/json" hidden onChange={async (e) => {
          const f = e.target.files?.[0]; if (!f) return; setMsg(s.importState(await f.text()) ? 'Progress imported.' : 'That file is not an AHA! backup.');
        }} />
        <p className="muted" style={{ fontSize: 12, marginTop: 24 }}>{subjects.length} subjects · Medical content is study material, not medical advice.</p>
      </main>
    </>
  );
}
