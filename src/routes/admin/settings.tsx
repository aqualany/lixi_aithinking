import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    (supabase.from('site_settings') as any).select('*, media!avatar_media_id(public_url)').limit(1).single().then(({ data }: any) => {
      if (data) setForm({ ...data, _avatarUrl: data.media?.public_url || null });
    });
  }, []);

  const save = async () => {
    setSaving(true); setMsg("");
    const payload = {
      site_title: form.site_title, site_description: form.site_description,
      seo_keywords: form.seo_keywords?.split(',').map((s: string) => s.trim()) || [],
      author_name: form.author_name, author_name_en: form.author_name_en,
      hero_eyebrow: form.hero_eyebrow, bio_lines: form.bio_lines?.filter((l: string) => l.trim()),
      tags: form.tags?.split(',').map((s: string) => s.trim()) || [],
      github_url: form.github_url, contact_email: form.contact_email,
    };
    const { error } = await (supabase.from('site_settings') as any).update(payload).eq('id', form.id);
    if (error) setMsg("保存失败: " + error.message);
    else setMsg("保存成功 ✓");
    setSaving(false);
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    const ext = file.name.split('.').pop();
    const path = `avatars/${Date.now()}.${ext}`;
    const { error: uploadErr } = await (supabase.storage.from('media') as any).upload(path, file);
    if (uploadErr) { setMsg("上传失败: " + uploadErr.message); setAvatarUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);
    const { data: mediaRec, error: mediaErr } = await (supabase.from('media') as any).insert({ storage_path: path, public_url: publicUrl, mime_type: file.type, alt: "avatar" }).select('id').single();
    if (mediaErr) { setMsg("入库失败: " + mediaErr.message); setAvatarUploading(false); return; }
    const { error: updateErr } = await (supabase.from('site_settings') as any).update({ avatar_media_id: mediaRec.id }).eq('id', form.id);
    if (updateErr) setMsg("关联失败: " + updateErr.message);
    else { setForm({...form, avatar_media_id: mediaRec.id, _avatarUrl: publicUrl }); setMsg("头像已更新"); }
    setAvatarUploading(false);
  };

  const removeAvatar = async () => {
    if (!confirm('确认移除头像？')) return;
    await (supabase.from('site_settings') as any).update({ avatar_media_id: null }).eq('id', form.id);
    setForm({...form, avatar_media_id: null, _avatarUrl: null });
  };

  const Field = ({ label, field, type = "text", desc = "", span = 1, rows }: any) => (
    <div className={span > 1 ? `col-span-${span}` : ""}>
      <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea value={form[field] ?? ""} onChange={e => setForm({...form, [field]: e.target.value})}
          rows={rows || 4} className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 transition-colors resize-y" />
      ) : type === "array" ? (
        <div className="space-y-2">
          {(form[field] || []).map((v: string, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <input value={v} onChange={e => {
                const arr = [...(form[field] || [])]; arr[i] = e.target.value; setForm({...form, [field]: arr});
              }} className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
              <button onClick={() => setForm({...form, [field]: (form[field] || []).filter((_: any, j: number) => j !== i)})}
                className="text-xs text-stone-400 hover:text-red-500">✕</button>
            </div>
          ))}
          <button onClick={() => setForm({...form, [field]: [...(form[field] || []), ""]})}
            className="text-xs text-stone-500 hover:text-stone-700">+ 添加一行</button>
        </div>
      ) : (
        <input type={type} value={form[field] ?? ""} onChange={e => setForm({...form, [field]: e.target.value})}
          className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 transition-colors" />
      )}
      {desc && <p className="mt-1 text-xs text-stone-400">{desc}</p>}
    </div>
  );

  return (
    <div>
      <h1 className="text-xl font-medium text-stone-800 mb-1">站点配置</h1>
      <p className="text-sm text-stone-400 mb-8">管理站点的品牌信息、SEO 和展示内容</p>

      <div className="space-y-6">
        {/* Avatar */}
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-stone-700 mb-4">头像</h2>
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-stone-100 border border-stone-200">
              {form._avatarUrl ? (
                <img src={form._avatarUrl} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-stone-300">无</div>
              )}
            </div>
            <div className="space-y-2">
              <label className="cursor-pointer inline-block rounded-lg bg-stone-900 px-4 py-2 text-xs text-white hover:bg-stone-800 transition-colors">
                {avatarUploading ? '上传中…' : '上传头像'}
                <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
              </label>
              {form.avatar_media_id && (
                <button onClick={removeAvatar} className="block text-xs text-stone-400 hover:text-red-500 mt-1">移除</button>
              )}
            </div>
          </div>
        </section>

        {/* Basic Info */}
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-stone-700 mb-4">基本信息</h2>
          <div className="grid grid-cols-2 gap-5">
            <Field label="站点标题" field="site_title" desc="浏览器标签页标题" />
            <Field label="站点描述" field="site_description" desc="SEO 描述" />
            <Field label="SEO 关键词（逗号分隔）" field="seo_keywords" desc="用英文逗号分隔" />
            <Field label="作者标签（逗号分隔）" field="tags" desc="如: INFJ, 写作者" />
          </div>
        </section>

        {/* Author */}
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-stone-700 mb-4">作者信息</h2>
          <div className="grid grid-cols-2 gap-5">
            <Field label="中文名" field="author_name" />
            <Field label="英文名" field="author_name_en" />
            <div className="col-span-2">
              <Field label="简介行（每行一句）" field="bio_lines" type="array" desc="Hero 区域展示的个人简介" />
            </div>
            <Field label="眉标文案" field="hero_eyebrow" desc="Hero 顶部小字" />
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-stone-700 mb-4">联系方式</h2>
          <div className="grid grid-cols-2 gap-5">
            <Field label="联系邮箱" field="contact_email" type="email" desc="留空前台不显示" />
            <Field label="GitHub URL" field="github_url" desc="留空前台不显示" />
          </div>
        </section>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={save} disabled={saving}
          className="rounded-lg bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-50">
          {saving ? "保存中…" : "保存配置"}
        </button>
        {msg && <span className={`text-sm ${msg.includes('失败') ? 'text-red-500' : 'text-green-600'}`}>{msg}</span>}
      </div>
    </div>
  );
}