/**
 * Hand-built SVG diagrams for stats lessons (used via the generic SvgDiagram widget).
 * Lives outside lessons/ so the lesson loader does not treat it as a lesson.
 */
const T = (x: number, y: number, s: string, extra = '') =>
  `<text x="${x}" y="${y}" font-size="10" fill="var(--fg)" ${extra}>${s}</text>`;
const svg = (w: number, h: number, body: string) =>
  `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit">${body}</svg>`;

/** Die-roll Venn diagram: A = even, B = {4,5,6}; optionally pulse the overlap A∩B. */
export function dieVenn(pulseOverlap = false) {
  const lens = 'M160,42.57 A55,55 0 0,1 160,127.43 A55,55 0 0,1 160,42.57 Z';
  return svg(320, 170, `
    <rect x="8" y="8" width="304" height="154" rx="8" fill="none" stroke="var(--muted)"/>
    ${T(16, 24, 'Ω (all outcomes)', 'fill="var(--muted)"')}
    <circle cx="125" cy="85" r="55" fill="var(--c2)" fill-opacity="0.18" stroke="var(--c2)" stroke-width="1.5"/>
    <circle cx="195" cy="85" r="55" fill="var(--c3)" fill-opacity="0.18" stroke="var(--c3)" stroke-width="1.5"/>
    ${pulseOverlap ? `<path d="${lens}" fill="var(--c5)" opacity="0.5"><animate attributeName="opacity" values="0.15;0.6;0.15" dur="2.4s" repeatCount="indefinite"/></path>` : ''}
    ${T(78, 40, 'A = even', 'fill="var(--c2)"')}${T(200, 40, 'B = {4,5,6}', 'fill="var(--c3)"')}
    ${T(98, 90, '2', 'font-size="14"')}${T(156, 74, '4', 'font-size="14"')}${T(156, 108, '6', 'font-size="14"')}
    ${T(218, 90, '5', 'font-size="14"')}${T(36, 60, '1', 'font-size="14"')}${T(282, 140, '3', 'font-size="14"')}
    ${pulseOverlap ? T(122, 156, 'A ∩ B = {4, 6}', 'fill="var(--c5)"') : ''}`);
}

/** 6×6 grid of two-dice outcomes; cells with the given sum are highlighted. */
export function diceGrid(target = 7) {
  let cells = '';
  for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) {
    const x = 70 + (j - 1) * 28, y = 22 + (i - 1) * 26, hit = i + j === target;
    cells += `<rect x="${x}" y="${y}" width="26" height="24" rx="3" fill="${hit ? 'var(--c3)' : 'var(--grid)'}" fill-opacity="${hit ? 0.85 : 0.6}"/>`;
    cells += `<text x="${x + 13}" y="${y + 16}" font-size="9" text-anchor="middle" fill="var(--fg)">${i + j}</text>`;
  }
  let heads = '';
  for (let k = 1; k <= 6; k++) {
    heads += T(70 + (k - 1) * 28 + 13, 17, String(k), 'text-anchor="middle" fill="var(--muted)"');
    heads += T(60, 22 + (k - 1) * 26 + 16, String(k), 'text-anchor="middle" fill="var(--muted)"');
  }
  return svg(320, 186, `${cells}${heads}
    ${T(140, 10, 'second die →', 'font-size="9" fill="var(--muted)"')}
    ${T(10, 100, 'first', 'font-size="9" fill="var(--muted)"')}${T(10, 111, 'die ↓', 'font-size="9" fill="var(--muted)"')}
    ${T(242, 80, `sum = ${target}:`, 'fill="var(--c3)"')}${T(242, 94, '6 of 36 cells', 'fill="var(--c3)"')}`);
}

/** Conditioning as zooming in: everything outside B fades away. */
export function conditionalZoom() {
  return svg(320, 180, `
    <rect x="8" y="8" width="304" height="144" rx="8" fill="var(--grid)" fill-opacity="0.4" stroke="var(--muted)"/>
    <circle cx="130" cy="80" r="50" fill="var(--c2)" fill-opacity="0.25" stroke="var(--c2)" stroke-width="1.5"/>
    <circle cx="190" cy="80" r="55" fill="var(--c3)" fill-opacity="0.15" stroke="var(--c3)" stroke-width="2"/>
    <path fill-rule="evenodd" d="M8,8 H312 V152 H8 Z M135,80 a55,55 0 1,0 110,0 a55,55 0 1,0 -110,0 Z" fill="var(--surface, #fff)" opacity="0">
      <animate attributeName="opacity" values="0;0;0.85;0.85;0" keyTimes="0;0.25;0.45;0.9;1" dur="5s" repeatCount="indefinite"/>
    </path>
    ${T(80, 40, 'A', 'fill="var(--c2)" font-size="12"')}${T(232, 40, 'B', 'fill="var(--c3)" font-size="12"')}
    ${T(16, 24, 'Ω', 'fill="var(--muted)"')}
    ${T(160, 172, 'P(A | B) = P(A ∩ B) / P(B): B becomes the new Ω', 'text-anchor="middle"')}`);
}

/** Probability tree for a diagnostic test. */
export function testTree(prev = 0.01, sens = 0.9, spec = 0.95) {
  const f = (x: number) => +x.toPrecision(3);
  const line = (x1: number, y1: number, x2: number, y2: number, lab: string, c = 'var(--muted)') =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="1.5"/>` +
    T((x1 + x2) / 2 - 4, (y1 + y2) / 2 - 3, lab, 'font-size="9" text-anchor="end" fill="var(--muted)"');
  return svg(320, 200, `
    ${line(18, 100, 96, 50, String(f(prev)))}${line(18, 100, 96, 150, String(f(1 - prev)))}
    ${line(120, 50, 186, 22, String(f(sens)), 'var(--c5)')}${line(120, 50, 186, 74, String(f(1 - sens)))}
    ${line(120, 150, 186, 126, String(f(1 - spec)), 'var(--c3)')}${line(120, 150, 186, 178, String(f(spec)))}
    <circle cx="14" cy="100" r="4" fill="var(--fg)"/>
    ${T(98, 54, 'D')}${T(98, 154, 'no D')}
    ${T(190, 26, '+  D and +: ' + f(prev * sens), 'fill="var(--c5)"')}
    ${T(190, 78, '−  D and −: ' + f(prev * (1 - sens)))}
    ${T(190, 130, '+  no D and +: ' + f((1 - prev) * (1 - spec)), 'fill="var(--c3)"')}
    ${T(190, 182, '−  no D and −: ' + f((1 - prev) * spec))}`);
}

/** Three coin flips mapped to X = number of heads (a random variable is a function). */
export function coinsToX() {
  const outs = ['HHH', 'HHT', 'HTH', 'THH', 'HTT', 'THT', 'TTH', 'TTT'];
  const yOf: Record<number, number> = { 3: 24, 2: 70, 1: 124, 0: 170 };
  const col = ['var(--c6)', 'var(--c2)', 'var(--c3)', 'var(--c5)'];
  let body = T(40, 10, 'outcome ω', 'font-size="9" fill="var(--muted)"') + T(232, 10, 'X(ω) = # heads', 'font-size="9" fill="var(--muted)"');
  outs.forEach((o, i) => {
    const y = 24 + i * 21, k = [...o].filter((c) => c === 'H').length;
    body += T(40, y + 4, o, 'font-family="monospace"');
    body += `<line x1="76" y1="${y}" x2="240" y2="${yOf[k]}" stroke="${col[k]}" stroke-width="1.3" opacity="0.8">
      <animate attributeName="stroke-dasharray" values="0 300;300 0" dur="1.5s" begin="${i * 0.2}s" fill="freeze"/></line>`;
  });
  [0, 1, 2, 3].forEach((k) => {
    body += `<circle cx="252" cy="${yOf[k]}" r="10" fill="${col[k]}" fill-opacity="0.25" stroke="${col[k]}"/>` + T(252, yOf[k] + 4, String(k), 'text-anchor="middle" font-size="11"');
  });
  return svg(320, 196, body);
}

/** pmf as weights on a beam; the mean is the balance point. */
export function seesaw() {
  const p = [0.1, 0.4, 0.3, 0.1, 0.1];
  const x = (v: number) => 50 + v * 55;
  let body = `<line x1="30" y1="150" x2="290" y2="150" stroke="var(--fg)" stroke-width="3"/>`;
  p.forEach((q, v) => {
    body += `<rect x="${x(v) - 12}" y="${150 - q * 280}" width="24" height="${q * 280}" fill="var(--c2)" opacity="0.75"/>`;
    body += T(x(v), 164, String(v), 'text-anchor="middle"') + T(x(v), 145 - q * 280, String(q), 'text-anchor="middle" font-size="9" fill="var(--muted)"');
  });
  const m = x(1.7);
  body += `<path d="M${m},152 l-10,22 h20 z" fill="var(--c5)"/>` + T(m + 14, 186, 'E[X] = 1.7 (balance point)', 'fill="var(--c5)"');
  return svg(320, 196, body);
}

/** Bell curve with 68–95–99.7 bands. */
export function empiricalRule() {
  const sx = (z: number) => 160 + z * 40, sy = (z: number) => 160 - 120 * Math.exp(-z * z / 2);
  const area = (a: number, b: number) => {
    let d = `M${sx(a)},160`;
    for (let i = 0; i <= 40; i++) { const z = a + ((b - a) * i) / 40; d += `L${sx(z).toFixed(1)},${sy(z).toFixed(1)}`; }
    return d + `L${sx(b)},160Z`;
  };
  let curve = '';
  for (let i = 0; i <= 80; i++) { const z = -3.6 + (7.2 * i) / 80; curve += `${i ? 'L' : 'M'}${sx(z).toFixed(1)},${sy(z).toFixed(1)}`; }
  const band = (k: number, op: number, delay: number) =>
    `<path d="${area(-k, k)}" fill="var(--c2)" opacity="0"><animate attributeName="opacity" values="0;${op}" dur="0.6s" begin="${delay}s" fill="freeze"/></path>`;
  const brace = (k: number, y: number, lab: string) =>
    `<line x1="${sx(-k)}" x2="${sx(k)}" y1="${y}" y2="${y}" stroke="var(--fg)" stroke-width="1"/>` + T(160, y - 3, lab, 'text-anchor="middle" font-size="9"');
  let ticks = '';
  for (let k = -3; k <= 3; k++) ticks += T(sx(k), 172, k === 0 ? 'μ' : `${k > 0 ? '+' : '−'}${Math.abs(k)}σ`, 'text-anchor="middle" font-size="9" fill="var(--muted)"');
  return svg(320, 214, `${band(3, 0.15, 1.2)}${band(2, 0.25, 0.6)}${band(1, 0.4, 0)}
    <path d="${curve}" fill="none" stroke="var(--c2)" stroke-width="2"/>
    <line x1="10" x2="310" y1="160" y2="160" stroke="var(--fg)"/>${ticks}
    ${brace(1, 184, '68% within ±1σ')}${brace(2, 197, '95% within ±2σ')}${brace(3, 210, '99.7% within ±3σ')}`);
}

/** Galton board: balls bounce left/right at each peg and pile into a bell shape. */
export function galtonBoard() {
  const R = 8, dx = 22, top = 18, dy = 15;
  const px = (r: number, k: number) => 160 + (k - r / 2) * dx;
  let pegs = '';
  for (let r = 0; r < R; r++) for (let k = 0; k <= r; k++) pegs += `<circle cx="${px(r, k)}" cy="${top + r * dy}" r="2.2" fill="var(--muted)"/>`;
  const C = [1, 8, 28, 56, 70, 56, 28, 8, 1];
  let bins = '';
  C.forEach((c, k) => { const h = (c / 70) * 52; bins += `<rect x="${px(R, k) - 9}" y="${190 - h}" width="18" height="${h}" fill="var(--c3)" opacity="0.7"/>`; });
  const paths = ['RLRRLLRL', 'LLRLRRLR', 'RRRLRLRR', 'LRLLLRLL', 'RLLRRLRL'];
  let balls = '';
  paths.forEach((p, i) => {
    let k = 0; let d = `M${px(0, 0)},${top - 8}`;
    for (let r = 0; r < R; r++) { if (p[r] === 'R') k++; d += ` L${px(r + 1, k)},${top + r * dy + 7}`; }
    d += ` L${px(R, k)},${178}`;
    balls += `<circle r="4" fill="var(--c5)"><animateMotion path="${d}" dur="2.6s" begin="${i * 0.55}s" repeatCount="indefinite"/></circle>`;
  });
  return svg(320, 200, `${pegs}${bins}${balls}<line x1="60" x2="260" y1="190" y2="190" stroke="var(--fg)"/>
    ${T(8, 30, 'each peg:', 'font-size="9" fill="var(--muted)"')}${T(8, 42, 'left or right,', 'font-size="9" fill="var(--muted)"')}${T(8, 54, '50/50', 'font-size="9" fill="var(--muted)"')}
    ${T(250, 120, 'final slot =', 'font-size="9" fill="var(--muted)"')}${T(250, 132, 'sum of 8', 'font-size="9" fill="var(--muted)"')}${T(250, 144, 'random steps', 'font-size="9" fill="var(--muted)"')}`);
}

/** Population → many samples → many sample means → a histogram (the sampling distribution). */
export function samplingPipeline() {
  const pop = Array.from({ length: 40 }, (_, i) => {
    const a = i * 2.4, r = 6 + (i % 7) * 4;
    return `<circle cx="${(45 + r * Math.cos(a)).toFixed(1)}" cy="${(95 + r * Math.sin(a)).toFixed(1)}" r="2" fill="var(--c2)"/>`;
  }).join('');
  const means = ['5.3', '4.8', '5.1'];
  let s = '';
  means.forEach((m, i) => {
    const y = 30 + i * 60;
    s += `<line x1="80" y1="95" x2="118" y2="${y + 12}" stroke="var(--muted)"/>`;
    s += `<rect x="120" y="${y}" width="62" height="24" rx="4" fill="var(--grid)" stroke="var(--muted)"/>` + T(151, y + 16, `x̄ = ${m}`, 'text-anchor="middle" font-size="9"');
    s += `<line x1="184" y1="${y + 12}" x2="222" y2="${150 - i * 4}" stroke="var(--muted)" stroke-dasharray="2 2"/>`;
  });
  const hist = [2, 6, 13, 18, 13, 6, 2].map((h, i) => `<rect x="${226 + i * 12}" y="${160 - h * 4}" width="11" height="${h * 4}" fill="var(--c5)" opacity="0.75"/>`).join('');
  return svg(320, 202, `${pop}${s}${hist}<line x1="222" x2="314" y1="160" y2="160" stroke="var(--fg)"/>
    ${T(45, 150, 'population', 'text-anchor="middle" font-size="9" fill="var(--muted)"')}${T(45, 161, '(μ, σ unknown)', 'text-anchor="middle" font-size="9" fill="var(--muted)"')}
    ${T(151, 20, 'samples of size n', 'text-anchor="middle" font-size="9" fill="var(--muted)"')}
    ${T(268, 176, 'histogram of x̄', 'text-anchor="middle" font-size="9" fill="var(--muted)"')}${T(268, 188, '= sampling distribution', 'text-anchor="middle" font-size="9" fill="var(--muted)"')}
    ${T(151, 196, '… repeat many times', 'text-anchor="middle" font-size="9" fill="var(--muted)"')}`);
}
