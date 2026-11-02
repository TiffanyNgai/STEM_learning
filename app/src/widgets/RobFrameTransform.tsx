import { useState } from 'react';
import { Btn, C, Controls, Slider, Stage, prefersReducedMotion, useFrame } from './_kit';

/**
 * 2D coordinate frames: rotation, homogeneous transforms and composition (SE(2)).
 * props: { mode?: 'rotate' | 'transform' | 'compose' (default 'transform'),
 *          theta?: degrees (default 30), tx?: number, ty?: number (default 1.5, 0.8) — pose of frame {b} (or {a}) in {s},
 *          point?: [x, y] a point fixed in the moving frame, in that frame's coordinates (default [1, 0.5]),
 *          theta2?: degrees, tx2?: number, ty2?: number (compose mode: pose of {b} in {a}; default 60, 1.2, 0),
 *          showMatrix?: boolean (default true) }
 * x-axes red, y-axes green. 'Animate' replays the motion: first the rotation, then the translation
 * (compose mode: first T_sa, then T_ab expressed in the moved frame). In compose mode a toggle shows
 * the wrong product order as a dashed ghost frame.
 */
export default function RobFrameTransform({ mode = 'transform', theta = 30, tx = 1.5, ty = 0.8, point = [1, 0.5],
  theta2 = 60, tx2 = 1.2, ty2 = 0, showMatrix = true }: {
  mode?: 'rotate' | 'transform' | 'compose'; theta?: number; tx?: number; ty?: number; point?: [number, number];
  theta2?: number; tx2?: number; ty2?: number; showMatrix?: boolean;
}) {
  const [p, setP] = useState({ th: theta, x: mode === 'rotate' ? 0 : tx, y: mode === 'rotate' ? 0 : ty, th2: theta2, x2: tx2, y2: ty2 });
  const [anim, setAnim] = useState(1); // 0..1 progress (1 = final pose)
  const [running, setRunning] = useState(false);
  const [wrong, setWrong] = useState(false);
  useFrame((dt) => {
    setAnim((a) => { const n = a + dt / 3; if (n >= 1) { setRunning(false); return 1; } return n; });
  }, running);
  const play = () => { if (prefersReducedMotion()) { setAnim(1); return; } setAnim(0); setRunning(true); };

  const W = 320, H = 230;
  const sc = mode === 'compose' ? 48 : 50;
  const ox = mode === 'rotate' ? 140 : mode === 'compose' ? 36 : 50, oy = mode === 'rotate' ? 125 : mode === 'compose' ? 205 : 185;
  const X = (x: number) => ox + x * sc; const Y = (y: number) => oy - y * sc;
  const rad = (d: number) => (d * Math.PI) / 180;
  type T = [number, number, number]; // (theta rad, x, y) as an SE(2) element
  const mul = (a: T, b: T): T => [a[0] + b[0], a[1] + Math.cos(a[0]) * b[1] - Math.sin(a[0]) * b[2], a[2] + Math.sin(a[0]) * b[1] + Math.cos(a[0]) * b[2]];
  const apply = (a: T, v: [number, number]): [number, number] => [a[1] + Math.cos(a[0]) * v[0] - Math.sin(a[0]) * v[1], a[2] + Math.sin(a[0]) * v[0] + Math.cos(a[0]) * v[1]];
  // animation: segment 1 = rotation, segment 2 = translation (each half of the timeline, or quarters in compose)
  const seg = (a: number, lo: number, hi: number) => Math.max(0, Math.min(1, (a - lo) / (hi - lo)));
  const ease = (u: number) => u * u * (3 - 2 * u);
  const nseg = mode === 'compose' ? 4 : 2;
  const k = (i: number) => ease(seg(anim, i / nseg, (i + 1) / nseg));
  const T1: T = [rad(p.th) * k(0), p.x * k(1), p.y * k(1)];
  const T2: T = mode === 'compose' ? [rad(p.th2) * k(2), p.x2 * k(3), p.y2 * k(3)] : [0, 0, 0];
  const Tsb = mul(T1, T2);
  const Tfull1: T = [rad(p.th), p.x, p.y]; const Tfull2: T = [rad(p.th2), p.x2, p.y2];
  const Twrong = mul(Tfull2, Tfull1);
  const moving: T = mode === 'compose' ? Tsb : T1;
  const ps = apply(moving, point);

  const frame = (t: T, label: string, dashed = false, len = 0.8) => {
    const o = apply(t, [0, 0]), ex = apply(t, [len, 0]), ey = apply(t, [0, len]);
    const ax = (to: [number, number], col: string) => (
      <line x1={X(o[0])} y1={Y(o[1])} x2={X(to[0])} y2={Y(to[1])} stroke={col} strokeWidth={dashed ? 1.5 : 2.5}
        strokeDasharray={dashed ? '4 3' : undefined} />
    );
    return (
      <g key={label} opacity={dashed ? 0.6 : 1}>
        {ax(ex, C[4])}{ax(ey, C[0])}
        <circle cx={X(o[0])} cy={Y(o[1])} r={2.5} fill="var(--fg)" />
        <text x={X(o[0]) - 4} y={Y(o[1]) + 12} fontSize="10" textAnchor="end" fill="var(--fg)">{label}</text>
        <text x={X(ex[0]) + 2} y={Y(ex[1]) + 3} fontSize="8" fill={C[4]}>x</text>
        <text x={X(ey[0]) + 2} y={Y(ey[1])} fontSize="8" fill={C[0]}>y</text>
      </g>
    );
  };
  const f2 = (v: number) => (Math.abs(v) < 0.005 ? '0.00' : v.toFixed(2));
  const R = moving[0];
  const mat = mode === 'rotate'
    ? [`R = [ ${f2(Math.cos(R))}  ${f2(-Math.sin(R))} ]`, `      [ ${f2(Math.sin(R))}  ${f2(Math.cos(R))} ]`]
    : [`T = [ ${f2(Math.cos(R))}  ${f2(-Math.sin(R))}  ${f2(moving[1])} ]`, `      [ ${f2(Math.sin(R))}  ${f2(Math.cos(R))}  ${f2(moving[2])} ]`, '      [ 0.00  0.00  1.00 ]'];
  const grid = [];
  for (let i = -6; i <= 10; i++) {
    grid.push(<line key={'v' + i} x1={X(i)} x2={X(i)} y1={0} y2={H} stroke="var(--grid)" strokeWidth={0.5} />);
    grid.push(<line key={'h' + i} y1={Y(i)} y2={Y(i)} x1={0} x2={W} stroke="var(--grid)" strokeWidth={0.5} />);
  }
  const movingLabel = '{b}';

  return (
    <div>
      <Stage w={W} h={H} label="Coordinate frames and transforms">
        {grid}
        {frame([0, 0, 0], '{s}', false, 1)}
        {mode === 'compose' && frame(T1, '{a}')}
        {mode === 'compose' && wrong && frame(Twrong, 'wrong', true)}
        {frame(moving, movingLabel)}
        {/* point fixed in the moving frame */}
        <line x1={X(0)} y1={Y(0)} x2={X(ps[0])} y2={Y(ps[1])} stroke={C[2]} strokeDasharray="2 3" />
        <circle cx={X(ps[0])} cy={Y(ps[1])} r={4} fill={C[2]} />
        <text x={X(ps[0]) + 6} y={Y(ps[1]) - 4} fontSize="10" fill={C[2]}>p</text>
        <g fontSize="9" fill="var(--fg)">
          <text x={W - 6} y={14} textAnchor="end">p in {movingLabel}: ({f2(point[0])}, {f2(point[1])})</text>
          <text x={W - 6} y={26} textAnchor="end" fill={C[2]}>p in {'{s}'}: ({f2(ps[0])}, {f2(ps[1])})</text>
          {mode === 'compose' && <text x={W - 6} y={38} textAnchor="end">T_sb = T_sa · T_ab</text>}
          {mode === 'compose' && wrong && <text x={W - 6} y={50} textAnchor="end" fill="var(--muted)">dashed: T_ab · T_sa (wrong order)</text>}
          {showMatrix && mat.map((m, i) => <text key={i} x={6} y={14 + 12 * i} fontFamily="monospace" fontSize="8.5" style={{ whiteSpace: 'pre' }}>{m}</text>)}
        </g>
      </Stage>
      <Controls>
        <Slider label={mode === 'compose' ? 'θ_sa' : 'θ'} min={-180} max={180} step={1} value={p.th} onChange={(v) => { setAnim(1); setP((s) => ({ ...s, th: v })); }} format={(v) => v + '°'} />
        {mode !== 'rotate' && <Slider label={mode === 'compose' ? 'x_sa' : 'tₓ'} min={-1} max={3.5} step={0.05} value={p.x} onChange={(v) => { setAnim(1); setP((s) => ({ ...s, x: v })); }} />}
        {mode !== 'rotate' && <Slider label={mode === 'compose' ? 'y_sa' : 't_y'} min={-1} max={3} step={0.05} value={p.y} onChange={(v) => { setAnim(1); setP((s) => ({ ...s, y: v })); }} />}
        {mode === 'compose' && <Slider label="θ_ab" min={-180} max={180} step={1} value={p.th2} onChange={(v) => { setAnim(1); setP((s) => ({ ...s, th2: v })); }} format={(v) => v + '°'} />}
        {mode === 'compose' && <Slider label="x_ab" min={-1} max={2} step={0.05} value={p.x2} onChange={(v) => { setAnim(1); setP((s) => ({ ...s, x2: v })); }} />}
        <Btn onClick={play}>▶ Animate</Btn>
        {mode === 'compose' && <Btn active={wrong} onClick={() => setWrong(!wrong)}>Show wrong order</Btn>}
      </Controls>
    </div>
  );
}
