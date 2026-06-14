import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ScrubText from "@/components/fx/ScrubText";
import { FadeIn, Kicker, Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/config/site";
import Seo, { JsonLd } from "@/lib/seo";

const principles = [
  {
    n: "01",
    title: "Reduktion",
    body: "Alles, was nicht trägt, fliegt raus. Was bleibt, bekommt Raum, Rhythmus und Gewicht — Schwarz und Weiß zwingen uns zu Entscheidungen.",
  },
  {
    n: "02",
    title: "Handarbeit",
    body: "Kein Theme, kein Baukasten, kein Plugin-Friedhof. Jede Zeile Code und jede Kurve einer Animation entsteht für genau ein Projekt: deins.",
  },
  {
    n: "03",
    title: "Tempo",
    body: "Schöne Websites, die langsam laden, sind kaputte Websites. Performance ist bei uns kein Nachtrag, sondern Teil des Designs.",
  },
  {
    n: "04",
    title: "Verantwortung",
    body: "Ein Ansprechpartner, klare Aussagen, ehrliche Einschätzungen. Wenn etwas nicht sinnvoll ist, sagen wir es — bevor es Geld kostet.",
  },
];

const stats = [
  { value: "0", label: "Templates" },
  { value: "100 %", label: "Handarbeit" },
  { value: "1", label: "Ansprechpartner" },
  { value: "∞", label: "Sorgfalt" },
];

export default function Studio() {
  return (
    <main className="relative pb-0 pt-36 sm:pt-44">
      <Seo
        title="Studio — PRJ1"
        description="PRJ1 ist ein Webdesign-Studio aus Hamburg, gegründet von João Nogueira e Silva. Strikt schwarz-weiß, kompromisslos handgemacht."
        path="/studio"
      />
      <JsonLd
        data={{
          "@type": "AboutPage",
          name: "Studio — PRJ1",
          url: `${SITE.url}/studio`,
          about: {
            "@type": "ProfessionalService",
            name: SITE.name,
            founder: { "@type": "Person", name: SITE.founder },
            address: {
              "@type": "PostalAddress",
              addressLocality: SITE.address.city,
              postalCode: SITE.address.zip,
              addressCountry: "DE",
            },
          },
        }}
      />

      <header className="mx-auto max-w-7xl px-6 sm:px-10">
        <Kicker>Studio</Kicker>
        <h1 className="u-display mt-6 text-[clamp(2.8rem,9vw,7.5rem)]">
          <Reveal>Ein Studio.</Reveal>
          <Reveal delay={0.1}>
            Eine <em className="u-serif not-italic">Haltung.</em>
          </Reveal>
        </h1>
        <FadeIn delay={0.25}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-[var(--color-muted-foreground)] sm:text-lg">
            PRJ1 ist ein unabhängiges Webdesign-Studio aus Hamburg. Wir bauen
            Websites für Marken, die nicht aussehen wollen wie alle anderen —
            und nehmen dafür bewusst weniger Projekte an, nicht mehr.
          </p>
        </FadeIn>
      </header>

      {/* Stats ---------------------------------------------------------- */}
      <section className="mx-auto mt-20 max-w-7xl px-6 sm:mt-28 sm:px-10" aria-label="Studio in Zahlen">
        <div className="grid grid-cols-2 border-y border-[var(--color-border)] lg:grid-cols-4">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.06} className="border-[var(--color-border)] p-8 odd:border-r sm:p-10 lg:border-r lg:last:border-r-0">
              <div className="u-display text-5xl tabular-nums sm:text-6xl">{stat.value}</div>
              <div className="u-kicker mt-3">{stat.label}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Principles ------------------------------------------------------ */}
      <section className="section-invert mt-28 px-6 py-28 sm:mt-40 sm:px-10 sm:py-40" aria-label="Prinzipien">
        <div className="mx-auto max-w-7xl">
          <Kicker index="01">Prinzipien</Kicker>
          <h2 className="u-display mt-6 text-[clamp(2.4rem,6.5vw,5.5rem)]">
            <Reveal>Woran wir uns</Reveal>
            <Reveal delay={0.08}>
              messen <em className="u-serif not-italic">lassen.</em>
            </Reveal>
          </h2>

          <div className="mt-16 sm:mt-24">
            {principles.map((p, i) => (
              <FadeIn key={p.n} delay={i * 0.05} y={36}>
                <div className="grid grid-cols-1 gap-3 border-t border-[var(--color-border)] py-8 last:border-b sm:grid-cols-[5rem_1fr_1fr] sm:items-baseline sm:gap-8 sm:py-10">
                  <span className="font-mono text-xs tracking-[0.3em] text-[var(--color-muted-foreground)]">
                    ({p.n})
                  </span>
                  <h3 className="u-display text-2xl sm:text-4xl">{p.title}</h3>
                  <p className="max-w-md text-sm leading-relaxed text-[var(--color-muted-foreground)] sm:text-base">
                    {p.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Founder ---------------------------------------------------------- */}
      <section className="bg-black px-6 py-28 text-white sm:px-10 sm:py-40" aria-label="Gründer">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <FadeIn>
            <div className="flex aspect-square w-full max-w-sm items-center justify-center rounded-3xl border border-white/15 bg-[var(--color-card)]">
              <span className="u-display text-[clamp(4rem,10vw,8rem)] text-white/90" aria-hidden="true">
                JN
              </span>
            </div>
          </FadeIn>
          <div>
            <Kicker index="02">Gründer</Kicker>
            <h2 className="u-display mt-6 text-[clamp(2rem,5vw,4rem)]">
              <Reveal>{SITE.founder}</Reveal>
            </h2>
            <FadeIn delay={0.15}>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                Designer und Entwickler in einer Person — deshalb gibt es bei
                PRJ1 keine Übergabeverluste zwischen Entwurf und Code. Was im
                Design entschieden wird, kommt genau so im Browser an: jede
                Animation, jeder Abstand, jedes Detail.
              </p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                Gearbeitet wird aus {SITE.address.city} — für Kunden, denen ihre
                digitale Präsenz nicht egal ist.
              </p>
            </FadeIn>
            <FadeIn delay={0.25} className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                to="/kontakt"
                className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-medium transition-colors duration-300 hover:bg-white hover:text-black"
              >
                Projekt anfragen
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={`mailto:${SITE.email}`}
                className="font-mono text-sm text-white/60 transition-colors hover:text-white"
              >
                {SITE.email}
              </a>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Closing statement ------------------------------------------------- */}
      <section className="section-invert px-6 py-32 sm:px-10 sm:py-48" aria-label="Statement">
        <div className="mx-auto max-w-5xl">
          <Kicker index="03">Warum schwarz-weiß?</Kicker>
          <ScrubText
            className="u-display mt-10 text-[clamp(1.9rem,4.6vw,3.9rem)] leading-[1.12]"
            text="Farbe ist leicht. Kontrast ist *schwer.* Wer ohne Farbe überzeugt, hat Typografie, Raum und Bewegung wirklich *verstanden.* Genau daran arbeiten wir — jeden Tag."
          />
        </div>
      </section>
    </main>
  );
}
