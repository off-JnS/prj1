import { motion } from "framer-motion";
import { PricingSection } from "@/components/ui/pricing";
import { plans } from "@/data/plans";

export default function Pricing() {
  return (
    <main className="relative pt-28">
      <header className="mx-auto max-w-7xl px-6 pb-8 pt-12 sm:px-10">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted-foreground)]"
        >
          Preise
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl"
        >
          Was es kostet,
          <br />
          so gut auszusehen.
        </motion.h1>
      </header>

      <PricingSection
        plans={plans}
        title="Pakete für echte Projekte"
        description={"Jedes Paket ist handgemacht — keine Themes, keine Templates.\nWechsle auf jährliche Zahlung und spare 20 %."}
      />
    </main>
  );
}
