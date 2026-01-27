/* ============================================================
   FILE: playwright.config.ts
   PURPOSE: Fast-fail Playwright config for PocketRocks
            - Slight buffer so Playwright doesn't kill the page mid-loop
   ============================================================ */

import { defineConfig } from "@playwright/test";

const baseURL = process.env.PR_BASE_URL || "http://localhost:3000";

// FAST mode defaults (override with env vars if needed)
const TEST_TIMEOUT_MS = Number(process.env.PR_TEST_TIMEOUT_MS || 35_000); // buffer
const EXPECT_TIMEOUT_MS = Number(process.env.PR_EXPECT_TIMEOUT_MS || 8_000);

export default defineConfig({
  testDir: "./tests",
  timeout: TEST_TIMEOUT_MS,
  expect: { timeout: EXPECT_TIMEOUT_MS },
  retries: 0,
  use: {
    baseURL,
    headless: process.env.PR_HEADED === "1" ? false : true,
    viewport: { width: 1200, height: 800 },
    ignoreHTTPSErrors: true,

    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
