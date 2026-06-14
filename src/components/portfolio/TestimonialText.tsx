interface TestimonialTextProps {
  quote: string;
  authorName: string;
  authorRole?: string;
}

export default function TestimonialText({ quote, authorName, authorRole }: TestimonialTextProps) {
  return (
    <figure className="flex h-full flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-7 sm:p-10">
      <span aria-hidden="true" className="u-serif text-5xl leading-none text-[var(--color-muted-foreground)]">
        “
      </span>
      <blockquote className="u-serif mt-2 text-xl leading-snug text-[var(--color-foreground)] sm:text-2xl">
        {quote}
      </blockquote>
      <figcaption className="mt-8 flex items-baseline gap-3 border-t border-[var(--color-border)] pt-5">
        <div className="text-sm font-semibold text-[var(--color-foreground)]">{authorName}</div>
        {authorRole && (
          <div className="u-kicker !tracking-[0.15em]">{authorRole}</div>
        )}
      </figcaption>
    </figure>
  );
}
