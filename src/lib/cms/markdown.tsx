// src/lib/cms/markdown.tsx — article body → React nodes
// Phase 3: Data access layer
// Renders Markdown (body_md) or rich HTML (extra.body_html) into .prose-article CSS classes

import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState<{ src: string }[]>([]);

  // Click on any image inside the article → open lightbox gallery at that image.
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest('img');
    if (!target || !containerRef.current) return;
    const imgs = Array.from(containerRef.current.querySelectorAll('img'));
    const idx = imgs.indexOf(target as HTMLImageElement);
    if (idx === -1) return;
    setSlides(
      imgs.map((img) => ({
        src: (img as HTMLImageElement).src || img.getAttribute('src') || '',
      })),
    );
    setIndex(idx);
    setOpen(true);
  };

  return (
    <>
      <div ref={containerRef} className="article-body" onClick={handleClick}>
        {html && html.trim() ? <ProseHtml content={html} /> : <ProseMarkdown content={markdown || ''} />}
      </div>
      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={slides}
        />
      )}
    </>
  );
}
