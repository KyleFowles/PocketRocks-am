/* ============================================================
   FILE: src/app/dashboard/page.tsx
   PURPOSE: Signed-in dashboard (server-rendered)
            - Requires server session (pr_session)
            - If no rocks: redirect to /thinking/step-1
            - Else show 2 actions:
                1) Create New Rock
                2) Open Existing Rocks
   ============================================================ */

import "server-only";

import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

import { requireSession } from "@/lib/requireSession";
import { adminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

async function ownerHasAnyRocks(uid: string): Promise<boolean> {
  const snap = await adminDb
    .collection("rocks")
    .where("ownerUid", "==", uid)
    .limit(1)
    .get();

  return !snap.empty;
}

export default async function DashboardPage() {
  const { uid } = await requireSession("/dashboard");

  const hasAny = await ownerHasAnyRocks(uid);

  // Per your spec: if there are no Rocks, go straight to /thinking
  if (!hasAny) {
    redirect("/thinking/step-1");
  }

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "48px 16px" }}>
      <h1 style={{ fontSize: 40, margin: "0 0 8px 0" }}>PocketRocks</h1>
      <p style={{ marginTop: 0, opacity: 0.75, marginBottom: 28 }}>
        Choose what you want to do next.
      </p>

      <div style={{ display: "grid", gap: 14, maxWidth: 520 }}>
        <Link
          href="/thinking/step-1"
          style={{
            display: "block",
            textDecoration: "none",
            padding: "14px 16px",
            borderRadius: 14,
            fontSize: 18,
            fontWeight: 900,
            background: "#FF7900",
            color: "#FFFFFF",
            textAlign: "center",
          }}
        >
          Create New Rock
        </Link>

        <Link
          href="/rocks"
          style={{
            display: "block",
            textDecoration: "none",
            padding: "14px 16px",
            borderRadius: 14,
            fontSize: 18,
            fontWeight: 900,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#FFFFFF",
            textAlign: "center",
          }}
        >
          Open Existing Rock
        </Link>
      </div>

      <div style={{ marginTop: 24, opacity: 0.6, fontSize: 13 }}>
        Signed in as UID: <code>{uid}</code>
      </div>
    </main>
  );
}
