import { motion } from "framer-motion";
import ProjectCard from "@/components/portfolio/ProjectCard";
import { projects } from "@/data/projects";

export default function Portfolio() {
  return (
    <main className="px-6 pb-32 pt-40 sm:px-10">
      <header className="mx-auto max-w-7xl">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted-foreground)]"
        >
          Portfolio
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl"
        >
          Arbeit, die ihren
          <br />
          Platz verdient.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 max-w-2xl text-base text-[var(--color-muted-foreground)] sm:text-lg"
        >
          Bewege den Mauszeiger über eine Vorschau, um einen Blick auf die Live-Website
          zu werfen. Bewege ihn über ein Video-Testimonial, um den Ton einzuschalten
          und es in voller Farbe zu sehen.
        </motion.p>
      </header>

      <div className="mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-24">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </main>
  );
}
