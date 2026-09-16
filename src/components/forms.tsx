'use client';
import { useActionState, useState } from 'react';
import { ArrowRight, LoaderCircle, Mail, LogOut } from 'lucide-react';
import { joinChallenge, sendCode, verifyCode, signOut } from '@/lib/auth/actions';
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
function VerifyForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(verifyCode, {});
  return (
    <form action={action} className="form-stack">
      <input type="hidden" name="email" value={email} />
      <label htmlFor="token">인증 코드</label>
      <input
        id="token"
        name="token"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6,8}"
        minLength={6}
        maxLength={8}
        placeholder="이메일로 받은 코드"
        required
        autoFocus
        aria-describedby={state.error ? 'verify-error' : undefined}
      />
      {state.error && (
        <p id="verify-error" role="alert" className="form-error">
          {state.error}
        </p>
      )}
      <button className="button primary" disabled={pending}>
        {pending ? '로그인 확인 중…' : '확인하고 시작하기'}
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
export function LoginForm() {
  const [state, action, pending] = useActionState(sendCode, {});
  const [editing, setEditing] = useState(false);
  const [resendState, resendAction, resending] = useActionState(sendCode, {});
  const sent = state.sent && !editing;
  return (
    <div>
      {sent ? (
        <>
          <div className="notice" role="status">
            <Mail size={20} />
            <div>
              <strong>메일함을 확인해 주세요</strong>
              <p>{state.email}로 보낸 코드를 입력하세요. 메일이 없다면 스팸함도 확인해 주세요.</p>
            </div>
          </div>
          <VerifyForm email={state.email!} />
          <div className="auth-options">
            <form action={resendAction}>
              <input type="hidden" name="email" value={state.email} />
              <button className="text-button" disabled={resending}>
                {resending ? '다시 보내는 중…' : '코드 다시 받기'}
              </button>
            </form>
            <button type="button" className="text-button" onClick={() => setEditing(true)}>
              이메일 변경
            </button>
          </div>
          {resendState.error && (
            <p role="alert" className="form-error">
              {resendState.error}
            </p>
          )}
          {resendState.sent && (
            <p role="status" className="muted">
              새 코드를 보냈습니다.
            </p>
          )}
        </>
      ) : (
        <form
          action={(form) => {
            setEditing(false);
            action(form);
          }}
          className="form-stack"
        >
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            placeholder="you@example.com"
            defaultValue={state.email}
            required
            aria-describedby={state.error ? 'email-error' : 'email-help'}
          />
          <p id="email-help" className="field-help">
            처음이라면 이메일 인증 후 계정이 만들어집니다.
          </p>
          {state.error && (
            <p id="email-error" role="alert" className="form-error">
              {state.error}
            </p>
          )}
          <button className="button primary" disabled={pending}>
            {pending ? '코드 보내는 중…' : '이메일로 시작하기'}
            <ArrowRight size={18} />
          </button>
        </form>
      )}
    </div>
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
