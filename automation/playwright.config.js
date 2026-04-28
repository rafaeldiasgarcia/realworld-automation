import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html']],
  use: {
    trace: 'on',
    screenshot: 'on',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'frontend',
      testDir: './tests/frontend',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'http://localhost:8080',
      },
    },
  ],
});
