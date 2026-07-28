import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, l as useLocation } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Footer-BcWwXwlH.js
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_PROPS$1 = {
	authorName: "聂灵晞",
	authorNameEn: "Nie Lingxi",
	sections: [
		{
			id: "research",
			label: "研究"
		},
		{
			id: "experiments",
			label: "实验"
		},
		{
			id: "resume",
			label: "简历"
		}
	].map((s) => ({
		id: s.id,
		label: s.label,
		href: `/#${s.id}`
	}))
};
function FixedNav({ activeTab, onTabChange, data }) {
	const d = data ?? FALLBACK_PROPS$1;
	const onHome = useLocation().pathname === "/";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-12 max-w-5xl items-center justify-between px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-baseline gap-3 font-serif text-[15px] tracking-[0.05em] text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d.authorName }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline text-[11px] font-sans tracking-[0.2em] text-muted-foreground uppercase",
					children: d.authorNameEn
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex items-center gap-6 sm:gap-9 text-[13px]",
				children: d.sections.map((s) => {
					const className = "transition-colors tracking-[0.15em] " + (onHome && activeTab === s.id ? "text-foreground border-b border-foreground pb-0.5" : "text-muted-foreground hover:text-foreground");
					if (onHome && onTabChange) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className,
						onClick: () => onTabChange(s.id),
						children: s.label
					}) }, s.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						hash: s.id,
						className,
						children: s.label
					}) }, s.id);
				})
			})]
		})
	});
}
var FALLBACK_PROPS = {
	authorName: "聂蓝玉",
	authorNameEn: "Nie Lanyu",
	links: [{
		label: "nielanyu@example.com",
		href: "mailto:nielanyu@example.com",
		isExternal: true
	}, {
		label: "GitHub",
		href: "https://github.com/",
		isExternal: true
	}]
};
function Footer({ data }) {
	const d = data ?? FALLBACK_PROPS;
	const emailLink = d.links.find((l) => l.href.startsWith("mailto:"));
	const githubLink = d.links.find((l) => l.href.includes("github"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-border bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-6 py-14",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-baseline justify-between gap-y-4 font-mono text-[12px] tracking-[0.12em] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"© 2026　",
					d.authorName,
					"　",
					d.authorNameEn
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-x-5",
					children: [emailLink && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: emailLink.href,
						className: "transition-colors hover:text-foreground",
						children: emailLink.label
					}), githubLink && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: githubLink.href,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "inline-flex items-center gap-1.5 transition-colors hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							width: "12",
							height: "12",
							viewBox: "0 0 24 24",
							fill: "currentColor",
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" })
						}), githubLink.label]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-serif text-[13px] italic tracking-[0.02em] text-muted-foreground",
				children: "本站正文以思源宋体排版，元数据以思源黑体。感谢阅读。"
			})]
		})
	});
}
//#endregion
export { Footer as n, FixedNav as t };
