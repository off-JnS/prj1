import { useEffect, useRef } from "react";
import { useFinePointer } from "@/lib/pointer";

/**
 * Small white dot that follows the pointer. Renders only on hover-capable,
 * fine-pointer devices — touch screens skip it entirely, including hybrids
 * that advertise a fine pointer but are actually being tapped (see
 * `@/lib/pointer`). The click feedback is handled by ClickSpark, so this
 * stays still on press.
 *
 * Scroll animation: the dot stretches into a vertical capsule while the page
 * is scrolling, with stretch proportional to scroll velocity. Area-preserving
 * (`scale(1/√s, s)`) keeps it from visually ballooning. Velocity decays each
 * frame, so the dot eases back to a circle within ~150 ms of stopping.
 *
 * Hover feedback: the dot swells over anything interactive. Without it the
 * cursor reads as broken rather than deliberate — Design Guideline —
 * Pointing Devices: "Provide a consistent experience in your app, whether
 * people are using gestures, eyes, a pointing device, or a keyboard."
 */

/** Anything that should make the dot swell. */
const INTERACTIVE =
  'a, button, summary, label, select, [role="button"], [role="link"], [data-cursor-hover]';
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const enabled = useFinePointer();

  useEffect(() => {
    if (!enabled) return;

    let mx = -100;
    let my = -100;
    let velocity = 0; // px / ms, signed (direction unused — we only use |velocity|)
    let raf = 0;
    let hover = 1; // multiplier, eased toward the target each frame
    let hoverTarget = 1;

    let lastScrollY = window.scrollY;
    let lastScrollT = performance.now();

    const tick = () => {
      raf = 0;
      // decay scroll velocity each frame
      velocity *= 0.85;
      hover += (hoverTarget - hover) * 0.18;

      const stretch = Math.min(2.4, 1 + Math.abs(velocity) * 0.35);
      const inv = 1 / Math.sqrt(stretch);

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate3d(${mx - 4}px, ${my - 4}px, 0) scale(${inv * hover}, ${stretch * hover})`;
      }

      // keep ticking while the capsule or the hover swell is still settling,
      // so both play out even if the pointer is stationary
      if ((Math.abs(velocity) > 0.05 || Math.abs(hoverTarget - hover) > 0.01) && !raf) {
        raf = requestAnimationFrame(tick);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const target = e.target;
      hoverTarget =
        target instanceof Element && target.closest(INTERACTIVE) ? 2.6 : 1;
      schedule();
    };

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastScrollT);
      const dy = window.scrollY - lastScrollY;
      // `velocity` is overwritten (not accumulated) so a sudden stop reads as
      // 0 immediately and the natural decay handles the easing.
      velocity = dy / dt;
      lastScrollY = window.scrollY;
      lastScrollT = now;
      schedule();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[101] h-2 w-2 rounded-full bg-white mix-blend-difference"
      style={{
        willChange: "transform",
        transform: "translate3d(-100px, -100px, 0)",
      }}
    />
  );
}
