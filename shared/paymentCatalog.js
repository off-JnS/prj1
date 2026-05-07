/**
 * Service catalog shared between the Cloudflare Worker and the frontend.
 * Prices are in the smallest currency unit (cents). EUR: 100000 = €1.000.
 * monthlyPrice: recurring hosting/maintenance fee (display only — billed separately).
 */
export const SERVICES = [
    {
        id: 'website',
        name: 'Website',
        tagline: 'Professionelle Online-Präsenz',
        price: 100000,          // €1.000 einmalig
        monthlyPrice: 2500,     // €25 / Monat Hosting
        currency: 'eur',
        description: 'Professionelle Website für Ihr Unternehmen',
        features: [
            'Individuelles Design',
            'Responsiv auf allen Geräten',
            'Kontaktformular',
            'SEO-Grundoptimierung',
            'Hosting inklusive (€25 / Monat)',
        ],
        highlighted: false,
        available: true,
        checkoutUrl: 'https://buy.stripe.com/9B65kD7EEdZG31L0kj3Ru00',
    },
    {
        id: 'software',
        name: 'Software',
        tagline: 'Maßgeschneiderte Softwarelösung',
        price: 500000,          // €5.000 einmalig
        monthlyPrice: 25000,    // €250 / Monat Hosting & Wartung
        currency: 'eur',
        description: 'Individuelle Softwareentwicklung für Ihr Business',
        features: [
            'Full-Stack Entwicklung',
            'Datenbankdesign & API',
            'Nutzerverwaltung & Authentifizierung',
            'Deployment & CI/CD-Setup',
            'Hosting & Wartung (€250 / Monat)',
        ],
        highlighted: true,
        available: false,
        checkoutUrl: null,
    },
    {
        id: 'branding',
        name: 'Branding',
        tagline: 'Ihre Markenidentität',
        price: 25000,           // €250 einmalig
        monthlyPrice: null,
        currency: 'eur',
        description: 'Professionelles Branding für Ihr Unternehmen',
        features: [
            'Logo-Design',
            'Farbpalette & Typografie',
            'Brand-Guidelines-Dokument',
            'Visitenkarten-Layout',
        ],
        highlighted: false,
        available: false,
        checkoutUrl: null,
    },
]
