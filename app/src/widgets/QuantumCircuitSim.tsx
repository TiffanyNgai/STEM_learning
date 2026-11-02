import { useMemo, useState } from 'react';
import { Btn, C, Controls, Stage, rng } from './_kit';

/**
 * Tiny state-vector simulator for 1–3 qubits. Tap a gate, then a qubit (or control→target pair) to append it.
 * Step through the circuit to watch the amplitudes: bar height = probability, little dial = phase of the amplitude.
 * "Sample" draws measurement shots (seeded) and overlays the histogram on the Born probabilities.
 * Basis labels are written |q0 q1 q2⟩ (q0 leftmost; note Qiskit prints the reverse order).
 * props: {
 *   qubits?: 1|2|3 (default 2),
 *   circuit?: string[] initial ops, e.g. ["H0", "CX01", "Z1"]  (gate letters + qubit indices;
 *            gates: H X Y Z S T (1 qubit), CX ab / CZ ab (control a, target b), SWAP ab),
 *   palette?: string[] gates offered for editing (default ['H','X','Z','S','T','CX']); [] = read-only,
 *   shots?: number per "Sample" press (default 200), seed?: number, stepMode?: boolean (start at step 0, default false)
 * }
 */
type Cx = [number, number];
const mul = (a: Cx, b: Cx): Cx => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const add = (a: Cx, b: Cx): Cx => [a[0] + b[0], a[1] + b[1]];
const s2 = Math.SQRT1_2;
const ONE: Record<string, [Cx, Cx, Cx, Cx]> = {
  H: [[s2, 0], [s2, 0], [s2, 0], [-s2, 0]], X: [[0, 0], [1, 0], [1, 0], [0, 0]], Y: [[0, 0], [0, -1], [0, 1], [0, 0]],
  Z: [[1, 0], [0, 0], [0, 0], [-1, 0]], S: [[1, 0], [0, 0], [0, 0], [0, 1]], T: [[1, 0], [0, 0], [0, 0], [s2, s2]],
};
interface Op { g: string; q: number[] }
function parse(s: string): Op | null {
  const m = /^(CX|CZ|SWAP|[HXYZST])(\d)(\d)?$/.exec(s.trim());
  return m ? { g: m[1], q: [+m[2], ...(m[3] !== undefined ? [+m[3]] : [])] } : null;
}
/** Bit of qubit q in basis index i (q0 is the most significant bit). */
const bit = (i: number, q: number, n: number) => (i >> (n - 1 - q)) & 1;
function applyOp(st: Cx[], op: Op, n: number): Cx[] {
  const out: Cx[] = st.map(() => [0, 0]);
  st.forEach((amp, i) => {
    if (op.g in ONE) {
      const q = op.q[0], b = bit(i, q, n), m = ONE[op.g], flip = i ^ (1 << (n - 1 - q));
      const i0 = b ? flip : i, i1 = b ? i : flip;
      out[i0] = add(out[i0], mul(m[b], amp)); // row 0, column b
      out[i1] = add(out[i1], mul(m[2 + b], amp)); // row 1, column b
    } else if (op.g === 'CX') {
      const j = bit(i, op.q[0], n) ? i ^ (1 << (n - 1 - op.q[1])) : i; out[j] = add(out[j], amp);
    } else if (op.g === 'CZ') {
      out[i] = add(out[i], bit(i, op.q[0], n) && bit(i, op.q[1], n) ? [-amp[0], -amp[1]] : amp);
    } else {
      const [a, b] = op.q, ba = bit(i, a, n), bb = bit(i, b, n);
      const j = ba === bb ? i : i ^ (1 << (n - 1 - a)) ^ (1 << (n - 1 - b)); out[j] = add(out[j], amp);
    }
  });
  return out;
}

export default function QuantumCircuitSim({ qubits = 2, circuit = [], palette = ['H', 'X', 'Z', 'S', 'T', 'CX'], shots = 200, seed = 3, stepMode = false }: {
  qubits?: number; circuit?: string[]; palette?: string[]; shots?: number; seed?: number; stepMode?: boolean;
}) {
  const n = Math.max(1, Math.min(3, Math.round(qubits)));
  const init = circuit.map(parse).filter((o): o is Op => !!o && o.q.every((q) => q < n));
  const [ops, setOps] = useState<Op[]>(init);
  const [step, setStep] = useState(stepMode ? 0 : init.length);
  const [sel, setSel] = useState(palette[0] ?? 'H');
  const [counts, setCounts] = useState<number[] | null>(null);
  const [sd, setSd] = useState(seed);
  const N = 1 << n;
  const states = useMemo(() => {
    const out: Cx[][] = [Array.from({ length: N }, (_, i) => (i === 0 ? [1, 0] : [0, 0]) as Cx)];
    ops.forEach((o) => out.push(applyOp(out[out.length - 1], o, n)));
    return out;
  }, [ops, n, N]);
  const st = states[Math.min(step, ops.length)];
  const probs = st.map(([a, b]) => a * a + b * b);
  const push = (o: Op) => { const no = [...ops, o]; setOps(no); setStep(no.length); setCounts(null); };
  const sample = () => {
    const r = rng(sd); setSd(sd + 1);
    const c = new Array(N).fill(0);
    for (let k = 0; k < shots; k++) { let u = r.u(), i = 0; while (i < N - 1 && u > probs[i]) { u -= probs[i]; i++; } c[i]++; }
    setCounts(c);
  };
  const two = sel === 'CX' || sel === 'CZ' || sel === 'SWAP';
  const targets: number[][] = two ? Array.from({ length: n }, (_, a) => Array.from({ length: n }, (_, b) => [a, b])).flat().filter(([a, b]) => a !== b) : Array.from({ length: n }, (_, a) => [a]);
  const colW = Math.min(30, 220 / Math.max(1, ops.length + 1));
  const wireY = (q: number) => 18 + q * 24;
  const barTop = 18 + n * 24 + 8, barH = 200 - barTop - 32, bw = Math.min(46, 280 / N);
  const label = (i: number) => '|' + Array.from({ length: n }, (_, q) => bit(i, q, n)).join('') + '⟩';
  return (
    <div>
      <Stage w={320} h={200} label="Quantum circuit and amplitude bars">
        {Array.from({ length: n }, (_, q) => (
          <g key={q}><text x={4} y={wireY(q) + 3} fontSize="9" fill="var(--muted)">q{q} |0⟩</text>
            <line x1={36} x2={312} y1={wireY(q)} y2={wireY(q)} stroke="var(--fg)" strokeWidth={0.8} /></g>
        ))}
        {ops.map((o, k) => {
          const x = 48 + k * colW + colW / 2, done = k < step;
          const op = done ? 1 : 0.35;
          if (o.g in ONE) return (
            <g key={k} opacity={op}><rect x={x - 9} y={wireY(o.q[0]) - 9} width={18} height={18} rx={3} fill="var(--surface)" stroke={C[1]} />
              <text x={x} y={wireY(o.q[0]) + 3.5} fontSize="10" textAnchor="middle" fill="var(--fg)">{o.g}</text></g>);
          const [a, b] = o.q;
          return (
            <g key={k} opacity={op} stroke={C[1]} fill={C[1]}>
              <line x1={x} x2={x} y1={wireY(a)} y2={wireY(b)} strokeWidth={1.5} />
              {o.g === 'SWAP' ? [a, b].map((q) => <text key={q} x={x} y={wireY(q) + 4} fontSize="12" textAnchor="middle" stroke="none">×</text>)
                : <><circle cx={x} cy={wireY(a)} r={3.5} />
                  {o.g === 'CX' ? <><circle cx={x} cy={wireY(b)} r={7} fill="var(--surface)" /><line x1={x - 7} x2={x + 7} y1={wireY(b)} y2={wireY(b)} /><line x1={x} x2={x} y1={wireY(b) - 7} y2={wireY(b) + 7} /></>
                    : <circle cx={x} cy={wireY(b)} r={3.5} />}</>}
            </g>);
        })}
        <line x1={48 + step * colW} x2={48 + step * colW} y1={6} y2={wireY(n - 1) + 12} stroke={C[2]} strokeDasharray="3 2" />
        {st.map(([re, im], i) => {
          const x = 20 + i * (280 / N) + (280 / N - bw) / 2, h = probs[i] * barH, y0 = barTop + barH;
          const ph = Math.atan2(im, re), cx = x + bw / 2, cy = y0 + 22;
          const f = counts ? counts[i] / shots : null;
          return (
            <g key={i}>
              <rect x={x} y={barTop} width={bw} height={barH} fill="var(--grid)" opacity={0.4} />
              <rect x={x} y={y0 - h} width={bw} height={h} fill={C[1]} opacity={0.85} />
              {f !== null && <rect x={x + bw * 0.3} y={y0 - f * barH} width={bw * 0.4} height={f * barH} fill={C[2]} />}
              <text x={cx} y={y0 - h - 2} fontSize="8" textAnchor="middle" fill="var(--fg)">{probs[i] > 0.005 ? probs[i].toFixed(2) : ''}</text>
              <text x={cx} y={y0 + 9} fontSize="8.5" textAnchor="middle" fill="var(--fg)">{label(i)}</text>
              {probs[i] > 0.005 && <g><circle cx={cx} cy={cy} r={6} fill="none" stroke="var(--muted)" strokeWidth={0.7} />
                <line x1={cx} y1={cy} x2={cx + 6 * Math.cos(ph)} y2={cy - 6 * Math.sin(ph)} stroke={C[3]} strokeWidth={1.6} /></g>}
            </g>);
        })}
        {counts && <text x={312} y={barTop + 6} fontSize="8" textAnchor="end" fill={C[2]}>{shots} shots</text>}
      </Stage>
      <Controls>
        <Btn onClick={() => setStep(Math.max(0, step - 1))}>◀</Btn>
        <span className="w-muted">step {step}/{ops.length}</span>
        <Btn onClick={() => setStep(Math.min(ops.length, step + 1))}>▶</Btn>
        <Btn onClick={sample}>Sample {shots}</Btn>
        {palette.length > 0 && <>
          <Btn onClick={() => { const no = ops.slice(0, -1); setOps(no); setStep(no.length); setCounts(null); }}>Undo</Btn>
          <Btn onClick={() => { setOps(init); setStep(init.length); setCounts(null); }}>Reset</Btn>
        </>}
      </Controls>
      {palette.length > 0 && <Controls>
        {palette.map((g) => <Btn key={g} active={g === sel} onClick={() => setSel(g)}>{g}</Btn>)}
        <span className="w-muted">on</span>
        {targets.map((t) => <Btn key={t.join()} onClick={() => ops.length < 12 && push({ g: sel, q: t })}>{t.length > 1 ? `q${t[0]}→q${t[1]}` : `q${t[0]}`}</Btn>)}
      </Controls>}
    </div>
  );
}
