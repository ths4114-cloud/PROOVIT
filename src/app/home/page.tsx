import { redirect } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { ActionLink, Button, StateNotice } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseConfig } from '@/lib/supabase/config';
import { signOut } from '@/app/login/actions';
export const dynamic = 'force-dynamic';
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!getSupabaseConfig()) redirect('/login');
  let authenticated = false;
  try {
    const client = await createClient();
    const { data, error } = await client.auth.getUser();
    authenticated = !!data.user && !error;
  } catch {
    /* Authentication fails closed. */
  }
  if (!authenticated) redirect('/login?error=session');
  const { error } = await searchParams;
  return (
    <AppShell>
      <h1 className="text-3xl font-black">프루빗에 오신 걸 환영해요</h1>
      <StateNotice title="로그인 완료">
        챌린지 참가와 오늘의 미션 연결을 준비하고 있어요. 아직 챌린지 참가가 등록되지는 않았습니다.
      </StateNotice>
      {error === 'signout' && (
        <p role="alert" className="text-sm text-pink-300">
          로그아웃하지 못했어요. 다시 시도해주세요.
        </p>
      )}
      {process.env.ENABLE_UI_PREVIEW === 'true' && (
        <ActionLink href="/preview/home">오늘의 미션 화면 예시</ActionLink>
      )}
      <form action={signOut}>
        <Button type="submit" className="w-full !bg-panel">
          로그아웃
        </Button>
      </form>
    </AppShell>
  );
}
