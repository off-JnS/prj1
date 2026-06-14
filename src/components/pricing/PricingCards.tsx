import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/Reveal";
import { planHref, type PricingPlan } from "@/data/plans";

function Toggle({ yearly, onChange }: { yearly: boolean; onChange: (v: boolean) => void }) {
  const options = [
    { label: "Monatlich", value: false },
    { label: "Jährlich", value: true, hint: "−20 %" },
  ];

  return (
    <div className="inline-flex items-center rounded-full border border-[var(--color-border)] p-1">
      {options.map((opt) => {
        const active = yearly === opt.value;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={cn(
              "relative min-h-11 rounded-full px-5 text-sm font-medium transition-colors duration-200 sm:px-7",
              active
                ? "text-[var(--color-background)]"
                : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]",
            )}
          >
            {active && (
              <motion.span
                layoutId="pricing-pill"
                className="absolute inset-0 rounded-full bg-[var(--color-foreground)]"
                transition={{ type: "spring", stiffness: 450, damping: 38 }}
              />
            )}
            <span className="relative z-10">
              {opt.label}
              {opt.hint && <span className="ml-1.5 font-mono text-xs opacity-70">{opt.hint}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PlanCard({ plan, yearly, index }: { plan: PricingPlan; yearly: boolean; index: number }) {
  const popular = Boolean(plan.isPopular);

  return (
    <FadeIn delay={index * 0.08} y={44} className="h-full">
      <article
        className={cn(
          "relative flex h-full flex-col rounded-3xl border p-8 sm:p-10",
          popular
            ? "border-white bg-white text-black lg:-translate-y-4"
            : "border-[var(--color-border)] bg-[var(--color-card)]",
        )}
      >
        {popular && (
          <span className="absolute -top-3.5 left-8 rounded-full bg-black px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white">
            Beliebteste Wahl
          </span>
        )}

        <header>
          <h3 className="u-display text-3xl">{plan.name}</h3>
          <p className={cn("mt-3 text-sm leading-relaxed", popular ? "text-black/60" : "text-[var(--color-muted-foreground)]")}>
            {plan.description}
          </p>
        </header>

        <div className="mt-8 flex items-baseline gap-2">
          <span className="u-display text-5xl tabular-nums sm:text-6xl">
            <NumberFlow
              value={yearly ? Number(plan.yearlyPrice) : Number(plan.price)}
              format={{ style: "currency", currency: "EUR", minimumFractionDigits: 0 }}
            />
          </span>
          <span className={cn("font-mono text-xs uppercase tracking-[0.2em]", popular ? "text-black/50" : "text-[var(--color-muted-foreground)]")}>
            / {plan.period}
          </span>
        </div>
        <p className={cn("mt-2 font-mono text-[11px] uppercase tracking-[0.2em]", popular ? "text-black/55" : "text-[var(--color-muted-foreground)]")}>
          {yearly ? "Bei jährlicher Abrechnung" : "Monatlich kündbar*"}
        </p>

        <ul className={cn("mt-8 flex-1 space-y-3.5 border-t pt-8 text-sm leading-relaxed", popular ? "border-black/10 text-black/75" : "border-[var(--color-border)] text-[var(--color-muted-foreground)]")}>
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-3">
              <Check className={cn("mt-0.5 h-4 w-4 flex-none", popular ? "text-black" : "text-[var(--color-foreground)]")} aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>

        <a
          href={planHref(plan, yearly)}
          className={cn(
            "mt-10 inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]",
            popular
              ? "bg-black text-white"
              : "border border-[var(--color-foreground)]/40 text-[var(--color-foreground)] hover:border-[var(--color-foreground)]",
          )}
        >
          {plan.buttonText}
        </a>
      </article>
    </FadeIn>
  );
}

export default function PricingCards({ plans }: { plans: PricingPlan[] }) {
  const [yearly, setYearly] = useState(false);

  return (
    <div>
      <FadeIn className="flex justify-center">
        <Toggle yearly={yearly} onChange={setYearly} />
      </FadeIn>

      <div className="mt-14 grid grid-cols-1 items-stretch gap-8 lg:mt-20 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <PlanCard key={plan.name} plan={plan} yearly={yearly} index={i} />
        ))}
      </div>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
        Alle Preise zzgl. MwSt. · *Mindestlaufzeit nach Vereinbarung
      </p>
    </div>
  );
}
