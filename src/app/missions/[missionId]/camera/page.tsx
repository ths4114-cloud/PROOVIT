import { notFound, redirect } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { ActionLink, StateNotice } from '@/components/ui';
import { CameraCapture } from '@/components/camera-capture';
import { getSupabaseConfig } from '@/lib/env';
import { getContext } from '@/lib/data';
import { getMission, hasDetailContent } from '@/lib/missions/queries';
import { proofStorageConfigured } from '@/lib/proofs/server';
export const dynamic = 'force-dynamic';
export default async function RealMissionCamera({
  params,
}: {
  params: Promise<{ missionId: string }>;
}) {
  if (!getSupabaseConfig()) redirect('/');
  if (!(await getContext()).user) redirect('/login');
  const m = await getMission((await params).missionId);
  if (!m) notFound();
  if (m.status === 'accepted') redirect(`/missions/${m.id}/result`);
  return (
    <AppShell authenticated>
      <h1 className="font-display text-2xl font-bold">
        DAY {m.day} · {m.title}
      </h1>
      {(m.status === 'available' || m.status === 'processing') &&
      hasDetailContent(m) &&
      proofStorageConfigured() ? (
        <>
          <StateNotice title="촬영 전 확인">
            {m.proofGuide} 사진은 비공개로 저장되며 제출 마감 30일 후 삭제됩니다. P0는 사진 내용의
            수행 진위가 아닌 파일·권한 등 기술 조건을 확인합니다.
          </StateNotice>
          <CameraCapture missionId={m.id} />
        </>
      ) : (
        <StateNotice title="지금은 촬영할 수 없어요">
          제출 기간 또는 사진 저장 연결 상태를 확인해 주세요.
        </StateNotice>
      )}
      <ActionLink href={`/missions/${m.id}`} className="w-full !bg-panel">
        미션 상세로 돌아가기
      </ActionLink>
    </AppShell>
  );
}
