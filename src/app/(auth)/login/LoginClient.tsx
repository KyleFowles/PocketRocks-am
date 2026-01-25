/* ============================================================
   FILE: src/app/(auth)/login/LoginClient.tsx
   PURPOSE: Tailwind login UI using Firebase Auth, then mint pr_session cookie.
   ============================================================ */

"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebaseClient";

import AuthShell from "@/components/ui/AuthShell";
import { ErrorBox, Field, PrimaryButton, TextInput } from "@/components/ui/FormBits";

function safeMsg(e: any, fallback: string) {
  const m = typeof e?.message === "string" ? e.message : "";
  return m || fallback;
}

export default function LoginClient({ nextUrl }: { nextUrl: string }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.length > 0 && !busy;
  }, [email, password, busy]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setBusy(true);
    setError("");

    try {
      // 1) Sign in via Firebase client SDK
      const cred = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      const idToken = await cred.user.getIdToken();

      // 2) Mint session cookie via server route
      const r = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data?.ok) {
        throw new Error(data?.error || "Session cookie failed");
      }

      // 3) Redirect only after success
      router.replace(nextUrl || "/thinking");
    } catch (e: any) {
      setError(safeMsg(e, "Login failed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Log in to continue. If you don’t have an account yet, create one first."
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <Field label="Email">
          <TextInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            disabled={busy}
          />
        </Field>

        <Field label="Password">
          <TextInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={busy}
          />
        </Field>

        {error ? <ErrorBox message={error} /> : null}

        <PrimaryButton type="submit" disabled={!canSubmit}>
          {busy ? "Signing in…" : "Sign in"}
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}
