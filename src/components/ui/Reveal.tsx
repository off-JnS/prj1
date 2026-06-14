import { type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Line-mask reveal: content rises out of an overflow-hidden wrapper.
 * Compose one <Reveal> per headline line for the editorial stagger.
 *
 * The in-view observer sits on the wrapper (never clipped) and drives the
 * inner span via variants — observing the translated child directly would
 * never fire, since it starts fully clipped by overflow-hidden.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 0.9,
  once = true,
  className,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  const inner: Variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.01 } },
      }
    : {
        hidden: { y: "110%" },
        show: { y: "0%", transition: { duration, delay, ease: EASE } },
      };

  return (
    <motion.span
      className={cn("block overflow-hidden", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-8% 0px" }}
    >
      <motion.span variants={inner} className="block will-change-transform">
        {children}
      </motion.span>
    </motion.span>
  );
}

/** Soft rise-and-fade for body copy, cards and UI clusters. */
export function FadeIn({
  children,
  delay = 0,
  y = 28,
  once = true,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-12% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Mono section label: "( 01 ) — Leistungen" style kicker. */
export function Kicker({
  index,
  children,
  className,
}: {
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <FadeIn y={16} className={cn("u-kicker flex items-center gap-3", className)}>
      {index && <span aria-hidden="true">({index})</span>}
      <span aria-hidden="true" className="h-px w-8 bg-[var(--color-border)]" />
      <span>{children}</span>
    </FadeIn>
  );
}
