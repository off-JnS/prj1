import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProjectRow from "@/components/portfolio/ProjectRow";
import { FadeIn, Kicker, Reveal } from "@/components/ui/Reveal";
import { projectsByTier, tiers } from "@/data/projects";
import Seo from "@/lib/seo";

const eur = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
});

export default function Portfolio() {
  return (
    <main className="px-6 pb-32 pt-36 sm:px-10 sm:pt-44">
      <Seo
        title="Portfolio — PRJ1"
        description="Neun Beispielprojekte von PRJ1 — vollständige Websites für fiktive Hamburger Betriebe, sortiert nach Paket. Sieh dir an, was Starter, Professional und Premium konkret liefern."
        path="/portfolio"
      />

      <header className="mx-auto max-w-7xl">
        <Kicker>Portfolio</Kicker>
        <h1 className="u-display mt-6 text-[clamp(2.8rem,9vw,7.5rem)]">
          <Reveal>Neun Websites.</Reveal>
          <Reveal delay={0.1}>
            Ein <em className="u-serif not-italic">Maßstab.</em>
          </Reveal>
        </h1>
        <FadeIn delay={0.25}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-[var(--color-muted-foreground)] sm:text-lg">
            Alles hier sind Beispielprojekte: fiktive Hamburger Betriebe, gebaut,
            um zu zeigen, was jedes Paket konkret liefert. Keine Mockups, keine
            Platzhalter — vollständige Websites, die du öffnen und durchklicken
            kannst.
          </p>
        </FadeIn>
      </header>

      <div className="mx-auto max-w-7xl">
        {tiers.map((tier, tierIndex) => (
          <section
            key={tier.id}
            aria-labelledby={`tier-${tier.id}`}
            className="mt-24 sm:mt-32"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Kicker index={String(tierIndex + 1).padStart(2, "0")}>Paket</Kicker>
                <h2
                  id={`tier-${tier.id}`}
                  className="u-display mt-6 text-[clamp(2.2rem,5.5vw,4rem)]"
                >
                  <Reveal>{tier.label}</Reveal>
                </h2>
                <FadeIn delay={0.12}>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-muted-foreground)] sm:text-base">
                    {tier.description}
                  </p>
                </FadeIn>
              </div>

              <FadeIn delay={0.2}>
                <Link
                  to="/preise"
                  className="group inline-flex min-h-11 items-center gap-2 border-b border-[var(--color-border)] pb-1 text-sm font-medium transition-colors hover:border-[var(--color-foreground)]"
                >
                  <span className="tabular-nums">{eur.format(tier.price)}</span>
                  <span className="text-[var(--color-muted-foreground)]">— zum Paket</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </FadeIn>
            </div>

            <div className="mt-12 sm:mt-16">
              {projectsByTier(tier.id).map((project, i) => (
                <ProjectRow key={project.id} project={project} index={i} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <FadeIn className="mx-auto mt-24 max-w-7xl border-t border-[var(--color-border)] pt-12 sm:mt-32">
        <p className="u-kicker">Dein Projekt fehlt hier noch?</p>
        <Link
          to="/kontakt"
          className="group mt-4 inline-flex items-center gap-3 text-2xl font-semibold tracking-tight transition-colors hover:text-[var(--color-muted-foreground)] sm:text-4xl"
        >
          Lass uns das ändern
          <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1 sm:h-8 sm:w-8" />
        </Link>
      </FadeIn>
    </main>
  );
}
