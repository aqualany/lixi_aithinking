import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/experiments._slug-zX6o_Uv4.js
var import_jsx_runtime = require_jsx_runtime();
var SplitNotFoundComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "flex min-h-screen items-center justify-center px-6",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-serif text-[20px] text-foreground",
			children: "未找到这则实验笔记。"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			hash: "experiments",
			className: "mt-4 inline-block font-mono text-[12px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground",
			children: "← 返回主页"
		})]
	})
});
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
