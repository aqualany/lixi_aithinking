import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.navigate({ to: '/admin' });
    });
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    const { data: settings } = await supabase.from('site_settings').select('admin_user_id').limit(1).single();
    if (settings?.admin_user_id !== data.user.id) {
      await supabase.auth.signOut();
      setError("此账号无管理员权限"); setLoading(false); return;
    }
    router.navigate({ to: '/admin' });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-50">
      <form onSubmit={login} className="w-80 rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-lg font-semibold text-neutral-800">管理员登录</h1>
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        <input type="email" placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)}
          className="mb-3 w-full rounded border px-3 py-2 text-sm" required />
        <input type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)}
          className="mb-4 w-full rounded border px-3 py-2 text-sm" required />
        <button type="submit" disabled={loading}
          className="w-full rounded bg-neutral-900 py-2 text-sm text-white hover:bg-neutral-700 disabled:opacity-50">
          {loading ? "登录中..." : "登录"}
        </button>
      </form>
    </div>
  );
}
