/* ============================================================
   FILE: src/app/(auth)/login/LoginClient.tsx
   PURPOSE: Client login UI + redirect.
            Uses useSearchParams() safely under Suspense.
   ============================================================ */

"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// NOTE: Your project likely initializes Firebase elsewhere.
// If you have a specific app initializer you use, keep it.
// We intentionally do NOT import a missing symbol here.

function normalizeNextUrl(raw: string | null): string {
  const v = (raw || "").trim();
  if (!v) return "/thinking";
  if (v.startsWith("/")) return v;
  return "/thinking";
}

export default function LoginClient(props: { nextUrl?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextUrl = useMemo(() => {
    // Priority: explicit prop > query string > default
    if (typeof props.nextUrl === "string" && props.nextUrl.trim()) {
      return normalizeNextUrl(props.nextUrl);
    }
    return normalizeNextUrl(searchParams.get("next"));
  }, [props.nextUrl, searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const em = email.trim();
    if (!em || !password) {
      setError("Enter your email and password.");
      return;
    }

    try {
      setBusy(true);

      const auth = getAuth();
      await signInWithEmailAndPassword(auth, em, password);

      router.replace(nextUrl);
    } catch (err: any) {
      const msg =
        typeof err?.message === "string"
          ? err.message
          : "Sign-in failed. Please try again.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.title}>Sign in</div>
          <div style={styles.subtitle}>Welcome back.</div>
        </div>

        <form onSubmit={onSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              disabled={busy}
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              disabled={busy}
            />
          </label>

          {error ? <div style={styles.error}>{error}</div> : null}

          <button type="submit" style={primaryBtn(busy)} disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>

          <div style={styles.hint}>
            After sign-in, you’ll go to: <span style={styles.mono}>{nextUrl}</span>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
  },
  card: {
    width: "100%",
    maxWidth: 520,
    borderRadius: 18,
    border: "1px solid rgba(229,232,235,0.10)",
    background: "rgba(20,34,51,0.35)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: 0.1,
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.8,
    marginTop: 4,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 13,
    fontWeight: 700,
  },
  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(229,232,235,0.14)",
    background: "rgba(10,16,24,0.55)",
    color: "rgba(229,232,235,0.96)",
    outline: "none",
    fontSize: 14,
  },
  error: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(240,78,35,0.35)",
    background: "rgba(240,78,35,0.10)",
    color: "rgba(229,232,235,0.96)",
    fontSize: 13,
    lineHeight: 1.35,
  },
  hint: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.75,
    lineHeight: 1.35,
  },
  mono: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 12,
    opacity: 0.95,
  },
};

function primaryBtn(disabled: boolean): React.CSSProperties {
  return {
    padding: "10px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,121,0,0.38)",
    background: disabled ? "rgba(255,121,0,0.10)" : "#FF7900",
    color: "#FFFFFF",
    fontWeight: 900,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.75 : 1,
    boxShadow: disabled ? "none" : "0 10px 26px rgba(255,121,0,0.22)",
  };
}
