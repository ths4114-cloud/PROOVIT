import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { Badge, Card, ConfirmedBadge, MonoStat, ProgressBar, StateNotice } from '@/components/ui';
import { getContext, getHome } from '@/lib/data';
import { getSupabaseConfig } from '@/lib/env';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  if (!getSupabaseConfig()) {
    return (
      <AppShell authenticated>
        <StateNotice title="새로운 도전을 준비하고 있어요">
          챌린지 연결이 완료되면 이곳에서 참가하고 오늘의 미션을 확인할 수 있습니다. 운영자에게
          서비스 준비 상태를 확인해 주세요.
        </StateNotice>
      </AppShell>
    );
  }
  const { user } = await getContext();
  if (!user) redirect('/login');
  const home = await getHome();
  if (!home) redirect('/');

  const { challenge: c, current_day: day, today_mission: mission, total_score: score } = home;
  const before = day === 0;
  const ended = day > c.duration_days;
  const dayLabel = before ? '시작 전' : ended ? '기간 종료' : `${day}일차`;

  return (
    <AppShell authenticated>
      <div>
        <h1 className="font-display text-2xl leading-tight font-bold">
          {before ? (
            '시작을 준비해 볼까요?'
          ) : ended ? (
            '당신의 도전을 기억해요.'
          ) : (
            <>
              오늘도 한 걸음,
              <br />
              출시에 더 가까이.
            </>
          )}
        </h1>
      </div>

      <Card className="border-accent/40 bg-gradient-to-br from-panel to-accent-deep/50">
        <div className="flex items-center justify-between">
          <Badge>{before ? '시작 대기' : ended ? '기간 종료' : '진행 중인 챌린지'}</Badge>
        </div>
        <h2 className="mt-3 text-lg font-bold">{c.title}</h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          {before
            ? `${c.start_date}에 첫 미션이 열려요.`
            : ended
              ? '챌린지 기간이 끝났습니다. 확정 점수를 확인하세요.'
              : '매일의 작은 실행이, 결국 출시가 됩니다.'}
        </p>
        <Link
          href="/"
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent"
        >
          챌린지 안내 →
        </Link>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs text-muted">오늘의 진행</p>
          {before || ended ? (
            <p className="mt-2 text-xl font-bold">{dayLabel}</p>
          ) : (
            <MonoStat value={day} suffix={`/ ${c.duration_days}일`} testId="current-day" />
          )}
          <ProgressBar value={Math.min(day, c.duration_days)} max={c.duration_days} />
        </Card>
        <Card>
          <p className="text-xs text-muted">누적 점수</p>
          <MonoStat
            value={score.toLocaleString('ko-KR')}
            suffix="점"
            tone="gold"
            testId="total-score"
          />
          <div className="mt-2">
            <ConfirmedBadge>확정된 점수</ConfirmedBadge>
          </div>
          <p className="mt-2 text-xs text-muted">실행의 결과가 쌓이는 곳</p>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">오늘의 미션</h2>
        <Badge>
          {before ? 'COMING SOON' : ended ? 'FINISHED' : `DAY ${String(day).padStart(2, '0')}`}
        </Badge>
      </div>
      {mission ? (
        <Card className="border-accent/50">
          <div className="flex items-center justify-between">
            <Badge>{mission.phase}</Badge>
            <span className="font-mono text-lg font-bold text-muted">
              {String(day).padStart(2, '0')}
            </span>
          </div>
          <h3 className="mt-3 text-xl leading-8 font-bold">{mission.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{mission.purpose}</p>
          <div className="mt-4 rounded-2xl border border-line bg-panel-raised p-4">
            <p className="text-xs font-bold text-accent">오늘의 완료 기준</p>
            <p className="mt-1 text-sm leading-6 text-muted">{mission.completion_criteria}</p>
          </div>
          <details className="mt-4 text-sm">
            <summary className="cursor-pointer font-semibold text-accent">
              수행 가이드 보기 →
            </summary>
            <p className="mt-2 leading-6 text-muted">{mission.guide}</p>
          </details>
        </Card>
      ) : (
        <Card>
          <h3 className="text-lg font-bold">
            {before
              ? '첫 미션이 곧 열려요'
              : ended
                ? '31일의 도전이 마무리됐어요'
                : '오늘의 미션을 준비 중이에요'}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            {before
              ? `${c.timezone} 기준 시작일에 다시 만나요.`
              : ended
                ? '기간 종료가 모든 미션의 완료를 의미하지는 않습니다.'
                : '잠시 후 다시 확인해 주세요. 점수와 참가 상태는 유지됩니다.'}
          </p>
        </Card>
      )}

      <p className="text-center text-xs text-muted">
        {c.timezone} · 서버 시간 기준으로 표시됩니다.
      </p>
    </AppShell>
  );
}
