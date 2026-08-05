import { Plus, Trash2 } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import SectionCard from "../ui/SectionCard";
import FileUpload from "../ui/FileUpload";

interface Props {
  index: number;
}

export default function TranscriptsCard({ index }: Props) {
  const transcripts = useAppStore((s) => s.profile.transcripts);
  const addTranscript = useAppStore((s) => s.addTranscript);
  const updateTranscript = useAppStore((s) => s.updateTranscript);
  const removeTranscript = useAppStore((s) => s.removeTranscript);

  return (
    <SectionCard index={index} title="Transcripts">
      <div className="space-y-4">
        {transcripts.map((entry) => (
          <div key={entry.id} className="flex items-end gap-3">
            <div className="flex-1 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-ink-soft">Label</span>
                <input
                  className="input"
                  value={entry.label}
                  onChange={(e) => updateTranscript(entry.id, { label: e.target.value })}
                  placeholder="e.g. Bachelor's Transcript"
                />
              </label>
              <FileUpload
                label="Document"
                accept="PDF or image"
                file={entry.file}
                onChange={(file) => updateTranscript(entry.id, { file })}
              />
            </div>
            <button
              type="button"
              onClick={() => removeTranscript(entry.id)}
              className="mb-[2px] rounded p-1.5 text-ink-soft hover:bg-rust-soft hover:text-rust"
              aria-label="Remove transcript"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        {transcripts.length === 0 && (
          <p className="text-xs text-ink-soft">No transcripts added yet.</p>
        )}
      </div>

      <button
        type="button"
        onClick={addTranscript}
        className="mt-4 flex items-center gap-1 text-xs font-medium text-brass hover:underline"
      >
        <Plus size={13} /> Add transcript
      </button>
    </SectionCard>
  );
}
