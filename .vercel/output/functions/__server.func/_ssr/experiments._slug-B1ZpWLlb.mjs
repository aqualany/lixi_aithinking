import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/experiments._slug-B1ZpWLlb.js
var _ssrClient = null;
/**
* Creates a Supabase client for SSR route loaders using the anon publishable key.
* Never imported in client bundles — only used inside route files' loader functions.
*/
function createSsrClient() {
	if (_ssrClient) return _ssrClient;
	const url = process.env.SUPABASE_URL;
	const key = process.env.SUPABASE_PUBLISHABLE_KEY;
	if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in SSR environment");
	_ssrClient = createClient(url, key, { auth: { persistSession: false } });
	return _ssrClient;
}
async function getPostsByContentType(supabase, contentTypeSlug) {
	const { data, error } = await supabase.from("posts").select("*, content_types!inner(slug)").eq("content_types.slug", contentTypeSlug).eq("status", "published").order("sort_order", { ascending: true });
	if (error) {
		console.error(`[CMS] getPostsByContentType(${contentTypeSlug}) failed:`, error.message);
		return [];
	}
	return data ?? [];
}
async function getPostBySlug(supabase, slug) {
	const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).eq("status", "published").limit(1).single();
	if (error) {
		console.error(`[CMS] getPostBySlug(${slug}) failed:`, error.message);
		return null;
	}
	return data;
}
async function getPostSections(supabase, postId) {
	const { data, error } = await supabase.from("post_sections").select("*").eq("post_id", postId).order("sort_order", { ascending: true });
	if (error) {
		console.error(`[CMS] getPostSections failed:`, error.message);
		return [];
	}
	return data ?? [];
}
function formatChineseDate(dateStr) {
	if (!dateStr) return "";
	const d = new Date(dateStr);
	const year = d.getFullYear();
	const month = d.getMonth() + 1;
	return `${String(year).split("").map((c) => "〇一二三四五六七八九"[parseInt(c)]).join("")}年${[
		"一",
		"二",
		"三",
		"四",
		"五",
		"六",
		"七",
		"八",
		"九",
		"十",
		"十一",
		"十二"
	][month - 1]}月`;
}
function formatExperimentDate(dateStr) {
	if (!dateStr) return "";
	const d = new Date(dateStr);
	return `${d.getFullYear()} · ${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function padHint(n) {
	return String(n + 1).padStart(2, "0");
}
function toHeroProps(settings, avatarUrl) {
	return {
		authorName: settings.author_name,
		authorNameEn: settings.author_name_en,
		heroEyebrow: settings.hero_eyebrow,
		bioLines: settings.bio_lines ?? [],
		avatarUrl
	};
}
function toFixedNavProps(settings, navItems) {
	return {
		authorName: settings.author_name,
		authorNameEn: settings.author_name_en,
		sections: navItems.map((n) => ({
			id: n.href.replace("/#", ""),
			label: n.label,
			href: n.href
		}))
	};
}
function toFooterProps(settings, footerNavItems) {
	const links = footerNavItems.map((n) => ({
		label: n.label,
		href: n.href,
		isExternal: n.is_external
	}));
	return {
		authorName: settings.author_name,
		authorNameEn: settings.author_name_en,
		links
	};
}
function toSectionTabsProps(pages, headerNav) {
	const sorted = [...pages.filter((p) => p.slug !== "home")].sort((a, b) => a.sort_order - b.sort_order);
	const navLabelMap = {};
	if (headerNav) for (const nav of headerNav) {
		const key = nav.href.replace("/#", "");
		navLabelMap[key] = nav.label;
	}
	return { tabs: sorted.map((p, i) => ({
		id: p.slug,
		label: navLabelMap[p.slug] ?? p.title,
		hint: padHint(i)
	})) };
}
function toPageSeoProps(page) {
	return {
		title: page.title,
		description: page.description
	};
}
function toResearchFullProps(post, sections, authorName) {
	const extra = post.extra ?? {};
	return {
		title: post.title,
		authorName,
		date: formatChineseDate(post.published_at),
		wordCount: extra.word_count ?? 0,
		summary: post.summary,
		sections: [...sections].sort((a, b) => a.sort_order - b.sort_order).map((s) => ({
			id: s.anchor,
			heading: s.title
		})),
		bodyMd: post.body_md
	};
}
function toExperimentCardData(posts) {
	return [...posts].sort((a, b) => a.sort_order - b.sort_order).map((p) => {
		const extra = p.extra ?? {};
		return {
			slug: p.slug,
			num: extra.num ?? "",
			date: formatExperimentDate(p.published_at),
			category: p.subtitle,
			title: p.title,
			keyInsight: p.summary
		};
	});
}
function toExperimentDetailProps(post, mediaRows) {
	const extra = post.extra ?? {};
	const extraCategory = extra;
	const screenshotUrls = mediaRows.map((m) => m.public_url);
	return {
		num: extra.num ?? "",
		date: formatExperimentDate(post.published_at),
		category: extraCategory.category ?? post.subtitle,
		title: post.title,
		hypothesis: extra.hypothesis ?? "",
		optimization: extra.optimization ?? [],
		selfTraining: extra.self_training ?? [],
		screenshotUrls
	};
}
function toResumeProps(post) {
	const extra = post.extra ?? {};
	return {
		title: post.title,
		summary: post.summary,
		experience: extra.experience ?? [],
		education: extra.education ?? [],
		writings: extra.writings ?? [],
		skills: extra.skills ?? []
	};
}
async function getMediaByIds(supabase, ids) {
	if (ids.length === 0) return [];
	const { data, error } = await supabase.from("media").select("*").in("id", ids);
	if (error) {
		console.error("[CMS] getMediaByIds failed:", error.message);
		return [];
	}
	return data ?? [];
}
var $$splitComponentImporter = () => import("./experiments._slug-zG5MBKEA.mjs");
var $$splitNotFoundComponentImporter = () => import("./experiments._slug-zX6o_Uv4.mjs");
var Route = createFileRoute("/experiments/$slug")({
	beforeLoad: async ({ params }) => {
		try {
			const supabase = createSsrClient();
			const post = await getPostBySlug(supabase, params.slug);
			if (!post) return { expDetail: null };
			const mediaIds = (post.extra ?? {}).screenshot_media_ids ?? [];
			return { expDetail: toExperimentDetailProps(post, mediaIds.length > 0 ? await getMediaByIds(supabase, mediaIds) : []) };
		} catch {
			return { expDetail: null };
		}
	},
	head: (ctx) => {
		const seo = ctx?.context?.pageSeoMap?.["experiments"] ?? null;
		return { meta: [
			{ title: seo?.title ?? "实验笔记 · 聂灵晞" },
			{
				name: "description",
				content: seo?.description ?? "AI 创作实验笔记：与模型协作的完整过程与自训练思路。"
			},
			{
				property: "og:title",
				content: seo?.title ?? "实验笔记 · 聂灵晞"
			},
			{
				property: "og:description",
				content: seo?.description ?? "提示词优化的过程记录与从中提炼的 AI 自训练思路。"
			}
		] };
	},
	loader: ({ params }) => {
		return { slug: params.slug };
	},
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { getPostsByContentType as a, toFooterProps as c, toResearchFullProps as d, toResumeProps as f, getPostSections as i, toHeroProps as l, createSsrClient as n, toExperimentCardData as o, toSectionTabsProps as p, getPostBySlug as r, toFixedNavProps as s, Route as t, toPageSeoProps as u };
