/* ============================================================
   FILE: src/app/dashboard/page.tsx
   PURPOSE:
   - Server-side safety net:
     If signed in, redirect immediately to /thinking.
     If not, redirect to /login?next=/dashboard.
   NOTE:
   - Middleware should handle this first, but this keeps behavior
     correct even if middleware is bypassed or misconfigured.
   ============================================================ */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "pr_session";

export default function DashboardPage() {
  const cookieStore = cookies();
  const hasSession = Boolean(cookieStore.get(COOKIE_NAME)?.value);

  if (!hasSession) {
    redirect("/login?next=/dashboard");
  }

  redirect("/thinking");
}
