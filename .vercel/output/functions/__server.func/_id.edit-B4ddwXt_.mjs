import { i as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { _ as useRouter } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./_id.edit-DtkWxyLH.mjs";
import { t as supabase } from "./_ssr/client-DaSXS_TQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id.edit-B4ddwXt_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PostEditPage() {
	const { id } = Route.useParams();
	const router = useRouter();
	const isNew = id === "new";
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		slug: "",
		summary: "",
		body_md: "",
		status: "published",
		sort_order: 0,
		extra: "{}",
		content_type_id: ""
	});
	const [sections, setSections] = (0, import_react.useState)([]);
	const [types, setTypes] = (0, import_react.useState)([]);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		supabase.from("content_types").select("*").then(({ data }) => {
			if (data) setTypes(data);
		});
		if (!isNew) supabase.from("posts").select("*, post_sections(*)").eq("id", id).single().then(({ data }) => {
			if (data) {
				setForm({
					...data,
					extra: typeof data.extra === "object" ? JSON.stringify(data.extra, null, 2) : data.extra
				});
				setSections(data.post_sections ?? []);
			}
		});
	}, [id]);
	const save = async () => {
		setSaving(true);
		setMsg("");
		let extra = {};
		try {
			extra = JSON.parse(form.extra);
		} catch {
			setMsg("extra JSON 格式无效");
			setSaving(false);
			return;
		}
		const payload = {
			title: form.title,
			slug: form.slug,
			summary: form.summary,
			body_md: form.body_md,
			status: form.status,
			sort_order: Number(form.sort_order),
			extra,
			content_type_id: form.content_type_id
		};
		if (!isNew) payload.id = id;
		await supabase.auth.getSession();
		const { data: saved, error } = await supabase.from("posts").upsert(payload).select("id").single();
		if (error) {
			setMsg("保存失败: " + error.message);
			setSaving(false);
			return;
		}
		if (sections.length > 0) {
			await supabase.from("post_sections").delete().eq("post_id", saved.id);
			await supabase.from("post_sections").insert(sections.map((s, i) => ({
				post_id: saved.id,
				anchor: s.anchor || `sec-${i + 1}`,
				title: s.title,
				sort_order: i
			})));
		}
		setMsg("保存成功");
		setSaving(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-4xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold text-neutral-800",
				children: isNew ? "新建文章" : "编辑文章"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => router.navigate({ to: "/admin/posts" }),
				className: "text-sm text-neutral-500 hover:text-neutral-800",
				children: "← 返回列表"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-medium text-neutral-600",
						children: "标题"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.title,
						onChange: (e) => setForm({
							...form,
							title: e.target.value
						}),
						className: "mt-1 w-full rounded border px-3 py-2 text-sm"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-medium text-neutral-600",
						children: "Slug"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.slug,
						onChange: (e) => setForm({
							...form,
							slug: e.target.value
						}),
						className: "mt-1 w-full rounded border px-3 py-2 text-sm"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-medium text-neutral-600",
					children: "摘要"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.summary,
					onChange: (e) => setForm({
						...form,
						summary: e.target.value
					}),
					rows: 2,
					className: "mt-1 w-full rounded border px-3 py-2 text-sm"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-medium text-neutral-600",
					children: "正文 Markdown"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.body_md,
					onChange: (e) => setForm({
						...form,
						body_md: e.target.value
					}),
					rows: 12,
					className: "mt-1 w-full rounded border px-3 py-2 text-sm font-mono"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-medium text-neutral-600",
							children: "内容类型"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: form.content_type_id,
							onChange: (e) => setForm({
								...form,
								content_type_id: e.target.value
							}),
							className: "mt-1 w-full rounded border px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "选择"
							}), types.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: t.id,
								children: t.name
							}, t.id))]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-medium text-neutral-600",
							children: "状态"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: form.status,
							onChange: (e) => setForm({
								...form,
								status: e.target.value
							}),
							className: "mt-1 w-full rounded border px-3 py-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "published",
									children: "已发布"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "draft",
									children: "草稿"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "archived",
									children: "归档"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-medium text-neutral-600",
							children: "排序"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: form.sort_order,
							onChange: (e) => setForm({
								...form,
								sort_order: e.target.value
							}),
							className: "mt-1 w-full rounded border px-3 py-2 text-sm"
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-medium text-neutral-600",
						children: "章节"
					}),
					sections.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: s.anchor,
								onChange: (e) => {
									const ns = [...sections];
									ns[i].anchor = e.target.value;
									setSections(ns);
								},
								placeholder: "锚点",
								className: "w-24 rounded border px-2 py-1 text-xs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: s.title,
								onChange: (e) => {
									const ns = [...sections];
									ns[i].title = e.target.value;
									setSections(ns);
								},
								placeholder: "标题",
								className: "flex-1 rounded border px-2 py-1 text-xs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSections(sections.filter((_, j) => j !== i)),
								className: "text-xs text-red-500",
								children: "删除"
							})
						]
					}, i)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setSections([...sections, {
							anchor: "",
							title: ""
						}]),
						className: "mt-2 text-xs text-blue-600",
						children: "+ 添加章节"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-medium text-neutral-600",
					children: "Extra JSON"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.extra,
					onChange: (e) => setForm({
						...form,
						extra: e.target.value
					}),
					rows: 6,
					className: "mt-1 w-full rounded border px-3 py-2 text-sm font-mono"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: save,
					disabled: saving,
					className: "rounded bg-neutral-900 px-6 py-2 text-sm text-white hover:bg-neutral-700 disabled:opacity-50",
					children: saving ? "保存中..." : "保存"
				}),
				msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					style: { color: msg.includes("失败") ? "red" : "green" },
					children: msg
				})
			]
		})]
	});
}
//#endregion
export { PostEditPage as component };
