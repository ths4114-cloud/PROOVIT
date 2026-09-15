import { test, expect } from '@playwright/test';
test('mobile mission flow uses the same mission and never submits a proof', async ({ page }) => {
  await page.goto('/preview/home');
  await expect(
    page.getByText('화면 미리보기 · 참가·인증·점수는 예시이며 저장되지 않습니다'),
  ).toBeVisible();
  await page.getByRole('link', { name: '미션 시작하기' }).click();
  await expect(page).toHaveURL(/\/preview\/missions\/day-12$/);
  await expect(page.getByRole('heading', { name: '고객 인터뷰 질문 7개 만들기' })).toBeVisible();
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
  await page.goto('/home');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('button', { name: 'Google로 계속하기' })).toBeDisabled();
  const response = await request.get('/auth/callback?code=invalid&next=https://evil.example', {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(307);
  expect(response.headers().location).toBe('http://localhost:3000/login?error=callback');
  await page.goto('/login?error=callback');
  await expect(
    page.getByText(
      '로그인을 완료하지 못했어요. 취소했거나 연결 시간이 지났을 수 있어요. 다시 시도해주세요.',
    ),
  ).toBeVisible();
});
test('unknown missions and locked missions have no capture action', async ({ page }) => {
  await page.goto('/preview/missions/not-a-mission');
  await expect(page.getByRole('heading', { name: '페이지를 찾을 수 없어요' })).toBeVisible();
  await page.goto('/preview/missions/day-31');
  await expect(page.getByText('아직 열리지 않은 미션이에요')).toBeVisible();
  await expect(page.getByRole('link', { name: '카메라 인증 화면 보기' })).toHaveCount(0);
});
