import { createFileRoute, Outlet, Link, useRouter, useMatches } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV_ITEMS = [
  { to: "/admin", label: "仪表盘", icon: "▣" },
  { to: "/admin/settings", label: "站点配置", icon: "⚙" },
  { to: "/admin/posts", label: "文章管理", icon: "◇" },
  { to: "/admin/experiments", label: "实验笔记", icon: "△" },
  { to: "/admin/resume", label: "简历管理", icon: "○" },
  { to: "/admin/navigation", label: "导航管理", icon: "☰" },
  { to: "/admin/media", label: "媒体库", icon: "◫" },
];

function AdminLayout() {
  const router = useRouter();
  const matches = useMatches();
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  const currentPath = matches[matches.length - 1]?.routeId ?? "";

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
    <div className="flex min-h-screen bg-stone-50/80">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-stone-200 bg-white flex flex-col">
        <div className="px-6 pt-8 pb-6 border-b border-stone-100">
          <p className="font-serif text-lg tracking-wide text-stone-800">Lixi CMS</p>
          <p className="mt-0.5 text-xs text-stone-400">管理后台</p>
        </div>
        <nav className="flex-1 px-3 pt-4 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath.includes(item.to) && item.to !== "/admin" 
              ? currentPath.includes(item.to)
              : currentPath.endsWith('/admin') && item.to === "/admin";
            return (
              <Link
                key={item.to}
                to={item.to as any}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-stone-100 text-stone-900 font-medium"
                    : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
                }`}
              >
                <span className="w-5 text-center text-xs">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pb-6 pt-4 border-t border-stone-100">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <span className="w-5 text-center text-xs">↩</span>
            退出登录
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0">
        <header className="h-14 shrink-0 border-b border-stone-200 bg-white flex items-center px-8">
          <p className="text-sm text-stone-400 font-mono">
            / {currentPath.replace(/\/+$/, '').split('/').slice(1).join(' / ')}
          </p>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
