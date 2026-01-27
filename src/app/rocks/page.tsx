/* ============================================================
   FILE: src/app/rocks/page.tsx
   PURPOSE: Signed-in Rock Library
            - Requires pr_session
            - Lists user's rocks
            - If none exist -> /thinking
            - Click a rock -> /thinking?rockId=...
   ============================================================ */

import "server-only";

import Link from "next/link";
import { redirect } from "next/navigation";

import { requireUidOrRedirect } from "@/lib/serverSession";
import { adminApp } from "@/lib/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";

export const runtime = "nodejs";

type RockRow = {
  id: string;
  title: string | null;
  status: string | null;
  updatedAtMs: number | null;
  createdAtMs: number | null;
};

function toMillisSafe(v: any): number | null {
  if (v && typeof v.toMillis === "function") return v.toMillis();
  return null;
}

export default async function RocksPage() {
  const uid = await requireUidOrRedirect("/rocks");
  const db = getFirestore(adminApp);

  let rows: RockRow[] = [];

  try {
    const snap = await db
      .collection("rocks")
      .where("ownerUid", "==", uid)
      .orderBy("updatedAt", "desc")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    rows = snap.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        title: typeof data?.title === "string" ? data.title : null,
        status: typeof data?.status === "string" ? data.status : null,
        updatedAtMs: toMillisSafe(data?.updatedAt),
        createdAtMs: toMillisSafe(data?.createdAt),
      };
    });
  } catch {
    const snap = await db
      .collection("rocks")
      .where("ownerUid", "==", uid)
      .limit(50)
      .get();

    rows = snap.docs
      .map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          title: typeof data?.title === "string" ? data.title : null,
          status: typeof data?.status === "string" ? data.status : null,
          updatedAtMs: toMillisSafe(data?.updatedAt),
          createdAtMs: toMillisSafe(data?.createdAt),
        };
      })
      .sort(
        (a, b) =>
          (b.updatedAtMs ?? b.createdAtMs ?? 0) - (a.updatedAtMs ?? a.createdAtMs ?? 0)
      );
  }

  if (!rows.length) {
    redirect("/thinking");
  }

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "56px 18px" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <h1 style={{ fontSize: 44, margin: 0, color: "#fff" }}>Your Rocks</h1>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href="/thinking"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 16px",
              borderRadius: 14,
              fontWeight: 900,
              background: "#FF7900",
              color: "#FFFFFF",
              textDecoration: "none",
            }}
          >
            Create New Rock
          </Link>

          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 16px",
              borderRadius: 14,
              fontWeight: 900,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.16)",
              color: "#FFFFFF",
              textDecoration: "none",
            }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <p style={{ marginTop: 10, opacity: 0.75, color: "#fff", marginBottom: 24 }}>
        Pick a Rock to open.
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        {rows.map((r) => {
          const ts = r.updatedAtMs ?? r.createdAtMs;
          const when = ts ? new Date(ts).toLocaleString() : "—";
          const title = r.title || "Untitled Rock";
          const status = r.status || "active";

          return (
            <Link
              key={r.id}
              href={`/thinking?rockId=${encodeURIComponent(r.id)}`}
              style={{
                display: "block",
                padding: "16px 16px",
                borderRadius: 16,
                textDecoration: "none",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "#fff",
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
                <div style={{ fontWeight: 950, fontSize: 18 }}>{title}</div>
                <div style={{ opacity: 0.7, fontWeight: 800 }}>{status}</div>
                <div style={{ marginLeft: "auto", opacity: 0.65, fontWeight: 700 }}>
                  {when}
                </div>
              </div>

              <div style={{ marginTop: 8, opacity: 0.75 }}>Open this Rock</div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
