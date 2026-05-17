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
  fallbackImage?: string;
  testimonial: Testimonial;
}

export const projects: Project[] = [
  {
    id: "ehsos-burger",
    name: "Ehso's Burger",
    tagline: "Markenauftritt und Online-Präsenz für einen Burger-Laden mit Charakter.",
    url: "https://ehsos-burger.de",
    fallbackImage: "/previews/ehsos-burger.jpg",
    testimonial: {
      kind: "text",
      quote:
        "PRJ1 hat unserem Laden ein digitales Zuhause gegeben, das genauso laut und ehrlich ist wie unser Burger. Die Bestellungen über die Seite sind seit dem Launch deutlich gestiegen.",
      authorName: "Inhaber",
      authorRole: "EHSOS Burger",
    },
  },
  {
    id: "beispiel-cafe",
    name: "Beispiel Projekt - Cafe",
    tagline: "Markenwebsite für ein Architekturbüro mit klarer Handschrift.",
    url: "https://cafeliteraritat.netlify.app/",
    fallbackImage: "/previews/beispiel-cafe.jpg",
    testimonial: {
      kind: "text",
      quote:
        "Endlich fühlt sich unsere Website so an wie unsere Entwürfe — ruhig, präzise und unverwechselbar. Anfragen für neue Projekte haben sich innerhalb eines Monats verdoppelt.",
      authorName: "Mara Iversen",
      authorRole: "Gründerin, Nordwind Studio",
    },
  },
  {
    id: "prj1",
    name: "PRJ1",
    tagline: "Unsere eigene Website — gebaut mit denselben Standards, die wir für unsere Kunden anlegen.",
    url: "https://prj1.de",
    fallbackImage: "/previews/prj1.jpg",
    testimonial: {
      kind: "video",
      src: "/testimonials/placeholder.mp4",
      poster: undefined,
      authorName: "Elena Costa",
      authorRole: "Kreativdirektorin, Pionier Manufaktur",
    },
  },
];
