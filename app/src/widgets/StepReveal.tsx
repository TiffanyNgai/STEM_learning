import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Rich } from '../lib/Rich';
import { Btn, Controls } from './_kit';

/**
 * Reveal a derivation / proof / algorithm one step at a time.
 * props: { steps: string[] (Rich), notes?: string[] (Rich, same length, optional side-comments) }
 */
export default function StepReveal({ steps = [], notes = [] }: { steps?: string[]; notes?: string[] }) {
  const [n, setN] = useState(1);
  return (
    <div className="w-steps">
      <AnimatePresence initial={false}>
        {steps.slice(0, n).map((s, i) => (
          <motion.div key={i} className={'w-step' + (i === n - 1 ? ' current' : '')}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <span className="w-step-n">{i + 1}</span>
            <div><Rich text={s} />{notes[i] && <Rich className="w-step-note" text={notes[i]} />}</div>
          </motion.div>
        ))}
      </AnimatePresence>
      <Controls>
        <Btn onClick={() => setN((v) => Math.max(1, v - 1))}>◀ Back</Btn>
        <span className="w-muted">{n} / {steps.length}</span>
        <Btn onClick={() => setN((v) => Math.min(steps.length, v + 1))}>Next ▶</Btn>
      </Controls>
    </div>
  );
}
