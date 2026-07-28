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
  const [showExtra, setShowExtra] = useState(false);

  useEffect(() => {
    (supabase.from('content_types') as any).select('*').then(({ data }: any) => { if (data) setTypes(data); });
    if (!isNew) {
      (supabase.from('posts') as any).select('*, post_sections(*)').eq('id', id).single().then(({ data }: any) => {
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
    try { extra = JSON.parse(form.extra); } catch { setMsg("Extra JSON 格式无效"); setSaving(false); return; }
    const payload: any = {
      title: form.title, slug: form.slug, summary: form.summary, body_md: form.body_md,
      status: form.status, sort_order: Number(form.sort_order), extra, content_type_id: form.content_type_id,
    };
    if (!isNew) payload.id = id;
    const { data: saved, error }: any = await (supabase.from('posts') as any).upsert(payload).select('id').single();
    if (error) { setMsg("保存失败: " + error.message); setSaving(false); return; }
    if (sections.length > 0) {
      await (supabase.from('post_sections') as any).delete().eq('post_id', saved.id);
      await (supabase.from('post_sections') as any).insert(sections.map((s: any, i: number) => ({ post_id: saved.id, anchor: s.anchor || `sec-${i+1}`, title: s.title, sort_order: i })));
    }
    setMsg("保存成功 ✓");
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-medium text-stone-800">{isNew ? '新建文章' : '编辑文章'}</h1>
        <button onClick={() => router.navigate({ to: '/admin/posts' })} className="text-sm text-stone-400 hover:text-stone-700 transition-colors">← 返回列表</button>
      </div>
      <p className="text-sm text-stone-400 mb-8">{isNew ? '使用 Markdown 撰写新内容' : '编辑已有内容'}</p>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Main content */}
        <div className="col-span-2 space-y-5">
          <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-stone-700 mb-4">正文</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-stone-400 mb-1">标题</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">摘要</label>
                <textarea value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} rows={3} className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">正文 Markdown</label>
                <textarea value={form.body_md} onChange={e => setForm({...form, body_md: e.target.value})} rows={20} className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-stone-200 resize-y" placeholder="在此撰写 Markdown 内容…" />
              </div>
            </div>
          </section>
        </div>

        {/* Right: Meta + Settings */}
        <div className="space-y-5">
          <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-stone-700 mb-4">属性</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Slug</label>
                <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">内容类型</label>
                <select value={form.content_type_id} onChange={e => setForm({...form, content_type_id: e.target.value})} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200">
                  <option value="">选择类型</option>
                  {types.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">状态</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200">
                  <option value="published">已发布</option>
                  <option value="draft">草稿</option>
                  <option value="archived">归档</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">排序</label>
                <input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: e.target.value})} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-stone-700 mb-4">章节</h2>
            {sections.length === 0 && <p className="text-xs text-stone-400 mb-3">暂无章节</p>}
            <div className="space-y-2">
              {sections.map((s: any, i: number) => (
                <div key={i} className="flex gap-2 items-center">
                  <input value={s.anchor} onChange={e => { const ns = [...sections]; ns[i].anchor = e.target.value; setSections(ns); }}
                    placeholder="锚点" className="w-20 rounded border border-stone-200 px-2 py-1.5 text-xs focus:outline-none" />
                  <input value={s.title} onChange={e => { const ns = [...sections]; ns[i].title = e.target.value; setSections(ns); }}
                    placeholder="标题" className="flex-1 rounded border border-stone-200 px-2 py-1.5 text-xs focus:outline-none" />
                  <button onClick={() => setSections(sections.filter((_: any, j: number) => j !== i))} className="text-xs text-stone-400 hover:text-red-500">✕</button>
                </div>
              ))}
              <button onClick={() => setSections([...sections, { anchor: '', title: '' }])} className="text-xs text-stone-500 hover:text-stone-700 mt-2">+ 添加章节</button>
            </div>
          </section>

          <button onClick={() => setShowExtra(!showExtra)} className="w-full text-left text-xs text-stone-400 hover:text-stone-600 py-2">
            {showExtra ? '▾ 收起' : '▸'} Extra JSON
          </button>
          {showExtra && (
            <textarea value={form.extra} onChange={e => setForm({...form, extra: e.target.value})} rows={8} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-stone-200" />
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={save} disabled={saving}
          className="rounded-lg bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-50">
          {saving ? "保存中…" : "保存"}
        </button>
        {msg && <span className={`text-sm ${msg.includes('失败') ? 'text-red-500' : 'text-green-600'}`}>{msg}</span>}
      </div>
    </div>
  );
}
