"use client";

import { useEffect, useState } from "react";
import type { CollegeBreakdown } from "@/types/analytics";

const PALETTE = ["#7B1C2E","#C9A84C","#1A5C8A","#2E7D52","#8B4513","#4A0D67","#0D5C63","#8B1A4A"];

export default function CollegeBreakdownChart({ data, loading }: { data: CollegeBreakdown[]; loading: boolean }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    if (!loading) { const t=setTimeout(()=>setAnimated(true),100); return ()=>clearTimeout(t); }
    setAnimated(false);
  }, [loading, data]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5">Visits by College / Office</h3>
      {loading ? (
        <div className="space-y-4">
          {[80,60,45,30,20].map((w,i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-40 h-3 rounded bg-gray-100 animate-pulse flex-shrink-0"/>
              <div className="h-3 rounded bg-gray-100 animate-pulse" style={{ width:`${w}%` }}/>
            </div>
          ))}
        </div>
      ) : data.length===0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No data for this period.</p>
      ) : (
        <div className="space-y-3.5">
          {data.slice(0,8).map((item,i) => {
            const label = item.college_office.replace("College of ","").replace(" Administration"," Admin");
            return (
              <div key={item.college_office}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600 truncate max-w-[60%]" title={item.college_office}>{label}</span>
                  <span className="text-xs font-semibold text-gray-800 ml-2">{item.count} <span className="text-gray-400 font-normal">({item.percentage}%)</span></span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700 ease-out"
                       style={{ width:animated?`${item.percentage}%`:"0%", background:PALETTE[i%PALETTE.length], transitionDelay:`${i*60}ms` }}/>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
