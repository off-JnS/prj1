import { Link } from "react-router-dom";
import { m } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import TestimonialVideo from "./TestimonialVideo";
import TestimonialText from "./TestimonialText";
import { FadeIn } from "@/components/ui/Reveal";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

/**
 * Editorial case row: what it is (label + package), what it looks like
 * (screenshot), what the task was and what was built. Concept projects say
 * so up front; testimonials only render for real clients.
 *
 * The screenshot is its own layer above the page's paper texture (z-90), so
 * the previews show the sites as they are, without grain. It animates on its
 * own instead of inside FadeIn: a transformed/faded ancestor would trap it
 * in a stacking context below the texture.
 */
const EASE = [0.16, 1, 0.3, 1] as const;
export default function ProjectCard({ project, index }: ProjectCardProps) {
  const number = String(index + 1).padStart(2, "0");
  const { testimonial } = project;

  return (
    <article className="border-t border-[var(--color-border)] pt-10 sm:pt-14" aria-labelledby={`${project.id}-title`}>
      <FadeIn y={56}>
        <div className="u-kicker flex flex-wrap items-center gap-x-3 gap-y-2">
          <span aria-hidden="true">({number})</span>
          <span aria-hidden="true" className="h-px w-8 bg-[var(--color-border)]" />
          <span>{project.concept ? "Konzeptprojekt" : "Kundenprojekt"}</span>
          <span aria-hidden="true">·</span>
          <span>Paket {project.plan}</span>
        </div>
      </FadeIn>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <m.a
          href={project.url}
          target="_blank"
          rel="noreferrer noopener"
          className="group relative z-[91] block"
          initial={{ opacity: 0, y: 56 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.8, ease: EASE }}
          aria-label={`${project.name} ansehen (öffnet in neuem Tab)`}
        >
          <figure className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
            {/* Browser chrome: makes it obvious this is a website. */}
            <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-[var(--color-border)] px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-[var(--color-border)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--color-border)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--color-border)]" />
            </div>
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={project.image}
                alt={project.imageAlt}
                width={1440}
                height={900}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </div>
          </figure>
          <span className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium">
            Website ansehen
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </m.a>

        <FadeIn y={56} delay={0.1} className="flex flex-col items-start">
          <h2 id={`${project.id}-title`} className="u-display text-[clamp(2.2rem,4.6vw,4rem)]">
            {project.name}
          </h2>
          <p className="u-kicker mt-4">{project.sector}</p>

          <h3 className="u-kicker mt-10 text-[var(--color-foreground)]">Aufgabe</h3>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-muted-foreground)]">{project.brief}</p>

          <h3 className="u-kicker mt-8 text-[var(--color-foreground)]">Umgesetzt</h3>
          <ul className="mt-3 w-full divide-y divide-[var(--color-border)] border-y border-[var(--color-border)] text-sm">
            {project.built.map((item) => (
              <li key={item} className="py-3 text-[var(--color-muted-foreground)]">
                {item}
              </li>
            ))}
          </ul>

          <Link
            to="/preise"
            className="group mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-border)] px-6 text-sm font-medium transition-colors duration-300 hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
          >
            Paket {project.plan} ansehen
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </FadeIn>
      </div>

      {testimonial && (
        <div className="mt-12 lg:ml-auto lg:max-w-xl">
          {testimonial.kind === "video" ? (
            <TestimonialVideo
              src={testimonial.src}
              poster={testimonial.poster}
              authorName={testimonial.authorName}
              authorRole={testimonial.authorRole}
            />
          ) : (
            <TestimonialText
              quote={testimonial.quote}
              authorName={testimonial.authorName}
              authorRole={testimonial.authorRole}
            />
          )}
        </div>
      )}
    </article>
  );
}
