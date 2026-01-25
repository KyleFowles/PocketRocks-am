/* ============================================================
   FILE: src/app/(thinking)/thinking/page.tsx
   PURPOSE: Always route /thinking -> /thinking/step-1
   ============================================================ */

import { redirect } from "next/navigation";

export default function ThinkingIndexPage() {
  redirect("/thinking/step-1");
}
