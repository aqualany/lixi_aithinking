import { createServerFn } from "@tanstack/react-start";
import { ADMIN_CLIENT, requireAdmin } from "./admin-guard.server";

export const listNav = createServerFn({ method: 'GET' })
  .handler(async () => {
    const { data, error } = await ADMIN_CLIENT.from('navigation').select('*').order('sort_order');
    if (error) throw new Error(error.message);
    return data;
  });

export const upsertNav = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    if (!await requireAdmin(data._token)) throw new Error('Unauthorized');
    const { _token, ...nav } = data;
    const { error } = await ADMIN_CLIENT.from('navigation').upsert(nav);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteNav = createServerFn({ method: 'POST' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    if (!await requireAdmin(id)) throw new Error('Unauthorized');
    const { error } = await ADMIN_CLIENT.from('navigation').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
