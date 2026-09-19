'use client';
import { useActionState } from 'react';
import { signInWithGoogle } from '@/app/login/actions';
export function GoogleLogin({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(signInWithGoogle, { error: null });
  return (
    <form action={action} className="space-y-3">
      <button type="submit" disabled={!enabled || pending} className="button google-button">
        <span aria-hidden="true" className="text-lg">
          G
        </span>
        {pending ? '로그인 연결 중…' : 'Google로 계속하기'}
      </button>
      {state.error && (
        <p role="alert" className="form-error">
          {state.error}
        </p>
      )}
    </form>
  );
}
