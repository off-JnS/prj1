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
  /** Industry and location of the (fictional) brand, one line. */
  sector: string;
  /**
   * Concept projects are built for fictional brands to show what a package
   * delivers. They must be labelled as such and never carry testimonials.
   */
  concept: boolean;
  /** Package from `buildPlans` the project demonstrates. */
  plan: "Starter" | "Professional" | "Premium";
  /** The task in one or two sentences. */
  brief: string;
  /** What was built — short, concrete, scannable. */
  built: string[];
  url: string;
  /** Screenshot of the start page, 16:10, in /public/work/shots. */
  image: string;
  imageAlt: string;
  /** Only for real client projects, with the client's permission. */
  testimonial?: Testimonial;
}

export const projects: Project[] = [
  {
    id: "roestwerk-ottensen",
    name: "Röstwerk Ottensen",
    sector: "Kaffeerösterei & Café, Hamburg-Ottensen",
    concept: true,
    plan: "Starter",
    brief:
      "Ein Viertelcafé braucht einen Auftritt, der auf dem Handy in Sekunden lädt und die drei Fragen jedes Gastes beantwortet: Was gibt es, wann ist offen, wie erreiche ich euch?",
    built: [
      "One-Pager mit Karte, Öffnungszeiten und Galerie",
      "Kontaktformular mit Validierung",
      "Ohne JS-Bibliotheken — schnelle Ladezeiten",
      "Basis-SEO: Title und Meta-Description",
    ],
    url: "/work/gastro-basic/index.html",
    image: "/work/shots/roestwerk-ottensen.jpg",
    imageAlt:
      "Startseite von Röstwerk Ottensen: cremefarbenes Layout mit der Überschrift „Handgeröstet im Herzen von Ottensen.“, den Buttons „Karte ansehen“ und „Tisch anfragen“ und einem großen Foto rechts.",
  },
  {
    id: "elbstein-immobilien",
    name: "Elbstein Immobilien",
    sector: "Immobilienmakler, Hamburg-HafenCity",
    concept: true,
    plan: "Professional",
    brief:
      "Ein Maklerbüro will hochwertige Objekte so präsentieren, dass Interessenten selbst filtern und gezielt anfragen — und lokal bei Google gefunden werden.",
    built: [
      "Fünf individuell gestaltete Seiten",
      "Objektliste mit Live-Filter",
      "Scroll-Reveals und Counter",
      "Strukturierte Daten (JSON-LD) für lokales SEO",
    ],
    url: "/work/immobilien-professional/index.html",
    image: "/work/shots/elbstein-immobilien.jpg",
    imageAlt:
      "Startseite von Elbstein Immobilien: abgedunkeltes Vollbildfoto mit der Überschrift „Zuhause ist keine Adresse. Es ist ein Gefühl.“ und den Buttons „Aktuelle Objekte“ und „Beratung vereinbaren“.",
  },
  {
    id: "nordmeridian-logistik",
    name: "Nordmeridian Logistik",
    sector: "Internationale Spedition, Hamburg-Speicherstadt",
    concept: true,
    plan: "Premium",
    brief:
      "Eine Spedition in einer konservativen Branche soll auf den ersten Blick wie der fähigste Anbieter am Kai wirken — und zeigen, was sie verkauft: Routen.",
    built: [
      "Eigene Art Direction: Farben, Schrift, Komponenten",
      "Interaktiver 3D-Globus mit Handelsrouten",
      "Texte inklusive",
      "Performance-Engineering für die 3D-Szene",
    ],
    url: "/work/maritim-premium/index.html",
    image: "/work/shots/nordmeridian-logistik.jpg",
    imageAlt:
      "Startseite von Nordmeridian Logistik: dunkles Layout mit einem 3D-Globus aus Punkten und Handelsrouten und der Überschrift „Von der Elbe in die Welt.“",
  },
];
