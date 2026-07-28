import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/posts/")({
  component: PostListPage,
});

function PostListPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    (supabase.from('posts') as any).select('*, content_types(name)').order('sort_order').then(({ data }: any) => {
      if (data) setPosts(data);
    });
  }, []);

  const del = async (id: string) => {
    if (!confirm('确认删除？此操作不可撤回。')) return;
    await (supabase.from('posts') as any).delete().eq('id', id);
    setPosts(posts.filter(p => p.id !== id));
  };

  const statusBadge = (status: string) => {
    const colors: any = { published: "bg-green-50 text-green-700 border-green-200", draft: "bg-amber-50 text-amber-700 border-amber-200", archived: "bg-stone-50 text-stone-500 border-stone-200" };
    return <span className={`text-xs px-2 py-0.5 rounded-full border ${colors[status] || colors.draft}`}>{status}</span>;
  };

  const typeColor = (name: string) => {
    const colors: any = { "研究文章": "text-blue-600", "实验笔记": "text-purple-600", "简历": "text-stone-600" };
    return <span className={`text-xs font-mono ${colors[name] || "text-stone-500"}`}>{name}</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-medium text-stone-800">文章管理</h1>
        <a href="/admin/posts/new" className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition-colors inline-block">+ 新建</a>
      </div>
      <p className="text-sm text-stone-400 mb-8">共 {posts.length} 篇</p>

      <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/50">
              <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">标题</th>
              <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">类型</th>
              <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">状态</th>
              <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">更新</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50 transition-colors">
                <td className="px-5 py-4 text-stone-800 font-medium">{p.title}</td>
                <td className="px-5 py-4">{typeColor(p.content_types?.name)}</td>
                <td className="px-5 py-4">{statusBadge(p.status)}</td>
                <td className="px-5 py-4 text-xs text-stone-400">{p.updated_at?.slice(0, 10)}</td>
                <td className="px-5 py-4 text-right">
                  <Link to="/admin/posts/$id/edit" params={{ id: p.id }} className="text-stone-500 hover:text-stone-800 text-xs mr-4 transition-colors">编辑</Link>
                  <button onClick={() => del(p.id)} className="text-stone-400 hover:text-red-500 text-xs transition-colors">删除</button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-stone-400">还没有文章，点击右上角「新建」开始。</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
