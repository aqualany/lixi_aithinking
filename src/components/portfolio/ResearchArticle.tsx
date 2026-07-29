import { Link } from "@tanstack/react-router";
import { ProseMarkdown } from "@/lib/cms/markdown";
import type { ResearchFullProps } from "@/lib/cms/types";

function Header({ data, linkTitle = false }: { data: ResearchFullProps; linkTitle?: boolean }) {
  const Title = (
    <h2 className="zh-title font-serif text-[36px] leading-[1.35] tracking-[0.02em] text-foreground sm:text-[44px]">
      {data.title}
    </h2>
  );
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        {data.typeLabelMeta ? data.typeLabelMeta : ""}
      </p>
      <div className="mt-6">
        {linkTitle ? (
          <Link to="/research" className="group inline-block">
            <span className="block group-hover:underline underline-offset-[8px] decoration-[0.5px]">
              {Title}
            </span>
          </Link>
        ) : Title}
      </div>
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[12px] tracking-[0.12em] text-muted-foreground">
        <span>{data.authorName}</span>
        <span aria-hidden>·</span>
        <span>{data.date}</span>
        <span aria-hidden>·</span>
        <span>约 {data.wordCount.toLocaleString()} 字</span>
      </div>
      <p className="mt-10 border-l border-foreground pl-6 font-serif text-[17px] italic leading-[1.95] tracking-[0.02em] text-foreground">
        <span className="not-italic font-medium">摘要。</span>
        {data.summary}
      </p>
    </>
  );
}

function Sidebar({ data, activeOnly }: { data: ResearchFullProps; activeOnly?: boolean }) {
  return (
    <aside className="hidden md:block">
      <div className="sticky top-24 border-l border-border pl-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">目录</p>
        <ul className="mt-4 space-y-3">
          {data.sections.map((s) => (
            <li key={s.id}>
              {activeOnly ? (
                <a href={`#${s.id}`}
                  className="font-serif text-[13.5px] leading-[1.7] text-muted-foreground transition-colors hover:text-foreground">
                  {s.heading}
                </a>
              ) : (
                <Link to="/research" hash={s.id}
                  className="font-serif text-[13.5px] leading-[1.7] text-muted-foreground transition-colors hover:text-foreground">
                  {s.heading}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export function ResearchPreview({ data }: { data?: ResearchFullProps }) {
  if (!data) return null;
  const previewBody = data.previewBodyMd || data.bodyMd;
  return (
    <section id="research"
      className="scroll-mt-24 border-t border-border bg-background">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Header data={data} linkTitle />
        <div className="mt-14 md:grid md:grid-cols-[1fr_180px] md:gap-x-10">
          <div>
            <div className="relative">
              <article className="prose-article fade-mask-b">
                <ProseMarkdown content={previewBody} />
              </article>
            </div>
            <div className="mt-8 flex justify-center">
              <Link to="/research"
                className="group inline-flex items-center gap-3 border border-foreground px-6 py-2.5 font-serif text-[15px] tracking-[0.15em] text-foreground transition-colors hover:bg-foreground hover:text-background cursor-pointer">
                阅读全文
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Sections TOC below the button */}
            {data.sections.length > 0 && (
              <div className="mt-12 border-t border-border pt-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">目录</p>
                <ul className="mt-4 space-y-2">
                  {data.sections.map((s) => (
                    <li key={s.id}>
                      <Link to="/research" hash={s.id}
                        className="font-serif text-[14px] leading-[1.7] text-muted-foreground transition-colors hover:text-foreground cursor-pointer">
                        {s.heading}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Sidebar data={data} />
        </div>
      </div>
    </section>
  );
}

export function ResearchFull({ data }: { data?: ResearchFullProps }) {
  // Item 8: No hardcoded fallback — render nothing if no data
  if (!data) return null;
  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Header data={data} />
        <div className="mt-14 md:grid md:grid-cols-[1fr_180px] md:gap-x-10">
          <article className="prose-article">
            <ProseMarkdown content={data.bodyMd} />
          </article>
          <Sidebar data={data} activeOnly />
        </div>

        {/* Bottom TOC */}
        {data.sections.length > 0 && (
          <div className="mt-20 border-t border-border pt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">目录</p>
            <ul className="mt-6 space-y-3">
              {data.sections.map((s) => (
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
