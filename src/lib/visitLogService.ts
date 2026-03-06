import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { NEUUser } from "@/types/user";
import type { VisitLog, VisitLogDoc, VisitReason } from "@/types/visitLog";

const COLLECTION = "logs";

export async function createVisitLog(
  user: NEUUser,
  reason: VisitReason
): Promise<string> {
  const payload = {
    uid:            user.uid,
    userEmail:      user.email,
    fullName:       user.fullName,
    college_office: user.college_office,
    reason,
    timestamp:      serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COLLECTION), payload);
  return ref.id;
}

export async function getLastVisit(uid: string): Promise<VisitLog | null> {
  const q = query(
    collection(db, COLLECTION),
    where("uid", "==", uid),
    orderBy("timestamp", "desc"),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d    = snap.docs[0];
  const data = d.data() as VisitLogDoc;
  return {
    id:             d.id,
    uid:            data.uid,
    userEmail:      data.userEmail,
    fullName:       data.fullName,
    college_office: data.college_office,
    reason:         data.reason,
    timestamp:      (data.timestamp as Timestamp).toDate(),
  };
}

export function formatVisitTime(date: Date): string {
  const time = date.toLocaleTimeString("en-PH", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });
  const day = date.toLocaleDateString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
  });
  return `${time} · ${day}`;
}
