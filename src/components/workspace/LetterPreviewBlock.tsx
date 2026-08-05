import type { LetterPreview } from "../../types";

export default function LetterPreviewBlock({ preview }: { preview: LetterPreview }) {
  return (
    <div className="mt-2 overflow-hidden rounded-md border border-line border-l-[3px] border-l-brass bg-paper-raised">
      <div className="border-b border-line bg-paper px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
          Motivational letter — draft v{preview.version}
        </span>
      </div>
      <pre className="whitespace-pre-wrap px-5 py-4 font-display text-[15px] leading-relaxed text-ink">
        {preview.letter}
      </pre>
    </div>
  );
}
