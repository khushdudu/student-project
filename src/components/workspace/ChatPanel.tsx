import { useEffect, useRef, useState } from "react";
import { Send, GraduationCap } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import LetterPreviewBlock from "./LetterPreviewBlock";

interface ChatPanelProps {
  onOpenColleges: () => void;
}

export default function ChatPanel({ onOpenColleges }: ChatPanelProps) {
  const colleges = useAppStore((s) => s.colleges);
  const activeCollegeId = useAppStore((s) => s.activeCollegeId);
  const chatMessages = useAppStore((s) => s.chatMessages);
  const sendMessage = useAppStore((s) => s.sendMessage);
  const isAgentTyping = useAppStore((s) => s.isAgentTyping);
  const profile = useAppStore((s) => s.profile);

  const activeCollege = colleges.find((c) => c.id === activeCollegeId) ?? null;
  const messages = activeCollegeId
    ? chatMessages.filter((m) => m.collegeId === activeCollegeId)
    : [];

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, isAgentTyping]);

  const handleSend = () => {
    if (!input.trim() || !activeCollegeId) return;
    sendMessage(input);
    setInput("");
  };

  const firstName = profile.fullName?.split(" ")[0] || "there";

  return (
    <div className="flex h-full flex-col bg-paper">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 className="font-display text-base font-medium text-ink">Chat</h2>
        <button
          type="button"
          onClick={onOpenColleges}
          className="flex items-center gap-2 rounded-full border border-line bg-paper-raised px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brass hover:text-brass"
        >
          <GraduationCap size={13} />
          {activeCollege
            ? `${activeCollege.name}${activeCollege.course ? ` — ${activeCollege.course}` : ""}`
            : "Select college"}
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-2xl space-y-6">

          {/* Welcome message — always shown */}
          <WelcomeMessage
            firstName={firstName}
            hasColleges={colleges.length > 0}
            activeCollege={activeCollege}
            onOpenColleges={onOpenColleges}
          />

          {/* Conversation */}
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              content={message.content}
              role={message.role}
              letterPreview={message.letterPreview}
              studentName={profile.fullName}
            />
          ))}

          {isAgentTyping && (
            <div className="flex flex-col items-start">
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
                Agent
              </p>
              <div className="inline-block rounded-xl border border-line bg-paper-raised px-4 py-3 text-sm text-ink-soft">
                Thinking…
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-line bg-paper px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-end gap-3">
          <textarea
            className="input min-h-[44px] max-h-36 flex-1 resize-none"
            placeholder={
              activeCollege
                ? `Message about ${activeCollege.name}…`
                : "Select a college above to start…"
            }
            value={input}
            disabled={!activeCollege}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!activeCollege || !input.trim()}
            className="btn-fill h-11 shrink-0 !px-4"
          >
            <Send size={14} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function WelcomeMessage({
  firstName,
  hasColleges,
  activeCollege,
  onOpenColleges,
}: {
  firstName: string;
  hasColleges: boolean;
  activeCollege: { name: string; course: string } | null;
  onOpenColleges: () => void;
}) {
  return (
    <div className="flex flex-col items-start">
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
        Agent
      </p>
      <div className="rounded-xl border border-line bg-paper-raised px-4 py-3 text-sm leading-relaxed text-ink">
        <p>
          Hi {firstName}! I'm your application agent. I can help you draft motivational letters,
          suggest CV edits, and tailor your application to each programme.
        </p>
        {activeCollege ? (
          <p className="mt-2 text-ink-soft">
            You're working on{" "}
            <span className="font-medium text-ink">{activeCollege.name}</span>
            {activeCollege.course && ` — ${activeCollege.course}`}. What would you like to do?
          </p>
        ) : hasColleges ? (
          <p className="mt-2">
            <button
              type="button"
              onClick={onOpenColleges}
              className="font-medium text-brass underline-offset-2 hover:underline"
            >
              Select a college from your list
            </button>{" "}
            to get started.
          </p>
        ) : (
          <p className="mt-2">
            <button
              type="button"
              onClick={onOpenColleges}
              className="font-medium text-brass underline-offset-2 hover:underline"
            >
              Add your first college
            </button>{" "}
            to get started.
          </p>
        )}
      </div>
    </div>
  );
}

function ChatBubble({
  content,
  role,
  letterPreview,
  studentName,
}: {
  content: string;
  role: "user" | "agent";
  letterPreview?: { version: number; letter: string };
  studentName: string;
}) {
  const isUser = role === "user";

  return (
    <div className={isUser ? "flex flex-col items-end" : "flex flex-col items-start"}>
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
        {isUser ? studentName || "You" : "Agent"}
      </p>
      <div
        className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
          isUser ? "bg-ink text-paper" : "border border-line bg-paper-raised text-ink"
        }`}
      >
        {content}
      </div>
      {letterPreview && (
        <div className="mt-2 w-full max-w-[85%]">
          <LetterPreviewBlock preview={letterPreview} />
        </div>
      )}
    </div>
  );
}
