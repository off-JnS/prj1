import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface IframePeekProps {
  url: string;
  fallbackImage?: string;
  title: string;
}

/**
 * Live iframe preview of a real website. Many production sites send
 * `X-Frame-Options: DENY` or `frame-ancestors`; we can't catch that as an
 * error from the parent frame, so we set a 4 s timeout: if the iframe
 * hasn't fired `load` by then we assume it was blocked and swap to the
 * static fallback screenshot.
 *
 * On hover-capable devices the preview is grayscale by default and lifts
 * to color on hover. On touch devices, it always renders in color since
 * there is no hover affordance.
 */
export default function IframePeek({ url, fallbackImage, title }: IframePeekProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "blocked">("loading");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      setStatus((cur) => (cur === "loading" ? "blocked" : cur));
    }, 4000);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [url]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="group relative block aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-black shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] transition-shadow duration-500 hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,1)]"
    >
      {/* iframe peek — scaled down so a full desktop view fits the card */}
      {status !== "blocked" && (
        <div
          className="absolute inset-0 origin-top-left scale-[0.4] transition-[filter,transform] duration-700 ease-out pointer-fine:grayscale group-hover:scale-[0.42] group-hover:grayscale-0"
          style={{ width: "250%", height: "250%" }}
        >
          <iframe
            src={url}
            title={title}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            referrerPolicy="no-referrer"
            onLoad={() => {
              if (timerRef.current) window.clearTimeout(timerRef.current);
              setStatus("loaded");
            }}
            className="pointer-events-none h-full w-full border-0 bg-white"
          />
        </div>
      )}

      {/* fallback when iframe is blocked / never loads */}
      {status === "blocked" &&
        (fallbackImage ? (
          <img
            src={fallbackImage}
            alt={`Vorschau von ${title}`}
            className="h-full w-full object-cover transition-[filter,transform] duration-700 ease-out pointer-fine:grayscale group-hover:scale-[1.04] group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--color-muted)] text-sm text-[var(--color-muted-foreground)]">
            Vorschau nicht verfügbar
          </div>
        ))}

      {/* dim overlay — only on fine-pointer devices so mobile sees the site clearly */}
      <div className="pointer-events-none absolute inset-0 transition-opacity duration-500 pointer-fine:bg-black/30 group-hover:opacity-0" />

      {/* open-link affordance — hidden on touch, shown on hover for mouse users */}
      <span className="pointer-events-none absolute right-4 top-4 hidden translate-y-[-4px] items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black opacity-0 transition-all duration-300 pointer-fine:inline-flex group-hover:translate-y-0 group-hover:opacity-100">
        Live ansehen <ArrowUpRight className="h-3.5 w-3.5" />
      </span>

      {/* loading shimmer */}
      {status === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
      )}
    </a>
  );
}
