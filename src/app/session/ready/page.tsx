/* ============================================================
   FILE: src/app/session/ready/page.tsx
   PURPOSE: Post-login handoff page
            - Server-side session gate
            - Redirects to ?next= (safe) once cookie is present
   ============================================================ */

import "server-only";

import { redirect } from "next/navigation";
import { requireSession } from "@/lib/requireSession";

export const runtime = "nodejs";

function safeNext(raw: string | null): string {
  const v = (raw || "").trim();
  if (!v) return "/dashboard";
  if (!v.startsWith("/")) return "/dashboard";
  if (v.startsWith("//")) return "/dashboard";
  if (v.includes("://")) return "/dashboard";
  return v;
}

export default async function SessionReadyPage({
  searchParams,
}: {
  searchParams?: { next?: string } | Promise<{ next?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const nextUrl = safeNext(sp.next ?? null);

  // If no cookie (or invalid), this will redirect to login
  await requireSession("/session/ready");

  // Cookie is valid -> go where user intended
  redirect(nextUrl);
}
