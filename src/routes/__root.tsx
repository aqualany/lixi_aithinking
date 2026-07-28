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
import { toFooterProps, toHeroProps } from "@/lib/cms/mappers";
import type { SiteSettingsRow, FooterProps, HeroProps } from "@/lib/cms/types";

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
  }> => {
    try {
      const supabase = createSsrClient();
      const [settings, footerNav] = await Promise.all([
        getSiteSettings(supabase),
        getNavigation(supabase, 'footer'),
      ]);
      return {
        siteSettings: settings,
        heroProps: settings ? toHeroProps(settings, null) : null,
        footerProps: settings ? toFooterProps(settings, footerNav) : null,
      };
    } catch (e) {
      console.error("[__root] beforeLoad failed:", e);
      return { siteSettings: null, heroProps: null, footerProps: null };
    }
  },
  head: (headContext) => {
    // TanStack Router head may receive RouteMatch or be called without args in SSR
    const s = (headContext as any)?.context?.siteSettings ?? null;
    const title = s?.site_title ?? "聂灵晞 · AI 创作数据研究者 个人主页";
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
        { name: "twitter:site", content: "@Lovable" },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
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
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
