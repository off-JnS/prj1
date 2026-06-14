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
    id: "ehsos-burger",
    name: "Ehso's Burger",
    tagline: "Markenauftritt und Online-Präsenz für einen Burger-Laden mit Charakter.",
    url: "https://ehsos-burger.de",
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
    name: "Café Literarität",
    tagline: "Markenwebsite für ein Literatur-Café mit warmer, einladender Handschrift.",
    url: "https://cafeliteraritat.netlify.app/",
    testimonial: {
      kind: "text",
      quote:
        "Unsere Website fühlt sich jetzt genauso gemütlich an wie das Café selbst — ruhig, einladend und unverwechselbar. Seit dem Launch kommen spürbar mehr Gäste über die Seite zu uns.",
      authorName: "Mara Iversen",
      authorRole: "Inhaberin, Café Literarität",
    },
  },
  {
    id: "prj1",
    name: "PRJ1",
    tagline: "Unsere eigene Website — gebaut mit denselben Standards, die wir für unsere Kunden anlegen.",
    url: "https://prj1.de",
    testimonial: {
      kind: "video",
      // Add the video file at public/testimonials/prj1.mp4.
      src: "/testimonials/prj1.mp4",
      poster: "/og-image.jpg",
      authorName: "Elena Costa",
      authorRole: "Kreativdirektorin, Pionier Manufaktur",
    },
  },
];
