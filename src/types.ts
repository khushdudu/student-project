export interface UploadedFile {
  name: string;
  uploadedAt: string;
}

export interface TestScore {
  id: string;
  testName: string;
  score: string;
  date: string;
}

export interface TranscriptEntry {
  id: string;
  label: string;
  file: UploadedFile | null;
}

export interface StudentProfile {
  fullName: string;
  email: string;
  targetIntakeTerm: string;
  targetIntakeYear: string;
  nationality: string;

  gpa: string;
  gradingScale: string;
  transcripts: TranscriptEntry[];

  testScores: TestScore[];
  extracurriculars: string[];

  cv: UploadedFile | null;
  motivationalLetterDraft: UploadedFile | null;

  lastSavedAt: string | null;
}

export type CollegeStatus = "Pending" | "Researching" | "Draft Ready" | "Finalized";

export interface College {
  id: string;
  name: string;
  course: string;
  url: string;
  notes: string;
  status: CollegeStatus;
}

export interface LetterPreview {
  version: number;
  letter: string;
}

export interface ChatMessage {
  id: string;
  collegeId: string;
  role: "user" | "agent";
  content: string;
  letterPreview?: LetterPreview;
  createdAt: string;
}

export type CvSuggestionMark = "+" | "↑" | "✎";

export interface CvSuggestion {
  id: string;
  mark: CvSuggestionMark;
  lead: string;
  detail: string;
}

export interface GeneratedOutput {
  letter: string;
  cvSuggestions: CvSuggestion[];
}
