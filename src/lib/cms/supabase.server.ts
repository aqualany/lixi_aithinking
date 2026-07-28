// src/lib/cms/supabase.server.ts — SSR anonymous client factory
// Phase 3: Data access layer
// Only import this in route loaders (never in browser bundles)

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

let _ssrClient: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Creates a Supabase client for SSR route loaders using the anon publishable key.
 * Never imported in client bundles — only used inside route files' loader functions.
 */
export function createSsrClient() {
  if (_ssrClient) return _ssrClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in SSR environment'
    );
  }

  _ssrClient = createClient<Database>(url, key, {
    auth: { persistSession: false },
  });

  return _ssrClient;
}
