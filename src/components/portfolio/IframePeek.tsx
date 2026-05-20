import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface IframePeekProps {
  url: string;
  fallbackImage?: string;
  title: string;
}

/**
 * Live iframe preview — desktop only. On mobile/tablet this renders nothing
 * so no iframes are ever fetched on small screens.
 *
 * On desktop, the iframe is deferred until the card scrolls near the viewport
 * (IntersectionObserver), so all project iframes don't race at page load.
 *
 * Many production sites send `X-Frame-Options: DENY`; we set a 3 s timeout
 * and fall back to a static screenshot if the iframe never fires `load`.
 */
export default function IframePeek({ url, fallbackImage, title }: IframePeekProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [inView, setInView] = useState(false);
  const [status, setStatus] = useState<"loading" | "loaded" | "blocked">("loading");
  const containerRef = useRef<HTMLAnchorElement | null>(null);
  const timerRef = useRef<number | null>(null);

  // Observe the container; start loading the iframe only when near viewport.
  useEffect(() => {
    if (!isDesktop) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isDesktop]);

  // Start the blocked-fallback timer only once the iframe is actually mounted.
  useEffect(() => {
    if (!inView) return;
    setStatus("loading");
    timerRef.current = window.setTimeout(() => {
      setStatus((cur) => (cur === "loading" ? "blocked" : cur));
    }, 3000);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [inView, url]);

  if (!isDesktop) return null;

  return (
    <a
      ref={containerRef}
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="group relative block aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-black shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] transition-shadow duration-500 hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,1)]"
    >
      {/* iframe peek — only mounted once the card is near the viewport */}
      {inView && status !== "blocked" && (
        <div
          className="absolute inset-0 origin-top-left scale-[0.4] transition-[filter,transform] duration-700 ease-out pointer-fine:grayscale group-hover:scale-[0.42] group-hover:grayscale-0"
          style={{ width: "250%", height: "250%" }}
        >
          <iframe
            src={url}
            title={title}
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
      {(status === "blocked" || !inView) &&
        (fallbackImage ? (
          <img
            src={fallbackImage}
            alt={`Vorschau von ${title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-[filter,transform] duration-700 ease-out pointer-fine:grayscale group-hover:scale-[1.04] group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--color-muted)] text-sm text-[var(--color-muted-foreground)]">
            Vorschau nicht verfügbar
          </div>
        ))}

      {/* dim overlay */}
      <div className="pointer-events-none absolute inset-0 transition-opacity duration-500 pointer-fine:bg-black/30 group-hover:opacity-0" />

      {/* open-link affordance */}
      <span className="pointer-events-none absolute right-4 top-4 hidden translate-y-[-4px] items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black opacity-0 transition-all duration-300 pointer-fine:inline-flex group-hover:translate-y-0 group-hover:opacity-100">
        Live ansehen <ArrowUpRight className="h-3.5 w-3.5" />
      </span>

      {/* loading shimmer — shown while iframe is in-view but not yet loaded */}
      {inView && status === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
      )}
    </a>
  );
}
