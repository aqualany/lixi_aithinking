// src/components/portfolio/ExperimentArticle.tsx — shared experiment article body
// Used by BOTH the real frontend route (/experiments/$slug) and the admin preview page,
// so preview always renders exactly what the frontend renders.

import { ArticleBody } from "@/lib/cms/markdown";
import type { ExperimentDetailProps } from "@/lib/cms/types";

export function ExperimentArticle({ data }: { data: ExperimentDetailProps }) {
  const d = data;
  const images = d.screenshotUrls || [];

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          {d.num} · {d.date} · {d.category}
        </p>
        <h1 className="mt-6 zh-title font-serif text-[36px] leading-[1.35] tracking-[0.02em] text-foreground sm:text-[42px]">
          {d.title}
        </h1>

        {/* Summary / keyInsight */}
        {d.summary && (
          <p className="mt-8 border-l border-foreground pl-6 font-serif text-[17px] italic leading-[1.95] tracking-[0.02em] text-foreground">
            <span className="not-italic font-medium">摘要。</span>
            {d.summary}
          </p>
        )}

        {/* Hypothesis */}
        {d.hypothesis && (
          <p className="mt-10 border-l border-foreground pl-6 font-serif text-[17px] italic leading-[1.95] tracking-[0.02em] text-foreground">
            <span className="not-italic font-medium">假设。</span>
            {d.hypothesis}
          </p>
        )}

        {/* Body — rich HTML preferred, markdown fallback */}
        {(d.bodyHtml || d.bodyMd) && (
          <div className="mt-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              正文
            </p>
            <div className="mt-4 prose-article">
              <ArticleBody html={d.bodyHtml} markdown={d.bodyMd} />
            </div>
          </div>
        )}

        <div className="mt-16 md:grid md:grid-cols-[1fr_180px] md:gap-x-10">
          <div>
            {/* Optimization */}
            {d.optimization.length > 0 && (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                  一 · 与 AI 沟通过程
                </p>
                <h2 className="mt-4 zh-title font-serif text-[24px] leading-[1.4] tracking-[0.02em] text-foreground">
                  提示词优化的过程
                </h2>
                <ol className="mt-8 space-y-4 border-l border-border pl-6 font-serif text-[15.5px] leading-[1.9] text-foreground">
                  {d.optimization.map((step, i) => (
                    <li key={i}>
                      <span className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground">
                        步骤 {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Screenshots */}
            <div className="mt-16">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                二 · 对话截图
              </p>
              <div className="mt-4 flex items-baseline justify-between">
                <h2 className="zh-title font-serif text-[24px] leading-[1.4] tracking-[0.02em] text-foreground">
                  与 AI 的往返
                </h2>
              </div>

              {images.length === 0 ? (
                <div className="mt-6 border border-dashed border-border p-10 text-center">
                  <p className="font-serif text-[15px] italic leading-[1.9] text-muted-foreground">
                    还没有截图。
                  </p>
                </div>
              ) : (
                <div className="mt-6 max-h-[720px] space-y-6 overflow-y-auto border border-border p-4">
                  {images.map((src, i) => (
                    <figure key={i} className="relative">
                      <img src={src} alt={`对话截图 ${i + 1}`} className="block w-full border border-border" />
                      <figcaption className="mt-2 flex items-baseline justify-between font-mono text-[11px] tracking-[0.15em] text-muted-foreground">
                        <span>截图 {String(i + 1).padStart(2, "0")}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </div>

            {/* Self-training */}
            {d.selfTraining.length > 0 && (
              <div className="mt-16">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                  三 · 自训练思路
                </p>
                <h2 className="mt-4 zh-title font-serif text-[24px] leading-[1.4] tracking-[0.02em] text-foreground">
                  这条优化过程如何被 AI 自训练
                </h2>
                <p className="mt-6 font-serif text-[16px] leading-[1.9] tracking-[0.01em] text-muted-foreground">
                  把上面的"人 → AI → 反馈 → 再提示"这条链条形式化，就可以变成一份小型的、可训练的数据结构。
                </p>
                <ol className="mt-8 space-y-6 font-serif text-[16px] leading-[1.95] text-foreground">
                  {d.selfTraining.map((s, i) => (
                    <li key={i} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-border pb-6 last:border-b-0">
                      <span className="font-mono text-[12px] tracking-[0.15em] text-muted-foreground pt-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p>{s}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Sidebar TOC — optimization steps as clickable sections */}
          <aside className="hidden md:block">
            <div className="sticky top-24 border-l border-border pl-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">步骤</p>
              <ul className="mt-4 space-y-3">
                {d.optimization.map((_, i) => (
                  <li key={i}>
                    <span className="font-serif text-[13.5px] leading-[1.7] text-muted-foreground">
                      步骤 {String(i + 1).padStart(2, "0")}
                    </span>
                  </li>
                ))}
                {d.selfTraining.length > 0 && (
                  <li>
                    <span className="font-serif text-[13.5px] leading-[1.7] text-muted-foreground">
                      自训练思路
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
