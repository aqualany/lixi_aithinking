import { createFileRoute } from "@tanstack/react-router";
import { createSsrClient } from "@/lib/cms/supabase.server";
import { getPageBySlug } from "@/lib/cms/queries/pages";
import { toPageSeoProps } from "@/lib/cms/mappers";
import type { PageSeoProps } from "@/lib/cms/types";
import { useEffect, useState } from "react";
import { FixedNav } from "@/components/portfolio/FixedNav";
import { Hero } from "@/components/portfolio/Hero";
import { SectionTabs, type TabId } from "@/components/portfolio/AbstractCards";
import { ResearchPreview } from "@/components/portfolio/ResearchArticle";
import { Experiments } from "@/components/portfolio/Experiments";
import { Resume } from "@/components/portfolio/Resume";
import { Footer } from "@/components/portfolio/Footer";
import type { FooterProps, HeroProps } from "@/lib/cms/types";

export const Route = createFileRoute("/")({
  beforeLoad: async (): Promise<{ pageSeo: PageSeoProps | null }> => {
    try {
      const supabase = createSsrClient();
      const page = await getPageBySlug(supabase, 'home');
      return { pageSeo: page ? toPageSeoProps(page) : null };
    } catch {
      return { pageSeo: null };
    }
  },
  head: (ctx) => {
    const seo = (ctx as any)?.context?.pageSeo ?? null;
    return {
      meta: [
        { title: seo?.title ?? "聂灵晞 · 写作者 · AI 创作探索" },
        { name: "description", content: seo?.description ?? "" },
        { property: "og:title", content: seo?.title ?? "聂灵晞 · 个人主页" },
        { property: "og:description", content: seo?.description ?? "" },
      ],
    };
  },
  component: Index,
});

function Index() {
  // Read root route context (from __root.tsx beforeLoad)
  const rootCtx = Route.useRouteContext() as { heroProps?: HeroProps | null; footerProps?: FooterProps | null };
  const [tab, setTab] = useState<TabId>("research");

  useEffect(() => {
    const apply = () => {
      const h = window.location.hash.replace("#", "");
      if (h === "research" || h === "experiments" || h === "resume") {
        setTab(h);
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const onChange = (id: TabId) => {
    setTab(id);
    if (typeof window !== "undefined") {
      history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FixedNav activeTab={tab} onTabChange={onChange} />
      <main>
        <Hero data={rootCtx.heroProps ?? undefined} />
        <SectionTabs active={tab} onChange={onChange} />
        {tab === "research" && <ResearchPreview />}
        {tab === "experiments" && <Experiments />}
        {tab === "resume" && <Resume />}
      </main>
      <Footer data={rootCtx.footerProps ?? undefined} />
    </div>
  );
}
