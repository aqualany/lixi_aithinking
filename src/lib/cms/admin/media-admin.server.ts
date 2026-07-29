import { createServerFn } from "@tanstack/react-start";
import { ADMIN_CLIENT, requireAdmin } from "./admin-guard.server";

export const listMedia = createServerFn({ method: 'GET' })
  .handler(async () => {
    const { data, error } = await ADMIN_CLIENT.from('media' as any)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const listMediaByCategory = createServerFn({ method: 'GET' })
  .validator((category: string) => category)
  .handler(async ({ data: category }) => {
    const { data, error } = await ADMIN_CLIENT.from('media' as any)
      .select('*')
      .eq('media_category', category)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const updateMediaCategory = createServerFn({ method: 'POST' })
  .validator((data: { id: string; category: string }) => data)
  .handler(async ({ data: { id, category } }) => {
    if (!await requireAdmin(id)) throw new Error('Unauthorized');
    const { error } = await ADMIN_CLIENT.from('media' as any)
      .update({ media_category: category })
      .eq('id', id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteMedia = createServerFn({ method: 'POST' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    if (!await requireAdmin(id)) throw new Error('Unauthorized');
    const { data: media } = await ADMIN_CLIENT.from('media' as any).select('storage_path').eq('id', id).single();
    if (media) {
      await ADMIN_CLIENT.storage.from('media').remove([media.storage_path]);
    }
    const { error } = await ADMIN_CLIENT.from('media' as any).delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
