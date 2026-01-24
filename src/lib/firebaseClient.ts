/* ============================================================
   FILE: src/lib/firebaseClient.ts
   PURPOSE: Firebase client initialization (Auth, Firestore)
   NOTES:
   - Exports BOTH singleton objects (app/auth/db) AND helper getters
   - Adds a safe runtime debug log to confirm the Firebase project id
   ============================================================ */

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

function assertConfig() {
  const missing: string[] = [];
  for (const [k, v] of Object.entries(firebaseConfig)) {
    if (!v || String(v).trim().length === 0) missing.push(k);
  }
  if (missing.length) {
    // Throwing here is OK because it's a real misconfig, not a normal user flow error.
    throw new Error(
      `Firebase config is missing: ${missing.join(
        ", "
      )}. Check your .env.local NEXT_PUBLIC_FIREBASE_* values.`
    );
  }
}

function initApp(): FirebaseApp {
  assertConfig();
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

// ✅ Singleton exports (what your other files expect)
export const app = initApp();
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// ✅ Tiny debug (helps catch "wrong Firebase project" instantly)
if (typeof window !== "undefined") {
  // This should match the Firebase Console project you think you're using.
  // Example: "pocketrocks-prod" vs "pocketrocks-dev"
  // Remove this once confirmed.
  // eslint-disable-next-line no-console
  console.log("PocketRocks Firebase project:", app.options.projectId);
}

// ✅ Backward-compatible helper functions (keep your existing API)
export function getFirebaseApp() {
  return app;
}

export function getFirebaseAuth() {
  return auth;
}

export function getFirebaseDb() {
  return db;
}
