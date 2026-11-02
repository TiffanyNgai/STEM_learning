import { useState } from 'react';
import { Btn, Controls } from './_kit';

/**
 * Step through a short program line by line, showing the current line, the variables and
 * any printed output — a "debugger" for code-tracing lessons.
 * props: { code?: string (multi-line source, e.g. Python), lang?: string (label only),
 *          trace?: { line: number (1-based), vars?: Record<string, string|number|boolean|null|unknown[]>,
 *                    out?: string (text printed at this step), note?: string }[] }
 * If trace is empty, the widget simply shows the code.
 */
interface Step { line: number; vars?: Record<string, unknown>; out?: string; note?: string }
const show = (v: unknown): string => (Array.isArray(v) ? `[${v.map(show).join(', ')}]` : typeof v === 'string' ? `'${v}'` : v === null ? 'None' : v === true ? 'True' : v === false ? 'False' : String(v));

export default function CodeTracer({ code = 'x = 1\nprint(x)', lang = 'python', trace = [] }: { code?: string; lang?: string; trace?: Step[] }) {
  const [k, setK] = useState(0);
  const lines = code.replace(/\n$/, '').split('\n');
  const st = trace[Math.min(k, trace.length - 1)];
  const output = trace.slice(0, k + 1).map((s) => s.out).filter((o): o is string => o !== undefined);
  const prev = k > 0 ? trace[k - 1]?.vars ?? {} : {};
  return (
    <div className="w-codetracer">
      <pre style={{ margin: 0, padding: '6px 0', overflowX: 'auto', fontSize: '0.82em', lineHeight: 1.5, background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--grid)' }}
        aria-label={`${lang} code`}>
        {lines.map((l, i) => {
          const cur = st && st.line === i + 1;
          return (
            <div key={i} style={{ display: 'flex', background: cur ? 'color-mix(in srgb, var(--c3) 25%, transparent)' : undefined, transition: 'background .2s' }}>
              <span style={{ width: '2.2em', textAlign: 'right', paddingRight: 8, color: 'var(--muted)', userSelect: 'none' }}>{cur ? '▶' : i + 1}</span>
              <code style={{ whiteSpace: 'pre', color: 'var(--fg)', background: 'none' }}>{l || ' '}</code>
            </div>
          );
        })}
      </pre>
      {st && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '6px 0', fontSize: '0.85em' }}>
            {Object.entries(st.vars ?? {}).map(([name, v]) => {
              const changed = show(v) !== show((prev as Record<string, unknown>)[name]);
              return (
                <span key={name} style={{ padding: '2px 6px', borderRadius: 6, border: '1px solid var(--grid)', background: changed && k > 0 ? 'color-mix(in srgb, var(--c1) 25%, transparent)' : 'var(--surface)' }}>
                  <code>{name}</code> = <code>{show(v)}</code>
                </span>
              );
            })}
          </div>
          {output.length > 0 && <pre style={{ margin: '4px 0', fontSize: '0.8em', color: 'var(--c2)' }}>{'>>> output\n' + output.join('\n')}</pre>}
          {st.note && <div className="w-muted" style={{ fontSize: '0.85em' }}>{st.note}</div>}
          <Controls>
            <Btn onClick={() => setK(0)}>⏮</Btn>
            <Btn onClick={() => setK((v) => Math.max(0, v - 1))}>◀</Btn>
            <span className="w-muted">step {k + 1} / {trace.length}</span>
            <Btn onClick={() => setK((v) => Math.min(trace.length - 1, v + 1))}>Next ▶</Btn>
          </Controls>
        </>
      )}
    </div>
  );
}
