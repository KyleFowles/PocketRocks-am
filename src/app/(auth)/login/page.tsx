/* ============================================================
   FILE: src/app/(auth)/login/page.tsx
   PURPOSE: Login page content (NO header here)
   ============================================================ */

"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const nextPath = useMemo(() => searchParams.get("next") || "/thinking", [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 3 && password.length >= 6 && !loading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // TODO: wire real auth here
      // For now, just simulate a successful login:
      window.location.href = nextPath;
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="auth-grid">
      <section className="auth-left">
        <div className="auth-kicker">LOGIN</div>
        <h1 className="auth-h1">Welcome back</h1>
        <p className="auth-sub">
          Sign in to your private thinking trail. Your work stays yours — and the flow stays calm.
        </p>
      </section>

      <section className="auth-right">
        <div className="auth-card">
          <div className="auth-card-top">
            <div className="auth-card-title">Sign in</div>
          </div>

          <div className="auth-card-body">
            <form className="auth-form" onSubmit={onSubmit}>
              {error ? <div className="error">{error}</div> : null}

              <div className="field">
                <div className="label">Email</div>
                <input
                  className="input"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                />
                <div className="hint">Use your work email if you have one.</div>
              </div>

              <div className="field">
                <div className="row row-space">
                  <div className="label">Password</div>
                </div>

                <div className="row">
                  <input
                    className="input"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="hint">Minimum 6 characters</div>
              </div>

              <button className="btn" type="submit" disabled={!canSubmit}>
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="row row-space">
                <div style={{ fontSize: 13, opacity: 0.85 }}>
                  New here?{" "}
                  <Link className="small-link" href="/signup">
                    Create an account
                  </Link>
                </div>

                <Link className="small-link" href="/">
                  Back home
                </Link>
              </div>
            </form>
          </div>

          <div className="auth-footer">
            By continuing, you’re entering a private workspace designed to help you clarify what matters
            and commit with confidence.
          </div>
        </div>
      </section>
    </div>
  );
}
