/* ============================================================
   FILE: src/app/(auth)/signup/page.tsx
   PURPOSE:
   Signup page content (NO header here)
   - Creates Firebase Auth user (client SDK)
   - Immediately mints pr_session cookie via POST /session/login
   - Redirects to next (or /thinking)
   ============================================================ */

"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

function friendlySignupError(code?: string, fallback?: string) {
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already in use. Try logging in instead.";
    case "auth/invalid-email":
      return "That doesn’t look like a valid email address.";
    case "auth/weak-password":
      return "That password is too weak. Please use at least 6 characters.";
    case "auth/network-request-failed":
      return "Network error. Please try again.";
    default:
      return fallback || "Signup failed. Please try again.";
  }
}

export default function SignupPage() {
  const sp = useSearchParams();

  const nextUrl = sp.get("next") || "/thinking";

  const [email, setEmail] = useState("");
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
      // 1) Create user in Firebase Auth (client)
      const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);

      // 2) Get Firebase ID token
      const idToken = await cred.user.getIdToken();

      // 3) Exchange for HttpOnly session cookie
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

      // 4) Go to app (middleware will allow because pr_session now exists)
      window.location.href = nextUrl;
    } catch (err: any) {
      console.error("SIGNUP FAILED:", err);

      const code = typeof err?.code === "string" ? err.code : undefined;
      const msg = friendlySignupError(code, typeof err?.message === "string" ? err.message : undefined);

      setError(msg);
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white">Create your account</h2>

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
            autoComplete="new-password"
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
          className="w-full rounded-xl bg-[#FF7900] py-3 font-bold text-white disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        <div className="text-sm text-white/70">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-white underline">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
