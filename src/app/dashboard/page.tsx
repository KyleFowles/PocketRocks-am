/* ============================================================
   FILE: src/app/dashboard/page.tsx
   PURPOSE: Backward-compatible landing route after auth.
            If anything redirects to /dashboard, send to /thinking.
   ============================================================ */

import { redirect } from "next/navigation";

export default function DashboardPage() {
  redirect("/thinking");
}
