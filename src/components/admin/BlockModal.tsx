"use client";

import { useEffect, useRef } from "react";
import type { UserSearchResult } from "@/types/analytics";

const QUICK_REASONS = [
  "Violation of library rules",
  "Unpaid fines or dues",
  "Disruptive behavior",
  "Unauthorized access attempt",
  "Lost or damaged library property",
];

export default function BlockModal({ open, user, intent, reason, onReasonChange, submitting, error, onConfirm, onClose }: {
  open: boolean; user: UserSearchResult | null; intent: "block"|"unblock";
  reason: string; onReasonChange: (r: string) => void;
  submitting: boolean; error: string | null;
  onConfirm: () => void; onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { if (open) setTimeout(()=>inputRef.current?.focus(),100); }, [open]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key==="Escape" && !submitting) onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, submitting, onClose]);

  if (!open || !user) return null;
  const isBlock = intent==="block";

  return (
    <div ref={backdropRef}
         onClick={(e)=>{ if (e.target===backdropRef.current && !submitting) onClose(); }}
         className="fixed inset-0 z-50 flex items-center justify-center px-4"
         style={{ background:"rgba(26,10,15,0.6)", backdropFilter:"blur(4px)" }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
           style={{ animation:"modalPop 0.25s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <div className="px-6 py-5 flex items-start gap-4"
             style={{ background:isBlock?"linear-gradient(135deg,#FEF2F2,#FFF7F7)":"linear-gradient(135deg,#F0FDF4,#F7FFF8)" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 mt-0.5"
               style={{ background:isBlock?"#FEE2E2":"#DCFCE7" }}>
            {isBlock?"⊘":"✓"}
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900 text-base">{isBlock?"Block User":"Unblock User"}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{isBlock?"This will prevent them from completing check-in.":"This will restore their library access."}</p>
          </div>
          {!submitting && <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-2">×</button>}
        </div>
        <div className="px-6 py-4 bg-gray-50 border-y border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
               style={{ background:"linear-gradient(135deg,#7B1C2E,#C9A84C)" }}>
            {user.fullName?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-800 truncate">{user.fullName}</div>
            <div className="text-xs text-gray-400 truncate">{user.email}</div>
            <div className="text-xs text-gray-400 truncate">{user.college_office}</div>
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          {isBlock && (
            <>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Quick select reason</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REASONS.map((r) => (
                    <button key={r} onClick={()=>onReasonChange(r)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-150
                              ${reason===r?"border-red-300 bg-red-50 text-red-700 font-medium":"border-gray-200 bg-white text-gray-600 hover:border-red-200"}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                  Reason <span className="text-red-400">*</span>
                </label>
                <textarea ref={inputRef} value={reason} onChange={(e)=>onReasonChange(e.target.value)}
                          rows={3} placeholder="Describe the reason for blocking this user…"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700
                                     placeholder:text-gray-400 resize-none focus:outline-none focus:border-red-300"/>
              </div>
            </>
          )}
          {!isBlock && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
              <span className="text-green-500 text-lg mt-0.5">ℹ️</span>
              <p className="text-sm text-green-800">
                Unblocking <strong>{user.fullName}</strong> will immediately restore their ability to check in.
                Their block history will be preserved for audit purposes.
              </p>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              ⚠️ {error}
            </div>
          )}
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button onClick={onClose} disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={submitting||(isBlock&&!reason.trim())}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${isBlock?"bg-red-500 hover:bg-red-600":"bg-green-600 hover:bg-green-700"}`}>
            {submitting && (
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            )}
            {submitting?(isBlock?"Blocking…":"Unblocking…"):(isBlock?"Confirm Block":"Confirm Unblock")}
          </button>
        </div>
      </div>
    </div>
  );
}
