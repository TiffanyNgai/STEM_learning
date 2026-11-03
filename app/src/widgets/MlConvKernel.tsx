import { useMemo, useState } from 'react';
import { Btn, C, Controls, PlayPause, Slider, Stage, prefersReducedMotion, useFrame } from './_kit';

/**
 * A 3×3 kernel sliding over a small greyscale image (deep-learning "convolution", i.e. cross-correlation:
 * y[i,j] = Σ_{a,b} K[a,b] · x[i·s + a − p, j·s + b − p], zeros outside the image).
 * Tap a kernel cell to add +1 (or −1 in "−1" mode); presets set the kernel. Padding p and stride s change
 * the output size ⌊(n + 2p − k)/s⌋ + 1, which is printed. "Shift →" moves the image content one pixel right,
 * to test translation equivariance. Output: blue = positive, red = negative, scaled by max |y|.
 * props: {
 *   image?: 'square'|'edge'|'diagonal'|'dot' (default 'square')
 *   kernel?: 'identity'|'blur'|'sharpen'|'sobel'|'laplacian' (default 'blur')
 *   padding?: number  0–2 (default 0)
 *   stride?: number   1–3 (default 1)
 *   size?: number     image side n, 6–10 (default 8)
 *   autoplay?: boolean (default true unless reduced motion)
 * }
 */
type Img = 'square' | 'edge' | 'diagonal' | 'dot';
type Pre = 'identity' | 'blur' | 'sharpen' | 'sobel' | 'laplacian';
const PRESETS: Record<Pre, [number[], number]> = {
  identity: [[0, 0, 0, 0, 1, 0, 0, 0, 0], 1],
  blur: [[1, 1, 1, 1, 1, 1, 1, 1, 1], 9],
  sharpen: [[0, -1, 0, -1, 5, -1, 0, -1, 0], 1],
  sobel: [[-1, 0, 1, -2, 0, 2, -1, 0, 1], 1],
  laplacian: [[0, 1, 0, 1, -4, 1, 0, 1, 0], 1],
};
const NAMES: Record<Pre, string> = { identity: 'identity', blur: 'blur', sharpen: 'sharpen', sobel: 'vertical edge', laplacian: 'Laplacian' };

function makeImage(kind: Img, n: number, shift: number): number[][] {
  const f = (i: number, j: number) => {
    const c = n / 2;
    if (kind === 'square') return i >= c - 2 && i < c + 1 && j >= c - 2 && j < c + 1 ? 1 : 0;
    if (kind === 'edge') return j >= c ? 1 : 0;
    if (kind === 'diagonal') return j - i >= 0 && j - i <= 1 ? 1 : 0;
    return i === Math.floor(c) - 1 && j === Math.floor(c) - 1 ? 1 : 0;
  };
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (j - shift >= 0 ? f(i, j - shift) : 0)));
}

export default function MlConvKernel({ image = 'square', kernel = 'blur', padding = 0, stride = 1, size = 8, autoplay }: {
  image?: Img; kernel?: Pre; padding?: number; stride?: number; size?: number; autoplay?: boolean;
}) {
  const n = Math.max(6, Math.min(10, Math.round(size)));
  const [img, setImg] = useState<Img>(image);
  const [K, setK] = useState<number[]>(PRESETS[kernel][0]);
  const [div, setDiv] = useState(PRESETS[kernel][1]);
  const [p, setP] = useState(Math.max(0, Math.min(2, Math.round(padding))));
  const [s, setS] = useState(Math.max(1, Math.min(3, Math.round(stride))));
  const [shift, setShift] = useState(0);
  const [minus, setMinus] = useState(false);
  const [run, setRun] = useState(autoplay ?? !prefersReducedMotion());
  const [idx, setIdx] = useState(0);
  const [acc, setAcc] = useState(0);
  const x = useMemo(() => makeImage(img, n, shift), [img, n, shift]);
  const m = Math.floor((n + 2 * p - 3) / s) + 1;
  const y = useMemo(() => Array.from({ length: m }, (_, i) => Array.from({ length: m }, (_, j) => {
    let v = 0;
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) {
      const r = i * s + a - p, c = j * s + b - p;
      if (r >= 0 && r < n && c >= 0 && c < n) v += K[a * 3 + b] * x[r][c];
    }
    return v / div;
  })), [x, K, div, p, s, m, n]);
  useFrame((dt) => {
    const t = acc + dt;
    if (t > 0.55) { setAcc(0); setIdx((k) => (k + 1) % (m * m)); } else setAcc(t);
  }, run);
  const cur = idx % (m * m), ci = Math.floor(cur / m), cj = cur % m;
  const N = n + 2 * p, cs = Math.min(13, 136 / N), ox = 6, oy = 22;
  const os = Math.min(13, 136 / m), qx = 178, qy = 22;
  const maxAbs = Math.max(1e-9, ...y.flat().map(Math.abs));
  const ks = 26, kx = 66, ky = 180;
  const tap = (k: number) => setK((old) => old.map((v, i) => (i === k ? Math.max(-4, Math.min(5, v + (minus ? -1 : 1))) : v)));
  const fmt = (v: number) => (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : v.toFixed(2));
  return (
    <div>
      <Stage w={320} h={262} label="A 3 by 3 kernel sliding over an image to produce an output feature map">
        <text x={ox} y={13} fontSize="9" fill="var(--fg)">input {n}×{n}{p ? `, padding ${p}` : ''}</text>
        {Array.from({ length: N * N }, (_, k) => {
          const r = Math.floor(k / N), c = k % N, ir = r - p, ic = c - p;
          const inside = ir >= 0 && ir < n && ic >= 0 && ic < n;
          return <rect key={k} x={ox + c * cs} y={oy + r * cs} width={cs - 0.6} height={cs - 0.6}
            fill={inside ? 'var(--fg)' : 'none'} fillOpacity={inside ? 0.08 + 0.8 * x[ir][ic] : 0}
            stroke={inside ? 'none' : 'var(--muted)'} strokeDasharray="2 1.5" strokeWidth={0.5} />;
        })}
        <rect x={ox + cj * s * cs - 1} y={oy + ci * s * cs - 1} width={3 * cs + 1.4} height={3 * cs + 1.4} fill="none" stroke={C[2]} strokeWidth={2} />
        <text x={qx} y={13} fontSize="9" fill="var(--fg)">output {m}×{m}</text>
        {y.map((row, i) => row.map((v, j) => <rect key={i + '-' + j} x={qx + j * os} y={qy + i * os} width={os - 0.6} height={os - 0.6}
          fill={v >= 0 ? C[1] : C[4]} fillOpacity={0.06 + 0.9 * Math.abs(v) / maxAbs} onClick={() => { setRun(false); setIdx(i * m + j); }} />))}
        <rect x={qx + cj * os - 1} y={qy + ci * os - 1} width={os + 1.4} height={os + 1.4} fill="none" stroke={C[2]} strokeWidth={2} />
        <text x={160} y={170} fontSize="8.5" textAnchor="middle" fill="var(--fg)">
          output size = ⌊(n + 2p − k)/s⌋ + 1 = ⌊({n} + {2 * p} − 3)/{s}⌋ + 1 = {m}
        </text>
        {K.map((v, k) => <g key={k} onClick={() => tap(k)} style={{ cursor: 'pointer' }}>
          <rect x={kx + (k % 3) * ks} y={ky + Math.floor(k / 3) * ks} width={ks - 2} height={ks - 2} rx={3}
            fill={v > 0 ? C[1] : v < 0 ? C[4] : 'var(--surface)'} fillOpacity={v ? 0.25 + 0.12 * Math.abs(v) : 1} stroke={C[2]} strokeWidth={1} />
          <text x={kx + (k % 3) * ks + ks / 2 - 1} y={ky + Math.floor(k / 3) * ks + ks / 2 + 3} fontSize="11" textAnchor="middle" fill="var(--fg)">{v}</text>
        </g>)}
        {div !== 1 && <text x={kx + 3 * ks + 4} y={ky + 1.5 * ks + 3} fontSize="10" fill="var(--fg)">× 1/{div}</text>}
        <text x={kx - 6} y={ky + 1.5 * ks - 4} fontSize="8" textAnchor="end" fill="var(--muted)">kernel K</text>
        <text x={kx - 6} y={ky + 1.5 * ks + 7} fontSize="8" textAnchor="end" fill="var(--muted)">(tap to edit)</text>
        <text x={180} y={ky + 30} fontSize="8.5" fill="var(--fg)">y[{ci},{cj}] = {fmt(y[ci]?.[cj] ?? 0)}</text>
        <text x={180} y={ky + 44} fontSize="7.5" fill="var(--muted)"><tspan fill={C[1]}>■ +</tspan>  <tspan fill={C[4]}>■ −</tspan>  (tap a cell)</text>
      </Stage>
      <Controls>
        <PlayPause running={run} set={setRun} />
        {(Object.keys(PRESETS) as Pre[]).map((k) => <Btn key={k} onClick={() => { setK(PRESETS[k][0]); setDiv(PRESETS[k][1]); }}>{NAMES[k]}</Btn>)}
        <Btn active={minus} onClick={() => setMinus(!minus)}>tap = {minus ? '−1' : '+1'}</Btn>
        {(['square', 'edge', 'diagonal', 'dot'] as Img[]).map((k) => <Btn key={k} active={k === img} onClick={() => setImg(k)}>{k}</Btn>)}
        <Btn active={shift > 0} onClick={() => setShift((v) => (v + 1) % 3)}>shift → ({shift})</Btn>
        <Slider label="padding p" min={0} max={2} step={1} value={p} onChange={(v) => { setP(v); setIdx(0); }} format={(v) => String(v)} />
        <Slider label="stride s" min={1} max={3} step={1} value={s} onChange={(v) => { setS(v); setIdx(0); }} format={(v) => String(v)} />
      </Controls>
    </div>
  );
}
