'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getContext, logFailure } from '@/lib/data';
export type ActionState = { error?: string; sent?: boolean; email?: string };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const intentName = 'proovit-join-intent';
function field(form: FormData, key: string) {
  return String(form.get(key) || '').trim();
}
function joinMessage(message: string) {
  if (message.includes('ENROLLMENT_CLOSED'))
    return '참가 신청 기간이 아닙니다. 챌린지 일정을 확인해 주세요.';
  if (message.includes('RULES_CHANGED'))
    return '참가 규칙이 변경되었습니다. 새 규칙을 확인한 뒤 다시 참가해 주세요.';
  return '참가를 저장하지 못했습니다. 다시 시도해 주세요. 중복 참가로 처리되지 않습니다.';
}
export async function joinChallenge(_state: ActionState, form: FormData): Promise<ActionState> {
  if (form.get('rules') !== 'on') return { error: '참가 규칙을 확인해 주세요.' };
  const id = field(form, 'challengeId'),
    version = field(form, 'rulesVersion');
  if (!/^[0-9a-f-]{36}$/i.test(id) || !version || version.length > 80)
    return { error: '챌린지를 새로고침해 주세요.' };
  let authenticated = false;
  try {
    const { supabase, user } = await getContext();
    if (!user) {
      (await cookies()).set(intentName, JSON.stringify({ id, version }), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 1800,
      });
    } else {
      authenticated = true;
      const { error } = await supabase.rpc('join_challenge', {
        p_challenge_id: id,
        p_rules_version: version,
      });
      if (error) {
        logFailure('participation.join', error.code);
        return { error: joinMessage(error.message) };
      }
    }
  } catch {
    logFailure('participation.join');
    return { error: '연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.' };
  }
  redirect(authenticated ? '/home' : '/login');
}
export async function sendCode(_state: ActionState, form: FormData): Promise<ActionState> {
  const email = field(form, 'email').toLowerCase();
  if (email.length > 254 || !emailPattern.test(email))
    return { error: '올바른 이메일 주소를 입력해 주세요.' };
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) {
      logFailure('auth.send', error.code);
      return {
        error: '코드를 보내지 못했습니다. 이메일을 확인하거나 잠시 후 다시 시도해 주세요.',
      };
    }
    return { sent: true, email };
  } catch {
    logFailure('auth.send');
    return { error: '연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.' };
  }
}
export async function verifyCode(_state: ActionState, form: FormData): Promise<ActionState> {
  const email = field(form, 'email'),
    token = field(form, 'token');
  if (!emailPattern.test(email) || email.length > 254 || !/^\d{6,8}$/.test(token))
    return { error: '이메일로 받은 인증 코드를 정확히 입력해 주세요.' };
  let destination = '/home';
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (error) {
      logFailure('auth.verify', error.code);
      return {
        error: '코드가 올바르지 않거나 만료되었습니다. 다시 확인하거나 새 코드를 받아 주세요.',
      };
    }
    const store = await cookies();
    const raw = store.get(intentName)?.value;
    if (raw) {
      store.delete(intentName);
      try {
        const intent: { id: string; version: string } = JSON.parse(raw);
        const { error: joinError } = await supabase.rpc('join_challenge', {
          p_challenge_id: intent.id,
          p_rules_version: intent.version,
        });
        if (joinError) {
          logFailure('participation.after_login', joinError.code);
          destination = '/?notice=join-retry';
        }
      } catch {
        destination = '/?notice=join-retry';
      }
    }
  } catch {
    logFailure('auth.verify');
    return { error: '연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.' };
  }
  redirect(destination);
}
export async function signOut(_state: ActionState): Promise<ActionState> {
  void _state;
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) {
      logFailure('auth.signout', error.code);
      return { error: '로그아웃하지 못했습니다. 다시 시도해 주세요.' };
    }
    (await cookies()).delete(intentName);
  } catch {
    return { error: '연결을 확인한 뒤 다시 시도해 주세요.' };
  }
  redirect('/login');
}
