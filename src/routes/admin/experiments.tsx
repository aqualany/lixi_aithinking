import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/experiments")({
  component: ExperimentsListPage,
});

function ExperimentsListPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    (supabase.from('posts') as any)
      .select('*, content_types!inner(slug)')
      .eq('content_types.slug', 'experiment')
      .order('sort_order')
      .then(({ data }: any) => { if (data) setPosts(data); });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-medium text-stone-800">实验笔记</h1>
        <Link
          to="/admin/posts/$id/edit"
          params={{ id: 'new' }}
          search={{ type: 'experiment' }}
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition-colors inline-block"
        >
          + 新建实验
        </Link>
      </div>
      <p className="text-sm text-stone-400 mb-8">与AI创作中 · 使用与「当下的思考」相同的富文本编辑器</p>

      <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/50">
              <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">标题</th>
              <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">分类</th>
              <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">编号</th>
              <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">状态</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p: any) => {
              const extra = p.extra || {};
              return (
                <tr key={p.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50">
                  <td className="px-5 py-4 text-stone-800 font-medium">{p.title}</td>
                  <td className="px-5 py-4 text-xs text-stone-500">{p.subtitle || extra.category || '—'}</td>
                  <td className="px-5 py-4 text-xs text-stone-400">{extra.num || p.display_number || '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      p.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' :
                      p.status === 'draft' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-stone-50 text-stone-500 border-stone-200'
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link to="/admin/posts/$id/edit" params={{ id: p.id }} search={{ type: undefined }} className="text-xs text-stone-500 hover:text-stone-800 mr-4">编辑</Link>
                  </td>
                </tr>
              );
            })}
            {posts.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-stone-400">还没有实验笔记</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
