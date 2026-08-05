import { useState } from "react";
import { Plus, ExternalLink } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import StatusSeal from "../components/StatusSeal";
import AddCollegeForm from "../components/workspace/AddCollegeForm";
import { useNavigate } from "react-router-dom";

export default function CollegesPage() {
  const colleges = useAppStore((s) => s.colleges);
  const activeCollegeId = useAppStore((s) => s.activeCollegeId);
  const setActiveCollege = useAppStore((s) => s.setActiveCollege);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  function selectAndOpen(id: string) {
    setActiveCollege(id);
    navigate("/");
  }

  return (
    <div className="h-full overflow-y-auto px-8 py-10">
      <div className="mx-auto max-w-[760px] pb-16">
        <p className="eyebrow">College List</p>
        <h1 className="mt-1 font-display text-3xl font-medium text-ink">Applications</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Your shortlisted programmes. Select one to open it in the workspace.
        </p>

        <div className="mt-8 space-y-3">
          {colleges.length === 0 && (
            <p className="py-10 text-center text-sm text-ink-soft">
              No colleges added yet — add your first one below.
            </p>
          )}

          {colleges.map((college, index) => {
            const isActive = college.id === activeCollegeId;
            return (
              <div
                key={college.id}
                className={`rounded-lg border bg-paper-raised px-5 py-4 transition-colors ${
                  isActive ? "border-brass" : "border-line hover:border-brass/40"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 font-mono text-sm text-ink-soft">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">
                          {college.name || "Untitled college"}
                        </p>
                        <p className="mt-0.5 text-sm text-ink-soft">
                          {college.course || "No programme specified"}
                        </p>
                      </div>
                      <StatusSeal status={college.status} />
                    </div>

                    {college.url && (
                      <a
                        href={college.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-brass hover:underline"
                      >
                        <ExternalLink size={11} />
                        {college.url}
                      </a>
                    )}

                    {college.notes && (
                      <p className="mt-2 text-xs text-ink-soft">{college.notes}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => selectAndOpen(college.id)}
                    className="shrink-0 rounded-md border border-brass px-3 py-1.5 text-xs font-medium text-brass transition-colors hover:bg-brass hover:text-paper"
                  >
                    Open in workspace
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="dashed-action"
          >
            <Plus size={14} />
            Add college
          </button>
        </div>
      </div>

      {showAddForm && <AddCollegeForm onClose={() => setShowAddForm(false)} />}
    </div>
  );
}
