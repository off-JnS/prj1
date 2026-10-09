import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  buildPlans,
  carePlans,
  formatEur,
  offerPrice,
  MIN_TERM_MONTHS,
  ROUND_STEP,
} from "@/data/plans";

export const OFFER_FOOTNOTE = `Rabatt gilt bei ${MIN_TERM_MONTHS} Monaten Mindestlaufzeit des Wartungsvertrags. Danach monatlich kündbar. Endpreise auf volle ${ROUND_STEP} € abgerundet – zu deinen Gunsten. Alle Preise zzgl. USt.`;

/**
 * Combination-offer calculator: pick a maintenance package, see what each
 * website build costs with it. Mirrors the pricing model in the sales
 * handbook — same discounts, same round-down-to-250 rule, same wording.
 *
 * Every result row is a link into the contact form with the combination
 * pre-selected, so the whole row is the tap target on touch devices.
 */
export default function OfferCalculator() {
  const [careIndex, setCareIndex] = useState(0);
  const care = carePlans[careIndex];

  const rows = buildPlans.map((plan, i) => {
    const off = care.discounts[i];
    const now = offerPrice(plan.price, off);
    return { plan, off, now, saving: plan.price - now, free: off === 100 };
  });

  const bestSaving = Math.max(...rows.map((row) => row.saving));

  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 sm:p-10">
      <fieldset>
        <legend className="u-kicker">Wartungspaket wählen</legend>

        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
          {carePlans.map((plan, i) => {
            const active = i === careIndex;
            return (
              <button
                key={plan.name}
                type="button"
                aria-pressed={active}
                onClick={() => setCareIndex(i)}
                className={cn(
                  // Compact single row on phones, stacked label/price from sm up.
                  "flex min-h-14 items-center justify-between gap-3 rounded-2xl border px-5 py-3 text-left transition-colors duration-200 sm:flex-col sm:items-start sm:justify-center",
                  active
                    ? "border-[var(--color-foreground)] bg-[var(--color-foreground)] text-[var(--color-background)]"
                    : "border-[var(--color-border)] text-[var(--color-foreground)] hover:border-[var(--color-foreground)]/60",
                )}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.25em]">{plan.name}</span>
                <span
                  className={cn(
                    "text-sm tabular-nums sm:mt-1",
                    active ? "text-[var(--color-background)]/70" : "text-[var(--color-muted-foreground)]",
                  )}
                >
                  {plan.price} €/Mon.
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Results ---------------------------------------------------------- */}
      <div aria-live="polite" className="mt-7 border-t border-[var(--color-border)] sm:mt-8">
        {rows.map(({ plan, off, now, free }) => (
          <Link
            key={plan.name}
            to={`/kontakt?paket=${encodeURIComponent(plan.name)}&wartung=${encodeURIComponent(care.name)}`}
            aria-label={`${plan.name} mit Wartung ${care.name} anfragen — ${free ? "geschenkt" : formatEur(now)}`}
            className="group -mx-2 flex flex-col gap-1.5 rounded-xl border-b border-[var(--color-border)] px-2 py-4 transition-colors last:border-b-0 active:bg-[var(--color-foreground)]/[0.06] sm:mx-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:rounded-none sm:px-0 sm:py-5"
          >
            {/* Line 1 on mobile: name + discount badge */}
            <div className="flex items-baseline justify-between gap-3 sm:justify-start">
              <h3 className="u-display text-xl sm:text-2xl">{plan.name}</h3>
              <span className="rounded-full border border-[var(--color-foreground)]/30 px-2.5 py-0.5 font-mono text-[10px] tabular-nums tracking-[0.1em] sm:hidden">
                −{off} %
              </span>
              <p className="hidden text-sm text-[var(--color-muted-foreground)] sm:block">
                statt <s>{formatEur(plan.price)}</s>
              </p>
            </div>

            {/* Line 2 on mobile: old price + result */}
            <div className="flex items-baseline justify-between gap-4 sm:justify-start">
              <p className="text-sm text-[var(--color-muted-foreground)] sm:hidden">
                statt <s>{formatEur(plan.price)}</s>
              </p>
              <span className="hidden rounded-full border border-[var(--color-foreground)]/30 px-3 py-1 font-mono text-[11px] tabular-nums tracking-[0.1em] sm:inline-block">
                −{off} %
              </span>
              <span
                className={cn(
                  "u-display text-2xl tabular-nums sm:text-3xl",
                  free && "u-serif not-italic",
                )}
              >
                {free ? "geschenkt" : formatEur(now)}
              </span>
              <ArrowRight
                aria-hidden="true"
                className="hidden h-5 w-5 flex-none text-[var(--color-muted-foreground)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-foreground)] sm:block"
              />
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-base leading-relaxed sm:text-lg">
        Mit Wartung {care.name} ({care.price} €/Monat) sparst du bis zu{" "}
        <strong className="font-semibold">{formatEur(bestSaving)}</strong> auf den einmaligen
        Website-Preis.
      </p>

      <p className="mt-4 text-xs leading-relaxed text-[var(--color-muted-foreground)]">
        {OFFER_FOOTNOTE}
      </p>
    </div>
  );
}
