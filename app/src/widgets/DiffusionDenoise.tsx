import { useMemo, useRef, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, rng, scale, useFrame } from './_kit';
import { posteriorMean, toyData, type ToyName } from './_mlToyData';

/**
 * 2D toy diffusion model. Forward: x_t = √ᾱ_t·x_0 + √(1−ᾱ_t)·ε with cosine schedule ᾱ_t = cos²(πt/2).
 * Reverse: DDPM (stochastic) or DDIM (deterministic) sampling using the EXACT optimal denoiser
 * E[x_0 | x_t] for the toy training set (so samples end on training points — perfect memorisation).
 * props: {
 *   dataset?: 'moons'|'spiral'|'ring'|'gmm'|'smile' (default 'moons')
 *   mode?: 'forward'|'reverse'   initial mode (default 'forward'); both are always available via buttons
 *   sampler?: 'ddpm'|'ddim'      initial sampler (default 'ddpm')
 *   steps?: number               reverse steps (default 50)
 *   particles?: number           (default 300)
 *   showScore?: boolean          start with the score-field arrows on (default false)
 *   t?: number                   initial forward time in [0,1] (default 0)
 * }
 */
const abar = (t: number) => Math.cos((Math.PI / 2) * Math.min(1, Math.max(0, t))) ** 2;

export default function DiffusionDenoise({ dataset = 'moons', mode: mode0 = 'forward', sampler: s0 = 'ddpm', steps = 50, particles = 300, showScore = false, t: t0 = 0 }: {
  dataset?: ToyName; mode?: 'forward' | 'reverse'; sampler?: 'ddpm' | 'ddim'; steps?: number; particles?: number; showScore?: boolean; t?: number;
}) {
  const data = useMemo(() => toyData(dataset, 240, 3), [dataset]);
  const R = 3;
  const box: [number, number, number, number] = [60, 4, 260, 196];
  const sx = scale([-R, R], [box[0], box[2]]); const sy = scale([-R, R], [box[3], box[1]]);
  const [mode, setMode] = useState(mode0);
  const [sampler, setSampler] = useState(s0);
  const [score, setScore] = useState(showScore);
  const [t, setT] = useState(t0);
  const [running, setRunning] = useState(false);
  const seed = useRef(11);
  const noise = useMemo(() => { const r = rng(5); return Array.from({ length: particles }, () => [r.normal(), r.normal()] as [number, number]); }, [particles]);
  const x0s = useMemo(() => Array.from({ length: particles }, (_, i) => data[i % data.length]), [data, particles]);
  // reverse-process state
  const rev = useRef<{ xs: [number, number][]; k: number }>({ xs: [], k: steps });
  const rr = useRef(rng(seed.current));
  const startReverse = () => {
    rr.current = rng(++seed.current);
    rev.current = { xs: Array.from({ length: particles }, () => [rr.current.normal(), rr.current.normal()] as [number, number]), k: steps };
    setT(1);
  };
  if (mode === 'reverse' && rev.current.xs.length === 0) { rr.current = rng(seed.current); rev.current = { xs: Array.from({ length: particles }, () => [rr.current.normal(), rr.current.normal()] as [number, number]), k: steps }; }

  const reverseStep = () => {
    const S = rev.current; if (S.k <= 0) { setRunning(false); return; }
    const tt = S.k / steps, ts = (S.k - 1) / steps;
    const at = abar(tt), as = abar(ts);
    const a = Math.sqrt(at), sg = Math.sqrt(1 - at);
    for (const p of S.xs) {
      const [hx, hy] = posteriorMean(data, p[0], p[1], a, sg);
      if (sampler === 'ddim') {
        const ex = (p[0] - a * hx) / sg, ey = (p[1] - a * hy) / sg;
        p[0] = Math.sqrt(as) * hx + Math.sqrt(1 - as) * ex; p[1] = Math.sqrt(as) * hy + Math.sqrt(1 - as) * ey;
      } else {
        const al = at / as, be = 1 - al;
        const c0 = Math.sqrt(as) * be / (1 - at), ct = Math.sqrt(al) * (1 - as) / (1 - at);
        const sd = Math.sqrt(Math.max(0, be * (1 - as) / (1 - at)));
        p[0] = c0 * hx + ct * p[0] + sd * rr.current.normal(); p[1] = c0 * hy + ct * p[1] + sd * rr.current.normal();
      }
    }
    S.k--; setT(S.k / steps);
  };
  const acc = useRef(0);
  useFrame((dt) => {
    if (mode === 'forward') { setT((v) => { const n = v + dt / 4; if (n >= 1) { setRunning(false); return 1; } return n; }); return; }
    acc.current += dt; const per = 3 / steps;
    while (acc.current > per) { acc.current -= per; reverseStep(); }
  }, running);

  const ab = abar(t);
  const pts: [number, number][] = mode === 'forward'
    ? x0s.map((x, i) => [Math.sqrt(ab) * x[0] + Math.sqrt(1 - ab) * noise[i][0], Math.sqrt(ab) * x[1] + Math.sqrt(1 - ab) * noise[i][1]])
    : rev.current.xs;
  const arrows = useMemo(() => {
    if (!score) return [];
    const out: { x: number; y: number; dx: number; dy: number }[] = [];
    const a = Math.sqrt(ab), s2 = Math.max(1 - ab, 1e-3);
    for (let i = 0; i < 13; i++) for (let j = 0; j < 13; j++) {
      const x = -R + (2 * R * (i + 0.5)) / 13, y = -R + (2 * R * (j + 0.5)) / 13;
      const [hx, hy] = posteriorMean(data, x, y, a, Math.sqrt(s2));
      // Tweedie: score = (√ᾱ·E[x0|x] − x)/(1−ᾱ); draw the "denoising direction" scaled by (1−ᾱ) for readability
      const dx = a * hx - x, dy = a * hy - y; const m = Math.hypot(dx, dy) || 1; const len = Math.min(9, 5 * m);
      out.push({ x: sx(x), y: sy(y), dx: (dx / m) * len, dy: (-dy / m) * len });
    }
    return out;
  }, [score, ab, data]);

  return (
    <div>
      <Stage label="Diffusion on a 2D toy dataset">
        <defs><marker id="dd-arr" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--c3)" /></marker></defs>
        <rect x={box[0]} y={box[1]} width={box[2] - box[0]} height={box[3] - box[1]} fill="none" stroke="var(--grid)" />
        {data.map(([x, y], i) => <circle key={'d' + i} cx={sx(x)} cy={sy(y)} r={1.3} fill="var(--muted)" opacity={0.35} />)}
        {arrows.map((a, i) => <line key={'a' + i} x1={a.x} y1={a.y} x2={a.x + a.dx} y2={a.y + a.dy} stroke="var(--c3)" strokeWidth={0.9} markerEnd="url(#dd-arr)" opacity={0.8} />)}
        {pts.map(([x, y], i) => Math.abs(x) < R && Math.abs(y) < R && <circle key={i} cx={sx(x)} cy={sy(y)} r={1.7} fill={mode === 'forward' ? 'var(--c2)' : 'var(--c4)'} opacity={0.85} />)}
        <g fontSize="9" fill="var(--fg)">
          <text x={4} y={14}>{mode === 'forward' ? 'forward q(x_t|x_0)' : `reverse (${sampler.toUpperCase()})`}</text>
          <text x={4} y={30}>t = {t.toFixed(2)}</text>
          <text x={4} y={44}>√ᾱ = {Math.sqrt(ab).toFixed(2)}</text>
          <text x={4} y={58}>σ = {Math.sqrt(1 - ab).toFixed(2)}</text>
          {mode === 'reverse' && <text x={4} y={72}>step {steps - rev.current.k}/{steps}</text>}
          <rect x={268} y={10} width={44} height={180} fill="none" stroke="var(--grid)" />
          <rect x={268} y={10 + 180 * (1 - Math.sqrt(ab))} width={20} height={180 * Math.sqrt(ab)} fill="var(--c1)" opacity={0.7} />
          <rect x={290} y={10 + 180 * (1 - Math.sqrt(1 - ab))} width={20} height={180 * Math.sqrt(1 - ab)} fill="var(--c5)" opacity={0.6} />
          <text x={278} y={8} fontSize="8" textAnchor="middle">signal</text>
          <text x={300} y={198} fontSize="8" textAnchor="middle">noise</text>
        </g>
      </Stage>
      <Controls>
        <Btn active={mode === 'forward'} onClick={() => { setMode('forward'); setRunning(false); setT(0); }}>Forward</Btn>
        <Btn active={mode === 'reverse'} onClick={() => { setMode('reverse'); setRunning(false); startReverse(); }}>Reverse</Btn>
        {mode === 'forward' && <Slider label="t" min={0} max={1} step={0.01} value={t} onChange={(v) => { setRunning(false); setT(v); }} />}
        {mode === 'reverse' && <>
          <Btn active={sampler === 'ddpm'} onClick={() => setSampler('ddpm')}>DDPM</Btn>
          <Btn active={sampler === 'ddim'} onClick={() => setSampler('ddim')}>DDIM</Btn>
          <Btn onClick={() => { setRunning(false); startReverse(); }}>↺ New noise</Btn>
        </>}
        <PlayPause running={running} set={(r) => { if (r && mode === 'forward' && t >= 1) setT(0); if (r && mode === 'reverse' && rev.current.k <= 0) startReverse(); setRunning(r); }} />
        <Btn active={score} onClick={() => setScore(!score)}>Score field</Btn>
      </Controls>
    </div>
  );
}
