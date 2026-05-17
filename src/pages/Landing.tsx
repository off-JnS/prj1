import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Layout, Globe, Wand2 } from "lucide-react";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { projects, type Project } from "@/data/projects";

const services = [
  {
    icon: Layout,
    title: "Markenwebsites",
    body: "One-Page- oder Multi-Page-Websites, die deine Marke in ein selbstbewusstes, fokussiertes Erlebnis verwandeln.",
  },
  {
    icon: Wand2,
    title: "Motion & Interaktion",
    body: "Maßgeschneiderte Animationen, Scroll-Choreografie und Mikrointeraktionen — nichts von der Stange.",
  },
  {
    icon: Globe,
    title: "Hosting & Domain",
    body: "Wir kümmern uns um alles: zuverlässiges Hosting, die passende Domain und ein reibungsloser Launch — damit du dich auf dein Business konzentrieren kannst.",
  },
  {
    icon: Sparkles,
    title: "Kreativdirektion",
    body: "Typografie, Layout und Tonalität — mit derselben Sorgfalt wie der Code, der sie rendert.",
  },
];

const processSteps = [
  { n: "01", title: "Entdeckung", body: "Wir tauchen ein in die Marke, die Zielgruppe und das, was Erfolg wirklich bedeutet." },
  { n: "02", title: "Richtung", body: "Stimmung, Typografie, Layout, Motion — wir definieren die visuelle Welt, bevor eine Zeile Code geschrieben wird." },
  { n: "03", title: "Umsetzung", body: "Handgefertigtes React + WebGL, optimiert für Geschwindigkeit, Barrierefreiheit und SEO." },
  { n: "04", title: "Launch", body: "Wir gehen live und arbeiten danach mit dir an Iterationen, damit deine Website weiter performt." },
];

function ProjectPreviewCard({ p, i }: { p: Project; i: number }) {
  const number = String(i + 1).padStart(2, "0");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Native load listener + fallback timer (handles iframes already loaded from cache)
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const markLoaded = () => setTimeout(() => setIframeLoaded(true), 300);
    iframe.addEventListener("load", markLoaded);
    // Fallback: declare ready after 2 s regardless (catches cached/fast loads)
    const fallback = setTimeout(() => setIframeLoaded(true), 2000);
    return () => {
      iframe.removeEventListener("load", markLoaded);
      clearTimeout(fallback);
    };
  }, []);

  const showLive = iframeLoaded && hovered;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        ref={containerRef}
        className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-black shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)] transition-shadow duration-500 group-hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,1)]"
      >
        {/* Live iframe — pointer events enabled when live so scroll works natively */}
        <div
          className={`absolute inset-0 origin-top-left ${showLive ? "" : "pointer-events-none"}`}
          style={{ transform: "scale(0.42)", width: "240%", height: "240%", zIndex: 0 }}
        >
          <iframe
            ref={iframeRef}
            src={p.url}
            title={p.name}
            className="h-full w-full border-0"
          />
        </div>

        {/* Screenshot — sits on top until iframe is ready AND hovered */}
        <img
          src={p.fallbackImage}
          alt={p.name}
          loading="lazy"
          className="absolute inset-0 z-10 h-full w-full object-cover object-top pointer-events-none pointer-fine:grayscale group-hover:grayscale-0 transition-all duration-700"
          style={{ opacity: showLive ? 0 : 1 }}
        />

        {/* Dim overlay */}
        <div className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-500 pointer-fine:bg-black/30 group-hover:opacity-0" />
        <span className="pointer-events-none absolute left-4 top-3 z-30 font-mono text-xs tracking-[0.3em] text-white/70">
          {number}
        </span>
        {/* "Live ansehen" button — opens full site in new tab */}
        <button
          onClick={(e) => { e.stopPropagation(); window.open(p.url, "_blank", "noreferrer"); }}
          className="absolute right-4 top-4 z-30 hidden translate-y-[-4px] cursor-pointer items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black opacity-0 transition-all duration-300 pointer-fine:inline-flex group-hover:translate-y-0 group-hover:opacity-100"
        >
          Live ansehen <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-5">
        <h3 className="text-lg font-semibold tracking-tight">{p.name}</h3>
        {p.tagline && (
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            {p.tagline}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function Landing() {
  return (
    <main className="relative">
      {/* HERO ------------------------------------------------------------ */}
      <section className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-black px-6 pb-20 pt-24 sm:pb-24 sm:pt-32">
        <WebGLShader />

        <div className="relative mx-auto w-full max-w-5xl text-center">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[11px] uppercase tracking-[0.3em] text-white mix-blend-difference sm:text-xs sm:tracking-[0.4em]"
          >
            PRJ1 — Webdesign Studio
          </motion.p>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-white mix-blend-difference text-[clamp(2.5rem,12vw,9rem)] font-black leading-[0.95] tracking-[-0.04em] sm:mt-6 sm:leading-[0.92]"
          >
            Design ist
            <br />
            alles.
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white mix-blend-difference sm:mt-6 sm:max-w-2xl sm:text-lg"
          >
            Websites, die sich bewegen, atmen und überzeugen. Strikt schwarz, strikt weiß,
            kompromisslos durchdacht — für Marken, die nicht aussehen wollen wie alle anderen.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-5 flex items-center justify-center gap-2 sm:mt-8"
          >
            <span className="relative inline-flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/80 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
            </span>
            <p className="text-[10px] uppercase tracking-widest text-white mix-blend-difference sm:text-xs">
              Verfügbar für neue Projekte
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4"
          >
            <Link to="/portfolio" className="w-full max-w-xs sm:w-auto sm:max-w-none">
              <LiquidButton size="xl" className="w-full border border-white/30 text-white sm:w-auto">
                Arbeiten ansehen
              </LiquidButton>
            </Link>
            <Link
              to="/pricing"
              className="group inline-flex items-center gap-2 text-sm text-white mix-blend-difference transition-colors"
            >
              Oder direkt zu den Preisen
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* scroll affordance */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white mix-blend-difference sm:bottom-8 sm:text-xs">
          Scrollen
        </div>
      </section>

      {/* SERVICES -------------------------------------------------------- */}
      <section className="section-invert relative z-10 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted-foreground)]">
              Was wir tun
            </span>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl">
              Vier Disziplinen.
              <br className="hidden sm:block" /> Ein Studio.
            </h2>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="group relative bg-[var(--color-background)] p-8 transition-colors hover:bg-[var(--color-muted)] sm:p-12"
                >
                  <Icon className="h-7 w-7 text-[var(--color-foreground)]" />
                  <h3 className="mt-6 text-2xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-3 max-w-md text-[var(--color-muted-foreground)]">{s.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED WORK --------------------------------------------------- */}
      <section className="relative px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
          >
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted-foreground)]">
                Ausgewählte Arbeiten
              </span>
              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Ein paar Websites, die wir gelauncht haben.
              </h2>
            </div>
            <Link
              to="/portfolio"
              className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--color-foreground)]"
            >
              Komplettes Portfolio ansehen
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {projects.slice(0, 3).map((p, i) => (
              <ProjectPreviewCard key={p.id} p={p} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS --------------------------------------------------------- */}
      <section className="section-invert relative px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted-foreground)]">
              Prozess
            </span>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Vom Briefing zum Launch in vier Zügen.
            </h2>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-[var(--color-background)] p-8"
              >
                <div className="text-sm font-mono tracking-widest text-[var(--color-muted-foreground)]">
                  {step.n}
                </div>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA ------------------------------------------------------------- */}
      <section className="relative overflow-hidden px-6 py-32 sm:py-40">
        <div className="mx-auto max-w-5xl text-center">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl"
          >
            Bereit, etwas zu bauen,
            <br />
            das man auch zeigen will?
          </motion.h2>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link to="/pricing">
              <LiquidButton size="xl" className="border border-white/30 text-white">
                Preise ansehen
              </LiquidButton>
            </Link>
            <a
              href="mailto:hello@prj1.studio"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-foreground)] underline-offset-4 hover:underline"
            >
              Oder schreib dem Studio
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
