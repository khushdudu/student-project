import { useAppStore } from "../../store/useAppStore";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "—";
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function ProfileHeader() {
  const profile = useAppStore((s) => s.profile);
  const collegeCount = useAppStore((s) => s.colleges.length);

  const summary = [
    profile.targetIntakeTerm && profile.targetIntakeYear
      ? `${profile.targetIntakeTerm} ${profile.targetIntakeYear} intake`
      : null,
    profile.nationality || null,
    `${collegeCount} programme${collegeCount === 1 ? "" : "s"}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex items-center gap-5">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-brass bg-brass-soft font-display text-xl font-medium text-brass">
        {getInitials(profile.fullName)}
      </div>
      <div>
        <h1 className="font-display text-2xl font-medium text-ink">
          {profile.fullName || "Unnamed student"}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">{summary}</p>
      </div>
    </div>
  );
}
