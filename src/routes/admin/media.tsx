import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster, toast } from "sonner";

export const Route = createFileRoute("/admin/media")({
  component: MediaAdminPage,
});

function MediaAdminPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    load();
  }, []);

  const load = () => {
    setLoading(true);
    (supabase.from('media') as any).select('*').order('created_at', { ascending: false }).then(({ data }: any) => {
      if (data) setFiles(data);
      setLoading(false);
    });
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `uploads/${Date.now()}.${ext}`;
      const { error: storageErr } = await (supabase.storage.from('media') as any).upload(path, file);
      if (storageErr) throw new Error(storageErr.message);
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);
      const { error: dbErr } = await (supabase.from('media') as any).insert({
        storage_path: path, public_url: publicUrl, mime_type: file.type, alt: file.name
      });
      if (dbErr) throw new Error(dbErr.message);
      toast.success("上传成功");
      load();
    } catch (err: any) {
      toast.error("上传失败: " + err.message);
    }
    setUploading(false);
  };

  const del = async (id: string, path: string) => {
    if (!confirm('确认删除此文件？')) return;
    try {
      await (supabase.storage.from('media') as any).remove([path]);
      await (supabase.from('media') as any).delete().eq('id', id);
      toast.success("已删除");
      load();
    } catch (err: any) {
      toast.error("删除失败: " + err.message);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard?.writeText(url).then(() => {
      toast.success("URL 已复制");
    }).catch(() => {
      toast.error("复制失败，请手动选择");
    });
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-xl font-medium text-stone-800 mb-1">媒体库</h1>
        <p className="text-sm text-stone-400 mb-8">加载中…</p>
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-sm animate-pulse">
              <div className="aspect-square bg-stone-100" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-stone-100 rounded w-3/4" />
                <div className="h-2 bg-stone-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" richColors />
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-medium text-stone-800">媒体库</h1>
        <label className="cursor-pointer rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition-colors">
          {uploading ? '上传中…' : '上传文件'}
          <input type="file" accept="image/*" onChange={upload} className="hidden" disabled={uploading} />
        </label>
      </div>
      <p className="text-sm text-stone-400 mb-8">{files.length} 个文件</p>

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
              <div className="p-3 space-y-2">
                <p className="truncate text-xs text-stone-500" title={f.alt}>{f.alt || '未命名'}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-300">{f.mime_type?.split('/')[1]?.toUpperCase()}</span>
                  <span className="text-[10px] text-stone-300">{f.created_at?.slice(0, 10)}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => copyUrl(f.public_url)}
                    className="text-[10px] text-stone-500 hover:text-stone-800 transition-colors">复制 URL</button>
                  <button onClick={() => del(f.id, f.storage_path)}
                    className="text-[10px] text-stone-400 hover:text-red-500 transition-colors">删除</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
