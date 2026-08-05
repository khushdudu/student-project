import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { exportToDOCX, exportToPDF } from "../../lib/placeholders";

type Tab = "letter" | "cv";

const markColor = "text-sage";

export default function OutputPanel() {
  const colleges = useAppStore((s) => s.colleges);
  const activeCollegeId = useAppStore((s) => s.activeCollegeId);
  const generatedOutputs = useAppStore((s) => s.generatedOutputs);
  const updateLetterDraft = useAppStore((s) => s.updateLetterDraft);
  const regenerateWithChatContext = useAppStore((s) => s.regenerateWithChatContext);
  const showToast = useAppStore((s) => s.showToast);

  const activeCollege = colleges.find((c) => c.id === activeCollegeId) ?? null;
  const output = activeCollegeId ? generatedOutputs[activeCollegeId] : undefined;

  const [tab, setTab] = useState<Tab>("letter");
  const [draft, setDraft] = useState(output?.letter ?? "");
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    setDraft(output?.letter ?? "");
  }, [activeCollegeId, output?.letter]);

  const hasLetter = Boolean(draft);

  const handleRegenerate = async () => {
    if (!activeCollegeId) return;
    setIsRegenerating(true);
    await regenerateWithChatContext(activeCollegeId);
    setIsRegenerating(false);
  };

  const handleExportPDF = async () => {
    await exportToPDF(draft);
    showToast("PDF export not yet implemented", "ink");
  };

  const handleExportDOCX = async () => {
    await exportToDOCX(draft);
    showToast("DOCX export not yet implemented", "ink");
  };

  if (!activeCollege) {
    return (
      <div className="flex h-full w-[380px] shrink-0 flex-col items-center justify-center border-l border-line bg-paper-raised px-6 text-center">
        <p className="text-sm text-ink-soft">Select a college to see its output here.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-[380px] shrink-0 flex-col border-l border-line bg-paper-raised">
      <div className="flex border-b border-line">
        <TabButton active={tab === "letter"} onClick={() => setTab("letter")}>
          Motivational Letter
        </TabButton>
        <TabButton active={tab === "cv"} onClick={() => setTab("cv")}>
          CV Suggestions
        </TabButton>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {tab === "letter" ? (
          hasLetter ? (
            <textarea
              className="min-h-full w-full resize-none rounded-md border border-line bg-paper px-4 py-4 font-display text-[15px] leading-relaxed text-ink focus:border-brass focus:outline-none"
              style={{ minHeight: "360px" }}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                if (activeCollegeId) updateLetterDraft(activeCollegeId, e.target.value);
              }}
            />
          ) : (
            <p className="text-sm text-ink-soft">
              No letter yet — ask the agent to draft one for {activeCollege.name || "this college"}
              in the chat.
            </p>
          )
        ) : (
          <ul className="space-y-3">
            {(output?.cvSuggestions ?? []).map((suggestion) => (
              <li key={suggestion.id} className="rounded-md border border-line bg-paper px-4 py-3">
                <div className="flex items-start gap-2.5">
                  <span className={`mt-0.5 shrink-0 font-mono text-sm font-medium ${markColor}`}>
                    {suggestion.mark}
                  </span>
                  <p className="text-sm leading-relaxed text-ink">
                    <span className="font-semibold">{suggestion.lead} </span>
                    <span className="text-ink-soft">{suggestion.detail}</span>
                  </p>
                </div>
              </li>
            ))}
            {!output?.cvSuggestions?.length && (
              <p className="text-sm text-ink-soft">No CV suggestions yet.</p>
            )}
          </ul>
        )}
      </div>

      <div className="border-t border-line px-5 py-4">
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="mb-3 flex items-center gap-1.5 text-xs font-medium text-brass hover:underline disabled:opacity-50"
        >
          <RotateCcw size={12} className={isRegenerating ? "animate-spin" : ""} />
          Regenerate with current chat context
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExportDOCX}
            disabled={!hasLetter}
            className="btn-outline flex-1"
          >
            Download DOCX
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={!hasLetter}
            className="btn-fill flex-1"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
        active ? "border-b-2 border-brass text-ink" : "border-b-2 border-transparent text-ink-soft hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
