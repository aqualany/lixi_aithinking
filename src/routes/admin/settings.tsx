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
    supabase.from('site_settings').select('*').limit(1).single().then(({ data }) => {
      if (data) setForm(data);
    });
  }, []);

  const save = async () => {
    setSaving(true); setMsg("");
    const session = await supabase.auth.getSession();
    const { error } = await supabase.from('site_settings').update({
      site_title: form.site_title, site_description: form.site_description,
      author_name: form.author_name, author_name_en: form.author_name_en,
      hero_eyebrow: form.hero_eyebrow, github_url: form.github_url,
      contact_email: form.contact_email,
    }).eq('id', form.id);
    if (error) setMsg("保存失败: " + error.message);
    else setMsg("保存成功");
    setSaving(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold text-neutral-800">站点配置</h1>
      <div className="space-y-4">
        {["site_title","site_description","author_name","author_name_en","hero_eyebrow","github_url","contact_email"].map(field => (
          <div key={field}>
            <label className="mb-1 block text-sm font-medium text-neutral-700">{field}</label>
            <input value={form[field] ?? ""} onChange={e => setForm({...form, [field]: e.target.value})}
              className="w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
          </div>
        ))}
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">简介（每行一句）</label>
          <textarea value={(form.bio_lines ?? []).join('\n')} onChange={e => setForm({...form, bio_lines: e.target.value.split('\n')})}
            rows={4} className="w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
        </div>
        <button onClick={save} disabled={saving}
          className="rounded bg-neutral-900 px-6 py-2 text-sm text-white hover:bg-neutral-700 disabled:opacity-50">
          {saving ? "保存中..." : "保存"}
        </button>
        {msg && <p className="text-sm" style={{color: msg.includes('失败') ? 'red' : 'green'}}>{msg}</p>}
      </div>
    </div>
  );
}
