'use client';
import { useState } from 'react';
import { ActionLink, Badge, Button, Card, MonoStat } from '@/components/ui';
import { previewRoutes } from '@/lib/routes';

/**
 * 참가상태 화면 예시.
 * 실제 참가 신청/취소는 이 PR의 범위가 아닙니다(백엔드 미연결 · Foundation PR 제외 항목).
 * 담당 개발자가 실제 참가 API를 연결하기 전까지는 두 상태를 화면으로만 보여주는 예시입니다.
 */
type Status = 'before' | 'joined';

export function ParticipationStatus() {
  const [status, setStatus] = useState<Status>('before');

  if (status === 'joined') {
    return (
      <Card className="border-accent/50">
        <div className="flex items-center justify-between">
          <Badge>참가중</Badge>
          <span className="text-xs text-muted">ROUND 01</span>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted">현재 진행</p>
            <MonoStat value="DAY 12" suffix="/ 31" />
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">누적 점수</p>
            <MonoStat value="1,100" suffix="점" tone="gold" />
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <ActionLink href={previewRoutes.home} className="w-full">
            오늘의 미션으로 이동 →
          </ActionLink>
          <Button className="w-full !bg-panel-raised text-sm" onClick={() => setStatus('before')}>
            참가 취소
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Badge>참가 전</Badge>
      <h2 className="mt-3 text-xl font-bold">31일, 나만의 MVP 출시</h2>
      <p className="mt-3 text-sm leading-7 text-muted">
        아이디어 정의부터 고객 검증, 핵심 기능 제작, 출시까지. 매일의 실행을 쌓아갑니다.
      </p>
      <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
        <p>
          기간
          <br />
          <strong>31일</strong>
        </p>
        <p>
          미션
          <br />
          <strong>매일 1개</strong>
        </p>
        <p>
          목표
          <br />
          <strong>MVP 출시</strong>
        </p>
      </div>
      <Button className="mt-5 w-full" onClick={() => setStatus('joined')}>
        챌린지 참가하기
      </Button>
    </Card>
  );
}
