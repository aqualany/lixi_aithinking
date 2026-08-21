import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { FixedNav } from "@/components/portfolio/FixedNav";
import { Footer } from "@/components/portfolio/Footer";
import { ExperimentArticle } from "@/components/portfolio/ExperimentArticle";
import { buildArticleDirectory } from "@/components/portfolio/ArticleDirectory";
import { useCmsData } from "@/lib/cms/context";
import { createSsrClient } from "@/lib/cms/supabase.server";
import { getPostBySlug } from "@/lib/cms/queries/posts";
import { toExperimentDetailProps } from "@/lib/cms/mappers";
import type { ExperimentDetailProps } from "@/lib/cms/types";

export const Route = createFileRoute("/experiments/$slug")({
  beforeLoad: async ({ params }): Promise<{ expDetail: ExperimentDetailProps | null }> => {
    try {
      const supabase = createSsrClient();
      const post = await getPostBySlug(supabase, params.slug);
      if (!post) return { expDetail: null };
      const detail = toExperimentDetailProps(post);
      detail.backLabel = '← 返回';
      return { expDetail: detail };
    } catch {
      return { expDetail: null };
    }
  },
  head: (ctx) => {
    const seo = (ctx as any)?.context?.pageSeoMap?.["experiments"] ?? null;
    return {
      meta: [
        { title: seo?.title ?? "" },
        { name: "description", content: seo?.description ?? "" },
        { property: "og:title", content: seo?.title ?? "" },
        { property: "og:description", content: seo?.description ?? "" },
      ],
    };
  },
  loader: ({ params }) => {
    return { slug: params.slug };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="font-serif text-[20px] text-foreground">未找到。</p>
        <Link to="/" hash="experiments" className="mt-4 inline-block font-mono text-[12px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
          ← 返回
        </Link>
      </div>
    </div>
  ),
  component: ExperimentDetail,
});

function ExperimentDetail() {
  const cmsData = useCmsData();
  const { slug } = Route.useParams();
  const { expDetail } = Route.useRouteContext() as { expDetail: ExperimentDetailProps | null };

  if (!expDetail) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <FixedNav data={cmsData?.fixedNavProps ?? undefined} />
        <main className="pt-16 flex items-center justify-center min-h-[60vh]">
          <p className="font-serif text-stone-400">未找到。</p>
        </main>
        <Footer data={cmsData?.footerProps ?? undefined} />
      </div>
    );
  }

  const d = expDetail;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FixedNav data={cmsData?.fixedNavProps ?? undefined} />
      <main className="pt-16">
        <div className="mx-auto max-w-5xl px-6 pt-10">
          <Link
            to="/"
            hash="experiments"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
          >
            {d.backLabel || '← 返回'}
          </Link>
        </div>
        <ExperimentArticle
          data={d}
          directory={buildArticleDirectory({
            researchTitle: cmsData?.researchProps?.title,
            experiments: cmsData?.experimentsListProps?.experiments,
          })}
          currentKey={`experiment:${slug}`}
        />
      </main>
      <Footer data={cmsData?.footerProps ?? undefined} />
    </div>
  );
}
