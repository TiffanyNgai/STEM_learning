import { useMemo, useRef, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, prefersReducedMotion, useFrame } from './_kit';

type Boundary = 'top' | 'sine' | 'opposite';
type Method = 'jacobi' | 'gauss-seidel';
/**
 * Laplace's equation u_xx + u_yy = 0 on the unit square, solved by relaxation: sweep after sweep, replace every
 * interior value by the average of its four neighbours (the discrete mean-value property). Boundary values are fixed.
 * Colour: red = hot (u near 1), blue = cold (u near 0). Readouts: sweeps done, largest change in the last sweep,
 * and the value at the centre compared with the exact answer.
 *   'top':      top edge u = 1, other edges 0.        Centre → 1/4 exactly (four rotated copies add up to 1).
 *   'sine':     top edge u = sin(πx), other edges 0.   Exact u = sin(πx) sinh(πy)/sinh π, centre ≈ 0.1993.
 *   'opposite': top and bottom 1, sides 0.             Centre → 1/2.
 * props: { boundary?: Boundary (default 'top'), n?: interior points per side (odd, 5–41, default 25),
 *          method?: 'jacobi' | 'gauss-seidel' (default 'jacobi'), sweepsPerFrame?: number (default 4), switchable?: boolean (default true) }
 */
export default function MathLaplaceRelax({ boundary = 'top', n = 25, method = 'jacobi', sweepsPerFrame = 4, switchable = true }: {
  boundary?: Boundary; n?: number; method?: Method; sweepsPerFrame?: number; switchable?: boolean;
}) {
  const N = Math.max(5, Math.min(41, Math.round(n) | 1)); // odd so there is a centre point
  const S = N + 2; // including boundary
  const [bc, setBc] = useState<Boundary>(boundary);
  const [m, setM] = useState<Method>(method);
  const [spf, setSpf] = useState(sweepsPerFrame);
  const [running, setRunning] = useState(!prefersReducedMotion());
  const [, force] = useState(0);
  const st = useRef({ u: new Float64Array(S * S), sweeps: 0, change: 1, key: '' });
  const key = `${bc}|${N}`;
  const init = () => {
    const u = new Float64Array(S * S);
    for (let i = 0; i < S; i++) {
      const x = i / (S - 1);
      u[(S - 1) * S + i] = bc === 'sine' ? Math.sin(Math.PI * x) : 1; // top row j = S−1
      if (bc === 'opposite') u[i] = 1; // bottom row j = 0
    }
    st.current = { u, sweeps: 0, change: 1, key };
  };
  if (st.current.key !== key) init();
  const sweep = () => {
    const s = st.current; const u = s.u; let ch = 0;
    const src = m === 'jacobi' ? u.slice() : u;
    for (let j = 1; j <= N; j++) for (let i = 1; i <= N; i++) {
      const k = j * S + i;
      const v = 0.25 * (src[k - 1] + src[k + 1] + src[k - S] + src[k + S]);
      ch = Math.max(ch, Math.abs(v - u[k])); u[k] = v;
    }
    s.sweeps++; s.change = ch;
  };
  useFrame(() => {
    if (st.current.change < 1e-7) { setRunning(false); return; }
    for (let r = 0; r < spf; r++) sweep();
    force((v) => v + 1);
  }, running);
  const exact = useMemo(() => (bc === 'top' ? 0.25 : bc === 'opposite' ? 0.5 : Math.sinh(Math.PI / 2) / Math.sinh(Math.PI)), [bc]);
  const { u, sweeps, change } = st.current;
  const c = (N + 1) / 2;
  const centre = u[c * S + c];
  const cell = 176 / S, X0 = 72, Y0 = 4;
  const rects = [];
  for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
    const v = u[j * S + i];
    const bnd = i === 0 || j === 0 || i === S - 1 || j === S - 1;
    if ((i === 0 || i === S - 1) && (j === 0 || j === S - 1)) continue; // corners play no role
    rects.push(<rect key={j * S + i} x={X0 + i * cell} y={Y0 + (S - 1 - j) * cell} width={cell + 0.2} height={cell + 0.2}
      fill="var(--c5)" fillOpacity={Math.max(0, Math.min(1, v))} stroke={bnd ? 'var(--fg)' : 'none'} strokeWidth={bnd ? 0.3 : 0} />);
  }
  const reset = () => { init(); force((v) => v + 1); setRunning(true); };
  return (
    <div>
      <Stage w={320} h={200} label="Relaxation solution of Laplace's equation">
        <rect x={X0 + cell} y={Y0 + cell} width={N * cell} height={N * cell} fill="var(--c2)" fillOpacity={0.55} />
        {rects}
        <circle cx={X0 + (c + 0.5) * cell} cy={Y0 + (S - 1 - c + 0.5) * cell} r={2.6} fill="none" stroke="var(--fg)" strokeWidth={1.2} />
        <text x={4} y={14} fontSize="9" fill="var(--fg)">sweeps</text>
        <text x={4} y={26} fontSize="10" fontWeight="bold" fill="var(--fg)">{sweeps}</text>
        <text x={4} y={46} fontSize="9" fill="var(--fg)">max change</text>
        <text x={4} y={58} fontSize="10" fill="var(--fg)">{change.toExponential(1)}</text>
        <text x={4} y={78} fontSize="9" fill="var(--fg)">centre ○</text>
        <text x={4} y={90} fontSize="10" fontWeight="bold" fill="var(--c5)">{centre.toFixed(4)}</text>
        <text x={4} y={110} fontSize="9" fill="var(--muted)">exact (PDE)</text>
        <text x={4} y={122} fontSize="10" fill="var(--muted)">{exact.toFixed(4)}</text>
        <text x={4} y={150} fontSize="8" fill="var(--muted)">{N}×{N} grid</text>
        <text x={4} y={162} fontSize="8" fill="var(--muted)">{change < 1e-7 ? 'converged' : m}</text>
        <text x={254} y={14} fontSize="8" fill="var(--c5)">hot = 1</text>
        <text x={254} y={26} fontSize="8" fill="var(--c2)">cold = 0</text>
      </Stage>
      <Controls>
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => { for (let r = 0; r < 50; r++) sweep(); force((v) => v + 1); }}>+50 sweeps</Btn>
        <Btn onClick={reset}>Reset</Btn>
        <Slider label="sweeps/frame" value={spf} min={1} max={40} step={1} onChange={setSpf} format={(v) => String(v)} />
        <Btn active={m === 'jacobi'} onClick={() => setM('jacobi')}>Jacobi</Btn>
        <Btn active={m === 'gauss-seidel'} onClick={() => setM('gauss-seidel')}>Gauss–Seidel</Btn>
        {switchable && (['top', 'sine', 'opposite'] as Boundary[]).map((b) => <Btn key={b} active={bc === b} onClick={() => { setBc(b); setRunning(true); }}>{b}</Btn>)}
      </Controls>
    </div>
  );
}
