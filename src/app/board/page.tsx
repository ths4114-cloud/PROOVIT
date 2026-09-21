import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { StateNotice } from '@/components/ui';
import { getContext } from '@/lib/data';
import { getSupabaseConfig } from '@/lib/env';
import { getBoard } from '@/lib/missions/queries';
import { missionLabels } from '@/lib/contracts';

export const dynamic = 'force-dynamic';
export default async function BoardPage() {
  if (!getSupabaseConfig()) redirect('/');
  if (!(await getContext()).user) redirect('/login');
  const board = await getBoard();
  if (!board) redirect('/');
  return (
    <AppShell authenticated>
      <h1 className="font-display text-3xl font-bold">31일 미션보드</h1>
      <p>{board.title}</p>
      <div className="grid grid-cols-3 gap-3">
        {board.missions.map((m) =>
          m.id ? (
            <Link
              key={m.day}
              href={`/missions/${m.id}`}
              aria-label={`${m.day}일차 ${missionLabels[m.status]}`}
              className="flex min-h-24 flex-col justify-center rounded-2xl border border-line p-3 text-center"
            >
              <span className="font-bold">DAY {m.day}</span>
              <span className="text-xs text-muted">{missionLabels[m.status]}</span>
            </Link>
          ) : (
            <div
              key={m.day}
              className="flex min-h-24 flex-col justify-center rounded-2xl border border-line p-3 text-center text-muted"
            >
              <span>DAY {m.day}</span>
              <span className="text-xs">{m.status === 'locked' ? '해금 전' : '준비 중'}</span>
            </div>
          ),
        )}
      </div>
      <StateNotice title="서버 시간 기준">
        매일 자정에 미션이 열립니다. 제출 가능 여부와 점수는 서버에서 확인합니다.
      </StateNotice>
    </AppShell>
  );
}
