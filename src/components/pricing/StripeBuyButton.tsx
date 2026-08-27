import { useEffect, useRef, useState } from "react";
import { SITE } from "@/config/site";
import { buyButtonIdFor, planHref, type DiscountTier, type Plan } from "@/data/plans";

const BUY_BUTTON_SRC = "https://js.stripe.com/v3/buy-button.js";

let scriptPromise: Promise<void> | null = null;

/**
 * Loads Stripe's Buy Button script exactly once, and only when a visitor has
 * actually reached for checkout.
 *
 * Deliberately *not* loaded on page view: third-party JS that only exists to
 * serve a payment the visitor asked for is defensible under DSGVO, a script
 * fetched speculatively on every page load is not. It also keeps Stripe off
 * the critical path for everyone who never buys.
 */
function loadBuyButtonScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${BUY_BUTTON_SRC}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = BUY_BUTTON_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      // Allow a later attempt — a blocked request now (offline, blocker,
      // consent tool) should not permanently disable checkout.
      scriptPromise = null;
      reject(new Error("Stripe Buy Button script failed to load"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

interface CheckoutButtonProps {
  plan: Plan;
  tier: DiscountTier;
  /** Styling for the fallback link — the Buy Button brings its own. */
  className?: string;
  children: React.ReactNode;
}

/**
 * The checkout slot for a pricing card.
 *
 * With a publishable key in src/config/site.ts and a Buy Button ID on the
 * plan, this mounts Stripe's `<stripe-buy-button>` embed. Without either — the
 * state the repo ships in — it renders the plain link it always did, pointing
 * at a Payment Link or a pre-filled e-mail. Nothing about the cards changes
 * until those values are filled in.
 *
 * See DEPLOY.md for where each value comes from, including the `?beleg=`
 * success URL that drives the receipt.
 */
export default function StripeBuyButton({ plan, tier, className, children }: CheckoutButtonProps) {
  const buyButtonId = buyButtonIdFor(plan, tier);
  const publishableKey = SITE.stripePublishableKey;
  const canEmbed = Boolean(buyButtonId && publishableKey);

  const [scriptReady, setScriptReady] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canEmbed) return;
    let cancelled = false;

    // The embed is below the fold on most viewports; load the script when the
    // card scrolls into view rather than on mount.
    const host = hostRef.current;
    if (!host) return;

    const start = () => {
      loadBuyButtonScript().then(
        () => !cancelled && setScriptReady(true),
        () => !cancelled && setScriptFailed(true),
      );
    };

    if (typeof IntersectionObserver === "undefined") {
      start();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          start();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(host);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [canEmbed]);

  // Fallback link — also the recovery path if Stripe's script never arrives.
  if (!canEmbed || scriptFailed) {
    return (
      <a href={planHref(plan, tier)} className={className}>
        {children}
      </a>
    );
  }

  return (
    <div ref={hostRef} className="mt-10">
      {scriptReady ? (
        <stripe-buy-button buy-button-id={buyButtonId} publishable-key={publishableKey} />
      ) : (
        // Reserve the row so the card doesn't jump when the embed mounts.
        <div className="min-h-12" aria-hidden="true" />
      )}
    </div>
  );
}
