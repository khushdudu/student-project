import { Plus, Trash2 } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import SectionCard from "../ui/SectionCard";

export default function TestScoresCard() {
  const testScores = useAppStore((s) => s.profile.testScores);
  const addTestScore = useAppStore((s) => s.addTestScore);
  const updateTestScore = useAppStore((s) => s.updateTestScore);
  const removeTestScore = useAppStore((s) => s.removeTestScore);

  return (
    <SectionCard index={4} title="Test Scores">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-medium text-ink-soft">
              <th className="w-2/5 pb-2 pr-2">Test</th>
              <th className="w-1/4 pb-2 pr-2">Score</th>
              <th className="w-1/4 pb-2 pr-2">Date</th>
              <th className="w-8 pb-2" />
            </tr>
          </thead>
          <tbody className="font-mono text-[13px]">
            {testScores.map((row) => (
              <tr key={row.id} className="border-b border-line/70">
                <td className="py-2 pr-2">
                  <input
                    className="input font-mono"
                    value={row.testName}
                    onChange={(e) => updateTestScore(row.id, { testName: e.target.value })}
                    placeholder="e.g. IELTS"
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className="input font-mono"
                    value={row.score}
                    onChange={(e) => updateTestScore(row.id, { score: e.target.value })}
                    placeholder="e.g. 7.5"
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    type="date"
                    className="input font-mono"
                    value={row.date}
                    onChange={(e) => updateTestScore(row.id, { date: e.target.value })}
                  />
                </td>
                <td className="py-2 text-right">
                  <button
                    type="button"
                    onClick={() => removeTestScore(row.id)}
                    className="rounded p-1.5 text-ink-soft hover:bg-rust-soft hover:text-rust"
                    aria-label="Remove test score"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {testScores.length === 0 && (
          <p className="py-3 text-xs text-ink-soft">No test scores added yet.</p>
        )}
      </div>
      <button
        type="button"
        onClick={addTestScore}
        className="mt-3 flex items-center gap-1 text-xs font-medium text-brass hover:underline"
      >
        <Plus size={13} /> Add row
      </button>
    </SectionCard>
  );
}
