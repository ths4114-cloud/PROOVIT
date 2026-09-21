import Link from 'next/link';
import { missionContents } from '@/lib/missions/content';
import { DEMO_DAY } from '@/lib/demo/state';
import styles from './mission-journey.module.css';

const chapters = [
  {
    phase: 'DEFINE',
    title: '아이디어의 시작',
    caption: '내가 풀고 싶은 문제를 찾다',
    symbol: '01',
  },
  {
    phase: 'DISCOVER',
    title: '고객을 만나는 길',
    caption: '책상 밖에서 진짜 목소리를 듣다',
    symbol: '02',
  },
  {
    phase: 'VALIDATE',
    title: '가능성을 증명하다',
    caption: '작은 실험으로 확신을 쌓다',
    symbol: '03',
  },
  {
    phase: 'DESIGN',
    title: '생각을 형태로',
    caption: '고객이 경험할 첫 모습을 그리다',
    symbol: '04',
  },
  {
    phase: 'BUILD',
    title: '직접 만드는 시간',
    caption: '하나씩, 나만의 제품을 완성하다',
    symbol: '05',
  },
  {
    phase: 'LAUNCH',
    title: '세상에 내놓는 날',
    caption: '완벽함보다 용기 있는 첫 출시',
    symbol: '06',
  },
];

export function MissionJourney({
  completedToday,
  total,
}: {
  completedToday: boolean;
  total: number;
}) {
  const completedCount = completedToday ? 12 : 11;
  const today = missionContents[DEMO_DAY - 1];
  return (
    <div className={styles.journey}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>YOUR NEXT CHAPTER</p>
        <h1>
          31일 미션보드<span>작은 실행이, 나만의 출시로.</span>
        </h1>
        <div className={styles.stats}>
          <span>
            <strong>{completedCount}</strong> / 31일 완료
          </span>
          <span>
            <strong data-testid="demo-total">{total.toLocaleString()}</strong>{' '}
            <span className="text-muted">점</span>
          </span>
        </div>
        <div
          className={styles.progress}
          role="progressbar"
          aria-label="31일 데모 미션 진행률"
          aria-valuenow={completedCount}
          aria-valuemin={0}
          aria-valuemax={31}
        >
          <span style={{ width: `${(completedCount / 31) * 100}%` }} />
        </div>
        <div className={styles.legend}>
          <span>✓ 완료</span>
          <span className={styles.pink}>◎ 오늘</span>
          <span>잠금 · 아직 열리지 않은 여정</span>
        </div>
      </div>

      <section className={styles.today} aria-labelledby="journey-today">
        <div className={styles.todayIcon} aria-hidden="true">
          {completedToday ? '✓' : '◎'}
        </div>
        <div>
          <p className={styles.eyebrow}>
            DAY 12 · {completedToday ? '오늘도 한 걸음 완료' : '지금, 당신의 차례'}
          </p>
          <h2 id="journey-today">{today.title}</h2>
          <Link
            className={styles.todayLink}
            href={`/demo/missions/day-12${completedToday ? '/result' : ''}`}
          >
            {completedToday ? '오늘의 결과 보기' : '오늘의 미션 시작하기'}{' '}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <div className={styles.map} aria-label="단계별 미션 여정">
        <div className={styles.skyline} aria-hidden="true">
          {Array.from({ length: 14 }, (_, index) => (
            <i key={index} style={{ height: `${24 + ((index * 37) % 93)}px` }} />
          ))}
        </div>
        {chapters.map((chapter) => {
          const missions = missionContents.filter((item) => item.phase === chapter.phase);
          const active = missions.some((item) => item.day === DEMO_DAY);
          const past = missions.every((item) => item.day < DEMO_DAY);
          const points = missions.map((_, index) => ({
            x: 10 + (Math.floor(index / 5) % 2 ? 4 - (index % 5) : index % 5) * 20,
            y: 38 + Math.floor(index / 5) * 80,
          }));
          const height = missions.length > 5 ? 160 : 80;
          let path = `M ${points[0].x} ${points[0].y}`;
          points.slice(1).forEach((point, index) => {
            const previous = points[index];
            path +=
              point.y === previous.y
                ? ` L ${point.x} ${point.y}`
                : ` C 103 ${previous.y}, 103 ${point.y}, ${point.x} ${point.y}`;
          });
          return (
            <section
              key={chapter.phase}
              className={`${styles.chapter} ${active ? styles.active : ''}`}
              aria-label={`${chapter.phase} 단계`}
            >
              <div className={styles.chapterHeading}>
                <span className={styles.chapterNumber}>{past ? '✓' : chapter.symbol}</span>
                <div>
                  <p className={styles.eyebrow}>
                    {chapter.phase}{' '}
                    <span>
                      DAY {missions[0].day}–{missions[missions.length - 1].day}
                    </span>
                  </p>
                  <h2>{chapter.title}</h2>
                  <p className={styles.caption}>{chapter.caption}</p>
                </div>
                {active && <span className={styles.here}>진행 중</span>}
              </div>
              <ol className={styles.track} style={{ height }}>
                <li className={styles.trackArt} aria-hidden="true">
                  <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
                    <path
                      d={path}
                      fill="none"
                      stroke={past ? '#a32955' : '#43313b'}
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d={path}
                      fill="none"
                      stroke={past ? '#ff5b95' : '#75505f'}
                      strokeWidth="1"
                      strokeDasharray="2 5"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </li>
                {missions.map((item, index) => {
                  const done = item.day < DEMO_DAY || (item.day === DEMO_DAY && completedToday);
                  const current = item.day === DEMO_DAY;
                  const label = `Day ${item.day} · ${done ? '완료' : current ? '오늘' : '잠김'}`;
                  const node = (
                    <>
                      <span className={styles.orb}>
                        {done ? (
                          <>
                            <span aria-hidden="true">✓</span>
                            <span className="sr-only">완료</span>
                          </>
                        ) : (
                          item.day
                        )}
                      </span>
                      <span className={styles.day}>{current ? 'TODAY' : `DAY ${item.day}`}</span>
                    </>
                  );
                  return (
                    <li
                      key={item.day}
                      className={`${styles.stop} ${done ? styles.done : ''} ${current ? styles.current : ''}`}
                      style={{ left: `${points[index].x}%`, top: points[index].y }}
                    >
                      {item.day > DEMO_DAY ? (
                        <span className={styles.node} aria-label={label} aria-disabled="true">
                          {node}
                          <svg
                            className={styles.lock}
                            viewBox="0 0 12 14"
                            width="10"
                            height="12"
                            fill="none"
                            aria-hidden="true"
                          >
                            <rect x="1" y="6" width="10" height="7" rx="2" stroke="currentColor" />
                            <path d="M3 6V4a3 3 0 0 1 6 0v2" stroke="currentColor" />
                          </svg>
                        </span>
                      ) : (
                        <Link
                          className={styles.node}
                          href={`/demo/missions/day-${item.day}`}
                          aria-label={label}
                          aria-current={current ? 'step' : undefined}
                        >
                          {node}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
        <div className={styles.finish}>
          <span aria-hidden="true">✦</span>
          <p>
            작은 실행 31번,
            <br />
            <strong>이제 당신의 제품이 세상으로.</strong>
          </p>
          <span className={styles.eyebrow}>YOUR FIRST LAUNCH</span>
        </div>
      </div>
      <p className={styles.note}>
        데모는 12일차로 고정됩니다. 1–11일차 완료와 점수는 샘플이며, 이후 미션은 잠겨 있어요.
      </p>
    </div>
  );
}
