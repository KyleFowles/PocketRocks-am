/* ============================================================
   FILE: src/lib/useAuth.ts
   PURPOSE: Client auth hook for PocketRocks
            - Uses Firebase Auth onAuthStateChanged
            - Always resolves { user, ready }
            - Fail-safe: if Firebase init fails, returns ready=true + user=null
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";

export type AuthState = {
  user: User | null;
  ready: boolean;
};

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsub: null | (() => void) = null;

    try {
      const auth = getFirebaseAuth();

      unsub = onAuthStateChanged(
        auth,
        (u) => {
          setUser(u ?? null);
          setReady(true);
        },
        () => {
          setUser(null);
          setReady(true);
        }
      );
    } catch (e) {
      // If Firebase config/env is missing or init fails, do NOT hang.
      setUser(null);
      setReady(true);
    }

    return () => {
      if (unsub) unsub();
    };
  }, []);

  return { user, ready };
}
