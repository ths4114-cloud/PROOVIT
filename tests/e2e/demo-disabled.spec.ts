import { expect, test } from '@playwright/test';

test('standalone demo is unavailable unless explicitly enabled', async ({ page }) => {
  for (const path of ['/demo', '/demo/home', '/demo/missions/day-12/camera']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: '페이지를 찾을 수 없어요' })).toBeVisible();
    await expect(page.getByRole('button', { name: '데모로 시작' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: '카메라 시작하기' })).toHaveCount(0);
  }
});
