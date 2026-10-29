import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests-localized',
  timeout: 60_000,
  use: { baseURL: 'http://localhost:4175', viewport: { width: 390, height: 844 }, launchOptions: { args: ['--autoplay-policy=no-user-gesture-required'] } },
  webServer: { command: 'npm run dev -- --host localhost --port 4175 --strictPort', url: 'http://localhost:4175', reuseExistingServer: false },
});
