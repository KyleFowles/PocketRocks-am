/* ============================================================
   FILE: src/components/thinking/ThinkingClientShell.tsx
   PURPOSE:
   - Client-only shell for /thinking routes
   - If signed out -> send to /login?next=...
   - If signed in -> allow thinking pages
   ============================================================ */

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import { listenToAuth, logout } from "@/lib/auth";

export default function ThinkingClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const nextUrl = useMemo(() => {
    // Default: if user lands on /thinking, we want them at step-1
    if (pathname === "/thinking") return "/thinking/step-1";
    return pathname || "/thinking/step-1";
  }, [pathname]);

  useEffect(() => {
    const unsub = listenToAuth((u) => {
      setUser(u);
      setReady(true);
    });
    return () => unsub();
  }, []);

  // If not signed in, send to login (once we know auth state)
  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(nextUrl)}`);
    }
  }, [ready, user, router, nextUrl]);

  async function onLogout() {
    await logout();
    router.replace(`/login?next=${encodeURIComponent(nextUrl)}`);
  }

  // While auth is resolving (or redirecting), show a clean holding card
  if (!ready || !user) {
    return (
      <main className="min-h-screen bg-white text-[#142233]">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">
          <div className="w-full rounded-[28px] bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] ring-1 ring-black/5">
            <div className="text-lg font-semibold">Checking session…</div>
            <div className="mt-2 text-sm text-[#445777]">
              Getting your thinking space ready.
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Signed-in shell
  return (
    <div style={{ minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ fontWeight: 700, letterSpacing: 0.2 }}>PocketRocks</div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user?.email ? (
            <div style={{ opacity: 0.8, fontSize: 13 }}>{user.email}</div>
          ) : null}

          <button
            onClick={onLogout}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "transparent",
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Log out
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
