import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Shell, SetupNotice } from '@/components/shell';
import { LoginForm } from '@/components/forms';
import { getSupabaseConfig } from '@/lib/env';
import { getContext } from '@/lib/data';
export const dynamic = 'force-dynamic';
export default async function LoginPage() {
  if (!getSupabaseConfig())
    return (
      <Shell>
        <SetupNotice />
      </Shell>
    );
  const { user } = await getContext();
  if (user) redirect('/home');
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
          이메일로 간편하게 시작하세요.
          <br />
          비밀번호 없이, 나의 도전을 이어갈 수 있어요.
        </p>
        <LoginForm />
        <p className="auth-footnote">
          <ShieldCheck size={17} />
          이메일은 계정 인증과 로그인에 사용됩니다.
        </p>
      </section>
    </Shell>
  );
}
