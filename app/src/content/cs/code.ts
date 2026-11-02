/**
 * Helper for writing multi-line code inside Rich text (which has no code-fence syntax).
 * Each source line becomes an inline `code` span on its own line; leading spaces become
 * non-breaking spaces so indentation survives HTML whitespace collapsing.
 * Do not use backticks inside the code.
 */
export const code = (src: string): string =>
  src
    .replace(/^\n+|\s+$/g, '')
    .split('\n')
    .map((l) => '`' + (l.replace(/^ +/, (s) => ' '.repeat(s.length)) || ' ') + '`')
    .join('\n');

/**
 * Tagged template = String.raw (so TeX backslashes need no escaping) where `§` stands for a
 * backtick, so inline code can be written as §x = 1§. Never write "${" except for interpolation.
 */
export const R = (s: TemplateStringsArray, ...v: unknown[]): string => String.raw(s, ...v).replace(/§/g, '`');
