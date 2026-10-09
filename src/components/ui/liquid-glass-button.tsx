import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { usePointerFine } from "@/hooks/useMediaQuery";

const liquidButtonVariants = cva(
  "relative inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-transform duration-300 hover:scale-105 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
  {
    variants: {
      variant: {
        default: "bg-transparent text-[var(--color-foreground)]",
        invert: "bg-transparent text-[var(--color-background)]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 text-xs px-4",
        lg: "h-10 px-6",
        xl: "h-12 px-8",
        xxl: "h-14 px-10",
      },
    },
    defaultVariants: { variant: "default", size: "xxl" },
  },
);

export interface LiquidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof liquidButtonVariants> {
  asChild?: boolean;
}

export function LiquidButton({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: LiquidButtonProps) {
  const Comp = asChild ? Slot : "button";
  // The SVG displacement filter is unsupported in Safari/iOS and expensive
  // where it does work — touch devices get a plain frosted blur instead.
  const pointerFine = usePointerFine();
  const filterId = React.useId();

  return (
    <Comp
      data-slot="button"
      className={cn(liquidButtonVariants({ variant, size, className }))}
      {...props}
    >
      <span
        aria-hidden
        className="
          pointer-events-none absolute inset-0 z-0 rounded-full
          shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]
          transition-all
        "
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 isolate -z-10 overflow-hidden rounded-full",
          !pointerFine && "bg-white/[0.06] backdrop-blur-md",
        )}
        style={pointerFine ? { backdropFilter: `url(#${filterId})` } : undefined}
      />
      <span className="pointer-events-none relative z-10">{children}</span>
      {pointerFine && <GlassFilter id={filterId} />}
    </Comp>
  );
}

function GlassFilter({ id }: { id: string }) {
  return (
    <svg className="hidden" aria-hidden>
      <defs>
        <filter
          id={id}
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}
