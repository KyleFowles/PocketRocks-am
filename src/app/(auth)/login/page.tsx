/* ============================================================
   FILE: src/app/(auth)/login/page.tsx
   PURPOSE: Login page (server) that safely reads ?next=
            and passes it to the client login component.

   IMPORTANT:
   - /thinking was removed, so the default landing route is "/".
   ============================================================ */

import LoginClient from "./LoginClient";

type SearchParams = Record<string, string | string[] | undefined>;

function normalizeNext(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;

  // Default: go to the PocketRocks doorway/home
  if (!value) return "/";

  // Only allow internal paths
  if (!value.startsWith("/")) return "/";
  if (value.startsWith("//")) return "/";
  if (value.includes("://")) return "/";

  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  // Next.js App Router can provide this as an object or as a Promise
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const nextUrl = normalizeNext(sp.next);

  return <LoginClient nextUrl={nextUrl} />;
}
