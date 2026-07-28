import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/posts/")({
  component: PostListPage,
});

function PostListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(() => {
    (supabase as any).from('posts').select('*, content_types(name)').order('sort_order').then(({ data }: any) => {
      if (data) setPosts(data);
    });
  }, []);
  const del = async (id: string) => {
    if (!confirm('确认删除？')) return;
    await (supabase as any).from("posts" as any).delete().eq('id', id);
    setPosts(posts.filter(p => p.id !== id));
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-neutral-800">文章管理</h1>
        <Link to={"/admin/posts/new" as any} className="rounded bg-neutral-900 px-4 py-2 text-sm text-white">新建</Link>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="border-b text-left text-neutral-500">
          <th className="pb-2 pr-4">标题</th><th className="pb-2 pr-4">类型</th><th className="pb-2 pr-4">状态</th><th className="pb-2"></th>
        </tr></thead>
        <tbody>{posts.map(p => (
          <tr key={p.id} className="border-b">
            <td className="py-2 pr-4">{p.title}</td>
            <td className="py-2 pr-4 text-neutral-500">{p.content_types?.name}</td>
            <td className="py-2 pr-4 text-neutral-500">{p.status}</td>
            <td className="py-2">
              <Link to="/admin/posts/$id/edit" params={{ id: p.id }} className="text-blue-600 hover:underline mr-3">编辑</Link>
              <button onClick={() => del(p.id)} className="text-red-500 hover:underline">删除</button>
            </td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
