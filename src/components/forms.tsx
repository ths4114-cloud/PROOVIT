'use client';
import { useActionState } from 'react';
import { joinChallenge, signOut } from '@/lib/auth/actions';
import { Button } from '@/components/ui';

export function JoinForm({ id, version }: { id: string; version: string }) {
  const [state, action, pending] = useActionState(joinChallenge, {});
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="challengeId" value={id} />
      <input type="hidden" name="rulesVersion" value={version} />
      <label className="flex items-start gap-2 text-sm leading-6 text-muted">
        <input
          type="checkbox"
          name="rules"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-[--color-accent]"
        />
        참가 규칙을 확인했습니다.
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-accent">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? '참가 확인 중…' : '챌린지 참가하기 →'}
      </Button>
    </form>
  );
}

export function LogoutButton() {
  const [state, action, pending] = useActionState(signOut, {});
  return (
    <form action={action}>
      <button
        type="submit"
        disabled={pending}
        className="text-sm font-semibold text-muted hover:text-accent"
      >
        {pending ? '처리 중…' : '로그아웃'}
      </button>
      {state.error && (
        <p role="alert" className="mt-1 text-sm text-accent">
          {state.error}
        </p>
      )}
    </form>
  );
}
