import { redirect } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { Button, Card } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseConfig } from '@/lib/supabase/config';
import { signOut } from '@/app/login/actions';

export const dynamic = 'force-dynamic';

export default async function MyPage() {
  if (!getSupabaseConfig()) redirect('/login');
  let email: string | null = null;
  try {
    const client = await createClient();
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) redirect('/login?error=session');
    email = data.user.email ?? null;
  } catch {
    redirect('/login?error=session');
  }
  return (
    <AppShell>
      <h1 className="text-3xl font-black">마이페이지</h1>
      <Card>
        <p className="text-xs text-muted">로그인 계정</p>
        <p className="mt-2 text-lg font-bold">{email ?? '알 수 없음'}</p>
      </Card>
      <Card>
        <h2 className="font-bold">참가 정보</h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          챌린지 참가·진행 내역 연결은 참가 API가 준비되는 대로 이 화면에 표시됩니다.
        </p>
      </Card>
      <form action={signOut}>
        <Button type="submit" className="w-full !bg-panel-raised">
          로그아웃
        </Button>
      </form>
    </AppShell>
  );
}
