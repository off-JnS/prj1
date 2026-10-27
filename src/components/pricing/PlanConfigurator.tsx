import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/Reveal";
import {
  buildPlans,
  buildPriceWith,
  carePlans,
  checkoutHref,
  formatEur,
  MIN_TERM_MONTHS,
  PRICE_NOTICE,
  type BuildPlan,
  type CarePlan,
} from "@/data/plans";

const DEFAULT_CARE = carePlans.find((p) => p.isPopular) ?? null;

/**
 * Pricing at a glance: one maintenance switch (like a monthly/yearly
 * toggle), three website cards whose prices follow it. Every card books
 * its own combination — the plain build link without maintenance, the
 * combination link with it — so a monthly plan can never be bought alone.
 */
export default function PlanConfigurator() {
  const [care, setCare] = useState<CarePlan | null>(DEFAULT_CARE);
  const options: (CarePlan | null)[] = [null, ...carePlans];

  return (
    <div>
      {/* Maintenance switch — the pill sticks on phones so it stays next to the cards */}
      <p className="text-center text-xl font-semibold tracking-tight sm:text-2xl">Wartung dazu?</p>
      <div className="sticky top-[5.25rem] z-[92] mt-4 md:static">
        <div
          role="radiogroup"
          aria-label="Wartungspaket"
          className="u-lift mx-auto grid max-w-2xl grid-cols-4 gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] p-1 shadow-2xl md:shadow-none"
        >
          {options.map((option) => {
            const active = option === care;
            return (
              <button
                key={option?.name ?? "none"}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setCare(option)}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center rounded-full px-1 py-2 text-[15px] font-semibold transition-colors duration-200 sm:min-h-16 sm:text-lg",
                  active
                    ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                    : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]",
                )}
              >
                {option ? option.name : "Ohne"}
                <span className="text-[13px] font-normal tabular-nums opacity-70 sm:text-sm">
                  {option ? `${option.price} €/Mon.` : "0 €/Mon."}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-center text-base text-[var(--color-muted-foreground)] sm:text-lg">
        Mehr Wartung = günstigere Website
      </p>

      {/* Website cards ---------------------------------------------------- */}
      <div className="mt-8 grid grid-cols-1 items-stretch gap-4 md:mt-14 md:grid-cols-3 lg:gap-8">
        {buildPlans.map((plan, i) => (
          <FadeIn key={plan.name} lift delay={i * 0.08} y={40} className="h-full">
            <PlanCard plan={plan} care={care} />
          </FadeIn>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-[var(--color-muted-foreground)]">
        {care && `Mit Wartung: ${MIN_TERM_MONTHS} Monate Laufzeit, dann monatlich kündbar. `}
        {PRICE_NOTICE}{" "}
        <Link to="/vertragsbedingungen" className="underline underline-offset-2 hover:text-[var(--color-foreground)]">
          Vertragsbedingungen
        </Link>
      </p>
    </div>
  );
}

function PlanCard({ plan, care }: { plan: BuildPlan; care: CarePlan | null }) {
  const [open, setOpen] = useState(false);
  const popular = Boolean(plan.isPopular);
  const price = buildPriceWith(plan, care);
  const href = checkoutHref(plan, care);
  const external = href.startsWith("http");

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-3xl border p-6 md:p-8",
        popular
          ? "border-[var(--color-foreground)] bg-[var(--color-foreground)] text-[var(--color-background)]"
          : "border-[var(--color-border)] bg-[var(--color-card)]",
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="u-display text-2xl md:text-3xl">{plan.name}</h3>
        {popular && (
          <span className="rounded-full border border-current/30 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.2em]">
            Beliebt
          </span>
        )}
      </div>
      <p className={cn("mt-1 text-base md:text-lg", popular ? "opacity-60" : "text-[var(--color-muted-foreground)]")}>
        {plan.tagline}
      </p>

      <div aria-live="polite" className="mt-6">
        <p className="flex flex-wrap items-baseline gap-x-3">
          <span className="u-display text-5xl leading-none tabular-nums md:text-6xl">{formatEur(price)}</span>
          {price !== plan.price && <s className="text-lg tabular-nums opacity-50">{formatEur(plan.price)}</s>}
        </p>
        <p className="mt-3 text-base md:text-lg">
          einmalig
          {care && <strong className="font-semibold"> + {care.price} € / Monat</strong>}
        </p>
      </div>

      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener" } : {})}
        className={cn(
          "group mt-6 inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]",
          popular
            ? "bg-[var(--color-background)] text-[var(--color-foreground)]"
            : "bg-[var(--color-foreground)] text-[var(--color-background)]",
        )}
      >
        {plan.name} buchen
        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </a>

      {/* Features: always shown from md, folded on phones to keep cards short. */}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="mt-4 flex min-h-12 items-center justify-center gap-1.5 text-base opacity-70 md:hidden"
      >
        {open ? "Weniger" : "Was ist drin?"}
        <ChevronDown aria-hidden="true" className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      <ul
        className={cn(
          "flex-1 space-y-3 border-t pt-6 text-base leading-relaxed md:mt-8 md:block md:pt-8",
          open ? "mt-2 block" : "hidden",
          popular ? "border-current/15 opacity-80" : "border-[var(--color-border)] text-[var(--color-muted-foreground)]",
        )}
      >
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <Check className="mt-1 h-4 w-4 flex-none" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}

/** Cumulative feature list per maintenance plan ("Alles aus …" expanded). */
const careFeatures = carePlans.reduce<string[][]>((acc, plan, i) => {
  const own = plan.features.filter((f) => !f.startsWith("Alles aus"));
  acc.push([...(acc[i - 1] ?? []), ...own]);
  return acc;
}, []);
const allCareFeatures = careFeatures[careFeatures.length - 1];

/** What each maintenance plan covers, as a check matrix. */
export function CareMatrix() {
  return (
    <div className="u-lift overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <table className="w-full table-fixed text-left text-sm sm:text-base">
        <caption className="sr-only">Leistungen der Wartungspakete</caption>
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <td className="w-[38%] p-2 sm:p-6" />
            {carePlans.map((plan) => (
              <th key={plan.name} scope="col" className="px-2 py-4 text-center sm:p-6">
                <span className="block text-sm font-semibold sm:text-lg">{plan.name}</span>
                <span className="whitespace-nowrap text-xs font-normal tabular-nums text-[var(--color-muted-foreground)] sm:text-sm">
                  {plan.price} €/Mon.
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allCareFeatures.map((feature) => (
            <tr key={feature} className="border-b border-[var(--color-border)] last:border-b-0">
              <th scope="row" className="py-3 pl-4 pr-2 font-normal text-[var(--color-muted-foreground)] sm:px-6 sm:py-4">
                {feature}
              </th>
              {careFeatures.map((features, i) => (
                <td key={carePlans[i].name} className="px-2 py-3 text-center sm:px-6 sm:py-4">
                  {features.includes(feature) ? (
                    <Check className="mx-auto h-4 w-4" aria-label="enthalten" />
                  ) : (
                    <Minus className="mx-auto h-4 w-4 opacity-25" aria-label="nicht enthalten" />
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th scope="row" className="py-3 pl-4 pr-2 font-normal text-[var(--color-muted-foreground)] sm:px-6 sm:py-4">
              Website-Rabatt
            </th>
            {carePlans.map((plan) => (
              <td key={plan.name} className="whitespace-nowrap px-2 py-3 text-center tabular-nums sm:px-6 sm:py-4">
                {plan.discounts.every((d) => d === 100)
                  ? "100 %"
                  : `ab ${Math.min(...plan.discounts)} %`}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
