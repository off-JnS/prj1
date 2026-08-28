import { useCallback, useSyncExternalStore } from "react";
import { isDiscountTier, type DiscountTier } from "@/data/plans";

const STORAGE_KEY = "prj1-discount";

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
 * price it buys is a game that works with no backend. The game is replayable
 * on every reload, so a patient visitor reaches 20% regardless — treat the
 * tier as a marketing gesture, not a guarded asset.
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

/**
 * A local write, where we already know the resulting value.
 *
 * Seeding the cache rather than invalidating it is what keeps the tier alive
 * when storage is blocked (private mode, cookies off, enterprise policy).
 * Invalidating would send the next read back to `readStorage()`, which throws
 * and yields 0 — so a win would evaporate before the next render.
 */
function publish(value: DiscountTier) {
  snapshot = value;
  for (const notify of listeners) notify();
}

/**
 * An external change — another tab wrote to storage. The new value is unknown
 * here, so invalidating and re-reading is the correct move.
 */
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

/**
 * Bank the result of a game. A tier already held acts as a floor: a fresh
 * hand can raise it, never lower it.
 *
 * This is what makes unlimited replay safe to offer. Double-or-nothing still
 * carries real stakes *inside* a single game — win 10, gamble it, lose, and
 * that game yields 0 — but it cannot claw back a tier won on an earlier
 * visit. Losing a discount you already hold because you idly played again
 * reads as the site cheating you.
 *
 * Returns the tier actually in force afterwards, so the UI can tell the
 * player which of the two things happened.
 */
export function bankDiscount(result: DiscountTier): DiscountTier {
  const held = getSnapshot();
  const next = (result > held ? result : held) as DiscountTier;

  if (next !== held) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ tier: next, wonAt: Date.now() } satisfies DiscountRecord),
      );
    } catch {
      /* storage blocked — `publish` still keeps the tier for this page */
    }
    publish(next);
  }
  return next;
}

/** Drop the stored discount outright. Only used by `clear()`. */
export function writeDiscount(tier: DiscountTier) {
  try {
    if (tier === 0) localStorage.removeItem(STORAGE_KEY);
    else
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ tier, wonAt: Date.now() } satisfies DiscountRecord),
      );
  } catch {
    /* storage blocked — `publish` still keeps the tier for this page */
  }
  publish(tier);
}

export function useDiscount() {
  const tier = useSyncExternalStore(subscribe, getSnapshot, () => 0 as DiscountTier);

  const setTier = useCallback((next: DiscountTier) => writeDiscount(next), []);
  const clear = useCallback(() => writeDiscount(0), []);

  return { tier, setTier, clear };
}
