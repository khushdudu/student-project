import type { CollegeStatus } from "../types";

const statusColor: Record<CollegeStatus, string> = {
  Pending: "#B5533C",
  Researching: "#A9824C",
  "Draft Ready": "#3E6B92",
  Finalized: "#5C7A5E",
};

interface StatusSealProps {
  status: CollegeStatus;
  showLabel?: boolean;
}

/**
 * Signature "seal" indicator — a 9px ring with a colored border and a filled
 * center dot. Used in place of generic colored dot/pill badges everywhere
 * a status needs to be shown.
 */
export default function StatusSeal({ status, showLabel = true }: StatusSealProps) {
  const color = statusColor[status];

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="relative inline-flex h-[9px] w-[9px] shrink-0 items-center justify-center rounded-full border-[1.5px] bg-paper-raised"
        style={{ borderColor: color }}
        aria-hidden="true"
      >
        <span className="h-[3px] w-[3px] rounded-full" style={{ backgroundColor: color }} />
      </span>
      {showLabel && (
        <span className="text-xs font-medium" style={{ color }}>
          {status}
        </span>
      )}
    </span>
  );
}
