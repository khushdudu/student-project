import { useState } from "react";
import ChatPanel from "../components/workspace/ChatPanel";
import OutputPanel from "../components/workspace/OutputPanel";
import CollegeSheet from "../components/workspace/CollegeSheet";
import { useAppStore } from "../store/useAppStore";

export default function Workspace() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeCollegeId = useAppStore((s) => s.activeCollegeId);
  const generatedOutputs = useAppStore((s) => s.generatedOutputs);

  const hasOutput = Boolean(activeCollegeId && generatedOutputs[activeCollegeId]?.letter);

  return (
    <div className="relative flex h-full overflow-hidden">
      <CollegeSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />

      <div className={`flex h-full flex-1 flex-col transition-all duration-300 ${hasOutput ? "mr-[440px]" : ""}`}>
        <ChatPanel onOpenColleges={() => setSheetOpen(true)} />
      </div>

      {hasOutput && (
        <div className="absolute right-0 top-0 h-full w-[440px] border-l border-line">
          <OutputPanel />
        </div>
      )}
    </div>
  );
}
