import { useState } from 'react';
import { Btn, C, Controls, PlayPause, Slider, Stage, pathOf, prefersReducedMotion, useFrame } from './_kit';

type Knob = 'a1' | 'a2' | 'lambda1' | 'lambda2' | 'phase' | 'speed';
/**
 * Two sinusoidal travelling waves y₁, y₂ on a string (all distances in metres) and their sum y₁ + y₂.
 *   y₁ = A₁ sin(k₁x − ω₁t),  y₂ = A₂ sin(k₂x ∓ ω₂t + φ),  k = 2π/λ,  ω = v k (same wave speed v for both).
 * Opposite directions with equal A and λ → standing wave (nodes marked). Equal directions, close λ → beats.
 * props: { a1?, a2? (default 1), lambda1?, lambda2? (default 4), dir2?: 1 | -1 (default -1 = leftward),
 *          phase?: rad (default 0), speed?: m/s (default 1), length?: m shown (default 12),
 *          controls?: Knob[] (default ['a2','lambda2','phase']), showParts?: boolean (default true) }
 */
export default function WaveSuperposition({ a1 = 1, a2 = 1, lambda1 = 4, lambda2 = 4, dir2 = -1, phase = 0, speed = 1, length = 12,
  controls = ['a2', 'lambda2', 'phase'], showParts = true }: {
  a1?: number; a2?: number; lambda1?: number; lambda2?: number; dir2?: 1 | -1; phase?: number; speed?: number; length?: number;
  controls?: Knob[]; showParts?: boolean;
}) {
  const [p, setP] = useState({ a1, a2, lambda1, lambda2, phase, speed });
  const [dir, setDir] = useState<1 | -1>(dir2);
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(!prefersReducedMotion());
  useFrame((dt) => setT((v) => v + dt), running);
  const k1 = (2 * Math.PI) / p.lambda1, k2 = (2 * Math.PI) / p.lambda2;
  const w1 = p.speed * k1, w2 = p.speed * k2;
  const y1 = (x: number) => p.a1 * Math.sin(k1 * x - w1 * t);
  const y2 = (x: number) => p.a2 * Math.sin(k2 * x - dir * w2 * t + p.phase);
  const ys = (x: number) => y1(x) + y2(x);
  const L = 14, R = 314, W = R - L;
  const px = (x: number) => L + (x / length) * W;
  const panels: { f: (x: number) => number; col: number; label: string; amp: number }[] = [];
  if (showParts) {
    panels.push({ f: y1, col: 1, label: 'y₁ →', amp: 2 });
    panels.push({ f: y2, col: 2, label: dir === 1 ? 'y₂ →' : '← y₂', amp: 2 });
  }
  panels.push({ f: ys, col: 3, label: 'y₁ + y₂', amp: 2.2 });
  const ph = showParts ? 46 : 120; const gap = 8;
  const H = panels.length * (ph + gap) + 6;
  const standing = dir === -1 && Math.abs(p.a1 - p.a2) < 0.02 && Math.abs(p.lambda1 - p.lambda2) < 0.02;
  const nodes: number[] = [];
  if (standing) {
    // sum = 2A sin(kx + φ/2) cos(ωt + φ/2): nodes where kx + φ/2 = nπ
    for (let n = -2; n < 40; n++) { const x = (n * Math.PI - p.phase / 2) / k1; if (x >= 0 && x <= length) nodes.push(x); }
  }
  const set = (key: Knob) => (v: number) => setP((q) => ({ ...q, [key]: v }));
  const meta: Record<Knob, [string, number, number, number]> = {
    a1: ['A₁ (m)', 0, 1.5, 0.05], a2: ['A₂ (m)', 0, 1.5, 0.05], lambda1: ['λ₁ (m)', 1, 8, 0.05], lambda2: ['λ₂ (m)', 1, 8, 0.05],
    phase: ['phase φ (rad)', 0, 6.28, 0.01], speed: ['speed v (m/s)', 0.2, 3, 0.05],
  };
  return (
    <div>
      <Stage h={H} label="Superposition of two waves">
        {panels.map((pn, i) => {
          const top = 4 + i * (ph + gap); const mid = top + ph / 2;
          const sy = (y: number) => mid - (y / pn.amp) * (ph / 2);
          const pts: [number, number][] = Array.from({ length: 241 }, (_, j) => { const x = (length * j) / 240; return [px(x), sy(pn.f(x))]; });
          return (
            <g key={i}>
              <line x1={L} x2={R} y1={mid} y2={mid} stroke="var(--grid)" />
              <path d={pathOf(pts)} fill="none" stroke={C[pn.col]} strokeWidth={i === panels.length - 1 ? 2.2 : 1.6} />
              <text x={L} y={top + 8} fontSize="9" fill={C[pn.col]}>{pn.label}</text>
              {i === panels.length - 1 && nodes.map((x) => <circle key={x} cx={px(x)} cy={mid} r={3} fill="none" stroke="var(--fg)" strokeWidth={1.2} />)}
            </g>
          );
        })}
        {standing && <text x={R} y={H - 4} fontSize="9" textAnchor="end" fill="var(--fg)">standing wave · ○ nodes every λ/2</text>}
      </Stage>
      <Controls>
        {controls.map((c) => <Slider key={c} label={meta[c][0]} min={meta[c][1]} max={meta[c][2]} step={meta[c][3]} value={p[c]} onChange={set(c)} />)}
        <Btn active={dir === 1} onClick={() => setDir(1)}>y₂ → same way</Btn>
        <Btn active={dir === -1} onClick={() => setDir(-1)}>← y₂ opposite</Btn>
        <PlayPause running={running} set={setRunning} />
      </Controls>
    </div>
  );
}
