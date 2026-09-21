import { AppShell } from '@/components/app-shell';
import { ActionLink, StateNotice } from '@/components/ui';
import { redirect } from 'next/navigation';
import { getSupabaseConfig } from '@/lib/env';
import { getContext } from '@/lib/data';

/**
 * 실제(로그인 사용자별) 31일 미션보드 화면.
 * 실제 미션 목록 조회 API는 아직 없어 준비 중 안내만 제공합니다(후속 통합 과제).
 * 참가·인증 화면 통일감을 위해 하단 네비는 5개 자리를 항상 유지합니다.
 */
export const dynamic = 'force-dynamic';

export default async function BoardPage() {
  if (!getSupabaseConfig()) redirect('/');
  const { user } = await getContext();
  if (!user) redirect('/login');

  return (
    <AppShell authenticated>
      <StateNotice title="미션보드 연결 준비 중">
        나의 31일 진행 현황을 한눈에 보는 화면은 곧 연결됩니다. 지금은 콘텐츠 구성을{' '}
        <code className="text-accent">/preview/board</code>에서 먼저 확인하실 수 있어요.
      </StateNotice>
      <ActionLink href="/home" className="w-full !bg-panel">
        홈으로 돌아가기
      </ActionLink>
    </AppShell>
  );
}
