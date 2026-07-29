import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { createSsrClient } from "@/lib/cms/supabase.server";
import { getSiteSettings } from "@/lib/cms/queries/site";
import { getNavigation } from "@/lib/cms/queries/navigation";
import { getAllPages } from "@/lib/cms/queries/pages";
import { getPostBySlug, getPostSections, getPostsByContentType } from "@/lib/cms/queries/posts";import { toPageSeoProps } from "@/lib/cms/mappers";
import { toFooterProps, toHeroProps, toFixedNavProps, toSectionTabsProps, toResearchFullProps, toExperimentCardData, toResumeProps } from "@/lib/cms/mappers";
import type { SiteSettingsRow, FooterProps, HeroProps, FixedNavProps, SectionTabsProps, ResearchFullProps, ExperimentsListProps, ResumeProps, PageSeoProps } from "@/lib/cms/types";
import { CmsProvider, type CmsRootData } from "@/lib/cms/context";

// ── Route context type ─────────────────────────────────────
interface RootRouteContext {
  queryClient: QueryClient;
}

// ── Error / fallback components ────────────────────────────

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn&apos;t load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Route definition ───────────────────────────────────────

export const Route = createRootRouteWithContext<RootRouteContext>()({
  // SSR loader: fetch site_settings before any page renders
  beforeLoad: async (): Promise<{
    siteSettings: SiteSettingsRow | null;
    heroProps: HeroProps | null;
    footerProps: FooterProps | null;
    fixedNavProps: FixedNavProps | null;
    researchProps: ResearchFullProps | null;
    experimentsListProps: ExperimentsListProps | null;
    resumeProps: ResumeProps | null;
    sectionTabsProps: SectionTabsProps | null;
    pageSeoMap: Record<string, PageSeoProps>;
  }> => {
    try {
      const supabase = createSsrClient();
      const [settings, headerNav, footerNav, allPages, researchPost, expPosts, resumePost, contentTypes] = await Promise.all([
        getSiteSettings(supabase),
        getNavigation(supabase, 'header'),
        getNavigation(supabase, 'footer'),
        getAllPages(supabase),
        getPostBySlug(supabase, 'fluent-after'),
        getPostsByContentType(supabase, 'experiment'),
        getPostBySlug(supabase, 'main'),
        supabase.from('content_types').select('*').order('sort_order').then(({ data }: any) => data ?? []),
      ]);
      const researchSections = researchPost ? await getPostSections(supabase, researchPost.id) : [];
      const experimentsListProps: ExperimentsListProps | null = expPosts ? {
        experiments: toExperimentCardData(expPosts, contentTypes as any[] || undefined),
        pageDescription: allPages.find(p => p.slug === 'experiments')?.description || '',
        categoryLabel: (contentTypes as any[])?.find((ct: any) => ct.slug === 'experiment')?.category_label || '',
        typeLabel: (contentTypes as any[])?.find((ct: any) => ct.slug === 'experiment')?.type_label || '',
      } : null;
      const resumeProps: ResumeProps | null = resumePost ? toResumeProps(resumePost) : null;
      const pageSeoMap: Record<string, PageSeoProps> = {};
      for (const page of allPages) {
        pageSeoMap[page.slug] = toPageSeoProps(page);
      }
      const sectionTabs = toSectionTabsProps(allPages, headerNav);
      const researchProps =
        settings && researchPost && researchSections
          ? toResearchFullProps(researchPost, researchSections, settings.author_name, (contentTypes as any[])?.find((ct: any) => ct.id === researchPost.content_type_id))
          : null;

      return {
        siteSettings: settings,
        heroProps: settings ? toHeroProps(settings, null) : null,
        footerProps: settings ? toFooterProps(settings, footerNav) : null,
        fixedNavProps: settings && headerNav ? toFixedNavProps(settings, headerNav) : null,
        sectionTabsProps: sectionTabs,
        pageSeoMap,
        researchProps,
        experimentsListProps,
        resumeProps,
      };
    } catch (e) {
      console.error("[__root] beforeLoad failed:", e);
      return { siteSettings: null, heroProps: null, footerProps: null, fixedNavProps: null, sectionTabsProps: null, researchProps: null, experimentsListProps: null, resumeProps: null, pageSeoMap: {} };
    }
  },
  head: (headContext) => {
    const s = (headContext as any)?.context?.siteSettings ?? null;
    const faviconUrl = (s as any)?._faviconUrl || (s as any)?.faviconUrl || null;
    const title = s?.site_title ?? "聂灵晞 · 个人主页";
    const description = s?.site_description ?? "";
    const author = s?.author_name ?? "聂灵晞";

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title },
        { name: "description", content: description },
        { name: "author", content: author },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "icon", href: faviconUrl || "/favicon.ico", type: "image/x-icon" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;600&family=Source+Serif+4:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://chinese-fonts-cdn.deno.dev/packages/zqfs/dist/ZhuqueFangsong-Regular/result.css",
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  // Read CMS data from route context EVERY render
  // beforeLoad() runs on every SSR request and returns fresh Supabase data
  // On CSR (SPA navigation), uses the SSR serialized data (last saved state)
  const ctx = Route.useRouteContext() as any;
  const { queryClient } = ctx;
  
  // Always build fresh from context — no module-level cache
  const cmsData: CmsRootData = {
    siteSettings: ctx.siteSettings ?? null,
    heroProps: ctx.heroProps ?? null,
    footerProps: ctx.footerProps ?? null,
    fixedNavProps: ctx.fixedNavProps ?? null,
    researchProps: ctx.researchProps ?? null,
    experimentsListProps: ctx.experimentsListProps ?? null,
    resumeProps: ctx.resumeProps ?? null,
    sectionTabsProps: ctx.sectionTabsProps ?? null,
    pageSeoMap: ctx.pageSeoMap ?? {},
  };

  // Sync document title from CMS data (bypass head() limitation)
  useEffect(() => {
    if (cmsData.siteSettings?.site_title) {
      document.title = cmsData.siteSettings.site_title;
    }
  }, [cmsData.siteSettings?.site_title]);

  return (
    <QueryClientProvider client={queryClient}>
      <CmsProvider data={cmsData}>
        <Outlet />
      </CmsProvider>
    </QueryClientProvider>
  );
}
