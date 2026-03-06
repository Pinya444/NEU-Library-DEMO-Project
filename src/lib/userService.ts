import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";
import { db } from "./firebase";
import type { NEUUser, UserDoc } from "@/types/user";

const COLLECTION = "users";

export async function getUser(uid: string): Promise<NEUUser | null> {
  const ref  = doc(db, COLLECTION, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { uid, ...(snap.data() as UserDoc) };
}

export async function createUserIfNew(firebaseUser: FirebaseUser): Promise<NEUUser> {
  const ref  = doc(db, COLLECTION, firebaseUser.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return { uid: firebaseUser.uid, ...(snap.data() as UserDoc) };
  }

  const newDoc: UserDoc = {
    email:           firebaseUser.email ?? "",
    fullName:        firebaseUser.displayName ?? "",
    role:            "user",
    college_office:  "",
    isSetupComplete: false,
    isBlocked:       false,
    createdAt:       new Date().toISOString(),
    photoURL:        firebaseUser.photoURL ?? "",
  };

  await setDoc(ref, { ...newDoc, createdAt: serverTimestamp() });
  return { uid: firebaseUser.uid, ...newDoc };
}

export async function completeOnboarding(
  uid: string,
  college_office: string
): Promise<void> {
  const ref = doc(db, COLLECTION, uid);
  await updateDoc(ref, { college_office, isSetupComplete: true });
}

export function isNEUEmail(email: string): boolean {
  return email.toLowerCase().endsWith("@neu.edu.ph");
}
