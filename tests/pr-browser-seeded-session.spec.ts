/* ============================================================
   FILE: tests/pr-browser-seeded-session.spec.ts
   PURPOSE: Seeded browser session test (fast + deterministic)
            - Mint pr_session via direct POST /api/session (Node fetch)
            - Inject cookie into browser context
            - Navigate to /dashboard and confirm we land inside app
   ============================================================ */

import { test, expect, request as pwRequest } from "@playwright/test";

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}

test("SEEDED: browser has pr_session and can reach /dashboard", async ({ page, context }) => {
  test.setTimeout(45_000);

  const baseURL = process.env.PR_BASE_URL || "http://localhost:3000";
  const email = mustEnv("PR_TEST_EMAIL");
  const password = mustEnv("PR_TEST_PASSWORD");

  // 1) Sign in to Firebase via the app's existing Node harness endpoint:
  // We will reuse your existing scripts/test-auth-flow.mjs logic by calling Firebase directly
  // BUT we do it here using the browserless request context.

  // IMPORTANT:
  // We do NOT want to re-implement Firebase REST here.
  // Instead, we use the app itself: hit /api/session by providing a real ID token.
  // Your repo already has a working scripts/test-auth-flow.mjs that gets an ID token.
  // We’ll call that script and capture the session cookie from its output.

  // --- Call the existing Node harness and parse Set-Cookie from stdout ---
  const { execSync } = await import("node:child_process");

  const cmd =
    `node scripts/test-auth-flow.mjs --print-cookie`;

  const out = execSync(cmd, {
    encoding: "utf8",
    env: {
      ...process.env,
      PR_TEST_EMAIL: email,
      PR_TEST_PASSWORD: password,
    },
  });

  const m = out.match(/Set-Cookie\s*\(first 200\):\s*(pr_session=[^; ]+)/i);
  if (!m) {
    throw new Error(
      `Could not parse pr_session from test-auth-flow output.\n--- OUTPUT ---\n${out}`
    );
  }

  const cookiePair = m[1]; // pr_session=...
  const cookieValue = cookiePair.split("=", 2)[1];

  // 2) Inject cookie into real browser context
  await context.addCookies([
    {
      name: "pr_session",
      value: cookieValue,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
    },
  ]);

  // 3) Confirm server sees session (browser fetch)
  const status = await page.request.get(`${baseURL}/api/session`, {
    headers: { "Cache-Control": "no-store" },
  });

  const json = await status.json().catch(() => null);

  expect(status.ok()).toBeTruthy();
  expect(json?.hasSession).toBe(true);
  expect(json?.verified).toBe(true);

  // 4) Navigate to dashboard and confirm we land inside the app
  await page.goto(`${baseURL}/dashboard`, { waitUntil: "domcontentloaded" });

  // Your app currently tends to send users to /thinking/step-1 when no rocks exist.
  await expect(page).toHaveURL(/\/thinking\/step-1$|\/dashboard$|\/rocks$|\/thinking\/step-1\?/);
});
