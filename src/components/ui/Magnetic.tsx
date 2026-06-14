import { useRef, type ReactNode, type PointerEvent } from "react";
import { motion, useSpring } from "framer-motion";

/**
 * Magnetic hover wrapper: the child gently follows the pointer while hovered
 * and springs back on leave. No-ops on touch devices (no hover events fire).
 */
export default function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode;
  /** 0–1, how far the element follows the pointer. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const spring = { stiffness: 180, damping: 14, mass: 0.3 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
