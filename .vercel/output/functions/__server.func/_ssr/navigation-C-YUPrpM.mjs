import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-DaSXS_TQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/navigation-C-YUPrpM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NavAdminPage() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const load = () => {
		supabase.from("navigation").select("*").order("sort_order").then(({ data }) => {
			if (data) setItems(data);
		});
	};
	const save = async (nav) => {
		setSaving(true);
		const { error } = await supabase.from("navigation").upsert(nav);
		if (error) setMsg(error.message);
		else {
			setMsg("保存成功");
			load();
		}
		setSaving(false);
		setEditing(null);
	};
	const del = async (id) => {
		if (!confirm("确认删除？")) return;
		await supabase.from("navigation").delete().eq("id", id);
		load();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold text-neutral-800",
					children: "导航管理"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setEditing({
						location: "header",
						label: "",
						href: "",
						is_external: false,
						sort_order: items.length + 1
					}),
					className: "rounded bg-neutral-900 px-4 py-2 text-sm text-white",
					children: "新建"
				})]
			}),
			msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm",
				style: { color: msg.includes("失败") ? "red" : "green" },
				children: msg
			}),
			editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 rounded border bg-white p-4 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "mb-3 text-sm font-semibold",
						children: [editing.id ? "编辑" : "新建", "导航项"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: editing.location,
								onChange: (e) => setEditing({
									...editing,
									location: e.target.value
								}),
								className: "rounded border px-3 py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "header",
									children: "Header"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "footer",
									children: "Footer"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: editing.label,
								onChange: (e) => setEditing({
									...editing,
									label: e.target.value
								}),
								placeholder: "标签",
								className: "rounded border px-3 py-2 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: editing.href,
								onChange: (e) => setEditing({
									...editing,
									href: e.target.value
								}),
								placeholder: "链接",
								className: "rounded border px-3 py-2 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: editing.is_external,
									onChange: (e) => setEditing({
										...editing,
										is_external: e.target.checked
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "外部链接" })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => save(editing),
							disabled: saving,
							className: "rounded bg-neutral-900 px-4 py-1.5 text-xs text-white",
							children: "保存"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setEditing(null),
							className: "rounded border px-4 py-1.5 text-xs",
							children: "取消"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b text-left text-neutral-500",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 pr-4",
							children: "位置"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 pr-4",
							children: "标签"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 pr-4",
							children: "链接"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 pr-4",
							children: "排序"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "pb-2" })
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: items.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 pr-4",
							children: n.location
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 pr-4",
							children: n.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 pr-4 text-neutral-500",
							children: n.href
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 pr-4",
							children: n.sort_order
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setEditing(n),
								className: "text-blue-600 hover:underline mr-3",
								children: "编辑"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => del(n.id),
								className: "text-red-500 hover:underline",
								children: "删除"
							})]
						})
					]
				}, n.id)) })]
			})
		]
	});
}
//#endregion
export { NavAdminPage as component };
