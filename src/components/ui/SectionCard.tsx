import type { ReactNode } from "react";

interface SectionCardProps {
  index: number;
  title: string;
  children: ReactNode;
}

export default function SectionCard({ index, title, children }: SectionCardProps) {
  return (
    <section className="rounded-lg border border-line bg-paper-raised px-6 py-6">
      <p className="eyebrow">Section {String(index).padStart(2, "0")}</p>
      <h2 className="mt-1 font-display text-xl font-medium text-ink">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
