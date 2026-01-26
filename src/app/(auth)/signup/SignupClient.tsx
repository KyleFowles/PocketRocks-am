/* ============================================================
   FILE: src/app/(auth)/signup/SignupClient.tsx
   PURPOSE: Signup UI using AuthShell hero + card pattern
            - Correctly uses variant="signup"
            - Creates Firebase user + session cookie
   ============================================================ */

"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import AuthShell from "@/components/ui/AuthShell";

function normalizeNextUrl(raw: string | null): string {
  const v = (raw || "").trim();
  if (!v) return "/thinking";
  if (v.startsWith("/")) return v;
  return "/thinking";
}

async function createSessionCookie(idToken: string) {
  const res = await fetch("/session/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Session login failed.");
  }
}

export default function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextUrl = useMemo(() => normalizeNextUrl(searchParams.get("next")), [searchParams]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const em = email.trim();
    const nm = name.trim();

    if (!em || !password) {
      setError("Enter your email and password.");
      return;
    }

    try {
      setBusy(true);

      const auth = getAuth();
      const cred = await createUserWithEmailAndPassword(auth, em, password);

      if (nm) {
        await updateProfile(cred.user, { displayName: nm });
      }

      const idToken = await cred.user.getIdToken();
      await createSessionCookie(idToken);

      router.replace(nextUrl);
    } catch (err: any) {
      setError(typeof err?.message === "string" ? err.message : "Sign up failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      variant="signup"
      cardTitle="Create account"
      footerLeft={
        <span>
          Already have an account?{" "}
          <a className="pr-auth-link" href={`/login?next=${encodeURIComponent(nextUrl)}`}>
            Sign in
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
          By continuing, you’re creating a private workspace designed to help you clarify what matters and commit with
          confidence.
        </span>
      }
    >
      <form onSubmit={onSubmit}>
        <div className="pr-auth-field">
          <div className="pr-auth-label">Name (optional)</div>
          <input
            className="pr-auth-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Kyle"
            disabled={busy}
          />
        </div>

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
            autoComplete="new-password"
            placeholder="Minimum 6 characters"
            disabled={busy}
          />
        </div>

        {error ? <div className="pr-auth-error">{error}</div> : null}

        <button className="pr-auth-btn" type="submit" disabled={busy}>
          {busy ? "Creating…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
