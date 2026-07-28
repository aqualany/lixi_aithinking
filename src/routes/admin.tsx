import { createFileRoute, Outlet, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (!session) { router.navigate({ to: '/admin/login' }); return; }
      (supabase.from('site_settings') as any).select('admin_user_id').limit(1).single().then(({ data }: any) => {
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

  if (checking) return null;
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-stone-50">
      <nav className="w-56 border-r border-stone-200 bg-white p-6 text-sm flex flex-col justify-between min-h-screen">
        <div>
          <p className="mb-8 font-serif text-lg tracking-wide text-stone-800">Lixi CMS</p>
          <ul className="space-y-1">
            {[
              { to: "/admin", label: "仪表盘" },
              { to: "/admin/settings", label: "站点配置" },
              { to: "/admin/posts", label: "文章管理" },
              { to: "/admin/navigation", label: "导航管理" },
              { to: "/admin/media", label: "媒体库" },
            ].map((item) => (
              <li key={item.to}>
                <Link to={item.to as any}
                  className="block rounded-md px-3 py-2 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 [&.active]:bg-stone-100 [&.active]:text-stone-900 [&.active]:font-medium">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={logout} className="rounded-md px-3 py-2 text-left text-sm text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
          退出登录
        </button>
      </nav>
      <main className="flex-1 p-8 max-w-5xl">
        <Outlet />
      </main>
    </div>
  );
}
