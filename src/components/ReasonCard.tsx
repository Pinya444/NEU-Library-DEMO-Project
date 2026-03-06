"use client";

import type { VisitReason } from "@/types/visitLog";

interface ReasonCardProps {
  reason:      VisitReason;
  icon:        string;
  description: string;
  selected:    boolean;
  onSelect:    (r: VisitReason) => void;
}

export default function ReasonCard({ reason, icon, description, selected, onSelect }: ReasonCardProps) {
  return (
    <button
      onClick={() => onSelect(reason)}
      aria-pressed={selected}
      className={`group relative w-full text-left rounded-2xl border-2 p-5
        transition-all duration-200 ease-out focus:outline-none
        ${selected
          ? "border-neu-maroon bg-neu-maroon shadow-lg scale-[1.02]"
          : "border-neu-border bg-white hover:border-neu-maroon/40 hover:shadow-md hover:scale-[1.01]"
        }`}
    >
      {selected && (
        <span className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full
                         bg-white flex items-center justify-center text-neu-maroon text-xs font-bold">
          ✓
        </span>
      )}
      <div className={`text-3xl mb-3 transition-transform duration-200
                       ${selected ? "scale-110" : "group-hover:scale-105"}`}>
        {icon}
      </div>
      <div className={`font-semibold text-sm mb-0.5 ${selected ? "text-white" : "text-neu-dark"}`}>
        {reason}
      </div>
      <div className={`text-xs leading-snug ${selected ? "text-white/70" : "text-neu-muted"}`}>
        {description}
      </div>
    </button>
  );
}
