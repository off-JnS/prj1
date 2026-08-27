import { SITE } from "@/config/site";

/**
 * Discount levels the pricing game can award. A tier is both the percentage
 * off and the key under which the matching Stripe objects are stored — a
 * discounted checkout is a *separate* Buy Button / Payment Link in Stripe,
 * not a parameter on the full-price one.
 */
export type DiscountTier = 0 | 10 | 20;

export const DISCOUNT_TIERS = [0, 10, 20] as const;

export function isDiscountTier(value: unknown): value is DiscountTier {
  return value === 0 || value === 10 || value === 20;
}

/** German VAT. All listed prices are net (`zzgl. MwSt.`). */
export const VAT_RATE = 0.19;

/**
 * Where a plan's checkout lives, per discount tier.
 *
 * Fill these in from the Stripe dashboard (see DEPLOY.md). Everything is
 * optional: while a tier is empty the buttons fall back to the next best
 * target, and with nothing set at all they open a pre-filled e-mail exactly
 * as they do today.
 */
export interface StripeTargets {
  /** Stripe Buy Button IDs (`buy_btn_…`), keyed by discount tier. */
  buyButtonId?: Partial<Record<DiscountTier, string>>;
  /** Stripe Payment Link URLs, keyed by discount tier. */
  paymentLink?: Partial<Record<DiscountTier, string>>;
}

interface PlanBase {
  /** URL-safe slug — used as the `?beleg=` value on the Stripe return. */
  id: string;
  name: string;
  /** Net price in EUR, no decimals. */
  price: number;
  features: string[];
  isPopular?: boolean;
  stripe: StripeTargets;
}

/** Website builds — one-time, fixed price. */
export interface BuildPlan extends PlanBase {
  billing: "once";
  description: string;
  buttonText: string;
}

/** Maintenance retainers — monthly, cancellable. */
export interface CarePlan extends PlanBase {
  billing: "monthly";
}

export type Plan = BuildPlan | CarePlan;

/**
 * Discounts won in the pricing game apply to one-time builds only — the
 * monthly retainers are thin enough already.
 */
export function isDiscountable(plan: Plan): plan is BuildPlan {
  return plan.billing === "once";
}

/** The tier that actually applies to this plan (0 for non-discountable ones). */
export function effectiveTier(plan: Plan, tier: DiscountTier): DiscountTier {
  return isDiscountable(plan) ? tier : 0;
}

/** Net price after the discount, rounded to whole euros. */
export function discountedPrice(price: number, tier: DiscountTier): number {
  return Math.round(price * (1 - tier / 100));
}

/** The Stripe Buy Button for this plan at this tier, if one is configured. */
export function buyButtonIdFor(plan: Plan, tier: DiscountTier = 0): string | undefined {
  const applied = effectiveTier(plan, tier);
  return plan.stripe.buyButtonId?.[applied] || plan.stripe.buyButtonId?.[0] || undefined;
}

/**
 * Resolves a plan's checkout target, best available first:
 * Payment Link for this tier → full-price Payment Link → pre-filled e-mail.
 *
 * Buy Buttons are not part of this chain — they are embeds, not links, and
 * are resolved by `buyButtonIdFor` in StripeBuyButton.
 */
export function planHref(plan: Plan, tier: DiscountTier = 0): string {
  const applied = effectiveTier(plan, tier);
  const link = plan.stripe.paymentLink?.[applied] || plan.stripe.paymentLink?.[0];
  if (link) return link;

  const subject = applied
    ? `${plan.name}-Paket anfragen (${applied}% Rabatt)`
    : `${plan.name}-Paket anfragen`;
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;
}

export const buildPlans: BuildPlan[] = [
  {
    id: "starter",
    billing: "once",
    name: "Starter",
    price: 1000,
    description: "Eine fokussierte One-Page-Website — der schnellste Weg zu einem starken Auftritt.",
    features: [
      "One-Page-Website, komplett individuell",
      "Responsive auf jedem Gerät",
      "Kontaktformular & Analytics",
      "Basis-SEO & schnelle Ladezeiten",
      "2 Korrekturschleifen",
    ],
    buttonText: "Mit Starter loslegen",
    stripe: {},
  },
  {
    id: "professional",
    billing: "once",
    name: "Professional",
    price: 1750,
    description: "Mehrseitige Website mit eigener Motion — für Marken, die auffallen wollen.",
    features: [
      "Bis zu 5 individuell gestaltete Seiten",
      "Maßgeschneiderte Motion & Mikrointeraktionen",
      "Erweiterte SEO-Optimierung",
      "Google Business Profil-Einrichtung",
      "Unbegrenzte Korrekturschleifen",
    ],
    buttonText: "Professional wählen",
    isPopular: true,
    stripe: {},
  },
  {
    id: "premium",
    billing: "once",
    name: "Premium",
    price: 2750,
    description: "Das Flaggschiff: Art Direction, Motion und Technik ohne Kompromisse.",
    features: [
      "Alles aus Professional",
      "Volle Art Direction & Kreativstrategie",
      "Eigene WebGL- oder 3D-Erlebnisse",
      "Copywriting inklusive",
      "Priority-Support beim Launch",
    ],
    buttonText: "Premium anfragen",
    stripe: {},
  },
];

export const carePlans: CarePlan[] = [
  {
    id: "care-basic",
    billing: "monthly",
    name: "Basic",
    price: 59,
    features: ["Hosting & Domain", "Uptime-Monitoring", "Sicherheits-Updates"],
    stripe: {},
  },
  {
    id: "care-standard",
    billing: "monthly",
    name: "Standard",
    price: 99,
    features: ["Alles aus Basic", "Monatlicher Report", "Kleinere Inhalts-Updates"],
    isPopular: true,
    stripe: {},
  },
  {
    id: "care-premium",
    billing: "monthly",
    name: "Premium",
    price: 149,
    features: ["Alles aus Standard", "Google Business Profil-Pflege", "Laufende SEO-Updates"],
    stripe: {},
  },
];

/** Look a plan up by slug — used to rebuild a receipt from the `?beleg=` param. */
export function findPlan(id: string | null): Plan | undefined {
  if (!id) return undefined;
  return [...buildPlans, ...carePlans].find((plan) => plan.id === id);
}

export const pricingFaq = [
  {
    q: "Wie lange dauert ein Projekt?",
    a: "Starter launcht in 2–3 Wochen, Professional in 4–6 Wochen. Premium-Projekte planen wir individuell.",
  },
  {
    q: "Was ist im Festpreis enthalten?",
    a: "Design, Entwicklung und Launch — einmal zahlen, fertig. Hosting und Pflege übernimmt danach ein Wartungspaket ab 59 € im Monat.",
  },
  {
    q: "Brauche ich ein Wartungspaket?",
    a: "Empfohlen, aber keine Pflicht. Ohne Wartungspaket übergeben wir dir die Website zum Selbst-Hosten — inklusive kurzer Einweisung.",
  },
  {
    q: "Wem gehört die Website?",
    a: "Dir. Design, Code und Inhalte gehören nach Zahlung vollständig dir.",
  },
  {
    q: "Was, wenn ich etwas ganz Eigenes brauche?",
    a: "Dann bauen wir es. Schreib uns kurz, worum es geht — wir antworten innerhalb von 24 Stunden mit einer ehrlichen Einschätzung.",
  },
];
