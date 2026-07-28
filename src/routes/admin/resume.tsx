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
          writings: extra.writings || [],
          skills: extra.skills || [],
        });
      } else {
        initNew();
      }
    });
  }, []);

  const initNew = async () => {
    const { data: ct } = await (supabase.from('content_types') as any).select('id').eq('slug', 'resume').single();
    setForm({ id: null, title: '', summary: '', slug: 'main', status: 'published', sort_order: 1,
      content_type_id: ct?.id || '', experience: [], education: [], writings: [], skills: [] });
  };

  const addItem = (field: string, empty: any) => setForm({...form, [field]: [...(form[field] || []), { ...empty }]});
  const updateItem = (field: string, i: number, key: string, val: string) => {
    const arr = [...form[field]]; arr[i] = { ...arr[i], [key]: val }; setForm({...form, [field]: arr});
  };
  const removeItem = (field: string, i: number) => setForm({...form, [field]: form[field].filter((_: any, j: number) => j !== i)});

  const save = async () => {
    setSaving(true); setMsg("");
    const payload: any = {
      content_type_id: form.content_type_id, slug: form.slug, title: form.title,
      summary: form.summary, status: form.status, sort_order: Number(form.sort_order),
      extra: { experience: form.experience, education: form.education, writings: form.writings, skills: form.skills },
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
              <textarea value={item.detail} onChange={e => updateItem('experience', i, 'detail', e.target.value)} rows={2} placeholder="描述" className="w-full rounded border border-stone-200 px-3 py-1.5 text-sm focus:outline-none" />
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
              <textarea value={item.detail} onChange={e => updateItem('education', i, 'detail', e.target.value)} rows={2} placeholder="描述" className="w-full rounded border border-stone-200 px-3 py-1.5 text-sm focus:outline-none" />
              <button onClick={() => removeItem('education', i)} className="mt-1 text-xs text-stone-400 hover:text-red-500">删除</button>
            </div>
          ))}
          <button onClick={() => addItem('education', { year: '', role: '', org: '', detail: '' })} className="text-xs text-stone-500 hover:text-stone-700">+ 添加教育经历</button>
        </section>

        {/* Writings */}
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-stone-700 mb-4">写作</h2>
          {form.writings.map((item: any, i: number) => (
            <div key={i} className="mb-4 pb-4 border-b border-stone-100 last:border-0">
              <div className="grid grid-cols-3 gap-3 mb-2">
                <input value={item.year} onChange={e => updateItem('writings', i, 'year', e.target.value)} placeholder="年份" className="rounded border border-stone-200 px-3 py-1.5 text-sm focus:outline-none" />
                <input value={item.title} onChange={e => updateItem('writings', i, 'title', e.target.value)} placeholder="标题" className="col-span-2 rounded border border-stone-200 px-3 py-1.5 text-sm focus:outline-none" />
              </div>
              <input value={item.venue} onChange={e => updateItem('writings', i, 'venue', e.target.value)} placeholder="发表地" className="w-full rounded border border-stone-200 px-3 py-1.5 text-sm focus:outline-none" />
              <button onClick={() => removeItem('writings', i)} className="mt-1 text-xs text-stone-400 hover:text-red-500">删除</button>
            </div>
          ))}
          <button onClick={() => addItem('writings', { year: '', title: '', venue: '' })} className="text-xs text-stone-500 hover:text-stone-700">+ 添加作品</button>
        </section>

        {/* Skills */}
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-stone-700 mb-4">技能</h2>
          <div className="space-y-2">
            {form.skills.map((s: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <input value={s} onChange={e => { const arr = [...form.skills]; arr[i] = e.target.value; setForm({...form, skills: arr}); }}
                  className="flex-1 rounded border border-stone-200 px-3 py-1.5 text-sm focus:outline-none" />
                <button onClick={() => setForm({...form, skills: form.skills.filter((_: any, j: number) => j !== i)})}
                  className="text-xs text-stone-400 hover:text-red-500">✕</button>
              </div>
            ))}
            <button onClick={() => setForm({...form, skills: [...form.skills, '']})}
              className="text-xs text-stone-500 hover:text-stone-700">+ 添加技能</button>
          </div>
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
