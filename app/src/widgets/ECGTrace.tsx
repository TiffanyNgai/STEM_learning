import { useMemo, useState, type ReactElement } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, pathOf, prefersReducedMotion, rng, useClock } from './_kit';

type Rhythm = 'sinus' | 'afib' | 'avb1' | 'stemi' | 'hyperk';
/**
 * Scrolling single-lead ECG (lead II–like) on standard paper: small box = 0.04 s × 0.1 mV,
 * large box = 0.20 s × 0.5 mV (paper speed 25 mm/s). P, QRS and T are labelled on one beat.
 * props (all optional):
 *  rate?: number (bpm, default 72)       rhythm?: Rhythm (initial, default 'sinus')
 *  rhythms?: Rhythm[] (buttons shown; default ['sinus'] → no buttons)
 *  showLabels?: boolean (default true)   showRate?: boolean (rate slider, default true)
 * Rhythms: sinus · afib (irregularly irregular, no P waves, fibrillatory baseline) ·
 *  avb1 (first-degree AV block, PR 0.30 s) · stemi (ST elevation) · hyperk (peaked T, flattened P, wide QRS).
 */
const NAMES: Record<Rhythm, string> = { sinus: 'Sinus', afib: 'AF', avb1: '1° AV block', stemi: 'ST elevation', hyperk: 'Hyper-K⁺' };
const g = (x: number, c: number, w: number) => Math.exp(-(((x - c) / w) ** 2));

export default function ECGTrace({ rate = 72, rhythm = 'sinus', rhythms = ['sinus'], showLabels = true, showRate = true }: {
  rate?: number; rhythm?: Rhythm; rhythms?: Rhythm[]; showLabels?: boolean; showRate?: boolean;
}) {
  const [hr, setHr] = useState(rate);
  const [r, setR] = useState<Rhythm>(rhythm);
  const [running, setRunning] = useState(!prefersReducedMotion());
  const [t] = useClock(running, 1);
  const RR = 60 / hr;
  const pr = r === 'avb1' ? 0.3 : 0.16;
  const af = useMemo(() => {
    const { u } = rng(7); const beats: number[] = []; let s = 0;
    for (let i = 0; i < 160; i++) { beats.push(s); s += 0.45 + 0.65 * u(); }
    return { beats, L: s };
  }, []);
  // beat (R-peak) times near time s
  const beatsNear = (s: number): number[] => {
    if (r !== 'afib') { const k = Math.floor(s / RR); return [k - 1, k, k + 1, k + 2].map((i) => i * RR); }
    const scaleF = RR / 0.775; // mean AF RR ≈ 0.775 s at the slider rate
    const L = af.L * scaleF; const base = Math.floor(s / L) * L;
    return [-L, 0, L].flatMap((o) => af.beats.map((b) => base + o + b * scaleF)).filter((b) => Math.abs(b - s) < 1.5);
  };
  const wide = r === 'hyperk' ? 1.8 : 1;
  const v = (s: number) => {
    let y = r === 'afib' ? 0.04 * Math.sin(2 * Math.PI * 6.1 * s) + 0.03 * Math.sin(2 * Math.PI * 7.7 * s + 1) : 0;
    const q = Math.sqrt(Math.min(RR, 1.6));
    for (const b of beatsNear(s)) {
      const x = s - b;
      if (r !== 'afib') y += (r === 'hyperk' ? 0.05 : 0.15) * g(x, -pr, 0.035);
      y += -0.1 * g(x, -0.035 * wide, 0.01 * wide) + 1.0 * g(x, 0, 0.012 * wide) - 0.25 * g(x, 0.035 * wide, 0.012 * wide);
      if (r === 'stemi') y += 0.3 * Math.exp(-(((x - 0.16 * q) / (0.11 * q)) ** 4));
      y += (r === 'hyperk' ? 0.75 * g(x, 0.24 * q, 0.035 * q) : 0.3 * g(x, 0.25 * q, 0.055 * q));
    }
    return y;
  };
  const W = 3; // seconds shown
  const L0 = 10, PX = 100, base = 125, MV = 40; // 100 px/s, 40 px/mV
  const X = (s: number) => L0 + (s - (t - W)) * PX;
  const Y = (mv: number) => base - mv * MV;
  const pts: [number, number][] = [];
  for (let i = 0; i <= 600; i++) { const s = t - W + (W * i) / 600; pts.push([X(s), Y(v(s))]); }
  const grid: ReactElement[] = [];
  for (let k = Math.ceil((t - W) / 0.04); k * 0.04 <= t; k++) {
    const gx = X(k * 0.04);
    grid.push(<line key={'x' + k} x1={gx} x2={gx} y1={20} y2={175} stroke="var(--c5)" strokeOpacity={k % 5 === 0 ? 0.35 : 0.12} strokeWidth={k % 5 === 0 ? 0.8 : 0.4} />);
  }
  for (let k = -12; k <= 26; k++) {
    const gy = base + k * 4;
    if (gy < 20 || gy > 175) continue;
    grid.push(<line key={'y' + k} x1={L0} x2={310} y1={gy} y2={gy} stroke="var(--c5)" strokeOpacity={k % 5 === 0 ? 0.35 : 0.12} strokeWidth={k % 5 === 0 ? 0.8 : 0.4} />);
  }
  const visible = beatsNear(t - 1.4).concat(beatsNear(t - 0.4)).filter((b, i, a) => a.indexOf(b) === i && b > t - W + 0.4 && b < t - 0.5).sort((a, b) => a - b);
  const lb = visible[0];
  const q = Math.sqrt(Math.min(RR, 1.6));
  return (
    <div>
      <Stage w={320} h={190} label="Scrolling ECG trace">
        <rect x={L0} y={20} width={300} height={155} fill="var(--surface)" />
        {grid}
        <path d={pathOf(pts)} fill="none" stroke="var(--fg)" strokeWidth={1.4} />
        {showLabels && lb !== undefined && (
          <g fontSize="9" fontWeight="bold" textAnchor="middle">
            {r !== 'afib' && <text x={X(lb - pr)} y={Y(0.15) - 6} fill="var(--c2)">P</text>}
            <text x={X(lb)} y={Y(1.0) - 4} fill="var(--c5)">QRS</text>
            <text x={X(lb + 0.25 * q)} y={Y(r === 'hyperk' ? 0.75 : r === 'stemi' ? 0.6 : 0.3) - 6} fill="var(--c1)">T</text>
            {r !== 'afib' && (
              <g>
                <line x1={X(lb - pr - 0.04)} x2={X(lb - 0.045)} y1={Y(-0.45)} y2={Y(-0.45)} stroke="var(--c2)" />
                <text x={X(lb - pr / 2 - 0.02)} y={Y(-0.45) + 10} fontSize="8" fill="var(--c2)">PR {(pr * 1000 + 0).toFixed(0)} ms</text>
              </g>
            )}
          </g>
        )}
        <text x={L0} y={13} fontSize="9" fill="var(--fg)">{NAMES[r]} · {r === 'afib' ? `mean ≈ ${hr} bpm (irregular)` : `${hr} bpm → R–R ${(RR * 1000).toFixed(0)} ms = ${(RR / 0.2).toFixed(1)} large boxes`}</text>
        <text x={310} y={186} fontSize="7" textAnchor="end" fill="var(--muted)">small box 0.04 s · 0.1 mV; large box 0.2 s</text>
      </Stage>
      <Controls>
        <PlayPause running={running} set={setRunning} />
        {rhythms.length > 1 && rhythms.map((x) => <Btn key={x} active={r === x} onClick={() => setR(x)}>{NAMES[x]}</Btn>)}
        {showRate && <Slider label="heart rate (bpm)" min={30} max={180} step={1} value={hr} onChange={setHr} format={(x) => x.toFixed(0)} />}
      </Controls>
    </div>
  );
}
