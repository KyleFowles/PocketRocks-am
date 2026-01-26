/* ============================================================
   FILE: src/components/thinking/ThinkingClientShell.tsx
   PURPOSE:
   - Client-only shell for /thinking routes
   - Enforces auth redirect
   - World-class header: PocketRocks is the hero
   ============================================================ */

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import { listenToAuth, logout } from "@/lib/auth";

export default function ThinkingClientShell({
  children,
}: {
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const nextUrl = useMemo(() => {
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

  if (!ready || !user) {
    return (
      <main className="pr-app-page">
        <div className="pr-container">
          <div className="pr-surface" style={{ maxWidth: 640, margin: "120px auto" }}>
            <div className="pr-surface-header">
              <div className="pr-surface-title">PocketRocks</div>
            </div>
            <div className="pr-surface-body">
              <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.01em" }}>
                Checking session…
              </div>
              <p style={{ marginTop: 8, marginBottom: 0, opacity: 0.78 }}>
                Getting your thinking space ready.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pr-app-page">
      {/* HERO HEADER */}
      <div className="pr-container" style={{ paddingBottom: 0 }}>
        <div
          className="pr-surface"
          style={{
            borderRadius: 22,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <div>
            <div className="pr-brandhero">
              <span className="pr-branddot" />
              <div className="pr-brandword" style={{ fontSize: 26 }}>
                PocketRocks
              </div>
            </div>
            <div className="pr-brandtag">Your place to think</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user.email ? (
              <div style={{ fontSize: 13, opacity: 0.75 }}>{user.email}</div>
            ) : null}

            <button className="pr-pillbtn" onClick={onLogout}>
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="pr-container" style={{ paddingTop: 18 }}>
        {children}
      </div>
    </main>
  );
}
