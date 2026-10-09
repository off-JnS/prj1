import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Lenis smooth scrolling, driven by its own requestAnimationFrame loop
 * (`autoRaf`). Lenis scrolls the native window, so scroll-linked effects
 * (framer-motion's useScroll) just follow the regular scroll events.
 * Skipped entirely for reduced-motion users and for coarse pointers — touch
 * scrolling is already smooth and Lenis only adds an instance plus a
 * permanent rAF loop there. `window.__lenis` then stays undefined, which
 * every call site already handles.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({ lerp: 0.115, wheelMultiplier: 1, autoRaf: true });
    window.__lenis = lenis;

    return () => {
      // destroy() also cancels the autoRaf loop.
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
}

/** Smooth-scroll to an element, routed through Lenis when active. */
export function scrollToElement(el: HTMLElement) {
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -24 });
  else el.scrollIntoView({ behavior: "smooth" });
}
