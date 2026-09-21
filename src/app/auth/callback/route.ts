import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAppOrigin, getSupabaseConfig } from '@/lib/supabase/config';
import { completePendingJoin } from '@/lib/auth/actions';
export async function GET(request: Request) {
  const origin = getAppOrigin();
  if (!origin)
    return NextResponse.json(
      { error: 'AUTH_NOT_CONFIGURED' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  const code = new URL(request.url).searchParams.get('code');
  if (code && getSupabaseConfig()) {
    try {
      const client = await createClient();
      const { error } = await client.auth.exchangeCodeForSession(code);
      if (!error) {
        const destination = await completePendingJoin();
        return NextResponse.redirect(new URL(destination, origin), {
          headers: { 'Cache-Control': 'no-store' },
        });
      }
    } catch {
      /* Return a fixed message; never expose provider error details or codes. */
    }
  }
  return NextResponse.redirect(new URL('/login?error=callback', origin), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
