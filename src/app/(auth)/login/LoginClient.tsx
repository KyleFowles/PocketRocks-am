/* ============================================================
   FILE: src/app/(auth)/login/LoginClient.tsx
   PURPOSE: Login UI using premium AuthShell
   ============================================================ */

"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AuthShell from "@/components/ui/AuthShell";
import { getFirebaseApp } from "@/lib/firebaseClient";

export default function LoginClient({ nextUrl }: { nextUrl: string }) {
  const router = useRouter();
  const sp = useSearchParams();

  const resolvedNext = useMemo(() => {
    const raw = sp?.get("next");
    if (typeof raw === "string" && raw.startsWith("/")) return raw;
    if (nextUrl?.startsWith("/")) return nextUrl;
    return "/thinking";
  }, [sp, nextUrl]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;

    setErr(null);
    setBusy(true);

    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);

      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await cred.user.getIdToken();

      const res = await fetch("/session/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Login failed");
      }

      router.replace(resolvedNext);
    } catch (e: any) {
      setErr(typeof e?.message === "string" ? e.message : "Login failed");
      setBusy(false);
    }
  }

  return (
    <AuthShell
      mode="login"
      title="Welcome back."
      subtitle="Pick up where you left off. One calm step at a time."
      cardTitle="Sign in"
    >
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontSize: 13, opacity: 0.85 }}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.com"
            style={{
              height: 46,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.20)",
              color: "rgba(255,255,255,0.92)",
              padding: "0 14px",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontSize: 13, opacity: 0.85 }}>Password</label>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              type={show ? "text" : "password"}
              placeholder="Your password"
              style={{
                flex: 1,
                height: 46,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.20)",
                color: "rgba(255,255,255,0.92)",
                padding: "0 14px",
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              style={{
                height: 46,
                padding: "0 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.86)",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {err ? (
          <div
            style={{
              borderRadius: 12,
              border: "1px solid rgba(255,121,0,0.35)",
              background: "rgba(255,121,0,0.08)",
              padding: "10px 12px",
              fontSize: 13,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {err}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          style={{
            height: 48,
            borderRadius: 14,
            border: "1px solid rgba(255,121,0,0.35)",
            background:
              "linear-gradient(180deg, rgba(255,121,0,0.92), rgba(240,78,35,0.78))",
            color: "#ffffff",
            fontWeight: 900,
            letterSpacing: 0.2,
            cursor: busy ? "not-allowed" : "pointer",
            opacity: busy ? 0.7 : 1,
            boxShadow: "0 16px 40px rgba(255,121,0,0.12)",
          }}
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
