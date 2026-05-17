export interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular?: boolean;
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
    href: "mailto:hello@prj1.studio?subject=Essenz-Paket",
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
    href: "mailto:hello@prj1.studio?subject=Signatur-Paket",
    isPopular: true,
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
    href: "mailto:hello@prj1.studio?subject=Atelier-Paket",
  },
];
