/* ============================================================
   FILE: src/app/(auth)/signup/page.tsx
   PURPOSE: Signup page (create account)
   ============================================================ */

"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { signup } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.length >= 6 && !busy;
  }, [email, password, busy]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setBusy(true);
    setError(null);

    try {
      await signup(email.trim(), password);
      // If you want a guaranteed redirect after signup, tell me the route (ex: /thinking)
      // and I’ll wire it in.
    } catch (err: any) {
      setError(err?.message ?? "Could not create account. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen pr-bg">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-[var(--pr-accent)]" />
              <div className="text-lg font-semibold tracking-tight text-white">PocketRocks</div>
            </div>
            <p className="mt-2 text-sm text-white/60">The default place people go to think.</p>
          </div>

          <Link href="/login" className="text-sm font-semibold text-white/75 hover:text-white">
            Login
          </Link>
        </header>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <section className="hidden lg:block">
            <h1 className="text-4xl font-semibold tracking-tight text-white">
              Start your private thinking trail.
              <span className="block text-white/75">Built for clarity.</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/65 max-w-[46ch]">
              Create an account to start your private workspace. You’ll be guided into the first step right after.
            </p>
          </section>

          <section className="pr-card">
            <div className="pr-card-header">
              <div className="text-xs uppercase tracking-[0.18em] text-white/55">New account</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Create your account</h2>
              <p className="mt-2 text-sm text-white/60">
                One account. Your private thinking trail.
              </p>
            </div>

            <form onSubmit={onSubmit} className="p-7 space-y-4">
              <TextField
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(v) => setEmail(v)}
              />

              <TextField
                label="Password"
                type="password"
                autoComplete="new-password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(v) => setPassword(v)}
              />

              {error ? (
                <div className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </div>
              ) : (
                <div className="text-xs text-white/45">
                  By continuing, you’re creating a private workspace designed for clarity and follow-through.
                </div>
              )}

              <Button type="submit" disabled={!canSubmit} busy={busy}>
                {busy ? "Creating..." : "Create account"}
              </Button>

              <div className="pt-2 text-sm text-white/60">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-white underline underline-offset-4 decoration-white/25">
                  Login
                </Link>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
