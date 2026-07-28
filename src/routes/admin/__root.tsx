import { createFileRoute, Outlet, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/__root")({
  component: AdminLayout,
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return { session };
  },
});

function AdminLayout() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.navigate({ to: '/admin/login' }); return; }
      (supabase as any).from("site_settings" as any).select("admin_user_id").limit(1).single().then(({ data }: any) => {
        if (data?.admin_user_id === session.user.id) setUser(session.user);
        else router.navigate({ to: '/admin/login' });
        setChecking(false);
      });
    });
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: '/admin/login' });
  };

  if (checking) return <div className="flex h-screen items-center justify-center font-mono text-sm">验证身份...</div>;
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <nav className="w-56 border-r border-neutral-200 bg-white p-4 text-sm">
        <p className="mb-6 font-semibold text-neutral-800">CMS 管理</p>
        <ul className="space-y-2">
          <li><Link to="/admin" className="block text-neutral-600 hover:text-neutral-900">仪表盘</Link></li>
          <li><Link to="/admin/settings" className="block text-neutral-600 hover:text-neutral-900">站点配置</Link></li>
          <li><Link to="/admin/posts" className="block text-neutral-600 hover:text-neutral-900">文章管理</Link></li>
          <li><Link to="/admin/navigation" className="block text-neutral-600 hover:text-neutral-900">导航管理</Link></li>
          <li><Link to="/admin/media" className="block text-neutral-600 hover:text-neutral-900">媒体库</Link></li>
          <li className="pt-4 border-t"><button onClick={logout} className="text-red-500 hover:text-red-700">退出登录</button></li>
        </ul>
      </nav>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
