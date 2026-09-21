'use client';
import { useActionState } from 'react';
import { signInWithGoogle } from '@/app/login/actions';
import { buttonClass } from '@/components/ui';

export function GoogleLogin({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(signInWithGoogle, { error: null });
  return (
    <form action={action} className="space-y-3">
      <button
        type="submit"
        disabled={!enabled || pending}
        className={`${buttonClass} w-full !bg-white !text-[#1c1c1c] hover:!bg-white/90`}
      >
        <span aria-hidden="true" className="text-lg font-bold text-[#4285F4]">
          G
        </span>
        {pending ? '로그인 연결 중…' : 'Google로 계속하기'}
      </button>
      {state.error && (
        <p role="alert" className="text-sm text-accent">
          {state.error}
        </p>
      )}
    </form>
  );
}
