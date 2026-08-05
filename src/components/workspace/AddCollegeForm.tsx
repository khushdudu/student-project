import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import Modal from "../ui/Modal";

interface AddCollegeFormProps {
  onClose: () => void;
}

export default function AddCollegeForm({ onClose }: AddCollegeFormProps) {
  const addCollege = useAppStore((s) => s.addCollege);
  const addCollegesBulk = useAppStore((s) => s.addCollegesBulk);

  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [bulkText, setBulkText] = useState("");

  const submitSingle = () => {
    if (!name.trim()) return;
    addCollege({ name: name.trim(), course: course.trim(), url: url.trim(), notes: notes.trim() });
    onClose();
  };

  const submitBulk = () => {
    if (!bulkText.trim()) return;
    addCollegesBulk(bulkText);
    onClose();
  };

  return (
    <Modal title="Add college" onClose={onClose}>
      <div className="mb-4 flex gap-1 rounded-md bg-paper p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode("single")}
          className={`flex-1 rounded py-1.5 font-medium transition-colors ${
            mode === "single" ? "bg-paper-raised text-ink shadow-sm" : "text-ink-soft"
          }`}
        >
          Single
        </button>
        <button
          type="button"
          onClick={() => setMode("bulk")}
          className={`flex-1 rounded py-1.5 font-medium transition-colors ${
            mode === "bulk" ? "bg-paper-raised text-ink shadow-sm" : "text-ink-soft"
          }`}
        >
          Bulk paste
        </button>
      </div>

      {mode === "single" ? (
        <div className="space-y-3">
          <input
            className="input"
            placeholder="College name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Course / programme"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
          <input
            className="input"
            placeholder="Website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <textarea
            className="input min-h-[70px] resize-none"
            placeholder="Optional notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button type="button" onClick={submitSingle} className="btn-brass w-full">
            Add college
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-ink-soft">
            One college per line: <span className="font-mono">College | Course | URL</span>
          </p>
          <textarea
            className="input min-h-[140px] resize-none font-mono text-xs"
            placeholder={"Imperial College London | MSc Computer Science | https://imperial.ac.uk\nTU Delft | MSc Robotics | https://tudelft.nl"}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
          />
          <button type="button" onClick={submitBulk} className="btn-brass w-full">
            Add colleges
          </button>
        </div>
      )}
    </Modal>
  );
}
