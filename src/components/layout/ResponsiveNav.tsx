import { useMediaQuery } from "@/hooks/useMediaQuery";
import CardNav from "@/components/nav/CardNav";
import StaggeredMenu from "@/components/nav/StaggeredMenu";

const LOGO = "/logo/PRJ1-White.png";

const desktopItems = [
  {
    label: "Studio",
    bgColor: "#0a0a0a",
    textColor: "#ffffff",
    links: [
      { label: "Über uns", href: "/", ariaLabel: "Über PRJ1" },
      { label: "Prozess", href: "/", ariaLabel: "Unser Prozess" },
      { label: "Kontakt", href: "mailto:hello@prj1.studio", ariaLabel: "PRJ1 per E-Mail kontaktieren" },
    ],
  },
  {
    label: "Arbeiten",
    bgColor: "#111111",
    textColor: "#ffffff",
    links: [
      { label: "Portfolio", href: "/portfolio", ariaLabel: "Portfolio ansehen" },
      { label: "Case Studies", href: "/portfolio", ariaLabel: "Case Studies" },
    ],
  },
  {
    label: "Preise",
    bgColor: "#181818",
    textColor: "#ffffff",
    links: [
      { label: "Pakete", href: "/pricing", ariaLabel: "Pakete ansehen" },
      { label: "Vergleichen", href: "/pricing", ariaLabel: "Pakete vergleichen" },
    ],
  },
];

const mobileItems = [
  { label: "Start", link: "/", ariaLabel: "Startseite" },
  { label: "Portfolio", link: "/portfolio", ariaLabel: "Portfolio" },
  { label: "Preise", link: "/pricing", ariaLabel: "Preise" },
  { label: "Kontakt", link: "mailto:hello@prj1.studio", ariaLabel: "Kontakt" },
];

const socials = [
  { label: "Instagram", link: "https://instagram.com" },
  { label: "Behance", link: "https://behance.net" },
  { label: "LinkedIn", link: "https://linkedin.com" },
];

export default function ResponsiveNav() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <CardNav
        logo={LOGO}
        logoAlt="PRJ1"
        items={desktopItems}
        baseColor="#000000"
        menuColor="#ffffff"
        buttonBgColor="#ffffff"
        buttonTextColor="#000000"
        ctaLabel="Projekt starten"
        ctaHref="/pricing"
      />
    );
  }

  return (
    <StaggeredMenu
      position="right"
      items={mobileItems}
      socialItems={socials}
      displaySocials
      displayItemNumbering
      logoUrl={LOGO}
      menuButtonColor="#ffffff"
      openMenuButtonColor="#000000"
      accentColor="#000000"
      changeMenuColorOnOpen
      colors={["#0a0a0a", "#1a1a1a"]}
    />
  );
}
