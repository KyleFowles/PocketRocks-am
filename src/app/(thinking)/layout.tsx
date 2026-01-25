/* ============================================================
   FILE: src/app/(thinking)/layout.tsx
   PURPOSE: Auth guard for thinking routes + simple header actions
   NOTES:
   - Client guard: redirects to /login when no user
   - Keeps UI consistent with white PocketRocks surfaces
   ============================================================ */

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import { listenToAuth, logout } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

export default function ThinkingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenToAuth((u) => {
      if (!u) {
        router.replace("/login");
      } else {
        setUser(u);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  if (loading) {
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

  if (!user) return null;

  return (
    <>
      {/* children render their own ThinkingSurface header; this layout just ensures auth */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button variant="secondary" onClick={handleLogout}>
          Sign out
        </Button>
      </div>
      {children}
    </>
  );
}
