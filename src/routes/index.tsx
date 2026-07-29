import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FixedNav } from "@/components/portfolio/FixedNav";
import { Hero } from "@/components/portfolio/Hero";
import { SectionTabs, type TabId } from "@/components/portfolio/AbstractCards";
import { ResearchPreview } from "@/components/portfolio/ResearchArticle";
import { Experiments } from "@/components/portfolio/Experiments";
import { Resume } from "@/components/portfolio/Resume";
import { Footer } from "@/components/portfolio/Footer";
import { useCmsData } from "@/lib/cms/context";
import type { FooterProps, HeroProps, FixedNavProps, SectionTabsProps, ResearchFullProps, ExperimentsListProps, ResumeProps } from "@/lib/cms/types";

export const Route = createFileRoute("/")({
  head: (ctx) => {
    const seo = (ctx as any)?.context?.pageSeoMap?.["home"] ?? null;
    return {
      meta: [
        { title: seo?.title ?? "聂灵晞 · 个人主页" },
        {
          name: "description",
          content: seo?.description ?? "",
        },
        { property: "og:title", content: seo?.title ?? "聂灵晞 · 个人主页" },
        {
          property: "og:description",
          content: seo?.description ?? "",
        },
      ],
    };
  },
  component: Index,
});

function Index() {
  const cmsData = useCmsData();
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
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FixedNav activeTab={tab} onTabChange={onChange} data={cmsData?.fixedNavProps ?? undefined} />
      <main>
        <Hero data={cmsData?.heroProps ?? undefined} />
        <SectionTabs active={tab} onChange={(id: string) => onChange(id as any)} data={cmsData?.sectionTabsProps ?? undefined} />
        {tab === "research" && <ResearchPreview data={cmsData?.researchProps ?? undefined} />}
        {tab === "experiments" && <Experiments data={cmsData?.experimentsListProps ?? undefined} />}
        {tab === "resume" && <Resume data={cmsData?.resumeProps ?? undefined} />}
      </main>
      <Footer data={cmsData?.footerProps ?? undefined} />
    </div>
  );
}
