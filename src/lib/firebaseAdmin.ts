/* ============================================================
   FILE: src/lib/firebaseAdmin.ts
   PURPOSE: Firebase Admin singleton (server-only)
            - Exports adminAuth (used by /api/session + requireSession)
            - Exports adminDb   (Firestore Admin, for server pages like /dashboard)

   ENV REQUIRED (.env.local):
     FIREBASE_PROJECT_ID
     FIREBASE_CLIENT_EMAIL
     FIREBASE_PRIVATE_KEY   (with \n newlines inside the quoted string)

   ============================================================ */

import "server-only";

import admin from "firebase-admin";

function must(name: string, v: string | undefined) {
  if (!v) {
    throw new Error(`Missing env var ${name}`);
  }
  return v;
}

function normalizePrivateKey(key: string) {
  // Supports both actual newlines and "\n" encoded newlines.
  return key.includes("\\n") ? key.replace(/\\n/g, "\n") : key;
}

function getAdminApp() {
  if (admin.apps.length) return admin.app();

  const projectId = must("FIREBASE_PROJECT_ID", process.env.FIREBASE_PROJECT_ID);
  const clientEmail = must("FIREBASE_CLIENT_EMAIL", process.env.FIREBASE_CLIENT_EMAIL);
  const privateKey = normalizePrivateKey(
    must("FIREBASE_PRIVATE_KEY", process.env.FIREBASE_PRIVATE_KEY)
  );

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export const adminApp = getAdminApp();
export const adminAuth = adminApp.auth();
export const adminDb = adminApp.firestore();
