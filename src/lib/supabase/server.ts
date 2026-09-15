import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseConfig } from './config';
export async function createClient() {
  const config = getSupabaseConfig();
  if (!config) throw new Error('AUTH_NOT_CONFIGURED');
  const cookieStore = await cookies();
  return createServerClient(config.url, config.key, {
    global: {
      fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(10_000) }),
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          /* Server Components cannot write cookies; proxy.ts refreshes sessions. */
        }
      },
    },
  });
}
