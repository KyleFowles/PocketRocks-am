/* ============================================================
   FILE: src/app/(auth)/login/LoginClient.tsx
   PURPOSE: Login UI (Client Component)
            - NO useSearchParams()
            - Accepts nextUrl as a prop from the server page
   ============================================================ */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginClient({ nextUrl }: { nextUrl: string }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/session/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Login failed.");
      }

      router.replace(nextUrl || "/");
    } catch (err: any) {
      setError(err?.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "48px auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Log in</h1>
      <p style={{ opacity: 0.8, marginBottom: 24 }}>
        Enter your email and password.
      </p>

      {error ? (
        <div
          style={{
            background: "rgba(255,0,0,0.08)",
            border: "1px solid rgba(255,0,0,0.25)",
            padding: 12,
            borderRadius: 10,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            type="email"
            required
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            type="password"
            required
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "none",
            cursor: busy ? "not-allowed" : "pointer",
            opacity: busy ? 0.7 : 1,
          }}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
