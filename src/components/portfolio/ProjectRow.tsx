import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/ui/Reveal";
import { tierLabel, type Project } from "@/data/projects";

interface ProjectRowProps {
  project: Project;
  index: number;
  /** Prefix the sector with the package name — used where rows mix tiers. */
  showTier?: boolean;
}

/**
 * Editorial hairline row: plate number, name, sector, tagline, arrow.
 * Opens the built example in a new tab — each one is a complete site of its
 * own, not a subpage of this one.
 */
export default function ProjectRow({ project, index, showTier }: ProjectRowProps) {
  const number = String(index + 1).padStart(2, "0");
  const overline = showTier
    ? `${tierLabel(project.tier)} · ${project.sector}`
    : project.sector;

  return (
    <FadeIn delay={index * 0.06} y={36}>
      <a
        href={project.url}
        target="_blank"
        rel="noreferrer noopener"
        className="group grid grid-cols-[2.5rem_1fr_2rem] items-center gap-4 border-t border-[var(--color-border)] py-8 last:border-b sm:grid-cols-[6rem_1fr_1fr_3rem] sm:gap-8 sm:py-10"
      >
        <span className="font-mono text-xs tracking-[0.3em] text-[var(--color-muted-foreground)]">
          ({number})
        </span>

        <div className="sm:contents">
          <div>
            <h3 className="u-display text-[clamp(1.8rem,4.5vw,3.25rem)] transition-transform duration-500 ease-out group-hover:translate-x-3">
              {project.name}
            </h3>
            <p className="u-kicker mt-2">{overline}</p>
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-muted-foreground)] sm:mt-0 sm:text-base">
            {project.tagline}
          </p>
        </div>

        <ArrowUpRight
          aria-hidden="true"
          className="h-6 w-6 text-[var(--color-muted-foreground)] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--color-foreground)] sm:h-8 sm:w-8"
        />
      </a>
    </FadeIn>
  );
}
