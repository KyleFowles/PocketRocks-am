/* ============================================================
   FILE: src/components/thinking/ThinkingClientShell.tsx
   PURPOSE: Client shell that protects the Thinking area.
            If user is not authenticated, redirect to login
            with a safe ?next= parameter.

   FIX (PocketRocks v2 thinking routes):
   - Allow /thinking/* (this is the current route system).
   - Still block external/malformed next targets.
   - Still block /dashboard targets.
   - If next is exactly "/thinking", normalize to "/thinking/step-1".
   - Add a tiny auth-stabilization delay before redirecting to login
     to avoid focus-steal/jitter on first load after login.
   ============================================================ */

"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

function buildSafeNextUrl(pathname: string, searchParams: ReadonlyURLSearchParams | null) {
  const qs = searchParams?.toString();
  const raw = qs ? `${pathname}?${qs}` : pathname;

  // Default: Doorway
  if (!raw || !raw.startsWith("/")) return "/";

  // Block external/malformed
  if (raw.startsWith("//")) return "/";
  if (raw.includes("://")) return "/";

  // Never route back to dashboard as a landing target
  if (raw === "/dashboard" || raw.startsWith("/dashboard/")) return "/";

  // Normalize base thinking route to Step 1
  if (raw === "/thinking") return "/thinking/step-1";

  // Allow current thinking routes (/thinking/*)
  // (Do NOT block these; they are not legacy.)
  return raw;
}

export default function ThinkingClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const { user, ready } = useAuth();
  const nextUrl = useMemo(() => buildSafeNextUrl(pathname, sp), [pathname, sp]);

  const redirectTimer = useRef<number | null>(null);

  useEffect(() => {
    // Clear any pending redirect
    if (redirectTimer.current) {
      window.clearTimeout(redirectTimer.current);
      redirectTimer.current = null;
    }

    if (!ready) return;

    // Small delay prevents jitter right after login while auth settles.
    if (!user) {
      redirectTimer.current = window.setTimeout(() => {
        router.replace(`/login?next=${encodeURIComponent(nextUrl)}`);
      }, 120);
      return;
    }

    return () => {
      if (redirectTimer.current) {
        window.clearTimeout(redirectTimer.current);
        redirectTimer.current = null;
      }
    };
  }, [ready, user, router, nextUrl]);

  if (!ready) return null;
  if (!user) return null;

  return <>{children}</>;
}
