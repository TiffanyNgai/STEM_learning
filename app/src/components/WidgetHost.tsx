import { Component, Suspense, type ReactNode } from 'react';
import type { WidgetSpec } from '../content/types';
import { Rich } from '../lib/Rich';
import { getWidget } from '../widgets/registry';

class Boundary extends Component<{ children: ReactNode; name: string }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  componentDidCatch(e: unknown) { console.error(`Widget ${this.props.name} crashed`, e); }
  render() { return this.state.err ? <div className="w-muted">This visual failed to load.</div> : this.props.children; }
}

export function WidgetHost({ spec }: { spec: WidgetSpec }) {
  const W = getWidget(spec.type);
  return (
    <figure className="widget-box" style={{ margin: '12px 0' }}>
      <Boundary name={spec.type}>
        <Suspense fallback={<div className="w-muted" style={{ minHeight: 120 }}>Loading visual…</div>}>
          {W ? <W {...(spec.props ?? {})} /> : <div className="w-muted">Unknown visual “{spec.type}”.</div>}
        </Suspense>
      </Boundary>
      {spec.caption && <figcaption className="widget-caption"><Rich text={spec.caption} /></figcaption>}
    </figure>
  );
}
