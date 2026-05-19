import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.AUDIT_BASE_URL || 'http://localhost:4321';

export default defineConfig({
  testDir: './scripts',
  testMatch: /mobile-audit\.ts$/,
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: '_mobile-audit/html-report' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  webServer: process.env.AUDIT_NO_SERVER
    ? undefined
    : {
        command: 'npm run dev -- --port 4321',
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 60_000,
      },
  projects: [
    {
      name: 'iphone-se',
      use: { ...devices['iPhone SE'], viewport: { width: 375, height: 667 } },
    },
    {
      name: 'iphone-15-pro',
      use: { ...devices['iPhone 14 Pro'], viewport: { width: 393, height: 852 } },
    },
    {
      name: 'pixel-8',
      use: { ...devices['Pixel 7'], viewport: { width: 412, height: 915 } },
    },
    {
      name: 'galaxy-s24',
      use: {
        ...devices['Galaxy S9+'],
        viewport: { width: 360, height: 780 },
        userAgent:
          'Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
      },
    },
    {
      name: 'ipad-mini-portrait',
      use: { ...devices['iPad Mini'] },
    },
    {
      name: 'ipad-mini-landscape',
      use: { ...devices['iPad Mini landscape'] },
    },
    {
      name: 'ipad-pro-11-portrait',
      use: {
        ...devices['iPad Pro 11'],
        viewport: { width: 834, height: 1194 },
      },
    },
    {
      name: 'ipad-pro-12-landscape',
      use: {
        ...devices['iPad Pro 11 landscape'],
        viewport: { width: 1366, height: 1024 },
      },
    },
  ],
});
