import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster, toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

// Field component defined OUTSIDE SettingsPage to prevent re-creation on every render
function Field({ label, field, value, onChange, type = "text", desc = "" }: {
  label: string;
  field: string;
  value: any;
  onChange: (field: string, value: any) => void;
  type?: string;
  desc?: string;
}) {
  const handleChange = useCallback((e: any) => {
    onChange(field, e.target.value);
  }, [field, onChange]);

  return (
    <div>
      <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea value={value ?? ""} onChange={handleChange}
          rows={4} className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 transition-colors resize-y" />
      ) : (
        <input type={type} value={value ?? ""} onChange={handleChange}
          className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 transition-colors" />
      )}
      {desc && <p className="mt-1 text-xs text-stone-400">{desc}</p>}
    </div>
  );
}

function BioLinesEditor({ values, onChange }: { values: string[]; onChange: (v: string[]) => void }) {
  const arr = values || [];
  return (
    <div>
      <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">简介行（每行一句）</label>
      <div className="space-y-2">
        {arr.map((v: string, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <input value={v} onChange={e => {
              const next = [...arr]; next[i] = e.target.value; onChange(next);
            }} className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            <button type="button" onClick={() => onChange(arr.filter((_, j) => j !== i))}
              className="text-xs text-stone-400 hover:text-red-500">✕</button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...arr, ''])}
          className="text-xs text-stone-500 hover:text-stone-700">+ 添加一行</button>
      </div>
      <p className="mt-1 text-xs text-stone-400">Hero 区域展示的个人简介</p>
    </div>
  );
}

function SettingsPage() {
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [faviconUploading, setFaviconUploading] = useState(false);
  const [contactLinks, setContactLinks] = useState<any[]>([]);
  const dataLoaded = useRef(false);

  // Load data ONCE
  useEffect(() => {
    if (dataLoaded.current) return;
    dataLoaded.current = true;
    loadData();
  }, []);

  const loadData = async () => {
    const { data } = await (supabase.from('site_settings') as any)
      .select('*, media!avatar_media_id(public_url), favicon:favicon_media_id(public_url)')
      .limit(1).single();
    if (data) {
      setForm({ ...data, _avatarUrl: data.media?.public_url || null, _faviconUrl: data.favicon?.public_url || null });
      setContactLinks(Array.isArray(data.contact_links) ? data.contact_links : []);
    }
  };

  const refreshData = async () => {
    const { data } = await (supabase.from('site_settings') as any)
      .select('*, media!avatar_media_id(public_url), favicon:favicon_media_id(public_url)')
      .limit(1).single();
    if (data) {
      setForm({ ...data, _avatarUrl: data.media?.public_url || null, _faviconUrl: data.favicon?.public_url || null });
      setContactLinks(Array.isArray(data.contact_links) ? data.contact_links : []);
    }
  };

  const handleFieldChange = useCallback((field: string, value: any) => {
    setForm((prev: any) => prev ? { ...prev, [field]: value } : { [field]: value });
  }, []);

  const uploadFile = async (file: File, prefix: string) => {
    const ext = file.name.split('.').pop();
    const path = `${prefix}/${Date.now()}.${ext}`;
    const { error: uploadErr } = await (supabase.storage.from('media') as any).upload(path, file);
    if (uploadErr) throw new Error(uploadErr.message);
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);
    const { data: mediaRec, error: mediaErr } = await (supabase.from('media') as any).insert({
      storage_path: path, public_url: publicUrl, mime_type: file.type, alt: prefix,
    }).select('id').single();
    if (mediaErr) throw new Error(mediaErr.message);
    return { path, url: publicUrl, id: mediaRec.id };
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const rec = await uploadFile(file, 'avatars');
      const { error } = await (supabase.from('site_settings') as any)
        .update({ avatar_media_id: rec.id }).eq('id', form?.id);
      if (error) throw error;
      setForm((prev: any) => prev ? { ...prev, avatar_media_id: rec.id, _avatarUrl: rec.url } : prev);
      toast.success("头像已上传（需保存整体配置生效）");
    } catch (err: any) {
      toast.error("上传失败: " + err.message);
    }
    setAvatarUploading(false);
  };

  const uploadFavicon = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFaviconUploading(true);
    try {
      const rec = await uploadFile(file, 'favicons');
      const { error } = await (supabase.from('site_settings') as any)
        .update({ favicon_media_id: rec.id }).eq('id', form?.id);
      if (error) throw error;
      setForm((prev: any) => prev ? { ...prev, favicon_media_id: rec.id, _faviconUrl: rec.url } : prev);
      toast.success("Favicon已上传（需保存整体配置生效）");
    } catch (err: any) {
      toast.error("上传失败: " + err.message);
    }
    setFaviconUploading(false);
  };

  const removeImage = async (mediaField: string, urlField: string) => {
    if (!confirm('确认移除？')) return;
    await (supabase.from('site_settings') as any).update({ [mediaField]: null }).eq('id', form?.id);
    setForm((prev: any) => prev ? { ...prev, [mediaField]: null, [urlField]: null } : prev);
    toast.success("已移除，保存后生效");
  };

  const save = async () => {
    if (!form?.id) { toast.error("数据未加载完成"); return; }
    setSaving(true);
    try {
      const payload: any = {
        site_title: form.site_title || '',
        site_description: form.site_description || '',
        author_name: form.author_name || '',
        author_name_en: form.author_name_en || '',
        hero_eyebrow: form.hero_eyebrow || '',
        bio_lines: Array.isArray(form.bio_lines) ? form.bio_lines.filter((l: string) => l.trim()) : [],
        seo_keywords: Array.isArray(form.seo_keywords) ? form.seo_keywords : (typeof form.seo_keywords === 'string' ? form.seo_keywords.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
        tags: Array.isArray(form.tags) ? form.tags : (typeof form.tags === 'string' ? form.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
        github_url: form.github_url || '',
        contact_email: form.contact_email || '',
        contact_links: contactLinks,
      };
      const { error } = await (supabase.from('site_settings') as any).update(payload).eq('id', form.id);
      if (error) throw error;
      toast.success("✓ 已保存");
      await refreshData();
    } catch (err: any) {
      toast.error("保存失败: " + (err.message || err));
    }
    setSaving(false);
  };

  // Loading state
  if (!form) {
    return (
      <div>
        <h1 className="text-xl font-medium text-stone-800 mb-1">站点配置</h1>
        <p className="text-sm text-stone-400 mb-8">加载中…</p>
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm animate-pulse">
          <div className="h-4 bg-stone-100 rounded w-1/3 mb-4" />
          <div className="h-8 bg-stone-100 rounded w-full mb-4" />
          <div className="h-8 bg-stone-100 rounded w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" richColors />
      <h1 className="text-xl font-medium text-stone-800 mb-1">站点配置</h1>
      <p className="text-sm text-stone-400 mb-8">管理站点的品牌信息、SEO、Favicon 和展示内容</p>

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
                <button onClick={() => removeImage('avatar_media_id', '_avatarUrl')} className="block text-xs text-stone-400 hover:text-red-500 mt-1">移除</button>
              )}
            </div>
          </div>
        </section>

        {/* Favicon */}
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-stone-700 mb-4">Favicon</h2>
          <div className="flex items-center gap-6">
            <div className="h-10 w-10 overflow-hidden bg-stone-100 border border-stone-200 rounded">
              {form._faviconUrl ? (
                <img src={form._faviconUrl} alt="favicon" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-stone-300">无</div>
              )}
            </div>
            <div className="space-y-2">
              <label className="cursor-pointer inline-block rounded-lg bg-stone-900 px-4 py-2 text-xs text-white hover:bg-stone-800 transition-colors">
                {faviconUploading ? '上传中…' : '上传 Favicon'}
                <input type="file" accept="image/*" onChange={uploadFavicon} className="hidden" />
              </label>
              {form.favicon_media_id && (
                <button onClick={() => removeImage('favicon_media_id', '_faviconUrl')} className="block text-xs text-stone-400 hover:text-red-500 mt-1">移除</button>
              )}
            </div>
          </div>
        </section>

        {/* Basic Info */}
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-stone-700 mb-4">基本信息</h2>
          <div className="grid grid-cols-2 gap-5">
            <Field label="站点标题" field="site_title" value={form.site_title} onChange={handleFieldChange} desc="浏览器标签页标题" />
            <Field label="站点描述" field="site_description" value={form.site_description} onChange={handleFieldChange} desc="SEO 描述" />
            <Field label="SEO 关键词（逗号分隔）" field="seo_keywords" value={form.seo_keywords || ''} onChange={handleFieldChange} />
            <Field label="作者标签（逗号分隔）" field="tags" value={form.tags || ''} onChange={handleFieldChange} desc="如: INFJ, 写作者" />
          </div>
        </section>

        {/* Author */}
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-stone-700 mb-4">作者信息</h2>
          <div className="grid grid-cols-2 gap-5">
            <Field label="中文名" field="author_name" value={form.author_name} onChange={handleFieldChange} />
            <Field label="英文名" field="author_name_en" value={form.author_name_en} onChange={handleFieldChange} />
            <div className="col-span-2">
              <BioLinesEditor values={form.bio_lines} onChange={(v) => handleFieldChange('bio_lines', v)} />
            </div>
            <Field label="眉标文案" field="hero_eyebrow" value={form.hero_eyebrow} onChange={handleFieldChange} desc="Hero 顶部小字" />
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-stone-700 mb-4">联系方式</h2>
          <div className="grid grid-cols-2 gap-5 mb-4">
            <Field label="联系邮箱" field="contact_email" value={form.contact_email} onChange={handleFieldChange} type="email" desc="留空前台不显示" />
            <Field label="GitHub URL" field="github_url" value={form.github_url} onChange={handleFieldChange} desc="留空前台不显示" />
          </div>
          <div className="border-t border-stone-100 pt-4">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">自定义联系链接</p>
            {contactLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <input value={link.label} onChange={e => {
                  const arr = [...contactLinks]; arr[i] = { ...arr[i], label: e.target.value }; setContactLinks(arr);
                }} placeholder="标签" className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
                <input value={link.href} onChange={e => {
                  const arr = [...contactLinks]; arr[i] = { ...arr[i], href: e.target.value }; setContactLinks(arr);
                }} placeholder="链接" className="flex-[2] rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
                <button onClick={() => setContactLinks(contactLinks.filter((_, j) => j !== i))} className="text-xs text-stone-400 hover:text-red-500">✕</button>
              </div>
            ))}
            <button onClick={() => setContactLinks([...contactLinks, { label: '', value: '', href: '' }])}
              className="text-xs text-stone-500 hover:text-stone-700 mt-1">+ 添加链接</button>
          </div>
        </section>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={save} disabled={saving}
          className="rounded-lg bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-50">
          {saving ? "保存中…" : "保存配置"}
        </button>
      </div>
    </div>
  );
}
