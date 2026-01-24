/* ============================================================
   FILE: src/app/(auth)/signup/SignupClient.tsx

   PocketRocks — Signup Client Component

   Purpose:
   - Safe usage of useSearchParams() inside a client component
   - Eliminates Next.js prerender build error

   ============================================================ */

"use client";

import { useSearchParams } from "next/navigation";

export default function SignupClient() {
  const searchParams = useSearchParams();

  // Optional next redirect param
  const nextUrl = searchParams.get("next") || "/thinking";

  return (
    <main
      style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: "60px 18px",
      }}
    >
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
        Sign Up
      </h1>

      <p style={{ opacity: 0.75, marginBottom: 24 }}>
        Create your PocketRocks account.
      </p>

      <div
        style={{
          borderRadius: 18,
          padding: 18,
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(20,34,51,0.35)",
        }}
      >
        <p style={{ marginBottom: 12 }}>Redirect after signup:</p>

        <code
          style={{
            display: "block",
            padding: 12,
            borderRadius: 12,
            background: "rgba(0,0,0,0.25)",
          }}
        >
          {nextUrl}
        </code>

        <button
          style={{
            marginTop: 16,
            width: "100%",
            padding: 12,
            borderRadius: 12,
            fontWeight: 800,
            background: "#FF7900",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Create Account (placeholder)
        </button>
      </div>
    </main>
  );
}
