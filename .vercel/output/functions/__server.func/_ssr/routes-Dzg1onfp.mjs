import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dzg1onfp.js
var $$splitComponentImporter = () => import("./routes-xod5nHc7.mjs");
var Route = createFileRoute("/")({
	head: (ctx) => {
		const seo = ctx?.context?.pageSeoMap?.["home"] ?? null;
		return { meta: [
			{ title: seo?.title ?? "聂灵晞 · 写作者 · AI 创作探索" },
			{
				name: "description",
				content: seo?.description ?? "长文：论 AI 写作与语言理解；实验笔记：现代诗、宋词与小说的提示词迭代；简历：工作经历与联系方式。"
			},
			{
				property: "og:title",
				content: seo?.title ?? "聂灵晞 · 个人主页"
			},
			{
				property: "og:description",
				content: seo?.description ?? "关于创意数据的长文，一组提示词迭代的实验笔记，以及工作经历。"
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
