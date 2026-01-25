/* ============================================================
   FILE: src/app/thinking/page.tsx
   PURPOSE: Legacy route redirect -> /thinking (canonical route group)
   ============================================================ */

import { redirect } from "next/navigation";

export default function ThinkingRedirectPage() {
  redirect("/thinking");
}
