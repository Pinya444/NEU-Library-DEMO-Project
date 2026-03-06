"use client";

import { useState } from "react";
import type { DateRange, RangePreset } from "@/types/analytics";

const PRESETS: { value: RangePreset; label: string }[] = [
  { value:"today",  label:"Today"      },
  { value:"week",   label:"This Week"  },
  { value:"month",  label:"This Month" },
  { value:"custom", label:"Custom"     },
];

function toInputVal(d: Date) { return d.toISOString().slice(0,10); }

export default function DateRangePicker({ preset, range, onPresetChange, onCustomRange }: {
  preset: RangePreset; range: DateRange;
  onPresetChange: (p: RangePreset) => void;
  onCustomRange:  (r: DateRange)   => void;
}) {
  const [fromVal, setFromVal] = useState(toInputVal(range.from));
  const [toVal,   setToVal]   = useState(toInputVal(range.to));

  const applyCustom = () => {
    const from = new Date(fromVal+"T00:00:00");
    const to   = new Date(toVal  +"T23:59:59");
    if (from <= to) onCustomRange({ from, to });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        {PRESETS.map((p) => (
          <button key={p.value} onClick={() => onPresetChange(p.value)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
                    ${preset===p.value ? "bg-white shadow-sm font-semibold" : "text-gray-500 hover:text-gray-800"}`}
                  style={preset===p.value ? { color:"#7B1C2E" } : {}}>
            {p.label}
          </button>
        ))}
      </div>
      {preset==="custom" && (
        <div className="flex items-center gap-2">
          <input type="date" value={fromVal} max={toInputVal(new Date())}
                 onChange={(e) => setFromVal(e.target.value)}
                 className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-neu-maroon"/>
          <span className="text-gray-400 text-sm">→</span>
          <input type="date" value={toVal} max={toInputVal(new Date())}
                 onChange={(e) => setToVal(e.target.value)}
                 className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-neu-maroon"/>
          <button onClick={applyCustom}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white hover:opacity-90"
                  style={{ background:"#7B1C2E" }}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
