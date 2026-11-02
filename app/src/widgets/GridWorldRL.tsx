import { useMemo, useRef, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, rng, useFrame } from './_kit';

/**
 * Grid-world reinforcement learning, live. Each cell is split into 4 triangles coloured by Q(s,a)
 * (green > 0, red < 0); the arrow shows the greedy action argmax_a Q(s,a).
 * props: {
 *   layout?: string[]   rows of chars: '.' empty, '#' wall, 'S' start, 'G' goal (+1, terminal), 'P' pit (−1, terminal)
 *   algorithm?: 'q-learning'|'sarsa'|'value-iteration'   (default 'q-learning'; buttons let the user switch)
 *   gamma?: number (0.9)  epsilon?: number (0.2)  alpha?: number (0.5)
 *   slip?: number        probability the move goes sideways instead (default 0)
 *   stepReward?: number  reward per non-terminal step (default −0.04)
 *   showValues?: boolean print max_a Q in each cell (default true)
 * }
 */
type Algo = 'q-learning' | 'sarsa' | 'value-iteration';
const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // up right down left

export default function GridWorldRL({ layout = ['....G', '.#.#P', '.#...', 'S....'], algorithm = 'q-learning', gamma: g0 = 0.9, epsilon: e0 = 0.2, alpha = 0.5, slip = 0, stepReward = -0.04, showValues = true }: {
  layout?: string[]; algorithm?: Algo; gamma?: number; epsilon?: number; alpha?: number; slip?: number; stepReward?: number; showValues?: boolean;
}) {
  const H = layout.length, W = Math.max(...layout.map((r) => r.length));
  const at = (x: number, y: number) => (y < 0 || y >= H || x < 0 || x >= W ? '#' : layout[y][x] ?? '#');
  const start = useMemo(() => { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (at(x, y) === 'S') return [x, y]; return [0, H - 1]; }, [layout]);
  const [algo, setAlgo] = useState<Algo>(algorithm);
  const [gamma, setGamma] = useState(g0);
  const [eps, setEps] = useState(e0);
  const [speed, setSpeed] = useState(4);
  const [running, setRunning] = useState(false);
  const [, force] = useState(0);
  const newQ = () => Array.from({ length: W * H }, () => [0, 0, 0, 0]);
  const S = useRef({ Q: newQ(), V: new Array(W * H).fill(0), pos: [...start], a: -1, ep: 0, ret: 0, last: NaN, sweeps: 0, steps: 0 });
  const r = useRef(rng(2));
  const term = (x: number, y: number) => at(x, y) === 'G' || at(x, y) === 'P';
  const reward = (x: number, y: number) => (at(x, y) === 'G' ? 1 : at(x, y) === 'P' ? -1 : stepReward);
  const move = (x: number, y: number, a: number) => { const nx = x + DIRS[a][0], ny = y + DIRS[a][1]; return at(nx, ny) === '#' ? [x, y] : [nx, ny]; };
  const outcomes = (x: number, y: number, a: number): [number, number[]][] =>
    slip > 0 ? [[1 - slip, move(x, y, a)], [slip / 2, move(x, y, (a + 1) % 4)], [slip / 2, move(x, y, (a + 3) % 4)]] : [[1, move(x, y, a)]];
  const greedy = (q: number[]) => { const m = Math.max(...q); const best = [0, 1, 2, 3].filter((i) => q[i] >= m - 1e-9); return best[Math.floor(r.current.u() * best.length)]; };
  const pick = (s: number) => (r.current.u() < eps ? Math.floor(r.current.u() * 4) : greedy(S.current.Q[s]));
  const reset = () => { S.current = { Q: newQ(), V: new Array(W * H).fill(0), pos: [...start], a: -1, ep: 0, ret: 0, last: NaN, sweeps: 0, steps: 0 }; force((v) => v + 1); };

  const tdStep = () => {
    const st = S.current; const [x, y] = st.pos; const s = y * W + x;
    const a = st.a >= 0 && algo === 'sarsa' ? st.a : pick(s);
    const u = r.current.u(); let acc = 0; let nxt = [x, y];
    for (const [p, o] of outcomes(x, y, a)) { acc += p; if (u <= acc) { nxt = o; break; } }
    const rew = reward(nxt[0], nxt[1]); const done = term(nxt[0], nxt[1]); const s2 = nxt[1] * W + nxt[0];
    let target = rew; let a2 = -1;
    if (!done) {
      if (algo === 'sarsa') { a2 = pick(s2); target += gamma * st.Q[s2][a2]; } else target += gamma * Math.max(...st.Q[s2]);
    }
    st.Q[s][a] += alpha * (target - st.Q[s][a]);
    st.ret += rew; st.steps++;
    if (done || st.steps > 100) { st.ep++; st.last = st.ret; st.ret = 0; st.steps = 0; st.pos = [...start]; st.a = -1; }
    else { st.pos = nxt; st.a = a2; }
  };
  const viSweep = () => {
    const st = S.current; const V2 = [...st.V];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (at(x, y) === '#' || term(x, y)) continue;
      const q = [0, 1, 2, 3].map((a) => outcomes(x, y, a).reduce((t, [p, [nx, ny]]) => t + p * (reward(nx, ny) + (term(nx, ny) ? 0 : gamma * st.V[ny * W + nx])), 0));
      st.Q[y * W + x] = q; V2[y * W + x] = Math.max(...q);
    }
    st.V = V2; st.sweeps++;
  };
  const acc = useRef(0);
  useFrame((dt) => {
    if (algo === 'value-iteration') { acc.current += dt; if (acc.current > 0.5) { acc.current = 0; viSweep(); } }
    else for (let i = 0; i < speed; i++) tdStep();
    force((v) => v + 1);
  }, running);

  const cs = Math.min(300 / W, 176 / H); const ox = (320 - cs * W) / 2, oy = 4;
  const st = S.current;
  const colour = (v: number) => (v >= 0 ? 'var(--c1)' : 'var(--c5)');
  const cells = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const X = ox + x * cs, Y = oy + y * cs, c = at(x, y), q = st.Q[y * W + x], cx = X + cs / 2, cy = Y + cs / 2;
    if (c === '#') { cells.push(<rect key={`${x},${y}`} x={X} y={Y} width={cs} height={cs} fill="var(--muted)" opacity={0.6} />); continue; }
    if (term(x, y)) {
      cells.push(<g key={`${x},${y}`}><rect x={X} y={Y} width={cs} height={cs} fill={c === 'G' ? 'var(--c1)' : 'var(--c5)'} opacity={0.75} />
        <text x={cx} y={cy + 4} fontSize="11" textAnchor="middle" fill="var(--fg)">{c === 'G' ? '+1' : '−1'}</text></g>);
      continue;
    }
    const corners = [[X, Y], [X + cs, Y], [X + cs, Y + cs], [X, Y + cs]];
    const tri = [0, 1, 2, 3].map((a) => { const p1 = corners[a], p2 = corners[(a + 1) % 4]; return `${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${cx},${cy}`; });
    const best = q.indexOf(Math.max(...q)); const vmax = Math.max(...q); const touched = q.some((v) => v !== 0);
    cells.push(<g key={`${x},${y}`}>
      {tri.map((pts, a) => <polygon key={a} points={pts} fill={colour(q[a])} opacity={Math.min(0.85, Math.abs(q[a]) * 0.9)} stroke="var(--grid)" strokeWidth={0.4} />)}
      {touched && <line x1={cx} y1={cy} x2={cx + DIRS[best][0] * cs * 0.32} y2={cy + DIRS[best][1] * cs * 0.32} stroke="var(--fg)" strokeWidth={1.6} markerEnd="url(#gw-arr)" />}
      {showValues && touched && <text x={X + 2} y={Y + cs - 2} fontSize="7.5" fill="var(--fg)">{vmax.toFixed(2)}</text>}
      {c === 'S' && <text x={X + cs - 2} y={Y + 9} fontSize="8" textAnchor="end" fill="var(--muted)">S</text>}
    </g>);
  }
  return (
    <div>
      <Stage label="Grid world reinforcement learning">
        <defs><marker id="gw-arr" viewBox="0 0 6 6" refX="4" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L6,3L0,6z" fill="var(--fg)" /></marker></defs>
        {cells}
        <rect x={ox} y={oy} width={cs * W} height={cs * H} fill="none" stroke="var(--fg)" strokeWidth={0.8} />
        {algo !== 'value-iteration' && <circle cx={ox + (st.pos[0] + 0.5) * cs} cy={oy + (st.pos[1] + 0.5) * cs} r={cs * 0.16} fill="var(--c2)" stroke="var(--surface)" strokeWidth={1.2} />}
        <text x={160} y={196} fontSize="9" textAnchor="middle" fill="var(--fg)">
          {algo === 'value-iteration' ? `value iteration — sweep ${st.sweeps}` : `${algo} — episode ${st.ep}${Number.isNaN(st.last) ? '' : `, last return ${st.last.toFixed(2)}`}`}
        </text>
      </Stage>
      <Controls>
        {(['q-learning', 'sarsa', 'value-iteration'] as Algo[]).map((a) => <Btn key={a} active={a === algo} onClick={() => { setAlgo(a); reset(); }}>{a === 'q-learning' ? 'Q-learning' : a === 'sarsa' ? 'SARSA' : 'Value iter.'}</Btn>)}
        <Slider label="γ discount" min={0} max={0.99} step={0.01} value={gamma} onChange={setGamma} />
        {algo !== 'value-iteration' && <Slider label="ε explore" min={0} max={1} step={0.01} value={eps} onChange={setEps} />}
        {algo !== 'value-iteration' && <Slider label="speed" min={1} max={60} step={1} value={speed} onChange={setSpeed} format={(v) => `${v}/frame`} />}
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={reset}>↺ Reset</Btn>
      </Controls>
    </div>
  );
}
