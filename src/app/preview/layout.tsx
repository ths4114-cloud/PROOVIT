import { notFound } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseConfig } from '@/lib/env';

export const dynamic = 'force-dynamic';

export default async function PreviewLayout({ children }: { children: React.ReactNode }) {
  if (process.env.ENABLE_UI_PREVIEW !== 'true') notFound();
  let authenticated = false;
  if (getSupabaseConfig()) {
    try {
      const client = await createClient();
      const { data, error } = await client.auth.getUser();
      authenticated = !!data.user && !error;
    } catch {
      /* Authentication fails closed — nav shows 로그인 by default. */
    }
  }
  return (
    <AppShell preview authenticated={authenticated}>
      {children}
    </AppShell>
  );
}
