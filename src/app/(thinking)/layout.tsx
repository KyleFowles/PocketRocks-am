/* ============================================================
   FILE: src/app/(thinking)/layout.tsx
   PURPOSE: Layout wrapper + auth gate for /thinking routes
            - If no pr_session cookie, redirect to /login?next=/thinking
   ============================================================ */

import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ThinkingLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const hasSession = Boolean(jar.get("pr_session")?.value);

  if (!hasSession) {
    redirect(`/login?next=${encodeURIComponent("/thinking")}`);
  }

  return <div style={{ minHeight: "100vh" }}>{children}</div>;
}
