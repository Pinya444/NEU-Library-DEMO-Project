"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { createUserIfNew, getUser, isNEUEmail } from "@/lib/userService";
import type { NEUUser } from "@/types/user";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface UseAuthReturn {
  firebaseUser:     FirebaseUser | null;
  neuUser:          NEUUser | null;
  status:           AuthStatus;
  error:            string | null;
  signInWithGoogle: () => Promise<void>;
  signOut:          () => Promise<void>;
  refreshUser:      () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [neuUser,      setNEUUser]      = useState<NEUUser | null>(null);
  const [status,       setStatus]       = useState<AuthStatus>("loading");
  const [error,        setError]        = useState<string | null>(null);

  const routeUser = useCallback((user: NEUUser) => {
    if (!user.isSetupComplete)     router.push("/onboarding");
    else if (user.role === "admin") router.push("/dashboard/admin");
    else                           router.push("/checkin");
  }, [router]);

  const refreshUser = useCallback(async () => {
    if (!firebaseUser) return;
    const updated = await getUser(firebaseUser.uid);
    if (updated) setNEUUser(updated);
  }, [firebaseUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setFirebaseUser(null); setNEUUser(null);
        setStatus("unauthenticated"); return;
      }
      if (!isNEUEmail(fbUser.email ?? "")) {
        await firebaseSignOut(auth);
        setError("Only @neu.edu.ph emails are allowed.");
        setStatus("unauthenticated"); return;
      }
      setFirebaseUser(fbUser);
      const profile = await createUserIfNew(fbUser);
      setNEUUser(profile);
      setStatus("authenticated");
      routeUser(profile);
    });
    return () => unsubscribe();
  }, [routeUser]);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const msg = (err as { code?: string })?.code;
      if (msg === "auth/popup-closed-by-user") return;
      if (msg === "auth/cancelled-popup-request") return;
      setError("Sign-in failed. Please use your @neu.edu.ph Google account.");
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push("/login");
  };

  return { firebaseUser, neuUser, status, error, signInWithGoogle, signOut, refreshUser };
}
