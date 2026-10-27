import { SITE } from "@/config/site";

export interface BuildPlan {
  name: string;
  /** One-time price in EUR, no decimals. */
  price: number;
  features: string[];
  description: string;
  /** Few-word summary for the pricing cards. */
  tagline: string;
  buttonText: string;
  isPopular?: boolean;
  /**
   * Stripe Payment Link — create it in the Stripe dashboard and paste the
   * URL here. While empty, buttons fall back to a pre-filled e-mail.
   */
  paymentLink: string;
}

export interface CarePlan {
  name: string;
  /** Monthly price in EUR, no decimals. */
  price: number;
  features: string[];
  /**
   * Percent off each website build, indexed to `buildPlans` order
   * (Starter, Professional, Premium). Applies only with the minimum term.
   */
  discounts: [number, number, number];
  isPopular?: boolean;
}

/** Offer prices are rounded down to this step — always in the client's favour. */
export const ROUND_STEP = 250;

/** Minimum retainer term the combination discount is tied to. */
export const MIN_TERM_MONTHS = 24;

export const eur = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatEur = (value: number) => eur.format(value);

/**
 * Discounted one-time price for a build, rounded down to the nearest
 * `ROUND_STEP`. Rounding only ever moves in the client's favour.
 */
export function offerPrice(price: number, off: number): number {
  return Math.floor((price * (100 - off)) / 100 / ROUND_STEP) * ROUND_STEP;
}

/** Website price after the combination discount (full price without care). */
export function buildPriceWith(build: BuildPlan, care: CarePlan | null): number {
  if (!care) return build.price;
  return offerPrice(build.price, care.discounts[buildPlans.indexOf(build)]);
}

/**
 * Checkout target for a selection. A website can be booked on its own; a
 * maintenance plan only ever together with a website, via its combination
 * link — there is deliberately no standalone maintenance checkout.
 */
export function checkoutHref(build: BuildPlan, care: CarePlan | null): string {
  const link = care ? KOMBI_LINKS[care.name][build.name] : build.paymentLink;
  const subject = care ? `${build.name} + Wartung ${care.name} anfragen` : `${build.name}-Paket anfragen`;
  return link || `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;
}

/** Website builds — one-time, fixed price. */
export const buildPlans: BuildPlan[] = [
  {
    name: "Starter",
    tagline: "One-Pager",
    price: 1000,
    description: "Eine fokussierte One-Page-Website — der schnellste Weg zu einem starken Auftritt.",
    features: [
      "One-Pager, komplett responsive",
      "Kontaktformular mit Validierung",
      "Basis-SEO: Title, Description, Canonical",
      "Schnelle Ladezeiten, ohne JS-Bibliotheken",
      "Analytics-Vorbereitung",
      "2 Korrekturschleifen",
    ],
    buttonText: "Mit Starter loslegen",
    paymentLink: "https://buy.stripe.com/6oU6oHcYY8FmdGpeb93Ru07",
  },
  {
    name: "Professional",
    tagline: "Bis zu 5 Seiten mit Motion",
    price: 1750,
    description: "Mehrseitige Website mit eigener Motion — für Marken, die auffallen wollen.",
    features: [
      "Alles aus Starter",
      "Bis zu 5 individuell gestaltete Seiten",
      "Scroll-Reveals, Counter und Timelines",
      "Erweiterte SEO: JSON-LD, Open Graph, sitemap.xml",
      "Google-Business-Profil-Einrichtung",
      "Interaktive Elemente, z. B. Filter",
      "Unbegrenzte Korrekturschleifen",
    ],
    buttonText: "Professional wählen",
    isPopular: true,
    paymentLink: "https://buy.stripe.com/4gM7sL9MMaNuaudeb93Ru08",
  },
  {
    name: "Premium",
    tagline: "Alles individuell, inkl. 3D & Texte",
    price: 2750,
    description: "Das Flaggschiff: Art Direction, Motion und Technik ohne Kompromisse.",
    features: [
      "Alles aus Professional",
      "Individuelle 3D- oder Canvas-Experience",
      "Komplette Art Direction: eigenes Farb-, Schrift- und Komponentensystem",
      "Copywriting inklusive",
      "Performance-Engineering",
      "Priority-Support und begleiteter Launch",
    ],
    buttonText: "Premium anfragen",
    paymentLink: "https://buy.stripe.com/aFa4gzbUUdZG6dXc313Ru09",
  },
];

/**
 * Maintenance retainers — monthly, bookable only together with a website.
 * `discounts` drives the combination offer on /preise.
 */
export const carePlans: CarePlan[] = [
  {
    name: "Basic",
    price: 59,
    features: ["Hosting", "Domain-Verwaltung", "Uptime-Überwachung"],
    discounts: [100, 50, 25],
  },
  {
    name: "Standard",
    price: 99,
    features: ["Alles aus Basic", "Monatlicher Bericht per E-Mail", "Kleine inhaltliche Änderungen"],
    discounts: [100, 100, 50],
    isPopular: true,
  },
  {
    name: "Premium",
    price: 149,
    features: [
      "Alles aus Standard",
      "Google-Business-Profil-Pflege",
      "Laufende Google-Optimierung",
    ],
    discounts: [100, 100, 100],
  },
];

/**
 * Stripe Payment Links for the combination offer, by maintenance plan, then
 * website package. Each charges the discounted build price (see
 * `offerPrice`) plus the first month of maintenance in one payment.
 */
export const KOMBI_LINKS: Record<CarePlan["name"], Record<BuildPlan["name"], string>> = {
  Basic: {
    Starter: "https://buy.stripe.com/eVq4gz1ggbRy6dX8QP3Ru0b", // 0 € + 59 €/Mon.
    Professional: "https://buy.stripe.com/14AcN59MM3l2eKtffd3Ru0c", // 750 € + 59 €/Mon.
    Premium: "https://buy.stripe.com/00wdR9cYY2gY9q99UT3Ru0d", // 2.000 € + 59 €/Mon.
  },
  Standard: {
    Starter: "https://buy.stripe.com/cNiaEX7EEf3KeKt0kj3Ru0e", // 0 € + 99 €/Mon.
    Professional: "https://buy.stripe.com/eVqcN53oo8Fm1XH6IH3Ru0f", // 0 € + 99 €/Mon.
    Premium: "https://buy.stripe.com/14A14n3oo2gYfOxeb93Ru0g", // 1.250 € + 99 €/Mon.
  },
  Premium: {
    Starter: "https://buy.stripe.com/5kQ5kD8II08QdGp8QP3Ru0h", // 0 € + 149 €/Mon.
    Professional: "https://buy.stripe.com/bJe5kDaQQ7BifOxffd3Ru0i", // 0 € + 149 €/Mon.
    Premium: "https://buy.stripe.com/aFa14ncYYcVC45P0kj3Ru0j", // 0 € + 149 €/Mon.
  },
};

/** Legal pricing note shown under every price list on /preise. */
export const PRICE_NOTICE =
  "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet. Alle Preise sind Endpreise. Unsere Angebote richten sich ausschließlich an Unternehmer (§ 14 BGB).";

export const pricingFaq = [
  {
    q: "Wie lange dauert ein Projekt?",
    a: "Starter launcht in 2–3 Wochen, Professional in 4–6 Wochen. Premium-Projekte planen wir individuell.",
  },
  {
    q: "Was ist im Festpreis enthalten?",
    a: `Design, Entwicklung und Launch — einmal zahlen, fertig. Um den Betrieb kümmert sich danach ein Wartungspaket ab ${carePlans[0].price} € im Monat.`,
  },
  {
    q: "Wie funktioniert der Kombi-Rabatt?",
    a: `Wer ein Wartungspaket bucht, zahlt weniger für die Website — je nach Kombination bis zu 100 % weniger. Voraussetzung sind ${MIN_TERM_MONTHS} Monate Mindestlaufzeit des Wartungsvertrags, danach ist er monatlich kündbar. Endpreise runden wir auf volle ${ROUND_STEP} € ab, immer zu deinen Gunsten.`,
  },
  {
    q: "Kann ich nur Wartung buchen?",
    a: "Nein, nur zusammen mit einer Website von uns. Schon Kunde? Schreib uns.",
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
