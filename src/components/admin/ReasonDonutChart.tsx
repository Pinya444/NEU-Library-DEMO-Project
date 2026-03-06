"use client";

import { useEffect, useState } from "react";
import type { ReasonBreakdown } from "@/types/analytics";

const COLORS: Record<string,string> = { "Reading":"#7B1C2E","Research":"#C9A84C","Computer Use":"#1A5C8A","Studying":"#2E7D52" };
const ICONS:  Record<string,string> = { "Reading":"📖","Research":"🔬","Computer Use":"💻","Studying":"✏️" };

export default function ReasonDonutChart({ data, loading }: { data: ReasonBreakdown[]; loading: boolean }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    if (!loading) setTimeout(()=>setAnimated(true),150); else setAnimated(false);
  }, [loading, data]);

  const total = data.reduce((s,d)=>s+d.count,0);
  const R=50, CX=60, CY=60, circumference=2*Math.PI*R;
  let cumulativePct = 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5">Visit Purpose Breakdown</h3>
      {loading ? (
        <div className="flex items-center justify-center gap-8">
          <div className="w-28 h-28 rounded-full border-8 border-gray-100 animate-pulse"/>
          <div className="space-y-3 flex-1">{[1,2,3,4].map((i)=><div key={i} className="h-4 bg-gray-100 rounded animate-pulse"/>)}</div>
        </div>
      ) : total===0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No data for this period.</p>
      ) : (
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
              <circle cx={CX} cy={CY} r={R} fill="none" stroke="#F3F4F6" strokeWidth="14"/>
              {data.map((item) => {
                const pct=item.count/total;
                const dash=animated?pct*circumference:0;
                const offset=-cumulativePct*circumference;
                cumulativePct+=pct;
                return <circle key={item.reason} cx={CX} cy={CY} r={R} fill="none"
                               stroke={COLORS[item.reason]??"#888"} strokeWidth="14"
                               strokeDasharray={`${dash} ${circumference-dash}`} strokeDashoffset={offset}
                               style={{ transition:"stroke-dasharray 0.8s ease" }}/>;
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold" style={{ fontFamily:"'Playfair Display',serif", color:"#1A0A0F" }}>{total}</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wide">total</span>
            </div>
          </div>
          <div className="flex-1 space-y-2.5">
            {data.map((item) => (
              <div key={item.reason} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{ICONS[item.reason]??"•"}</span>
                  <span className="text-xs text-gray-700 font-medium">{item.reason}</span>
                </div>
                <span className="text-xs font-semibold text-gray-800 w-8 text-right">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
