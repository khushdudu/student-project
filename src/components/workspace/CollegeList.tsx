import { useState } from "react";
import { Plus } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import StatusSeal from "../StatusSeal";
import AddCollegeForm from "./AddCollegeForm";

export default function CollegeList() {
  const colleges = useAppStore((s) => s.colleges);
  const activeCollegeId = useAppStore((s) => s.activeCollegeId);
  const setActiveCollege = useAppStore((s) => s.setActiveCollege);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="flex h-full w-[300px] shrink-0 flex-col border-r border-line bg-paper-raised">
      <div className="border-b border-line px-5 py-5">
        <p className="eyebrow">College List</p>
        <h2 className="mt-1 font-display text-lg font-medium text-ink">Applications</h2>
      </div>

      <ul className="flex-1 divide-y divide-line overflow-y-auto">
        {colleges.map((college, index) => {
          const isActive = college.id === activeCollegeId;
          return (
            <li key={college.id}>
              <button
                type="button"
                onClick={() => setActiveCollege(college.id)}
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

      <div className="border-t border-line p-4">
        <button type="button" onClick={() => setShowAddForm(true)} className="dashed-action">
          <Plus size={14} />
          Add college
        </button>
      </div>

      {showAddForm && <AddCollegeForm onClose={() => setShowAddForm(false)} />}
    </div>
  );
}
