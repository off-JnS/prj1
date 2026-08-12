/**
 * Portfolio entries.
 *
 * These are PRJ1's own demonstration builds, not client work — fictional
 * Hamburg businesses used to show what each package delivers. Every page of
 * every example carries a "Beispielprojekt" note. Never present them as
 * clients, case studies, or references, and never attach a testimonial to one.
 *
 * The sites are served statically from `public/beispiele/<slug>/`, so the
 * URLs below are same-origin paths, not external links.
 */

export type Tier = "starter" | "professional" | "premium";

export interface Project {
  id: string;
  /** Fictional company name shown as the entry title. */
  name: string;
  /** Industry, used as the mono sub-label. */
  sector: string;
  tagline: string;
  /** Path under public/ — opens the built example in a new tab. */
  url: string;
  tier: Tier;
}

export interface TierMeta {
  id: Tier;
  /** Matches the package name on /preise. */
  label: string;
  /** One-time price in EUR, kept in sync with `buildPlans`. */
  price: number;
  description: string;
}

export const tiers: TierMeta[] = [
  {
    id: "starter",
    label: "Starter",
    price: 1000,
    description:
      "Eine Seite, die alles trägt: Leistungen, Vertrauen und den Weg zur Anfrage — ohne Umweg.",
  },
  {
    id: "professional",
    label: "Professional",
    price: 1750,
    description:
      "Mehrere Seiten mit eigener Struktur — für Betriebe, deren Angebot mehr Raum braucht als einen Abschnitt.",
  },
  {
    id: "premium",
    label: "Premium",
    price: 2750,
    description:
      "Tiefe Inhalte, eigene Bildsprache, komplexe Leistungsbereiche — für Marken mit erklärungsbedürftigem Geschäft.",
  },
];

export const projects: Project[] = [
  // ---- Starter ----------------------------------------------------------
  {
    id: "haarwerk-winterhude",
    name: "Haarwerk Winterhude",
    sector: "Friseursalon",
    tagline:
      "Salon am Mühlenkamp — Leistungen, Preise und Terminanfrage auf einer einzigen Seite.",
    url: "/beispiele/haarwerk-winterhude/",
    tier: "starter",
  },
  {
    id: "roestwerk-ottensen",
    name: "Röstwerk Ottensen",
    sector: "Rösterei & Café",
    tagline:
      "Spezialitätenrösterei in Ottensen — Sortiment, Öffnungszeiten und Anfahrt kompakt gebündelt.",
    url: "/beispiele/roestwerk-ottensen/",
    tier: "starter",
  },
  {
    id: "tischlerei-holtkamp",
    name: "Tischlerei Holtkamp",
    sector: "Tischlerei",
    tagline:
      "Meisterbetrieb in Barmbek — Möbelbau, Innenausbau und Angebotsanfrage ohne Ablenkung.",
    url: "/beispiele/tischlerei-holtkamp/",
    tier: "starter",
  },

  // ---- Professional ------------------------------------------------------
  {
    id: "fleetwerk-architekten",
    name: "Fleetwerk Architekten",
    sector: "Architekturbüro",
    tagline:
      "Architekturbüro auf der Fleetinsel — Projekte, Büro und Kontakt als eigene Kapitel.",
    url: "/beispiele/fleetwerk-architekten/",
    tier: "professional",
  },
  {
    id: "elbstein-immobilien",
    name: "Elbstein Immobilien",
    sector: "Immobilienmakler",
    tagline:
      "Makler für Hamburger Lagen — Objekte, Bewertung und Leistungen sauber getrennt.",
    url: "/beispiele/elbstein-immobilien/",
    tier: "professional",
  },
  {
    id: "elbzahn",
    name: "Elbzahn",
    sector: "Zahnarztpraxis",
    tagline:
      "Praxis in Eppendorf — Behandlungen, Team und Terminvergabe, jeweils mit eigenem Platz.",
    url: "/beispiele/elbzahn/",
    tier: "professional",
  },

  // ---- Premium -----------------------------------------------------------
  {
    id: "hanseatic-aerotec",
    name: "Hanseatic Aerotec",
    sector: "Luftfahrt-Zulieferer",
    tagline:
      "Zulieferer und MRO aus Finkenwerder — Fertigung, Qualität und Zertifizierungen im Detail.",
    url: "/beispiele/hanseatic-aerotec/",
    tier: "premium",
  },
  {
    id: "nordmeridian-logistik",
    name: "Nordmeridian Logistik",
    sector: "Spedition & Logistik",
    tagline:
      "Spedition in der Speicherstadt — See-, Luftfracht und Projektlogistik mit eigenem Netzwerk-Kapitel.",
    url: "/beispiele/nordmeridian-logistik/",
    tier: "premium",
  },
  {
    id: "elbwind-offshore",
    name: "Elbwind Offshore",
    sector: "Offshore-Windservice",
    tagline:
      "Betriebsführung für Offshore-Windparks — Leistungen, Windparks und Standort ausführlich erklärt.",
    url: "/beispiele/elbwind-offshore/",
    tier: "premium",
  },
];

/** Projects belonging to one package tier, in source order. */
export function projectsByTier(tier: Tier): Project[] {
  return projects.filter((p) => p.tier === tier);
}

/** Display name of a tier, e.g. "Professional". */
export function tierLabel(tier: Tier): string {
  return tiers.find((t) => t.id === tier)?.label ?? tier;
}

/** One example per tier, cheapest first — the landing page's teaser set. */
export const featuredProjects: Project[] = tiers.map(
  (tier) => projectsByTier(tier.id)[0],
);
