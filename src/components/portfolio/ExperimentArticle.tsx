// src/components/portfolio/ExperimentArticle.tsx — shared experiment article body
// Unified reading experience: identical structure to the research article.
// Used by BOTH the real frontend route (/experiments/$slug) and the admin preview page.

import { ArticleBody } from "@/lib/cms/markdown";
import { ArticleDirectory } from "@/components/portfolio/ArticleDirectory";
import type { ExperimentDetailProps, ArticleDirectoryItem } from "@/lib/cms/types";

export function ExperimentArticle({ data, directory, currentKey }: { data: ExperimentDetailProps; directory?: ArticleDirectoryItem[]; currentKey?: string }) {
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
        {d.subtitle && (
          <p className="mt-4 font-body text-[17px] leading-[1.7] tracking-[0.02em] text-muted-foreground">
            {d.subtitle}
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

        {/* Bottom: site-wide article directory */}
        <ArticleDirectory items={directory ?? []} currentKey={currentKey} />
      </div>
    </section>
  );
}
