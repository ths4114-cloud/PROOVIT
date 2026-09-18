import { AppShell } from '@/components/app-shell';
import { GoogleLogin } from '@/components/google-login';
import { ActionLink, StateNotice } from '@/components/ui';
import { getAppOrigin, getSupabaseConfig } from '@/lib/supabase/config';
export const dynamic = 'force-dynamic';
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const enabled = !!getSupabaseConfig() && !!getAppOrigin();
  return (
    <AppShell>
      <div className="py-10">
        <p className="mb-4 text-xs font-bold tracking-[.2em] text-pink-400">PROVE YOUR NEXT STEP</p>
        <h1 className="text-4xl leading-tight font-black">
          실행할 준비,
          <br />
          됐나요?
        </h1>
        <p className="mt-5 text-sm leading-7 text-muted">
          Google 계정으로 로그인하고
          <br />
          프루빗의 챌린지를 시작하세요.
        </p>
      </div>
      {error && (
        <p role="alert" className="rounded-2xl border border-accent/40 p-4 text-sm text-pink-200">
          로그인을 완료하지 못했어요. 취소했거나 연결 시간이 지났을 수 있어요. 다시 시도해주세요.
        </p>
      )}
      <GoogleLogin enabled={enabled} />
      {!enabled && (
        <StateNotice title="로그인 연결 준비 중">
          개발용 Supabase와 Google 로그인 설정이 완료되면 사용할 수 있어요.
        </StateNotice>
      )}
      <p className="text-xs leading-6 text-muted">
        Google 로그인은 기본 프로필과 이메일을 사용합니다. 실제 참가 등록은 로그인 후 별도로
        진행합니다.
      </p>
      {process.env.ENABLE_UI_PREVIEW === 'true' && (
        <ActionLink href="/preview/home" className="w-full !bg-panel">
          로그인 없이 화면 예시 보기
        </ActionLink>
      )}
    </AppShell>
  );
}
