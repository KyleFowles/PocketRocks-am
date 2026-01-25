"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirebaseApp } from "@/lib/firebaseClient";

export default function SignupClient() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError(null);
    setLoading(true);

    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);

      await createUserWithEmailAndPassword(auth, email, password);

      router.push("/thinking");
    } catch (err: any) {
      setError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pr-auth-shell">
      {/* Header */}
      <header className="pr-auth-header">
        <p className="pr-brand">PocketRocks</p>
        <h1 className="pr-hero-title">The default place people go to think.</h1>
        <p className="pr-hero-subtitle">Private by design · Calm by default</p>
      </header>

      {/* Card */}
      <section className="pr-auth-card">
        <h2>Create your account</h2>
        <p className="pr-auth-note">Email and password only. No noise.</p>

        <label>Email</label>
        <input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="pr-auth-hint">Use 6+ characters.</p>

        {error && <p className="pr-error">{error}</p>}

        <button
          className="pr-primary-btn"
          disabled={loading}
          onClick={handleSignup}
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="pr-trust-line">
          No spam. No feeds. Just your private thinking space.
        </p>
      </section>
    </main>
  );
}
