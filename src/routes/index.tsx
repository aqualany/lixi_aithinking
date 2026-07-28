import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FixedNav } from "@/components/portfolio/FixedNav";
import { Hero } from "@/components/portfolio/Hero";
import { SectionTabs, type TabId } from "@/components/portfolio/AbstractCards";
import { ResearchPreview } from "@/components/portfolio/ResearchArticle";
import { Experiments } from "@/components/portfolio/Experiments";
import { Resume } from "@/components/portfolio/Resume";
import { Footer } from "@/components/portfolio/Footer";
import type { FooterProps, HeroProps, FixedNavProps, SectionTabsProps, ResearchFullProps, ExperimentsListProps, ResumeProps } from "@/lib/cms/types";

export const Route = createFileRoute("/")({
  head: (ctx) => {
    const seo = (ctx as any)?.context?.pageSeoMap?.["home"] ?? null;
    return {
      meta: [
        { title: seo?.title ?? "聂灵晞 · 写作者 · AI 创作探索" },
        {
          name: "description",
          content: seo?.description ?? "长文：论 AI 写作与语言理解；实验笔记：现代诗、宋词与小说的提示词迭代；简历：工作经历与联系方式。",
        },
        { property: "og:title", content: seo?.title ?? "聂灵晞 · 个人主页" },
        {
          property: "og:description",
          content: seo?.description ?? "关于创意数据的长文，一组提示词迭代的实验笔记，以及工作经历。",
        },
      ],
    };
  },
  component: Index,
});

function Index() {
  const rootCtx = Route.useRouteContext() as { heroProps?: HeroProps | null; footerProps?: FooterProps | null; fixedNavProps?: FixedNavProps | null; sectionTabsProps?: SectionTabsProps | null; researchProps?: ResearchFullProps | null; experimentsListProps?: ExperimentsListProps | null; resumeProps?: ResumeProps | null };
  const [tab, setTab] = useState<TabId>("research");

  useEffect(() => {
    const apply = () => {
      const h = window.location.hash.replace("#", "");
      if (h === "research" || h === "experiments" || h === "resume") {
        setTab(h as TabId);
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const onChange = (id: string) => {
    setTab(id as TabId);
    if (typeof window !== "undefined") {
      history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FixedNav activeTab={tab} onTabChange={onChange} data={rootCtx.fixedNavProps ?? undefined} />
      <main>
        <Hero data={rootCtx.heroProps ?? undefined} />
        <SectionTabs active={tab} onChange={(id: string) => onChange(id as TabId)} data={rootCtx.sectionTabsProps ?? undefined} />
        {tab === "research" && <ResearchPreview data={rootCtx.researchProps ?? undefined} />}
        {tab === "experiments" && <Experiments data={rootCtx.experimentsListProps ?? undefined} />}
        {tab === "resume" && <Resume data={rootCtx.resumeProps ?? undefined} />}
      </main>
      <Footer data={rootCtx.footerProps ?? undefined} />
    </div>
  );
}
