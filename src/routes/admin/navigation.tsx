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
    (supabase as any).from('navigation').select('*').order('sort_order').then(({ data }: any) => {
      if (data) setItems(data);
    });
  };

  const save = async (nav: any) => {
    setSaving(true);
    const { error } = await (supabase as any).from("navigation" as any).upsert(nav);
    if (error) setMsg(error.message); else { setMsg("保存成功"); load(); }
    setSaving(false); setEditing(null);
  };

  const del = async (id: string) => {
    if (!confirm('确认删除？')) return;
    await (supabase as any).from("navigation" as any).delete().eq('id', id);
    load();
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-neutral-800">导航管理</h1>
        <button onClick={() => setEditing({ location: 'header', label: '', href: '', is_external: false, sort_order: items.length + 1 })}
          className="rounded bg-neutral-900 px-4 py-2 text-sm text-white">新建</button>
      </div>
      {msg && <p className="mb-3 text-sm" style={{color: msg.includes('失败') ? 'red' : 'green'}}>{msg}</p>}
      {editing && (
        <div className="mb-6 rounded border bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold">{editing.id ? '编辑' : '新建'}导航项</h3>
          <div className="grid grid-cols-2 gap-3">
            <select value={editing.location} onChange={e => setEditing({...editing, location: e.target.value})} className="rounded border px-3 py-2 text-sm">
              <option value="header">Header</option><option value="footer">Footer</option>
            </select>
            <input value={editing.label} onChange={e => setEditing({...editing, label: e.target.value})} placeholder="标签" className="rounded border px-3 py-2 text-sm" />
            <input value={editing.href} onChange={e => setEditing({...editing, href: e.target.value})} placeholder="链接" className="rounded border px-3 py-2 text-sm" />
            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.is_external} onChange={e => setEditing({...editing, is_external: e.target.checked})} />
              <span>外部链接</span>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => save(editing)} disabled={saving} className="rounded bg-neutral-900 px-4 py-1.5 text-xs text-white">保存</button>
            <button onClick={() => setEditing(null)} className="rounded border px-4 py-1.5 text-xs">取消</button>
          </div>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-neutral-500">
            <th className="pb-2 pr-4">位置</th><th className="pb-2 pr-4">标签</th><th className="pb-2 pr-4">链接</th><th className="pb-2 pr-4">排序</th><th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.map(n => (
            <tr key={n.id} className="border-b">
              <td className="py-2 pr-4">{n.location}</td>
              <td className="py-2 pr-4">{n.label}</td>
              <td className="py-2 pr-4 text-neutral-500">{n.href}</td>
              <td className="py-2 pr-4">{n.sort_order}</td>
              <td className="py-2">
                <button onClick={() => setEditing(n)} className="text-blue-600 hover:underline mr-3">编辑</button>
                <button onClick={() => del(n.id)} className="text-red-500 hover:underline">删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
