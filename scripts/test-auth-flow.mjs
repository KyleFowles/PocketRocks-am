/* ============================================================
   FILE: scripts/test-auth-flow.mjs
   PURPOSE: Deterministic auth + session + routing verification

   What it proves (without the browser):
   1) Firebase email/password sign-in returns a real ID token
   2) POST /api/session returns Set-Cookie pr_session
   3) GET /api/session verifies that cookie (verified:true + uid)
   4) /dashboard is reachable with that cookie (200 or redirect chain)

   Usage (Terminal A):
     set -a; source .env.local; set +a
     export PR_TEST_EMAIL="KyleFowles@ManagementStream.com"
     export PR_TEST_PASSWORD="yourRealPassword"
     export PR_BASE_URL="http://localhost:3000"   # optional

     node scripts/test-auth-flow.mjs
     node scripts/test-auth-flow.mjs --print-cookie

   Requires:
     - NEXT_PUBLIC_FIREBASE_API_KEY in environment (from .env.local)
   ============================================================ */

const DEFAULT_BASE = "http://localhost:3000";

function hasFlag(name) {
  return process.argv.includes(name);
}

function must(name, v) {
  if (!v) {
    console.error(`❌ Missing ${name}`);
    process.exit(1);
  }
  return v;
}

function head(msg) {
  console.log(`\n=== ${msg} ===`);
}

function ok(msg) {
  console.log(`✅ ${msg}`);
}

function warn(msg) {
  console.log(`⚠️  ${msg}`);
}

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

async function readText(res) {
  return await res.text().catch(() => "");
}

function pickCookiePair(setCookieHeader, cookieName) {
  // set-cookie may contain commas inside Expires; safest is split by ", " only if it looks like multiple cookies.
  // But here we only care about the cookieName=... pair, which is always before first ";" for that cookie.
  const raw = setCookieHeader || "";
  const parts = raw.split(/,\s(?=[^;]+?=)/g); // split on ", " only when followed by "name="
  for (const p of parts) {
    const first = p.split(";")[0].trim();
    if (first.startsWith(`${cookieName}=`)) return first;
  }
  return null;
}

async function fetchFollow(baseUrl, path, headers, maxHops = 8) {
  let url = path.startsWith("http") ? path : `${baseUrl}${path}`;
  const chain = [];

  for (let i = 0; i < maxHops; i++) {
    const res = await fetch(url, {
      method: "GET",
      headers,
      redirect: "manual", // we follow ourselves to keep visibility
    });

    chain.push({
      url,
      status: res.status,
      location: res.headers.get("location") || null,
    });

    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return { chain, final: { url, status: res.status, body: "" } };
      url = loc.startsWith("http")
        ? loc
        : `${baseUrl}${loc.startsWith("/") ? loc : `/${loc}`}`;
      continue;
    }

    const body = await readText(res);
    return { chain, final: { url, status: res.status, body } };
  }

  return { chain, final: { url, status: 0, body: "Too many redirects" } };
}

async function main() {
  const baseUrl = process.env.PR_BASE_URL || DEFAULT_BASE;
  const printCookieOnly = hasFlag("--print-cookie");

  const apiKey = must(
    "NEXT_PUBLIC_FIREBASE_API_KEY (load .env.local into shell)",
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  );
  const email = must("PR_TEST_EMAIL", process.env.PR_TEST_EMAIL);
  const password = must("PR_TEST_PASSWORD", process.env.PR_TEST_PASSWORD);

  if (!printCookieOnly) head("1) Firebase password sign-in (ID token)");

  const signInRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );

  const signInJson = await signInRes.json().catch(() => ({}));
  if (!signInRes.ok) {
    if (!printCookieOnly) console.log(signInJson);
    fail(`Firebase sign-in failed: ${signInRes.status} ${signInRes.statusText}`);
  }

  const idToken = signInJson.idToken;
  if (!idToken || typeof idToken !== "string" || idToken.length < 200) {
    fail("Did not receive a valid Firebase idToken");
  }
  if (!printCookieOnly) ok(`Got Firebase idToken (len=${idToken.length})`);

  if (!printCookieOnly) head("2) Mint server session cookie (POST /api/session)");

  const mintRes = await fetch(`${baseUrl}/api/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ idToken }),
  });

  const mintBody = await readText(mintRes);
  const setCookie = mintRes.headers.get("set-cookie") || "";
  const cookiePair = pickCookiePair(setCookie, "pr_session");

  if (!printCookieOnly) {
    console.log("Mint status:", mintRes.status, mintRes.statusText);
    if (mintBody) console.log("Mint body (first 200):", mintBody.slice(0, 200));
    if (setCookie) console.log("Set-Cookie (first 200):", setCookie.slice(0, 200));
  }

  if (!mintRes.ok) {
    fail("POST /api/session failed (see output above)");
  }
  if (!cookiePair) {
    fail("No pr_session cookie returned by POST /api/session");
  }

  // ✅ For tooling: emit a stable, parseable line
  // (Your Playwright test can match this exactly.)
  if (printCookieOnly) {
    process.stdout.write(`PR_COOKIE_PAIR=${cookiePair}\n`);
    return;
  }

  ok(`Received cookie pair: ${cookiePair.slice(0, 24)}…`);

  // quick sanity check on cookie flags
  if (/;\s*Secure/i.test(setCookie)) {
    warn(
      "Cookie has Secure flag. On plain http localhost, this may not persist in browser (script will still work)."
    );
  } else {
    ok("Cookie is not Secure (good for http localhost).");
  }

  head("3) Verify session cookie on server (GET /api/session)");
  const checkRes = await fetch(`${baseUrl}/api/session`, {
    method: "GET",
    headers: { Cookie: cookiePair },
    cache: "no-store",
  });
  const checkJson = await checkRes.json().catch(() => null);

  if (!checkJson) {
    fail("GET /api/session did not return JSON");
  }

  console.log("Server sees:", checkJson);

  if (!checkJson.hasSession) {
    fail(
      "Server says hasSession=false even when sending cookie back (cookie parsing/path issue)"
    );
  }
  if (!checkJson.verified) {
    fail(
      `Server says verified=false (admin verifySessionCookie failing)${
        checkJson.error ? ` — ${checkJson.error}` : ""
      }`
    );
  }
  if (!checkJson.uid) {
    fail("Server returned verified:true but no uid");
  }
  ok(`Session verified for uid=${checkJson.uid}`);

  head("4) Request /dashboard with cookie (follow redirects)");
  const dash = await fetchFollow(baseUrl, "/dashboard", { Cookie: cookiePair }, 10);
  dash.chain.forEach((c, idx) => {
    console.log(
      `${String(idx + 1).padStart(2, "0")}. ${c.status} ${c.url}${
        c.location ? `  ->  ${c.location}` : ""
      }`
    );
  });

  const finalStatus = dash.final.status;
  if (finalStatus === 200) {
    ok("Dashboard returned 200 with server session");
  } else if (finalStatus >= 300 && finalStatus < 400) {
    warn(
      "Dashboard ended on a redirect (expected if you auto-forward to /thinking when no rocks)."
    );
  } else {
    warn(`Dashboard final status=${finalStatus}`);
    console.log("Final body (first 300):", (dash.final.body || "").slice(0, 300));
    fail("Dashboard is not reachable with a verified cookie (routing/guard issue)");
  }

  head("RESULT");
  ok("AUTH + SESSION + DASHBOARD CHECK PASSED");
  console.log(
    "\nNext: if browser still loops, it’s a browser-cookie persistence issue (host mismatch or Secure flag) — not auth."
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
