"use client";

import type { DailyCount } from "@/types/analytics";

export default function TrendSparkline({ data, color="#7B1C2E", width=120, height=36 }: {
  data: DailyCount[]; color?: string; width?: number; height?: number;
}) {
  if (!data || data.length < 2) return null;
  const counts = data.map((d) => d.count);
  const min = Math.min(...counts); const max = Math.max(...counts);
  const range = max-min || 1;
  const points = counts.map((v,i) => {
    const x = (i/(counts.length-1))*width;
    const y = height-((v-min)/range)*(height-6)-3;
    return `${x},${y}`;
  });
  const areaPath = `M${points[0]} `+points.slice(1).map((p)=>`L${p}`).join(" ")+` L${width},${height} L0,${height} Z`;
  const last = points[points.length-1].split(",");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" aria-hidden>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.15"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkGrad)"/>
      <polyline points={points.join(" ")} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={parseFloat(last[0])} cy={parseFloat(last[1])} r="3" fill={color}/>
    </svg>
  );
}
