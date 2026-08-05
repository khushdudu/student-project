import { useAppStore } from "../../store/useAppStore";
import SectionCard from "../ui/SectionCard";

export default function AcademicRecordCard() {
  const profile = useAppStore((s) => s.profile);
  const updateProfile = useAppStore((s) => s.updateProfile);

  return (
    <SectionCard index={2} title="Academic Record">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">
            GPA / Percentage
          </span>
          <input
            className="input"
            value={profile.gpa}
            onChange={(e) => updateProfile({ gpa: e.target.value })}
            placeholder="e.g. 9.1 or 92%"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">Grading scale</span>
          <input
            className="input"
            value={profile.gradingScale}
            onChange={(e) => updateProfile({ gradingScale: e.target.value })}
            placeholder="e.g. 10-point CGPA"
          />
        </label>
      </div>
    </SectionCard>
  );
}
