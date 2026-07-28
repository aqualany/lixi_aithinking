import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-DaSXS_TQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BbEgcIsP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboard() {
	const [stats, setStats] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		Promise.all([
			supabase.from("posts").select("id", {
				count: "exact",
				head: true
			}),
			supabase.from("pages").select("id", {
				count: "exact",
				head: true
			}),
			supabase.from("navigation").select("id", {
				count: "exact",
				head: true
			}),
			supabase.from("media").select("id", {
				count: "exact",
				head: true
			})
		]).then(([posts, pages, nav, media]) => {
			setStats({
				posts: posts.count ?? 0,
				pages: pages.count ?? 0,
				navigation: nav.count ?? 0,
				media: media.count ?? 0
			});
			setLoading(false);
		});
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-sm text-neutral-500",
		children: "加载中..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-6 text-xl font-semibold text-neutral-800",
			children: "仪表盘"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-4 gap-4",
			children: Object.entries(stats).map(([key, val]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border bg-white p-4 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-neutral-500",
					children: key
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-2xl font-bold text-neutral-800",
					children: val
				})]
			}, key))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-10 mb-3 text-lg font-semibold text-neutral-800",
			children: "快速操作"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/admin/posts",
					className: "rounded border bg-white p-4 text-sm text-neutral-700 hover:bg-neutral-50 shadow-sm",
					children: "编辑文章"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/admin/navigation",
					className: "rounded border bg-white p-4 text-sm text-neutral-700 hover:bg-neutral-50 shadow-sm",
					children: "管理导航"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/admin/settings",
					className: "rounded border bg-white p-4 text-sm text-neutral-700 hover:bg-neutral-50 shadow-sm",
					children: "站点配置"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/admin/media",
					className: "rounded border bg-white p-4 text-sm text-neutral-700 hover:bg-neutral-50 shadow-sm",
					children: "媒体库"
				})
			]
		})
	] });
}
//#endregion
export { AdminDashboard as component };
