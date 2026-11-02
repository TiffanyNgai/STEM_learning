import { useRef, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, prefersReducedMotion, rng, useFrame } from './_kit';

/**
 * Two compartments separated by a membrane with pores; particles do random (Brownian-like) motion.
 *  - mode 'diffusion': solute (orange) fits through the pores → net movement down its concentration gradient until even.
 *  - mode 'osmosis': solute is too big for the pores; only water (small blue dots) crosses. Water moves net toward the
 *    side with more solute and that side's level rises (cartoon: solute lowers the water's tendency to escape).
 * props: { mode?: 'diffusion' | 'osmosis' (default 'diffusion'), left?: number (solute particles on left, default 40),
 *          right?: number (default 6), toggle?: boolean (show mode switch, default true) }
 */
type Mode = 'diffusion' | 'osmosis';
interface P { x: number; y: number; vx: number; vy: number; w: boolean }
const MID = 160, BOT = 186, TOP0 = 70, L = 12, R = 308, PORES: [number, number][] = [[95, 108], [128, 141], [161, 174]];
const WATER = 70;

function init(mode: Mode, left: number, right: number, seed: number): P[] {
  const r = rng(seed);
  const mk = (side: number, w: boolean): P => {
    const a = r.u() * Math.PI * 2, sp = w ? 70 : 40;
    return { x: side ? MID + 6 + r.u() * (R - MID - 12) : L + 6 + r.u() * (MID - L - 12), y: TOP0 + 6 + r.u() * (BOT - TOP0 - 12), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, w };
  };
  const out: P[] = [];
  for (let i = 0; i < left; i++) out.push(mk(0, false));
  for (let i = 0; i < right; i++) out.push(mk(1, false));
  if (mode === 'osmosis') for (let i = 0; i < WATER * 2; i++) out.push(mk(i % 2, true));
  return out;
}

export default function DiffusionOsmosis({ mode = 'diffusion', left = 40, right = 6, toggle = true }: { mode?: Mode; left?: number; right?: number; toggle?: boolean }) {
  const [m, setM] = useState<Mode>(mode);
  const [nl, setNl] = useState(left);
  const [nr, setNr] = useState(right);
  const [running, setRunning] = useState(!prefersReducedMotion());
  const [seed, setSeed] = useState(1);
  const ps = useRef<P[]>(init(mode, left, right, 1));
  const tops = useRef<[number, number]>([TOP0, TOP0]);
  const r = useRef(rng(99));
  const [, force] = useState(0);
  const reset = (mm = m, a = nl, b = nr) => { ps.current = init(mm, a, b, seed + 1); setSeed(seed + 1); tops.current = [TOP0, TOP0]; force((x) => x + 1); };

  useFrame((dt) => {
    const arr = ps.current;
    const side = (p: P) => (p.x < MID ? 0 : 1);
    // osmosis: water level on each side follows its water count
    const wc = [0, 0], sc = [0, 0];
    for (const p of arr) (p.w ? wc : sc)[side(p)]++;
    if (m === 'osmosis') for (const s of [0, 1]) {
      const target = Math.max(34, BOT - (BOT - TOP0) * (wc[s] / WATER));
      tops.current[s] += (target - tops.current[s]) * Math.min(1, dt * 3);
    }
    const frac = [sc[0] / Math.max(1, sc[0] + wc[0]), sc[1] / Math.max(1, sc[1] + wc[1])];
    for (const p of arr) {
      // random kicks keep the motion Brownian-looking
      p.vx += r.current.normal() * 60 * dt * 3; p.vy += r.current.normal() * 60 * dt * 3;
      const sp = Math.hypot(p.vx, p.vy), want = p.w ? 70 : 40;
      p.vx *= want / sp; p.vy *= want / sp;
      const s = side(p), top = tops.current[s] + 3;
      let nx = p.x + p.vx * dt; const ny = p.y + p.vy * dt;
      if ((p.x < MID) !== (nx < MID)) {
        const inPore = PORES.some(([a, b]) => ny > a && ny < b);
        const nextTop = tops.current[1 - s] + 3;
        const ok = inPore && ny > nextTop && (p.w ? r.current.u() < Math.max(0.05, 1 - 1.6 * frac[s]) : m === 'diffusion');
        if (!ok) { p.vx = -p.vx; nx = p.x; }
      }
      p.x = Math.min(R - 3, Math.max(L + 3, nx)); p.y = Math.min(BOT - 3, Math.max(top, ny));
      if (p.x <= L + 3 || p.x >= R - 3) p.vx = -p.vx;
      if (p.y <= top || p.y >= BOT - 3) p.vy = -p.vy;
    }
    force((x) => x + 1);
  }, running);

  const arr = ps.current;
  const cnt = [0, 0], wcnt = [0, 0];
  for (const p of arr) (p.w ? wcnt : cnt)[p.x < MID ? 0 : 1]++;
  const [tl, tr] = m === 'osmosis' ? tops.current : [TOP0, TOP0];
  return (
    <div>
      <Stage w={320} h={200} label={`${m} simulation`}>
        <rect x={L} y={tl} width={MID - L} height={BOT - tl} fill="var(--c2)" fillOpacity={0.12} />
        <rect x={MID} y={tr} width={R - MID} height={BOT - tr} fill="var(--c2)" fillOpacity={0.12} />
        <path d={`M${L},${30} V${BOT} H${R} V${30}`} fill="none" stroke="var(--fg)" strokeWidth={1.5} />
        {/* membrane with pores */}
        {[[30, PORES[0][0]], [PORES[0][1], PORES[1][0]], [PORES[1][1], PORES[2][0]], [PORES[2][1], BOT]].map(([a, b], i) => (
          <rect key={i} x={MID - 2.5} y={a} width={5} height={b - a} fill="var(--c4)" />
        ))}
        {arr.map((p, i) => p.w
          ? <circle key={i} cx={p.x} cy={p.y} r={1.6} fill="var(--c2)" />
          : <circle key={i} cx={p.x} cy={p.y} r={m === 'osmosis' ? 5 : 3.2} fill="var(--c3)" />)}
        <text x={86} y={22} textAnchor="middle" fontSize={10} fill="var(--fg)">Left: {cnt[0]} solute{m === 'osmosis' ? ` · ${wcnt[0]} water` : ''}</text>
        <text x={234} y={22} textAnchor="middle" fontSize={10} fill="var(--fg)">Right: {cnt[1]} solute{m === 'osmosis' ? ` · ${wcnt[1]} water` : ''}</text>
        <text x={160} y={197} textAnchor="middle" fontSize={9} fill="var(--muted)">
          {m === 'diffusion' ? 'solute fits through the pores' : 'pores pass water only (selectively permeable)'}
        </text>
      </Stage>
      <Controls>
        <Slider label="Solute left" min={0} max={60} step={1} value={nl} onChange={(v) => { setNl(v); reset(m, v, nr); }} />
        <Slider label="Solute right" min={0} max={60} step={1} value={nr} onChange={(v) => { setNr(v); reset(m, nl, v); }} />
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => reset()}>↺ Reset</Btn>
        {toggle && <Btn onClick={() => { const nm: Mode = m === 'diffusion' ? 'osmosis' : 'diffusion'; setM(nm); reset(nm); }}>
          {m === 'diffusion' ? 'Switch to osmosis' : 'Switch to diffusion'}</Btn>}
      </Controls>
    </div>
  );
}
