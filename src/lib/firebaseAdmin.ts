/* ============================================================
   FILE: src/lib/firebaseAdmin.ts
   PURPOSE: Firebase Admin initialization (server-only)
   NOTES:
   - Used to verify Firebase ID tokens and mint session cookies
   - Requires env vars:
       FIREBASE_PROJECT_ID
       FIREBASE_CLIENT_EMAIL
       FIREBASE_PRIVATE_KEY
   ============================================================ */

import "server-only";

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim().length === 0) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

function initAdmin(): App {
  if (getApps().length) return getApps()[0]!;

  const projectId = requireEnv("FIREBASE_PROJECT_ID");
  const clientEmail = requireEnv("FIREBASE_CLIENT_EMAIL");
  const privateKey = requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export const adminApp = initAdmin();
export const adminAuth = getAuth(adminApp);
