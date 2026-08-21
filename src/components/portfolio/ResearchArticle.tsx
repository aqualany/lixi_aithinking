import { Link } from "@tanstack/react-router";
import { ProseMarkdown, ArticleBody } from "@/lib/cms/markdown";
import { ArticleDirectory } from "@/components/portfolio/ArticleDirectory";
import type { ResearchFullProps, ArticleDirectoryItem } from "@/lib/cms/types";

function Header({ data, linkTitle = false }: { data: ResearchFullProps; linkTitle?: boolean }) {
  const Title = (
    <h2 className="zh-title font-serif text-[36px] leading-[1.35] tracking-[0.02em] text-foreground sm:text-[44px]">
      {data.title}
    </h2>
  );
  return (
    <div className="md:pr-[220px]">
      {/* 220px = 正文右侧目录(180px) + 间距(40px)，让标题/副标题与正文同宽对齐 */}
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
      {data.subtitle && (
        <p className="mt-4 font-body text-[17px] leading-[1.7] tracking-[0.02em] text-muted-foreground">
          {data.subtitle}
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[12px] tracking-[0.12em] text-muted-foreground">
        <span>{data.authorName}</span>
        <span aria-hidden>·</span>
        <span>{data.date}</span>
        <span aria-hidden>·</span>
        <span>约 {data.wordCount.toLocaleString()} 字</span>
      </div>
    </div>
  );
}

function Sidebar({ data, activeOnly }: { data: ResearchFullProps; activeOnly?: boolean }) {
  return (
    <aside className="hidden md:block">
      <div className="sticky top-24 border-l border-border pl-4">
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

export function ResearchPreview({ data, directory }: { data?: ResearchFullProps; directory?: ArticleDirectoryItem[] }) {
  if (!data) return null;
  const previewBody = data.previewBodyHtml || data.previewBodyMd || data.bodyHtml || data.bodyMd;
  const previewHtml = data.previewBodyHtml || data.bodyHtml;
  return (
    <section id="research"
      className="scroll-mt-24 border-t border-border bg-background">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <Header data={data} linkTitle />
        <div className="mt-14 md:grid md:grid-cols-[1fr_180px] md:gap-x-10">
          <div>
            <div className="relative">
              <article className="prose-article fade-mask-b">
                <ArticleBody html={previewHtml} markdown={previewBody} />
              </article>
            </div>
            <div className="mt-8 flex justify-center">
              <Link to="/research"
                className="group inline-flex items-center gap-3 border border-foreground px-6 py-2.5 font-serif text-[15px] tracking-[0.15em] text-foreground transition-colors hover:bg-foreground hover:text-background cursor-pointer">
                阅读全文
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Site-wide article directory (research + experiments, no resume) */}
            <ArticleDirectory items={directory ?? []} />
          </div>
          <Sidebar data={data} />
        </div>
      </div>
    </section>
  );
}

export function ResearchFull({ data, directory, currentKey }: { data?: ResearchFullProps; directory?: ArticleDirectoryItem[]; currentKey?: string }) {
  // Item 8: No hardcoded fallback — render nothing if no data
  if (!data) return null;
  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <Header data={data} />
        <div className="mt-14 md:grid md:grid-cols-[1fr_180px] md:gap-x-10">
          <article className="prose-article">
            <ArticleBody html={data.bodyHtml} markdown={data.bodyMd} />
          </article>
          <Sidebar data={data} activeOnly />
        </div>

        {/* Bottom: site-wide article directory */}
        <ArticleDirectory items={directory ?? []} currentKey={currentKey} />
      </div>
    </section>
  );
}
