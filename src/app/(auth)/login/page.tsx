/* ============================================================
   FILE: src/app/(auth)/login/page.tsx
   PURPOSE: Log in (client) -> mint pr_session cookie -> redirect
   ============================================================ */

"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

function friendlyAuthError(code?: string, fallback?: string) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "That email or password is not correct.";
    case "auth/user-not-found":
      return "No account found for that email.";
    case "auth/invalid-email":
      return "That doesn’t look like a valid email address.";
    case "auth/network-request-failed":
      return "Network error. Please try again.";
    default:
      return fallback || "Login failed. Please try again.";
  }
}

export default function LoginPage() {
  const sp = useSearchParams();

  const nextUrl = sp.get("next") || "/thinking";
  const emailPrefill = sp.get("email") || "";

  const [email, setEmail] = useState(emailPrefill);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);
  const canSubmit = normalizedEmail.length > 3 && password.length >= 6 && !loading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password);

      // Get Firebase ID token
      const idToken = await cred.user.getIdToken();

      // Exchange for HttpOnly session cookie
      const resp = await fetch("/session/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => null);
        throw new Error(data?.error || "Session cookie creation failed");
      }

      setLoading(false);

      // Now middleware will allow protected routes
      window.location.href = nextUrl;
    } catch (err: any) {
      const code = typeof err?.code === "string" ? err.code : undefined;
      const msg = friendlyAuthError(code, typeof err?.message === "string" ? err.message : undefined);

      setError(msg);
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white">Log in</h2>
      <p className="mt-2 text-white/70">Enter your email and password.</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm text-white/80">Email</label>
          <input
            className="mt-2 w-full rounded-xl bg-white text-black px-4 py-3 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm text-white/80">Password</label>
          <input
            className="mt-2 w-full rounded-xl bg-white text-black px-4 py-3 outline-none"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={loading}
          />

          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="mt-2 text-sm text-white/70 underline"
            disabled={loading}
          >
            {showPw ? "Hide password" : "Show password"}
          </button>
        </div>

        {error ? (
          <div className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-xl bg-[#FF7900] px-4 py-2 font-bold text-white disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <div className="text-sm text-white/70">
          Need an account?{" "}
          <Link href="/signup" className="font-semibold text-[#FF7900] underline">
            Create one
          </Link>
        </div>
      </form>
    </div>
  );
}
