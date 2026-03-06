"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const COUNTDOWN = 8;

function WelcomeContent() {
  const router       = useRouter();
  const params       = useSearchParams();
  const { neuUser, signOut } = useAuth();
  const reason       = params.get("reason") ?? "Visit";
  const [count,      setCount]      = useState(COUNTDOWN);
  const [particles,  setParticles]  = useState<{id:number;x:number;color:string;delay:number;size:number}[]>([]);
  const intervalRef  = useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(() => {
    setParticles(Array.from({length:24},(_,i)=>({
      id:i, x:Math.random()*100, color:["#7B1C2E","#C9A84C","#1A5C8A","#2E7D52"][Math.floor(Math.random()*4)],
      delay:Math.random()*2, size:6+Math.random()*8,
    })));
    intervalRef.current = setInterval(()=>setCount((c)=>{ if(c<=1){clearInterval(intervalRef.current!);router.replace("/checkin");return 0;}return c-1; }), 1000);
    return ()=>{ if(intervalRef.current) clearInterval(intervalRef.current); };
  }, [router]);

  const icons: Record<string,string> = { "Reading":"📖","Research":"🔬","Computer Use":"💻","Studying":"✏️" };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden relative"
          style={{ background:"linear-gradient(145deg,#1A0A0F 0%,#2D0A12 60%,#1A0A0F 100%)" }}>
      {particles.map((p)=>(
        <div key={p.id} className="absolute rounded-full pointer-events-none"
             style={{ left:`${p.x}%`, top:"-10px", width:p.size, height:p.size, background:p.color, opacity:0.7,
                      animation:`fall ${3+Math.random()*3}s ${p.delay}s linear infinite` }}/>
      ))}
      <div className="relative z-10 text-center max-w-sm w-full">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-6"
             style={{ background:"linear-gradient(135deg,#7B1C2E,#C9A84C)", boxShadow:"0 0 48px rgba(201,168,76,0.4)",
                      animation:"welcomePop 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          ✓
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily:"'Playfair Display',serif",
             animation:"fadeUp 0.5s 0.3s ease both", opacity:0 }}>
          Welcome to<br/>NEU Library!
        </h1>
        <p className="text-white/50 text-sm mb-6" style={{ animation:"fadeUp 0.5s 0.4s ease both", opacity:0 }}>
          Your visit has been logged successfully.
        </p>
        <div className="flex items-center justify-center gap-2 mb-8"
             style={{ animation:"fadeUp 0.5s 0.5s ease both", opacity:0 }}>
          <span className="text-2xl">{icons[reason]??"📖"}</span>
          <span className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)" }}>
            {reason}
          </span>
        </div>
        {neuUser && (
          <div className="flex items-center justify-center gap-3 mb-8"
               style={{ animation:"fadeUp 0.5s 0.55s ease both", opacity:0 }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm"
                 style={{ background:"linear-gradient(135deg,#7B1C2E,#C9A84C)" }}>
              {neuUser.fullName?.[0]}
            </div>
            <div className="text-left">
              <p className="text-sm text-white/80 font-medium">{neuUser.fullName}</p>
              <p className="text-xs text-white/40">{neuUser.college_office}</p>
            </div>
          </div>
        )}
        <div className="flex flex-col items-center gap-3" style={{ animation:"fadeUp 0.5s 0.6s ease both", opacity:0 }}>
          <p className="text-xs text-white/30">Returning to check-in in <span className="text-white/60 font-semibold">{count}s</span></p>
          <button onClick={signOut}
                  className="px-6 py-2.5 rounded-full text-sm font-medium text-white/60
                             border border-white/15 hover:bg-white/5 transition-all duration-200">
            Done & Sign out
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fall { from{transform:translateY(-10px) rotate(0deg);opacity:0.7} to{transform:translateY(110vh) rotate(360deg);opacity:0} }
        @keyframes welcomePop { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </main>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center"
           style={{ background:"linear-gradient(145deg,#1A0A0F,#2D0A12)" }}>
        <div className="text-5xl animate-bounce">📖</div>
      </div>
    }>
      <WelcomeContent/>
    </Suspense>
  );
}
