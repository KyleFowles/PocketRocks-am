/* ============================================================
   FILE: src/app/page.tsx
   PURPOSE: Root router (redirect based on auth)
   ============================================================ */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { listenToAuth } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const unsub = listenToAuth((user) => {
      router.replace(user ? "/step-1" : "/login");
    });
    return () => unsub();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-400">
      Loading…
    </main>
  );
}
