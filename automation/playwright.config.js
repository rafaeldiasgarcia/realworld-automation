import { defineConfig, devices } from '@playwright/test';

const TIMEOUTS = {
  teste: 120_000,
  expect: 10_000,
  acao: 15_000,
  navegacao: 30_000,
};

export default defineConfig({
  testDir: './tests',

  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: 2,

  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  timeout: TIMEOUTS.teste,
  expect: {
    timeout: TIMEOUTS.expect,
  },

  use: {
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure',
    actionTimeout: TIMEOUTS.acao,
    navigationTimeout: TIMEOUTS.navegacao,
  },

  projects: [
    {
      name: 'chrome',
      testMatch: /.*frontend\/.*\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200',
      },
    },
    {
      name: 'rest',
      testMatch: /.*api\/.*\.spec\.js/,
      use: {
        baseURL: 'http://localhost:8080',
      },
    },
  ],
});
