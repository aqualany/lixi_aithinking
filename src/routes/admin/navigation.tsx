import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/navigation")({
  component: NavAdminPage,
});

function NavAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { load(); }, []);

  const load = () => {
    (supabase.from('navigation') as any).select('*').order('sort_order').then(({ data }: any) => {
      if (data) setItems(data);
    });
  };

  const save = async () => {
    setSaving(true); setMsg("");
    const { error } = await (supabase.from('navigation') as any).upsert(editing);
    if (error) setMsg(error.message); else { setMsg("保存成功"); load(); }
    setSaving(false); setEditing(null);
  };

  const del = async (id: string) => {
    if (!confirm('确认删除此导航项？')) return;
    await (supabase.from('navigation') as any).delete().eq('id', id);
    load();
  };

  const grouped = items.reduce((acc: any, item: any) => {
    (acc[item.location] = acc[item.location] || []).push(item);
    return acc;
  }, {} as Record<string, any[]>);

  const locationLabel: any = { header: "顶部导航", footer: "页脚", mobile: "移动端" };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-medium text-stone-800">导航管理</h1>
        <button onClick={() => setEditing({ location: 'header', label: '', href: '', is_external: false, sort_order: items.length + 1 })}
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition-colors">+ 新建</button>
      </div>
      <p className="text-sm text-stone-400 mb-8">管理 Header 和 Footer 导航链接</p>

      {msg && <div className={`mb-4 rounded-lg px-4 py-2.5 text-sm ${msg.includes('失败') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>{msg}</div>}

      {/* Edit panel */}
      {editing && (
        <div className="mb-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-stone-700 mb-4">{editing.id ? '编辑导航项' : '新建导航项'}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1">位置</label>
              <select value={editing.location} onChange={e => setEditing({...editing, location: e.target.value})} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200">
                <option value="header">Header</option><option value="footer">Footer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">标签</label>
              <input value={editing.label} onChange={e => setEditing({...editing, label: e.target.value})} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">链接</label>
              <input value={editing.href} onChange={e => setEditing({...editing, href: e.target.value})} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-stone-600">
              <input type="checkbox" checked={editing.is_external} onChange={e => setEditing({...editing, is_external: e.target.checked})} className="rounded" />
              外部链接
            </label>
            <input type="number" value={editing.sort_order} onChange={e => setEditing({...editing, sort_order: +e.target.value})}
              className="w-20 rounded-lg border border-stone-200 px-3 py-1.5 text-sm focus:outline-none" placeholder="排序" />
          </div>
          <div className="mt-5 flex gap-3">
            <button onClick={save} disabled={saving} className="rounded-lg bg-stone-900 px-5 py-2 text-sm text-white hover:bg-stone-800 disabled:opacity-50">{saving ? "保存中…" : "保存"}</button>
            <button onClick={() => setEditing(null)} className="rounded-lg border border-stone-200 px-5 py-2 text-sm text-stone-600 hover:bg-stone-50">取消</button>
          </div>
        </div>
      )}

      {/* Grouped lists */}
      {Object.entries(grouped).map(([location, navItems]: [string, any]) => (
        <section key={location} className="mb-6">
          <h2 className="text-sm font-medium text-stone-600 mb-3">{locationLabel[location] || location}</h2>
          <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/50">
                  <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">标签</th>
                  <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">链接</th>
                  <th className="text-center text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3 w-16">外部</th>
                  <th className="text-center text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3 w-16">排序</th>
                  <th className="px-5 py-3 w-24"></th>
                </tr>
              </thead>
              <tbody>
                {navItems.map((n: any) => (
                  <tr key={n.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50">
                    <td className="px-5 py-3.5 text-stone-800">{n.label}</td>
                    <td className="px-5 py-3.5 text-xs text-stone-400 font-mono">{n.href}</td>
                    <td className="px-5 py-3.5 text-center text-xs">{n.is_external ? "✓" : "—"}</td>
                    <td className="px-5 py-3.5 text-center text-xs text-stone-400">{n.sort_order}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => setEditing(n)} className="text-xs text-stone-500 hover:text-stone-800 mr-4">编辑</button>
                      <button onClick={() => del(n.id)} className="text-xs text-stone-400 hover:text-red-500">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      {Object.keys(grouped).length === 0 && (
        <div className="rounded-xl border border-stone-200 bg-white p-12 text-center text-sm text-stone-400">还没有导航项，点击右上角「新建」添加。</div>
      )}
    </div>
  );
}
