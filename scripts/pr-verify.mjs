/* ============================================================
   FILE: scripts/pr-verify.mjs
   PURPOSE: Quick deterministic checks that prevent regressions

   Checks:
   - Critical files exist
   - /api/session route exists
   - /session/ready exists
   - /dashboard exists
   - No "secure: true" hardcoded in api/session cookie for dev

   Usage:
     node scripts/pr-verify.mjs
   ============================================================ */

import fs from "node:fs";
import path from "node:path";

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exit(1);
}
function ok(msg) {
  console.log(`✅ ${msg}`);
}

function exists(p) {
  return fs.existsSync(p);
}

function read(p) {
  return fs.readFileSync(p, "utf8");
}

const root = process.cwd();

const mustExist = [
  "src/app/api/session/route.ts",
  "src/app/session/ready/page.tsx",
  "src/app/dashboard/page.tsx",
];

for (const rel of mustExist) {
  const full = path.join(root, rel);
  if (!exists(full)) fail(`Missing ${rel}`);
  ok(`Found ${rel}`);
}

const sessionRoute = read(path.join(root, "src/app/api/session/route.ts"));

if (!sessionRoute.includes('const COOKIE_NAME = "pr_session"')) {
  fail('api/session route does not define COOKIE_NAME = "pr_session"');
}
ok("api/session cookie name looks correct");

if (sessionRoute.includes("secure: true")) {
  fail("api/session hardcodes secure:true (will break localhost http cookies)");
}
ok("api/session does not hardcode secure:true");

ok("VERIFY COMPLETE");
