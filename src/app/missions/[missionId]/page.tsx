import { notFound, redirect } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { ActionLink, Badge, Card, StateNotice } from '@/components/ui';
import { getContext } from '@/lib/data';
import { getSupabaseConfig } from '@/lib/env';
import { getMission, hasDetailContent } from '@/lib/missions/queries';
import { missionLabels } from '@/lib/contracts';

export const dynamic = 'force-dynamic';
export default async function MissionPage({ params }: { params: Promise<{ missionId: string }> }) {
  if (!getSupabaseConfig()) redirect('/');
  if (!(await getContext()).user) redirect('/login');
  const m = await getMission((await params).missionId);
  if (!m) notFound();
  return (
    <AppShell authenticated>
      <Badge>
        DAY {m.day} · {m.phase} · {missionLabels[m.status]}
      </Badge>
      <h1 className="font-display text-3xl font-bold">{m.title}</h1>
      <p className="text-sm leading-7 text-muted">{m.description}</p>
      {hasDetailContent(m) ? (
        <>
          {(
            [
              ['이렇게 실행하세요', m.steps],
              ['오늘의 제출', m.submissionItems],
              ['완료 기준', m.completionCriteria],
            ] as const
          ).map(([title, items]) => (
            <Card key={title}>
              <h2 className="font-bold">{title}</h2>
              <ul className="mt-4 list-inside list-disc space-y-3 text-sm leading-7">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          ))}
          <StateNotice title="인증 사진 안내">{m.proofGuide}</StateNotice>
          {m.status === 'available' && (
            <p className="text-sm text-muted">
              지금 제출하면 {m.availableScore}점 · 서버 시간 기준
            </p>
          )}
          {m.status === 'available' || m.status === 'processing' ? (
            <ActionLink href={`/missions/${m.id}/camera`} className="w-full">
              카메라로 인증하기
            </ActionLink>
          ) : m.status === 'accepted' ? (
            <ActionLink href={`/missions/${m.id}/result`} className="w-full">
              인증 결과 보기 · {m.awardedScore}점
            </ActionLink>
          ) : (
            <StateNotice title={missionLabels[m.status]}>
              미션보드에서 진행 상태를 확인해 주세요.
            </StateNotice>
          )}
        </>
      ) : (
        <StateNotice title="미션 내용을 준비 중이에요">
          상세 콘텐츠가 등록되면 촬영할 수 있습니다.
        </StateNotice>
      )}
      <ActionLink href="/board" className="w-full !bg-panel">
        미션보드 보기
      </ActionLink>
    </AppShell>
  );
}
