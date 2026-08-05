import { Check, Upload } from "lucide-react";
import type { UploadedFile } from "../../types";

interface FileUploadProps {
  label: string;
  accept: string;
  file: UploadedFile | null;
  onChange: (file: UploadedFile | null) => void;
}

export default function FileUpload({ label, accept, file, onChange }: FileUploadProps) {
  const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-ink-soft">{label}</label>
      <div className="flex items-center justify-between gap-3 rounded-md border border-dashed border-line px-3 py-3">
        {file ? (
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage">
              <Check size={11} strokeWidth={3} />
            </span>
            <span className="truncate text-sm text-ink">{file.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <Upload size={14} />
            Upload {accept}
          </div>
        )}

        <label
          htmlFor={inputId}
          className="shrink-0 cursor-pointer text-xs font-medium text-brass hover:underline"
        >
          {file ? "Replace" : "Browse"}
          <input
            id={inputId}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onChange({ name: f.name, uploadedAt: new Date().toISOString() });
            }}
          />
        </label>
      </div>
    </div>
  );
}
