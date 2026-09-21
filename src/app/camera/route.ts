import { NextResponse } from 'next/server';
import { getSupabaseConfig } from '@/lib/env';
import { getContext, getHome } from '@/lib/data';

/**
 * 하단 네비 중앙 카메라 버튼의 실제 진입점.
 * 오늘의 실제 미션을 조회해 해당 미션의 카메라 화면으로 안내합니다.
 * 카메라 촬영 자체는 아직 실제 라우트에 통합되지 않아 안내 화면으로 연결합니다.
 * (담당: 다른 개발자의 mission-camera 작업과 후속 통합 예정)
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  if (!getSupabaseConfig()) return NextResponse.redirect(new URL('/', origin));

  try {
    const { user } = await getContext();
    if (!user) return NextResponse.redirect(new URL('/login', origin));
    const home = await getHome();
    if (!home?.today_mission) return NextResponse.redirect(new URL('/home', origin));
    return NextResponse.redirect(new URL(`/missions/${home.today_mission.id}/camera`, origin));
  } catch {
    return NextResponse.redirect(new URL('/home', origin));
  }
}
