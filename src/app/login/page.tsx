import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Shell, SetupNotice } from '@/components/shell';
import { GoogleLogin } from '@/components/google-login';
import { getSupabaseConfig } from '@/lib/env';
import { getContext } from '@/lib/data';
import { getAppOrigin } from '@/lib/supabase/config';
export const dynamic = 'force-dynamic';
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!getSupabaseConfig())
    return (
      <Shell>
        <SetupNotice />
      </Shell>
    );
  const { user } = await getContext();
  if (user) redirect('/home');
  const showCallbackError = (await searchParams).error === 'callback';
  return (
    <Shell>
      <section className="login-section">
        <Link href="/" className="back-link">
          <ArrowLeft size={18} />
          챌린지로 돌아가기
        </Link>
        <div className="login-art" aria-hidden="true">
          P<span>↗</span>
        </div>
        <p className="eyebrow">YOUR NEXT CHAPTER</p>
        <h1>
          당신의 실행을
          <br />
          <span>증명할 시간.</span>
        </h1>
        <p className="muted login-intro">
          Google 계정으로 간편하게 시작하세요.
          <br />
          로그인 후 나의 도전을 이어갈 수 있어요.
        </p>
        {showCallbackError && (
          <p role="alert" className="form-error auth-error">
            로그인을 완료하지 못했어요. 취소했거나 연결 시간이 지났을 수 있어요. 다시 시도해 주세요.
          </p>
        )}
        <GoogleLogin enabled={Boolean(getSupabaseConfig() && getAppOrigin())} />
        <p className="auth-footnote">
          <ShieldCheck size={17} />
          기본 프로필과 이메일은 계정 인증에만 사용됩니다.
        </p>
      </section>
    </Shell>
  );
}
