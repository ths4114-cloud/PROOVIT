import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseConfig } from '@/lib/env';
import type { Database } from '@/types/domain';
export async function createClient() {
  const config = getSupabaseConfig();
  if (!config) throw new Error('서비스 연결 설정이 필요합니다.');
  const store = await cookies();
  return createServerClient<Database>(config.url, config.key, {
    cookieOptions: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: 'no-store',
          signal: AbortSignal.timeout(12000),
        }),
    },
    cookies: {
      getAll: () => store.getAll(),
      setAll(items) {
        try {
          items.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          /* Server Components cannot set cookies; proxy refreshes them first. */
        }
      },
    },
  });
}
