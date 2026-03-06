"use client";

import { useAuth } from "@/hooks/useAuth";

export default function AccessDenied({ blockReason }: { blockReason?: string }) {
  const { neuUser, signOut } = useAuth();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
         style={{ background: "linear-gradient(145deg, #1A0A0F 0%, #2D0A12 60%, #1A0A0F 100%)" }}>
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full flex items-center justify-center"
             style={{ background:"radial-gradient(circle,#3D0A14,#1A0A0F)", border:"2px solid rgba(192,57,43,0.4)", boxShadow:"0 0 48px rgba(192,57,43,0.3)" }}>
          <span style={{ fontSize:48 }}>⊘</span>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-white mb-3 text-center"
          style={{ fontFamily:"'Playfair Display',serif" }}>
        Access Denied
      </h1>
      <p className="text-white/60 text-base text-center max-w-sm leading-relaxed mb-2">
        Please contact the Library Admin.
      </p>
      {blockReason && (
        <div className="mt-5 max-w-sm w-full px-5 py-4 rounded-2xl text-center"
             style={{ background:"rgba(192,57,43,0.08)", border:"1px solid rgba(192,57,43,0.25)" }}>
          <p className="text-xs text-red-400/70 uppercase tracking-widest font-semibold mb-1.5">Reason</p>
          <p className="text-sm text-red-200/80">{blockReason}</p>
        </div>
      )}
      {neuUser && (
        <div className="mt-6 flex items-center gap-3 px-5 py-3 rounded-full"
             style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
               style={{ background:"linear-gradient(135deg,#7B1C2E,#C9A84C)" }}>
            {neuUser.fullName?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-white/70 font-medium">{neuUser.fullName}</p>
            <p className="text-xs text-white/30">{neuUser.email}</p>
          </div>
        </div>
      )}
      <div className="mt-8 text-center">
        <p className="text-xs text-white/30 mb-5 leading-relaxed">
          If you believe this is an error, please visit the library desk<br/>
          or email <span className="text-white/50">library@neu.edu.ph</span>
        </p>
        <button onClick={signOut}
                className="px-6 py-2.5 rounded-full text-sm font-medium text-white/60
                           border border-white/15 hover:bg-white/5 transition-all duration-200">
          Sign out
        </button>
      </div>
    </div>
  );
}
