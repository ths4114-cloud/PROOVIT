import { expect, test, type Page } from '@playwright/test';

async function installFakeCamera(page: Page, failFirstAttempt = false) {
  let stopCount = 0;
  await page.exposeFunction('__recordCameraStop', () => {
    stopCount += 1;
  });
  await page.addInitScript((failFirstAttempt) => {
    let shouldFail = failFirstAttempt;
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
      configurable: true,
      value: async () => {
        if (shouldFail) {
          shouldFail = false;
          throw new Error('Unexpected camera failure for test.');
        }
        const canvas = document.createElement('canvas');
        canvas.width = 480;
        canvas.height = 640;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Test canvas is unavailable.');
        context.fillStyle = '#ed1763';
        context.fillRect(0, 0, canvas.width, canvas.height);
        const stream = canvas.captureStream(5);
        for (const track of stream.getTracks()) {
          const originalStop = track.stop.bind(track);
          track.stop = () => {
            void window.__recordCameraStop();
            originalStop();
          };
        }
        return stream;
      },
    });
  }, failFirstAttempt);
  return () => stopCount;
}

test('captures, previews, retakes, and releases an in-app camera stream', async ({ page }) => {
  const getStopCount = await installFakeCamera(page);
  await page.goto('/preview/missions/day-12/camera');

  const startButton = page.getByRole('button', { name: '카메라 시작하기' });
  await startButton.focus();
  await expect(startButton).toBeFocused();
  await startButton.press('Enter');

  await expect(page.getByLabel('카메라 촬영 화면')).toBeVisible();
  const captureButton = page.getByRole('button', { name: '사진 촬영하기' });
  await expect(captureButton).toBeEnabled();
  await captureButton.click();

  await expect(page.getByAltText('촬영한 인증 사진 미리보기')).toBeVisible();
  await expect(page.getByRole('button', { name: '다시 촬영하기' })).toBeEnabled();
  await expect(page.getByRole('button', { name: '제출 기능 연결 전' })).toBeDisabled();
  await expect(page.locator('input[type="file"]')).toHaveCount(0);
  const retakeButtonBox = await page.getByRole('button', { name: '다시 촬영하기' }).boundingBox();
  expect(retakeButtonBox?.height).toBeGreaterThanOrEqual(48);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));
  await expect.poll(getStopCount).toBe(1);

  await page.getByRole('button', { name: '다시 촬영하기' }).click();
  await expect(page.getByRole('button', { name: '사진 촬영하기' })).toBeEnabled();
  await page.getByRole('link', { name: '홈', exact: true }).click();
  await expect(page).toHaveURL(/\/preview\/home$/);
  await expect.poll(getStopCount).toBe(2);
});

test('explains denied permission without offering a file upload fallback', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
      configurable: true,
      value: async () => {
        throw new DOMException('Permission denied for test.', 'NotAllowedError');
      },
    });
  });
  await page.goto('/preview/missions/day-12/camera');
  await page.getByRole('button', { name: '카메라 시작하기' }).click();

  await expect(
    page.getByRole('alert').filter({ hasText: '카메라 권한이 꺼져 있어요.' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: '카메라 다시 시도하기' })).toBeEnabled();
  await expect(page.locator('input[type="file"]')).toHaveCount(0);
});

test('explains unsupported browsers without offering a file upload fallback', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: undefined,
    });
  });
  await page.goto('/preview/missions/day-12/camera');
  await page.getByRole('button', { name: '카메라 시작하기' }).click();

  await expect(
    page.getByRole('alert').filter({ hasText: '카메라 촬영을 지원하지 않아요.' }),
  ).toBeVisible();
  await expect(page.locator('input[type="file"]')).toHaveCount(0);
});

test('explains an unavailable camera and allows an in-app retry', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
      configurable: true,
      value: async () => {
        throw new DOMException('No camera for test.', 'NotFoundError');
      },
    });
  });
  await page.goto('/preview/missions/day-12/camera');
  await page.getByRole('button', { name: '카메라 시작하기' }).click();

  await expect(
    page.getByRole('alert').filter({ hasText: '사용할 수 있는 카메라를 찾지 못했어요.' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: '카메라 다시 시도하기' })).toBeEnabled();
});

test('recovers from an unexpected camera error through retry', async ({ page }) => {
  await installFakeCamera(page, true);
  await page.goto('/preview/missions/day-12/camera');
  await page.getByRole('button', { name: '카메라 시작하기' }).click();
  await expect(
    page.getByRole('alert').filter({ hasText: '카메라를 시작하지 못했어요.' }),
  ).toBeVisible();
  await page.getByRole('button', { name: '카메라 다시 시도하기' }).click();
  await expect(page.getByRole('button', { name: '사진 촬영하기' })).toBeEnabled();
});

for (const width of [360, 390, 430]) {
  test(`integrated camera navigation and controls fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await installFakeCamera(page);
    await page.goto('/preview/home');
    await page.getByRole('link', { name: '오늘의 미션 카메라 인증' }).click();
    await expect(page).toHaveURL(/\/preview\/missions\/day-12\/camera$/);
    await page.getByRole('button', { name: '카메라 시작하기' }).click();
    await page.getByRole('button', { name: '사진 촬영하기' }).click();
    const retake = page.getByRole('button', { name: '다시 촬영하기' });
    await retake.scrollIntoViewIfNeeded();
    await expect(retake).toBeInViewport();
    const button = await retake.boundingBox();
    const nav = await page.getByRole('navigation', { name: '주요 메뉴' }).boundingBox();
    expect(button).not.toBeNull();
    expect(nav).not.toBeNull();
    expect(button!.y + button!.height).toBeLessThanOrEqual(nav!.y);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
    await page.screenshot({ path: `test-results/camera-integrated-${width}.png` });
  });
}

declare global {
  interface Window {
    __recordCameraStop(): Promise<void>;
    __resolveCameraPermission(): void;
  }
}

test('stops a stream granted after leaving the camera screen', async ({ page }) => {
  const getStopCount = await installFakeCamera(page);
  await page.goto('/preview/missions/day-12/camera');
  await page.evaluate(() => {
    const original = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
      configurable: true,
      value: async (constraints: MediaStreamConstraints) => {
        await new Promise<void>((resolve) => {
          window.__resolveCameraPermission = resolve;
        });
        return original(constraints);
      },
    });
  });
  await page.getByRole('button', { name: '카메라 시작하기' }).click();
  await expect(page.getByRole('button', { name: '권한 확인 중…' })).toBeDisabled();
  await page.getByRole('link', { name: '홈', exact: true }).click();
  await expect(page).toHaveURL(/\/preview\/home$/);
  await page.evaluate(() => window.__resolveCameraPermission());
  await expect.poll(getStopCount).toBe(1);
});

test('releases the stream when image encoding fails', async ({ page }) => {
  const getStopCount = await installFakeCamera(page);
  await page.goto('/preview/missions/day-12/camera');
  await page.evaluate(() => {
    HTMLCanvasElement.prototype.toBlob = function (callback) {
      callback(null);
    };
  });
  await page.getByRole('button', { name: '카메라 시작하기' }).click();
  await page.getByRole('button', { name: '사진 촬영하기' }).click();
  await expect(page.getByRole('button', { name: '카메라 다시 시도하기' })).toBeEnabled();
  await expect(page.getByAltText('촬영한 인증 사진 미리보기')).toHaveCount(0);
  await expect.poll(getStopCount).toBe(1);
});

test('revokes captured image URLs on retake and navigation', async ({ page }) => {
  await installFakeCamera(page);
  const revoked: string[] = [];
  await page.exposeFunction('__recordRevokedUrl', (url: string) => revoked.push(url));
  await page.goto('/preview/missions/day-12/camera');
  await page.evaluate(() => {
    const original = URL.revokeObjectURL.bind(URL);
    URL.revokeObjectURL = (url) => {
      void (
        window as unknown as { __recordRevokedUrl(url: string): Promise<void> }
      ).__recordRevokedUrl(url);
      original(url);
    };
  });
  await page.getByRole('button', { name: '카메라 시작하기' }).click();
  await page.getByRole('button', { name: '사진 촬영하기' }).click();
  const preview = page.getByAltText('촬영한 인증 사진 미리보기');
  await expect(preview).toBeVisible();
  const firstUrl = await preview.getAttribute('src');
  await page.getByRole('button', { name: '다시 촬영하기' }).click();
  await expect.poll(() => revoked).toContain(firstUrl);
  await page.getByRole('button', { name: '사진 촬영하기' }).click();
  await expect(preview).toBeVisible();
  const secondUrl = await preview.getAttribute('src');
  expect(secondUrl).not.toBe(firstUrl);
  await page.getByRole('link', { name: '홈', exact: true }).click();
  await expect(page).toHaveURL(/\/preview\/home$/);
  await expect.poll(() => revoked).toContain(secondUrl);
});
