import { useEffect, useState } from "react";
import { X, Plus, ExternalLink } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import StatusSeal from "../StatusSeal";
import AddCollegeForm from "./AddCollegeForm";

interface CollegeSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function CollegeSheet({ open, onClose }: CollegeSheetProps) {
  const colleges = useAppStore((s) => s.colleges);
  const activeCollegeId = useAppStore((s) => s.activeCollegeId);
  const setActiveCollege = useAppStore((s) => s.setActiveCollege);
  const [showAddForm, setShowAddForm] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 z-20 bg-ink/30 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`absolute left-0 top-0 z-30 flex h-full w-[360px] flex-col border-r border-line bg-paper-raised shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-5">
          <div>
            <p className="eyebrow">College List</p>
            <h2 className="mt-1 font-display text-lg font-medium text-ink">Applications</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-ink-soft hover:bg-line/50 hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        {/* List */}
        <ul className="flex-1 divide-y divide-line overflow-y-auto">
          {colleges.length === 0 && (
            <li className="px-5 py-8 text-center text-sm text-ink-soft">
              No colleges added yet.
            </li>
          )}
          {colleges.map((college, index) => {
            const isActive = college.id === activeCollegeId;
            return (
              <li key={college.id}>
                <button
                  type="button"
                  onClick={() => { setActiveCollege(college.id); onClose(); }}
                  className={`w-full px-5 py-4 text-left transition-colors ${
                    isActive ? "bg-brass-soft/50" : "hover:bg-paper"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 font-mono text-xs text-ink-soft">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">
                        {college.name || "Untitled college"}
                      </p>
                      <p className="truncate text-xs text-ink-soft">
                        {college.course || "No programme specified"}
                      </p>
                      {college.url && (
                        <a
                          href={college.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 inline-flex items-center gap-1 text-[11px] text-brass hover:underline"
                        >
                          <ExternalLink size={10} />
                          Programme page
                        </a>
                      )}
                      <div className="mt-2">
                        <StatusSeal status={college.status} />
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="border-t border-line p-4">
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
    </>
  );
}
