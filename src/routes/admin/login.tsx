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
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session) router.navigate({ to: '/admin' });
    });
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    const { data: settings } = await (supabase.from('site_settings') as any).select('admin_user_id').limit(1).single();
    if (settings?.admin_user_id !== data.user.id) {
      await supabase.auth.signOut();
      setError("此账号无管理员权限"); setLoading(false); return;
    }
    router.navigate({ to: '/admin' });
  };

  return (
    <div className="flex min-h-screen bg-stone-50/80">
      <div className="m-auto w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-serif text-2xl tracking-wide text-stone-800">Lixi CMS</p>
          <p className="mt-1 text-sm text-stone-400">管理后台</p>
        </div>
        <form onSubmit={login} className="rounded-xl border border-stone-200 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-lg font-medium text-stone-800">登录</h1>
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="space-y-4">
            <div>
              <label className="block mb-1.5 text-xs font-medium text-stone-500 uppercase tracking-wider">邮箱</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-400 transition-colors"
                placeholder="name@example.com" required />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-medium text-stone-500 uppercase tracking-wider">密码</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-400 transition-colors"
                placeholder="••••••••" required />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="mt-6 w-full rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-50">
            {loading ? "验证中…" : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
