import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { challengeSlug } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;

  if (process.env.PROOVIT_LOCAL_PREVIEW !== 'true') {
    return NextResponse.redirect(new URL('/', origin));
  }

  const supabase = await createClient();
  const { data: overview, error: overviewError } = await supabase.rpc('challenge_overview', {
    p_slug: challengeSlug(),
  });

  if (overviewError || !overview) {
    return NextResponse.redirect(new URL('/?notice=preview-error', origin));
  }

  const challenge = (overview as { challenge: { id: string; rules_version: string } }).challenge;
  (await cookies()).set(
    'proovit-join-intent',
    JSON.stringify({ id: challenge.id, version: challenge.rules_version }),
    {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 300,
    },
  );
  const { data, error: loginError } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${origin}/auth/callback`, skipBrowserRedirect: true },
  });

  if (loginError || !data.url) {
    return NextResponse.redirect(new URL('/?notice=preview-error', origin));
  }

  return NextResponse.redirect(data.url);
}
