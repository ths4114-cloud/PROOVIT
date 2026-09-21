import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: [
    {
      command: 'node tests/e2e/backend.mjs',
      url: 'http://127.0.0.1:54329/health',
      reuseExistingServer: false,
    },
    {
      command: 'npm run start',
      url: 'http://localhost:3000',
      env: {
        NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54329',
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test-key',
        APP_ORIGIN: 'http://localhost:3000',
        PROOVIT_CHALLENGE_SLUG: 'launch-31',
        PROOVIT_LOCAL_PREVIEW: 'true',
        ENABLE_DEMO: 'false',
        SUPABASE_SECRET_KEY: 'test-server-secret',
      },
      reuseExistingServer: false,
    },
  ],
});
