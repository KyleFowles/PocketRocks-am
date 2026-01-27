/* ============================================================
   FILE: tests/pr-browser-session.spec.ts
   PURPOSE: Browser session harness (no-hang, actionable errors)
            - Observes POST /api/session request + response
            - Verifies /api/session using *browser fetch* with credentials
            - Uses a longer overall timeout because mint can be slow
   ============================================================ */

import { test, expect } from "@playwright/test";

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}

function nowMs() {
  return Date.now();
}

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`TIMEOUT after ${ms}ms: ${label}`)), ms)
    ),
  ]);
}

async function findEmailInput(page: any) {
  const locators = [
    page.locator('input[type="email"]').first(),
    page.locator('input[autocomplete="email"]').first(),
    page.locator('input[inputmode="email"]').first(),
    page.locator('input[name="email"]').first(),
  ];
  for (const l of locators) {
    try {
      if ((await l.count()) > 0) return l;
    } catch {}
  }
  return null;
}

async function findPasswordInput(page: any) {
  const locators = [
    page.locator('input[type="password"]').first(),
    page.locator('input[autocomplete="current-password"]').first(),
    page.locator('input[name="password"]').first(),
  ];
  for (const l of locators) {
    try {
      if ((await l.count()) > 0) return l;
    } catch {}
  }
  return null;
}

async function findBestSubmitButton(page: any) {
  const candidates = [
    page.getByRole("button", { name: /^sign in$/i }).first(),
    page.getByRole("button", { name: /sign\s*in/i }).first(),
    page.getByRole("button", { name: /log\s*in/i }).first(),
    page.locator('button[type="submit"]').first(),
  ];

  for (const c of candidates) {
    try {
      if ((await c.count()) > 0) return c;
    } catch {}
  }
  return null;
}

async function browserSessionStatus(page: any) {
  return await page.evaluate(async () => {
    try {
      const r = await fetch("/api/session", {
        method: "GET",
        headers: { "Cache-Control": "no-store" },
        credentials: "include",
      });
      const json = await r.json().catch(() => null);
      return { ok: r.ok, status: r.status, json };
    } catch (e: any) {
      return { ok: false, status: 0, json: null, error: String(e?.message || e) };
    }
  });
}

test("FAST: browser session mints + verifies pr_session (no-hang)", async ({ page }) => {
  // Allow slow Firebase/Admin work without turning into “hurry up and wait”
  // We still fast-fail each step with its own timeout.
  test.setTimeout(120_000);

  const email = mustEnv("PR_TEST_EMAIL");
  const password = mustEnv("PR_TEST_PASSWORD");

  const t0 = nowMs();
  const mark = (name: string) => {
    const dt = nowMs() - t0;
    console.log(`⏱  ${name} @ +${dt}ms`);
  };

  const consoleMsgs: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (m) => consoleMsgs.push(`[${m.type()}] ${m.text()}`));
  page.on("pageerror", (e) => pageErrors.push(String(e)));

  // Network traces
  const seenRequests: string[] = [];
  const seenResponses: string[] = [];
  const seenRequestFailed: string[] = [];

  page.on("request", (r) => {
    const url = r.url();
    if (url.includes("/api/")) seenRequests.push(`${r.method()} ${url}`);
  });

  page.on("response", (r) => {
    const url = r.url();
    if (url.includes("/api/"))
      seenResponses.push(`${r.status()} ${r.request().method()} ${url}`);
  });

  page.on("requestfailed", (r) => {
    const url = r.url();
    if (url.includes("/api/")) {
      const failure = r.failure();
      seenRequestFailed.push(
        `FAILED ${r.request().method()} ${url} :: ${failure?.errorText || "unknown"}`
      );
    }
  });

  // Track submit events
  await page.addInitScript(() => {
    (window as any).__PR_SUBMIT_COUNT__ = 0;
    window.addEventListener(
      "submit",
      () => {
        (window as any).__PR_SUBMIT_COUNT__++;
      },
      true
    );
  });

  mark("goto:start");
  await withTimeout(
    page.goto(`/login?next=${encodeURIComponent("/dashboard")}`, {
      waitUntil: "domcontentloaded",
    }),
    10_000,
    "goto /login"
  );
  mark("goto:done");

  const emailInput = await withTimeout(findEmailInput(page), 3500, "find email input");
  const passInput = await withTimeout(findPasswordInput(page), 3500, "find password input");
  const submitBtn = await withTimeout(findBestSubmitButton(page), 3500, "find submit button");

  if (!emailInput || !passInput || !submitBtn) {
    throw new Error(
      `Could not find login controls.\nURL=${page.url()}\n` +
        `Requests:\n${seenRequests.slice(-30).join("\n")}\n` +
        `Responses:\n${seenResponses.slice(-30).join("\n")}\n` +
        `RequestFailed:\n${seenRequestFailed.slice(-30).join("\n")}\n` +
        `Console(last 30):\n${consoleMsgs.slice(-30).join("\n")}\n` +
        `PageErrors:\n${pageErrors.slice(-10).join("\n")}`
    );
  }
  mark("controls:found");

  await withTimeout(emailInput.fill(email), 3000, "fill email");
  await withTimeout(passInput.fill(password), 3000, "fill password");
  mark("controls:filled");

  const btnText = (await submitBtn.textContent().catch(() => "")) || "";
  const btnType = (await submitBtn.getAttribute("type").catch(() => "")) || "";
  const btnDisabled = await submitBtn.isDisabled().catch(() => false);
  console.log(`🧪 Clicking button: text="${btnText.trim()}" type="${btnType}" disabled=${btnDisabled}`);

  // Observe POST /api/session
  const reqPromise = page.waitForRequest(
    (r: any) => r.url().includes("/api/session") && r.method() === "POST",
    { timeout: 12_000 }
  );

  // IMPORTANT: mint can sometimes be slow (Firebase Admin verify/create)
  const resPromise = page.waitForResponse(
    (r: any) => r.url().includes("/api/session") && r.request().method() === "POST",
    { timeout: 60_000 }
  );

  mark("submit:click");
  await withTimeout(
    submitBtn.click({ timeout: 2000 }).catch(() => submitBtn.click()),
    4000,
    "click submit"
  );
  await withTimeout(passInput.press("Enter").catch(() => {}), 1500, "press Enter");
  mark("submit:sent");

  await withTimeout(page.waitForTimeout(250), 1500, "settle 250ms");
  const submitCount = await page.evaluate(() => (window as any).__PR_SUBMIT_COUNT__ || 0).catch(() => -1);
  console.log(`🧪 submit events seen in page: ${submitCount}`);

  // 1) request seen
  await withTimeout(reqPromise, 12_500, "wait for POST /api/session request");
  mark("mint:request-seen");

  // 2) response seen
  const mintRes = await withTimeout(resPromise, 62_000, "wait for POST /api/session response");
  const mintStatus = mintRes.status();
  const mintBodyHead = (await mintRes.text().catch(() => "")).slice(0, 220);
  mark(`mint:response-seen status=${mintStatus}`);

  if (mintStatus < 200 || mintStatus >= 300) {
    throw new Error(
      `POST /api/session failed. status=${mintStatus} body=${mintBodyHead}\n` +
        `URL=${page.url()}\n` +
        `submitCount=${submitCount}\n` +
        `Requests(last 30):\n${seenRequests.slice(-30).join("\n")}\n` +
        `Responses(last 30):\n${seenResponses.slice(-30).join("\n")}\n` +
        `RequestFailed(last 30):\n${seenRequestFailed.slice(-30).join("\n")}\n` +
        `Console(last 40):\n${consoleMsgs.slice(-40).join("\n")}\n` +
        `PageErrors:\n${pageErrors.slice(-10).join("\n")}`
    );
  }

  mark("mint:ok");

  // 3) verify using BROWSER fetch (uses real cookie jar)
  const verifyStart = nowMs();
  let last: any = null;

  while (nowMs() - verifyStart < 10_000) {
    last = await browserSessionStatus(page);

    if (last?.ok && last?.json?.hasSession === true && last?.json?.verified === true) {
      console.log("✅ Browser /api/session says verified:", last.json);
      expect(last.json.verified).toBe(true);
      return;
    }

    await new Promise((r) => setTimeout(r, 250));
  }

  throw new Error(
    `Session not verified in browser within 10s after mint.\n` +
      `Last browser status: ${JSON.stringify(last)}\n` +
      `URL=${page.url()}\n` +
      `Requests(last 30):\n${seenRequests.slice(-30).join("\n")}\n` +
      `Responses(last 30):\n${seenResponses.slice(-30).join("\n")}\n` +
      `RequestFailed(last 30):\n${seenRequestFailed.slice(-30).join("\n")}\n` +
      `Console(last 40):\n${consoleMsgs.slice(-40).join("\n")}\n` +
      `PageErrors:\n${pageErrors.slice(-10).join("\n")}`
  );
});
