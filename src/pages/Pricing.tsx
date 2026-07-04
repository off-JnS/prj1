import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { BuildCards, CareCards } from "@/components/pricing/PricingCards";
import { FadeIn, Kicker, Reveal } from "@/components/ui/Reveal";
import { buildPlans, carePlans, pricingFaq } from "@/data/plans";
import { SITE } from "@/config/site";
import Seo, { JsonLd } from "@/lib/seo";

export default function Pricing() {
  return (
    <main className="relative px-6 pb-32 pt-36 sm:px-10 sm:pt-44">
      <Seo
        title="Preise & Pakete — PRJ1"
        description="Webdesign zum Festpreis: Websites ab 1.000 €, Wartung ab 59 €/Monat. Handgemacht in Hamburg — ohne Themes, ohne Templates."
        path="/preise"
      />
      <JsonLd
        data={{
          "@type": "FAQPage",
          mainEntity: pricingFaq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
      <JsonLd
        data={{
          "@type": "Service",
          name: "Webdesign — PRJ1",
          provider: { "@type": "ProfessionalService", name: SITE.name, url: SITE.url },
          areaServed: "DE",
          offers: [...buildPlans, ...carePlans].map((plan) => ({
            "@type": "Offer",
            name: plan.name,
            price: plan.price,
            priceCurrency: "EUR",
          })),
        }}
      />

      <header className="mx-auto max-w-7xl">
        <Kicker>Preise</Kicker>
        <h1 className="u-display mt-6 text-[clamp(2.8rem,9vw,7.5rem)]">
          <Reveal>Was es kostet, so</Reveal>
          <Reveal delay={0.1}>
            gut <em className="u-serif not-italic">auszusehen.</em>
          </Reveal>
        </h1>
        <FadeIn delay={0.25}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-[var(--color-muted-foreground)] sm:text-lg">
            Einmal zahlen, launchen, fertig — alles handgemacht, keine Templates.
            Um den Betrieb kümmert sich danach ein Wartungspaket.
          </p>
        </FadeIn>
      </header>

      {/* Website builds ------------------------------------------------------ */}
      <section className="mx-auto mt-20 max-w-7xl sm:mt-28" aria-label="Website-Pakete">
        <BuildCards plans={buildPlans} />
      </section>

      {/* Maintenance retainers ----------------------------------------------- */}
      <section className="mx-auto mt-28 max-w-7xl sm:mt-40" aria-label="Wartung und Betrieb">
        <Kicker>Wartung & Betrieb</Kicker>
        <h2 className="u-display mt-6 text-[clamp(2rem,5vw,3.8rem)]">
          <Reveal>
            Wir halten sie <em className="u-serif not-italic">am Laufen.</em>
          </Reveal>
        </h2>
        <FadeIn delay={0.15}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-muted-foreground)]">
            Monatlich kündbar. Hosting und Domain immer inklusive.
          </p>
        </FadeIn>
        <div className="mt-12">
          <CareCards plans={carePlans} />
        </div>
      </section>

      {/* FAQ ---------------------------------------------------------------- */}
      <section className="mx-auto mt-28 max-w-4xl sm:mt-40" aria-label="Häufige Fragen">
        <Kicker>Häufige Fragen</Kicker>
        <h2 className="u-display mt-6 text-[clamp(2rem,5vw,3.8rem)]">
          <Reveal>
            Gut zu <em className="u-serif not-italic">wissen.</em>
          </Reveal>
        </h2>

        <div className="mt-12">
          {pricingFaq.map((item, i) => (
            <FadeIn key={item.q} delay={i * 0.04}>
              <details className="group border-t border-[var(--color-border)] last:border-b">
                <summary className="flex min-h-14 list-none items-center justify-between gap-6 py-5 text-base font-semibold tracking-tight transition-colors hover:text-[var(--color-muted-foreground)] sm:text-lg [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <Plus
                    aria-hidden="true"
                    className="h-5 w-5 flex-none transition-transform duration-300 group-open:rotate-45"
                  />
                </summary>
                <p className="max-w-2xl pb-6 text-sm leading-relaxed text-[var(--color-muted-foreground)] sm:text-base">
                  {item.a}
                </p>
              </details>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-16">
          <p className="u-kicker">Noch Fragen offen?</p>
          <Link
            to="/kontakt"
            className="group mt-4 inline-flex items-center gap-3 text-2xl font-semibold tracking-tight transition-colors hover:text-[var(--color-muted-foreground)] sm:text-3xl"
          >
            Schreib uns — wir antworten ehrlich
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </FadeIn>
      </section>
    </main>
  );
}
