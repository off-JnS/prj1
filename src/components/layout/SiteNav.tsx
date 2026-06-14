import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type Variants,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { NAV_LINKS, LEGAL_LINKS, SITE } from "@/config/site";

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Unified site navigation.
 *
 * Bar: fixed, runs in mix-blend-difference so it renders white over dark
 * sections and flips to black over inverted (white) ones — no scroll-state
 * bookkeeping. It slips away on scroll-down and returns on scroll-up.
 *
 * Menu (below md): full-screen black overlay in the site's editorial voice —
 * giant masked link reveals, mono indices, meta row at the bottom.
 */
export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const menuId = useId();
  const { scrollY } = useScroll();

  // Hide on scroll down, reveal on scroll up. Never while the menu is open.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 160 && !open);
  });

  // Route change closes the menu.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes; scroll locks (Lenis + body) while open.
  useEffect(() => {
    if (!open) return;
    setHidden(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    window.__lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.__lenis?.start();
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const overlay: Variants = {
    closed: reduceMotion
      ? { opacity: 0, transition: { duration: 0.2 } }
      : { y: "-100%", transition: { duration: 0.6, ease: EASE, delay: 0.1 } },
    open: reduceMotion
      ? { opacity: 1, transition: { duration: 0.2 } }
      : { y: "0%", transition: { duration: 0.7, ease: EASE } },
  };

  const linkMask: Variants = {
    closed: { y: "115%", transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } },
    open: (i: number) => ({
      y: "0%",
      transition: { duration: 0.75, delay: 0.22 + i * 0.07, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  const metaFade: Variants = {
    closed: { opacity: 0, y: 16, transition: { duration: 0.2 } },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.25 + NAV_LINKS.length * 0.07, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <>
      {/* ---- Bar ------------------------------------------------------- */}
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-[80] mix-blend-difference"
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: EASE }}
      >
        <nav
          aria-label="Hauptnavigation"
          className="pointer-events-auto mx-auto flex max-w-[120rem] items-center justify-between px-5 py-4 text-white sm:px-10 sm:py-6"
        >
          <Link
            to="/"
            aria-label="PRJ1 – Startseite"
            onClick={() => setOpen(false)}
            className="u-display text-xl leading-none tracking-tight"
          >
            PRJ1<sup className="align-super text-[0.45em] font-normal">®</sup>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.filter((l) => l.href !== "/").map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    aria-current={active ? "page" : undefined}
                    className="group relative inline-flex min-h-11 items-center font-mono text-[12px] uppercase tracking-[0.18em]"
                  >
                    <span
                      aria-hidden="true"
                      className={`mr-2 inline-block h-1 w-1 rounded-full bg-white transition-all duration-300 ${
                        active ? "scale-100 opacity-100" : "scale-0 opacity-0"
                      }`}
                    />
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100 ${
                        active ? "hidden" : ""
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              to="/kontakt"
              className="hidden min-h-11 items-center rounded-full border border-white/40 px-6 font-mono text-[12px] uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-white hover:text-black md:inline-flex"
            >
              Projekt starten
            </Link>

            {/* Mobile toggle */}
            <button
              ref={toggleRef}
              type="button"
              aria-label={open ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-3.5 rounded-full border border-white/40 px-5 font-mono text-[12px] uppercase tracking-[0.18em] md:hidden"
            >
              <span className="-mr-1">{open ? "Schließen" : "Menü"}</span>
              <span className="relative block h-2.5 w-4" aria-hidden="true">
                <span
                  className={`absolute left-0 top-0 block h-px w-full bg-white transition-transform duration-300 ${
                    open ? "translate-y-[4.5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 block h-px w-full bg-white transition-transform duration-300 ${
                    open ? "-translate-y-[4.5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ---- Overlay menu (mobile) -------------------------------------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            key="menu"
            variants={overlay}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-[70] flex flex-col bg-black text-white md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menü"
          >
            <nav
              aria-label="Mobile Navigation"
              className="flex flex-1 flex-col justify-center px-6 pt-16"
            >
              <ul>
                {NAV_LINKS.map((link, i) => {
                  const active = pathname === link.href;
                  return (
                    <li key={link.href} className="overflow-hidden border-b border-white/10 last:border-b-0">
                      <motion.div custom={i} variants={linkMask} className="will-change-transform">
                        <Link
                          to={link.href}
                          aria-current={active ? "page" : undefined}
                          className="group flex min-h-14 items-center gap-4 py-3"
                        >
                          <span className="font-mono text-[11px] tracking-[0.3em] text-white/65">
                            ({String(i + 1).padStart(2, "0")})
                          </span>
                          <span
                            className={
                              active
                                ? "u-serif text-[clamp(2.4rem,9vw,3.5rem)] leading-none"
                                : "u-display text-[clamp(2.4rem,9vw,3.5rem)] leading-none"
                            }
                          >
                            {link.label}
                          </span>
                          <ArrowUpRight
                            aria-hidden="true"
                            className="ml-auto h-6 w-6 text-white/40 transition-transform duration-300 group-active:-translate-y-0.5 group-active:translate-x-0.5"
                          />
                        </Link>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <motion.div variants={metaFade} className="px-6 pb-8">
              <Link
                to="/kontakt"
                className="flex min-h-13 w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-black transition-transform duration-200 active:scale-[0.98]"
              >
                Projekt starten
              </Link>
              <div className="mt-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
                <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-white">
                  {SITE.email}
                </a>
                <span>Hamburg, DE</span>
              </div>
              <div className="mt-3 flex gap-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
                {LEGAL_LINKS.map((l) => (
                  <Link key={l.href} to={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
