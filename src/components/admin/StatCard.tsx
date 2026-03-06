"use client";

import { useEffect, useRef, useState } from "react";

interface StatCardProps {
  label:    string;
  value:    number | string;
  sub?:     string;
  icon:     string;
  accent:   string;
  delay?:   number;
  trend?:   number | null;
  loading?: boolean;
}

function useCountUp(target: number, duration = 800): number {
  const [current, setCurrent] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now-start)/duration, 1);
      const eased = 1-Math.pow(1-progress, 3);
      setCurrent(Math.round(eased*target));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);
  return current;
}

export default function StatCard({ label, value, sub, icon, accent, delay=0, trend, loading }: StatCardProps) {
  const numValue   = typeof value === "number" ? value : 0;
  const animated   = useCountUp(loading ? 0 : numValue);
  const displayVal = typeof value === "string" ? value : animated;

  return (
    <div className="relative bg-white rounded-2xl p-6 overflow-hidden border border-transparent
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
         style={{ boxShadow:`0 2px 12px rgba(0,0,0,0.06), 0 0 0 1.5px ${accent}22`, animationDelay:`${delay}ms`, animation:"fadeUp 0.5s ease both" }}>
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background:accent }}/>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4" style={{ background:`${accent}15` }}>
        {icon}
      </div>
      {loading ? (
        <div className="h-10 w-24 rounded-lg bg-gray-100 animate-pulse mb-1"/>
      ) : (
        <div className="text-4xl font-bold leading-none mb-1" style={{ fontFamily:"'Playfair Display',serif", color:"#1A0A0F" }}>
          {displayVal}
        </div>
      )}
      <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">{label}</div>
      <div className="flex items-center justify-between gap-2">
        {sub && <p className="text-xs text-gray-400 leading-snug">{sub}</p>}
        {trend != null && !loading && (
          <span className="flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ color:trend>=0?"#2E7D52":"#C0392B", background:trend>=0?"#E8F5EE":"#FEECEC" }}>
            {trend>=0?"↑":"↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}
