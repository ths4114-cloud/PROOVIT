import Link from 'next/link';
import { Badge } from '@/components/ui';
import { previewMissions } from '@/lib/preview/data';
import { missionLabels } from '@/lib/contracts';
import { previewRoutes } from '@/lib/routes';
export default function Board() {
  return (
    <>
      <Badge>DAY 12 / 31 · 예시</Badge>
      <h1 className="text-3xl font-black">31일 미션보드</h1>
      <p className="text-sm leading-7 text-muted">하루의 실행이 모여 하나의 MVP가 됩니다.</p>
      {(['DEFINE', 'DISCOVER', 'VALIDATE', 'DESIGN', 'BUILD', 'LAUNCH'] as const).map((phase) => (
        <section key={phase}>
          <h2 className="mb-3 text-xs font-bold tracking-[.2em] text-pink-400">{phase}</h2>
          <div className="grid grid-cols-5 gap-2">
            {previewMissions
              .filter((m) => m.phase === phase)
              .map((m) =>
                m.status === 'locked' ? (
                  <div
                    key={m.id}
                    aria-label={`${m.day}일차 해금 전`}
                    className="rounded-2xl border border-line bg-panel p-3 text-center text-muted"
                  >
                    <span className="text-lg font-bold">{m.day}</span>
                    <span className="mt-1 block text-[10px]">해금 전</span>
                  </div>
                ) : (
                  <Link
                    key={m.id}
                    href={previewRoutes.mission(m.id)}
                    aria-label={`${m.day}일차 ${missionLabels[m.status]}`}
                    className={`rounded-2xl border p-3 text-center ${m.status === 'available' ? 'border-accent bg-accent text-white' : 'border-accent/35 bg-accent/10 text-pink-200'}`}
                  >
                    <span className="text-lg font-bold">{m.day}</span>
                    <span className="mt-1 block text-[10px]">
                      {m.status === 'accepted' ? '완료' : '오늘'}
                    </span>
                  </Link>
                ),
              )}
          </div>
        </section>
      ))}
    </>
  );
}
