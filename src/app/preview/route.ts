import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { challengeSlug } from '@/lib/env';
import { getAppOrigin } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestOrigin = new URL(request.url).origin;
  const origin = getAppOrigin() || requestOrigin;

  if (process.env.PROOVIT_LOCAL_PREVIEW !== 'true') {
    return NextResponse.redirect(new URL('/', origin));
  }

  // The local preview backend starts with fresh data on every launch. Clear only
  // its Supabase session cookies so an older preview cannot block the demo login.
  const store = await cookies();
  for (const cookie of store.getAll()) {
    if (cookie.name.startsWith('sb-')) store.delete(cookie.name);
  }

  const supabase = await createClient();
  const { data: overview, error: overviewError } = await supabase.rpc('challenge_overview', {
    p_slug: challengeSlug(),
  });

  if (overviewError || !overview) {
    return NextResponse.redirect(new URL('/?notice=preview-error', origin));
  }

  const challenge = (overview as { challenge: { id: string; rules_version: string } }).challenge;
  store.set(
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
