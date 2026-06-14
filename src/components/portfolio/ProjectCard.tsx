import { ArrowUpRight } from "lucide-react";
import TestimonialVideo from "./TestimonialVideo";
import TestimonialText from "./TestimonialText";
import { FadeIn } from "@/components/ui/Reveal";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

/** Editorial case row: index header, oversized title, testimonial as proof. */
export default function ProjectCard({ project, index }: ProjectCardProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <FadeIn y={56}>
      <article className="border-t border-[var(--color-border)] pt-10 sm:pt-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <header className="flex flex-col items-start">
            <div className="u-kicker flex items-center gap-3">
              <span aria-hidden="true">({number})</span>
              <span aria-hidden="true" className="h-px w-8 bg-[var(--color-border)]" />
              <span>Projekt</span>
            </div>
            <h2 className="u-display mt-6 text-[clamp(2.4rem,6vw,5rem)]">{project.name}</h2>
            {project.tagline && (
              <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--color-muted-foreground)]">
                {project.tagline}
              </p>
            )}
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-border)] px-6 text-sm font-medium transition-colors duration-300 hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
            >
              Website öffnen
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </header>

          <div>
            {project.testimonial.kind === "video" ? (
              <TestimonialVideo
                src={project.testimonial.src}
                poster={project.testimonial.poster}
                authorName={project.testimonial.authorName}
                authorRole={project.testimonial.authorRole}
              />
            ) : (
              <TestimonialText
                quote={project.testimonial.quote}
                authorName={project.testimonial.authorName}
                authorRole={project.testimonial.authorRole}
              />
            )}
          </div>
        </div>
      </article>
    </FadeIn>
  );
}
