import { notFound } from 'next/navigation';
import { ActionLink, Badge, Card, StateNotice } from '@/components/ui';
import { getPreviewMission } from '@/lib/preview/data';
import { missionLabels } from '@/lib/contracts';
import { previewRoutes } from '@/lib/routes';
export default async function Detail({ params }: { params: Promise<{ missionId: string }> }) {
  const { missionId } = await params;
  const m = getPreviewMission(missionId);
  if (!m) notFound();
  return (
    <>
      <Badge>
        DAY {m.day} · {m.phase} · {missionLabels[m.status]}
      </Badge>
      <h1 className="text-3xl leading-tight font-black">{m.title}</h1>
      <p className="text-sm leading-7 text-muted">{m.description}</p>
      <Card>
        <h2 className="font-bold">이렇게 실행하세요</h2>
        <ol className="mt-4 space-y-4">
          {m.steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm leading-7">
              <span className="text-pink-400">0{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </Card>
      <Card>
        <h2 className="font-bold">오늘의 제출</h2>
        <ul className="mt-4 space-y-3">
          {m.submissionItems.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-7">
              <span className="text-pink-400" aria-hidden="true">
                •
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="font-bold">완료 기준</h2>
        <ul className="mt-4 space-y-3">
          {m.completionCriteria.map((criterion) => (
            <li key={criterion} className="flex gap-3 text-sm leading-7">
              <span className="text-pink-400" aria-hidden="true">
                ✓
              </span>
              <span>{criterion}</span>
            </li>
          ))}
        </ul>
      </Card>
      <StateNotice title="인증 사진 안내">{m.proofGuide}</StateNotice>
      {m.status === 'available' ? (
        <ActionLink href={previewRoutes.camera(m.id)} className="w-full">
          카메라 인증 화면 보기
        </ActionLink>
      ) : m.status === 'accepted' ? (
        <StateNotice title="이미 완료한 미션이에요">
          이 화면의 완료 상태는 시연용 데이터입니다.
        </StateNotice>
      ) : (
        <StateNotice title="아직 열리지 않은 미션이에요">해금 후 인증할 수 있습니다.</StateNotice>
      )}
    </>
  );
}
