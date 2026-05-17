import { Quote } from "lucide-react";

interface TestimonialTextProps {
  quote: string;
  authorName: string;
  authorRole?: string;
}

export default function TestimonialText({ quote, authorName, authorRole }: TestimonialTextProps) {
  return (
    <figure className="flex h-full flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8">
      <Quote className="h-7 w-7 text-[var(--color-foreground)] opacity-50" aria-hidden />
      <blockquote className="mt-4 text-base leading-relaxed text-[var(--color-foreground)] sm:text-lg">
        “{quote}”
      </blockquote>
      <figcaption className="mt-6 border-t border-[var(--color-border)] pt-4">
        <div className="text-sm font-semibold text-[var(--color-foreground)]">{authorName}</div>
        {authorRole && (
          <div className="text-xs text-[var(--color-muted-foreground)]">{authorRole}</div>
        )}
      </figcaption>
    </figure>
  );
}
