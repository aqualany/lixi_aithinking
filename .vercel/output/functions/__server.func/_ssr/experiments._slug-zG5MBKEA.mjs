import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./experiments._slug-B1ZpWLlb.mjs";
import { n as Footer, t as FixedNav } from "./Footer-BcWwXwlH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/experiments._slug-zG5MBKEA.js
var import_jsx_runtime = require_jsx_runtime();
function ExperimentDetail() {
	const rootCtx = Route.useRouteContext();
	const { slug } = Route.useParams();
	const data = rootCtx.expDetail ?? null ?? {
		num: "",
		date: "",
		category: "",
		title: "",
		hypothesis: "",
		optimization: [],
		selfTraining: [],
		screenshotUrls: []
	};
	const images = data.screenshotUrls;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FixedNav, { data: rootCtx.fixedNavProps ?? void 0 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-3xl px-6 pt-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						hash: "experiments",
						className: "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground",
						children: "← 返回实验笔记"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "border-t border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-3xl px-6 py-16",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground",
								children: [
									data.num,
									" · ",
									data.date,
									" · ",
									data.category
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-6 zh-title font-serif text-[36px] leading-[1.35] tracking-[0.02em] text-foreground sm:text-[42px]",
								children: data.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-8 border-l border-foreground pl-6 font-serif text-[17px] italic leading-[1.95] tracking-[0.02em] text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "not-italic font-medium",
									children: "假设。"
								}), data.hypothesis]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-16",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground",
										children: "一 · 与 AI 沟通过程"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-4 zh-title font-serif text-[24px] leading-[1.4] tracking-[0.02em] text-foreground",
										children: "提示词优化的过程"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-6 font-serif text-[16px] leading-[1.9] tracking-[0.01em] text-foreground",
										children: data.optimization?.[0] ?? ""
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
										className: "mt-8 space-y-4 border-l border-border pl-6 font-serif text-[15.5px] leading-[1.9] text-foreground",
										children: data.optimization.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-[11px] tracking-[0.15em] text-muted-foreground",
											children: ["步骤 ", String(i + 1).padStart(2, "0")]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1",
											children: step
										})] }, i))
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-16",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground",
										children: "二 · 对话截图"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 flex items-baseline justify-between",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "zh-title font-serif text-[24px] leading-[1.4] tracking-[0.02em] text-foreground",
											children: "与 AI 的往返"
										})
									}),
									images.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-6 border border-dashed border-border p-10 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-serif text-[15px] italic leading-[1.9] text-muted-foreground",
											children: [
												"还没有截图。点击右上「上传截图」，把你与 AI 的多轮对话按顺序放进来，",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
												"可上下滑动阅读。"
											]
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-6 max-h-[720px] space-y-6 overflow-y-auto border border-border p-4",
										children: images.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src,
												alt: `对话截图 ${i + 1}`,
												className: "block w-full border border-border"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
												className: "mt-2 flex items-baseline justify-between font-mono text-[11px] tracking-[0.15em] text-muted-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["截图 ", String(i + 1).padStart(2, "0")] })
											})]
										}, i))
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-16",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground",
										children: "三 · 自训练思路"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-4 zh-title font-serif text-[24px] leading-[1.4] tracking-[0.02em] text-foreground",
										children: "这条优化过程如何被 AI 自训练"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-6 font-serif text-[16px] leading-[1.9] tracking-[0.01em] text-muted-foreground",
										children: "把上面的“人 → AI → 反馈 → 再提示”这条链条形式化，就可以变成一份小型的、可训练的数据结构。以下是我从这次迭代里提炼的两条动作："
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
										className: "mt-8 space-y-6 font-serif text-[16px] leading-[1.95] text-foreground",
										children: data.selfTraining.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "grid grid-cols-[3rem_1fr] gap-4 border-b border-border pb-6 last:border-b-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-[12px] tracking-[0.15em] text-muted-foreground pt-1",
												children: String(i + 1).padStart(2, "0")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: s })]
										}, i))
									})
								]
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, { data: rootCtx.footerProps ?? void 0 })
		]
	});
}
//#endregion
export { ExperimentDetail as component };
