/* ============================================================
   FILE: src/lib/firestore.ts
   PURPOSE: Step 1 session persistence (multi-user)
   ============================================================ */

import { db } from "./firebaseClient";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import type { SessionDoc } from "./types";
import type { Turn } from "./types";

export async function createStep1Session(ownerUid: string, turns: Turn[]) {
  const col = collection(db, "sessions");
  const ref = await addDoc(col, {
    ownerUid,
    step: "step-1",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    turns,
  } satisfies Partial<SessionDoc>);
  return ref.id;
}

export async function loadSession(sessionId: string): Promise<SessionDoc | null> {
  const ref = doc(db, "sessions", sessionId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as SessionDoc;
}

export async function updateSessionTurns(sessionId: string, turns: Turn[]) {
  const ref = doc(db, "sessions", sessionId);
  await updateDoc(ref, { turns, updatedAt: serverTimestamp() });
}

export async function loadLatestStep1SessionId(ownerUid: string) {
  const col = collection(db, "sessions");
  const q = query(
    col,
    where("ownerUid", "==", ownerUid),
    where("step", "==", "step-1"),
    orderBy("updatedAt", "desc"),
    limit(1)
  );
  const snap = await getDocs(q);
  const first = snap.docs[0];
  return first ? first.id : null;
}
