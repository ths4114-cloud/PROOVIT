import { test, expect, type Page, type APIRequestContext } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const backend = 'http://127.0.0.1:54329';
async function control(request: APIRequestContext, data: object) {
  const response = await request.post(`${backend}/__test/control`, { data });
  expect(response.ok()).toBeTruthy();
}
async function login(page: Page) {
  await page.goto('/');
  await page.getByLabel('참가 규칙을 확인했습니다.').check();
  await page.getByRole('button', { name: '챌린지 참가하기' }).click();
  await expect(page).toHaveURL(/\/login/);
  await page.getByRole('button', { name: 'Google로 계속하기' }).click();
  await expect(page).toHaveURL(/\/home$/);
}
test.beforeEach(async ({ request }) => {
  await request.post(`${backend}/__test/reset`);
});

test('one-click local preview opens the populated home', async ({ page }) => {
  await page.goto('/preview');
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByRole('heading', { name: '오늘의 미션' })).toBeVisible();
  await expect(page.getByTestId('current-day')).toContainText('1');
  await expect(page.getByTestId('total-score')).toHaveText('0점');
});
test('join → Google OAuth → persistent home, real SQL score, duplicate protection and logout', async ({
  page,
  request,
}) => {
  await mkdir('test-results/previews', { recursive: true });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '31일 MVP 런칭 챌린지' })).toBeVisible();
  await page.screenshot({
    path: 'test-results/previews/challenge-mobile.png',
    fullPage: false,
    scale: 'css',
  });
  await login(page);
  await expect(page.getByTestId('current-day')).toContainText('1');
  await expect(page.getByText('해결하고 싶은 문제를 한 문장으로 정의하기')).toBeVisible();
  await expect(page.getByTestId('total-score')).toHaveText('0점');
  await control(request, { score: 100 });
  await page.reload();
  await expect(page.getByTestId('total-score')).toHaveText('100점');
  await expect(page.getByTestId('total-score')).toBeVisible();
  await page.screenshot({
    path: 'test-results/previews/home-mobile.png',
    fullPage: false,
    scale: 'css',
  });
  await page.goto('/');
  await expect(page.getByText('이미 참가한 챌린지입니다.')).toBeVisible();
  await page.getByRole('link', { name: '나의 홈으로' }).click();
  expect((await (await request.get(`${backend}/__test/count`)).json()).count).toBe(1);
  await page.getByRole('button', { name: '로그아웃' }).click();
  await expect(page).toHaveURL(/\/login/);
  await page.screenshot({
    path: 'test-results/previews/login-mobile.png',
    fullPage: false,
    scale: 'css',
  });
  await page.goto('/home');
  await expect(page).toHaveURL(/\/login/);
});
test('invalid OAuth callback is recoverable and cannot grant access', async ({ page }) => {
  await page.goto('/auth/callback?code=invalid');
  await expect(page).toHaveURL(/\/login\?error=callback$/);
  await expect(page.locator('.auth-error')).toContainText('로그인을 완료하지 못했어요');
  await expect(page.getByRole('button', { name: 'Google로 계속하기' })).toBeVisible();
  await page.goto('/home');
  await expect(page).toHaveURL(/\/login$/);
});
test('before start, missing mission, ended, enrollment closed and data failure show honest states', async ({
  page,
  request,
}) => {
  await login(page);
  await control(request, { day: 0 });
  await page.reload();
  await expect(page.getByText('첫 미션이 곧 열려요')).toBeVisible();
  await control(request, { day: 2 });
  await page.reload();
  await expect(page.getByText('오늘의 미션을 준비 중이에요')).toBeVisible();
  await control(request, { day: 32 });
  await page.reload();
  await expect(page.getByRole('heading', { name: '31일의 도전이 마무리됐어요' })).toBeVisible();
  await control(request, { fault: true });
  await page.reload();
  await expect(page.getByRole('button', { name: '다시 불러오기' })).toBeVisible();
  await control(request, { fault: false });
  await page.getByRole('button', { name: '다시 불러오기' }).click();
  await expect(page.getByRole('heading', { name: '오늘의 미션' })).toBeVisible();
  await page.getByRole('button', { name: '로그아웃' }).click();
  await control(request, { closed: true });
  await page.goto('/');
  await expect(page.getByText('지금은 참가 신청 기간이 아니에요.')).toBeVisible();
});
test('PWA manifest, private cache exclusion and offline recovery', async ({
  page,
  context,
  request,
}) => {
  await login(page);
  const manifest = await (await request.get('/manifest.webmanifest')).json();
  expect(manifest.display).toBe('standalone');
  expect(manifest.icons.length).toBe(3);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  const cachePaths = await page.evaluate(async () =>
    (
      await Promise.all(
        (await caches.keys()).map(async (key) =>
          (await (await caches.open(key)).keys()).map((r) => new URL(r.url).pathname),
        ),
      )
    ).flat(),
  );
  expect(cachePaths).toEqual(['/offline.html']);
  await context.setOffline(true);
  await page.goto('/home');
  await expect(page.getByRole('heading', { name: '연결을 기다리고 있어요.' })).toBeVisible();
  await context.setOffline(false);
  await page.getByRole('link', { name: '다시 연결하기' }).click();
  await expect(page.getByTestId('total-score')).toBeVisible();
});
test('360px and desktop layouts do not overflow; guide is keyboard accessible', async ({
  page,
}) => {
  await login(page);
  for (const width of [360, 390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBeTruthy();
  }
  await page.locator('summary').scrollIntoViewIfNeeded();
  await page.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('타깃 고객 한 명을 떠올려 보세요.', { exact: false })).toBeVisible();
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    document.querySelector('#main')?.scrollTo(0, 0);
  });
  await page.screenshot({
    path: 'test-results/previews/home-desktop.png',
    fullPage: false,
    scale: 'css',
  });
});

test('enrollment closing during login preserves session without creating participation', async ({
  page,
  request,
}) => {
  await page.goto('/');
  await page.getByLabel('참가 규칙을 확인했습니다.').check();
  await page.getByRole('button', { name: '챌린지 참가하기' }).click();
  await control(request, { closed: true });
  await page.getByRole('button', { name: 'Google로 계속하기' }).click();
  await expect(page).toHaveURL(/notice=join-retry/);
  await expect(page.getByRole('button', { name: '로그아웃' })).toBeVisible();
  expect((await (await request.get(`${backend}/__test/count`)).json()).count).toBe(0);
});

test('navigation occupies its own bottom row at every content scroll position', async ({
  page,
}) => {
  await login(page);
  for (const width of [360, 390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    const nav = page.getByRole('navigation', { name: '주요 메뉴' });
    const initial = await nav.boundingBox();
    expect(initial).not.toBeNull();
    const viewportHeight = page.viewportSize()!.height;
    expect(Math.abs(initial!.y + initial!.height - viewportHeight)).toBeLessThanOrEqual(1);
    for (const fraction of [0, 0.5, 1]) {
      await page.locator('#main').evaluate((main, fraction) => {
        main.scrollTop = (main.scrollHeight - main.clientHeight) * fraction;
      }, fraction);
      const content = await page.locator('#main').boundingBox();
      const current = await nav.boundingBox();
      expect(current!.y).toBe(initial!.y);
      expect(content!.y + content!.height).toBeLessThanOrEqual(current!.y + 1);
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('타깃 고객 한 명을 떠올려 보세요.', { exact: false })).toBeVisible();
  await page.locator('#main').evaluate((main) => {
    main.scrollTop = main.scrollHeight;
  });
  const finalGeometry = await page.evaluate(() => ({
    y: window.scrollY,
    viewport: window.innerHeight,
    navBottom: document.querySelector('[aria-label="주요 메뉴"]')!.getBoundingClientRect().bottom,
    visualTop: window.visualViewport?.offsetTop,
    visualHeight: window.visualViewport?.height,
    mainHeight: document.querySelector('#main')!.getBoundingClientRect().height,
  }));
  expect(finalGeometry.y).toBe(0);
  expect(Math.abs(finalGeometry.navBottom - finalGeometry.viewport)).toBeLessThanOrEqual(1);
  await page.evaluate(async () => {
    (document.activeElement as HTMLElement)?.blur();
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
  await page.screenshot({
    path: 'test-results/previews/home-mobile-scrolled.png',
    fullPage: false,
    scale: 'css',
  });
});

test('login page hides the preview shortcut when UI preview is not enabled', async ({ page }) => {
  // 이 설정(playwright.participant.config.ts)은 ENABLE_UI_PREVIEW를 켜지 않는다.
  // 꺼진 환경에서 '로그인 없이 화면 예시 보기' 링크가 보이면 클릭 시 404로 안내하게 되므로 숨겨야 한다.
  await page.goto('/login');
  await expect(page.getByRole('link', { name: '로그인 없이 화면 예시 보기' })).toHaveCount(0);
});

test('logged-in nav shows 마이페이지 and navigates to the account page', async ({ page }) => {
  await login(page);
  const account = page.getByRole('link', { name: /마이페이지/ });
  await expect(account).toBeVisible();
  await expect(page.getByRole('link', { name: /^로그인$/ })).toHaveCount(0);
  await account.click();
  await expect(page).toHaveURL(/\/mypage$/);
  await expect(page.getByRole('heading', { name: '마이페이지' })).toBeVisible();
  await expect(page.getByText('participant@example.test', { exact: false })).toBeVisible();
});
