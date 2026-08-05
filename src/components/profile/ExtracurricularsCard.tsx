import { useState } from "react";
import { X } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import SectionCard from "../ui/SectionCard";

export default function ExtracurricularsCard() {
  const extracurriculars = useAppStore((s) => s.profile.extracurriculars);
  const addExtracurricular = useAppStore((s) => s.addExtracurricular);
  const removeExtracurricular = useAppStore((s) => s.removeExtracurricular);
  const [draft, setDraft] = useState("");

  const commit = () => {
    if (draft.trim()) {
      addExtracurricular(draft);
      setDraft("");
    }
  };

  return (
    <SectionCard index={5} title="Extracurriculars & Potential">
      <div className="flex flex-wrap gap-2">
        {extracurriculars.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1.5 rounded-full bg-sage-soft px-3 py-1.5 text-sm text-sage"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeExtracurricular(index)}
              className="text-sage/60 hover:text-sage"
              aria-label={`Remove ${tag}`}
            >
              <X size={13} />
            </button>
          </span>
        ))}
        {extracurriculars.length === 0 && (
          <p className="text-xs text-ink-soft">No entries yet — add one below.</p>
        )}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          className="input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
          placeholder="e.g. President, Robotics Club — press Enter to add"
        />
        <button type="button" onClick={commit} className="btn-outline shrink-0">
          Add
        </button>
      </div>
    </SectionCard>
  );
}
