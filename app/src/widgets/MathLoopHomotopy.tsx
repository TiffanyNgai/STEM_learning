import { useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, prefersReducedMotion, useFrame } from './_kit';

/**
 * Loops in a disc versus an annulus (a disc with a hole). Pick a winding number n and a wobble; press
 * play to run a homotopy (a continuous deformation of the loop, keeping the basepoint fixed).
 * Phase 1 straightens the loop to the standard loop that winds n times. Phase 2 tries to shrink it to the
 * basepoint. In the disc it always succeeds (the disc is simply connected). In the annulus it succeeds only
 * when n = 0; otherwise the loop gets caught on the hole. The live winding number about the centre is shown.
 * props: { space?: 'disc' | 'annulus' (default 'annulus'), n?: number (−2…2, default 1),
 *          wobble?: number (0–1, default 0.6), animate?: boolean (default true) }
 */
type P = [number, number];
const R0 = 1.45, RIN = 0.55, ROUT = 2.2;

export default function MathLoopHomotopy({ space = 'annulus', n = 1, wobble = 0.6, animate = true }: {
  space?: 'disc' | 'annulus'; n?: number; wobble?: number; animate?: boolean;
}) {
  const [sp, setSp] = useState(space);
  const [k, setK] = useState(Math.max(-2, Math.min(2, Math.round(n))));
  const [w, setW] = useState(wobble);
  const [t, setT] = useState(0); // 0..2
  const [run, setRun] = useState(animate && !prefersReducedMotion());
  const hole = sp === 'annulus';
  // phase-2 limit: in the annulus with k ≠ 0 the shrinking circle stops at the hole
  const stuck = hole && k !== 0;
  useFrame((dt) => setT((x) => (x >= 2.8 ? 0 : x + dt * 0.4)), run);
  const t1 = Math.min(1, t), t2 = Math.max(0, Math.min(1, t - 1));

  // original loop in polar coordinates, basepoint at angle 0, radius R0
  const th0 = (s: number) => 2 * Math.PI * k * s + (k === 0 ? 1.1 + 0.9 * w : 0.5 * w) * Math.sin(2 * Math.PI * s) * (k === 0 ? 1 : Math.sin(2 * Math.PI * s * 2) + 0.3);
  const r0 = (s: number) => R0 + 0.55 * w * Math.sin(2 * Math.PI * s * (k === 0 ? 1 : 3));
  const pt = (s: number): P => {
    // phase 1: straighten in polar coordinates (stays inside the annulus)
    const th = (1 - t1) * th0(s) + t1 * 2 * Math.PI * k * s;
    const r = (1 - t1) * r0(s) + t1 * R0;
    let x = r * Math.cos(th), y = r * Math.sin(th);
    if (t2 > 0) {
      if (k === 0) { // contract along the arc back to the basepoint
        const th2 = (1 - t2) * th; x = r * Math.cos(th2); y = r * Math.sin(th2);
      } else if (!hole) { // straight-line homotopy to the basepoint
        x = (1 - t2) * x + t2 * R0; y = (1 - t2) * y;
      } else { // try the same straight-line homotopy, but stop at the hole
        const lim = (u: number) => { const X = (1 - u) * x + u * R0, Y = (1 - u) * y; return Math.hypot(X, Y) >= RIN + 0.04; };
        let u = 0; while (u + 0.01 <= t2 && lim(u + 0.01)) u += 0.01; // stop at the first contact with the hole
        x = (1 - Math.max(0, u)) * x + Math.max(0, u) * R0; y = (1 - Math.max(0, u)) * y;
      }
    }
    return [x, y];
  };
  const N = 400;
  const pts = Array.from({ length: N + 1 }, (_, i) => pt(i / N));
  let wind = 0;
  for (let i = 1; i <= N; i++) {
    let d = Math.atan2(pts[i][1], pts[i][0]) - Math.atan2(pts[i - 1][1], pts[i - 1][0]);
    if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; wind += d;
  }
  const wn = Math.round(wind / (2 * Math.PI));
  const cx = 105, cy = 100, sc = 40;
  const S = ([x, y]: P) => `${(cx + sc * x).toFixed(1)},${(cy - sc * y).toFixed(1)}`;
  const size = pts.reduce((m, p) => Math.max(m, Math.hypot(p[0] - R0, p[1])), 0);
  const status = t < 1 ? 'deforming…' : t2 < 0.95 ? (stuck ? 'caught on the hole!' : 'shrinking…') : stuck ? 'stuck: cannot shrink' : 'shrunk to the point';
  const arrow = (s: number) => { const a = pts[Math.floor(s * N)], b = pts[Math.floor(s * N) + 2]; return [a, (Math.atan2(-(b[1] - a[1]), b[0] - a[0]) * 180) / Math.PI] as const; };
  return (
    <div>
      <Stage w={320} h={200} label={`A loop in the ${sp} being deformed`}>
        <circle cx={cx} cy={cy} r={ROUT * sc} fill="var(--c6)" fillOpacity={0.12} stroke="var(--c6)" />
        {hole && <circle cx={cx} cy={cy} r={RIN * sc} fill="var(--surface)" stroke="var(--c6)" strokeDasharray="3 2" />}
        {hole && <text x={cx} y={cy + 4} textAnchor="middle" fontSize="9" fill="var(--muted)">hole</text>}
        {!hole && <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fill="var(--muted)">+</text>}
        <polyline points={pts.map(S).join(' ')} fill="none" stroke={stuck && t2 > 0.3 ? 'var(--c5)' : 'var(--c2)'} strokeWidth={2.2} />
        {size > 0.15 && [0.2, 0.55, 0.85].map((s) => { const [a, deg] = arrow(s); return <path key={s} d="M-4,-3L4,0L-4,3z" fill="var(--c2)" transform={`translate(${S(a)}) rotate(${deg})`} />; })}
        <circle cx={cx + sc * R0} cy={cy} r={4} fill="var(--c3)" />
        <text x={cx + sc * R0} y={cy + 18} textAnchor="middle" fontSize="9" fill="var(--c3)">basepoint</text>
        <g fontSize="10" fill="var(--fg)">
          <text x={208} y={30} fontWeight="bold">{hole ? 'annulus' : 'disc'}</text>
          <text x={208} y={50}>chosen n = {k}</text>
          <text x={208} y={68}>winding now: {wn}</text>
          <text x={208} y={92} fontSize="9" fill="var(--muted)">{status}</text>
          <text x={208} y={130} fontSize="9" fill="var(--muted)">{hole ? 'π₁(annulus) ≅ ℤ:' : 'π₁(disc) = 0:'}</text>
          <text x={208} y={142} fontSize="9" fill="var(--muted)">{hole ? 'the winding number' : 'every loop shrinks'}</text>
          <text x={208} y={154} fontSize="9" fill="var(--muted)">{hole ? 'never changes during' : 'to a point'}</text>
          <text x={208} y={166} fontSize="9" fill="var(--muted)">{hole ? 'a deformation' : ''}</text>
        </g>
      </Stage>
      <Controls>
        <PlayPause running={run} set={setRun} />
        <Btn active={!hole} onClick={() => { setSp('disc'); setT(0); }}>disc</Btn>
        <Btn active={hole} onClick={() => { setSp('annulus'); setT(0); }}>annulus</Btn>
        {[-2, -1, 0, 1, 2].map((m) => <Btn key={m} active={k === m} onClick={() => { setK(m); setT(0); }}>n = {m}</Btn>)}
        <Slider label="time" min={0} max={2} step={0.01} value={Math.min(2, t)} onChange={(v) => { setRun(false); setT(v); }} />
        <Slider label="wobble" min={0} max={1} step={0.05} value={w} onChange={(v) => { setW(v); setT(0); }} />
      </Controls>
    </div>
  );
}
