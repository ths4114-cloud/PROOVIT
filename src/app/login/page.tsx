import { redirect } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { ActionLink, StateNotice } from '@/components/ui';
import { GoogleLogin } from '@/components/google-login';
import { InstallButton } from '@/components/pwa';
import { getSupabaseConfig } from '@/lib/env';
import { getAppOrigin } from '@/lib/supabase/config';
import { getContext } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!getSupabaseConfig()) {
    return (
      <AppShell nav={false}>
        <StateNotice title="로그인 연결 준비 중">
          개발용 Supabase와 Google 로그인 설정이 완료되면 사용할 수 있어요.
        </StateNotice>
      </AppShell>
    );
  }
  const { user } = await getContext();
  if (user) redirect('/home');
  const showCallbackError = (await searchParams).error === 'callback';

  return (
    <AppShell nav={false}>
      <p className="font-mono text-xs font-bold tracking-[.2em] text-accent">
        PROVE YOUR NEXT STEP
      </p>
      <h1 className="font-display text-4xl leading-tight font-bold">
        실행할 준비,
        <br />
        됐나요?
      </h1>
      <p className="text-sm leading-6 text-muted">
        Google 계정으로 로그인하고
        <br />
        프루빗의 챌린지를 시작하세요.
      </p>
      {showCallbackError && (
        <p role="alert" className="auth-error text-sm text-accent">
          로그인을 완료하지 못했어요. 취소했거나 연결 시간이 지났을 수 있어요. 다시 시도해 주세요.
        </p>
      )}
      <GoogleLogin enabled={Boolean(getSupabaseConfig() && getAppOrigin())} />
      <p className="text-xs leading-6 text-muted">
        기본 프로필과 이메일은 계정 인증에만 사용됩니다.
      </p>
      <InstallButton />
      <ActionLink href="/preview/home" className="w-full !bg-panel">
        로그인 없이 화면 예시 보기
      </ActionLink>
    </AppShell>
  );
}
