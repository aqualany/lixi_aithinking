// src/components/portfolio/ExperimentArticle.tsx — shared experiment article body
// Unified reading experience: identical structure to the research article.
// Used by BOTH the real frontend route (/experiments/$slug) and the admin preview page.

import { ArticleBody } from "@/lib/cms/markdown";
import type { ExperimentDetailProps } from "@/lib/cms/types";

export function ExperimentArticle({ data }: { data: ExperimentDetailProps }) {
  const d = data;
  const sections = d.sections || [];
  const meta = [d.num, d.date, d.category].filter(Boolean).join(' · ');

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          {meta}
        </p>
        <h1 className="mt-6 zh-title font-serif text-[36px] leading-[1.35] tracking-[0.02em] text-foreground sm:text-[42px]">
          {d.title}
        </h1>

        {/* Summary */}
        {d.summary && (
          <p className="mt-8 border-l border-foreground pl-6 font-serif text-[17px] italic leading-[1.95] tracking-[0.02em] text-foreground">
            <span className="not-italic font-medium">摘要。</span>
            {d.summary}
          </p>
        )}

        {/* Body — rich HTML preferred, markdown fallback, with TOC sidebar */}
        {(d.bodyHtml || d.bodyMd) && (
          <div className="mt-14 md:grid md:grid-cols-[1fr_180px] md:gap-x-10">
            <article className="prose-article">
              <ArticleBody html={d.bodyHtml} markdown={d.bodyMd} />
            </article>
            {sections.length > 0 && (
              <aside className="hidden md:block">
                <div className="sticky top-24 border-l border-border pl-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">目录</p>
                  <ul className="mt-4 space-y-3">
                    {sections.map((s) => (
                      <li key={s.id}>
                        <a href={`#${s.id}`}
                          className="font-serif text-[13.5px] leading-[1.7] text-muted-foreground transition-colors hover:text-foreground">
                          {s.heading}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}
          </div>
        )}

        {/* Bottom TOC (same as research article) */}
        {sections.length > 0 && (
          <div className="mt-20 border-t border-border pt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">目录</p>
            <ul className="mt-6 space-y-3">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}
                    className="font-serif text-[16px] leading-[1.8] text-foreground transition-colors hover:text-muted-foreground">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
