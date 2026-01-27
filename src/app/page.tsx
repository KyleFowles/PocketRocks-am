/* ============================================================
   FILE: src/app/page.tsx
   PURPOSE: Smart Doorway
            - If signed out: show Sign in / Create account
            - If signed in: send user to /dashboard
   ============================================================ */

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

export default function HomePage() {
  const router = useRouter();
  const { user, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (user) router.replace("/dashboard");
  }, [ready, user, router]);

  // While auth is resolving, keep it quiet (no flash)
  if (!ready) return null;

  // Signed in: we’re redirecting to /dashboard
  if (user) return null;

  // Signed out: show auth actions
  return (
    <main style={{ maxWidth: 960, margin: "40px auto", padding: "0 16px" }}>
      <header style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 30, margin: 0 }}>PocketRocks</h1>
        <p style={{ marginTop: 10, opacity: 0.78, lineHeight: 1.45 }}>
          Sign in to start thinking and building Rocks.
        </p>
      </header>

      <section style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link
          href="/login"
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            background: "#FF7900",
            color: "#FFFFFF",
            fontWeight: 800,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Sign in
        </Link>

        <Link
          href="/signup"
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.18)",
            color: "inherit",
            fontWeight: 700,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Create account
        </Link>
      </section>
    </main>
  );
}
