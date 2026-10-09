import { useLayoutEffect, useState } from "react";

export function useMediaQuery(query: string) {
  // Initialise synchronously so the correct value is available on first render
  // (avoids a flash where the wrong layout/component is shown for one frame).
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useLayoutEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/**
 * True on devices with a real, hoverable pointer — i.e. a mouse or trackpad.
 * Every pointer-driven effect (custom cursor, click sparks, magnetic hover)
 * keys off this, and so does the `cursor: none` block in index.css.
 */
export function usePointerFine() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/** True on touch screens and other coarse pointers. */
export function usePointerCoarse() {
  return useMediaQuery("(pointer: coarse)");
}
