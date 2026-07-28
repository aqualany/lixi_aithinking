import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/media")({
  component: MediaAdminPage,
});

function MediaAdminPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { load(); }, []);

  const load = () => {
    supabase.from('media').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setFiles(data);
    });
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setMsg("");
    const ext = file.name.split('.').pop();
    const path = `uploads/${Date.now()}.${ext}`;
    const { error: storageErr } = await supabase.storage.from('media').upload(path, file);
    if (storageErr) { setMsg("上传失败: " + storageErr.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);
    const { error: dbErr } = await supabase.from('media').insert({
      storage_path: path, public_url: publicUrl, mime_type: file.type, alt: file.name
    });
    if (dbErr) setMsg("入库失败: " + dbErr.message);
    else { setMsg("上传成功"); load(); }
    setUploading(false);
  };

  const del = async (id: string, path: string) => {
    if (!confirm('确认删除？')) return;
    await supabase.storage.from('media').remove([path]);
    await supabase.from('media').delete().eq('id', id);
    load();
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-neutral-800">媒体库</h1>
        <label className="cursor-pointer rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700">
          {uploading ? '上传中...' : '上传文件'}
          <input type="file" accept="image/*" onChange={upload} className="hidden" disabled={uploading} />
        </label>
      </div>
      {msg && <p className="mb-3 text-sm" style={{color: msg.includes('失败') ? 'red' : 'green'}}>{msg}</p>}
      <div className="grid grid-cols-4 gap-4">
        {files.map(f => (
          <div key={f.id} className="rounded border bg-white p-2 shadow-sm">
            <img src={f.public_url} alt={f.alt} className="mb-2 h-32 w-full object-cover rounded" />
            <p className="truncate text-xs text-neutral-500">{f.alt}</p>
            <button onClick={() => del(f.id, f.storage_path)} className="mt-1 text-xs text-red-500">删除</button>
          </div>
        ))}
      </div>
    </div>
  );
}
