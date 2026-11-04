import { useRef, useState } from 'react';
import { Btn, C, Controls, PlayPause, Slider, Stage, pathOf, scale, useFrame } from './_kit';

/**
 * Positional encodings, two views.
 * 'sinusoidal': heatmap of PE(p, 2i) = sin(p ω_i), PE(p, 2i+1) = cos(p ω_i), ω_i = base^(−2i/d), with positions
 *   along x and dimensions along y (blue > 0, red < 0). Two highlighted columns p and p+k; below, the
 *   normalized dot product PE(p)·PE(p+k)/(d/2) = (2/d) Σ_i cos(k ω_i) against the offset k — it depends on k only.
 * 'rope': rotary embeddings. Three "clocks" show 2-D pairs i (frequencies θ_i = base^(−2i/d)): the query pair
 *   (blue) is rotated by m θ_i, the key pair (orange) by n θ_i. The score Σ_i ⟨R(mθ_i)q_i, R(nθ_i)k_i⟩ only
 *   depends on n − m; "Play" moves m and n together and the score stays constant. Each pair of q (k) is the
 *   same unit vector at angle 20° (70°); the bottom curve is the normalized score against n − m.
 * props: {
 *   mode?: 'sinusoidal'|'rope'   (default 'sinusoidal')
 *   showModeToggle?: boolean      (default true)
 *   dModel?: number               d, even (default 32)
 *   positions?: number            number of positions in the heatmap (default 48)
 *   base?: number                 (default 10000)
 * }
 */
type Mode = 'sinusoidal' | 'rope';

export default function MlPositionalEncoding({ mode = 'sinusoidal', showModeToggle = true, dModel = 32, positions = 48, base = 10000 }: {
  mode?: Mode; showModeToggle?: boolean; dModel?: number; positions?: number; base?: number;
}) {
  const d = Math.max(4, Math.min(64, Math.round(dModel / 2) * 2));
  const P = Math.max(8, Math.min(96, Math.round(positions)));
  const om = Array.from({ length: d / 2 }, (_, i) => Math.pow(base, (-2 * i) / d));
  const [md, setMd] = useState<Mode>(mode);
  const [p, setPos] = useState(5);
  const [k, setK] = useState(8);
  const [m, setM] = useState(2);
  const [nn, setN] = useState(6);
  const [run, setRun] = useState(false);
  const acc = useRef(0);
  useFrame((dt) => {
    acc.current += dt * 2;
    if (acc.current < 1) return;
    acc.current -= 1;
    if (Math.max(m, nn) >= 40) { const lo = Math.min(m, nn); setM(m - lo); setN(nn - lo); } else { setM(m + 1); setN(nn + 1); }
  }, run && md === 'rope');
  const sim = (off: number) => om.reduce((s, w) => s + Math.cos(off * w), 0) / (d / 2);

  if (md === 'sinusoidal') {
    const hx: [number, number] = [30, 312], hy: [number, number] = [14, 104];
    const cw = (hx[1] - hx[0]) / P, ch = (hy[1] - hy[0]) / d;
    const cells = [];
    for (let pos = 0; pos < P; pos++) for (let j = 0; j < d; j++) {
      const w = om[j >> 1]; const v = j % 2 === 0 ? Math.sin(pos * w) : Math.cos(pos * w);
      cells.push(<rect key={pos * d + j} x={hx[0] + pos * cw} y={hy[0] + j * ch} width={cw + 0.2} height={ch + 0.2} fill={v >= 0 ? C[1] : C[4]} opacity={Math.abs(v)} />);
    }
    const kk = Math.max(-Math.min(p, P / 2), Math.min(k, P - 1 - p, P / 2));
    const q = p + kk;
    const kx = scale([-P / 2, P / 2], [30, 312]), ky = scale([-0.4, 1], [192, 124]);
    const curve: [number, number][] = [];
    for (let o = -P / 2; o <= P / 2; o += 0.25) curve.push([kx(o), ky(sim(o))]);
    return (
      <div>
        <Stage w={320} h={202} label="Sinusoidal positional encoding heatmap">
          <text x={30} y={10} fontSize="8" fill="var(--muted)">position p →  (rows: dimension 0 … {d - 1}, fast → slow)</text>
          {cells}
          {[p, q].map((c, i) => c < P && <rect key={i} x={hx[0] + c * cw} y={hy[0] - 1} width={cw} height={hy[1] - hy[0] + 2} fill="none" stroke={i ? C[2] : 'var(--fg)'} strokeWidth={1.5} />)}
          <text x={4} y={hy[0] + 6} fontSize="7" fill="var(--muted)">dim 0</text>
          <text x={4} y={hy[1]} fontSize="7" fill="var(--muted)">{d - 1}</text>
          <text x={30} y={118} fontSize="8.5" fill="var(--fg)">PE(p)·PE(p+k) / (d/2) = {sim(kk).toFixed(3)} — same for every p</text>
          <line x1={30} x2={312} y1={ky(0)} y2={ky(0)} stroke="var(--fg)" strokeWidth={0.6} />
          <line x1={kx(0)} x2={kx(0)} y1={124} y2={192} stroke="var(--grid)" strokeWidth={0.6} />
          <path d={pathOf(curve)} fill="none" stroke={C[3]} strokeWidth={1.6} />
          <circle cx={kx(kk)} cy={ky(sim(kk))} r={3.5} fill={C[2]} />
          <text x={312} y={200} fontSize="7.5" textAnchor="end" fill="var(--muted)">offset k → (±{P / 2})</text>
        </Stage>
        <Controls>
          {showModeToggle && <><Btn active onClick={() => setMd('sinusoidal')}>sinusoidal</Btn><Btn onClick={() => setMd('rope')}>RoPE</Btn></>}
          <Slider label="position p" min={0} max={P - 1} step={1} value={p} onChange={(v) => setPos(Math.round(v))} format={(v) => String(Math.round(v))} />
          <Slider label="offset k" min={-Math.min(p, P / 2)} max={Math.min(P - 1 - p, P / 2)} step={1} value={kk} onChange={(v) => setK(Math.round(v))} format={(v) => String(Math.round(v))} />
        </Controls>
      </div>
    );
  }

  // RoPE view
  const show = [0, Math.min(d / 2 - 1, Math.round(d / 8)), Math.min(d / 2 - 1, Math.round(d / 4))];
  const qa = (20 * Math.PI) / 180, ka = (70 * Math.PI) / 180, R = 34;
  const score = om.reduce((s, w) => s + Math.cos(ka + nn * w - (qa + m * w)), 0) / (d / 2);
  const rel = (o: number) => om.reduce((s, w) => s + Math.cos(ka - qa + o * w), 0) / (d / 2);
  const kx = scale([-40, 40], [30, 312]), ky = scale([-1, 1], [196, 142]);
  const curve: [number, number][] = [];
  for (let o = -40; o <= 40; o += 0.25) curve.push([kx(o), ky(rel(o))]);
  const arrow = (cx: number, cy: number, ang: number, col: string) => (
    <g><line x1={cx} y1={cy} x2={cx + R * Math.cos(ang)} y2={cy - R * Math.sin(ang)} stroke={col} strokeWidth={2.2} />
      <circle cx={cx + R * Math.cos(ang)} cy={cy - R * Math.sin(ang)} r={3} fill={col} /></g>
  );
  return (
    <div>
      <Stage w={320} h={202} label="Rotary position embedding clocks">
        {show.map((i, c) => {
          const cx = 55 + c * 105, cy = 58, w = om[i];
          return (
            <g key={c}>
              <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--grid)" />
              {arrow(cx, cy, qa + m * w, C[1])}{arrow(cx, cy, ka + nn * w, C[2])}
              <text x={cx} y={cy + R + 12} fontSize="8" textAnchor="middle" fill="var(--fg)">pair {i}: θ = {w >= 0.01 ? w.toPrecision(2) : w.toExponential(1)}</text>
            </g>
          );
        })}
        <text x={4} y={12} fontSize="8.5"><tspan fill={C[1]}>q at m = {m}</tspan><tspan fill={C[2]}>   k at n = {nn}</tspan><tspan fill="var(--fg)">   n − m = {nn - m}</tspan></text>
        <text x={4} y={124} fontSize="8.5" fill="var(--fg)">score q·k / (d/2) = {score.toFixed(3)}  (depends only on n − m)</text>
        <line x1={30} x2={312} y1={ky(0)} y2={ky(0)} stroke="var(--fg)" strokeWidth={0.6} />
        <line x1={kx(0)} x2={kx(0)} y1={142} y2={196} stroke="var(--grid)" strokeWidth={0.6} />
        <path d={pathOf(curve)} fill="none" stroke={C[3]} strokeWidth={1.6} />
        {Math.abs(nn - m) <= 40 && <circle cx={kx(nn - m)} cy={ky(score)} r={3.5} fill={C[2]} />}
        <text x={312} y={138} fontSize="7.5" textAnchor="end" fill="var(--muted)">score vs n − m (±40)</text>
      </Stage>
      <Controls>
        {showModeToggle && <><Btn onClick={() => setMd('sinusoidal')}>sinusoidal</Btn><Btn active onClick={() => setMd('rope')}>RoPE</Btn></>}
        <Slider label="query pos m" min={0} max={40} step={1} value={m} onChange={(v) => setM(Math.round(v))} format={(v) => String(Math.round(v))} />
        <Slider label="key pos n" min={0} max={40} step={1} value={nn} onChange={(v) => setN(Math.round(v))} format={(v) => String(Math.round(v))} />
        <Btn onClick={() => { const s = Math.min(5, 40 - Math.max(m, nn)); setM(m + s); setN(nn + s); }}>shift both +5</Btn>
        <PlayPause running={run} set={setRun} />
      </Controls>
    </div>
  );
}
