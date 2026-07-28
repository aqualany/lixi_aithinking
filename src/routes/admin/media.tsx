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
    (supabase.from('media') as any).select('*').order('created_at', { ascending: false }).then(({ data }: any) => {
      if (data) setFiles(data);
    });
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setMsg("");
    const ext = file.name.split('.').pop();
    const path = `uploads/${Date.now()}.${ext}`;
    const { error: storageErr } = await (supabase.storage.from('media') as any).upload(path, file);
    if (storageErr) { setMsg("上传失败: " + storageErr.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);
    const { error: dbErr } = await (supabase.from('media') as any).insert({
      storage_path: path, public_url: publicUrl, mime_type: file.type, alt: file.name
    });
    if (dbErr) setMsg("入库失败: " + dbErr.message);
    else { setMsg("上传成功"); load(); }
    setUploading(false);
  };

  const del = async (id: string, path: string) => {
    if (!confirm('确认删除此文件？')) return;
    await (supabase.storage.from('media') as any).remove([path]);
    await (supabase.from('media') as any).delete().eq('id', id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-medium text-stone-800">媒体库</h1>
        <label className="cursor-pointer rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition-colors">
          {uploading ? '上传中…' : '上传文件'}
          <input type="file" accept="image/*" onChange={upload} className="hidden" disabled={uploading} />
        </label>
      </div>
      <p className="text-sm text-stone-400 mb-8">{files.length} 个文件</p>

      {msg && <div className={`mb-4 rounded-lg px-4 py-2.5 text-sm ${msg.includes('失败') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>{msg}</div>}

      {files.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-stone-200 bg-white p-16 text-center">
          <p className="text-sm text-stone-400">暂无媒体文件</p>
          <p className="text-xs text-stone-300 mt-1">点击右上角「上传文件」添加图片</p>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {files.map((f: any) => (
            <div key={f.id} className="group rounded-xl border border-stone-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-square overflow-hidden bg-stone-100">
                <img src={f.public_url} alt={f.alt} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-3">
                <p className="truncate text-xs text-stone-500">{f.alt || '未命名'}</p>
                <p className="text-xs text-stone-300 mt-0.5">{f.mime_type?.split('/')[1]?.toUpperCase()}</p>
                <button onClick={() => del(f.id, f.storage_path)} className="mt-2 text-xs text-stone-400 hover:text-red-500 transition-colors">删除</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
