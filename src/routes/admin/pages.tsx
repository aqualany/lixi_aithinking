import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster, toast } from "sonner";

export const Route = createFileRoute("/admin/pages")({
  component: AdminPagesPage,
});

function AdminPagesPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = () => {
    (supabase.from('pages') as any)
      .select('*')
      .order('sort_order')
      .then(({ data }: any) => { if (data) setPages(data); });
  };

  const save = async () => {
    setSaving(true);
    const { error } = await (supabase.from('pages') as any)
      .update({
        title: editing.title,
        seo_title: editing.seo_title || editing.title,
        description: editing.description,
        back_label: editing.back_label || '',
        is_visible: editing.is_visible,
        sort_order: Number(editing.sort_order),
      })
      .eq('id', editing.id);
    if (error) toast.error("保存失败: " + error.message);
    else { toast.success("保存成功 ✓"); load(); setEditing(null); }
    setSaving(false);
  };

  return (
    <div>
      <Toaster position="top-right" richColors />
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-medium text-stone-800">页面管理</h1>
      </div>
      <p className="text-sm text-stone-400 mb-8">
        管理页面标题、SEO 标题和返回按钮文字。修改后影响对应前台位置。
      </p>

      {/* Edit panel */}
      {editing && (
        <div className="mb-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-stone-700 mb-4">编辑页面: {editing.slug}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1">
                页面名称
                <span className="ml-1 text-[10px] text-stone-300">→ 页面标题 / Tab名</span>
              </label>
              <input value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">
                SEO 标题
                <span className="ml-1 text-[10px] text-stone-300">→ 浏览器标签标题</span>
              </label>
              <input value={editing.seo_title} onChange={e => setEditing({...editing, seo_title: e.target.value})}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-stone-400 mb-1">
                SEO 描述
                <span className="ml-1 text-[10px] text-stone-300">→ 搜索结果描述</span>
              </label>
              <textarea value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})}
                rows={2}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">
                返回按钮文字
                <span className="ml-1 text-[10px] text-stone-300">→ 详情页返回链接</span>
              </label>
              <input value={editing.back_label} onChange={e => setEditing({...editing, back_label: e.target.value})}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-stone-600">
                <input type="checkbox" checked={editing.is_visible} onChange={e => setEditing({...editing, is_visible: e.target.checked})} className="rounded" />
                可见
              </label>
              <div>
                <label className="block text-xs text-stone-400 mb-1">排序</label>
                <input type="number" value={editing.sort_order} onChange={e => setEditing({...editing, sort_order: +e.target.value})}
                  className="w-20 rounded-lg border border-stone-200 px-3 py-1.5 text-sm focus:outline-none" />
              </div>
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <button onClick={save} disabled={saving}
              className="rounded-lg bg-stone-900 px-5 py-2 text-sm text-white hover:bg-stone-800 disabled:opacity-50">
              {saving ? "保存中…" : "保存"}
            </button>
            <button onClick={() => setEditing(null)}
              className="rounded-lg border border-stone-200 px-5 py-2 text-sm text-stone-600 hover:bg-stone-50">
              取消
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/50">
              <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">Slug</th>
              <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">
                页面名称 <span className="text-[8px] font-normal">→ Tab / 标题</span>
              </th>
              <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">
                SEO 标题
              </th>
              <th className="text-center text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">可见</th>
              <th className="text-center text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">排序</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50">
                <td className="px-5 py-3.5 text-xs font-mono text-stone-500">{p.slug}</td>
                <td className="px-5 py-3.5 text-stone-800 font-medium">{p.title}</td>
                <td className="px-5 py-3.5 text-xs text-stone-400 font-mono">{p.seo_title || p.title}</td>
                <td className="px-5 py-3.5 text-center text-xs">{p.is_visible ? "✓" : "—"}</td>
                <td className="px-5 py-3.5 text-center text-xs text-stone-400">{p.sort_order}</td>
                <td className="px-5 py-3.5 text-right">
                  <button onClick={() => setEditing(p)} className="text-xs text-stone-500 hover:text-stone-800 transition-colors">
                    编辑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
