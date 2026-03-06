"use client";

import { useEffect, useState } from "react";
import AuthGuard     from "@/components/AuthGuard";
import ReasonCard    from "@/components/ReasonCard";
import AccessDenied  from "@/components/ui/AccessDenied";
import { useAuth }      from "@/hooks/useAuth";
import { useVisitLog }  from "@/hooks/useVisitLog";
import { checkBlockStatus } from "@/lib/blockService";
import { VISIT_REASONS, type VisitReason } from "@/types/visitLog";
import { formatVisitTime } from "@/lib/visitLogService";

const REASON_META: Record<VisitReason,{icon:string;description:string}> = {
  "Reading":      { icon:"📖", description:"Browse books, magazines, or journals" },
  "Research":     { icon:"🔬", description:"Academic or thesis research work"     },
  "Computer Use": { icon:"💻", description:"Use library workstations or Wi-Fi"    },
  "Studying":     { icon:"✏️", description:"Individual or group study sessions"   },
};

type BlockCheckState = {status:"loading"} | {status:"allowed"} | {status:"blocked";reason:string};

function CheckInContent() {
  const { neuUser } = useAuth();
  const { selectedReason, lastVisit, status: submitStatus, error, setReason, submit, loadLastVisit } = useVisitLog(neuUser);
  const [blockCheck, setBlockCheck] = useState<BlockCheckState>({ status:"loading" });

  useEffect(() => {
    if (!neuUser?.uid) return;
    (async () => {
      try {
        const { isBlocked, blockReason } = await checkBlockStatus(neuUser.uid);
        if (isBlocked) { setBlockCheck({ status:"blocked", reason:blockReason }); }
        else { setBlockCheck({ status:"allowed" }); loadLastVisit(neuUser.uid); }
      } catch { setBlockCheck({ status:"allowed" }); loadLastVisit(neuUser.uid!); }
    })();
  }, [neuUser?.uid, loadLastVisit]);

  if (blockCheck.status==="loading") {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background:"linear-gradient(160deg,#FAF6F0,#F5EDE4)" }}>
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">📖</div>
          <p className="text-sm text-gray-400 uppercase tracking-wider">Verifying access…</p>
        </div>
      </div>
    );
  }

  if (blockCheck.status==="blocked") return <AccessDenied blockReason={blockCheck.reason}/>;

  const isSubmitting = submitStatus==="submitting";
  const now = new Date();
  const greeting = now.getHours()<12?"Good morning":now.getHours()<17?"Good afternoon":"Good evening";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
          style={{ background:"linear-gradient(160deg,#FAF6F0 0%,#F5EDE4 100%)" }}>
      <div className="w-full max-w-lg">
        <div className="mb-8" style={{ animation:"fadeUp 0.5s ease both" }}>
          <div className="inline-flex items-center gap-2.5 mb-5 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
            {neuUser?.photoURL
              ? <img src={neuUser.photoURL} alt="" className="w-7 h-7 rounded-full ring-2" style={{ borderColor:"#7B1C2E" }}/>
              : <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                     style={{ background:"linear-gradient(135deg,#7B1C2E,#C9A84C)" }}>{neuUser?.fullName?.[0]}</div>
            }
            <span className="text-sm text-gray-800 font-medium">{neuUser?.fullName}</span>
            <span className="text-xs text-gray-400 border-l border-gray-200 pl-2.5">{neuUser?.college_office}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight" style={{ fontFamily:"'Playfair Display',serif" }}>
            {greeting},<br/><span style={{ color:"#7B1C2E" }}>{neuUser?.fullName?.split(" ")[0]}.</span>
          </h1>
          {lastVisit
            ? <p className="mt-2 text-sm text-gray-400">Last visit: <span className="text-gray-700 font-medium">{formatVisitTime(lastVisit.timestamp)}</span> · {lastVisit.reason}</p>
            : <p className="mt-2 text-sm text-gray-400">Welcome back! What brings you to the library today?</p>
          }
        </div>

        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Purpose of Visit</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {VISIT_REASONS.map((reason) => (
            <ReasonCard key={reason} reason={reason} icon={REASON_META[reason].icon}
                        description={REASON_META[reason].description}
                        selected={selectedReason===reason} onSelect={setReason}/>
          ))}
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl border text-sm text-center"
               style={{ background:"rgba(192,57,43,0.05)", borderColor:"rgba(192,57,43,0.2)", color:"#C0392B" }}>
            {error.includes("permission")||error.includes("PERMISSION_DENIED")
              ? "Access Denied. Please contact the Library Admin."
              : error}
          </div>
        )}

        <button onClick={submit} disabled={isSubmitting||!selectedReason}
                className="w-full py-4 rounded-2xl font-semibold text-white text-base
                           transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:scale-[1.01]"
                style={{ background:"linear-gradient(135deg,#7B1C2E 0%,#A32238 100%)",
                         boxShadow:selectedReason&&!isSubmitting?"0 8px 24px rgba(123,28,46,0.3)":"none" }}>
          {isSubmitting
            ? <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Logging visit…
              </span>
            : "Check In →"}
        </button>
        <p className="text-center text-xs text-gray-400 mt-4">
          {now.toLocaleDateString("en-PH",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
        </p>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </main>
  );
}

export default function CheckInPage() {
  return <AuthGuard><CheckInContent/></AuthGuard>;
}
