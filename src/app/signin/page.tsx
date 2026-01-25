/* ============================================================
   FILE: src/app/signin/page.tsx
   PURPOSE: Legacy route redirect -> /login
   ============================================================ */

import { redirect } from "next/navigation";

export default function SignInRedirectPage() {
  redirect("/login");
}
