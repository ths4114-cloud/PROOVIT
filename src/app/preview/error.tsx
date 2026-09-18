'use client';
import { Button } from '@/components/ui';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div role="alert" className="space-y-4">
      <h1 className="text-xl font-bold">화면을 불러오지 못했어요</h1>
      <p className="text-sm text-muted">잠시 후 다시 시도해주세요.</p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  );
}
