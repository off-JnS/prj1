import { useCallback, useSyncExternalStore } from "react";
import { isDiscountTier, type DiscountTier } from "@/data/plans";

const STORAGE_KEY = "prj1-discount";
const PLAYED_KEY = "prj1-discount-played";

/** A won discount is honoured for a week. */
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

interface DiscountRecord {
  tier: DiscountTier;
  wonAt: number;
}

/**
 * The discount won in the pricing game.
 *
 * Deliberately `localStorage`, not `sessionStorage`: the visitor leaves the
 * site entirely for Stripe's checkout and comes back on a fresh page load,
 * and the receipt has to know which tier they bought at. The one-play-per-
 * session guard below *is* session-scoped — different lifetime, different
 * store.
 *
 * A client-side discount is trivially forgeable. That is an accepted trade:
 * the worst case is honouring a discount that was on offer anyway, and the
 * price it buys is a game that works with no backend.
 */

// Cached so useSyncExternalStore's getSnapshot stays referentially stable.
let snapshot: DiscountTier | null = null;
const listeners = new Set<() => void>();

function readStorage(): DiscountTier {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as Partial<DiscountRecord>;
    if (!isDiscountTier(parsed.tier) || typeof parsed.wonAt !== "number") return 0;
    if (Date.now() - parsed.wonAt > MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return 0;
    }
    return parsed.tier;
  } catch {
    // Storage blocked (private mode, cookie settings) — no discount, no crash.
    return 0;
  }
}

function getSnapshot(): DiscountTier {
  if (snapshot === null) snapshot = readStorage();
  return snapshot;
}

function emit() {
  snapshot = null;
  for (const notify of listeners) notify();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Keep tabs in sync — someone may play the game in a second tab.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** Persist a won tier. Passing 0 clears it (a lost double-or-nothing). */
export function writeDiscount(tier: DiscountTier) {
  try {
    if (tier === 0) localStorage.removeItem(STORAGE_KEY);
    else
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ tier, wonAt: Date.now() } satisfies DiscountRecord),
      );
  } catch {
    /* storage blocked — the tier still applies for this page's lifetime */
  }
  emit();
}

/** True once the visitor has played this session — one attempt, no re-rolls. */
export function hasPlayedThisSession(): boolean {
  try {
    return sessionStorage.getItem(PLAYED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markPlayedThisSession() {
  try {
    sessionStorage.setItem(PLAYED_KEY, "1");
  } catch {
    /* storage blocked — the in-memory game state still prevents a re-roll */
  }
}

export function useDiscount() {
  const tier = useSyncExternalStore(subscribe, getSnapshot, () => 0 as DiscountTier);

  const setTier = useCallback((next: DiscountTier) => writeDiscount(next), []);
  const clear = useCallback(() => writeDiscount(0), []);

  return { tier, setTier, clear };
}
