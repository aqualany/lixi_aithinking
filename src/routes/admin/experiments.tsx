import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster, toast } from "sonner";
import { MarkdownPreview } from "@/components/admin/MarkdownPreview";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { MediaSection } from "@/components/admin/MediaSection";
import { generateSlug } from "@/lib/utils";

export const Route = createFileRoute("/admin/experiments")({
  component: ExperimentEditor,
});

function ExperimentEditor() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => { load(); }, []);

  const load = () => {
    (supabase.from('posts') as any)
      .select('*, content_types!inner(slug)')
      .eq('content_types.slug', 'experiment')
      .order('sort_order')
      .then(({ data }: any) => { if (data) setPosts(data); });
  };

  const openEditor = (post?: any) => {
    if (post) {
      const extra = post.extra || {};
      setEditing({
        id: post.id, slug: post.slug, title: post.title, subtitle: post.subtitle,
        summary: post.summary, body_md: post.body_md, published_at: post.published_at?.slice(0, 10) || '',
        sort_order: post.sort_order, status: post.status,
        hypothesis: extra.hypothesis || '',
        optimization: extra.optimization || ['', '', ''],
        self_training: extra.self_training || ['', ''],
        screenshot_media_ids: extra.screenshot_media_ids || [],
        num: extra.num || '',
        content_type_id: post.content_type_id,
      });
    } else {
      setEditing({
        slug: '', title: '', subtitle: '', summary: '', body_md: '', published_at: '',
        sort_order: posts.length + 1, status: 'published',
        hypothesis: '', optimization: ['', '', ''], self_training: ['', ''],
        screenshot_media_ids: [], num: '',
        content_type_id: '',
      });
      setSlugEdited(false);
    }
  };

  const handleTitleChange = (title: string) => {
    if (!editing) return;
    setEditing({ ...editing, title });
    if (!slugEdited) {
      setEditing((prev: any) => ({ ...prev, title, slug: generateSlug(title) }));
    }
  };

  const save = async () => {
    setSaving(true);
    let ctId = editing.content_type_id;
    if (!ctId) {
      const { data: ct } = await (supabase.from('content_types') as any)
        .select('id').eq('slug', 'experiment').single();
      ctId = ct?.id;
    }
    const payload: any = {
      content_type_id: ctId,
      slug: editing.slug || generateSlug(editing.title),
      title: editing.title,
      subtitle: editing.subtitle,
      summary: editing.summary,
      body_md: editing.body_md,
      status: editing.status,
      published_at: editing.published_at || null,
      sort_order: Number(editing.sort_order),
      extra: {
        num: editing.num || '',
        hypothesis: editing.hypothesis,
        optimization: editing.optimization.filter((s: string) => s.trim()),
        self_training: editing.self_training.filter((s: string) => s.trim()),
        screenshot_media_ids: editing.screenshot_media_ids || [],
      },
    };
    if (editing.id) payload.id = editing.id;
    const { data: saved, error }: any = await (supabase.from('posts') as any)
      .upsert(payload)
      .select('id')
      .single();
    if (error) { toast.error("保存失败: " + error.message); setSaving(false); return; }
    toast.success("保存成功 ✓");
    setSaving(false);
    setEditing(null);
    load();
  };

  const insertImage = (md: string) => {
    if (!editing) return;
    setEditing({ ...editing, body_md: editing.body_md + '\n' + md });
  };

  return (
    <div>
      <Toaster position="top-right" richColors />
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-medium text-stone-800">实验笔记</h1>
        <button
          onClick={() => openEditor()}
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition-colors"
        >
          + 新建实验
        </button>
      </div>
      <p className="text-sm text-stone-400 mb-8">编辑提示词迭代实验记录</p>

      {editing && (
        <div className="mb-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-stone-700 mb-4">
            {editing.id ? '编辑' : '新建'} 实验
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-stone-400 mb-1">标题</label>
              <input
                value={editing.title}
                onChange={e => handleTitleChange(e.target.value)}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">
                Slug
                <span className="ml-1 text-[10px] text-stone-300">（新实验自动生成）</span>
              </label>
              <input
                value={editing.slug}
                onChange={e => { setEditing({ ...editing, slug: e.target.value }); setSlugEdited(true); }}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
              />
              <p className="mt-1 text-[10px] text-stone-400">
                URL: /experiments/{editing.slug || '{slug}'}
              </p>
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">
                编号
                <span className="ml-1 text-[10px] text-stone-300">（如 "笔记 01"）</span>
              </label>
              <input
                value={editing.num}
                onChange={e => setEditing({ ...editing, num: e.target.value })}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">分类</label>
              <input
                value={editing.subtitle}
                onChange={e => setEditing({ ...editing, subtitle: e.target.value })}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-stone-400 mb-1">关键洞察 (keyInsight)</label>
              <textarea
                value={editing.summary}
                onChange={e => setEditing({ ...editing, summary: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-stone-400 mb-1">假设 (hypothesis)</label>
              <textarea
                value={editing.hypothesis}
                onChange={e => setEditing({ ...editing, hypothesis: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-stone-400 mb-1">正文 Markdown</label>
              <MarkdownPreview content={editing.body_md} />
              <textarea
                value={editing.body_md}
                onChange={e => setEditing({ ...editing, body_md: e.target.value })}
                rows={8}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-stone-200 resize-y"
                placeholder="实验正文（支持 Markdown）"
              />
              <MediaSection onInsertImage={insertImage} />
            </div>
          </div>

          <h4 className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">优化过程 (optimization)</h4>
          <div className="space-y-3 mb-6">
            {editing.optimization.map((v: string, i: number) => (
              <div key={i}>
                <label className="block text-xs text-stone-400 mb-1">步骤 {i + 1}</label>
                <textarea
                  value={v}
                  onChange={e => {
                    const arr = [...editing.optimization];
                    arr[i] = e.target.value;
                    setEditing({ ...editing, optimization: arr });
                  }}
                  rows={2}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                />
              </div>
            ))}
            <button
              onClick={() => setEditing({ ...editing, optimization: [...editing.optimization, ''] })}
              className="text-xs text-stone-500 hover:text-stone-700"
            >
              + 添加步骤
            </button>
          </div>

          <h4 className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">自训练思路 (self_training)</h4>
          <div className="space-y-3 mb-6">
            {editing.self_training.map((v: string, i: number) => (
              <div key={i}>
                <label className="block text-xs text-stone-400 mb-1">思路 {i + 1}</label>
                <textarea
                  value={v}
                  onChange={e => {
                    const arr = [...editing.self_training];
                    arr[i] = e.target.value;
                    setEditing({ ...editing, self_training: arr });
                  }}
                  rows={2}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                />
              </div>
            ))}
            <button
              onClick={() => setEditing({ ...editing, self_training: [...editing.self_training, ''] })}
              className="text-xs text-stone-500 hover:text-stone-700"
            >
              + 添加思路
            </button>
          </div>

          {/* Screenshot Media Picker - Item 1 & 3 */}
          <h4 className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">
            实验截图
            <span className="ml-2 font-normal text-stone-300">（从媒体库选择）</span>
          </h4>
          <div className="mb-6">
            <MediaPicker
              category="experiment"
              selectedIds={editing.screenshot_media_ids || []}
              onSelect={(ids) => setEditing({ ...editing, screenshot_media_ids: ids })}
              max={10}
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
            <button
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-stone-900 px-6 py-2 text-sm text-white hover:bg-stone-800 disabled:opacity-50"
            >
              {saving ? "保存中…" : "保存"}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="text-sm text-stone-400 hover:text-stone-600"
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/50">
              <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">标题</th>
              <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">分类</th>
              <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">编号</th>
              <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-5 py-3">状态</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p: any) => {
              const extra = p.extra || {};
              return (
                <tr key={p.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50">
                  <td className="px-5 py-4 text-stone-800 font-medium">{p.title}</td>
                  <td className="px-5 py-4 text-xs text-stone-500">{p.subtitle || extra.category || '—'}</td>
                  <td className="px-5 py-4 text-xs text-stone-400">{extra.num || p.display_number || '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      p.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' :
                      p.status === 'draft' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-stone-50 text-stone-500 border-stone-200'
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => openEditor(p)} className="text-xs text-stone-500 hover:text-stone-800 mr-4">编辑</button>
                  </td>
                </tr>
              );
            })}
            {posts.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-stone-400">还没有实验笔记</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
