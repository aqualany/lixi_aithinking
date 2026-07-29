import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MediaPickerProps {
  /** Category to filter: 'article' | 'experiment' | 'general' | 'all' */
  category?: string;
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
  /** Maximum number of selectable items */
  max?: number;
}

export function MediaPicker({ category = 'all', selectedIds, onSelect, max = 10 }: MediaPickerProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    load();
  }, [category]);

  const load = async () => {
    setLoading(true);
    let query = (supabase.from('media') as any).select('*');
    if (category && category !== 'all') {
      query = query.eq('media_category', category);
    }
    const { data } = await query.order('created_at', { ascending: false });
    if (data) setFiles(data);
    setLoading(false);
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
      storage_path: path, public_url: publicUrl, mime_type: file.type,
      alt: file.name, media_category: category === 'all' ? 'general' : category,
    });
    setUploading(false);
    load();
  };

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelect(selectedIds.filter(i => i !== id));
    } else {
      if (selectedIds.length >= max) return;
      onSelect([...selectedIds, id]);
    }
  };

  const selectedFiles = files.filter(f => selectedIds.includes(f.id));

  return (
    <div className="space-y-3">
      {/* Current selection */}
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {selectedFiles.map((f: any) => (
            <div key={f.id} className="relative group rounded-lg border border-stone-200 overflow-hidden bg-stone-50">
              <div className="aspect-square">
                <img src={f.public_url} alt={f.alt} className="h-full w-full object-cover" />
              </div>
              <button
                onClick={() => toggle(f.id)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
              <p className="truncate text-[10px] text-stone-400 px-1 py-0.5">{f.alt}</p>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-dashed border-stone-300 px-4 py-2 text-xs text-stone-500 hover:border-stone-400 hover:text-stone-700 transition-colors">
        {uploading ? '上传中…' : '+ 上传图片'}
        <input type="file" accept="image/*" onChange={upload} className="hidden" disabled={uploading} />
      </label>

      {/* Media grid */}
      {loading ? (
        <p className="text-xs text-stone-400">加载中…</p>
      ) : files.length === 0 ? (
        <p className="text-xs text-stone-400">暂无媒体文件，请先上传。</p>
      ) : (
        <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto p-2 border border-stone-100 rounded-lg">
          {files.map((f: any) => {
            const isSelected = selectedIds.includes(f.id);
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => toggle(f.id)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  isSelected ? 'border-stone-900 ring-1 ring-stone-900' : 'border-transparent hover:border-stone-300'
                }`}
              >
                <img src={f.public_url} alt={f.alt} className="h-full w-full object-cover" />
                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 bg-stone-900/80 text-white text-[9px] text-center py-0.5">
                    已选
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
