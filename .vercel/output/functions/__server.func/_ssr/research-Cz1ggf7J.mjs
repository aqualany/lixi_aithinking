import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Footer, t as FixedNav } from "./Footer-BcWwXwlH.mjs";
import { t as Route } from "./research-mOZab8AG.mjs";
import { t as ResearchFull } from "./ResearchArticle-BeTBQXZ8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/research-Cz1ggf7J.js
var import_jsx_runtime = require_jsx_runtime();
function ResearchPage() {
	const rootCtx = Route.useRouteContext();
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
						hash: "research",
						className: "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground",
						children: "← 返回主页"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResearchFull, { data: rootCtx.researchProps ?? void 0 })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, { data: rootCtx.footerProps ?? void 0 })
		]
	});
}
//#endregion
export { ResearchPage as component };
