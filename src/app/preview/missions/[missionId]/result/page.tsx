import { notFound } from 'next/navigation';
import { ActionLink, Badge, Card } from '@/components/ui';
import { getPreviewMission } from '@/lib/preview/data';
export default async function Result({ params }: { params: Promise<{ missionId: string }> }) {
  const { missionId } = await params;
  const m = getPreviewMission(missionId);
  if (!m) notFound();
  return (
    <>
      <Badge>결과 화면 예시</Badge>
      <div className="py-8 text-center">
        <p className="text-5xl text-pink-400" aria-hidden="true">
          ✓
        </p>
        <h1 className="mt-5 text-3xl font-black">인증 완료</h1>
        <p className="mt-3 text-sm text-muted">실제 제출·검증이 성공하면 표시할 화면입니다.</p>
        <p className="mt-7 text-6xl font-black tracking-tighter text-pink-400">
          +100<span className="text-xl">점</span>
        </p>
      </div>
      <Card>
        <p className="text-sm text-muted">{m.title}</p>
        <div className="mt-4 flex justify-between">
          <span>누적 점수 · 예시</span>
          <strong>1,200점</strong>
        </div>
      </Card>
      <p className="text-sm leading-7 text-muted">
        이번 미리보기는 사진을 업로드하거나 점수를 지급하지 않습니다. 실제 결과는 서버에서 확정한
        값으로 연결합니다.
      </p>
      <ActionLink className="w-full" href="/preview/home">
        오늘의 미션으로
      </ActionLink>
      <ActionLink className="w-full !bg-panel" href="/preview/board">
        31일 보드 보기
      </ActionLink>
    </>
  );
}
