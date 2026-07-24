import { createFileRoute } from "@tanstack/react-router";
import { FixedNav } from "@/components/portfolio/FixedNav";
import { Hero } from "@/components/portfolio/Hero";
import { AbstractCards } from "@/components/portfolio/AbstractCards";
import { ResearchArticle } from "@/components/portfolio/ResearchArticle";
import { Experiments } from "@/components/portfolio/Experiments";
import { Resume } from "@/components/portfolio/Resume";
import { Footer } from "@/components/portfolio/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "聂蓝玉 · AI 创作数据研究者 个人主页" },
      {
        name: "description",
        content:
          "长文：论 AI 写作与语言理解；实验笔记：现代诗、宋词与小说的提示词迭代；简历：工作经历与联系方式。",
      },
      { property: "og:title", content: "聂蓝玉 · 个人研究主页" },
      {
        property: "og:description",
        content:
          "关于创意数据的长文，一组提示词迭代的实验笔记，以及工作经历。",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <FixedNav />
      <main>
        <Hero />
        <AbstractCards />
        <ResearchArticle />
        <Experiments />
        <Resume />
      </main>
      <Footer />
    </div>
  );
}
