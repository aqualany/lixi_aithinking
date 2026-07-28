import { createFileRoute, Link } from "@tanstack/react-router";
import { FixedNav } from "@/components/portfolio/FixedNav";
import { ResearchFull } from "@/components/portfolio/ResearchArticle";
import { Footer } from "@/components/portfolio/Footer";
import type { FooterProps } from "@/lib/cms/types";

export const Route = createFileRoute("/research")({
  head: (ctx) => {
    const seo = (ctx as any)?.context?.pageSeoMap?.["research"] ?? null;
    return {
      meta: [
        { title: seo?.title ?? "流畅之后 · 论写作、语言理解与创意数据 · 聂灵晞" },
        { name: "description", content: seo?.description ?? "一篇关于 AI 写作、语言理解与创意数据的长文。聂灵晞著。" },
        { property: "og:title", content: seo?.title ?? "流畅之后：论写作、语言理解与创意数据" },
        { property: "og:description", content: seo?.description ?? "从数据的角度重述 AI 写作在意义层遇到的问题。" },
      ],
    };
  },
  component: ResearchPage,
});

function ResearchPage() {
  const rootCtx = Route.useRouteContext() as { footerProps?: FooterProps | null };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <FixedNav />
      <main className="pt-16">
        <div className="mx-auto max-w-3xl px-6 pt-10">
          <Link
            to="/"
            hash="research"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← 返回主页
          </Link>
        </div>
        <ResearchFull />
      </main>
      <Footer data={rootCtx.footerProps ?? undefined} />
    </div>
  );
}