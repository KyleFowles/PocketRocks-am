/* ============================================================
   FILE: src/lib/firebaseAdmin.ts
   PURPOSE:
   Firebase Admin singleton for server-side auth/session cookies.
   NOTES:
   - Uses service account env vars if present (recommended)
   - Falls back to application default credentials if available
   - Provides getAdminAuth() for route handlers
   ============================================================ */

import "server-only";

import { getApps, initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

/**
 * Supports either:
 * 1) FIREBASE_SERVICE_ACCOUNT (JSON string)  <-- easiest & most reliable
 * OR
 * 2) FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY
 * OR
 * 3) Google ADC (applicationDefault) if available
 */
function initAdmin() {
  if (getApps().length) return getApps()[0];

  // Option 1: single JSON env var
  const json = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (json) {
    const parsed = JSON.parse(json);
    return initializeApp({
      credential: cert(parsed),
    });
  }

  // Option 2: split env vars
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKeyRaw) {
    const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  }

  // Option 3: ADC fallback (works on some local setups / GCP)
  // If this fails, it will throw when used, which is okay.
  return initializeApp({
    credential: applicationDefault(),
  });
}

export function getAdminAuth() {
  initAdmin();
  return getAuth();
}
