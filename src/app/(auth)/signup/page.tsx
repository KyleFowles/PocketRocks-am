/* ============================================================
   FILE: src/app/(auth)/signup/page.tsx
   PURPOSE: Signup page content (NO header here)
            Creates Firebase Auth user (client SDK)
   ============================================================ */

"use client";

import React, { useState } from "react";
import Link from "next/link";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 3 && password.length >= 6 && !loading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);

      // Success: keep UX simple for now.
      // Your auth middleware/session work will control where users go next.
      setLoading(false);
      window.location.href = "/login";
    } catch (err: any) {
      console.error("SIGNUP FAILED:", err);
      setError(typeof err?.message === "string" ? err.message : "Signup failed");
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
