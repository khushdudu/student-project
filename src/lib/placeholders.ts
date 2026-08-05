import type { College, CvSuggestion, StudentProfile } from "../types";

export interface CollegeRequirements {
  programHighlights: string[];
  statedRequirements: string[];
  deadlines: string[];
}

/**
 * STUB — scrape / crawl the college's course page for structured requirements.
 *
 * Real implementation:
 *   POST /api/colleges/scrape  { url: string }
 *   -> 200 { programHighlights: string[], statedRequirements: string[], deadlines: string[] }
 * Likely backed by a crawler + HTML extraction or a scraping service, cached per URL.
 */
export async function scrapeCollegeRequirements(url: string): Promise<CollegeRequirements> {
  await delay(300);
  return {
    programHighlights: [
      `(mock) Program focus areas extracted from ${url || "the course page"}`,
      "(mock) Faculty research strengths",
      "(mock) Stated program values / mission",
    ],
    statedRequirements: [
      "(mock) Minimum GPA / grade requirement",
      "(mock) Required standardized test scores",
      "(mock) Statement of purpose expectations",
    ],
    deadlines: ["(mock) Round 1: TBD", "(mock) Round 2: TBD"],
  };
}

export interface AgentResponseResult {
  reply: string;
  letterUpdate?: string;
  cvSuggestions?: CvSuggestion[];
}

/**
 * STUB — send the conversation turn to the LLM agent.
 *
 * Real implementation:
 *   POST /api/agent/respond
 *   body: { message: string, collegeId: string, studentProfile: StudentProfile, history: ChatMessage[] }
 *   -> 200 { reply: string, letterUpdate?: string, cvSuggestions?: CvSuggestion[] }
 * Backed by an LLM call that blends the student's base letter draft, academic
 * record, and extracurricular profile with the scraped college requirements
 * and the running chat context.
 */
export async function generateAgentResponse(
  message: string,
  activeCollege: College | null,
  studentProfile: StudentProfile,
  collegeRequirements?: CollegeRequirements
): Promise<AgentResponseResult> {
  await delay(500);

  if (!activeCollege) {
    return { reply: "Select or add a college first so I know which application to work on." };
  }

  const studentName = studentProfile.fullName || "[Student Name]";
  const lower = message.toLowerCase();

  if (lower.includes("draft") || lower.includes("letter") || lower.includes("write")) {
    const letter = buildMockLetter(studentName, activeCollege);
    return {
      reply: `Here's a draft motivational letter for ${activeCollege.name || "this program"}, tailored to their stated requirements. Ask me to adjust tone, length, or emphasis and I'll revise it.`,
      letterUpdate: letter,
    };
  }

  if (lower.includes("cv") || lower.includes("resume")) {
    return {
      reply: `I've mapped a few CV edits against what ${activeCollege.name || "this program"} looks for — see the CV Suggestions tab on the right.`,
      cvSuggestions: buildMockCvSuggestions(activeCollege),
    };
  }

  if (lower.includes("formal") || lower.includes("tone")) {
    return {
      reply: `Noted — I'll lean more formal in the next draft. Click "Regenerate with current chat context" on the right panel to apply it.`,
    };
  }

  return {
    reply: `Got it. Try asking me to "draft the letter", "suggest CV edits", or "make the tone more formal" for ${activeCollege.name || "this college"}.`,
  };
}

function buildMockLetter(studentName: string, college: College): string {
  return `Dear Admissions Committee,

I am writing to express my strong interest in the ${college.course || "[Programme]"} at ${college.name || "[College Name]"}.

[Placeholder draft for UI development. In production this paragraph is produced by an LLM call blending the student's base motivational letter, academic record, and extracurricular profile with ${college.name || "the college"}'s scraped programme requirements.]

Sincerely,
${studentName}`;
}

function buildMockCvSuggestions(college: College): CvSuggestion[] {
  return [
    {
      id: makeId(),
      mark: "+",
      lead: "Add a projects section.",
      detail: `${college.name || "This programme"} emphasizes applied work — surface 2–3 quantitative or technical projects near the top of your CV.`,
    },
    {
      id: makeId(),
      mark: "↑",
      lead: "Move leadership experience higher.",
      detail: `The stated requirements for ${college.course || "this course"} value initiative — reorder so leadership roles appear before coursework.`,
    },
    {
      id: makeId(),
      mark: "✎",
      lead: "Reframe your research summary.",
      detail: `Match the language in ${college.name || "the programme"}'s "what we look for" copy — mirror their terminology where genuine.`,
    },
  ];
}

/**
 * STUB — render the letter to a PDF file and trigger a download.
 *
 * Real implementation options:
 *   - Client-side: a library such as pdf-lib / jsPDF rendering the letter text
 *   - Server-side: POST /api/export/pdf { letter: string } -> binary PDF response
 */
export async function exportToPDF(letterText: string): Promise<void> {
  console.log("[stub] exportToPDF called with letter of length", letterText.length);
}

/**
 * STUB — render the letter to a DOCX file and trigger a download.
 *
 * Real implementation options:
 *   - Client-side: the `docx` npm package to build a .docx blob
 *   - Server-side: POST /api/export/docx { letter: string } -> binary DOCX response
 */
export async function exportToDOCX(letterText: string): Promise<void> {
  console.log("[stub] exportToDOCX called with letter of length", letterText.length);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}
