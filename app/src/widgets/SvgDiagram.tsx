/**
 * Hand-authored SVG diagram (static or CSS/SMIL-animated). Use when no
 * parameterised widget fits. Use CSS variables for colours (var(--fg), var(--c1)…).
 * props: { svg: string (full <svg …>…</svg> markup with a viewBox) }
 * Tip: SMIL like <animate attributeName="cx" values="10;80;10" dur="3s" repeatCount="indefinite"/> works well.
 */
export default function SvgDiagram({ svg = '' }: { svg?: string }) {
  return <div className="w-svg" dangerouslySetInnerHTML={{ __html: svg }} />;
}
