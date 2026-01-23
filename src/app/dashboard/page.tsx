/* ============================================================
   FILE: src/app/dashboard/page.tsx
   PURPOSE:
   - Server-side safety net:
     If signed in, redirect immediately to /thinking.
     If not, redirect to /login?next=/dashboard.
   NOTE:
   - In Next.js 16+, cookies() may return a Promise in some setups,
     so we await it.
   ============================================================ */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "pr_session";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const hasSession = Boolean(cookieStore.get(COOKIE_NAME)?.value);

  if (!hasSession) {
    redirect("/login?next=/dashboard");
  }

  redirect("/thinking");
}
