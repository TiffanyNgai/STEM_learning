import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../widgets/_kit';

export function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const c = ref.current!; const ctx = c.getContext('2d')!;
    const dpr = devicePixelRatio || 1; c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.scale(dpr, dpr);
    const cols = ['#58cc02', '#1cb0f6', '#ffc800', '#ff4b4b', '#ce82ff', '#ff9600'];
    const ps = Array.from({ length: 140 }, () => ({ x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - 0.5) * 12, vy: -Math.random() * 12 - 4, r: Math.random() * 6 + 4, a: Math.random() * 6, c: cols[Math.floor(Math.random() * 6)] }));
    let raf = 0; const t0 = performance.now();
    const loop = (now: number) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const p of ps) { p.vy += 0.3; p.x += p.vx; p.y += p.vy; p.a += 0.15; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); }
      if (now - t0 < 3500) raf = requestAnimationFrame(loop); else ctx.clearRect(0, 0, innerWidth, innerHeight);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="confetti" style={{ width: '100vw', height: '100vh' }} />;
}
