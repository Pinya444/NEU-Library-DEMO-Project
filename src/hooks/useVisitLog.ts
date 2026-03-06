"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createVisitLog, getLastVisit } from "@/lib/visitLogService";
import type { NEUUser } from "@/types/user";
import type { VisitLog, VisitReason } from "@/types/visitLog";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface UseVisitLogReturn {
  selectedReason: VisitReason | null;
  lastVisit:      VisitLog | null;
  status:         SubmitStatus;
  error:          string | null;
  setReason:      (r: VisitReason) => void;
  submit:         () => Promise<void>;
  loadLastVisit:  (uid: string) => Promise<void>;
}

export function useVisitLog(user: NEUUser | null): UseVisitLogReturn {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState<VisitReason | null>(null);
  const [lastVisit,      setLastVisit]       = useState<VisitLog | null>(null);
  const [status,         setStatus]          = useState<SubmitStatus>("idle");
  const [error,          setError]           = useState<string | null>(null);

  const setReason = useCallback((r: VisitReason) => {
    setSelectedReason(r); setError(null);
  }, []);

  const loadLastVisit = useCallback(async (uid: string) => {
    try { setLastVisit(await getLastVisit(uid)); }
    catch (err) { console.warn("[useVisitLog]", err); }
  }, []);

  const submit = useCallback(async () => {
    if (!user)           return setError("Session expired. Please sign in again.");
    if (!selectedReason) return setError("Please select a reason for your visit.");
    setStatus("submitting"); setError(null);
    try {
      const logId = await createVisitLog(user, selectedReason);
      router.push(`/welcome?reason=${selectedReason}&logId=${logId}`);
      setStatus("success");
    } catch (err) {
      console.error("[useVisitLog]", err);
      setStatus("error");
      setError("Failed to log your visit. Please try again.");
    }
  }, [user, selectedReason, router]);

  return { selectedReason, lastVisit, status, error, setReason, submit, loadLastVisit };
}
