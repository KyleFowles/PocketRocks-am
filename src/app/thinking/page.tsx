/* ============================================================
   FILE: src/app/thinking/page.tsx
   PURPOSE:
   Route alias for legacy links that go to "/thinking".

   NOTE:
   "(thinking)" is a Route Group and does NOT create the /thinking path.
   Your real thinking entry route is "/step-1".
   ============================================================ */

import { redirect } from "next/navigation";

export default function ThinkingAliasPage() {
  redirect("/step-1");
}
