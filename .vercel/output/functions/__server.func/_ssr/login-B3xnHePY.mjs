import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-DaSXS_TQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-B3xnHePY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (session) router.navigate({ to: "/admin" });
		});
	}, []);
	const login = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		const { data, error: authError } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (authError) {
			setError(authError.message);
			setLoading(false);
			return;
		}
		const { data: settings } = await supabase.from("site_settings").select("admin_user_id").limit(1).single();
		if (settings?.admin_user_id !== data.user.id) {
			await supabase.auth.signOut();
			setError("此账号无管理员权限");
			setLoading(false);
			return;
		}
		router.navigate({ to: "/admin" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-screen items-center justify-center bg-neutral-50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: login,
			className: "w-80 rounded-lg border bg-white p-6 shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mb-4 text-lg font-semibold text-neutral-800",
					children: "管理员登录"
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm text-red-500",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "email",
					placeholder: "邮箱",
					value: email,
					onChange: (e) => setEmail(e.target.value),
					className: "mb-3 w-full rounded border px-3 py-2 text-sm",
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "password",
					placeholder: "密码",
					value: password,
					onChange: (e) => setPassword(e.target.value),
					className: "mb-4 w-full rounded border px-3 py-2 text-sm",
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: loading,
					className: "w-full rounded bg-neutral-900 py-2 text-sm text-white hover:bg-neutral-700 disabled:opacity-50",
					children: loading ? "登录中..." : "登录"
				})
			]
		})
	});
}
//#endregion
export { LoginPage as component };
