// src/lib/cms/supabase.server.ts — SSR anonymous client factory
// Phase 3: Data access layer
// Safe to import in route loaders on both server and client

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

let _ssrClient: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Creates a Supabase client for route loaders using the anon publishable key.
 * Works on both SSR (via process.env) and CSR (via import.meta.env.VITE_).
 */
export function createSsrClient() {
  if (_ssrClient) return _ssrClient;

  let url = (typeof process !== 'undefined' && process.env?.SUPABASE_URL) as string | undefined;
  let key = (typeof process !== 'undefined' && process.env?.SUPABASE_PUBLISHABLE_KEY) as string | undefined;

  // Client-side fallback (import.meta.env)
  if (!url || !key) {
    try {
      url = (import.meta as any).env?.VITE_SUPABASE_URL as string;
      key = (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY as string;
    } catch {}
  }

  if (!url || !key) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in environment'
    );
  }

  _ssrClient = createClient<Database>(url, key, {
    auth: { persistSession: false },
  });

  return _ssrClient;
}
