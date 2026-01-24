/* ============================================================
   FILE: src/lib/firebaseClient.ts
   PURPOSE: Initialize Firebase Client SDK (browser) safely.
   ============================================================ */

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

function must(name: string, v?: string) {
  if (!v) {
    throw new Error(
      `[firebaseClient] Missing env var: ${name}. Add it to Vercel Environment Variables and .env.local`
    );
  }
  return v;
}

const firebaseConfig = {
  apiKey: must("NEXT_PUBLIC_FIREBASE_API_KEY", process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: must("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: must("NEXT_PUBLIC_FIREBASE_PROJECT_ID", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  appId: must("NEXT_PUBLIC_FIREBASE_APP_ID", process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

export const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
