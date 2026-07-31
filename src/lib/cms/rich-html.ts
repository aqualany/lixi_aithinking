// src/lib/cms/rich-html.ts — Rich text HTML helpers
// Shared by: admin editor (save), frontend renderer, preview page
// No React dependency — safe for node test scripts.

import { marked } from 'marked';

/** Strip dangerous tags/attributes from admin-authored HTML. */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/(href|src)\s*=\s*["']javascript:[^"']*["']/gi, '');
}

/** Markdown → HTML (used when opening legacy body_md articles in the editor). */
export function markdownToHtml(md: string): string {
  if (!md) return '';
  try {
    return marked.parse(md, { async: false, gfm: true }) as string;
  } catch {
    return md;
  }
}

const HEADING_RE = /<h([123])([^>]*)>([\s\S]*?)<\/h\1>/gi;

function headingText(inner: string): string {
  return inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

/** Extract h1/h2/h3 headings as {anchor, title} in document order (no mutation). */
export function extractHeadings(html: string): { anchor: string; title: string }[] {
  const out: { anchor: string; title: string }[] = [];
  const re = new RegExp(HEADING_RE.source, 'gi');
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(html)) !== null) {
    i++;
    const attrs = m[2] ?? '';
    const idMatch = attrs.match(/id="([^"]+)"/);
    out.push({
      anchor: idMatch ? idMatch[1] : `sec-${i}`,
      title: headingText(m[3] ?? ''),
    });
  }
  return out;
}

/**
 * Ensure every h1/h2/h3 carries an id (sec-1, sec-2 … in document order, keeping
 * existing ids) and return the normalized HTML + extracted sections.
 * Used on save so sidebar anchor links (#sec-N) resolve.
 */
export function processHtmlHeadings(html: string): {
  html: string;
  sections: { anchor: string; title: string }[];
} {
  const sections: { anchor: string; title: string }[] = [];
  let i = 0;
  const out = html.replace(/<h([123])([^>]*)>([\s\S]*?)<\/h\1>/gi, (full, lvl, attrs, inner) => {
    i++;
    const a = attrs ?? '';
    const existing = a.match(/id="([^"]+)"/);
    const anchor = existing ? existing[1] : `sec-${i}`;
    const cleanAttrs = a.replace(/\sid="[^"]*"/, '');
    sections.push({ anchor, title: headingText(inner ?? '') });
    return `<h${lvl} id="${anchor}"${cleanAttrs}>${inner}</h${lvl}>`;
  });
  return { html: out, sections };
}
