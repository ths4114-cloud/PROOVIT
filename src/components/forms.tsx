'use client';
import { useActionState } from 'react';
import { ArrowRight, LoaderCircle, LogOut } from 'lucide-react';
import { joinChallenge, signOut } from '@/lib/auth/actions';
export function JoinForm({ id, version }: { id: string; version: string }) {
  const [state, action, pending] = useActionState(joinChallenge, {});
  return (
    <form action={action} className="join-form">
      <input type="hidden" name="challengeId" value={id} />
      <input type="hidden" name="rulesVersion" value={version} />
      <label className="checkbox-label">
        <input type="checkbox" name="rules" required />
        참가 규칙을 확인했습니다.
      </label>
      {state.error && (
        <p role="alert" className="form-error">
          {state.error}
        </p>
      )}
      <button className="button primary" disabled={pending}>
        {pending ? (
          <>
            <LoaderCircle className="spin" />
            참가 확인 중
          </>
        ) : (
          <>
            챌린지 참가하기
            <ArrowRight size={19} />
          </>
        )}
      </button>
    </form>
  );
}
export function LogoutButton() {
  const [state, action, pending] = useActionState(signOut, {});
  return (
    <form action={action}>
      <button className="text-button logout" disabled={pending}>
        <LogOut size={16} />
        {pending ? '처리 중…' : '로그아웃'}
      </button>
      {state.error && (
        <p role="alert" className="form-error">
          {state.error}
        </p>
      )}
    </form>
  );
}
