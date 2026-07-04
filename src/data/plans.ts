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
  isPopular?: boolean;
  paymentLink: string;
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
      "One-Page-Website, komplett individuell",
      "Responsive auf jedem Gerät",
      "Kontaktformular & Analytics",
      "Basis-SEO & schnelle Ladezeiten",
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
      "Bis zu 5 individuell gestaltete Seiten",
      "Maßgeschneiderte Motion & Mikrointeraktionen",
      "Erweiterte SEO-Optimierung",
      "Google Business Profil-Einrichtung",
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
      "Volle Art Direction & Kreativstrategie",
      "Eigene WebGL- oder 3D-Erlebnisse",
      "Copywriting inklusive",
      "Priority-Support beim Launch",
    ],
    buttonText: "Premium anfragen",
    paymentLink: "",
  },
];

/** Maintenance retainers — monthly, cancellable. */
export const carePlans: CarePlan[] = [
  {
    name: "Basic",
    price: 59,
    features: ["Hosting & Domain", "Uptime-Monitoring", "Sicherheits-Updates"],
    paymentLink: "",
  },
  {
    name: "Standard",
    price: 99,
    features: ["Alles aus Basic", "Monatlicher Report", "Kleinere Inhalts-Updates"],
    isPopular: true,
    paymentLink: "",
  },
  {
    name: "Premium",
    price: 149,
    features: ["Alles aus Standard", "Google Business Profil-Pflege", "Laufende SEO-Updates"],
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
