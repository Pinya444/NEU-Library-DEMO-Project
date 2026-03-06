import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { BlockAction } from "@/types/user";

const USERS_COL         = "users";
const BLOCK_HISTORY_COL = "blockHistory";

export async function setBlockStatus(
  targetUid: string,
  action: BlockAction
): Promise<void> {
  const userRef = doc(db, USERS_COL, targetUid);
  if (action.isBlocked) {
    await updateDoc(userRef, {
      isBlocked:   true,
      blockReason: action.reason ?? "",
      blockedAt:   new Date().toISOString(),
      blockedBy:   action.adminUid,
    });
  } else {
    await updateDoc(userRef, {
      isBlocked:   false,
      blockReason: "",
      blockedAt:   null,
      blockedBy:   null,
    });
  }
  const historyRef = collection(db, BLOCK_HISTORY_COL, targetUid, "events");
  await addDoc(historyRef, {
    action:    action.isBlocked ? "blocked" : "unblocked",
    reason:    action.reason ?? "",
    adminUid:  action.adminUid,
    timestamp: serverTimestamp(),
  });
}

export async function checkBlockStatus(uid: string): Promise<{
  isBlocked: boolean; blockReason: string;
}> {
  const snap = await getDoc(doc(db, USERS_COL, uid));
  if (!snap.exists()) return { isBlocked: false, blockReason: "" };
  const data = snap.data();
  return {
    isBlocked:   data.isBlocked   ?? false,
    blockReason: data.blockReason ?? "",
  };
}

export interface BlockEvent {
  id:        string;
  action:    "blocked" | "unblocked";
  reason:    string;
  adminUid:  string;
  timestamp: Date;
}

export async function getBlockHistory(uid: string): Promise<BlockEvent[]> {
  const ref  = collection(db, BLOCK_HISTORY_COL, uid, "events");
  const q    = query(ref, orderBy("timestamp", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id:        d.id,
      action:    data.action,
      reason:    data.reason ?? "",
      adminUid:  data.adminUid,
      timestamp: (data.timestamp as Timestamp).toDate(),
    };
  });
}
