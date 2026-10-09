import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import {
  animate,
  stagger,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";

const DIM = 0.14;

type Mode = "static" | "reveal" | "scrub";

function getMode(): Mode {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
  // A scrub recomputes every frame the paragraph is on screen. On touch
  // devices the same reveal plays once and then costs nothing for the rest
  // of the scroll.
  if (window.matchMedia("(pointer: coarse)").matches) return "reveal";
  return "scrub";
}

const wordsOf = (el: HTMLElement | null) =>
  el ? Array.from(el.querySelectorAll<HTMLElement>("[data-word]")) : [];

/**
 * Scroll-scrubbed word reveal: words brighten one by one while the paragraph
 * moves through the viewport. Words wrapped in *asterisks* render in the
 * serif accent voice.
 */
export default function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [mode] = useState(getMode);

  return (
    <>
      <p ref={ref} className={className}>
        {text.split(" ").map((word, i) => {
          const serif = word.startsWith("*") && word.replace(/[.,—!?]/g, "").endsWith("*");
          const clean = word.replaceAll("*", "");
          return (
            <span key={i}>
              <span data-word className={`inline-block ${serif ? "u-serif" : ""}`}>
                {clean}
              </span>{" "}
            </span>
          );
        })}
      </p>
      {/* Keyed by text so a new text re-runs the setup on the fresh words. */}
      {mode === "scrub" && <Scrub key={text} target={ref} />}
      {mode === "reveal" && <Reveal key={text} target={ref} />}
    </>
  );
}

/**
 * Desktop: opacity scrubbed by scroll progress from "top 78%" to
 * "bottom 45%", staggered word by word, with a short spring as catch-up
 * smoothing. Writes straight to the DOM from motion-value changes — no React
 * re-renders while scrolling, and no work at all once the spring settles.
 */
function Scrub({ target }: { target: RefObject<HTMLElement> }) {
  const { scrollYProgress } = useScroll({ target, offset: ["start 78%", "end 45%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 22, restDelta: 0.0005 });
  const words = useRef<HTMLElement[]>([]);

  const apply = (p: number) => {
    const els = words.current;
    // Each word fades over 0.5 units, starting 0.05 after the previous one.
    const total = 0.5 + (els.length - 1) * 0.05;
    const t = p * total;
    for (let i = 0; i < els.length; i++) {
      const k = Math.min(1, Math.max(0, (t - i * 0.05) / 0.5));
      els[i].style.opacity = (DIM + (1 - DIM) * k).toFixed(3);
    }
  };

  useLayoutEffect(() => {
    words.current = wordsOf(target.current);
    apply(progress.get());
    const els = words.current;
    return () => els.forEach((w) => (w.style.opacity = ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(progress, "change", apply);
  return null;
}

/** Touch: one staggered fade-in once the paragraph's top passes 85%. */
function Reveal({ target }: { target: RefObject<HTMLElement> }) {
  const inView = useInView(target, { once: true, margin: "0px 0px -15% 0px" });

  useLayoutEffect(() => {
    const els = wordsOf(target.current);
    els.forEach((w) => (w.style.opacity = String(DIM)));
    return () => els.forEach((w) => (w.style.opacity = ""));
  }, [target]);

  useLayoutEffect(() => {
    if (!inView) return;
    const els = wordsOf(target.current);
    if (!els.length) return;
    const controls = animate(
      els,
      { opacity: [DIM, 1] },
      // power2.out ≈ easeOutCubic
      { duration: 0.5, delay: stagger(0.03), ease: [0.33, 1, 0.68, 1] },
    );
    return () => controls.stop();
  }, [inView, target]);

  return null;
}
