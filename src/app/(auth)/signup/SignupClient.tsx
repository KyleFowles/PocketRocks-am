/* ============================================================
   FILE: src/app/(auth)/signup/SignupClient.tsx
   PURPOSE: Signup UI (dark gradient + glass card)
   ============================================================ */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/ui/AuthShell";
import {
  ErrorBox,
  InlineRow,
  PasswordField,
  PrimaryButton,
  TextField,
} from "@/components/ui/FormBits";

import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebaseClient";

export default function SignupClient() {
  const router = useRouter();

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
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/thinking");
    } catch (e: any) {
      setError(e?.message || "Could not create account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      kicker="NEW ACCOUNT"
      title={
        <>
          Start your private
          <br />
          thinking trail
        </>
      }
      subtitle="One account. Your private workspace. A calm place to get clear and follow through."
      cardTitle="Create account"
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
        placeholder="Minimum 6 characters"
        autoComplete="new-password"
        hint="Minimum 6 characters"
      />

      <PrimaryButton disabled={busy} onClick={onSubmit}>
        {busy ? "Creating…" : "Create account"}
      </PrimaryButton>

      <InlineRow
        left={
          <span className="pr-muted">
            Already have an account?{" "}
            <a className="pr-link" href="/login">
              Sign in
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
        By continuing, you’re creating a private workspace designed to help you
        clarify what matters and commit with confidence.
      </div>
    </AuthShell>
  );
}
