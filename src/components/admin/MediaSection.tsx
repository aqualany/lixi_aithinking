/** Simple media area for article body images (inline). Inline picker within editor. */

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MediaSectionProps {
  /** If true, shows inline image insertion buttons in the body_md textarea */
  onInsertImage?: (url: string) => void;
}

export function MediaSection({ onInsertImage }: MediaSectionProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase.from('media') as any)
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setFiles(data);
    setLoading(false);
  };

  const toggle = () => {
    if (!open) load();
    setOpen(!open);
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `uploads/${Date.now()}.${ext}`;
    const { error: storageErr } = await (supabase.storage.from('media') as any).upload(path, file);
    if (storageErr) { setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);
    await (supabase.from('media') as any).insert({
      storage_path: path, public_url: publicUrl,
      mime_type: file.type, alt: file.name, media_category: 'article',
    });
    setUploading(false);
    load();
  };

  const insertMd = (url: string) => {
    if (onInsertImage) {
      onInsertImage(`![image](${url})`);
    }
  };

  return (
    <div className="rounded-lg border border-stone-200 bg-white">
      <button type="button" onClick={toggle}
        className="flex w-full items-center justify-between px-4 py-3 text-xs text-stone-500 hover:text-stone-700 transition-colors">
        <span>📷 媒体库</span>
        <span>{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          <label className="cursor-pointer inline-flex items-center gap-2 rounded border border-dashed border-stone-300 px-3 py-1.5 text-xs text-stone-500 hover:border-stone-400 transition-colors">
            {uploading ? '上传中…' : '+ 上传新图片'}
            <input type="file" accept="image/*" onChange={upload} className="hidden" disabled={uploading} />
          </label>
          {loading ? (
            <p className="text-xs text-stone-400">加载中…</p>
          ) : files.length === 0 ? (
            <p className="text-xs text-stone-400">暂无媒体文件</p>
          ) : (
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {files.map((f: any) => (
                <button key={f.id} type="button"
                  onClick={() => insertMd(f.public_url)}
                  className="group relative aspect-square rounded overflow-hidden border border-stone-100 hover:border-stone-400 transition-colors">
                  <img src={f.public_url} alt={f.alt} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="text-white text-[10px] opacity-0 group-hover:opacity-100 bg-black/60 px-2 py-0.5 rounded">插入</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
