import { useAppStore } from "../../store/useAppStore";
import SectionCard from "../ui/SectionCard";

const TERMS = ["Fall", "Spring", "Summer", "Winter"];

export default function BasicInfoCard() {
  const profile = useAppStore((s) => s.profile);
  const updateProfile = useAppStore((s) => s.updateProfile);

  return (
    <SectionCard index={1} title="Basic Information">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <input
            className="input"
            value={profile.fullName}
            onChange={(e) => updateProfile({ fullName: e.target.value })}
            placeholder="e.g. Prathiksha Ravi Murthy"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            className="input"
            value={profile.email}
            onChange={(e) => updateProfile({ email: e.target.value })}
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Target intake">
          <div className="flex gap-2">
            <select
              className="input"
              value={profile.targetIntakeTerm}
              onChange={(e) => updateProfile({ targetIntakeTerm: e.target.value })}
            >
              <option value="">Term</option>
              {TERMS.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
            <input
              className="input"
              value={profile.targetIntakeYear}
              onChange={(e) => updateProfile({ targetIntakeYear: e.target.value })}
              placeholder="Year"
            />
          </div>
        </Field>
        <Field label="Nationality" hint="Used for visa-related letter framing">
          <input
            className="input"
            value={profile.nationality}
            onChange={(e) => updateProfile({ nationality: e.target.value })}
            placeholder="e.g. Indian"
          />
        </Field>
      </div>
    </SectionCard>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-soft">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-soft/70">{hint}</span>}
    </label>
  );
}
