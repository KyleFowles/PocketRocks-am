/* ============================================================
   FILE: src/app/(auth)/login/LoginClient.tsx
   PURPOSE: Login UI matching the signup screen
   ============================================================ */

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/ui/AuthShell";
import {
  ErrorBox,
  InlineRow,
  PasswordField,
  PrimaryButton,
  TextField,
} from "@/components/ui/FormBits";

import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebaseClient";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams?.get("next") || "/thinking";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    setBusy(true);

    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      router.push(next);
    } catch (e: any) {
      setError(e?.message || "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      kicker="WELCOME BACK"
      title={
        <>
          Return to your
          <br />
          thinking trail
        </>
      }
      subtitle="Sign in to your private workspace. Keep your thinking clear, calm, and consistent."
      cardTitle="Sign in"
    >
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@company.com"
        autoComplete="email"
      />

      <PasswordField
        label="Password"
        value={password}
        onChange={setPassword}
        placeholder="Your password"
        autoComplete="current-password"
        hint=" "
      />

      <PrimaryButton disabled={busy} onClick={onSubmit}>
        {busy ? "Signing in…" : "Sign in"}
      </PrimaryButton>

      <InlineRow
        left={
          <span className="pr-muted">
            New here?{" "}
            <a className="pr-link" href="/signup">
              Create account
            </a>
          </span>
        }
        right={
          <a className="pr-link" href="/">
            Back home
          </a>
        }
      />

      <ErrorBox message={error} />

      <div className="pr-card-footer">
        Private by design. Calm by default. Your thinking stays yours.
      </div>
    </AuthShell>
  );
}
