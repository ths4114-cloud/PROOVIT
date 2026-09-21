import { redirect } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { ActionLink, StateNotice } from '@/components/ui';
import { getSupabaseConfig } from '@/lib/env';
import { getContext } from '@/lib/data';

/**
 * 실제(UUID) 미션의 카메라 인증 화면.
 * 촬영·미리보기·재촬영 UI는 다른 개발자가 preview 경로에 구현한 컴포넌트를
 * 이 real 라우트로 옮겨 붙이는 작업이 후속 통합 과제로 남아 있습니다.
 * 지금은 "준비 중" 안내만 제공하며, 완료되지 않은 진입점을 완료로 표시하지 않습니다.
 */
export const dynamic = 'force-dynamic';

export default async function RealMissionCamera() {
  if (!getSupabaseConfig()) redirect('/');
  const { user } = await getContext();
  if (!user) redirect('/login');

  return (
    <AppShell nav={false} authenticated>
      <StateNotice title="카메라 인증 연결 준비 중">
        오늘의 미션 촬영·미리보기·재촬영 화면은 곧 이 화면에 연결됩니다. 화면 구성은{' '}
        <code className="text-accent">/preview/missions/[missionId]/camera</code> 에서 먼저 확인하실
        수 있어요.
      </StateNotice>
      <ActionLink href="/home" className="w-full !bg-panel">
        홈으로 돌아가기
      </ActionLink>
    </AppShell>
  );
}
