/* ============================================================
   FILE: src/lib/firebaseClient.ts
   PURPOSE: Firebase client initialization (Auth, Firestore)
   NOTES:
   - Exports BOTH singleton objects (app/auth/db) AND helper getters
   - Fixes build errors where other modules import { auth } / { db }
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

function initApp(): FirebaseApp {
  // Only initialize once (prevents Next.js dev hot-reload duplicates)
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

// ✅ Singleton exports (what your other files expect)
export const app = initApp();
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

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
