import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-DaSXS_TQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-9UyNpl89.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const [form, setForm] = (0, import_react.useState)({});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		supabase.from("site_settings").select("*").limit(1).single().then(({ data }) => {
			if (data) setForm(data);
		});
	}, []);
	const save = async () => {
		setSaving(true);
		setMsg("");
		await supabase.auth.getSession();
		const { error } = await supabase.from("site_settings").update({
			site_title: form.site_title,
			site_description: form.site_description,
			author_name: form.author_name,
			author_name_en: form.author_name_en,
			hero_eyebrow: form.hero_eyebrow,
			github_url: form.github_url,
			contact_email: form.contact_email
		}).eq("id", form.id);
		if (error) setMsg("保存失败: " + error.message);
		else setMsg("保存成功");
		setSaving(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-6 text-xl font-semibold text-neutral-800",
			children: "站点配置"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				[
					"site_title",
					"site_description",
					"author_name",
					"author_name_en",
					"hero_eyebrow",
					"github_url",
					"contact_email"
				].map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-sm font-medium text-neutral-700",
					children: field
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: form[field] ?? "",
					onChange: (e) => setForm({
						...form,
						[field]: e.target.value
					}),
					className: "w-full rounded border border-neutral-300 px-3 py-2 text-sm"
				})] }, field)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-sm font-medium text-neutral-700",
					children: "简介（每行一句）"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: (form.bio_lines ?? []).join("\n"),
					onChange: (e) => setForm({
						...form,
						bio_lines: e.target.value.split("\n")
					}),
					rows: 4,
					className: "w-full rounded border border-neutral-300 px-3 py-2 text-sm"
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
export { SettingsPage as component };
