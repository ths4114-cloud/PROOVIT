import { notFound } from 'next/navigation';
import { ActionLink, Badge, StateNotice } from '@/components/ui';
import { getPreviewMission } from '@/lib/preview/data';
import { previewRoutes } from '@/lib/routes';
import { CameraCapture } from './camera-capture';
export default async function Camera({ params }: { params: Promise<{ missionId: string }> }) {
  const { missionId } = await params;
  const m = getPreviewMission(missionId);
  if (!m) notFound();
  return (
    <>
      <Badge>DAY {m.day} / CAMERA PROOF</Badge>
      <h1 className="text-2xl font-bold">실행의 순간을 남기세요</h1>
      {m.status === 'available' ? (
        <CameraCapture />
      ) : (
        <StateNotice title="지금은 촬영할 수 없어요">
          도전 가능한 미션에서만 카메라 인증을 시작할 수 있습니다.
        </StateNotice>
      )}
      {m.status === 'available' && (
        <ActionLink href={previewRoutes.result(m.id)} className="w-full !bg-panel">
          점수 결과 예시 보기 · 제출 아님
        </ActionLink>
      )}
    </>
  );
}
