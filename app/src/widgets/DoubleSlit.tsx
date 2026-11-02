import { useRef, useState } from 'react';
import { Btn, C, Controls, PlayPause, Stage, Slider, pathOf, prefersReducedMotion, rng, useFrame } from './_kit';

/**
 * Double-slit experiment, one particle at a time. Dots land on the screen and a histogram builds up.
 * Without a which-path detector the hits form interference fringes; with the detector on, the fringes vanish
 * (each particle is seen at one slit, so the pattern is the sum of two single-slit patterns).
 * props: { detector?: boolean (initial, default false), rate?: number particles/s (default 30),
 *          theory?: boolean (overlay predicted curve, default true), spacing?: number fringe density 4–14 (default 9),
 *          showSlider?: boolean (slit-spacing slider, default false), seed?: number }
 */
const SRC: [number, number] = [18, 100], BAR = 110, SCR = 228, SLIT = 16, HALF = 80, BINS = 40;
const sinc = (x: number) => (Math.abs(x) < 1e-6 ? 1 : Math.sin(x) / x);
/** Screen coordinate y ∈ [-1, 1]. */
const intensity = (y: number, k: number, det: boolean) => {
  const env = sinc(2.4 * y) ** 2;
  return det ? env : env * Math.cos(k * y) ** 2;
};
interface P { t: number; y: number; slit: number }

export default function DoubleSlit({ detector = false, rate = 30, theory = true, spacing = 9, showSlider = false, seed = 11 }: {
  detector?: boolean; rate?: number; theory?: boolean; spacing?: number; showSlider?: boolean; seed?: number;
}) {
  const [det, setDet] = useState(detector);
  const [k, setK] = useState(spacing);
  const [running, setRunning] = useState(!prefersReducedMotion());
  const [, force] = useState(0);
  const r = useRef(rng(seed));
  const fly = useRef<P[]>([]);
  const hits = useRef<number[]>([]);
  const bins = useRef<number[]>(new Array(BINS).fill(0));
  const acc = useRef(0);
  const reset = () => { fly.current = []; hits.current = []; bins.current = new Array(BINS).fill(0); force((x) => x + 1); };
  const draw = () => { // rejection sampling from the intensity
    for (;;) { const y = r.current.u() * 2 - 1; if (r.current.u() < intensity(y, k, det)) return y; }
  };
  const emit = (count: number) => {
    for (let i = 0; i < count; i++) {
      const y = draw(); hits.current.push(y);
      if (hits.current.length > 1500) hits.current.shift();
      bins.current[Math.min(BINS - 1, Math.floor(((y + 1) / 2) * BINS))]++;
    }
    force((x) => x + 1);
  };
  useFrame((dt) => {
    acc.current += dt * rate;
    while (acc.current >= 1) { acc.current -= 1; fly.current.push({ t: 0, y: draw(), slit: r.current.u() < 0.5 ? -1 : 1 }); }
    const landed: P[] = [];
    fly.current = fly.current.filter((p) => { p.t += dt * 1.4; if (p.t >= 1) { landed.push(p); return false; } return true; });
    for (const p of landed) {
      hits.current.push(p.y); if (hits.current.length > 1500) hits.current.shift();
      bins.current[Math.min(BINS - 1, Math.floor(((p.y + 1) / 2) * BINS))]++;
    }
    force((x) => x + 1);
  }, running);
  const total = bins.current.reduce((a, b) => a + b, 0);
  const maxB = Math.max(1, ...bins.current);
  const sy = (y: number) => 100 + y * HALF;
  const curve: [number, number][] = [];
  if (theory) {
    let sum = 0; for (let i = 0; i < BINS; i++) sum += intensity(-1 + (2 * i + 1) / BINS, k, det);
    for (let i = 0; i <= 160; i++) { const y = -1 + i / 80; curve.push([SCR + 6 + ((total * intensity(y, k, det)) / sum / maxB) * 76, sy(y)]); }
  }
  const slitY = [100 - SLIT, 100 + SLIT];
  return (
    <div>
      <Stage w={320} h={200} label="Double-slit experiment building an interference pattern">
        <clipPath id="ds-clip"><rect x={BAR} y={0} width={SCR - BAR} height={200} /></clipPath>
        <circle cx={SRC[0]} cy={SRC[1]} r={6} fill={C[2]} />
        <text x={SRC[0]} y={SRC[1] + 18} fontSize="8" textAnchor="middle" fill="var(--muted)">source</text>
        <rect x={BAR - 2} y={14} width={4} height={slitY[0] - 4 - 14} fill="var(--fg)" />
        <rect x={BAR - 2} y={slitY[0] + 4} width={4} height={slitY[1] - slitY[0] - 8} fill="var(--fg)" />
        <rect x={BAR - 2} y={slitY[1] + 4} width={4} height={186 - slitY[1] - 4} fill="var(--fg)" />
        {det && slitY.map((y) => <g key={y}><rect x={BAR + 5} y={y - 6} width={9} height={12} rx={2} fill="none" stroke={C[4]} /><text x={BAR + 9.5} y={y - 9} fontSize="7" textAnchor="middle" fill={C[4]}>D</text></g>)}
        <line x1={SCR} x2={SCR} y1={14} y2={186} stroke="var(--fg)" strokeWidth={2} />
        {hits.current.map((y, i) => <circle key={i} cx={SCR - 4 - ((i * 7919) % 13) * 0.6} cy={sy(y)} r={0.9} fill={C[1]} opacity={0.7} />)}
        {bins.current.map((b, i) => <rect key={i} x={SCR + 6} y={sy(-1 + (2 * i) / BINS)} width={(b / maxB) * 76} height={(2 * HALF) / BINS - 0.5} fill={C[1]} opacity={0.55} />)}
        {theory && total > 0 && <path d={pathOf(curve)} fill="none" stroke={C[3]} strokeWidth={1.3} />}
        {fly.current.map((p, i) => {
          if (p.t < 0.45) { const s = p.t / 0.45; return <circle key={i} cx={SRC[0] + (BAR - SRC[0]) * s} cy={100} r={2.5} fill={C[2]} />; }
          const s = (p.t - 0.45) / 0.55;
          if (det) { const y0 = 100 + p.slit * SLIT; return <circle key={i} cx={BAR + (SCR - BAR) * s} cy={y0 + (sy(p.y) - y0) * s} r={2.5} fill={C[2]} />; }
          return <g key={i} clipPath="url(#ds-clip)" fill="none" stroke={C[2]} opacity={0.5 * (1 - s) + 0.1}>
            {slitY.map((y) => <circle key={y} cx={BAR} cy={y} r={4 + s * (SCR - BAR)} strokeWidth={0.6} />)}</g>;
        })}
        <text x={316} y={196} fontSize="8" textAnchor="end" fill="var(--muted)">{total} hits</text>
        <text x={4} y={10} fontSize="8" fill="var(--muted)">{det ? 'which-path detector ON' : 'no detector: both paths open'}</text>
      </Stage>
      <Controls>
        <PlayPause running={running} set={setRunning} />
        <Btn active={det} onClick={() => { setDet(!det); reset(); }}>{det ? 'Detector: on' : 'Detector: off'}</Btn>
        <Btn onClick={() => emit(500)}>+500</Btn>
        <Btn onClick={reset}>Clear</Btn>
        {showSlider && <Slider label="slit spacing" min={4} max={14} step={0.5} value={k} onChange={(v) => { setK(v); reset(); }} />}
      </Controls>
    </div>
  );
}
