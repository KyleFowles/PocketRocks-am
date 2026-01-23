/* ============================================================
   FILE: src/app/(auth)/login/page.tsx
   PURPOSE:
   Next.js 16 fix:
   - searchParams is a Promise -> must await in server component
   Login flow:
   - Firebase email/password sign-in
   - Fetch Firebase idToken
   - POST to /session/login with { idToken }
   - Redirect to ?next=... or /thinking
   ============================================================ */

import React from "react";
import LoginClient from "./LoginClient";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function pickNextUrl(searchParams: Record<string, string | string[] | undefined>) {
  const raw = searchParams?.next;

  // Support ?next=/path or ?next=/path&next=/other
  const next = Array.isArray(raw) ? raw[0] : raw;

  // Only allow internal paths
  if (!next || typeof next !== "string") return "/thinking";
  if (!next.startsWith("/")) return "/thinking";
  if (next.startsWith("//")) return "/thinking";

  return next;
}

export default async function LoginPage(props: PageProps) {
  const sp = await props.searchParams;
  const nextUrl = pickNextUrl(sp);

  return <LoginClient nextUrl={nextUrl} />;
}
