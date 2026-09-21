import { test, expect, type Page } from '@playwright/test';
const backend = 'http://127.0.0.1:54329';
async function login(page: Page) {
  await page.goto('/');
  await page.getByLabel('참가 규칙을 확인했습니다.').check();
  await page.getByRole('button', { name: '챌린지 참가하기' }).click();
  await page.getByRole('button', { name: 'Google로 계속하기' }).click();
  await expect(page).toHaveURL(/\/home$/);
}
async function camera(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
      configurable: true,
      value: async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 480;
        canvas.height = 640;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#ff0066';
        ctx.fillRect(0, 0, 480, 640);
        return canvas.captureStream(5);
      },
    });
  });
}
test.beforeEach(async ({ request }) => {
  await request.post(`${backend}/__test/reset`);
  await request.post(`${backend}/__test/control`, { data: { content: true } });
});
test('real UUID mission → camera → private storage → accepted score → home and board', async ({
  page,
}, testInfo) => {
  await camera(page);
  await login(page);
  await page.getByRole('link', { name: '미션 상세 보기' }).click();
  await expect(page).toHaveURL(/\/missions\/[0-9a-f-]{36}$/);
  const detailUrl = page.url();
  await expect(page.getByRole('heading', { name: '오늘의 제출' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('mission-detail.png') });
  await page.getByRole('link', { name: '카메라로 인증하기' }).click();
  await page.getByRole('button', { name: '카메라 시작하기' }).click();
  await page.getByRole('button', { name: '사진 촬영하기' }).click();
  await expect(page.getByAltText('촬영한 인증 사진 미리보기')).toBeVisible();
  const submit = page.getByRole('button', { name: '인증 사진 제출하기' });
  await submit.focus();
  await expect(submit).toBeFocused();
  await page.screenshot({ path: testInfo.outputPath('camera-preview.png') });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: '인증 완료' })).toBeVisible();
  await expect(page.getByTestId('proof-total-score')).toHaveText('100점');
  await page.screenshot({ path: testInfo.outputPath('proof-result.png') });
  await page.reload();
  await expect(page.getByTestId('proof-total-score')).toHaveText('100점');
  await page.getByRole('link', { name: '미션보드 보기', exact: true }).click();
  await expect(page.getByRole('link', { name: '1일차 인증 완료' })).toBeVisible();
  await expect(page.getByRole('link', { name: /31일차/ })).toHaveCount(0);
  await page.goto(`${detailUrl}/camera`);
  await expect(page).toHaveURL(/\/result$/);
  await page.getByRole('link', { name: '홈으로 돌아가기', exact: true }).click();
  await expect(page.getByTestId('total-score')).toHaveText('100점');
});
test('failed storage preserves the photo for retry and never grants early points', async ({
  page,
  request,
}) => {
  await camera(page);
  await login(page);
  await page.getByRole('link', { name: '미션 상세 보기' }).click();
  await page.getByRole('link', { name: '카메라로 인증하기' }).click();
  await page.getByRole('button', { name: '카메라 시작하기' }).click();
  await page.getByRole('button', { name: '사진 촬영하기' }).click();
  await request.post(`${backend}/__test/control`, { data: { storageFault: true } });
  await page.getByRole('button', { name: '인증 사진 제출하기' }).click();
  await expect(page.getByRole('alert').filter({ hasText: '저장하지 못했어요' })).toBeVisible();
  await expect(page.getByAltText('촬영한 인증 사진 미리보기')).toBeVisible();
  await request.post(`${backend}/__test/control`, { data: { storageFault: false } });
  await page.getByRole('button', { name: '인증 사진 제출하기' }).click();
  await expect(page.getByTestId('proof-total-score')).toHaveText('100점');
});
test('proof endpoint rejects unauthenticated, cross-origin and invalid input', async ({
  page,
  request,
}) => {
  const path = '/api/missions/10000000-0000-4000-8000-000000000001/proofs';
  expect((await request.post(path, { headers: { Origin: 'https://evil.example' } })).status()).toBe(
    403,
  );
  expect(
    (await request.post(path, { headers: { Origin: 'http://localhost:3000' } })).status(),
  ).toBe(401);
  await login(page);
  const status = await page.evaluate(
    async () => (await fetch('/api/missions/not-a-uuid/proofs', { method: 'POST' })).status,
  );
  expect(status).toBe(400);
});
