/* ============================================================
   FILE: src/app/(thinking)/thinking/layout.tsx
   PURPOSE: Server-side guard for /thinking routes (NO middleware)
            - Reads HttpOnly cookie via async cookies()
            - Redirects to /login if missing
   ============================================================ */

import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "pr_session";

export default async function ThinkingLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const hasSession = Boolean(jar.get(COOKIE_NAME)?.value);

  if (!hasSession) {
    redirect("/login?next=/thinking");
  }

  return <>{children}</>;
}
