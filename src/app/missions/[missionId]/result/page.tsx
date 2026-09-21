import { notFound, redirect } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { ActionLink, Card, StateNotice } from '@/components/ui';
import { getContext } from '@/lib/data';
import { getSupabaseConfig } from '@/lib/env';
import { getMission } from '@/lib/missions/queries';
import { getProofResult } from '@/lib/proofs/server';
export const dynamic = 'force-dynamic';
export default async function ResultPage({ params }: { params: Promise<{ missionId: string }> }) {
  if (!getSupabaseConfig()) redirect('/');
  if (!(await getContext()).user) redirect('/login');
  const m = await getMission((await params).missionId);
  if (!m) notFound();
  const result = await getProofResult(m.id);
  return (
    <AppShell authenticated>
      {result ? (
        <>
          <h1 className="font-display text-3xl font-bold">인증 완료</h1>
          <Card>
            <p>이번 미션 획득 점수</p>
            <p className="text-3xl font-bold text-accent">+{result.awardedScore}점</p>
          </Card>
          <Card>
            <p>누적 점수</p>
            <p data-testid="proof-total-score" className="text-2xl font-bold">
              {result.totalScore.toLocaleString('ko-KR')}점
            </p>
          </Card>
          <p className="text-sm text-muted">
            사진 저장과 기술 검증이 완료됐어요. 사진 내용의 진위를 심사한 결과는 아닙니다.
          </p>
        </>
      ) : (
        <StateNotice title="인증 결과를 기다리고 있어요">
          아직 인정된 사진이 없습니다. 미션 상세에서 제출 상태를 확인해 주세요.
        </StateNotice>
      )}
      <ActionLink href="/board" className="w-full">
        미션보드 보기
      </ActionLink>
      <ActionLink href="/home" className="w-full !bg-panel">
        홈으로 돌아가기
      </ActionLink>
    </AppShell>
  );
}
