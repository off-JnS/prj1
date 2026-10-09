export type Testimonial =
  | {
      kind: "text";
      quote: string;
      authorName: string;
      authorRole?: string;
    }
  | {
      kind: "video";
      src: string;
      poster?: string;
      authorName: string;
      authorRole?: string;
    };

export interface Project {
  id: string;
  name: string;
  tagline?: string;
  url: string;
  testimonial: Testimonial;
}

export const projects: Project[] = [
  {
    id: "roestwerk-ottensen",
    name: "Röstwerk Ottensen",
    tagline: "Spezialitäten-Rösterei aus Ottensen — One-Page-Auftritt mit Karte, Kontaktformular und schnellen Ladezeiten. Paket: Starter.",
    url: "/work/gastro-basic/index.html",
    testimonial: {
      kind: "text",
      quote:
        "Eine Seite, die riecht wie unser Laden: warm, ehrlich, ohne Schnickschnack. Seit dem Launch reservieren mehr Gäste direkt online — genau das, was wir wollten.",
      authorName: "Inhaberin",
      authorRole: "Röstwerk Ottensen",
    },
  },
  {
    id: "elbstein-immobilien",
    name: "Elbstein Immobilien",
    tagline: "Immobilienmakler aus der HafenCity — fünf Seiten mit Live-Filter, Scroll-Motion und lokalem SEO. Paket: Professional.",
    url: "/work/immobilien-professional/index.html",
    testimonial: {
      kind: "text",
      quote:
        "Die Seite verkauft Vertrauen, bevor wir ein Wort sagen. Anfragen über die Objekt-Filter sind spürbar hochwertiger geworden — und unser Google-Profil läuft endlich rund.",
      authorName: "Geschäftsführung",
      authorRole: "Elbstein Immobilien",
    },
  },
  {
    id: "nordmeridian-logistik",
    name: "Nordmeridian Logistik",
    tagline: "Maritime Spedition aus der Speicherstadt — volle Art Direction, eigene Texte und ein interaktiver 3D-Globus. Paket: Premium.",
    url: "/work/maritim-premium/index.html",
    testimonial: {
      kind: "text",
      quote:
        "In einer konservativen Branche sehen wir jetzt aus wie der fähigste Anbieter am Kai. Der Globus auf der Startseite ist kein Gimmick — er zeigt genau, was wir verkaufen: Routen.",
      authorName: "Geschäftsführung",
      authorRole: "Nordmeridian Logistik",
    },
  },
];
