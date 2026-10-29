import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:4173', viewport: { width: 390, height: 844 }, launchOptions: { args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'] } },
  webServer: { command: 'node scripts/serve-test.mjs', url: 'http://localhost:4173', reuseExistingServer: false },
});
