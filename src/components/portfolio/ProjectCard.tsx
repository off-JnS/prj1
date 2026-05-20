import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import IframePeek from "./IframePeek";
import TestimonialVideo from "./TestimonialVideo";
import TestimonialText from "./TestimonialText";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const reversed = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial={{ y: 80, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16"
    >
      {/* Peek window — desktop only */}
      <div className={`relative hidden lg:block lg:col-span-7 ${reversed ? "lg:order-2" : ""}`}>
        {/* gigantic background numeral */}
        <span
          aria-hidden
          className={`pointer-events-none absolute -top-6 select-none text-[6rem] font-black leading-none tracking-tighter text-white/[0.04] sm:-top-10 sm:text-[10rem] lg:text-[14rem] ${
            reversed ? "right-[-0.5rem] sm:right-[-1rem]" : "left-[-0.5rem] sm:left-[-1rem]"
          }`}
        >
          {number}
        </span>
        <IframePeek url={project.url} fallbackImage={project.fallbackImage} title={project.name} />
      </div>

      {/* Meta + testimonial column */}
      <div className={`flex flex-col gap-6 lg:col-span-5 ${reversed ? "lg:order-1" : ""}`}>
        <header>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--color-muted-foreground)]">
            <span className="font-mono">{number}</span>
            <span className="h-px w-8 bg-[var(--color-muted-foreground)]/40" />
            <span>Projekt</span>
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
            {project.name}
          </h2>
          {project.tagline && (
            <p className="mt-3 text-base text-[var(--color-muted-foreground)]">
              {project.tagline}
            </p>
          )}
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-foreground)] underline-offset-4 hover:underline"
          >
            Website öffnen <ArrowUpRight className="h-4 w-4" />
          </a>
        </header>

        <div className="mt-2">
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
    </motion.article>
  );
}
