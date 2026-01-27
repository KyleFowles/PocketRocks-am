/* ============================================================
   FILE: src/app/(auth)/signup/SignupClient.tsx
   PURPOSE: Client-side signup
            - Creates user via Firebase Auth
            - Writes Firestore user profile doc: users/{uid}
            - Redirects to safe ?next= or "/" default
            - Displays clear Firebase error codes + project debug
   ============================================================ */

"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirestoreDb } from "@/lib/firebaseClient";

function normalizeNextUrl(raw: string | null): string {
  const v = raw ?? "";

  if (!v) return "/";
  if (!v.startsWith("/")) return "/";
  if (v.startsWith("//")) return "/";
  if (v.includes("://")) return "/";

  // Block known trap/legacy targets
  if (v === "/dashboard" || v.startsWith("/dashboard/")) return "/";
  if (v === "/thinking" || v.startsWith("/thinking/")) return "/";

  return v;
}

async function ensureUserProfile(u: User, displayNameInput: string) {
  const db = getFirestoreDb();

  const displayName =
    (displayNameInput || "").trim() || u.displayName || "";

  const ref = doc(db, "users", u.uid);

  await setDoc(
    ref,
    {
      uid: u.uid,
      email: u.email ?? null,
      displayName: displayName || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

function mapFirebaseAuthError(err: any): { title: string; detail: string } {
  const code: string | undefined = err?.code;
  const message: string | undefined = err?.message;

  // Default fallback
  const fallback = {
    title: "Couldn’t create account",
    detail: message || "Sign up failed. Please try again.",
  };

  if (!code) return fallback;

  switch (code) {
    case "auth/email-already-in-use":
      return {
        title: "That email is already registered",
        detail:
          "Try signing in instead. (Firebase treats email addresses as case-insensitive.)",
      };

    case "auth/invalid-email":
      return {
        title: "That email looks invalid",
        detail: "Please check the email address and try again.",
      };

    case "auth/weak-password":
      return {
        title: "Password is too weak",
        detail: "Use a longer password (at least 6+ characters) and try again.",
      };

    case "auth/operation-not-allowed":
      return {
        title: "Email/password sign-up is disabled",
        detail:
          "In Firebase Console → Authentication → Sign-in method, enable Email/Password.",
      };

    case "auth/too-many-requests":
      return {
        title: "Too many attempts",
        detail: "Please wait a bit and try again.",
      };

    default:
      // Keep the real code visible to end the guessing.
      return {
        title: "Couldn’t create account",
        detail: `Firebase error: ${code}${message ? ` — ${message}` : ""}`,
      };
  }
}

export default function SignupClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const nextUrl = useMemo(() => normalizeNextUrl(sp.get("next")), [sp]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ title: string; detail: string } | null>(
    null
  );

  // Debug: confirms which Firebase project your app is using
  const debugProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "(missing)";
  const debugAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "(missing)";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;

    setBusy(true);
    setError(null);

    try {
      const auth = getFirebaseAuth();

      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const displayName = name.trim();
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }

      // Firestore profile doc
      await ensureUserProfile(cred.user, displayName);

      router.replace(nextUrl);
      router.refresh();
    } catch (err: any) {
      setError(mapFirebaseAuthError(err));
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 520, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Create account</h1>
      <p style={{ marginTop: 0, opacity: 0.75, marginBottom: 10 }}>
        After signup, you’ll return to the start screen.
      </p>

      <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 18 }}>
        Debug: projectId=<code>{debugProjectId}</code> • authDomain=
        <code>{debugAuthDomain}</code>
      </div>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Name (optional)</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Kyle"
            style={{
              padding: "12px 12px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.2)",
              fontSize: 16,
            }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            style={{
              padding: "12px 12px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.2)",
              fontSize: 16,
            }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            required
            style={{
              padding: "12px 12px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.2)",
              fontSize: 16,
            }}
          />
        </label>

        {error ? (
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(240, 78, 35, 0.12)",
              border: "1px solid rgba(240, 78, 35, 0.35)",
            }}
          >
            <strong style={{ display: "block", marginBottom: 4 }}>
              {error.title}
            </strong>
            <span style={{ opacity: 0.85 }}>{error.detail}</span>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          style={{
            marginTop: 8,
            padding: "12px 14px",
            borderRadius: 12,
            border: "none",
            cursor: busy ? "not-allowed" : "pointer",
            fontSize: 16,
            fontWeight: 800,
            background: "#FF7900",
            color: "#FFFFFF",
          }}
        >
          {busy ? "Creating…" : "Create account"}
        </button>

        <a
          className="pr-auth-link"
          href={`/login?next=${encodeURIComponent(nextUrl)}`}
          style={{ marginTop: 4, fontWeight: 700, textDecoration: "none" }}
        >
          Already have an account? Sign in
        </a>
      </form>
    </main>
  );
}
