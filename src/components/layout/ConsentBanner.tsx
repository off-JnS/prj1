import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getConsent, loadAnalytics, setConsent } from "@/lib/consent";

/**
 * Minimal DSGVO banner: analytics stay off until accepted. Re-opens via
 * resetConsent() on the Datenschutz page.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (consent === "granted") {
      loadAnalytics();
      return;
    }
    if (consent === null) {
      const id = window.setTimeout(() => setVisible(true), 1800);
      return () => window.clearTimeout(id);
    }
  }, []);

  const decide = (value: "granted" | "denied") => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 32, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 z-[95] max-w-sm rounded-2xl border border-white/15 bg-black/85 p-5 text-white shadow-2xl backdrop-blur-md sm:left-auto sm:right-6 sm:bottom-6"
          role="dialog"
          aria-label="Cookie-Einwilligung"
        >
          <p className="u-kicker text-white/60">Cookies</p>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            Wir möchten Google Analytics nutzen, um zu verstehen, wie diese Website
            verwendet wird. Erst nach deiner Zustimmung werden Cookies gesetzt.{" "}
            <Link to="/datenschutz" className="underline underline-offset-2 hover:text-white">
              Mehr erfahren
            </Link>
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => decide("granted")}
              className="min-h-11 flex-1 rounded-full bg-white px-4 text-sm font-medium text-black transition-transform duration-200 hover:scale-[1.03] active:scale-95"
            >
              Akzeptieren
            </button>
            <button
              type="button"
              onClick={() => decide("denied")}
              className="min-h-11 flex-1 rounded-full border border-white/25 px-4 text-sm font-medium text-white/80 transition-colors duration-200 hover:border-white/60 hover:text-white"
            >
              Ablehnen
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
