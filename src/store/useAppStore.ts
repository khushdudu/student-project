import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import type {
  ChatMessage,
  College,
  CollegeStatus,
  CvSuggestion,
  GeneratedOutput,
  StudentProfile,
  TestScore,
  TranscriptEntry,
} from "../types";
import { generateAgentResponse, scrapeCollegeRequirements } from "../lib/placeholders";
import { supabase } from "../lib/supabase";

function getDb() {
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

const blankProfile: StudentProfile = {
  fullName: "",
  email: "",
  targetIntakeTerm: "",
  targetIntakeYear: "",
  nationality: "",
  gpa: "",
  gradingScale: "",
  transcripts: [],
  testScores: [],
  extracurriculars: [],
  cv: null,
  motivationalLetterDraft: null,
  lastSavedAt: null,
};

interface ToastState {
  message: string;
  tone: "sage" | "ink";
}

interface AppState {
  // Auth
  user: User | null;
  isLoading: boolean;

  // Data
  profile: StudentProfile;
  colleges: College[];
  activeCollegeId: string | null;
  chatMessages: ChatMessage[];
  generatedOutputs: Record<string, GeneratedOutput>;
  prompts: string[];
  toast: ToastState | null;
  isAgentTyping: boolean;

  // Auth actions
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;

  // Bootstrap
  initializeFromSupabase: () => Promise<void>;

  // Profile
  updateProfile: (partial: Partial<StudentProfile>) => void;
  saveProfile: () => Promise<void>;

  // Transcripts
  addTranscript: () => void;
  updateTranscript: (id: string, partial: Partial<TranscriptEntry>) => void;
  removeTranscript: (id: string) => void;

  // Test scores
  addTestScore: () => void;
  updateTestScore: (id: string, partial: Partial<TestScore>) => void;
  removeTestScore: (id: string) => void;

  // Extracurriculars
  addExtracurricular: (value: string) => void;
  removeExtracurricular: (index: number) => void;

  // Colleges
  addCollege: (college: Pick<College, "name" | "course" | "url" | "notes">) => Promise<void>;
  addCollegesBulk: (raw: string) => Promise<void>;
  setActiveCollege: (id: string) => void;
  updateCollegeStatus: (id: string, status: CollegeStatus) => Promise<void>;

  // Agent / chat
  sendMessage: (content: string) => Promise<void>;
  regenerateWithChatContext: (collegeId: string) => Promise<void>;
  updateLetterDraft: (collegeId: string, letter: string) => Promise<void>;

  // Prompts
  savePrompt: (prompt: string) => Promise<void>;

  // Toast
  showToast: (message: string, tone?: ToastState["tone"]) => void;
  clearToast: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  isLoading: true,
  profile: blankProfile,
  colleges: [],
  activeCollegeId: null,
  chatMessages: [],
  generatedOutputs: {},
  prompts: [],
  toast: null,
  isAgentTyping: false,

  // ─── Auth ────────────────────────────────────────────────────────────────────

  setUser: (user) => set({ user }),

  signOut: async () => {
    await getDb().auth.signOut();
    set({
      user: null,
      profile: blankProfile,
      colleges: [],
      activeCollegeId: null,
      chatMessages: [],
      generatedOutputs: {},
      prompts: [],
    });
  },

  // ─── Bootstrap ───────────────────────────────────────────────────────────────

  initializeFromSupabase: async () => {
    const userId = get().user?.id;
    if (!userId) { set({ isLoading: false }); return; }

    set({ isLoading: true });

    const [profileRes, collegesRes, messagesRes, outputsRes, promptsRes] = await Promise.all([
      getDb().from("student_profiles").select("*").eq("user_id", userId).maybeSingle(),
      getDb().from("colleges").select("*").eq("user_id", userId).order("created_at"),
      getDb().from("chat_messages").select("*").eq("user_id", userId).order("created_at"),
      getDb().from("generated_outputs").select("*").eq("user_id", userId),
      getDb().from("prompts").select("content").eq("user_id", userId).order("created_at"),
    ]);

    const profile: StudentProfile = profileRes.data
      ? {
          fullName: profileRes.data.full_name ?? "",
          email: profileRes.data.email ?? "",
          targetIntakeTerm: profileRes.data.target_intake_term ?? "",
          targetIntakeYear: profileRes.data.target_intake_year ?? "",
          nationality: profileRes.data.nationality ?? "",
          gpa: profileRes.data.gpa ?? "",
          gradingScale: profileRes.data.grading_scale ?? "",
          transcripts: profileRes.data.transcripts ?? [],
          testScores: profileRes.data.test_scores ?? [],
          extracurriculars: profileRes.data.extracurriculars ?? [],
          cv: profileRes.data.cv ?? null,
          motivationalLetterDraft: profileRes.data.motivational_letter_draft ?? null,
          lastSavedAt: profileRes.data.last_saved_at ?? null,
        }
      : blankProfile;

    const colleges: College[] = (collegesRes.data ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      course: r.course,
      url: r.url,
      notes: r.notes,
      status: r.status as CollegeStatus,
    }));

    const chatMessages: ChatMessage[] = (messagesRes.data ?? []).map((r) => ({
      id: r.id,
      collegeId: r.college_id,
      role: r.role as "user" | "agent",
      content: r.content,
      letterPreview: r.letter_preview ?? undefined,
      createdAt: r.created_at,
    }));

    const generatedOutputs: Record<string, GeneratedOutput> = {};
    for (const r of outputsRes.data ?? []) {
      generatedOutputs[r.college_id] = {
        letter: r.letter ?? "",
        cvSuggestions: r.cv_suggestions ?? [],
      };
    }

    const prompts: string[] = (promptsRes.data ?? []).map((r) => r.content);

    set({
      profile,
      colleges,
      chatMessages,
      generatedOutputs,
      prompts,
      activeCollegeId: colleges[0]?.id ?? null,
      isLoading: false,
    });
  },

  // ─── Profile ─────────────────────────────────────────────────────────────────

  updateProfile: (partial) =>
    set((state) => ({ profile: { ...state.profile, ...partial } })),

  saveProfile: async () => {
    const { profile, user } = get();
    if (!user) return;
    const now = new Date().toISOString();

    await getDb().from("student_profiles").upsert({
      user_id: user.id,
      full_name: profile.fullName,
      email: profile.email,
      target_intake_term: profile.targetIntakeTerm,
      target_intake_year: profile.targetIntakeYear,
      nationality: profile.nationality,
      gpa: profile.gpa,
      grading_scale: profile.gradingScale,
      transcripts: profile.transcripts,
      test_scores: profile.testScores,
      extracurriculars: profile.extracurriculars,
      cv: profile.cv,
      motivational_letter_draft: profile.motivationalLetterDraft,
      last_saved_at: now,
    });

    set((state) => ({ profile: { ...state.profile, lastSavedAt: now } }));
    get().showToast("Profile saved ✓", "sage");
  },

  // ─── Transcripts ─────────────────────────────────────────────────────────────

  addTranscript: () =>
    set((state) => ({
      profile: {
        ...state.profile,
        transcripts: [...state.profile.transcripts, { id: makeId(), label: "", file: null }],
      },
    })),

  updateTranscript: (id, partial) =>
    set((state) => ({
      profile: {
        ...state.profile,
        transcripts: state.profile.transcripts.map((t) =>
          t.id === id ? { ...t, ...partial } : t
        ),
      },
    })),

  removeTranscript: (id) =>
    set((state) => ({
      profile: {
        ...state.profile,
        transcripts: state.profile.transcripts.filter((t) => t.id !== id),
      },
    })),

  // ─── Test Scores ─────────────────────────────────────────────────────────────

  addTestScore: () =>
    set((state) => ({
      profile: {
        ...state.profile,
        testScores: [
          ...state.profile.testScores,
          { id: makeId(), testName: "", score: "", date: "" },
        ],
      },
    })),

  updateTestScore: (id, partial) =>
    set((state) => ({
      profile: {
        ...state.profile,
        testScores: state.profile.testScores.map((t) =>
          t.id === id ? { ...t, ...partial } : t
        ),
      },
    })),

  removeTestScore: (id) =>
    set((state) => ({
      profile: {
        ...state.profile,
        testScores: state.profile.testScores.filter((t) => t.id !== id),
      },
    })),

  // ─── Extracurriculars ────────────────────────────────────────────────────────

  addExtracurricular: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    set((state) => ({
      profile: {
        ...state.profile,
        extracurriculars: [...state.profile.extracurriculars, trimmed],
      },
    }));
  },

  removeExtracurricular: (index) =>
    set((state) => ({
      profile: {
        ...state.profile,
        extracurriculars: state.profile.extracurriculars.filter((_, i) => i !== index),
      },
    })),

  // ─── Colleges ────────────────────────────────────────────────────────────────

  addCollege: async (college) => {
    const { user } = get();
    if (!user) return;

    const newCollege: College = {
      id: makeId(),
      name: college.name,
      course: college.course,
      url: college.url,
      notes: college.notes,
      status: "Pending",
    };

    await getDb().from("colleges").insert({
      id: newCollege.id,
      user_id: user.id,
      name: newCollege.name,
      course: newCollege.course,
      url: newCollege.url,
      notes: newCollege.notes,
      status: newCollege.status,
    });

    set((state) => ({
      colleges: [...state.colleges, newCollege],
      activeCollegeId: state.activeCollegeId ?? newCollege.id,
    }));
  },

  addCollegesBulk: async (raw) => {
    const { user } = get();
    if (!user) return;

    const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
    const newColleges: College[] = lines.map((line) => {
      const [name = "", course = "", url = ""] = line.split("|").map((p) => p.trim());
      return { id: makeId(), name, course, url, notes: "", status: "Pending" };
    });

    if (!newColleges.length) return;

    await getDb().from("colleges").insert(
      newColleges.map((c) => ({
        id: c.id,
        user_id: user.id,
        name: c.name,
        course: c.course,
        url: c.url,
        notes: c.notes,
        status: c.status,
      }))
    );

    set((state) => ({
      colleges: [...state.colleges, ...newColleges],
      activeCollegeId: state.activeCollegeId ?? newColleges[0].id,
    }));
  },

  setActiveCollege: (id) => set({ activeCollegeId: id }),

  updateCollegeStatus: async (id, status) => {
    const { user } = get();
    if (!user) return;
    await getDb().from("colleges").update({ status }).eq("id", id).eq("user_id", user.id);
    set((state) => ({
      colleges: state.colleges.map((c) => (c.id === id ? { ...c, status } : c)),
    }));
  },

  // ─── Agent / Chat ────────────────────────────────────────────────────────────

  sendMessage: async (content) => {
    const trimmed = content.trim();
    const { activeCollegeId, profile, colleges, user } = get();
    if (!trimmed || !activeCollegeId || !user) return;

    const userMessage: ChatMessage = {
      id: makeId(),
      collegeId: activeCollegeId,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    await Promise.all([
      getDb().from("chat_messages").insert({
        id: userMessage.id,
        user_id: user.id,
        college_id: userMessage.collegeId,
        role: userMessage.role,
        content: userMessage.content,
        created_at: userMessage.createdAt,
      }),
      // Save the raw prompt text for prompt history
      get().savePrompt(trimmed),
    ]);

    set((state) => ({
      chatMessages: [...state.chatMessages, userMessage],
      isAgentTyping: true,
    }));

    const activeCollege = colleges.find((c) => c.id === activeCollegeId) ?? null;

    // If the message is asking for a letter, scrape the college URL first
    const isLetterRequest = /draft|letter|write|motivat/i.test(trimmed);
    const collegeRequirements =
      isLetterRequest && activeCollege?.url
        ? await scrapeCollegeRequirements(activeCollege.url)
        : undefined;

    const result = await generateAgentResponse(trimmed, activeCollege, profile, collegeRequirements);

    const currentVersion = get().generatedOutputs[activeCollegeId];
    const nextVersion = (currentVersion ? 1 : 0) + 1;

    const agentMessage: ChatMessage = {
      id: makeId(),
      collegeId: activeCollegeId,
      role: "agent",
      content: result.reply,
      letterPreview: result.letterUpdate
        ? { version: nextVersion, letter: result.letterUpdate }
        : undefined,
      createdAt: new Date().toISOString(),
    };

    await getDb().from("chat_messages").insert({
      id: agentMessage.id,
      user_id: user.id,
      college_id: agentMessage.collegeId,
      role: agentMessage.role,
      content: agentMessage.content,
      letter_preview: agentMessage.letterPreview ?? null,
      created_at: agentMessage.createdAt,
    });

    set((state) => {
      const existing = state.generatedOutputs[activeCollegeId] ?? {
        letter: "",
        cvSuggestions: [],
      };
      const updated: GeneratedOutput = {
        letter: result.letterUpdate ?? existing.letter,
        cvSuggestions: result.cvSuggestions ?? existing.cvSuggestions,
      };
      return {
        chatMessages: [...state.chatMessages, agentMessage],
        isAgentTyping: false,
        generatedOutputs: { ...state.generatedOutputs, [activeCollegeId]: updated },
      };
    });

    if (result.letterUpdate) {
      const output = get().generatedOutputs[activeCollegeId];
      await getDb().from("generated_outputs").upsert({
        college_id: activeCollegeId,
        user_id: user.id,
        letter: output.letter,
        cv_suggestions: output.cvSuggestions,
      });

      const status = get().colleges.find((c) => c.id === activeCollegeId)?.status;
      if (status === "Pending" || status === "Researching") {
        await get().updateCollegeStatus(activeCollegeId, "Draft Ready");
      }
    }
  },

  regenerateWithChatContext: async (collegeId) => {
    const { profile, colleges, user } = get();
    if (!user) return;

    const activeCollege = colleges.find((c) => c.id === collegeId) ?? null;
    set({ isAgentTyping: true });

    const result = await generateAgentResponse(
      "Regenerate the letter using our current chat context.",
      activeCollege,
      profile
    );

    const existing = get().generatedOutputs[collegeId] ?? { letter: "", cvSuggestions: [] };
    const nextVersion = existing.letter ? 2 : 1;
    const letter = result.letterUpdate ?? existing.letter;

    const agentMessage: ChatMessage = {
      id: makeId(),
      collegeId,
      role: "agent",
      content: "Regenerated the draft using the current chat context.",
      letterPreview: { version: nextVersion, letter },
      createdAt: new Date().toISOString(),
    };

    await getDb().from("chat_messages").insert({
      id: agentMessage.id,
      user_id: user.id,
      college_id: agentMessage.collegeId,
      role: agentMessage.role,
      content: agentMessage.content,
      letter_preview: agentMessage.letterPreview ?? null,
      created_at: agentMessage.createdAt,
    });

    const updatedOutput: GeneratedOutput = {
      letter,
      cvSuggestions: result.cvSuggestions ?? existing.cvSuggestions,
    };

    await getDb().from("generated_outputs").upsert({
      college_id: collegeId,
      user_id: user.id,
      letter: updatedOutput.letter,
      cv_suggestions: updatedOutput.cvSuggestions,
    });

    set((state) => ({
      isAgentTyping: false,
      chatMessages: [...state.chatMessages, agentMessage],
      generatedOutputs: { ...state.generatedOutputs, [collegeId]: updatedOutput },
    }));
  },

  updateLetterDraft: async (collegeId, letter) => {
    const { user } = get();
    if (!user) return;

    const existing = get().generatedOutputs[collegeId] ?? { letter: "", cvSuggestions: [] };
    const updated: GeneratedOutput = { letter, cvSuggestions: existing.cvSuggestions };

    await getDb().from("generated_outputs").upsert({
      college_id: collegeId,
      user_id: user.id,
      letter,
      cv_suggestions: existing.cvSuggestions,
    });

    set((state) => ({
      generatedOutputs: { ...state.generatedOutputs, [collegeId]: updated },
    }));
  },

  // ─── Prompts ─────────────────────────────────────────────────────────────────

  savePrompt: async (prompt) => {
    const { user } = get();
    if (!user) return;

    await getDb().from("prompts").insert({
      user_id: user.id,
      content: prompt,
    });

    set((state) => ({ prompts: [...state.prompts, prompt] }));
  },

  // ─── Toast ───────────────────────────────────────────────────────────────────

  showToast: (message, tone = "ink") => {
    set({ toast: { message, tone } });
    setTimeout(() => {
      if (get().toast?.message === message) set({ toast: null });
    }, 2500);
  },

  clearToast: () => set({ toast: null }),
}));

export type { CvSuggestion };
