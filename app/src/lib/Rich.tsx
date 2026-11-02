import katex from 'katex';
import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

function tex(src: string, display: boolean, key: string | number) {
  const html = katex.renderToString(src, { displayMode: display, throwOnError: false, strict: 'ignore' });
  return display
    ? <div key={key} className="tex-display" dangerouslySetInnerHTML={{ __html: html }} />
    : <span key={key} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Inline formatting: $tex$, **bold**, *italic*, `code`, [text](@subject/lesson) or [text](https://...). */
export function inline(s: string, kp = ''): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\$[^$]+\$)|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)|(`[^`]+`)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0; let m: RegExpExecArray | null; let i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const t = m[0]; const k = kp + i++;
    if (m[1]) out.push(tex(t.slice(1, -1), false, k));
    else if (m[2]) out.push(<strong key={k}>{inline(t.slice(2, -2), k + 'b')}</strong>);
    else if (m[3]) out.push(<em key={k}>{inline(t.slice(1, -1), k + 'i')}</em>);
    else if (m[4]) out.push(<code key={k}>{t.slice(1, -1)}</code>);
    else {
      const [, text, href] = /\[([^\]]+)\]\(([^)]+)\)/.exec(t)!;
      out.push(href.startsWith('@')
        ? <Link key={k} className="lesson-link" to={`/lesson/${href.slice(1)}?peek=1`}>{text} ↗</Link>
        : /^https?:\/\//i.test(href)
          ? <a key={k} href={href} target="_blank" rel="noopener noreferrer">{text}</a>
          : text);
    }
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

/** Block-level renderer for the Rich markdown dialect (see content/types.ts). */
export function Rich({ text, className }: { text: string; className?: string }) {
  const blocks: ReactNode[] = [];
  // split out $$display$$ first
  const parts = text.split(/(\$\$[\s\S]+?\$\$)/g);
  parts.forEach((part, pi) => {
    if (part.startsWith('$$')) { blocks.push(tex(part.slice(2, -2).trim(), true, 'd' + pi)); return; }
    const paras = part.split(/\n\s*\n/);
    paras.forEach((para, qi) => {
      const lines = para.split('\n').filter((l) => l.trim() !== '');
      if (!lines.length) return;
      const key = `${pi}-${qi}`;
      // group consecutive lines of the same type so lists/callouts may follow text without a blank line
      const kind = (l: string) => (/^\s*[-•] /.test(l) ? 'ul' : /^\s*\d+[.)] /.test(l) ? 'ol' : l.startsWith('>') ? 'q' : l.startsWith('### ') ? 'h' : 'p');
      const runs: { k: string; ls: string[] }[] = [];
      for (const l of lines) {
        const k = kind(l);
        if (k !== 'h' && runs.length && runs[runs.length - 1].k === k) runs[runs.length - 1].ls.push(l);
        else runs.push({ k, ls: [l] });
      }
      runs.forEach(({ k, ls }, ri) => {
        const rk = `${key}-${ri}`;
        const joined = (strip: RegExp) => ls.map((l, j) => <Fragment key={j}>{j > 0 && <br />}{inline(l.replace(strip, ''), rk + j)}</Fragment>);
        if (k === 'ul') blocks.push(<ul key={rk}>{ls.map((l, j) => <li key={j}>{inline(l.replace(/^\s*[-•] /, ''), rk + j)}</li>)}</ul>);
        else if (k === 'ol') blocks.push(<ol key={rk} start={parseInt(ls[0], 10) || 1}>{ls.map((l, j) => <li key={j}>{inline(l.replace(/^\s*\d+[.)] /, ''), rk + j)}</li>)}</ol>);
        else if (k === 'h') blocks.push(<h4 key={rk}>{inline(ls[0].slice(4), rk)}</h4>);
        else if (k === 'q') blocks.push(<div key={rk} className="callout">{joined(/^>\s?/)}</div>);
        else blocks.push(<p key={rk}>{joined(/^$/)}</p>);
      });
    });
  });
  return <div className={'rich ' + (className ?? '')}>{blocks}</div>;
}
