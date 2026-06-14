import { SITE } from "@/config/site";

export interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  isPopular?: boolean;
  /**
   * Stripe Payment Links — create them in the Stripe dashboard and paste the
   * URLs here. While empty, buttons fall back to a pre-filled e-mail.
   */
  paymentLinkMonthly: string;
  paymentLinkYearly: string;
}

/** Resolves a plan's checkout target: Stripe Payment Link or mailto fallback. */
export function planHref(plan: PricingPlan, yearly: boolean): string {
  const link = yearly ? plan.paymentLinkYearly : plan.paymentLinkMonthly;
  return (
    link ||
    `mailto:${SITE.email}?subject=${encodeURIComponent(`${plan.name}-Paket (${yearly ? "jährlich" : "monatlich"})`)}`
  );
}

export const plans: PricingPlan[] = [
  {
    name: "Essenz",
    price: "1200",
    yearlyPrice: "960",
    period: "Monat",
    description:
      "Eine durchdachte One-Page-Website für junge Gründer und kleine Unternehmen.",
    features: [
      "Bis zu 5 Sektionen, vollständig individuell",
      "Pixelgenau responsive auf jedem Gerät",
      "Kontaktformular & Analytics",
      "2 Korrekturschleifen",
      "Support per E-Mail",
    ],
    buttonText: "Mit Essenz starten",
    paymentLinkMonthly: "",
    paymentLinkYearly: "",
  },
  {
    name: "Signatur",
    price: "2800",
    yearlyPrice: "2240",
    period: "Monat",
    description:
      "Mehrseitige Websites mit eigener Motion, Animationen und Texten mit Haltung.",
    features: [
      "Bis zu 8 individuell gestaltete Seiten",
      "Maßgeschneiderte Motion & Mikrointeraktionen",
      "CMS-Anbindung (Sanity / Contentful)",
      "Unbegrenzte Korrekturschleifen",
      "Priority-Support & laufende Iterationen",
    ],
    buttonText: "Signatur wählen",
    isPopular: true,
    paymentLinkMonthly: "",
    paymentLinkYearly: "",
  },
  {
    name: "Atelier",
    price: "6000",
    yearlyPrice: "4800",
    period: "Monat",
    description:
      "Flaggschiff-Websites mit Art Direction, Texten und langfristiger Begleitung.",
    features: [
      "Alles aus Signatur",
      "Volle Art Direction & Kreativstrategie",
      "Eigene WebGL- oder 3D-Erlebnisse",
      "Performance-Budget & SEO-Retainer",
      "Vierteljährliche Kreativ-Reviews",
    ],
    buttonText: "Studio kontaktieren",
    paymentLinkMonthly: "",
    paymentLinkYearly: "",
  },
];

export const pricingFaq = [
  {
    q: "Wie lange dauert ein Projekt?",
    a: "Eine One-Page-Website (Essenz) launcht in der Regel innerhalb von 2–3 Wochen. Mehrseitige Projekte (Signatur) brauchen 4–8 Wochen, Atelier-Projekte planen wir individuell.",
  },
  {
    q: "Warum monatliche Zahlung?",
    a: "Statt einer großen Einmalsumme zahlst du planbar pro Monat — Design, Entwicklung, Hosting, Domain und laufende Pflege sind enthalten. Bei jährlicher Zahlung sparst du 20 %.",
  },
  {
    q: "Kann ich später das Paket wechseln?",
    a: "Ja. Ein Upgrade ist jederzeit möglich — wir rechnen den laufenden Monat einfach anteilig an. Sprich uns an, wir finden die passende Lösung.",
  },
  {
    q: "Wem gehört die Website?",
    a: "Dir. Design und Inhalte gehören nach Vertragsende dir; auf Wunsch übergeben wir den Code und unterstützen beim Umzug zu einem eigenen Hosting.",
  },
  {
    q: "Was, wenn ich etwas ganz Eigenes brauche?",
    a: "Dann bauen wir es. Schreib uns kurz, worum es geht — wir melden uns innerhalb von 24 Stunden mit einer ehrlichen Einschätzung und einem Angebot.",
  },
];
