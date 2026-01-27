/* ============================================================
   FILE: scripts/pr-browser-check.mjs
   PURPOSE: Fast browser check that does NOT depend on slow UI minting.
            - Uses Node harness to mint pr_session
            - Injects cookie into Playwright browser context
            - Navigates to /dashboard and expects redirect into app
   ============================================================ */

import { execSync } from "node:child_process";

function mustEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}

function run(cmd) {
  console.log(`Running: ${cmd}`);
  execSync(cmd, { stdio: "inherit", env: process.env });
}

async function main() {
  // Ensure these exist
  mustEnv("PR_TEST_EMAIL");
  mustEnv("PR_TEST_PASSWORD");

  // Run a dedicated Playwright test that seeds cookie via Node
  run("npx playwright test tests/pr-browser-seeded-session.spec.ts");
}

main().catch((e) => {
  console.error("❌ SEEDED PLAYWRIGHT CHECK FAILED");
  console.error(e?.stack || String(e));
  process.exit(1);
});
