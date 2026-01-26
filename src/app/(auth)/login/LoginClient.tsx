/* ============================================================
   FILE: src/app/(auth)/login/LoginClient.tsx
   PURPOSE: Login UI using AuthShell hero + card pattern
   ============================================================ */

"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AuthShell from "@/components/ui/AuthShell";

function normalizeNextUrl(raw: string | null): string {
  const v = (raw || "").trim();
  if (!v) return "/thinking";
  if (v.startsWith("/")) return v;
  return "/thinking";
}

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextUrl = useMemo(() => normalizeNextUrl(searchParams.get("next")), [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const em = email.trim();
    if (!em || !password) {
      setError("Enter your email and password.");
      return;
    }

    try {
      setBusy(true);
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, em, password);
      router.replace(nextUrl);
    } catch (err: any) {
      setError(typeof err?.message === "string" ? err.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      variant="login"
      cardTitle="Sign in"
      footerLeft={
        <span>
          New here?{" "}
          <a className="pr-auth-link" href={`/signup?next=${encodeURIComponent(nextUrl)}`}>
            Create account
          </a>
        </span>
      }
      footerRight={
        <a className="pr-auth-link" href="/">
          Back home
        </a>
      }
      finePrint={
        <span>
          By continuing, you’re signing in to your private workspace designed to help you clarify what matters and
          commit with confidence.
        </span>
      }
    >
      <form onSubmit={onSubmit}>
        <div className="pr-auth-field">
          <div className="pr-auth-label">Email</div>
          <input
            className="pr-auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@company.com"
            disabled={busy}
          />
        </div>

        <div className="pr-auth-field">
          <div className="pr-auth-label">Password</div>
          <input
            className="pr-auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Your password"
            disabled={busy}
          />
        </div>

        {error ? <div className="pr-auth-error">{error}</div> : null}

        <button className="pr-auth-btn" type="submit" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
