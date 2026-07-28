import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useRouter, f as Outlet, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-DaSXS_TQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CBRinWxN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLayout() {
	const router = useRouter();
	const [user, setUser] = (0, import_react.useState)(null);
	const [checking, setChecking] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (!session) {
				router.navigate({ to: "/admin/login" });
				return;
			}
			supabase.from("site_settings").select("admin_user_id").limit(1).single().then(({ data }) => {
				if (data?.admin_user_id === session.user.id) setUser(session.user);
				else router.navigate({ to: "/admin/login" });
				setChecking(false);
			});
		});
	}, []);
	const logout = async () => {
		await supabase.auth.signOut();
		router.navigate({ to: "/admin/login" });
	};
	if (checking) return null;
	if (!user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-stone-50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "w-56 border-r border-stone-200 bg-white p-6 text-sm flex flex-col justify-between min-h-screen",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-8 font-serif text-lg tracking-wide text-stone-800",
				children: "Lixi CMS"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1",
				children: [
					{
						to: "/admin",
						label: "仪表盘"
					},
					{
						to: "/admin/settings",
						label: "站点配置"
					},
					{
						to: "/admin/posts",
						label: "文章管理"
					},
					{
						to: "/admin/navigation",
						label: "导航管理"
					},
					{
						to: "/admin/media",
						label: "媒体库"
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					className: "block rounded-md px-3 py-2 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 [&.active]:bg-stone-100 [&.active]:text-stone-900 [&.active]:font-medium",
					children: item.label
				}) }, item.to))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: logout,
				className: "rounded-md px-3 py-2 text-left text-sm text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors",
				children: "退出登录"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 p-8 max-w-5xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})]
	});
}
//#endregion
export { AdminLayout as component };
