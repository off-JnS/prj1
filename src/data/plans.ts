import { SITE } from "@/config/site";

export interface BuildPlan {
  name: string;
  /** One-time price in EUR, no decimals. */
  price: number;
  features: string[];
  description: string;
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
  paymentLink: string;
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

/** Resolves a plan's checkout target: Stripe Payment Link or mailto fallback. */
export function planHref(plan: BuildPlan | CarePlan): string {
  return (
    plan.paymentLink ||
    `mailto:${SITE.email}?subject=${encodeURIComponent(`${plan.name}-Paket anfragen`)}`
  );
}

/** Website builds — one-time, fixed price. */
export const buildPlans: BuildPlan[] = [
  {
    name: "Starter",
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
    paymentLink: "",
  },
  {
    name: "Professional",
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
    paymentLink: "",
  },
  {
    name: "Premium",
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
    paymentLink: "",
  },
];

/**
 * Maintenance retainers — monthly. `discounts` drives the combination offer
 * shown by the calculator on /preise.
 */
export const carePlans: CarePlan[] = [
  {
    name: "Basic",
    price: 59,
    features: ["Hosting", "Domain-Verwaltung", "Uptime-Überwachung"],
    discounts: [100, 50, 25],
    paymentLink: "",
  },
  {
    name: "Standard",
    price: 99,
    features: ["Alles aus Basic", "Monatlicher Bericht per E-Mail", "Kleine inhaltliche Änderungen"],
    discounts: [100, 100, 50],
    isPopular: true,
    paymentLink: "",
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
    paymentLink: "",
  },
];

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
    q: "Brauche ich ein Wartungspaket?",
    a: "Keine Pflicht — ohne Wartungspaket übergeben wir dir die Website zum Selbst-Hosten, inklusive kurzer Einweisung. Dann gilt allerdings der volle Website-Preis, weil der Kombi-Rabatt am Wartungsvertrag hängt.",
  },
  {
    q: "Was ist in der Wartung enthalten?",
    a: `Basic deckt Hosting, Domain-Verwaltung und Uptime-Überwachung ab. Standard ergänzt einen monatlichen Bericht und kleine inhaltliche Änderungen, Premium zusätzlich die Pflege deines Google-Business-Profils und laufende Google-Optimierung. Alles darüber hinaus rechnen wir transparent nach Aufwand ab.`,
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
