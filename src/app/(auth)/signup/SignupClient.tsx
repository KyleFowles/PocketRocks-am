/* ============================================================
   FILE: src/app/(auth)/signup/SignupClient.tsx
   PURPOSE: Signup UI using premium AuthShell (aligned to Login)
            - Reads ?next= (defaults to /thinking)
            - Creates Firebase user
            - Exchanges ID token for session cookie via /session/login
            - Redirects to resolved next route
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

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Session login failed.");
  }
}

export default function SignupClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const nextUrl = useMemo(() => normalizeNextUrl(sp.get("next")), [sp]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;

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
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Create your account."
      subtitle="Start a private workspace. One calm step at a time."
      cardTitle="Create account"
      footnote={
        <span>
          Already have an account?{" "}
          <a className="pr-auth-link" href={`/login?next=${encodeURIComponent(nextUrl)}`}>
            Sign in
          </a>
          {" · "}
          <a className="pr-auth-link" href="/">
            Back home
          </a>
        </span>
      }
    >
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <div className="pr-auth-field" style={{ display: "grid", gap: 6 }}>
          <div className="pr-auth-label" style={{ fontSize: 13, opacity: 0.85 }}>
            Name (optional)
          </div>
          <input
            className="pr-auth-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Kyle"
            disabled={busy}
          />
        </div>

        <div className="pr-auth-field" style={{ display: "grid", gap: 6 }}>
          <div className="pr-auth-label" style={{ fontSize: 13, opacity: 0.85 }}>
            Email
          </div>
          <input
            className="pr-auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.com"
            disabled={busy}
          />
        </div>

        <div className="pr-auth-field" style={{ display: "grid", gap: 6 }}>
          <div className="pr-auth-label" style={{ fontSize: 13, opacity: 0.85 }}>
            Password
          </div>
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
