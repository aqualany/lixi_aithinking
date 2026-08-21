import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/resume")({
  component: ResumeEditor,
});

function ResumeEditor() {
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (supabase.from('posts') as any).select('*, content_types!inner(slug)').eq('content_types.slug', 'resume').limit(1).single().then(({ data }: any) => {
      if (data) {
        const extra = data.extra || {};
        setForm({
          id: data.id, title: data.title, summary: data.summary, slug: data.slug,
          status: data.status, sort_order: data.sort_order, content_type_id: data.content_type_id,
          experience: extra.experience || [],
          education: extra.education || [],
        });
      } else {
        initNew();
      }
    });
  }, []);

  const initNew = async () => {
    const { data: ct } = await (supabase.from('content_types') as any).select('id').eq('slug', 'resume').single();
    setForm({ id: null, title: '', summary: '', slug: 'main', status: 'published', sort_order: 1,
      content_type_id: ct?.id || '', experience: [], education: [] });
  };

  const addItem = (field: string, empty: any) => setForm({...form, [field]: [...(form[field] || []), { ...empty }]});
  const updateItem = (field: string, i: number, key: string, val: any) => {
    const arr = [...form[field]]; arr[i] = { ...arr[i], [key]: val }; setForm({...form, [field]: arr});
  };
  const removeItem = (field: string, i: number) => setForm({...form, [field]: form[field].filter((_: any, j: number) => j !== i)});

  // PDF 附件上传到 media 存储桶（复用 admin/media.tsx 的上传模式）
  const uploadAttachment = async (i: number, file: File) => {
    try {
      const path = `uploads/${Date.now()}.pdf`;
      const { error: storageErr } = await (supabase.storage.from('media') as any).upload(path, file);
      if (storageErr) throw new Error(storageErr.message);
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);
      const name = file.name.replace(/\.pdf$/i, '');
      updateItem('experience', i, 'attachment', { name, url: publicUrl });
      setMsg("附件已上传，请确认文件名后保存");
    } catch (err: any) {
      setMsg("上传失败: " + err.message);
    }
  };

  const removeAttachment = (i: number) => {
    const arr = [...form.experience];
    const item = { ...arr[i] };
    delete item.attachment;
    arr[i] = item;
    setForm({...form, experience: arr});
  };

  const save = async () => {
    setSaving(true); setMsg("");
    const payload: any = {
      content_type_id: form.content_type_id, slug: form.slug, title: form.title,
      summary: form.summary, status: form.status, sort_order: Number(form.sort_order),
      extra: { experience: form.experience, education: form.education },
    };
    if (form.id) payload.id = form.id;
    const { error }: any = await (supabase.from('posts') as any).upsert(payload);
    if (error) { setMsg("保存失败: " + error.message); setSaving(false); return; }
    setMsg("保存成功 ✓"); setSaving(false);
  };

  if (!form) return <div className="text-sm text-stone-400">加载中…</div>;

  return (
    <div>
      <h1 className="text-xl font-medium text-stone-800 mb-1">简历管理</h1>
      <p className="text-sm text-stone-400 mb-8">编辑个人简历的工作经历、教育背景等内容</p>

      {msg && <div className={`mb-4 rounded-lg px-4 py-2.5 text-sm ${msg.includes('失败') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{msg}</div>}

      <div className="space-y-6">
        {/* Basic */}
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-stone-700 mb-4">基本信息</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1">标题</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">Slug</label>
              <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-stone-400 mb-1">导语</label>
              <textarea value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} rows={2} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-stone-700 mb-4">工作经历</h2>
          {form.experience.map((item: any, i: number) => (
            <div key={i} className="mb-4 pb-4 border-b border-stone-100 last:border-0">
              <div className="grid grid-cols-4 gap-3 mb-2">
                <input value={item.year} onChange={e => updateItem('experience', i, 'year', e.target.value)} placeholder="时间" className="rounded border border-stone-200 px-3 py-1.5 text-sm focus:outline-none" />
                <input value={item.role} onChange={e => updateItem('experience', i, 'role', e.target.value)} placeholder="职位" className="col-span-2 rounded border border-stone-200 px-3 py-1.5 text-sm focus:outline-none" />
                <input value={item.org} onChange={e => updateItem('experience', i, 'org', e.target.value)} placeholder="机构" className="rounded border border-stone-200 px-3 py-1.5 text-sm focus:outline-none" />
              </div>
              <textarea value={item.detail} onChange={e => updateItem('experience', i, 'detail', e.target.value)} rows={4} placeholder="描述（空行分段）" className="w-full rounded border border-stone-200 px-3 py-1.5 text-sm focus:outline-none" />
              {/* PDF 附件上传：改名 + 移除 */}
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <label className="cursor-pointer text-xs text-stone-500 hover:text-stone-700">
                  {item.attachment ? '重新上传' : '+ 上传 PDF 附件'}
                  <input type="file" accept="application/pdf" className="hidden" disabled={saving}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAttachment(i, f); e.target.value = ''; }} />
                </label>
                {item.attachment && (
                  <>
                    <input value={item.attachment.name}
                      onChange={e => updateItem('experience', i, 'attachment', { ...item.attachment, name: e.target.value })}
                      placeholder="展示文件名" className="rounded border border-stone-200 px-2 py-1 text-xs focus:outline-none" />
                    <span className="text-xs text-stone-300">.pdf</span>
                    <button onClick={() => removeAttachment(i)} className="text-xs text-stone-400 hover:text-red-500">移除附件</button>
                  </>
                )}
              </div>
              <button onClick={() => removeItem('experience', i)} className="mt-1 text-xs text-stone-400 hover:text-red-500">删除</button>
            </div>
          ))}
          <button onClick={() => addItem('experience', { year: '', role: '', org: '', detail: '' })} className="text-xs text-stone-500 hover:text-stone-700">+ 添加工作经历</button>
        </section>

        {/* Education */}
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-stone-700 mb-4">教育</h2>
          {form.education.map((item: any, i: number) => (
            <div key={i} className="mb-4 pb-4 border-b border-stone-100 last:border-0">
              <div className="grid grid-cols-4 gap-3 mb-2">
                <input value={item.year} onChange={e => updateItem('education', i, 'year', e.target.value)} placeholder="时间" className="rounded border border-stone-200 px-3 py-1.5 text-sm focus:outline-none" />
                <input value={item.role} onChange={e => updateItem('education', i, 'role', e.target.value)} placeholder="学位" className="col-span-2 rounded border border-stone-200 px-3 py-1.5 text-sm focus:outline-none" />
                <input value={item.org} onChange={e => updateItem('education', i, 'org', e.target.value)} placeholder="学校" className="rounded border border-stone-200 px-3 py-1.5 text-sm focus:outline-none" />
              </div>
              <textarea value={item.detail} onChange={e => updateItem('education', i, 'detail', e.target.value)} rows={4} placeholder="描述（空行分段）" className="w-full rounded border border-stone-200 px-3 py-1.5 text-sm focus:outline-none" />
              <button onClick={() => removeItem('education', i)} className="mt-1 text-xs text-stone-400 hover:text-red-500">删除</button>
            </div>
          ))}
          <button onClick={() => addItem('education', { year: '', role: '', org: '', detail: '' })} className="text-xs text-stone-500 hover:text-stone-700">+ 添加教育经历</button>
        </section>

      </div>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={save} disabled={saving}
          className="rounded-lg bg-stone-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50">{saving ? "保存中…" : "保存简历"}</button>
        {msg && <span className={`text-sm ${msg.includes('失败') ? 'text-red-500' : 'text-green-600'}`}>{msg}</span>}
      </div>
    </div>
  );
}
