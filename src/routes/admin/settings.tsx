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

  useEffect(() => {
    (supabase.from('site_settings') as any).select('*').limit(1).single().then(({ data }: any) => {
      if (data) setForm(data);
    });
  }, []);

  const save = async () => {
    setSaving(true); setMsg("");
    const { error } = await (supabase.from('site_settings') as any).update({
      site_title: form.site_title, site_description: form.site_description,
      author_name: form.author_name, author_name_en: form.author_name_en,
      hero_eyebrow: form.hero_eyebrow, github_url: form.github_url,
      contact_email: form.contact_email,
    }).eq('id', form.id);
    if (error) setMsg("保存失败: " + error.message);
    else setMsg("保存成功");
    setSaving(false);
  };

  const Field = ({ label, field, type = "text", desc = "" }: any) => (
    <div>
      <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea value={form[field] ?? ""} onChange={e => setForm({...form, [field]: e.target.value})}
          rows={4} className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-colors" />
      ) : (
        <input type={type} value={form[field] ?? ""} onChange={e => setForm({...form, [field]: e.target.value})}
          className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-colors" />
      )}
      {desc && <p className="mt-1 text-xs text-stone-400">{desc}</p>}
    </div>
  );

  return (
    <div>
      <h1 className="text-xl font-medium text-stone-800 mb-1">站点配置</h1>
      <p className="text-sm text-stone-400 mb-8">管理站点的基本信息和展示内容</p>

      <div className="space-y-6">
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-stone-700 mb-4">基本信息</h2>
          <div className="grid grid-cols-2 gap-5">
            <Field label="站点标题" field="site_title" desc="浏览器标签页标题" />
            <Field label="站点描述" field="site_description" desc="SEO meta description" />
            <Field label="作者中文名" field="author_name" />
            <Field label="作者英文名" field="author_name_en" />
            <div className="col-span-2">
              <Field label="站点描述（长）" field="site_description" type="textarea" desc="用于 SEO 的完整描述" />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-stone-700 mb-4">个人简介</h2>
          <div className="space-y-4">
            <Field label="眉标文案" field="hero_eyebrow" desc="Hero 区域顶部小字（当前已隐藏）" />
          </div>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-stone-700 mb-4">联系方式</h2>
          <div className="grid grid-cols-2 gap-5">
            <Field label="邮箱" field="contact_email" type="email" desc="当前前台已隐藏" />
            <Field label="GitHub URL" field="github_url" desc="当前前台已隐藏" />
          </div>
        </section>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={save} disabled={saving}
          className="rounded-lg bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-50">
          {saving ? "保存中…" : "保存配置"}
        </button>
        {msg && (
          <span className={`text-sm ${msg.includes('失败') ? 'text-red-500' : 'text-green-600'}`}>
            {msg}
          </span>
        )}
      </div>
    </div>
  );
}
