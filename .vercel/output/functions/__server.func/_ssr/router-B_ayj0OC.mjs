import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useRouter, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$8 } from "../_id.edit-DtkWxyLH.mjs";
import { a as getPostsByContentType, c as toFooterProps, d as toResearchFullProps, f as toResumeProps, i as getPostSections, l as toHeroProps, n as createSsrClient, o as toExperimentCardData, p as toSectionTabsProps, r as getPostBySlug, s as toFixedNavProps, t as Route$9, u as toPageSeoProps } from "./experiments._slug-B1ZpWLlb.mjs";
import { t as Route$10 } from "./research-mOZab8AG.mjs";
import { t as Route$11 } from "./routes-Dzg1onfp.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B_ayj0OC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-5xRu0Rvv.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
async function getSiteSettings(supabase) {
	const { data, error } = await supabase.from("site_settings").select("*").limit(1).single();
	if (error || !data) {
		console.error("[CMS] getSiteSettings failed:", error?.message);
		return null;
	}
	return data;
}
async function getNavigation(supabase, location) {
	const { data, error } = await supabase.from("navigation").select("*").eq("location", location).eq("is_visible", true).order("sort_order", { ascending: true });
	if (error) {
		console.error(`[CMS] getNavigation(${location}) failed:`, error.message);
		return [];
	}
	return data ?? [];
}
async function getAllPages(supabase) {
	const { data, error } = await supabase.from("pages").select("*").eq("is_visible", true).order("sort_order", { ascending: true });
	if (error) {
		console.error("[CMS] getAllPages failed:", error.message);
		return [];
	}
	return data ?? [];
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$7 = createRootRouteWithContext()({
	beforeLoad: async () => {
		try {
			const supabase = createSsrClient();
			const [settings, headerNav, footerNav, allPages, researchPost, expPosts, resumePost] = await Promise.all([
				getSiteSettings(supabase),
				getNavigation(supabase, "header"),
				getNavigation(supabase, "footer"),
				getAllPages(supabase),
				getPostBySlug(supabase, "fluent-after"),
				getPostsByContentType(supabase, "experiment"),
				getPostBySlug(supabase, "main")
			]);
			const researchSections = researchPost ? await getPostSections(supabase, researchPost.id) : [];
			const experimentsListProps = expPosts ? { experiments: toExperimentCardData(expPosts) } : null;
			const resumeProps = resumePost ? toResumeProps(resumePost) : null;
			const pageSeoMap = {};
			for (const page of allPages) pageSeoMap[page.slug] = toPageSeoProps(page);
			const sectionTabs = toSectionTabsProps(allPages, headerNav);
			const researchProps = settings && researchPost && researchSections ? toResearchFullProps(researchPost, researchSections, settings.author_name) : null;
			return {
				siteSettings: settings,
				heroProps: settings ? toHeroProps(settings, null) : null,
				footerProps: settings ? toFooterProps(settings, footerNav) : null,
				fixedNavProps: settings && headerNav ? toFixedNavProps(settings, headerNav) : null,
				sectionTabsProps: sectionTabs,
				pageSeoMap,
				researchProps,
				experimentsListProps,
				resumeProps
			};
		} catch (e) {
			console.error("[__root] beforeLoad failed:", e);
			return {
				siteSettings: null,
				heroProps: null,
				footerProps: null,
				fixedNavProps: null,
				sectionTabsProps: null,
				researchProps: null,
				experimentsListProps: null,
				resumeProps: null,
				pageSeoMap: {}
			};
		}
	},
	head: (headContext) => {
		const s = headContext?.context?.siteSettings ?? null;
		const title = s?.site_title ?? "聂灵晞 · AI 创作数据研究者 个人主页";
		const description = s?.site_description ?? "";
		const author = s?.author_name ?? "聂灵晞";
		return {
			meta: [
				{ charSet: "utf-8" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1"
				},
				{ title },
				{
					name: "description",
					content: description
				},
				{
					name: "author",
					content: author
				},
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:type",
					content: "website"
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				},
				{
					name: "twitter:site",
					content: "@Lovable"
				}
			],
			links: [
				{
					rel: "stylesheet",
					href: styles_default
				},
				{
					rel: "icon",
					href: "/favicon.ico",
					type: "image/x-icon"
				},
				{
					rel: "preconnect",
					href: "https://fonts.googleapis.com"
				},
				{
					rel: "preconnect",
					href: "https://fonts.gstatic.com",
					crossOrigin: "anonymous"
				},
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;600&family=Source+Serif+4:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
				},
				{
					rel: "stylesheet",
					href: "https://chinese-fonts-cdn.deno.dev/packages/zqfs/dist/ZhuqueFangsong-Regular/result.css"
				}
			]
		};
	},
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "zh-CN",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$7.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$6 = () => import("./admin-CBRinWxN.mjs");
var Route$6 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./admin-BbEgcIsP.mjs");
var Route$5 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./login-B3xnHePY.mjs");
var Route$4 = createFileRoute("/admin/login")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./media-G1L9RpoG.mjs");
var Route$3 = createFileRoute("/admin/media")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./navigation-C-YUPrpM.mjs");
var Route$2 = createFileRoute("/admin/navigation")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./settings-9UyNpl89.mjs");
var Route$1 = createFileRoute("/admin/settings")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./posts-eqyZ3oy6.mjs");
var Route = createFileRoute("/admin/posts/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$11.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$7
});
var AdminRoute = Route$6.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$7
});
var ResearchRoute = Route$10.update({
	id: "/research",
	path: "/research",
	getParentRoute: () => Route$7
});
var AdminIndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminLoginRoute = Route$4.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => AdminRoute
});
var AdminMediaRoute = Route$3.update({
	id: "/media",
	path: "/media",
	getParentRoute: () => AdminRoute
});
var AdminNavigationRoute = Route$2.update({
	id: "/navigation",
	path: "/navigation",
	getParentRoute: () => AdminRoute
});
var AdminSettingsRoute = Route$1.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRoute
});
var ExperimentsSlugRoute = Route$9.update({
	id: "/experiments/$slug",
	path: "/experiments/$slug",
	getParentRoute: () => Route$7
});
var AdminRouteChildren = {
	AdminLoginRoute,
	AdminMediaRoute,
	AdminNavigationRoute,
	AdminSettingsRoute,
	AdminIndexRoute,
	AdminPostsIndexRoute: Route.update({
		id: "/posts/",
		path: "/posts/",
		getParentRoute: () => AdminRoute
	}),
	AdminPostsIdEditRoute: Route$8.update({
		id: "/posts/$id/edit",
		path: "/posts/$id/edit",
		getParentRoute: () => AdminRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	ResearchRoute,
	ExperimentsSlugRoute
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
