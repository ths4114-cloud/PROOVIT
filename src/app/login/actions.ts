'use server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseConfig, getAppOrigin } from '@/lib/supabase/config';
export type LoginState = { error: string | null };
export async function signInWithGoogle(): Promise<LoginState> {
  const origin = getAppOrigin();
  const settings = getSupabaseConfig();
  if (!settings || !origin)
    return { error: '로그인 연결을 준비 중입니다. 잠시 후 다시 시도해주세요.' };
  let destination: string;
  try {
    const client = await createClient();
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${origin}/auth/callback`, skipBrowserRedirect: true },
    });
    if (error || !data.url)
      return { error: '로그인을 시작하지 못했어요. 잠시 후 다시 시도해주세요.' };
    const target = new URL(data.url);
    if (target.origin !== settings.url) return { error: '로그인 주소를 확인할 수 없어요.' };
    destination = data.url;
  } catch {
    return { error: '로그인 서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.' };
  }
  redirect(destination);
}
export async function signOut(): Promise<void> {
  let failed = false;
  try {
    const client = await createClient();
    const { error } = await client.auth.signOut({ scope: 'local' });
    failed = !!error;
  } catch {
    failed = true;
  }
  if (failed) redirect('/home?error=signout');
  redirect('/login');
}
