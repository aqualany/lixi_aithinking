import { createFileRoute, Link } from "@tanstack/react-router";
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
      (supabase.from('posts') as any).select('*', { count: 'exact', head: true }),
      (supabase.from('pages') as any).select('id', { count: 'exact', head: true }),
      (supabase.from('navigation') as any).select('id', { count: 'exact', head: true }),
      (supabase.from('media') as any).select('id', { count: 'exact', head: true }),
    ]).then(([posts, pages, nav, media]: any) => {
      setStats({
        posts: posts.count ?? 0,
        pages: pages.count ?? 0,
        navigation: nav.count ?? 0,
        media: media.count ?? 0,
      });
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: "文章", value: stats.posts, icon: "◇", color: "text-stone-700", to: "/admin/posts" },
    { label: "页面", value: stats.pages, icon: "◈", color: "text-stone-500", to: "/admin/settings" },
    { label: "导航项", value: stats.navigation, icon: "☰", color: "text-stone-500", to: "/admin/navigation" },
    { label: "媒体文件", value: stats.media, icon: "◫", color: "text-stone-500", to: "/admin/media" },
  ];

  return (
    <div>
      <h1 className="text-xl font-medium text-stone-800 mb-1">仪表盘</h1>
      <p className="text-sm text-stone-400 mb-8">站点内容概览</p>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to as any}
            className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-2xl font-light text-stone-700">{c.value}</p>
            <p className="mt-1 text-xs text-stone-400">{c.label}</p>
          </Link>
        ))}
      </div>

      <h2 className="text-sm font-medium text-stone-600 mt-10 mb-4">快捷操作</h2>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "写新文章", to: "/admin/posts/new/edit", sub: "富文本编辑器" },
          { label: "管理导航", to: "/admin/navigation", sub: "Header / Footer" },
          { label: "站点配置", to: "/admin/settings", sub: "名称 / 简介" },
          { label: "上传媒体", to: "/admin/media", sub: "图片管理" },
        ].map((item) => (
          <Link key={item.label} to={item.to as any}
            className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-stone-700">{item.label}</p>
            <p className="mt-0.5 text-xs text-stone-400">{item.sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
