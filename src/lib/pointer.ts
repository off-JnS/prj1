import { useEffect, useState } from "react";

/**
 * Which input device is driving right now.
 *
 * The previous version got this wrong twice, and both mistakes killed the
 * cursor on perfectly ordinary desktops:
 *
 *   1. It required `not (pointer: coarse)`. Touch-capable laptops report a
 *      coarse pointer even with a mouse attached, so they lost the cursor
 *      entirely.
 *   2. The first `touchstart` disabled the cursor *permanently*. One
 *      accidental brush of the screen and it never came back until reload.
 *
 * So this tracks the **currently active** device instead of trying to
 * classify the hardware once. A mouse event turns the custom cursor on; a
 * touch or pen event turns it off. It recovers in both directions, which is
 * exactly what a hybrid device needs. Media queries only supply the initial
 * guess, before any input has been seen.
 *
 * `html[data-cursor="custom"]` is the single CSS hook — see index.css.
 */

const FINE_QUERY = "(hover: hover) and (pointer: fine)";

let fine = false;
const listeners = new Set<() => void>();

function setAttribute() {
  const root = document.documentElement;
  if (fine) root.dataset.cursor = "custom";
  else delete root.dataset.cursor;
}

function apply(next: boolean) {
  if (next === fine) return;
  fine = next;
  setAttribute();
  for (const notify of listeners) notify();
}

function onPointer(e: PointerEvent) {
  // Pen counts as touch here: it lives on touchscreens, and the ask was to
  // drop the pointer effects whenever a touch screen is in play.
  apply(e.pointerType === "mouse");
}

if (typeof window !== "undefined") {
  fine = window.matchMedia(FINE_QUERY).matches;
  setAttribute();

  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerdown", onPointer, { passive: true });

  // A mouse plugged in (or unplugged) after load changes the answer.
  const mql = window.matchMedia(FINE_QUERY);
  mql.addEventListener("change", (e) => apply(e.matches));
}

/** Non-reactive read, for event handlers and module-level guards. */
export function isFinePointer() {
  return fine;
}

/** Reactive read. Initialises synchronously so nothing flashes for a frame. */
export function useFinePointer() {
  const [value, setValue] = useState(isFinePointer);

  useEffect(() => {
    const update = () => setValue(isFinePointer());
    update();
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  return value;
}
