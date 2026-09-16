import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { challengeSlug } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;

  if (process.env.PROOVIT_LOCAL_PREVIEW !== 'true') {
    return NextResponse.redirect(new URL('/', origin));
  }

  const supabase = await createClient();
  const { error: loginError } = await supabase.auth.verifyOtp({
    email: 'preview@proovit.local',
    token: '123456',
    type: 'email',
  });

  if (loginError) {
    return NextResponse.redirect(new URL('/?notice=preview-error', origin));
  }

  const { data: overview, error: overviewError } = await supabase.rpc('challenge_overview', {
    p_slug: challengeSlug(),
  });

  if (overviewError || !overview) {
    return NextResponse.redirect(new URL('/?notice=preview-error', origin));
  }

  const challenge = (overview as { challenge: { id: string; rules_version: string } }).challenge;
  const { error: joinError } = await supabase.rpc('join_challenge', {
    p_challenge_id: challenge.id,
    p_rules_version: challenge.rules_version,
  });

  if (joinError) {
    return NextResponse.redirect(new URL('/?notice=preview-error', origin));
  }

  return NextResponse.redirect(new URL('/home', origin));
}
