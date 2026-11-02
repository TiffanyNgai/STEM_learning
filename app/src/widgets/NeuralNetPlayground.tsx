import { useMemo, useRef, useState } from 'react';
import { Btn, Controls, PlayPause, Slider, Stage, rng, useFrame } from './_kit';
import { toyData } from './_mlToyData';

/**
 * A tiny multilayer perceptron trained live by full-batch gradient descent (backprop) on a 2D
 * binary-classification toy set. Left: data + predicted probability p(class 1 | x) as a heatmap.
 * Right: the network — edge thickness ∝ |weight|, green positive / red negative.
 * props: {
 *   dataset?: 'xor'|'circle'|'moons'|'spiral'|'linear' (default 'circle')
 *   hidden?: number      neurons per hidden layer, 0–8 (default 4; 0 = logistic regression)
 *   layers?: 1|2         number of hidden layers (default 1)
 *   activation?: 'tanh'|'relu' (default 'tanh')
 *   lr?: number          learning rate (default 0.5)
 *   showNetwork?: boolean (default true)
 *   controls?: boolean   show dataset/width/activation buttons (default true)
 * }
 */
type DS = 'xor' | 'circle' | 'moons' | 'spiral' | 'linear';
function makeData(ds: DS): [number, number, number][] {
  if (ds === 'moons' || ds === 'spiral') return toyData(ds, 160, 5).map(([x, y], i) => [x / 1.1, y / 1.1, i % 2]);
  const r = rng(8); const out: [number, number, number][] = [];
  for (let i = 0; i < 160; i++) {
    const x = r.u() * 4 - 2, y = r.u() * 4 - 2;
    const c = ds === 'xor' ? +(x * y > 0) : ds === 'circle' ? +(x * x + y * y < 1.3) : +(x + 0.5 * y > 0.2);
    out.push([x, y, c]);
  }
  return out;
}

export default function NeuralNetPlayground({ dataset = 'circle', hidden = 4, layers = 1, activation = 'tanh', lr: lr0 = 0.5, showNetwork = true, controls = true }: {
  dataset?: DS; hidden?: number; layers?: 1 | 2; activation?: 'tanh' | 'relu'; lr?: number; showNetwork?: boolean; controls?: boolean;
}) {
  const [ds, setDs] = useState<DS>(dataset);
  const [width, setWidth] = useState(hidden);
  const [act, setAct] = useState(activation);
  const [lr, setLr] = useState(lr0);
  const [running, setRunning] = useState(false);
  const [, force] = useState(0);
  const data = useMemo(() => makeData(ds), [ds]);
  const sizes = width === 0 ? [2, 1] : layers === 2 ? [2, width, width, 1] : [2, width, 1];
  const init = (seed: number) => {
    const r = rng(seed);
    return { W: sizes.slice(1).map((n, l) => Array.from({ length: n }, () => Array.from({ length: sizes[l] }, () => r.normal() * Math.sqrt((act === 'relu' ? 2 : 1) / sizes[l])))),
      b: sizes.slice(1).map((n) => new Array(n).fill(0.01)), vW: sizes.slice(1).map((n, l) => Array.from({ length: n }, () => new Array(sizes[l]).fill(0))), vb: sizes.slice(1).map((n) => new Array(n).fill(0)) };
  };
  const seed = useRef(1);
  const net = useRef(init(1)); const stats = useRef({ epoch: 0, loss: NaN, acc: NaN });
  const key = `${ds}|${width}|${act}|${layers}`; const lastKey = useRef(key);
  if (lastKey.current !== key) { lastKey.current = key; net.current = init(seed.current); stats.current = { epoch: 0, loss: NaN, acc: NaN }; }
  const f = act === 'relu' ? (z: number) => Math.max(0, z) : Math.tanh;
  const df = act === 'relu' ? (_z: number, a: number) => (a > 0 ? 1 : 0) : (_z: number, a: number) => 1 - a * a;
  const forward = (x: number, y: number) => {
    const A: number[][] = [[x, y]]; const { W, b } = net.current;
    for (let l = 0; l < W.length; l++) {
      const z = W[l].map((row, j) => row.reduce((s, w, k) => s + w * A[l][k], b[l][j]));
      A.push(l === W.length - 1 ? z.map((v) => 1 / (1 + Math.exp(-v))) : z.map(f));
    }
    return A;
  };
  const epoch = () => {
    const { W, b, vW, vb } = net.current; const gW = W.map((m) => m.map((r) => r.map(() => 0))); const gb = b.map((v) => v.map(() => 0));
    let loss = 0, correct = 0;
    for (const [x, y, c] of data) {
      const A = forward(x, y); const p = A[A.length - 1][0];
      loss -= c * Math.log(p + 1e-9) + (1 - c) * Math.log(1 - p + 1e-9); correct += +((p > 0.5) === (c === 1));
      let delta = [p - c]; // dL/dz at the output (sigmoid + cross-entropy)
      for (let l = W.length - 1; l >= 0; l--) {
        for (let j = 0; j < W[l].length; j++) { gb[l][j] += delta[j]; for (let k = 0; k < A[l].length; k++) gW[l][j][k] += delta[j] * A[l][k]; }
        if (l > 0) delta = A[l].map((a, k) => df(0, a) * W[l].reduce((s, row, j) => s + row[k] * delta[j], 0));
      }
    }
    const n = data.length;
    for (let l = 0; l < W.length; l++) for (let j = 0; j < W[l].length; j++) {
      vb[l][j] = 0.9 * vb[l][j] + gb[l][j] / n; b[l][j] -= lr * vb[l][j];
      for (let k = 0; k < W[l][j].length; k++) { vW[l][j][k] = 0.9 * vW[l][j][k] + gW[l][j][k] / n; W[l][j][k] -= lr * vW[l][j][k]; }
    }
    stats.current = { epoch: stats.current.epoch + 1, loss: loss / n, acc: correct / n };
  };
  useFrame(() => { for (let i = 0; i < 3; i++) epoch(); force((v) => v + 1); }, running);

  const P = 180, G = 30, ox = 4, oy = 6, sc = (v: number) => ((v + 2) / 4) * P;
  const heat = [];
  for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) {
    const x = -2 + (4 * (i + 0.5)) / G, y = 2 - (4 * (j + 0.5)) / G; const A = forward(x, y); const p = A[A.length - 1][0];
    heat.push(<rect key={i + '-' + j} x={ox + (i * P) / G} y={oy + (j * P) / G} width={P / G + 0.4} height={P / G + 0.4} fill={p > 0.5 ? 'var(--c2)' : 'var(--c3)'} opacity={Math.abs(p - 0.5) * 1.1} />);
  }
  const NX = 205, NW = 110;
  const nodePos = (l: number, j: number): [number, number] => [NX + (NW * l) / (sizes.length - 1), oy + P / 2 + (j - (sizes[l] - 1) / 2) * Math.min(22, (P - 10) / sizes[l])];
  const st = stats.current;
  return (
    <div>
      <Stage label="Neural network learning a decision boundary">
        {heat}
        <rect x={ox} y={oy} width={P} height={P} fill="none" stroke="var(--fg)" strokeWidth={0.6} />
        {data.map(([x, y, c], i) => <circle key={i} cx={ox + sc(x)} cy={oy + P - sc(y)} r={2.2} fill={c ? 'var(--c2)' : 'var(--c3)'} stroke="var(--fg)" strokeWidth={0.5} />)}
        {showNetwork && <g>
          {net.current.W.map((m, l) => m.map((row, j) => row.map((w, k) => {
            const [x1, y1] = nodePos(l, k), [x2, y2] = nodePos(l + 1, j);
            return <line key={`${l}${j}${k}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={w > 0 ? 'var(--c1)' : 'var(--c5)'} strokeWidth={Math.min(4, 0.3 + Math.abs(w) * 0.8)} opacity={0.75} />;
          })))}
          {sizes.map((n, l) => Array.from({ length: n }, (_, j) => { const [x, y] = nodePos(l, j); return <circle key={`n${l}${j}`} cx={x} cy={y} r={5} fill="var(--surface)" stroke="var(--fg)" strokeWidth={1} />; }))}
          <text x={NX} y={oy + P + 8} fontSize="8" textAnchor="middle" fill="var(--muted)">x₁,x₂</text>
          <text x={NX + NW} y={oy + P + 8} fontSize="8" textAnchor="middle" fill="var(--muted)">p(y=1)</text>
        </g>}
        <text x={ox} y={198} fontSize="9" fill="var(--fg)">epoch {st.epoch}{Number.isNaN(st.loss) ? '' : `   loss ${st.loss.toFixed(3)}   acc ${(st.acc * 100).toFixed(0)}%`}</text>
      </Stage>
      <Controls>
        <PlayPause running={running} set={setRunning} />
        <Btn onClick={() => { seed.current++; net.current = init(seed.current); stats.current = { epoch: 0, loss: NaN, acc: NaN }; force((v) => v + 1); }}>↺ Re-init</Btn>
        <Slider label="learning rate" min={0.01} max={3} step={0.01} value={lr} onChange={setLr} />
        {controls && <>
          <Slider label="hidden width" min={0} max={8} step={1} value={width} onChange={setWidth} />
          {(['circle', 'xor', 'moons', 'spiral', 'linear'] as DS[]).map((d) => <Btn key={d} active={d === ds} onClick={() => setDs(d)}>{d}</Btn>)}
          <Btn active={act === 'tanh'} onClick={() => setAct('tanh')}>tanh</Btn>
          <Btn active={act === 'relu'} onClick={() => setAct('relu')}>ReLU</Btn>
        </>}
      </Controls>
    </div>
  );
}
