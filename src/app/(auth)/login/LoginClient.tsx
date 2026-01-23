/* ============================================================
   FILE: src/app/(auth)/login/LoginClient.tsx
   PURPOSE:
   Client login form:
   - Firebase signInWithEmailAndPassword
   - getIdToken()
   - POST /session/login with { idToken }
   - Navigate to nextUrl
   ============================================================ */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebaseClient";

export default function LoginClient({ nextUrl }: { nextUrl: string }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;

    setBusy(true);
    setError(null);

    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);

      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await cred.user.getIdToken(true);

      // IMPORTANT: use your existing endpoint (your logs show /session/login)
      const resp = await fetch("/session/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await resp.json().catch(() => null);

      if (!resp.ok || !data?.ok) {
        const msg =
          typeof data?.error === "string"
            ? data.error
            : `Login session failed (${resp.status})`;
        throw new Error(msg);
      }

      router.replace(nextUrl || "/thinking");
      router.refresh();
    } catch (err: any) {
      setError(typeof err?.message === "string" ? err.message : "Login failed");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-black/20 backdrop-blur-xl shadow-2xl p-8">
        <h1 className="text-3xl font-semibold tracking-tight">Log in</h1>
        <p className="mt-2 text-white/70">Enter your email and password.</p>

        {error ? (
          <div className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm text-white/80">Email</label>
            <input
              className="mt-2 w-full rounded-xl bg-white/90 text-black px-4 py-3 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              inputMode="email"
              disabled={busy}
            />
          </div>

          <div>
            <label className="block text-sm text-white/80">Password</label>
            <input
              className="mt-2 w-full rounded-xl bg-white/90 text-black px-4 py-3 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              disabled={busy}
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-2xl bg-white text-black py-3 font-semibold disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
