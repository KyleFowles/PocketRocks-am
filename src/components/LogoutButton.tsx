/* ============================================================
   FILE: src/components/LogoutButton.tsx
   PURPOSE: Sign out by clearing server session cookie
   ============================================================ */

"use client";

import React, { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    if (loading) return;
    setLoading(true);

    try {
      await fetch("/session/logout", { method: "POST" });
    } catch {
      // Ignore — we still redirect
    }

    window.location.href = "/login";
  }

  return (
    <button
      onClick={onLogout}
      disabled={loading}
      className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 disabled:opacity-50"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
