import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-DaSXS_TQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/media-G1L9RpoG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MediaAdminPage() {
	const [files, setFiles] = (0, import_react.useState)([]);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const load = () => {
		supabase.from("media").select("*").order("created_at", { ascending: false }).then(({ data }) => {
			if (data) setFiles(data);
		});
	};
	const upload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		setMsg("");
		const ext = file.name.split(".").pop();
		const path = `uploads/${Date.now()}.${ext}`;
		const { error: storageErr } = await supabase.storage.from("media").upload(path, file);
		if (storageErr) {
			setMsg("上传失败: " + storageErr.message);
			setUploading(false);
			return;
		}
		const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
		const { error: dbErr } = await supabase.from("media").insert({
			storage_path: path,
			public_url: publicUrl,
			mime_type: file.type,
			alt: file.name
		});
		if (dbErr) setMsg("入库失败: " + dbErr.message);
		else {
			setMsg("上传成功");
			load();
		}
		setUploading(false);
	};
	const del = async (id, path) => {
		if (!confirm("确认删除？")) return;
		await supabase.storage.from("media").remove([path]);
		await supabase.from("media").delete().eq("id", id);
		load();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold text-neutral-800",
					children: "媒体库"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "cursor-pointer rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700",
					children: [uploading ? "上传中..." : "上传文件", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/*",
						onChange: upload,
						className: "hidden",
						disabled: uploading
					})]
				})]
			}),
			msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm",
				style: { color: msg.includes("失败") ? "red" : "green" },
				children: msg
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-4 gap-4",
				children: files.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border bg-white p-2 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: f.public_url,
							alt: f.alt,
							className: "mb-2 h-32 w-full object-cover rounded"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-neutral-500",
							children: f.alt
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => del(f.id, f.storage_path),
							className: "mt-1 text-xs text-red-500",
							children: "删除"
						})
					]
				}, f.id))
			})
		]
	});
}
//#endregion
export { MediaAdminPage as component };
