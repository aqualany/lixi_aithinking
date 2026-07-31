// src/lib/cms/markdown.tsx — article body → React nodes
// Phase 3: Data access layer
// Renders Markdown (body_md) or rich HTML (extra.body_html) into .prose-article CSS classes

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { sanitizeHtml } from './rich-html';

const customComponents: Components = {
  // Map ### heading {#anchor} → <h3 id="anchor" className="scroll-mt-24">
  h3: ({ id, children, ...props }) => {
    // Extract anchor from the last child if it's a text node like "{#sec-1}"
    const kids = React.Children.toArray(children);
    let anchor: string | undefined = id;

    // The heading might have a trailing {#anchor} text node; filter it out
    const filtered = kids.filter((child) => {
      if (typeof child === 'string' && child.startsWith('{#')) {
        anchor = child.slice(2, -1);  // extract "sec-1" from "{#sec-1}"
        return false;
      }
      if (typeof child === 'object' && 'props' in child) {
        const text = (child.props as any)?.children;
        if (typeof text === 'string' && text.startsWith('{#')) {
          anchor = text.slice(2, -1);
          return false;
        }
      }
      return true;
    });

    return (
      <h3 id={anchor} className="scroll-mt-24" {...props}>
        {filtered}
      </h3>
    );
  },
  // Plain paragraphs map to .prose-article p styling
  p: ({ children, ...props }) => <p {...props}>{children}</p>,
  // Divider: · · · sequences from body_md
  hr: () => <div className="divider-dots" aria-hidden>· · ·</div>,
};

export function ProseMarkdown({ content }: { content: string }) {
  if (!content) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={customComponents}
    >
      {content}
    </ReactMarkdown>
  );
}

/** Rich text (HTML) article body — sanitized before render. */
export function ProseHtml({ content }: { content: string }) {
  if (!content) return null;
  return <div className="prose-html" dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />;
}

/** Pick HTML body when present, else fall back to legacy markdown. */
export function ArticleBody({ html, markdown }: { html?: string | null; markdown?: string | null }) {
  if (html && html.trim()) return <ProseHtml content={html} />;
  return <ProseMarkdown content={markdown || ''} />;
}
