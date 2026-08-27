import { useEffect, useState } from "react";

/**
 * Pointer-capability detection for the cursor effects.
 *
 * Media queries alone are not enough: hybrid devices (touch laptops, iPads
 * with a trackpad, Windows convertibles) report `hover: hover` *and*
 * `pointer: fine`, so a media query on its own leaves a stuck cursor dot and
 * spark bursts on every tap. We therefore combine three signals:
 *
 *   1. `(hover: hover) and (pointer: fine)` — a precise, hovering pointer.
 *   2. `not (pointer: coarse)` — no touch digitiser as the *primary* input.
 *   3. A one-way latch on the first `touchstart` ever seen.
 *
 * The latch is deliberately irreversible for the lifetime of the page: once
 * someone has touched the screen, the effects stay off even if they pick the
 * mouse back up. Flickering them back on mid-session is worse than losing them.
 */

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const COARSE_POINTER_QUERY = "(pointer: coarse)";

let touched = false;
const listeners = new Set<() => void>();

/** True once the user has touched the screen — never resets. */
export function hasTouched() {
  return touched;
}

function onFirstTouch() {
  if (touched) return;
  touched = true;
  // CSS hook: `html[data-touch]` cancels the `cursor: none` rules in index.css.
  document.documentElement.dataset.touch = "1";
  window.removeEventListener("touchstart", onFirstTouch);
  for (const notify of listeners) notify();
}

if (typeof window !== "undefined") {
  window.addEventListener("touchstart", onFirstTouch, { passive: true, once: true });
}

/** Media-query half of the check, without the touch latch. */
function matchesFineQueries() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia(FINE_POINTER_QUERY).matches &&
    !window.matchMedia(COARSE_POINTER_QUERY).matches
  );
}

/**
 * Non-reactive check — for event handlers and module-level guards where a
 * hook would be the wrong shape.
 */
export function isFinePointer() {
  return !touched && matchesFineQueries();
}

/**
 * Reactive version. Initialises synchronously so the cursor never flashes in
 * for a frame on touch devices, then re-renders if the pointer type changes
 * (external mouse plugged in) or the touch latch trips.
 */
export function useFinePointer() {
  const [fine, setFine] = useState(isFinePointer);

  useEffect(() => {
    const update = () => setFine(isFinePointer());
    update();

    const fineMql = window.matchMedia(FINE_POINTER_QUERY);
    const coarseMql = window.matchMedia(COARSE_POINTER_QUERY);
    fineMql.addEventListener("change", update);
    coarseMql.addEventListener("change", update);
    listeners.add(update);

    return () => {
      fineMql.removeEventListener("change", update);
      coarseMql.removeEventListener("change", update);
      listeners.delete(update);
    };
  }, []);

  return fine;
}
