import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProjectCard from "@/components/portfolio/ProjectCard";
import { FadeIn, Kicker, Reveal } from "@/components/ui/Reveal";
import { projects } from "@/data/projects";
import Seo from "@/lib/seo";

export default function Portfolio() {
  return (
    <main className="px-6 pb-32 pt-36 sm:px-10 sm:pt-44">
      <Seo
        title="Portfolio — PRJ1"
        description="Ausgewählte Webdesign-Projekte von PRJ1 — Markenwebsites mit Fokus auf Wirkung, Technik und messbare Resultate."
        path="/portfolio"
      />

      <header className="mx-auto max-w-7xl">
        <Kicker>Portfolio</Kicker>
        <h1 className="u-display mt-6 text-[clamp(2.8rem,9vw,7.5rem)]">
          <Reveal>Arbeit, die ihren</Reveal>
          <Reveal delay={0.1}>
            Platz <em className="u-serif not-italic">verdient.</em>
          </Reveal>
        </h1>
        <FadeIn delay={0.25}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-[var(--color-muted-foreground)] sm:text-lg">
            Ausgewählte Projekte mit Fokus auf Wirkung, Technik und Resultate —
            und die Stimmen der Menschen, für die wir sie gebaut haben.
          </p>
        </FadeIn>
      </header>

      <div className="mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-20 sm:mt-28 sm:gap-28">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
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
