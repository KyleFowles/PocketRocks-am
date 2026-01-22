/* ============================================================
   FILE: src/app/(auth)/signup/page.tsx
   PURPOSE: Signup page content (NO header here)
   ============================================================ */

"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
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
      // TODO: wire real signup here
      // For now, just simulate account creation:
      window.location.href = "/thinking";
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="auth-grid">
      <section className="auth-left">
        <div className="auth-kicker">NEW ACCOUNT</div>
        <h1 className="auth-h1">Start your private thinking trail</h1>
        <p className="auth-sub">
          One account. Your private workspace. A calm place to get clear and follow through.
        </p>
      </section>

      <section className="auth-right">
        <div className="auth-card">
          <div className="auth-card-top">
            <div className="auth-card-title">Create account</div>
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
              </div>

              <div className="field">
                <div className="label">Password</div>

                <div className="row">
                  <input
                    className="input"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
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
                {loading ? "Creating..." : "Create account"}
              </button>

              <div className="row row-space">
                <div style={{ fontSize: 13, opacity: 0.85 }}>
                  Already have an account?{" "}
                  <Link className="small-link" href="/login">
                    Sign in
                  </Link>
                </div>

                <Link className="small-link" href="/">
                  Back home
                </Link>
              </div>
            </form>
          </div>

          <div className="auth-footer">
            By continuing, you’re creating a private workspace designed to help you clarify what matters
            and commit with confidence.
          </div>
        </div>
      </section>
    </div>
  );
}
