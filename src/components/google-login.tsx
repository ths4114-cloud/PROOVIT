'use client';
import { useActionState } from 'react';
import { signInWithGoogle } from '@/app/login/actions';
import { Button } from '@/components/ui';
export function GoogleLogin({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(signInWithGoogle, { error: null });
  return (
    <form action={action} className="space-y-3">
      <Button type="submit" disabled={!enabled || pending} className="w-full !bg-white !text-black">
        <span aria-hidden="true" className="text-lg">
          G
        </span>
        {pending ? '로그인 연결 중…' : 'Google로 계속하기'}
      </Button>
      {state.error && (
        <p role="alert" className="text-sm leading-6 text-accent">
          {state.error}
        </p>
      )}
    </form>
  );
}
