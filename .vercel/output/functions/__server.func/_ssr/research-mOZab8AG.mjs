import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/research-mOZab8AG.js
var $$splitComponentImporter = () => import("./research-Cz1ggf7J.mjs");
var Route = createFileRoute("/research")({
	head: (ctx) => {
		const seo = ctx?.context?.pageSeoMap?.["research"] ?? null;
		return { meta: [
			{ title: seo?.title ?? "流畅之后 · 论写作、语言理解与创意数据 · 聂灵晞" },
			{
				name: "description",
				content: seo?.description ?? "一篇关于 AI 写作、语言理解与创意数据的长文。聂灵晞著。"
			},
			{
				property: "og:title",
				content: seo?.title ?? "流畅之后：论写作、语言理解与创意数据"
			},
			{
				property: "og:description",
				content: seo?.description ?? "从数据的角度重述 AI 写作在意义层遇到的问题。"
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
