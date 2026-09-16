import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowUpRight, ArrowRight, Flag, Sparkles, Clock3, CheckCircle2 } from 'lucide-react';
import { Shell, SetupNotice } from '@/components/shell';
import { getContext, getHome } from '@/lib/data';
import { getSupabaseConfig } from '@/lib/env';
export const dynamic = 'force-dynamic';
export default async function HomePage() {
  if (!getSupabaseConfig())
    return (
      <Shell active="home">
        <SetupNotice />
      </Shell>
    );
  const { user } = await getContext();
  if (!user) redirect('/login');
  const home = await getHome();
  if (!home) redirect('/');
  const { challenge: c, current_day: day, today_mission: mission, total_score: score } = home;
  const before = day === 0,
    ended = day > c.duration_days;
  const dayLabel = before ? '시작 전' : ended ? '기간 종료' : `${day}일차`;
  return (
    <Shell active="home" loggedIn>
      <section className="home-greeting">
        <p className="eyebrow">LET’S MAKE IT HAPPEN</p>
        <h1>
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
      </section>
      <section className="challenge-card">
        <div>
          <span className="pill">
            <span className="status-dot" />
            {before ? '시작 대기' : ended ? '기간 종료' : '진행 중인 챌린지'}
          </span>
          <Flag size={22} />
        </div>
        <h2>{c.title}</h2>
        <p>
          {before
            ? `${c.start_date}에 첫 미션이 열려요.`
            : ended
              ? '챌린지 기간이 끝났습니다. 확정 점수를 확인하세요.'
              : '매일의 작은 실행이, 결국 출시가 됩니다.'}
        </p>
        <Link href="/">
          챌린지 안내
          <ArrowUpRight size={17} />
        </Link>
      </section>
      <section className="stats-grid" aria-label="나의 진행 상황">
        <article className="stat-card day-stat">
          <span>오늘의 진행</span>
          <strong data-testid="current-day">
            {before || ended ? (
              dayLabel
            ) : (
              <>
                {day}
                <small> / 31일</small>
              </>
            )}
          </strong>
          <span className="stat-caption">{dayLabel}</span>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="챌린지 경과 일차"
            aria-valuenow={Math.min(day, 31)}
            aria-valuemin={0}
            aria-valuemax={31}
          >
            <div style={{ width: `${(Math.min(day, 31) / 31) * 100}%` }} />
          </div>
        </article>
        <article className="stat-card">
          <span>누적 점수</span>
          <strong data-testid="total-score">
            {score.toLocaleString('ko-KR')}
            <small>점</small>
          </strong>
          <span className="score-badge">
            <Sparkles size={13} />
            확정된 점수
          </span>
          <p>실행의 결과가 쌓이는 곳</p>
        </article>
      </section>
      <section className="section mission-section">
        <div className="section-heading">
          <h2>오늘의 미션</h2>
          <span>
            {before ? 'COMING SOON' : ended ? 'FINISHED' : `DAY ${String(day).padStart(2, '0')}`}
          </span>
        </div>
        {mission ? (
          <article className="mission-card">
            <div className="mission-top">
              <span className="phase">{mission.phase}</span>
              <span className="mission-number">{String(day).padStart(2, '0')}</span>
            </div>
            <h3>{mission.title}</h3>
            <p>{mission.purpose}</p>
            <div className="criteria">
              <CheckCircle2 size={18} />
              <div>
                <strong>오늘의 완료 기준</strong>
                <p>{mission.completion_criteria}</p>
              </div>
            </div>
            <details>
              <summary>
                수행 가이드 보기
                <ArrowRight size={16} />
              </summary>
              <p>{mission.guide}</p>
            </details>
          </article>
        ) : (
          <div className="mission-empty">
            <Clock3 size={30} />
            <h3>
              {before
                ? '첫 미션이 곧 열려요'
                : ended
                  ? '31일의 도전이 마무리됐어요'
                  : '오늘의 미션을 준비 중이에요'}
            </h3>
            <p>
              {before
                ? `${c.timezone} 기준 시작일에 다시 만나요.`
                : ended
                  ? '기간 종료가 모든 미션의 완료를 의미하지는 않습니다.'
                  : '잠시 후 다시 확인해 주세요. 점수와 참가 상태는 유지됩니다.'}
            </p>
          </div>
        )}
      </section>
      <div className="daily-note">
        <span aria-hidden="true">✳</span>
        <p>
          완벽한 계획보다,
          <br />
          <strong>오늘 하나의 실행.</strong>
        </p>
        <span className="note-mark">PROVE IT.</span>
      </div>
      <p className="fine-print center">{c.timezone} · 서버 시간 기준으로 표시됩니다.</p>
    </Shell>
  );
}
