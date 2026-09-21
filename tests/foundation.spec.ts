import { test, expect } from '@playwright/test';
test('mobile mission flow uses the same mission and never submits a proof', async ({ page }) => {
  await page.goto('/preview/home');
  await expect(
    page.getByText('화면 미리보기 · 참가·인증·점수는 예시이며 저장되지 않습니다'),
  ).toBeVisible();
  await page.getByRole('link', { name: '미션 시작하기' }).click();
  await expect(page).toHaveURL(/\/preview\/missions\/day-12$/);
  await expect(
    page.getByRole('heading', { name: '더 많은 고객에게 의견을 확인해보세요' }),
  ).toBeVisible();
  await page.getByRole('link', { name: '카메라 인증 화면 보기' }).click();
  await expect(page.getByRole('button', { name: '촬영 기능 연결 예정' })).toBeDisabled();
  await page.getByRole('link', { name: '점수 결과 예시 보기' }).click();
  await expect(page.getByRole('heading', { name: '인증 완료' })).toBeVisible();
  await page.getByRole('link', { name: '31일 보드 보기' }).click();
  await expect(page.getByRole('link', { name: '12일차 도전 가능' })).toBeVisible();
  await expect(page.getByRole('link', { name: '13일차' })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
test('unconfigured authentication fails closed and callbacks cannot redirect externally', async ({
  page,
  request,
}) => {
  // Supabase가 설정되지 않은 상태에서는 /home이 로그인으로 리다이렉트하는 대신
  // 그 자리에서 준비중 안내만 보여주고, 참가·점수 등 어떤 보호된 데이터도 내보내지 않는다.
  await page.goto('/home');
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByRole('heading', { name: '새로운 도전을 준비하고 있어요' })).toBeVisible();
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: '로그인 연결 준비 중' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Google로 계속하기' })).toHaveCount(0);
  const response = await request.get('/auth/callback?code=invalid&next=https://evil.example', {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(307);
  expect(response.headers().location).toBe('http://localhost:3000/login?error=callback');
  // Supabase가 설정되지 않은 동안에는 /login이 "연결 준비 중" 안내를 최우선으로 보여주므로
  // error=callback 문구 노출 여부는 Supabase가 구성된 환경(participant 설정)에서 검증한다.
});
test('unknown missions and locked missions have no capture action', async ({ page }) => {
  await page.goto('/preview/missions/not-a-mission');
  await expect(page.getByRole('heading', { name: '페이지를 찾을 수 없어요' })).toBeVisible();
  await page.goto('/preview/missions/day-31');
  await expect(page.getByText('아직 열리지 않은 미션이에요')).toBeVisible();
  await expect(page.getByRole('link', { name: '카메라 인증 화면 보기' })).toHaveCount(0);
});
