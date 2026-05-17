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
    name: "EHSOS Burger",
    tagline: "Markenauftritt und Online-Präsenz für einen Burger-Laden mit Charakter.",
    url: "https://ehsos-burger.de",
    fallbackImage: undefined,
    testimonial: {
      kind: "text",
      quote:
        "PRJ1 hat unserem Laden ein digitales Zuhause gegeben, das genauso laut und ehrlich ist wie unser Burger. Die Bestellungen über die Seite sind seit dem Launch deutlich gestiegen.",
      authorName: "Inhaber",
      authorRole: "EHSOS Burger",
    },
  },
  {
    id: "nordwind-studio",
    name: "Nordwind Studio",
    tagline: "Markenwebsite für ein Architekturbüro mit klarer Handschrift.",
    url: "https://example.com",
    fallbackImage: undefined,
    testimonial: {
      kind: "text",
      quote:
        "Endlich fühlt sich unsere Website so an wie unsere Entwürfe — ruhig, präzise und unverwechselbar. Anfragen für neue Projekte haben sich innerhalb eines Monats verdoppelt.",
      authorName: "Mara Iversen",
      authorRole: "Gründerin, Nordwind Studio",
    },
  },
  {
    id: "pionier-manufaktur",
    name: "Pionier Manufaktur",
    tagline: "Produkt-Microsite mit maßgeschneiderter Motion.",
    url: "https://example.net",
    fallbackImage: undefined,
    testimonial: {
      kind: "video",
      src: "/testimonials/placeholder.mp4",
      poster: undefined,
      authorName: "Elena Costa",
      authorRole: "Kreativdirektorin, Pionier Manufaktur",
    },
  },
];
