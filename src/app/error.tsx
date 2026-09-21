'use client';
import Link from 'next/link';
import { Button } from '@/components/ui';

export default function ErrorPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-4 border-x border-line bg-background px-6">
      <p className="font-mono text-xs font-bold tracking-[.2em] text-accent">
        LET&apos;S TRY AGAIN
      </p>
      <h1 className="text-3xl font-black">잠시 연결이 끊겼어요.</h1>
      <p className="text-sm leading-6 text-muted">
        최신 정보를 불러오지 못했습니다.
        <br />
        연결을 확인하고 다시 시도해 주세요.
      </p>
      <Button onClick={() => window.location.reload()}>다시 불러오기</Button>
      <Link href="/" className="text-center text-sm font-semibold text-muted">
        챌린지로 돌아가기
      </Link>
    </div>
  );
}
