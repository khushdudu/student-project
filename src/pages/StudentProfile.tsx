import { useAppStore } from "../store/useAppStore";
import ProfileHeader from "../components/profile/ProfileHeader";
import BasicInfoCard from "../components/profile/BasicInfoCard";
import AcademicRecordCard from "../components/profile/AcademicRecordCard";
import TranscriptsCard from "../components/profile/TranscriptsCard";
import TestScoresCard from "../components/profile/TestScoresCard";
import ExtracurricularsCard from "../components/profile/ExtracurricularsCard";
import DocumentsCard from "../components/profile/DocumentsCard";

export default function StudentProfile() {
  const saveProfile = useAppStore((s) => s.saveProfile);

  return (
    <div className="h-full overflow-y-auto px-8 py-10">
      <div className="mx-auto max-w-[760px] space-y-8 pb-16">
        <ProfileHeader />

        <div className="space-y-6">
          <BasicInfoCard />
          <AcademicRecordCard />
          <TranscriptsCard index={3} />
          <TestScoresCard />
          <ExtracurricularsCard />
          <DocumentsCard />
        </div>

        <div className="flex justify-end">
          <button type="button" onClick={saveProfile} className="btn-brass">
            Save profile
          </button>
        </div>
      </div>
    </div>
  );
}
