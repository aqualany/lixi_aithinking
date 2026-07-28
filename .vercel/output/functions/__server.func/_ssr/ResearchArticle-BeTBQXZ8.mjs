import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
import { t as remarkGfm } from "../_libs/remark-gfm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ResearchArticle-BeTBQXZ8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var customComponents = {
	h3: ({ id, children, ...props }) => {
		const kids = import_react.Children.toArray(children);
		let anchor = id;
		const filtered = kids.filter((child) => {
			if (typeof child === "string" && child.startsWith("{#")) {
				anchor = child.slice(2, -1);
				return false;
			}
			if (typeof child === "object" && "props" in child) {
				const text = child.props?.children;
				if (typeof text === "string" && text.startsWith("{#")) {
					anchor = text.slice(2, -1);
					return false;
				}
			}
			return true;
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			id: anchor,
			className: "scroll-mt-24",
			...props,
			children: filtered
		});
	},
	p: ({ children, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		...props,
		children
	}),
	hr: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "divider-dots",
		"aria-hidden": true,
		children: "· · ·"
	})
};
function ProseMarkdown({ content }) {
	if (!content) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
		remarkPlugins: [remarkGfm],
		components: customComponents,
		children: content
	});
}
var FALLBACK_PROPS = {
	title: "流畅之后：论写作、语言理解与创意数据",
	authorName: "聂灵晞",
	date: "二〇二六年十一月",
	wordCount: 4800,
	summary: "大语言模型已经学会流畅地写作，但流畅并不等于意义...",
	sections: [
		{
			id: "sec-1",
			heading: "一、流畅的高原"
		},
		{
			id: "sec-2",
			heading: "二、语言理解真正要求什么"
		},
		{
			id: "sec-3",
			heading: "三、创意数据作为一个产品问题"
		},
		{
			id: "sec-4",
			heading: "四、三条我反复回到的原则"
		},
		{
			id: "sec-5",
			heading: "五、这份主页想论证什么"
		}
	],
	bodyMd: ""
};
function Header({ data, linkTitle = false }) {
	const Title = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "zh-title font-serif text-[36px] leading-[1.35] tracking-[0.02em] text-foreground sm:text-[44px]",
		children: data.title
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground",
			children: "研究 · 论文 01"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: linkTitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/research",
				className: "group inline-block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block group-hover:underline underline-offset-[8px] decoration-[0.5px]",
					children: Title
				})
			}) : Title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[12px] tracking-[0.12em] text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: data.authorName }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					children: "·"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: data.date }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					children: "·"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"约 ",
					data.wordCount.toLocaleString(),
					" 字"
				] })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-10 border-l border-foreground pl-6 font-serif text-[17px] italic leading-[1.95] tracking-[0.02em] text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "not-italic font-medium",
				children: "摘要。"
			}), data.summary]
		})
	] });
}
function Sidebar({ data, activeOnly }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "hidden md:block",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky top-24 border-l border-border pl-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground",
				children: "目录"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-3",
				children: data.sections.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: activeOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `#${s.id}`,
					className: "font-serif text-[13.5px] leading-[1.7] text-muted-foreground transition-colors hover:text-foreground",
					children: s.heading
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/research",
					hash: s.id,
					className: "font-serif text-[13.5px] leading-[1.7] text-muted-foreground transition-colors hover:text-foreground",
					children: s.heading
				}) }, s.id))
			})]
		})
	});
}
function ResearchPreview({ data }) {
	const d = data ?? FALLBACK_PROPS;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "research",
		className: "scroll-mt-24 border-t border-border bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-6 py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				data: d,
				linkTitle: true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-14 md:grid md:grid-cols-[1fr_180px] md:gap-x-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
						className: "prose-article fade-mask-b",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProseMarkdown, { content: d.bodyMd })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/research",
						className: "group inline-flex items-center gap-3 border border-foreground px-6 py-2.5 font-serif text-[15px] tracking-[0.15em] text-foreground transition-colors hover:bg-foreground hover:text-background",
						children: ["阅读全文", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							className: "transition-transform group-hover:translate-x-1",
							children: "→"
						})]
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, { data: d })]
			})]
		})
	});
}
function ResearchFull({ data }) {
	const d = data ?? FALLBACK_PROPS;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-t border-border bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-6 py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, { data: d }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-14 md:grid md:grid-cols-[1fr_180px] md:gap-x-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
					className: "prose-article",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProseMarkdown, { content: d.bodyMd })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {
					data: d,
					activeOnly: true
				})]
			})]
		})
	});
}
//#endregion
export { ResearchPreview as n, ResearchFull as t };
