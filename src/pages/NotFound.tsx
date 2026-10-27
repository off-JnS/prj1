import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FadeIn, Reveal } from "@/components/ui/Reveal";
import Seo from "@/lib/seo";

export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center px-6 py-32 text-center">
      <Seo
        title="Seite nicht gefunden — PRJ1"
        description="Diese Seite existiert nicht. Zurück zur PRJ1-Startseite."
        noindex
      />
      <div className="mx-auto max-w-2xl">
        <p className="u-kicker justify-center">Fehler 404</p>
        <h1 className="u-display mt-6 text-[clamp(4rem,18vw,12rem)]">
          <Reveal>
            <em className="u-serif not-italic">Nichts.</em>
          </Reveal>
        </h1>
        <FadeIn delay={0.15}>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[var(--color-muted-foreground)]">
            Die aufgerufene Seite gibt es nicht — vielleicht wurde sie
            verschoben oder der Link ist veraltet. Schwarz auf weiß: hier ist
            nichts.
          </p>
          <Link
            to="/"
            className="group mt-10 inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--color-border)] px-8 text-sm font-medium transition-colors duration-300 hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
          >
            Zurück zur Startseite
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </FadeIn>
      </div>
    </main>
  );
}
