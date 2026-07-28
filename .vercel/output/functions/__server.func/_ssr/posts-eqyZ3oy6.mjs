import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-DaSXS_TQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/posts-eqyZ3oy6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PostListPage() {
	const [posts, setPosts] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		supabase.from("posts").select("*, content_types(name)").order("sort_order").then(({ data }) => {
			if (data) setPosts(data);
		});
	}, []);
	const del = async (id) => {
		if (!confirm("确认删除？")) return;
		await supabase.from("posts").delete().eq("id", id);
		setPosts(posts.filter((p) => p.id !== id));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl font-semibold text-neutral-800",
			children: "文章管理"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/admin/posts/new",
			className: "rounded bg-neutral-900 px-4 py-2 text-sm text-white",
			children: "新建"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
		className: "w-full text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
			className: "border-b text-left text-neutral-500",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "pb-2 pr-4",
					children: "标题"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "pb-2 pr-4",
					children: "类型"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "pb-2 pr-4",
					children: "状态"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "pb-2" })
			]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: posts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
			className: "border-b",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "py-2 pr-4",
					children: p.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "py-2 pr-4 text-neutral-500",
					children: p.content_types?.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "py-2 pr-4 text-neutral-500",
					children: p.status
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
					className: "py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/posts/$id/edit",
						params: { id: p.id },
						className: "text-blue-600 hover:underline mr-3",
						children: "编辑"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => del(p.id),
						className: "text-red-500 hover:underline",
						children: "删除"
					})]
				})
			]
		}, p.id)) })]
	})] });
}
//#endregion
export { PostListPage as component };
