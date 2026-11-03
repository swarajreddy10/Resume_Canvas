import { defineConfig, devices } from '@playwright/test';
import { E2E_BASE_URL, e2eEnv } from '../tests/e2e/env';

// Paths here resolve from this file's directory (config/).
// https://playwright.dev/docs/test-configuration
export default defineConfig({
  testDir: '../tests/e2e',
  outputDir: '../test-results',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ['list'],
        ['html', { outputFolder: '../playwright-report', open: 'never' }],
      ]
    : [['html', { outputFolder: '../playwright-report' }]],
  use: {
    baseURL: E2E_BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Builds the app, then serves it against a fresh in-memory MongoDB with test-only
  // configuration (scripts/e2e-server.ts). No production secret is needed.
  // https://playwright.dev/docs/test-webserver
  webServer: {
    command: 'bun run build && bun scripts/e2e-server.ts',
    cwd: '..',
    url: E2E_BASE_URL,
    env: e2eEnv,
    timeout: 15 * 60 * 1000,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
  },
});
