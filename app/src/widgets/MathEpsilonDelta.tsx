import { useId, useState } from 'react';
import { Axes, Btn, Controls, Slider, Stage, compileExpr, pathOf, scale } from './_kit';

/**
 * The ε–δ game at a point a. A horizontal ε-band around the target value L and a vertical δ-window
 * around a. δ "works" if every x in the window (x ≠ a when punctured) has |f(x) − L| < ε; the part of the
 * graph inside the window turns green, offending pieces turn red. "Best δ" finds (numerically) the largest
 * δ that works; if even a tiny δ fails, the function is not continuous at a (or the limit is not L).
 * props: { fn?: string (f(x), default 'x^2'), a?: number (default 1), L?: number (default f(a)),
 *          x?: [number, number] (default [a−2, a+2]), y?: [number, number] (default auto),
 *          eps?: number (default 0.5), delta?: number (default 0.4), punctured?: boolean (ignore x = a; default false) }
 */
export default function MathEpsilonDelta({ fn = 'x^2', a = 1, L, x, y, eps = 0.5, delta = 0.4, punctured = false }: {
  fn?: string; a?: number; L?: number; x?: [number, number]; y?: [number, number]; eps?: number; delta?: number; punctured?: boolean;
}) {
  const uid = useId().replace(/:/g, '');
  const f = compileExpr(fn, ['x']);
  const xr: [number, number] = x ?? [a - 2, a + 2];
  const target = L ?? f(a);
  const [e, setE] = useState(eps);
  const [d, setD] = useState(delta);
  const samples: [number, number][] = [];
  for (let i = 0; i <= 400; i++) { const xv = xr[0] + ((xr[1] - xr[0]) * i) / 400; samples.push([xv, f(xv)]); }
  const fin = samples.map((s) => s[1]).filter(Number.isFinite);
  const yr: [number, number] = y ?? [Math.min(...fin) - 0.3, Math.max(...fin) + 0.3];
  const box: [number, number, number, number] = [30, 10, 312, 166];
  const sx = scale(xr, [box[0], box[2]]), sy = scale(yr, [box[3], box[1]]);
  const works = (dd: number) => {
    for (let i = -300; i <= 300; i++) {
      const xv = a + (dd * i) / 300.5; // never hits ±dd exactly (open window)
      if (punctured && i === 0) continue;
      const v = i === 0 ? f(a) : f(xv);
      if (!(Math.abs(v - target) < e)) return false;
    }
    return true;
  };
  const ok = works(d);
  const best = () => {
    if (!works(1e-4)) { setD(1e-4); return; }
    let lo = 1e-4, hi = (xr[1] - xr[0]) / 2;
    if (works(hi)) { setD(hi); return; }
    for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (works(m)) lo = m; else hi = m; }
    setD(lo);
  };
  const noDelta = !works(1e-4);
  // split graph into runs by colour: in-window good / in-window bad / outside
  const segs: { pts: [number, number][]; col: string }[] = [];
  let prevBreak = false;
  samples.forEach(([xv, v], i) => {
    if (!Number.isFinite(v)) { prevBreak = true; return; }
    const inWin = Math.abs(xv - a) < d && !(punctured && Math.abs(xv - a) < 1e-12);
    const col = !inWin ? 'var(--fg)' : Math.abs(v - target) < e ? 'var(--c1)' : 'var(--c5)';
    const jump = i > 0 && Math.abs(v - samples[i - 1][1]) > (yr[1] - yr[0]) * 0.25;
    const cur = segs[segs.length - 1];
    if (!cur || cur.col !== col || prevBreak || jump) segs.push({ pts: cur && !prevBreak && !jump ? [cur.pts[cur.pts.length - 1]] : [], col });
    segs[segs.length - 1].pts.push([sx(xv), sy(v)]);
    prevBreak = false;
  });
  const fa = f(a);
  const status = noDelta ? `No δ > 0 works for this ε — ${punctured ? 'the limit is not L' : 'f is not continuous at a'}.`
    : ok ? `δ = ${d.toFixed(3)} works ✓  (every x within δ of a lands in the band)` : `δ = ${d.toFixed(3)} fails ✗ — shrink δ, or press Best δ.`;
  return (
    <div>
      <Stage w={320} h={196} label="Epsilon-delta window">
        <defs><clipPath id={'ed' + uid}><rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} /></clipPath></defs>
        <Axes x={xr} y={yr} box={box} grid={false} />
        <g clipPath={`url(#ed${uid})`}>
          <rect x={box[0]} width={box[2] - box[0]} y={sy(target + e)} height={sy(target - e) - sy(target + e)} fill="var(--c2)" fillOpacity={0.14} />
          <rect y={box[1]} height={box[3] - box[1]} x={sx(a - d)} width={sx(a + d) - sx(a - d)} fill="var(--c3)" fillOpacity={0.13} />
          <line x1={sx(a - d)} x2={sx(a - d)} y1={box[1]} y2={box[3]} stroke="var(--c3)" strokeDasharray="4 3" />
          <line x1={sx(a + d)} x2={sx(a + d)} y1={box[1]} y2={box[3]} stroke="var(--c3)" strokeDasharray="4 3" />
          <line x1={box[0]} x2={box[2]} y1={sy(target)} y2={sy(target)} stroke="var(--c2)" strokeWidth={0.8} />
          {segs.map((s, i) => s.pts.length > 1 && <path key={i} d={pathOf(s.pts)} fill="none" stroke={s.col} strokeWidth={s.col === 'var(--fg)' ? 1.4 : 2.6} />)}
          {Number.isFinite(fa) && !punctured && <circle cx={sx(a)} cy={sy(fa)} r={3} fill="var(--fg)" />}
          {punctured && <circle cx={sx(a)} cy={sy(target)} r={3} fill="var(--surface)" stroke="var(--fg)" />}
        </g>
        <text x={sx(a)} y={box[3] + 9} fontSize="9" textAnchor="middle" style={{ fill: 'var(--c3)' }} fontWeight="bold">a</text>
        <text x={box[2] - 2} y={sy(target + e) - 2} fontSize="9" textAnchor="end" style={{ fill: 'var(--c2)' }}>L ± ε</text>
        <text x={6} y={190} fontSize="9.5" style={{ fill: noDelta || !ok ? 'var(--c5)' : 'var(--c1)' }}>{status}</text>
      </Stage>
      <Controls>
        <Slider label="ε" value={e} min={0.02} max={1.5} step={0.01} onChange={setE} />
        <Slider label="δ" value={d} min={0.0001} max={(xr[1] - xr[0]) / 2} step={0.001} onChange={setD} format={(v) => v.toFixed(3)} />
        <Btn onClick={best}>Best δ</Btn>
      </Controls>
    </div>
  );
}
