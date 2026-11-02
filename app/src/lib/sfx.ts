let ctx: AudioContext | null = null;
function tone(freqs: number[], dur = 0.12, type: OscillatorType = 'sine', gain = 0.08) {
  try {
    ctx ??= new AudioContext();
    let t = ctx.currentTime;
    for (const f of freqs) {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = type; o.frequency.value = f; g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur); t += dur * 0.8;
    }
  } catch { /* audio unavailable */ }
}
export const sfx = {
  correct: () => tone([660, 880], 0.12, 'triangle'),
  wrong: () => tone([220, 180], 0.16, 'square', 0.04),
  finish: () => tone([523, 659, 784, 1047], 0.14, 'triangle'),
};
export const buzz = (ms: number | number[]) => { try { navigator.vibrate?.(ms); } catch { /* noop */ } };
