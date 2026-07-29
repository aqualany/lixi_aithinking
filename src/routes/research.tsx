import { createFileRoute, Link } from "@tanstack/react-router";
import { FixedNav } from "@/components/portfolio/FixedNav";
import { ResearchFull } from "@/components/portfolio/ResearchArticle";
import { Footer } from "@/components/portfolio/Footer";
import { useCmsData } from "@/lib/cms/context";
import type { FooterProps, FixedNavProps, ResearchFullProps } from "@/lib/cms/types";

export const Route = createFileRoute("/research")({
  head: (ctx) => {
    const seo = (ctx as any)?.context?.pageSeoMap?.["research"] ?? null;
    return {
      meta: [
        { title: seo?.title ?? "" },
        { name: "description", content: seo?.description ?? "" },
        { property: "og:title", content: seo?.title ?? "" },
        { property: "og:description", content: seo?.description ?? "" },
      ],
    };
  },
  component: ResearchPage,
});

function ResearchPage() {
  const cmsData = useCmsData();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <FixedNav data={cmsData?.fixedNavProps ?? undefined} />
      <main className="pt-16">
        <div className="mx-auto max-w-3xl px-6 pt-10">
          <Link
            to="/"
            hash="research"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← 返回
          </Link>
        </div>
        <ResearchFull data={cmsData?.researchProps ?? undefined} />
      </main>
      <Footer data={cmsData?.footerProps ?? undefined} />
    </div>
  );
}
