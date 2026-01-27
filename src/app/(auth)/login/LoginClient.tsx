/* ============================================================
   FILE: src/app/(auth)/login/LoginClient.tsx
   PURPOSE: Client-side login form
            - Signs in with Firebase Auth
            - Mints server session cookie (pr_session) via POST /api/session
            - Waits until server confirms cookie is visible
            - Hands off to /session/ready?next=... for deterministic redirect
   ============================================================ */

"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebaseClient";

type SessionStatus = {
  ok: boolean;
  hasSession?: boolean;
  verified?: boolean;
  uid?: string;
  cookieName?: string;
  error?: string;
};

function safeNext(nextUrl: string): string {
  const v = (nextUrl || "").trim();
  if (!v) return "/dashboard";
  if (!v.startsWith("/")) return "/dashboard";
  if (v.startsWith("//")) return "/dashboard";
  if (v.includes("://")) return "/dashboard";
  if (v.startsWith("/login")) return "/dashboard";
  return v;
}

async function mintSessionCookie(idToken: string) {
  const res = await fetch("/api/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    credentials: "include",
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(
      `Session cookie mint failed: ${res.status} ${res.statusText}${txt ? ` — ${txt}` : ""}`
    );
  }
}

async function readSessionStatus(): Promise<SessionStatus> {
  const res = await fetch("/api/session", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const json = (await res.json().catch(() => null)) as any;

  return {
    ok: Boolean(json?.ok),
    hasSession: Boolean(json?.hasSession),
    verified: Boolean(json?.verified),
    uid: typeof json?.uid === "string" ? json.uid : undefined,
    cookieName: typeof json?.cookieName === "string" ? json.cookieName : undefined,
    error: typeof json?.error === "string" ? json.error : undefined,
  };
}

async function waitForServerToSeeCookie(maxMs = 2200) {
  const started = Date.now();
  let last: SessionStatus | null = null;

  while (Date.now() - started < maxMs) {
    last = await readSessionStatus();
    if (last.ok && last.hasSession && last.verified) return last;
    await new Promise((r) => setTimeout(r, 180));
  }

  return last;
}

export default function LoginClient({ nextUrl }: { nextUrl: string }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const target = useMemo(() => safeNext(nextUrl), [nextUrl]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;

    setBusy(true);
    setError(null);

    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);

      await setPersistence(auth, browserLocalPersistence);

      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await cred.user.getIdToken(true);

      // 1) Mint cookie
      await mintSessionCookie(idToken);

      // 2) Wait until the server confirms it actually sees the cookie
      const status = await waitForServerToSeeCookie(2400);

      if (!status?.hasSession) {
        throw new Error(
          `Cookie was not stored. /api/session says hasSession=false. This is usually a host mismatch (localhost vs 192.168.x.x), or a cookie policy issue.`
        );
      }

      // 3) Deterministic redirect via server-verified handoff
      router.replace(`/session/ready?next=${encodeURIComponent(target)}`);
      router.refresh();
    } catch (err: any) {
      const msg =
        typeof err?.message === "string"
          ? err.message
          : "Login failed. Please try again.";
      setError(msg);
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 520, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Sign in</h1>
      <p style={{ marginTop: 0, opacity: 0.75, marginBottom: 24 }}>
        After sign-in, you’ll continue automatically.
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            style={{
              padding: "12px 12px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.2)",
              fontSize: 16,
            }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            style={{
              padding: "12px 12px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.2)",
              fontSize: 16,
            }}
          />
        </label>

        {error ? (
          <div
            role="alert"
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(240, 78, 35, 0.12)",
              border: "1px solid rgba(240, 78, 35, 0.35)",
            }}
          >
            <strong style={{ display: "block", marginBottom: 4 }}>
              Couldn’t sign in
            </strong>
            <span style={{ opacity: 0.85 }}>{error}</span>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          style={{
            marginTop: 8,
            padding: "12px 14px",
            borderRadius: 12,
            border: "none",
            cursor: busy ? "not-allowed" : "pointer",
            fontSize: 16,
            fontWeight: 800,
            background: "#FF7900",
            color: "#FFFFFF",
          }}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
