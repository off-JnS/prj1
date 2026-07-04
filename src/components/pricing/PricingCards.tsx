import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/Reveal";
import { planHref, type BuildPlan, type CarePlan } from "@/data/plans";

const eur = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
});

function BuildCard({ plan, index }: { plan: BuildPlan; index: number }) {
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
          <span className="u-display text-5xl tabular-nums sm:text-6xl">{eur.format(plan.price)}</span>
          <span className={cn("font-mono text-xs uppercase tracking-[0.2em]", popular ? "text-black/50" : "text-[var(--color-muted-foreground)]")}>
            einmalig
          </span>
        </div>

        <ul className={cn("mt-8 flex-1 space-y-3.5 border-t pt-8 text-sm leading-relaxed", popular ? "border-black/10 text-black/75" : "border-[var(--color-border)] text-[var(--color-muted-foreground)]")}>
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-3">
              <Check className={cn("mt-0.5 h-4 w-4 flex-none", popular ? "text-black" : "text-[var(--color-foreground)]")} aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>

        <a
          href={planHref(plan)}
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

function CareCard({ plan, index }: { plan: CarePlan; index: number }) {
  const popular = Boolean(plan.isPopular);

  return (
    <FadeIn delay={index * 0.06} y={32} className="h-full">
      <article
        className={cn(
          "flex h-full flex-col rounded-2xl border p-6 sm:p-8",
          popular ? "border-[var(--color-foreground)]/60" : "border-[var(--color-border)]",
          "bg-[var(--color-card)]",
        )}
      >
        <header className="flex items-baseline justify-between gap-4">
          <h3 className="u-display text-xl sm:text-2xl">{plan.name}</h3>
          <p className="flex items-baseline gap-1.5">
            <span className="u-display text-3xl tabular-nums sm:text-4xl">{eur.format(plan.price)}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">/ Monat</span>
          </p>
        </header>

        <ul className="mt-6 flex-1 space-y-3 border-t border-[var(--color-border)] pt-6 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-3">
              <Check className="mt-0.5 h-4 w-4 flex-none text-[var(--color-foreground)]" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>

        <a
          href={planHref(plan)}
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--color-foreground)]/40 px-6 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:border-[var(--color-foreground)]"
        >
          {plan.name} buchen
        </a>
      </article>
    </FadeIn>
  );
}

export function BuildCards({ plans }: { plans: BuildPlan[] }) {
  return (
    <div>
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <BuildCard key={plan.name} plan={plan} index={i} />
        ))}
      </div>
      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
        Alle Preise zzgl. MwSt. · Festpreis, keine versteckten Kosten
      </p>
    </div>
  );
}

export function CareCards({ plans }: { plans: CarePlan[] }) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan, i) => (
        <CareCard key={plan.name} plan={plan} index={i} />
      ))}
    </div>
  );
}
