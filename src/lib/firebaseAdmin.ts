/* ============================================================
   FILE: src/lib/firebaseAdmin.ts
   PURPOSE: Initialize Firebase Admin SDK (server) safely.
   ============================================================ */

import admin from "firebase-admin";

function must(name: string, v?: string) {
  if (!v) {
    throw new Error(
      `[firebaseAdmin] Missing env var: ${name}. Add it to Vercel Environment Variables and .env.local`
    );
  }
  return v;
}

function normalizePrivateKey(raw: string) {
  // Supports keys pasted with literal \n
  return raw.replace(/\\n/g, "\n");
}

export function getFirebaseAdmin() {
  if (admin.apps.length) return admin.app();

  const projectId = must("FIREBASE_PROJECT_ID", process.env.FIREBASE_PROJECT_ID);
  const clientEmail = must("FIREBASE_CLIENT_EMAIL", process.env.FIREBASE_CLIENT_EMAIL);
  const privateKey = normalizePrivateKey(
    must("FIREBASE_PRIVATE_KEY", process.env.FIREBASE_PRIVATE_KEY)
  );

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return admin.app();
}

export function adminAuth() {
  return getFirebaseAdmin().auth();
}
