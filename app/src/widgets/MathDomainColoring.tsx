import { useEffect, useMemo, useRef, useState, type PointerEvent as PE } from 'react';
import { Btn, Controls, Slider, useFrame } from './_kit';

/**
 * Domain colouring (phase portrait) of a complex function f, in the style of Wegert's
 * "Visual Complex Functions". Each point z of the square [−range, range]² is painted by the value
 * f(z): HUE = arg f(z) (red = positive real, then yellow, green, cyan = negative real, blue, magenta
 * going counter-clockwise), BRIGHTNESS = |f(z)| (black at zeros, white at poles, mid-tone where |f| = 1).
 * "contours" adds Wegert-style bands where |f| doubles. "spin phase" multiplies f by e^{−it}: the colours
 * flow anticlockwise round a zero and clockwise round a pole. Tap the picture to read off z and f(z).
 * props: { fn?: preset key — 'z' | 'z2' | 'z3' | 'z3-1' | 'inv' | 'zero-pole' | 'exp' | 'sin' | 'mobius' | 'conj' | 'essential'
 *          (default 'z'), presets?: string[] (preset buttons to show, default ['z','z2','z3-1','inv','zero-pole','exp','sin']),
 *          range?: number (default 2.5), contours?: boolean (default false), res?: number (pixels per side, default 180) }
 */
type Cx = [number, number];
const mul = (a: Cx, b: Cx): Cx => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const div = (a: Cx, b: Cx): Cx => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
const cexp = (a: Cx): Cx => { const r = Math.exp(a[0]); return [r * Math.cos(a[1]), r * Math.sin(a[1])]; };

const FNS: Record<string, { label: string; f: (z: Cx) => Cx }> = {
  z: { label: 'z', f: (z) => z },
  z2: { label: 'z²', f: (z) => mul(z, z) },
  z3: { label: 'z³', f: (z) => mul(z, mul(z, z)) },
  'z3-1': { label: 'z³ − 1', f: (z) => { const c = mul(z, mul(z, z)); return [c[0] - 1, c[1]]; } },
  inv: { label: '1/z', f: (z) => div([1, 0], z) },
  'zero-pole': { label: '(z−1)/(z+1)²', f: (z) => { const p: Cx = [z[0] + 1, z[1]]; return div([z[0] - 1, z[1]], mul(p, p)); } },
  exp: { label: 'eᶻ', f: cexp },
  sin: { label: 'sin z', f: (z) => [Math.sin(z[0]) * Math.cosh(z[1]), Math.cos(z[0]) * Math.sinh(z[1])] },
  mobius: { label: '(z−i)/(z+i)', f: (z) => div([z[0], z[1] - 1], [z[0], z[1] + 1]) },
  conj: { label: 'z̄ (not holomorphic)', f: (z) => [z[0], -z[1]] },
  essential: { label: 'e^(1/z)', f: (z) => cexp(div([1, 0], z)) },
};

function hsl(h: number, l: number): [number, number, number] {
  // h in [0,1), s = 1
  const q = l < 0.5 ? l * 2 : 1;
  const p = 2 * l - q;
  const t = (x: number) => { x = ((x % 1) + 1) % 1; return x < 1 / 6 ? p + (q - p) * 6 * x : x < 0.5 ? q : x < 2 / 3 ? p + (q - p) * (2 / 3 - x) * 6 : p; };
  return [t(h + 1 / 3) * 255, t(h) * 255, t(h - 1 / 3) * 255];
}

export default function MathDomainColoring({ fn = 'z', presets = ['z', 'z2', 'z3-1', 'inv', 'zero-pole', 'exp', 'sin'], range: r0 = 2.5, contours = false, res = 180 }: {
  fn?: string; presets?: string[]; range?: number; contours?: boolean; res?: number;
}) {
  const [key, setKey] = useState(FNS[fn] ? fn : 'z');
  const [range, setRange] = useState(r0);
  const [bands, setBands] = useState(contours);
  const [spin, setSpin] = useState(false);
  const [phase, setPhase] = useState(0);
  const [probe, setProbe] = useState<Cx | null>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const N = Math.max(60, Math.min(320, Math.round(res)));
  useFrame((dt) => setPhase((p) => (p + dt * 0.8) % (2 * Math.PI)), spin);

  const vals = useMemo(() => {
    const f = FNS[key].f;
    const out = new Float64Array(N * N * 2);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const z: Cx = [-range + ((i + 0.5) / N) * 2 * range, range - ((j + 0.5) / N) * 2 * range];
      const w = f(z);
      out[2 * (j * N + i)] = w[0]; out[2 * (j * N + i) + 1] = w[1];
    }
    return out;
  }, [key, range, N]);

  useEffect(() => {
    const c = cv.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const img = ctx.createImageData(N, N);
    const cp = Math.cos(phase), sp = -Math.sin(phase);
    for (let k = 0; k < N * N; k++) {
      let a = vals[2 * k], b = vals[2 * k + 1];
      [a, b] = [a * cp - b * sp, a * sp + b * cp];
      const m = Math.hypot(a, b);
      let R = 255, G = 255, B = 255;
      if (Number.isFinite(m)) {
        const h = (Math.atan2(b, a) / (2 * Math.PI) + 1) % 1;
        let l = 0.06 + 0.88 * (2 / Math.PI) * Math.atan(m);
        if (bands && m > 0) { const fr = Math.log2(m) - Math.floor(Math.log2(m)); l *= 0.78 + 0.22 * fr; }
        [R, G, B] = hsl(h, l);
      }
      img.data[4 * k] = R; img.data[4 * k + 1] = G; img.data[4 * k + 2] = B; img.data[4 * k + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    // axes
    ctx.strokeStyle = 'rgba(128,128,128,0.55)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, N / 2); ctx.lineTo(N, N / 2); ctx.moveTo(N / 2, 0); ctx.lineTo(N / 2, N); ctx.stroke();
    if (probe) {
      const px = ((probe[0] + range) / (2 * range)) * N, py = ((range - probe[1]) / (2 * range)) * N;
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, 4, 0, 2 * Math.PI); ctx.stroke();
      ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(px, py, 4, 0, 2 * Math.PI); ctx.stroke();
    }
  }, [vals, phase, bands, probe, N, range]);

  const onTap = (e: PE<HTMLCanvasElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    const x = -range + ((e.clientX - b.left) / b.width) * 2 * range;
    const y = range - ((e.clientY - b.top) / b.height) * 2 * range;
    setProbe([x, y]);
  };
  const fz = probe ? FNS[key].f(probe) : null;
  const f2 = (v: number) => (Math.abs(v) > 999 ? v.toExponential(1) : v.toFixed(2));
  const cs = (a: Cx) => `${f2(a[0])} ${a[1] < 0 ? '−' : '+'} ${f2(Math.abs(a[1]))}i`;
  const wheel = Array.from({ length: 24 }, (_, k) => {
    const a0 = (k / 24) * 2 * Math.PI, a1 = ((k + 1) / 24) * 2 * Math.PI;
    const [R, G, B] = hsl(k / 24 + 1 / 48, 0.5);
    const P = (a: number, rr: number) => `${(20 + rr * Math.cos(a)).toFixed(2)},${(20 - rr * Math.sin(a)).toFixed(2)}`;
    return <path key={k} d={`M${P(a0, 9)}L${P(a0, 18)}L${P(a1, 18)}L${P(a1, 9)}Z`} fill={`rgb(${R | 0},${G | 0},${B | 0})`} />;
  });
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 280 }}>
          <canvas ref={cv} width={N} height={N} onPointerDown={onTap} onPointerMove={(e) => e.buttons && onTap(e)}
            role="img" aria-label={`Domain colouring of f(z) = ${FNS[key].label}`}
            style={{ width: '100%', aspectRatio: '1 / 1', display: 'block', borderRadius: 6, touchAction: 'none', cursor: 'crosshair' }} />
          <span style={{ position: 'absolute', right: 4, bottom: 2, fontSize: 10, color: '#fff', textShadow: '0 0 2px #000' }}>Re ±{range}</span>
        </div>
        <svg viewBox="0 0 40 74" style={{ width: 52, flex: 'none' }} aria-label="colour key: hue is the argument">
          {wheel}
          <text x="20" y="48" fontSize="6.5" textAnchor="middle" fill="var(--fg)">hue =</text>
          <text x="20" y="56" fontSize="6.5" textAnchor="middle" fill="var(--fg)">arg f</text>
          <text x="20" y="67" fontSize="5.5" textAnchor="middle" fill="var(--muted)">red: f &gt; 0</text>
        </svg>
      </div>
      <div className="w-muted" style={{ textAlign: 'center', marginTop: 4 }}>
        f(z) = {FNS[key].label}
        {probe && fz && <> · z = {cs(probe)} → f = {cs(fz)}, |f| = {f2(Math.hypot(fz[0], fz[1]))}, arg = {Math.round((Math.atan2(fz[1], fz[0]) * 180) / Math.PI)}°</>}
        {!probe && <> · tap to probe</>}
      </div>
      <Controls>
        {presets.filter((p) => FNS[p]).map((p) => <Btn key={p} active={p === key} onClick={() => setKey(p)}>{FNS[p].label}</Btn>)}
        <Btn active={bands} onClick={() => setBands(!bands)}>|f| contours</Btn>
        <Btn active={spin} onClick={() => setSpin(!spin)}>{spin ? '⏸ spin phase' : '▶ spin phase'}</Btn>
        <Slider label="range" min={0.5} max={6} step={0.25} value={range} onChange={setRange} />
      </Controls>
    </div>
  );
}
