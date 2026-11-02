import { useState } from 'react';
import { subjects } from '../content/registry';
import { TopBar } from '../components/Chrome';
import { RefList } from '../components/References';

export default function ReferencesPage() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <TopBar title="Sources" />
      <main className="page">
        <p className="muted">Every unit is built from established textbooks, open courses and primary research papers. Each lesson also lists its own sources on its final card.</p>
        {subjects.map((s) => (
          <div key={s.id} className="card" style={{ marginBottom: 12 }}>
            <button className="row" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', padding: 0, textAlign: 'left' }} onClick={() => setOpen(open === s.id ? null : s.id)}>
              <span style={{ fontSize: 22 }}>{s.emoji}</span><b className="grow">{s.name}</b><span className="muted">{open === s.id ? '▲' : '▼'}</span>
            </button>
            {open === s.id && s.units.map((u) => (
              <div key={u.id} style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 800 }}>{u.title}</div>
                <RefList refs={u.references} />
              </div>
            ))}
          </div>
        ))}
      </main>
    </>
  );
}
