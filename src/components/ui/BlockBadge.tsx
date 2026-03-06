"use client";

interface BlockBadgeProps {
  isBlocked:    boolean;
  blockReason?: string;
  size?:        "sm" | "md";
}

export function BlockBadge({ isBlocked, blockReason, size = "sm" }: BlockBadgeProps) {
  if (!isBlocked) {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-full
        ${size==="md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-[11px]"}
        bg-green-50 text-green-700`}>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"/>Active
      </span>
    );
  }
  return (
    <span title={blockReason ? `Reason: ${blockReason}` : undefined}
          className={`inline-flex items-center gap-1 font-semibold rounded-full cursor-default
        ${size==="md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-[11px]"}
        bg-red-50 text-red-600 border border-red-200`}>
      <span className="text-[10px]">⊘</span>Blocked
    </span>
  );
}

export function BlockToggleButton({ isBlocked, onClick, compact }: {
  isBlocked: boolean; onClick: () => void; compact?: boolean;
}) {
  return (
    <button onClick={onClick}
            className={`font-semibold rounded-lg transition-all duration-150
      ${compact ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm"}
      ${isBlocked
        ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
        : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
      }`}>
      {isBlocked ? "✓ Unblock" : "⊘ Block"}
    </button>
  );
}
