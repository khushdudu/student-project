import { useAppStore } from "../../store/useAppStore";
import SectionCard from "../ui/SectionCard";
import FileUpload from "../ui/FileUpload";

export default function DocumentsCard() {
  const profile = useAppStore((s) => s.profile);
  const updateProfile = useAppStore((s) => s.updateProfile);

  return (
    <SectionCard index={6} title="Documents">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FileUpload
          label="Current CV"
          accept="PDF or DOCX"
          file={profile.cv}
          onChange={(file) => updateProfile({ cv: file })}
        />
        <FileUpload
          label="Base motivational letter"
          accept="PDF or DOCX"
          file={profile.motivationalLetterDraft}
          onChange={(file) => updateProfile({ motivationalLetterDraft: file })}
        />
      </div>
      <p className="mt-3 text-xs text-ink-soft">
        This is the base letter the agent rewrites for each college in the Workspace.
      </p>
    </SectionCard>
  );
}
