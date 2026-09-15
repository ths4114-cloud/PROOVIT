import { notFound } from 'next/navigation';
import { ActionLink, Badge, Button, StateNotice } from '@/components/ui';
import { getPreviewMission } from '@/lib/preview/data';
import { previewRoutes } from '@/lib/routes';
export default async function Camera({ params }: { params: Promise<{ missionId: string }> }) {
  const { missionId } = await params;
  const m = getPreviewMission(missionId);
  if (!m) notFound();
  return (
    <>
      <Badge>DAY {m.day} / CAMERA PROOF</Badge>
      <h1 className="text-2xl font-bold">실행의 순간을 남기세요</h1>
      <div className="flex aspect-[3/4] items-center justify-center rounded-3xl border border-dashed border-line bg-panel p-8 text-center text-sm leading-7 text-muted">
        카메라 · 촬영 미리보기 영역
        <br />
        담당 개발자가 실제 촬영을 연결합니다.
      </div>
      <Button disabled className="w-full">
        촬영 기능 연결 예정
      </Button>
      <StateNotice title="카메라 연결 시 필요한 상태">
        권한 요청·거부, 미지원, 촬영, 재촬영, 제출 중, 실패·재시도를 이 영역에 연결합니다. 사진첩
        선택은 제공하지 않습니다.
      </StateNotice>
      {m.status === 'available' && (
        <ActionLink href={previewRoutes.result(m.id)} className="w-full !bg-panel">
          점수 결과 예시 보기 · 제출 아님
        </ActionLink>
      )}
    </>
  );
}
