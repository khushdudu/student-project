import { useAppStore } from "../store/useAppStore";

export default function Toast() {
  const toast = useAppStore((s) => s.toast);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50">
      <div
        className={`pointer-events-auto rounded-md border px-4 py-3 text-sm font-medium shadow-lg transition-all duration-300 ${
          toast
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-1 opacity-0"
        } ${
          toast?.tone === "sage"
            ? "border-sage/30 bg-sage-soft text-sage"
            : "border-ink/10 bg-ink text-paper"
        }`}
      >
        {toast?.message ?? ""}
      </div>
    </div>
  );
}
