/**
 * Central site configuration — every external value lives here so content
 * edits never require touching components.
 */
export const SITE = {
  name: "PRJ1",
  url: "https://prj1.de",
  claim: "Design ist alles.",
  email: "kontakt@prj1.de",
  phone: "+49 176 86765197",
  phoneHref: "tel:+4917686765197",
  address: {
    street: "Jan-Külper-Weg 8d",
    zip: "22547",
    city: "Hamburg",
    country: "Deutschland",
  },
  founder: "João Nogueira e Silva",

  /** Google Analytics — only loaded after explicit consent (see ConsentBanner). */
  gaId: "G-XSV6Q5784J",

  /**
   * Web3Forms access key for the contact form and the receipt's
   * "send to e-mail" (https://web3forms.com — free).
   * While empty, both fall back to a mailto: link.
   */
  web3formsKey: "",

  /**
   * Stripe publishable key (`pk_live_…`). Required for the Buy Button embeds
   * in the pricing cards; the per-plan button IDs live in src/data/plans.ts.
   * While empty, the cards keep their plain link/mailto buttons.
   */
  stripePublishableKey: "",
} as const;

export const NAV_LINKS = [
  { label: "Start", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Studio", href: "/studio" },
  { label: "Preise", href: "/preise" },
  { label: "Kontakt", href: "/kontakt" },
] as const;

export const LEGAL_LINKS = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
] as const;
