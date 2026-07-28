import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/posts/$id/edit")({
  component: PostEditPage,
});

function PostEditPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const isNew = id === 'new';
  const [form, setForm] = useState<any>({ title: '', slug: '', summary: '', body_md: '', status: 'published', sort_order: 0, extra: '{}', content_type_id: '' });
  const [sections, setSections] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (supabase as any).from('content_types').select('*').then(({ data }: any) => { if (data) setTypes(data); });
    if (!isNew) {
      (supabase as any).from('posts').select('*, post_sections(*)').eq('id', id).single().then(({ data }: any) => {
        if (data) {
          setForm({ ...data, extra: typeof data.extra === 'object' ? JSON.stringify(data.extra, null, 2) : data.extra });
          setSections(data.post_sections ?? []);
        }
      });
    }
  }, [id]);

  const save = async () => {
    setSaving(true); setMsg("");
    let extra: any = {};
    try { extra = JSON.parse(form.extra); } catch { setMsg("extra JSON 格式无效"); setSaving(false); return; }
    const payload: any = {
      title: form.title, slug: form.slug, summary: form.summary, body_md: form.body_md,
      status: form.status, sort_order: Number(form.sort_order), extra, content_type_id: form.content_type_id,
    };
    if (!isNew) payload.id = id;
    const session = await supabase.auth.getSession();
    const { data: saved, error } = await (supabase as any).from('posts').upsert(payload).select('id').single();
    if (error) { setMsg("保存失败: " + error.message); setSaving(false); return; }
    if (sections.length > 0) {
      await (supabase as any).from('post_sections').delete().eq('post_id', saved.id);
      await (supabase as any).from('post_sections').insert(sections.map((s, i) => ({ post_id: saved.id, anchor: s.anchor || `sec-${i+1}`, title: s.title, sort_order: i })));
    }
    setMsg("保存成功");
    setSaving(false);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-neutral-800">{isNew ? '新建文章' : '编辑文章'}</h1>
        <button onClick={() => router.navigate({ to: '/admin/posts' })} className="text-sm text-neutral-500 hover:text-neutral-800">← 返回列表</button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium text-neutral-600">标题</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="mt-1 w-full rounded border px-3 py-2 text-sm" /></div>
          <div><label className="block text-xs font-medium text-neutral-600">Slug</label>
            <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="mt-1 w-full rounded border px-3 py-2 text-sm" /></div>
        </div>
        <div><label className="block text-xs font-medium text-neutral-600">摘要</label>
          <textarea value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} rows={2} className="mt-1 w-full rounded border px-3 py-2 text-sm" /></div>
        <div><label className="block text-xs font-medium text-neutral-600">正文 Markdown</label>
          <textarea value={form.body_md} onChange={e => setForm({...form, body_md: e.target.value})} rows={12} className="mt-1 w-full rounded border px-3 py-2 text-sm font-mono" /></div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-xs font-medium text-neutral-600">内容类型</label>
            <select value={form.content_type_id} onChange={e => setForm({...form, content_type_id: e.target.value})} className="mt-1 w-full rounded border px-3 py-2 text-sm">
              <option value="">选择</option>
              {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select></div>
          <div><label className="block text-xs font-medium text-neutral-600">状态</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="mt-1 w-full rounded border px-3 py-2 text-sm">
              <option value="published">已发布</option><option value="draft">草稿</option><option value="archived">归档</option>
            </select></div>
          <div><label className="block text-xs font-medium text-neutral-600">排序</label>
            <input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: e.target.value})} className="mt-1 w-full rounded border px-3 py-2 text-sm" /></div>
        </div>
        <div><label className="block text-xs font-medium text-neutral-600">章节</label>
          {sections.map((s, i) => (
            <div key={i} className="mt-2 flex gap-2">
              <input value={s.anchor} onChange={e => { const ns = [...sections]; ns[i].anchor = e.target.value; setSections(ns); }}
                placeholder="锚点" className="w-24 rounded border px-2 py-1 text-xs" />
              <input value={s.title} onChange={e => { const ns = [...sections]; ns[i].title = e.target.value; setSections(ns); }}
                placeholder="标题" className="flex-1 rounded border px-2 py-1 text-xs" />
              <button onClick={() => setSections(sections.filter((_, j) => j !== i))} className="text-xs text-red-500">删除</button>
            </div>
          ))}
          <button onClick={() => setSections([...sections, { anchor: '', title: '' }])} className="mt-2 text-xs text-blue-600">+ 添加章节</button>
        </div>
        <div><label className="block text-xs font-medium text-neutral-600">Extra JSON</label>
          <textarea value={form.extra} onChange={e => setForm({...form, extra: e.target.value})} rows={6} className="mt-1 w-full rounded border px-3 py-2 text-sm font-mono" /></div>
        <button onClick={save} disabled={saving}
          className="rounded bg-neutral-900 px-6 py-2 text-sm text-white hover:bg-neutral-700 disabled:opacity-50">
          {saving ? "保存中..." : "保存"}
        </button>
        {msg && <p className="text-sm" style={{color: msg.includes('失败') ? 'red' : 'green'}}>{msg}</p>}
      </div>
    </div>
  );
}
