import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useIntro } from "@/lib/intro";

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Intro curtain: counts to 100 while the landing page settles underneath,
 * then lifts. Only mounted for "/" — deep links skip it (see App.tsx).
 * Reduced-motion users get an instant pass-through.
 */
export default function Preloader() {
  const { done, finish } = useIntro();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    // Eased fake progress: fast at first, hesitates near the end.
    let value = 0;
    const id = window.setInterval(() => {
      value = Math.min(100, value + (value < 70 ? 9 + Math.random() * 9 : 3 + Math.random() * 5));
      setProgress(Math.round(value));
      if (value >= 100) {
        window.clearInterval(id);
        window.setTimeout(finish, 200);
      }
    }, 45);

    return () => window.clearInterval(id);
  }, [finish]);

  // Hold the page still while the curtain is up. Lenis scrolls on its own,
  // so overflow:hidden alone doesn't stop the wheel — pause it too, and land
  // on the hero when the curtain lifts.
  useEffect(() => {
    if (done) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    return () => {
      document.body.style.overflow = prev;
      window.__lenis?.start();
      if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    };
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <m.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-black px-6 py-6 text-white sm:px-10 sm:py-8"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.75, ease: EASE }}
          aria-hidden="true"
        >
          <div className="u-kicker text-white/70">
            PRJ1 — Webdesign Studio, Hamburg
          </div>

          <div className="flex items-end justify-between gap-6">
            <m.span
              className="u-display text-[clamp(3rem,10vw,8rem)]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              PRJ1<sup className="align-super text-[0.35em] font-normal">®</sup>
            </m.span>
            <span className="font-mono text-[clamp(2rem,7vw,4.5rem)] tabular-nums leading-none text-white/80">
              {progress}
            </span>
          </div>

          <m.div
            className="h-px w-full origin-left bg-white/30"
            style={{ scaleX: progress / 100 }}
          />
        </m.div>
      )}
    </AnimatePresence>
  );
}
