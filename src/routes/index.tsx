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
      { title: "Lin Yuan — Research Portfolio, AI Creative Data PM" },
      {
        name: "description",
        content:
          "Essay on AI writing and language understanding, poetry & fiction generation experiments, and résumé for the DeepSeek AI Creative Data Product Manager role.",
      },
      { property: "og:title", content: "Lin Yuan — Research Portfolio" },
      {
        property: "og:description",
        content:
          "A single-page portfolio: long-form essay on creative data, prompt-iteration case studies, and professional background.",
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
