import { createServerFn } from "@tanstack/react-start";
import { ADMIN_CLIENT, requireAdmin } from "./admin-guard.server";

export const listPosts = createServerFn({ method: 'GET' })
  .handler(async () => {
    const { data, error } = await ADMIN_CLIENT.from('posts').select('*, content_types(slug,name)').order('sort_order');
    if (error) throw new Error(error.message);
    return data;
  });

export const getPost = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const { data, error } = await ADMIN_CLIENT.from('posts').select('*, post_sections(*), content_types(slug,name)').eq('slug', slug).single();
    if (error) throw new Error(error.message);
    return data;
  });

export const upsertPost = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    if (!await requireAdmin(data._token)) throw new Error('Unauthorized');
    const { _token, _sections, ...post } = data;
    const { data: saved, error } = await ADMIN_CLIENT.from('posts').upsert(post).select('id').single();
    if (error) throw new Error(error.message);
    if (_sections) {
      await ADMIN_CLIENT.from('post_sections').delete().eq('post_id', saved.id);
      if (_sections.length > 0) {
        await ADMIN_CLIENT.from('post_sections').insert(_sections.map((s: any) => ({ ...s, post_id: saved.id })));
      }
    }
    return { ok: true, id: saved.id };
  });

export const deletePost = createServerFn({ method: 'POST' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    if (!await requireAdmin(id)) throw new Error('Unauthorized');
    const { error } = await ADMIN_CLIENT.from('posts').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
