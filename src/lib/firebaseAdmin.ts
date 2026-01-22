/* ============================================================
   FILE: src/lib/firebaseAdmin.ts
   PURPOSE: Firebase Admin init (server) for session cookies
   ============================================================ */

import admin from "firebase-admin";

function getPrivateKey() {
  const k = process.env.FIREBASE_PRIVATE_KEY;
  if (!k) return undefined;
  // Firebase private key in env usually needs newline fixes
  return k.replace(/\\n/g, "\n");
}

export function getFirebaseAdmin() {
  if (admin.apps.length) return admin.app();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin env vars. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY."
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return admin.app();
}

export function getAdminAuth() {
  getFirebaseAdmin();
  return admin.auth();
}
