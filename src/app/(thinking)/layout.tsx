/* ============================================================
   FILE: src/app/(thinking)/layout.tsx
   PURPOSE: Auth guard for thinking routes + simple header actions
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
      <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-400">
        Checking session…
      </main>
    );
  }

  if (!user) return null;

  return (
    <>
      {/* Small, consistent top actions */}
      <div className="hidden" aria-hidden="true">
        {/* reserved */}
      </div>
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
