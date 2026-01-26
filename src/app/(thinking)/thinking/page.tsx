/* ============================================================
   FILE: src/app/(thinking)/thinking/page.tsx
   PURPOSE: Entry guard for /thinking
   ============================================================ */

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const COOKIE_NAME = "pr_session";

export default async function ThinkingEntry() {
  const jar = await cookies();
  const hasSession = Boolean(jar.get(COOKIE_NAME)?.value);

  if (!hasSession) {
    redirect("/login?next=/thinking");
  }

  redirect("/thinking/step-1");
}
