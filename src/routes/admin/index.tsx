import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('posts').select('id', { count: 'exact', head: true }),
      supabase.from('pages').select('id', { count: 'exact', head: true }),
      supabase.from('navigation').select('id', { count: 'exact', head: true }),
      supabase.from('media').select('id', { count: 'exact', head: true }),
    ]).then(([posts, pages, nav, media]) => {
      setStats({
        posts: posts.count ?? 0,
        pages: pages.count ?? 0,
        navigation: nav.count ?? 0,
        media: media.count ?? 0,
      });
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-sm text-neutral-500">加载中...</div>;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-neutral-800">仪表盘</h1>
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, val]) => (
          <div key={key} className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-neutral-500">{key}</p>
            <p className="mt-1 text-2xl font-bold text-neutral-800">{val as number}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-10 mb-3 text-lg font-semibold text-neutral-800">快速操作</h2>
      <div className="grid grid-cols-2 gap-3">
        <a href="/admin/posts" className="rounded border bg-white p-4 text-sm text-neutral-700 hover:bg-neutral-50 shadow-sm">编辑文章</a>
        <a href="/admin/navigation" className="rounded border bg-white p-4 text-sm text-neutral-700 hover:bg-neutral-50 shadow-sm">管理导航</a>
        <a href="/admin/settings" className="rounded border bg-white p-4 text-sm text-neutral-700 hover:bg-neutral-50 shadow-sm">站点配置</a>
        <a href="/admin/media" className="rounded border bg-white p-4 text-sm text-neutral-700 hover:bg-neutral-50 shadow-sm">媒体库</a>
      </div>
    </div>
  );
}
