import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { LEGAL_LINKS, NAV_LINKS, SITE } from "@/config/site";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import Magnetic from "@/components/ui/Magnetic";
import { FadeIn, Kicker, Reveal } from "@/components/ui/Reveal";

function useHamburgTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("de-DE", {
      timeZone: "Europe/Berlin",
      hour: "2-digit",
      minute: "2-digit",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export default function Footer() {
  const time = useHamburgTime();

  return (
    <footer className="relative z-20 overflow-hidden border-t border-[var(--color-border)] bg-black text-white">
      {/* Sitewide CTA ---------------------------------------------------- */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-24 sm:px-10 sm:pt-32">
        <Kicker>Nächster Schritt</Kicker>
        <h2 className="u-display mt-6 text-[clamp(2.6rem,7.5vw,6.5rem)]">
          <Reveal>Lass uns etwas bauen,</Reveal>
          <Reveal delay={0.08}>
            das man <em className="u-serif not-italic">zeigen</em> will.
          </Reveal>
        </h2>
        <FadeIn delay={0.2} className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Magnetic>
            <Link to="/kontakt">
              <LiquidButton size="xl" className="border border-white/30 text-white">
                Projekt starten
              </LiquidButton>
            </Link>
          </Magnetic>
          <a
            href={`mailto:${SITE.email}`}
            className="group inline-flex min-h-11 items-center gap-2 font-mono text-sm text-white/70 transition-colors hover:text-white"
          >
            {SITE.email}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </FadeIn>
      </div>

      {/* Link columns ---------------------------------------------------- */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 border-t border-white/10 px-6 py-14 sm:px-10 md:grid-cols-4">
        <div>
          <h3 className="u-kicker">Navigation</h3>
          <ul className="mt-4 space-y-1 text-sm text-white/70">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link className="inline-block py-1.5 transition-colors hover:text-white" to={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="u-kicker">Rechtliches</h3>
          <ul className="mt-4 space-y-1 text-sm text-white/70">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link className="inline-block py-1.5 transition-colors hover:text-white" to={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="u-kicker">Kontakt</h3>
          <ul className="mt-4 space-y-1 text-sm text-white/70">
            <li>
              <a className="inline-block py-1.5 transition-colors hover:text-white" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
            </li>
            <li>
              <a className="inline-block py-1.5 transition-colors hover:text-white" href={SITE.phoneHref}>
                {SITE.phone}
              </a>
            </li>
            <li className="py-1.5 text-white/65">
              {SITE.address.zip} {SITE.address.city}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="u-kicker">Studio</h3>
          <ul className="mt-4 space-y-1 text-sm text-white/70">
            <li className="flex items-center gap-2 py-1.5">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              Verfügbar für Projekte
            </li>
            <li className="py-1.5 font-mono tabular-nums text-white/65">
              Hamburg, DE {time && `— ${time} Uhr`}
            </li>
          </ul>
        </div>
      </div>

      {/* Watermark + meta row -------------------------------------------- */}
      <div
        aria-hidden="true"
        className="u-display pointer-events-none select-none whitespace-nowrap px-4 text-center text-[clamp(6rem,21vw,22rem)] leading-[0.78] text-white/[0.06]"
      >
        PRJ1<sup className="align-super text-[0.35em]">®</sup>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 border-t border-white/10 px-6 py-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 sm:flex-row sm:items-center sm:px-10">
        <span>© {new Date().getFullYear()} {SITE.name} — Alle Rechte vorbehalten</span>
        <span>Schwarz. Weiß. Sonst nichts.</span>
      </div>
    </footer>
  );
}
