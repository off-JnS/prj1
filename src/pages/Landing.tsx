import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import HeroCanvas from "@/components/fx/HeroCanvas";
import ScrubText from "@/components/fx/ScrubText";
import Marquee from "@/components/ui/Marquee";
import Magnetic from "@/components/ui/Magnetic";
import ProjectRow from "@/components/portfolio/ProjectRow";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { FadeIn, Kicker, Reveal } from "@/components/ui/Reveal";
import { featuredProjects } from "@/data/projects";
import { useIntro } from "@/lib/intro";
import { scrollToElement } from "@/lib/smooth-scroll";
import Seo from "@/lib/seo";

const EASE = [0.16, 1, 0.3, 1] as const;

const services = [
  {
    n: "01",
    title: "Markenwebsites",
    body: "One-Page- oder Multi-Page-Websites, die deine Marke in ein fokussiertes Erlebnis verwandeln.",
  },
  {
    n: "02",
    title: "Motion & Interaktion",
    body: "Maßgeschneiderte Animationen, Scroll-Choreografie und Mikrointeraktionen — nichts von der Stange.",
  },
  {
    n: "03",
    title: "Hosting & Wartung",
    body: "Hosting, Domain, Updates und Monitoring — ab 59 € im Monat komplett abgedeckt.",
  },
  {
    n: "04",
    title: "Kreativdirektion",
    body: "Typografie, Layout und Tonalität — mit derselben Sorgfalt wie der Code, der sie rendert.",
  },
];

const processSteps = [
  { n: "01", title: "Entdeckung", body: "Wir tauchen ein in die Marke, die Zielgruppe und das, was Erfolg wirklich bedeutet." },
  { n: "02", title: "Richtung", body: "Stimmung, Typografie, Layout, Motion — wir definieren die visuelle Welt, bevor eine Zeile Code geschrieben wird." },
  { n: "03", title: "Umsetzung", body: "Handgefertigter Code, optimiert für Geschwindigkeit, Barrierefreiheit und SEO." },
  { n: "04", title: "Launch", body: "Wir gehen live und arbeiten danach mit dir an Iterationen, damit deine Website weiter performt." },
];

const marqueeWords = ["Webdesign", "Motion", "Branding", "SEO", "Hosting", "Kreativdirektion"];

/* Hero lines rise out of their masks once the preloader curtain lifts. */
const heroLine: Variants = {
  hidden: { y: "110%" },
  show: (delay: number) => ({
    y: "0%",
    transition: { duration: 1, delay, ease: EASE },
  }),
};

const heroFade: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

function Hero() {
  const { done } = useIntro();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const state = done ? "show" : "hidden";

  return (
    <section
      ref={ref}
      id="hero"
      className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-black px-6 pb-24 pt-28"
    >
      <HeroCanvas />
      {/* Scrim: keeps white copy legible where the light threads cross it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,rgba(0,0,0,0.62),rgba(0,0,0,0)_72%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-black"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-6xl text-center text-white"
      >
        <motion.p variants={heroFade} initial="hidden" animate={state} custom={0.05} className="u-kicker justify-center text-white/60">
          PRJ1 — Webdesign Studio, Hamburg
        </motion.p>

        <h1 className="u-display mt-6 text-[clamp(3.4rem,14vw,11.5rem)]">
          <span className="block overflow-hidden">
            <motion.span variants={heroLine} initial="hidden" animate={state} custom={0.15} className="block">
              Design ist
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span variants={heroLine} initial="hidden" animate={state} custom={0.27} className="block">
              <em className="u-serif not-italic">alles.</em>
            </motion.span>
          </span>
        </h1>

        <motion.p
          variants={heroFade}
          initial="hidden"
          animate={state}
          custom={0.5}
          className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/75 sm:max-w-2xl sm:text-lg"
        >
          Websites, die sich bewegen und überzeugen — strikt schwarz-weiß,
          für Marken, die nicht aussehen wollen wie alle anderen.
        </motion.p>

        <motion.div
          variants={heroFade}
          initial="hidden"
          animate={state}
          custom={0.62}
          className="mt-6 flex items-center justify-center gap-2"
        >
          <span className="relative inline-flex h-3 w-3 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.85)]" />
          </span>
          <p className="u-kicker text-white/70">Verfügbar für neue Projekte</p>
        </motion.div>

        <motion.div
          variants={heroFade}
          initial="hidden"
          animate={state}
          custom={0.74}
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row"
        >
          <Magnetic className="w-full max-w-xs sm:w-auto sm:max-w-none">
            <Link to="/portfolio" className="block">
              <LiquidButton size="xl" className="w-full border border-white/30 text-white sm:w-auto">
                Arbeiten ansehen
              </LiquidButton>
            </Link>
          </Magnetic>
          <Link
            to="/kontakt"
            className="group inline-flex min-h-11 items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
          >
            Oder direkt anfragen
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        variants={heroFade}
        initial="hidden"
        animate={state}
        custom={1}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:bottom-8"
      >
        <span className="u-kicker text-white/70">Scrollen</span>
      </motion.div>
    </section>
  );
}

export default function Landing() {
  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1));
      if (el) setTimeout(() => scrollToElement(el), 150);
    }
  }, []);

  return (
    <main className="relative">
      <Seo
        title="PRJ1 — Webdesign Studio aus Hamburg"
        description="PRJ1 gestaltet schwarz-weiße, animationsreiche Websites auf Award-Niveau — Markenwebsites, Motion und Kreativdirektion für Marken, die auffallen wollen."
        path="/"
      />

      <Hero />

      {/* MARQUEE ---------------------------------------------------------- */}
      <section aria-hidden="true" className="relative z-10 border-y border-[var(--color-border)] bg-black py-5 sm:py-7">
        <Marquee duration={26}>
          {marqueeWords.map((word) => (
            <span key={word} className="u-display flex items-center text-3xl uppercase text-white sm:text-5xl">
              <span className="px-6">{word}</span>
              <span className="u-serif text-2xl text-white/40 sm:text-4xl">✺</span>
            </span>
          ))}
        </Marquee>
      </section>

      {/* SERVICES --------------------------------------------------------- */}
      <section id="leistungen" className="section-invert relative z-10 px-6 py-28 sm:px-10 sm:py-40">
        <div className="mx-auto max-w-7xl">
          <Kicker index="01">Leistungen</Kicker>
          <h2 className="u-display mt-6 text-[clamp(2.4rem,6.5vw,5.5rem)]">
            <Reveal>Vier Disziplinen.</Reveal>
            <Reveal delay={0.08}>
              <em className="u-serif not-italic">Ein</em> Studio.
            </Reveal>
          </h2>

          <div className="mt-16 sm:mt-24">
            {services.map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.05} y={36}>
                <div className="group relative grid grid-cols-1 gap-3 border-t border-[var(--color-border)] py-8 transition-colors duration-300 last:border-b sm:grid-cols-[5rem_1fr_1fr_3rem] sm:items-center sm:gap-8 sm:py-10 sm:hover:bg-black sm:hover:text-white">
                  <span className="font-mono text-xs tracking-[0.3em] text-[var(--color-muted-foreground)] transition-colors duration-300 sm:group-hover:text-white/50 sm:pl-4">
                    ({s.n})
                  </span>
                  <h3 className="u-display text-2xl sm:text-4xl">{s.title}</h3>
                  <p className="max-w-md text-sm leading-relaxed text-[var(--color-muted-foreground)] transition-colors duration-300 sm:text-base sm:group-hover:text-white/70">
                    {s.body}
                  </p>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="hidden h-6 w-6 -translate-x-2 opacity-0 transition-all duration-300 sm:block sm:group-hover:translate-x-0 sm:group-hover:opacity-100 sm:mr-4"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SELECTED WORK ----------------------------------------------------- */}
      <section id="arbeiten" className="relative z-10 bg-black px-6 py-28 text-white sm:px-10 sm:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <Kicker index="02">Beispielprojekte</Kicker>
              <h2 className="u-display mt-6 text-[clamp(2.4rem,6.5vw,5.5rem)]">
                <Reveal>Was jedes Paket</Reveal>
                <Reveal delay={0.08}>
                  wirklich <em className="u-serif not-italic">liefert.</em>
                </Reveal>
              </h2>
              <FadeIn delay={0.16}>
                <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
                  Drei fiktive Hamburger Betriebe, von uns gebaut — je einer pro
                  Paket. Vollständige Websites zum Öffnen und Durchklicken,
                  keine Mockups.
                </p>
              </FadeIn>
            </div>
            <FadeIn delay={0.2}>
              <Link
                to="/portfolio"
                className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                Alle neun Beispiele
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </FadeIn>
          </div>

          <div className="mt-16 sm:mt-24">
            {featuredProjects.map((p, i) => (
              <ProjectRow key={p.id} project={p} index={i} showTier />
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO ---------------------------------------------------------- */}
      <section id="manifest" className="section-invert relative z-10 px-6 py-32 sm:px-10 sm:py-48">
        <div className="mx-auto max-w-5xl">
          <Kicker index="03">Haltung</Kicker>
          <ScrubText
            className="u-display mt-10 text-[clamp(1.9rem,4.6vw,3.9rem)] leading-[1.12]"
            text="Wir glauben nicht an Templates. Wir glauben an *Typografie,* an Rhythmus und an Reduktion. Schwarz und Weiß sind keine Einschränkung — sie sind eine *Haltung.* Jede Website, die unser Studio verlässt, ist von Hand gebaut. Pixel für Pixel."
          />
        </div>
      </section>

      {/* PROCESS ------------------------------------------------------------ */}
      <section id="prozess" className="relative z-10 bg-black px-6 py-28 text-white sm:px-10 sm:py-40">
        <div className="mx-auto max-w-7xl">
          <Kicker index="04">Prozess</Kicker>
          <h2 className="u-display mt-6 text-[clamp(2.4rem,6.5vw,5.5rem)]">
            <Reveal>
              Vom Briefing zum Launch — <em className="u-serif not-italic">in vier Zügen.</em>
            </Reveal>
          </h2>

          <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 sm:mt-24 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <FadeIn key={step.n} delay={i * 0.08} y={36}>
                <div className="border-t-2 border-white pt-6">
                  <span className="font-mono text-xs tracking-[0.3em] text-white/60">({step.n})</span>
                  <h3 className="u-display mt-4 text-2xl">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{step.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
