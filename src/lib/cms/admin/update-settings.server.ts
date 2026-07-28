import { createServerFn } from "@tanstack/react-start";
import { ADMIN_CLIENT, requireAdmin } from "./admin-guard.server";

export const updateSiteSettings = createServerFn({ method: 'POST' })
  .validator((data: Record<string, any>) => data)
  .handler(async ({ data }) => {
    if (!await requireAdmin(data._token)) throw new Error('Unauthorized');
    const { _token, ...settings } = data;
    const { error } = await ADMIN_CLIENT.from('site_settings').update(settings).eq('id', 'c0000000-0000-0000-0000-000000000001');
    if (error) throw new Error(error.message);
    return { ok: true };
  });
