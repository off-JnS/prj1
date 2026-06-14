import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Infinite horizontal marquee. The track holds the content twice and the CSS
 * animation translates it by -50%, so the loop is seamless at any width.
 */
export default function Marquee({
  children,
  duration = 28,
  reverse = false,
  className,
  trackClassName,
}: {
  children: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  trackClassName?: string;
}) {
  return (
    <div className={cn("overflow-hidden", className)} aria-hidden="true">
      <div
        className={cn("flex w-max animate-marquee", trackClassName)}
        style={{
          ["--marquee-duration" as string]: `${duration}s`,
          animationDirection: reverse ? "reverse" : undefined,
        }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
      </div>
    </div>
  );
}
