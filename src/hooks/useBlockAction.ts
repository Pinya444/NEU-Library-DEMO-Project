"use client";

import { useState, useCallback } from "react";
import { setBlockStatus } from "@/lib/blockService";
import { useAuth } from "@/hooks/useAuth";
import type { UserSearchResult } from "@/types/analytics";

type ModalState =
  | { open: false }
  | { open: true; user: UserSearchResult; intent: "block" | "unblock" };

type OnSuccessCallback = (uid: string, blocked: boolean) => void;

export function useBlockAction(onSuccess?: OnSuccessCallback) {
  const { neuUser } = useAuth();
  const [modal,      setModal]      = useState<ModalState>({ open: false });
  const [reason,     setReason]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const openBlock   = useCallback((user: UserSearchResult) => { setReason(""); setError(null); setModal({ open:true, user, intent:"block" }); }, []);
  const openUnblock = useCallback((user: UserSearchResult) => { setReason(""); setError(null); setModal({ open:true, user, intent:"unblock" }); }, []);
  const closeModal  = useCallback(() => { setModal({ open:false }); setReason(""); setError(null); }, []);

  const confirmAction = useCallback(async () => {
    if (!modal.open || !neuUser) return;
    const { user, intent } = modal;
    if (intent==="block" && !reason.trim()) { setError("Please provide a reason for blocking this user."); return; }
    setSubmitting(true); setError(null);
    try {
      await setBlockStatus(user.uid, { isBlocked: intent==="block", reason: reason.trim(), adminUid: neuUser.uid });
      onSuccess?.(user.uid, intent==="block");
      closeModal();
    } catch (err) { console.error(err); setError("Action failed. Please try again."); }
    finally { setSubmitting(false); }
  }, [modal, neuUser, reason, onSuccess, closeModal]);

  return { modal, reason, setReason, submitting, error, openBlock, openUnblock, closeModal, confirmAction };
}
