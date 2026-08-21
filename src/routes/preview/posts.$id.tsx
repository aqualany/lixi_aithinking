// src/routes/preview/posts.$id.tsx — article preview (admin)
// Uses the REAL frontend article rendering components (ResearchFull /
// ExperimentArticle) so preview always matches the public page.
// Reads the unsaved draft from localStorage; falls back to the saved post.

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FixedNav } from "@/components/portfolio/FixedNav";
import { Footer } from "@/components/portfolio/Footer";
import { ResearchFull } from "@/components/portfolio/ResearchArticle";
import { ExperimentArticle } from "@/components/portfolio/ExperimentArticle";
import { buildArticleDirectory } from "@/components/portfolio/ArticleDirectory";
import { useCmsData } from "@/lib/cms/context";
import { createSsrClient } from "@/lib/cms/supabase.server";
import { toResearchFullProps, toExperimentDetailProps, formatChineseDate, formatExperimentDate } from "@/lib/cms/mappers";
import { extractHeadings } from "@/lib/cms/rich-html";
import type { ResearchFullProps, ExperimentDetailProps } from "@/lib/cms/types";

export const Route = createFileRoute("/preview/posts/$id")({
  beforeLoad: async ({ params }): Promise<{ dbData: { contentTypeSlug: string; props: any } | null }> => {
    // Fallback for saved posts opened directly (no unsaved draft)
    try {
      const supabase = createSsrClient();
      const { data: post } = await (supabase
        .from('posts')
        .select('*, content_types(slug)')
        .eq('id', params.id)
        .eq('status', 'published')
        .single() as any);
      if (!post) return { dbData: null };
      const ct = (post as any).content_types;
      const slug = ct?.slug ?? 'research';
      if (slug === 'experiment') {
        return { dbData: { contentTypeSlug: 'experiment', props: toExperimentDetailProps(post as any) } };
      }
      const { data: sections } = await (supabase
        .from('post_sections')
        .select('*')
        .eq('post_id', (post as any).id)
        .order('sort_order') as any);
      const { data: settings } = await (supabase.from('site_settings').select('author_name').limit(1).single() as any);
      return {
        dbData: {
          contentTypeSlug: 'research',
          props: toResearchFullProps(post as any, (sections ?? []) as any, (settings as any)?.author_name ?? ''),
        },
      };
    } catch {
      return { dbData: null };
    }
  },
  component: PreviewPage,
});

function PreviewPage() {
  const { id } = Route.useParams();
  const cmsData = useCmsData();
  const { dbData } = Route.useRouteContext();
  const [draft, setDraft] = useState<any>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`lixi-preview:${id}`);
      if (raw) setDraft(JSON.parse(raw));
    } catch {}
  }, [id]);

  const authorName = cmsData?.siteSettings?.author_name ?? '';

  let contentTypeSlug: string | null = null;
  let props: ResearchFullProps | ExperimentDetailProps | null = null;

  if (draft) {
    contentTypeSlug = draft.contentTypeSlug === 'experiment' ? 'experiment' : 'research';
    if (contentTypeSlug === 'experiment') {
      props = {
        num: draft.num ?? '',
        date: formatExperimentDate(draft.publishedAt ?? null),
        category: draft.tag ?? '',
        subtitle: draft.subtitle ?? '',
        title: draft.title ?? '',
        summary: draft.summary ?? '',
        bodyHtml: draft.bodyHtml ?? '',
        bodyMd: '',
        sections: extractHeadings(draft.bodyHtml ?? '').map((s) => ({ id: s.anchor, heading: s.title })),
        categoryLabel: draft.tag ?? '',
        backLabel: '← 返回',
      };
    } else {
      props = {
        title: draft.title ?? '',
        subtitle: draft.subtitle ?? '',
        authorName,
        date: formatChineseDate(draft.publishedAt ?? null),
        wordCount: draft.wordCount ?? 0,
        summary: draft.summary ?? '',
        sections: extractHeadings(draft.bodyHtml ?? '').map((s) => ({ id: s.anchor, heading: s.title })),
        bodyHtml: draft.bodyHtml ?? '',
        bodyMd: '',
        typeLabelMeta: draft.tag ?? '',
      };
    }
  } else if (dbData) {
    contentTypeSlug = dbData.contentTypeSlug;
    props = dbData.props;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FixedNav data={cmsData?.fixedNavProps ?? undefined} />
      <main className="pt-16">
        <div className="mx-auto max-w-5xl px-6 pt-10">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            预览模式
          </span>
        </div>

        {!props ? (
          <div className="flex items-center justify-center py-40">
            <div className="text-center">
              <p className="font-serif text-[20px] text-foreground">未找到。</p>
              <Link to="/admin/posts" className="mt-4 inline-block font-mono text-[12px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
                ← 返回后台
              </Link>
            </div>
          </div>
        ) : contentTypeSlug === 'experiment' ? (
          <ExperimentArticle
            data={props as ExperimentDetailProps}
            directory={buildArticleDirectory({
              researchTitle: cmsData?.researchProps?.title,
              experiments: cmsData?.experimentsListProps?.experiments,
            })}
          />
        ) : (
          <ResearchFull
            data={props as ResearchFullProps}
            directory={buildArticleDirectory({
              researchTitle: cmsData?.researchProps?.title,
              experiments: cmsData?.experimentsListProps?.experiments,
            })}
          />
        )}
      </main>
      <Footer data={cmsData?.footerProps ?? undefined} />
    </div>
  );
}
