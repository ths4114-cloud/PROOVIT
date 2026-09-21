import { expect, test, type Page } from '@playwright/test';

async function start(page: Page) {
  await page.goto('/demo');
  await page.getByRole('button', { name: '데모로 시작' }).click();
  await expect(page.getByTestId('demo-total')).toHaveText('1,100점');
}

test('demo camera submission updates every screen, persists, resets and never uploads', async ({
  page,
}, testInfo) => {
  const writes: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST') writes.push(request.url());
  });
  await page.addInitScript(() => {
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
      value: async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 480;
        canvas.height = 640;
        canvas.getContext('2d')!.fillRect(0, 0, 480, 640);
        return canvas.captureStream(5);
      },
    });
    localStorage.setItem('unrelated-data', 'keep');
  });
  await start(page);
  await page.getByRole('link', { name: '오늘의 미션 보기', exact: true }).click();
  await expect(page.getByRole('heading', { name: '오늘의 제출' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '완료 기준' })).toBeVisible();
  await page.getByRole('link', { name: '카메라로 인증하기' }).click();
  await expect(page.getByRole('button', { name: '데모 제출하기' })).toHaveCount(0);
  await page.getByRole('button', { name: '카메라 시작하기' }).click();
  await page.getByRole('button', { name: '사진 촬영하기' }).click();
  await expect(page.getByAltText('촬영한 인증 사진 미리보기')).toBeVisible();
  await page.getByRole('button', { name: '다시 촬영하기' }).click();
  await page.getByRole('button', { name: '사진 촬영하기' }).click();
  await page.getByRole('button', { name: '데모 제출하기' }).click();
  await expect(page).toHaveURL(/\/demo\/missions\/day-12\/result$/);
  await expect(page.getByTestId('demo-total')).toHaveText('1,200');
  await page.screenshot({ path: testInfo.outputPath('demo-result.png'), fullPage: true });
  await page.reload();
  await expect(page.getByTestId('demo-total')).toHaveText('1,200');
  await page.getByRole('link', { name: '홈', exact: true }).click();
  await expect(page.getByTestId('demo-total')).toHaveText('1,200점');
  await page.getByRole('link', { name: '미션보드', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Day 12 · 완료', exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('demo-board.png'), fullPage: true });
  await expect(page.getByTestId('demo-total')).toHaveText('1,200');
  await page.goto('/demo/missions/day-12/camera');
  await expect(page.getByRole('heading', { name: '이미 완료한 미션이에요' })).toBeVisible();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('proovit.demo.v1')!));
  expect(stored).toEqual({ version: 1, entered: true, completedToday: true });
  expect(writes).toEqual([]);
  await page.getByRole('link', { name: '내 데모', exact: true }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: '데모 초기화' }).click();
  await expect(page.getByRole('button', { name: '데모로 시작' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('unrelated-data'))).toBe('keep');
  await page.getByRole('button', { name: '데모로 시작' }).click();
  await expect(page.getByTestId('demo-total')).toHaveText('1,100점');
});

test('demo guards deep links, locked days, unknown routes and unsubmitted results', async ({
  page,
}) => {
  await page.goto('/demo/missions/day-12/camera');
  await expect(page.getByRole('button', { name: '데모로 시작' })).toBeVisible();
  await page.getByRole('button', { name: '데모로 시작' }).click();
  await expect(page).toHaveURL(/\/demo\/home$/);
  await page.goto('/demo/missions/day-12/result');
  await expect(page.getByRole('heading', { name: '아직 제출하지 않았어요' })).toBeVisible();
  await page.goto('/demo/missions/day-18/camera');
  await expect(page.getByRole('heading', { name: '아직 열리지 않은 미션' })).toBeVisible();
  await page.goto('/demo/missions/day-99');
  await expect(page.getByRole('heading', { name: '페이지를 찾을 수 없어요' })).toBeVisible();
});

test('demo survives blocked and corrupt storage with an honest warning', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('blocked', 'SecurityError');
    };
  });
  await start(page);
  await expect(page.getByRole('status')).toContainText('브라우저에 저장하지 못했어요');
  await page.getByRole('link', { name: '미션보드', exact: true }).click();
  await expect(page.getByTestId('demo-total')).toHaveText('1,100');
  await expect(page.getByRole('status')).toContainText('새로고침');
});

test('demo validates stored data and fits narrow screens with keyboard entry', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('proovit.demo.v1', 'broken'));
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/demo');
  await expect(page.getByRole('status')).toContainText('초기 상태로 시작');
  const button = page.getByRole('button', { name: '데모로 시작' });
  await button.focus();
  await button.press('Enter');
  await expect(page.getByTestId('demo-total')).toHaveText('1,100점');
  await page.getByRole('link', { name: '미션보드', exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole('navigation', { name: '데모 하단 메뉴' })).toBeVisible();
});

test('journey board has accessible chapters, current mission and locked stops', async ({
  page,
}, testInfo) => {
  await start(page);
  await page.getByRole('link', { name: '미션보드', exact: true }).click();
  await expect(page.getByRole('region', { name: /단계$/ })).toHaveCount(6);
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '11');
  const current = page.getByRole('link', { name: 'Day 12 · 오늘', exact: true });
  await expect(current).toHaveAttribute('aria-current', 'step');
  await expect(page.getByRole('link', { name: /Day 13/ })).toHaveCount(0);
  for (const width of [320, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const box = await current.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
    await page.screenshot({ path: testInfo.outputPath(`journey-${width}.png`), fullPage: true });
  }
  await current.focus();
  await current.press('Enter');
  await expect(page).toHaveURL(/\/demo\/missions\/day-12$/);
});
